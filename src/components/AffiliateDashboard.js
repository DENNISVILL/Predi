import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  DollarSign,
  Users,
  TrendingUp,
  Copy,
  Share2,
  Eye,
  Calendar,
  Award,
  Target,
  Link,
  Mail,
  MessageSquare,
  Download,
  ExternalLink,
  Gift,
  Star,
  Crown
} from 'lucide-react';
import usePricingStore from '../store/usePricingStore';

const AffiliateDashboard = () => {
  const { getAffiliateStats, affiliateData } = usePricingStore();
  const [activeTab, setActiveTab] = useState('overview');
  const [referralLink, setReferralLink] = useState('');
  const [copied, setCopied] = useState(false);

  const stats = getAffiliateStats();
  
  useEffect(() => {
    // Generar link de referido único
    const userId = 'USER123'; // Esto vendría del store de usuario
    setReferralLink(`https://predix.com/ref/${userId}`);
  }, []);

  const copyReferralLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const tabs = [
    { id: 'overview', label: 'Resumen', icon: TrendingUp },
    { id: 'referrals', label: 'Referidos', icon: Users },
    { id: 'earnings', label: 'Ganancias', icon: DollarSign },
    { id: 'materials', label: 'Material', icon: Share2 }
  ];

  const marketingMaterials = [
    {
      type: 'banner',
      title: 'Banner Principal 728x90',
      description: 'Banner horizontal para sitios web',
      preview: '🖼️',
      downloadUrl: '/materials/banner-728x90.png'
    },
    {
      type: 'social',
      title: 'Post Instagram 1080x1080',
      description: 'Imagen cuadrada para redes sociales',
      preview: '📱',
      downloadUrl: '/materials/instagram-post.png'
    },
    {
      type: 'video',
      title: 'Video Promocional 30s',
      description: 'Video corto para TikTok/Instagram',
      preview: '🎥',
      downloadUrl: '/materials/promo-video.mp4'
    },
    {
      type: 'copy',
      title: 'Textos Promocionales',
      description: 'Copys listos para usar',
      preview: '📝',
      content: [
        "🚀 ¿Quieres predecir las próximas tendencias virales? Predix usa IA para detectar microtendencias 24-72h antes. ¡Pruébalo gratis! [LINK]",
        "💡 Deja de perseguir tendencias y empieza a predecirlas. Predix te da ventaja competitiva real. Regístrate gratis: [LINK]",
        "📈 +300% más engagement cuando predices vs cuando reaccionas. Predix hace la diferencia. Comienza gratis: [LINK]"
      ]
    }
  ];

  const recentReferrals = [
    { id: 1, name: 'Ana García', email: 'ana@email.com', plan: 'Pro', status: 'active', date: '2024-11-01', commission: 14.70 },
    { id: 2, name: 'Carlos López', email: 'carlos@email.com', plan: 'Basic', status: 'active', date: '2024-10-28', commission: 5.70 },
    { id: 3, name: 'María Rodríguez', email: 'maria@email.com', plan: 'Premium', status: 'pending', date: '2024-10-25', commission: 29.70 },
    { id: 4, name: 'Juan Pérez', email: 'juan@email.com', plan: 'Pro', status: 'cancelled', date: '2024-10-20', commission: 0 }
  ];

  return (
    <div className="min-h-screen bg-[#0b0c10] p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center">
              <Crown className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Dashboard Emprendedor</h1>
              <p className="text-gray-400">Programa de Embajadores Predix</p>
            </div>
          </div>

          {/* Status Badge */}
          <div className="inline-flex items-center gap-2 bg-green-500/20 border border-green-500/30 rounded-full px-4 py-2">
            <Award className="w-4 h-4 text-green-400" />
            <span className="text-green-400 font-semibold">Partner Verificado</span>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            className="glass-effect rounded-2xl p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-400" />
              </div>
              <span className="text-green-400 text-sm font-semibold">+12%</span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">
              ${stats?.totalEarnings || 0}
            </h3>
            <p className="text-gray-400 text-sm">Ganancias Totales</p>
          </motion.div>

          <motion.div
            className="glass-effect rounded-2xl p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-400" />
              </div>
              <span className="text-blue-400 text-sm font-semibold">+5</span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">
              {stats?.totalReferrals || 0}
            </h3>
            <p className="text-gray-400 text-sm">Total Referidos</p>
          </motion.div>

          <motion.div
            className="glass-effect rounded-2xl p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                <Target className="w-6 h-6 text-purple-400" />
              </div>
              <span className="text-purple-400 text-sm font-semibold">85%</span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">
              {stats?.activeReferrals || 0}
            </h3>
            <p className="text-gray-400 text-sm">Referidos Activos</p>
          </motion.div>

          <motion.div
            className="glass-effect rounded-2xl p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center">
                <Gift className="w-6 h-6 text-yellow-400" />
              </div>
              <span className="text-yellow-400 text-sm font-semibold">30%</span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">
              ${stats?.pendingEarnings || 0}
            </h3>
            <p className="text-gray-400 text-sm">Pendiente de Pago</p>
          </motion.div>
        </div>

        {/* Referral Link */}
        <motion.div
          className="glass-effect rounded-2xl p-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Link className="w-5 h-5" />
            Tu Link de Referido
          </h3>
          <div className="flex items-center gap-4">
            <div className="flex-1 bg-gray-800 border border-gray-600 rounded-xl px-4 py-3">
              <span className="text-gray-300 font-mono text-sm">{referralLink}</span>
            </div>
            <motion.button
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                copied 
                  ? 'bg-green-500 text-white' 
                  : 'bg-gradient-to-r from-[#007bff] to-[#00ff9d] text-white hover:shadow-lg'
              }`}
              onClick={copyReferralLink}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {copied ? 'Copiado!' : 'Copiar'}
            </motion.button>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-gray-800/50 rounded-2xl p-1 mb-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold transition-all duration-300 ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-[#007bff] to-[#00ff9d] text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Performance Chart */}
              <div className="glass-effect rounded-2xl p-6">
                <h3 className="text-xl font-bold text-white mb-6">Rendimiento Mensual</h3>
                <div className="h-64 flex items-center justify-center text-gray-400">
                  <div className="text-center">
                    <TrendingUp className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Gráfico de rendimiento próximamente</p>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="glass-effect rounded-2xl p-6">
                <h3 className="text-xl font-bold text-white mb-6">Actividad Reciente</h3>
                <div className="space-y-4">
                  {recentReferrals.slice(0, 5).map((referral) => (
                    <div key={referral.id} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-[#007bff] to-[#00ff9d] rounded-full flex items-center justify-center">
                          <span className="text-white text-xs font-bold">
                            {referral.name.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <p className="text-white font-semibold text-sm">{referral.name}</p>
                          <p className="text-gray-400 text-xs">Plan {referral.plan}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-green-400 font-semibold text-sm">
                          +${referral.commission}
                        </p>
                        <p className="text-gray-400 text-xs">{referral.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Referrals Tab */}
          {activeTab === 'referrals' && (
            <div className="glass-effect rounded-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-6">Todos los Referidos</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="text-left text-gray-400 font-semibold py-3">Usuario</th>
                      <th className="text-left text-gray-400 font-semibold py-3">Plan</th>
                      <th className="text-left text-gray-400 font-semibold py-3">Estado</th>
                      <th className="text-left text-gray-400 font-semibold py-3">Fecha</th>
                      <th className="text-right text-gray-400 font-semibold py-3">Comisión</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentReferrals.map((referral) => (
                      <tr key={referral.id} className="border-b border-gray-800">
                        <td className="py-4">
                          <div>
                            <p className="text-white font-semibold">{referral.name}</p>
                            <p className="text-gray-400 text-sm">{referral.email}</p>
                          </div>
                        </td>
                        <td className="py-4">
                          <span className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded-lg text-sm">
                            {referral.plan}
                          </span>
                        </td>
                        <td className="py-4">
                          <span className={`px-2 py-1 rounded-lg text-sm ${
                            referral.status === 'active' 
                              ? 'bg-green-500/20 text-green-400'
                              : referral.status === 'pending'
                              ? 'bg-yellow-500/20 text-yellow-400'
                              : 'bg-red-500/20 text-red-400'
                          }`}>
                            {referral.status === 'active' ? 'Activo' : 
                             referral.status === 'pending' ? 'Pendiente' : 'Cancelado'}
                          </span>
                        </td>
                        <td className="py-4 text-gray-300">{referral.date}</td>
                        <td className="py-4 text-right">
                          <span className={`font-semibold ${
                            referral.commission > 0 ? 'text-green-400' : 'text-gray-400'
                          }`}>
                            ${referral.commission}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Earnings Tab */}
          {activeTab === 'earnings' && (
            <div className="grid lg:grid-cols-2 gap-8">
              <div className="glass-effect rounded-2xl p-6">
                <h3 className="text-xl font-bold text-white mb-6">Resumen de Ganancias</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-gray-800/50 rounded-xl">
                    <span className="text-gray-300">Ganancias Este Mes</span>
                    <span className="text-green-400 font-bold text-lg">$247.50</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-gray-800/50 rounded-xl">
                    <span className="text-gray-300">Ganancias Totales</span>
                    <span className="text-white font-bold text-lg">${stats?.totalEarnings || 0}</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-gray-800/50 rounded-xl">
                    <span className="text-gray-300">Pendiente de Pago</span>
                    <span className="text-yellow-400 font-bold text-lg">${stats?.pendingEarnings || 0}</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-gray-800/50 rounded-xl">
                    <span className="text-gray-300">Tasa de Comisión</span>
                    <span className="text-blue-400 font-bold text-lg">30%</span>
                  </div>
                </div>
              </div>

              <div className="glass-effect rounded-2xl p-6">
                <h3 className="text-xl font-bold text-white mb-6">Próximo Pago</h3>
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-r from-[#007bff] to-[#00ff9d] rounded-full flex items-center justify-center mx-auto mb-4">
                    <Calendar className="w-10 h-10 text-white" />
                  </div>
                  <h4 className="text-2xl font-bold text-white mb-2">15 Diciembre</h4>
                  <p className="text-gray-400 mb-4">Los pagos se procesan el día 15 de cada mes</p>
                  <div className="bg-green-500/20 border border-green-500/30 rounded-xl p-4">
                    <p className="text-green-400 font-semibold">
                      Próximo pago: ${stats?.pendingEarnings || 0}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Materials Tab */}
          {activeTab === 'materials' && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {marketingMaterials.map((material, index) => (
                <motion.div
                  key={index}
                  className="glass-effect rounded-2xl p-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <div className="text-center mb-4">
                    <div className="text-4xl mb-3">{material.preview}</div>
                    <h4 className="text-lg font-bold text-white mb-2">{material.title}</h4>
                    <p className="text-gray-400 text-sm">{material.description}</p>
                  </div>

                  {material.content ? (
                    <div className="space-y-3">
                      {material.content.map((copy, i) => (
                        <div key={i} className="bg-gray-800/50 rounded-xl p-3">
                          <p className="text-gray-300 text-sm mb-2">{copy}</p>
                          <button
                            onClick={() => navigator.clipboard.writeText(copy)}
                            className="text-[#007bff] hover:text-[#00ff9d] text-xs flex items-center gap-1"
                          >
                            <Copy className="w-3 h-3" />
                            Copiar
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <motion.button
                      className="w-full bg-gradient-to-r from-[#007bff] to-[#00ff9d] text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Download className="w-4 h-4" />
                      Descargar
                    </motion.button>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default AffiliateDashboard;
