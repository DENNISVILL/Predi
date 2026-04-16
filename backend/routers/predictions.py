"""
Predictions Router
AI-powered trend predictions and analytics
"""
from fastapi import APIRouter, Depends, HTTPException, status, Query, BackgroundTasks
from sqlalchemy.orm import Session
from typing import List, Optional, Dict, Any
from datetime import datetime, timezone
import logging
import json

from database.connection import get_db
from database.models import User, TrendPrediction
from services.auth_service import get_current_active_user
from services.ai_connector import AIConnector
from pydantic import BaseModel, Field

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/predictions", tags=["Predictions"])


# ============================================
# Pydantic Schemas
# ============================================
class PredictionCreate(BaseModel):
    """Schema for creating a prediction"""
    platform: str = Field(..., description="Social media platform")
    content: str = Field(..., min_length=1, description="Content to analyze")
    hashtags: Optional[List[str]] = Field(None, description="Hashtags")
    category: Optional[str] = Field(None, description="Content category")
    target_audience: Optional[str] = Field(None, description="Target audience")


class BatchPredictionCreate(BaseModel):
    """Schema for batch predictions"""
    predictions: List[PredictionCreate] = Field(..., max_items=10)


class PredictionResponse(BaseModel):
    """Schema for prediction response"""
    id: int
    user_id: int
    viral_score: float
    confidence: float
    growth_predictions: Dict[str, Any]
    components: Dict[str, Any]
    explanation: str
    recommendations: List[str]
    input_data: Dict[str, Any]
    created_at: datetime
    
    class Config:
        from_attributes = True


class PredictionStats(BaseModel):
    """User prediction statistics"""
    total_predictions: int
    avg_viral_score: float
    avg_confidence: float
    predictions_this_month: int
    remaining_predictions: int
    top_platform: Optional[str]


class PredictionFeedback(BaseModel):
    """Feedback on prediction accuracy"""
    actual_performance: float = Field(..., ge=0, le=100)
    was_helpful: bool
    comments: Optional[str] = None


# ============================================
# Create Single Prediction
# ============================================
@router.post("", response_model=PredictionResponse, status_code=status.HTTP_201_CREATED)
async def create_prediction(
    prediction_data: PredictionCreate,
    background_tasks: BackgroundTasks,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Create a new AI prediction for content
    
    - **platform**: Target social media platform
    - **content**: Content to analyze
    - **hashtags**: Optional hashtags
    - **category**: Content category
    - **target_audience**: Target audience demographic
    
    Returns viral score, confidence, growth predictions, and recommendations
    """
    try:
        # Check if user has predictions remaining
        if not current_user.can_make_prediction():
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Monthly prediction limit reached. Please upgrade your plan."
            )
        
        # Initialize AI connector
        ai_connector = AIConnector()
        
        # Prepare input data
        input_data = {
            "platform": prediction_data.platform,
            "content": prediction_data.content,
            "hashtags": prediction_data.hashtags or [],
            "category": prediction_data.category,
            "target_audience": prediction_data.target_audience
        }
        
        # Get AI prediction
        try:
            result = await ai_connector.predict_viral_score(
                platform=prediction_data.platform,
                content=prediction_data.content,
                hashtags=prediction_data.hashtags or [],
                category=prediction_data.category
            )
        except Exception as e:
            logger.error(f"AI prediction failed: {e}")
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="AI service temporarily unavailable"
            )
        
        # Create prediction record
        new_prediction = TrendPrediction(
            user_id=current_user.id,
            viral_score=result.get("viral_score", 0),
            confidence=result.get("confidence", 0),
            growth_predictions=result.get("growth_predictions", {}),
            components=result.get("components", {}),
            explanation=result.get("explanation", ""),
            recommendations=result.get("recommendations", []),
            input_data=input_data
        )
        
        db.add(new_prediction)
        
        # Update user prediction count
        current_user.predictions_used_this_month += 1
        
        db.commit()
        db.refresh(new_prediction)
        
        logger.info(f"Prediction created: {new_prediction.id} for user {current_user.id}")
        
        # Background task: Update prediction cache
        # background_tasks.add_task(update_prediction_cache, new_prediction.id)
        
        return new_prediction
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to create prediction: {e}")
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create prediction"
        )


# ============================================
# Get User Predictions
# ============================================
@router.get("", response_model=List[PredictionResponse])
async def get_predictions(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    sort_by: str = Query("created_at", regex="^(created_at|viral_score|confidence)$"),
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Get user's prediction history
    
    - **page**: Page number (default: 1)
    - **page_size**: Items per page (default: 20)
    - **sort_by**: Sort by field (created_at, viral_score, confidence)
    """
    try:
        query = db.query(TrendPrediction).filter(
            TrendPrediction.user_id == current_user.id
        )
        
        # Apply sorting
        if sort_by == "viral_score":
            query = query.order_by(TrendPrediction.viral_score.desc())
        elif sort_by == "confidence":
            query = query.order_by(TrendPrediction.confidence.desc())
        else:
            query = query.order_by(TrendPrediction.created_at.desc())
        
        # Pagination
        offset = (page - 1) * page_size
        predictions = query.offset(offset).limit(page_size).all()
        
        return predictions
        
    except Exception as e:
        logger.error(f"Failed to get predictions: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve predictions"
        )


# ============================================
# Get Prediction by ID
# ============================================
@router.get("/{prediction_id}", response_model=PredictionResponse)
async def get_prediction(
    prediction_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Get a specific prediction by ID
    """
    prediction = db.query(TrendPrediction).filter(
        TrendPrediction.id == prediction_id,
        TrendPrediction.user_id == current_user.id
    ).first()
    
    if not prediction:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Prediction not found"
        )
    
    return prediction


# ============================================
# Create Batch Predictions
# ============================================
@router.post("/batch", response_model=List[PredictionResponse])
async def create_batch_predictions(
    batch_data: BatchPredictionCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Create multiple predictions in one request (max 10)
    
    Useful for comparing different content variations
    """
    try:
        # Check if user has enough predictions
        predictions_needed = len(batch_data.predictions)
        
        if not current_user.current_plan:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="No active plan"
            )
        
        plan_limit = current_user.current_plan.features.get("predictions_per_month", 0)
        remaining = plan_limit - current_user.predictions_used_this_month
        
        if predictions_needed > remaining:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Insufficient predictions. Need {predictions_needed}, have {remaining}"
            )
        
        ai_connector = AIConnector()
        created_predictions = []
        
        for pred_data in batch_data.predictions:
            input_data = {
                "platform": pred_data.platform,
                "content": pred_data.content,
                "hashtags": pred_data.hashtags or [],
                "category": pred_data.category,
                "target_audience": pred_data.target_audience
            }
            
            # Get AI prediction
            result = await ai_connector.predict_viral_score(
                platform=pred_data.platform,
                content=pred_data.content,
                hashtags=pred_data.hashtags or []
            )
            
            # Create prediction record
            new_prediction = TrendPrediction(
                user_id=current_user.id,
                viral_score=result.get("viral_score", 0),
                confidence=result.get("confidence", 0),
                growth_predictions=result.get("growth_predictions", {}),
                components=result.get("components", {}),
                explanation=result.get("explanation", ""),
                recommendations=result.get("recommendations", []),
                input_data=input_data
            )
            
            db.add(new_prediction)
            created_predictions.append(new_prediction)
        
        # Update user count
        current_user.predictions_used_this_month += predictions_needed
        
        db.commit()
        
        # Refresh all predictions
        for pred in created_predictions:
            db.refresh(pred)
        
        logger.info(f"Batch predictions created: {len(created_predictions)} for user {current_user.id}")
        
        return created_predictions
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to create batch predictions: {e}")
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create batch predictions"
        )


# ============================================
# Get Prediction History
# ============================================
@router.get("/history/all", response_model=Dict[str, Any])
async def get_prediction_history(
    days: int = Query(30, ge=1, le=365, description="Number of days to fetch"),
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Get prediction history with aggregated statistics
    """
    try:
        from datetime import timedelta
        
        since = datetime.now(timezone.utc) - timedelta(days=days)
        
        predictions = db.query(TrendPrediction).filter(
            TrendPrediction.user_id == current_user.id,
            TrendPrediction.created_at >= since
        ).order_by(TrendPrediction.created_at.desc()).all()
        
        # Calculate statistics
        if predictions:
            avg_viral_score = sum(p.viral_score for p in predictions) / len(predictions)
            avg_confidence = sum(p.confidence for p in predictions) / len(predictions)
            
            # Platform distribution
            platform_counts = {}
            for pred in predictions:
                platform = pred.input_data.get("platform", "unknown")
                platform_counts[platform] = platform_counts.get(platform, 0) + 1
            
            top_platform = max(platform_counts.items(), key=lambda x: x[1])[0] if platform_counts else None
        else:
            avg_viral_score = 0
            avg_confidence = 0
            platform_counts = {}
            top_platform = None
        
        return {
            "total_predictions": len(predictions),
            "avg_viral_score": round(avg_viral_score, 2),
            "avg_confidence": round(avg_confidence, 2),
            "top_platform": top_platform,
            "platform_distribution": platform_counts,
            "predictions": [
                {
                    "id": p.id,
                    "viral_score": p.viral_score,
                    "confidence": p.confidence,
                    "platform": p.input_data.get("platform"),
                    "created_at": p.created_at
                }
                for p in predictions
            ]
        }
        
    except Exception as e:
        logger.error(f"Failed to get prediction history: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve prediction history"
        )


# ============================================
# Get User Stats
# ============================================
@router.get("/stats/summary", response_model=PredictionStats)
async def get_prediction_stats(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Get user's prediction statistics
    """
    try:
        # Total predictions
        total = db.query(TrendPrediction).filter(
            TrendPrediction.user_id == current_user.id
        ).count()
        
        # Get all predictions for calculations
        predictions = db.query(TrendPrediction).filter(
            TrendPrediction.user_id == current_user.id
        ).all()
        
        if predictions:
            avg_viral_score = sum(p.viral_score for p in predictions) / len(predictions)
            avg_confidence = sum(p.confidence for p in predictions) / len(predictions)
            
            # Most used platform
            platform_counts = {}
            for pred in predictions:
                platform = pred.input_data.get("platform", "unknown")
                platform_counts[platform] = platform_counts.get(platform, 0) + 1
            
            top_platform = max(platform_counts.items(), key=lambda x: x[1])[0] if platform_counts else None
        else:
            avg_viral_score = 0
            avg_confidence = 0
            top_platform = None
        
        # Remaining predictions
        if current_user.current_plan:
            limit = current_user.current_plan.features.get("predictions_per_month", 0)
            if limit == -1:  # Unlimited
                remaining = -1
            else:
                remaining = limit - current_user.predictions_used_this_month
        else:
            remaining = 0
        
        return PredictionStats(
            total_predictions=total,
            avg_viral_score=round(avg_viral_score, 2),
            avg_confidence=round(avg_confidence, 2),
            predictions_this_month=current_user.predictions_used_this_month,
            remaining_predictions=remaining,
            top_platform=top_platform
        )
        
    except Exception as e:
        logger.error(f"Failed to get prediction stats: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve statistics"
        )


# ============================================
# Submit Prediction Feedback
# ============================================
@router.post("/{prediction_id}/feedback", status_code=status.HTTP_200_OK)
async def submit_prediction_feedback(
    prediction_id: int,
    feedback: PredictionFeedback,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Submit feedback on prediction accuracy
    
    Helps improve the AI model over time
    """
    try:
        prediction = db.query(TrendPrediction).filter(
            TrendPrediction.id == prediction_id,
            TrendPrediction.user_id == current_user.id
        ).first()
        
        if not prediction:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Prediction not found"
            )
        
        # Store feedback in metadata
        if not prediction.input_data.get("feedback"):
            prediction.input_data["feedback"] = {}
        
        prediction.input_data["feedback"] = {
            "actual_performance": feedback.actual_performance,
            "was_helpful": feedback.was_helpful,
            "comments": feedback.comments,
            "submitted_at": datetime.now(timezone.utc).isoformat()
        }
        
        # Mark as modified
        from sqlalchemy.orm.attributes import flag_modified
        flag_modified(prediction, "input_data")
        
        db.commit()
        
        logger.info(f"Feedback submitted for prediction {prediction_id}")
        
        return {"message": "Feedback submitted successfully"}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to submit feedback: {e}")
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to submit feedback"
        )


# ============================================
# Export Predictions
# ============================================
@router.get("/export/csv")
async def export_predictions_csv(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Export user predictions as CSV
    """
    from fastapi.responses import StreamingResponse
    import io
    import csv
    
    try:
        predictions = db.query(TrendPrediction).filter(
            TrendPrediction.user_id == current_user.id
        ).order_by(TrendPrediction.created_at.desc()).all()
        
        # Create CSV in memory
        output = io.StringIO()
        writer = csv.writer(output)
        
        # Write header
        writer.writerow([
            "ID", "Date", "Platform", "Content", "Viral Score",
            "Confidence", "24h Growth", "48h Growth", "72h Growth"
        ])
        
        # Write data
        for pred in predictions:
            writer.writerow([
                pred.id,
                pred.created_at.strftime("%Y-%m-%d %H:%M"),
                pred.input_data.get("platform", "N/A"),
                pred.input_data.get("content", "")[:50] + "...",
                pred.viral_score,
                pred.confidence,
                pred.growth_predictions.get("24h", "N/A"),
                pred.growth_predictions.get("48h", "N/A"),
                pred.growth_predictions.get("72h", "N/A")
            ])
        
        output.seek(0)
        
        return StreamingResponse(
            iter([output.getvalue()]),
            media_type="text/csv",
            headers={
                "Content-Disposition": f"attachment; filename=predictions_{datetime.now().strftime('%Y%m%d')}.csv"
            }
        )
        
    except Exception as e:
        logger.error(f"Failed to export predictions: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to export predictions"
        )
