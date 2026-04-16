import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, 
  Send, 
  Brain, 
  Zap, 
  Target, 
  Download,
  Copy,
  Sparkles,
  Lightbulb,
  TrendingUp,
  Hash,
  Clock,
  Users,
  BarChart3,
  Rocket,
  Star,
  CheckCircle,
  AlertCircle,
  Loader,
  Calendar,
  Eye,
  Heart,
  Share2,
  Play,
  Pause,
  Settings,
  Filter,
  Plus,
  Edit,
  Trash2,
  ExternalLink,
  Activity,
  Gauge,
  PieChart,
  LineChart,
  ArrowUp,
  ArrowDown,
  Briefcase,
  Megaphone,
  Camera,
  Video,
  FileText,
  Image,
  Layers,
  Grid3X3,
  List,
  X
} from 'lucide-react';
import useStore from '../store/useStore';
import { useNotifications } from '../hooks/useNotifications';

const PredictiveActionsModule = () => {
  const { user } = useStore();
  const { showToast } = useNotifications();
  
  // Estados para Dashboard de Acciones Ejecutables
  const [activeView, setActiveView] = useState('dashboard'); // 'dashboard', 'chat', 'calendar', 'analytics'
  const [actions, setActions] = useState([
    {
      id: 1,
      title: 'Crear contenido viral sobre IA',
      description: 'Video explicativo sobre ChatGPT para empresas',
      type: 'content',
      platform: 'TikTok',
      status: 'pending',
      priority: 'high',
      dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      estimatedReach: '2.5M',
      confidence: 94,
      tags: ['#AI', '#TechTips', '#Business'],
      metrics: { views: 0, likes: 0, shares: 0, comments: 0 }
    },
    {
      id: 2,
      title: 'Campaña hashtag #SustainableFashion',
      description: 'Serie de posts sobre moda sostenible',
      type: 'campaign',
      platform: 'Instagram',
      status: 'in-progress',
      priority: 'medium',
      dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      estimatedReach: '1.8M',
      confidence: 89,
      tags: ['#SustainableFashion', '#EcoStyle', '#GreenFashion'],
      metrics: { views: 125000, likes: 8500, shares: 1200, comments: 450 }
    },
    {
      id: 3,
      title: 'Webinar sobre Growth Hacking',
      description: 'Evento en vivo para startups',
      type: 'event',
      platform: 'LinkedIn',
      status: 'completed',
      priority: 'high',
      dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      estimatedReach: '800K',
      confidence: 91,
      tags: ['#StartupLife', '#GrowthHacking', '#Webinar'],
      metrics: { views: 45000, likes: 2800, shares: 890, comments: 320 }
    }
  ]);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');

  // 🤖 Estados para Generador de Estrategias IA
  const [showStrategyGenerator, setShowStrategyGenerator] = useState(false);
  const [strategyForm, setStrategyForm] = useState({
    industry: '',
    niche: '',
    objective: '',
    targetAudience: '',
    budget: '',
    timeframe: '',
    platforms: []
  });
  const [generatingStrategy, setGeneratingStrategy] = useState(false);
  const [generatedStrategy, setGeneratedStrategy] = useState(null);
  // 📅 Estados para Calendario de Contenido Inteligente
  const [calendarEvents, setCalendarEvents] = useState([
    {
      id: 1,
      title: 'Post sobre IA en LinkedIn',
      type: 'content',
      platform: 'LinkedIn',
      date: new Date(2024, 10, 6, 9, 0), // Nov 6, 2024 9:00 AM
      status: 'scheduled',
      priority: 'high',
      estimatedReach: '50K',
      content: 'Cómo la IA está transformando el marketing digital en 2024',
      hashtags: ['#IA', '#Marketing', '#Digital'],
      aiGenerated: true
    },
    {
      id: 2,
      title: 'Video TikTok sobre tendencias',
      type: 'video',
      platform: 'TikTok',
      date: new Date(2024, 10, 7, 15, 30),
      status: 'draft',
      priority: 'medium',
      estimatedReach: '200K',
      content: 'Top 5 tendencias de marketing que debes conocer',
      hashtags: ['#Trends', '#Marketing', '#Viral'],
      aiGenerated: false
    },
    {
      id: 3,
      title: 'Webinar Growth Hacking',
      type: 'event',
      platform: 'YouTube',
      date: new Date(2024, 10, 8, 18, 0),
      status: 'published',
      priority: 'high',
      estimatedReach: '15K',
      content: 'Estrategias avanzadas de growth hacking para startups',
      hashtags: ['#GrowthHacking', '#Startup', '#Webinar'],
      aiGenerated: true
    }
  ]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [calendarView, setCalendarView] = useState('month'); // 'month', 'week', 'day'
  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [autoScheduling, setAutoScheduling] = useState(false);

  // 🔍 Estados para Análisis de Competencia
  const [competitors, setCompetitors] = useState([
    {
      id: 1,
      name: 'TechCorp Solutions',
      industry: 'Technology',
      followers: { linkedin: 45000, twitter: 32000, instagram: 18000 },
      engagement: { linkedin: 4.2, twitter: 3.8, instagram: 6.1 },
      topContent: ['IA en empresas', 'Automatización', 'Cloud Computing'],
      growth: '+15%',
      threat: 'high',
      lastAnalysis: new Date(Date.now() - 2 * 60 * 60 * 1000)
    },
    {
      id: 2,
      name: 'Digital Marketing Pro',
      industry: 'Marketing',
      followers: { linkedin: 28000, twitter: 55000, instagram: 42000 },
      engagement: { linkedin: 5.1, twitter: 4.5, instagram: 7.3 },
      topContent: ['Growth Hacking', 'Social Media', 'Content Strategy'],
      growth: '+22%',
      threat: 'medium',
      lastAnalysis: new Date(Date.now() - 4 * 60 * 60 * 1000)
    },
    {
      id: 3,
      name: 'StartupGuru',
      industry: 'Business',
      followers: { linkedin: 67000, twitter: 89000, instagram: 23000 },
      engagement: { linkedin: 6.8, twitter: 5.2, instagram: 4.9 },
      topContent: ['Fundraising', 'Pitch Decks', 'Scaling'],
      growth: '+8%',
      threat: 'low',
      lastAnalysis: new Date(Date.now() - 6 * 60 * 60 * 1000)
    }
  ]);
  const [competitorAnalysis, setCompetitorAnalysis] = useState(null);
  const [analyzingCompetitor, setAnalyzingCompetitor] = useState(false);
  const [benchmarkData, setBenchmarkData] = useState({
    avgEngagement: 5.2,
    avgGrowth: 15,
    topHashtags: ['#Marketing', '#IA', '#Growth', '#Startup', '#Digital'],
    contentGaps: ['Video tutorials', 'Case studies', 'Live events'],
    opportunities: ['Weekend content', 'Interactive polls', 'Behind-the-scenes']
  });

  // 📄 Sistema de Templates Expandido
  const [templateCategories] = useState(['Todos', 'Startup', 'E-commerce', 'SaaS', 'Educación', 'Salud', 'Fintech']);
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [templateSearch, setTemplateSearch] = useState('');
  
  const [strategyTemplates, setStrategyTemplates] = useState([
    {
      id: 1,
      name: 'Tech Startup Launch',
      category: 'Startup',
      industry: 'technology',
      description: 'Estrategia completa para lanzamiento de startup tecnológica',
      estimatedROI: '250%',
      duration: '3 meses',
      platforms: ['LinkedIn', 'Twitter', 'YouTube'],
      actions: 12,
      difficulty: 'Intermedio',
      tags: ['B2B', 'Tech', 'Launch'],
      preview: {
        week1: 'Setup de perfiles y contenido base',
        week2: 'Lanzamiento con thought leadership',
        week3: 'Engagement y community building',
        week4: 'Escalado y partnerships'
      }
    },
    {
      id: 2,
      name: 'E-commerce Fashion',
      category: 'E-commerce',
      industry: 'fashion',
      description: 'Impulsa ventas de moda online con contenido viral',
      estimatedROI: '180%',
      duration: '2 meses',
      platforms: ['Instagram', 'TikTok', 'Pinterest'],
      actions: 15,
      difficulty: 'Fácil',
      tags: ['B2C', 'Visual', 'Viral'],
      preview: {
        week1: 'Lookbooks y styling tips',
        week2: 'Influencer collaborations',
        week3: 'User generated content',
        week4: 'Seasonal campaigns'
      }
    },
    {
      id: 3,
      name: 'SaaS Growth Hacking',
      category: 'SaaS',
      industry: 'software',
      description: 'Crecimiento acelerado para productos SaaS B2B',
      estimatedROI: '320%',
      duration: '4 meses',
      platforms: ['LinkedIn', 'Twitter', 'Medium'],
      actions: 18,
      difficulty: 'Avanzado',
      tags: ['B2B', 'Growth', 'Technical'],
      preview: {
        week1: 'Product demos y case studies',
        week2: 'Webinars y thought leadership',
        week3: 'Customer success stories',
        week4: 'Community building'
      }
    },
    {
      id: 4,
      name: 'EdTech Student Acquisition',
      category: 'Educación',
      industry: 'education',
      description: 'Atrae estudiantes con contenido educativo viral',
      estimatedROI: '200%',
      duration: '3 meses',
      platforms: ['TikTok', 'Instagram', 'YouTube'],
      actions: 14,
      difficulty: 'Intermedio',
      tags: ['B2C', 'Educational', 'Youth'],
      preview: {
        week1: 'Educational content series',
        week2: 'Student testimonials',
        week3: 'Interactive challenges',
        week4: 'Scholarship campaigns'
      }
    },
    {
      id: 5,
      name: 'HealthTech Awareness',
      category: 'Salud',
      industry: 'healthcare',
      description: 'Construye confianza en productos de salud digital',
      estimatedROI: '150%',
      duration: '6 meses',
      platforms: ['LinkedIn', 'Facebook', 'YouTube'],
      actions: 20,
      difficulty: 'Avanzado',
      tags: ['B2B2C', 'Trust', 'Compliance'],
      preview: {
        week1: 'Expert interviews',
        week2: 'Patient success stories',
        week3: 'Educational webinars',
        week4: 'Regulatory compliance content'
      }
    },
    {
      id: 6,
      name: 'Fintech Trust Building',
      category: 'Fintech',
      industry: 'finance',
      description: 'Genera confianza en servicios financieros digitales',
      estimatedROI: '280%',
      duration: '4 meses',
      platforms: ['LinkedIn', 'Twitter', 'Medium'],
      actions: 16,
      difficulty: 'Avanzado',
      tags: ['B2B', 'Trust', 'Security'],
      preview: {
        week1: 'Security and compliance content',
        week2: 'Financial education series',
        week3: 'Customer testimonials',
        week4: 'Industry partnerships'
      }
    },
    {
      id: 7,
      name: 'Local Business Boost',
      category: 'E-commerce',
      industry: 'retail',
      description: 'Impulsa negocios locales con marketing digital',
      estimatedROI: '160%',
      duration: '2 meses',
      platforms: ['Facebook', 'Instagram', 'Google My Business'],
      actions: 10,
      difficulty: 'Fácil',
      tags: ['Local', 'B2C', 'Community'],
      preview: {
        week1: 'Local community engagement',
        week2: 'Customer spotlights',
        week3: 'Behind-the-scenes content',
        week4: 'Local partnerships'
      }
    },
    {
      id: 8,
      name: 'B2B Lead Generation',
      category: 'SaaS',
      industry: 'business',
      description: 'Genera leads cualificados para servicios B2B',
      estimatedROI: '300%',
      duration: '3 meses',
      platforms: ['LinkedIn', 'Twitter', 'Email'],
      actions: 13,
      difficulty: 'Intermedio',
      tags: ['B2B', 'Leads', 'Sales'],
      preview: {
        week1: 'Industry insights content',
        week2: 'Lead magnets creation',
        week3: 'Nurturing sequences',
        week4: 'Sales enablement'
      }
    }
  ]);

  // Funciones para manejar acciones
  const updateActionStatus = (actionId, newStatus) => {
    setActions(actions.map(action => 
      action.id === actionId ? { ...action, status: newStatus } : action
    ));
    showToast(`Acción ${newStatus === 'completed' ? 'completada' : 'actualizada'}`, 'success');
  };

  const deleteAction = (actionId) => {
    setActions(actions.filter(action => action.id !== actionId));
    showToast('Acción eliminada', 'success');
  };

  const addNewAction = () => {
    const newAction = {
      id: actions.length + 1,
      title: 'Nueva acción',
      description: 'Descripción de la nueva acción',
      type: 'content',
      platform: 'Instagram',
      status: 'pending',
      priority: 'medium',
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      estimatedReach: '1M',
      confidence: 85,
      tags: ['#NewAction'],
      metrics: { views: 0, likes: 0, shares: 0, comments: 0 }
    };
    setActions([...actions, newAction]);
    showToast('Nueva acción creada', 'success');
  };

  const filteredActions = actions.filter(action => {
    if (filterStatus !== 'all' && action.status !== filterStatus) return false;
    if (filterPriority !== 'all' && action.priority !== filterPriority) return false;
    return true;
  });

  const getActionStats = () => {
    const total = actions.length;
    const pending = actions.filter(a => a.status === 'pending').length;
    const inProgress = actions.filter(a => a.status === 'in-progress').length;
    const completed = actions.filter(a => a.status === 'completed').length;
    const totalReach = actions.reduce((sum, a) => sum + parseFloat(a.estimatedReach.replace('M', '').replace('K', '0.001')), 0);
    
    return { total, pending, inProgress, completed, totalReach: totalReach.toFixed(1) + 'M' };
  };

  const stats = getActionStats();

  // 🤖 FUNCIONES DEL GENERADOR DE ESTRATEGIAS IA
  const generateAIStrategy = async () => {
    setGeneratingStrategy(true);
    
    // Simular llamada a IA (en producción sería una API real)
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const aiStrategy = {
      id: Date.now(),
      title: `Estrategia ${strategyForm.industry} - ${strategyForm.objective}`,
      industry: strategyForm.industry,
      niche: strategyForm.niche,
      objective: strategyForm.objective,
      targetAudience: strategyForm.targetAudience,
      budget: strategyForm.budget,
      timeframe: strategyForm.timeframe,
      platforms: strategyForm.platforms,
      estimatedROI: Math.floor(Math.random() * 200 + 150) + '%',
      confidence: Math.floor(Math.random() * 20 + 80),
      actions: generateAIActions(),
      insights: generateAIInsights(),
      timeline: generateTimeline(),
      kpis: generateKPIs()
    };
    
    setGeneratedStrategy(aiStrategy);
    setGeneratingStrategy(false);
    showToast('Estrategia generada exitosamente por IA', 'success');
  };

  const generateAIActions = () => {
    const actionTemplates = {
      technology: [
        'Crear contenido educativo sobre innovación tecnológica',
        'Desarrollar webinars técnicos para desarrolladores',
        'Lanzar campaña de thought leadership en LinkedIn',
        'Crear demos interactivos del producto',
        'Participar en eventos tech y conferencias'
      ],
      fashion: [
        'Crear lookbooks estacionales con influencers',
        'Desarrollar contenido de styling tips',
        'Lanzar challenges de outfit en TikTok',
        'Crear contenido behind-the-scenes',
        'Colaborar con fashion bloggers'
      ],
      software: [
        'Crear tutoriales y casos de uso',
        'Desarrollar contenido de best practices',
        'Lanzar programa de customer success stories',
        'Crear webinars de onboarding',
        'Desarrollar contenido de ROI y métricas'
      ]
    };

    const templates = actionTemplates[strategyForm.industry] || actionTemplates.technology;
    return templates.slice(0, 3).map((title, index) => ({
      id: Date.now() + index,
      title,
      type: ['content', 'campaign', 'event'][index % 3],
      platform: strategyForm.platforms[index % strategyForm.platforms.length] || 'Instagram',
      priority: ['high', 'medium', 'low'][index % 3],
      estimatedReach: ['2.5M', '1.8M', '1.2M'][index],
      confidence: [94, 89, 87][index]
    }));
  };

  const generateAIInsights = () => [
    `El nicho ${strategyForm.niche} tiene un potencial de crecimiento del 180% en los próximos 6 meses`,
    `Tu audiencia objetivo responde mejor a contenido visual y educativo`,
    `Los mejores horarios para publicar son: 9:00 AM, 2:00 PM y 7:00 PM`,
    `Las plataformas seleccionadas tienen una sinergia del 95% para tu objetivo`
  ];

  const generateTimeline = () => [
    { week: 1, milestone: 'Setup inicial y creación de contenido base', status: 'pending' },
    { week: 2, milestone: 'Lanzamiento de primera campaña', status: 'pending' },
    { week: 4, milestone: 'Optimización basada en métricas', status: 'pending' },
    { week: 6, milestone: 'Escalado y expansión a nuevas plataformas', status: 'pending' }
  ];

  const generateKPIs = () => [
    { metric: 'Alcance Total', target: '5M+', current: '0', progress: 0 },
    { metric: 'Engagement Rate', target: '8%+', current: '0%', progress: 0 },
    { metric: 'Conversiones', target: '2,500+', current: '0', progress: 0 },
    { metric: 'ROI', target: '250%+', current: '0%', progress: 0 }
  ];

  const applyTemplate = (template) => {
    setStrategyForm({
      ...strategyForm,
      industry: template.industry,
      platforms: template.platforms
    });
    showToast(`Template "${template.name}" aplicado`, 'success');
  };

  const implementStrategy = () => {
    if (!generatedStrategy) return;
    
    // Añadir acciones generadas al dashboard
    const newActions = generatedStrategy.actions.map(action => ({
      ...action,
      status: 'pending',
      dueDate: new Date(Date.now() + Math.random() * 14 * 24 * 60 * 60 * 1000),
      description: `Acción generada por IA para ${generatedStrategy.objective}`,
      tags: [`#${generatedStrategy.industry}`, `#${generatedStrategy.niche}`],
      metrics: { views: 0, likes: 0, shares: 0, comments: 0 }
    }));
    
    setActions([...actions, ...newActions]);
    setShowStrategyGenerator(false);
    setGeneratedStrategy(null);
    showToast(`${newActions.length} acciones añadidas al dashboard`, 'success');
  };

  // 📅 FUNCIONES DEL CALENDARIO INTELIGENTE
  const generateAISchedule = async () => {
    setAutoScheduling(true);
    
    // Simular generación de calendario por IA
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const aiEvents = [
      {
        id: Date.now() + 1,
        title: 'Post matutino sobre productividad',
        type: 'content',
        platform: 'LinkedIn',
        date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000 + 9 * 60 * 60 * 1000),
        status: 'scheduled',
        priority: 'medium',
        estimatedReach: '35K',
        content: '5 herramientas de IA que aumentarán tu productividad',
        hashtags: ['#Productividad', '#IA', '#Tools'],
        aiGenerated: true
      },
      {
        id: Date.now() + 2,
        title: 'Story interactivo Instagram',
        type: 'story',
        platform: 'Instagram',
        date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 14 * 60 * 60 * 1000),
        status: 'draft',
        priority: 'high',
        estimatedReach: '80K',
        content: 'Poll: ¿Cuál es tu plataforma favorita para marketing?',
        hashtags: ['#Marketing', '#Poll', '#Engagement'],
        aiGenerated: true
      },
      {
        id: Date.now() + 3,
        title: 'Thread educativo Twitter',
        type: 'thread',
        platform: 'Twitter',
        date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000 + 16 * 60 * 60 * 1000),
        status: 'scheduled',
        priority: 'high',
        estimatedReach: '120K',
        content: 'Hilo: Cómo crear una estrategia de contenido que funcione',
        hashtags: ['#ContentStrategy', '#Thread', '#Marketing'],
        aiGenerated: true
      }
    ];
    
    setCalendarEvents([...calendarEvents, ...aiEvents]);
    setAutoScheduling(false);
    showToast(`${aiEvents.length} eventos programados automáticamente`, 'success');
  };

  const getOptimalTimes = (platform) => {
    const optimalTimes = {
      'LinkedIn': ['9:00 AM', '12:00 PM', '5:00 PM'],
      'Instagram': ['11:00 AM', '2:00 PM', '8:00 PM'],
      'TikTok': ['6:00 AM', '10:00 AM', '7:00 PM'],
      'Twitter': ['8:00 AM', '12:00 PM', '9:00 PM'],
      'YouTube': ['2:00 PM', '8:00 PM', '9:00 PM'],
      'Facebook': ['9:00 AM', '1:00 PM', '3:00 PM']
    };
    return optimalTimes[platform] || ['9:00 AM', '2:00 PM', '7:00 PM'];
  };

  const analyzeContentGaps = () => {
    const gaps = [
      {
        platform: 'TikTok',
        gap: 'Falta contenido viral los fines de semana',
        suggestion: 'Crear videos cortos y entretenidos para sábados',
        priority: 'high'
      },
      {
        platform: 'LinkedIn',
        gap: 'Poca actividad en horarios de almuerzo',
        suggestion: 'Programar posts educativos entre 12-2 PM',
        priority: 'medium'
      },
      {
        platform: 'Instagram',
        gap: 'Stories inconsistentes durante la semana',
        suggestion: 'Automatizar stories diarios con contenido behind-the-scenes',
        priority: 'medium'
      }
    ];
    setAiSuggestions(gaps);
    showToast('Análisis de gaps completado', 'success');
  };

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getEventsForDate = (date) => {
    return calendarEvents.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate.toDateString() === date.toDateString();
    });
  };

  const addEvent = (eventData) => {
    const newEvent = {
      id: Date.now(),
      ...eventData,
      aiGenerated: false
    };
    setCalendarEvents([...calendarEvents, newEvent]);
    setShowEventModal(false);
    showToast('Evento añadido al calendario', 'success');
  };

  const updateEvent = (eventId, updates) => {
    setCalendarEvents(calendarEvents.map(event => 
      event.id === eventId ? { ...event, ...updates } : event
    ));
    showToast('Evento actualizado', 'success');
  };

  const deleteEvent = (eventId) => {
    setCalendarEvents(calendarEvents.filter(event => event.id !== eventId));
    showToast('Evento eliminado', 'success');
  };

  // 🔍 FUNCIONES DE ANÁLISIS DE COMPETENCIA
  const analyzeCompetitor = async (competitorId) => {
    setAnalyzingCompetitor(true);
    
    // Simular análisis profundo de competidor
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const competitor = competitors.find(c => c.id === competitorId);
    const analysis = {
      competitor,
      strengths: [
        'Alto engagement en LinkedIn',
        'Contenido consistente y de calidad',
        'Buena presencia en múltiples plataformas',
        'Crecimiento sostenido mes a mes'
      ],
      weaknesses: [
        'Poca actividad los fines de semana',
        'Falta de contenido interactivo',
        'Horarios de publicación no optimizados',
        'Poca diversidad en formatos de contenido'
      ],
      contentStrategy: {
        frequency: '2-3 posts por día',
        bestTimes: ['9:00 AM', '2:00 PM', '6:00 PM'],
        topFormats: ['Carousels', 'Videos cortos', 'Infografías'],
        hashtagStrategy: competitor.topContent.map(topic => `#${topic.replace(' ', '')}`)
      },
      recommendations: [
        'Aumentar frecuencia de posts en Instagram',
        'Crear más contenido de video para TikTok',
        'Implementar estrategia de stories diarias',
        'Optimizar horarios de publicación'
      ],
      threatLevel: competitor.threat,
      score: Math.floor(Math.random() * 30 + 70) // 70-100
    };
    
    setCompetitorAnalysis(analysis);
    setAnalyzingCompetitor(false);
    showToast(`Análisis de ${competitor.name} completado`, 'success');
  };

  const runBenchmarkAnalysis = async () => {
    setAnalyzingCompetitor(true);
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const newBenchmark = {
      avgEngagement: (Math.random() * 3 + 4).toFixed(1),
      avgGrowth: Math.floor(Math.random() * 20 + 10),
      topHashtags: ['#Innovation', '#TechTrends', '#DigitalMarketing', '#AI', '#Growth'],
      contentGaps: ['Podcast content', 'User testimonials', 'Product demos'],
      opportunities: ['Morning content', 'Educational series', 'Community building']
    };
    
    setBenchmarkData(newBenchmark);
    setAnalyzingCompetitor(false);
    showToast('Análisis de benchmark actualizado', 'success');
  };

  const addCompetitor = (competitorData) => {
    const newCompetitor = {
      id: competitors.length + 1,
      ...competitorData,
      lastAnalysis: new Date(),
      threat: 'medium'
    };
    setCompetitors([...competitors, newCompetitor]);
    showToast('Competidor añadido para monitoreo', 'success');
  };

  const getThreatColor = (threat) => {
    switch(threat) {
      case 'high': return 'text-red-400 bg-red-500/20';
      case 'medium': return 'text-yellow-400 bg-yellow-500/20';
      case 'low': return 'text-green-400 bg-green-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  const getThreatLabel = (threat) => {
    switch(threat) {
      case 'high': return 'Alta';
      case 'medium': return 'Media';
      case 'low': return 'Baja';
      default: return 'N/A';
    }
  };

  // 📄 FUNCIONES DEL SISTEMA DE TEMPLATES
  const getFilteredTemplates = () => {
    return strategyTemplates.filter(template => {
      const matchesCategory = selectedCategory === 'Todos' || template.category === selectedCategory;
      const matchesSearch = template.name.toLowerCase().includes(templateSearch.toLowerCase()) ||
                           template.description.toLowerCase().includes(templateSearch.toLowerCase()) ||
                           template.tags.some(tag => tag.toLowerCase().includes(templateSearch.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  };

  const getDifficultyColor = (difficulty) => {
    switch(difficulty) {
      case 'Fácil': return 'text-green-400 bg-green-500/20';
      case 'Intermedio': return 'text-yellow-400 bg-yellow-500/20';
      case 'Avanzado': return 'text-red-400 bg-red-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  const saveCustomTemplate = (templateData) => {
    const newTemplate = {
      id: strategyTemplates.length + 1,
      ...templateData,
      category: 'Custom',
      difficulty: 'Personalizado'
    };
    setStrategyTemplates([...strategyTemplates, newTemplate]);
    showToast('Template personalizado guardado', 'success');
  };

  const duplicateTemplate = (templateId) => {
    const template = strategyTemplates.find(t => t.id === templateId);
    if (template) {
      const duplicated = {
        ...template,
        id: strategyTemplates.length + 1,
        name: `${template.name} (Copia)`,
        category: 'Custom'
      };
      setStrategyTemplates([...strategyTemplates, duplicated]);
      showToast('Template duplicado exitosamente', 'success');
    }
  };

  return (
    <div className="h-screen bg-[#0b0c10] flex flex-col">
      {/* Header con Navegación */}
      <motion.div
        className="bg-gradient-to-r from-gray-900 to-gray-800 border-b border-gray-700 p-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
              <Rocket className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Acciones Predictivas</h1>
              <p className="text-gray-400">Centro de comando para estrategias de marketing</p>
            </div>
          </div>
          
          {/* Navegación de Vistas */}
          <div className="flex bg-gray-700/50 rounded-lg p-1">
            {[
              { key: 'dashboard', label: 'Dashboard', icon: BarChart3 },
              { key: 'chat', label: 'IA Assistant', icon: Brain },
              { key: 'calendar', label: 'Calendario', icon: Calendar },
              { key: 'analytics', label: 'Analytics', icon: Activity }
            ].map(view => (
              <motion.button
                key={view.key}
                onClick={() => setActiveView(view.key)}
                className={`px-4 py-2 rounded text-sm flex items-center gap-2 transition-colors ${
                  activeView === view.key 
                    ? 'bg-purple-600 text-white' 
                    : 'text-gray-400 hover:text-white'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <view.icon className="w-4 h-4" />
                {view.label}
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Dashboard View */}
      {activeView === 'dashboard' && (
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          {/* Métricas Principales */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="bg-gradient-to-br from-blue-900/20 to-cyan-900/20 p-6 rounded-xl border border-blue-500/30">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <Briefcase className="w-6 h-6 text-blue-400" />
                </div>
                <span className="text-blue-400 text-sm font-medium">Total</span>
              </div>
              <div className="text-3xl font-bold text-white mb-1">{stats.total}</div>
              <div className="text-gray-400 text-sm">Acciones creadas</div>
            </div>

            <div className="bg-gradient-to-br from-orange-900/20 to-yellow-900/20 p-6 rounded-xl border border-orange-500/30">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-orange-400" />
                </div>
                <span className="text-orange-400 text-sm font-medium">Pendientes</span>
              </div>
              <div className="text-3xl font-bold text-white mb-1">{stats.pending}</div>
              <div className="text-gray-400 text-sm">Por ejecutar</div>
            </div>

            <div className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 p-6 rounded-xl border border-purple-500/30">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  <Activity className="w-6 h-6 text-purple-400" />
                </div>
                <span className="text-purple-400 text-sm font-medium">En Progreso</span>
              </div>
              <div className="text-3xl font-bold text-white mb-1">{stats.inProgress}</div>
              <div className="text-gray-400 text-sm">Ejecutándose</div>
            </div>

            <div className="bg-gradient-to-br from-green-900/20 to-emerald-900/20 p-6 rounded-xl border border-green-500/30">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-400" />
                </div>
                <span className="text-green-400 text-sm font-medium">Completadas</span>
              </div>
              <div className="text-3xl font-bold text-white mb-1">{stats.completed}</div>
              <div className="text-gray-400 text-sm">Finalizadas</div>
            </div>
          </motion.div>

          {/* Controles y Filtros */}
          <motion.div
            className="flex items-center justify-between mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="flex items-center gap-4">
              <h2 className="text-xl font-bold text-white">Acciones Ejecutables</h2>
              <div className="flex items-center gap-2">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="bg-gray-700/50 border border-gray-600/50 rounded-lg px-3 py-2 text-white text-sm"
                >
                  <option value="all">Todos los estados</option>
                  <option value="pending">Pendientes</option>
                  <option value="in-progress">En progreso</option>
                  <option value="completed">Completadas</option>
                </select>
                
                <select
                  value={filterPriority}
                  onChange={(e) => setFilterPriority(e.target.value)}
                  className="bg-gray-700/50 border border-gray-600/50 rounded-lg px-3 py-2 text-white text-sm"
                >
                  <option value="all">Todas las prioridades</option>
                  <option value="high">Alta prioridad</option>
                  <option value="medium">Media prioridad</option>
                  <option value="low">Baja prioridad</option>
                </select>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <motion.button
                onClick={() => setShowStrategyGenerator(true)}
                className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Brain className="w-4 h-4" />
                Generar Estrategia IA
              </motion.button>
              
              <motion.button
                onClick={addNewAction}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Plus className="w-4 h-4" />
                Nueva Acción
              </motion.button>
            </div>
          </motion.div>

          {/* Lista de Acciones */}
          <motion.div
            className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {filteredActions.map((action, index) => (
              <motion.div
                key={action.id}
                className="bg-gradient-to-br from-gray-800/50 to-gray-700/30 p-6 rounded-xl border border-gray-600/30 hover:border-gray-500/50 transition-all"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                {/* Header de la acción */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      action.type === 'content' ? 'bg-blue-500/20' :
                      action.type === 'campaign' ? 'bg-purple-500/20' :
                      'bg-green-500/20'
                    }`}>
                      {action.type === 'content' && <FileText className="w-5 h-5 text-blue-400" />}
                      {action.type === 'campaign' && <Megaphone className="w-5 h-5 text-purple-400" />}
                      {action.type === 'event' && <Calendar className="w-5 h-5 text-green-400" />}
                    </div>
                    <div>
                      <div className={`text-xs px-2 py-1 rounded-full font-medium ${
                        action.status === 'pending' ? 'bg-orange-500/20 text-orange-400' :
                        action.status === 'in-progress' ? 'bg-purple-500/20 text-purple-400' :
                        'bg-green-500/20 text-green-400'
                      }`}>
                        {action.status === 'pending' ? 'Pendiente' :
                         action.status === 'in-progress' ? 'En Progreso' :
                         'Completada'}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <motion.button
                      onClick={() => updateActionStatus(action.id, 
                        action.status === 'pending' ? 'in-progress' :
                        action.status === 'in-progress' ? 'completed' : 'pending'
                      )}
                      className="p-1 hover:bg-gray-600/50 rounded transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      {action.status === 'completed' ? 
                        <CheckCircle className="w-4 h-4 text-green-400" /> :
                        <Play className="w-4 h-4 text-gray-400" />
                      }
                    </motion.button>
                    <motion.button
                      onClick={() => deleteAction(action.id)}
                      className="p-1 hover:bg-red-500/20 rounded transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </motion.button>
                  </div>
                </div>

                {/* Contenido de la acción */}
                <h3 className="text-white font-bold text-lg mb-2">{action.title}</h3>
                <p className="text-gray-400 text-sm mb-4">{action.description}</p>

                {/* Métricas */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-lg font-bold text-blue-400">{action.estimatedReach}</div>
                    <div className="text-xs text-gray-400">Alcance Est.</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-green-400">{action.confidence}%</div>
                    <div className="text-xs text-gray-400">Confianza</div>
                  </div>
                </div>

                {/* Métricas de rendimiento */}
                {action.status !== 'pending' && (
                  <div className="grid grid-cols-4 gap-2 mb-4">
                    <div className="text-center">
                      <div className="text-sm font-bold text-white">{(action.metrics.views / 1000).toFixed(0)}K</div>
                      <div className="text-xs text-gray-400">Vistas</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-bold text-red-400">{(action.metrics.likes / 1000).toFixed(1)}K</div>
                      <div className="text-xs text-gray-400">Likes</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-bold text-blue-400">{action.metrics.shares}</div>
                      <div className="text-xs text-gray-400">Shares</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-bold text-purple-400">{action.metrics.comments}</div>
                      <div className="text-xs text-gray-400">Comentarios</div>
                    </div>
                  </div>
                )}

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-600/30">
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2 py-1 bg-gray-600/30 text-gray-300 rounded">{action.platform}</span>
                    <span className={`text-xs px-2 py-1 rounded ${
                      action.priority === 'high' ? 'bg-red-500/20 text-red-400' :
                      action.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-green-500/20 text-green-400'
                    }`}>
                      {action.priority === 'high' ? 'Alta' : action.priority === 'medium' ? 'Media' : 'Baja'}
                    </span>
                  </div>
                  <div className="text-xs text-gray-400">
                    {action.dueDate.toLocaleDateString()}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      )}

      {/* Placeholders para otras vistas */}
      {activeView === 'chat' && (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Brain className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">IA Assistant</h3>
            <p className="text-gray-400">Próximamente: Chat inteligente para estrategias</p>
          </div>
        </div>
      )}

      {/* 📅 CALENDARIO DE CONTENIDO INTELIGENTE */}
      {activeView === 'calendar' && (
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          {/* Header del Calendario */}
          <motion.div
            className="flex items-center justify-between mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-4">
              <h2 className="text-2xl font-bold text-white">Calendario de Contenido</h2>
              <div className="flex bg-gray-700/50 rounded-lg p-1">
                {['month', 'week', 'day'].map(view => (
                  <motion.button
                    key={view}
                    onClick={() => setCalendarView(view)}
                    className={`px-3 py-1 rounded text-sm transition-colors ${
                      calendarView === view 
                        ? 'bg-green-600 text-white' 
                        : 'text-gray-400 hover:text-white'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {view === 'month' ? 'Mes' : view === 'week' ? 'Semana' : 'Día'}
                  </motion.button>
                ))}
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <motion.button
                onClick={analyzeContentGaps}
                className="bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Lightbulb className="w-4 h-4" />
                Analizar Gaps
              </motion.button>
              
              <motion.button
                onClick={generateAISchedule}
                disabled={autoScheduling}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-gray-600 disabled:to-gray-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {autoScheduling ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    Programando...
                  </>
                ) : (
                  <>
                    <Brain className="w-4 h-4" />
                    Auto-Programar IA
                  </>
                )}
              </motion.button>
              
              <motion.button
                onClick={() => setShowEventModal(true)}
                className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Plus className="w-4 h-4" />
                Nuevo Evento
              </motion.button>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
            {/* Calendario Principal */}
            <div className="xl:col-span-3">
              <motion.div
                className="bg-gradient-to-br from-gray-800/50 to-gray-700/30 rounded-xl border border-gray-600/30 p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                {/* Header del Mes */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <motion.button
                      onClick={() => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1, 1))}
                      className="p-2 hover:bg-gray-600/50 rounded-lg transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <ArrowDown className="w-4 h-4 text-gray-400 rotate-90" />
                    </motion.button>
                    
                    <h3 className="text-xl font-bold text-white">
                      {selectedDate.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
                    </h3>
                    
                    <motion.button
                      onClick={() => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 1))}
                      className="p-2 hover:bg-gray-600/50 rounded-lg transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <ArrowUp className="w-4 h-4 text-gray-400 -rotate-90" />
                    </motion.button>
                  </div>
                  
                  <motion.button
                    onClick={() => setSelectedDate(new Date())}
                    className="text-blue-400 hover:text-blue-300 text-sm font-medium"
                    whileHover={{ scale: 1.05 }}
                  >
                    Hoy
                  </motion.button>
                </div>

                {/* Días de la Semana */}
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(day => (
                    <div key={day} className="text-center text-gray-400 text-sm font-medium py-2">
                      {day}
                    </div>
                  ))}
                </div>

                {/* Días del Mes */}
                <div className="grid grid-cols-7 gap-1">
                  {/* Días vacíos del mes anterior */}
                  {Array.from({ length: getFirstDayOfMonth(selectedDate) }, (_, i) => (
                    <div key={`empty-${i}`} className="h-24"></div>
                  ))}
                  
                  {/* Días del mes actual */}
                  {Array.from({ length: getDaysInMonth(selectedDate) }, (_, i) => {
                    const day = i + 1;
                    const currentDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), day);
                    const events = getEventsForDate(currentDate);
                    const isToday = currentDate.toDateString() === new Date().toDateString();
                    
                    return (
                      <motion.div
                        key={day}
                        className={`h-24 border border-gray-600/30 rounded-lg p-1 cursor-pointer transition-all hover:border-gray-500/50 ${
                          isToday ? 'bg-blue-500/10 border-blue-500/50' : 'hover:bg-gray-700/30'
                        }`}
                        whileHover={{ scale: 1.02 }}
                        onClick={() => setSelectedDate(currentDate)}
                      >
                        <div className={`text-sm font-medium mb-1 ${
                          isToday ? 'text-blue-400' : 'text-white'
                        }`}>
                          {day}
                        </div>
                        
                        <div className="space-y-1">
                          {events.slice(0, 2).map(event => (
                            <motion.div
                              key={event.id}
                              className={`text-xs px-1 py-0.5 rounded truncate cursor-pointer ${
                                event.status === 'scheduled' ? 'bg-green-500/20 text-green-400' :
                                event.status === 'draft' ? 'bg-yellow-500/20 text-yellow-400' :
                                'bg-blue-500/20 text-blue-400'
                              }`}
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedEvent(event);
                                setShowEventModal(true);
                              }}
                              whileHover={{ scale: 1.05 }}
                            >
                              {event.title}
                            </motion.div>
                          ))}
                          {events.length > 2 && (
                            <div className="text-xs text-gray-400">+{events.length - 2} más</div>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            </div>

            {/* Panel Lateral */}
            <div className="space-y-6">
              {/* Eventos del Día Seleccionado */}
              <motion.div
                className="bg-gradient-to-br from-gray-800/50 to-gray-700/30 rounded-xl border border-gray-600/30 p-4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <h4 className="text-white font-bold mb-4 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-green-400" />
                  {selectedDate.toLocaleDateString('es-ES', { day: 'numeric', month: 'long' })}
                </h4>
                
                <div className="space-y-2">
                  {getEventsForDate(selectedDate).length === 0 ? (
                    <p className="text-gray-400 text-sm">No hay eventos programados</p>
                  ) : (
                    getEventsForDate(selectedDate).map(event => (
                      <motion.div
                        key={event.id}
                        className="p-3 bg-gray-700/30 rounded-lg cursor-pointer hover:bg-gray-600/30 transition-colors"
                        onClick={() => {
                          setSelectedEvent(event);
                          setShowEventModal(true);
                        }}
                        whileHover={{ scale: 1.02 }}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-white font-medium text-sm">{event.title}</span>
                          {event.aiGenerated && (
                            <span className="text-xs px-1 py-0.5 bg-cyan-500/20 text-cyan-400 rounded">IA</span>
                          )}
                        </div>
                        <div className="text-xs text-gray-400">
                          {event.platform} • {new Date(event.date).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              </motion.div>

              {/* Sugerencias de IA */}
              {aiSuggestions.length > 0 && (
                <motion.div
                  className="bg-gradient-to-br from-yellow-900/20 to-orange-900/20 rounded-xl border border-yellow-500/30 p-4"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  <h4 className="text-yellow-400 font-bold mb-4 flex items-center gap-2">
                    <Lightbulb className="w-4 h-4" />
                    Sugerencias IA
                  </h4>
                  
                  <div className="space-y-3">
                    {aiSuggestions.map((suggestion, index) => (
                      <motion.div
                        key={index}
                        className="p-3 bg-yellow-500/10 rounded-lg"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-yellow-200 font-medium text-sm">{suggestion.platform}</span>
                          <span className={`text-xs px-1 py-0.5 rounded ${
                            suggestion.priority === 'high' ? 'bg-red-500/20 text-red-400' :
                            'bg-yellow-500/20 text-yellow-400'
                          }`}>
                            {suggestion.priority === 'high' ? 'Alta' : 'Media'}
                          </span>
                        </div>
                        <p className="text-yellow-200/80 text-xs mb-2">{suggestion.gap}</p>
                        <p className="text-yellow-100 text-xs font-medium">{suggestion.suggestion}</p>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Estadísticas Rápidas */}
              <motion.div
                className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 rounded-xl border border-purple-500/30 p-4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <h4 className="text-purple-400 font-bold mb-4 flex items-center gap-2">
                  <BarChart3 className="w-4 h-4" />
                  Estadísticas del Mes
                </h4>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400 text-sm">Eventos programados:</span>
                    <span className="text-white font-bold">{calendarEvents.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400 text-sm">Generados por IA:</span>
                    <span className="text-cyan-400 font-bold">
                      {calendarEvents.filter(e => e.aiGenerated).length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400 text-sm">Alcance estimado:</span>
                    <span className="text-green-400 font-bold">
                      {calendarEvents.reduce((sum, e) => sum + parseInt(e.estimatedReach.replace('K', '000')), 0) / 1000}K
                    </span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      )}

      {/* 🔍 ANÁLISIS DE COMPETENCIA AUTOMATIZADO */}
      {activeView === 'analytics' && (
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          {/* Header del Análisis */}
          <motion.div
            className="flex items-center justify-between mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-4">
              <h2 className="text-2xl font-bold text-white">Análisis de Competencia</h2>
              <span className="text-gray-400 text-sm">
                Última actualización: {new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            
            <div className="flex items-center gap-3">
              <motion.button
                onClick={runBenchmarkAnalysis}
                disabled={analyzingCompetitor}
                className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 disabled:from-gray-600 disabled:to-gray-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {analyzingCompetitor ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    Analizando...
                  </>
                ) : (
                  <>
                    <BarChart3 className="w-4 h-4" />
                    Actualizar Benchmark
                  </>
                )}
              </motion.button>
              
              <motion.button
                className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Plus className="w-4 h-4" />
                Añadir Competidor
              </motion.button>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Lista de Competidores */}
            <div className="xl:col-span-2 space-y-4">
              <motion.div
                className="bg-gradient-to-br from-gray-800/50 to-gray-700/30 rounded-xl border border-gray-600/30 p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-400" />
                  Competidores Monitoreados
                </h3>
                
                <div className="space-y-4">
                  {competitors.map((competitor, index) => (
                    <motion.div
                      key={competitor.id}
                      className="bg-gray-700/30 rounded-lg p-4 hover:bg-gray-600/30 transition-all"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-bold text-sm">
                              {competitor.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                            </span>
                          </div>
                          <div>
                            <h4 className="text-white font-bold">{competitor.name}</h4>
                            <p className="text-gray-400 text-sm">{competitor.industry}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <span className={`text-xs px-2 py-1 rounded-full font-medium ${getThreatColor(competitor.threat)}`}>
                            Amenaza {getThreatLabel(competitor.threat)}
                          </span>
                          <motion.button
                            onClick={() => analyzeCompetitor(competitor.id)}
                            disabled={analyzingCompetitor}
                            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white px-3 py-1 rounded-lg text-sm font-medium"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            Analizar
                          </motion.button>
                        </div>
                      </div>
                      
                      {/* Métricas del Competidor */}
                      <div className="grid grid-cols-3 gap-4 mb-3">
                        <div className="text-center">
                          <div className="text-lg font-bold text-blue-400">
                            {(competitor.followers.linkedin / 1000).toFixed(0)}K
                          </div>
                          <div className="text-xs text-gray-400">LinkedIn</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-cyan-400">
                            {(competitor.followers.twitter / 1000).toFixed(0)}K
                          </div>
                          <div className="text-xs text-gray-400">Twitter</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-pink-400">
                            {(competitor.followers.instagram / 1000).toFixed(0)}K
                          </div>
                          <div className="text-xs text-gray-400">Instagram</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="text-sm">
                            <span className="text-gray-400">Engagement: </span>
                            <span className="text-green-400 font-bold">
                              {((competitor.engagement.linkedin + competitor.engagement.twitter + competitor.engagement.instagram) / 3).toFixed(1)}%
                            </span>
                          </div>
                          <div className="text-sm">
                            <span className="text-gray-400">Crecimiento: </span>
                            <span className="text-green-400 font-bold">{competitor.growth}</span>
                          </div>
                        </div>
                        <div className="text-xs text-gray-400">
                          Último análisis: {competitor.lastAnalysis.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                      
                      {/* Top Content */}
                      <div className="mt-3 pt-3 border-t border-gray-600/30">
                        <div className="text-xs text-gray-400 mb-1">Contenido principal:</div>
                        <div className="flex flex-wrap gap-1">
                          {competitor.topContent.map((topic, i) => (
                            <span key={i} className="text-xs px-2 py-1 bg-purple-500/20 text-purple-400 rounded">
                              {topic}
                            </span>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Análisis Detallado */}
              {competitorAnalysis && (
                <motion.div
                  className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 rounded-xl border border-purple-500/30 p-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  <h3 className="text-xl font-bold text-purple-400 mb-6 flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Análisis Detallado: {competitorAnalysis.competitor.name}
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Fortalezas */}
                    <div>
                      <h4 className="text-green-400 font-bold mb-3 flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" />
                        Fortalezas
                      </h4>
                      <div className="space-y-2">
                        {competitorAnalysis.strengths.map((strength, i) => (
                          <motion.div
                            key={i}
                            className="text-sm text-gray-300 bg-green-500/10 p-2 rounded"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                          >
                            {strength}
                          </motion.div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Debilidades */}
                    <div>
                      <h4 className="text-red-400 font-bold mb-3 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4" />
                        Debilidades
                      </h4>
                      <div className="space-y-2">
                        {competitorAnalysis.weaknesses.map((weakness, i) => (
                          <motion.div
                            key={i}
                            className="text-sm text-gray-300 bg-red-500/10 p-2 rounded"
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                          >
                            {weakness}
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  {/* Estrategia de Contenido */}
                  <div className="mt-6 p-4 bg-blue-500/10 rounded-lg">
                    <h4 className="text-blue-400 font-bold mb-3">Estrategia de Contenido</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-400">Frecuencia: </span>
                        <span className="text-white">{competitorAnalysis.contentStrategy.frequency}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Score: </span>
                        <span className="text-green-400 font-bold">{competitorAnalysis.score}/100</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Recomendaciones */}
                  <div className="mt-4">
                    <h4 className="text-yellow-400 font-bold mb-3 flex items-center gap-2">
                      <Lightbulb className="w-4 h-4" />
                      Recomendaciones para Superarlos
                    </h4>
                    <div className="space-y-2">
                      {competitorAnalysis.recommendations.map((rec, i) => (
                        <motion.div
                          key={i}
                          className="text-sm text-gray-300 bg-yellow-500/10 p-2 rounded flex items-center gap-2"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.1 }}
                        >
                          <ArrowUp className="w-3 h-3 text-yellow-400" />
                          {rec}
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Panel de Benchmark */}
            <div className="space-y-6">
              {/* Métricas de Benchmark */}
              <motion.div
                className="bg-gradient-to-br from-cyan-900/20 to-blue-900/20 rounded-xl border border-cyan-500/30 p-4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <h4 className="text-cyan-400 font-bold mb-4 flex items-center gap-2">
                  <BarChart3 className="w-4 h-4" />
                  Benchmark del Sector
                </h4>
                
                <div className="space-y-4">
                  <div className="text-center p-3 bg-cyan-500/10 rounded-lg">
                    <div className="text-2xl font-bold text-cyan-400">{benchmarkData.avgEngagement}%</div>
                    <div className="text-xs text-gray-400">Engagement Promedio</div>
                  </div>
                  
                  <div className="text-center p-3 bg-green-500/10 rounded-lg">
                    <div className="text-2xl font-bold text-green-400">+{benchmarkData.avgGrowth}%</div>
                    <div className="text-xs text-gray-400">Crecimiento Promedio</div>
                  </div>
                </div>
              </motion.div>

              {/* Top Hashtags */}
              <motion.div
                className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 rounded-xl border border-purple-500/30 p-4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <h4 className="text-purple-400 font-bold mb-4 flex items-center gap-2">
                  <Hash className="w-4 h-4" />
                  Hashtags Trending
                </h4>
                
                <div className="space-y-2">
                  {benchmarkData.topHashtags.map((hashtag, i) => (
                    <motion.div
                      key={i}
                      className="flex items-center justify-between p-2 bg-purple-500/10 rounded"
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <span className="text-purple-300 text-sm">{hashtag}</span>
                      <span className="text-xs text-gray-400">#{i + 1}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Oportunidades */}
              <motion.div
                className="bg-gradient-to-br from-green-900/20 to-emerald-900/20 rounded-xl border border-green-500/30 p-4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <h4 className="text-green-400 font-bold mb-4 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Oportunidades Detectadas
                </h4>
                
                <div className="space-y-2">
                  {benchmarkData.opportunities.map((opportunity, i) => (
                    <motion.div
                      key={i}
                      className="text-sm text-green-300 bg-green-500/10 p-2 rounded"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                    >
                      {opportunity}
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Content Gaps */}
              <motion.div
                className="bg-gradient-to-br from-orange-900/20 to-red-900/20 rounded-xl border border-orange-500/30 p-4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <h4 className="text-orange-400 font-bold mb-4 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  Gaps de Contenido
                </h4>
                
                <div className="space-y-2">
                  {benchmarkData.contentGaps.map((gap, i) => (
                    <motion.div
                      key={i}
                      className="text-sm text-orange-300 bg-orange-500/10 p-2 rounded"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                    >
                      {gap}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      )}

      {/* 🤖 MODAL GENERADOR DE ESTRATEGIAS IA */}
      <AnimatePresence>
        {showStrategyGenerator && (
          <motion.div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowStrategyGenerator(false)}
          >
            <motion.div
              className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border border-gray-600/50 max-w-6xl w-full max-h-[90vh] overflow-hidden"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header del Modal */}
              <div className="flex items-center justify-between p-6 border-b border-gray-600/50">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-xl flex items-center justify-center">
                    <Brain className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Generador de Estrategias IA</h2>
                    <p className="text-gray-400">Crea estrategias personalizadas con inteligencia artificial</p>
                  </div>
                </div>
                
                <motion.button
                  onClick={() => setShowStrategyGenerator(false)}
                  className="p-2 hover:bg-gray-700/50 rounded-lg transition-colors text-gray-400 hover:text-white"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>

              <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                {!generatedStrategy ? (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Formulario de Estrategia */}
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                          <Target className="w-5 h-5 text-cyan-400" />
                          Configuración de Estrategia
                        </h3>
                        
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Industria</label>
                            <select
                              value={strategyForm.industry}
                              onChange={(e) => setStrategyForm({...strategyForm, industry: e.target.value})}
                              className="w-full bg-gray-700/50 border border-gray-600/50 rounded-lg px-3 py-2 text-white"
                            >
                              <option value="">Selecciona una industria</option>
                              <option value="technology">Tecnología</option>
                              <option value="fashion">Moda</option>
                              <option value="software">Software/SaaS</option>
                              <option value="healthcare">Salud</option>
                              <option value="finance">Finanzas</option>
                              <option value="education">Educación</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Nicho Específico</label>
                            <input
                              type="text"
                              value={strategyForm.niche}
                              onChange={(e) => setStrategyForm({...strategyForm, niche: e.target.value})}
                              placeholder="ej: IA para empresas, moda sostenible..."
                              className="w-full bg-gray-700/50 border border-gray-600/50 rounded-lg px-3 py-2 text-white placeholder-gray-400"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Objetivo Principal</label>
                            <select
                              value={strategyForm.objective}
                              onChange={(e) => setStrategyForm({...strategyForm, objective: e.target.value})}
                              className="w-full bg-gray-700/50 border border-gray-600/50 rounded-lg px-3 py-2 text-white"
                            >
                              <option value="">Selecciona un objetivo</option>
                              <option value="brand-awareness">Aumentar reconocimiento de marca</option>
                              <option value="lead-generation">Generar leads</option>
                              <option value="sales">Incrementar ventas</option>
                              <option value="engagement">Mejorar engagement</option>
                              <option value="traffic">Aumentar tráfico web</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Audiencia Objetivo</label>
                            <input
                              type="text"
                              value={strategyForm.targetAudience}
                              onChange={(e) => setStrategyForm({...strategyForm, targetAudience: e.target.value})}
                              placeholder="ej: Millennials profesionales, CTOs de startups..."
                              className="w-full bg-gray-700/50 border border-gray-600/50 rounded-lg px-3 py-2 text-white placeholder-gray-400"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-300 mb-2">Presupuesto</label>
                              <select
                                value={strategyForm.budget}
                                onChange={(e) => setStrategyForm({...strategyForm, budget: e.target.value})}
                                className="w-full bg-gray-700/50 border border-gray-600/50 rounded-lg px-3 py-2 text-white"
                              >
                                <option value="">Selecciona presupuesto</option>
                                <option value="low">$1K - $5K</option>
                                <option value="medium">$5K - $20K</option>
                                <option value="high">$20K - $50K</option>
                                <option value="enterprise">$50K+</option>
                              </select>
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-300 mb-2">Duración</label>
                              <select
                                value={strategyForm.timeframe}
                                onChange={(e) => setStrategyForm({...strategyForm, timeframe: e.target.value})}
                                className="w-full bg-gray-700/50 border border-gray-600/50 rounded-lg px-3 py-2 text-white"
                              >
                                <option value="">Selecciona duración</option>
                                <option value="1-month">1 mes</option>
                                <option value="3-months">3 meses</option>
                                <option value="6-months">6 meses</option>
                                <option value="12-months">12 meses</option>
                              </select>
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Plataformas</label>
                            <div className="grid grid-cols-3 gap-2">
                              {['Instagram', 'TikTok', 'LinkedIn', 'Twitter', 'YouTube', 'Facebook'].map(platform => (
                                <label key={platform} className="flex items-center gap-2 text-sm text-gray-300">
                                  <input
                                    type="checkbox"
                                    checked={strategyForm.platforms.includes(platform)}
                                    onChange={(e) => {
                                      if (e.target.checked) {
                                        setStrategyForm({
                                          ...strategyForm,
                                          platforms: [...strategyForm.platforms, platform]
                                        });
                                      } else {
                                        setStrategyForm({
                                          ...strategyForm,
                                          platforms: strategyForm.platforms.filter(p => p !== platform)
                                        });
                                      }
                                    }}
                                    className="rounded border-gray-600 bg-gray-700 text-cyan-500"
                                  />
                                  {platform}
                                </label>
                              ))}
                            </div>
                          </div>

                          <motion.button
                            onClick={generateAIStrategy}
                            disabled={!strategyForm.industry || !strategyForm.objective || generatingStrategy}
                            className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-700 text-white px-6 py-3 rounded-lg font-medium flex items-center justify-center gap-2"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            {generatingStrategy ? (
                              <>
                                <Loader className="w-5 h-5 animate-spin" />
                                Generando Estrategia...
                              </>
                            ) : (
                              <>
                                <Sparkles className="w-5 h-5" />
                                Generar Estrategia con IA
                              </>
                            )}
                          </motion.button>
                        </div>
                      </div>
                    </div>

                    {/* Sistema de Templates Expandido */}
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                          <Layers className="w-5 h-5 text-purple-400" />
                          Biblioteca de Templates
                        </h3>
                        
                        {/* Filtros y Búsqueda */}
                        <div className="mb-6 space-y-4">
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={templateSearch}
                              onChange={(e) => setTemplateSearch(e.target.value)}
                              placeholder="Buscar templates..."
                              className="flex-1 bg-gray-700/50 border border-gray-600/50 rounded-lg px-3 py-2 text-white placeholder-gray-400 text-sm"
                            />
                            <motion.button
                              className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded-lg text-sm font-medium"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <Plus className="w-4 h-4" />
                            </motion.button>
                          </div>
                          
                          <div className="flex flex-wrap gap-2">
                            {templateCategories.map(category => (
                              <motion.button
                                key={category}
                                onClick={() => setSelectedCategory(category)}
                                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                                  selectedCategory === category
                                    ? 'bg-purple-600 text-white'
                                    : 'bg-gray-700/50 text-gray-400 hover:text-white'
                                }`}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                {category}
                              </motion.button>
                            ))}
                          </div>
                        </div>
                        
                        <div className="space-y-4 max-h-96 overflow-y-auto custom-scrollbar">
                          {getFilteredTemplates().map((template, index) => (
                            <motion.div
                              key={template.id}
                              className="bg-gradient-to-br from-gray-800/50 to-gray-700/30 p-4 rounded-xl border border-gray-600/30 hover:border-gray-500/50 transition-all"
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.05 }}
                              whileHover={{ scale: 1.01 }}
                            >
                              <div className="flex items-start justify-between mb-3">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <h4 className="text-white font-bold text-sm">{template.name}</h4>
                                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getDifficultyColor(template.difficulty)}`}>
                                      {template.difficulty}
                                    </span>
                                  </div>
                                  <p className="text-gray-400 text-xs mb-2">{template.description}</p>
                                  
                                  {/* Tags */}
                                  <div className="flex flex-wrap gap-1 mb-2">
                                    {template.tags.map(tag => (
                                      <span key={tag} className="text-xs px-1.5 py-0.5 bg-purple-500/20 text-purple-400 rounded">
                                        {tag}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                                
                                <div className="flex items-center gap-1 ml-2">
                                  <motion.button
                                    onClick={() => duplicateTemplate(template.id)}
                                    className="p-1 hover:bg-gray-600/50 rounded text-gray-400 hover:text-white"
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    title="Duplicar template"
                                  >
                                    <Copy className="w-3 h-3" />
                                  </motion.button>
                                  <motion.button
                                    onClick={() => applyTemplate(template)}
                                    className="bg-purple-600 hover:bg-purple-700 text-white px-2 py-1 rounded text-xs font-medium"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                  >
                                    Usar
                                  </motion.button>
                                </div>
                              </div>
                              
                              <div className="grid grid-cols-3 gap-3 mb-3">
                                <div className="text-center">
                                  <div className="text-sm font-bold text-green-400">{template.estimatedROI}</div>
                                  <div className="text-xs text-gray-400">ROI</div>
                                </div>
                                <div className="text-center">
                                  <div className="text-sm font-bold text-blue-400">{template.actions}</div>
                                  <div className="text-xs text-gray-400">Acciones</div>
                                </div>
                                <div className="text-center">
                                  <div className="text-sm font-bold text-purple-400">{template.duration}</div>
                                  <div className="text-xs text-gray-400">Duración</div>
                                </div>
                              </div>
                              
                              {/* Preview del Timeline */}
                              <div className="bg-gray-700/30 rounded-lg p-2">
                                <div className="text-xs text-gray-400 mb-1">Preview del plan:</div>
                                <div className="space-y-1">
                                  {Object.entries(template.preview).map(([week, activity]) => (
                                    <div key={week} className="flex items-center gap-2">
                                      <span className="text-xs text-purple-400 font-medium min-w-[50px]">
                                        {week.replace('week', 'Sem')}:
                                      </span>
                                      <span className="text-xs text-gray-300">{activity}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                              
                              <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-600/30">
                                <div className="flex flex-wrap gap-1">
                                  {template.platforms.slice(0, 3).map(platform => (
                                    <span key={platform} className="text-xs px-1.5 py-0.5 bg-gray-600/30 text-gray-300 rounded">
                                      {platform}
                                    </span>
                                  ))}
                                  {template.platforms.length > 3 && (
                                    <span className="text-xs text-gray-400">+{template.platforms.length - 3}</span>
                                  )}
                                </div>
                                <span className="text-xs text-gray-400">{template.category}</span>
                              </div>
                            </motion.div>
                          ))}
                          
                          {getFilteredTemplates().length === 0 && (
                            <div className="text-center py-8">
                              <div className="text-gray-400 mb-2">No se encontraron templates</div>
                              <div className="text-gray-500 text-sm">Prueba con otros filtros o términos de búsqueda</div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Resultado de la Estrategia Generada */
                  <div className="space-y-6">
                    <div className="text-center mb-6">
                      <motion.div
                        className="w-16 h-16 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200 }}
                      >
                        <CheckCircle className="w-8 h-8 text-white" />
                      </motion.div>
                      <h3 className="text-2xl font-bold text-white mb-2">¡Estrategia Generada!</h3>
                      <p className="text-gray-400">Tu estrategia personalizada está lista para implementar</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Resumen de la Estrategia */}
                      <div className="bg-gradient-to-br from-cyan-900/20 to-blue-900/20 p-6 rounded-xl border border-cyan-500/30">
                        <h4 className="text-cyan-400 font-bold text-lg mb-4 flex items-center gap-2">
                          <Target className="w-5 h-5" />
                          {generatedStrategy.title}
                        </h4>
                        
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-gray-400">ROI Estimado:</span>
                            <span className="text-green-400 font-bold">{generatedStrategy.estimatedROI}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Confianza IA:</span>
                            <span className="text-blue-400 font-bold">{generatedStrategy.confidence}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Duración:</span>
                            <span className="text-white font-bold">{generatedStrategy.timeframe}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Acciones:</span>
                            <span className="text-purple-400 font-bold">{generatedStrategy.actions.length}</span>
                          </div>
                        </div>
                      </div>

                      {/* KPIs Predichos */}
                      <div className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 p-6 rounded-xl border border-purple-500/30">
                        <h4 className="text-purple-400 font-bold text-lg mb-4 flex items-center gap-2">
                          <BarChart3 className="w-5 h-5" />
                          KPIs Objetivo
                        </h4>
                        
                        <div className="space-y-3">
                          {generatedStrategy.kpis.map((kpi, index) => (
                            <div key={index} className="flex justify-between">
                              <span className="text-gray-400">{kpi.metric}:</span>
                              <span className="text-white font-bold">{kpi.target}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Insights de IA */}
                    <div className="bg-gradient-to-br from-gray-800/50 to-gray-700/30 p-6 rounded-xl border border-gray-600/30">
                      <h4 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                        <Lightbulb className="w-5 h-5 text-yellow-400" />
                        Insights de IA
                      </h4>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {generatedStrategy.insights.map((insight, index) => (
                          <motion.div
                            key={index}
                            className="bg-yellow-500/10 border border-yellow-500/30 p-3 rounded-lg"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                          >
                            <p className="text-yellow-200 text-sm">{insight}</p>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    {/* Acciones Generadas */}
                    <div className="bg-gradient-to-br from-gray-800/50 to-gray-700/30 p-6 rounded-xl border border-gray-600/30">
                      <h4 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                        <Rocket className="w-5 h-5 text-green-400" />
                        Acciones Recomendadas
                      </h4>
                      
                      <div className="space-y-3">
                        {generatedStrategy.actions.map((action, index) => (
                          <motion.div
                            key={action.id}
                            className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                                action.type === 'content' ? 'bg-blue-500/20' :
                                action.type === 'campaign' ? 'bg-purple-500/20' :
                                'bg-green-500/20'
                              }`}>
                                {action.type === 'content' && <FileText className="w-4 h-4 text-blue-400" />}
                                {action.type === 'campaign' && <Megaphone className="w-4 h-4 text-purple-400" />}
                                {action.type === 'event' && <Calendar className="w-4 h-4 text-green-400" />}
                              </div>
                              <div>
                                <div className="text-white font-medium">{action.title}</div>
                                <div className="text-gray-400 text-sm">{action.platform} • {action.estimatedReach} alcance</div>
                              </div>
                            </div>
                            <div className="text-green-400 font-bold">{action.confidence}%</div>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    {/* Botones de Acción */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-600/50">
                      <motion.button
                        onClick={() => setGeneratedStrategy(null)}
                        className="btn-secondary"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Generar Nueva
                      </motion.button>
                      
                      <div className="flex items-center gap-3">
                        <motion.button
                          className="btn-ghost flex items-center gap-2"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Download className="w-4 h-4" />
                          Exportar PDF
                        </motion.button>
                        
                        <motion.button
                          onClick={implementStrategy}
                          className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 py-2 rounded-lg font-medium flex items-center gap-2"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <CheckCircle className="w-4 h-4" />
                          Implementar Estrategia
                        </motion.button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PredictiveActionsModule;
