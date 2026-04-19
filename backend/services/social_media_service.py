"""
Social Media External Integrations for Predix Backend
Migrated from Node.js server.js:
  - Spotify Viral Trends
  - YouTube Trending
  - Meta/Instagram Trends
  - TikTok (simulated while waiting for official API approval)
"""

import logging
import httpx
from typing import Optional, Dict, Any, List
from config.settings import settings

logger = logging.getLogger(__name__)

# ============================================
# SPOTIFY SERVICE — Migrated from Node.js
# ============================================

_spotify_token_cache: Optional[Dict] = None


async def _get_spotify_access_token() -> Optional[str]:
    """Get Spotify access token using Client Credentials flow"""
    global _spotify_token_cache
    import time

    if _spotify_token_cache and _spotify_token_cache.get("expires_at", 0) > time.time():
        return _spotify_token_cache["access_token"]

    if not settings.SPOTIFY_CLIENT_ID or not settings.SPOTIFY_CLIENT_SECRET:
        logger.warning("Spotify credentials not configured")
        return None

    try:
        import base64
        credentials = base64.b64encode(
            f"{settings.SPOTIFY_CLIENT_ID}:{settings.SPOTIFY_CLIENT_SECRET}".encode()
        ).decode()

        async with httpx.AsyncClient() as client:
            response = await client.post(
                "https://accounts.spotify.com/api/token",
                headers={"Authorization": f"Basic {credentials}"},
                data={"grant_type": "client_credentials"},
                timeout=10.0
            )
            response.raise_for_status()
            data = response.json()

            _spotify_token_cache = {
                "access_token": data["access_token"],
                "expires_at": time.time() + data.get("expires_in", 3600) - 60
            }
            return _spotify_token_cache["access_token"]

    except Exception as e:
        logger.error(f"Spotify token error: {e}")
        return None


async def get_spotify_viral_trends(country: str = "MX") -> Dict[str, Any]:
    """Get viral music trends from Spotify"""
    access_token = await _get_spotify_access_token()

    if not access_token:
        return {"error": "missing_keys", "data": []}

    try:
        # Country code mapping
        country_map = {
            "MX": "MX", "ES": "ES", "CO": "CO", "AR": "AR",
            "PE": "PE", "EC": "EC", "CL": "CL", "US": "US"
        }
        spotify_country = country_map.get(country, "US")

        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"https://api.spotify.com/v1/browse/featured-playlists",
                headers={"Authorization": f"Bearer {access_token}"},
                params={"country": spotify_country, "limit": 10},
                timeout=15.0
            )
            response.raise_for_status()
            data = response.json()

        playlists = data.get("playlists", {}).get("items", [])
        results = []
        for playlist in playlists:
            results.append({
                "id": playlist.get("id"),
                "name": playlist.get("name"),
                "description": playlist.get("description"),
                "tracks_total": playlist.get("tracks", {}).get("total", 0),
                "image": playlist.get("images", [{}])[0].get("url"),
                "url": playlist.get("external_urls", {}).get("spotify"),
                "platform": "spotify"
            })

        logger.info(f"🎵 Spotify: {len(results)} playlists fetched for {country}")
        return {"data": results, "country": country, "source": "spotify"}

    except Exception as e:
        logger.error(f"Spotify trends error: {e}")
        return {"error": str(e), "data": []}


# ============================================
# YOUTUBE SERVICE — Migrated from Node.js
# ============================================

async def get_youtube_trends(country: str = "US", category_id: str = "0") -> Dict[str, Any]:
    """Get trending videos from YouTube"""
    if not settings.YOUTUBE_API_KEY:
        return {"error": "Missing YouTube API Key", "data": []}

    try:
        url = "https://www.googleapis.com/youtube/v3/videos"
        params = {
            "part": "snippet,statistics",
            "chart": "mostPopular",
            "regionCode": country,
            "videoCategoryId": category_id,
            "maxResults": 10,
            "key": settings.YOUTUBE_API_KEY
        }

        async with httpx.AsyncClient() as client:
            response = await client.get(url, params=params, timeout=15.0)
            response.raise_for_status()
            data = response.json()

        if data.get("error"):
            raise Exception(data["error"]["message"])

        items = data.get("items", [])
        results = []
        for item in items:
            snippet = item.get("snippet", {})
            stats = item.get("statistics", {})
            results.append({
                "id": item.get("id"),
                "title": snippet.get("title"),
                "channel": snippet.get("channelTitle"),
                "views": int(stats.get("viewCount", 0)),
                "likes": int(stats.get("likeCount", 0)),
                "comments": int(stats.get("commentCount", 0)),
                "thumbnail": snippet.get("thumbnails", {}).get("medium", {}).get("url"),
                "url": f"https://youtube.com/watch?v={item.get('id')}",
                "published_at": snippet.get("publishedAt"),
                "platform": "youtube"
            })

        logger.info(f"▶️ YouTube: {len(results)} trending videos for {country}")
        return {"data": results, "country": country, "source": "youtube"}

    except Exception as e:
        logger.error(f"YouTube trends error: {e}")
        return {"error": str(e), "data": []}


# ============================================
# META / INSTAGRAM SERVICE — Migrated from Node.js
# ============================================

async def get_meta_trends() -> Dict[str, Any]:
    """Get Instagram/Meta trending content"""
    if not settings.META_ACCESS_TOKEN:
        return {"error": "Missing Meta Access Token", "data": []}

    try:
        access_token = settings.META_ACCESS_TOKEN

        async with httpx.AsyncClient(timeout=15.0) as client:
            # Get User Pages
            pages_resp = await client.get(
                f"https://graph.facebook.com/v19.0/me/accounts",
                params={"access_token": access_token}
            )
            pages_resp.raise_for_status()
            pages_data = pages_resp.json()

            instagram_id = None
            if pages_data.get("data") and len(pages_data["data"]) > 0:
                page_id = pages_data["data"][0]["id"]
                ig_resp = await client.get(
                    f"https://graph.facebook.com/v19.0/{page_id}",
                    params={"fields": "instagram_business_account", "access_token": access_token}
                )
                ig_data = ig_resp.json()
                if ig_data.get("instagram_business_account"):
                    instagram_id = ig_data["instagram_business_account"]["id"]

            if not instagram_id:
                # Return mock data for dev environments
                return {
                    "source": "mock_fallback",
                    "data": [
                        {"id": "1", "caption": "#viral #music", "media_type": "VIDEO", "like_count": 1200},
                        {"id": "2", "caption": "New trend alert! 🚀", "media_type": "IMAGE", "like_count": 850}
                    ]
                }

            # Search for hashtag
            search_resp = await client.get(
                f"https://graph.facebook.com/v19.0/ig_hashtag_search",
                params={"user_id": instagram_id, "q": "viral", "access_token": access_token}
            )
            search_data = search_resp.json()
            hashtag_id = search_data.get("data", [{}])[0].get("id")

            if not hashtag_id:
                raise Exception("Hashtag not found")

            # Get top media
            media_resp = await client.get(
                f"https://graph.facebook.com/v19.0/{hashtag_id}/top_media",
                params={
                    "user_id": instagram_id,
                    "fields": "id,caption,media_type,like_count,permalink",
                    "access_token": access_token
                }
            )
            media_data = media_resp.json()

        logger.info(f"📸 Meta: Fetched trending media")
        return {"data": media_data.get("data", []), "source": "meta"}

    except Exception as e:
        logger.error(f"Meta trends error: {e}")
        return {"error": str(e), "data": []}


# ============================================
# TIKTOK SERVICE — Placeholder (API Approval Pending)
# ============================================

async def get_tiktok_trends(region: str = "LATAM") -> Dict[str, Any]:
    """TikTok trends — simulated while official Research API approval is pending"""
    logger.info(f"📱 TikTok: Returning simulated data for {region} (pending API approval)")
    return {
        "status": "simulated_success",
        "note": "Official TikTok Research API requires specific approval. Real data coming soon.",
        "data": [
            {"id": "tk1", "title": "Viral Dance Challenge 2025", "views": 2500000, "region": "LATAM"},
            {"id": "tk2", "title": "AI Tools You Need", "views": 1800000, "region": "GLOBAL"},
            {"id": "tk3", "title": "Receta Viral", "views": 1200000, "region": "LATAM"},
            {"id": "tk4", "title": "Negocio Exitoso Tips", "views": 980000, "region": "LATAM"},
        ]
    }
