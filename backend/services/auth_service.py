"""
Authentication Service for Predix Backend
JWT-based authentication with role-based access control
"""

from datetime import datetime, timedelta, timezone
from typing import Optional, Dict, Any
import jwt
from passlib.context import CryptContext
from fastapi import HTTPException, status, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
import secrets
import logging

from config.settings import settings, JWTConfig
from database.connection import get_db, CacheManager
from database.models import User, UserSession, UserRole

logger = logging.getLogger(__name__)

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# JWT security scheme
security = HTTPBearer()

class AuthService:
    """Authentication service with JWT and session management"""
    
    def __init__(self):
        self.jwt_config = JWTConfig.get_jwt_config()
        self.secret_key = self.jwt_config["secret_key"]
        self.algorithm = self.jwt_config["algorithm"]
        self.access_token_expire_minutes = self.jwt_config["access_token_expire_minutes"]
        self.refresh_token_expire_days = self.jwt_config["refresh_token_expire_days"]
    
    def hash_password(self, password: str) -> str:
        """Hash a password using bcrypt"""
        return pwd_context.hash(password)
    
    def verify_password(self, plain_password: str, hashed_password: str) -> bool:
        """Verify a password against its hash"""
        return pwd_context.verify(plain_password, hashed_password)
    
    def create_access_token(self, data: Dict[str, Any], expires_delta: Optional[timedelta] = None) -> str:
        """Create JWT access token"""
        to_encode = data.copy()
        
        if expires_delta:
            expire = datetime.now(timezone.utc) + expires_delta
        else:
            expire = datetime.now(timezone.utc) + timedelta(minutes=self.access_token_expire_minutes)
        
        to_encode.update({
            "exp": expire,
            "iat": datetime.now(timezone.utc),
            "type": "access",
            "jti": secrets.token_urlsafe(32)  # JWT ID for session tracking
        })
        
        encoded_jwt = jwt.encode(to_encode, self.secret_key, algorithm=self.algorithm)
        return encoded_jwt
    
    def create_refresh_token(self, data: Dict[str, Any]) -> str:
        """Create JWT refresh token"""
        to_encode = data.copy()
        expire = datetime.now(timezone.utc) + timedelta(days=self.refresh_token_expire_days)
        
        to_encode.update({
            "exp": expire,
            "iat": datetime.now(timezone.utc),
            "type": "refresh",
            "jti": secrets.token_urlsafe(32)
        })
        
        encoded_jwt = jwt.encode(to_encode, self.secret_key, algorithm=self.algorithm)
        return encoded_jwt
    
    def verify_token(self, token: str) -> Dict[str, Any]:
        """Verify and decode JWT token"""
        try:
            payload = jwt.decode(token, self.secret_key, algorithms=[self.algorithm])
            return payload
        except jwt.ExpiredSignatureError:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token has expired",
                headers={"WWW-Authenticate": "Bearer"},
            )
        except jwt.JWTError:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Could not validate credentials",
                headers={"WWW-Authenticate": "Bearer"},
            )
    
    async def authenticate_user(self, db: Session, email: str, password: str) -> Optional[User]:
        """Authenticate user with email and password"""
        user = db.query(User).filter(User.email == email).first()
        
        if not user:
            return None
        
        if not self.verify_password(password, user.hashed_password):
            return None
        
        if not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Inactive user account"
            )
        
        # Update last login
        user.last_login_at = datetime.now(timezone.utc)
        db.commit()
        
        return user
    
    async def create_user_session(self, db: Session, user: User, token_jti: str, 
                                 ip_address: str = None, user_agent: str = None) -> UserSession:
        """Create a new user session"""
        # Deactivate old sessions (optional: keep only N active sessions)
        old_sessions = db.query(UserSession).filter(
            UserSession.user_id == user.id,
            UserSession.is_active == True
        ).all()
        
        # Keep only the 5 most recent sessions
        if len(old_sessions) >= 5:
            for session in old_sessions[:-4]:
                session.is_active = False
        
        # Create new session
        session = UserSession(
            user_id=user.id,
            token_jti=token_jti,
            ip_address=ip_address,
            user_agent=user_agent,
            expires_at=datetime.now(timezone.utc) + timedelta(days=self.refresh_token_expire_days)
        )
        
        db.add(session)
        db.commit()
        db.refresh(session)
        
        return session
    
    async def invalidate_session(self, db: Session, token_jti: str):
        """Invalidate a user session"""
        session = db.query(UserSession).filter(UserSession.token_jti == token_jti).first()
        if session:
            session.is_active = False
            db.commit()
        
        # Also add to Redis blacklist
        await CacheManager.set(f"blacklist:{token_jti}", "true", expire=86400 * 7)  # 7 days
    
    async def is_token_blacklisted(self, token_jti: str) -> bool:
        """Check if token is blacklisted"""
        return await CacheManager.exists(f"blacklist:{token_jti}")
    
    async def get_current_user(self, db: Session, token: str) -> User:
        """Get current user from JWT token"""
        payload = self.verify_token(token)
        
        # Check token type
        if payload.get("type") != "access":
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token type"
            )
        
        # Check if token is blacklisted
        token_jti = payload.get("jti")
        if token_jti and await self.is_token_blacklisted(token_jti):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token has been revoked"
            )
        
        # Get user
        user_id = payload.get("sub")
        if user_id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Could not validate credentials"
            )
        
        user = db.query(User).filter(User.id == user_id).first()
        if user is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User not found"
            )
        
        if not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Inactive user"
            )
        
        return user
    
    def create_login_response(self, user: User, access_token: str, refresh_token: str) -> Dict[str, Any]:
        """Create standardized login response"""
        return {
            "access_token": access_token,
            "refresh_token": refresh_token,
            "token_type": "bearer",
            "expires_in": self.access_token_expire_minutes * 60,
            "user": {
                "id": user.id,
                "uuid": user.uuid,
                "email": user.email,
                "username": user.username,
                "full_name": user.full_name,
                "avatar_url": user.avatar_url,
                "role": user.role,
                "is_verified": user.is_verified,
                "current_plan": {
                    "id": user.current_plan.id if user.current_plan else None,
                    "name": user.current_plan.name if user.current_plan else "Free",
                    "features": user.current_plan.features if user.current_plan else {}
                }
            }
        }

# Global auth service instance
auth_service = AuthService()

# Dependency functions for FastAPI
async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
) -> User:
    """FastAPI dependency to get current authenticated user"""
    token = credentials.credentials
    return await auth_service.get_current_user(db, token)

async def get_current_active_user(current_user: User = Depends(get_current_user)) -> User:
    """FastAPI dependency to get current active user"""
    if not current_user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Inactive user"
        )
    return current_user

async def get_current_premium_user(current_user: User = Depends(get_current_active_user)) -> User:
    """FastAPI dependency to get current premium user"""
    if not current_user.is_premium:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Premium subscription required"
        )
    return current_user

async def get_current_admin_user(current_user: User = Depends(get_current_active_user)) -> User:
    """FastAPI dependency to get current admin user"""
    if not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )
    return current_user

# Optional authentication (for public endpoints that can benefit from user context)
async def get_optional_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(HTTPBearer(auto_error=False)),
    db: Session = Depends(get_db)
) -> Optional[User]:
    """FastAPI dependency to get current user if authenticated, None otherwise"""
    if not credentials:
        return None
    
    try:
        token = credentials.credentials
        return await auth_service.get_current_user(db, token)
    except HTTPException:
        return None

# Rate limiting decorator
class RateLimiter:
    """Rate limiting for authentication endpoints"""
    
    @staticmethod
    async def check_rate_limit(key: str, limit: int = 5, window: int = 300) -> bool:
        """Check if rate limit is exceeded"""
        current_count = await CacheManager.get(f"rate_limit:{key}")
        
        if current_count is None:
            await CacheManager.set(f"rate_limit:{key}", "1", expire=window)
            return True
        
        if int(current_count) >= limit:
            return False
        
        # Increment counter
        await CacheManager.set(f"rate_limit:{key}", str(int(current_count) + 1), expire=window)
        return True
    
    @staticmethod
    async def reset_rate_limit(key: str):
        """Reset rate limit for a key"""
        await CacheManager.delete(f"rate_limit:{key}")

# Password validation
class PasswordValidator:
    """Password strength validation"""
    
    @staticmethod
    def validate_password(password: str) -> Dict[str, Any]:
        """Validate password strength"""
        errors = []
        
        if len(password) < 8:
            errors.append("Password must be at least 8 characters long")
        
        if not any(c.isupper() for c in password):
            errors.append("Password must contain at least one uppercase letter")
        
        if not any(c.islower() for c in password):
            errors.append("Password must contain at least one lowercase letter")
        
        if not any(c.isdigit() for c in password):
            errors.append("Password must contain at least one number")
        
        # Check for common passwords
        common_passwords = ["password", "123456", "qwerty", "admin", "letmein"]
        if password.lower() in common_passwords:
            errors.append("Password is too common")
        
        return {
            "is_valid": len(errors) == 0,
            "errors": errors,
            "strength": "strong" if len(errors) == 0 else "weak"
        }

# Email validation
import re

class EmailValidator:
    """Email validation utilities"""
    
    @staticmethod
    def validate_email(email: str) -> bool:
        """Validate email format"""
        pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        return re.match(pattern, email) is not None
    
    @staticmethod
    def is_disposable_email(email: str) -> bool:
        """Check if email is from a disposable email provider"""
        disposable_domains = [
            "10minutemail.com", "tempmail.org", "guerrillamail.com",
            "mailinator.com", "throwaway.email"
        ]
        domain = email.split("@")[-1].lower()
        return domain in disposable_domains

# Export main components
__all__ = [
    "AuthService",
    "auth_service",
    "get_current_user",
    "get_current_active_user", 
    "get_current_premium_user",
    "get_current_admin_user",
    "get_optional_user",
    "RateLimiter",
    "PasswordValidator",
    "EmailValidator"
]
