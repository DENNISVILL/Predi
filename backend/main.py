"""
Predix Backend - Main FastAPI Application
Enterprise-ready backend with AI integration, authentication, and payments
"""

from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager
import logging
import time
import uvicorn
import os

# Import configuration and database
from config.settings import settings
from database.connection import init_db, close_db
from database.models import Base

# Import routes
from routes import users, trends, analytics, payments, ai, health, admin, two_factor
from services.auth_service import AuthService
from services.websocket_service import WebSocketManager

# Import Rate Limiter
from services.rate_limiter import RateLimitMiddleware
import redis

# Import Security Middleware
from middleware.security_headers import SecurityHeadersMiddleware, RateLimitHeadersMiddleware

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

# Global WebSocket manager
websocket_manager = WebSocketManager()

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan events"""
    # Startup
    logger.info("🚀 Starting Predix Backend...")
    
    # Initialize Sentry for error tracking
    if settings.SENTRY_DSN:
        from services.sentry_service import init_sentry
        sentry = init_sentry(
            dsn=settings.SENTRY_DSN,
            environment=os.getenv("ENVIRONMENT", "development")
        )
        app.state.sentry = sentry
        logger.info("✅ Sentry error tracking enabled")
    else:
        logger.warning("⚠️ Sentry DSN not configured. Error tracking disabled.")
    
    # Initialize database
    await init_db()
    logger.info("✅ Database initialized")
    
    # Initialize Redis for rate limiting
    try:
        redis_client = redis.Redis.from_url(
            settings.REDIS_URL,
            decode_responses=True
        )
        # Test connection
        redis_client.ping()
        logger.info("✅ Redis connected")
        app.state.redis = redis_client
    except Exception as e:
        logger.warning(f"⚠️ Redis connection failed: {e}. Rate limiting disabled.")
        app.state.redis = None
    
    # Initialize AI connection
    from services.ai_connector import AIConnector
    ai_connector = AIConnector()
    await ai_connector.health_check()
    logger.info("✅ AI system connected")
    
    # Store global instances
    app.state.websocket_manager = websocket_manager
    app.state.ai_connector = ai_connector
    
    yield
    
    # Shutdown
    logger.info("🔄 Shutting down Predix Backend...")
    
    # Close Redis connection
    if hasattr(app.state, 'redis') and app.state.redis:
        app.state.redis.close()
        logger.info("✅ Redis connection closed")
    
    await close_db()
    logger.info("✅ Database connections closed")

# Create FastAPI application
app = FastAPI(
    title="Predix Backend API",
    description="Enterprise backend for viral trend prediction platform",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

# Security middleware
app.add_middleware(TrustedHostMiddleware, allowed_hosts=settings.ALLOWED_HOSTS)

# Security Headers Middleware (Helmet equivalent)
app.add_middleware(SecurityHeadersMiddleware)
app.add_middleware(RateLimitHeadersMiddleware)

# CORS middleware con configuración segura
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allow_headers=[
        "Content-Type",
        "Authorization",
        "Accept",
        "Origin",
        "User-Agent",
        "DNT",
        "Cache-Control",
        "X-Requested-With",
        "If-Modified-Since",
        "Keep-Alive",
        "X-Custom-Header"
    ],
    expose_headers=["Content-Length", "X-Request-ID"],
    max_age=3600  # Cache preflight requests por 1 hora
)

# Rate Limiting Middleware (added after CORS)
# Will be initialized with Redis client from app.state in requests
@app.middleware("http")
async def rate_limit_middleware(request: Request, call_next):
    """Apply rate limiting to requests"""
    # Skip rate limiting for health checks
    if request.url.path in ["/health", "/api/v1/health"]:
        return await call_next(request)
    
    # Get Redis client from app state
    redis_client = getattr(app.state, 'redis', None)
    
    if redis_client:
        from services.rate_limiter import AdvancedRateLimiter
        limiter = AdvancedRateLimiter(redis_client)
        
        # Get user identifier
        user_id = getattr(request.state, "user_id", None)
        identifier = str(user_id) if user_id else request.client.host
        
        # Determine tier (default to FREE for unauthenticated)
        from services.rate_limiter import RateLimitTier
        tier = RateLimitTier.FREE
        
        # TODO: Extract tier from JWT if authenticated
        
        # Check rate limit
        result = limiter.check_rate_limit(
            identifier=identifier,
            tier=tier,
            window="hour",
            endpoint=request.url.path
        )
        
        response = await call_next(request)
        
        # Add rate limit headers
        response.headers["X-RateLimit-Limit"] = str(result["limit"])
        response.headers["X-RateLimit-Remaining"] = str(result["remaining"])
        if result["reset"]:
            response.headers["X-RateLimit-Reset"] = str(result["reset"])
        
        # Check if limit exceeded
        if not result["allowed"]:
            from fastapi.responses import JSONResponse
            return JSONResponse(
                status_code=429,
                content={"detail": result["message"]},
                headers={
                    "X-RateLimit-Limit": str(result["limit"]),
                    "X-RateLimit-Remaining": "0",
                    "X-RateLimit-Reset": str(result["reset"]),
                    "Retry-After": str(result["reset"])
                }
            )
        
        return response
    else:
        # Redis not available, skip rate limiting
        return await call_next(request)

# Request logging middleware
@app.middleware("http")
async def log_requests(request: Request, call_next):
    """Log all requests with timing"""
    start_time = time.time()
    
    # Log request
    logger.info(f"📥 {request.method} {request.url.path} - {request.client.host}")
    
    # Process request
    response = await call_next(request)
    
    # Log response
    process_time = time.time() - start_time
    logger.info(f"📤 {request.method} {request.url.path} - {response.status_code} - {process_time:.3f}s")
    
    # Add timing header
    response.headers["X-Process-Time"] = str(process_time)
    
    return response

# Global exception handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """Handle all unhandled exceptions"""
    logger.error(f"❌ Unhandled exception: {exc}", exc_info=True)
    
    return JSONResponse(
        status_code=500,
        content={
            "error": "Internal server error",
            "message": "An unexpected error occurred",
            "request_id": getattr(request.state, "request_id", "unknown")
        }
    )

# Include routers
app.include_router(health.router, prefix="/api/v1", tags=["Health"])
app.include_router(users.router, prefix="/api/v1", tags=["Users"])
app.include_router(two_factor.router, prefix="/api/v1", tags=["2FA"])
app.include_router(trends.router, prefix="/api/v1", tags=["Trends"])
app.include_router(analytics.router, prefix="/api/v1", tags=["Analytics"])
app.include_router(payments.router, prefix="/api/v1", tags=["Payments"])
app.include_router(ai.router, prefix="/api/v1", tags=["AI"])
app.include_router(admin.router, prefix="/api/v1/admin", tags=["Admin"])

# Include new routers from routers/ directory
from routers import posts, predictions, subscriptions
app.include_router(posts.router, prefix="/api/v1", tags=["Posts"])
app.include_router(predictions.router, prefix="/api/v1", tags=["Predictions"])
app.include_router(subscriptions.router, prefix="/api/v1", tags=["Subscriptions"])


# WebSocket endpoint
app.mount("/ws", websocket_manager.get_app())

# Root endpoint
@app.get("/")
async def root():
    """Root endpoint with API information"""
    return {
        "name": "Predix Backend API",
        "version": "1.0.0",
        "status": "operational",
        "docs": "/docs",
        "health": "/api/v1/health",
        "websocket": "/ws",
        "ai_integration": "connected"
    }

# Health check endpoint
@app.get("/health")
async def health_check():
    """Simple health check"""
    return {
        "status": "healthy",
        "timestamp": time.time(),
        "version": "1.0.0"
    }

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.DEBUG,
        log_level="info"
    )
