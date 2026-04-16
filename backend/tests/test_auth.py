"""
Authentication Tests
Comprehensive test suite for authentication and authorization
"""

import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session
from datetime import datetime, timedelta

from services.auth_service import create_access_token, verify_password


@pytest.mark.unit
class TestAuthService:
    """Test authentication service functions"""
    
    def test_password_hashing(self):
        """Test password hashing and verification"""
        from services.auth_service import get_password_hash, verify_password
        
        password = "SecurePass123!"
        hashed = get_password_hash(password)
        
        assert hashed != password
        assert verify_password(password, hashed) is True
        assert verify_password("WrongPass", hashed) is False
    
    def test_create_access_token(self):
        """Test JWT token creation"""
        data = {"sub":1, "email": "test@predix.com"}
        token = create_access_token(data)
        
        assert isinstance(token, str)
        assert len(token) > 50
    
    def test_create_access_token_with_expiry(self):
        """Test token creation with custom expiry"""
        data = {"sub": "test@predix.com"}
        expires_delta = timedelta(minutes=15)
        token = create_access_token(data, expires_delta)
        
        assert isinstance(token, str)


@pytest.mark.integration
class TestAuthenticationAPI:
    """Test authentication API endpoints"""
    
    async def test_register_user(self, client: TestClient, sample_user_data):
        """Test user registration"""
        response = client.post(
            "/api/v1/users/register",
            json=sample_user_data
        )
        
        assert response.status_code == 201
        data = response.json()
        
        assert "id" in data
        assert data["email"] == sample_user_data["email"]
        assert data["username"] == sample_user_data["username"]
        assert "hashed_password" not in data  # Should not expose password
    
    async def test_register_duplicate_email(
        self,
        client: TestClient,
        test_user,
        sample_user_data
    ):
        """Test registration with duplicate email"""
        sample_user_data["email"] = test_user.email
        
        response = client.post(
            "/api/v1/users/register",
            json=sample_user_data
        )
        
        assert response.status_code == 400
        assert "already exists" in response.json()["detail"].lower()
    
    async def test_login_success(self, client: TestClient, test_user):
        """Test successful login"""
        response = client.post(
            "/api/v1/users/login",
            json={
                "email": "test@predix.com",
                "password": "testpassword123"
            }
        )
        
        assert response.status_code == 200
        data = response.json()
        
        assert "access_token" in data
        assert "refresh_token" in data
        assert "token_type" in data
        assert data["token_type"] == "bearer"
    
    async def test_login_invalid_email(self, client: TestClient):
        """Test login with invalid email"""
        response = client.post(
            "/api/v1/users/login",
            json={
                "email": "nonexistent@predix.com",
                "password": "password123"
            }
        )
        
        assert response.status_code == 401
        assert "incorrect" in response.json()["detail"].lower()
    
    async def test_login_invalid_password(self, client: TestClient, test_user):
        """Test login with invalid password"""
        response = client.post(
            "/api/v1/users/login",
            json={
                "email": "test@predix.com",
                "password": "wrongpassword"
            }
        )
        
        assert response.status_code == 401
        assert "incorrect" in response.json()["detail"].lower()
    
    async def test_get_current_user(self, client: TestClient, auth_headers, test_user):
        """Test getting current user profile"""
        response = client.get(
            "/api/v1/users/me",
            headers=auth_headers
        )
        
        assert response.status_code == 200
        data = response.json()
        
        assert data["email"] == test_user.email
        assert data["username"] == test_user.username
        assert "hashed_password" not in data
    
    async def test_get_current_user_unauthorized(self, client: TestClient):
        """Test getting user without authentication"""
        response = client.get("/api/v1/users/me")
        
        assert response.status_code == 401
    
    async def test_update_user_profile(
        self,
        client: TestClient,
        auth_headers
    ):
        """Test updating user profile"""
        response = client.put(
            "/api/v1/users/me",
            headers=auth_headers,
            json={
                "full_name": "Updated Name",
                "bio": "New bio"
            }
        )
        
        assert response.status_code == 200
        data = response.json()
        
        assert data["full_name"] == "Updated Name"
    
    async def test_change_password(
        self,
        client: TestClient,
        auth_headers,
        db: Session,
        test_user
    ):
        """Test password change"""
        response = client.post(
            "/api/v1/users/change-password",
            headers=auth_headers,
            json={
                "current_password": "testpassword123",
                "new_password": "NewSecurePass456!"
            }
        )
        
        assert response.status_code == 200
        
        # Try logging in with new password
        login_response = client.post(
            "/api/v1/users/login",
            json={
                "email": "test@predix.com",
                "password": "NewSecurePass456!"
            }
        )
        
        assert login_response.status_code == 200
    
    async def test_refresh_token(self, client: TestClient, test_user):
        """Test token refresh"""
        # Login first
        login_response = client.post(
            "/api/v1/users/login",
            json={
                "email": "test@predix.com",
                "password": "testpassword123"
            }
        )
        
        refresh_token = login_response.json()["refresh_token"]
        
        # Refresh token
        response = client.post(
            "/api/v1/users/refresh-token",
            json={"refresh_token": refresh_token}
        )
        
        assert response.status_code == 200
        data = response.json()
        
        assert "access_token" in data
        assert data["access_token"] != login_response.json()["access_token"]
    
    async def test_logout(self, client: TestClient, auth_headers):
        """Test logout"""
        response = client.post(
            "/api/v1/users/logout",
            headers=auth_headers
        )
        
        assert response.status_code == 200
        
        # Token should be invalidated  (if blacklist implemented)
        # Further requests with same token should fail


@pytest.mark.integration
class TestAuthorization:
    """Test role-based authorization"""
    
    async def test_admin_only_endpoint_as_user(
        self,
        client: TestClient,
        auth_headers
    ):
        """Test accessing admin endpoint as regular user"""
        response = client.get(
            "/api/v1/admin/users",
            headers=auth_headers
        )
        
        assert response.status_code == 403
    
    async def test_admin_only_endpoint_as_admin(
        self,
        client: TestClient,
        admin_headers
    ):
        """Test accessing admin endpoint as admin"""
        response = client.get(
            "/api/v1/admin/users",
            headers=admin_headers
        )
        
        assert response.status_code == 200


@pytest.mark.security
class TestSecurityFeatures:
    """Test security features"""
    
    async def test_sql_injection_prevention(self, client: TestClient):
        """Test SQL injection prevention"""
        malicious_email = "admin' OR '1'='1"
        
        response = client.post(
            "/api/v1/users/login",
            json={
                "email": malicious_email,
                "password": "password"
            }
        )
        
        # Should not succeed with SQL injection
        assert response.status_code == 401
    
    async def test_xss_prevention(
        self,
        client: TestClient,
        auth_headers
    ):
        """Test XSS attack prevention"""
        xss_payload = "<script>alert('XSS')</script>"
        
        response = client.put(
            "/api/v1/users/me",
            headers=auth_headers,
            json={"full_name": xss_payload}
        )
        
        # Should sanitize or escape
        data = response.json()
        assert "<script>" not in data["full_name"]


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
