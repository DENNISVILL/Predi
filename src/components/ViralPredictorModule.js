// 🔮 PREDICTOR DE VIRALIDAD - MÓDULO PRINCIPAL
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Target, Brain, TrendingUp, Clock, Eye, Zap, Star,
  Upload, Image, Video, Music, Hash, Users, Calendar,
  CheckCircle, AlertTriangle, Info, Sparkles, BarChart3,
  ThumbsUp, MessageCircle, Share2, Play, Download
} from 'lucide-react';

const ViralPredictorModule = () => {
  const [contentType, setContentType] = useState('');
  const [selectedMusic, setSelectedMusic] = useState('');
  const [hashtags, setHashtags] = useState('');
  const [publishTime, setPublishTime] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [contentDescription, setContentDescription] = useState('');
  const [prediction, setPrediction] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const contentTypes = [
    { id: 'reel', name: 'Reel/Video Corto', icon: Video, duration: '15-90s', platforms: ['Instagram', 'TikTok'] },
    { id: 'carrusel', name: 'Carrusel', icon: Image, slides: '2-10 slides', platforms: ['Instagram', 'LinkedIn'] },
    { id: 'video_largo', name: 'Video Largo', icon: Play, duration: '1-10 min', platforms: ['YouTube', 'TikTok'] },
    { id: 'historia', name: 'Historia/Story', icon: Clock, duration: '24h', platforms: ['Instagram', 'Facebook'] }
  ];

  const trendingMusic = [
    { id: 'cupid', name: 'Cupid - FIFTY FIFTY', viral_score: 98, trend: 'up' },
    { id: 'flowers', name: 'Flowers - Miley Cyrus', viral_score: 94, trend: 'up' },
    { id: 'shakira', name: 'Shakira Session #53', viral_score: 96, trend: 'hot' },
    { id: 'unholy', name: 'Unholy - Sam Smith', viral_score: 89, trend: 'stable' },
    { id: 'original', name: 'Audio Original', viral_score: 75, trend: 'neutral' }
  ];

  const optimalTimes = [
    { time: '18:00-20:00', audience: 'Gen Z', engagement: '+45%' },
    { time: '12:00-14:00', audience: 'Millennials', engagement: '+38%' },
    { time: '20:00-22:00', audience: 'Audiencia General', engagement: '+42%' },
    { time: '08:00-10:00', audience: 'Profesionales', engagement: '+28%' }
  ];

  const audiences = [
    { id: 'gen_z', name: 'Gen Z (16-24)', traits: ['Auténtico', 'Trending', 'Visual'] },
    { id: 'millennials', name: 'Millennials (25-35)', traits: ['Nostálgico', 'Profesional', 'Familiar'] },
    { id: 'gen_x', name: 'Gen X (36-50)', traits: ['Práctico', 'Directo', 'Confiable'] },
    { id: 'general', name: 'Audiencia General', traits: ['Versátil', 'Inclusivo', 'Universal'] }
  ];

  const analyzePrediction = () => {
    if (!contentType || !selectedMusic || !hashtags || !publishTime || !targetAudience) {
      return;
    }

    setIsAnalyzing(true);

    // Simulación de análisis con IA
    setTimeout(() => {
      const mockPrediction = {
        viral_score: Math.floor(Math.random() * 30) + 70, // 70-100
        estimated_views: {
          min: Math.floor(Math.random() * 500000) + 100000,
          max: Math.floor(Math.random() * 2000000) + 1000000
        },
        engagement_rate: (Math.random() * 5 + 3).toFixed(1), // 3-8%
        timeframe: ['24-48h', '48-72h', '1-3 días'][Math.floor(Math.random() * 3)],
        probability: ['Alta', 'Media-Alta', 'Media'][Math.floor(Math.random() * 3)],
        factors: {
          music: Math.floor(Math.random() * 30) + 70,
          hashtags: Math.floor(Math.random() * 25) + 65,
          timing: Math.floor(Math.random() * 20) + 75,
          content: Math.floor(Math.random() * 35) + 60,
          audience: Math.floor(Math.random() * 25) + 70
        },
        recommendations: [
          "Usa trending hashtags más específicos de tu nicho",
          "Considera publicar entre 18:00-20:00 para mejor alcance",
          "El audio seleccionado tiene alta probabilidad viral",
          "Añade un hook fuerte en los primeros 3 segundos"
        ],
        similar_viral: [
          { creator: "@creador1", views: "2.3M", similarity: "89%" },
          { creator: "@creador2", views: "1.8M", similarity: "84%" },
          { creator: "@creador3", views: "3.1M", similarity: "91%" }
        ]
      };

      setPrediction(mockPrediction);
      setIsAnalyzing(false);
    }, 3000);
  };

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-green-400';
    if (score >= 75) return 'text-yellow-400';
    if (score >= 60) return 'text-orange-400';
    return 'text-red-400';
  };

  const getScoreBackground = (score) => {
    if (score >= 90) return 'from-green-500 to-emerald-500';
    if (score >= 75) return 'from-yellow-500 to-orange-500';
    if (score >= 60) return 'from-orange-500 to-red-500';
    return 'from-red-500 to-pink-500';
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Target className="w-12 h-12 text-purple-400" />
            <h1 className="text-4xl font-bold">Predictor de Viralidad IA</h1>
          </div>
          <p className="text-xl text-gray-400">
            Analiza tu contenido y predice su potencial viral antes de publicar
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Panel de Configuración */}
          <div className="space-y-6">
            {/* Tipo de Contenido */}
            <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700/50">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Video className="w-6 h-6 text-blue-400" />
                Tipo de Contenido
              </h2>
              
              <div className="grid grid-cols-2 gap-3">
                {contentTypes.map((type) => (
                  <motion.button
                    key={type.id}
                    onClick={() => setContentType(type.id)}
                    className={`p-4 rounded-lg border transition-all text-left ${
                      contentType === type.id
                        ? 'bg-blue-600 border-blue-500 text-white'
                        : 'bg-gray-700/50 border-gray-600 hover:border-gray-500'
                    }`}
                    whileHover={{ scale: 1.02 }}
                  >
                    <type.icon className="w-6 h-6 mb-2" />
                    <div className="font-medium">{type.name}</div>
                    <div className="text-xs text-gray-400">
                      {type.duration || type.slides}
                    </div>
                    <div className="text-xs text-blue-400 mt-1">
                      {type.platforms.join(', ')}
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Música Trending */}
            <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700/50">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Music className="w-6 h-6 text-pink-400" />
                Música/Audio
              </h2>
              
              <div className="space-y-3">
                {trendingMusic.map((music) => (
                  <motion.button
                    key={music.id}
                    onClick={() => setSelectedMusic(music.id)}
                    className={`w-full p-3 rounded-lg border transition-all text-left ${
                      selectedMusic === music.id
                        ? 'bg-pink-600 border-pink-500 text-white'
                        : 'bg-gray-700/50 border-gray-600 hover:border-gray-500'
                    }`}
                    whileHover={{ scale: 1.01 }}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">{music.name}</div>
                        <div className="text-xs text-gray-400">
                          Score Viral: {music.viral_score}/100
                        </div>
                      </div>
                      <div className={`text-xs px-2 py-1 rounded-full ${
                        music.trend === 'hot' ? 'bg-red-500/20 text-red-400' :
                        music.trend === 'up' ? 'bg-green-500/20 text-green-400' :
                        'bg-gray-500/20 text-gray-400'
                      }`}>
                        {music.trend === 'hot' ? '🔥' : music.trend === 'up' ? '📈' : '📊'}
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Hashtags */}
            <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700/50">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Hash className="w-6 h-6 text-cyan-400" />
                Hashtags
              </h2>
              
              <textarea
                value={hashtags}
                onChange={(e) => setHashtags(e.target.value)}
                placeholder="Ej: #fyp #viral #trending #tunicho #contenido"
                className="w-full h-24 p-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-none"
              />
              
              <div className="mt-3 text-sm text-gray-400">
                Tip: Usa 5-10 hashtags relevantes, mezcla trending con específicos de tu nicho
              </div>
            </div>

            {/* Timing y Audiencia */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50">
                <h3 className="font-bold mb-3 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-green-400" />
                  Hora de Publicación
                </h3>
                <select
                  value={publishTime}
                  onChange={(e) => setPublishTime(e.target.value)}
                  className="w-full p-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Seleccionar hora</option>
                  <option value="morning">08:00-12:00</option>
                  <option value="afternoon">12:00-18:00</option>
                  <option value="evening">18:00-22:00</option>
                  <option value="night">22:00-02:00</option>
                </select>
              </div>

              <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50">
                <h3 className="font-bold mb-3 flex items-center gap-2">
                  <Users className="w-5 h-5 text-purple-400" />
                  Audiencia
                </h3>
                <select
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  className="w-full p-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Seleccionar audiencia</option>
                  {audiences.map((audience) => (
                    <option key={audience.id} value={audience.id}>
                      {audience.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Descripción del Contenido */}
            <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700/50">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Info className="w-6 h-6 text-yellow-400" />
                Descripción del Contenido
              </h2>
              
              <textarea
                value={contentDescription}
                onChange={(e) => setContentDescription(e.target.value)}
                placeholder="Describe brevemente tu contenido: tema, estilo, mensaje principal..."
                className="w-full h-32 p-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 resize-none"
              />
            </div>

            {/* Botón Analizar */}
            <motion.button
              onClick={analyzePrediction}
              disabled={!contentType || !selectedMusic || !hashtags || !publishTime || !targetAudience || isAnalyzing}
              className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${
                !contentType || !selectedMusic || !hashtags || !publishTime || !targetAudience || isAnalyzing
                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700'
              }`}
              whileHover={!isAnalyzing ? { scale: 1.02 } : {}}
              whileTap={!isAnalyzing ? { scale: 0.98 } : {}}
            >
              {isAnalyzing ? (
                <div className="flex items-center justify-center gap-2">
                  <Brain className="w-6 h-6 animate-pulse" />
                  Analizando con IA...
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <Sparkles className="w-6 h-6" />
                  Predecir Viralidad
                </div>
              )}
            </motion.button>
          </div>

          {/* Panel de Resultados */}
          <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700/50">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <BarChart3 className="w-6 h-6 text-green-400" />
              Predicción de Viralidad
            </h2>

            {prediction ? (
              <div className="space-y-6">
                {/* Score Principal */}
                <div className="text-center">
                  <div className={`text-6xl font-bold mb-2 bg-gradient-to-r ${getScoreBackground(prediction.viral_score)} bg-clip-text text-transparent`}>
                    {prediction.viral_score}/100
                  </div>
                  <div className="text-xl text-gray-300 mb-4">Score de Viralidad</div>
                  
                  <div className={`inline-block px-4 py-2 rounded-full text-sm font-bold ${
                    prediction.viral_score >= 90 ? 'bg-green-500/20 text-green-400' :
                    prediction.viral_score >= 75 ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-orange-500/20 text-orange-400'
                  }`}>
                    Probabilidad: {prediction.probability}
                  </div>
                </div>

                {/* Métricas Estimadas */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-900/50 rounded-lg p-4 text-center">
                    <Eye className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                    <div className="text-lg font-bold text-white">
                      {(prediction.estimated_views.min / 1000).toFixed(0)}K - {(prediction.estimated_views.max / 1000000).toFixed(1)}M
                    </div>
                    <div className="text-sm text-gray-400">Vistas Estimadas</div>
                  </div>
                  
                  <div className="bg-gray-900/50 rounded-lg p-4 text-center">
                    <TrendingUp className="w-8 h-8 text-green-400 mx-auto mb-2" />
                    <div className="text-lg font-bold text-white">{prediction.engagement_rate}%</div>
                    <div className="text-sm text-gray-400">Engagement Rate</div>
                  </div>
                </div>

                {/* Timeframe */}
                <div className="bg-gray-900/50 rounded-lg p-4 text-center">
                  <Clock className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                  <div className="text-lg font-bold text-white">{prediction.timeframe}</div>
                  <div className="text-sm text-gray-400">Tiempo para alcanzar pico viral</div>
                </div>

                {/* Factores de Análisis */}
                <div>
                  <h3 className="text-lg font-bold text-white mb-4">Análisis por Factores:</h3>
                  <div className="space-y-3">
                    {Object.entries(prediction.factors).map(([factor, score]) => (
                      <div key={factor} className="flex items-center justify-between">
                        <span className="text-gray-300 capitalize">{factor}:</span>
                        <div className="flex items-center gap-2">
                          <div className="w-24 bg-gray-700 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full bg-gradient-to-r ${getScoreBackground(score)}`}
                              style={{ width: `${score}%` }}
                            ></div>
                          </div>
                          <span className={`font-bold ${getScoreColor(score)}`}>{score}/100</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recomendaciones */}
                <div>
                  <h3 className="text-lg font-bold text-white mb-4">💡 Recomendaciones IA:</h3>
                  <div className="space-y-2">
                    {prediction.recommendations.map((rec, index) => (
                      <div key={index} className="flex items-start gap-2 p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                        <CheckCircle className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-300 text-sm">{rec}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Contenido Similar Viral */}
                <div>
                  <h3 className="text-lg font-bold text-white mb-4">🔥 Contenido Similar que se Volvió Viral:</h3>
                  <div className="space-y-2">
                    {prediction.similar_viral.map((similar, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg">
                        <span className="text-white font-medium">{similar.creator}</span>
                        <div className="flex items-center gap-3">
                          <span className="text-green-400 font-bold">{similar.views}</span>
                          <span className="text-blue-400 text-sm">{similar.similarity} similar</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Botón de Acción */}
                <motion.button
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-xl font-bold"
                  whileHover={{ scale: 1.02 }}
                >
                  <Download className="w-5 h-5 inline mr-2" />
                  Descargar Reporte Completo
                </motion.button>
              </div>
            ) : (
              <div className="text-center py-12">
                <Target className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-400 mb-2">
                  Configura tu contenido para obtener predicción
                </h3>
                <p className="text-gray-500">
                  Completa todos los campos y presiona "Predecir Viralidad"
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViralPredictorModule;
