"""
Payment Service for Predix Backend
Integration with Paymentez for Ecuador and Latin America
"""

import hashlib
import hmac
import base64
import json
import aiohttp
import logging
from datetime import datetime, timezone, timedelta
from typing import Dict, List, Optional, Any
from sqlalchemy.orm import Session

from config.settings import settings, PaymentConfig
from database.models import User, Plan, Payment, PaymentStatus
from database.connection import CacheManager

logger = logging.getLogger(__name__)

class PaymentService:
    """Payment processing service with Paymentez integration"""
    
    def __init__(self):
        self.config = PaymentConfig.get_paymentez_config()
        self.base_url = "https://ccapi-stg.paymentez.com" if self.config["environment"] == "stg" else "https://ccapi.paymentez.com"
        self.is_enabled = PaymentConfig.is_payment_enabled()
        
        if not self.is_enabled:
            logger.warning("Payment system not fully configured - running in mock mode")
    
    def _generate_auth_token(self, timestamp: str) -> str:
        """Generate Paymentez authentication token"""
        if not self.config["app_code"] or not self.config["app_key"]:
            return "mock_token"
        
        # Create auth string: app_code + timestamp
        auth_string = f"{self.config['app_code']}{timestamp}"
        
        # Generate HMAC-SHA256 hash
        auth_hash = hmac.new(
            self.config["app_key"].encode(),
            auth_string.encode(),
            hashlib.sha256
        ).digest()
        
        # Base64 encode
        auth_token = base64.b64encode(auth_hash).decode()
        
        return auth_token
    
    def _get_headers(self) -> Dict[str, str]:
        """Get headers for Paymentez API requests"""
        timestamp = str(int(datetime.now().timestamp()))
        auth_token = self._generate_auth_token(timestamp)
        
        return {
            "Content-Type": "application/json",
            "Auth-Token": auth_token,
            "Dev-Id": self.config["app_code"] or "mock_dev_id",
            "Timestamp": timestamp
        }
    
    async def create_payment_intent(self, user: User, plan: Plan, db: Session) -> Dict[str, Any]:
        """Create payment intent for plan subscription"""
        try:
            # Create payment record
            payment = Payment(
                user_id=user.id,
                plan_id=plan.id,
                amount=plan.price,
                currency=plan.currency,
                status=PaymentStatus.PENDING.value
            )
            
            db.add(payment)
            db.commit()
            db.refresh(payment)
            
            if not self.is_enabled:
                return await self._create_mock_payment_intent(payment, user, plan)
            
            # Prepare Paymentez request
            payment_data = {
                "user": {
                    "id": str(user.id),
                    "email": user.email,
                    "name": user.full_name or user.username
                },
                "order": {
                    "amount": plan.price,
                    "currency": plan.currency,
                    "description": f"Predix {plan.name} Plan Subscription",
                    "dev_reference": payment.uuid,
                    "vat": 0.0
                }
            }
            
            # Make request to Paymentez
            async with aiohttp.ClientSession() as session:
                async with session.post(
                    f"{self.base_url}/v2/transaction/debit",
                    headers=self._get_headers(),
                    json=payment_data
                ) as response:
                    
                    if response.status == 200:
                        result = await response.json()
                        
                        # Update payment with external ID
                        payment.external_payment_id = result.get("transaction", {}).get("id")
                        payment.payment_data = result
                        db.commit()
                        
                        return {
                            "payment_id": payment.uuid,
                            "external_id": payment.external_payment_id,
                            "status": "pending",
                            "payment_url": result.get("redirect_url"),
                            "amount": plan.price,
                            "currency": plan.currency,
                            "expires_at": (datetime.now(timezone.utc) + timedelta(hours=1)).isoformat()
                        }
                    else:
                        error_data = await response.json()
                        logger.error(f"Paymentez API error: {error_data}")
                        raise Exception(f"Payment gateway error: {error_data.get('message', 'Unknown error')}")
        
        except Exception as e:
            logger.error(f"Payment intent creation failed: {e}")
            if 'payment' in locals():
                payment.status = PaymentStatus.FAILED.value
                db.commit()
            raise
    
    async def _create_mock_payment_intent(self, payment: Payment, user: User, plan: Plan) -> Dict[str, Any]:
        """Create mock payment intent for testing"""
        mock_external_id = f"mock_{payment.uuid[:8]}"
        payment.external_payment_id = mock_external_id
        payment.payment_data = {
            "mock": True,
            "gateway": "paymentez_mock",
            "created_at": datetime.now(timezone.utc).isoformat()
        }
        
        return {
            "payment_id": payment.uuid,
            "external_id": mock_external_id,
            "status": "pending",
            "payment_url": f"https://mock-payment.predix.com/pay/{mock_external_id}",
            "amount": plan.price,
            "currency": plan.currency,
            "expires_at": (datetime.now(timezone.utc) + timedelta(hours=1)).isoformat(),
            "mock_mode": True
        }
    
    async def process_webhook(self, webhook_data: Dict[str, Any], signature: str, db: Session) -> Dict[str, Any]:
        """Process Paymentez webhook notification"""
        try:
            # Verify webhook signature
            if not self._verify_webhook_signature(webhook_data, signature):
                raise Exception("Invalid webhook signature")
            
            transaction = webhook_data.get("transaction", {})
            dev_reference = transaction.get("dev_reference")
            
            if not dev_reference:
                raise Exception("Missing dev_reference in webhook")
            
            # Find payment by UUID
            payment = db.query(Payment).filter(Payment.uuid == dev_reference).first()
            if not payment:
                raise Exception(f"Payment not found: {dev_reference}")
            
            # Update payment status
            status_mapping = {
                "success": PaymentStatus.COMPLETED,
                "failure": PaymentStatus.FAILED,
                "pending": PaymentStatus.PENDING
            }
            
            new_status = status_mapping.get(transaction.get("status"), PaymentStatus.FAILED)
            payment.status = new_status.value
            payment.payment_data = webhook_data
            
            if new_status == PaymentStatus.COMPLETED:
                payment.paid_at = datetime.now(timezone.utc)
                
                # Activate user's subscription
                await self._activate_subscription(payment.user, payment.plan, db)
            
            db.commit()
            
            return {
                "status": "processed",
                "payment_id": payment.uuid,
                "new_status": payment.status
            }
            
        except Exception as e:
            logger.error(f"Webhook processing failed: {e}")
            raise
    
    def _verify_webhook_signature(self, webhook_data: Dict[str, Any], signature: str) -> bool:
        """Verify Paymentez webhook signature"""
        if not self.config["webhook_secret"]:
            logger.warning("Webhook secret not configured - skipping signature verification")
            return True
        
        # Create expected signature
        payload = json.dumps(webhook_data, separators=(',', ':'), sort_keys=True)
        expected_signature = hmac.new(
            self.config["webhook_secret"].encode(),
            payload.encode(),
            hashlib.sha256
        ).hexdigest()
        
        return hmac.compare_digest(signature, expected_signature)
    
    async def _activate_subscription(self, user: User, plan: Plan, db: Session):
        """Activate user's subscription to a plan"""
        try:
            # Update user's plan
            user.current_plan_id = plan.id
            
            # Set subscription expiry based on plan interval
            if plan.interval == "yearly":
                expiry = datetime.now(timezone.utc) + timedelta(days=365)
            else:  # monthly
                expiry = datetime.now(timezone.utc) + timedelta(days=30)
            
            user.subscription_expires_at = expiry
            
            # Reset monthly usage counter
            user.predictions_used_this_month = 0
            user.last_prediction_reset = datetime.now(timezone.utc)
            
            # Update user role if premium plan
            if plan.price > 0:
                user.role = "premium"
            
            db.commit()
            
            # Cache subscription status
            await CacheManager.set(
                f"subscription:{user.id}",
                json.dumps({
                    "plan_id": plan.id,
                    "plan_name": plan.name,
                    "expires_at": expiry.isoformat(),
                    "features": plan.features
                }),
                expire=86400  # 24 hours
            )
            
            logger.info(f"Subscription activated for user {user.id} - Plan: {plan.name}")
            
        except Exception as e:
            logger.error(f"Subscription activation failed: {e}")
            db.rollback()
            raise
    
    async def cancel_subscription(self, user: User, db: Session) -> Dict[str, Any]:
        """Cancel user's subscription"""
        try:
            if not user.current_plan or user.current_plan.price == 0:
                raise Exception("No active paid subscription to cancel")
            
            # Set subscription to expire at the end of current period
            # Don't immediately downgrade to allow user to use remaining time
            
            # Create cancellation record (could be a separate model)
            cancellation_data = {
                "user_id": user.id,
                "plan_id": user.current_plan_id,
                "cancelled_at": datetime.now(timezone.utc).isoformat(),
                "expires_at": user.subscription_expires_at.isoformat() if user.subscription_expires_at else None
            }
            
            # Store cancellation in cache for processing
            await CacheManager.set(
                f"cancellation:{user.id}",
                json.dumps(cancellation_data),
                expire=86400 * 32  # 32 days
            )
            
            logger.info(f"Subscription cancelled for user {user.id}")
            
            return {
                "status": "cancelled",
                "message": "Subscription will expire at the end of current billing period",
                "expires_at": user.subscription_expires_at.isoformat() if user.subscription_expires_at else None
            }
            
        except Exception as e:
            logger.error(f"Subscription cancellation failed: {e}")
            raise
    
    async def get_payment_history(self, user: User, db: Session, limit: int = 50, offset: int = 0) -> List[Payment]:
        """Get user's payment history"""
        payments = db.query(Payment).filter(
            Payment.user_id == user.id
        ).order_by(
            Payment.created_at.desc()
        ).offset(offset).limit(limit).all()
        
        return payments
    
    async def get_subscription_status(self, user: User) -> Dict[str, Any]:
        """Get user's current subscription status"""
        # Check cache first
        cached_status = await CacheManager.get(f"subscription:{user.id}")
        if cached_status:
            return json.loads(cached_status)
        
        # Build status from user data
        if not user.current_plan:
            return {
                "status": "free",
                "plan_name": "Free",
                "features": {
                    "predictions_per_month": 100,
                    "real_time_alerts": False,
                    "advanced_analytics": False
                }
            }
        
        # Check if subscription is expired
        is_expired = (
            user.subscription_expires_at and 
            user.subscription_expires_at < datetime.now(timezone.utc)
        )
        
        if is_expired:
            return {
                "status": "expired",
                "plan_name": user.current_plan.name,
                "expired_at": user.subscription_expires_at.isoformat(),
                "message": "Subscription has expired"
            }
        
        return {
            "status": "active",
            "plan_id": user.current_plan.id,
            "plan_name": user.current_plan.name,
            "expires_at": user.subscription_expires_at.isoformat() if user.subscription_expires_at else None,
            "features": user.current_plan.features,
            "usage": {
                "predictions_used": user.predictions_used_this_month,
                "predictions_limit": user.current_plan.features.get("predictions_per_month", 0)
            }
        }
    
    async def process_subscription_renewals(self, db: Session) -> Dict[str, Any]:
        """Process subscription renewals (run as background task)"""
        try:
            # Find subscriptions expiring in the next 24 hours
            tomorrow = datetime.now(timezone.utc) + timedelta(days=1)
            
            expiring_users = db.query(User).filter(
                User.subscription_expires_at <= tomorrow,
                User.subscription_expires_at > datetime.now(timezone.utc),
                User.current_plan_id.isnot(None)
            ).all()
            
            renewal_results = {
                "processed": 0,
                "successful": 0,
                "failed": 0,
                "errors": []
            }
            
            for user in expiring_users:
                try:
                    # Check if user has auto-renewal enabled (would need to add this field)
                    # For now, we'll just downgrade to free plan
                    
                    # Get free plan
                    free_plan = db.query(Plan).filter(Plan.price == 0.0).first()
                    if free_plan:
                        user.current_plan_id = free_plan.id
                        user.subscription_expires_at = None
                        user.role = "user"
                        user.predictions_used_this_month = 0
                        
                        renewal_results["processed"] += 1
                        renewal_results["successful"] += 1
                        
                        logger.info(f"User {user.id} downgraded to free plan")
                
                except Exception as e:
                    renewal_results["failed"] += 1
                    renewal_results["errors"].append(f"User {user.id}: {str(e)}")
                    logger.error(f"Renewal processing failed for user {user.id}: {e}")
            
            db.commit()
            return renewal_results
            
        except Exception as e:
            logger.error(f"Subscription renewal processing failed: {e}")
            db.rollback()
            raise
    
    async def generate_invoice(self, payment: Payment, user: User, plan: Plan) -> Dict[str, Any]:
        """Generate invoice data for a payment"""
        return {
            "invoice_id": f"INV-{payment.uuid[:8].upper()}",
            "payment_id": payment.uuid,
            "user": {
                "name": user.full_name or user.username,
                "email": user.email
            },
            "plan": {
                "name": plan.name,
                "description": plan.description,
                "price": plan.price,
                "currency": plan.currency,
                "interval": plan.interval
            },
            "payment": {
                "amount": payment.amount,
                "currency": payment.currency,
                "status": payment.status,
                "paid_at": payment.paid_at.isoformat() if payment.paid_at else None,
                "method": payment.payment_method
            },
            "dates": {
                "created_at": payment.created_at.isoformat(),
                "due_date": (payment.created_at + timedelta(days=7)).isoformat()
            }
        }

# Global payment service instance
payment_service = PaymentService()

# Utility functions
async def check_payment_system_health() -> Dict[str, Any]:
    """Check payment system health"""
    try:
        if not payment_service.is_enabled:
            return {
                "status": "mock_mode",
                "message": "Payment system running in mock mode",
                "configured": False
            }
        
        # Test API connectivity (simple ping)
        async with aiohttp.ClientSession() as session:
            async with session.get(
                f"{payment_service.base_url}/health",
                headers=payment_service._get_headers(),
                timeout=aiohttp.ClientTimeout(total=10)
            ) as response:
                if response.status == 200:
                    return {
                        "status": "healthy",
                        "configured": True,
                        "environment": payment_service.config["environment"]
                    }
                else:
                    return {
                        "status": "unhealthy",
                        "configured": True,
                        "error": f"API returned status {response.status}"
                    }
    
    except Exception as e:
        return {
            "status": "unhealthy",
            "configured": payment_service.is_enabled,
            "error": str(e)
        }

# Export main components
__all__ = [
    "PaymentService",
    "payment_service",
    "check_payment_system_health"
]
