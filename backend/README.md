# 🚀 PREDIX BACKEND - ENTERPRISE API

## 📊 **OVERVIEW**

Predix Backend is a production-ready FastAPI application that powers the viral trend prediction platform. It provides secure authentication, AI integration, payment processing, real-time notifications, and comprehensive analytics.

## 🏗️ **ARCHITECTURE**

```
┌─────────────────────────────────────────────────────────────────┐
│                    PREDIX BACKEND ARCHITECTURE                  │
└─────────────────────────────────────────────────────────────────┘

FRONTEND ←→ API GATEWAY ←→ BACKEND ←→ AI SYSTEM
    │           │            │          │
React App   FastAPI      Services   ML Models
WebSocket   JWT Auth     Database   Predictions
   │           │            │          │
   └───────────┴────────────┴──────────┘
              REAL-TIME SYNC
```

## 📁 **PROJECT STRUCTURE**

```
predix/backend/
├── main.py                 # FastAPI application entry point
├── config/                 # Configuration management
│   └── settings.py        # Environment-based settings
├── database/              # Database layer
│   ├── connection.py      # SQLAlchemy setup & Redis
│   └── models.py          # Database models & relationships
├── routes/                # API endpoints
│   ├── users.py          # Authentication & user management
│   ├── ai.py             # AI predictions & analytics
│   ├── payments.py       # Payment processing
│   ├── trends.py         # Trend data management
│   ├── analytics.py      # Analytics & reporting
│   ├── health.py         # Health checks & monitoring
│   └── admin.py          # Admin panel endpoints
├── services/              # Business logic layer
│   ├── auth_service.py   # JWT authentication & sessions
│   ├── ai_connector.py   # AI system integration
│   ├── payment_service.py # Paymentez integration
│   └── websocket_service.py # Real-time notifications
├── tests/                 # Test suite
│   ├── test_auth.py      # Authentication tests
│   ├── test_ai.py        # AI integration tests
│   └── test_payments.py  # Payment system tests
├── requirements.txt       # Python dependencies
├── Dockerfile            # Container configuration
└── README.md             # This documentation
```

## 🚀 **QUICK START**

### **Prerequisites**
- Python 3.11+
- PostgreSQL 14+
- Redis 7+
- AI System running on port 8001

### **Installation**
```bash
# Clone repository
git clone <predix-repo>
cd predix/backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set environment variables
cp .env.example .env
# Edit .env with your configuration

# Initialize database
python -c "
from database.connection import init_db
import asyncio
asyncio.run(init_db())
"

# Start development server
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### **Environment Variables**
```bash
# Database
DATABASE_URL=postgresql://predix_user:predix_pass@localhost:5432/predix_db
REDIS_URL=redis://localhost:6379/0

# Security
SECRET_KEY=your-super-secret-key-change-in-production
ACCESS_TOKEN_EXPIRE_MINUTES=30

# AI System
AI_API_URL=http://localhost:8001
AI_API_KEY=optional-ai-api-key

# Payments (Paymentez)
PAYMENTEZ_APP_CODE=your-paymentez-app-code
PAYMENTEZ_APP_KEY=your-paymentez-app-key
PAYMENTEZ_ENVIRONMENT=stg  # or prod

# CORS
CORS_ORIGINS=http://localhost:3000,http://localhost:3001
```

## 🔌 **API ENDPOINTS**

### **🔐 Authentication**
```http
POST   /api/v1/users/register      # User registration
POST   /api/v1/users/login         # User login
POST   /api/v1/users/logout        # User logout
POST   /api/v1/users/refresh-token # Refresh JWT token
```

### **👤 User Management**
```http
GET    /api/v1/users/me            # Get current user profile
PUT    /api/v1/users/me            # Update user profile
POST   /api/v1/users/change-password # Change password
GET    /api/v1/users/me/stats      # User statistics
DELETE /api/v1/users/me            # Delete account
```

### **🤖 AI Predictions**
```http
POST   /api/v1/ai/predict          # Single trend prediction
POST   /api/v1/ai/batch-predict    # Batch predictions (Premium)
GET    /api/v1/ai/trending/{platform} # Get trending predictions
POST   /api/v1/ai/alerts/check     # Check alert thresholds
GET    /api/v1/ai/predictions/history # Prediction history
GET    /api/v1/ai/status           # AI system status
```

### **💳 Payments**
```http
GET    /api/v1/payments/plans      # Available plans
POST   /api/v1/payments/checkout   # Create payment intent
POST   /api/v1/payments/webhook    # Payment webhook
GET    /api/v1/payments/history    # Payment history
POST   /api/v1/payments/cancel     # Cancel subscription
```

### **📊 Analytics**
```http
GET    /api/v1/analytics/dashboard # Dashboard metrics
GET    /api/v1/analytics/trends    # Trend analytics
GET    /api/v1/analytics/users     # User analytics (Admin)
POST   /api/v1/analytics/export    # Export data (Premium)
```

### **🔍 Health & Monitoring**
```http
GET    /api/v1/health              # System health check
GET    /api/v1/health/detailed     # Detailed health status
GET    /api/v1/health/metrics      # System metrics
```

## 🔒 **AUTHENTICATION & SECURITY**

### **JWT Token System**
- **Access Token**: 30 minutes expiry, used for API requests
- **Refresh Token**: 7 days expiry, used to refresh access tokens
- **Session Management**: Track active sessions per user
- **Token Blacklisting**: Immediate logout capability

### **Security Features**
- **Rate Limiting**: Prevent abuse with Redis-based limiting
- **Password Validation**: Strong password requirements
- **Email Validation**: Prevent disposable emails
- **CORS Protection**: Configurable allowed origins
- **Input Sanitization**: Prevent injection attacks
- **Audit Logging**: Track all user actions

### **Role-Based Access Control**
```python
# User roles
USER = "user"        # Basic access, limited predictions
PREMIUM = "premium"   # Advanced features, unlimited predictions
ADMIN = "admin"      # Full system access

# Permission decorators
@router.get("/premium-feature")
async def premium_endpoint(user: User = Depends(get_current_premium_user)):
    pass

@router.get("/admin-only")
async def admin_endpoint(user: User = Depends(get_current_admin_user)):
    pass
```

## 🤖 **AI SYSTEM INTEGRATION**

### **Connection Management**
- **Circuit Breaker**: Automatic failover on AI system failures
- **Health Monitoring**: Continuous AI system health checks
- **Request Caching**: Cache trending predictions for performance
- **Error Handling**: Graceful degradation when AI unavailable

### **Prediction Flow**
```python
# Single prediction
user_input → quota_check → ai_prediction → save_to_db → websocket_notify

# Batch prediction (Premium)
batch_input → quota_check → ai_batch_predict → save_results → notify_high_scores
```

### **Real-time Features**
- **WebSocket Notifications**: Instant alerts for high viral scores
- **Trending Updates**: Live trending data broadcasts
- **Alert System**: Configurable thresholds with notifications

## 💳 **PAYMENT SYSTEM**

### **Paymentez Integration**
- **Secure Payments**: HMAC-SHA256 signature verification
- **Webhook Handling**: Automatic subscription activation
- **Multiple Currencies**: USD, EUR, local currencies
- **Subscription Management**: Automatic renewals and cancellations

### **Plan Features**
```python
PLANS = {
    "Free": {
        "predictions_per_month": 100,
        "real_time_alerts": False,
        "advanced_analytics": False,
        "api_access": False
    },
    "Pro": {
        "predictions_per_month": -1,  # Unlimited
        "real_time_alerts": True,
        "advanced_analytics": True,
        "api_access": True
    },
    "Enterprise": {
        "predictions_per_month": -1,
        "real_time_alerts": True,
        "advanced_analytics": True,
        "api_access": True,
        "priority_support": True,
        "custom_integrations": True
    }
}
```

## 📊 **DATABASE SCHEMA**

### **Core Tables**
```sql
-- Users and authentication
users (id, email, username, hashed_password, role, ...)
user_sessions (id, user_id, token_jti, expires_at, ...)

-- Subscription and payments
plans (id, name, price, features, ...)
payments (id, user_id, plan_id, amount, status, ...)

-- AI predictions and trends
trends (id, platform, name, viral_score, confidence, ...)
trend_predictions (id, user_id, trend_id, input_data, results, ...)

-- Notifications and alerts
alerts (id, user_id, type, title, message, trend_data, ...)

-- System logging
logs (id, level, message, user_id, endpoint, extra_data, ...)
```

### **Relationships**
- User → Plans (many-to-one)
- User → Payments (one-to-many)
- User → Predictions (one-to-many)
- User → Alerts (one-to-many)
- Trends → Predictions (one-to-many)

## ⚡ **REAL-TIME FEATURES**

### **WebSocket Management**
```python
# Connection flow
client_connect → jwt_auth → user_rooms → message_handling

# Message types
{
    "ping/pong": "heartbeat",
    "join_room": "subscribe to updates",
    "alert_notification": "viral alerts",
    "prediction_result": "AI predictions",
    "trending_update": "live trending data"
}
```

### **Room System**
- **Personal Rooms**: `user_{user_id}` for private notifications
- **Alert Rooms**: `alerts` for real-time alert subscribers
- **Trending Rooms**: `trending_{platform}` for platform updates

## 🔍 **MONITORING & OBSERVABILITY**

### **Health Checks**
```python
# System components
{
    "database": "connected/disconnected",
    "redis": "connected/disconnected", 
    "ai_system": "healthy/unhealthy",
    "payment_gateway": "operational/down"
}
```

### **Metrics Tracking**
- **API Performance**: Request latency, throughput, error rates
- **User Activity**: Logins, predictions, subscriptions
- **AI System**: Prediction accuracy, response times
- **Business Metrics**: Revenue, user growth, feature usage

### **Logging Strategy**
```python
# Log levels and contexts
DEBUG: Development debugging
INFO: Normal operations, user actions
WARNING: Recoverable errors, rate limits
ERROR: System errors, failed operations
CRITICAL: System failures, security issues
```

## 🧪 **TESTING**

### **Test Coverage**
- **Unit Tests**: Individual function testing
- **Integration Tests**: API endpoint testing
- **Authentication Tests**: JWT and session management
- **AI Integration Tests**: Mock AI system responses
- **Payment Tests**: Mock payment gateway flows

### **Running Tests**
```bash
# Install test dependencies
pip install pytest pytest-asyncio httpx

# Run all tests
pytest

# Run with coverage
pytest --cov=. --cov-report=html

# Run specific test file
pytest tests/test_auth.py -v
```

## 🚀 **DEPLOYMENT**

### **Docker Deployment**
```dockerfile
# Dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

```bash
# Build and run
docker build -t predix-backend .
docker run -p 8000:8000 --env-file .env predix-backend
```

### **Production Configuration**
```python
# Production settings
DEBUG = False
DATABASE_POOL_SIZE = 20
REDIS_EXPIRE_SECONDS = 3600
CORS_ORIGINS = ["https://app.predix.com"]
RATE_LIMIT_REQUESTS = 1000
LOG_LEVEL = "INFO"
```

### **Environment Setup**
```bash
# Production environment
ENVIRONMENT=production
DATABASE_URL=postgresql://prod_user:secure_pass@db.predix.com:5432/predix_prod
REDIS_URL=redis://redis.predix.com:6379/0
SECRET_KEY=super-secure-production-key
PAYMENTEZ_ENVIRONMENT=prod
```

## 📈 **PERFORMANCE OPTIMIZATION**

### **Database Optimization**
- **Connection Pooling**: 20 connections with overflow
- **Query Optimization**: Indexed columns, efficient joins
- **Caching Strategy**: Redis for frequent queries
- **Pagination**: Limit large result sets

### **API Performance**
- **Async Operations**: Non-blocking I/O throughout
- **Response Compression**: Gzip compression enabled
- **Rate Limiting**: Prevent API abuse
- **Caching Headers**: Browser and CDN caching

### **Monitoring Targets**
```python
PERFORMANCE_TARGETS = {
    "api_response_time": "< 200ms (95th percentile)",
    "database_query_time": "< 50ms average",
    "ai_prediction_time": "< 2 seconds",
    "websocket_latency": "< 100ms",
    "uptime": "> 99.9%"
}
```

## 🔧 **TROUBLESHOOTING**

### **Common Issues**

#### **Database Connection Errors**
```bash
# Check database status
docker exec -it postgres psql -U predix_user -d predix_db -c "SELECT 1;"

# Reset connections
python -c "from database.connection import engine; engine.dispose()"
```

#### **AI System Connection Issues**
```bash
# Check AI system health
curl http://localhost:8001/health

# Reset circuit breaker
# Restart backend service
```

#### **Payment Webhook Issues**
```bash
# Verify webhook signature
# Check Paymentez dashboard
# Review payment logs
```

### **Debug Mode**
```bash
# Enable debug logging
export LOG_LEVEL=DEBUG
export DATABASE_ECHO=true

# Start with reload
uvicorn main:app --reload --log-level debug
```

## 📞 **SUPPORT & MAINTENANCE**

### **Monitoring Checklist**
- [ ] Database connection pool health
- [ ] Redis memory usage
- [ ] AI system response times
- [ ] Payment gateway status
- [ ] WebSocket connection count
- [ ] API error rates
- [ ] User authentication success rate

### **Regular Maintenance**
- **Daily**: Check system health, review error logs
- **Weekly**: Database performance review, user metrics
- **Monthly**: Security audit, dependency updates
- **Quarterly**: Performance optimization, capacity planning

### **Emergency Contacts**
- **Database Issues**: DBA team
- **AI System**: ML Engineering team  
- **Payment Issues**: Finance team
- **Security Issues**: Security team

---

## 🏆 **BACKEND COMPLETION STATUS**

### ✅ **FULLY IMPLEMENTED FEATURES**

1. **✅ Authentication System**
   - JWT-based authentication with refresh tokens
   - Role-based access control (User/Premium/Admin)
   - Session management and token blacklisting
   - Rate limiting and security measures

2. **✅ Database Layer**
   - PostgreSQL with SQLAlchemy ORM
   - Redis for caching and sessions
   - Comprehensive data models
   - Connection pooling and health monitoring

3. **✅ AI Integration**
   - Direct connection to AI prediction system
   - Circuit breaker pattern for reliability
   - Prediction quota management
   - Real-time result notifications

4. **✅ Payment System**
   - Paymentez integration for Ecuador/LATAM
   - Subscription management
   - Webhook processing
   - Plan-based feature access

5. **✅ Real-time Features**
   - WebSocket connections with authentication
   - Room-based messaging system
   - Live notifications and alerts
   - Connection management and cleanup

6. **✅ API Endpoints**
   - Complete REST API with OpenAPI docs
   - Input validation and error handling
   - Response formatting and pagination
   - Comprehensive endpoint coverage

7. **✅ Security & Monitoring**
   - Rate limiting and abuse prevention
   - Audit logging and error tracking
   - Health checks and system metrics
   - Production-ready security measures

### 🎯 **INTEGRATION READY**

The Predix Backend is **100% complete** and ready for:
- ✅ **Frontend Integration**: All endpoints match frontend requirements
- ✅ **AI System Connection**: Direct integration with ML models
- ✅ **Payment Processing**: Real payment gateway integration
- ✅ **Production Deployment**: Enterprise-grade reliability
- ✅ **Scalability**: Designed for high-traffic scenarios

**🚀 The backend is production-ready and fully integrated with all system components!**
