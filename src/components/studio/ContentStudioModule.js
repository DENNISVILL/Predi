import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wand2, Lightbulb, Video, Image as ImageIcon } from 'lucide-react';
import VisualContentGenerator from '../VisualContentGenerator';
import IdeaFactory from './IdeaFactory';
import LiveScriptGenerator from './LiveScriptGenerator';
import ContentExamples from './ContentExamples';
import FormatGuide from './FormatGuide';

const ContentStudioModule = () => {
  const [activeTab, setActiveTab] = useState('visual');

  const tabs = [
    { id: 'visual', label: 'Creador Visual', icon: ImageIcon },
    { id: 'ideas', label: 'Fábrica de Ideas', icon: Lightbulb },
    { id: 'boveda', label: 'Bóveda (125+ Hooks)', icon: Wand2 },
    { id: 'formatos', label: 'Guía de Formatos', icon: Video },
    { id: 'live', label: 'Scripts en Vivo', icon: Video }
  ];

  return (
    <div className="w-full flex flex-col gap-4 pb-20 md:pb-0">

      {/* Banner compacto */}
      <div className="bg-gradient-to-r from-blue-900/50 to-cyan-900/50 border border-cyan-500/20 rounded-2xl px-6 py-5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/10 rounded-full blur-[60px] pointer-events-none" />
        <h2 className="text-2xl font-bold text-white flex items-center gap-2 relative z-10">
          <Wand2 className="w-6 h-6 text-cyan-400" /> Estudio Creativo
        </h2>
        <p className="text-cyan-200/80 text-sm mt-1 relative z-10">
          Fábrica de Ideas · Bóveda de Hooks · Guía de Formatos · Generador Visual
        </p>
      </div>

      {/* Tabs de navegación */}
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
          {activeTab === 'visual' && (
            <motion.div key="visual" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <VisualContentGenerator />
            </motion.div>
          )}
          {activeTab === 'ideas' && (
            <motion.div key="ideas" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <IdeaFactory />
            </motion.div>
          )}
          {activeTab === 'boveda' && (
            <motion.div key="boveda" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <ContentExamples />
            </motion.div>
          )}
          {activeTab === 'formatos' && (
            <motion.div key="formatos" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <FormatGuide />
            </motion.div>
          )}
          {activeTab === 'live' && (
            <motion.div key="live" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <LiveScriptGenerator />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ContentStudioModule;
