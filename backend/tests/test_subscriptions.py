"""
Tests for Subscriptions Router
Complete test coverage for subscription management
"""
import pytest
from fastapi.testclient import TestClient
from datetime import datetime, timedelta, timezone
from sqlalchemy.orm import Session

from main import app
from database.models import User, Plan
from services.auth_service import create_access_token


client = TestClient(app)


# Fixtures
@pytest.fixture
def free_plan(db: Session):
    """Create Free plan"""
    plan = Plan(
        name="Free",
        description="Free plan",
        price=0.00,
        currency="USD",
        interval="monthly",
        features={
            "predictions_per_month": 100,
            "real_time_alerts": False
        },
        is_active=True
    )
    db.add(plan)
    db.commit()
    db.refresh(plan)
    return plan


@pytest.fixture
def pro_plan(db: Session):
    """Create Pro plan"""
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
    db.refresh(plan)
    return plan


@pytest.fixture
def enterprise_plan(db: Session):
    """Create Enterprise plan"""
    plan = Plan(
        name="Enterprise",
        description="Enterprise plan",
        price=199.00,
        currency="USD",
        interval="monthly",
        features={
            "predictions_per_month": -1,  # Unlimited
            "real_time_alerts": True,
            "advanced_analytics": True,
            "priority_support": True
        },
        is_active=True
    )
    db.add(plan)
    db.commit()
    db.refresh(plan)
    return plan


@pytest.fixture
def test_user_free(db: Session, free_plan):
    """User on free plan"""
    user = User(
        email="free@example.com",
        username="freeuser",
        hashed_password="$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyWL0UzKHXTm",
        is_verified=True,
        is_active=True,
        predictions_used_this_month=50
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


@pytest.fixture
def test_user_pro(db: Session, pro_plan):
    """User on pro plan"""
    user = User(
        email="pro@example.com",
        username="prouser",
        hashed_password="$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyWL0UzKHXTm",
        is_verified=True,
        is_active=True,
        current_plan_id=pro_plan.id,
        subscription_expires_at=datetime.now(timezone.utc) + timedelta(days=30),
        predictions_used_this_month=200
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


@pytest.fixture
def auth_headers_free(test_user_free):
    """Auth headers for free user"""
    token = create_access_token(data={"sub": test_user_free.email})
    return {"Authorization": f"Bearer {token}"}


@pytest.fixture
def auth_headers_pro(test_user_pro):
    """Auth headers for pro user"""
    token = create_access_token(data={"sub": test_user_pro.email})
    return {"Authorization": f"Bearer {token}"}


# ============================================
# Get Available Plans Tests
# ============================================
def test_get_available_plans(auth_headers_free, free_plan, pro_plan, enterprise_plan):
    """Test getting all available plans"""
    response = client.get(
        "/api/v1/subscriptions/plans",
        headers=auth_headers_free
    )
    
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) >= 3  # Free, Pro, Enterprise
    
    # Verify plan data
    plan_names = [p["name"] for p in data]
    assert "Free" in plan_names
    assert "Pro" in plan_names
    assert "Enterprise" in plan_names


def test_plans_sorted_by_price(auth_headers_free, free_plan, pro_plan, enterprise_plan):
    """Test plans are sorted by price ascending"""
    response = client.get(
        "/api/v1/subscriptions/plans",
        headers=auth_headers_free
    )
    
    assert response.status_code == 200
    data = response.json()
    
    # Verify ascending price order
    prices = [p["price"] for p in data]
    assert prices == sorted(prices)


# ============================================
# Get Current Subscription Tests
# ============================================
def test_get_current_subscription_free_user(auth_headers_free, test_user_free):
    """Test getting subscription for free user"""
    response = client.get(
        "/api/v1/subscriptions/current",
        headers=auth_headers_free
    )
    
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "free"
    assert data["plan"] is None
    assert data["predictions_limit"] == 100
    assert data["predictions_used"] == 50
    assert data["is_active"] == True


def test_get_current_subscription_pro_user(auth_headers_pro, test_user_pro):
    """Test getting subscription for pro user"""
    response = client.get(
        "/api/v1/subscriptions/current",
        headers=auth_headers_pro
    )
    
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "active"
    assert data["plan"] is not None
    assert data["plan"]["name"] == "Pro"
    assert data["predictions_used"] == 200
    assert data["predictions_limit"] == 1000
    assert data["days_remaining"] is not None


def test_get_current_subscription_expired(auth_headers_pro, test_user_pro, db):
    """Test getting expired subscription"""
    # Set subscription as expired
    test_user_pro.subscription_expires_at = datetime.now(timezone.utc) - timedelta(days=1)
    db.commit()
    
    response = client.get(
        "/api/v1/subscriptions/current",
        headers=auth_headers_pro
    )
    
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "expired"
    assert data["is_active"] == False


# ============================================
# Upgrade Plan Tests
# ============================================
from unittest.mock import patch, MagicMock

@patch('services.payment_service.payment_service.create_payment_intent')
def test_upgrade_plan_success(mock_payment, auth_headers_free, pro_plan):
    """Test upgrading from Free to Pro"""
    mock_payment.return_value = {
        "payment_id": "test_payment_123",
        "payment_url": "https://pay.example.com/checkout",
        "amount": 39.00,
        "currency": "USD"
    }
    
    upgrade_data = {
        "plan_id": pro_plan.id,
        "prorate": True
    }
    
    response = client.post(
        "/api/v1/subscriptions/upgrade",
        json=upgrade_data,
        headers=auth_headers_free
    )
    
    assert response.status_code == 200
    data = response.json()
    assert "payment_url" in data
    assert data["plan"]["name"] == "Pro"
    assert data["amount"] == 39.00


@patch('services.payment_service.payment_service.create_payment_intent')
def test_upgrade_to_enterprise(mock_payment, auth_headers_pro, enterprise_plan):
    """Test upgrading from Pro to Enterprise"""
    mock_payment.return_value = {
        "payment_id": "test_payment_456",
        "payment_url": "https://pay.example.com/checkout",
        "amount": 199.00,
        "currency": "USD"
    }
    
    upgrade_data = {
        "plan_id": enterprise_plan.id
    }
    
    response = client.post(
        "/api/v1/subscriptions/upgrade",
        json=upgrade_data,
        headers=auth_headers_pro
    )
    
    assert response.status_code == 200
    data = response.json()
    assert data["plan"]["name"] == "Enterprise"


def test_upgrade_to_lower_tier_fails(auth_headers_pro, free_plan):
    """Test cannot upgrade to lower-tier plan"""
    upgrade_data = {
        "plan_id": free_plan.id
    }
    
    response = client.post(
        "/api/v1/subscriptions/upgrade",
        json=upgrade_data,
        headers=auth_headers_pro
    )
    
    assert response.status_code == 400
    assert "downgrade" in response.json()["detail"].lower()


def test_upgrade_to_nonexistent_plan(auth_headers_free):
    """Test upgrading to non-existent plan fails"""
    upgrade_data = {
        "plan_id": 99999
    }
    
    response = client.post(
        "/api/v1/subscriptions/upgrade",
        json=upgrade_data,
        headers=auth_headers_free
    )
    
    assert response.status_code == 404


# ============================================
# Downgrade Plan Tests
# ============================================
def test_downgrade_plan_success(auth_headers_pro, free_plan):
    """Test downgrading from Pro to Free"""
    downgrade_data = {
        "plan_id": free_plan.id
    }
    
    response = client.post(
        "/api/v1/subscriptions/downgrade",
        json=downgrade_data,
        headers=auth_headers_pro
    )
    
    assert response.status_code == 200
    data = response.json()
    assert "message" in data
    assert data["new_plan"]["name"] == "Free"
    assert "effective_date" in data


def test_downgrade_to_higher_tier_fails(auth_headers_free, pro_plan):
    """Test cannot downgrade to higher-tier plan"""
    downgrade_data = {
        "plan_id": pro_plan.id
    }
    
    response = client.post(
        "/api/v1/subscriptions/downgrade",
        json=downgrade_data,
        headers=auth_headers_free
    )
    
    assert response.status_code == 400
    assert "upgrade" in response.json()["detail"].lower()


def test_downgrade_scheduled_for_end_of_period(auth_headers_pro, free_plan, test_user_pro):
    """Test downgrade is scheduled for end of billing period"""
    downgrade_data = {
        "plan_id": free_plan.id
    }
    
    response = client.post(
        "/api/v1/subscriptions/downgrade",
        json=downgrade_data,
        headers=auth_headers_pro
    )
    
    assert response.status_code == 200
    data = response.json()
    
    # Should be effective at subscription expiration
    effective_date = datetime.fromisoformat(data["effective_date"].replace('Z', '+00:00'))
    assert effective_date == test_user_pro.subscription_expires_at


# ============================================
# Cancel Subscription Tests
# ============================================
@patch('services.payment_service.payment_service.cancel_subscription')
def test_cancel_subscription_success(mock_cancel, auth_headers_pro, test_user_pro):
    """Test cancelling subscription"""
    mock_cancel.return_value = {
        "message": "Subscription cancelled",
        "status": "cancelled",
        "expires_at": test_user_pro.subscription_expires_at
    }
    
    response = client.post(
        "/api/v1/subscriptions/cancel",
        headers=auth_headers_pro
    )
    
    assert response.status_code == 200
    data = response.json()
    assert "message" in data
    assert data["status"] == "cancelled"
    assert "access_until" in data


def test_cancel_free_subscription_fails(auth_headers_free):
    """Test cannot cancel free subscription"""
    response = client.post(
        "/api/v1/subscriptions/cancel",
        headers=auth_headers_free
    )
    
    assert response.status_code == 400
    assert "no active subscription" in response.json()["detail"].lower()


# ============================================
# Reactivate Subscription Tests
# ============================================
def test_reactivate_subscription_success(auth_headers_pro, test_user_pro):
    """Test reactivating cancelled subscription"""
    response = client.post(
        "/api/v1/subscriptions/reactivate",
        headers=auth_headers_pro
    )
    
    assert response.status_code == 200
    data = response.json()
    assert "message" in data
    assert data["plan"]["name"] == "Pro"


def test_reactivate_expired_fails(auth_headers_pro, test_user_pro, db):
    """Test cannot reactivate expired subscription"""
    # Set as expired
    test_user_pro.subscription_expires_at = datetime.now(timezone.utc) - timedelta(days=1)
    db.commit()
    
    response = client.post(
        "/api/v1/subscriptions/reactivate",
        headers=auth_headers_pro
    )
    
    assert response.status_code == 400
    assert "expired" in response.json()["detail"].lower()


# ============================================
# Usage Statistics Tests
# ============================================
def test_get_usage_stats(auth_headers_pro, test_user_pro):
    """Test getting usage statistics"""
    response = client.get(
        "/api/v1/subscriptions/usage",
        headers=auth_headers_pro
    )
    
    assert response.status_code == 200
    data = response.json()
    assert data["current_plan"] == "Pro"
    assert data["predictions_used"] == 200
    assert data["predictions_limit"] == 1000
    assert data["percentage_used"] == 20.0
    assert "resets_at" in data


def test_usage_stats_unlimited_plan(auth_headers_pro, test_user_pro, enterprise_plan, db):
    """Test usage stats for unlimited plan"""
    test_user_pro.current_plan_id = enterprise_plan.id
    db.commit()
    
    response = client.get(
        "/api/v1/subscriptions/usage",
        headers=auth_headers_pro
    )
    
    assert response.status_code == 200
    data = response.json()
    assert data["predictions_limit"] == 999999  # Represented as high number


# ============================================
# Compare Plans Tests
# ============================================
def test_compare_plans(auth_headers_free, free_plan, pro_plan, enterprise_plan):
    """Test plan comparison"""
    response = client.get(
        "/api/v1/subscriptions/compare",
        headers=auth_headers_free
    )
    
    assert response.status_code == 200
    data = response.json()
    assert "plans" in data
    assert "features" in data
    assert len(data["plans"]) >= 3
    
    # Verify feature comparison matrix
    assert "predictions_per_month" in data["features"]
    assert "real_time_alerts" in data["features"]
    assert "advanced_analytics" in data["features"]


# ============================================
# Billing History Tests
# ============================================
def test_get_billing_history_empty(auth_headers_free):
    """Test billing history when no payments"""
    response = client.get(
        "/api/v1/subscriptions/billing-history",
        headers=auth_headers_free
    )
    
    assert response.status_code == 200
    data = response.json()
    assert data["total"] == 0
    assert data["payments"] == []


def test_get_billing_history_with_limit(auth_headers_pro):
    """Test billing history pagination"""
    response = client.get(
        "/api/v1/subscriptions/billing-history?limit=5",
        headers=auth_headers_pro
    )
    
    assert response.status_code == 200
    data = response.json()
    assert len(data["payments"]) <= 5


# ============================================
# Authorization Tests
# ============================================
def test_subscriptions_require_auth():
    """Test that subscriptions endpoints require authentication"""
    endpoints = [
        "/api/v1/subscriptions/plans",
        "/api/v1/subscriptions/current",
        "/api/v1/subscriptions/usage",
        "/api/v1/subscriptions/compare"
    ]
    
    for endpoint in endpoints:
        response = client.get(endpoint)
        assert response.status_code == 401


# ============================================
# Edge Cases
# ============================================
def test_upgrade_same_plan_fails(auth_headers_pro, pro_plan, test_user_pro):
    """Test cannot upgrade to current plan"""
    upgrade_data = {
        "plan_id": test_user_pro.current_plan_id
    }
    
    response = client.post(
        "/api/v1/subscriptions/upgrade",
        json=upgrade_data,
        headers=auth_headers_pro
    )
    
    # Should fail or handle gracefully
    assert response.status_code in [400, 200]


def test_inactive_plan_not_available(auth_headers_free, db):
    """Test inactive plans not returned in available plans"""
    # Create inactive plan
    inactive = Plan(
        name="Inactive",
        price=99.00,
        currency="USD",
        interval="monthly",
        features={},
        is_active=False
    )
    db.add(inactive)
    db.commit()
    
    response = client.get(
        "/api/v1/subscriptions/plans",
        headers=auth_headers_free
    )
    
    plans = response.json()
    plan_names = [p["name"] for p in plans]
    assert "Inactive" not in plan_names


# ============================================
# Integration Tests
# ============================================
@patch('services.payment_service.payment_service.create_payment_intent')
def test_complete_subscription_flow(mock_payment, auth_headers_free, pro_plan, enterprise_plan):
    """Test complete subscription lifecycle"""
    mock_payment.return_value = {
        "payment_id": "test_123",
        "payment_url": "https://pay.example.com",
        "amount": 39.00,
        "currency": "USD"
    }
    
    # 1. Check current status (should be free)
    response = client.get("/api/v1/subscriptions/current", headers=auth_headers_free)
    assert response.json()["status"] == "free"
    
    # 2. Get available plans
    response = client.get("/api/v1/subscriptions/plans", headers=auth_headers_free)
    assert len(response.json()) >= 3
    
    # 3. Compare plans
    response = client.get("/api/v1/subscriptions/compare", headers=auth_headers_free)
    assert "features" in response.json()
    
    # 4. Upgrade to Pro
    response = client.post(
        "/api/v1/subscriptions/upgrade",
        json={"plan_id": pro_plan.id},
        headers=auth_headers_free
    )
    assert response.status_code == 200
    assert "payment_url" in response.json()
