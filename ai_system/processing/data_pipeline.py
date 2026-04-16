"""
Data Processing Pipeline for Predix AI System
Handles cleaning, normalization, feature engineering, and aggregation
"""

import asyncio
import pandas as pd
import numpy as np
from typing import Dict, List, Optional, Any, Tuple
from datetime import datetime, timezone, timedelta
import logging
from dataclasses import dataclass, asdict
import json
import re
from collections import defaultdict
import hashlib

# NLP and ML imports
try:
    import nltk
    from textblob import TextBlob
    from sklearn.preprocessing import StandardScaler, MinMaxScaler
    from sklearn.feature_extraction.text import TfidfVectorizer
    import spacy
except ImportError:
    # Fallback for when packages aren't installed
    nltk = None
    TextBlob = None
    StandardScaler = None
    MinMaxScaler = None
    TfidfVectorizer = None
    spacy = None

from ..collectors.base_collector import TrendData, TrendMetrics, PlatformType

logger = logging.getLogger(__name__)

@dataclass
class ProcessedFeatures:
    """Container for processed features ready for ML models"""
    # Basic metrics
    views_normalized: float = 0.0
    likes_normalized: float = 0.0
    shares_normalized: float = 0.0
    comments_normalized: float = 0.0
    engagement_rate: float = 0.0
    
    # Growth metrics
    growth_velocity: float = 0.0
    growth_acceleration: float = 0.0
    momentum_score: float = 0.0
    
    # Virality metrics
    virality_coefficient: float = 0.0
    share_to_view_ratio: float = 0.0
    comment_to_like_ratio: float = 0.0
    
    # Temporal features
    hour_of_day: int = 0
    day_of_week: int = 0
    is_weekend: bool = False
    time_since_creation: float = 0.0
    
    # Content features
    content_quality_score: float = 0.0
    sentiment_score: float = 0.0
    readability_score: float = 0.0
    hashtag_count: int = 0
    mention_count: int = 0
    
    # Network features
    creator_influence_score: float = 0.0
    cross_platform_presence: float = 0.0
    geographic_diversity: float = 0.0
    
    # Platform-specific features
    platform_tiktok: bool = False
    platform_twitter: bool = False
    platform_instagram: bool = False
    platform_youtube: bool = False
    
    # Category features (one-hot encoded)
    category_technology: bool = False
    category_entertainment: bool = False
    category_lifestyle: bool = False
    category_business: bool = False
    category_health: bool = False
    category_environment: bool = False
    
    def to_array(self) -> np.ndarray:
        """Convert to numpy array for ML models"""
        return np.array([
            self.views_normalized, self.likes_normalized, self.shares_normalized,
            self.comments_normalized, self.engagement_rate, self.growth_velocity,
            self.growth_acceleration, self.momentum_score, self.virality_coefficient,
            self.share_to_view_ratio, self.comment_to_like_ratio, self.hour_of_day,
            self.day_of_week, float(self.is_weekend), self.time_since_creation,
            self.content_quality_score, self.sentiment_score, self.readability_score,
            self.hashtag_count, self.mention_count, self.creator_influence_score,
            self.cross_platform_presence, self.geographic_diversity,
            float(self.platform_tiktok), float(self.platform_twitter),
            float(self.platform_instagram), float(self.platform_youtube),
            float(self.category_technology), float(self.category_entertainment),
            float(self.category_lifestyle), float(self.category_business),
            float(self.category_health), float(self.category_environment)
        ])
    
    @classmethod
    def get_feature_names(cls) -> List[str]:
        """Get feature names for model interpretation"""
        return [
            'views_normalized', 'likes_normalized', 'shares_normalized',
            'comments_normalized', 'engagement_rate', 'growth_velocity',
            'growth_acceleration', 'momentum_score', 'virality_coefficient',
            'share_to_view_ratio', 'comment_to_like_ratio', 'hour_of_day',
            'day_of_week', 'is_weekend', 'time_since_creation',
            'content_quality_score', 'sentiment_score', 'readability_score',
            'hashtag_count', 'mention_count', 'creator_influence_score',
            'cross_platform_presence', 'geographic_diversity',
            'platform_tiktok', 'platform_twitter', 'platform_instagram',
            'platform_youtube', 'category_technology', 'category_entertainment',
            'category_lifestyle', 'category_business', 'category_health',
            'category_environment'
        ]

class DataProcessor:
    """Main data processing pipeline"""
    
    def __init__(self):
        self.scalers = {
            'views': MinMaxScaler() if MinMaxScaler else None,
            'likes': MinMaxScaler() if MinMaxScaler else None,
            'shares': MinMaxScaler() if MinMaxScaler else None,
            'comments': MinMaxScaler() if MinMaxScaler else None
        }
        
        self.tfidf_vectorizer = TfidfVectorizer(
            max_features=1000,
            stop_words='english',
            ngram_range=(1, 2)
        ) if TfidfVectorizer else None
        
        # Load NLP model if available
        self.nlp_model = None
        if spacy:
            try:
                self.nlp_model = spacy.load("en_core_web_sm")
            except OSError:
                logger.warning("spaCy model not found, using fallback NLP processing")
        
        # Historical data for normalization
        self.historical_stats = {
            'views': {'mean': 500000, 'std': 1000000, 'max': 10000000},
            'likes': {'mean': 25000, 'std': 50000, 'max': 500000},
            'shares': {'mean': 5000, 'std': 10000, 'max': 100000},
            'comments': {'mean': 3000, 'std': 6000, 'max': 60000}
        }
        
        # Category mappings
        self.category_keywords = {
            'technology': ['tech', 'ai', 'digital', 'innovation', 'software', 'data', 'cyber'],
            'entertainment': ['music', 'movie', 'game', 'fun', 'comedy', 'dance', 'viral'],
            'lifestyle': ['life', 'style', 'fashion', 'travel', 'food', 'home', 'beauty'],
            'business': ['business', 'startup', 'entrepreneur', 'finance', 'money', 'work'],
            'health': ['health', 'fitness', 'wellness', 'medical', 'nutrition', 'mental'],
            'environment': ['climate', 'green', 'eco', 'sustainable', 'environment', 'nature']
        }
    
    async def process_batch(self, trends: List[TrendData]) -> List[ProcessedFeatures]:
        """Process a batch of trend data"""
        if not trends:
            return []
        
        logger.info(f"Processing batch of {len(trends)} trends")
        
        # Convert to DataFrame for easier processing
        df = self._trends_to_dataframe(trends)
        
        # Clean and normalize data
        df_clean = await self._clean_data(df)
        
        # Engineer features
        df_features = await self._engineer_features(df_clean)
        
        # Normalize numerical features
        df_normalized = await self._normalize_features(df_features)
        
        # Convert back to ProcessedFeatures objects
        processed_features = self._dataframe_to_features(df_normalized)
        
        logger.info(f"Successfully processed {len(processed_features)} trend features")
        return processed_features
    
    def _trends_to_dataframe(self, trends: List[TrendData]) -> pd.DataFrame:
        """Convert TrendData objects to pandas DataFrame"""
        data = []
        
        for trend in trends:
            row = {
                'id': trend.id,
                'platform': trend.platform.value,
                'content_type': trend.content_type.value,
                'name': trend.name,
                'description': trend.description,
                
                # Metrics
                'views': trend.metrics.views if trend.metrics else 0,
                'likes': trend.metrics.likes if trend.metrics else 0,
                'shares': trend.metrics.shares if trend.metrics else 0,
                'comments': trend.metrics.comments if trend.metrics else 0,
                'engagement_rate': trend.metrics.engagement_rate if trend.metrics else 0,
                'growth_rate_24h': trend.metrics.growth_rate_24h if trend.metrics else 0,
                'growth_rate_7d': trend.metrics.growth_rate_7d if trend.metrics else 0,
                
                # Temporal
                'created_at': trend.temporal.created_at if trend.temporal else datetime.now(timezone.utc),
                'first_viral_spike': trend.temporal.first_viral_spike if trend.temporal else None,
                'peak_time': trend.temporal.peak_time if trend.temporal else None,
                
                # Metadata
                'creator_count': trend.metadata.creator_count if trend.metadata else 0,
                'geographic_spread': len(trend.metadata.geographic_spread) if trend.metadata and trend.metadata.geographic_spread else 0,
                'content_categories': trend.metadata.content_categories if trend.metadata and trend.metadata.content_categories else [],
                'language': trend.metadata.language if trend.metadata else 'unknown',
                
                # Text features
                'sentiment': trend.text_features.sentiment if trend.text_features else 0,
                'keywords': trend.text_features.keywords if trend.text_features and trend.text_features.keywords else [],
                'readability_score': trend.text_features.readability_score if trend.text_features else 0,
                
                # Raw data
                'raw_data': trend.raw_data if trend.raw_data else {}
            }
            data.append(row)
        
        return pd.DataFrame(data)
    
    async def _clean_data(self, df: pd.DataFrame) -> pd.DataFrame:
        """Clean and validate data"""
        logger.info("Cleaning data...")
        
        # Remove duplicates based on ID
        df = df.drop_duplicates(subset=['id'])
        
        # Fill missing numerical values
        numerical_cols = ['views', 'likes', 'shares', 'comments', 'engagement_rate', 
                         'growth_rate_24h', 'growth_rate_7d', 'creator_count', 
                         'geographic_spread', 'sentiment', 'readability_score']
        
        for col in numerical_cols:
            if col in df.columns:
                df[col] = df[col].fillna(0)
                # Remove negative values (shouldn't happen but safety check)
                df[col] = df[col].clip(lower=0)
        
        # Clean text fields
        if 'name' in df.columns:
            df['name'] = df['name'].fillna('').astype(str)
        if 'description' in df.columns:
            df['description'] = df['description'].fillna('').astype(str)
        
        # Validate engagement rate
        if 'engagement_rate' in df.columns:
            df['engagement_rate'] = df['engagement_rate'].clip(upper=1.0)  # Cap at 100%
        
        # Remove outliers (values beyond 3 standard deviations)
        for col in ['views', 'likes', 'shares', 'comments']:
            if col in df.columns:
                mean_val = df[col].mean()
                std_val = df[col].std()
                df[col] = df[col].clip(upper=mean_val + 3 * std_val)
        
        logger.info(f"Data cleaned. Remaining records: {len(df)}")
        return df
    
    async def _engineer_features(self, df: pd.DataFrame) -> pd.DataFrame:
        """Engineer new features from raw data"""
        logger.info("Engineering features...")
        
        # Growth and momentum features
        df['growth_velocity'] = df['growth_rate_24h']
        df['growth_acceleration'] = df['growth_rate_7d'] - df['growth_rate_24h']
        df['momentum_score'] = (df['growth_rate_24h'] * 0.7 + df['growth_rate_7d'] * 0.3).clip(0, 5)
        
        # Virality features
        df['virality_coefficient'] = np.where(
            df['views'] > 0, 
            df['shares'] / df['views'], 
            0
        )
        df['share_to_view_ratio'] = df['virality_coefficient']
        df['comment_to_like_ratio'] = np.where(
            df['likes'] > 0,
            df['comments'] / df['likes'],
            0
        )
        
        # Temporal features
        df['hour_of_day'] = df['created_at'].dt.hour
        df['day_of_week'] = df['created_at'].dt.dayofweek
        df['is_weekend'] = df['day_of_week'].isin([5, 6])  # Saturday, Sunday
        
        # Time since creation (in hours)
        now = datetime.now(timezone.utc)
        df['time_since_creation'] = (now - df['created_at']).dt.total_seconds() / 3600
        
        # Content quality features
        df['content_quality_score'] = await self._calculate_content_quality(df)
        df['sentiment_score'] = df['sentiment']  # Already calculated
        
        # Text analysis features
        df['hashtag_count'] = df.apply(lambda row: len(self._extract_hashtags(row.get('description', ''))), axis=1)
        df['mention_count'] = df.apply(lambda row: len(self._extract_mentions(row.get('description', ''))), axis=1)
        
        # Network features
        df['creator_influence_score'] = await self._calculate_creator_influence(df)
        df['cross_platform_presence'] = await self._calculate_cross_platform_presence(df)
        df['geographic_diversity'] = df['geographic_spread'] / 10  # Normalize to 0-1 scale
        
        # Platform one-hot encoding
        df['platform_tiktok'] = df['platform'] == 'tiktok'
        df['platform_twitter'] = df['platform'] == 'twitter'
        df['platform_instagram'] = df['platform'] == 'instagram'
        df['platform_youtube'] = df['platform'] == 'youtube'
        
        # Category features
        df = await self._add_category_features(df)
        
        logger.info("Feature engineering completed")
        return df
    
    async def _calculate_content_quality(self, df: pd.DataFrame) -> pd.Series:
        """Calculate content quality score based on multiple factors"""
        quality_scores = []
        
        for _, row in df.iterrows():
            score = 0.5  # Base score
            
            # Readability contributes to quality
            if 'readability_score' in row and pd.notna(row['readability_score']):
                score += row['readability_score'] * 0.3
            
            # Engagement rate indicates quality
            if 'engagement_rate' in row and pd.notna(row['engagement_rate']):
                score += min(row['engagement_rate'] * 2, 0.3)  # Cap contribution
            
            # Sentiment (positive content tends to be higher quality)
            if 'sentiment' in row and pd.notna(row['sentiment']):
                score += max(row['sentiment'], 0) * 0.2
            
            # Clip to 0-1 range
            score = max(0, min(score, 1))
            quality_scores.append(score)
        
        return pd.Series(quality_scores, index=df.index)
    
    async def _calculate_creator_influence(self, df: pd.DataFrame) -> pd.Series:
        """Calculate creator influence score"""
        influence_scores = []
        
        for _, row in df.iterrows():
            # Base influence from creator count
            creator_count = row.get('creator_count', 0)
            
            # Normalize creator count (log scale for better distribution)
            if creator_count > 0:
                influence = min(np.log10(creator_count + 1) / 6, 1.0)  # Log scale, cap at 1
            else:
                influence = 0.1  # Minimum influence
            
            # Boost for high engagement
            if row.get('engagement_rate', 0) > 0.1:  # High engagement
                influence *= 1.2
            
            influence_scores.append(min(influence, 1.0))
        
        return pd.Series(influence_scores, index=df.index)
    
    async def _calculate_cross_platform_presence(self, df: pd.DataFrame) -> pd.Series:
        """Calculate cross-platform presence score"""
        # This would normally check if content appears across platforms
        # For now, we'll use a simplified heuristic
        
        presence_scores = []
        
        for _, row in df.iterrows():
            # Base score from hashtag usage (indicates cross-platform potential)
            hashtag_count = len(self._extract_hashtags(row.get('description', '')))
            
            # More hashtags = higher cross-platform potential
            presence = min(hashtag_count / 10, 0.8)  # Normalize, cap at 0.8
            
            # Boost for viral content
            if row.get('virality_coefficient', 0) > 0.01:
                presence += 0.2
            
            presence_scores.append(min(presence, 1.0))
        
        return pd.Series(presence_scores, index=df.index)
    
    async def _add_category_features(self, df: pd.DataFrame) -> pd.DataFrame:
        """Add category-based features"""
        # Initialize category columns
        for category in self.category_keywords.keys():
            df[f'category_{category}'] = False
        
        for idx, row in df.iterrows():
            categories = row.get('content_categories', [])
            text_content = (row.get('name', '') + ' ' + row.get('description', '')).lower()
            
            # Check explicit categories
            for category in categories:
                if category in self.category_keywords:
                    df.at[idx, f'category_{category}'] = True
            
            # Check keywords in content
            for category, keywords in self.category_keywords.items():
                if any(keyword in text_content for keyword in keywords):
                    df.at[idx, f'category_{category}'] = True
        
        return df
    
    async def _normalize_features(self, df: pd.DataFrame) -> pd.DataFrame:
        """Normalize numerical features"""
        logger.info("Normalizing features...")
        
        # Normalize basic metrics using historical stats
        for metric in ['views', 'likes', 'shares', 'comments']:
            if metric in df.columns:
                stats = self.historical_stats[metric]
                df[f'{metric}_normalized'] = (df[metric] - stats['mean']) / stats['std']
                df[f'{metric}_normalized'] = df[f'{metric}_normalized'].clip(-3, 3)  # Clip outliers
        
        # Normalize other continuous features to 0-1 scale
        continuous_features = [
            'growth_velocity', 'growth_acceleration', 'momentum_score',
            'virality_coefficient', 'share_to_view_ratio', 'comment_to_like_ratio',
            'time_since_creation', 'content_quality_score', 'sentiment_score',
            'creator_influence_score', 'cross_platform_presence', 'geographic_diversity'
        ]
        
        for feature in continuous_features:
            if feature in df.columns:
                min_val = df[feature].min()
                max_val = df[feature].max()
                
                if max_val > min_val:
                    df[feature] = (df[feature] - min_val) / (max_val - min_val)
                else:
                    df[feature] = 0.5  # Default middle value if no variance
        
        logger.info("Feature normalization completed")
        return df
    
    def _dataframe_to_features(self, df: pd.DataFrame) -> List[ProcessedFeatures]:
        """Convert DataFrame back to ProcessedFeatures objects"""
        features_list = []
        
        for _, row in df.iterrows():
            features = ProcessedFeatures(
                # Normalized metrics
                views_normalized=row.get('views_normalized', 0),
                likes_normalized=row.get('likes_normalized', 0),
                shares_normalized=row.get('shares_normalized', 0),
                comments_normalized=row.get('comments_normalized', 0),
                engagement_rate=row.get('engagement_rate', 0),
                
                # Growth metrics
                growth_velocity=row.get('growth_velocity', 0),
                growth_acceleration=row.get('growth_acceleration', 0),
                momentum_score=row.get('momentum_score', 0),
                
                # Virality metrics
                virality_coefficient=row.get('virality_coefficient', 0),
                share_to_view_ratio=row.get('share_to_view_ratio', 0),
                comment_to_like_ratio=row.get('comment_to_like_ratio', 0),
                
                # Temporal features
                hour_of_day=int(row.get('hour_of_day', 12)),
                day_of_week=int(row.get('day_of_week', 1)),
                is_weekend=bool(row.get('is_weekend', False)),
                time_since_creation=row.get('time_since_creation', 0),
                
                # Content features
                content_quality_score=row.get('content_quality_score', 0.5),
                sentiment_score=row.get('sentiment_score', 0),
                readability_score=row.get('readability_score', 0.5),
                hashtag_count=int(row.get('hashtag_count', 0)),
                mention_count=int(row.get('mention_count', 0)),
                
                # Network features
                creator_influence_score=row.get('creator_influence_score', 0),
                cross_platform_presence=row.get('cross_platform_presence', 0),
                geographic_diversity=row.get('geographic_diversity', 0),
                
                # Platform features
                platform_tiktok=bool(row.get('platform_tiktok', False)),
                platform_twitter=bool(row.get('platform_twitter', False)),
                platform_instagram=bool(row.get('platform_instagram', False)),
                platform_youtube=bool(row.get('platform_youtube', False)),
                
                # Category features
                category_technology=bool(row.get('category_technology', False)),
                category_entertainment=bool(row.get('category_entertainment', False)),
                category_lifestyle=bool(row.get('category_lifestyle', False)),
                category_business=bool(row.get('category_business', False)),
                category_health=bool(row.get('category_health', False)),
                category_environment=bool(row.get('category_environment', False))
            )
            
            features_list.append(features)
        
        return features_list
    
    def _extract_hashtags(self, text: str) -> List[str]:
        """Extract hashtags from text"""
        if not text:
            return []
        
        hashtag_pattern = r'#\w+'
        return re.findall(hashtag_pattern, text.lower())
    
    def _extract_mentions(self, text: str) -> List[str]:
        """Extract mentions from text"""
        if not text:
            return []
        
        mention_pattern = r'@\w+'
        return re.findall(mention_pattern, text.lower())
    
    async def get_processing_stats(self) -> Dict[str, Any]:
        """Get processing pipeline statistics"""
        return {
            "pipeline_version": "1.0",
            "feature_count": len(ProcessedFeatures.get_feature_names()),
            "supported_platforms": ["tiktok", "twitter", "instagram", "youtube"],
            "supported_categories": list(self.category_keywords.keys()),
            "normalization_stats": self.historical_stats,
            "nlp_model_available": self.nlp_model is not None,
            "sklearn_available": StandardScaler is not None
        }

# Utility functions for batch processing
class BatchProcessor:
    """Handles batch processing of large datasets"""
    
    def __init__(self, batch_size: int = 1000):
        self.batch_size = batch_size
        self.processor = DataProcessor()
    
    async def process_large_dataset(self, trends: List[TrendData]) -> List[ProcessedFeatures]:
        """Process large dataset in batches"""
        all_features = []
        
        for i in range(0, len(trends), self.batch_size):
            batch = trends[i:i + self.batch_size]
            logger.info(f"Processing batch {i//self.batch_size + 1}/{(len(trends)-1)//self.batch_size + 1}")
            
            batch_features = await self.processor.process_batch(batch)
            all_features.extend(batch_features)
            
            # Small delay to prevent overwhelming the system
            await asyncio.sleep(0.1)
        
        return all_features

# Example usage
if __name__ == "__main__":
    async def test_data_processing():
        """Test data processing pipeline"""
        from ..collectors.base_collector import TrendData, TrendMetrics, PlatformType, ContentType
        from datetime import datetime, timezone
        
        # Create sample trend data
        sample_trends = [
            TrendData(
                id="test_1",
                platform=PlatformType.TIKTOK,
                content_type=ContentType.HASHTAG,
                name="#TechInnovation",
                description="Amazing tech innovation happening right now! #tech #innovation #future",
                metrics=TrendMetrics(
                    views=1000000,
                    likes=50000,
                    shares=10000,
                    comments=5000,
                    engagement_rate=0.065,
                    growth_rate_24h=0.25,
                    growth_rate_7d=0.45
                )
            ),
            TrendData(
                id="test_2", 
                platform=PlatformType.TWITTER,
                content_type=ContentType.POST,
                name="Climate change discussion",
                description="Important discussion about climate action #climate #environment #sustainability",
                metrics=TrendMetrics(
                    views=500000,
                    likes=25000,
                    shares=8000,
                    comments=3000,
                    engagement_rate=0.072,
                    growth_rate_24h=0.15,
                    growth_rate_7d=0.30
                )
            )
        ]
        
        # Process the data
        processor = DataProcessor()
        processed_features = await processor.process_batch(sample_trends)
        
        print(f"Processed {len(processed_features)} trends")
        
        if processed_features:
            sample_features = processed_features[0]
            print(f"Sample features array shape: {sample_features.to_array().shape}")
            print(f"Feature names: {ProcessedFeatures.get_feature_names()[:5]}...")
            print(f"Sample values: {sample_features.to_array()[:5]}")
        
        # Get processing stats
        stats = await processor.get_processing_stats()
        print(f"Processing stats: {stats}")
    
    # Run test
    asyncio.run(test_data_processing())
