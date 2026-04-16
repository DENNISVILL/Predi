"""
GraphQL Schema for Predix Platform
Complete type definitions with resolvers
"""

import strawberry
from typing import List, Optional
from datetime import datetime
from enum import Enum


# ============================================
# Enums
# ============================================

@strawberry.enum
class Platform(Enum):
    TIKTOK = "tiktok"
    TWITTER = "twitter"
    INSTAGRAM = "instagram"
    YOUTUBE = "youtube"


@strawberry.enum
class UserRole(Enum):
    USER = "user"
    PREMIUM = "premium"
    ADMIN = "admin"


@strawberry.enum
class AlertType(Enum):
    VIRAL_SPIKE = "viral_spike"
    MICROTREND = "microtrend"
    TREND_UPDATE = "trend_update"
    AI_RECOMMENDATION = "ai_recommendation"


@strawberry.enum
class AlertPriority(Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"


# ============================================
# Object Types
# ============================================

@strawberry.type
class User:
    """User object type"""
    id: int
    uuid: str
    email: str
    username: str
    full_name: Optional[str]
    avatar_url: Optional[str]
    bio: Optional[str]
    role: UserRole
    is_active: bool
    is_verified: bool
    created_at: datetime
    last_login_at: Optional[datetime]
    
    @strawberry.field
    def predictions_count(self) -> int:
        """Get total predictions made by user"""
        # Will be resolved from database
        return 0
    
    @strawberry.field
    def alerts_count(self) -> int:
        """Get total alerts for user"""
        return 0


@strawberry.type
class Plan:
    """Subscription plan type"""
    id: int
    name: str
    description: Optional[str]
    price: float
    currency: str
    interval: str
    is_active: bool
    
    @strawberry.field
    def features(self) -> str:
        """Plan features as JSON string"""
        return "{}"


@strawberry.type
class Trend:
    """Trend object type"""
    id: int
    uuid: str
    platform: Platform
    content_type: str
    name: str
    description: Optional[str]
    views: int
    likes: int
    shares: int
    comments: int
    engagement_rate: float
    growth_rate_24h: float
    growth_rate_7d: Optional[float]
    viral_score: float
    confidence: float
    is_active: bool
    created_at: datetime
    updated_at: datetime


@strawberry.type
class GrowthPredictions:
    """Growth predictions for different time periods"""
    hours_24: float
    hours_48: float
    hours_72: float


@strawberry.type
class PredictionComponents:
    """Breakdown of prediction components"""
    engagement: float
    content_quality: float
    timing: float
    network_effect: Optional[float]
    sentiment: Optional[float]


@strawberry.type
class TrendPrediction:
    """Prediction object type"""
    id: int
    uuid: str
    user_id: int
    trend_id: Optional[int]
    viral_score: float
    confidence: float
    growth_predictions: GrowthPredictions
    components: PredictionComponents
    explanation: Optional[str]
    recommendations: List[str]
    created_at: datetime
    
    @strawberry.field
    def user(self, info) -> Optional[User]:
        """Get user who made the prediction"""
        # Resolver implementation
        return None
    
    @strawberry.field
    def trend(self, info) -> Optional[Trend]:
        """Get associated trend"""
        return None


@strawberry.type
class Alert:
    """Alert object type"""
    id: int
    uuid: str
    user_id: int
    type: AlertType
    title: str
    message: str
    priority: AlertPriority
    is_read: bool
    is_sent: bool
    created_at: datetime
    read_at: Optional[datetime]
    
    @strawberry.field
    def user(self, info) -> Optional[User]:
        """Get user who owns the alert"""
        return None


@strawberry.type
class PaginationInfo:
    """Pagination information"""
    total: int
    page: int
    per_page: int
    pages: int
    has_next: bool
    has_prev: bool


@strawberry.type
class TrendConnection:
    """Paginated trends connection"""
    items: List[Trend]
    pagination: PaginationInfo


@strawberry.type
class PredictionConnection:
    """Paginated predictions connection"""
    items: List[TrendPrediction]
    pagination: PaginationInfo


@strawberry.type
class UserStats:
    """User statistics"""
    total_predictions: int
    total_alerts: int
    account_age_days: int
    predictions_this_month: int
    avg_viral_score: Optional[float]


@strawberry.type
class AnalyticsData:
    """Analytics data aggregation"""
    total_views: int
    total_engagement: int
    avg_viral_score: float
    top_platform: Platform
    predictions_count: int


# ============================================
# Input Types
# ============================================

@strawberry.input
class TrendFilterInput:
    """Filter options for trends"""
    platform: Optional[Platform] = None
    min_viral_score: Optional[float] = None
    max_viral_score: Optional[float] = None
    search: Optional[str] = None
    is_active: Optional[bool] = True


@strawberry.input
class PaginationInput:
    """Pagination options"""
    page: int = 1
    per_page: int = 20


@strawberry.input
class TrendPredictionInput:
    """Input for creating a prediction"""
    platform: Platform
    name: str
    views: int
    likes: int
    comments: int
    shares: int
    hashtags: Optional[List[str]] = None
    description: Optional[str] = None


@strawberry.input
class UserUpdateInput:
    """Input for updating user profile"""
    full_name: Optional[str] = None
    bio: Optional[str] = None
    avatar_url: Optional[str] = None


@strawberry.input
class AlertFilterInput:
    """Filter options for alerts"""
    type: Optional[AlertType] = None
    priority: Optional[AlertPriority] = None
    is_read: Optional[bool] = None


# ============================================
# Query Root
# ============================================

@strawberry.type
class Query:
    """Root Query type"""
    
    @strawberry.field
    def me(self, info) -> Optional[User]:
        """Get current authenticated user"""
        # Authentication will be handled by context
        user = info.context.get("user")
        if not user:
            return None
        
        return User(
            id=user.id,
            uuid=user.uuid,
            email=user.email,
            username=user.username,
            full_name=user.full_name,
            avatar_url=user.avatar_url,
            bio=user.bio,
            role=UserRole(user.role),
            is_active=user.is_active,
            is_verified=user.is_verified,
            created_at=user.created_at,
            last_login_at=user.last_login_at
        )
    
    @strawberry.field
    def user(self, info, id: int) -> Optional[User]:
        """Get user by ID"""
        # Admin only
        return None
    
    @strawberry.field
    def trends(
        self,
        info,
        filters: Optional[TrendFilterInput] = None,
        pagination: PaginationInput = PaginationInput()
    ) -> TrendConnection:
        """Get paginated trends with optional filters"""
        # Database query implementation
        return TrendConnection(
            items=[],
            pagination=PaginationInfo(
                total=0,
                page=pagination.page,
                per_page=pagination.per_page,
                pages=0,
                has_next=False,
                has_prev=False
            )
        )
    
    @strawberry.field
    def trend(self, info, id: int) -> Optional[Trend]:
        """Get trend by ID"""
        return None
    
    @strawberry.field
    def predictions(
        self,
        info,
        pagination: PaginationInput = PaginationInput()
    ) -> PredictionConnection:
        """Get user's predictions"""
        return PredictionConnection(
            items=[],
            pagination=PaginationInfo(
                total=0,
                page=pagination.page,
                per_page=pagination.per_page,
                pages=0,
                has_next=False,
                has_prev=False
            )
        )
    
    @strawberry.field
    def prediction(self, info, id: int) -> Optional[TrendPrediction]:
        """Get prediction by ID"""
        return None
    
    @strawberry.field
    def alerts(
        self,
        info,
        filters: Optional[AlertFilterInput] = None,
        pagination: PaginationInput = PaginationInput()
    ) -> List[Alert]:
        """Get user's alerts"""
        return []
    
    @strawberry.field
    def my_stats(self, info) -> Optional[UserStats]:
        """Get current user's statistics"""
        return None
    
    @strawberry.field
    def analytics(
        self,
        info,
        start_date: Optional[datetime] = None,
        end_date: Optional[datetime] = None
    ) -> Optional[AnalyticsData]:
        """Get analytics data"""
        return None
    
    @strawberry.field
    def search(
        self,
        info,
        query: str,
        limit: int = 10
    ) -> List[Trend]:
        """Search trends by name or hashtag"""
        return []


# ============================================
# Mutation Root
# ============================================

@strawberry.type
class Mutation:
    """Root Mutation type"""
    
    @strawberry.mutation
    def create_prediction(
        self,
        info,
        input: TrendPredictionInput
    ) -> Optional[TrendPrediction]:
        """Create a new trend prediction"""
        # AI prediction logic
        return None
    
    @strawberry.mutation
    def update_profile(
        self,
        info,
        input: UserUpdateInput
    ) -> Optional[User]:
        """Update user profile"""
        return None
    
    @strawberry.mutation
    def mark_alert_read(
        self,
        info,
        alert_id: int
    ) -> Optional[Alert]:
        """Mark an alert as read"""
        return None
    
    @strawberry.mutation
    def delete_alert(
        self,
        info,
        alert_id: int
    ) -> bool:
        """Delete an alert"""
        return False
    
    @strawberry.mutation
    def toggle_alert_subscription(
        self,
        info,
        alert_type: AlertType,
        enabled: bool
    ) -> bool:
        """Enable/disable alert type"""
        return False


# ============================================
# Subscription Root
# ============================================

@strawberry.type
class Subscription:
    """Root Subscription type for real-time updates"""
    
    @strawberry.subscription
    async def trend_updates(
        self,
        info,
        platform: Optional[Platform] = None
    ) -> Trend:
        """Subscribe to trend updates"""
        # WebSocket implementation
        yield Trend(
            id=0,
            uuid="",
            platform=Platform.TIKTOK,
            content_type="",
            name="",
            description=None,
            views=0,
            likes=0,
            shares=0,
            comments=0,
            engagement_rate=0.0,
            growth_rate_24h=0.0,
            growth_rate_7d=None,
            viral_score=0.0,
            confidence=0.0,
            is_active=True,
            created_at=datetime.now(),
            updated_at=datetime.now()
        )
    
    @strawberry.subscription
    async def new_alerts(self, info) -> Alert:
        """Subscribe to new alerts"""
        yield Alert(
            id=0,
            uuid="",
            user_id=0,
            type=AlertType.VIRAL_SPIKE,
            title="",
            message="",
            priority=AlertPriority.MEDIUM,
            is_read=False,
            is_sent=False,
            created_at=datetime.now(),
            read_at=None
        )


# ============================================
# Schema
# ============================================

schema = strawberry.Schema(
    query=Query,
    mutation=Mutation,
    subscription=Subscription
)
