import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar, List, Plus, Clock, CheckCircle2, AlertCircle,
  ChevronLeft, ChevronRight, Sparkles, Zap, Layout, BarChart2
} from 'lucide-react';
import AnnualForecast from './AnnualForecast';

const publicaciones = [
  { id: 1, dia: 1, plataforma: 'instagram', titulo: 'Lanzamiento Colección Q2', hora: '18:00', estado: 'programado', tipo: 'Reel' },
  { id: 2, dia: 3, plataforma: 'tiktok', titulo: 'Tutorial de unboxing', hora: '20:00', estado: 'programado', tipo: 'Video' },
  { id: 3, dia: 5, plataforma: 'instagram', titulo: 'Reels con música tendencia', hora: '12:00', estado: 'pendiente', tipo: 'Reel' },
  { id: 4, dia: 8, plataforma: 'twitter', titulo: 'Hilo: estrategia Q2', hora: '10:00', estado: 'programado', tipo: 'Hilo' },
  { id: 5, dia: 10, plataforma: 'tiktok', titulo: 'Dueto con influencer', hora: '19:00', estado: 'pendiente', tipo: 'Collab' },
  { id: 6, dia: 12, plataforma: 'instagram', titulo: 'Carrusel educativo', hora: '15:00', estado: 'programado', tipo: 'Carrusel' },
  { id: 7, dia: 15, plataforma: 'instagram', titulo: 'Story "Encuesta Favorita"', hora: '11:00', estado: 'borrador', tipo: 'Story' },
  { id: 8, dia: 18, plataforma: 'tiktok', titulo: 'Sonido tendencia: Baile', hora: '21:00', estado: 'programado', tipo: 'Video' },
  { id: 9, dia: 20, plataforma: 'twitter', titulo: 'Encuesta semanal', hora: '12:30', estado: 'pendiente', tipo: 'Encuesta' },
  { id: 10, dia: 22, plataforma: 'instagram', titulo: 'LIVE producto nuevo', hora: '20:00', estado: 'borrador', tipo: 'LIVE' },
  { id: 11, dia: 25, plataforma: 'instagram', titulo: 'Detrás de cámaras', hora: '17:00', estado: 'programado', tipo: 'Reel' },
  { id: 12, dia: 28, plataforma: 'tiktok', titulo: 'Resumen del mes', hora: '19:00', estado: 'programado', tipo: 'Video' },
];

const plataformaConfig = {
  instagram: { label: 'Instagram', icono: '📷', colorTxt: 'text-pink-400', colorBg: 'bg-pink-500/10 border-pink-500/30' },
  tiktok: { label: 'TikTok', icono: '🎵', colorTxt: 'text-gray-200', colorBg: 'bg-gray-700/30 border-gray-600/30' },
  twitter: { label: 'X (Twitter)', icono: '𝕏', colorTxt: 'text-sky-400', colorBg: 'bg-sky-500/10 border-sky-500/30' },
};

const estadoConfig = {
  programado: { label: 'Programado', color: 'text-[#00ff9d]', dot: 'bg-[#00ff9d]', icon: CheckCircle2 },
  pendiente: { label: 'Pendiente', color: 'text-yellow-400', dot: 'bg-yellow-400', icon: Clock },
  borrador: { label: 'Borrador', color: 'text-gray-400', dot: 'bg-gray-500', icon: AlertCircle },
};

const DIAS_SEMANA = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

const OmniSchedulerModule = ({ onNavigateToCreate, scheduledReminders = [] }) => {
  const [vista, setVista] = useState('calendario');
  const [diaSeleccionado, setDiaSeleccionado] = useState(null);
  const [filtroPlatform, setFiltroPlatform] = useState('todas');

  const filtradas = filtroPlatform === 'todas' ? publicaciones : publicaciones.filter(p => p.plataforma === filtroPlatform);

  const getPublicacionesDia = (dia) =>
    publicaciones.filter(p => p.dia === dia && (filtroPlatform === 'todas' || p.plataforma === filtroPlatform));

  const stats = {
    total: publicaciones.length,
    programado: publicaciones.filter(p => p.estado === 'programado').length,
    pendiente: publicaciones.filter(p => p.estado === 'pendiente').length,
    borrador: publicaciones.filter(p => p.estado === 'borrador').length,
  };

  return (
    <div className="w-full flex flex-col gap-4 pb-20 md:pb-0">
      {/* Banner compacto */}
      <div className="bg-gradient-to-r from-indigo-900/50 to-violet-900/50 border border-indigo-500/20 rounded-2xl px-6 py-5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-violet-500/10 rounded-full blur-[60px] pointer-events-none" />
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/20 border border-indigo-500/30 rounded-full mb-3">
              <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
              <span className="text-xs font-semibold text-indigo-300">Calendario Predictivo</span>
            </div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Calendar className="w-6 h-6 text-indigo-400" /> Planificador Omni
            </h2>
            <p className="text-indigo-200/80 text-sm mt-1">Visualiza y automatiza tu contenido en todas las plataformas desde un solo lugar.</p>
          </div>
          <button onClick={onNavigateToCreate}
            className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-violet-500 text-white font-bold px-5 py-2.5 rounded-xl hover:shadow-lg hover:shadow-indigo-500/25 transition-all text-sm flex-shrink-0">
            <Plus className="w-4 h-4" /> Nuevo Contenido
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Total', value: stats.total, color: 'text-indigo-400' },
          { label: 'Programados', value: stats.programado, color: 'text-[#00ff9d]' },
          { label: 'Pendientes', value: stats.pendiente, color: 'text-yellow-400' },
          { label: 'Borradores', value: stats.borrador, color: 'text-gray-400' },
        ].map((s, i) => (
          <div key={i} className="bg-[#1a1d24] rounded-xl border border-white/5 px-5 py-4">
            <div className={`text-2xl font-black ${s.color} mb-0.5`}>{s.value}</div>
            <div className="text-xs text-gray-500">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Controles */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
        <div className="flex bg-[#111318] border border-white/5 rounded-xl p-1 gap-1">
          <button onClick={() => setVista('calendario')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${vista === 'calendario' ? 'bg-indigo-500 text-white' : 'text-gray-400 hover:text-white'}`}>
            <Calendar className="w-4 h-4" /> Calendario
          </button>
          <button onClick={() => setVista('lista')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${vista === 'lista' ? 'bg-indigo-500 text-white' : 'text-gray-400 hover:text-white'}`}>
            <List className="w-4 h-4" /> Lista
          </button>
          <button onClick={() => setVista('kanban')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${vista === 'kanban' ? 'bg-indigo-500 text-white' : 'text-gray-400 hover:text-white'}`}>
            <Layout className="w-4 h-4" /> Kanban
          </button>
          <button onClick={() => setVista('forecast')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${vista === 'forecast' ? 'bg-blue-500 text-white' : 'text-gray-400 hover:text-white'}`}>
            <BarChart2 className="w-4 h-4" /> Pronóstico
          </button>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {[{ id: 'todas', label: '🌐 Todas' }, { id: 'instagram', label: '📷 Instagram' }, { id: 'tiktok', label: '🎵 TikTok' }, { id: 'twitter', label: '𝕏 Twitter' }].map(p => (
            <button key={p.id} onClick={() => setFiltroPlatform(p.id)}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex-shrink-0 ${filtroPlatform === p.id ? 'bg-indigo-500 text-white' : 'bg-[#1a1d24] border border-white/5 text-gray-400 hover:text-white'}`}>
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Contenido principal */}
      <AnimatePresence mode="wait">
        {vista === 'calendario' ? (
          <motion.div key="cal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="bg-[#0e1117] rounded-2xl border border-white/5 overflow-hidden">
            {/* Encabezado del calendario */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
              <h3 className="text-lg font-bold text-white">Abril 2026</h3>
              <div className="flex gap-2">
                {[ChevronLeft, ChevronRight].map((Icon, i) => (
                  <button key={i} className="p-1.5 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors text-gray-400 hover:text-white">
                    <Icon className="w-4 h-4" />
                  </button>
                ))}
              </div>
            </div>
            {/* Días de la semana */}
            <div className="grid grid-cols-7 border-b border-white/5">
              {DIAS_SEMANA.map(d => (
                <div key={d} className="py-2.5 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">{d}</div>
              ))}
            </div>
            {/* Cuadrícula */}
            <div className="grid grid-cols-7">
              {[...Array(3)].map((_, i) => (
                <div key={`e${i}`} className="border-r border-b border-white/5 min-h-[80px] bg-[#0a0d12]" />
              ))}
              {[...Array(30)].map((_, i) => {
                const dia = i + 1;
                const posts = getPublicacionesDia(dia);
                const esHoy = dia === 17;
                const seleccionado = diaSeleccionado === dia;
                return (
                  <div key={dia} onClick={() => setDiaSeleccionado(seleccionado ? null : dia)}
                    className={`border-r border-b border-white/5 min-h-[80px] p-1.5 cursor-pointer transition-colors ${seleccionado ? 'bg-indigo-500/10' : 'hover:bg-white/[0.02]'}`}>
                    <div className={`w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold mb-1.5 ${esHoy ? 'bg-indigo-500 text-white' : 'text-gray-500'}`}>{dia}</div>
                    <div className="space-y-0.5">
                      {posts.slice(0, 2).map(p => (
                        <div key={p.id} className={`text-[9px] px-1 py-0.5 rounded border truncate font-medium ${plataformaConfig[p.plataforma]?.colorBg} ${plataformaConfig[p.plataforma]?.colorTxt}`}>
                          {p.tipo}: {p.titulo.slice(0, 12)}…
                        </div>
                      ))}
                      {posts.length > 2 && <div className="text-[9px] text-gray-600 pl-1">+{posts.length - 2} más</div>}
                    </div>
                  </div>
                );
              })}
            </div>
            {/* Panel de detalle */}
            <AnimatePresence>
              {diaSeleccionado && getPublicacionesDia(diaSeleccionado).length > 0 && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                  className="border-t border-indigo-500/30 bg-indigo-500/5 overflow-hidden">
                  <div className="p-5">
                    <h4 className="font-bold text-white text-sm mb-4">📅 Publicaciones del día {diaSeleccionado}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {getPublicacionesDia(diaSeleccionado).map(p => {
                        const estado = estadoConfig[p.estado];
                        const plat = plataformaConfig[p.plataforma];
                        return (
                          <div key={p.id} className="bg-[#1a1d24] rounded-xl border border-white/5 p-3">
                            <div className="flex justify-between items-start mb-2">
                              <span className={`text-xs font-bold px-2 py-0.5 rounded-lg border ${plat?.colorBg} ${plat?.colorTxt}`}>{plat?.icono} {plat?.label}</span>
                              <div className={`flex items-center gap-1 text-xs font-bold ${estado.color}`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${estado.dot}`} />
                                {estado.label}
                              </div>
                            </div>
                            <p className="font-bold text-white text-xs mb-1.5 leading-snug">{p.titulo}</p>
                            <div className="flex justify-between items-center text-xs text-gray-500">
                              <span>🕐 {p.hora}</span>
                              <span className="bg-gray-800 px-1.5 py-0.5 rounded font-medium">{p.tipo}</span>
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
        ) : vista === 'lista' ? (
          <motion.div key="lista" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="bg-[#0e1117] rounded-2xl border border-white/5 overflow-hidden">
            <div className="px-6 py-4 border-b border-white/5 flex justify-between items-center">
              <h3 className="font-bold text-white text-sm">Contenido programado ({filtradas.length})</h3>
              <div className="flex items-center gap-2 text-xs text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1.5 rounded-full">
                <Zap className="w-3 h-3" /> IA optimizando horarios
              </div>
            </div>
            <div className="divide-y divide-white/5">
              {filtradas.map(p => {
                const estado = estadoConfig[p.estado];
                const plat = plataformaConfig[p.plataforma];
                const StatusIcon = estado.icon;
                return (
                  <div key={p.id} className="flex items-center gap-4 px-6 py-3.5 hover:bg-white/[0.02] transition-colors">
                    <div className="w-9 h-9 rounded-xl bg-gray-800 flex items-center justify-center text-lg flex-shrink-0">{plat?.icono}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-semibold text-sm truncate">{p.titulo}</p>
                      <p className="text-xs text-gray-500">{plat?.label} · Día {p.dia} · {p.hora}</p>
                    </div>
                    <span className="hidden md:block text-xs bg-gray-800 text-gray-300 px-2 py-1 rounded-lg font-medium">{p.tipo}</span>
                    <div className={`flex items-center gap-1.5 text-xs font-bold ${estado.color} whitespace-nowrap`}>
                      <StatusIcon className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">{estado.label}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        ) : (
          <motion.div key="kanban" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {['borrador', 'pendiente', 'programado'].map(col => {
              const postsCol = filtradas.filter(p => p.estado === col);
              const config = estadoConfig[col];
              return (
                <div key={col} className="bg-[#0e1117] rounded-2xl border border-white/5 p-4 flex flex-col h-full min-h-[400px]">
                  <div className="flex justify-between items-center mb-4 pb-3 border-b border-white/5">
                    <h4 className={`font-bold text-sm ${config.color} flex items-center gap-2`}>
                      <config.icon className="w-4 h-4" /> {config.label}
                    </h4>
                    <span className="bg-[#1a1d24] text-gray-400 text-xs font-bold px-2 py-1 rounded-md">{postsCol.length}</span>
                  </div>
                  <div className="flex-1 space-y-3">
                    {postsCol.map(p => {
                      const plat = plataformaConfig[p.plataforma];
                      return (
                        <div key={p.id} className="bg-[#1a1d24] border border-white/5 rounded-xl p-4 cursor-grab active:cursor-grabbing hover:border-indigo-500/30 transition-colors">
                          <div className="flex justify-between items-start mb-2">
                            <span className={`text-[10px] font-bold px-2 py-1 rounded border ${plat?.colorBg} ${plat?.colorTxt}`}>
                              {plat?.icono} {plat?.label}
                            </span>
                            <span className="text-gray-500 text-xs">Día {p.dia}</span>
                          </div>
                          <p className="text-white font-bold text-sm mb-2">{p.titulo}</p>
                          <div className="flex justify-between items-center text-xs">
                            <span className="bg-gray-800 text-gray-300 px-2 py-1 rounded-md">{p.tipo}</span>
                            <span className="text-gray-500">{p.hora}</span>
                          </div>
                        </div>
                      );
                    })}
                    {postsCol.length === 0 && (
                      <div className="h-full flex items-center justify-center text-gray-600 text-xs border-2 border-dashed border-white/5 rounded-xl py-8">
                        Soltar aquí
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Annual Forecast Tab */}
      {vista === 'forecast' && (
        <motion.div key="forecast" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="bg-[#0e1117] rounded-2xl border border-white/5 overflow-hidden">
          <AnnualForecast />
        </motion.div>
      )}

      {/* Banner IA */}
      <div className="bg-indigo-500/10 border border-indigo-500/25 rounded-2xl p-4 flex items-center gap-4">
        <div className="w-9 h-9 bg-indigo-500 rounded-xl flex items-center justify-center flex-shrink-0">
          <Sparkles className="w-4 h-4 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-white text-sm">💡 Recomendación de la IA</p>
          <p className="text-xs text-indigo-200/70 mt-0.5">Los Martes y Jueves entre 18:00–20:00 son tu ventana de oro. Tienes 2 días libres esta semana sin publicación.</p>
        </div>
        <button className="flex-shrink-0 bg-indigo-500 hover:bg-indigo-600 text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors">
          Rellenar huecos
        </button>
      </div>
    </div>
  );
};

export default OmniSchedulerModule;
