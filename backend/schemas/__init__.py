"""
Schemas package initialization
Imports all Pydantic schemas for validation
"""
from schemas.user import (
    UserBase,
    UserCreate,
    UserUpdate,
    User,
    UserLogin,
    Token,
    TokenData,
    PasswordReset,
    PasswordResetConfirm,
)
from schemas.post import (
    PostBase,
    PostCreate,
    PostUpdate,
    Post,
    PostList,
    PostSchedule,
)
from schemas.subscription import (
    SubscriptionBase,
    SubscriptionCreate,
    Subscription,
    SubscriptionUpdate,
)
from schemas.prediction import (
    PredictionBase,
    PredictionCreate,
    Prediction,
    PredictionResponse,
)

__all__ = [
    # User schemas
    "UserBase",
    "UserCreate",
    "UserUpdate",
    "User",
    "UserLogin",
    "Token",
    "TokenData",
    "PasswordReset",
    "PasswordResetConfirm",
    # Post schemas
    "PostBase",
    "PostCreate",
    "PostUpdate",
    "Post",
    "PostList",
    "PostSchedule",
    # Subscription schemas
    "SubscriptionBase",
    "SubscriptionCreate",
    "Subscription",
    "SubscriptionUpdate",
    # Prediction schemas
    "PredictionBase",
    "PredictionCreate",
    "Prediction",
    "PredictionResponse",
]
