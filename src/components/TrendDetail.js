import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowUp, Star, Calendar, Users, Heart, Share, Copy } from 'lucide-react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const TrendDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const trendData = {
    name: '#ViralDance2025',
    platform: 'TikTok',
    category: 'Entretenimiento',
    country: '🇲🇽 México',
    growth: '+245%',
    confidence: 94,
    description: 'Una nueva coreografía que está tomando fuerza entre los jóvenes de 16-24 años, especialmente en México y se está expandiendo rápidamente a Estados Unidos.',
    hashtags: ['#ViralDance2025', '#DanceChallenge', '#TikTokDance', '#Viral', '#Challenge2025'],
    suggestedCopy: [
      '¿Ya conoces el #ViralDance2025? 🔥 Este baile está revolucionando TikTok',
      'La coreografía que todos están aprendiendo ✨ #ViralDance2025 #Challenge',
      'POV: Cuando dominas el #ViralDance2025 perfectamente 💯'
    ],
    metrics: {
      views: '2.4M',
      engagement: '8.7%',
      shares: '156K',
      comments: '89K'
    }
  };

  const chartData = {
    labels: ['Hace 7 días', 'Hace 6 días', 'Hace 5 días', 'Hace 4 días', 'Hace 3 días', 'Hace 2 días', 'Ayer', 'Hoy'],
    datasets: [
      {
        label: 'Crecimiento Real',
        data: [100, 150, 200, 350, 500, 800, 1200, 2450],
        borderColor: '#007bff',
        backgroundColor: 'rgba(0, 123, 255, 0.1)',
        tension: 0.4,
        fill: true
      },
      {
        label: 'Proyección IA',
        data: [null, null, null, null, null, null, 1200, 2450, 3800, 5200, 6800],
        borderColor: '#00ff9d',
        backgroundColor: 'rgba(0, 255, 157, 0.1)',
        borderDash: [5, 5],
        tension: 0.4,
        fill: false
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#ffffff',
          usePointStyle: true
        }
      }
    },
    scales: {
      x: {
        ticks: { color: '#9ca3af' },
        grid: { color: 'rgba(156, 163, 175, 0.1)' }
      },
      y: {
        ticks: { color: '#9ca3af' },
        grid: { color: 'rgba(156, 163, 175, 0.1)' }
      }
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="p-6 min-h-screen">
      {/* Header */}
      <motion.div
        className="flex items-center gap-4 mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.button
          onClick={() => navigate('/explore')}
          className="p-3 glass-effect rounded-xl text-white hover:bg-white/10 transition-all duration-300"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <ArrowLeft className="w-5 h-5" />
        </motion.button>

        <div>
          <h1 className="text-4xl font-bold text-white">{trendData.name}</h1>
          <p className="text-gray-400 text-lg">{trendData.platform} • {trendData.category}</p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Chart */}
          <motion.div
            className="glass-effect rounded-2xl p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h2 className="text-xl font-bold text-white mb-6">Evolución y Predicción</h2>
            <div style={{ height: '400px' }}>
              <Line data={chartData} options={chartOptions} />
            </div>
          </motion.div>

          {/* Analysis */}
          <motion.div
            className="glass-effect rounded-2xl p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2 className="text-xl font-bold text-white mb-4">¿Por qué crece esta tendencia?</h2>
            <p className="text-gray-300 leading-relaxed">{trendData.description}</p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <div className="bg-[#1f1f1f] rounded-xl p-4 text-center">
                <Users className="w-6 h-6 text-[#007bff] mx-auto mb-2" />
                <div className="text-white font-bold">{trendData.metrics.views}</div>
                <div className="text-gray-400 text-sm">Visualizaciones</div>
              </div>
              <div className="bg-[#1f1f1f] rounded-xl p-4 text-center">
                <Heart className="w-6 h-6 text-red-500 mx-auto mb-2" />
                <div className="text-white font-bold">{trendData.metrics.engagement}</div>
                <div className="text-gray-400 text-sm">Engagement</div>
              </div>
              <div className="bg-[#1f1f1f] rounded-xl p-4 text-center">
                <Share className="w-6 h-6 text-[#00ff9d] mx-auto mb-2" />
                <div className="text-white font-bold">{trendData.metrics.shares}</div>
                <div className="text-gray-400 text-sm">Compartidos</div>
              </div>
              <div className="bg-[#1f1f1f] rounded-xl p-4 text-center">
                <Calendar className="w-6 h-6 text-yellow-500 mx-auto mb-2" />
                <div className="text-white font-bold">{trendData.metrics.comments}</div>
                <div className="text-gray-400 text-sm">Comentarios</div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Stats Card */}
          <motion.div
            className="glass-effect rounded-2xl p-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-400">Crecimiento</span>
              <div className="flex items-center gap-1 text-[#00ff9d]">
                <ArrowUp className="w-4 h-4" />
                <span className="font-bold">{trendData.growth}</span>
              </div>
            </div>

            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-400">Confiabilidad IA</span>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                <span className="text-white font-bold">{trendData.confidence}%</span>
              </div>
            </div>

            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-400">Ubicación</span>
              <span className="text-white font-medium">{trendData.country}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-400">Plataforma</span>
              <span className="text-white font-medium">{trendData.platform}</span>
            </div>
          </motion.div>

          {/* Hashtags */}
          <motion.div
            className="glass-effect rounded-2xl p-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">Hashtags Sugeridos</h3>
              <motion.button
                onClick={() => copyToClipboard(trendData.hashtags.join(' '))}
                className="p-2 text-[#007bff] hover:bg-[#007bff]/10 rounded-lg transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Copy className="w-4 h-4" />
              </motion.button>
            </div>

            <div className="flex flex-wrap gap-2">
              {trendData.hashtags.map((hashtag, index) => (
                <motion.span
                  key={index}
                  className="px-3 py-1 bg-gradient-to-r from-[#007bff]/20 to-[#00ff9d]/20 border border-[#007bff]/30 rounded-lg text-sm text-white cursor-pointer hover:bg-[#007bff]/10"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.3 + index * 0.05 }}
                  onClick={() => copyToClipboard(hashtag)}
                  whileHover={{ scale: 1.05 }}
                >
                  {hashtag}
                </motion.span>
              ))}
            </div>
          </motion.div>

          {/* Copy Suggestions */}
          <motion.div
            className="glass-effect rounded-2xl p-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h3 className="text-lg font-bold text-white mb-4">Copy Optimizado</h3>

            <div className="space-y-3">
              {trendData.suggestedCopy.map((copy, index) => (
                <motion.div
                  key={index}
                  className="p-4 bg-[#1f1f1f] rounded-xl hover:bg-[#2a2a2a] transition-all cursor-pointer group"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                  onClick={() => copyToClipboard(copy)}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-start justify-between">
                    <p className="text-gray-300 text-sm flex-1">{copy}</p>
                    <Copy className="w-4 h-4 text-gray-400 group-hover:text-[#007bff] ml-2 transition-colors" />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Actions */}
          <motion.div
            className="space-y-3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <motion.button
              onClick={() => navigate('/actions')}
              className="w-full py-3 bg-gradient-to-r from-[#007bff] to-[#00ff9d] rounded-xl text-white font-semibold hover:shadow-xl transition-all duration-300"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Crear Estrategia con IA
            </motion.button>

            <motion.button
              className="w-full py-3 glass-effect rounded-xl text-white font-semibold hover:bg-white/10 transition-all duration-300"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Seguir Tendencia
            </motion.button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default TrendDetail;