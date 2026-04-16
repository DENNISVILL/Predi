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

# Ajustar imports para la estructura correcta
from database.connection import get_db
from database.models import (
    AdminUser, User, UserSubscription, PaymentTransaction, 
    AIModelConfig, AIUsageLog, SystemSetting, AuditLog,
    SystemNotification, UserActivityLog
)

router = APIRouter()
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
    
    # Mock data for now - replace with actual queries
    return DashboardStats(
        total_users=1234,
        active_subscriptions=456,
        total_revenue=45678.90,
        ai_usage=8901,
        new_users_today=23,
        revenue_today=567.89,
        conversion_rate=24.8,
        churn_rate=3.2
    )

# User Management Endpoints
@router.get("/users")
async def get_users(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    search: Optional[str] = Query(None),
    status: Optional[str] = Query("all"),
    current_admin: AdminUser = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    # Mock data for now
    return {
        "users": [],
        "page": page,
        "limit": limit,
        "total": 0,
        "total_pages": 0
    }

@router.put("/users/{user_id}")
async def update_user(
    user_id: int,
    user_data: UserUpdate,
    current_admin: AdminUser = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    return {"message": "User updated successfully"}

@router.delete("/users/{user_id}")
async def delete_user(
    user_id: int,
    current_admin: AdminUser = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    return {"message": "User deleted successfully"}

# System Settings Endpoints
@router.get("/settings")
async def get_system_settings(
    current_admin: AdminUser = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    # Mock data for now
    return []

@router.put("/settings/{setting_key}")
async def update_system_setting(
    setting_key: str,
    setting_data: SystemSettingUpdate,
    current_admin: AdminUser = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    return {"message": "Setting updated successfully"}

# AI Configuration Endpoints
@router.get("/ai/configs")
async def get_ai_configs(
    current_admin: AdminUser = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    # Mock data for now
    return []

@router.get("/ai/usage")
async def get_ai_usage_logs(
    limit: int = Query(100, ge=1, le=1000),
    current_admin: AdminUser = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    # Mock data for now
    return []

# Notifications Endpoints
@router.get("/notifications")
async def get_notifications(
    current_admin: AdminUser = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    # Mock data for now
    return []

@router.post("/notifications")
async def create_notification(
    notification_data: NotificationCreate,
    current_admin: AdminUser = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    return {"message": "Notification created successfully"}

# Export Endpoints
@router.get("/export/users")
async def export_users(
    format: str = Query("csv", regex="^(csv|json)$"),
    current_admin: AdminUser = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    return {"message": "Export functionality coming soon"}

@router.get("/export/subscriptions")
async def export_subscriptions(
    format: str = Query("csv", regex="^(csv|json)$"),
    current_admin: AdminUser = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    return {"message": "Export functionality coming soon"}
