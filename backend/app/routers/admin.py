from fastapi import APIRouter, Depends, HTTPException, status, Query, File, UploadFile
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from sqlalchemy import func, desc, asc, and_, or_
from typing import List, Optional, Dict, Any
from datetime import datetime, timedelta
import jwt
import bcrypt
import csv
import io
from pydantic import BaseModel, EmailStr

from ..database import get_db
from ..models import (
    AdminUser, User, UserSubscription, PaymentTransaction, 
    AIModelConfig, AIUsageLog, SystemSetting, AuditLog,
    SystemNotification, UserActivityLog
)

router = APIRouter(prefix="/api/v1/admin", tags=["admin"])
security = HTTPBearer()

# Pydantic Models
class AdminLogin(BaseModel):
    username: str
    password: str

class AdminRegister(BaseModel):
    username: str
    email: EmailStr
    password: str
    full_name: str
    role: str = "admin"

class AdminResponse(BaseModel):
    id: int
    username: str
    email: str
    full_name: str
    role: str
    is_active: bool
    last_login: Optional[datetime]
    created_at: datetime

class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    email: Optional[EmailStr] = None
    is_active: Optional[bool] = None
    subscription_plan: Optional[str] = None

class SubscriptionUpdate(BaseModel):
    status: Optional[str] = None
    plan_name: Optional[str] = None
    auto_renew: Optional[bool] = None
    cancellation_reason: Optional[str] = None

class AIConfigUpdate(BaseModel):
    model_name: Optional[str] = None
    max_tokens: Optional[int] = None
    temperature: Optional[float] = None
    system_prompt: Optional[str] = None
    is_active: Optional[bool] = None
    daily_limit: Optional[int] = None

class SystemSettingUpdate(BaseModel):
    value: str

class NotificationCreate(BaseModel):
    title: str
    message: str
    type: str = "info"
    target_audience: str = "all"
    target_user_ids: Optional[List[int]] = None
    show_until: Optional[datetime] = None
    priority: int = 1

class DashboardStats(BaseModel):
    total_users: int
    active_subscriptions: int
    total_revenue: float
    ai_usage: int
    new_users_today: int
    revenue_today: float
    conversion_rate: float
    churn_rate: float

# JWT Configuration
SECRET_KEY = "your-secret-key-here"  # In production, use environment variable
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24  # 24 hours

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        admin_id: int = payload.get("sub")
        if admin_id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication credentials"
            )
        return admin_id
    except jwt.PyJWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials"
        )

def get_current_admin(admin_id: int = Depends(verify_token), db: Session = Depends(get_db)):
    admin = db.query(AdminUser).filter(AdminUser.id == admin_id).first()
    if not admin or not admin.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Admin not found or inactive"
        )
    return admin

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def verify_password(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))

def log_admin_action(db: Session, admin_id: int, action: str, resource_type: str, 
                    resource_id: str = None, old_values: dict = None, new_values: dict = None):
    audit_log = AuditLog(
        admin_id=admin_id,
        action=action,
        resource_type=resource_type,
        resource_id=resource_id,
        old_values=old_values,
        new_values=new_values,
        success=True
    )
    db.add(audit_log)
    db.commit()

# Authentication Endpoints
@router.post("/auth/login")
async def admin_login(login_data: AdminLogin, db: Session = Depends(get_db)):
    admin = db.query(AdminUser).filter(AdminUser.username == login_data.username).first()
    
    if not admin or not verify_password(login_data.password, admin.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password"
        )
    
    if not admin.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Admin account is inactive"
        )
    
    # Update last login
    admin.last_login = datetime.utcnow()
    db.commit()
    
    # Create access token
    access_token = create_access_token(data={"sub": admin.id})
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "admin": AdminResponse.from_orm(admin)
    }

@router.post("/auth/register")
async def admin_register(register_data: AdminRegister, db: Session = Depends(get_db)):
    # Check if username or email already exists
    existing_admin = db.query(AdminUser).filter(
        or_(AdminUser.username == register_data.username, AdminUser.email == register_data.email)
    ).first()
    
    if existing_admin:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username or email already registered"
        )
    
    # Create new admin
    hashed_password = hash_password(register_data.password)
    admin = AdminUser(
        username=register_data.username,
        email=register_data.email,
        password_hash=hashed_password,
        full_name=register_data.full_name,
        role=register_data.role
    )
    
    db.add(admin)
    db.commit()
    db.refresh(admin)
    
    # Create access token
    access_token = create_access_token(data={"sub": admin.id})
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "admin": AdminResponse.from_orm(admin)
    }

@router.get("/auth/me")
async def get_current_admin_info(current_admin: AdminUser = Depends(get_current_admin)):
    return AdminResponse.from_orm(current_admin)

# Dashboard Endpoints
@router.get("/dashboard/stats", response_model=DashboardStats)
async def get_dashboard_stats(
    current_admin: AdminUser = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    today = datetime.utcnow().date()
    
    # Total users
    total_users = db.query(func.count(User.id)).scalar()
    
    # Active subscriptions
    active_subscriptions = db.query(func.count(UserSubscription.id)).filter(
        UserSubscription.status == "active"
    ).scalar()
    
    # Total revenue
    total_revenue = db.query(func.sum(PaymentTransaction.amount)).filter(
        PaymentTransaction.status == "completed"
    ).scalar() or 0
    
    # AI usage
    ai_usage = db.query(func.count(AIUsageLog.id)).scalar()
    
    # New users today
    new_users_today = db.query(func.count(User.id)).filter(
        func.date(User.created_at) == today
    ).scalar()
    
    # Revenue today
    revenue_today = db.query(func.sum(PaymentTransaction.amount)).filter(
        and_(
            PaymentTransaction.status == "completed",
            func.date(PaymentTransaction.created_at) == today
        )
    ).scalar() or 0
    
    # Conversion rate (simplified calculation)
    total_free_users = db.query(func.count(User.id)).filter(
        ~User.id.in_(db.query(UserSubscription.user_id).filter(UserSubscription.status == "active"))
    ).scalar()
    conversion_rate = (active_subscriptions / total_users * 100) if total_users > 0 else 0
    
    # Churn rate (simplified calculation)
    cancelled_subscriptions = db.query(func.count(UserSubscription.id)).filter(
        UserSubscription.status == "cancelled"
    ).scalar()
    churn_rate = (cancelled_subscriptions / (active_subscriptions + cancelled_subscriptions) * 100) if (active_subscriptions + cancelled_subscriptions) > 0 else 0
    
    return DashboardStats(
        total_users=total_users,
        active_subscriptions=active_subscriptions,
        total_revenue=total_revenue,
        ai_usage=ai_usage,
        new_users_today=new_users_today,
        revenue_today=revenue_today,
        conversion_rate=conversion_rate,
        churn_rate=churn_rate
    )

# User Management Endpoints
@router.get("/users")
async def get_users(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    search: Optional[str] = Query(None),
    status: Optional[str] = Query("all"),
    subscription: Optional[str] = Query("all"),
    date_range: Optional[str] = Query("all"),
    current_admin: AdminUser = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    query = db.query(User)
    
    # Apply filters
    if search:
        query = query.filter(
            or_(
                User.full_name.ilike(f"%{search}%"),
                User.email.ilike(f"%{search}%")
            )
        )
    
    if status != "all":
        if status == "active":
            query = query.filter(User.is_active == True)
        elif status == "inactive":
            query = query.filter(User.is_active == False)
    
    if date_range != "all":
        today = datetime.utcnow().date()
        if date_range == "today":
            query = query.filter(func.date(User.created_at) == today)
        elif date_range == "week":
            week_ago = today - timedelta(days=7)
            query = query.filter(func.date(User.created_at) >= week_ago)
        elif date_range == "month":
            month_ago = today - timedelta(days=30)
            query = query.filter(func.date(User.created_at) >= month_ago)
    
    # Get total count
    total = query.count()
    
    # Apply pagination
    offset = (page - 1) * limit
    users = query.offset(offset).limit(limit).all()
    
    # Add subscription info to users
    user_list = []
    for user in users:
        subscription = db.query(UserSubscription).filter(
            and_(UserSubscription.user_id == user.id, UserSubscription.status == "active")
        ).first()
        
        user_dict = {
            "id": user.id,
            "email": user.email,
            "full_name": user.full_name,
            "is_active": user.is_active,
            "created_at": user.created_at,
            "last_login": user.last_login,
            "subscription_plan": subscription.plan_name if subscription else "free",
            "subscription_status": subscription.status if subscription else "none"
        }
        user_list.append(user_dict)
    
    return {
        "users": user_list,
        "page": page,
        "limit": limit,
        "total": total,
        "total_pages": (total + limit - 1) // limit
    }

@router.put("/users/{user_id}")
async def update_user(
    user_id: int,
    user_data: UserUpdate,
    current_admin: AdminUser = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    old_values = {
        "full_name": user.full_name,
        "email": user.email,
        "is_active": user.is_active
    }
    
    # Update user fields
    if user_data.full_name is not None:
        user.full_name = user_data.full_name
    if user_data.email is not None:
        user.email = user_data.email
    if user_data.is_active is not None:
        user.is_active = user_data.is_active
    
    user.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(user)
    
    new_values = {
        "full_name": user.full_name,
        "email": user.email,
        "is_active": user.is_active
    }
    
    # Log the action
    log_admin_action(db, current_admin.id, "UPDATE", "user", str(user_id), old_values, new_values)
    
    return {"message": "User updated successfully", "user": user}

@router.delete("/users/{user_id}")
async def delete_user(
    user_id: int,
    current_admin: AdminUser = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    old_values = {
        "id": user.id,
        "email": user.email,
        "full_name": user.full_name
    }
    
    db.delete(user)
    db.commit()
    
    # Log the action
    log_admin_action(db, current_admin.id, "DELETE", "user", str(user_id), old_values)
    
    return {"message": "User deleted successfully"}

# Subscription Management Endpoints
@router.get("/subscriptions")
async def get_subscriptions(
    current_admin: AdminUser = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    subscriptions = db.query(UserSubscription).join(User).all()
    
    subscription_list = []
    for sub in subscriptions:
        subscription_dict = {
            "id": sub.id,
            "user_id": sub.user_id,
            "user_email": sub.user.email,
            "user_name": sub.user.full_name,
            "plan_name": sub.plan_name,
            "plan_type": sub.plan_type,
            "status": sub.status,
            "price": float(sub.price),
            "currency": sub.currency,
            "billing_cycle_start": sub.billing_cycle_start,
            "billing_cycle_end": sub.billing_cycle_end,
            "auto_renew": sub.auto_renew,
            "created_at": sub.created_at,
            "updated_at": sub.updated_at
        }
        subscription_list.append(subscription_dict)
    
    return subscription_list

@router.put("/subscriptions/{subscription_id}")
async def update_subscription(
    subscription_id: int,
    subscription_data: SubscriptionUpdate,
    current_admin: AdminUser = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    subscription = db.query(UserSubscription).filter(UserSubscription.id == subscription_id).first()
    if not subscription:
        raise HTTPException(status_code=404, detail="Subscription not found")
    
    old_values = {
        "status": subscription.status,
        "plan_name": subscription.plan_name,
        "auto_renew": subscription.auto_renew
    }
    
    # Update subscription fields
    if subscription_data.status is not None:
        subscription.status = subscription_data.status
        if subscription_data.status == "cancelled":
            subscription.cancelled_at = datetime.utcnow()
            subscription.cancelled_by = current_admin.id
    
    if subscription_data.plan_name is not None:
        subscription.plan_name = subscription_data.plan_name
    
    if subscription_data.auto_renew is not None:
        subscription.auto_renew = subscription_data.auto_renew
    
    if subscription_data.cancellation_reason is not None:
        subscription.cancellation_reason = subscription_data.cancellation_reason
    
    subscription.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(subscription)
    
    new_values = {
        "status": subscription.status,
        "plan_name": subscription.plan_name,
        "auto_renew": subscription.auto_renew
    }
    
    # Log the action
    log_admin_action(db, current_admin.id, "UPDATE", "subscription", str(subscription_id), old_values, new_values)
    
    return {"message": "Subscription updated successfully", "subscription": subscription}

# AI Configuration Endpoints
@router.get("/ai/configs")
async def get_ai_configs(
    current_admin: AdminUser = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    configs = db.query(AIModelConfig).all()
    return configs

@router.put("/ai/configs/{config_id}")
async def update_ai_config(
    config_id: int,
    config_data: AIConfigUpdate,
    current_admin: AdminUser = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    config = db.query(AIModelConfig).filter(AIModelConfig.id == config_id).first()
    if not config:
        raise HTTPException(status_code=404, detail="AI config not found")
    
    old_values = {
        "model_name": config.model_name,
        "max_tokens": config.max_tokens,
        "temperature": config.temperature,
        "is_active": config.is_active
    }
    
    # Update config fields
    for field, value in config_data.dict(exclude_unset=True).items():
        setattr(config, field, value)
    
    config.updated_at = datetime.utcnow()
    config.updated_by = current_admin.id
    db.commit()
    db.refresh(config)
    
    new_values = {
        "model_name": config.model_name,
        "max_tokens": config.max_tokens,
        "temperature": config.temperature,
        "is_active": config.is_active
    }
    
    # Log the action
    log_admin_action(db, current_admin.id, "UPDATE", "ai_config", str(config_id), old_values, new_values)
    
    return {"message": "AI config updated successfully", "config": config}

@router.get("/ai/usage")
async def get_ai_usage_logs(
    limit: int = Query(100, ge=1, le=1000),
    current_admin: AdminUser = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    logs = db.query(AIUsageLog).order_by(desc(AIUsageLog.created_at)).limit(limit).all()
    return logs

# System Settings Endpoints
@router.get("/settings")
async def get_system_settings(
    current_admin: AdminUser = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    settings = db.query(SystemSetting).all()
    return settings

@router.put("/settings/{setting_key}")
async def update_system_setting(
    setting_key: str,
    setting_data: SystemSettingUpdate,
    current_admin: AdminUser = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    setting = db.query(SystemSetting).filter(SystemSetting.setting_key == setting_key).first()
    if not setting:
        raise HTTPException(status_code=404, detail="Setting not found")
    
    old_value = setting.setting_value
    setting.setting_value = setting_data.value
    setting.updated_at = datetime.utcnow()
    setting.updated_by = current_admin.id
    
    db.commit()
    db.refresh(setting)
    
    # Log the action
    log_admin_action(db, current_admin.id, "UPDATE", "system_setting", setting_key, 
                    {"value": old_value}, {"value": setting.setting_value})
    
    return {"message": "Setting updated successfully", "setting": setting}

# Audit Logs Endpoints
@router.get("/audit-logs")
async def get_audit_logs(
    limit: int = Query(100, ge=1, le=1000),
    current_admin: AdminUser = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    logs = db.query(AuditLog).join(AdminUser).order_by(desc(AuditLog.timestamp)).limit(limit).all()
    
    log_list = []
    for log in logs:
        log_dict = {
            "id": log.id,
            "admin_username": log.admin.username,
            "admin_full_name": log.admin.full_name,
            "action": log.action,
            "resource_type": log.resource_type,
            "resource_id": log.resource_id,
            "old_values": log.old_values,
            "new_values": log.new_values,
            "ip_address": str(log.ip_address) if log.ip_address else None,
            "timestamp": log.timestamp,
            "success": log.success,
            "error_message": log.error_message
        }
        log_list.append(log_dict)
    
    return log_list

# Notifications Endpoints
@router.get("/notifications")
async def get_notifications(
    current_admin: AdminUser = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    notifications = db.query(SystemNotification).order_by(desc(SystemNotification.created_at)).all()
    return notifications

@router.post("/notifications")
async def create_notification(
    notification_data: NotificationCreate,
    current_admin: AdminUser = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    notification = SystemNotification(
        title=notification_data.title,
        message=notification_data.message,
        type=notification_data.type,
        target_audience=notification_data.target_audience,
        target_user_ids=notification_data.target_user_ids,
        show_until=notification_data.show_until,
        priority=notification_data.priority,
        created_by=current_admin.id
    )
    
    db.add(notification)
    db.commit()
    db.refresh(notification)
    
    # Log the action
    log_admin_action(db, current_admin.id, "CREATE", "notification", str(notification.id), 
                    None, {"title": notification.title, "type": notification.type})
    
    return {"message": "Notification created successfully", "notification": notification}

# Export Endpoints
@router.get("/export/users")
async def export_users(
    format: str = Query("csv", regex="^(csv|json)$"),
    current_admin: AdminUser = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    users = db.query(User).all()
    
    if format == "csv":
        output = io.StringIO()
        writer = csv.writer(output)
        
        # Write header
        writer.writerow(['ID', 'Email', 'Full Name', 'Is Active', 'Created At', 'Last Login'])
        
        # Write data
        for user in users:
            writer.writerow([
                user.id,
                user.email,
                user.full_name or '',
                user.is_active,
                user.created_at.isoformat(),
                user.last_login.isoformat() if user.last_login else ''
            ])
        
        output.seek(0)
        return {"content": output.getvalue(), "filename": f"users_export_{datetime.now().strftime('%Y%m%d_%H%M%S')}.csv"}
    
    else:  # JSON format
        user_list = []
        for user in users:
            user_dict = {
                "id": user.id,
                "email": user.email,
                "full_name": user.full_name,
                "is_active": user.is_active,
                "created_at": user.created_at.isoformat(),
                "last_login": user.last_login.isoformat() if user.last_login else None
            }
            user_list.append(user_dict)
        
        return {"users": user_list, "exported_at": datetime.utcnow().isoformat()}

@router.get("/export/subscriptions")
async def export_subscriptions(
    format: str = Query("csv", regex="^(csv|json)$"),
    current_admin: AdminUser = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    subscriptions = db.query(UserSubscription).join(User).all()
    
    if format == "csv":
        output = io.StringIO()
        writer = csv.writer(output)
        
        # Write header
        writer.writerow(['ID', 'User Email', 'Plan Name', 'Status', 'Price', 'Currency', 'Created At'])
        
        # Write data
        for sub in subscriptions:
            writer.writerow([
                sub.id,
                sub.user.email,
                sub.plan_name,
                sub.status,
                float(sub.price),
                sub.currency,
                sub.created_at.isoformat()
            ])
        
        output.seek(0)
        return {"content": output.getvalue(), "filename": f"subscriptions_export_{datetime.now().strftime('%Y%m%d_%H%M%S')}.csv"}
    
    else:  # JSON format
        subscription_list = []
        for sub in subscriptions:
            sub_dict = {
                "id": sub.id,
                "user_email": sub.user.email,
                "plan_name": sub.plan_name,
                "status": sub.status,
                "price": float(sub.price),
                "currency": sub.currency,
                "created_at": sub.created_at.isoformat()
            }
            subscription_list.append(sub_dict)
        
        return {"subscriptions": subscription_list, "exported_at": datetime.utcnow().isoformat()}
