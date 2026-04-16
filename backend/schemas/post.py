"""
Post Schemas
Pydantic schemas for post-related requests and responses
"""
from pydantic import BaseModel, Field, validator
from datetime import datetime
from typing import Optional, List, Dict, Any
from models.post import Platform, PostStatus, ContentType


# ============================================
# Base Schema
# ============================================
class PostBase(BaseModel):
    """Base post schema"""
    title: str = Field(..., min_length=1, max_length=500)
    content: Optional[str] = Field(None, max_length=5000)
    platform: Platform
    content_type: ContentType
    
    class Config:
        from_attributes = True


# ============================================
# Create Schema
# ============================================
class PostCreate(PostBase):
    """Schema for creating a new post"""
    media_url: Optional[str] = None
    media_thumbnail_url: Optional[str] = None
    scheduled_at: Optional[datetime] = None
    hashtags: Optional[List[str]] = Field(None, max_items=30)
    mentions: Optional[List[str]] = None
    location_name: Optional[str] = None
    location_lat: Optional[float] = None
    location_lng: Optional[float] = None
    metadata: Optional[Dict[str, Any]] = None
    
    @validator('hashtags')
    def validate_hashtags(cls, v):
        """Validate hashtags format"""
        if v:
            # Remove # if present and validate
            validated = []
            for tag in v:
                clean_tag = tag.strip('#').strip()
                if clean_tag:
                    validated.append(f"#{clean_tag}")
            return validated
        return v


# ============================================
# Update Schema
# ============================================
class PostUpdate(BaseModel):
    """Schema for updating a post"""
    title: Optional[str] = Field(None, min_length=1, max_length=500)
    content: Optional[str] = Field(None, max_length=5000)
    scheduled_at: Optional[datetime] = None
    hashtags: Optional[List[str]] = None
    status: Optional[PostStatus] = None
    
    class Config:
        from_attributes = True


# ============================================
# Schedule Schema
# ============================================
class PostSchedule(BaseModel):
    """Schema for scheduling a post"""
    scheduled_at: datetime
    
    @validator('scheduled_at')
    def validate_future_date(cls, v):
        """Ensure scheduled date is in the future"""
        if v <= datetime.utcnow():
            raise ValueError('Scheduled date must be in the future')
        return v


# ============================================
# Response Schema
# ============================================
class Post(PostBase):
    """Schema for post responses"""
    id: int
    user_id: int
    status: PostStatus
    media_url: Optional[str] = None
    media_thumbnail_url: Optional[str] = None
    media_type: Optional[str] = None
    
    # Scheduling
    scheduled_at: Optional[datetime] = None
    published_at: Optional[datetime] = None
    
    # AI Predictions
    viral_score: Optional[int] = None
    predicted_reach: Optional[int] = None
    predicted_engagement: Optional[float] = None
    prediction_confidence: Optional[float] = None
    ai_recommendations: Optional[List[str]] = None
    
    # Hashtags
    hashtags: Optional[List[str]] = None
    mentions: Optional[List[str]] = None
    
    # Location
    location_name: Optional[str] = None
    
    # Performance (after publication)
    actual_reach: Optional[int] = None
    actual_likes: Optional[int] = None
    actual_comments: Optional[int] = None
    actual_shares: Optional[int] = None
    actual_engagement: Optional[float] = None
    
    # Timestamps
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


# ============================================
# List Response Schema
# ============================================
class PostList(BaseModel):
    """Schema for paginated post lists"""
    total: int
    page: int
    page_size: int
    posts: List[Post]
    
    class Config:
        from_attributes = True
