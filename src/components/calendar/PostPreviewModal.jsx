/**
 * PostPreviewModal - Quick preview of scheduled post with edit/delete actions
 */

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Edit, Trash2, Copy, TrendingUp, Users, Heart, Share2, Clock } from 'lucide-react';

const PostPreviewModal = ({ post, isOpen, onClose, onEdit, onDelete, onDuplicate }) => {
    if (!post) return null;

    const platformColors = {
        tiktok: '#ff0050',
        instagram: '#E1306C',
        youtube: '#FF0000',
        facebook: '#1877F2',
        linkedin: '#0077B5'
    };

    const getViralityLevel = (score) => {
        if (score >= 91) return { label: 'Viral', color: 'text-purple-400', bg: 'bg-purple-500/20' };
        if (score >= 71) return { label: 'Alto', color: 'text-green-400', bg: 'bg-green-500/20' };
        if (score >= 41) return { label: 'Medio', color: 'text-orange-400', bg: 'bg-orange-500/20' };
        return { label: 'Bajo', color: 'text-red-400', bg: 'bg-red-500/20' };
    };

    const viralityScore = post.viralScore || 50;
    const virality = getViralityLevel(viralityScore);
    const platformColor = platformColors[post.platform?.toLowerCase()] || '#6366F1';

    const handleSyncToCalendar = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/calendar/events', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    summary: post.title || 'Predix Content',
                    description: post.content || post.description || 'Scheduled via Predix',
                    startDateTime: new Date(post.scheduledDate || post.date).toISOString(),
                    endDateTime: new Date(new Date(post.scheduledDate || post.date).getTime() + 60 * 60 * 1000).toISOString()
                })
            });
            const data = await response.json();
            if (data.status === 'success') {
                alert('¡Evento creado en Google Calendar exitosamente!');
                window.open(data.eventLink, '_blank');
            } else {
                alert('Error al sincronizar: ' + (data.error || 'Desconocido'));
            }
        } catch (e) {
            console.error(e);
            alert('Error conectando con el servidor. Asegúrate de haber iniciado sesión con Google.');
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
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    >
                        <div className="bg-gray-900 rounded-2xl border border-gray-700 max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
                            {/* Header */}
                            <div className="flex items-center justify-between p-6 border-b border-gray-700">
                                <div className="flex items-center gap-4">
                                    <div
                                        className="w-12 h-12 rounded-lg flex items-center justify-center"
                                        style={{ backgroundColor: platformColor }}
                                    >
                                        <span className="text-white font-bold text-xl">
                                            {post.platform?.substring(0, 1).toUpperCase()}
                                        </span>
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-white">
                                            {post.title || 'Post Preview'}
                                        </h2>
                                        <p className="text-sm text-gray-400 capitalize">{post.platform}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                                >
                                    <X className="w-5 h-5 text-gray-400" />
                                </button>
                            </div>

                            {/* Content */}
                            <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                    {/* Main Content */}
                                    <div className="lg:col-span-2 space-y-6">
                                        {/* Scheduled Time */}
                                        <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Clock className="w-5 h-5 text-cyan-400" />
                                                <h3 className="text-sm font-semibold text-white">Programado para</h3>
                                            </div>
                                            <p className="text-white font-medium">
                                                {new Date(post.scheduledDate || post.date).toLocaleString('es-ES', {
                                                    weekday: 'long',
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </p>
                                        </div>

                                        {/* Description/Content */}
                                        <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                                            <h3 className="text-sm font-semibold text-white mb-3">Contenido</h3>
                                            <p className="text-gray-300 whitespace-pre-wrap">
                                                {post.description || post.content || 'Sin descripción'}
                                            </p>
                                        </div>

                                        {/* Hashtags */}
                                        {post.hashtags && (
                                            <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                                                <h3 className="text-sm font-semibold text-white mb-3">Hashtags</h3>
                                                <div className="flex flex-wrap gap-2">
                                                    {post.hashtags.split(' ').map((tag, index) => (
                                                        <span
                                                            key={index}
                                                            className="px-3 py-1 bg-cyan-500/20 border border-cyan-500/30 rounded-full text-cyan-400 text-sm"
                                                        >
                                                            {tag}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Notes */}
                                        {post.notes && (
                                            <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                                                <h3 className="text-sm font-semibold text-white mb-2">Notas</h3>
                                                <p className="text-gray-400 text-sm">{post.notes}</p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Sidebar - Metrics */}
                                    <div className="space-y-4">
                                        {/* Virality Score */}
                                        <div className={`rounded-lg p-4 border ${virality.bg} border-${virality.color.replace('text-', '')}/30`}>
                                            <div className="text-center">
                                                <div className="text-5xl font-bold mb-2" style={{ color: virality.color.replace('text-', '') }}>
                                                    {viralityScore}
                                                </div>
                                                <div className={`text-sm font-semibold ${virality.color}`}>
                                                    {virality.label}
                                                </div>
                                                <div className="text-xs text-gray-400 mt-1">Virality Score</div>
                                            </div>
                                        </div>

                                        {/* Predicted Metrics */}
                                        <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700 space-y-3">
                                            <h3 className="text-sm font-semibold text-white mb-3">Métricas Predichas</h3>

                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <Users className="w-4 h-4 text-blue-400" />
                                                    <span className="text-sm text-gray-400">Alcance</span>
                                                </div>
                                                <span className="text-white font-semibold">
                                                    {post.estimatedReach?.toLocaleString() || '5K-10K'}
                                                </span>
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <Heart className="w-4 h-4 text-red-400" />
                                                    <span className="text-sm text-gray-400">Engagement</span>
                                                </div>
                                                <span className="text-white font-semibold">
                                                    {viralityScore > 70 ? '8-12%' : '3-6%'}
                                                </span>
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <Share2 className="w-4 h-4 text-green-400" />
                                                    <span className="text-sm text-gray-400">Shares</span>
                                                </div>
                                                <span className="text-white font-semibold">
                                                    {Math.floor(viralityScore * 10)}+
                                                </span>
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <TrendingUp className="w-4 h-4 text-purple-400" />
                                                    <span className="text-sm text-gray-400">Growth</span>
                                                </div>
                                                <span className="text-white font-semibold">
                                                    +{Math.floor(viralityScore / 2)}%
                                                </span>
                                            </div>
                                        </div>

                                        {/* Status Badge */}
                                        <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                                            <div className="text-sm text-gray-400 mb-1">Estado</div>
                                            <div className={`inline-flex px-3 py-1 rounded-full text-sm font-semibold ${post.status === 'published'
                                                ? 'bg-green-500/20 text-green-400'
                                                : post.status === 'scheduled'
                                                    ? 'bg-blue-500/20 text-blue-400'
                                                    : 'bg-yellow-500/20 text-yellow-400'
                                                }`}>
                                                {post.status === 'published' ? 'Publicado' :
                                                    post.status === 'scheduled' ? 'Programado' : 'Pendiente'}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Footer - Actions */}
                            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-700 bg-gray-800/30">
                                <button
                                    onClick={() => {
                                        onDuplicate && onDuplicate(post);
                                        onClose();
                                    }}
                                    className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                                >
                                    <Copy className="w-4 h-4" />
                                    Duplicar
                                </button>
                                <button
                                    onClick={() => {
                                        onEdit && onEdit(post);
                                        onClose();
                                    }}
                                    className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                                >
                                    <Edit className="w-4 h-4" />
                                    Editar
                                </button>
                                <button
                                    onClick={handleSyncToCalendar}
                                    className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                                >
                                    <Clock className="w-4 h-4" />
                                    Sync Calendar
                                </button>
                                <button
                                    onClick={() => {
                                        if (window.confirm('¿Estás seguro de eliminar este post?')) {
                                            onDelete && onDelete(post.id);
                                            onClose();
                                        }
                                    }}
                                    className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                                >
                                    <Trash2 className="w-4 h-4" />
                                    Eliminar
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default PostPreviewModal;
