// ═══════════════════════════════════════════════════════════════
// ANALÍTICA & AGENCIA — Panel Unificado
// Fusión: Modelo Financiero + CRM Clientes + Generador de Pitch + Reportes + Influencers
// Flujo: Financiero → CRM → Pitch → Reporte Ejecutivo
// ═══════════════════════════════════════════════════════════════
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart3, DollarSign, Users, Briefcase, Plus, Trash2, Edit3,
  ChevronDown, ChevronUp, CheckCircle, AlertCircle, Download,
  Star, Search, XCircle, TrendingUp, FileText, ChevronRight,
  Zap, Target, Mail, Globe
} from 'lucide-react';

// ── DATA ─────────────────────────────────────────────────────────
const STATUS_OPTIONS = ['Prospecto', 'En negociación', 'Cliente activo', 'En pausa', 'Perdido'];
const INDUSTRY_OPTIONS = ['Fitness', 'Gastronomía', 'Moda', 'Tech', 'Salud', 'Inmobiliaria', 'Educación', 'Retail', 'Servicios', 'Otro'];
const SOURCE_OPTIONS = ['LinkedIn', 'Referido', 'Instagram', 'Web', 'WhatsApp', 'Evento', 'Frío'];
const STATUS_COLORS = {
  'Prospecto':      'bg-blue-500/15 text-blue-400 border-blue-500/30',
  'En negociación': 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  'Cliente activo': 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  'En pausa':       'bg-gray-500/15 text-gray-400 border-gray-500/30',
  'Perdido':        'bg-red-500/15 text-red-400 border-red-500/30',
};

const DEFAULT_SERVICES = [
  { id: 1, name: 'Gestión de Redes Sociales', hours: 20, rate: 45 },
  { id: 2, name: 'Creación de Contenido (8 posts)', hours: 16, rate: 50 },
  { id: 3, name: 'Pauta Publicitaria (setup)', hours: 5, rate: 60 },
];
const DEFAULT_COSTS = [
  { id: 1, name: 'Herramientas (Predix, Canva, etc.)', amount: 120 },
  { id: 2, name: 'Nómina / Freelancers', amount: 800 },
  { id: 3, name: 'Publicidad de la agencia', amount: 200 },
];

const INITIAL_CLIENTS = [
  { id: 1, name: 'Café Aurora', industry: 'Gastronomía', status: 'Cliente activo', budget: 800, contact: 'María García', email: 'maria@cafeaurora.com', source: 'Instagram', rating: 5, notes: 'Excelente pagador. Quiere crecer en TikTok.', platforms: ['Instagram', 'TikTok'] },
  { id: 2, name: 'FitZone Gym', industry: 'Fitness', status: 'En negociación', budget: 1200, contact: 'Carlos López', email: 'carlos@fitzone.com', source: 'LinkedIn', rating: 4, notes: 'Presentación enviada. Esperar respuesta.', platforms: ['Instagram', 'YouTube'] },
  { id: 3, name: 'ModaVerde', industry: 'Moda', status: 'Prospecto', budget: 600, contact: 'Ana Ruiz', email: 'ana@modaverde.co', source: 'Referido', rating: 3, notes: 'Reunión pendiente. Presupuesto limitado.', platforms: ['Instagram', 'Pinterest'] },
];

const PITCH_TEMPLATES = [
  { id: 'digital', label: '📱 Propuesta Digital Full', pages: ['Portada + Tu Marca', 'El Problema que Resolvemos', 'Nuestra Metodología en 4 Pasos', 'Casos de Éxito / Resultados Reales', 'Paquetes y Precios', 'Próximos Pasos + CTA'] },
  { id: 'redes',   label: '🎯 Gestión de Redes', pages: ['Diagnóstico de tu presencia actual', 'Estrategia de contenido mensual', 'Calendario editorial (muestra)', 'Resultados esperados a 90 días', 'Inversión mensual'] },
  { id: 'ads',     label: '📊 Propuesta de Pauta', pages: ['Auditoría de cuentas actuales', 'Estructura de campañas', 'Simulación de ROAS proyectado', 'Budget recomendado', 'Metodología de optimización'] },
];

// ── HELPERS ───────────────────────────────────────────────────────
const inputCls = "w-full bg-[#0b0c10] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-orange-500/50 transition-colors placeholder-gray-600";
const miniInputCls = "bg-[#0b0c10] border border-white/10 rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none focus:border-orange-500/50 transition-colors w-full";

// ── MODAL CRM ─────────────────────────────────────────────────────
function ClientModal({ client, onSave, onClose }) {
  const [form, setForm] = useState(client || {
    name: '', industry: '', status: 'Prospecto', budget: 0,
    contact: '', email: '', source: '', rating: 4, notes: '', platforms: [],
  });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const togglePlat = (p) => set('platforms', form.platforms.includes(p) ? form.platforms.filter(x => x !== p) : [...form.platforms, p]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      onClick={e => e.target === e.currentTarget && onClose()}>
      <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
        className="bg-[#0e1117] border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-white/5">
          <h3 className="font-bold text-white">{client ? 'Editar Cliente' : 'Nuevo Lead / Cliente'}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors"><XCircle className="w-5 h-5" /></button>
        </div>
        <div className="p-5 flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3">
            <input placeholder="Nombre empresa *" value={form.name} onChange={e => set('name', e.target.value)} className={inputCls} />
            <select value={form.industry} onChange={e => set('industry', e.target.value)} className={inputCls}>
              <option value="">Industria</option>
              {INDUSTRY_OPTIONS.map(i => <option key={i}>{i}</option>)}
            </select>
            <input placeholder="Nombre del contacto" value={form.contact} onChange={e => set('contact', e.target.value)} className={inputCls} />
            <input placeholder="Email" value={form.email} onChange={e => set('email', e.target.value)} className={inputCls} />
            <select value={form.status} onChange={e => set('status', e.target.value)} className={inputCls}>
              {STATUS_OPTIONS.map(s => <option key={s}>{s}</option>)}
            </select>
            <select value={form.source} onChange={e => set('source', e.target.value)} className={inputCls}>
              <option value="">Cómo llegó</option>
              {SOURCE_OPTIONS.map(s => <option key={s}>{s}</option>)}
            </select>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">$</span>
              <input type="number" placeholder="Presupuesto mensual" value={form.budget} onChange={e => set('budget', +e.target.value)} className={`${inputCls} pl-7`} />
            </div>
            <div className="flex items-center gap-2 px-4 py-2.5 bg-[#0b0c10] border border-white/10 rounded-xl">
              <span className="text-xs text-gray-500 mr-1">Rating:</span>
              {[1,2,3,4,5].map(n => (
                <button key={n} onClick={() => set('rating', n)}>
                  <Star className={`w-4 h-4 transition-colors ${n <= form.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-600'}`} />
                </button>
              ))}
            </div>
          </div>
          <textarea rows={2} placeholder="Notas internas..." value={form.notes} onChange={e => set('notes', e.target.value)} className={`${inputCls} resize-none`} />
          <div>
            <p className="text-xs text-gray-500 mb-2 font-bold uppercase tracking-wider">Plataformas gestionadas</p>
            <div className="flex flex-wrap gap-2">
              {['Instagram', 'TikTok', 'Facebook', 'LinkedIn', 'YouTube', 'Twitter/X', 'Pinterest', 'WhatsApp'].map(p => (
                <button key={p} onClick={() => togglePlat(p)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold border transition-all ${form.platforms.includes(p) ? 'bg-orange-500/20 border-orange-500/50 text-orange-300' : 'bg-[#111318] border-white/8 text-gray-500 hover:text-white'}`}>
                  {p}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-3 p-5 border-t border-white/5">
          <button onClick={onClose} className="px-5 py-2.5 rounded-xl text-sm text-gray-400 hover:text-white transition-colors">Cancelar</button>
          <button onClick={() => onSave({ ...form, id: client?.id || Date.now(), mrr: form.status === 'Cliente activo' ? form.budget : 0 })}
            disabled={!form.name}
            className="px-6 py-2.5 rounded-xl text-sm font-bold bg-orange-500/20 hover:bg-orange-500/30 border border-orange-500/40 text-orange-300 transition-all disabled:opacity-40">
            {client ? 'Guardar cambios' : 'Agregar'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════
// MÓDULO PRINCIPAL
// ═══════════════════════════════════════════════════════════════
export default function AnalyticsAgencyModule() {
  // Financiero
  const [numClients, setNumClients] = useState(3);
  const [services, setServices]     = useState(DEFAULT_SERVICES);
  const [costs, setCosts]           = useState(DEFAULT_COSTS);
  const [marginTarget, setMTarget]  = useState(30);
  const [openFin, setOpenFin]       = useState('services');

  // CRM
  const [clients, setClients]       = useState(INITIAL_CLIENTS);
  const [modal, setModal]           = useState(null);
  const [search, setSearch]         = useState('');
  const [crmFilter, setCrmFilter]   = useState('Todos');

  // Pitch
  const [pitchTemplate, setPitchTpl] = useState(null);
  const [pitchClient, setPitchClient] = useState('');
  const [pitchServices, setPitchSvcs] = useState('');

  // ── Cálculos Financieros ──
  const fin = useMemo(() => {
    const rpc   = services.reduce((s, sv) => s + sv.hours * sv.rate, 0);
    const total = rpc * numClients;
    const fixed = costs.reduce((s, c) => s + c.amount, 0);
    const gross  = total - fixed;
    const margin = total > 0 ? ((gross / total) * 100).toFixed(1) : 0;
    const minCli = fixed > 0 && rpc > 0 ? Math.ceil(fixed / rpc) : 0;
    const targetRev = fixed / (1 - marginTarget / 100);
    const targetCli = rpc > 0 ? Math.ceil(targetRev / rpc) : 0;
    const hours = services.reduce((s, sv) => s + sv.hours, 0) * numClients;
    return { rpc, total, fixed, gross, margin, minCli, targetCli, hours };
  }, [numClients, services, costs, marginTarget]);

  const finHealth = [
    { label: 'Margen de Utilidad', status: fin.margin >= 40 ? 'ok' : fin.margin >= 20 ? 'warn' : 'err', msg: fin.margin >= 40 ? `${fin.margin}% — Rentabilidad excelente ✅` : fin.margin >= 20 ? `${fin.margin}% — Aceptable. Optimiza costos.` : `${fin.margin}% — Crítico. Necesitas ajustar precios o reducir costos.` },
    { label: 'Punto de Equilibrio', status: numClients >= fin.minCli ? 'ok' : 'err', msg: numClients >= fin.minCli ? `Cubierto con ${numClients} clientes (mínimo: ${fin.minCli})` : `Necesitas ${fin.minCli - numClients} cliente(s) más para cubrir costos.` },
    { label: 'Carga Operativa', status: fin.hours <= 160 ? 'ok' : 'warn', msg: fin.hours <= 160 ? `${fin.hours}h/mes — Dentro de capacidad normal.` : `${fin.hours}h/mes — Excede 1 FTE. Considera contratar.` },
  ];

  // ── CRM: Cálculos ──
  const filtered = clients.filter(c =>
    (crmFilter === 'Todos' || c.status === crmFilter) &&
    (c.name.toLowerCase().includes(search.toLowerCase()) || c.contact.toLowerCase().includes(search.toLowerCase()))
  );
  const mrr      = clients.filter(c => c.status === 'Cliente activo').reduce((s, c) => s + c.budget, 0);
  const active   = clients.filter(c => c.status === 'Cliente activo').length;
  const pipeline = clients.filter(c => ['Prospecto', 'En negociación'].includes(c.status)).reduce((s, c) => s + c.budget, 0);

  const saveClient = (data) => {
    setClients(prev => prev.find(c => c.id === data.id) ? prev.map(c => c.id === data.id ? data : c) : [...prev, data]);
    setModal(null);
  };

  // ── Service / Cost helpers ──
  const addSvc = () => setServices(p => [...p, { id: Date.now(), name: 'Nuevo Servicio', hours: 10, rate: 40 }]);
  const updSvc = (id, k, v) => setServices(p => p.map(s => s.id === id ? { ...s, [k]: v } : s));
  const delSvc = (id) => setServices(p => p.filter(s => s.id !== id));
  const addCost = () => setCosts(p => [...p, { id: Date.now(), name: 'Nuevo Costo', amount: 0 }]);
  const updCost = (id, k, v) => setCosts(p => p.map(c => c.id === id ? { ...c, [k]: v } : c));
  const delCost = (id) => setCosts(p => p.filter(c => c.id !== id));

  const exportCSV = () => {
    const lines = [`Modelo Financiero Agencia,,,\n\nCLIENTES ACTUALES,${numClients},,\n\nSERVICIOS,Horas,Tarifa,Total\n`, ...services.map(s => `${s.name},${s.hours},$${s.rate},$${s.hours * s.rate}`), `\nCOSTOS FIJOS,Monto,,\n`, ...costs.map(c => `${c.name},$${c.amount},,`), `\nINGRESOS TOTALES,$${fin.total},,\nUTILIDAD,$${fin.gross},,\nMARGEN,${fin.margin}%,,`].join('\n');
    const blob = new Blob([lines], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'financiero-agencia.csv'; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full flex flex-col gap-6 pb-20 md:pb-0">

      {/* ══ HERO ══ */}
      <div className="bg-gradient-to-r from-orange-950/60 to-amber-950/50 border border-orange-500/20 rounded-2xl px-6 py-5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-orange-500/6 rounded-full blur-[100px] pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-500/20 border border-orange-500/30 rounded-full mb-3">
              <div className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse" />
              <span className="text-xs font-bold text-orange-300">✦ Suite Completa de Agencia</span>
            </div>
            <h1 className="text-2xl font-black text-white flex items-center gap-2 mb-1">
              <BarChart3 className="w-6 h-6 text-orange-400" /> Analítica & Agencia
            </h1>
            <p className="text-orange-200/60 text-sm">Modelo Financiero → CRM de Clientes → Generador de Pitch → Reporte Ejecutivo</p>
          </div>
          <div className="flex gap-3 flex-shrink-0">
            {[
              { label: 'MRR Activo', value: `$${mrr.toLocaleString()}`, color: 'text-emerald-400' },
              { label: 'Pipeline',   value: `$${pipeline.toLocaleString()}`, color: 'text-amber-400' },
              { label: 'Clientes',   value: active, color: 'text-white' },
            ].map((s, i) => (
              <div key={i} className="bg-black/30 border border-white/8 rounded-xl px-4 py-2.5 text-center min-w-[90px]">
                <div className={`text-lg font-black ${s.color}`}>{s.value}</div>
                <div className="text-[10px] text-gray-500 mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ══ SECCIÓN 01: MODELO FINANCIERO ══ */}
      <ACard step="01" title="Modelo Financiero" subtitle="Calcula en tiempo real tus ingresos, márgenes y el número exacto de clientes que necesitas para ser rentable."
        badge="Finanzas" badgeColor="bg-orange-500/15 border-orange-500/30 text-orange-300"
        action={<button onClick={exportCSV} className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-500/15 hover:bg-orange-500/25 border border-orange-500/30 text-orange-300 rounded-lg text-xs font-semibold transition-all"><Download className="w-3.5 h-3.5" /> CSV</button>}
      >
        {/* KPI Row */}
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3 mb-5">
          {[
            { label: 'Ingreso / Cliente', value: `$${fin.rpc.toLocaleString()}`, color: 'text-blue-400' },
            { label: 'Ingresos Totales',  value: `$${fin.total.toLocaleString()}`, color: 'text-emerald-400' },
            { label: 'Utilidad Bruta',    value: `$${fin.gross.toLocaleString()}`, color: fin.gross > 0 ? 'text-emerald-400' : 'text-red-400' },
            { label: 'Punto de equilibrio', value: `${fin.minCli} clientes`, color: 'text-amber-400' },
            { label: `Meta ${marginTarget}% margen`, value: `${fin.targetCli} clientes`, color: 'text-purple-400' },
          ].map((k, i) => (
            <div key={i} className="bg-[#111318] border border-white/6 rounded-xl p-3">
              <div className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">{k.label}</div>
              <div className={`text-xl font-black ${k.color} mt-0.5`}>{k.value}</div>
            </div>
          ))}
        </div>

        {/* Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="bg-[#111318] border border-white/6 rounded-xl p-4">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-2">Clientes Actuales</label>
            <div className="flex items-center gap-3">
              <button onClick={() => setNumClients(n => Math.max(1, n - 1))} className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 text-white flex items-center justify-center text-lg transition-colors">-</button>
              <span className="text-3xl font-black text-white flex-1 text-center">{numClients}</span>
              <button onClick={() => setNumClients(n => n + 1)} className="w-8 h-8 rounded-lg bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 flex items-center justify-center text-lg transition-colors">+</button>
            </div>
          </div>
          <div className="bg-[#111318] border border-white/6 rounded-xl p-4">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-2">Meta de Margen: <span className="text-orange-400">{marginTarget}%</span></label>
            <input type="range" min={10} max={80} value={marginTarget} onChange={e => setMTarget(+e.target.value)} className="w-full accent-orange-500 mt-2" />
          </div>
          <div className="bg-[#111318] border border-white/6 rounded-xl p-4">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-1">Carga Horaria Total</label>
            <div className="flex items-end gap-1">
              <span className="text-3xl font-black text-white">{fin.hours}</span>
              <span className="text-sm text-gray-500 mb-1">hrs/mes</span>
            </div>
            <div className="text-xs text-gray-600">{Math.round((fin.hours / 160) * 100)}% de capacidad (160h = 1 FTE)</div>
          </div>
        </div>

        {/* Servicios */}
        <div className="flex flex-col gap-2 mb-3">
          <button onClick={() => setOpenFin(openFin === 'services' ? null : 'services')}
            className={`flex items-center justify-between px-5 py-3.5 rounded-xl border transition-all text-sm font-semibold ${openFin === 'services' ? 'bg-orange-500/10 border-orange-500/30 text-white' : 'bg-[#111318] border-white/6 text-gray-400 hover:text-white'}`}>
            <span className="flex items-center gap-2"><Briefcase className="w-4 h-4 text-orange-400" /> Servicios Facturables ({services.length})</span>
            {openFin === 'services' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          <AnimatePresence>
            {openFin === 'services' && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                <div className="bg-[#0e1117] border border-white/5 rounded-xl p-4 flex flex-col gap-2">
                  <div className="grid grid-cols-12 gap-2 text-[10px] text-gray-600 font-bold uppercase tracking-wider px-1 mb-1">
                    <div className="col-span-5">Nombre del Servicio</div>
                    <div className="col-span-2 text-center">Horas/mes</div>
                    <div className="col-span-2 text-center">Tarifa/h</div>
                    <div className="col-span-2 text-center">Total/mes</div>
                  </div>
                  {services.map(s => (
                    <div key={s.id} className="grid grid-cols-12 gap-2 items-center">
                      <div className="col-span-5"><input value={s.name} onChange={e => updSvc(s.id, 'name', e.target.value)} className={miniInputCls} /></div>
                      <div className="col-span-2"><input type="number" value={s.hours} onChange={e => updSvc(s.id, 'hours', +e.target.value)} className={`${miniInputCls} text-center`} min={0} /></div>
                      <div className="col-span-2">
                        <div className="relative"><span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-500 text-xs">$</span>
                        <input type="number" value={s.rate} onChange={e => updSvc(s.id, 'rate', +e.target.value)} className={`${miniInputCls} pl-5 text-center`} min={0} /></div>
                      </div>
                      <div className="col-span-2 text-center font-bold text-emerald-400 text-sm">${(s.hours * s.rate).toLocaleString()}</div>
                      <div className="col-span-1 flex justify-end"><button onClick={() => delSvc(s.id)} className="text-gray-700 hover:text-red-400 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button></div>
                    </div>
                  ))}
                  <button onClick={addSvc} className="flex items-center gap-1 text-xs text-orange-400 hover:text-orange-300 font-semibold mt-1"><Plus className="w-3.5 h-3.5" /> Agregar servicio</button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Costos Fijos */}
        <div className="flex flex-col gap-2 mb-4">
          <button onClick={() => setOpenFin(openFin === 'costs' ? null : 'costs')}
            className={`flex items-center justify-between px-5 py-3.5 rounded-xl border transition-all text-sm font-semibold ${openFin === 'costs' ? 'bg-red-500/10 border-red-500/30 text-white' : 'bg-[#111318] border-white/6 text-gray-400 hover:text-white'}`}>
            <span className="flex items-center gap-2"><DollarSign className="w-4 h-4 text-red-400" /> Costos Fijos ({costs.length})</span>
            {openFin === 'costs' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          <AnimatePresence>
            {openFin === 'costs' && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                <div className="bg-[#0e1117] border border-white/5 rounded-xl p-4 flex flex-col gap-2">
                  {costs.map(c => (
                    <div key={c.id} className="flex gap-2 items-center">
                      <input value={c.name} onChange={e => updCost(c.id, 'name', e.target.value)} className={`${miniInputCls} flex-1`} />
                      <div className="relative w-32 flex-shrink-0"><span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-500 text-xs">$</span>
                      <input type="number" value={c.amount} onChange={e => updCost(c.id, 'amount', +e.target.value)} className={`${miniInputCls} pl-5`} min={0} /></div>
                      <button onClick={() => delCost(c.id)} className="text-gray-700 hover:text-red-400 transition-colors flex-shrink-0"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  ))}
                  <button onClick={addCost} className="flex items-center gap-1 text-xs text-red-400 hover:text-red-300 font-semibold mt-1"><Plus className="w-3.5 h-3.5" /> Agregar costo</button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Health */}
        <div className="bg-[#0e1117] border border-white/5 rounded-xl p-4 flex flex-col gap-3">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Diagnóstico de Salud Financiera</p>
          {finHealth.map((item, i) => (
            <div key={i} className="flex items-start gap-3">
              {item.status === 'ok' ? <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" /> : <AlertCircle className={`w-4 h-4 flex-shrink-0 mt-0.5 ${item.status === 'warn' ? 'text-amber-400' : 'text-red-400'}`} />}
              <div><p className="text-xs font-bold text-gray-300">{item.label}</p><p className="text-xs text-gray-500">{item.msg}</p></div>
            </div>
          ))}
        </div>
      </ACard>

      {/* DIVIDER */}
      <ADivider />

      {/* ══ SECCIÓN 02: CRM DE CLIENTES ══ */}
      <ACard step="02" title="CRM de Clientes" subtitle="Gestiona todo tu pipeline comercial: prospectos, negociaciones y clientes activos en una sola vista."
        badge="CRM" badgeColor="bg-blue-500/15 border-blue-500/30 text-blue-300"
        action={<button onClick={() => setModal('new')} className="flex items-center gap-2 px-3 py-2 bg-orange-600/80 hover:bg-orange-500 text-white font-bold rounded-xl text-xs transition-all shadow-lg shadow-orange-500/15"><Plus className="w-3.5 h-3.5" /> Nuevo Lead</button>}
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          {[
            { label: 'MRR Recurrente', value: `$${mrr.toLocaleString()}`, color: 'text-emerald-400' },
            { label: 'Clientes Activos', value: active, color: 'text-blue-400' },
            { label: 'Pipeline', value: `$${pipeline.toLocaleString()}`, color: 'text-amber-400' },
            { label: 'Total en CRM', value: clients.length, color: 'text-purple-400' },
          ].map((k, i) => (
            <div key={i} className="bg-[#111318] border border-white/6 rounded-xl p-3">
              <div className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">{k.label}</div>
              <div className={`text-2xl font-black ${k.color} mt-0.5`}>{k.value}</div>
            </div>
          ))}
        </div>

        <div className="flex flex-col md:flex-row gap-2 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input placeholder="Buscar empresa o contacto..." value={search} onChange={e => setSearch(e.target.value)}
              className="w-full bg-[#111318] border border-white/6 rounded-xl pl-9 pr-4 py-2.5 text-white text-sm focus:outline-none focus:border-orange-500/40 placeholder-gray-600 transition-colors" />
          </div>
          <div className="flex gap-1 flex-wrap">
            {['Todos', ...STATUS_OPTIONS].map(s => (
              <button key={s} onClick={() => setCrmFilter(s)}
                className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all ${crmFilter === s ? 'bg-orange-500/15 border-orange-500/40 text-white' : 'bg-[#111318] border-white/6 text-gray-500 hover:text-white'}`}>
                {s} <span className="text-gray-600 ml-1">{s === 'Todos' ? clients.length : clients.filter(c => c.status === s).length}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-[#0e1117] border border-white/5 rounded-xl overflow-hidden">
          <div className="grid grid-cols-12 gap-2 px-4 py-3 border-b border-white/5 text-[10px] text-gray-600 font-bold uppercase tracking-wider">
            <div className="col-span-3">Empresa</div><div className="col-span-2">Estado</div>
            <div className="col-span-2">Presupuesto</div><div className="col-span-2">Rating</div>
            <div className="col-span-2">Plataformas</div><div className="col-span-1"></div>
          </div>
          <AnimatePresence>
            {filtered.length === 0
              ? <div className="py-12 text-center text-gray-600 text-sm">No hay resultados.</div>
              : filtered.map(c => (
                <motion.div key={c.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="grid grid-cols-12 gap-2 px-4 py-3.5 border-b border-white/4 hover:bg-white/[0.015] transition-colors items-center">
                  <div className="col-span-3"><p className="font-semibold text-white text-sm truncate">{c.name}</p><p className="text-xs text-gray-500 truncate">{c.contact} · {c.industry}</p></div>
                  <div className="col-span-2"><span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold border ${STATUS_COLORS[c.status]}`}>{c.status}</span></div>
                  <div className="col-span-2"><p className="text-sm font-bold text-white">${c.budget.toLocaleString()}/mes</p><p className="text-xs text-gray-500">vía {c.source}</p></div>
                  <div className="col-span-2 flex">{[1,2,3,4,5].map(n => <Star key={n} className={`w-3 h-3 ${n <= c.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-700'}`} />)}</div>
                  <div className="col-span-2 flex flex-wrap gap-1">
                    {c.platforms.slice(0, 2).map(p => <span key={p} className="px-1.5 py-0.5 bg-white/5 rounded text-[9px] text-gray-400">{p}</span>)}
                    {c.platforms.length > 2 && <span className="text-[9px] text-gray-600">+{c.platforms.length - 2}</span>}
                  </div>
                  <div className="col-span-1 flex justify-end gap-1">
                    <button onClick={() => setModal(c)} className="text-gray-600 hover:text-orange-400 transition-colors p-1"><Edit3 className="w-3.5 h-3.5" /></button>
                    <button onClick={() => setClients(p => p.filter(cc => cc.id !== c.id))} className="text-gray-600 hover:text-red-400 transition-colors p-1"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                </motion.div>
              ))
            }
          </AnimatePresence>
        </div>

        <AnimatePresence>
          {modal && <ClientModal client={modal === 'new' ? null : modal} onSave={saveClient} onClose={() => setModal(null)} />}
        </AnimatePresence>
      </ACard>

      {/* DIVIDER */}
      <ADivider />

      {/* ══ SECCIÓN 03: GENERADOR DE PITCH ══ */}
      <ACard step="03" title="Generador de Pitch" subtitle="Construye propuestas comerciales profesionales en segundos. Selecciona una plantilla y personaliza."
        badge="Pitch" badgeColor="bg-amber-500/15 border-amber-500/30 text-amber-300">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-5">
          {PITCH_TEMPLATES.map(tpl => (
            <motion.button key={tpl.id} whileHover={{ y: -2 }} onClick={() => setPitchTpl(pitchTemplate?.id === tpl.id ? null : tpl)}
              className={`text-left rounded-2xl border p-4 transition-all ${pitchTemplate?.id === tpl.id ? 'bg-amber-500/12 border-amber-500/50 shadow-lg shadow-amber-500/8' : 'bg-[#111318] border-white/6 hover:border-white/15'}`}>
              <div className="text-2xl mb-2">{tpl.label.split(' ')[0]}</div>
              <div className="font-bold text-white text-sm mb-1">{tpl.label.slice(2)}</div>
              <div className="text-xs text-gray-500">{tpl.pages.length} páginas incluidas</div>
            </motion.button>
          ))}
        </div>

        <AnimatePresence>
          {pitchTemplate && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="bg-[#111318] border border-white/6 rounded-2xl p-5">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Personalizar Propuesta</p>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Nombre del Cliente</label>
                  <input value={pitchClient} onChange={e => setPitchClient(e.target.value)} placeholder="Ej: Café Aurora" className={inputCls} />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Servicios a proponer</label>
                  <input value={pitchServices} onChange={e => setPitchSvcs(e.target.value)} placeholder="Ej: Gestión RRSS + Pauta" className={inputCls} />
                </div>
              </div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Estructura de la Propuesta</p>
              <div className="space-y-2 mb-4">
                {pitchTemplate.pages.map((page, i) => (
                  <div key={i} className="flex items-center gap-3 px-4 py-3 bg-[#0b0c10] rounded-xl border border-white/5">
                    <div className="w-6 h-6 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center flex-shrink-0">
                      <span className="text-[10px] font-black text-amber-400">{i + 1}</span>
                    </div>
                    <span className="text-sm text-gray-300">{page}{pitchClient && i === 0 ? ` — ${pitchClient}` : ''}</span>
                  </div>
                ))}
              </div>
              <button className="flex items-center gap-2 px-5 py-2.5 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 rounded-xl text-sm font-bold transition-all">
                <Download className="w-4 h-4" /> Exportar Propuesta
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </ACard>

      {/* DIVIDER */}
      <ADivider />

      {/* ══ SECCIÓN 04: REPORTE EJECUTIVO ══ */}
      <ACard step="04" title="Reporte Ejecutivo" subtitle="Resumen automático del estado de tu agencia: finanzas, cartera y métricas clave en una sola vista."
        badge="Reporte" badgeColor="bg-emerald-500/15 border-emerald-500/30 text-emerald-300"
        action={<button className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 rounded-lg text-xs font-semibold transition-all"><FileText className="w-3.5 h-3.5" /> PDF</button>}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Revenue Overview */}
          <div className="bg-[#111318] border border-white/6 rounded-2xl p-5">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Resumen Financiero</p>
            <div className="space-y-3">
              {[
                { label: 'Ingresos Totales (proyectado)', value: `$${fin.total.toLocaleString()}`, color: 'text-white' },
                { label: 'Costos Fijos',                  value: `$${fin.fixed.toLocaleString()}`, color: 'text-red-400' },
                { label: 'Utilidad Bruta',                value: `$${fin.gross.toLocaleString()}`, color: fin.gross > 0 ? 'text-emerald-400' : 'text-red-400' },
                { label: 'Margen de Utilidad',            value: `${fin.margin}%`, color: fin.margin >= 40 ? 'text-emerald-400' : fin.margin >= 20 ? 'text-amber-400' : 'text-red-400' },
              ].map((row, i) => (
                <div key={i} className="flex items-center justify-between border-b border-white/4 pb-2 last:border-0 last:pb-0">
                  <span className="text-xs text-gray-500">{row.label}</span>
                  <span className={`text-sm font-black ${row.color}`}>{row.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Pipeline Summary */}
          <div className="bg-[#111318] border border-white/6 rounded-2xl p-5">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Pipeline Comercial</p>
            <div className="space-y-2">
              {STATUS_OPTIONS.map(s => {
                const count = clients.filter(c => c.status === s).length;
                const val   = clients.filter(c => c.status === s).reduce((sum, c) => sum + c.budget, 0);
                if (count === 0) return null;
                return (
                  <div key={s} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${STATUS_COLORS[s]}`}>{s}</span>
                      <span className="text-xs text-gray-500">{count} cliente{count !== 1 ? 's' : ''}</span>
                    </div>
                    <span className="text-sm font-bold text-white">${val.toLocaleString()}/mes</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-4 bg-gradient-to-r from-orange-900/20 to-amber-900/15 border border-orange-500/15 rounded-2xl p-5 flex gap-4 items-start">
          <div className="w-8 h-8 rounded-xl bg-orange-500/20 flex items-center justify-center flex-shrink-0">
            <Zap className="w-4 h-4 text-orange-400" />
          </div>
          <div>
            <p className="text-xs font-bold text-orange-400 mb-1">💡 Consejo de ARIA sobre tu Agencia</p>
            <p className="text-xs text-gray-400 leading-relaxed">
              Una agencia de marketing sana tiene un margen bruto de al menos 40%. Si estás por debajo de eso,
              <strong className="text-white"> prioriza subir tus tarifas antes de conseguir más clientes.</strong>
              {' '}Escalar con márgenes bajos solo amplifica el problema. Revisa tu pricing cada 6 meses.
            </p>
          </div>
        </div>
      </ACard>
    </div>
  );
}

function ACard({ step, title, subtitle, badge, badgeColor, action, children }) {
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

function ADivider() {
  return (
    <div className="flex items-center gap-4">
      <div className="flex-1 h-px bg-white/5" />
      <ChevronRight className="w-4 h-4 text-gray-700" />
      <div className="flex-1 h-px bg-white/5" />
    </div>
  );
}
