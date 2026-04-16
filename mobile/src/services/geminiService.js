// Mobile Gemini Service
// Adapted for React Native environment
import AsyncStorage from '@react-native-async-storage/async-storage';

// NOTE: In a real RN app, we should use 'react-native-dotenv' or 'expo-constants'
// For this quick port, we will allow injecting the key or using a default for the verified user environment.
// Ideally, the user should put this in a .env file.
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

// Hardcoded for demo speed if env is tricky in this specific agent environment, 
// but we will try to read from a global config object we'll create or just use the logic.
// For now, I will use a placeholder or try to read it if we setup babel-plugin-transform-inline-environment-variables
// Let's assume the user will set it up or we fallback to AsyncStorage if they paste it.
const getApiKey = async () => {
    try {
        const storedKey = await AsyncStorage.getItem('predix_gemini_key');
        // PRO API KEY FALLBACK (Ideally from Env)
        // const envKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY; 
        return storedKey; // || envKey;
    } catch (e) {
        return null;
    }
};

const SYSTEM_INSTRUCTIONS = {
    marketing: (country) => `Eres "Predix AI", el MEJOR Community Manager y Estratega Digital del mundo mobil... (Adapted Mobile Prompt)...`
};

export const checkGeminiStatus = async () => {
    const apiKey = await getApiKey();
    if (!apiKey) return { status: 'inactive', message: 'No configurado' };

    try {
        const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: "Hola" }] }]
            })
        });

        if (response.ok) {
            return { status: 'active', message: 'Conectado' };
        } else {
            return { status: 'error', message: 'Error de conexión' };
        }
    } catch (e) {
        return { status: 'error', message: e.message };
    }
};

export const generateGeminiResponse = async (input, intent, country = 'México') => {
    // BACKEND PROXY URL (Change this to your Hetzner IP in production)
    // For Emulator use 'http://10.0.2.2:5000/api/chat', for real device use your PC IP.
    const BACKEND_URL = 'http://192.168.1.5:5000/api/chat'; // Cambiar por IP local o Dominio real

    try {
        const payload = {
            messages: [{ role: 'user', content: `Actúa como experto en marketing. Contexto: ${country}. Responde a: ${input}` }],
            model: 'gemini-1.5-flash'
        };

        const response = await fetch(BACKEND_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (!response.ok) throw new Error(data.error || 'Backend Error');

        return {
            success: true,
            response: data.response,
            model: 'predix-secure-backend'
        };

    } catch (error) {
        console.warn("Backend Error, trying fallback or showing error:", error);

        // OPTIONAL: Fallback to direct key if backend is down (only for dev)
        // For production, strictly fail or queue.
        return {
            success: false,
            error: "No se pudo conectar con el servidor seguro de Predix.",
            fallbackResponse: "Error de conexión con el Servidor Seguro."
        };
    }
};
