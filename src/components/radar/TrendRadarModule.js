import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, Music, Hash, TrendingUp, Globe, Zap } from 'lucide-react';
import IntelligentRadar from '../IntelligentRadar';
import ViralMusicTracker from '../ViralMusicTracker';

const TrendRadarModule = ({ scheduledReminders = [], onSendHashtagMix }) => {
  const [activeTab, setActiveTab] = useState('radar');

  const tabs = [
    { id: 'radar', label: 'Radar de Tendencias', icon: Target },
    { id: 'hashtags', label: 'Análisis de Hashtags', icon: Hash },
    { id: 'music', label: 'Música Viral', icon: Music },
  ];

  return (
    <div className="w-full flex flex-col gap-4 pb-20 md:pb-0">

      {/* Banner compacto */}
      <div className="bg-gradient-to-r from-cyan-900/50 to-teal-900/50 border border-cyan-500/20 rounded-2xl px-6 py-5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-teal-500/10 rounded-full blur-[60px] pointer-events-none" />
        <div className="flex items-center justify-between relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-500/20 border border-cyan-500/30 rounded-full mb-3">
              <span className="text-xs font-semibold text-cyan-300">✦ Monitoreo Activo</span>
            </div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Target className="w-6 h-6 text-cyan-400" /> Radar de Tendencias
            </h2>
            <p className="text-cyan-200/80 text-sm mt-1">
              Detecta tendencias virales antes que tu competencia · IA Predictiva
            </p>
          </div>
          <div className="flex items-center gap-2 bg-[#111318] border border-white/10 rounded-xl px-4 py-3 flex-shrink-0">
            <div className="relative flex-shrink-0">
              <div className="w-2.5 h-2.5 bg-[#00ff9d] rounded-full" />
              <div className="absolute inset-0 w-2.5 h-2.5 bg-[#00ff9d] rounded-full animate-ping opacity-60" />
            </div>
            <span className="text-sm font-bold text-[#00ff9d]">EN VIVO</span>
          </div>
        </div>

        {/* Stats avanzados con barras de progreso */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 relative z-10">
          <div className="bg-[#111318]/80 backdrop-blur-md rounded-xl p-4 border border-cyan-500/20">
            <div className="flex justify-between items-end mb-2">
              <div className="flex items-center gap-2 text-cyan-400">
                <TrendingUp className="w-4 h-4" />
                <span className="font-bold text-sm">Saturación del Nicho</span>
              </div>
              <span className="text-white font-black text-lg">34%</span>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-1.5 mb-1">
              <div className="bg-gradient-to-r from-cyan-500 to-blue-500 h-1.5 rounded-full" style={{ width: '34%' }}></div>
            </div>
            <p className="text-[10px] text-gray-400">Estado: Early (Buen momento de entrada)</p>
          </div>
          
          <div className="bg-[#111318]/80 backdrop-blur-md rounded-xl p-4 border border-[#00ff9d]/20">
            <div className="flex justify-between items-end mb-2">
              <div className="flex items-center gap-2 text-[#00ff9d]">
                <Globe className="w-4 h-4" />
                <span className="font-bold text-sm">Sentimiento Global</span>
              </div>
              <span className="text-white font-black text-lg">82%</span>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-1.5 mb-1">
              <div className="bg-gradient-to-r from-[#00ff9d] to-emerald-500 h-1.5 rounded-full" style={{ width: '82%' }}></div>
            </div>
            <p className="text-[10px] text-gray-400">Altamente positivo en TikTok & IG</p>
          </div>

          <div className="bg-[#111318]/80 backdrop-blur-md rounded-xl p-4 border border-purple-500/20">
            <div className="flex justify-between items-end mb-2">
              <div className="flex items-center gap-2 text-purple-400">
                <Zap className="w-4 h-4" />
                <span className="font-bold text-sm">Potencial Viral</span>
              </div>
              <span className="text-white font-black text-lg">9.4/10</span>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-1.5 mb-1">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-1.5 rounded-full" style={{ width: '94%' }}></div>
            </div>
            <p className="text-[10px] text-gray-400">Velocidad de crecimiento actual: +300%/día</p>
          </div>
        </div>
      </div>

      {/* Tabs compactos */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {tabs.map(tab => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl transition-all whitespace-nowrap flex-shrink-0 border ${
                isActive
                  ? 'bg-cyan-500/15 border-cyan-500/60 text-white shadow-lg shadow-cyan-500/10'
                  : 'bg-[#111318] border-white/8 text-gray-400 hover:text-white hover:bg-[#1a1d24] hover:border-white/15'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : ''}`} />
              <span className="font-semibold text-sm">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Contenido */}
      <div className="bg-[#0e1117] rounded-2xl border border-white/5 overflow-hidden">
        <AnimatePresence mode="wait">
          {activeTab === 'radar' && (
            <motion.div key="radar" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-4">
              <IntelligentRadar scheduledReminders={scheduledReminders} onSendHashtagMix={onSendHashtagMix} />
            </motion.div>
          )}
          {activeTab === 'hashtags' && (
            <motion.div key="hashtags" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-6">
              <HashtagAnalyzer />
            </motion.div>
          )}
          {activeTab === 'music' && (
            <motion.div key="music" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <ViralMusicTracker />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// Analizador de Hashtags inline
const categorias = [
  {
    categoria: 'Alto Alcance (+1M)',
    tags: ['#viral', '#trending', '#fyp', '#explorepage', '#reels'],
    descripcion: 'Máxima exposición, alta competencia',
    color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20'
  },
  {
    categoria: 'Nicho Medio (100K–1M)',
    tags: ['#marketingdigital', '#contentcreator', '#socialmedia', '#emprendedor'],
    descripcion: 'Balance ideal entre alcance y relevancia',
    color: 'text-[#00ff9d]', bg: 'bg-[#00ff9d]/10 border-[#00ff9d]/20'
  },
  {
    categoria: 'Nicho Específico (-100K)',
    tags: ['#cmlatam', '#growthmarketing', '#ugccreator', '#brandambassador'],
    descripcion: 'Alto engagement, audiencia cualificada',
    color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20'
  },
];

const HashtagAnalyzer = () => {
  const [nicho, setNicho] = useState('');
  const [generado, setGenerado] = useState(false);

  return (
    <div>
      <div className="mb-6">
        <h3 className="text-xl font-bold text-white mb-1">Analizador de Hashtags</h3>
        <p className="text-gray-400 text-sm">Regla 30/40/30: alto alcance / nicho medio / específico para maximizar visibilidad.</p>
      </div>

      <div className="flex gap-3 mb-6">
        <input
          type="text"
          value={nicho}
          onChange={e => setNicho(e.target.value)}
          placeholder="Ej: Fotografía de producto, Coaching online, Ropa deportiva..."
          className="flex-1 bg-[#1a1d24] border border-gray-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-cyan-500 transition-colors"
        />
        <button
          onClick={() => setGenerado(true)}
          disabled={!nicho}
          className="bg-gradient-to-r from-cyan-500 to-teal-500 text-white font-bold px-5 py-3 rounded-xl hover:shadow-lg disabled:opacity-50 transition-all whitespace-nowrap text-sm"
        >
          Generar Mix
        </button>
      </div>

      <div className="space-y-4">
        {categorias.map((cat, i) => (
          <div key={i} className={`p-5 rounded-2xl border ${cat.bg}`}>
            <div className="flex justify-between items-start mb-3">
              <div>
                <h4 className={`font-bold text-sm ${cat.color}`}>{cat.categoria}</h4>
                <p className="text-xs text-gray-500 mt-0.5">{cat.descripcion}</p>
              </div>
              <span className="text-xs bg-gray-800 text-gray-400 px-2 py-1 rounded-md">{cat.tags.length} etiquetas</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {cat.tags.map(tag => (
                <span key={tag} className={`text-xs px-3 py-1.5 bg-[#111318] rounded-full border border-white/10 ${cat.color} cursor-pointer hover:border-white/25 transition-colors`}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {generado && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 bg-gradient-to-r from-cyan-500/10 to-teal-500/10 border border-cyan-500/30 rounded-2xl p-5"
        >
          <h4 className="font-bold text-white mb-3 text-sm">🎯 Mix personalizado para "{nicho}"</h4>
          <div className="flex flex-wrap gap-2 mb-4">
            {['#viral', '#trending', `#${nicho.replace(/\s+/g,'').toLowerCase()}`,
              '#contentcreator', '#fyp', '#marketingdigital', '#emprendedor',
              `#${nicho.split(' ')[0]?.toLowerCase()}tips`, '#brandingdigital'].map(tag => (
              <span key={tag} className="text-xs px-3 py-1.5 bg-[#111318] border border-cyan-500/30 text-cyan-300 rounded-full">{tag}</span>
            ))}
          </div>
          <button className="text-sm bg-cyan-500 hover:bg-cyan-600 text-white font-bold px-4 py-2 rounded-lg transition-colors">
            📋 Copiar todos los hashtags
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default TrendRadarModule;
