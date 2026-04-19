"""
External Integrations Router for Predix Backend
Replaces all Node.js server.js endpoints:
  GET /api/v1/integrations/radar       → Gemini Trend Radar
  POST /api/v1/integrations/chat       → Gemini Chat Estratega
  GET /api/v1/integrations/music/{country} → Spotify Viral Trends
  GET /api/v1/integrations/youtube     → YouTube Trends
  GET /api/v1/integrations/meta        → Meta/Instagram Trends
  GET /api/v1/integrations/tiktok      → TikTok Trends (simulated)
"""

from fastapi import APIRouter, Depends, HTTPException, Query, status
from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
import logging

from services.auth_service import get_current_active_user
from services.gemini_service import get_radar_trends, chat_with_gemini
from services.social_media_service import (
    get_spotify_viral_trends,
    get_youtube_trends,
    get_meta_trends,
    get_tiktok_trends
)
from database.models import User

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/integrations", tags=["External Integrations"])


# ============================================
# Request/Response Models
# ============================================

class ChatMessage(BaseModel):
    role: str = Field(..., description="'user' or 'assistant'")
    content: str = Field(..., min_length=1, description="Message content")


class ChatRequest(BaseModel):
    messages: List[ChatMessage]
    model: Optional[str] = Field(default=None, description="Gemini model override")


# ============================================
# RADAR DE TENDENCIAS — Migrated from Node.js
# ============================================

@router.get("/radar")
async def get_trend_radar(
    country: str = Query(default="MX", description="Country code (MX, ES, CO, AR, etc.)"),
    platform: str = Query(default="all", description="Platform: all, tiktok, instagram, facebook"),
    niche: str = Query(default="all", description="Niche filter (e.g. tecnologia, moda, salud)"),
    refresh: bool = Query(default=False, description="Force cache refresh"),
    current_user: User = Depends(get_current_active_user)
):
    """
    Radar Inteligente de Tendencias.
    Generates real-time trends using Gemini AI with 60-minute caching.
    """
    try:
        logger.info(f"Radar trends requested: {country}/{platform}/{niche} by user {current_user.id}")
        data = await get_radar_trends(
            country=country.upper(),
            platform=platform.lower(),
            niche=niche.lower(),
            force_refresh=refresh
        )
        return data
    except Exception as e:
        logger.error(f"Radar trends error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get radar trends: {str(e)}"
        )


# ============================================
# CHAT ESTRATEGA IA — Migrated from Node.js
# ============================================

@router.post("/chat")
async def chat_estratega(
    request: ChatRequest,
    current_user: User = Depends(get_current_active_user)
):
    """
    Chat Estratega IA — Gemini-powered marketing specialist chatbot.
    Maintains conversation history for context-aware responses.
    """
    try:
        if not request.messages:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Messages list cannot be empty"
            )

        messages_dict = [{"role": m.role, "content": m.content} for m in request.messages]
        response_text = await chat_with_gemini(messages_dict, request.model)

        logger.info(f"Chat response generated for user {current_user.id}")
        return {"response": response_text, "model": request.model or "gemini-2.5-flash"}

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Chat error for user {current_user.id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Chat service unavailable. Please check Gemini API configuration."
        )


# ============================================
# MUSIC / SPOTIFY — Migrated from Node.js
# ============================================

@router.get("/music/{country}")
async def get_music_trends(
    country: str,
    current_user: User = Depends(get_current_active_user)
):
    """Get viral music trends from Spotify for a specific country."""
    try:
        result = await get_spotify_viral_trends(country.upper())
        if result.get("error") == "missing_keys":
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="Spotify API credentials not configured in backend .env"
            )
        return result
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Music trends error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch music trends"
        )


# ============================================
# YOUTUBE TRENDS — Migrated from Node.js
# ============================================

@router.get("/youtube")
async def get_youtube_trend_data(
    country: str = Query(default="US", description="Country code"),
    category_id: str = Query(default="0", description="YouTube category ID"),
    current_user: User = Depends(get_current_active_user)
):
    """Get trending videos from YouTube."""
    try:
        result = await get_youtube_trends(country.upper(), category_id)
        if result.get("error") and "API Key" in result.get("error", ""):
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="YouTube API Key not configured in backend .env"
            )
        return result
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"YouTube trends error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch YouTube trends"
        )


# ============================================
# META / INSTAGRAM — Migrated from Node.js
# ============================================

@router.get("/meta")
async def get_meta_trend_data(
    current_user: User = Depends(get_current_active_user)
):
    """Get trending content from Meta (Instagram Business API)."""
    try:
        result = await get_meta_trends()
        if result.get("error") and "Token" in result.get("error", ""):
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="Meta Access Token not configured in backend .env"
            )
        return result
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Meta trends error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch Meta trends"
        )


# ============================================
# TIKTOK — Migrated from Node.js
# ============================================

@router.get("/tiktok")
async def get_tiktok_trend_data(
    region: str = Query(default="LATAM", description="Region filter"),
    current_user: User = Depends(get_current_active_user)
):
    """
    TikTok trends.
    Official Research API pending approval — returns simulated data in the meantime.
    """
    try:
        return await get_tiktok_trends(region)
    except Exception as e:
        logger.error(f"TikTok trends error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch TikTok trends"
        )
