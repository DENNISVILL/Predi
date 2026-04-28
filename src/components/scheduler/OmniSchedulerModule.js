// ═══════════════════════════════════════════════════════════════
// PLANIFICADOR OMNI — Panel Unificado + Premium Polish
// Vistas: Calendario Mensual + Lista + Kanban + Pronóstico Anual
// El switch de vistas es UX correcto (no tabs de herramientas)
// Mejoras: Hero premium, nuevo post modal, ARIA recomendaciones
// ═══════════════════════════════════════════════════════════════
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar, List, Plus, Clock, CheckCircle2, AlertCircle,
  ChevronLeft, ChevronRight, Sparkles, Zap, Layout, BarChart2,
  Trash2, Edit3, XCircle, TrendingUp, Instagram, Twitter, Layers
} from 'lucide-react';
import AnnualForecast from './AnnualForecast';

// ── DATA ─────────────────────────────────────────────────────────
const INITIAL_POSTS = [
  { id: 1, dia: 1,  plataforma: 'instagram', titulo: 'Lanzamiento Colección Q2',        hora: '18:00', estado: 'programado', tipo: 'Reel' },
  { id: 2, dia: 3,  plataforma: 'tiktok',    titulo: 'Tutorial de unboxing',             hora: '20:00', estado: 'programado', tipo: 'Video' },
  { id: 3, dia: 5,  plataforma: 'instagram', titulo: 'Reels con música tendencia',      hora: '12:00', estado: 'pendiente',  tipo: 'Reel' },
  { id: 4, dia: 8,  plataforma: 'twitter',   titulo: 'Hilo: estrategia Q2',             hora: '10:00', estado: 'programado', tipo: 'Hilo' },
  { id: 5, dia: 10, plataforma: 'tiktok',    titulo: 'Dueto con influencer',            hora: '19:00', estado: 'pendiente',  tipo: 'Collab' },
  { id: 6, dia: 12, plataforma: 'instagram', titulo: 'Carrusel educativo',              hora: '15:00', estado: 'programado', tipo: 'Carrusel' },
  { id: 7, dia: 15, plataforma: 'instagram', titulo: 'Story: Encuesta Favorita',        hora: '11:00', estado: 'borrador',   tipo: 'Story' },
  { id: 8, dia: 18, plataforma: 'tiktok',    titulo: 'Sonido tendencia: Baile',         hora: '21:00', estado: 'programado', tipo: 'Video' },
  { id: 9, dia: 20, plataforma: 'twitter',   titulo: 'Encuesta semanal',               hora: '12:30', estado: 'pendiente',  tipo: 'Encuesta' },
  { id: 10,dia: 22, plataforma: 'instagram', titulo: 'LIVE producto nuevo',             hora: '20:00', estado: 'borrador',   tipo: 'LIVE' },
  { id: 11,dia: 25, plataforma: 'instagram', titulo: 'Detrás de cámaras',             hora: '17:00', estado: 'programado', tipo: 'Reel' },
  { id: 12,dia: 28, plataforma: 'tiktok',    titulo: 'Resumen del mes',               hora: '19:00', estado: 'programado', tipo: 'Video' },
];

const PLAT_CFG = {
  instagram: { label: 'Instagram', icono: '📷', colorTxt: 'text-pink-400',  colorBg: 'bg-pink-500/10 border-pink-500/30' },
  tiktok:    { label: 'TikTok',    icono: '🎵', colorTxt: 'text-white',     colorBg: 'bg-gray-700/30 border-gray-600/30' },
  twitter:   { label: 'X (Twitter)', icono: '𝕏',colorTxt: 'text-sky-400',  colorBg: 'bg-sky-500/10 border-sky-500/30' },
  linkedin:  { label: 'LinkedIn',  icono: '💼', colorTxt: 'text-blue-400',  colorBg: 'bg-blue-500/10 border-blue-500/30' },
  youtube:   { label: 'YouTube Shorts', icono: '▶️', colorTxt: 'text-red-400', colorBg: 'bg-red-500/10 border-red-500/30' },
};

const ESTADO_CFG = {
  programado: { label: 'Programado', color: 'text-emerald-400', dot: 'bg-emerald-400', icon: CheckCircle2,  bg: 'bg-emerald-500/10 border-emerald-500/30' },
  pendiente:  { label: 'Pendiente',  color: 'text-amber-400',   dot: 'bg-amber-400',   icon: Clock,         bg: 'bg-amber-500/10 border-amber-500/30' },
  borrador:   { label: 'Borrador',   color: 'text-gray-400',    dot: 'bg-gray-500',    icon: AlertCircle,   bg: 'bg-gray-500/10 border-gray-500/30' },
};

const TIPOS = ['Reel', 'Video', 'Carrusel', 'Story', 'LIVE', 'Hilo', 'Encuesta', 'Collab', 'Foto'];
const DIAS_SEMANA = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

const ARIA_TIPS = [
  { day: 'Martes', time: '18:00–20:00', reason: 'pico de actividad en Instagram y TikTok para tu nicho.' },
  { day: 'Jueves', time: '12:00–14:00', reason: 'máximo engagement en LinkedIn (horario laboral activo).' },
  { day: 'Domingo', time: '19:00–21:00', reason: 'la audiencia está relajada y consume más contenido ocioso.' },
];

// ── MODAL NUEVO POST ──────────────────────────────────────────────
function NewPostModal({ onSave, onClose, dia }) {
  const [form, setForm] = useState({
    titulo: '', plataforma: 'instagram', hora: '18:00', estado: 'borrador', tipo: 'Reel', dia: dia || 1,
  });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      onClick={e => e.target === e.currentTarget && onClose()}>
      <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
        className="bg-[#0e1117] border border-white/10 rounded-2xl w-full max-w-md">
        <div className="flex items-center justify-between p-5 border-b border-white/5">
          <h3 className="font-bold text-white flex items-center gap-2"><Plus className="w-4 h-4 text-indigo-400" />Nueva Publicación</h3>
          <button onClick={onClose}><XCircle className="w-5 h-5 text-gray-500 hover:text-white transition-colors" /></button>
        </div>
        <div className="p-5 flex flex-col gap-4">
          <div>
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1">Título / Descripción</label>
            <input value={form.titulo} onChange={e => set('titulo', e.target.value)} placeholder="¿De qué trata este post?"
              className="w-full bg-[#0b0c10] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-indigo-500/50 placeholder-gray-600" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1">Plataforma</label>
              <select value={form.plataforma} onChange={e => set('plataforma', e.target.value)}
                className="w-full bg-[#0b0c10] border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-indigo-500/50">
                {Object.entries(PLAT_CFG).map(([k, v]) => <option key={k} value={k}>{v.icono} {v.label}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1">Tipo</label>
              <select value={form.tipo} onChange={e => set('tipo', e.target.value)}
                className="w-full bg-[#0b0c10] border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-indigo-500/50">
                {TIPOS.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1">Día del mes</label>
              <input type="number" min={1} max={31} value={form.dia} onChange={e => set('dia', +e.target.value)}
                className="w-full bg-[#0b0c10] border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-indigo-500/50" />
            </div>
            <div>
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1">Hora</label>
              <input type="time" value={form.hora} onChange={e => set('hora', e.target.value)}
                className="w-full bg-[#0b0c10] border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-indigo-500/50" />
            </div>
          </div>
          <div>
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1">Estado</label>
            <div className="flex gap-2">
              {Object.entries(ESTADO_CFG).map(([k, v]) => (
                <button key={k} onClick={() => set('estado', k)}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${form.estado === k ? `${v.bg} text-white` : 'bg-[#111318] border-white/6 text-gray-500 hover:text-white'}`}>
                  {v.label}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-2 p-5 border-t border-white/5">
          <button onClick={onClose} className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors">Cancelar</button>
          <button onClick={() => form.titulo && onSave({ ...form, id: Date.now() })}
            disabled={!form.titulo}
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-sm transition-all disabled:opacity-40 shadow-lg shadow-indigo-500/20">
            Agregar Post
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════
export default function OmniSchedulerModule({ onNavigateToCreate }) {
  const [posts, setPosts]             = useState(INITIAL_POSTS);
  const [vista, setVista]             = useState('calendario');
  const [filtroPlatform, setFiltro]   = useState('todas');
  const [diaSeleccionado, setDia]     = useState(null);
  const [showModal, setShowModal]     = useState(false);
  const [modalDia, setModalDia]       = useState(null);
  const [expandedTip, setExpandedTip] = useState(null);

  const filtered = filtroPlatform === 'todas' ? posts : posts.filter(p => p.plataforma === filtroPlatform);

  const getPostsDia = (dia) => filtered.filter(p => p.dia === dia);

  const stats = useMemo(() => ({
    total:      posts.length,
    programado: posts.filter(p => p.estado === 'programado').length,
    pendiente:  posts.filter(p => p.estado === 'pendiente').length,
    borrador:   posts.filter(p => p.estado === 'borrador').length,
    cobertura:  new Set(posts.map(p => p.dia)).size,
  }), [posts]);

  const addPost = (data) => { setPosts(p => [...p, data]); setShowModal(false); };
  const deletePost = (id) => setPosts(p => p.filter(x => x.id !== id));

  const VIEWS = [
    { id: 'calendario', label: 'Calendario', icon: Calendar },
    { id: 'lista',      label: 'Lista',      icon: List },
    { id: 'kanban',     label: 'Kanban',     icon: Layout },
    { id: 'forecast',   label: 'Pronóstico', icon: BarChart2 },
  ];

  const PLATFORMS = [
    { id: 'todas',     label: '🌐 Todas' },
    { id: 'instagram', label: '📷 Instagram' },
    { id: 'tiktok',    label: '🎵 TikTok' },
    { id: 'twitter',   label: '𝕏 Twitter/X' },
    { id: 'linkedin',  label: '💼 LinkedIn' },
  ];

  return (
    <div className="w-full flex flex-col gap-5 pb-20 md:pb-0">

      {/* ══ HERO ══ */}
      <div className="bg-gradient-to-r from-indigo-950/60 to-violet-950/50 border border-indigo-500/20 rounded-2xl px-6 py-5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-violet-500/6 rounded-full blur-[100px] pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/20 border border-indigo-500/30 rounded-full mb-3">
              <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
              <span className="text-xs font-bold text-indigo-300">✦ Calendario Predictivo · IA Activa</span>
            </div>
            <h1 className="text-2xl font-black text-white flex items-center gap-2 mb-1">
              <Calendar className="w-6 h-6 text-indigo-400" /> Planificador Omni
            </h1>
            <p className="text-indigo-200/60 text-sm">Visualiza y automatiza tu contenido en todas las plataformas desde un solo lugar.</p>
          </div>
          {/* Stats */}
          <div className="flex gap-3 flex-shrink-0">
            {[
              { label: 'Total Posts',   value: stats.total,     color: 'text-indigo-400' },
              { label: 'Programados',   value: stats.programado, color: 'text-emerald-400' },
              { label: 'Días cubiertos', value: `${stats.cobertura}/30`, color: 'text-white' },
            ].map((s, i) => (
              <div key={i} className="bg-black/30 border border-white/8 rounded-xl px-4 py-2.5 text-center min-w-[80px]">
                <div className={`text-lg font-black ${s.color}`}>{s.value}</div>
                <div className="text-[10px] text-gray-500 mt-0.5">{s.label}</div>
              </div>
            ))}
            <button onClick={() => setShowModal(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold px-5 py-2.5 rounded-xl shadow-lg shadow-indigo-500/20 transition-all text-sm flex-shrink-0">
              <Plus className="w-4 h-4" /> Nuevo Post
            </button>
          </div>
        </div>
      </div>

      {/* ══ CONTROLES ══ */}
      <div className="flex flex-col md:flex-row gap-3 items-start md:items-center">
        {/* Vista toggle */}
        <div className="flex bg-[#111318] border border-white/5 rounded-xl p-1 gap-1">
          {VIEWS.map(v => {
            const Icon = v.icon;
            return (
              <button key={v.id} onClick={() => setVista(v.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${vista === v.id ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'text-gray-500 hover:text-white'}`}>
                <Icon className="w-4 h-4" /> <span className="hidden sm:inline">{v.label}</span>
              </button>
            );
          })}
        </div>
        {/* Plataforma filter */}
        <div className="flex gap-2 overflow-x-auto pb-1 flex-1">
          {PLATFORMS.map(p => (
            <button key={p.id} onClick={() => setFiltro(p.id)}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex-shrink-0 border ${filtroPlatform === p.id ? 'bg-indigo-500/15 border-indigo-500/40 text-white' : 'bg-[#111318] border-white/5 text-gray-500 hover:text-white'}`}>
              {p.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1.5 text-[10px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-full px-2.5 py-1.5 flex-shrink-0">
          <AlertCircle className="w-3 h-3" /> {stats.pendiente} pendientes
        </div>
      </div>

      {/* ══ VISTAS ══ */}
      <AnimatePresence mode="wait">

        {/* — CALENDARIO — */}
        {vista === 'calendario' && (
          <motion.div key="cal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="bg-[#0e1117] rounded-2xl border border-white/5 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
              <h3 className="text-base font-bold text-white">Abril 2026</h3>
              <div className="flex gap-2">
                {[ChevronLeft, ChevronRight].map((Icon, i) => (
                  <button key={i} className="p-1.5 bg-[#111318] hover:bg-white/10 rounded-lg transition-colors text-gray-500 hover:text-white border border-white/6">
                    <Icon className="w-4 h-4" />
                  </button>
                ))}
              </div>
            </div>
            {/* Días semana */}
            <div className="grid grid-cols-7 border-b border-white/5">
              {DIAS_SEMANA.map(d => (
                <div key={d} className="py-2.5 text-center text-[10px] font-bold text-gray-600 uppercase tracking-wider">{d}</div>
              ))}
            </div>
            {/* Grid */}
            <div className="grid grid-cols-7">
              {[...Array(3)].map((_, i) => (
                <div key={`e${i}`} className="border-r border-b border-white/4 min-h-[90px] bg-[#0a0d12] last:border-r-0" />
              ))}
              {[...Array(30)].map((_, i) => {
                const dia = i + 1;
                const dayPosts = getPostsDia(dia);
                const esHoy = dia === 17;
                const sel = diaSeleccionado === dia;
                return (
                  <div key={dia} onClick={() => setDia(sel ? null : dia)}
                    className={`border-r border-b border-white/4 min-h-[90px] p-1.5 cursor-pointer transition-colors relative ${sel ? 'bg-indigo-500/10' : 'hover:bg-white/[0.02]'} ${(i + 3) % 7 === 6 ? 'border-r-0' : ''}`}>
                    <div className={`w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold mb-1.5 ${esHoy ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/30' : 'text-gray-500'}`}>
                      {dia}
                    </div>
                    <div className="space-y-0.5">
                      {dayPosts.slice(0, 2).map(p => (
                        <div key={p.id} className={`text-[9px] px-1 py-0.5 rounded border truncate font-bold ${PLAT_CFG[p.plataforma]?.colorBg} ${PLAT_CFG[p.plataforma]?.colorTxt}`}>
                          {PLAT_CFG[p.plataforma]?.icono} {p.tipo}
                        </div>
                      ))}
                      {dayPosts.length > 2 && <div className="text-[9px] text-gray-600 pl-1">+{dayPosts.length - 2}</div>}
                    </div>
                    {dayPosts.length === 0 && (
                      <button onClick={e => { e.stopPropagation(); setModalDia(dia); setShowModal(true); }}
                        className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 text-gray-700 hover:text-indigo-400 transition-opacity text-lg">
                        +
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
            {/* Detalle día */}
            <AnimatePresence>
              {diaSeleccionado && getPostsDia(diaSeleccionado).length > 0 && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                  className="border-t border-indigo-500/25 bg-indigo-500/5 overflow-hidden">
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-bold text-white text-sm">📅 Día {diaSeleccionado} — {getPostsDia(diaSeleccionado).length} publicaciones</h4>
                      <button onClick={() => { setModalDia(diaSeleccionado); setShowModal(true); }}
                        className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 font-bold transition-colors">
                        <Plus className="w-3.5 h-3.5" /> Agregar
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {getPostsDia(diaSeleccionado).map(p => {
                        const estado = ESTADO_CFG[p.estado];
                        const plat = PLAT_CFG[p.plataforma];
                        return (
                          <div key={p.id} className="bg-[#111318] rounded-xl border border-white/5 p-3 group">
                            <div className="flex justify-between items-start mb-2">
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg border ${plat?.colorBg} ${plat?.colorTxt}`}>{plat?.icono} {plat?.label}</span>
                              <div className="flex items-center gap-1">
                                <div className={`flex items-center gap-1 text-[10px] font-bold ${estado.color}`}>
                                  <span className={`w-1.5 h-1.5 rounded-full ${estado.dot}`} /> {estado.label}
                                </div>
                                <button onClick={() => deletePost(p.id)} className="text-gray-700 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100 ml-1">
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                            <p className="font-bold text-white text-xs mb-2 leading-snug">{p.titulo}</p>
                            <div className="flex justify-between text-xs text-gray-600">
                              <span>🕐 {p.hora}</span>
                              <span className="bg-[#0b0c10] px-1.5 py-0.5 rounded font-medium">{p.tipo}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* — LISTA — */}
        {vista === 'lista' && (
          <motion.div key="lista" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="bg-[#0e1117] rounded-2xl border border-white/5 overflow-hidden">
            <div className="px-6 py-4 border-b border-white/5 flex justify-between items-center">
              <h3 className="font-bold text-white text-sm">Contenido programado ({filtered.length})</h3>
              <div className="flex items-center gap-2 text-xs text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1.5 rounded-full">
                <Zap className="w-3 h-3" /> IA optimizando horarios
              </div>
            </div>
            <div className="divide-y divide-white/4">
              {filtered.sort((a, b) => a.dia - b.dia || a.hora.localeCompare(b.hora)).map(p => {
                const estado = ESTADO_CFG[p.estado];
                const plat = PLAT_CFG[p.plataforma];
                const StatusIcon = estado.icon;
                return (
                  <div key={p.id} className="flex items-center gap-4 px-6 py-3.5 hover:bg-white/[0.02] transition-colors group">
                    <div className="w-9 h-9 rounded-xl bg-[#111318] flex items-center justify-center text-lg flex-shrink-0 border border-white/5">{plat?.icono}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-semibold text-sm truncate">{p.titulo}</p>
                      <p className="text-xs text-gray-500">{plat?.label} · Día {p.dia} · {p.hora}</p>
                    </div>
                    <span className="hidden md:block text-xs bg-[#111318] border border-white/5 text-gray-400 px-2 py-1 rounded-lg font-medium">{p.tipo}</span>
                    <div className={`flex items-center gap-1.5 text-xs font-bold ${estado.color}`}>
                      <StatusIcon className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">{estado.label}</span>
                    </div>
                    <button onClick={() => deletePost(p.id)} className="text-gray-700 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* — KANBAN — */}
        {vista === 'kanban' && (
          <motion.div key="kanban" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {['borrador', 'pendiente', 'programado'].map(col => {
              const postsCol = filtered.filter(p => p.estado === col);
              const config = ESTADO_CFG[col];
              return (
                <div key={col} className="bg-[#0e1117] rounded-2xl border border-white/5 p-4 flex flex-col min-h-[400px]">
                  <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/5">
                    <h4 className={`font-bold text-sm ${config.color} flex items-center gap-2`}>
                      <config.icon className="w-4 h-4" /> {config.label}
                    </h4>
                    <span className="bg-[#111318] text-gray-400 text-xs font-bold px-2 py-1 rounded-lg border border-white/5">{postsCol.length}</span>
                  </div>
                  <div className="flex-1 space-y-3">
                    <AnimatePresence>
                      {postsCol.map(p => {
                        const plat = PLAT_CFG[p.plataforma];
                        return (
                          <motion.div key={p.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="bg-[#111318] border border-white/5 rounded-xl p-4 hover:border-indigo-500/30 transition-colors group">
                            <div className="flex justify-between items-start mb-2">
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${plat?.colorBg} ${plat?.colorTxt}`}>
                                {plat?.icono} {plat?.label}
                              </span>
                              <div className="flex items-center gap-1">
                                <span className="text-gray-600 text-xs">Día {p.dia}</span>
                                <button onClick={() => deletePost(p.id)} className="text-gray-700 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100 ml-1">
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                            <p className="text-white font-bold text-sm mb-2 leading-snug">{p.titulo}</p>
                            <div className="flex justify-between text-xs text-gray-600">
                              <span className="bg-[#0b0c10] px-1.5 py-0.5 rounded font-medium border border-white/5">{p.tipo}</span>
                              <span>🕐 {p.hora}</span>
                            </div>
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>
                    {postsCol.length === 0 && (
                      <div className="h-32 flex flex-col items-center justify-center text-gray-700 text-xs border-2 border-dashed border-white/5 rounded-xl gap-2">
                        <span>Sin posts en esta columna</span>
                        <button onClick={() => setShowModal(true)} className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors">
                          <Plus className="w-3 h-3" /> Agregar
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </motion.div>
        )}

        {/* — PRONÓSTICO ANUAL — */}
        {vista === 'forecast' && (
          <motion.div key="forecast" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="bg-[#0e1117] rounded-2xl border border-white/5 overflow-hidden">
            <AnnualForecast />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══ RECOMENDACIONES ARIA ══ */}
      <div className="bg-[#0e1117] border border-white/5 rounded-2xl overflow-hidden">
        <div className="flex items-center gap-3 px-5 py-3.5 border-b border-white/5">
          <div className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="font-bold text-white text-sm">Recomendaciones de ARIA</p>
            <p className="text-xs text-gray-500">Ventanas de oro según el comportamiento de tu audiencia</p>
          </div>
        </div>
        <div className="divide-y divide-white/4">
          {ARIA_TIPS.map((tip, i) => (
            <button key={i} onClick={() => setExpandedTip(expandedTip === i ? null : i)}
              className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-white/[0.02] transition-colors text-left">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-indigo-500/15 border border-indigo-500/25 flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-4 h-4 text-indigo-400" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">{tip.day} · {tip.time}</p>
                  <p className="text-xs text-gray-500 truncate max-w-[300px]">{tip.reason}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={e => { e.stopPropagation(); setModalDia(null); setShowModal(true); }}
                  className="text-xs bg-indigo-500/15 hover:bg-indigo-500/25 border border-indigo-500/30 text-indigo-300 px-3 py-1.5 rounded-xl font-bold transition-all flex-shrink-0">
                  Rellenar hueco
                </button>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* ══ MODAL ══ */}
      <AnimatePresence>
        {showModal && <NewPostModal onSave={addPost} onClose={() => { setShowModal(false); setModalDia(null); }} dia={modalDia} />}
      </AnimatePresence>
    </div>
  );
}
