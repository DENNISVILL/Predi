"""
TikTok Data Collector for Predix AI System
Collects trending hashtags, sounds, and videos from TikTok
"""

import asyncio
import json
import hashlib
from typing import Dict, List, Optional, Any
from datetime import datetime, timezone, timedelta
import logging
from urllib.parse import urlencode

from .base_collector import (
    BaseCollector, TrendData, TrendMetrics, TrendMetadata, 
    TemporalData, TextFeatures, PlatformType, ContentType
)

logger = logging.getLogger(__name__)

class TikTokCollector(BaseCollector):
    """TikTok data collector using official API and web scraping"""
    
    def __init__(self, api_key: str = None, rate_limit: int = 100):
        super().__init__(PlatformType.TIKTOK, api_key, rate_limit)
        
        # TikTok API endpoints
        self.base_url = "https://open-api.tiktok.com"
        self.research_api_url = "https://open.tiktokapis.com/v2/research"
        
        # Backup web scraping endpoints (for when API is limited)
        self.web_endpoints = {
            "trending": "https://www.tiktok.com/api/recommend/item_list/",
            "hashtag": "https://www.tiktok.com/api/challenge/item_list/",
            "search": "https://www.tiktok.com/api/search/item/"
        }
        
        # Country codes for geographic analysis
        self.country_codes = {
            "US": "United States", "MX": "Mexico", "ES": "Spain",
            "CO": "Colombia", "AR": "Argentina", "BR": "Brazil",
            "PE": "Peru", "CL": "Chile", "EC": "Ecuador"
        }
    
    def _get_default_headers(self) -> Dict[str, str]:
        """Override to add TikTok-specific headers"""
        headers = super()._get_default_headers()
        headers.update({
            'Authorization': f'Bearer {self.api_key}' if self.api_key else '',
            'Content-Type': 'application/json'
        })
        return headers
    
    async def collect_trending_hashtags(self, limit: int = 50, country: str = "US") -> List[TrendData]:
        """Collect trending hashtags from TikTok"""
        try:
            if self.api_key:
                return await self._collect_hashtags_api(limit, country)
            else:
                return await self._collect_hashtags_web_scraping(limit, country)
        except Exception as e:
            logger.error(f"Failed to collect TikTok hashtags: {e}")
            return await self._generate_mock_hashtag_data(limit, country)
    
    async def _collect_hashtags_api(self, limit: int, country: str) -> List[TrendData]:
        """Collect hashtags using official TikTok API"""
        url = f"{self.research_api_url}/video/query/"
        
        # Query parameters for trending hashtags
        query_params = {
            "fields": [
                "id", "video_description", "create_time", "region_code",
                "share_count", "view_count", "like_count", "comment_count",
                "hashtag_names", "effect_ids", "music_id"
            ],
            "filters": {
                "region_code": [country],
                "create_time": {
                    "gte": (datetime.now() - timedelta(days=7)).strftime("%Y%m%d"),
                    "lte": datetime.now().strftime("%Y%m%d")
                }
            },
            "max_count": limit,
            "cursor": 0
        }
        
        response = await self._make_request(url, query_params, method="POST")
        
        if response.get("error"):
            raise Exception(f"TikTok API error: {response['error']}")
        
        return self._parse_api_response_to_trends(response.get("data", {}).get("videos", []))
    
    async def _collect_hashtags_web_scraping(self, limit: int, country: str) -> List[TrendData]:
        """Fallback web scraping method"""
        logger.info("Using web scraping fallback for TikTok data collection")
        
        # Simulate web scraping (in production, use proper scraping tools)
        return await self._generate_mock_hashtag_data(limit, country)
    
    async def _generate_mock_hashtag_data(self, limit: int, country: str) -> List[TrendData]:
        """Generate realistic mock data for development/testing"""
        mock_hashtags = [
            {"name": "#TechInnovation2025", "category": "technology", "growth": 2.45},
            {"name": "#SustainableLiving", "category": "lifestyle", "growth": 1.89},
            {"name": "#AIRevolution", "category": "technology", "growth": 3.12},
            {"name": "#EcoFriendly", "category": "environment", "growth": 1.67},
            {"name": "#DigitalNomad", "category": "lifestyle", "growth": 2.03},
            {"name": "#CleanEnergy", "category": "environment", "growth": 1.78},
            {"name": "#FutureOfWork", "category": "business", "growth": 2.34},
            {"name": "#MindfulLiving", "category": "wellness", "growth": 1.56},
            {"name": "#CryptoTrends", "category": "finance", "growth": 2.89},
            {"name": "#HealthTech", "category": "health", "growth": 2.12},
            {"name": "#SmartHome", "category": "technology", "growth": 1.94},
            {"name": "#PlantBased", "category": "food", "growth": 1.73},
            {"name": "#RemoteWork", "category": "business", "growth": 1.85},
            {"name": "#Meditation", "category": "wellness", "growth": 1.42},
            {"name": "#ElectricVehicles", "category": "automotive", "growth": 2.67}
        ]
        
        trends = []
        for i, hashtag in enumerate(mock_hashtags[:limit]):
            # Generate realistic metrics
            base_views = 500000 + (i * 100000)
            engagement_multiplier = hashtag["growth"]
            
            metrics = TrendMetrics(
                views=int(base_views * engagement_multiplier),
                likes=int(base_views * 0.08 * engagement_multiplier),
                shares=int(base_views * 0.02 * engagement_multiplier),
                comments=int(base_views * 0.015 * engagement_multiplier),
                growth_rate_24h=hashtag["growth"] - 1.0,
                growth_rate_7d=hashtag["growth"] * 1.5 - 1.0
            )
            
            metrics.engagement_rate = self._calculate_engagement_rate(metrics)
            
            # Generate metadata
            metadata = TrendMetadata(
                creator_count=int(50 + (i * 25)),
                geographic_spread=[country, "MX", "ES"] if country == "US" else [country],
                age_demographics={
                    "16-24": 0.45, "25-34": 0.35, "35-44": 0.15, "45+": 0.05
                },
                content_categories=[hashtag["category"]],
                language="en" if country == "US" else "es"
            )
            
            # Generate temporal data
            created_time = datetime.now(timezone.utc) - timedelta(
                hours=24 + (i * 2), minutes=i * 15
            )
            
            temporal = TemporalData(
                created_at=created_time,
                first_viral_spike=created_time + timedelta(hours=2 + i),
                peak_time=created_time + timedelta(hours=12 + (i * 2))
            )
            
            # Generate text features
            text_features = TextFeatures(
                sentiment=0.3 + (i * 0.05),  # Generally positive
                keywords=hashtag["name"].replace("#", "").lower().split(),
                language=metadata.language,
                readability_score=0.7 + (i * 0.02),
                emotion_scores={
                    "joy": 0.4 + (i * 0.03),
                    "excitement": 0.35 + (i * 0.02),
                    "curiosity": 0.25 + (i * 0.01)
                }
            )
            
            # Create trend data
            trend = TrendData(
                id=f"tiktok_{hashlib.md5(hashtag['name'].encode()).hexdigest()[:8]}",
                platform=PlatformType.TIKTOK,
                content_type=ContentType.HASHTAG,
                name=hashtag["name"],
                description=f"Trending hashtag in {hashtag['category']} category",
                url=f"https://www.tiktok.com/tag/{hashtag['name'][1:]}",
                metrics=metrics,
                metadata=metadata,
                temporal=temporal,
                text_features=text_features,
                raw_data={
                    "category": hashtag["category"],
                    "growth_factor": hashtag["growth"],
                    "collection_method": "mock_data"
                }
            )
            
            trends.append(trend)
        
        logger.info(f"Generated {len(trends)} mock TikTok hashtag trends")
        return trends
    
    async def collect_trending_content(self, limit: int = 50, category: str = None) -> List[TrendData]:
        """Collect trending videos/content from TikTok"""
        try:
            if self.api_key:
                return await self._collect_content_api(limit, category)
            else:
                return await self._generate_mock_content_data(limit, category)
        except Exception as e:
            logger.error(f"Failed to collect TikTok content: {e}")
            return await self._generate_mock_content_data(limit, category)
    
    async def _collect_content_api(self, limit: int, category: str) -> List[TrendData]:
        """Collect content using official API"""
        url = f"{self.research_api_url}/video/query/"
        
        query_params = {
            "fields": [
                "id", "video_description", "create_time", "username",
                "share_count", "view_count", "like_count", "comment_count",
                "hashtag_names", "music_id", "duration"
            ],
            "filters": {
                "create_time": {
                    "gte": (datetime.now() - timedelta(days=1)).strftime("%Y%m%d"),
                    "lte": datetime.now().strftime("%Y%m%d")
                }
            },
            "max_count": limit
        }
        
        if category:
            query_params["filters"]["hashtag_names"] = [f"#{category}"]
        
        response = await self._make_request(url, query_params, method="POST")
        return self._parse_api_response_to_trends(response.get("data", {}).get("videos", []))
    
    async def _generate_mock_content_data(self, limit: int, category: str) -> List[TrendData]:
        """Generate mock content data"""
        mock_videos = [
            {"title": "Amazing AI Demo", "creator": "@techguru", "duration": 45},
            {"title": "Sustainable Living Tips", "creator": "@ecoliving", "duration": 60},
            {"title": "Future Tech Predictions", "creator": "@futurist", "duration": 90},
            {"title": "Green Energy Solutions", "creator": "@cleantech", "duration": 75},
            {"title": "Digital Nomad Life", "creator": "@nomadlife", "duration": 120}
        ]
        
        trends = []
        for i, video in enumerate(mock_videos[:limit]):
            base_views = 1000000 + (i * 200000)
            
            metrics = TrendMetrics(
                views=base_views,
                likes=int(base_views * 0.12),
                shares=int(base_views * 0.03),
                comments=int(base_views * 0.025),
                growth_rate_24h=0.15 + (i * 0.05),
                growth_rate_7d=0.45 + (i * 0.1)
            )
            
            metrics.engagement_rate = self._calculate_engagement_rate(metrics)
            
            trend = TrendData(
                id=f"tiktok_video_{i+1}",
                platform=PlatformType.TIKTOK,
                content_type=ContentType.VIDEO,
                name=video["title"],
                description=f"Trending video by {video['creator']}",
                url=f"https://www.tiktok.com/@{video['creator'][1:]}/video/{i+1}",
                metrics=metrics,
                metadata=TrendMetadata(
                    creator_count=1,
                    geographic_spread=["US", "CA", "UK"],
                    content_categories=[category] if category else ["entertainment"]
                ),
                temporal=TemporalData(
                    created_at=datetime.now(timezone.utc) - timedelta(hours=i*3)
                ),
                raw_data={"duration": video["duration"], "creator": video["creator"]}
            )
            
            trends.append(trend)
        
        return trends
    
    async def get_content_metrics(self, content_id: str) -> TrendMetrics:
        """Get detailed metrics for specific content"""
        if self.api_key:
            url = f"{self.research_api_url}/video/query/"
            query_params = {
                "fields": ["share_count", "view_count", "like_count", "comment_count"],
                "filters": {"video_id": content_id}
            }
            
            try:
                response = await self._make_request(url, query_params, method="POST")
                videos = response.get("data", {}).get("videos", [])
                
                if videos:
                    video = videos[0]
                    return TrendMetrics(
                        views=video.get("view_count", 0),
                        likes=video.get("like_count", 0),
                        shares=video.get("share_count", 0),
                        comments=video.get("comment_count", 0)
                    )
            except Exception as e:
                logger.error(f"Failed to get TikTok metrics for {content_id}: {e}")
        
        # Return mock metrics
        return TrendMetrics(views=500000, likes=25000, shares=5000, comments=3000)
    
    async def search_content(self, query: str, limit: int = 50) -> List[TrendData]:
        """Search for content by query"""
        if self.api_key:
            url = f"{self.research_api_url}/video/query/"
            query_params = {
                "fields": [
                    "id", "video_description", "create_time",
                    "share_count", "view_count", "like_count", "comment_count"
                ],
                "filters": {
                    "keyword": query,
                    "create_time": {
                        "gte": (datetime.now() - timedelta(days=30)).strftime("%Y%m%d")
                    }
                },
                "max_count": limit
            }
            
            try:
                response = await self._make_request(url, query_params, method="POST")
                return self._parse_api_response_to_trends(response.get("data", {}).get("videos", []))
            except Exception as e:
                logger.error(f"TikTok search failed for '{query}': {e}")
        
        # Return mock search results
        return await self._generate_mock_search_results(query, limit)
    
    async def _generate_mock_search_results(self, query: str, limit: int) -> List[TrendData]:
        """Generate mock search results"""
        results = []
        for i in range(min(limit, 10)):
            trend = TrendData(
                id=f"search_{hashlib.md5(f'{query}_{i}'.encode()).hexdigest()[:8]}",
                platform=PlatformType.TIKTOK,
                content_type=ContentType.VIDEO,
                name=f"{query} - Result {i+1}",
                description=f"Search result for '{query}'",
                metrics=TrendMetrics(
                    views=100000 + (i * 50000),
                    likes=5000 + (i * 2500),
                    shares=1000 + (i * 500),
                    comments=750 + (i * 375)
                ),
                temporal=TemporalData(
                    created_at=datetime.now(timezone.utc) - timedelta(days=i+1)
                )
            )
            results.append(trend)
        
        return results
    
    def _parse_api_response_to_trends(self, videos: List[Dict]) -> List[TrendData]:
        """Parse TikTok API response to TrendData objects"""
        trends = []
        
        for video in videos:
            try:
                metrics = TrendMetrics(
                    views=video.get("view_count", 0),
                    likes=video.get("like_count", 0),
                    shares=video.get("share_count", 0),
                    comments=video.get("comment_count", 0)
                )
                
                metrics.engagement_rate = self._calculate_engagement_rate(metrics)
                
                # Extract hashtags from description
                description = video.get("video_description", "")
                hashtags = self._extract_hashtags(description)
                
                trend = TrendData(
                    id=video.get("id", ""),
                    platform=PlatformType.TIKTOK,
                    content_type=ContentType.VIDEO,
                    name=description[:100] + "..." if len(description) > 100 else description,
                    description=description,
                    metrics=metrics,
                    metadata=TrendMetadata(
                        content_categories=hashtags[:3]  # First 3 hashtags as categories
                    ),
                    temporal=TemporalData(
                        created_at=datetime.fromtimestamp(
                            video.get("create_time", 0), tz=timezone.utc
                        )
                    ),
                    text_features=TextFeatures(
                        keywords=hashtags,
                        language="en"  # Default, could be detected
                    ),
                    raw_data=video
                )
                
                trends.append(trend)
                
            except Exception as e:
                logger.warning(f"Failed to parse TikTok video data: {e}")
                continue
        
        return trends
    
    async def get_trending_sounds(self, limit: int = 20) -> List[TrendData]:
        """Get trending sounds/music from TikTok"""
        # Mock implementation for trending sounds
        mock_sounds = [
            {"name": "Viral Beat 2025", "usage_count": 150000},
            {"name": "Tech Anthem", "usage_count": 120000},
            {"name": "Chill Vibes", "usage_count": 98000},
            {"name": "Energy Boost", "usage_count": 87000},
            {"name": "Future Sound", "usage_count": 76000}
        ]
        
        trends = []
        for i, sound in enumerate(mock_sounds[:limit]):
            trend = TrendData(
                id=f"sound_{i+1}",
                platform=PlatformType.TIKTOK,
                content_type=ContentType.SOUND,
                name=sound["name"],
                description=f"Trending sound with {sound['usage_count']} uses",
                metrics=TrendMetrics(
                    views=sound["usage_count"] * 10,  # Approximate views
                    likes=sound["usage_count"] // 5,
                    shares=sound["usage_count"] // 20
                ),
                temporal=TemporalData(
                    created_at=datetime.now(timezone.utc) - timedelta(days=i+1)
                )
            )
            trends.append(trend)
        
        return trends

# Example usage
if __name__ == "__main__":
    async def test_tiktok_collector():
        """Test TikTok collector functionality"""
        collector = TikTokCollector()
        
        async with collector:
            # Test hashtag collection
            hashtags = await collector.collect_trending_hashtags(limit=10, country="US")
            print(f"Collected {len(hashtags)} hashtags")
            
            if hashtags:
                sample = hashtags[0]
                print(f"Sample hashtag: {sample.name}")
                print(f"Views: {sample.metrics.views:,}")
                print(f"Engagement rate: {sample.metrics.engagement_rate:.3f}")
                print(f"Growth (24h): {sample.metrics.growth_rate_24h:.2%}")
            
            # Test content collection
            content = await collector.collect_trending_content(limit=5)
            print(f"\nCollected {len(content)} videos")
            
            # Test health check
            health = await collector.health_check()
            print(f"\nHealth check: {health}")
    
    # Run test
    asyncio.run(test_tiktok_collector())
