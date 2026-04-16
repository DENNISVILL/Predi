"""
User Routes for Predix Backend
Authentication, registration, profile management
"""

from fastapi import APIRouter, Depends, HTTPException, status, Request
from fastapi.security import HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr, validator
from typing import Optional, Dict, Any
from datetime import datetime, timezone
import logging

from database.connection import get_db
from database.models import User, UserRole
from database.models_2fa import TwoFactorAuth, TwoFactorAttempt
from services.auth_service import (
    auth_service, get_current_user, get_current_active_user,
    RateLimiter, PasswordValidator, EmailValidator
)
from services.totp_service import totp_service

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/users")

# Pydantic models for request/response
class UserRegistration(BaseModel):
    email: EmailStr
    username: str
    password: str
    full_name: Optional[str] = None
    
    @validator('username')
    def validate_username(cls, v):
        if len(v) < 3 or len(v) > 50:
            raise ValueError('Username must be between 3 and 50 characters')
        if not v.replace('_', '').replace('-', '').isalnum():
            raise ValueError('Username can only contain letters, numbers, hyphens, and underscores')
        return v.lower()
    
    @validator('password')
    def validate_password(cls, v):
        validation = PasswordValidator.validate_password(v)
        if not validation["is_valid"]:
            raise ValueError(f"Password validation failed: {', '.join(validation['errors'])}")
        return v

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    bio: Optional[str] = None
    avatar_url: Optional[str] = None

class PasswordChange(BaseModel):
    current_password: str
    new_password: str
    
    @validator('new_password')
    def validate_new_password(cls, v):
        validation = PasswordValidator.validate_password(v)
        if not validation["is_valid"]:
            raise ValueError(f"Password validation failed: {', '.join(validation['errors'])}")
        return v

class PasswordReset(BaseModel):
    email: EmailStr

class UserResponse(BaseModel):
    id: int
    uuid: str
    email: str
    username: str
    full_name: Optional[str]
    avatar_url: Optional[str]
    bio: Optional[str]
    role: str
    is_active: bool
    is_verified: bool
    created_at: datetime
    last_login_at: Optional[datetime]
    
    class Config:
        from_attributes = True

# Authentication endpoints
@router.post("/register", response_model=Dict[str, Any])
async def register_user(
    user_data: UserRegistration,
    request: Request,
    db: Session = Depends(get_db)
):
    """Register a new user"""
    try:
        # Rate limiting
        client_ip = request.client.host
        if not await RateLimiter.check_rate_limit(f"register:{client_ip}", limit=5, window=3600):
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail="Too many registration attempts. Please try again later."
            )
        
        # Check if email already exists
        existing_user = db.query(User).filter(User.email == user_data.email).first()
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )
        
        # Check if username already exists
        existing_username = db.query(User).filter(User.username == user_data.username).first()
        if existing_username:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Username already taken"
            )
        
        # Validate email
        if not EmailValidator.validate_email(user_data.email):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid email format"
            )
        
        # Check for disposable email
        if EmailValidator.is_disposable_email(user_data.email):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Disposable email addresses are not allowed"
            )
        
        # Hash password
        hashed_password = auth_service.hash_password(user_data.password)
        
        # Create user
        new_user = User(
            email=user_data.email,
            username=user_data.username,
            hashed_password=hashed_password,
            full_name=user_data.full_name,
            role=UserRole.USER.value,
            is_active=True,
            is_verified=False  # Email verification required
        )
        
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        
        logger.info(f"New user registered: {new_user.email}")
        
        return {
            "message": "User registered successfully",
            "user": UserResponse.from_orm(new_user),
            "next_step": "Please check your email for verification instructions"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Registration failed: {e}")
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Registration failed"
        )

@router.post("/login")
async def login_user(
    user_credentials: UserLogin,
    request: Request,
    db: Session = Depends(get_db)
):
    """Authenticate user and return JWT tokens (with 2FA support)"""
    try:
        # Rate limiting
        client_ip = request.client.host
        if not await RateLimiter.check_rate_limit(f"login:{client_ip}", limit=10, window=900):
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail="Too many login attempts. Please try again later."
            )
        
        # Authenticate user
        user = await auth_service.authenticate_user(db, user_credentials.email, user_credentials.password)
        if not user:
            # Additional rate limiting for failed logins
            await RateLimiter.check_rate_limit(f"failed_login:{client_ip}", limit=5, window=900)
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password"
            )
        
        # Check if 2FA is enabled
        two_fa = db.query(TwoFactorAuth).filter(
            TwoFactorAuth.user_id == user.id,
            TwoFactorAuth.enabled == True
        ).first()
        
        if two_fa:
            # 2FA is enabled - return temporary token and require 2FA verification
            # Create a temporary token valid only for 2FA verification (5 minutes)
            temp_token = auth_service.create_access_token(
                data={"sub": str(user.id), "temp": True, "purpose": "2fa_verification"},
                expires_minutes=5
            )
            
            logger.info(f"2FA required for user: {user.email}")
            
            return {
                "requires_2fa": True,
                "temp_token": temp_token,
                "user_id": user.id,
                "message": "2FA verification required. Please provide your 2FA code."
            }
        
        # No 2FA - standard login flow
        # Create tokens
        access_token = auth_service.create_access_token(data={"sub": str(user.id)})
        refresh_token = auth_service.create_refresh_token(data={"sub": str(user.id)})
        
        # Create session
        token_payload = auth_service.verify_token(access_token)
        await auth_service.create_user_session(
            db, user, token_payload["jti"], 
            ip_address=client_ip,
            user_agent=request.headers.get("user-agent")
        )
        
        # Update last login
        user.last_login_at = datetime.now(timezone.utc)
        db.commit()
        
        # Reset rate limits on successful login
        await RateLimiter.reset_rate_limit(f"failed_login:{client_ip}")
        
        logger.info(f"User logged in: {user.email}")
        
        return auth_service.create_login_response(user, access_token, refresh_token)
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Login failed: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Login failed"
        )

@router.post("/login/verify-2fa")
async def verify_2fa_login(
    temp_token: str,
    totp_code: Optional[str] = None,
    backup_code: Optional[str] = None,
    request: Request = None,
    db: Session = Depends(get_db)
):
    """
    Complete login with 2FA verification
    Either totp_code or backup_code must be provided
    """
    try:
        # Verify temporary token
        payload = auth_service.verify_token(temp_token)
        if not payload.get("temp") or payload.get("purpose") != "2fa_verification":
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid or expired temporary token"
            )
        
        user_id = int(payload.get("sub"))
        user = db.query(User).filter(User.id == user_id).first()
        
        if not user or not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User not found or inactive"
            )
        
        # Verify 2FA code
        
        verification_success = False
        used_backup_code = False
        
        # Try TOTP code first
        if totp_code:
            verification_success = await totp_service.verify_login_token(
                db, user_id, totp_code
            )
        
        # Try backup code if TOTP failed or not provided
        if not verification_success and backup_code:
            verification_success = await totp_service.verify_backup_code(
                db, user_id, backup_code
            )
            used_backup_code = verification_success
        
        # Log attempt
        client_ip = request.client.host if request else "unknown"
        attempt = TwoFactorAttempt(
            user_id=user_id,
            success=verification_success,
            ip_address=client_ip,
            user_agent=request.headers.get("user-agent") if request else None
        )
        db.add(attempt)
        db.commit()
        
        if not verification_success:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid 2FA code or backup code"
            )
        
        # 2FA verified - create real tokens
        access_token = auth_service.create_access_token(data={"sub": str(user.id)})
        refresh_token = auth_service.create_refresh_token(data={"sub": str(user.id)})
        
        # Create session
        token_payload = auth_service.verify_token(access_token)
        await auth_service.create_user_session(
            db, user, token_payload["jti"],
            ip_address=client_ip,
            user_agent=request.headers.get("user-agent") if request else None
        )
        
        # Update last login
        user.last_login_at = datetime.now(timezone.utc)
        
        # Update two_factor_auth last_used_at
        two_fa = db.query(TwoFactorAuth).filter_by(user_id=user_id).first()
        if two_fa:
            two_fa.last_used_at = datetime.now(timezone.utc)
        
        db.commit()
        
        logger.info(f"2FA login successful for user: {user.email}")
        
        response = auth_service.create_login_response(user, access_token, refresh_token)
        
        if used_backup_code:
            response["warning"] = "You used a backup code. Consider regenerating your backup codes."
        
        return response
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"2FA verification failed: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="2FA verification failed"
        )


@router.post("/logout")
async def logout_user(
    current_user: User = Depends(get_current_active_user),
    credentials: HTTPAuthorizationCredentials = Depends(auth_service.security),
    db: Session = Depends(get_db)
):
    """Logout user and invalidate session"""
    try:
        # Get token JTI
        token = credentials.credentials
        payload = auth_service.verify_token(token)
        token_jti = payload.get("jti")
        
        # Invalidate session
        if token_jti:
            await auth_service.invalidate_session(db, token_jti)
        
        logger.info(f"User logged out: {current_user.email}")
        
        return {"message": "Successfully logged out"}
        
    except Exception as e:
        logger.error(f"Logout failed: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Logout failed"
        )

@router.post("/refresh-token")
async def refresh_access_token(
    refresh_token: str,
    db: Session = Depends(get_db)
):
    """Refresh access token using refresh token"""
    try:
        # Verify refresh token
        payload = auth_service.verify_token(refresh_token)
        
        if payload.get("type") != "refresh":
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token type"
            )
        
        # Get user
        user_id = payload.get("sub")
        user = db.query(User).filter(User.id == user_id).first()
        
        if not user or not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User not found or inactive"
            )
        
        # Create new access token
        access_token = auth_service.create_access_token(data={"sub": str(user.id)})
        
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "expires_in": auth_service.access_token_expire_minutes * 60
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Token refresh failed: {e}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token refresh failed"
        )

# Profile management endpoints
@router.get("/me", response_model=UserResponse)
async def get_current_user_profile(current_user: User = Depends(get_current_active_user)):
    """Get current user's profile"""
    return UserResponse.from_orm(current_user)

@router.put("/me", response_model=UserResponse)
async def update_user_profile(
    user_update: UserUpdate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Update current user's profile"""
    try:
        # Update fields
        if user_update.full_name is not None:
            current_user.full_name = user_update.full_name
        
        if user_update.bio is not None:
            current_user.bio = user_update.bio
        
        if user_update.avatar_url is not None:
            current_user.avatar_url = user_update.avatar_url
        
        db.commit()
        db.refresh(current_user)
        
        logger.info(f"User profile updated: {current_user.email}")
        
        return UserResponse.from_orm(current_user)
        
    except Exception as e:
        logger.error(f"Profile update failed: {e}")
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Profile update failed"
        )

@router.post("/change-password")
async def change_password(
    password_change: PasswordChange,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Change user's password"""
    try:
        # Verify current password
        if not auth_service.verify_password(password_change.current_password, current_user.hashed_password):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Current password is incorrect"
            )
        
        # Hash new password
        new_hashed_password = auth_service.hash_password(password_change.new_password)
        
        # Update password
        current_user.hashed_password = new_hashed_password
        db.commit()
        
        logger.info(f"Password changed for user: {current_user.email}")
        
        return {"message": "Password changed successfully"}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Password change failed: {e}")
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Password change failed"
        )

@router.post("/request-password-reset")
async def request_password_reset(
    password_reset: PasswordReset,
    request: Request,
    db: Session = Depends(get_db)
):
    """Request password reset email"""
    try:
        # Rate limiting
        client_ip = request.client.host
        if not await RateLimiter.check_rate_limit(f"password_reset:{client_ip}", limit=3, window=3600):
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail="Too many password reset requests. Please try again later."
            )
        
        # Find user
        user = db.query(User).filter(User.email == password_reset.email).first()
        
        # Always return success to prevent email enumeration
        message = "If an account with that email exists, you will receive password reset instructions."
        
        if user and user.is_active:
            # TODO: Send password reset email
            # For now, just log it
            logger.info(f"Password reset requested for: {user.email}")
        
        return {"message": message}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Password reset request failed: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Password reset request failed"
        )

# User statistics and usage
@router.get("/me/stats")
async def get_user_stats(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get user's usage statistics"""
    try:
        from database.models import TrendPrediction, Alert
        
        # Get prediction count
        prediction_count = db.query(TrendPrediction).filter(
            TrendPrediction.user_id == current_user.id
        ).count()
        
        # Get alert count
        alert_count = db.query(Alert).filter(
            Alert.user_id == current_user.id
        ).count()
        
        # Get subscription info
        subscription_info = {
            "plan": current_user.current_plan.name if current_user.current_plan else "Free",
            "predictions_used": current_user.predictions_used_this_month,
            "predictions_limit": current_user.current_plan.features.get("predictions_per_month", 100) if current_user.current_plan else 100,
            "expires_at": current_user.subscription_expires_at.isoformat() if current_user.subscription_expires_at else None
        }
        
        return {
            "user_id": current_user.id,
            "total_predictions": prediction_count,
            "total_alerts": alert_count,
            "subscription": subscription_info,
            "account_age_days": (datetime.now(timezone.utc) - current_user.created_at).days,
            "last_login": current_user.last_login_at.isoformat() if current_user.last_login_at else None
        }
        
    except Exception as e:
        logger.error(f"Failed to get user stats: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to get user statistics"
        )

@router.delete("/me")
async def delete_user_account(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Delete user account (soft delete)"""
    try:
        # Soft delete - deactivate account
        current_user.is_active = False
        current_user.email = f"deleted_{current_user.id}@deleted.predix.com"
        current_user.username = f"deleted_{current_user.id}"
        
        db.commit()
        
        logger.info(f"User account deleted: {current_user.id}")
        
        return {"message": "Account deleted successfully"}
        
    except Exception as e:
        logger.error(f"Account deletion failed: {e}")
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Account deletion failed"
        )
