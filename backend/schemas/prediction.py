"""
Prediction Schemas
Pydantic schemas for AI prediction requests and responses
"""
from pydantic import BaseModel, Field, validator
from datetime import datetime
from typing import Optional, List, Dict, Any


# ============================================
# Base Schema
# ============================================
class PredictionBase(BaseModel):
    """Base prediction schema"""
    
    class Config:
        from_attributes = True


# ============================================
# Create Schema (Request)
# ============================================
class PredictionCreate(BaseModel):
    """Schema for requesting an AI prediction"""
    post_id: Optional[int] = None  # If predicting for existing post
    
    # Content to analyze
    title: str = Field(..., min_length=1, max_length=500)
    content: Optional[str] = Field(None, max_length=5000)
    platform: str
    content_type: str
    hashtags: Optional[List[str]] = None
    has_media: bool = False
    scheduled_time: Optional[datetime] = None
    
    @validator('platform')
    def validate_platform(cls, v):
        """Validate platform"""
        allowed = ['tiktok', 'instagram', 'youtube', 'facebook', 'linkedin', 'twitter']
        if v.lower() not in allowed:
            raise ValueError(f'Platform must be one of: {", ".join(allowed)}')
        return v.lower()


# ============================================
# Response Schema
# ============================================
class Prediction(PredictionBase):
    """Schema for prediction responses"""
    id: int
    user_id: int
    post_id: Optional[int] = None
    
    # Model info
    model_version: str
    model_name: str
    
    # Results
    viral_score: int
    confidence: float
    
    # Predicted metrics
    predicted_reach: Optional[int] = None
    predicted_engagement: Optional[float] = None
    predicted_views: Optional[int] = None
    predicted_likes: Optional[int] = None
    predicted_shares: Optional[int] = None
    predicted_comments: Optional[int] = None
    
    # Analysis
    factors_analysis: Optional[Dict[str, Any]] = None
    recommendations: Optional[List[str]] = None
    
    # Metadata
    platform: Optional[str] = None
    content_type: Optional[str] = None
    processing_time_ms: Optional[int] = None
    
    # Timestamps
    created_at: datetime
    
    class Config:
        from_attributes = True


# ============================================
# Enhanced Response Schema
# ============================================
class PredictionResponse(Prediction):
    """Enhanced prediction response with additional insights"""
    score_category: str  # Excellent, Good, Average, Poor
    is_likely_viral: bool
    is_high_confidence: bool
    top_recommendations: List[str]
    
    class Config:
        from_attributes = True
