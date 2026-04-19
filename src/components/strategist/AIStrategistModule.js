import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, FileText, Compass, Calculator } from 'lucide-react';
import BrandBriefing from './BrandBriefing';
import NichePlaybooks from './NichePlaybooks';
import BudgetCalculator from './BudgetCalculator';
import CompetitorMatrix from './CompetitorMatrix';

const AIStrategistModule = () => {
  const [activeTab, setActiveTab] = useState('briefing');

  const tabs = [
    { id: 'briefing', label: 'Perfil de Marca', icon: FileText },
    { id: 'matrix', label: 'Matriz Competencia', icon: Compass },
    { id: 'playbooks', label: 'Estrategias de Nicho', icon: Brain },
    { id: 'budget', label: 'Calculadora ROI', icon: Calculator }
  ];

  return (
    <div className="w-full flex flex-col gap-4 pb-20 md:pb-0">

      {/* Banner compacto */}
      <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 border border-purple-500/20 rounded-2xl px-6 py-5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-purple-500/10 rounded-full blur-[60px] pointer-events-none" />
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-500/20 border border-purple-500/30 rounded-full mb-3 relative z-10">
          <span className="text-xs font-semibold text-purple-300">✦ Inteligencia Artificial</span>
        </div>
        <h2 className="text-2xl font-bold text-white flex items-center gap-2 relative z-10">
          <Brain className="w-6 h-6 text-purple-400" /> Estratega IA
        </h2>
        <p className="text-purple-200/80 text-sm mt-1 relative z-10">
          Tu Director de Marketing autónomo · Planes · Estrategias · Presupuestos
        </p>
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
                  ? 'bg-purple-500/15 border-purple-500/60 text-white shadow-lg shadow-purple-500/10'
                  : 'bg-[#111318] border-white/8 text-gray-400 hover:text-white hover:bg-[#1a1d24] hover:border-white/15'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-purple-400' : ''}`} />
              <span className="font-semibold text-sm">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Contenido */}
      <div className="bg-[#0e1117] rounded-2xl border border-white/5 overflow-hidden">
        <AnimatePresence mode="wait">
          {activeTab === 'briefing' && (
            <motion.div key="briefing" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
              <BrandBriefing />
            </motion.div>
          )}
          {activeTab === 'matrix' && (
            <motion.div key="matrix" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
              <CompetitorMatrix />
            </motion.div>
          )}
          {activeTab === 'playbooks' && (
            <motion.div key="playbooks" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
              <NichePlaybooks />
            </motion.div>
          )}
          {activeTab === 'budget' && (
            <motion.div key="budget" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
              <BudgetCalculator />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AIStrategistModule;
