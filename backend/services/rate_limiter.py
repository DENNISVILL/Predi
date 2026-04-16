"""
Advanced Rate Limiting Service
Tier-based rate limiting with Redis backend
"""

import redis
import time
from typing import Optional, Dict
from datetime import datetime, timedelta
from functools import wraps
from fastapi import HTTPException, status, Request
from enum import Enum


class RateLimitTier(str, Enum):
    """Rate limit tiers based on subscription plans"""
    FREE = "free"
    PRO = "pro"
    ENTERPRISE = "enterprise"
    ADMIN = "admin"


class RateLimitConfig:
    """Rate limit configurations per tier"""
    
    LIMITS = {
        RateLimitTier.FREE: {
            "requests_per_hour": 100,
            "requests_per_day": 1000,
            "predictions_per_month": 100,
            "burst_size": 10,
        },
        RateLimitTier.PRO: {
            "requests_per_hour": 1000,
            "requests_per_day": 10000,
            "predictions_per_month": -1,  # Unlimited
            "burst_size": 50,
        },
        RateLimitTier.ENTERPRISE: {
            "requests_per_hour": -1,  # Unlimited
            "requests_per_day": -1,  # Unlimited
            "predictions_per_month": -1,  # Unlimited
            "burst_size": 100,
        },
        RateLimitTier.ADMIN: {
            "requests_per_hour": -1,  # Unlimited
            "requests_per_day": -1,  # Unlimited
            "predictions_per_month": -1,  # Unlimited
            "burst_size": -1,  # Unlimited
        }
    }
    
    # Endpoint-specific limits
    ENDPOINT_LIMITS = {
        "/api/v1/ai/predict": {
            RateLimitTier.FREE: 20,  # per hour
            RateLimitTier.PRO: 200,
            RateLimitTier.ENTERPRISE: -1,
        },
        "/api/v1/ai/batch-predict": {
            RateLimitTier.FREE: 0,  # Not allowed
            RateLimitTier.PRO: 50,
            RateLimitTier.ENTERPRISE: -1,
        },
    }


class AdvancedRateLimiter:
    """Advanced rate limiter with tier-based limits"""
    
    def __init__(self, redis_client: redis.Redis):
        self.redis = redis_client
        self.config = RateLimitConfig()
    
    def _get_key(self, identifier: str, window: str) -> str:
        """Generate Redis key for rate limiting"""
        return f"ratelimit:{identifier}:{window}"
    
    def _get_user_tier(self, user_id: int, db) -> RateLimitTier:
        """Get user's subscription tier from database"""
        from database.models import User
        
        user = db.query(User).filter(User.id == user_id).first()
        
        if not user:
            return RateLimitTier.FREE
        
        # Map user role/plan to tier
        if user.role == "admin":
            return RateLimitTier.ADMIN
        elif hasattr(user, 'subscription_plan'):
            plan = user.subscription_plan.lower()
            if 'enterprise' in plan:
                return RateLimitTier.ENTERPRISE
            elif 'pro' in plan or 'premium' in plan:
                return RateLimitTier.PRO
        
        return RateLimitTier.FREE
    
    def check_rate_limit(
        self,
        identifier: str,
        tier: RateLimitTier,
        window: str = "hour",
        endpoint: Optional[str] = None
    ) -> Dict[str, any]:
        """
        Check if request is within rate limit
        
        Args:
            identifier: User ID or IP address
            tier: User's subscription tier
            window: Time window (hour, day, month)
            endpoint: Specific endpoint for endpoint-based limits
        
        Returns:
            Dict with allowed status and limit info
        """
        limits = self.config.LIMITS[tier]
        
        # Check endpoint-specific limits first
        if endpoint and endpoint in self.config.ENDPOINT_LIMITS:
            endpoint_limit = self.config.ENDPOINT_LIMITS[endpoint].get(tier, 0)
            if endpoint_limit == 0:
                return {
                    "allowed": False,
                    "limit": 0,
                    "remaining": 0,
                    "reset": None,
                    "message": "This endpoint is not available in your plan"
                }
            elif endpoint_limit > 0:
                # Use endpoint-specific limit
                return self._check_limit(
                    identifier, 
                    endpoint_limit, 
                    f"{endpoint}:hour"
                )
        
        # Get limit for window
        limit_key = f"requests_per_{window}"
        limit = limits.get(limit_key, -1)
        
        # -1 means unlimited
        if limit == -1:
            return {
                "allowed": True,
                "limit": -1,
                "remaining": -1,
                "reset": None,
                "message": "Unlimited"
            }
        
        # Check limit
        return self._check_limit(identifier, limit, window)
    
    def _check_limit(
        self,
        identifier: str,
        limit: int,
        window: str
    ) -> Dict[str, any]:
        """Internal method to check and update rate limit"""
        key = self._get_key(identifier, window)
        
        # Get current count
        current = self.redis.get(key)
        current = int(current) if current else 0
        
        # Calculate reset time
        if window == "hour":
            ttl = 3600
        elif window == "day":
            ttl = 86400
        elif window == "month":
            ttl = 2592000
        else:
            ttl = 3600
        
        # Check if limit exceeded
        if current >= limit:
            reset_time = self.redis.ttl(key)
            return {
                "allowed": False,
                "limit": limit,
                "remaining": 0,
                "reset": reset_time,
                "message": f"Rate limit exceeded. Try again in {reset_time} seconds."
            }
        
        # Increment counter
        pipe = self.redis.pipeline()
        pipe.incr(key)
        pipe.expire(key, ttl)
        pipe.execute()
        
        return {
            "allowed": True,
            "limit": limit,
            "remaining": limit - current - 1,
            "reset": ttl,
            "message": "OK"
        }
    
    def reset_limit(self, identifier: str, window: str = "hour"):
        """Reset rate limit for identifier (admin function)"""
        key = self._get_key(identifier, window)
        self.redis.delete(key)
    
    def get_usage_stats(self, identifier: str) -> Dict[str, int]:
        """Get current usage statistics"""
        stats = {}
        for window in ["hour", "day", "month"]:
            key = self._get_key(identifier, window)
            count = self.redis.get(key)
            stats[window] = int(count) if count else 0
        return stats


class RateLimitMiddleware:
    """FastAPI middleware for rate limiting"""
    
    def __init__(self, redis_client: redis.Redis):
        self.limiter = AdvancedRateLimiter(redis_client)
    
    async def __call__(self, request: Request, call_next):
        """Process request and check rate limits"""
        
        # Skip rate limiting for health checks
        if request.url.path in ["/health", "/api/v1/health"]:
            return await call_next(request)
        
        # Get user identifier
        user_id = getattr(request.state, "user_id", None)
        identifier = str(user_id) if user_id else request.client.host
        
        # Get user tier (default to FREE for unauthenticated)
        tier = RateLimitTier.FREE
        if user_id:
            # Get tier from database or request state
            tier = getattr(request.state, "user_tier", RateLimitTier.FREE)
        
        # Check rate limit
        result = self.limiter.check_rate_limit(
            identifier=identifier,
            tier=tier,
            window="hour",
            endpoint=request.url.path
        )
        
        # Add rate limit headers
        response = await call_next(request)
        response.headers["X-RateLimit-Limit"] = str(result["limit"])
        response.headers["X-RateLimit-Remaining"] = str(result["remaining"])
        if result["reset"]:
            response.headers["X-RateLimit-Reset"] = str(result["reset"])
        
        # Check if limit exceeded
        if not result["allowed"]:
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail=result["message"],
                headers={
                    "X-RateLimit-Limit": str(result["limit"]),
                    "X-RateLimit-Remaining": "0",
                    "X-RateLimit-Reset": str(result["reset"]),
                    "Retry-After": str(result["reset"])
                }
            )
        
        return response


def rate_limit(
    tier: Optional[RateLimitTier] = None,
    requests_per_hour: Optional[int] = None
):
    """
    Decorator for route-specific rate limiting
    
    Usage:
        @router.get("/expensive-endpoint")
        @rate_limit(requests_per_hour=10)
        async def expensive_operation():
            pass
    """
    def decorator(func):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            # Get request from kwargs
            request = kwargs.get("request") or next(
                (arg for arg in args if isinstance(arg, Request)), None
            )
            
            if not request:
                # No request object, skip rate limiting
                return await func(*args, **kwargs)
            
            # Implementation here would check rate limit
            # For now, return the function
            return await func(*args, **kwargs)
        
        return wrapper
    return decorator


# Example usage in routes:
"""
from services.rate_limiter import rate_limit, RateLimitTier

@router.post("/api/v1/ai/predict")
@rate_limit(tier=RateLimitTier.FREE, requests_per_hour=20)
async def predict_trend(request: Request):
    # Your endpoint logic
    pass
"""
