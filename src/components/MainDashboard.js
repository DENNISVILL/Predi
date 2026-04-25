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
  Menu,
  X,
  Send,
  Music,
  Calendar,
  Palette,
  BarChart3 as ABTestIcon,
  Wand2,
  Mic,
  Lock,
  Brain,
  Users,
  Megaphone,
  Mail,
  Terminal,
  Sparkles,
  ChevronDown,
  Building,
  Plus
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
  BarElement,
  Filler
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend, Filler);
import useStore from '../store/useStore';
import { useNotifications } from '../hooks/useNotifications';
import ExploreTrendsModule from './ExploreTrendsModule';
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
import HelpPanel from './help/HelpPanel';
import OnboardingWizard from './onboarding/OnboardingWizard';
import AIStrategistModule from './strategist/AIStrategistModule';
import ContentStudioModule from './studio/ContentStudioModule';
import AnalyticsAgencyModule from './analytics/AnalyticsAgencyModule';
import OmniSchedulerModule from './scheduler/OmniSchedulerModule';
import TrendRadarModule from './radar/TrendRadarModule';
import SEOStudioModule from './seo/SEOStudioModule';
import AdsManagerModule from './ads/AdsManagerModule';
import EmailFunnelModule from './email/EmailFunnelModule';
import PromptsLibraryModule from './knowledge/PromptsLibraryModule';
import LinkedInB2BModule from './linkedin/LinkedInB2BModule';
import DepartmentHub from './dashboard/DepartmentHub';

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
  const [expandedCategories, setExpandedCategories] = useState(['1. Dirección y Estrategia', '3. Contenido y Copywriting']);
  
  // Workspace State
  const [workspaces, setWorkspaces] = useState([
    { id: 'ws_1', name: 'Mi Agencia Interna', role: 'Owner' },
    { id: 'ws_2', name: 'TechCorp Inc.', role: 'Admin' },
    { id: 'ws_3', name: 'Boutique Fashion', role: 'Editor' }
  ]);
  const [activeWorkspace, setActiveWorkspace] = useState(workspaces[0]);
  const [showWorkspaceMenu, setShowWorkspaceMenu] = useState(false);

  const [dashboardKey, setDashboardKey] = useState(0);
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
    setActiveSection('scheduler');

    // Mostrar notificación de éxito
    showToast('¡Recordatorio creado exitosamente!', 'success');
  };

  // Detectar sección activa basada en la URL
  useEffect(() => {
    const path = location.pathname;

    let newSection = 'inicio'; // default
    if (path === '/dashboard') newSection = 'inicio';
    else if (path === '/strategist') newSection = 'strategist';
    else if (path === '/explore' || path === '/radar') newSection = 'radar';
    else if (path === '/studio') newSection = 'studio';
    else if (path === '/scheduler') newSection = 'scheduler';
    else if (path === '/analytics') newSection = 'analytics';
    else if (path === '/seo') newSection = 'seo';
    else if (path === '/ads') newSection = 'ads';
    else if (path === '/email') newSection = 'email';
    else if (path === '/prompts') newSection = 'prompts';
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

  // Responsive sidebar state
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 768);
  const [chatOpen, setChatOpen] = useState(false);

  // Auto-close sidebar on mobile route change and handle resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    // Set initial state based on width (in case of SSR mismatch or reload)
    if (window.innerWidth < 768) setSidebarOpen(false);

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close sidebar on mobile when navigating
  useEffect(() => {
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  }, [location.pathname]);


  const [chatMessage, setChatMessage] = useState('');
  const [selectedTrendForChat, setSelectedTrendForChat] = useState(null);
  const [initialHashtagMix, setInitialHashtagMix] = useState('');


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
    if (sidebarOpen && window.innerWidth < 768) {
      // On mobile, close sidebar if opening chat
      setSidebarOpen(false);
    }
    setChatOpen(!chatOpen);
  };

  // ... (keep other functions like handleTrendClick, sendMessage unchanged) ...
  // Re-declare them here if needed or assume they are preserved if outside the replacement chunk. 
  // Since I am replacing a large chunk, I need to be careful.
  // The tool instructions say: "StartLine and EndLine should specify a range... containing precisely the instances of TargetContent".
  // To avoid deleting `sendMessage` and others, I will narrow the Replace scope or include them.
  // The logical block allows me to just replace the state init and effect parts if I target them correctly.

  // Let's restart the strategy for this tool call to be safer and avoid deleting implementation details.
  // I will target the specific block of state initialization and the return statement separately or use a smaller chunk.

  // Actually, I can just replace the layout (return statement) and the state init lines separately.
  // Let's do the state init first.


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

  // Secciones del sidebar (AI Community Manager Pipeline -> Agencia Virtual)
  const homeSection = { id: 'inicio', label: 'Centro de Mando', icon: Home };
  
  const agencyDepartments = [
    {
      id: 'dept-1',
      category: '1. Dirección y Estrategia',
      roles: 'CEO · Estratega · Account Manager',
      items: [
        { id: 'analytics', label: 'Finanzas & CRM', icon: BarChart3 },
        { id: 'strategist', label: 'Estrategia & Insights', icon: Brain },
        { id: 'radar', label: 'Radar de Tendencias', icon: Target },
      ]
    },
    {
      id: 'dept-2',
      category: '2. Creatividad y Diseño',
      roles: 'Dir. Creativo · UI Designer · Videomaker',
      items: [
        { id: 'studio', label: 'Estudio Creativo', icon: Wand2 },
      ]
    },
    {
      id: 'dept-3',
      category: '3. Contenido y Copywriting',
      roles: 'Content Strategist · Copywriter · CM',
      items: [
        { id: 'scheduler', label: 'Planificador Omni', icon: Calendar },
        { id: 'email', label: 'Email & Funnels', icon: Mail },
        { id: 'prompts', label: 'Base de Conocimiento', icon: Terminal },
      ]
    },
    {
      id: 'dept-4',
      category: '4. Performance y Paid Media',
      roles: 'Media Buyer · SEM Specialist',
      items: [
        { id: 'ads', label: 'Gestor de Ads', icon: Megaphone },
      ]
    },
    {
      id: 'dept-5',
      category: '5. SEO, Web y Tecnología',
      roles: 'SEO Specialist · Web Dev · Data Analyst',
      items: [
        { id: 'seo', label: 'SEO Studio', icon: Search },
        { id: 'configuracion', label: 'Configuración', icon: Settings }
      ]
    },
    {
      id: 'dept-6',
      category: '6. Comercial y Operaciones',
      roles: 'Head of Sales · Project Manager',
      items: [
        { id: 'linkedin', label: 'Máquina B2B', icon: Users },
      ]
    }
  ];

  // Submenu items for Música Viral
  const musicSubmenuItems = [
    { id: 'browse', label: 'Explorar', icon: '🎵' },
    { id: 'platforms', label: 'Plataformas', icon: '🌐' },
  ];

  // Submenu items for Radar Inteligente
  const radarSubmenuItems = [
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

      {/* Mobile Backdrop */}
      <AnimatePresence>
        {sidebarOpen && window.innerWidth < 768 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/60 z-[55] md:hidden backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.div
        className={`fixed md:relative inset-y-0 left-0 z-[60] flex flex-col h-screen backdrop-blur-md border-r transition-all duration-300 
          ${theme === 'dark' ? 'bg-gray-900/95 border-gray-800' : 'bg-white/95 border-gray-200 shadow-sm'} 
          ${sidebarOpen ? 'w-64 md:w-56 translate-x-0' : '-translate-x-full md:translate-x-0 md:w-14'}
        `}
        initial={false} // Disable initial animation to prevent flash
      >
        {/* Logo */}
        <div className={`px-5 h-[88px] flex items-center border-b ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'} shrink-0`}>
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="Predix Logo" className="w-24 h-12 object-contain rounded-lg" />
          </div>
        </div>

        {/* Workspace Switcher */}
        {sidebarOpen && (
          <div className={`px-3 py-3 border-b relative ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'}`}>
            <button 
              onClick={() => setShowWorkspaceMenu(!showWorkspaceMenu)}
              className={`w-full flex items-center justify-between p-2 rounded-lg transition-colors border ${showWorkspaceMenu ? (theme === 'dark' ? 'bg-white/10 border-gray-600' : 'bg-gray-100 border-gray-300') : (theme === 'dark' ? 'bg-[#0b0c10] border-gray-800 hover:border-gray-700' : 'bg-white border-gray-200 hover:border-gray-300')}`}
            >
              <div className="flex items-center gap-2 overflow-hidden">
                <div className="w-6 h-6 rounded bg-gradient-to-tr from-[#007bff] to-[#00ff9d] flex items-center justify-center text-[10px] font-bold text-white shrink-0">
                  {activeWorkspace.name.charAt(0)}
                </div>
                <div className="text-left min-w-0">
                  <p className={`text-xs font-bold truncate ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{activeWorkspace.name}</p>
                  <p className="text-[9px] text-gray-500 truncate">Cliente</p>
                </div>
              </div>
              <ChevronDown className={`w-3 h-3 text-gray-500 transition-transform ${showWorkspaceMenu ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {showWorkspaceMenu && (
                <motion.div 
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className={`absolute top-full left-3 right-3 mt-1 py-2 rounded-xl border shadow-xl z-50 overflow-hidden ${theme === 'dark' ? 'bg-[#1a1a2e] border-gray-700' : 'bg-white border-gray-200'}`}
                >
                  <div className="px-3 pb-2 mb-2 border-b border-gray-800/50 dark:border-gray-800">
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Tus Clientes</p>
                  </div>
                  <div className="max-h-40 overflow-y-auto custom-scrollbar">
                    {workspaces.map(ws => (
                      <button
                        key={ws.id}
                        onClick={() => {
                          setActiveWorkspace(ws);
                          setShowWorkspaceMenu(false);
                          showToast(`Cambiaste al entorno de ${ws.name}`, 'success');
                        }}
                        className={`w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-white/5 transition-colors ${activeWorkspace.id === ws.id ? 'bg-[#007bff]/10' : ''}`}
                      >
                        <Building className={`w-4 h-4 ${activeWorkspace.id === ws.id ? 'text-[#00ff9d]' : 'text-gray-400'}`} />
                        <span className={`text-sm truncate ${activeWorkspace.id === ws.id ? (theme === 'dark' ? 'text-[#00ff9d] font-bold' : 'text-[#00bb72] font-bold') : (theme === 'dark' ? 'text-gray-300' : 'text-gray-700')}`}>
                          {ws.name}
                        </span>
                      </button>
                    ))}
                  </div>
                  <div className="px-2 pt-2 mt-1 border-t border-gray-800/50 dark:border-gray-800">
                    <button 
                      onClick={() => {
                        setShowWorkspaceMenu(false);
                        showToast('Próximamente: Añadir nuevo cliente', 'info');
                      }}
                      className={`w-full flex items-center gap-2 px-3 py-2 text-left rounded-lg transition-colors ${theme === 'dark' ? 'text-gray-400 hover:text-white hover:bg-white/5' : 'text-gray-600 hover:text-black hover:bg-gray-100'}`}
                    >
                      <Plus className="w-4 h-4" />
                      <span className="text-sm">Añadir Cliente</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {!sidebarOpen && (
           <div className={`px-3 py-3 border-b flex justify-center ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'}`}>
              <div 
                className="w-8 h-8 rounded bg-gradient-to-tr from-[#007bff] to-[#00ff9d] flex items-center justify-center text-xs font-bold text-white shrink-0 cursor-pointer hover:scale-105 transition-transform"
                title={activeWorkspace.name}
                onClick={() => setSidebarOpen(true)}
              >
                {activeWorkspace.name.charAt(0)}
              </div>
           </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto custom-scrollbar">
          <div className="space-y-6">
            
            {/* Inicio Standalone */}
            <div>
              <motion.button
                onClick={() => {
                  navigate('/dashboard');
                  setActiveSection('inicio');
                  if (window.innerWidth < 768) setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${activeSection === 'inicio'
                  ? 'bg-gradient-to-r from-[#007bff]/20 to-[#00ff9d]/20 text-[#00bb72] border border-[#00ff9d]/30 font-bold shadow-lg'
                  : theme === 'dark'
                    ? 'text-gray-300 hover:text-white hover:bg-gray-800/50'
                    : 'text-gray-600 hover:text-black hover:bg-gray-100'
                  }`}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <homeSection.icon className="w-5 h-5 flex-shrink-0" />
                {sidebarOpen && <span className="font-semibold text-sm">{homeSection.label}</span>}
              </motion.button>
            </div>

            {/* Departamentos */}
            {agencyDepartments.map((dept, index) => (
              <div key={index} className="flex flex-col mb-2">
                {sidebarOpen && (
                  <button 
                    onClick={() => {
                      setActiveSection(dept.id);
                      if (window.innerWidth < 768) setSidebarOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 mt-1 rounded-lg transition-colors group flex items-center justify-between ${
                      activeSection === dept.id || dept.items.some(i => i.id === activeSection)
                        ? 'bg-[#007bff]/10 border border-[#007bff]/20 shadow-sm'
                        : 'hover:bg-white/5'
                    }`}
                  >
                    <div>
                      <h4 className={`text-[11px] font-black uppercase tracking-wider mb-0.5 transition-colors ${
                        activeSection === dept.id || dept.items.some(i => i.id === activeSection) ? 'text-[#00bb72]' : 'text-gray-400 group-hover:text-gray-300'
                      }`}>
                        {dept.category}
                      </h4>
                      <p className={`text-[9px] font-medium leading-tight ${
                        activeSection === dept.id || dept.items.some(i => i.id === activeSection) ? 'text-[#00bb72]/80' : 'text-gray-500'
                      }`}>
                        {dept.roles}
                      </p>
                    </div>
                  </button>
                )}
                {!sidebarOpen && (
                  <button 
                    onClick={() => setActiveSection(dept.id)}
                    className={`w-full h-10 flex items-center justify-center my-1 rounded-lg ${
                      activeSection === dept.id || dept.items.some(i => i.id === activeSection)
                        ? 'bg-[#007bff]/10 border border-[#007bff]/20 text-[#00bb72]'
                        : 'text-gray-400 hover:bg-white/5 hover:text-gray-300'
                    }`}
                  >
                    <span className="text-xs font-black">{index + 1}</span>
                  </button>
                )}
              </div>
            ))}
          </div>
          
          {/* Configuración Standalone */}
          <div className="mt-6 border-t border-white/5 pt-4">
            <motion.button
              onClick={() => {
                navigate('/settings');
                setActiveSection('configuracion');
                if (window.innerWidth < 768) setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${activeSection === 'configuracion'
                ? 'bg-[#007bff]/10 text-[#00bb72] font-bold'
                : theme === 'dark'
                  ? 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                  : 'text-gray-600 hover:text-black hover:bg-gray-100'
                }`}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <Settings className="w-5 h-5 flex-shrink-0" />
              {sidebarOpen && <span className="font-semibold text-sm">Configuración</span>}
            </motion.button>
          </div>
        </nav>

        {/* User Info / Logout */}
        <div className={`p-4 border-t ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'}`}>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => !sidebarOpen ? handleLogout() : null}
              className={`w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-xs flex-shrink-0 transition-transform ${!sidebarOpen ? 'hover:scale-110' : ''}`}
              title={!sidebarOpen ? "Cerrar Sesión" : ""}
            >
              {!sidebarOpen ? <LogOut className="w-4 h-4" /> : (user?.name?.charAt(0) || 'U')}
            </button>
            {sidebarOpen && (
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium truncate ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {user?.name || 'Demo User'}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {user?.email || 'demo@predix.ai'}
                </p>
              </div>
            )}
            {sidebarOpen && (
              <button
                onClick={handleLogout}
                className="text-gray-500 hover:text-red-400 transition-colors p-1"
                title="Cerrar Sesión"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

      </motion.div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col w-full min-w-0">
        {/* Header */}
        <motion.header
          className={`sticky top-0 z-40 backdrop-blur-md border-b px-4 md:px-8 h-[88px] flex items-center transition-all duration-300 w-full ${theme === 'dark' ? 'bg-gray-900/50 border-gray-800' : 'bg-white/80 border-gray-200'
            }`}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-4">
              <motion.button
                onClick={toggleSidebar}
                className={`p-2 rounded-lg transition-colors ${theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
                  }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {sidebarOpen
                  ? <Menu className={`w-4 h-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`} />
                  : <Menu className={`w-4 h-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`} />
                }
              </motion.button>
              <div>
                <h1 className={`text-lg md:text-xl font-bold truncate max-w-[150px] md:max-w-none ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {activeSection === 'inicio' && 'Centro de Mando'}
                  {activeSection === 'strategist' && 'Estratega IA'}
                  {activeSection === 'radar' && 'Radar de Tendencias'}
                  {activeSection === 'studio' && 'Estudio Creativo'}
                  {activeSection === 'scheduler' && 'Planificador Omni'}
                  {activeSection === 'analytics' && 'Analítica & Agencia'}
                  {activeSection === 'seo' && 'SEO Studio'}
                  {activeSection === 'ads' && 'Gestor de Ads'}
                  {activeSection === 'email' && 'Email & Funnels'}
                  {activeSection === 'prompts' && 'Base de Conocimiento'}
                  {activeSection === 'create-reminder' && 'Nuevo Recordatorio'}
                  {activeSection === 'configuracion' && 'Configuración'}
                </h1>
                <p className={`text-xs md:text-sm hidden md:block ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                  Bienvenido de vuelta, {user?.name || 'Usuario'} 👋
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 md:gap-3">
              {/* Selector de País */}
              <div className="hidden md:block">
                <CountrySelector onCountryChange={(code, data) => {
                  console.log('País seleccionado:', code, data);
                  updateCountry(code, data);
                  // Forzar re-render del dashboard
                  setDashboardKey(prev => prev + 1);
                }} />
              </div>

              {/* Mobile Search Icon only */}
              <div className="md:hidden">
                <button className="p-2 text-gray-400 hover:text-white"><Search className="w-5 h-5" /></button>
              </div>

              {/* Desktop Search Bar */}
              <div className="relative hidden md:block">
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


            </div>
          </div>
        </motion.header>

        {/* Content Area */}
        <div className="flex-1 flex overflow-hidden w-full relative">
          {/* Main Dashboard Content */}
          <div className="flex-1 w-full h-full px-4 md:px-8 py-6 overflow-y-auto custom-scrollbar">
            <AnimatePresence mode="wait">
              {activeSection === 'inicio' && (
                <motion.div
                  key="inicio"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4 pb-20 md:pb-0" // Add padding bottom for mobile
                >
                  {/* NEW: Quick Actions Widget (Moved to Top) */}
                  <QuickActionsWidget
                    onCreatePost={() => setActiveSection('radar-inteligente')}
                    onScheduleTopTrend={() => setActiveSection('chat-ia')}
                    onViewReport={() => setShowDashboardExportModal(true)}
                    onRefresh={() => setDashboardKey(prev => prev + 1)}
                  />

                  {/* Dashboard Localizado por País */}
                  <CountryDashboard key={`dashboard-${dashboardKey}`} />

                  {/* Alertas Premium / Insights IA */}
                  <div className="bg-gradient-to-r from-red-900/40 to-orange-900/40 border border-red-500/20 rounded-2xl p-4 md:p-5 mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center flex-shrink-0 relative">
                        <Bell className="w-6 h-6 text-red-400" />
                        <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 border-2 border-[#111318] rounded-full animate-ping"></span>
                        <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 border-2 border-[#111318] rounded-full"></span>
                      </div>
                      <div>
                        <h4 className="text-white font-bold text-sm md:text-base flex items-center gap-2">
                          Alerta de Tendencia Crítica <span className="text-[10px] bg-red-500/20 text-red-400 px-2 py-0.5 rounded uppercase tracking-wider font-bold">Premium</span>
                        </h4>
                        <p className="text-gray-300 text-xs md:text-sm">El formato "Carrusel Educativo" está perdiendo alcance orgánico (-22%). La IA sugiere pivotar a Reels cortos (15s) esta semana.</p>
                      </div>
                    </div>
                    <button className="bg-red-500 hover:bg-red-600 text-white font-bold px-4 py-2 rounded-xl text-sm transition-colors whitespace-nowrap flex-shrink-0 w-full md:w-auto">
                      Ver Análisis Completo
                    </button>
                  </div>

                  {/* Summary Cards Actualizadas */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 mb-6">
                    {[
                      {
                        title: 'Alcance Orgánico Total',
                        value: '2.4M',
                        change: '+15.2%',
                        icon: TrendingUp,
                        color: 'from-blue-600 to-cyan-500',
                        description: 'A través de todas las plataformas'
                      },
                      {
                        title: 'Tasa de Conversión (ER)',
                        value: '4.8%',
                        change: '+1.1%',
                        icon: Target,
                        color: 'from-[#00ff9d] to-emerald-500',
                        description: 'Mejor que el 85% de tu industria'
                      },
                      {
                        title: 'Leads Capturados',
                        value: '842',
                        change: '+24%',
                        icon: Users,
                        color: 'from-purple-600 to-pink-500',
                        description: 'Costo por Lead (CPL): $1.24'
                      }
                    ].map((card, index) => (
                      <motion.div
                        key={index}
                        className="bg-[#1a1d24] border border-white/5 p-6 rounded-2xl relative overflow-hidden group hover:border-white/10 transition-colors"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: index * 0.1 }}
                      >
                        <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${card.color} opacity-5 rounded-full blur-3xl group-hover:opacity-10 transition-opacity`} />
                        <div className="flex items-center justify-between mb-4 relative z-10">
                          <div className={`w-10 h-10 rounded-xl bg-gradient-to-r ${card.color} flex items-center justify-center shadow-lg`}>
                            <card.icon className="w-5 h-5 text-white" />
                          </div>
                          <span className="text-[#00ff9d] text-xs font-bold bg-[#00ff9d]/10 px-2 py-1 rounded-lg flex items-center gap-1">
                            ↑ {card.change}
                          </span>
                        </div>
                        <h3 className="text-3xl font-black text-white mb-1 relative z-10">{card.value}</h3>
                        <p className="text-gray-400 font-semibold text-sm mb-1 relative z-10">{card.title}</p>
                        <p className="text-gray-500 text-xs relative z-10">{card.description}</p>
                      </motion.div>
                    ))}
                  </div>

                  {/* Charts Section */}
                  {/* Charts Section - Re-styled for Premium Look */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                    {/* Trend Evolution Chart */}
                    <motion.div
                      className="bg-[#111318] border border-white/5 rounded-2xl p-6 shadow-xl relative overflow-hidden"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: 0.4 }}
                    >
                      {/* Decorative Element */}
                      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-[50px] pointer-events-none" />

                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                          <TrendingUp className="w-5 h-5 text-blue-400" />
                          Curva de Tendencias
                        </h3>
                        <div className="flex bg-gray-800/50 rounded-lg p-1 border border-white/5">
                          <button className="text-xs font-medium px-3 py-1.5 bg-[#007bff]/20 text-[#007bff] rounded-md transition-colors">24h</button>
                          <button className="text-xs font-medium px-3 py-1.5 text-gray-400 hover:text-white transition-colors">7d</button>
                          <button className="text-xs font-medium px-3 py-1.5 text-gray-400 hover:text-white transition-colors">30d</button>
                        </div>
                      </div>
                      <div style={{ height: '260px' }}>
                        <Line data={trendData} options={chartOptions} />
                      </div>
                    </motion.div>

                    {/* Platform Distribution */}
                    <motion.div
                      className="bg-[#111318] border border-white/5 rounded-2xl p-6 shadow-xl relative overflow-hidden"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: 0.5 }}
                    >
                      {/* Decorative Element */}
                      <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-[50px] pointer-events-none" />

                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                          <BarChart3 className="w-5 h-5 text-purple-400" />
                          Distribución x Plataforma
                        </h3>
                        <button className="text-xs text-gray-400 hover:text-white flex items-center gap-1 transition-colors">
                          <Settings className="w-3 h-3" /> Configuración
                        </button>
                      </div>
                      <div style={{ height: '260px' }}>
                        <Doughnut data={platformData} options={doughnutOptions} />
                      </div>
                    </motion.div>
                  </div>



                  {/* Layout: Radar + Activity Feed lado a lado */}
                  {/* Activity Feed (Full Width) */}
                  <div className="mb-6">
                    <ActivityFeed activities={dashboardActivities} />
                  </div>

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



              {/* === HUBS DE DEPARTAMENTO === */}
              {activeSection.startsWith('dept-') && (
                <motion.div
                  key={activeSection}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="w-full h-full pb-20 md:pb-0"
                >
                  <DepartmentHub 
                    department={agencyDepartments.find(d => d.id === activeSection)}
                    onSelectTool={(toolId) => {
                      if (toolId === 'configuracion') {
                        navigate('/settings');
                      } else {
                        setActiveSection(toolId);
                      }
                    }}
                  />
                </motion.div>
              )}

              {/* === STRATEGIST === */}
              {activeSection === 'strategist' && (
                <motion.div
                  key="strategist"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="w-full h-full text-white pb-20 md:pb-0"
                >
                  <AIStrategistModule />
                </motion.div>
              )}

              {/* === TREND RADAR === */}
              {activeSection === 'radar' && (
                <motion.div
                  key="radar"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="pb-20 md:pb-0"
                >
                  <TrendRadarModule
                    scheduledReminders={scheduledReminders}
                    onSendHashtagMix={(mix) => {
                      if (!mix) return;
                      setInitialHashtagMix(mix);
                      setActiveSection('create-reminder');
                    }}
                  />
                </motion.div>
              )}

              {/* === CONTENT STUDIO === */}
              {activeSection === 'studio' && (
                <motion.div
                  key="studio"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="w-full h-full text-white"
                >
                  <div className="bg-gradient-to-r from-blue-600 to-cyan-500 p-8 rounded-2xl mb-6 shadow-lg relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-[40px]" />
                    <h2 className="text-2xl font-bold mb-2 flex items-center gap-2"><Wand2 className="w-6 h-6" /> Content Studio</h2>
                    <p className="text-white/80">Fábrica de Ideas, Generador Visual y Asistente Copywriter IA en un solo lugar.</p>
                  </div>
                  {/* ContentStudio orquesta Creador Visual, Ideas y Scripts */}
                  <ContentStudioModule />
                </motion.div>
              )}

              {/* === OMNI-SCHEDULER === */}
              {activeSection === 'scheduler' && (
                <motion.div
                  key="scheduler"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="pb-20 md:pb-0"
                >
                  <OmniSchedulerModule
                    onNavigateToCreate={() => {
                      console.log('Navegando a create-reminder...');
                      setActiveSection('create-reminder');
                    }}
                    scheduledReminders={scheduledReminders}
                    onUpdateReminders={setScheduledReminders}
                  />
                </motion.div>
              )}

              {/* === ANALYTICS & AGENCY === */}
              {activeSection === 'analytics' && (
                <motion.div
                  key="analytics"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="w-full h-full text-white pb-20 md:pb-0"
                >
                  <AnalyticsAgencyModule />
                </motion.div>
              )}

              {/* === SEO STUDIO === */}
              {activeSection === 'seo' && (
                <motion.div
                  key="seo"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="w-full h-full text-white pb-20 md:pb-0"
                >
                  <SEOStudioModule />
                </motion.div>
              )}

              {/* === LINKEDIN B2B === */}
              {activeSection === 'linkedin' && (
                <motion.div
                  key="linkedin"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="w-full h-full text-white pb-20 md:pb-0"
                >
                  <LinkedInB2BModule />
                </motion.div>
              )}

              {/* === GESTOR DE ADS === */}
              {activeSection === 'ads' && (
                <motion.div
                  key="ads"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="w-full h-full text-white pb-20 md:pb-0"
                >
                  <AdsManagerModule />
                </motion.div>
              )}

              {/* === EMAIL & FUNNELS === */}
              {activeSection === 'email' && (
                <motion.div
                  key="email"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="w-full h-full text-white pb-20 md:pb-0"
                >
                  <EmailFunnelModule />
                </motion.div>
              )}

              {/* === KNOWLEDGE BASE === */}
              {activeSection === 'prompts' && (
                <motion.div
                  key="prompts"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="w-full h-full text-white pb-20 md:pb-0"
                >
                  <PromptsLibraryModule />
                </motion.div>
              )}

              {/* === CREATE REMINDER === */}
              {activeSection === 'create-reminder' && (
                <motion.div
                  key="create-reminder"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <CreateReminderPage
                    onBack={() => setActiveSection('scheduler')}
                    onSave={handleAddReminder}
                    initialHashtagMix={initialHashtagMix}
                  />
                </motion.div>
              )}

              {/* === CONFIGURACIÓN === */}
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

          {/* Enhanced AI Assistant */}
          {/* Enhanced AI Assistant - DISABLED BY USER REQUEST
          <EnhancedAIAssistant
            isOpen={chatOpen}
            onClose={() => setChatOpen(false)}
            context={selectedTrendForChat ? { type: 'trend', ...selectedTrendForChat } : null}
          />
          */}

          {/* Floating AI Assistant Button - DISABLED BY USER REQUEST
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
          */}
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
