"""
Sentry Integration for Error Tracking
Comprehensive error monitoring and performance tracking
"""

import sentry_sdk
from sentry_sdk.integrations.fastapi import FastApiIntegration
from sentry_sdk.integrations.sqlalchemy import SqlalchemyIntegration
from sentry_sdk.integrations.redis import RedisIntegration
from sentry_sdk.integrations.logging import LoggingIntegration
import logging


class SentryService:
    """Sentry error tracking and performance monitoring"""
    
    def __init__(self, dsn: str = None, environment: str = "development", traces_sample_rate: float = 1.0):
        """
        Initialize Sentry
        
        Args:
            dsn: Sentry DSN (Data Source Name)
            environment: Environment name (development, staging, production)
            traces_sample_rate: Percentage of traces to capture (0.0 to 1.0)
        """
        self.dsn = dsn
        self.environment = environment
        self.traces_sample_rate = traces_sample_rate
        self.initialized = False
    
    def initialize(self):
        """Initialize Sentry SDK"""
        if not self.dsn:
            logging.warning("⚠️ Sentry DSN not provided. Error tracking disabled.")
            return False
        
        try:
            sentry_sdk.init(
                dsn=self.dsn,
                environment=self.environment,
                traces_sample_rate=self.traces_sample_rate,
                
                # Integrations
                integrations=[
                    FastApiIntegration(),
                    SqlalchemyIntegration(),
                    RedisIntegration(),
                    LoggingIntegration(
                        level=logging.INFO,  # Capture info and above as breadcrumbs
                        event_level=logging.ERROR  # Send errors as events
                    ),
                ],
                
                # Options
                send_default_pii=False,  # Don't send personally identifiable information
                attach_stacktrace=True,
                max_breadcrumbs=50,
                debug=False,
                
                # Performance monitoring
                profiles_sample_rate=0.1,  # Profile 10% of transactions
                
                # Filter sensitive data
                before_send=self._before_send,
            )
            
            self.initialized = True
            logging.info(f"✅ Sentry initialized for environment: {self.environment}")
            return True
            
        except Exception as e:
            logging.error(f"❌ Failed to initialize Sentry: {e}")
            return False
    
    def _before_send(self, event, hint):
        """
        Filter and modify events before sending to Sentry
        Remove sensitive information
        """
        # Remove sensitive headers
        if 'request' in event and 'headers' in event['request']:
            headers = event['request']['headers']
            sensitive_headers = ['Authorization', 'Cookie', 'X-API-Key']
            for header in sensitive_headers:
                if header in headers:
                    headers[header] = '[Filtered]'
        
        # Remove sensitive query params
        if 'request' in event and 'query_string' in event['request']:
            query = event['request']['query_string']
            if query and ('password' in query.lower() or 'token' in query.lower()):
                event['request']['query_string'] = '[Filtered]'
        
        return event
    
    def capture_exception(self, exception: Exception, context: dict = None):
        """
        Manually capture an exception
        
        Args:
            exception: The exception to capture
            context: Additional context to attach
        """
        if not self.initialized:
            return None
        
        with sentry_sdk.push_scope() as scope:
            if context:
                for key, value in context.items():
                    scope.set_context(key, value)
            
            return sentry_sdk.capture_exception(exception)
    
    def capture_message(self, message: str, level: str = "info"):
        """
        Capture a message
        
        Args:
            message: Message to capture
            level: Severity level (debug, info, warning, error, fatal)
        """
        if not self.initialized:
            return None
        
        return sentry_sdk.capture_message(message, level=level)
    
    def set_user(self, user_id: int = None, email: str = None, username: str = None):
        """
        Set user context for error tracking
        
        Args:
            user_id: User ID
            email: User email (will be filtered if send_pii is False)
            username: Username
        """
        if not self.initialized:
            return
        
        user_data = {}
        if user_id:
            user_data["id"] = user_id
        if email:
            user_data["email"] = email
        if username:
            user_data["username"] = username
        
        sentry_sdk.set_user(user_data)
    
    def set_tag(self, key: str, value: str):
        """Set a tag for filtering in Sentry"""
        if not self.initialized:
            return
        
        sentry_sdk.set_tag(key, value)
    
    def set_context(self, name: str, context: dict):
        """Set additional context"""
        if not self.initialized:
            return
        
        sentry_sdk.set_context(name, context)
    
    def start_transaction(self, name: str, op: str = "function"):
        """
        Start a performance transaction
        
        Args:
            name: Transaction name
            op: Operation type (e.g., "function", "db.query", "http.request")
        
        Returns:
            Transaction context manager
        """
        if not self.initialized:
            return DummyTransaction()
        
        return sentry_sdk.start_transaction(name=name, op=op)


class DummyTransaction:
    """Dummy transaction for when Sentry is not initialized"""
    def __enter__(self):
        return self
    
    def __exit__(self, *args):
        pass


# Global Sentry service instance
sentry_service = None


def init_sentry(dsn: str = None, environment: str = "development"):
    """
    Initialize global Sentry service
    
    Args:
        dsn: Sentry DSN
        environment: Environment name
    
    Returns:
        SentryService instance
    """
    global sentry_service
    sentry_service = SentryService(dsn=dsn, environment=environment)
    sentry_service.initialize()
    return sentry_service


def get_sentry() -> SentryService:
    """Get global Sentry service instance"""
    global sentry_service
    if not sentry_service:
        sentry_service = SentryService()
    return sentry_service
