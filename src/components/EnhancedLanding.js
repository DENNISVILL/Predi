import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Brain, Eye, Gauge, Clock, TrendingUp, Database, Target,
  Briefcase, Building, Users, Smartphone, Cpu, Network, Lock,
  Award, Infinity, ArrowRight, Play, ChevronDown, Sparkles,
  Crown, Edit, Camera, Zap, Globe
} from 'lucide-react';
// Pricing preview inline (full page at /pricing)
import EntrepreneurProgram from './EntrepreneurProgram';
import MobileMenu from './MobileMenu';

const EnhancedLanding = () => {
  const navigate = useNavigate();
  const [showEntrepreneurProgram, setShowEntrepreneurProgram] = useState(false);
  const [currentStat, setCurrentStat] = useState(0);

  const stats = [
    { number: "6", label: "Departamentos Integrados", icon: Building },
    { number: "100%", label: "Control Multi-Cliente", icon: Target },
    { number: "+50h", label: "Ahorradas al mes", icon: Clock },
    { number: "SaaS", label: "Marca Blanca Incluida", icon: Crown }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStat((prev) => (prev + 1) % stats.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const coreFeatures = [
    {
      icon: Crown,
      title: "Dirección y Estrategia",
      description: "Gestiona las finanzas de tu agencia, mantén a tus clientes organizados en el CRM y define la visión global con nuestro Estratega IA.",
      details: ["Dashboard Financiero", "CRM Integrado", "Estratega IA (CEO Virtual)"]
    },
    {
      icon: Camera,
      title: "Creatividad y Diseño",
      description: "Tu propio estudio de producción. Genera imágenes impactantes, edita contenido y mantén una identidad visual premium.",
      details: ["Generador de Imágenes IA", "Edición Avanzada", "Assets Centralizados"]
    },
    {
      icon: Edit,
      title: "Contenido y Copy",
      description: "El motor de tu agencia. Un planificador omnicanal y un generador de textos persuasivos (copywriting) para redes, emails y webs.",
      details: ["Planificador Omni", "Funnels de Email", "Base de Prompts (10k+)"]
    },
    {
      icon: Zap,
      title: "Performance & Ads",
      description: "Gestión avanzada de presupuestos publicitarios. Optimiza el ROAS en tiempo real y recibe alertas predictivas.",
      details: ["Gestor Multi-Plataforma", "Optimización Automática", "Métricas en Tiempo Real"]
    },
    {
      icon: Globe,
      title: "SEO y Tecnología",
      description: "Domina los buscadores y optimiza la infraestructura web de tus clientes. Auditorías instantáneas y mapas tópicos.",
      details: ["Auditorías SEO", "Topical Maps Automáticos", "Analítica Web Avanzada"]
    },
    {
      icon: Users,
      title: "Comercial y B2B",
      description: "Nunca te quedes sin leads. La Máquina B2B automatiza tu prospección en LinkedIn y te entrega clientes listos para cerrar.",
      details: ["Automatización LinkedIn", "CRM de Leads B2B", "Scripts de Ventas Exitosos"]
    }
  ];

  const industries = [
    { icon: Briefcase, title: "Freelancers Independientes", description: "Multiplica tu capacidad operativa sin contratar empleados.", metrics: "Productividad +300%" },
    { icon: Building, title: "Agencias en Crecimiento", description: "Unifica tus herramientas y centraliza el trabajo de tu equipo.", metrics: "Costos Operativos -40%" },
    { icon: Users, title: "Equipos de Marketing", description: "El complemento perfecto para potenciar los resultados de tu marca.", metrics: "Velocidad +200%" },
    { icon: Crown, title: "Consultores y Estrategas", description: "Entrega reportes de alto nivel y auditorías en segundos.", metrics: "Satisfacción +100%" }
  ];

  return (
    <div className="min-h-screen bg-[#0b0c10] overflow-hidden">
      {/* Enhanced Navbar */}
      <motion.nav
        className="fixed top-0 w-full z-50 bg-[#0b0c10]/90 backdrop-blur-xl border-b border-gray-800/50"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <motion.div
              className="flex items-center gap-3 cursor-pointer"
              whileHover={{ scale: 1.02 }}
              onClick={() => navigate('/')}
            >
              <img src="/logo.png" alt="Predix Logo" className="w-32 h-12 object-contain" />
            </motion.div>

            <div className="hidden md:flex items-center space-x-8">
              <button onClick={() => navigate('/about')} className="text-gray-300 hover:text-[#00ff9d] transition-colors font-medium bg-transparent border-none cursor-pointer">
                El OS
              </button>
              <button onClick={() => navigate('/contact')} className="text-gray-300 hover:text-[#00ff9d] transition-colors font-medium bg-transparent border-none cursor-pointer">
                Agencias
              </button>
              <button onClick={() => navigate('/pricing')} className="text-gray-300 hover:text-[#00ff9d] transition-colors font-medium bg-transparent border-none cursor-pointer">
                Precios
              </button>
            </div>

            <div className="flex items-center space-x-4">
              <motion.button
                className="text-gray-300 hover:text-white transition-colors font-medium"
                whileHover={{ scale: 1.05 }}
                onClick={() => navigate('/login')}
              >
                Iniciar Sesión
              </motion.button>
              <motion.button
                className="border border-gray-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-white/5 transition-all duration-300"
                whileHover={{ scale: 1.05, borderColor: '#00ff9d' }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/register')}
              >
                Registrarse
              </motion.button>
              <motion.button
                className="bg-gradient-to-r from-[#007bff] to-[#00ff9d] text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hidden md:block"
                whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(0, 255, 157, 0.3)" }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/demo-interactive')}
              >
                Crear tu Agencia
              </motion.button>

              {/* Mobile Menu */}
              <MobileMenu />
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Revolutionary Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-6 pt-16">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-[#007bff]/10 via-transparent to-[#00ff9d]/10"></div>
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#007bff]/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#00ff9d]/5 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 text-center max-w-6xl mx-auto">
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-flex items-center gap-2 bg-gradient-to-r from-[#007bff]/20 to-[#00ff9d]/20 border border-[#00ff9d]/30 rounded-full px-6 py-3 text-[#00ff9d] font-semibold mb-6">
              <Sparkles className="w-4 h-4" />
              Tu aliado definitivo. No reemplazamos, potenciamos.
            </span>
          </motion.div>

          <motion.h1
            className="text-4xl md:text-5xl lg:text-7xl font-bold mb-6 leading-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="text-white">No contrates más herramientas.</span><br />
            <span className="text-white">Contrata una </span>
            <span className="gradient-text">Agencia Virtual.</span>
          </motion.h1>

          <motion.p
            className="text-lg md:text-xl text-gray-300 mb-10 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Predix es el primer <strong className="text-[#00ff9d]">Marketing OS</strong> diseñado para freelancers y agencias. 
            Integra Dirección, SEO, Creatividad, Performance y B2B en un solo entorno unificado. 
            <strong className="text-white"> Multiplica los resultados de tus clientes.</strong>
          </motion.p>

          {/* Dynamic Stats */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className="glass-effect rounded-2xl p-5 max-w-sm mx-auto">
              <div className="flex items-center justify-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-[#007bff] to-[#00ff9d] rounded-xl flex items-center justify-center">
                  {React.createElement(stats[currentStat].icon, { className: "w-6 h-6 text-white" })}
                </div>
                <div className="text-left">
                  <div className="text-3xl font-bold text-white">{stats[currentStat].number}</div>
                  <div className="text-gray-400">{stats[currentStat].label}</div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <motion.button
              className="bg-gradient-to-r from-[#007bff] to-[#00ff9d] text-white px-8 py-4 rounded-xl font-bold text-lg shadow-2xl hover:shadow-[#00ff9d]/25 transition-all duration-300 flex items-center gap-2"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/register')}
            >
              Iniciar tu Agencia Gratis
              <ArrowRight className="w-5 h-5" />
            </motion.button>

            <motion.button
              className="border border-gray-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/5 transition-all duration-300 flex items-center gap-2"
              whileHover={{ scale: 1.05, borderColor: '#00ff9d' }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/login')}
            >
              <Play className="w-5 h-5" />
              Ver Demo de 2 Minutos
            </motion.button>
          </motion.div>

          <motion.div
            className="mt-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.2 }}
          >
            <ChevronDown className="w-8 h-8 text-gray-400 mx-auto animate-bounce" />
          </motion.div>
        </div>
      </section>

      {/* Core Technology Section */}
      <section id="technology" className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              6 Departamentos. <span className="gradient-text">1 Plataforma.</span>
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Todo lo que tu agencia necesita, organizado en Hubs departamentales de alto rendimiento.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-6">
            {coreFeatures.map((feature, index) => (
              <motion.div
                key={index}
                className="glass-effect rounded-2xl p-6 hover:border-[#00ff9d]/50 transition-all duration-300"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                <div className="w-14 h-14 bg-gradient-to-r from-[#007bff] to-[#00ff9d] rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-[#00ff9d]/20">
                  <feature.icon className="w-7 h-7 text-white" />
                </div>

                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-400 mb-4 leading-relaxed text-sm">{feature.description}</p>

                <div className="space-y-2 mt-auto">
                  {feature.details.map((detail, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-[#00ff9d] rounded-full"></div>
                      <span className="text-gray-300 text-sm font-medium">{detail}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Industries Section */}
      <section id="industries" className="py-16 px-6 bg-gradient-to-b from-transparent to-[#1f1f1f]/50">
        <div className="max-w-6xl mx-auto">
          <motion.div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Un aliado para <span className="gradient-text">Cada Profesional</span>
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              No somos tu reemplazo. Somos la infraestructura que te permitirá escalar tu talento.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {industries.map((industry, index) => (
              <motion.div
                key={index}
                className="glass-effect rounded-2xl p-5 text-center hover:border-[#00ff9d]/50 transition-all duration-300"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                <div className="w-10 h-10 bg-gradient-to-r from-[#007bff] to-[#00ff9d] rounded-xl flex items-center justify-center mx-auto mb-3">
                  <industry.icon className="w-5 h-5 text-white" />
                </div>

                <h3 className="text-base font-bold text-white mb-2">{industry.title}</h3>
                <p className="text-gray-400 text-xs mb-3">{industry.description}</p>

                <div className="bg-[#00ff9d]/10 border border-[#00ff9d]/30 rounded-lg py-2 px-4 inline-block">
                  <span className="text-[#00ff9d] font-bold text-sm">{industry.metrics}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Pricing Preview Section ─── */}
      <section id="pricing" className="py-20 px-6 bg-gradient-to-b from-transparent to-[#1f1f1f]/40">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            className="text-center mb-14"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2 text-sm text-gray-400 mb-5">
              <Sparkles className="w-4 h-4 text-[#00ff9d]" />
              Planes que escalan contigo
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Paga <span className="gradient-text">exactamente</span> lo que usas
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Desde un plan completo hasta módulos individuales. Sin contratos, sin sorpresas.
            </p>
          </motion.div>

          {/* Plans Grid */}
          <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-10">
            {[
              { id: 'starter', name: 'Starter', price: 'Gratis', tagline: 'Para explorar', icon: Zap, color: 'from-slate-500 to-slate-400', border: 'border-slate-700/50', cta: 'Empezar Gratis', ctaStyle: 'border border-slate-600 text-white hover:bg-white/5', features: ['5 consultas IA/día', 'Radar básico', '1 plataforma (TikTok)'] },
              { id: 'creator', name: 'Creator', price: '$29', tagline: '/mes · Creadores', icon: ArrowRight, color: 'from-blue-500 to-cyan-400', border: 'border-blue-500/30', cta: 'Activar Creator', ctaStyle: 'bg-gradient-to-r from-blue-500 to-cyan-400 text-white', features: ['IA ilimitada', 'Radar completo', 'Chat Estratega', 'Music Trends'] },
              { id: 'pro', name: 'Pro', price: '$79', tagline: '/mes · Agencias', icon: Crown, color: 'from-violet-500 to-purple-600', border: 'border-violet-500', cta: 'Activar Pro', ctaStyle: 'bg-gradient-to-r from-violet-500 to-purple-600 text-white', badge: 'Más Popular', features: ['Todo en Creator', 'Planificador Omni', 'Gestor de Ads', 'Todas las plats.'] },
              { id: 'enterprise', name: 'Enterprise', price: '$299', tagline: '/mes · Empresas', icon: Building, color: 'from-amber-400 to-orange-500', border: 'border-amber-500/40', cta: 'Contactar Ventas', ctaStyle: 'bg-gradient-to-r from-amber-400 to-orange-500 text-white', features: ['Todo en Pro', 'White-label', 'API ilimitada', 'Soporte 24/7'] },
            ].map((plan, idx) => (
              <motion.div
                key={plan.id}
                className={`relative rounded-2xl border ${plan.border} bg-white/3 backdrop-blur-sm p-5 flex flex-col`}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.08, duration: 0.5 }}
                viewport={{ once: true }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                {plan.badge && (
                  <div className={`absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r ${plan.color} text-white text-xs font-bold px-4 py-1 rounded-full`}>
                    ⭐ {plan.badge}
                  </div>
                )}
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-r ${plan.color} flex items-center justify-center mb-3`}>
                  <plan.icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-bold text-white">{plan.name}</h3>
                <div className="mb-1">
                  <span className="text-3xl font-extrabold text-white">{plan.price}</span>
                  <span className="text-gray-500 text-xs ml-1">{plan.tagline}</span>
                </div>
                <ul className="mt-3 mb-5 space-y-1.5 flex-1">
                  {plan.features.map((f, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-gray-300">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#00ff9d] flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() => navigate('/register', { state: { selectedPlan: plan.id } })}
                  className={`w-full py-2.5 rounded-xl font-bold text-sm transition-all duration-200 ${plan.ctaStyle}`}
                >
                  {plan.cta}
                </motion.button>
              </motion.div>
            ))}
          </div>

          {/* Modules CTA */}
          <motion.div
            className="text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex flex-col sm:flex-row items-center gap-4 bg-gradient-to-r from-[#007bff]/10 to-[#00ff9d]/10 border border-[#00ff9d]/20 rounded-2xl px-8 py-5">
              <div className="text-left">
                <p className="text-white font-semibold">¿No necesitas todo el paquete?</p>
                <p className="text-gray-400 text-sm">Elige solo los módulos que necesitas y ahorra hasta un 20%.</p>
              </div>
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate('/pricing')}
                className="flex-shrink-0 bg-gradient-to-r from-[#007bff] to-[#00ff9d] text-white px-6 py-3 rounded-xl font-bold text-sm hover:shadow-lg hover:shadow-[#00ff9d]/20 transition-all"
              >
                Ver Módulos y Precios Completos →
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            className="glass-effect rounded-3xl p-10 border border-[#00ff9d]/20 relative overflow-hidden"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#007bff]/5 to-[#00ff9d]/5"></div>
            <div className="relative z-10">
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                ¿Listo para <span className="gradient-text">Escalar</span> tu Agencia?
              </h2>
              <p className="text-lg text-gray-400 mb-8 max-w-xl mx-auto">
                Crea tu primer Workspace, personaliza tu Marca Blanca e invita a tus clientes hoy mismo.
              </p>

              <motion.button
                className="bg-gradient-to-r from-[#007bff] to-[#00ff9d] text-white px-10 py-4 rounded-xl font-bold text-lg shadow-2xl hover:shadow-[#00ff9d]/25 transition-all duration-300"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/register')}
              >
                Comenzar Gratis
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 px-6 bg-gradient-to-b from-transparent to-[#1f1f1f]/30">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Lo que dicen <span className="gradient-text">nuestros colegas</span>
            </h2>
            <p className="text-lg text-gray-400">
              Freelancers y directores de agencia que ya centralizaron su operación en Predix.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: "Carlos Mendoza",
                role: "Director de Agencia, CMZ",
                avatar: "👨‍💼",
                quote: "Predix nos permitió dejar de pagar 5 suscripciones distintas. Ahora tengo SEO, Ads y Creatividad en un solo lugar bajo mi propio logo.",
                rating: 5
              },
              {
                name: "Laura Gómez",
                role: "Freelancer Social Media",
                avatar: "👩‍💻",
                quote: "El planificador omnicanal es mi salvavidas. Manejo 8 clientes yo sola y Predix me hace parecer un equipo de 5 personas.",
                rating: 5
              },
              {
                name: "Andrés Silva",
                role: "Estratega B2B",
                avatar: "🎯",
                quote: "La Máquina B2B de LinkedIn me trajo 3 reuniones calificadas en mi primera semana. Es simplemente ridículo lo bien que funciona.",
                rating: 5
              }
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                className="glass-effect rounded-2xl p-6"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="text-4xl bg-white/5 w-12 h-12 rounded-full flex items-center justify-center">{testimonial.avatar}</div>
                  <div>
                    <h4 className="text-white font-semibold">{testimonial.name}</h4>
                    <p className="text-gray-400 text-sm">{testimonial.role}</p>
                  </div>
                </div>
                <div className="flex gap-1 mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className="text-[#00ff9d]">★</span>
                  ))}
                </div>
                <p className="text-gray-300 text-sm italic leading-relaxed">"{testimonial.quote}"</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Preguntas <span className="gradient-text">Frecuentes</span>
            </h2>
            <p className="text-lg text-gray-400">
              Todo lo que necesitas saber sobre el Marketing OS.
            </p>
          </motion.div>

          <div className="space-y-4">
            {[
              {
                q: "¿Predix reemplazará mi trabajo como Marketer?",
                a: "Absolutamente NO. Predix es tu copiloto. Nosotros ponemos la infraestructura pesada, los algoritmos y la organización, tú pones la estrategia, el gusto y la relación humana con el cliente."
              },
              {
                q: "¿Cómo funciona la Marca Blanca (White-label)?",
                a: "Puedes subir el logo de tu agencia y elegir tus colores corporativos. Tus clientes verán tu marca en los reportes y dashboards, dándote un posicionamiento ultra profesional."
              },
              {
                q: "¿Puedo tener múltiples clientes separados?",
                a: "Sí. La arquitectura de Predix es Multi-Workspace. Puedes crear un entorno para 'Empresa A' y otro totalmente separado para 'Empresa B', sin cruzar datos."
              },
              {
                q: "¿Qué herramientas incluye exactamente?",
                a: "Incluye 6 departamentos: Finanzas/CRM, Estudio Creativo (Imágenes/Video), Copywriting, SEO (Auditorías), Gestión de Ads y Prospección B2B en LinkedIn."
              }
            ].map((faq, index) => (
              <motion.div
                key={index}
                className="glass-effect rounded-xl p-6 hover:border-[#00ff9d]/30 transition-colors"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <h4 className="text-white font-semibold mb-2">{faq.q}</h4>
                <p className="text-gray-400 text-sm leading-relaxed">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer className="bg-[#1f1f1f] py-12 px-6 border-t border-gray-800/50">
        <div className="max-w-6xl mx-auto">
          {/* Footer Top */}
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <img src="/logo.png" alt="Predix Logo" className="w-40 h-16 object-contain" />
              </div>
              <p className="text-gray-400 text-sm mb-4 max-w-xs">
                El Marketing OS diseñado para escalar agencias y potenciar el talento de freelancers globales.
              </p>
              {/* Social Media */}
              <div className="flex gap-3">
                {[
                  { icon: '𝕏', label: 'Twitter/X', href: '#' },
                  { icon: '📷', label: 'Instagram', href: '#' },
                  { icon: '💼', label: 'LinkedIn', href: '#' },
                  { icon: '▶️', label: 'YouTube', href: '#' }
                ].map((social, i) => (
                  <a
                    key={i}
                    href={social.href}
                    aria-label={social.label}
                    className="w-10 h-10 bg-gray-800/50 hover:bg-[#00ff9d]/20 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110"
                  >
                    <span className="text-lg">{social.icon}</span>
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-white font-semibold mb-4">Producto</h4>
              <ul className="space-y-2">
                <li><button onClick={() => navigate('/pricing#technology')} className="text-gray-400 hover:text-[#00ff9d] transition-colors text-sm bg-transparent border-none cursor-pointer text-left">Plataforma</button></li>
                <li><button onClick={() => navigate('/pricing#industries')} className="text-gray-400 hover:text-[#00ff9d] transition-colors text-sm bg-transparent border-none cursor-pointer text-left">Casos de Uso</button></li>
                <li><button onClick={() => navigate('/pricing')} className="text-gray-400 hover:text-[#00ff9d] transition-colors text-sm bg-transparent border-none cursor-pointer text-left">Precios y Módulos</button></li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="text-white font-semibold mb-4">Predix</h4>
              <ul className="space-y-2">
                {[
                  { label: 'Nuestra Misión', href: '#' },
                  { label: 'Afiliados', href: '#' },
                  { label: 'Soporte B2B', href: '#' }
                ].map((link, i) => (
                  <li key={i}>
                    <a href={link.href} className="text-gray-400 hover:text-[#00ff9d] transition-colors text-sm">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Footer Bottom */}
          <div className="border-t border-gray-800 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              © 2024 Predix OS. Todos los derechos reservados. Impulsando el marketing mundial.
            </p>
            <div className="flex gap-6">
              <button onClick={() => navigate('/terms')} className="text-gray-400 hover:text-white transition-colors text-sm bg-transparent border-none cursor-pointer">Términos</button>
              <button onClick={() => navigate('/privacy')} className="text-gray-400 hover:text-white transition-colors text-sm bg-transparent border-none cursor-pointer">Privacidad</button>
            </div>
          </div>
        </div>
      </footer>

      {/* Entrepreneur Program Modal */}
      {showEntrepreneurProgram && (
        <EntrepreneurProgram onClose={() => setShowEntrepreneurProgram(false)} />
      )}
    </div>
  );
};

export default EnhancedLanding;
