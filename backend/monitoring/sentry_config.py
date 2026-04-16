"""
Sentry Error Tracking Configuration
Production-ready error monitoring setup
"""
import sentry_sdk
from sentry_sdk.integrations.fastapi import FastApiIntegration
from sentry_sdk.integrations.sqlalchemy import SqlalchemyIntegration
from sentry_sdk.integrations.redis import RedisIntegration
from sentry_sdk.integrations.logging import LoggingIntegration
import logging

from config import settings, is_production

def init_sentry():
    """
    Initialize Sentry error tracking
    
    Only initializes in production or if DSN is configured
    """
    if not settings.SENTRY_DSN:
        logging.warning("Sentry DSN not configured - error tracking disabled")
        return
    
    sentry_sdk.init(
        dsn=settings.SENTRY_DSN,
        environment=settings.SENTRY_ENVIRONMENT,
        
        # Performance monitoring
        traces_sample_rate=settings.SENTRY_TRACES_SAMPLE_RATE,
        
        # Error sampling (100% in production)
        sample_rate=1.0,
        
        # Release tracking
        release=f"predix@{settings.APP_VERSION}",
        
        # Integrations
        integrations=[
            FastApiIntegration(
                transaction_style="endpoint",  # Use endpoint names for transactions
            ),
            SqlalchemyIntegration(),
            RedisIntegration(),
            LoggingIntegration(
                level=logging.INFO,  # Capture info and above as breadcrumbs
                event_level=logging.ERROR  # Send errors as events
            ),
        ],
        
        # PII handling (be careful with user data)
        send_default_pii=False,  # Don't send PII by default
        
        # Before send hook (filter sensitive data)
        before_send=before_send_hook,
        
        # Server name
        server_name=f"predix-backend-{settings.ENVIRONMENT}",
        
        # Attach stacktrace
        attach_stacktrace=True,
        
        # Max breadcrumbs
        max_breadcrumbs=50,
    )
    
    logging.info(f"✅ Sentry initialized - Environment: {settings.SENTRY_ENVIRONMENT}")


def before_send_hook(event, hint):
    """
    Filter/modify events before sending to Sentry
    
    Use this to:
    - Remove sensitive data
    - Ignore certain errors
    - Add custom context
    """
    # Don't send 404 errors
    if event.get("exception"):
        exc_type = event["exception"]["values"][0].get("type")
        if exc_type == "HTTPException":
            if event.get("contexts", {}).get("response", {}).get("status_code") == 404:
                return None  # Don't send
    
    # Remove sensitive headers
    if "request" in event:
        headers = event["request"].get("headers", {})
        sensitive_headers = ["authorization", "cookie", "x-api-key"]
        for header in sensitive_headers:
            if header in headers:
                headers[header] = "[Filtered]"
    
    return event


def capture_exception(error: Exception, context: dict = None):
    """
    Manually capture an exception
    
    Args:
        error: The exception to capture
        context: Additional context dictionary
    """
    with sentry_sdk.push_scope() as scope:
        if context:
            for key, value in context.items():
                scope.set_context(key, value)
        sentry_sdk.capture_exception(error)


def capture_message(message: str, level: str = "info", context: dict = None):
    """
    Capture a message (not an exception)
    
    Args:
        message: Message to send
        level: Severity level (debug, info, warning, error, fatal)
        context: Additional context
    """
    with sentry_sdk.push_scope() as scope:
        if context:
            for key, value in context.items():
                scope.set_context(key, value)
        sentry_sdk.capture_message(message, level=level)


def set_user_context(user_id: int, email: str = None):
    """
    Set user context for error tracking
    
    Args:
        user_id: User ID
        email: User email (optional)
    """
    sentry_sdk.set_user({
        "id": user_id,
        "email": email,
    })


def clear_user_context():
    """Clear user context (e.g., after logout)"""
    sentry_sdk.set_user(None)
