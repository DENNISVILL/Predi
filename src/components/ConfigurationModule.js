import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  Settings,
  Bell,
  Globe,
  Moon,
  Sun,
  Smartphone,
  Mail,
  Lock,
  CreditCard,
  Crown,
  Shield,
  Download,
  Trash2,
  LogOut,
  Edit,
  Camera,
  Save,
  X,
  ChevronRight,
  Check,
  Zap,
  Layout,
  BellRing,
  Clock, // Added for billing history
  MapPin,
  Laptop,
  Users,
  Upload,
  Palette
} from 'lucide-react';
import useStore from '../store/useStore';
import { useNotifications } from '../hooks/useNotifications';

// Paddle Environment (Test/Sandbox)
const PADDLE_ENV = 'sandbox'; // Change to 'production' when ready
const PADDLE_CLIENT_TOKEN = 'test_839ac57489274291848574829'; // Placeholder Token

const ConfigurationModule = () => {
  const { user, logout, theme, setTheme, language, setLanguage } = useStore();

  const { showToast } = useNotifications();

  // Initialize Paddle
  React.useEffect(() => {
    if (window.Paddle) {
      if (PADDLE_ENV === 'sandbox') {
        window.Paddle.Environment.set('sandbox');
      }

      window.Paddle.Initialize({
        token: PADDLE_CLIENT_TOKEN,
        eventCallback: function (data) {
          console.log('Paddle Event:', data);
          // Here you would send the data.eventData to your backend
        }
      });
    }
  }, []);

  const handleUpgrade = (plan) => {
    if (!window.Paddle) {
      showToast('Error cargando pasarela de pago. Intenta recargar.', 'error');
      return;
    }

    if (!plan.paddlePriceId) {
      showToast('ID de producto no configurado para este plan.', 'warning');
      console.warn('Falta paddlePriceId para:', plan.name);
      // For demo purposes, we will simulate opening a generic checkout
      window.Paddle.Checkout.open({
        items: [{ priceId: 'pri_test_12345', quantity: 1 }] // Dummy ID to trigger overlay
      });
      return;
    }

    // Open Paddle Checkout
    window.Paddle.Checkout.open({
      items: [{ priceId: plan.paddlePriceId, quantity: 1 }],
      customer: {
        email: user?.email || '',
      },
      settings: {
        displayMode: 'overlay',
        theme: theme === 'dark' ? 'dark' : 'light',
        locale: 'es'
      }
    });
  };

  const [activeTab, setActiveTab] = useState('profile');
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || 'Usuario Demo',
    email: user?.email || 'demo@predix.app',
    country: user?.country || '🇲🇽 México',
    bio: user?.bio || 'Especialista en marketing digital y tendencias',
    interests: user?.interests || ['tech', 'marketing']
  });

  const [notifications, setNotifications] = useState({
    viral: true,
    microtendencias: true,
    seguimiento: false,
    recomendaciones: true,
    email: true,
    push: true
  });

  const [billingCycle, setBillingCycle] = useState('monthly'); // 'monthly' or 'yearly'

  // White Label State
  const [whiteLabel, setWhiteLabel] = useState({
    agencyName: 'Mi Agencia Virtual',
    primaryColor: '#00ff9d',
    logoUrl: null
  });

  // Security & Privacy State
  const [securitySettings, setSecuritySettings] = useState({
    twoFactor: false,
    improveAI: true,
    publicProfile: false
  });

  const [sessions, setSessions] = useState([
    { id: 1, device: 'MacBook Pro', location: 'Ciudad de México, MX', active: true, icon: Laptop, ip: '192.168.1.1' },
    { id: 2, device: 'iPhone 15 Pro', location: 'Ciudad de México, MX', active: false, time: 'Hace 2 horas', icon: Smartphone, ip: '189.20.50.12' }
  ]);

  const handleToggleSecurity = (key) => {
    setSecuritySettings(prev => {
      const newState = { ...prev, [key]: !prev[key] };
      showToast(`Configuración de ${key === 'twoFactor' ? '2FA' : key} actualizada`, 'success');
      return newState;
    });
  };

  const handleCloseSession = (sessionId) => {
    setSessions(prev => prev.filter(s => s.id !== sessionId));
    showToast('Sesión cerrada correctamente', 'success');
  };

  const handleDownloadData = () => {
    showToast('Preparando descarga de datos...', 'info');
    setTimeout(() => {
      showToast('Tus datos se han descargado', 'success');
    }, 2000);
  };

  const handleDeleteAccount = () => {
    // In a real app, this would open a confirmation modal
    if (window.confirm('¿Estás seguro de que quieres eliminar tu cuenta? Esta acción no se puede deshacer.')) {
      showToast('Cuenta programada para eliminación', 'error');
    }
  };

  const handleChangePassword = () => {
    showToast('Se ha enviado un correo para restablecer tu contraseña', 'info');
  };

  const tabs = [
    { id: 'profile', label: 'Perfil', icon: User, desc: 'Gestiona tu información personal' },
    { id: 'notifications', label: 'Notificaciones', icon: BellRing, desc: 'Controla tus alertas' },
    { id: 'preferences', label: 'Preferencias', icon: Settings, desc: 'Personaliza tu experiencia' },
    { id: 'plan', label: 'Plan & Facturación', icon: Crown, desc: 'Mejora tu suscripción' },
    { id: 'privacy', label: 'Privacidad', icon: Shield, desc: 'Seguridad y datos' }
  ];

  const plans = [
    {
      name: 'Gratuito',
      price: 0,
      period: 'para siempre',
      current: true,
      features: ['1 Usuario', 'Acceso a Centro de Mando', 'Límites de uso estrictos', 'Soporte comunitario'],
      color: 'gray'
    },
    {
      name: 'Starter',
      price: 29,
      period: 'mes',
      current: false,
      features: ['1 Usuario', 'Planificador y Estudio Básico', 'Base Prompts Limitada', 'Soporte estándar'],
      color: 'blue',
      paddlePriceId: 'pri_starter_monthly'
    },
    {
      name: 'Agency Pro',
      price: 99,
      period: 'mes',
      current: false,
      popular: true,
      features: ['Hasta 5 Usuarios', 'Acceso total a 6 Departamentos', 'Máquina B2B (LinkedIn)', 'IA Avanzada (GPT-4)'],
      color: 'green',
      paddlePriceId: 'pri_pro_monthly'
    },
    {
      name: 'Enterprise',
      price: 299,
      period: 'mes',
      current: false,
      features: ['Usuarios Ilimitados', 'Modelos IA Personalizados', 'Acceso API y Marca Blanca', 'Consultoría mensual'],
      color: 'purple',
      paddlePriceId: 'pri_enterprise_monthly'
    }
  ];

  const alacarteModules = [
    {
      id: 'mod_direccion',
      name: 'Dirección y Estrategia',
      desc: 'Finanzas, CRM y Estratega IA',
      price: 19,
      icon: Crown,
      features: ['Dashboard Financiero', 'IA Estratégica', 'Radar de Tendencias']
    },
    {
      id: 'mod_creatividad',
      name: 'Creatividad y Diseño',
      desc: 'Tu estudio creativo personal',
      price: 19,
      icon: Camera,
      features: ['Generador de Imágenes', 'Edición Avanzada', 'Assets Ilimitados']
    },
    {
      id: 'mod_contenido',
      name: 'Contenido y Copywriting',
      desc: 'Genera contenido a escala',
      price: 24,
      icon: Edit,
      features: ['Planificador Omni', 'Funnels de Email', 'Base de Prompts (10k+)']
    },
    {
      id: 'mod_performance',
      name: 'Performance y Paid Media',
      desc: 'Optimiza tu ROAS con IA',
      price: 19,
      icon: Zap,
      features: ['Gestor de Ads', 'Optimización Automática', 'Métricas en Tiempo Real']
    },
    {
      id: 'mod_seo',
      name: 'SEO y Tecnología',
      desc: 'Domina los buscadores',
      price: 24,
      icon: Globe,
      features: ['Auditorías SEO', 'Topical Maps', 'Analítica Web']
    },
    {
      id: 'mod_b2b',
      name: 'Comercial y B2B',
      desc: 'Prospección en LinkedIn',
      price: 29,
      icon: Users,
      features: ['Automatización LinkedIn', 'CRM de Leads', 'Scripts de Ventas']
    }
  ];

  const handleSaveProfile = () => {
    setEditingProfile(false);
    showToast('Perfil actualizado correctamente', 'success');
  };

  const handleLogout = () => {
    logout();
    showToast('Sesión cerrada', 'info');
  };

  const TabButton = ({ tab, isActive, onClick }) => (
    <motion.button
      onClick={onClick}
      className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all duration-300 relative overflow-hidden group ${isActive
        ? 'bg-gradient-to-r from-[#007bff]/20 to-[#00ff9d]/20 border border-[#00ff9d]/30 text-[#00bb72] shadow-lg shadow-[#00ff9d]/10'
        : `hover:bg-black/5 ${theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-black'} border border-transparent`
        }`}
      whileHover={{ scale: 1.02, x: 5 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className={`p-2 rounded-lg transition-colors ${isActive
        ? 'bg-[#00ff9d]/20 text-[#00bb72]'
        : theme === 'dark' ? 'bg-gray-800 text-gray-400 group-hover:text-white' : 'bg-gray-200 text-gray-500 group-hover:text-black'
        }`}>
        <tab.icon className="w-5 h-5" />
      </div>
      <div className="text-left flex-1">
        <div className={`font-semibold ${isActive ? (theme === 'dark' ? 'text-white' : 'text-black') : ''}`}>{tab.label}</div>
        <div className="text-xs opacity-70 hidden xl:block">{tab.desc}</div>
      </div>
      {isActive && (
        <motion.div
          layoutId="activeTabIndicator"
          className="absolute right-0 top-0 bottom-0 w-1 bg-[#00ff9d]"
        />
      )}
    </motion.button>
  );

  return (
    <div className="min-h-screen p-6 lg:p-10 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        className="mb-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className={`text-4xl font-bold bg-clip-text text-transparent mb-2 ${theme === 'dark'
          ? 'bg-gradient-to-r from-white to-gray-400'
          : 'bg-gradient-to-r from-gray-900 to-gray-600'
          }`}>
          Configuración
        </h1>
        <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Administra tu cuenta, preferencias y suscripción.</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Navigation Sidebar */}
        <motion.div
          className="lg:col-span-3 space-y-2"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          {tabs.map((tab) => (
            <TabButton
              key={tab.id}
              tab={tab}
              isActive={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
            />
          ))}
        </motion.div>

        {/* Content Area */}
        <motion.div
          className="lg:col-span-9"
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className={`backdrop-blur-xl border rounded-2xl p-6 lg:p-8 min-h-[600px] shadow-2xl relative overflow-hidden transition-colors duration-300 ${theme === 'dark'
            ? 'bg-[#1a1a1a]/50 border-gray-800'
            : 'bg-white/80 border-white shadow-xl'
            }`}>

            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] -mr-20 -mt-20 pointer-events-none" />

            {activeTab === 'profile' && (
              <div className="space-y-8 relative z-10">
                <div className={`flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b pb-8 ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'}`}>
                  <div className="flex items-center gap-6">
                    <div className="relative group cursor-pointer">
                      <div className="w-24 h-24 rounded-2xl bg-gradient-to-tr from-[#007bff] to-[#00ff9d] p-[2px]">
                        <div className={`w-full h-full rounded-2xl flex items-center justify-center relative overflow-hidden ${theme === 'dark' ? 'bg-[#1a1a1a]' : 'bg-white'}`}>
                          {profileData.name ? (
                            <span className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>{profileData.name.charAt(0)}</span>
                          ) : <User className={`w-8 h-8 ${theme === 'dark' ? 'text-white' : 'text-gray-400'}`} />}

                          {/* Hover Overlay */}
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Camera className="w-6 h-6 text-white" />
                          </div>
                        </div>
                      </div>
                      <div className={`absolute -bottom-2 -right-2 w-6 h-6 rounded-full border-2 flex items-center justify-center ${theme === 'dark' ? 'bg-[#00ff9d] border-[#1a1a1a]' : 'bg-[#00ff9d] border-white'}`}>
                        <Check className="w-3 h-3 text-black font-bold" />
                      </div>
                    </div>
                    <div>
                      <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{profileData.name}</h2>
                      <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>{profileData.email}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className={`px-2 py-0.5 rounded-md text-xs border ${theme === 'dark' ? 'bg-white/10 text-gray-300 border-white/10' : 'bg-gray-100 text-gray-600 border-gray-200'}`}>Plan Gratuito</span>
                        <span className={`px-2 py-0.5 rounded-md text-xs border ${theme === 'dark' ? 'bg-white/10 text-gray-300 border-white/10' : 'bg-gray-100 text-gray-600 border-gray-200'}`}>{profileData.country}</span>
                      </div>
                    </div>
                  </div>

                  <motion.button
                    onClick={editingProfile ? handleSaveProfile : () => setEditingProfile(true)}
                    className={`px-6 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-all ${editingProfile
                      ? 'bg-[#00ff9d] text-black hover:bg-[#00cc7a]'
                      : theme === 'dark'
                        ? 'bg-white/10 text-white hover:bg-white/20'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {editingProfile ? <Save className="w-4 h-4" /> : <Edit className="w-4 h-4" />}
                    {editingProfile ? 'Guardar Cambios' : 'Editar Perfil'}
                  </motion.button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="group">
                      <label className={`text-sm mb-1 block group-focus-within:text-[#00ff9d] transition-colors ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Nombre Completo</label>
                      <input
                        type="text"
                        value={profileData.name}
                        onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                        disabled={!editingProfile}
                        className={`w-full border rounded-lg px-4 py-3 focus:outline-none focus:border-[#00ff9d] disabled:opacity-70 transition-all ${theme === 'dark'
                          ? 'bg-[#0b0c10] border-gray-800 text-white'
                          : 'bg-gray-50 border-gray-200 text-gray-900 disabled:bg-gray-100'
                          }`}
                      />
                    </div>
                    <div className="group">
                      <label className={`text-sm mb-1 block group-focus-within:text-[#00ff9d] transition-colors ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Email</label>
                      <input
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                        disabled={true}
                        className={`w-full border rounded-lg px-4 py-3 cursor-not-allowed ${theme === 'dark'
                          ? 'bg-[#0b0c10] border-gray-800 text-gray-400'
                          : 'bg-gray-100 border-gray-200 text-gray-500'
                          }`}
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="group">
                      <label className={`text-sm mb-1 block group-focus-within:text-[#00ff9d] transition-colors ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>País / Región</label>
                      <select
                        value={profileData.country}
                        onChange={(e) => setProfileData({ ...profileData, country: e.target.value })}
                        disabled={!editingProfile}
                        className={`w-full border rounded-lg px-4 py-3 focus:outline-none focus:border-[#00ff9d] disabled:opacity-70 transition-all appearance-none ${theme === 'dark'
                          ? 'bg-[#0b0c10] border-gray-800 text-white'
                          : 'bg-gray-50 border-gray-200 text-gray-900'
                          }`}
                      >
                        <option>🇲🇽 México</option>
                        <option>🇺🇸 Estados Unidos</option>
                        <option>🇪🇸 España</option>
                        <option>🇨🇴 Colombia</option>
                        <option>🇦🇷 Argentina</option>
                      </select>
                    </div>
                  </div>
                  <div className="md:col-span-2 group">
                    <label className={`text-sm mb-1 block group-focus-within:text-[#00ff9d] transition-colors ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Bio</label>
                    <textarea
                      value={profileData.bio}
                      onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                      disabled={!editingProfile}
                      className={`w-full border rounded-lg px-4 py-3 focus:outline-none focus:border-[#00ff9d] disabled:opacity-70 transition-all h-32 resize-none ${theme === 'dark'
                        ? 'bg-[#0b0c10] border-gray-800 text-white'
                        : 'bg-gray-50 border-gray-200 text-gray-900'
                        }`}
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-6 max-w-2xl">
                <div className="mb-6">
                  <h2 className={`text-2xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Preferencias de Alerta</h2>
                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Elige qué notificaciones quieres recibir y dónde.</p>
                </div>

                {Object.entries(notifications).map(([key, value]) => (
                  <motion.div
                    key={key}
                    className={`flex items-center justify-between p-4 rounded-xl border transition-colors ${theme === 'dark'
                      ? 'bg-[#0b0c10]/50 border-gray-800 hover:bg-[#0b0c10]'
                      : 'bg-white border-gray-100 shadow-sm hover:border-gray-200'
                      }`}
                    whileHover={{ scale: 1.01 }}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`p-2.5 rounded-lg ${value
                        ? 'bg-[#00ff9d]/20 text-[#00bb72]'
                        : theme === 'dark' ? 'bg-gray-800 text-gray-500' : 'bg-gray-100 text-gray-400'
                        }`}>
                        <Bell className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className={`font-medium capitalize ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{key}</h3>
                        <p className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                          {key === 'viral' && 'Notificarme tendencias >80% viralidad'}
                          {key === 'microtendencias' && 'Alertas tempranas de nicho'}
                          {key === 'seguimiento' && 'Cambios en tendencias guardadas'}
                          {key === 'recomendaciones' && 'Tips personalizados de IA'}
                          {key === 'email' && 'Recibir resumen semanal'}
                          {key === 'push' && 'Notificaciones de navegador'}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => setNotifications({ ...notifications, [key]: !value })}
                      className={`w-14 h-7 rounded-full p-1 transition-colors duration-300 ease-in-out ${value
                        ? 'bg-[#00ff9d]'
                        : theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
                        }`}
                    >
                      <motion.div
                        className="w-5 h-5 bg-white rounded-full shadow-md"
                        animate={{ x: value ? 28 : 0 }}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      />
                    </button>
                  </motion.div>
                ))}
              </div>
            )}

            {activeTab === 'preferences' && (
              <div className="space-y-8 max-w-3xl">
                <div>
                  <h2 className={`text-2xl font-bold mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>Apariencia y Regionalización</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Theme Selector */}
                    <div className={`p-6 rounded-2xl border ${theme === 'dark' ? 'border-gray-800 bg-[#0b0c10]/50' : 'border-gray-200 bg-white shadow-sm'}`}>
                      <h3 className={`font-semibold mb-4 flex items-center gap-2 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                        <Layout className="w-5 h-5 text-[#007bff]" /> Tema
                      </h3>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          onClick={() => {
                            setTheme('dark');
                            showToast('Tema oscuro activado', 'success');
                          }}
                          className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${theme === 'dark'
                            ? 'bg-[#1f1f1f] border-[#007bff] text-white shadow-lg shadow-blue-500/10'
                            : 'border-gray-200 text-gray-400 hover:bg-gray-50'
                            }`}
                        >
                          <Moon className="w-6 h-6" />
                          <span className="text-sm">Oscuro</span>
                        </button>
                        <button
                          onClick={() => {
                            setTheme('light');
                            showToast('Tema claro activado', 'success');
                          }}
                          className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${theme === 'light'
                            ? 'bg-gray-100 border-[#007bff] text-black shadow-lg'
                            : 'border-gray-800 text-gray-500 hover:bg-[#1f1f1f]'
                            }`}
                        >
                          <Sun className="w-6 h-6" />
                          <span className="text-sm">Claro</span>
                        </button>
                      </div>
                    </div>

                    {/* Language Selector */}
                    <div className={`p-6 rounded-2xl border ${theme === 'dark' ? 'border-gray-800 bg-[#0b0c10]/50' : 'border-gray-200 bg-white shadow-sm'}`}>
                      <h3 className={`font-semibold mb-4 flex items-center gap-2 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                        <Globe className="w-5 h-5 text-[#00ff9d]" /> Idioma
                      </h3>
                      <div className="space-y-2">
                        {['Español (Latinoamérica)', 'English (US)', 'Português (Brasil)'].map((lang) => (
                          <button
                            key={lang}
                            onClick={() => {
                              const langCode = lang.includes('English') ? 'en' : lang.includes('Português') ? 'pt' : 'es';
                              setLanguage(langCode);
                              showToast(`Idioma cambiado a ${lang}`, 'success');
                            }}
                            className={`w-full flex items-center justify-between p-3 rounded-lg text-left transition-colors group ${(language === 'es' && lang.includes('Español')) ||
                              (language === 'en' && lang.includes('English')) ||
                              (language === 'pt' && lang.includes('Português'))
                              ? 'bg-[#00ff9d]/10 text-[#00bb72] border border-[#00ff9d]/30 font-medium'
                              : `hover:bg-black/5 ${theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-black'} border border-transparent`
                              }`}
                          >
                            <span>{lang}</span>
                            {((language === 'es' && lang.includes('Español')) ||
                              (language === 'en' && lang.includes('English')) ||
                              (language === 'pt' && lang.includes('Português'))) &&
                              <Check className="w-4 h-4 text-[#00ff9d]" />}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* White Label Settings */}
                  <div className="mt-8">
                    <h2 className={`text-2xl font-bold mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>Marca Blanca (Agency OS)</h2>
                    <div className={`p-6 rounded-2xl border ${theme === 'dark' ? 'border-gray-800 bg-[#0b0c10]/50' : 'border-gray-200 bg-white shadow-sm'}`}>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Logo Upload */}
                        <div>
                          <h3 className={`font-semibold mb-4 flex items-center gap-2 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                            <Camera className="w-5 h-5 text-purple-500" /> Logo de tu Agencia
                          </h3>
                          <div className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-center transition-colors ${theme === 'dark' ? 'border-gray-700 hover:border-purple-500 bg-white/5' : 'border-gray-300 hover:border-purple-500 bg-gray-50'}`}>
                            {whiteLabel.logoUrl ? (
                              <img src={whiteLabel.logoUrl} alt="Agency Logo" className="h-12 object-contain mb-4" />
                            ) : (
                              <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center mb-4">
                                <Upload className="w-6 h-6 text-purple-500" />
                              </div>
                            )}
                            <p className={`text-sm mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Arrastra tu logo aquí o</p>
                            <label className="text-sm text-purple-500 font-semibold cursor-pointer hover:underline">
                              explora tus archivos
                              <input 
                                type="file" 
                                className="hidden" 
                                accept="image/*"
                                onChange={(e) => {
                                  if (e.target.files && e.target.files[0]) {
                                    const reader = new FileReader();
                                    reader.onload = (e) => setWhiteLabel({ ...whiteLabel, logoUrl: e.target.result });
                                    reader.readAsDataURL(e.target.files[0]);
                                    showToast('Logo actualizado', 'success');
                                  }
                                }}
                              />
                            </label>
                            <p className="text-xs text-gray-500 mt-2">PNG transparente recomendado. Máx 2MB.</p>
                          </div>
                        </div>

                        {/* Brand Details */}
                        <div className="space-y-4">
                          <div>
                            <label className={`text-sm mb-1 block font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Nombre de la Agencia</label>
                            <input
                              type="text"
                              value={whiteLabel.agencyName}
                              onChange={(e) => setWhiteLabel({ ...whiteLabel, agencyName: e.target.value })}
                              className={`w-full border rounded-lg px-4 py-3 focus:outline-none focus:border-purple-500 transition-all ${theme === 'dark'
                                ? 'bg-[#0b0c10] border-gray-800 text-white'
                                : 'bg-gray-50 border-gray-200 text-gray-900'
                                }`}
                            />
                          </div>

                          <div>
                            <label className={`text-sm mb-1 block font-medium flex items-center gap-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                              <Palette className="w-4 h-4" /> Color Primario
                            </label>
                            <div className="flex items-center gap-3">
                              <input
                                type="color"
                                value={whiteLabel.primaryColor}
                                onChange={(e) => setWhiteLabel({ ...whiteLabel, primaryColor: e.target.value })}
                                className="w-12 h-12 rounded cursor-pointer border-0 p-0"
                              />
                              <span className={`text-sm font-mono ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                                {whiteLabel.primaryColor.toUpperCase()}
                              </span>
                            </div>
                            <p className="text-xs text-gray-500 mt-2">Este color reemplazará el verde esmeralda base de Predix.</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-6 flex justify-end">
                         <button 
                           onClick={() => showToast('Configuración de Marca Blanca guardada. Recarga para aplicar cambios.', 'success')}
                           className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg text-sm font-bold transition-colors"
                         >
                           Aplicar Marca Blanca
                         </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'plan' && (
              <div className="space-y-12">
                
                {/* === TODO EN UNO === */}
                <div>
                  <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
                    <div>
                      <h2 className={`text-2xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Suscripciones All-In-One</h2>
                      <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Desbloquea toda la agencia virtual.</p>
                    </div>
                    <div className={`flex items-center gap-2 text-sm px-4 py-2 rounded-lg ${theme === 'dark' ? 'text-gray-400 bg-white/5' : 'text-gray-600 bg-gray-100'
                      }`}>
                      <CreditCard className="w-4 h-4" />
                      Próxima facturación: <span className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>N/A</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                    {plans.map((plan) => (
                      <motion.div
                        key={plan.name}
                        className={`relative p-6 rounded-2xl border transition-all duration-300 flex flex-col ${plan.current
                          ? theme === 'dark'
                            ? 'bg-[#1f1f1f] border-gray-700'
                            : 'bg-gray-50 border-gray-200'
                          : plan.popular
                            ? theme === 'dark'
                              ? 'bg-gradient-to-b from-[#1a1a2e] to-[#0d0d1a] border-[#007bff]/50 shadow-lg shadow-blue-500/10'
                              : 'bg-white border-blue-200 shadow-xl shadow-blue-100 ring-1 ring-blue-100'
                            : theme === 'dark'
                              ? 'bg-[#0b0c10] border-gray-800 hover:border-gray-700'
                              : 'bg-white border-gray-100 shadow-sm hover:border-gray-200 hover:shadow-md'
                          }`}
                        whileHover={{ y: -5 }}
                      >
                        {plan.popular && (
                          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-[#007bff] text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-lg">
                            Recomendado
                          </div>
                        )}

                        <div className="mb-4">
                          <h3 className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{plan.name}</h3>
                          <div className="flex items-baseline gap-1 mt-1">
                            <span className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>${plan.price}</span>
                            <span className="text-sm text-gray-500">/{plan.period}</span>
                          </div>
                        </div>

                        <ul className="space-y-3 mb-8 flex-1">
                          {plan.features.map((feature, i) => (
                            <li key={i} className="flex items-start gap-2 text-xs text-gray-500">
                              <Check className={`w-3.5 h-3.5 mt-0.5 flex-shrink-0 ${plan.current
                                ? 'text-gray-400'
                                : theme === 'dark' ? 'text-[#00ff9d]' : 'text-[#00bb72]'
                                }`} />
                              <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>{feature}</span>
                            </li>
                          ))}
                        </ul>

                        <button
                          onClick={() => handleUpgrade(plan)}
                          className={`w-full py-2.5 rounded-lg text-sm font-bold transition-all ${plan.current
                            ? 'bg-gray-200 dark:bg-gray-800 text-gray-500 cursor-not-allowed'
                            : theme === 'dark'
                              ? 'bg-white text-black hover:bg-gray-200'
                              : 'bg-black text-white hover:bg-gray-800'
                            }`}
                        >
                          {plan.current ? 'Plan Actual' : 'Actualizar'}
                        </button>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div className={`h-px w-full ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-200'}`} />

                {/* === MÓDULOS A LA CARTA === */}
                <div>
                  <div className="mb-6">
                    <h2 className={`text-2xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Mercado de Módulos</h2>
                    <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>¿No necesitas todo? Compra acceso individual por departamento.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {alacarteModules.map((mod) => (
                      <motion.div
                        key={mod.id}
                        className={`p-5 rounded-2xl border transition-all duration-300 flex flex-col group ${theme === 'dark' ? 'bg-[#0b0c10] border-gray-800 hover:border-gray-700' : 'bg-white border-gray-100 hover:border-gray-300 shadow-sm'}`}
                        whileHover={{ y: -3 }}
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div className={`p-2.5 rounded-xl ${theme === 'dark' ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>
                            <mod.icon className="w-5 h-5" />
                          </div>
                          <div className="text-right">
                            <span className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>${mod.price}</span>
                            <span className="text-xs text-gray-500">/mes</span>
                          </div>
                        </div>
                        
                        <h3 className={`font-bold mb-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{mod.name}</h3>
                        <p className={`text-xs mb-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>{mod.desc}</p>
                        
                        <ul className="space-y-2 mb-6 flex-1">
                          {mod.features.map((feature, i) => (
                            <li key={i} className="flex items-center gap-2 text-xs text-gray-500">
                              <div className="w-1.5 h-1.5 rounded-full bg-[#00ff9d]" />
                              {feature}
                            </li>
                          ))}
                        </ul>

                        <button
                          onClick={() => handleUpgrade({ name: mod.name, paddlePriceId: mod.id })}
                          className={`w-full py-2 rounded-lg text-sm font-semibold transition-all border ${theme === 'dark'
                              ? 'border-gray-700 text-gray-300 hover:bg-white/5'
                              : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                            }`}
                        >
                          Comprar Módulo
                        </button>
                      </motion.div>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {activeTab === 'privacy' && (
              <div className="space-y-8 min-h-[600px] pb-10">
                <div>
                  <h2 className={`text-2xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Privacidad y Seguridad</h2>
                  <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Gestiona la seguridad de tu cuenta y tus datos personales.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Left Column: Security Settings */}
                  <div className="lg:col-span-2 space-y-8">

                    {/* Security Card */}
                    <div className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-[#0b0c10]/50 border-gray-800' : 'bg-white border-gray-200 shadow-sm'}`}>
                      <h3 className={`text-lg font-bold mb-6 flex items-center gap-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        <Lock className="w-5 h-5 text-[#007bff]" /> Seguridad de la Cuenta
                      </h3>

                      <div className="space-y-6">
                        <div className="flex items-center justify-between pb-6 border-b border-gray-800/50 dark:border-gray-800">
                          <div>
                            <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Contraseña</p>
                            <p className="text-sm text-gray-500">Último cambio hace 3 meses</p>
                          </div>
                          <button
                            onClick={handleChangePassword}
                            className={`px-4 py-2 text-sm font-medium rounded-lg border transition-colors ${theme === 'dark'
                              ? 'border-gray-700 text-gray-300 hover:bg-white/5'
                              : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                              }`}>
                            Cambiar
                          </button>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Autenticación en 2 Pasos (2FA)</p>
                              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#00ff9d]/10 text-[#00bb72] border border-[#00ff9d]/20">
                                RECOMENDADO
                              </span>
                            </div>
                            <p className="text-sm text-gray-500">Añade una capa extra de seguridad a tu cuenta</p>
                          </div>
                          <button
                            onClick={() => handleToggleSecurity('twoFactor')}
                            className={`w-12 h-6 rounded-full relative transition-colors duration-300 ${securitySettings.twoFactor
                              ? 'bg-[#00ff9d]'
                              : theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
                              }`}
                          >
                            <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all duration-300 ${securitySettings.twoFactor ? 'left-7' : 'left-1'
                              }`} />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Active Sessions */}
                    <div className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-[#0b0c10]/50 border-gray-800' : 'bg-white border-gray-200 shadow-sm'}`}>
                      <h3 className={`text-lg font-bold mb-6 flex items-center gap-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        <Globe className="w-5 h-5 text-[#00ff9d]" /> Sesiones Activas
                      </h3>

                      <div className="space-y-4">
                        {sessions.map((session) => (
                          <div key={session.id} className={`flex items-center justify-between p-4 rounded-xl border ${theme === 'dark' ? 'border-gray-800 bg-black/20' : 'border-gray-100 bg-gray-50'
                            }`}>
                            <div className="flex items-center gap-4">
                              <div className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-gray-800 text-gray-400' : 'bg-white text-gray-500 shadow-sm'}`}>
                                {session.icon && <session.icon className="w-5 h-5" />}
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <p className={`font-medium text-sm ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{session.device}</p>
                                  {session.active && (
                                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#00ff9d]/10 text-[#00bb72] border border-[#00ff9d]/20">
                                      ACTUAL
                                    </span>
                                  )}
                                </div>
                                <div className="flex items-center gap-4 text-xs text-gray-500 mt-0.5">
                                  <span className="flex items-center gap-1">
                                    <MapPin className="w-3 h-3" /> {session.location}
                                  </span>
                                  <span>•</span>
                                  <span>{session.active ? 'Activo ahora' : session.time}</span>
                                </div>
                              </div>
                            </div>
                            {!session.active && (
                              <button
                                onClick={() => handleCloseSession(session.id)}
                                className="text-xs text-red-500 hover:text-red-400 font-medium hover:underline"
                              >
                                Cerrar
                              </button>
                            )}
                          </div>
                        ))}
                        {sessions.length === 0 && (
                          <p className="text-center text-gray-500 py-4">No hay otras sesiones activas.</p>
                        )}
                      </div>
                    </div>

                  </div>

                  {/* Right Column: Danger & Info */}
                  <div className="space-y-8">

                    {/* Privacy Info */}
                    <div className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-[#0b0c10]/50 border-gray-800' : 'bg-white border-gray-200 shadow-sm'}`}>
                      <h3 className={`text-lg font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Datos y Privacidad</h3>
                      <p className="text-sm text-gray-500 mb-6 leading-relaxed">
                        Tu privacidad es lo primero. Controla cómo usamos tus datos para mejorar tu experiencia.
                      </p>

                      <div className="space-y-3">
                        <label className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${theme === 'dark' ? 'hover:bg-white/5' : 'hover:bg-gray-50'}`}>
                          <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Mejorar la IA con uso</span>
                          <input
                            type="checkbox"
                            checked={securitySettings.improveAI}
                            onChange={() => handleToggleSecurity('improveAI')}
                            className="accent-[#00ff9d] w-4 h-4 rounded border-gray-600"
                          />
                        </label>
                        <label className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${theme === 'dark' ? 'hover:bg-white/5' : 'hover:bg-gray-50'}`}>
                          <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Perfil público visible</span>
                          <input
                            type="checkbox"
                            checked={securitySettings.publicProfile}
                            onChange={() => handleToggleSecurity('publicProfile')}
                            className="accent-[#00ff9d] w-4 h-4 rounded border-gray-600"
                          />
                        </label>
                      </div>
                    </div>

                    {/* Danger Zone */}
                    <div className={`p-6 rounded-2xl border ${theme === 'dark' ? 'border-red-500/20 bg-red-500/5' : 'border-red-200 bg-red-50'}`}>
                      <h3 className={`font-bold mb-4 flex items-center gap-2 ${theme === 'dark' ? 'text-red-400' : 'text-red-600'}`}>
                        <Shield className="w-5 h-5" /> Zona de Peligro
                      </h3>

                      <div className="space-y-3">
                        <button
                          onClick={handleDownloadData}
                          className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all ${theme === 'dark'
                            ? 'bg-[#0b0c10] text-gray-300 hover:text-white border border-gray-800 hover:border-gray-600'
                            : 'bg-white text-gray-700 hover:text-gray-900 border border-red-100 hover:border-red-200'
                            }`}>
                          <Download className="w-4 h-4" />
                          Descargar mis datos
                        </button>

                        <button
                          onClick={handleDeleteAccount}
                          className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all ${theme === 'dark'
                            ? 'bg-red-900/10 text-red-400 hover:bg-red-900/20 border border-red-900/30'
                            : 'bg-white text-red-600 hover:bg-red-50 border border-red-200'
                            }`}>
                          <Trash2 className="w-4 h-4" />
                          Eliminar cuenta
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className={`flex justify-center pt-8 border-t ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'}`}>
                  <button
                    onClick={handleLogout}
                    className={`flex items-center gap-2 px-8 py-3 rounded-full transition-all font-bold shadow-lg ${theme === 'dark'
                      ? 'bg-gradient-to-r from-gray-800 to-gray-700 text-white hover:from-gray-700 hover:to-gray-600'
                      : 'bg-black text-white hover:bg-gray-800'
                      }`}
                  >
                    <LogOut className="w-4 h-4" />
                    Cerrar Sesión Globalmente
                  </button>
                </div>
              </div>
            )}

          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ConfigurationModule;
