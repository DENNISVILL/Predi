import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wand2, Lightbulb, Video, Image as ImageIcon, Brain } from 'lucide-react';
import VisualContentGenerator from '../VisualContentGenerator';
import IdeaFactory from './IdeaFactory';
import LiveScriptGenerator from './LiveScriptGenerator';
import ContentExamples from './ContentExamples';
import FormatGuide from './FormatGuide';
import EmergentThinking from './EmergentThinking';

const ContentStudioModule = () => {
  const [activeTab, setActiveTab] = useState('visual');

  const tabs = [
    { id: 'visual',    label: 'Creador Visual',     icon: ImageIcon, color: 'text-cyan-400',   activeClass: 'bg-cyan-500/15 border-cyan-500/60 shadow-cyan-500/10'    },
    { id: 'ideas',     label: 'Fábrica de Ideas',   icon: Lightbulb, color: 'text-yellow-400', activeClass: 'bg-yellow-500/15 border-yellow-500/60 shadow-yellow-500/10'},
    { id: 'gimnasio',  label: 'Gimnasio Creativo',  icon: Brain,     color: 'text-amber-400',  activeClass: 'bg-amber-500/15 border-amber-500/60 shadow-amber-500/10'  },
    { id: 'boveda',    label: 'Bóveda (125+ Hooks)',icon: Wand2,     color: 'text-violet-400', activeClass: 'bg-violet-500/15 border-violet-500/60 shadow-violet-500/10'},
    { id: 'formatos',  label: 'Guía de Formatos',   icon: Video,     color: 'text-blue-400',   activeClass: 'bg-blue-500/15 border-blue-500/60 shadow-blue-500/10'    },
    { id: 'live',      label: 'Scripts en Vivo',    icon: Video,     color: 'text-green-400',  activeClass: 'bg-green-500/15 border-green-500/60 shadow-green-500/10'  },
  ];

  return (
    <div className="w-full flex flex-col gap-4 pb-20 md:pb-0">

      {/* Banner */}
      <div className="bg-gradient-to-r from-blue-900/50 to-cyan-900/40 border border-cyan-500/20 rounded-2xl px-6 py-5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/10 rounded-full blur-[60px] pointer-events-none" />
        <div className="absolute bottom-0 left-20 w-40 h-32 bg-blue-500/10 rounded-full blur-[60px] pointer-events-none" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-500/20 border border-cyan-500/30 rounded-full mb-3">
            <span className="text-xs font-semibold text-cyan-300">✦ Tu Laboratorio de Contenido</span>
          </div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Wand2 className="w-6 h-6 text-cyan-400" /> Estudio Creativo
          </h2>
          <p className="text-cyan-200/70 text-sm mt-1">
            Creador Visual · Fábrica de Ideas · Gimnasio Creativo · 125+ Hooks · Formatos · Scripts
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {tabs.map(tab => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all whitespace-nowrap flex-shrink-0 border text-sm font-semibold ${
                isActive
                  ? `${tab.activeClass} text-white shadow-lg`
                  : 'bg-[#111318] border-white/8 text-gray-400 hover:text-white hover:bg-[#1a1d24] hover:border-white/15'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? tab.color : ''}`} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Content */}
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
          {activeTab === 'gimnasio' && (
            <motion.div key="gimnasio" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <EmergentThinking />
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
