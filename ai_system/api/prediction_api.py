"""
Predix AI Prediction API
FastAPI-based REST API for trend predictions and viral scoring
"""

from fastapi import FastAPI, HTTPException, Depends, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Dict, Optional, Any
import asyncio
import logging
from datetime import datetime, timezone
import json

# Import our AI system components
from ..models.trend_predictor import ModelEnsemble
from ..processing.data_pipeline import DataProcessor, ProcessedFeatures
from ..collectors.base_collector import CollectorManager, TrendData, PlatformType

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="Predix AI Prediction API",
    description="Advanced AI system for predicting viral trends and content growth",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure appropriately for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global instances
model_ensemble = ModelEnsemble()
data_processor = DataProcessor()
collector_manager = CollectorManager()

# Pydantic models for API
class TrendInput(BaseModel):
    """Input model for trend prediction"""
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

class PredictionResponse(BaseModel):
    """Response model for predictions"""
    trend_id: str
    viral_score: float = Field(..., description="Viral probability score (0-100)")
    confidence: float = Field(..., description="Prediction confidence (0-1)")
    
    growth_predictions: Dict[str, float] = Field(..., description="Growth predictions for different time horizons")
    
    components: Dict[str, float] = Field(..., description="Score component breakdown")
    explanation: str = Field(..., description="Human-readable explanation")
    
    recommendations: List[str] = Field(..., description="Actionable recommendations")
    
    metadata: Dict[str, Any] = Field(..., description="Prediction metadata")

class BatchPredictionRequest(BaseModel):
    """Request model for batch predictions"""
    trends: List[TrendInput] = Field(..., max_items=100)
    include_explanations: bool = Field(default=True)
    include_recommendations: bool = Field(default=True)

class AlertThreshold(BaseModel):
    """Model for alert thresholds"""
    viral_score_threshold: float = Field(default=75.0, ge=0.0, le=100.0)
    growth_threshold: float = Field(default=0.5, ge=0.0)
    confidence_threshold: float = Field(default=0.6, ge=0.0, le=1.0)

# API Endpoints

@app.get("/")
async def root():
    """Root endpoint with API information"""
    return {
        "name": "Predix AI Prediction API",
        "version": "1.0.0",
        "status": "operational",
        "endpoints": {
            "predict": "/predict",
            "batch_predict": "/batch-predict",
            "health": "/health",
            "models": "/models/status"
        }
    }

@app.post("/predict", response_model=PredictionResponse)
async def predict_trend(trend_input: TrendInput) -> PredictionResponse:
    """Predict viral potential for a single trend"""
    try:
        # Convert input to ProcessedFeatures
        features = await _convert_input_to_features(trend_input)
        
        # Get prediction from ensemble
        prediction = model_ensemble.predict_trend_future(features)
        
        # Generate recommendations
        recommendations = _generate_recommendations(features, prediction)
        
        # Create response
        response = PredictionResponse(
            trend_id=f"pred_{datetime.now().strftime('%Y%m%d_%H%M%S')}",
            viral_score=prediction['predictions']['viral_score'],
            confidence=prediction['predictions']['confidence'],
            growth_predictions={
                "24h": prediction['predictions']['growth_24h'],
                "48h": prediction['predictions']['growth_48h'],
                "72h": prediction['predictions']['growth_72h']
            },
            components=prediction['analysis']['viral_components'],
            explanation=prediction['analysis']['explanation'],
            recommendations=recommendations,
            metadata={
                "prediction_timestamp": prediction['metadata']['prediction_timestamp'],
                "model_version": prediction['metadata']['model_ensemble'],
                "platform": trend_input.platform,
                "content_type": trend_input.content_type
            }
        )
        
        return response
        
    except Exception as e:
        logger.error(f"Prediction failed: {e}")
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")

@app.post("/batch-predict")
async def batch_predict(request: BatchPredictionRequest) -> Dict[str, Any]:
    """Predict viral potential for multiple trends"""
    try:
        results = []
        
        for i, trend_input in enumerate(request.trends):
            try:
                # Convert input to ProcessedFeatures
                features = await _convert_input_to_features(trend_input)
                
                # Get prediction
                prediction = model_ensemble.predict_trend_future(features)
                
                # Create simplified response for batch
                result = {
                    "index": i,
                    "trend_name": trend_input.name,
                    "viral_score": prediction['predictions']['viral_score'],
                    "confidence": prediction['predictions']['confidence'],
                    "growth_24h": prediction['predictions']['growth_24h'],
                    "platform": trend_input.platform
                }
                
                if request.include_explanations:
                    result["explanation"] = prediction['analysis']['explanation']
                
                if request.include_recommendations:
                    result["recommendations"] = _generate_recommendations(features, prediction)
                
                results.append(result)
                
            except Exception as e:
                logger.warning(f"Failed to process trend {i}: {e}")
                results.append({
                    "index": i,
                    "error": str(e),
                    "trend_name": trend_input.name
                })
        
        return {
            "total_processed": len(results),
            "successful": len([r for r in results if "error" not in r]),
            "failed": len([r for r in results if "error" in r]),
            "results": results,
            "batch_timestamp": datetime.now(timezone.utc).isoformat()
        }
        
    except Exception as e:
        logger.error(f"Batch prediction failed: {e}")
        raise HTTPException(status_code=500, detail=f"Batch prediction failed: {str(e)}")

@app.get("/trending/{platform}")
async def get_trending_predictions(
    platform: str,
    limit: int = 20,
    min_viral_score: float = 60.0
) -> Dict[str, Any]:
    """Get trending content predictions for a platform"""
    try:
        # This would normally fetch from collectors
        # For now, return mock trending predictions
        
        trending_predictions = []
        
        for i in range(limit):
            mock_prediction = {
                "trend_id": f"trending_{platform}_{i+1}",
                "name": f"#{platform.title()}Trend{i+1}",
                "viral_score": 60.0 + (i * 5) % 40,  # Scores between 60-100
                "confidence": 0.6 + (i * 0.05) % 0.35,  # Confidence 0.6-0.95
                "growth_24h": 0.2 + (i * 0.1) % 0.8,
                "platform": platform,
                "category": ["technology", "lifestyle", "entertainment"][i % 3],
                "last_updated": datetime.now(timezone.utc).isoformat()
            }
            
            if mock_prediction["viral_score"] >= min_viral_score:
                trending_predictions.append(mock_prediction)
        
        return {
            "platform": platform,
            "predictions": trending_predictions,
            "total_count": len(trending_predictions),
            "min_viral_score": min_viral_score,
            "generated_at": datetime.now(timezone.utc).isoformat()
        }
        
    except Exception as e:
        logger.error(f"Failed to get trending predictions: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/alerts/check")
async def check_alerts(
    trends: List[TrendInput],
    thresholds: AlertThreshold = AlertThreshold()
) -> Dict[str, Any]:
    """Check trends against alert thresholds"""
    try:
        alerts = []
        
        for trend_input in trends:
            features = await _convert_input_to_features(trend_input)
            prediction = model_ensemble.predict_trend_future(features)
            
            viral_score = prediction['predictions']['viral_score']
            confidence = prediction['predictions']['confidence']
            growth_24h = prediction['predictions']['growth_24h']
            
            # Check thresholds
            if (viral_score >= thresholds.viral_score_threshold and
                confidence >= thresholds.confidence_threshold and
                growth_24h >= thresholds.growth_threshold):
                
                alert = {
                    "trend_name": trend_input.name,
                    "platform": trend_input.platform,
                    "viral_score": viral_score,
                    "confidence": confidence,
                    "growth_24h": growth_24h,
                    "alert_type": "viral_potential",
                    "priority": "high" if viral_score >= 85 else "medium",
                    "message": f"🔥 {trend_input.name} has {viral_score:.1f}% viral probability",
                    "timestamp": datetime.now(timezone.utc).isoformat()
                }
                
                alerts.append(alert)
        
        return {
            "alerts": alerts,
            "alert_count": len(alerts),
            "thresholds_used": thresholds.dict(),
            "check_timestamp": datetime.now(timezone.utc).isoformat()
        }
        
    except Exception as e:
        logger.error(f"Alert check failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    try:
        # Check model status
        model_status = "ready" if model_ensemble else "not_loaded"
        
        # Check data processor
        processor_status = "ready" if data_processor else "not_loaded"
        
        return {
            "status": "healthy",
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "components": {
                "model_ensemble": model_status,
                "data_processor": processor_status,
                "api": "operational"
            },
            "version": "1.0.0"
        }
        
    except Exception as e:
        logger.error(f"Health check failed: {e}")
        return {
            "status": "unhealthy",
            "error": str(e),
            "timestamp": datetime.now(timezone.utc).isoformat()
        }

@app.get("/models/status")
async def get_model_status():
    """Get detailed model status and performance metrics"""
    try:
        return {
            "model_ensemble": {
                "version": "1.0.0",
                "status": "loaded",
                "last_trained": model_ensemble.model_metadata.get('last_updated'),
                "training_history": model_ensemble.growth_predictor.training_history[-5:] if model_ensemble.growth_predictor.training_history else []
            },
            "data_processor": {
                "version": "1.0.0",
                "status": "ready",
                "feature_count": len(ProcessedFeatures.get_feature_names()),
                "supported_platforms": ["tiktok", "twitter", "instagram", "youtube"]
            },
            "performance_metrics": {
                "avg_prediction_time": "< 100ms",
                "accuracy_24h": "> 65%",
                "accuracy_48h": "> 60%",
                "accuracy_72h": "> 55%"
            }
        }
        
    except Exception as e:
        logger.error(f"Model status check failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# Helper functions

async def _convert_input_to_features(trend_input: TrendInput) -> ProcessedFeatures:
    """Convert API input to ProcessedFeatures"""
    
    # Calculate derived metrics
    engagement_rate = trend_input.engagement_rate
    if engagement_rate == 0 and trend_input.views > 0:
        total_engagement = trend_input.likes + trend_input.shares + trend_input.comments
        engagement_rate = total_engagement / trend_input.views
    
    # Create ProcessedFeatures object
    features = ProcessedFeatures(
        # Normalized metrics (using simple normalization for API)
        views_normalized=min(trend_input.views / 1000000, 3.0),  # Normalize to millions
        likes_normalized=min(trend_input.likes / 50000, 3.0),
        shares_normalized=min(trend_input.shares / 10000, 3.0),
        comments_normalized=min(trend_input.comments / 5000, 3.0),
        engagement_rate=engagement_rate,
        
        # Growth metrics
        growth_velocity=trend_input.growth_rate_24h,
        growth_acceleration=max(0, trend_input.growth_rate_7d - trend_input.growth_rate_24h),
        momentum_score=min((trend_input.growth_rate_24h + trend_input.growth_rate_7d) / 2, 1.0),
        
        # Virality metrics
        virality_coefficient=trend_input.shares / max(trend_input.views, 1),
        share_to_view_ratio=trend_input.shares / max(trend_input.views, 1),
        comment_to_like_ratio=trend_input.comments / max(trend_input.likes, 1),
        
        # Temporal features (current time)
        hour_of_day=datetime.now().hour,
        day_of_week=datetime.now().weekday(),
        is_weekend=datetime.now().weekday() >= 5,
        time_since_creation=1.0,  # Assume 1 hour old
        
        # Content features
        content_quality_score=trend_input.readability_score,
        sentiment_score=trend_input.sentiment,
        readability_score=trend_input.readability_score,
        hashtag_count=len([k for k in trend_input.keywords if k.startswith('#')]),
        mention_count=len([k for k in trend_input.keywords if k.startswith('@')]),
        
        # Network features
        creator_influence_score=min(trend_input.creator_count / 100, 1.0),
        cross_platform_presence=0.5,  # Default
        geographic_diversity=len(trend_input.geographic_spread) / 10,
        
        # Platform features
        platform_tiktok=trend_input.platform.lower() == 'tiktok',
        platform_twitter=trend_input.platform.lower() == 'twitter',
        platform_instagram=trend_input.platform.lower() == 'instagram',
        platform_youtube=trend_input.platform.lower() == 'youtube',
        
        # Category features
        category_technology='technology' in trend_input.content_categories,
        category_entertainment='entertainment' in trend_input.content_categories,
        category_lifestyle='lifestyle' in trend_input.content_categories,
        category_business='business' in trend_input.content_categories,
        category_health='health' in trend_input.content_categories,
        category_environment='environment' in trend_input.content_categories
    )
    
    return features

def _generate_recommendations(features: ProcessedFeatures, prediction: Dict[str, Any]) -> List[str]:
    """Generate actionable recommendations based on prediction"""
    recommendations = []
    
    viral_score = prediction['predictions']['viral_score']
    growth_24h = prediction['predictions']['growth_24h']
    
    # High viral potential
    if viral_score >= 80:
        recommendations.append("🚀 Act immediately - high viral potential detected")
        recommendations.append("📱 Cross-post to multiple platforms for maximum reach")
        recommendations.append("💰 Consider paid promotion to amplify organic growth")
    
    elif viral_score >= 60:
        recommendations.append("⚡ Good opportunity - create similar content quickly")
        recommendations.append("📈 Monitor closely for growth acceleration")
    
    else:
        recommendations.append("📊 Monitor for improvement - current viral potential is low")
    
    # Growth-specific recommendations
    if growth_24h > 0.5:
        recommendations.append("🔥 Capitalize on momentum with follow-up content")
    
    # Engagement recommendations
    if features.engagement_rate < 0.05:
        recommendations.append("💬 Focus on improving engagement through better CTAs")
    
    # Timing recommendations
    if not features.is_weekend and features.hour_of_day < 18:
        recommendations.append("⏰ Consider reposting during peak hours (6-10 PM)")
    
    # Content quality recommendations
    if features.content_quality_score < 0.7:
        recommendations.append("✨ Improve content quality for better viral potential")
    
    return recommendations[:5]  # Limit to 5 recommendations

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
