import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Info, 
  TrendingUp, 
  Users, 
  Clock, 
  Globe, 
  Zap,
  BarChart3,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

const TrendScoreExplainer = ({ score = 85, signals = null }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Datos simulados de señales si no se proporcionan
  const defaultSignals = {
    growth: { value: 245, weight: 30, label: 'Crecimiento %' },
    engagement: { value: 8.2, weight: 25, label: 'Engagement Rate' },
    velocity: { value: 156, weight: 20, label: 'Velocidad Viral' },
    reach: { value: 2.1, weight: 15, label: 'Alcance (M)' },
    creators: { value: 89, weight: 10, label: 'Creadores Únicos' }
  };

  const trendSignals = signals || defaultSignals;

  const getScoreColor = (score) => {
    if (score >= 80) return 'from-green-500 to-emerald-400';
    if (score >= 60) return 'from-yellow-500 to-orange-400';
    return 'from-red-500 to-pink-400';
  };

  const getScoreLabel = (score) => {
    if (score >= 80) return 'ALTA PROBABILIDAD';
    if (score >= 60) return 'PROBABILIDAD MEDIA';
    return 'PROBABILIDAD BAJA';
  };

  return (
    <div className="card">
      {/* Header del TrendScore */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${getScoreColor(score)} flex items-center justify-center`}>
            <span className="text-2xl font-bold text-white">{score}</span>
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">TrendScore</h3>
            <p className="text-sm text-gray-400">{getScoreLabel(score)}</p>
          </div>
        </div>
        
        <motion.button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 px-3 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Info className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-400">
            {isExpanded ? 'Ocultar' : 'Explicar'}
          </span>
          {isExpanded ? 
            <ChevronUp className="w-4 h-4 text-gray-400" /> : 
            <ChevronDown className="w-4 h-4 text-gray-400" />
          }
        </motion.button>
      </div>

      {/* Barra de progreso visual */}
      <div className="mb-4">
        <div className="flex justify-between text-xs text-gray-400 mb-1">
          <span>0</span>
          <span>Probabilidad de Viralidad (48-72h)</span>
          <span>100</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <motion.div 
            className={`h-2 rounded-full bg-gradient-to-r ${getScoreColor(score)}`}
            initial={{ width: 0 }}
            animate={{ width: `${score}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Explicación expandible */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="border-t border-gray-700 pt-4"
          >
            <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Señales que Contribuyen al Score
            </h4>
            
            <div className="space-y-3">
              {Object.entries(trendSignals).map(([key, signal]) => (
                <div key={key} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-[#007bff] to-[#00ff9d] rounded-lg flex items-center justify-center">
                      {key === 'growth' && <TrendingUp className="w-4 h-4 text-white" />}
                      {key === 'engagement' && <Zap className="w-4 h-4 text-white" />}
                      {key === 'velocity' && <Clock className="w-4 h-4 text-white" />}
                      {key === 'reach' && <Globe className="w-4 h-4 text-white" />}
                      {key === 'creators' && <Users className="w-4 h-4 text-white" />}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{signal.label}</p>
                      <p className="text-xs text-gray-400">Peso: {signal.weight}%</p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-sm font-bold text-[#00ff9d]">
                      {typeof signal.value === 'number' && signal.value > 10 
                        ? signal.value.toLocaleString() 
                        : signal.value}
                      {key === 'growth' && '%'}
                      {key === 'engagement' && '%'}
                      {key === 'reach' && 'M'}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Explicación del algoritmo */}
            <div className="mt-4 p-3 bg-white/5 rounded-lg">
              <h5 className="text-xs font-semibold text-white mb-2">¿Cómo se calcula?</h5>
              <p className="text-xs text-gray-400 leading-relaxed">
                El TrendScore combina múltiples señales usando algoritmos de machine learning. 
                Analizamos el crecimiento exponencial, la velocidad de propagación, 
                el engagement rate y la diversidad de creadores para predecir la probabilidad 
                de viralidad en las próximas 48-72 horas.
              </p>
            </div>

            {/* Disclaimer */}
            <div className="mt-3 p-2 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
              <p className="text-xs text-yellow-400">
                ⚠️ Las predicciones son estimaciones basadas en datos históricos. 
                Predix no garantiza resultados específicos.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TrendScoreExplainer;
