import React, { useState, useEffect } from 'react';
import { X, Check, Key, Zap } from 'lucide-react';

const AIConfigModal = ({ isOpen, onClose, onSave, currentProvider, currentKeys }) => {
    const [provider, setProvider] = useState(currentProvider || 'gemini');
    const [apiKey, setApiKey] = useState(currentKeys[currentProvider || 'gemini'] || '');

    useEffect(() => {
        setApiKey(currentKeys[provider] || '');
    }, [provider, currentKeys]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <Zap className="w-5 h-5" /> Configurar Inteligencia Artificial
                        </h2>
                        <button onClick={onClose} className="text-white/80 hover:text-white transition-colors">
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                    <p className="text-blue-100 text-sm mt-2">Conecta tu IA favorita para potenciar Predix</p>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Provider Selector */}
                    <div className="space-y-3">
                        <label className="text-sm font-medium text-gray-400">Proveedor de IA</label>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={() => setProvider('gemini')}
                                className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${provider === 'gemini'
                                    ? 'border-blue-500 bg-blue-500/10 text-white'
                                    : 'border-gray-700 bg-gray-800 text-gray-400 hover:border-gray-600'
                                    }`}
                            >
                                <div className="text-2xl">⚡</div>
                                <span className="font-bold">Google Gemini</span>
                                <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full">Gratis</span>
                            </button>

                            <button
                                onClick={() => setProvider('openai')}
                                className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${provider === 'openai'
                                    ? 'border-green-500 bg-green-500/10 text-white'
                                    : 'border-gray-700 bg-gray-800 text-gray-400 hover:border-gray-600'
                                    }`}
                            >
                                <div className="text-2xl">🤖</div>
                                <span className="font-bold">OpenAI GPT</span>
                                <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-0.5 rounded-full">Requiere Pago</span>
                            </button>
                        </div>
                    </div>

                    {/* API Key Input */}
                    <div className="space-y-3">
                        <label className="text-sm font-medium text-gray-400">
                            {provider === 'gemini' ? 'Estado de Conexión' : 'API Key para OpenAI'}
                        </label>

                        {provider === 'gemini' ? (
                            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
                                    <Check className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-white font-bold text-sm">Predix Pro Activado</h3>
                                    <p className="text-blue-200 text-xs">Tu licencia incluye acceso ilimitado a Gemini AI.</p>
                                </div>
                            </div>
                        ) : (
                            // Input normal para OpenAI
                            <div className="relative">
                                <Key className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                                <input
                                    type="password"
                                    value={apiKey}
                                    onChange={(e) => setApiKey(e.target.value)}
                                    placeholder="Pega tu key de OpenAI aquí..."
                                    className="w-full bg-gray-950 border border-gray-700 text-white rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all font-mono text-sm"
                                />
                            </div>
                        )}

                        {provider === 'openai' && (
                            <a
                                href="https://platform.openai.com/api-keys"
                                target="_blank"
                                rel="noreferrer"
                                className="text-xs text-green-400 hover:text-green-300 flex items-center gap-1 mt-1"
                            >
                                Obtener API Key de OpenAI →
                            </a>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <button
                        onClick={() => onSave(provider, apiKey)}
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold py-3 rounded-xl shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2"
                    >
                        <Check className="w-5 h-5" />
                        Guardar y Conectar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AIConfigModal;
