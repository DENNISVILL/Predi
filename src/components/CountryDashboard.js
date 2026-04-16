import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useCountry } from './CountrySelector';
import TimeRangeSelector from './dashboard/TimeRangeSelector';
import {
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  Globe,
  Clock,
  Calendar,
  Zap,
  Target,
  Heart,
  Share2,
  Eye,
  MessageSquare
} from 'lucide-react';

const CountryDashboard = () => {
  const { countryData, selectedCountry } = useCountry();
  const [currentCountry, setCurrentCountry] = useState(selectedCountry);
  const [currentData, setCurrentData] = useState(countryData);
  const [timeRange, setTimeRange] = useState('7d');

  // Forzar actualización cuando cambie el país
  useEffect(() => {
    console.log('País cambió a:', selectedCountry, countryData);
    setCurrentCountry(selectedCountry);
    setCurrentData(countryData);
  }, [selectedCountry, countryData]);

  if (!currentData) return null;

  // Datos específicos del país para el dashboard
  const countryMetrics = {
    ES: {
      activeUsers: '12.5M',
      engagement: '8.2%',
      topPlatform: 'Instagram',
      growthRate: '+15%',
      bestTime: '21:30',
      trending: ['#España2024', '#Madrid', '#Flamenco', '#Tapas'],
      demographics: { '18-24': 28, '25-34': 35, '35-44': 22, '45+': 15 },
      platforms: { instagram: 85, tiktok: 72, facebook: 68, youtube: 78 }
    },
    MX: {
      activeUsers: '45.2M',
      engagement: '9.1%',
      topPlatform: 'TikTok',
      growthRate: '+22%',
      bestTime: '22:00',
      trending: ['#México2024', '#CDMX', '#DíaDeMuertos', '#Tacos'],
      demographics: { '18-24': 32, '25-34': 38, '35-44': 20, '45+': 10 },
      platforms: { instagram: 88, tiktok: 92, facebook: 75, youtube: 82 }
    },
    CO: {
      activeUsers: '18.7M',
      engagement: '10.3%',
      topPlatform: 'Instagram',
      growthRate: '+28%',
      bestTime: '20:30',
      trending: ['#Colombia2024', '#Bogotá', '#Vallenato', '#Café'],
      demographics: { '18-24': 35, '25-34': 40, '35-44': 18, '45+': 7 },
      platforms: { instagram: 90, tiktok: 85, facebook: 70, youtube: 80 }
    },
    AR: {
      activeUsers: '22.1M',
      engagement: '7.8%',
      topPlatform: 'Instagram',
      growthRate: '+12%',
      bestTime: '21:00',
      trending: ['#Argentina2024', '#BuenosAires', '#Fútbol', '#Tango'],
      demographics: { '18-24': 25, '25-34': 35, '35-44': 25, '45+': 15 },
      platforms: { instagram: 87, tiktok: 75, facebook: 82, youtube: 85 }
    },
    PE: {
      activeUsers: '14.3M',
      engagement: '11.2%',
      topPlatform: 'TikTok',
      growthRate: '+35%',
      bestTime: '19:30',
      trending: ['#Perú2024', '#Lima', '#MachuPicchu', '#Ceviche'],
      demographics: { '18-24': 40, '25-34': 35, '35-44': 18, '45+': 7 },
      platforms: { instagram: 82, tiktok: 88, facebook: 65, youtube: 75 }
    },
    VE: {
      activeUsers: '11.8M',
      engagement: '12.5%',
      topPlatform: 'Instagram',
      growthRate: '+18%',
      bestTime: '19:00',
      trending: ['#Venezuela2024', '#Caracas', '#Arepa', '#Salsa'],
      demographics: { '18-24': 38, '25-34': 32, '35-44': 20, '45+': 10 },
      platforms: { instagram: 85, tiktok: 80, facebook: 70, youtube: 72 }
    },
    CL: {
      activeUsers: '8.9M',
      engagement: '6.8%',
      topPlatform: 'Instagram',
      growthRate: '+10%',
      bestTime: '20:00',
      trending: ['#Chile2024', '#Santiago', '#Vino', '#Andes'],
      demographics: { '18-24': 22, '25-34': 38, '35-44': 28, '45+': 12 },
      platforms: { instagram: 90, tiktok: 70, facebook: 85, youtube: 88 }
    },
    EC: {
      activeUsers: '7.2M',
      engagement: '13.1%',
      topPlatform: 'TikTok',
      growthRate: '+42%',
      bestTime: '18:30',
      trending: ['#Ecuador2024', '#Quito', '#Galápagos', '#Cacao'],
      demographics: { '18-24': 45, '25-34': 30, '35-44': 18, '45+': 7 },
      platforms: { instagram: 78, tiktok: 85, facebook: 60, youtube: 70 }
    }
  };

  const metrics = countryMetrics[currentCountry] || countryMetrics.MX;

  // Estilos "Premium" reutilizables - Compactados
  const cardStyle = "bg-[#111318] border border-white/5 rounded-xl p-4 hover:border-white/10 transition-colors shadow-lg shadow-black/20 relative overflow-hidden group h-full flex flex-col justify-between";
  const iconBoxStyle = "w-8 h-8 rounded-lg flex items-center justify-center mb-3 transition-transform group-hover:scale-110 duration-300";

  return (
    <div className="space-y-8 animate-in fade-in zoom-in duration-500">

      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-end sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            Dashboard General <span className="text-gray-500 text-lg font-normal">/ {currentData.name}</span>
          </h2>
          <p className="text-gray-400 text-sm mt-1">Vista general del rendimiento y oportunidades de mercado.</p>
        </div>
        <TimeRangeSelector selected={timeRange} onChange={setTimeRange} />
      </div>

      {/* KPI Grid - Uniforme y Alineado */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

        {/* Engagement */}
        <motion.div className={cardStyle} whileHover={{ y: -2 }}>
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <Eye className="w-24 h-24" />
          </div>
          <div>
            <div className={`${iconBoxStyle} bg-blue-500/10 text-blue-400`}>
              <Eye className="w-5 h-5" />
            </div>
            <div className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-0.5">Engagement Rate</div>
            <div className="text-2xl font-bold text-white tracking-tight">{metrics.engagement}</div>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <span className="flex items-center gap-1 text-xs font-bold text-green-400 bg-green-500/10 px-2 py-1 rounded-full border border-green-500/20">
              <TrendingUp className="w-3 h-3" /> +2.3%
            </span>
            <span className="text-xs text-gray-500">vs mes anterior</span>
          </div>
        </motion.div>

        {/* Top Platform */}
        <motion.div className={cardStyle} whileHover={{ y: -2 }}>
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <TrendingUp className="w-24 h-24" />
          </div>
          <div>
            <div className={`${iconBoxStyle} bg-green-500/10 text-green-400`}>
              <Target className="w-5 h-5" />
            </div>
            <div className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-0.5">Plataforma Top</div>
            <div className="text-2xl font-bold text-white tracking-tight">{metrics.topPlatform}</div>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <span className="flex items-center gap-1 text-xs font-bold text-green-400 bg-green-500/10 px-2 py-1 rounded-full border border-green-500/20">
              <TrendingUp className="w-3 h-3" /> +15%
            </span>
            <span className="text-xs text-gray-500">en crecimiento</span>
          </div>
        </motion.div>

        {/* Best Time */}
        <motion.div className={cardStyle} whileHover={{ y: -2 }}>
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <Clock className="w-24 h-24" />
          </div>
          <div>
            <div className={`${iconBoxStyle} bg-purple-500/10 text-purple-400`}>
              <Clock className="w-5 h-5" />
            </div>
            <div className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-0.5">Mejor Horario</div>
            <div className="text-2xl font-bold text-white tracking-tight">{metrics.bestTime}</div>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <span className="flex items-center gap-1 text-xs font-bold text-green-400 bg-green-500/10 px-2 py-1 rounded-full border border-green-500/20">
              <Zap className="w-3 h-3" /> Alta
            </span>
            <span className="text-xs text-gray-500">efectividad</span>
          </div>
        </motion.div>

        {/* Growth */}
        <motion.div className={cardStyle} whileHover={{ y: -2 }}>
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <Zap className="w-24 h-24" />
          </div>
          <div>
            <div className={`${iconBoxStyle} bg-yellow-500/10 text-yellow-400`}>
              <Zap className="w-5 h-5" />
            </div>
            <div className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-0.5">Crecimiento</div>
            <div className="text-2xl font-bold text-white tracking-tight">{metrics.growthRate}</div>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <span className="flex items-center gap-1 text-xs font-bold text-green-400 bg-green-500/10 px-2 py-1 rounded-full border border-green-500/20">
              <TrendingUp className="w-3 h-3" /> +5%
            </span>
            <span className="text-xs text-gray-500">proyectado</span>
          </div>
        </motion.div>
      </div>

      {/* Main Content Grid 2:1 Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left Column: Demographics & Platform (Smaller) */}
        <div className="space-y-6">
          <motion.div className="bg-[#111318] border border-white/5 rounded-xl p-4 h-full shadow-lg">
            <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-400" /> Demografía
            </h3>
            <div className="space-y-3">
              {Object.entries(metrics.demographics).map(([age, percentage], index) => (
                <div key={age} className="group">
                  <div className="flex justify-between text-[10px] font-medium mb-1">
                    <span className="text-gray-400 group-hover:text-white transition-colors">{age} años</span>
                    <span className="text-white">{percentage}%</span>
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-1 overflow-hidden">
                    <motion.div
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-full rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 1, delay: 0.5 + (index * 0.1) }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div className="bg-[#111318] border border-white/5 rounded-xl p-4 shadow-lg">
            <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
              <Globe className="w-4 h-4 text-purple-400" /> Plataformas
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(metrics.platforms).map(([platform, score]) => {
                const pData = {
                  instagram: { color: 'text-pink-500', bg: 'bg-pink-500/10' },
                  tiktok: { color: 'text-white', bg: 'bg-white/10' },
                  facebook: { color: 'text-blue-500', bg: 'bg-blue-500/10' },
                  youtube: { color: 'text-red-500', bg: 'bg-red-500/10' }
                }[platform];
                return (
                  <div key={platform} className="flex items-center gap-2 p-2 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                    <div className={`w-6 h-6 rounded flex items-center justify-center ${pData.bg} ${pData.color} font-bold text-[10px] capitalize`}>
                      {platform.slice(0, 2)}
                    </div>
                    <div>
                      <div className="text-white font-bold text-sm">{score}%</div>
                      <div className="text-[9px] text-gray-500 uppercase">Alcance</div>
                    </div>
                  </div>
                )
              })}
            </div>
          </motion.div>
        </div>

        {/* Right Column: Emerging Trends (Larger) */}
        <div className="lg:col-span-2">
          <motion.div className="bg-[#111318] border border-white/5 rounded-xl p-5 h-full shadow-lg relative overflow-hidden">
            {/* Decorative BG */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/5 rounded-full blur-[100px] pointer-events-none" />

            <div className="flex justify-between items-center mb-5">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <div className="p-1.5 bg-green-500/10 rounded-lg text-green-400">
                  <TrendingUp className="w-4 h-4" />
                </div>
                Tendencias Emergentes
              </h3>
              <button className="text-xs text-green-400 font-medium hover:text-green-300 transition-colors">Ver Reporte Completo &rarr;</button>
            </div>

            <div className="space-y-3">
              {metrics.trending.map((trend, index) => (
                <div key={index} className="group relative flex items-center justify-between p-3 bg-gray-800/30 hover:bg-gray-800/60 border border-white/5 hover:border-green-500/30 rounded-lg transition-all duration-300">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-800 border border-gray-700 text-gray-400 font-bold text-xs group-hover:border-green-500 group-hover:text-green-400 transition-colors">
                      {index + 1}
                    </span>
                    <div>
                      <h4 className="text-white font-semibold text-sm mb-0.5">{trend}</h4>
                      <p className="text-[10px] text-gray-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> 2h
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-green-400 font-bold text-sm">+{Math.floor(Math.random() * 80) + 20}%</div>
                    <div className="text-[10px] text-gray-500">Volumen</div>
                  </div>

                  {/* Hover Action */}
                  <div className="absolute right-3 opacity-0 group-hover:opacity-100 transition-opacity translate-x-2 group-hover:translate-x-0 bg-[#111318] pl-3">
                    <button className="bg-green-500 text-black text-[10px] font-bold px-3 py-1.5 rounded hover:bg-green-400 transition-colors">
                      Analizar
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Cultural Insight Highlight */}
            {/* Cultural Insight Highlight */}
            <div className="mt-5 p-4 bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-white/5 rounded-xl flex items-start gap-3">
              <div className="p-1.5 bg-blue-500/20 text-blue-400 rounded-lg shrink-0">
                <Target className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-white font-semibold text-xs mb-1">Insight Estratégico</h4>
                <p className="text-gray-400 text-xs leading-relaxed">
                  Para {currentData.name}, las horas clave son entre {metrics.bestTime} y {parseInt(metrics.bestTime) + 2}:00.
                </p>
              </div>
            </div>

          </motion.div>
        </div>

      </div>
    </div>
  );
};

export default CountryDashboard;
