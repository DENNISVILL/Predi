/**
 * QuickActionsWidget - Quick access to main dashboard actions
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Search, Sparkles, FileText, RefreshCw } from 'lucide-react';

const QuickActionsWidget = ({ onCreatePost, onScheduleTopTrend, onViewReport, onRefresh }) => {
    const actions = [
        {
            id: 'analyze',
            icon: Search,
            title: 'Analizar Trend',
            description: 'Buscar viralidad',
            color: 'from-cyan-500 to-blue-600',
            hoverColor: 'hover:from-cyan-600 hover:to-blue-700',
            onClick: onCreatePost // Mapped to search/explore
        },
        {
            id: 'generate',
            icon: Sparkles,
            title: 'Generar Idea',
            description: 'Con IA Viral',
            color: 'from-purple-500 to-pink-600',
            hoverColor: 'hover:from-purple-600 hover:to-pink-700',
            onClick: onScheduleTopTrend // Mapped to chat/generate
        },
        {
            id: 'audit',
            icon: FileText,
            title: 'Auditoría',
            description: 'Estado de cuenta',
            color: 'from-emerald-500 to-teal-600',
            hoverColor: 'hover:from-emerald-600 hover:to-teal-700',
            onClick: onViewReport
        },
        {
            id: 'refresh',
            icon: RefreshCw,
            title: 'Actualizar',
            description: 'Sincronizar datos',
            color: 'from-orange-500 to-red-600',
            hoverColor: 'hover:from-orange-600 hover:to-red-700',
            onClick: onRefresh
        }
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#111318] border border-white/5 rounded-2xl p-5 mb-6 shadow-xl"
        >
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-bold text-base flex items-center gap-2">
                    <div className="w-1 h-5 bg-gradient-to-b from-cyan-500 to-blue-600 rounded-full"></div>
                    Acciones Estratégicas
                </h3>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {actions.map((action, index) => {
                    const Icon = action.icon;
                    return (
                        <motion.button
                            key={action.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={action.onClick}
                            className={`relative group bg-gradient-to-br ${action.color} ${action.hoverColor} rounded-xl p-3 transition-all border border-white/10 hover:border-white/20 shadow-lg hover:shadow-xl`}
                        >
                            {/* Glow effect */}
                            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>

                            <div className="relative z-10 flex items-center gap-3">
                                <div className="flex items-center justify-center w-10 h-10 bg-white/20 rounded-lg flex-shrink-0">
                                    <Icon className="w-5 h-5 text-white" />
                                </div>
                                <div className="text-left">
                                    <h4 className="text-white font-bold text-xs mb-0.5">{action.title}</h4>
                                    <p className="text-white/80 text-[10px] leading-tight">{action.description}</p>
                                </div>
                            </div>
                        </motion.button>
                    );
                })}
            </div>
        </motion.div>
    );
};

export default QuickActionsWidget;
