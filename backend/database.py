"""
Database configuration and session management
Production-ready PostgreSQL setup with SQLAlchemy
"""
from sqlalchemy import create_engine, event
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy.pool import QueuePool
from typing import Generator
import logging

from config import settings

# Configure logging
logger = logging.getLogger(__name__)

# ============================================
# Database Engine Configuration
# ============================================
engine = create_engine(
    settings.DATABASE_URL,
    # Connection Pool Settings
    poolclass=QueuePool,
    pool_size=settings.DATABASE_POOL_SIZE,
    max_overflow=settings.DATABASE_MAX_OVERFLOW,
    pool_pre_ping=settings.DATABASE_POOL_PRE_PING,
    pool_recycle=3600,  # Recycle connections after 1 hour
    
    # Echo SQL queries (only in debug)
    echo=settings.DATABASE_ECHO,
    
    # Connection arguments for PostgreSQL
    connect_args={
        "options": "-c timezone=utc",
        "connect_timeout": 10,
    },
    
    # Performance
    future=True,  # Use SQLAlchemy 2.0 style
)

# ============================================
# Session Factory
# ============================================
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
    expire_on_commit=False  # Don't expire objects after commit
)

# ============================================
# Base Class for Models
# ============================================
Base = declarative_base()

# ============================================
# Event Listeners
# ============================================
@event.listens_for(engine, "connect")
def receive_connect(dbapi_conn, connection_record):
    """
    Event listener fired when a new database connection is created
    Useful for logging or setting connection-specific options
    """
    logger.debug("Database connection established")


@event.listens_for(engine, "checkout")
def receive_checkout(dbapi_conn, connection_record, connection_proxy):
    """
    Event listener fired when a connection is checked out from the pool
    """
    logger.debug("Connection checked out from pool")


# ============================================
# Database Dependency for FastAPI
# ============================================
def get_db() -> Generator[Session, None, None]:
    """
    Database session dependency for FastAPI endpoints
    
    Usage:
        @app.get("/users/")
        def get_users(db: Session = Depends(get_db)):
            return db.query(User).all()
    
    Yields:
        Session: Database session
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


# ============================================
# Database Initialization
# ============================================
def init_db() -> None:
    """
    Initialize database tables
    Creates all tables defined in models
    
    WARNING: Only use this for initial setup or testing
    In production, use Alembic migrations
    """
    try:
        logger.info("Creating database tables...")
        Base.metadata.create_all(bind=engine)
        logger.info("✅ Database tables created successfully")
    except Exception as e:
        logger.error(f"❌ Error creating database tables: {e}")
        raise


def drop_db() -> None:
    """
    Drop all database tables
    
    WARNING: This will delete ALL data!
    Only use for testing or development
    """
    try:
        logger.warning("⚠️  Dropping all database tables...")
        Base.metadata.drop_all(bind=engine)
        logger.info("✅ Database tables dropped successfully")
    except Exception as e:
        logger.error(f"❌ Error dropping database tables: {e}")
        raise


# ============================================
# Database Health Check
# ============================================
def check_db_connection() -> bool:
    """
    Check if database connection is alive
    
    Returns:
        bool: True if connection is alive, False otherwise
    """
    try:
        db = SessionLocal()
        db.execute("SELECT 1")
        db.close()
        return True
    except Exception as e:
        logger.error(f"Database connection check failed: {e}")
        return False


# ============================================
# Transaction Context Manager
# ============================================
class DatabaseTransaction:
    """
    Context manager for database transactions
    
    Usage:
        with DatabaseTransaction() as db:
            user = User(email="test@example.com")
            db.add(user)
            # Automatically commits on success, rolls back on exception
    """
    
    def __init__(self):
        self.db = SessionLocal()
    
    def __enter__(self) -> Session:
        return self.db
    
    def __exit__(self, exc_type, exc_val, exc_tb):
        if exc_type is not None:
            logger.error(f"Transaction error: {exc_val}")
            self.db.rollback()
        else:
            self.db.commit()
        self.db.close()
        return False  # Don't suppress exceptions
