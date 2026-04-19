"""
Community Manager Routes — New Core Feature
Automated CM plans powered by Gemini AI based on professional guides.
Endpoints:
  POST /api/v1/cm/plan          → Full Action Plan
  POST /api/v1/cm/content-ideas → Content Ideas
  POST /api/v1/cm/kpis          → KPI Dashboard
  GET  /api/v1/cm/business-types → Available business types
"""

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
import logging

from services.auth_service import get_current_active_user
from services.gemini_service import (
    generate_cm_action_plan,
    generate_content_ideas,
    generate_kpi_dashboard,
    CM_BUSINESS_TYPES,
    COUNTRY_NAMES
)
from database.models import User

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/cm", tags=["Community Manager"])


# ============================================
# Request/Response Models
# ============================================

class CMActionPlanRequest(BaseModel):
    business_type: str = Field(..., description="Type of business (ecommerce, local, services, etc.)")
    business_name: str = Field(..., min_length=1, max_length=100, description="Business name")
    target_audience: str = Field(..., min_length=5, max_length=300, description="Target audience description")
    main_goal: str = Field(..., min_length=5, max_length=300, description="Main business goal")
    platforms: List[str] = Field(default=["instagram", "tiktok"], description="Social platforms to use")
    country: str = Field(default="MX", description="Country code")
    budget_level: str = Field(default="bajo (menos de $200/mes)", description="Budget level")


class ContentIdeasRequest(BaseModel):
    business_type: str = Field(..., description="Type of business")
    niche: str = Field(..., description="Specific niche or topic")
    platform: str = Field(default="instagram", description="Target platform")
    quantity: int = Field(default=10, ge=3, le=20, description="Number of ideas to generate")
    country: str = Field(default="MX", description="Country code")


class KPIDashboardRequest(BaseModel):
    business_type: str = Field(..., description="Type of business")
    platforms: List[str] = Field(default=["instagram", "tiktok"], description="Social platforms")
    main_goal: str = Field(..., description="Main business goal")


# ============================================
# Endpoints
# ============================================

@router.get("/business-types")
async def get_business_types():
    """Get available business types for Community Manager"""
    return {
        "business_types": [
            {"id": key, "label": value}
            for key, value in CM_BUSINESS_TYPES.items()
        ],
        "countries": [
            {"code": code, "name": name}
            for code, name in COUNTRY_NAMES.items()
        ],
        "platforms": [
            {"id": "instagram", "name": "Instagram"},
            {"id": "tiktok", "name": "TikTok"},
            {"id": "facebook", "name": "Facebook"},
            {"id": "youtube", "name": "YouTube"},
            {"id": "twitter", "name": "X (Twitter)"},
            {"id": "linkedin", "name": "LinkedIn"},
        ],
        "budget_options": [
            "muy bajo (menos de $50/mes)",
            "bajo (menos de $200/mes)",
            "medio ($200 - $500/mes)",
            "alto ($500 - $1000/mes)",
            "premium (más de $1000/mes)"
        ]
    }


@router.post("/plan")
async def create_action_plan(
    request: CMActionPlanRequest,
    current_user: User = Depends(get_current_active_user)
):
    """
    Generate a complete Community Manager Action Plan using Gemini AI.
    Includes KPIs, content calendar, posting frequency, content ideas, and budget.
    """
    try:
        logger.info(f"CM Plan requested by user {current_user.id} for {request.business_name}")

        plan = await generate_cm_action_plan(
            business_type=request.business_type,
            business_name=request.business_name,
            target_audience=request.target_audience,
            main_goal=request.main_goal,
            platforms=request.platforms,
            country=request.country,
            budget_level=request.budget_level
        )

        return {
            "success": True,
            "business_name": request.business_name,
            "business_type": request.business_type,
            "country": request.country,
            "plan": plan
        }

    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=str(e)
        )
    except Exception as e:
        logger.error(f"CM Plan generation failed for user {current_user.id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to generate action plan. Please check your API configuration."
        )


@router.post("/content-ideas")
async def get_content_ideas(
    request: ContentIdeasRequest,
    current_user: User = Depends(get_current_active_user)
):
    """
    Generate content ideas for a specific platform and niche.
    Each idea includes format, caption, hashtags, and viral potential.
    """
    try:
        logger.info(f"Content ideas requested by user {current_user.id} for {request.platform}")

        ideas = await generate_content_ideas(
            business_type=request.business_type,
            niche=request.niche,
            platform=request.platform,
            quantity=request.quantity,
            country=request.country
        )

        return {
            "success": True,
            "platform": request.platform,
            "niche": request.niche,
            "country": request.country,
            **ideas
        }

    except Exception as e:
        logger.error(f"Content ideas failed for user {current_user.id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to generate content ideas."
        )


@router.post("/kpis")
async def get_kpi_dashboard(
    request: KPIDashboardRequest,
    current_user: User = Depends(get_current_active_user)
):
    """
    Generate a KPI dashboard with specific metrics for the business type and platforms.
    Includes measurement formulas, objectives, and reporting templates.
    """
    try:
        logger.info(f"KPI Dashboard requested by user {current_user.id}")

        dashboard = await generate_kpi_dashboard(
            business_type=request.business_type,
            platforms=request.platforms,
            main_goal=request.main_goal
        )

        return {
            "success": True,
            "business_type": request.business_type,
            "platforms": request.platforms,
            **dashboard
        }

    except Exception as e:
        logger.error(f"KPI generation failed for user {current_user.id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to generate KPI dashboard."
        )
