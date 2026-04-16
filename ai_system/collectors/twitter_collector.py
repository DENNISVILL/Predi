"""
Twitter/X Data Collector for Predix AI System
Collects trending hashtags, tweets, and topics from Twitter/X
"""

import asyncio
import json
import hashlib
from typing import Dict, List, Optional, Any
from datetime import datetime, timezone, timedelta
import logging
import re

from .base_collector import (
    BaseCollector, TrendData, TrendMetrics, TrendMetadata, 
    TemporalData, TextFeatures, PlatformType, ContentType
)

logger = logging.getLogger(__name__)

class TwitterCollector(BaseCollector):
    """Twitter/X data collector using API v2"""
    
    def __init__(self, api_key: str = None, api_secret: str = None, bearer_token: str = None, rate_limit: int = 300):
        super().__init__(PlatformType.TWITTER, api_key, rate_limit)
        self.api_secret = api_secret
        self.bearer_token = bearer_token
        
        # Twitter API v2 endpoints
        self.base_url = "https://api.twitter.com/2"
        self.endpoints = {
            "trends": "/trends/by/woeid",
            "search": "/tweets/search/recent",
            "tweets": "/tweets",
            "users": "/users/by/username"
        }
        
        # World Where On Earth IDs for different locations
        self.woeid_map = {
            "US": 23424977,      # United States
            "MX": 23424900,      # Mexico  
            "ES": 23424950,      # Spain
            "CO": 23424787,      # Colombia
            "AR": 23424747,      # Argentina
            "BR": 23424768,      # Brazil
            "PE": 23424919,      # Peru
            "CL": 23424782,      # Chile
            "WORLDWIDE": 1       # Worldwide
        }
    
    def _get_default_headers(self) -> Dict[str, str]:
        """Override to add Twitter-specific headers"""
        headers = super()._get_default_headers()
        if self.bearer_token:
            headers['Authorization'] = f'Bearer {self.bearer_token}'
        return headers
    
    async def collect_trending_hashtags(self, limit: int = 50, country: str = "US") -> List[TrendData]:
        """Collect trending hashtags from Twitter"""
        try:
            if self.bearer_token:
                return await self._collect_hashtags_api(limit, country)
            else:
                return await self._generate_mock_hashtag_data(limit, country)
        except Exception as e:
            logger.error(f"Failed to collect Twitter hashtags: {e}")
            return await self._generate_mock_hashtag_data(limit, country)
    
    async def _collect_hashtags_api(self, limit: int, country: str) -> List[TrendData]:
        """Collect hashtags using Twitter API v2"""
        woeid = self.woeid_map.get(country, self.woeid_map["US"])
        
        # Get trending topics
        trends_url = f"{self.base_url}/trends/by/woeid/{woeid}"
        
        try:
            response = await self._make_request(trends_url)
            trends_data = response.get("data", [])
            
            # Convert trending topics to TrendData objects
            trend_objects = []
            
            for i, trend in enumerate(trends_data[:limit]):
                if trend.get("name", "").startswith("#"):
                    # Get additional metrics for hashtag
                    metrics = await self._get_hashtag_metrics(trend["name"])
                    
                    trend_obj = TrendData(
                        id=f"twitter_{hashlib.md5(trend['name'].encode()).hexdigest()[:8]}",
                        platform=PlatformType.TWITTER,
                        content_type=ContentType.HASHTAG,
                        name=trend["name"],
                        description=trend.get("description", ""),
                        url=trend.get("url", f"https://twitter.com/hashtag/{trend['name'][1:]}"),
                        metrics=metrics,
                        metadata=TrendMetadata(
                            geographic_spread=[country],
                            content_categories=self._categorize_hashtag(trend["name"])
                        ),
                        temporal=TemporalData(
                            created_at=datetime.now(timezone.utc)
                        ),
                        raw_data=trend
                    )
                    
                    trend_objects.append(trend_obj)
            
            return trend_objects
            
        except Exception as e:
            logger.error(f"Twitter API request failed: {e}")
            return await self._generate_mock_hashtag_data(limit, country)
    
    async def _get_hashtag_metrics(self, hashtag: str) -> TrendMetrics:
        """Get metrics for a specific hashtag using search API"""
        try:
            # Search for recent tweets with the hashtag
            search_url = f"{self.base_url}/tweets/search/recent"
            params = {
                "query": f"{hashtag} -is:retweet",
                "max_results": 100,
                "tweet.fields": "public_metrics,created_at,context_annotations",
                "expansions": "author_id"
            }
            
            response = await self._make_request(search_url, params)
            tweets = response.get("data", [])
            
            # Aggregate metrics
            total_retweets = sum(tweet.get("public_metrics", {}).get("retweet_count", 0) for tweet in tweets)
            total_likes = sum(tweet.get("public_metrics", {}).get("like_count", 0) for tweet in tweets)
            total_replies = sum(tweet.get("public_metrics", {}).get("reply_count", 0) for tweet in tweets)
            total_quotes = sum(tweet.get("public_metrics", {}).get("quote_count", 0) for tweet in tweets)
            
            # Estimate total impressions (Twitter doesn't provide this directly)
            estimated_impressions = len(tweets) * 1000  # Rough estimate
            
            metrics = TrendMetrics(
                views=estimated_impressions,
                likes=total_likes,
                shares=total_retweets + total_quotes,
                comments=total_replies,
                reach=len(tweets) * 50,  # Estimate reach
                impressions=estimated_impressions
            )
            
            metrics.engagement_rate = self._calculate_engagement_rate(metrics)
            
            return metrics
            
        except Exception as e:
            logger.warning(f"Failed to get metrics for {hashtag}: {e}")
            # Return estimated metrics
            return TrendMetrics(
                views=50000,
                likes=2500,
                shares=500,
                comments=300,
                engagement_rate=0.066
            )
    
    async def _generate_mock_hashtag_data(self, limit: int, country: str) -> List[TrendData]:
        """Generate realistic mock Twitter hashtag data"""
        mock_hashtags = [
            {"name": "#TechNews", "category": "technology", "volume": 125000},
            {"name": "#ClimateAction", "category": "environment", "volume": 98000},
            {"name": "#AI2025", "category": "technology", "volume": 156000},
            {"name": "#Sustainability", "category": "environment", "volume": 87000},
            {"name": "#Innovation", "category": "business", "volume": 134000},
            {"name": "#DigitalTransformation", "category": "technology", "volume": 76000},
            {"name": "#GreenEnergy", "category": "environment", "volume": 92000},
            {"name": "#StartupLife", "category": "business", "volume": 68000},
            {"name": "#FutureOfWork", "category": "business", "volume": 89000},
            {"name": "#CyberSecurity", "category": "technology", "volume": 112000},
            {"name": "#Blockchain", "category": "technology", "volume": 145000},
            {"name": "#SocialImpact", "category": "society", "volume": 73000},
            {"name": "#DataScience", "category": "technology", "volume": 95000},
            {"name": "#Wellness", "category": "health", "volume": 81000},
            {"name": "#RemoteWork", "category": "business", "volume": 103000}
        ]
        
        trends = []
        for i, hashtag in enumerate(mock_hashtags[:limit]):
            # Calculate metrics based on volume
            volume = hashtag["volume"]
            engagement_factor = 0.05 + (i * 0.002)  # Varying engagement rates
            
            metrics = TrendMetrics(
                views=volume * 10,  # Estimated impressions
                likes=int(volume * 0.08 * engagement_factor),
                shares=int(volume * 0.015 * engagement_factor),
                comments=int(volume * 0.01 * engagement_factor),
                reach=int(volume * 2),
                impressions=volume * 10,
                growth_rate_24h=0.1 + (i * 0.03),
                growth_rate_7d=0.25 + (i * 0.05)
            )
            
            metrics.engagement_rate = self._calculate_engagement_rate(metrics)
            
            # Generate metadata
            metadata = TrendMetadata(
                creator_count=int(volume * 0.001),  # Estimate unique users
                geographic_spread=self._get_geographic_spread(country),
                age_demographics={
                    "18-29": 0.35, "30-39": 0.28, "40-49": 0.22, "50+": 0.15
                },
                content_categories=[hashtag["category"]],
                language="en" if country == "US" else "es"
            )
            
            # Generate temporal data
            created_time = datetime.now(timezone.utc) - timedelta(
                hours=12 + (i * 2), minutes=i * 10
            )
            
            temporal = TemporalData(
                created_at=created_time,
                first_viral_spike=created_time + timedelta(hours=1 + (i * 0.5)),
                peak_time=created_time + timedelta(hours=6 + i)
            )
            
            # Generate text features
            text_features = TextFeatures(
                sentiment=0.2 + (i * 0.04),  # Neutral to positive
                keywords=self._extract_keywords_from_hashtag(hashtag["name"]),
                language=metadata.language,
                readability_score=0.8,  # Twitter content is generally readable
                emotion_scores={
                    "engagement": 0.6 + (i * 0.02),
                    "interest": 0.5 + (i * 0.015),
                    "urgency": 0.3 + (i * 0.01)
                }
            )
            
            # Create trend data
            trend = TrendData(
                id=f"twitter_{hashlib.md5(hashtag['name'].encode()).hexdigest()[:8]}",
                platform=PlatformType.TWITTER,
                content_type=ContentType.HASHTAG,
                name=hashtag["name"],
                description=f"Trending hashtag in {hashtag['category']} with {volume:,} mentions",
                url=f"https://twitter.com/hashtag/{hashtag['name'][1:]}",
                metrics=metrics,
                metadata=metadata,
                temporal=temporal,
                text_features=text_features,
                raw_data={
                    "category": hashtag["category"],
                    "volume": volume,
                    "collection_method": "mock_data"
                }
            )
            
            trends.append(trend)
        
        logger.info(f"Generated {len(trends)} mock Twitter hashtag trends")
        return trends
    
    async def collect_trending_content(self, limit: int = 50, category: str = None) -> List[TrendData]:
        """Collect trending tweets/content from Twitter"""
        try:
            if self.bearer_token:
                return await self._collect_content_api(limit, category)
            else:
                return await self._generate_mock_content_data(limit, category)
        except Exception as e:
            logger.error(f"Failed to collect Twitter content: {e}")
            return await self._generate_mock_content_data(limit, category)
    
    async def _collect_content_api(self, limit: int, category: str) -> List[TrendData]:
        """Collect content using Twitter API"""
        search_url = f"{self.base_url}/tweets/search/recent"
        
        # Build search query
        query = "-is:retweet lang:en"
        if category:
            query += f" #{category}"
        
        params = {
            "query": query,
            "max_results": min(limit, 100),  # API limit
            "tweet.fields": "public_metrics,created_at,context_annotations,lang",
            "expansions": "author_id",
            "user.fields": "public_metrics,verified"
        }
        
        response = await self._make_request(search_url, params)
        tweets = response.get("data", [])
        users = {user["id"]: user for user in response.get("includes", {}).get("users", [])}
        
        trends = []
        for tweet in tweets:
            author = users.get(tweet.get("author_id"))
            
            metrics = TrendMetrics(
                views=tweet.get("public_metrics", {}).get("impression_count", 0),
                likes=tweet.get("public_metrics", {}).get("like_count", 0),
                shares=tweet.get("public_metrics", {}).get("retweet_count", 0) + 
                       tweet.get("public_metrics", {}).get("quote_count", 0),
                comments=tweet.get("public_metrics", {}).get("reply_count", 0)
            )
            
            metrics.engagement_rate = self._calculate_engagement_rate(metrics)
            
            trend = TrendData(
                id=tweet["id"],
                platform=PlatformType.TWITTER,
                content_type=ContentType.POST,
                name=tweet["text"][:100] + "..." if len(tweet["text"]) > 100 else tweet["text"],
                description=tweet["text"],
                url=f"https://twitter.com/i/status/{tweet['id']}",
                metrics=metrics,
                metadata=TrendMetadata(
                    creator_count=1,
                    content_categories=self._extract_categories_from_tweet(tweet["text"])
                ),
                temporal=TemporalData(
                    created_at=datetime.fromisoformat(tweet["created_at"].replace("Z", "+00:00"))
                ),
                text_features=TextFeatures(
                    keywords=self._extract_hashtags(tweet["text"]),
                    language=tweet.get("lang", "en")
                ),
                raw_data={
                    "tweet": tweet,
                    "author": author
                }
            )
            
            trends.append(trend)
        
        return trends
    
    async def _generate_mock_content_data(self, limit: int, category: str) -> List[TrendData]:
        """Generate mock tweet data"""
        mock_tweets = [
            {"text": "The future of AI is here! Exciting developments in machine learning #AI #TechNews", "author": "@techexpert"},
            {"text": "Sustainable living starts with small changes. Every action counts! #Sustainability #ClimateAction", "author": "@ecowarrior"},
            {"text": "Breaking: New breakthrough in renewable energy technology announced #GreenEnergy #Innovation", "author": "@energynews"},
            {"text": "Remote work is transforming how we think about productivity and work-life balance #RemoteWork #FutureOfWork", "author": "@worktrends"},
            {"text": "Cybersecurity threats are evolving. Stay informed, stay protected! #CyberSecurity #InfoSec", "author": "@securitypro"}
        ]
        
        trends = []
        for i, tweet in enumerate(mock_tweets[:limit]):
            base_engagement = 1000 + (i * 500)
            
            metrics = TrendMetrics(
                views=base_engagement * 20,
                likes=base_engagement,
                shares=int(base_engagement * 0.1),
                comments=int(base_engagement * 0.05),
                growth_rate_24h=0.05 + (i * 0.02)
            )
            
            metrics.engagement_rate = self._calculate_engagement_rate(metrics)
            
            trend = TrendData(
                id=f"twitter_tweet_{i+1}",
                platform=PlatformType.TWITTER,
                content_type=ContentType.POST,
                name=tweet["text"][:50] + "...",
                description=tweet["text"],
                url=f"https://twitter.com/status/{i+1}",
                metrics=metrics,
                metadata=TrendMetadata(
                    creator_count=1,
                    content_categories=[category] if category else ["general"]
                ),
                temporal=TemporalData(
                    created_at=datetime.now(timezone.utc) - timedelta(hours=i*2)
                ),
                text_features=TextFeatures(
                    keywords=self._extract_hashtags(tweet["text"]),
                    sentiment=0.3 + (i * 0.1)
                ),
                raw_data={"author": tweet["author"]}
            )
            
            trends.append(trend)
        
        return trends
    
    async def get_content_metrics(self, content_id: str) -> TrendMetrics:
        """Get detailed metrics for specific tweet"""
        if self.bearer_token:
            url = f"{self.base_url}/tweets/{content_id}"
            params = {
                "tweet.fields": "public_metrics,created_at"
            }
            
            try:
                response = await self._make_request(url, params)
                tweet = response.get("data", {})
                
                if tweet:
                    public_metrics = tweet.get("public_metrics", {})
                    return TrendMetrics(
                        views=public_metrics.get("impression_count", 0),
                        likes=public_metrics.get("like_count", 0),
                        shares=public_metrics.get("retweet_count", 0) + public_metrics.get("quote_count", 0),
                        comments=public_metrics.get("reply_count", 0)
                    )
            except Exception as e:
                logger.error(f"Failed to get Twitter metrics for {content_id}: {e}")
        
        # Return mock metrics
        return TrendMetrics(views=10000, likes=500, shares=100, comments=50)
    
    async def search_content(self, query: str, limit: int = 50) -> List[TrendData]:
        """Search for content by query"""
        if self.bearer_token:
            search_url = f"{self.base_url}/tweets/search/recent"
            params = {
                "query": f"{query} -is:retweet",
                "max_results": min(limit, 100),
                "tweet.fields": "public_metrics,created_at"
            }
            
            try:
                response = await self._make_request(search_url, params)
                tweets = response.get("data", [])
                
                trends = []
                for tweet in tweets:
                    metrics = TrendMetrics(
                        views=tweet.get("public_metrics", {}).get("impression_count", 0),
                        likes=tweet.get("public_metrics", {}).get("like_count", 0),
                        shares=tweet.get("public_metrics", {}).get("retweet_count", 0),
                        comments=tweet.get("public_metrics", {}).get("reply_count", 0)
                    )
                    
                    trend = TrendData(
                        id=tweet["id"],
                        platform=PlatformType.TWITTER,
                        content_type=ContentType.POST,
                        name=tweet["text"][:50] + "...",
                        description=tweet["text"],
                        metrics=metrics,
                        temporal=TemporalData(
                            created_at=datetime.fromisoformat(tweet["created_at"].replace("Z", "+00:00"))
                        )
                    )
                    trends.append(trend)
                
                return trends
                
            except Exception as e:
                logger.error(f"Twitter search failed for '{query}': {e}")
        
        # Return mock search results
        return await self._generate_mock_search_results(query, limit)
    
    async def _generate_mock_search_results(self, query: str, limit: int) -> List[TrendData]:
        """Generate mock search results"""
        results = []
        for i in range(min(limit, 10)):
            trend = TrendData(
                id=f"search_{hashlib.md5(f'{query}_{i}'.encode()).hexdigest()[:8]}",
                platform=PlatformType.TWITTER,
                content_type=ContentType.POST,
                name=f"Tweet about {query} - Result {i+1}",
                description=f"This is a tweet about {query} with relevant content...",
                metrics=TrendMetrics(
                    views=5000 + (i * 1000),
                    likes=250 + (i * 50),
                    shares=50 + (i * 10),
                    comments=25 + (i * 5)
                ),
                temporal=TemporalData(
                    created_at=datetime.now(timezone.utc) - timedelta(hours=i+1)
                )
            )
            results.append(trend)
        
        return results
    
    def _categorize_hashtag(self, hashtag: str) -> List[str]:
        """Categorize hashtag based on keywords"""
        hashtag_lower = hashtag.lower()
        
        categories = []
        
        # Technology keywords
        if any(word in hashtag_lower for word in ["tech", "ai", "digital", "cyber", "data", "innovation"]):
            categories.append("technology")
        
        # Environment keywords
        if any(word in hashtag_lower for word in ["climate", "green", "sustain", "eco", "environment"]):
            categories.append("environment")
        
        # Business keywords
        if any(word in hashtag_lower for word in ["business", "startup", "work", "finance", "economy"]):
            categories.append("business")
        
        # Health keywords
        if any(word in hashtag_lower for word in ["health", "wellness", "medical", "fitness"]):
            categories.append("health")
        
        return categories if categories else ["general"]
    
    def _extract_keywords_from_hashtag(self, hashtag: str) -> List[str]:
        """Extract meaningful keywords from hashtag"""
        # Remove # and split camelCase
        clean_hashtag = hashtag[1:] if hashtag.startswith("#") else hashtag
        
        # Split on capital letters (camelCase)
        keywords = re.findall(r'[A-Z][a-z]*|[a-z]+', clean_hashtag)
        
        return [word.lower() for word in keywords if len(word) > 2]
    
    def _extract_categories_from_tweet(self, text: str) -> List[str]:
        """Extract categories from tweet text"""
        hashtags = self._extract_hashtags(text)
        categories = []
        
        for hashtag in hashtags:
            categories.extend(self._categorize_hashtag(hashtag))
        
        return list(set(categories)) if categories else ["general"]
    
    def _get_geographic_spread(self, primary_country: str) -> List[str]:
        """Get likely geographic spread for trending content"""
        base_spread = [primary_country]
        
        # Add related countries based on language/region
        if primary_country == "US":
            base_spread.extend(["CA", "GB", "AU"])
        elif primary_country in ["MX", "ES", "CO", "AR"]:
            base_spread.extend(["ES", "MX", "AR", "CO"])
        
        return base_spread[:4]  # Limit to 4 countries

# Example usage
if __name__ == "__main__":
    async def test_twitter_collector():
        """Test Twitter collector functionality"""
        collector = TwitterCollector()
        
        async with collector:
            # Test hashtag collection
            hashtags = await collector.collect_trending_hashtags(limit=10, country="US")
            print(f"Collected {len(hashtags)} hashtags")
            
            if hashtags:
                sample = hashtags[0]
                print(f"Sample hashtag: {sample.name}")
                print(f"Views: {sample.metrics.views:,}")
                print(f"Engagement rate: {sample.metrics.engagement_rate:.3f}")
                print(f"Categories: {sample.metadata.content_categories}")
            
            # Test content collection
            content = await collector.collect_trending_content(limit=5)
            print(f"\nCollected {len(content)} tweets")
            
            # Test search
            search_results = await collector.search_content("AI technology", limit=3)
            print(f"\nSearch results: {len(search_results)} tweets")
            
            # Test health check
            health = await collector.health_check()
            print(f"\nHealth check: {health}")
    
    # Run test
    asyncio.run(test_twitter_collector())
