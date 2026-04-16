"""
Comprehensive Tests for Analytics System
Tests for user stats, platform analytics, cohort analysis, and metrics
"""

import pytest
from datetime import datetime, timedelta
from sqlalchemy import func

from database.models import User, TrendPrediction, Alert, Trend, Payment
from services.analytics_service import AnalyticsService


# ============================================
# Fixtures
# ============================================

@pytest.fixture
def analytics_service(db_session):
    """Create analytics service instance"""
    return AnalyticsService(db_session)


@pytest.fixture
def test_users_with_activity(db_session):
    """Create users with various activity patterns"""
    users = []
    
    # Active user
    active_user = User(
        email="active@test.com",
        username="active_user",
        role="premium",
        created_at=datetime.now() - timedelta(days=90),
        last_login_at=datetime.now()
    )
    users.append(active_user)
    
    # Inactive user
    inactive_user = User(
        email="inactive@test.com",
        username="inactive_user",
        role="user",
        created_at=datetime.now() - timedelta(days=60),
        last_login_at=datetime.now() - timedelta(days=50)
    )
    users.append(inactive_user)
    
    # New user
    new_user = User(
        email="new@test.com",
        username="new_user",
        role="user",
        created_at=datetime.now() - timedelta(days=5),
        last_login_at=datetime.now() - timedelta(days=1)
    )
    users.append(new_user)
    
    for user in users:
        db_session.add(user)
    db_session.commit()
    
    return users


@pytest.fixture
def test_predictions(db_session, test_users_with_activity):
    """Create test predictions for users"""
    predictions = []
    
    for user in test_users_with_activity:
        for i in range(5):
            prediction = TrendPrediction(
                user_id=user.id,
                input_data={
                    "platform": "tiktok",
                    "views": 100000 * (i + 1),
                    "likes": 5000 * (i + 1)
                },
                viral_score=50.0 + (i * 10),
                confidence=0.7 + (i * 0.05),
                growth_predictions={"24h": 10.0, "48h": 20.0, "72h": 30.0},
                components={"engagement": 60.0, "timing": 70.0},
                created_at=datetime.now() - timedelta(days=i*7)
            )
            predictions.append(prediction)
            db_session.add(prediction)
    
    db_session.commit()
    return predictions


# ============================================
# User Statistics Tests
# ============================================

def test_get_user_stats_basic(analytics_service, db_session, test_users_with_activity):
    """Test basic user statistics retrieval"""
    user = test_users_with_activity[0]
    
    stats = analytics_service.get_user_stats(user.id)
    
    assert stats is not None
    assert stats["user_id"] == user.id
    assert "total_predictions" in stats
    assert "total_alerts" in stats
    assert "account_age_days" in stats


def test_get_user_stats_with_predictions(
    analytics_service,
    db_session,
    test_users_with_activity,
    test_predictions
):
    """Test user stats with prediction count"""
    user = test_users_with_activity[0]
    
    stats = analytics_service.get_user_stats(user.id)
    
    assert stats["total_predictions"] == 5
    assert stats["avg_viral_score"] > 0
    assert stats["predictions_this_month"] >= 0


def test_get_user_stats_trend_over_time(analytics_service, db_session, test_users_with_activity):
    """Test user stats trend calculation"""
    user = test_users_with_activity[0]
    
    # Create predictions over 3 months
    for month in range(3):
        for i in range(10):
            prediction = TrendPrediction(
                user_id=user.id,
                input_data={"platform": "tiktok"},
                viral_score=60.0,
                confidence=0.8,
                growth_predictions={},
                components={},
                created_at=datetime.now() - timedelta(days=30*month + i)
            )
            db_session.add(prediction)
    db_session.commit()
    
    trend = analytics_service.get_user_stats_trend(user.id, days=90)
    
    assert len(trend) == 3  # 3 months
    assert all("month" in item for item in trend)
    assert all("predictions_count" in item for item in trend)


def test_get_user_engagement_score(analytics_service, test_users_with_activity):
    """Test user engagement score calculation"""
    user = test_users_with_activity[0]  # Active user
    
    engagement = analytics_service.calculate_engagement_score(user.id)
    
    assert 0 <= engagement <= 100
    assert engagement > 50  # Active user should have high engagement


# ============================================
# Platform Analytics Tests
# ============================================

def test_get_platform_overview(analytics_service, db_session, test_users_with_activity, test_predictions):
    """Test platform-wide analytics overview"""
    overview = analytics_service.get_platform_overview(days=30)
    
    assert "users" in overview
    assert "predictions" in overview
    assert "revenue" in overview
    assert "engagement" in overview
    
    assert overview["users"]["total"] > 0
    assert overview["predictions"]["total"] > 0


def test_get_daily_active_users(analytics_service, db_session, test_users_with_activity):
    """Test DAU (Daily Active Users) calculation"""
    # Update last login for some users
    for user in test_users_with_activity[:2]:
        user.last_login_at = datetime.now()
    db_session.commit()
    
    dau = analytics_service.get_daily_active_users()
    
    assert dau >= 2  # At least 2 active today


def test_get_monthly_active_users(analytics_service, db_session, test_users_with_activity):
    """Test MAU (Monthly Active Users) calculation"""
    # Update last login within last month
    for user in test_users_with_activity:
        user.last_login_at = datetime.now() - timedelta(days=15)
    db_session.commit()
    
    mau = analytics_service.get_monthly_active_users()
    
    assert mau >= 3  # All users active this month


def test_calculate_retention_rate(analytics_service, db_session):
    """Test user retention rate calculation"""
    # Create cohort of users
    cohort_date = datetime.now() - timedelta(days=30)
    
    for i in range(10):
        user = User(
            email=f"cohort{i}@test.com",
            username=f"cohort_user_{i}",
            role="user",
            created_at=cohort_date,
            last_login_at=cohort_date + timedelta(days=i)  # Some active, some not
        )
        db_session.add(user)
    db_session.commit()
    
    retention = analytics_service.calculate_retention_rate(
        cohort_date=cohort_date,
        period_days=7
    )
    
    assert 0 <= retention <= 100


# ============================================
# Cohort Analysis Tests
# ============================================

def test_get_cohort_analysis(analytics_service, db_session):
    """Test cohort analysis for user retention"""
    # Create users in different months
    for month in range(3):
        for i in range(5):
            user = User(
                email=f"cohort_m{month}_u{i}@test.com",
                username=f"user_m{month}_{i}",
                role="user",
                created_at=datetime.now() - timedelta(days=30*month + i),
                last_login_at=datetime.now() - timedelta(days=i)
            )
            db_session.add(user)
    db_session.commit()
    
    cohorts = analytics_service.get_cohort_analysis(months=3)
    
    assert len(cohorts) <= 3
    assert all("cohort_month" in c for c in cohorts)
    assert all("cohort_size" in c for c in cohorts)
    assert all("retention" in c for c in cohorts)


def test_cohort_retention_by_month(analytics_service, db_session):
    """Test monthly retention calculation for cohorts"""
    cohort_date = datetime.now() - timedelta(days=60)
    
    # Create cohort
    for i in range(10):
        user = User(
            email=f"retention{i}@test.com",
            username=f"retention_user_{i}",
            created_at=cohort_date,
            last_login_at=cohort_date + timedelta(days=30) if i < 5 else cohort_date
        )
        db_session.add(user)
    db_session.commit()
    
    retention_data = analytics_service.get_cohort_retention_by_month(cohort_date)
    
    assert "month_0" in retention_data  # Initial cohort
    assert "month_1" in retention_data  # First month retention
    assert retention_data["month_1"] == 50.0  # 5 out of 10 active


# ============================================
# Revenue Analytics Tests
# ============================================

def test_calculate_mrr(analytics_service, db_session, test_users_with_activity):
    """Test MRR (Monthly Recurring Revenue) calculation"""
    # Create active subscriptions
    from database.models import Subscription, Plan
    
    plan = Plan(name="Pro", price=29.99, currency="USD", interval="monthly", is_active=True)
    db_session.add(plan)
    db_session.commit()
    
    for user in test_users_with_activity:
        subscription = Subscription(
            user_id=user.id,
            plan_id=plan.id,
            is_active=True,
            starts_at=datetime.now(),
            expires_at=datetime.now() + timedelta(days=30)
        )
        db_session.add(subscription)
    db_session.commit()
    
    mrr = analytics_service.calculate_mrr()
    
    assert mrr > 0
    assert mrr == 29.99 * 3  # 3 users * $29.99


def test_calculate_arpu(analytics_service, db_session, test_users_with_activity):
    """Test ARPU (Average Revenue Per User) calculation"""
    # Add payments
    for user in test_users_with_activity:
        payment = Payment(
            user_id=user.id,
            plan_id=1,
            amount=29.99,
            currency="USD",
            status="completed",
            paid_at=datetime.now()
        )
        db_session.add(payment)
    db_session.commit()
    
    arpu = analytics_service.calculate_arpu()
    
    assert arpu == 29.99  # All users paid same amount


def test_calculate_ltv(analytics_service, db_session, test_users_with_activity):
    """Test LTV (Customer Lifetime Value) calculation"""
    user = test_users_with_activity[0]
    
    # Add multiple payments over time
    for i in range(6):  # 6 months of payments
        payment = Payment(
            user_id=user.id,
            plan_id=1,
            amount=29.99,
            currency="USD",
            status="completed",
            paid_at=datetime.now() - timedelta(days=30*i)
        )
        db_session.add(payment)
    db_session.commit()
    
    ltv = analytics_service.calculate_ltv(user.id)
    
    assert ltv == 29.99 * 6


# ============================================
# Trend Analytics Tests
# ============================================

def test_get_trending_platforms(analytics_service, db_session):
    """Test identifying most popular platforms"""
    # Create trends for different platforms
    platforms = ["tiktok", "twitter", "instagram"]
    
    for platform in platforms:
        for i in range(5 if platform == "tiktok" else 2):
            trend = Trend(
                platform=platform,
                content_type="video",
                name=f"#{platform}_trend_{i}",
                views=100000,
                likes=5000,
                shares=1000,
                comments=500,
                engagement_rate=5.0,
                growth_rate_24h=10.0,
                viral_score=70.0,
                confidence=0.8,
                is_active=True
            )
            db_session.add(trend)
    db_session.commit()
    
    platform_stats = analytics_service.get_trending_platforms()
    
    assert platform_stats[0]["platform"] == "tiktok"  # Most trends
    assert platform_stats[0]["count"] == 5


def test_get_prediction_accuracy(analytics_service, db_session, test_predictions):
    """Test prediction accuracy metrics"""
    # Would need actual vs predicted data
    # Simplified version
    accuracy = analytics_service.calculate_prediction_accuracy(days=30)
    
    assert "avg_confidence" in accuracy
    assert "total_predictions" in accuracy


# ============================================
# Performance Metrics Tests
# ============================================

def test_get_api_performance_metrics(analytics_service):
    """Test API performance metrics calculation"""
    # Would integrate with actual metrics collection
    # Simplified version
    metrics = analytics_service.get_api_performance_metrics(hours=24)
    
    assert "avg_response_time" in metrics or metrics == {}


def test_get_error_rate(analytics_service):
    """Test error rate calculation"""
    # Would integrate with logging/monitoring
    error_rate = analytics_service.calculate_error_rate(hours=24)
    
    assert error_rate >= 0
    assert error_rate <= 100


# ============================================
# Export & Reporting Tests
# ============================================

def test_export_analytics_csv(analytics_service, db_session, test_users_with_activity, test_predictions):
    """Test exporting analytics to CSV"""
    csv_data = analytics_service.export_to_csv(
        start_date=datetime.now() - timedelta(days=30),
        end_date=datetime.now()
    )
    
    assert csv_data is not None
    assert "user_id" in csv_data
    assert len(csv_data.split("\n")) > 1  # Header + data


def test_generate_analytics_report(analytics_service, test_users_with_activity, test_predictions):
    """Test generating comprehensive analytics report"""
    report = analytics_service.generate_report(
        period="monthly",
        include_charts=False
    )
    
    assert "summary" in report
    assert "users" in report
    assert "predictions" in report
    assert "revenue" in report


# ============================================
# Edge Cases & Complex Scenarios
# ============================================

def test_analytics_with_no_data(analytics_service, db_session):
    """Test analytics when no data exists"""
    # Clear all data
    db_session.query(TrendPrediction).delete()
    db_session.query(User).delete()
    db_session.commit()
    
    overview = analytics_service.get_platform_overview(days=30)
    
    assert overview["users"]["total"] == 0
    assert overview["predictions"]["total"] == 0


def test_analytics_with_date_range(analytics_service, test_users_with_activity, test_predictions):
    """Test analytics with custom date range"""
    start_date = datetime.now() - timedelta(days=14)
    end_date = datetime.now()
    
    stats = analytics_service.get_platform_overview(
        start_date=start_date,
        end_date=end_date
    )
    
    assert stats is not None


def test_analytics_performance_large_dataset(analytics_service, db_session):
    """Test analytics performance with large dataset"""
    import time
    
    # Create large dataset
    for i in range(100):
        user = User(
            email=f"perf_test_{i}@test.com",
            username=f"perf_user_{i}",
            role="user",
            created_at=datetime.now() - timedelta(days=i)
        )
        db_session.add(user)
    
    db_session.commit()
    
    start_time = time.time()
    analytics_service.get_platform_overview(days=100)
    end_time = time.time()
    
    # Should complete in reasonable time (< 2 seconds)
    assert (end_time - start_time) < 2.0


def test_concurrent_analytics_requests(analytics_service):
    """Test handling concurrent analytics requests"""
    # Would require actual concurrency testing
    # Placeholder for concurrent request handling
    pass
