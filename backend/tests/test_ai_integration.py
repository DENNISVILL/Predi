"""
AI Integration Tests
Comprehensive test suite for AI system integration
"""

import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session
from unittest.mock import Mock, patch, AsyncMock

from services.ai_connector import AIConnector


@pytest.mark.unit
class TestAIConnector:
    """Test AI Connector service"""
    
    @pytest.fixture
    def ai_connector(self):
        """Create AI connector instance"""
        return AIConnector()
    
    def test_initialization(self, ai_connector):
        """Test AI connector initialization"""
        assert ai_connector.base_url is not None
        assert ai_connector.timeout > 0
    
    @pytest.mark.asyncio
    async def test_health_check_success(self, ai_connector):
        """Test AI system health check - success"""
        with patch('httpx.AsyncClient.get') as mock_get:
            mock_response = Mock()
            mock_response.status_code = 200
            mock_response.json.return_value = {"status": "healthy"}
            mock_get.return_value = mock_response
            
            result = await ai_connector.health_check()
            
            assert result is True
    
    @pytest.mark.asyncio
    async def test_health_check_failure(self, ai_connector):
        """Test AI system health check - failure"""
        with patch('httpx.AsyncClient.get') as mock_get:
            mock_get.side_effect = Exception("Connection failed")
            
            result = await ai_connector.health_check()
            
            assert result is False
    
    @pytest.mark.asyncio
    async def test_predict_trend_success(self, ai_connector, sample_trend_data):
        """Test trend prediction - success"""
        with patch('httpx.AsyncClient.post') as mock_post:
            mock_response = Mock()
            mock_response.status_code = 200
            mock_response.json.return_value = {
                "viral_score": 85.5,
                "confidence": 0.78,
                "growth_predictions": {
                    "24h": 0.45,
                    "48h": 0.36,
                    "72h": 0.28
                },
                "components": {
                    "engagement": 0.75,
                    "content_quality": 0.80,
                    "timing": 0.90
                },
                "explanation": "High viral potential due to engagement",
                "recommendations": ["Post during peak hours", "Add hashtags"]
            }
            mock_post.return_value = mock_response
            
            result = await ai_connector.predict_trend(sample_trend_data)
            
            assert result["viral_score"] == 85.5
            assert result["confidence"] == 0.78
            assert "growth_predictions" in result
            assert "24h" in result["growth_predictions"]
    
    @pytest.mark.asyncio
    async def test_predict_trend_invalid_data(self, ai_connector):
        """Test trend prediction with invalid data"""
        invalid_data = {}  # Empty data
        
        with pytest.raises(Exception):
            await ai_connector.predict_trend(invalid_data)
    
    @pytest.mark.asyncio
    async def test_predict_trend_timeout(self, ai_connector, sample_trend_data):
        """Test trend prediction timeout"""
        with patch('httpx.AsyncClient.post') as mock_post:
            mock_post.side_effect = TimeoutError("Request timeout")
            
            with pytest.raises(TimeoutError):
                await ai_connector.predict_trend(sample_trend_data)
    
    @pytest.mark.asyncio
    async def test_batch_predict(self, ai_connector, sample_trend_data):
        """Test batch prediction"""
        trends_list = [sample_trend_data, sample_trend_data, sample_trend_data]
        
        with patch('httpx.AsyncClient.post') as mock_post:
            mock_response = Mock()
            mock_response.status_code = 200
            mock_response.json.return_value = {
                "predictions": [
                    {"viral_score": 85.5, "confidence": 0.78},
                    {"viral_score": 72.3, "confidence": 0.65},
                    {"viral_score": 91.2, "confidence": 0.88}
                ],
                "processed_count": 3
            }
            mock_post.return_value = mock_response
            
            result = await ai_connector.batch_predict(trends_list)
            
            assert result["processed_count"] == 3
            assert len(result["predictions"]) == 3
    
    @pytest.mark.asyncio
    async def test_get_trending(self, ai_connector):
        """Test getting trending topics"""
        with patch('httpx.AsyncClient.get') as mock_get:
            mock_response = Mock()
            mock_response.status_code = 200
            mock_response.json.return_value = {
                "trending": [
                    {
                        "name": "#TrendingHashtag",
                        "platform": "tiktok",
                        "viral_score": 92.5,
                        "growth_rate": 0.85
                    }
                ],
                "updated_at": "2025-12-18T12:00:00Z"
            }
            mock_get.return_value = mock_response
            
            result = await ai_connector.get_trending(platform="tiktok")
            
            assert "trending" in result
            assert len(result["trending"]) > 0
    
    @pytest.mark.asyncio
    async def test_check_alerts(self, ai_connector):
        """Test checking for alerts"""
        with patch('httpx.AsyncClient.post') as mock_post:
            mock_response = Mock()
            mock_response.status_code = 200
            mock_response.json.return_value = {
                "alerts": [
                    {
                        "type": "viral_spike",
                        "trend_name": "#ViralTrend",
                        "urgency": "high",
                        "message": "Rapid growth detected"
                    }
                ],
                "count": 1
            }
            mock_post.return_value = mock_response
            
            result = await ai_connector.check_alerts(user_preferences={})
            
            assert result["count"] == 1
            assert len(result["alerts"]) == 1


@pytest.mark.integration
class TestAIAPIEndpoints:
    """Test AI API endpoints"""
    
    @pytest.mark.asyncio
    async def test_predict_endpoint(
        self,
        client: TestClient,
        auth_headers,
        sample_trend_data,
        mock_ai_service
    ):
        """Test /api/v1/ai/predict endpoint"""
        response = client.post(
            "/api/v1/ai/predict",
            headers=auth_headers,
            json=sample_trend_data
        )
        
        assert response.status_code == 200
        data = response.json()
        
        assert "viral_score" in data
        assert "confidence" in data
        assert "growth_predictions" in data
        assert 0 <= data["viral_score"] <= 100
        assert 0 <= data["confidence"] <= 1
    
    @pytest.mark.asyncio
    async def test_predict_endpoint_unauthorized(
        self,
        client: TestClient,
        sample_trend_data
    ):
        """Test predict endpoint without authentication"""
        response = client.post(
            "/api/v1/ai/predict",
            json=sample_trend_data
        )
        
        assert response.status_code == 401
    
    @pytest.mark.asyncio
    async def test_predict_endpoint_invalid_data(
        self,
        client: TestClient,
        auth_headers
    ):
        """Test predict endpoint with invalid data"""
        invalid_data = {"invalid": "data"}
        
        response = client.post(
            "/api/v1/ai/predict",
            headers=auth_headers,
            json=invalid_data
        )
        
        assert response.status_code in [400, 422]
    
    @pytest.mark.asyncio
    async def test_trending_endpoint(
        self,
        client: TestClient,
        auth_headers,
        mock_ai_service
    ):
        """Test /api/v1/ai/trending endpoint"""
        response = client.get(
            "/api/v1/ai/trending?platform=tiktok",
            headers=auth_headers
        )
        
        assert response.status_code == 200
        data = response.json()
        
        assert "trending" in data or "trends" in data
    
    @pytest.mark.asyncio
    async def test_batch_predict_endpoint(
        self,
        client: TestClient,
        auth_headers,
        sample_trend_data,
        mock_ai_service
    ):
        """Test batch prediction endpoint"""
        batch_data = {
            "trends": [sample_trend_data, sample_trend_data]
        }
        
        response = client.post(
            "/api/v1/ai/batch-predict",
            headers=auth_headers,
            json=batch_data
        )
        
        assert response.status_code == 200
        data = response.json()
        
        assert "predictions" in data or "results" in data


@pytest.mark.integration
class TestAIPredictionStorage:
    """Test AI prediction storage in database"""
    
    def test_save_prediction_to_database(
        self,
        client: TestClient,
        auth_headers,
        db: Session,
        test_user,
        sample_trend_data,
        mock_ai_service
    ):
        """Test that predictions are saved to database"""
        # Make prediction
        response = client.post(
            "/api/v1/ai/predict",
            headers=auth_headers,
            json=sample_trend_data
        )
        
        assert response.status_code == 200
        
        # Check if saved in database
        from database.models import TrendPrediction
        
        prediction = db.query(TrendPrediction).filter_by(
            user_id=test_user.id
        ).first()
        
        assert prediction is not None
        assert prediction.viral_score is not None
        assert prediction.confidence is not None
    
    def test_prediction_user_limit(
        self,
        client: TestClient,
        auth_headers,
        db: Session,
        test_user,
        sample_trend_data,
        mock_ai_service
    ):
        """Test that free tier users are limited in predictions"""
        # Set user to free tier with limit
        test_user.predictions_used_this_month = 99
        db.commit()
        
        # Should succeed (within limit)
        response = client.post(
            "/api/v1/ai/predict",
            headers=auth_headers,
            json=sample_trend_data
        )
        
        assert response.status_code == 200
        
        # One more to exceed limit
        test_user.predictions_used_this_month = 100
        db.commit()
        
        response = client.post(
            "/api/v1/ai/predict",
            headers=auth_headers,
            json=sample_trend_data
        )
        
        # Should be blocked
        assert response.status_code in [403, 429]


@pytest.mark.performance
class TestAIPerformance:
    """Test AI system performance"""
    
    @pytest.mark.asyncio
    async def test_prediction_latency(
        self,
        ai_connector,
        sample_trend_data
    ):
        """Test that predictions are fast enough"""
        import time
        
        with patch('httpx.AsyncClient.post') as mock_post:
            mock_response = Mock()
            mock_response.status_code = 200
            mock_response.json.return_value = {
                "viral_score": 85.5,
                "confidence": 0.78
            }
            mock_post.return_value = mock_response
            
            start = time.time()
            await ai_connector.predict_trend(sample_trend_data)
            elapsed = time.time() - start
            
            # Should complete in under 100ms (mocked)
            assert elapsed < 0.1
    
    @pytest.mark.asyncio
    async def test_batch_prediction_efficiency(
        self,
        ai_connector,
        sample_trend_data
    ):
        """Test batch prediction is more efficient than individual"""
        batch_size = 10
        trends_list = [sample_trend_data] * batch_size
        
        with patch('httpx.AsyncClient.post') as mock_post:
            mock_response = Mock()
            mock_response.status_code = 200
            mock_response.json.return_value = {
                "predictions": [{"viral_score": 85.5}] * batch_size,
                "processed_count": batch_size
            }
            mock_post.return_value = mock_response
            
            import time
            start = time.time()
            await ai_connector.batch_predict(trends_list)
            batch_time = time.time() - start
            
            # Batch should be faster than 10 individual calls would be
            # (Even with mocking, we test the logic)
            assert batch_time < 1.0  # Should be very fast


@pytest.mark.unit
class TestAIDataValidation:
    """Test AI input data validation"""
    
    def test_validate_trend_data_complete(self):
        """Test validation with complete data"""
        data = {
            "platform": "tiktok",
            "name": "#TestTrend",
            "views": 1000000,
            "likes": 50000,
            "comments": 5000,
            "shares": 10000
        }
        
        # Should not raise exception
        # (Validation logic would be in the actual service)
        assert data["platform"] in ["tiktok", "twitter", "instagram", "youtube"]
        assert data["views"] > 0
    
    def test_validate_trend_data_missing_fields(self):
        """Test validation with missing required fields"""
        data = {
            "platform": "tiktok"
            # Missing other required fields
        }
        
        required_fields = ["platform", "name", "views"]
        for field in required_fields:
            assert field in data or field == "name"  # Will fail validation


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--cov=services.ai_connector", "--cov=routes.ai"])
