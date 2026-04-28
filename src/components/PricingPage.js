import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
    ArrowLeft, Check, X, Zap, Rocket, Crown, Building2, Star,
    Brain, Radio, CalendarDays, BarChart3, Megaphone, Music2,
    ShoppingCart, ChevronDown, Sparkles, Shield, Gift, Minus,
    TrendingUp, Bot, Package, Layers
} from 'lucide-react';

// ════════════════════════════════════════════════
// DATA — Planes Completos
// ════════════════════════════════════════════════
const FULL_PLANS = [
    {
        id: 'starter',
        name: 'Starter',
        tagline: 'Para explorar Predix',
        price: { monthly: 0, yearly: 0 },
        color: 'from-slate-500 to-slate-400',
        borderColor: 'border-slate-700',
        badge: null,
        icon: Zap,
        cta: 'Empezar Gratis',
        ctaStyle: 'border border-slate-600 text-white hover:bg-white/5',
        modules: ['radar_basic', 'chat_5'],
        limits: '5 consultas/día • 1 plataforma',
        features: [
            { text: '5 consultas de IA por día', included: true },
            { text: 'Radar de Tendencias (básico)', included: true },
            { text: '1 plataforma (TikTok)', included: true },
            { text: 'Chat Estratega IA', included: false },
            { text: 'Planificador Omni', included: false },
            { text: 'Gestor de Ads', included: false },
            { text: 'Music Trends', included: false },
            { text: 'API Access', included: false },
        ]
    },
    {
        id: 'creator',
        name: 'Creator',
        tagline: 'Para creadores de contenido',
        price: { monthly: 29, yearly: 279 },
        color: 'from-blue-500 to-cyan-400',
        borderColor: 'border-blue-500/40',
        badge: null,
        icon: Rocket,
        cta: 'Activar Plan Creator',
        ctaStyle: 'bg-gradient-to-r from-blue-500 to-cyan-400 text-white hover:shadow-xl hover:shadow-blue-500/25',
        modules: ['radar_full', 'chat_unlimited', 'music'],
        limits: 'Ilimitado • 3 plataformas',
        features: [
            { text: 'Consultas de IA ilimitadas', included: true },
            { text: 'Radar de Tendencias (completo)', included: true },
            { text: '3 plataformas (TikTok, IG, X)', included: true },
            { text: 'Chat Estratega IA', included: true },
            { text: 'Music Trends Detector', included: true },
            { text: 'Planificador Omni', included: false },
            { text: 'Gestor de Ads', included: false },
            { text: 'API Access', included: false },
        ]
    },
    {
        id: 'pro',
        name: 'Pro',
        tagline: 'Para agencias y marketers',
        price: { monthly: 79, yearly: 759 },
        color: 'from-violet-500 to-purple-600',
        borderColor: 'border-violet-500',
        badge: 'Más Popular',
        badgeColor: 'from-violet-500 to-purple-600',
        icon: Crown,
        cta: 'Activar Plan Pro',
        ctaStyle: 'bg-gradient-to-r from-violet-500 to-purple-600 text-white hover:shadow-xl hover:shadow-violet-500/25',
        modules: ['radar_full', 'chat_unlimited', 'music', 'planner', 'ads', 'analytics'],
        limits: 'Ilimitado • Todas las plataformas',
        features: [
            { text: 'Consultas de IA ilimitadas', included: true },
            { text: 'Radar de Tendencias (IA avanzada)', included: true },
            { text: 'Todas las plataformas', included: true },
            { text: 'Chat Estratega IA', included: true },
            { text: 'Music Trends Detector', included: true },
            { text: 'Planificador Omni (Kanban + Calendar)', included: true },
            { text: 'Gestor de Ads + ROAS', included: true },
            { text: 'API Access', included: false },
        ]
    },
    {
        id: 'enterprise',
        name: 'Enterprise',
        tagline: 'Para grandes equipos',
        price: { monthly: 299, yearly: 2870 },
        color: 'from-amber-400 to-orange-500',
        borderColor: 'border-amber-500/50',
        badge: 'White-label',
        badgeColor: 'from-amber-400 to-orange-500',
        icon: Building2,
        cta: 'Contactar Ventas',
        ctaStyle: 'bg-gradient-to-r from-amber-400 to-orange-500 text-white hover:shadow-xl hover:shadow-amber-500/25',
        modules: ['all'],
        limits: 'Todo incluido + dedicado',
        features: [
            { text: 'Todo en Pro', included: true },
            { text: 'Infraestructura dedicada (SLA 99.9%)', included: true },
            { text: 'API Access ilimitada', included: true },
            { text: 'White-label completo', included: true },
            { text: 'Account Manager dedicado', included: true },
            { text: 'Onboarding personalizado', included: true },
            { text: 'Integraciones a medida', included: true },
            { text: 'Soporte 24/7 prioritario', included: true },
        ]
    }
];

// ════════════════════════════════════════════════
// DATA — Módulos / Paquetes
// ════════════════════════════════════════════════
const MODULES = [
    {
        id: 'chat_ia',
        name: 'Chat Estratega IA',
        description: 'Asistente de marketing 24/7 con memoria de conversación y especialización en tu nicho.',
        icon: Brain,
        color: 'from-violet-500 to-purple-600',
        price: 12,
        yearlyPrice: 115,
        tag: 'IA',
        tagColor: 'bg-violet-500/20 text-violet-300',
        features: ['Conversaciones ilimitadas', 'Memoria de nicho', 'Generador de copys', 'Plan de contenidos semanal'],
        popular: false,
    },
    {
        id: 'radar',
        name: 'Radar de Tendencias',
        description: 'Detecta microtendencias virales 24-72 horas antes de que exploten en tu industria.',
        icon: Radio,
        color: 'from-cyan-500 to-blue-500',
        price: 15,
        yearlyPrice: 144,
        tag: 'Core',
        tagColor: 'bg-cyan-500/20 text-cyan-300',
        features: ['Monitor en tiempo real', 'Predicción de viralidad', 'Alertas personalizadas', 'Todas las plataformas'],
        popular: true,
    },
    {
        id: 'planner',
        name: 'Planificador Omni',
        description: 'Organiza y programa tu contenido en todas las redes desde un solo panel Kanban.',
        icon: CalendarDays,
        color: 'from-emerald-500 to-green-400',
        price: 14,
        yearlyPrice: 134,
        tag: 'Productividad',
        tagColor: 'bg-emerald-500/20 text-emerald-300',
        features: ['Vista Kanban y Calendario', 'Programación multi-red', 'Templates de contenido', 'Flujos de aprobación'],
        popular: false,
    },
    {
        id: 'ads',
        name: 'Gestor de Ads',
        description: 'Simula, optimiza y calcula el ROAS real de tus campañas en Meta, TikTok y Google.',
        icon: BarChart3,
        color: 'from-orange-500 to-red-500',
        price: 18,
        yearlyPrice: 173,
        tag: 'Analytics',
        tagColor: 'bg-orange-500/20 text-orange-300',
        features: ['Simulador de presupuesto', 'Cálculo ROAS / CPA / CPC', 'Predicción de performance', 'Multi-plataforma'],
        popular: false,
    },
    {
        id: 'music',
        name: 'Music Trends',
        description: 'Descubre los audios que van a ser virales antes de que todo el mundo los use.',
        icon: Music2,
        color: 'from-pink-500 to-rose-500',
        price: 9,
        yearlyPrice: 86,
        tag: 'TikTok & Reels',
        tagColor: 'bg-pink-500/20 text-pink-300',
        features: ['Top audios virales', 'Integración Spotify/Apple Music', 'Alertas de tendencias musicales', 'Preview directo'],
        popular: false,
    },
    {
        id: 'community_manager',
        name: 'Community Manager IA',
        description: 'Automatiza respuestas, gestiona followers y mantiene activa a tu comunidad con IA.',
        icon: Bot,
        color: 'from-indigo-500 to-blue-600',
        price: 19,
        yearlyPrice: 182,
        tag: 'Automatización',
        tagColor: 'bg-indigo-500/20 text-indigo-300',
        features: ['Respuestas automáticas IA', 'Moderation de comentarios', 'Reporte de comunidad', 'Engagement automático'],
        popular: false,
    },
];

// ════════════════════════════════════════════════
// FAQ
// ════════════════════════════════════════════════
const FAQ = [
    { q: '¿Puedo mezclar módulos y un plan completo?', a: 'No es necesario. Los planes completos ya incluyen los módulos indicados. Los módulos individuales son para quienes solo necesitan una funcionalidad específica sin el paquete completo.' },
    { q: '¿Puedo cambiar de plan o módulos en cualquier momento?', a: 'Sí, absolutamente. Puedes hacer upgrade, downgrade o añadir/quitar módulos cuando quieras. Los cambios se aplican de inmediato y el costo se prorratea.' },
    { q: '¿Qué pasa al comprar 3 módulos o más?', a: 'Si seleccionas 3 o más módulos individuales, el sistema aplica automáticamente un descuento del 20% sobre el total y te muestra el ahorro vs. comprarlos por separado.' },
    { q: '¿Hay contrato de permanencia?', a: 'No, todos los planes y módulos son mes a mes. Puedes cancelar cuando quieras sin comisiones ni penalizaciones.' },
    { q: '¿Hay descuentos para ONGs o educación?', a: 'Sí, ofrecemos 50% de descuento para organizaciones sin fines de lucro e instituciones educativas verificadas. Contáctanos en soporte.' },
];

// ════════════════════════════════════════════════
// MAIN COMPONENT
// ════════════════════════════════════════════════
const PricingPageNew = () => {
    const navigate = useNavigate();
    const [billing, setBilling] = useState('monthly');
    const [activeTab, setActiveTab] = useState('plans'); // 'plans' | 'modules'
    const [selectedModules, setSelectedModules] = useState([]);
    const [activeFaq, setActiveFaq] = useState(null);

    const toggleModule = (id) => {
        setSelectedModules(prev =>
            prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]
        );
    };

    const getModuleTotal = () => {
        const total = selectedModules.reduce((sum, id) => {
            const mod = MODULES.find(m => m.id === id);
            if (!mod) return sum;
            return sum + (billing === 'yearly' ? mod.yearlyPrice / 12 : mod.price);
        }, 0);
        const discount = selectedModules.length >= 3 ? 0.8 : 1;
        return { subtotal: total, total: total * discount, hasDiscount: selectedModules.length >= 3 };
    };

    const getPrice = (plan) => {
        if (plan.price.monthly === 0) return 'GRATIS';
        if (billing === 'yearly') return `$${Math.round(plan.price.yearly / 12)}`;
        return `$${plan.price.monthly}`;
    };

    const getSavings = (plan) => {
        if (plan.price.monthly === 0 || billing !== 'yearly') return null;
        const saved = plan.price.monthly * 12 - plan.price.yearly;
        return `Ahorras $${saved}/año`;
    };

    const { subtotal, total, hasDiscount } = getModuleTotal();

    return (
        <div className="min-h-screen bg-[#0b0c10] text-white">

            {/* ── Navbar ── */}
            <nav className="fixed top-0 w-full z-50 bg-[#0b0c10]/90 backdrop-blur-xl border-b border-white/5">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <button onClick={() => navigate('/')} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                        <span className="hidden sm:inline">Volver</span>
                    </button>
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-[#007bff] to-[#00ff9d] rounded-xl flex items-center justify-center">
                            <Sparkles className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-xl font-bold bg-gradient-to-r from-[#007bff] to-[#00ff9d] bg-clip-text text-transparent">Predix</span>
                    </div>
                    <button onClick={() => navigate('/register')} className="bg-gradient-to-r from-[#007bff] to-[#00ff9d] text-white px-5 py-2 rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity">
                        Empezar Gratis
                    </button>
                </div>
            </nav>

            {/* ── Hero ── */}
            <section className="pt-36 pb-12 px-6 text-center">
                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
                    <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2 text-sm text-gray-400 mb-6">
                        <Star className="w-4 h-4 text-[#00ff9d]" />
                        Precios transparentes, sin sorpresas
                    </div>
                    <h1 className="text-5xl md:text-6xl font-bold mb-5 leading-tight">
                        Paga <span className="bg-gradient-to-r from-[#007bff] to-[#00ff9d] bg-clip-text text-transparent">exactamente</span><br />lo que usas
                    </h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-8">
                        Elige un plan completo o arma tu propio paquete seleccionando solo los módulos que necesitas.
                    </p>
                    <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-400">
                        {['14 días de prueba gratuita', 'Sin tarjeta de crédito', 'Cancela cuando quieras', 'Soporte en español'].map((t, i) => (
                            <div key={i} className="flex items-center gap-2">
                                <Check className="w-4 h-4 text-[#00ff9d]" />
                                <span>{t}</span>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </section>

            {/* ── Billing Toggle ── */}
            <div className="flex flex-col items-center gap-4 pb-10">
                {/* Tab Switcher */}
                <div className="flex bg-white/5 border border-white/10 rounded-2xl p-1">
                    {[
                        { id: 'plans', label: 'Planes Completos', icon: Layers },
                        { id: 'modules', label: 'Módulos a la Carta', icon: Package },
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${activeTab === tab.id
                                ? 'bg-gradient-to-r from-[#007bff] to-[#00ff9d] text-white shadow-lg'
                                : 'text-gray-400 hover:text-white'
                                }`}
                        >
                            <tab.icon className="w-4 h-4" />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Billing toggle */}
                <div className="flex items-center gap-3 text-sm">
                    <span className={billing === 'monthly' ? 'text-white font-semibold' : 'text-gray-500'}>Mensual</span>
                    <button
                        onClick={() => setBilling(b => b === 'monthly' ? 'yearly' : 'monthly')}
                        className="relative w-12 h-6 bg-gray-700 rounded-full transition-colors"
                    >
                        <motion.div
                            className="absolute top-1 left-1 w-4 h-4 bg-gradient-to-r from-[#007bff] to-[#00ff9d] rounded-full"
                            animate={{ x: billing === 'yearly' ? 24 : 0 }}
                            transition={{ type: 'spring', stiffness: 300 }}
                        />
                    </button>
                    <span className={billing === 'yearly' ? 'text-white font-semibold' : 'text-gray-500'}>
                        Anual
                        <span className="ml-2 text-xs bg-[#00ff9d]/20 text-[#00ff9d] px-2 py-0.5 rounded-full">-20%</span>
                    </span>
                </div>
            </div>

            {/* ══════════════════════════════════════ */}
            {/* TAB: PLANES COMPLETOS                  */}
            {/* ══════════════════════════════════════ */}
            <AnimatePresence mode="wait">
                {activeTab === 'plans' && (
                    <motion.section
                        key="plans"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.4 }}
                        className="px-6 pb-20 max-w-7xl mx-auto"
                    >
                        <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-6">
                            {FULL_PLANS.map((plan, idx) => (
                                <motion.div
                                    key={plan.id}
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.08 }}
                                    whileHover={{ y: -6, transition: { duration: 0.2 } }}
                                    className={`relative flex flex-col rounded-2xl border ${plan.borderColor} bg-white/3 backdrop-blur-sm overflow-hidden ${plan.badge === 'Mais Popular' || plan.id === 'pro' ? 'ring-2 ring-violet-500/50' : ''}`}
                                >
                                    {/* Badge */}
                                    {plan.badge && (
                                        <div className={`absolute top-0 inset-x-0 text-center py-1.5 text-xs font-bold text-white bg-gradient-to-r ${plan.badgeColor}`}>
                                            {plan.badge === 'Más Popular' && <Star className="w-3 h-3 inline mr-1" />}
                                            {plan.badge === 'White-label' && <Building2 className="w-3 h-3 inline mr-1" />}
                                            {plan.badge}
                                        </div>
                                    )}

                                    <div className={`p-6 ${plan.badge ? 'pt-10' : 'pt-6'} flex flex-col flex-1`}>
                                        {/* Icon + Name */}
                                        <div className={`w-11 h-11 rounded-xl bg-gradient-to-r ${plan.color} flex items-center justify-center mb-4`}>
                                            <plan.icon className="w-5 h-5 text-white" />
                                        </div>
                                        <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                                        <p className="text-gray-500 text-sm mt-1 mb-5">{plan.tagline}</p>

                                        {/* Price */}
                                        <div className="mb-2">
                                            <span className="text-4xl font-extrabold text-white">{getPrice(plan)}</span>
                                            {plan.price.monthly > 0 && (
                                                <span className="text-gray-500 text-sm ml-1">/mes</span>
                                            )}
                                        </div>
                                        {getSavings(plan) && (
                                            <span className="inline-block text-xs text-[#00ff9d] bg-[#00ff9d]/10 border border-[#00ff9d]/20 px-2 py-1 rounded-full mb-4">
                                                {getSavings(plan)}
                                            </span>
                                        )}
                                        {!getSavings(plan) && <div className="mb-4" />}

                                        {/* Limits */}
                                        <p className="text-xs text-gray-500 mb-4">{plan.limits}</p>

                                        {/* Features */}
                                        <ul className="space-y-2.5 mb-6 flex-1">
                                            {plan.features.map((f, i) => (
                                                <li key={i} className={`flex items-start gap-2 text-sm ${f.included ? 'text-gray-300' : 'text-gray-600'}`}>
                                                    {f.included
                                                        ? <Check className="w-4 h-4 text-[#00ff9d] flex-shrink-0 mt-0.5" />
                                                        : <Minus className="w-4 h-4 flex-shrink-0 mt-0.5" />
                                                    }
                                                    {f.text}
                                                </li>
                                            ))}
                                        </ul>

                                        {/* CTA */}
                                        <motion.button
                                            whileTap={{ scale: 0.97 }}
                                            onClick={() => navigate('/register', { state: { selectedPlan: plan.id } })}
                                            className={`w-full py-3 rounded-xl font-bold text-sm transition-all duration-200 ${plan.ctaStyle}`}
                                        >
                                            {plan.cta}
                                        </motion.button>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Comparison note */}
                        <p className="text-center text-gray-600 text-sm mt-8">
                            ¿No necesitas todo el paquete? Prueba{' '}
                            <button onClick={() => setActiveTab('modules')} className="text-[#007bff] hover:underline font-semibold">
                                Módulos a la Carta →
                            </button>
                        </p>
                    </motion.section>
                )}

                {/* ══════════════════════════════════════ */}
                {/* TAB: MÓDULOS A LA CARTA                */}
                {/* ══════════════════════════════════════ */}
                {activeTab === 'modules' && (
                    <motion.section
                        key="modules"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.4 }}
                        className="px-6 pb-32 max-w-7xl mx-auto"
                    >
                        {/* Hint */}
                        <div className="text-center mb-10">
                            <p className="text-gray-400">Selecciona los módulos que necesitas. <span className="text-[#00ff9d] font-semibold">Elige 3 o más y obtén 20% de descuento automático.</span></p>
                        </div>

                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                            {MODULES.map((mod, idx) => {
                                const isSelected = selectedModules.includes(mod.id);
                                const price = billing === 'yearly' ? (mod.yearlyPrice / 12).toFixed(1) : mod.price;

                                return (
                                    <motion.div
                                        key={mod.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.07 }}
                                        onClick={() => toggleModule(mod.id)}
                                        className={`relative cursor-pointer rounded-2xl border p-5 transition-all duration-200 ${isSelected
                                            ? 'border-[#00ff9d]/60 bg-[#00ff9d]/5 ring-1 ring-[#00ff9d]/30'
                                            : 'border-white/8 bg-white/3 hover:border-white/20'
                                            }`}
                                    >
                                        {/* Popular tag */}
                                        {mod.popular && (
                                            <div className="absolute -top-3 left-4 bg-gradient-to-r from-[#007bff] to-[#00ff9d] text-white text-xs font-bold px-3 py-1 rounded-full">
                                                Más Usado
                                            </div>
                                        )}

                                        {/* Selected indicator */}
                                        <div className={`absolute top-4 right-4 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${isSelected ? 'bg-[#00ff9d] border-[#00ff9d]' : 'border-gray-600'}`}>
                                            {isSelected && <Check className="w-3 h-3 text-black" strokeWidth={3} />}
                                        </div>

                                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-r ${mod.color} flex items-center justify-center mb-3`}>
                                            <mod.icon className="w-5 h-5 text-white" />
                                        </div>

                                        <div className="flex items-start justify-between mb-1 pr-8">
                                            <h3 className="font-bold text-white text-base">{mod.name}</h3>
                                        </div>

                                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${mod.tagColor} mb-2 inline-block`}>
                                            {mod.tag}
                                        </span>

                                        <p className="text-gray-400 text-sm mb-4 leading-relaxed">{mod.description}</p>

                                        <ul className="space-y-1.5 mb-4">
                                            {mod.features.map((f, i) => (
                                                <li key={i} className="flex items-center gap-2 text-xs text-gray-400">
                                                    <Check className="w-3 h-3 text-[#00ff9d] flex-shrink-0" />
                                                    {f}
                                                </li>
                                            ))}
                                        </ul>

                                        <div className="border-t border-white/8 pt-3 flex items-center justify-between">
                                            <div>
                                                <span className="text-2xl font-bold text-white">${price}</span>
                                                <span className="text-gray-500 text-xs ml-1">/mes</span>
                                                {billing === 'yearly' && (
                                                    <div className="text-xs text-[#00ff9d] mt-0.5">${mod.yearlyPrice}/año</div>
                                                )}
                                            </div>
                                            <div className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${isSelected
                                                ? 'bg-[#00ff9d] text-black'
                                                : 'bg-white/8 text-gray-300'
                                                }`}>
                                                {isSelected ? '✓ Seleccionado' : 'Agregar'}
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>

                        {/* ── Sticky Cart ── */}
                        <AnimatePresence>
                            {selectedModules.length > 0 && (
                                <motion.div
                                    initial={{ y: 100, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    exit={{ y: 100, opacity: 0 }}
                                    className="fixed bottom-0 inset-x-0 z-50 px-4 pb-4"
                                >
                                    <div className="max-w-2xl mx-auto bg-[#111827] border border-white/10 rounded-2xl p-4 shadow-2xl backdrop-blur-xl">
                                        <div className="flex items-center justify-between gap-4">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <ShoppingCart className="w-4 h-4 text-[#00ff9d]" />
                                                    <span className="text-white font-semibold text-sm">
                                                        {selectedModules.length} módulo{selectedModules.length !== 1 ? 's' : ''} seleccionado{selectedModules.length !== 1 ? 's' : ''}
                                                    </span>
                                                    {hasDiscount && (
                                                        <span className="text-xs bg-[#00ff9d]/20 text-[#00ff9d] px-2 py-0.5 rounded-full font-bold">20% OFF aplicado</span>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    {hasDiscount && (
                                                        <span className="text-gray-500 line-through text-sm">${subtotal.toFixed(0)}/mes</span>
                                                    )}
                                                    <span className="text-2xl font-extrabold text-white">${total.toFixed(0)}<span className="text-sm font-normal text-gray-400">/mes</span></span>
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => setSelectedModules([])}
                                                    className="px-3 py-2 rounded-xl text-gray-400 hover:text-white border border-white/10 text-sm transition-colors"
                                                >
                                                    Limpiar
                                                </button>
                                                <motion.button
                                                    whileTap={{ scale: 0.96 }}
                                                    onClick={() => navigate('/register', { state: { selectedModules, total: total.toFixed(0) } })}
                                                    className="bg-gradient-to-r from-[#007bff] to-[#00ff9d] text-white px-6 py-2 rounded-xl font-bold text-sm hover:opacity-90 transition-opacity"
                                                >
                                                    Activar Paquete →
                                                </motion.button>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <p className="text-center text-gray-600 text-sm mt-10">
                            ¿Necesitas todo incluido? Mira los{' '}
                            <button onClick={() => setActiveTab('plans')} className="text-[#007bff] hover:underline font-semibold">
                                Planes Completos →
                            </button>
                        </p>
                    </motion.section>
                )}
            </AnimatePresence>

            {/* ── Guarantee Banner ── */}
            <section className="px-6 pb-16">
                <div className="max-w-3xl mx-auto">
                    <motion.div
                        className="bg-gradient-to-r from-[#007bff]/10 to-[#00ff9d]/10 border border-[#00ff9d]/20 rounded-2xl p-6 text-center"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                    >
                        <Shield className="w-10 h-10 text-[#00ff9d] mx-auto mb-3" />
                        <h3 className="text-xl font-bold text-white mb-2">Garantía de satisfacción de 14 días</h3>
                        <p className="text-gray-400 text-sm">Si no estás 100% satisfecho, te devolvemos tu dinero sin preguntas. Sin burocracia.</p>
                    </motion.div>
                </div>
            </section>

            {/* ── FAQ ── */}
            <section className="px-6 pb-20">
                <div className="max-w-2xl mx-auto">
                    <h2 className="text-3xl font-bold text-white text-center mb-10">
                        Preguntas <span className="bg-gradient-to-r from-[#007bff] to-[#00ff9d] bg-clip-text text-transparent">frecuentes</span>
                    </h2>
                    <div className="space-y-3">
                        {FAQ.map((faq, i) => (
                            <div key={i} className="bg-white/3 border border-white/8 rounded-xl overflow-hidden">
                                <button
                                    onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                                    className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-white/5 transition-colors"
                                >
                                    <span className="text-white font-semibold text-sm pr-4">{faq.q}</span>
                                    <ChevronDown className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform duration-200 ${activeFaq === i ? 'rotate-180' : ''}`} />
                                </button>
                                <AnimatePresence>
                                    {activeFaq === i && (
                                        <motion.div
                                            initial={{ height: 0 }}
                                            animate={{ height: 'auto' }}
                                            exit={{ height: 0 }}
                                            className="overflow-hidden"
                                        >
                                            <p className="px-5 pb-4 text-gray-400 text-sm leading-relaxed">{faq.a}</p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Final CTA ── */}
            <section className="px-6 pb-24">
                <div className="max-w-4xl mx-auto text-center">
                    <motion.div
                        className="bg-gradient-to-br from-[#007bff]/15 via-[#0b0c10] to-[#00ff9d]/10 border border-white/8 rounded-3xl p-12"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-4xl font-bold text-white mb-4">
                            Empieza hoy, <span className="bg-gradient-to-r from-[#007bff] to-[#00ff9d] bg-clip-text text-transparent">gratis</span>
                        </h2>
                        <p className="text-gray-400 mb-8 max-w-xl mx-auto">
                            Sin tarjeta de crédito. Sin compromiso. Descubre el poder de predecir tendencias virales con IA.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <motion.button
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                                onClick={() => navigate('/register')}
                                className="bg-gradient-to-r from-[#007bff] to-[#00ff9d] text-white px-10 py-4 rounded-2xl font-bold text-lg hover:shadow-xl hover:shadow-[#007bff]/25 transition-all"
                            >
                                Comenzar Gratis — 14 días
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.97 }}
                                onClick={() => navigate('/demo')}
                                className="border border-white/20 text-white px-10 py-4 rounded-2xl font-bold text-lg hover:bg-white/5 transition-all"
                            >
                                Ver Demo en Vivo
                            </motion.button>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
};

export default PricingPageNew;
