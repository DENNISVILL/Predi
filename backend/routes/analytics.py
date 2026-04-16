"""
Analytics Router
Dashboard metrics, reports, and business intelligence
"""
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Dict, Any, Optional
from datetime import datetime, timezone, timedelta
import logging

from database import get_db
from database.models import User, TrendPrediction, Post, Payment, PaymentStatus, Plan
from services.auth_service import get_current_active_user
from pydantic import BaseModel
from sqlalchemy import func, and_, or_

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/analytics", tags=["Analytics"])


# ============================================
# Pydantic Schemas  
# ============================================
class DashboardMetrics(BaseModel):
    """Main dashboard metrics"""
    total_predictions: int
    predictions_this_month: int
    predictions_remaining: int
    avg_viral_score: float
    total_posts: int
    published_posts: int
    scheduled_posts: int
    total_spend: float
    current_plan: str


class TrendAnalytics(BaseModel):
    """Trend performance analytics"""
    total_trends_tracked: int
    avg_accuracy: Optional[float]
    top_platform: Optional[str]
    best_performing_trend: Optional[Dict[str, Any]]
    platform_distribution: Dict[str, int]


class PredictionAnalytics(BaseModel):
    """Prediction accuracy analytics"""
    total_predictions: int
    avg_viral_score: float
    avg_confidence: float
    accuracy_rate: Optional[float]
    predictions_by_platform: Dict[str, int]
    monthly_trend: List[Dict[str, Any]]


class RevenueMetrics(BaseModel):
    """Revenue analytics (Admin only)"""
    total_revenue: float
    monthly_recurring_revenue: float
    active_subscriptions: int
    churn_rate: float
    avg_revenue_per_user: float
    revenue_by_plan: Dict[str, float]


class UserMetrics(BaseModel):
    """User analytics (Admin only)"""
    total_users: int
    active_users: int
    new_users_this_month: int
    verified_users: int
    premium_users: int
    user_growth_rate: float


class EngagementMetrics(BaseModel):
    """User engagement metrics"""
    daily_active_users: int
    weekly_active_users: int
    monthly_active_users: int
    avg_predictions_per_user: float
    avg_posts_per_user: float
    engagement_score: float


# ============================================
# Get Dashboard Analytics
# ============================================
@router.get("/dashboard", response_model=DashboardMetrics)
async def get_dashboard_analytics(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Get main dashboard metrics
    
    Returns comprehensive overview of user's account and usage
    """
    try:
        # Predictions
        total_predictions = db.query(TrendPrediction).filter(
            TrendPrediction.user_id == current_user.id
        ).count()
        
        predictions_this_month = current_user.predictions_used_this_month
        
        # Calculate remaining
        if current_user.current_plan:
            limit = current_user.current_plan.features.get("predictions_per_month", 0)
            predictions_remaining = limit - predictions_this_month if limit != -1 else -1
        else:
            predictions_remaining = 100 - predictions_this_month
        
        # Average viral score
        predictions = db.query(TrendPrediction).filter(
            TrendPrediction.user_id == current_user.id
        ).all()
        
        avg_viral_score = (
            sum(p.viral_score for p in predictions) / len(predictions)
            if predictions else 0
        )
        
        # Posts
        total_posts = db.query(Post).filter(Post.user_id == current_user.id).count()
        
        from models.post import PostStatus
        published_posts = db.query(Post).filter(
            Post.user_id == current_user.id,
            Post.status == PostStatus.PUBLISHED
        ).count()
        
        scheduled_posts = db.query(Post).filter(
            Post.user_id == current_user.id,
            Post.status == PostStatus.SCHEDULED
        ).count()
        
        # Spending
        total_spend = db.query(func.sum(Payment.amount)).filter(
            Payment.user_id == current_user.id,
            Payment.status == PaymentStatus.COMPLETED.value
        ).scalar() or 0.0
        
        # Current plan
        current_plan = current_user.current_plan.name if current_user.current_plan else "Free"
        
        return DashboardMetrics(
            total_predictions=total_predictions,
            predictions_this_month=predictions_this_month,
            predictions_remaining=predictions_remaining,
            avg_viral_score=round(avg_viral_score, 2),
            total_posts=total_posts,
            published_posts=published_posts,
            scheduled_posts=scheduled_posts,
            total_spend=round(total_spend, 2),
            current_plan=current_plan
        )
        
    except Exception as e:
        logger.error(f"Failed to get dashboard analytics: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve dashboard analytics"
        )


# ============================================
# Get Trend Analytics
# ============================================
@router.get("/trends", response_model=TrendAnalytics)
async def get_trend_analytics(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Get trend performance analytics
    
    Returns aggregated trend data and performance metrics
    """
    try:
        predictions = db.query(TrendPrediction).filter(
            TrendPrediction.user_id == current_user.id
        ).all()
        
        if not predictions:
            return TrendAnalytics(
                total_trends_tracked=0,
                avg_accuracy=None,
                top_platform=None,
                best_performing_trend=None,
                platform_distribution={}
            )
        
        # Platform distribution
        platform_dist = {}
        for pred in predictions:
            platform = pred.input_data.get("platform", "unknown")
            platform_dist[platform] = platform_dist.get(platform, 0) + 1
        
        # Top platform
        top_platform = max(platform_dist.items(), key=lambda x: x[1])[0] if platform_dist else None
        
        # Best performing (highest viral score)
        best_pred = max(predictions, key=lambda p: p.viral_score)
        best_performing = {
            "id": best_pred.id,
            "viral_score": best_pred.viral_score,
            "confidence": best_pred.confidence,
            "platform": best_pred.input_data.get("platform"),
            "created_at": best_pred.created_at
        }
        
        # Average accuracy (if feedback provided)
        accuracies = [
            p.input_data.get("feedback", {}).get("actual_performance", 0)
            for p in predictions
            if p.input_data.get("feedback")
        ]
        avg_accuracy = sum(accuracies) / len(accuracies) if accuracies else None
        
        return TrendAnalytics(
            total_trends_tracked=len(predictions),
            avg_accuracy=round(avg_accuracy, 2) if avg_accuracy else None,
            top_platform=top_platform,
            best_performing_trend=best_performing,
            platform_distribution=platform_dist
        )
        
    except Exception as e:
        logger.error(f"Failed to get trend analytics: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve trend analytics"
        )


# ============================================
# Get Prediction Analytics
# ============================================
@router.get("/predictions", response_model=PredictionAnalytics)
async def get_prediction_analytics(
    days: int = Query(30, ge=1, le=365, description="Number of days to analyze"),
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Get prediction analytics
    
    Returns detailed prediction performance metrics
    """
    try:
        since = datetime.now(timezone.utc) - timedelta(days=days)
        
        predictions = db.query(TrendPrediction).filter(
            TrendPrediction.user_id == current_user.id,
            TrendPrediction.created_at >= since
        ).all()
        
        if not predictions:
            return PredictionAnalytics(
                total_predictions=0,
                avg_viral_score=0,
                avg_confidence=0,
                accuracy_rate=None,
                predictions_by_platform={},
                monthly_trend=[]
            )
        
        # Calculate averages
        avg_viral_score = sum(p.viral_score for p in predictions) / len(predictions)
        avg_confidence = sum(p.confidence for p in predictions) / len(predictions)
        
        # Platform distribution
        platform_counts = {}
        for pred in predictions:
            platform = pred.input_data.get("platform", "unknown")
            platform_counts[platform] = platform_counts.get(platform, 0) + 1
        
        # Monthly trend
        monthly_data = {}
        for pred in predictions:
            month_key = pred.created_at.strftime("%Y-%m")
            if month_key not in monthly_data:
                monthly_data[month_key] = {
                    "month": month_key,
                    "count": 0,
                    "avg_score": []
                }
            monthly_data[month_key]["count"] += 1
            monthly_data[month_key]["avg_score"].append(pred.viral_score)
        
        # Calculate monthly averages
        monthly_trend = []
        for month_key in sorted(monthly_data.keys()):
            data = monthly_data[month_key]
            monthly_trend.append({
                "month": data["month"],
                "count": data["count"],
                "avg_score": round(sum(data["avg_score"]) / len(data["avg_score"]), 2)
            })
        
        return PredictionAnalytics(
            total_predictions=len(predictions),
            avg_viral_score=round(avg_viral_score, 2),
            avg_confidence=round(avg_confidence, 2),
            accuracy_rate=None,  # TODO: Calculate from feedback
            predictions_by_platform=platform_counts,
            monthly_trend=monthly_trend
        )
        
    except Exception as e:
        logger.error(f"Failed to get prediction analytics: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve prediction analytics"
        )


# ============================================
# Get Revenue Metrics (Admin Only)
# ============================================
@router.get("/revenue", response_model=RevenueMetrics)
async def get_revenue_metrics(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Get revenue analytics (Admin only)
    
    Returns financial metrics and revenue data
    """
    try:
        # Check admin access
        if current_user.role != "admin":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Admin access required"
            )
        
        # Total revenue
        total_revenue = db.query(func.sum(Payment.amount)).filter(
            Payment.status == PaymentStatus.COMPLETED.value
        ).scalar() or 0.0
        
        # Active subscriptions (users with current plan and not expired)
        active_subs = db.query(User).filter(
            User.current_plan_id.isnot(None),
            or_(
                User.subscription_expires_at.is_(None),
                User.subscription_expires_at > datetime.now(timezone.utc)
            )
        ).count()
        
        # MRR calculation (simplified)
        # Sum of monthly plan prices for active subscriptions
        active_users = db.query(User).filter(
            User.current_plan_id.isnot(None),
            or_(
                User.subscription_expires_at.is_(None),
                User.subscription_expires_at > datetime.now(timezone.utc)
            )
        ).all()
        
        mrr = sum(
            user.current_plan.price for user in active_users
            if user.current_plan and user.current_plan.interval == "monthly"
        )
        
        # Revenue by plan
        revenue_by_plan = {}
        payments_by_plan = db.query(
            Plan.name,
            func.sum(Payment.amount).label('total')
        ).join(
            Payment, Payment.plan_id == Plan.id
        ).filter(
            Payment.status == PaymentStatus.COMPLETED.value
        ).group_by(Plan.name).all()
        
        for plan_name, total in payments_by_plan:
            revenue_by_plan[plan_name] = float(total or 0)
        
        # ARPU (Average Revenue Per User)
        total_users = db.query(User).count()
        arpu = total_revenue / total_users if total_users > 0 else 0
        
        # Churn rate (simplified - users who cancelled in last month)
        # TODO: Implement proper churn calculation
        churn_rate = 0.0
        
        return RevenueMetrics(
            total_revenue=round(total_revenue, 2),
            monthly_recurring_revenue=round(mrr, 2),
            active_subscriptions=active_subs,
            churn_rate=churn_rate,
            avg_revenue_per_user=round(arpu, 2),
            revenue_by_plan=revenue_by_plan
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to get revenue metrics: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve revenue metrics"
        )


# ============================================
# Get User Metrics (Admin Only)
# ============================================
@router.get("/users", response_model=UserMetrics)
async def get_user_metrics(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Get user analytics (Admin only)
    
    Returns user growth and engagement metrics
    """
    try:
        # Check admin access
        if current_user.role != "admin":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Admin access required"
            )
        
        # Total users
        total_users = db.query(User).count()
        
        # Active users (logged in last 30 days)
        thirty_days_ago = datetime.now(timezone.utc) - timedelta(days=30)
        active_users = db.query(User).filter(
            User.last_login_at >= thirty_days_ago
        ).count()
        
        # New users this month
        first_of_month = datetime.now(timezone.utc).replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        new_users = db.query(User).filter(
            User.created_at >= first_of_month
        ).count()
        
        # Verified users
        verified_users = db.query(User).filter(User.is_verified == True).count()
        
        # Premium users
        premium_users = db.query(User).filter(
            User.current_plan_id.isnot(None)
        ).count()
        
        # User growth rate (last month vs previous month)
        last_month = first_of_month - timedelta(days=30)
        prev_month = last_month - timedelta(days=30)_users_last = db.query(User).filter(
            and_(
                User.created_at >= last_month,
                User.created_at < first_of_month
            )
        ).count()
        
        new_users_prev = db.query(User).filter(
            and_(
                User.created_at >= prev_month,
                User.created_at < last_month
            )
        ).count()
        
        growth_rate = (
            ((new_users_last - new_users_prev) / new_users_prev * 100)
            if new_users_prev > 0 else 0
        )
        
        return UserMetrics(
            total_users=total_users,
            active_users=active_users,
            new_users_this_month=new_users,
            verified_users=verified_users,
            premium_users=premium_users,
            user_growth_rate=round(growth_rate, 2)
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to get user metrics: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve user metrics"
        )


# ============================================
# Get Engagement Metrics
# ============================================
@router.get("/engagement", response_model=EngagementMetrics)
async def get_engagement_metrics(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Get user engagement metrics
    
    Returns activity and engagement data
    """
    try:
        now = datetime.now(timezone.utc)
        
        # DAU (Daily Active Users)
        one_day_ago = now - timedelta(days=1)
        dau = db.query(User).filter(User.last_login_at >= one_day_ago).count()
        
        # WAU (Weekly Active Users)
        seven_days_ago = now - timedelta(days=7)
        wau = db.query(User).filter(User.last_login_at >= seven_days_ago).count()
        
        # MAU (Monthly Active Users)
        thirty_days_ago = now - timedelta(days=30)
        mau = db.query(User).filter(User.last_login_at >= thirty_days_ago).count()
        
        # Average predictions per user
        total_users = db.query(User).count()
        total_predictions = db.query(TrendPrediction).count()
        avg_predictions = total_predictions / total_users if total_users > 0 else 0
        
        # Average posts per user
        total_posts = db.query(Post).count()
        avg_posts = total_posts / total_users if total_users > 0 else 0
        
        # Engagement score (simplified formula)
        # (DAU / MAU) * 100
        engagement_score = (dau / mau * 100) if mau > 0 else 0
        
        return EngagementMetrics(
            daily_active_users=dau,
            weekly_active_users=wau,
            monthly_active_users=mau,
            avg_predictions_per_user=round(avg_predictions, 2),
            avg_posts_per_user=round(avg_posts, 2),
            engagement_score=round(engagement_score, 2)
        )
        
    except Exception as e:
        logger.error(f"Failed to get engagement metrics: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve engagement metrics"
        )


# ============================================
# Export Analytics Data
# ============================================
@router.post("/export")
async def export_analytics_data(
    report_type: str = Query(..., regex="^(dashboard|trends|predictions|all)$"),
    format: str = Query("json", regex="^(json|csv)$"),
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Export analytics data
    
    - **report_type**: Type of report (dashboard, trends, predictions, all)
    - **format**: Export format (json, csv)
    
    Returns downloadable file
    """
    try:
        data = {}
        
        # Gather requested data
        if report_type in ["dashboard", "all"]:
            dashboard = await get_dashboard_analytics(current_user, db)
            data["dashboard"] = dashboard.dict()
        
        if report_type in ["trends", "all"]:
            trends = await get_trend_analytics(current_user, db)
            data["trends"] = trends.dict()
        
        if report_type in ["predictions", "all"]:
            predictions = await get_prediction_analytics(30, current_user, db)
            data["predictions"] = predictions.dict()
        
        # Return appropriate format
        if format == "json":
            from fastapi.responses import JSONResponse
            return JSONResponse(content=data)
        else:
            # TODO: Implement CSV export
            raise HTTPException(
                status_code=status.HTTP_501_NOT_IMPLEMENTED,
                detail="CSV export not yet implemented"
            )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to export analytics: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to export analytics data"
        )
