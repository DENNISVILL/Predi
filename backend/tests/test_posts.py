"""
Tests for Posts Router
Complete test coverage for post CRUD operations
"""
import pytest
from fastapi.testclient import TestClient
from datetime import datetime, timedelta, timezone
from sqlalchemy.orm import Session

from main import app
from database.connection import get_db
from database.models import User, Post, PostStatus, Platform, ContentType
from services.auth_service import create_access_token


# Test client
client = TestClient(app)


# Fixtures
@pytest.fixture
def test_user(db: Session):
    """Create a test user"""
    user = User(
        email="test@example.com",
        username="testuser",
        full_name="Test User",
        hashed_password="$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyWL0UzKHXTm",  # "password123"
        is_verified=True,
        is_active=True
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


@pytest.fixture
def auth_headers(test_user):
    """Create authentication headers"""
    token = create_access_token(data={"sub": test_user.email})
    return {"Authorization": f"Bearer {token}"}


@pytest.fixture
def test_post(db: Session, test_user):
    """Create a test post"""
    post = Post(
        user_id=test_user.id,
        title="Test TikTok Video",
        content="This is a test video about trending content",
        platform=Platform.TIKTOK,
        content_type=ContentType.VIDEO,
        status=PostStatus.DRAFT,
        hashtags=["#test", "#trending"],
        viral_score=75
    )
    db.add(post)
    db.commit()
    db.refresh(post)
    return post


# ============================================
# Create Post Tests
# ============================================
def test_create_post_success(auth_headers, db):
    """Test creating a post successfully"""
    post_data = {
        "title": "My First Viral Video",
        "content": "Check out this amazing content!",
        "platform": "tiktok",
        "content_type": "video",
        "hashtags": ["#viral", "#trending", "#fyp"]
    }
    
    response = client.post(
        "/api/v1/posts",
        json=post_data,
        headers=auth_headers
    )
    
    assert response.status_code == 201
    data = response.json()
    assert data["title"] == post_data["title"]
    assert data["status"] == "draft"
    assert "viral_score" in data
    assert "id" in data


def test_create_post_with_scheduling(auth_headers):
    """Test creating a scheduled post"""
    future_date = (datetime.now(timezone.utc) + timedelta(days=1)).isoformat()
    
    post_data = {
        "title": "Scheduled Video",
        "content": "This will be posted tomorrow",
        "platform": "instagram",
        "content_type": "reel",
        "scheduled_at": future_date
    }
    
    response = client.post(
        "/api/v1/posts",
        json=post_data,
        headers=auth_headers
    )
    
    assert response.status_code == 201
    data = response.json()
    assert data["status"] == "scheduled"
    assert data["scheduled_at"] is not None


def test_create_post_unauthorized():
    """Test creating post without authentication"""
    post_data = {
        "title": "Test",
        "platform": "tiktok",
        "content_type": "video"
    }
    
    response = client.post("/api/v1/posts", json=post_data)
    assert response.status_code == 401


def test_create_post_invalid_platform(auth_headers):
    """Test creating post with invalid platform"""
    post_data = {
        "title": "Test",
        "platform": "invalid_platform",
        "content_type": "video"
    }
    
    response = client.post(
        "/api/v1/posts",
        json=post_data,
        headers=auth_headers
    )
    
    assert response.status_code == 422  # Validation error


# ============================================
# Get Posts Tests
# ============================================
def test_get_posts_list(auth_headers, test_post):
    """Test getting paginated list of posts"""
    response = client.get(
        "/api/v1/posts",
        headers=auth_headers
    )
    
    assert response.status_code == 200
    data = response.json()
    assert "total" in data
    assert "page" in data
    assert "posts" in data
    assert len(data["posts"]) > 0


def test_get_posts_with_filters(auth_headers, test_post):
    """Test getting posts with filters"""
    response = client.get(
        "/api/v1/posts?status_filter=draft&platform_filter=tiktok",
        headers=auth_headers
    )
    
    assert response.status_code == 200
    data = response.json()
    
    # Verify all posts match filter
    for post in data["posts"]:
        assert post["status"] == "draft"
        assert post["platform"] == "tiktok"


def test_get_posts_pagination(auth_headers, test_post):
    """Test posts pagination"""
    response = client.get(
        "/api/v1/posts?page=1&page_size=10",
        headers=auth_headers
    )
    
    assert response.status_code == 200
    data = response.json()
    assert data["page"] == 1
    assert data["page_size"] == 10


# ============================================
# Get Single Post Tests
# ============================================
def test_get_post_by_id(auth_headers, test_post):
    """Test getting a specific post"""
    response = client.get(
        f"/api/v1/posts/{test_post.id}",
        headers=auth_headers
    )
    
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == test_post.id
    assert data["title"] == test_post.title


def test_get_post_not_found(auth_headers):
    """Test getting non-existent post"""
    response = client.get(
        "/api/v1/posts/99999",
        headers=auth_headers
    )
    
    assert response.status_code == 404


def test_get_post_unauthorized():
    """Test getting post without authentication"""
    response = client.get("/api/v1/posts/1")
    assert response.status_code == 401


# ============================================
# Update Post Tests
# ============================================
def test_update_post_success(auth_headers, test_post):
    """Test updating a post"""
    update_data = {
        "title": "Updated Title",
        "content": "Updated content"
    }
    
    response = client.put(
        f"/api/v1/posts/{test_post.id}",
        json=update_data,
        headers=auth_headers
    )
    
    assert response.status_code == 200
    data = response.json()
    assert data["title"] == update_data["title"]
    assert data["content"] == update_data["content"]


def test_update_post_not_found(auth_headers):
    """Test updating non-existent post"""
    response = client.put(
        "/api/v1/posts/99999",
        json={"title": "Test"},
        headers=auth_headers
    )
    
    assert response.status_code == 404


# ============================================
# Delete Post Tests
# ============================================
def test_delete_post_success(auth_headers, test_post):
    """Test deleting a draft post"""
    response = client.delete(
        f"/api/v1/posts/{test_post.id}",
        headers=auth_headers
    )
    
    assert response.status_code == 204


def test_delete_published_post_fails(auth_headers, test_post, db):
    """Test that published posts cannot be deleted"""
    # Update post to published
    test_post.status = PostStatus.PUBLISHED
    db.commit()
    
    response = client.delete(
        f"/api/v1/posts/{test_post.id}",
        headers=auth_headers
    )
    
    assert response.status_code == 400


# ============================================
# Schedule Post Tests
# ============================================
def test_schedule_post_success(auth_headers, test_post):
    """Test scheduling a draft post"""
    future_date = (datetime.now(timezone.utc) + timedelta(days=1)).isoformat()
    
    response = client.post(
        f"/api/v1/posts/{test_post.id}/schedule",
        json={"scheduled_at": future_date},
        headers=auth_headers
    )
    
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "scheduled"
    assert data["scheduled_at"] is not None


def test_schedule_post_past_date_fails(auth_headers, test_post):
    """Test scheduling with past date fails"""
    past_date = (datetime.now(timezone.utc) - timedelta(days=1)).isoformat()
    
    response = client.post(
        f"/api/v1/posts/{test_post.id}/schedule",
        json={"scheduled_at": past_date},
        headers=auth_headers
    )
    
    assert response.status_code == 400


# ============================================
# Publish Post Tests
# ============================================
def test_publish_post_success(auth_headers, test_post):
    """Test publishing a post immediately"""
    response = client.post(
        f"/api/v1/posts/{test_post.id}/publish",
        headers=auth_headers
    )
    
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "published"
    assert data["published_at"] is not None


# ============================================
# Get Drafts Tests
# ============================================
def test_get_drafts(auth_headers, test_post):
    """Test getting all draft posts"""
    response = client.get(
        "/api/v1/posts/drafts/list",
        headers=auth_headers
    )
    
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    
    # All posts should be drafts
    for post in data:
        assert post["status"] == "draft"


# ============================================
# Get Scheduled Posts Tests
# ============================================
def test_get_scheduled_posts(auth_headers, test_post, db):
    """Test getting all scheduled posts"""
    # Schedule the post first
    test_post.status = PostStatus.SCHEDULED
    test_post.scheduled_at = datetime.now(timezone.utc) + timedelta(days=1)
    db.commit()
    
    response = client.get(
        "/api/v1/posts/scheduled/list",
        headers=auth_headers
    )
    
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    
    # All posts should be scheduled
    for post in data:
        assert post["status"] == "scheduled"


# ============================================
# Cancel Scheduled Post Tests
# ============================================
def test_cancel_scheduled_post(auth_headers, test_post, db):
    """Test cancelling a scheduled post"""
    # Schedule the post first
    test_post.status = PostStatus.SCHEDULED
    test_post.scheduled_at = datetime.now(timezone.utc) + timedelta(days=1)
    db.commit()
    
    response = client.post(
        f"/api/v1/posts/{test_post.id}/cancel",
        headers=auth_headers
    )
    
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "draft"
    assert data["scheduled_at"] is None


# ============================================
# Integration Tests
# ============================================
def test_complete_post_lifecycle(auth_headers):
    """Test complete post lifecycle: create -> schedule -> publish"""
    # 1. Create draft
    post_data = {
        "title": "Lifecycle Test",
        "content": "Testing complete lifecycle",
        "platform": "instagram",
        "content_type": "image"
    }
    
    response = client.post(
        "/api/v1/posts",
        json=post_data,
        headers=auth_headers
    )
    assert response.status_code == 201
    post_id = response.json()["id"]
    
    # 2. Schedule for future
    future_date = (datetime.now(timezone.utc) + timedelta(hours=2)).isoformat()
    response = client.post(
        f"/api/v1/posts/{post_id}/schedule",
        json={"scheduled_at": future_date},
        headers=auth_headers
    )
    assert response.status_code == 200
    assert response.json()["status"] == "scheduled"
    
    # 3. Publish immediately
    response = client.post(
        f"/api/v1/posts/{post_id}/publish",
        headers=auth_headers
    )
    assert response.status_code == 200
    assert response.json()["status"] == "published"
    
    # 4. Verify cannot delete published
    response = client.delete(
        f"/api/v1/posts/{post_id}",
        headers=auth_headers
    )
    assert response.status_code == 400


# ============================================
# Performance Tests
# ============================================
def test_get_posts_performance(auth_headers, db, test_user):
    """Test that getting posts is performant even with many posts"""
    # Create 50 posts
    posts = []
    for i in range(50):
        post = Post(
            user_id=test_user.id,
            title=f"Test Post {i}",
            platform=Platform.TIKTOK,
            content_type=ContentType.VIDEO,
            status=PostStatus.DRAFT
        )
        posts.append(post)
    
    db.bulk_save_objects(posts)
    db.commit()
    
    # Should still be fast
    import time
    start = time.time()
    
    response = client.get(
        "/api/v1/posts?page_size=50",
        headers=auth_headers
    )
    
    elapsed = time.time() - start
    
    assert response.status_code == 200
    assert elapsed < 1.0  # Should complete in under 1 second
    assert len(response.json()["posts"]) == 50
