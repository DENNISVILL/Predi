"""
GraphQL Resolvers for Predix Platform
Database query implementations for all GraphQL operations
"""

from typing import List, Optional
from sqlalchemy.orm import Session
from sqlalchemy import and_, or_, func
from datetime import datetime, timedelta

from database.models import (
    User as UserModel,
    Trend as TrendModel,
    TrendPrediction as PredictionModel,
    Alert as AlertModel,
    Plan as PlanModel
)
from graphql.schema import (
    User, Trend, TrendPrediction, Alert, UserStats, AnalyticsData,
    TrendConnection, Prediction Connection, PaginationInfo,
    GrowthPredictions, PredictionComponents,
    Platform, UserRole, AlertType, AlertPriority,
    TrendFilterInput, PaginationInput, TrendPredictionInput,
    UserUpdateInput, AlertFilterInput
)


class UserResolver:
    """Resolvers for User type"""
    
    @staticmethod
    def get_current_user(db: Session, user_id: int) -> Optional[User]:
        """Get current authenticated user"""
        user = db.query(UserModel).filter_by(id=user_id).first()
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
    
    @staticmethod
    def get_user_by_id(db: Session, user_id: int) -> Optional[User]:
        """Get user by ID (admin only)"""
        user = db.query(UserModel).filter_by(id=user_id).first()
        if not user:
            return None
        
        return UserResolver.get_current_user(db, user_id)
    
    @staticmethod
    def update_user_profile(
        db: Session,
        user_id: int,
        input: UserUpdateInput
    ) -> Optional[User]:
        """Update user profile"""
        user = db.query(UserModel).filter_by(id=user_id).first()
        if not user:
            return None
        
        if input.full_name is not None:
            user.full_name = input.full_name
        if input.bio is not None:
            user.bio = input.bio
        if input.avatar_url is not None:
            user.avatar_url = input.avatar_url
        
        db.commit()
        db.refresh(user)
        
        return UserResolver.get_current_user(db, user_id)
    
    @staticmethod
    def get_user_stats(db: Session, user_id: int) -> Optional[UserStats]:
        """Get user statistics"""
        user = db.query(UserModel).filter_by(id=user_id).first()
        if not user:
            return None
        
        # Get prediction count
        total_predictions = db.query(func.count(PredictionModel.id)).filter_by(
            user_id=user_id
        ).scalar() or 0
        
        # Get alert count
        total_alerts = db.query(func.count(AlertModel.id)).filter_by(
            user_id=user_id
        ).scalar() or 0
        
        # Get predictions this month
        start_of_month = datetime.now().replace(day=1, hour=0, minute=0, second=0)
        predictions_this_month = db.query(func.count(PredictionModel.id)).filter(
            and_(
                PredictionModel.user_id == user_id,
                PredictionModel.created_at >= start_of_month
            )
        ).scalar() or 0
        
        # Get average viral score
        avg_score = db.query(func.avg(PredictionModel.viral_score)).filter_by(
            user_id=user_id
        ).scalar()
        
        # Account age in days
        account_age = (datetime.now() - user.created_at).days
        
        return UserStats(
            total_predictions=total_predictions,
            total_alerts=total_alerts,
            account_age_days=account_age,
            predictions_this_month=predictions_this_month,
            avg_viral_score=float(avg_score) if avg_score else None
        )


class TrendResolver:
    """Resolvers for Trend type"""
    
    @staticmethod
    def get_trends(
        db: Session,
        filters: Optional[TrendFilterInput] = None,
        pagination: PaginationInput = PaginationInput()
    ) -> TrendConnection:
        """Get paginated trends with filters"""
        query = db.query(TrendModel)
        
        # Apply filters
        if filters:
            if filters.platform:
                query = query.filter_by(platform=filters.platform.value)
            if filters.min_viral_score is not None:
                query = query.filter(TrendModel.viral_score >= filters.min_viral_score)
            if filters.max_viral_score is not None:
                query = query.filter(TrendModel.viral_score <= filters.max_viral_score)
            if filters.search:
                search_term = f"%{filters.search}%"
                query = query.filter(
                    or_(
                        TrendModel.name.ilike(search_term),
                        TrendModel.description.ilike(search_term)
                    )
                )
            if filters.is_active is not None:
                query = query.filter_by(is_active=filters.is_active)
        
        # Get total count
        total = query.count()
        
        # Calculate pagination
        pages = (total + pagination.per_page - 1) // pagination.per_page
        offset = (pagination.page - 1) * pagination.per_page
        
        # Get paginated results
        trends = query.order_by(TrendModel.viral_score.desc()).limit(
            pagination.per_page
        ).offset(offset).all()
        
        # Convert to GraphQL types
        items = [TrendResolver._to_graphql(trend) for trend in trends]
        
        return TrendConnection(
            items=items,
            pagination=PaginationInfo(
                total=total,
                page=pagination.page,
                per_page=pagination.per_page,
                pages=pages,
                has_next=pagination.page < pages,
                has_prev=pagination.page > 1
            )
        )
    
    @staticmethod
    def get_trend_by_id(db: Session, trend_id: int) -> Optional[Trend]:
        """Get trend by ID"""
        trend = db.query(TrendModel).filter_by(id=trend_id).first()
        if not trend:
            return None
        
        return TrendResolver._to_graphql(trend)
    
    @staticmethod
    def search_trends(db: Session, query_text: str, limit: int = 10) -> List[Trend]:
        """Search trends"""
        search_term = f"%{query_text}%"
        trends = db.query(TrendModel).filter(
            or_(
                TrendModel.name.ilike(search_term),
                TrendModel.description.ilike(search_term)
            )
        ).limit(limit).all()
        
        return [TrendResolver._to_graphql(trend) for trend in trends]
    
    @staticmethod
    def _to_graphql(trend: TrendModel) -> Trend:
        """Convert database model to GraphQL type"""
        return Trend(
            id=trend.id,
            uuid=trend.uuid,
            platform=Platform(trend.platform),
            content_type=trend.content_type,
            name=trend.name,
            description=trend.description,
            views=trend.views,
            likes=trend.likes,
            shares=trend.shares,
            comments=trend.comments,
            engagement_rate=trend.engagement_rate,
            growth_rate_24h=trend.growth_rate_24h,
            growth_rate_7d=trend.growth_rate_7d,
            viral_score=trend.viral_score,
            confidence=trend.confidence,
            is_active=trend.is_active,
            created_at=trend.created_at,
            updated_at=trend.updated_at
        )


class PredictionResolver:
    """Resolvers for Prediction type"""
    
    @staticmethod
    async def create_prediction(
        db: Session,
        user_id: int,
        input: TrendPredictionInput
    ) -> Optional[TrendPrediction]:
        """Create a new prediction using AI"""
        from services.ai_connector import AIConnector
        
        # Prepare prediction data
        prediction_data = {
            "platform": input.platform.value,
            "name": input.name,
            "views": input.views,
            "likes": input.likes,
            "comments": input.comments,
            "shares": input.shares,
            "hashtags": input.hashtags,
            "description": input.description
        }
        
        # Call AI service
        ai_connector = AIConnector()
        ai_result = await ai_connector.predict_trend(prediction_data)
        
        # Save to database
        prediction = PredictionModel(
            user_id=user_id,
            input_data=prediction_data,
            viral_score=ai_result["viral_score"],
            confidence=ai_result["confidence"],
            growth_predictions=ai_result.get("growth_predictions", {}),
            components=ai_result.get("components", {}),
            explanation=ai_result.get("explanation"),
            recommendations=ai_result.get("recommendations", [])
        )
        
        db.add(prediction)
        db.commit()
        db.refresh(prediction)
        
        return PredictionResolver._to_graphql(prediction)
    
    @staticmethod
    def get_predictions(
        db: Session,
        user_id: int,
        pagination: PaginationInput = PaginationInput()
    ) -> PredictionConnection:
        """Get user's predictions"""
        query = db.query(PredictionModel).filter_by(user_id=user_id)
        
        # Get total
        total = query.count()
        
        # Pagination
        pages = (total + pagination.per_page - 1) // pagination.per_page
        offset = (pagination.page - 1) * pagination.per_page
        
        predictions = query.order_by(PredictionModel.created_at.desc()).limit(
            pagination.per_page
        ).offset(offset).all()
        
        items = [PredictionResolver._to_graphql(pred) for pred in predictions]
        
        return PredictionConnection(
            items=items,
            pagination=PaginationInfo(
                total=total,
                page=pagination.page,
                per_page=pagination.per_page,
                pages=pages,
                has_next=pagination.page < pages,
                has_prev=pagination.page > 1
            )
        )
    
    @staticmethod
    def get_prediction_by_id(
        db: Session,
        prediction_id: int,
        user_id: int
    ) -> Optional[TrendPrediction]:
        """Get prediction by ID"""
        prediction = db.query(PredictionModel).filter_by(
            id=prediction_id,
            user_id=user_id
        ).first()
        
        if not prediction:
            return None
        
        return PredictionResolver._to_graphql(prediction)
    
    @staticmethod
    def _to_graphql(prediction: PredictionModel) -> TrendPrediction:
        """Convert database model to GraphQL type"""
        return TrendPrediction(
            id=prediction.id,
            uuid=prediction.uuid,
            user_id=prediction.user_id,
            trend_id=prediction.trend_id,
            viral_score=prediction.viral_score,
            confidence=prediction.confidence,
            growth_predictions=GrowthPredictions(
                hours_24=prediction.growth_predictions.get("24h", 0.0),
                hours_48=prediction.growth_predictions.get("48h", 0.0),
                hours_72=prediction.growth_predictions.get("72h", 0.0)
            ),
            components=PredictionComponents(
                engagement=prediction.components.get("engagement", 0.0),
                content_quality=prediction.components.get("content_quality", 0.0),
                timing=prediction.components.get("timing", 0.0),
                network_effect=prediction.components.get("network_effect"),
                sentiment=prediction.components.get("sentiment")
            ),
            explanation=prediction.explanation,
            recommendations=prediction.recommendations or [],
            created_at=prediction.created_at
        )


class AlertResolver:
    """Resolvers for Alert type"""
    
    @staticmethod
    def get_alerts(
        db: Session,
        user_id: int,
        filters: Optional[AlertFilterInput] = None,
        pagination: PaginationInput = PaginationInput()
    ) -> List[Alert]:
        """Get user's alerts"""
        query = db.query(AlertModel).filter_by(user_id=user_id)
        
        # Apply filters
        if filters:
            if filters.type:
                query = query.filter_by(type=filters.type.value)
            if filters.priority:
                query = query.filter_by(priority=filters.priority.value)
            if filters.is_read is not None:
                query = query.filter_by(is_read=filters.is_read)
        
        # Pagination
        offset = (pagination.page - 1) * pagination.per_page
        alerts = query.order_by(AlertModel.created_at.desc()).limit(
            pagination.per_page
        ).offset(offset).all()
        
        return [AlertResolver._to_graphql(alert) for alert in alerts]
    
    @staticmethod
    def mark_as_read(
        db: Session,
        alert_id: int,
        user_id: int
    ) -> Optional[Alert]:
        """Mark alert as read"""
        alert = db.query(AlertModel).filter_by(
            id=alert_id,
            user_id=user_id
        ).first()
        
        if not alert:
            return None
        
        alert.is_read = True
        alert.read_at = datetime.now()
        db.commit()
        db.refresh(alert)
        
        return AlertResolver._to_graphql(alert)
    
    @staticmethod
    def delete_alert(
        db: Session,
        alert_id: int,
        user_id: int
    ) -> bool:
        """Delete an alert"""
        alert = db.query(AlertModel).filter_by(
            id=alert_id,
            user_id=user_id
        ).first()
        
        if not alert:
            return False
        
        db.delete(alert)
        db.commit()
        
        return True
    
    @staticmethod
    def _to_graphql(alert: AlertModel) -> Alert:
        """Convert database model to GraphQL type"""
        return Alert(
            id=alert.id,
            uuid=alert.uuid,
            user_id=alert.user_id,
            type=AlertType(alert.type),
            title=alert.title,
            message=alert.message,
            priority=AlertPriority(alert.priority),
            is_read=alert.is_read,
            is_sent=alert.is_sent,
            created_at=alert.created_at,
            read_at=alert.read_at
        )


class AnalyticsResolver:
    """Resolvers for Analytics"""
    
    @staticmethod
    def get_analytics(
        db: Session,
        user_id: int,
        start_date: Optional[datetime] = None,
        end_date: Optional[datetime] = None
    ) -> Optional[AnalyticsData]:
        """Get analytics data"""
        # Default to last 30 days if not specified
        if not end_date:
            end_date = datetime.now()
        if not start_date:
            start_date = end_date - timedelta(days=30)
        
        # Get predictions in date range
        predictions = db.query(PredictionModel).filter(
            and_(
                PredictionModel.user_id == user_id,
                PredictionModel.created_at >= start_date,
                PredictionModel.created_at <= end_date
            )
        ).all()
        
        if not predictions:
            return None
        
        # Calculate metrics
        total_views = sum(p.input_data.get("views", 0) for p in predictions)
        total_engagement = sum(
            p.input_data.get("likes", 0) +
            p.input_data.get("comments", 0) +
            p.input_data.get("shares", 0)
            for p in predictions
        )
        avg_viral_score = sum(p.viral_score for p in predictions) / len(predictions)
        
        # Find top platform
        platforms = {}
        for p in predictions:
            platform = p.input_data.get("platform", "unknown")
            platforms[platform] = platforms.get(platform, 0) + 1
        
        top_platform = max(platforms.items(), key=lambda x: x[1])[0] if platforms else "tiktok"
        
        return AnalyticsData(
            total_views=total_views,
            total_engagement=total_engagement,
            avg_viral_score=avg_viral_score,
            top_platform=Platform(top_platform),
            predictions_count=len(predictions)
        )
