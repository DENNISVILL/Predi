"""
Payments Router - Paymentez Integration
Complete payment processing, webhooks, and invoice management
"""
from fastapi import APIRouter, Depends, HTTPException, status, Header, Request
from sqlalchemy.orm import Session
from typing import Optional, Dict, Any
from datetime import datetime, timezone
import logging
import hmac
import hashlib

from database import get_db
from database.models import User, Plan, Payment, PaymentStatus
from services.auth_service import get_current_active_user
from services.payment_service import payment_service
from services.email_service import send_payment_confirmation, send_payment_failed
from pydantic import BaseModel, Field

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/payments", tags=["Payments"])


# ============================================
# Pydantic Schemas
# ============================================
class CheckoutSessionCreate(BaseModel):
    """Create checkout session"""
    plan_id: int
    success_url: Optional[str] = None
    cancel_url: Optional[str] = None


class PaymentMethodUpdate(BaseModel):
    """Update payment method"""
    payment_method_id: str


class WebhookPayload(BaseModel):
    """Paymentez webhook payload"""
    transaction: Dict[str, Any]
    type: str


# ============================================
# Create Checkout Session
# ============================================
@router.post("/create-checkout-session")
async def create_checkout_session(
    session_data: CheckoutSessionCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Create a Paymentez checkout session for plan subscription
    
    - **plan_id**: ID of the plan to subscribe to
    - **success_url**: URL to redirect after successful payment (optional)
    - **cancel_url**: URL to redirect if payment is cancelled (optional)
    
    Returns payment URL and session details
    """
    try:
        # Get plan
        plan = db.query(Plan).filter(Plan.id == session_data.plan_id).first()
        
        if not plan:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Plan not found"
            )
        
        if not plan.is_active:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Plan is not available"
            )
        
        # Create payment intent using payment service
        payment_intent = await payment_service.create_payment_intent(
            user=current_user,
            plan=plan,
            db=db
        )
        
        logger.info(f"Checkout session created: User {current_user.id}, Plan {plan.name}")
        
        return {
            "session_id": payment_intent.get("payment_id"),
            "payment_url": payment_intent.get("payment_url"),
            "amount": payment_intent.get("amount"),
            "currency": payment_intent.get("currency"),
            "plan": {
                "id": plan.id,
                "name": plan.name,
                "description": plan.description,
                "price": plan.price
            },
            "expires_at": payment_intent.get("expires_at")
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to create checkout session: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create checkout session"
        )


# ============================================
# Paymentez Webhook Handler
# ============================================
@router.post("/webhook")
async def handle_webhook(
    request: Request,
    x_signature: Optional[str] = Header(None),
    db: Session = Depends(get_db)
):
    """
    Handle Paymentez webhook notifications
    
    - Verifies webhook signature
    - Processes payment events
    - Updates subscription status
    - Sends confirmation emails
    """
    try:
        # Get raw body for signature verification
        body = await request.body()
        body_str = body.decode('utf-8')
        
        # Verify webhook signature
        if not payment_service._verify_webhook_signature(body_str, x_signature or ""):
            logger.warning("Invalid webhook signature")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid signature"
            )
        
        # Parse webhook data
        import json
        webhook_data = json.loads(body_str)
        
        logger.info(f"Webhook received: {webhook_data.get('type', 'unknown')}")
        
        # Process webhook using payment service
        result = await payment_service.process_webhook(
            webhook_data=webhook_data,
            signature=x_signature or "",
            db=db
        )
        
        # Get payment and user for email notifications
        payment = db.query(Payment).filter(
            Payment.uuid == webhook_data.get("transaction", {}).get("dev_reference")
        ).first()
        
        if payment:
            user = payment.user
            plan = payment.plan
            
            # Send email based on payment status
            if payment.status == PaymentStatus.COMPLETED.value:
                try:
                    await send_payment_confirmation(
                        email=user.email,
                        name=user.full_name or user.username,
                        plan_name=plan.name,
                        amount=payment.amount,
                        currency=payment.currency
                    )
                except Exception as e:
                    logger.error(f"Failed to send payment confirmation email: {e}")
            
            elif payment.status == PaymentStatus.FAILED.value:
                try:
                    await send_payment_failed(
                        email=user.email,
                        name=user.full_name or user.username,
                        plan_name=plan.name
                    )
                except Exception as e:
                    logger.error(f"Failed to send payment failed email: {e}")
        
        return {
            "status": "success",
            "message": "Webhook processed",
            "result": result
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Webhook processing failed: {e}")
        # Return 200 to avoid webhook retries for processing errors
        return {
            "status": "error",
            "message": str(e)
        }


# ============================================
# Get Payment History
# ============================================
@router.get("/history")
async def get_payment_history(
    limit: int = 50,
    offset: int = 0,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Get user's payment history
    
    - **limit**: Maximum number of payments to return (default: 50)
    - **offset**: Number of payments to skip (default: 0)
    
    Returns paginated list of payments
    """
    try:
        payments = await payment_service.get_payment_history(
            user=current_user,
            db=db,
            limit=limit,
            offset=offset
        )
        
        # Format response
        payment_list = []
        for payment in payments:
            payment_list.append({
                "id": payment.id,
                "uuid": payment.uuid,
                "amount": payment.amount,
                "currency": payment.currency,
                "status": payment.status,
                "payment_method": payment.payment_method,
                "plan": {
                    "id": payment.plan.id,
                    "name": payment.plan.name
                } if payment.plan else None,
                "created_at": payment.created_at,
                "paid_at": payment.paid_at
            })
        
        return {
            "total": len(payment_list),
            "limit": limit,
            "offset": offset,
            "payments": payment_list
        }
        
    except Exception as e:
        logger.error(f"Failed to get payment history: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve payment history"
        )


# ============================================
# Get Invoice
# ============================================
@router.get("/invoice/{payment_id}")
async def get_invoice(
    payment_id: str,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Get invoice for a payment
    
    Returns invoice data (PDF generation could be added)
    """
    try:
        # Find payment by UUID
        payment = db.query(Payment).filter(
            Payment.uuid == payment_id,
            Payment.user_id == current_user.id
        ).first()
        
        if not payment:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Payment not found"
            )
        
        # Generate invoice data
        invoice = await payment_service.generate_invoice(
            payment=payment,
            user=current_user,
            plan=payment.plan
        )
        
        return invoice
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to get invoice: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve invoice"
        )


# ============================================
# Download Invoice PDF
# ============================================
@router.get("/invoice/{payment_id}/pdf")
async def download_invoice_pdf(
    payment_id: str,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Download invoice as PDF
    
    TODO: Implement PDF generation with ReportLab or WeasyPrint
    """
    try:
        payment = db.query(Payment).filter(
            Payment.uuid == payment_id,
            Payment.user_id == current_user.id
        ).first()
        
        if not payment:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Payment not found"
            )
        
        # TODO: Generate PDF
        # For now, return invoice data
        invoice = await payment_service.generate_invoice(
            payment=payment,
            user=current_user,
            plan=payment.plan
        )
        
        return {
            "message": "PDF generation not yet implemented",
            "invoice_data": invoice,
            "note": "Use /invoice/{payment_id} for JSON format"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to download invoice PDF: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to download invoice"
        )


# ============================================
# Cancel Subscription Payment
# ============================================
@router.post("/cancel-subscription")
async def cancel_subscription_payment(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Cancel recurring subscription payments
    
    Stops future automatic charges
    """
    try:
        result = await payment_service.cancel_subscription(
            user=current_user,
            db=db
        )
        
        logger.info(f"Subscription payment cancelled: User {current_user.id}")
        
        return result
        
    except Exception as e:
        logger.error(f"Failed to cancel subscription payment: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to cancel subscription"
        )


# ============================================
# Update Payment Method
# ============================================
@router.post("/payment-method")
async def update_payment_method(
    method_data: PaymentMethodUpdate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Update default payment method
    
    For Paymentez, this would update the stored card/payment method
    """
    try:
        # TODO: Implement payment method update with Paymentez
        # This would typically involve:
        # 1. Validate new payment method
        # 2. Update user's default payment method
        # 3. Store encrypted payment details
        
        logger.info(f"Payment method update requested: User {current_user.id}")
        
        return {
            "message": "Payment method update not yet fully implemented",
            "status": "pending",
            "note": "This feature requires additional Paymentez integration"
        }
        
    except Exception as e:
        logger.error(f"Failed to update payment method: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update payment method"
        )


# ============================================
# Get Payment Status
# ============================================
@router.get("/status/{payment_id}")
async def get_payment_status(
    payment_id: str,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Get current status of a payment
    
    Useful for polling payment completion
    """
    try:
        payment = db.query(Payment).filter(
            Payment.uuid == payment_id,
            Payment.user_id == current_user.id
        ).first()
        
        if not payment:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Payment not found"
            )
        
        return {
            "payment_id": payment.uuid,
            "status": payment.status,
            "amount": payment.amount,
            "currency": payment.currency,
            "created_at": payment.created_at,
            "paid_at": payment.paid_at,
            "is_completed": payment.status == PaymentStatus.COMPLETED.value,
            "is_failed": payment.status == PaymentStatus.FAILED.value,
            "is_pending": payment.status == PaymentStatus.PENDING.value
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to get payment status: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve payment status"
        )


# ============================================
# Retry Failed Payment
# ============================================
@router.post("/retry/{payment_id}")
async def retry_payment(
    payment_id: str,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Retry a failed payment
    
    Creates a new payment intent for the same plan
    """
    try:
        # Find original payment
        original_payment = db.query(Payment).filter(
            Payment.uuid == payment_id,
            Payment.user_id == current_user.id
        ).first()
        
        if not original_payment:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Payment not found"
            )
        
        if original_payment.status != PaymentStatus.FAILED.value:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Can only retry failed payments"
            )
        
        # Create new payment intent
        plan = original_payment.plan
        payment_intent = await payment_service.create_payment_intent(
            user=current_user,
            plan=plan,
            db=db
        )
        
        logger.info(f"Payment retry initiated: Original {payment_id}, New {payment_intent.get('payment_id')}")
        
        return {
            "message": "Payment retry initiated",
            "original_payment_id": payment_id,
            "new_payment_id": payment_intent.get("payment_id"),
            "payment_url": payment_intent.get("payment_url"),
            "amount": payment_intent.get("amount")
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to retry payment: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retry payment"
        )


# ============================================
# Payment Statistics
# ============================================
@router.get("/stats")
async def get_payment_stats(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Get payment statistics for the user
    
    Returns total spent, successful payments, failed payments
    """
    try:
        payments = db.query(Payment).filter(
            Payment.user_id == current_user.id
        ).all()
        
        total_spent = sum(
            p.amount for p in payments 
            if p.status == PaymentStatus.COMPLETED.value
        )
        
        successful_count = sum(
            1 for p in payments 
            if p.status == PaymentStatus.COMPLETED.value
        )
        
        failed_count = sum(
            1 for p in payments 
            if p.status == PaymentStatus.FAILED.value
        )
        
        pending_count = sum(
            1 for p in payments 
            if p.status == PaymentStatus.PENDING.value
        )
        
        return {
            "total_payments": len(payments),
            "successful_payments": successful_count,
            "failed_payments": failed_count,
            "pending_payments": pending_count,
            "total_spent": total_spent,
            "currency": payments[0].currency if payments else "USD",
            "first_payment": payments[-1].created_at if payments else None,
            "last_payment": payments[0].created_at if payments else None
        }
        
    except Exception as e:
        logger.error(f"Failed to get payment stats: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve payment statistics"
        )
