// ═══════════════════════════════════════════════════════════════
// RADAR DE TENDENCIAS — Panel Unificado
// Fusión: Radar Inteligente + Analizador de Hashtags + Música Viral
// Flujo: Tendencias en Vivo → Hashtags por Nicho → Música Viral
// ═══════════════════════════════════════════════════════════════
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Target, Hash, Music, TrendingUp, Globe, Zap,
  Copy, CheckCircle, RefreshCw, ChevronRight, ArrowUpRight,
  Flame, Clock, BarChart2, Play
} from 'lucide-react';

// ── DATA ─────────────────────────────────────────────────────────
const TRENDING_TOPICS = [
  { id: 1, trend: '#MarketingDigital2026', velocity: '+340%', platform: 'TikTok', score: 9.4, category: 'marketing', status: 'Explotando', since: '2h' },
  { id: 2, trend: 'Inteligencia Artificial para PYMES', velocity: '+210%', platform: 'LinkedIn', score: 8.7, category: 'tecnologia', status: 'En crecimiento', since: '5h' },
  { id: 3, trend: '#ContentCreator Tips', velocity: '+180%', platform: 'Instagram', score: 8.1, category: 'content', status: 'En crecimiento', since: '8h' },
  { id: 4, trend: 'Video Corto Estrategia 2026', velocity: '+290%', platform: 'YouTube Shorts', score: 9.1, category: 'content', status: 'Explotando', since: '1h' },
  { id: 5, trend: '#EmprendedorLatino', velocity: '+155%', platform: 'Instagram', score: 7.8, category: 'lifestyle', status: 'Estable', since: '12h' },
  { id: 6, trend: 'Social Commerce Estrategia', velocity: '+420%', platform: 'TikTok', score: 9.8, category: 'ecommerce', status: 'Viral', since: '30m' },
  { id: 7, trend: '#PersonalBranding Pro', velocity: '+130%', platform: 'LinkedIn', score: 7.5, category: 'marketing', status: 'Estable', since: '1d' },
  { id: 8, trend: 'Reels para Negocios Locales', velocity: '+240%', platform: 'Instagram', score: 8.9, category: 'content', status: 'Explotando', since: '3h' },
];

const CATEGORIES = ['Todos', 'marketing', 'tecnologia', 'content', 'lifestyle', 'ecommerce'];

const STATUS_STYLE = {
  'Viral':          'bg-red-500/15 text-red-400 border-red-500/30',
  'Explotando':     'bg-orange-500/15 text-orange-400 border-orange-500/30',
  'En crecimiento': 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  'Estable':        'bg-gray-500/15 text-gray-400 border-gray-500/30',
};

const PLATFORM_ICON = {
  'TikTok':         '🎵',
  'Instagram':      '📷',
  'LinkedIn':       '💼',
  'YouTube Shorts': '▶️',
  'Twitter/X':      '𝕏',
};

const HASHTAG_CATEGORIES = [
  { label: 'Alto Alcance (+1M)', desc: 'Máxima exposición, alta competencia. Usar 3-4 max.', color: 'text-blue-400 bg-blue-500/10 border-blue-500/20', tags: ['#viral', '#trending', '#fyp', '#explorepage', '#reels', '#foryou'] },
  { label: 'Nicho Medio (100K–1M)', desc: 'Balance ideal. Usa 5-6 para el grueso de tu mix.', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20', tags: ['#marketingdigital', '#contentcreator', '#socialmedia', '#emprendedor', '#marketingtips'] },
  { label: 'Nicho Específico (-100K)', desc: 'Alto engagement, audiencia cualificada. Usa 4-5.', color: 'text-violet-400 bg-violet-500/10 border-violet-500/20', tags: ['#cmlatam', '#growthmarketing', '#ugccreator', '#brandambassador', '#contenidodigital'] },
];

const VIRAL_SONGS = [
  { id: 1, title: 'MILLION DOLLAR BABY', artist: 'Tommy Richman', trend: '+890%', platforms: ['TikTok', 'Instagram'], duration: '0:58', uses: '12.4M', mood: '🔥 Energético', fit: ['Lifestyle', 'Fashion', 'Fitness'] },
  { id: 2, title: 'Espresso', artist: 'Sabrina Carpenter', trend: '+640%', platforms: ['TikTok', 'Instagram', 'YouTube'], duration: '2:55', uses: '8.7M', mood: '✨ Playful', fit: ['Moda', 'Beauty', 'Food'] },
  { id: 3, title: 'Good Luck, Babe!', artist: 'Chappell Roan', trend: '+420%', platforms: ['TikTok', 'Instagram'], duration: '3:38', uses: '5.2M', mood: '💜 Emocional', fit: ['Lifestyle', 'Personal Brand', 'Motivación'] },
  { id: 4, title: 'BIRDS OF A FEATHER', artist: 'Billie Eilish', trend: '+380%', platforms: ['Instagram', 'YouTube Shorts'], duration: '3:30', uses: '4.8M', mood: '🎶 Chill/Aura', fit: ['Aesthetic', 'Fashion', 'Reels Chill'] },
  { id: 5, title: 'Not Like Us', artist: 'Kendrick Lamar', trend: '+720%', platforms: ['TikTok', 'YouTube Shorts'], duration: '4:34', uses: '7.1M', mood: '💥 Hype', fit: ['Dance', 'Trends', 'Reacción'] },
  { id: 6, title: 'Levii\'s Jeans', artist: 'Beyoncé ft. Post Malone', trend: '+290%', platforms: ['Instagram', 'TikTok'], duration: '3:12', uses: '3.4M', mood: '🤠 Casual/Fun', fit: ['Fashion', 'Lifestyle', 'GRWM'] },
];

// ── HELPERS ───────────────────────────────────────────────────────
const RCard = ({ step, title, subtitle, badge, badgeColor, action, children }) => (
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

const RDivider = () => (
  <div className="flex items-center gap-4">
    <div className="flex-1 h-px bg-white/5" />
    <ChevronRight className="w-4 h-4 text-gray-700" />
    <div className="flex-1 h-px bg-white/5" />
  </div>
);

// ═══════════════════════════════════════════════════════════════
export default function TrendRadarModule({ scheduledReminders = [], onSendHashtagMix }) {
  // Trends
  const [trendCat, setTrendCat]     = useState('Todos');
  const [trendSort, setTrendSort]   = useState('score');
  const [refreshing, setRefreshing] = useState(false);

  // Hashtags
  const [nicho, setNicho]           = useState('');
  const [generado, setGenerado]     = useState(false);
  const [copiedTag, setCopiedTag]   = useState(null);
  const [generatedMix, setMix]      = useState([]);

  // Music
  const [musicFilter, setMusicFilter] = useState('Todos');

  // ── Handlers ──
  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1500);
  };

  const generateHashtags = () => {
    if (!nicho) return;
    const base = nicho.toLowerCase().replace(/\s+/g, '');
    setMix([
      `#viral`, `#trending`, `#fyp`,
      `#${base}`, `#${base}tips`, `#${base}2026`,
      `#marketingdigital`, `#contentcreator`, `#emprendedor`,
      `#${nicho.split(' ')[0]?.toLowerCase()}`,
      `#socialmedia`, `#cmlatam`, `#brandingdigital`, `#ugccreator`,
    ]);
    setGenerado(true);
  };

  const copyTag = (tag) => {
    navigator.clipboard.writeText(tag);
    setCopiedTag(tag); setTimeout(() => setCopiedTag(null), 1500);
  };

  const copyAllTags = () => {
    navigator.clipboard.writeText(generatedMix.join(' '));
    setCopiedTag('ALL'); setTimeout(() => setCopiedTag(null), 2000);
  };

  // ── Filtered Data ──
  const filteredTrends = TRENDING_TOPICS
    .filter(t => trendCat === 'Todos' || t.category === trendCat)
    .sort((a, b) => trendSort === 'score' ? b.score - a.score : b.velocity.localeCompare(a.velocity));

  const filteredMusic = musicFilter === 'Todos' ? VIRAL_SONGS : VIRAL_SONGS.filter(s => s.platforms.includes(musicFilter));

  const globalStats = {
    nicheScore: 34,
    sentiment: 82,
    viral: 9.4,
    trending: filteredTrends.filter(t => ['Viral', 'Explotando'].includes(t.status)).length,
  };

  return (
    <div className="w-full flex flex-col gap-6 pb-20 md:pb-0">

      {/* ══ HERO ══ */}
      <div className="bg-gradient-to-r from-cyan-950/60 to-teal-950/50 border border-cyan-500/20 rounded-2xl px-6 py-5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/6 rounded-full blur-[100px] pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-500/20 border border-cyan-500/30 rounded-full mb-3">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-bold text-cyan-300">✦ Monitoreo en Vivo · IA Predictiva</span>
            </div>
            <h1 className="text-2xl font-black text-white flex items-center gap-2 mb-1">
              <Target className="w-6 h-6 text-cyan-400" /> Radar de Tendencias
            </h1>
            <p className="text-cyan-200/60 text-sm">Tendencias en Vivo → Hashtags por Nicho → Música Viral</p>
          </div>
          {/* Live Metrics */}
          <div className="grid grid-cols-3 gap-3 flex-shrink-0">
            {[
              { label: 'Saturación Nicho', value: `${globalStats.nicheScore}%`, color: 'text-cyan-400', bar: globalStats.nicheScore, barColor: 'from-cyan-500 to-blue-500' },
              { label: 'Sentimiento Global', value: `${globalStats.sentiment}%`, color: 'text-emerald-400', bar: globalStats.sentiment, barColor: 'from-emerald-500 to-green-500' },
              { label: 'Potencial Viral', value: `${globalStats.viral}/10`, color: 'text-purple-400', bar: globalStats.viral * 10, barColor: 'from-purple-500 to-pink-500' },
            ].map((m, i) => (
              <div key={i} className="bg-black/30 border border-white/8 rounded-xl p-3 min-w-[110px]">
                <div className={`text-lg font-black ${m.color}`}>{m.value}</div>
                <div className="text-[10px] text-gray-600 mb-1.5">{m.label}</div>
                <div className="w-full bg-gray-800 rounded-full h-1">
                  <div className={`bg-gradient-to-r ${m.barColor} h-1 rounded-full transition-all`} style={{ width: `${m.bar}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ══ SECCIÓN 01: RADAR EN VIVO ══ */}
      <RCard step="01" title="Tendencias en Vivo" subtitle="Detecta las tendencias que están creciendo ahora mismo en todas las plataformas. Actúa antes que tu competencia."
        badge="Live" badgeColor="bg-red-500/15 border-red-500/30 text-red-300"
        action={
          <button onClick={handleRefresh}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 text-cyan-300 rounded-lg text-xs font-semibold transition-all">
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} /> Actualizar
          </button>
        }
      >
        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-4 items-center">
          <div className="flex gap-1 flex-wrap">
            {CATEGORIES.map(c => (
              <button key={c} onClick={() => setTrendCat(c)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all capitalize ${trendCat === c ? 'bg-cyan-500/15 border-cyan-500/40 text-white' : 'bg-[#111318] border-white/6 text-gray-500 hover:text-white'}`}>
                {c}
              </button>
            ))}
          </div>
          <select value={trendSort} onChange={e => setTrendSort(e.target.value)}
            className="ml-auto bg-[#0b0c10] border border-white/8 text-gray-400 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-cyan-500/40">
            <option value="score">Mayor score</option>
            <option value="velocity">Mayor velocidad</option>
          </select>
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-2.5 py-1">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> {filteredTrends.filter(t => ['Viral','Explotando'].includes(t.status)).length} explotando ahora
          </div>
        </div>

        {/* Trends grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <AnimatePresence>
            {filteredTrends.map((trend, i) => (
              <motion.div key={trend.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ delay: i * 0.04 }}
                className="bg-[#111318] border border-white/6 rounded-2xl p-4 hover:border-cyan-500/25 transition-all group">
                <div className="flex items-start justify-between mb-2">
                  <span className="font-bold text-white text-sm">{trend.trend}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border flex-shrink-0 ml-2 ${STATUS_STYLE[trend.status]}`}>
                    {trend.status}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{PLATFORM_ICON[trend.platform] || '🌐'}</span>
                    <div>
                      <div className="text-xs text-gray-500">{trend.platform}</div>
                      <div className="text-[10px] text-gray-600">Hace {trend.since}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-emerald-400 font-black text-sm">{trend.velocity}/día</div>
                      <div className="text-[10px] text-gray-600">velocidad</div>
                    </div>
                    <div className="text-center">
                      <div className={`text-lg font-black ${trend.score >= 9 ? 'text-red-400' : trend.score >= 8 ? 'text-amber-400' : 'text-blue-400'}`}>{trend.score}</div>
                      <div className="text-[10px] text-gray-600">score</div>
                    </div>
                  </div>
                </div>
                {/* Score bar */}
                <div className="mt-3 w-full bg-gray-800 rounded-full h-1">
                  <div className={`h-1 rounded-full transition-all ${trend.score >= 9 ? 'bg-gradient-to-r from-red-500 to-orange-500' : trend.score >= 8 ? 'bg-gradient-to-r from-amber-500 to-yellow-500' : 'bg-gradient-to-r from-cyan-500 to-blue-500'}`}
                    style={{ width: `${trend.score * 10}%` }} />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* ARIA tip */}
        <div className="mt-4 bg-gradient-to-r from-cyan-900/20 to-teal-900/15 border border-cyan-500/15 rounded-2xl p-4 flex gap-3 items-start">
          <Zap className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-gray-400">
            <strong className="text-cyan-400">💡 Consejo ARIA:</strong> Las tendencias con status <strong className="text-orange-400">"Explotando"</strong> tienen una ventana de 24-72h. Actúa en las primeras 12h para captar el máximo alcance orgánico antes que la competencia sature el tema.
          </p>
        </div>
      </RCard>

      <RDivider />

      {/* ══ SECCIÓN 02: ANALIZADOR DE HASHTAGS ══ */}
      <RCard step="02" title="Analizador de Hashtags" subtitle='Mix estratégico 30/40/30: alto alcance / nicho medio / específico para maximizar visibilidad sin quedar sepultado.'
        badge="Hashtags" badgeColor="bg-violet-500/15 border-violet-500/30 text-violet-300"
      >
        {/* Regla 30/40/30 visual */}
        <div className="flex gap-1 rounded-xl overflow-hidden h-2 mb-5">
          <div className="bg-blue-500 h-full" style={{ width: '30%' }} title="Alto alcance" />
          <div className="bg-emerald-500 h-full" style={{ width: '40%' }} title="Nicho medio" />
          <div className="bg-violet-500 h-full" style={{ width: '30%' }} title="Específico" />
        </div>
        <div className="flex gap-4 text-[10px] text-gray-500 mb-5">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-blue-500 inline-block" />30% Alto alcance</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-emerald-500 inline-block" />40% Nicho medio</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-violet-500 inline-block" />30% Específico</span>
        </div>

        {/* Biblioteca de hashtags */}
        <div className="flex flex-col gap-3 mb-5">
          {HASHTAG_CATEGORIES.map((cat, i) => (
            <div key={i} className={`p-4 rounded-2xl border ${cat.color}`}>
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className={`font-bold text-sm mb-0.5 ${cat.color.split(' ')[0]}`}>{cat.label}</h4>
                  <p className="text-xs text-gray-500">{cat.desc}</p>
                </div>
                <span className="text-[10px] bg-[#111318] text-gray-500 px-2 py-0.5 rounded-full">{cat.tags.length} tags</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {cat.tags.map(tag => (
                  <button key={tag} onClick={() => copyTag(tag)}
                    className={`text-xs px-2.5 py-1 bg-[#111318] rounded-full border border-white/8 transition-all hover:border-white/20 flex items-center gap-1 ${cat.color.split(' ')[0]} ${copiedTag === tag ? 'bg-emerald-500/10 border-emerald-500/30' : ''}`}>
                    {copiedTag === tag ? <CheckCircle className="w-2.5 h-2.5 text-emerald-400" /> : null}
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Generador personalizado */}
        <div className="bg-[#111318] border border-white/6 rounded-2xl p-4">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Generador Personalizado por Nicho</p>
          <div className="flex gap-2 mb-4">
            <input value={nicho} onChange={e => setNicho(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && generateHashtags()}
              placeholder="Ej: Fotografía de producto, Coaching online, Ropa deportiva..."
              className="flex-1 bg-[#0b0c10] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-violet-500/50 transition-colors placeholder-gray-600" />
            <button onClick={generateHashtags} disabled={!nicho}
              className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white font-bold px-5 py-2.5 rounded-xl transition-all disabled:opacity-40 shadow-lg shadow-violet-500/15 flex items-center gap-2">
              <Hash className="w-4 h-4" /> Generar
            </button>
          </div>

          <AnimatePresence>
            {generado && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-bold text-violet-400">🎯 Mix para "{nicho}" ({generatedMix.length} hashtags)</p>
                  <button onClick={copyAllTags}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${copiedTag === 'ALL' ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400' : 'bg-violet-500/15 border-violet-500/30 text-violet-300 hover:bg-violet-500/25'}`}>
                    {copiedTag === 'ALL' ? <><CheckCircle className="w-3.5 h-3.5" />¡Copiados!</> : <><Copy className="w-3.5 h-3.5" />Copiar todos</>}
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {generatedMix.map(tag => (
                    <button key={tag} onClick={() => copyTag(tag)}
                      className={`text-xs px-3 py-1.5 rounded-full border transition-all ${copiedTag === tag ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400' : 'bg-[#0b0c10] border-violet-500/30 text-violet-300 hover:border-violet-400/50'}`}>
                      {tag}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </RCard>

      <RDivider />

      {/* ══ SECCIÓN 03: MÚSICA VIRAL ══ */}
      <RCard step="03" title="Música Viral" subtitle="Las canciones que más se usan en Reels y TikToks ahora mismo. Aprovecha el impulso del algoritmo."
        badge="Trending Sounds" badgeColor="bg-pink-500/15 border-pink-500/30 text-pink-300"
      >
        {/* Platform filter */}
        <div className="flex gap-2 mb-5 flex-wrap">
          {['Todos', 'TikTok', 'Instagram', 'YouTube Shorts'].map(p => (
            <button key={p} onClick={() => setMusicFilter(p)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${musicFilter === p ? 'bg-pink-500/15 border-pink-500/40 text-white' : 'bg-[#111318] border-white/6 text-gray-500 hover:text-white'}`}>
              {p}
            </button>
          ))}
          <span className="ml-auto text-xs text-gray-600 self-center">{filteredMusic.length} canciones · Actualizado hoy</span>
        </div>

        <div className="flex flex-col gap-3">
          {filteredMusic.map((song, i) => (
            <motion.div key={song.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
              className="bg-[#111318] border border-white/6 rounded-2xl p-4 hover:border-pink-500/25 transition-all">
              <div className="flex items-start gap-4">
                {/* Position */}
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-sm flex-shrink-0 ${i === 0 ? 'bg-gradient-to-br from-amber-500 to-orange-500 text-white' : i === 1 ? 'bg-gradient-to-br from-gray-400 to-gray-500 text-white' : i === 2 ? 'bg-gradient-to-br from-amber-700 to-amber-800 text-white' : 'bg-[#0b0c10] text-gray-500'}`}>
                  {i < 3 ? ['🥇', '🥈', '🥉'][i] : `#${i + 1}`}
                </div>
                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div>
                      <p className="font-black text-white text-sm">{song.title}</p>
                      <p className="text-xs text-gray-500">{song.artist}</p>
                    </div>
                    <div className="flex items-center gap-1 text-emerald-400 text-xs font-black flex-shrink-0">
                      <TrendingUp className="w-3.5 h-3.5" /> {song.trend}
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] text-gray-500">{song.mood}</span>
                    <span className="text-[10px] text-gray-700">·</span>
                    <span className="text-[10px] text-gray-500">{song.uses} usos</span>
                    <span className="text-[10px] text-gray-700">·</span>
                    <span className="text-[10px] text-gray-500">{song.duration}</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {song.platforms.map(p => (
                      <span key={p} className="text-[10px] px-2 py-0.5 bg-[#0b0c10] border border-white/6 rounded-full text-gray-400">
                        {PLATFORM_ICON[p] || '🌐'} {p}
                      </span>
                    ))}
                    {song.fit.map(f => (
                      <span key={f} className="text-[10px] px-2 py-0.5 bg-pink-500/8 border border-pink-500/20 rounded-full text-pink-400">
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
                <button className="w-8 h-8 rounded-xl bg-pink-500/15 border border-pink-500/25 flex items-center justify-center flex-shrink-0 hover:bg-pink-500/25 transition-colors">
                  <Play className="w-3.5 h-3.5 text-pink-400" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* ARIA tip */}
        <div className="mt-4 bg-gradient-to-r from-pink-900/20 to-rose-900/15 border border-pink-500/15 rounded-2xl p-4 flex gap-3 items-start">
          <Zap className="w-4 h-4 text-pink-400 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-gray-400">
            <strong className="text-pink-400">💡 Consejo ARIA:</strong> El algoritmo de TikTok e Instagram <strong className="text-white">prioriza el audio que ya está en tendencia.</strong> Usar una canción viral en las primeras 48h de su pico puede multiplicar tu alcance hasta 3x sin cambiar el contenido.
          </p>
        </div>
      </RCard>
    </div>
  );
}
