// ═══════════════════════════════════════════════════════════════
// EMAIL & FUNNELS — Panel Unificado
// Fusión: WhatsApp Secuencias + Mapa de Embudo + Secuencias Email + Lead Scoring
// Flujo: Mapea Embudo → Secuencias WhatsApp → Email Automático → Lead Scoring
// ═══════════════════════════════════════════════════════════════
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail, MessageSquare, Layers, BarChart2, Sparkles, CheckCircle,
  Copy, Download, Clock, TrendingUp, Zap, ChevronRight,
  ArrowRight, MailOpen, MousePointer, Globe, Flame, Target, Award
} from 'lucide-react';

// ── DATA ─────────────────────────────────────────────────────────
const FUNNEL_STAGES = [
  { id: 'tofu',  label: 'TOFU — Atención',     emoji: '👀', desc: 'El prospecto descubre tu marca por primera vez.', color: 'border-blue-500/40 bg-blue-500/8',   textColor: 'text-blue-400',    tactics: ['Reel viral', 'Post educativo', 'Anuncio de reconocimiento', 'SEO orgánico'], kpi: 'Alcance, Impresiones, CPC' },
  { id: 'mofu',  label: 'MOFU — Interés',      emoji: '💡', desc: 'Evalúa opciones. Quiere más información.', color: 'border-violet-500/40 bg-violet-500/8', textColor: 'text-violet-400',  tactics: ['Lead magnet', 'Webinar gratuito', 'Caso de éxito', 'Email de bienvenida'], kpi: 'CTR, Leads, Costo por Lead' },
  { id: 'bofu',  label: 'BOFU — Decisión',     emoji: '🎯', desc: 'Listo para comprar. Necesita el empujón final.', color: 'border-amber-500/40 bg-amber-500/8',   textColor: 'text-amber-400',   tactics: ['Demo / Llamada', 'Descuento limitado', 'Testimonios', 'Urgencia real'], kpi: 'CVR, ROAS, CAC' },
  { id: 'ret',   label: 'RETENCIÓN',            emoji: '🔁', desc: 'Cliente activo. Maximizar LTV.',           color: 'border-emerald-500/40 bg-emerald-500/8', textColor: 'text-emerald-400', tactics: ['Upsell / Cross-sell', 'Email post-compra', 'Programa de referidos', 'Soporte VIP'], kpi: 'LTV, NPS, Churn Rate' },
];

const WA_SEQUENCES = {
  prospecto_frio: {
    label: 'Prospecto Frío',
    msgs: [
      { moment: 'Mensaje 1 — Conexión inicial', delay: 'Enviar inmediatamente', tpl: (d) => `¡Hola ${d.nombre || '[Nombre]'}! 👋\n\nVi tu trabajo en ${d.plataforma || 'Instagram'} y me pareció increíble lo que haces con ${d.nicho || 'tu negocio'}.\n\nTe escribo porque trabajo con ${d.business || 'negocios como el tuyo'} ayudándoles a lograr [transformación concreta].\n\n¿Tienes 5 minutos esta semana para conversar?` },
      { moment: 'Mensaje 2 — Seguimiento con valor', delay: '48 horas después (sin respuesta)', tpl: (d) => `Hola ${d.nombre || '[Nombre]'}, sé que estás ocupado/a.\n\nTe dejo algo útil 👇\n\n[Tip concreto sobre ${d.nicho || 'su sector'}]\n\nSin compromiso. Solo quería aportar valor antes de hablar de trabajo. 😊` },
      { moment: 'Mensaje 3 — Cierre directo', delay: '4 días después (último intento)', tpl: (d) => `${d.nombre || '[Nombre]'}, este es mi último mensaje.\n\nEntiendo que quizás no es el momento — está perfectamente bien.\n\nSi algún día quieres escalar ${d.nicho || 'tu negocio'} con estrategias probadas, aquí estaré.\n\n¡Mucho éxito! 🚀` },
    ]
  },
  lead_interesado: {
    label: 'Lead con Interés',
    msgs: [
      { moment: 'Mensaje 1 — Respuesta rápida', delay: 'Dentro de los primeros 15 min', tpl: (d) => `¡Hola ${d.nombre || '[Nombre]'}! 🙌\n\nQué bueno que te interesó. Cuéntame: ¿a qué se dedica tu negocio de ${d.nicho || '[nicho]'} actualmente?\n\nQuiero entender bien tu situación antes de recomendarte algo. 🎯` },
      { moment: 'Mensaje 2 — Solución personalizada', delay: 'Tras escuchar su respuesta', tpl: (d) => `Perfecto, gracias por contarme.\n\nBasándome en lo que me dices, lo que más te ayudaría es [${d.servicio || 'tu servicio'}].\n\nHemos logrado que negocios similares pasen de [resultado A] a [resultado B] en [tiempo].\n\n¿Quieres que te muestre cómo funcionaría para ${d.business || 'tu negocio'}?` },
      { moment: 'Mensaje 3 — Manejo objeción precio', delay: 'Si pregunta el precio primero', tpl: (d) => `Entiendo que el precio importa.\n\nAntes de darte un número: si logramos [resultado principal], ¿cuánto vale eso mensualmente para tu negocio?\n\nLa inversión es [tu tarifa]. Pero el valor que genera es 3-5x mayor.\n\n¿Seguimos conversando?` },
      { moment: 'Mensaje 4 — Cierre con urgencia', delay: '24-48h después de cotizar', tpl: (d) => `${d.nombre || '[Nombre]'}, para que sepas: estoy abriendo 2 espacios nuevos este mes.\n\nSi decidiste avanzar, podemos empezar el lunes. Si necesitas más tiempo, también está bien.\n\n¿Qué decidiste? 😊` },
    ]
  },
  reactivacion: {
    label: 'Reactivación de Cliente',
    msgs: [
      { moment: 'Mensaje 1 — Reenganche emocional', delay: 'Primer contacto', tpl: (d) => `¡Hola ${d.nombre || '[Nombre]'}! ¿Cómo has estado?\n\nHan pasado ${d.tiempo || 'varios meses'} desde que trabajamos juntos y siempre pensé en cómo te fue con lo que implementamos.\n\n¿Lograste los resultados que buscabas? 🙏` },
      { moment: 'Mensaje 2 — Nueva propuesta', delay: '2-3 días después', tpl: (d) => `Por cierto, desde que trabajamos juntos lanzamos algo nuevo que creo te serviría mucho:\n\n[Nuevo servicio]: [Beneficio principal]\n\nYa lo tienen otros ${d.business || 'negocios similares'} con muy buenos resultados.\n\n¿Te cuento más?` },
    ]
  }
};

const EMAIL_SEQUENCES = [
  { id: 'bienvenida', label: '📩 Bienvenida (5 emails)', desc: 'Convierte nuevos suscriptores en clientes', steps: [
    { day: 'Día 0 (inmediato)', subject: 'Bienvenido/a — Tu [Lead Magnet] está aquí', tip: 'Entrega el lead magnet de inmediato. Incluye 1 sola CTA: consumir el recurso.' },
    { day: 'Día 2', subject: '¿Pudiste revisar [Lead Magnet]?', tip: 'Refuerza el valor entregado. Comparte un caso de éxito real o un dato sorprendente.' },
    { day: 'Día 4', subject: 'El error más común en [tema]', tip: 'Contenido educativo puro. Genera confianza antes de vender.' },
    { day: 'Día 6', subject: 'Cómo logramos [resultado] para [cliente]', tip: 'Case study detallado. Primera mención de tu servicio de forma suave.' },
    { day: 'Día 8', subject: 'Te tengo una propuesta especial', tip: 'Oferta de entrada (tripwire). Precio bajo, bajo riesgo, alta percepción de valor.' },
  ]},
  { id: 'abandono', label: '🛒 Carrito Abandonado (3 emails)', desc: 'Recupera el 15-20% de ventas perdidas', steps: [
    { day: '1 hora después', subject: '¿Olvidaste algo? Tu [producto] espera', tip: 'Recordatorio suave. Incluye imagen del producto y botón de compra directo.' },
    { day: '24 horas después', subject: 'Tu [producto] tiene lista de espera', tip: 'Introduce escasez real (si existe). Añade testimonios y preguntas frecuentes.' },
    { day: '72 horas después', subject: 'Última oportunidad — Oferta exclusiva', tip: 'Descuento del 10-15% o un bonus. Urgencia máxima: expira en 24h.' },
  ]},
  { id: 'nurturing', label: '🌱 Nurturing B2B (7 emails)', desc: 'Educa y convierte prospectos fríos', steps: [
    { day: 'Semana 1', subject: 'El problema real que nadie habla sobre [sector]', tip: 'Agita el dolor. Nada de soluciones aún.' },
    { day: 'Semana 2', subject: '3 formas de resolver [problema]', tip: 'Presenta opciones — tu servicio es una de ellas, pero no la única.' },
    { day: 'Semana 3', subject: 'Caso real: cómo [empresa similar] lo resolvió', tip: 'Prueba social específica. Datos concretos.' },
    { day: 'Semana 4', subject: '¿Cuánto te cuesta no resolver esto?', tip: 'Calcula el costo de la inacción. Urgencia desde el dolor.' },
    { day: 'Semana 5', subject: 'Cómo trabajamos con [tipo de empresa]', tip: 'Presenta tu proceso paso a paso. Desmitifica la compra.' },
    { day: 'Semana 6', subject: 'Mis clientes responden tus preguntas frecuentes', tip: 'Manejo de objeciones a través de testimonios y Q&A.' },
    { day: 'Semana 7', subject: 'Abrimos 3 nuevos cupos este mes', tip: 'CTA final. Escasez genuina. Link directo a agendar llamada.' },
  ]}
];

const SCORING_RULES = [
  { accion: 'Abre un email', pts: 1, icon: MailOpen, color: 'text-blue-400' },
  { accion: 'Clic en enlace de email', pts: 3, icon: MousePointer, color: 'text-indigo-400' },
  { accion: 'Visita página de precios', pts: 5, icon: Globe, color: 'text-purple-400' },
  { accion: 'Descarga lead magnet', pts: 10, icon: TrendingUp, color: 'text-emerald-400' },
  { accion: 'Asiste a webinar', pts: 20, icon: Target, color: 'text-amber-400' },
  { accion: 'Abandona carrito', pts: 15, icon: Flame, color: 'text-orange-400' },
  { accion: 'Se da de baja / Rebote', pts: -50, icon: Award, color: 'text-red-400' },
];

const SCORE_LEVELS = [
  { rango: '0-19', label: 'Frío', emoji: '🧊', color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/25', action: 'Nutrición (MOFU) — Enviar contenido educativo y casos de éxito.' },
  { rango: '20-49', label: 'Tibio', emoji: '☀️', color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/25', action: 'Activación (BOFU) — Enviar ofertas iniciales o lead magnets avanzados.' },
  { rango: '50+', label: 'Caliente', emoji: '🔥', color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/25', action: 'Venta Directa — Contactar por ventas, ofrecer demo o descuento.' },
];

const EXAMPLE_LEADS = [
  { id: 1, nombre: 'Ana García', email: 'ana@empresa.com', score: 65, ultimo: 'Visita página de precios' },
  { id: 2, nombre: 'Carlos López', email: 'carlos@startup.io', score: 35, ultimo: 'Descarga ebook' },
  { id: 3, nombre: 'Laura Martínez', email: 'laura@gmail.com', score: 12, ultimo: 'Abre email de bienvenida' },
  { id: 4, nombre: 'David Ruiz', email: 'david@agencia.com', score: 85, ultimo: 'Abandona carrito' },
];

const ECard = ({ step, title, subtitle, badge, badgeColor, action, children }) => (
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

const EDivider = () => (
  <div className="flex items-center gap-4">
    <div className="flex-1 h-px bg-white/5" />
    <ChevronRight className="w-4 h-4 text-gray-700" />
    <div className="flex-1 h-px bg-white/5" />
  </div>
);

// ═══════════════════════════════════════════════════════════════
export default function EmailFunnelModule() {
  // Funnel map
  const [expandedStage, setExpandedStage] = useState(null);

  // WhatsApp
  const [waSeq, setWaSeq]         = useState('prospecto_frio');
  const [waData, setWaData]       = useState({ nombre: '', plataforma: 'Instagram', nicho: '', business: '', servicio: '', tiempo: '3 meses' });
  const [copiedIdx, setCopiedIdx] = useState(null);
  const [showPrinciples, setShowP] = useState(false);

  // Email sequences
  const [emailSeq, setEmailSeq]   = useState('bienvenida');
  const [expandedEmail, setExpandedEmail] = useState(null);

  // Lead Scoring
  const [score, setScore]         = useState(0);

  const setWD = (k, v) => setWaData(d => ({ ...d, [k]: v }));
  const copyMsg = (idx, text) => { navigator.clipboard.writeText(text); setCopiedIdx(idx); setTimeout(() => setCopiedIdx(null), 2000); };

  const curSeq  = WA_SEQUENCES[waSeq];
  const curEmail = EMAIL_SEQUENCES.find(e => e.id === emailSeq);
  const curLevel = score >= 50 ? SCORE_LEVELS[2] : score >= 20 ? SCORE_LEVELS[1] : SCORE_LEVELS[0];

  const downloadWA = () => {
    const all = curSeq.msgs.map((m, i) => `══ ${m.moment} ══\n🕐 ${m.delay}\n\n${m.tpl(waData)}`).join('\n\n' + '─'.repeat(40) + '\n\n');
    const blob = new Blob([`SECUENCIA WHATSAPP — ${curSeq.label}\nPredix Agency OS\n\n${all}`], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `secuencia-${waSeq}.txt`; a.click();
    URL.revokeObjectURL(url);
  };

  const inputCls = "w-full bg-[#0b0c10] border border-white/10 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-violet-500/50 placeholder-gray-700 transition-colors";

  return (
    <div className="w-full flex flex-col gap-6 pb-20 md:pb-0">

      {/* ══ HERO ══ */}
      <div className="bg-gradient-to-r from-violet-950/60 to-purple-950/50 border border-violet-500/20 rounded-2xl px-6 py-5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-violet-500/6 rounded-full blur-[100px] pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-violet-500/20 border border-violet-500/30 rounded-full mb-3">
              <div className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
              <span className="text-xs font-bold text-violet-300">✦ Email Marketing & Automatización</span>
            </div>
            <h1 className="text-2xl font-black text-white flex items-center gap-2 mb-1">
              <Mail className="w-6 h-6 text-violet-400" /> Email & Funnels
            </h1>
            <p className="text-violet-200/60 text-sm">Mapa de Embudo → Secuencias WhatsApp → Email Automático → Lead Scoring</p>
          </div>
          <div className="flex gap-3 flex-shrink-0">
            {[
              { label: 'Etapas Funnel', value: FUNNEL_STAGES.length, color: 'text-violet-400' },
              { label: 'Seq. WhatsApp', value: Object.keys(WA_SEQUENCES).length, color: 'text-green-400' },
              { label: 'Seq. Email', value: EMAIL_SEQUENCES.length, color: 'text-blue-400' },
            ].map((s, i) => (
              <div key={i} className="bg-black/30 border border-white/8 rounded-xl px-4 py-2.5 text-center min-w-[80px]">
                <div className={`text-xl font-black ${s.color}`}>{s.value}</div>
                <div className="text-[10px] text-gray-500 mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ══ SECCIÓN 01: MAPA DE EMBUDO ══ */}
      <ECard step="01" title="Mapa de Embudo de Ventas" subtitle="Entiende en qué etapa está cada lead y qué tácticas aplicar para empujarlo a la siguiente."
        badge="Funnel" badgeColor="bg-violet-500/15 border-violet-500/30 text-violet-300">
        <div className="flex flex-col gap-3">
          {FUNNEL_STAGES.map((stage, i) => (
            <motion.div key={stage.id} layout>
              <button onClick={() => setExpandedStage(expandedStage === stage.id ? null : stage.id)}
                className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl border transition-all text-left ${expandedStage === stage.id ? `${stage.color} ${stage.textColor.replace('text-','border-')}/50` : 'bg-[#111318] border-white/6 hover:border-white/15'}`}>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-2xl ${expandedStage === stage.id ? 'bg-white/10' : 'bg-white/5'}`}>
                  {stage.emoji}
                </div>
                <div className="flex-1 text-left">
                  <div className={`text-sm font-bold ${expandedStage === stage.id ? 'text-white' : 'text-gray-300'}`}>{stage.label}</div>
                  <div className="text-xs text-gray-500">{stage.desc}</div>
                </div>
                <div className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${stage.color} ${stage.textColor}`}>{stage.kpi.split(',')[0]}</div>
                <ChevronRight className={`w-4 h-4 text-gray-600 transition-transform flex-shrink-0 ${expandedStage === stage.id ? 'rotate-90' : ''}`} />
              </button>
              <AnimatePresence>
                {expandedStage === stage.id && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                    <div className={`mx-2 ${stage.color} border rounded-b-2xl p-4 -mt-0.5 border-t-0`}>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Tácticas recomendadas</p>
                          <div className="space-y-1.5">
                            {stage.tactics.map((t, ti) => (
                              <div key={ti} className="flex items-center gap-2">
                                <CheckCircle className={`w-3.5 h-3.5 flex-shrink-0 ${stage.textColor}`} />
                                <span className="text-xs text-gray-300">{t}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">KPIs a medir</p>
                          <div className="flex flex-wrap gap-2">
                            {stage.kpi.split(',').map((k, ki) => (
                              <span key={ki} className={`text-xs font-bold px-2 py-1 rounded-lg bg-black/20 ${stage.textColor}`}>{k.trim()}</span>
                            ))}
                          </div>
                          {i < FUNNEL_STAGES.length - 1 && (
                            <div className="mt-3 flex items-center gap-2 text-xs text-gray-600">
                              <ArrowRight className="w-3 h-3" /> Siguiente etapa: <span className="text-gray-400 font-bold">{FUNNEL_STAGES[i + 1].label}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </ECard>

      <EDivider />

      {/* ══ SECCIÓN 02: SECUENCIAS WHATSAPP ══ */}
      <ECard step="02" title="Secuencias de WhatsApp" subtitle="Guiones de venta personalizables basados en principios de persuasión científica para cada tipo de lead."
        badge="WhatsApp" badgeColor="bg-green-500/15 border-green-500/30 text-green-300"
        action={
          <div className="flex gap-2">
            <button onClick={() => setShowP(!showPrinciples)} className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 text-amber-400 rounded-lg text-xs font-semibold transition-all">
              <Sparkles className="w-3.5 h-3.5" /> 6 Principios
            </button>
            <button onClick={downloadWA} className="flex items-center gap-1.5 px-3 py-1.5 bg-green-500/15 hover:bg-green-500/25 border border-green-500/30 text-green-300 rounded-lg text-xs font-semibold transition-all">
              <Download className="w-3.5 h-3.5" /> Descargar
            </button>
          </div>
        }
      >
        {/* Principios Cialdini */}
        <AnimatePresence>
          {showPrinciples && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden mb-4">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 pb-1">
                {[
                  { l: '🎁 Reciprocidad', d: 'Da primero: consejo, recurso gratis, auditoría. Quien recibe quiere devolver.', t: '"Aquí un análisis rápido de tu perfil, sin costo."' },
                  { l: '⏳ Escasez', d: 'Lo limitado se percibe como más valioso. Cupos, tiempos, ediciones especiales.', t: '"Solo 2 espacios disponibles este mes."' },
                  { l: '🏆 Autoridad', d: 'La gente sigue a expertos. Comparte casos de éxito y resultados concretos.', t: 'Incluye un resultado real antes de proponer.' },
                  { l: '👥 Prueba Social', d: 'Si otros lo hacen, debe ser correcto. Testimonios y nombres de clientes.', t: '"12 restaurantes en tu ciudad usan esta estrategia."' },
                  { l: '❤️ Simpatía', d: 'Compramos a quienes nos caen bien. Construye rapport antes del pitch.', t: 'Menciona algo específico de su contenido.' },
                  { l: '🤝 Compromiso', d: 'El sí pequeño lleva al sí grande. Empieza con preguntas de bajo fricción.', t: '"¿Te hago una pregunta rápida?" antes del pitch.' },
                ].map((p, i) => (
                  <div key={i} className="bg-[#111318] border border-amber-500/15 rounded-xl p-3">
                    <div className="text-xs font-bold text-white mb-1">{p.l}</div>
                    <p className="text-[11px] text-gray-400 mb-2">{p.d}</p>
                    <div className="flex items-start gap-1 bg-amber-500/5 rounded-lg p-2 border border-amber-500/10">
                      <Sparkles className="w-3 h-3 text-amber-400 flex-shrink-0 mt-0.5" />
                      <p className="text-[10px] text-amber-300 italic">{p.t}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Selector secuencia */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          {Object.entries(WA_SEQUENCES).map(([key, s]) => (
            <button key={key} onClick={() => setWaSeq(key)}
              className={`px-3 py-3 rounded-xl border text-sm font-semibold transition-all text-left ${waSeq === key ? 'bg-green-500/15 border-green-500/40 text-white' : 'bg-[#111318] border-white/6 text-gray-500 hover:text-white'}`}>
              {s.label}
            </button>
          ))}
        </div>

        {/* Personalización */}
        <div className="bg-[#111318] border border-white/6 rounded-xl p-4 mb-4">
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">Personaliza los mensajes</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            <input value={waData.nombre} onChange={e => setWD('nombre', e.target.value)} placeholder="Nombre del contacto" className={inputCls} />
            <input value={waData.nicho} onChange={e => setWD('nicho', e.target.value)} placeholder="Nicho (ej: Fitness)" className={inputCls} />
            <input value={waData.business} onChange={e => setWD('business', e.target.value)} placeholder="Tipo de negocio" className={inputCls} />
            <input value={waData.servicio} onChange={e => setWD('servicio', e.target.value)} placeholder="Tu servicio" className={inputCls} />
            <input value={waData.plataforma} onChange={e => setWD('plataforma', e.target.value)} placeholder="Plataforma" className={inputCls} />
            {waSeq === 'reactivacion' && <input value={waData.tiempo} onChange={e => setWD('tiempo', e.target.value)} placeholder="Tiempo inactivo" className={inputCls} />}
          </div>
        </div>

        {/* Mensajes */}
        <div className="flex flex-col gap-3">
          {curSeq.msgs.map((msg, i) => {
            const text = msg.tpl(waData);
            return (
              <div key={i} className="bg-[#0e1117] border border-white/5 rounded-xl overflow-hidden">
                <div className="flex items-center justify-between px-5 py-3 border-b border-white/5 bg-[#111318]">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-green-500/20 text-green-400 text-xs font-black flex items-center justify-center">{i + 1}</span>
                    <div>
                      <p className="text-xs font-bold text-white">{msg.moment}</p>
                      <p className="text-[10px] text-gray-500 flex items-center gap-1"><Clock className="w-3 h-3" />{msg.delay}</p>
                    </div>
                  </div>
                  <button onClick={() => copyMsg(i, text)} className="flex items-center gap-1.5 px-2.5 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-400 rounded-lg text-xs font-semibold transition-all">
                    {copiedIdx === i ? <><CheckCircle className="w-3 h-3 text-green-400" />Copiado</> : <><Copy className="w-3 h-3" />Copiar</>}
                  </button>
                </div>
                <pre className="p-5 text-xs text-gray-300 leading-relaxed whitespace-pre-wrap font-sans">{text}</pre>
              </div>
            );
          })}
        </div>
      </ECard>

      <EDivider />

      {/* ══ SECCIÓN 03: SECUENCIAS DE EMAIL ══ */}
      <ECard step="03" title="Secuencias de Email Automático" subtitle="Flujos probados para nutrir tus leads desde suscriptor hasta cliente pagante de forma automatizada."
        badge="Email" badgeColor="bg-blue-500/15 border-blue-500/30 text-blue-300">
        <div className="grid grid-cols-3 gap-2 mb-5">
          {EMAIL_SEQUENCES.map(seq => (
            <button key={seq.id} onClick={() => setEmailSeq(seq.id)}
              className={`p-3 rounded-xl border text-left transition-all ${emailSeq === seq.id ? 'bg-blue-500/12 border-blue-500/40 text-white' : 'bg-[#111318] border-white/6 text-gray-500 hover:text-white'}`}>
              <div className="text-sm font-bold mb-0.5">{seq.label}</div>
              <div className="text-[11px] text-gray-600">{seq.desc}</div>
            </button>
          ))}
        </div>

        <div className="space-y-2">
          {curEmail?.steps.map((step, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
              className="bg-[#111318] border border-white/6 rounded-xl overflow-hidden">
              <button onClick={() => setExpandedEmail(expandedEmail === i ? null : i)}
                className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-white/[0.02] transition-colors">
                <div className="w-6 h-6 rounded-lg bg-blue-500/20 border border-blue-500/30 flex items-center justify-center flex-shrink-0">
                  <span className="text-[9px] font-black text-blue-400">{i + 1}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-white truncate">{step.subject}</div>
                  <div className="text-[10px] text-gray-500 flex items-center gap-1"><Clock className="w-3 h-3" />{step.day}</div>
                </div>
                <ChevronRight className={`w-4 h-4 text-gray-600 flex-shrink-0 transition-transform ${expandedEmail === i ? 'rotate-90' : ''}`} />
              </button>
              <AnimatePresence>
                {expandedEmail === i && (
                  <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
                    <div className="px-4 pb-3 pt-0">
                      <div className="bg-blue-500/8 border border-blue-500/20 rounded-lg p-3 flex items-start gap-2">
                        <Zap className="w-3.5 h-3.5 text-blue-400 flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-blue-200/80">{step.tip}</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </ECard>

      <EDivider />

      {/* ══ SECCIÓN 04: LEAD SCORING ══ */}
      <ECard step="04" title="Lead Scoring" subtitle="Califica a tus leads según su comportamiento para saber exactamente cuándo contactarlos y venderles."
        badge="Scoring" badgeColor="bg-pink-500/15 border-pink-500/30 text-pink-300">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Reglas */}
          <div>
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">Reglas de Puntuación</p>
            <div className="bg-[#111318] border border-white/6 rounded-2xl overflow-hidden">
              {SCORING_RULES.map((rule, i) => {
                const Icon = rule.icon;
                return (
                  <div key={i} className="flex items-center justify-between px-4 py-3 border-b border-white/4 last:border-0 hover:bg-white/[0.015] transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={`p-1.5 rounded-lg bg-[#0b0c10] border border-white/5 ${rule.color}`}><Icon className="w-3.5 h-3.5" /></div>
                      <span className="text-xs text-gray-300">{rule.accion}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-bold ${rule.pts > 0 ? 'text-emerald-400' : 'text-red-400'}`}>{rule.pts > 0 ? '+' : ''}{rule.pts} pts</span>
                      <button onClick={() => setScore(s => Math.max(0, s + rule.pts))}
                        className="text-[11px] bg-[#0b0c10] border border-white/8 hover:border-violet-500/40 text-gray-500 hover:text-white px-2 py-1 rounded-lg transition-all">
                        +Simular
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-3 bg-violet-500/8 border border-violet-500/20 rounded-xl p-3 flex items-start gap-2">
              <Award className="w-4 h-4 text-violet-400 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-gray-400">Leads con <strong className="text-white">50+ puntos</strong> pasan de MQL a SQL. Es el momento exacto para que ventas los contacte.</p>
            </div>
          </div>

          {/* Simulador + Tabla */}
          <div className="flex flex-col gap-4">
            {/* Score actual */}
            <div className={`${curLevel.bg} border rounded-2xl p-5 text-center`}>
              <div className="flex justify-between items-start mb-3">
                <p className="text-xs font-bold text-gray-400">Simulador de Lead</p>
                <button onClick={() => setScore(0)} className="text-[11px] text-gray-600 hover:text-white transition-colors underline">Reiniciar</button>
              </div>
              <motion.div key={score} initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                className={`text-6xl font-black ${curLevel.color} mb-1`}>{score}</motion.div>
              <div className="text-xs text-gray-500 mb-3">Puntos acumulados</div>
              <div className={`${curLevel.bg} border rounded-xl p-3`}>
                <div className={`text-sm font-bold ${curLevel.color} mb-1`}>{curLevel.emoji} Estado: {curLevel.label}</div>
                <p className="text-xs text-gray-400"><strong className="text-white">Acción:</strong> {curLevel.action}</p>
              </div>
            </div>

            {/* Tabla de ejemplo */}
            <div className="bg-[#111318] border border-white/6 rounded-2xl overflow-hidden">
              <div className="px-4 py-3 border-b border-white/5">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Leads en tu Base de Datos</p>
              </div>
              {EXAMPLE_LEADS.map(lead => {
                const level = lead.score >= 50 ? SCORE_LEVELS[2] : lead.score >= 20 ? SCORE_LEVELS[1] : SCORE_LEVELS[0];
                return (
                  <div key={lead.id} className="flex items-center justify-between px-4 py-3 border-b border-white/4 last:border-0 hover:bg-white/[0.015] transition-colors">
                    <div>
                      <p className="text-xs font-bold text-white">{lead.nombre}</p>
                      <p className="text-[10px] text-gray-600">{lead.ultimo}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-lg font-black ${level.color}`}>{lead.score}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${level.bg}`}>{level.emoji} {level.label}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ARIA tip */}
        <div className="mt-4 bg-gradient-to-r from-violet-900/20 to-purple-900/15 border border-violet-500/15 rounded-2xl p-5 flex gap-4 items-start">
          <div className="w-8 h-8 rounded-xl bg-violet-500/20 flex items-center justify-center flex-shrink-0">
            <Zap className="w-4 h-4 text-violet-400" />
          </div>
          <div>
            <p className="text-xs font-bold text-violet-400 mb-1">💡 Consejo de ARIA sobre Email Marketing</p>
            <p className="text-xs text-gray-400 leading-relaxed">
              El email marketing tiene el ROI más alto de todos los canales digitales ($36 por cada $1 invertido).
              <strong className="text-white"> Pero solo funciona si el contenido es relevante y el timing es correcto.</strong>
              {' '}El Lead Scoring resuelve exactamente eso: envía el mensaje correcto al lead correcto en el momento correcto.
            </p>
          </div>
        </div>
      </ECard>
    </div>
  );
}
