import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Layers, Star, BarChart2, TrendingUp } from 'lucide-react';
import SequenceBuilder from './SequenceBuilder';
import EmailTemplates from './EmailTemplates';
import LeadScoring from './LeadScoring';
import FunnelMap from './FunnelMap';

const EmailFunnelModule = () => {
  const [activeTab, setActiveTab] = useState('funnel');

  const tabs = [
    { id: 'funnel', label: 'Mapa de Embudo', icon: Layers },
    { id: 'sequence', label: 'Secuencias de Email', icon: Mail },
    { id: 'templates', label: 'Plantillas', icon: Star },
    { id: 'scoring', label: 'Lead Scoring', icon: BarChart2 },
  ];

  return (
    <div className="w-full flex flex-col gap-4 pb-20 md:pb-0">
      {/* Banner */}
      <div className="bg-gradient-to-r from-violet-900/50 to-purple-900/50 border border-violet-500/20 rounded-2xl px-6 py-5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-violet-500/10 rounded-full blur-[80px] pointer-events-none" />
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-violet-500/20 border border-violet-500/30 rounded-full mb-3">
              <TrendingUp className="w-3.5 h-3.5 text-violet-300" />
              <span className="text-xs font-semibold text-violet-300">Email Marketing & Automatización</span>
            </div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Mail className="w-6 h-6 text-violet-400" /> Email & Funnels
            </h2>
            <p className="text-violet-200/80 text-sm mt-1">
              Embudos de Venta · Secuencias Automatizadas · Plantillas Probadas · Lead Scoring
            </p>
          </div>
          <div className="flex gap-3 flex-shrink-0">
            {[{ label: 'Plantillas', value: '12' }, { label: 'Etapas Funnel', value: '5' }].map((s, i) => (
              <div key={i} className="bg-black/30 border border-white/10 rounded-xl px-4 py-2 text-center">
                <div className="text-xl font-black text-violet-400">{s.value}</div>
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
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl transition-all whitespace-nowrap flex-shrink-0 border ${
                isActive ? 'bg-violet-500/15 border-violet-500/60 text-white shadow-lg shadow-violet-500/10'
                  : 'bg-[#111318] border-white/8 text-gray-400 hover:text-white hover:bg-[#1a1d24] hover:border-white/15'
              }`}>
              <Icon className={`w-4 h-4 ${isActive ? 'text-violet-400' : ''}`} />
              <span className="font-semibold text-sm">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="bg-[#0e1117] rounded-2xl border border-white/5 overflow-hidden min-h-[500px]">
        <AnimatePresence mode="wait">
          {activeTab === 'funnel' && (
            <motion.div key="fn" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <FunnelMap />
            </motion.div>
          )}
          {activeTab === 'sequence' && (
            <motion.div key="sq" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <SequenceBuilder />
            </motion.div>
          )}
          {activeTab === 'templates' && (
            <motion.div key="tp" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <EmailTemplates />
            </motion.div>
          )}
          {activeTab === 'scoring' && (
            <motion.div key="sc" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <LeadScoring />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default EmailFunnelModule;
