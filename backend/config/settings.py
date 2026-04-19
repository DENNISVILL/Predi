"""
Predix Backend Configuration
Environment-based settings for development, staging, and production
"""

import os
from typing import List, Optional
from pydantic_settings import BaseSettings
from pydantic import field_validator
from functools import lru_cache

class Settings(BaseSettings):
    """Application settings with environment variable support"""
    
    # Application
    APP_NAME: str = "Predix Backend"
    VERSION: str = "1.0.0"
    DEBUG: bool = False
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    
    # Security - CRÍTICO: SECRET_KEY debe estar en .env
    SECRET_KEY: str  # Sin default - fallará si no está en .env (SEGURIDAD)
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    
    # CORS
    CORS_ORIGINS: List[str] = ["http://localhost:3000", "http://localhost:3001"]
    ALLOWED_HOSTS: List[str] = ["localhost", "127.0.0.1", "*.predix.com"]
    
    # Database
    DATABASE_URL: str = "postgresql://predix_user:predix_pass@localhost:5432/predix_db"
    DATABASE_ECHO: bool = False
    DATABASE_POOL_SIZE: int = 10
    DATABASE_MAX_OVERFLOW: int = 20
    
    # Redis
    REDIS_URL: str = "redis://localhost:6379/0"
    REDIS_EXPIRE_SECONDS: int = 3600
    
    # AI System (internal microservice)
    AI_API_URL: str = "http://localhost:8001"
    AI_API_KEY: Optional[str] = None
    AI_TIMEOUT_SECONDS: int = 30

    # Google Gemini (Direct integration)
    GEMINI_API_KEY: Optional[str] = None
    GEMINI_DEFAULT_MODEL: str = "gemini-2.5-flash"
    GEMINI_CACHE_TTL_MINUTES: int = 60

    # Google OAuth & Calendar
    GOOGLE_CLIENT_ID: Optional[str] = None
    GOOGLE_CLIENT_SECRET: Optional[str] = None
    GOOGLE_REDIRECT_URI: str = "http://localhost:8000/auth/google/callback"

    # Social Media APIs
    SPOTIFY_CLIENT_ID: Optional[str] = None
    SPOTIFY_CLIENT_SECRET: Optional[str] = None
    YOUTUBE_API_KEY: Optional[str] = None
    META_ACCESS_TOKEN: Optional[str] = None

    # Payments
    PAYMENTEZ_APP_CODE: Optional[str] = None
    PAYMENTEZ_APP_KEY: Optional[str] = None
    PAYMENTEZ_ENVIRONMENT: str = "stg"  # stg or prod
    PAYMENTEZ_WEBHOOK_SECRET: Optional[str] = None
    
    # Email
    SMTP_HOST: str = "smtp.gmail.com"
    SMTP_PORT: int = 587
    SMTP_USER: Optional[str] = None
    SMTP_PASSWORD: Optional[str] = None
    EMAIL_FROM: str = "noreply@predix.com"
    
    # Rate Limiting
    RATE_LIMIT_REQUESTS: int = 100
    RATE_LIMIT_WINDOW: int = 60  # seconds
    
    # Logging
    LOG_LEVEL: str = "INFO"
    LOG_FORMAT: str = "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
    
    # File Storage
    UPLOAD_DIR: str = "uploads"
    MAX_FILE_SIZE: int = 10 * 1024 * 1024  # 10MB
    ALLOWED_FILE_TYPES: List[str] = ["image/jpeg", "image/png", "image/gif"]
    
    # WebSocket
    WS_HEARTBEAT_INTERVAL: int = 30
    WS_MAX_CONNECTIONS: int = 1000
    
    # Monitoring
    SENTRY_DSN: Optional[str] = None
    ENABLE_METRICS: bool = True
    
    @field_validator("CORS_ORIGINS", mode='before')
    @classmethod
    def assemble_cors_origins(cls, v):
        if isinstance(v, str):
            return [i.strip() for i in v.split(",")]
        return v
    
    @field_validator("ALLOWED_HOSTS", mode='before')
    @classmethod
    def assemble_allowed_hosts(cls, v):
        if isinstance(v, str):
            return [i.strip() for i in v.split(",")]
        return v
    
    model_config = {
        "env_file": ".env",
        "case_sensitive": True
    }

class DevelopmentSettings(Settings):
    """Development environment settings"""
    DEBUG: bool = True
    DATABASE_ECHO: bool = True
    LOG_LEVEL: str = "DEBUG"

class ProductionSettings(Settings):
    """Production environment settings"""
    DEBUG: bool = False
    DATABASE_ECHO: bool = False
    LOG_LEVEL: str = "INFO"
    
    # Override security settings for production
    CORS_ORIGINS: List[str] = ["https://app.predix.com", "https://predix.com"]
    ALLOWED_HOSTS: List[str] = ["predix.com", "*.predix.com", "api.predix.com"]

class TestingSettings(Settings):
    """Testing environment settings"""
    DEBUG: bool = True
    DATABASE_URL: str = "postgresql://test_user:test_pass@localhost:5432/predix_test_db"
    REDIS_URL: str = "redis://localhost:6379/1"

@lru_cache()
def get_settings() -> Settings:
    """Get settings based on environment"""
    environment = os.getenv("ENVIRONMENT", "development").lower()
    
    if environment == "production":
        return ProductionSettings()
    elif environment == "testing":
        return TestingSettings()
    else:
        return DevelopmentSettings()

# Global settings instance
settings = get_settings()

# Database configuration
class DatabaseConfig:
    """Database connection configuration"""
    
    @staticmethod
    def get_database_url() -> str:
        """Get database URL with proper formatting"""
        return settings.DATABASE_URL
    
    @staticmethod
    def get_engine_config() -> dict:
        """Get SQLAlchemy engine configuration"""
        return {
            "echo": settings.DATABASE_ECHO,
            "pool_size": settings.DATABASE_POOL_SIZE,
            "max_overflow": settings.DATABASE_MAX_OVERFLOW,
            "pool_pre_ping": True,
            "pool_recycle": 3600,
        }

# Redis configuration
class RedisConfig:
    """Redis connection configuration"""
    
    @staticmethod
    def get_redis_url() -> str:
        """Get Redis URL"""
        return settings.REDIS_URL
    
    @staticmethod
    def get_redis_config() -> dict:
        """Get Redis connection configuration"""
        return {
            "decode_responses": True,
            "health_check_interval": 30,
            "socket_keepalive": True,
            "socket_keepalive_options": {},
        }

# JWT configuration
class JWTConfig:
    """JWT token configuration"""
    
    @staticmethod
    def get_jwt_config() -> dict:
        """Get JWT configuration"""
        return {
            "secret_key": settings.SECRET_KEY,
            "algorithm": settings.ALGORITHM,
            "access_token_expire_minutes": settings.ACCESS_TOKEN_EXPIRE_MINUTES,
            "refresh_token_expire_days": settings.REFRESH_TOKEN_EXPIRE_DAYS,
        }

# Payment configuration
class PaymentConfig:
    """Payment system configuration"""
    
    @staticmethod
    def get_paymentez_config() -> dict:
        """Get Paymentez configuration"""
        return {
            "app_code": settings.PAYMENTEZ_APP_CODE,
            "app_key": settings.PAYMENTEZ_APP_KEY,
            "environment": settings.PAYMENTEZ_ENVIRONMENT,
            "webhook_secret": settings.PAYMENTEZ_WEBHOOK_SECRET,
        }
    
    @staticmethod
    def is_payment_enabled() -> bool:
        """Check if payment system is properly configured"""
        return all([
            settings.PAYMENTEZ_APP_CODE,
            settings.PAYMENTEZ_APP_KEY,
            settings.PAYMENTEZ_WEBHOOK_SECRET
        ])

# AI system configuration
class AIConfig:
    """AI system integration configuration"""
    
    @staticmethod
    def get_ai_config() -> dict:
        """Get AI system configuration"""
        return {
            "base_url": settings.AI_API_URL,
            "api_key": settings.AI_API_KEY,
            "timeout": settings.AI_TIMEOUT_SECONDS,
        }
    
    @staticmethod
    def get_ai_endpoints() -> dict:
        """Get AI system endpoints"""
        base_url = settings.AI_API_URL
        return {
            "predict": f"{base_url}/predict",
            "batch_predict": f"{base_url}/batch-predict",
            "trending": f"{base_url}/trending",
            "alerts": f"{base_url}/alerts/check",
            "health": f"{base_url}/health",
            "models": f"{base_url}/models/status",
        }

# Export commonly used configurations
__all__ = [
    "settings",
    "DatabaseConfig",
    "RedisConfig", 
    "JWTConfig",
    "PaymentConfig",
    "AIConfig"
]
