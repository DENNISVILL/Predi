"""
Base Collector Class for Social Media Data Collection
Predix AI System - Data Collection Layer
"""

import asyncio
import aiohttp
import time
from abc import ABC, abstractmethod
from typing import Dict, List, Optional, Any
from dataclasses import dataclass, asdict
from datetime import datetime, timezone
import logging
import json
from enum import Enum

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class PlatformType(Enum):
    TIKTOK = "tiktok"
    INSTAGRAM = "instagram" 
    TWITTER = "twitter"
    YOUTUBE = "youtube"
    SPOTIFY = "spotify"
    GOOGLE_TRENDS = "google_trends"

class ContentType(Enum):
    HASHTAG = "hashtag"
    SOUND = "sound"
    VIDEO = "video"
    POST = "post"
    SONG = "song"
    KEYWORD = "keyword"

@dataclass
class TrendMetrics:
    """Unified metrics structure for all platforms"""
    views: int = 0
    likes: int = 0
    shares: int = 0
    comments: int = 0
    engagement_rate: float = 0.0
    growth_rate_24h: float = 0.0
    growth_rate_7d: float = 0.0
    reach: int = 0
    impressions: int = 0

@dataclass
class TrendMetadata:
    """Additional metadata for trend analysis"""
    creator_count: int = 0
    geographic_spread: List[str] = None
    age_demographics: Dict[str, float] = None
    content_categories: List[str] = None
    language: str = "unknown"
    is_sponsored: bool = False
    
    def __post_init__(self):
        if self.geographic_spread is None:
            self.geographic_spread = []
        if self.age_demographics is None:
            self.age_demographics = {}
        if self.content_categories is None:
            self.content_categories = []

@dataclass
class TemporalData:
    """Temporal information for trend tracking"""
    created_at: datetime
    first_viral_spike: Optional[datetime] = None
    peak_time: Optional[datetime] = None
    last_updated: datetime = None
    
    def __post_init__(self):
        if self.last_updated is None:
            self.last_updated = datetime.now(timezone.utc)

@dataclass
class TextFeatures:
    """NLP-extracted features from content"""
    sentiment: float = 0.0  # -1 to 1
    keywords: List[str] = None
    language: str = "unknown"
    readability_score: float = 0.0
    toxicity_score: float = 0.0
    emotion_scores: Dict[str, float] = None
    
    def __post_init__(self):
        if self.keywords is None:
            self.keywords = []
        if self.emotion_scores is None:
            self.emotion_scores = {}

@dataclass
class TrendData:
    """Complete trend data structure"""
    id: str
    platform: PlatformType
    content_type: ContentType
    name: str
    description: str = ""
    url: str = ""
    metrics: TrendMetrics = None
    metadata: TrendMetadata = None
    temporal: TemporalData = None
    text_features: TextFeatures = None
    raw_data: Dict[str, Any] = None
    
    def __post_init__(self):
        if self.metrics is None:
            self.metrics = TrendMetrics()
        if self.metadata is None:
            self.metadata = TrendMetadata()
        if self.temporal is None:
            self.temporal = TemporalData(created_at=datetime.now(timezone.utc))
        if self.text_features is None:
            self.text_features = TextFeatures()
        if self.raw_data is None:
            self.raw_data = {}
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary for JSON serialization"""
        result = asdict(self)
        
        # Convert enums to strings
        result['platform'] = self.platform.value
        result['content_type'] = self.content_type.value
        
        # Convert datetime objects to ISO strings
        if self.temporal:
            result['temporal']['created_at'] = self.temporal.created_at.isoformat()
            if self.temporal.first_viral_spike:
                result['temporal']['first_viral_spike'] = self.temporal.first_viral_spike.isoformat()
            if self.temporal.peak_time:
                result['temporal']['peak_time'] = self.temporal.peak_time.isoformat()
            if self.temporal.last_updated:
                result['temporal']['last_updated'] = self.temporal.last_updated.isoformat()
        
        return result

class BaseCollector(ABC):
    """Abstract base class for all social media collectors"""
    
    def __init__(self, platform: PlatformType, api_key: str = None, rate_limit: int = 100):
        self.platform = platform
        self.api_key = api_key
        self.rate_limit = rate_limit
        self.session: Optional[aiohttp.ClientSession] = None
        self.request_count = 0
        self.last_reset = time.time()
        
        # Rate limiting
        self.requests_per_minute = rate_limit
        self.request_times = []
        
    async def __aenter__(self):
        """Async context manager entry"""
        self.session = aiohttp.ClientSession(
            timeout=aiohttp.ClientTimeout(total=30),
            headers=self._get_default_headers()
        )
        return self
    
    async def __aexit__(self, exc_type, exc_val, exc_tb):
        """Async context manager exit"""
        if self.session:
            await self.session.close()
    
    def _get_default_headers(self) -> Dict[str, str]:
        """Get default headers for API requests"""
        return {
            'User-Agent': 'Predix-AI-Collector/1.0',
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    
    async def _rate_limit_check(self):
        """Check and enforce rate limiting"""
        now = time.time()
        
        # Remove requests older than 1 minute
        self.request_times = [t for t in self.request_times if now - t < 60]
        
        # Check if we're at the limit
        if len(self.request_times) >= self.requests_per_minute:
            sleep_time = 60 - (now - self.request_times[0])
            if sleep_time > 0:
                logger.warning(f"Rate limit reached for {self.platform.value}. Sleeping for {sleep_time:.2f} seconds")
                await asyncio.sleep(sleep_time)
        
        self.request_times.append(now)
    
    async def _make_request(self, url: str, params: Dict[str, Any] = None, method: str = "GET") -> Dict[str, Any]:
        """Make rate-limited API request"""
        await self._rate_limit_check()
        
        try:
            if method.upper() == "GET":
                async with self.session.get(url, params=params) as response:
                    response.raise_for_status()
                    return await response.json()
            elif method.upper() == "POST":
                async with self.session.post(url, json=params) as response:
                    response.raise_for_status()
                    return await response.json()
        except aiohttp.ClientError as e:
            logger.error(f"Request failed for {self.platform.value}: {e}")
            raise
        except Exception as e:
            logger.error(f"Unexpected error for {self.platform.value}: {e}")
            raise
    
    @abstractmethod
    async def collect_trending_hashtags(self, limit: int = 50, country: str = "US") -> List[TrendData]:
        """Collect trending hashtags from the platform"""
        pass
    
    @abstractmethod
    async def collect_trending_content(self, limit: int = 50, category: str = None) -> List[TrendData]:
        """Collect trending content from the platform"""
        pass
    
    @abstractmethod
    async def get_content_metrics(self, content_id: str) -> TrendMetrics:
        """Get detailed metrics for specific content"""
        pass
    
    @abstractmethod
    async def search_content(self, query: str, limit: int = 50) -> List[TrendData]:
        """Search for content by query"""
        pass
    
    def _calculate_engagement_rate(self, metrics: TrendMetrics) -> float:
        """Calculate engagement rate from metrics"""
        if metrics.views == 0:
            return 0.0
        
        total_engagement = metrics.likes + metrics.comments + metrics.shares
        return total_engagement / metrics.views if metrics.views > 0 else 0.0
    
    def _calculate_growth_rate(self, current_value: int, previous_value: int) -> float:
        """Calculate growth rate between two values"""
        if previous_value == 0:
            return 1.0 if current_value > 0 else 0.0
        
        return (current_value - previous_value) / previous_value
    
    def _extract_hashtags(self, text: str) -> List[str]:
        """Extract hashtags from text"""
        import re
        hashtag_pattern = r'#\w+'
        return re.findall(hashtag_pattern, text.lower())
    
    def _extract_mentions(self, text: str) -> List[str]:
        """Extract mentions from text"""
        import re
        mention_pattern = r'@\w+'
        return re.findall(mention_pattern, text.lower())
    
    def _clean_text(self, text: str) -> str:
        """Clean and normalize text"""
        if not text:
            return ""
        
        # Remove extra whitespace
        text = ' '.join(text.split())
        
        # Remove special characters but keep hashtags and mentions
        import re
        text = re.sub(r'[^\w\s#@]', ' ', text)
        
        return text.strip()
    
    async def health_check(self) -> Dict[str, Any]:
        """Check if the collector is working properly"""
        try:
            # Try to make a simple request to test connectivity
            test_data = await self.collect_trending_hashtags(limit=1)
            return {
                "platform": self.platform.value,
                "status": "healthy",
                "last_check": datetime.now(timezone.utc).isoformat(),
                "data_available": len(test_data) > 0
            }
        except Exception as e:
            return {
                "platform": self.platform.value,
                "status": "error",
                "error": str(e),
                "last_check": datetime.now(timezone.utc).isoformat()
            }

class CollectorManager:
    """Manager for coordinating multiple collectors"""
    
    def __init__(self):
        self.collectors: Dict[PlatformType, BaseCollector] = {}
        self.collection_stats = {
            "total_requests": 0,
            "successful_requests": 0,
            "failed_requests": 0,
            "last_collection": None
        }
    
    def register_collector(self, collector: BaseCollector):
        """Register a new collector"""
        self.collectors[collector.platform] = collector
        logger.info(f"Registered collector for {collector.platform.value}")
    
    async def collect_all_trends(self, limit: int = 50) -> List[TrendData]:
        """Collect trends from all registered collectors"""
        all_trends = []
        
        for platform, collector in self.collectors.items():
            try:
                async with collector:
                    trends = await collector.collect_trending_hashtags(limit=limit)
                    all_trends.extend(trends)
                    self.collection_stats["successful_requests"] += 1
                    logger.info(f"Collected {len(trends)} trends from {platform.value}")
            except Exception as e:
                logger.error(f"Failed to collect from {platform.value}: {e}")
                self.collection_stats["failed_requests"] += 1
        
        self.collection_stats["total_requests"] += len(self.collectors)
        self.collection_stats["last_collection"] = datetime.now(timezone.utc).isoformat()
        
        return all_trends
    
    async def health_check_all(self) -> Dict[str, Any]:
        """Run health check on all collectors"""
        results = {}
        
        for platform, collector in self.collectors.items():
            async with collector:
                results[platform.value] = await collector.health_check()
        
        return {
            "overall_status": "healthy" if all(r["status"] == "healthy" for r in results.values()) else "degraded",
            "collectors": results,
            "stats": self.collection_stats
        }

# Example usage and testing
if __name__ == "__main__":
    async def test_base_functionality():
        """Test base collector functionality"""
        
        # This would be implemented by specific platform collectors
        class TestCollector(BaseCollector):
            async def collect_trending_hashtags(self, limit: int = 50, country: str = "US") -> List[TrendData]:
                # Simulate data collection
                return [
                    TrendData(
                        id="test_1",
                        platform=PlatformType.TIKTOK,
                        content_type=ContentType.HASHTAG,
                        name="#TestTrend",
                        metrics=TrendMetrics(views=1000000, likes=50000, shares=10000)
                    )
                ]
            
            async def collect_trending_content(self, limit: int = 50, category: str = None) -> List[TrendData]:
                return []
            
            async def get_content_metrics(self, content_id: str) -> TrendMetrics:
                return TrendMetrics()
            
            async def search_content(self, query: str, limit: int = 50) -> List[TrendData]:
                return []
        
        # Test collector
        collector = TestCollector(PlatformType.TIKTOK)
        async with collector:
            trends = await collector.collect_trending_hashtags(limit=5)
            print(f"Collected {len(trends)} trends")
            
            if trends:
                print(f"Sample trend: {trends[0].to_dict()}")
    
    # Run test
    asyncio.run(test_base_functionality())
