import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart3, FileText, Users, Lock, Bell,
  DollarSign, Briefcase, TrendingUp
} from 'lucide-react';
import AutomatedReporting from './AutomatedReporting';
import InfluencerCRM from './InfluencerCRM';
import ClientCRM from './ClientCRM';
import AgencyFinancials from './AgencyFinancials';
import PitchGenerator from './PitchGenerator';
import CMVault from '../CMVault';
import AlertsModule from '../AlertsModule';

const AnalyticsAgencyModule = () => {
  const [activeTab, setActiveTab] = useState('financials');

  const tabs = [
    { id: 'financials',  label: 'Modelo Financiero',   icon: DollarSign,   color: 'text-orange-400',  activeClass: 'bg-orange-500/15 border-orange-500/60 shadow-orange-500/10'  },
    { id: 'pitch',       label: 'Generador de Pitch',  icon: Briefcase,    color: 'text-amber-400',   activeClass: 'bg-amber-500/15 border-amber-500/60 shadow-amber-500/10'    },
    { id: 'clients',     label: 'CRM de Clientes',     icon: Users,        color: 'text-blue-400',    activeClass: 'bg-blue-500/15 border-blue-500/60 shadow-blue-500/10'      },
    { id: 'reports',     label: 'Reportes Auto',        icon: FileText,     color: 'text-green-400',   activeClass: 'bg-green-500/15 border-green-500/60 shadow-green-500/10'   },
    { id: 'influencers', label: 'CRM Influencers',     icon: TrendingUp,   color: 'text-pink-400',    activeClass: 'bg-pink-500/15 border-pink-500/60 shadow-pink-500/10'     },
    { id: 'vault',       label: 'Bóveda Segura',       icon: Lock,         color: 'text-purple-400',  activeClass: 'bg-purple-500/15 border-purple-500/60 shadow-purple-500/10' },
    { id: 'alerts',      label: 'Alertas',             icon: Bell,         color: 'text-red-400',     activeClass: 'bg-red-500/15 border-red-500/60 shadow-red-500/10'         },
  ];

  const activeTabData = tabs.find(t => t.id === activeTab);

  return (
    <div className="w-full flex flex-col gap-4 pb-20 md:pb-0">

      {/* Banner */}
      <div className="bg-gradient-to-r from-orange-900/50 to-amber-900/40 border border-orange-500/20 rounded-2xl px-6 py-5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full blur-[80px] pointer-events-none" />
        <div className="absolute bottom-0 left-32 w-48 h-32 bg-amber-500/10 rounded-full blur-[60px] pointer-events-none" />
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-500/20 border border-orange-500/30 rounded-full mb-3">
              <span className="text-xs font-semibold text-orange-300">✦ Suite Completa de Agencia</span>
            </div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <BarChart3 className="w-6 h-6 text-orange-400" /> Analítica & Agencia
            </h2>
            <p className="text-orange-200/70 text-sm mt-1">
              Modelo Financiero · Pitch Generator · CRM de Clientes · Reportes · Bóveda
            </p>
          </div>
          <div className="flex gap-3 flex-shrink-0">
            {[
              { label: 'Herramientas', value: `${tabs.length}` },
              { label: 'Nivel', value: 'Pro' },
            ].map((s, i) => (
              <div key={i} className="bg-black/30 border border-white/10 rounded-xl px-4 py-2 text-center">
                <div className="text-xl font-black text-orange-400">{s.value}</div>
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
          {activeTab === 'financials' && (
            <motion.div key="financials" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
              <AgencyFinancials />
            </motion.div>
          )}
          {activeTab === 'pitch' && (
            <motion.div key="pitch" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
              <PitchGenerator />
            </motion.div>
          )}
          {activeTab === 'clients' && (
            <motion.div key="clients" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
              <ClientCRM />
            </motion.div>
          )}
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
