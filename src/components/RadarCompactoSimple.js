// 🎯 RADAR COMPACTO SIMPLE - SIN ERRORES
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Activity, Globe, Eye } from 'lucide-react';

const RadarCompactoSimple = ({ onTrendClick }) => {
  const [trends] = useState([
    {
      id: 1,
      name: '#TechTrend2025',
      growth: 95,
      views: 2.5,
      platform: 'TikTok',
      country: '🇺🇸',
      category: 'Tecnología'
    },
    {
      id: 2,
      name: '#SustainableLiving',
      growth: 87,
      views: 1.8,
      platform: 'Instagram',
      country: '🇪🇸',
      category: 'Lifestyle'
    },
    {
      id: 3,
      name: '#AIRevolution',
      growth: 92,
      views: 3.2,
      platform: 'YouTube',
      country: '🇬🇧',
      category: 'Tecnología'
    },
    {
      id: 4,
      name: '#DigitalNomad',
      growth: 78,
      views: 1.5,
      platform: 'LinkedIn',
      country: '🇩🇪',
      category: 'Trabajo'
    }
  ]);

  const [isScanning, setIsScanning] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsScanning(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-gray-900 via-gray-800 to-black p-6 rounded-xl border border-gray-700/50 shadow-2xl"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full animate-pulse"></div>
          <h3 className="text-white font-bold text-lg">Tendencias Globales</h3>
        </div>
        <div className="flex items-center gap-2">
          {isScanning ? (
            <span className="text-yellow-400 text-sm">Escaneando...</span>
          ) : (
            <span className="text-green-400 text-sm">En línea</span>
          )}
        </div>
      </div>

      {/* Métricas Globales */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-800/50 p-3 rounded-lg border border-gray-700/30">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-4 h-4 text-green-400" />
            <span className="text-gray-400 text-xs">Tendencias</span>
          </div>
          <div className="text-white font-bold text-lg">{trends.length}</div>
        </div>

        <div className="bg-gray-800/50 p-3 rounded-lg border border-gray-700/30">
          <div className="flex items-center gap-2 mb-1">
            <Activity className="w-4 h-4 text-blue-400" />
            <span className="text-gray-400 text-xs">Crecimiento</span>
          </div>
          <div className="text-white font-bold text-lg">88%</div>
        </div>

        <div className="bg-gray-800/50 p-3 rounded-lg border border-gray-700/30">
          <div className="flex items-center gap-2 mb-1">
            <Eye className="w-4 h-4 text-purple-400" />
            <span className="text-gray-400 text-xs">Vistas</span>
          </div>
          <div className="text-white font-bold text-lg">9.0M</div>
        </div>

        <div className="bg-gray-800/50 p-3 rounded-lg border border-gray-700/30">
          <div className="flex items-center gap-2 mb-1">
            <Globe className="w-4 h-4 text-cyan-400" />
            <span className="text-gray-400 text-xs">Países</span>
          </div>
          <div className="text-white font-bold text-lg">4</div>
        </div>
      </div>

      {/* Lista de Tendencias */}
      <div className="space-y-3">
        <h4 className="text-white font-semibold text-sm mb-3">Top Tendencias</h4>
        {trends.map((trend, index) => (
          <motion.div
            key={trend.id}
            className="bg-gray-800/30 p-3 rounded-lg border border-gray-700/30 hover:bg-gray-700/30 transition-colors cursor-pointer"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            onClick={() => onTrendClick && onTrendClick(trend)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-lg">{trend.country}</span>
                <div>
                  <h5 className="text-white font-medium text-sm">{trend.name}</h5>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs px-2 py-1 bg-blue-500/20 text-blue-400 rounded-full">
                      {trend.platform}
                    </span>
                    <span className="text-xs text-gray-400">{trend.category}</span>
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-green-400 font-bold text-sm">+{trend.growth}%</div>
                <div className="text-gray-400 text-xs">{trend.views}M vistas</div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-4 pt-3 border-t border-gray-700/50">
        <div className="text-center">
          <span className="text-gray-400 text-xs">
            Última actualización: {new Date().toLocaleTimeString()}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default RadarCompactoSimple;
