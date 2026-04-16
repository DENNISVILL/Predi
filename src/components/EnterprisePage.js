// 🏢 PÁGINA ENTERPRISE - SOLUCIONES CORPORATIVAS
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Building2, Shield, Users, Globe, Database, Cpu,
  CheckCircle, Star, Award, Lock, Zap, BarChart3, Target,
  Phone, Mail, Calendar, ArrowRight, Play, Crown, Briefcase
} from 'lucide-react';

const EnterprisePage = () => {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState('professional');

  const enterprisePlans = {
    professional: {
      name: "Professional",
      price: "$2,999",
      period: "/mes",
      description: "Para equipos grandes que necesitan análisis avanzado",
      color: "from-blue-600 to-cyan-600",
      features: [
        "Hasta 100 usuarios",
        "API ilimitada",
        "Análisis en tiempo real",
        "Soporte prioritario 24/7",
        "Reportes personalizados",
        "Integración con CRM",
        "Dashboard ejecutivo",
        "Alertas avanzadas"
      ],
      ideal: "Empresas medianas (100-500 empleados)"
    },
    enterprise: {
      name: "Enterprise",
      price: "$9,999",
      period: "/mes",
      description: "Solución completa para grandes corporaciones",
      color: "from-purple-600 to-pink-600",
      features: [
        "Usuarios ilimitados",
        "API dedicada",
        "IA personalizada",
        "Soporte dedicado",
        "Consultoría estratégica",
        "Integración completa",
        "SLA garantizado",
        "Análisis predictivo avanzado",
        "White-label disponible",
        "Implementación on-premise"
      ],
      ideal: "Grandes corporaciones (500+ empleados)"
    },
    custom: {
      name: "Custom Solution",
      price: "Personalizado",
      period: "",
      description: "Solución a medida para necesidades específicas",
      color: "from-orange-600 to-red-600",
      features: [
        "Desarrollo personalizado",
        "Arquitectura dedicada",
        "Integración completa",
        "Consultoría especializada",
        "Soporte premium",
        "SLA personalizado",
        "Capacitación incluida",
        "Mantenimiento completo"
      ],
      ideal: "Empresas con necesidades específicas"
    }
  };

  const enterpriseFeatures = [
    {
      icon: Shield,
      title: "Seguridad Enterprise",
      description: "Encriptación de extremo a extremo, SSO, y cumplimiento de normativas internacionales",
      benefits: ["SOC 2 Type II", "GDPR Compliant", "ISO 27001", "Encriptación AES-256"]
    },
    {
      icon: Database,
      title: "Infraestructura Escalable",
      description: "Arquitectura cloud nativa que escala automáticamente según demanda",
      benefits: ["99.99% Uptime SLA", "Auto-scaling", "Multi-región", "Backup automático"]
    },
    {
      icon: Users,
      title: "Gestión de Equipos",
      description: "Control granular de permisos, roles y accesos para equipos grandes",
      benefits: ["Roles personalizados", "SSO integrado", "Audit logs", "Gestión centralizada"]
    },
    {
      icon: BarChart3,
      title: "Analytics Avanzado",
      description: "Dashboards ejecutivos con métricas personalizadas y reportes automáticos",
      benefits: ["KPIs personalizados", "Reportes automáticos", "Alertas inteligentes", "API completa"]
    }
  ];

  const clientLogos = [
    { name: "Fortune 500 Company", logo: "🏢" },
    { name: "Global Tech Corp", logo: "💻" },
    { name: "International Bank", logo: "🏦" },
    { name: "Media Conglomerate", logo: "📺" },
    { name: "Retail Giant", logo: "🛍️" },
    { name: "Automotive Leader", logo: "🚗" }
  ];

  const testimonials = [
    {
      quote: "Predix Enterprise nos permitió anticipar tendencias de mercado con 72 horas de ventaja, resultando en un incremento del 340% en engagement de nuestras campañas.",
      author: "Sarah Johnson",
      position: "CMO, Global Tech Corp",
      company: "Fortune 100",
      avatar: "👩‍💼"
    },
    {
      quote: "La implementación fue perfecta y el ROI se vio desde el primer mes. El soporte dedicado es excepcional.",
      author: "Michael Chen",
      position: "VP of Marketing",
      company: "International Bank",
      avatar: "👨‍💼"
    },
    {
      quote: "La capacidad de personalización y la integración con nuestros sistemas existentes superó nuestras expectativas.",
      author: "Elena Rodriguez",
      position: "Chief Strategy Officer",
      company: "Media Conglomerate",
      avatar: "👩‍💻"
    }
  ];

  const implementationSteps = [
    {
      step: "01",
      title: "Consulta Estratégica",
      description: "Análisis de necesidades y definición de objetivos",
      duration: "1-2 semanas"
    },
    {
      step: "02",
      title: "Configuración Personalizada",
      description: "Setup de la plataforma según especificaciones",
      duration: "2-4 semanas"
    },
    {
      step: "03",
      title: "Integración de Sistemas",
      description: "Conexión con herramientas y plataformas existentes",
      duration: "2-3 semanas"
    },
    {
      step: "04",
      title: "Capacitación y Go-Live",
      description: "Entrenamiento del equipo y lanzamiento",
      duration: "1 semana"
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
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">Predix</span>
              <span className="text-xs bg-purple-500/20 text-purple-400 px-2 py-1 rounded-full">Enterprise</span>
            </div>

            <motion.button
              onClick={() => navigate('/register')}
              className="bg-gradient-to-r from-purple-600 to-pink-500 text-white px-6 py-2 rounded-lg font-semibold"
              whileHover={{ scale: 1.05 }}
            >
              Solicitar Demo
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
            <div className="flex justify-center mb-6">
              <Crown className="w-16 h-16 text-purple-400" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Soluciones <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Enterprise</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-8">
              Plataforma de predicción de tendencias diseñada para grandes corporaciones 
              que necesitan análisis avanzado, seguridad enterprise y soporte dedicado
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                onClick={() => navigate('/register')}
                className="bg-gradient-to-r from-purple-600 to-pink-500 text-white px-8 py-4 rounded-xl font-bold text-lg"
                whileHover={{ scale: 1.05 }}
              >
                <Play className="w-5 h-5 inline mr-2" />
                Demo Personalizado
              </motion.button>
              
              <motion.button
                className="border border-gray-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/5"
                whileHover={{ scale: 1.05 }}
              >
                <Phone className="w-5 h-5 inline mr-2" />
                Hablar con Ventas
              </motion.button>
            </div>
          </motion.div>

          {/* Client Logos */}
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <p className="text-gray-400 mb-8">Empresas Fortune 500 confían en Predix</p>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-8 items-center">
              {clientLogos.map((client, index) => (
                <motion.div
                  key={index}
                  className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50 text-center"
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="text-3xl mb-2">{client.logo}</div>
                  <div className="text-xs text-gray-400">{client.name}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Enterprise Features */}
      <section className="py-16 bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-4xl font-bold text-white mb-6">Características Enterprise</h2>
            <p className="text-xl text-gray-400">
              Todo lo que necesitas para implementar Predix a escala corporativa
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {enterpriseFeatures.map((feature, index) => (
              <motion.div
                key={index}
                className="bg-gray-800/30 rounded-xl p-8 border border-gray-700/50"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <feature.icon className="w-12 h-12 text-purple-400 mb-6" />
                <h3 className="text-2xl font-bold text-white mb-4">{feature.title}</h3>
                <p className="text-gray-400 mb-6">{feature.description}</p>
                
                <div className="grid grid-cols-2 gap-3">
                  {feature.benefits.map((benefit, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span className="text-sm text-gray-300">{benefit}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Enterprise Plans */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-4xl font-bold text-white mb-6">Planes Enterprise</h2>
            <p className="text-xl text-gray-400">
              Soluciones escalables para organizaciones de cualquier tamaño
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {Object.entries(enterprisePlans).map(([key, plan]) => (
              <motion.div
                key={key}
                className={`relative bg-gray-800/30 rounded-2xl p-8 border transition-all cursor-pointer ${
                  selectedPlan === key 
                    ? 'border-purple-500 bg-purple-500/10' 
                    : 'border-gray-700/50 hover:border-gray-600'
                }`}
                onClick={() => setSelectedPlan(key)}
                whileHover={{ scale: 1.02 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Object.keys(enterprisePlans).indexOf(key) * 0.1 }}
              >
                {key === 'enterprise' && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-purple-600 to-pink-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                      Más Popular
                    </span>
                  </div>
                )}

                <div className={`w-12 h-12 bg-gradient-to-r ${plan.color} rounded-xl flex items-center justify-center mb-6`}>
                  {key === 'custom' ? <Star className="w-6 h-6 text-white" /> : <Building2 className="w-6 h-6 text-white" />}
                </div>

                <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                <p className="text-gray-400 mb-6">{plan.description}</p>

                <div className="mb-6">
                  <span className="text-4xl font-bold text-white">{plan.price}</span>
                  <span className="text-gray-400">{plan.period}</span>
                </div>

                <div className="space-y-3 mb-8">
                  {plan.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-400" />
                      <span className="text-gray-300">{feature}</span>
                    </div>
                  ))}
                </div>

                <div className="text-sm text-purple-400 mb-6 font-semibold">
                  {plan.ideal}
                </div>

                <motion.button
                  className={`w-full py-3 rounded-xl font-semibold transition-all ${
                    selectedPlan === key
                      ? `bg-gradient-to-r ${plan.color} text-white`
                      : 'border border-gray-600 text-white hover:bg-white/5'
                  }`}
                  whileHover={{ scale: 1.02 }}
                >
                  {key === 'custom' ? 'Contactar Ventas' : 'Solicitar Demo'}
                </motion.button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Implementation Process */}
      <section className="py-16 bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-4xl font-bold text-white mb-6">Proceso de Implementación</h2>
            <p className="text-xl text-gray-400">
              Implementación guiada con soporte dedicado en cada paso
            </p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-8">
            {implementationSteps.map((step, index) => (
              <motion.div
                key={index}
                className="relative text-center"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
              >
                <div className="bg-gradient-to-r from-purple-600 to-pink-500 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                  <span className="text-white font-bold text-xl">{step.step}</span>
                </div>
                
                <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                <p className="text-gray-400 mb-3">{step.description}</p>
                <span className="text-purple-400 text-sm font-semibold">{step.duration}</span>
                
                {index < implementationSteps.length - 1 && (
                  <ArrowRight className="hidden md:block absolute -right-4 top-8 w-8 h-8 text-purple-400" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-4xl font-bold text-white mb-6">Lo que Dicen Nuestros Clientes</h2>
            <p className="text-xl text-gray-400">
              Testimonios de líderes de Fortune 500
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                className="bg-gray-800/30 rounded-xl p-8 border border-gray-700/50"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                
                <p className="text-gray-300 mb-6 italic">"{testimonial.quote}"</p>
                
                <div className="flex items-center gap-3">
                  <div className="text-3xl">{testimonial.avatar}</div>
                  <div>
                    <div className="font-bold text-white">{testimonial.author}</div>
                    <div className="text-purple-400 text-sm">{testimonial.position}</div>
                    <div className="text-gray-400 text-xs">{testimonial.company}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            className="bg-gradient-to-r from-purple-600/20 to-pink-500/20 rounded-2xl p-12 border border-purple-500/30"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Briefcase className="w-16 h-16 text-purple-400 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-white mb-4">
              ¿Listo para Implementar Predix Enterprise?
            </h2>
            <p className="text-xl text-gray-400 mb-8">
              Habla con nuestro equipo de ventas para una demostración personalizada 
              y descubre cómo Predix puede transformar tu organización
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                className="bg-gradient-to-r from-purple-600 to-pink-500 text-white px-8 py-4 rounded-xl font-bold text-lg"
                whileHover={{ scale: 1.05 }}
              >
                <Calendar className="w-5 h-5 inline mr-2" />
                Agendar Demo
              </motion.button>
              
              <motion.button
                className="border border-gray-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/5"
                whileHover={{ scale: 1.05 }}
              >
                <Mail className="w-5 h-5 inline mr-2" />
                Contactar Ventas
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default EnterprisePage;
