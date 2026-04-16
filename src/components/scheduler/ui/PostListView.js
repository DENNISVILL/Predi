/**
 * PostListView - Vista de lista de posts programados
 * Componente lazy-loaded para mejor performance
 */
import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, TrendingUp, Edit3, Trash2, Eye } from 'lucide-react';

const PostListView = ({
    posts = [],
    theme = 'dark',
    onPostClick,
    onEditPost,
    onDeletePost
}) => {
    if (!posts || posts.length === 0) {
        return (
            <div className={`text-center py-20 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                <Calendar className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg mb-2">No hay posts programados</p>
                <p className="text-sm">Crea tu primer post para ver la lista aquí</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {posts.map((post, index) => (
                <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`p-5 rounded-xl border ${theme === 'dark'
                            ? 'bg-gray-800/50 border-gray-700 hover:border-gray-600 hover:bg-gray-800/70'
                            : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-md'
                        } transition-all cursor-pointer group`}
                    onClick={() => onPostClick && onPostClick(post)}
                >
                    <div className="flex items-start justify-between">
                        {/* Left section - Content info */}
                        <div className="flex-1 min-w-0">
                            {/* Platform & Status badges */}
                            <div className="flex items-center gap-2 mb-3 flex-wrap">
                                <span className={`text-sm font-semibold ${getPlatformColor(post.platform, theme)}`}>
                                    {getPlatformIcon(post.platform)} {post.platform}
                                </span>
                                <span className={`text-xs px-2.5 py-1 rounded-full ${getStatusBadge(post.status, theme)}`}>
                                    {getStatusText(post.status)}
                                </span>
                                {post.niche && (
                                    <span className={`text-xs px-2.5 py-1 rounded-full ${theme === 'dark' ? 'bg-purple-500/20 text-purple-400' : 'bg-purple-100 text-purple-600'
                                        }`}>
                                        {post.niche}
                                    </span>
                                )}
                            </div>

                            {/* Title & Content */}
                            <h3 className={`font-semibold mb-2 text-lg ${theme === 'dark' ? 'text-white' : 'text-gray-900'
                                }`}>
                                {post.title || 'Sin título'}
                            </h3>

                            {post.content && (
                                <p className={`text-sm mb-3 line-clamp-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                                    }`}>
                                    {post.content}
                                </p>
                            )}

                            {/* Hashtags preview */}
                            {post.hashtags && post.hashtags.length > 0 && (
                                <div className="flex flex-wrap gap-1 mb-3">
                                    {post.hashtags.slice(0, 5).map((tag, i) => (
                                        <span key={i} className={`text-xs ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
                                            }`}>
                                            {tag}
                                        </span>
                                    ))}
                                    {post.hashtags.length > 5 && (
                                        <span className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                                            +{post.hashtags.length - 5} más
                                        </span>
                                    )}
                                </div>
                            )}

                            {/* Date & Time */}
                            <div className="flex items-center gap-4 text-sm">
                                <div className="flex items-center gap-1.5">
                                    <Calendar className="w-4 h-4" />
                                    <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                                        {new Date(post.date).toLocaleDateString('es-ES', {
                                            day: 'numeric',
                                            month: 'short',
                                            year: 'numeric'
                                        })}
                                    </span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <Clock className="w-4 h-4" />
                                    <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                                        {new Date(post.date).toLocaleTimeString('es-ES', {
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Right section - Metrics & Actions */}
                        <div className="flex flex-col items-end gap-3 ml-4">
                            {/* Viral Score */}
                            <div className="text-right">
                                <div className={`text-xs mb-1 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                                    Score Viral
                                </div>
                                <div className={`text-2xl font-bold ${getScoreColor(post.viralScore, theme)}`}>
                                    {post.viralScore || 0}
                                    <span className="text-sm">/100</span>
                                </div>
                            </div>

                            {/* Estimated Reach */}
                            {post.estimatedReach && (
                                <div className="text-right">
                                    <div className={`text-xs mb-1 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                                        Alcance Est.
                                    </div>
                                    <div className={`text-sm font-semibold ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`}>
                                        {formatNumber(post.estimatedReach)}
                                    </div>
                                </div>
                            )}

                            {/* Action buttons */}
                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onEditPost && onEditPost(post);
                                    }}
                                    className={`p-2 rounded-lg ${theme === 'dark'
                                            ? 'bg-blue-500/20 hover:bg-blue-500/30 text-blue-400'
                                            : 'bg-blue-100 hover:bg-blue-200 text-blue-600'
                                        } transition-colors`}
                                    title="Editar"
                                >
                                    <Edit3 className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onDeletePost && onDeletePost(post.id);
                                    }}
                                    className={`p-2 rounded-lg ${theme === 'dark'
                                            ? 'bg-red-500/20 hover:bg-red-500/30 text-red-400'
                                            : 'bg-red-100 hover:bg-red-200 text-red-600'
                                        } transition-colors`}
                                    title="Eliminar"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>
    );
};

// Helper functions
const getPlatformColor = (platform, theme) => {
    const colors = {
        tiktok: theme === 'dark' ? 'text-pink-400' : 'text-pink-600',
        instagram: theme === 'dark' ? 'text-purple-400' : 'text-purple-600',
        youtube: theme === 'dark' ? 'text-red-400' : 'text-red-600',
        facebook: theme === 'dark' ? 'text-blue-400' : 'text-blue-600',
        linkedin: theme === 'dark' ? 'text-blue-300' : 'text-blue-700',
        twitter: theme === 'dark' ? 'text-sky-400' : 'text-sky-600'
    };
    return colors[platform?.toLowerCase()] || (theme === 'dark' ? 'text-gray-400' : 'text-gray-600');
};

const getPlatformIcon = (platform) => {
    const icons = {
        tiktok: '🎵',
        instagram: '📸',
        youtube: '📹',
        facebook: '👥',
        linkedin: '💼',
        twitter: '🐦'
    };
    return icons[platform?.toLowerCase()] || '📱';
};

const getStatusBadge = (status, theme) => {
    const badges = {
        scheduled: theme === 'dark' ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-700',
        published: theme === 'dark' ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-700',
        pending: theme === 'dark' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-yellow-100 text-yellow-700',
        failed: theme === 'dark' ? 'bg-red-500/20 text-red-400' : 'bg-red-100 text-red-700',
        draft: theme === 'dark' ? 'bg-gray-500/20 text-gray-400' : 'bg-gray-100 text-gray-700'
    };
    return badges[status] || badges.pending;
};

const getStatusText = (status) => {
    const texts = {
        scheduled: '⏰ Programado',
        published: '✅ Publicado',
        pending: '⏳ Pendiente',
        failed: '❌ Fallido',
        draft: '📝 Borrador'
    };
    return texts[status] || 'Desconocido';
};

const getScoreColor = (score, theme) => {
    if (score >= 80) return theme === 'dark' ? 'text-green-400' : 'text-green-600';
    if (score >= 60) return theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600';
    if (score >= 40) return theme === 'dark' ? 'text-orange-400' : 'text-orange-600';
    return theme === 'dark' ? 'text-red-400' : 'text-red-600';
};

const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
};

export default PostListView;
