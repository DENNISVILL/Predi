"""
Two-Factor Authentication API Routes
"""

from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional

from database.connection import get_db
from services.auth_service import get_current_user
from services.totp_service import totp_service
from database.models import User


router = APIRouter()


# Request/Response Models
class TOTPSetupResponse(BaseModel):
    secret: str
    qr_code: str
    backup_codes: List[str]
    message: str


class TOTPVerifyRequest(BaseModel):
    token: str


class TOTPEnableRequest(BaseModel):
    token: str


class TOTPLoginRequest(BaseModel):
    token: Optional[str] = None
    backup_code: Optional[str] = None


class BackupCodesResponse(BaseModel):
    backup_codes: List[str]
    message: str


class TwoFactorStatusResponse(BaseModel):
    enabled: bool
    verified_at: Optional[str] = None


# Routes
@router.post("/2fa/setup", response_model=TOTPSetupResponse)
async def setup_2fa(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Initialize 2FA setup for user
    Returns QR code and backup codes
    """
    try:
        # Check if already enabled
        if totp_service.is_2fa_enabled(db, current_user.id):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="2FA is already enabled. Disable it first to reset."
            )
        
        secret, qr_code, backup_codes = await totp_service.enable_2fa(
            db, current_user.id
        )
        
        return TOTPSetupResponse(
            secret=secret,
            qr_code=qr_code,
            backup_codes=backup_codes,
            message="Scan the QR code with your authenticator app (Google Authenticator, Authy, etc.)"
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error setting up 2FA: {str(e)}"
        )


@router.post("/2fa/verify")
async def verify_and_enable_2fa(
    request: TOTPEnableRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Verify setup token and enable 2FA
    """
    success = await totp_service.verify_and_enable_2fa(
        db, current_user.id, request.token
    )
    
    if not success:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid token. Please try again."
        )
    
    return {
        "message": "2FA enabled successfully!",
        "enabled": True
    }


@router.post("/2fa/verify-login")
async def verify_2fa_login(
    request: TOTPLoginRequest,
    user_id: int,  # From login flow
    req: Request,
    db: Session = Depends(get_db)
):
    """
    Verify 2FA token during login
    This endpoint is called after email/password verification
    """
    # Try TOTP token first
    if request.token:
        success = await totp_service.verify_login_token(
            db, user_id, request.token
        )
        
        if success:
            # Log successful attempt
            return {"message": "2FA verified", "success": True}
    
    # Try backup code if no token or token failed
    if request.backup_code:
        success = await totp_service.verify_backup_code(
            db, user_id, request.backup_code
        )
        
        if success:
            return {
                "message": "2FA verified with backup code",
                "success": True,
                "warning": "Backup code used. Consider regenerating codes."
            }
    
    # Both failed
    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid 2FA token or backup code"
    )


@router.delete("/2fa/disable")
async def disable_2fa(
    password: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Disable 2FA for user (requires password confirmation)
    """
    # TODO: Verify password with auth_service
    
    success = await totp_service.disable_2fa(
        db, current_user.id, password
    )
    
    if not success:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to disable 2FA"
        )
    
    return {"message": "2FA disabled successfully"}


@router.post("/2fa/regenerate-codes", response_model=BackupCodesResponse)
async def regenerate_backup_codes(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Regenerate backup codes (invalidates old ones)
    """
    if not totp_service.is_2fa_enabled(db, current_user.id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="2FA is not enabled"
        )
    
    new_codes = await totp_service.regenerate_backup_codes(
        db, current_user.id
    )
    
    return BackupCodesResponse(
        backup_codes=new_codes,
        message="New backup codes generated. Save them securely!"
    )


@router.get("/2fa/status", response_model=TwoFactorStatusResponse)
async def get_2fa_status(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Check if 2FA is enabled for current user
    """
    from database.models_2fa import TwoFactorAuth
    
    two_fa = db.query(TwoFactorAuth).filter(
        TwoFactorAuth.user_id == current_user.id,
        TwoFactorAuth.enabled == True
    ).first()
    
    if two_fa:
        return TwoFactorStatusResponse(
            enabled=True,
            verified_at=two_fa.verified_at.isoformat() if two_fa.verified_at else None
        )
    
    return TwoFactorStatusResponse(enabled=False)
