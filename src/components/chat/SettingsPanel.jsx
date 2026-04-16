/**
 * SettingsPanel - AI chat configuration panel
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Settings,
    X,
    Sliders,
    Type,
    Zap,
    Brain
} from 'lucide-react';

const SettingsPanel = ({ isOpen, onClose, settings, onSettingsChange }) => {
    const [localSettings, setLocalSettings] = useState(settings || {
        temperature: 0.7,
        maxTokens: 2000,
        systemPrompt: '',
        model: 'predix-pro',
        streaming: true
    });

    const handleChange = (key, value) => {
        const updated = { ...localSettings, [key]: value };
        setLocalSettings(updated);
        if (onSettingsChange) {
            onSettingsChange(updated);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
                    />

                    {/* Panel */}
                    <motion.div
                        initial={{ x: 400 }}
                        animate={{ x: 0 }}
                        exit={{ x: 400 }}
                        transition={{ type: "spring", damping: 30, stiffness: 300 }}
                        className="fixed right-0 top-0 h-full w-96 bg-[#0f1117] border-l border-white/5 shadow-2xl z-50 flex flex-col"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-white/5 bg-[#13151a]">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-indigo-500/10 rounded-lg">
                                    <Settings className="w-5 h-5 text-indigo-400" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-gray-100">Configuración</h2>
                                    <p className="text-xs text-gray-400">Personaliza tu experiencia IA</p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-white/5 rounded-lg transition-colors text-gray-400 hover:text-white"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
                            {/* Model Selection (Card Style) */}
                            <div className="p-4 rounded-xl bg-[#1e1f20] border border-white/5">
                                <div className="flex items-center gap-2 mb-3">
                                    <Sliders className="w-4 h-4 text-green-400" />
                                    <label className="text-sm font-medium text-gray-200">
                                        Modelo Activo
                                    </label>
                                </div>
                                <select
                                    value={localSettings.model}
                                    onChange={(e) => handleChange('model', e.target.value)}
                                    className="w-full px-4 py-3 bg-[#0f1117] border border-white/10 rounded-xl text-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/30 transition-all appearance-none cursor-pointer hover:border-gray-600 pl-4"
                                >
                                    <option value="predix-pro">Predix Pro (Marketing Viral)</option>
                                    <option value="predix-creative">Predix Creative (Contenido Visual)</option>
                                    <option value="predix-analytics">Predix Analytics (Análisis)</option>
                                </select>
                            </div>

                            {/* Temperature */}
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-2">
                                        <Zap className="w-4 h-4 text-orange-400" />
                                        <label className="text-sm font-medium text-gray-200">
                                            Creatividad
                                        </label>
                                    </div>
                                    <span className="text-xs font-bold px-2 py-1 rounded bg-orange-500/10 text-orange-400 border border-orange-500/20">
                                        {localSettings.temperature.toFixed(1)}
                                    </span>
                                </div>
                                <input
                                    type="range"
                                    min="0"
                                    max="2"
                                    step="0.1"
                                    value={localSettings.temperature}
                                    onChange={(e) => handleChange('temperature', parseFloat(e.target.value))}
                                    className="w-full h-2 bg-[#1e1f20] rounded-lg appearance-none cursor-pointer accent-orange-500"
                                />
                                <div className="flex justify-between mt-2 text-xs text-gray-500 font-medium px-1">
                                    <span>Preciso</span>
                                    <span>Balanceado</span>
                                    <span>Creativo</span>
                                </div>
                            </div>

                            {/* Max Tokens */}
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-2">
                                        <Type className="w-4 h-4 text-blue-400" />
                                        <label className="text-sm font-medium text-gray-200">
                                            Longitud de Respuesta
                                        </label>
                                    </div>
                                    <span className="text-xs font-bold px-2 py-1 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                                        {localSettings.maxTokens} tks
                                    </span>
                                </div>
                                <input
                                    type="range"
                                    min="100"
                                    max="4000"
                                    step="100"
                                    value={localSettings.maxTokens}
                                    onChange={(e) => handleChange('maxTokens', parseInt(e.target.value))}
                                    className="w-full h-2 bg-[#1e1f20] rounded-lg appearance-none cursor-pointer accent-blue-500"
                                />
                                <div className="flex justify-between mt-2 text-xs text-gray-500 font-medium px-1">
                                    <span>Corto</span>
                                    <span>Extenso</span>
                                </div>
                            </div>

                            {/* System Prompt */}
                            <div>
                                <div className="flex items-center gap-2 mb-3">
                                    <Brain className="w-4 h-4 text-purple-400" />
                                    <label className="text-sm font-medium text-gray-200">
                                        Personalidad (Prompt)
                                    </label>
                                </div>
                                <textarea
                                    value={localSettings.systemPrompt}
                                    onChange={(e) => handleChange('systemPrompt', e.target.value)}
                                    placeholder="Define cómo debe comportarse la IA..."
                                    rows={4}
                                    className="w-full px-4 py-3 bg-[#1e1f20] border border-white/10 rounded-xl text-gray-200 text-sm placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500/30 resize-none transition-all"
                                />
                            </div>

                            {/* Streaming Toggle */}
                            <div className="flex items-center justify-between p-4 bg-[#1e1f20] hover:bg-[#2f2f2f] rounded-xl border border-white/5 transition-all cursor-pointer" onClick={() => handleChange('streaming', !localSettings.streaming)}>
                                <div>
                                    <div className="text-sm font-medium text-gray-200 mb-1">
                                        Efecto de Escritura
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        Ver respuesta palabra por palabra
                                    </div>
                                </div>
                                <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${localSettings.streaming ? 'bg-indigo-600' : 'bg-gray-700'}`}>
                                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${localSettings.streaming ? 'translate-x-6' : 'translate-x-1'}`} />
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="p-6 border-t border-white/5 bg-[#0f1117]">
                            <button
                                onClick={onClose}
                                className="w-full px-4 py-3 bg-white text-black hover:bg-gray-200 font-bold rounded-xl transition-all shadow-lg transform hover:-translate-y-0.5"
                            >
                                Listo
                            </button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default SettingsPanel;
