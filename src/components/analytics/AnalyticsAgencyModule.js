import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart3, FileText, Users, Lock, Bell } from 'lucide-react';
import AutomatedReporting from './AutomatedReporting';
import InfluencerCRM from './InfluencerCRM';
import CMVault from '../CMVault';
import AlertsModule from '../AlertsModule';

const AnalyticsAgencyModule = () => {
  const [activeTab, setActiveTab] = useState('reports');

  const tabs = [
    { id: 'reports', label: 'Reportes', icon: FileText },
    { id: 'influencers', label: 'CRM Influencers', icon: Users },
    { id: 'vault', label: 'Bóveda Segura', icon: Lock },
    { id: 'alerts', label: 'Alertas', icon: Bell }
  ];

  return (
    <div className="w-full flex flex-col gap-4 pb-20 md:pb-0">

      {/* Banner compacto */}
      <div className="bg-gradient-to-r from-orange-900/50 to-red-900/50 border border-orange-500/20 rounded-2xl px-6 py-5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-orange-500/10 rounded-full blur-[60px] pointer-events-none" />
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-500/20 border border-orange-500/30 rounded-full mb-3 relative z-10">
          <span className="text-xs font-semibold text-orange-300">✦ Modo Agencia</span>
        </div>
        <h2 className="text-2xl font-bold text-white flex items-center gap-2 relative z-10">
          <BarChart3 className="w-6 h-6 text-orange-400" /> Analítica & Agencia
        </h2>
        <p className="text-orange-200/80 text-sm mt-1 relative z-10">
          Reportes Automáticos · CRM de Influencers · Bóveda de Accesos
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
                  ? 'bg-orange-500/15 border-orange-500/60 text-white shadow-lg shadow-orange-500/10'
                  : 'bg-[#111318] border-white/8 text-gray-400 hover:text-white hover:bg-[#1a1d24] hover:border-white/15'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-orange-400' : ''}`} />
              <span className="font-semibold text-sm">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Contenido */}
      <div className="bg-[#0e1117] rounded-2xl border border-white/5 overflow-hidden min-h-[500px]">
        <AnimatePresence mode="wait">
          {activeTab === 'reports' && (
            <motion.div key="reports" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
              <AutomatedReporting />
            </motion.div>
          )}
          {activeTab === 'influencers' && (
            <motion.div key="influencers" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
              <InfluencerCRM />
            </motion.div>
          )}
          {activeTab === 'vault' && (
            <motion.div key="vault" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
              <CMVault hideHeader />
            </motion.div>
          )}
          {activeTab === 'alerts' && (
            <motion.div key="alerts" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
              <AlertsModule hideHeader />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AnalyticsAgencyModule;
