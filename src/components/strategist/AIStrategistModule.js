import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, FileText, Compass, Calculator, BarChart, Layers } from 'lucide-react';
import BrandBriefing from './BrandBriefing';
import NichePlaybooks from './NichePlaybooks';
import BudgetCalculator from './BudgetCalculator';
import CompetitorMatrix from './CompetitorMatrix';
import SWOTMatrix from './SWOTMatrix';
import BrandPentagon from './BrandPentagon';

const AIStrategistModule = () => {
  const [activeTab, setActiveTab] = useState('briefing');

  const tabs = [
    { id: 'briefing',  label: 'Perfil de Marca',      icon: FileText,   color: 'text-purple-400',  activeClass: 'bg-purple-500/15 border-purple-500/60 shadow-purple-500/10' },
    { id: 'pentagon',  label: 'Pentágono de Marca',   icon: Layers,     color: 'text-pink-400',    activeClass: 'bg-pink-500/15 border-pink-500/60 shadow-pink-500/10'     },
    { id: 'swot',      label: 'Matriz DOFA',           icon: BarChart,   color: 'text-blue-400',    activeClass: 'bg-blue-500/15 border-blue-500/60 shadow-blue-500/10'     },
    { id: 'matrix',    label: 'Matriz Competencia',   icon: Compass,    color: 'text-cyan-400',    activeClass: 'bg-cyan-500/15 border-cyan-500/60 shadow-cyan-500/10'     },
    { id: 'playbooks', label: 'Estrategias de Nicho', icon: Brain,      color: 'text-violet-400',  activeClass: 'bg-violet-500/15 border-violet-500/60 shadow-violet-500/10'},
    { id: 'budget',    label: 'Calculadora ROI',       icon: Calculator, color: 'text-green-400',   activeClass: 'bg-green-500/15 border-green-500/60 shadow-green-500/10'  },
  ];

  return (
    <div className="w-full flex flex-col gap-4 pb-20 md:pb-0">

      {/* Banner */}
      <div className="bg-gradient-to-r from-purple-900/50 to-violet-900/40 border border-purple-500/20 rounded-2xl px-6 py-5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-[80px] pointer-events-none" />
        <div className="absolute bottom-0 left-32 w-48 h-32 bg-pink-500/10 rounded-full blur-[60px] pointer-events-none" />
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-500/20 border border-purple-500/30 rounded-full mb-3">
              <span className="text-xs font-semibold text-purple-300">✦ Tu Director de Marketing Autónomo</span>
            </div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Brain className="w-6 h-6 text-purple-400" /> Estratega IA
            </h2>
            <p className="text-purple-200/70 text-sm mt-1">
              Perfil de Marca · Pentágono · DOFA · Competencia · Nichos · ROI
            </p>
          </div>
          <div className="flex gap-3 flex-shrink-0">
            {[
              { label: 'Herramientas', value: `${tabs.length}` },
              { label: 'Estrategias', value: '∞' },
            ].map((s, i) => (
              <div key={i} className="bg-black/30 border border-white/10 rounded-xl px-4 py-2 text-center">
                <div className="text-xl font-black text-purple-400">{s.value}</div>
                <div className="text-xs text-gray-400">{s.label}</div>
              </div>
            ))}
          </div>
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
          {activeTab === 'briefing' && (
            <motion.div key="briefing" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
              <BrandBriefing />
            </motion.div>
          )}
          {activeTab === 'pentagon' && (
            <motion.div key="pentagon" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
              <BrandPentagon />
            </motion.div>
          )}
          {activeTab === 'swot' && (
            <motion.div key="swot" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
              <SWOTMatrix />
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
