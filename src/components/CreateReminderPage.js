import React, { useState, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Clock, 
  ArrowLeft,
  Save,
  Lightbulb,
  Target,
  Bell,
  Globe,
  Zap
} from 'lucide-react';

// Componentes SVG para logos de redes sociales
const TikTokLogo = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-.88-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43V7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.43z"/>
  </svg>
);

const InstagramLogo = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
);

const YouTubeLogo = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

const FacebookLogo = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const LinkedInLogo = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

const CreateReminderPage = ({ onBack, onSave, initialHashtagMix }) => {
  // Estados para el formulario
  const [reminder, setReminder] = useState({
    title: '',
    description: '',
    niche: '',
    scheduledDate: '',
    scheduledTime: '',
    priority: 'medium',
    reminderTime: '30 minutos antes',
    notes: initialHashtagMix || '',
    country: 'Ecuador'
  });

  const [selectedPlatforms, setSelectedPlatforms] = useState([]);
  const [showOptimalTimes, setShowOptimalTimes] = useState(false);

  // Datos estáticos con colores oficiales de las redes sociales
  const platforms = [
    { id: 'tiktok', name: 'TikTok', logo: TikTokLogo, color: 'from-black via-red-500 to-pink-500' }, // Negro, rojo y rosa oficial de TikTok
    { id: 'instagram', name: 'Instagram', logo: InstagramLogo, color: 'from-purple-600 via-pink-500 to-orange-400' }, // Gradiente oficial de Instagram
    { id: 'youtube', name: 'YouTube', logo: YouTubeLogo, color: 'from-red-600 to-red-500' }, // Rojo oficial de YouTube
    { id: 'facebook', name: 'Facebook', logo: FacebookLogo, color: 'from-blue-600 to-blue-500' }, // Azul oficial de Facebook
    { id: 'linkedin', name: 'LinkedIn', logo: LinkedInLogo, color: 'from-blue-700 to-blue-600' } // Azul profesional de LinkedIn
  ];

  const niches = [
    { id: 'fitness', name: 'Fitness', icon: '💪' },
    { id: 'food', name: 'Food', icon: '🍳' },
    { id: 'fashion', name: 'Fashion', icon: '👗' },
    { id: 'tech', name: 'Tech', icon: '📱' },
    { id: 'lifestyle', name: 'Lifestyle', icon: '✨' }
  ];

  // Horarios óptimos memoizados
  const optimalTimesData = useMemo(() => ({
    'Ecuador': {
      'fitness': ['06:00', '07:00', '19:00', '20:00'],
      'food': ['07:00', '12:00', '18:00', '19:00'],
      'fashion': ['08:00', '18:00', '19:00', '20:00'],
      'tech': ['07:00', '15:00', '20:00', '21:00'],
      'lifestyle': ['08:00', '17:00', '19:00', '20:00']
    },
    'Colombia': {
      'fitness': ['06:00', '07:00', '20:00', '21:00'],
      'food': ['07:00', '12:00', '19:00', '20:00'],
      'fashion': ['08:00', '18:00', '20:00', '21:00'],
      'tech': ['07:00', '15:00', '21:00', '22:00'],
      'lifestyle': ['08:00', '18:00', '20:00', '21:00']
    },
    'México': {
      'fitness': ['08:00', '09:00', '21:00', '22:00'],
      'food': ['08:00', '13:00', '20:00', '21:00'],
      'fashion': ['08:00', '19:00', '21:00', '22:00'],
      'tech': ['07:00', '15:00', '22:00', '23:00'],
      'lifestyle': ['08:00', '19:00', '21:00', '22:00']
    }
  }), []);

  // Handlers optimizados
  const handleInputChange = useCallback((field, value) => {
    setReminder(prev => ({ ...prev, [field]: value }));
  }, []);

  const togglePlatform = useCallback((platformId) => {
    setSelectedPlatforms(prev => 
      prev.includes(platformId) 
        ? prev.filter(id => id !== platformId)
        : [...prev, platformId]
    );
  }, []);

  const getOptimalTimes = useCallback((country, niche) => {
    return optimalTimesData[country]?.[niche] || ['19:00', '20:00', '21:00'];
  }, [optimalTimesData]);

  const handleTimeSelect = useCallback((time) => {
    setReminder(prev => ({ ...prev, scheduledTime: time }));
  }, []);

  const handleSave = useCallback(() => {
    // Validación mejorada
    if (!reminder.title.trim()) {
      alert('⚠️ El título es obligatorio');
      return;
    }
    if (selectedPlatforms.length === 0) {
      alert('⚠️ Selecciona al menos una plataforma');
      return;
    }
    if (!reminder.scheduledDate) {
      alert('⚠️ La fecha es obligatoria');
      return;
    }
    if (!reminder.scheduledTime) {
      alert('⚠️ La hora es obligatoria');
      return;
    }

    const newReminder = {
      id: Date.now(),
      title: reminder.title.trim(),
      content: `Recordatorio: ${reminder.description || reminder.title}`,
      description: reminder.description.trim(),
      platform: selectedPlatforms[0], // Plataforma principal
      platforms: selectedPlatforms, // Todas las plataformas seleccionadas
      niche: reminder.niche || 'general',
      scheduledDate: new Date(`${reminder.scheduledDate}T${reminder.scheduledTime}`),
      status: 'pending',
      priority: reminder.priority,
      reminder: reminder.reminderTime,
      notes: reminder.notes.trim(),
      country: reminder.country,
      createdAt: new Date(),
      type: 'user-created', // Para distinguir de los datos mock

      // Métricas básicas de analítica (se pueden editar luego desde el Calendario)
      estimatedReach: 0,      // Alcance estimado inicial
      reach: 0,               // Alcance real cuando el usuario lo registre
      impressions: 0,
      clicks: 0,
      likes: 0,
      comments: 0,
      shares: 0,
      saves: 0,
      followersBefore: null,
      followersAfter: null,
      viralScore: 60          // Valor base razonable para evitar NaN en promedios
    };

    console.log('Guardando recordatorio:', newReminder);
    onSave(newReminder);
  }, [reminder, selectedPlatforms, onSave]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          className="flex items-center gap-4 mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <button
            onClick={onBack}
            className="p-3 bg-gray-800 hover:bg-gray-700 rounded-xl transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-white">📅 Crear Nuevo Recordatorio</h1>
            <p className="text-gray-400">Organiza cuándo subir tu contenido de marketing</p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Formulario Principal */}
          <motion.div
            className="lg:col-span-2 space-y-8"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            {/* Información Básica */}
            <div className="bg-gray-900/50 rounded-2xl p-6 border border-gray-700">
              <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                <Target className="w-5 h-5 text-blue-400" />
                Información Básica
              </h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Título del Recordatorio <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={reminder.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-blue-500 focus:outline-none transition-colors"
                    placeholder="Ej: Subir rutina matutina - TikTok"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Descripción del Contenido
                  </label>
                  <textarea
                    value={reminder.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white h-32 resize-none focus:border-blue-500 focus:outline-none transition-colors"
                    placeholder="Describe qué contenido vas a subir, hashtags a usar, estrategia, etc."
                  />
                </div>
              </div>
            </div>

            {/* Plataformas */}
            <div className="bg-gray-900/50 rounded-2xl p-6 border border-gray-700">
              <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                <Globe className="w-5 h-5 text-green-400" />
                Plataformas <span className="text-red-400">*</span>
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {platforms.map(platform => (
                  <button
                    key={platform.id}
                    onClick={() => togglePlatform(platform.id)}
                    className={`p-4 rounded-xl transition-all flex items-center gap-3 relative overflow-hidden ${
                      selectedPlatforms.includes(platform.id)
                        ? `bg-gradient-to-r ${platform.color} text-white shadow-xl shadow-black/30 scale-105 border-2 border-white/20`
                        : `bg-gradient-to-r ${platform.color} text-white/90 hover:text-white opacity-60 hover:opacity-80 hover:scale-102 border-2 border-transparent`
                    }`}
                  >
                    <div className="relative z-10">
                      <platform.logo size={28} />
                    </div>
                    <span className="font-medium relative z-10">{platform.name}</span>
                    {!selectedPlatforms.includes(platform.id) && (
                      <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]"></div>
                    )}
                  </button>
                ))}
              </div>
              
              {selectedPlatforms.length > 0 && (
                <div className="mt-4 p-3 bg-blue-500/10 rounded-lg">
                  <div className="text-sm text-blue-400">
                    ✓ {selectedPlatforms.length} plataforma(s) seleccionada(s)
                  </div>
                </div>
              )}
            </div>

            {/* Programación */}
            <div className="bg-gray-900/50 rounded-2xl p-6 border border-gray-700">
              <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                <Clock className="w-5 h-5 text-purple-400" />
                Programación
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Nicho</label>
                  <select 
                    value={reminder.niche}
                    onChange={(e) => handleInputChange('niche', e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
                  >
                    <option value="">Seleccionar nicho</option>
                    {niches.map(niche => (
                      <option key={niche.id} value={niche.id}>
                        {niche.icon} {niche.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">País</label>
                  <select 
                    value={reminder.country}
                    onChange={(e) => handleInputChange('country', e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
                  >
                    <option value="Ecuador">🇪🇨 Ecuador</option>
                    <option value="Colombia">🇨🇴 Colombia</option>
                    <option value="México">🇲🇽 México</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Fecha <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="date"
                    value={reminder.scheduledDate}
                    onChange={(e) => handleInputChange('scheduledDate', e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Hora <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="time"
                    value={reminder.scheduledTime}
                    onChange={(e) => handleInputChange('scheduledTime', e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Horarios Óptimos */}
              {reminder.niche && reminder.country && (
                <div className="mt-6 p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl border border-blue-500/20">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-white font-medium flex items-center gap-2">
                      <Zap className="w-4 h-4 text-yellow-400" />
                      Horarios Óptimos para {reminder.country}
                    </h3>
                    <button
                      onClick={() => setShowOptimalTimes(!showOptimalTimes)}
                      className="text-sm text-blue-400 hover:text-blue-300"
                    >
                      {showOptimalTimes ? 'Ocultar' : 'Mostrar'}
                    </button>
                  </div>
                  
                  {showOptimalTimes && (
                    <div className="flex flex-wrap gap-2">
                      {getOptimalTimes(reminder.country, reminder.niche).map(time => (
                        <button
                          key={time}
                          onClick={() => handleTimeSelect(time)}
                          className="px-3 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 rounded-lg text-sm transition-colors"
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>

          {/* Panel Lateral */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            {/* Configuración */}
            <div className="bg-gray-900/50 rounded-2xl p-6 border border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Bell className="w-5 h-5 text-yellow-400" />
                Configuración
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Prioridad</label>
                  <select 
                    value={reminder.priority}
                    onChange={(e) => handleInputChange('priority', e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                  >
                    <option value="low">🟢 Baja</option>
                    <option value="medium">🟡 Media</option>
                    <option value="high">🔴 Alta</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Recordatorio</label>
                  <select 
                    value={reminder.reminderTime}
                    onChange={(e) => handleInputChange('reminderTime', e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                  >
                    <option value="5 minutos antes">5 minutos antes</option>
                    <option value="15 minutos antes">15 minutos antes</option>
                    <option value="30 minutos antes">30 minutos antes</option>
                    <option value="1 hora antes">1 hora antes</option>
                    <option value="2 horas antes">2 horas antes</option>
                    <option value="ninguno">Sin recordatorio</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Notas */}
            <div className="bg-gray-900/50 rounded-2xl p-6 border border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-orange-400" />
                Notas Adicionales
              </h3>
              
              <textarea
                value={reminder.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-white h-24 resize-none focus:border-blue-500 focus:outline-none"
                placeholder="Estrategia, hashtags, ideas..."
              />
            </div>

            {/* Botón Guardar */}
            <button
              onClick={handleSave}
              className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:shadow-lg transition-all font-medium flex items-center justify-center gap-2"
            >
              <Save className="w-5 h-5" />
              Crear Recordatorio
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default CreateReminderPage;
