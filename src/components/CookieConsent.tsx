/**
 * Cookie Consent Banner Component
 * GDPR-compliant cookie consent management
 */
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Cookie, Settings } from 'lucide-react';
import useStore from '../store/useStore';

interface CookieConsent {
    essential: boolean;
    analytics: boolean;
    preferences: boolean;
}

const CookieConsentBanner: React.FC = () => {
    const { theme } = useStore();
    const [showBanner, setShowBanner] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [consent, setConsent] = useState<CookieConsent>({
        essential: true, // Always required
        analytics: false,
        preferences: false,
    });

    useEffect(() => {
        // Check if user has already given consent
        const savedConsent = localStorage.getItem('predix_cookie_consent');
        if (!savedConsent) {
            // Show banner after 1 second delay
            setTimeout(() => setShowBanner(true), 1000);
        }
    }, []);

    const saveConsent = (consentData: CookieConsent) => {
        localStorage.setItem('predix_cookie_consent', JSON.stringify({
            ...consentData,
            timestamp: new Date().toISOString(),
        }));

        // Set individual cookies based on consent
        if (!consentData.analytics) {
            // Remove analytics cookies if declined
            document.cookie = 'predix_analytics=; Max-Age=0; path=/;';
        }

        setShowBanner(false);
        setShowSettings(false);
    };

    const acceptAll = () => {
        const fullConsent = {
            essential: true,
            analytics: true,
            preferences: true,
        };
        saveConsent(fullConsent);
    };

    const acceptEssential = () => {
        saveConsent({
            essential: true,
            analytics: false,
            preferences: false,
        });
    };

    const saveCustom = () => {
        saveConsent(consent);
    };

    if (!showBanner) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 100, opacity: 0 }}
                className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6"
            >
                <div
                    className={`max-w-6xl mx-auto rounded-xl shadow-2xl border ${theme === 'dark'
                            ? 'bg-gray-900 border-gray-700'
                            : 'bg-white border-gray-200'
                        }`}
                >
                    {/* Main Banner */}
                    {!showSettings && (
                        <div className="p-6">
                            <div className="flex items-start gap-4">
                                <Cookie className={`w-8 h-8 flex-shrink-0 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
                                    }`} />

                                <div className="flex-1">
                                    <h3 className={`text-xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'
                                        }`}>
                                        🍪 Usamos Cookies
                                    </h3>

                                    <p className={`text-sm mb-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                                        }`}>
                                        Utilizamos cookies esenciales para que Predix funcione correctamente,
                                        y cookies opcionales para mejorar tu experiencia. Puedes elegir qué
                                        cookies aceptar.{' '}
                                        <a
                                            href="/legal/cookie-policy"
                                            target="_blank"
                                            className={`underline ${theme === 'dark' ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'
                                                }`}
                                        >
                                            Más información
                                        </a>
                                    </p>

                                    <div className="flex flex-wrap gap-3">
                                        <button
                                            onClick={acceptAll}
                                            className={`px-6 py-2.5 rounded-lg font-medium transition-colors ${theme === 'dark'
                                                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                                                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                                                }`}
                                        >
                                            Aceptar Todo
                                        </button>

                                        <button
                                            onClick={acceptEssential}
                                            className={`px-6 py-2.5 rounded-lg font-medium transition-colors ${theme === 'dark'
                                                    ? 'bg-gray-700 hover:bg-gray-600 text-white'
                                                    : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
                                                }`}
                                        >
                                            Solo Esenciales
                                        </button>

                                        <button
                                            onClick={() => setShowSettings(true)}
                                            className={`px-6 py-2.5 rounded-lg font-medium transition-colors flex items-center gap-2 ${theme === 'dark'
                                                    ? 'bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-600'
                                                    : 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-300'
                                                }`}
                                        >
                                            <Settings className="w-4 h-4" />
                                            Personalizar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Settings Panel */}
                    {showSettings && (
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'
                                    }`}>
                                    Preferencias de Cookies
                                </h3>
                                <button
                                    onClick={() => setShowSettings(false)}
                                    className={`p-2 rounded-lg transition-colors ${theme === 'dark'
                                            ? 'hover:bg-gray-800 text-gray-400'
                                            : 'hover:bg-gray-100 text-gray-600'
                                        }`}
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="space-y-4 mb-6">
                                {/* Essential Cookies */}
                                <div className={`p-4 rounded-lg border ${theme === 'dark'
                                        ? 'bg-gray-800 border-gray-700'
                                        : 'bg-gray-50 border-gray-200'
                                    }`}>
                                    <div className="flex items-center justify-between mb-2">
                                        <div>
                                            <h4 className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'
                                                }`}>
                                                Cookies Esenciales
                                            </h4>
                                            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                                                }`}>
                                                Necesarias para el funcionamiento del sitio
                                            </p>
                                        </div>
                                        <div className={`px-3 py-1 rounded text-sm font-medium ${theme === 'dark'
                                                ? 'bg-green-500/20 text-green-400'
                                                : 'bg-green-100 text-green-700'
                                            }`}>
                                            Siempre activas
                                        </div>
                                    </div>
                                </div>

                                {/* Analytics Cookies */}
                                <div className={`p-4 rounded-lg border ${theme === 'dark'
                                        ? 'bg-gray-800 border-gray-700'
                                        : 'bg-gray-50 border-gray-200'
                                    }`}>
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1">
                                            <h4 className={`font-semibold mb-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'
                                                }`}>
                                                Cookies de Análisis
                                            </h4>
                                            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                                                }`}>
                                                Nos ayudan a entender cómo usas Predix
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => setConsent({ ...consent, analytics: !consent.analytics })}
                                            className={`relative w-12 h-6 rounded-full transition-colors ${consent.analytics
                                                    ? 'bg-blue-600'
                                                    : theme === 'dark' ? 'bg-gray-600' : 'bg-gray-300'
                                                }`}
                                        >
                                            <span
                                                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${consent.analytics ? 'translate-x-6' : ''
                                                    }`}
                                            />
                                        </button>
                                    </div>
                                </div>

                                {/* Preference Cookies */}
                                <div className={`p-4 rounded-lg border ${theme === 'dark'
                                        ? 'bg-gray-800 border-gray-700'
                                        : 'bg-gray-50 border-gray-200'
                                    }`}>
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1">
                                            <h4 className={`font-semibold mb-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'
                                                }`}>
                                                Cookies de Preferencias
                                            </h4>
                                            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                                                }`}>
                                                Recuerdan tus configuraciones (tema, idioma)
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => setConsent({ ...consent, preferences: !consent.preferences })}
                                            className={`relative w-12 h-6 rounded-full transition-colors ${consent.preferences
                                                    ? 'bg-blue-600'
                                                    : theme === 'dark' ? 'bg-gray-600' : 'bg-gray-300'
                                                }`}
                                        >
                                            <span
                                                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${consent.preferences ? 'translate-x-6' : ''
                                                    }`}
                                            />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={saveCustom}
                                    className={`flex-1 px-6 py-2.5 rounded-lg font-medium transition-colors ${theme === 'dark'
                                            ? 'bg-blue-600 hover:bg-blue-700 text-white'
                                            : 'bg-blue-600 hover:bg-blue-700 text-white'
                                        }`}
                                >
                                    Guardar Preferencias
                                </button>

                                <button
                                    onClick={() => setShowSettings(false)}
                                    className={`px-6 py-2.5 rounded-lg font-medium transition-colors ${theme === 'dark'
                                            ? 'bg-gray-700 hover:bg-gray-600 text-white'
                                            : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
                                        }`}
                                >
                                    Cancelar
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </motion.div>
        </AnimatePresence>
    );
};

export default CookieConsentBanner;
