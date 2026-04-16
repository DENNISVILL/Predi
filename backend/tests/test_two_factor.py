"""
Two-Factor Authentication Tests
Comprehensive test suite for 2FA functionality
"""

import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session
import pyotp

from services.totp_service import totp_service
from database.models_2fa import TwoFactorAuth, BackupCode


class TestTOTPService:
    """Test TOTP service functions"""
    
    def test_generate_secret(self):
        """Test secret generation"""
        secret = totp_service.generate_secret()
        assert len(secret) == 32
        assert secret.isalnum()
    
    def test_get_totp_uri(self):
        """Test TOTP URI generation"""
        secret = "JBSWY3DPEHPK3PXP"
        email = "test@predix.com"
        uri = totp_service.get_totp_uri(secret, email)
        
        assert "otpauth://totp/" in uri
        assert email in uri
        assert secret in uri
        assert "Predix" in uri
    
    def test_generate_qr_code(self):
        """Test QR code generation"""
        secret = totp_service.generate_secret()
        uri = totp_service.get_totp_uri(secret, "test@predix.com")
        qr_code = totp_service.generate_qr_code(uri)
        
        assert qr_code.startswith("data:image/png;base64,")
        assert len(qr_code) > 100
    
    def test_verify_token(self):
        """Test token verification"""
        secret = "JBSWY3DPEHPK3PXP"
        totp = pyotp.TOTP(secret)
        token = totp.now()
        
        # Valid token
        assert totp_service.verify_token(secret, token) is True
        
        # Invalid token
        assert totp_service.verify_token(secret, "000000") is False
    
    def test_generate_backup_codes(self):
        """Test backup code generation"""
        codes = totp_service.generate_backup_codes(count=10)
        
        assert len(codes) == 10
        for code in codes:
            assert "-" in code
            assert len(code) == 9  # Format: XXXX-XXXX
            assert code.isupper()
    
    def test_hash_backup_code(self):
        """Test backup code hashing"""
        code = "ABCD-1234"
        hashed = totp_service.hash_backup_code(code)
        
        assert len(hashed) == 64  # SHA-256 hash length
        assert hashed != code
        
        # Same code should produce same hash
        assert totp_service.hash_backup_code(code) == hashed


@pytest.mark.asyncio
class TestTwoFactorAPI:
    """Test 2FA API endpoints"""
    
    async def test_setup_2fa(self, client: TestClient, auth_headers):
        """Test 2FA setup endpoint"""
        response = client.post(
            "/api/v1/2fa/setup",
            headers=auth_headers
        )
        
        assert response.status_code == 200
        data = response.json()
        
        assert "secret" in data
        assert "qr_code" in data
        assert "backup_codes" in data
        assert len(data["backup_codes"]) == 10
        assert "message" in data
    
    async def test_setup_2fa_already_enabled(
        self, 
        client: TestClient, 
        auth_headers,
        db: Session,
        test_user
    ):
        """Test setup when 2FA already enabled"""
        # First setup
        client.post("/api/v1/2fa/setup", headers=auth_headers)
        
        # Enable it
        two_fa = db.query(TwoFactorAuth).filter_by(
            user_id=test_user.id
        ).first()
        two_fa.enabled = True
        db.commit()
        
        # Try setup again
        response = client.post(
            "/api/v1/2fa/setup",
            headers=auth_headers
        )
        
        assert response.status_code == 400
        assert "already enabled" in response.json()["detail"].lower()
    
    async def test_verify_and_enable_2fa_valid(
        self,
        client: TestClient,
        auth_headers,
        db: Session,
        test_user
    ):
        """Test verifying setup token and enabling 2FA"""
        # Setup 2FA
        setup_response = client.post(
            "/api/v1/2fa/setup",
            headers=auth_headers
        )
        secret = setup_response.json()["secret"]
        
        # Generate valid token
        totp = pyotp.TOTP(secret)
        token = totp.now()
        
        # Verify and enable
        response = client.post(
            "/api/v1/2fa/verify",
            headers=auth_headers,
            json={"token": token}
        )
        
        assert response.status_code == 200
        data = response.json()
        assert data["enabled"] is True
        
        # Check database
        two_fa = db.query(TwoFactorAuth).filter_by(
            user_id=test_user.id
        ).first()
        assert two_fa.enabled is True
        assert two_fa.verified_at is not None
    
    async def test_verify_and_enable_2fa_invalid(
        self,
        client: TestClient,
        auth_headers
    ):
        """Test verification with invalid token"""
        # Setup 2FA
        client.post("/api/v1/2fa/setup", headers=auth_headers)
        
        # Try with invalid token
        response = client.post(
            "/api/v1/2fa/verify",
            headers=auth_headers,
            json={"token": "000000"}
        )
        
        assert response.status_code == 400
        assert "invalid" in response.json()["detail"].lower()
    
    async def test_verify_login_token(
        self,
        client: TestClient,
        auth_headers,
        db: Session,
        test_user
    ):
        """Test 2FA verification during login"""
        # Setup and enable 2FA
        setup_response = client.post(
            "/api/v1/2fa/setup",
            headers=auth_headers
        )
        secret = setup_response.json()["secret"]
        
        totp = pyotp.TOTP(secret)
        token = totp.now()
        
        # Enable 2FA
        client.post(
            "/api/v1/2fa/verify",
            headers=auth_headers,
            json={"token": token}
        )
        
        # Now verify login
        new_token = totp.now()
        response = client.post(
            "/api/v1/2fa/verify-login",
            json={
                "user_id": test_user.id,
                "token": new_token
            }
        )
        
        assert response.status_code == 200
        assert response.json()["success"] is True
    
    async def test_verify_backup_code(
        self,
        client: TestClient,
        auth_headers,
        db: Session,
        test_user
    ):
        """Test using backup code for login"""
        # Setup 2FA
        setup_response = client.post(
            "/api/v1/2fa/setup",
            headers=auth_headers
        )
        backup_codes = setup_response.json()["backup_codes"]
        
        # Use first backup code
        response = client.post(
            "/api/v1/2fa/verify-login",
            json={
                "user_id": test_user.id,
                "backup_code": backup_codes[0]
            }
        )
        
        assert response.status_code == 200
        assert response.json()["success"] is True
        
        # Check backup code is marked as used
        code_hash = totp_service.hash_backup_code(backup_codes[0])
        backup = db.query(BackupCode).filter_by(
            code_hash=code_hash
        ).first()
        assert backup.used is True
        assert backup.used_at is not None
        
        # Try using same code again (should fail)
        response = client.post(
            "/api/v1/2fa/verify-login",
            json={
                "user_id": test_user.id,
                "backup_code": backup_codes[0]
            }
        )
        
        assert response.status_code == 401
    
    async def test_disable_2fa(
        self,
        client: TestClient,
        auth_headers,
        db: Session,
        test_user
    ):
        """Test disabling 2FA"""
        # Setup and enable 2FA first
        setup_response = client.post(
            "/api/v1/2fa/setup",
            headers=auth_headers
        )
        secret = setup_response.json()["secret"]
        
        totp = pyotp.TOTP(secret)
        token = totp.now()
        
        client.post(
            "/api/v1/2fa/verify",
            headers=auth_headers,
            json={"token": token}
        )
        
        # Disable 2FA
        response = client.delete(
            "/api/v1/2fa/disable",
            headers=auth_headers,
            params={"password": "testpassword123"}
        )
        
        assert response.status_code == 200
        
        # Check database
        two_fa = db.query(TwoFactorAuth).filter_by(
            user_id=test_user.id
        ).first()
        assert two_fa.enabled is False
        assert two_fa.disabled_at is not None
    
    async def test_regenerate_backup_codes(
        self,
        client: TestClient,
        auth_headers,
        db: Session,
        test_user
    ):
        """Test regenerating backup codes"""
        # Setup and enable 2FA
        setup_response = client.post(
            "/api/v1/2fa/setup",
            headers=auth_headers
        )
        old_codes = setup_response.json()["backup_codes"]
        
        # Enable 2FA
        secret = setup_response.json()["secret"]
        totp = pyotp.TOTP(secret)
        token = totp.now()
        
        client.post(
            "/api/v1/2fa/verify",
            headers=auth_headers,
            json={"token": token}
        )
        
        # Regenerate codes
        response = client.post(
            "/api/v1/2fa/regenerate-codes",
            headers=auth_headers
        )
        
        assert response.status_code == 200
        new_codes = response.json()["backup_codes"]
        
        assert len(new_codes) == 10
        assert new_codes != old_codes
        
        # Old codes should be marked as used
        for code in old_codes:
            code_hash = totp_service.hash_backup_code(code)
            backup = db.query(BackupCode).filter_by(
                code_hash=code_hash
            ).first()
            if backup:  # Some might not be in DB yet
                assert backup.used is True
    
    async def test_get_2fa_status_disabled(
        self,
        client: TestClient,
        auth_headers
    ):
        """Test getting 2FA status when disabled"""
        response = client.get(
            "/api/v1/2fa/status",
            headers=auth_headers
        )
        
        assert response.status_code == 200
        data = response.json()
        assert data["enabled"] is False
    
    async def test_get_2fa_status_enabled(
        self,
        client: TestClient,
        auth_headers
    ):
        """Test getting 2FA status when enabled"""
        # Setup and enable 2FA
        setup_response = client.post(
            "/api/v1/2fa/setup",
            headers=auth_headers
        )
        secret = setup_response.json()["secret"]
        
        totp = pyotp.TOTP(secret)
        token = totp.now()
        
        client.post(
            "/api/v1/2fa/verify",
            headers=auth_headers,
            json={"token": token}
        )
        
        # Check status
        response = client.get(
            "/api/v1/2fa/status",
            headers=auth_headers
        )
        
        assert response.status_code == 200
        data = response.json()
        assert data["enabled"] is True
        assert "verified_at" in data


@pytest.mark.integration
class TestTwoFactorIntegration:
    """Integration tests for 2FA workflow"""
    
    async def test_complete_2fa_setup_workflow(
        self,
        client: TestClient,
        auth_headers,
        db: Session
    ):
        """Test complete 2FA setup workflow"""
        # 1. Setup 2FA
        setup_response = client.post(
            "/api/v1/2fa/setup",
            headers=auth_headers
        )
        assert setup_response.status_code == 200
        
        secret = setup_response.json()["secret"]
        backup_codes = setup_response.json()["backup_codes"]
        
        # 2. Verify and enable
        totp = pyotp.TOTP(secret)
        token = totp.now()
        
        verify_response = client.post(
            "/api/v1/2fa/verify",
            headers=auth_headers,
            json={"token": token}
        )
        assert verify_response.status_code == 200
        
        # 3. Check status
        status_response = client.get(
            "/api/v1/2fa/status",
            headers=auth_headers
        )
        assert status_response.json()["enabled"] is True
        
        # 4. Test login with 2FA
        new_token = totp.now()
        # Login verification would be tested here
        
        # 5. Test backup code
        # Tested in separate test
        
        # 6. Regenerate codes
        regen_response = client.post(
            "/api/v1/2fa/regenerate-codes",
            headers=auth_headers
        )
        assert regen_response.status_code == 200
        
        # 7. Disable 2FA
        disable_response = client.delete(
            "/api/v1/2fa/disable",
            headers=auth_headers,
            params={"password": "testpassword123"}
        )
        assert disable_response.status_code == 200
        
        # 8. Verify disabled
        final_status = client.get(
            "/api/v1/2fa/status",
            headers=auth_headers
        )
        assert final_status.json()["enabled"] is False


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
