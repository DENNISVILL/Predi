import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Megaphone, Calculator, Image, DollarSign, TrendingUp } from 'lucide-react';
import CampaignPlanner from './CampaignPlanner';
import AdsCalculator from './AdsCalculator';
import CreativesLibrary from './CreativesLibrary';
import BudgetOptimizer from './BudgetOptimizer';

const AdsManagerModule = () => {
  const [activeTab, setActiveTab] = useState('calculator');

  const tabs = [
    { id: 'calculator', label: 'Calculadora Ads', icon: Calculator },
    { id: 'planner', label: 'Planificador Campañas', icon: Megaphone },
    { id: 'creatives', label: 'Biblioteca Creativos', icon: Image },
    { id: 'budget', label: 'Optimizador de Budget', icon: DollarSign },
  ];

  return (
    <div className="w-full flex flex-col gap-4 pb-20 md:pb-0">
      {/* Banner */}
      <div className="bg-gradient-to-r from-red-900/50 to-orange-900/50 border border-red-500/20 rounded-2xl px-6 py-5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/10 rounded-full blur-[80px] pointer-events-none" />
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-500/20 border border-red-500/30 rounded-full mb-3">
              <TrendingUp className="w-3.5 h-3.5 text-red-300" />
              <span className="text-xs font-semibold text-red-300">Publicidad de Pago (SEM)</span>
            </div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Megaphone className="w-6 h-6 text-red-400" /> Gestor de Ads
            </h2>
            <p className="text-red-200/80 text-sm mt-1">
              Calculadora ROI · Planificador de Campañas · Creativos · Distribución de Presupuesto
            </p>
          </div>
          <div className="flex gap-3 flex-shrink-0">
            {[
              { label: 'Plataformas', value: '8+' },
              { label: 'Métricas', value: '12' },
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
                  ? 'bg-red-500/15 border-red-500/60 text-white shadow-lg shadow-red-500/10'
                  : 'bg-[#111318] border-white/8 text-gray-400 hover:text-white hover:bg-[#1a1d24] hover:border-white/15'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-red-400' : ''}`} />
              <span className="font-semibold text-sm">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="bg-[#0e1117] rounded-2xl border border-white/5 overflow-hidden min-h-[500px]">
        <AnimatePresence mode="wait">
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
          {activeTab === 'creatives' && (
            <motion.div key="crea" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <CreativesLibrary />
            </motion.div>
          )}
          {activeTab === 'budget' && (
            <motion.div key="budg" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <BudgetOptimizer />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AdsManagerModule;
