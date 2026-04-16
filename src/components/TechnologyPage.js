// 🧠 PÁGINA DE TECNOLOGÍA - DETALLES DE IA Y ALGORITMOS
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Brain, Cpu, Database, Network, Eye, Zap, Target, TrendingUp,
  ArrowLeft, Play, Code, GitBranch, Activity, BarChart3, 
  Layers, Shield, Clock, CheckCircle, ArrowRight
} from 'lucide-react';

const TechnologyPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('ai');

  const technologies = {
    ai: {
      title: "Inteligencia Artificial Avanzada",
      icon: Brain,
      description: "Nuestros algoritmos de IA procesan millones de datos en tiempo real",
      features: [
        {
          icon: Cpu,
          title: "Deep Learning Neural Networks",
          description: "Redes neuronales profundas que aprenden patrones complejos de comportamiento viral",
          details: "Utilizamos arquitecturas transformer y CNN para análisis multimodal de contenido"
        },
        {
          icon: Code,
          title: "Procesamiento de Lenguaje Natural",
          description: "NLP avanzado para entender contexto, sentimientos y intenciones",
          details: "Modelos BERT y GPT personalizados para análisis de texto en múltiples idiomas"
        },
        {
          icon: Target,
          title: "Análisis Predictivo Multivariable",
          description: "Predicciones precisas basadas en múltiples variables y contextos",
          details: "Algoritmos de ensemble learning con precisión del 99.7%"
        }
      ]
    },
    monitoring: {
      title: "Monitoreo Multiplataforma",
      icon: Eye,
      description: "Vigilancia continua de más de 50 plataformas digitales",
      features: [
        {
          icon: Network,
          title: "API Integrations Nativas",
          description: "Conexiones directas con APIs oficiales de plataformas principales",
          details: "TikTok, Instagram, Twitter, YouTube, LinkedIn y más"
        },
        {
          icon: Activity,
          title: "Scraping Inteligente",
          description: "Extracción de datos respetando límites y términos de servicio",
          details: "Sistemas distribuidos con rotación de proxies y rate limiting"
        },
        {
          icon: Database,
          title: "Análisis Cross-Platform",
          description: "Correlación de tendencias entre diferentes plataformas",
          details: "Identificación de patrones virales que migran entre redes sociales"
        }
      ]
    },
    analytics: {
      title: "Análisis en Tiempo Real",
      icon: BarChart3,
      description: "Dashboard ejecutivo con métricas actualizadas cada segundo",
      features: [
        {
          icon: Zap,
          title: "Real-time Analytics",
          description: "Procesamiento de datos en tiempo real con latencia mínima",
          details: "Stream processing con Apache Kafka y Redis para velocidad máxima"
        },
        {
          icon: Layers,
          title: "Custom KPIs",
          description: "Métricas personalizadas según objetivos de negocio",
          details: "Dashboard configurable con alertas inteligentes y automatización"
        },
        {
          icon: TrendingUp,
          title: "Automated Reporting",
          description: "Reportes automáticos con insights accionables",
          details: "Generación automática de reportes PDF y presentaciones ejecutivas"
        }
      ]
    }
  };

  const stats = [
    { number: "15M+", label: "Datos procesados diariamente", icon: Database },
    { number: "99.7%", label: "Precisión en predicciones", icon: Target },
    { number: "24-72h", label: "Anticipación de tendencias", icon: Clock },
    { number: "50+", label: "Plataformas monitoreadas", icon: Network }
  ];

  const architectureSteps = [
    {
      step: "01",
      title: "Recolección de Datos",
      description: "APIs y scraping inteligente de múltiples fuentes",
      icon: Database
    },
    {
      step: "02", 
      title: "Procesamiento IA",
      description: "Análisis con algoritmos de machine learning",
      icon: Brain
    },
    {
      step: "03",
      title: "Predicción",
      description: "Generación de insights y predicciones virales",
      icon: Target
    },
    {
      step: "04",
      title: "Alertas",
      description: "Notificaciones en tiempo real para acción inmediata",
      icon: Zap
    }
  ];

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
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-lg flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">Predix</span>
              <span className="text-xs bg-cyan-500/20 text-cyan-400 px-2 py-1 rounded-full">AI-Powered</span>
            </div>

            <motion.button
              onClick={() => navigate('/register')}
              className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-6 py-2 rounded-lg font-semibold"
              whileHover={{ scale: 1.05 }}
            >
              Comenzar Demo
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* Hero Section */}
      <section className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Tecnología <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">IA Avanzada</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Descubre cómo nuestros algoritmos de inteligencia artificial revolucionan 
              la predicción de tendencias virales con precisión del 99.7%
            </p>
          </motion.div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50 text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <stat.icon className="w-8 h-8 text-blue-400 mx-auto mb-3" />
                <div className="text-2xl font-bold text-white mb-1">{stat.number}</div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Tabs */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-center mb-12">
            <div className="bg-gray-800/50 rounded-xl p-2 border border-gray-700/50">
              {Object.entries(technologies).map(([key, tech]) => (
                <motion.button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                    activeTab === key 
                      ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white' 
                      : 'text-gray-400 hover:text-white'
                  }`}
                  whileHover={{ scale: 1.02 }}
                >
                  <tech.icon className="w-5 h-5 inline mr-2" />
                  {tech.title.split(' ')[0]}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Active Technology Content */}
          <motion.div
            key={activeTab}
            className="bg-gray-800/30 rounded-2xl p-8 border border-gray-700/50"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="text-center mb-12">
              {React.createElement(technologies[activeTab].icon, { className: "w-16 h-16 text-blue-400 mx-auto mb-4" })}
              <h2 className="text-3xl font-bold text-white mb-4">{technologies[activeTab].title}</h2>
              <p className="text-xl text-gray-400">{technologies[activeTab].description}</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {technologies[activeTab].features.map((feature, index) => (
                <motion.div
                  key={index}
                  className="bg-gray-900/50 rounded-xl p-6 border border-gray-700/30"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <feature.icon className="w-10 h-10 text-cyan-400 mb-4" />
                  <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                  <p className="text-gray-400 mb-4">{feature.description}</p>
                  <p className="text-sm text-blue-400">{feature.details}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Architecture Flow */}
      <section className="py-16 bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-4xl font-bold text-white mb-6">Arquitectura del Sistema</h2>
            <p className="text-xl text-gray-400">
              Flujo de procesamiento de datos desde la recolección hasta las alertas
            </p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-8">
            {architectureSteps.map((step, index) => (
              <motion.div
                key={index}
                className="relative"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
              >
                <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700/50 text-center">
                  <div className="text-4xl font-bold text-blue-400 mb-2">{step.step}</div>
                  <step.icon className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
                  <h3 className="text-lg font-bold text-white mb-3">{step.title}</h3>
                  <p className="text-gray-400 text-sm">{step.description}</p>
                </div>
                
                {index < architectureSteps.length - 1 && (
                  <ArrowRight className="hidden md:block absolute -right-4 top-1/2 transform -translate-y-1/2 w-8 h-8 text-blue-400" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            className="bg-gradient-to-r from-blue-600/20 to-cyan-500/20 rounded-2xl p-12 border border-blue-500/30"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Shield className="w-16 h-16 text-blue-400 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-white mb-4">
              ¿Listo para Experimentar el Poder de la IA?
            </h2>
            <p className="text-xl text-gray-400 mb-8">
              Únete a miles de empresas que ya utilizan Predix para anticipar tendencias virales
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                onClick={() => navigate('/register')}
                className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-8 py-4 rounded-xl font-bold text-lg"
                whileHover={{ scale: 1.05 }}
              >
                <Play className="w-5 h-5 inline mr-2" />
                Comenzar Demo Gratuito
              </motion.button>
              
              <motion.button
                onClick={() => navigate('/enterprise')}
                className="border border-gray-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/5"
                whileHover={{ scale: 1.05 }}
              >
                Solución Enterprise
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default TechnologyPage;
