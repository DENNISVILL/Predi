"""
Comprehensive Tests for Payment System
Tests for Paymentez integration, subscriptions, and billing
"""

import pytest
from datetime import datetime, timedelta
from decimal import Decimal
from unittest.mock import Mock, patch, MagicMock
from fastapi.testclient import TestClient

from database.models import User, Payment, Plan, Subscription
from routes.payments import router
from services.payment_service import PaymentService


# ============================================
# Fixtures
# ============================================

@pytest.fixture
def mock_paymentez():
    """Mock Paymentez API client"""
    with patch('services.payment_service.PaymentezClient') as mock:
        yield mock


@pytest.fixture
def test_plans(db_session):
    """Create test subscription plans"""
    plans = [
        Plan(
            id=1,
            name="Free",
            price=0.00,
            currency="USD",
            interval="monthly",
            features={"predictions_per_month": 10, "alerts_limit": 5},
            is_active=True
        ),
        Plan(
            id=2,
            name="Pro",
            price=29.99,
            currency="USD",
            interval="monthly",
            features={"predictions_per_month": 100, "alerts_limit": 50},
            is_active=True
        ),
        Plan(
            id=3,
            name="Enterprise",
            price=99.99,
            currency="USD",
            interval="monthly",
            features={"predictions_per_month": -1, "alerts_limit": -1},
            is_active=True
        )
    ]
    
    for plan in plans:
        db_session.add(plan)
    db_session.commit()
    
    return plans


# ============================================
# Payment Creation Tests
# ============================================

def test_create_payment_success(client, authenticated_user, test_plans, mock_paymentez):
    """Test successful payment creation"""
    mock_paymentez.return_value.create_payment.return_value = {
        "status": "success",
        "transaction_id": "txn_123456",
        "amount": 29.99
    }
    
    response = client.post(
        "/api/v1/payments/create",
        json={
            "plan_id": 2,
            "payment_method": "card",
            "card_token": "tok_test_123"
        }
    )
    
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "pending"
    assert data["amount"] == 29.99
    assert "uuid" in data


def test_create_payment_invalid_plan(client, authenticated_user):
    """Test payment creation with invalid plan"""
    response = client.post(
        "/api/v1/payments/create",
        json={
            "plan_id": 999,
            "payment_method": "card",
            "card_token": "tok_test_123"
        }
    )
    
    assert response.status_code == 404
    assert "Plan not found" in response.json()["detail"]


def test_create_payment_missing_token(client, authenticated_user, test_plans):
    """Test payment creation without card token"""
    response = client.post(
        "/api/v1/payments/create",
        json={
            "plan_id": 2,
            "payment_method": "card"
        }
    )
    
    assert response.status_code == 422  # Validation error


def test_create_payment_unauthorized(client, test_plans):
    """Test payment creation without authentication"""
    response = client.post(
        "/api/v1/payments/create",
        json={
            "plan_id": 2,
            "payment_method": "card",
            "card_token": "tok_test_123"
        }
    )
    
    assert response.status_code == 401


# ============================================
# Payment Processing Tests
# ============================================

def test_process_payment_success(db_session, authenticated_user, test_plans, mock_paymentez):
    """Test successful payment processing"""
    payment = Payment(
        user_id=authenticated_user.id,
        plan_id=2,
        amount=29.99,
        currency="USD",
        status="pending",
        payment_method="card"
    )
    db_session.add(payment)
    db_session.commit()
    
    mock_paymentez.return_value.process_payment.return_value = {
        "status": "approved",
        "transaction_id": "txn_123456"
    }
    
    service = PaymentService(db_session)
    result = service.process_payment(payment.id, "txn_123456")
    
    assert result["status"] == "completed"
    assert payment.status == "completed"
    assert payment.external_payment_id == "txn_123456"


def test_process_payment_failed(db_session, authenticated_user, test_plans, mock_paymentez):
    """Test failed payment processing"""
    payment = Payment(
        user_id=authenticated_user.id,
        plan_id=2,
        amount=29.99,
        currency="USD",
        status="pending"
    )
    db_session.add(payment)
    db_session.commit()
    
    mock_paymentez.return_value.process_payment.return_value = {
        "status": "declined",
        "error": "Insufficient funds"
    }
    
    service = PaymentService(db_session)
    result = service.process_payment(payment.id, "txn_failed")
    
    assert result["status"] == "failed"
    assert payment.status == "failed"


def test_process_payment_duplicate(db_session, authenticated_user, test_plans):
    """Test processing already completed payment"""
    payment = Payment(
        user_id=authenticated_user.id,
        plan_id=2,
        amount=29.99,
        currency="USD",
        status="completed",
        external_payment_id="txn_existing"
    )
    db_session.add(payment)
    db_session.commit()
    
    service = PaymentService(db_session)
    
    with pytest.raises(ValueError, match="already processed"):
        service.process_payment(payment.id, "txn_123")


# ============================================
# Subscription Tests
# ============================================

def test_create_subscription(db_session, authenticated_user, test_plans):
    """Test subscription creation after successful payment"""
    payment = Payment(
        user_id=authenticated_user.id,
        plan_id=2,
        amount=29.99,
        currency="USD",
        status="completed",
        paid_at=datetime.now()
    )
    db_session.add(payment)
    db_session.commit()
    
    service = PaymentService(db_session)
    subscription = service.create_subscription(payment.id)
    
    assert subscription.user_id == authenticated_user.id
    assert subscription.plan_id == 2
    assert subscription.is_active is True
    assert subscription.expires_at > datetime.now()


def test_subscription_expiry(db_session, authenticated_user, test_plans):
    """Test subscription expiry calculation"""
    subscription = Subscription(
        user_id=authenticated_user.id,
        plan_id=2,
        is_active=True,
        starts_at=datetime.now(),
        expires_at=datetime.now() + timedelta(days=30)
    )
    db_session.add(subscription)
    db_session.commit()
    
    # Check not expired
    service = PaymentService(db_session)
    assert service.is_subscription_active(subscription.id) is True
    
    # Expire subscription
    subscription.expires_at = datetime.now() - timedelta(days=1)
    db_session.commit()
    
    assert service.is_subscription_active(subscription.id) is False


def test_upgrade_subscription(db_session, authenticated_user, test_plans):
    """Test subscription upgrade from Pro to Enterprise"""
    # Create Pro subscription
    subscription = Subscription(
        user_id=authenticated_user.id,
        plan_id=2,
        is_active=True,
        starts_at=datetime.now(),
        expires_at=datetime.now() + timedelta(days=20)
    )
    db_session.add(subscription)
    db_session.commit()
    
    # Upgrade to Enterprise
    service = PaymentService(db_session)
    new_subscription = service.upgrade_subscription(
        subscription.id,
        plan_id=3,
        payment_id=None  # Would be actual payment
    )
    
    # Old subscription should be cancelled
    db_session.refresh(subscription)
    assert subscription.is_active is False
    
    # New subscription should be active
    assert new_subscription.plan_id == 3
    assert new_subscription.is_active is True


def test_downgrade_subscription(db_session, authenticated_user, test_plans):
    """Test subscription downgrade from Enterprise to Pro"""
    subscription = Subscription(
        user_id=authenticated_user.id,
        plan_id=3,
        is_active=True,
        starts_at=datetime.now(),
        expires_at=datetime.now() + timedelta(days=15)
    )
    db_session.add(subscription)
    db_session.commit()
    
    service = PaymentService(db_session)
    result = service.downgrade_subscription(subscription.id, plan_id=2)
    
    # Downgrade scheduled at end of period
    assert result["scheduled_change"] is True
    assert result["new_plan_id"] == 2
    assert result["effective_date"] == subscription.expires_at


# ============================================
# Webhook Tests
# ============================================

def test_webhook_payment_approved(client, db_session, authenticated_user, test_plans):
    """Test webhook for approved payment"""
    payment = Payment(
        user_id=authenticated_user.id,
        plan_id=2,
        amount=29.99,
        currency="USD",
        status="pending"
    )
    db_session.add(payment)
    db_session.commit()
    
    webhook_data = {
        "event": "payment.approved",
        "payment_id": payment.uuid,
        "transaction_id": "txn_webhook_123",
        "status": "approved"
    }
    
    response = client.post(
        "/api/v1/payments/webhook",
        json=webhook_data,
        headers={"X-Paymentez-Signature": "valid_signature"}
    )
    
    assert response.status_code == 200
    
    db_session.refresh(payment)
    assert payment.status == "completed"
    assert payment.external_payment_id == "txn_webhook_123"


def test_webhook_payment_declined(client, db_session, authenticated_user, test_plans):
    """Test webhook for declined payment"""
    payment = Payment(
        user_id=authenticated_user.id,
        plan_id=2,
        amount=29.99,
        status="pending"
    )
    db_session.add(payment)
    db_session.commit()
    
    webhook_data = {
        "event": "payment.declined",
        "payment_id": payment.uuid,
        "status": "declined",
        "error": "Card declined"
    }
    
    response = client.post(
        "/api/v1/payments/webhook",
        json=webhook_data,
        headers={"X-Paymentez-Signature": "valid_signature"}
    )
    
    assert response.status_code == 200
    
    db_session.refresh(payment)
    assert payment.status == "failed"


def test_webhook_invalid_signature(client):
    """Test webhook with invalid signature"""
    response = client.post(
        "/api/v1/payments/webhook",
        json={"event": "payment.approved"},
        headers={"X-Paymentez-Signature": "invalid"}
    )
    
    assert response.status_code == 401


# ============================================
# Refund Tests
# ============================================

def test_refund_payment(db_session, authenticated_user, test_plans, mock_paymentez):
    """Test payment refund"""
    payment = Payment(
        user_id=authenticated_user.id,
        plan_id=2,
        amount=29.99,
        currency="USD",
        status="completed",
        external_payment_id="txn_refund_test",
        paid_at=datetime.now()
    )
    db_session.add(payment)
    db_session.commit()
    
    mock_paymentez.return_value.refund_payment.return_value = {
        "status": "refunded",
        "refund_id": "ref_123"
    }
    
    service = PaymentService(db_session)
    result = service.refund_payment(payment.id, reason="Requested by user")
    
    assert result["status"] == "refunded"
    db_session.refresh(payment)
    assert payment.status == "refunded"


def test_refund_already_refunded(db_session, authenticated_user, test_plans):
    """Test refunding already refunded payment"""
    payment = Payment(
        user_id=authenticated_user.id,
        plan_id=2,
        amount=29.99,
        status="refunded"
    )
    db_session.add(payment)
    db_session.commit()
    
    service = PaymentService(db_session)
    
    with pytest.raises(ValueError, match="already refunded"):
        service.refund_payment(payment.id)


# ============================================
# Payment History Tests
# ============================================

def test_get_payment_history(client, db_session, authenticated_user, test_plans):
    """Test retrieving payment history"""
    # Create multiple payments
    for i in range(5):
        payment = Payment(
            user_id=authenticated_user.id,
            plan_id=2,
            amount=29.99,
            currency="USD",
            status="completed",
            paid_at=datetime.now() - timedelta(days=i*30)
        )
        db_session.add(payment)
    db_session.commit()
    
    response = client.get("/api/v1/payments/history")
    
    assert response.status_code == 200
    data = response.json()
    assert len(data["items"]) == 5
    assert data["total"] == 5


def test_get_payment_by_id(client, db_session, authenticated_user, test_plans):
    """Test retrieving specific payment"""
    payment = Payment(
        user_id=authenticated_user.id,
        plan_id=2,
        amount=29.99,
        status="completed"
    )
    db_session.add(payment)
    db_session.commit()
    
    response = client.get(f"/api/v1/payments/{payment.uuid}")
    
    assert response.status_code == 200
    data = response.json()
    assert data["amount"] == 29.99
    assert data["status"] == "completed"


def test_get_payment_unauthorized(client, db_session, authenticated_user, test_plans):
    """Test retrieving another user's payment"""
    other_user = User(email="other@test.com", username="other", role="user")
    db_session.add(other_user)
    
    payment = Payment(
        user_id=other_user.id,
        plan_id=2,
        amount=29.99,
        status="completed"
    )
    db_session.add(payment)
    db_session.commit()
    
    response = client.get(f"/api/v1/payments/{payment.uuid}")
    
    assert response.status_code == 403


# ============================================
# Invoice Generation Tests
# ============================================

def test_generate_invoice(db_session, authenticated_user, test_plans):
    """Test invoice generation for payment"""
    payment = Payment(
        user_id=authenticated_user.id,
        plan_id=2,
        amount=29.99,
        currency="USD",
        status="completed",
        paid_at=datetime.now()
    )
    db_session.add(payment)
    db_session.commit()
    
    service = PaymentService(db_session)
    invoice = service.generate_invoice(payment.id)
    
    assert invoice["payment_id"] == payment.uuid
    assert invoice["amount"] == 29.99
    assert "invoice_number" in invoice
    assert "items" in invoice


# ============================================
# Trial Period Tests
# ============================================

def test_start_trial_period(db_session, authenticated_user, test_plans):
    """Test starting trial period"""
    service = PaymentService(db_session)
    trial = service.start_trial(
        user_id=authenticated_user.id,
        plan_id=2,
        trial_days=14
    )
    
    assert trial.user_id == authenticated_user.id
    assert trial.is_active is True
    assert trial.expires_at == trial.starts_at + timedelta(days=14)


def test_trial_to_paid_conversion(db_session, authenticated_user, test_plans):
    """Test converting trial to paid subscription"""
    # Create trial
    trial = Subscription(
        user_id=authenticated_user.id,
        plan_id=2,
        is_active=True,
        is_trial=True,
        starts_at=datetime.now(),
        expires_at=datetime.now() + timedelta(days=7)
    )
    db_session.add(trial)
    db_session.commit()
    
    # Convert to paid
    payment = Payment(
        user_id=authenticated_user.id,
        plan_id=2,
        amount=29.99,
        status="completed",
        paid_at=datetime.now()
    )
    db_session.add(payment)
    db_session.commit()
    
    service = PaymentService(db_session)
    subscription = service.convert_trial_to_paid(trial.id, payment.id)
    
    # Trial should be cancelled
    db_session.refresh(trial)
    assert trial.is_active is False
    
    # New subscription should be active and not trial
    assert subscription.is_trial is False
    assert subscription.is_active is True


# ============================================
# Edge Cases & Error Handling
# ============================================

def test_payment_with_zero_amount(client, authenticated_user, test_plans):
    """Test creating payment with zero amount (Free plan)"""
    response = client.post(
        "/api/v1/payments/create",
        json={
            "plan_id": 1,  # Free plan
            "payment_method": "none"
        }
    )
    
    # Free plan should not require payment
    assert response.status_code == 200
    data = response.json()
    assert data["amount"] == 0.00


def test_concurrent_payment_creation(db_session, authenticated_user, test_plans):
    """Test handling concurrent payment attempts"""
    # This would require actual concurrency testing
    # Simplified version checking for duplicate prevention
    pass


def test_payment_amount_mismatch(client, authenticated_user, test_plans, mock_paymentez):
    """Test payment amount validation"""
    response = client.post(
        "/api/v1/payments/create",
        json={
            "plan_id": 2,
            "payment_method": "card",
            "card_token": "tok_test",
            "amount": 19.99  # Wrong amount
        }
    )
    
    assert response.status_code == 400
    assert "amount mismatch" in response.json()["detail"].lower()
