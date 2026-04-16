"""
Tests for Predictions Router
Complete test coverage for AI predictions functionality
"""
import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session
from unittest.mock import patch, MagicMock

from main import app
from database.models import User, TrendPrediction, Plan
from services.auth_service import create_access_token


client = TestClient(app)


# Fixtures
@pytest.fixture
def test_user_with_plan(db: Session):
    """Create test user with Pro plan"""
    # Create plan
    plan = Plan(
        name="Pro",
        description="Pro plan",
        price=39.00,
        currency="USD",
        interval="monthly",
        features={
            "predictions_per_month": 1000,
            "real_time_alerts": True,
            "advanced_analytics": True
        },
        is_active=True
    )
    db.add(plan)
    db.commit()
    
    # Create user
    user = User(
        email="pro@example.com",
        username="prouser",
        hashed_password="$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyWL0UzKHXTm",
        is_verified=True,
        is_active=True,
        current_plan_id=plan.id,
        predictions_used_this_month=0
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


@pytest.fixture
def test_user_free(db: Session):
    """Create test user on free plan"""
    user = User(
        email="free@example.com",
        username="freeuser",
        hashed_password="$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyWL0UzKHXTm",
        is_verified=True,
        is_active=True,
        predictions_used_this_month=0
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


@pytest.fixture
def auth_headers_pro(test_user_with_plan):
    """Auth headers for pro user"""
    token = create_access_token(data={"sub": test_user_with_plan.email})
    return {"Authorization": f"Bearer {token}"}


@pytest.fixture
def auth_headers_free(test_user_free):
    """Auth headers for free user"""
    token = create_access_token(data={"sub": test_user_free.email})
    return {"Authorization": f"Bearer {token}"}


@pytest.fixture
def mock_ai_prediction():
    """Mock AI prediction response"""
    return {
        "viral_score": 85.5,
        "confidence": 0.82,
        "growth_predictions": {
            "24h": 5000,
            "48h": 12000,
            "72h": 18000
        },
        "components": {
            "content_quality": 90,
            "timing": 75,
            "hashtags": 85
        },
        "explanation": "High engagement potential based on trending topics",
        "recommendations": [
            "Post between 6-9 PM for better engagement",
            "Add trending audio clip",
            "Use 5-7 hashtags maximum"
        ]
    }


# ============================================
# Create Prediction Tests
# ============================================
@patch('services.ai_connector.AIConnector.predict_viral_score')
def test_create_prediction_success(mock_predict, auth_headers_pro, mock_ai_prediction):
    """Test creating a prediction successfully"""
    mock_predict.return_value = mock_ai_prediction
    
    prediction_data = {
        "platform": "tiktok",
        "content": "Check out this amazing dance move!",
        "hashtags": ["#dance", "#trending", "#fyp"],
        "category": "entertainment"
    }
    
    response = client.post(
        "/api/v1/predictions",
        json=prediction_data,
        headers=auth_headers_pro
    )
    
    assert response.status_code == 201
    data = response.json()
    assert data["viral_score"] == 85.5
    assert data["confidence"] == 0.82
    assert len(data["recommendations"]) > 0
    assert "growth_predictions" in data


@patch('services.ai_connector.AIConnector.predict_viral_score')
def test_create_prediction_increments_count(mock_predict, auth_headers_pro, mock_ai_prediction, db, test_user_with_plan):
    """Test that prediction count is incremented"""
    mock_predict.return_value = mock_ai_prediction
    initial_count = test_user_with_plan.predictions_used_this_month
    
    prediction_data = {
        "platform": "instagram",
        "content": "Beautiful sunset photo",
        "hashtags": ["#sunset", "#nature"]
    }
    
    response = client.post(
        "/api/v1/predictions",
        json=prediction_data,
        headers=auth_headers_pro
    )
    
    assert response.status_code == 201
    
    # Refresh user
    db.refresh(test_user_with_plan)
    assert test_user_with_plan.predictions_used_this_month == initial_count + 1


def test_create_prediction_limit_exceeded(auth_headers_free, db, test_user_free):
    """Test prediction fails when limit exceeded"""
    # Set user to limit
    test_user_free.predictions_used_this_month = 100
    db.commit()
    
    prediction_data = {
        "platform": "tiktok",
        "content": "Test content"
    }
    
    response = client.post(
        "/api/v1/predictions",
        json=prediction_data,
        headers=auth_headers_free
    )
    
    assert response.status_code == 403
    assert "limit reached" in response.json()["detail"].lower()


@patch('services.ai_connector.AIConnector.predict_viral_score')
def test_create_prediction_ai_failure(mock_predict, auth_headers_pro):
    """Test handling AI service failure"""
    mock_predict.side_effect = Exception("AI service unavailable")
    
    prediction_data = {
        "platform": "tiktok",
        "content": "Test content"
    }
    
    response = client.post(
        "/api/v1/predictions",
        json=prediction_data,
        headers=auth_headers_pro
    )
    
    assert response.status_code == 503


# ============================================
# Get Predictions Tests
# ============================================
def test_get_predictions_list(auth_headers_pro, db, test_user_with_plan):
    """Test getting user's predictions"""
    # Create some predictions
    for i in range(5):
        pred = TrendPrediction(
            user_id=test_user_with_plan.id,
            viral_score=80.0 + i,
            confidence=0.8,
            growth_predictions={"24h": 1000 * (i + 1)},
            components={},
            explanation="Test",
            recommendations=[],
            input_data={"platform": "tiktok", "content": f"Test {i}"}
        )
        db.add(pred)
    db.commit()
    
    response = client.get(
        "/api/v1/predictions",
        headers=auth_headers_pro
    )
    
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) >= 5


def test_get_predictions_pagination(auth_headers_pro, db, test_user_with_plan):
    """Test predictions pagination"""
    response = client.get(
        "/api/v1/predictions?page=1&page_size=10",
        headers=auth_headers_pro
    )
    
    assert response.status_code == 200
    data = response.json()
    assert len(data) <= 10


def test_get_predictions_sorted(auth_headers_pro, db, test_user_with_plan):
    """Test predictions sorting"""
    # Test sort by viral_score
    response = client.get(
        "/api/v1/predictions?sort_by=viral_score",
        headers=auth_headers_pro
    )
    
    assert response.status_code == 200
    data = response.json()
    
    # Verify descending order
    if len(data) > 1:
        assert data[0]["viral_score"] >= data[1]["viral_score"]


# ============================================
# Get Single Prediction Tests
# ============================================
def test_get_prediction_by_id(auth_headers_pro, db, test_user_with_plan):
    """Test getting specific prediction"""
    # Create prediction
    pred = TrendPrediction(
        user_id=test_user_with_plan.id,
        viral_score=85.0,
        confidence=0.85,
        growth_predictions={},
        components={},
        explanation="Test prediction",
        recommendations=[],
        input_data={"platform": "instagram"}
    )
    db.add(pred)
    db.commit()
    db.refresh(pred)
    
    response = client.get(
        f"/api/v1/predictions/{pred.id}",
        headers=auth_headers_pro
    )
    
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == pred.id
    assert data["viral_score"] == 85.0


def test_get_prediction_not_found(auth_headers_pro):
    """Test getting non-existent prediction"""
    response = client.get(
        "/api/v1/predictions/99999",
        headers=auth_headers_pro
    )
    
    assert response.status_code == 404


# ============================================
# Batch Predictions Tests
# ============================================
@patch('services.ai_connector.AIConnector.predict_viral_score')
def test_batch_predictions_success(mock_predict, auth_headers_pro, mock_ai_prediction):
    """Test batch predictions"""
    mock_predict.return_value = mock_ai_prediction
    
    batch_data = {
        "predictions": [
            {
                "platform": "tiktok",
                "content": "Video 1",
                "hashtags": ["#test1"]
            },
            {
                "platform": "instagram",
                "content": "Photo 1",
                "hashtags": ["#test2"]
            },
            {
                "platform": "youtube",
                "content": "Video 2",
                "hashtags": ["#test3"]
            }
        ]
    }
    
    response = client.post(
        "/api/v1/predictions/batch",
        json=batch_data,
        headers=auth_headers_pro
    )
    
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) == 3


def test_batch_predictions_too_many(auth_headers_pro):
    """Test batch prediction limit (max 10)"""
    batch_data = {
        "predictions": [
            {"platform": "tiktok", "content": f"Test {i}"}
            for i in range(11)  # 11 is too many
        ]
    }
    
    response = client.post(
        "/api/v1/predictions/batch",
        json=batch_data,
        headers=auth_headers_pro
    )
    
    assert response.status_code == 422  # Validation error


def test_batch_predictions_insufficient_quota(auth_headers_pro, db, test_user_with_plan):
    """Test batch fails if insufficient quota"""
    # Use up most of quota
    test_user_with_plan.predictions_used_this_month = 998
    db.commit()
    
    batch_data = {
        "predictions": [
            {"platform": "tiktok", "content": f"Test {i}"}
            for i in range(5)  # Need 5, only have 2 left
        ]
    }
    
    response = client.post(
        "/api/v1/predictions/batch",
        json=batch_data,
        headers=auth_headers_pro
    )
    
    assert response.status_code == 403


# ============================================
# Prediction History Tests
# ============================================
def test_get_prediction_history(auth_headers_pro, db, test_user_with_plan):
    """Test getting prediction history with stats"""
    # Create predictions
    for i in range(10):
        pred = TrendPrediction(
            user_id=test_user_with_plan.id,
            viral_score=70.0 + i,
            confidence=0.7 + (i * 0.01),
            growth_predictions={},
            components={},
            explanation="Test",
            recommendations=[],
            input_data={"platform": ["tiktok", "instagram"][i % 2]}
        )
        db.add(pred)
    db.commit()
    
    response = client.get(
        "/api/v1/predictions/history/all?days=30",
        headers=auth_headers_pro
    )
    
    assert response.status_code == 200
    data = response.json()
    assert "total_predictions" in data
    assert "avg_viral_score" in data
    assert "avg_confidence" in data
    assert "platform_distribution" in data
    assert "predictions" in data


# ============================================
# Prediction Stats Tests
# ============================================
def test_get_prediction_stats(auth_headers_pro, db, test_user_with_plan):
    """Test getting prediction statistics"""
    # Create some predictions
    for i in range(5):
        pred = TrendPrediction(
            user_id=test_user_with_plan.id,
            viral_score=75.0,
            confidence=0.8,
            growth_predictions={},
            components={},
            explanation="Test",
            recommendations=[],
            input_data={"platform": "tiktok"}
        )
        db.add(pred)
    db.commit()
    
    response = client.get(
        "/api/v1/predictions/stats/summary",
        headers=auth_headers_pro
    )
    
    assert response.status_code == 200
    data = response.json()
    assert data["total_predictions"] >= 5
    assert "avg_viral_score" in data
    assert "predictions_this_month" in data
    assert "remaining_predictions" in data


# ============================================
# Feedback Tests
# ============================================
def test_submit_prediction_feedback(auth_headers_pro, db, test_user_with_plan):
    """Test submitting feedback on prediction"""
    # Create prediction
    pred = TrendPrediction(
        user_id=test_user_with_plan.id,
        viral_score=80.0,
        confidence=0.8,
        growth_predictions={},
        components={},
        explanation="Test",
        recommendations=[],
        input_data={"platform": "tiktok"}
    )
    db.add(pred)
    db.commit()
    db.refresh(pred)
    
    feedback_data = {
        "actual_performance": 85.0,
        "was_helpful": True,
        "comments": "Very accurate prediction!"
    }
    
    response = client.post(
        f"/api/v1/predictions/{pred.id}/feedback",
        json=feedback_data,
        headers=auth_headers_pro
    )
    
    assert response.status_code == 200
    assert "message" in response.json()


# ============================================
# Export Tests
# ============================================
def test_export_predictions_csv(auth_headers_pro, db, test_user_with_plan):
    """Test exporting predictions to CSV"""
    # Create some predictions
    for i in range(3):
        pred = TrendPrediction(
            user_id=test_user_with_plan.id,
            viral_score=75.0 + i,
            confidence=0.8,
            growth_predictions={"24h": 1000, "48h": 2000, "72h": 3000},
            components={},
            explanation="Test",
            recommendations=[],
            input_data={"platform": "tiktok", "content": f"Test {i}"}
        )
        db.add(pred)
    db.commit()
    
    response = client.get(
        "/api/v1/predictions/export/csv",
        headers=auth_headers_pro
    )
    
    assert response.status_code == 200
    assert response.headers["content-type"] == "text/csv; charset=utf-8"
    assert "attachment" in response.headers["content-disposition"]
    
    # Verify CSV content
    csv_content = response.content.decode('utf-8')
    assert "ID" in csv_content
    assert "Viral Score" in csv_content
    assert "Platform" in csv_content


# ============================================
# Authorization Tests
# ============================================
def test_predictions_require_auth():
    """Test that predictions endpoints require authentication"""
    endpoints = [
        "/api/v1/predictions",
        "/api/v1/predictions/1",
        "/api/v1/predictions/stats/summary",
        "/api/v1/predictions/history/all"
    ]
    
    for endpoint in endpoints:
        response = client.get(endpoint)
        assert response.status_code == 401


def test_cannot_access_other_user_prediction(auth_headers_pro, db, test_user_free):
    """Test user cannot access another user's prediction"""
    # Create prediction for different user
    pred = TrendPrediction(
        user_id=test_user_free.id,
        viral_score=80.0,
        confidence=0.8,
        growth_predictions={},
        components={},
        explanation="Test",
        recommendations=[],
        input_data={"platform": "tiktok"}
    )
    db.add(pred)
    db.commit()
    db.refresh(pred)
    
    # Try to access with different user
    response = client.get(
        f"/api/v1/predictions/{pred.id}",
        headers=auth_headers_pro
    )
    
    assert response.status_code == 404  # Should not find it


# ============================================
# Performance Tests
# ============================================
@patch('services.ai_connector.AIConnector.predict_viral_score')
def test_prediction_performance(mock_predict, auth_headers_pro, mock_ai_prediction):
    """Test prediction creation is fast"""
    mock_predict.return_value = mock_ai_prediction
    
    import time
    start = time.time()
    
    prediction_data = {
        "platform": "tiktok",
        "content": "Performance test"
    }
    
    response = client.post(
        "/api/v1/predictions",
        json=prediction_data,
        headers=auth_headers_pro
    )
    
    elapsed = time.time() - start
    
    assert response.status_code == 201
    assert elapsed < 2.0  # Should complete in under 2 seconds
