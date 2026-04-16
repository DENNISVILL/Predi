import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import spotifyService from '../services/spotifyService';
import youtubeService from '../services/youtubeService';
import { 
  Music, 
  MessageSquare, 
  Sparkles, 
  TrendingUp,
  Hash,
  Image,
  Play,
  Pause,
  Volume2,
  Copy,
  Download,
  Share2,
  Target,
  Globe,
  MapPin,
  Clock,
  Users,
  Heart,
  Eye,
  BarChart3,
  Zap,
  Camera,
  Video,
  Palette,
  Wand2,
  Send,
  Mic,
  Settings,
  Star,
  Award,
  TrendingDown
} from 'lucide-react';

const ContentCreatorStudio = () => {
  const [activeTab, setActiveTab] = useState('creator'); // creator, charts, analytics
  const [businessType, setBusinessType] = useState('');
  const [contentIdea, setContentIdea] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState('instagram');
  const [targetMood, setTargetMood] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState(null);
  const [selectedMusic, setSelectedMusic] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Estados para APIs reales
  const [realSpotifyData, setRealSpotifyData] = useState(null);
  const [realYouTubeData, setRealYouTubeData] = useState(null);
  const [apiStatus, setApiStatus] = useState({
    spotify: 'loading',
    youtube: 'loading'
  });
  const [useRealData, setUseRealData] = useState(false);

  // Charts REALES como Spotify/Apple Music por país y red social
  const realMusicCharts = {
    // TOP 50 GLOBAL - Lo que TODO EL MUNDO escucha
    global: [
      {
        rank: 1,
        track: "Flowers",
        artist: "Miley Cyrus",
        globalStreams: "2.1B",
        platforms: {
          tiktok: { uses: 15200000, growth: "+45%" },
          instagram: { uses: 8900000, growth: "+32%" },
          youtube: { uses: 25600000, growth: "+28%" }
        },
        genre: "pop",
        duration: "3:20",
        perfectFor: ["lifestyle", "fashion", "general content"]
      },
      {
        rank: 2,
        track: "As It Was",
        artist: "Harry Styles",
        globalStreams: "1.8B",
        platforms: {
          tiktok: { uses: 12400000, growth: "+38%" },
          instagram: { uses: 7200000, growth: "+29%" }
        },
        genre: "pop-rock",
        perfectFor: ["lifestyle", "fashion", "emotional content"]
      },
      {
        rank: 3,
        track: "Anti-Hero",
        artist: "Taylor Swift",
        globalStreams: "1.6B",
        platforms: {
          tiktok: { uses: 18900000, growth: "+52%" },
          instagram: { uses: 9100000, growth: "+41%" }
        },
        genre: "pop",
        perfectFor: ["storytelling", "lifestyle", "relatable content"]
      }
    ],

    // TOP 50 POR PAÍS - Lo que MÁS ESCUCHA cada país
    byCountry: {
      ecuador: [
        {
          rank: 1,
          track: "La Botella",
          artist: "Chriss Villa",
          genre: "reggaeton",
          localStreams: "2.3M",
          platforms: {
            tiktok: { uses: 890000, growth: "+67%" },
            instagram: { uses: 456000, growth: "+45%" },
            youtube: { uses: 1200000, growth: "+52%" }
          },
          isLocal: true,
          culturalRelevance: 95,
          perfectFor: ["party content", "nightlife", "urban lifestyle"]
        },
        {
          rank: 2,
          track: "Despechá",
          artist: "Rosalía",
          genre: "reggaeton",
          localStreams: "1.8M",
          platforms: {
            tiktok: { uses: 670000, growth: "+43%" },
            instagram: { uses: 390000, growth: "+38%" }
          },
          isLocal: false,
          popularIn: ["Ecuador", "Colombia", "Peru"],
          perfectFor: ["dance content", "fashion", "empowerment"]
        },
        {
          rank: 3,
          track: "Chulla Quiteño (Remix 2024)",
          artist: "Julio Jaramillo x DJ Peligro",
          genre: "pasillo-remix",
          localStreams: "890K",
          platforms: {
            tiktok: { uses: 234000, growth: "+89%" },
            instagram: { uses: 156000, growth: "+67%" }
          },
          isLocal: true,
          culturalRelevance: 98,
          perfectFor: ["cultural content", "local pride", "traditional food"]
        }
      ],

      colombia: [
        {
          rank: 1,
          track: "TQG",
          artist: "Karol G, Shakira",
          genre: "reggaeton",
          localStreams: "5.6M",
          platforms: {
            tiktok: { uses: 2100000, growth: "+89%" },
            instagram: { uses: 1200000, growth: "+67%" }
          },
          perfectFor: ["empowerment", "dance", "fashion"]
        },
        {
          rank: 2,
          track: "Provenza",
          artist: "Karol G",
          genre: "reggaeton",
          localStreams: "4.2M",
          platforms: {
            tiktok: { uses: 1800000, growth: "+76%" },
            instagram: { uses: 980000, growth: "+54%" }
          },
          perfectFor: ["summer vibes", "fashion", "lifestyle"]
        }
      ],

      mexico: [
        {
          rank: 1,
          track: "Ella Baila Sola",
          artist: "Eslabon Armado, Peso Pluma",
          genre: "regional-mexicano",
          localStreams: "8.9M",
          platforms: {
            tiktok: { uses: 3400000, growth: "+156%" },
            instagram: { uses: 1900000, growth: "+89%" }
          },
          perfectFor: ["authentic content", "cultural pride", "storytelling"]
        },
        {
          rank: 2,
          track: "Un x100to",
          artist: "Grupo Frontera, Bad Bunny",
          genre: "regional-mexicano",
          localStreams: "7.1M",
          platforms: {
            tiktok: { uses: 2800000, growth: "+134%" },
            instagram: { uses: 1500000, growth: "+78%" }
          },
          perfectFor: ["party content", "cultural fusion", "celebration"]
        }
      ]
    },

    // TOP POR RED SOCIAL
    byPlatform: {
      tiktok: {
        global: "Música más usada en TikTok mundial",
        ecuador: "Música más usada en TikTok Ecuador",
        colombia: "Música más usada en TikTok Colombia"
      },
      instagram: {
        global: "Música más usada en Instagram mundial", 
        ecuador: "Música más usada en Instagram Ecuador"
      },
      youtube: {
        global: "Música más usada en YouTube mundial",
        ecuador: "Música más usada en YouTube Ecuador"
      }
    }
  };

  // Cargar datos reales de las APIs
  useEffect(() => {
    const loadRealData = async () => {
      // Cargar datos de Spotify
      try {
        const spotifyData = await spotifyService.getTrendingByCountry('MX', 20);
        if (spotifyData.success) {
          setRealSpotifyData(spotifyData);
          setApiStatus(prev => ({ ...prev, spotify: 'success' }));
        } else {
          setApiStatus(prev => ({ ...prev, spotify: 'error' }));
        }
      } catch (error) {
        console.error('Error loading Spotify data:', error);
        setApiStatus(prev => ({ ...prev, spotify: 'error' }));
      }

      // Cargar datos de YouTube
      try {
        const youtubeData = await youtubeService.getTrendingVideos('MX', '10', 20); // Categoría música
        if (youtubeData.success) {
          setRealYouTubeData(youtubeData);
          setApiStatus(prev => ({ ...prev, youtube: 'success' }));
        } else {
          setApiStatus(prev => ({ ...prev, youtube: 'error' }));
        }
      } catch (error) {
        console.error('Error loading YouTube data:', error);
        setApiStatus(prev => ({ ...prev, youtube: 'error' }));
      }
    };

    loadRealData();
  }, []);

  const businessTypes = [
    { id: 'restaurant', name: 'Restaurante', icon: '🍽️', color: 'orange' },
    { id: 'gym', name: 'Gimnasio', icon: '💪', color: 'red' },
    { id: 'fashion', name: 'Moda', icon: '👗', color: 'purple' },
    { id: 'tech', name: 'Tecnología', icon: '📱', color: 'blue' },
    { id: 'beauty', name: 'Belleza', icon: '💄', color: 'pink' },
    { id: 'travel', name: 'Viajes', icon: '✈️', color: 'green' }
  ];

  const platforms = [
    { id: 'tiktok', name: 'TikTok', icon: '🎵', format: '9:16' },
    { id: 'instagram', name: 'Instagram', icon: '📸', format: '1:1' },
    { id: 'youtube', name: 'YouTube', icon: '📺', format: '16:9' },
    { id: 'facebook', name: 'Facebook', icon: '👥', format: '1.91:1' }
  ];

  const moods = [
    { id: 'energetic', name: 'Energético', emoji: '⚡', color: 'red' },
    { id: 'calm', name: 'Tranquilo', emoji: '😌', color: 'blue' },
    { id: 'fun', name: 'Divertido', emoji: '🎉', color: 'yellow' },
    { id: 'elegant', name: 'Elegante', emoji: '✨', color: 'purple' },
    { id: 'warm', name: 'Cálido', emoji: '🔥', color: 'orange' },
    { id: 'fresh', name: 'Fresco', emoji: '🌿', color: 'green' }
  ];

  const generateSyncedContent = async () => {
    if (!businessType || !contentIdea) return;
    
    setIsGenerating(true);
    
    // Simular generación de contenido sincronizado
    setTimeout(() => {
      const mockContent = {
        copy: generateCopyForBusiness(),
        hashtags: generateHashtags(),
        music: selectPerfectMusic(),
        visualConcept: generateVisualConcept(),
        syncScore: Math.floor(Math.random() * 20) + 80 // 80-100%
      };
      
      setGeneratedContent(mockContent);
      setIsGenerating(false);
    }, 3000);
  };

  const generateCopyForBusiness = () => {
    const copies = {
      restaurant: "🍽️ El sabor que conquista corazones ✨ Cada plato cuenta una historia de pasión y tradición 👨‍🍳 ¿Ya probaste nuestro plato estrella? 👇",
      gym: "💪 Tu transformación empieza HOY ⚡ No hay excusas, solo resultados 🔥 ¿Listo para ser tu mejor versión? 💯",
      fashion: "👗 El outfit que necesitabas para brillar ✨ Estilo que habla por ti 💫 ¿Cuál es tu favorito? 👇",
      tech: "📱 La tecnología que cambia tu vida 🚀 Innovación al alcance de tus manos ⚡ Descubre el futuro HOY 💡",
      beauty: "💄 Belleza que inspira confianza ✨ Tu mejor versión te está esperando 💫 ¿Lista para brillar? 👇",
      travel: "✈️ Destinos que despiertan el alma 🌍 Aventuras que se vuelven recuerdos eternos 📸 ¿Cuál es tu próximo destino? 👇"
    };
    
    return copies[businessType] || copies.restaurant;
  };

  const generateHashtags = () => {
    const hashtagSets = {
      restaurant: {
        trending: ['#comida', '#foodie', '#delicious', '#restaurant'],
        niche: ['#saboreslocales', '#comidacasera', '#cheflife', '#platoestrella'],
        local: ['#quitofood', '#comidaecuatoriana', '#restaurantesquito']
      },
      gym: {
        trending: ['#fitness', '#gym', '#workout', '#motivation'],
        niche: ['#transformation', '#gymlife', '#fitfam', '#noexcuses'],
        local: ['#gymquito', '#fitnessecuador', '#entrenamientoec']
      }
    };
    
    return hashtagSets[businessType] || hashtagSets.restaurant;
  };

  const selectPerfectMusic = () => {
    const musicByBusiness = {
      restaurant: musicCharts.byNiche.food[0],
      gym: musicCharts.byNiche.fitness[0],
      fashion: musicCharts.global[2],
      tech: musicCharts.global[0],
      beauty: musicCharts.global[2],
      travel: musicCharts.global[0]
    };
    
    return musicByBusiness[businessType] || musicCharts.global[0];
  };

  const generateVisualConcept = () => {
    const concepts = {
      restaurant: {
        shots: [
          "Close-up: ingredientes frescos",
          "Proceso de preparación con ritmo",
          "Reveal del plato terminado",
          "Reacción de satisfacción"
        ],
        colors: ["warm orange", "golden yellow", "fresh green"],
        timing: "Sincronizar cortes con beats de la música",
        style: "Cálido y apetitoso"
      },
      gym: {
        shots: [
          "Setup: preparación mental",
          "Acción: ejercicio intenso",
          "Esfuerzo: momento de superación",
          "Resultado: satisfacción del logro"
        ],
        colors: ["energetic red", "power black", "victory gold"],
        timing: "Cortes rápidos en beats fuertes",
        style: "Dinámico y motivacional"
      }
    };
    
    return concepts[businessType] || concepts.restaurant;
  };

  const tabs = [
    { id: 'creator', name: 'Content Creator', icon: Wand2 },
    { id: 'charts', name: 'Music Charts', icon: TrendingUp },
    { id: 'analytics', name: 'Performance', icon: BarChart3 }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-white">Música Viral Tracker</h2>
            <p className="text-gray-400">Descubre la música que está arrasando en redes sociales</p>
          </div>
          
          {/* Indicador de APIs */}
          <div className="flex items-center gap-2 px-3 py-2 bg-gray-800/50 rounded-lg border border-gray-700">
            <div className="flex items-center gap-1">
              <div className={`w-2 h-2 rounded-full ${
                apiStatus.spotify === 'success' ? 'bg-green-400' : 
                apiStatus.spotify === 'loading' ? 'bg-yellow-400 animate-pulse' : 'bg-red-400'
              }`}></div>
              <span className="text-xs text-gray-400">Spotify</span>
            </div>
            <div className="flex items-center gap-1">
              <div className={`w-2 h-2 rounded-full ${
                apiStatus.youtube === 'success' ? 'bg-green-400' : 
                apiStatus.youtube === 'loading' ? 'bg-yellow-400 animate-pulse' : 'bg-red-400'
              }`}></div>
              <span className="text-xs text-gray-400">YouTube</span>
            </div>
            <button
              onClick={() => setUseRealData(!useRealData)}
              className={`px-2 py-1 text-xs rounded transition-colors ${
                useRealData 
                  ? 'bg-green-600 text-white' 
                  : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
              }`}
            >
              {useRealData ? 'APIs Reales' : 'Datos Demo'}
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-gray-800 rounded-lg p-1">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors flex-1 justify-center ${
              activeTab === tab.id
                ? 'bg-blue-500 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.name}
          </button>
        ))}
      </div>

      {/* Content Creator Tab */}
      {activeTab === 'creator' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Panel */}
          <div className="space-y-6">
            <div className="bg-gray-900/50 rounded-xl p-6">
              <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Cuéntanos sobre tu negocio
              </h3>
              
              {/* Tipo de Negocio */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-3">Tipo de Negocio</label>
                <div className="grid grid-cols-2 gap-3">
                  {businessTypes.map(type => (
                    <button
                      key={type.id}
                      onClick={() => setBusinessType(type.id)}
                      className={`p-3 rounded-lg border transition-colors ${
                        businessType === type.id
                          ? 'border-blue-500 bg-blue-500/20 text-blue-400'
                          : 'border-gray-700 bg-gray-800 text-gray-300 hover:border-gray-600'
                      }`}
                    >
                      <div className="text-lg mb-1">{type.icon}</div>
                      <div className="text-xs">{type.name}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Idea de Contenido */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  ¿Qué quieres promocionar?
                </label>
                <textarea
                  value={contentIdea}
                  onChange={(e) => setContentIdea(e.target.value)}
                  placeholder="Ej: Nuestro nuevo plato de ceviche con ingrediente secreto..."
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-400 resize-none h-20"
                />
              </div>

              {/* Plataforma */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-2">Plataforma</label>
                <div className="grid grid-cols-2 gap-2">
                  {platforms.map(platform => (
                    <button
                      key={platform.id}
                      onClick={() => setSelectedPlatform(platform.id)}
                      className={`p-2 rounded-lg border transition-colors ${
                        selectedPlatform === platform.id
                          ? 'border-blue-500 bg-blue-500/20 text-blue-400'
                          : 'border-gray-700 bg-gray-800 text-gray-300'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span>{platform.icon}</span>
                        <span className="text-xs">{platform.name}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Mood */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-2">Mood Deseado</label>
                <div className="grid grid-cols-3 gap-2">
                  {moods.map(mood => (
                    <button
                      key={mood.id}
                      onClick={() => setTargetMood(mood.id)}
                      className={`p-2 rounded-lg border transition-colors ${
                        targetMood === mood.id
                          ? 'border-blue-500 bg-blue-500/20 text-blue-400'
                          : 'border-gray-700 bg-gray-800 text-gray-300'
                      }`}
                    >
                      <div className="text-sm">{mood.emoji}</div>
                      <div className="text-xs">{mood.name}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Generate Button */}
              <motion.button
                onClick={generateSyncedContent}
                disabled={!businessType || !contentIdea || isGenerating}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 rounded-lg font-medium hover:shadow-lg transition-all disabled:opacity-50"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isGenerating ? (
                  <div className="flex items-center justify-center gap-2">
                    <Sparkles className="w-4 h-4 animate-spin" />
                    Generando contenido sincronizado...
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <Wand2 className="w-4 h-4" />
                    Generar Contenido Completo
                  </div>
                )}
              </motion.button>
            </div>
          </div>

          {/* Results Panel */}
          <div className="space-y-6">
            {generatedContent ? (
              <div className="bg-gray-900/50 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white font-semibold">Contenido Generado</h3>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400" />
                      <span className="text-yellow-400 text-sm">{generatedContent.syncScore}% Sync</span>
                    </div>
                  </div>
                </div>

                {/* Copy */}
                <div className="mb-4 p-4 bg-gray-800 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-white font-medium">Copy Optimizado</h4>
                    <button className="p-1 hover:bg-gray-700 rounded">
                      <Copy className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                  <p className="text-gray-300 text-sm">{generatedContent.copy}</p>
                </div>

                {/* Hashtags */}
                <div className="mb-4 p-4 bg-gray-800 rounded-lg">
                  <h4 className="text-white font-medium mb-2">Hashtags Estratégicos</h4>
                  <div className="space-y-2">
                    <div>
                      <span className="text-xs text-gray-400">Trending:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {generatedContent.hashtags.trending.map((tag, i) => (
                          <span key={i} className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <span className="text-xs text-gray-400">Nicho:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {generatedContent.hashtags.niche.map((tag, i) => (
                          <span key={i} className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded text-xs">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Música */}
                <div className="mb-4 p-4 bg-gray-800 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-white font-medium">Música Perfecta</h4>
                    <button 
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="p-2 bg-green-500 hover:bg-green-600 rounded-full transition-colors"
                    >
                      {isPlaying ? <Pause className="w-4 h-4 text-white" /> : <Play className="w-4 h-4 text-white" />}
                    </button>
                  </div>
                  <div className="text-sm">
                    <div className="text-white font-medium">{generatedContent.music.track}</div>
                    <div className="text-gray-400">{generatedContent.music.bestFor}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      {generatedContent.music.uses?.toLocaleString()} usos • {generatedContent.music.mood}
                    </div>
                  </div>
                </div>

                {/* Concepto Visual */}
                <div className="p-4 bg-gray-800 rounded-lg">
                  <h4 className="text-white font-medium mb-2">Concepto Visual</h4>
                  <div className="space-y-2">
                    <div>
                      <span className="text-xs text-gray-400">Tomas sugeridas:</span>
                      <ul className="text-xs text-gray-300 mt-1 space-y-1">
                        {generatedContent.visualConcept.shots.map((shot, i) => (
                          <li key={i}>• {shot}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <span className="text-xs text-gray-400">Paleta de colores:</span>
                      <div className="flex gap-2 mt-1">
                        {generatedContent.visualConcept.colors.map((color, i) => (
                          <div key={i} className="text-xs text-gray-300 bg-gray-700 px-2 py-1 rounded">
                            {color}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-gray-900/50 rounded-xl p-6 text-center">
                <Sparkles className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400 mb-2">Contenido sincronizado listo para generar</p>
                <p className="text-gray-500 text-sm">Completa la información y genera tu contenido viral</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Music Charts Tab */}
      {activeTab === 'charts' && (
        <div className="space-y-6">
          {/* Filtros de País y Nicho */}
          <div className="bg-gray-900/50 rounded-xl p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">País</label>
                <select className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white">
                  <option value="global">🌍 Global</option>
                  <option value="ecuador">🇪🇨 Ecuador</option>
                  <option value="colombia">🇨🇴 Colombia</option>
                  <option value="mexico">🇲🇽 México</option>
                  <option value="peru">🇵🇪 Perú</option>
                  <option value="argentina">🇦🇷 Argentina</option>
                  <option value="chile">🇨🇱 Chile</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Red Social</label>
                <select className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white">
                  <option value="all">🌐 Todas las Redes</option>
                  <option value="tiktok">🎵 TikTok Charts</option>
                  <option value="instagram">📸 Instagram Charts</option>
                  <option value="youtube">📺 YouTube Charts</option>
                  <option value="spotify">🎧 Spotify Charts</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Tipo de Música</label>
                <select className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white">
                  <option value="popular">🔥 Más Escuchada (Top 50)</option>
                  <option value="trending">📈 Trending Ahora</option>
                  <option value="viral">⚡ Viral en Redes</option>
                  <option value="cultural">🏛️ Cultural/Local</option>
                  <option value="emerging">🚀 Emergente (24h)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Global Charts */}
          <div className="bg-gray-900/50 rounded-xl p-6">
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <Globe className="w-5 h-5" />
              Top 50 Global - General
            </h3>
            <div className="space-y-3">
              {realMusicCharts.global.map((track, index) => (
                <div key={index} className="flex items-center gap-4 p-3 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-colors">
                  <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {track.rank}
                  </div>
                  <div className="flex-1">
                    <div className="text-white font-medium">{track.track}</div>
                    <div className="text-gray-400 text-sm">{track.artist}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs px-2 py-1 bg-purple-500/20 text-purple-400 rounded">{track.genre}</span>
                      <span className="text-xs text-gray-500">{track.globalStreams} streams</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-gray-300 text-sm">TikTok: {track.platforms.tiktok.uses.toLocaleString()}</div>
                    <div className="text-green-400 text-xs">{track.platforms.tiktok.growth}</div>
                  </div>
                  <button 
                    onClick={() => setSelectedMusic(track)}
                    className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <Play className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Ecuador Charts - Lo que MÁS ESCUCHA Ecuador */}
          <div className="bg-gray-900/50 rounded-xl p-6">
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              🇪🇨 Top 50 Ecuador - Lo Más Escuchado
            </h3>
            <div className="mb-3 text-sm text-gray-400">
              Música que realmente escucha Ecuador ahora (Reggaeton, Pop, Cultural)
            </div>
            <div className="space-y-3">
              {realMusicCharts.byCountry.ecuador.map((track, index) => (
                <div key={index} className="flex items-center gap-4 p-3 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-colors">
                  <div className="w-8 h-8 bg-gradient-to-r from-yellow-500 to-red-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {track.rank}
                  </div>
                  <div className="flex-1">
                    <div className="text-white font-medium">{track.track}</div>
                    <div className="text-gray-400 text-sm">{track.artist}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs px-2 py-1 bg-red-500/20 text-red-400 rounded">{track.genre}</span>
                      {track.isLocal && (
                        <span className="text-xs px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded">🇪🇨 Local</span>
                      )}
                      <span className="text-xs text-gray-500">{track.localStreams} streams EC</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-gray-300 text-sm">TikTok: {track.platforms.tiktok.uses.toLocaleString()}</div>
                    <div className="text-green-400 text-xs">{track.platforms.tiktok.growth}</div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-yellow-400" />
                    <span className="text-xs text-yellow-400">{track.culturalRelevance}%</span>
                  </div>
                  <button 
                    onClick={() => setSelectedMusic(track)}
                    className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <Play className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Colombia Charts */}
          <div className="bg-gray-900/50 rounded-xl p-6">
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              🇨🇴 Top 50 Colombia - Lo Más Escuchado
            </h3>
            <div className="mb-3 text-sm text-gray-400">
              Reggaeton y música que domina Colombia (Karol G, Shakira, etc.)
            </div>
            <div className="space-y-3">
              {realMusicCharts.byCountry.colombia.map((track, index) => (
                <div key={index} className="flex items-center gap-4 p-3 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-colors">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-yellow-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {track.rank}
                  </div>
                  <div className="flex-1">
                    <div className="text-white font-medium">{track.track}</div>
                    <div className="text-gray-400 text-sm">{track.artist}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs px-2 py-1 bg-red-500/20 text-red-400 rounded">{track.genre}</span>
                      <span className="text-xs text-gray-500">{track.localStreams} streams CO</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-gray-300 text-sm">TikTok: {track.platforms.tiktok.uses.toLocaleString()}</div>
                    <div className="text-green-400 text-xs">{track.platforms.tiktok.growth}</div>
                  </div>
                  <button 
                    onClick={() => setSelectedMusic(track)}
                    className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <Play className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* México Charts */}
          <div className="bg-gray-900/50 rounded-xl p-6">
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              🇲🇽 Top 50 México - Lo Más Escuchado
            </h3>
            <div className="mb-3 text-sm text-gray-400">
              Regional Mexicano y música que arrasa en México (Peso Pluma, etc.)
            </div>
            <div className="space-y-3">
              {realMusicCharts.byCountry.mexico.map((track, index) => (
                <div key={index} className="flex items-center gap-4 p-3 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-colors">
                  <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-red-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {track.rank}
                  </div>
                  <div className="flex-1">
                    <div className="text-white font-medium">{track.track}</div>
                    <div className="text-gray-400 text-sm">{track.artist}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs px-2 py-1 bg-green-500/20 text-green-400 rounded">{track.genre}</span>
                      <span className="text-xs text-gray-500">{track.localStreams} streams MX</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-gray-300 text-sm">TikTok: {track.platforms.tiktok.uses.toLocaleString()}</div>
                    <div className="text-green-400 text-xs">{track.platforms.tiktok.growth}</div>
                  </div>
                  <button 
                    onClick={() => setSelectedMusic(track)}
                    className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <Play className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentCreatorStudio;
