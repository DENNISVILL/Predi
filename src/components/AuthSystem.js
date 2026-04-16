import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Mail, 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  ArrowLeft, 
  Globe,
  Heart,
  Zap,
  CheckCircle,
  AlertCircle,
  Loader,
  Brain,
  Sparkles
} from 'lucide-react';
import useStore from '../store/useStore';

const AuthSystem = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useStore();
  
  const [currentView, setCurrentView] = useState('login');
  
  // Detectar la vista inicial según la ruta
  useEffect(() => {
    if (location.pathname === '/register') {
      setCurrentView('register');
    } else if (location.pathname === '/login') {
      setCurrentView('login');
    } else if (location.pathname === '/demo') {
      setCurrentView('demo');
    }
  }, [location.pathname]);

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    country: '',
    interests: []
  });

  const countries = [
    '🇲🇽 México', '🇺🇸 Estados Unidos', '🇪🇸 España', '🇦🇷 Argentina',
    '🇨🇴 Colombia', '🇵🇪 Perú', '🇨🇱 Chile', '🇻🇪 Venezuela'
  ];

  const interests = [
    { id: 'marketing', label: 'Marketing Digital', icon: '📱' },
    { id: 'ecommerce', label: 'E-commerce', icon: '🛒' },
    { id: 'social', label: 'Redes Sociales', icon: '📲' },
    { id: 'content', label: 'Creación de Contenido', icon: '🎨' },
    { id: 'analytics', label: 'Analytics', icon: '📊' },
    { id: 'trends', label: 'Análisis de Tendencias', icon: '📈' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      // Simular API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      if (currentView === 'login') {
        // Simular login exitoso
        login({
          name: formData.name || 'Usuario Demo',
          email: formData.email,
          country: formData.country || '🇲🇽 México',
          interests: formData.interests
        });
        navigate('/dashboard');
      } else if (currentView === 'register') {
        // Simular registro exitoso
        login({
          name: formData.name,
          email: formData.email,
          country: formData.country,
          interests: formData.interests
        });
        navigate('/dashboard');
      } else if (currentView === 'forgot') {
        // Simular envío de email
        setCurrentView('login');
        alert('Se ha enviado un email con instrucciones para recuperar tu contraseña');
      }
    } catch (error) {
      setErrors({ general: 'Error en el servidor. Inténtalo de nuevo.' });
    } finally {
      setLoading(false);
    }
  };

  // Manejar demo
  const handleDemo = () => {
    login({
      name: 'Usuario Demo',
      email: 'demo@predix.app',
      country: '🇲🇽 México',
      interests: ['marketing', 'trends']
    });
    navigate('/dashboard');
  };

  const toggleInterest = (interestId) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interestId)
        ? prev.interests.filter(id => id !== interestId)
        : [...prev.interests, interestId]
    }));
  };

  return (
    <div className="min-h-screen bg-[#0b0c10] flex items-center justify-center px-6 py-12 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#007bff]/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#00ff9d]/5 rounded-full blur-3xl"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-[#007bff]/5 via-transparent to-[#00ff9d]/5"></div>
      </div>

      <div className="w-full max-w-lg relative z-10">
        {/* Enhanced Header */}
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div 
            className="flex items-center justify-center gap-3 mb-6"
            whileHover={{ scale: 1.02 }}
          >
            <div className="w-14 h-14 bg-gradient-to-r from-[#007bff] to-[#00ff9d] rounded-2xl flex items-center justify-center shadow-2xl">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <div className="text-4xl font-bold gradient-text">Predix</div>
            <span className="text-xs bg-[#00ff9d]/20 text-[#00ff9d] px-3 py-1 rounded-full border border-[#00ff9d]/30">
              <Sparkles className="w-3 h-3 inline mr-1" />
              AI-Powered
            </span>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <h1 className="text-3xl font-bold text-white mb-3">
              {currentView === 'login' && 'Bienvenido de vuelta'}
              {currentView === 'register' && 'Únete a la revolución predictiva'}
              {currentView === 'forgot' && 'Recupera tu cuenta'}
            </h1>
            <p className="text-gray-400 text-lg">
              {currentView === 'login' && 'Accede a tu dashboard de tendencias predictivas'}
              {currentView === 'register' && 'Comienza a predecir el futuro digital hoy'}
              {currentView === 'forgot' && 'Te ayudamos a recuperar el acceso a tu cuenta'}
            </p>
          </motion.div>
        </motion.div>

        {/* Formulario Principal */}
        <motion.div
          className="glass-effect rounded-3xl p-8 shadow-2xl border border-gray-800/50 backdrop-blur-xl"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <AnimatePresence mode="wait">
            {/* Login Form */}
            {currentView === 'login' && (
              <motion.form
                key="login"
                onSubmit={handleSubmit}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.4 }}
                className="space-y-6"
              >
                <motion.div 
                  className="relative"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <label className="block text-sm font-semibold text-gray-300 mb-3">Email corporativo</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="email"
                      placeholder="tu@empresa.com"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full pl-12 pr-4 py-4 bg-gray-900/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#00ff9d] focus:ring-2 focus:ring-[#00ff9d]/20 transition-all duration-300 backdrop-blur-sm"
                      required
                    />
                  </div>
                </motion.div>
                
                <motion.div 
                  className="relative"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <label className="block text-sm font-semibold text-gray-300 mb-3">Contraseña</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      className="w-full pl-12 pr-12 py-4 bg-gray-900/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#00ff9d] focus:ring-2 focus:ring-[#00ff9d]/20 transition-all duration-300 backdrop-blur-sm"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#00ff9d] transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </motion.div>

                <motion.div 
                  className="flex items-center justify-between"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <label className="flex items-center">
                    <input 
                      type="checkbox" 
                      className="w-4 h-4 rounded border-gray-600 bg-gray-800 text-[#00ff9d] focus:ring-[#00ff9d]/20" 
                    />
                    <span className="ml-3 text-sm text-gray-300">Recordarme</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setCurrentView('forgot')}
                    className="text-sm text-[#00ff9d] hover:text-[#00ff9d]/80 transition-colors font-medium"
                  >
                    ¿Olvidaste tu contraseña?
                  </button>
                </motion.div>

                <motion.button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-[#007bff] to-[#00ff9d] text-white py-4 rounded-xl font-bold text-lg shadow-2xl hover:shadow-[#00ff9d]/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                  whileHover={{ scale: loading ? 1 : 1.02 }}
                  whileTap={{ scale: loading ? 1 : 0.98 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  {loading ? (
                    <>
                      <Loader className="w-5 h-5 animate-spin" />
                      Iniciando sesión...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      Iniciar Sesión
                    </>
                  )}
                </motion.button>

                <motion.div 
                  className="text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <span className="text-gray-400">¿No tienes cuenta? </span>
                  <button
                    type="button"
                    onClick={() => setCurrentView('register')}
                    className="text-[#00ff9d] hover:text-[#00ff9d]/80 transition-colors font-semibold"
                  >
                    Regístrate gratis
                  </button>
                </motion.div>
              </motion.form>
            )}

            {/* Register Form */}
            {currentView === 'register' && (
              <motion.form
                key="register"
                onSubmit={handleSubmit}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
                className="space-y-6"
              >
                <motion.div 
                  className="relative"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <label className="block text-sm font-semibold text-gray-300 mb-3">Nombre completo</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Tu nombre completo"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full pl-12 pr-4 py-4 bg-gray-900/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#00ff9d] focus:ring-2 focus:ring-[#00ff9d]/20 transition-all duration-300 backdrop-blur-sm"
                      required
                    />
                  </div>
                </motion.div>

                <motion.div 
                  className="relative"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <label className="block text-sm font-semibold text-gray-300 mb-3">Email corporativo</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="email"
                      placeholder="tu@empresa.com"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full pl-12 pr-4 py-4 bg-gray-900/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#00ff9d] focus:ring-2 focus:ring-[#00ff9d]/20 transition-all duration-300 backdrop-blur-sm"
                      required
                    />
                  </div>
                </motion.div>

                <motion.div 
                  className="relative"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <label className="block text-sm font-semibold text-gray-300 mb-3">Contraseña</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      className="w-full pl-12 pr-12 py-4 bg-gray-900/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#00ff9d] focus:ring-2 focus:ring-[#00ff9d]/20 transition-all duration-300 backdrop-blur-sm"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#00ff9d] transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </motion.div>

                <motion.button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-[#007bff] to-[#00ff9d] text-white py-4 rounded-xl font-bold text-lg shadow-2xl hover:shadow-[#00ff9d]/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                  whileHover={{ scale: loading ? 1 : 1.02 }}
                  whileTap={{ scale: loading ? 1 : 0.98 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  {loading ? (
                    <>
                      <Loader className="w-5 h-5 animate-spin" />
                      Creando cuenta...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      Crear Cuenta Gratis
                    </>
                  )}
                </motion.button>

                <motion.div 
                  className="text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <span className="text-gray-400">¿Ya tienes cuenta? </span>
                  <button
                    type="button"
                    onClick={() => setCurrentView('login')}
                    className="text-[#00ff9d] hover:text-[#00ff9d]/80 transition-colors font-semibold"
                  >
                    Inicia sesión
                  </button>
                </motion.div>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Demo Button */}
        {currentView === 'login' && (
          <motion.div
            className="mt-8 pt-6 border-t border-gray-700/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <motion.button
              onClick={handleDemo}
              className="w-full border border-gray-600/50 text-gray-300 py-3 rounded-xl font-semibold hover:bg-gray-800/30 hover:border-[#00ff9d]/50 hover:text-white transition-all duration-300 flex items-center justify-center gap-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Zap className="w-5 h-5" />
              Probar Demo Rápido
            </motion.button>
          </motion.div>
        )}

        {/* Back to Landing */}
        <motion.div
          className="mt-6 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <button
            onClick={() => navigate('/')}
            className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 mx-auto text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al inicio
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default AuthSystem;
