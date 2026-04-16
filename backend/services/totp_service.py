"""
Two-Factor Authentication Service
TOTP Implementation with backup codes and recovery
"""

import pyotp
import qrcode
import io
import base64
from datetime import datetime, timedelta
from typing import Optional, Tuple, List
import secrets
import hashlib
from sqlalchemy.orm import Session

from database.models import User, TwoFactorAuth, BackupCode


class TOTPService:
    """Service for managing Two-Factor Authentication"""
    
    def __init__(self):
        self.issuer_name = "Predix"
        
    def generate_secret(self) -> str:
        """Generate a new TOTP secret for a user"""
        return pyotp.random_base32()
    
    def get_totp_uri(self, secret: str, user_email: str) -> str:
        """Generate TOTP provisioning URI for QR code"""
        totp = pyotp.TOTP(secret)
        return totp.provisioning_uri(
            name=user_email,
            issuer_name=self.issuer_name
        )
    
    def generate_qr_code(self, uri: str) -> str:
        """Generate QR code image as base64 string"""
        qr = qrcode.QRCode(version=1, box_size=10, border=5)
        qr.add_data(uri)
        qr.make(fit=True)
        
        img = qr.make_image(fill_color="black", back_color="white")
        
        # Convert to base64
        buffer = io.BytesIO()
        img.save(buffer, format='PNG')
        buffer.seek(0)
        img_base64 = base64.b64encode(buffer.getvalue()).decode()
        
        return f"data:image/png;base64,{img_base64}"
    
    def verify_token(self, secret: str, token: str) -> bool:
        """Verify a TOTP token against the secret"""
        totp = pyotp.TOTP(secret)
        return totp.verify(token, valid_window=1)  # Allow 30s window
    
    def generate_backup_codes(self, count: int = 10) -> List[str]:
        """Generate backup codes for account recovery"""
        codes = []
        for _ in range(count):
            # Generate 8-character alphanumeric code
            code = secrets.token_hex(4).upper()
            codes.append(f"{code[:4]}-{code[4:]}")
        return codes
    
    def hash_backup_code(self, code: str) -> str:
        """Hash backup code for secure storage"""
        return hashlib.sha256(code.encode()).hexdigest()
    
    async def enable_2fa(
        self, 
        db: Session, 
        user_id: int
    ) -> Tuple[str, str, List[str]]:
        """
        Enable 2FA for a user
        Returns: (secret, qr_code_base64, backup_codes)
        """
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            raise ValueError("User not found")
        
        # Generate secret
        secret = self.generate_secret()
        
        # Generate QR code
        uri = self.get_totp_uri(secret, user.email)
        qr_code = self.generate_qr_code(uri)
        
        # Generate backup codes
        backup_codes = self.generate_backup_codes()
        
        # Save to database
        two_fa = TwoFactorAuth(
            user_id=user_id,
            secret=secret,
            enabled=False,  # Will be enabled after first verification
            created_at=datetime.utcnow()
        )
        db.add(two_fa)
        
        # Save backup codes (hashed)
        for code in backup_codes:
            hashed_code = self.hash_backup_code(code)
            backup = BackupCode(
                user_id=user_id,
                code_hash=hashed_code,
                used=False,
                created_at=datetime.utcnow()
            )
            db.add(backup)
        
        db.commit()
        
        return secret, qr_code, backup_codes
    
    async def verify_and_enable_2fa(
        self,
        db: Session,
        user_id: int,
        token: str
    ) -> bool:
        """Verify setup token and enable 2FA"""
        two_fa = db.query(TwoFactorAuth).filter(
            TwoFactorAuth.user_id == user_id
        ).first()
        
        if not two_fa:
            raise ValueError("2FA not initialized")
        
        # Verify token
        if not self.verify_token(two_fa.secret, token):
            return False
        
        # Enable 2FA
        two_fa.enabled = True
        two_fa.verified_at = datetime.utcnow()
        db.commit()
        
        return True
    
    async def verify_login_token(
        self,
        db: Session,
        user_id: int,
        token: str
    ) -> bool:
        """Verify token during login"""
        two_fa = db.query(TwoFactorAuth).filter(
            TwoFactorAuth.user_id == user_id,
            TwoFactorAuth.enabled == True
        ).first()
        
        if not two_fa:
            return False
        
        return self.verify_token(two_fa.secret, token)
    
    async def verify_backup_code(
        self,
        db: Session,
        user_id: int,
        code: str
    ) -> bool:
        """Verify and consume a backup code"""
        code_hash = self.hash_backup_code(code)
        
        backup = db.query(BackupCode).filter(
            BackupCode.user_id == user_id,
            BackupCode.code_hash == code_hash,
            BackupCode.used == False
        ).first()
        
        if not backup:
            return False
        
        # Mark as used
        backup.used = True
        backup.used_at = datetime.utcnow()
        db.commit()
        
        return True
    
    async def disable_2fa(
        self,
        db: Session,
        user_id: int,
        password: str  # Require password for security
    ) -> bool:
        """Disable 2FA for a user"""
        # Verify password first (implement in auth service)
        
        two_fa = db.query(TwoFactorAuth).filter(
            TwoFactorAuth.user_id == user_id
        ).first()
        
        if two_fa:
            two_fa.enabled = False
            two_fa.disabled_at = datetime.utcnow()
            db.commit()
            return True
        
        return False
    
    async def regenerate_backup_codes(
        self,
        db: Session,
        user_id: int
    ) -> List[str]:
        """Regenerate backup codes (invalidate old ones)"""
        # Mark all existing codes as used
        db.query(BackupCode).filter(
            BackupCode.user_id == user_id
        ).update({"used": True, "used_at": datetime.utcnow()})
        
        # Generate new codes
        new_codes = self.generate_backup_codes()
        
        for code in new_codes:
            hashed_code = self.hash_backup_code(code)
            backup = BackupCode(
                user_id=user_id,
                code_hash=hashed_code,
                used=False,
                created_at=datetime.utcnow()
            )
            db.add(backup)
        
        db.commit()
        
        return new_codes
    
    def is_2fa_enabled(self, db: Session, user_id: int) -> bool:
        """Check if 2FA is enabled for user"""
        two_fa = db.query(TwoFactorAuth).filter(
            TwoFactorAuth.user_id == user_id,
            TwoFactorAuth.enabled == True
        ).first()
        
        return two_fa is not None


# Global instance
totp_service = TOTPService()
