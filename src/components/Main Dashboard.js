import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { CountryProvider, CountrySelector, useCountry } from './CountrySelector';
import CountryDashboard from './CountryDashboard';
import {
  Home,
  TrendingUp,
  Zap,
  Bell,
  Settings,
  User,
  LogOut,
  Search,
  Globe,
  BarChart3,
  MessageSquare,
  ArrowRight,
  Target,
  Rocket,
  Eye,
  Heart,
  Share2,
  MapPin,
  Clock,
  Sparkles,
  Brain,
  Menu,
  X,
  Send,
  Music,
  Calendar,
  Palette,
  BarChart3 as ABTestIcon,
  Wand2,
  Mic,
  Lock // Importar Lock icon
} from 'lucide-react';
import { Line, Doughnut, Bar } from 'react-chartjs-2';
import RadarGlobal from './RadarGlobal';
import RadarCompacto from './RadarCompacto';

// New Dashboard Components
import QuickActionsWidget from './dashboard/QuickActionsWidget';
import ActivityFeed from './dashboard/ActivityFeed';
import TimeRangeSelector from './dashboard/TimeRangeSelector';
import MetricCard from './dashboard/MetricCard';
import ExportModal from './radar/ExportModal';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement
} from 'chart.js';
import useStore from '../store/useStore';
import { useNotifications } from '../hooks/useNotifications';
import ExploreTrendsModuleSimple from './ExploreTrendsModuleSimple';
import PredictiveActionsModule from './PredictiveActionsModule';
import AlertsModule from './AlertsModule';
import ConfigurationModule from './ConfigurationModule';
import CopyGeneratorModule from './CopyGeneratorModule';
import MusicTrendsModule from './MusicTrendsModule';
import ViralMusicTracker from './ViralMusicTracker';  // New 13-tab tracker
import ViralPredictorModule from './ViralPredictorModule';
import NicheSelectorModule from './NicheSelectorModule';
import ContentSchedulerModule from './ContentSchedulerModule';
import CreateReminderPage from './CreateReminderPage';
import EnhancedAIAssistant from './EnhancedAIAssistant';
import VisualContentGenerator from './VisualContentGenerator';
import ABTestingSuite from './ABTestingSuite';
import ContentCreatorStudio from './ContentCreatorStudio';
import UnifiedChat from './UnifiedChat';
import IntelligentRadar from './IntelligentRadar';
import ChatIAPage from './ChatIAPage';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement
);

const MainDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, trendingNow, isPlatformAllowed, theme } = useStore();
  const { updateCountry } = useCountry();
  const { showToast } = useNotifications();

  const [activeSection, setActiveSection] = useState('inicio');
  const [dashboardKey, setDashboardKey] = useState(0);

  // Estados para Dashboard 10/10
  const [timeRange, setTimeRange] = useState('7d');
  const [showDashboardExportModal, setShowDashboardExportModal] = useState(false);
  const [dashboardActivities, setDashboardActivities] = useState([]);
  const [scheduledReminders, setScheduledReminders] = useState([
    // Recordatorio de prueba TikTok
    {
      id: 999999,
      title: "🎯 Video TikTok - Rutina Matutina",
      content: "Recordatorio: Video de rutina matutina con música trending",
      description: "Video de rutina matutina con música trending #fitness #morning #workout",
      platform: "tiktok",
      platforms: ["tiktok"],
      niche: "fitness",
      scheduledDate: new Date(2024, 10, 10, 7, 0), // 10 Nov 2024, 7:00 AM
      status: "pending",
      priority: "high",
      reminder: "15 minutos antes",
      notes: "Usar hashtags trending del día, grabar con buena luz natural",
      country: "Ecuador",
      createdAt: new Date(),
      type: "user-created"
    },
    // Recordatorio de prueba Instagram
    {
      id: 999998,
      title: "📸 Story Instagram - Desayuno Saludable",
      content: "Recordatorio: Story mostrando desayuno saludable",
      description: "Story con receta de smoothie verde #healthy #breakfast #smoothie",
      platform: "instagram",
      platforms: ["instagram"],
      niche: "food",
      scheduledDate: new Date(2024, 10, 12, 8, 30), // 12 Nov 2024, 8:30 AM
      status: "pending",
      priority: "medium",
      reminder: "30 minutos antes",
      notes: "Usar luz natural, mostrar ingredientes paso a paso",
      country: "Ecuador",
      createdAt: new Date(),
      type: "user-created"
    },
    // Recordatorio de prueba YouTube
    {
      id: 999997,
      title: "📺 Video YouTube - Tutorial Completo",
      content: "Recordatorio: Subir tutorial de 10 minutos",
      description: "Tutorial completo de entrenamiento en casa #workout #tutorial #fitness",
      platform: "youtube",
      platforms: ["youtube"],
      niche: "fitness",
      scheduledDate: new Date(2024, 10, 14, 19, 0), // 14 Nov 2024, 7:00 PM
      status: "pending",
      priority: "low",
      reminder: "1 hora antes",
      notes: "Revisar audio, agregar subtítulos, thumbnail atractivo",
      country: "Ecuador",
      createdAt: new Date(),
      type: "user-created"
    },
    // Recordatorio de prueba Facebook
    {
      id: 999996,
      title: "👥 Post Facebook - Motivación Semanal",
      content: "Recordatorio: Post motivacional para la comunidad",
      description: "Post con frase motivacional y imagen inspiradora #motivation #community",
      platform: "facebook",
      platforms: ["facebook"],
      niche: "lifestyle",
      scheduledDate: new Date(2024, 10, 16, 10, 0), // 16 Nov 2024, 10:00 AM
      status: "pending",
      priority: "medium",
      reminder: "45 minutos antes",
      notes: "Usar imagen de alta calidad, incluir call-to-action",
      country: "Ecuador",
      createdAt: new Date(),
      type: "user-created"
    },
    // Recordatorio de prueba LinkedIn
    {
      id: 999995,
      title: "💼 Artículo LinkedIn - Tendencias Tech",
      content: "Recordatorio: Publicar artículo sobre IA y futuro del trabajo",
      description: "Artículo profesional sobre inteligencia artificial #AI #tech #future",
      platform: "linkedin",
      platforms: ["linkedin"],
      niche: "tech",
      scheduledDate: new Date(2024, 10, 18, 14, 30), // 18 Nov 2024, 2:30 PM
      status: "pending",
      priority: "high",
      reminder: "2 horas antes",
      notes: "Incluir estadísticas actuales, mencionar fuentes confiables",
      country: "Ecuador",
      createdAt: new Date(),
      type: "user-created"
    }
  ]);

  // Función para agregar un nuevo recordatorio
  const handleAddReminder = (reminder) => {
    const newReminder = {
      ...reminder,
      id: Date.now(), // Asegurar ID único
      createdAt: new Date()
    };
    setScheduledReminders(prev => [...prev, newReminder]);
    setActiveSection('content-scheduler');

    // Mostrar notificación de éxito
    showToast('¡Recordatorio creado exitosamente!', 'success');
  };

  // Detectar sección activa basada en la URL
  useEffect(() => {
    const path = location.pathname;

    let newSection = 'inicio'; // default
    if (path === '/dashboard') newSection = 'inicio';
    else if (path === '/explore') newSection = 'inicio'; // Cambiado para mostrar dashboard principal
    else if (path === '/actions') newSection = 'acciones';
    else if (path === '/alerts') newSection = 'alertas';
    else if (path === '/settings') newSection = 'configuracion';

    // Solo actualizar si es diferente
    if (newSection !== activeSection) {
      setActiveSection(newSection);
    }
  }, [location.pathname]);

  // -- ONBOARDING TOUR STATE --
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    const hasSeenTour = localStorage.getItem('predix_tour_completed');
    if (!hasSeenTour) {
      setTimeout(() => setShowOnboarding(true), 1500);
    }
  }, []);

  const completeOnboarding = () => {
    setShowOnboarding(false);
    localStorage.setItem('predix_tour_completed', 'true');
    showToast('¡Todo listo! Explora el dashboard libremente.', 'success');
  };
  // ---------------------------
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [selectedTrendForChat, setSelectedTrendForChat] = useState(null);
  const [initialHashtagMix, setInitialHashtagMix] = useState('');
  const [musicMenuExpanded, setMusicMenuExpanded] = useState(false);
  const [activeMusicTab, setActiveMusicTab] = useState('browse');

  // Funciones para manejar la interacción sidebar/chat
  const toggleSidebar = () => {
    if (chatOpen) {
      setChatOpen(false);
      setTimeout(() => setSidebarOpen(!sidebarOpen), 300);
    } else {
      setSidebarOpen(!sidebarOpen);
    }
  };

  const toggleChat = () => {
    if (sidebarOpen) {
      setSidebarOpen(false);
      setTimeout(() => setChatOpen(!chatOpen), 300);
    } else {
      setChatOpen(!chatOpen);
    }
  };

  // Función para abrir chat con contexto de tendencia
  const handleTrendClick = (trend) => {
    setSelectedTrendForChat(trend);
    if (sidebarOpen) {
      setSidebarOpen(false);
      setTimeout(() => setChatOpen(true), 300);
    } else {
      setChatOpen(true);
    }

    // Añadir mensaje contextual automático
    const contextMessage = {
      id: Date.now(),
      type: 'ai',
      message: `🎯 ¡Predix detectó una nueva tendencia! "${trend.name}" en la categoría ${trend.category} está creciendo ${trend.growth} con un score de ${trend.score}. ¿Te gustaría que genere copy optimizado para esta tendencia?`,
      time: 'Ahora',
      priority: 'high'
    };

    setAiMessages(prev => [...prev, contextMessage]);
  };

  const sendMessage = () => {
    if (!chatMessage.trim()) return;

    const newMessage = {
      id: Date.now(),
      type: 'user',
      message: chatMessage,
      time: 'Ahora',
      priority: 'user'
    };

    setAiMessages(prev => [...prev, newMessage]);
    setChatMessage('');

    // Simular respuesta de IA contextual
    setTimeout(() => {
      let aiResponse;

      if (selectedTrendForChat && chatMessage.toLowerCase().includes('copy')) {
        aiResponse = {
          id: Date.now() + 1,
          type: 'ai',
          message: `✨ Perfecto! Aquí tienes copy optimizado para "${selectedTrendForChat.name}":\n\n🚀 "Descubre el futuro de ${selectedTrendForChat.category} con ${selectedTrendForChat.name}"\n📈 Crecimiento explosivo: ${selectedTrendForChat.growth}\n🎯 Score de tendencia: ${selectedTrendForChat.score}/100\n\n¿Te gustaría que genere más variaciones o ajuste el tono?`,
          time: 'Ahora',
          priority: 'high'
        };
      } else if (chatMessage.toLowerCase().includes('tendencia')) {
        aiResponse = {
          id: Date.now() + 1,
          type: 'ai',
          message: `📊 Basándome en el análisis del Radar Global, las tendencias más prometedoras ahora son:\n\n🔥 AI Fashion (+127%)\n🎮 Sustainable Gaming (+89%)\n📱 Micro-Influencers (+156%)\n\n¿Quieres que profundice en alguna específica?`,
          time: 'Ahora',
          priority: 'medium'
        };
      } else {
        aiResponse = {
          id: Date.now() + 1,
          type: 'ai',
          message: `🤖 Entiendo tu consulta: "${chatMessage}". Como IA de Predix, puedo ayudarte con:\n\n• Análisis de tendencias en tiempo real\n• Generación de copy optimizado\n• Predicciones de crecimiento\n• Estrategias de contenido\n\n¿En qué te gustaría que me enfoque?`,
          time: 'Ahora',
          priority: 'medium'
        };
      }

      setAiMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  const [aiMessages, setAiMessages] = useState([
    {
      id: 1,
      type: 'prediction',
      message: '🚀 Detecté una nueva microtendencia: #SustainableTech está creciendo +89% en las últimas 6 horas.',
      time: '2 min',
      priority: 'high'
    },
    {
      id: 2,
      type: 'suggestion',
      message: '💡 Sugerencia: Crea contenido sobre "IA Verde" para aprovechar la tendencia #EcoTech.',
      time: '15 min',
      priority: 'medium'
    },
    {
      id: 3,
      type: 'alert',
      message: '⚡ Tu predicción sobre #VirtualFashion se cumplió. ¡Ganaste 95 puntos de precisión!',
      time: '1 hora',
      priority: 'low'
    }
  ]);

  // Datos simulados para gráficos
  const trendData = {
    labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Tendencias Crecientes',
        data: [65, 78, 90, 81, 95, 105],
        borderColor: '#007bff',
        backgroundColor: 'rgba(0, 123, 255, 0.1)',
        tension: 0.4,
        fill: true
      },
      {
        label: 'Predicciones IA',
        data: [45, 52, 68, 74, 82, 89],
        borderColor: '#00ff9d',
        backgroundColor: 'rgba(0, 255, 157, 0.1)',
        tension: 0.4,
        fill: true
      }
    ]
  };

  const platformData = {
    labels: ['TikTok', 'Instagram', 'Twitter', 'YouTube', 'LinkedIn'],
    datasets: [{
      data: [35, 25, 20, 15, 5],
      backgroundColor: [
        '#007bff',
        '#00ff9d',
        '#8b5cf6',
        '#f59e0b',
        '#ef4444'
      ],
      borderWidth: 0
    }]
  };

  const countryData = {
    labels: ['México', 'USA', 'España', 'Argentina', 'Colombia'],
    datasets: [{
      label: 'Tendencias por País',
      data: [42, 38, 25, 18, 15],
      backgroundColor: 'rgba(0, 123, 255, 0.6)',
      borderColor: '#007bff',
      borderWidth: 1
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#ffffff',
          font: { family: 'Inter', size: 12 }
        }
      }
    },
    scales: {
      x: {
        ticks: { color: '#9ca3af', font: { family: 'Inter' } },
        grid: { color: 'rgba(156, 163, 175, 0.1)' }
      },
      y: {
        ticks: { color: '#9ca3af', font: { family: 'Inter' } },
        grid: { color: 'rgba(156, 163, 175, 0.1)' }
      }
    }
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#ffffff',
          font: { family: 'Inter', size: 11 },
          padding: 15
        }
      }
    }
  };

  // Secciones del sidebar
  const sidebarSections = [
    { id: 'inicio', label: 'Inicio', icon: Home },
    { id: 'chat', label: 'Chat IA', icon: Brain },
    { id: 'radar', label: 'Radar Inteligente', icon: Target },
    { id: 'music-trends', label: 'Música Viral', icon: Music, hasSubmenu: true },
    { id: 'content-scheduler', label: 'Calendario', icon: Calendar },
    { id: 'configuracion', label: 'Configuración', icon: Settings }
  ];

  // Submenu items for Música Viral
  const musicSubmenuItems = [
    { id: 'browse', label: 'Explorar', icon: '🎵' },
    { id: 'platforms', label: 'Plataformas', icon: '🌐' },
    { id: 'filters', label: 'Filtros', icon: '🔍' },
    { id: 'analysis', label: 'Análisis', icon: '💡' },
    { id: 'predictions', label: 'Predicciones', icon: '🔮' },
    { id: 'creation', label: 'Creación', icon: '🎬' },
    { id: 'demographics', label: 'Demografía', icon: '🌍' },
    { id: 'history', label: 'Histórico', icon: '📊' },
    { id: 'alerts', label: 'Alertas', icon: '🔔' },
    { id: 'social', label: 'Social', icon: '⭐' },
    { id: 'playlists', label: 'Listas', icon: '💾' },
    { id: 'calendar', label: 'Calendario', icon: '📅' },
    { id: 'licensing', label: 'Licencias', icon: '⚖️' },
  ];

  // Tarjetas resumen
  const summaryCards = [
    {
      title: 'Tendencias que están creciendo',
      value: '247',
      change: '+12%',
      icon: TrendingUp,
      color: 'from-[#007bff] to-[#0056b3]',
      description: 'Nuevas tendencias detectadas hoy'
    },
    {
      title: 'Predicciones de IA',
      value: '89',
      change: '+5%',
      icon: Brain,
      color: 'from-[#00ff9d] to-[#00cc7a]',
      description: 'Predicciones activas en seguimiento'
    },
    {
      title: 'Sugerencias del día',
      value: '15',
      change: '+8%',
      icon: Sparkles,
      color: 'from-[#8b5cf6] to-[#7c3aed]',
      description: 'Recomendaciones personalizadas'
    }
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
    showToast('Sesión cerrada correctamente', 'success');
  };

  return (
    <div className={`flex h-screen overflow-hidden transition-colors duration-300 ${theme === 'dark' ? 'bg-[#0b0c10]' : 'bg-gray-50'}`}>
      {/* Sidebar */}
      <motion.div
        className={`backdrop-blur-md border-r transition-all duration-300 ${theme === 'dark' ? 'bg-gray-900/95 border-gray-800' : 'bg-white/95 border-gray-200 shadow-sm'
          } ${sidebarOpen ? 'w-56' : 'w-14'} flex flex-col h-screen`}
        initial={{ x: -100 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Logo */}
        <div className={`px-5 py-3 border-b ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'}`}>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-gradient-to-r from-[#007bff] to-[#00ff9d] rounded-lg flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            {sidebarOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`text-lg font-bold ${theme === 'dark' ? 'gradient-text' : 'text-gray-900'}`}
              >
                Predix
              </motion.div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-5 py-3 overflow-y-auto">
          <div className="space-y-1">
            {sidebarSections.map((section) => (
              <div key={section.id}>
                {/* Main Section Button */}
                <motion.button
                  onClick={() => {
                    if (section.id === 'inicio') {
                      navigate('/dashboard');
                      setActiveSection('inicio');
                      setMusicMenuExpanded(false);
                    } else if (section.id === 'chat') {
                      setActiveSection('chat');
                      setMusicMenuExpanded(false);
                    } else if (section.id === 'radar') {
                      setActiveSection('radar');
                      setMusicMenuExpanded(false);
                    } else if (section.id === 'music-trends') {
                      setMusicMenuExpanded(!musicMenuExpanded);
                      setActiveSection('music-trends');
                    } else if (section.id === 'content-scheduler') {
                      setActiveSection('content-scheduler');
                      setMusicMenuExpanded(false);
                    } else if (section.id === 'configuracion') {
                      navigate('/settings');
                      setActiveSection('configuracion');
                      setMusicMenuExpanded(false);
                    }
                  }}
                  className={`w-full flex items-center justify-between gap-2 px-0 py-2 rounded-lg transition-all duration-200 ${activeSection === section.id
                    ? 'bg-gradient-to-r from-[#007bff]/20 to-[#00ff9d]/20 text-[#00bb72] border border-[#00ff9d]/30 font-medium'
                    : theme === 'dark'
                      ? 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                      : 'text-gray-600 hover:text-black hover:bg-gray-100'
                    }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center gap-2">
                    <section.icon className="w-4 h-4 flex-shrink-0" />
                    {sidebarOpen && (
                      <span className="font-medium">
                        {section.label}
                        {activeSection === section.id && !section.hasSubmenu && <span className="ml-1 text-[#00bb72]">●</span>}
                      </span>
                    )}
                  </div>
                  {/* Submenu Arrow */}
                  {sidebarOpen && section.hasSubmenu && (
                    <span className={`text-xs transition-transform ${musicMenuExpanded ? 'rotate-90' : ''}`}>
                      ▸
                    </span>
                  )}
                </motion.button>

                {/* Música Viral Submenu */}
                {section.id === 'music-trends' && musicMenuExpanded && sidebarOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="ml-2 mt-1 space-y-0.5 border-l-2 border-gray-700 pl-2"
                  >
                    {musicSubmenuItems.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => {
                          setActiveMusicTab(item.id);
                          setActiveSection('music-trends');
                        }}
                        className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-left text-xs transition-all ${activeMusicTab === item.id
                          ? 'bg-[#007bff]/20 text-[#00ff9d] font-semibold'
                          : 'text-gray-500 hover:text-white hover:bg-gray-800/30'
                          }`}
                      >
                        <span className="text-sm">{item.icon}</span>
                        <span>{item.label}</span>
                        {activeMusicTab === item.id && <span className="ml-auto text-[#00ff9d]">●</span>}
                      </button>
                    ))}
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        </nav>

        {/* User Profile */}
        <div className={`px-5 py-3 border-t ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'}`}>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 bg-gradient-to-r from-[#8b5cf6] to-[#ec4899] rounded-full flex items-center justify-center">
              <User className="w-3 h-3 text-white" />
            </div>
            {sidebarOpen && (
              <div className="flex-1 min-w-0">
                <p className={`font-medium truncate text-sm ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>{user?.name || 'Usuario'}</p>
                <p className="text-gray-500 text-xs truncate">{user?.email || 'usuario@predix.app'}</p>
              </div>
            )}
          </div>

          {sidebarOpen && (
            <motion.button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-2 py-1 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all text-sm"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <LogOut className="w-4 h-4" />
              <span className="text-sm">Cerrar Sesión</span>
            </motion.button>
          )}
        </div>

      </motion.div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        {/* Header */}
        <motion.header
          className={`backdrop-blur-md border-b px-8 py-3 transition-all duration-300 ${theme === 'dark' ? 'bg-gray-900/50 border-gray-800' : 'bg-white/80 border-gray-200'
            }`}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{
            width: sidebarOpen ? 'calc(100vw - 224px)' : 'calc(100vw - 56px)'
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <motion.button
                onClick={toggleSidebar}
                className={`p-2 rounded-lg transition-colors ${theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
                  }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {sidebarOpen
                  ? <X className={`w-4 h-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`} />
                  : <Menu className={`w-4 h-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`} />
                }
              </motion.button>
              <div>
                <h1 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {activeSection === 'inicio' && 'Dashboard Principal'}
                  {activeSection === 'chat' && 'Chat IA - Asistente con Predictor Viral Integrado'}
                  {activeSection === 'radar' && 'Radar Inteligente'}
                  {activeSection === 'music-trends' && 'Música Viral Tracker'}
                  {activeSection === 'content-scheduler' && '📅 Calendario de Marketing - Recordatorios y Horarios Óptimos'}
                  {activeSection === 'create-reminder' && '📝 Crear Nuevo Recordatorio'}
                  {activeSection === 'configuracion' && 'Configuración'}
                </h1>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                  Bienvenido de vuelta, {user?.name || 'Usuario'} 👋
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Selector de País */}
              <CountrySelector onCountryChange={(code, data) => {
                console.log('País seleccionado:', code, data);
                updateCountry(code, data);
                // Forzar re-render del dashboard
                setDashboardKey(prev => prev + 1);
              }} />

              <div className="relative">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Buscar tendencias..."
                  className={`pl-8 pr-3 py-2 border rounded-lg placeholder-gray-400 focus:outline-none focus:border-[#007bff] transition-colors w-52 text-sm ${theme === 'dark'
                    ? 'bg-gray-800/50 border-gray-700 text-white'
                    : 'bg-white border-gray-200 text-gray-900'
                    }`}
                />
              </div>

              <motion.button
                className={`p-1.5 border rounded-lg transition-all ${theme === 'dark'
                  ? 'bg-[#0b0c10] border-gray-700 text-gray-400 hover:text-white hover:border-gray-600'
                  : 'bg-white border-gray-200 text-gray-500 hover:text-black hover:border-gray-300'
                  }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Bell className="w-4 h-4" />
              </motion.button>
            </div>
          </div>
        </motion.header>

        {/* Content Area */}
        <div className="flex-1 flex overflow-hidden transition-all duration-300" style={{
          width: sidebarOpen ? 'calc(100vw - 224px)' : 'calc(100vw - 56px)'
        }}>
          {/* Main Dashboard Content */}
          <div className="flex-1 w-full max-w-none px-8 py-6 overflow-y-auto custom-scrollbar transition-all duration-300" style={{
            width: sidebarOpen ? 'calc(100vw - 224px - 2rem)' : 'calc(100vw - 56px - 2rem)'
          }}>
            <AnimatePresence mode="wait">
              {activeSection === 'inicio' && (
                <motion.div
                  key="inicio"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  {/* Dashboard Localizado por País */}
                  <CountryDashboard key={`dashboard-${dashboardKey}`} />

                  {/* Summary Cards Originales (comentadas para mostrar el nuevo dashboard) */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4" style={{ display: 'none' }}>
                    {summaryCards.map((card, index) => (
                      <motion.div
                        key={index}
                        className="card-hover"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: index * 0.1 }}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className={`p-2 rounded-lg bg-gradient-to-r ${card.color}`}>
                            <card.icon className="w-5 h-5 text-white" />
                          </div>
                          <span className="text-[#00ff9d] text-xs font-semibold">
                            {card.change}
                          </span>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-1">{card.value}</h3>
                        <p className="text-gray-400 text-xs mb-1">{card.title}</p>
                        <p className="text-gray-500 text-xs">{card.description}</p>
                      </motion.div>
                    ))}
                  </div>

                  {/* Charts Section */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {/* Trend Evolution Chart */}
                    <motion.div
                      className="card"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: 0.4 }}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-base font-bold text-white">Curva de Tendencias</h3>
                        <div className="flex gap-2">
                          <button className="text-xs px-3 py-1 bg-[#007bff]/20 text-[#007bff] rounded-full">24h</button>
                          <button className="text-xs px-3 py-1 text-gray-400 hover:text-white">7d</button>
                          <button className="text-xs px-3 py-1 text-gray-400 hover:text-white">30d</button>
                        </div>
                      </div>
                      <div style={{ height: '240px' }}>
                        <Line data={trendData} options={chartOptions} />
                      </div>
                    </motion.div>

                    {/* Platform Distribution */}
                    <motion.div
                      className="card"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: 0.5 }}
                    >
                      <h3 className="text-base font-bold text-white mb-4">Distribución por Plataforma</h3>
                      <div style={{ height: '240px' }}>
                        <Doughnut data={platformData} options={doughnutOptions} />
                      </div>
                    </motion.div>
                  </div>

                  {/* Radar Global Compacto */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                  >
                    <RadarCompacto onTrendSelect={handleTrendClick} />
                  </motion.div>

                  {/* Trending Now */}
                  <motion.div
                    className="card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.7 }}
                  >
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-bold text-white">Tendencias Ahora</h3>
                      <motion.button
                        onClick={() => navigate('/explore')}
                        className="text-[#007bff] hover:text-[#0056b3] transition-colors flex items-center gap-1"
                        whileHover={{ scale: 1.05 }}
                      >
                        Ver todas <ArrowRight className="w-4 h-4" />
                      </motion.button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {trendingNow
                        .slice(0, 6)
                        .map((trend, index) => {
                          const isAllowed = isPlatformAllowed(trend.platform);

                          return (
                            <motion.div
                              key={trend.id}
                              className={`p-4 rounded-xl transition-all border border-gray-700 relative overflow-hidden ${isAllowed
                                ? 'bg-[#1f1f1f] hover:bg-[#2a2a2a] cursor-pointer hover:border-gray-600'
                                : 'bg-[#1f1f1f]/50 cursor-not-allowed group'
                                }`}
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ duration: 0.4, delay: 0.8 + index * 0.1 }}
                              whileHover={isAllowed ? { scale: 1.02 } : {}}
                              onClick={() => {
                                if (isAllowed) {
                                  navigate('/explore');
                                } else {
                                  navigate('/pricing');
                                }
                              }}
                            >
                              {/* LOCKED OVERLAY */}
                              {!isAllowed && (
                                <div className="absolute inset-0 backdrop-blur-sm z-10 flex flex-col items-center justify-center p-4 text-center bg-black/40 group-hover:bg-black/50 transition-colors">
                                  <div className="p-3 bg-gray-900/90 rounded-full mb-2 shadow-lg border border-gray-700">
                                    <Lock className="w-5 h-5 text-[#00ff9d]" />
                                  </div>
                                  <h4 className="text-white font-bold text-sm mb-1">Tendencia Premium</h4>
                                  <p className="text-xs text-gray-300 mb-3">Actualiza tu plan para ver tendencias de {trend.platform}</p>
                                  <button className="bg-[#00ff9d] text-black text-xs font-bold px-3 py-1.5 rounded-full hover:bg-[#00cc7a] transition-colors">
                                    Desbloquear
                                  </button>
                                </div>
                              )}

                              <div className={!isAllowed ? 'opacity-30 blur-[2px]' : ''}>
                                <div className="flex items-start justify-between mb-3">
                                  <div className="flex items-center gap-2">
                                    <span className="text-lg">{trend.country}</span>
                                    <div className="text-xs px-2 py-1 bg-[#007bff]/20 text-[#007bff] rounded-full">
                                      {trend.platform}
                                    </div>
                                  </div>
                                  <div className="text-[#00ff9d] font-bold text-sm">{trend.growth}</div>
                                </div>

                                <h4 className="text-white font-semibold mb-2">{trend.name}</h4>
                                <p className="text-gray-400 text-sm mb-3 line-clamp-2">{trend.description}</p>

                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-1">
                                    <BarChart3 className="w-3 h-3 text-gray-500" />
                                    <span className="text-gray-500 text-xs">{trend.confidence}% confiable</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Eye className="w-4 h-4 text-gray-500" />
                                    <Heart className="w-4 h-4 text-gray-500" />
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          )
                        })}
                    </div>
                  </motion.div>
                </motion.div>
              )}

              {/* --- WELCOME TOUR MODAL --- */}
              <AnimatePresence>
                {showOnboarding && (
                  <motion.div
                    className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <motion.div
                      className="bg-gray-900 border border-gray-800 rounded-2xl max-w-lg w-full p-8 shadow-2xl relative overflow-hidden"
                      initial={{ scale: 0.9, y: 20 }}
                      animate={{ scale: 1, y: 0 }}
                      exit={{ scale: 0.9, y: 20 }}
                    >
                      {/* Background Glow */}
                      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 rounded-full blur-[80px] -mr-16 -mt-16 pointer-events-none"></div>

                      <div className="text-center mb-6 relative z-10">
                        <div className="mx-auto w-16 h-16 bg-gradient-to-tr from-[#00ff9d] to-[#007bff] rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-blue-500/20">
                          <Sparkles className="w-8 h-8 text-black" />
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2">¡Bienvenido a Predix! 🚀</h2>
                        <p className="text-gray-400">
                          Tu centro de comando para detectar tendencias virales antes que nadie.
                        </p>
                      </div>

                      <div className="space-y-4 mb-8 relative z-10">
                        <div className="flex items-start gap-4 p-3 rounded-xl bg-white/5 border border-white/5">
                          <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400">
                            <Target className="w-5 h-5" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-white text-sm">Radar Global</h3>
                            <p className="text-xs text-gray-400">Monitorea viralidad en tiempo real en TikTok, Instagram y más.</p>
                          </div>
                        </div>

                        <div className="flex items-start gap-4 p-3 rounded-xl bg-white/5 border border-white/5">
                          <div className="p-2 bg-purple-500/20 rounded-lg text-purple-400">
                            <Lock className="w-5 h-5" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-white text-sm">Contenido Premium</h3>
                            <p className="text-xs text-gray-400">Desbloquea análisis profundos de plataformas exclusivas mejorando tu plan.</p>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={completeOnboarding}
                        className="w-full py-3 bg-gradient-to-r from-[#007bff] to-[#00ff9d] text-white font-bold rounded-xl hover:shadow-lg hover:shadow-blue-500/25 transition-all text-sm relative z-10"
                      >
                        ¡Entendido, vamos! 🚀
                      </button>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Placeholder para otras secciones */}
              {activeSection === 'tendencias' && (
                <motion.div
                  key="tendencias"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="min-h-screen"
                >
                  <div className="bg-red-500 p-4 mb-4 text-white font-bold">
                    🔍 SECCIÓN TENDENCIAS ACTIVA
                  </div>
                  <ExploreTrendsModuleSimple />
                </motion.div>
              )}

              {activeSection === 'acciones' && (
                <motion.div
                  key="acciones"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="min-h-screen"
                >
                  <div className="bg-blue-500 p-4 mb-4 text-white font-bold">
                    ⚡ SECCIÓN ACCIONES ACTIVA
                  </div>
                  <PredictiveActionsModule />
                </motion.div>
              )}

              {activeSection === 'alertas' && (
                <motion.div
                  key="alertas"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {console.log('🔔 Rendering AlertsModule')}
                  <AlertsModule />
                </motion.div>
              )}

              {/* Los módulos Nichos y Copy Generator ahora están fusionados en el Chat IA */}

              {activeSection === 'music-trends' && (
                <motion.div
                  key="music-trends"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <ViralMusicTracker activeTab={activeMusicTab} />
                </motion.div>
              )}

              {activeSection === 'chat' && (
                <motion.div
                  key="chat"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="fixed inset-0 z-50 bg-gray-900"
                >
                  <ChatIAPage onClose={() => setActiveSection('inicio')} />
                </motion.div>
              )}

              {activeSection === 'radar' && (
                <motion.div
                  key="radar"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <IntelligentRadar
                    scheduledReminders={scheduledReminders}
                    onSendHashtagMix={(mix) => {
                      if (!mix) return;
                      setInitialHashtagMix(mix);
                      setActiveSection('create-reminder');
                    }}
                  />
                </motion.div>
              )}

              {/* Predictor Viral ahora está fusionado en el Chat IA */}

              {activeSection === 'content-scheduler' && (
                <motion.div
                  key="content-scheduler"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <ContentSchedulerModule
                    onNavigateToCreate={() => {
                      console.log('Navegando a create-reminder...');
                      setActiveSection('create-reminder');
                    }}
                    scheduledReminders={scheduledReminders}
                    onUpdateReminders={setScheduledReminders}
                  />
                </motion.div>
              )}

              {activeSection === 'create-reminder' && (
                <motion.div
                  key="create-reminder"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <CreateReminderPage
                    onBack={() => setActiveSection('content-scheduler')}
                    onSave={handleAddReminder}
                    initialHashtagMix={initialHashtagMix}
                  />
                </motion.div>
              )}

              {/* Los módulos Visual Generator y A/B Testing ahora están fusionados en el Chat IA */}

              {activeSection === 'configuracion' && (
                <motion.div
                  key="configuracion"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <ConfigurationModule />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Enhanced AI Assistant */}
          <EnhancedAIAssistant
            isOpen={chatOpen}
            onClose={() => setChatOpen(false)}
            context={selectedTrendForChat ? { type: 'trend', ...selectedTrendForChat } : null}
          />

          {/* Floating AI Assistant Button */}
          <AnimatePresence>
            {!chatOpen && (
              <motion.button
                onClick={toggleChat}
                className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-r from-[#8b5cf6] to-[#ec4899] rounded-full shadow-2xl flex items-center justify-center z-50 hover:shadow-[#8b5cf6]/25 border-2 border-white/10"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: 180 }}
                whileHover={{ scale: 1.1, boxShadow: "0 20px 40px rgba(139, 92, 246, 0.4)" }}
                whileTap={{ scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
                <div className="relative">
                  <Brain className="w-7 h-7 text-white" />
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#00ff9d] rounded-full animate-pulse"></div>
                </div>
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

// Componente envuelto con el provider
const MainDashboardWithCountry = () => {
  return (
    <CountryProvider>
      <MainDashboard />
    </CountryProvider>
  );
};

export default MainDashboardWithCountry;
