import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Megaphone, Calculator, Image, DollarSign, TrendingUp, BarChart2
} from 'lucide-react';
import CampaignPlanner from './CampaignPlanner';
import AdsCalculator from './AdsCalculator';
import CreativesLibrary from './CreativesLibrary';
import BudgetOptimizer from './BudgetOptimizer';
import RoasSimulator from './RoasSimulator';

const AdsManagerModule = () => {
  const [activeTab, setActiveTab] = useState('roas');

  const tabs = [
    { id: 'roas',       label: 'Simulador ROAS',       icon: BarChart2,   color: 'text-red-400',    activeClass: 'bg-red-500/15 border-red-500/60 shadow-red-500/10'       },
    { id: 'calculator', label: 'Calculadora Ads',      icon: Calculator,  color: 'text-orange-400', activeClass: 'bg-orange-500/15 border-orange-500/60 shadow-orange-500/10'},
    { id: 'planner',    label: 'Planificador Campañas', icon: Megaphone,   color: 'text-amber-400',  activeClass: 'bg-amber-500/15 border-amber-500/60 shadow-amber-500/10'  },
    { id: 'budget',     label: 'Optimizador Budget',   icon: DollarSign,  color: 'text-green-400',  activeClass: 'bg-green-500/15 border-green-500/60 shadow-green-500/10'  },
    { id: 'creatives',  label: 'Biblioteca Creativos', icon: Image,       color: 'text-blue-400',   activeClass: 'bg-blue-500/15 border-blue-500/60 shadow-blue-500/10'     },
  ];

  return (
    <div className="w-full flex flex-col gap-4 pb-20 md:pb-0">
      {/* Banner */}
      <div className="bg-gradient-to-r from-red-900/50 to-orange-900/40 border border-red-500/20 rounded-2xl px-6 py-5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/10 rounded-full blur-[80px] pointer-events-none" />
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-500/20 border border-red-500/30 rounded-full mb-3">
              <TrendingUp className="w-3.5 h-3.5 text-red-300" />
              <span className="text-xs font-semibold text-red-300">Publicidad de Pago — SEM & Pauta</span>
            </div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Megaphone className="w-6 h-6 text-red-400" /> Gestor de Ads
            </h2>
            <p className="text-red-200/70 text-sm mt-1">
              Simulador ROAS · Calculadora ROI · Planificador de Campañas · Creativos · Budget
            </p>
          </div>
          <div className="flex gap-3 flex-shrink-0">
            {[
              { label: 'Plataformas', value: '8+' },
              { label: 'Métricas', value: '15' },
            ].map((s, i) => (
              <div key={i} className="bg-black/30 border border-white/10 rounded-xl px-4 py-2 text-center">
                <div className="text-xl font-black text-red-400">{s.value}</div>
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
      <div className="bg-[#0e1117] rounded-2xl border border-white/5 overflow-hidden min-h-[500px]">
        <AnimatePresence mode="wait">
          {activeTab === 'roas' && (
            <motion.div key="roas" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <RoasSimulator />
            </motion.div>
          )}
          {activeTab === 'calculator' && (
            <motion.div key="calc" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <AdsCalculator />
            </motion.div>
          )}
          {activeTab === 'planner' && (
            <motion.div key="plan" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <CampaignPlanner />
            </motion.div>
          )}
          {activeTab === 'budget' && (
            <motion.div key="budg" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <BudgetOptimizer />
            </motion.div>
          )}
          {activeTab === 'creatives' && (
            <motion.div key="crea" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <CreativesLibrary />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AdsManagerModule;
