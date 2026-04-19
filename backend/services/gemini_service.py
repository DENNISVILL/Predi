"""
Gemini AI Service for Predix Backend
Handles all direct interactions with Google Gemini API:
- Trend Radar (replaces Node.js /api/trends/radar)
- Chat Estratega (replaces Node.js /api/chat)
- Community Manager Automated Plans
"""

import json
import logging
from datetime import datetime
from typing import Optional, Dict, Any, List
import re

from config.settings import settings

logger = logging.getLogger(__name__)

# In-memory cache for trends (same TTL logic as Node.js)
_trends_cache: Dict[str, Dict] = {}
CACHE_TTL_SECONDS = 60 * 60  # 60 minutes


def _get_cache_key(country: str, platform: str, niche: str) -> str:
    return f"{country}_{platform}_{niche or 'all'}"


def _is_cache_valid(key: str) -> bool:
    entry = _trends_cache.get(key)
    if not entry:
        return False
    elapsed = (datetime.utcnow() - entry["timestamp"]).total_seconds()
    return elapsed < CACHE_TTL_SECONDS


def _get_gemini_client():
    """Get Google Generative AI client"""
    try:
        import google.generativeai as genai
        if not settings.GEMINI_API_KEY:
            raise ValueError("GEMINI_API_KEY not configured in .env")
        genai.configure(api_key=settings.GEMINI_API_KEY)
        return genai
    except ImportError:
        raise ImportError("google-generativeai package not installed. Run: pip install google-generativeai")


def _clean_json_response(text: str) -> str:
    """Clean potential markdown wrappers from Gemini response"""
    text = text.strip()
    text = re.sub(r'^```json\s*', '', text, flags=re.IGNORECASE)
    text = re.sub(r'^```\s*', '', text, flags=re.IGNORECASE)
    text = re.sub(r'\s*```$', '', text, flags=re.IGNORECASE)
    return text.strip()


# ============================================
# RADAR INTELIGENTE — Migrated from Node.js
# ============================================
COUNTRY_NAMES = {
    "MX": "México", "ES": "España", "CO": "Colombia", "AR": "Argentina",
    "PE": "Perú", "EC": "Ecuador", "CL": "Chile", "VE": "Venezuela",
    "US": "Estados Unidos", "BR": "Brasil (hispanohablante)"
}

PLATFORMS_MAP = {
    "all": "TikTok, Instagram y Facebook",
    "tiktok": "TikTok",
    "instagram": "Instagram",
    "facebook": "Facebook"
}


def _build_trends_prompt(country: str, platform: str, country_name: str, niche: str) -> str:
    today = datetime.now().strftime("%A, %d de %B de %Y")
    platform_label = PLATFORMS_MAP.get(platform, "TikTok, Instagram y Facebook")
    has_niche = niche and niche not in ("all", "todas")
    niche_context = (
        f"El usuario ha filtrado EXCLUSIVAMENTE por el nicho/industria de: **{niche.upper()}**. "
        f"Todas las tendencias y hashtags DEBEN estar estrictamente relacionados a este sector."
        if has_niche
        else "Analiza todas las tendencias generales sin importar el nicho."
    )

    return f"""Eres un analista experto en Social Media y tendencias digitales.
Hoy es {today}.
País de análisis: {country_name} (código: {country})
Plataformas: {platform_label}

{niche_context}

Genera una lista de 12 hashtags/tendencias reales y actuales que están siendo populares en {country_name} en {platform_label} en este momento.

Considera:
- Tendencias culturales, temas virales y eventos actuales de {country_name}.
- Mix de categorías: VIRAL (explosivos), HOT (calientes), RISING (subiendo), FALLING (bajando), NEW (recientes)

Responde SOLO con un JSON válido con esta estructura exacta (sin markdown, sin texto extra):
{{
  "country": "{country}",
  "platform": "{platform}",
  "generatedAt": "{datetime.utcnow().isoformat()}",
  "trends": [
    {{
      "hashtag": "#HashtagEjemplo",
      "platform": "tiktok",
      "mentions": 4500000,
      "growth": 450,
      "engagement": 92,
      "category": "VIRAL",
      "direction": "up",
      "positionChange": 3,
      "description": "Breve descripción de por qué es trending"
    }}
  ]
}}

Categorías posibles: VIRAL (crecimiento >350%), HOT (200-350%), RISING (100-200%), NEW (<100%, reciente), FALLING (decayendo)
Direction: "up" si sube, "down" si baja, "stable" si se mantiene
positionChange: número de posiciones que subió/bajó (0-10)
Distribuye los 12 hashtags entre las 3 plataformas (4 por plataforma), todos relevantes para {country_name}."""


async def get_radar_trends(country: str = "MX", platform: str = "all", niche: str = "all", force_refresh: bool = False) -> Dict[str, Any]:
    """Get radar trends using Gemini AI — replaces Node.js /api/trends/radar"""
    cache_key = _get_cache_key(country, platform, niche)
    country_name = COUNTRY_NAMES.get(country, country)

    # Return from cache if valid
    if not force_refresh and _is_cache_valid(cache_key):
        cached = _trends_cache[cache_key]
        remaining = int((CACHE_TTL_SECONDS - (datetime.utcnow() - cached["timestamp"]).total_seconds()) / 60)
        return {**cached["data"], "fromCache": True, "cacheExpiresIn": f"{remaining} min"}

    try:
        genai = _get_gemini_client()
        model = genai.GenerativeModel(settings.GEMINI_DEFAULT_MODEL)
        prompt = _build_trends_prompt(country, platform, country_name, niche)

        logger.info(f"🎯 Radar: Generating trends for {country_name} - {platform} - Niche: {niche}")
        response = model.generate_content(prompt)
        raw_text = response.text.strip()
        clean_json = _clean_json_response(raw_text)
        trends_data = json.loads(clean_json)

        # Save to cache
        _trends_cache[cache_key] = {
            "timestamp": datetime.utcnow(),
            "data": {**trends_data, "fromCache": False, "generatedAt": datetime.utcnow().isoformat()}
        }

        logger.info(f"✅ Radar: {len(trends_data.get('trends', []))} trends generated for {country_name}")
        return {**trends_data, "fromCache": False}

    except Exception as e:
        logger.error(f"❌ Radar Trends Error: {e}")
        # Fallback to stale cache if exists
        if cache_key in _trends_cache:
            return {
                **_trends_cache[cache_key]["data"],
                "fromCache": True,
                "warning": "Usando datos en caché (error al actualizar)"
            }
        raise


# ============================================
# CHAT ESTRATEGA IA — Migrated from Node.js
# ============================================
async def chat_with_gemini(messages: List[Dict[str, str]], model_name: Optional[str] = None) -> str:
    """Chat with Gemini AI — replaces Node.js /api/chat"""
    if not messages:
        raise ValueError("Messages list cannot be empty")

    used_model = model_name or settings.GEMINI_DEFAULT_MODEL

    try:
        genai = _get_gemini_client()
        model = genai.GenerativeModel(used_model)

        # Build history (all but last message)
        history = []
        for msg in messages[:-1]:
            role = "user" if msg.get("role") == "user" else "model"
            history.append({
                "role": role,
                "parts": [{"text": msg.get("content", "")}]
            })

        chat = model.start_chat(history=history)
        last_message = messages[-1].get("content", "")
        result = chat.send_message(last_message)

        return result.text

    except Exception as e:
        logger.error(f"Gemini chat error: {e}")
        raise


# ============================================
# COMMUNITY MANAGER — New Feature
# ============================================

CM_SYSTEM_PROMPT = """Eres PREDIX AI — el Community Manager digital más avanzado de habla hispana.
Tu rol es actuar como un experto en redes sociales con más de 10 años de experiencia,
especializado en estrategias para LATAM y España.

Cuando el usuario te pida un plan, debes:
1. Analizar su tipo de negocio y objetivos
2. Proporcionar estrategias concretas y accionables
3. Dar ejemplos reales de contenido, no solo teoría
4. Incluir métricas (KPIs) específicas para medir el éxito
5. Adaptar el lenguaje y los ejemplos a la cultura de su país/región

NEVER menciones que eres una IA genérica. Eres PREDIX AI, el especialista de esta plataforma.
SIEMPRE responde en español, de forma profesional pero cercana."""

CM_BUSINESS_TYPES = {
    "ecommerce": "tienda online / e-commerce",
    "local": "negocio local (restaurante, tienda física, etc.)",
    "services": "servicios profesionales (consultoría, coaching, etc.)",
    "products_by_order": "productos por encargo / artesanías",
    "influencer": "influencer / creador de contenido",
    "education": "academia / educación online",
    "health": "salud y bienestar",
    "real_estate": "bienes raíces",
    "tech": "tecnología y software",
    "fashion": "moda y estilo"
}


def _build_cm_action_plan_prompt(
    business_type: str,
    business_name: str,
    target_audience: str,
    main_goal: str,
    platforms: List[str],
    country: str,
    budget_level: str
) -> str:
    """Build Community Manager action plan prompt based on PDF guides"""
    business_label = CM_BUSINESS_TYPES.get(business_type, business_type)
    platforms_str = ", ".join(platforms) if platforms else "Instagram, TikTok, Facebook"
    country_name = COUNTRY_NAMES.get(country, country)
    today = datetime.now().strftime("%B %Y")

    return f"""Eres PREDIX AI, Community Manager experto.
Hoy es {today}. El cliente está en {country_name}.

DATOS DEL CLIENTE:
- Tipo de negocio: {business_label}
- Nombre del negocio: {business_name}
- Audiencia objetivo: {target_audience}
- Objetivo principal: {main_goal}
- Plataformas a usar: {platforms_str}
- Presupuesto: {budget_level}

MISIÓN: Crea un Plan de Acción de Community Manager completo y profesional.

ESTRUCTURA DEL PLAN (responde en JSON con esta estructura exacta):
{{
  "resumen_ejecutivo": "2-3 oraciones describiendo la estrategia general",
  "diagnostico": {{
    "oportunidades": ["oportunidad 1", "oportunidad 2", "oportunidad 3"],
    "retos": ["reto 1", "reto 2"]
  }},
  "kpis": [
    {{
      "nombre": "Tasa de Engagement",
      "objetivo": "Alcanzar 5% en 3 meses",
      "formula": "Interacciones / Seguidores * 100",
      "frecuencia_medicion": "semanal"
    }}
  ],
  "frecuencia_publicacion": [
    {{
      "plataforma": "Instagram",
      "posts_por_semana": 4,
      "mejor_hora": "12:00 PM - 2:00 PM",
      "tipo_contenido_principal": "Carruseles y Reels"
    }}
  ],
  "ideas_contenido": [
    {{
      "titulo": "Título del post",
      "tipo": "Reel / Carrusel / Historia",
      "descripcion": "Descripción detallada",
      "caption_ejemplo": "Caption sugerido con emojis y hashtags",
      "hashtags": ["#hashtag1", "#hashtag2"],
      "proposito": "Educar / Entretener / Vender / Conectar"
    }}
  ],
  "calendario_mensual": [
    {{
      "semana": 1,
      "tema": "Tema central de la semana",
      "posts": [
        {{"dia": "Lunes", "plataforma": "Instagram", "tipo": "Reel", "tema": "Tema del post"}}
      ]
    }}
  ],
  "presupuesto_sugerido": {{
    "creacion_contenido": "Estimado en % o $ del presupuesto",
    "publicidad_pagada": "Estimado",
    "herramientas": "Herramientas recomendadas gratuitas y de pago",
    "total_mensual_estimado": "Rango en USD"
  }},
  "proximos_pasos": ["Paso 1 inmediato", "Paso 2", "Paso 3"]
}}

Genera contenido específico y relevante para {business_label} en {country_name}.
IDEAS DE CONTENIDO: incluye al menos 6 ideas variadas y únicas.
CALENDARIO: crea el plan para las primeras 4 semanas.
Responde SOLO el JSON sin markdown."""


async def generate_cm_action_plan(
    business_type: str,
    business_name: str,
    target_audience: str,
    main_goal: str,
    platforms: List[str],
    country: str = "MX",
    budget_level: str = "bajo (menos de $200/mes)"
) -> Dict[str, Any]:
    """Generate a complete Community Manager action plan using Gemini"""
    try:
        genai = _get_gemini_client()
        model = genai.GenerativeModel(settings.GEMINI_DEFAULT_MODEL)
        prompt = _build_cm_action_plan_prompt(
            business_type, business_name, target_audience,
            main_goal, platforms, country, budget_level
        )

        logger.info(f"🎯 CM Plan: Generating for {business_name} ({business_type}) in {country}")
        response = model.generate_content(prompt)
        raw_text = response.text.strip()
        clean_json = _clean_json_response(raw_text)
        plan_data = json.loads(clean_json)

        logger.info(f"✅ CM Plan generated successfully for {business_name}")
        return plan_data

    except json.JSONDecodeError as e:
        logger.error(f"CM Plan JSON parse error: {e}")
        raise ValueError("AI returned invalid format. Please try again.")
    except Exception as e:
        logger.error(f"CM Plan generation failed: {e}")
        raise


def _build_cm_content_ideas_prompt(
    business_type: str,
    niche: str,
    platform: str,
    quantity: int,
    country: str
) -> str:
    country_name = COUNTRY_NAMES.get(country, country)
    return f"""Eres PREDIX AI, experto en contenido viral para redes sociales.

Genera {quantity} ideas de contenido creativas y únicas para:
- Tipo de negocio: {business_type}
- Nicho/tema: {niche}
- Plataforma: {platform}
- País: {country_name}

Responde SOLO en JSON:
{{
  "ideas": [
    {{
      "id": 1,
      "titulo": "Título llamativo del post",
      "formato": "Reel / Carrusel / Historia / Post estático",
      "descripcion": "Qué contiene el post y cómo ejecutarlo",
      "caption": "Caption completo con emojis, CTA y hashtags",
      "hashtags": ["#tag1", "#tag2", "#tag3"],
      "proposito": "Educar / Entretener / Vender / Conectar / Inspirar",
      "dificultad_produccion": "Baja / Media / Alta",
      "potencial_viral": "Alto / Medio / Bajo",
      "mejor_momento": "Día y hora sugerida de publicación"
    }}
  ]
}}"""


async def generate_content_ideas(
    business_type: str,
    niche: str,
    platform: str = "instagram",
    quantity: int = 10,
    country: str = "MX"
) -> Dict[str, Any]:
    """Generate content ideas for a specific platform and niche"""
    try:
        genai = _get_gemini_client()
        model = genai.GenerativeModel(settings.GEMINI_DEFAULT_MODEL)
        prompt = _build_cm_content_ideas_prompt(business_type, niche, platform, quantity, country)

        logger.info(f"💡 Content Ideas: Generating {quantity} ideas for {platform}")
        response = model.generate_content(prompt)
        raw_text = response.text.strip()
        clean_json = _clean_json_response(raw_text)
        ideas_data = json.loads(clean_json)

        logger.info(f"✅ Content ideas generated: {len(ideas_data.get('ideas', []))} ideas")
        return ideas_data

    except Exception as e:
        logger.error(f"Content ideas generation failed: {e}")
        raise


def _build_kpi_analysis_prompt(business_type: str, platforms: List[str], main_goal: str) -> str:
    platforms_str = ", ".join(platforms)
    return f"""Eres PREDIX AI, experto en métricas y analítica de redes sociales.

Crea un dashboard de KPIs para:
- Tipo de negocio: {business_type}
- Plataformas: {platforms_str}
- Objetivo principal: {main_goal}

Responde SOLO en JSON:
{{
  "kpis_principales": [
    {{
      "nombre": "Tasa de Engagement",
      "descripcion": "Mide la interacción de tu audiencia con el contenido",
      "formula": "(Likes + Comentarios + Compartidos) / Alcance * 100",
      "objetivo_mes1": "2-3%",
      "objetivo_mes3": "4-6%",
      "objetivo_mes6": "6-8%",
      "herramienta_medicion": "Instagram Insights / Metricool",
      "frecuencia": "Semanal",
      "benchmark_industria": "Promedio del sector",
      "categoria": "Engagement / Alcance / Conversión / Crecimiento"
    }}
  ],
  "como_medir": [
    {{
      "plataforma": "Instagram",
      "herramientas_gratuitas": ["Instagram Insights", "Meta Business Suite"],
      "herramientas_pago": ["Metricool", "Hootsuite"],
      "metricas_nativas": ["Alcance", "Impresiones", "Guardados"]
    }}
  ],
  "reporte_sugerido": {{
    "frecuencia": "Mensual",
    "secciones": ["Resumen ejecutivo", "KPIs vs objetivos", "Contenido top", "Próximas acciones"]
  }}
}}"""


async def generate_kpi_dashboard(
    business_type: str,
    platforms: List[str],
    main_goal: str
) -> Dict[str, Any]:
    """Generate KPI dashboard recommendations"""
    try:
        genai = _get_gemini_client()
        model = genai.GenerativeModel(settings.GEMINI_DEFAULT_MODEL)
        prompt = _build_kpi_analysis_prompt(business_type, platforms, main_goal)

        logger.info(f"📊 KPI Dashboard: Generating for {business_type}")
        response = model.generate_content(prompt)
        raw_text = response.text.strip()
        clean_json = _clean_json_response(raw_text)
        kpi_data = json.loads(clean_json)

        logger.info("✅ KPI dashboard generated successfully")
        return kpi_data

    except Exception as e:
        logger.error(f"KPI generation failed: {e}")
        raise
