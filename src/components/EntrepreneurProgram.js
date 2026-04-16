import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  Users,
  DollarSign,
  Star,
  Gift,
  CheckCircle,
  AlertCircle,
  Instagram,
  Twitter,
  Youtube,
  Linkedin,
  Globe,
  Mail,
  Phone,
  Send,
  Crown,
  Zap,
  Target
} from 'lucide-react';
import usePricingStore from '../store/usePricingStore';

const EntrepreneurProgram = ({ onClose }) => {
  const { applyForEntrepreneurProgram } = usePricingStore();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Información personal
    fullName: '',
    email: '',
    phone: '',
    country: '',
    
    // Redes sociales
    instagram: '',
    twitter: '',
    youtube: '',
    linkedin: '',
    tiktok: '',
    website: '',
    
    // Audiencia
    totalFollowers: '',
    mainPlatform: '',
    niche: '',
    engagementRate: '',
    
    // Experiencia
    contentCreationExperience: '',
    marketingExperience: '',
    affiliateExperience: '',
    
    // Motivación
    whyJoin: '',
    contentStrategy: '',
    expectedReferrals: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const benefits = [
    {
      icon: Gift,
      title: 'Acceso Completo Plan Pro',
      description: 'Valor de $49/mes completamente gratis',
      color: 'text-purple-400'
    },
    {
      icon: DollarSign,
      title: 'Comisión del 30%',
      description: 'Por cada referido que se suscriba',
      color: 'text-green-400'
    },
    {
      icon: Target,
      title: 'Bonus $100',
      description: 'Por cada 10 referidos activos',
      color: 'text-yellow-400'
    },
    {
      icon: Crown,
      title: 'Acceso VIP',
      description: 'Eventos exclusivos y webinars',
      color: 'text-blue-400'
    },
    {
      icon: Zap,
      title: 'Contenido Exclusivo',
      description: 'Material de marketing personalizado',
      color: 'text-orange-400'
    },
    {
      icon: Star,
      title: 'Certificación Oficial',
      description: 'Partner verificado de Predix',
      color: 'text-pink-400'
    }
  ];

  const requirements = [
    'Mínimo 1,000 seguidores en redes sociales',
    'Crear contenido sobre Predix (2 posts por mes)',
    'Generar mínimo 5 referidos en los primeros 3 meses',
    'Mantener engagement activo con la comunidad'
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      const result = await applyForEntrepreneurProgram(formData);
      if (result.success) {
        setSubmitted(true);
      }
    } catch (error) {
      console.error('Error submitting application:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => setStep(prev => Math.min(prev + 1, 4));
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  if (submitted) {
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <motion.div
          className="bg-[#1f1f1f] rounded-2xl p-8 max-w-md w-full text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-green-400" />
          </div>
          
          <h3 className="text-2xl font-bold text-white mb-4">
            ¡Aplicación Enviada!
          </h3>
          
          <p className="text-gray-400 mb-6">
            Hemos recibido tu aplicación para el Programa Emprendedor. 
            Te contactaremos en las próximas 48 horas.
          </p>
          
          <motion.button
            className="w-full bg-gradient-to-r from-[#007bff] to-[#00ff9d] text-white py-3 rounded-xl font-semibold"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClose}
          >
            Cerrar
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <motion.div
        className="bg-[#1f1f1f] rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">
                Programa Emprendedor Predix
              </h2>
              <p className="text-gray-400">
                Únete a nuestro programa de embajadores y gana dinero promocionando Predix
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              ✕
            </button>
          </div>
          
          {/* Progress Bar */}
          <div className="flex items-center mt-6">
            {[1, 2, 3, 4].map((stepNum) => (
              <div key={stepNum} className="flex items-center flex-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                  step >= stepNum 
                    ? 'bg-gradient-to-r from-[#007bff] to-[#00ff9d] text-white' 
                    : 'bg-gray-600 text-gray-400'
                }`}>
                  {stepNum}
                </div>
                {stepNum < 4 && (
                  <div className={`flex-1 h-1 mx-2 ${
                    step > stepNum ? 'bg-gradient-to-r from-[#007bff] to-[#00ff9d]' : 'bg-gray-600'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="p-6">
          {/* Step 1: Beneficios y Requisitos */}
          {step === 1 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-xl font-bold text-white mb-6">Beneficios del Programa</h3>
              
              <div className="grid md:grid-cols-2 gap-4 mb-8">
                {benefits.map((benefit, index) => (
                  <div key={index} className="glass-effect rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center ${benefit.color}`}>
                        <benefit.icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-white mb-1">{benefit.title}</h4>
                        <p className="text-gray-400 text-sm">{benefit.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <h3 className="text-xl font-bold text-white mb-4">Requisitos</h3>
              <div className="space-y-3 mb-8">
                {requirements.map((req, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-300">{req}</span>
                  </div>
                ))}
              </div>

              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 mb-6">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-yellow-400 mb-1">Importante</h4>
                    <p className="text-yellow-300 text-sm">
                      El programa está limitado a 100 embajadores. Las aplicaciones se revisan manualmente 
                      y se aprueban basándose en la calidad del perfil y audiencia.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 2: Información Personal */}
          {step === 2 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-xl font-bold text-white mb-6">Información Personal</h3>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 mb-2">Nombre Completo *</label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    className="w-full bg-gray-800 border border-gray-600 rounded-xl px-4 py-3 text-white focus:border-[#007bff] focus:outline-none"
                    placeholder="Tu nombre completo"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-300 mb-2">Email *</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full bg-gray-800 border border-gray-600 rounded-xl px-4 py-3 text-white focus:border-[#007bff] focus:outline-none"
                    placeholder="tu@email.com"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-300 mb-2">Teléfono</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="w-full bg-gray-800 border border-gray-600 rounded-xl px-4 py-3 text-white focus:border-[#007bff] focus:outline-none"
                    placeholder="+1 234 567 8900"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-300 mb-2">País *</label>
                  <input
                    type="text"
                    value={formData.country}
                    onChange={(e) => handleInputChange('country', e.target.value)}
                    className="w-full bg-gray-800 border border-gray-600 rounded-xl px-4 py-3 text-white focus:border-[#007bff] focus:outline-none"
                    placeholder="Tu país"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 3: Redes Sociales y Audiencia */}
          {step === 3 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-xl font-bold text-white mb-6">Redes Sociales y Audiencia</h3>
              
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-gray-300 mb-2 flex items-center gap-2">
                    <Instagram className="w-4 h-4" />
                    Instagram
                  </label>
                  <input
                    type="url"
                    value={formData.instagram}
                    onChange={(e) => handleInputChange('instagram', e.target.value)}
                    className="w-full bg-gray-800 border border-gray-600 rounded-xl px-4 py-3 text-white focus:border-[#007bff] focus:outline-none"
                    placeholder="https://instagram.com/tuusuario"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-300 mb-2 flex items-center gap-2">
                    <Twitter className="w-4 h-4" />
                    Twitter/X
                  </label>
                  <input
                    type="url"
                    value={formData.twitter}
                    onChange={(e) => handleInputChange('twitter', e.target.value)}
                    className="w-full bg-gray-800 border border-gray-600 rounded-xl px-4 py-3 text-white focus:border-[#007bff] focus:outline-none"
                    placeholder="https://twitter.com/tuusuario"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-300 mb-2 flex items-center gap-2">
                    <Youtube className="w-4 h-4" />
                    YouTube
                  </label>
                  <input
                    type="url"
                    value={formData.youtube}
                    onChange={(e) => handleInputChange('youtube', e.target.value)}
                    className="w-full bg-gray-800 border border-gray-600 rounded-xl px-4 py-3 text-white focus:border-[#007bff] focus:outline-none"
                    placeholder="https://youtube.com/@tucanal"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-300 mb-2">TikTok</label>
                  <input
                    type="url"
                    value={formData.tiktok}
                    onChange={(e) => handleInputChange('tiktok', e.target.value)}
                    className="w-full bg-gray-800 border border-gray-600 rounded-xl px-4 py-3 text-white focus:border-[#007bff] focus:outline-none"
                    placeholder="https://tiktok.com/@tuusuario"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 mb-2">Total de Seguidores *</label>
                  <select
                    value={formData.totalFollowers}
                    onChange={(e) => handleInputChange('totalFollowers', e.target.value)}
                    className="w-full bg-gray-800 border border-gray-600 rounded-xl px-4 py-3 text-white focus:border-[#007bff] focus:outline-none"
                  >
                    <option value="">Selecciona un rango</option>
                    <option value="1k-5k">1K - 5K</option>
                    <option value="5k-10k">5K - 10K</option>
                    <option value="10k-50k">10K - 50K</option>
                    <option value="50k-100k">50K - 100K</option>
                    <option value="100k+">100K+</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-gray-300 mb-2">Plataforma Principal *</label>
                  <select
                    value={formData.mainPlatform}
                    onChange={(e) => handleInputChange('mainPlatform', e.target.value)}
                    className="w-full bg-gray-800 border border-gray-600 rounded-xl px-4 py-3 text-white focus:border-[#007bff] focus:outline-none"
                  >
                    <option value="">Selecciona una plataforma</option>
                    <option value="instagram">Instagram</option>
                    <option value="twitter">Twitter/X</option>
                    <option value="youtube">YouTube</option>
                    <option value="tiktok">TikTok</option>
                    <option value="linkedin">LinkedIn</option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 4: Experiencia y Motivación */}
          {step === 4 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-xl font-bold text-white mb-6">Experiencia y Motivación</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-300 mb-2">¿Por qué quieres unirte al programa? *</label>
                  <textarea
                    value={formData.whyJoin}
                    onChange={(e) => handleInputChange('whyJoin', e.target.value)}
                    rows={4}
                    className="w-full bg-gray-800 border border-gray-600 rounded-xl px-4 py-3 text-white focus:border-[#007bff] focus:outline-none resize-none"
                    placeholder="Cuéntanos tu motivación para ser embajador de Predix..."
                  />
                </div>
                
                <div>
                  <label className="block text-gray-300 mb-2">¿Cómo planeas promocionar Predix? *</label>
                  <textarea
                    value={formData.contentStrategy}
                    onChange={(e) => handleInputChange('contentStrategy', e.target.value)}
                    rows={4}
                    className="w-full bg-gray-800 border border-gray-600 rounded-xl px-4 py-3 text-white focus:border-[#007bff] focus:outline-none resize-none"
                    placeholder="Describe tu estrategia de contenido y promoción..."
                  />
                </div>
                
                <div>
                  <label className="block text-gray-300 mb-2">¿Cuántos referidos esperas generar en 3 meses?</label>
                  <select
                    value={formData.expectedReferrals}
                    onChange={(e) => handleInputChange('expectedReferrals', e.target.value)}
                    className="w-full bg-gray-800 border border-gray-600 rounded-xl px-4 py-3 text-white focus:border-[#007bff] focus:outline-none"
                  >
                    <option value="">Selecciona un rango</option>
                    <option value="5-10">5 - 10 referidos</option>
                    <option value="10-25">10 - 25 referidos</option>
                    <option value="25-50">25 - 50 referidos</option>
                    <option value="50+">50+ referidos</option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t border-gray-700">
            <motion.button
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                step === 1 
                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
                  : 'bg-gray-700 text-white hover:bg-gray-600'
              }`}
              onClick={prevStep}
              disabled={step === 1}
              whileHover={step > 1 ? { scale: 1.02 } : {}}
              whileTap={step > 1 ? { scale: 0.98 } : {}}
            >
              Anterior
            </motion.button>

            {step < 4 ? (
              <motion.button
                className="px-6 py-3 bg-gradient-to-r from-[#007bff] to-[#00ff9d] text-white rounded-xl font-semibold"
                onClick={nextStep}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Siguiente
              </motion.button>
            ) : (
              <motion.button
                className="px-6 py-3 bg-gradient-to-r from-[#007bff] to-[#00ff9d] text-white rounded-xl font-semibold flex items-center gap-2 disabled:opacity-50"
                onClick={handleSubmit}
                disabled={isSubmitting}
                whileHover={!isSubmitting ? { scale: 1.02 } : {}}
                whileTap={!isSubmitting ? { scale: 0.98 } : {}}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Enviar Aplicación
                  </>
                )}
              </motion.button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default EntrepreneurProgram;
