import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calculator, TrendingUp, DollarSign, Target, Zap } from 'lucide-react';

const metricas = {
  roas: { label: 'ROAS', desc: 'Retorno sobre Inversión Publicitaria', formula: 'Ingresos / Gasto en Ads', color: 'text-emerald-400', ref: 'Bueno: 3x | Excelente: 5x+' },
  cpa: { label: 'CPA', desc: 'Costo por Adquisición/Conversión', formula: 'Gasto Ads / Número de Conversiones', color: 'text-blue-400', ref: 'Debe ser < que el valor de la venta' },
  cpm: { label: 'CPM', desc: 'Costo por 1,000 Impresiones', formula: '(Gasto / Impresiones) × 1000', color: 'text-purple-400', ref: 'Facebook: $5-$15 | TikTok: $1-$5' },
  ctr: { label: 'CTR', desc: 'Click Through Rate', formula: '(Clics / Impresiones) × 100', color: 'text-yellow-400', ref: 'Bueno: 1-2% | Excelente: 3%+' },
  cpc: { label: 'CPC', desc: 'Costo por Clic', formula: 'Gasto Total / Número de Clics', color: 'text-pink-400', ref: 'Depende del sector. Busca el mínimo posible' },
};

const AdsCalculator = () => {
  const [modo, setModo] = useState('roas');
  const [valores, setValores] = useState({
    ingresos: '', gasto: '', conversiones: '', impresiones: '', clics: ''
  });

  const setVal = (k, v) => setValores(prev => ({ ...prev, [k]: v }));
  const num = (k) => parseFloat(valores[k]) || 0;

  const calcular = () => {
    const g = num('gasto'), i = num('ingresos'), conv = num('conversiones');
    const imp = num('impresiones'), clics = num('clics');
    switch (modo) {
      case 'roas': return g > 0 ? (i / g).toFixed(2) + 'x' : null;
      case 'cpa': return conv > 0 ? '$' + (g / conv).toFixed(2) : null;
      case 'cpm': return imp > 0 ? '$' + ((g / imp) * 1000).toFixed(2) : null;
      case 'ctr': return imp > 0 ? ((clics / imp) * 100).toFixed(2) + '%' : null;
      case 'cpc': return clics > 0 ? '$' + (g / clics).toFixed(2) : null;
      default: return null;
    }
  };

  const resultado = calcular();
  const m = metricas[modo];

  const inputConfig = {
    roas: [
      { key: 'ingresos', label: 'Ingresos generados ($)', placeholder: '5000' },
      { key: 'gasto', label: 'Gasto en Ads ($)', placeholder: '1000' },
    ],
    cpa: [
      { key: 'gasto', label: 'Gasto en Ads ($)', placeholder: '500' },
      { key: 'conversiones', label: 'Número de conversiones', placeholder: '25' },
    ],
    cpm: [
      { key: 'gasto', label: 'Gasto en Ads ($)', placeholder: '200' },
      { key: 'impresiones', label: 'Impresiones totales', placeholder: '50000' },
    ],
    ctr: [
      { key: 'clics', label: 'Número de clics', placeholder: '300' },
      { key: 'impresiones', label: 'Impresiones totales', placeholder: '20000' },
    ],
    cpc: [
      { key: 'gasto', label: 'Gasto en Ads ($)', placeholder: '300' },
      { key: 'clics', label: 'Número de clics', placeholder: '150' },
    ],
  };

  const getResultadoColor = () => {
    if (!resultado) return 'text-gray-500';
    const roasVal = parseFloat(resultado);
    if (modo === 'roas') return roasVal >= 5 ? 'text-emerald-400' : roasVal >= 3 ? 'text-yellow-400' : 'text-red-400';
    return m.color;
  };

  return (
    <div className="p-6 md:p-8">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-white mb-1">Calculadora de Métricas Ads</h3>
        <p className="text-gray-400 text-sm">Calcula las métricas más importantes de tus campañas y evalúa el rendimiento real.</p>
      </div>

      {/* Selector de métrica */}
      <div className="flex gap-2 overflow-x-auto pb-1 mb-8">
        {Object.entries(metricas).map(([key, m]) => (
          <button key={key} onClick={() => setModo(key)}
            className={`flex-shrink-0 px-4 py-2.5 rounded-xl text-sm font-bold transition-all border ${
              modo === key
                ? `bg-red-500/15 border-red-500/50 ${m.color}`
                : 'bg-[#1a1d24] border-white/5 text-gray-400 hover:text-white'
            }`}>
            {m.label}
          </button>
        ))}
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Input */}
        <div className="flex-1 space-y-5">
          <div className="bg-[#1a1d24] rounded-2xl border border-white/5 p-5">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 bg-red-500/15 rounded-xl flex items-center justify-center">
                <Calculator className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <h4 className="font-bold text-white">{m.label} — {m.desc}</h4>
                <p className="text-xs text-gray-500 font-mono">{m.formula}</p>
              </div>
            </div>
            <div className="space-y-4">
              {(inputConfig[modo] || []).map(inp => (
                <div key={inp.key}>
                  <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wide">{inp.label}</label>
                  <input
                    type="number" value={valores[inp.key]} onChange={e => setVal(inp.key, e.target.value)}
                    placeholder={inp.placeholder}
                    className="w-full bg-[#111318] border border-gray-700/80 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-red-500 transition-colors"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Resultado */}
          <div className="bg-[#1a1d24] rounded-2xl border border-white/5 p-6 text-center">
            <p className="text-gray-400 text-sm mb-2">Resultado</p>
            <motion.div
              key={resultado}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className={`text-6xl font-black ${getResultadoColor()} mb-2`}
            >
              {resultado || '—'}
            </motion.div>
            <div className={`text-sm font-bold ${m.color}`}>{m.label}</div>
            <div className="mt-4 bg-[#111318] rounded-xl px-4 py-3">
              <p className="text-xs text-gray-500">📊 Referencia del sector: <span className="text-gray-300">{m.ref}</span></p>
            </div>
          </div>
        </div>

        {/* Panel de referencia - todas las métricas */}
        <div className="w-full md:w-72 space-y-3">
          <h4 className="font-bold text-white text-sm px-1">Referencia de Métricas</h4>
          {Object.entries(metricas).map(([key, m]) => (
            <div key={key} className={`bg-[#1a1d24] rounded-xl border border-white/5 p-4 ${key === modo ? 'border-red-500/30 bg-red-500/5' : ''}`}>
              <div className={`font-black text-lg ${m.color} mb-0.5`}>{m.label}</div>
              <div className="text-gray-400 text-xs mb-2">{m.desc}</div>
              <div className="font-mono text-xs text-gray-600 bg-black/20 px-2 py-1 rounded-lg mb-2">{m.formula}</div>
              <div className="text-xs text-gray-500">📊 {m.ref}</div>
            </div>
          ))}

          {/* Consejo */}
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4 text-red-400" />
              <h5 className="font-bold text-red-300 text-sm">Consejo Premium</h5>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">
              Antes de escalar tu presupuesto, asegúrate de tener un ROAS mínimo de 3x. Con ROAS de 2x o menos, estás perdiendo dinero en ads.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdsCalculator;
