"""
User Schemas
Pydantic schemas for user-related requests and responses
"""
from pydantic import BaseModel, EmailStr, Field, validator
from datetime import datetime
from typing import Optional
from models.user import PlanType


# ============================================
# Base Schema
# ============================================
class UserBase(BaseModel):
    """Base user schema with common fields"""
    email: EmailStr
    full_name: Optional[str] = None
    
    class Config:
        from_attributes = True


# ============================================
# Create Schema (for registration)
# ============================================
class UserCreate(UserBase):
    """Schema for user registration"""
    password: str = Field(..., min_length=8, max_length=100)
    
    @validator('password')
    def validate_password(cls, v):
        """Validate password strength"""
        if len(v) < 8:
            raise ValueError('Password must be at least 8 characters long')
        if not any(c.isupper() for c in v):
            raise ValueError('Password must contain at least one uppercase letter')
        if not any(c.islower() for c in v):
            raise ValueError('Password must contain at least one lowercase letter')
        if not any(c.isdigit() for c in v):
            raise ValueError('Password must contain at least one digit')
        return v


# ============================================
# Update Schema
# ============================================
class UserUpdate(BaseModel):
    """Schema for updating user profile"""
    full_name: Optional[str] = None
    avatar_url: Optional[str] = None
    bio: Optional[str] = Field(None, max_length=500)
    timezone: Optional[str] = None
    language: Optional[str] = None
    email_notifications: Optional[bool] = None
    
    class Config:
        from_attributes = True


# ============================================
# Response Schema
# ============================================
class User(UserBase):
    """Schema for user responses (public data)"""
    id: int
    plan: PlanType
    is_active: bool
    is_verified: bool
    avatar_url: Optional[str] = None
    bio: Optional[str] = None
    created_at: datetime
    last_login: Optional[datetime] = None
    
    # Usage stats
    posts_count: int
    predictions_count: int
    
    class Config:
        from_attributes = True


# ============================================
# Login Schema
# ============================================
class UserLogin(BaseModel):
    """Schema for user login"""
    email: EmailStr
    password: str


# ============================================
# Token Schemas
# ============================================
class Token(BaseModel):
    """Schema for JWT token response"""
    access_token: str
    token_type: str = "bearer"
    expires_in: int  # seconds
    user: User


class TokenData(BaseModel):
    """Schema for token payload data"""
    email: Optional[str] = None
    user_id: Optional[int] = None


# ============================================
# Password Reset Schemas
# ============================================
class PasswordReset(BaseModel):
    """Schema for requesting password reset"""
    email: EmailStr


class PasswordResetConfirm(BaseModel):
    """Schema for confirming password reset"""
    token: str
    new_password: str = Field(..., min_length=8, max_length=100)
    
    @validator('new_password')
    def validate_password(cls, v):
        """Validate password strength"""
        if len(v) < 8:
            raise ValueError('Password must be at least 8 characters long')
        if not any(c.isupper() for c in v):
            raise ValueError('Password must contain at least one uppercase letter')
        if not any(c.islower() for c in v):
            raise ValueError('Password must contain at least one lowercase letter')
        if not any(c.isdigit() for c in v):
            raise ValueError('Password must contain at least one digit')
        return v


# ============================================
# Email Verification Schemas
# ============================================
class EmailVerification(BaseModel):
    """Schema for email verification"""
    token: str


# ============================================
# Change Password Schema
# ============================================
class PasswordChange(BaseModel):
    """Schema for changing password"""
    old_password: str
    new_password: str = Field(..., min_length=8, max_length=100)
    
    @validator('new_password')
    def validate_password(cls, v):
        """Validate password strength"""
        if len(v) < 8:
            raise ValueError('Password must be at least 8 characters long')
        return v
