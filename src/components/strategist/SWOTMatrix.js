import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield, Zap, TrendingUp, AlertTriangle, Plus, Trash2,
  Sparkles, Download, RefreshCw, ChevronRight, Copy, CheckCircle
} from 'lucide-react';

const QUADRANTS = [
  {
    id: 'fortalezas',
    label: 'Fortalezas',
    description: 'Aspectos internos positivos que te diferencian',
    icon: Shield,
    color: 'from-green-500/20 to-emerald-500/10',
    border: 'border-green-500/30',
    accent: 'text-green-400',
    badge: 'bg-green-500/15 text-green-400 border-green-500/30',
    placeholder: 'ej: Equipo experimentado, tecnología propia, base de clientes fiel...',
  },
  {
    id: 'oportunidades',
    label: 'Oportunidades',
    description: 'Tendencias o vacíos del mercado a aprovechar',
    icon: TrendingUp,
    color: 'from-blue-500/20 to-cyan-500/10',
    border: 'border-blue-500/30',
    accent: 'text-blue-400',
    badge: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
    placeholder: 'ej: Crecimiento de TikTok, demanda de contenido local, IA accesible...',
  },
  {
    id: 'debilidades',
    label: 'Debilidades',
    description: 'Aspectos internos que debes mejorar',
    icon: AlertTriangle,
    color: 'from-amber-500/20 to-yellow-500/10',
    border: 'border-amber-500/30',
    accent: 'text-amber-400',
    badge: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    placeholder: 'ej: Falta de procesos, dependencia de un solo cliente, sin portfolio...',
  },
  {
    id: 'amenazas',
    label: 'Amenazas',
    description: 'Factores externos que pueden afectarte',
    icon: Zap,
    color: 'from-red-500/20 to-rose-500/10',
    border: 'border-red-500/30',
    accent: 'text-red-400',
    badge: 'bg-red-500/15 text-red-400 border-red-500/30',
    placeholder: 'ej: Nuevos competidores, cambios de algoritmo, crisis económica...',
  },
];

const generateStrategies = (dofa) => {
  const { fortalezas, oportunidades, debilidades, amenazas } = dofa;
  const hasF = fortalezas.some(f => f.trim());
  const hasO = oportunidades.some(o => o.trim());
  const hasD = debilidades.some(d => d.trim());
  const hasA = amenazas.some(a => a.trim());

  const strategies = [];

  if (hasF && hasO) {
    strategies.push({
      type: 'FO',
      title: 'Estrategia Ofensiva (Fortalezas + Oportunidades)',
      color: 'from-green-500/15 to-blue-500/10',
      border: 'border-green-500/25',
      accent: 'text-green-400',
      items: [
        `Usar ${fortalezas.find(f => f.trim()) || 'tu ventaja principal'} para capturar ${oportunidades.find(o => o.trim()) || 'la oportunidad de mercado'}`,
        'Desarrollar una oferta diferenciada que combine tus capacidades actuales con la tendencia identificada',
        'Escalar tu propuesta de valor hacia los segmentos de mayor crecimiento del mercado',
        'Crear alianzas estratégicas aprovechando tu reputación para acceder a nuevas oportunidades',
      ]
    });
  }

  if (hasD && hasO) {
    strategies.push({
      type: 'DO',
      title: 'Estrategia de Reorientación (Debilidades + Oportunidades)',
      color: 'from-blue-500/15 to-amber-500/10',
      border: 'border-blue-500/25',
      accent: 'text-blue-400',
      items: [
        `Superar ${debilidades.find(d => d.trim()) || 'tus limitaciones actuales'} invirtiendo en las herramientas que te permitan aprovechar ${oportunidades.find(o => o.trim()) || 'la oportunidad'}`,
        'Buscar socios o freelancers que complementen tus áreas de debilidad para capturar la oportunidad',
        'Desarrollar un plan de capacitación trimestral enfocado en las áreas críticas de crecimiento',
        'Priorizar la oportunidad más accessible y construir un caso de éxito rápidamente',
      ]
    });
  }

  if (hasF && hasA) {
    strategies.push({
      type: 'FA',
      title: 'Estrategia Defensiva (Fortalezas + Amenazas)',
      color: 'from-amber-500/15 to-red-500/10',
      border: 'border-amber-500/25',
      accent: 'text-amber-400',
      items: [
        `Usar ${fortalezas.find(f => f.trim()) || 'tu fortaleza principal'} como escudo frente a ${amenazas.find(a => a.trim()) || 'la amenaza identificada'}`,
        'Diversificar tu base de clientes para no depender de un solo segmento vulnerable',
        'Invertir en fidelización de clientes existentes como barrera de entrada ante competidores',
        'Comunicar proactivamente tu diferenciación para mantener posición frente a nuevas amenazas',
      ]
    });
  }

  if (hasD && hasA) {
    strategies.push({
      type: 'DA',
      title: 'Estrategia de Supervivencia (Debilidades + Amenazas)',
      color: 'from-red-500/15 to-gray-500/10',
      border: 'border-red-500/25',
      accent: 'text-red-400',
      items: [
        `Reducir inmediatamente el impacto de ${debilidades.find(d => d.trim()) || 'tu debilidad crítica'} para resistir ${amenazas.find(a => a.trim()) || 'la amenaza'}`,
        'Establecer un fondo de emergencia (3 meses de costos fijos) como colchón de seguridad',
        'Simplificar tu oferta de servicios y enfocarte en los más rentables y diferenciados',
        'Crear acuerdos de colaboración con pares para compartir recursos y reducir riesgos',
      ]
    });
  }

  return strategies;
};

export default function SWOTMatrix() {
  const [dofa, setDofa] = useState({
    fortalezas: ['', '', ''],
    oportunidades: ['', '', ''],
    debilidades: ['', '', ''],
    amenazas: ['', '', ''],
  });
  const [showStrategies, setShowStrategies] = useState(false);
  const [copied, setCopied] = useState(false);

  const updateItem = (quadrant, idx, val) => {
    setDofa(prev => {
      const updated = [...prev[quadrant]];
      updated[idx] = val;
      return { ...prev, [quadrant]: updated };
    });
  };

  const addItem = (quadrant) => setDofa(prev => ({ ...prev, [quadrant]: [...prev[quadrant], ''] }));
  const removeItem = (quadrant, idx) => setDofa(prev => ({ ...prev, [quadrant]: prev[quadrant].filter((_, i) => i !== idx) }));

  const strategies = generateStrategies(dofa);
  const totalItems = Object.values(dofa).flat().filter(v => v.trim()).length;

  const handleExport = () => {
    const lines = [
      '═══════════════════════════════════════════',
      '  ANÁLISIS DOFA — Generado con Predix',
      `  Fecha: ${new Date().toLocaleDateString('es-ES', { dateStyle: 'long' })}`,
      '═══════════════════════════════════════════',
      '',
      ...QUADRANTS.map(q => [
        `▸ ${q.label.toUpperCase()}`,
        ...dofa[q.id].filter(v => v.trim()).map((v, i) => `  ${i + 1}. ${v}`),
        ''
      ]).flat(),
      '',
      '═══ ESTRATEGIAS CONSECUENTES ════════════',
      '',
      ...strategies.map(s => [
        `[${s.type}] ${s.title}`,
        ...s.items.map((item, i) => `  • ${item}`),
        ''
      ]).flat()
    ].join('\n');

    const blob = new Blob([lines], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'analisis-dofa-predix.txt'; a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(document.querySelector('#dofa-strategies-output')?.innerText || '').then(() => {
      setCopied(true); setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="p-6 flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-white">Matriz DOFA Estratégica</h3>
          <p className="text-xs text-gray-500 mt-0.5">Completa cada cuadrante → la IA generará estrategias cruzadas accionables</p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${totalItems > 0 ? 'bg-green-500/10 text-green-400 border-green-500/30' : 'bg-gray-500/10 text-gray-500 border-gray-500/20'}`}>
            {totalItems} ítems
          </span>
          <button onClick={handleExport} className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 rounded-lg text-xs font-semibold transition-all">
            <Download className="w-3.5 h-3.5" /> Exportar
          </button>
        </div>
      </div>

      {/* DOFA Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {QUADRANTS.map(q => {
          const Icon = q.icon;
          return (
            <div key={q.id} className={`bg-gradient-to-br ${q.color} border ${q.border} rounded-2xl p-4 flex flex-col gap-3`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon className={`w-4 h-4 ${q.accent}`} />
                  <span className="font-bold text-white text-sm">{q.label}</span>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${q.badge}`}>
                  {dofa[q.id].filter(v => v.trim()).length} ítems
                </span>
              </div>
              <p className="text-xs text-gray-500">{q.description}</p>
              <div className="flex flex-col gap-2">
                {dofa[q.id].map((val, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className={`text-xs font-bold w-5 text-center ${q.accent} opacity-50`}>{idx + 1}</span>
                    <input
                      value={val}
                      onChange={e => updateItem(q.id, idx, e.target.value)}
                      placeholder={idx === 0 ? q.placeholder : '...'}
                      className="flex-1 bg-black/30 border border-white/8 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-white/20 placeholder-gray-700 transition-colors"
                    />
                    {dofa[q.id].length > 1 && (
                      <button onClick={() => removeItem(q.id, idx)} className="text-gray-700 hover:text-red-400 transition-colors flex-shrink-0">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <button onClick={() => addItem(q.id)} className={`flex items-center gap-1.5 text-xs font-semibold ${q.accent} opacity-70 hover:opacity-100 transition-opacity mt-1`}>
                <Plus className="w-3.5 h-3.5" /> Agregar
              </button>
            </div>
          );
        })}
      </div>

      {/* Generate Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setShowStrategies(true)}
        disabled={totalItems < 4}
        className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30 text-white font-bold text-sm hover:from-purple-500/30 hover:to-blue-500/30 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
      >
        <Sparkles className="w-5 h-5 text-purple-400" />
        Generar Estrategias Cruzadas con IA
        {totalItems < 4 && <span className="text-xs text-gray-500 font-normal">(completa al menos 4 ítems)</span>}
      </motion.button>

      {/* Strategies Output */}
      <AnimatePresence>
        {showStrategies && strategies.length > 0 && (
          <motion.div
            id="dofa-strategies-output"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex flex-col gap-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-400" />
                {strategies.length} Estrategias Consecuentes Generadas
              </h3>
              <button onClick={handleCopy} className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 rounded-lg text-xs font-semibold transition-all">
                {copied ? <><CheckCircle className="w-3.5 h-3.5 text-green-400" /> Copiado</> : <><Copy className="w-3.5 h-3.5" /> Copiar todo</>}
              </button>
            </div>
            {strategies.map(s => (
              <div key={s.type} className={`bg-gradient-to-br ${s.color} border ${s.border} rounded-2xl p-5 flex flex-col gap-3`}>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-black px-2 py-1 rounded-md bg-black/30 ${s.accent}`}>{s.type}</span>
                  <h4 className={`text-sm font-bold ${s.accent}`}>{s.title}</h4>
                </div>
                <ul className="flex flex-col gap-2">
                  {s.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-gray-300">
                      <ChevronRight className="w-3 h-3 mt-0.5 text-gray-600 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
