"""
Seed Data Script
Loads initial data for plans and demo content
Run with: python backend/scripts/seed_data.py
"""
import sys
import os

# Add backend to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from database import SessionLocal
from database.models import Plan
from sqlalchemy.exc import IntegrityError
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def seed_plans():
    """Seed initial pricing plans"""
    db = SessionLocal()
    
    try:
        plans_data = [
            {
                "name": "Free",
                "description": "Perfect for getting started with AI predictions",
                "price": 0.00,
                "currency": "USD",
                "interval": "monthly",
                "features": {
                    "predictions_per_month": 100,
                    "real_time_alerts": False,
                    "advanced_analytics": False,
                    "api_access": False,
                    "priority_support": False,
                    "custom_integration": False,
                    "posts_per_month": 10,
                    "scheduled_posts": False
                },
                "is_active": True
            },
            {
                "name": "Pro",
                "description": "For serious content creators and influencers",
                "price": 39.00,
                "currency": "USD",
                "interval": "monthly",
                "features": {
                    "predictions_per_month": 1000,
                    "real_time_alerts": True,
                    "advanced_analytics": True,
                    "api_access": True,
                    "priority_support": False,
                    "custom_integration": False,
                    "posts_per_month": 100,
                    "scheduled_posts": True,
                    "batch_predictions": True
                },
                "is_active": True
            },
            {
                "name": "Enterprise",
                "description": "Custom solution for teams and agencies",
                "price": 199.00,
                "currency": "USD",
                "interval": "monthly",
                "features": {
                    "predictions_per_month": -1,  # Unlimited
                    "real_time_alerts": True,
                    "advanced_analytics": True,
                    "api_access": True,
                    "priority_support": True,
                    "custom_integration": True,
                    "posts_per_month": -1,  # Unlimited
                    "scheduled_posts": True,
                    "batch_predictions": True,
                    "white_label": True,
                    "dedicated_account_manager": True
                },
                "is_active": True
            }
        ]
        
        created_count = 0
        for plan_data in plans_data:
            #Check if plan already exists
            existing = db.query(Plan).filter(Plan.name == plan_data["name"]).first()
            
            if existing:
                logger.info(f"Plan '{plan_data['name']}' already exists, skipping")
                continue
            
            plan = Plan(**plan_data)
            db.add(plan)
            created_count += 1
            logger.info(f"Created plan: {plan_data['name']}")
        
        db.commit()
        logger.info(f"Successfully seeded {created_count} plans")
        
    except IntegrityError as e:
        db.rollback()
        logger.error(f"Error seeding plans: {e}")
    except Exception as e:
        db.rollback()
        logger.error(f"Unexpected error: {e}")
    finally:
        db.close()


def seed_demo_data():
    """Seed demo/sample data for testing"""
    # TODO: Add demo users, posts, trends if needed
    pass


if __name__ == "__main__":
    logger.info("Starting database seeding...")
    
    # Seed plans
    seed_plans()
    
    # Seed demo data if needed
    # seed_demo_data()
    
    logger.info("Database seeding completed!")
