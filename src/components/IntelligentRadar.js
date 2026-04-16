import React, { useState } from 'react';
import { motion } from 'framer-motion';
import RadarCompacto from './RadarCompacto';

const IntelligentRadar = ({ onSendHashtagMix, scheduledReminders }) => {
  const [activeSection, setActiveSection] = useState('radar-main');

  const radarSections = [
    { id: 'radar-main', label: 'Vista Principal', icon: '🎯' },
    { id: 'analysis', label: 'Análisis', icon: '📊' },
    { id: 'predictions', label: 'Predicciones', icon: '🔮' },
    { id: 'social', label: 'Social', icon: '⭐' },
    { id: 'demographics', label: 'Demografía', icon: '🌍' },
    { id: 'historical', label: 'Histórico', icon: '📈' },
    { id: 'alerts', label: 'Alertas', icon: '🔔' },
    { id: 'hot-topics', label: 'Temas Calientes', icon: '🔥' },
    { id: 'emerging', label: 'Emergentes', icon: '🌱' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-6">
      {/* Tabs Navigation */}
      <div className="mb-6 bg-gray-800/50 backdrop-blur-sm rounded-xl p-2 border border-gray-700/50">
        <div className="flex flex-wrap gap-2">
          {radarSections.map((section) => (
            <motion.button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeSection === section.id
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50 shadow-lg shadow-cyan-500/20'
                  : 'bg-gray-700/30 text-gray-400 hover:text-white hover:bg-gray-700/50 border border-transparent'
                }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="text-base">{section.icon}</span>
              <span>{section.label}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div className="transition-all duration-300">
        {activeSection === 'radar-main' && (
          <RadarCompacto onSendHashtagMix={onSendHashtagMix} scheduledReminders={scheduledReminders} />
        )}
        {activeSection === 'analysis' && (
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 border border-gray-700/50 text-center">
            <div className="text-6xl mb-4">📊</div>
            <h2 className="text-2xl font-bold text-white mb-2">Análisis</h2>
            <p className="text-gray-400">Análisis detallado de métricas y performance</p>
          </div>
        )}
        {activeSection === 'predictions' && (
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 border border-gray-700/50 text-center">
            <div className="text-6xl mb-4">🔮</div>
            <h2 className="text-2xl font-bold text-white mb-2">Predicciones</h2>
            <p className="text-gray-400">Predicciones de viralidad y tendencias futuras</p>
          </div>
        )}
        {activeSection === 'social' && (
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 border border-gray-700/50 text-center">
            <div className="text-6xl mb-4">⭐</div>
            <h2 className="text-2xl font-bold text-white mb-2">Social</h2>
            <p className="text-gray-400">Hashtags, influencers, UGC y estrategias sociales</p>
          </div>
        )}
        {activeSection === 'demographics' && (
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 border border-gray-700/50 text-center">
            <div className="text-6xl mb-4">🌍</div>
            <h2 className="text-2xl font-bold text-white mb-2">Demografía</h2>
            <p className="text-gray-400">Análisis demográfico de audiencia</p>
          </div>
        )}
        {activeSection === 'historical' && (
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 border border-gray-700/50 text-center">
            <div className="text-6xl mb-4">📈</div>
            <h2 className="text-2xl font-bold text-white mb-2">Histórico</h2>
            <p className="text-gray-400">Tendencias pasadas y análisis retrospectivo</p>
          </div>
        )}
        {activeSection === 'alerts' && (
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 border border-gray-700/50 text-center">
            <div className="text-6xl mb-4">🔔</div>
            <h2 className="text-2xl font-bold text-white mb-2">Alertas</h2>
            <p className="text-gray-400">Notificaciones y alertas de tendencias</p>
          </div>
        )}
        {activeSection === 'hot-topics' && (
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 border border-gray-700/50 text-center">
            <div className="text-6xl mb-4">🔥</div>
            <h2 className="text-2xl font-bold text-white mb-2">Temas Calientes</h2>
            <p className="text-gray-400">Temas trending del momento</p>
          </div>
        )}
        {activeSection === 'emerging' && (
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 border border-gray-700/50 text-center">
            <div className="text-6xl mb-4">🌱</div>
            <h2 className="text-2xl font-bold text-white mb-2">Emergentes</h2>
            <p className="text-gray-400">Tendencias emergentes y oportunidades</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default IntelligentRadar;
