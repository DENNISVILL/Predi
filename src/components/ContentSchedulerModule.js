import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCountry } from './CountrySelector';
import { getCalendarRecommendations } from '../services/openaiService';

// Calendar 10/10 Components
import CalendarView from './calendar/CalendarView';
import PerformanceDashboard from './calendar/PerformanceDashboard';
import PostPreviewModal from './calendar/PostPreviewModal';
import BulkUploadModal from './calendar/BulkUploadModal';
import TemplateLibrary from './calendar/TemplateLibrary';

// Componentes SVG para logos de redes sociales
const TikTokLogo = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-.88-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43V7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.43z" />
  </svg>
);

const InstagramLogo = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
  </svg>
);

const YouTubeLogo = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

const FacebookLogo = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const LinkedInLogo = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);
import {
  Calendar,
  Clock,
  Send,
  Edit3,
  Trash2,
  Play,
  Pause,
  BarChart3,
  Target,
  Globe,
  Users,
  Zap,
  CheckCircle,
  AlertCircle,
  Plus,
  Filter,
  Download,
  Upload,
  Settings,
  Eye,
  TrendingUp,
  MessageSquare,
  Heart,
  Share2,
  Repeat,
  ChevronLeft,
  ChevronRight,
  Save,
  Copy,
  X,
  Check
} from 'lucide-react';
import useStore from '../store/useStore';

const ContentSchedulerModule = ({ onNavigateToCreate, scheduledReminders = [], onUpdateReminders }) => {
  const { theme } = useStore();
  const { countryData, selectedCountry } = useCountry();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('calendar'); // calendar, list, analytics
  const [scheduledPosts, setScheduledPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState(null);
  const [aiRecommendations, setAiRecommendations] = useState('');
  const [filters, setFilters] = useState({
    platform: 'all',
    status: 'all',
    niche: 'all',
    country: 'all'
  });

  // Calendar 10/10 Estados
  const [showPerformanceView, setShowPerformanceView] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showBulkUpload, setShowBulkUpload] = useState(false);
  const [showTemplateLibrary, setShowTemplateLibrary] = useState(false);
  const [previewPost, setPreviewPost] = useState(null);

  const formatAiMarkdown = (text) => {
    if (!text) return '';
    let escaped = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    escaped = escaped.replace(/\*\*(.+?)\*\*/g, '<strong>$1<\/strong>');
    escaped = escaped.replace(/`([^`]+)`/g, '<code>$1<\/code>');
    escaped = escaped.replace(/\n/g, '<br />');

    return escaped;
  };
  // Calendar 10/10 Handlers
  const handlePostMove = (postId, newDate) => {
    setScheduledPosts(prev => prev.map(post =>
      post.id === postId
        ? { ...post, scheduledDate: newDate, date: newDate }
        : post
    ));
  };
  const handlePostClick = (post) => {
    setPreviewPost(post);
    setShowPreviewModal(true);
  };
  const handleBulkImport = (posts) => {
    setScheduledPosts(prev => [...prev, ...posts]);
  };
  const handleApplyTemplate = (posts) => {
    // Reemplazamos la estrategia actual con el nuevo template para evitar mezcla de nichos
    setScheduledPosts(posts);
  };
  const handleDeletePost = (postId) => {
    setScheduledPosts(prev => prev.filter(p => p.id !== postId));
  };
  const handleEditPost = (post) => {
    setSelectedPost(post);
    setShowPreviewModal(false);
  };
  const handleDuplicatePost = (post) => {
    const newPost = {
      ...post,
      id: `dup_${Date.now()}`,
      title: `${post.title} (Copia)`,
      status: 'pending'
    };
    setScheduledPosts(prev => [...prev, newPost]);
  };
  // Festividades específicas por país
  const getCountryFestivals = () => {
    const currentYear = new Date().getFullYear();
    const festivals = {
      'ES': [
        { name: 'Día de Reyes', date: new Date(currentYear, 0, 6), emoji: '👑', type: 'nacional' },
        { name: 'San Valentín', date: new Date(currentYear, 1, 14), emoji: '💕', type: 'comercial' },
        { name: 'Día del Padre', date: new Date(currentYear, 2, 19), emoji: '👨‍👧‍👦', type: 'familiar' },
        { name: 'Semana Santa', date: new Date(currentYear, 3, 9), emoji: '✝️', type: 'religioso' },
        { name: 'Día del Trabajo', date: new Date(currentYear, 4, 1), emoji: '⚒️', type: 'nacional' },
        { name: 'San Juan', date: new Date(currentYear, 5, 24), emoji: '🔥', type: 'tradicional' },
        { name: 'Santiago Apóstol', date: new Date(currentYear, 6, 25), emoji: '⛪', type: 'religioso' },
        { name: 'Asunción', date: new Date(currentYear, 7, 15), emoji: '🙏', type: 'religioso' },
        { name: 'Día de la Hispanidad', date: new Date(currentYear, 9, 12), emoji: '🇪🇸', type: 'nacional' },
        { name: 'Todos los Santos', date: new Date(currentYear, 10, 1), emoji: '👼', type: 'religioso' },
        { name: 'Constitución', date: new Date(currentYear, 11, 6), emoji: '📜', type: 'nacional' },
        { name: 'Navidad', date: new Date(currentYear, 11, 25), emoji: '🎄', type: 'religioso' }
      ],
      'MX': [
        { name: 'Año Nuevo', date: new Date(currentYear, 0, 1), emoji: '🎊', type: 'nacional' },
        { name: 'Día de la Candelaria', date: new Date(currentYear, 1, 2), emoji: '🕯️', type: 'religioso' },
        { name: 'Día de la Bandera', date: new Date(currentYear, 1, 24), emoji: '🇲🇽', type: 'nacional' },
        { name: 'Día de la Constitución', date: new Date(currentYear, 1, 5), emoji: '📜', type: 'nacional' },
        { name: 'Natalicio de Benito Juárez', date: new Date(currentYear, 2, 21), emoji: '👨‍⚖️', type: 'nacional' },
        { name: 'Semana Santa', date: new Date(currentYear, 3, 9), emoji: '✝️', type: 'religioso' },
        { name: 'Día del Trabajo', date: new Date(currentYear, 4, 1), emoji: '⚒️', type: 'nacional' },
        { name: 'Cinco de Mayo', date: new Date(currentYear, 4, 5), emoji: '🎉', type: 'nacional' },
        { name: 'Día de las Madres', date: new Date(currentYear, 4, 10), emoji: '👩‍👧‍👦', type: 'familiar' },
        { name: 'Independencia', date: new Date(currentYear, 8, 16), emoji: '🇲🇽', type: 'nacional' },
        { name: 'Día de Muertos', date: new Date(currentYear, 10, 2), emoji: '💀', type: 'tradicional' },
        { name: 'Revolución Mexicana', date: new Date(currentYear, 10, 20), emoji: '⚔️', type: 'nacional' },
        { name: 'Navidad', date: new Date(currentYear, 11, 25), emoji: '🎄', type: 'religioso' }
      ],
      'CO': [
        { name: 'Año Nuevo', date: new Date(currentYear, 0, 1), emoji: '🎊', type: 'nacional' },
        { name: 'Reyes Magos', date: new Date(currentYear, 0, 8), emoji: '👑', type: 'religioso' },
        { name: 'San José', date: new Date(currentYear, 2, 20), emoji: '⛪', type: 'religioso' },
        { name: 'Semana Santa', date: new Date(currentYear, 3, 9), emoji: '✝️', type: 'religioso' },
        { name: 'Día del Trabajo', date: new Date(currentYear, 4, 1), emoji: '⚒️', type: 'nacional' },
        { name: 'Ascensión', date: new Date(currentYear, 4, 22), emoji: '☁️', type: 'religioso' },
        { name: 'Corpus Christi', date: new Date(currentYear, 5, 12), emoji: '🍞', type: 'religioso' },
        { name: 'Sagrado Corazón', date: new Date(currentYear, 5, 19), emoji: '❤️', type: 'religioso' },
        { name: 'San Pedro y San Pablo', date: new Date(currentYear, 5, 3), emoji: '⛪', type: 'religioso' },
        { name: 'Independencia', date: new Date(currentYear, 6, 20), emoji: '🇨🇴', type: 'nacional' },
        { name: 'Batalla de Boyacá', date: new Date(currentYear, 7, 7), emoji: '⚔️', type: 'nacional' },
        { name: 'Asunción', date: new Date(currentYear, 7, 21), emoji: '🙏', type: 'religioso' },
        { name: 'Día de la Raza', date: new Date(currentYear, 9, 16), emoji: '🌎', type: 'nacional' },
        { name: 'Todos los Santos', date: new Date(currentYear, 10, 6), emoji: '👼', type: 'religioso' },
        { name: 'Independencia de Cartagena', date: new Date(currentYear, 10, 13), emoji: '🏰', type: 'nacional' },
        { name: 'Inmaculada Concepción', date: new Date(currentYear, 11, 8), emoji: '👸', type: 'religioso' },
        { name: 'Navidad', date: new Date(currentYear, 11, 25), emoji: '🎄', type: 'religioso' }
      ]
      // Agregar más países según sea necesario
    };

    // ===== Funciones de analítica para el Calendario =====

    // Engagement rate por post (devuelve número entre 0 y 1)
    const getPostEngagementRate = (post) => {
      const interactions = (post.likes || 0) + (post.comments || 0) + (post.shares || 0) + (post.saves || 0);
      const reach = post.reach || post.estimatedReach || 0;
      if (!reach || reach <= 0) return 0;
      return interactions / reach;
    };

    const getSafeAverage = (values) => {
      const valid = values.filter(v => typeof v === 'number' && !isNaN(v));
      if (!valid.length) return 0;
      return valid.reduce((acc, v) => acc + v, 0) / valid.length;
    };

    const getCalendarAnalytics = () => {
      if (!scheduledPosts || !scheduledPosts.length) {
        return {
          totalScheduled: 0,
          totalReach: 0,
          avgEngagementRate: 0,
          avgCtr: 0,
          followerGrowth: 0,
          successRate: 0,
          avgViralScore: 0,
          topPosts: []
        };
      }

      const totalScheduled = scheduledPosts.filter(p => p.status === 'scheduled' || p.status === 'pending').length;
      const totalReach = scheduledPosts.reduce((acc, post) => acc + (post.reach || post.estimatedReach || 0), 0);

      const engagementRates = scheduledPosts.map(getPostEngagementRate);
      const ctrValues = scheduledPosts.map(post => {
        const clicks = post.clicks || 0;
        const reach = post.reach || post.estimatedReach || 0;
        if (!reach || reach <= 0) return 0;
        return clicks / reach;
      });

      const followerGrowth = scheduledPosts.reduce((acc, post) => {
        if (typeof post.followersBefore === 'number' && typeof post.followersAfter === 'number') {
          return acc + (post.followersAfter - post.followersBefore);
        }
        return acc;
      }, 0);

      const published = scheduledPosts.filter(p => p.status === 'published').length;
      const successRate = scheduledPosts.length ? (published / scheduledPosts.length) * 100 : 0;

      const avgViralScore = getSafeAverage(scheduledPosts.map(p => p.viralScore || 0));

      // Top posts por engagement rate
      const topPosts = [...scheduledPosts]
        .map(post => ({ post, er: getPostEngagementRate(post) }))
        .sort((a, b) => b.er - a.er)
        .slice(0, 5)
        .map(item => item.post);

      return {
        totalScheduled,
        totalReach,
        avgEngagementRate: getSafeAverage(engagementRates) * 100,
        avgCtr: getSafeAverage(ctrValues) * 100,
        followerGrowth,
        successRate,
        avgViralScore,
        topPosts
      };
    };

    return festivals[selectedCountry] || festivals['MX']; // México por defecto
  };

  // Horarios óptimos específicos por país
  const getCountrySchedules = () => {
    const schedules = {
      'ES': {
        name: 'España',
        flag: '🇪🇸',
        timezone: 'CET (UTC+1)',
        morning: '08:00 - 10:00',
        afternoon: '14:00 - 16:00',
        evening: '21:00 - 23:00',
        peak: '22:00-24:00',
        contentTypes: {
          comida: { breakfast: '07:00 - 09:00', lunch: '13:00 - 15:00', dinner: '20:00 - 22:00' },
          fashion: { outfit: '08:00 - 10:00', looks: '18:00 - 20:00', weekend: 'Sábados 17:00' },
          fitness: { morning: '06:00 - 08:00', motivation: '17:00 - 19:00', night: '19:00 - 21:00' },
          tech: { tips: '07:00 - 09:00', tutorials: '15:00 - 17:00', reviews: '20:00 - 22:00' }
        }
      },
      'MX': {
        name: 'México',
        flag: '🇲🇽',
        timezone: 'CST (UTC-6)',
        morning: '08:00 - 10:00',
        afternoon: '19:00 - 21:00',
        evening: '22:00 - 24:00',
        peak: '21:00-23:00',
        contentTypes: {
          comida: { desayuno: '07:00 - 09:00', almuerzo: '11:30 - 13:30', cena: '18:00 - 20:00' },
          fashion: { outfit: '08:00 - 10:00', looks: '18:00 - 20:00', weekend: 'Viernes 17:00' },
          fitness: { rutina: '06:00 - 08:00', motivación: '17:00 - 19:00', noche: '19:00 - 21:00' },
          tech: { tips: '07:00 - 09:00', tutoriales: '15:00 - 17:00', reviews: '20:00 - 22:00' }
        }
      },
      'CO': {
        name: 'Colombia',
        flag: '🇨🇴',
        timezone: 'COT (UTC-5)',
        morning: '06:00 - 08:00',
        afternoon: '18:00 - 20:00',
        evening: '21:00 - 23:00',
        peak: '20:00-22:00',
        contentTypes: {
          comida: { desayuno: '06:00 - 08:00', almuerzo: '12:00 - 14:00', cena: '18:00 - 20:00' },
          fashion: { outfit: '07:00 - 09:00', looks: '17:00 - 19:00', weekend: 'Viernes 16:00' },
          fitness: { rutina: '05:00 - 07:00', motivación: '16:00 - 18:00', noche: '18:00 - 20:00' },
          tech: { tips: '06:00 - 08:00', tutoriales: '14:00 - 16:00', reviews: '19:00 - 21:00' }
        }
      },
      'AR': {
        name: 'Argentina',
        flag: '🇦🇷',
        timezone: 'ART (UTC-3)',
        morning: '08:00 - 10:00',
        afternoon: '18:30 - 20:00',
        evening: '21:00 - 23:00',
        peak: '20:00-22:00',
        contentTypes: {
          comida: { desayuno: '08:00 - 10:00', almuerzo: '12:30 - 14:30', cena: '20:00 - 22:00' },
          fashion: { outfit: '09:00 - 11:00', looks: '19:00 - 21:00', weekend: 'Sábados 18:00' },
          fitness: { rutina: '07:00 - 09:00', motivación: '18:00 - 20:00', noche: '20:00 - 22:00' },
          tech: { tips: '08:00 - 10:00', tutoriales: '16:00 - 18:00', reviews: '21:00 - 23:00' }
        }
      },
      'PE': {
        name: 'Perú',
        flag: '🇵🇪',
        timezone: 'PET (UTC-5)',
        morning: '07:00 - 09:00',
        afternoon: '18:00 - 20:00',
        evening: '20:00 - 22:00',
        peak: '19:00-21:00',
        contentTypes: {
          comida: { desayuno: '07:00 - 09:00', almuerzo: '12:00 - 14:00', cena: '18:00 - 20:00' },
          fashion: { outfit: '08:00 - 10:00', looks: '17:00 - 19:00', weekend: 'Domingos 16:00' },
          fitness: { rutina: '06:00 - 08:00', motivación: '17:00 - 19:00', noche: '19:00 - 21:00' },
          tech: { tips: '07:00 - 09:00', tutoriales: '15:00 - 17:00', reviews: '20:00 - 22:00' }
        }
      },
      'EC': {
        name: 'Ecuador',
        flag: '🇪🇨',
        timezone: 'ECT (UTC-5)',
        morning: '07:00 - 09:00',
        afternoon: '17:00 - 19:00',
        evening: '20:00 - 22:00',
        peak: '19:00-21:00',
        contentTypes: {
          comida: { desayuno: '07:00 - 09:00', almuerzo: '12:00 - 14:00', cena: '18:00 - 20:00' },
          fashion: { outfit: '08:00 - 10:00', looks: '17:00 - 19:00', weekend: 'Viernes 17:00' },
          fitness: { rutina: '06:00 - 08:00', motivación: '17:00 - 19:00', noche: '19:00 - 21:00' },
          tech: { tips: '07:00 - 09:00', tutoriales: '15:00 - 17:00', reviews: '20:00 - 22:00' }
        }
      },
      'CL': {
        name: 'Chile',
        flag: '🇨🇱',
        timezone: 'CLT (UTC-4)',
        morning: '08:00 - 10:00',
        afternoon: '18:00 - 20:00',
        evening: '21:00 - 23:00',
        peak: '20:00-22:00',
        contentTypes: {
          comida: { desayuno: '08:00 - 10:00', almuerzo: '13:00 - 15:00', cena: '19:00 - 21:00' },
          fashion: { outfit: '09:00 - 11:00', looks: '18:00 - 20:00', weekend: 'Sábados 17:00' },
          fitness: { rutina: '07:00 - 09:00', motivación: '18:00 - 20:00', noche: '20:00 - 22:00' },
          tech: { tips: '08:00 - 10:00', tutoriales: '16:00 - 18:00', reviews: '21:00 - 23:00' }
        }
      },
      'VE': {
        name: 'Venezuela',
        flag: '🇻🇪',
        timezone: 'VET (UTC-4)',
        morning: '07:00 - 09:00',
        afternoon: '17:00 - 19:00',
        evening: '20:00 - 22:00',
        peak: '19:00-21:00',
        contentTypes: {
          comida: { desayuno: '07:00 - 09:00', almuerzo: '12:00 - 14:00', cena: '18:00 - 20:00' },
          fashion: { outfit: '08:00 - 10:00', looks: '17:00 - 19:00', weekend: 'Domingos 16:00' },
          fitness: { rutina: '06:00 - 08:00', motivación: '17:00 - 19:00', noche: '19:00 - 21:00' },
          tech: { tips: '07:00 - 09:00', tutoriales: '15:00 - 17:00', reviews: '20:00 - 22:00' }
        }
      }
    };

    return schedules[selectedCountry] || schedules['MX']; // México por defecto
  };

  // Sistema de optimización inteligente de horarios
  const [audienceData, setAudienceData] = useState({
    demographics: {
      age: { '18-24': 35, '25-34': 40, '35-44': 20, '45+': 5 },
      location: { 'Ecuador': 45, 'Colombia': 30, 'Mexico': 15, 'Others': 10 },
      gender: { 'Female': 58, 'Male': 42 }
    },
    engagement: {
      tiktok: {
        peak_hours: [19, 20, 21],
        engagement_by_hour: {
          6: 12, 7: 18, 8: 25, 9: 35, 10: 45, 11: 55, 12: 65,
          13: 70, 14: 75, 15: 80, 16: 85, 17: 88, 18: 92, 19: 98,
          20: 100, 21: 95, 22: 85, 23: 70, 0: 45, 1: 25, 2: 15, 3: 10
        },
        best_days: ['Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        timezone_offset: -5 // Ecuador timezone
      },
      instagram: {
        peak_hours: [11, 12, 19, 20],
        engagement_by_hour: {
          6: 15, 7: 22, 8: 30, 9: 45, 10: 60, 11: 85, 12: 90,
          13: 75, 14: 65, 15: 70, 16: 75, 17: 80, 18: 85, 19: 95,
          20: 92, 21: 80, 22: 65, 23: 45, 0: 30, 1: 20, 2: 12, 3: 8
        },
        best_days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        timezone_offset: -5
      },
      youtube: {
        peak_hours: [14, 15, 16, 20, 21],
        engagement_by_hour: {
          6: 8, 7: 12, 8: 18, 9: 25, 10: 35, 11: 45, 12: 55,
          13: 65, 14: 85, 15: 90, 16: 88, 17: 75, 18: 70, 19: 75,
          20: 95, 21: 100, 22: 85, 23: 65, 0: 35, 1: 20, 2: 12, 3: 8
        },
        best_days: ['Tuesday', 'Wednesday', 'Thursday', 'Saturday', 'Sunday'],
        timezone_offset: -5
      }
    }
  });

  // Función para optimizar horarios basado en audiencia
  const optimizeSchedulingTime = (platform, niche, contentType) => {
    const platformData = audienceData.engagement[platform.toLowerCase()];
    if (!platformData) return { hour: 19, confidence: 70, reason: 'Default optimal time' };

    // Obtener hora actual y calcular mejor momento
    const currentHour = new Date().getHours();
    const engagementData = platformData.engagement_by_hour;

    // Encontrar las 3 mejores horas
    const sortedHours = Object.entries(engagementData)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3);

    // Seleccionar la mejor hora disponible (no en el pasado)
    let bestHour = sortedHours[0];
    for (let [hour, engagement] of sortedHours) {
      if (parseInt(hour) > currentHour) {
        bestHour = [hour, engagement];
        break;
      }
    }

    // Ajustar por nicho
    const nicheMultipliers = {
      food: { 11: 1.2, 12: 1.3, 13: 1.2, 19: 1.1, 20: 1.1 },
      fitness: { 6: 1.3, 7: 1.2, 18: 1.1, 19: 1.1, 20: 1.1 },
      fashion: { 10: 1.1, 11: 1.1, 18: 1.2, 19: 1.3, 20: 1.2 },
      tech: { 9: 1.1, 14: 1.2, 15: 1.2, 16: 1.1, 21: 1.1 }
    };

    const multiplier = nicheMultipliers[niche]?.[bestHour[0]] || 1;
    const optimizedEngagement = bestHour[1] * multiplier;

    return {
      hour: parseInt(bestHour[0]),
      confidence: Math.min(optimizedEngagement, 100),
      reason: `Peak engagement (${optimizedEngagement.toFixed(0)}%) for ${niche} on ${platform}`,
      expectedIncrease: `+${((optimizedEngagement - 70) * 4).toFixed(0)}%`,
      audienceActive: `${Math.floor(optimizedEngagement * 0.8)}% of your audience`
    };
  };

  // Función para generar calendario optimizado por IA
  const generateOptimizedCalendar = (days = 7) => {
    const calendar = [];
    const platforms = ['tiktok', 'instagram', 'youtube'];
    const niches = ['food', 'fitness', 'fashion', 'tech'];

    for (let day = 0; day < days; day++) {
      const date = new Date();
      date.setDate(date.getDate() + day);

      // 2-3 posts por día optimizados
      const postsPerDay = Math.floor(Math.random() * 2) + 2;

      for (let post = 0; post < postsPerDay; post++) {
        const platform = platforms[Math.floor(Math.random() * platforms.length)];
        const niche = niches[Math.floor(Math.random() * niches.length)];
        const optimization = optimizeSchedulingTime(platform, niche, 'post');

        date.setHours(optimization.hour, Math.floor(Math.random() * 60), 0, 0);

        calendar.push({
          id: `opt_${day}_${post}`,
          date: new Date(date),
          platform,
          niche,
          optimization,
          title: `${niche.charAt(0).toUpperCase() + niche.slice(1)} content for ${platform}`,
          estimatedReach: Math.floor(optimization.confidence * 500 + Math.random() * 10000),
          viralScore: Math.floor(optimization.confidence * 0.9 + Math.random() * 10)
        });
      }
    }

    return calendar.sort((a, b) => a.date - b.date);
  };

  // Sistema de hashtags trending en tiempo real
  const [trendingHashtags, setTrendingHashtags] = useState({
    global: {
      hot: [
        { tag: '#AITrend', growth: '+340%', uses: '2.1M', platforms: ['tiktok', 'instagram'] },
        { tag: '#ViralChallenge', growth: '+287%', uses: '1.8M', platforms: ['tiktok'] },
        { tag: '#ContentCreator', growth: '+234%', uses: '3.2M', platforms: ['instagram', 'youtube'] },
        { tag: '#TrendingNow', growth: '+198%', uses: '1.5M', platforms: ['tiktok', 'instagram'] },
        { tag: '#DigitalMarketing', growth: '+167%', uses: '890K', platforms: ['instagram', 'youtube'] }
      ],
      rising: [
        { tag: '#FutureOfContent', growth: '+89%', uses: '456K', platforms: ['youtube'] },
        { tag: '#CreatorEconomy', growth: '+76%', uses: '234K', platforms: ['instagram'] },
        { tag: '#SocialMediaTips', growth: '+65%', uses: '567K', platforms: ['tiktok', 'instagram'] }
      ]
    },
    byCountry: {
      ecuador: [
        { tag: '#EcuadorContent', growth: '+234%', uses: '89K', platforms: ['tiktok', 'instagram'] },
        { tag: '#QuitoVibes', growth: '+189%', uses: '56K', platforms: ['instagram'] },
        { tag: '#EcuadorianCreator', growth: '+156%', uses: '34K', platforms: ['tiktok'] },
        { tag: '#MitadDelMundo', growth: '+134%', uses: '67K', platforms: ['instagram', 'youtube'] }
      ],
      colombia: [
        { tag: '#ColombiaContent', growth: '+267%', uses: '156K', platforms: ['tiktok', 'instagram'] },
        { tag: '#BogotaVibes', growth: '+198%', uses: '89K', platforms: ['instagram'] },
        { tag: '#CreadorColombiano', growth: '+167%', uses: '78K', platforms: ['tiktok'] }
      ],
      mexico: [
        { tag: '#MexicoContent', growth: '+298%', uses: '234K', platforms: ['tiktok', 'instagram'] },
        { tag: '#CDMXVibes', growth: '+234%', uses: '123K', platforms: ['instagram'] },
        { tag: '#CreadorMexicano', growth: '+189%', uses: '145K', platforms: ['tiktok'] }
      ]
    },
    byNiche: {
      food: [
        { tag: '#FoodieLife', growth: '+234%', uses: '1.2M', platforms: ['instagram', 'tiktok'] },
        { tag: '#RecipeOfTheDay', growth: '+189%', uses: '890K', platforms: ['instagram'] },
        { tag: '#FoodHacks', growth: '+167%', uses: '567K', platforms: ['tiktok'] },
        { tag: '#HealthyEating', growth: '+145%', uses: '1.1M', platforms: ['instagram', 'youtube'] },
        { tag: '#CookingTips', growth: '+123%', uses: '456K', platforms: ['youtube', 'instagram'] }
      ],
      fitness: [
        { tag: '#FitnessMotivation', growth: '+267%', uses: '1.8M', platforms: ['tiktok', 'instagram'] },
        { tag: '#WorkoutChallenge', growth: '+234%', uses: '1.3M', platforms: ['tiktok'] },
        { tag: '#FitnessJourney', growth: '+198%', uses: '1.1M', platforms: ['instagram'] },
        { tag: '#HealthyLifestyle', growth: '+167%', uses: '890K', platforms: ['instagram', 'youtube'] },
        { tag: '#GymLife', growth: '+145%', uses: '678K', platforms: ['tiktok', 'instagram'] }
      ],
      fashion: [
        { tag: '#OOTD', growth: '+198%', uses: '2.1M', platforms: ['instagram', 'tiktok'] },
        { tag: '#StyleInspo', growth: '+167%', uses: '1.5M', platforms: ['instagram'] },
        { tag: '#FashionTrends', growth: '+145%', uses: '1.2M', platforms: ['tiktok', 'instagram'] },
        { tag: '#OutfitTransition', growth: '+234%', uses: '890K', platforms: ['tiktok'] },
        { tag: '#FashionHaul', growth: '+123%', uses: '567K', platforms: ['youtube', 'instagram'] }
      ],
      tech: [
        { tag: '#TechTips', growth: '+189%', uses: '678K', platforms: ['youtube', 'instagram'] },
        { tag: '#AITools', growth: '+267%', uses: '456K', platforms: ['tiktok', 'instagram'] },
        { tag: '#TechReview', growth: '+145%', uses: '789K', platforms: ['youtube'] },
        { tag: '#DigitalTrends', growth: '+123%', uses: '345K', platforms: ['instagram', 'youtube'] },
        { tag: '#TechHacks', growth: '+167%', uses: '234K', platforms: ['tiktok'] }
      ]
    },
    byPlatform: {
      tiktok: [
        { tag: '#TikTokMadeMe', growth: '+345%', uses: '3.4M', viral_potential: 95 },
        { tag: '#ForYouPage', growth: '+234%', uses: '2.8M', viral_potential: 92 },
        { tag: '#TikTokChallenge', growth: '+198%', uses: '2.1M', viral_potential: 89 },
        { tag: '#ViralDance', growth: '+167%', uses: '1.9M', viral_potential: 87 },
        { tag: '#TikTokTrend', growth: '+145%', uses: '1.6M', viral_potential: 85 }
      ],
      instagram: [
        { tag: '#InstagramReels', growth: '+234%', uses: '2.3M', viral_potential: 88 },
        { tag: '#IGTrending', growth: '+198%', uses: '1.8M', viral_potential: 85 },
        { tag: '#ReelsInstagram', growth: '+167%', uses: '1.5M', viral_potential: 83 },
        { tag: '#InstagramTips', growth: '+145%', uses: '1.2M', viral_potential: 80 },
        { tag: '#IGInfluencer', growth: '+123%', uses: '890K', viral_potential: 78 }
      ],
      youtube: [
        { tag: '#YouTubeShorts', growth: '+189%', uses: '1.1M', viral_potential: 82 },
        { tag: '#YouTubeTrending', growth: '+156%', uses: '890K', viral_potential: 79 },
        { tag: '#YouTubeCreator', growth: '+134%', uses: '678K', viral_potential: 76 },
        { tag: '#ShortsVideo', growth: '+123%', uses: '567K', viral_potential: 74 },
        { tag: '#YouTubeTips', growth: '+112%', uses: '456K', viral_potential: 72 }
      ]
    }
  });

  // Función para generar hashtags inteligentes
  const generateSmartHashtags = (niche, platform, country = 'global', contentType = 'post') => {
    const suggestions = [];

    // Hashtags trending globales (2-3)
    const globalTrending = trendingHashtags.global.hot.slice(0, 3);
    suggestions.push(...globalTrending);

    // Hashtags por nicho (3-4)
    const nicheHashtags = trendingHashtags.byNiche[niche]?.slice(0, 4) || [];
    suggestions.push(...nicheHashtags);

    // Hashtags por plataforma (2-3)
    const platformHashtags = trendingHashtags.byPlatform[platform]?.slice(0, 3) || [];
    suggestions.push(...platformHashtags);

    // Hashtags por país (1-2)
    if (country !== 'global' && trendingHashtags.byCountry[country]) {
      const countryHashtags = trendingHashtags.byCountry[country].slice(0, 2);
      suggestions.push(...countryHashtags);
    }

    // Calcular score combinado
    const scoredHashtags = suggestions.map(hashtag => {
      const growthScore = parseInt(hashtag.growth.replace('+', '').replace('%', ''));
      const usesScore = parseFloat(hashtag.uses.replace('M', '000000').replace('K', '000'));
      const viralScore = hashtag.viral_potential || 75;

      const combinedScore = (growthScore * 0.4) + (Math.log10(usesScore) * 10) + (viralScore * 0.3);

      return {
        ...hashtag,
        score: Math.round(combinedScore),
        recommendation: combinedScore > 200 ? 'Must Use' : combinedScore > 150 ? 'Recommended' : 'Optional'
      };
    });

    // Ordenar por score y devolver top 10
    return scoredHashtags
      .sort((a, b) => b.score - a.score)
      .slice(0, 10)
      .map((hashtag, index) => ({
        ...hashtag,
        rank: index + 1,
        category: index < 3 ? 'trending' : index < 6 ? 'niche' : 'support'
      }));
  };

  // Función para actualizar hashtags trending (simula tiempo real)
  const updateTrendingHashtags = () => {
    // Simular cambios en tiempo real
    setTrendingHashtags(prev => {
      const updated = { ...prev };

      // Actualizar growth rates con variación
      Object.keys(updated).forEach(category => {
        if (typeof updated[category] === 'object' && updated[category] !== null) {
          Object.keys(updated[category]).forEach(subcategory => {
            if (Array.isArray(updated[category][subcategory])) {
              updated[category][subcategory] = updated[category][subcategory].map(hashtag => ({
                ...hashtag,
                growth: `+${Math.floor(Math.random() * 50 + parseInt(hashtag.growth.replace('+', '').replace('%', '')))}%`,
                uses: hashtag.uses // Mantener uses estable por ahora
              }));
            }
          });
        }
      });

      return updated;
    });
  };

  // Actualizar hashtags cada 30 segundos (simular tiempo real)
  useEffect(() => {
    const interval = setInterval(updateTrendingHashtags, 30000);
    return () => clearInterval(interval);
  }, []);

  // Sistema de predicción de viralidad antes de programar
  const predictViralityBeforeScheduling = (postData) => {
    const {
      content,
      hashtags = [],
      platform,
      niche,
      scheduledTime,
      mediaType = 'image',
      country = 'ecuador'
    } = postData;

    // Factores de análisis para predicción
    const factors = {
      content: analyzeContentFactors(content),
      hashtags: analyzeHashtagFactors(hashtags, platform, niche),
      timing: analyzeTimingFactors(scheduledTime, platform),
      platform: analyzePlatformFactors(platform, niche, mediaType),
      audience: analyzeAudienceFactors(country, niche),
      trend: analyzeTrendFactors(niche, platform)
    };

    // Calcular score viral combinado
    const viralScore = calculateBasicViralScore(factors);

    // Generar recomendaciones específicas
    const recommendations = generateBasicViralRecommendations(factors, viralScore);

    return {
      score: viralScore,
      confidence: Math.min(viralScore + Math.random() * 10, 100),
      factors,
      recommendations,
      prediction: {
        reach: estimateReach(viralScore, platform, niche),
        engagement: estimateEngagement(viralScore, platform),
        shares: estimateShares(viralScore, platform),
        timeToViral: estimateTimeToViral(viralScore),
        peakHours: estimatePeakHours(viralScore, platform)
      },
      riskFactors: identifyBasicRiskFactors(factors),
      optimizations: suggestOptimizations(factors, viralScore)
    };
  };

  // Análisis de factores de contenido
  const analyzeContentFactors = (content) => {
    const length = content.length;
    const hasEmojis = /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]/u.test(content);
    const hasQuestion = content.includes('?');
    const hasCallToAction = /\b(comenta|comparte|sigue|like|tag|menciona)\b/i.test(content);
    const hasNumbers = /\d/.test(content);
    const hasHook = content.split(' ').slice(0, 5).some(word =>
      ['secreto', 'increíble', 'viral', 'trending', 'nuevo', 'exclusivo'].includes(word.toLowerCase())
    );

    let score = 50; // Base score

    if (length >= 50 && length <= 150) score += 15; // Optimal length
    if (hasEmojis) score += 10;
    if (hasQuestion) score += 8;
    if (hasCallToAction) score += 12;
    if (hasNumbers) score += 5;
    if (hasHook) score += 15;

    return {
      score: Math.min(score, 100),
      details: {
        length: { value: length, optimal: length >= 50 && length <= 150 },
        emojis: hasEmojis,
        question: hasQuestion,
        callToAction: hasCallToAction,
        numbers: hasNumbers,
        hook: hasHook
      }
    };
  };

  // Análisis de factores de hashtags
  const analyzeHashtagFactors = (hashtags, platform, niche) => {
    if (!hashtags.length) return { score: 20, details: { count: 0, trending: 0, niche: 0 } };

    const trendingCount = hashtags.filter(tag =>
      trendingHashtags.global.hot.some(trending => trending.tag === tag) ||
      trendingHashtags.byPlatform[platform]?.some(trending => trending.tag === tag)
    ).length;

    const nicheCount = hashtags.filter(tag =>
      trendingHashtags.byNiche[niche]?.some(nicheTag => nicheTag.tag === tag)
    ).length;

    let score = 30; // Base score
    score += Math.min(hashtags.length * 5, 25); // Up to 5 hashtags
    score += trendingCount * 15; // Trending hashtags bonus
    score += nicheCount * 10; // Niche hashtags bonus

    return {
      score: Math.min(score, 100),
      details: {
        count: hashtags.length,
        trending: trendingCount,
        niche: nicheCount,
        optimal: hashtags.length >= 3 && hashtags.length <= 8
      }
    };
  };

  // Análisis de factores de timing
  const analyzeTimingFactors = (scheduledTime, platform) => {
    const hour = scheduledTime.getHours();
    const day = scheduledTime.getDay(); // 0 = Sunday
    const platformData = audienceData.engagement[platform.toLowerCase()];

    if (!platformData) return { score: 50, details: { hour, day, optimal: false } };

    const hourEngagement = platformData.engagement_by_hour[hour] || 50;
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const isOptimalDay = platformData.best_days.includes(dayNames[day]);

    let score = hourEngagement;
    if (isOptimalDay) score += 10;

    return {
      score: Math.min(score, 100),
      details: {
        hour,
        day: dayNames[day],
        hourEngagement,
        optimal: isOptimalDay && hourEngagement > 80
      }
    };
  };

  // Análisis de factores de plataforma
  const analyzePlatformFactors = (platform, niche, mediaType) => {
    const platformOptimal = {
      tiktok: { video: 95, image: 60, text: 40 },
      instagram: { image: 90, video: 85, text: 70 },
      youtube: { video: 100, image: 30, text: 50 }
    };

    const nicheOptimal = {
      tiktok: { fitness: 90, food: 85, fashion: 95, tech: 75 },
      instagram: { fitness: 85, food: 95, fashion: 100, tech: 80 },
      youtube: { fitness: 80, food: 75, fashion: 70, tech: 95 }
    };

    const mediaScore = platformOptimal[platform]?.[mediaType] || 70;
    const nicheScore = nicheOptimal[platform]?.[niche] || 70;

    return {
      score: Math.round((mediaScore + nicheScore) / 2),
      details: {
        mediaOptimal: mediaScore > 80,
        nicheOptimal: nicheScore > 80,
        mediaScore,
        nicheScore
      }
    };
  };

  // Análisis de factores de audiencia
  const analyzeAudienceFactors = (country, niche) => {
    const countryEngagement = {
      ecuador: { food: 90, fitness: 75, fashion: 80, tech: 70 },
      colombia: { food: 85, fitness: 85, fashion: 90, tech: 75 },
      mexico: { food: 80, fitness: 80, fashion: 85, tech: 80 }
    };

    const score = countryEngagement[country]?.[niche] || 70;

    return {
      score,
      details: {
        country,
        niche,
        optimal: score > 85
      }
    };
  };

  // Análisis de factores de tendencia
  const analyzeTrendFactors = (niche, platform) => {
    const currentTrends = trendingHashtags.byNiche[niche] || [];
    const platformTrends = trendingHashtags.byPlatform[platform] || [];

    const avgGrowth = [...currentTrends, ...platformTrends]
      .map(trend => parseInt(trend.growth.replace('+', '').replace('%', '')))
      .reduce((sum, growth, _, arr) => sum + growth / arr.length, 0);

    let score = 50 + (avgGrowth - 100) * 0.3; // Base + trend factor

    return {
      score: Math.max(0, Math.min(score, 100)),
      details: {
        avgGrowth: `+${Math.round(avgGrowth)}%`,
        trending: avgGrowth > 150
      }
    };
  };

  // Calcular score viral final
  const calculateBasicViralScore = (factors) => {
    const weights = {
      content: 0.25,
      hashtags: 0.20,
      timing: 0.20,
      platform: 0.15,
      audience: 0.10,
      trend: 0.10
    };

    const weightedScore = Object.entries(factors).reduce((total, [key, factor]) => {
      return total + (factor.score * weights[key]);
    }, 0);

    return Math.round(weightedScore);
  };

  // Generar recomendaciones para mejorar viralidad
  const generateBasicViralRecommendations = (factors, viralScore) => {
    const recommendations = [];

    if (factors.content.score < 70) {
      recommendations.push({
        type: 'content',
        priority: 'high',
        message: 'Mejora tu copy: añade emojis, hook fuerte y call-to-action',
        impact: '+15-25% viralidad'
      });
    }

    if (factors.hashtags.score < 60) {
      recommendations.push({
        type: 'hashtags',
        priority: 'high',
        message: 'Usa más hashtags trending y específicos del nicho',
        impact: '+20-30% alcance'
      });
    }

    if (factors.timing.score < 70) {
      recommendations.push({
        type: 'timing',
        priority: 'medium',
        message: 'Programa en horarios de mayor engagement de tu audiencia',
        impact: '+10-20% engagement'
      });
    }

    if (factors.platform.score < 75) {
      recommendations.push({
        type: 'platform',
        priority: 'medium',
        message: 'Adapta el formato de contenido para esta plataforma',
        impact: '+15-25% performance'
      });
    }

    return recommendations;
  };

  // Estimaciones de métricas
  const estimateReach = (viralScore, platform, niche) => {
    const baseReach = { tiktok: 5000, instagram: 3000, youtube: 2000 };
    const multiplier = viralScore / 50;
    return Math.round(baseReach[platform] * multiplier);
  };

  const estimateEngagement = (viralScore, platform) => {
    const baseEngagement = { tiktok: 8, instagram: 5, youtube: 12 };
    return Math.round(baseEngagement[platform] * (viralScore / 80));
  };

  const estimateShares = (viralScore, platform) => {
    const baseShares = { tiktok: 200, instagram: 100, youtube: 50 };
    return Math.round(baseShares[platform] * (viralScore / 70));
  };

  const estimateTimeToViral = (viralScore) => {
    if (viralScore > 90) return '2-4 horas';
    if (viralScore > 80) return '4-8 horas';
    if (viralScore > 70) return '8-24 horas';
    return '24-48 horas';
  };

  const estimatePeakHours = (viralScore, platform) => {
    const peakWindows = {
      tiktok: viralScore > 85 ? '19:00-21:00' : '20:00-22:00',
      instagram: viralScore > 85 ? '11:00-13:00, 19:00-21:00' : '12:00-14:00',
      youtube: viralScore > 85 ? '14:00-16:00, 20:00-22:00' : '15:00-17:00'
    };
    return peakWindows[platform] || '18:00-20:00';
  };

  const identifyBasicRiskFactors = (factors) => {
    const risks = [];

    if (factors.timing.score < 50) {
      risks.push('Horario de baja audiencia activa');
    }

    if (factors.hashtags.details.trending === 0) {
      risks.push('Sin hashtags trending actuales');
    }

    if (factors.content.details.length < 30) {
      risks.push('Contenido muy corto para engagement');
    }

    return risks;
  };

  const suggestOptimizations = (factors, viralScore) => {
    const optimizations = [];

    if (viralScore < 80) {
      optimizations.push('Añadir música trending del nicho');
      optimizations.push('Incluir elementos visuales llamativos');
      optimizations.push('Crear variaciones A/B del contenido');
    }

    if (factors.hashtags.score < 70) {
      optimizations.push('Usar hashtags con 100K-1M usos');
      optimizations.push('Combinar hashtags trending + nicho + locales');
    }

    return optimizations;
  };

  // Sistema de auto-ajuste de contenido según performance
  const [performanceTracking, setPerformanceTracking] = useState({
    posts: {},
    patterns: {
      successful: [],
      failed: [],
      trending: []
    },
    learnings: {
      bestTimes: {},
      bestHashtags: [],
      bestContentTypes: {},
      audiencePreferences: {}
    }
  });

  // Función para auto-ajustar contenido basado en performance
  const autoAdjustContent = (postId, performanceData) => {
    const {
      actualReach,
      actualEngagement,
      actualShares,
      timeToViral,
      platform,
      niche,
      originalContent
    } = performanceData;

    // Calcular performance score
    const performanceScore = calculatePerformanceScore(performanceData);

    // Analizar patrones de éxito/fallo
    const patterns = analyzePerformancePatterns(performanceData, performanceScore);

    // Generar ajustes automáticos
    const adjustments = generateAutoAdjustments(patterns, originalContent, platform, niche);

    // Actualizar aprendizajes del sistema
    updateSystemLearnings(patterns, performanceData);

    return {
      performanceScore,
      patterns,
      adjustments,
      nextPostRecommendations: generateNextPostRecommendations(patterns),
      autoOptimizations: generateAutoOptimizations(patterns, platform, niche)
    };
  };

  // Calcular score de performance real
  const calculatePerformanceScore = (data) => {
    const { actualReach, actualEngagement, actualShares, expectedReach, expectedEngagement } = data;

    const reachScore = Math.min((actualReach / expectedReach) * 100, 150);
    const engagementScore = Math.min((actualEngagement / expectedEngagement) * 100, 150);
    const sharesScore = actualShares > 100 ? Math.min(actualShares / 10, 100) : actualShares;

    return Math.round((reachScore * 0.4) + (engagementScore * 0.4) + (sharesScore * 0.2));
  };

  // Analizar patrones de performance
  const analyzePerformancePatterns = (data, score) => {
    const patterns = {
      success: score > 80,
      viral: score > 120,
      failed: score < 40,
      factors: {
        timing: analyzeTimingPattern(data),
        content: analyzeContentPattern(data),
        hashtags: analyzeHashtagPattern(data),
        audience: analyzeAudiencePattern(data)
      }
    };

    return patterns;
  };

  const analyzeTimingPattern = (data) => {
    const hour = new Date(data.publishTime).getHours();
    const day = new Date(data.publishTime).getDay();

    return {
      optimalHour: hour,
      optimalDay: day,
      recommendation: data.actualEngagement > data.expectedEngagement
        ? 'Mantener este horario'
        : 'Probar horarios alternativos'
    };
  };

  const analyzeContentPattern = (data) => {
    const { originalContent, actualEngagement } = data;
    const hasEmojis = /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]/u.test(originalContent);
    const hasQuestion = originalContent.includes('?');
    const length = originalContent.length;

    return {
      effectiveLength: length,
      effectiveEmojis: hasEmojis && actualEngagement > 5,
      effectiveQuestions: hasQuestion && actualEngagement > 5,
      recommendation: actualEngagement > 8
        ? 'Replicar este estilo de contenido'
        : 'Experimentar con formato diferente'
    };
  };

  const analyzeHashtagPattern = (data) => {
    const { hashtags, actualReach } = data;
    const trendingUsed = hashtags.filter(tag =>
      trendingHashtags.global.hot.some(trending => trending.tag === tag)
    );

    return {
      effectiveTrending: trendingUsed.length,
      totalUsed: hashtags.length,
      reachPerHashtag: Math.round(actualReach / hashtags.length),
      recommendation: actualReach > 10000
        ? 'Mantener estrategia de hashtags'
        : 'Usar más hashtags trending'
    };
  };

  const analyzeAudiencePattern = (data) => {
    const { platform, niche, actualEngagement, demographics } = data;

    return {
      platformEffectiveness: actualEngagement > 5 ? 'high' : 'low',
      nicheResonance: actualEngagement > 8 ? 'strong' : 'weak',
      audienceAlignment: demographics?.match > 70 ? 'aligned' : 'misaligned',
      recommendation: actualEngagement > 6
        ? 'Audiencia bien segmentada'
        : 'Refinar targeting de audiencia'
    };
  };

  // Generar ajustes automáticos
  const generateAutoAdjustments = (patterns, originalContent, platform, niche) => {
    const adjustments = [];

    if (patterns.failed) {
      // Ajustes para contenido que falló
      adjustments.push({
        type: 'content_rewrite',
        priority: 'high',
        action: 'Reescribir con hook más fuerte',
        newContent: generateImprovedContent(originalContent, niche),
        reason: 'Performance por debajo del 40%'
      });

      adjustments.push({
        type: 'timing_change',
        priority: 'high',
        action: 'Cambiar horario de publicación',
        newTiming: getOptimalTiming(platform, niche),
        reason: 'Horario actual no genera engagement'
      });

      adjustments.push({
        type: 'hashtag_optimization',
        priority: 'medium',
        action: 'Usar hashtags más trending',
        newHashtags: generateSmartHashtags(niche, platform, 'ecuador'),
        reason: 'Hashtags actuales no generan alcance'
      });
    }

    if (patterns.success && !patterns.viral) {
      // Ajustes para contenido exitoso pero no viral
      adjustments.push({
        type: 'viral_boost',
        priority: 'medium',
        action: 'Añadir elementos virales',
        suggestions: [
          'Incluir música trending',
          'Añadir call-to-action más fuerte',
          'Crear variación para otra plataforma'
        ],
        reason: 'Contenido exitoso con potencial viral'
      });
    }

    return adjustments;
  };

  // Generar contenido mejorado automáticamente
  const generateImprovedContent = (originalContent, niche) => {
    const improvements = {
      food: {
        hooks: ['🔥 El secreto que cambió todo:', '✨ Nadie te dirá esto pero:', '🤯 Esto te va a sorprender:'],
        ctas: ['👇 Comenta si lo intentarías', '❤️ Guarda para más recetas', '📤 Comparte con quien lo necesite']
      },
      fitness: {
        hooks: ['💪 La transformación que todos quieren:', '⚡ En 30 días logré esto:', '🔥 El método que funciona:'],
        ctas: ['💬 ¿Cuál es tu meta?', '🔥 Guarda para tu rutina', '📤 Etiqueta a tu compañero de gym']
      },
      fashion: {
        hooks: ['👗 El outfit que está rompiendo:', '✨ Así combiné estas piezas:', '🔥 El look que todos copian:'],
        ctas: ['💭 ¿Te gusta este estilo?', '📌 Guarda para inspiración', '📤 Comparte tu versión']
      }
    };

    const nicheData = improvements[niche] || improvements.food;
    const randomHook = nicheData.hooks[Math.floor(Math.random() * nicheData.hooks.length)];
    const randomCta = nicheData.ctas[Math.floor(Math.random() * nicheData.ctas.length)];

    return `${randomHook} ${originalContent.split(' ').slice(2).join(' ')} ${randomCta}`;
  };

  // Obtener timing óptimo basado en aprendizajes
  const getOptimalTiming = (platform, niche) => {
    const optimalHours = {
      tiktok: { food: [12, 19, 20], fitness: [6, 18, 19], fashion: [18, 19, 20] },
      instagram: { food: [11, 12, 19], fitness: [7, 18, 19], fashion: [10, 18, 19] },
      youtube: { food: [14, 20, 21], fitness: [6, 14, 20], fashion: [15, 19, 20] }
    };

    const hours = optimalHours[platform]?.[niche] || [19, 20, 21];
    const randomHour = hours[Math.floor(Math.random() * hours.length)];

    const nextDate = new Date();
    nextDate.setDate(nextDate.getDate() + 1);
    nextDate.setHours(randomHour, 0, 0, 0);

    return nextDate;
  };

  // Actualizar aprendizajes del sistema
  const updateSystemLearnings = (patterns, performanceData) => {
    setPerformanceTracking(prev => {
      const updated = { ...prev };

      // Actualizar patrones exitosos
      if (patterns.success) {
        updated.patterns.successful.push({
          content: performanceData.originalContent,
          hashtags: performanceData.hashtags,
          timing: performanceData.publishTime,
          platform: performanceData.platform,
          score: calculatePerformanceScore(performanceData)
        });
      }

      // Actualizar patrones fallidos
      if (patterns.failed) {
        updated.patterns.failed.push({
          content: performanceData.originalContent,
          hashtags: performanceData.hashtags,
          timing: performanceData.publishTime,
          platform: performanceData.platform,
          score: calculatePerformanceScore(performanceData)
        });
      }

      // Mantener solo los últimos 50 registros
      updated.patterns.successful = updated.patterns.successful.slice(-50);
      updated.patterns.failed = updated.patterns.failed.slice(-50);

      return updated;
    });
  };

  // Generar recomendaciones para próximos posts
  const generateNextPostRecommendations = (patterns) => {
    const recommendations = [];

    if (patterns.success) {
      recommendations.push({
        type: 'replicate_success',
        message: 'Replicar elementos exitosos en próximos posts',
        elements: ['Mismo estilo de contenido', 'Horario similar', 'Hashtags similares']
      });
    }

    if (patterns.factors.timing.recommendation.includes('Mantener')) {
      recommendations.push({
        type: 'timing_optimization',
        message: 'Mantener horario actual para próximas publicaciones',
        timing: patterns.factors.timing.optimalHour
      });
    }

    return recommendations;
  };

  // Generar optimizaciones automáticas
  const generateAutoOptimizations = (patterns, platform, niche) => {
    const optimizations = [];

    // Auto-optimización de hashtags
    if (patterns.factors.hashtags.reachPerHashtag < 1000) {
      optimizations.push({
        type: 'hashtag_auto_update',
        action: 'Actualizar hashtags automáticamente',
        newHashtags: generateSmartHashtags(niche, platform, 'ecuador').slice(0, 8),
        frequency: 'Cada 24 horas'
      });
    }

    // Auto-optimización de timing
    if (patterns.factors.timing.recommendation.includes('alternativos')) {
      optimizations.push({
        type: 'timing_auto_adjust',
        action: 'Ajustar horarios automáticamente',
        newTiming: getOptimalTiming(platform, niche),
        frequency: 'Cada post con bajo engagement'
      });
    }

    // Auto-optimización de contenido
    if (patterns.factors.content.recommendation.includes('diferente')) {
      optimizations.push({
        type: 'content_auto_variation',
        action: 'Crear variaciones automáticas del contenido',
        variations: ['Con más emojis', 'Con pregunta', 'Con CTA diferente'],
        frequency: 'A/B test automático'
      });
    }

    return optimizations;
  };

  // Simular auto-ajuste en tiempo real
  useEffect(() => {
    const interval = setInterval(() => {
      // Simular performance data de posts publicados
      const mockPerformanceData = {
        postId: Date.now(),
        actualReach: Math.floor(Math.random() * 20000) + 5000,
        actualEngagement: Math.floor(Math.random() * 15) + 2,
        actualShares: Math.floor(Math.random() * 500) + 50,
        expectedReach: 10000,
        expectedEngagement: 8,
        platform: 'tiktok',
        niche: 'food',
        originalContent: 'Contenido de prueba para análisis automático',
        hashtags: ['#food', '#viral', '#trending'],
        publishTime: new Date()
      };

      // Solo ejecutar auto-ajuste ocasionalmente
      if (Math.random() > 0.8) {
        const adjustmentResult = autoAdjustContent(mockPerformanceData.postId, mockPerformanceData);
        console.log('Auto-ajuste ejecutado:', adjustmentResult);
      }
    }, 60000); // Cada minuto

    return () => clearInterval(interval);
  }, []);

  // NIVEL 2 - AUTOMATIZACIÓN TOTAL
  // Sistema de auto-scheduling basado en audiencia activa
  const [autoSchedulingEngine, setAutoSchedulingEngine] = useState({
    enabled: true,
    rules: {
      minAudienceActivity: 70, // % mínimo de audiencia activa
      maxPostsPerDay: 3,
      minHoursBetweenPosts: 4,
      preferredPlatforms: ['tiktok', 'instagram', 'youtube'],
      contentDistribution: { tiktok: 40, instagram: 35, youtube: 25 }
    },
    queue: [],
    activeMonitoring: true
  });

  // Función principal de auto-scheduling
  const executeAutoScheduling = (contentPool) => {
    if (!autoSchedulingEngine.enabled) return [];

    const scheduledPosts = [];
    const currentTime = new Date();

    // Analizar próximas 72 horas para scheduling óptimo
    for (let hour = 0; hour < 72; hour++) {
      const targetTime = new Date(currentTime.getTime() + (hour * 60 * 60 * 1000));
      const optimalSlots = findOptimalTimeSlots(targetTime);

      optimalSlots.forEach(slot => {
        if (scheduledPosts.length < autoSchedulingEngine.rules.maxPostsPerDay * 3) {
          const content = selectOptimalContent(contentPool, slot);
          if (content) {
            const scheduledPost = createScheduledPost(content, slot);
            scheduledPosts.push(scheduledPost);
          }
        }
      });
    }

    return scheduledPosts.slice(0, 15); // Limitar a 15 posts programados
  };

  // Encontrar slots de tiempo óptimos
  const findOptimalTimeSlots = (targetDate) => {
    const hour = targetDate.getHours();
    const day = targetDate.getDay();
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    const optimalSlots = [];

    // Analizar cada plataforma
    Object.entries(audienceData.engagement).forEach(([platform, data]) => {
      const hourEngagement = data.engagement_by_hour[hour] || 0;
      const isOptimalDay = data.best_days.includes(dayNames[day]);

      // Solo programar si la audiencia está suficientemente activa
      if (hourEngagement >= autoSchedulingEngine.rules.minAudienceActivity) {
        optimalSlots.push({
          time: new Date(targetDate),
          platform,
          audienceActivity: hourEngagement,
          dayOptimal: isOptimalDay,
          score: hourEngagement + (isOptimalDay ? 10 : 0),
          confidence: Math.min(hourEngagement + 15, 100)
        });
      }
    });

    // Ordenar por score y retornar mejores slots
    return optimalSlots
      .sort((a, b) => b.score - a.score)
      .slice(0, 2); // Máximo 2 posts por hora
  };

  // Seleccionar contenido óptimo para el slot
  const selectOptimalContent = (contentPool, slot) => {
    if (!contentPool.length) return null;

    // Filtrar contenido apropiado para la plataforma
    const platformContent = contentPool.filter(content =>
      content.platforms.includes(slot.platform) || content.platforms.includes('all')
    );

    if (!platformContent.length) return null;

    // Seleccionar basado en score de viralidad predicho para el horario
    const scoredContent = platformContent.map(content => {
      const viralPrediction = predictViralityBeforeScheduling({
        content: content.text,
        hashtags: content.hashtags,
        platform: slot.platform,
        niche: content.niche,
        scheduledTime: slot.time,
        mediaType: content.mediaType,
        country: content.country || 'ecuador'
      });

      return {
        ...content,
        predictedScore: viralPrediction.score,
        slotCompatibility: calculateSlotCompatibility(content, slot)
      };
    });

    // Retornar el contenido con mejor score combinado
    return scoredContent
      .sort((a, b) => (b.predictedScore + b.slotCompatibility) - (a.predictedScore + a.slotCompatibility))[0];
  };

  // Calcular compatibilidad entre contenido y slot
  const calculateSlotCompatibility = (content, slot) => {
    let compatibility = 50; // Base score

    // Bonus por plataforma óptima
    const platformOptimal = {
      tiktok: ['video', 'short'],
      instagram: ['image', 'video', 'carousel'],
      youtube: ['video', 'long']
    };

    if (platformOptimal[slot.platform]?.includes(content.mediaType)) {
      compatibility += 20;
    }

    // Bonus por nicho y horario
    const nicheHourBonus = {
      food: { morning: [7, 8, 9], lunch: [11, 12, 13], dinner: [18, 19, 20] },
      fitness: { morning: [6, 7, 8], evening: [17, 18, 19, 20] },
      fashion: { morning: [9, 10, 11], evening: [18, 19, 20] }
    };

    const hour = slot.time.getHours();
    const nicheHours = nicheHourBonus[content.niche];
    if (nicheHours) {
      const isOptimalHour = Object.values(nicheHours).some(hours => hours.includes(hour));
      if (isOptimalHour) compatibility += 15;
    }

    // Bonus por actividad de audiencia
    if (slot.audienceActivity > 85) compatibility += 10;
    if (slot.dayOptimal) compatibility += 5;

    return Math.min(compatibility, 100);
  };

  // Crear post programado
  const createScheduledPost = (content, slot) => {
    return {
      id: `auto_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title: content.title || generateAutoTitle(content.text, content.niche),
      content: content.text,
      platform: slot.platform,
      niche: content.niche,
      scheduledDate: slot.time,
      status: 'auto_scheduled',
      hashtags: content.hashtags,
      estimatedReach: estimateReach(slot.confidence, slot.platform, content.niche),
      viralScore: slot.confidence,
      mediaType: content.mediaType,
      autoGenerated: true,
      slotScore: slot.score,
      audienceActivity: slot.audienceActivity,
      optimizations: {
        timing: 'Auto-optimized for peak audience activity',
        hashtags: 'Auto-selected trending hashtags',
        platform: `Optimized for ${slot.platform} algorithm`
      }
    };
  };

  // Generar título automático
  const generateAutoTitle = (content, niche) => {
    const titleTemplates = {
      food: ['Receta viral que está rompiendo', 'El secreto culinario que todos quieren', 'Plato trending que debes probar'],
      fitness: ['Rutina que está transformando vidas', 'Ejercicio viral de 5 minutos', 'Transformación que inspira'],
      fashion: ['Look que está rompiendo redes', 'Outfit viral del momento', 'Estilo que todos copian'],
      tech: ['Hack tecnológico viral', 'App que está cambiando todo', 'Trend tech que debes conocer']
    };

    const templates = titleTemplates[niche] || titleTemplates.food;
    return templates[Math.floor(Math.random() * templates.length)];
  };

  // Monitoreo en tiempo real de audiencia activa
  const [realTimeAudienceData, setRealTimeAudienceData] = useState({
    currentActivity: {},
    predictions: {},
    alerts: []
  });

  // Función para monitorear audiencia en tiempo real
  const monitorRealTimeAudience = () => {
    const currentHour = new Date().getHours();
    const currentActivity = {};

    // Simular datos en tiempo real para cada plataforma
    Object.keys(audienceData.engagement).forEach(platform => {
      const baseActivity = audienceData.engagement[platform].engagement_by_hour[currentHour] || 50;
      const variation = (Math.random() - 0.5) * 20; // Variación ±10%
      const currentLevel = Math.max(0, Math.min(100, baseActivity + variation));

      currentActivity[platform] = {
        level: Math.round(currentLevel),
        trend: variation > 0 ? 'increasing' : 'decreasing',
        optimal: currentLevel > autoSchedulingEngine.rules.minAudienceActivity,
        nextPeak: predictNextPeak(platform, currentHour)
      };
    });

    setRealTimeAudienceData(prev => ({
      ...prev,
      currentActivity,
      lastUpdate: new Date()
    }));

    // Generar alertas si hay oportunidades
    generateAudienceAlerts(currentActivity);
  };

  // Predecir próximo pico de audiencia
  const predictNextPeak = (platform, currentHour) => {
    const platformData = audienceData.engagement[platform];
    const peakHours = platformData.peak_hours;

    // Encontrar próxima hora pico
    let nextPeak = peakHours.find(hour => hour > currentHour);
    if (!nextPeak) {
      nextPeak = peakHours[0] + 24; // Próximo día
    }

    const hoursUntilPeak = nextPeak - currentHour;
    return {
      hour: nextPeak % 24,
      hoursUntil: hoursUntilPeak,
      expectedActivity: platformData.engagement_by_hour[nextPeak % 24] || 80
    };
  };

  // Generar alertas de audiencia
  const generateAudienceAlerts = (currentActivity) => {
    const alerts = [];

    Object.entries(currentActivity).forEach(([platform, data]) => {
      if (data.optimal && data.trend === 'increasing') {
        alerts.push({
          type: 'opportunity',
          platform,
          message: `Audiencia ${platform} muy activa (${data.level}%) y creciendo`,
          action: 'Publicar contenido ahora',
          priority: 'high',
          timestamp: new Date()
        });
      }

      if (data.nextPeak.hoursUntil <= 2) {
        alerts.push({
          type: 'upcoming_peak',
          platform,
          message: `Pico de audiencia en ${data.nextPeak.hoursUntil}h (${data.nextPeak.expectedActivity}%)`,
          action: 'Preparar contenido para programar',
          priority: 'medium',
          timestamp: new Date()
        });
      }
    });

    if (alerts.length > 0) {
      setRealTimeAudienceData(prev => ({
        ...prev,
        alerts: [...prev.alerts, ...alerts].slice(-10) // Mantener últimas 10 alertas
      }));
    }
  };

  // Ejecutar auto-scheduling cuando hay oportunidades
  const triggerOpportunityScheduling = () => {
    const opportunities = realTimeAudienceData.alerts.filter(alert =>
      alert.type === 'opportunity' && alert.priority === 'high'
    );

    if (opportunities.length > 0) {
      // Generar contenido automático para la oportunidad
      const opportunityContent = generateOpportunityContent(opportunities);
      const autoScheduled = executeAutoScheduling(opportunityContent);

      if (autoScheduled.length > 0) {
        setScheduledPosts(prev => [...prev, ...autoScheduled]);
        console.log(`Auto-scheduled ${autoScheduled.length} posts for opportunities`);
      }
    }
  };

  // Generar contenido para oportunidades
  const generateOpportunityContent = (opportunities) => {
    return opportunities.map(opportunity => ({
      text: `🔥 Contenido optimizado para ${opportunity.platform} - Audiencia ${realTimeAudienceData.currentActivity[opportunity.platform].level}% activa`,
      niche: 'general',
      platforms: [opportunity.platform],
      hashtags: generateSmartHashtags('general', opportunity.platform, 'ecuador').slice(0, 5).map(h => h.tag),
      mediaType: opportunity.platform === 'youtube' ? 'video' : 'image',
      priority: 'high',
      autoGenerated: true,
      opportunityTriggered: true
    }));
  };

  // Monitoreo automático cada 5 minutos
  useEffect(() => {
    if (autoSchedulingEngine.activeMonitoring) {
      const interval = setInterval(() => {
        monitorRealTimeAudience();
        triggerOpportunityScheduling();
      }, 300000); // Cada 5 minutos

      return () => clearInterval(interval);
    }
  }, [autoSchedulingEngine.activeMonitoring]);

  // Inicializar monitoreo
  useEffect(() => {
    monitorRealTimeAudience();
  }, []);

  // PUNTO 7: Cross-posting optimizado por plataforma
  const [crossPostingEngine, setCrossPostingEngine] = useState({
    enabled: true,
    rules: {
      maxPlatformsPerPost: 3,
      platformPriority: ['tiktok', 'instagram', 'youtube'],
      adaptationLevel: 'high', // low, medium, high
      timingStrategy: 'staggered', // simultaneous, staggered, optimized
      contentVariation: true
    },
    platformSpecs: {
      tiktok: {
        maxLength: 150,
        optimalHashtags: 5,
        preferredFormats: ['video', 'short'],
        tone: 'casual',
        features: ['trending_sounds', 'effects', 'challenges']
      },
      instagram: {
        maxLength: 2200,
        optimalHashtags: 8,
        preferredFormats: ['image', 'carousel', 'reel'],
        tone: 'aspirational',
        features: ['stories', 'highlights', 'shopping']
      },
      youtube: {
        maxLength: 5000,
        optimalHashtags: 3,
        preferredFormats: ['video', 'short'],
        tone: 'educational',
        features: ['thumbnails', 'chapters', 'descriptions']
      }
    }
  });

  // Función principal de cross-posting optimizado
  const executeCrossPosting = (originalPost) => {
    const {
      content,
      niche,
      hashtags,
      mediaType,
      targetPlatforms = ['tiktok', 'instagram', 'youtube']
    } = originalPost;

    const crossPosts = [];

    // Generar versión optimizada para cada plataforma
    targetPlatforms.forEach(platform => {
      if (crossPosts.length < crossPostingEngine.rules.maxPlatformsPerPost) {
        const optimizedPost = createPlatformOptimizedPost(originalPost, platform);
        if (optimizedPost) {
          crossPosts.push(optimizedPost);
        }
      }
    });

    // Aplicar estrategia de timing
    const timedCrossPosts = applyCrossPostTiming(crossPosts);

    return timedCrossPosts;
  };

  // Crear post optimizado para plataforma específica
  const createPlatformOptimizedPost = (originalPost, platform) => {
    const platformSpec = crossPostingEngine.platformSpecs[platform];
    if (!platformSpec) return null;

    // Adaptar contenido según plataforma
    const adaptedContent = adaptContentForCrossPosting(originalPost.content, platform, originalPost.niche);

    // Optimizar hashtags para plataforma
    const optimizedHashtags = optimizeHashtagsForPlatform(originalPost.hashtags, platform, originalPost.niche);

    // Calcular timing óptimo para esta plataforma
    const optimalTiming = calculateOptimalCrossPostTiming(platform, originalPost.niche);

    // Generar elementos específicos de plataforma
    const platformElements = generatePlatformSpecificElements(platform, originalPost.niche, adaptedContent);

    return {
      id: `cross_${platform}_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      originalId: originalPost.id,
      platform,
      title: generatePlatformTitle(adaptedContent, platform, originalPost.niche),
      content: adaptedContent,
      hashtags: optimizedHashtags,
      scheduledDate: optimalTiming,
      status: 'cross_scheduled',
      niche: originalPost.niche,
      mediaType: adaptMediaType(originalPost.mediaType, platform),
      platformElements,
      crossPostGroup: originalPost.id,
      adaptations: {
        contentLength: adaptedContent.length,
        hashtagCount: optimizedHashtags.length,
        toneAdjustment: platformSpec.tone,
        formatOptimization: platformSpec.preferredFormats[0]
      },
      viralScore: predictCrossPostViralScore(adaptedContent, platform, originalPost.niche),
      estimatedReach: estimateCrossPostReach(platform, originalPost.niche, adaptedContent)
    };
  };

  // Adaptar contenido para plataforma específica
  const adaptContentForCrossPosting = (originalContent, platform, niche) => {
    const platformSpec = crossPostingEngine.platformSpecs[platform];
    let adaptedContent = originalContent;

    // Ajustar longitud según plataforma
    if (adaptedContent.length > platformSpec.maxLength) {
      adaptedContent = truncateContentIntelligently(adaptedContent, platformSpec.maxLength);
    }

    // Adaptar tono según plataforma
    adaptedContent = adjustToneForPlatform(adaptedContent, platform, niche);

    // Añadir elementos específicos de plataforma
    adaptedContent = addPlatformSpecificElements(adaptedContent, platform, niche);

    return adaptedContent;
  };

  // Truncar contenido de manera inteligente
  const truncateContentIntelligently = (content, maxLength) => {
    if (content.length <= maxLength) return content;

    // Encontrar punto de corte natural (después de oración completa)
    const sentences = content.split(/[.!?]/);
    let truncated = '';

    for (let sentence of sentences) {
      if ((truncated + sentence).length < maxLength - 10) {
        truncated += sentence + '.';
      } else {
        break;
      }
    }

    // Si no hay oraciones completas, cortar por palabras
    if (truncated.length < maxLength * 0.5) {
      const words = content.split(' ');
      truncated = words.slice(0, Math.floor(maxLength / 6)).join(' ') + '...';
    }

    return truncated.trim();
  };

  // Ajustar tono para plataforma
  const adjustToneForPlatform = (content, platform, niche) => {
    const toneAdjustments = {
      tiktok: {
        food: content => content.replace(/\./g, ' 🔥').replace(/increíble/gi, 'INCREÍBLE'),
        fitness: content => content.replace(/\./g, ' 💪').replace(/rutina/gi, 'RUTINA'),
        fashion: content => content.replace(/\./g, ' ✨').replace(/outfit/gi, 'OUTFIT')
      },
      instagram: {
        food: content => content + '\n\n✨ Guarda este post para más recetas increíbles',
        fitness: content => content + '\n\n💪 ¿Cuál es tu meta fitness? Cuéntame en comentarios',
        fashion: content => content + '\n\n👗 ¿Te gusta este estilo? Etiqueta a quien le quedaría perfecto'
      },
      youtube: {
        food: content => `En este video te muestro: ${content}\n\n🔔 Suscríbete para más recetas`,
        fitness: content => `Tutorial completo: ${content}\n\n💪 Dale like si te sirvió`,
        fashion: content => `Look breakdown: ${content}\n\n👗 Comenta tu parte favorita`
      }
    };

    const adjustment = toneAdjustments[platform]?.[niche];
    return adjustment ? adjustment(content) : content;
  };

  // Añadir elementos específicos de plataforma
  const addPlatformSpecificElements = (content, platform, niche) => {
    const platformElements = {
      tiktok: {
        food: ['POV:', 'Tutorial:', 'Receta viral:'],
        fitness: ['Day in my life:', 'Workout with me:', 'Transformation:'],
        fashion: ['Get ready with me:', 'Outfit check:', 'Style inspo:']
      },
      instagram: {
        food: ['Swipe para ver el proceso ➡️', 'Receta en stories 📖', 'Link en bio 🔗'],
        fitness: ['Más tips en highlights 💡', 'Rutina completa en IGTV 📺', 'Progress en stories 📊'],
        fashion: ['Detalles en carousel ➡️', 'Outfit links en stories 🛍️', 'Styling tips en highlights ✨']
      },
      youtube: {
        food: ['Timestamp en descripción ⏰', 'Ingredientes en descripción 📝', 'Suscríbete para más 🔔'],
        fitness: ['Rutina completa gratis 💪', 'Capítulos en timeline ⏱️', 'Descarga la app 📱'],
        fashion: ['Links de productos abajo 👇', 'Haul completo próximamente 🛍️', 'Styling tips en descripción ✨']
      }
    };

    const elements = platformElements[platform]?.[niche] || [];
    if (elements.length > 0) {
      const randomElement = elements[Math.floor(Math.random() * elements.length)];
      return `${randomElement} ${content}`;
    }

    return content;
  };

  // Optimizar hashtags para plataforma específica
  const optimizeHashtagsForPlatform = (originalHashtags, platform, niche) => {
    const platformSpec = crossPostingEngine.platformSpecs[platform];
    const platformHashtags = trendingHashtags.byPlatform[platform] || [];
    const nicheHashtags = trendingHashtags.byNiche[niche] || [];

    let optimizedHashtags = [...originalHashtags];

    // Añadir hashtags específicos de plataforma
    const topPlatformHashtags = platformHashtags
      .slice(0, 2)
      .map(h => h.tag)
      .filter(tag => !optimizedHashtags.includes(tag));

    optimizedHashtags.push(...topPlatformHashtags);

    // Añadir hashtags de nicho si hay espacio
    if (optimizedHashtags.length < platformSpec.optimalHashtags) {
      const additionalNiche = nicheHashtags
        .slice(0, platformSpec.optimalHashtags - optimizedHashtags.length)
        .map(h => h.tag)
        .filter(tag => !optimizedHashtags.includes(tag));

      optimizedHashtags.push(...additionalNiche);
    }

    // Limitar al número óptimo para la plataforma
    return optimizedHashtags.slice(0, platformSpec.optimalHashtags);
  };

  // Calcular timing óptimo para cross-posting
  const calculateOptimalCrossPostTiming = (platform, niche) => {
    const baseTime = new Date();
    const platformData = audienceData.engagement[platform];

    if (!platformData) return baseTime;

    // Encontrar próxima hora óptima para esta plataforma
    const currentHour = baseTime.getHours();
    const peakHours = platformData.peak_hours;

    let nextOptimalHour = peakHours.find(hour => hour > currentHour);
    if (!nextOptimalHour) {
      nextOptimalHour = peakHours[0] + 24; // Próximo día
    }

    const optimalTime = new Date(baseTime);
    optimalTime.setHours(nextOptimalHour % 24, Math.floor(Math.random() * 60), 0, 0);

    // Si es para el próximo día, añadir 24 horas
    if (nextOptimalHour >= 24) {
      optimalTime.setDate(optimalTime.getDate() + 1);
    }

    return optimalTime;
  };

  // Generar elementos específicos de plataforma
  const generatePlatformSpecificElements = (platform, niche, content) => {
    const elements = {
      tiktok: {
        suggestedSounds: getTrendingSounds(niche),
        effects: getTrendingEffects(niche),
        challenges: getRelevantChallenges(niche),
        duetOpportunities: getDuetOpportunities(content)
      },
      instagram: {
        storyIdeas: generateStoryIdeas(content, niche),
        highlightCategories: getHighlightCategories(niche),
        shoppingTags: getShoppingOpportunities(niche),
        collaborations: getCollaborationIdeas(niche)
      },
      youtube: {
        thumbnailIdeas: generateThumbnailIdeas(content, niche),
        chapterSuggestions: generateChapterSuggestions(content),
        endScreenElements: getEndScreenSuggestions(niche),
        playlistCategories: getPlaylistCategories(niche)
      }
    };

    return elements[platform] || {};
  };

  // Funciones auxiliares para elementos específicos
  const getTrendingSounds = (niche) => {
    const sounds = {
      food: ['Cooking Beat Trending', 'Sizzle Sound Viral', 'Kitchen Vibes'],
      fitness: ['Workout Motivation', 'Gym Beast Mode', 'Fitness Energy'],
      fashion: ['Style Anthem', 'Fashion Week Vibes', 'Runway Ready']
    };
    return sounds[niche] || sounds.food;
  };

  const getTrendingEffects = (niche) => {
    const effects = {
      food: ['Food Filter', 'Taste Test', 'Recipe Reveal'],
      fitness: ['Transformation', 'Workout Timer', 'Progress Track'],
      fashion: ['Outfit Change', 'Style Match', 'Color Pop']
    };
    return effects[niche] || effects.food;
  };

  const getRelevantChallenges = (niche) => {
    const challenges = {
      food: ['#RecipeChallenge', '#CookingHack', '#FoodieTest'],
      fitness: ['#WorkoutChallenge', '#FitnessGoals', '#TransformationTuesday'],
      fashion: ['#OutfitChallenge', '#StyleChallenge', '#OOTD']
    };
    return challenges[niche] || challenges.food;
  };

  const generateStoryIdeas = (content, niche) => {
    return [
      'Behind the scenes del proceso',
      'Tips rápidos relacionados',
      'Pregunta a la audiencia',
      'Poll sobre preferencias',
      'Tutorial paso a paso'
    ];
  };

  const generateThumbnailIdeas = (content, niche) => {
    return [
      'Antes y después split',
      'Resultado final destacado',
      'Expresión de sorpresa',
      'Texto llamativo overlay',
      'Colores contrastantes'
    ];
  };

  // Aplicar estrategia de timing para cross-posting
  const applyCrossPostTiming = (crossPosts) => {
    const strategy = crossPostingEngine.rules.timingStrategy;

    switch (strategy) {
      case 'simultaneous':
        // Todos al mismo tiempo
        return crossPosts.map(post => ({
          ...post,
          scheduledDate: new Date()
        }));

      case 'staggered':
        // Escalonado cada 2 horas
        return crossPosts.map((post, index) => {
          const staggeredTime = new Date();
          staggeredTime.setHours(staggeredTime.getHours() + (index * 2));
          return {
            ...post,
            scheduledDate: staggeredTime
          };
        });

      case 'optimized':
        // Ya calculado individualmente
        return crossPosts;

      default:
        return crossPosts;
    }
  };

  // Predecir score viral para cross-post
  const predictCrossPostViralScore = (content, platform, niche) => {
    const basePrediction = predictViralityBeforeScheduling({
      content,
      hashtags: [],
      platform,
      niche,
      scheduledTime: new Date(),
      mediaType: 'image'
    });

    // Bonus por optimización de plataforma
    const platformBonus = crossPostingEngine.rules.adaptationLevel === 'high' ? 10 : 5;

    return Math.min(basePrediction.score + platformBonus, 100);
  };

  // Estimar alcance para cross-post
  const estimateCrossPostReach = (platform, niche, content) => {
    const baseReach = estimateReach(75, platform, niche);
    const crossPostMultiplier = 1.2; // Bonus por optimización

    return Math.round(baseReach * crossPostMultiplier);
  };

  // Generar título optimizado para plataforma
  const generatePlatformTitle = (content, platform, niche) => {
    const titleFormats = {
      tiktok: {
        food: ['🔥 Receta viral:', '✨ Secreto culinario:', '🤯 Hack de cocina:'],
        fitness: ['💪 Rutina que funciona:', '⚡ Ejercicio viral:', '🔥 Transformación:'],
        fashion: ['👗 Look trending:', '✨ Outfit viral:', '🔥 Style hack:']
      },
      instagram: {
        food: ['Receta que debes probar', 'El plato que está rompiendo', 'Ingrediente secreto revelado'],
        fitness: ['Rutina que cambió mi vida', 'Ejercicio que todos hacen', 'Transformación real'],
        fashion: ['Outfit que necesitas ver', 'Look que está trending', 'Combinación perfecta']
      },
      youtube: {
        food: ['CÓMO HACER:', 'RECETA COMPLETA:', 'TUTORIAL PASO A PASO:'],
        fitness: ['RUTINA COMPLETA:', 'GUÍA DEFINITIVA:', 'TODO LO QUE NECESITAS:'],
        fashion: ['OUTFIT BREAKDOWN:', 'STYLE GUIDE:', 'LOOK COMPLETO:']
      }
    };

    const formats = titleFormats[platform]?.[niche] || titleFormats.tiktok.food;
    const randomFormat = formats[Math.floor(Math.random() * formats.length)];

    return `${randomFormat} ${content.split(' ').slice(0, 5).join(' ')}...`;
  };

  // PUNTO 8: Variaciones automáticas del mismo contenido
  const [contentVariationEngine, setContentVariationEngine] = useState({
    enabled: true,
    variationTypes: ['hook', 'cta', 'emoji', 'format', 'angle'],
    maxVariationsPerPost: 5,
    abTestingEnabled: true,
    learningEnabled: true,
    variationStrategies: {
      hook: ['question', 'statement', 'number', 'secret', 'pov'],
      cta: ['engagement', 'save', 'share', 'comment', 'follow'],
      emoji: ['minimal', 'moderate', 'heavy'],
      format: ['list', 'story', 'tutorial', 'comparison'],
      angle: ['benefit', 'problem', 'solution', 'transformation']
    }
  });

  // Función principal para generar variaciones automáticas
  const generateContentVariations = (originalPost) => {
    const {
      content,
      niche,
      platform,
      hashtags,
      mediaType
    } = originalPost;

    const variations = [];
    const maxVariations = contentVariationEngine.maxVariationsPerPost;

    // Generar diferentes tipos de variaciones
    for (let i = 0; i < maxVariations; i++) {
      const variationType = contentVariationEngine.variationTypes[i % contentVariationEngine.variationTypes.length];
      const variation = createContentVariation(originalPost, variationType, i);

      if (variation) {
        variations.push(variation);
      }
    }

    // Si A/B testing está habilitado, configurar experimentos
    if (contentVariationEngine.abTestingEnabled) {
      return setupABTestingForVariations(variations, originalPost);
    }

    return variations;
  };

  // Crear variación específica del contenido
  const createContentVariation = (originalPost, variationType, index) => {
    const { content, niche, platform } = originalPost;

    let variatedContent = content;
    let variationMetadata = {
      type: variationType,
      index,
      originalId: originalPost.id
    };

    switch (variationType) {
      case 'hook':
        variatedContent = generateHookVariation(content, niche, index);
        variationMetadata.hookType = contentVariationEngine.variationStrategies.hook[index % 5];
        break;

      case 'cta':
        variatedContent = generateCTAVariation(content, niche, index);
        variationMetadata.ctaType = contentVariationEngine.variationStrategies.cta[index % 5];
        break;

      case 'emoji':
        variatedContent = generateEmojiVariation(content, niche, index);
        variationMetadata.emojiLevel = contentVariationEngine.variationStrategies.emoji[index % 3];
        break;

      case 'format':
        variatedContent = generateFormatVariation(content, niche, index);
        variationMetadata.formatType = contentVariationEngine.variationStrategies.format[index % 4];
        break;

      case 'angle':
        variatedContent = generateAngleVariation(content, niche, index);
        variationMetadata.angleType = contentVariationEngine.variationStrategies.angle[index % 4];
        break;

      default:
        return null;
    }

    return {
      id: `var_${variationType}_${Date.now()}_${index}`,
      originalId: originalPost.id,
      title: `${originalPost.title} - Variación ${index + 1}`,
      content: variatedContent,
      platform: originalPost.platform,
      niche: originalPost.niche,
      hashtags: generateVariationHashtags(originalPost.hashtags, variationType, niche),
      scheduledDate: calculateVariationTiming(originalPost.scheduledDate, index),
      status: 'variation_scheduled',
      mediaType: originalPost.mediaType,
      variationMetadata,
      viralScore: predictVariationViralScore(variatedContent, platform, niche, variationType),
      estimatedReach: estimateVariationReach(platform, niche, variationType),
      abTestGroup: `group_${String.fromCharCode(65 + index)}` // A, B, C, D, E
    };
  };

  // Generar variación de hook
  const generateHookVariation = (content, niche, index) => {
    const hookStrategies = {
      question: {
        food: ['¿Sabías que este ingrediente...?', '¿Qué pasaría si te dijera que...?', '¿Adivinas cuál es el secreto de...?'],
        fitness: ['¿Cuánto tiempo crees que tomó...?', '¿Qué harías si pudieras...?', '¿Sabías que solo necesitas...?'],
        fashion: ['¿Te imaginas lograr este look con...?', '¿Qué opinas de esta combinación...?', '¿Sabías que este outfit cuesta...?']
      },
      statement: {
        food: ['Este plato cambió mi vida completamente', 'Nadie me creyó cuando dije que...', 'La primera vez que probé esto...'],
        fitness: ['En 30 días logré algo increíble', 'Mi transformación empezó con esto', 'Pensé que era imposible hasta que...'],
        fashion: ['Este outfit me dio tanta confianza', 'Nunca pensé que me vería así', 'La primera vez que usé esto...']
      },
      number: {
        food: ['3 ingredientes que cambiarán tu cocina', '5 minutos para el mejor plato', '1 secreto que los chefs no dicen'],
        fitness: ['7 días para ver resultados', '5 ejercicios que lo cambian todo', '10 minutos que transforman tu día'],
        fashion: ['3 piezas para 10 outfits diferentes', '5 trucos de styling que funcionan', '1 accesorio que eleva cualquier look']
      },
      secret: {
        food: ['El secreto que los restaurantes no quieren que sepas', 'Ingrediente secreto que cambia todo', 'Técnica secreta de los chefs profesionales'],
        fitness: ['El secreto de las transformaciones reales', 'Lo que los entrenadores no te dicen', 'Secreto para resultados en menos tiempo'],
        fashion: ['El truco que usan las influencers', 'Secreto para verse más elegante', 'Lo que las estilistas no revelan']
      },
      pov: {
        food: ['POV: Descubriste el plato perfecto', 'POV: Tu familia no puede parar de comer esto', 'POV: Hiciste el mejor plato de tu vida'],
        fitness: ['POV: Lograste tu mejor versión', 'POV: Tu rutina finalmente funciona', 'POV: Te sientes increíble después del workout'],
        fashion: ['POV: Encontraste tu estilo perfecto', 'POV: Todos preguntan dónde compraste el outfit', 'POV: Te sientes increíble con este look']
      }
    };

    const strategy = contentVariationEngine.variationStrategies.hook[index % 5];
    const hooks = hookStrategies[strategy]?.[niche] || hookStrategies[strategy]?.food || [];

    if (hooks.length === 0) return content;

    const selectedHook = hooks[Math.floor(Math.random() * hooks.length)];
    const originalWithoutHook = content.replace(/^[^.!?]*[.!?]\s*/, '');

    return `${selectedHook} ${originalWithoutHook}`;
  };

  // Generar variación de CTA
  const generateCTAVariation = (content, niche, index) => {
    const ctaStrategies = {
      engagement: {
        food: ['¿Cuál es tu ingrediente favorito?', '¿Qué receta quieres que haga después?', '¿Con qué acompañarías este plato?'],
        fitness: ['¿Cuál es tu ejercicio favorito?', '¿Qué meta fitness tienes?', '¿Cuántas repeticiones harías?'],
        fashion: ['¿Cuál es tu color favorito?', '¿Cómo combinarías estas piezas?', '¿Qué ocasión es perfecta para este look?']
      },
      save: {
        food: ['Guarda para tu próxima cena especial', 'Salva esta receta para el fin de semana', 'Guarda para impresionar a tus invitados'],
        fitness: ['Guarda para tu próximo workout', 'Salva para cuando necesites motivación', 'Guarda para tu rutina de mañana'],
        fashion: ['Guarda para tu próximo evento', 'Salva para inspiración de outfit', 'Guarda para tu próxima compra']
      },
      share: {
        food: ['Comparte con quien ama cocinar', 'Etiqueta a tu compañero de cocina', 'Envía a quien necesita esta receta'],
        fitness: ['Comparte con tu gym buddy', 'Etiqueta a quien necesita motivación', 'Envía a tu compañero de entrenamiento'],
        fashion: ['Comparte con tu fashion buddy', 'Etiqueta a quien le quedaría perfecto', 'Envía a quien ama la moda']
      },
      comment: {
        food: ['Comenta tu versión de esta receta', 'Cuéntame cómo te quedó', 'Dime qué ingrediente añadirías'],
        fitness: ['Comenta tu progreso fitness', 'Cuéntame tu rutina favorita', 'Dime cuál es tu mayor motivación'],
        fashion: ['Comenta tu outfit favorito', 'Cuéntame tu estilo personal', 'Dime dónde usarías este look']
      },
      follow: {
        food: ['Sígueme para más recetas increíbles', 'Follow para contenido culinario diario', 'Sígueme si amas cocinar'],
        fitness: ['Sígueme para más tips fitness', 'Follow para motivación diaria', 'Sígueme si amas entrenar'],
        fashion: ['Sígueme para más inspiración de moda', 'Follow para outfits diarios', 'Sígueme si amas el fashion']
      }
    };

    const strategy = contentVariationEngine.variationStrategies.cta[index % 5];
    const ctas = ctaStrategies[strategy]?.[niche] || ctaStrategies[strategy]?.food || [];

    if (ctas.length === 0) return content;

    const selectedCTA = ctas[Math.floor(Math.random() * ctas.length)];

    // Remover CTA existente si hay uno
    const contentWithoutCTA = content.replace(/[.!?]\s*[¿?].*$/, '.');

    return `${contentWithoutCTA} ${selectedCTA}`;
  };

  // Generar variación de emojis
  const generateEmojiVariation = (content, niche, index) => {
    const emojiSets = {
      food: {
        minimal: ['🍽️', '✨', '👌'],
        moderate: ['🍽️', '✨', '👌', '🔥', '😋', '👇'],
        heavy: ['🍽️', '✨', '👌', '🔥', '😋', '👇', '🤤', '💯', '🙌', '❤️']
      },
      fitness: {
        minimal: ['💪', '🔥', '✨'],
        moderate: ['💪', '🔥', '✨', '⚡', '🏋️', '👇'],
        heavy: ['💪', '🔥', '✨', '⚡', '🏋️', '👇', '💯', '🙌', '🚀', '❤️']
      },
      fashion: {
        minimal: ['👗', '✨', '💫'],
        moderate: ['👗', '✨', '💫', '🔥', '😍', '👇'],
        heavy: ['👗', '✨', '💫', '🔥', '😍', '👇', '💯', '🙌', '🛍️', '❤️']
      }
    };

    const emojiLevel = contentVariationEngine.variationStrategies.emoji[index % 3];
    const emojis = emojiSets[niche]?.[emojiLevel] || emojiSets.food[emojiLevel];

    let variatedContent = content;

    // Remover emojis existentes
    variatedContent = variatedContent.replace(/[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]/gu, '');

    // Añadir nuevos emojis según el nivel
    switch (emojiLevel) {
      case 'minimal':
        variatedContent = `${emojis[0]} ${variatedContent} ${emojis[1]}`;
        break;
      case 'moderate':
        const sentences = variatedContent.split(/[.!?]/);
        variatedContent = sentences.map((sentence, i) => {
          if (sentence.trim() && i < emojis.length) {
            return `${sentence.trim()} ${emojis[i]}`;
          }
          return sentence;
        }).join('. ');
        break;
      case 'heavy':
        variatedContent = variatedContent.replace(/\s/g, ` ${emojis[Math.floor(Math.random() * emojis.length)]} `);
        break;
    }

    return variatedContent.replace(/\s+/g, ' ').trim();
  };

  // Generar variación de formato
  const generateFormatVariation = (content, niche, index) => {
    const formatStrategies = {
      list: (content, niche) => {
        const points = content.split(/[.!?]/).filter(p => p.trim());
        return points.map((point, i) => `${i + 1}. ${point.trim()}`).join('\n');
      },
      story: (content, niche) => {
        return `Historia real: ${content} Y así fue como todo cambió...`;
      },
      tutorial: (content, niche) => {
        return `Tutorial paso a paso:\n\nPaso 1: ${content.split(' ').slice(0, 10).join(' ')}\nPaso 2: ${content.split(' ').slice(10, 20).join(' ')}\nResultado: ¡Increíble!`;
      },
      comparison: (content, niche) => {
        return `Antes: Pensaba que era imposible\nAhora: ${content}\nLa diferencia es increíble ✨`;
      }
    };

    const strategy = contentVariationEngine.variationStrategies.format[index % 4];
    const formatter = formatStrategies[strategy];

    return formatter ? formatter(content, niche) : content;
  };

  // Generar variación de ángulo
  const generateAngleVariation = (content, niche, index) => {
    const angleStrategies = {
      benefit: (content, niche) => `Los beneficios increíbles: ${content} ¡Los resultados te van a sorprender!`,
      problem: (content, niche) => `El problema que todos tenemos: ${content} Pero hay una solución...`,
      solution: (content, niche) => `La solución que estabas buscando: ${content} Funciona siempre.`,
      transformation: (content, niche) => `Mi transformación completa: ${content} No podía creer el cambio.`
    };

    const strategy = contentVariationEngine.variationStrategies.angle[index % 4];
    const angleFormatter = angleStrategies[strategy];

    return angleFormatter ? angleFormatter(content, niche) : content;
  };

  // Generar hashtags para variaciones
  const generateVariationHashtags = (originalHashtags, variationType, niche) => {
    const variationHashtags = {
      hook: ['#viral', '#trending', '#mustwatch'],
      cta: ['#engagement', '#community', '#interactive'],
      emoji: ['#fun', '#expressive', '#colorful'],
      format: ['#tutorial', '#stepbystep', '#howto'],
      angle: ['#transformation', '#results', '#success']
    };

    const additionalTags = variationHashtags[variationType] || [];
    return [...originalHashtags, ...additionalTags].slice(0, 8);
  };

  // Calcular timing para variaciones
  const calculateVariationTiming = (originalDate, index) => {
    const variationDate = new Date(originalDate);
    // Espaciar variaciones cada 4 horas
    variationDate.setHours(variationDate.getHours() + (index * 4));
    return variationDate;
  };

  // Predecir score viral para variaciones
  const predictVariationViralScore = (content, platform, niche, variationType) => {
    const basePrediction = predictViralityBeforeScheduling({
      content,
      hashtags: [],
      platform,
      niche,
      scheduledTime: new Date(),
      mediaType: 'image'
    });

    // Bonus por tipo de variación
    const variationBonus = {
      hook: 8,
      cta: 6,
      emoji: 4,
      format: 7,
      angle: 9
    };

    const bonus = variationBonus[variationType] || 5;
    return Math.min(basePrediction.score + bonus, 100);
  };

  // Estimar alcance para variaciones
  const estimateVariationReach = (platform, niche, variationType) => {
    const baseReach = estimateReach(70, platform, niche);
    const variationMultipliers = {
      hook: 1.15,
      cta: 1.10,
      emoji: 1.05,
      format: 1.12,
      angle: 1.18
    };

    const multiplier = variationMultipliers[variationType] || 1.0;
    return Math.round(baseReach * multiplier);
  };

  // Configurar A/B testing para variaciones
  const setupABTestingForVariations = (variations, originalPost) => {
    return variations.map((variation, index) => ({
      ...variation,
      abTest: {
        enabled: true,
        testId: `ab_${originalPost.id}_${Date.now()}`,
        group: `variation_${String.fromCharCode(65 + index)}`,
        metrics: ['reach', 'engagement', 'shares', 'saves'],
        duration: 48, // horas
        confidenceLevel: 95,
        minSampleSize: 1000
      },
      analytics: {
        trackingEnabled: true,
        conversionGoals: ['engagement', 'follower_growth', 'website_clicks'],
        customEvents: [`variation_${variation.variationMetadata.type}_view`]
      }
    }));
  };

  // PUNTO 9: Secuencias de contenido (series, campañas)
  const [contentSequenceEngine, setContentSequenceEngine] = useState({
    enabled: true,
    sequenceTypes: ['series', 'campaign', 'challenge', 'tutorial_series', 'transformation'],
    maxSequenceLength: 10,
    autoSequencing: true,
    sequenceStrategies: {
      series: {
        duration: 7, // días
        frequency: 'daily',
        progression: 'linear',
        themes: ['recipe_week', 'workout_series', 'style_evolution']
      },
      campaign: {
        duration: 14,
        frequency: 'every_2_days',
        progression: 'building',
        themes: ['product_launch', 'brand_awareness', 'seasonal_content']
      },
      challenge: {
        duration: 30,
        frequency: 'daily',
        progression: 'escalating',
        themes: ['30_day_fitness', 'cooking_challenge', 'style_challenge']
      },
      tutorial_series: {
        duration: 5,
        frequency: 'every_3_days',
        progression: 'skill_building',
        themes: ['beginner_to_pro', 'masterclass_series', 'step_by_step']
      },
      transformation: {
        duration: 21,
        frequency: 'weekly',
        progression: 'milestone_based',
        themes: ['before_after', 'journey_documentation', 'progress_tracking']
      }
    }
  });

  // Función principal para generar secuencias de contenido
  const generateContentSequence = (baseContent, sequenceType, theme) => {
    const strategy = contentSequenceEngine.sequenceStrategies[sequenceType];
    if (!strategy) return [];

    const sequence = [];
    const sequenceId = `seq_${sequenceType}_${Date.now()}`;

    // Generar contenido para cada día de la secuencia
    for (let day = 1; day <= strategy.duration; day++) {
      const sequencePost = createSequencePost(baseContent, sequenceType, theme, day, sequenceId, strategy);
      if (sequencePost) {
        sequence.push(sequencePost);
      }
    }

    return sequence;
  };

  // Crear post individual de la secuencia
  const createSequencePost = (baseContent, sequenceType, theme, dayNumber, sequenceId, strategy) => {
    const sequenceContent = generateSequenceContent(baseContent, sequenceType, theme, dayNumber, strategy);
    const sequenceDate = calculateSequenceDate(dayNumber, strategy.frequency);

    return {
      id: `${sequenceId}_day_${dayNumber}`,
      sequenceId,
      sequenceType,
      theme,
      dayNumber,
      totalDays: strategy.duration,
      title: generateSequenceTitle(sequenceType, theme, dayNumber, strategy.duration),
      content: sequenceContent,
      platform: baseContent.platform,
      niche: baseContent.niche,
      hashtags: generateSequenceHashtags(baseContent.hashtags, sequenceType, theme, dayNumber),
      scheduledDate: sequenceDate,
      status: 'sequence_scheduled',
      mediaType: baseContent.mediaType,
      sequenceMetadata: {
        progression: calculateProgressionLevel(dayNumber, strategy.duration, strategy.progression),
        milestone: determineMilestone(dayNumber, strategy.duration),
        nextPost: dayNumber < strategy.duration ? `${sequenceId}_day_${dayNumber + 1}` : null,
        previousPost: dayNumber > 1 ? `${sequenceId}_day_${dayNumber - 1}` : null
      },
      viralScore: predictSequenceViralScore(sequenceContent, baseContent.platform, baseContent.niche, dayNumber, strategy.duration),
      estimatedReach: estimateSequenceReach(baseContent.platform, baseContent.niche, dayNumber, sequenceType),
      sequenceAnalytics: {
        expectedEngagement: calculateExpectedSequenceEngagement(dayNumber, strategy.duration),
        retentionProbability: calculateRetentionProbability(dayNumber, sequenceType),
        completionRate: estimateCompletionRate(sequenceType, strategy.duration)
      }
    };
  };

  // Generar contenido específico para cada día de la secuencia
  const generateSequenceContent = (baseContent, sequenceType, theme, dayNumber, strategy) => {
    const contentTemplates = {
      series: {
        recipe_week: {
          1: "🍽️ DÍA 1: Comenzamos nuestra semana culinaria con algo especial",
          2: "👨‍🍳 DÍA 2: Elevamos el nivel con esta técnica increíble",
          3: "🔥 DÍA 3: Mitad de semana, mitad de sabor explosivo",
          4: "✨ DÍA 4: Casi llegamos al final, pero lo mejor está por venir",
          5: "🎉 DÍA 5: El gran final de nuestra semana culinaria",
          6: "🍾 DÍA 6: Bonus track - algo extra para el fin de semana",
          7: "📸 DÍA 7: Recapitulación de toda la semana épica"
        },
        workout_series: {
          1: "💪 DÍA 1: Empezamos fuerte esta semana de transformación",
          2: "🔥 DÍA 2: Subimos la intensidad, tu cuerpo te lo agradecerá",
          3: "⚡ DÍA 3: Mitad de semana, mitad del camino hacia tu meta",
          4: "🚀 DÍA 4: El momento donde muchos se rinden, pero tú sigues",
          5: "💯 DÍA 5: Viernes de poder, terminamos la semana como campeones",
          6: "🏋️ DÍA 6: Sábado activo, porque los resultados no descansan",
          7: "📊 DÍA 7: Domingo de reflexión y planificación para la próxima semana"
        }
      },
      challenge: {
        "30_day_fitness": (day) => `💪 DÍA ${day}: Cada día más fuerte, cada día más cerca de tu meta`,
        cooking_challenge: (day) => `👨‍🍳 DÍA ${day}: Dominando nuevas técnicas culinarias`,
        style_challenge: (day) => `👗 DÍA ${day}: Explorando tu estilo personal único`
      }
    };

    const template = contentTemplates[sequenceType]?.[theme];

    if (typeof template === 'function') {
      return `${template(dayNumber)} ${baseContent.content}`;
    } else if (typeof template === 'object') {
      return `${template[dayNumber] || `Día ${dayNumber}`} ${baseContent.content}`;
    }

    return `${baseContent.content} - Día ${dayNumber} de ${strategy.duration}`;
  };

  // Calcular fecha de la secuencia según frecuencia
  const calculateSequenceDate = (dayNumber, frequency) => {
    const baseDate = new Date();
    let daysToAdd = 0;

    switch (frequency) {
      case 'daily':
        daysToAdd = dayNumber - 1;
        break;
      case 'every_2_days':
        daysToAdd = (dayNumber - 1) * 2;
        break;
      case 'every_3_days':
        daysToAdd = (dayNumber - 1) * 3;
        break;
      case 'weekly':
        daysToAdd = (dayNumber - 1) * 7;
        break;
      default:
        daysToAdd = dayNumber - 1;
    }

    const sequenceDate = new Date(baseDate);
    sequenceDate.setDate(sequenceDate.getDate() + daysToAdd);

    // Ajustar hora óptima según el día de la secuencia
    const optimalHour = 19 + (dayNumber % 3); // Variar entre 19:00-21:00
    sequenceDate.setHours(optimalHour, 0, 0, 0);

    return sequenceDate;
  };

  // Generar título para post de secuencia
  const generateSequenceTitle = (sequenceType, theme, dayNumber, totalDays) => {
    const titleFormats = {
      series: `Serie ${theme} - Día ${dayNumber}/${totalDays}`,
      campaign: `Campaña ${theme} - Fase ${dayNumber}`,
      challenge: `Desafío ${theme} - Día ${dayNumber}`,
      tutorial_series: `Tutorial ${theme} - Parte ${dayNumber}`,
      transformation: `Transformación ${theme} - Semana ${Math.ceil(dayNumber / 7)}`
    };

    return titleFormats[sequenceType] || `${sequenceType} - Día ${dayNumber}`;
  };

  // Generar hashtags para secuencia
  const generateSequenceHashtags = (baseHashtags, sequenceType, theme, dayNumber) => {
    const sequenceHashtags = {
      series: [`#${theme}Series`, `#Day${dayNumber}`, '#SerieViral'],
      campaign: [`#${theme}Campaign`, `#Fase${dayNumber}`, '#CampañaViral'],
      challenge: [`#${theme}Challenge`, `#Dia${dayNumber}`, '#DesafioViral'],
      tutorial_series: [`#${theme}Tutorial`, `#Parte${dayNumber}`, '#TutorialSeries'],
      transformation: [`#${theme}Transform`, `#Semana${Math.ceil(dayNumber / 7)}`, '#TransformacionReal']
    };

    const additionalTags = sequenceHashtags[sequenceType] || [`#${sequenceType}`, `#Day${dayNumber}`];
    return [...baseHashtags, ...additionalTags].slice(0, 10);
  };

  // Calcular nivel de progresión
  const calculateProgressionLevel = (dayNumber, totalDays, progressionType) => {
    const progress = (dayNumber / totalDays) * 100;

    switch (progressionType) {
      case 'linear':
        return Math.round(progress);
      case 'building':
        return Math.round(progress * 1.2); // Aceleración
      case 'escalating':
        return Math.round(Math.pow(progress / 100, 0.8) * 100); // Curva exponencial
      case 'skill_building':
        return Math.round(progress * 1.1);
      case 'milestone_based':
        return dayNumber % 7 === 0 ? 100 : Math.round(progress);
      default:
        return Math.round(progress);
    }
  };

  // Determinar milestone
  const determineMilestone = (dayNumber, totalDays) => {
    const milestones = {
      1: 'inicio',
      [Math.floor(totalDays * 0.25)]: 'primer_cuarto',
      [Math.floor(totalDays * 0.5)]: 'mitad',
      [Math.floor(totalDays * 0.75)]: 'tercer_cuarto',
      [totalDays]: 'final'
    };

    return milestones[dayNumber] || null;
  };

  // Predecir score viral para secuencia
  const predictSequenceViralScore = (content, platform, niche, dayNumber, totalDays) => {
    const basePrediction = predictViralityBeforeScheduling({
      content,
      hashtags: [],
      platform,
      niche,
      scheduledTime: new Date(),
      mediaType: 'image'
    });

    // Bonus por momentum de secuencia
    const momentumBonus = Math.min(dayNumber * 2, 15); // Máximo 15% bonus

    // Bonus por milestone
    const milestoneBonus = determineMilestone(dayNumber, totalDays) ? 5 : 0;

    return Math.min(basePrediction.score + momentumBonus + milestoneBonus, 100);
  };

  // Estimar alcance para secuencia
  const estimateSequenceReach = (platform, niche, dayNumber, sequenceType) => {
    const baseReach = estimateReach(75, platform, niche);

    // Multiplicador por momentum de secuencia
    const sequenceMultipliers = {
      series: 1.1 + (dayNumber * 0.02),
      campaign: 1.15 + (dayNumber * 0.03),
      challenge: 1.2 + (dayNumber * 0.01),
      tutorial_series: 1.05 + (dayNumber * 0.04),
      transformation: 1.25 + (dayNumber * 0.02)
    };

    const multiplier = sequenceMultipliers[sequenceType] || 1.0;
    return Math.round(baseReach * multiplier);
  };

  // Calcular engagement esperado para secuencia
  const calculateExpectedSequenceEngagement = (dayNumber, totalDays) => {
    const baseEngagement = 8; // %
    const progressBonus = (dayNumber / totalDays) * 5; // Hasta 5% adicional
    return Math.round(baseEngagement + progressBonus);
  };

  // Calcular probabilidad de retención
  const calculateRetentionProbability = (dayNumber, sequenceType) => {
    const retentionRates = {
      series: 0.95 - (dayNumber * 0.02),
      campaign: 0.90 - (dayNumber * 0.015),
      challenge: 0.85 - (dayNumber * 0.01),
      tutorial_series: 0.92 - (dayNumber * 0.018),
      transformation: 0.88 - (dayNumber * 0.012)
    };

    const baseRate = retentionRates[sequenceType] || 0.90;
    return Math.max(baseRate, 0.60); // Mínimo 60% retención
  };

  // Estimar tasa de completación
  const estimateCompletionRate = (sequenceType, duration) => {
    const completionRates = {
      series: Math.max(0.85 - (duration * 0.02), 0.60),
      campaign: Math.max(0.75 - (duration * 0.015), 0.50),
      challenge: Math.max(0.65 - (duration * 0.01), 0.40),
      tutorial_series: Math.max(0.80 - (duration * 0.025), 0.55),
      transformation: Math.max(0.70 - (duration * 0.018), 0.45)
    };

    return completionRates[sequenceType] || 0.70;
  };

  // PUNTO 10: Reprogramación automática si el engagement es bajo
  const [autoReschedulingEngine, setAutoReschedulingEngine] = useState({
    enabled: true,
    thresholds: {
      lowEngagement: 3, // % mínimo de engagement
      lowReach: 1000, // alcance mínimo
      timeWindow: 4, // horas para evaluar performance
      rescheduleAttempts: 3 // máximo intentos de reprogramación
    },
    strategies: {
      timing: ['peak_hours', 'different_day', 'weekend_boost'],
      content: ['add_trending_hashtags', 'modify_hook', 'add_cta'],
      platform: ['cross_post', 'platform_switch', 'multi_platform']
    },
    learningEnabled: true,
    autoOptimization: true
  });

  // Sistema de monitoreo de performance en tiempo real
  const [performanceMonitor, setPerformanceMonitor] = useState({
    activePosts: new Map(),
    lowPerformers: [],
    rescheduledPosts: [],
    successfulReschedules: []
  });

  // Función principal de reprogramación automática
  const executeAutoRescheduling = (postId, performanceData) => {
    const post = performanceMonitor.activePosts.get(postId);
    if (!post) return null;

    // Evaluar si necesita reprogramación
    const needsRescheduling = evaluateReschedulingNeed(performanceData);

    if (needsRescheduling.required) {
      const reschedulingPlan = createReschedulingPlan(post, performanceData, needsRescheduling);
      const rescheduledPost = executeRescheduling(post, reschedulingPlan);

      // Actualizar tracking
      updateReschedulingTracking(postId, rescheduledPost, reschedulingPlan);

      return rescheduledPost;
    }

    return null;
  };

  // Evaluar si un post necesita reprogramación
  const evaluateReschedulingNeed = (performanceData) => {
    const {
      actualEngagement,
      actualReach,
      timeElapsed,
      expectedEngagement,
      expectedReach,
      platform,
      niche
    } = performanceData;

    const evaluation = {
      required: false,
      reasons: [],
      severity: 'low',
      confidence: 0
    };

    // Verificar engagement bajo
    if (actualEngagement < autoReschedulingEngine.thresholds.lowEngagement) {
      evaluation.required = true;
      evaluation.reasons.push('engagement_below_threshold');
      evaluation.severity = actualEngagement < 1 ? 'critical' : 'high';
    }

    // Verificar alcance bajo
    if (actualReach < autoReschedulingEngine.thresholds.lowReach) {
      evaluation.required = true;
      evaluation.reasons.push('reach_below_threshold');
      evaluation.severity = actualReach < 500 ? 'critical' : 'medium';
    }

    // Verificar performance vs expectativas
    const engagementRatio = actualEngagement / expectedEngagement;
    const reachRatio = actualReach / expectedReach;

    if (engagementRatio < 0.5 || reachRatio < 0.3) {
      evaluation.required = true;
      evaluation.reasons.push('performance_significantly_below_expected');
      evaluation.severity = 'high';
    }

    // Verificar timing (solo si ha pasado suficiente tiempo)
    if (timeElapsed >= autoReschedulingEngine.thresholds.timeWindow) {
      const hourlyEngagement = actualEngagement / (timeElapsed / 60);
      if (hourlyEngagement < 0.5) {
        evaluation.required = true;
        evaluation.reasons.push('poor_timing_performance');
        evaluation.severity = 'medium';
      }
    }

    // Calcular confianza en la evaluación
    evaluation.confidence = Math.min(
      (timeElapsed / autoReschedulingEngine.thresholds.timeWindow) * 100,
      100
    );

    return evaluation;
  };

  // Crear plan de reprogramación
  const createReschedulingPlan = (originalPost, performanceData, evaluation) => {
    const plan = {
      postId: originalPost.id,
      originalSchedule: originalPost.scheduledDate,
      strategies: [],
      newSchedule: null,
      modifications: {},
      expectedImprovement: 0,
      reschedulingReason: evaluation.reasons,
      attempt: (originalPost.reschedulingAttempts || 0) + 1
    };

    // Determinar estrategias basadas en la evaluación
    if (evaluation.reasons.includes('poor_timing_performance')) {
      plan.strategies.push('timing_optimization');
      plan.newSchedule = findOptimalReschedulingTime(originalPost, performanceData);
    }

    if (evaluation.reasons.includes('engagement_below_threshold')) {
      plan.strategies.push('content_optimization');
      plan.modifications.content = optimizeContentForRescheduling(originalPost);
    }

    if (evaluation.reasons.includes('reach_below_threshold')) {
      plan.strategies.push('hashtag_boost');
      plan.modifications.hashtags = boostHashtagsForRescheduling(originalPost);
    }

    // Si es crítico, aplicar estrategias múltiples
    if (evaluation.severity === 'critical') {
      plan.strategies.push('platform_diversification');
      plan.modifications.crossPost = generateCrossPostForReschedule(originalPost);
    }

    // Calcular mejora esperada
    plan.expectedImprovement = calculateExpectedImprovement(plan.strategies, evaluation.severity);

    return plan;
  };

  // Encontrar tiempo óptimo para reprogramación
  const findOptimalReschedulingTime = (originalPost, performanceData) => {
    const { platform, niche } = originalPost;
    const platformData = audienceData.engagement[platform];

    if (!platformData) return new Date();

    // Encontrar las próximas 3 mejores horas
    const currentHour = new Date().getHours();
    const engagementData = platformData.engagement_by_hour;

    const topHours = Object.entries(engagementData)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([hour]) => parseInt(hour));

    // Seleccionar hora que no sea la original
    const originalHour = originalPost.scheduledDate.getHours();
    const newHour = topHours.find(hour => hour !== originalHour) || topHours[0];

    // Programar para hoy si es posible, sino mañana
    const rescheduleDate = new Date();
    if (newHour > currentHour) {
      rescheduleDate.setHours(newHour, Math.floor(Math.random() * 60), 0, 0);
    } else {
      rescheduleDate.setDate(rescheduleDate.getDate() + 1);
      rescheduleDate.setHours(newHour, Math.floor(Math.random() * 60), 0, 0);
    }

    return rescheduleDate;
  };

  // Optimizar contenido para reprogramación
  const optimizeContentForRescheduling = (originalPost) => {
    const { content, niche } = originalPost;

    const optimizationStrategies = {
      add_hook: {
        food: ['🔥 VIRAL:', '✨ SECRETO:', '🤯 INCREÍBLE:'],
        fitness: ['💪 TRANSFORMACIÓN:', '⚡ RESULTADOS:', '🚀 MÉTODO:'],
        fashion: ['👗 TRENDING:', '✨ STYLE HACK:', '🔥 LOOK VIRAL:']
      },
      add_urgency: [
        '⏰ Solo por hoy:',
        '🔥 Últimas horas:',
        '⚡ No te lo pierdas:',
        '💯 Oportunidad única:'
      ],
      add_social_proof: [
        '👥 Miles ya lo probaron:',
        '🔥 Viral en redes:',
        '💯 Comprobado por expertos:',
        '⭐ Recomendado por influencers:'
      ]
    };

    // Seleccionar estrategia aleatoria
    const strategies = Object.keys(optimizationStrategies);
    const selectedStrategy = strategies[Math.floor(Math.random() * strategies.length)];

    let optimizedContent = content;

    if (selectedStrategy === 'add_hook') {
      const hooks = optimizationStrategies.add_hook[niche] || optimizationStrategies.add_hook.food;
      const hook = hooks[Math.floor(Math.random() * hooks.length)];
      optimizedContent = `${hook} ${content}`;
    } else {
      const elements = optimizationStrategies[selectedStrategy];
      const element = elements[Math.floor(Math.random() * elements.length)];
      optimizedContent = `${element} ${content}`;
    }

    return {
      newContent: optimizedContent,
      strategy: selectedStrategy,
      originalContent: content
    };
  };

  // Potenciar hashtags para reprogramación
  const boostHashtagsForRescheduling = (originalPost) => {
    const { hashtags, niche, platform } = originalPost;

    // Obtener hashtags trending más recientes
    const trendingHashtags = generateSmartHashtags(niche, platform, 'ecuador', 'post');

    // Combinar con hashtags de urgencia
    const urgencyHashtags = ['#viral', '#trending', '#noteloPierdas', '#ultimaOportunidad'];

    // Crear nueva combinación
    const boostedHashtags = [
      ...hashtags.slice(0, 4), // Mantener algunos originales
      ...trendingHashtags.slice(0, 3).map(h => h.tag), // Añadir trending
      ...urgencyHashtags.slice(0, 2) // Añadir urgencia
    ].slice(0, 10);

    return {
      newHashtags: boostedHashtags,
      addedTrending: trendingHashtags.slice(0, 3).map(h => h.tag),
      addedUrgency: urgencyHashtags.slice(0, 2),
      originalHashtags: hashtags
    };
  };

  // Generar cross-post para reschedule crítico
  const generateCrossPostForReschedule = (originalPost) => {
    const alternativePlatforms = ['tiktok', 'instagram', 'youtube'].filter(p => p !== originalPost.platform);
    const targetPlatform = alternativePlatforms[Math.floor(Math.random() * alternativePlatforms.length)];

    return executeCrossPosting({
      ...originalPost,
      targetPlatforms: [targetPlatform]
    });
  };

  // Calcular mejora esperada
  const calculateExpectedImprovement = (strategies, severity) => {
    const improvementRates = {
      timing_optimization: { low: 15, medium: 25, high: 35, critical: 45 },
      content_optimization: { low: 10, medium: 20, high: 30, critical: 40 },
      hashtag_boost: { low: 8, medium: 15, high: 25, critical: 35 },
      platform_diversification: { low: 20, medium: 30, high: 40, critical: 50 }
    };

    let totalImprovement = 0;
    strategies.forEach(strategy => {
      totalImprovement += improvementRates[strategy]?.[severity] || 10;
    });

    // Aplicar factor de sinergia si hay múltiples estrategias
    if (strategies.length > 1) {
      totalImprovement *= 1.2;
    }

    return Math.min(totalImprovement, 80); // Máximo 80% mejora esperada
  };

  // Ejecutar reprogramación
  const executeRescheduling = (originalPost, plan) => {
    const rescheduledPost = {
      ...originalPost,
      id: `${originalPost.id}_reschedule_${plan.attempt}`,
      originalId: originalPost.id,
      scheduledDate: plan.newSchedule || findOptimalReschedulingTime(originalPost, {}),
      status: 'rescheduled',
      reschedulingAttempts: plan.attempt,
      reschedulingPlan: plan,
      modifications: plan.modifications,
      expectedImprovement: plan.expectedImprovement,
      reschedulingTimestamp: new Date(),

      // Aplicar modificaciones
      content: plan.modifications.content?.newContent || originalPost.content,
      hashtags: plan.modifications.hashtags?.newHashtags || originalPost.hashtags,

      // Metadata de reprogramación
      reschedulingMetadata: {
        reason: plan.reschedulingReason,
        strategies: plan.strategies,
        originalSchedule: plan.originalSchedule,
        attempt: plan.attempt,
        confidence: plan.expectedImprovement
      }
    };

    return rescheduledPost;
  };

  // Actualizar tracking de reprogramación
  const updateReschedulingTracking = (originalPostId, rescheduledPost, plan) => {
    setPerformanceMonitor(prev => {
      const updated = { ...prev };

      // Mover de activos a reprogramados
      updated.activePosts.delete(originalPostId);
      updated.rescheduledPosts.push({
        originalId: originalPostId,
        rescheduledId: rescheduledPost.id,
        plan,
        timestamp: new Date()
      });

      // Añadir nuevo post a activos
      updated.activePosts.set(rescheduledPost.id, rescheduledPost);

      return updated;
    });
  };

  // Monitoreo automático de posts publicados
  const monitorPublishedPosts = () => {
    performanceMonitor.activePosts.forEach((post, postId) => {
      // Simular datos de performance
      const mockPerformance = {
        actualEngagement: Math.random() * 10,
        actualReach: Math.floor(Math.random() * 15000) + 1000,
        timeElapsed: Math.floor(Math.random() * 8) + 1, // 1-8 horas
        expectedEngagement: 8,
        expectedReach: 10000,
        platform: post.platform,
        niche: post.niche
      };

      // Evaluar si necesita reprogramación
      const reschedulingResult = executeAutoRescheduling(postId, mockPerformance);

      if (reschedulingResult) {
        console.log(`Post ${postId} reprogramado automáticamente:`, reschedulingResult);

        // Actualizar posts programados
        setScheduledPosts(prev => [...prev, reschedulingResult]);
      }
    });
  };

  // Aprendizaje automático de patrones de reprogramación
  const learnFromReschedulingResults = () => {
    const successfulReschedules = performanceMonitor.successfulReschedules;

    if (successfulReschedules.length >= 10) {
      // Analizar patrones exitosos
      const patterns = analyzeReschedulingPatterns(successfulReschedules);

      // Actualizar configuración del motor
      updateReschedulingEngine(patterns);
    }
  };

  // Analizar patrones de reprogramación exitosa
  const analyzeReschedulingPatterns = (successfulReschedules) => {
    const patterns = {
      bestTimes: {},
      bestStrategies: {},
      bestPlatforms: {},
      bestNiches: {}
    };

    successfulReschedules.forEach(reschedule => {
      const { plan, improvement } = reschedule;

      // Analizar mejores horarios
      const hour = plan.newSchedule.getHours();
      patterns.bestTimes[hour] = (patterns.bestTimes[hour] || 0) + improvement;

      // Analizar mejores estrategias
      plan.strategies.forEach(strategy => {
        patterns.bestStrategies[strategy] = (patterns.bestStrategies[strategy] || 0) + improvement;
      });
    });

    return patterns;
  };

  // Actualizar motor de reprogramación basado en aprendizaje
  const updateReschedulingEngine = (patterns) => {
    setAutoReschedulingEngine(prev => ({
      ...prev,
      learnedPatterns: patterns,
      optimizedThresholds: {
        ...prev.thresholds,
        // Ajustar thresholds basado en resultados
        lowEngagement: Math.max(prev.thresholds.lowEngagement - 0.5, 1),
        timeWindow: Math.min(prev.thresholds.timeWindow + 1, 8)
      }
    }));
  };

  // Ejecutar monitoreo cada 30 minutos
  useEffect(() => {
    if (autoReschedulingEngine.enabled) {
      const interval = setInterval(() => {
        monitorPublishedPosts();
        learnFromReschedulingResults();
      }, 1800000); // 30 minutos

      return () => clearInterval(interval);
    }
  }, [autoReschedulingEngine.enabled]);

  // PUNTO 11: Segmentación por demografía (edad, ubicación, intereses)
  const [demographicSegmentationEngine, setDemographicSegmentationEngine] = useState({
    enabled: true,
    segments: {
      age: {
        'gen_z': { range: [16, 24], platforms: ['tiktok', 'instagram'], interests: ['trends', 'music', 'gaming', 'fashion'] },
        'millennials': { range: [25, 40], platforms: ['instagram', 'facebook', 'youtube'], interests: ['career', 'fitness', 'travel', 'food'] },
        'gen_x': { range: [41, 56], platforms: ['facebook', 'youtube', 'linkedin'], interests: ['business', 'family', 'health', 'finance'] },
        'boomers': { range: [57, 75], platforms: ['facebook', 'youtube'], interests: ['health', 'family', 'news', 'hobbies'] }
      },
      location: {
        'ecuador': {
          cities: ['quito', 'guayaquil', 'cuenca'],
          timezone: 'America/Guayaquil',
          peakHours: [19, 20, 21],
          culturalEvents: ['carnaval', 'fiestas_quito', 'año_nuevo'],
          localInterests: ['ceviche', 'futbol', 'salsa', 'turismo']
        },
        'colombia': {
          cities: ['bogota', 'medellin', 'cali'],
          timezone: 'America/Bogota',
          peakHours: [18, 19, 20],
          culturalEvents: ['carnaval_barranquilla', 'feria_flores', 'independencia'],
          localInterests: ['arepa', 'futbol', 'vallenato', 'cafe']
        },
        'mexico': {
          cities: ['cdmx', 'guadalajara', 'monterrey'],
          timezone: 'America/Mexico_City',
          peakHours: [20, 21, 22],
          culturalEvents: ['dia_muertos', 'independencia', 'navidad'],
          localInterests: ['tacos', 'futbol', 'mariachi', 'lucha_libre']
        }
      },
      interests: {
        'fitness': {
          subCategories: ['gym', 'yoga', 'running', 'crossfit', 'nutrition'],
          demographics: ['gen_z', 'millennials'],
          peakTimes: [6, 7, 18, 19],
          seasonality: { high: ['enero', 'septiembre'], low: ['diciembre'] }
        },
        'food': {
          subCategories: ['recipes', 'restaurants', 'healthy', 'desserts', 'drinks'],
          demographics: ['millennials', 'gen_x'],
          peakTimes: [11, 12, 18, 19, 20],
          seasonality: { high: ['diciembre', 'julio'], low: ['febrero'] }
        },
        'fashion': {
          subCategories: ['streetwear', 'luxury', 'sustainable', 'vintage', 'accessories'],
          demographics: ['gen_z', 'millennials'],
          peakTimes: [10, 11, 18, 19],
          seasonality: { high: ['marzo', 'septiembre'], low: ['enero'] }
        },
        'tech': {
          subCategories: ['gadgets', 'apps', 'ai', 'gaming', 'productivity'],
          demographics: ['gen_z', 'millennials', 'gen_x'],
          peakTimes: [9, 14, 15, 21],
          seasonality: { high: ['noviembre', 'enero'], low: ['agosto'] }
        }
      }
    },
    targeting: {
      precision: 'high', // low, medium, high
      crossSegment: true,
      adaptiveSegmentation: true,
      realTimeAdjustment: true
    }
  });

  // Función principal de segmentación demográfica
  const segmentAudienceForContent = (contentData, targetSegments = null) => {
    const { niche, platform, content, scheduledTime } = contentData;

    // Si no se especifican segmentos, detectar automáticamente
    const segments = targetSegments || detectOptimalSegments(contentData);

    const segmentedContent = [];

    segments.forEach(segment => {
      const segmentedPost = createSegmentedContent(contentData, segment);
      if (segmentedPost) {
        segmentedContent.push(segmentedPost);
      }
    });

    return segmentedContent;
  };

  // Detectar segmentos óptimos automáticamente
  const detectOptimalSegments = (contentData) => {
    const { niche, platform, content } = contentData;
    const optimalSegments = [];

    // Segmentación por edad basada en nicho
    const ageSegments = getAgeSegmentsForNiche(niche);
    optimalSegments.push(...ageSegments);

    // Segmentación por ubicación basada en contenido
    const locationSegments = getLocationSegmentsForContent(content);
    optimalSegments.push(...locationSegments);

    // Segmentación por intereses basada en análisis de contenido
    const interestSegments = getInterestSegmentsForContent(content, niche);
    optimalSegments.push(...interestSegments);

    return optimalSegments.slice(0, 5); // Limitar a 5 segmentos principales
  };

  // Obtener segmentos de edad para nicho
  const getAgeSegmentsForNiche = (niche) => {
    const nicheAgeMapping = {
      fitness: ['gen_z', 'millennials'],
      food: ['millennials', 'gen_x'],
      fashion: ['gen_z', 'millennials'],
      tech: ['gen_z', 'millennials', 'gen_x'],
      business: ['millennials', 'gen_x'],
      travel: ['millennials', 'gen_z'],
      health: ['millennials', 'gen_x', 'boomers']
    };

    return (nicheAgeMapping[niche] || ['millennials']).map(age => ({
      type: 'age',
      value: age,
      data: demographicSegmentationEngine.segments.age[age]
    }));
  };

  // Obtener segmentos de ubicación para contenido
  const getLocationSegmentsForContent = (content) => {
    const locationKeywords = {
      ecuador: ['ecuador', 'quito', 'guayaquil', 'ceviche', 'andes'],
      colombia: ['colombia', 'bogotá', 'medellín', 'arepa', 'café'],
      mexico: ['méxico', 'cdmx', 'guadalajara', 'tacos', 'mariachi']
    };

    const detectedLocations = [];
    const contentLower = content.toLowerCase();

    Object.entries(locationKeywords).forEach(([location, keywords]) => {
      if (keywords.some(keyword => contentLower.includes(keyword))) {
        detectedLocations.push({
          type: 'location',
          value: location,
          data: demographicSegmentationEngine.segments.location[location]
        });
      }
    });

    // Si no se detecta ubicación específica, usar todas
    return detectedLocations.length > 0 ? detectedLocations : [
      { type: 'location', value: 'ecuador', data: demographicSegmentationEngine.segments.location.ecuador },
      { type: 'location', value: 'colombia', data: demographicSegmentationEngine.segments.location.colombia },
      { type: 'location', value: 'mexico', data: demographicSegmentationEngine.segments.location.mexico }
    ];
  };

  // Obtener segmentos de intereses para contenido
  const getInterestSegmentsForContent = (content, niche) => {
    const interestData = demographicSegmentationEngine.segments.interests[niche];

    if (!interestData) return [];

    return [{
      type: 'interest',
      value: niche,
      data: interestData
    }];
  };

  // Crear contenido segmentado
  const createSegmentedContent = (originalContent, segment) => {
    const segmentedPost = {
      ...originalContent,
      id: `${originalContent.id}_${segment.type}_${segment.value}`,
      originalId: originalContent.id,
      segment: segment,
      targetDemographic: segment.value,
      segmentationType: segment.type
    };

    // Adaptar contenido según segmento
    switch (segment.type) {
      case 'age':
        segmentedPost.content = adaptContentForAge(originalContent.content, segment.value, originalContent.niche);
        segmentedPost.hashtags = adaptHashtagsForAge(originalContent.hashtags, segment.value);
        segmentedPost.platform = selectOptimalPlatformForAge(segment.value, originalContent.platform);
        break;

      case 'location':
        segmentedPost.content = adaptContentForLocation(originalContent.content, segment.value, originalContent.niche);
        segmentedPost.hashtags = adaptHashtagsForLocation(originalContent.hashtags, segment.value);
        segmentedPost.scheduledDate = adaptTimingForLocation(originalContent.scheduledDate, segment.value);
        break;

      case 'interest':
        segmentedPost.content = adaptContentForInterest(originalContent.content, segment.value, segment.data);
        segmentedPost.hashtags = adaptHashtagsForInterest(originalContent.hashtags, segment.value);
        break;
    }

    // Calcular métricas específicas del segmento
    segmentedPost.segmentMetrics = calculateSegmentMetrics(segmentedPost, segment);

    return segmentedPost;
  };

  // Adaptar contenido para edad
  const adaptContentForAge = (content, ageGroup, niche) => {
    const ageAdaptations = {
      gen_z: {
        tone: 'casual',
        slang: ['periodt', 'no cap', 'fr fr', 'slaps', 'hits different'],
        emojis: ['💯', '🔥', '✨', '👑', '🚀'],
        format: 'short_punchy'
      },
      millennials: {
        tone: 'relatable',
        slang: ['adulting', 'mood', 'same energy', 'living for this'],
        emojis: ['😍', '🙌', '💪', '✨', '❤️'],
        format: 'storytelling'
      },
      gen_x: {
        tone: 'professional',
        slang: ['game changer', 'next level', 'worth it'],
        emojis: ['👍', '💼', '🎯', '⭐', '🔝'],
        format: 'informative'
      },
      boomers: {
        tone: 'respectful',
        slang: ['wonderful', 'excellent', 'remarkable'],
        emojis: ['😊', '👏', '🌟', '💝', '🙏'],
        format: 'detailed'
      }
    };

    const adaptation = ageAdaptations[ageGroup];
    if (!adaptation) return content;

    let adaptedContent = content;

    // Añadir slang apropiado
    const randomSlang = adaptation.slang[Math.floor(Math.random() * adaptation.slang.length)];
    adaptedContent = `${adaptedContent} ${randomSlang}!`;

    // Añadir emojis apropiados
    const randomEmojis = adaptation.emojis.slice(0, 2);
    adaptedContent = `${adaptedContent} ${randomEmojis.join(' ')}`;

    return adaptedContent;
  };

  // Adaptar contenido para ubicación
  const adaptContentForLocation = (content, location, niche) => {
    const locationAdaptations = {
      ecuador: {
        greetings: ['¡Hola Ecuador!', '¡Saludos desde Ecuador!', '¡Para toda la familia ecuatoriana!'],
        localTerms: ['chevere', 'bacán', 'de una'],
        culturalRefs: ['como en las fiestas de Quito', 'al estilo ecuatoriano', 'tradición de nuestros abuelos']
      },
      colombia: {
        greetings: ['¡Hola Colombia!', '¡Saludos parceros!', '¡Para toda Colombia!'],
        localTerms: ['chimba', 'bacano', 'parce'],
        culturalRefs: ['como en el Carnaval de Barranquilla', 'al estilo paisa', 'tradición colombiana']
      },
      mexico: {
        greetings: ['¡Hola México!', '¡Saludos paisanos!', '¡Para todo México!'],
        localTerms: ['padrísimo', 'chévere', 'órale'],
        culturalRefs: ['como en el Día de Muertos', 'al estilo mexicano', 'tradición azteca']
      }
    };

    const adaptation = locationAdaptations[location];
    if (!adaptation) return content;

    const greeting = adaptation.greetings[Math.floor(Math.random() * adaptation.greetings.length)];
    const localTerm = adaptation.localTerms[Math.floor(Math.random() * adaptation.localTerms.length)];

    return `${greeting} ${content} ¡Está ${localTerm}!`;
  };

  // Adaptar hashtags para edad
  const adaptHashtagsForAge = (originalHashtags, ageGroup) => {
    const ageHashtags = {
      gen_z: ['#GenZ', '#Viral', '#Trending', '#NoSkips', '#MainCharacter'],
      millennials: ['#Millennial', '#Adulting', '#SelfCare', '#Mindful', '#Authentic'],
      gen_x: ['#GenX', '#Professional', '#Quality', '#Experience', '#Wisdom'],
      boomers: ['#BabyBoomer', '#Classic', '#Timeless', '#Traditional', '#Family']
    };

    const additionalTags = ageHashtags[ageGroup] || [];
    return [...originalHashtags, ...additionalTags.slice(0, 3)].slice(0, 10);
  };

  // Adaptar hashtags para ubicación
  const adaptHashtagsForLocation = (originalHashtags, location) => {
    const locationHashtags = {
      ecuador: ['#Ecuador', '#Quito', '#Guayaquil', '#EcuadorContent', '#MitadDelMundo'],
      colombia: ['#Colombia', '#Bogotá', '#Medellín', '#ColombiaContent', '#PaisaStyle'],
      mexico: ['#México', '#CDMX', '#Guadalajara', '#MexicoContent', '#VivaMéxico']
    };

    const additionalTags = locationHashtags[location] || [];
    return [...originalHashtags, ...additionalTags.slice(0, 3)].slice(0, 10);
  };

  // Adaptar hashtags para intereses
  const adaptHashtagsForInterest = (originalHashtags, interest) => {
    const interestHashtags = {
      fitness: ['#FitnessMotivation', '#HealthyLifestyle', '#WorkoutGoals', '#FitLife'],
      food: ['#Foodie', '#RecipeOfTheDay', '#FoodLover', '#Delicious'],
      fashion: ['#OOTD', '#StyleInspo', '#FashionTrends', '#StyleGoals'],
      tech: ['#TechTips', '#Innovation', '#DigitalLife', '#TechReview']
    };

    const additionalTags = interestHashtags[interest] || [];
    return [...originalHashtags, ...additionalTags.slice(0, 3)].slice(0, 10);
  };

  // Seleccionar plataforma óptima para edad
  const selectOptimalPlatformForAge = (ageGroup, originalPlatform) => {
    const agePlatforms = demographicSegmentationEngine.segments.age[ageGroup]?.platforms || [originalPlatform];

    // Si la plataforma original es óptima para la edad, mantenerla
    if (agePlatforms.includes(originalPlatform)) {
      return originalPlatform;
    }

    // Sino, seleccionar la primera plataforma óptima
    return agePlatforms[0];
  };

  // Adaptar timing para ubicación
  const adaptTimingForLocation = (originalDate, location) => {
    const locationData = demographicSegmentationEngine.segments.location[location];
    if (!locationData) return originalDate;

    const adaptedDate = new Date(originalDate);
    const peakHours = locationData.peakHours;
    const optimalHour = peakHours[Math.floor(Math.random() * peakHours.length)];

    adaptedDate.setHours(optimalHour, Math.floor(Math.random() * 60), 0, 0);

    return adaptedDate;
  };

  // Calcular métricas específicas del segmento
  const calculateSegmentMetrics = (segmentedPost, segment) => {
    const baseMetrics = {
      targetAudienceSize: 0,
      expectedEngagement: 0,
      segmentRelevance: 0,
      competitionLevel: 'medium'
    };

    switch (segment.type) {
      case 'age':
        baseMetrics.targetAudienceSize = getAudienceSizeForAge(segment.value);
        baseMetrics.expectedEngagement = getExpectedEngagementForAge(segment.value, segmentedPost.niche);
        break;

      case 'location':
        baseMetrics.targetAudienceSize = getAudienceSizeForLocation(segment.value);
        baseMetrics.expectedEngagement = getExpectedEngagementForLocation(segment.value, segmentedPost.niche);
        break;

      case 'interest':
        baseMetrics.targetAudienceSize = getAudienceSizeForInterest(segment.value);
        baseMetrics.expectedEngagement = getExpectedEngagementForInterest(segment.value);
        break;
    }

    baseMetrics.segmentRelevance = calculateSegmentRelevance(segmentedPost, segment);
    baseMetrics.competitionLevel = assessCompetitionLevel(segment, segmentedPost.niche);

    return baseMetrics;
  };

  // Funciones auxiliares para métricas
  const getAudienceSizeForAge = (ageGroup) => {
    const audienceSizes = {
      gen_z: 850000,
      millennials: 1200000,
      gen_x: 650000,
      boomers: 300000
    };
    return audienceSizes[ageGroup] || 500000;
  };

  const getExpectedEngagementForAge = (ageGroup, niche) => {
    const engagementRates = {
      gen_z: { fitness: 12, food: 8, fashion: 15, tech: 10 },
      millennials: { fitness: 10, food: 12, fashion: 9, tech: 11 },
      gen_x: { fitness: 7, food: 9, fashion: 6, tech: 8 },
      boomers: { fitness: 5, food: 7, fashion: 4, tech: 6 }
    };
    return engagementRates[ageGroup]?.[niche] || 8;
  };

  const getAudienceSizeForLocation = (location) => {
    const locationSizes = {
      ecuador: 450000,
      colombia: 1100000,
      mexico: 2800000
    };
    return locationSizes[location] || 600000;
  };

  const getExpectedEngagementForLocation = (location, niche) => {
    const locationEngagement = {
      ecuador: { fitness: 9, food: 13, fashion: 8, tech: 7 },
      colombia: { fitness: 11, food: 10, fashion: 12, tech: 9 },
      mexico: { fitness: 8, food: 11, fashion: 10, tech: 8 }
    };
    return locationEngagement[location]?.[niche] || 9;
  };

  const getAudienceSizeForInterest = (interest) => {
    const interestSizes = {
      fitness: 920000,
      food: 1350000,
      fashion: 780000,
      tech: 650000
    };
    return interestSizes[interest] || 800000;
  };

  const getExpectedEngagementForInterest = (interest) => {
    const interestEngagement = {
      fitness: 11,
      food: 10,
      fashion: 13,
      tech: 9
    };
    return interestEngagement[interest] || 10;
  };

  const calculateSegmentRelevance = (post, segment) => {
    // Calcular relevancia basada en coincidencias de contenido
    let relevance = 70; // Base score

    const content = post.content.toLowerCase();
    const segmentKeywords = getSegmentKeywords(segment);

    const matches = segmentKeywords.filter(keyword => content.includes(keyword.toLowerCase()));
    relevance += matches.length * 5;

    return Math.min(relevance, 100);
  };

  const getSegmentKeywords = (segment) => {
    const keywordMaps = {
      gen_z: ['viral', 'trending', 'aesthetic', 'vibe', 'energy'],
      millennials: ['authentic', 'sustainable', 'mindful', 'balance', 'growth'],
      gen_x: ['quality', 'reliable', 'professional', 'efficient', 'proven'],
      boomers: ['traditional', 'classic', 'family', 'trusted', 'timeless'],
      ecuador: ['ecuatoriano', 'quito', 'guayaquil', 'andes', 'costa'],
      colombia: ['colombiano', 'bogotá', 'paisa', 'caribe', 'café'],
      mexico: ['mexicano', 'cdmx', 'azteca', 'maya', 'mariachi']
    };

    return keywordMaps[segment.value] || [];
  };

  const assessCompetitionLevel = (segment, niche) => {
    const competitionMatrix = {
      gen_z: { fitness: 'high', food: 'medium', fashion: 'high', tech: 'medium' },
      millennials: { fitness: 'high', food: 'high', fashion: 'medium', tech: 'high' },
      gen_x: { fitness: 'medium', food: 'medium', fashion: 'low', tech: 'medium' },
      boomers: { fitness: 'low', food: 'low', fashion: 'low', tech: 'low' }
    };

    return competitionMatrix[segment.value]?.[niche] || 'medium';
  };

  // PUNTO 12: Personalización por región (Ecuador, Colombia, México)
  const [regionalPersonalizationEngine, setRegionalPersonalizationEngine] = useState({
    enabled: true,
    regions: {
      ecuador: {
        country: 'Ecuador',
        currency: 'USD',
        timezone: 'America/Guayaquil',
        language: 'es-EC',
        dialects: {
          coast: ['chevere', 'bacán', 'jajaja', 'ñaño', 'loco'],
          sierra: ['chuta', 'achachay', 'atatay', 'guambra', 'taita'],
          oriente: ['yapa', 'mishqui', 'alli', 'sumak', 'killa']
        },
        culturalElements: {
          food: ['ceviche', 'encebollado', 'hornado', 'llapingachos', 'fanesca', 'colada morada'],
          music: ['pasillo', 'san juanito', 'bomba', 'capishca', 'albazo'],
          festivals: ['carnaval', 'inti raymi', 'fiestas de quito', 'mama negra', 'año viejo'],
          landmarks: ['galápagos', 'cotopaxi', 'mitad del mundo', 'cuenca', 'baños'],
          sports: ['fútbol', 'ecuavolley', 'ciclismo', 'atletismo'],
          celebrities: ['jefferson farfán', 'enner valencia', 'antonio valencia', 'delfín quishpe']
        },
        marketingTrends: {
          popular_hashtags: ['#Ecuador', '#MitadDelMundo', '#TodoEcuador', '#EcuadorPrimero'],
          peak_engagement_times: [19, 20, 21],
          preferred_platforms: ['facebook', 'tiktok', 'instagram', 'whatsapp'],
          content_preferences: ['family_oriented', 'humor', 'local_pride', 'traditions']
        },
        economicFactors: {
          purchasing_power: 'medium',
          price_sensitivity: 'high',
          popular_payment_methods: ['efectivo', 'transferencia', 'tarjeta'],
          economic_seasons: {
            high: ['diciembre', 'julio', 'agosto'], // vacaciones, aguinaldos
            low: ['febrero', 'marzo', 'abril'] // post-navidad, inicio escolar
          }
        }
      },
      colombia: {
        country: 'Colombia',
        currency: 'COP',
        timezone: 'America/Bogota',
        language: 'es-CO',
        dialects: {
          paisa: ['parce', 'bacano', 'chimba', 'berraco', 'marica'],
          costeño: ['tigre', 'loco', 'brutal', 'jajajaja', 'ey'],
          rolo: ['parcero', 'hermano', 'loco', 'qué más', 'bacano'],
          santandereano: ['culicagado', 'hijuemadre', 'verraco', 'malparido']
        },
        culturalElements: {
          food: ['arepa', 'bandeja paisa', 'sancocho', 'empanadas', 'ajiaco', 'buñuelos'],
          music: ['vallenato', 'cumbia', 'salsa', 'reggaeton', 'champeta', 'bambuco'],
          festivals: ['carnaval de barranquilla', 'feria de flores', 'festival vallenato', 'rock al parque'],
          landmarks: ['cartagena', 'eje cafetero', 'ciudad perdida', 'caño cristales', 'guatapé'],
          sports: ['fútbol', 'ciclismo', 'boxeo', 'tejo'],
          celebrities: ['shakira', 'maluma', 'j balvin', 'carlos vives', 'falcao']
        },
        marketingTrends: {
          popular_hashtags: ['#Colombia', '#ColombiaEsBella', '#OrgullosamenteColombianos', '#VivaColombia'],
          peak_engagement_times: [18, 19, 20],
          preferred_platforms: ['facebook', 'instagram', 'tiktok', 'twitter'],
          content_preferences: ['music_dance', 'humor', 'beauty', 'entrepreneurship']
        },
        economicFactors: {
          purchasing_power: 'medium-high',
          price_sensitivity: 'medium',
          popular_payment_methods: ['tarjeta', 'nequi', 'daviplata', 'efectivo'],
          economic_seasons: {
            high: ['diciembre', 'junio', 'julio'], // prima, vacaciones
            low: ['enero', 'febrero', 'marzo'] // post-navidad
          }
        }
      },
      mexico: {
        country: 'México',
        currency: 'MXN',
        timezone: 'America/Mexico_City',
        language: 'es-MX',
        dialects: {
          chilango: ['wey', 'no mames', 'órale', 'chido', 'padrísimo'],
          norteño: ['compa', 'carnal', 'está chingón', 'ándale pues'],
          tapatío: ['órale pues', 'está padrísimo', 'qué onda', 'está chido'],
          yucateco: ['bix a bel', 'tuux', 'mixba', 'chen', 'wayab']
        },
        culturalElements: {
          food: ['tacos', 'quesadillas', 'pozole', 'mole', 'tamales', 'chiles en nogada'],
          music: ['mariachi', 'banda', 'norteño', 'ranchera', 'reggaeton mexicano'],
          festivals: ['día de muertos', 'cinco de mayo', 'grito de independencia', 'día de la virgen'],
          landmarks: ['chichen itzá', 'teotihuacán', 'cancún', 'puerto vallarta', 'oaxaca'],
          sports: ['fútbol', 'lucha libre', 'béisbol', 'boxeo'],
          celebrities: ['luis miguel', 'thalia', 'eugenio derbez', 'salma hayek', 'chicharito']
        },
        marketingTrends: {
          popular_hashtags: ['#México', '#VivaMéxico', '#OrgulloMexicano', '#MéxicoMágico'],
          peak_engagement_times: [20, 21, 22],
          preferred_platforms: ['facebook', 'tiktok', 'instagram', 'youtube'],
          content_preferences: ['family_values', 'humor', 'traditions', 'food_culture']
        },
        economicFactors: {
          purchasing_power: 'medium',
          price_sensitivity: 'medium',
          popular_payment_methods: ['tarjeta', 'oxxo pay', 'spei', 'efectivo'],
          economic_seasons: {
            high: ['diciembre', 'julio', 'agosto', 'septiembre'], // fiestas patrias, vacaciones
            low: ['enero', 'febrero'] // cuesta de enero
          }
        }
      }
    },
    personalizationStrategies: {
      content_adaptation: true,
      cultural_references: true,
      local_slang: true,
      regional_hashtags: true,
      economic_awareness: true,
      seasonal_adjustment: true
    }
  });

  // Función principal de personalización regional
  const personalizeContentForRegion = (originalContent, targetRegion, personalizationLevel = 'high') => {
    const regionData = regionalPersonalizationEngine.regions[targetRegion];
    if (!regionData) return originalContent;

    const personalizedContent = {
      ...originalContent,
      id: `${originalContent.id}_region_${targetRegion}`,
      originalId: originalContent.id,
      targetRegion: targetRegion,
      personalizationLevel: personalizationLevel,
      regionData: regionData
    };

    // Aplicar diferentes niveles de personalización
    switch (personalizationLevel) {
      case 'high':
        personalizedContent.content = applyFullRegionalPersonalization(originalContent.content, regionData, originalContent.niche);
        personalizedContent.hashtags = addRegionalHashtags(originalContent.hashtags, regionData);
        personalizedContent.scheduledDate = adjustForRegionalTiming(originalContent.scheduledDate, regionData);
        personalizedContent.culturalAdaptations = generateCulturalAdaptations(originalContent, regionData);
        break;

      case 'medium':
        personalizedContent.content = applyMediumRegionalPersonalization(originalContent.content, regionData);
        personalizedContent.hashtags = addRegionalHashtags(originalContent.hashtags, regionData);
        break;

      case 'low':
        personalizedContent.content = applyLightRegionalPersonalization(originalContent.content, regionData);
        break;
    }

    // Añadir métricas regionales
    personalizedContent.regionalMetrics = calculateRegionalMetrics(personalizedContent, regionData);

    return personalizedContent;
  };

  // Personalización completa (nivel alto)
  const applyFullRegionalPersonalization = (content, regionData, niche) => {
    let personalizedContent = content;

    // 1. Añadir saludo regional
    const regionalGreeting = getRegionalGreeting(regionData);
    personalizedContent = `${regionalGreeting} ${personalizedContent}`;

    // 2. Incorporar dialecto local
    const localSlang = getRandomDialect(regionData);
    personalizedContent = `${personalizedContent} ¡Está ${localSlang}!`;

    // 3. Añadir referencia cultural específica
    const culturalRef = getCulturalReference(regionData, niche);
    if (culturalRef) {
      personalizedContent = `${personalizedContent} ${culturalRef}`;
    }

    // 4. Incorporar elemento económico si es relevante
    const economicContext = getEconomicContext(regionData, niche);
    if (economicContext) {
      personalizedContent = `${personalizedContent} ${economicContext}`;
    }

    return personalizedContent;
  };

  // Personalización media
  const applyMediumRegionalPersonalization = (content, regionData) => {
    let personalizedContent = content;

    // Añadir saludo y dialecto básico
    const regionalGreeting = getRegionalGreeting(regionData);
    const localSlang = getRandomDialect(regionData);

    personalizedContent = `${regionalGreeting} ${personalizedContent} ¡${localSlang}!`;

    return personalizedContent;
  };

  // Personalización ligera
  const applyLightRegionalPersonalization = (content, regionData) => {
    const regionalGreeting = getRegionalGreeting(regionData);
    return `${regionalGreeting} ${content}`;
  };

  // Obtener saludo regional
  const getRegionalGreeting = (regionData) => {
    const greetings = {
      Ecuador: ['¡Hola Ecuador!', '¡Saludos compatriotas!', '¡Para toda la familia ecuatoriana!'],
      Colombia: ['¡Hola Colombia!', '¡Saludos parceros!', '¡Para toda Colombia bella!'],
      México: ['¡Hola México!', '¡Saludos paisanos!', '¡Para todo México lindo!']
    };

    const countryGreetings = greetings[regionData.country] || ['¡Hola!'];
    return countryGreetings[Math.floor(Math.random() * countryGreetings.length)];
  };

  // Obtener dialecto aleatorio
  const getRandomDialect = (regionData) => {
    const allDialects = Object.values(regionData.dialects).flat();
    return allDialects[Math.floor(Math.random() * allDialects.length)];
  };

  // Obtener referencia cultural específica por nicho
  const getCulturalReference = (regionData, niche) => {
    const culturalMappings = {
      food: regionData.culturalElements.food,
      music: regionData.culturalElements.music,
      fitness: regionData.culturalElements.sports,
      travel: regionData.culturalElements.landmarks,
      entertainment: regionData.culturalElements.celebrities
    };

    const relevantElements = culturalMappings[niche] || regionData.culturalElements.festivals;
    if (relevantElements.length === 0) return null;

    const element = relevantElements[Math.floor(Math.random() * relevantElements.length)];

    const referenceTemplates = [
      `Como ${element} de ${regionData.country}`,
      `Al estilo de ${element}`,
      `Inspirado en ${element}`,
      `Tradición de ${element}`
    ];

    return referenceTemplates[Math.floor(Math.random() * referenceTemplates.length)];
  };

  // Obtener contexto económico
  const getEconomicContext = (regionData, niche) => {
    const currentMonth = new Date().toLocaleString('es', { month: 'long' });
    const isHighSeason = regionData.economicFactors.economic_seasons.high.includes(currentMonth);
    const isLowSeason = regionData.economicFactors.economic_seasons.low.includes(currentMonth);

    if (niche === 'business' || niche === 'finance') {
      if (isHighSeason) {
        return `¡Perfecto para esta temporada alta en ${regionData.country}!`;
      } else if (isLowSeason) {
        return `¡Ideal para optimizar gastos en ${regionData.country}!`;
      }
    }

    if (regionData.economicFactors.price_sensitivity === 'high' && (niche === 'shopping' || niche === 'food')) {
      return `¡Excelente relación calidad-precio para ${regionData.country}!`;
    }

    return null;
  };

  // Añadir hashtags regionales
  const addRegionalHashtags = (originalHashtags, regionData) => {
    const regionalTags = [
      ...regionData.marketingTrends.popular_hashtags,
      `#${regionData.country}`,
      `#${regionData.country}Content`
    ];

    return [...originalHashtags, ...regionalTags.slice(0, 4)].slice(0, 12);
  };

  // Ajustar timing regional
  const adjustForRegionalTiming = (originalDate, regionData) => {
    const adjustedDate = new Date(originalDate);
    const peakTimes = regionData.marketingTrends.peak_engagement_times;
    const optimalHour = peakTimes[Math.floor(Math.random() * peakTimes.length)];

    adjustedDate.setHours(optimalHour, Math.floor(Math.random() * 60), 0, 0);

    return adjustedDate;
  };

  // Generar adaptaciones culturales completas
  const generateCulturalAdaptations = (originalContent, regionData) => {
    return {
      language: {
        dialect: getRandomDialect(regionData),
        formalityLevel: 'informal', // Latinoamérica prefiere informal
        localExpressions: Object.values(regionData.dialects).flat().slice(0, 3)
      },
      cultural: {
        references: [
          regionData.culturalElements.food[0],
          regionData.culturalElements.music[0],
          regionData.culturalElements.landmarks[0]
        ],
        festivals: regionData.culturalElements.festivals.slice(0, 2),
        celebrities: regionData.culturalElements.celebrities.slice(0, 2)
      },
      economic: {
        currency: regionData.currency,
        paymentMethods: regionData.economicFactors.popular_payment_methods,
        seasonality: getCurrentSeasonality(regionData),
        priceSensitivity: regionData.economicFactors.price_sensitivity
      },
      social: {
        platforms: regionData.marketingTrends.preferred_platforms,
        contentPreferences: regionData.marketingTrends.content_preferences,
        peakTimes: regionData.marketingTrends.peak_engagement_times
      }
    };
  };

  // Obtener estacionalidad actual
  const getCurrentSeasonality = (regionData) => {
    const currentMonth = new Date().toLocaleString('es', { month: 'long' });
    const economicSeasons = regionData.economicFactors.economic_seasons;

    if (economicSeasons.high.includes(currentMonth)) {
      return 'high';
    } else if (economicSeasons.low.includes(currentMonth)) {
      return 'low';
    }
    return 'medium';
  };

  // Calcular métricas regionales
  const calculateRegionalMetrics = (personalizedContent, regionData) => {
    const baseMetrics = {
      regionalRelevance: 0,
      culturalAlignment: 0,
      economicFit: 0,
      languageMatch: 0,
      expectedRegionalEngagement: 0
    };

    // Calcular relevancia regional (0-100)
    baseMetrics.regionalRelevance = calculateRegionalRelevance(personalizedContent, regionData);

    // Calcular alineación cultural (0-100)
    baseMetrics.culturalAlignment = calculateCulturalAlignment(personalizedContent, regionData);

    // Calcular ajuste económico (0-100)
    baseMetrics.economicFit = calculateEconomicFit(personalizedContent, regionData);

    // Calcular coincidencia de idioma/dialecto (0-100)
    baseMetrics.languageMatch = calculateLanguageMatch(personalizedContent, regionData);

    // Calcular engagement esperado para la región
    baseMetrics.expectedRegionalEngagement = calculateExpectedRegionalEngagement(personalizedContent, regionData);

    return baseMetrics;
  };

  // Funciones auxiliares para métricas regionales
  const calculateRegionalRelevance = (content, regionData) => {
    let relevance = 60; // Base score

    const contentText = content.content.toLowerCase();

    // Verificar menciones del país
    if (contentText.includes(regionData.country.toLowerCase())) {
      relevance += 15;
    }

    // Verificar elementos culturales
    const culturalElements = Object.values(regionData.culturalElements).flat();
    const culturalMatches = culturalElements.filter(element =>
      contentText.includes(element.toLowerCase())
    );
    relevance += culturalMatches.length * 5;

    // Verificar dialecto local
    const dialectWords = Object.values(regionData.dialects).flat();
    const dialectMatches = dialectWords.filter(word =>
      contentText.includes(word.toLowerCase())
    );
    relevance += dialectMatches.length * 3;

    return Math.min(relevance, 100);
  };

  const calculateCulturalAlignment = (content, regionData) => {
    let alignment = 70; // Base score

    // Verificar si el contenido respeta las preferencias culturales
    const contentPreferences = regionData.marketingTrends.content_preferences;
    const contentText = content.content.toLowerCase();

    contentPreferences.forEach(preference => {
      const preferenceKeywords = {
        family_oriented: ['familia', 'hijos', 'padres', 'abuelos', 'hermanos'],
        humor: ['jaja', 'gracioso', 'divertido', 'risa', 'cómico'],
        local_pride: ['orgullo', 'tradición', 'cultura', 'raíces', 'identidad'],
        traditions: ['tradición', 'costumbre', 'ancestral', 'típico', 'folclore']
      };

      const keywords = preferenceKeywords[preference] || [];
      const matches = keywords.filter(keyword => contentText.includes(keyword));
      alignment += matches.length * 4;
    });

    return Math.min(alignment, 100);
  };

  const calculateEconomicFit = (content, regionData) => {
    let fit = 75; // Base score

    const currentSeasonality = getCurrentSeasonality(regionData);
    const niche = content.niche;

    // Ajustar según estacionalidad económica
    if (currentSeasonality === 'high' && ['shopping', 'travel', 'entertainment'].includes(niche)) {
      fit += 15;
    } else if (currentSeasonality === 'low' && ['finance', 'education', 'health'].includes(niche)) {
      fit += 10;
    }

    // Ajustar según sensibilidad al precio
    if (regionData.economicFactors.price_sensitivity === 'high') {
      const priceKeywords = ['barato', 'económico', 'oferta', 'descuento', 'gratis'];
      const contentText = content.content.toLowerCase();
      const priceMatches = priceKeywords.filter(keyword => contentText.includes(keyword));
      fit += priceMatches.length * 5;
    }

    return Math.min(fit, 100);
  };

  const calculateLanguageMatch = (content, regionData) => {
    let match = 80; // Base score para español

    const contentText = content.content.toLowerCase();
    const allDialects = Object.values(regionData.dialects).flat();

    // Verificar uso de dialecto local
    const dialectMatches = allDialects.filter(word => contentText.includes(word.toLowerCase()));
    match += dialectMatches.length * 4;

    return Math.min(match, 100);
  };

  const calculateExpectedRegionalEngagement = (content, regionData) => {
    const baseEngagement = 8; // Base engagement rate

    // Factores de mejora regional
    const relevanceBonus = (calculateRegionalRelevance(content, regionData) - 60) / 10;
    const culturalBonus = (calculateCulturalAlignment(content, regionData) - 70) / 15;
    const economicBonus = (calculateEconomicFit(content, regionData) - 75) / 12;

    const totalEngagement = baseEngagement + relevanceBonus + culturalBonus + economicBonus;

    return Math.max(totalEngagement, 3); // Mínimo 3% engagement
  };

  // Función para personalizar múltiples regiones automáticamente
  const createMultiRegionalContent = (originalContent, targetRegions = ['ecuador', 'colombia', 'mexico']) => {
    const regionalVariants = [];

    targetRegions.forEach(region => {
      const personalizedContent = personalizeContentForRegion(originalContent, region, 'high');
      regionalVariants.push(personalizedContent);
    });

    return regionalVariants;
  };

  // PUNTO 13: Adaptación por plataforma (formato TikTok vs Instagram)
  const [platformAdaptationEngine, setPlatformAdaptationEngine] = useState({
    enabled: true,
    platforms: {
      tiktok: {
        name: 'TikTok',
        maxDuration: 180, // segundos
        aspectRatio: '9:16',
        contentFormat: {
          textLength: { min: 50, max: 150, optimal: 80 },
          hashtagCount: { min: 3, max: 5, optimal: 4 },
          hookTime: 3, // segundos para enganchar
          callToAction: 'mandatory',
          musicImportance: 'critical',
          trendingElements: 'essential'
        },
        contentStyle: {
          tone: 'casual',
          pace: 'fast',
          editing: 'dynamic',
          effects: ['transitions', 'filters', 'text_overlay'],
          structure: ['hook', 'content', 'cta']
        },
        algorithmFactors: {
          completion_rate: 40, // % importancia
          engagement_speed: 30,
          shares: 20,
          comments: 10
        },
        bestPractices: {
          timing: [19, 20, 21, 22], // horas pico
          frequency: 'daily',
          trending_sounds: true,
          vertical_video: true,
          captions: true
        }
      },
      instagram: {
        name: 'Instagram',
        formats: {
          feed: {
            aspectRatio: '1:1',
            textLength: { min: 100, max: 300, optimal: 200 },
            hashtagCount: { min: 8, max: 15, optimal: 12 }
          },
          stories: {
            aspectRatio: '9:16',
            textLength: { min: 20, max: 80, optimal: 50 },
            hashtagCount: { min: 3, max: 8, optimal: 5 }
          },
          reels: {
            aspectRatio: '9:16',
            maxDuration: 90,
            textLength: { min: 50, max: 120, optimal: 80 },
            hashtagCount: { min: 5, max: 10, optimal: 7 }
          }
        },
        contentStyle: {
          tone: 'aspirational',
          pace: 'medium',
          editing: 'polished',
          effects: ['filters', 'boomerang', 'layout'],
          structure: ['visual_hook', 'story', 'engagement']
        },
        algorithmFactors: {
          engagement_rate: 35,
          saves: 25,
          shares: 20,
          time_spent: 20
        },
        bestPractices: {
          timing: [18, 19, 20], // horas pico
          frequency: '1-2_daily',
          high_quality_visuals: true,
          carousel_posts: true,
          user_generated_content: true
        }
      },
      youtube: {
        name: 'YouTube',
        formats: {
          shorts: {
            aspectRatio: '9:16',
            maxDuration: 60,
            textLength: { min: 80, max: 200, optimal: 120 }
          },
          regular: {
            aspectRatio: '16:9',
            minDuration: 300,
            textLength: { min: 200, max: 500, optimal: 300 }
          }
        },
        contentStyle: {
          tone: 'educational',
          pace: 'moderate',
          editing: 'professional',
          effects: ['thumbnails', 'chapters', 'end_screens'],
          structure: ['intro', 'main_content', 'conclusion', 'subscribe']
        },
        algorithmFactors: {
          watch_time: 50,
          click_through_rate: 25,
          engagement: 15,
          retention: 10
        },
        bestPractices: {
          timing: [14, 15, 20, 21],
          frequency: 'weekly',
          thumbnails: true,
          seo_optimization: true,
          playlists: true
        }
      },
      facebook: {
        name: 'Facebook',
        contentFormat: {
          textLength: { min: 150, max: 400, optimal: 250 },
          hashtagCount: { min: 2, max: 5, optimal: 3 },
          linkPreviews: true,
          nativeVideo: true
        },
        contentStyle: {
          tone: 'conversational',
          pace: 'slow',
          editing: 'minimal',
          effects: ['live_video', 'polls', 'events'],
          structure: ['context', 'main_message', 'discussion']
        },
        algorithmFactors: {
          meaningful_interactions: 40,
          time_spent: 30,
          shares: 20,
          comments: 10
        },
        bestPractices: {
          timing: [15, 18, 19],
          frequency: '3-5_weekly',
          community_building: true,
          live_content: true,
          groups: true
        }
      }
    },
    adaptationStrategies: {
      content_reformatting: true,
      platform_specific_hooks: true,
      optimal_timing: true,
      hashtag_optimization: true,
      visual_adaptation: true,
      cta_customization: true
    }
  });

  // Función principal de adaptación por plataforma
  const adaptContentForPlatform = (originalContent, targetPlatform, adaptationLevel = 'full') => {
    const platformData = platformAdaptationEngine.platforms[targetPlatform];
    if (!platformData) return originalContent;

    const adaptedContent = {
      ...originalContent,
      id: `${originalContent.id}_platform_${targetPlatform}`,
      originalId: originalContent.id,
      platform: targetPlatform,
      adaptationLevel: adaptationLevel,
      platformData: platformData
    };

    // Aplicar adaptaciones específicas por plataforma
    switch (targetPlatform) {
      case 'tiktok':
        adaptedContent.content = adaptForTikTok(originalContent.content, originalContent.niche);
        adaptedContent.hashtags = optimizeHashtagsForTikTok(originalContent.hashtags);
        adaptedContent.videoSpecs = generateTikTokVideoSpecs(originalContent);
        adaptedContent.musicSuggestion = suggestTikTokMusic(originalContent.niche);
        break;

      case 'instagram':
        const instagramFormat = determineInstagramFormat(originalContent);
        adaptedContent.content = adaptForInstagram(originalContent.content, instagramFormat, originalContent.niche);
        adaptedContent.hashtags = optimizeHashtagsForInstagram(originalContent.hashtags, instagramFormat);
        adaptedContent.visualSpecs = generateInstagramVisualSpecs(originalContent, instagramFormat);
        adaptedContent.instagramFormat = instagramFormat;
        break;

      case 'youtube':
        const youtubeFormat = determineYouTubeFormat(originalContent);
        adaptedContent.content = adaptForYouTube(originalContent.content, youtubeFormat, originalContent.niche);
        adaptedContent.hashtags = optimizeHashtagsForYouTube(originalContent.hashtags);
        adaptedContent.videoSpecs = generateYouTubeVideoSpecs(originalContent, youtubeFormat);
        adaptedContent.youtubeFormat = youtubeFormat;
        break;

      case 'facebook':
        adaptedContent.content = adaptForFacebook(originalContent.content, originalContent.niche);
        adaptedContent.hashtags = optimizeHashtagsForFacebook(originalContent.hashtags);
        adaptedContent.engagementStrategy = generateFacebookEngagementStrategy(originalContent);
        break;
    }

    // Calcular métricas específicas de la plataforma
    adaptedContent.platformMetrics = calculatePlatformMetrics(adaptedContent, platformData);

    return adaptedContent;
  };

  // Adaptación específica para TikTok
  const adaptForTikTok = (content, niche) => {
    const tiktokHooks = {
      fitness: ['POV:', 'Day 1 vs Day 30:', '3 ejercicios que cambiaron mi vida:', 'Nadie me dijo que:'],
      food: ['Receta viral:', 'Plot twist:', '3 ingredientes:', 'Mi abuela vs yo:'],
      fashion: ['Outfit check:', 'Thrift flip:', 'Style hack:', 'Get ready with me:'],
      tech: ['Life hack:', 'App que necesitas:', 'Antes vs después:', 'Mind blown:']
    };

    const hooks = tiktokHooks[niche] || tiktokHooks.fitness;
    const selectedHook = hooks[Math.floor(Math.random() * hooks.length)];

    // Acortar contenido para TikTok (máximo 80 caracteres)
    let tiktokContent = content.length > 80 ? content.substring(0, 77) + '...' : content;

    // Añadir hook viral
    tiktokContent = `${selectedHook} ${tiktokContent}`;

    // Añadir elementos trending
    const trendingElements = ['✨', '🔥', '💯', '👀', '🚀'];
    const randomEmoji = trendingElements[Math.floor(Math.random() * trendingElements.length)];

    return `${tiktokContent} ${randomEmoji}`;
  };

  // Adaptación específica para Instagram
  const adaptForInstagram = (content, format, niche) => {
    const instagramStyles = {
      feed: {
        fitness: 'Transformación que inspira ✨',
        food: 'Sabores que enamoran 🍽️',
        fashion: 'Style que marca tendencia 👗',
        tech: 'Innovación que sorprende 📱'
      },
      stories: {
        fitness: '💪 Rutina del día',
        food: '🍴 Antojo del momento',
        fashion: '✨ Look de hoy',
        tech: '📱 Tip rápido'
      },
      reels: {
        fitness: 'Transformación en segundos ⚡',
        food: 'Receta express 🔥',
        fashion: 'Outfit transition ✨',
        tech: 'Hack que necesitas 💡'
      }
    };

    const stylePrefix = instagramStyles[format]?.[niche] || instagramStyles[format]?.fitness || '';

    let instagramContent = content;

    // Ajustar longitud según formato
    const formatSpecs = platformAdaptationEngine.platforms.instagram.formats[format];
    const maxLength = formatSpecs.textLength.optimal;

    if (instagramContent.length > maxLength) {
      instagramContent = instagramContent.substring(0, maxLength - 3) + '...';
    }

    // Añadir estilo específico de Instagram
    return `${stylePrefix}\n\n${instagramContent}\n\n¿Qué opinas? 💭`;
  };

  // Adaptación específica para YouTube
  const adaptForYouTube = (content, format, niche) => {
    const youtubeIntros = {
      shorts: {
        fitness: '¿Sabías que este ejercicio puede cambiar tu vida?',
        food: 'La receta más viral del momento:',
        fashion: 'El outfit hack que todos buscan:',
        tech: 'La app que revolucionará tu día:'
      },
      regular: {
        fitness: 'En este video te enseño la rutina completa que transformó mi físico',
        food: 'Hoy preparamos juntos esta receta increíble paso a paso',
        fashion: 'Te muestro cómo crear outfits increíbles con piezas básicas',
        tech: 'Descubre las mejores herramientas tecnológicas para optimizar tu vida'
      }
    };

    const intro = youtubeIntros[format]?.[niche] || youtubeIntros[format]?.fitness || '';

    let youtubeContent = `${intro}\n\n${content}`;

    // Añadir call to action específico de YouTube
    const ctas = [
      '\n\n¡No olvides suscribirte y activar la campanita! 🔔',
      '\n\n¿Te gustó? ¡Dale like y comparte! 👍',
      '\n\n¡Comenta qué tema quieres ver próximo! 💬'
    ];

    const selectedCTA = ctas[Math.floor(Math.random() * ctas.length)];
    youtubeContent += selectedCTA;

    return youtubeContent;
  };

  // Adaptación específica para Facebook
  const adaptForFacebook = (content, niche) => {
    const facebookStarters = {
      fitness: '¿Alguien más lucha con esto? 💪',
      food: 'Compartiendo esta delicia con ustedes 🍽️',
      fashion: 'Necesitaba compartir este look ✨',
      tech: 'Esto me facilitó mucho la vida 📱'
    };

    const starter = facebookStarters[niche] || facebookStarters.fitness;

    let facebookContent = `${starter}\n\n${content}`;

    // Añadir pregunta para generar engagement
    const engagementQuestions = [
      '\n\n¿Ustedes qué opinan?',
      '\n\n¿A alguien más le pasa?',
      '\n\n¿Qué experiencias han tenido?',
      '\n\n¿Recomiendan algo similar?'
    ];

    const question = engagementQuestions[Math.floor(Math.random() * engagementQuestions.length)];
    facebookContent += question;

    return facebookContent;
  };

  // Optimización de hashtags por plataforma
  const optimizeHashtagsForTikTok = (originalHashtags) => {
    const tiktokTrending = ['#fyp', '#viral', '#trending', '#parati', '#foryou'];
    const tiktokSpecific = ['#tiktokmademebuyit', '#tiktokdance', '#tiktokhack', '#tiktoktrend'];

    return [
      ...originalHashtags.slice(0, 2), // Mantener algunos originales
      ...tiktokTrending.slice(0, 2),
      ...tiktokSpecific.slice(0, 1)
    ].slice(0, 5);
  };

  const optimizeHashtagsForInstagram = (originalHashtags, format) => {
    const instagramGeneral = ['#instagood', '#photooftheday', '#instadaily', '#follow'];
    const formatSpecific = {
      feed: ['#instafeed', '#instaphoto', '#instapost'],
      stories: ['#instastories', '#storytime', '#behindthescenes'],
      reels: ['#reels', '#reelsinstagram', '#instareels', '#trending']
    };

    return [
      ...originalHashtags.slice(0, 6),
      ...instagramGeneral.slice(0, 3),
      ...formatSpecific[format].slice(0, 3)
    ].slice(0, 12);
  };

  const optimizeHashtagsForYouTube = (originalHashtags) => {
    const youtubeSpecific = ['#youtube', '#youtuber', '#subscribe', '#tutorial', '#howto'];

    return [
      ...originalHashtags.slice(0, 5),
      ...youtubeSpecific.slice(0, 3)
    ].slice(0, 8);
  };

  const optimizeHashtagsForFacebook = (originalHashtags) => {
    // Facebook usa menos hashtags
    return originalHashtags.slice(0, 3);
  };

  // Determinar formato óptimo por plataforma
  const determineInstagramFormat = (content) => {
    const contentLength = content.content.length;
    const hasVisualFocus = ['fashion', 'food', 'travel'].includes(content.niche);

    if (contentLength < 100 && hasVisualFocus) return 'stories';
    if (contentLength < 150) return 'reels';
    return 'feed';
  };

  const determineYouTubeFormat = (content) => {
    const contentLength = content.content.length;
    const isQuickTip = contentLength < 150;

    return isQuickTip ? 'shorts' : 'regular';
  };

  // Generar especificaciones técnicas
  const generateTikTokVideoSpecs = (content) => {
    return {
      duration: '15-30s',
      aspectRatio: '9:16',
      resolution: '1080x1920',
      fps: 30,
      format: 'MP4',
      effects: ['fast_cuts', 'trending_transition', 'text_overlay'],
      music: true,
      captions: true
    };
  };

  const generateInstagramVisualSpecs = (content, format) => {
    const specs = {
      feed: { aspectRatio: '1:1', resolution: '1080x1080' },
      stories: { aspectRatio: '9:16', resolution: '1080x1920' },
      reels: { aspectRatio: '9:16', resolution: '1080x1920', duration: '15-30s' }
    };

    return {
      ...specs[format],
      format: 'JPG/MP4',
      quality: 'high',
      filters: ['brightness', 'contrast', 'saturation'],
      branding: true
    };
  };

  const generateYouTubeVideoSpecs = (content, format) => {
    const specs = {
      shorts: {
        duration: '15-60s',
        aspectRatio: '9:16',
        resolution: '1080x1920'
      },
      regular: {
        duration: '5-15min',
        aspectRatio: '16:9',
        resolution: '1920x1080'
      }
    };

    return {
      ...specs[format],
      fps: 60,
      format: 'MP4',
      thumbnail: true,
      chapters: format === 'regular',
      endScreen: true
    };
  };

  // Sugerencias específicas por plataforma
  const suggestTikTokMusic = (niche) => {
    const musicByNiche = {
      fitness: ['Gym motivation beats', 'High energy electronic', 'Workout playlist hits'],
      food: ['Cooking show themes', 'Upbeat kitchen vibes', 'Food prep beats'],
      fashion: ['Runway music', 'Fashion week sounds', 'Style transformation beats'],
      tech: ['Futuristic sounds', 'Digital beats', 'Innovation themes']
    };

    const suggestions = musicByNiche[niche] || musicByNiche.fitness;
    return suggestions[Math.floor(Math.random() * suggestions.length)];
  };

  const generateFacebookEngagementStrategy = (content) => {
    return {
      postType: 'discussion_starter',
      engagementTactics: ['ask_question', 'share_experience', 'poll_option'],
      communityBuilding: true,
      responseStrategy: 'active_engagement',
      shareability: 'high'
    };
  };

  // Calcular métricas específicas de plataforma
  const calculatePlatformMetrics = (adaptedContent, platformData) => {
    const baseMetrics = {
      platformFit: 0,
      algorithmOptimization: 0,
      engagementPotential: 0,
      viralProbability: 0
    };

    // Calcular ajuste a la plataforma
    baseMetrics.platformFit = calculatePlatformFit(adaptedContent, platformData);

    // Calcular optimización para algoritmo
    baseMetrics.algorithmOptimization = calculateAlgorithmOptimization(adaptedContent, platformData);

    // Calcular potencial de engagement
    baseMetrics.engagementPotential = calculateEngagementPotential(adaptedContent, platformData);

    // Calcular probabilidad viral
    baseMetrics.viralProbability = calculateViralProbability(adaptedContent, platformData);

    return baseMetrics;
  };

  // Funciones auxiliares para métricas de plataforma
  const calculatePlatformFit = (content, platformData) => {
    let fit = 70; // Base score

    const contentLength = content.content.length;
    let optimalLength;

    // Obtener longitud óptima según plataforma
    if (platformData.contentFormat) {
      optimalLength = platformData.contentFormat.textLength.optimal;
    } else if (platformData.formats) {
      // Para Instagram, usar formato detectado
      const format = content.instagramFormat || 'feed';
      optimalLength = platformData.formats[format].textLength.optimal;
    }

    if (optimalLength) {
      const lengthDifference = Math.abs(contentLength - optimalLength);
      const lengthPenalty = Math.min(lengthDifference / 10, 20);
      fit -= lengthPenalty;
    }

    return Math.max(fit, 30);
  };

  const calculateAlgorithmOptimization = (content, platformData) => {
    let optimization = 60; // Base score

    // Verificar factores del algoritmo
    const algorithmFactors = platformData.algorithmFactors;

    if (algorithmFactors) {
      // Simular optimización basada en factores del algoritmo
      Object.keys(algorithmFactors).forEach(factor => {
        const weight = algorithmFactors[factor];
        const factorScore = Math.random() * 100; // Simular score del factor
        optimization += (factorScore * weight / 100) * 0.4;
      });
    }

    return Math.min(optimization, 100);
  };

  const calculateEngagementPotential = (content, platformData) => {
    let potential = 65; // Base score

    const contentText = content.content.toLowerCase();

    // Verificar elementos que aumentan engagement
    const engagementKeywords = ['pregunta', '¿', 'opinas', 'experiencia', 'comenta', 'comparte'];
    const keywordMatches = engagementKeywords.filter(keyword => contentText.includes(keyword));
    potential += keywordMatches.length * 5;

    // Verificar hashtags trending
    if (content.hashtags.some(tag => ['#viral', '#trending', '#fyp'].includes(tag))) {
      potential += 10;
    }

    return Math.min(potential, 100);
  };

  const calculateViralProbability = (content, platformData) => {
    let probability = 40; // Base score

    // Factores que aumentan viralidad
    const viralElements = {
      tiktok: ['pov', 'day 1 vs', 'plot twist', 'mind blown'],
      instagram: ['transformation', 'before after', 'tutorial', 'hack'],
      youtube: ['how to', 'tutorial', 'review', 'vs'],
      facebook: ['story', 'experience', 'opinion', 'discussion']
    };

    const platformElements = viralElements[content.platform] || [];
    const contentText = content.content.toLowerCase();

    const viralMatches = platformElements.filter(element => contentText.includes(element));
    probability += viralMatches.length * 8;

    return Math.min(probability, 85); // Máximo 85% probabilidad viral
  };

  // PUNTO 14: Timing por zona horaria automático
  const [timezoneOptimizationEngine, setTimezoneOptimizationEngine] = useState({
    enabled: true,
    timezones: {
      'America/Guayaquil': {
        country: 'Ecuador',
        utcOffset: -5,
        cities: ['Quito', 'Guayaquil', 'Cuenca'],
        peakHours: {
          weekdays: [7, 8, 12, 13, 18, 19, 20, 21],
          weekends: [9, 10, 11, 15, 16, 19, 20, 21, 22]
        },
        platformOptimal: {
          tiktok: [19, 20, 21, 22],
          instagram: [18, 19, 20],
          youtube: [20, 21, 22],
          facebook: [18, 19, 20]
        },
        demographicTiming: {
          gen_z: [19, 20, 21, 22, 23],
          millennials: [18, 19, 20, 21],
          gen_x: [17, 18, 19, 20],
          boomers: [16, 17, 18, 19]
        },
        workingHours: [8, 9, 10, 11, 14, 15, 16, 17],
        lunchBreak: [12, 13],
        eveningPeak: [18, 19, 20, 21]
      },
      'America/Bogota': {
        country: 'Colombia',
        utcOffset: -5,
        cities: ['Bogotá', 'Medellín', 'Cali'],
        peakHours: {
          weekdays: [7, 8, 12, 13, 18, 19, 20],
          weekends: [9, 10, 11, 15, 16, 19, 20, 21]
        },
        platformOptimal: {
          tiktok: [18, 19, 20, 21],
          instagram: [17, 18, 19, 20],
          youtube: [19, 20, 21],
          facebook: [17, 18, 19]
        },
        demographicTiming: {
          gen_z: [18, 19, 20, 21, 22],
          millennials: [17, 18, 19, 20],
          gen_x: [16, 17, 18, 19],
          boomers: [15, 16, 17, 18]
        },
        workingHours: [8, 9, 10, 11, 14, 15, 16, 17],
        lunchBreak: [12, 13],
        eveningPeak: [17, 18, 19, 20]
      },
      'America/Mexico_City': {
        country: 'México',
        utcOffset: -6,
        cities: ['CDMX', 'Guadalajara', 'Monterrey'],
        peakHours: {
          weekdays: [7, 8, 13, 14, 20, 21, 22],
          weekends: [10, 11, 12, 16, 17, 20, 21, 22, 23]
        },
        platformOptimal: {
          tiktok: [20, 21, 22, 23],
          instagram: [19, 20, 21],
          youtube: [21, 22, 23],
          facebook: [19, 20, 21]
        },
        demographicTiming: {
          gen_z: [20, 21, 22, 23, 24],
          millennials: [19, 20, 21, 22],
          gen_x: [18, 19, 20, 21],
          boomers: [17, 18, 19, 20]
        },
        workingHours: [9, 10, 11, 12, 15, 16, 17, 18],
        lunchBreak: [13, 14],
        eveningPeak: [19, 20, 21, 22]
      }
    },
    optimizationStrategies: {
      multi_timezone_posting: true,
      peak_hour_detection: true,
      demographic_timing: true,
      platform_specific_timing: true,
      seasonal_adjustments: true,
      real_time_optimization: true
    },
    schedulingRules: {
      avoid_working_hours: false, // Permitir posts en horario laboral
      prioritize_evening_peak: true,
      weekend_boost: true,
      lunch_break_opportunity: true
    }
  });

  // Función principal de optimización por zona horaria
  const optimizeTimingForTimezones = (originalContent, targetTimezones = null, schedulingStrategy = 'optimal') => {
    const timezones = targetTimezones || Object.keys(timezoneOptimizationEngine.timezones);
    const optimizedSchedules = [];

    timezones.forEach(timezone => {
      const timezoneData = timezoneOptimizationEngine.timezones[timezone];
      if (!timezoneData) return;

      const optimizedContent = {
        ...originalContent,
        id: `${originalContent.id}_tz_${timezone.split('/')[1]}`,
        originalId: originalContent.id,
        timezone: timezone,
        timezoneData: timezoneData
      };

      // Calcular timing óptimo para esta zona horaria
      const optimalTiming = calculateOptimalTiming(originalContent, timezoneData, schedulingStrategy);
      optimizedContent.scheduledDate = optimalTiming.scheduledDate;
      optimizedContent.timingMetrics = optimalTiming.metrics;
      optimizedContent.timingReason = optimalTiming.reason;

      optimizedSchedules.push(optimizedContent);
    });

    return optimizedSchedules;
  };

  // Calcular timing óptimo para una zona horaria específica
  const calculateOptimalTiming = (content, timezoneData, strategy) => {
    const { platform, niche, targetDemographic } = content;
    const currentDate = new Date();

    // Obtener horarios candidatos basados en múltiples factores
    const candidateHours = getCandidateHours(timezoneData, platform, targetDemographic, strategy);

    // Evaluar cada hora candidata
    const evaluatedHours = candidateHours.map(hour => ({
      hour,
      score: evaluateHourScore(hour, timezoneData, platform, niche, targetDemographic),
      factors: getTimingFactors(hour, timezoneData, platform)
    }));

    // Seleccionar la mejor hora
    const bestTiming = evaluatedHours.sort((a, b) => b.score - a.score)[0];

    // Calcular fecha de programación
    const scheduledDate = calculateScheduledDate(currentDate, bestTiming.hour, timezoneData);

    return {
      scheduledDate,
      metrics: {
        timingScore: bestTiming.score,
        timezone: timezoneData.country,
        optimalHour: bestTiming.hour,
        factors: bestTiming.factors
      },
      reason: generateTimingReason(bestTiming, timezoneData, platform)
    };
  };

  // Obtener horas candidatas
  const getCandidateHours = (timezoneData, platform, demographic, strategy) => {
    let candidateHours = [];

    switch (strategy) {
      case 'optimal':
        // Combinar horarios de plataforma y demográficos
        candidateHours = [
          ...timezoneData.platformOptimal[platform] || [],
          ...timezoneData.demographicTiming[demographic] || [],
          ...timezoneData.peakHours.weekdays
        ];
        break;

      case 'peak_only':
        candidateHours = timezoneData.peakHours.weekdays;
        break;

      case 'platform_focused':
        candidateHours = timezoneData.platformOptimal[platform] || timezoneData.peakHours.weekdays;
        break;

      case 'demographic_focused':
        candidateHours = timezoneData.demographicTiming[demographic] || timezoneData.peakHours.weekdays;
        break;
    }

    // Eliminar duplicados y ordenar
    return [...new Set(candidateHours)].sort((a, b) => a - b);
  };

  // Evaluar score de una hora específica
  const evaluateHourScore = (hour, timezoneData, platform, niche, demographic) => {
    let score = 50; // Base score

    // Factor 1: Horario pico general
    if (timezoneData.peakHours.weekdays.includes(hour)) {
      score += 20;
    }
    if (timezoneData.peakHours.weekends.includes(hour)) {
      score += 15; // Menor peso para fines de semana
    }

    // Factor 2: Horario óptimo de plataforma
    if (timezoneData.platformOptimal[platform]?.includes(hour)) {
      score += 25;
    }

    // Factor 3: Horario demográfico
    if (timezoneData.demographicTiming[demographic]?.includes(hour)) {
      score += 20;
    }

    // Factor 4: Horario de trabajo (penalización menor)
    if (timezoneData.workingHours.includes(hour)) {
      score -= 5; // Penalización leve
    }

    // Factor 5: Hora de almuerzo (oportunidad)
    if (timezoneData.lunchBreak.includes(hour)) {
      score += 10;
    }

    // Factor 6: Pico vespertino (bonus)
    if (timezoneData.eveningPeak.includes(hour)) {
      score += 15;
    }

    // Factor 7: Ajustes por nicho
    const nicheAdjustments = {
      fitness: { morning: [6, 7, 8], evening: [18, 19, 20] },
      food: { lunch: [11, 12, 13], dinner: [18, 19, 20, 21] },
      fashion: { afternoon: [14, 15, 16], evening: [19, 20, 21] },
      tech: { work: [9, 10, 14, 15], evening: [20, 21, 22] }
    };

    const nicheTimings = nicheAdjustments[niche];
    if (nicheTimings) {
      Object.values(nicheTimings).forEach(timeSlots => {
        if (timeSlots.includes(hour)) {
          score += 10;
        }
      });
    }

    return Math.min(score, 100);
  };

  // Obtener factores de timing
  const getTimingFactors = (hour, timezoneData, platform) => {
    const factors = [];

    if (timezoneData.peakHours.weekdays.includes(hour)) {
      factors.push('peak_hour');
    }
    if (timezoneData.platformOptimal[platform]?.includes(hour)) {
      factors.push('platform_optimal');
    }
    if (timezoneData.workingHours.includes(hour)) {
      factors.push('working_hours');
    }
    if (timezoneData.lunchBreak.includes(hour)) {
      factors.push('lunch_break');
    }
    if (timezoneData.eveningPeak.includes(hour)) {
      factors.push('evening_peak');
    }

    return factors;
  };

  // Calcular fecha de programación
  const calculateScheduledDate = (currentDate, optimalHour, timezoneData) => {
    const scheduledDate = new Date(currentDate);

    // Si la hora óptima ya pasó hoy, programar para mañana
    if (currentDate.getHours() >= optimalHour) {
      scheduledDate.setDate(scheduledDate.getDate() + 1);
    }

    // Establecer la hora óptima
    scheduledDate.setHours(optimalHour, Math.floor(Math.random() * 60), 0, 0);

    // Ajustar por zona horaria (simulado)
    const utcOffset = timezoneData.utcOffset;
    scheduledDate.setHours(scheduledDate.getHours() - utcOffset);

    return scheduledDate;
  };

  // Generar razón del timing
  const generateTimingReason = (bestTiming, timezoneData, platform) => {
    const reasons = [];

    if (bestTiming.factors.includes('peak_hour')) {
      reasons.push(`Horario pico en ${timezoneData.country}`);
    }
    if (bestTiming.factors.includes('platform_optimal')) {
      reasons.push(`Óptimo para ${platform}`);
    }
    if (bestTiming.factors.includes('evening_peak')) {
      reasons.push('Pico vespertino de engagement');
    }
    if (bestTiming.factors.includes('lunch_break')) {
      reasons.push('Oportunidad de almuerzo');
    }

    return reasons.length > 0 ? reasons.join(', ') : 'Horario balanceado';
  };

  // Programación multi-zona horaria automática
  const scheduleMultiTimezone = (originalContent, strategy = 'staggered') => {
    const allTimezones = Object.keys(timezoneOptimizationEngine.timezones);
    const multiTimezoneSchedules = [];

    switch (strategy) {
      case 'staggered':
        // Programar en diferentes horarios para cada zona
        allTimezones.forEach((timezone, index) => {
          const timezoneSchedules = optimizeTimingForTimezones(originalContent, [timezone]);
          if (timezoneSchedules.length > 0) {
            const schedule = timezoneSchedules[0];
            // Escalonar por 2 horas entre zonas
            schedule.scheduledDate.setHours(schedule.scheduledDate.getHours() + (index * 2));
            multiTimezoneSchedules.push(schedule);
          }
        });
        break;

      case 'simultaneous':
        // Programar a la misma hora local en cada zona
        const simultaneousSchedules = optimizeTimingForTimezones(originalContent, allTimezones);
        multiTimezoneSchedules.push(...simultaneousSchedules);
        break;

      case 'follow_the_sun':
        // Seguir el sol: programar cuando sea óptimo en cada zona secuencialmente
        const sortedTimezones = allTimezones.sort((a, b) => {
          const offsetA = timezoneOptimizationEngine.timezones[a].utcOffset;
          const offsetB = timezoneOptimizationEngine.timezones[b].utcOffset;
          return offsetA - offsetB;
        });

        sortedTimezones.forEach((timezone, index) => {
          const schedules = optimizeTimingForTimezones(originalContent, [timezone]);
          if (schedules.length > 0) {
            const schedule = schedules[0];
            // Programar con 8 horas de diferencia (siguiendo el sol)
            schedule.scheduledDate.setHours(schedule.scheduledDate.getHours() + (index * 8));
            multiTimezoneSchedules.push(schedule);
          }
        });
        break;
    }

    return multiTimezoneSchedules;
  };

  // Análisis de performance por zona horaria
  const analyzeTimezonePerformance = () => {
    const performanceData = {};

    Object.keys(timezoneOptimizationEngine.timezones).forEach(timezone => {
      const timezoneData = timezoneOptimizationEngine.timezones[timezone];

      performanceData[timezone] = {
        country: timezoneData.country,
        bestPerformingHours: timezoneData.peakHours.weekdays.slice(0, 3),
        platformPerformance: calculatePlatformPerformanceByTimezone(timezoneData),
        demographicInsights: calculateDemographicInsightsByTimezone(timezoneData),
        recommendedStrategy: recommendTimingStrategy(timezoneData)
      };
    });

    return performanceData;
  };

  // Calcular performance por plataforma en zona horaria
  const calculatePlatformPerformanceByTimezone = (timezoneData) => {
    const platformPerformance = {};

    Object.keys(timezoneData.platformOptimal).forEach(platform => {
      const optimalHours = timezoneData.platformOptimal[platform];
      const peakOverlap = optimalHours.filter(hour =>
        timezoneData.peakHours.weekdays.includes(hour)
      ).length;

      platformPerformance[platform] = {
        optimalHours: optimalHours,
        peakOverlap: peakOverlap,
        score: (peakOverlap / optimalHours.length) * 100
      };
    });

    return platformPerformance;
  };

  // Calcular insights demográficos por zona horaria
  const calculateDemographicInsightsByTimezone = (timezoneData) => {
    const insights = {};

    Object.keys(timezoneData.demographicTiming).forEach(demographic => {
      const demographicHours = timezoneData.demographicTiming[demographic];
      const eveningHours = demographicHours.filter(hour => hour >= 18).length;

      insights[demographic] = {
        totalOptimalHours: demographicHours.length,
        eveningFocused: eveningHours > demographicHours.length / 2,
        bestHour: demographicHours[0],
        timeSpread: demographicHours[demographicHours.length - 1] - demographicHours[0]
      };
    });

    return insights;
  };

  // Recomendar estrategia de timing
  const recommendTimingStrategy = (timezoneData) => {
    const eveningPeakHours = timezoneData.eveningPeak.length;
    const totalPeakHours = timezoneData.peakHours.weekdays.length;

    if (eveningPeakHours / totalPeakHours > 0.6) {
      return 'evening_focused';
    } else if (timezoneData.lunchBreak.length > 0) {
      return 'lunch_and_evening';
    } else {
      return 'distributed_posting';
    }
  };

  // Ajustes estacionales automáticos
  const applySeasonalTimingAdjustments = (baseSchedule, timezone) => {
    const currentMonth = new Date().getMonth();
    const timezoneData = timezoneOptimizationEngine.timezones[timezone];

    const seasonalAdjustments = {
      // Diciembre - temporada alta
      11: { hourShift: +1, engagementBoost: 1.2 },
      // Enero - post-fiestas
      0: { hourShift: -1, engagementBoost: 0.9 },
      // Julio - vacaciones
      6: { hourShift: +2, engagementBoost: 1.1 },
      // Septiembre - regreso a clases/trabajo
      8: { hourShift: -1, engagementBoost: 1.0 }
    };

    const adjustment = seasonalAdjustments[currentMonth];
    if (adjustment) {
      const adjustedSchedule = { ...baseSchedule };
      adjustedSchedule.scheduledDate.setHours(
        adjustedSchedule.scheduledDate.getHours() + adjustment.hourShift
      );
      adjustedSchedule.seasonalAdjustment = {
        applied: true,
        hourShift: adjustment.hourShift,
        engagementMultiplier: adjustment.engagementBoost,
        reason: getSeasonalReason(currentMonth)
      };
      return adjustedSchedule;
    }

    return baseSchedule;
  };

  // Obtener razón estacional
  const getSeasonalReason = (month) => {
    const seasonalReasons = {
      11: 'Temporada navideña - mayor actividad',
      0: 'Post-fiestas - actividad moderada',
      6: 'Vacaciones de verano - horarios flexibles',
      8: 'Regreso a rutina - horarios estándar'
    };

    return seasonalReasons[month] || 'Horario estándar';
  };

  // PUNTO 15: Viral Predictor integrado - Score en tiempo real
  const [viralPredictorEngine, setViralPredictorEngine] = useState({
    enabled: true,
    realTimeScoring: true,
    predictionModels: {
      content_analysis: {
        weight: 25,
        factors: ['hook_strength', 'emotional_trigger', 'curiosity_gap', 'relatability', 'shareability']
      },
      timing_optimization: {
        weight: 20,
        factors: ['peak_hours', 'platform_timing', 'demographic_timing', 'seasonal_boost']
      },
      hashtag_power: {
        weight: 15,
        factors: ['trending_score', 'niche_relevance', 'viral_potential', 'competition_level']
      },
      platform_fit: {
        weight: 15,
        factors: ['algorithm_alignment', 'format_optimization', 'engagement_potential']
      },
      audience_match: {
        weight: 15,
        factors: ['demographic_fit', 'regional_relevance', 'interest_alignment']
      },
      trend_alignment: {
        weight: 10,
        factors: ['current_trends', 'emerging_patterns', 'viral_elements']
      }
    },
    viralThresholds: {
      low: { min: 0, max: 30, label: 'Bajo potencial', color: '#ef4444' },
      medium: { min: 31, max: 60, label: 'Potencial moderado', color: '#f59e0b' },
      high: { min: 61, max: 80, label: 'Alto potencial', color: '#10b981' },
      viral: { min: 81, max: 100, label: 'Potencial viral', color: '#8b5cf6' }
    },
    realTimeFactors: {
      trending_topics: true,
      platform_algorithm_changes: true,
      competitor_analysis: true,
      audience_behavior_shifts: true,
      seasonal_events: true
    }
  });

  // Función principal del predictor viral integrado
  const calculateAdvancedViralScore = (content, realTimeData = null) => {
    const baseScore = {
      overall: 0,
      breakdown: {},
      confidence: 0,
      recommendations: [],
      viralFactors: [],
      riskFactors: []
    };

    // Calcular cada modelo de predicción
    Object.entries(viralPredictorEngine.predictionModels).forEach(([modelName, modelConfig]) => {
      const modelScore = calculateModelScore(content, modelName, modelConfig, realTimeData);
      const weightedScore = (modelScore.score * modelConfig.weight) / 100;

      baseScore.overall += weightedScore;
      baseScore.breakdown[modelName] = {
        score: modelScore.score,
        weight: modelConfig.weight,
        weightedScore: weightedScore,
        factors: modelScore.factors,
        insights: modelScore.insights
      };
    });

    // Aplicar factores en tiempo real
    if (realTimeData && viralPredictorEngine.realTimeScoring) {
      const realTimeAdjustment = applyRealTimeFactors(baseScore, realTimeData);
      baseScore.overall += realTimeAdjustment.adjustment;
      baseScore.realTimeBoost = realTimeAdjustment;
    }

    // Calcular confianza del score
    baseScore.confidence = calculatePredictionConfidence(baseScore);

    // Generar recomendaciones
    baseScore.recommendations = generateAdvancedViralRecommendations(baseScore, content);

    // Identificar factores virales y de riesgo
    baseScore.viralFactors = identifyViralFactors(baseScore);
    baseScore.riskFactors = identifyViralRiskFactors(baseScore);

    // Determinar categoría viral
    baseScore.category = determineViralCategory(baseScore.overall);

    return baseScore;
  };

  // Calcular score de modelo específico
  const calculateModelScore = (content, modelName, modelConfig, realTimeData) => {
    const modelResult = {
      score: 0,
      factors: {},
      insights: []
    };

    switch (modelName) {
      case 'content_analysis':
        modelResult.score = analyzeContentVirality(content);
        modelResult.factors = getContentAnalysisFactors(content);
        modelResult.insights = getContentInsights(content);
        break;

      case 'timing_optimization':
        modelResult.score = analyzeTimingVirality(content);
        modelResult.factors = getTimingFactors(content);
        modelResult.insights = getTimingInsights(content);
        break;

      case 'hashtag_power':
        modelResult.score = analyzeHashtagVirality(content);
        modelResult.factors = getHashtagFactors(content);
        modelResult.insights = getHashtagInsights(content);
        break;

      case 'platform_fit':
        modelResult.score = analyzePlatformVirality(content);
        modelResult.factors = getPlatformFactors(content);
        modelResult.insights = getPlatformInsights(content);
        break;

      case 'audience_match':
        modelResult.score = analyzeAudienceVirality(content);
        modelResult.factors = getAudienceFactors(content);
        modelResult.insights = getAudienceInsights(content);
        break;

      case 'trend_alignment':
        modelResult.score = analyzeTrendVirality(content, realTimeData);
        modelResult.factors = getTrendFactors(content, realTimeData);
        modelResult.insights = getTrendInsights(content, realTimeData);
        break;
    }

    return modelResult;
  };

  // Análisis de viralidad del contenido
  const analyzeContentVirality = (content) => {
    let score = 50; // Base score
    const text = content.content.toLowerCase();

    // Hook strength (primeras palabras)
    const viralHooks = ['pov:', 'plot twist:', 'nadie me dijo:', 'secreto:', 'hack:', 'truco:'];
    if (viralHooks.some(hook => text.startsWith(hook.toLowerCase()))) {
      score += 15;
    }

    // Emotional triggers
    const emotionalWords = ['increíble', 'impactante', 'sorprendente', 'viral', 'épico', 'genial'];
    const emotionalMatches = emotionalWords.filter(word => text.includes(word));
    score += emotionalMatches.length * 3;

    // Curiosity gap
    const curiosityPhrases = ['no vas a creer', 'te va a sorprender', 'esto cambió mi vida', 'descubrí que'];
    if (curiosityPhrases.some(phrase => text.includes(phrase))) {
      score += 12;
    }

    // Relatability
    const relatableWords = ['todos', 'siempre', 'nunca', 'típico', 'normal', 'común'];
    const relatableMatches = relatableWords.filter(word => text.includes(word));
    score += relatableMatches.length * 2;

    // Shareability indicators
    const shareableElements = ['tutorial', 'tip', 'consejo', 'truco', 'hack', 'secreto'];
    const shareableMatches = shareableElements.filter(element => text.includes(element));
    score += shareableMatches.length * 4;

    return Math.min(score, 100);
  };

  // Análisis de viralidad del timing
  const analyzeTimingVirality = (content) => {
    let score = 60; // Base score
    const scheduledHour = content.scheduledDate ? content.scheduledDate.getHours() : new Date().getHours();

    // Horarios pico por plataforma
    const platformPeakHours = {
      tiktok: [19, 20, 21, 22],
      instagram: [18, 19, 20],
      youtube: [20, 21, 22],
      facebook: [18, 19, 20]
    };

    const peakHours = platformPeakHours[content.platform] || [19, 20, 21];
    if (peakHours.includes(scheduledHour)) {
      score += 20;
    }

    // Día de la semana
    const dayOfWeek = content.scheduledDate ? content.scheduledDate.getDay() : new Date().getDay();
    if ([1, 2, 3, 4].includes(dayOfWeek)) { // Lunes a jueves
      score += 10;
    } else if ([5, 6].includes(dayOfWeek)) { // Viernes y sábado
      score += 15;
    }

    // Estacionalidad
    const currentMonth = new Date().getMonth();
    const highSeasonMonths = [11, 0, 6, 7]; // Dic, Ene, Jul, Ago
    if (highSeasonMonths.includes(currentMonth)) {
      score += 10;
    }

    return Math.min(score, 100);
  };

  // Análisis de viralidad de hashtags
  const analyzeHashtagVirality = (content) => {
    let score = 55; // Base score
    const hashtags = content.hashtags || [];

    // Hashtags trending
    const trendingTags = ['#viral', '#trending', '#fyp', '#parati', '#foryou'];
    const trendingMatches = hashtags.filter(tag =>
      trendingTags.some(trending => tag.toLowerCase().includes(trending.toLowerCase()))
    );
    score += trendingMatches.length * 8;

    // Hashtags de nicho
    const nicheRelevance = calculateNicheHashtagRelevance(hashtags, content.niche);
    score += nicheRelevance;

    // Cantidad óptima de hashtags
    const optimalCount = getOptimalHashtagCount(content.platform);
    const countDifference = Math.abs(hashtags.length - optimalCount);
    if (countDifference <= 2) {
      score += 10;
    } else {
      score -= countDifference * 2;
    }

    // Diversidad de hashtags
    const diversity = calculateHashtagDiversity(hashtags);
    score += diversity * 5;

    return Math.min(score, 100);
  };

  // Análisis de viralidad de plataforma
  const analyzePlatformVirality = (content) => {
    let score = 65; // Base score
    const platform = content.platform;

    // Formato óptimo por plataforma
    const contentLength = content.content.length;
    const optimalLengths = {
      tiktok: { min: 50, max: 150 },
      instagram: { min: 100, max: 300 },
      youtube: { min: 200, max: 500 },
      facebook: { min: 150, max: 400 }
    };

    const optimal = optimalLengths[platform];
    if (optimal && contentLength >= optimal.min && contentLength <= optimal.max) {
      score += 15;
    }

    // Elementos específicos de plataforma
    const text = content.content.toLowerCase();
    const platformElements = {
      tiktok: ['pov', 'day in my life', 'get ready with me', 'plot twist'],
      instagram: ['swipe', 'carousel', 'story', 'reel'],
      youtube: ['tutorial', 'review', 'how to', 'vs'],
      facebook: ['share', 'tag', 'comment', 'opinion']
    };

    const elements = platformElements[platform] || [];
    const elementMatches = elements.filter(element => text.includes(element));
    score += elementMatches.length * 6;

    return Math.min(score, 100);
  };

  // Análisis de viralidad de audiencia
  const analyzeAudienceVirality = (content) => {
    let score = 60; // Base score

    // Match demográfico
    if (content.targetDemographic) {
      score += 15;
    }

    // Relevancia regional
    if (content.targetRegion) {
      score += 12;
    }

    // Alineación de intereses
    if (content.niche) {
      const nicheEngagement = {
        fitness: 85,
        food: 80,
        fashion: 90,
        tech: 75,
        travel: 85
      };
      const nicheScore = nicheEngagement[content.niche] || 70;
      score += (nicheScore - 70) / 5;
    }

    return Math.min(score, 100);
  };

  // Análisis de viralidad de tendencias
  const analyzeTrendVirality = (content, realTimeData) => {
    let score = 50; // Base score
    const text = content.content.toLowerCase();

    // Tendencias actuales (simuladas)
    const currentTrends = [
      'inteligencia artificial', 'sostenibilidad', 'wellness', 'productivity',
      'self care', 'mindfulness', 'digital detox', 'life hacks'
    ];

    const trendMatches = currentTrends.filter(trend => text.includes(trend));
    score += trendMatches.length * 10;

    // Elementos virales emergentes
    const viralElements = ['aesthetic', 'core', 'era', 'energy', 'vibe'];
    const viralMatches = viralElements.filter(element => text.includes(element));
    score += viralMatches.length * 8;

    // Boost por datos en tiempo real
    if (realTimeData?.trendingBoost) {
      score += realTimeData.trendingBoost;
    }

    return Math.min(score, 100);
  };

  // Aplicar factores en tiempo real
  const applyRealTimeFactors = (baseScore, realTimeData) => {
    let adjustment = 0;
    const factors = [];

    // Trending topics boost
    if (realTimeData.trendingTopics) {
      adjustment += 5;
      factors.push('trending_topics_boost');
    }

    // Algorithm changes
    if (realTimeData.algorithmChanges) {
      adjustment += realTimeData.algorithmChanges.impact || 0;
      factors.push('algorithm_adjustment');
    }

    // Competitor analysis
    if (realTimeData.competitorPerformance === 'low') {
      adjustment += 8;
      factors.push('low_competition_window');
    }

    // Audience behavior
    if (realTimeData.audienceBehavior === 'highly_active') {
      adjustment += 6;
      factors.push('high_audience_activity');
    }

    return {
      adjustment: Math.min(adjustment, 20),
      factors: factors,
      timestamp: new Date()
    };
  };

  // Calcular confianza de la predicción
  const calculatePredictionConfidence = (scoreData) => {
    let confidence = 70; // Base confidence

    // Más datos = mayor confianza
    const dataPoints = Object.keys(scoreData.breakdown).length;
    confidence += dataPoints * 3;

    // Consistencia entre modelos
    const scores = Object.values(scoreData.breakdown).map(model => model.score);
    const variance = calculateVariance(scores);
    confidence -= variance / 5;

    // Boost por tiempo real
    if (scoreData.realTimeBoost) {
      confidence += 10;
    }

    return Math.min(Math.max(confidence, 30), 95);
  };

  // Generar recomendaciones virales
  const generateAdvancedViralRecommendations = (scoreData, content) => {
    const recommendations = [];

    // Recomendaciones por modelo con bajo score
    Object.entries(scoreData.breakdown).forEach(([modelName, modelData]) => {
      if (modelData.score < 60) {
        recommendations.push(...getModelRecommendations(modelName, modelData, content));
      }
    });

    // Recomendaciones generales
    if (scoreData.overall < 50) {
      recommendations.push({
        type: 'critical',
        category: 'general',
        message: 'Considera reescribir el contenido con un hook más fuerte',
        impact: 'high'
      });
    }

    return recommendations.slice(0, 5); // Limitar a 5 recomendaciones
  };

  // Obtener recomendaciones por modelo
  const getModelRecommendations = (modelName, modelData, content) => {
    const recommendations = [];

    switch (modelName) {
      case 'content_analysis':
        recommendations.push({
          type: 'improvement',
          category: 'content',
          message: 'Añade un hook más impactante al inicio',
          impact: 'high'
        });
        break;

      case 'timing_optimization':
        recommendations.push({
          type: 'timing',
          category: 'schedule',
          message: 'Programa en horario pico (7-9 PM)',
          impact: 'medium'
        });
        break;

      case 'hashtag_power':
        recommendations.push({
          type: 'hashtags',
          category: 'discovery',
          message: 'Incluye hashtags trending como #viral #fyp',
          impact: 'medium'
        });
        break;
    }

    return recommendations;
  };

  // Identificar factores virales
  const identifyViralFactors = (scoreData) => {
    const viralFactors = [];

    Object.entries(scoreData.breakdown).forEach(([modelName, modelData]) => {
      if (modelData.score >= 80) {
        viralFactors.push({
          factor: modelName,
          score: modelData.score,
          strength: 'high'
        });
      } else if (modelData.score >= 65) {
        viralFactors.push({
          factor: modelName,
          score: modelData.score,
          strength: 'medium'
        });
      }
    });

    return viralFactors;
  };

  // Identificar factores de riesgo
  const identifyViralRiskFactors = (scoreData) => {
    const riskFactors = [];

    Object.entries(scoreData.breakdown).forEach(([modelName, modelData]) => {
      if (modelData.score < 40) {
        riskFactors.push({
          factor: modelName,
          score: modelData.score,
          risk: 'high',
          impact: 'Puede limitar significativamente el alcance'
        });
      } else if (modelData.score < 55) {
        riskFactors.push({
          factor: modelName,
          score: modelData.score,
          risk: 'medium',
          impact: 'Puede reducir el potencial viral'
        });
      }
    });

    return riskFactors;
  };

  // Determinar categoría viral
  const determineViralCategory = (overallScore) => {
    const thresholds = viralPredictorEngine.viralThresholds;

    for (const [category, threshold] of Object.entries(thresholds)) {
      if (overallScore >= threshold.min && overallScore <= threshold.max) {
        return {
          name: category,
          label: threshold.label,
          color: threshold.color,
          score: overallScore
        };
      }
    }

    return thresholds.low;
  };

  // Funciones auxiliares
  const calculateNicheHashtagRelevance = (hashtags, niche) => {
    const nicheHashtags = {
      fitness: ['#fitness', '#gym', '#workout', '#health'],
      food: ['#food', '#recipe', '#cooking', '#delicious'],
      fashion: ['#fashion', '#style', '#outfit', '#ootd'],
      tech: ['#tech', '#innovation', '#digital', '#ai']
    };

    const relevantTags = nicheHashtags[niche] || [];
    const matches = hashtags.filter(tag =>
      relevantTags.some(relevant => tag.toLowerCase().includes(relevant.toLowerCase()))
    );

    return matches.length * 5;
  };

  const getOptimalHashtagCount = (platform) => {
    const optimalCounts = {
      tiktok: 4,
      instagram: 10,
      youtube: 6,
      facebook: 3
    };
    return optimalCounts[platform] || 5;
  };

  const calculateHashtagDiversity = (hashtags) => {
    const categories = ['trending', 'niche', 'branded', 'community', 'location'];
    // Simulación de diversidad
    return Math.min(hashtags.length / 2, 5) / 5;
  };

  const calculateVariance = (numbers) => {
    const mean = numbers.reduce((sum, num) => sum + num, 0) / numbers.length;
    const squaredDiffs = numbers.map(num => Math.pow(num - mean, 2));
    return squaredDiffs.reduce((sum, diff) => sum + diff, 0) / numbers.length;
  };

  // Monitoreo en tiempo real del score viral
  const startRealTimeViralMonitoring = (contentId) => {
    const monitoringInterval = setInterval(() => {
      // Simular datos en tiempo real
      const realTimeData = {
        trendingTopics: Math.random() > 0.7,
        algorithmChanges: { impact: Math.random() * 10 - 5 },
        competitorPerformance: Math.random() > 0.6 ? 'low' : 'high',
        audienceBehavior: Math.random() > 0.5 ? 'highly_active' : 'normal'
      };

      // Recalcular score viral
      const updatedScore = calculateAdvancedViralScore(
        scheduledPosts.find(post => post.id === contentId),
        realTimeData
      );

      console.log(`Score viral actualizado para ${contentId}:`, updatedScore.overall);
    }, 300000); // Cada 5 minutos

    return monitoringInterval;
  };

  // PUNTO 16: Content Clusters - Agrupar contenido relacionado
  const [contentClusteringEngine, setContentClusteringEngine] = useState({
    enabled: true,
    clusteringAlgorithms: {
      semantic_similarity: { weight: 30, threshold: 0.7 },
      topic_modeling: { weight: 25, threshold: 0.6 },
      hashtag_overlap: { weight: 20, threshold: 0.5 },
      audience_similarity: { weight: 15, threshold: 0.8 },
      temporal_proximity: { weight: 10, threshold: 0.4 }
    },
    clusterTypes: {
      series: {
        minPosts: 3,
        maxPosts: 10,
        timeSpan: 30, // días
        coherenceThreshold: 0.8
      },
      campaign: {
        minPosts: 5,
        maxPosts: 20,
        timeSpan: 14, // días
        coherenceThreshold: 0.7
      },
      theme: {
        minPosts: 2,
        maxPosts: 15,
        timeSpan: 60, // días
        coherenceThreshold: 0.6
      },
      trend: {
        minPosts: 4,
        maxPosts: 12,
        timeSpan: 7, // días
        coherenceThreshold: 0.9
      }
    },
    autoClusteringRules: {
      create_on_similarity: true,
      merge_overlapping_clusters: true,
      split_large_clusters: true,
      archive_old_clusters: true,
      suggest_missing_content: true
    }
  });

  // Estado para clusters activos
  const [contentClusters, setContentClusters] = useState([]);
  const [clusterAnalytics, setClusterAnalytics] = useState({});

  // Función principal de clustering de contenido
  const analyzeAndClusterContent = (contentList = scheduledPosts) => {
    const clusters = [];
    const processedContent = contentList.map(content => ({
      ...content,
      clusterId: null,
      clusterScore: 0,
      semanticVector: generateSemanticVector(content),
      topicSignature: extractTopicSignature(content),
      audienceProfile: generateAudienceProfile(content)
    }));

    // Aplicar algoritmos de clustering
    const similarityMatrix = calculateContentSimilarityMatrix(processedContent);
    const detectedClusters = detectContentClusters(processedContent, similarityMatrix);

    // Validar y refinar clusters
    const validatedClusters = validateAndRefineClusters(detectedClusters, processedContent);

    // Generar analytics de clusters
    const analytics = generateClusterAnalytics(validatedClusters, processedContent);

    setContentClusters(validatedClusters);
    setClusterAnalytics(analytics);

    return {
      clusters: validatedClusters,
      analytics: analytics,
      recommendations: generateClusterRecommendations(validatedClusters, analytics)
    };
  };

  // Generar vector semántico del contenido
  const generateSemanticVector = (content) => {
    const text = `${content.title} ${content.content}`.toLowerCase();

    // Palabras clave por categorías semánticas
    const semanticCategories = {
      emotion: ['amor', 'feliz', 'triste', 'enojado', 'sorprendido', 'miedo', 'asco'],
      action: ['hacer', 'crear', 'construir', 'destruir', 'mover', 'correr', 'saltar'],
      time: ['hoy', 'ayer', 'mañana', 'ahora', 'antes', 'después', 'siempre'],
      quality: ['bueno', 'malo', 'mejor', 'peor', 'increíble', 'terrible', 'perfecto'],
      quantity: ['mucho', 'poco', 'más', 'menos', 'todo', 'nada', 'algunos'],
      social: ['familia', 'amigos', 'gente', 'comunidad', 'sociedad', 'grupo', 'equipo']
    };

    const vector = {};
    Object.entries(semanticCategories).forEach(([category, words]) => {
      const matches = words.filter(word => text.includes(word)).length;
      vector[category] = matches / words.length;
    });

    return vector;
  };

  // Extraer firma de tópico
  const extractTopicSignature = (content) => {
    const text = `${content.title} ${content.content} ${content.hashtags?.join(' ')}`.toLowerCase();

    const topicKeywords = {
      fitness: ['ejercicio', 'gym', 'entrenamiento', 'músculo', 'cardio', 'fuerza'],
      food: ['comida', 'receta', 'cocinar', 'ingrediente', 'sabor', 'delicioso'],
      fashion: ['ropa', 'outfit', 'estilo', 'moda', 'tendencia', 'look'],
      tech: ['tecnología', 'app', 'digital', 'innovación', 'software', 'ai'],
      lifestyle: ['vida', 'rutina', 'hábito', 'bienestar', 'balance', 'mindset'],
      travel: ['viaje', 'destino', 'aventura', 'explorar', 'cultura', 'experiencia']
    };

    const signature = {};
    Object.entries(topicKeywords).forEach(([topic, keywords]) => {
      const relevance = keywords.filter(keyword => text.includes(keyword)).length / keywords.length;
      if (relevance > 0) {
        signature[topic] = relevance;
      }
    });

    return signature;
  };

  // Generar perfil de audiencia
  const generateAudienceProfile = (content) => {
    return {
      demographic: content.targetDemographic || 'general',
      region: content.targetRegion || 'global',
      platform: content.platform,
      niche: content.niche,
      engagementLevel: calculateExpectedEngagement(content),
      viralPotential: content.viralScore || 50
    };
  };

  // Calcular matriz de similitud entre contenidos
  const calculateContentSimilarityMatrix = (contentList) => {
    const matrix = {};

    contentList.forEach((content1, i) => {
      matrix[content1.id] = {};

      contentList.forEach((content2, j) => {
        if (i !== j) {
          const similarity = calculateContentSimilarity(content1, content2);
          matrix[content1.id][content2.id] = similarity;
        }
      });
    });

    return matrix;
  };

  // Calcular similitud entre dos contenidos
  const calculateContentSimilarity = (content1, content2) => {
    let totalSimilarity = 0;
    const algorithms = contentClusteringEngine.clusteringAlgorithms;

    // Similitud semántica
    const semanticSim = calculateSemanticSimilarity(content1.semanticVector, content2.semanticVector);
    totalSimilarity += semanticSim * algorithms.semantic_similarity.weight / 100;

    // Similitud de tópicos
    const topicSim = calculateTopicSimilarity(content1.topicSignature, content2.topicSignature);
    totalSimilarity += topicSim * algorithms.topic_modeling.weight / 100;

    // Superposición de hashtags
    const hashtagSim = calculateHashtagSimilarity(content1.hashtags, content2.hashtags);
    totalSimilarity += hashtagSim * algorithms.hashtag_overlap.weight / 100;

    // Similitud de audiencia
    const audienceSim = calculateAudienceSimilarity(content1.audienceProfile, content2.audienceProfile);
    totalSimilarity += audienceSim * algorithms.audience_similarity.weight / 100;

    // Proximidad temporal
    const temporalSim = calculateTemporalSimilarity(content1.scheduledDate, content2.scheduledDate);
    totalSimilarity += temporalSim * algorithms.temporal_proximity.weight / 100;

    return totalSimilarity;
  };

  // Calcular similitud semántica
  const calculateSemanticSimilarity = (vector1, vector2) => {
    const categories = Object.keys(vector1);
    let similarity = 0;

    categories.forEach(category => {
      const val1 = vector1[category] || 0;
      const val2 = vector2[category] || 0;
      similarity += 1 - Math.abs(val1 - val2);
    });

    return similarity / categories.length;
  };

  // Calcular similitud de tópicos
  const calculateTopicSimilarity = (signature1, signature2) => {
    const allTopics = new Set([...Object.keys(signature1), ...Object.keys(signature2)]);
    let similarity = 0;

    allTopics.forEach(topic => {
      const val1 = signature1[topic] || 0;
      const val2 = signature2[topic] || 0;
      similarity += Math.min(val1, val2);
    });

    return similarity / allTopics.size;
  };

  // Calcular similitud de hashtags
  const calculateHashtagSimilarity = (hashtags1 = [], hashtags2 = []) => {
    if (hashtags1.length === 0 && hashtags2.length === 0) return 1;
    if (hashtags1.length === 0 || hashtags2.length === 0) return 0;

    const set1 = new Set(hashtags1.map(tag => tag.toLowerCase()));
    const set2 = new Set(hashtags2.map(tag => tag.toLowerCase()));

    const intersection = new Set([...set1].filter(tag => set2.has(tag)));
    const union = new Set([...set1, ...set2]);

    return intersection.size / union.size; // Jaccard similarity
  };

  // Calcular similitud de audiencia
  const calculateAudienceSimilarity = (profile1, profile2) => {
    let similarity = 0;
    let factors = 0;

    // Comparar demografía
    if (profile1.demographic === profile2.demographic) similarity += 0.3;
    factors += 0.3;

    // Comparar región
    if (profile1.region === profile2.region) similarity += 0.2;
    factors += 0.2;

    // Comparar plataforma
    if (profile1.platform === profile2.platform) similarity += 0.2;
    factors += 0.2;

    // Comparar nicho
    if (profile1.niche === profile2.niche) similarity += 0.3;
    factors += 0.3;

    return factors > 0 ? similarity / factors : 0;
  };

  // Calcular similitud temporal
  const calculateTemporalSimilarity = (date1, date2) => {
    if (!date1 || !date2) return 0;

    const diffDays = Math.abs((date1 - date2) / (1000 * 60 * 60 * 24));
    const maxDays = 30; // Máximo 30 días para considerar similitud temporal

    return Math.max(0, 1 - (diffDays / maxDays));
  };

  // Detectar clusters de contenido
  const detectContentClusters = (contentList, similarityMatrix) => {
    const clusters = [];
    const processed = new Set();

    contentList.forEach(content => {
      if (processed.has(content.id)) return;

      const cluster = {
        id: `cluster_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        type: 'auto_detected',
        name: generateClusterName(content),
        description: generateClusterDescription(content),
        members: [content.id],
        centerContent: content.id,
        coherenceScore: 0,
        createdAt: new Date(),
        analytics: {}
      };

      // Encontrar contenidos similares
      Object.entries(similarityMatrix[content.id] || {}).forEach(([otherId, similarity]) => {
        if (!processed.has(otherId) && similarity >= 0.6) {
          cluster.members.push(otherId);
          processed.add(otherId);
        }
      });

      // Solo crear cluster si tiene suficientes miembros
      if (cluster.members.length >= 2) {
        cluster.coherenceScore = calculateClusterCoherence(cluster, contentList, similarityMatrix);
        clusters.push(cluster);
        cluster.members.forEach(memberId => processed.add(memberId));
      }
    });

    return clusters;
  };

  // Generar nombre de cluster
  const generateClusterName = (centerContent) => {
    const niche = centerContent.niche || 'general';
    const platform = centerContent.platform || 'multi';
    const timestamp = new Date().toLocaleDateString();

    return `${niche.charAt(0).toUpperCase() + niche.slice(1)} ${platform} - ${timestamp}`;
  };

  // Generar descripción de cluster
  const generateClusterDescription = (centerContent) => {
    const descriptions = {
      fitness: 'Contenido relacionado con ejercicio, entrenamiento y vida saludable',
      food: 'Recetas, tips culinarios y contenido gastronómico',
      fashion: 'Tendencias de moda, outfits y estilo personal',
      tech: 'Tecnología, innovación y herramientas digitales',
      lifestyle: 'Estilo de vida, rutinas y bienestar personal'
    };

    return descriptions[centerContent.niche] || 'Contenido relacionado por temática y audiencia';
  };

  // Calcular coherencia del cluster
  const calculateClusterCoherence = (cluster, contentList, similarityMatrix) => {
    if (cluster.members.length < 2) return 0;

    let totalSimilarity = 0;
    let comparisons = 0;

    cluster.members.forEach(memberId1 => {
      cluster.members.forEach(memberId2 => {
        if (memberId1 !== memberId2) {
          const similarity = similarityMatrix[memberId1]?.[memberId2] || 0;
          totalSimilarity += similarity;
          comparisons++;
        }
      });
    });

    return comparisons > 0 ? totalSimilarity / comparisons : 0;
  };

  // Validar y refinar clusters
  const validateAndRefineClusters = (clusters, contentList) => {
    return clusters.filter(cluster => {
      // Filtrar clusters con baja coherencia
      if (cluster.coherenceScore < 0.5) return false;

      // Filtrar clusters muy pequeños
      if (cluster.members.length < 2) return false;

      // Determinar tipo de cluster
      cluster.type = determineClusterType(cluster, contentList);

      return true;
    }).map(cluster => {
      // Enriquecer cluster con metadata
      cluster.analytics = generateClusterAnalytics([cluster], contentList);
      return cluster;
    });
  };

  // Determinar tipo de cluster
  const determineClusterType = (cluster, contentList) => {
    const members = cluster.members.map(id => contentList.find(c => c.id === id)).filter(Boolean);

    // Analizar patrones temporales
    const dates = members.map(m => m.scheduledDate).filter(Boolean).sort();
    if (dates.length > 0) {
      const timeSpan = (dates[dates.length - 1] - dates[0]) / (1000 * 60 * 60 * 24);

      if (timeSpan <= 7 && cluster.coherenceScore > 0.8) return 'trend';
      if (timeSpan <= 14 && members.length >= 5) return 'campaign';
      if (timeSpan <= 30 && members.length >= 3) return 'series';
    }

    return 'theme';
  };

  // Generar analytics de clusters
  const generateClusterAnalytics = (clusters, contentList) => {
    const analytics = {
      totalClusters: clusters.length,
      averageClusterSize: 0,
      averageCoherence: 0,
      clusterTypes: {},
      performanceMetrics: {},
      recommendations: []
    };

    if (clusters.length === 0) return analytics;

    // Calcular métricas básicas
    const totalMembers = clusters.reduce((sum, cluster) => sum + cluster.members.length, 0);
    analytics.averageClusterSize = totalMembers / clusters.length;

    const totalCoherence = clusters.reduce((sum, cluster) => sum + cluster.coherenceScore, 0);
    analytics.averageCoherence = totalCoherence / clusters.length;

    // Analizar tipos de clusters
    clusters.forEach(cluster => {
      analytics.clusterTypes[cluster.type] = (analytics.clusterTypes[cluster.type] || 0) + 1;
    });

    // Calcular métricas de performance
    analytics.performanceMetrics = calculateClusterPerformanceMetrics(clusters, contentList);

    return analytics;
  };

  // Calcular métricas de performance de clusters
  const calculateClusterPerformanceMetrics = (clusters, contentList) => {
    const metrics = {
      engagementByCluster: {},
      viralPotentialByCluster: {},
      bestPerformingCluster: null,
      worstPerformingCluster: null
    };

    clusters.forEach(cluster => {
      const members = cluster.members.map(id => contentList.find(c => c.id === id)).filter(Boolean);

      const avgEngagement = members.reduce((sum, member) => {
        return sum + (member.expectedEngagement || 0);
      }, 0) / members.length;

      const avgViralPotential = members.reduce((sum, member) => {
        return sum + (member.viralScore || 0);
      }, 0) / members.length;

      metrics.engagementByCluster[cluster.id] = avgEngagement;
      metrics.viralPotentialByCluster[cluster.id] = avgViralPotential;
    });

    // Identificar mejor y peor cluster
    const clusterScores = Object.entries(metrics.engagementByCluster);
    if (clusterScores.length > 0) {
      clusterScores.sort(([, a], [, b]) => b - a);
      metrics.bestPerformingCluster = clusterScores[0][0];
      metrics.worstPerformingCluster = clusterScores[clusterScores.length - 1][0];
    }

    return metrics;
  };

  // Generar recomendaciones de clusters
  const generateClusterRecommendations = (clusters, analytics) => {
    const recommendations = [];

    // Recomendar crear más contenido para clusters exitosos
    if (analytics.performanceMetrics.bestPerformingCluster) {
      recommendations.push({
        type: 'expand_cluster',
        clusterId: analytics.performanceMetrics.bestPerformingCluster,
        message: 'Este cluster tiene alto rendimiento. Considera crear más contenido similar.',
        priority: 'high'
      });
    }

    // Recomendar mejorar clusters con bajo rendimiento
    if (analytics.performanceMetrics.worstPerformingCluster) {
      recommendations.push({
        type: 'improve_cluster',
        clusterId: analytics.performanceMetrics.worstPerformingCluster,
        message: 'Este cluster tiene bajo rendimiento. Revisa la estrategia de contenido.',
        priority: 'medium'
      });
    }

    // Recomendar crear nuevos clusters si hay pocos
    if (clusters.length < 3) {
      recommendations.push({
        type: 'create_clusters',
        message: 'Considera diversificar tu contenido creando más series temáticas.',
        priority: 'low'
      });
    }

    return recommendations;
  };

  // Función para crear cluster manual
  const createManualCluster = (contentIds, clusterName, clusterType = 'manual') => {
    const newCluster = {
      id: `manual_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: clusterType,
      name: clusterName,
      description: `Cluster creado manualmente: ${clusterName}`,
      members: contentIds,
      centerContent: contentIds[0],
      coherenceScore: 1.0, // Manual clusters get max coherence
      createdAt: new Date(),
      isManual: true
    };

    setContentClusters(prev => [...prev, newCluster]);
    return newCluster;
  };

  // Función para sugerir contenido faltante en clusters
  const suggestMissingContentForCluster = (clusterId) => {
    const cluster = contentClusters.find(c => c.id === clusterId);
    if (!cluster) return [];

    const suggestions = [];

    // Analizar gaps en la secuencia temporal
    const members = cluster.members.map(id =>
      scheduledPosts.find(post => post.id === id)
    ).filter(Boolean);

    if (members.length > 0) {
      const centerContent = members.find(m => m.id === cluster.centerContent) || members[0];

      suggestions.push({
        type: 'continuation',
        message: `Crear contenido de seguimiento para "${centerContent.title}"`,
        suggestedTopic: `Parte 2: ${centerContent.title}`,
        estimatedEngagement: centerContent.expectedEngagement * 1.1
      });

      suggestions.push({
        type: 'variation',
        message: `Crear variación del tema principal`,
        suggestedTopic: `${centerContent.niche} - Enfoque alternativo`,
        estimatedEngagement: centerContent.expectedEngagement * 0.9
      });
    }

    return suggestions;
  };

  // PUNTO 17: Trend Surfing - Auto-adaptar a tendencias emergentes
  const [trendSurfingEngine, setTrendSurfingEngine] = useState({
    enabled: true,
    trendSources: {
      google_trends: { weight: 25, updateFrequency: 'hourly' },
      social_listening: { weight: 30, updateFrequency: 'real_time' },
      hashtag_analysis: { weight: 20, updateFrequency: 'every_30min' },
      competitor_monitoring: { weight: 15, updateFrequency: 'daily' },
      news_analysis: { weight: 10, updateFrequency: 'hourly' }
    },
    trendCategories: {
      viral_content: { priority: 'high', lifespan: 3, adaptationSpeed: 'immediate' },
      seasonal_trends: { priority: 'medium', lifespan: 30, adaptationSpeed: 'fast' },
      cultural_moments: { priority: 'high', lifespan: 7, adaptationSpeed: 'immediate' },
      industry_trends: { priority: 'medium', lifespan: 60, adaptationSpeed: 'moderate' },
      emerging_topics: { priority: 'low', lifespan: 14, adaptationSpeed: 'slow' }
    },
    adaptationStrategies: {
      content_modification: true,
      hashtag_injection: true,
      timing_adjustment: true,
      platform_prioritization: true,
      audience_targeting: true
    },
    trendThresholds: {
      viral_velocity: 1000, // menciones por hora
      engagement_spike: 300, // % de incremento
      hashtag_growth: 500, // nuevos usos por hora
      cross_platform_presence: 3 // mínimo de plataformas
    }
  });

  // Estado para tendencias activas
  const [activeTrends, setActiveTrends] = useState([]);
  const [trendHistory, setTrendHistory] = useState([]);
  const [adaptedContent, setAdaptedContent] = useState([]);

  // Función principal de trend surfing
  const detectAndSurfTrends = () => {
    // Detectar tendencias emergentes
    const detectedTrends = detectEmergingTrends();

    // Evaluar relevancia para el contenido
    const relevantTrends = evaluateTrendRelevance(detectedTrends);

    // Adaptar contenido existente a tendencias
    const adaptations = adaptContentToTrends(relevantTrends);

    // Generar nuevo contenido basado en tendencias
    const newTrendContent = generateTrendBasedContent(relevantTrends);

    // Actualizar estados
    setActiveTrends(relevantTrends);
    setAdaptedContent([...adaptations, ...newTrendContent]);

    return {
      trends: relevantTrends,
      adaptations: adaptations,
      newContent: newTrendContent,
      recommendations: generateTrendRecommendations(relevantTrends)
    };
  };

  // Detectar tendencias emergentes (simulado con datos realistas)
  const detectEmergingTrends = () => {
    const currentTrends = [
      {
        id: 'ai_productivity_2024',
        keyword: 'productividad con IA',
        category: 'industry_trends',
        platforms: ['tiktok', 'instagram', 'youtube'],
        velocity: 1250,
        engagementSpike: 450,
        relevantNiches: ['tech', 'lifestyle', 'business'],
        demographics: ['millennials', 'gen_z'],
        regions: ['global'],
        lifespan: 45,
        confidence: 0.85,
        detectedAt: new Date(),
        peakPrediction: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 días
      },
      {
        id: 'wellness_morning_routine',
        keyword: 'rutina matutina wellness',
        category: 'viral_content',
        platforms: ['tiktok', 'instagram'],
        velocity: 2100,
        engagementSpike: 680,
        relevantNiches: ['fitness', 'lifestyle', 'health'],
        demographics: ['gen_z', 'millennials'],
        regions: ['ecuador', 'colombia', 'mexico'],
        lifespan: 14,
        confidence: 0.92,
        detectedAt: new Date(),
        peakPrediction: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) // 3 días
      },
      {
        id: 'sustainable_fashion_tips',
        keyword: 'moda sostenible',
        category: 'cultural_moments',
        platforms: ['instagram', 'youtube', 'tiktok'],
        velocity: 890,
        engagementSpike: 320,
        relevantNiches: ['fashion', 'lifestyle'],
        demographics: ['gen_z', 'millennials'],
        regions: ['global'],
        lifespan: 21,
        confidence: 0.78,
        detectedAt: new Date(),
        peakPrediction: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000) // 5 días
      },
      {
        id: 'home_cooking_hacks',
        keyword: 'trucos de cocina casera',
        category: 'seasonal_trends',
        platforms: ['tiktok', 'instagram', 'youtube'],
        velocity: 1450,
        engagementSpike: 520,
        relevantNiches: ['food', 'lifestyle'],
        demographics: ['millennials', 'gen_x'],
        regions: ['ecuador', 'colombia', 'mexico'],
        lifespan: 30,
        confidence: 0.88,
        detectedAt: new Date(),
        peakPrediction: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000) // 10 días
      },
      {
        id: 'digital_minimalism',
        keyword: 'minimalismo digital',
        category: 'emerging_topics',
        platforms: ['youtube', 'instagram'],
        velocity: 650,
        engagementSpike: 280,
        relevantNiches: ['tech', 'lifestyle', 'wellness'],
        demographics: ['millennials', 'gen_x'],
        regions: ['global'],
        lifespan: 60,
        confidence: 0.72,
        detectedAt: new Date(),
        peakPrediction: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) // 14 días
      }
    ];

    // Filtrar tendencias que superan los thresholds
    return currentTrends.filter(trend => {
      const thresholds = trendSurfingEngine.trendThresholds;
      return trend.velocity >= thresholds.viral_velocity &&
        trend.engagementSpike >= thresholds.engagement_spike &&
        trend.platforms.length >= thresholds.cross_platform_presence;
    });
  };

  // Evaluar relevancia de tendencias para el contenido actual
  const evaluateTrendRelevance = (trends) => {
    return trends.map(trend => {
      const relevanceScore = calculateTrendRelevance(trend);
      const adaptationPotential = calculateAdaptationPotential(trend);
      const timingUrgency = calculateTimingUrgency(trend);

      return {
        ...trend,
        relevanceScore,
        adaptationPotential,
        timingUrgency,
        overallScore: (relevanceScore * 0.4) + (adaptationPotential * 0.3) + (timingUrgency * 0.3)
      };
    }).filter(trend => trend.overallScore >= 0.6)
      .sort((a, b) => b.overallScore - a.overallScore);
  };

  // Calcular relevancia de tendencia
  const calculateTrendRelevance = (trend) => {
    let relevance = 0.5; // Base score

    // Verificar coincidencia de nichos
    const userNiches = [...new Set(scheduledPosts.map(post => post.niche))];
    const nicheMatches = trend.relevantNiches.filter(niche => userNiches.includes(niche));
    relevance += (nicheMatches.length / trend.relevantNiches.length) * 0.3;

    // Verificar coincidencia demográfica
    const userDemographics = [...new Set(scheduledPosts.map(post => post.targetDemographic).filter(Boolean))];
    const demoMatches = trend.demographics.filter(demo => userDemographics.includes(demo));
    relevance += (demoMatches.length / trend.demographics.length) * 0.2;

    // Verificar coincidencia de plataformas
    const userPlatforms = [...new Set(scheduledPosts.map(post => post.platform))];
    const platformMatches = trend.platforms.filter(platform => userPlatforms.includes(platform));
    relevance += (platformMatches.length / trend.platforms.length) * 0.2;

    // Bonus por confianza de la tendencia
    relevance += trend.confidence * 0.1;

    return Math.min(relevance, 1);
  };

  // Calcular potencial de adaptación
  const calculateAdaptationPotential = (trend) => {
    let potential = 0.6; // Base score

    // Facilidad de adaptación por categoría
    const categoryPotentials = {
      viral_content: 0.9,
      cultural_moments: 0.8,
      seasonal_trends: 0.7,
      industry_trends: 0.6,
      emerging_topics: 0.5
    };
    potential *= categoryPotentials[trend.category] || 0.5;

    // Bonus por velocidad de la tendencia
    if (trend.velocity > 2000) potential += 0.2;
    else if (trend.velocity > 1500) potential += 0.15;
    else if (trend.velocity > 1000) potential += 0.1;

    // Bonus por spike de engagement
    if (trend.engagementSpike > 500) potential += 0.15;
    else if (trend.engagementSpike > 300) potential += 0.1;

    return Math.min(potential, 1);
  };

  // Calcular urgencia de timing
  const calculateTimingUrgency = (trend) => {
    const now = new Date();
    const peakTime = new Date(trend.peakPrediction);
    const daysUntilPeak = (peakTime - now) / (1000 * 60 * 60 * 24);

    // Más urgente si el pico está cerca
    if (daysUntilPeak <= 1) return 1.0;
    if (daysUntilPeak <= 3) return 0.9;
    if (daysUntilPeak <= 7) return 0.7;
    if (daysUntilPeak <= 14) return 0.5;
    return 0.3;
  };

  // Adaptar contenido existente a tendencias
  const adaptContentToTrends = (relevantTrends) => {
    const adaptations = [];

    scheduledPosts.forEach(post => {
      relevantTrends.forEach(trend => {
        // Verificar si el post es adaptable a esta tendencia
        if (isContentAdaptableToTrend(post, trend)) {
          const adaptation = createTrendAdaptation(post, trend);
          if (adaptation) {
            adaptations.push(adaptation);
          }
        }
      });
    });

    return adaptations;
  };

  // Verificar si contenido es adaptable a tendencia
  const isContentAdaptableToTrend = (post, trend) => {
    // Verificar coincidencia de nicho
    if (!trend.relevantNiches.includes(post.niche)) return false;

    // Verificar coincidencia de plataforma
    if (!trend.platforms.includes(post.platform)) return false;

    // Verificar que no esté ya adaptado
    const isAlreadyAdapted = adaptedContent.some(adapted =>
      adapted.originalId === post.id && adapted.trendId === trend.id
    );

    return !isAlreadyAdapted;
  };

  // Crear adaptación de contenido a tendencia
  const createTrendAdaptation = (originalPost, trend) => {
    const adaptationStrategies = trendSurfingEngine.adaptationStrategies;
    const adaptedPost = {
      ...originalPost,
      id: `${originalPost.id}_trend_${trend.id}`,
      originalId: originalPost.id,
      trendId: trend.id,
      trendKeyword: trend.keyword,
      adaptationType: 'trend_surfing',
      adaptedAt: new Date()
    };

    // Modificar contenido
    if (adaptationStrategies.content_modification) {
      adaptedPost.content = injectTrendIntoContent(originalPost.content, trend);
    }

    // Inyectar hashtags de tendencia
    if (adaptationStrategies.hashtag_injection) {
      adaptedPost.hashtags = injectTrendHashtags(originalPost.hashtags, trend);
    }

    // Ajustar timing
    if (adaptationStrategies.timing_adjustment) {
      adaptedPost.scheduledDate = adjustTimingForTrend(originalPost.scheduledDate, trend);
    }

    // Priorizar plataforma
    if (adaptationStrategies.platform_prioritization) {
      adaptedPost.platform = selectOptimalPlatformForTrend(originalPost.platform, trend);
    }

    // Ajustar targeting de audiencia
    if (adaptationStrategies.audience_targeting) {
      adaptedPost.targetDemographic = selectOptimalDemographicForTrend(originalPost.targetDemographic, trend);
    }

    // Calcular score de adaptación
    adaptedPost.trendAdaptationScore = calculateAdaptationScore(adaptedPost, trend);

    return adaptedPost;
  };

  // Inyectar tendencia en contenido
  const injectTrendIntoContent = (originalContent, trend) => {
    const injectionStrategies = [
      `${trend.keyword}: ${originalContent}`,
      `${originalContent} #${trend.keyword.replace(/\s+/g, '')}`,
      `Siguiendo la tendencia de ${trend.keyword}: ${originalContent}`,
      `${originalContent} - Parte del trend ${trend.keyword}`,
      `¿Ya probaste ${trend.keyword}? ${originalContent}`
    ];

    const selectedStrategy = injectionStrategies[Math.floor(Math.random() * injectionStrategies.length)];
    return selectedStrategy;
  };

  // Inyectar hashtags de tendencia
  const injectTrendHashtags = (originalHashtags, trend) => {
    const trendHashtags = [
      `#${trend.keyword.replace(/\s+/g, '')}`,
      `#${trend.keyword.split(' ')[0]}`,
      '#trending',
      '#viral',
      `#${trend.category}`
    ];

    // Combinar hashtags originales con hashtags de tendencia
    const combinedHashtags = [
      ...originalHashtags.slice(0, 6), // Mantener algunos originales
      ...trendHashtags.slice(0, 4) // Añadir hashtags de tendencia
    ];

    return [...new Set(combinedHashtags)].slice(0, 10); // Eliminar duplicados y limitar
  };

  // Ajustar timing para tendencia
  const adjustTimingForTrend = (originalDate, trend) => {
    const peakDate = new Date(trend.peakPrediction);
    const now = new Date();

    // Si el pico es muy pronto, programar inmediatamente
    if (peakDate - now < 24 * 60 * 60 * 1000) { // Menos de 24 horas
      const immediateDate = new Date(now.getTime() + 2 * 60 * 60 * 1000); // En 2 horas
      return immediateDate;
    }

    // Programar 1-2 días antes del pico
    const optimalDate = new Date(peakDate.getTime() - (1 + Math.random()) * 24 * 60 * 60 * 1000);
    return optimalDate > now ? optimalDate : originalDate;
  };

  // Seleccionar plataforma óptima para tendencia
  const selectOptimalPlatformForTrend = (originalPlatform, trend) => {
    // Si la plataforma original está en la tendencia, mantenerla
    if (trend.platforms.includes(originalPlatform)) {
      return originalPlatform;
    }

    // Seleccionar la primera plataforma de la tendencia
    return trend.platforms[0];
  };

  // Seleccionar demografía óptima para tendencia
  const selectOptimalDemographicForTrend = (originalDemo, trend) => {
    // Si la demografía original está en la tendencia, mantenerla
    if (trend.demographics.includes(originalDemo)) {
      return originalDemo;
    }

    // Seleccionar la primera demografía de la tendencia
    return trend.demographics[0];
  };

  // Calcular score de adaptación
  const calculateAdaptationScore = (adaptedPost, trend) => {
    let score = 0.6; // Base score

    // Bonus por relevancia de la tendencia
    score += trend.relevanceScore * 0.2;

    // Bonus por potencial de adaptación
    score += trend.adaptationPotential * 0.15;

    // Bonus por urgencia de timing
    score += trend.timingUrgency * 0.15;

    // Bonus por confianza de la tendencia
    score += trend.confidence * 0.1;

    return Math.min(score, 1);
  };

  // Generar nuevo contenido basado en tendencias
  const generateTrendBasedContent = (relevantTrends) => {
    const newContent = [];

    relevantTrends.slice(0, 3).forEach(trend => { // Solo top 3 tendencias
      const trendContent = createOriginalTrendContent(trend);
      if (trendContent) {
        newContent.push(trendContent);
      }
    });

    return newContent;
  };

  // Crear contenido original basado en tendencia
  const createOriginalTrendContent = (trend) => {
    const contentTemplates = {
      viral_content: [
        `🔥 ${trend.keyword} está VIRAL y aquí te explico por qué`,
        `POV: Descubriste ${trend.keyword} y cambió tu perspectiva`,
        `Todo lo que necesitas saber sobre ${trend.keyword} en 60 segundos`
      ],
      cultural_moments: [
        `${trend.keyword}: Por qué todos están hablando de esto`,
        `Mi experiencia con ${trend.keyword} - Thread completo`,
        `${trend.keyword} explicado de forma simple`
      ],
      seasonal_trends: [
        `${trend.keyword}: La tendencia perfecta para esta temporada`,
        `Cómo aprovechar ${trend.keyword} este mes`,
        `${trend.keyword}: Tips que funcionan ahora`
      ],
      industry_trends: [
        `${trend.keyword}: El futuro ya está aquí`,
        `Análisis profundo: ${trend.keyword} y su impacto`,
        `${trend.keyword}: Lo que los expertos no te dicen`
      ],
      emerging_topics: [
        `${trend.keyword}: La próxima gran tendencia`,
        `¿Has oído de ${trend.keyword}? Te explico todo`,
        `${trend.keyword}: Por qué deberías prestar atención`
      ]
    };

    const templates = contentTemplates[trend.category] || contentTemplates.viral_content;
    const selectedTemplate = templates[Math.floor(Math.random() * templates.length)];

    const newPost = {
      id: `trend_${trend.id}_${Date.now()}`,
      title: selectedTemplate,
      content: selectedTemplate,
      platform: trend.platforms[0],
      niche: trend.relevantNiches[0],
      targetDemographic: trend.demographics[0],
      scheduledDate: new Date(Date.now() + 4 * 60 * 60 * 1000), // En 4 horas
      hashtags: generateTrendHashtags(trend),
      status: 'trend_generated',
      trendId: trend.id,
      trendKeyword: trend.keyword,
      generatedAt: new Date(),
      trendScore: trend.overallScore,
      expectedViralPotential: calculateTrendViralPotential(trend)
    };

    return newPost;
  };

  // Generar hashtags para tendencia
  const generateTrendHashtags = (trend) => {
    const baseHashtags = [
      `#${trend.keyword.replace(/\s+/g, '')}`,
      '#trending',
      '#viral',
      `#${trend.category}`,
      `#${trend.relevantNiches[0]}`
    ];

    const platformHashtags = {
      tiktok: ['#fyp', '#parati', '#viral'],
      instagram: ['#instagood', '#trending', '#explore'],
      youtube: ['#youtube', '#trending', '#viral']
    };

    const platformTags = platformHashtags[trend.platforms[0]] || [];

    return [...baseHashtags, ...platformTags].slice(0, 8);
  };

  // Calcular potencial viral de tendencia
  const calculateTrendViralPotential = (trend) => {
    let potential = 60; // Base score

    // Bonus por velocidad
    potential += Math.min((trend.velocity / 1000) * 10, 20);

    // Bonus por engagement spike
    potential += Math.min((trend.engagementSpike / 100) * 5, 15);

    // Bonus por confianza
    potential += trend.confidence * 10;

    // Bonus por urgencia
    potential += trend.timingUrgency * 15;

    return Math.min(potential, 95);
  };

  // Generar recomendaciones de tendencias
  const generateTrendRecommendations = (trends) => {
    const recommendations = [];

    trends.forEach(trend => {
      if (trend.overallScore > 0.8) {
        recommendations.push({
          type: 'high_priority',
          trendId: trend.id,
          message: `¡Tendencia de alta prioridad! ${trend.keyword} tiene potencial viral muy alto`,
          action: 'create_content_immediately',
          urgency: 'immediate'
        });
      } else if (trend.overallScore > 0.6) {
        recommendations.push({
          type: 'moderate_priority',
          trendId: trend.id,
          message: `Considera crear contenido sobre ${trend.keyword}`,
          action: 'plan_content_creation',
          urgency: 'within_24h'
        });
      }
    });

    return recommendations;
  };

  // Monitoreo automático de tendencias
  const startTrendMonitoring = () => {
    const monitoringInterval = setInterval(() => {
      const trendResults = detectAndSurfTrends();
      console.log('Tendencias detectadas:', trendResults.trends.length);

      // Actualizar historial de tendencias
      setTrendHistory(prev => [
        ...prev.slice(-50), // Mantener últimas 50 entradas
        {
          timestamp: new Date(),
          trendsDetected: trendResults.trends.length,
          adaptationsMade: trendResults.adaptations.length,
          newContentGenerated: trendResults.newContent.length
        }
      ]);
    }, 1800000); // Cada 30 minutos

    return monitoringInterval;
  };

  // PUNTO 18: Performance Alerts - Notificaciones de bajo rendimiento
  const [performanceAlertsEngine, setPerformanceAlertsEngine] = useState({
    enabled: true,
    alertTypes: {
      low_engagement: {
        threshold: 2, // % mínimo de engagement
        severity: 'high',
        checkInterval: 2, // horas después de publicar
        autoActions: ['suggest_boost', 'recommend_repost', 'analyze_timing']
      },
      low_reach: {
        threshold: 500, // alcance mínimo
        severity: 'medium',
        checkInterval: 4, // horas después de publicar
        autoActions: ['hashtag_analysis', 'platform_switch', 'audience_expansion']
      },
      declining_performance: {
        threshold: -30, // % de decline vs promedio
        severity: 'medium',
        checkInterval: 6, // horas después de publicar
        autoActions: ['performance_analysis', 'content_audit', 'strategy_review']
      },
      viral_opportunity_missed: {
        threshold: 80, // score viral pero bajo performance
        severity: 'high',
        checkInterval: 1, // hora después de publicar
        autoActions: ['immediate_boost', 'cross_platform_push', 'influencer_outreach']
      },
      audience_mismatch: {
        threshold: 0.3, // ratio de engagement esperado vs real
        severity: 'low',
        checkInterval: 8, // horas después de publicar
        autoActions: ['audience_analysis', 'targeting_adjustment', 'content_adaptation']
      }
    },
    notificationChannels: {
      in_app: true,
      email: false,
      push: true,
      slack: false,
      webhook: false
    },
    alertFrequency: {
      immediate: ['viral_opportunity_missed', 'low_engagement'],
      hourly: ['low_reach'],
      daily: ['declining_performance', 'audience_mismatch']
    },
    autoResponseEnabled: true,
    learningEnabled: true
  });

  // Estado para alertas activas
  const [activeAlerts, setActiveAlerts] = useState([]);
  const [alertHistory, setAlertHistory] = useState([]);
  const [performanceMetrics, setPerformanceMetrics] = useState({});

  // Función principal de monitoreo de performance
  const monitorContentPerformance = () => {
    const publishedPosts = scheduledPosts.filter(post =>
      post.status === 'published' || post.status === 'live'
    );

    const newAlerts = [];
    const updatedMetrics = {};

    publishedPosts.forEach(post => {
      // Simular métricas de performance reales
      const currentMetrics = generateCurrentMetrics(post);
      updatedMetrics[post.id] = currentMetrics;

      // Evaluar cada tipo de alerta
      Object.entries(performanceAlertsEngine.alertTypes).forEach(([alertType, config]) => {
        const alertResult = evaluateAlert(post, currentMetrics, alertType, config);
        if (alertResult.shouldAlert) {
          newAlerts.push(alertResult.alert);
        }
      });
    });

    // Actualizar estados
    setPerformanceMetrics(updatedMetrics);
    setActiveAlerts(prev => [...prev, ...newAlerts]);

    // Procesar alertas automáticamente si está habilitado
    if (performanceAlertsEngine.autoResponseEnabled) {
      processAutoResponses(newAlerts);
    }

    return {
      newAlerts: newAlerts.length,
      totalActiveAlerts: activeAlerts.length + newAlerts.length,
      criticalAlerts: newAlerts.filter(alert => alert.severity === 'high').length
    };
  };

  // Generar métricas actuales simuladas
  const generateCurrentMetrics = (post) => {
    const hoursPublished = Math.max(1, Math.floor((new Date() - post.scheduledDate) / (1000 * 60 * 60)));
    const baseEngagement = post.expectedEngagement || 5;
    const baseReach = post.estimatedReach || 5000;

    // Simular variabilidad realista
    const engagementVariation = (Math.random() - 0.5) * 4; // ±2%
    const reachVariation = (Math.random() - 0.5) * 0.4; // ±20%

    return {
      currentEngagement: Math.max(0.1, baseEngagement + engagementVariation),
      currentReach: Math.max(100, Math.floor(baseReach * (1 + reachVariation))),
      currentLikes: Math.floor((baseReach * (baseEngagement / 100)) * 0.7),
      currentComments: Math.floor((baseReach * (baseEngagement / 100)) * 0.2),
      currentShares: Math.floor((baseReach * (baseEngagement / 100)) * 0.1),
      hoursPublished: hoursPublished,
      engagementRate: (baseEngagement + engagementVariation),
      reachGrowthRate: Math.max(-50, (Math.random() - 0.3) * 100), // Puede ser negativo
      viralScore: post.viralScore || 50,
      timestamp: new Date()
    };
  };

  // Evaluar si se debe generar una alerta
  const evaluateAlert = (post, metrics, alertType, config) => {
    const shouldCheck = metrics.hoursPublished >= config.checkInterval;
    if (!shouldCheck) {
      return { shouldAlert: false };
    }

    let alertTriggered = false;
    let alertMessage = '';
    let alertData = {};

    switch (alertType) {
      case 'low_engagement':
        alertTriggered = metrics.currentEngagement < config.threshold;
        alertMessage = `Engagement muy bajo: ${metrics.currentEngagement.toFixed(2)}% (esperado: ${post.expectedEngagement}%)`;
        alertData = {
          current: metrics.currentEngagement,
          expected: post.expectedEngagement,
          deficit: post.expectedEngagement - metrics.currentEngagement
        };
        break;

      case 'low_reach':
        alertTriggered = metrics.currentReach < config.threshold;
        alertMessage = `Alcance bajo: ${metrics.currentReach} personas (mínimo: ${config.threshold})`;
        alertData = {
          current: metrics.currentReach,
          minimum: config.threshold,
          deficit: config.threshold - metrics.currentReach
        };
        break;

      case 'declining_performance':
        const avgPerformance = calculateAveragePerformance(post.niche, post.platform);
        const performanceRatio = (metrics.currentEngagement / avgPerformance) * 100 - 100;
        alertTriggered = performanceRatio < config.threshold;
        alertMessage = `Performance ${performanceRatio.toFixed(1)}% por debajo del promedio`;
        alertData = {
          currentPerformance: metrics.currentEngagement,
          averagePerformance: avgPerformance,
          declinePercentage: Math.abs(performanceRatio)
        };
        break;

      case 'viral_opportunity_missed':
        alertTriggered = metrics.viralScore > config.threshold && metrics.currentEngagement < post.expectedEngagement * 0.7;
        alertMessage = `¡Oportunidad viral perdida! Score ${metrics.viralScore} pero bajo engagement`;
        alertData = {
          viralScore: metrics.viralScore,
          currentEngagement: metrics.currentEngagement,
          expectedEngagement: post.expectedEngagement,
          opportunityLoss: (post.expectedEngagement - metrics.currentEngagement) / post.expectedEngagement * 100
        };
        break;

      case 'audience_mismatch':
        const engagementRatio = metrics.currentEngagement / (post.expectedEngagement || 5);
        alertTriggered = engagementRatio < config.threshold;
        alertMessage = `Posible desajuste de audiencia: ratio ${engagementRatio.toFixed(2)}`;
        alertData = {
          engagementRatio: engagementRatio,
          currentEngagement: metrics.currentEngagement,
          expectedEngagement: post.expectedEngagement,
          mismatchSeverity: 1 - engagementRatio
        };
        break;
    }

    if (alertTriggered) {
      const alert = {
        id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        type: alertType,
        postId: post.id,
        postTitle: post.title,
        severity: config.severity,
        message: alertMessage,
        data: alertData,
        metrics: metrics,
        createdAt: new Date(),
        status: 'active',
        autoActions: config.autoActions,
        recommendations: generateAlertRecommendations(alertType, alertData, post)
      };

      return { shouldAlert: true, alert };
    }

    return { shouldAlert: false };
  };

  // Calcular performance promedio
  const calculateAveragePerformance = (niche, platform) => {
    const averages = {
      fitness: { tiktok: 8.5, instagram: 6.2, youtube: 4.8, facebook: 3.1 },
      food: { tiktok: 7.8, instagram: 8.1, youtube: 5.2, facebook: 4.3 },
      fashion: { tiktok: 9.2, instagram: 7.8, youtube: 4.1, facebook: 2.9 },
      tech: { tiktok: 6.1, instagram: 5.4, youtube: 6.8, facebook: 3.7 }
    };

    return averages[niche]?.[platform] || 5.5;
  };

  // Generar recomendaciones específicas por alerta
  const generateAlertRecommendations = (alertType, alertData, post) => {
    const recommendations = [];

    switch (alertType) {
      case 'low_engagement':
        recommendations.push(
          {
            action: 'boost_post',
            description: 'Considera hacer boost pagado del post',
            priority: 'high',
            estimatedImpact: 'Puede aumentar engagement 2-3x'
          },
          {
            action: 'add_trending_hashtags',
            description: 'Añadir hashtags trending en comentarios',
            priority: 'medium',
            estimatedImpact: 'Incremento de 15-25% en alcance'
          }
        );
        break;

      case 'viral_opportunity_missed':
        recommendations.push(
          {
            action: 'immediate_promotion',
            description: '¡URGENTE! Promocionar inmediatamente',
            priority: 'critical',
            estimatedImpact: 'Puede recuperar potencial viral'
          }
        );
        break;
    }

    return recommendations;
  };

  // Procesar respuestas automáticas
  const processAutoResponses = (alerts) => {
    alerts.forEach(alert => {
      if (alert.severity === 'high') {
        console.log(`Procesando alerta automática: ${alert.message}`);
      }
    });
  };

  // Iniciar monitoreo automático de performance
  const startPerformanceMonitoring = () => {
    const monitoringInterval = setInterval(() => {
      const results = monitorContentPerformance();
      console.log('Performance monitoring:', results);
    }, 600000); // Cada 10 minutos

    return monitoringInterval;
  };

  // PUNTO 19: Smart Reposting - Republicar contenido exitoso optimizado
  const [smartRepostingEngine, setSmartRepostingEngine] = useState({
    enabled: true,
    repostCriteria: {
      high_performance: {
        minEngagement: 8, // % mínimo de engagement
        minReach: 10000, // alcance mínimo
        minViralScore: 70, // score viral mínimo
        ageLimit: 30 // días máximo desde publicación
      },
      viral_content: {
        minEngagement: 12, // % mínimo de engagement
        minReach: 25000, // alcance mínimo
        minViralScore: 85, // score viral mínimo
        ageLimit: 90 // días máximo desde publicación
      },
      evergreen_content: {
        minEngagement: 6, // % mínimo de engagement
        minReach: 5000, // alcance mínimo
        consistentPerformance: true, // performance consistente
        ageLimit: 365 // días máximo desde publicación
      }
    },
    repostStrategies: {
      timing_optimization: true, // Optimizar horario de repost
      content_refresh: true, // Refrescar contenido ligeramente
      platform_diversification: true, // Repostear en otras plataformas
      audience_expansion: true, // Expandir a nuevas audiencias
      seasonal_adaptation: true, // Adaptar a temporada actual
      hashtag_update: true // Actualizar hashtags trending
    },
    repostFrequency: {
      high_performers: 14, // días entre reposts
      viral_content: 30, // días entre reposts
      evergreen_content: 60 // días entre reposts
    },
    optimizationFactors: {
      timing_weight: 25,
      hashtag_weight: 20,
      content_weight: 20,
      platform_weight: 15,
      audience_weight: 10,
      seasonal_weight: 10
    }
  });

  // Estado para reposts inteligentes
  const [repostCandidates, setRepostCandidates] = useState([]);
  const [scheduledReposts, setScheduledReposts] = useState([]);
  const [repostHistory, setRepostHistory] = useState([]);

  // Función principal de smart reposting
  const analyzeAndScheduleReposts = () => {
    // Identificar candidatos para repost
    const candidates = identifyRepostCandidates();

    // Optimizar cada candidato
    const optimizedReposts = candidates.map(candidate =>
      optimizeRepostContent(candidate)
    );

    // Programar reposts optimizados
    const scheduledReposts = scheduleOptimizedReposts(optimizedReposts);

    // Actualizar estados
    setRepostCandidates(candidates);
    setScheduledReposts(prev => [...prev, ...scheduledReposts]);

    return {
      candidatesFound: candidates.length,
      repostsScheduled: scheduledReposts.length,
      totalValue: calculateTotalRepostValue(scheduledReposts)
    };
  };

  // Identificar candidatos para repost
  const identifyRepostCandidates = () => {
    const publishedPosts = scheduledPosts.filter(post =>
      post.status === 'published' && post.actualReach && post.engagement
    );

    const candidates = [];

    publishedPosts.forEach(post => {
      const postAge = calculatePostAge(post.scheduledDate);
      const performanceMetrics = calculatePostPerformance(post);

      // Evaluar contra cada criterio de repost
      Object.entries(smartRepostingEngine.repostCriteria).forEach(([criteriaType, criteria]) => {
        if (meetsRepostCriteria(post, performanceMetrics, criteria, postAge)) {
          // Verificar si no se ha reposteado recientemente
          const lastRepost = getLastRepostDate(post.id);
          const daysSinceRepost = lastRepost ?
            (new Date() - lastRepost) / (1000 * 60 * 60 * 24) : 999;

          const minDaysBetweenReposts = smartRepostingEngine.repostFrequency[
            criteriaType.replace('_content', '_performers')
          ] || 30;

          if (daysSinceRepost >= minDaysBetweenReposts) {
            candidates.push({
              originalPost: post,
              criteriaType: criteriaType,
              performanceMetrics: performanceMetrics,
              repostPotential: calculateRepostPotential(post, performanceMetrics, criteriaType),
              lastRepostDate: lastRepost,
              daysSinceRepost: daysSinceRepost
            });
          }
        }
      });
    });

    // Ordenar por potencial de repost
    return candidates.sort((a, b) => b.repostPotential - a.repostPotential);
  };

  // Calcular edad del post
  const calculatePostAge = (publishDate) => {
    return Math.floor((new Date() - new Date(publishDate)) / (1000 * 60 * 60 * 24));
  };

  // Calcular performance del post
  const calculatePostPerformance = (post) => {
    const engagement = parseFloat(post.engagement?.replace('%', '')) || 0;
    const reach = post.actualReach || post.estimatedReach || 0;
    const viralScore = post.viralScore || 0;

    return {
      engagement: engagement,
      reach: reach,
      viralScore: viralScore,
      likes: post.actualLikes || Math.floor(reach * (engagement / 100) * 0.7),
      comments: post.actualComments || Math.floor(reach * (engagement / 100) * 0.2),
      shares: post.actualShares || Math.floor(reach * (engagement / 100) * 0.1),
      overallScore: (engagement * 0.4) + (viralScore * 0.3) + (Math.min(reach / 1000, 50) * 0.3)
    };
  };

  // Verificar si cumple criterios de repost
  const meetsRepostCriteria = (post, metrics, criteria, postAge) => {
    if (postAge > criteria.ageLimit) return false;
    if (metrics.engagement < criteria.minEngagement) return false;
    if (metrics.reach < criteria.minReach) return false;
    if (metrics.viralScore < criteria.minViralScore) return false;

    // Verificar performance consistente para evergreen content
    if (criteria.consistentPerformance) {
      return checkConsistentPerformance(post);
    }

    return true;
  };

  // Verificar performance consistente
  const checkConsistentPerformance = (post) => {
    // Simular verificación de performance consistente
    // En implementación real, verificaría métricas históricas
    return post.viralScore > 60 && parseFloat(post.engagement?.replace('%', '')) > 5;
  };

  // Obtener fecha del último repost
  const getLastRepostDate = (originalPostId) => {
    const lastRepost = repostHistory
      .filter(repost => repost.originalPostId === originalPostId)
      .sort((a, b) => new Date(b.repostedAt) - new Date(a.repostedAt))[0];

    return lastRepost ? new Date(lastRepost.repostedAt) : null;
  };

  // Calcular potencial de repost
  const calculateRepostPotential = (post, metrics, criteriaType) => {
    let potential = 50; // Base score

    // Factor de engagement
    potential += Math.min(metrics.engagement * 2, 30);

    // Factor de alcance
    potential += Math.min(metrics.reach / 1000, 20);

    // Factor viral
    potential += Math.min(metrics.viralScore / 5, 20);

    // Bonus por tipo de criterio
    const criteriaBonus = {
      high_performance: 10,
      viral_content: 20,
      evergreen_content: 15
    };
    potential += criteriaBonus[criteriaType] || 0;

    // Factor de edad (contenido más reciente tiene más potencial)
    const postAge = calculatePostAge(post.scheduledDate);
    const ageFactor = Math.max(0, 20 - (postAge / 5));
    potential += ageFactor;

    return Math.min(potential, 100);
  };

  // Optimizar contenido para repost
  const optimizeRepostContent = (candidate) => {
    const { originalPost, criteriaType, performanceMetrics } = candidate;
    const strategies = smartRepostingEngine.repostStrategies;

    const optimizedRepost = {
      id: `repost_${originalPost.id}_${Date.now()}`,
      originalPostId: originalPost.id,
      type: 'smart_repost',
      criteriaType: criteriaType,
      originalContent: originalPost.content,
      originalHashtags: originalPost.hashtags,
      performanceMetrics: performanceMetrics,
      optimizations: {}
    };

    // Aplicar optimizaciones
    if (strategies.content_refresh) {
      optimizedRepost.content = refreshContent(originalPost.content, criteriaType);
      optimizedRepost.optimizations.content_refresh = true;
    } else {
      optimizedRepost.content = originalPost.content;
    }

    if (strategies.hashtag_update) {
      optimizedRepost.hashtags = updateHashtagsForRepost(originalPost.hashtags, originalPost.niche);
      optimizedRepost.optimizations.hashtag_update = true;
    } else {
      optimizedRepost.hashtags = originalPost.hashtags;
    }

    if (strategies.timing_optimization) {
      optimizedRepost.optimalTiming = calculateOptimalRepostTiming(originalPost);
      optimizedRepost.optimizations.timing_optimization = true;
    }

    if (strategies.platform_diversification) {
      optimizedRepost.alternativePlatforms = suggestAlternativePlatforms(originalPost);
      optimizedRepost.optimizations.platform_diversification = true;
    }

    if (strategies.audience_expansion) {
      optimizedRepost.expandedAudience = generateExpandedAudience(originalPost);
      optimizedRepost.optimizations.audience_expansion = true;
    }

    if (strategies.seasonal_adaptation) {
      optimizedRepost.seasonalAdaptation = applySeasonalAdaptation(originalPost.content);
      optimizedRepost.optimizations.seasonal_adaptation = true;
    }

    // Calcular score de optimización
    optimizedRepost.optimizationScore = calculateOptimizationScore(optimizedRepost);

    // Predecir performance del repost
    optimizedRepost.predictedPerformance = predictRepostPerformance(originalPost, optimizedRepost);

    return optimizedRepost;
  };

  // Refrescar contenido para repost
  const refreshContent = (originalContent, criteriaType) => {
    const refreshStrategies = {
      high_performance: [
        `🔥 REPOST: ${originalContent}`,
        `Por si te lo perdiste: ${originalContent}`,
        `Volviendo con este hit: ${originalContent}`,
        `Recordatorio importante: ${originalContent}`
      ],
      viral_content: [
        `✨ VIRAL AGAIN: ${originalContent}`,
        `Esto sigue siendo GOLD: ${originalContent}`,
        `El post que rompió internet: ${originalContent}`,
        `Vuelve el contenido más viral: ${originalContent}`
      ],
      evergreen_content: [
        `Siempre relevante: ${originalContent}`,
        `Contenido atemporal: ${originalContent}`,
        `Nunca pasa de moda: ${originalContent}`,
        `Recordatorio valioso: ${originalContent}`
      ]
    };

    const strategies = refreshStrategies[criteriaType] || refreshStrategies.high_performance;
    return strategies[Math.floor(Math.random() * strategies.length)];
  };

  // Actualizar hashtags para repost
  const updateHashtagsForRepost = (originalHashtags, niche) => {
    // Obtener hashtags trending actuales
    const currentTrendingHashtags = generateSmartHashtags(niche, 'tiktok', 'ecuador', 'post');

    // Combinar hashtags originales con trending
    const updatedHashtags = [
      ...originalHashtags.slice(0, 5), // Mantener algunos originales
      ...currentTrendingHashtags.slice(0, 3).map(h => h.tag), // Añadir trending
      '#repost', '#throwback', '#stillrelevant'
    ];

    return [...new Set(updatedHashtags)].slice(0, 10);
  };

  // Calcular timing óptimo para repost
  const calculateOptimalRepostTiming = (originalPost) => {
    const now = new Date();
    const originalHour = new Date(originalPost.scheduledDate).getHours();

    // Encontrar horario diferente al original pero óptimo para la plataforma
    const platformPeakHours = {
      tiktok: [19, 20, 21, 22],
      instagram: [18, 19, 20],
      youtube: [20, 21, 22],
      facebook: [18, 19, 20]
    };

    const peakHours = platformPeakHours[originalPost.platform] || [19, 20, 21];
    const alternativeHours = peakHours.filter(hour => hour !== originalHour);
    const optimalHour = alternativeHours[0] || peakHours[0];

    // Programar para mañana en el horario óptimo
    const repostDate = new Date(now);
    repostDate.setDate(repostDate.getDate() + 1);
    repostDate.setHours(optimalHour, Math.floor(Math.random() * 60), 0, 0);

    return repostDate;
  };

  // Sugerir plataformas alternativas
  const suggestAlternativePlatforms = (originalPost) => {
    const allPlatforms = ['tiktok', 'instagram', 'youtube', 'facebook'];
    const alternatives = allPlatforms.filter(platform => platform !== originalPost.platform);

    return alternatives.map(platform => ({
      platform: platform,
      adaptationRequired: platform !== originalPost.platform,
      expectedReach: estimateReachForPlatform(originalPost, platform),
      confidence: calculatePlatformConfidence(originalPost.niche, platform)
    }));
  };

  // Generar audiencia expandida
  const generateExpandedAudience = (originalPost) => {
    const currentDemo = originalPost.targetDemographic || 'millennials';
    const expandedDemographics = ['gen_z', 'millennials', 'gen_x'].filter(demo => demo !== currentDemo);

    return {
      primaryAudience: currentDemo,
      expandedDemographics: expandedDemographics,
      geographicExpansion: ['ecuador', 'colombia', 'mexico'],
      interestExpansion: generateRelatedInterests(originalPost.niche)
    };
  };

  // Aplicar adaptación estacional
  const applySeasonalAdaptation = (content) => {
    const currentMonth = new Date().getMonth();
    const seasonalPrefixes = {
      11: '🎄 Especial Navidad: ', // Diciembre
      0: '🎊 Año Nuevo: ', // Enero
      1: '💕 San Valentín: ', // Febrero
      6: '☀️ Verano: ', // Julio
      8: '🍂 Otoño: ' // Septiembre
    };

    const prefix = seasonalPrefixes[currentMonth];
    return prefix ? `${prefix}${content}` : content;
  };

  // Calcular score de optimización
  const calculateOptimizationScore = (optimizedRepost) => {
    let score = 60; // Base score

    // Bonus por cada optimización aplicada
    const optimizations = optimizedRepost.optimizations;
    Object.values(optimizations).forEach(applied => {
      if (applied) score += 8;
    });

    return Math.min(score, 100);
  };

  // Predecir performance del repost
  const predictRepostPerformance = (originalPost, optimizedRepost) => {
    const originalMetrics = calculatePostPerformance(originalPost);

    // Factor de degradación por repost (típicamente 70-90% del original)
    const repostFactor = 0.75 + (optimizedRepost.optimizationScore / 100) * 0.2;

    return {
      expectedEngagement: originalMetrics.engagement * repostFactor,
      expectedReach: originalMetrics.reach * repostFactor,
      expectedViralScore: originalMetrics.viralScore * repostFactor,
      confidence: optimizedRepost.optimizationScore,
      improvementFactors: Object.keys(optimizedRepost.optimizations).filter(
        key => optimizedRepost.optimizations[key]
      )
    };
  };

  // Programar reposts optimizados
  const scheduleOptimizedReposts = (optimizedReposts) => {
    return optimizedReposts.slice(0, 5).map(repost => ({ // Limitar a 5 reposts
      ...repost,
      scheduledDate: repost.optimalTiming || new Date(Date.now() + 24 * 60 * 60 * 1000),
      status: 'scheduled_repost',
      createdAt: new Date(),
      platform: repost.originalPost?.platform || 'tiktok',
      niche: repost.originalPost?.niche || 'general'
    }));
  };

  // Calcular valor total de reposts
  const calculateTotalRepostValue = (scheduledReposts) => {
    return scheduledReposts.reduce((total, repost) => {
      const expectedValue = repost.predictedPerformance?.expectedReach || 0;
      return total + expectedValue;
    }, 0);
  };

  // Funciones auxiliares
  const estimateReachForPlatform = (originalPost, platform) => {
    const platformMultipliers = {
      tiktok: 1.2,
      instagram: 1.0,
      youtube: 0.8,
      facebook: 0.6
    };

    const baseReach = originalPost.actualReach || originalPost.estimatedReach || 5000;
    return Math.floor(baseReach * (platformMultipliers[platform] || 1.0));
  };

  const calculatePlatformConfidence = (niche, platform) => {
    const confidenceMatrix = {
      fitness: { tiktok: 0.9, instagram: 0.8, youtube: 0.7, facebook: 0.5 },
      food: { tiktok: 0.8, instagram: 0.9, youtube: 0.7, facebook: 0.6 },
      fashion: { tiktok: 0.9, instagram: 0.9, youtube: 0.6, facebook: 0.4 },
      tech: { tiktok: 0.7, instagram: 0.6, youtube: 0.9, facebook: 0.7 }
    };

    return confidenceMatrix[niche]?.[platform] || 0.7;
  };

  const generateRelatedInterests = (niche) => {
    const relatedInterests = {
      fitness: ['health', 'nutrition', 'wellness', 'sports'],
      food: ['cooking', 'nutrition', 'restaurants', 'health'],
      fashion: ['beauty', 'lifestyle', 'shopping', 'trends'],
      tech: ['innovation', 'productivity', 'gadgets', 'digital']
    };

    return relatedInterests[niche] || ['lifestyle', 'trends'];
  };

  // Iniciar análisis automático de reposts
  const startSmartRepostingAnalysis = () => {
    const analysisInterval = setInterval(() => {
      const results = analyzeAndScheduleReposts();
      console.log('Smart reposting analysis:', results);
    }, 86400000); // Cada 24 horas

    return analysisInterval;
  };

  // PUNTO 20: Templates automáticos por nicho
  const [nicheTemplatesEngine, setNicheTemplatesEngine] = useState({
    enabled: true,
    templateCategories: {
      hooks: {
        fitness: [
          "POV: Empezaste a entrenar y ahora...",
          "Nadie me dijo que hacer ejercicio...",
          "Plot twist: El gym cambió mi vida porque...",
          "¿Sabías que entrenar en ayunas...?",
          "Mi entrenador me dijo esto y...",
          "El secreto que los fitness influencers no dicen:",
          "Después de 6 meses entrenando descubrí que..."
        ],
        food: [
          "POV: Probaste esta receta y...",
          "Nadie me dijo que cocinar...",
          "Plot twist: Este ingrediente secreto...",
          "¿Sabías que esta comida...?",
          "Mi abuela me enseñó esto y...",
          "El truco de chef que cambió mi cocina:",
          "Después de años cocinando descubrí que..."
        ],
        fashion: [
          "POV: Te pusiste este outfit y...",
          "Nadie me dijo que vestirse así...",
          "Plot twist: Esta combinación...",
          "¿Sabías que este color...?",
          "Mi estilista me dijo esto y...",
          "El secreto de moda que nadie cuenta:",
          "Después de años vistiendo mal descubrí que..."
        ],
        tech: [
          "POV: Usaste esta app y...",
          "Nadie me dijo que la tecnología...",
          "Plot twist: Esta función oculta...",
          "¿Sabías que tu teléfono...?",
          "Un programador me contó esto y...",
          "El hack tecnológico que cambió todo:",
          "Después de años usando mal la tech descubrí que..."
        ]
      },
      structures: {
        tutorial: {
          intro: "Hoy te enseño cómo {action} en {timeframe}",
          steps: ["Paso 1: {step1}", "Paso 2: {step2}", "Paso 3: {step3}"],
          conclusion: "¡Y listo! Ahora ya sabes cómo {action}. ¿Cuál vas a probar primero?"
        },
        transformation: {
          intro: "Mi transformación en {timeframe}: de {before} a {after}",
          process: "Lo que hice: {method}",
          results: "Los resultados: {outcome}",
          conclusion: "Si yo pude, tú también puedes. ¿Empezamos?"
        },
        tips: {
          intro: "{number} tips de {topic} que cambiarán tu {area}",
          tips: ["Tip 1: {tip1}", "Tip 2: {tip2}", "Tip 3: {tip3}"],
          conclusion: "¿Cuál tip vas a aplicar hoy? Cuéntame en comentarios"
        },
        story: {
          intro: "Te cuento la historia de cómo {achievement}",
          conflict: "El problema era: {problem}",
          solution: "La solución: {solution}",
          conclusion: "Moraleja: {lesson}. ¿Te ha pasado algo similar?"
        }
      },
      callToActions: {
        engagement: [
          "¿Cuál es tu experiencia con esto?",
          "Cuéntame en comentarios si te ha pasado",
          "¿Qué opinas? ¿Estás de acuerdo?",
          "Comparte si esto te ayudó",
          "¿Tienes algún tip adicional?",
          "¿Cuál vas a probar primero?",
          "Etiqueta a alguien que necesita ver esto"
        ],
        action: [
          "Guarda este post para después",
          "Sígueme para más contenido así",
          "Comparte si te gustó",
          "Dale like si te sirvió",
          "¿Quieres que haga más videos así?",
          "Activa las notificaciones",
          "¡No te olvides de seguirme!"
        ]
      }
    },
    nicheSpecificElements: {
      fitness: {
        keywords: ["entrenamiento", "músculo", "cardio", "fuerza", "resistencia", "flexibilidad"],
        emojis: ["💪", "🏋️", "🔥", "💦", "⚡", "🎯"],
        hashtags: ["#fitness", "#gym", "#workout", "#training", "#muscle", "#cardio"],
        timing: "morning_evening",
        avgLength: 120,
        tone: "motivacional"
      },
      food: {
        keywords: ["receta", "ingredientes", "sabor", "cocina", "delicioso", "nutritivo"],
        emojis: ["🍳", "🥘", "😋", "👨‍🍳", "🔥", "✨"],
        hashtags: ["#food", "#recipe", "#cooking", "#delicious", "#chef", "#foodie"],
        timing: "lunch_dinner",
        avgLength: 100,
        tone: "descriptivo"
      },
      fashion: {
        keywords: ["outfit", "estilo", "tendencia", "look", "combinación", "elegante"],
        emojis: ["👗", "👠", "💄", "✨", "🔥", "💎"],
        hashtags: ["#fashion", "#style", "#outfit", "#ootd", "#trend", "#look"],
        timing: "afternoon_evening",
        avgLength: 80,
        tone: "aspiracional"
      },
      tech: {
        keywords: ["innovación", "tecnología", "app", "función", "productividad", "digital"],
        emojis: ["📱", "💻", "⚡", "🚀", "🔧", "💡"],
        hashtags: ["#tech", "#innovation", "#app", "#digital", "#productivity", "#gadget"],
        timing: "work_hours",
        avgLength: 150,
        tone: "informativo"
      }
    },
    templatePersonalization: {
      demographic_adaptation: true,
      regional_localization: true,
      platform_optimization: true,
      seasonal_adjustment: true,
      trending_integration: true
    }
  });

  // Estado para templates generados
  const [generatedTemplates, setGeneratedTemplates] = useState([]);
  const [templateLibrary, setTemplateLibrary] = useState({});

  // Función principal para generar templates automáticos
  const generateNicheTemplates = (niche, contentType = 'mixed', count = 10) => {
    const templates = [];
    const nicheData = nicheTemplatesEngine.nicheSpecificElements[niche];

    if (!nicheData) {
      console.warn(`Nicho ${niche} no encontrado`);
      return [];
    }

    for (let i = 0; i < count; i++) {
      const template = createNicheTemplate(niche, contentType, nicheData);
      if (template) {
        templates.push(template);
      }
    }

    // Actualizar biblioteca de templates
    setTemplateLibrary(prev => ({
      ...prev,
      [niche]: [...(prev[niche] || []), ...templates]
    }));

    setGeneratedTemplates(prev => [...prev, ...templates]);

    return templates;
  };

  // Crear template específico por nicho
  const createNicheTemplate = (niche, contentType, nicheData) => {
    const templateTypes = ['tutorial', 'transformation', 'tips', 'story'];
    const selectedType = contentType === 'mixed' ?
      templateTypes[Math.floor(Math.random() * templateTypes.length)] : contentType;

    const template = {
      id: `template_${niche}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      niche: niche,
      type: selectedType,
      createdAt: new Date(),
      structure: nicheTemplatesEngine.templateCategories.structures[selectedType],
      elements: {
        hook: selectRandomHook(niche),
        keywords: selectNicheKeywords(nicheData.keywords, 3),
        emojis: selectNicheEmojis(nicheData.emojis, 2),
        hashtags: selectNicheHashtags(nicheData.hashtags, 5),
        cta: selectCallToAction(),
        tone: nicheData.tone
      },
      content: '',
      metadata: {
        avgLength: nicheData.avgLength,
        optimalTiming: nicheData.timing,
        platforms: determineBestPlatforms(niche),
        demographics: determineBestDemographics(niche)
      }
    };

    // Generar contenido del template
    template.content = assembleTemplateContent(template);

    // Aplicar personalizaciones
    template.personalizedVersions = generatePersonalizedVersions(template);

    return template;
  };

  // Seleccionar hook aleatorio por nicho
  const selectRandomHook = (niche) => {
    const hooks = nicheTemplatesEngine.templateCategories.hooks[niche] || [];
    return hooks[Math.floor(Math.random() * hooks.length)];
  };

  // Seleccionar keywords del nicho
  const selectNicheKeywords = (keywords, count) => {
    const shuffled = [...keywords].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  // Seleccionar emojis del nicho
  const selectNicheEmojis = (emojis, count) => {
    const shuffled = [...emojis].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  // Seleccionar hashtags del nicho
  const selectNicheHashtags = (hashtags, count) => {
    const shuffled = [...hashtags].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  // Seleccionar call to action
  const selectCallToAction = () => {
    const allCTAs = [
      ...nicheTemplatesEngine.templateCategories.callToActions.engagement,
      ...nicheTemplatesEngine.templateCategories.callToActions.action
    ];
    return allCTAs[Math.floor(Math.random() * allCTAs.length)];
  };

  // Ensamblar contenido del template
  const assembleTemplateContent = (template) => {
    const { hook, keywords, emojis, cta } = template.elements;
    const structure = template.structure;

    let content = '';

    // Agregar hook
    if (hook) {
      content += `${hook}\n\n`;
    }

    // Agregar estructura según tipo
    switch (template.type) {
      case 'tutorial':
        content += `${structure.intro.replace('{action}', keywords[0]).replace('{timeframe}', '5 minutos')}\n\n`;
        structure.steps.forEach((step, index) => {
          content += `${step.replace(`{step${index + 1}}`, `${keywords[index] || 'acción'} ${emojis[0] || ''}`)}\n`;
        });
        content += `\n${structure.conclusion.replace('{action}', keywords[0])}`;
        break;

      case 'transformation':
        content += `${structure.intro.replace('{timeframe}', '30 días').replace('{before}', 'principiante').replace('{after}', 'experto')}\n\n`;
        content += `${structure.process.replace('{method}', keywords.join(', '))}\n\n`;
        content += `${structure.results.replace('{outcome}', `resultados increíbles ${emojis[0] || ''}`)}\n\n`;
        content += structure.conclusion;
        break;

      case 'tips':
        content += `${structure.intro.replace('{number}', '3').replace('{topic}', keywords[0]).replace('{area}', template.niche)}\n\n`;
        structure.tips.forEach((tip, index) => {
          content += `${tip.replace(`{tip${index + 1}}`, `${keywords[index] || 'consejo'} ${emojis[0] || ''}`)}\n`;
        });
        content += `\n${structure.conclusion}`;
        break;

      case 'story':
        content += `${structure.intro.replace('{achievement}', `dominar ${keywords[0]}`)}\n\n`;
        content += `${structure.conflict.replace('{problem}', `no sabía sobre ${keywords[1] || 'esto'}`)}\n\n`;
        content += `${structure.solution.replace('{solution}', keywords[2] || 'práctica constante')}\n\n`;
        content += `${structure.conclusion.replace('{lesson}', `${keywords[0]} es clave`)}`;
        break;
    }

    // Agregar CTA y emojis
    content += `\n\n${cta} ${emojis.join(' ')}`;

    return content;
  };

  // Generar versiones personalizadas
  const generatePersonalizedVersions = (template) => {
    const versions = {};

    // Versión por demografía
    ['gen_z', 'millennials', 'gen_x'].forEach(demo => {
      versions[demo] = adaptTemplateForDemographic(template, demo);
    });

    // Versión por región
    ['ecuador', 'colombia', 'mexico'].forEach(region => {
      versions[region] = adaptTemplateForRegion(template, region);
    });

    // Versión por plataforma
    ['tiktok', 'instagram', 'youtube'].forEach(platform => {
      versions[platform] = adaptTemplateForPlatform(template, platform);
    });

    return versions;
  };

  // Adaptar template por demografía
  const adaptTemplateForDemographic = (template, demographic) => {
    const demographicAdaptations = {
      gen_z: {
        tone: 'casual',
        slang: ['no cap', 'periodt', 'slay', 'vibe check'],
        emojis: ['💀', '😭', '✨', '🔥'],
        length: 'short'
      },
      millennials: {
        tone: 'relatable',
        slang: ['honestly', 'literally', 'adulting', 'mood'],
        emojis: ['😅', '💯', '🙌', '✨'],
        length: 'medium'
      },
      gen_x: {
        tone: 'informative',
        slang: ['back in my day', 'kids these days', 'classic'],
        emojis: ['👍', '😊', '💪', '🎯'],
        length: 'long'
      }
    };

    const adaptation = demographicAdaptations[demographic];
    if (!adaptation) return template.content;

    let adaptedContent = template.content;

    // Ajustar tono y agregar slang ocasionalmente
    if (Math.random() > 0.7) {
      const randomSlang = adaptation.slang[Math.floor(Math.random() * adaptation.slang.length)];
      adaptedContent = adaptedContent.replace(/\.$/, `, ${randomSlang}.`);
    }

    return {
      ...template.content,
      demographic: demographic,
      adaptedContent: adaptedContent,
      suggestedEmojis: adaptation.emojis
    };
  };

  // Adaptar template por región
  const adaptTemplateForRegion = (template, region) => {
    const regionalAdaptations = {
      ecuador: {
        expressions: ['¡Qué chimba!', 'Está brutal', 'Bacán'],
        currency: 'USD',
        culturalRefs: ['Quito', 'Guayaquil', 'la Sierra', 'la Costa']
      },
      colombia: {
        expressions: ['¡Qué berraco!', 'Está muy bueno', 'Parcero'],
        currency: 'COP',
        culturalRefs: ['Bogotá', 'Medellín', 'paisa', 'costeño']
      },
      mexico: {
        expressions: ['¡Está padrísimo!', 'Qué chido', 'Órale'],
        currency: 'MXN',
        culturalRefs: ['CDMX', 'Guadalajara', 'chilango', 'norteño']
      }
    };

    const adaptation = regionalAdaptations[region];
    if (!adaptation) return template.content;

    let adaptedContent = template.content;

    // Agregar expresión regional ocasionalmente
    if (Math.random() > 0.6) {
      const randomExpression = adaptation.expressions[Math.floor(Math.random() * adaptation.expressions.length)];
      adaptedContent += ` ${randomExpression}`;
    }

    return {
      ...template.content,
      region: region,
      adaptedContent: adaptedContent,
      culturalContext: adaptation.culturalRefs
    };
  };

  // Adaptar template por plataforma
  const adaptTemplateForPlatform = (template, platform) => {
    const platformAdaptations = {
      tiktok: {
        maxLength: 150,
        style: 'vertical_video',
        hashtags: ['#fyp', '#parati', '#viral'],
        features: ['trending_sounds', 'effects', 'transitions']
      },
      instagram: {
        maxLength: 300,
        style: 'square_visual',
        hashtags: ['#instagood', '#photooftheday', '#explore'],
        features: ['stories', 'reels', 'carousel']
      },
      youtube: {
        maxLength: 500,
        style: 'horizontal_video',
        hashtags: ['#youtube', '#subscribe', '#tutorial'],
        features: ['thumbnails', 'chapters', 'end_screens']
      }
    };

    const adaptation = platformAdaptations[platform];
    if (!adaptation) return template.content;

    let adaptedContent = template.content;

    // Truncar si es necesario
    if (adaptedContent.length > adaptation.maxLength) {
      adaptedContent = adaptedContent.substring(0, adaptation.maxLength - 3) + '...';
    }

    // Agregar hashtags específicos de plataforma
    const platformHashtags = adaptation.hashtags.join(' ');
    adaptedContent += `\n\n${platformHashtags}`;

    return {
      ...template.content,
      platform: platform,
      adaptedContent: adaptedContent,
      platformFeatures: adaptation.features,
      style: adaptation.style
    };
  };

  // Determinar mejores plataformas por nicho
  const determineBestPlatforms = (niche) => {
    const platformMatrix = {
      fitness: ['tiktok', 'instagram', 'youtube'],
      food: ['instagram', 'tiktok', 'youtube'],
      fashion: ['instagram', 'tiktok', 'pinterest'],
      tech: ['youtube', 'linkedin', 'twitter']
    };

    return platformMatrix[niche] || ['tiktok', 'instagram'];
  };

  // Determinar mejores demografías por nicho
  const determineBestDemographics = (niche) => {
    const demographicMatrix = {
      fitness: ['gen_z', 'millennials'],
      food: ['millennials', 'gen_x'],
      fashion: ['gen_z', 'millennials'],
      tech: ['millennials', 'gen_x']
    };

    return demographicMatrix[niche] || ['millennials'];
  };

  // Generar templates por lotes para múltiples nichos
  const generateBatchTemplates = (niches = ['fitness', 'food', 'fashion', 'tech'], templatesPerNiche = 5) => {
    const batchResults = {};

    niches.forEach(niche => {
      const templates = generateNicheTemplates(niche, 'mixed', templatesPerNiche);
      batchResults[niche] = {
        count: templates.length,
        templates: templates,
        avgLength: templates.reduce((sum, t) => sum + t.content.length, 0) / templates.length
      };
    });

    return batchResults;
  };

  // Buscar templates por criterios
  const searchTemplates = (criteria) => {
    const { niche, type, keywords, minLength, maxLength } = criteria;

    return generatedTemplates.filter(template => {
      if (niche && template.niche !== niche) return false;
      if (type && template.type !== type) return false;
      if (minLength && template.content.length < minLength) return false;
      if (maxLength && template.content.length > maxLength) return false;
      if (keywords && !keywords.some(keyword =>
        template.content.toLowerCase().includes(keyword.toLowerCase())
      )) return false;

      return true;
    });
  };

  // Inicializar biblioteca de templates
  const initializeTemplateLibrary = () => {
    console.log('Inicializando biblioteca de templates...');
    const initialBatch = generateBatchTemplates(['fitness', 'food', 'fashion', 'tech'], 3);
    console.log('Templates iniciales generados:', initialBatch);
    return initialBatch;
  };

  // PUNTO 21: Generación de thumbnails con IA
  const [thumbnailGeneratorEngine, setThumbnailGeneratorEngine] = useState({
    enabled: true,
    aiProviders: {
      dalle: { enabled: true, priority: 1, cost: 0.02 },
      midjourney: { enabled: true, priority: 2, cost: 0.03 },
      stable_diffusion: { enabled: true, priority: 3, cost: 0.01 },
      canva_ai: { enabled: true, priority: 4, cost: 0.005 }
    },
    thumbnailStyles: {
      fitness: {
        colorScheme: ['#FF6B35', '#F7931E', '#FFD23F', '#06FFA5'],
        fonts: ['Montserrat Bold', 'Oswald', 'Bebas Neue'],
        elements: ['person_exercising', 'gym_equipment', 'transformation_split', 'progress_chart'],
        composition: 'dynamic_action',
        textOverlay: 'motivational_large'
      },
      food: {
        colorScheme: ['#FF8C42', '#6699CC', '#FFD23F', '#2ECC71'],
        fonts: ['Playfair Display', 'Lobster', 'Dancing Script'],
        elements: ['food_close_up', 'ingredients_spread', 'cooking_process', 'final_dish'],
        composition: 'appetizing_close_up',
        textOverlay: 'recipe_highlight'
      },
      fashion: {
        colorScheme: ['#E91E63', '#9C27B0', '#673AB7', '#FF5722'],
        fonts: ['Didot', 'Futura', 'Helvetica Neue Light'],
        elements: ['outfit_flat_lay', 'model_pose', 'accessory_focus', 'style_comparison'],
        composition: 'elegant_minimal',
        textOverlay: 'stylish_overlay'
      },
      tech: {
        colorScheme: ['#2196F3', '#00BCD4', '#4CAF50', '#FF9800'],
        fonts: ['Roboto', 'Source Sans Pro', 'Open Sans'],
        elements: ['device_mockup', 'interface_screenshot', 'tech_setup', 'comparison_grid'],
        composition: 'clean_modern',
        textOverlay: 'tech_focused'
      }
    },
    thumbnailFormats: {
      youtube: { width: 1280, height: 720, ratio: '16:9' },
      instagram: { width: 1080, height: 1080, ratio: '1:1' },
      tiktok: { width: 1080, height: 1920, ratio: '9:16' },
      facebook: { width: 1200, height: 630, ratio: '1.91:1' }
    },
    designElements: {
      textStyles: {
        title: { size: 'large', weight: 'bold', position: 'center_top' },
        subtitle: { size: 'medium', weight: 'normal', position: 'center_bottom' },
        highlight: { size: 'extra_large', weight: 'black', position: 'center' },
        corner_text: { size: 'small', weight: 'medium', position: 'corner' }
      },
      visualEffects: {
        glow: { intensity: 'medium', color: 'accent' },
        shadow: { type: 'drop_shadow', opacity: 0.3 },
        gradient: { type: 'linear', direction: 'diagonal' },
        blur: { type: 'background_blur', intensity: 'light' }
      },
      overlayElements: {
        arrows: ['pointing_right', 'curved_arrow', 'double_arrow'],
        shapes: ['circle_highlight', 'rectangle_frame', 'star_burst'],
        icons: ['play_button', 'fire_emoji', 'trending_up', 'heart_eyes']
      }
    }
  });

  // Estado para thumbnails generados
  const [generatedThumbnails, setGeneratedThumbnails] = useState([]);
  const [thumbnailQueue, setThumbnailQueue] = useState([]);

  // Función principal para generar thumbnails
  const generateThumbnailForContent = async (content, platform = 'youtube', style = 'auto') => {
    const thumbnailSpec = createThumbnailSpecification(content, platform, style);
    const generatedThumbnail = await processThumbnailGeneration(thumbnailSpec);

    // Agregar a la cola de thumbnails generados
    setGeneratedThumbnails(prev => [...prev, generatedThumbnail]);

    return generatedThumbnail;
  };

  // Crear especificación del thumbnail
  const createThumbnailSpecification = (content, platform, style) => {
    const niche = content.niche || 'general';
    const nicheStyle = thumbnailGeneratorEngine.thumbnailStyles[niche] || thumbnailGeneratorEngine.thumbnailStyles.tech;
    const format = thumbnailGeneratorEngine.thumbnailFormats[platform];

    const spec = {
      id: `thumb_${content.id}_${Date.now()}`,
      contentId: content.id,
      platform: platform,
      niche: niche,
      format: format,
      style: style === 'auto' ? nicheStyle : style,
      content: {
        title: content.title,
        description: content.content,
        keywords: extractKeywords(content.content),
        mood: determineMood(content.content, niche)
      },
      designRequirements: generateDesignRequirements(content, nicheStyle, platform),
      aiPrompt: '',
      createdAt: new Date()
    };

    // Generar prompt para IA
    spec.aiPrompt = generateAIPrompt(spec);

    return spec;
  };

  // Extraer keywords del contenido
  const extractKeywords = (text) => {
    const commonWords = ['el', 'la', 'de', 'que', 'y', 'en', 'un', 'es', 'se', 'no', 'te', 'lo', 'le', 'da', 'su', 'por', 'son', 'con', 'para', 'mi', 'está', 'si', 'bien', 'pero', 'yo', 'eso', 'las', 'sí', 'su', 'tu', 'aquí'];
    const words = text.toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 3 && !commonWords.includes(word));

    // Contar frecuencia y retornar las más relevantes
    const wordCount = {};
    words.forEach(word => {
      wordCount[word] = (wordCount[word] || 0) + 1;
    });

    return Object.entries(wordCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([word]) => word);
  };

  // Determinar mood del contenido
  const determineMood = (text, niche) => {
    const moodKeywords = {
      energetic: ['energía', 'activo', 'dinámico', 'potente', 'explosivo', 'intenso'],
      calm: ['relajado', 'tranquilo', 'sereno', 'pacífico', 'suave', 'zen'],
      exciting: ['emocionante', 'increíble', 'sorprendente', 'genial', 'brutal', 'épico'],
      professional: ['profesional', 'técnico', 'experto', 'avanzado', 'preciso', 'detallado'],
      fun: ['divertido', 'gracioso', 'entretenido', 'alegre', 'cool', 'genial']
    };

    const textLower = text.toLowerCase();
    let maxScore = 0;
    let detectedMood = 'neutral';

    Object.entries(moodKeywords).forEach(([mood, keywords]) => {
      const score = keywords.filter(keyword => textLower.includes(keyword)).length;
      if (score > maxScore) {
        maxScore = score;
        detectedMood = mood;
      }
    });

    // Mood por defecto según nicho si no se detecta ninguno
    const nicheMoods = {
      fitness: 'energetic',
      food: 'exciting',
      fashion: 'fun',
      tech: 'professional'
    };

    return maxScore > 0 ? detectedMood : (nicheMoods[niche] || 'neutral');
  };

  // Generar requerimientos de diseño
  const generateDesignRequirements = (content, nicheStyle, platform) => {
    return {
      colorPalette: selectColorPalette(nicheStyle.colorScheme, content),
      typography: selectTypography(nicheStyle.fonts, content),
      layout: selectLayout(nicheStyle.composition, platform),
      visualElements: selectVisualElements(nicheStyle.elements, content),
      textOverlay: generateTextOverlay(content, nicheStyle.textOverlay),
      effects: selectVisualEffects(content)
    };
  };

  // Seleccionar paleta de colores
  const selectColorPalette = (colorScheme, content) => {
    const mood = determineMood(content.content, content.niche);
    const moodColorAdjustments = {
      energetic: { saturation: 'high', brightness: 'high' },
      calm: { saturation: 'low', brightness: 'medium' },
      exciting: { saturation: 'high', brightness: 'high' },
      professional: { saturation: 'medium', brightness: 'medium' },
      fun: { saturation: 'high', brightness: 'high' }
    };

    return {
      primary: colorScheme[0],
      secondary: colorScheme[1],
      accent: colorScheme[2],
      background: colorScheme[3],
      adjustment: moodColorAdjustments[mood] || moodColorAdjustments.professional
    };
  };

  // Seleccionar tipografía
  const selectTypography = (fonts, content) => {
    const titleLength = content.title.length;
    const fontIndex = titleLength > 30 ? 0 : titleLength > 15 ? 1 : 2;

    return {
      primary: fonts[fontIndex] || fonts[0],
      secondary: fonts[(fontIndex + 1) % fonts.length],
      size: titleLength > 40 ? 'large' : titleLength > 20 ? 'medium' : 'small'
    };
  };

  // Seleccionar layout
  const selectLayout = (composition, platform) => {
    const platformLayouts = {
      youtube: ['split_screen', 'center_focus', 'rule_of_thirds'],
      instagram: ['center_square', 'grid_layout', 'minimal_focus'],
      tiktok: ['vertical_stack', 'top_bottom_split', 'diagonal_layout'],
      facebook: ['horizontal_banner', 'left_right_split', 'overlay_text']
    };

    const availableLayouts = platformLayouts[platform] || platformLayouts.youtube;
    return availableLayouts[Math.floor(Math.random() * availableLayouts.length)];
  };

  // Seleccionar elementos visuales
  const selectVisualElements = (elements, content) => {
    const keywords = extractKeywords(content.content);
    const relevantElements = elements.filter(element =>
      keywords.some(keyword => element.includes(keyword.substring(0, 4)))
    );

    return relevantElements.length > 0 ? relevantElements : [elements[0]];
  };

  // Generar overlay de texto
  const generateTextOverlay = (content, overlayStyle) => {
    const title = content.title;
    const maxLength = 50;

    let processedTitle = title.length > maxLength ?
      title.substring(0, maxLength - 3) + '...' : title;

    // Agregar elementos según el estilo
    const styleEnhancements = {
      motivational_large: { prefix: '💪', suffix: '🔥', transform: 'uppercase' },
      recipe_highlight: { prefix: '👨‍🍳', suffix: '✨', transform: 'title_case' },
      stylish_overlay: { prefix: '✨', suffix: '💎', transform: 'elegant' },
      tech_focused: { prefix: '⚡', suffix: '🚀', transform: 'clean' }
    };

    const enhancement = styleEnhancements[overlayStyle] || styleEnhancements.tech_focused;

    return {
      text: `${enhancement.prefix} ${processedTitle} ${enhancement.suffix}`,
      style: enhancement.transform,
      position: 'center',
      background: 'semi_transparent'
    };
  };

  // Seleccionar efectos visuales
  const selectVisualEffects = (content) => {
    const mood = determineMood(content.content, content.niche);
    const moodEffects = {
      energetic: ['glow', 'motion_blur', 'dynamic_lines'],
      calm: ['soft_shadow', 'gentle_blur', 'subtle_gradient'],
      exciting: ['burst_effect', 'bright_glow', 'color_pop'],
      professional: ['clean_shadow', 'minimal_gradient', 'sharp_edges'],
      fun: ['colorful_glow', 'playful_shapes', 'vibrant_gradient']
    };

    return moodEffects[mood] || moodEffects.professional;
  };

  // Generar prompt para IA
  const generateAIPrompt = (spec) => {
    const { content, style, format, designRequirements } = spec;

    let prompt = `Create a ${format.ratio} thumbnail for ${spec.platform} about "${content.title}". `;
    prompt += `Style: ${style.composition}, mood: ${content.mood}. `;
    prompt += `Colors: ${designRequirements.colorPalette.primary}, ${designRequirements.colorPalette.secondary}. `;
    prompt += `Include: ${designRequirements.visualElements.join(', ')}. `;
    prompt += `Text overlay: "${designRequirements.textOverlay.text}". `;
    prompt += `Effects: ${designRequirements.effects.join(', ')}. `;
    prompt += `High quality, professional, eye-catching, ${spec.niche} niche.`;

    return prompt;
  };

  // Procesar generación del thumbnail
  const processThumbnailGeneration = async (spec) => {
    // Simular proceso de generación con IA
    const generationResult = await simulateAIGeneration(spec);

    const thumbnail = {
      ...spec,
      generationResult: generationResult,
      status: generationResult.success ? 'completed' : 'failed',
      url: generationResult.url,
      alternatives: generationResult.alternatives || [],
      metadata: {
        generationTime: generationResult.processingTime,
        cost: generationResult.cost,
        provider: generationResult.provider,
        quality: generationResult.quality
      },
      analytics: {
        predictedCTR: calculatePredictedCTR(spec),
        appealScore: calculateAppealScore(spec),
        brandConsistency: calculateBrandConsistency(spec)
      }
    };

    return thumbnail;
  };

  // Simular generación con IA
  const simulateAIGeneration = async (spec) => {
    // Simular tiempo de procesamiento
    const processingTime = Math.random() * 30 + 10; // 10-40 segundos

    // Seleccionar proveedor basado en prioridad y disponibilidad
    const availableProviders = Object.entries(thumbnailGeneratorEngine.aiProviders)
      .filter(([, config]) => config.enabled)
      .sort(([, a], [, b]) => a.priority - b.priority);

    const selectedProvider = availableProviders[0];

    return new Promise(resolve => {
      setTimeout(() => {
        const success = Math.random() > 0.1; // 90% success rate

        resolve({
          success: success,
          url: success ? `https://ai-thumbnails.com/${spec.id}.jpg` : null,
          alternatives: success ? [
            `https://ai-thumbnails.com/${spec.id}_alt1.jpg`,
            `https://ai-thumbnails.com/${spec.id}_alt2.jpg`
          ] : [],
          processingTime: processingTime,
          cost: selectedProvider[1].cost,
          provider: selectedProvider[0],
          quality: success ? Math.random() * 30 + 70 : 0, // 70-100 quality
          error: success ? null : 'Generation failed due to content policy'
        });
      }, 1000); // Simular 1 segundo de procesamiento
    });
  };

  // Calcular CTR predicho
  const calculatePredictedCTR = (spec) => {
    let ctr = 5; // Base CTR 5%

    // Factores que afectan CTR
    const titleLength = spec.content.title.length;
    if (titleLength >= 20 && titleLength <= 40) ctr += 1.5;

    // Mood impact
    const moodImpact = {
      energetic: 1.8,
      exciting: 2.2,
      fun: 1.5,
      professional: 1.0,
      calm: 0.8
    };
    ctr *= moodImpact[spec.content.mood] || 1.0;

    // Platform factor
    const platformFactor = {
      youtube: 1.2,
      instagram: 1.0,
      tiktok: 1.4,
      facebook: 0.9
    };
    ctr *= platformFactor[spec.platform] || 1.0;

    return Math.min(ctr, 15); // Max 15% CTR
  };

  // Calcular score de atractivo
  const calculateAppealScore = (spec) => {
    let score = 70; // Base score

    // Color harmony
    score += Math.random() * 10;

    // Text readability
    const titleLength = spec.content.title.length;
    if (titleLength <= 30) score += 10;
    else if (titleLength <= 50) score += 5;

    // Visual elements relevance
    score += spec.designRequirements.visualElements.length * 3;

    return Math.min(score, 100);
  };

  // Calcular consistencia de marca
  const calculateBrandConsistency = (spec) => {
    // Simular análisis de consistencia de marca
    const nicheConsistency = {
      fitness: 85,
      food: 80,
      fashion: 90,
      tech: 88
    };

    return nicheConsistency[spec.niche] || 75;
  };

  // Generar múltiples thumbnails para A/B testing
  const generateThumbnailVariations = async (content, platform = 'youtube', count = 3) => {
    const variations = [];

    for (let i = 0; i < count; i++) {
      const variation = await generateThumbnailForContent(content, platform, 'auto');
      variation.variationIndex = i + 1;
      variation.testGroup = `variation_${i + 1}`;
      variations.push(variation);
    }

    return variations;
  };

  // Optimizar thumbnail basado en performance
  const optimizeThumbnailBasedOnPerformance = (originalThumbnail, performanceData) => {
    const optimizations = [];

    if (performanceData.ctr < 3) {
      optimizations.push({
        type: 'color_adjustment',
        suggestion: 'Usar colores más vibrantes y contrastantes',
        impact: 'high'
      });
    }

    if (performanceData.engagement < 5) {
      optimizations.push({
        type: 'text_optimization',
        suggestion: 'Simplificar el texto y usar palabras más impactantes',
        impact: 'medium'
      });
    }

    return {
      originalThumbnail,
      optimizations,
      recommendedChanges: generateOptimizationPrompt(optimizations)
    };
  };

  // Generar prompt de optimización
  const generateOptimizationPrompt = (optimizations) => {
    return optimizations.map(opt => opt.suggestion).join('. ');
  };

  // Inicializar generador de thumbnails
  const initializeThumbnailGenerator = () => {
    console.log('Inicializando generador de thumbnails con IA...');

    // Verificar disponibilidad de proveedores
    const availableProviders = Object.entries(thumbnailGeneratorEngine.aiProviders)
      .filter(([, config]) => config.enabled);

    console.log(`Proveedores disponibles: ${availableProviders.map(([name]) => name).join(', ')}`);

    return {
      ready: availableProviders.length > 0,
      providers: availableProviders.length,
      estimatedCost: availableProviders.reduce((sum, [, config]) => sum + config.cost, 0) / availableProviders.length
    };
  };

  // PUNTO 22: Carousels automáticos para Instagram
  const [carouselGeneratorEngine, setCarouselGeneratorEngine] = useState({
    enabled: true,
    carouselTypes: {
      tutorial: {
        minSlides: 5,
        maxSlides: 10,
        structure: ['intro', 'steps', 'tips', 'results', 'cta'],
        visualStyle: 'step_by_step',
        textDensity: 'medium'
      },
      tips: {
        minSlides: 3,
        maxSlides: 8,
        structure: ['intro', 'tips_list', 'bonus', 'cta'],
        visualStyle: 'numbered_list',
        textDensity: 'high'
      },
      transformation: {
        minSlides: 4,
        maxSlides: 7,
        structure: ['before', 'process', 'progress', 'after', 'cta'],
        visualStyle: 'before_after',
        textDensity: 'low'
      },
      story: {
        minSlides: 6,
        maxSlides: 12,
        structure: ['hook', 'context', 'conflict', 'journey', 'resolution', 'lesson'],
        visualStyle: 'narrative',
        textDensity: 'medium'
      },
      comparison: {
        minSlides: 4,
        maxSlides: 6,
        structure: ['intro', 'option_a', 'option_b', 'comparison', 'recommendation'],
        visualStyle: 'side_by_side',
        textDensity: 'medium'
      }
    },
    slideTemplates: {
      intro: {
        layout: 'center_text',
        elements: ['title', 'subtitle', 'hook_emoji'],
        backgroundColor: 'gradient',
        textSize: 'large'
      },
      content: {
        layout: 'text_with_visual',
        elements: ['main_text', 'supporting_visual', 'number_badge'],
        backgroundColor: 'solid',
        textSize: 'medium'
      },
      cta: {
        layout: 'call_to_action',
        elements: ['cta_text', 'action_button', 'follow_reminder'],
        backgroundColor: 'accent',
        textSize: 'large'
      },
      transition: {
        layout: 'minimal_text',
        elements: ['transition_text', 'arrow_or_icon'],
        backgroundColor: 'neutral',
        textSize: 'small'
      }
    },
    designSystem: {
      colorPalettes: {
        fitness: {
          primary: '#FF6B35',
          secondary: '#F7931E',
          accent: '#06FFA5',
          background: '#1A1A1A',
          text: '#FFFFFF'
        },
        food: {
          primary: '#FF8C42',
          secondary: '#FFD23F',
          accent: '#2ECC71',
          background: '#FFF8E1',
          text: '#2C3E50'
        },
        fashion: {
          primary: '#E91E63',
          secondary: '#9C27B0',
          accent: '#FF5722',
          background: '#F8F9FA',
          text: '#212529'
        },
        tech: {
          primary: '#2196F3',
          secondary: '#00BCD4',
          accent: '#4CAF50',
          background: '#263238',
          text: '#ECEFF1'
        }
      },
      typography: {
        title: { font: 'Montserrat Bold', size: 32, weight: 'bold' },
        subtitle: { font: 'Montserrat Medium', size: 24, weight: 'medium' },
        body: { font: 'Open Sans', size: 18, weight: 'normal' },
        caption: { font: 'Open Sans', size: 14, weight: 'light' }
      },
      spacing: {
        small: 8,
        medium: 16,
        large: 24,
        xlarge: 32
      }
    },
    contentOptimization: {
      maxCharactersPerSlide: 150,
      optimalCharactersPerSlide: 80,
      keywordDensity: 0.15,
      emojiFrequency: 0.2,
      hashtagsPerCarousel: 8
    }
  });

  // Estado para carousels generados
  const [generatedCarousels, setGeneratedCarousels] = useState([]);
  const [carouselQueue, setCarouselQueue] = useState([]);

  // Función principal para generar carousel
  const generateInstagramCarousel = (content, carouselType = 'auto') => {
    // Determinar tipo de carousel automáticamente si es necesario
    const detectedType = carouselType === 'auto' ? detectCarouselType(content) : carouselType;

    // Crear especificación del carousel
    const carouselSpec = createCarouselSpecification(content, detectedType);

    // Generar slides del carousel
    const slides = generateCarouselSlides(carouselSpec);

    // Optimizar contenido para Instagram
    const optimizedCarousel = optimizeCarouselForInstagram(slides, carouselSpec);

    // Agregar a la lista de carousels generados
    const finalCarousel = {
      id: `carousel_${content.id}_${Date.now()}`,
      originalContentId: content.id,
      type: detectedType,
      slides: optimizedCarousel.slides,
      metadata: {
        ...carouselSpec,
        slideCount: optimizedCarousel.slides.length,
        estimatedEngagement: calculateCarouselEngagement(optimizedCarousel),
        createdAt: new Date()
      },
      instagramOptimizations: optimizedCarousel.optimizations
    };

    setGeneratedCarousels(prev => [...prev, finalCarousel]);

    return finalCarousel;
  };

  // Detectar tipo de carousel automáticamente
  const detectCarouselType = (content) => {
    const text = content.content.toLowerCase();
    const title = content.title.toLowerCase();
    const fullText = `${title} ${text}`;

    // Patrones para detectar tipos
    const typePatterns = {
      tutorial: ['paso', 'cómo', 'tutorial', 'guía', 'aprende', 'enseño'],
      tips: ['tips', 'consejos', 'trucos', 'secretos', 'hacks'],
      transformation: ['antes', 'después', 'transformación', 'cambio', 'resultado'],
      story: ['historia', 'experiencia', 'pasó', 'cuento', 'vivencia'],
      comparison: ['vs', 'versus', 'comparación', 'diferencia', 'mejor']
    };

    let maxScore = 0;
    let detectedType = 'tips'; // Default

    Object.entries(typePatterns).forEach(([type, patterns]) => {
      const score = patterns.filter(pattern => fullText.includes(pattern)).length;
      if (score > maxScore) {
        maxScore = score;
        detectedType = type;
      }
    });

    return detectedType;
  };

  // Crear especificación del carousel
  const createCarouselSpecification = (content, type) => {
    const typeConfig = carouselGeneratorEngine.carouselTypes[type];
    const niche = content.niche || 'general';
    const colorPalette = carouselGeneratorEngine.designSystem.colorPalettes[niche] ||
      carouselGeneratorEngine.designSystem.colorPalettes.tech;

    return {
      originalContent: content,
      type: type,
      niche: niche,
      structure: typeConfig.structure,
      slideCount: Math.floor(Math.random() * (typeConfig.maxSlides - typeConfig.minSlides + 1)) + typeConfig.minSlides,
      visualStyle: typeConfig.visualStyle,
      textDensity: typeConfig.textDensity,
      colorPalette: colorPalette,
      typography: carouselGeneratorEngine.designSystem.typography,
      contentBreakdown: breakdownContentForSlides(content, typeConfig.structure)
    };
  };

  // Desglosar contenido para slides
  const breakdownContentForSlides = (content, structure) => {
    const breakdown = {};
    const contentText = content.content;
    const sentences = contentText.split(/[.!?]+/).filter(s => s.trim().length > 0);

    structure.forEach((slideType, index) => {
      switch (slideType) {
        case 'intro':
          breakdown[slideType] = {
            title: content.title,
            subtitle: sentences[0] || 'Descubre más...',
            hook: generateHookForSlide(content)
          };
          break;

        case 'steps':
        case 'tips_list':
          breakdown[slideType] = generateStepsOrTips(contentText, slideType);
          break;

        case 'before':
        case 'after':
          breakdown[slideType] = generateBeforeAfter(contentText, slideType);
          break;

        case 'cta':
          breakdown[slideType] = generateCTASlide(content);
          break;

        default:
          breakdown[slideType] = {
            content: sentences[index] || generateDefaultContent(slideType),
            supportingText: generateSupportingText(slideType)
          };
      }
    });

    return breakdown;
  };

  // Generar hook para slide
  const generateHookForSlide = (content) => {
    const hooks = [
      '¿Sabías que...?',
      'Esto cambió mi vida:',
      'El secreto que nadie cuenta:',
      'Lo que descubrí:',
      'La verdad sobre:'
    ];
    return hooks[Math.floor(Math.random() * hooks.length)];
  };

  // Generar pasos o tips
  const generateStepsOrTips = (contentText, type) => {
    const items = [];
    const keywords = extractKeywords(contentText);

    const itemCount = type === 'steps' ? 4 : 5;

    for (let i = 1; i <= itemCount; i++) {
      const keyword = keywords[i - 1] || `punto ${i}`;
      items.push({
        number: i,
        title: type === 'steps' ? `Paso ${i}` : `Tip ${i}`,
        content: `${keyword.charAt(0).toUpperCase() + keyword.slice(1)} es clave para obtener resultados`,
        icon: type === 'steps' ? '📝' : '💡'
      });
    }

    return { items };
  };

  // Generar contenido antes/después
  const generateBeforeAfter = (contentText, type) => {
    const beforeAfterContent = {
      before: {
        title: 'ANTES',
        content: 'Sin conocer estos secretos...',
        emotion: '😔',
        description: 'Los resultados no llegaban'
      },
      after: {
        title: 'DESPUÉS',
        content: 'Aplicando estos consejos...',
        emotion: '🎉',
        description: '¡Resultados increíbles!'
      }
    };

    return beforeAfterContent[type];
  };

  // Generar slide de CTA
  const generateCTASlide = (content) => {
    const ctas = [
      {
        main: '¿Te gustó este contenido?',
        action: 'Sígueme para más tips',
        button: 'SEGUIR',
        emoji: '👆'
      },
      {
        main: '¿Cuál tip vas a probar?',
        action: 'Cuéntame en comentarios',
        button: 'COMENTAR',
        emoji: '💬'
      },
      {
        main: '¡Comparte si te sirvió!',
        action: 'Ayuda a otros también',
        button: 'COMPARTIR',
        emoji: '🔄'
      }
    ];

    return ctas[Math.floor(Math.random() * ctas.length)];
  };

  // Generar contenido por defecto
  const generateDefaultContent = (slideType) => {
    const defaultContent = {
      context: 'Aquí está el contexto importante que necesitas saber',
      conflict: 'El problema principal que enfrentamos es...',
      journey: 'El proceso de cambio incluye estos elementos',
      resolution: 'La solución final que funcionó fue...',
      lesson: 'Lo más importante que aprendí fue...',
      process: 'El método que utilicé paso a paso',
      progress: 'Los avances que fui notando fueron',
      comparison: 'Al comparar las opciones disponibles',
      recommendation: 'Mi recomendación final es'
    };

    return defaultContent[slideType] || 'Contenido relevante para tu crecimiento';
  };

  // Generar texto de apoyo
  const generateSupportingText = (slideType) => {
    const supportingTexts = {
      context: 'Esto es fundamental para entender',
      conflict: 'Muchos enfrentan este mismo desafío',
      journey: 'El camino no siempre es fácil',
      resolution: 'Pero vale la pena el esfuerzo',
      lesson: 'Esto puede cambiar tu perspectiva'
    };

    return supportingTexts[slideType] || 'Información adicional relevante';
  };

  // Generar slides del carousel
  const generateCarouselSlides = (spec) => {
    const slides = [];

    spec.structure.forEach((slideType, index) => {
      const slideContent = spec.contentBreakdown[slideType];
      const slideTemplate = determineSlideTemplate(slideType);

      const slide = {
        id: `slide_${index + 1}`,
        index: index + 1,
        type: slideType,
        template: slideTemplate,
        content: slideContent,
        design: generateSlideDesign(slideTemplate, spec.colorPalette, spec.typography),
        layout: generateSlideLayout(slideType, spec.visualStyle),
        animations: generateSlideAnimations(slideType, index)
      };

      slides.push(slide);
    });

    return slides;
  };

  // Determinar template del slide
  const determineSlideTemplate = (slideType) => {
    const templateMapping = {
      intro: 'intro',
      cta: 'cta',
      steps: 'content',
      tips_list: 'content',
      before: 'content',
      after: 'content',
      context: 'content',
      conflict: 'content',
      journey: 'content',
      resolution: 'content',
      lesson: 'content'
    };

    return templateMapping[slideType] || 'content';
  };

  // Generar diseño del slide
  const generateSlideDesign = (template, colorPalette, typography) => {
    const templateConfig = carouselGeneratorEngine.slideTemplates[template];

    return {
      backgroundColor: colorPalette.background,
      primaryColor: colorPalette.primary,
      secondaryColor: colorPalette.secondary,
      accentColor: colorPalette.accent,
      textColor: colorPalette.text,
      typography: {
        title: typography.title,
        body: typography.body,
        caption: typography.caption
      },
      elements: templateConfig.elements,
      layout: templateConfig.layout
    };
  };

  // Generar layout del slide
  const generateSlideLayout = (slideType, visualStyle) => {
    const layouts = {
      step_by_step: {
        structure: 'vertical',
        alignment: 'left',
        spacing: 'medium',
        numberPosition: 'top_left'
      },
      numbered_list: {
        structure: 'list',
        alignment: 'center',
        spacing: 'small',
        numberPosition: 'inline'
      },
      before_after: {
        structure: 'split',
        alignment: 'center',
        spacing: 'large',
        comparison: 'side_by_side'
      },
      narrative: {
        structure: 'story',
        alignment: 'center',
        spacing: 'medium',
        flow: 'sequential'
      },
      side_by_side: {
        structure: 'comparison',
        alignment: 'center',
        spacing: 'medium',
        division: 'vertical'
      }
    };

    return layouts[visualStyle] || layouts.numbered_list;
  };

  // Generar animaciones del slide
  const generateSlideAnimations = (slideType, index) => {
    const animations = {
      entrance: index === 0 ? 'fade_in' : 'slide_from_right',
      textAnimation: 'type_writer',
      elementAnimation: 'bounce_in',
      transition: 'smooth_slide',
      duration: 0.8,
      delay: index * 0.2
    };

    return animations;
  };

  // Optimizar carousel para Instagram
  const optimizeCarouselForInstagram = (slides, spec) => {
    const optimizations = [];

    // Optimizar longitud de texto por slide
    const optimizedSlides = slides.map(slide => {
      const optimizedSlide = { ...slide };

      if (slide.content && typeof slide.content === 'object') {
        Object.keys(slide.content).forEach(key => {
          if (typeof slide.content[key] === 'string') {
            const originalText = slide.content[key];
            const optimizedText = optimizeTextForInstagram(originalText);

            if (originalText !== optimizedText) {
              optimizedSlide.content[key] = optimizedText;
              optimizations.push({
                slideId: slide.id,
                type: 'text_optimization',
                field: key,
                original: originalText,
                optimized: optimizedText
              });
            }
          }
        });
      }

      return optimizedSlide;
    });

    // Agregar hashtags optimizados
    const hashtagOptimization = generateOptimizedHashtags(spec.originalContent);
    optimizations.push({
      type: 'hashtag_optimization',
      hashtags: hashtagOptimization
    });

    // Verificar límites de Instagram
    const instagramLimits = checkInstagramLimits(optimizedSlides);
    if (!instagramLimits.valid) {
      optimizations.push({
        type: 'platform_compliance',
        issues: instagramLimits.issues,
        fixes: instagramLimits.fixes
      });
    }

    return {
      slides: optimizedSlides,
      optimizations: optimizations,
      compliance: instagramLimits
    };
  };

  // Optimizar texto para Instagram
  const optimizeTextForInstagram = (text) => {
    const maxLength = carouselGeneratorEngine.contentOptimization.maxCharactersPerSlide;
    const optimalLength = carouselGeneratorEngine.contentOptimization.optimalCharactersPerSlide;

    if (text.length <= optimalLength) {
      return text;
    }

    if (text.length > maxLength) {
      // Truncar y agregar puntos suspensivos
      return text.substring(0, maxLength - 3) + '...';
    }

    // Texto está entre óptimo y máximo, intentar acortar
    const sentences = text.split(/[.!?]+/);
    if (sentences.length > 1) {
      // Usar solo la primera oración si es suficientemente larga
      const firstSentence = sentences[0].trim();
      if (firstSentence.length >= optimalLength * 0.7) {
        return firstSentence + '.';
      }
    }

    return text;
  };

  // Generar hashtags optimizados
  const generateOptimizedHashtags = (content) => {
    const baseHashtags = content.hashtags || [];
    const nicheHashtags = {
      fitness: ['#fitness', '#gym', '#workout', '#health'],
      food: ['#food', '#recipe', '#cooking', '#foodie'],
      fashion: ['#fashion', '#style', '#outfit', '#ootd'],
      tech: ['#tech', '#innovation', '#digital', '#productivity']
    };

    const carouselHashtags = ['#carousel', '#swipe', '#tips', '#tutorial'];
    const engagementHashtags = ['#instagood', '#photooftheday', '#follow'];

    const niche = content.niche || 'general';
    const relevantNicheHashtags = nicheHashtags[niche] || [];

    const allHashtags = [
      ...baseHashtags.slice(0, 3),
      ...relevantNicheHashtags.slice(0, 2),
      ...carouselHashtags.slice(0, 2),
      ...engagementHashtags.slice(0, 1)
    ];

    return [...new Set(allHashtags)].slice(0, 8);
  };

  // Verificar límites de Instagram
  const checkInstagramLimits = (slides) => {
    const issues = [];
    const fixes = [];

    // Verificar número de slides (máximo 10)
    if (slides.length > 10) {
      issues.push('Demasiados slides');
      fixes.push('Reducir a máximo 10 slides');
    }

    // Verificar longitud de texto por slide
    slides.forEach((slide, index) => {
      if (slide.content && typeof slide.content === 'object') {
        Object.values(slide.content).forEach(value => {
          if (typeof value === 'string' && value.length > 150) {
            issues.push(`Texto muy largo en slide ${index + 1}`);
            fixes.push(`Acortar texto en slide ${index + 1}`);
          }
        });
      }
    });

    return {
      valid: issues.length === 0,
      issues: issues,
      fixes: fixes
    };
  };

  // Calcular engagement esperado del carousel
  const calculateCarouselEngagement = (carousel) => {
    let baseEngagement = 5; // 5% base

    // Bonus por número de slides (más slides = más tiempo de visualización)
    baseEngagement += Math.min(carousel.slides.length * 0.5, 3);

    // Bonus por tipo de carousel
    const typeBonus = {
      tutorial: 2,
      tips: 1.5,
      transformation: 2.5,
      story: 1.8,
      comparison: 1.3
    };

    const carouselType = carousel.slides[0]?.type || 'tips';
    baseEngagement += typeBonus[carouselType] || 1;

    // Bonus por optimizaciones aplicadas
    if (carousel.optimizations && carousel.optimizations.length > 0) {
      baseEngagement += carousel.optimizations.length * 0.3;
    }

    return Math.min(baseEngagement, 12); // Máximo 12%
  };

  // Generar múltiples variaciones de carousel
  const generateCarouselVariations = (content, count = 3) => {
    const variations = [];
    const types = ['tutorial', 'tips', 'story'];

    for (let i = 0; i < count; i++) {
      const type = types[i % types.length];
      const variation = generateInstagramCarousel(content, type);
      variation.variationIndex = i + 1;
      variation.testGroup = `carousel_variation_${i + 1}`;
      variations.push(variation);
    }

    return variations;
  };

  // Inicializar generador de carousels
  const initializeCarouselGenerator = () => {
    console.log('Inicializando generador de carousels para Instagram...');

    const supportedTypes = Object.keys(carouselGeneratorEngine.carouselTypes);
    console.log(`Tipos de carousel soportados: ${supportedTypes.join(', ')}`);

    return {
      ready: true,
      supportedTypes: supportedTypes.length,
      maxSlidesPerCarousel: 10,
      averageGenerationTime: '2-3 segundos'
    };
  };

  // PUNTO 23: Video concepts sugeridos
  const [videoConceptsEngine, setVideoConceptsEngine] = useState({
    enabled: true,
    videoFormats: {
      tiktok: {
        duration: { min: 15, max: 180, optimal: 60 },
        aspectRatio: '9:16',
        features: ['trending_sounds', 'effects', 'transitions', 'text_overlay'],
        engagement_factors: ['hook_first_3s', 'visual_appeal', 'trending_audio', 'call_to_action']
      },
      instagram_reels: {
        duration: { min: 15, max: 90, optimal: 30 },
        aspectRatio: '9:16',
        features: ['music', 'effects', 'text', 'stickers'],
        engagement_factors: ['quick_hook', 'visual_storytelling', 'trending_audio', 'shareability']
      },
      youtube_shorts: {
        duration: { min: 15, max: 60, optimal: 45 },
        aspectRatio: '9:16',
        features: ['captions', 'thumbnails', 'end_screens', 'cards'],
        engagement_factors: ['strong_hook', 'value_delivery', 'clear_audio', 'subscribe_cta']
      },
      youtube_long: {
        duration: { min: 300, max: 1800, optimal: 600 },
        aspectRatio: '16:9',
        features: ['chapters', 'thumbnails', 'end_screens', 'cards', 'descriptions'],
        engagement_factors: ['compelling_intro', 'value_throughout', 'engagement_prompts', 'strong_outro']
      }
    },
    conceptTypes: {
      tutorial: {
        structure: ['hook', 'problem', 'solution_steps', 'results', 'cta'],
        viral_elements: ['before_after', 'step_by_step', 'quick_tips', 'common_mistakes'],
        engagement_hooks: ['Learn this in 60 seconds', 'The method nobody talks about', 'Skip these mistakes']
      },
      entertainment: {
        structure: ['hook', 'setup', 'buildup', 'payoff', 'reaction'],
        viral_elements: ['unexpected_twist', 'relatable_content', 'humor', 'trending_format'],
        engagement_hooks: ['You won\'t believe this', 'Plot twist incoming', 'This is so relatable']
      },
      transformation: {
        structure: ['before_state', 'motivation', 'process', 'progress', 'final_result'],
        viral_elements: ['dramatic_change', 'time_lapse', 'progress_tracking', 'emotional_journey'],
        engagement_hooks: ['30 day transformation', 'From zero to hero', 'The glow up is real']
      },
      storytelling: {
        structure: ['hook', 'context', 'conflict', 'climax', 'resolution'],
        viral_elements: ['personal_story', 'emotional_connection', 'plot_twist', 'life_lesson'],
        engagement_hooks: ['Story time', 'This changed everything', 'You need to hear this']
      },
      review: {
        structure: ['intro', 'first_impressions', 'detailed_analysis', 'pros_cons', 'verdict'],
        viral_elements: ['honest_opinion', 'comparison', 'value_assessment', 'recommendation'],
        engagement_hooks: ['Honest review', 'Worth the hype?', 'Don\'t buy before watching']
      }
    },
    trendingFormats: {
      pov: {
        description: 'Point of view scenarios',
        template: 'POV: {scenario}',
        examples: ['POV: You discovered this life hack', 'POV: You tried this for 30 days'],
        viral_potential: 0.85
      },
      day_in_life: {
        description: 'Daily routine showcase',
        template: 'Day in my life as a {role}',
        examples: ['Day in my life as a content creator', 'Day in my life working from home'],
        viral_potential: 0.75
      },
      get_ready_with_me: {
        description: 'Preparation process',
        template: 'Get ready with me for {event}',
        examples: ['Get ready with me for a workout', 'Get ready with me for date night'],
        viral_potential: 0.80
      },
      before_after: {
        description: 'Transformation showcase',
        template: '{timeframe} {transformation_type}',
        examples: ['30 day fitness transformation', '1 week room makeover'],
        viral_potential: 0.90
      },
      reaction: {
        description: 'Response to trending content',
        template: 'Reacting to {trending_topic}',
        examples: ['Reacting to viral life hacks', 'Reacting to fashion trends'],
        viral_potential: 0.70
      }
    },
    nicheSpecificConcepts: {
      fitness: {
        popular_concepts: ['workout_routines', 'transformation', 'nutrition_tips', 'form_corrections', 'motivation'],
        trending_topics: ['home_workouts', 'quick_exercises', 'healthy_recipes', 'fitness_myths', 'progress_tracking'],
        viral_angles: ['15_minute_workout', 'no_equipment_needed', 'beginner_friendly', 'results_in_30_days']
      },
      food: {
        popular_concepts: ['recipe_tutorials', 'cooking_hacks', 'taste_tests', 'ingredient_swaps', 'meal_prep'],
        trending_topics: ['healthy_alternatives', 'quick_meals', 'budget_cooking', 'viral_recipes', 'cooking_fails'],
        viral_angles: ['5_ingredient_recipe', 'ready_in_10_minutes', 'healthier_version', 'viral_food_trend']
      },
      fashion: {
        popular_concepts: ['outfit_styling', 'thrift_finds', 'trend_analysis', 'wardrobe_essentials', 'styling_tips'],
        trending_topics: ['sustainable_fashion', 'budget_outfits', 'capsule_wardrobe', 'vintage_styling', 'body_positivity'],
        viral_angles: ['outfit_under_50', 'thrift_flip', 'style_challenge', 'confidence_boost']
      },
      tech: {
        popular_concepts: ['app_reviews', 'tech_tutorials', 'productivity_tips', 'gadget_unboxing', 'comparison_videos'],
        trending_topics: ['ai_tools', 'productivity_apps', 'tech_life_hacks', 'smartphone_tips', 'work_from_home_setup'],
        viral_angles: ['life_changing_app', 'productivity_hack', 'tech_you_need', 'hidden_features']
      }
    }
  });

  // Estado para conceptos generados
  const [generatedVideoConcepts, setGeneratedVideoConcepts] = useState([]);
  const [conceptsQueue, setConceptsQueue] = useState([]);

  // Función principal para generar conceptos de video
  const generateVideoConcepts = (content, platform = 'tiktok', count = 5) => {
    const concepts = [];

    for (let i = 0; i < count; i++) {
      const concept = createVideoConcept(content, platform, i);
      if (concept) {
        concepts.push(concept);
      }
    }

    // Ordenar por potencial viral
    const sortedConcepts = concepts.sort((a, b) => b.viralPotential - a.viralPotential);

    // Agregar a la lista de conceptos generados
    setGeneratedVideoConcepts(prev => [...prev, ...sortedConcepts]);

    return sortedConcepts;
  };

  // Crear concepto de video individual
  const createVideoConcept = (content, platform, index) => {
    const niche = content.niche || 'general';
    const nicheData = videoConceptsEngine.nicheSpecificConcepts[niche];
    const platformSpecs = videoConceptsEngine.videoFormats[platform];

    if (!nicheData || !platformSpecs) {
      return null;
    }

    // Seleccionar tipo de concepto
    const conceptType = selectConceptType(content, nicheData);
    const conceptStructure = videoConceptsEngine.conceptTypes[conceptType];

    // Seleccionar formato trending
    const trendingFormat = selectTrendingFormat(content, niche);

    const concept = {
      id: `video_concept_${content.id}_${index}_${Date.now()}`,
      originalContentId: content.id,
      platform: platform,
      niche: niche,
      type: conceptType,
      format: trendingFormat,
      title: generateVideoTitle(content, conceptType, trendingFormat),
      description: generateVideoDescription(content, conceptType),
      structure: adaptStructureForContent(conceptStructure.structure, content),
      duration: calculateOptimalDuration(conceptType, platform),
      hooks: generateVideoHooks(content, conceptStructure.engagement_hooks),
      visualElements: generateVisualElements(content, conceptType, niche),
      audioSuggestions: generateAudioSuggestions(conceptType, niche),
      editingTips: generateEditingTips(conceptType, platform),
      viralPotential: calculateViralPotential(content, conceptType, trendingFormat, niche),
      engagementPrediction: predictEngagement(content, conceptType, platform),
      createdAt: new Date()
    };

    return concept;
  };

  // Seleccionar tipo de concepto
  const selectConceptType = (content, nicheData) => {
    const contentText = content.content.toLowerCase();
    const title = content.title.toLowerCase();

    // Detectar patrones en el contenido
    const patterns = {
      tutorial: ['cómo', 'paso', 'tutorial', 'aprende', 'enseño', 'método'],
      transformation: ['antes', 'después', 'cambio', 'transformación', 'resultado'],
      review: ['review', 'opinión', 'recomiendo', 'probé', 'análisis'],
      storytelling: ['historia', 'experiencia', 'pasó', 'cuento', 'vivencia'],
      entertainment: ['divertido', 'gracioso', 'entretenido', 'viral', 'trend']
    };

    let maxScore = 0;
    let selectedType = 'tutorial'; // Default

    Object.entries(patterns).forEach(([type, keywords]) => {
      const score = keywords.filter(keyword =>
        contentText.includes(keyword) || title.includes(keyword)
      ).length;

      if (score > maxScore) {
        maxScore = score;
        selectedType = type;
      }
    });

    return selectedType;
  };

  // Seleccionar formato trending
  const selectTrendingFormat = (content, niche) => {
    const formats = Object.keys(videoConceptsEngine.trendingFormats);

    // Priorizar formatos por nicho
    const nicheFormatPreferences = {
      fitness: ['transformation', 'day_in_life', 'pov'],
      food: ['get_ready_with_me', 'before_after', 'reaction'],
      fashion: ['get_ready_with_me', 'pov', 'day_in_life'],
      tech: ['review', 'pov', 'reaction']
    };

    const preferredFormats = nicheFormatPreferences[niche] || formats;
    const availableFormats = preferredFormats.filter(format => formats.includes(format));

    return availableFormats[Math.floor(Math.random() * availableFormats.length)] || 'pov';
  };

  // Generar título del video
  const generateVideoTitle = (content, conceptType, trendingFormat) => {
    const formatData = videoConceptsEngine.trendingFormats[trendingFormat];
    const originalTitle = content.title;

    // Adaptar título según el formato
    if (formatData && formatData.template) {
      const keywords = extractKeywords(content.content);
      const mainKeyword = keywords[0] || 'esto';

      let adaptedTitle = formatData.template;
      adaptedTitle = adaptedTitle.replace('{scenario}', `${mainKeyword} cambió todo`);
      adaptedTitle = adaptedTitle.replace('{role}', `${content.niche} creator`);
      adaptedTitle = adaptedTitle.replace('{event}', mainKeyword);
      adaptedTitle = adaptedTitle.replace('{timeframe}', '30 días');
      adaptedTitle = adaptedTitle.replace('{transformation_type}', `${mainKeyword} transformation`);
      adaptedTitle = adaptedTitle.replace('{trending_topic}', originalTitle);

      return adaptedTitle;
    }

    return originalTitle;
  };

  // Generar descripción del video
  const generateVideoDescription = (content, conceptType) => {
    const descriptions = {
      tutorial: `Aprende ${extractKeywords(content.content)[0] || 'esto'} paso a paso. Tutorial completo que te ayudará a dominar esta técnica.`,
      transformation: `Mi increíble transformación usando ${extractKeywords(content.content)[0] || 'este método'}. Los resultados te van a sorprender.`,
      review: `Review honesta de ${extractKeywords(content.content)[0] || 'este producto'}. Te cuento todo lo que necesitas saber.`,
      storytelling: `La historia detrás de ${extractKeywords(content.content)[0] || 'este cambio'}. Una experiencia que cambió mi perspectiva.`,
      entertainment: `Contenido divertido sobre ${extractKeywords(content.content)[0] || 'este tema'}. ¡No te lo puedes perder!`
    };

    return descriptions[conceptType] || content.content.substring(0, 100) + '...';
  };

  // Adaptar estructura para contenido
  const adaptStructureForContent = (baseStructure, content) => {
    const adaptedStructure = baseStructure.map(section => {
      const adaptations = {
        hook: `Hook: ${content.title.substring(0, 30)}...`,
        problem: `Problema: ${extractKeywords(content.content)[0] || 'desafío común'}`,
        solution_steps: `Solución: Pasos para ${extractKeywords(content.content)[0] || 'resolver esto'}`,
        results: `Resultados: Lo que lograrás con ${extractKeywords(content.content)[0] || 'este método'}`,
        cta: 'CTA: Sígueme para más contenido así',
        before_state: 'Estado inicial: Situación antes del cambio',
        motivation: 'Motivación: Por qué decidí hacer este cambio',
        process: 'Proceso: Cómo lo hice paso a paso',
        final_result: 'Resultado final: El increíble cambio logrado'
      };

      return adaptations[section] || section;
    });

    return adaptedStructure;
  };

  // Calcular duración óptima
  const calculateOptimalDuration = (conceptType, platform) => {
    const platformSpecs = videoConceptsEngine.videoFormats[platform];
    const baseDuration = platformSpecs.duration.optimal;

    // Ajustar según tipo de concepto
    const durationMultipliers = {
      tutorial: 1.2,
      transformation: 1.0,
      review: 1.3,
      storytelling: 1.1,
      entertainment: 0.8
    };

    const multiplier = durationMultipliers[conceptType] || 1.0;
    const adjustedDuration = Math.round(baseDuration * multiplier);

    return Math.max(
      platformSpecs.duration.min,
      Math.min(adjustedDuration, platformSpecs.duration.max)
    );
  };

  // Generar hooks de video
  const generateVideoHooks = (content, baseHooks) => {
    const customHooks = [
      `¿Sabías que ${extractKeywords(content.content)[0] || 'esto'} puede cambiar tu vida?`,
      `Nadie me dijo que ${extractKeywords(content.content)[0] || 'esto'} era tan efectivo`,
      `El secreto de ${extractKeywords(content.content)[0] || 'esto'} que nadie cuenta`,
      `Probé ${extractKeywords(content.content)[0] || 'esto'} por 30 días y esto pasó`,
      `La verdad sobre ${extractKeywords(content.content)[0] || 'esto'} que debes saber`
    ];

    return [...baseHooks.slice(0, 3), ...customHooks.slice(0, 2)];
  };

  // Generar elementos visuales
  const generateVisualElements = (content, conceptType, niche) => {
    const baseElements = {
      tutorial: ['step_by_step_graphics', 'progress_indicators', 'before_after_comparison', 'text_overlays'],
      transformation: ['time_lapse', 'progress_tracking', 'measurement_graphics', 'emotional_reactions'],
      review: ['product_shots', 'comparison_charts', 'rating_graphics', 'pros_cons_list'],
      storytelling: ['emotional_moments', 'context_visuals', 'timeline_graphics', 'reaction_shots'],
      entertainment: ['dynamic_transitions', 'trending_effects', 'text_animations', 'reaction_gifs']
    };

    const nicheElements = {
      fitness: ['workout_demonstrations', 'form_corrections', 'progress_photos', 'equipment_shots'],
      food: ['cooking_process', 'ingredient_close_ups', 'final_dish_reveal', 'taste_reactions'],
      fashion: ['outfit_reveals', 'styling_process', 'accessory_details', 'mirror_shots'],
      tech: ['screen_recordings', 'device_close_ups', 'interface_highlights', 'comparison_shots']
    };

    return [
      ...baseElements[conceptType] || [],
      ...nicheElements[niche] || []
    ].slice(0, 6);
  };

  // Generar sugerencias de audio
  const generateAudioSuggestions = (conceptType, niche) => {
    const audioTypes = {
      tutorial: ['upbeat_instrumental', 'motivational_music', 'clear_voiceover'],
      transformation: ['inspirational_music', 'emotional_soundtrack', 'progress_sounds'],
      review: ['neutral_background', 'professional_tone', 'clear_narration'],
      storytelling: ['emotional_music', 'dramatic_pauses', 'engaging_narration'],
      entertainment: ['trending_sounds', 'viral_audio', 'energetic_music']
    };

    const nicheAudio = {
      fitness: ['workout_beats', 'motivational_speeches', 'gym_sounds'],
      food: ['cooking_sounds', 'sizzling_effects', 'satisfying_audio'],
      fashion: ['trendy_music', 'fashion_show_beats', 'confident_vibes'],
      tech: ['tech_sounds', 'notification_effects', 'modern_beats']
    };

    return [
      ...audioTypes[conceptType] || [],
      ...nicheAudio[niche] || []
    ].slice(0, 4);
  };

  // Generar tips de edición
  const generateEditingTips = (conceptType, platform) => {
    const baseTips = {
      tutorial: [
        'Usa transiciones rápidas entre pasos',
        'Añade texto explicativo en cada paso',
        'Incluye close-ups de detalles importantes',
        'Mantén un ritmo constante'
      ],
      transformation: [
        'Usa time-lapse para mostrar progreso',
        'Incluye mediciones y datos',
        'Añade música inspiracional',
        'Termina con reveal dramático'
      ],
      entertainment: [
        'Usa efectos trending',
        'Mantén ritmo rápido',
        'Incluye reacciones auténticas',
        'Añade elementos sorpresa'
      ]
    };

    const platformTips = {
      tiktok: ['Hook en primeros 3 segundos', 'Usa trending sounds', 'Añade texto llamativo'],
      instagram_reels: ['Optimiza para vertical', 'Usa stickers interactivos', 'Incluye hashtags relevantes'],
      youtube_shorts: ['Añade captions', 'Incluye CTA al final', 'Optimiza thumbnail']
    };

    return [
      ...baseTips[conceptType] || [],
      ...platformTips[platform] || []
    ].slice(0, 5);
  };

  // Calcular potencial viral
  const calculateViralPotential = (content, conceptType, trendingFormat, niche) => {
    let potential = 0.5; // Base 50%

    // Factor por tipo de concepto
    const conceptFactors = {
      transformation: 0.25,
      tutorial: 0.20,
      entertainment: 0.15,
      storytelling: 0.10,
      review: 0.05
    };
    potential += conceptFactors[conceptType] || 0;

    // Factor por formato trending
    const formatData = videoConceptsEngine.trendingFormats[trendingFormat];
    if (formatData) {
      potential += formatData.viral_potential * 0.2;
    }

    // Factor por nicho
    const nicheFactors = {
      fitness: 0.15,
      food: 0.12,
      fashion: 0.18,
      tech: 0.10
    };
    potential += nicheFactors[niche] || 0.08;

    // Factor por keywords virales en contenido
    const viralKeywords = ['secreto', 'nadie', 'cambió', 'increíble', 'viral', 'trending'];
    const contentText = content.content.toLowerCase();
    const viralMatches = viralKeywords.filter(keyword => contentText.includes(keyword));
    potential += viralMatches.length * 0.02;

    return Math.min(potential, 0.95); // Máximo 95%
  };

  // Predecir engagement
  const predictEngagement = (content, conceptType, platform) => {
    let baseEngagement = 5; // 5% base

    // Factor por tipo de concepto
    const conceptEngagement = {
      transformation: 8,
      tutorial: 6,
      entertainment: 7,
      storytelling: 5,
      review: 4
    };
    baseEngagement += conceptEngagement[conceptType] || 3;

    // Factor por plataforma
    const platformEngagement = {
      tiktok: 1.3,
      instagram_reels: 1.1,
      youtube_shorts: 1.0,
      youtube_long: 0.8
    };
    baseEngagement *= platformEngagement[platform] || 1.0;

    return Math.min(baseEngagement, 15); // Máximo 15%
  };

  // Generar conceptos por lotes
  const generateBatchVideoConcepts = (contentList, platform = 'tiktok') => {
    const batchResults = {};

    contentList.forEach(content => {
      const concepts = generateVideoConcepts(content, platform, 3);
      batchResults[content.id] = {
        originalContent: content,
        concepts: concepts,
        bestConcept: concepts[0], // El de mayor potencial viral
        averageViralPotential: concepts.reduce((sum, c) => sum + c.viralPotential, 0) / concepts.length
      };
    });

    return batchResults;
  };

  // Filtrar conceptos por criterios
  const filterVideoConceptsByCriteria = (criteria) => {
    const { platform, conceptType, minViralPotential, niche, maxDuration } = criteria;

    return generatedVideoConcepts.filter(concept => {
      if (platform && concept.platform !== platform) return false;
      if (conceptType && concept.type !== conceptType) return false;
      if (minViralPotential && concept.viralPotential < minViralPotential) return false;
      if (niche && concept.niche !== niche) return false;
      if (maxDuration && concept.duration > maxDuration) return false;

      return true;
    });
  };

  // Inicializar generador de conceptos de video
  const initializeVideoConceptsGenerator = () => {
    console.log('Inicializando generador de conceptos de video...');

    const supportedPlatforms = Object.keys(videoConceptsEngine.videoFormats);
    const supportedTypes = Object.keys(videoConceptsEngine.conceptTypes);
    const trendingFormats = Object.keys(videoConceptsEngine.trendingFormats);

    console.log(`Plataformas soportadas: ${supportedPlatforms.join(', ')}`);
    console.log(`Tipos de concepto: ${supportedTypes.join(', ')}`);
    console.log(`Formatos trending: ${trendingFormats.join(', ')}`);

    return {
      ready: true,
      supportedPlatforms: supportedPlatforms.length,
      conceptTypes: supportedTypes.length,
      trendingFormats: trendingFormats.length,
      averageConceptsPerContent: 5
    };
  };

  // PUNTO 24: Brand consistency checker
  const [brandConsistencyEngine, setBrandConsistencyEngine] = useState({
    enabled: true,
    brandGuidelines: {
      voice: {
        tone: 'friendly_professional', // casual, professional, friendly_professional, authoritative, playful
        personality: ['authentic', 'helpful', 'inspiring', 'relatable'],
        forbidden_words: ['spam', 'fake', 'scam', 'guaranteed', 'miracle'],
        preferred_language: 'spanish',
        formality_level: 'informal' // formal, informal, mixed
      },
      visual: {
        color_palette: {
          primary: '#2196F3',
          secondary: '#FF9800',
          accent: '#4CAF50',
          neutral: '#757575',
          background: '#FFFFFF'
        },
        typography: {
          primary_font: 'Montserrat',
          secondary_font: 'Open Sans',
          heading_style: 'bold',
          body_style: 'regular'
        },
        logo_usage: {
          required_placement: 'bottom_right',
          minimum_size: '50px',
          clear_space: '20px',
          acceptable_formats: ['png', 'svg']
        }
      },
      content: {
        messaging_pillars: [
          'educación_y_valor',
          'autenticidad_personal',
          'resultados_reales',
          'comunidad_inclusiva'
        ],
        content_themes: [
          'tips_prácticos',
          'historias_personales',
          'transformaciones',
          'educación_nicho'
        ],
        hashtag_strategy: {
          branded_hashtags: ['#MiMarca', '#ContenidoDeValor'],
          niche_hashtags_required: 3,
          trending_hashtags_max: 2,
          total_hashtags_limit: 10
        }
      },
      compliance: {
        platform_guidelines: true,
        copyright_respect: true,
        disclosure_requirements: true,
        accessibility_standards: true
      }
    },
    checkingCriteria: {
      voice_consistency: {
        weight: 25,
        checks: ['tone_analysis', 'personality_match', 'language_style', 'forbidden_words']
      },
      visual_consistency: {
        weight: 20,
        checks: ['color_compliance', 'typography_usage', 'logo_placement', 'visual_hierarchy']
      },
      message_alignment: {
        weight: 25,
        checks: ['pillar_alignment', 'theme_consistency', 'value_delivery', 'audience_relevance']
      },
      hashtag_compliance: {
        weight: 15,
        checks: ['branded_presence', 'niche_relevance', 'trending_balance', 'total_count']
      },
      platform_compliance: {
        weight: 15,
        checks: ['guideline_adherence', 'format_requirements', 'disclosure_presence', 'accessibility']
      }
    }
  });

  // Estado para análisis de consistencia
  const [brandAnalysisResults, setBrandAnalysisResults] = useState([]);
  const [brandViolations, setBrandViolations] = useState([]);

  // Función principal de verificación de consistencia de marca
  const checkBrandConsistency = (content) => {
    const analysis = {
      contentId: content.id,
      timestamp: new Date(),
      overallScore: 0,
      categoryScores: {},
      violations: [],
      recommendations: [],
      complianceLevel: 'unknown'
    };

    // Verificar cada categoría
    Object.entries(brandConsistencyEngine.checkingCriteria).forEach(([category, config]) => {
      const categoryResult = checkCategoryConsistency(content, category, config);
      analysis.categoryScores[category] = categoryResult.score;
      analysis.violations.push(...categoryResult.violations);
      analysis.recommendations.push(...categoryResult.recommendations);
    });

    // Calcular score general
    analysis.overallScore = calculateOverallBrandScore(analysis.categoryScores);
    analysis.complianceLevel = determineBrandComplianceLevel(analysis.overallScore);

    // Guardar resultado
    setBrandAnalysisResults(prev => [...prev, analysis]);

    // Guardar violaciones si las hay
    if (analysis.violations.length > 0) {
      setBrandViolations(prev => [...prev, ...analysis.violations]);
    }

    return analysis;
  };

  // Verificar consistencia por categoría
  const checkCategoryConsistency = (content, category, config) => {
    const result = {
      score: 0,
      violations: [],
      recommendations: []
    };

    switch (category) {
      case 'voice_consistency':
        result = checkVoiceConsistency(content);
        break;
      case 'visual_consistency':
        result = checkVisualConsistency(content);
        break;
      case 'message_alignment':
        result = checkMessageAlignment(content);
        break;
      case 'hashtag_compliance':
        result = checkHashtagCompliance(content);
        break;
      case 'platform_compliance':
        result = checkPlatformCompliance(content);
        break;
    }

    return result;
  };

  // Verificar consistencia de voz
  const checkVoiceConsistency = (content) => {
    const guidelines = brandConsistencyEngine.brandGuidelines.voice;
    const result = { score: 0, violations: [], recommendations: [] };
    let checks = 0;
    let passed = 0;

    // Análisis de tono
    const detectedTone = analyzeTone(content.content);
    checks++;
    if (detectedTone === guidelines.tone) {
      passed++;
    } else {
      result.violations.push({
        type: 'tone_mismatch',
        severity: 'medium',
        message: `Tono detectado (${detectedTone}) no coincide con el tono de marca (${guidelines.tone})`,
        suggestion: `Ajustar el contenido para reflejar un tono ${guidelines.tone}`
      });
    }

    // Verificar palabras prohibidas
    checks++;
    const forbiddenFound = checkForbiddenWords(content.content, guidelines.forbidden_words);
    if (forbiddenFound.length === 0) {
      passed++;
    } else {
      result.violations.push({
        type: 'forbidden_words',
        severity: 'high',
        message: `Palabras prohibidas encontradas: ${forbiddenFound.join(', ')}`,
        suggestion: 'Remover o reemplazar las palabras prohibidas'
      });
    }

    // Verificar personalidad de marca
    checks++;
    const personalityMatch = checkPersonalityAlignment(content.content, guidelines.personality);
    if (personalityMatch >= 0.7) {
      passed++;
    } else {
      result.violations.push({
        type: 'personality_mismatch',
        severity: 'low',
        message: `Personalidad de marca poco reflejada (${(personalityMatch * 100).toFixed(1)}%)`,
        suggestion: 'Incorporar más elementos que reflejen la personalidad de marca'
      });
    }

    // Verificar nivel de formalidad
    checks++;
    const formalityLevel = analyzeFormalityLevel(content.content);
    if (formalityLevel === guidelines.formality_level) {
      passed++;
    } else {
      result.recommendations.push({
        type: 'formality_adjustment',
        message: `Considerar ajustar el nivel de formalidad a ${guidelines.formality_level}`,
        impact: 'low'
      });
    }

    result.score = (passed / checks) * 100;
    return result;
  };

  // Verificar consistencia visual
  const checkVisualConsistency = (content) => {
    const guidelines = brandConsistencyEngine.brandGuidelines.visual;
    const result = { score: 0, violations: [], recommendations: [] };
    let checks = 0;
    let passed = 0;

    // Verificar uso de colores (simulado)
    checks++;
    const colorCompliance = checkColorUsage(content, guidelines.color_palette);
    if (colorCompliance >= 0.8) {
      passed++;
    } else {
      result.violations.push({
        type: 'color_inconsistency',
        severity: 'medium',
        message: 'Colores utilizados no siguen la paleta de marca',
        suggestion: 'Usar colores de la paleta oficial de marca'
      });
    }

    // Verificar tipografía (simulado)
    checks++;
    const typographyCompliance = checkTypographyUsage(content, guidelines.typography);
    if (typographyCompliance >= 0.8) {
      passed++;
    } else {
      result.recommendations.push({
        type: 'typography_suggestion',
        message: 'Considerar usar las fuentes oficiales de marca',
        impact: 'medium'
      });
    }

    // Verificar presencia de logo (simulado)
    checks++;
    const logoPresence = checkLogoPresence(content, guidelines.logo_usage);
    if (logoPresence) {
      passed++;
    } else {
      result.violations.push({
        type: 'missing_logo',
        severity: 'low',
        message: 'Logo de marca no detectado en el contenido',
        suggestion: 'Incluir logo según las especificaciones de marca'
      });
    }

    result.score = (passed / checks) * 100;
    return result;
  };

  // Verificar alineación de mensaje
  const checkMessageAlignment = (content) => {
    const guidelines = brandConsistencyEngine.brandGuidelines.content;
    const result = { score: 0, violations: [], recommendations: [] };
    let checks = 0;
    let passed = 0;

    // Verificar alineación con pilares de mensaje
    checks++;
    const pillarAlignment = checkPillarAlignment(content.content, guidelines.messaging_pillars);
    if (pillarAlignment >= 0.6) {
      passed++;
    } else {
      result.violations.push({
        type: 'pillar_misalignment',
        severity: 'medium',
        message: 'Contenido no se alinea claramente con los pilares de mensaje de marca',
        suggestion: 'Incorporar elementos que reflejen los pilares de mensaje'
      });
    }

    // Verificar consistencia temática
    checks++;
    const themeConsistency = checkThemeConsistency(content.content, guidelines.content_themes);
    if (themeConsistency >= 0.7) {
      passed++;
    } else {
      result.recommendations.push({
        type: 'theme_enhancement',
        message: 'Fortalecer la conexión con los temas principales de marca',
        impact: 'medium'
      });
    }

    // Verificar entrega de valor
    checks++;
    const valueDelivery = assessValueDelivery(content.content);
    if (valueDelivery >= 0.7) {
      passed++;
    } else {
      result.violations.push({
        type: 'low_value_delivery',
        severity: 'medium',
        message: 'El contenido podría entregar más valor a la audiencia',
        suggestion: 'Añadir tips, insights o información práctica'
      });
    }

    result.score = (passed / checks) * 100;
    return result;
  };

  // Verificar cumplimiento de hashtags
  const checkHashtagCompliance = (content) => {
    const guidelines = brandConsistencyEngine.brandGuidelines.content.hashtag_strategy;
    const result = { score: 0, violations: [], recommendations: [] };
    const hashtags = content.hashtags || [];
    let checks = 0;
    let passed = 0;

    // Verificar presencia de hashtags de marca
    checks++;
    const brandedHashtagsPresent = guidelines.branded_hashtags.some(tag =>
      hashtags.some(contentTag => contentTag.toLowerCase().includes(tag.toLowerCase().replace('#', '')))
    );
    if (brandedHashtagsPresent) {
      passed++;
    } else {
      result.violations.push({
        type: 'missing_branded_hashtags',
        severity: 'high',
        message: 'Faltan hashtags de marca en el contenido',
        suggestion: `Incluir al menos uno de: ${guidelines.branded_hashtags.join(', ')}`
      });
    }

    // Verificar cantidad de hashtags de nicho
    checks++;
    const nicheHashtagCount = countNicheHashtags(hashtags, content.niche);
    if (nicheHashtagCount >= guidelines.niche_hashtags_required) {
      passed++;
    } else {
      result.recommendations.push({
        type: 'niche_hashtags_needed',
        message: `Añadir más hashtags de nicho (${nicheHashtagCount}/${guidelines.niche_hashtags_required})`,
        impact: 'medium'
      });
    }

    // Verificar límite total de hashtags
    checks++;
    if (hashtags.length <= guidelines.total_hashtags_limit) {
      passed++;
    } else {
      result.violations.push({
        type: 'hashtag_limit_exceeded',
        severity: 'low',
        message: `Demasiados hashtags (${hashtags.length}/${guidelines.total_hashtags_limit})`,
        suggestion: 'Reducir la cantidad de hashtags'
      });
    }

    result.score = (passed / checks) * 100;
    return result;
  };

  // Verificar cumplimiento de plataforma
  const checkPlatformCompliance = (content) => {
    const result = { score: 0, violations: [], recommendations: [] };
    let checks = 0;
    let passed = 0;

    // Verificar longitud de contenido por plataforma
    checks++;
    const lengthCompliance = checkContentLength(content);
    if (lengthCompliance) {
      passed++;
    } else {
      result.violations.push({
        type: 'content_length_violation',
        severity: 'medium',
        message: 'Longitud de contenido no óptima para la plataforma',
        suggestion: 'Ajustar longitud según las mejores prácticas de la plataforma'
      });
    }

    // Verificar requerimientos de divulgación (simulado)
    checks++;
    const disclosurePresent = checkDisclosureRequirements(content);
    if (disclosurePresent) {
      passed++;
    } else {
      result.recommendations.push({
        type: 'disclosure_suggestion',
        message: 'Considerar añadir divulgaciones si es contenido patrocinado',
        impact: 'high'
      });
    }

    // Verificar accesibilidad (simulado)
    checks++;
    const accessibilityScore = checkAccessibility(content);
    if (accessibilityScore >= 0.8) {
      passed++;
    } else {
      result.recommendations.push({
        type: 'accessibility_improvement',
        message: 'Mejorar accesibilidad con alt text, captions, etc.',
        impact: 'medium'
      });
    }

    result.score = (passed / checks) * 100;
    return result;
  };

  // Funciones auxiliares de análisis
  const analyzeTone = (text) => {
    const toneIndicators = {
      casual: ['hey', 'hola', 'qué tal', 'genial', 'cool'],
      professional: ['estimado', 'cordialmente', 'atentamente', 'profesional'],
      friendly_professional: ['hola', 'gracias', 'espero', 'ayudar', 'compartir'],
      authoritative: ['debe', 'necesario', 'importante', 'fundamental', 'esencial'],
      playful: ['jaja', 'wow', 'increíble', 'divertido', 'genial']
    };

    const textLower = text.toLowerCase();
    let maxScore = 0;
    let detectedTone = 'friendly_professional';

    Object.entries(toneIndicators).forEach(([tone, indicators]) => {
      const score = indicators.filter(indicator => textLower.includes(indicator)).length;
      if (score > maxScore) {
        maxScore = score;
        detectedTone = tone;
      }
    });

    return detectedTone;
  };

  const checkForbiddenWords = (text, forbiddenWords) => {
    const textLower = text.toLowerCase();
    return forbiddenWords.filter(word => textLower.includes(word.toLowerCase()));
  };

  const checkPersonalityAlignment = (text, personality) => {
    const personalityKeywords = {
      authentic: ['real', 'honesto', 'verdad', 'experiencia', 'personal'],
      helpful: ['ayuda', 'tip', 'consejo', 'útil', 'beneficio'],
      inspiring: ['motivación', 'inspirar', 'lograr', 'sueños', 'metas'],
      relatable: ['también', 'igual', 'entiendo', 'pasó', 'similar']
    };

    const textLower = text.toLowerCase();
    let totalMatches = 0;
    let totalPossible = 0;

    personality.forEach(trait => {
      const keywords = personalityKeywords[trait] || [];
      totalPossible += keywords.length;
      totalMatches += keywords.filter(keyword => textLower.includes(keyword)).length;
    });

    return totalPossible > 0 ? totalMatches / totalPossible : 0;
  };

  const analyzeFormalityLevel = (text) => {
    const formalIndicators = ['usted', 'estimado', 'cordialmente', 'atentamente'];
    const informalIndicators = ['tú', 'hola', 'hey', 'genial', 'cool'];

    const textLower = text.toLowerCase();
    const formalCount = formalIndicators.filter(word => textLower.includes(word)).length;
    const informalCount = informalIndicators.filter(word => textLower.includes(word)).length;

    if (formalCount > informalCount) return 'formal';
    if (informalCount > formalCount) return 'informal';
    return 'mixed';
  };

  const checkColorUsage = (content, colorPalette) => {
    // Simulación - en implementación real analizaría imágenes/videos
    return Math.random() * 0.4 + 0.6; // 60-100%
  };

  const checkTypographyUsage = (content, typography) => {
    // Simulación - en implementación real analizaría fuentes utilizadas
    return Math.random() * 0.3 + 0.7; // 70-100%
  };

  const checkLogoPresence = (content, logoUsage) => {
    // Simulación - en implementación real detectaría logo en medios
    return Math.random() > 0.3; // 70% probabilidad
  };

  const checkPillarAlignment = (text, pillars) => {
    const pillarKeywords = {
      educación_y_valor: ['aprende', 'tip', 'cómo', 'tutorial', 'enseño'],
      autenticidad_personal: ['mi', 'personal', 'experiencia', 'honesto', 'real'],
      resultados_reales: ['resultado', 'cambio', 'logré', 'funciona', 'efectivo'],
      comunidad_inclusiva: ['todos', 'juntos', 'comunidad', 'compartir', 'ayudar']
    };

    const textLower = text.toLowerCase();
    let totalMatches = 0;
    let totalChecked = 0;

    pillars.forEach(pillar => {
      const keywords = pillarKeywords[pillar] || [];
      totalChecked += keywords.length;
      totalMatches += keywords.filter(keyword => textLower.includes(keyword)).length;
    });

    return totalChecked > 0 ? totalMatches / totalChecked : 0;
  };

  const checkThemeConsistency = (text, themes) => {
    const themeKeywords = {
      tips_prácticos: ['tip', 'consejo', 'truco', 'hack', 'método'],
      historias_personales: ['historia', 'experiencia', 'pasó', 'viví', 'cuento'],
      transformaciones: ['antes', 'después', 'cambio', 'transformación', 'resultado'],
      educación_nicho: ['aprende', 'enseño', 'tutorial', 'guía', 'cómo']
    };

    const textLower = text.toLowerCase();
    let matches = 0;

    themes.forEach(theme => {
      const keywords = themeKeywords[theme] || [];
      if (keywords.some(keyword => textLower.includes(keyword))) {
        matches++;
      }
    });

    return matches / themes.length;
  };

  const assessValueDelivery = (text) => {
    const valueKeywords = ['tip', 'consejo', 'aprende', 'cómo', 'método', 'secreto', 'truco', 'beneficio'];
    const textLower = text.toLowerCase();
    const valueMatches = valueKeywords.filter(keyword => textLower.includes(keyword)).length;

    return Math.min(valueMatches / 3, 1); // Normalizar a máximo 1
  };

  const countNicheHashtags = (hashtags, niche) => {
    const nicheHashtags = {
      fitness: ['fitness', 'gym', 'workout', 'health', 'exercise'],
      food: ['food', 'recipe', 'cooking', 'chef', 'delicious'],
      fashion: ['fashion', 'style', 'outfit', 'ootd', 'trend'],
      tech: ['tech', 'technology', 'app', 'digital', 'innovation']
    };

    const relevantHashtags = nicheHashtags[niche] || [];
    return hashtags.filter(tag =>
      relevantHashtags.some(nicheTag =>
        tag.toLowerCase().includes(nicheTag)
      )
    ).length;
  };

  const checkContentLength = (content) => {
    const platformLimits = {
      tiktok: { min: 50, max: 150 },
      instagram: { min: 100, max: 300 },
      youtube: { min: 200, max: 500 },
      facebook: { min: 100, max: 400 }
    };

    const limits = platformLimits[content.platform] || { min: 50, max: 300 };
    const length = content.content.length;

    return length >= limits.min && length <= limits.max;
  };

  const checkDisclosureRequirements = (content) => {
    const disclosureKeywords = ['#ad', '#sponsored', '#collab', 'patrocinado', 'colaboración'];
    const textLower = content.content.toLowerCase();
    const hashtagsLower = (content.hashtags || []).join(' ').toLowerCase();

    return disclosureKeywords.some(keyword =>
      textLower.includes(keyword) || hashtagsLower.includes(keyword)
    );
  };

  const checkAccessibility = (content) => {
    // Simulación - en implementación real verificaría alt text, captions, etc.
    return Math.random() * 0.4 + 0.6; // 60-100%
  };

  // Calcular score general de marca
  const calculateOverallBrandScore = (categoryScores) => {
    const criteria = brandConsistencyEngine.checkingCriteria;
    let weightedSum = 0;
    let totalWeight = 0;

    Object.entries(categoryScores).forEach(([category, score]) => {
      const weight = criteria[category]?.weight || 20;
      weightedSum += score * weight;
      totalWeight += weight;
    });

    return totalWeight > 0 ? weightedSum / totalWeight : 0;
  };

  // Determinar nivel de cumplimiento
  const determineBrandComplianceLevel = (score) => {
    if (score >= 90) return 'excellent';
    if (score >= 80) return 'good';
    if (score >= 70) return 'acceptable';
    if (score >= 60) return 'needs_improvement';
    return 'poor';
  };

  // Generar reporte de consistencia de marca
  const generateBrandConsistencyReport = (contentList) => {
    const analyses = contentList.map(content => checkBrandConsistency(content));

    const report = {
      totalContent: analyses.length,
      averageScore: analyses.reduce((sum, a) => sum + a.overallScore, 0) / analyses.length,
      complianceLevels: {
        excellent: analyses.filter(a => a.complianceLevel === 'excellent').length,
        good: analyses.filter(a => a.complianceLevel === 'good').length,
        acceptable: analyses.filter(a => a.complianceLevel === 'acceptable').length,
        needs_improvement: analyses.filter(a => a.complianceLevel === 'needs_improvement').length,
        poor: analyses.filter(a => a.complianceLevel === 'poor').length
      },
      commonViolations: identifyCommonViolations(analyses),
      recommendations: generateBrandRecommendations(analyses),
      generatedAt: new Date()
    };

    return report;
  };

  // Identificar violaciones comunes
  const identifyCommonViolations = (analyses) => {
    const violationCounts = {};

    analyses.forEach(analysis => {
      analysis.violations.forEach(violation => {
        violationCounts[violation.type] = (violationCounts[violation.type] || 0) + 1;
      });
    });

    return Object.entries(violationCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([type, count]) => ({ type, count, percentage: (count / analyses.length) * 100 }));
  };

  // Generar recomendaciones de marca
  const generateBrandRecommendations = (analyses) => {
    const recommendations = [];

    // Analizar patrones en las violaciones
    const lowScoreCategories = {};
    analyses.forEach(analysis => {
      Object.entries(analysis.categoryScores).forEach(([category, score]) => {
        if (score < 70) {
          lowScoreCategories[category] = (lowScoreCategories[category] || 0) + 1;
        }
      });
    });

    // Generar recomendaciones basadas en patrones
    Object.entries(lowScoreCategories).forEach(([category, count]) => {
      if (count > analyses.length * 0.3) { // Si más del 30% tiene problemas
        recommendations.push({
          category: category,
          priority: 'high',
          message: `Mejorar consistencia en ${category} - afecta al ${((count / analyses.length) * 100).toFixed(1)}% del contenido`,
          action: getRecommendationAction(category)
        });
      }
    });

    return recommendations;
  };

  const getRecommendationAction = (category) => {
    const actions = {
      voice_consistency: 'Revisar y actualizar guías de tono y voz de marca',
      visual_consistency: 'Crear templates visuales con elementos de marca',
      message_alignment: 'Reforzar training sobre pilares de mensaje',
      hashtag_compliance: 'Actualizar estrategia de hashtags y crear listas',
      platform_compliance: 'Revisar mejores prácticas por plataforma'
    };

    return actions[category] || 'Revisar y mejorar procesos de creación de contenido';
  };

  // Inicializar brand consistency checker
  const initializeBrandConsistencyChecker = () => {
    console.log('Inicializando Brand Consistency Checker...');

    const guidelines = brandConsistencyEngine.brandGuidelines;
    console.log(`Pilares de mensaje: ${guidelines.content.messaging_pillars.join(', ')}`);
    console.log(`Tono de marca: ${guidelines.voice.tone}`);

    return {
      ready: true,
      checkingCategories: Object.keys(brandConsistencyEngine.checkingCriteria).length,
      messagingPillars: guidelines.content.messaging_pillars.length,
      brandedHashtags: guidelines.content.hashtag_strategy.branded_hashtags.length
    };
  };

  // Mock data para recordatorios de marketing
  const mockScheduledPosts = [
    {
      id: 1,
      title: "🏋️ Subir rutina matutina - TikTok",
      content: "Recordatorio: Subir video de rutina de ejercicios matutina",
      description: "Video ya grabado: POV ejercicio 6AM. Usar hashtags fitness + morning routine",
      platform: 'tiktok',
      niche: 'fitness',
      scheduledDate: new Date(2024, 10, 8, 19, 0), // Horario óptimo Ecuador
      status: 'pending',
      priority: 'high',
      reminder: '30 minutos antes',
      notes: 'Horario óptimo para Ecuador. Engagement alto en este horario.',
      country: 'Ecuador'
    },
    {
      id: 2,
      title: "🥤 Publicar receta smoothie - Instagram",
      content: "Recordatorio: Subir carousel de smoothie proteico",
      description: "Fotos listas + receta completa. Usar hashtags healthy + protein",
      platform: 'instagram',
      niche: 'food',
      scheduledDate: new Date(2024, 10, 9, 12, 30), // Horario almuerzo
      status: 'pending',
      priority: 'medium',
      reminder: '15 minutos antes',
      notes: 'Horario de almuerzo - ideal para contenido de comida',
      country: 'Colombia'
    },
    {
      id: 3,
      title: "👗 Outfit transition - TikTok",
      content: "Recordatorio: Ya subido ayer - revisar métricas",
      description: "Video de transición casual a elegante",
      platform: 'tiktok',
      niche: 'fashion',
      scheduledDate: new Date(2024, 10, 7, 18, 0),
      status: 'completed',
      priority: 'low',
      reminder: 'ninguno',
      notes: 'Completado - buen engagement obtenido',
      country: 'México',
      actualResults: 'Alcance: 32K, Engagement: 12.5%'
    },
    {
      id: 4,
      title: "📱 Tech tips iPhone - YouTube Shorts",
      content: "Recordatorio: Subir tutorial de funciones ocultas",
      description: "Video grabado: 5 trucos iPhone que pocos conocen",
      platform: 'youtube',
      niche: 'tech',
      scheduledDate: new Date(2024, 10, 10, 20, 0), // Horario nocturno
      status: 'pending',
      priority: 'high',
      reminder: '1 hora antes',
      notes: 'Horario óptimo México - audiencia tech activa en noche',
      country: 'México'
    },
    {
      id: 5,
      title: "🍺 Micheladas weekend - Instagram Stories",
      content: "Recordatorio: Subir stories de micheladas para fin de semana",
      description: "Fotos del proceso + video corto. Promoción weekend",
      platform: 'instagram',
      niche: 'food',
      scheduledDate: new Date(2024, 10, 11, 17, 0), // Viernes tarde
      status: 'pending',
      priority: 'medium',
      reminder: '30 minutos antes',
      notes: 'Viernes tarde - perfecto para contenido de bebidas weekend',
      country: 'Ecuador'
    }
  ];

  useEffect(() => {
    // Combinar datos mock con recordatorios reales
    const combinedPosts = [...mockScheduledPosts, ...scheduledReminders];
    setScheduledPosts(combinedPosts);
  }, [scheduledReminders]);

  const platforms = [
    { id: 'all', name: 'Todas', icon: '🌐', color: 'gray' },
    { id: 'tiktok', name: 'TikTok', logo: TikTokLogo, color: 'pink' }, // TikTok - Rosa/Negro
    { id: 'instagram', name: 'Instagram', logo: InstagramLogo, color: 'purple' }, // Instagram - Gradiente morado/rosa/naranja
    { id: 'youtube', name: 'YouTube', logo: YouTubeLogo, color: 'red' }, // YouTube - Rojo oficial
    { id: 'facebook', name: 'Facebook', logo: FacebookLogo, color: 'blue' }, // Facebook - Azul oficial
    { id: 'linkedin', name: 'LinkedIn', logo: LinkedInLogo, color: 'indigo' } // LinkedIn - Azul profesional más oscuro
  ];


  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'text-blue-400 bg-blue-400/20';
      case 'reminder': return 'text-yellow-400 bg-yellow-400/20';
      case 'completed': return 'text-green-400 bg-green-400/20';
      case 'missed': return 'text-red-400 bg-red-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  const getPlatformColor = (platform) => {
    const colors = {
      tiktok: 'from-black via-red-500 to-pink-500', // Colores oficiales de TikTok
      instagram: 'from-purple-600 via-pink-500 to-orange-400', // Gradiente oficial de Instagram
      youtube: 'from-red-600 to-red-500', // Rojo oficial de YouTube
      facebook: 'from-blue-600 to-blue-500', // Azul oficial de Facebook
      linkedin: 'from-blue-700 to-blue-600' // Azul profesional de LinkedIn
    };
    return colors[platform] || 'from-gray-500 to-gray-600';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      high: 'border-l-4 border-red-400 shadow-lg shadow-red-500/30',
      medium: 'border-l-4 border-yellow-400 shadow-lg shadow-yellow-500/30',
      low: 'border-l-4 border-green-400 shadow-lg shadow-green-500/30'
    };
    return colors[priority] || 'border-l-4 border-gray-400 shadow-lg shadow-gray-500/30';
  };

  const getPriorityIcon = (priority) => {
    const icons = {
      high: '🔴',
      medium: '🟡',
      low: '🟢'
    };
    return icons[priority] || '⚪';
  };

  const getPlatformLogo = (platform) => {
    const logos = {
      tiktok: TikTokLogo,
      instagram: InstagramLogo,
      youtube: YouTubeLogo,
      facebook: FacebookLogo,
      linkedin: LinkedInLogo
    };
    return logos[platform] || null;
  };

  const filteredPosts = scheduledPosts.filter(post => {
    return (filters.platform === 'all' || post.platform === filters.platform) &&
      (filters.status === 'all' || post.status === filters.status) &&
      (filters.niche === 'all' || post.niche === filters.niche);
  });

  const getPostsForDate = (date) => {
    return filteredPosts.filter(post => {
      const postDate = new Date(post.scheduledDate);
      return postDate.toDateString() === date.toDateString();
    });
  };

  const generateCalendarDays = () => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days = [];
    const current = new Date(startDate);

    for (let i = 0; i < 42; i++) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }

    return days;
  };


  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className={`text-2xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>📅 Calendario & Analytics de Contenidos</h2>
          <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Programa tus publicaciones y mide el rendimiento de cada post en un solo lugar.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className={`flex rounded-lg p-1 ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}>
            {['calendar', 'horarios'].map(mode => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${viewMode === mode
                  ? 'bg-white text-blue-600 shadow-sm dark:bg-gray-700 dark:text-white'
                  : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
                  }`}
              >
                {mode === 'calendar' && <Calendar className="w-4 h-4 mr-2 inline" />}
                {mode === 'horarios' && <Globe className="w-4 h-4 mr-2 inline" />}
                {mode === 'calendar' && 'Calendario'}
                {mode === 'horarios' && 'Horarios Óptimos'}
              </button>
            ))}
          </div>
          <motion.button
            onClick={() => {
              console.log('Botón Nuevo Recordatorio clickeado!');
              if (onNavigateToCreate) {
                onNavigateToCreate();
              } else {
                // Fallback simple alert or log if logic is missing in parent
                // alert("Funcionalidad de crear recordatorio en desarrollo");
              }
            }}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:shadow-lg transition-all font-medium"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Plus className="w-4 h-4" />
            Nuevo Recordatorio
          </motion.button>
        </div>
      </div>

      {/* Filtros */}
      <div className={`rounded-xl p-4 border ${theme === 'dark' ? 'bg-[#0b0c10]/50 border-gray-800' : 'bg-white border-gray-200 shadow-sm'}`}>
        <div className="flex flex-wrap gap-4">
          <div className="min-w-[200px]">
            <label className={`block text-xs font-medium mb-1.5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Plataforma</label>
            <div className="relative">
              <select
                value={filters.platform}
                onChange={(e) => setFilters(prev => ({ ...prev, platform: e.target.value }))}
                className={`w-full appearance-none rounded-lg px-3 py-2 text-sm border focus:ring-2 focus:ring-blue-500 outline-none transition-colors ${theme === 'dark'
                  ? 'bg-gray-900 border-gray-700 text-white'
                  : 'bg-gray-50 border-gray-200 text-gray-900'
                  }`}
              >
                {platforms.map(platform => (
                  <option key={platform.id} value={platform.id}>
                    {platform.name}
                  </option>
                ))}
              </select>
              <Filter className="w-4 h-4 absolute right-3 top-2.5 text-gray-400 pointer-events-none" />
            </div>
          </div>
          <div className="min-w-[200px]">
            <label className={`block text-xs font-medium mb-1.5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Estado</label>
            <div className="relative">
              <select
                value={filters.status}
                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                className={`w-full appearance-none rounded-lg px-3 py-2 text-sm border focus:ring-2 focus:ring-blue-500 outline-none transition-colors ${theme === 'dark'
                  ? 'bg-gray-900 border-gray-700 text-white'
                  : 'bg-gray-50 border-gray-200 text-gray-900'
                  }`}
              >
                <option value="all">Todos</option>
                <option value="pending">Pendientes</option>
                <option value="reminder">Con Recordatorio</option>
                <option value="completed">Completados</option>
                <option value="missed">Perdidos</option>
              </select>
              <Filter className="w-4 h-4 absolute right-3 top-2.5 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* Vista Calendario 10/10 */}
      {viewMode === 'calendar' && (
        <>
          {/* Botones de Control Calendar 10/10 */}
          <div className="flex items-center gap-3 mb-6">
            <button
              onClick={() => setShowPerformanceView(!showPerformanceView)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${showPerformanceView
                ? 'bg-purple-500 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
            >
              <BarChart3 className="w-4 h-4" />
              Rendimiento
            </button>

            <button
              onClick={() => setShowBulkUpload(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all"
            >
              <Upload className="w-4 h-4" />
              Importar CSV
            </button>

            <button
              onClick={() => setShowTemplateLibrary(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-lg transition-all"
            >
              <Calendar className="w-4 h-4" />
              Plantillas
            </button>
          </div>

          {/* Vista Condicional: Performance o Calendar */}
          {showPerformanceView ? (
            <PerformanceDashboard
              posts={scheduledPosts}
              scheduledReminders={scheduledReminders}
            />
          ) : (
            <CalendarView
              posts={scheduledPosts}
              onPostMove={handlePostMove}
              onPostClick={handlePostClick}
              onDateSelect={(date) => setSelectedDate(date)}
            />
          )}
        </>
      )}
      {/* Vista Lista */}
      {viewMode === 'list' && (
        <div className="space-y-4">
          {filteredPosts.map(post => (
            <motion.div
              key={post.id}
              className={`rounded-xl p-6 border transition-all cursor-pointer ${theme === 'dark'
                ? 'bg-[#0b0c10]/50 border-gray-800 hover:border-gray-700 hover:bg-gray-800/50'
                : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-md'
                }`}
              whileHover={{ scale: 1.005 }}
              onClick={() => setSelectedPost(post)}
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-r ${getPlatformColor(post.platform)} flex items-center justify-center shadow-lg`}>
                      <span className="text-white font-bold">
                        {post.platform.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <h3 className={`font-semibold text-lg ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{post.title}</h3>
                      <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                        {post.scheduledDate.toLocaleDateString()} a las {post.scheduledDate.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                  <p className={`mb-4 leading-relaxed ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>{post.content}</p>

                  <div className="flex flex-wrap items-center gap-4 text-sm">
                    <span className={`px-2.5 py-1 rounded-full font-medium text-xs ${getStatusColor(post.status)}`}>
                      {post.status}
                    </span>
                    <span className={`flex items-center gap-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                      <Target className="w-4 h-4" />
                      {post.estimatedReach?.toLocaleString()} alcance
                    </span>
                    <span className={`flex items-center gap-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                      <TrendingUp className="w-4 h-4" />
                      {post.viralScore}% viral
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start">
                  <button className={`p-2 rounded-lg transition-colors ${theme === 'dark' ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'}`}>
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button className={`p-2 rounded-lg transition-colors ${theme === 'dark' ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'}`}>
                    <Copy className="w-4 h-4" />
                  </button>
                  <button className="p-2 hover:bg-red-500/10 text-red-400 hover:text-red-500 rounded-lg transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Vista Analytics */}
      {viewMode === 'analytics' && (() => {
        const analytics = getCalendarAnalytics();
        return (
          <div className="space-y-6">
            {/* KPIs principales */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className={`rounded-xl p-6 border ${theme === 'dark' ? 'bg-[#0b0c10]/50 border-gray-800' : 'bg-white border-gray-200 shadow-sm'}`}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Posts Programados</h3>
                  <Calendar className="w-5 h-5 text-blue-500" />
                </div>
                <div className={`text-3xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {analytics.totalScheduled}
                </div>
                <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} text-sm`}>Pendientes o programados</p>
              </div>

              <div className={`rounded-xl p-6 border ${theme === 'dark' ? 'bg-[#0b0c10]/50 border-gray-800' : 'bg-white border-gray-200 shadow-sm'}`}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Alcance Total</h3>
                  <Users className="w-5 h-5 text-green-500" />
                </div>
                <div className={`text-3xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {analytics.totalReach.toLocaleString()}
                </div>
                <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} text-sm`}>Suma de reach real o estimado</p>
              </div>

              <div className={`rounded-xl p-6 border ${theme === 'dark' ? 'bg-[#0b0c10]/50 border-gray-800' : 'bg-white border-gray-200 shadow-sm'}`}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Engagement Promedio</h3>
                  <BarChart3 className="w-5 h-5 text-yellow-500" />
                </div>
                <div className={`text-3xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {analytics.avgEngagementRate.toFixed(1)}%
                </div>
                <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} text-sm`}>(likes + comments + shares + saves) / reach</p>
              </div>

              <div className={`rounded-xl p-6 border ${theme === 'dark' ? 'bg-[#0b0c10]/50 border-gray-800' : 'bg-white border-gray-200 shadow-sm'}`}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>CTR Promedio</h3>
                  <Zap className="w-5 h-5 text-purple-500" />
                </div>
                <div className={`text-3xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {analytics.avgCtr.toFixed(1)}%
                </div>
                <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} text-sm`}>clicks / reach</p>
              </div>
            </div>

            {/* Bloque secundario: crecimiento y éxito */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className={`rounded-xl p-6 border ${theme === 'dark' ? 'bg-[#0b0c10]/50 border-gray-800' : 'bg-white border-gray-200 shadow-sm'}`}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Crecimiento Seguidores</h3>
                  <Users className="w-5 h-5 text-blue-500" />
                </div>
                <div className={`text-3xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {analytics.followerGrowth >= 0 ? `+${analytics.followerGrowth}` : analytics.followerGrowth}
                </div>
                <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} text-sm`}>Suma de (después - antes) por post</p>
              </div>

              <div className={`rounded-xl p-6 border ${theme === 'dark' ? 'bg-[#0b0c10]/50 border-gray-800' : 'bg-white border-gray-200 shadow-sm'}`}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Tasa de Éxito</h3>
                  <CheckCircle className="w-5 h-5 text-green-500" />
                </div>
                <div className={`text-3xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {analytics.successRate.toFixed(1)}%
                </div>
                <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} text-sm`}>Posts marcados como publicados</p>
              </div>

              <div className={`rounded-xl p-6 border ${theme === 'dark' ? 'bg-[#0b0c10]/50 border-gray-800' : 'bg-white border-gray-200 shadow-sm'}`}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Score Viral Promedio</h3>
                  <TrendingUp className="w-5 h-5 text-yellow-500" />
                </div>
                <div className={`text-3xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {analytics.avgViralScore.toFixed(0)}%
                </div>
                <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} text-sm`}>Basado en el score viral de cada post</p>
              </div>
            </div>

            {/* Mejores posts */}
            <div className={`rounded-xl p-6 border ${theme === 'dark' ? 'bg-[#0b0c10]/50 border-gray-800' : 'bg-white border-gray-200 shadow-sm'}`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Mejores Posts por Engagement</h3>
                <BarChart3 className={`w-5 h-5 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`} />
              </div>

              {(!analytics.topPosts || analytics.topPosts.length === 0) && (
                <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} text-sm`}>Aún no hay suficientes datos para calcular mejores posts. Registra métricas en tus publicaciones.</p>
              )}

              {analytics.topPosts && analytics.topPosts.length > 0 && (
                <div className="space-y-3">
                  {analytics.topPosts.map((post) => (
                    <div
                      key={post.id}
                      className={`flex items-center justify-between rounded-lg p-3 cursor-pointer border ${theme === 'dark' ? 'bg-gray-800/60 border-transparent hover:bg-gray-800' : 'bg-gray-50 border-gray-100 hover:bg-white hover:shadow-sm'}`}
                      onClick={() => setSelectedPost(post)}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${getPlatformColor(post.platform)} flex items-center justify-center shadow-sm`}>
                          <span className="text-white text-xs font-bold">
                            {post.platform?.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <div className={`text-sm font-semibold truncate max-w-[220px] ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                            {post.title}
                          </div>
                          <div className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                            {new Date(post.scheduledDate).toLocaleDateString('es-ES')} · {(getPostEngagementRate(post) * 100).toFixed(1)}% ER
                          </div>
                        </div>
                      </div>
                      <div className={`text-right text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                        <div>
                          Alcance: {(post.reach || post.estimatedReach || 0).toLocaleString()}
                        </div>
                        <div>
                          Interacciones: {(post.likes || 0) + (post.comments || 0) + (post.shares || 0) + (post.saves || 0)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Botón para pedir recomendaciones a la IA */}
              <div className="mt-8 flex items-center justify-between gap-4 flex-wrap border-t pt-6 dark:border-gray-800 border-gray-100">
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                  Usa la IA de Predix para analizar estos resultados y proponer tu próximo plan de contenidos.
                </p>
                <button
                  disabled={aiLoading || !analytics.topPosts || analytics.topPosts.length === 0}
                  onClick={async () => {
                    setAiError(null);
                    setAiLoading(true);
                    try {
                      const data = { analytics, topPosts: analytics.topPosts };
                      const result = await getCalendarRecommendations(data, countryData?.name || 'México');

                      if (!result.success) {
                        setAiError(result.error || 'No se pudo obtener recomendaciones de la IA');
                        setAiRecommendations(result.fallbackResponse || '');
                      } else {
                        setAiRecommendations(result.response || '');
                      }
                    } catch (error) {
                      console.error('Error obteniendo recomendaciones del calendario:', error);
                      setAiError('Error inesperado al llamar a la IA');
                    } finally {
                      setAiLoading(false);
                    }
                  }}
                  className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all shadow-sm ${aiLoading || !analytics.topPosts || analytics.topPosts.length === 0
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-800 dark:text-gray-600'
                    : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-md hover:scale-[1.02]'
                    }`}
                >
                  {aiLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Analizando...</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4" />
                      <span>Pedir plan a la IA</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Recomendaciones de IA basadas en el calendario */}
            {(aiRecommendations || aiError) && (
              <div className={`rounded-xl p-6 border space-y-4 ${theme === 'dark'
                ? 'bg-gray-900/60 border-blue-500/20'
                : 'bg-blue-50/50 border-blue-200'
                }`}>
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div>
                    <h3 className={`font-semibold mb-1 flex items-center gap-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      <Sparkles className="w-4 h-4 text-blue-500" />
                      Recomendaciones de la IA para tu calendario
                    </h3>
                    <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      Usa estas ideas como base para tus próximos posts. Puedes copiarlas o crear nuevos recordatorios desde aquí.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {onNavigateToCreate && (
                      <button
                        onClick={() => onNavigateToCreate()}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-600 hover:bg-blue-500 text-white transition-colors shadow-sm"
                      >
                        Crear nuevo recordatorio
                      </button>
                    )}
                    {aiRecommendations && (
                      <button
                        onClick={async () => {
                          try {
                            await navigator.clipboard.writeText(aiRecommendations);
                          } catch (err) {
                            console.error('No se pudo copiar al portapapeles', err);
                          }
                        }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${theme === 'dark'
                          ? 'bg-gray-800 hover:bg-gray-700 text-gray-200 border-gray-700'
                          : 'bg-white hover:bg-gray-50 text-gray-700 border-gray-200 shadow-sm'
                          }`}
                      >
                        Copiar recomendaciones
                      </button>
                    )}
                  </div>
                </div>

                {aiError && (
                  <p className="text-sm text-red-500 font-medium">
                    {aiError}
                  </p>
                )}

                {aiRecommendations && (
                  <div className="prose prose-invert max-w-none text-sm">
                    <div
                      className={`whitespace-pre-wrap break-words text-xs rounded-lg p-4 border overflow-x-auto ${theme === 'dark'
                        ? 'text-gray-200 bg-gray-950/60 border-gray-800'
                        : 'text-gray-800 bg-white border-gray-200 shadow-sm'
                        }`}
                      dangerouslySetInnerHTML={{ __html: formatAiMarkdown(aiRecommendations) }}
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })()}


      {/* Vista Horarios Óptimos */}
      {viewMode === 'horarios' && (
        <div className="space-y-6">
          <div className={`rounded-xl p-6 border ${theme === 'dark' ? 'bg-[#0b0c10]/50 border-gray-800' : 'bg-white border-gray-200 shadow-sm'}`}>
            <h3 className={`text-xl font-bold mb-6 flex items-center gap-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              {getCountrySchedules().flag} Horarios Óptimos para {getCountrySchedules().name}
              <span className={`text-sm font-normal ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>({getCountrySchedules().timezone})</span>
            </h3>

            {/* Horarios por Red Social */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* YouTube */}
              <div className={`rounded-lg p-4 border ${theme === 'dark' ? 'bg-gradient-to-br from-red-500/10 to-red-600/10 border-red-500/20' : 'bg-red-50 border-red-100'}`}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center shadow-sm">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>YouTube</h4>
                    <p className="text-red-500 text-xs font-medium">Videos largos</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="text-center">
                    <div className="text-red-500 font-bold">{getCountrySchedules().morning}</div>
                    <div className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} text-xs`}>Tutoriales</div>
                  </div>
                  <div className="text-center">
                    <div className="text-red-500 font-bold">{getCountrySchedules().afternoon}</div>
                    <div className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} text-xs`}>Reviews</div>
                  </div>
                  <div className="text-center">
                    <div className="text-red-500 font-bold">{getCountrySchedules().evening}</div>
                    <div className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} text-xs`}>Entretenimiento</div>
                  </div>
                </div>
                <div className={`mt-3 p-2 rounded text-center ${theme === 'dark' ? 'bg-red-500/10' : 'bg-white border border-red-100'}`}>
                  <div className="text-red-500 text-sm font-bold">⭐ Peak: {getCountrySchedules().peak}</div>
                </div>
              </div>

              {/* Instagram */}
              <div className={`rounded-lg p-4 border ${theme === 'dark' ? 'bg-gradient-to-br from-pink-500/10 to-purple-500/10 border-pink-500/20' : 'bg-pink-50 border-pink-100'}`}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-purple-500 rounded-lg flex items-center justify-center shadow-sm">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Instagram</h4>
                    <p className="text-pink-500 text-xs font-medium">Reels & Stories</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="text-center">
                    <div className="text-pink-500 font-bold">{getCountrySchedules().morning}</div>
                    <div className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} text-xs`}>Stories</div>
                  </div>
                  <div className="text-center">
                    <div className="text-pink-500 font-bold">{getCountrySchedules().afternoon}</div>
                    <div className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} text-xs`}>Reels</div>
                  </div>
                  <div className="text-center">
                    <div className="text-pink-500 font-bold">{getCountrySchedules().evening}</div>
                    <div className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} text-xs`}>Posts</div>
                  </div>
                </div>
                <div className={`mt-3 p-2 rounded text-center ${theme === 'dark' ? 'bg-pink-500/10' : 'bg-white border border-pink-100'}`}>
                  <div className="text-pink-500 text-sm font-bold">⭐ Peak: {getCountrySchedules().peak}</div>
                </div>
              </div>

              {/* Facebook */}
              <div className={`rounded-lg p-4 border ${theme === 'dark' ? 'bg-gradient-to-br from-blue-600/10 to-blue-700/10 border-blue-600/20' : 'bg-blue-50 border-blue-100'}`}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-sm">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Facebook</h4>
                    <p className="text-blue-500 text-xs font-medium">Posts & Videos</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="text-center">
                    <div className="text-blue-500 font-bold">{getCountrySchedules().morning}</div>
                    <div className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} text-xs`}>Noticias</div>
                  </div>
                  <div className="text-center">
                    <div className="text-blue-500 font-bold">{getCountrySchedules().afternoon}</div>
                    <div className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} text-xs`}>Videos</div>
                  </div>
                  <div className="text-center">
                    <div className="text-blue-500 font-bold">{getCountrySchedules().evening}</div>
                    <div className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} text-xs`}>Engagement</div>
                  </div>
                </div>
                <div className={`mt-3 p-2 rounded text-center ${theme === 'dark' ? 'bg-blue-600/10' : 'bg-white border border-blue-100'}`}>
                  <div className="text-blue-500 text-sm font-bold">⭐ Peak: {getCountrySchedules().peak}</div>
                </div>
              </div>

              {/* TikTok */}
              <div className={`rounded-lg p-4 border ${theme === 'dark' ? 'bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-600/20' : 'bg-gray-100 border-gray-200'}`}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center shadow-sm">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-.88-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43V7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.43z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-black'}`}>TikTok</h4>
                    <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} text-xs`}>Videos cortos</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="text-center">
                    <div className={`${theme === 'dark' ? 'text-white' : 'text-gray-900'} font-bold`}>{getCountrySchedules().morning}</div>
                    <div className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} text-xs`}>Trends</div>
                  </div>
                  <div className="text-center">
                    <div className={`${theme === 'dark' ? 'text-white' : 'text-gray-900'} font-bold`}>{getCountrySchedules().afternoon}</div>
                    <div className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} text-xs`}>Challenges</div>
                  </div>
                  <div className="text-center">
                    <div className={`${theme === 'dark' ? 'text-white' : 'text-gray-900'} font-bold`}>{getCountrySchedules().evening}</div>
                    <div className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} text-xs`}>Viral</div>
                  </div>
                </div>
                <div className={`mt-3 p-2 rounded text-center ${theme === 'dark' ? 'bg-gray-700/30' : 'bg-white border border-gray-200'}`}>
                  <div className={`${theme === 'dark' ? 'text-white' : 'text-gray-900'} text-sm font-bold`}>⭐ Peak: {getCountrySchedules().peak}</div>
                </div>
              </div>
            </div>

          </div>

          {/* Recomendaciones por tipo de contenido específicas del país */}
          <div className={`rounded-xl p-6 border ${theme === 'dark' ? 'bg-[#0b0c10]/50 border-gray-800' : 'bg-white border-gray-200 shadow-sm'}`}>
            <h3 className={`text-xl font-bold mb-6 flex items-center gap-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              📊 Horarios por Tipo de Contenido en {getCountrySchedules().name}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {/* Comida & Cocina */}
              <div className={`rounded-lg p-4 transition-colors hover:shadow-md ${theme === 'dark' ? 'bg-gray-800/50 hover:bg-gray-800' : 'bg-gray-50 border border-gray-100 hover:bg-white hover:border-gray-200'}`}>
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-xl">🍳</span>
                  <h4 className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Comida & Cocina</h4>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Desayuno</span>
                    <span className="text-blue-500 font-medium">{getCountrySchedules().morning}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Almuerzo</span>
                    <span className="text-green-500 font-medium">{getCountrySchedules().afternoon}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Cena</span>
                    <span className="text-purple-500 font-medium">{getCountrySchedules().evening}</span>
                  </div>
                </div>
              </div>

              {/* Fitness & Salud */}
              <div className={`rounded-lg p-4 transition-colors hover:shadow-md ${theme === 'dark' ? 'bg-gray-800/50 hover:bg-gray-800' : 'bg-gray-50 border border-gray-100 hover:bg-white hover:border-gray-200'}`}>
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-xl">💪</span>
                  <h4 className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Fitness & Salud</h4>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Rutina Mañana</span>
                    <span className="text-blue-500 font-medium">{getCountrySchedules().morning}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Motivación</span>
                    <span className="text-yellow-500 font-medium">{getCountrySchedules().afternoon}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Rutina Noche</span>
                    <span className="text-purple-500 font-medium">{getCountrySchedules().evening}</span>
                  </div>
                </div>
              </div>

              {/* Fashion & Belleza */}
              <div className={`rounded-lg p-4 transition-colors hover:shadow-md ${theme === 'dark' ? 'bg-gray-800/50 hover:bg-gray-800' : 'bg-gray-50 border border-gray-100 hover:bg-white hover:border-gray-200'}`}>
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-xl">👗</span>
                  <h4 className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Fashion & Belleza</h4>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Outfit del Día</span>
                    <span className="text-blue-500 font-medium">{getCountrySchedules().morning}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Looks Noche</span>
                    <span className="text-purple-500 font-medium">{getCountrySchedules().evening}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Looks Fin de Semana</span>
                    <span className="text-green-500 font-medium">Sábados 17:00</span>
                  </div>
                </div>
              </div>

              {/* Tecnología & Gaming */}
              <div className={`rounded-lg p-4 transition-colors hover:shadow-md ${theme === 'dark' ? 'bg-gray-800/50 hover:bg-gray-800' : 'bg-gray-50 border border-gray-100 hover:bg-white hover:border-gray-200'}`}>
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-xl">📱</span>
                  <h4 className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Tecnología & Gaming</h4>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Tips Matutinos</span>
                    <span className="text-blue-500 font-medium">{getCountrySchedules().morning}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Tutoriales</span>
                    <span className="text-yellow-500 font-medium">{getCountrySchedules().afternoon}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Reviews</span>
                    <span className="text-purple-500 font-medium">{getCountrySchedules().evening}</span>
                  </div>
                </div>
              </div>

              {/* Música & Arte */}
              <div className={`rounded-lg p-4 transition-colors hover:shadow-md ${theme === 'dark' ? 'bg-gray-800/50 hover:bg-gray-800' : 'bg-gray-50 border border-gray-100 hover:bg-white hover:border-gray-200'}`}>
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-xl">🎵</span>
                  <h4 className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Música & Arte</h4>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Versiones</span>
                    <span className="text-blue-500 font-medium">{getCountrySchedules().morning}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Originales</span>
                    <span className="text-yellow-500 font-medium">{getCountrySchedules().afternoon}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>En Vivo</span>
                    <span className="text-purple-500 font-medium">{getCountrySchedules().evening}</span>
                  </div>
                </div>
              </div>

              {/* Viajes & Estilo de Vida */}
              <div className={`rounded-lg p-4 transition-colors hover:shadow-md ${theme === 'dark' ? 'bg-gray-800/50 hover:bg-gray-800' : 'bg-gray-50 border border-gray-100 hover:bg-white hover:border-gray-200'}`}>
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-xl">✈️</span>
                  <h4 className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Viajes & Estilo de Vida</h4>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Destinos</span>
                    <span className="text-blue-500 font-medium">{getCountrySchedules().morning}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Experiencias</span>
                    <span className="text-yellow-500 font-medium">{getCountrySchedules().afternoon}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Tips de Viaje</span>
                    <span className="text-purple-500 font-medium">{getCountrySchedules().evening}</span>
                  </div>
                </div>
              </div>

              {/* Educación & Tutoriales */}
              <div className={`rounded-lg p-4 transition-colors hover:shadow-md ${theme === 'dark' ? 'bg-gray-800/50 hover:bg-gray-800' : 'bg-gray-50 border border-gray-100 hover:bg-white hover:border-gray-200'}`}>
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-xl">📚</span>
                  <h4 className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Educación & Tutoriales</h4>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Lecciones</span>
                    <span className="text-blue-500 font-medium">{getCountrySchedules().morning}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Explicaciones</span>
                    <span className="text-yellow-500 font-medium">{getCountrySchedules().afternoon}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Preguntas y Respuestas</span>
                    <span className="text-purple-500 font-medium">{getCountrySchedules().evening}</span>
                  </div>
                </div>
              </div>

              {/* Entretenimiento & Humor */}
              <div className={`rounded-lg p-4 transition-colors hover:shadow-md ${theme === 'dark' ? 'bg-gray-800/50 hover:bg-gray-800' : 'bg-gray-50 border border-gray-100 hover:bg-white hover:border-gray-200'}`}>
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-xl">😂</span>
                  <h4 className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Entretenimiento & Humor</h4>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Memes</span>
                    <span className="text-blue-500 font-medium">{getCountrySchedules().morning}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Parodias</span>
                    <span className="text-yellow-500 font-medium">{getCountrySchedules().afternoon}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Reacciones</span>
                    <span className="text-purple-500 font-medium">{getCountrySchedules().evening}</span>
                  </div>
                </div>
              </div>

              {/* Negocios & Finanzas */}
              <div className={`rounded-lg p-4 transition-colors hover:shadow-md ${theme === 'dark' ? 'bg-gray-800/50 hover:bg-gray-800' : 'bg-gray-50 border border-gray-100 hover:bg-white hover:border-gray-200'}`}>
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-xl">💼</span>
                  <h4 className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Negocios & Finanzas</h4>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Tips Financieros</span>
                    <span className="text-blue-500 font-medium">{getCountrySchedules().morning}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Inversiones</span>
                    <span className="text-yellow-500 font-medium">{getCountrySchedules().afternoon}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Emprendimiento</span>
                    <span className="text-purple-500 font-medium">{getCountrySchedules().evening}</span>
                  </div>
                </div>
              </div>

              {/* Familia & Niños */}
              <div className={`rounded-lg p-4 transition-colors hover:shadow-md ${theme === 'dark' ? 'bg-gray-800/50 hover:bg-gray-800' : 'bg-gray-50 border border-gray-100 hover:bg-white hover:border-gray-200'}`}>
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-xl">👨‍👩‍👧‍👦</span>
                  <h4 className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Familia & Niños</h4>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Actividades</span>
                    <span className="text-blue-500 font-medium">{getCountrySchedules().morning}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Educativo</span>
                    <span className="text-yellow-500 font-medium">{getCountrySchedules().afternoon}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Cuentos</span>
                    <span className="text-purple-500 font-medium">{getCountrySchedules().evening}</span>
                  </div>
                </div>
              </div>

              {/* Deportes & Competencias */}
              <div className={`rounded-lg p-4 transition-colors hover:shadow-md ${theme === 'dark' ? 'bg-gray-800/50 hover:bg-gray-800' : 'bg-gray-50 border border-gray-100 hover:bg-white hover:border-gray-200'}`}>
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-xl">⚽</span>
                  <h4 className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Deportes & Competencias</h4>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Noticias</span>
                    <span className="text-blue-500 font-medium">{getCountrySchedules().morning}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Análisis</span>
                    <span className="text-yellow-500 font-medium">{getCountrySchedules().afternoon}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Mejores Momentos</span>
                    <span className="text-purple-500 font-medium">{getCountrySchedules().evening}</span>
                  </div>
                </div>
              </div>

              {/* Mascotas & Animales */}
              <div className={`rounded-lg p-4 transition-colors hover:shadow-md ${theme === 'dark' ? 'bg-gray-800/50 hover:bg-gray-800' : 'bg-gray-50 border border-gray-100 hover:bg-white hover:border-gray-200'}`}>
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-xl">🐕</span>
                  <h4 className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Mascotas & Animales</h4>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Cuidados</span>
                    <span className="text-blue-500 font-medium">{getCountrySchedules().morning}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Entrenamientos</span>
                    <span className="text-yellow-500 font-medium">{getCountrySchedules().afternoon}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Momentos Cute</span>
                    <span className="text-purple-500 font-medium">{getCountrySchedules().evening}</span>
                  </div>
                </div>
              </div>

              {/* DIY & Manualidades */}
              <div className={`rounded-lg p-4 transition-colors hover:shadow-md ${theme === 'dark' ? 'bg-gray-800/50 hover:bg-gray-800' : 'bg-gray-50 border border-gray-100 hover:bg-white hover:border-gray-200'}`}>
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-xl">🎨</span>
                  <h4 className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>DIY & Manualidades</h4>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Proyectos</span>
                    <span className="text-blue-500 font-medium">{getCountrySchedules().morning}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Tutoriales</span>
                    <span className="text-yellow-500 font-medium">{getCountrySchedules().afternoon}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Resultados</span>
                    <span className="text-purple-500 font-medium">{getCountrySchedules().evening}</span>
                  </div>
                </div>
              </div>

              {/* Motivación & Desarrollo Personal */}
              <div className={`rounded-lg p-4 transition-colors hover:shadow-md ${theme === 'dark' ? 'bg-gray-800/50 hover:bg-gray-800' : 'bg-gray-50 border border-gray-100 hover:bg-white hover:border-gray-200'}`}>
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-xl">🌟</span>
                  <h4 className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Motivación & Desarrollo</h4>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Inspiración</span>
                    <span className="text-blue-500 font-medium">{getCountrySchedules().morning}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Reflexiones</span>
                    <span className="text-yellow-500 font-medium">{getCountrySchedules().afternoon}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Meditación</span>
                    <span className="text-purple-500 font-medium">{getCountrySchedules().evening}</span>
                  </div>
                </div>
              </div>

              {/* Noticias & Actualidad */}
              <div className={`rounded-lg p-4 transition-colors hover:shadow-md ${theme === 'dark' ? 'bg-gray-800/50 hover:bg-gray-800' : 'bg-gray-50 border border-gray-100 hover:bg-white hover:border-gray-200'}`}>
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-xl">📰</span>
                  <h4 className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Noticias & Actualidad</h4>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Noticias de Última Hora</span>
                    <span className="text-blue-500 font-medium">{getCountrySchedules().morning}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Análisis</span>
                    <span className="text-yellow-500 font-medium">{getCountrySchedules().afternoon}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Resúmenes</span>
                    <span className="text-purple-500 font-medium">{getCountrySchedules().evening}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Vista Global - Todos los Países */}
      {viewMode === 'global-schedules' && (
        <div className="space-y-6">
          <div className={`rounded-xl p-6 border ${theme === 'dark' ? 'bg-[#0b0c10]/50 border-gray-800' : 'bg-white border-gray-200 shadow-sm'}`}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className={`text-2xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>🌍 Horarios Óptimos Globales</h3>
                <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Análisis de marketing digital senior - Países optimizados para máximo engagement</p>
              </div>
              <button
                onClick={() => setViewMode('horarios')}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}
              >
                ← Volver
              </button>
            </div>

            {/* Filtros por Red Social */}
            <div className="mb-6">
              <div className="flex flex-wrap gap-2 mb-4">
                {['Todos', 'Instagram', 'Facebook', 'TikTok', 'YouTube'].map(platform => (
                  <button
                    key={platform}
                    className={`px-4 py-2 rounded-lg text-sm transition-colors ${theme === 'dark' ? 'bg-gray-800 hover:bg-gray-700 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}
                  >
                    {platform === 'Instagram' && '📷'}
                    {platform === 'Facebook' && '📘'}
                    {platform === 'TikTok' && '🎵'}
                    {platform === 'YouTube' && '📹'}
                    {platform}
                  </button>
                ))}
              </div>

              <div className="flex flex-wrap gap-2">
                {/* Filtro Especial Países Hispanohablantes */}
                <button className="px-4 py-2 bg-gradient-to-r from-red-600 to-yellow-500 hover:from-red-700 hover:to-yellow-600 text-white rounded-lg text-sm font-semibold transition-colors flex items-center gap-2 shadow-sm">
                  🇪🇸 Países Hispanohablantes (21)
                </button>

                {['América', 'Europa', 'Asia', 'África', 'Oceanía'].map(region => (
                  <button
                    key={region}
                    className={`px-3 py-1 rounded text-xs transition-colors ${theme === 'dark' ? 'bg-gray-700/50 hover:bg-gray-600 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-600'}`}
                  >
                    {region}
                  </button>
                ))}
              </div>
            </div>

            {/* Leyenda de Contenido */}
            <div className={`mb-6 rounded-lg p-4 ${theme === 'dark' ? 'bg-gray-800/30' : 'bg-blue-50/50 border border-blue-100'}`}>
              <h5 className={`font-semibold mb-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>📋 Estrategia por Horario:</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-blue-400 rounded"></span>
                  <span className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>🌅 Mañanas (6:00-12:00): Stories, Stories polls, Behind scenes</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-purple-400 rounded"></span>
                  <span className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>🌆 Tardes (12:00-18:00): Reels, Posts, Carruseles, Videos</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-yellow-400 rounded"></span>
                  <span className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>🌃 Noches (18:00-24:00): Contenido premium, Lives, Engagement</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-green-400 rounded"></span>
                  <span className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>⭐ Peak: Máximo engagement para contenido viral</span>
                </div>
              </div>
            </div>

            {/* Sección Especial: Países Hispanohablantes */}
            <div className={`mb-8 rounded-xl p-6 border ${theme === 'dark' ? 'bg-gradient-to-r from-red-500/10 to-yellow-500/10 border-red-500/20' : 'bg-gradient-to-r from-red-50 to-yellow-50 border-red-100'}`}>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">🇪🇸</span>
                <div>
                  <h4 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>21 Países Hispanohablantes</h4>
                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>559 millones de hablantes • Mercado estratégico global</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                {/* España */}
                <div className={`rounded-lg p-3 border ${theme === 'dark' ? 'bg-gray-800/50 border-red-500/30' : 'bg-white border-red-100 shadow-sm'}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">🇪🇸</span>
                    <div>
                      <h5 className={`text-sm font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>España</h5>
                      <p className="text-xs text-gray-400">47M • Hub Europeo</p>
                    </div>
                  </div>
                  <div className="text-xs space-y-1">
                    <div className="flex justify-between">
                      <span className="text-red-400 font-medium">📷 IG Peak</span>
                      <span className="text-red-400 font-medium">21:30-23:30</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-yellow-500 font-medium">🎵 TT Peak</span>
                      <span className="text-yellow-500 font-medium">20:30-22:30</span>
                    </div>
                  </div>
                </div>

                {/* México */}
                <div className={`rounded-lg p-3 border ${theme === 'dark' ? 'bg-gray-800/50 border-green-500/30' : 'bg-white border-green-100 shadow-sm'}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">🇲🇽</span>
                    <div>
                      <h5 className={`text-sm font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>México</h5>
                      <p className="text-xs text-gray-400">128M • Mercado #1</p>
                    </div>
                  </div>
                  <div className="text-xs space-y-1">
                    <div className="flex justify-between">
                      <span className="text-red-400 font-medium">📷 IG Peak</span>
                      <span className="text-red-400 font-medium">21:00-23:00</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-yellow-500 font-medium">🎵 TT Peak</span>
                      <span className="text-yellow-500 font-medium">22:00-24:00</span>
                    </div>
                  </div>
                </div>

                {/* Colombia */}
                <div className={`rounded-lg p-3 border ${theme === 'dark' ? 'bg-gray-800/50 border-blue-500/30' : 'bg-white border-blue-100 shadow-sm'}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">🇨🇴</span>
                    <div>
                      <h5 className={`text-sm font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Colombia</h5>
                      <p className="text-xs text-gray-400">51M • Hub Sudamericano</p>
                    </div>
                  </div>
                  <div className="text-xs space-y-1">
                    <div className="flex justify-between">
                      <span className="text-red-400 font-medium">📷 IG Peak</span>
                      <span className="text-red-400 font-medium">20:00-22:00</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-yellow-500 font-medium">🎵 TT Peak</span>
                      <span className="text-yellow-500 font-medium">21:00-23:00</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Lista completa de países hispanohablantes */}
              <div className={`rounded-lg p-4 ${theme === 'dark' ? 'bg-gray-900/50' : 'bg-white/50 border border-gray-100'}`}>
                <h5 className={`font-semibold mb-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>📋 Lista Completa de Países Hispanohablantes:</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="font-medium text-red-500 mb-2">🌎 América (19 países):</div>
                    <div className={`space-y-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                      <div>🇲🇽 México (128M) • 🇨🇴 Colombia (51M) • 🇪🇸 España (47M)</div>
                      <div>🇦🇷 Argentina (45M) • 🇵🇪 Perú (33M) • 🇻🇪 Venezuela (28M)</div>
                      <div>🇨🇱 Chile (19M) • 🇪🇨 Ecuador (18M) • 🇬🇹 Guatemala (17M)</div>
                      <div>🇨🇺 Cuba (11M) • 🇧🇴 Bolivia (12M) • 🇩🇴 Rep. Dominicana (11M)</div>
                      <div>🇭🇳 Honduras (10M) • 🇵🇾 Paraguay (7M) • 🇳🇮 Nicaragua (7M)</div>
                      <div>🇸🇻 El Salvador (6M) • 🇨🇷 Costa Rica (5M) • 🇵🇦 Panamá (4M)</div>
                      <div>🇺🇾 Uruguay (3M)</div>
                    </div>
                  </div>
                  <div>
                    <div className="font-medium text-red-500 mb-2">🌍 África (2 países):</div>
                    <div className={`mb-3 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                      <div>🇬🇶 Guinea Ecuatorial (1.4M) • 🇪🇭 Sáhara Occidental (0.6M)</div>
                    </div>

                    <div className={`rounded p-3 mt-3 ${theme === 'dark' ? 'bg-gradient-to-r from-red-500/20 to-yellow-500/20' : 'bg-gradient-to-r from-red-50 to-yellow-50 border border-red-100'}`}>
                      <div className="font-semibold text-yellow-600 dark:text-yellow-400 mb-2">📊 Datos del Mercado Hispano:</div>
                      <div className={`text-xs space-y-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                        <div>• <strong>559 millones</strong> de hablantes nativos</div>
                        <div>• <strong>2do idioma</strong> más hablado del mundo</div>
                        <div>• <strong>$2.8 trillones</strong> PIB combinado</div>
                        <div>• <strong>21 países oficiales</strong> + comunidades globales</div>
                        <div>• <strong>Crecimiento digital</strong> 15% anual</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Grid de Países con Horarios por Red Social */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">

              {/* ESTADOS UNIDOS - Detallado por Red Social */}
              <div className={`rounded-lg p-4 border ${theme === 'dark' ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200 shadow-sm'}`}>
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">🇺🇸</span>
                  <div>
                    <h5 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Estados Unidos</h5>
                    <p className="text-xs text-gray-400">EST/PST • Mercado Principal</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {/* Instagram */}
                  <div className="bg-gradient-to-r from-pink-500/10 to-purple-500/10 rounded p-2">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm">📷</span>
                      <span className="text-xs font-semibold text-pink-400">Instagram</span>
                    </div>
                    <div className="text-xs space-y-1">
                      <div className="flex justify-between">
                        <span className="text-blue-400">🌅 Stories</span>
                        <span className="text-blue-400">08:00-10:00</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-purple-400">🌆 Reels</span>
                        <span className="text-purple-400">15:00-17:00</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-yellow-500">⭐ Peak</span>
                        <span className="text-yellow-500">20:00-22:00</span>
                      </div>
                    </div>
                  </div>

                  {/* TikTok */}
                  <div className="bg-gradient-to-r from-black/20 to-red-500/10 rounded p-2">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm">🎵</span>
                      <span className="text-xs font-semibold text-red-400">TikTok</span>
                    </div>
                    <div className="text-xs space-y-1">
                      <div className="flex justify-between">
                        <span className="text-blue-400">🌅 Trends</span>
                        <span className="text-blue-400">09:00-11:00</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-purple-400">🌆 Videos</span>
                        <span className="text-purple-400">16:00-18:00</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-yellow-500">⭐ Peak</span>
                        <span className="text-yellow-500">19:00-21:00</span>
                      </div>
                    </div>
                  </div>

                  {/* Facebook */}
                  <div className="bg-gradient-to-r from-blue-500/10 to-blue-600/10 rounded p-2">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm">📘</span>
                      <span className="text-xs font-semibold text-blue-400">Facebook</span>
                    </div>
                    <div className="text-xs space-y-1">
                      <div className="flex justify-between">
                        <span className="text-blue-400">🌅 Stories</span>
                        <span className="text-blue-400">07:00-09:00</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-purple-400">🌆 Posts</span>
                        <span className="text-purple-400">13:00-15:00</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-yellow-500">⭐ Peak</span>
                        <span className="text-yellow-500">20:30-22:30</span>
                      </div>
                    </div>
                  </div>

                  {/* YouTube */}
                  <div className="bg-gradient-to-r from-red-500/10 to-red-600/10 rounded p-2">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm">📹</span>
                      <span className="text-xs font-semibold text-red-400">YouTube</span>
                    </div>
                    <div className="text-xs space-y-1">
                      <div className="flex justify-between">
                        <span className="text-blue-400">🌅 Shorts</span>
                        <span className="text-blue-400">10:00-12:00</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-purple-400">🌆 Videos</span>
                        <span className="text-purple-400">14:00-16:00</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-yellow-500">⭐ Peak</span>
                        <span className="text-yellow-500">19:30-21:30</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* CANADÁ - Detallado por Red Social */}
              <div className={`rounded-lg p-4 border ${theme === 'dark' ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200 shadow-sm'}`}>
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">🇨🇦</span>
                  <div>
                    <h5 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Canadá</h5>
                    <p className="text-xs text-gray-400">EST/PST • Mercado Bilingüe</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="bg-gradient-to-r from-pink-500/10 to-purple-500/10 rounded p-2">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs">📷</span>
                      <span className="text-xs font-semibold text-pink-400">Instagram</span>
                    </div>
                    <div className="text-xs space-y-1">
                      <div className="flex justify-between">
                        <span className="text-blue-400">🌅 Stories</span>
                        <span className="text-blue-400">07:30-09:30</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-purple-400">🌆 Reels</span>
                        <span className="text-purple-400">14:30-16:30</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-green-400">⭐ Peak</span>
                        <span className="text-green-400">19:00-21:00</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-black/20 to-red-500/10 rounded p-2">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs">🎵</span>
                      <span className="text-xs font-semibold text-red-400">TikTok</span>
                    </div>
                    <div className="text-xs space-y-1">
                      <div className="flex justify-between">
                        <span className="text-blue-400">🌅 Trends</span>
                        <span className="text-blue-400">08:30-10:30</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-purple-400">🌆 Videos</span>
                        <span className="text-purple-400">15:30-17:30</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-green-400">⭐ Peak</span>
                        <span className="text-green-400">18:30-20:30</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* REINO UNIDO - Detallado por Red Social */}
              <div className={`rounded-lg p-4 border ${theme === 'dark' ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200 shadow-sm'}`}>
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">🇬🇧</span>
                  <div>
                    <h5 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Reino Unido</h5>
                    <p className="text-xs text-gray-400">GMT • Mercado Europeo Clave</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="bg-gradient-to-r from-pink-500/10 to-purple-500/10 rounded p-2">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs">📷</span>
                      <span className="text-xs font-semibold text-pink-400">Instagram</span>
                    </div>
                    <div className="text-xs space-y-1">
                      <div className="flex justify-between">
                        <span className="text-blue-400">🌅 Stories</span>
                        <span className="text-blue-400">08:00-10:00</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-purple-400">🌆 Reels</span>
                        <span className="text-purple-400">17:00-19:00</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-purple-400">⭐ Peak</span>
                        <span className="text-purple-400">20:30-22:30</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-black/20 to-red-500/10 rounded p-2">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs">🎵</span>
                      <span className="text-xs font-semibold text-red-400">TikTok</span>
                    </div>
                    <div className="text-xs space-y-1">
                      <div className="flex justify-between">
                        <span className="text-blue-400">🌅 Trends</span>
                        <span className="text-blue-400">09:00-11:00</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-purple-400">🌆 Videos</span>
                        <span className="text-purple-400">18:00-20:00</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-purple-400">⭐ Peak</span>
                        <span className="text-purple-400">20:00-22:00</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-blue-500/10 to-blue-600/10 rounded p-2">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs">📘</span>
                      <span className="text-xs font-semibold text-blue-400">Facebook</span>
                    </div>
                    <div className="text-xs space-y-1">
                      <div className="flex justify-between">
                        <span className="text-blue-400">🌅 Stories</span>
                        <span className="text-blue-400">07:30-09:30</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-purple-400">🌆 Posts</span>
                        <span className="text-purple-400">13:00-15:00</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-purple-400">⭐ Peak</span>
                        <span className="text-purple-400">21:00-23:00</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-red-500/10 to-red-600/10 rounded p-2">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs">📹</span>
                      <span className="text-xs font-semibold text-red-400">YouTube</span>
                    </div>
                    <div className="text-xs space-y-1">
                      <div className="flex justify-between">
                        <span className="text-blue-400">🌅 Shorts</span>
                        <span className="text-blue-400">10:00-12:00</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-purple-400">🌆 Videos</span>
                        <span className="text-purple-400">16:00-18:00</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-purple-400">⭐ Peak</span>
                        <span className="text-purple-400">19:30-21:30</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className={`rounded-lg p-3 border ${theme === 'dark' ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200 shadow-sm'}`}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">🇫🇷</span>
                  <h5 className={`text-sm font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Francia</h5>
                </div>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Peak</span>
                    <span className="text-yellow-500 font-medium">21:30-23:30</span>
                  </div>
                </div>
              </div>

              <div className={`rounded-lg p-3 border ${theme === 'dark' ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200 shadow-sm'}`}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">🇩🇪</span>
                  <h5 className={`text-sm font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Alemania</h5>
                </div>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Peak</span>
                    <span className="text-red-500 font-medium">20:00-22:00</span>
                  </div>
                </div>
              </div>

              <div className={`rounded-lg p-3 border ${theme === 'dark' ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200 shadow-sm'}`}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">🇯🇵</span>
                  <h5 className={`text-sm font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Japón</h5>
                </div>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Peak</span>
                    <span className="text-pink-500 font-medium">19:00-21:00</span>
                  </div>
                </div>
              </div>

              <div className={`rounded-lg p-3 border ${theme === 'dark' ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200 shadow-sm'}`}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">🇰🇷</span>
                  <h5 className={`text-sm font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Corea del Sur</h5>
                </div>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Peak</span>
                    <span className="text-cyan-500 font-medium">20:00-22:00</span>
                  </div>
                </div>
              </div>

              <div className={`rounded-lg p-3 border ${theme === 'dark' ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200 shadow-sm'}`}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">🇦🇺</span>
                  <h5 className={`text-sm font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Australia</h5>
                </div>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Peak</span>
                    <span className="text-orange-500 font-medium">19:00-21:00</span>
                  </div>
                </div>
              </div>

              {/* AMÉRICA */}
              <div className={`rounded-lg p-3 border ${theme === 'dark' ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200 shadow-sm'}`}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">🇧🇷</span>
                  <h5 className={`text-sm font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Brasil</h5>
                </div>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Peak</span>
                    <span className="text-green-500 font-medium">18:00-20:00</span>
                  </div>
                </div>
              </div>

              <div className={`rounded-lg p-3 border ${theme === 'dark' ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200 shadow-sm'}`}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">🇨🇱</span>
                  <h5 className={`text-sm font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Chile</h5>
                </div>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Peak</span>
                    <span className="text-blue-500 font-medium">19:30-21:30</span>
                  </div>
                </div>
              </div>

              <div className={`rounded-lg p-3 border ${theme === 'dark' ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200 shadow-sm'}`}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">🇵🇪</span>
                  <h5 className={`text-sm font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Perú</h5>
                </div>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Peak</span>
                    <span className="text-yellow-500 font-medium">19:00-21:00</span>
                  </div>
                </div>
              </div>

              <div className={`rounded-lg p-3 border ${theme === 'dark' ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200 shadow-sm'}`}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">🇻🇪</span>
                  <h5 className={`text-sm font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Venezuela</h5>
                </div>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Peak</span>
                    <span className="text-red-500 font-medium">19:00-21:00</span>
                  </div>
                </div>
              </div>

              <div className={`rounded-lg p-3 border ${theme === 'dark' ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200 shadow-sm'}`}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">🇺🇾</span>
                  <h5 className={`text-sm font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Uruguay</h5>
                </div>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Peak</span>
                    <span className="text-cyan-500 font-medium">19:30-21:30</span>
                  </div>
                </div>
              </div>

              {/* EUROPA */}
              <div className={`rounded-lg p-3 border ${theme === 'dark' ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200 shadow-sm'}`}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">🇮🇹</span>
                  <h5 className={`text-sm font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Italia</h5>
                </div>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Peak</span>
                    <span className="text-green-500 font-medium">21:00-23:00</span>
                  </div>
                </div>
              </div>

              <div className={`rounded-lg p-3 border ${theme === 'dark' ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200 shadow-sm'}`}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">🇳🇱</span>
                  <h5 className={`text-sm font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Países Bajos</h5>
                </div>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Peak</span>
                    <span className="text-orange-500 font-medium">20:00-22:00</span>
                  </div>
                </div>
              </div>

              <div className={`rounded-lg p-3 border ${theme === 'dark' ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200 shadow-sm'}`}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">🇸🇪</span>
                  <h5 className={`text-sm font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Suecia</h5>
                </div>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Peak</span>
                    <span className="text-blue-500 font-medium">19:00-21:00</span>
                  </div>
                </div>
              </div>

              <div className={`rounded-lg p-3 border ${theme === 'dark' ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200 shadow-sm'}`}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">🇳🇴</span>
                  <h5 className={`text-sm font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Noruega</h5>
                </div>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Peak</span>
                    <span className="text-purple-500 font-medium">19:30-21:30</span>
                  </div>
                </div>
              </div>

              <div className={`rounded-lg p-3 border ${theme === 'dark' ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200 shadow-sm'}`}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">🇩🇰</span>
                  <h5 className={`text-sm font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Dinamarca</h5>
                </div>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Peak</span>
                    <span className="text-red-500 font-medium">20:00-22:00</span>
                  </div>
                </div>
              </div>

              {/* ASIA */}
              <div className={`rounded-lg p-3 border ${theme === 'dark' ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200 shadow-sm'}`}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">🇨🇳</span>
                  <h5 className={`text-sm font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>China</h5>
                </div>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Peak</span>
                    <span className="text-red-500 font-medium">19:30-21:30</span>
                  </div>
                </div>
              </div>

              <div className={`rounded-lg p-3 border ${theme === 'dark' ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200 shadow-sm'}`}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">🇮🇳</span>
                  <h5 className={`text-sm font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>India</h5>
                </div>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Peak</span>
                    <span className="text-orange-500 font-medium">20:00-22:00</span>
                  </div>
                </div>
              </div>

              <div className={`rounded-lg p-3 border ${theme === 'dark' ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200 shadow-sm'}`}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">🇹🇭</span>
                  <h5 className={`text-sm font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Tailandia</h5>
                </div>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Peak</span>
                    <span className="text-green-500 font-medium">19:00-21:00</span>
                  </div>
                </div>
              </div>

              <div className={`rounded-lg p-3 border ${theme === 'dark' ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200 shadow-sm'}`}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">🇻🇳</span>
                  <h5 className={`text-sm font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Vietnam</h5>
                </div>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Peak</span>
                    <span className="text-blue-500 font-medium">19:30-21:30</span>
                  </div>
                </div>
              </div>

              <div className={`rounded-lg p-3 border ${theme === 'dark' ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200 shadow-sm'}`}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">🇸🇬</span>
                  <h5 className={`text-sm font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Singapur</h5>
                </div>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Peak</span>
                    <span className="text-purple-500 font-medium">20:00-22:00</span>
                  </div>
                </div>
              </div>

              {/* ÁFRICA */}
              <div className={`rounded-lg p-3 border ${theme === 'dark' ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200 shadow-sm'}`}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">🇿🇦</span>
                  <h5 className={`text-sm font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Sudáfrica</h5>
                </div>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Peak</span>
                    <span className="text-yellow-500 font-medium">19:00-21:00</span>
                  </div>
                </div>
              </div>

              <div className={`rounded-lg p-3 border ${theme === 'dark' ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200 shadow-sm'}`}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">🇳🇬</span>
                  <h5 className={`text-sm font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Nigeria</h5>
                </div>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Peak</span>
                    <span className="text-green-500 font-medium">20:00-22:00</span>
                  </div>
                </div>
              </div>

              <div className={`rounded-lg p-3 border ${theme === 'dark' ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200 shadow-sm'}`}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">🇪🇬</span>
                  <h5 className={`text-sm font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Egipto</h5>
                </div>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Peak</span>
                    <span className="text-blue-500 font-medium">21:00-23:00</span>
                  </div>
                </div>
              </div>

              <div className={`rounded-lg p-3 border ${theme === 'dark' ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200 shadow-sm'}`}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">🇰🇪</span>
                  <h5 className={`text-sm font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Kenia</h5>
                </div>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Peak</span>
                    <span className="text-purple-500 font-medium">19:30-21:30</span>
                  </div>
                </div>
              </div>

              {/* MÁS EUROPA */}
              <div className={`rounded-lg p-3 border ${theme === 'dark' ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200 shadow-sm'}`}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">🇷🇺</span>
                  <h5 className={`text-sm font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Rusia</h5>
                </div>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Peak</span>
                    <span className="text-red-500 font-medium">20:00-22:00</span>
                  </div>
                </div>
              </div>

              <div className={`rounded-lg p-3 border ${theme === 'dark' ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200 shadow-sm'}`}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">🇵🇱</span>
                  <h5 className={`text-sm font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Polonia</h5>
                </div>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Peak</span>
                    <span className="text-cyan-500 font-medium">20:30-22:30</span>
                  </div>
                </div>
              </div>

              {/* MÁS ASIA */}
              <div className={`rounded-lg p-3 border ${theme === 'dark' ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200 shadow-sm'}`}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">🇮🇩</span>
                  <h5 className={`text-sm font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Indonesia</h5>
                </div>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Peak</span>
                    <span className="text-orange-500 font-medium">19:00-21:00</span>
                  </div>
                </div>
              </div>

              <div className={`rounded-lg p-3 border ${theme === 'dark' ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200 shadow-sm'}`}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">🇵🇭</span>
                  <h5 className={`text-sm font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Filipinas</h5>
                </div>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Peak</span>
                    <span className="text-pink-500 font-medium">19:30-21:30</span>
                  </div>
                </div>
              </div>

              <div className={`rounded-lg p-3 border ${theme === 'dark' ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200 shadow-sm'}`}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">🇲🇾</span>
                  <h5 className={`text-sm font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Malasia</h5>
                </div>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Peak</span>
                    <span className="text-green-500 font-medium">20:00-22:00</span>
                  </div>
                </div>
              </div>

              {/* OCEANÍA */}
              <div className={`rounded-lg p-3 border ${theme === 'dark' ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200 shadow-sm'}`}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">🇳🇿</span>
                  <h5 className={`text-sm font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Nueva Zelanda</h5>
                </div>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Peak</span>
                    <span className="text-blue-500 font-medium">18:30-20:30</span>
                  </div>
                </div>
              </div>

              {/* RESUMEN GLOBAL POR REDES SOCIALES */}
              <div className="col-span-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg p-6 border border-blue-500/20">
                <h4 className="text-white font-bold text-xl mb-3">🌍 195 Países - Horarios por Red Social</h4>
                <p className="text-gray-300 text-sm mb-6">Estrategia completa: Mañanas para Stories, Tardes para Contenido Premium</p>

                {/* Estrategia por Red Social */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <div className={`rounded-lg p-4 border ${theme === 'dark' ? 'bg-gradient-to-r from-pink-500/20 to-purple-500/20 border-pink-500/30' : 'bg-pink-50 border-pink-200'}`}>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-2xl">📷</span>
                      <h5 className={`${theme === 'dark' ? 'text-pink-400' : 'text-pink-600'} font-bold`}>Instagram</h5>
                    </div>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className={`${theme === 'dark' ? 'text-blue-300' : 'text-blue-600'}`}>🌅 Stories</span>
                        <span className={`${theme === 'dark' ? 'text-blue-300' : 'text-blue-600'}`}>06:00-12:00</span>
                      </div>
                      <div className="flex justify-between">
                        <span className={`${theme === 'dark' ? 'text-purple-300' : 'text-purple-600'}`}>🌆 Reels</span>
                        <span className={`${theme === 'dark' ? 'text-purple-300' : 'text-purple-600'}`}>14:00-18:00</span>
                      </div>
                      <div className="flex justify-between">
                        <span className={`${theme === 'dark' ? 'text-pink-300' : 'text-pink-600'}`}>📸 Posts</span>
                        <span className={`${theme === 'dark' ? 'text-pink-300' : 'text-pink-600'}`}>12:00-16:00</span>
                      </div>
                      <div className="flex justify-between">
                        <span className={`${theme === 'dark' ? 'text-yellow-300' : 'text-yellow-600'}`}>⭐ Peak</span>
                        <span className={`${theme === 'dark' ? 'text-yellow-300' : 'text-yellow-600'}`}>19:00-23:00</span>
                      </div>
                    </div>
                  </div>

                  <div className={`rounded-lg p-4 border ${theme === 'dark' ? 'bg-gradient-to-r from-black/30 to-red-500/20 border-red-500/30' : 'bg-red-50 border-red-200'}`}>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-2xl">🎵</span>
                      <h5 className={`${theme === 'dark' ? 'text-red-400' : 'text-red-600'} font-bold`}>TikTok</h5>
                    </div>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className={`${theme === 'dark' ? 'text-blue-300' : 'text-blue-600'}`}>🌅 Trends</span>
                        <span className={`${theme === 'dark' ? 'text-blue-300' : 'text-blue-600'}`}>07:00-11:00</span>
                      </div>
                      <div className="flex justify-between">
                        <span className={`${theme === 'dark' ? 'text-purple-300' : 'text-purple-600'}`}>🌆 Videos</span>
                        <span className={`${theme === 'dark' ? 'text-purple-300' : 'text-purple-600'}`}>15:00-19:00</span>
                      </div>
                      <div className="flex justify-between">
                        <span className={`${theme === 'dark' ? 'text-red-300' : 'text-red-600'}`}>🎬 Viral</span>
                        <span className={`${theme === 'dark' ? 'text-red-300' : 'text-red-600'}`}>16:00-20:00</span>
                      </div>
                      <div className="flex justify-between">
                        <span className={`${theme === 'dark' ? 'text-yellow-300' : 'text-yellow-600'}`}>⭐ Peak</span>
                        <span className={`${theme === 'dark' ? 'text-yellow-300' : 'text-yellow-600'}`}>18:00-22:00</span>
                      </div>
                    </div>
                  </div>

                  <div className={`rounded-lg p-4 border ${theme === 'dark' ? 'bg-gradient-to-r from-blue-500/20 to-blue-600/20 border-blue-500/30' : 'bg-blue-50 border-blue-200'}`}>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-2xl">📘</span>
                      <h5 className={`${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'} font-bold`}>Facebook</h5>
                    </div>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className={`${theme === 'dark' ? 'text-blue-300' : 'text-blue-600'}`}>🌅 Stories</span>
                        <span className={`${theme === 'dark' ? 'text-blue-300' : 'text-blue-600'}`}>06:30-10:30</span>
                      </div>
                      <div className="flex justify-between">
                        <span className={`${theme === 'dark' ? 'text-purple-300' : 'text-purple-600'}`}>🌆 Posts</span>
                        <span className={`${theme === 'dark' ? 'text-purple-300' : 'text-purple-600'}`}>13:00-17:00</span>
                      </div>
                      <div className="flex justify-between">
                        <span className={`${theme === 'dark' ? 'text-blue-300' : 'text-blue-600'}`}>📄 Articles</span>
                        <span className={`${theme === 'dark' ? 'text-blue-300' : 'text-blue-600'}`}>10:00-14:00</span>
                      </div>
                      <div className="flex justify-between">
                        <span className={`${theme === 'dark' ? 'text-yellow-300' : 'text-yellow-600'}`}>⭐ Peak</span>
                        <span className={`${theme === 'dark' ? 'text-yellow-300' : 'text-yellow-600'}`}>20:00-24:00</span>
                      </div>
                    </div>
                  </div>

                  <div className={`rounded-lg p-4 border ${theme === 'dark' ? 'bg-gradient-to-r from-red-500/20 to-red-600/20 border-red-500/30' : 'bg-red-50 border-red-200'}`}>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-2xl">📹</span>
                      <h5 className={`${theme === 'dark' ? 'text-red-400' : 'text-red-600'} font-bold`}>YouTube</h5>
                    </div>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className={`${theme === 'dark' ? 'text-blue-300' : 'text-blue-600'}`}>🌅 Shorts</span>
                        <span className={`${theme === 'dark' ? 'text-blue-300' : 'text-blue-600'}`}>09:00-13:00</span>
                      </div>
                      <div className="flex justify-between">
                        <span className={`${theme === 'dark' ? 'text-purple-300' : 'text-purple-600'}`}>🌆 Videos</span>
                        <span className={`${theme === 'dark' ? 'text-purple-300' : 'text-purple-600'}`}>14:00-18:00</span>
                      </div>
                      <div className="flex justify-between">
                        <span className={`${theme === 'dark' ? 'text-red-300' : 'text-red-600'}`}>🔴 Lives</span>
                        <span className={`${theme === 'dark' ? 'text-red-300' : 'text-red-600'}`}>19:00-21:00</span>
                      </div>
                      <div className="flex justify-between">
                        <span className={`${theme === 'dark' ? 'text-yellow-300' : 'text-yellow-600'}`}>⭐ Peak</span>
                        <span className={`${theme === 'dark' ? 'text-yellow-300' : 'text-yellow-600'}`}>19:30-21:30</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Lista Completa de 195 Países */}
                <div className={`rounded-lg p-4 mb-4 ${theme === 'dark' ? 'bg-gray-900/50' : 'bg-gray-50 border border-gray-200'}`}>
                  <h5 className={`font-bold mb-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>📋 Lista Completa: 195 Países con Horarios por Red Social</h5>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* AMÉRICAS */}
                    <div className={`rounded-lg p-3 ${theme === 'dark' ? 'bg-gray-800/30' : 'bg-white border border-gray-100 shadow-sm'}`}>
                      <h6 className={`${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'} font-semibold text-sm mb-2`}>🌎 AMÉRICAS (35 países)</h6>
                      <div className={`text-xs space-y-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                        <div className={`font-medium ${theme === 'dark' ? 'text-blue-300' : 'text-blue-700'}`}>América del Norte:</div>
                        <div>🇺🇸 Estados Unidos, 🇨🇦 Canadá, 🇲🇽 México</div>

                        <div className={`font-medium mt-2 ${theme === 'dark' ? 'text-blue-300' : 'text-blue-700'}`}>América Central:</div>
                        <div>🇬🇹 Guatemala, 🇧🇿 Belice, 🇸🇻 El Salvador, 🇭🇳 Honduras, 🇳🇮 Nicaragua, 🇨🇷 Costa Rica, 🇵🇦 Panamá</div>

                        <div className={`font-medium mt-2 ${theme === 'dark' ? 'text-blue-300' : 'text-blue-700'}`}>Caribe:</div>
                        <div>🇨🇺 Cuba, 🇯🇲 Jamaica, 🇭🇹 Haití, 🇩🇴 Rep. Dominicana, 🇵🇷 Puerto Rico, 🇹🇹 Trinidad y Tobago, 🇧🇧 Barbados</div>

                        <div className={`font-medium mt-2 ${theme === 'dark' ? 'text-blue-300' : 'text-blue-700'}`}>América del Sur:</div>
                        <div>🇧🇷 Brasil, 🇦🇷 Argentina, 🇨🇱 Chile, 🇨🇴 Colombia, 🇵🇪 Perú, 🇻🇪 Venezuela, 🇪🇨 Ecuador, 🇧🇴 Bolivia, 🇵🇾 Paraguay, 🇺🇾 Uruguay, 🇬🇾 Guyana, 🇸🇷 Surinam</div>
                      </div>
                    </div>

                    {/* EUROPA */}
                    <div className={`rounded-lg p-3 ${theme === 'dark' ? 'bg-gray-800/30' : 'bg-white border border-gray-100 shadow-sm'}`}>
                      <h6 className={`${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'} font-semibold text-sm mb-2`}>🇪🇺 EUROPA (44 países)</h6>
                      <div className={`text-xs space-y-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                        <div className={`font-medium ${theme === 'dark' ? 'text-purple-300' : 'text-purple-700'}`}>Europa Occidental:</div>
                        <div>🇬🇧 Reino Unido, 🇫🇷 Francia, 🇩🇪 Alemania, 🇪🇸 España, 🇮🇹 Italia, 🇳🇱 Países Bajos, 🇧🇪 Bélgica, 🇨🇭 Suiza, 🇦🇹 Austria, 🇵🇹 Portugal</div>

                        <div className={`font-medium mt-2 ${theme === 'dark' ? 'text-purple-300' : 'text-purple-700'}`}>Europa Nórdica:</div>
                        <div>🇸🇪 Suecia, 🇳🇴 Noruega, 🇩🇰 Dinamarca, 🇫🇮 Finlandia, 🇮🇸 Islandia</div>

                        <div className={`font-medium mt-2 ${theme === 'dark' ? 'text-purple-300' : 'text-purple-700'}`}>Europa Oriental:</div>
                        <div>🇷🇺 Rusia, 🇵🇱 Polonia, 🇨🇿 República Checa, 🇭🇺 Hungría, 🇷🇴 Rumania, 🇧🇬 Bulgaria, 🇺🇦 Ucrania, 🇧🇾 Bielorrusia</div>

                        <div className={`font-medium mt-2 ${theme === 'dark' ? 'text-purple-300' : 'text-purple-700'}`}>Europa del Sur:</div>
                        <div>🇬🇷 Grecia, 🇭🇷 Croacia, 🇷🇸 Serbia, 🇧🇦 Bosnia, 🇲🇰 Macedonia del Norte, 🇦🇱 Albania, 🇲🇪 Montenegro, 🇸🇮 Eslovenia</div>
                      </div>
                    </div>

                    {/* ASIA */}
                    <div className={`rounded-lg p-3 ${theme === 'dark' ? 'bg-gray-800/30' : 'bg-white border border-gray-100 shadow-sm'}`}>
                      <h6 className={`${theme === 'dark' ? 'text-orange-400' : 'text-orange-600'} font-semibold text-sm mb-2`}>🌏 ASIA (48 países)</h6>
                      <div className={`text-xs space-y-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                        <div className={`font-medium ${theme === 'dark' ? 'text-orange-300' : 'text-orange-700'}`}>Asia Oriental:</div>
                        <div>🇨🇳 China, 🇯🇵 Japón, 🇰🇷 Corea del Sur, 🇰🇵 Corea del Norte, 🇲🇳 Mongolia, 🇹🇼 Taiwán</div>

                        <div className={`font-medium mt-2 ${theme === 'dark' ? 'text-orange-300' : 'text-orange-700'}`}>Sudeste Asiático:</div>
                        <div>🇹🇭 Tailandia, 🇻🇳 Vietnam, 🇸🇬 Singapur, 🇲🇾 Malasia, 🇮🇩 Indonesia, 🇵🇭 Filipinas, 🇧🇳 Brunéi, 🇰🇭 Camboya, 🇱🇦 Laos, 🇲🇲 Myanmar</div>

                        <div className={`font-medium mt-2 ${theme === 'dark' ? 'text-orange-300' : 'text-orange-700'}`}>Asia Meridional:</div>
                        <div>🇮🇳 India, 🇵🇰 Pakistán, 🇧🇩 Bangladesh, 🇱🇰 Sri Lanka, 🇳🇵 Nepal, 🇧🇹 Bután, 🇲🇻 Maldivas</div>

                        <div className={`font-medium mt-2 ${theme === 'dark' ? 'text-orange-300' : 'text-orange-700'}`}>Asia Occidental:</div>
                        <div>🇹🇷 Turquía, 🇮🇷 Irán, 🇮🇶 Irak, 🇸🇦 Arabia Saudí, 🇦🇪 EAU, 🇮🇱 Israel, 🇯🇴 Jordania, 🇱🇧 Líbano, 🇸🇾 Siria</div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    {/* ÁFRICA */}
                    <div className={`rounded-lg p-3 ${theme === 'dark' ? 'bg-gray-800/30' : 'bg-white border border-gray-100 shadow-sm'}`}>
                      <h6 className={`${theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'} font-semibold text-sm mb-2`}>🌍 ÁFRICA (54 países)</h6>
                      <div className={`text-xs space-y-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                        <div className={`font-medium ${theme === 'dark' ? 'text-yellow-300' : 'text-yellow-700'}`}>África del Norte:</div>
                        <div>🇪🇬 Egipto, 🇱🇾 Libia, 🇹🇳 Túnez, 🇩🇿 Argelia, 🇲🇦 Marruecos, 🇸🇩 Sudán</div>

                        <div className={`font-medium mt-2 ${theme === 'dark' ? 'text-yellow-300' : 'text-yellow-700'}`}>África Occidental:</div>
                        <div>🇳🇬 Nigeria, 🇬🇭 Ghana, 🇸🇳 Senegal, 🇲🇱 Malí, 🇧🇫 Burkina Faso, 🇨🇮 Costa de Marfil, 🇱🇷 Liberia, 🇸🇱 Sierra Leona</div>

                        <div className={`font-medium mt-2 ${theme === 'dark' ? 'text-yellow-300' : 'text-yellow-700'}`}>África Oriental:</div>
                        <div>🇰🇪 Kenia, 🇹🇿 Tanzania, 🇺🇬 Uganda, 🇪🇹 Etiopía, 🇷🇼 Ruanda, 🇸🇴 Somalia</div>

                        <div className={`font-medium mt-2 ${theme === 'dark' ? 'text-yellow-300' : 'text-yellow-700'}`}>África Austral:</div>
                        <div>🇿🇦 Sudáfrica, 🇧🇼 Botsuana, 🇳🇦 Namibia, 🇿🇼 Zimbabue, 🇿🇲 Zambia, 🇲🇼 Malaui</div>
                      </div>
                    </div>

                    {/* OCEANÍA */}
                    <div className={`rounded-lg p-3 ${theme === 'dark' ? 'bg-gray-800/30' : 'bg-white border border-gray-100 shadow-sm'}`}>
                      <h6 className={`${theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'} font-semibold text-sm mb-2`}>🇦🇺 OCEANÍA (14 países)</h6>
                      <div className={`text-xs space-y-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                        <div className={`font-medium ${theme === 'dark' ? 'text-cyan-300' : 'text-cyan-700'}`}>Principales:</div>
                        <div>🇦🇺 Australia, 🇳🇿 Nueva Zelanda</div>

                        <div className={`font-medium mt-2 ${theme === 'dark' ? 'text-cyan-300' : 'text-cyan-700'}`}>Melanesia:</div>
                        <div>🇵🇬 Papua Nueva Guinea, 🇫🇯 Fiji, 🇸🇧 Islas Salomón, 🇻🇺 Vanuatu</div>

                        <div className={`font-medium mt-2 ${theme === 'dark' ? 'text-cyan-300' : 'text-cyan-700'}`}>Polinesia:</div>
                        <div>🇼🇸 Samoa, 🇹🇴 Tonga, 🇹🇻 Tuvalu, 🇰🇮 Kiribati</div>

                        <div className={`font-medium mt-2 ${theme === 'dark' ? 'text-cyan-300' : 'text-cyan-700'}`}>Micronesia:</div>
                        <div>🇫🇲 Micronesia, 🇲🇭 Islas Marshall, 🇵🇼 Palaos, 🇳🇷 Nauru</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className={`rounded-lg p-3 ${theme === 'dark' ? 'bg-gray-800/30' : 'bg-white border border-gray-100 shadow-sm'}`}>
                    <h5 className={`${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'} font-semibold text-sm mb-2`}>🌎 AMÉRICAS (35)</h5>
                    <div className={`text-xs space-y-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                      <div>Norte: USA, Canadá, México</div>
                      <div>Centro: Guatemala, Costa Rica, Panamá</div>
                      <div>Sur: Brasil, Argentina, Chile, Colombia</div>
                    </div>
                  </div>

                  <div className={`rounded-lg p-3 ${theme === 'dark' ? 'bg-gray-800/30' : 'bg-white border border-gray-100 shadow-sm'}`}>
                    <h5 className={`${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'} font-semibold text-sm mb-2`}>🇪🇺 EUROPA (44)</h5>
                    <div className={`text-xs space-y-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                      <div>Oeste: Francia, España, Reino Unido</div>
                      <div>Norte: Suecia, Noruega, Dinamarca</div>
                      <div>Este: Rusia, Polonia, República Checa</div>
                    </div>
                  </div>

                  <div className={`rounded-lg p-3 ${theme === 'dark' ? 'bg-gray-800/30' : 'bg-white border border-gray-100 shadow-sm'}`}>
                    <h5 className={`${theme === 'dark' ? 'text-orange-400' : 'text-orange-600'} font-semibold text-sm mb-2`}>🌏 ASIA-PACÍFICO (62)</h5>
                    <div className={`text-xs space-y-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                      <div>Este: China, Japón, Corea del Sur</div>
                      <div>Sudeste: Tailandia, Vietnam, Indonesia</div>
                      <div>Sur: India, Singapur, Malasia</div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className={`rounded-lg p-3 ${theme === 'dark' ? 'bg-gray-800/30' : 'bg-white border border-gray-100 shadow-sm'}`}>
                    <h5 className={`${theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'} font-semibold text-sm mb-2`}>🌍 ÁFRICA (54)</h5>
                    <div className={`text-xs ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                      Sudáfrica, Nigeria, Egipto, Kenia, Ghana, Marruecos, Túnez, Etiopía...
                    </div>
                  </div>

                  <div className={`rounded-lg p-3 ${theme === 'dark' ? 'bg-gray-800/30' : 'bg-white border border-gray-100 shadow-sm'}`}>
                    <h5 className={`${theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'} font-semibold text-sm mb-2`}>🇦🇺 OCEANÍA (14)</h5>
                    <div className={`text-xs ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                      Australia, Nueva Zelanda, Fiji, Papua Nueva Guinea, Samoa...
                    </div>
                  </div>
                </div>

                <div className={`mt-4 p-3 rounded-lg border ${theme === 'dark' ? 'bg-gradient-to-r from-green-500/10 to-blue-500/10 border-green-500/20' : 'bg-green-50 border-green-200'}`}>
                  <p className={`${theme === 'dark' ? 'text-green-400' : 'text-green-700'} font-semibold text-sm`}>✅ Base de datos completa con 195 países y horarios óptimos específicos</p>
                  <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} text-xs mt-1`}>Actualizado con patrones de engagement 2024 y análisis de comportamiento de audiencias</p>
                </div>
              </div>
            </div>

            {/* Insights de Marketing Digital Senior */}
            <div className={`mt-8 rounded-xl p-6 border ${theme === 'dark' ? 'bg-gradient-to-r from-blue-900/30 to-purple-900/30 border-blue-500/20' : 'bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200'}`}>
              <h4 className={`text-xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>💡 Insights de Marketing Digital Senior</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <h5 className={`font-semibold ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>🌍 Patrones Globales:</h5>
                  <ul className={`space-y-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                    <li>• América: Peak 19:00-23:00 (horario nocturno)</li>
                    <li>• Europa: Peak 20:00-24:00 (cena y relajación)</li>
                    <li>• Asia: Peak 19:00-22:00 (después del trabajo)</li>
                    <li>• Oceanía: Peak 18:00-21:00 (temprano)</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h5 className={`font-semibold ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'}`}>📊 Estrategias Recomendadas:</h5>
                  <ul className={`space-y-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                    <li>• Contenido global: 20:00-22:00 UTC</li>
                    <li>• Mercados latinos: 21:00-23:00 local</li>
                    <li>• Audiencia europea: 21:30-23:30 CET</li>
                    <li>• Mercado asiático: 19:30-21:30 local</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Calendar 10/10 Modals */}
      <PostPreviewModal
        post={previewPost}
        isOpen={showPreviewModal}
        onClose={() => setShowPreviewModal(false)}
        onEdit={handleEditPost}
        onDelete={handleDeletePost}
        onDuplicate={handleDuplicatePost}
      />

      <BulkUploadModal
        isOpen={showBulkUpload}
        onClose={() => setShowBulkUpload(false)}
        onImport={handleBulkImport}
      />

      <TemplateLibrary
        isOpen={showTemplateLibrary}
        onClose={() => setShowTemplateLibrary(false)}
        onApplyTemplate={handleApplyTemplate}
      />
    </div>
  );
};

export default ContentSchedulerModule;
