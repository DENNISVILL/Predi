"""
Trends Router
Real-time trending data, search, and filtering
"""
from fastapi import APIRouter, Depends, HTTPException, status, Query, BackgroundTasks
from sqlalchemy.orm import Session
from typing import List, Optional, Dict, Any
from datetime import datetime, timezone, timedelta
import logging

from database import get_db
from database.models import User, Trend
from services.auth_service import get_current_active_user
from services.ai_connector import AIConnector
from pydantic import BaseModel, Field

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/trends", tags=["Trends"])


# ============================================
# Pydantic Schemas
# ============================================
class TrendResponse(BaseModel):
    """Trend response schema"""
    id: int
    uuid: str
    platform: str
    content_type: str
    name: str
    description: Optional[str]
    views: int
    likes: int
    shares: int
    comments: int
    engagement_rate: float
    growth_rate_24h: float
    growth_rate_7d: float
    viral_score: float
    confidence: float
    metadata: Dict[str, Any]
    is_active: bool
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


class TrendListResponse(BaseModel):
    """Paginated trend list"""
    total: int
    page: int
    page_size: int
    trends: List[TrendResponse]


class TrendSearch(BaseModel):
    """Search parameters"""
    query: str = Field(..., min_length=1, max_length=200)
    platform: Optional[str] = None
    content_type: Optional[str] = None
    min_viral_score: Optional[float] = Field(None, ge=0, le=100)


# ============================================
# Get Trends (Paginated)
# ============================================
@router.get("", response_model=TrendListResponse)
async def get_trends(
    page: int = Query(1, ge=1, description="Page number"),
    page_size: int = Query(20, ge=1, le=100, description="Items per page"),
    platform: Optional[str] = Query(None, description="Filter by platform"),
    content_type: Optional[str] = Query(None, description="Filter by content type"),
    min_viral_score: Optional[float] = Query(None, ge=0, le=100, description="Minimum viral score"),
    sort_by: str = Query("viral_score", regex="^(viral_score|growth_rate_24h|engagement_rate|created_at)$"),
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Get trending content with pagination and filters
    
    - **page**: Page number (default: 1)
    - **page_size**: Items per page (default: 20, max: 100)
    - **platform**: Filter by social media platform
    - **content_type**: Filter by content type (video, image, etc)
    - **min_viral_score**: Minimum viral score threshold
    - **sort_by**: Sort field (viral_score, growth_rate_24h, engagement_rate, created_at)
    
    Returns paginated list of trending content
    """
    try:
        # Build query
        query = db.query(Trend).filter(Trend.is_active == True)
        
        # Apply filters
        if platform:
            query = query.filter(Trend.platform == platform)
        
        if content_type:
            query = query.filter(Trend.content_type == content_type)
        
        if min_viral_score is not None:
            query = query.filter(Trend.viral_score >= min_viral_score)
        
        # Apply sorting
        if sort_by == "growth_rate_24h":
            query = query.order_by(Trend.growth_rate_24h.desc())
        elif sort_by == "engagement_rate":
            query = query.order_by(Trend.engagement_rate.desc())
        elif sort_by == "created_at":
            query = query.order_by(Trend.created_at.desc())
        else:  # viral_score
            query = query.order_by(Trend.viral_score.desc())
        
        # Get total count
        total = query.count()
        
        # Apply pagination
        offset = (page - 1) * page_size
        trends = query.offset(offset).limit(page_size).all()
        
        logger.info(f"Trends retrieved: {len(trends)} results for user {current_user.id}")
        
        return TrendListResponse(
            total=total,
            page=page,
            page_size=page_size,
            trends=trends
        )
        
    except Exception as e:
        logger.error(f"Failed to get trends: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve trends"
        )


# ============================================
# Get Trend Detail
# ============================================
@router.get("/{trend_id}", response_model=TrendResponse)
async def get_trend_detail(
    trend_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Get detailed information about a specific trend
    
    Returns complete trend data including metadata
    """
    try:
        trend = db.query(Trend).filter(Trend.id == trend_id).first()
        
        if not trend:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Trend not found"
            )
        
        logger.info(f"Trend detail retrieved: {trend_id} by user {current_user.id}")
        
        return trend
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to get trend detail: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve trend detail"
        )


# ============================================
# Search Trends
# ============================================
@router.post("/search", response_model=TrendListResponse)
async def search_trends(
    search_params: TrendSearch,
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Search trends by keyword
    
    - **query**: Search query string
    - **platform**: Optional platform filter
    - **content_type**: Optional content type filter
    - **min_viral_score**: Optional minimum viral score
    
    Returns matching trends
    """
    try:
        # Build search query
        query = db.query(Trend).filter(Trend.is_active == True)
        
        # Text search in name and description
        search_term = f"%{search_params.query}%"
        query = query.filter(
            (Trend.name.ilike(search_term)) | 
            (Trend.description.ilike(search_term))
        )
        
        # Apply additional filters
        if search_params.platform:
            query = query.filter(Trend.platform == search_params.platform)
        
        if search_params.content_type:
            query = query.filter(Trend.content_type == search_params.content_type)
        
        if search_params.min_viral_score is not None:
            query = query.filter(Trend.viral_score >= search_params.min_viral_score)
        
        # Sort by relevance (viral_score * growth_rate)
        query = query.order_by(
            (Trend.viral_score * Trend.growth_rate_24h).desc()
        )
        
        # Get total count
        total = query.count()
        
        # Pagination
        offset = (page - 1) * page_size
        trends = query.offset(offset).limit(page_size).all()
        
        logger.info(f"Trends search: '{search_params.query}' - {len(trends)} results")
        
        return TrendListResponse(
            total=total,
            page=page,
            page_size=page_size,
            trends=trends
        )
        
    except Exception as e:
        logger.error(f"Failed to search trends: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to search trends"
        )


# ============================================
# Get Top Trends
# ============================================
@router.get("/top/list", response_model=List[TrendResponse])
async def get_top_trends(
    limit: int = Query(10, ge=1, le=50, description="Number of top trends"),
    timeframe: str = Query("24h", regex="^(24h|7d|30d)$", description="Timeframe"),
    platform: Optional[str] = Query(None, description="Filter by platform"),
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Get top trending content
    
    - **limit**: Number of trends to return (default: 10, max: 50)
    - **timeframe**: Time window (24h, 7d, 30d)
    - **platform**: Optional platform filter
    
    Returns top trends sorted by growth rate
    """
    try:
        query = db.query(Trend).filter(Trend.is_active == True)
        
        # Platform filter
        if platform:
            query = query.filter(Trend.platform == platform)
        
        # Sort by appropriate growth rate
        if timeframe == "7d":
            query = query.order_by(Trend.growth_rate_7d.desc())
        else:  # 24h default
            query = query.order_by(Trend.growth_rate_24h.desc())
        
        # Limit results
        trends = query.limit(limit).all()
        
        logger.info(f"Top trends retrieved: {len(trends)} for timeframe {timeframe}")
        
        return trends
        
    except Exception as e:
        logger.error(f"Failed to get top trends: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve top trends"
        )


# ============================================
# Get Rising Trends
# ============================================
@router.get("/rising/list", response_model=List[TrendResponse])
async def get_rising_trends(
    limit: int = Query(10, ge=1, le=50),
    min_growth: float = Query(50.0, ge=0, description="Minimum growth rate percentage"),
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Get rising trends (high growth rate in last 24h)
    
    - **limit**: Number of trends to return
    - **min_growth**: Minimum growth rate threshold (percentage)
    
    Returns trends with highest 24h growth rate
    """
    try:
        trends = db.query(Trend).filter(
            Trend.is_active == True,
            Trend.growth_rate_24h >= min_growth
        ).order_by(
            Trend.growth_rate_24h.desc()
        ).limit(limit).all()
        
        logger.info(f"Rising trends retrieved: {len(trends)} with min growth {min_growth}%")
        
        return trends
        
    except Exception as e:
        logger.error(f"Failed to get rising trends: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve rising trends"
        )


# ============================================
# Get Trends by Platform
# ============================================
@router.get("/by-platform/{platform}", response_model=TrendListResponse)
async def get_trends_by_platform(
    platform: str,
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Get all trends for a specific platform
    
    Returns trends filtered by platform
    """
    try:
        query = db.query(Trend).filter(
            Trend.is_active == True,
            Trend.platform == platform
        ).order_by(Trend.viral_score.desc())
        
        total = query.count()
        
        offset = (page - 1) * page_size
        trends = query.offset(offset).limit(page_size).all()
        
        logger.info(f"Platform trends retrieved: {platform} - {len(trends)} results")
        
        return TrendListResponse(
            total=total,
            page=page,
            page_size=page_size,
            trends=trends
        )
        
    except Exception as e:
        logger.error(f"Failed to get platform trends: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve platform trends"
        )


# ============================================
# Get Trends by Category
# ============================================
@router.get("/by-category/{category}", response_model=TrendListResponse)
async def get_trends_by_category(
    category: str,
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Get trends filtered by category
    
    Returns trends in specified category
    """
    try:
        # Category is stored in metadata
        from sqlalchemy import cast
        from sqlalchemy.dialects.postgresql import JSONB
        
        query = db.query(Trend).filter(
            Trend.is_active == True,
            Trend.metadata.op('->>')('category') == category
        ).order_by(Trend.viral_score.desc())
        
        total = query.count()
        
        offset = (page - 1) * page_size
        trends = query.offset(offset).limit(page_size).all()
        
        logger.info(f"Category trends retrieved: {category} - {len(trends)} results")
        
        return TrendListResponse(
            total=total,
            page=page,
            page_size=page_size,
            trends=trends
        )
        
    except Exception as e:
        logger.error(f"Failed to get category trends: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve category trends"
        )


# ============================================
# Refresh Trends (Admin)
# ============================================
@router.post("/refresh")
async def refresh_trends(
    background_tasks: BackgroundTasks,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Trigger trends cache refresh (Admin only)
    
    Fetches latest trends from AI system
    """
    try:
        # Check if user is admin
        if current_user.role != "admin":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Admin access required"
            )
        
        # Trigger background refresh
        ai_connector = AIConnector()
        
        # Add refresh task to background
        async def refresh_task():
            try:
                # Fetch latest trends from AI
                latest_trends = await ai_connector.fetch_trending_content()
                
                # Update database
                for trend_data in latest_trends:
                    existing_trend = db.query(Trend).filter(
                        Trend.platform == trend_data.get("platform"),
                        Trend.name == trend_data.get("name")
                    ).first()
                    
                    if existing_trend:
                        # Update existing
                        existing_trend.views = trend_data.get("views", 0)
                        existing_trend.likes = trend_data.get("likes", 0)
                        existing_trend.shares = trend_data.get("shares", 0)
                        existing_trend.engagement_rate = trend_data.get("engagement_rate", 0)
                        existing_trend.growth_rate_24h = trend_data.get("growth_24h", 0)
                        existing_trend.viral_score = trend_data.get("viral_score", 0)
                        existing_trend.updated_at = datetime.now(timezone.utc)
                    else:
                        # Create new
                        new_trend = Trend(**trend_data)
                        db.add(new_trend)
                
                db.commit()
                logger.info("Trends cache refreshed successfully")
                
            except Exception as e:
                logger.error(f"Trends refresh failed: {e}")
                db.rollback()
        
        background_tasks.add_task(refresh_task)
        
        return {
            "message": "Trends refresh initiated",
            "status": "processing"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to initiate trends refresh: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to refresh trends"
        )


# ============================================
# Get Trend Statistics
# ============================================
@router.get("/stats/summary")
async def get_trends_stats(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Get overall trends statistics
    
    Returns aggregated stats across all platforms
    """
    try:
        total_trends = db.query(Trend).filter(Trend.is_active == True).count()
        
        # Platform distribution
        from sqlalchemy import func
        platform_stats = db.query(
            Trend.platform,
            func.count(Trend.id).label('count')
        ).filter(
            Trend.is_active == True
        ).group_by(Trend.platform).all()
        
        # Average viral score
        avg_viral_score = db.query(
            func.avg(Trend.viral_score)
        ).filter(Trend.is_active == True).scalar() or 0
        
        # Top content type
        content_types = db.query(
            Trend.content_type,
            func.count(Trend.id).label('count')
        ).filter(
            Trend.is_active == True
        ).group_by(Trend.content_type).order_by(func.count(Trend.id).desc()).all()
        
        return {
            "total_trends": total_trends,
            "avg_viral_score": round(avg_viral_score, 2),
            "platform_distribution": {
                platform: count for platform, count in platform_stats
            },
            "content_types": {
                ctype: count for ctype, count in content_types
            },
            "last_updated": datetime.now(timezone.utc)
        }
        
    except Exception as e:
        logger.error(f"Failed to get trends stats: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve trends statistics"
        )
