"""
Subscription Schemas
Pydantic schemas for subscription and payment-related requests
"""
from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional
from models.subscription import SubscriptionPlan, SubscriptionStatus


# ============================================
# Base Schema
# ============================================
class SubscriptionBase(BaseModel):
    """Base subscription schema"""
    plan: SubscriptionPlan
    
    class Config:
        from_attributes = True


# ============================================
# Create Schema
# ============================================
class SubscriptionCreate(SubscriptionBase):
    """Schema for creating a subscription"""
    payment_method_id: Optional[str] = None  # Stripe payment method ID
    billing_interval: str = Field(..., pattern="^(month|year)$")


# ============================================
# Update Schema
# ============================================
class SubscriptionUpdate(BaseModel):
    """Schema for updating a subscription"""
    plan: Optional[SubscriptionPlan] = None
    cancel_at_period_end: Optional[bool] = None
    
    class Config:
        from_attributes = True


# ============================================
# Response Schema
# ============================================
class Subscription(SubscriptionBase):
    """Schema for subscription responses"""
    id: int
    user_id: int
    status: SubscriptionStatus
    amount: float
    currency: str
    billing_interval: str
    
    # Billing periods
    current_period_start: Optional[datetime] = None
    current_period_end: Optional[datetime] = None
    
    # Trial
    trial_start: Optional[datetime] = None
    trial_end: Optional[datetime] = None
    
    # Cancellation
    cancel_at_period_end: bool
    cancelled_at: Optional[datetime] = None
    
    # Payment method
    card_last_4: Optional[str] = None
    card_brand: Optional[str] = None
    
    # Timestamps
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


# ============================================
# Webhook Schemas
# ============================================
class StripeWebhook(BaseModel):
    """Schema for Stripe webhook events"""
    type: str
    data: dict
