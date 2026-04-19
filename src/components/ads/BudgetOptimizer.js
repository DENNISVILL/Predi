import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, TrendingUp, PieChart, Zap, AlertTriangle } from 'lucide-react';

const canales = [
  { id: 'google', label: 'Google Search', icon: '🔍', pct: 30, descripcion: 'Captura demanda existente. Ideal para conversiones directas.' },
  { id: 'meta', label: 'Meta Ads', icon: '📘', pct: 25, descripcion: 'Generación de demanda. Retargeting y audiencias lookalike.' },
  { id: 'tiktok', label: 'TikTok Ads', icon: '🎵', pct: 15, descripcion: 'Audiencia joven. Awareness y tráfico de bajo costo.' },
  { id: 'youtube', label: 'YouTube Ads', icon: '📺', pct: 15, descripcion: 'Branding en video. Audiencias de alto intento.' },
  { id: 'retargeting', label: 'Retargeting', icon: '🔄', pct: 10, descripcion: 'Recuperar visitantes que no convirtieron. El ROI más alto.' },
  { id: 'otros', label: 'Otros canales', icon: '📌', pct: 5, descripcion: 'Pinterest, LinkedIn, influencers, etc.' },
];

const colores = ['bg-blue-500', 'bg-purple-500', 'bg-pink-500', 'bg-red-500', 'bg-emerald-500', 'bg-yellow-500'];

const BudgetOptimizer = () => {
  const [presupuestoTotal, setPresupuestoTotal] = useState(1000);
  const [distribucion, setDistribucion] = useState(canales.map(c => ({ ...c })));
  const [modelo, setModelo] = useState('performance');

  const totalPct = distribucion.reduce((s, c) => s + c.pct, 0);
  const diff = 100 - totalPct;

  const updatePct = (id, valor) => {
    setDistribucion(prev => prev.map(c => c.id === id ? { ...c, pct: parseInt(valor) || 0 } : c));
  };

  const aplicarModelo = (m) => {
    setModelo(m);
    const modelos = {
      performance: [30, 25, 15, 15, 10, 5],
      branding: [10, 20, 25, 35, 5, 5],
      local: [40, 30, 5, 5, 15, 5],
      ecommerce: [25, 20, 15, 10, 20, 10],
    };
    setDistribucion(canales.map((c, i) => ({ ...c, pct: modelos[m]?.[i] ?? c.pct })));
  };

  return (
    <div className="p-6 md:p-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h3 className="text-xl font-bold text-white mb-1">Optimizador de Presupuesto</h3>
          <p className="text-gray-400 text-sm">Distribuye tu presupuesto publicitario según objetivos y metodología probada.</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Panel izquierdo */}
        <div className="flex-1 space-y-5">
          {/* Presupuesto total */}
          <div className="bg-[#1a1d24] rounded-2xl border border-white/5 p-5">
            <label className="block text-sm font-bold text-white mb-3">Presupuesto Mensual Total</label>
            <div className="flex items-center gap-3">
              <span className="text-gray-400 text-xl font-bold">$</span>
              <input
                type="number" value={presupuestoTotal} onChange={e => setPresupuestoTotal(Number(e.target.value) || 0)}
                className="flex-1 bg-[#111318] border border-gray-700/80 rounded-xl px-4 py-3 text-white text-2xl font-black focus:outline-none focus:border-red-500 transition-colors"
              />
            </div>
          </div>

          {/* Modelos preset */}
          <div className="bg-[#1a1d24] rounded-2xl border border-white/5 p-5">
            <label className="block text-sm font-bold text-white mb-3">Modelo de Distribución</label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'performance', label: '🎯 Performance', desc: 'Máx. conversiones' },
                { id: 'branding', label: '✨ Branding', desc: 'Reconocimiento marca' },
                { id: 'local', label: '📍 Negocio Local', desc: 'Tráfico geolocalizado' },
                { id: 'ecommerce', label: '🛍️ E-commerce', desc: 'Ventas online' },
              ].map(m => (
                <button key={m.id} onClick={() => aplicarModelo(m.id)}
                  className={`text-left p-3 rounded-xl border transition-all ${modelo === m.id ? 'bg-red-500/15 border-red-500/50 text-white' : 'bg-[#111318] border-white/5 text-gray-400 hover:text-white'}`}>
                  <div className="font-bold text-sm">{m.label}</div>
                  <div className="text-xs opacity-70 mt-0.5">{m.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Distribución por canal */}
          <div className="bg-[#1a1d24] rounded-2xl border border-white/5 p-5 space-y-4">
            <div className="flex justify-between items-center">
              <label className="text-sm font-bold text-white">Distribución por Canal</label>
              <div className={`text-xs font-bold px-2 py-1 rounded-lg border ${
                Math.abs(diff) < 1 ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' :
                'text-yellow-400 bg-yellow-500/10 border-yellow-500/30'
              }`}>
                {totalPct}% {Math.abs(diff) < 1 ? '✓' : `(${diff > 0 ? '+' : ''}${diff}% restante)`}
              </div>
            </div>
            {distribucion.map((canal, i) => (
              <div key={canal.id} className="space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-300">{canal.icon} {canal.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">${Math.round(presupuestoTotal * canal.pct / 100)}</span>
                    <input
                      type="number" min="0" max="100" value={canal.pct}
                      onChange={e => updatePct(canal.id, e.target.value)}
                      className="w-16 bg-[#111318] border border-gray-700/80 rounded-lg px-2 py-1 text-white text-xs text-center focus:outline-none focus:border-red-500"
                    />
                    <span className="text-xs text-gray-500">%</span>
                  </div>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-1.5">
                  <motion.div className={`h-1.5 rounded-full ${colores[i]}`}
                    animate={{ width: `${Math.min(canal.pct, 100)}%` }} transition={{ duration: 0.3 }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Panel derecho - Resumen */}
        <div className="w-full lg:w-72 space-y-4">
          {/* Resumen de inversión */}
          <div className="bg-[#1a1d24] rounded-2xl border border-white/5 p-5">
            <h4 className="font-bold text-white text-sm mb-4 flex items-center gap-2">
              <PieChart className="w-4 h-4 text-red-400" /> Resumen de Inversión
            </h4>
            <div className="space-y-3">
              {distribucion.map((canal, i) => {
                const monto = Math.round(presupuestoTotal * canal.pct / 100);
                return (
                  <div key={canal.id} className="flex items-center gap-3">
                    <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${colores[i]}`} />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs text-gray-400 truncate">{canal.label}</div>
                    </div>
                    <div className="text-sm font-bold text-white">${monto}</div>
                    <div className="text-xs text-gray-600 w-8 text-right">{canal.pct}%</div>
                  </div>
                );
              })}
            </div>
            <div className="border-t border-white/5 mt-4 pt-4 flex justify-between">
              <span className="font-bold text-white text-sm">Total mensual</span>
              <span className="font-black text-red-400 text-sm">${presupuestoTotal.toLocaleString()}</span>
            </div>
          </div>

          {/* Proyección */}
          <div className="bg-[#1a1d24] rounded-2xl border border-white/5 p-5">
            <h4 className="font-bold text-white text-sm mb-3 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" /> Proyección (ROAS 4x)
            </h4>
            <div className="space-y-2 text-sm">
              {[
                { label: 'Inversión mensual', val: `$${presupuestoTotal.toLocaleString()}`, color: 'text-gray-300' },
                { label: 'Ingresos esperados', val: `$${(presupuestoTotal * 4).toLocaleString()}`, color: 'text-emerald-400' },
                { label: 'Beneficio neto', val: `$${(presupuestoTotal * 3).toLocaleString()}`, color: 'text-emerald-400' },
                { label: 'ROI proyectado', val: '300%', color: 'text-emerald-400' },
              ].map((r, i) => (
                <div key={i} className="flex justify-between">
                  <span className="text-gray-500 text-xs">{r.label}</span>
                  <span className={`font-bold text-xs ${r.color}`}>{r.val}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Alerta */}
          {Math.abs(diff) > 5 && (
            <div className="bg-yellow-500/10 border border-yellow-500/25 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-yellow-400" />
                <span className="text-yellow-400 font-bold text-xs">Distribución incompleta</span>
              </div>
              <p className="text-gray-400 text-xs">
                Los porcentajes suman {totalPct}%. Asegúrate de que sumen exactamente 100%.
              </p>
            </div>
          )}

          {/* Tips */}
          <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-4 space-y-2">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4 text-red-400" />
              <h5 className="font-bold text-red-300 text-xs">Reglas de oro del presupuesto</h5>
            </div>
            {[
              '🎯 Retargeting siempre tiene el CPA más bajo. No lo descuides.',
              '📊 Divide el presupuesto 70% captación / 30% retención.',
              '🔄 Revisa y optimiza la distribución cada 2 semanas.',
              '⚠️ No escales sin validar un ROAS mínimo de 3x primero.',
            ].map((tip, i) => <p key={i} className="text-xs text-gray-400 leading-relaxed">{tip}</p>)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BudgetOptimizer;
