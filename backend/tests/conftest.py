"""
Pytest Configuration and Fixtures
Shared test configuration for all backend tests
"""

import pytest
import asyncio
from typing import Generator
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy.pool import StaticPool
import redis
from database.models import Base
from database.connection import get_db
from main import app


# Test Database Configuration
SQLALCHEMY_TEST_DATABASE_URL = "sqlite:///:memory:"

engine = create_engine(
    SQLALCHEMY_TEST_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)

TestingSessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)


@pytest.fixture(scope="session")
def event_loop():
    """Create event loop for async tests"""
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()


@pytest.fixture(scope="function")
def db() -> Generator[Session, None, None]:
    """
    Create a fresh database for each test
    """
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()
        Base.metadata.drop_all(bind=engine)


@pytest.fixture(scope="function")
def client(db: Session) -> Generator[TestClient, None, None]:
    """
    Create a test client with overridden database
    """
    def override_get_db():
        try:
            yield db
        finally:
            pass
    
    app.dependency_overrides[get_db] = override_get_db
    
    with TestClient(app) as test_client:
        yield test_client
    
    app.dependency_overrides.clear()


@pytest.fixture(scope="function")
def test_user(db: Session):
    """Create a test user"""
    from database.models import User
    from services.auth_service import get_password_hash
    
    user = User(
        email="test@predix.com",
        username="testuser",
        hashed_password=get_password_hash("testpassword123"),
        full_name="Test User",
        role="user",
        is_active=True
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


@pytest.fixture(scope="function")
def admin_user(db: Session):
    """Create an admin user"""
    from database.models import User
    from services.auth_service import get_password_hash
    
    user = User(
        email="admin@predix.com",
        username="admin",
        hashed_password=get_password_hash("adminpass123"),
        full_name="Admin User",
        role="admin",
        is_active=True
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


@pytest.fixture(scope="function")
def auth_headers(client: TestClient, test_user):
    """Get authentication headers for test user"""
    response = client.post(
        "/api/v1/users/login",
        json={
            "email": "test@predix.com",
            "password": "testpassword123"
        }
    )
    token = response.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


@pytest.fixture(scope="function")
def admin_headers(client: TestClient, admin_user):
    """Get authentication headers for admin user"""
    response = client.post(
        "/api/v1/users/login",
        json={
            "email": "admin@predix.com",
            "password": "adminpass123"
        }
    )
    token = response.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


@pytest.fixture(scope="function")
def redis_client():
    """Create a Redis client for testing"""
    import fakeredis
    return fakeredis.FakeStrictRedis()


@pytest.fixture(scope="function")
def mock_ai_service(monkeypatch):
    """Mock AI service for testing"""
    class MockAIConnector:
        async def predict_trend(self, data):
            return {
                "viral_score": 85.5,
                "confidence": 0.78,
                "growth_predictions": {
                    "24h": 0.45,
                    "48h": 0.36,
                    "72h": 0.28
                }
            }
        
        async def health_check(self):
            return {"status": "healthy"}
    
    monkeypatch.setattr(
        "services.ai_connector.AIConnector",
        MockAIConnector
    )
    return MockAIConnector()


@pytest.fixture(scope="function")
def mock_payment_service(monkeypatch):
    """Mock payment service for testing"""
    class MockPaymentService:
        def create_payment_intent(self, amount, plan):
            return {
                "payment_id": "test_payment_123",
                "status": "pending",
                "amount": amount
            }
        
        def verify_payment(self, payment_id):
            return {"status": "completed"}
    
    monkeypatch.setattr(
        "services.payment_service.PaymentService",
        MockPaymentService
    )
    return MockPaymentService()


# Sample Test Data
@pytest.fixture
def sample_trend_data():
    """Sample trend data for testing"""
    return {
        "platform": "tiktok",
        "name": "#TestTrend",
        "views": 1000000,
        "likes": 50000,
        "shares": 10000,
        "comments": 5000,
        "engagement_rate": 0.065,
        "growth_rate_24h": 0.25,
        "country": "MX"
    }


@pytest.fixture
def sample_user_data():
    """Sample user registration data"""
    return {
        "email": "newuser@predix.com",
        "username": "newuser",
        "password": "SecurePass123!",
        "full_name": "New User"
    }


# Markers
def pytest_configure(config):
    """Configure custom markers"""
    config.addinivalue_line(
        "markers", "unit: Unit tests"
    )
    config.addinivalue_line(
        "markers", "integration: Integration tests"
    )
    config.addinivalue_line(
        "markers", "slow: Slow running tests"
    )
