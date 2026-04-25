import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  DollarSign, TrendingUp, ShoppingCart, Users, Target, AlertCircle,
  CheckCircle, RefreshCw, Download
} from 'lucide-react';

const PLATFORMS = [
  { id: 'meta', label: 'Meta Ads (Facebook/Instagram)', cpcBase: 0.45, ctrBase: 0.9, convRate: 2.8 },
  { id: 'google', label: 'Google Search Ads', cpcBase: 1.80, ctrBase: 4.2, convRate: 4.1 },
  { id: 'tiktok', label: 'TikTok Ads', cpcBase: 0.28, ctrBase: 2.1, convRate: 1.9 },
  { id: 'youtube', label: 'YouTube Ads', cpcBase: 0.10, ctrBase: 0.8, convRate: 1.2 },
  { id: 'linkedin', label: 'LinkedIn Ads', cpcBase: 5.20, ctrBase: 0.6, convRate: 3.5 },
];

const OBJECTIVES = ['E-commerce (ventas online)', 'Generación de leads', 'Branding / Awareness', 'App installs', 'Tráfico al sitio'];

const slider = (label, value, onChange, min, max, step = 1, prefix = '', suffix = '') => (
  <div className="flex flex-col gap-2">
    <div className="flex items-center justify-between">
      <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{label}</label>
      <span className="text-sm font-bold text-white">{prefix}{typeof value === 'number' ? value.toLocaleString() : value}{suffix}</span>
    </div>
    <input type="range" min={min} max={max} step={step} value={value} onChange={e => onChange(+e.target.value)}
      className="w-full accent-red-500 cursor-pointer" />
    <div className="flex justify-between text-xs text-gray-700">
      <span>{prefix}{min.toLocaleString()}{suffix}</span>
      <span>{prefix}{max.toLocaleString()}{suffix}</span>
    </div>
  </div>
);

const Metric = ({ label, value, sub, icon: Icon, color = 'text-white', border = 'border-white/5', warn }) => (
  <div className={`bg-[#111318] border ${warn ? 'border-red-500/30' : border} rounded-xl p-4 flex flex-col gap-1`}>
    <div className="flex items-center gap-1.5 text-xs text-gray-500 font-semibold uppercase tracking-wider">
      {Icon && <Icon className={`w-3.5 h-3.5 ${warn ? 'text-red-400' : color}`} />}{label}
    </div>
    <div className={`text-xl font-black ${warn ? 'text-red-400' : color}`}>{value}</div>
    {sub && <div className="text-xs text-gray-600">{sub}</div>}
  </div>
);

export default function RoasSimulator() {
  const [platform, setPlatform] = useState('meta');
  const [objective, setObjective] = useState('E-commerce (ventas online)');
  const [budget, setBudget] = useState(500);
  const [avgTicket, setAvgTicket] = useState(45);
  const [cogs, setCogs] = useState(40); // cost of goods %
  const [cpcOverride, setCpcOverride] = useState(null);
  const [convOverride, setConvOverride] = useState(null);

  const plat = PLATFORMS.find(p => p.id === platform);
  const effectiveCPC = cpcOverride ?? plat.cpcBase;
  const effectiveConv = convOverride ?? plat.convRate;

  const metrics = useMemo(() => {
    const clicks = budget / effectiveCPC;
    const conversions = clicks * (effectiveConv / 100);
    const revenue = conversions * avgTicket;
    const adCost = budget;
    const cogsAmount = revenue * (cogs / 100);
    const grossProfit = revenue - adCost - cogsAmount;
    const roas = budget > 0 ? revenue / budget : 0;
    const cpa = conversions > 0 ? budget / conversions : 0;
    const roi = budget > 0 ? ((grossProfit / budget) * 100) : 0;
    const breakEvenConv = budget > 0 ? budget / (avgTicket * (1 - cogs / 100)) : 0;
    return { clicks, conversions, revenue, adCost, grossProfit, roas, cpa, roi, breakEvenConv };
  }, [budget, effectiveCPC, effectiveConv, avgTicket, cogs, platform]);

  const roasColor = metrics.roas >= 4 ? 'text-green-400' : metrics.roas >= 2 ? 'text-amber-400' : 'text-red-400';
  const roasLabel = metrics.roas >= 4 ? '✅ Excelente' : metrics.roas >= 2 ? '⚠️ Aceptable' : '🚨 Crítico';
  const roaBorder = metrics.roas >= 4 ? 'border-green-500/30' : metrics.roas >= 2 ? 'border-amber-500/30' : 'border-red-500/30';

  const handleExport = () => {
    const lines = [
      `SIMULACIÓN DE PAUTA — PREDIX`,
      `Plataforma: ${plat.label}`,
      `Objetivo: ${objective}`,
      `Fecha: ${new Date().toLocaleDateString('es-ES', { dateStyle: 'long' })}`,
      '',
      `PARÁMETROS`,
      `  Presupuesto: $${budget.toLocaleString()}`,
      `  CPC efectivo: $${effectiveCPC.toFixed(2)}`,
      `  Tasa de conversión: ${effectiveConv}%`,
      `  Ticket promedio: $${avgTicket}`,
      `  Costo de producto/servicio: ${cogs}%`,
      '',
      `PROYECCIÓN`,
      `  Clics estimados: ${Math.round(metrics.clicks).toLocaleString()}`,
      `  Conversiones estimadas: ${metrics.conversions.toFixed(1)}`,
      `  Ingresos proyectados: $${metrics.revenue.toFixed(2)}`,
      `  ROAS: ${metrics.roas.toFixed(2)}x — ${roasLabel}`,
      `  CPA (Costo por conversión): $${metrics.cpa.toFixed(2)}`,
      `  Utilidad bruta estimada: $${metrics.grossProfit.toFixed(2)}`,
      `  ROI: ${metrics.roi.toFixed(1)}%`,
      `  Conversiones mínimas para equilibrio: ${metrics.breakEvenConv.toFixed(1)}`,
    ].join('\n');
    const blob = new Blob([lines], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'simulacion-pauta.txt'; a.click();
    URL.revokeObjectURL(url);
  };

  const inputCls = "w-full bg-[#0b0c10] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-red-500/50 transition-colors";

  return (
    <div className="p-6 flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-white">Simulador de Pauta & ROAS</h3>
          <p className="text-xs text-gray-500">Proyecta el retorno de inversión antes de gastar un centavo</p>
        </div>
        <button onClick={handleExport} className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/15 hover:bg-red-500/25 border border-red-500/30 text-red-300 rounded-lg text-xs font-semibold transition-all">
          <Download className="w-3.5 h-3.5" /> Exportar
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Controls */}
        <div className="flex flex-col gap-5">
          {/* Platform */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Plataforma</label>
            <div className="grid grid-cols-1 gap-2">
              {PLATFORMS.map(p => (
                <button key={p.id} onClick={() => { setPlatform(p.id); setCpcOverride(null); setConvOverride(null); }}
                  className={`flex items-center justify-between px-4 py-2.5 rounded-xl border text-sm font-semibold text-left transition-all ${platform === p.id ? 'bg-red-500/15 border-red-500/40 text-white' : 'bg-[#111318] border-white/8 text-gray-500 hover:text-white hover:border-white/15'}`}>
                  <span>{p.label}</span>
                  <span className="text-xs text-gray-600">CPC ~${p.cpcBase} · Conv ~{p.convRate}%</span>
                </button>
              ))}
            </div>
          </div>

          {/* Sliders */}
          <div className="bg-[#111318] border border-white/8 rounded-xl p-4 flex flex-col gap-5">
            {slider('Presupuesto mensual', budget, setBudget, 50, 10000, 50, '$')}
            {slider('Ticket promedio de venta', avgTicket, setAvgTicket, 5, 500, 5, '$')}
            {slider('Costo del producto/servicio', cogs, setCogs, 0, 90, 5, '', '%')}
          </div>

          {/* Manual Override */}
          <div className="bg-[#111318] border border-white/8 rounded-xl p-4 flex flex-col gap-3">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Parámetros manuales (avanzado)</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-500 mb-1 block">CPC personalizado ($)</label>
                <input type="number" value={cpcOverride ?? ''} onChange={e => setCpcOverride(e.target.value ? +e.target.value : null)}
                  placeholder={`${plat.cpcBase} (plataforma)`} step={0.01} className={inputCls} />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Tasa conversión (%)</label>
                <input type="number" value={convOverride ?? ''} onChange={e => setConvOverride(e.target.value ? +e.target.value : null)}
                  placeholder={`${plat.convRate} (plataforma)`} step={0.1} className={inputCls} />
              </div>
            </div>
            {(cpcOverride || convOverride) && (
              <button onClick={() => { setCpcOverride(null); setConvOverride(null); }} className="flex items-center gap-1 text-xs text-gray-500 hover:text-white transition-colors">
                <RefreshCw className="w-3 h-3" /> Restaurar valores de plataforma
              </button>
            )}
          </div>
        </div>

        {/* Right: Results */}
        <div className="flex flex-col gap-4">
          {/* ROAS Hero */}
          <div className={`bg-gradient-to-br from-[#111318] to-[#0e1117] border ${roaBorder} rounded-2xl p-6 text-center`}>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">ROAS Proyectado</p>
            <p className={`text-6xl font-black ${roasColor}`}>{metrics.roas.toFixed(2)}x</p>
            <p className={`text-sm font-bold mt-1 ${roasColor}`}>{roasLabel}</p>
            <p className="text-xs text-gray-600 mt-2">Por cada $1 invertido, recuperas ${metrics.roas.toFixed(2)}</p>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 gap-3">
            <Metric label="Clics Est." value={Math.round(metrics.clicks).toLocaleString()} sub="visitas a tu landing" icon={Target} color="text-blue-400" />
            <Metric label="Conversiones" value={metrics.conversions.toFixed(1)} sub="ventas / leads" icon={ShoppingCart} color="text-green-400" />
            <Metric label="Ingresos" value={`$${metrics.revenue.toFixed(0)}`} sub="brutos generados" icon={DollarSign} color="text-amber-400" />
            <Metric label="CPA" value={`$${metrics.cpa.toFixed(2)}`} sub="costo por conversión" icon={Users} border="border-white/5" />
            <Metric label="Utilidad Bruta" value={`$${metrics.grossProfit.toFixed(0)}`} sub="después de ads + costo" icon={TrendingUp} color={metrics.grossProfit > 0 ? 'text-green-400' : 'text-red-400'} warn={metrics.grossProfit <= 0} />
            <Metric label="ROI" value={`${metrics.roi.toFixed(1)}%`} sub="retorno sobre inversión" icon={TrendingUp} color={metrics.roi > 0 ? 'text-green-400' : 'text-red-400'} warn={metrics.roi <= 0} />
          </div>

          {/* Break-even */}
          <div className="bg-[#0b0c10] border border-white/8 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              {metrics.conversions >= metrics.breakEvenConv
                ? <CheckCircle className="w-4 h-4 text-green-400" />
                : <AlertCircle className="w-4 h-4 text-amber-400" />}
              <span className="text-xs font-bold text-white">Punto de Equilibrio</span>
            </div>
            <p className="text-xs text-gray-500">
              Necesitas <span className="text-white font-bold">{metrics.breakEvenConv.toFixed(1)} conversiones</span> para recuperar la inversión.
              Proyectas <span className={`font-bold ${metrics.conversions >= metrics.breakEvenConv ? 'text-green-400' : 'text-amber-400'}`}>{metrics.conversions.toFixed(1)}</span>.
              {metrics.conversions >= metrics.breakEvenConv ? ' ✅ Campaña rentable.' : ' ⚠️ Aumenta el presupuesto o mejora la landing.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
