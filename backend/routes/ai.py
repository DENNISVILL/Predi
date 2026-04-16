"""
AI Routes for Predix Backend
Trend predictions, viral scoring, and AI analytics
"""

from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from sqlalchemy.orm import Session
from pydantic import BaseModel, Field, validator
from typing import List, Dict, Optional, Any
from datetime import datetime, timezone, timedelta
import logging

from database.connection import get_db
from database.models import User, TrendPrediction, Alert
from services.auth_service import get_current_active_user, get_current_premium_user
from services.ai_connector import ai_connector
from services.websocket_service import websocket_manager

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/ai")

# Pydantic models for AI requests/responses
class TrendInput(BaseModel):
    platform: str = Field(..., description="Social media platform")
    content_type: str = Field(..., description="Type of content")
    name: str = Field(..., description="Trend name or hashtag")
    description: str = Field(default="", description="Content description")
    
    # Metrics
    views: int = Field(default=0, ge=0)
    likes: int = Field(default=0, ge=0)
    shares: int = Field(default=0, ge=0)
    comments: int = Field(default=0, ge=0)
    engagement_rate: float = Field(default=0.0, ge=0.0, le=1.0)
    growth_rate_24h: float = Field(default=0.0, ge=0.0)
    growth_rate_7d: float = Field(default=0.0, ge=0.0)
    
    # Optional metadata
    creator_count: Optional[int] = Field(default=1, ge=1)
    geographic_spread: Optional[List[str]] = Field(default=[])
    content_categories: Optional[List[str]] = Field(default=[])
    language: Optional[str] = Field(default="en")
    
    # Text features
    sentiment: Optional[float] = Field(default=0.0, ge=-1.0, le=1.0)
    keywords: Optional[List[str]] = Field(default=[])
    readability_score: Optional[float] = Field(default=0.5, ge=0.0, le=1.0)
    
    @validator('platform')
    def validate_platform(cls, v):
        allowed_platforms = ['tiktok', 'twitter', 'instagram', 'youtube', 'spotify']
        if v.lower() not in allowed_platforms:
            raise ValueError(f'Platform must be one of: {", ".join(allowed_platforms)}')
        return v.lower()
    
    @validator('content_type')
    def validate_content_type(cls, v):
        allowed_types = ['hashtag', 'video', 'post', 'sound', 'song']
        if v.lower() not in allowed_types:
            raise ValueError(f'Content type must be one of: {", ".join(allowed_types)}')
        return v.lower()

class BatchPredictionRequest(BaseModel):
    trends: List[TrendInput] = Field(..., max_items=50, description="List of trends to analyze")
    include_explanations: bool = Field(default=True)
    include_recommendations: bool = Field(default=True)

class AlertThresholds(BaseModel):
    viral_score_threshold: float = Field(default=75.0, ge=0.0, le=100.0)
    growth_threshold: float = Field(default=0.5, ge=0.0)
    confidence_threshold: float = Field(default=0.6, ge=0.0, le=1.0)

class PredictionResponse(BaseModel):
    prediction_id: str
    viral_score: float
    confidence: float
    growth_predictions: Dict[str, float]
    components: Dict[str, float]
    explanation: str
    recommendations: List[str]
    metadata: Dict[str, Any]
    
    class Config:
        from_attributes = True

# Main prediction endpoints
@router.post("/predict", response_model=PredictionResponse)
async def predict_single_trend(
    trend_input: TrendInput,
    background_tasks: BackgroundTasks,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Make a single trend prediction"""
    try:
        # Check user's prediction quota
        if not current_user.can_make_prediction():
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Prediction quota exceeded. Please upgrade your plan."
            )
        
        # Make prediction using AI connector
        async with ai_connector:
            prediction_result = await ai_connector.predict_trend(
                current_user, 
                trend_input.dict(), 
                db
            )
        
        # Send real-time notification if high viral score
        if prediction_result.get("viral_score", 0) >= 80:
            background_tasks.add_task(
                websocket_manager.send_prediction_result,
                current_user,
                prediction_result
            )
        
        logger.info(f"Prediction made by user {current_user.id}: {prediction_result.get('viral_score', 0):.1f}% viral score")
        
        return PredictionResponse(
            prediction_id=f"pred_{datetime.now().strftime('%Y%m%d_%H%M%S')}",
            viral_score=prediction_result.get("viral_score", 0.0),
            confidence=prediction_result.get("confidence", 0.0),
            growth_predictions=prediction_result.get("growth_predictions", {}),
            components=prediction_result.get("components", {}),
            explanation=prediction_result.get("explanation", ""),
            recommendations=prediction_result.get("recommendations", []),
            metadata=prediction_result.get("metadata", {})
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Single prediction failed for user {current_user.id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Prediction failed. Please try again."
        )

@router.post("/batch-predict")
async def predict_batch_trends(
    batch_request: BatchPredictionRequest,
    background_tasks: BackgroundTasks,
    current_user: User = Depends(get_current_premium_user),  # Premium feature
    db: Session = Depends(get_db)
):
    """Make batch trend predictions (Premium feature)"""
    try:
        # Convert trends to dict format
        trends_data = [trend.dict() for trend in batch_request.trends]
        
        # Make batch prediction using AI connector
        async with ai_connector:
            batch_result = await ai_connector.batch_predict(
                current_user,
                trends_data,
                db
            )
        
        # Process results and send notifications for high-scoring trends
        high_viral_trends = []
        for result in batch_result.get("results", []):
            if "error" not in result and result.get("viral_score", 0) >= 75:
                high_viral_trends.append(result)
        
        if high_viral_trends:
            background_tasks.add_task(
                websocket_manager.send_prediction_result,
                current_user,
                {"type": "batch_high_viral", "trends": high_viral_trends}
            )
        
        logger.info(f"Batch prediction completed for user {current_user.id}: {len(batch_request.trends)} trends processed")
        
        return batch_result
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Batch prediction failed for user {current_user.id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Batch prediction failed. Please try again."
        )

@router.get("/trending/{platform}")
async def get_trending_predictions(
    platform: str,
    limit: int = 20,
    min_viral_score: float = 60.0,
    current_user: User = Depends(get_current_active_user)
):
    """Get trending predictions for a specific platform"""
    try:
        # Validate platform
        allowed_platforms = ['tiktok', 'twitter', 'instagram', 'youtube', 'spotify']
        if platform.lower() not in allowed_platforms:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Platform must be one of: {', '.join(allowed_platforms)}"
            )
        
        # Get trending predictions from AI system
        async with ai_connector:
            trending_data = await ai_connector.get_trending_predictions(
                platform.lower(),
                limit=min(limit, 50),  # Cap at 50
                min_viral_score=min_viral_score
            )
        
        logger.info(f"Trending data requested by user {current_user.id} for platform {platform}")
        
        return trending_data
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Get trending predictions failed: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to get trending predictions"
        )

@router.post("/alerts/check")
async def check_trend_alerts(
    trends: List[TrendInput],
    background_tasks: BackgroundTasks,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
    thresholds: AlertThresholds = AlertThresholds()
):
    """Check trends against alert thresholds"""
    try:
        # Convert trends to dict format
        trends_data = [trend.dict() for trend in trends]
        
        # Check alerts using AI system
        async with ai_connector:
            alert_result = await ai_connector.check_alerts(
                trends_data,
                thresholds.dict()
            )
        
        # Create alert records for triggered alerts
        alerts_created = []
        for alert_data in alert_result.get("alerts", []):
            try:
                # Create alert in database
                alert = Alert(
                    user_id=current_user.id,
                    type="viral_spike",
                    title=alert_data.get("message", "Viral Alert"),
                    message=alert_data.get("message", ""),
                    trend_data=alert_data,
                    priority=alert_data.get("priority", "medium")
                )
                
                db.add(alert)
                alerts_created.append(alert)
                
            except Exception as e:
                logger.error(f"Failed to create alert: {e}")
        
        if alerts_created:
            db.commit()
            
            # Send real-time notifications
            for alert in alerts_created:
                background_tasks.add_task(
                    websocket_manager.send_alert_notification,
                    alert,
                    current_user
                )
        
        logger.info(f"Alert check completed for user {current_user.id}: {len(alerts_created)} alerts created")
        
        return {
            **alert_result,
            "alerts_created": len(alerts_created)
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Alert check failed: {e}")
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Alert check failed"
        )

# User prediction history
@router.get("/predictions/history")
async def get_prediction_history(
    limit: int = 50,
    offset: int = 0,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get user's prediction history"""
    try:
        # Get predictions from AI connector
        async with ai_connector:
            predictions = await ai_connector.get_user_predictions_history(
                current_user,
                db,
                limit=min(limit, 100),  # Cap at 100
                offset=offset
            )
        
        # Format response
        prediction_history = []
        for prediction in predictions:
            prediction_data = {
                "id": prediction.uuid,
                "viral_score": prediction.viral_score,
                "confidence": prediction.confidence,
                "growth_predictions": prediction.growth_predictions,
                "explanation": prediction.explanation,
                "recommendations": prediction.recommendations,
                "created_at": prediction.created_at.isoformat(),
                "trend_name": prediction.input_data.get("name", "Unknown"),
                "platform": prediction.input_data.get("platform", "Unknown")
            }
            prediction_history.append(prediction_data)
        
        return {
            "predictions": prediction_history,
            "total_count": len(predictions),
            "limit": limit,
            "offset": offset
        }
        
    except Exception as e:
        logger.error(f"Get prediction history failed: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to get prediction history"
        )

# AI system status and metrics
@router.get("/status")
async def get_ai_system_status(current_user: User = Depends(get_current_active_user)):
    """Get AI system status and health"""
    try:
        # Get AI system health
        async with ai_connector:
            health_status = await ai_connector.health_check()
            model_status = await ai_connector.get_model_status()
        
        return {
            "ai_system": health_status,
            "models": model_status,
            "user_quota": {
                "predictions_used": current_user.predictions_used_this_month,
                "predictions_limit": current_user.current_plan.features.get("predictions_per_month", 100) if current_user.current_plan else 100,
                "can_make_prediction": current_user.can_make_prediction()
            },
            "last_check": datetime.now(timezone.utc).isoformat()
        }
        
    except Exception as e:
        logger.error(f"Get AI status failed: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to get AI system status"
        )

# Trend analysis and insights
@router.post("/analyze-trend")
async def analyze_trend_performance(
    trend_name: str,
    platform: str,
    current_user: User = Depends(get_current_premium_user),  # Premium feature
    db: Session = Depends(get_db),
    days_back: int = 7
):
    """Analyze historical performance of a specific trend (Premium feature)"""
    try:
        # Get trend predictions from database
        predictions = db.query(TrendPrediction).join(TrendPrediction.trend).filter(
            TrendPrediction.user_id == current_user.id,
            TrendPrediction.trend.has(name=trend_name, platform=platform),
            TrendPrediction.created_at >= datetime.now(timezone.utc) - timedelta(days=days_back)
        ).order_by(TrendPrediction.created_at.desc()).all()
        
        if not predictions:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="No prediction history found for this trend"
            )
        
        # Analyze performance
        viral_scores = [p.viral_score for p in predictions]
        confidence_scores = [p.confidence for p in predictions]
        
        analysis = {
            "trend_name": trend_name,
            "platform": platform,
            "analysis_period_days": days_back,
            "total_predictions": len(predictions),
            "performance_metrics": {
                "avg_viral_score": sum(viral_scores) / len(viral_scores),
                "max_viral_score": max(viral_scores),
                "min_viral_score": min(viral_scores),
                "avg_confidence": sum(confidence_scores) / len(confidence_scores),
                "trend_direction": "increasing" if viral_scores[0] > viral_scores[-1] else "decreasing"
            },
            "predictions": [
                {
                    "viral_score": p.viral_score,
                    "confidence": p.confidence,
                    "created_at": p.created_at.isoformat()
                }
                for p in predictions[:10]  # Last 10 predictions
            ]
        }
        
        logger.info(f"Trend analysis completed for user {current_user.id}: {trend_name}")
        
        return analysis
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Trend analysis failed: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Trend analysis failed"
        )

# Export trending data
@router.get("/export/trending")
async def export_trending_data(
    platform: str,
    format: str = "json",
    current_user: User = Depends(get_current_premium_user),  # Premium feature
):
    """Export trending data in various formats (Premium feature)"""
    try:
        # Get trending data
        async with ai_connector:
            trending_data = await ai_connector.get_trending_predictions(
                platform.lower(),
                limit=100,
                min_viral_score=50.0
            )
        
        if format.lower() == "csv":
            # Convert to CSV format (simplified)
            import csv
            import io
            
            output = io.StringIO()
            writer = csv.writer(output)
            
            # Write header
            writer.writerow(["trend_name", "viral_score", "confidence", "growth_24h", "platform"])
            
            # Write data
            for trend in trending_data.get("predictions", []):
                writer.writerow([
                    trend.get("trend_name", ""),
                    trend.get("viral_score", 0),
                    trend.get("confidence", 0),
                    trend.get("growth_24h", 0),
                    platform
                ])
            
            csv_content = output.getvalue()
            output.close()
            
            return {
                "format": "csv",
                "content": csv_content,
                "filename": f"predix_trending_{platform}_{datetime.now().strftime('%Y%m%d')}.csv"
            }
        
        else:  # JSON format
            return {
                "format": "json",
                "content": trending_data,
                "filename": f"predix_trending_{platform}_{datetime.now().strftime('%Y%m%d')}.json"
            }
        
    except Exception as e:
        logger.error(f"Export trending data failed: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Export failed"
        )
