"""
Authentication Router
Login, register, email verification, password reset
"""
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
import logging

from database import get_db
from models.user import User
from schemas.user import UserCreate, User as UserSchema, Token, PasswordReset, PasswordResetConfirm, EmailVerification
from utils.security import (
    verify_password,
    get_password_hash,
    create_access_token,
    generate_verification_token,
    generate_reset_token,
)
from services.email_service import send_verification_email, send_password_reset_email, send_welcome_email
from config import settings

router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/auth/login")
logger = logging.getLogger(__name__)


# ============================================
# Register
# ============================================
@router.post("/register", response_model=UserSchema, status_code=status.HTTP_201_CREATED)
async def register(user_data: UserCreate, db: Session = Depends(get_db)):
    """
    Register a new user
    
    - Creates user account
    - Sends verification email
    - Returns user data
    """
    # Check if user already exists
    existing_user = db.query(User).filter(User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create user
    hashed_password = get_password_hash(user_data.password)
    verification_token = generate_verification_token()
    
    new_user = User(
        email=user_data.email,
        full_name=user_data.full_name,
        hashed_password=hashed_password,
        verification_token=verification_token,
        verification_token_expires=datetime.utcnow() + timedelta(hours=24),
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    # Send verification email (async, don't wait)
    try:
        await send_verification_email(
            email=new_user.email,
            name=new_user.full_name or "Usuario",
            verification_token=verification_token
        )
    except Exception as e:
        logger.error(f"Failed to send verification email: {e}")
        # Don't fail registration if email fails
    
    logger.info(f"New user registered: {new_user.email}")
    return new_user


# ============================================
# Login
# ============================================
@router.post("/login", response_model=Token)
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    """
    Login with email and password
    
    - Returns JWT access token
    - Updates last login timestamp
    """
    # Find user by email
    user = db.query(User).filter(User.email == form_data.username).first()
    
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Check if user is active
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is disabled"
        )
    
    # Update last login
    user.last_login = datetime.utcnow()
    db.commit()
    
    # Create access token
    access_token = create_access_token(
        data={"sub": user.email, "user_id": user.id}
    )
    
    logger.info(f"User logged in: {user.email}")
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "expires_in": settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        "user": user
    }


# ============================================
# Get Current User (Dependency)
# ============================================
async def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
) -> User:
    """
    Get current authenticated user from JWT token
    """
    from jose import JWTError, jwt
    
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        payload = jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=[settings.ALGORITHM]
        )
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    
    user = db.query(User).filter(User.email == email).first()
    if user is None:
        raise credentials_exception
    
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is disabled"
        )
    
    return user


# ============================================
# Get Current User Info
# ============================================
@router.get("/me", response_model=UserSchema)
async def read_users_me(current_user: User = Depends(get_current_user)):
    """Get current user information"""
    return current_user


# ============================================
# Verify Email
# ============================================
@router.post("/verify-email", status_code=status.HTTP_200_OK)
async def verify_email(
    verification: EmailVerification,
    db: Session = Depends(get_db)
):
    """
    Verify user email with token
    """
    user = db.query(User).filter(
        User.verification_token == verification.token
    ).first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid verification token"
        )
    
    # Check if token expired
    if user.verification_token_expires and user.verification_token_expires < datetime.utcnow():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Verification token has expired"
        )
    
    # Verify user
    user.is_verified = True
    user.verification_token = None
    user.verification_token_expires = None
    db.commit()
    
    # Send welcome email
    try:
        await send_welcome_email(
            email=user.email,
            name=user.full_name or "Usuario"
        )
    except Exception as e:
        logger.error(f"Failed to send welcome email: {e}")
    
    logger.info(f"User email verified: {user.email}")
    
    return {"message": "Email verified successfully"}


# ============================================
# Request Password Reset
# ============================================
@router.post("/forgot-password", status_code=status.HTTP_200_OK)
async def forgot_password(
    reset_request: PasswordReset,
    db: Session = Depends(get_db)
):
    """
    Request password reset email
    """
    user = db.query(User).filter(User.email == reset_request.email).first()
    
    # Always return success (don't reveal if email exists)
    if not user:
        return {"message": "If the email exists, a reset link has been sent"}
    
    # Generate reset token
    reset_token = generate_reset_token()
    user.reset_password_token = reset_token
    user.reset_password_expires = datetime.utcnow() + timedelta(hours=1)
    db.commit()
    
    # Send reset email
    try:
        await send_password_reset_email(
            email=user.email,
            name=user.full_name or "Usuario",
            reset_token=reset_token
        )
    except Exception as e:
        logger.error(f"Failed to send password reset email: {e}")
    
    logger.info(f"Password reset requested for: {user.email}")
    
    return {"message": "If the email exists, a reset link has been sent"}


# ============================================
# Reset Password
# ============================================
@router.post("/reset-password", status_code=status.HTTP_200_OK)
async def reset_password(
    reset_data: PasswordResetConfirm,
    db: Session = Depends(get_db)
):
    """
    Reset password with token
    """
    user = db.query(User).filter(
        User.reset_password_token == reset_data.token
    ).first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid reset token"
        )
    
    # Check if token expired
    if user.reset_password_expires and user.reset_password_expires < datetime.utcnow():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Reset token has expired"
        )
    
    # Update password
    user.hashed_password = get_password_hash(reset_data.new_password)
    user.reset_password_token = None
    user.reset_password_expires = None
    db.commit()
    
    logger.info(f"Password reset successful for: {user.email}")
    
    return {"message": "Password reset successful"}


# ============================================
# Resend Verification Email
# ============================================
@router.post("/resend-verification", status_code=status.HTTP_200_OK)
async def resend_verification(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Resend verification email
    """
    if current_user.is_verified:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already verified"
        )
    
    # Generate new token
    verification_token = generate_verification_token()
    current_user.verification_token = verification_token
    current_user.verification_token_expires = datetime.utcnow() + timedelta(hours=24)
    db.commit()
    
    # Send email
    try:
        await send_verification_email(
            email=current_user.email,
            name=current_user.full_name or "Usuario",
            verification_token=verification_token
        )
    except Exception as e:
        logger.error(f"Failed to resend verification email: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to send verification email"
        )
    
    return {"message": "Verification email sent"}


# ============================================
# Logout (Token Invalidation)
# ============================================
@router.post("/logout", status_code=status.HTTP_200_OK)
async def logout(current_user: User = Depends(get_current_user)):
    """
    Logout user (client should delete token)
    """
    logger.info(f"User logged out: {current_user.email}")
    return {"message": "Logged out successfully"}
