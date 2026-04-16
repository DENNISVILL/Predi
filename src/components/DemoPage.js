// 🎮 PÁGINA DEMO INTERACTIVO
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Play, Pause, RotateCcw, TrendingUp, Eye, Heart,
  Share2, Zap, Target, BarChart3, Globe, Clock, Star,
  ArrowRight, CheckCircle, Sparkles, Brain, Activity
} from 'lucide-react';

const DemoPage = () => {
  const navigate = useNavigate();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [demoData, setDemoData] = useState({
    trends: [],
    predictions: [],
    alerts: []
  });

  const demoSteps = [
    {
      title: "Recolección de Datos",
      description: "Predix monitorea más de 50 plataformas en tiempo real",
      icon: Globe,
      duration: 3000,
      action: () => {
        setDemoData(prev => ({
          ...prev,
          trends: [
            { id: 1, name: "#TechTrend2025", growth: 45, platform: "TikTok", views: "1.2M" },
            { id: 2, name: "#SustainableLiving", growth: 32, platform: "Instagram", views: "890K" },
            { id: 3, name: "#AIRevolution", growth: 67, platform: "Twitter", views: "2.1M" }
          ]
        }));
      }
    },
    {
      title: "Análisis con IA",
      description: "Algoritmos avanzados procesan patrones y comportamientos",
      icon: Brain,
      duration: 4000,
      action: () => {
        setDemoData(prev => ({
          ...prev,
          trends: prev.trends.map(trend => ({
            ...trend,
            growth: trend.growth + Math.floor(Math.random() * 30),
            aiScore: Math.floor(Math.random() * 40) + 60
          }))
        }));
      }
    },
    {
      title: "Predicción Viral",
      description: "Identificamos tendencias que se volverán virales en 24-72h",
      icon: Target,
      duration: 3500,
      action: () => {
        setDemoData(prev => ({
          ...prev,
          predictions: [
            { 
              trend: "#TechTrend2025", 
              probability: 94, 
              timeframe: "24h",
              expectedViews: "15M+",
              confidence: "Alta"
            },
            { 
              trend: "#AIRevolution", 
              probability: 87, 
              timeframe: "48h",
              expectedViews: "8M+",
              confidence: "Media"
            }
          ]
        }));
      }
    },
    {
      title: "Alertas Inteligentes",
      description: "Notificaciones automáticas para acción inmediata",
      icon: Zap,
      duration: 2500,
      action: () => {
        setDemoData(prev => ({
          ...prev,
          alerts: [
            {
              type: "critical",
              message: "¡#TechTrend2025 está a punto de ser viral!",
              action: "Crear contenido AHORA",
              time: "Hace 2 min"
            },
            {
              type: "warning", 
              message: "#AIRevolution muestra crecimiento acelerado",
              action: "Preparar estrategia",
              time: "Hace 5 min"
            }
          ]
        }));
      }
    }
  ];

  const mockTrends = [
    { id: 1, name: "#TechTrend2025", growth: 95, platform: "TikTok", views: "15.2M", engagement: 89, country: "🇺🇸" },
    { id: 2, name: "#SustainableLiving", growth: 87, platform: "Instagram", views: "8.9M", engagement: 76, country: "🇪🇸" },
    { id: 3, name: "#AIRevolution", growth: 92, platform: "YouTube", views: "12.1M", engagement: 84, country: "🇬🇧" },
    { id: 4, name: "#DigitalNomad", growth: 78, platform: "LinkedIn", views: "5.4M", engagement: 71, country: "🇩🇪" },
    { id: 5, name: "#FitnessRevolution", growth: 83, platform: "TikTok", views: "9.8M", engagement: 79, country: "🇫🇷" }
  ];

  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        if (currentStep < demoSteps.length - 1) {
          demoSteps[currentStep].action();
          setCurrentStep(prev => prev + 1);
        } else {
          setIsPlaying(false);
        }
      }, demoSteps[currentStep]?.duration || 3000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentStep]);

  const startDemo = () => {
    setIsPlaying(true);
    setCurrentStep(0);
    setDemoData({ trends: [], predictions: [], alerts: [] });
  };

  const resetDemo = () => {
    setIsPlaying(false);
    setCurrentStep(0);
    setDemoData({ trends: [], predictions: [], alerts: [] });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Header */}
      <motion.header 
        className="fixed top-0 w-full z-50 bg-black/90 backdrop-blur-xl border-b border-gray-800/50"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <motion.button
              onClick={() => navigate('/')}
              className="flex items-center gap-3 text-white hover:text-blue-400 transition-colors"
              whileHover={{ x: -5 }}
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-semibold">Volver al Inicio</span>
            </motion.button>
            
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-400 rounded-lg flex items-center justify-center">
                <Play className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">Predix</span>
              <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full">Demo Live</span>
            </div>

            <motion.button
              onClick={() => navigate('/register')}
              className="bg-gradient-to-r from-green-600 to-emerald-500 text-white px-6 py-2 rounded-lg font-semibold"
              whileHover={{ scale: 1.05 }}
            >
              Comenzar Gratis
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* Hero Section */}
      <section className="pt-24 pb-8">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex justify-center mb-6">
              <Sparkles className="w-16 h-16 text-green-400" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Demo <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">Interactivo</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-8">
              Experimenta en tiempo real cómo Predix identifica y predice tendencias virales 
              con precisión del 99.7%
            </p>

            {/* Demo Controls */}
            <div className="flex justify-center gap-4">
              <motion.button
                onClick={startDemo}
                disabled={isPlaying}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
                  isPlaying 
                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-green-600 to-emerald-500 text-white hover:from-green-700 hover:to-emerald-600'
                }`}
                whileHover={!isPlaying ? { scale: 1.05 } : {}}
              >
                <Play className="w-5 h-5" />
                {isPlaying ? 'Demo en Progreso...' : 'Iniciar Demo'}
              </motion.button>

              <motion.button
                onClick={resetDemo}
                className="flex items-center gap-2 px-6 py-3 border border-gray-600 text-white rounded-xl font-semibold hover:bg-white/5"
                whileHover={{ scale: 1.05 }}
              >
                <RotateCcw className="w-5 h-5" />
                Reiniciar
              </motion.button>
            </div>
          </motion.div>

          {/* Demo Progress */}
          <div className="mb-12">
            <div className="flex justify-center mb-6">
              <div className="flex items-center gap-4">
                {demoSteps.map((step, index) => (
                  <div key={index} className="flex items-center">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                      index <= currentStep 
                        ? 'bg-gradient-to-r from-green-600 to-emerald-500 text-white' 
                        : 'bg-gray-700 text-gray-400'
                    }`}>
                      {index < currentStep ? (
                        <CheckCircle className="w-6 h-6" />
                      ) : (
                        <step.icon className="w-6 h-6" />
                      )}
                    </div>
                    {index < demoSteps.length - 1 && (
                      <div className={`w-16 h-1 mx-2 transition-all ${
                        index < currentStep ? 'bg-green-500' : 'bg-gray-700'
                      }`} />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {isPlaying && (
              <motion.div 
                className="text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <h3 className="text-xl font-bold text-white mb-2">
                  {demoSteps[currentStep]?.title}
                </h3>
                <p className="text-gray-400">
                  {demoSteps[currentStep]?.description}
                </p>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* Demo Dashboard */}
      <section className="pb-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Trends Panel */}
            <motion.div 
              className="bg-gray-800/30 rounded-2xl p-6 border border-gray-700/50"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <TrendingUp className="w-6 h-6 text-green-400" />
                <h3 className="text-xl font-bold text-white">Tendencias Detectadas</h3>
              </div>

              <div className="space-y-4">
                {(demoData.trends.length > 0 ? demoData.trends : mockTrends.slice(0, 3)).map((trend, index) => (
                  <motion.div
                    key={trend.id}
                    className="bg-gray-900/50 rounded-lg p-4 border border-gray-700/30"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-white">{trend.name}</h4>
                      <span className="text-green-400 font-bold">+{trend.growth}%</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <span>{trend.platform}</span>
                      <span>{trend.views} vistas</span>
                      {trend.aiScore && (
                        <span className="text-blue-400">AI: {trend.aiScore}%</span>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Predictions Panel */}
            <motion.div 
              className="bg-gray-800/30 rounded-2xl p-6 border border-gray-700/50"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <Target className="w-6 h-6 text-blue-400" />
                <h3 className="text-xl font-bold text-white">Predicciones Virales</h3>
              </div>

              {demoData.predictions.length > 0 ? (
                <div className="space-y-4">
                  {demoData.predictions.map((prediction, index) => (
                    <motion.div
                      key={index}
                      className="bg-gray-900/50 rounded-lg p-4 border border-gray-700/30"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-white">{prediction.trend}</h4>
                        <span className="text-blue-400 font-bold">{prediction.probability}%</span>
                      </div>
                      <div className="space-y-1 text-sm text-gray-400">
                        <div>Tiempo: {prediction.timeframe}</div>
                        <div>Vistas esperadas: {prediction.expectedViews}</div>
                        <div className={`font-semibold ${
                          prediction.confidence === 'Alta' ? 'text-green-400' : 'text-yellow-400'
                        }`}>
                          Confianza: {prediction.confidence}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <BarChart3 className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-500">Predicciones aparecerán aquí</p>
                </div>
              )}
            </motion.div>

            {/* Alerts Panel */}
            <motion.div 
              className="bg-gray-800/30 rounded-2xl p-6 border border-gray-700/50"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <Zap className="w-6 h-6 text-yellow-400" />
                <h3 className="text-xl font-bold text-white">Alertas Inteligentes</h3>
              </div>

              {demoData.alerts.length > 0 ? (
                <div className="space-y-4">
                  {demoData.alerts.map((alert, index) => (
                    <motion.div
                      key={index}
                      className={`rounded-lg p-4 border ${
                        alert.type === 'critical' 
                          ? 'bg-red-500/10 border-red-500/30' 
                          : 'bg-yellow-500/10 border-yellow-500/30'
                      }`}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className="flex items-start gap-3">
                        <Zap className={`w-5 h-5 mt-1 ${
                          alert.type === 'critical' ? 'text-red-400' : 'text-yellow-400'
                        }`} />
                        <div className="flex-1">
                          <p className="text-white font-medium mb-1">{alert.message}</p>
                          <p className="text-sm text-blue-400 mb-2">{alert.action}</p>
                          <p className="text-xs text-gray-400">{alert.time}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Activity className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-500">Alertas aparecerán aquí</p>
                </div>
              )}
            </motion.div>
          </div>

          {/* Demo Stats */}
          <motion.div 
            className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700/50 text-center">
              <Eye className="w-8 h-8 text-blue-400 mx-auto mb-3" />
              <div className="text-2xl font-bold text-white">50+</div>
              <div className="text-sm text-gray-400">Plataformas</div>
            </div>
            <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700/50 text-center">
              <Clock className="w-8 h-8 text-green-400 mx-auto mb-3" />
              <div className="text-2xl font-bold text-white">24-72h</div>
              <div className="text-sm text-gray-400">Anticipación</div>
            </div>
            <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700/50 text-center">
              <Target className="w-8 h-8 text-purple-400 mx-auto mb-3" />
              <div className="text-2xl font-bold text-white">99.7%</div>
              <div className="text-sm text-gray-400">Precisión</div>
            </div>
            <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700/50 text-center">
              <Star className="w-8 h-8 text-yellow-400 mx-auto mb-3" />
              <div className="text-2xl font-bold text-white">10K+</div>
              <div className="text-sm text-gray-400">Empresas</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            className="bg-gradient-to-r from-green-600/20 to-emerald-500/20 rounded-2xl p-12 border border-green-500/30"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-white mb-4">
              ¿Impresionado con el Demo?
            </h2>
            <p className="text-xl text-gray-400 mb-8">
              Esto es solo una pequeña muestra del poder de Predix. 
              Regístrate gratis y accede a todas las funcionalidades
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                onClick={() => navigate('/register')}
                className="bg-gradient-to-r from-green-600 to-emerald-500 text-white px-8 py-4 rounded-xl font-bold text-lg"
                whileHover={{ scale: 1.05 }}
              >
                <ArrowRight className="w-5 h-5 inline mr-2" />
                Comenzar Gratis Ahora
              </motion.button>
              
              <motion.button
                onClick={() => navigate('/pricing')}
                className="border border-gray-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/5"
                whileHover={{ scale: 1.05 }}
              >
                Ver Planes y Precios
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default DemoPage;
