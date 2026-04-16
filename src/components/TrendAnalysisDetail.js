import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import TrendScoreExplainer from './TrendScoreExplainer';
import {
  ArrowLeft,
  TrendingUp,
  BarChart3,
  Share2,
  Copy,
  Download,
  Heart,
  Bookmark,
  Eye,
  Users,
  Clock,
  Zap,
  Brain,
  Target,
  Globe,
  Smartphone,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Lightbulb,
  Hash,
  Play
} from 'lucide-react';
import { Line, Area, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler);
import useStore from '../store/useStore';
import { useNotifications } from '../hooks/useNotifications';

const TrendAnalysisDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { saveTrend, savedTrends } = useStore();
  const { showToast } = useNotifications();

  const [activeTab, setActiveTab] = useState('evolution');
  const [generatedCopy, setGeneratedCopy] = useState('');
  const [generatingCopy, setGeneratingCopy] = useState(false);

  // Datos simulados de la tendencia
  const trendData = {
    id: parseInt(id),
    name: '#SustainableTech2025',
    description: 'Tecnología sostenible que está revolucionando la industria con soluciones eco-friendly y energías renovables',
    platform: 'TikTok',
    country: '🇲🇽',
    countryName: 'México',
    category: 'Tecnología',
    growth: '+245%',
    confidence: 94,
    views: '2.4M',
    engagement: '89%',
    viralScore: 95,
    predictedPeak: '3 días',
    tags: ['#sustainabletech', '#greentech', '#ecotech', '#renewable', '#innovation'],
    relatedTrends: [
      { name: '#GreenEnergy', growth: '+156%' },
      { name: '#EcoInnovation', growth: '+134%' },
      { name: '#CleanTech', growth: '+189%' }
    ],
    whyGrowing: [
      'Aumento del 340% en búsquedas relacionadas con tecnología verde',
      'Inversión récord de $2.3B en startups de tecnología sostenible',
      'Nuevas regulaciones gubernamentales favorecen la adopción',
      'Influencers tech con 50M+ seguidores están promoviendo el tema'
    ],
    suggestedHashtags: [
      '#SustainableTech2025', '#GreenInnovation', '#EcoTech', '#CleanEnergy',
      '#SustainableFuture', '#GreenTech', '#EcoFriendly', '#RenewableEnergy'
    ],
    bestPostingTimes: [
      { time: '9:00 AM', engagement: '92%' },
      { time: '2:00 PM', engagement: '87%' },
      { time: '7:00 PM', engagement: '94%' }
    ]
  };

  // Datos para gráficos
  const evolutionData = {
    labels: ['Hace 7d', 'Hace 6d', 'Hace 5d', 'Hace 4d', 'Hace 3d', 'Hace 2d', 'Ayer', 'Hoy', '+1d', '+2d', '+3d'],
    datasets: [{
      label: 'Crecimiento Real',
      data: [45, 52, 68, 74, 82, 89, 95, 100, null, null, null],
      borderColor: '#007bff',
      backgroundColor: 'rgba(0, 123, 255, 0.1)',
      tension: 0.4,
      fill: true
    }, {
      label: 'Proyección IA',
      data: [null, null, null, null, null, null, null, 100, 115, 128, 135],
      borderColor: '#00ff9d',
      backgroundColor: 'rgba(0, 255, 157, 0.1)',
      borderDash: [5, 5],
      tension: 0.4,
      fill: true
    }]
  };

  const platformData = {
    labels: ['TikTok', 'Instagram', 'Twitter', 'YouTube', 'LinkedIn'],
    datasets: [{
      label: 'Distribución por Plataforma',
      data: [45, 25, 15, 10, 5],
      backgroundColor: ['#007bff', '#00ff9d', '#8b5cf6', '#f59e0b', '#ef4444']
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: { color: '#ffffff', font: { family: 'Inter' } }
      }
    },
    scales: {
      x: { ticks: { color: '#9ca3af' }, grid: { color: 'rgba(156, 163, 175, 0.1)' } },
      y: { ticks: { color: '#9ca3af' }, grid: { color: 'rgba(156, 163, 175, 0.1)' } }
    }
  };

  const generateCopy = async () => {
    setGeneratingCopy(true);

    // Simular generación de copy con IA
    await new Promise(resolve => setTimeout(resolve, 2000));

    const copies = [
      "🌱 El futuro es verde y tecnológico. Descubre cómo #SustainableTech2025 está cambiando el mundo, una innovación a la vez. ¿Te unes a la revolución? 🚀 #GreenTech #Innovation",
      "💡 La tecnología sostenible no es solo una tendencia, es el futuro. Conoce las startups que están liderando el cambio hacia un mundo más verde 🌍 #SustainableTech2025 #EcoInnovation",
      "🔋 Energía limpia + Tecnología inteligente = El combo perfecto para salvar el planeta. Mira las últimas innovaciones que están revolucionando la industria ⚡ #CleanTech #SustainableFuture"
    ];

    setGeneratedCopy(copies[Math.floor(Math.random() * copies.length)]);
    setGeneratingCopy(false);
    showToast('Copy generado exitosamente', 'success');
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    showToast('Copiado al portapapeles', 'success');
  };

  const isSaved = savedTrends.some(t => t.id === trendData.id);

  return (
    <div className="min-h-screen bg-[#0b0c10] p-6">
      {/* Header */}
      <motion.div
        className="flex items-center gap-4 mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.button
          onClick={() => navigate(-1)}
          className="p-2 bg-[#1f1f1f] border border-gray-700 rounded-lg text-gray-400 hover:text-white hover:border-gray-600 transition-all"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <ArrowLeft className="w-5 h-5" />
        </motion.button>

        <div className="flex-1">
          <h1 className="text-3xl font-bold text-white mb-2">{trendData.name}</h1>
          <p className="text-gray-400">{trendData.description}</p>
        </div>

        <div className="flex items-center gap-3">
          <motion.button
            onClick={() => isSaved ? null : saveTrend(trendData)}
            className={`btn-ghost flex items-center gap-2 ${isSaved ? 'text-[#00ff9d]' : ''}`}
            whileHover={{ scale: 1.05 }}
          >
            <Bookmark className="w-4 h-4" />
            {isSaved ? 'Guardado' : 'Guardar'}
          </motion.button>

          <motion.button
            className="btn-ghost flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
          >
            <Share2 className="w-4 h-4" />
            Compartir
          </motion.button>
        </div>
      </motion.div>

      {/* Métricas principales */}
      <motion.div
        className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <div className="card text-center">
          <TrendingUp className="w-8 h-8 text-[#00ff9d] mx-auto mb-2" />
          <div className="text-2xl font-bold text-white">{trendData.growth}</div>
          <div className="text-gray-400 text-sm">Crecimiento</div>
        </div>
        <div className="card text-center">
          <BarChart3 className="w-8 h-8 text-[#007bff] mx-auto mb-2" />
          <div className="text-2xl font-bold text-white">{trendData.confidence}%</div>
          <div className="text-gray-400 text-sm">Confianza IA</div>
        </div>
        <div className="card text-center">
          <Eye className="w-8 h-8 text-[#8b5cf6] mx-auto mb-2" />
          <div className="text-2xl font-bold text-white">{trendData.views}</div>
          <div className="text-gray-400 text-sm">Visualizaciones</div>
        </div>
        <div className="card text-center">
          <Users className="w-8 h-8 text-[#f59e0b] mx-auto mb-2" />
          <div className="text-2xl font-bold text-white">{trendData.engagement}</div>
          <div className="text-gray-400 text-sm">Engagement</div>
        </div>
        <div className="col-span-full">
          <TrendScoreExplainer score={trendData.viralScore} />
        </div>
      </motion.div>

      {/* Tabs */}
      <motion.div
        className="flex gap-1 mb-8 bg-[#1f1f1f] p-1 rounded-xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        {[
          { id: 'evolution', label: 'Evolución', icon: TrendingUp },
          { id: 'analysis', label: 'Análisis IA', icon: Brain },
          { id: 'actions', label: 'Acciones', icon: Target }
        ].map((tab) => (
          <motion.button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg transition-all ${activeTab === tab.id
                ? 'bg-gradient-to-r from-[#007bff] to-[#00ff9d] text-white'
                : 'text-gray-400 hover:text-white'
              }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </motion.button>
        ))}
      </motion.div>

      {/* Contenido de tabs */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {activeTab === 'evolution' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="card">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-[#007bff]" />
                Evolución + Proyección Futura
              </h3>
              <div style={{ height: '300px' }}>
                <Line data={evolutionData} options={chartOptions} />
              </div>
            </div>

            <div className="card">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-[#00ff9d]" />
                Distribución por Plataforma
              </h3>
              <div style={{ height: '300px' }}>
                <Bar data={platformData} options={chartOptions} />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'analysis' && (
          <div className="space-y-6">
            <div className="card">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Brain className="w-5 h-5 text-[#8b5cf6]" />
                ¿Por qué está creciendo?
              </h3>
              <div className="space-y-3">
                {trendData.whyGrowing.map((reason, index) => (
                  <motion.div
                    key={index}
                    className="flex items-start gap-3 p-3 bg-[#1f1f1f] rounded-lg"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <CheckCircle className="w-5 h-5 text-[#00ff9d] flex-shrink-0 mt-0.5" />
                    <p className="text-gray-300">{reason}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="card">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Globe className="w-5 h-5 text-[#f59e0b]" />
                Tendencias Relacionadas
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {trendData.relatedTrends.map((trend, index) => (
                  <motion.div
                    key={index}
                    className="p-4 bg-[#1f1f1f] rounded-lg hover:bg-[#2a2a2a] transition-all cursor-pointer"
                    whileHover={{ scale: 1.02 }}
                  >
                    <h4 className="text-white font-semibold mb-2">{trend.name}</h4>
                    <div className="text-[#00ff9d] font-bold">{trend.growth}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'actions' && (
          <div className="space-y-6">
            <div className="card">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Hash className="w-5 h-5 text-[#007bff]" />
                Hashtags Sugeridos
              </h3>
              <div className="flex flex-wrap gap-2 mb-4">
                {trendData.suggestedHashtags.map((hashtag, index) => (
                  <motion.button
                    key={index}
                    onClick={() => copyToClipboard(hashtag)}
                    className="px-3 py-1 bg-[#007bff]/20 text-[#007bff] rounded-full text-sm hover:bg-[#007bff]/30 transition-all"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {hashtag}
                  </motion.button>
                ))}
              </div>
              <motion.button
                onClick={() => copyToClipboard(trendData.suggestedHashtags.join(' '))}
                className="btn-secondary flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
              >
                <Copy className="w-4 h-4" />
                Copiar todos los hashtags
              </motion.button>
            </div>

            <div className="card">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-[#00ff9d]" />
                Generador de Copy IA
              </h3>

              {generatedCopy ? (
                <div className="mb-4 p-4 bg-[#1f1f1f] rounded-lg border border-gray-700">
                  <p className="text-white mb-3">{generatedCopy}</p>
                  <motion.button
                    onClick={() => copyToClipboard(generatedCopy)}
                    className="btn-ghost flex items-center gap-2"
                    whileHover={{ scale: 1.05 }}
                  >
                    <Copy className="w-4 h-4" />
                    Copiar copy
                  </motion.button>
                </div>
              ) : null}

              <motion.button
                onClick={generateCopy}
                disabled={generatingCopy}
                className="btn-primary flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {generatingCopy ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Generando...
                  </>
                ) : (
                  <>
                    <Brain className="w-4 h-4" />
                    Generar copy IA
                  </>
                )}
              </motion.button>
            </div>

            <div className="card">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-[#8b5cf6]" />
                Mejores Horarios para Publicar
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {trendData.bestPostingTimes.map((time, index) => (
                  <div key={index} className="p-4 bg-[#1f1f1f] rounded-lg text-center">
                    <div className="text-xl font-bold text-white mb-1">{time.time}</div>
                    <div className="text-[#00ff9d] text-sm">{time.engagement} engagement</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default TrendAnalysisDetail;
