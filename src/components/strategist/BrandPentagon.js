import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Target, Layers, MessageSquare, Users, Palette, Star,
  ChevronRight, CheckCircle, Download, Sparkles, RefreshCw, Copy
} from 'lucide-react';

const PENTAGON_STEPS = [
  {
    id: 'producto',
    step: 1,
    label: 'Producto / Servicio',
    icon: Target,
    color: 'from-blue-500/20 to-cyan-500/10',
    border: 'border-blue-500/30',
    accent: 'text-blue-400',
    description: 'Define exactamente qué vendes y cuál es tu transformación prometida',
    fields: [
      { key: 'nombre', label: 'Nombre del producto/servicio', placeholder: 'ej: Gestión de redes sociales para restaurantes' },
      { key: 'transformacion', label: '¿Qué transformación logra el cliente?', placeholder: 'ej: Pasar de 500 a 5,000 seguidores en 90 días' },
      { key: 'diferenciador', label: '¿Qué lo hace único vs. competidores?', placeholder: 'ej: Creación de contenido hiperlocal con IA' },
    ]
  },
  {
    id: 'nicho',
    step: 2,
    label: 'Nicho de Mercado',
    icon: Layers,
    color: 'from-purple-500/20 to-violet-500/10',
    border: 'border-purple-500/30',
    accent: 'text-purple-400',
    description: 'Identifica a tu cliente ideal con total precisión (entre más específico, mejor)',
    fields: [
      { key: 'segmento', label: 'Segmento principal', placeholder: 'ej: Restaurantes de comida colombiana en Miami' },
      { key: 'dolor', label: 'Mayor dolor/problema que tienen', placeholder: 'ej: No tienen tiempo ni conocimiento para las redes' },
      { key: 'deseo', label: 'Mayor deseo/aspiración', placeholder: 'ej: Tener una agenda llena sin depender del voz a voz' },
    ]
  },
  {
    id: 'tono',
    step: 3,
    label: 'Voz & Tono de Marca',
    icon: MessageSquare,
    color: 'from-green-500/20 to-emerald-500/10',
    border: 'border-green-500/30',
    accent: 'text-green-400',
    description: 'Define cómo habla tu marca: el tono emocional que usarás en todo el contenido',
    fields: [
      { key: 'personalidad', label: 'Personalidad de la marca (3 adjetivos)', placeholder: 'ej: Directa, cálida y experta' },
      { key: 'estilo', label: 'Estilo de comunicación', placeholder: 'ej: Como un amigo que sabe de marketing, sin tecnicismos' },
      { key: 'prohibido', label: '¿Qué nunca diría tu marca?', placeholder: 'ej: Nunca usa jerga vulgar ni promesas exageradas' },
    ]
  },
  {
    id: 'comunidad',
    step: 4,
    label: 'Comunidad & Relación',
    icon: Users,
    color: 'from-orange-500/20 to-amber-500/10',
    border: 'border-orange-500/30',
    accent: 'text-orange-400',
    description: 'Define cómo construyes y mantienes la relación con tu audiencia',
    fields: [
      { key: 'canal_principal', label: 'Canal principal de comunidad', placeholder: 'ej: Instagram + WhatsApp para clientes' },
      { key: 'frecuencia', label: 'Frecuencia de contenido', placeholder: 'ej: 3 posts/semana + 5 stories diarias' },
      { key: 'engagement', label: 'Táctica de engagement preferida', placeholder: 'ej: Preguntas en stories + responder todos los comentarios' },
    ]
  },
  {
    id: 'estetica',
    step: 5,
    label: 'Identidad Visual',
    icon: Palette,
    color: 'from-pink-500/20 to-rose-500/10',
    border: 'border-pink-500/30',
    accent: 'text-pink-400',
    description: 'Define los elementos visuales que dan coherencia a tu marca',
    fields: [
      { key: 'colores', label: 'Paleta de colores (hex o descripción)', placeholder: 'ej: #1A1A2E (noche), #E94560 (energía), blanco limpio' },
      { key: 'tipografia', label: 'Tipografías principales', placeholder: 'ej: Montserrat bold para títulos, Inter para textos' },
      { key: 'referencias', label: 'Marcas de referencia visual', placeholder: 'ej: Apple (minimalismo), Nike (dinamismo), Spotify (vibrante)' },
    ]
  },
];

const inputCls = "w-full bg-black/30 border border-white/8 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-white/20 placeholder-gray-700 transition-colors";

export default function BrandPentagon() {
  const [activeStep, setActiveStep] = useState(0);
  const [data, setData] = useState({});
  const [showProfile, setShowProfile] = useState(false);
  const [copied, setCopied] = useState(false);

  const set = (step, key, val) => setData(prev => ({
    ...prev, [step]: { ...prev[step], [key]: val }
  }));

  const completedSteps = PENTAGON_STEPS.filter(s => {
    const d = data[s.id] || {};
    return s.fields.every(f => d[f.key]?.trim());
  }).length;

  const generateProfile = () => {
    return PENTAGON_STEPS.map(step => {
      const d = data[step.id] || {};
      const lines = step.fields.map(f => `  • ${f.label}: ${d[f.key] || '—'}`).join('\n');
      return `▸ ${step.label.toUpperCase()}\n${lines}`;
    }).join('\n\n');
  };

  const handleDownload = () => {
    const content = `PERFIL DE MARCA — PENTÁGONO ESTRATÉGICO\nGenerado con Predix — ${new Date().toLocaleDateString('es-ES', { dateStyle: 'long' })}\n${'═'.repeat(60)}\n\n${generateProfile()}`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'perfil-de-marca-pentagono.txt'; a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generateProfile()).then(() => {
      setCopied(true); setTimeout(() => setCopied(false), 2000);
    });
  };

  const currentStep = PENTAGON_STEPS[activeStep];
  const Icon = currentStep.icon;
  const stepData = data[currentStep.id] || {};

  return (
    <div className="p-6 flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-white">Pentágono de la Marca</h3>
          <p className="text-xs text-gray-500 mt-0.5">5 dimensiones para definir una identidad de marca sólida e irrepetible</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">
            {completedSteps}/5 completo
          </span>
          {completedSteps >= 3 && (
            <button onClick={() => setShowProfile(!showProfile)} className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-500/15 hover:bg-purple-500/25 border border-purple-500/30 text-purple-300 rounded-lg text-xs font-semibold transition-all">
              <Sparkles className="w-3.5 h-3.5" /> Ver Perfil
            </button>
          )}
        </div>
      </div>

      {/* Pentagon Step Navigation */}
      <div className="grid grid-cols-5 gap-2">
        {PENTAGON_STEPS.map((s, i) => {
          const d = data[s.id] || {};
          const done = s.fields.every(f => d[f.key]?.trim());
          const SIcon = s.icon;
          return (
            <button key={s.id} onClick={() => setActiveStep(i)}
              className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all text-center ${activeStep === i ? `bg-gradient-to-br ${s.color} ${s.border}` : done ? 'bg-green-500/5 border-green-500/20' : 'bg-[#111318] border-white/8 hover:border-white/15'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${done ? 'bg-green-500/20' : 'bg-white/5'}`}>
                {done ? <CheckCircle className="w-4 h-4 text-green-400" /> : <SIcon className={`w-4 h-4 ${activeStep === i ? s.accent : 'text-gray-600'}`} />}
              </div>
              <span className={`text-[10px] font-bold leading-tight ${activeStep === i ? 'text-white' : done ? 'text-green-400' : 'text-gray-600'}`}>
                {s.step}. {s.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Current Step Fields */}
      <AnimatePresence mode="wait">
        <motion.div key={currentStep.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
          className={`bg-gradient-to-br ${currentStep.color} border ${currentStep.border} rounded-2xl p-5 flex flex-col gap-4`}>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-black/30`}>
              <Icon className={`w-5 h-5 ${currentStep.accent}`} />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">{currentStep.label}</h4>
              <p className="text-xs text-gray-400">{currentStep.description}</p>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            {currentStep.fields.map(f => (
              <div key={f.key} className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-400">{f.label}</label>
                <input value={stepData[f.key] || ''} onChange={e => set(currentStep.id, f.key, e.target.value)}
                  placeholder={f.placeholder} className={inputCls} />
              </div>
            ))}
          </div>
          <div className="flex justify-between items-center pt-2 border-t border-white/10">
            <button onClick={() => setActiveStep(s => Math.max(0, s - 1))} disabled={activeStep === 0}
              className="text-xs text-gray-500 hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
              ← Anterior
            </button>
            <span className="text-xs text-gray-600">{activeStep + 1} de {PENTAGON_STEPS.length}</span>
            <button onClick={() => setActiveStep(s => Math.min(PENTAGON_STEPS.length - 1, s + 1))} disabled={activeStep === PENTAGON_STEPS.length - 1}
              className={`text-xs font-semibold ${currentStep.accent} hover:opacity-80 transition-opacity disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1`}>
              Siguiente <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Brand Profile Preview */}
      <AnimatePresence>
        {showProfile && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="bg-[#0b0c10] border border-white/8 rounded-2xl p-5 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Star className="w-4 h-4 text-amber-400" /> Perfil de Marca Completo
              </h4>
              <div className="flex gap-2">
                <button onClick={handleCopy} className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 rounded-lg text-xs font-semibold transition-all">
                  {copied ? <><CheckCircle className="w-3.5 h-3.5 text-green-400" /> Copiado</> : <><Copy className="w-3.5 h-3.5" /> Copiar</>}
                </button>
                <button onClick={handleDownload} className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/40 text-purple-300 rounded-lg text-xs font-semibold transition-all">
                  <Download className="w-3.5 h-3.5" /> Descargar
                </button>
              </div>
            </div>
            <pre className="text-xs text-gray-400 leading-relaxed whitespace-pre-wrap font-mono overflow-y-auto max-h-80 custom-scrollbar">
              {generateProfile()}
            </pre>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
