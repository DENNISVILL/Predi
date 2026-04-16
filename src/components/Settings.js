import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Bell, Shield, Settings as SettingsIcon, Moon, Mail } from 'lucide-react';

const Settings = ({ currentUser }) => {
  const [darkMode, setDarkMode] = useState(true);
  const [notifications, setNotifications] = useState({
    push: true,
    email: false,
    urgent: true
  });
  const [preferences, setPreferences] = useState({
    language: 'es',
    country: 'mx',
    interests: ['entretenimiento', 'tecnologia']
  });

  const countries = [
    { code: 'mx', name: 'México', flag: '🇲🇽' },
    { code: 'us', name: 'Estados Unidos', flag: '🇺🇸' },
    { code: 'es', name: 'España', flag: '🇪🇸' },
    { code: 'ar', name: 'Argentina', flag: '🇦🇷' },
    { code: 'co', name: 'Colombia', flag: '🇨🇴' }
  ];

  const interests = [
    'Entretenimiento', 'Tecnología', 'Moda', 'Gaming', 
    'Fitness', 'Cocina', 'Viajes', 'Educación', 
    'Negocios', 'Arte', 'Música', 'Lifestyle'
  ];

  const plans = [
    {
      name: 'Gratuito',
      price: '$0',
      period: 'siempre',
      features: ['3 predicciones por día', 'Dashboard básico', '1 plataforma', 'Alertas por email'],
      current: true
    },
    {
      name: 'Básico',
      price: '$19',
      period: 'mensual',
      features: ['50 predicciones por día', '3 plataformas', 'Alertas tiempo real', 'Reportes PDF/CSV'],
      current: false
    },
    {
      name: 'Pro',
      price: '$49',
      period: 'mensual',
      features: ['Predicciones ilimitadas', 'Todas las plataformas', 'IA avanzada', 'API básica'],
      current: false,
      popular: true
    },
    {
      name: 'Premium',
      price: '$99',
      period: 'mensual',
      features: ['Todo en Pro +', 'IA personalizada', 'Multi-usuario', 'Soporte 24/7'],
      current: false
    }
  ];

  const handleInterestToggle = (interest) => {
    const isSelected = preferences.interests.includes(interest.toLowerCase());
    const newInterests = isSelected
      ? preferences.interests.filter(i => i !== interest.toLowerCase())
      : [...preferences.interests, interest.toLowerCase()];
    setPreferences({ ...preferences, interests: newInterests });
  };

  return (
    <div className="p-6 min-h-screen">
      {/* Header */}
      <motion.div 
        className="mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-4xl font-bold text-white mb-2">Configuración</h1>
        <p className="text-gray-400 text-lg">Personaliza tu experiencia en Predix</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Settings */}
        <div className="lg:col-span-2 space-y-8">
          {/* Profile */}
          <motion.div 
            className="glass-effect rounded-2xl p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <User className="w-6 h-6 text-[#007bff]" />
              <h2 className="text-xl font-bold text-white">Perfil de Usuario</h2>
            </div>

            <div className="flex items-center gap-6 mb-6">
              <img 
                src={currentUser?.avatar} 
                alt={currentUser?.name}
                className="w-20 h-20 rounded-full"
              />
              <div className="flex-1">
                <input
                  type="text"
                  value={currentUser?.name}
                  className="w-full px-4 py-2 bg-[#1f1f1f] border border-gray-600 rounded-xl text-white focus:border-[#007bff] focus:outline-none transition-all duration-300 mb-2"
                  readOnly
                />
                <input
                  type="email"
                  value={currentUser?.email}
                  className="w-full px-4 py-2 bg-[#1f1f1f] border border-gray-600 rounded-xl text-white focus:border-[#007bff] focus:outline-none transition-all duration-300"
                  readOnly
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">País</label>
                <select 
                  value={preferences.country}
                  onChange={(e) => setPreferences({...preferences, country: e.target.value})}
                  className="w-full px-4 py-2 bg-[#1f1f1f] border border-gray-600 rounded-xl text-white focus:border-[#007bff] focus:outline-none transition-all duration-300"
                >
                  {countries.map(country => (
                    <option key={country.code} value={country.code}>
                      {country.flag} {country.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Idioma</label>
                <select 
                  value={preferences.language}
                  onChange={(e) => setPreferences({...preferences, language: e.target.value})}
                  className="w-full px-4 py-2 bg-[#1f1f1f] border border-gray-600 rounded-xl text-white focus:border-[#007bff] focus:outline-none transition-all duration-300"
                >
                  <option value="es">🇪🇸 Español</option>
                  <option value="en">🇺🇸 English</option>
                  <option value="pt">🇧🇷 Português</option>
                </select>
              </div>
            </div>
          </motion.div>

          {/* Interests */}
          <motion.div 
            className="glass-effect rounded-2xl p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <SettingsIcon className="w-6 h-6 text-[#007bff]" />
              <h2 className="text-xl font-bold text-white">Intereses y Preferencias</h2>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Categorías de tu interés
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {interests.map((interest) => (
                  <motion.button
                    key={interest}
                    onClick={() => handleInterestToggle(interest)}
                    className={`p-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                      preferences.interests.includes(interest.toLowerCase())
                        ? 'bg-gradient-to-r from-[#007bff] to-[#00ff9d] text-white'
                        : 'bg-[#1f1f1f] text-gray-400 hover:text-white hover:bg-[#2a2a2a]'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {interest}
                  </motion.button>
                ))}
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Plataformas principales a monitorear
              </label>
              <div className="flex flex-wrap gap-3">
                {['TikTok', 'Instagram', 'Twitter', 'YouTube'].map((platform) => (
                  <motion.button
                    key={platform}
                    className="px-4 py-2 bg-[#1f1f1f] hover:bg-gradient-to-r hover:from-[#007bff] hover:to-[#00ff9d] text-gray-400 hover:text-white rounded-xl transition-all duration-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {platform}
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Notifications */}
          <motion.div 
            className="glass-effect rounded-2xl p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <Bell className="w-6 h-6 text-[#007bff]" />
              <h2 className="text-xl font-bold text-white">Notificaciones</h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-white font-medium">Notificaciones Push</h3>
                  <p className="text-gray-400 text-sm">Alertas en tiempo real en tu navegador</p>
                </div>
                <motion.button
                  onClick={() => setNotifications({...notifications, push: !notifications.push})}
                  className={`w-12 h-6 rounded-full transition-all duration-300 ${
                    notifications.push ? 'bg-[#00ff9d]' : 'bg-gray-600'
                  }`}
                  whileTap={{ scale: 0.95 }}
                >
                  <motion.div
                    className="w-5 h-5 bg-white rounded-full"
                    animate={{ x: notifications.push ? 26 : 2, y: 2 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                </motion.button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-white font-medium">Email Diario</h3>
                  <p className="text-gray-400 text-sm">Resumen de tendencias por correo</p>
                </div>
                <motion.button
                  onClick={() => setNotifications({...notifications, email: !notifications.email})}
                  className={`w-12 h-6 rounded-full transition-all duration-300 ${
                    notifications.email ? 'bg-[#00ff9d]' : 'bg-gray-600'
                  }`}
                  whileTap={{ scale: 0.95 }}
                >
                  <motion.div
                    className="w-5 h-5 bg-white rounded-full"
                    animate={{ x: notifications.email ? 26 : 2, y: 2 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                </motion.button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-white font-medium">Alertas Urgentes</h3>
                  <p className="text-gray-400 text-sm">Solo tendencias de alto impacto</p>
                </div>
                <motion.button
                  onClick={() => setNotifications({...notifications, urgent: !notifications.urgent})}
                  className={`w-12 h-6 rounded-full transition-all duration-300 ${
                    notifications.urgent ? 'bg-[#00ff9d]' : 'bg-gray-600'
                  }`}
                  whileTap={{ scale: 0.95 }}
                >
                  <motion.div
                    className="w-5 h-5 bg-white rounded-full"
                    animate={{ x: notifications.urgent ? 26 : 2, y: 2 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Appearance */}
          <motion.div 
            className="glass-effect rounded-2xl p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <Moon className="w-6 h-6 text-[#007bff]" />
              <h2 className="text-xl font-bold text-white">Apariencia</h2>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-white font-medium">Modo Oscuro</h3>
                <p className="text-gray-400 text-sm">Interfaz optimizada para poca luz</p>
              </div>
              <motion.button
                onClick={() => setDarkMode(!darkMode)}
                className={`w-12 h-6 rounded-full transition-all duration-300 ${
                  darkMode ? 'bg-[#00ff9d]' : 'bg-gray-600'
                }`}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div
                  className="w-5 h-5 bg-white rounded-full"
                  animate={{ x: darkMode ? 26 : 2, y: 2 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              </motion.button>
            </div>
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Current Plan */}
          <motion.div 
            className="glass-effect rounded-2xl p-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <Shield className="w-6 h-6 text-[#007bff]" />
              <h2 className="text-lg font-bold text-white">Plan Actual</h2>
            </div>

            {plans.map((plan, index) => (
              <motion.div
                key={plan.name}
                className={`p-4 rounded-xl mb-4 ${
                  plan.current 
                    ? 'bg-gradient-to-r from-[#007bff]/20 to-[#00ff9d]/20 border border-[#007bff]/30' 
                    : 'bg-[#1f1f1f] hover:bg-[#2a2a2a]'
                } transition-all duration-300`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-white font-bold">{plan.name}</h3>
                  {plan.current && (
                    <span className="px-2 py-1 bg-[#00ff9d]/20 border border-[#00ff9d]/30 rounded-lg text-[#00ff9d] text-xs font-semibold">
                      Actual
                    </span>
                  )}
                </div>
                
                <div className="mb-3">
                  <span className="text-2xl font-bold text-white">{plan.price}</span>
                  <span className="text-gray-400 text-sm">/{plan.period}</span>
                </div>

                <ul className="space-y-1 mb-4">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="text-gray-300 text-sm flex items-center gap-2">
                      <span className="w-1 h-1 bg-[#00ff9d] rounded-full"></span>
                      {feature}
                    </li>
                  ))}
                </ul>

                {!plan.current && (
                  <motion.button
                    className="w-full py-2 bg-gradient-to-r from-[#007bff] to-[#00ff9d] rounded-xl text-white text-sm font-semibold hover:shadow-lg transition-all duration-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Cambiar Plan
                  </motion.button>
                )}
              </motion.div>
            ))}
          </motion.div>

          {/* Support */}
          <motion.div 
            className="glass-effect rounded-2xl p-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <Mail className="w-6 h-6 text-[#007bff]" />
              <h2 className="text-lg font-bold text-white">Soporte</h2>
            </div>

            <div className="space-y-3">
              <motion.button
                className="w-full p-3 bg-[#1f1f1f] hover:bg-[#2a2a2a] rounded-xl text-left text-white transition-all duration-300"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                📚 Centro de Ayuda
              </motion.button>
              
              <motion.button
                className="w-full p-3 bg-[#1f1f1f] hover:bg-[#2a2a2a] rounded-xl text-left text-white transition-all duration-300"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                💬 Chat en Vivo
              </motion.button>
              
              <motion.button
                className="w-full p-3 bg-[#1f1f1f] hover:bg-[#2a2a2a] rounded-xl text-left text-white transition-all duration-300"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                🐛 Reportar Error
              </motion.button>
            </div>
          </motion.div>

          {/* Save Changes */}
          <motion.button
            className="w-full py-4 bg-gradient-to-r from-[#007bff] to-[#00ff9d] rounded-xl text-white font-semibold hover:shadow-xl transition-all duration-300"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Guardar Cambios
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default Settings;