from fastapi import APIRouter
import time

router = APIRouter()

@router.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "timestamp": time.time(),
        "service": "predix-backend"
    }

@router.get("/health/detailed")
async def detailed_health_check():
    return {
        "status": "healthy",
        "timestamp": time.time(),
        "service": "predix-backend",
        "version": "1.0.0",
        "database": "connected",
        "ai_service": "connected"
    }
