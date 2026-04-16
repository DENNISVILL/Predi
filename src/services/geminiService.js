// Servicio para interactuar con Google Gemini API (Free Tier)

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

// Función para obtener la key
const getApiKey = () => {
    // 🔒 PRIORIDAD ABSOLUTA: PRO API KEY (Environment)
    // El usuario final NO debe poner su key. Usamos la key "Pro" del sistema.
    const key = process.env.REACT_APP_GEMINI_API_KEY || localStorage.getItem('predix_gemini_key');
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
    const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

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
    // BACKEND PROXY URL (Change to production URL when deployed)
    const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
    const BACKEND_URL = `${BASE_URL}/api/chat`;

    try {
        // Build the prompt locally (or move this logic to backend later)
        const systemInstructionText = SYSTEM_INSTRUCTIONS.marketing(country);

        let contextPrompt = "";
        if (intent === 'strategy') contextPrompt = "El usuario necesita una ESTRATEGIA completa. Sé detallado, usa estructuras paso a paso y datos de mercado.";
        if (intent === 'copy') contextPrompt = "El usuario necesita COPYWRITING. Genera variaciones, usa hooks potentes y enfócate en conversión.";
        if (intent === 'hashtags') contextPrompt = "El usuario necesita HASHTAGS. Clasifícalos por volumen (Altos, Medios, Nicho).";

        // Convert history for the backend to handle (or handle here)
        // Our backend expects a 'messages' array or similar. 
        // Let's adapt to what we built in server.js: it expects 'messages' array where last one is user prompt.

        // We will construct a 'virtual' conversation history to pass to the backend
        // Note: The simple server.js I wrote takes 'messages' array.
        const history = previousMessages.slice(-10).map(msg => ({
            role: msg.type === 'user' ? 'user' : 'model',
            content: msg.content
        }));

        // Append current system instruction + context as a "pre-prompt" or implicit context in the last message
        // This preserves the "Smart Persona" logic without rewriting the backend complexly yet.
        const finalPrompt = `[INSTRUCCIONES: ${systemInstructionText}]\n[CONTEXTO: ${contextPrompt}]\n\nUSUARIO: ${input}`;

        const payload = {
            messages: [...history, { role: 'user', content: finalPrompt }],
            model: isPro ? 'gemini-2.5-flash' : 'gemini-2.5-flash'
        };

        const response = await fetch(BACKEND_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Backend Error');
        }

        return {
            success: true,
            response: data.response,
            model: 'predix-secure-backend'
        };

    } catch (error) {
        console.error('Error Gemini (Backend):', error);
        return {
            success: false,
            error: error.message,
            fallbackResponse: `❌ **Error de Conexión Segura**\n\nNo se pudo conectar con el servidor de IA protegido. Asegúrate de que el backend (puerto 5000) esté corriendo.`
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
