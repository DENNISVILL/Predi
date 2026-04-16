"""
Database Connection and Session Management
PostgreSQL with SQLAlchemy ORM for Predix Backend
"""

from sqlalchemy import create_engine, event
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy.pool import QueuePool
import logging
import asyncio
from typing import Generator
import redis.asyncio as redis

from config.settings import settings, DatabaseConfig, RedisConfig

logger = logging.getLogger(__name__)

# SQLAlchemy setup
engine = create_engine(
    DatabaseConfig.get_database_url(),
    poolclass=QueuePool,
    **DatabaseConfig.get_engine_config()
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Redis setup
redis_client = None

async def init_redis():
    """Initialize Redis connection"""
    global redis_client
    try:
        redis_client = redis.from_url(
            RedisConfig.get_redis_url(),
            **RedisConfig.get_redis_config()
        )
        # Test connection
        await redis_client.ping()
        logger.info("✅ Redis connected successfully")
    except Exception as e:
        logger.error(f"❌ Redis connection failed: {e}")
        redis_client = None

async def close_redis():
    """Close Redis connection"""
    global redis_client
    if redis_client:
        await redis_client.close()
        logger.info("✅ Redis connection closed")

def get_db() -> Generator[Session, None, None]:
    """
    Database session dependency for FastAPI
    Usage: db: Session = Depends(get_db)
    """
    db = SessionLocal()
    try:
        yield db
    except Exception as e:
        logger.error(f"Database session error: {e}")
        db.rollback()
        raise
    finally:
        db.close()

async def get_redis() -> redis.Redis:
    """
    Redis client dependency for FastAPI
    Usage: redis_client = Depends(get_redis)
    """
    global redis_client
    if redis_client is None:
        await init_redis()
    return redis_client

# Database initialization
async def init_db():
    """Initialize database tables and connections"""
    try:
        # Import all models to ensure they are registered
        from database.models import (
            User, Plan, Payment, Alert, Trend, 
            Log, UserSession, TrendPrediction
        )
        
        # Create all tables
        Base.metadata.create_all(bind=engine)
        logger.info("✅ Database tables created/verified")
        
        # Initialize Redis
        await init_redis()
        
        # Create default data if needed
        await create_default_data()
        
    except Exception as e:
        logger.error(f"❌ Database initialization failed: {e}")
        raise

async def close_db():
    """Close database connections"""
    try:
        engine.dispose()
        await close_redis()
        logger.info("✅ Database connections closed")
    except Exception as e:
        logger.error(f"❌ Error closing database: {e}")

async def create_default_data():
    """Create default plans and admin user"""
    db = SessionLocal()
    try:
        from database.models import Plan, User
        from services.auth_service import AuthService
        
        # Create default plans if they don't exist
        existing_plans = db.query(Plan).count()
        if existing_plans == 0:
            plans = [
                Plan(
                    name="Free",
                    description="Basic trend analysis with limited predictions",
                    price=0.00,
                    currency="USD",
                    interval="monthly",
                    features={
                        "predictions_per_month": 100,
                        "real_time_alerts": False,
                        "advanced_analytics": False,
                        "api_access": False,
                        "priority_support": False
                    },
                    is_active=True
                ),
                Plan(
                    name="Pro",
                    description="Advanced analytics with unlimited predictions",
                    price=29.99,
                    currency="USD", 
                    interval="monthly",
                    features={
                        "predictions_per_month": -1,  # unlimited
                        "real_time_alerts": True,
                        "advanced_analytics": True,
                        "api_access": True,
                        "priority_support": False
                    },
                    is_active=True
                ),
                Plan(
                    name="Enterprise",
                    description="Full platform access with priority support",
                    price=99.99,
                    currency="USD",
                    interval="monthly",
                    features={
                        "predictions_per_month": -1,  # unlimited
                        "real_time_alerts": True,
                        "advanced_analytics": True,
                        "api_access": True,
                        "priority_support": True,
                        "custom_integrations": True,
                        "dedicated_account_manager": True
                    },
                    is_active=True
                )
            ]
            
            for plan in plans:
                db.add(plan)
            
            db.commit()
            logger.info("✅ Default plans created")
        
        # Create admin user if it doesn't exist
        admin_user = db.query(User).filter(User.email == "admin@predix.com").first()
        if not admin_user:
            auth_service = AuthService()
            hashed_password = auth_service.hash_password("admin123")
            
            admin_user = User(
                email="admin@predix.com",
                username="admin",
                full_name="Predix Administrator",
                hashed_password=hashed_password,
                is_active=True,
                is_verified=True,
                role="admin"
            )
            
            db.add(admin_user)
            db.commit()
            logger.info("✅ Admin user created (admin@predix.com / admin123)")
        
    except Exception as e:
        logger.error(f"❌ Error creating default data: {e}")
        db.rollback()
    finally:
        db.close()

# Database health check
async def check_db_health() -> dict:
    """Check database connection health"""
    try:
        db = SessionLocal()
        # Simple query to test connection
        db.execute("SELECT 1")
        db.close()
        
        # Check Redis
        redis_status = "connected"
        if redis_client:
            try:
                await redis_client.ping()
            except:
                redis_status = "disconnected"
        else:
            redis_status = "not_initialized"
        
        return {
            "database": "connected",
            "redis": redis_status,
            "status": "healthy"
        }
    except Exception as e:
        logger.error(f"Database health check failed: {e}")
        return {
            "database": "disconnected", 
            "redis": "unknown",
            "status": "unhealthy",
            "error": str(e)
        }

# Database utilities
class DatabaseManager:
    """Database management utilities"""
    
    @staticmethod
    def create_tables():
        """Create all database tables"""
        Base.metadata.create_all(bind=engine)
    
    @staticmethod
    def drop_tables():
        """Drop all database tables (use with caution!)"""
        Base.metadata.drop_all(bind=engine)
    
    @staticmethod
    def get_table_info():
        """Get information about database tables"""
        inspector = engine.inspect(engine)
        tables = inspector.get_table_names()
        
        table_info = {}
        for table in tables:
            columns = inspector.get_columns(table)
            table_info[table] = {
                "columns": len(columns),
                "column_names": [col["name"] for col in columns]
            }
        
        return table_info

# Cache utilities
class CacheManager:
    """Redis cache management utilities"""
    
    @staticmethod
    async def set(key: str, value: str, expire: int = None):
        """Set cache value"""
        if redis_client:
            expire = expire or settings.REDIS_EXPIRE_SECONDS
            await redis_client.setex(key, expire, value)
    
    @staticmethod
    async def get(key: str) -> str:
        """Get cache value"""
        if redis_client:
            return await redis_client.get(key)
        return None
    
    @staticmethod
    async def delete(key: str):
        """Delete cache value"""
        if redis_client:
            await redis_client.delete(key)
    
    @staticmethod
    async def exists(key: str) -> bool:
        """Check if cache key exists"""
        if redis_client:
            return await redis_client.exists(key)
        return False
    
    @staticmethod
    async def clear_pattern(pattern: str):
        """Clear all keys matching pattern"""
        if redis_client:
            keys = await redis_client.keys(pattern)
            if keys:
                await redis_client.delete(*keys)

# Event listeners for database monitoring
@event.listens_for(engine, "connect")
def set_sqlite_pragma(dbapi_connection, connection_record):
    """Set database connection parameters"""
    if "postgresql" in str(dbapi_connection):
        # PostgreSQL specific settings
        with dbapi_connection.cursor() as cursor:
            cursor.execute("SET timezone TO 'UTC'")

@event.listens_for(engine, "checkout")
def receive_checkout(dbapi_connection, connection_record, connection_proxy):
    """Log database connection checkout"""
    logger.debug("Database connection checked out")

@event.listens_for(engine, "checkin")
def receive_checkin(dbapi_connection, connection_record):
    """Log database connection checkin"""
    logger.debug("Database connection checked in")

# Export main components
__all__ = [
    "engine",
    "SessionLocal", 
    "Base",
    "get_db",
    "get_redis",
    "init_db",
    "close_db",
    "check_db_health",
    "DatabaseManager",
    "CacheManager"
]
