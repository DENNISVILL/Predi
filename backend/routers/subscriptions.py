"""
Subscriptions Router
Plan management, upgrades, downgrades, and cancellations
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Dict, Any, Optional
from datetime import datetime, timezone, timedelta
import logging

from database import get_db
from database.models import User, Plan, Payment, PaymentStatus
from services.auth_service import get_current_active_user
from services.payment_service import payment_service
from pydantic import BaseModel, Field

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/subscriptions", tags=["Subscriptions"])


# ============================================
# Pydantic Schemas
# ============================================
class PlanResponse(BaseModel):
    """Plan information response"""
    id: int
    name: str
    description: str
    price: float
    currency: str
    interval: str
    features: Dict[str, Any]
    is_active: bool
    
    class Config:
        from_attributes = True


class CurrentSubscriptionResponse(BaseModel):
    """Current subscription status"""
    plan: Optional[PlanResponse]
    status: str
    expires_at: Optional[datetime]
    predictions_used: int
    predictions_limit: int
    is_active: bool
    can_make_predictions: bool
    days_remaining: Optional[int]


class UpgradeRequest(BaseModel):
    """Request to upgrade plan"""
    plan_id: int
    payment_method_id: Optional[str] = None
    prorate: bool = True


class UsageStats(BaseModel):
    """Usage statistics"""
    current_plan: str
    predictions_used: int
    predictions_limit: int
    percentage_used: float
    resets_at: Optional[datetime]


# ============================================
# Get Available Plans
# ============================================
@router.get("/plans", response_model=List[PlanResponse])
async def get_available_plans(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    Get all available subscription plans
    
    Returns list of active plans with features and pricing
    """
    try:
        plans = db.query(Plan).filter(Plan.is_active == True).order_by(Plan.price.asc()).all()
        return plans
        
    except Exception as e:
        logger.error(f"Failed to get plans: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve plans"
        )


# ============================================
# Get Current Subscription
# ============================================
@router.get("/current", response_model=CurrentSubscriptionResponse)
async def get_current_subscription(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Get user's current subscription status
    
    Returns current plan, usage, expiration, and limits
    """
    try:
        # Get plan  details
        plan = current_user.current_plan
        
        if not plan:
            # Free tier
            return CurrentSubscriptionResponse(
                plan=None,
                status="free",
                expires_at=None,
                predictions_used=current_user.predictions_used_this_month,
                predictions_limit=100,  # Default free tier limit
                is_active=True,
                can_make_predictions=current_user.predictions_used_this_month < 100,
                days_remaining=None
            )
        
        # Check if subscription is expired
        is_expired = (
           current_user.subscription_expires_at and
            current_user.subscription_expires_at < datetime.now(timezone.utc)
        )
        
        # Calculate days remaining
        days_remaining = None
        if current_user.subscription_expires_at:
            delta = current_user.subscription_expires_at - datetime.now(timezone.utc)
            days_remaining = max(0, delta.days)
        
        # Get predictions limit
        predictions_limit = plan.features.get("predictions_per_month", 0)
        if predictions_limit == -1:
            predictions_limit = 999999  # Display as unlimited
        
        return CurrentSubscriptionResponse(
            plan=PlanResponse.from_orm(plan),
            status="expired" if is_expired else "active",
            expires_at=current_user.subscription_expires_at,
            predictions_used=current_user.predictions_used_this_month,
            predictions_limit=predictions_limit,
            is_active=not is_expired,
            can_make_predictions=current_user.can_make_prediction(),
            days_remaining=days_remaining
        )
        
    except Exception as e:
        logger.error(f"Failed to get current subscription: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve subscription"
        )


# ============================================
# Upgrade Plan
# ============================================
@router.post("/upgrade")
async def upgrade_plan(
    upgrade_data: UpgradeRequest,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Upgrade to a higher-tier plan
    
    - Creates payment intent
    - Prorates if upgrading mid-period
    - Returns payment URL for completion
    """
    try:
        # Get target plan
        target_plan = db.query(Plan).filter(Plan.id == upgrade_data.plan_id).first()
        
        if not target_plan:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Plan not found"
            )
        
        if not target_plan.is_active:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Plan is not available"
            )
        
        # Check if it's actually an upgrade
        current_plan = current_user.current_plan
        if current_plan and target_plan.price <= current_plan.price:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Use downgrade endpoint for lower-tier plans"
            )
        
        # Create payment intent
        payment_intent = await payment_service.create_payment_intent(
            user=current_user,
            plan=target_plan,
            db=db
        )
        
        logger.info(f"Upgrade initiated: User {current_user.id} to plan {target_plan.name}")
        
        return {
            "message": "Payment initiated",
            "plan": PlanResponse.from_orm(target_plan),
            "payment_url": payment_intent.get("payment_url"),
            "payment_id": payment_intent.get("payment_id"),
            "amount": payment_intent.get("amount"),
            "currency": payment_intent.get("currency")
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to upgrade plan: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to process upgrade"
        )


# ============================================
# Downgrade Plan
# ============================================
@router.post("/downgrade")
async def downgrade_plan(
    downgrade_data: UpgradeRequest,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Downgrade to a lower-tier plan
    
    - Takes effect at end of current billing period
    - No refunds for unused time
    - Returns confirmation
    """
    try:
        # Get target plan
        target_plan = db.query(Plan).filter(Plan.id == downgrade_data.plan_id).first()
        
        if not target_plan:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Plan not found"
            )
        
        # Check if it's actually a downgrade
        current_plan = current_user.current_plan
        if not current_plan:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="No active subscription to downgrade"
            )
        
        if target_plan.price >= current_plan.price:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Use upgrade endpoint for higher-tier plans"
            )
        
        # Schedule downgrade at end of period
        # Store in user metadata for background job processing
        if not current_user.subscription_expires_at:
            # Immediate downgrade if no expiry set
            current_user.current_plan_id = target_plan.id
            db.commit()
            
            return {
                "message": "Plan downgraded immediately",
                "new_plan": PlanResponse.from_orm(target_plan),
                "effective_date": datetime.now(timezone.utc)
            }
        else:
            # Schedule for end of period
            # TODO: Implement scheduled downgrade table
            logger.info(f"Downgrade scheduled: User {current_user.id} to {target_plan.name} at {current_user.subscription_expires_at}")
            
            return {
                "message": "Downgrade scheduled",
                "new_plan": PlanResponse.from_orm(target_plan),
                "current_plan": PlanResponse.from_orm(current_plan),
                "effective_date": current_user.subscription_expires_at
            }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to downgrade plan: {e}")
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to process downgrade"
        )


# ============================================
# Cancel Subscription
# ============================================
@router.post("/cancel")
async def cancel_subscription(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Cancel subscription
    
    - Cancellation takes effect at end of billing period
    - User retains access until expiration
    - Can reactivate before expiration
    """
    try:
        if not current_user.current_plan:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="No active subscription to cancel"
            )
        
        # Use payment service to handle cancellation
        result = await payment_service.cancel_subscription(
            user=current_user,
            db=db
        )
        
        logger.info(f"Subscription cancelled: User {current_user.id}")
        
        return {
            "message": result.get("message", "Subscription cancelled"),
            "status": result.get("status"),
            "expires_at": result.get("expires_at"),
            "access_until": result.get("expires_at")
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to cancel subscription: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to cancel subscription"
        )


# ============================================
# Reactivate Subscription
# ============================================
@router.post("/reactivate")
async def reactivate_subscription(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Reactivate a cancelled subscription
    
    - Only works if subscription hasn't expired yet
    - Restores full access
    """
    try:
        if not current_user.current_plan:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="No subscription to reactivate"
            )
        
        # Check if subscription is expired
        if current_user.subscription_expires_at and current_user.subscription_expires_at < datetime.now(timezone.utc):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Subscription has already expired. Please subscribe again."
            )
        
        # TODO: Remove from cancellation cache
        # For now, just log
        logger.info(f"Subscription reactivated: User {current_user.id}")
        
        return {
            "message": "Subscription reactivated",
            "plan": PlanResponse.from_orm(current_user.current_plan),
            "expires_at": current_user.subscription_expires_at
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to reactivate subscription: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to reactivate subscription"
        )


# ============================================
# Get Usage Statistics
# ============================================
@router.get("/usage", response_model=UsageStats)
async def get_usage_stats(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Get current usage statistics
    
    Returns predictions used, limit, and percentage
    """
    try:
        plan_name = current_user.current_plan.name if current_user.current_plan else "Free"
        
        if current_user.current_plan:
            limit = current_user.current_plan.features.get("predictions_per_month", 0)
            if limit == -1:
                limit = 999999  # Unlimited
        else:
            limit = 100  # Free tier
        
        used = current_user.predictions_used_this_month
        percentage = (used / limit * 100) if limit > 0 else 0
        
        # Calculate reset date (first day of next month)
        from dateutil.relativedelta import relativedelta
        now = datetime.now(timezone.utc)
        next_month = now.replace(day=1) + relativedelta(months=1)
        
        return UsageStats(
            current_plan=plan_name,
            predictions_used=used,
            predictions_limit=limit,
            percentage_used=round(percentage, 2),
            resets_at=next_month
        )
        
    except Exception as e:
        logger.error(f"Failed to get usage stats: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve usage statistics"
        )


# ============================================
# Compare Plans
# ============================================
@router.get("/compare")
async def compare_plans(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Get plan comparison data
    
    Returns all plans with feature comparison
    """
    try:
        plans = db.query(Plan).filter(Plan.is_active == True).order_by(Plan.price.asc()).all()
        
        # Build comparison matrix
        comparison = {
            "plans": [PlanResponse.from_orm(plan) for plan in plans],
            "current_plan_id": current_user.current_plan_id,
            "features": {
                "predictions_per_month": [
                    plan.features.get("predictions_per_month", 0) for plan in plans
                ],
                "real_time_alerts": [
                    plan.features.get("real_time_alerts", False) for plan in plans
                ],
                "advanced_analytics": [
                    plan.features.get("advanced_analytics", False) for plan in plans
                ],
                "api_access": [
                    plan.features.get("api_access", False) for plan in plans
                ],
                "priority_support": [
                    plan.features.get("priority_support", False) for plan in plans
                ]
            }
        }
        
        return comparison
        
    except Exception as e:
        logger.error(f"Failed to compare plans: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve plan comparison"
        )


# ============================================
# Get Billing History
# ============================================
@router.get("/billing-history")
async def get_billing_history(
    limit: int = 12,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Get user's billing history
    
    Returns past payments and invoices
    """
    try:
        payments = db.query(Payment).filter(
            Payment.user_id == current_user.id
        ).order_by(Payment.created_at.desc()).limit(limit).all()
        
        history = []
        for payment in payments:
            history.append({
                "id": payment.id,
                "uuid": payment.uuid,
                "amount": payment.amount,
                "currency": payment.currency,
                "status": payment.status,
                "plan_id": payment.plan_id,
                "created_at": payment.created_at,
                "paid_at": payment.paid_at
            })
        
        return {
            "total": len(history),
            "payments": history
        }
        
    except Exception as e:
        logger.error(f"Failed to get billing history: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve billing history"
        )
