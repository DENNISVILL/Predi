// ═══════════════════════════════════════════════════════════════
// SEO STUDIO — Panel Unificado
// Fusión: Keyword Research + Auditoría SEO + Mapa Tópico + Arquitectura
// Flujo: Investiga Keywords → Audita → Construye el Mapa Tópico
// ═══════════════════════════════════════════════════════════════
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, TrendingUp, TrendingDown, Minus, Trash2, Plus,
  CheckCircle, AlertCircle, XCircle, Download, RefreshCw,
  ChevronRight, Zap, Network, Globe, FileText, BarChart2,
  ChevronDown, ArrowRight, Layers
} from 'lucide-react';

// ── DATA ─────────────────────────────────────────────────────────
const INTENT_CONFIG = {
  informacional: { color: 'text-blue-400 bg-blue-500/10 border-blue-500/30',   label: 'Info',    emoji: '📖' },
  navegacional:  { color: 'text-purple-400 bg-purple-500/10 border-purple-500/30', label: 'Nav', emoji: '🧭' },
  transaccional: { color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30', label: 'Transac.', emoji: '💳' },
  comercial:     { color: 'text-amber-400 bg-amber-500/10 border-amber-500/30', label: 'Comercial', emoji: '🛒' },
};

const DIFF_CONFIG = {
  low:    { label: 'Fácil',   color: 'text-emerald-400', icon: TrendingDown },
  medium: { label: 'Media',   color: 'text-amber-400',   icon: Minus },
  high:   { label: 'Difícil', color: 'text-red-400',     icon: TrendingUp },
};

const PRIORITY_COLOR = {
  'muy alta': 'text-red-400 bg-red-500/10 border-red-500/30',
  'alta':     'text-orange-400 bg-orange-500/10 border-orange-500/30',
  'media':    'text-amber-400 bg-amber-500/10 border-amber-500/30',
  'baja':     'text-gray-400 bg-gray-500/10 border-gray-500/30',
};

const INITIAL_KW = [
  { id: 1, keyword: 'gestión redes sociales',       vol: 12100, diff: 'medium', intent: 'comercial',     cpc: 2.40, priority: 'alta'     },
  { id: 2, keyword: 'community manager freelance',   vol: 4400,  diff: 'low',    intent: 'comercial',     cpc: 3.10, priority: 'alta'     },
  { id: 3, keyword: 'herramientas marketing digital',vol: 22200, diff: 'high',   intent: 'informacional', cpc: 1.80, priority: 'media'    },
  { id: 4, keyword: 'cómo hacer plan de contenidos', vol: 8100,  diff: 'low',    intent: 'informacional', cpc: 1.20, priority: 'alta'     },
  { id: 5, keyword: 'contratar community manager',   vol: 2900,  diff: 'low',    intent: 'transaccional', cpc: 4.50, priority: 'muy alta' },
  { id: 6, keyword: 'precio community manager',      vol: 1900,  diff: 'low',    intent: 'comercial',     cpc: 3.80, priority: 'muy alta' },
  { id: 7, keyword: 'agencia marketing digital',     vol: 33100, diff: 'high',   intent: 'transaccional', cpc: 5.20, priority: 'media'    },
  { id: 8, keyword: 'crear contenido para instagram',vol: 6600,  diff: 'medium', intent: 'informacional', cpc: 1.50, priority: 'media'    },
];

const AUDIT_ITEMS = [
  { category: 'técnico',   label: 'Velocidad de carga (Core Web Vitals)', status: 'ok',   detail: 'LCP < 2.5s · FID < 100ms · CLS < 0.1'       },
  { category: 'técnico',   label: 'HTTPS configurado',                    status: 'ok',   detail: 'Certificado SSL activo'                       },
  { category: 'técnico',   label: 'Sitemap XML enviado',                   status: 'warn', detail: 'Sitemap no enviado a Search Console'           },
  { category: 'técnico',   label: 'Robots.txt configurado',                status: 'ok',   detail: 'Bloquea /admin, /api, /tmp correctamente'     },
  { category: 'técnico',   label: 'Datos estructurados (Schema)',          status: 'error',detail: 'Sin Schema.org implementado — pérdida de rich snippets'},
  { category: 'contenido', label: 'Etiquetas H1 únicas por página',        status: 'ok',   detail: 'Una sola H1 detectada por URL'                },
  { category: 'contenido', label: 'Meta descriptions < 160 caracteres',    status: 'warn', detail: '3 páginas sin meta description'                },
  { category: 'contenido', label: 'Contenido duplicado',                   status: 'ok',   detail: 'Sin duplicados críticos detectados'           },
  { category: 'contenido', label: 'Palabras clave en H1/H2',               status: 'warn', detail: 'Keywords principales ausentes en headings'    },
  { category: 'links',     label: 'Internal linking estructurado',          status: 'error',detail: 'Arquitectura de enlaces internos deficiente'  },
  { category: 'links',     label: 'Backlinks de autoridad (DA > 40)',       status: 'warn', detail: 'Solo 8 dominios referentes con DA alto'       },
  { category: 'links',     label: 'Broken links (404)',                     status: 'ok',   detail: 'Sin enlaces rotos detectados'                 },
];

const TOPICAL_TEMPLATE = {
  pillar: 'Marketing Digital para Agencias',
  clusters: [
    {
      id: 1, topic: 'Community Management',
      pages: ['¿Qué es un Community Manager?', 'Cuánto cobra un CM', 'Herramientas para CM', 'Plan de contenidos mensual', 'KPIs para CM'],
    },
    {
      id: 2, topic: 'Redes Sociales',
      pages: ['Instagram para negocios', 'TikTok para marcas', 'LinkedIn B2B', 'Pinterest para e-commerce', 'Algoritmo de Instagram 2026'],
    },
    {
      id: 3, topic: 'Publicidad Digital',
      pages: ['Meta Ads para principiantes', 'Google Ads vs Meta Ads', 'ROAS: qué es y cómo calcularlo', 'Presupuesto mínimo para anuncios'],
    },
    {
      id: 4, topic: 'SEO y Posicionamiento',
      pages: ['SEO para principiantes', 'Keyword research paso a paso', 'Link building en 2026', 'Core Web Vitals explicados'],
    },
  ]
};

const StatusIcon = ({ status }) => {
  if (status === 'ok')    return <CheckCircle  className="w-4 h-4 text-emerald-400 flex-shrink-0" />;
  if (status === 'warn')  return <AlertCircle  className="w-4 h-4 text-amber-400 flex-shrink-0" />;
  if (status === 'error') return <XCircle      className="w-4 h-4 text-red-400 flex-shrink-0" />;
};

// ═══════════════════════════════════════════════════════════════
// MÓDULO PRINCIPAL
// ═══════════════════════════════════════════════════════════════
export default function SEOStudioModule() {
  // Keywords
  const [keywords, setKeywords]   = useState(INITIAL_KW);
  const [newKw, setNewKw]         = useState('');
  const [filterIntent, setFI]     = useState('todas');
  const [filterDiff, setFD]       = useState('todas');
  const [sortBy, setSortBy]       = useState('vol');

  // Audit
  const [auditCategory, setAuditCat] = useState('todas');
  const [expandedAudit, setExpandedAudit] = useState(null);

  // Topical Map
  const [pillar, setPillar]     = useState(TOPICAL_TEMPLATE.pillar);
  const [clusters, setClusters] = useState(TOPICAL_TEMPLATE.clusters);
  const [expandedCluster, setExpandedCluster] = useState(null);
  const [newClusterName, setNewClusterName]   = useState('');

  // ── KW logic ──
  const addKw = () => {
    if (!newKw.trim()) return;
    setKeywords(p => [...p, {
      id: Date.now(), keyword: newKw.trim(),
      vol: Math.floor(Math.random() * 9000) + 200,
      diff: ['low','medium','high'][Math.floor(Math.random() * 3)],
      intent: 'informacional',
      cpc: +(Math.random() * 4 + 0.5).toFixed(2),
      priority: 'media',
    }]);
    setNewKw('');
  };

  const filteredKw = useMemo(() =>
    keywords
      .filter(k => filterIntent === 'todas' || k.intent === filterIntent)
      .filter(k => filterDiff === 'todas' || k.diff === filterDiff)
      .sort((a, b) => {
        if (sortBy === 'vol')   return b.vol - a.vol;
        if (sortBy === 'diff')  return ['low','medium','high'].indexOf(a.diff) - ['low','medium','high'].indexOf(b.diff);
        if (sortBy === 'cpc')   return b.cpc - a.cpc;
        return a.keyword.localeCompare(b.keyword);
      }),
    [keywords, filterIntent, filterDiff, sortBy]
  );

  const kwStats = useMemo(() => ({
    total:   keywords.length,
    easy:    keywords.filter(k => k.diff === 'low').length,
    topVol:  Math.max(...keywords.map(k => k.vol)).toLocaleString(),
    avgCpc:  (keywords.reduce((s, k) => s + k.cpc, 0) / keywords.length).toFixed(2),
  }), [keywords]);

  // ── Audit logic ──
  const auditFiltered = auditCategory === 'todas' ? AUDIT_ITEMS : AUDIT_ITEMS.filter(i => i.category === auditCategory);
  const auditScore = {
    ok:    AUDIT_ITEMS.filter(i => i.status === 'ok').length,
    warn:  AUDIT_ITEMS.filter(i => i.status === 'warn').length,
    error: AUDIT_ITEMS.filter(i => i.status === 'error').length,
  };
  const scorePercent = Math.round((auditScore.ok / AUDIT_ITEMS.length) * 100);

  // ── Topical Map logic ──
  const addCluster = () => {
    if (!newClusterName.trim()) return;
    setClusters(p => [...p, { id: Date.now(), topic: newClusterName, pages: [] }]);
    setNewClusterName('');
  };

  const inputCls = "w-full bg-[#0b0c10] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-emerald-500/60 transition-colors";
  const selectCls = "bg-[#0b0c10] border border-white/8 text-gray-400 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-emerald-500/40 transition-colors";

  return (
    <div className="w-full flex flex-col gap-6 pb-20 md:pb-0">

      {/* ══ HERO ══ */}
      <div className="bg-gradient-to-r from-emerald-950/60 to-teal-950/50 border border-emerald-500/20 rounded-2xl px-6 py-5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/6 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-teal-500/6 rounded-full blur-[80px] pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/20 border border-emerald-500/30 rounded-full mb-3">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-bold text-emerald-300">SEO & Posicionamiento Orgánico</span>
            </div>
            <h1 className="text-2xl font-black text-white flex items-center gap-2 mb-1">
              <Search className="w-6 h-6 text-emerald-400" /> SEO Studio
            </h1>
            <p className="text-emerald-200/60 text-sm">Investiga Keywords → Audita tu sitio → Construye tu Autoridad Tópica</p>
          </div>
          <div className="flex gap-3 flex-shrink-0">
            {[
              { label: 'Score SEO', value: `${scorePercent}%`, color: scorePercent >= 70 ? 'text-emerald-400' : scorePercent >= 50 ? 'text-amber-400' : 'text-red-400' },
              { label: 'Keywords', value: keywords.length, color: 'text-white' },
              { label: 'Clusters', value: clusters.length, color: 'text-teal-400' },
            ].map((s, i) => (
              <div key={i} className="bg-black/30 border border-white/8 rounded-xl px-4 py-2.5 text-center min-w-[80px]">
                <div className={`text-xl font-black ${s.color}`}>{s.value}</div>
                <div className="text-[10px] text-gray-500 mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ══ BLOQUE 1: KEYWORD RESEARCH ══ */}
      <SEOSection step="01" title="Keyword Research" subtitle="Organiza y prioriza tu banco de palabras clave por volumen, dificultad e intención de búsqueda."
        badge="Keywords" badgeColor="bg-emerald-500/15 border-emerald-500/30 text-emerald-300"
        action={
          <button className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 rounded-lg text-xs font-semibold transition-all">
            <Download className="w-3.5 h-3.5" /> CSV
          </button>
        }
      >
        {/* KW Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
          {[
            { label: 'Total keywords', value: kwStats.total,       color: 'text-white' },
            { label: 'Fáciles de rankear', value: kwStats.easy,   color: 'text-emerald-400' },
            { label: 'Mayor volumen',    value: kwStats.topVol, color: 'text-blue-400' },
            { label: 'CPC promedio',     value: `$${kwStats.avgCpc}`, color: 'text-amber-400' },
          ].map((s, i) => (
            <div key={i} className="bg-[#111318] border border-white/6 rounded-xl p-3">
              <div className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">{s.label}</div>
              <div className={`text-xl font-black ${s.color} mt-0.5`}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Intent legend */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
          {Object.entries(INTENT_CONFIG).map(([key, val]) => (
            <div key={key} className={`px-3 py-2 rounded-xl border text-xs ${val.color}`}>
              <div className="font-bold">{val.emoji} {key.charAt(0).toUpperCase() + key.slice(1)}</div>
            </div>
          ))}
        </div>

        {/* Add keyword */}
        <div className="flex gap-2 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text" value={newKw} onChange={e => setNewKw(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addKw()}
              placeholder="Añadir keyword... Enter para confirmar"
              className="w-full bg-[#0b0c10] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-white text-sm focus:outline-none focus:border-emerald-500/60 transition-colors"
            />
          </div>
          <button onClick={addKw} className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2.5 rounded-xl transition-colors flex items-center gap-2">
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-4 items-center">
          <select value={filterIntent} onChange={e => setFI(e.target.value)} className={selectCls}>
            <option value="todas">Todas las intenciones</option>
            {Object.keys(INTENT_CONFIG).map(k => <option key={k} value={k}>{INTENT_CONFIG[k].emoji} {k}</option>)}
          </select>
          <select value={filterDiff} onChange={e => setFD(e.target.value)} className={selectCls}>
            <option value="todas">Toda dificultad</option>
            <option value="low">Fácil</option>
            <option value="medium">Media</option>
            <option value="high">Difícil</option>
          </select>
          <select value={sortBy} onChange={e => setSortBy(e.target.value)} className={selectCls}>
            <option value="vol">Mayor volumen</option>
            <option value="diff">Menor dificultad</option>
            <option value="cpc">Mayor CPC</option>
            <option value="alpha">Alfabético</option>
          </select>
          <span className="ml-auto text-xs text-gray-600">{filteredKw.length} de {keywords.length}</span>
        </div>

        {/* Table */}
        <div className="bg-[#0b0c10] rounded-2xl border border-white/6 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-[#111318] text-[10px] uppercase tracking-wider text-gray-600 border-b border-white/5">
                  <th className="px-4 py-3 font-bold">Keyword</th>
                  <th className="px-4 py-3 font-bold text-right">Vol/mes</th>
                  <th className="px-4 py-3 font-bold">Dificultad</th>
                  <th className="px-4 py-3 font-bold">Intención</th>
                  <th className="px-4 py-3 font-bold text-right">CPC</th>
                  <th className="px-4 py-3 font-bold">Prioridad</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/4">
                <AnimatePresence>
                  {filteredKw.map((k, i) => {
                    const diff   = DIFF_CONFIG[k.diff];
                    const DIcon  = diff.icon;
                    const intent = INTENT_CONFIG[k.intent];
                    return (
                      <motion.tr key={k.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} transition={{ delay: i * 0.02 }}
                        className="hover:bg-white/[0.02] transition-colors">
                        <td className="px-4 py-3">
                          <span className="text-white font-medium text-sm">{k.keyword}</span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <span className="text-emerald-400 font-black text-sm">{k.vol.toLocaleString()}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center gap-1 text-xs font-bold ${diff.color}`}>
                            <DIcon className="w-3 h-3" /> {diff.label}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${intent.color}`}>
                            {intent.emoji} {intent.label}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <span className="text-amber-400 font-bold text-sm">${k.cpc.toFixed(2)}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${PRIORITY_COLOR[k.priority] || PRIORITY_COLOR.media}`}>
                            {k.priority}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <button onClick={() => setKeywords(p => p.filter(kk => kk.id !== k.id))} className="text-gray-700 hover:text-red-400 transition-colors">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </motion.tr>
                    );
                  })}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
          <div className="px-4 py-3 border-t border-white/5 bg-[#111318]">
            <p className="text-[11px] text-gray-600">
              💡 <strong className="text-gray-400">Estrategia 70/20/10:</strong> 70% keywords fáciles (bajo volumen, fácil de rankear), 20% nicho, 10% competitivas a largo plazo.
            </p>
          </div>
        </div>
      </SEOSection>

      {/* DIVIDER */}
      <Divider icon={<ChevronRight className="w-4 h-4 text-gray-700" />} />

      {/* ══ BLOQUE 2: AUDITORÍA SEO ══ */}
      <SEOSection step="02" title="Auditoría de Sitio" subtitle="Diagnóstico rápido de los factores técnicos, de contenido y de enlaces que afectan tu posicionamiento."
        badge="Auditoría" badgeColor="bg-teal-500/15 border-teal-500/30 text-teal-300"
        action={
          <button className="flex items-center gap-1.5 px-3 py-1.5 bg-teal-500/15 hover:bg-teal-500/25 border border-teal-500/30 text-teal-300 rounded-lg text-xs font-semibold transition-all">
            <RefreshCw className="w-3.5 h-3.5" /> Actualizar
          </button>
        }
      >
        {/* Score Overview */}
        <div className="flex flex-col md:flex-row gap-4 mb-5">
          {/* Score circle */}
          <div className="flex flex-col items-center justify-center bg-[#111318] border border-white/6 rounded-2xl p-6 min-w-[160px]">
            <div className={`text-5xl font-black mb-1 ${scorePercent >= 70 ? 'text-emerald-400' : scorePercent >= 50 ? 'text-amber-400' : 'text-red-400'}`}>
              {scorePercent}
            </div>
            <div className="text-xs font-bold text-gray-500 uppercase tracking-widest">Score SEO</div>
            <div className={`mt-2 text-[11px] font-bold px-2 py-0.5 rounded-full ${scorePercent >= 70 ? 'bg-emerald-500/15 text-emerald-400' : scorePercent >= 50 ? 'bg-amber-500/15 text-amber-400' : 'bg-red-500/15 text-red-400'}`}>
              {scorePercent >= 70 ? '✅ Bueno' : scorePercent >= 50 ? '⚠️ Mejorable' : '🚨 Crítico'}
            </div>
          </div>
          {/* Stat breakdown */}
          <div className="flex-1 grid grid-cols-3 gap-3">
            {[
              { label: 'Correctas', value: auditScore.ok,    color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
              { label: 'Advertencias', value: auditScore.warn,  color: 'text-amber-400',   bg: 'bg-amber-500/10 border-amber-500/20'   },
              { label: 'Críticos',  value: auditScore.error, color: 'text-red-400',      bg: 'bg-red-500/10 border-red-500/20'         },
            ].map((s, i) => (
              <div key={i} className={`${s.bg} border rounded-2xl p-4 flex flex-col items-center justify-center text-center`}>
                <div className={`text-3xl font-black ${s.color}`}>{s.value}</div>
                <div className="text-[11px] text-gray-500 mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Category filter */}
        <div className="flex gap-2 mb-4 flex-wrap">
          {['todas', 'técnico', 'contenido', 'links'].map(c => (
            <button key={c} onClick={() => setAuditCat(c)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border capitalize ${auditCategory === c ? 'bg-emerald-500/15 border-emerald-500/40 text-white' : 'bg-[#111318] border-white/6 text-gray-500 hover:text-white'}`}>
              {c === 'todas' ? 'Todos' : c}
            </button>
          ))}
        </div>

        {/* Audit items as accordion */}
        <div className="space-y-2">
          {auditFiltered.map((item, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
              className="bg-[#111318] border border-white/6 rounded-xl overflow-hidden">
              <button className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-white/[0.02] transition-colors"
                onClick={() => setExpandedAudit(expandedAudit === i ? null : i)}>
                <StatusIcon status={item.status} />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-white truncate">{item.label}</div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-gray-600">{item.category}</div>
                </div>
                <ChevronDown className={`w-4 h-4 text-gray-600 flex-shrink-0 transition-transform ${expandedAudit === i ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {expandedAudit === i && (
                  <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
                    <div className="px-4 pb-3 pt-0">
                      <p className={`text-xs px-3 py-2 rounded-lg border ${
                        item.status === 'ok'    ? 'bg-emerald-500/8 border-emerald-500/20 text-emerald-300' :
                        item.status === 'warn'  ? 'bg-amber-500/8 border-amber-500/20 text-amber-300' :
                        'bg-red-500/8 border-red-500/20 text-red-300'
                      }`}>{item.detail}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </SEOSection>

      {/* DIVIDER */}
      <Divider icon={<Layers className="w-4 h-4 text-gray-700" />} />

      {/* ══ BLOQUE 3: MAPA DE AUTORIDAD TÓPICA ══ */}
      <SEOSection step="03" title="Mapa de Autoridad Tópica" subtitle="Define tu Pillar Page y los clusters de contenido que construirán tu autoridad temática ante Google."
        badge="Topical Map" badgeColor="bg-blue-500/15 border-blue-500/30 text-blue-300"
      >
        {/* Pillar page */}
        <div className="bg-gradient-to-r from-blue-950/40 to-indigo-950/30 border border-blue-500/20 rounded-2xl p-4 mb-5 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center flex-shrink-0">
            <Globe className="w-5 h-5 text-blue-400" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-0.5">Pillar Page Principal</div>
            <input
              value={pillar} onChange={e => setPillar(e.target.value)}
              className="w-full bg-transparent text-white font-bold text-sm focus:outline-none border-b border-white/10 focus:border-blue-500/50 pb-0.5 transition-colors"
              placeholder="Ej: Guía Completa de Marketing Digital"
            />
          </div>
          <div className="text-[10px] text-gray-600">{clusters.reduce((s, c) => s + c.pages.length, 0)} subpáginas</div>
        </div>

        {/* Add cluster */}
        <div className="flex gap-2 mb-4">
          <input value={newClusterName} onChange={e => setNewClusterName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addCluster()}
            placeholder="Nuevo cluster de contenido... Ej: Email Marketing"
            className="flex-1 bg-[#0b0c10] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500/50 transition-colors" />
          <button onClick={addCluster} className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-4 py-2.5 rounded-xl transition-colors flex items-center gap-2">
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Clusters grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {clusters.map((cluster, ci) => (
            <motion.div key={cluster.id} whileHover={{ y: -1 }}
              className="bg-[#111318] border border-white/6 rounded-2xl overflow-hidden">
              <button
                className="w-full flex items-center justify-between gap-3 px-4 py-3 hover:bg-white/[0.02] transition-colors"
                onClick={() => setExpandedCluster(expandedCluster === cluster.id ? null : cluster.id)}>
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-blue-500/20 border border-blue-500/30 flex items-center justify-center">
                    <Network className="w-3.5 h-3.5 text-blue-400" />
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-bold text-white">{cluster.topic}</div>
                    <div className="text-[10px] text-gray-600">{cluster.pages.length} subpáginas</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-blue-400 bg-blue-500/10 border border-blue-500/20 rounded-full px-2 py-0.5">
                    Cluster {ci + 1}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-gray-600 transition-transform ${expandedCluster === cluster.id ? 'rotate-180' : ''}`} />
                </div>
              </button>
              <AnimatePresence>
                {expandedCluster === cluster.id && (
                  <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
                    <div className="border-t border-white/5 p-3 space-y-1.5">
                      {cluster.pages.map((page, pi) => (
                        <div key={pi} className="flex items-center gap-2 px-3 py-2 bg-[#0b0c10] rounded-xl">
                          <ArrowRight className="w-3 h-3 text-blue-400/50 flex-shrink-0" />
                          <span className="text-xs text-gray-300">{page}</span>
                        </div>
                      ))}
                      {cluster.pages.length === 0 && (
                        <div className="text-center text-xs text-gray-700 py-4">Sin subpáginas definidas</div>
                      )}
                      <button onClick={() => {
                        const name = prompt('Nombre de la subpágina:');
                        if (name) setClusters(p => p.map(c => c.id === cluster.id ? { ...c, pages: [...c.pages, name] } : c));
                      }} className="w-full py-2 border border-dashed border-white/10 rounded-xl text-xs text-gray-600 hover:text-gray-400 hover:border-white/20 transition-colors">
                        + Añadir subpágina
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* Consejo ARIA */}
        <div className="mt-4 bg-gradient-to-r from-blue-900/20 to-indigo-900/15 border border-blue-500/15 rounded-2xl p-5 flex gap-4 items-start">
          <div className="w-8 h-8 rounded-xl bg-blue-500/20 flex items-center justify-center flex-shrink-0">
            <Zap className="w-4 h-4 text-blue-400" />
          </div>
          <div>
            <p className="text-xs font-bold text-blue-400 mb-1">💡 Consejo de ARIA sobre SEO</p>
            <p className="text-xs text-gray-400 leading-relaxed">
              El Topical Map es el secreto que usan las agencias de SEO de $10,000/mes y no te cuentan.
              <strong className="text-white"> Google recompensa la cobertura COMPLETA de un tema, no el número de artículos.</strong>
              {' '}Define tu Pillar, crea mínimo 4 clusters de 5 subpáginas cada uno, interlinea todo y en 6 meses tendrás autoridad orgánica real.
            </p>
          </div>
        </div>
      </SEOSection>
    </div>
  );
}

// ── Helpers ───────────────────────────────────────────────────────
function SEOSection({ step, title, subtitle, badge, badgeColor, action, children }) {
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

function Divider({ icon }) {
  return (
    <div className="flex items-center gap-4">
      <div className="flex-1 h-px bg-white/5" />
      {icon}
      <div className="flex-1 h-px bg-white/5" />
    </div>
  );
}
