"""
AI System Connector for Predix Backend
Connects with the AI prediction system and handles all ML operations
"""

import aiohttp
import asyncio
import logging
from typing import Dict, List, Optional, Any
from datetime import datetime, timezone
import json
from sqlalchemy.orm import Session

from config.settings import settings, AIConfig
from database.models import User, TrendPrediction, Trend, Alert
from database.connection import CacheManager

logger = logging.getLogger(__name__)

class AIConnector:
    """Connector service for AI system integration"""
    
    def __init__(self):
        self.ai_config = AIConfig.get_ai_config()
        self.endpoints = AIConfig.get_ai_endpoints()
        self.session: Optional[aiohttp.ClientSession] = None
        
        # Circuit breaker state
        self.circuit_breaker = {
            "failures": 0,
            "last_failure": None,
            "is_open": False,
            "failure_threshold": 5,
            "recovery_timeout": 300  # 5 minutes
        }
    
    async def __aenter__(self):
        """Async context manager entry"""
        self.session = aiohttp.ClientSession(
            timeout=aiohttp.ClientTimeout(total=self.ai_config["timeout"]),
            headers=self._get_headers()
        )
        return self
    
    async def __aexit__(self, exc_type, exc_val, exc_tb):
        """Async context manager exit"""
        if self.session:
            await self.session.close()
    
    def _get_headers(self) -> Dict[str, str]:
        """Get headers for AI API requests"""
        headers = {
            "Content-Type": "application/json",
            "User-Agent": "Predix-Backend/1.0"
        }
        
        if self.ai_config["api_key"]:
            headers["Authorization"] = f"Bearer {self.ai_config['api_key']}"
        
        return headers
    
    async def _make_request(self, method: str, endpoint: str, data: Dict = None) -> Dict[str, Any]:
        """Make request to AI system with circuit breaker pattern"""
        
        # Check circuit breaker
        if self._is_circuit_open():
            raise Exception("AI service circuit breaker is open")
        
        if not self.session:
            async with self:
                return await self._make_request(method, endpoint, data)
        
        try:
            if method.upper() == "GET":
                async with self.session.get(endpoint, params=data) as response:
                    response.raise_for_status()
                    result = await response.json()
            else:
                async with self.session.post(endpoint, json=data) as response:
                    response.raise_for_status()
                    result = await response.json()
            
            # Reset circuit breaker on success
            self._reset_circuit_breaker()
            return result
            
        except Exception as e:
            logger.error(f"AI API request failed: {e}")
            self._record_failure()
            raise
    
    def _is_circuit_open(self) -> bool:
        """Check if circuit breaker is open"""
        if not self.circuit_breaker["is_open"]:
            return False
        
        # Check if recovery timeout has passed
        if self.circuit_breaker["last_failure"]:
            time_since_failure = (datetime.now() - self.circuit_breaker["last_failure"]).total_seconds()
            if time_since_failure > self.circuit_breaker["recovery_timeout"]:
                self.circuit_breaker["is_open"] = False
                self.circuit_breaker["failures"] = 0
                logger.info("AI service circuit breaker reset")
                return False
        
        return True
    
    def _record_failure(self):
        """Record a failure for circuit breaker"""
        self.circuit_breaker["failures"] += 1
        self.circuit_breaker["last_failure"] = datetime.now()
        
        if self.circuit_breaker["failures"] >= self.circuit_breaker["failure_threshold"]:
            self.circuit_breaker["is_open"] = True
            logger.warning("AI service circuit breaker opened due to failures")
    
    def _reset_circuit_breaker(self):
        """Reset circuit breaker on successful request"""
        self.circuit_breaker["failures"] = 0
        self.circuit_breaker["is_open"] = False
        self.circuit_breaker["last_failure"] = None
    
    async def health_check(self) -> Dict[str, Any]:
        """Check AI system health"""
        try:
            result = await self._make_request("GET", self.endpoints["health"])
            logger.info("✅ AI system health check passed")
            return result
        except Exception as e:
            logger.error(f"❌ AI system health check failed: {e}")
            return {
                "status": "unhealthy",
                "error": str(e),
                "circuit_breaker_open": self._is_circuit_open()
            }
    
    async def predict_trend(self, user: User, trend_input: Dict[str, Any], db: Session) -> Dict[str, Any]:
        """Make single trend prediction"""
        try:
            # Check user's prediction quota
            if not user.can_make_prediction():
                raise Exception("Prediction quota exceeded for current plan")
            
            # Make prediction request
            prediction_result = await self._make_request("POST", self.endpoints["predict"], trend_input)
            
            # Save prediction to database
            await self._save_prediction(user, trend_input, prediction_result, db)
            
            # Update user's usage counter
            user.predictions_used_this_month += 1
            db.commit()
            
            # Log the prediction
            await self._log_prediction(user, trend_input, prediction_result)
            
            return prediction_result
            
        except Exception as e:
            logger.error(f"Trend prediction failed for user {user.id}: {e}")
            raise
    
    async def batch_predict(self, user: User, trends_input: List[Dict[str, Any]], db: Session) -> Dict[str, Any]:
        """Make batch trend predictions"""
        try:
            # Check user's prediction quota
            predictions_needed = len(trends_input)
            if user.current_plan and user.current_plan.features.get("predictions_per_month", 0) != -1:
                remaining_predictions = (
                    user.current_plan.features.get("predictions_per_month", 0) - 
                    user.predictions_used_this_month
                )
                if predictions_needed > remaining_predictions:
                    raise Exception(f"Batch prediction would exceed quota. Need {predictions_needed}, have {remaining_predictions}")
            
            # Prepare batch request
            batch_request = {
                "trends": trends_input,
                "include_explanations": True,
                "include_recommendations": True
            }
            
            # Make batch prediction request
            batch_result = await self._make_request("POST", self.endpoints["batch_predict"], batch_request)
            
            # Save predictions to database
            for i, result in enumerate(batch_result.get("results", [])):
                if "error" not in result:
                    await self._save_prediction(user, trends_input[i], result, db)
            
            # Update user's usage counter
            successful_predictions = len([r for r in batch_result.get("results", []) if "error" not in r])
            user.predictions_used_this_month += successful_predictions
            db.commit()
            
            return batch_result
            
        except Exception as e:
            logger.error(f"Batch prediction failed for user {user.id}: {e}")
            raise
    
    async def get_trending_predictions(self, platform: str, limit: int = 20, min_viral_score: float = 60.0) -> Dict[str, Any]:
        """Get trending predictions for a platform"""
        try:
            endpoint = f"{self.endpoints['trending']}/{platform}"
            params = {
                "limit": limit,
                "min_viral_score": min_viral_score
            }
            
            result = await self._make_request("GET", endpoint, params)
            
            # Cache trending results for 5 minutes
            cache_key = f"trending:{platform}:{limit}:{min_viral_score}"
            await CacheManager.set(cache_key, json.dumps(result), expire=300)
            
            return result
            
        except Exception as e:
            logger.error(f"Get trending predictions failed for platform {platform}: {e}")
            
            # Try to return cached data if available
            cache_key = f"trending:{platform}:{limit}:{min_viral_score}"
            cached_result = await CacheManager.get(cache_key)
            if cached_result:
                logger.info(f"Returning cached trending data for {platform}")
                return json.loads(cached_result)
            
            raise
    
    async def check_alerts(self, trends: List[Dict[str, Any]], thresholds: Dict[str, float]) -> Dict[str, Any]:
        """Check trends against alert thresholds"""
        try:
            alert_request = {
                "trends": trends,
                "thresholds": thresholds
            }
            
            result = await self._make_request("POST", self.endpoints["alerts"], alert_request)
            return result
            
        except Exception as e:
            logger.error(f"Alert check failed: {e}")
            raise
    
    async def get_model_status(self) -> Dict[str, Any]:
        """Get AI model status and performance metrics"""
        try:
            result = await self._make_request("GET", self.endpoints["models"])
            return result
        except Exception as e:
            logger.error(f"Get model status failed: {e}")
            raise
    
    async def _save_prediction(self, user: User, input_data: Dict[str, Any], 
                              prediction_result: Dict[str, Any], db: Session):
        """Save prediction to database"""
        try:
            # Create or find trend record
            trend = None
            if "name" in input_data and "platform" in input_data:
                trend = db.query(Trend).filter(
                    Trend.name == input_data["name"],
                    Trend.platform == input_data["platform"]
                ).first()
                
                if not trend:
                    trend = Trend(
                        platform=input_data["platform"],
                        content_type=input_data.get("content_type", "hashtag"),
                        name=input_data["name"],
                        description=input_data.get("description", ""),
                        views=input_data.get("views", 0),
                        likes=input_data.get("likes", 0),
                        shares=input_data.get("shares", 0),
                        comments=input_data.get("comments", 0),
                        engagement_rate=input_data.get("engagement_rate", 0.0),
                        growth_rate_24h=input_data.get("growth_rate_24h", 0.0),
                        growth_rate_7d=input_data.get("growth_rate_7d", 0.0),
                        viral_score=prediction_result.get("viral_score", 0.0),
                        confidence=prediction_result.get("confidence", 0.0)
                    )
                    db.add(trend)
                    db.commit()
                    db.refresh(trend)
                else:
                    # Update existing trend with new data
                    trend.viral_score = prediction_result.get("viral_score", trend.viral_score)
                    trend.confidence = prediction_result.get("confidence", trend.confidence)
                    trend.updated_at = datetime.now(timezone.utc)
            
            # Create prediction record
            prediction = TrendPrediction(
                user_id=user.id,
                trend_id=trend.id if trend else None,
                input_data=input_data,
                viral_score=prediction_result.get("viral_score", 0.0),
                confidence=prediction_result.get("confidence", 0.0),
                growth_predictions=prediction_result.get("growth_predictions", {}),
                components=prediction_result.get("components", {}),
                explanation=prediction_result.get("explanation", ""),
                recommendations=prediction_result.get("recommendations", [])
            )
            
            db.add(prediction)
            db.commit()
            
        except Exception as e:
            logger.error(f"Failed to save prediction: {e}")
            db.rollback()
    
    async def _log_prediction(self, user: User, input_data: Dict[str, Any], 
                             prediction_result: Dict[str, Any]):
        """Log prediction for analytics"""
        log_data = {
            "user_id": user.id,
            "platform": input_data.get("platform"),
            "viral_score": prediction_result.get("viral_score"),
            "confidence": prediction_result.get("confidence"),
            "timestamp": datetime.now(timezone.utc).isoformat()
        }
        
        # Store in Redis for real-time analytics
        await CacheManager.set(
            f"prediction_log:{user.id}:{datetime.now().timestamp()}",
            json.dumps(log_data),
            expire=86400  # 24 hours
        )
    
    async def create_viral_alert(self, user: User, trend_data: Dict[str, Any], db: Session):
        """Create viral alert for user"""
        try:
            alert = Alert(
                user_id=user.id,
                type="viral_spike",
                title=f"🔥 Viral Alert: {trend_data.get('name', 'Unknown trend')}",
                message=f"Trend has {trend_data.get('viral_score', 0):.1f}% viral probability!",
                trend_data=trend_data,
                priority="high" if trend_data.get('viral_score', 0) >= 85 else "medium"
            )
            
            db.add(alert)
            db.commit()
            db.refresh(alert)
            
            return alert
            
        except Exception as e:
            logger.error(f"Failed to create viral alert: {e}")
            db.rollback()
            return None
    
    async def get_user_predictions_history(self, user: User, db: Session, 
                                          limit: int = 50, offset: int = 0) -> List[TrendPrediction]:
        """Get user's prediction history"""
        predictions = db.query(TrendPrediction).filter(
            TrendPrediction.user_id == user.id
        ).order_by(
            TrendPrediction.created_at.desc()
        ).offset(offset).limit(limit).all()
        
        return predictions
    
    async def get_trending_cache_status(self) -> Dict[str, Any]:
        """Get status of trending predictions cache"""
        platforms = ["tiktok", "twitter", "instagram", "youtube"]
        cache_status = {}
        
        for platform in platforms:
            cache_key = f"trending:{platform}:20:60.0"
            exists = await CacheManager.exists(cache_key)
            cache_status[platform] = "cached" if exists else "not_cached"
        
        return {
            "cache_status": cache_status,
            "cache_ttl": 300,  # 5 minutes
            "last_check": datetime.now(timezone.utc).isoformat()
        }

# Global AI connector instance
ai_connector = AIConnector()

# Utility functions
async def ensure_ai_connection():
    """Ensure AI system is connected and healthy"""
    try:
        async with ai_connector:
            health = await ai_connector.health_check()
            if health.get("status") != "healthy":
                logger.warning("AI system health check indicates issues")
            return health
    except Exception as e:
        logger.error(f"AI connection check failed: {e}")
        return {"status": "unhealthy", "error": str(e)}

async def get_ai_system_metrics() -> Dict[str, Any]:
    """Get comprehensive AI system metrics"""
    try:
        async with ai_connector:
            # Get model status
            model_status = await ai_connector.get_model_status()
            
            # Get cache status
            cache_status = await ai_connector.get_trending_cache_status()
            
            # Get circuit breaker status
            circuit_status = {
                "failures": ai_connector.circuit_breaker["failures"],
                "is_open": ai_connector.circuit_breaker["is_open"],
                "last_failure": ai_connector.circuit_breaker["last_failure"].isoformat() if ai_connector.circuit_breaker["last_failure"] else None
            }
            
            return {
                "model_status": model_status,
                "cache_status": cache_status,
                "circuit_breaker": circuit_status,
                "endpoints": ai_connector.endpoints,
                "last_check": datetime.now(timezone.utc).isoformat()
            }
    except Exception as e:
        logger.error(f"Failed to get AI system metrics: {e}")
        return {"error": str(e)}

# Export main components
__all__ = [
    "AIConnector",
    "ai_connector",
    "ensure_ai_connection",
    "get_ai_system_metrics"
]
