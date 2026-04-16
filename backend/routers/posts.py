"""
Posts Router
Complete CRUD operations for social media post scheduling and management
"""
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime, timezone
import logging

from database.connection import get_db
from database.models import User, Post, PostStatus, Platform
from schemas.post import PostCreate, PostUpdate, PostSchedule, Post as PostResponse, PostList
from services.auth_service import get_current_active_user
from services.ai_connector import AIConnector

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/posts", tags=["Posts"])


# ============================================
# Create Post
# ============================================
@router.post("", response_model=PostResponse, status_code=status.HTTP_201_CREATED)
async def create_post(
    post_data: PostCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Create a new post (draft)
    
    - **title**: Post title/caption (required)
    - **content**: Post content (optional)
    - **platform**: Target platform (required)
    - **content_type**: Type of content (required)
    - **media_url**: URL to media file (optional)
    - **hashtags**: List of hashtags (optional)
    - **scheduled_at**: Schedule for future publication (optional)
    """
    try:
        # Create post
        new_post = Post(
            user_id=current_user.id,
            title=post_data.title,
            content=post_data.content,
            platform=post_data.platform,
            content_type=post_data.content_type,
            media_url=post_data.media_url,
            media_thumbnail_url=post_data.media_thumbnail_url,
            scheduled_at=post_data.scheduled_at,
            hashtags=post_data.hashtags,
            mentions=post_data.mentions,
            location_name=post_data.location_name,
            location_lat=post_data.location_lat,
            location_lng=post_data.location_lng,
            metadata=post_data.metadata or {},
            status=PostStatus.SCHEDULED if post_data.scheduled_at else PostStatus.DRAFT
        )
        
        # Get AI predictions for the post
        try:
            ai_connector = AIConnector()
            prediction_result = await ai_connector.predict_post_performance(
                platform=post_data.platform.value,
                content=post_data.content or post_data.title,
                hashtags=post_data.hashtags or []
            )
            
            if prediction_result:
                new_post.viral_score = prediction_result.get("viral_score")
                new_post.predicted_reach = prediction_result.get("predicted_reach")
                new_post.predicted_engagement = prediction_result.get("predicted_engagement")
                new_post.prediction_confidence = prediction_result.get("confidence")
                new_post.ai_recommendations = prediction_result.get("recommendations", [])
        except Exception as e:
            logger.warning(f"AI prediction failed for post: {e}")
            # Continue without predictions
        
        db.add(new_post)
        db.commit()
        db.refresh(new_post)
        
        logger.info(f"Post created: {new_post.id} by user {current_user.id}")
        return new_post
        
    except Exception as e:
        logger.error(f"Failed to create post: {e}")
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create post"
        )


# ============================================
# Get User Posts (with pagination)
# ============================================
@router.get("", response_model=PostList)
async def get_posts(
    page: int = Query(1, ge=1, description="Page number"),
    page_size: int = Query(20, ge=1, le=100, description="Items per page"),
    status_filter: Optional[PostStatus] = Query(None, description="Filter by status"),
    platform_filter: Optional[Platform] = Query(None, description="Filter by platform"),
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Get user's posts with pagination and filters
    
    - **page**: Page number (default: 1)
    - **page_size**: Items per page (default: 20, max: 100)
    - **status_filter**: Filter by post status
    - **platform_filter**: Filter by platform
    """
    try:
        # Build query
        query = db.query(Post).filter(Post.user_id == current_user.id)
        
        # Apply filters
        if status_filter:
            query = query.filter(Post.status == status_filter)
        
        if platform_filter:
            query = query.filter(Post.platform == platform_filter)
        
        # Get total count
        total = query.count()
        
        # Apply pagination
        offset = (page - 1) * page_size
        posts = query.order_by(Post.created_at.desc()).offset(offset).limit(page_size).all()
        
        return PostList(
            total=total,
            page=page,
            page_size=page_size,
            posts=posts
        )
        
    except Exception as e:
        logger.error(f"Failed to get posts: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve posts"
        )


# ============================================
# Get Post by ID
# ============================================
@router.get("/{post_id}", response_model=PostResponse)
async def get_post(
    post_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Get a specific post by ID
    
    Only returns posts owned by the current user
    """
    post = db.query(Post).filter(
        Post.id == post_id,
        Post.user_id == current_user.id
    ).first()
    
    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Post not found"
        )
    
    return post


# ============================================
# Update Post
# ============================================
@router.put("/{post_id}", response_model=PostResponse)
async def update_post(
    post_id: int,
    post_update: PostUpdate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Update a post
    
    Can only update posts in DRAFT or SCHEDULED status
    """
    try:
        # Get post
        post = db.query(Post).filter(
            Post.id == post_id,
            Post.user_id == current_user.id
        ).first()
        
        if not post:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Post not found"
            )
        
        # Check if post can be updated
        if post.status not in [PostStatus.DRAFT, PostStatus.SCHEDULED]:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Cannot update post in current status"
            )
        
        # Update fields
        if post_update.title is not None:
            post.title = post_update.title
        
        if post_update.content is not None:
            post.content = post_update.content
        
        if post_update.scheduled_at is not None:
            post.scheduled_at = post_update.scheduled_at
            if post.status == PostStatus.DRAFT:
                post.status = PostStatus.SCHEDULED
        
        if post_update.hashtags is not None:
            post.hashtags = post_update.hashtags
        
        if post_update.status is not None:
            post.status = post_update.status
        
        db.commit()
        db.refresh(post)
        
        logger.info(f"Post updated: {post.id}")
        return post
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to update post: {e}")
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update post"
        )


# ============================================
# Delete Post
# ============================================
@router.delete("/{post_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_post(
    post_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Delete a post
    
    Cannot delete published posts
    """
    try:
        post = db.query(Post).filter(
            Post.id == post_id,
            Post.user_id == current_user.id
        ).first()
        
        if not post:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Post not found"
            )
        
        # Cannot delete published posts
        if post.status == PostStatus.PUBLISHED:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Cannot delete published posts"
            )
        
        db.delete(post)
        db.commit()
        
        logger.info(f"Post deleted: {post_id}")
        return None
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to delete post: {e}")
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to delete post"
        )


# ============================================
# Schedule Post
# ============================================
@router.post("/{post_id}/schedule", response_model=PostResponse)
async def schedule_post(
    post_id: int,
    schedule_data: PostSchedule,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Schedule a post for future publication
    
    Post must be in DRAFT status
    """
    try:
        post = db.query(Post).filter(
            Post.id == post_id,
            Post.user_id == current_user.id
        ).first()
        
        if not post:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Post not found"
            )
        
        if post.status != PostStatus.DRAFT:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Only draft posts can be scheduled"
            )
        
        # Validate future date
        if schedule_data.scheduled_at <= datetime.now(timezone.utc):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Scheduled time must be in the future"
            )
        
        post.scheduled_at = schedule_data.scheduled_at
        post.status = PostStatus.SCHEDULED
        
        db.commit()
        db.refresh(post)
        
        logger.info(f"Post scheduled: {post.id} for {schedule_data.scheduled_at}")
        return post
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to schedule post: {e}")
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to schedule post"
        )


# ============================================
# Publish Post Immediately
# ============================================
@router.post("/{post_id}/publish", response_model=PostResponse)
async def publish_post(
    post_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Publish a post immediately
    
    Post must be in DRAFT or SCHEDULED status
    """
    try:
        post = db.query(Post).filter(
            Post.id == post_id,
            Post.user_id == current_user.id
        ).first()
        
        if not post:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Post not found"
            )
        
        if post.status not in [PostStatus.DRAFT, PostStatus.SCHEDULED]:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Post cannot be published in current status"
            )
        
        # TODO: Integrate with actual social media platform APIs
        # For now, just mark as published
        post.status = PostStatus.PUBLISHED
        post.published_at = datetime.now(timezone.utc)
        
        db.commit()
        db.refresh(post)
        
        logger.info(f"Post published: {post.id}")
        return post
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to publish post: {e}")
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to publish post"
        )


# ============================================
# Get Drafts
# ============================================
@router.get("/drafts/list", response_model=List[PostResponse])
async def get_drafts(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Get all draft posts for the current user
    """
    drafts = db.query(Post).filter(
        Post.user_id == current_user.id,
        Post.status == PostStatus.DRAFT
    ).order_by(Post.updated_at.desc()).all()
    
    return drafts


# ============================================
# Get Scheduled Posts
# ============================================
@router.get("/scheduled/list", response_model=List[PostResponse])
async def get_scheduled_posts(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Get all scheduled posts for the current user
    """
    scheduled = db.query(Post).filter(
        Post.user_id == current_user.id,
        Post.status == PostStatus.SCHEDULED
    ).order_by(Post.scheduled_at.asc()).all()
    
    return scheduled


# ============================================
# Cancel Scheduled Post
# ============================================
@router.post("/{post_id}/cancel", response_model=PostResponse)
async def cancel_scheduled_post(
    post_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Cancel a scheduled post (revert to draft)
    """
    try:
        post = db.query(Post).filter(
            Post.id == post_id,
            Post.user_id == current_user.id
        ).first()
        
        if not post:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Post not found"
            )
        
        if post.status != PostStatus.SCHEDULED:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Only scheduled posts can be cancelled"
            )
        
        post.status = PostStatus.DRAFT
        post.scheduled_at = None
        
        db.commit()
        db.refresh(post)
        
        logger.info(f"Post schedule cancelled: {post.id}")
        return post
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to cancel post: {e}")
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to cancel post"
        )
