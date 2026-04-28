// ═══════════════════════════════════════════════════════════════
// ESTUDIO CREATIVO — Taller Unificado
// Fusión: Fábrica de Ideas + Scripts en Vivo + Biblioteca de Hooks + Guía de Formatos
// Flujo: Elige formato → Genera Ideas → Construye el Script → Presenta
// ═══════════════════════════════════════════════════════════════
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Wand2, Lightbulb, Video, Zap, RefreshCw, Copy, Download,
  ArrowRight, CheckCircle, Heart, MessageCircle, Share2,
  Play, Clock, ListChecks, ChevronRight, Layers, Filter, Star
} from 'lucide-react';

// ── DATA ─────────────────────────────────────────────────────────
const FORMAT_TYPES = [
  { id: 'carrusel',  label: 'Carrusel',   emoji: '🎠', platforms: ['Instagram', 'LinkedIn'], desc: 'Ideal para educar y guardar' },
  { id: 'reel',      label: 'Reel / TikTok', emoji: '🎬', platforms: ['TikTok', 'Instagram', 'YouTube Shorts'], desc: 'Máximo alcance orgánico' },
  { id: 'historia',  label: 'Historia',   emoji: '⏱️', platforms: ['Instagram', 'Facebook', 'WhatsApp'], desc: 'Urgencia y CTA directo' },
  { id: 'post',      label: 'Post Estático', emoji: '📸', platforms: ['Instagram', 'Facebook'], desc: 'Imagen + copy persuasivo' },
  { id: 'live',      label: 'Live',       emoji: '🔴', platforms: ['TikTok', 'Instagram', 'YouTube'], desc: 'Conexión en tiempo real' },
  { id: 'hilo',      label: 'Hilo / Thread', emoji: '🧵', platforms: ['X (Twitter)', 'LinkedIn'], desc: 'Autoridad y profundidad' },
];

const CONTENT_PILLARS = [
  { id: 'educar',       label: 'Educar',     emoji: '📚', metric: 'Guardados',   color: 'text-blue-400 bg-blue-500/10 border-blue-500/25' },
  { id: 'entretener',   label: 'Entretener', emoji: '😂', metric: 'Shares',      color: 'text-pink-400 bg-pink-500/10 border-pink-500/25'  },
  { id: 'inspirar',     label: 'Inspirar',   emoji: '✨', metric: 'Likes',       color: 'text-amber-400 bg-amber-500/10 border-amber-500/25'},
  { id: 'vender',       label: 'Vender',     emoji: '💰', metric: 'Conversiones',color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/25'},
  { id: 'autoridad',    label: 'Autoridad',  emoji: '👑', metric: 'Retweets',    color: 'text-purple-400 bg-purple-500/10 border-purple-500/25'},
  { id: 'comunidad',    label: 'Comunidad',  emoji: '🫂', metric: 'Comentarios', color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/25'   },
];

const HOOKS_DB = [
  { id:1, category: 'curiosidad', text: 'Nadie te cuenta esto sobre [tema], y es porque funciona demasiado bien.' },
  { id:2, category: 'curiosidad', text: 'El truco que usé para triplicar mis resultados con [tema] en 7 días.' },
  { id:3, category: 'shock',      text: 'Perdí $3,000 por no saber esto de [tema]. No te va a pasar a ti.' },
  { id:4, category: 'shock',      text: 'Estaba a punto de rendirme con [tema]. Esto lo cambió todo.' },
  { id:5, category: 'promesa',    text: 'Cómo pasar de 0 a [resultado] con [tema] sin experiencia previa.' },
  { id:6, category: 'promesa',    text: 'El método exacto para [resultado] en [tema] que nadie te enseña.' },
  { id:7, category: 'pov',        text: 'POV: Cuando descubres que [tema] en realidad funciona así.' },
  { id:8, category: 'pov',        text: 'POV: Eres un experto en [tema] pero nadie lo sabe aún.' },
  { id:9, category: 'lista',      text: '3 errores de [tema] que te están costando dinero ahora mismo.' },
  { id:10, category: 'lista',     text: '5 cosas que haría diferente si empezara de cero en [tema].' },
  { id:11, category: 'pregunta',  text: '¿Por qué tu [tema] no funciona aunque hagas todo bien?' },
  { id:12, category: 'pregunta',  text: '¿Cuánto dinero llevas dejando sobre la mesa por no saber esto de [tema]?' },
  { id:13, category: 'debate',    text: 'Opinión impopular: [tema] no es tan difícil como te han dicho.' },
  { id:14, category: 'debate',    text: 'Me odiarán por decir esto sobre [tema], pero alguien tiene que hacerlo.' },
  { id:15, category: 'storytelling', text: 'Hace un año ni sabía qué era [tema]. Hoy genero $X con ello. Historia real.' },
  { id:16, category: 'storytelling', text: 'Mi cliente llegó sin saber nada de [tema]. En 30 días logró esto:' },
];

const HOOK_CATEGORIES = ['curiosidad','shock','promesa','pov','lista','pregunta','debate','storytelling'];

const generateIdeas = (topic, pillar) => [
  {
    id: 1, type: pillar,
    title: `Mito vs Verdad: Lo que nadie te dice sobre ${topic}`,
    format: 'Carrusel de Instagram (5 slides)',
    hook: `El 90% cree que ${topic} funciona así. Te demuestro en menos de 30 segundos por qué están equivocados 🤯`,
    cta: 'Guarda este post para no olvidarlo 📌',
  },
  {
    id: 2, type: pillar,
    title: `POV: Cuando intentas dominar ${topic} por primera vez`,
    format: 'Reel / TikTok',
    hook: `(Texto en pantalla) Mi cara cuando descubro este truco de ${topic}... 😭`,
    cta: 'Menciona a alguien que necesita ver esto 😂',
  },
  {
    id: 3, type: pillar,
    title: `De 0 a resultados reales con ${topic} en 30 días`,
    format: 'Post con foto personal / Storytelling',
    hook: `Hace un año estuve a punto de rendirme con ${topic}. Esto fue lo que lo cambió todo...`,
    cta: '¿Cuál ha sido tu mayor reto? Te leo 👇',
  },
  {
    id: 4, type: pillar,
    title: `El framework exacto para multiplicar resultados con ${topic}`,
    format: 'Video corto + Link en Bio',
    hook: `¿Cansado de trabajar duro con ${topic} sin ver resultados? Descubre el método que usamos 🎯`,
    cta: 'Link en bio para aplicarlo hoy mismo 🛒',
  },
  {
    id: 5, type: pillar,
    title: `3 herramientas poco conocidas que uso para ${topic}`,
    format: 'Hilo de X / Carrusel LinkedIn',
    hook: `Todos hablan de las mismas herramientas. Aquí mi stack secreto para ${topic} 🤫`,
    cta: 'Comparte si te resultó útil ♻️',
  },
  {
    id: 6, type: pillar,
    title: `Pregunta real sobre ${topic}: ¿Qué te frustra más?`,
    format: 'Post de debate / encuesta',
    hook: `Seamos honestos: ¿Qué es lo que más te frustra cuando intentas aplicar ${topic}?`,
    cta: 'Elegiré 3 respuestas para un video completo 📩',
  },
];

// ═══════════════════════════════════════════════════════════════
export default function ContentStudioModule() {
  // Estado general
  const [activeSection, setActiveSection] = useState('ideas'); // ideas | hooks | scripts | formatos

  // Fábrica de Ideas
  const [topic, setTopic]               = useState('');
  const [pillarId, setPillarId]         = useState('educar');
  const [isGenerating, setIsGenerating] = useState(false);
  const [ideas, setIdeas]               = useState([]);
  const [copiedId, setCopiedId]         = useState(null);

  // Scripts / Guionista
  const [scriptTopic, setScriptTopic]   = useState('');
  const [scriptDuration, setScriptDur]  = useState('30');
  const [scriptGoal, setScriptGoal]     = useState('venta');
  const [scriptGenerated, setScript]    = useState(false);

  // Hooks
  const [hookCategory, setHookCat]      = useState('todas');
  const [hookSearch, setHookSearch]     = useState('');

  // Formatos
  const [selectedFormat, setFormat]     = useState(null);

  // ── Handlers ──
  const runGenerateIdeas = () => {
    if (!topic) return;
    setIsGenerating(true);
    setTimeout(() => { setIdeas(generateIdeas(topic, pillarId)); setIsGenerating(false); }, 1600);
  };

  const copyToClipboard = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredHooks = HOOKS_DB
    .filter(h => hookCategory === 'todas' || h.category === hookCategory)
    .filter(h => !hookSearch || h.text.toLowerCase().includes(hookSearch.toLowerCase()));

  const NAV = [
    { id: 'ideas',    label: 'Fábrica de Ideas', emoji: '💡' },
    { id: 'hooks',    label: 'Banco de Hooks',   emoji: '🎣' },
    { id: 'scripts',  label: 'Guionista Live',   emoji: '🔴' },
    { id: 'formatos', label: 'Guía de Formatos', emoji: '📐' },
  ];

  return (
    <div className="w-full flex flex-col gap-6 pb-20 md:pb-0">

      {/* ══ HERO ══ */}
      <div className="bg-gradient-to-r from-blue-950/60 to-cyan-950/50 border border-cyan-500/20 rounded-2xl px-6 py-5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 bg-cyan-500/6 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-56 h-56 bg-blue-500/6 rounded-full blur-[80px] pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-500/20 border border-cyan-500/30 rounded-full mb-3">
              <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-xs font-bold text-cyan-300">✦ Laboratorio de Contenido Digital</span>
            </div>
            <h1 className="text-2xl font-black text-white flex items-center gap-2 mb-1">
              <Wand2 className="w-6 h-6 text-cyan-400" /> Estudio Creativo
            </h1>
            <p className="text-cyan-200/60 text-sm">Ideas → Hooks → Scripts → Formatos — Todo en un solo flujo creativo</p>
          </div>
          <div className="flex gap-3 flex-shrink-0">
            {[
              { label: 'Hooks disponibles', value: HOOKS_DB.length, color: 'text-cyan-400' },
              { label: 'Formatos',          value: FORMAT_TYPES.length, color: 'text-blue-400' },
              { label: 'Pilares',           value: CONTENT_PILLARS.length, color: 'text-violet-400' },
            ].map((s, i) => (
              <div key={i} className="bg-black/30 border border-white/8 rounded-xl px-4 py-2.5 text-center min-w-[80px]">
                <div className={`text-xl font-black ${s.color}`}>{s.value}</div>
                <div className="text-[10px] text-gray-500 mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ══ NAV INTERNA (sustituye los tabs pesados) ══ */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {NAV.map(n => (
          <button key={n.id} onClick={() => setActiveSection(n.id)}
            className={`flex items-center gap-2.5 px-4 py-3 rounded-xl border text-sm font-bold transition-all ${
              activeSection === n.id
                ? 'bg-cyan-500/15 border-cyan-500/50 text-white shadow-lg shadow-cyan-500/8'
                : 'bg-[#111318] border-white/6 text-gray-500 hover:text-white hover:border-white/15'
            }`}>
            <span className="text-lg">{n.emoji}</span>
            {n.label}
          </button>
        ))}
      </div>

      {/* ══ SECCIÓN : FÁBRICA DE IDEAS ══ */}
      <AnimatePresence mode="wait">
        {activeSection === 'ideas' && (
          <motion.div key="ideas" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <StudioCard title="Fábrica de Ideas" subtitle="Introduce un tema y el sistema genera ideas según el pilar de contenido elegido." step="01" badge="Ideas" badgeColor="bg-yellow-500/15 border-yellow-500/30 text-yellow-300">

              {/* 6 pilares */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-5">
                {CONTENT_PILLARS.map(p => (
                  <button key={p.id} onClick={() => setPillarId(p.id)}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-left transition-all ${
                      pillarId === p.id ? `${p.color}` : 'bg-[#111318] border-white/6 hover:border-white/15'
                    }`}>
                    <span className="text-xl">{p.emoji}</span>
                    <div>
                      <div className={`text-xs font-bold ${pillarId === p.id ? '' : 'text-gray-400'}`}>{p.label}</div>
                      <div className="text-[10px] text-gray-600">{p.metric}</div>
                    </div>
                  </button>
                ))}
              </div>

              {/* Input */}
              <div className="flex gap-2 mb-6">
                <input
                  type="text" value={topic} onChange={e => setTopic(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && runGenerateIdeas()}
                  placeholder="Ej: Marketing digital, Café de especialidad, Zapatillas..."
                  className="flex-1 bg-[#0b0c10] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-cyan-500/50 transition-colors"
                />
                <button onClick={runGenerateIdeas} disabled={isGenerating || !topic}
                  className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold px-5 py-3 rounded-xl flex items-center gap-2 transition-all disabled:opacity-40 shadow-lg shadow-cyan-500/20">
                  {isGenerating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                  {isGenerating ? 'Generando...' : 'Generar'}
                </button>
              </div>

              {/* Ideas grid */}
              <AnimatePresence>
                {ideas.length > 0 && (
                  <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {ideas.map((idea, i) => (
                      <motion.div key={idea.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                        className="bg-[#111318] rounded-2xl border border-white/6 p-5 hover:border-cyan-500/25 transition-all group">
                        <div className="flex items-start justify-between mb-3">
                          <span className="text-[10px] font-bold text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 rounded-full">{idea.format}</span>
                        </div>
                        <h4 className="text-sm font-bold text-white mb-3">{idea.title}</h4>
                        <div className="bg-[#0b0c10] rounded-xl border border-white/6 p-3 mb-3 relative">
                          <span className="absolute -top-2 left-3 text-[10px] font-bold text-gray-600 bg-[#111318] px-1">Hook de apertura</span>
                          <p className="text-xs text-gray-300 italic">"{idea.hook}"</p>
                        </div>
                        <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 mb-4">
                          <ArrowRight className="w-3 h-3" /> {idea.cta}
                        </div>
                        <div className="flex items-center justify-between pt-3 border-t border-white/5">
                          <div className="flex gap-2 text-gray-600">
                            <Heart className="w-4 h-4 hover:text-pink-400 cursor-pointer transition-colors" />
                            <MessageCircle className="w-4 h-4 hover:text-blue-400 cursor-pointer transition-colors" />
                            <Share2 className="w-4 h-4 hover:text-emerald-400 cursor-pointer transition-colors" />
                          </div>
                          <button
                            onClick={() => copyToClipboard(idea.id, `${idea.title}\n\n${idea.hook}\n\n${idea.cta}`)}
                            className={`flex items-center gap-1 text-xs font-bold transition-all px-2 py-1 rounded-lg ${copiedId === idea.id ? 'text-emerald-400 bg-emerald-500/10' : 'text-gray-500 hover:text-white'}`}>
                            {copiedId === idea.id ? <><CheckCircle className="w-3 h-3" /> Copiado</> : <><Copy className="w-3 h-3" /> Copiar</>}
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
              {ideas.length === 0 && (
                <div className="text-center py-12 text-gray-700">
                  <Lightbulb className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p className="text-sm">Ingresa un tema y haz clic en <strong className="text-gray-500">Generar</strong></p>
                </div>
              )}
            </StudioCard>
          </motion.div>
        )}

        {/* ══ SECCIÓN : BANCO DE HOOKS ══ */}
        {activeSection === 'hooks' && (
          <motion.div key="hooks" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <StudioCard title="Banco de Hooks" subtitle="Más de 100 ganchos de apertura ordenados por categoría. Reemplaza [tema] con tu producto o servicio." step="02" badge="Hooks" badgeColor="bg-violet-500/15 border-violet-500/30 text-violet-300">
              {/* Search + filter */}
              <div className="flex flex-wrap gap-2 mb-4">
                <input
                  value={hookSearch} onChange={e => setHookSearch(e.target.value)}
                  placeholder="Buscar hook..."
                  className="flex-1 min-w-[200px] bg-[#0b0c10] border border-white/8 rounded-xl px-4 py-2 text-white text-sm focus:outline-none focus:border-violet-500/50 transition-colors"
                />
                <div className="flex gap-1 flex-wrap">
                  {['todas', ...HOOK_CATEGORIES].map(c => (
                    <button key={c} onClick={() => setHookCat(c)}
                      className={`px-3 py-2 rounded-xl text-[11px] font-bold transition-all border capitalize ${
                        hookCategory === c ? 'bg-violet-500/15 border-violet-500/40 text-white' : 'bg-[#111318] border-white/6 text-gray-500 hover:text-white'
                      }`}>
                      {c === 'todas' ? 'Todos' : c}
                    </button>
                  ))}
                </div>
                <span className="text-xs text-gray-600 self-center">{filteredHooks.length} resultados</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <AnimatePresence>
                  {filteredHooks.map((hook, i) => (
                    <motion.div key={hook.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ delay: i * 0.02 }}
                      className="bg-[#111318] border border-white/6 rounded-xl p-4 group hover:border-violet-500/25 transition-all">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <span className="text-[10px] font-bold text-violet-400 bg-violet-500/10 border border-violet-500/20 px-2 py-0.5 rounded-full capitalize">{hook.category}</span>
                        <button
                          onClick={() => copyToClipboard(hook.id, hook.text)}
                          className={`flex items-center gap-1 text-[11px] font-bold transition-all px-2 py-0.5 rounded-lg flex-shrink-0 ${copiedId === hook.id ? 'text-emerald-400 bg-emerald-500/10' : 'text-gray-600 hover:text-white'}`}>
                          {copiedId === hook.id ? <CheckCircle className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                        </button>
                      </div>
                      <p className="text-sm text-gray-300 leading-relaxed">{hook.text}</p>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </StudioCard>
          </motion.div>
        )}

        {/* ══ SECCIÓN : GUIONISTA LIVE ══ */}
        {activeSection === 'scripts' && (
          <motion.div key="scripts" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <StudioCard title="Guionista de Live" subtitle="Genera una escaleta profesional para retener tu audiencia durante un Live y convertir espectadores en clientes." step="03" badge="Script" badgeColor="bg-red-500/15 border-red-500/30 text-red-300">
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                {/* Config panel */}
                <div className="lg:col-span-2 flex flex-col gap-4">
                  <div className="bg-[#111318] border border-white/6 rounded-2xl p-5 flex flex-col gap-4">
                    <div>
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 block">Tema Principal del Live</label>
                      <input type="text" value={scriptTopic} onChange={e => setScriptTopic(e.target.value)}
                        placeholder="Ej: Lanzamiento nueva colección"
                        className="w-full bg-[#0b0c10] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-red-500/50 transition-colors" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 flex items-center gap-1 block">
                        <Clock className="w-3 h-3" /> Duración estimada
                      </label>
                      <select value={scriptDuration} onChange={e => setScriptDur(e.target.value)}
                        className="w-full bg-[#0b0c10] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-red-500/50 transition-colors">
                        <option value="15">15 min — Flash Live</option>
                        <option value="30">30 min — Estándar</option>
                        <option value="60">60 min — Masterclass</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 block">Objetivo principal</label>
                      <select value={scriptGoal} onChange={e => setScriptGoal(e.target.value)}
                        className="w-full bg-[#0b0c10] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-red-500/50 transition-colors">
                        <option value="venta">💰 Venta Directa / Lanzamiento</option>
                        <option value="autoridad">👑 Educar / Construir Autoridad</option>
                        <option value="qna">🫂 Q&A / Conectar con Comunidad</option>
                      </select>
                    </div>
                    <button onClick={() => setScript(true)} disabled={!scriptTopic}
                      className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-red-500/20 disabled:opacity-40 transition-all">
                      <Play className="w-4 h-4" /> Generar Escaleta
                    </button>
                  </div>

                  {/* Pre-live checklist */}
                  <div className="bg-[#111318] border-l-4 border-amber-500 border border-white/6 rounded-2xl p-4">
                    <h4 className="font-bold text-white flex items-center gap-2 mb-3 text-sm">
                      <ListChecks className="w-4 h-4 text-amber-400" /> Checklist Pre-Live
                    </h4>
                    <div className="space-y-2">
                      {['Batería al 100% y modo No Molestar', 'Limpiar lente de la cámara', 'Iluminación frontal lista', 'Escaleta visible en pantalla', 'Agua a la mano'].map((item, i) => (
                        <label key={i} className="flex items-center gap-2 text-xs text-gray-400 cursor-pointer">
                          <input type="checkbox" className="accent-amber-500 w-3 h-3" /> {item}
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Script output */}
                <div className="lg:col-span-3 bg-[#111318] border border-white/6 rounded-2xl overflow-hidden">
                  {scriptGenerated ? (
                    <div className="p-5">
                      <div className="flex items-center justify-between mb-5">
                        <div>
                          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-red-500/20 text-red-400 rounded-full text-[10px] font-bold mb-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" /> LISTO PARA TRANSMITIR
                          </div>
                          <h3 className="font-bold text-white">{scriptTopic}</h3>
                          <p className="text-xs text-gray-500">{scriptDuration} min · {scriptGoal}</p>
                        </div>
                        <button className="flex items-center gap-1 px-3 py-1.5 bg-white/5 border border-white/8 rounded-lg text-xs text-gray-400 hover:text-white transition-colors">
                          <Download className="w-3.5 h-3.5" /> Exportar
                        </button>
                      </div>
                      <div className="space-y-5">
                        {[
                          { time: `0–${Math.round(+scriptDuration*0.1)} min`, title: '1. El Gancho', color: 'border-red-500', dotColor: 'border-red-500', meta: 'Evitar que hagan swipe', steps: [
                            `Saluda: "¡Hola a todos! Escríbanme desde dónde me ven 🌍"`,
                            `Promesa: "Quédense hasta el final, hoy revelaré [secreto sobre ${scriptTopic}] + sorpresa exclusiva."`,
                            `CTA rápido: "Dos toques para dar amor al live si están listos ❤️"`,
                          ]},
                          { time: `${Math.round(+scriptDuration*0.1)}–${Math.round(+scriptDuration*0.7)} min`, title: '2. Desarrollo', color: 'border-blue-500', dotColor: 'border-blue-500', meta: 'Generar valor y confianza', steps: [
                            `Contexto / Historia: "Antes de lanzar ${scriptTopic} tuvimos este problema..."`,
                            `Demostración en vivo: muestra el producto/tema en acción`,
                            `Romper objeciones: "Muchos preguntan si sirve para X. La respuesta es..."`,
                            `💡 Interacción: Pregunta fácil de responder con Sí/No en el chat`,
                          ]},
                          { time: `${Math.round(+scriptDuration*0.7)}–${scriptDuration} min`, title: '3. Cierre y Pitch', color: 'border-emerald-500', dotColor: 'border-emerald-500', meta: 'Convertir en clientes', steps: [
                            `Pitch: "Si quieres aplicar esto, acabo de activar el link en bio. Solo por los próximos 30 min tendrán descuento..."`,
                            `Q&A: Lee 3-4 preguntas reales del chat mencionando el nombre`,
                            `Despedida fuerte: "Gracias por conectarse, nos vemos en el próximo. ¡Vayan al link!"`,
                          ]},
                        ].map((block, i) => (
                          <div key={i} className={`relative pl-5 border-l-2 ${block.color}`}>
                            <div className={`absolute -left-2 top-0 w-4 h-4 bg-[#111318] border-2 ${block.dotColor} rounded-full`} />
                            <div className="flex items-baseline gap-2 mb-1">
                              <h4 className="font-bold text-white text-sm">{block.title}</h4>
                              <span className="text-[10px] text-gray-500">{block.time}</span>
                            </div>
                            <p className={`text-[10px] font-bold mb-2 ${i===0?'text-red-400':i===1?'text-blue-400':'text-emerald-400'}`}>{block.meta}</p>
                            <div className="bg-[#0b0c10] rounded-xl border border-white/5 p-3 space-y-2">
                              {block.steps.map((s, si) => (
                                <p key={si} className="text-xs text-gray-400 leading-relaxed">{s}</p>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-64 text-center p-6">
                      <Video className="w-10 h-10 text-gray-700 mb-3" />
                      <p className="text-sm font-bold text-gray-600">Tu escaleta aparecerá aquí</p>
                      <p className="text-xs text-gray-700 mt-1">Configura y haz clic en "Generar Escaleta"</p>
                    </div>
                  )}
                </div>
              </div>
            </StudioCard>
          </motion.div>
        )}

        {/* ══ SECCIÓN : GUÍA DE FORMATOS ══ */}
        {activeSection === 'formatos' && (
          <motion.div key="formatos" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <StudioCard title="Guía de Formatos" subtitle="Aprende cuándo usar cada formato según tu objetivo y plataforma. Selecciona uno para ver el brief completo." step="04" badge="Formatos" badgeColor="bg-blue-500/15 border-blue-500/30 text-blue-300">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-5">
                {FORMAT_TYPES.map(fmt => (
                  <motion.button key={fmt.id} whileHover={{ y: -2 }} onClick={() => setFormat(selectedFormat?.id === fmt.id ? null : fmt)}
                    className={`text-left rounded-2xl border p-4 transition-all ${selectedFormat?.id === fmt.id ? 'bg-cyan-500/12 border-cyan-500/50 shadow-lg shadow-cyan-500/8' : 'bg-[#111318] border-white/6 hover:border-white/15'}`}>
                    <div className="text-3xl mb-2">{fmt.emoji}</div>
                    <div className="font-bold text-white text-sm mb-0.5">{fmt.label}</div>
                    <div className="text-xs text-gray-500 mb-2">{fmt.desc}</div>
                    <div className="flex flex-wrap gap-1">
                      {fmt.platforms.map(p => (
                        <span key={p} className="text-[10px] text-gray-600 bg-white/5 border border-white/6 rounded-full px-2 py-0.5">{p}</span>
                      ))}
                    </div>
                  </motion.button>
                ))}
              </div>

              <AnimatePresence>
                {selectedFormat && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                    className="bg-gradient-to-r from-cyan-950/40 to-blue-950/30 border border-cyan-500/20 rounded-2xl p-5">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-3xl">{selectedFormat.emoji}</span>
                      <div>
                        <h3 className="font-black text-white">{selectedFormat.label}</h3>
                        <div className="flex gap-1 mt-1">
                          {selectedFormat.platforms.map(p => (
                            <span key={p} className="text-[10px] text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 rounded-full px-2 py-0.5">{p}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                      {[
                        { label: '¿Cuándo usarlo?', value: `Cuando tu objetivo es ${selectedFormat.desc.toLowerCase()}.` },
                        { label: 'Longitud ideal',   value: selectedFormat.id === 'reel' ? '7–30 segundos' : selectedFormat.id === 'carrusel' ? '5–10 slides' : selectedFormat.id === 'live' ? '30–60 minutos' : 'Variable según plataforma' },
                        { label: 'CTA recomendado',  value: selectedFormat.id === 'historia' ? 'Swipe up / Link en sticker' : selectedFormat.id === 'live' ? 'Manda DM / Link en bio' : 'Comenta / Guarda / Comparte' },
                      ].map((item, i) => (
                        <div key={i} className="bg-[#0b0c10] rounded-xl p-3">
                          <div className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-1">{item.label}</div>
                          <div className="text-gray-300">{item.value}</div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Consejo ARIA */}
              <div className="mt-4 bg-gradient-to-r from-cyan-900/20 to-blue-900/15 border border-cyan-500/15 rounded-2xl p-5 flex gap-4 items-start">
                <div className="w-8 h-8 rounded-xl bg-cyan-500/20 flex items-center justify-center flex-shrink-0">
                  <Zap className="w-4 h-4 text-cyan-400" />
                </div>
                <div>
                  <p className="text-xs font-bold text-cyan-400 mb-1">💡 Consejo de ARIA sobre Formatos</p>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    No necesitas dominar todos los formatos — necesitas dominar 2. La regla de los expertos:
                    <strong className="text-white"> 1 formato de alcance (Reel/TikTok) + 1 formato de autoridad (Carrusel/Hilo).</strong>
                    {' '}Con esos dos vas a crecer consistentemente sin agotarte. Añade el Live cuando ya tengas 1,000 seguidores.
                  </p>
                </div>
              </div>
            </StudioCard>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Helper Section Card ───────────────────────────────────────────
function StudioCard({ step, title, subtitle, badge, badgeColor, children }) {
  return (
    <div className="bg-[#0e1117] rounded-2xl border border-white/5 overflow-hidden">
      <div className="border-b border-white/5 px-6 py-4 flex items-start gap-4">
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
      <div className="p-6">{children}</div>
    </div>
  );
}
