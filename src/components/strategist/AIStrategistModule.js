// ═══════════════════════════════════════════════════════════════
// ESTRATEGA IA — Panel Unificado CMO Virtual
// Fusión: Perfil de Marca + DOFA + Competencia + Playbooks + ROI
// Flujo de scroll: Perfil → Análisis (DOFA / Competidores) → Estrategia → ROI
// ═══════════════════════════════════════════════════════════════
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain, Target, Users, Palette, MessageSquare, Save, Edit3, CheckCircle2,
  ChevronRight, Zap, TrendingUp, TrendingDown, Minus, Plus, Trash2,
  DollarSign, BarChart2, ArrowUpRight, Layers, Shield, Swords, Lightbulb,
  BookOpen, Award, Globe
} from 'lucide-react';

// ── DATA ─────────────────────────────────────────────────────────
const AWARENESS_LEVELS = [
  { value: 'unaware',       label: '1. Inconsciente',       desc: 'No sabe que tiene un problema',       color: 'text-gray-400' },
  { value: 'problem_aware', label: '2. Consciente Problema', desc: 'Conoce el problema, no la solución', color: 'text-amber-400' },
  { value: 'solution_aware',label: '3. Consciente Solución', desc: 'Conoce soluciones, no la tuya',      color: 'text-blue-400' },
  { value: 'product_aware', label: '4. Consciente Producto', desc: 'Conoce tu producto, no está seguro', color: 'text-purple-400' },
  { value: 'most_aware',    label: '5. Muy Consciente',     desc: 'Listo para comprar',                  color: 'text-emerald-400'},
];

const VOICE_OPTIONS = ['Profesional', 'Divertido y cercano', 'Elegante / Luxury', 'Educativo', 'Inspiracional', 'Directo / Sin rodeos'];

const SWOT_CATEGORIES = [
  { key: 'strengths',    label: 'Fortalezas (F)',  icon: TrendingUp,   color: 'text-emerald-400', bg: 'bg-emerald-500/8  border-emerald-500/20',  placeholder: 'Añadir fortaleza...' },
  { key: 'weaknesses',   label: 'Debilidades (D)', icon: TrendingDown, color: 'text-red-400',     bg: 'bg-red-500/8      border-red-500/20',       placeholder: 'Añadir debilidad...' },
  { key: 'opportunities',label: 'Oportunidades (O)',icon: ArrowUpRight, color: 'text-blue-400',   bg: 'bg-blue-500/8     border-blue-500/20',      placeholder: 'Añadir oportunidad...' },
  { key: 'threats',      label: 'Amenazas (A)',    icon: Shield,       color: 'text-amber-400',   bg: 'bg-amber-500/8    border-amber-500/20',     placeholder: 'Añadir amenaza...' },
];

const DEFAULT_SWOT = {
  strengths:     ['Producto/servicio diferenciado', 'Equipo comprometido'],
  weaknesses:    ['Presencia digital limitada', 'Presupuesto ajustado'],
  opportunities: ['Mercado en crecimiento', 'Baja competencia online'],
  threats:       ['Nuevos competidores digitales', 'Cambios en algoritmos'],
};

const INITIAL_COMPETITORS = [
  { id: 1, name: 'Competidor Alpha', price: 'Alto', quality: 'Alta', digital: 'Fuerte', niche: 'general', threat: 'Alta' },
  { id: 2, name: 'Competidor Beta',  price: 'Medio', quality: 'Media', digital: 'Media', niche: 'local',  threat: 'Media' },
];

const PLAYBOOKS = [
  { id: 'startup', label: '🚀 Marca Nueva (0-1K)', desc: 'Estrategia para marcas que empiezan de cero.', steps: [
    'Define tu nicho exacto: NO "ropa", SÍ "ropa de yoga para mujeres +40".',
    'Crea el Perfil de Marca completo en la sección 01.',
    'Publica 1 Reel + 1 Carrusel por semana durante 90 días consecutivos.',
    'Colabora con 3 microinfluencers de 5K–30K seguidores (más baratos y auténticos).',
    'Meta de 90 días: 1,000 seguidores orgánicos + primera venta.',
  ]},
  { id: 'growth',  label: '📈 Marca en Crecimiento (1K-10K)', desc: 'Ya tienes audiencia. Hora de convertir.', steps: [
    'Implementa email marketing: mínimo 500 suscriptores antes de lanzar campañas.',
    'Prueba Meta Ads con un presupuesto de prueba de $5–$10/día durante 2 semanas.',
    'Crea una oferta de entrada de bajo riesgo (tripwire) para convertir seguidores en clientes.',
    'Evalúa qué tipo de contenido generó más ventas (no solo likes) y duplícalo.',
    'Meta de 6 meses: ROAS > 3x en paid media + comunidad activa.',
  ]},
  { id: 'scale',   label: '🏢 Agencia / B2B (10K+)', desc: 'Estrategia de autoridad y contratos premium.', steps: [
    'Publica case studies reales de clientes con resultados cuantificables.',
    'LinkedIn activo: 3 posts por semana con contenido de alto valor para decision-makers.',
    'Desarrolla un diagnóstico gratuito ("Auditoría de Marketing en 15 min") como lead magnet.',
    'Implementa una secuencia de email de 5 pasos para nutrir prospectos B2B.',
    'Meta: cerrar contratos de $1,000+ al mes con ciclo de venta < 30 días.',
  ]},
  { id: 'ecomm',  label: '🛒 E-commerce', desc: 'Estrategia específica para tiendas online.', steps: [
    'Instala el Pixel de Meta y Google Tag Manager el día 1 — sin esto, eres ciego.',
    'Crea 3 flujos de email automáticos: Bienvenida → Carrito Abandonado → Post-compra.',
    'Lanza ads de retargeting solo después de 100+ visitas al sitio (para tener data).',
    'Implementa upsell en carrito y cross-sell en la confirmación de compra.',
    'Meta: ROAS > 4x en temporada baja, >6x en temporada alta.',
  ]},
];

const ROI_CHANNELS = [
  { id: 'organic', label: 'Orgánico Social', cost: 0, hours: 10, leadRate: 0.5, closeRate: 5 },
  { id: 'email',   label: 'Email Marketing',  cost: 50, hours: 3, leadRate: 3, closeRate: 8 },
  { id: 'meta',    label: 'Meta Ads',         cost: 300, hours: 2, leadRate: 2, closeRate: 4 },
  { id: 'google',  label: 'Google Ads',       cost: 400, hours: 2, leadRate: 4, closeRate: 6 },
  { id: 'seo',     label: 'SEO (6m proyec.)', cost: 200, hours: 8, leadRate: 2, closeRate: 5 },
];

// ═══════════════════════════════════════════════════════════════
export default function AIStrategistModule() {
  // ── Brand Profile ──
  const [isEditing, setIsEditing]   = useState(true);
  const [brand, setBrand]           = useState({
    name: '', industry: '', audience: '', painPoints: '', objections: '',
    voice: 'Profesional', color: '#8b5cf6', competitors: '', awarenessLevel: 'problem_aware',
  });
  const [brandSaved, setBrandSaved] = useState(false);

  // ── SWOT ──
  const [swot, setSwot]       = useState(DEFAULT_SWOT);
  const [newSwot, setNewSwot] = useState({ strengths: '', weaknesses: '', opportunities: '', threats: '' });

  // ── Competitors ──
  const [competitors, setCompetitors] = useState(INITIAL_COMPETITORS);
  const [newComp, setNewComp]         = useState({ name: '', price: 'Medio', quality: 'Media', digital: 'Media', niche: '', threat: 'Media' });
  const [showAddComp, setShowAddComp] = useState(false);

  // ── Playbooks ──
  const [expandedPlay, setExpandedPlay] = useState(null);

  // ── ROI ──
  const [ticket, setTicket]       = useState(100);
  const [audience, setAudience]   = useState(1000);

  // ── Brand save ──
  const saveBrand = () => { setIsEditing(false); setBrandSaved(true); };

  // ── SWOT handlers ──
  const addSwotItem = (category) => {
    if (!newSwot[category].trim()) return;
    setSwot(p => ({ ...p, [category]: [...p[category], newSwot[category].trim()] }));
    setNewSwot(p => ({ ...p, [category]: '' }));
  };
  const removeSwotItem = (category, index) =>
    setSwot(p => ({ ...p, [category]: p[category].filter((_, i) => i !== index) }));

  // ── ROI Calc ──
  const roiResults = useMemo(() =>
    ROI_CHANNELS.map(ch => {
      const leads    = audience * (ch.leadRate / 100);
      const sales    = leads * (ch.closeRate / 100);
      const revenue  = sales * ticket;
      const profit   = revenue - ch.cost;
      const roi      = ch.cost > 0 ? ((profit / ch.cost) * 100) : revenue > 0 ? 999 : 0;
      const cpl      = leads > 0 ? ch.cost / leads : 0;
      return { ...ch, leads: Math.round(leads), sales: +(sales).toFixed(1), revenue: +revenue.toFixed(2), profit: +profit.toFixed(2), roi: +roi.toFixed(0), cpl: +cpl.toFixed(2) };
    }),
    [ticket, audience]
  );

  const inputCls = "w-full bg-[#0b0c10] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-purple-500/50 transition-colors disabled:opacity-40 resize-none";

  return (
    <div className="w-full flex flex-col gap-6 pb-20 md:pb-0">

      {/* ══ HERO ══ */}
      <div className="bg-gradient-to-r from-purple-950/60 to-violet-950/50 border border-purple-500/20 rounded-2xl px-6 py-5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/6 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-pink-500/6 rounded-full blur-[80px] pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-500/20 border border-purple-500/30 rounded-full mb-3">
              <div className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
              <span className="text-xs font-bold text-purple-300">✦ Tu Director de Marketing Autónomo</span>
            </div>
            <h1 className="text-2xl font-black text-white flex items-center gap-2 mb-1">
              <Brain className="w-6 h-6 text-purple-400" /> Estratega IA
            </h1>
            <p className="text-purple-200/60 text-sm">Perfil de Marca → Análisis DOFA → Competidores → Estrategia → ROI</p>
          </div>
          <div className="flex gap-3 flex-shrink-0">
            {[
              { label: 'Estado Perfil', value: brandSaved ? '✅ Activo' : '⏳ Borrador', color: brandSaved ? 'text-emerald-400' : 'text-amber-400' },
              { label: 'Competidores', value: competitors.length, color: 'text-white' },
              { label: 'Playbooks',   value: PLAYBOOKS.length, color: 'text-purple-400' },
            ].map((s, i) => (
              <div key={i} className="bg-black/30 border border-white/8 rounded-xl px-4 py-2.5 text-center min-w-[80px]">
                <div className={`text-sm font-black ${s.color}`}>{s.value}</div>
                <div className="text-[10px] text-gray-500 mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ══ SECCIÓN 01: PERFIL DE MARCA ══ */}
      <StratCard step="01" title="Perfil de Marca" subtitle="Define la identidad central de tu marca. Todo el contenido generado en el Estudio se sincroniza con este perfil."
        badge="Identidad" badgeColor="bg-purple-500/15 border-purple-500/30 text-purple-300"
        action={
          <button onClick={() => isEditing ? saveBrand() : setIsEditing(true)}
            className={`flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-bold transition-all shadow-lg ${isEditing ? 'bg-purple-600 hover:bg-purple-500 text-white shadow-purple-500/20' : 'bg-[#111318] border border-white/8 text-gray-300 hover:text-white'}`}>
            {isEditing ? <><Save className="w-4 h-4" /> Guardar Perfil</> : <><Edit3 className="w-4 h-4" /> Editar</>}
          </button>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Col 1: Identidad */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-1">
              <Target className="w-4 h-4 text-purple-400" />
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Identidad Core</span>
            </div>
            {[
              { key: 'name', label: 'Nombre de la Marca', ph: 'Ej: Predix Tech', type: 'input' },
              { key: 'industry', label: 'Industria / Nicho', ph: 'Ej: Tecnología B2B, Moda Sustentable', type: 'input' },
              { key: 'competitors', label: 'Competidores principales', ph: 'Marcas de las que quieres diferenciarte...', type: 'area' },
            ].map(field => (
              <div key={field.key}>
                <label className="text-xs font-bold text-gray-500 mb-1 block uppercase tracking-wide">{field.label}</label>
                {field.type === 'input'
                  ? <input type="text" disabled={!isEditing} value={brand[field.key]} placeholder={field.ph} onChange={e => setBrand(p => ({ ...p, [field.key]: e.target.value }))} className={inputCls} />
                  : <textarea rows="2" disabled={!isEditing} value={brand[field.key]} placeholder={field.ph} onChange={e => setBrand(p => ({ ...p, [field.key]: e.target.value }))} className={inputCls} />
                }
              </div>
            ))}
          </div>

          {/* Col 2: Audiencia y Tono */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-1">
              <Users className="w-4 h-4 text-pink-400" />
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Audiencia & Tono</span>
            </div>
            {[
              { key: 'audience',   label: 'Público Objetivo',  ph: 'Ej: Mujeres 25-45, ingresos medios-altos...', type: 'input' },
              { key: 'painPoints', label: 'Puntos de Dolor',   ph: '¿Qué problema urgente no los deja dormir?', type: 'area' },
              { key: 'objections', label: 'Objeciones Clave',  ph: '¿Por qué no comprarían hoy?', type: 'area' },
            ].map(field => (
              <div key={field.key}>
                <label className="text-xs font-bold text-gray-500 mb-1 block uppercase tracking-wide">{field.label}</label>
                {field.type === 'input'
                  ? <input type="text" disabled={!isEditing} value={brand[field.key]} placeholder={field.ph} onChange={e => setBrand(p => ({ ...p, [field.key]: e.target.value }))} className={inputCls} />
                  : <textarea rows="2" disabled={!isEditing} value={brand[field.key]} placeholder={field.ph} onChange={e => setBrand(p => ({ ...p, [field.key]: e.target.value }))} className={inputCls} />
                }
              </div>
            ))}
            {/* Tono + Color */}
            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-2">
                <label className="text-xs font-bold text-gray-500 mb-1 block uppercase tracking-wide">Tono de Marca</label>
                <select disabled={!isEditing} value={brand.voice} onChange={e => setBrand(p => ({ ...p, voice: e.target.value }))} className={inputCls}>
                  {VOICE_OPTIONS.map(v => <option key={v}>{v}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 mb-1 block uppercase tracking-wide">Color</label>
                <input type="color" disabled={!isEditing} value={brand.color} onChange={e => setBrand(p => ({ ...p, color: e.target.value }))}
                  className="h-[42px] w-full rounded-xl border border-white/10 bg-transparent p-1 cursor-pointer disabled:opacity-40" />
              </div>
            </div>
            {/* Nivel de consciencia */}
            <div>
              <label className="text-xs font-bold text-gray-500 mb-2 block uppercase tracking-wide">Nivel de Consciencia (Schwartz)</label>
              <div className="flex flex-col gap-1">
                {AWARENESS_LEVELS.map(lvl => (
                  <button key={lvl.value} disabled={!isEditing} onClick={() => setBrand(p => ({ ...p, awarenessLevel: lvl.value }))}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs text-left transition-all ${
                      brand.awarenessLevel === lvl.value ? 'bg-purple-500/15 border-purple-500/40 text-white' : 'bg-[#0b0c10] border-white/6 text-gray-500 hover:border-white/15'
                    } disabled:cursor-default`}>
                    <span className={`w-5 font-black flex-shrink-0 ${lvl.color}`}>{lvl.label.charAt(0)}</span>
                    <span>{lvl.label.slice(3)}</span>
                    <span className="text-gray-600 ml-auto text-[10px]">{lvl.desc}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
        {brandSaved && !isEditing && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            className="mt-5 bg-emerald-500/8 border border-emerald-500/25 rounded-xl p-4 flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
            <div>
              <p className="text-sm font-bold text-emerald-400">Perfil sincronizado con la IA ✓</p>
              <p className="text-xs text-gray-500 mt-0.5">Todo el contenido del Estudio Creativo usará este tono, audiencia y paleta de marca.</p>
            </div>
          </motion.div>
        )}
      </StratCard>

      {/* DIVIDER */}
      <Divider />

      {/* ══ SECCIÓN 02: ANÁLISIS DOFA ══ */}
      <StratCard step="02" title="Matriz DOFA" subtitle="Identifica las Fortalezas, Debilidades, Oportunidades y Amenazas de tu marca para tomar decisiones estratégicas."
        badge="DOFA" badgeColor="bg-blue-500/15 border-blue-500/30 text-blue-300">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {SWOT_CATEGORIES.map(cat => {
            const Icon = cat.icon;
            return (
              <div key={cat.key} className={`${cat.bg} border rounded-2xl p-4`}>
                <div className="flex items-center gap-2 mb-3">
                  <Icon className={`w-4 h-4 ${cat.color}`} />
                  <span className={`text-sm font-bold ${cat.color}`}>{cat.label}</span>
                  <span className="ml-auto text-[10px] text-gray-600">{swot[cat.key].length} ítems</span>
                </div>
                <div className="space-y-2 mb-3">
                  <AnimatePresence>
                    {swot[cat.key].map((item, i) => (
                      <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
                        className="flex items-center gap-2 bg-black/20 rounded-xl px-3 py-2 group">
                        <span className="text-xs text-gray-300 flex-1">{item}</span>
                        <button onClick={() => removeSwotItem(cat.key, i)} className="text-gray-700 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all">
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
                <div className="flex gap-2">
                  <input
                    value={newSwot[cat.key]} onChange={e => setNewSwot(p => ({ ...p, [cat.key]: e.target.value }))}
                    onKeyDown={e => e.key === 'Enter' && addSwotItem(cat.key)}
                    placeholder={cat.placeholder}
                    className="flex-1 bg-black/30 border border-white/8 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-white/20 transition-colors"
                  />
                  <button onClick={() => addSwotItem(cat.key)} className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${cat.color.replace('text-', 'bg-').replace('400', '500')}/20 hover:opacity-80 transition-opacity`}>
                    <Plus className={`w-4 h-4 ${cat.color}`} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </StratCard>

      {/* DIVIDER */}
      <Divider />

      {/* ══ SECCIÓN 03: RADAR DE COMPETIDORES ══ */}
      <StratCard step="03" title="Radar de Competidores" subtitle="Mapea visualmente a tus rivales directos e identifica tu ventaja diferencial en el mercado."
        badge="Competidores" badgeColor="bg-cyan-500/15 border-cyan-500/30 text-cyan-300"
        action={
          <button onClick={() => setShowAddComp(!showAddComp)}
            className="flex items-center gap-2 px-3 py-2 bg-cyan-600/80 hover:bg-cyan-500 text-white font-bold rounded-xl text-xs transition-all shadow-lg shadow-cyan-500/15">
            <Plus className="w-3.5 h-3.5" /> Añadir
          </button>
        }
      >
        {showAddComp && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mb-4 bg-[#111318] border border-white/6 rounded-2xl p-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-3">
              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1">Nombre</label>
                <input value={newComp.name} onChange={e => setNewComp(p => ({ ...p, name: e.target.value }))} placeholder="Nombre del competidor"
                  className="w-full bg-[#0b0c10] border border-white/8 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-cyan-500/40 transition-colors" />
              </div>
              {[['price', 'Precio', ['Bajo','Medio','Alto']], ['quality', 'Calidad', ['Baja','Media','Alta']], ['digital', 'Presencia Digital', ['Débil','Media','Fuerte']], ['threat', 'Nivel Amenaza', ['Baja','Media','Alta']]].map(([key, label, opts]) => (
                <div key={key}>
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1">{label}</label>
                  <select value={newComp[key]} onChange={e => setNewComp(p => ({ ...p, [key]: e.target.value }))}
                    className="w-full bg-[#0b0c10] border border-white/8 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-cyan-500/40 transition-colors">
                    {opts.map(o => <option key={o}>{o}</option>)}
                  </select>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <button onClick={() => setShowAddComp(false)} className="px-4 py-2 bg-[#0b0c10] border border-white/6 rounded-xl text-xs text-gray-400 hover:text-white transition-colors">Cancelar</button>
              <button onClick={() => { if (newComp.name) { setCompetitors(p => [...p, { ...newComp, id: Date.now() }]); setNewComp({ name:'', price:'Medio', quality:'Media', digital:'Media', niche:'', threat:'Media' }); setShowAddComp(false); }}}
                className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl text-xs transition-colors">
                Confirmar
              </button>
            </div>
          </motion.div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] uppercase tracking-widest text-gray-600 border-b border-white/5">
                {['Competidor', 'Precio', 'Calidad', 'Digital', 'Amenaza', ''].map(h => (
                  <th key={h} className="px-4 py-3 font-bold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/4">
              <AnimatePresence>
                {competitors.map((c, i) => (
                  <motion.tr key={c.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="hover:bg-white/[0.015] transition-colors">
                    <td className="px-4 py-3 font-semibold text-white text-sm">{c.name}</td>
                    {[c.price, c.quality, c.digital].map((val, vi) => (
                      <td key={vi} className="px-4 py-3">
                        <span className={`text-xs font-bold ${
                          val === 'Alto' || val === 'Alta' || val === 'Fuerte' ? 'text-emerald-400' :
                          val === 'Bajo' || val === 'Baja' || val === 'Débil' ? 'text-red-400' : 'text-amber-400'
                        }`}>{val}</span>
                      </td>
                    ))}
                    <td className="px-4 py-3">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                        c.threat === 'Alta' ? 'bg-red-500/15 text-red-400 border border-red-500/25' :
                        c.threat === 'Media' ? 'bg-amber-500/15 text-amber-400 border border-amber-500/25' :
                        'bg-gray-500/15 text-gray-400 border border-gray-500/25'
                      }`}>{c.threat}</span>
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => setCompetitors(p => p.filter(cc => cc.id !== c.id))} className="text-gray-700 hover:text-red-400 transition-colors">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </StratCard>

      {/* DIVIDER */}
      <Divider />

      {/* ══ SECCIÓN 04: PLAYBOOKS DE NICHO ══ */}
      <StratCard step="04" title="Playbooks de Estrategia" subtitle="Guías de acción paso a paso según tu etapa de crecimiento actual. Selecciona el que más se ajuste a tu situación."
        badge="Playbooks" badgeColor="bg-violet-500/15 border-violet-500/30 text-violet-300">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {PLAYBOOKS.map((pb, i) => (
            <motion.div key={pb.id} whileHover={{ y: -1 }}
              className="bg-[#111318] border border-white/6 rounded-2xl overflow-hidden">
              <button onClick={() => setExpandedPlay(expandedPlay === pb.id ? null : pb.id)}
                className="w-full flex items-center justify-between gap-4 px-5 py-4 hover:bg-white/[0.02] transition-colors text-left">
                <div>
                  <div className="text-sm font-bold text-white">{pb.label}</div>
                  <div className="text-xs text-gray-600 mt-0.5">{pb.desc}</div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-[10px] font-bold text-violet-400 bg-violet-500/10 border border-violet-500/20 rounded-full px-2 py-0.5">{pb.steps.length} pasos</span>
                  <ChevronRight className={`w-4 h-4 text-gray-600 transition-transform ${expandedPlay === pb.id ? 'rotate-90' : ''}`} />
                </div>
              </button>
              <AnimatePresence>
                {expandedPlay === pb.id && (
                  <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
                    <div className="border-t border-white/5 p-4 space-y-3">
                      {pb.steps.map((step, si) => (
                        <div key={si} className="flex gap-3 items-start">
                          <div className="w-5 h-5 rounded-full bg-violet-500/20 border border-violet-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-[9px] font-black text-violet-400">{si + 1}</span>
                          </div>
                          <p className="text-xs text-gray-300 leading-relaxed">{step}</p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </StratCard>

      {/* DIVIDER */}
      <Divider />

      {/* ══ SECCIÓN 05: CALCULADORA ROI ══ */}
      <StratCard step="05" title="Calculadora de ROI por Canal" subtitle="Compara el retorno de cada canal de marketing según tu ticket promedio y audiencia actual."
        badge="ROI" badgeColor="bg-emerald-500/15 border-emerald-500/30 text-emerald-300">
        {/* Controls */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-2">Ticket promedio ($)</label>
            <input type="number" value={ticket} onChange={e => setTicket(+e.target.value)} min={1}
              className="w-full bg-[#0b0c10] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-emerald-500/50 transition-colors" />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-2">Audiencia mensual</label>
            <input type="number" value={audience} onChange={e => setAudience(+e.target.value)} min={1}
              className="w-full bg-[#0b0c10] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-emerald-500/50 transition-colors" />
          </div>
        </div>

        <div className="space-y-3">
          {roiResults.sort((a, b) => b.roi - a.roi).map((ch, i) => {
            const isTop = i === 0;
            return (
              <motion.div key={ch.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                className={`bg-[#111318] border rounded-2xl p-4 ${isTop ? 'border-emerald-500/30 shadow-lg shadow-emerald-500/5' : 'border-white/6'}`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {isTop && <Award className="w-4 h-4 text-emerald-400" />}
                    <span className={`text-sm font-bold ${isTop ? 'text-white' : 'text-gray-300'}`}>{ch.label}</span>
                    {isTop && <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 rounded-full">Mejor ROI</span>}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-500">${ch.cost}/mes</span>
                    <span className={`text-lg font-black ${ch.roi > 200 ? 'text-emerald-400' : ch.roi > 50 ? 'text-amber-400' : 'text-red-400'}`}>
                      {ch.roi > 990 ? '∞' : `${ch.roi}%`} ROI
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { label: 'Leads',       value: ch.leads,         color: 'text-blue-400' },
                    { label: 'Ventas',      value: ch.sales,         color: 'text-emerald-400' },
                    { label: 'Ingresos',    value: `$${ch.revenue.toLocaleString()}`, color: 'text-amber-400' },
                    { label: 'Ganancia',    value: `$${ch.profit.toLocaleString()}`,  color: ch.profit > 0 ? 'text-emerald-400' : 'text-red-400' },
                  ].map((m, mi) => (
                    <div key={mi} className="bg-[#0b0c10] rounded-xl p-2.5 text-center">
                      <div className={`text-sm font-black ${m.color}`}>{m.value}</div>
                      <div className="text-[10px] text-gray-600">{m.label}</div>
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-4 bg-gradient-to-r from-purple-900/20 to-violet-900/15 border border-purple-500/15 rounded-2xl p-5 flex gap-4 items-start">
          <div className="w-8 h-8 rounded-xl bg-purple-500/20 flex items-center justify-center flex-shrink-0">
            <Zap className="w-4 h-4 text-purple-400" />
          </div>
          <div>
            <p className="text-xs font-bold text-purple-400 mb-1">💡 Consejo de ARIA sobre la Estrategia</p>
            <p className="text-xs text-gray-400 leading-relaxed">
              El mayor error que cometen las marcas es intentar estar en todos los canales al mismo tiempo.
              <strong className="text-white"> Elige el canal con mayor ROI para tu etapa actual y mástralo antes de diversificar.</strong>
              {' '}Con menos de 5K en audiencia, el email marketing y el orgánico tienen el mejor retorno. Con más de 10K, prueba paid.
            </p>
          </div>
        </div>
      </StratCard>
    </div>
  );
}

function StratCard({ step, title, subtitle, badge, badgeColor, action, children }) {
  return (
    <div className="bg-[#0e1117] rounded-2xl border border-white/5 overflow-hidden">
      <div className="border-b border-white/5 px-6 py-4 flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/8 flex items-center justify-center flex-shrink-0 mt-0.5">
            <span className="text-[10px] font-black text-gray-500">{step}</span>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-base font-black text-white">{title}</h2>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${badgeColor}`}>{badge}</span>
            </div>
            <p className="text-xs text-gray-500">{subtitle}</p>
          </div>
        </div>
        {action && <div className="flex-shrink-0">{action}</div>}
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

function Divider() {
  return (
    <div className="flex items-center gap-4">
      <div className="flex-1 h-px bg-white/5" />
      <ChevronRight className="w-4 h-4 text-gray-700" />
      <div className="flex-1 h-px bg-white/5" />
    </div>
  );
}
