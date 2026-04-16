"""
Predix Backend API - Configuration Management
Production-ready settings with environment variables
"""
from pydantic_settings import BaseSettings
from typing import List, Optional
from functools import lru_cache
import os
from pathlib import Path

# Base directory
BASE_DIR = Path(__file__).resolve().parent


class Settings(BaseSettings):
    """
    Application settings loaded from environment variables
    Uses Pydantic for validation and type safety
    """
    
    # ============================================
    # Application Settings
    # ============================================
    APP_NAME: str = "Predix API"
    APP_VERSION: str = "1.0.0"
    ENVIRONMENT: str = "development"  # development, staging, production
    DEBUG: bool = True
    API_PREFIX: str = "/api"
    
    # ============================================
    # Database Configuration
    # ============================================
    DATABASE_URL: str = "postgresql://predix:predixpassword@localhost:5432/predix_db"
    DATABASE_POOL_SIZE: int = 10
    DATABASE_MAX_OVERFLOW: int = 20
    DATABASE_POOL_PRE_PING: bool = True
    DATABASE_ECHO: bool = False  # Log SQL queries (use in debug only)
    
    # ============================================
    # Security & Authentication
    # ============================================
    SECRET_KEY: str = "your-secret-key-change-in-production-use-openssl-rand-hex-32"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30  # 30 minutes
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7     # 7 days
    PASSWORD_MIN_LENGTH: int = 8
    
    # ============================================
    # CORS Configuration
    # ============================================
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3000",
    ]
    CORS_ALLOW_CREDENTIALS: bool = True
    CORS_ALLOW_METHODS: List[str] = ["*"]
    CORS_ALLOW_HEADERS: List[str] = ["*"]
    
    # ============================================
    # Rate Limiting
    # ============================================
    RATE_LIMIT_ENABLED: bool = True
    RATE_LIMIT_PER_MINUTE: int = 60
    RATE_LIMIT_PER_HOUR: int = 1000
    RATE_LIMIT_STORAGE: str = "memory"  # memory or redis
    
    # ============================================
    # Email Configuration (SMTP)
    # ============================================
    SMTP_HOST: str = "smtp.gmail.com"
    SMTP_PORT: int = 587
    SMTP_USER: str = ""
    SMTP_PASSWORD: str = ""
    SMTP_TLS: bool = True
    SMTP_SSL: bool = False
    EMAIL_FROM: str = "noreply@predix.app"
    EMAIL_FROM_NAME: str = "Predix"
    
    # Email Templates
    VERIFICATION_EMAIL_SUBJECT: str = "Verify your Predix account"
    PASSWORD_RESET_SUBJECT: str = "Reset your Predix password"
    
    # ============================================
    # Stripe Payment Configuration
    # ============================================
    STRIPE_SECRET_KEY: str = ""
    STRIPE_PUBLISHABLE_KEY: str = ""
    STRIPE_WEBHOOK_SECRET: str = ""
    STRIPE_API_VERSION: str = "2023-10-16"
    
    # Subscription Plans
    STRIPE_PRICE_PRO_MONTHLY: str = ""  # price_xxx from Stripe
    STRIPE_PRICE_PRO_YEARLY: str = ""
    STRIPE_PRICE_ENTERPRISE: str = ""
    
    # ============================================
    # OpenAI Configuration
    # ============================================
    OPENAI_API_KEY: str = ""
    OPENAI_MODEL: str = "gpt-4-turbo-preview"
    OPENAI_MAX_TOKENS: int = 1000
    OPENAI_TEMPERATURE: float = 0.7
    OPENAI_TIMEOUT: int = 30  # seconds
    
    # ============================================
    # Redis Configuration (Caching & Celery)
    # ============================================
    REDIS_URL: str = "redis://localhost:6379/0"
    REDIS_CACHE_TTL: int = 3600  # 1 hour default
    REDIS_MAX_CONNECTIONS: int = 50
    
    # ============================================
    # Celery Configuration (Background Tasks)
    # ============================================
    CELERY_BROKER_URL: str = "redis://localhost:6379/1"
    CELERY_RESULT_BACKEND: str = "redis://localhost:6379/2"
    CELERY_TASK_SERIALIZER: str = "json"
    CELERY_RESULT_SERIALIZER: str = "json"
    CELERY_ACCEPT_CONTENT: List[str] = ["json"]
    CELERY_TIMEZONE: str = "UTC"
    
    # ============================================
    # Monitoring & Logging
    # ============================================
    SENTRY_DSN: Optional[str] = None
    SENTRY_ENVIRONMENT: str = "development"
    SENTRY_TRACES_SAMPLE_RATE: float = 1.0
    
    LOG_LEVEL: str = "INFO"  # DEBUG, INFO, WARNING, ERROR, CRITICAL
    LOG_FORMAT: str = "json"  # json or text
    
    # ============================================
    # Frontend Configuration
    # ============================================
    FRONTEND_URL: str = "http://localhost:3000"
    FRONTEND_VERIFY_EMAIL_PATH: str = "/verify-email"
    FRONTEND_RESET_PASSWORD_PATH: str = "/reset-password"
    
    # ============================================
    # File Upload Configuration
    # ============================================
    MAX_UPLOAD_SIZE: int = 10 * 1024 * 1024  # 10 MB
    ALLOWED_UPLOAD_EXTENSIONS: List[str] = [
        "jpg", "jpeg", "png", "gif", "webp",
        "mp4", "mov", "avi", "webm"
    ]
    UPLOAD_DIR: str = "uploads"
    
    # ============================================
    # Social Media APIs (for posting)
    # ============================================
    TIKTOK_API_KEY: str = ""
    INSTAGRAM_API_KEY: str = ""
    YOUTUBE_API_KEY: str = ""
    FACEBOOK_API_KEY: str = ""
    TWITTER_API_KEY: str = ""
    LINKEDIN_API_KEY: str = ""
    
    # ============================================
    # Feature Flags
    # ============================================
    ENABLE_REGISTRATION: bool = True
    ENABLE_EMAIL_VERIFICATION: bool = True
    ENABLE_PAYMENTS: bool = True
    ENABLE_AI_PREDICTIONS: bool = True
    ENABLE_SOCIAL_POSTING: bool = False  # Not implemented yet
    
    # ============================================
    # Performance & Optimization
    # ============================================
    ENABLE_QUERY_LOGGING: bool = False
    ENABLE_RESPONSE_COMPRESSION: bool = True
    API_REQUEST_TIMEOUT: int = 30  # seconds
    
    # ============================================
    # Pagination Defaults
    # ============================================
    DEFAULT_PAGE_SIZE: int = 20
    MAX_PAGE_SIZE: int = 100
    
    # ============================================
    # Security Headers
    # ============================================
    ENABLE_SECURITY_HEADERS: bool = True
    HSTS_MAX_AGE: int = 31536000  # 1 year
    
    class Config:
        """Pydantic configuration"""
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = True
        
        # Load from .env file in parent directory
        @classmethod
        def customise_sources(cls, init_settings, env_settings, file_secret_settings):
            return (
                init_settings,
                env_settings,
                file_secret_settings,
            )


@lru_cache()
def get_settings() -> Settings:
    """
    Get cached settings instance
    Uses lru_cache to avoid re-reading .env file on every call
    """
    return Settings()


# Singleton settings instance
settings = get_settings()


# Helper functions
def is_production() -> bool:
    """Check if running in production environment"""
    return settings.ENVIRONMENT == "production"


def is_development() -> bool:
    """Check if running in development environment"""
    return settings.ENVIRONMENT == "development"


def is_staging() -> bool:
    """Check if running in staging environment"""
    return settings.ENVIRONMENT == "staging"
