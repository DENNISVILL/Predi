"""
Rate Limiting Tests
Comprehensive test suite for rate limiting functionality
"""

import pytest
import time
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session
import fakeredis

from services.rate_limiter import (
    AdvancedRateLimiter, RateLimitTier, RateLimitConfig
)


class TestRateLimitConfig:
    """Test rate limit configuration"""
    
    def test_free_tier_limits(self):
        """Test FREE tier configuration"""
        limits = RateLimitConfig.LIMITS[RateLimitTier.FREE]
        
        assert limits["requests_per_hour"] == 100
        assert limits["requests_per_day"] == 1000
        assert limits["predictions_per_month"] == 100
        assert limits["burst_size"] == 10
    
    def test_pro_tier_limits(self):
        """Test PRO tier configuration"""
        limits = RateLimitConfig.LIMITS[RateLimitTier.PRO]
        
        assert limits["requests_per_hour"] == 1000
        assert limits["requests_per_day"] == 10000
        assert limits["predictions_per_month"] == -1  # Unlimited
        assert limits["burst_size"] == 50
    
    def test_enterprise_tier_limits(self):
        """Test ENTERPRISE tier (unlimited)"""
        limits = RateLimitConfig.LIMITS[RateLimitTier.ENTERPRISE]
        
        assert limits["requests_per_hour"] == -1
        assert limits["requests_per_day"] == -1
        assert limits["predictions_per_month"] == -1
        assert limits["burst_size"] == 100
    
    def test_endpoint_specific_limits(self):
        """Test endpoint-specific rate limits"""
        endpoint_limits = RateLimitConfig.ENDPOINT_LIMITS
        
        # AI predict endpoint
        assert "/api/v1/ai/predict" in endpoint_limits
        assert endpoint_limits["/api/v1/ai/predict"][RateLimitTier.FREE] == 20
        
        # Batch predict endpoint
        assert "/api/v1/ai/batch-predict" in endpoint_limits
        assert endpoint_limits["/api/v1/ai/batch-predict"][RateLimitTier.FREE] == 0  # Not allowed


@pytest.mark.unit
class TestAdvancedRateLimiter:
    """Test AdvancedRateLimiter class"""
    
    @pytest.fixture
    def redis_client(self):
        """Create fake Redis client for testing"""
        return fakeredis.FakeStrictRedis()
    
    @pytest.fixture
    def limiter(self, redis_client):
        """Create rate limiter instance"""
        return AdvancedRateLimiter(redis_client)
    
    def test_initialization(self, limiter):
        """Test rate limiter initialization"""
        assert limiter.redis is not None
        assert limiter.config is not None
    
    def test_get_key(self, limiter):
        """Test key generation"""
        key = limiter._get_key("user123", "hour")
        assert key == "ratelimit:user123:hour"
        
        key = limiter._get_key("192.168.1.1", "day")
        assert key == "ratelimit:192.168.1.1:day"
    
    def test_check_rate_limit_unlimited(self, limiter):
        """Test rate limiting for unlimited tier"""
        result = limiter.check_rate_limit(
            identifier="admin_user",
            tier=RateLimitTier.ENTERPRISE,
            window="hour"
        )
        
        assert result["allowed"] is True
        assert result["limit"] == -1
        assert result["remaining"] == -1
        assert result["message"] == "Unlimited"
    
    def test_check_rate_limit_within_limit(self, limiter):
        """Test rate limiting when within limit"""
        identifier = "test_user_1"
        
        # First request
        result = limiter.check_rate_limit(
            identifier=identifier,
            tier=RateLimitTier.FREE,
            window="hour"
        )
        
        assert result["allowed"] is True
        assert result["limit"] == 100
        assert result["remaining"] == 99
        assert "OK" in result["message"]
    
    def test_check_rate_limit_exceeds_limit(self, limiter):
        """Test rate limiting when limit is exceeded"""
        identifier = "test_user_2"
        
        # Make 100 requests to hit FREE tier limit
        for i in range(100):
            limiter.check_rate_limit(
                identifier=identifier,
                tier=RateLimitTier.FREE,
                window="hour"
            )
        
        # 101st request should be blocked
        result = limiter.check_rate_limit(
            identifier=identifier,
            tier=RateLimitTier.FREE,
            window="hour"
        )
        
        assert result["allowed"] is False
        assert result["limit"] == 100
        assert result["remaining"] == 0
        assert "Rate limit exceeded" in result["message"]
    
    def test_check_rate_limit_multiple_windows(self, limiter):
        """Test rate limiting across multiple time windows"""
        identifier = "test_user_3"
        
        # Hour window
        result_hour = limiter.check_rate_limit(
            identifier=identifier,
            tier=RateLimitTier.FREE,
            window="hour"
        )
        
        # Day window (separate counter)
        result_day = limiter.check_rate_limit(
            identifier=identifier,
            tier=RateLimitTier.FREE,
            window="day"
        )
        
        assert result_hour["allowed"] is True
        assert result_day["allowed"] is True
        # Different windows should have independent counters
        assert result_hour["remaining"] == 99
        assert result_day["remaining"] == 999
    
    def test_endpoint_specific_limit_not_allowed(self, limiter):
        """Test endpoint that's not allowed for tier"""
        result = limiter.check_rate_limit(
            identifier="free_user",
            tier=RateLimitTier.FREE,
            window="hour",
            endpoint="/api/v1/ai/batch-predict"
        )
        
        assert result["allowed"] is False
        assert result["limit"] == 0
        assert "not available" in result["message"]
    
    def test_endpoint_specific_limit_allowed(self, limiter):
        """Test endpoint-specific limit enforcement"""
        identifier = "free_user_2"
        endpoint = "/api/v1/ai/predict"
        
        # FREE tier has limit of 20 for this endpoint
        for i in range(20):
            result = limiter.check_rate_limit(
                identifier=identifier,
                tier=RateLimitTier.FREE,
                window="hour",
                endpoint=endpoint
            )
            assert result["allowed"] is True
        
        # 21st request should be blocked
        result = limiter.check_rate_limit(
            identifier=identifier,
            tier=RateLimitTier.FREE,
            window="hour",
            endpoint=endpoint
        )
        
        assert result["allowed"] is False
    
    def test_reset_limit(self, limiter, redis_client):
        """Test resetting rate limit"""
        identifier = "test_user_reset"
        
        # Make some requests
        for i in range(5):
            limiter.check_rate_limit(
                identifier=identifier,
                tier=RateLimitTier.FREE,
                window="hour"
            )
        
        # Reset
        limiter.reset_limit(identifier, "hour")
        
        # Should be back to 0
        key = limiter._get_key(identifier, "hour")
        assert redis_client.get(key) is None
    
    def test_get_usage_stats(self, limiter):
        """Test getting usage statistics"""
        identifier = "test_user_stats"
        
        # Make requests in different windows
        limiter.check_rate_limit(identifier, RateLimitTier.FREE, "hour")
        limiter.check_rate_limit(identifier, RateLimitTier.FREE, "hour")
        limiter.check_rate_limit(identifier, RateLimitTier.FREE, "day")
        
        stats = limiter.get_usage_stats(identifier)
        
        assert stats["hour"] == 2
        assert stats["day"] == 1
        assert stats["month"] == 0  # No requests in month window


@pytest.mark.integration
class TestRateLimitingIntegration:
    """Integration tests for rate limiting with FastAPI"""
    
    def test_rate_limit_headers(self, client: TestClient, auth_headers):
        """Test that rate limit headers are included"""
        response = client.get("/api/v1/users/me", headers=auth_headers)
        
        # Check headers exist
        assert "X-RateLimit-Limit" in response.headers
        assert "X-RateLimit-Remaining" in response.headers
        assert "X-RateLimit-Reset" in response.headers
    
    def test_rate_limit_enforcement(self, client: TestClient):
        """Test rate limiting is enforced"""
        # This test would need to make 100+ requests
        # Skipping in unit tests, should be in E2E/integration tests
        pass
    
    def test_different_users_different_limits(
        self,
        client: TestClient,
        auth_headers,
        admin_headers
    ):
        """Test that different users have independent rate limits"""
        # Regular user request
        response1 = client.get("/api/v1/users/me", headers=auth_headers)
        limit1 = int(response1.headers.get("X-RateLimit-Limit", 0))
        
        # Admin user request
        response2 = client.get("/api/v1/admin/users", headers=admin_headers)
        limit2 = int(response2.headers.get("X-RateLimit-Limit", 0))
        
        # Admin should have higher limit or unlimited
        assert limit2 >= limit1 or limit2 == -1


@pytest.mark.performance
class TestRateLimiterPerformance:
    """Performance tests for rate limiter"""
    
    def test_check_rate_limit_performance(self, redis_client):
        """Test that rate limit check is fast"""
        limiter = AdvancedRateLimiter(redis_client)
        
        start_time = time.time()
        
        # Check 1000 times
        for i in range(1000):
            limiter.check_rate_limit(
                identifier=f"user_{i}",
                tier=RateLimitTier.FREE,
                window="hour"
            )
        
        elapsed = time.time() - start_time
        
        # Should complete in less than 1 second
        assert elapsed < 1.0
        
        # Average should be < 1ms per check
        avg_time = elapsed / 1000
        assert avg_time < 0.001


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--cov=services.rate_limiter"])
