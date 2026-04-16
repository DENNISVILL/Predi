"""
Database Models for Predix Backend
SQLAlchemy ORM models with relationships and constraints
"""

from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, Text, JSON, ForeignKey, Index, UniqueConstraint
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from datetime import datetime, timezone
import uuid
from enum import Enum as PyEnum

from database.connection import Base

# Enums for model fields
class UserRole(PyEnum):
    USER = "user"
    PREMIUM = "premium"
    ADMIN = "admin"

class PaymentStatus(PyEnum):
    PENDING = "pending"
    COMPLETED = "completed"
    FAILED = "failed"
    CANCELLED = "cancelled"
    REFUNDED = "refunded"

class AlertType(PyEnum):
    VIRAL_SPIKE = "viral_spike"
    MICROTREND = "microtrend"
    TREND_UPDATE = "trend_update"
    AI_RECOMMENDATION = "ai_recommendation"

class LogLevel(PyEnum):
    DEBUG = "debug"
    INFO = "info"
    WARNING = "warning"
    ERROR = "error"
    CRITICAL = "critical"

# User model
class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    uuid = Column(String(36), unique=True, index=True, default=lambda: str(uuid.uuid4()))
    
    # Authentication
    email = Column(String(255), unique=True, index=True, nullable=False)
    username = Column(String(50), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    
    # Profile
    full_name = Column(String(255))
    avatar_url = Column(String(500))
    bio = Column(Text)
    
    # Status
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)
    role = Column(String(20), default=UserRole.USER.value)
    
    # Subscription
    current_plan_id = Column(Integer, ForeignKey("plans.id"))
    subscription_expires_at = Column(DateTime(timezone=True))
    
    # Usage tracking
    predictions_used_this_month = Column(Integer, default=0)
    last_prediction_reset = Column(DateTime(timezone=True), default=func.now())
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    last_login_at = Column(DateTime(timezone=True))
    
    # Relationships
    current_plan = relationship("Plan", back_populates="users")
    payments = relationship("Payment", back_populates="user")
    alerts = relationship("Alert", back_populates="user")
    sessions = relationship("UserSession", back_populates="user")
    predictions = relationship("TrendPrediction", back_populates="user")
    posts = relationship("Post", back_populates="user")  # Added for Post model
    logs = relationship("Log", back_populates="user")
    
    # Two-Factor Authentication relationships
    two_factor_auth = relationship("TwoFactorAuth", back_populates="user", uselist=False)
    backup_codes = relationship("BackupCode", back_populates="user")
    two_factor_attempts = relationship("TwoFactorAttempt", back_populates="user")
    
    def __repr__(self):
        return f"<User(id={self.id}, email='{self.email}', role='{self.role}')>"
    
    @property
    def is_premium(self) -> bool:
        """Check if user has premium access"""
        return self.role in [UserRole.PREMIUM.value, UserRole.ADMIN.value]
    
    @property
    def is_admin(self) -> bool:
        """Check if user is admin"""
        return self.role == UserRole.ADMIN.value
    
    def can_make_prediction(self) -> bool:
        """Check if user can make a prediction based on their plan"""
        if not self.current_plan:
            return False
        
        # Unlimited predictions
        if self.current_plan.features.get("predictions_per_month", 0) == -1:
            return True
        
        # Check monthly limit
        monthly_limit = self.current_plan.features.get("predictions_per_month", 0)
        return self.predictions_used_this_month < monthly_limit

# Plan model
class Plan(Base):
    __tablename__ = "plans"
    
    id = Column(Integer, primary_key=True, index=True)
    
    # Plan details
    name = Column(String(50), unique=True, nullable=False)
    description = Column(Text)
    price = Column(Float, nullable=False)
    currency = Column(String(3), default="USD")
    interval = Column(String(20), default="monthly")  # monthly, yearly
    
    # Features (JSON field)
    features = Column(JSON, default={})
    
    # Status
    is_active = Column(Boolean, default=True)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    # Relationships
    users = relationship("User", back_populates="current_plan")
    payments = relationship("Payment", back_populates="plan")
    
    def __repr__(self):
        return f"<Plan(id={self.id}, name='{self.name}', price={self.price})>"

# Payment model
class Payment(Base):
    __tablename__ = "payments"
    
    id = Column(Integer, primary_key=True, index=True)
    uuid = Column(String(36), unique=True, index=True, default=lambda: str(uuid.uuid4()))
    
    # Payment details
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    plan_id = Column(Integer, ForeignKey("plans.id"), nullable=False)
    
    amount = Column(Float, nullable=False)
    currency = Column(String(3), default="USD")
    status = Column(String(20), default=PaymentStatus.PENDING.value)
    
    # External payment data
    external_payment_id = Column(String(255))  # Paymentez transaction ID
    payment_method = Column(String(50))  # card, bank_transfer, etc.
    payment_data = Column(JSON, default={})  # Additional payment gateway data
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    paid_at = Column(DateTime(timezone=True))
    
    # Relationships
    user = relationship("User", back_populates="payments")
    plan = relationship("Plan", back_populates="payments")
    
    def __repr__(self):
        return f"<Payment(id={self.id}, amount={self.amount}, status='{self.status}')>"

# Alert model
class Alert(Base):
    __tablename__ = "alerts"
    
    id = Column(Integer, primary_key=True, index=True)
    uuid = Column(String(36), unique=True, index=True, default=lambda: str(uuid.uuid4()))
    
    # Alert details
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    type = Column(String(30), nullable=False)
    title = Column(String(255), nullable=False)
    message = Column(Text, nullable=False)
    
    # Alert data
    trend_data = Column(JSON, default={})  # Related trend information
    priority = Column(String(10), default="medium")  # low, medium, high
    
    # Status
    is_read = Column(Boolean, default=False)
    is_sent = Column(Boolean, default=False)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    read_at = Column(DateTime(timezone=True))
    sent_at = Column(DateTime(timezone=True))
    
    # Relationships
    user = relationship("User", back_populates="alerts")
    
    def __repr__(self):
        return f"<Alert(id={self.id}, type='{self.type}', priority='{self.priority}')>"

# Trend model (cached trend data)
class Trend(Base):
    __tablename__ = "trends"
    
    id = Column(Integer, primary_key=True, index=True)
    uuid = Column(String(36), unique=True, index=True, default=lambda: str(uuid.uuid4()))
    
    # Trend identification
    platform = Column(String(20), nullable=False)  # tiktok, twitter, etc.
    content_type = Column(String(20), nullable=False)  # hashtag, video, etc.
    name = Column(String(255), nullable=False)
    description = Column(Text)
    
    # Metrics
    views = Column(Integer, default=0)
    likes = Column(Integer, default=0)
    shares = Column(Integer, default=0)
    comments = Column(Integer, default=0)
    engagement_rate = Column(Float, default=0.0)
    
    # Growth metrics
    growth_rate_24h = Column(Float, default=0.0)
    growth_rate_7d = Column(Float, default=0.0)
    
    # AI predictions
    viral_score = Column(Float, default=0.0)
    confidence = Column(Float, default=0.0)
    
    # Additional data
    metadata = Column(JSON, default={})
    
    # Status
    is_active = Column(Boolean, default=True)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    # Relationships
    predictions = relationship("TrendPrediction", back_populates="trend")
    
    def __repr__(self):
        return f"<Trend(id={self.id}, name='{self.name}', viral_score={self.viral_score})>"

# User session model
class UserSession(Base):
    __tablename__ = "user_sessions"
    
    id = Column(Integer, primary_key=True, index=True)
    uuid = Column(String(36), unique=True, index=True, default=lambda: str(uuid.uuid4()))
    
    # Session details
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    token_jti = Column(String(255), unique=True, nullable=False)  # JWT ID
    
    # Session data
    ip_address = Column(String(45))  # IPv4 or IPv6
    user_agent = Column(Text)
    device_info = Column(JSON, default={})
    
    # Status
    is_active = Column(Boolean, default=True)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    expires_at = Column(DateTime(timezone=True), nullable=False)
    last_used_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    user = relationship("User", back_populates="sessions")
    
    def __repr__(self):
        return f"<UserSession(id={self.id}, user_id={self.user_id}, active={self.is_active})>"

# Trend prediction model (user prediction history)
class TrendPrediction(Base):
    __tablename__ = "trend_predictions"
    
    id = Column(Integer, primary_key=True, index=True)
    uuid = Column(String(36), unique=True, index=True, default=lambda: str(uuid.uuid4()))
    
    # Prediction details
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    trend_id = Column(Integer, ForeignKey("trends.id"))
    
    # Input data
    input_data = Column(JSON, nullable=False)
    
    # Prediction results
    viral_score = Column(Float, nullable=False)
    confidence = Column(Float, nullable=False)
    growth_predictions = Column(JSON, default={})  # 24h, 48h, 72h predictions
    
    # Analysis
    components = Column(JSON, default={})  # Score component breakdown
    explanation = Column(Text)
    recommendations = Column(JSON, default=[])
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    user = relationship("User", back_populates="predictions")
    trend = relationship("Trend", back_populates="predictions")
    
    def __repr__(self):
        return f"<TrendPrediction(id={self.id}, viral_score={self.viral_score})>"

# Log model (system and user activity logs)
class Log(Base):
    __tablename__ = "logs"
    
    id = Column(Integer, primary_key=True, index=True)
    
    # Log details
    level = Column(String(10), nullable=False)  # debug, info, warning, error, critical
    message = Column(Text, nullable=False)
    
    # Context
    user_id = Column(Integer, ForeignKey("users.id"))
    endpoint = Column(String(255))
    method = Column(String(10))
    ip_address = Column(String(45))
    user_agent = Column(Text)
    
    # Additional data
    extra_data = Column(JSON, default={})
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    user = relationship("User", back_populates="logs")
    
    def __repr__(self):
        return f"<Log(id={self.id}, level='{self.level}', message='{self.message[:50]}...')>"

# Post model (social media posts scheduling)
class Platform(PyEnum):
    """Social media platforms"""
    TIKTOK = "tiktok"
    INSTAGRAM = "instagram"
    YOUTUBE = "youtube"
    FACEBOOK = "facebook"
    LINKEDIN = "linkedin"
    TWITTER = "twitter"

class PostStatus(PyEnum):
    """Post status lifecycle"""
    DRAFT = "draft"
    SCHEDULED = "scheduled"
    PUBLISHING = "publishing"
    PUBLISHED = "published"
    FAILED = "failed"
    CANCELLED = "cancelled"

class ContentType(PyEnum):
    """Content types"""
    IMAGE = "image"
    VIDEO = "video"
    TEXT = "text"
    CAROUSEL = "carousel"
    STORY = "story"
    REEL = "reel"

class Post(Base):
    """
    Post model for scheduled social media content
    Supports multi-platform posting with AI predictions
    """
    __tablename__ = "posts"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    
    # Content
    title = Column(String(500), nullable=False)
    content = Column(Text)
    
    # Platform & Status
    platform = Column(String(20), nullable=False, index=True)
    status = Column(String(20), default="draft", nullable=False, index=True)
    content_type = Column(String(20), nullable=False)
    
    # Media
    media_url = Column(String(1000))
    media_thumbnail_url = Column(String(1000))
    media_type = Column(String(50))
    media_size = Column(Integer)
    media_duration = Column(Integer)
    
    # Scheduling
    scheduled_at = Column(DateTime(timezone=True), index=True)
    published_at = Column(DateTime(timezone=True))
    
    # AI Predictions
    viral_score = Column(Integer)
    predicted_reach = Column(Integer)
    predicted_engagement = Column(Float)
    prediction_confidence = Column(Float)
    ai_recommendations = Column(JSON, default=[])
    
    # Hashtags & Tags
    hashtags = Column(JSON, default=[])
    mentions = Column(JSON, default=[])
    
    # Location
    location_name = Column(String(255))
    location_lat = Column(Float)
    location_lng = Column(Float)
    
    # Metadata
    metadata = Column(JSON, default={})
    
    # Actual Performance
    actual_reach = Column(Integer)
    actual_impressions = Column(Integer)
    actual_likes = Column(Integer)
    actual_comments = Column(Integer)
    actual_shares = Column(Integer)
    actual_saves = Column(Integer)
    actual_engagement = Column(Float)
    
    # Error Handling
    error_message = Column(Text)
    retry_count = Column(Integer, default=0)
    last_retry_at = Column(DateTime(timezone=True))
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now(), index=True)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    # Relationships
    user = relationship("User", back_populates="posts")
    
    def __repr__(self):
        return f"<Post(id={self.id}, platform='{self.platform}', status='{self.status}')>"


# Database indexes for performance
Index('idx_users_email', User.email)
Index('idx_users_username', User.username)
Index('idx_users_role', User.role)
Index('idx_payments_status', Payment.status)
Index('idx_payments_user_id', Payment.user_id)
Index('idx_alerts_user_id', Alert.user_id)
Index('idx_alerts_type', Alert.type)
Index('idx_trends_platform', Trend.platform)
Index('idx_trends_viral_score', Trend.viral_score)
Index('idx_sessions_user_id', UserSession.user_id)
Index('idx_sessions_token', UserSession.token_jti)
Index('idx_predictions_user_id', TrendPrediction.user_id)
Index('idx_posts_user_id', Post.user_id)
Index('idx_posts_platform', Post.platform)
Index('idx_posts_status', Post.status)
Index('idx_posts_scheduled_at', Post.scheduled_at)
Index('idx_posts_created_at', Post.created_at)
Index('idx_logs_level', Log.level)
Index('idx_logs_created_at', Log.created_at)

# Unique constraints
UniqueConstraint('user_id', 'token_jti', name='uq_user_session_token')

# Export all models
__all__ = [
    "User",
    "Plan", 
    "Payment",
    "Alert",
    "Trend",
    "UserSession",
    "TrendPrediction",
    "Post",
    "Log",
    "UserRole",
    "PaymentStatus",
    "AlertType",
    "LogLevel",
    "Platform",
    "PostStatus",
    "ContentType"
]
