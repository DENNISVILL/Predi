"""
Security Middleware para FastAPI
Implementa headers de seguridad similares a Helmet.js
"""

from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware
from typing import Callable
import time

class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    """
    Middleware que agrega headers de seguridad HTTP
    Equivalente a Helmet.js para Node.js
    """
    
    async def dispatch(self, request: Request, call_next: Callable):
        # Procesar request
        start_time = time.time()
        response = await call_next(request)
        
        # Headers de seguridad
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["X-XSS-Protection"] = "1; mode=block"
        response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        response.headers["Permissions-Policy"] = "geolocation=(), microphone=(), camera=()"
        
        # Content Security Policy
        csp = ";".join([
            "default-src 'self'",
            "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
            "style-src 'self' 'unsafe-inline'",
            "img-src 'self' data: https:",
            "font-src 'self' data:",
            "connect-src 'self' https://api.predix.com",
            "frame-ancestors 'none'",
            "base-uri 'self'",
            "form-action 'self'"
        ])
        response.headers["Content-Security-Policy"] = csp
        
        # Request ID para tracking
        request_id = request.headers.get("X-Request-ID", f"req-{int(time.time() * 1000)}")
        response.headers["X-Request-ID"] = request_id
        
        # Tiempo de procesamiento
        process_time = time.time() - start_time
        response.headers["X-Process-Time"] = str(process_time)
        
        return response


class RateLimitHeadersMiddleware(BaseHTTPMiddleware):
    """
    Middleware que agrega headers de rate limiting
    """
    
    async def dispatch(self, request: Request, call_next: Callable):
        response = await call_next(request)
        
        # Headers de rate limiting (si hay redis disponible)
        if hasattr(request.app.state, 'redis') and request.app.state.redis:
            # Estos se pueden agregar dinámicamente basado en el tier del usuario
            response.headers["X-RateLimit-Limit"] = "100"
            response.headers["X-RateLimit-Remaining"] = "99"
            response.headers["X-RateLimit-Reset"] = str(int(time.time()) + 60)
        
        return response
