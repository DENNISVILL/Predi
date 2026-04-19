import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, CheckSquare, FileText, Map, TrendingUp } from 'lucide-react';
import SEOAudit from './SEOAudit';
import KeywordResearch from './KeywordResearch';
import ContentOptimizer from './ContentOptimizer';
import SEOArchitecture from './SEOArchitecture';

const SEOStudioModule = () => {
  const [activeTab, setActiveTab] = useState('audit');

  const tabs = [
    { id: 'audit', label: 'Auditoría SEO', icon: CheckSquare },
    { id: 'keywords', label: 'Keyword Research', icon: Search },
    { id: 'content', label: 'Optimizador de Contenido', icon: FileText },
    { id: 'architecture', label: 'Arquitectura Web', icon: Map },
  ];

  return (
    <div className="w-full flex flex-col gap-4 pb-20 md:pb-0">
      {/* Banner */}
      <div className="bg-gradient-to-r from-emerald-900/50 to-teal-900/50 border border-emerald-500/20 rounded-2xl px-6 py-5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px] pointer-events-none" />
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/20 border border-emerald-500/30 rounded-full mb-3">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-300" />
              <span className="text-xs font-semibold text-emerald-300">Optimización para Buscadores</span>
            </div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Search className="w-6 h-6 text-emerald-400" /> SEO Studio
            </h2>
            <p className="text-emerald-200/80 text-sm mt-1">
              Auditoría · Keyword Research · Optimización de Contenido · Arquitectura Web
            </p>
          </div>
          <div className="flex gap-3 flex-shrink-0">
            <div className="bg-black/30 border border-white/10 rounded-xl px-4 py-2 text-center">
              <div className="text-xl font-black text-emerald-400">50+</div>
              <div className="text-xs text-gray-400">Criterios SEO</div>
            </div>
            <div className="bg-black/30 border border-white/10 rounded-xl px-4 py-2 text-center">
              <div className="text-xl font-black text-white">4</div>
              <div className="text-xs text-gray-400">Herramientas</div>
            </div>
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
                  ? 'bg-emerald-500/15 border-emerald-500/60 text-white shadow-lg shadow-emerald-500/10'
                  : 'bg-[#111318] border-white/8 text-gray-400 hover:text-white hover:bg-[#1a1d24] hover:border-white/15'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : ''}`} />
              <span className="font-semibold text-sm">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="bg-[#0e1117] rounded-2xl border border-white/5 overflow-hidden min-h-[500px]">
        <AnimatePresence mode="wait">
          {activeTab === 'audit' && (
            <motion.div key="audit" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <SEOAudit />
            </motion.div>
          )}
          {activeTab === 'keywords' && (
            <motion.div key="kw" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <KeywordResearch />
            </motion.div>
          )}
          {activeTab === 'content' && (
            <motion.div key="co" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <ContentOptimizer />
            </motion.div>
          )}
          {activeTab === 'architecture' && (
            <motion.div key="arch" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <SEOArchitecture />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SEOStudioModule;
