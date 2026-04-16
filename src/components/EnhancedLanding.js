import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Brain, Eye, Gauge, Clock, TrendingUp, Database, Target,
  Briefcase, Building, Users, Smartphone, Cpu, Network, Lock,
  Award, Infinity, ArrowRight, Play, ChevronDown, Sparkles
} from 'lucide-react';
import PricingPlans from './PricingPlans';
import EntrepreneurProgram from './EntrepreneurProgram';
import MobileMenu from './MobileMenu';

const EnhancedLanding = () => {
  const navigate = useNavigate();
  const [showEntrepreneurProgram, setShowEntrepreneurProgram] = useState(false);
  const [currentStat, setCurrentStat] = useState(0);

  const stats = [
    { number: "24-72h", label: "Anticipación de tendencias", icon: Clock },
    { number: "+300%", label: "Incremento en engagement", icon: TrendingUp },
    { number: "15M+", label: "Datos procesados diariamente", icon: Database },
    { number: "99.7%", label: "Precisión en predicciones", icon: Target }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStat((prev) => (prev + 1) % stats.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const coreFeatures = [
    {
      icon: Brain,
      title: "Inteligencia Artificial Avanzada",
      description: "Algoritmos de machine learning que procesan millones de datos en tiempo real para identificar patrones emergentes antes que la competencia.",
      details: ["Deep Learning Neural Networks", "Procesamiento de Lenguaje Natural", "Análisis Predictivo Multivariable"]
    },
    {
      icon: Eye,
      title: "Monitoreo Multiplataforma",
      description: "Vigilancia continua de TikTok, Instagram, Twitter, YouTube y más de 50 plataformas digitales para capturar microtendencias emergentes.",
      details: ["API Integrations Nativas", "Scraping Inteligente", "Análisis Cross-Platform"]
    },
    {
      icon: Gauge,
      title: "Análisis en Tiempo Real",
      description: "Dashboard ejecutivo con métricas actualizadas cada segundo, alertas inteligentes y reportes automatizados para toma de decisiones ágil.",
      details: ["Real-time Analytics", "Custom KPIs", "Automated Reporting"]
    }
  ];

  const industries = [
    { icon: Briefcase, title: "Marketing & Publicidad", description: "Anticipa campañas virales y optimiza presupuestos publicitarios", metrics: "ROI +250%" },
    { icon: Building, title: "E-commerce & Retail", description: "Predice demanda de productos y optimiza inventarios", metrics: "Ventas +180%" },
    { icon: Users, title: "Agencias Digitales", description: "Ofrece insights únicos a tus clientes y diferénciate", metrics: "Clientes +300%" },
    { icon: Smartphone, title: "Creadores de Contenido", description: "Crea contenido viral antes que sea tendencia", metrics: "Engagement +400%" }
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
                Quiénes Somos
              </button>
              <button onClick={() => navigate('/contact')} className="text-gray-300 hover:text-[#00ff9d] transition-colors font-medium bg-transparent border-none cursor-pointer">
                Contáctanos
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
                className="bg-gradient-to-r from-[#007bff] to-[#00ff9d] text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(0, 255, 157, 0.3)" }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/demo-interactive')}
              >
                Demo Gratuito
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
              Revoluciona tu estrategia digital con IA
            </span>
          </motion.div>

          <motion.h1
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="text-white">Predice el </span>
            <span className="gradient-text">Futuro Digital</span>
            <br />
            <span className="text-white">Antes que </span>
            <span className="text-gray-400">Suceda</span>
          </motion.h1>

          <motion.p
            className="text-lg md:text-xl text-gray-300 mb-10 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            La primera plataforma de <strong className="text-[#00ff9d]">Inteligencia Artificial</strong> que analiza
            <strong className="text-white"> 15 millones de datos diarios</strong> para predecir tendencias virales
            <strong className="text-[#007bff]"> 24-72 horas antes</strong> que emerjan.
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
              className="bg-gradient-to-r from-[#007bff] to-[#00ff9d] text-white px-6 py-3 rounded-xl font-bold text-base shadow-2xl hover:shadow-[#00ff9d]/25 transition-all duration-300 flex items-center gap-2"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/register')}
            >
              Comenzar Demo Gratuito
              <ArrowRight className="w-4 h-4" />
            </motion.button>

            <motion.button
              className="border border-gray-600 text-white px-6 py-3 rounded-xl font-semibold text-base hover:bg-white/5 transition-all duration-300 flex items-center gap-2"
              whileHover={{ scale: 1.05, borderColor: '#00ff9d' }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/login')}
            >
              <Play className="w-4 h-4" />
              Iniciar Sesión
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
              Tecnología de <span className="gradient-text">Vanguardia</span>
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Infraestructura enterprise construida por ex-ingenieros de Google, Meta y Microsoft
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-6">
            {coreFeatures.map((feature, index) => (
              <motion.div
                key={index}
                className="glass-effect rounded-2xl p-6 hover:border-[#00ff9d]/50 transition-all duration-300"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                <div className="w-14 h-14 bg-gradient-to-r from-[#007bff] to-[#00ff9d] rounded-2xl flex items-center justify-center mb-4">
                  <feature.icon className="w-7 h-7 text-white" />
                </div>

                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-400 mb-4 leading-relaxed text-sm">{feature.description}</p>

                <div className="space-y-2">
                  {feature.details.map((detail, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-[#00ff9d] rounded-full"></div>
                      <span className="text-gray-300 text-sm">{detail}</span>
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
              Impacto <span className="gradient-text">Comprobado</span>
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Resultados reales en las industrias más competitivas del mundo digital
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

                <div className="bg-[#00ff9d]/10 border border-[#00ff9d]/30 rounded-lg py-2 px-4">
                  <span className="text-[#00ff9d] font-bold">{industry.metrics}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <PricingPlans
        onSelectPlan={(plan) => {
          if (plan.id === 'entrepreneur') {
            setShowEntrepreneurProgram(true);
          } else {
            navigate('/auth');
          }
        }}
      />

      {/* CTA Section */}
      <section className="py-16 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            className="glass-effect rounded-3xl p-8"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              ¿Listo para <span className="gradient-text">Liderar</span> tu Mercado?
            </h2>
            <p className="text-lg text-gray-400 mb-6">
              Únete a las empresas que ya están usando el futuro para ganar hoy
            </p>

            <motion.button
              className="bg-gradient-to-r from-[#007bff] to-[#00ff9d] text-white px-8 py-3 rounded-xl font-bold text-base shadow-2xl hover:shadow-[#00ff9d]/25 transition-all duration-300"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/register')}
            >
              Comenzar Ahora - Es Gratis
            </motion.button>
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
              Lo que dicen <span className="gradient-text">nuestros clientes</span>
            </h2>
            <p className="text-lg text-gray-400">
              Resultados reales de empresas que ya están ganando con Predix
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: "Sarah Johnson",
                role: "CMO, TechCorp",
                avatar: "👩‍💼",
                quote: "Predix nos ayudó a incrementar nuestro engagement en 340% anticipando tendencias virales. ROI impresionante.",
                rating: 5
              },
              {
                name: "Michael Chen",
                role: "Marketing Director",
                avatar: "👨‍💼",
                quote: "La precisión de las predicciones es impresionante. Logramos predicciones con 240% mejor ROI en el primer trimestre.",
                rating: 5
              },
              {
                name: "Sofia García",
                role: "Content Creator",
                avatar: "👩‍🎨",
                quote: "Como creadora, Predix me da ventaja competitiva. Sé qué contenido crear antes que todos. Mis vistas subieron 400%.",
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
                  <div className="text-4xl">{testimonial.avatar}</div>
                  <div>
                    <h4 className="text-white font-semibold">{testimonial.name}</h4>
                    <p className="text-gray-400 text-sm">{testimonial.role}</p>
                  </div>
                </div>
                <div className="flex gap-1 mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className="text-yellow-400">⭐</span>
                  ))}
                </div>
                <p className="text-gray-300 text-sm italic">"{testimonial.quote}"</p>
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
              Todo lo que necesitas saber sobre Predix
            </p>
          </motion.div>

          <div className="space-y-4">
            {[
              {
                q: "¿Cómo funciona Predix?",
                a: "Predix utiliza algoritmos de deep learning que analizan 15 millones de datos diarios de múltiples plataformas para identificar patrones emergentes 24-72 horas antes que se vuelvan virales."
              },
              {
                q: "¿Qué plataformas soportan?",
                a: "Actualmente monitoreamos TikTok, Instagram, Twitter/X, YouTube, LinkedIn, Spotify y más de 50 plataformas. Agregamos nuevas plataformas constantemente según demanda."
              },
              {
                q: "¿Puedo cancelar en cualquier momento?",
                a: "Sí, puedes cancelar tu subscripción en cualquier momento sin penalización. Además ofrecemos garantía de 14 días, si no estás satisfecho te devolvemos tu dinero."
              },
              {
                q: "¿Necesito conocimientos técnicos?",
                a: "No. Predix está diseñado para ser intuitivo y fácil de usar. Si puedes usar redes sociales, puedes usar Predix. Además ofrecemos tutoriales y soporte 24/7."
              }
            ].map((faq, index) => (
              <motion.div
                key={index}
                className="glass-effect rounded-xl p-6"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <h4 className="text-white font-semibold mb-2">{faq.q}</h4>
                <p className="text-gray-400 text-sm">{faq.a}</p>
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
                La plataforma de IA más avanzada para predecir tendencias digitales y ganar en el mercado.
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
                <li><button onClick={() => navigate('/pricing#technology')} className="text-gray-400 hover:text-[#00ff9d] transition-colors text-sm bg-transparent border-none cursor-pointer text-left">Tecnología</button></li>
                <li><button onClick={() => navigate('/pricing#industries')} className="text-gray-400 hover:text-[#00ff9d] transition-colors text-sm bg-transparent border-none cursor-pointer text-left">Industrias</button></li>
                <li><button onClick={() => navigate('/pricing#enterprise')} className="text-gray-400 hover:text-[#00ff9d] transition-colors text-sm bg-transparent border-none cursor-pointer text-left">Enterprise</button></li>
                <li><button onClick={() => navigate('/pricing')} className="text-gray-400 hover:text-[#00ff9d] transition-colors text-sm bg-transparent border-none cursor-pointer text-left">Precios</button></li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="text-white font-semibold mb-4">Empresa</h4>
              <ul className="space-y-2">
                {[
                  { label: 'Sobre Nosotros', href: '#' },
                  { label: 'Blog', href: '#' },
                  { label: 'Contacto', href: '#' },
                  { label: 'Carreras', href: '#' }
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
              © 2024 Predix. Todos los derechos reservados. Hecho con ❤️ para predecir el futuro.
            </p>
            <div className="flex gap-6">
              <button onClick={() => navigate('/terms')} className="text-gray-400 hover:text-white transition-colors text-sm bg-transparent border-none cursor-pointer">Términos</button>
              <button onClick={() => navigate('/privacy')} className="text-gray-400 hover:text-white transition-colors text-sm bg-transparent border-none cursor-pointer">Privacidad</button>
              <button className="text-gray-400 hover:text-white transition-colors text-sm bg-transparent border-none cursor-pointer">Cookies</button>
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
