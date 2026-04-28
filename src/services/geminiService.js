// Servicio para interactuar con Google Gemini API (Free Tier)

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

// Función para obtener la key
const getApiKey = () => {
    // 🔒 PRIORIDAD ABSOLUTA: PRO API KEY (Environment)
    // El usuario final NO debe poner su key. Usamos la key "Pro" del sistema.
    const key = import.meta.env.VITE_GEMINI_API_KEY || localStorage.getItem('predix_gemini_key');
    return key ? key.trim() : null;
};

// ... existing code ...

// Sistema de instrucciones básico por defecto si no se pasa como argumento
// Sistema de instrucciones básico por defecto si no se pasa como argumento
const SYSTEM_INSTRUCTIONS = {
    marketing: (country) => `Eres "Predix AI", el MEJOR Community Manager y Estratega Digital del mundo.
    
    TU MISIÓN:
    Actuar como el socio estratégico de cada usuario. No eres un simple bot, eres su **Gerente de Marketing** dedicado.
    
    TUS CAPACIDADES:
    1. **Estrategia 360°**: Creas planes de contenido, calendarios y embudos de venta.
    2. **Viralidad y TENDENCIAS**: Eres experto en identificar audios virales, memes y formatos ganadores (Reels/TikTok).
    3. **Growth Hacking**: Tu objetivo final es hacer crecer el negocio (ventas, seguidores, engagement).
    4. **Adaptabilidad**: Te adaptas a cualquier nicho (comida, moda, servicios, B2B).

    TUS REGLAS DE ORO:
    - **CERO INTRODUCCIONES REPETITIVAS**: NUNCA te presentes ("Soy Predix...") si ya estamos conversando. Solo preséntate en el primer mensaje de una sesión nueva.
    - **MEMORIA ACTIVA**: Recuerda SIEMPRE lo que el usuario ya te dijo (su negocio, ciudad, nicho). No vuelvas a preguntar datos que ya te dieron.
    - Habla con autoridad pero cercanía (como un experto que trabaja codo a codo con el cliente).
    - Ve al grano: Menos teoría, más acción y tácticas aplicables hoy mismo.
    - NUNCA menciones ser una IA, ni Google, ni Gemini. Eres Predix, su Community Manager.
    - Tu contexto es ${country}.`
};

export const checkGeminiStatus = async () => {
    const BASE_URL = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_URL) || 'http://localhost:8000/api/v1';

    try {
        const response = await fetch(`${BASE_URL}/api/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                messages: [{ role: 'user', content: 'hola' }],
                model: 'gemini-2.5-flash'
            })
        });

        if (response.ok) {
            return { status: 'active', message: 'Predix AI conectado y listo' };
        } else {
            const error = await response.json().catch(() => ({}));
            console.error("Gemini Status Check Failed:", error);
            return { status: 'error', message: error.error || 'Error de conexión con el servidor' };
        }
    } catch (e) {
        // Network error - backend not running
        return { status: 'error', message: 'No se pudo conectar con el servidor' };
    }
};


export const generateGeminiResponse = async (input, intent, country = 'México', isPro = false, previousMessages = []) => {
    const apiKey = getApiKey();

    if (!apiKey) {
        return {
            success: false,
            error: 'No API Key configurada',
            fallbackResponse: `❌ **Predix AI no está configurada.**\n\nEl sistema no encontró una clave de API de Gemini. Contacta al administrador.`
        };
    }

    const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    try {
        const systemInstructionText = SYSTEM_INSTRUCTIONS.marketing(country);

        let contextPrompt = "";
        if (intent === 'strategy') contextPrompt = "El usuario necesita una ESTRATEGIA completa. Sé detallado, usa estructuras paso a paso y datos de mercado.";
        if (intent === 'copy') contextPrompt = "El usuario necesita COPYWRITING. Genera variaciones, usa hooks potentes y enfócate en conversión.";
        if (intent === 'hashtags') contextPrompt = "El usuario necesita HASHTAGS. Clasifícalos por volumen (Altos, Medios, Nicho).";

        // Construir historial en formato Gemini
        const history = previousMessages.slice(-10).map(msg => ({
            role: msg.type === 'user' ? 'user' : 'model',
            parts: [{ text: msg.content }]
        }));

        // Mensaje final del usuario con instrucciones de sistema embebidas
        const finalUserText = `[SISTEMA: ${systemInstructionText}]\n[CONTEXTO: ${contextPrompt || 'Responde de forma estratégica y directa.'}]\n\nUSUARIO: ${input}`;

        const contents = [
            ...history,
            { role: 'user', parts: [{ text: finalUserText }] }
        ];

        const payload = {
            contents,
            generationConfig: {
                temperature: 0.85,
                topK: 40,
                topP: 0.95,
                maxOutputTokens: 2048,
            }
        };

        const response = await fetch(GEMINI_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (!response.ok) {
            const errMsg = data.error?.message || 'Error desconocido en la API de Gemini';
            throw new Error(errMsg);
        }

        const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

        if (!text) throw new Error('Respuesta vacía del modelo');

        return {
            success: true,
            response: text,
            model: 'gemini-1.5-flash'
        };

    } catch (error) {
        console.error('Error Gemini Direct:', error);
        return {
            success: false,
            error: error.message,
            fallbackResponse: `❌ **Error de Conexión con Predix AI**\n\n${error.message}\n\nVerifica tu conexión a internet o intenta de nuevo en unos segundos.`
        };
    }
};

// Recomendaciones de mix de hashtags para Hashtags Inteligentes (Radar / Hashtag Lab)
export const getHashtagMixRecommendations = async ({ topic, country = 'México', baseHashtags = [] }) => {
    const topicText = topic || 'marketing digital';
  
    const prompt = `
Eres Predix AI Pro, especialista en estrategia de hashtags tipo Metahashtags.

Objetivo: generar un mix óptimo de hashtags para ${country} sobre el tema: "${topicText}".

Reglas del mix:
- 5-7 hashtags core de nicho (muy relacionados al tema y al negocio).
- 5 hashtags trending/moda (alto volumen, pero relevantes).
- 3-5 hashtags geolocalizados (país/ciudad/idioma).

Base de hashtags sugeridos por el sistema (puedes usarlos o mejorarlos):
${baseHashtags.length ? baseHashtags.map(h => `- ${h}`).join('\n') : '- (no se proporcionaron, proponlos tú)'}

Responde SOLO en español y en este formato markdown:

### Mix óptimo de Hashtags

#### Core de nicho (5-7)
- #...

#### Trending / Moda (5)
- #...

#### Geolocalizados (3-5)
- #...

### Lista lista para copiar/pegar

Hashtags (en una sola línea, separados por espacios):
...`;
  
    return generateGeminiResponse(prompt, 'hashtags', country, true);
};
