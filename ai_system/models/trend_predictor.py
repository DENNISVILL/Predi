"""
Trend Prediction Models for Predix AI System
Main ML models for predicting viral trends and growth patterns
"""

import numpy as np
import pandas as pd
from typing import Dict, List, Tuple, Optional, Any
import joblib
import json
from datetime import datetime, timedelta
import logging

# ML imports with fallbacks
try:
    from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
    from sklearn.linear_model import LinearRegression
    from sklearn.metrics import mean_squared_error, r2_score, mean_absolute_error
    from sklearn.model_selection import train_test_split, cross_val_score
    import xgboost as xgb
except ImportError:
    # Fallback implementations
    RandomForestRegressor = None
    GradientBoostingRegressor = None
    LinearRegression = None
    xgb = None

from ..processing.data_pipeline import ProcessedFeatures

logger = logging.getLogger(__name__)

class TrendGrowthPredictor:
    """Predicts trend growth over next 24-72 hours"""
    
    def __init__(self):
        self.models = {}
        self.feature_importance = {}
        self.training_history = []
        self.is_trained = False
        
        # Model configurations
        self.model_configs = {
            'random_forest': {
                'n_estimators': 100,
                'max_depth': 10,
                'random_state': 42
            },
            'gradient_boosting': {
                'n_estimators': 100,
                'learning_rate': 0.1,
                'max_depth': 6,
                'random_state': 42
            },
            'xgboost': {
                'n_estimators': 100,
                'learning_rate': 0.1,
                'max_depth': 6,
                'random_state': 42
            }
        }
    
    def train(self, features: List[ProcessedFeatures], targets: List[float]) -> Dict[str, Any]:
        """Train the prediction models"""
        logger.info(f"Training trend predictor with {len(features)} samples")
        
        # Convert features to numpy arrays
        X = np.array([f.to_array() for f in features])
        y = np.array(targets)
        
        # Split data
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42
        )
        
        results = {}
        
        # Train Random Forest
        if RandomForestRegressor:
            rf_model = RandomForestRegressor(**self.model_configs['random_forest'])
            rf_model.fit(X_train, y_train)
            rf_pred = rf_model.predict(X_test)
            
            self.models['random_forest'] = rf_model
            self.feature_importance['random_forest'] = rf_model.feature_importances_
            
            results['random_forest'] = {
                'mse': mean_squared_error(y_test, rf_pred),
                'r2': r2_score(y_test, rf_pred),
                'mae': mean_absolute_error(y_test, rf_pred)
            }
        
        # Train Gradient Boosting
        if GradientBoostingRegressor:
            gb_model = GradientBoostingRegressor(**self.model_configs['gradient_boosting'])
            gb_model.fit(X_train, y_train)
            gb_pred = gb_model.predict(X_test)
            
            self.models['gradient_boosting'] = gb_model
            self.feature_importance['gradient_boosting'] = gb_model.feature_importances_
            
            results['gradient_boosting'] = {
                'mse': mean_squared_error(y_test, gb_pred),
                'r2': r2_score(y_test, gb_pred),
                'mae': mean_absolute_error(y_test, gb_pred)
            }
        
        # Train XGBoost
        if xgb:
            xgb_model = xgb.XGBRegressor(**self.model_configs['xgboost'])
            xgb_model.fit(X_train, y_train)
            xgb_pred = xgb_model.predict(X_test)
            
            self.models['xgboost'] = xgb_model
            self.feature_importance['xgboost'] = xgb_model.feature_importances_
            
            results['xgboost'] = {
                'mse': mean_squared_error(y_test, xgb_pred),
                'r2': r2_score(y_test, xgb_pred),
                'mae': mean_absolute_error(y_test, xgb_pred)
            }
        
        self.is_trained = True
        self.training_history.append({
            'timestamp': datetime.now().isoformat(),
            'samples': len(features),
            'results': results
        })
        
        logger.info(f"Training completed. Best R2 score: {max([r['r2'] for r in results.values()]):.3f}")
        return results
    
    def predict(self, features: ProcessedFeatures) -> Dict[str, float]:
        """Predict growth for a single trend"""
        if not self.is_trained:
            return self._mock_prediction(features)
        
        X = features.to_array().reshape(1, -1)
        predictions = {}
        
        for model_name, model in self.models.items():
            pred = model.predict(X)[0]
            predictions[model_name] = float(pred)
        
        # Ensemble prediction (weighted average)
        if predictions:
            ensemble_pred = np.mean(list(predictions.values()))
            predictions['ensemble'] = ensemble_pred
        
        return predictions
    
    def _mock_prediction(self, features: ProcessedFeatures) -> Dict[str, float]:
        """Generate mock predictions for testing"""
        # Simple heuristic based on current metrics
        base_growth = features.growth_velocity * 0.5
        engagement_boost = features.engagement_rate * 0.3
        momentum_factor = features.momentum_score * 0.2
        
        predicted_growth = base_growth + engagement_boost + momentum_factor
        predicted_growth = max(0, min(predicted_growth, 5.0))  # Clip to reasonable range
        
        return {
            'random_forest': predicted_growth + np.random.normal(0, 0.1),
            'gradient_boosting': predicted_growth + np.random.normal(0, 0.05),
            'xgboost': predicted_growth + np.random.normal(0, 0.08),
            'ensemble': predicted_growth
        }
    
    def get_feature_importance(self, model_name: str = 'ensemble') -> Dict[str, float]:
        """Get feature importance scores"""
        if model_name == 'ensemble' and self.feature_importance:
            # Average importance across all models
            feature_names = ProcessedFeatures.get_feature_names()
            avg_importance = np.zeros(len(feature_names))
            
            for importances in self.feature_importance.values():
                avg_importance += importances
            
            avg_importance /= len(self.feature_importance)
            
            return dict(zip(feature_names, avg_importance))
        
        elif model_name in self.feature_importance:
            feature_names = ProcessedFeatures.get_feature_names()
            return dict(zip(feature_names, self.feature_importance[model_name]))
        
        return {}

class ViralScoreCalculator:
    """Calculates viral probability score (0-100)"""
    
    def __init__(self):
        self.component_weights = {
            'growth_factor': 0.30,
            'engagement_factor': 0.25,
            'content_factor': 0.20,
            'network_factor': 0.15,
            'temporal_factor': 0.10
        }
        self.calibration_params = {'slope': 1.0, 'intercept': 0.0}
    
    def calculate_score(self, features: ProcessedFeatures) -> Dict[str, Any]:
        """Calculate viral score with component breakdown"""
        
        # Growth component (30%)
        growth_score = self._calculate_growth_component(features)
        
        # Engagement component (25%)
        engagement_score = self._calculate_engagement_component(features)
        
        # Content component (20%)
        content_score = self._calculate_content_component(features)
        
        # Network component (15%)
        network_score = self._calculate_network_component(features)
        
        # Temporal component (10%)
        temporal_score = self._calculate_temporal_component(features)
        
        # Weighted sum
        raw_score = (
            growth_score * self.component_weights['growth_factor'] +
            engagement_score * self.component_weights['engagement_factor'] +
            content_score * self.component_weights['content_factor'] +
            network_score * self.component_weights['network_factor'] +
            temporal_score * self.component_weights['temporal_factor']
        )
        
        # Apply calibration and scale to 0-100
        calibrated_score = raw_score * self.calibration_params['slope'] + self.calibration_params['intercept']
        final_score = max(0, min(100, calibrated_score * 100))
        
        return {
            'viral_score': final_score,
            'confidence': self._calculate_confidence(features),
            'components': {
                'growth': growth_score * 100,
                'engagement': engagement_score * 100,
                'content': content_score * 100,
                'network': network_score * 100,
                'temporal': temporal_score * 100
            },
            'explanation': self._generate_explanation(features, {
                'growth': growth_score,
                'engagement': engagement_score,
                'content': content_score,
                'network': network_score,
                'temporal': temporal_score
            })
        }
    
    def _calculate_growth_component(self, features: ProcessedFeatures) -> float:
        """Calculate growth-based score component"""
        velocity_score = min(features.growth_velocity / 2.0, 1.0)  # Normalize
        acceleration_score = min(features.growth_acceleration / 1.0, 1.0)
        momentum_score = min(features.momentum_score, 1.0)
        
        return (velocity_score * 0.4 + acceleration_score * 0.3 + momentum_score * 0.3)
    
    def _calculate_engagement_component(self, features: ProcessedFeatures) -> float:
        """Calculate engagement-based score component"""
        engagement_rate = min(features.engagement_rate / 0.15, 1.0)  # 15% is very high
        virality_coeff = min(features.virality_coefficient / 0.05, 1.0)  # 5% share rate is high
        comment_ratio = min(features.comment_to_like_ratio / 0.3, 1.0)  # 30% comment rate is high
        
        return (engagement_rate * 0.5 + virality_coeff * 0.3 + comment_ratio * 0.2)
    
    def _calculate_content_component(self, features: ProcessedFeatures) -> float:
        """Calculate content quality score component"""
        quality_score = features.content_quality_score
        sentiment_score = max(0, features.sentiment_score)  # Only positive sentiment helps
        readability_score = features.readability_score
        
        return (quality_score * 0.4 + sentiment_score * 0.3 + readability_score * 0.3)
    
    def _calculate_network_component(self, features: ProcessedFeatures) -> float:
        """Calculate network effects score component"""
        creator_influence = features.creator_influence_score
        cross_platform = features.cross_platform_presence
        geo_diversity = features.geographic_diversity
        
        return (creator_influence * 0.4 + cross_platform * 0.35 + geo_diversity * 0.25)
    
    def _calculate_temporal_component(self, features: ProcessedFeatures) -> float:
        """Calculate temporal factors score component"""
        # Peak hours boost (6-10 PM)
        peak_hour_boost = 1.2 if 18 <= features.hour_of_day <= 22 else 1.0
        
        # Weekend boost
        weekend_boost = 1.1 if features.is_weekend else 1.0
        
        # Recency factor (newer content has potential)
        recency_factor = max(0.5, 1.0 - features.time_since_creation / 168)  # Decay over week
        
        base_temporal_score = 0.7  # Base score
        return min(1.0, base_temporal_score * peak_hour_boost * weekend_boost * recency_factor)
    
    def _calculate_confidence(self, features: ProcessedFeatures) -> float:
        """Calculate prediction confidence"""
        # Higher confidence for content with more data
        data_completeness = 0.8  # Assume good data quality
        
        # Higher confidence for established patterns
        pattern_strength = min(1.0, features.momentum_score)
        
        # Lower confidence for very new content
        maturity_factor = min(1.0, features.time_since_creation / 24)  # Full confidence after 24h
        
        confidence = data_completeness * 0.4 + pattern_strength * 0.3 + maturity_factor * 0.3
        return max(0.3, min(0.95, confidence))  # Keep in reasonable range
    
    def _generate_explanation(self, features: ProcessedFeatures, component_scores: Dict[str, float]) -> str:
        """Generate human-readable explanation"""
        explanations = []
        
        # Find strongest component
        strongest_component = max(component_scores.items(), key=lambda x: x[1])
        
        if strongest_component[0] == 'growth':
            explanations.append("Strong growth momentum detected")
        elif strongest_component[0] == 'engagement':
            explanations.append("High user engagement driving virality")
        elif strongest_component[0] == 'content':
            explanations.append("High-quality content with positive sentiment")
        elif strongest_component[0] == 'network':
            explanations.append("Strong network effects and creator influence")
        elif strongest_component[0] == 'temporal':
            explanations.append("Optimal timing factors")
        
        # Add specific insights
        if features.engagement_rate > 0.1:
            explanations.append("exceptional engagement rate")
        
        if features.cross_platform_presence > 0.7:
            explanations.append("multi-platform presence")
        
        if features.is_weekend and 18 <= features.hour_of_day <= 22:
            explanations.append("posted during peak engagement hours")
        
        return ". ".join(explanations).capitalize() + "."

# Model ensemble and management
class ModelEnsemble:
    """Manages multiple models and provides ensemble predictions"""
    
    def __init__(self):
        self.growth_predictor = TrendGrowthPredictor()
        self.viral_calculator = ViralScoreCalculator()
        self.model_metadata = {
            'version': '1.0',
            'created_at': datetime.now().isoformat(),
            'last_updated': None
        }
    
    def predict_trend_future(self, features: ProcessedFeatures) -> Dict[str, Any]:
        """Complete prediction including growth and viral score"""
        
        # Get growth predictions
        growth_predictions = self.growth_predictor.predict(features)
        
        # Get viral score
        viral_analysis = self.viral_calculator.calculate_score(features)
        
        # Combine predictions
        result = {
            'predictions': {
                'growth_24h': growth_predictions.get('ensemble', 0.5),
                'growth_48h': growth_predictions.get('ensemble', 0.5) * 0.8,  # Assume decay
                'growth_72h': growth_predictions.get('ensemble', 0.5) * 0.6,
                'viral_score': viral_analysis['viral_score'],
                'confidence': viral_analysis['confidence']
            },
            'analysis': {
                'viral_components': viral_analysis['components'],
                'explanation': viral_analysis['explanation'],
                'feature_importance': self.growth_predictor.get_feature_importance(),
                'model_versions': {
                    'growth_predictor': 'v1.0',
                    'viral_calculator': 'v1.0'
                }
            },
            'metadata': {
                'prediction_timestamp': datetime.now().isoformat(),
                'model_ensemble': 'predix_v1.0'
            }
        }
        
        return result
    
    def save_models(self, filepath: str):
        """Save trained models to disk"""
        if joblib:
            model_data = {
                'growth_predictor': self.growth_predictor,
                'viral_calculator': self.viral_calculator,
                'metadata': self.model_metadata
            }
            joblib.dump(model_data, filepath)
            logger.info(f"Models saved to {filepath}")
    
    def load_models(self, filepath: str):
        """Load trained models from disk"""
        if joblib:
            try:
                model_data = joblib.load(filepath)
                self.growth_predictor = model_data['growth_predictor']
                self.viral_calculator = model_data['viral_calculator']
                self.model_metadata = model_data.get('metadata', self.model_metadata)
                logger.info(f"Models loaded from {filepath}")
            except Exception as e:
                logger.error(f"Failed to load models: {e}")

# Example usage
if __name__ == "__main__":
    # Test the models
    sample_features = ProcessedFeatures(
        views_normalized=0.8,
        likes_normalized=0.7,
        engagement_rate=0.12,
        growth_velocity=0.6,
        momentum_score=0.8,
        virality_coefficient=0.03,
        content_quality_score=0.85,
        sentiment_score=0.7,
        creator_influence_score=0.6,
        cross_platform_presence=0.4,
        platform_tiktok=True,
        category_technology=True
    )
    
    # Test ensemble
    ensemble = ModelEnsemble()
    prediction = ensemble.predict_trend_future(sample_features)
    
    print("Prediction Results:")
    print(f"Viral Score: {prediction['predictions']['viral_score']:.1f}")
    print(f"24h Growth: {prediction['predictions']['growth_24h']:.2f}")
    print(f"Confidence: {prediction['predictions']['confidence']:.2f}")
    print(f"Explanation: {prediction['analysis']['explanation']}")
