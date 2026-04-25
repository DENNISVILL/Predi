import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrendingUp, TrendingDown, DollarSign, Users, Target,
  Plus, Trash2, Download, ChevronDown, ChevronUp, BarChart2
} from 'lucide-react';

const MONTHS = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

const COLORS = [
  '#007bff', '#00ff9d', '#8b5cf6', '#f59e0b', '#ef4444',
  '#10b981', '#f97316', '#06b6d4', '#ec4899', '#84cc16', '#6366f1', '#14b8a6'
];

const DEFAULT_REVENUE_STREAMS = [
  { id: 1, name: 'Gestión de Redes Sociales', q1: 2400, q2: 2800, q3: 3200, q4: 3800, growth: 15 },
  { id: 2, name: 'Publicidad Paga (Pauta)', q1: 1200, q2: 1400, q3: 1600, q4: 2000, growth: 20 },
  { id: 3, name: 'Creación de Contenido', q1: 800, q2: 1000, q3: 1200, q4: 1500, growth: 25 },
];

const DEFAULT_COSTS = [
  { id: 1, name: 'Nómina / Colaboradores', monthly: 1200 },
  { id: 2, name: 'Herramientas (Predix, Canva, etc.)', monthly: 150 },
  { id: 3, name: 'Marketing propio', monthly: 200 },
  { id: 4, name: 'Administración / Contador', monthly: 100 },
];

const GROWTH_SCENARIOS = [
  { id: 'conservative', label: 'Conservador', multiplier: 0.7, color: '#6366f1', desc: 'Sin nuevos clientes. Mantenimiento.' },
  { id: 'realistic', label: 'Realista', multiplier: 1.0, color: '#00ff9d', desc: 'Crecimiento moderado sostenido.' },
  { id: 'optimistic', label: 'Optimista', multiplier: 1.5, color: '#f59e0b', desc: 'Captación activa + upsell.' },
];

const fmt = (n) => `$${n >= 1000 ? (n / 1000).toFixed(1) + 'k' : Math.round(n).toLocaleString()}`;

function MiniBar({ value, max, color = '#007bff' }) {
  const pct = max > 0 ? Math.min(100, (value / max) * 100) : 0;
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
        <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.5 }}
          className="h-full rounded-full" style={{ backgroundColor: color }} />
      </div>
    </div>
  );
}

export default function AnnualForecast() {
  const [streams, setStreams] = useState(DEFAULT_REVENUE_STREAMS);
  const [costs, setCosts] = useState(DEFAULT_COSTS);
  const [scenario, setScenario] = useState('realistic');
  const [newClients, setNewClients] = useState(2);
  const [avgClientValue, setAvgClientValue] = useState(600);
  const [openSection, setOpenSection] = useState('streams');

  const activeScenario = GROWTH_SCENARIOS.find(s => s.id === scenario);
  const mult = activeScenario.multiplier;

  // Generate monthly projections
  const monthlyData = useMemo(() => {
    return MONTHS.map((month, mi) => {
      const qIdx = Math.floor(mi / 3); // 0,1,2,3
      const qKeys = ['q1', 'q2', 'q3', 'q4'];
      const qKey = qKeys[qIdx];

      // Revenue from streams (with monthly growth interpolation)
      const streamRevenue = streams.reduce((sum, s) => {
        const qVal = s[qKey] || 0;
        const monthGrowth = 1 + ((s.growth / 100) / 12) * mi;
        return sum + (qVal / 3) * mult * monthGrowth;
      }, 0);

      // New client revenue (ramps up from month 3+)
      const newClientRevenue = mi >= 2 ? newClients * avgClientValue * mult * (1 + mi * 0.02) : 0;

      const totalRevenue = streamRevenue + newClientRevenue;
      const totalCosts = costs.reduce((sum, c) => sum + c.monthly, 0);
      const profit = totalRevenue - totalCosts;
      const margin = totalRevenue > 0 ? (profit / totalRevenue) * 100 : 0;

      return { month, mi, totalRevenue, totalCosts, profit, margin, streamRevenue, newClientRevenue };
    });
  }, [streams, costs, scenario, newClients, avgClientValue]);

  const annualTotals = useMemo(() => {
    const revenue = monthlyData.reduce((s, m) => s + m.totalRevenue, 0);
    const costsTotal = monthlyData.reduce((s, m) => s + m.totalCosts, 0);
    const profit = revenue - costsTotal;
    const margin = revenue > 0 ? (profit / revenue) * 100 : 0;
    const peak = Math.max(...monthlyData.map(m => m.totalRevenue));
    return { revenue, costsTotal, profit, margin, peak };
  }, [monthlyData]);

  const maxRevenue = annualTotals.peak;

  // CRUD helpers
  const addStream = () => setStreams(p => [...p, { id: Date.now(), name: 'Nuevo servicio', q1: 0, q2: 0, q3: 0, q4: 0, growth: 10 }]);
  const removeStream = (id) => setStreams(p => p.filter(s => s.id !== id));
  const updateStream = (id, k, v) => setStreams(p => p.map(s => s.id === id ? { ...s, [k]: v } : s));

  const addCost = () => setCosts(p => [...p, { id: Date.now(), name: 'Nuevo costo', monthly: 0 }]);
  const removeCost = (id) => setCosts(p => p.filter(c => c.id !== id));
  const updateCost = (id, k, v) => setCosts(p => p.map(c => c.id === id ? { ...c, [k]: v } : c));

  const handleExport = () => {
    const rows = [
      ['Pronóstico Anual — Predix', '', '', '', '', '', '', '', '', '', '', '', '', ''],
      ['', ...MONTHS],
      ['Ingresos', ...monthlyData.map(m => m.totalRevenue.toFixed(0))],
      ['Costos', ...monthlyData.map(m => m.totalCosts.toFixed(0))],
      ['Utilidad', ...monthlyData.map(m => m.profit.toFixed(0))],
      ['Margen %', ...monthlyData.map(m => m.margin.toFixed(1))],
      [],
      ['TOTALES ANUALES'],
      ['Ingresos', annualTotals.revenue.toFixed(0)],
      ['Costos', annualTotals.costsTotal.toFixed(0)],
      ['Utilidad', annualTotals.profit.toFixed(0)],
      ['Margen', `${annualTotals.margin.toFixed(1)}%`],
      ['Escenario', activeScenario.label],
    ];
    const csv = rows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'forecast-anual-predix.csv'; a.click();
    URL.revokeObjectURL(url);
  };

  const inputCls = "bg-[#0b0c10] border border-white/10 rounded-lg px-2.5 py-1.5 text-white text-xs focus:outline-none focus:border-blue-500/50 transition-colors";

  return (
    <div className="p-6 flex flex-col gap-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <BarChart2 className="w-5 h-5 text-blue-400" /> Pronóstico Anual de Ingresos
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">Proyecta tus ingresos mes a mes con diferentes escenarios de crecimiento</p>
        </div>
        <button onClick={handleExport} className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-500/15 hover:bg-blue-500/25 border border-blue-500/30 text-blue-300 rounded-lg text-xs font-semibold transition-all">
          <Download className="w-3.5 h-3.5" /> CSV
        </button>
      </div>

      {/* Scenario Selector */}
      <div className="grid grid-cols-3 gap-3">
        {GROWTH_SCENARIOS.map(s => (
          <button key={s.id} onClick={() => setScenario(s.id)}
            className={`p-4 rounded-xl border text-left transition-all ${scenario === s.id ? 'border-opacity-60 bg-opacity-15' : 'bg-[#111318] border-white/8 hover:border-white/15'}`}
            style={scenario === s.id ? { backgroundColor: `${s.color}20`, borderColor: `${s.color}50` } : {}}>
            <p className="text-sm font-bold text-white">{s.label}</p>
            <p className="text-xs mt-0.5" style={{ color: s.color }}>{s.desc}</p>
          </button>
        ))}
      </div>

      {/* KPI Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Ingresos Anuales', value: fmt(annualTotals.revenue), icon: DollarSign, color: 'text-green-400' },
          { label: 'Costos Anuales', value: fmt(annualTotals.costsTotal), icon: TrendingDown, color: 'text-red-400' },
          { label: 'Utilidad Anual', value: fmt(annualTotals.profit), icon: TrendingUp, color: annualTotals.profit > 0 ? 'text-green-400' : 'text-red-400' },
          { label: 'Margen Promedio', value: `${annualTotals.margin.toFixed(1)}%`, icon: Target, color: annualTotals.margin >= 30 ? 'text-green-400' : 'text-amber-400' },
        ].map((k, i) => (
          <div key={i} className="bg-[#111318] border border-white/8 rounded-xl p-4">
            <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold flex items-center gap-1"><k.icon className="w-3.5 h-3.5" />{k.label}</p>
            <p className={`text-xl font-black ${k.color} mt-1`}>{k.value}</p>
            <p className="text-xs text-gray-600 mt-0.5">Escenario {activeScenario.label}</p>
          </div>
        ))}
      </div>

      {/* Monthly Chart (bar visualization) */}
      <div className="bg-[#0e1117] border border-white/5 rounded-2xl p-5">
        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Proyección Mensual</h4>
        <div className="grid grid-cols-12 gap-1 items-end h-32">
          {monthlyData.map((m, i) => {
            const profitPct = maxRevenue > 0 ? Math.max(0, (m.profit / maxRevenue) * 100) : 0;
            const costPct = maxRevenue > 0 ? Math.min(100, (m.totalCosts / maxRevenue) * 100) : 0;
            return (
              <div key={m.month} className="flex flex-col items-center gap-1 group relative">
                <div className="absolute bottom-full mb-1 bg-gray-900 border border-white/10 rounded-lg px-2 py-1.5 text-[10px] text-white opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10 left-1/2 -translate-x-1/2">
                  <div className="font-bold">{m.month}</div>
                  <div className="text-green-400">Rev: {fmt(m.totalRevenue)}</div>
                  <div className="text-red-400">Costo: {fmt(m.totalCosts)}</div>
                  <div className={m.profit > 0 ? 'text-green-300' : 'text-red-300'}>Util: {fmt(m.profit)}</div>
                </div>
                <div className="w-full flex flex-col gap-0.5" style={{ height: '100px' }}>
                  <div className="mt-auto w-full rounded-t-sm" style={{ height: `${profitPct}%`, backgroundColor: activeScenario.color, opacity: 0.8 }} />
                  <div className="w-full rounded-b-sm bg-red-500/40" style={{ height: `${costPct * 0.3}%` }} />
                </div>
                <span className="text-[9px] text-gray-600">{m.month}</span>
              </div>
            );
          })}
        </div>
        <div className="flex gap-4 mt-3 pt-3 border-t border-white/5">
          <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: activeScenario.color }} /><span className="text-xs text-gray-500">Utilidad</span></div>
          <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-sm bg-red-500/40" /><span className="text-xs text-gray-500">Costos</span></div>
        </div>
      </div>

      {/* New Client Impact */}
      <div className="bg-[#111318] border border-white/8 rounded-xl p-5 flex flex-col gap-4">
        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Impacto de Nuevos Clientes</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label className="text-xs text-gray-500">Nuevos clientes proyectados</label>
              <span className="text-sm font-bold text-white">{newClients}</span>
            </div>
            <input type="range" min={0} max={20} value={newClients} onChange={e => setNewClients(+e.target.value)} className="w-full accent-blue-500" />
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label className="text-xs text-gray-500">Valor promedio / cliente / mes</label>
              <span className="text-sm font-bold text-white">${avgClientValue}</span>
            </div>
            <input type="range" min={100} max={5000} step={50} value={avgClientValue} onChange={e => setAvgClientValue(+e.target.value)} className="w-full accent-green-500" />
          </div>
        </div>
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl px-4 py-3">
          <p className="text-xs text-blue-300">
            💡 Impacto anual de {newClients} cliente(s) nuevos a ${avgClientValue}/mes:{' '}
            <span className="font-bold text-white">{fmt(newClients * avgClientValue * 12 * mult)} adicionales</span>
          </p>
        </div>
      </div>

      {/* Revenue Streams */}
      <div className="flex flex-col gap-2">
        <button onClick={() => setOpenSection(openSection === 'streams' ? null : 'streams')}
          className={`flex items-center justify-between px-5 py-4 rounded-xl border transition-all ${openSection === 'streams' ? 'bg-blue-500/10 border-blue-500/30 text-white' : 'bg-[#111318] border-white/8 text-gray-400'}`}>
          <span className="flex items-center gap-2 font-semibold text-sm"><DollarSign className="w-4 h-4 text-blue-400" /> Fuentes de Ingreso ({streams.length})</span>
          {openSection === 'streams' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        <AnimatePresence>
          {openSection === 'streams' && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
              <div className="bg-[#0e1117] border border-white/5 rounded-xl p-4 flex flex-col gap-3">
                <div className="grid grid-cols-7 gap-2 text-xs text-gray-500 font-semibold uppercase tracking-wider px-1">
                  <div className="col-span-2">Fuente</div>
                  {['Q1', 'Q2', 'Q3', 'Q4'].map(q => <div key={q} className="text-center">{q}/mes</div>)}
                  <div className="text-center">% crecim.</div>
                </div>
                {streams.map((s, si) => (
                  <motion.div key={s.id} layout className="grid grid-cols-7 gap-2 items-center">
                    <div className="col-span-2 flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: COLORS[si % COLORS.length] }} />
                      <input value={s.name} onChange={e => updateStream(s.id, 'name', e.target.value)} className={`${inputCls} flex-1 min-w-0`} />
                    </div>
                    {['q1', 'q2', 'q3', 'q4'].map(q => (
                      <div key={q} className="relative">
                        <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-600 text-xs">$</span>
                        <input type="number" value={s[q]} onChange={e => updateStream(s.id, q, +e.target.value)} className={`${inputCls} pl-4 text-center w-full`} />
                      </div>
                    ))}
                    <div className="flex items-center gap-1">
                      <input type="number" value={s.growth} onChange={e => updateStream(s.id, 'growth', +e.target.value)} className={`${inputCls} text-center flex-1`} min={0} max={200} />
                      <button onClick={() => removeStream(s.id)} className="text-gray-700 hover:text-red-400 transition-colors flex-shrink-0"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </motion.div>
                ))}
                <button onClick={addStream} className="text-xs text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1.5 pt-2 border-t border-white/5">
                  <Plus className="w-3.5 h-3.5" /> Agregar fuente
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Fixed Costs */}
      <div className="flex flex-col gap-2">
        <button onClick={() => setOpenSection(openSection === 'costs' ? null : 'costs')}
          className={`flex items-center justify-between px-5 py-4 rounded-xl border transition-all ${openSection === 'costs' ? 'bg-red-500/10 border-red-500/30 text-white' : 'bg-[#111318] border-white/8 text-gray-400'}`}>
          <span className="flex items-center gap-2 font-semibold text-sm"><TrendingDown className="w-4 h-4 text-red-400" /> Costos Fijos ({costs.length}) — Total: ${costs.reduce((s, c) => s + c.monthly, 0).toLocaleString()}/mes</span>
          {openSection === 'costs' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        <AnimatePresence>
          {openSection === 'costs' && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
              <div className="bg-[#0e1117] border border-white/5 rounded-xl p-4 flex flex-col gap-3">
                {costs.map(c => (
                  <motion.div key={c.id} layout className="grid grid-cols-12 gap-2 items-center">
                    <div className="col-span-8"><input value={c.name} onChange={e => updateCost(c.id, 'name', e.target.value)} className={`${inputCls} w-full`} /></div>
                    <div className="col-span-3 relative">
                      <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-600 text-xs">$</span>
                      <input type="number" value={c.monthly} onChange={e => updateCost(c.id, 'monthly', +e.target.value)} className={`${inputCls} pl-4 w-full`} />
                    </div>
                    <div className="col-span-1 flex justify-end">
                      <button onClick={() => removeCost(c.id)} className="text-gray-700 hover:text-red-400 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </motion.div>
                ))}
                <button onClick={addCost} className="text-xs text-red-400 hover:text-red-300 font-semibold flex items-center gap-1.5 pt-2 border-t border-white/5">
                  <Plus className="w-3.5 h-3.5" /> Agregar costo
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
