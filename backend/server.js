const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { google } = require('googleapis');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
}));
app.use(express.json());

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Routes
// Routes
const { getViralTrends } = require('./spotifyService');

// ===== RADAR INTELIGENTE — CACHÉ DE TENDENCIAS (60 MIN) =====
const trendsCache = {};
const CACHE_TTL_MS = 60 * 60 * 1000; // 60 minutos

const getCacheKey = (country, platform, niche) => `${country}_${platform}_${niche || 'all'}`;

const isCacheValid = (key) => {
    const entry = trendsCache[key];
    if (!entry) return false;
    return (Date.now() - entry.timestamp) < CACHE_TTL_MS;
};

// Prompt especializado para generar tendencias reales con Gemini
const buildTrendsPrompt = (country, platform, countryName, niche) => {
    const today = new Date().toLocaleDateString('es-ES', { 
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
    });
    
    const platformsMap = {
        all: 'TikTok, Instagram y Facebook',
        tiktok: 'TikTok',
        instagram: 'Instagram',
        facebook: 'Facebook'
    };

    const hasNiche = niche && niche !== 'all' && niche !== 'todas';
    const nicheContext = hasNiche ? `El usuario ha filtrado EXCLUSIVAMENTE por el nicho/industria de: **${niche.toUpperCase()}**. Todas las tendencias y hashtags DEBEN estar estrictamente relacionados a este sector (ej. si es Salud, tendencias médicas/fitness; si es Tecnología, gadgets/IA/software). IGNORA tendencias generales que no pertenezcan a este sector.` : `Analiza todas las tendencias generales sin importar el nicho.`;
    
    return `Eres un analista experto en Social Media y tendencias digitales. 
Hoy es ${today}.
País de análisis: ${countryName} (código: ${country})
Plataformas: ${platformsMap[platform] || 'TikTok, Instagram y Facebook'}

${nicheContext}

Genera una lista de 12 hashtags/tendencias reales y actuales que están siendo populares en ${countryName} en ${platformsMap[platform] || 'redes sociales'} en este momento.

Considera:
- Tendencias culturales, temas virales y eventos actuales de ${countryName} ${hasNiche ? 'APLICABLES AL NICHO de ' + niche.toUpperCase() : ''}.
- Mix de categorías: algunos VIRAL (explosivos), HOT (calientes), RISING (subiendo), FALLING (bajando), NEW (recientes)

Responde SOLO con un JSON válido con esta estructura exacta (sin markdown, sin texto extra):
{
  "country": "${country}",
  "platform": "${platform}",
  "generatedAt": "${new Date().toISOString()}",
  "trends": [
    {
      "hashtag": "#HashtagEjemplo",
      "platform": "tiktok",
      "mentions": 4500000,
      "growth": 450,
      "engagement": 92,
      "category": "VIRAL",
      "direction": "up",
      "positionChange": 3,
      "description": "Breve descripción de por qué es trending"
    }
  ]
}

Categorías posibles: VIRAL (crecimiento >350%), HOT (200-350%), RISING (100-200%), NEW (<100%, reciente), FALLING (decayendo)
Direction: "up" si sube, "down" si baja, "stable" si se mantiene
positionChange: número de posiciones que subió/bajó (0-10)
Distribuye los 12 hashtags entre las 3 plataformas (4 por plataforma), todos relevantes para ${countryName}.`;
};

// Endpoint: GET /api/trends/radar?country=MX&platform=all&niche=tecnologia
app.get('/api/trends/radar', async (req, res) => {
    const country = req.query.country || 'MX';
    const platform = req.query.platform || 'all';
    const niche = req.query.niche || 'all';
    const forceRefresh = req.query.refresh === 'true';
    
    const cacheKey = getCacheKey(country, platform, niche);
    
    // Retornar desde caché si es válido y no se fuerza refresh
    if (!forceRefresh && isCacheValid(cacheKey)) {
        const cached = trendsCache[cacheKey];
        return res.json({
            ...cached.data,
            fromCache: true,
            cacheExpiresIn: Math.round((CACHE_TTL_MS - (Date.now() - cached.timestamp)) / 60000) + ' min'
        });
    }
    
    // Mapa de nombres de países
    const countryNames = {
        MX: 'México', ES: 'España', CO: 'Colombia', AR: 'Argentina',
        PE: 'Perú', EC: 'Ecuador', CL: 'Chile', VE: 'Venezuela',
        US: 'Estados Unidos', BR: 'Brasil (hispanohablante)'
    };
    const countryName = countryNames[country] || country;
    
    try {
        console.log(`🎯 Radar: Generando tendencias para ${countryName} - ${platform} - Nicho: ${niche}...`);
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
        const prompt = buildTrendsPrompt(country, platform, countryName, niche);
        
        const result = await model.generateContent(prompt);
        const responseText = result.response.text().trim();
        
        // Limpiar posibles bloques de markdown si Gemini los añade
        const cleanJson = responseText
            .replace(/^```json\s*/i, '')
            .replace(/^```\s*/i, '')
            .replace(/\s*```$/i, '')
            .trim();
        
        const trendsData = JSON.parse(cleanJson);
        
        // Guardar en caché
        trendsCache[cacheKey] = {
            timestamp: Date.now(),
            data: { ...trendsData, fromCache: false, generatedAt: new Date().toISOString() }
        };
        
        console.log(`✅ Radar: ${trendsData.trends?.length || 0} tendencias generadas para ${countryName}`);
        res.json({ ...trendsData, fromCache: false });
        
    } catch (error) {
        console.error('❌ Radar Trends Error:', error.message);
        
        // Si falla, retornar caché viejo si existe
        if (trendsCache[cacheKey]) {
            return res.json({
                ...trendsCache[cacheKey].data,
                fromCache: true,
                warning: 'Usando datos en caché (error al actualizar)'
            });
        }
        
        res.status(500).json({ 
            error: 'No se pudieron obtener tendencias', 
            details: error.message 
        });
    }
});

// New Route: Spotify Viral Trends
app.get('/api/music/trends/:country', async (req, res) => {
    const { country } = req.params;
    console.log(`🎵 Fetching trends for country: ${country}`);
    const results = await getViralTrends(country);

    if (results.error === 'missing_keys') {
        return res.status(503).json({ error: 'Spotify Keys Missing in Backend' });
    }

    res.json({ data: results });
});

const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const session = require('express-session');

// Session Config with PostgreSQL Store
const pgSession = require('connect-pg-simple')(session);
const { pool, query } = require('./database');
const bcrypt = require('bcrypt');
const LocalStrategy = require('passport-local').Strategy;

// Session Config
let sessionStore;
if (pool) {
    sessionStore = new pgSession({
        pool: pool,
        tableName: 'session'
    });
} else {
    sessionStore = new session.MemoryStore(); // Fallback for local dev without DB
}

app.use(session({
    store: sessionStore,
    secret: process.env.SECRET_KEY || 'predix_secret',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 } // 30 days
}));

app.use(passport.initialize());
app.use(passport.session());

// Passport Config - Google
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:5000/auth/google/callback"
},
    async function (accessToken, refreshToken, profile, cb) {
        try {
            // Upsert User
            const email = profile.emails[0].value;
            const checkUser = await query('SELECT * FROM users WHERE email = $1', [email]);

            let user;
            if (!pool) {
                // Mock User for Dev
                user = { id: 1, google_id: profile.id, email: email, name: profile.displayName, avatar_url: profile.photos[0]?.value, google_access_token: accessToken, google_refresh_token: refreshToken };
            } else if (checkUser.rows.length > 0) {
                // Update existing user with new tokens
                user = checkUser.rows[0];
                const updatedUser = await query(
                    'UPDATE users SET google_access_token = $1, google_refresh_token = $2 WHERE email = $3 RETURNING *',
                    [accessToken, refreshToken, email]
                );
                user = updatedUser.rows[0];
            } else {
                // Create new user
                const newUser = await query(
                    'INSERT INTO users (google_id, email, name, avatar_url, google_access_token, google_refresh_token) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
                    [profile.id, email, profile.displayName, profile.photos[0]?.value, accessToken, refreshToken]
                );
                user = newUser.rows[0];
            }

            return cb(null, user);
        } catch (err) {
            return cb(err);
        }
    }
));

// Passport Config - Local (Email/Password)
passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, async (email, password, done) => {
    try {
        const res = await query('SELECT * FROM users WHERE email = $1', [email]);
        if (res.rows.length === 0) return done(null, false, { message: 'Incorrect email.' });

        const user = res.rows[0];
        if (!user.password_hash) return done(null, false, { message: 'Use Google Login specifically.' });

        const match = await bcrypt.compare(password, user.password_hash);
        if (!match) return done(null, false, { message: 'Incorrect password.' });

        return done(null, user);
    } catch (err) {
        return done(err);
    }
}));

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
    try {
        const res = await query('SELECT * FROM users WHERE id = $1', [id]);
        done(null, res.rows[0]);
    } catch (err) {
        done(err);
    }
});

// Auth Routes - Google
app.get('/auth/google',
    passport.authenticate('google', {
        scope: ['profile', 'email', 'https://www.googleapis.com/auth/calendar'],
        accessType: 'offline',
        prompt: 'consent'
    }));

app.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: process.env.FRONTEND_URL || 'http://localhost:3000/login' }),
    function (req, res) {
        res.redirect(process.env.FRONTEND_URL ? `${process.env.FRONTEND_URL}/dashboard` : 'http://localhost:3000/dashboard');
    });

// Auth Routes - Local
app.post('/auth/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // 1. Check if user exists
        const userCheck = await query('SELECT * FROM users WHERE email = $1', [email]);
        if (userCheck.rows.length > 0) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // 2. Hash Password
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        // 3. Insert User
        const newUser = await query(
            'INSERT INTO users (email, password_hash, name) VALUES ($1, $2, $3) RETURNING *',
            [email, hash, name]
        );
        let user = newUser.rows[0];

        // 4. Auto Login
        req.login(user, async (err) => {
            if (err) throw err;

            // Send Welcome Email (Async - don't wait for it)
            const { sendWelcomeEmail } = require('./emailService');
            sendWelcomeEmail(email, name).catch(err => console.error("Email send failed in background:", err));

            res.json({ message: 'Registered successfully', user: user });
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Registration failed' });
    }
});

app.post('/auth/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) return res.status(500).json({ error: 'Server error' });
        if (!user) return res.status(401).json({ error: info?.message || 'Unauthorized' });
        req.login(user, (err) => {
            if (err) return res.status(500).json({ error: 'Login error' });
            return res.json({ message: 'Logged in successfully', user: req.user });
        });
    })(req, res, next);
});

app.post('/auth/logout', (req, res) => {
    req.logout((err) => {
        if (err) return res.status(500).json({ error: 'Logout failed' });
        res.json({ message: 'Logged out' });
    });
});

app.get('/api/user', (req, res) => {
    if (req.isAuthenticated()) {
        res.json(req.user);
    } else {
        res.status(401).json({ message: 'Not authenticated' });
    }
});

app.post('/api/chat', async (req, res) => {
    try {
        const { messages, model = "gemini-2.5-flash" } = req.body;

        if (!messages || !Array.isArray(messages)) {
            return res.status(400).json({ error: "Invalid messages format" });
        }

        const geminiModel = genAI.getGenerativeModel({ model: model });

        const chat = geminiModel.startChat({
            history: messages.slice(0, -1).map(msg => ({
                role: msg.role === 'user' ? 'user' : 'model',
                parts: [{ text: msg.content }]
            })),
            generationConfig: {
                maxOutputTokens: 2048,
            },
        });

        const lastMessage = messages[messages.length - 1].content;
        const result = await chat.sendMessage(lastMessage);
        const response = await result.response;
        const text = response.text();

        res.json({ response: text });

    } catch (error) {
        console.error("Gemini API Error:", error);
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
});

// Google Calendar Sync Endpoint
app.post('/api/calendar/events', async (req, res) => {
    if (!req.isAuthenticated()) {
        return res.status(401).json({ error: "User not authenticated" });
    }

    try {
        // Retrieve fresh tokens from DB to ensure we have the latest (session might be stale?)
        // Actually req.user comes from deserializeUser which queries DB, so it should be fresh enough if session works correctly.
        // However, let's verify we have tokens
        if (!req.user.google_access_token) {
            return res.status(401).json({ error: "Google Calendar not connected. Please login again with Google." });
        }

        const oauth2Client = new google.auth.OAuth2(
            process.env.GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET,
            "http://localhost:5000/auth/google/callback"
        );

        oauth2Client.setCredentials({
            access_token: req.user.google_access_token,
            refresh_token: req.user.google_refresh_token
        });

        const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

        const { summary, description, startDateTime, endDateTime } = req.body;

        const event = {
            summary,
            description,
            start: { dateTime: startDateTime, timeZone: 'America/Guayaquil' }, // Default to Ecuador
            end: { dateTime: endDateTime, timeZone: 'America/Guayaquil' },
        };

        const response = await calendar.events.insert({
            calendarId: 'primary',
            resource: event,
        });

        res.json({ status: 'success', eventLink: response.data.htmlLink });
    } catch (error) {
        console.error("Calendar API Error:", error);
        res.status(500).json({ error: "Failed to create event", details: error.message });
    }
});

// Mock Subscription Cancel Endpoint
app.post('/api/subscription/cancel', async (req, res) => {
    if (!req.isAuthenticated()) {
        return res.status(401).json({ error: "Authenticated user required" });
    }

    // In a real implementation with Stripe/Paddle:
    // 1. Call Gateway API to cancel subscription
    // 2. Wait for Webhook or confirm immediately

    // For now, we mock success
    console.log(`[Mock] Subscription cancelled for user ${req.user.email}`);

    // Optional: Downgrade user immediately (or wait for period end in real scenarios)
    // await query('UPDATE users SET status = $1 WHERE id = $2', ['cancelled', req.user.id]);

    res.json({ status: 'success', message: 'Subscription cancelled mock' });
});

// Meta (Instagram) Trends Endpoint
app.get('/api/trends/meta', async (req, res) => {
    try {
        const accessToken = process.env.META_ACCESS_TOKEN;
        if (!accessToken) return res.status(500).json({ error: "Missing Meta Access Token" });

        // 1. Get User's Pages to find Connected Instagram Account
        const pagesRes = await fetch(`https://graph.facebook.com/v19.0/me/accounts?access_token=${accessToken}`);
        const pagesData = await pagesRes.json();

        let instagramBusinessId = null;
        if (pagesData.data && pagesData.data.length > 0) {
            // Check the first page for a connected IG account
            // For production, iteration might be needed
            const pageId = pagesData.data[0].id;
            const igRes = await fetch(`https://graph.facebook.com/v19.0/${pageId}?fields=instagram_business_account&access_token=${accessToken}`);
            const igData = await igRes.json();
            if (igData.instagram_business_account) {
                instagramBusinessId = igData.instagram_business_account.id;
            }
        }

        if (!instagramBusinessId) {
            // Fallback: Return mock data if no IG Business account found (common in dev)
            return res.json({
                source: "mock_fallback",
                data: [
                    { id: '1', caption: '#viral #music', media_type: 'VIDEO', like_count: 1200 },
                    { id: '2', caption: 'New trend alert! 🚀', media_type: 'IMAGE', like_count: 850 }
                ]
            });
        }

        // 2. Search for #viral hashtag ID
        const searchRes = await fetch(`https://graph.facebook.com/v19.0/ig_hashtag_search?user_id=${instagramBusinessId}&q=viral&access_token=${accessToken}`);
        const searchData = await searchRes.json();
        const hashtagId = searchData.data?.[0]?.id;

        if (!hashtagId) throw new Error("Hashtag not found");

        // 3. Get Top Media for Hashtag
        const mediaRes = await fetch(`https://graph.facebook.com/v19.0/${hashtagId}/top_media?user_id=${instagramBusinessId}&fields=id,caption,media_type,like_count,permalink&access_token=${accessToken}`);
        const mediaData = await mediaRes.json();

        res.json(mediaData);
    } catch (error) {
        console.error("Meta API Error:", error);
        res.status(500).json({ error: "Failed to fetch Meta trends", details: error.message });
    }
});

// TikTok Trends (Official API Placeholder)
app.get('/api/trends/tiktok', async (req, res) => {
    try {
        // Note: Official TikTok Research API requires specific approval. 
        // For now, we return a structured response that the frontend can consume.
        // In a real usage with Research API, we would query: https://open.tiktokapis.com/v2/research/video/query/

        // Simulating robust data for now while waiting for Research API approval
        res.json({
            status: "simulated_success",
            data: [
                { id: "tk1", title: "Viral Dance Challenge 2024", views: 2500000, region: "US" },
                { id: "tk2", title: "AI Tools You Need", views: 1800000, region: "GLOBAL" },
                { id: "tk3", title: "New Music Drop", views: 1200000, region: "LATAM" }
            ]
        });
    } catch (error) {
        res.status(500).json({ error: "TikTok API Error" });
    }
});

// YouTube Trends Endpoint (Restored)
app.get('/api/trends/youtube', async (req, res) => {
    try {
        const { country = 'US', categoryId = '0' } = req.query;
        const apiKey = process.env.YOUTUBE_API_KEY;

        if (!apiKey) {
            return res.status(500).json({ error: "Missing YouTube API Key" });
        }

        const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&chart=mostPopular&regionCode=${country}&videoCategoryId=${categoryId}&maxResults=10&key=${apiKey}`;

        const response = await fetch(url);
        const data = await response.json();

        if (data.error) {
            throw new Error(data.error.message);
        }

        res.json(data);
    } catch (error) {
        console.error("YouTube API Error:", error);
        res.status(500).json({ error: "Failed to fetch YouTube trends", details: error.message });
    }
});

app.get('/health', (req, res) => {
    res.json({ status: 'OK', service: 'Predix Backend' });
});

// Root Route for browser check
app.get('/', (req, res) => {
    res.send('<h1>✅ Predix Backend is Running</h1><p>Database connected. API ready.</p>');
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
