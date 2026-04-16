import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Check } from 'lucide-react';

const OnboardingWizard = ({ onComplete }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [selections, setSelections] = useState({
        businessType: '',
        platforms: [],
        timeAvailable: ''
    });

    const steps = [
        {
            id: 'welcome',
            title: '¡Bienvenido a Predix!',
            subtitle: 'Te ayudaremos a promocionar tu negocio en redes sociales',
            content: (
                <div className="text-center py-12">
                    <div className="text-8xl mb-8">👋</div>
                    <h2 className="text-3xl font-bold text-white mb-4">
                        ¡Hola! Empecemos juntos
                    </h2>
                    <p className="text-xl text-gray-400 max-w-md mx-auto">
                        En 3 simples pasos configuraremos Predix para que sea perfecto para ti.
                        No te preocupes, es muy fácil.
                    </p>
                </div>
            )
        },
        {
            id: 'business',
            title: 'Paso 1 de 3',
            subtitle: '¿Qué tienes o haces?',
            content: (
                <div className="space-y-4">
                    {[
                        { id: 'restaurant', label: 'Un Negocio', desc: 'Restaurante, tienda, cafetería', icon: '🏪' },
                        { id: 'service', label: 'Servicios Profesionales', desc: 'Doctor, abogado, contador, belleza', icon: '💼' },
                        { id: 'entrepreneur', label: 'Un Emprendimiento', desc: 'Vendes cosas por internet', icon: '🚀' },
                        { id: 'content', label: 'Contenido Personal', desc: 'Lifestyle, viajes, hobbies', icon: '✨' }
                    ].map((option) => (
                        <button
                            key={option.id}
                            onClick={() => setSelections({ ...selections, businessType: option.id })}
                            className={`w-full p-6 rounded-xl border-2 transition-all text-left ${selections.businessType === option.id
                                    ? 'bg-cyan-500/20 border-cyan-500 shadow-lg shadow-cyan-500/20'
                                    : 'bg-gray-800/50 border-gray-700 hover:border-gray-600'
                                }`}
                        >
                            <div className="flex items-center gap-4">
                                <span className="text-4xl">{option.icon}</span>
                                <div className="flex-1">
                                    <div className="text-lg font-bold text-white">{option.label}</div>
                                    <div className="text-sm text-gray-400">{option.desc}</div>
                                </div>
                                {selections.businessType === option.id && (
                                    <Check className="w-6 h-6 text-cyan-400" />
                                )}
                            </div>
                        </button>
                    ))}
                </div>
            )
        },
        {
            id: 'platforms',
            title: 'Paso 2 de 3',
            subtitle: '¿Qué redes sociales usas?',
            content: (
                <div>
                    <p className="text-gray-400 mb-6 text-lg">
                        Puedes elegir una o varias. Selecciona todas las que uses.
                    </p>
                    <div className="space-y-4">
                        {[
                            { id: 'facebook', label: 'Facebook', desc: 'Para compartir con amigos y familia', icon: '👥', color: 'blue' },
                            { id: 'instagram', label: 'Instagram', desc: 'Para fotos y videos cortos (Reels)', icon: '📸', color: 'purple' },
                            { id: 'tiktok', label: 'TikTok', desc: 'Para videos divertidos y virales', icon: '🎬', color: 'pink' },
                            { id: 'youtube', label: 'YouTube', desc: 'Para videos largos y Shorts', icon: '📺', color: 'red' }
                        ].map((platform) => {
                            const isSelected = selections.platforms.includes(platform.id);
                            return (
                                <button
                                    key={platform.id}
                                    onClick={() => {
                                        if (isSelected) {
                                            setSelections({
                                                ...selections,
                                                platforms: selections.platforms.filter(p => p !== platform.id)
                                            });
                                        } else {
                                            setSelections({
                                                ...selections,
                                                platforms: [...selections.platforms, platform.id]
                                            });
                                        }
                                    }}
                                    className={`w-full p-6 rounded-xl border-2 transition-all text-left ${isSelected
                                            ? 'bg-cyan-500/20 border-cyan-500 shadow-lg shadow-cyan-500/20'
                                            : 'bg-gray-800/50 border-gray-700 hover:border-gray-600'
                                        }`}
                                >
                                    <div className="flex items-center gap-4">
                                        <span className="text-4xl">{platform.icon}</span>
                                        <div className="flex-1">
                                            <div className="text-lg font-bold text-white">{platform.label}</div>
                                            <div className="text-sm text-gray-400">{platform.desc}</div>
                                        </div>
                                        <div className={`w-6 h-6 rounded border-2 flex items-center justify-center ${isSelected ? 'bg-cyan-500 border-cyan-500' : 'border-gray-600'
                                            }`}>
                                            {isSelected && <Check className="w-4 h-4 text-white" />}
                                        </div>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>
            )
        },
        {
            id: 'complete',
            title: '¡Todo listo!',
            subtitle: 'Configuramos Predix para ti',
            content: (
                <div className="text-center py-12">
                    <div className="text-8xl mb-8">✅</div>
                    <h2 className="text-3xl font-bold text-white mb-6">
                        ¡Perfecto! Ya está todo configurado
                    </h2>
                    <div className="bg-gray-800/50 rounded-xl p-6 mb-8 max-w-md mx-auto">
                        <div className="space-y-3 text-left">
                            <div className="flex items-center gap-3">
                                <Check className="w-5 h-5 text-green-400" />
                                <span className="text-gray-300">
                                    Tipo: <span className="text-white font-medium">{getBusinessTypeLabel()}</span>
                                </span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Check className="w-5 h-5 text-green-400" />
                                <span className="text-gray-300">
                                    Redes: <span className="text-white font-medium">{selections.platforms.join(', ') || 'Todas'}</span>
                                </span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Check className="w-5 h-5 text-green-400" />
                                <span className="text-gray-300">
                                    Ayuda: <span className="text-white font-medium">Siempre disponible 📞</span>
                                </span>
                            </div>
                        </div>
                    </div>
                    <p className="text-gray-400 mb-8">
                        Ahora puedes empezar a crear contenido increíble para tus redes sociales.
                        ¡Es muy fácil!
                    </p>
                </div>
            )
        }
    ];

    const getBusinessTypeLabel = () => {
        const labels = {
            restaurant: 'Negocio',
            service: 'Servicios Profesionales',
            entrepreneur: 'Emprendimiento',
            content: 'Contenido Personal'
        };
        return labels[selections.businessType] || 'No especificado';
    };

    const canGoNext = () => {
        if (currentStep === 0) return true;
        if (currentStep === 1) return selections.businessType !== '';
        if (currentStep === 2) return selections.platforms.length > 0;
        return true;
    };

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            // Guardar configuración
            localStorage.setItem('predix_onboarding', JSON.stringify(selections));
            onComplete && onComplete(selections);
        }
    };

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const currentStepData = steps[currentStep];

    return (
        <div className="fixed inset-0 z-50 bg-gray-900 overflow-y-auto">
            <div className="min-h-screen flex flex-col">
                {/* Header */}
                <div className="bg-gradient-to-r from-cyan-500 to-blue-500 p-6">
                    <div className="max-w-4xl mx-auto">
                        <h1 className="text-2xl font-bold text-white">{currentStepData.title}</h1>
                        <p className="text-cyan-100 mt-1">{currentStepData.subtitle}</p>
                    </div>
                </div>

                {/* Progress Bar */}
                {currentStep > 0 && currentStep < steps.length - 1 && (
                    <div className="bg-gray-800 border-b border-gray-700">
                        <div className="max-w-4xl mx-auto px-6 py-4">
                            <div className="flex gap-2">
                                {[1, 2, 3].map((step) => (
                                    <div
                                        key={step}
                                        className={`flex-1 h-2 rounded-full ${step <= currentStep ? 'bg-cyan-500' : 'bg-gray-700'
                                            }`}
                                    />
                                ))}
                            </div>
                            <p className="text-sm text-gray-400 mt-2">
                                {Math.round(((currentStep) / 3) * 100)}% completado
                            </p>
                        </div>
                    </div>
                )}

                {/* Content */}
                <div className="flex-1 p-6">
                    <div className="max-w-2xl mx-auto">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentStep}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                            >
                                {currentStepData.content}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>

                {/* Footer */}
                <div className="bg-gray-800 border-t border-gray-700 p-6">
                    <div className="max-w-4xl mx-auto flex justify-between items-center">
                        {currentStep > 0 && currentStep < steps.length - 1 ? (
                            <button
                                onClick={handleBack}
                                className="px-6 py-3 text-gray-400 hover:text-white transition-colors"
                            >
                                ← Volver
                            </button>
                        ) : (
                            <div />
                        )}

                        <button
                            onClick={handleNext}
                            disabled={!canGoNext()}
                            className={`px-8 py-4 rounded-lg font-medium flex items-center gap-2 transition-all text-lg ${canGoNext()
                                    ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:shadow-lg hover:shadow-cyan-500/50'
                                    : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                                }`}
                        >
                            {currentStep === steps.length - 1 ? 'Empezar a usar Predix' : 'Siguiente'}
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Help hint */}
                <div className="bg-gray-900 p-4 text-center border-t border-gray-800">
                    <p className="text-gray-500 text-sm">
                        ¿Necesitas ayuda? Llámanos al <span className="text-cyan-400 font-medium">📞 123-456-7890</span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default OnboardingWizard;
