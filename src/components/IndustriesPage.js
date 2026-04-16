// 🏭 PÁGINA DE INDUSTRIAS - CASOS DE USO ESPECÍFICOS
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Briefcase, Building, Users, Smartphone, ShoppingBag,
  TrendingUp, Target, DollarSign, BarChart3, Eye, Zap, Star,
  CheckCircle, ArrowRight, Play, Award, Lightbulb, Rocket
} from 'lucide-react';

const IndustriesPage = () => {
  const navigate = useNavigate();
  const [selectedIndustry, setSelectedIndustry] = useState('marketing');

  const industries = {
    marketing: {
      title: "Marketing & Publicidad",
      icon: Briefcase,
      description: "Anticipa campañas virales y optimiza presupuestos publicitarios con precisión",
      color: "from-purple-600 to-pink-600",
      metrics: {
        roi: "+250%",
        engagement: "+340%",
        cost: "-60%"
      },
      features: [
        {
          icon: Target,
          title: "Targeting Predictivo",
          description: "Identifica audiencias antes de que se vuelvan mainstream",
          benefit: "Reduce costos de adquisición en 60%"
        },
        {
          icon: TrendingUp,
          title: "Optimización de Campañas",
          description: "Ajusta estrategias en tiempo real basado en tendencias emergentes",
          benefit: "Incrementa ROI en 250%"
        },
        {
          icon: Eye,
          title: "Análisis de Competencia",
          description: "Monitorea estrategias de competidores y anticipa sus movimientos",
          benefit: "Ventaja competitiva de 24-72 horas"
        }
      ],
      caseStudy: {
        company: "Agencia Digital Global",
        challenge: "Reducir costos publicitarios manteniendo efectividad",
        solution: "Implementación de targeting predictivo con Predix",
        results: ["ROI incrementado 250%", "Costos reducidos 60%", "Engagement mejorado 340%"]
      }
    },
    ecommerce: {
      title: "E-commerce & Retail",
      icon: ShoppingBag,
      description: "Predice demanda de productos y optimiza inventarios con IA avanzada",
      color: "from-blue-600 to-cyan-600",
      metrics: {
        sales: "+180%",
        inventory: "-40%",
        conversion: "+95%"
      },
      features: [
        {
          icon: BarChart3,
          title: "Predicción de Demanda",
          description: "Anticipa qué productos serán tendencia antes del pico de demanda",
          benefit: "Incrementa ventas en 180%"
        },
        {
          icon: DollarSign,
          title: "Optimización de Precios",
          description: "Ajusta precios dinámicamente basado en tendencias de mercado",
          benefit: "Maximiza márgenes de ganancia"
        },
        {
          icon: Zap,
          title: "Gestión de Inventario",
          description: "Reduce stock muerto y evita desabastecimientos",
          benefit: "Reduce inventario innecesario 40%"
        }
      ],
      caseStudy: {
        company: "Fashion Retailer Internacional",
        challenge: "Predecir tendencias de moda y optimizar inventario",
        solution: "Sistema de predicción de tendencias con Predix AI",
        results: ["Ventas incrementadas 180%", "Inventario optimizado 40%", "Conversión mejorada 95%"]
      }
    },
    agencies: {
      title: "Agencias Digitales",
      icon: Building,
      description: "Ofrece insights únicos a tus clientes y diferénciate de la competencia",
      color: "from-green-600 to-emerald-600",
      metrics: {
        clients: "+300%",
        retention: "+85%",
        revenue: "+220%"
      },
      features: [
        {
          icon: Lightbulb,
          title: "Insights Exclusivos",
          description: "Proporciona análisis que ninguna otra agencia puede ofrecer",
          benefit: "Diferenciación competitiva única"
        },
        {
          icon: Award,
          title: "Reportes Premium",
          description: "Genera reportes ejecutivos con predicciones precisas",
          benefit: "Incrementa retención de clientes 85%"
        },
        {
          icon: Rocket,
          title: "Escalabilidad",
          description: "Atiende más clientes con la misma calidad de servicio",
          benefit: "Crece la base de clientes 300%"
        }
      ],
      caseStudy: {
        company: "Agencia de Marketing Digital",
        challenge: "Diferenciarse en un mercado saturado",
        solution: "Servicios de predicción de tendencias con Predix",
        results: ["Clientes nuevos +300%", "Retención mejorada +85%", "Ingresos incrementados +220%"]
      }
    },
    creators: {
      title: "Creadores de Contenido",
      icon: Users,
      description: "Crea contenido viral antes de que sea tendencia y maximiza tu alcance",
      color: "from-orange-600 to-red-600",
      metrics: {
        engagement: "+400%",
        followers: "+250%",
        monetization: "+180%"
      },
      features: [
        {
          icon: Star,
          title: "Contenido Viral",
          description: "Identifica temas que se volverán virales en las próximas 24-72 horas",
          benefit: "Engagement incrementado 400%"
        },
        {
          icon: TrendingUp,
          title: "Timing Perfecto",
          description: "Publica en el momento exacto para máximo impacto",
          benefit: "Alcance orgánico optimizado"
        },
        {
          icon: DollarSign,
          title: "Monetización",
          description: "Aprovecha tendencias para maximizar ingresos por contenido",
          benefit: "Ingresos incrementados 180%"
        }
      ],
      caseStudy: {
        company: "Influencer de Lifestyle",
        challenge: "Mantener relevancia y crecimiento constante",
        solution: "Predicción de contenido viral con Predix",
        results: ["Engagement +400%", "Seguidores +250%", "Ingresos +180%"]
      }
    }
  };

  const globalStats = [
    { number: "10,000+", label: "Empresas confían en Predix", icon: Building },
    { number: "500M+", label: "Impresiones generadas", icon: Eye },
    { number: "99.7%", label: "Precisión en predicciones", icon: Target },
    { number: "24-72h", label: "Anticipación promedio", icon: Zap }
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
                <Briefcase className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">Predix</span>
              <span className="text-xs bg-cyan-500/20 text-cyan-400 px-2 py-1 rounded-full">Industries</span>
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
              Soluciones por <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Industria</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Descubre cómo Predix transforma diferentes industrias con predicciones 
              de tendencias precisas y análisis de IA avanzada
            </p>
          </motion.div>

          {/* Global Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            {globalStats.map((stat, index) => (
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

      {/* Industry Selector */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-4 mb-12">
            {Object.entries(industries).map(([key, industry]) => (
              <motion.button
                key={key}
                onClick={() => setSelectedIndustry(key)}
                className={`p-6 rounded-xl border transition-all text-left ${
                  selectedIndustry === key 
                    ? `bg-gradient-to-r ${industry.color} border-transparent text-white` 
                    : 'bg-gray-800/50 border-gray-700/50 text-gray-300 hover:border-gray-600'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <industry.icon className="w-8 h-8 mb-3" />
                <h3 className="font-bold text-lg mb-2">{industry.title}</h3>
                <p className="text-sm opacity-90">{industry.description.split(' ').slice(0, 8).join(' ')}...</p>
              </motion.button>
            ))}
          </div>

          {/* Selected Industry Details */}
          <motion.div
            key={selectedIndustry}
            className="bg-gray-800/30 rounded-2xl p-8 border border-gray-700/50"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Left Column - Industry Info */}
              <div>
                <div className="flex items-center gap-4 mb-6">
                  <div className={`w-16 h-16 bg-gradient-to-r ${industries[selectedIndustry].color} rounded-xl flex items-center justify-center`}>
                    {React.createElement(industries[selectedIndustry].icon, { className: "w-8 h-8 text-white" })}
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-white">{industries[selectedIndustry].title}</h2>
                    <p className="text-gray-400">{industries[selectedIndustry].description}</p>
                  </div>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                  {Object.entries(industries[selectedIndustry].metrics).map(([key, value]) => (
                    <div key={key} className="bg-gray-900/50 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-green-400">{value}</div>
                      <div className="text-xs text-gray-400 capitalize">{key}</div>
                    </div>
                  ))}
                </div>

                {/* Features */}
                <div className="space-y-4">
                  {industries[selectedIndustry].features.map((feature, index) => (
                    <motion.div
                      key={index}
                      className="flex gap-4 p-4 bg-gray-900/30 rounded-lg"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <feature.icon className="w-6 h-6 text-cyan-400 flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="font-bold text-white mb-1">{feature.title}</h4>
                        <p className="text-gray-400 text-sm mb-2">{feature.description}</p>
                        <p className="text-green-400 text-xs font-semibold">{feature.benefit}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Right Column - Case Study */}
              <div>
                <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 border border-gray-700/50">
                  <h3 className="text-xl font-bold text-white mb-4">Caso de Éxito</h3>
                  
                  <div className="mb-6">
                    <h4 className="font-semibold text-blue-400 mb-2">{industries[selectedIndustry].caseStudy.company}</h4>
                    
                    <div className="space-y-4">
                      <div>
                        <span className="text-red-400 font-semibold">Desafío:</span>
                        <p className="text-gray-300 text-sm mt-1">{industries[selectedIndustry].caseStudy.challenge}</p>
                      </div>
                      
                      <div>
                        <span className="text-yellow-400 font-semibold">Solución:</span>
                        <p className="text-gray-300 text-sm mt-1">{industries[selectedIndustry].caseStudy.solution}</p>
                      </div>
                      
                      <div>
                        <span className="text-green-400 font-semibold">Resultados:</span>
                        <ul className="mt-2 space-y-1">
                          {industries[selectedIndustry].caseStudy.results.map((result, index) => (
                            <li key={index} className="flex items-center gap-2 text-sm text-gray-300">
                              <CheckCircle className="w-4 h-4 text-green-400" />
                              {result}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  <motion.button
                    onClick={() => navigate('/register')}
                    className={`w-full bg-gradient-to-r ${industries[selectedIndustry].color} text-white py-3 rounded-lg font-semibold`}
                    whileHover={{ scale: 1.02 }}
                  >
                    Obtener Resultados Similares
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
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
            <Target className="w-16 h-16 text-blue-400 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-white mb-4">
              ¿Listo para Transformar tu Industria?
            </h2>
            <p className="text-xl text-gray-400 mb-8">
              Únete a miles de empresas que ya utilizan Predix para anticipar tendencias y superar a la competencia
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
                <ArrowRight className="w-5 h-5 inline mr-2" />
                Solución Enterprise
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default IndustriesPage;
