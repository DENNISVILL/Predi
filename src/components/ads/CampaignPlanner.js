import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, Play, Pause, CheckCircle2, Clock, TrendingUp, DollarSign } from 'lucide-react';

const plataformas = [
  { id: 'google', label: 'Google Ads', icon: '🔍', color: 'text-blue-400 bg-blue-500/10 border-blue-500/30', objetivos: ['Búsqueda', 'Display', 'Shopping', 'YouTube', 'Performance Max'] },
  { id: 'meta', label: 'Meta Ads', icon: '📘', color: 'text-blue-300 bg-blue-400/10 border-blue-400/30', objetivos: ['Alcance', 'Tráfico', 'Interacción', 'Conversiones', 'Ventas del catálogo'] },
  { id: 'tiktok', label: 'TikTok Ads', icon: '🎵', color: 'text-pink-400 bg-pink-500/10 border-pink-500/30', objetivos: ['Alcance', 'Tráfico', 'Interacción', 'Conversiones', 'Instalación App'] },
  { id: 'linkedin', label: 'LinkedIn Ads', icon: '💼', color: 'text-sky-400 bg-sky-500/10 border-sky-500/30', objetivos: ['Conocimiento de marca', 'Consideración', 'Conversiones', 'Generación de leads'] },
  { id: 'youtube', label: 'YouTube Ads', icon: '📺', color: 'text-red-400 bg-red-500/10 border-red-500/30', objetivos: ['Skippable In-Stream', 'Bumper Ads', 'Discovery', 'Masthead'] },
  { id: 'pinterest', label: 'Pinterest Ads', icon: '📌', color: 'text-pink-300 bg-pink-400/10 border-pink-400/30', objetivos: ['Alcance', 'Tráfico', 'Conversiones', 'Shopping'] },
];

const estadoConfig = {
  activa: { label: 'Activa', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30', icon: Play },
  pausada: { label: 'Pausada', color: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30', icon: Pause },
  planificada: { label: 'Planificada', color: 'text-blue-400 bg-blue-500/10 border-blue-500/30', icon: Clock },
  completada: { label: 'Completada', color: 'text-gray-400 bg-gray-500/10 border-gray-500/30', icon: CheckCircle2 },
};

const campañasEjemplo = [
  { id: 1, nombre: 'Captación Nuevos Clientes Q2', plataforma: 'meta', objetivo: 'Conversiones', presupuesto: 800, gastado: 342, conversiones: 28, roas: 4.2, estado: 'activa', inicio: '01 Abr', fin: '30 Abr' },
  { id: 2, nombre: 'Brand Awareness — Video', plataforma: 'tiktok', objetivo: 'Alcance', presupuesto: 400, gastado: 400, conversiones: 0, roas: 0, estado: 'completada', inicio: '01 Mar', fin: '31 Mar' },
  { id: 3, nombre: 'Retargeting Carrito Abandonado', plataforma: 'google', objetivo: 'Shopping', presupuesto: 300, gastado: 180, conversiones: 42, roas: 6.8, estado: 'activa', inicio: '15 Abr', fin: '30 Abr' },
  { id: 4, nombre: 'Generación de Leads B2B', plataforma: 'linkedin', objetivo: 'Generación de leads', presupuesto: 1200, gastado: 0, conversiones: 0, roas: 0, estado: 'planificada', inicio: '01 May', fin: '31 May' },
];

const CampaignPlanner = () => {
  const [campañas, setCampañas] = useState(campañasEjemplo);
  const [mostrando, setMostrando] = useState('todas');
  const [modal, setModal] = useState(false);
  const [nueva, setNueva] = useState({ nombre: '', plataforma: 'meta', objetivo: 'Conversiones', presupuesto: '', inicio: '', fin: '', estado: 'planificada' });

  const añadir = () => {
    if (!nueva.nombre || !nueva.presupuesto) return;
    setCampañas(prev => [...prev, { ...nueva, id: Date.now(), gastado: 0, conversiones: 0, roas: 0, presupuesto: parseFloat(nueva.presupuesto) }]);
    setModal(false);
    setNueva({ nombre: '', plataforma: 'meta', objetivo: 'Conversiones', presupuesto: '', inicio: '', fin: '', estado: 'planificada' });
  };

  const eliminar = (id) => setCampañas(prev => prev.filter(c => c.id !== id));

  const filtradas = mostrando === 'todas' ? campañas : campañas.filter(c => c.estado === mostrando);

  const totalPresupuesto = campañas.reduce((s, c) => s + c.presupuesto, 0);
  const totalGastado = campañas.reduce((s, c) => s + c.gastado, 0);
  const totalConversiones = campañas.reduce((s, c) => s + c.conversiones, 0);
  const roasPromedio = campañas.filter(c => c.roas > 0).length > 0
    ? (campañas.filter(c => c.roas > 0).reduce((s, c) => s + c.roas, 0) / campañas.filter(c => c.roas > 0).length).toFixed(1)
    : '—';

  return (
    <div className="p-6 md:p-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h3 className="text-xl font-bold text-white mb-1">Planificador de Campañas</h3>
          <p className="text-gray-400 text-sm">Gestiona todas tus campañas de pago desde una sola vista centralizada.</p>
        </div>
        <button onClick={() => setModal(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold px-4 py-2.5 rounded-xl text-sm hover:shadow-lg hover:shadow-red-500/20 transition-all flex-shrink-0">
          <Plus className="w-4 h-4" /> Nueva Campaña
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Presupuesto Total', value: `$${totalPresupuesto.toLocaleString()}`, color: 'text-white' },
          { label: 'Gasto Actual', value: `$${totalGastado.toLocaleString()}`, color: 'text-yellow-400' },
          { label: 'Conversiones', value: totalConversiones, color: 'text-emerald-400' },
          { label: 'ROAS Promedio', value: `${roasPromedio}x`, color: 'text-blue-400' },
        ].map((s, i) => (
          <div key={i} className="bg-[#1a1d24] rounded-xl border border-white/5 px-4 py-3.5">
            <div className={`text-2xl font-black ${s.color} mb-0.5`}>{s.value}</div>
            <div className="text-xs text-gray-500">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filtros */}
      <div className="flex gap-2 overflow-x-auto pb-1 mb-4">
        {['todas', 'activa', 'pausada', 'planificada', 'completada'].map(f => (
          <button key={f} onClick={() => setMostrando(f)}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex-shrink-0 border capitalize ${
              mostrando === f ? 'bg-red-500/15 border-red-500/50 text-white' : 'bg-[#1a1d24] border-white/5 text-gray-400 hover:text-white'
            }`}>
            {f === 'todas' ? 'Todas' : estadoConfig[f]?.label}
          </button>
        ))}
      </div>

      {/* Lista de campañas */}
      <div className="space-y-3">
        {filtradas.map(c => {
          const plat = plataformas.find(p => p.id === c.plataforma);
          const estado = estadoConfig[c.estado];
          const StatusIcon = estado.icon;
          const progreso = c.presupuesto > 0 ? Math.round((c.gastado / c.presupuesto) * 100) : 0;
          return (
            <motion.div key={c.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              className="bg-[#1a1d24] rounded-2xl border border-white/5 p-5 hover:border-white/10 transition-colors">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{plat?.icon}</span>
                  <div>
                    <h4 className="font-bold text-white text-sm">{c.nombre}</h4>
                    <p className="text-xs text-gray-500">{plat?.label} · {c.objetivo} · {c.inicio} → {c.fin}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-lg border ${estado.color}`}>
                    <StatusIcon className="w-3 h-3" /> {estado.label}
                  </span>
                  <button onClick={() => eliminar(c.id)} className="text-gray-600 hover:text-red-400 transition-colors">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-4 mb-2">
                <div className="flex-1">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>Gasto: ${c.gastado}</span>
                    <span>Presupuesto: ${c.presupuesto}</span>
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-1.5">
                    <div className={`h-1.5 rounded-full ${progreso >= 90 ? 'bg-red-500' : progreso >= 60 ? 'bg-yellow-500' : 'bg-emerald-500'}`}
                      style={{ width: `${Math.min(progreso, 100)}%` }} />
                  </div>
                </div>
                {c.conversiones > 0 && (
                  <div className="text-right flex-shrink-0">
                    <div className="text-xs text-gray-500">ROAS</div>
                    <div className={`text-sm font-black ${c.roas >= 4 ? 'text-emerald-400' : c.roas >= 2 ? 'text-yellow-400' : 'text-red-400'}`}>
                      {c.roas}x
                    </div>
                  </div>
                )}
              </div>
              {c.conversiones > 0 && (
                <div className="text-xs text-gray-500">
                  <span className="text-emerald-400 font-bold">{c.conversiones} conversiones</span> · CPA: ${c.gastado > 0 ? (c.gastado / c.conversiones).toFixed(2) : '—'}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Modal Nueva Campaña */}
      {modal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            className="bg-[#0e1117] border border-white/10 rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-lg font-bold text-white mb-5">Nueva Campaña</h3>
            <div className="space-y-4">
              {[
                { key: 'nombre', label: 'Nombre de la campaña', ph: 'Ej: Captación Clientes Mayo' },
                { key: 'presupuesto', label: 'Presupuesto ($)', ph: '500', type: 'number' },
                { key: 'inicio', label: 'Fecha inicio', type: 'date' },
                { key: 'fin', label: 'Fecha fin', type: 'date' },
              ].map(f => (
                <div key={f.key}>
                  <label className="text-xs text-gray-400 mb-1 block font-semibold uppercase tracking-wide">{f.label}</label>
                  <input type={f.type || 'text'} value={nueva[f.key]} onChange={e => setNueva(p => ({ ...p, [f.key]: e.target.value }))}
                    placeholder={f.ph}
                    className="w-full bg-[#1a1d24] border border-gray-700/80 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-red-500 transition-colors" />
                </div>
              ))}
              <div>
                <label className="text-xs text-gray-400 mb-1 block font-semibold uppercase tracking-wide">Plataforma</label>
                <select value={nueva.plataforma} onChange={e => setNueva(p => ({ ...p, plataforma: e.target.value }))}
                  className="w-full bg-[#1a1d24] border border-gray-700/80 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-red-500">
                  {plataformas.map(p => <option key={p.id} value={p.id}>{p.icon} {p.label}</option>)}
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setModal(false)} className="flex-1 bg-gray-800 text-gray-300 font-bold py-3 rounded-xl hover:bg-gray-700 transition-colors">
                Cancelar
              </button>
              <button onClick={añadir} className="flex-1 bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold py-3 rounded-xl hover:shadow-lg transition-all">
                Crear Campaña
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default CampaignPlanner;
