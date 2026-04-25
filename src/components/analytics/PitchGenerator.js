import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText, User, Globe, Target, Palette, MessageSquare,
  Download, ChevronRight, CheckCircle, Copy, Sparkles
} from 'lucide-react';

const PITCH_TYPES = [
  { id: 'digital', label: 'Agencia Digital Full', icon: '🚀' },
  { id: 'social', label: 'Social Media Management', icon: '📱' },
  { id: 'ecommerce', label: 'E-Commerce & Performance', icon: '🛒' },
  { id: 'branding', label: 'Branding & Identidad', icon: '🎨' },
  { id: 'content', label: 'Marketing de Contenidos', icon: '✍️' },
];

const OBJECTIVE_OPTIONS = [
  'Aumentar ventas online', 'Crecer seguidores orgánicos', 'Mejorar imagen de marca',
  'Lanzar un nuevo producto', 'Generar leads calificados', 'Posicionamiento SEO',
  'Aumentar tráfico web', 'Fidelización de clientes',
];

const BUDGET_RANGES = ['< $500/mes', '$500 - $1,000/mes', '$1,000 - $3,000/mes', '$3,000 - $5,000/mes', '$5,000+/mes'];

const PLATFORM_OPTIONS = ['Instagram', 'TikTok', 'Facebook', 'LinkedIn', 'YouTube', 'Twitter/X', 'Pinterest', 'WhatsApp'];

const steps = [
  { id: 0, label: 'Tipo de Pitch' },
  { id: 1, label: 'Datos del Cliente' },
  { id: 2, label: 'Objetivos & Budget' },
  { id: 3, label: 'Plataformas & Alcance' },
  { id: 4, label: 'Propuesta Generada' },
];

const inputCls = "w-full bg-[#0b0c10] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-orange-500/50 placeholder-gray-600 transition-colors resize-none";

function Section({ title, children }) {
  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">{title}</h3>
      {children}
    </div>
  );
}

export default function PitchGenerator() {
  const [step, setStep] = useState(0);
  const [copied, setCopied] = useState(false);
  const [form, setForm] = useState({
    pitchType: '',
    clientName: '',
    clientIndustry: '',
    clientWebsite: '',
    clientProblem: '',
    objectives: [],
    budgetRange: '',
    timeline: '3 meses',
    platforms: [],
    audienceSize: '',
    differentiator: '',
    caseStudy: '',
  });

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));
  const toggle = (key, val) => set(key, form[key].includes(val) ? form[key].filter(v => v !== val) : [...form[key], val]);

  const canNext = [
    form.pitchType,
    form.clientName && form.clientIndustry && form.clientProblem,
    form.objectives.length > 0 && form.budgetRange,
    form.platforms.length > 0,
    true
  ][step];

  const generatePitch = () => {
    const type = PITCH_TYPES.find(t => t.id === form.pitchType);
    return `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 PROPUESTA COMERCIAL — ${type?.label?.toUpperCase() || 'SERVICIOS DIGITALES'}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PREPARADO PARA: ${form.clientName}
INDUSTRIA: ${form.clientIndustry}
FECHA: ${new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}

━━━ 1. DIAGNÓSTICO INICIAL ━━━━━━━━━━━━━━━━━━━━━━━

Tras analizar su presencia digital actual, identificamos el siguiente desafío central:

"${form.clientProblem}"

Este es un punto crítico que, si se aborda estratégicamente con las herramientas correctas, puede convertirse en la mayor ventaja competitiva de ${form.clientName} en su sector.

━━━ 2. OBJETIVOS ESTRATÉGICOS ━━━━━━━━━━━━━━━━━━━━

Los objetivos que guiarán nuestra estrategia son:
${form.objectives.map((o, i) => `  ${i + 1}. ${o}`).join('\n')}

━━━ 3. PLATAFORMAS DE INTERVENCIÓN ━━━━━━━━━━━━━━━

Concentraremos los esfuerzos en:
${form.platforms.map(p => `  • ${p}`).join('\n')}

Estas plataformas fueron seleccionadas estratégicamente basándonos en el perfil de audiencia de ${form.clientIndustry} y el comportamiento digital del buyer persona objetivo.

━━━ 4. NUESTRA PROPUESTA DE VALOR ━━━━━━━━━━━━━━━

${form.differentiator || 'Ofrecemos un servicio de gestión de marketing digital integral, con reporting transparente, reuniones quincenales de seguimiento y optimización continua basada en datos reales.'}

━━━ 5. MARCO DE TIEMPO & INVERSIÓN ━━━━━━━━━━━━━━━

📅 Período inicial: ${form.timeline}
💰 Inversión mensual: ${form.budgetRange}
📊 KPIs de seguimiento: Alcance, Engagement Rate, CPL, ROAS, Conversiones

━━━ 6. PRÓXIMOS PASOS ━━━━━━━━━━━━━━━━━━━━━━━━━━━

  ✅ Paso 1: Aprobación de propuesta y firma de contrato
  ✅ Paso 2: Onboarding y accesos a plataformas (Día 1-3)
  ✅ Paso 3: Auditoría de presencia digital actual (Día 4-7)
  ✅ Paso 4: Presentación de estrategia de contenidos (Día 8-14)
  ✅ Paso 5: Inicio de publicaciones y primera ronda de reportes (Día 15+)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Este documento es confidencial y está preparado exclusivamente para ${form.clientName}.
Generado con Predix — La plataforma de Marketing Intelligence.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatePitch()).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleDownload = () => {
    const blob = new Blob([generatePitch()], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `propuesta-${form.clientName?.toLowerCase().replace(/\s+/g, '-') || 'cliente'}.txt`;
    a.click(); URL.revokeObjectURL(url);
  };

  const ToggleChip = ({ label, active, onClick }) => (
    <button onClick={onClick}
      className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${active ? 'bg-orange-500/20 border-orange-500/50 text-orange-300' : 'bg-[#111318] border-white/8 text-gray-500 hover:text-white hover:border-white/20'}`}>
      {label}
    </button>
  );

  return (
    <div className="p-6 flex flex-col gap-6">

      {/* Stepper */}
      <div className="flex items-center gap-0 overflow-x-auto">
        {steps.map((s, i) => (
          <React.Fragment key={s.id}>
            <button onClick={() => step > i && setStep(i)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all
                ${step === i ? 'bg-orange-500/20 text-orange-300' : step > i ? 'text-green-400 cursor-pointer' : 'text-gray-600 cursor-default'}`}>
              {step > i ? <CheckCircle className="w-3.5 h-3.5" /> : <span className="w-4 h-4 rounded-full border border-current flex items-center justify-center text-[10px]">{i + 1}</span>}
              {s.label}
            </button>
            {i < steps.length - 1 && <ChevronRight className="w-3 h-3 text-gray-700 flex-shrink-0" />}
          </React.Fragment>
        ))}
      </div>

      {/* Step Content */}
      <AnimatePresence mode="wait">
        {step === 0 && (
          <motion.div key="s0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <Section title="¿Qué tipo de propuesta vas a presentar?">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {PITCH_TYPES.map(t => (
                  <button key={t.id} onClick={() => set('pitchType', t.id)}
                    className={`flex items-center gap-3 p-4 rounded-xl border text-left transition-all ${form.pitchType === t.id ? 'bg-orange-500/15 border-orange-500/50 text-white' : 'bg-[#111318] border-white/8 text-gray-400 hover:text-white hover:border-white/15'}`}>
                    <span className="text-2xl">{t.icon}</span>
                    <span className="font-semibold text-sm">{t.label}</span>
                    {form.pitchType === t.id && <CheckCircle className="w-4 h-4 text-orange-400 ml-auto" />}
                  </button>
                ))}
              </div>
            </Section>
          </motion.div>
        )}

        {step === 1 && (
          <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col gap-4">
            <Section title="Datos del Cliente">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input placeholder="Nombre del cliente / empresa *" value={form.clientName} onChange={e => set('clientName', e.target.value)} className={inputCls} />
                <input placeholder="Industria (ej: Fitness, Gastronomía) *" value={form.clientIndustry} onChange={e => set('clientIndustry', e.target.value)} className={inputCls} />
                <input placeholder="Sitio web (opcional)" value={form.clientWebsite} onChange={e => set('clientWebsite', e.target.value)} className={`${inputCls} md:col-span-2`} />
              </div>
              <textarea rows={3} placeholder="¿Cuál es el principal problema o dolor del cliente que debes resolver? *" value={form.clientProblem} onChange={e => set('clientProblem', e.target.value)} className={inputCls} />
            </Section>
            <Section title="Diferenciador de tu propuesta">
              <textarea rows={3} placeholder="¿Qué te hace diferente a otras agencias? (tus resultados, metodología, garantías...)" value={form.differentiator} onChange={e => set('differentiator', e.target.value)} className={inputCls} />
            </Section>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col gap-5">
            <Section title="Objetivos del Cliente (selecciona todos los que apliquen) *">
              <div className="flex flex-wrap gap-2">
                {OBJECTIVE_OPTIONS.map(o => (
                  <ToggleChip key={o} label={o} active={form.objectives.includes(o)} onClick={() => toggle('objectives', o)} />
                ))}
              </div>
            </Section>
            <Section title="Rango de Inversión Mensual *">
              <div className="flex flex-wrap gap-2">
                {BUDGET_RANGES.map(b => (
                  <ToggleChip key={b} label={b} active={form.budgetRange === b} onClick={() => set('budgetRange', b)} />
                ))}
              </div>
            </Section>
            <Section title="Duración del contrato inicial">
              <div className="flex flex-wrap gap-2">
                {['1 mes (prueba)', '3 meses', '6 meses', '12 meses (anual)'].map(t => (
                  <ToggleChip key={t} label={t} active={form.timeline === t} onClick={() => set('timeline', t)} />
                ))}
              </div>
            </Section>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div key="s3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col gap-5">
            <Section title="Plataformas de Intervención *">
              <div className="flex flex-wrap gap-2">
                {PLATFORM_OPTIONS.map(p => (
                  <ToggleChip key={p} label={p} active={form.platforms.includes(p)} onClick={() => toggle('platforms', p)} />
                ))}
              </div>
            </Section>
          </motion.div>
        )}

        {step === 4 && (
          <motion.div key="s4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-orange-400" />
                <h3 className="text-sm font-bold text-white">Propuesta Generada</h3>
              </div>
              <div className="flex gap-2">
                <button onClick={handleCopy} className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 rounded-lg text-xs font-semibold transition-all">
                  {copied ? <><CheckCircle className="w-3.5 h-3.5 text-green-400" /> Copiado</> : <><Copy className="w-3.5 h-3.5" /> Copiar</>}
                </button>
                <button onClick={handleDownload} className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-500/20 hover:bg-orange-500/30 border border-orange-500/40 text-orange-300 rounded-lg text-xs font-semibold transition-all">
                  <Download className="w-3.5 h-3.5" /> Descargar .txt
                </button>
              </div>
            </div>
            <pre className="bg-[#0b0c10] border border-white/8 rounded-xl p-5 text-xs text-gray-300 leading-relaxed whitespace-pre-wrap font-mono overflow-y-auto max-h-[500px] custom-scrollbar">
              {generatePitch()}
            </pre>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex justify-between pt-2 border-t border-white/5">
        <button onClick={() => setStep(s => Math.max(0, s - 1))} disabled={step === 0}
          className="px-5 py-2.5 rounded-xl text-sm font-semibold text-gray-400 hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
          ← Atrás
        </button>
        {step < 4 ? (
          <button onClick={() => setStep(s => s + 1)} disabled={!canNext}
            className="px-6 py-2.5 rounded-xl text-sm font-bold bg-orange-500/20 hover:bg-orange-500/30 border border-orange-500/40 text-orange-300 transition-all disabled:opacity-30 disabled:cursor-not-allowed">
            Continuar →
          </button>
        ) : (
          <button onClick={() => { setStep(0); setForm({ pitchType: '', clientName: '', clientIndustry: '', clientWebsite: '', clientProblem: '', objectives: [], budgetRange: '', timeline: '3 meses', platforms: [], audienceSize: '', differentiator: '', caseStudy: '' }); }}
            className="px-6 py-2.5 rounded-xl text-sm font-bold bg-green-500/20 hover:bg-green-500/30 border border-green-500/40 text-green-300 transition-all">
            Nueva Propuesta
          </button>
        )}
      </div>
    </div>
  );
}
