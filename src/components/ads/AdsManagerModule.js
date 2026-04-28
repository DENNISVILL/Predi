// ═══════════════════════════════════════════════════════════════
// GESTOR DE ADS — Panel Unificado de Campaña
// Fusión: Simulador ROAS + Planificador + Calculadora + Budget
// Flujo: Configura → Proyecta → Crea Campaña
// ═══════════════════════════════════════════════════════════════
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Megaphone, TrendingUp, DollarSign, Target, ShoppingCart, Users,
  CheckCircle, AlertCircle, Plus, Trash2, Play, Pause, Clock,
  CheckCircle2, Download, RefreshCw, ChevronRight, Zap, BarChart2,
  ArrowRight, Activity, Eye, MousePointerClick
} from 'lucide-react';

// ── DATA ─────────────────────────────────────────────────────────
const PLATFORMS = [
  { id: 'meta',      label: 'Meta Ads',     emoji: '📘', sub: 'Facebook / Instagram',  cpcBase: 0.45, ctrBase: 0.9,  convRate: 2.8, color: 'from-blue-600 to-indigo-600',  accent: '#3b82f6' },
  { id: 'google',    label: 'Google Ads',   emoji: '🔍', sub: 'Search / Display / PMax', cpcBase: 1.80, ctrBase: 4.2, convRate: 4.1, color: 'from-sky-500 to-cyan-400',     accent: '#0ea5e9' },
  { id: 'tiktok',    label: 'TikTok Ads',   emoji: '🎵', sub: 'Video / TopView',         cpcBase: 0.28, ctrBase: 2.1, convRate: 1.9, color: 'from-pink-500 to-rose-500',    accent: '#ec4899' },
  { id: 'youtube',   label: 'YouTube Ads',  emoji: '📺', sub: 'In-Stream / Bumper',       cpcBase: 0.10, ctrBase: 0.8, convRate: 1.2, color: 'from-red-600 to-orange-500',   accent: '#ef4444' },
  { id: 'linkedin',  label: 'LinkedIn Ads', emoji: '💼', sub: 'Sponsored / Lead Gen',     cpcBase: 5.20, ctrBase: 0.6, convRate: 3.5, color: 'from-sky-700 to-blue-600',     accent: '#0284c7' },
  { id: 'pinterest', label: 'Pinterest Ads',emoji: '📌', sub: 'Shopping / Awareness',     cpcBase: 0.30, ctrBase: 0.5, convRate: 0.9, color: 'from-rose-600 to-pink-600',    accent: '#e11d48' },
];

const OBJECTIVES = [
  { id: 'ecommerce', label: 'E-commerce', emoji: '🛒', desc: 'Ventas directas en tienda online' },
  { id: 'leads',     label: 'Generación de Leads', emoji: '🎯', desc: 'Captar contactos para vender después' },
  { id: 'branding',  label: 'Branding / Awareness', emoji: '🌐', desc: 'Dar a conocer tu marca a gran escala' },
  { id: 'traffic',   label: 'Tráfico al Sitio', emoji: '📈', desc: 'Llevar visitas calificadas a tu web' },
  { id: 'app',       label: 'Instalaciones App', emoji: '📱', desc: 'Descargas de tu app móvil' },
];

const STATUS_CONFIG = {
  activa:      { label: 'Activa',      icon: Play,       cls: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' },
  pausada:     { label: 'Pausada',     icon: Pause,      cls: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30'  },
  planificada: { label: 'Planificada', icon: Clock,      cls: 'text-blue-400 bg-blue-500/10 border-blue-500/30'        },
  completada:  { label: 'Completada',  icon: CheckCircle2,cls: 'text-gray-400 bg-gray-500/10 border-gray-500/30'       },
};

const INITIAL_CAMPAIGNS = [
  { id: 1, nombre: 'Captación Nuevos Clientes Q2', plataforma: 'meta',     objetivo: 'ecommerce', presupuesto: 800,  gastado: 342, conversiones: 28, roas: 4.2, estado: 'activa',      inicio: '2026-04-01', fin: '2026-04-30' },
  { id: 2, nombre: 'Brand Awareness — Video Viral', plataforma: 'tiktok',  objetivo: 'branding',  presupuesto: 400,  gastado: 400, conversiones: 0,  roas: 0,   estado: 'completada',  inicio: '2026-03-01', fin: '2026-03-31' },
  { id: 3, nombre: 'Retargeting Carrito Abandonado',plataforma: 'google',  objetivo: 'ecommerce', presupuesto: 300,  gastado: 180, conversiones: 42, roas: 6.8, estado: 'activa',      inicio: '2026-04-15', fin: '2026-04-30' },
  { id: 4, nombre: 'Generación de Leads B2B',       plataforma: 'linkedin',objetivo: 'leads',     presupuesto: 1200, gastado: 0,   conversiones: 0,  roas: 0,   estado: 'planificada', inicio: '2026-05-01', fin: '2026-05-31' },
];

// ── HELPERS ───────────────────────────────────────────────────────
const fmt = (n, prefix = '', suffix = '', decimals = 0) =>
  `${prefix}${typeof n === 'number' ? n.toLocaleString('es-MX', { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) : n}${suffix}`;

// ── SUB-COMPONENTS ────────────────────────────────────────────────
const KPI = ({ label, value, sub, icon: Icon, color = 'text-white' }) => (
  <div className="bg-[#111318] border border-white/6 rounded-2xl p-4 flex flex-col gap-1">
    <div className="flex items-center gap-1.5 text-[11px] text-gray-500 font-bold uppercase tracking-wider">
      {Icon && <Icon className={`w-3.5 h-3.5 ${color}`} />} {label}
    </div>
    <div className={`text-2xl font-black ${color}`}>{value}</div>
    {sub && <div className="text-xs text-gray-600">{sub}</div>}
  </div>
);

const Slider = ({ label, value, onChange, min, max, step = 1, prefix = '', suffix = '', accent = '#ef4444' }) => (
  <div className="flex flex-col gap-2">
    <div className="flex items-center justify-between">
      <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">{label}</label>
      <span className="text-sm font-black text-white">{prefix}{value.toLocaleString()}{suffix}</span>
    </div>
    <input
      type="range" min={min} max={max} step={step} value={value}
      onChange={e => onChange(+e.target.value)}
      className="w-full cursor-pointer h-1.5 rounded-full appearance-none"
      style={{ accentColor: accent }}
    />
    <div className="flex justify-between text-[10px] text-gray-700">
      <span>{prefix}{min.toLocaleString()}{suffix}</span>
      <span>{prefix}{max.toLocaleString()}{suffix}</span>
    </div>
  </div>
);

// ═══════════════════════════════════════════════════════════════
// PANEL PRINCIPAL — 3 Secciones verticales en un solo scroll
// ═══════════════════════════════════════════════════════════════
export default function AdsManagerModule() {
  // ── Estado del Simulador ──
  const [platId, setPlatId]           = useState('meta');
  const [objectiveId, setObjectiveId] = useState('ecommerce');
  const [budget, setBudget]           = useState(500);
  const [avgTicket, setAvgTicket]     = useState(60);
  const [cogs, setCogs]               = useState(35);
  const [cpcOverride, setCpcOverride] = useState(null);
  const [convOverride, setConvOverride] = useState(null);

  // ── Estado del Planificador ──
  const [campaigns, setCampaigns]   = useState(INITIAL_CAMPAIGNS);
  const [filterStatus, setFilter]   = useState('todas');
  const [modal, setModal]           = useState(false);
  const [newCamp, setNewCamp]       = useState({ nombre: '', plataforma: 'meta', objetivo: 'ecommerce', presupuesto: '', inicio: '', fin: '', estado: 'planificada' });
  const [expandedId, setExpandedId] = useState(null);

  // ── Cálculos ROAS ──
  const plat = PLATFORMS.find(p => p.id === platId);
  const effCPC  = cpcOverride  ?? plat.cpcBase;
  const effConv = convOverride ?? plat.convRate;

  const metrics = useMemo(() => {
    const clicks      = budget / effCPC;
    const conversions = clicks * (effConv / 100);
    const revenue     = conversions * avgTicket;
    const cogsAmt     = revenue * (cogs / 100);
    const gross       = revenue - budget - cogsAmt;
    const roas        = budget > 0 ? revenue / budget : 0;
    const cpa         = conversions > 0 ? budget / conversions : 0;
    const roi         = budget > 0 ? (gross / budget) * 100 : 0;
    const breakEven   = avgTicket * (1 - cogs / 100) > 0 ? budget / (avgTicket * (1 - cogs / 100)) : 0;
    const impressions = clicks / (plat.ctrBase / 100);
    return { clicks, conversions, revenue, gross, roas, cpa, roi, breakEven, impressions };
  }, [budget, effCPC, effConv, avgTicket, cogs, platId]);

  const roasColor  = metrics.roas >= 4 ? 'text-emerald-400' : metrics.roas >= 2 ? 'text-amber-400' : 'text-red-400';
  const roasBorder = metrics.roas >= 4 ? 'border-emerald-500/30' : metrics.roas >= 2 ? 'border-amber-500/30' : 'border-red-500/30';
  const roasLabel  = metrics.roas >= 4 ? '✅ Rentable' : metrics.roas >= 2 ? '⚠️ Aceptable' : '🚨 Negativo';

  // ── Cálculos del Planificador ──
  const filtered        = filterStatus === 'todas' ? campaigns : campaigns.filter(c => c.estado === filterStatus);
  const totalBudget     = campaigns.reduce((s, c) => s + c.presupuesto, 0);
  const totalSpent      = campaigns.reduce((s, c) => s + c.gastado, 0);
  const totalConv       = campaigns.reduce((s, c) => s + c.conversiones, 0);
  const activeROAS      = campaigns.filter(c => c.roas > 0);
  const avgROAS         = activeROAS.length ? (activeROAS.reduce((s, c) => s + c.roas, 0) / activeROAS.length).toFixed(1) : '—';

  const addCampaign = () => {
    if (!newCamp.nombre || !newCamp.presupuesto) return;
    setCampaigns(prev => [...prev, { ...newCamp, id: Date.now(), gastado: 0, conversiones: 0, roas: 0, presupuesto: +newCamp.presupuesto }]);
    setModal(false);
    setNewCamp({ nombre: '', plataforma: 'meta', objetivo: 'ecommerce', presupuesto: '', inicio: '', fin: '', estado: 'planificada' });
  };

  const deleteCampaign = (id) => setCampaigns(prev => prev.filter(c => c.id !== id));

  const handleExport = () => {
    const lines = [
      'SIMULACIÓN DE PAUTA — PREDIX',
      `Plataforma: ${plat.label}`,
      `Fecha: ${new Date().toLocaleDateString('es-ES', { dateStyle: 'long' })}`,
      '',
      'PARÁMETROS',
      `  Presupuesto: $${budget.toLocaleString()}`,
      `  CPC efectivo: $${effCPC.toFixed(2)}`,
      `  Tasa de conversión: ${effConv}%`,
      `  Ticket promedio: $${avgTicket}`,
      `  Costo de producto/servicio: ${cogs}%`,
      '',
      'PROYECCIÓN',
      `  Impresiones: ${Math.round(metrics.impressions).toLocaleString()}`,
      `  Clics: ${Math.round(metrics.clicks).toLocaleString()}`,
      `  Conversiones: ${metrics.conversions.toFixed(1)}`,
      `  Ingresos: $${metrics.revenue.toFixed(2)}`,
      `  ROAS: ${metrics.roas.toFixed(2)}x — ${roasLabel}`,
      `  CPA: $${metrics.cpa.toFixed(2)}`,
      `  Utilidad bruta: $${metrics.gross.toFixed(2)}`,
      `  ROI: ${metrics.roi.toFixed(1)}%`,
    ].join('\n');
    const blob = new Blob([lines], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'simulacion-ads-predix.txt'; a.click();
    URL.revokeObjectURL(url);
  };

  const inputCls = "w-full bg-[#0b0c10] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-red-500/50 transition-colors";

  return (
    <div className="w-full flex flex-col gap-6 pb-20 md:pb-0">

      {/* ══ HERO BANNER ══════════════════════════════════════ */}
      <div className="bg-gradient-to-r from-red-950/60 to-orange-950/50 border border-red-500/20 rounded-2xl px-6 py-5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-red-500/8 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-orange-500/8 rounded-full blur-[80px] pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-500/20 border border-red-500/30 rounded-full mb-3">
              <div className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
              <span className="text-xs font-bold text-red-300">Paid Media Intelligence · SEM & Performance</span>
            </div>
            <h1 className="text-2xl font-black text-white flex items-center gap-2 mb-1">
              <Megaphone className="w-6 h-6 text-red-400" /> Gestor de Ads
            </h1>
            <p className="text-red-200/60 text-sm">Proyecta tu ROAS → Crea tu campaña → Gestiona todo en un solo lugar</p>
          </div>
          <div className="flex gap-3 flex-shrink-0">
            {[
              { label: 'Campañas Activas', value: campaigns.filter(c => c.estado === 'activa').length },
              { label: 'ROAS Promedio',    value: `${avgROAS}x` },
              { label: 'Total Invertido',  value: `$${totalBudget.toLocaleString()}` },
            ].map((s, i) => (
              <div key={i} className="bg-black/30 border border-white/8 rounded-xl px-4 py-2.5 text-center min-w-[80px]">
                <div className="text-xl font-black text-red-400">{s.value}</div>
                <div className="text-[10px] text-gray-500 leading-tight mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ══ BLOQUE 1: SIMULADOR ROAS ═════════════════════════ */}
      <Section
        step="01"
        title="Simula tu Inversión"
        subtitle="Proyecta el retorno exacto antes de gastar un centavo — ajusta presupuesto, plataforma y variables en tiempo real."
        badge="Simulador ROAS"
        badgeColor="bg-red-500/15 border-red-500/30 text-red-300"
        action={
          <button onClick={handleExport} className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/15 hover:bg-red-500/25 border border-red-500/30 text-red-300 rounded-lg text-xs font-semibold transition-all">
            <Download className="w-3.5 h-3.5" /> Exportar
          </button>
        }
      >
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* LEFT 3/5 — configuración */}
          <div className="lg:col-span-3 flex flex-col gap-5">

            {/* Plataformas */}
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Plataforma de pauta</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {PLATFORMS.map(p => (
                  <button
                    key={p.id}
                    onClick={() => { setPlatId(p.id); setCpcOverride(null); setConvOverride(null); }}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-left transition-all ${
                      platId === p.id
                        ? 'bg-red-500/12 border-red-500/50 shadow-lg shadow-red-500/10'
                        : 'bg-[#111318] border-white/6 hover:border-white/15'
                    }`}
                  >
                    <span className="text-xl flex-shrink-0">{p.emoji}</span>
                    <div className="min-w-0">
                      <div className={`text-xs font-bold truncate ${platId === p.id ? 'text-white' : 'text-gray-400'}`}>{p.label}</div>
                      <div className="text-[10px] text-gray-600 truncate">{p.sub}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Objetivo */}
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Objetivo de campaña</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {OBJECTIVES.map(o => (
                  <button
                    key={o.id}
                    onClick={() => setObjectiveId(o.id)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-left transition-all ${
                      objectiveId === o.id
                        ? 'bg-orange-500/12 border-orange-500/50 shadow-lg shadow-orange-500/8'
                        : 'bg-[#111318] border-white/6 hover:border-white/15'
                    }`}
                  >
                    <span className="text-lg flex-shrink-0">{o.emoji}</span>
                    <div>
                      <div className={`text-xs font-bold ${objectiveId === o.id ? 'text-white' : 'text-gray-400'}`}>{o.label}</div>
                      <div className="text-[10px] text-gray-600 leading-tight">{o.desc}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Sliders */}
            <div className="bg-[#111318] border border-white/6 rounded-2xl p-5 flex flex-col gap-5">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Variables financieras</p>
              <Slider label="Presupuesto mensual" value={budget}    onChange={setBudget}    min={50}  max={10000} step={50}  prefix="$" accent={plat.accent} />
              <Slider label="Ticket promedio de venta" value={avgTicket} onChange={setAvgTicket} min={5}   max={500}   step={5}   prefix="$" accent={plat.accent} />
              <Slider label="Costo del producto/servicio" value={cogs} onChange={setCogs} min={0}   max={90}    step={5}   suffix="%" accent={plat.accent} />
            </div>

            {/* Parámetros Avanzados */}
            <div className="bg-[#111318] border border-white/6 rounded-2xl p-4 flex flex-col gap-3">
              <p className="text-xs font-bold text-gray-600 uppercase tracking-widest">Parámetros avanzados (opcional)</p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-600 mb-1 block">CPC personalizado ($)</label>
                  <input type="number" value={cpcOverride ?? ''} onChange={e => setCpcOverride(e.target.value ? +e.target.value : null)}
                    placeholder={`${plat.cpcBase} (plataforma)`} step={0.01} className={inputCls} />
                </div>
                <div>
                  <label className="text-xs text-gray-600 mb-1 block">Tasa conversión (%)</label>
                  <input type="number" value={convOverride ?? ''} onChange={e => setConvOverride(e.target.value ? +e.target.value : null)}
                    placeholder={`${plat.convRate} (plataforma)`} step={0.1} className={inputCls} />
                </div>
              </div>
              {(cpcOverride !== null || convOverride !== null) && (
                <button onClick={() => { setCpcOverride(null); setConvOverride(null); }}
                  className="flex items-center gap-1 text-xs text-gray-500 hover:text-white transition-colors">
                  <RefreshCw className="w-3 h-3" /> Restaurar valores de plataforma
                </button>
              )}
            </div>
          </div>

          {/* RIGHT 2/5 — resultados en tiempo real */}
          <div className="lg:col-span-2 flex flex-col gap-4">

            {/* ROAS Hero */}
            <div className={`bg-gradient-to-br from-[#111318] to-[#0e1117] border ${roasBorder} rounded-2xl p-6 text-center`}>
              <p className="text-[11px] font-bold text-gray-600 uppercase tracking-widest mb-2">ROAS Proyectado</p>
              <motion.p key={metrics.roas} initial={{ scale: 0.85 }} animate={{ scale: 1 }} className={`text-6xl font-black ${roasColor}`}>
                {metrics.roas.toFixed(2)}x
              </motion.p>
              <p className={`text-xs font-bold mt-2 ${roasColor}`}>{roasLabel}</p>
              <p className="text-[11px] text-gray-600 mt-2">Por cada $1 invertido, recuperas ${metrics.roas.toFixed(2)}</p>
            </div>

            {/* KPIs Grid */}
            <div className="grid grid-cols-2 gap-3">
              <KPI label="Impresiones" value={fmt(Math.round(metrics.impressions))}  sub="exposiciones estimadas" icon={Eye}              color="text-purple-400" />
              <KPI label="Clics Est."  value={fmt(Math.round(metrics.clicks))}        sub="visitas a landing"      icon={MousePointerClick} color="text-blue-400"   />
              <KPI label="Conversiones"value={metrics.conversions.toFixed(1)}         sub="ventas / leads"         icon={ShoppingCart}       color="text-emerald-400"/>
              <KPI label="CPA"         value={fmt(metrics.cpa, '$', '', 2)}           sub="costo por conversión"   icon={Target}             color="text-orange-400" />
              <KPI label="Ingresos"    value={fmt(metrics.revenue, '$', '', 0)}       sub="ingresos brutos"        icon={DollarSign}         color="text-amber-400"  />
              <KPI label="Utilidad"    value={fmt(metrics.gross, '$', '', 0)}         sub="después de ads+costo"   icon={TrendingUp}         color={metrics.gross > 0 ? 'text-emerald-400' : 'text-red-400'} />
            </div>

            {/* Punto de Equilibrio */}
            <div className="bg-[#0b0c10] border border-white/6 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                {metrics.conversions >= metrics.breakEven
                  ? <CheckCircle className="w-4 h-4 text-emerald-400" />
                  : <AlertCircle className="w-4 h-4 text-amber-400" />}
                <span className="text-xs font-bold text-white">Punto de Equilibrio</span>
              </div>
              <div className="w-full bg-gray-800/60 rounded-full h-2 mb-2">
                <div
                  className={`h-2 rounded-full transition-all duration-500 ${metrics.conversions >= metrics.breakEven ? 'bg-emerald-500' : 'bg-amber-500'}`}
                  style={{ width: `${Math.min((metrics.conversions / Math.max(metrics.breakEven, 1)) * 100, 100)}%` }}
                />
              </div>
              <p className="text-xs text-gray-500">
                Necesitas <span className="text-white font-bold">{metrics.breakEven.toFixed(1)} conversiones</span> para recuperar la inversión. Proyectas{' '}
                <span className={`font-bold ${metrics.conversions >= metrics.breakEven ? 'text-emerald-400' : 'text-amber-400'}`}>{metrics.conversions.toFixed(1)}</span>.
              </p>
            </div>

            {/* ROI */}
            <div className="bg-[#111318] border border-white/6 rounded-xl p-4 flex items-center justify-between">
              <div>
                <div className="text-[11px] text-gray-500 font-bold uppercase tracking-widest">ROI sobre inversión</div>
                <div className={`text-3xl font-black mt-1 ${metrics.roi > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {metrics.roi.toFixed(1)}%
                </div>
              </div>
              <Activity className={`w-8 h-8 ${metrics.roi > 0 ? 'text-emerald-400/40' : 'text-red-400/40'}`} />
            </div>
          </div>
        </div>
      </Section>

      {/* DIVIDER */}
      <div className="flex items-center gap-4">
        <div className="flex-1 h-px bg-white/5" />
        <ChevronRight className="w-4 h-4 text-gray-700" />
        <div className="flex-1 h-px bg-white/5" />
      </div>

      {/* ══ BLOQUE 2: PANEL DE CAMPAÑAS ══════════════════════ */}
      <Section
        step="02"
        title="Gestiona tus Campañas"
        subtitle="Crea, monitorea y compara todas tus campañas de pago activas con métricas en tiempo real por plataforma."
        badge="Planificador"
        badgeColor="bg-orange-500/15 border-orange-500/30 text-orange-300"
        action={
          <button onClick={() => setModal(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white font-bold px-4 py-2 rounded-xl text-sm transition-all shadow-lg shadow-red-500/20">
            <Plus className="w-4 h-4" /> Nueva Campaña
          </button>
        }
      >
        {/* KPIs del planificador */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
          {[
            { label: 'Presupuesto Total', value: fmt(totalBudget, '$'),   color: 'text-white', icon: DollarSign },
            { label: 'Gasto Actual',      value: fmt(totalSpent, '$'),    color: 'text-yellow-400', icon: BarChart2 },
            { label: 'Conversiones',      value: totalConv,               color: 'text-emerald-400', icon: ShoppingCart },
            { label: 'ROAS Promedio',     value: `${avgROAS}x`,           color: 'text-blue-400', icon: TrendingUp },
          ].map((s, i) => (
            <div key={i} className="bg-[#111318] border border-white/6 rounded-xl p-4">
              <div className="flex items-center gap-1.5 text-[10px] text-gray-600 font-bold uppercase tracking-widest mb-1">
                <s.icon className={`w-3 h-3 ${s.color}`} /> {s.label}
              </div>
              <div className={`text-2xl font-black ${s.color}`}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Filtros */}
        <div className="flex gap-2 overflow-x-auto pb-1 mb-4 scrollbar-none">
          {['todas', 'activa', 'pausada', 'planificada', 'completada'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex-shrink-0 border capitalize ${
                filterStatus === f ? 'bg-red-500/15 border-red-500/50 text-white' : 'bg-[#111318] border-white/6 text-gray-500 hover:text-white'
              }`}>
              {f === 'todas' ? 'Todas' : STATUS_CONFIG[f]?.label}
              <span className="ml-1.5 text-gray-600">
                {f === 'todas' ? campaigns.length : campaigns.filter(c => c.estado === f).length}
              </span>
            </button>
          ))}
        </div>

        {/* Lista de campañas */}
        <div className="space-y-3">
          <AnimatePresence>
            {filtered.map(c => {
              const platform = PLATFORMS.find(p => p.id === c.plataforma);
              const objetivo  = OBJECTIVES.find(o => o.id === c.objetivo);
              const status    = STATUS_CONFIG[c.estado];
              const StatusIcon = status.icon;
              const progreso  = c.presupuesto > 0 ? Math.round((c.gastado / c.presupuesto) * 100) : 0;
              const isExpanded = expandedId === c.id;

              return (
                <motion.div key={c.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="bg-[#111318] rounded-2xl border border-white/6 hover:border-white/10 transition-all overflow-hidden">

                  {/* Row principal */}
                  <div className="flex items-center gap-4 p-4 cursor-pointer" onClick={() => setExpandedId(isExpanded ? null : c.id)}>
                    <span className="text-2xl flex-shrink-0">{platform?.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-bold text-white text-sm truncate">{c.nombre}</h4>
                        <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border flex-shrink-0 ${status.cls}`}>
                          <StatusIcon className="w-2.5 h-2.5" /> {status.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex-1 bg-gray-800/60 rounded-full h-1.5">
                          <div
                            className={`h-1.5 rounded-full ${progreso >= 90 ? 'bg-red-500' : progreso >= 60 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                            style={{ width: `${Math.min(progreso, 100)}%` }} />
                        </div>
                        <span className="text-[10px] text-gray-600 flex-shrink-0">{progreso}%</span>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0 hidden sm:block">
                      {c.roas > 0
                        ? <div className={`text-lg font-black ${c.roas >= 4 ? 'text-emerald-400' : c.roas >= 2 ? 'text-amber-400' : 'text-red-400'}`}>{c.roas}x</div>
                        : <div className="text-lg font-black text-gray-600">—</div>}
                      <div className="text-[10px] text-gray-600">ROAS</div>
                    </div>
                    <ChevronRight className={`w-4 h-4 text-gray-700 flex-shrink-0 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                  </div>

                  {/* Expandido */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
                        <div className="border-t border-white/6 p-4 pt-3">
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
                            {[
                              { label: 'Plataforma',  value: platform?.label, color: 'text-white' },
                              { label: 'Objetivo',    value: `${objetivo?.emoji} ${objetivo?.label}`, color: 'text-blue-400' },
                              { label: 'Presupuesto', value: fmt(c.presupuesto, '$'), color: 'text-white' },
                              { label: 'Gastado',     value: fmt(c.gastado, '$'),     color: 'text-yellow-400' },
                              { label: 'Conversiones',value: c.conversiones,          color: 'text-emerald-400' },
                              { label: 'CPA',         value: c.conversiones > 0 ? fmt(c.gastado / c.conversiones, '$', '', 2) : '—', color: 'text-orange-400' },
                              { label: 'Inicio',      value: c.inicio || '—',         color: 'text-gray-400' },
                              { label: 'Fin',         value: c.fin || '—',            color: 'text-gray-400' },
                            ].map((item, i) => (
                              <div key={i} className="bg-[#0b0c10] rounded-xl p-3">
                                <div className="text-[10px] text-gray-600 font-bold uppercase tracking-wider mb-0.5">{item.label}</div>
                                <div className={`text-sm font-bold ${item.color}`}>{item.value}</div>
                              </div>
                            ))}
                          </div>
                          <div className="flex justify-end">
                            <button onClick={() => deleteCampaign(c.id)} className="flex items-center gap-1.5 text-xs text-gray-600 hover:text-red-400 transition-colors">
                              <Trash2 className="w-3.5 h-3.5" /> Eliminar campaña
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </AnimatePresence>
          {filtered.length === 0 && (
            <div className="text-center py-12 text-gray-600">
              <Megaphone className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p className="text-sm">No hay campañas en este estado.</p>
            </div>
          )}
        </div>
      </Section>

      {/* DIVIDER */}
      <div className="flex items-center gap-4">
        <div className="flex-1 h-px bg-white/5" />
        <Zap className="w-4 h-4 text-gray-700" />
        <div className="flex-1 h-px bg-white/5" />
      </div>

      {/* ══ BLOQUE 3: GUÍA ESTRATÉGICA ════════════════════════ */}
      <Section
        step="03"
        title="Guía de Performance"
        subtitle="Benchmarks de la industria y recomendaciones ARIA para maximizar tu ROAS en cada plataforma."
        badge="Estrategia"
        badgeColor="bg-amber-500/15 border-amber-500/30 text-amber-300"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {PLATFORMS.map(p => (
            <motion.div key={p.id} whileHover={{ y: -2 }}
              className={`bg-[#111318] border border-white/6 rounded-2xl p-5 hover:border-white/12 transition-all ${platId === p.id ? 'ring-1 ring-red-500/30' : ''}`}>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">{p.emoji}</span>
                <div>
                  <div className="font-bold text-white text-sm">{p.label}</div>
                  <div className="text-[11px] text-gray-500">{p.sub}</div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 mb-3">
                {[
                  { label: 'CPC Base', value: fmt(p.cpcBase, '$', '', 2) },
                  { label: 'CTR Base', value: `${p.ctrBase}%` },
                  { label: 'Conv. Rate', value: `${p.convRate}%` },
                ].map((m, i) => (
                  <div key={i} className="bg-[#0b0c10] rounded-xl p-2.5 text-center">
                    <div className="text-xs font-black text-white">{m.value}</div>
                    <div className="text-[9px] text-gray-600 mt-0.5">{m.label}</div>
                  </div>
                ))}
              </div>
              <button onClick={() => setPlatId(p.id)}
                className={`w-full py-2 rounded-xl text-xs font-bold transition-all border ${
                  platId === p.id
                    ? 'bg-red-500/15 border-red-500/40 text-red-300'
                    : 'border-white/6 text-gray-600 hover:text-white hover:bg-white/5'
                }`}>
                {platId === p.id ? '✓ Simulando con esta plataforma' : 'Usar en simulador'}
              </button>
            </motion.div>
          ))}
        </div>

        {/* Consejo ARIA */}
        <div className="mt-4 bg-gradient-to-r from-red-900/20 to-orange-900/15 border border-red-500/15 rounded-2xl p-5 flex gap-4 items-start">
          <div className="w-8 h-8 rounded-xl bg-red-500/20 flex items-center justify-center flex-shrink-0">
            <Zap className="w-4 h-4 text-red-400" />
          </div>
          <div>
            <p className="text-xs font-bold text-red-400 mb-1">💡 Consejo de ARIA</p>
            <p className="text-xs text-gray-400 leading-relaxed">
              Para comenzar con paid media, Meta Ads o TikTok Ads son tu mejor punto de entrada por el bajo CPC. 
              <strong className="text-white"> Regla de oro: nunca inviertas más de $100 antes de tener tu pixel instalado, un landing page A/B y al menos 30 días de datos orgánicos.</strong>
              {' '}Sin esos 3 elementos, estás quemando dinero.
            </p>
          </div>
        </div>
      </Section>

      {/* MODAL — Nueva Campaña */}
      <AnimatePresence>
        {modal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={e => e.target === e.currentTarget && setModal(false)}>
            <motion.div initial={{ scale: 0.92, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.92, opacity: 0 }}
              className="bg-[#0e1117] border border-white/10 rounded-2xl p-6 w-full max-w-md shadow-2xl">
              <h3 className="text-lg font-black text-white mb-1">Nueva Campaña</h3>
              <p className="text-xs text-gray-500 mb-5">Los resultados aparecerán automáticamente en el panel de gestión.</p>
              <div className="space-y-4">
                {[
                  { key: 'nombre',      label: 'Nombre de la campaña', ph: 'Ej: Captación Clientes Mayo' },
                  { key: 'presupuesto', label: 'Presupuesto ($)',       ph: '500', type: 'number' },
                  { key: 'inicio',      label: 'Fecha inicio',          type: 'date' },
                  { key: 'fin',         label: 'Fecha fin',             type: 'date' },
                ].map(f => (
                  <div key={f.key}>
                    <label className="text-xs text-gray-500 mb-1 block font-bold uppercase tracking-wide">{f.label}</label>
                    <input type={f.type || 'text'} value={newCamp[f.key]} placeholder={f.ph}
                      onChange={e => setNewCamp(p => ({ ...p, [f.key]: e.target.value }))}
                      className={inputCls} />
                  </div>
                ))}
                <div>
                  <label className="text-xs text-gray-500 mb-1 block font-bold uppercase tracking-wide">Plataforma</label>
                  <select value={newCamp.plataforma} onChange={e => setNewCamp(p => ({ ...p, plataforma: e.target.value }))} className={inputCls}>
                    {PLATFORMS.map(p => <option key={p.id} value={p.id}>{p.emoji} {p.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block font-bold uppercase tracking-wide">Objetivo</label>
                  <select value={newCamp.objetivo} onChange={e => setNewCamp(p => ({ ...p, objetivo: e.target.value }))} className={inputCls}>
                    {OBJECTIVES.map(o => <option key={o.id} value={o.id}>{o.emoji} {o.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block font-bold uppercase tracking-wide">Estado inicial</label>
                  <select value={newCamp.estado} onChange={e => setNewCamp(p => ({ ...p, estado: e.target.value }))} className={inputCls}>
                    {Object.entries(STATUS_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                  </select>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setModal(false)} className="flex-1 bg-[#1a1d24] text-gray-300 font-bold py-3 rounded-xl hover:bg-[#22252e] transition-colors border border-white/6">
                  Cancelar
                </button>
                <button onClick={addCampaign} className="flex-1 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white font-bold py-3 rounded-xl shadow-lg shadow-red-500/20 transition-all flex items-center justify-center gap-2">
                  <ArrowRight className="w-4 h-4" /> Crear Campaña
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Helper: Section wrapper ───────────────────────────────────────
function Section({ step, title, subtitle, badge, badgeColor, action, children }) {
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
