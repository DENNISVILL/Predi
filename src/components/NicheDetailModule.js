// 🎯 MÓDULO DETALLADO POR NICHO - SISTEMA COMPLETO INDIVIDUAL
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Target, TrendingUp, Search, Share2, Eye, Heart,
  PenTool, Music, Hash, Clock, Users, Zap, Star,
  Instagram, Youtube, MessageCircle, Play, Download,
  BarChart3, ArrowRight, Filter, RefreshCw, Sparkles,
  Brain, Wand2, CheckCircle, AlertTriangle, Info
} from 'lucide-react';

const NicheDetailModule = ({ selectedNiche, onBack }) => {
  const [activeTab, setActiveTab] = useState('copys');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState('all');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState([]);

  // Configuración completa por nicho
  // Generadores automáticos por nicho
  const hashtagGenerators = {
    fitness: () => {
      const base = ['#fitness', '#workout', '#gym', '#health', '#fit'];
      const specific = ['#transformation', '#gains', '#muscle', '#cardio', '#strength', '#fitfam', '#bodybuilding', '#crossfit', '#yoga', '#pilates'];
      const trending = ['#fitcheck', '#gymtok', '#workoutmotivation', '#fitnessjourney', '#healthylifestyle'];
      return [...base, ...specific.slice(0, 3), ...trending.slice(0, 2)];
    },
    food: () => {
      const base = ['#food', '#recipe', '#cooking', '#foodie', '#delicious'];
      const specific = ['#homecooking', '#easyrecipes', '#foodhacks', '#baking', '#healthy', '#comfort', '#quickmeals', '#foodprep'];
      const trending = ['#foodtok', '#recipeoftheday', '#cookinghacks', '#foodasmr', '#recipeshare'];
      return [...base, ...specific.slice(0, 3), ...trending.slice(0, 2)];
    },
    fashion: () => {
      const base = ['#fashion', '#style', '#outfit', '#ootd', '#trendy'];
      const specific = ['#fashionista', '#styleinspo', '#lookbook', '#fashionhacks', '#thrifted', '#vintage', '#streetstyle'];
      const trending = ['#fashiontok', '#outfitcheck', '#stylecheck', '#fashiontrends', '#outfitinspo'];
      return [...base, ...specific.slice(0, 3), ...trending.slice(0, 2)];
    },
    tech: () => {
      const base = ['#tech', '#technology', '#gadgets', '#innovation', '#digital'];
      const specific = ['#smartphone', '#ai', '#coding', '#software', '#hardware', '#apps', '#techreview', '#future'];
      const trending = ['#techtok', '#techtrends', '#gadgetreview', '#techlife', '#innovation2024'];
      return [...base, ...specific.slice(0, 3), ...trending.slice(0, 2)];
    },
    business: () => {
      const base = ['#business', '#entrepreneur', '#startup', '#success', '#money'];
      const specific = ['#hustle', '#mindset', '#leadership', '#marketing', '#sales', '#growth', '#productivity', '#investing'];
      const trending = ['#businesstok', '#entrepreneurlife', '#businesstips', '#moneytips', '#successmindset'];
      return [...base, ...specific.slice(0, 3), ...trending.slice(0, 2)];
    },
    lifestyle: () => {
      const base = ['#lifestyle', '#selfcare', '#wellness', '#mindfulness', '#balance'];
      const specific = ['#morningroutine', '#productivity', '#habits', '#motivation', '#inspiration', '#positivity', '#growth'];
      const trending = ['#lifestyletok', '#selfcareroutine', '#thatgirl', '#wellnessjourney', '#mindsetshift'];
      return [...base, ...specific.slice(0, 3), ...trending.slice(0, 2)];
    },
    education: () => {
      const base = ['#education', '#learning', '#study', '#knowledge', '#school'];
      const specific = ['#studytips', '#studyhacks', '#university', '#skills', '#tutorial', '#educational', '#learning'];
      const trending = ['#studytok', '#learnontiktok', '#studywithme', '#educationtok', '#knowledgeispower'];
      return [...base, ...specific.slice(0, 3), ...trending.slice(0, 2)];
    },
    travel: () => {
      const base = ['#travel', '#wanderlust', '#adventure', '#explore', '#vacation'];
      const specific = ['#backpacking', '#solo', '#budget', '#luxury', '#destinations', '#culture', '#nature'];
      const trending = ['#traveltok', '#travelgram', '#wanderer', '#exploremore', '#traveladdict'];
      return [...base, ...specific.slice(0, 3), ...trending.slice(0, 2)];
    },
    gaming: () => {
      const base = ['#gaming', '#gamer', '#videogames', '#esports', '#twitch'];
      const specific = ['#gameplay', '#streaming', '#console', '#pc', '#mobile', '#competitive', '#casual'];
      const trending = ['#gamingtok', '#gaminglife', '#gamingcommunity', '#gamingsetup', '#gamingclips'];
      return [...base, ...specific.slice(0, 3), ...trending.slice(0, 2)];
    },
    art: () => {
      const base = ['#art', '#artist', '#creative', '#drawing', '#painting'];
      const specific = ['#artwork', '#illustration', '#design', '#sketch', '#digital', '#traditional', '#artistic'];
      const trending = ['#arttok', '#artistsoftiktok', '#artprocess', '#creativetok', '#artchallenge'];
      return [...base, ...specific.slice(0, 3), ...trending.slice(0, 2)];
    },
    home: () => {
      const base = ['#home', '#homedecor', '#interior', '#diy', '#decoration'];
      const specific = ['#homedesign', '#organize', '#makeover', '#renovation', '#cozy', '#aesthetic', '#homehacks'];
      const trending = ['#hometok', '#homedecortok', '#diytok', '#homedesign', '#interiordesign'];
      return [...base, ...specific.slice(0, 3), ...trending.slice(0, 2)];
    },
    pets: () => {
      const base = ['#pets', '#dogs', '#cats', '#animals', '#petcare'];
      const specific = ['#puppy', '#kitten', '#pettraining', '#furbaby', '#petlover', '#rescue', '#petlife'];
      const trending = ['#petstok', '#dogsoftiktok', '#catsoftiktok', '#petparent', '#animallovers'];
      return [...base, ...specific.slice(0, 3), ...trending.slice(0, 2)];
    },
    entertainment: () => {
      const base = ['#entertainment', '#celebrity', '#movies', '#series', '#music'];
      const specific = ['#popculture', '#viral', '#trending', '#drama', '#gossip', '#reviews', '#reactions'];
      const trending = ['#entertainmenttok', '#movietok', '#seriestok', '#celebritynews', '#popculture'];
      return [...base, ...specific.slice(0, 3), ...trending.slice(0, 2)];
    },
    sports: () => {
      const base = ['#sports', '#athlete', '#training', '#fitness', '#competition'];
      const specific = ['#football', '#basketball', '#soccer', '#tennis', '#running', '#swimming', '#cycling'];
      const trending = ['#sportstok', '#athletelife', '#sportslife', '#training', '#sportsmotivation'];
      return [...base, ...specific.slice(0, 3), ...trending.slice(0, 2)];
    },
    family: () => {
      const base = ['#family', '#parenting', '#kids', '#mom', '#dad'];
      const specific = ['#parentlife', '#children', '#baby', '#toddler', '#parentingtips', '#familytime', '#motherhood'];
      const trending = ['#parenttok', '#momtok', '#dadtok', '#familylife', '#parentingwin'];
      return [...base, ...specific.slice(0, 3), ...trending.slice(0, 2)];
    },
    sustainability: () => {
      const base = ['#sustainability', '#ecofriendly', '#zerowaste', '#green', '#environment'];
      const specific = ['#sustainable', '#eco', '#climatechange', '#renewable', '#organic', '#natural', '#conscious'];
      const trending = ['#ecotok', '#sustainableliving', '#zerowastetips', '#greenliving', '#climateaction'];
      return [...base, ...specific.slice(0, 3), ...trending.slice(0, 2)];
    }
  };

  const copyGenerators = {
    fitness: (platform) => {
      const templates = {
        tiktok: [
          "POV: Empezaste el gym hace 3 meses 💪 #transformation",
          "Esta rutina de 10 min cambió mi vida ✨ ¿La pruebas?",
          "Nadie me dijo que el gym era tan adictivo 😅",
          "Plot twist: El ejercicio SÍ funciona 🤯",
          "Yo vs yo hace 6 meses 📈"
        ],
        instagram: [
          "Transformación que inspira 💪✨ Constancia > Perfección",
          "6 meses de dedicación. Los resultados hablan por sí solos 📈",
          "Rutina matutina que cambió mi vida 🌅 ¿Te animas?",
          "Progreso, no perfección 💯 Cada día cuenta",
          "De cero a héroe fitness 🚀 Tu momento es AHORA"
        ],
        youtube: [
          "RUTINA COMPLETA de 30 MIN | Sin equipos | Resultados GARANTIZADOS",
          "Cómo TRANSFORMÉ mi cuerpo en 90 días | Mi historia REAL",
          "10 ERRORES que cometes en el gym (y cómo evitarlos)",
          "MEAL PREP para toda la semana | Fácil y económico",
          "Mi rutina matutina para estar FIT | 5AM Club"
        ]
      };
      return templates[platform] || templates.tiktok;
    },
    food: (platform) => {
      const templates = {
        tiktok: [
          "POV: Haces esta receta y toda tu familia te pide más 🤤",
          "5 ingredientes = Cena perfecta ✨ Guarda para después",
          "Hack de cocina que tu abuela no te enseñó 👵",
          "Plot twist: Cocinar SÍ puede ser fácil 🤯",
          "Cuando la receta sale perfecta a la primera 😎"
        ],
        instagram: [
          "Receta familiar que nunca falla 👨‍👩‍👧‍👦 Guarda para el finde",
          "5 ingredientes, 20 minutos, sabor increíble 🤤",
          "Comfort food que abraza el alma ✨ ¿Cuál es el tuyo?",
          "De la cocina con amor 💕 Receta de la abuela",
          "Domingo de meal prep 📦 Semana organizada"
        ],
        youtube: [
          "RECETAS FÁCILES para toda la semana | Meal prep económico",
          "Cómo cocinar como un CHEF | Técnicas básicas que cambiarán tu cocina",
          "10 RECETAS con 5 ingredientes | Cocina minimalista",
          "POSTRES sin horno | Fáciles y deliciosos",
          "Cocina saludable SIN sacrificar el sabor"
        ]
      };
      return templates[platform] || templates.tiktok;
    },
    fashion: (platform) => {
      const templates = {
        tiktok: [
          "POV: Encontraste el outfit perfecto en tu closet 👗",
          "Outfit de $30 que parece de $300 ✨ Tutorial completo",
          "Plot twist: No necesitas ropa nueva, necesitas creatividad 🤯",
          "Cuando el outfit queda mejor de lo esperado 😎",
          "Styling hack que cambió mi forma de vestir 💫"
        ],
        instagram: [
          "Outfit del día que me tiene enamorada 💕 ¿Qué opinas?",
          "Menos es más ✨ Minimalismo que enamora",
          "Styling tip: Una pieza statement cambia todo 👗",
          "Confidence level: Este outfit 💯",
          "Vintage vibes con toque moderno 🌟"
        ],
        youtube: [
          "CÓMO crear 20 OUTFITS con 10 piezas | Capsule wardrobe",
          "STYLING HACKS que toda mujer debe conocer",
          "THRIFT FLIP | Transformo ropa vintage en tendencia",
          "Mi RUTINA de outfit planning | Nunca más 'no tengo qué ponerme'",
          "FASHION HAUL | Finds increíbles con presupuesto"
        ]
      };
      return templates[platform] || templates.tiktok;
    },
    tech: (platform) => {
      const templates = {
        tiktok: [
          "POV: Descubriste esta app y cambió tu vida 📱",
          "Hack de teléfono que el 99% no conoce 🤯",
          "Plot twist: La IA SÍ puede hacer esto 🤖",
          "Cuando la tecnología te sorprende así 😱",
          "App gratuita que vale millones ✨"
        ],
        instagram: [
          "Tecnología que está cambiando el mundo 🌍 ¿La conocías?",
          "Setup tech que inspira productividad 💻✨",
          "Innovation at its finest 🚀 El futuro es HOY",
          "Tech tip que necesitas en tu vida 📱💡",
          "Gadget review: Worth it or skip it? 🤔"
        ],
        youtube: [
          "REVIEW COMPLETO | ¿Vale la pena en 2024?",
          "10 APPS que cambiarán tu productividad",
          "SETUP TECH completo | Mi estación de trabajo",
          "TECNOLOGÍA del FUTURO que puedes usar HOY",
          "COMPARATIVA épica | ¿Cuál elegir?"
        ]
      };
      return templates[platform] || templates.tiktok;
    },
    business: (platform) => {
      const templates = {
        tiktok: [
          "POV: Empezaste tu negocio y ya generas $X 💰",
          "Business tip que me hubiera gustado saber antes 📈",
          "Plot twist: Emprender SÍ es para ti 🚀",
          "Cuando tu idea de negocio funciona 😎",
          "Error de $10K que puedes evitar ⚠️"
        ],
        instagram: [
          "Entrepreneurship journey: Month 6 update 📊",
          "Business mindset que cambió mi vida 💭✨",
          "From idea to $X revenue 🚀 Here's how",
          "Monday motivation for entrepreneurs 💪",
          "Building an empire, one step at a time 👑"
        ],
        youtube: [
          "Cómo gané $X en mi PRIMER mes | Estrategia completa",
          "ERRORES de emprendedor que me costaron $X",
          "Mi RUTINA matutina de CEO | 5AM productivity",
          "BUSINESS PLAN que me llevó al éxito",
          "De EMPLEADO a EMPRESARIO | Mi historia"
        ]
      };
      return templates[platform] || templates.tiktok;
    },
    lifestyle: (platform) => {
      const templates = {
        tiktok: [
          "POV: Cambiaste tu rutina y tu vida mejoró 100% ✨",
          "Self-care Sunday que necesitas copiar 🛁",
          "Plot twist: El self-care SÍ funciona 💆‍♀️",
          "Cuando tu glow up es de adentro hacia afuera ✨",
          "Hábito que cambió mi vida en 30 días 🌟"
        ],
        instagram: [
          "Sunday reset ritual 🌸 Ready for the week",
          "That girl energy activated ✨ Who's with me?",
          "Mindful moments in a chaotic world 🧘‍♀️",
          "Self-love Sunday vibes 💕 You deserve it",
          "Living my best life, one day at a time 🌟"
        ],
        youtube: [
          "Mi RUTINA matutina que cambió mi vida",
          "SELF-CARE routine para busy girls",
          "Cómo ser PRODUCTIVA sin burnout",
          "GLOW UP mental | Mindset transformation",
          "THAT GIRL morning routine | 5AM club"
        ]
      };
      return templates[platform] || templates.tiktok;
    },
    education: (platform) => {
      const templates = {
        tiktok: [
          "POV: Aprendiste esto y tu mente explotó 🤯",
          "Study hack que me salvó en los exámenes 📚",
          "Plot twist: Aprender SÍ puede ser divertido 🎓",
          "Cuando el conocimiento te da superpoderes 💪",
          "Fact que el 90% no sabe 🧠"
        ],
        instagram: [
          "Knowledge is power 📚✨ What are you learning?",
          "Study aesthetic that motivates 📖☕",
          "Learning something new every day 🌱",
          "Education is the key to everything 🗝️",
          "Investing in my mind 🧠💎"
        ],
        youtube: [
          "Cómo ESTUDIAR de forma EFECTIVA | Técnicas probadas",
          "APRENDÍ esto en 30 días | Mi método",
          "STUDY WITH ME | 8 horas de productividad",
          "SKILLS que necesitas aprender en 2024",
          "De CERO a EXPERTO | Mi journey de aprendizaje"
        ]
      };
      return templates[platform] || templates.tiktok;
    },
    travel: (platform) => {
      const templates = {
        tiktok: [
          "POV: Viajaste con $X y fue épico 🌍",
          "Travel hack que me ahorró $500 ✈️",
          "Plot twist: Viajar barato SÍ es posible 💰",
          "Cuando el destino supera tus expectativas 😍",
          "Lugar secreto que pocos conocen 🗺️"
        ],
        instagram: [
          "Wanderlust activated 🌍✨ Next destination?",
          "Travel memories that last forever 📸",
          "Exploring the world, one city at a time 🗺️",
          "Adventure awaits 🎒 Where to next?",
          "Collecting moments, not things ✨"
        ],
        youtube: [
          "VIAJÉ X días con solo $X | Budget travel",
          "TRAVEL VLOG | Destino increíble que debes conocer",
          "TRAVEL HACKS que me cambiaron la vida",
          "SOLO TRAVEL | Mi primera vez y qué aprendí",
          "TRAVEL GUIDE completa | Todo lo que necesitas saber"
        ]
      };
      return templates[platform] || templates.tiktok;
    },
    gaming: (platform) => {
      const templates = {
        tiktok: [
          "POV: Hiciste esta jugada y todos enloquecieron 🎮",
          "Gaming tip que te hará pro instantáneo 🏆",
          "Plot twist: Este truco funciona en todos los juegos 🤯",
          "Cuando la suerte y skill se combinan perfectamente 😎",
          "Combo secreto que pocos conocen 🔥"
        ],
        instagram: [
          "Gaming setup goals 🎮✨ Rate my station",
          "Victory royale vibes 🏆 Who's gaming tonight?",
          "Level up your game 📈 Practice makes perfect",
          "Gaming community is the best 🎮❤️",
          "New high score unlocked 🚀"
        ],
        youtube: [
          "GAMEPLAY ÉPICO | Jugada que nadie esperaba",
          "GAMING SETUP tour | Mi estación completa",
          "TIPS PRO que me hicieron mejor gamer",
          "REACCIÓN a mi primera victoria | Emotional",
          "GAMING CHALLENGE | ¿Podré completarlo?"
        ]
      };
      return templates[platform] || templates.tiktok;
    },
    art: (platform) => {
      const templates = {
        tiktok: [
          "POV: Transformaste esto en una obra de arte 🎨",
          "Art hack que cambió mi técnica para siempre ✨",
          "Plot twist: Cualquiera puede ser artista 🖌️",
          "Cuando el arte fluye sin esfuerzo 😌",
          "Materiales baratos, resultado profesional 💎"
        ],
        instagram: [
          "Art is my therapy 🎨✨ What's yours?",
          "Creating magic with simple tools 🖌️",
          "Art process that mesmerizes 👁️",
          "Every stroke tells a story 📖",
          "Turning imagination into reality 🌟"
        ],
        youtube: [
          "TUTORIAL COMPLETO | Técnica paso a paso",
          "ART SUPPLIES review | ¿Valen la pena?",
          "Mi PROCESO creativo | From sketch to masterpiece",
          "ART CHALLENGE | 24 horas para crear esto",
          "TRANSFORMACIÓN artística | Before vs After"
        ]
      };
      return templates[platform] || templates.tiktok;
    },
    home: (platform) => {
      const templates = {
        tiktok: [
          "POV: Decoraste tu cuarto con $50 y quedó increíble 🏠",
          "DIY hack que parece de Pinterest 📌",
          "Plot twist: No necesitas gastar mucho para decorar ✨",
          "Cuando el antes y después te sorprende 😱",
          "Organización que cambió mi vida 📦"
        ],
        instagram: [
          "Home sweet home 🏠✨ Cozy vibes activated",
          "DIY project completed 🔨 Feeling accomplished",
          "Home decor on a budget 💰 Proof it's possible",
          "Creating my sanctuary 🕯️ One room at a time",
          "Home organization goals 📋 Marie Kondo approved"
        ],
        youtube: [
          "ROOM MAKEOVER completo | $100 budget challenge",
          "DIY DECOR que parece comprado | Tutorial fácil",
          "ORGANIZACIÓN extrema | Método que funciona",
          "HOME TOUR | Mi espacio después del makeover",
          "DECORACIÓN aesthetic | Tips y trucos"
        ]
      };
      return templates[platform] || templates.tiktok;
    },
    pets: (platform) => {
      const templates = {
        tiktok: [
          "POV: Tu mascota aprendió este truco en 1 día 🐕",
          "Pet hack que todos los dueños deben saber 🐾",
          "Plot twist: Tu mascota es más inteligente de lo que pensabas 🤯",
          "Cuando tu pet hace algo épico 😍",
          "Reacción de mi mascota que me derritió ❤️"
        ],
        instagram: [
          "Pet parent life 🐾❤️ Wouldn't change it",
          "Unconditional love in its purest form 🥰",
          "My furry best friend 🐕✨",
          "Pet training success 🏆 Proud parent moment",
          "Adventures with my four-legged buddy 🌟"
        ],
        youtube: [
          "ENTRENAMIENTO completo | Cómo enseñar este truco",
          "PET CARE routine | Todo lo que hago diariamente",
          "MI MASCOTA reacciona a... | Compilation épica",
          "PET HAUL | Productos que realmente funcionan",
          "RESCUE STORY | Cómo cambió nuestras vidas"
        ]
      };
      return templates[platform] || templates.tiktok;
    },
    entertainment: (platform) => {
      const templates = {
        tiktok: [
          "POV: Viste este plot twist y tu mente explotó 🤯",
          "Celebrity tea que nadie está hablando ☕",
          "Plot twist: Esta teoría tiene mucho sentido 🧠",
          "Cuando el drama es mejor que la ficción 🍿",
          "Easter egg que el 99% no notó 👀"
        ],
        instagram: [
          "Entertainment news that broke the internet 📱",
          "Pop culture moment we'll never forget ✨",
          "Celebrity style inspiration 👗 Iconic look",
          "Movie night vibes 🍿 What are we watching?",
          "Series recommendation that will hook you 📺"
        ],
        youtube: [
          "REACCIÓN épica | No puedo creer lo que pasó",
          "TEORÍAS locas que podrían ser ciertas",
          "CELEBRITY DRAMA explicado | Todo el tea",
          "REVIEW honesta | ¿Vale la pena tu tiempo?",
          "ENTERTAINMENT NEWS | Lo que necesitas saber"
        ]
      };
      return templates[platform] || templates.tiktok;
    },
    sports: (platform) => {
      const templates = {
        tiktok: [
          "POV: Hiciste esta jugada y todos enloquecieron ⚽",
          "Training tip que usan los profesionales 🏆",
          "Plot twist: Este ejercicio mejora todo tu juego 💪",
          "Cuando el entrenamiento da resultados 📈",
          "Técnica secreta de atletas de élite 🥇"
        ],
        instagram: [
          "Training hard, dreaming big 💪 No shortcuts",
          "Athletic mindset activated 🏆 Champions mentality",
          "Sports is life 🏃‍♂️ What's your passion?",
          "Victory tastes sweeter after hard work 🥇",
          "Pushing limits every single day 📈"
        ],
        youtube: [
          "ENTRENAMIENTO completo | Rutina de atleta profesional",
          "TÉCNICAS avanzadas | Mejora tu rendimiento",
          "MI JOURNEY deportivo | De amateur a competitivo",
          "SPORTS ANALYSIS | Jugada que cambió el juego",
          "MOTIVACIÓN deportiva | Mentalidad de campeón"
        ]
      };
      return templates[platform] || templates.tiktok;
    },
    family: (platform) => {
      const templates = {
        tiktok: [
          "POV: Tu hijo hizo esto y te derritió el corazón ❤️",
          "Parenting hack que me salvó la vida 👶",
          "Plot twist: Los niños SÍ escuchan todo 😅",
          "Cuando ser padre te sorprende así 🥰",
          "Momento familiar que guardaré para siempre 📸"
        ],
        instagram: [
          "Family time is the best time ❤️ Grateful always",
          "Parenting: hardest job, biggest reward 👶✨",
          "Making memories one day at a time 📸",
          "Family love that fills my heart 💕",
          "Watching them grow is pure magic 🌟"
        ],
        youtube: [
          "PARENTING TIPS que realmente funcionan",
          "FAMILY VLOG | Día típico en nuestra casa",
          "ACTIVIDADES familiares | Ideas para el fin de semana",
          "PARENTING FAILS | Aprendiendo sobre la marcha",
          "FAMILY TRADITIONS | Creando recuerdos especiales"
        ]
      };
      return templates[platform] || templates.tiktok;
    },
    sustainability: (platform) => {
      const templates = {
        tiktok: [
          "POV: Cambiaste este hábito y salvaste el planeta 🌍",
          "Eco hack que todos deberíamos conocer ♻️",
          "Plot twist: Ser eco-friendly SÍ es fácil 🌱",
          "Cuando pequeños cambios hacen gran diferencia 💚",
          "Swap sostenible que cambió mi vida ✨"
        ],
        instagram: [
          "Small changes, big impact 🌍💚 Every action counts",
          "Sustainable living journey 🌱 One step at a time",
          "Eco-conscious choices for a better tomorrow ♻️",
          "Green lifestyle inspiration 💚 Join the movement",
          "Protecting our planet, one habit at a time 🌍"
        ],
        youtube: [
          "VIDA SOSTENIBLE | Cambios fáciles que puedes hacer HOY",
          "ECO HACKS | Tips para ser más eco-friendly",
          "ZERO WASTE journey | Mi experiencia y consejos",
          "SUSTAINABLE SWAPS | Alternativas que funcionan",
          "IMPACTO AMBIENTAL | Por qué cada acción importa"
        ]
      };
      return templates[platform] || templates.tiktok;
    }
  };

  const musicCategories = {
    fitness: [
      { name: 'High Energy Workout', bpm: '120-140', mood: 'Energético', examples: ['Pump It Up', 'Stronger', 'Till I Collapse'] },
      { name: 'Cardio Beats', bpm: '130-150', mood: 'Motivacional', examples: ['Uptown Funk', 'Can\'t Stop', 'Thunder'] },
      { name: 'Strength Training', bpm: '90-120', mood: 'Poderoso', examples: ['Eye of the Tiger', 'Lose Yourself', 'Warrior'] },
      { name: 'Cool Down', bpm: '60-90', mood: 'Relajante', examples: ['Breathe Me', 'Weightless', 'Clair de Lune'] }
    ],
    food: [
      { name: 'Cooking Vibes', bpm: '80-110', mood: 'Relajado', examples: ['Sunday Morning', 'La Vie En Rose', 'Fly Me to the Moon'] },
      { name: 'Kitchen Party', bpm: '110-130', mood: 'Alegre', examples: ['Good as Hell', 'Uptown Funk', 'Happy'] },
      { name: 'ASMR Cooking', bpm: '60-80', mood: 'Tranquilo', examples: ['Ambient sounds', 'Nature sounds', 'Soft piano'] },
      { name: 'Cultural Fusion', bpm: '90-120', mood: 'Étnico', examples: ['Despacito', 'Bambaataa', 'Sway'] }
    ],
    fashion: [
      { name: 'Runway Ready', bpm: '100-120', mood: 'Elegante', examples: ['Vogue', 'Fashion', 'Glamorous'] },
      { name: 'Street Style', bpm: '90-110', mood: 'Urban', examples: ['Good 4 U', 'Industry Baby', 'Levitating'] },
      { name: 'Vintage Vibes', bpm: '70-100', mood: 'Nostálgico', examples: ['Retro hits', 'Vintage pop', 'Classic soul'] },
      { name: 'Confidence Boost', bpm: '110-130', mood: 'Empoderador', examples: ['Confident', 'Boss', 'Stronger'] }
    ],
    tech: [
      { name: 'Future Beats', bpm: '100-130', mood: 'Futurista', examples: ['Cyberpunk', 'Synthwave', 'Electronic'] },
      { name: 'Focus Flow', bpm: '80-100', mood: 'Concentrado', examples: ['Lo-fi hip hop', 'Ambient tech', 'Study beats'] },
      { name: 'Innovation Anthem', bpm: '110-140', mood: 'Inspirador', examples: ['Titanium', 'Radioactive', 'Believer'] },
      { name: 'Retro Tech', bpm: '90-120', mood: '8-bit', examples: ['Chiptune', '8-bit covers', 'Video game music'] }
    ],
    gaming: [
      { name: 'Epic Gaming', bpm: '120-150', mood: 'Épico', examples: ['Warriors', 'Legends Never Die', 'Phoenix'] },
      { name: 'Chill Gaming', bpm: '70-100', mood: 'Relajado', examples: ['Minecraft music', 'Lo-fi gaming', 'Ambient'] },
      { name: 'Competitive Edge', bpm: '130-160', mood: 'Intenso', examples: ['Till I Collapse', 'Radioactive', 'Enemy'] },
      { name: 'Retro Arcade', bpm: '100-130', mood: 'Nostálgico', examples: ['8-bit classics', 'Arcade beats', 'Chiptune'] }
    ],
    lifestyle: [
      { name: 'Morning Motivation', bpm: '90-110', mood: 'Inspirador', examples: ['Good as Hell', 'Confident', 'Stronger'] },
      { name: 'Self-Care Vibes', bpm: '70-90', mood: 'Relajante', examples: ['Sunday Morning', 'Golden', 'Breathe Me'] },
      { name: 'Productivity Flow', bpm: '100-120', mood: 'Enfocado', examples: ['Lo-fi beats', 'Study music', 'Ambient'] },
      { name: 'Evening Wind Down', bpm: '60-80', mood: 'Tranquilo', examples: ['Weightless', 'Clair de Lune', 'Spa music'] }
    ],
    education: [
      { name: 'Study Focus', bpm: '60-80', mood: 'Concentrado', examples: ['Lo-fi hip hop', 'Classical', 'Ambient study'] },
      { name: 'Learning Energy', bpm: '90-110', mood: 'Motivacional', examples: ['Uplifting pop', 'Indie rock', 'Electronic'] },
      { name: 'Brain Boost', bpm: '100-120', mood: 'Estimulante', examples: ['Binaural beats', 'Classical baroque', 'Instrumental'] },
      { name: 'Memory Palace', bpm: '70-90', mood: 'Contemplativo', examples: ['Piano solos', 'String quartets', 'Nature sounds'] }
    ],
    travel: [
      { name: 'Adventure Anthem', bpm: '110-130', mood: 'Aventurero', examples: ['On Top of the World', 'Adventure of a Lifetime', 'Roam'] },
      { name: 'Road Trip Vibes', bpm: '100-120', mood: 'Libre', examples: ['Life is a Highway', 'Born to Be Wild', 'Take It Easy'] },
      { name: 'Cultural Immersion', bpm: '80-120', mood: 'Étnico', examples: ['World music', 'Folk tradicional', 'Música local'] },
      { name: 'Sunset Chill', bpm: '70-90', mood: 'Nostálgico', examples: ['Hotel California', 'Wonderful Tonight', 'Sunset vibes'] }
    ],
    business: [
      { name: 'Hustle Mode', bpm: '110-130', mood: 'Motivacional', examples: ['Till I Collapse', 'Stronger', 'Eye of the Tiger'] },
      { name: 'Executive Focus', bpm: '80-100', mood: 'Profesional', examples: ['Classical', 'Jazz instrumental', 'Corporate music'] },
      { name: 'Success Celebration', bpm: '120-140', mood: 'Triunfante', examples: ['We Are the Champions', 'Celebration', 'Victory'] },
      { name: 'Strategic Thinking', bpm: '70-90', mood: 'Contemplativo', examples: ['Ambient', 'Minimal techno', 'Think music'] }
    ],
    art: [
      { name: 'Creative Flow', bpm: '80-100', mood: 'Inspirador', examples: ['Bohemian Rhapsody', 'Imagine', 'Creative vibes'] },
      { name: 'Artistic Focus', bpm: '60-80', mood: 'Concentrado', examples: ['Classical', 'Ambient', 'Instrumental'] },
      { name: 'Color Explosion', bpm: '100-120', mood: 'Vibrante', examples: ['Upbeat pop', 'Electronic', 'Energetic indie'] },
      { name: 'Masterpiece Mode', bpm: '70-90', mood: 'Contemplativo', examples: ['Piano classics', 'String music', 'Art-inspired'] }
    ],
    home: [
      { name: 'DIY Energy', bpm: '100-120', mood: 'Productivo', examples: ['Upbeat pop', 'Feel-good hits', 'Work music'] },
      { name: 'Cozy Vibes', bpm: '70-90', mood: 'Acogedor', examples: ['Indie folk', 'Acoustic', 'Home sweet home'] },
      { name: 'Cleaning Beats', bpm: '110-130', mood: 'Energético', examples: ['Dance hits', 'Pop classics', 'Cleaning playlist'] },
      { name: 'Decoration Inspiration', bpm: '80-100', mood: 'Creativo', examples: ['Aesthetic music', 'Indie pop', 'Design vibes'] }
    ],
    pets: [
      { name: 'Playful Paws', bpm: '100-120', mood: 'Juguetón', examples: ['Happy songs', 'Upbeat pop', 'Pet-friendly'] },
      { name: 'Training Time', bpm: '90-110', mood: 'Enfocado', examples: ['Motivational', 'Steady beats', 'Training music'] },
      { name: 'Calm Companion', bpm: '60-80', mood: 'Relajante', examples: ['Soft music', 'Nature sounds', 'Pet relaxation'] },
      { name: 'Adventure Buddy', bpm: '110-130', mood: 'Aventurero', examples: ['Outdoor vibes', 'Nature music', 'Adventure songs'] }
    ],
    entertainment: [
      { name: 'Pop Culture Hits', bpm: '110-130', mood: 'Trendy', examples: ['Chart toppers', 'Viral hits', 'Pop anthems'] },
      { name: 'Movie Magic', bpm: '80-120', mood: 'Cinematográfico', examples: ['Soundtracks', 'Epic scores', 'Movie themes'] },
      { name: 'Celebrity Vibes', bpm: '100-120', mood: 'Glamoroso', examples: ['Red carpet music', 'Celebrity favorites', 'Glam hits'] },
      { name: 'Binge Watch', bpm: '70-90', mood: 'Chill', examples: ['Series soundtracks', 'Background music', 'Viewing vibes'] }
    ],
    sports: [
      { name: 'Game Time', bpm: '120-150', mood: 'Competitivo', examples: ['Eye of the Tiger', 'We Will Rock You', 'Champions'] },
      { name: 'Training Beast', bpm: '130-160', mood: 'Intenso', examples: ['Till I Collapse', 'Lose Yourself', 'Beast mode'] },
      { name: 'Victory Lap', bpm: '110-130', mood: 'Triunfante', examples: ['We Are the Champions', 'Celebration', 'Victory songs'] },
      { name: 'Recovery Flow', bpm: '60-90', mood: 'Recuperativo', examples: ['Cool down music', 'Stretching vibes', 'Recovery beats'] }
    ],
    family: [
      { name: 'Family Fun', bpm: '100-120', mood: 'Alegre', examples: ['Family-friendly hits', 'Disney songs', 'Happy music'] },
      { name: 'Bedtime Stories', bpm: '60-80', mood: 'Tranquilo', examples: ['Lullabies', 'Soft music', 'Sleep songs'] },
      { name: 'Activity Time', bpm: '90-110', mood: 'Activo', examples: ['Kids songs', 'Activity music', 'Play time'] },
      { name: 'Memory Making', bpm: '80-100', mood: 'Nostálgico', examples: ['Family classics', 'Generational hits', 'Memory songs'] }
    ],
    sustainability: [
      { name: 'Earth Anthem', bpm: '90-110', mood: 'Inspirador', examples: ['Earth Song', 'Big Yellow Taxi', 'Environmental music'] },
      { name: 'Nature Sounds', bpm: '60-80', mood: 'Natural', examples: ['Forest sounds', 'Ocean waves', 'Bird songs'] },
      { name: 'Green Revolution', bpm: '100-120', mood: 'Activista', examples: ['Protest songs', 'Change anthems', 'Revolution music'] },
      { name: 'Mindful Living', bpm: '70-90', mood: 'Consciente', examples: ['Meditation music', 'Mindful beats', 'Conscious living'] }
    ]
  };

  const nicheConfigs = {
    fitness: {
      name: 'Fitness & Salud',
      icon: '💪',
      color: 'from-green-500 to-emerald-500',
      description: 'Transformaciones, rutinas y nutrición',
      platforms: ['tiktok', 'instagram', 'youtube', 'facebook'],
      trending_hashtags: hashtagGenerators.fitness(),
      content_types: {
        tiktok: ['Rutinas rápidas', 'Transformaciones', 'Tips fitness', 'Challenges'],
        instagram: ['Progress pics', 'Workout videos', 'Meal prep', 'Motivational posts'],
        youtube: ['Full workouts', 'Nutrition guides', 'Fitness vlogs', 'Exercise tutorials'],
        facebook: ['Fitness groups', 'Progress updates', 'Workout schedules', 'Community support']
      },
      viral_patterns: [
        'Perdí 15kg en 3 meses',
        'Rutina de 10 minutos que funciona',
        'Transformación increíble',
        'Ejercicio que cambió mi cuerpo',
        'Comida que me ayudó a bajar'
      ],
      target_audiences: {
        beginners: 'Principiantes fitness (18-30)',
        intermediate: 'Nivel intermedio (25-40)',
        women: 'Mujeres fitness (20-45)',
        men: 'Hombres fitness (18-50)',
        seniors: 'Fitness +50 (50-70)'
      },
      music_categories: musicCategories.fitness,
      copy_generator: copyGenerators.fitness
    },
    gaming: {
      name: 'Gaming & Esports',
      icon: '🎮',
      color: 'from-violet-500 to-purple-500',
      description: 'Gaming, esports y entretenimiento',
      platforms: ['tiktok', 'instagram', 'youtube', 'twitch'],
      trending_hashtags: hashtagGenerators.gaming(),
      content_types: {
        tiktok: ['Jugadas épicas', 'Fails graciosos', 'Tips rápidos', 'Reacciones'],
        instagram: ['Highlights', 'Setup gaming', 'Memes', 'Stories gameplay'],
        youtube: ['Gameplays completos', 'Reviews', 'Tutoriales', 'Streams highlights'],
        twitch: ['Streams en vivo', 'Interacción chat', 'Torneos', 'Just chatting']
      },
      viral_patterns: [
        'Jugada imposible',
        'Combo secreto',
        'Speedrun record',
        'Reacción épica',
        'Bug gracioso'
      ],
      target_audiences: {
        casual: 'Gamers casuales (16-30)',
        hardcore: 'Gamers hardcore (18-35)',
        esports: 'Esports fans (16-28)',
        streamers: 'Aspirantes streamer (18-25)',
        retro: 'Retro gamers (25-40)'
      },
      music_categories: musicCategories.gaming,
      copy_generator: copyGenerators.gaming
    },
    food: {
      name: 'Food & Recetas',
      icon: '🍳',
      color: 'from-orange-500 to-red-500',
      description: 'Cocina, recetas y gastronomía',
      platforms: ['tiktok', 'instagram', 'youtube', 'pinterest'],
      trending_hashtags: hashtagGenerators.food(),
      content_types: {
        tiktok: ['Recetas rápidas', 'Food hacks', 'ASMR cooking', 'Fails cocina'],
        instagram: ['Platos aesthetic', 'Proceso paso a paso', 'Ingredientes', 'Food styling'],
        youtube: ['Recetas completas', 'Técnicas culinarias', 'Reviews restaurantes', 'Meal prep'],
        pinterest: ['Infografías recetas', 'Meal planning', 'Tips cocina', 'Inspiración platos']
      },
      viral_patterns: [
        'Receta de 5 ingredientes',
        'Hack de cocina viral',
        'Recreando viral food',
        'Receta fail vs success',
        'Food challenge'
      ],
      target_audiences: {
        beginners: 'Principiantes cocina (18-30)',
        busy_parents: 'Padres ocupados (25-45)',
        food_lovers: 'Amantes comida (20-50)',
        healthy: 'Comida saludable (25-40)',
        bakers: 'Repostería (20-60)'
      },
      music_categories: musicCategories.food,
      copy_generator: copyGenerators.food
    },
    fashion: {
      name: 'Moda & Estilo',
      icon: '👗',
      color: 'from-pink-500 to-purple-500',
      description: 'Moda, estilo y tendencias',
      platforms: ['tiktok', 'instagram', 'pinterest', 'youtube'],
      trending_hashtags: hashtagGenerators.fashion(),
      content_types: {
        tiktok: ['Outfit transitions', 'Fashion hacks', 'Styling tips', 'Thrift flips'],
        instagram: ['OOTD posts', 'Outfit grids', 'Fashion reels', 'Style guides'],
        pinterest: ['Outfit inspiration', 'Style boards', 'Fashion trends', 'Wardrobe essentials'],
        youtube: ['Lookbooks', 'Fashion hauls', 'Styling tutorials', 'Wardrobe organization']
      },
      viral_patterns: [
        'Outfit de $30 que parece de $300',
        'Transformación con la misma ropa',
        'Styling hack que cambia todo',
        'Outfit para cada ocasión',
        'Tendencia que está everywhere'
      ],
      target_audiences: {
        gen_z: 'Gen Z fashion (16-24)',
        millennials: 'Millennials style (25-35)',
        budget: 'Fashion low-cost (18-40)',
        luxury: 'Luxury fashion (25-50)',
        sustainable: 'Moda sostenible (20-45)'
      },
      music_categories: musicCategories.fashion,
      copy_generator: copyGenerators.fashion
    },
    tech: {
      name: 'Tecnología',
      icon: '📱',
      color: 'from-blue-500 to-cyan-500',
      description: 'Tecnología, apps y gadgets',
      platforms: ['tiktok', 'instagram', 'youtube', 'twitter'],
      trending_hashtags: hashtagGenerators.tech(),
      content_types: {
        tiktok: ['Tech hacks', 'App reviews', 'Gadget tests', 'Tech fails'],
        instagram: ['Product shots', 'Tech setups', 'App screenshots', 'Comparison posts'],
        youtube: ['Tech reviews', 'Unboxings', 'Tutorials', 'Tech news'],
        twitter: ['Tech threads', 'Breaking news', 'Hot takes', 'Product launches']
      },
      viral_patterns: [
        'App que me cambió la vida',
        'Gadget que necesitas YA',
        'Hack de teléfono secreto',
        'IA que hace esto increíble',
        'Tecnología del futuro HOY'
      ],
      target_audiences: {
        early_adopters: 'Early adopters (20-35)',
        professionals: 'Tech professionals (25-45)',
        students: 'Tech students (18-28)',
        enthusiasts: 'Tech enthusiasts (16-50)',
        seniors: 'Tech for seniors (50+)'
      },
      music_categories: musicCategories.tech,
      copy_generator: copyGenerators.tech
    },
    business: {
      name: 'Negocios',
      icon: '💼',
      color: 'from-gray-500 to-slate-500',
      description: 'Emprendimiento y negocios',
      platforms: ['linkedin', 'instagram', 'youtube', 'tiktok'],
      trending_hashtags: hashtagGenerators.business(),
      content_types: {
        linkedin: ['Business insights', 'Success stories', 'Industry trends', 'Professional tips'],
        instagram: ['Entrepreneur lifestyle', 'Business quotes', 'Success metrics', 'Behind scenes'],
        youtube: ['Business tutorials', 'Case studies', 'Interviews', 'Strategy videos'],
        tiktok: ['Business hacks', 'Money tips', 'Entrepreneur life', 'Quick advice']
      },
      viral_patterns: [
        'Gané $X en mi primer mes',
        'Error que me costó $X',
        'Estrategia que cambió todo',
        'De $0 a $X en X meses',
        'Secreto de empresarios exitosos'
      ],
      target_audiences: {
        aspiring: 'Aspirantes emprendedores (18-30)',
        freelancers: 'Freelancers (22-40)',
        small_business: 'Pequeños negocios (25-50)',
        investors: 'Inversores (30-60)',
        students: 'Estudiantes business (18-25)'
      },
      music_categories: musicCategories.business,
      copy_generator: copyGenerators.business
    },
    lifestyle: {
      name: 'Lifestyle',
      icon: '✨',
      color: 'from-yellow-500 to-orange-500',
      description: 'Estilo de vida y bienestar',
      platforms: ['instagram', 'tiktok', 'youtube', 'pinterest'],
      trending_hashtags: hashtagGenerators.lifestyle(),
      content_types: {
        instagram: ['Daily routines', 'Aesthetic posts', 'Self-care tips', 'Lifestyle flat lays'],
        tiktok: ['Morning routines', 'Life hacks', 'Glow up tips', 'Productivity hacks'],
        youtube: ['Day in my life', 'Routine videos', 'Wellness content', 'Life advice'],
        pinterest: ['Lifestyle inspiration', 'Self-care ideas', 'Productivity tips', 'Wellness boards']
      },
      viral_patterns: [
        'Rutina que cambió mi vida',
        'Glow up en 30 días',
        'Hábitos de gente exitosa',
        'Self-care Sunday routine',
        'Productivity hack viral'
      ],
      target_audiences: {
        young_women: 'Mujeres jóvenes (18-30)',
        working_professionals: 'Profesionales (25-40)',
        students: 'Estudiantes (18-25)',
        wellness_seekers: 'Buscadores bienestar (20-50)',
        busy_parents: 'Padres ocupados (25-45)'
      },
      music_categories: musicCategories.lifestyle,
      copy_generator: copyGenerators.lifestyle
    },
    education: {
      name: 'Educación',
      icon: '📚',
      color: 'from-indigo-500 to-purple-500',
      description: 'Educación y aprendizaje',
      platforms: ['youtube', 'tiktok', 'instagram', 'linkedin'],
      trending_hashtags: hashtagGenerators.education(),
      content_types: {
        youtube: ['Educational videos', 'Tutorials', 'Lectures', 'Study guides'],
        tiktok: ['Quick lessons', 'Study hacks', 'Educational content', 'Fun facts'],
        instagram: ['Infographics', 'Study tips', 'Educational carousels', 'Knowledge posts'],
        linkedin: ['Professional development', 'Skill building', 'Industry insights', 'Career advice']
      },
      viral_patterns: [
        'Aprendí X en 30 días',
        'Método de estudio que funciona',
        'Skill que necesitas en 2024',
        'Universidad vs Autodidacta',
        'Hack para aprender rápido'
      ],
      target_audiences: {
        students: 'Estudiantes (16-25)',
        professionals: 'Profesionales (25-45)',
        parents: 'Padres educadores (30-50)',
        lifelong_learners: 'Aprendices de por vida (20-60)',
        teachers: 'Educadores (25-55)'
      },
      music_categories: musicCategories.education,
      copy_generator: copyGenerators.education
    },
    travel: {
      name: 'Viajes',
      icon: '✈️',
      color: 'from-teal-500 to-blue-500',
      description: 'Viajes y aventuras',
      platforms: ['instagram', 'tiktok', 'youtube', 'pinterest'],
      trending_hashtags: hashtagGenerators.travel(),
      content_types: {
        instagram: ['Travel photos', 'Destination guides', 'Travel stories', 'Adventure reels'],
        tiktok: ['Travel hacks', 'Destination reveals', 'Travel fails', 'Budget travel'],
        youtube: ['Travel vlogs', 'Destination guides', 'Travel tips', 'Culture videos'],
        pinterest: ['Travel inspiration', 'Itineraries', 'Packing lists', 'Destination boards']
      },
      viral_patterns: [
        'Viajé X días con $X',
        'Destino secreto increíble',
        'Travel hack que debes saber',
        'Lugar que parece otro planeta',
        'Error de viaje que evitar'
      ],
      target_audiences: {
        backpackers: 'Mochileros (18-35)',
        luxury_travelers: 'Viajeros luxury (30-60)',
        families: 'Familias viajeras (25-50)',
        solo_travelers: 'Viajeros solos (20-40)',
        budget_travelers: 'Viajeros low-cost (18-45)'
      },
      music_categories: musicCategories.travel,
      copy_generator: copyGenerators.travel
    },
    art: {
      name: 'Arte & Creatividad',
      icon: '🎨',
      color: 'from-rose-500 to-pink-500',
      description: 'Arte, creatividad y diseño',
      platforms: ['instagram', 'tiktok', 'youtube', 'pinterest'],
      trending_hashtags: hashtagGenerators.art(),
      content_types: {
        instagram: ['Artwork posts', 'Process videos', 'Art tutorials', 'Artist lifestyle'],
        tiktok: ['Art process', 'Quick tutorials', 'Art hacks', 'Before/after'],
        youtube: ['Full tutorials', 'Art supplies reviews', 'Technique videos', 'Artist vlogs'],
        pinterest: ['Art inspiration', 'Tutorial pins', 'Color palettes', 'Art references']
      },
      viral_patterns: [
        'Transformé esto en arte',
        'Técnica que cambió mi arte',
        'Arte en X minutos',
        'Materiales baratos, resultado pro',
        'Challenge artístico viral'
      ],
      target_audiences: {
        beginners: 'Artistas principiantes (16-30)',
        professionals: 'Artistas profesionales (20-50)',
        hobbyists: 'Arte como hobby (25-60)',
        students: 'Estudiantes arte (16-25)',
        collectors: 'Coleccionistas (30-65)'
      },
      music_categories: musicCategories.art,
      copy_generator: copyGenerators.art
    },
    home: {
      name: 'Hogar & Decoración',
      icon: '🏠',
      color: 'from-amber-500 to-yellow-500',
      description: 'Hogar, decoración y DIY',
      platforms: ['instagram', 'pinterest', 'tiktok', 'youtube'],
      trending_hashtags: hashtagGenerators.home(),
      content_types: {
        instagram: ['Home tours', 'Decor flatlays', 'Before/after', 'Room reveals'],
        pinterest: ['Home inspiration', 'DIY projects', 'Decor ideas', 'Organization tips'],
        tiktok: ['Quick DIYs', 'Home hacks', 'Decor on budget', 'Room transformations'],
        youtube: ['Full DIY tutorials', 'Home tours', 'Decor hauls', 'Organization systems']
      },
      viral_patterns: [
        'Transformé mi cuarto con $X',
        'DIY que parece comprado',
        'Hack de organización viral',
        'Decoración aesthetic low-cost',
        'Antes vs después increíble'
      ],
      target_audiences: {
        homeowners: 'Propietarios (25-55)',
        renters: 'Inquilinos (20-40)',
        new_homeowners: 'Nuevos propietarios (25-45)',
        diy_enthusiasts: 'Amantes DIY (20-60)',
        interior_lovers: 'Amantes interiorismo (25-50)'
      },
      music_categories: musicCategories.home,
      copy_generator: copyGenerators.home
    },
    pets: {
      name: 'Mascotas & Animales',
      icon: '🐾',
      color: 'from-emerald-500 to-green-500',
      description: 'Mascotas, animales y cuidados',
      platforms: ['tiktok', 'instagram', 'youtube', 'facebook'],
      trending_hashtags: hashtagGenerators.pets(),
      content_types: {
        tiktok: ['Pet tricks', 'Funny pets', 'Pet care tips', 'Pet reactions'],
        instagram: ['Pet photos', 'Pet stories', 'Care tips', 'Pet lifestyle'],
        youtube: ['Pet training', 'Care guides', 'Pet vlogs', 'Vet advice'],
        facebook: ['Pet groups', 'Care discussions', 'Pet photos', 'Community support']
      },
      viral_patterns: [
        'Mi mascota aprendió esto',
        'Truco que salvó a mi perro',
        'Reacción épica de mi gato',
        'Cuidado que debes saber',
        'Mascota hace algo increíble'
      ],
      target_audiences: {
        dog_owners: 'Dueños de perros (20-60)',
        cat_owners: 'Dueños de gatos (18-55)',
        new_pet_owners: 'Nuevos dueños (18-40)',
        pet_enthusiasts: 'Amantes animales (16-70)',
        families: 'Familias con mascotas (25-50)'
      },
      music_categories: musicCategories.pets,
      copy_generator: copyGenerators.pets
    },
    entertainment: {
      name: 'Entretenimiento',
      icon: '🎭',
      color: 'from-fuchsia-500 to-purple-500',
      description: 'Entretenimiento y cultura pop',
      platforms: ['tiktok', 'instagram', 'youtube', 'twitter'],
      trending_hashtags: hashtagGenerators.entertainment(),
      content_types: {
        tiktok: ['Viral dances', 'Celebrity content', 'Movie reviews', 'Pop culture takes'],
        instagram: ['Celebrity news', 'Entertainment posts', 'Movie/series content', 'Pop culture memes'],
        youtube: ['Movie reviews', 'Celebrity interviews', 'Entertainment news', 'Reaction videos'],
        twitter: ['Entertainment threads', 'Live tweeting', 'Hot takes', 'Breaking news']
      },
      viral_patterns: [
        'Plot twist que nadie vio',
        'Teoría loca que tiene sentido',
        'Celebrity drama explicado',
        'Serie que debes ver YA',
        'Momento viral explicado'
      ],
      target_audiences: {
        gen_z: 'Gen Z entertainment (16-25)',
        millennials: 'Millennials pop culture (25-40)',
        movie_buffs: 'Cinéfilos (20-60)',
        series_lovers: 'Amantes series (18-50)',
        music_fans: 'Fans música (16-45)'
      },
      music_categories: musicCategories.entertainment,
      copy_generator: copyGenerators.entertainment
    },
    sports: {
      name: 'Deportes',
      icon: '🏆',
      color: 'from-orange-500 to-amber-500',
      description: 'Deportes y atletismo',
      platforms: ['tiktok', 'instagram', 'youtube', 'twitter'],
      trending_hashtags: hashtagGenerators.sports(),
      content_types: {
        tiktok: ['Sports tricks', 'Training videos', 'Athletic content', 'Sports fails'],
        instagram: ['Training posts', 'Athletic lifestyle', 'Sports photography', 'Motivation content'],
        youtube: ['Training tutorials', 'Sports analysis', 'Athletic vlogs', 'Competition videos'],
        twitter: ['Sports news', 'Live updates', 'Sports discussions', 'Game analysis']
      },
      viral_patterns: [
        'Entrené como atleta olímpico',
        'Técnica que mejora rendimiento',
        'Jugada imposible explicada',
        'Entrenamiento de X deporte',
        'Récord mundial batido'
      ],
      target_audiences: {
        athletes: 'Atletas (16-35)',
        fitness_enthusiasts: 'Entusiastas fitness (18-50)',
        sports_fans: 'Fans deportes (16-65)',
        coaches: 'Entrenadores (25-60)',
        youth_sports: 'Deportes juveniles (12-25)'
      },
      music_categories: musicCategories.sports,
      copy_generator: copyGenerators.sports
    },
    family: {
      name: 'Familia & Crianza',
      icon: '👶',
      color: 'from-sky-500 to-blue-500',
      description: 'Familia, crianza y parentalidad',
      platforms: ['instagram', 'tiktok', 'youtube', 'facebook'],
      trending_hashtags: hashtagGenerators.family(),
      content_types: {
        instagram: ['Family photos', 'Parenting tips', 'Kid activities', 'Family lifestyle'],
        tiktok: ['Parenting hacks', 'Kid content', 'Family life', 'Parenting struggles'],
        youtube: ['Parenting advice', 'Family vlogs', 'Child development', 'Family activities'],
        facebook: ['Parenting groups', 'Family updates', 'Parenting discussions', 'Community support']
      },
      viral_patterns: [
        'Hack de crianza que funciona',
        'Mi hijo hizo esto increíble',
        'Error de crianza que evitar',
        'Actividad que entretiene horas',
        'Momento familiar viral'
      ],
      target_audiences: {
        new_parents: 'Padres primerizos (20-35)',
        experienced_parents: 'Padres experimentados (30-50)',
        expecting_parents: 'Futuros padres (20-40)',
        single_parents: 'Padres solteros (20-45)',
        grandparents: 'Abuelos (45-70)'
      },
      music_categories: musicCategories.family,
      copy_generator: copyGenerators.family
    },
    sustainability: {
      name: 'Sostenibilidad',
      icon: '🌱',
      color: 'from-lime-500 to-green-500',
      description: 'Sostenibilidad y medio ambiente',
      platforms: ['instagram', 'tiktok', 'youtube', 'pinterest'],
      trending_hashtags: hashtagGenerators.sustainability(),
      content_types: {
        instagram: ['Eco tips', 'Sustainable lifestyle', 'Environmental awareness', 'Green products'],
        tiktok: ['Eco hacks', 'Sustainability tips', 'Environmental content', 'Green living'],
        youtube: ['Sustainability guides', 'Environmental documentaries', 'Eco tutorials', 'Green lifestyle'],
        pinterest: ['Eco inspiration', 'Sustainable ideas', 'Green living tips', 'Environmental boards']
      },
      viral_patterns: [
        'Reduje mi huella X% así',
        'Swap que cambió todo',
        'Hack eco que debes saber',
        'Verdad sobre X producto',
        'Challenge sostenible viral'
      ],
      target_audiences: {
        eco_conscious: 'Conscientes eco (20-45)',
        millennials: 'Millennials verdes (25-40)',
        gen_z: 'Gen Z activistas (16-25)',
        families: 'Familias eco (25-50)',
        professionals: 'Profesionales verdes (30-55)'
      },
      music_categories: musicCategories.sustainability,
      copy_generator: copyGenerators.sustainability
    }
  };

  const currentNiche = nicheConfigs[selectedNiche] || nicheConfigs.fitness;

  const platforms = [
    { id: 'all', name: 'Todas', icon: '🌐', color: 'gray' },
    { id: 'tiktok', name: 'TikTok', icon: '🎵', color: 'pink' },
    { id: 'instagram', name: 'Instagram', icon: '📸', color: 'purple' },
    { id: 'youtube', name: 'YouTube', icon: '📺', color: 'red' },
    { id: 'facebook', name: 'Facebook', icon: '👥', color: 'blue' }
  ];

  const tabs = [
    { id: 'copys', name: 'Generador Copys', icon: PenTool },
    { id: 'trends', name: 'Tendencias', icon: TrendingUp },
    { id: 'content', name: 'Contenido Social', icon: Share2 },
    { id: 'search', name: 'Búsqueda Nicho', icon: Search },
    { id: 'analytics', name: 'Analytics', icon: BarChart3 }
  ];

  const generateNicheContent = () => {
    setIsGenerating(true);
    
    setTimeout(() => {
      const mockContent = {
        copys: [
          {
            id: 1,
            platform: selectedPlatform,
            hook: currentNiche.copy_generator ? currentNiche.copy_generator(selectedPlatform === 'all' ? 'tiktok' : selectedPlatform)[0] : `🔥 ${currentNiche.viral_patterns[0]} que está rompiendo ${selectedPlatform}`,
            body: `Esto es lo que NADIE te dice sobre ${currentNiche.name.toLowerCase()}...\n\n✨ Tip #1: [Específico del nicho]\n💡 Tip #2: [Acción concreta]\n🚀 Resultado: [Transformación esperada]`,
            cta: `¿Ya lo probaste? Comenta tu experiencia 👇`,
            hashtags: currentNiche.trending_hashtags.slice(0, 5),
            score: Math.floor(Math.random() * 20) + 80,
            engagement: (Math.random() * 4 + 6).toFixed(1) + '%'
          },
          {
            id: 2,
            platform: selectedPlatform,
            hook: `POV: Descubriste el secreto de ${currentNiche.name.toLowerCase()} 🤯`,
            body: `Método que me cambió la vida en 30 días:\n\n🎯 Paso 1: [Acción específica]\n⚡ Paso 2: [Técnica avanzada]\n🏆 Resultado: [Métrica impresionante]`,
            cta: `¿Quieres el tutorial completo? Dale SAVE 📌`,
            hashtags: currentNiche.trending_hashtags.slice(2, 7),
            score: Math.floor(Math.random() * 15) + 85,
            engagement: (Math.random() * 3 + 7).toFixed(1) + '%'
          }
        ],
        trends: [
          {
            id: 1,
            title: currentNiche.viral_patterns[0],
            growth: '+' + (Math.floor(Math.random() * 200) + 100) + '%',
            platform: selectedPlatform,
            volume: (Math.random() * 5 + 1).toFixed(1) + 'M',
            prediction: 'Pico en 24-48h',
            difficulty: 'Media',
            viral_score: Math.floor(Math.random() * 20) + 80
          },
          {
            id: 2,
            title: currentNiche.viral_patterns[1],
            growth: '+' + (Math.floor(Math.random() * 150) + 80) + '%',
            platform: selectedPlatform,
            volume: (Math.random() * 3 + 0.5).toFixed(1) + 'M',
            prediction: 'Crecimiento sostenido',
            difficulty: 'Fácil',
            viral_score: Math.floor(Math.random() * 15) + 75
          }
        ]
      };
      
      setGeneratedContent(mockContent);
      setIsGenerating(false);
    }, 2000);
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen">
      {/* Header del Nicho */}
      <div className={`bg-gradient-to-r ${currentNiche.color} p-6`}>
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button 
                onClick={onBack}
                className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-all"
              >
                <ArrowRight className="w-5 h-5 rotate-180" />
              </button>
              <div className="text-4xl">{currentNiche.icon}</div>
              <div>
                <h1 className="text-3xl font-bold text-white">{currentNiche.name}</h1>
                <p className="text-white/80">{currentNiche.description}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="bg-white/20 rounded-lg px-4 py-2">
                <div className="text-sm text-white/80">Plataformas</div>
                <div className="text-lg font-bold">{currentNiche.platforms.length}</div>
              </div>
              <div className="bg-white/20 rounded-lg px-4 py-2">
                <div className="text-sm text-white/80">Hashtags</div>
                <div className="text-lg font-bold">{currentNiche.trending_hashtags.length}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Navegación de Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 border-b border-gray-700">
          {tabs.map((tab) => (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 rounded-t-lg font-medium transition-all ${
                activeTab === tab.id
                  ? `bg-gradient-to-r ${currentNiche.color} text-white`
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
              whileHover={{ scale: 1.02 }}
            >
              <tab.icon className="w-5 h-5" />
              {tab.name}
            </motion.button>
          ))}
        </div>

        {/* Filtros Globales */}
        <div className="flex flex-wrap gap-4 mb-8 p-4 bg-gray-800/50 rounded-xl">
          <div className="flex-1 min-w-64">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder={`Buscar en ${currentNiche.name}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex gap-2">
            {platforms.map((platform) => (
              <motion.button
                key={platform.id}
                onClick={() => setSelectedPlatform(platform.id)}
                className={`px-3 py-2 rounded-lg font-medium transition-all ${
                  selectedPlatform === platform.id
                    ? `bg-gradient-to-r ${currentNiche.color} text-white`
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
                whileHover={{ scale: 1.02 }}
              >
                <span className="mr-1">{platform.icon}</span>
                {platform.name}
              </motion.button>
            ))}
          </div>

          <motion.button
            onClick={generateNicheContent}
            disabled={isGenerating}
            className={`px-4 py-2 bg-gradient-to-r ${currentNiche.color} text-white rounded-lg font-medium hover:opacity-90 transition-all`}
            whileHover={{ scale: 1.02 }}
          >
            {isGenerating ? (
              <RefreshCw className="w-5 h-5 animate-spin" />
            ) : (
              <Sparkles className="w-5 h-5" />
            )}
          </motion.button>
        </div>

        {/* Contenido por Tab */}
        <AnimatePresence mode="wait">
          {activeTab === 'copys' && (
            <motion.div
              key="copys"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="grid lg:grid-cols-2 gap-6">
                {generatedContent.copys?.map((copy) => (
                  <div key={copy.id} className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <PenTool className="w-5 h-5 text-blue-400" />
                        <span className="font-medium">Copy #{copy.id}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-sm text-green-400 font-bold">Score: {copy.score}/100</div>
                        <div className="text-sm text-purple-400">{copy.engagement}</div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <div className="text-sm text-gray-400 mb-1">Hook:</div>
                        <div className="text-white font-medium">{copy.hook}</div>
                      </div>
                      
                      <div>
                        <div className="text-sm text-gray-400 mb-1">Cuerpo:</div>
                        <div className="text-gray-300 whitespace-pre-line">{copy.body}</div>
                      </div>
                      
                      <div>
                        <div className="text-sm text-gray-400 mb-1">CTA:</div>
                        <div className="text-white">{copy.cta}</div>
                      </div>
                      
                      <div>
                        <div className="text-sm text-gray-400 mb-2">Hashtags:</div>
                        <div className="flex flex-wrap gap-1">
                          {copy.hashtags.map((hashtag, idx) => (
                            <span key={idx} className="bg-blue-600/20 text-blue-300 px-2 py-1 rounded-full text-xs">
                              {hashtag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2 mt-4">
                      <motion.button
                        className="flex-1 bg-green-600 text-white py-2 rounded-lg font-medium"
                        whileHover={{ scale: 1.02 }}
                      >
                        <Copy className="w-4 h-4 inline mr-2" />
                        Copiar
                      </motion.button>
                      <motion.button
                        className="px-4 bg-blue-600 text-white py-2 rounded-lg"
                        whileHover={{ scale: 1.02 }}
                      >
                        <Download className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </div>
                )) || (
                  <div className="col-span-2 text-center py-12">
                    <Brain className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-gray-400 mb-2">
                      Genera copys específicos para {currentNiche.name}
                    </h3>
                    <p className="text-gray-500">
                      Haz clic en el botón de generar para crear copys optimizados
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'trends' && (
            <motion.div
              key="trends"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="grid lg:grid-cols-2 gap-6">
                {generatedContent.trends?.map((trend) => (
                  <div key={trend.id} className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-green-400" />
                        <span className="font-bold text-white">{trend.title}</span>
                      </div>
                      <div className="text-green-400 font-bold">{trend.growth}</div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <div className="text-sm text-gray-400">Volumen</div>
                        <div className="text-lg font-bold text-white">{trend.volume}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-400">Score Viral</div>
                        <div className="text-lg font-bold text-yellow-400">{trend.viral_score}/100</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-400">Predicción</div>
                        <div className="text-sm text-blue-400">{trend.prediction}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-400">Dificultad</div>
                        <div className={`text-sm ${trend.difficulty === 'Fácil' ? 'text-green-400' : 'text-orange-400'}`}>
                          {trend.difficulty}
                        </div>
                      </div>
                    </div>

                    <motion.button
                      className={`w-full bg-gradient-to-r ${currentNiche.color} text-white py-2 rounded-lg font-medium`}
                      whileHover={{ scale: 1.02 }}
                    >
                      Crear Contenido con esta Tendencia
                    </motion.button>
                  </div>
                )) || (
                  <div className="col-span-2 text-center py-12">
                    <TrendingUp className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-gray-400 mb-2">
                      Tendencias de {currentNiche.name}
                    </h3>
                    <p className="text-gray-500">
                      Genera contenido para ver las tendencias específicas del nicho
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'content' && (
            <motion.div
              key="content"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="grid lg:grid-cols-2 gap-6">
                {currentNiche.platforms.map((platform) => (
                  <div key={platform} className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`w-10 h-10 bg-gradient-to-r ${currentNiche.color} rounded-lg flex items-center justify-center text-white font-bold`}>
                        {platform.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white capitalize">{platform}</h3>
                        <p className="text-sm text-gray-400">Contenido optimizado para {platform}</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <div className="text-sm text-gray-400 mb-2">Tipos de contenido:</div>
                        <div className="flex flex-wrap gap-2">
                          {currentNiche.content_types[platform]?.map((type, idx) => (
                            <span key={idx} className="bg-blue-600/20 text-blue-300 px-2 py-1 rounded-full text-xs">
                              {type}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div>
                        <div className="text-sm text-gray-400 mb-2">Hashtags trending:</div>
                        <div className="flex flex-wrap gap-1">
                          {currentNiche.trending_hashtags.slice(0, 4).map((hashtag, idx) => (
                            <span key={idx} className="bg-purple-600/20 text-purple-300 px-2 py-1 rounded-full text-xs">
                              {hashtag}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div>
                        <div className="text-sm text-gray-400 mb-2">Patrón viral sugerido:</div>
                        <div className="text-white font-medium text-sm">
                          {currentNiche.viral_patterns[Math.floor(Math.random() * currentNiche.viral_patterns.length)]}
                        </div>
                      </div>

                      {/* Música específica del nicho */}
                      {currentNiche.music_categories && (
                        <div>
                          <div className="text-sm text-gray-400 mb-2">Música recomendada:</div>
                          <div className="bg-gray-900/50 rounded-lg p-3">
                            {(() => {
                              const randomCategory = currentNiche.music_categories[Math.floor(Math.random() * currentNiche.music_categories.length)];
                              return (
                                <div>
                                  <div className="flex items-center justify-between mb-2">
                                    <span className="text-purple-400 font-medium text-sm">{randomCategory.name}</span>
                                    <span className="text-xs text-gray-500">{randomCategory.bpm} BPM</span>
                                  </div>
                                  <div className="text-xs text-gray-400 mb-1">Mood: {randomCategory.mood}</div>
                                  <div className="text-xs text-blue-300">
                                    Ej: {randomCategory.examples.slice(0, 2).join(', ')}
                                  </div>
                                </div>
                              );
                            })()}
                          </div>
                        </div>
                      )}
                    </div>

                    <motion.button
                      className={`w-full mt-4 bg-gradient-to-r ${currentNiche.color} text-white py-2 rounded-lg font-medium`}
                      whileHover={{ scale: 1.02 }}
                    >
                      Generar Contenido para {platform.charAt(0).toUpperCase() + platform.slice(1)}
                    </motion.button>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'search' && (
            <motion.div
              key="search"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="space-y-6">
                {/* Búsqueda Avanzada */}
                <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <Search className="w-6 h-6 text-blue-400" />
                    Búsqueda Especializada en {currentNiche.name}
                  </h3>
                  
                  <div className="grid md:grid-cols-3 gap-4 mb-6">
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Audiencia objetivo:</label>
                      <select className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg text-white">
                        <option value="">Todas las audiencias</option>
                        {Object.entries(currentNiche.target_audiences).map(([key, value]) => (
                          <option key={key} value={key}>{value}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Tipo de contenido:</label>
                      <select className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg text-white">
                        <option value="">Todos los tipos</option>
                        {Object.values(currentNiche.content_types).flat().map((type, idx) => (
                          <option key={idx} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Nivel viral:</label>
                      <select className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg text-white">
                        <option value="">Cualquier nivel</option>
                        <option value="high">Alto (90-100)</option>
                        <option value="medium">Medio (70-89)</option>
                        <option value="low">Bajo (50-69)</option>
                      </select>
                    </div>
                  </div>

                  <motion.button
                    className={`w-full bg-gradient-to-r ${currentNiche.color} text-white py-3 rounded-lg font-bold`}
                    whileHover={{ scale: 1.02 }}
                  >
                    <Search className="w-5 h-5 inline mr-2" />
                    Buscar Contenido Específico
                  </motion.button>
                </div>

                {/* Resultados de Búsqueda */}
                <div className="grid lg:grid-cols-2 gap-6">
                  {[1, 2, 3, 4].map((item) => (
                    <div key={item} className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Star className="w-5 h-5 text-yellow-400" />
                          <span className="font-bold text-white">Resultado #{item}</span>
                        </div>
                        <div className="text-green-400 font-bold">Score: {85 + item * 2}/100</div>
                      </div>
                      
                      <h4 className="text-white font-medium mb-2">
                        {currentNiche.viral_patterns[item - 1] || currentNiche.viral_patterns[0]}
                      </h4>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Plataforma:</span>
                          <span className="text-blue-400 capitalize">{currentNiche.platforms[item - 1] || currentNiche.platforms[0]}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Audiencia:</span>
                          <span className="text-purple-400">
                            {Object.values(currentNiche.target_audiences)[item - 1] || Object.values(currentNiche.target_audiences)[0]}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Engagement estimado:</span>
                          <span className="text-green-400">{(6 + item * 0.5).toFixed(1)}%</span>
                        </div>
                      </div>

                      <div className="flex gap-2 mt-4">
                        <motion.button
                          className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-sm font-medium"
                          whileHover={{ scale: 1.02 }}
                        >
                          Ver Detalles
                        </motion.button>
                        <motion.button
                          className="px-4 bg-green-600 text-white py-2 rounded-lg text-sm"
                          whileHover={{ scale: 1.02 }}
                        >
                          <Download className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'analytics' && (
            <motion.div
              key="analytics"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="space-y-6">
                {/* Métricas Generales */}
                <div className="grid md:grid-cols-4 gap-6">
                  <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700 text-center">
                    <Eye className="w-8 h-8 text-blue-400 mx-auto mb-3" />
                    <div className="text-2xl font-bold text-white mb-1">
                      {(Math.random() * 5 + 1).toFixed(1)}M
                    </div>
                    <div className="text-sm text-gray-400">Vistas Promedio</div>
                  </div>
                  
                  <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700 text-center">
                    <Heart className="w-8 h-8 text-pink-400 mx-auto mb-3" />
                    <div className="text-2xl font-bold text-white mb-1">
                      {(Math.random() * 4 + 6).toFixed(1)}%
                    </div>
                    <div className="text-sm text-gray-400">Engagement Rate</div>
                  </div>
                  
                  <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700 text-center">
                    <Share2 className="w-8 h-8 text-green-400 mx-auto mb-3" />
                    <div className="text-2xl font-bold text-white mb-1">
                      {Math.floor(Math.random() * 50 + 20)}K
                    </div>
                    <div className="text-sm text-gray-400">Shares Promedio</div>
                  </div>
                  
                  <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700 text-center">
                    <TrendingUp className="w-8 h-8 text-yellow-400 mx-auto mb-3" />
                    <div className="text-2xl font-bold text-white mb-1">
                      {Math.floor(Math.random() * 20 + 80)}%
                    </div>
                    <div className="text-sm text-gray-400">Tasa Viral</div>
                  </div>
                </div>

                {/* Performance por Plataforma */}
                <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                  <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <BarChart3 className="w-6 h-6 text-green-400" />
                    Performance por Plataforma
                  </h3>
                  
                  <div className="space-y-4">
                    {currentNiche.platforms.map((platform, idx) => (
                      <div key={platform} className="flex items-center justify-between p-4 bg-gray-900/50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 bg-gradient-to-r ${currentNiche.color} rounded-lg flex items-center justify-center text-white text-sm font-bold`}>
                            {platform.charAt(0).toUpperCase()}
                          </div>
                          <span className="text-white font-medium capitalize">{platform}</span>
                        </div>
                        
                        <div className="flex items-center gap-6">
                          <div className="text-center">
                            <div className="text-lg font-bold text-green-400">
                              {(Math.random() * 3 + 5).toFixed(1)}%
                            </div>
                            <div className="text-xs text-gray-400">Engagement</div>
                          </div>
                          
                          <div className="text-center">
                            <div className="text-lg font-bold text-blue-400">
                              {(Math.random() * 2 + 1).toFixed(1)}M
                            </div>
                            <div className="text-xs text-gray-400">Alcance</div>
                          </div>
                          
                          <div className="text-center">
                            <div className="text-lg font-bold text-yellow-400">
                              {Math.floor(Math.random() * 15 + 80)}%
                            </div>
                            <div className="text-xs text-gray-400">Viral Rate</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tendencias del Nicho */}
                <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                  <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <TrendingUp className="w-6 h-6 text-purple-400" />
                    Tendencias Específicas del Nicho
                  </h3>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    {currentNiche.viral_patterns.slice(0, 4).map((pattern, idx) => (
                      <div key={idx} className="p-4 bg-gray-900/50 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-white font-medium text-sm">{pattern}</span>
                          <span className="text-green-400 font-bold text-sm">
                            +{Math.floor(Math.random() * 200 + 100)}%
                          </span>
                        </div>
                        
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full bg-gradient-to-r ${currentNiche.color}`}
                            style={{ width: `${Math.floor(Math.random() * 40 + 60)}%` }}
                          ></div>
                        </div>
                        
                        <div className="text-xs text-gray-400 mt-1">
                          Popularidad: {Math.floor(Math.random() * 40 + 60)}%
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default NicheDetailModule;
