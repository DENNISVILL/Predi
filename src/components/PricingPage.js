import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    ArrowLeft, Check, Star, Zap, Building, Users, TrendingUp,
    Shield, Clock, Database, Target, Cpu, Network, Globe,
    Sparkles, Crown, Gift, ChevronDown
} from 'lucide-react';
import PricingPlans from './PricingPlans';

const PricingPage = () => {
    const navigate = useNavigate();
    const { hash } = useLocation();
    const [activeFaq, setActiveFaq] = useState(null);

    React.useEffect(() => {
        if (hash) {
            const element = document.getElementById(hash.replace('#', ''));
            if (element) {
                setTimeout(() => {
                    element.scrollIntoView({ behavior: 'smooth' });
                }, 100);
            }
        }
    }, [hash]);

    const technologies = [
        {
            icon: Cpu,
            title: "Deep Learning IA",
            description: "Algoritmos avanzados que aprenden de 15M+ datos diarios",
            included: ["Básico", "Pro", "Premium", "Enterprise"]
        },
        {
            icon: Database,
            title: "Big Data Analytics",
            description: "Procesamiento en tiempo real de múltiples fuentes",
            included: ["Pro", "Premium", "Enterprise"]
        },
        {
            icon: Network,
            title: "API Integrations",
            description: "Conecta con tus herramientas favoritas",
            included: ["Pro", "Premium", "Enterprise"]
        },
        {
            icon: Shield,
            title: "Security Enterprise",
            description: "Encriptación extremo a extremo y compliance GDPR",
            included: ["Premium", "Enterprise"]
        }
    ];

    const industries = [
        {
            name: "Marketing & Publicidad",
            icon: TrendingUp,
            features: [
                "Predicción de campañas virales",
                "Optimización de presupuestos",
                "Análisis de competencia",
                "ROI automático"
            ],
            roi: "+250%",
            plans: ["Pro", "Premium", "Enterprise"]
        },
        {
            name: "E-commerce & Retail",
            icon: Building,
            features: [
                "Predicción de demanda",
                "Optimización de inventarios",
                "Tendencias de compra",
                "Análisis de productos"
            ],
            roi: "+180%",
            plans: ["Pro", "Premium", "Enterprise"]
        },
        {
            name: "Creadores de Contenido",
            icon: Users,
            features: [
                "Ideas de contenido viral",
                "Mejor momento para publicar",
                "Análisis de audiencia",
                "Trending topics"
            ],
            roi: "+400%",
            plans: ["Básico", "Pro", "Premium"]
        }
    ];

    const enterpriseFeatures = [
        {
            category: "Infraestructura",
            features: [
                "SLA 99.9% garantizado",
                "Servidores dedicados",
                "CDN global",
                "Backup diario automático"
            ]
        },
        {
            category: "Seguridad",
            features: [
                "SOC2 Type II certified",
                "Cumplimiento GDPR",
                "Auditorías trimestrales",
                "SSO/SAML integration"
            ]
        },
        {
            category: "Soporte",
            features: [
                "Account Manager dedicado",
                "Soporte 24/7 prioritario",
                "Training personalizado",
                "Consultoría estratégica"
            ]
        },
        {
            category: "Customización",
            features: [
                "White-label completo",
                "API personalizada",
                "Integraciones a medida",
                "Roadmap exclusivo"
            ]
        }
    ];

    const pricingFaq = [
        {
            q: "¿Puedo cambiar de plan en cualquier momento?",
            a: "Sí, puedes hacer upgrade o downgrade cuando quieras. Los cambios se aplican inmediatamente y se prorratea el costo."
        },
        {
            q: "¿Ofrecen descuentos para ONGs o educación?",
            a: "Sí, ofrecemos 50% de descuento para organizaciones sin fines de lucro y instituciones educativas. Contacta a ventas."
        },
        {
            q: "¿Qué métodos de pago aceptan?",
            a: "Aceptamos tarjetas de crédito/débito, PayPal, transferencias bancarias y para Enterprise también facturación anual."
        },
        {
            q: "¿Hay contrato de permanencia?",
            a: "No, todos los planes son mes a mes sin contrato. Puedes cancelar cuando quieras sin penalización."
        },
        {
            q: "¿Incluyen training y onboarding?",
            a: "Planes Premium y Enterprise incluyen training personalizado. Básico y Pro tienen tutoriales en video y documentación completa."
        }
    ];

    return (
        <div className="min-h-screen bg-[#0b0c10]">
            {/* Navbar Simple */}
            <nav className="fixed top-0 w-full z-50 bg-[#0b0c10]/90 backdrop-blur-xl border-b border-gray-800/50">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <button
                        onClick={() => navigate('/')}
                        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span>Volver a inicio</span>
                    </button>

                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-[#007bff] to-[#00ff9d] rounded-xl flex items-center justify-center">
                            <Sparkles className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-bold gradient-text">Predix</span>
                    </div>

                    <button
                        onClick={() => navigate('/register')}
                        className="bg-gradient-to-r from-[#007bff] to-[#00ff9d] text-white px-6 py-2 rounded-xl font-semibold hover:shadow-xl transition-all"
                    >
                        Comenzar Gratis
                    </button>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="pt-32 pb-16 px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h1 className="text-5xl md:text-6xl font-bold mb-6">
                            Planes que <span className="gradient-text">Escalan</span> con tu Negocio
                        </h1>
                        <p className="text-xl text-gray-400 mb-8">
                            Desde startups hasta Fortune 500. Elige el plan perfecto para tus necesidades y cambia cuando crezcas.
                        </p>
                        <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-400">
                            <div className="flex items-center gap-2">
                                <Check className="w-5 h-5 text-[#00ff9d]" />
                                <span>14 días de prueba gratis</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Check className="w-5 h-5 text-[#00ff9d]" />
                                <span>Sin tarjeta de crédito</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Check className="w-5 h-5 text-[#00ff9d]" />
                                <span>Cancela cuando quieras</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Pricing Plans */}
            <div id="pricing-plans"></div>
            <div id="pricing-plans"></div>
            <PricingPlans onSelectPlan={(plan) => navigate('/register', { state: { selectedPlanId: plan.id } })} />

            {/* Technology Section */}
            <section id="technology" className="py-16 px-6 bg-gradient-to-b from-transparent to-[#1f1f1f]/30">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12">
                        Tecnología <span className="gradient-text">Incluida</span> en cada Plan
                    </h2>

                    <div className="grid md:grid-cols-2 gap-6">
                        {technologies.map((tech, i) => (
                            <motion.div
                                key={i}
                                className="glass-effect rounded-2xl p-6"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                viewport={{ once: true }}
                            >
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-gradient-to-r from-[#007bff] to-[#00ff9d] rounded-xl flex items-center justify-center flex-shrink-0">
                                        <tech.icon className="w-6 h-6 text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-xl font-bold text-white mb-2">{tech.title}</h3>
                                        <p className="text-gray-400 text-sm mb-3">{tech.description}</p>
                                        <div className="flex flex-wrap gap-2">
                                            {tech.included.map((plan, j) => (
                                                <span key={j} className="text-xs bg-[#00ff9d]/10 text-[#00ff9d] px-3 py-1 rounded-full border border-[#00ff9d]/30">
                                                    {plan}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Industries Section */}
            <section id="industries" className="py-16 px-6">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-4">
                        Optimizado por <span className="gradient-text">Industria</span>
                    </h2>
                    <p className="text-gray-400 text-center mb-12">
                        Cada plan está diseñado para maximizar resultados en tu sector
                    </p>

                    <div className="grid md:grid-cols-3 gap-6">
                        {industries.map((industry, i) => (
                            <motion.div
                                key={i}
                                className="glass-effect rounded-2xl p-6"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                viewport={{ once: true }}
                                whileHover={{ y: -5 }}
                            >
                                <div className="w-12 h-12 bg-gradient-to-r from-[#007bff] to-[#00ff9d] rounded-xl flex items-center justify-center mb-4">
                                    <industry.icon className="w-6 h-6 text-white" />
                                </div>

                                <h3 className="text-xl font-bold text-white mb-3">{industry.name}</h3>

                                <div className="bg-[#00ff9d]/10 border border-[#00ff9d]/30 rounded-lg py-2 px-4 mb-4">
                                    <span className="text-[#00ff9d] font-bold">{industry.roi} ROI promedio</span>
                                </div>

                                <ul className="space-y-2 mb-4">
                                    {industry.features.map((feature, j) => (
                                        <li key={j} className="flex items-start gap-2">
                                            <Check className="w-4 h-4 text-[#00ff9d] flex-shrink-0 mt-0.5" />
                                            <span className="text-gray-300 text-sm">{feature}</span>
                                        </li>
                                    ))}
                                </ul>

                                <div className="text-xs text-gray-500">
                                    Disponible en: {industry.plans.join(', ')}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Enterprise Details */}
            <section id="enterprise" className="py-16 px-6 bg-gradient-to-b from-[#1f1f1f]/30 to-transparent">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/30 rounded-full px-4 py-2 mb-4">
                            <Building className="w-5 h-5 text-indigo-400" />
                            <span className="text-indigo-400 font-semibold">Enterprise</span>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                            Solución <span className="gradient-text">Corporativa</span> Completa
                        </h2>
                        <p className="text-gray-400 text-lg">
                            Todo lo que necesitas para escalar Predix en tu organización
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {enterpriseFeatures.map((category, i) => (
                            <motion.div
                                key={i}
                                className="glass-effect rounded-xl p-6"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                viewport={{ once: true }}
                            >
                                <h3 className="text-white font-bold mb-4">{category.category}</h3>
                                <ul className="space-y-3">
                                    {category.features.map((feature, j) => (
                                        <li key={j} className="flex items-start gap-2">
                                            <Check className="w-4 h-4 text-[#00ff9d] flex-shrink-0 mt-0.5" />
                                            <span className="text-gray-300 text-sm">{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </motion.div>
                        ))}
                    </div>

                    <div className="text-center mt-8">
                        <button
                            onClick={() => navigate('/register')}
                            className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-xl transition-all"
                        >
                            Contactar Ventas Enterprise
                        </button>
                    </div>
                </div>
            </section>

            {/* FAQ */}
            <section className="py-16 px-6">
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12">
                        Preguntas sobre <span className="gradient-text">Precios</span>
                    </h2>

                    <div className="space-y-4">
                        {pricingFaq.map((faq, i) => (
                            <motion.div
                                key={i}
                                className="glass-effect rounded-xl overflow-hidden"
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                                viewport={{ once: true }}
                            >
                                <button
                                    onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                                    className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-white/5 transition-colors"
                                >
                                    <span className="text-white font-semibold">{faq.q}</span>
                                    <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${activeFaq === i ? 'rotate-180' : ''}`} />
                                </button>
                                {activeFaq === i && (
                                    <div className="px-6 pb-4">
                                        <p className="text-gray-400 text-sm">{faq.a}</p>
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="py-16 px-6">
                <div className="max-w-4xl mx-auto glass-effect rounded-3xl p-8 text-center">
                    <h2 className="text-3xl font-bold text-white mb-4">
                        ¿Listo para <span className="gradient-text">Empezar</span>?
                    </h2>
                    <p className="text-gray-400 mb-6">
                        Comienza gratis hoy. No necesitas tarjeta de crédito.
                    </p>
                    <button
                        onClick={() => navigate('/register')}
                        className="bg-gradient-to-r from-[#007bff] to-[#00ff9d] text-white px-8 py-3 rounded-xl font-bold hover:shadow-xl transition-all"
                    >
                        Comenzar Demo Gratuito
                    </button>
                </div>
            </section>
        </div>
    );
};

export default PricingPage;
