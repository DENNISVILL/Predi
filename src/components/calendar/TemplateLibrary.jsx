/**
 * TemplateLibrary - Pre-made calendar templates for different industries
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Check, Plus, Coffee, Dumbbell, Shirt, Cpu, Copy, Video } from 'lucide-react';

const TEMPLATES = [
    {
        id: 'food-restaurant',
        name: 'Restaurante / Foodie',
        icon: Coffee,
        description: 'Estrategia Fin de Semana (Jue-Dom). Foco en antojos.',
        color: 'from-orange-500 to-red-500',
        postsPerWeek: 12,
        schedule: {
            days: ['jueves', 'viernes', 'sábado', 'domingo'],
            posts: [
                { time: '11:00', title: 'Historia Menú del Día', platform: 'instagram', type: 'story' },
                { time: '13:00', title: 'Plato Estrella (Reel)', platform: 'instagram', type: 'video' },
                { time: '18:00', title: 'Promo Cena (Carrusel)', platform: 'instagram', type: 'carousel' }
            ]
        },
        hashtags: '#foodie #dondecomer #restaurante #delicioso #cena',
        niche: 'food'
    },
    {
        id: 'fitness-wellness',
        name: 'Fitness & Wellness',
        icon: Dumbbell,
        description: 'Rutina Lunes a Viernes. Motivación mañana y noche.',
        color: 'from-green-500 to-emerald-500',
        postsPerWeek: 15,
        schedule: {
            days: ['lunes', 'martes', 'miércoles', 'jueves', 'viernes'],
            posts: [
                { time: '07:00', title: 'Frase Motivacional', platform: 'instagram', type: 'story' },
                { time: '13:00', title: 'Tip Nutrición', platform: 'instagram', type: 'carousel' },
                { time: '19:00', title: 'Rutina de Ejercicios', platform: 'tiktok', type: 'video' }
            ]
        },
        hashtags: '#fitness #workout #salud #gym #motivacion',
        niche: 'fitness'
    },
    {
        id: 'fashion-lifestyle',
        name: 'Moda & Lifestyle',
        icon: Shirt,
        description: 'Diario + Foco Finde. OOTD y Estilo de vida.',
        color: 'from-pink-500 to-purple-500',
        postsPerWeek: 15,
        schedule: {
            days: ['lunes', 'miércoles', 'viernes', 'sábado', 'domingo'],
            posts: [
                { time: '09:00', title: 'Encuesta This or That', platform: 'instagram', type: 'story' },
                { time: '12:00', title: 'OOTD (Carrusel)', platform: 'instagram', type: 'carousel' },
                { time: '20:00', title: 'Get Ready With Me', platform: 'tiktok', type: 'video' }
            ]
        },
        hashtags: '#fashion #style #ootd #outfit #tendencias',
        niche: 'fashion'
    },
    {
        id: 'b2b-professional',
        name: 'Servicios Profesionales / B2B',
        icon: Cpu,
        description: 'Horario Laboral (Lun-Jue). Contenido educativo.',
        color: 'from-blue-600 to-indigo-600',
        postsPerWeek: 12,
        schedule: {
            days: ['lunes', 'martes', 'miércoles', 'jueves'],
            posts: [
                { time: '09:00', title: 'Noticia del Sector', platform: 'linkedin', type: 'planning' },
                { time: '13:00', title: 'Tip Educativo (Carrusel)', platform: 'instagram', type: 'carousel' },
                { time: '18:00', title: 'Resumen Semanal (Video)', platform: 'linkedin', type: 'video' }
            ]
        },
        hashtags: '#negocios #b2b #marketing #emprendimiento #tips',
        niche: 'business'
    },
    {
        id: 'education-course',
        name: 'Educación / Infoproductos',
        icon: Copy,
        description: 'Lun-Jueves (Foco Estudio). Webinars y Tutoriales.',
        color: 'from-teal-500 to-cyan-600',
        postsPerWeek: 12,
        schedule: {
            days: ['lunes', 'martes', 'miércoles', 'jueves'],
            posts: [
                { time: '12:00', title: 'Checklist de Estudio', platform: 'instagram', type: 'carousel' },
                { time: '15:00', title: 'Mini Tutorial', platform: 'tiktok', type: 'video' },
                { time: '19:00', title: 'Q&A (Historias)', platform: 'instagram', type: 'story' }
            ]
        },
        hashtags: '#aprender #curso #educacion #tutorial #tips',
        niche: 'education'
    },
    {
        id: 'entertainment-gaming',
        name: 'Gaming & Streamer',
        icon: Video,
        description: 'Tardes y Noches. Fines de semana intensivos.',
        color: 'from-purple-600 to-violet-900',
        postsPerWeek: 12,
        schedule: {
            days: ['viernes', 'sábado', 'domingo'],
            posts: [
                { time: '14:00', title: 'Top 5 Juegos', platform: 'instagram', type: 'carousel' },
                { time: '16:00', title: 'Clip Gracioso', platform: 'tiktok', type: 'video' },
                { time: '19:00', title: 'Aviso de Stream', platform: 'twitter', type: 'story' },
                { time: '22:00', title: 'Highlight del Día', platform: 'youtube', type: 'video' }
            ]
        },
        hashtags: '#gaming #streamer #twitch #clips #divertido',
        niche: 'gaming'
    }
];


const TemplateLibrary = ({ isOpen, onClose, onApplyTemplate }) => {
    const [templates, setTemplates] = useState(TEMPLATES);
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [isCreating, setIsCreating] = useState(false);

    // Custom Template Form State
    const [newTemplate, setNewTemplate] = useState({
        name: '',
        description: '',
        postsPerWeek: 3,
        days: ['lunes', 'miércoles', 'viernes'],
        platforms: ['instagram'],
        niche: 'general'
    });
    // Initialize startDate to the 1st of the CURRENT month
    const [startDate, setStartDate] = useState(() => {
        const today = new Date();
        const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
        // Correct timezone offset issue by formatting manually or using local string
        return firstDay.toLocaleDateString('en-CA'); // Outputs YYYY-MM-DD format
    });
    const [duration, setDuration] = useState(30); // Default to Full Month

    const handleApplyTemplate = () => {
        if (!selectedTemplate) return;

        const template = templates.find(t => t.id === selectedTemplate);
        const posts = [];
        const start = new Date(startDate);

        for (let day = 0; day < duration; day++) {
            const currentDate = new Date(start);
            currentDate.setDate(start.getDate() + day);

            const dayName = currentDate.toLocaleDateString('es-ES', { weekday: 'long' }).toLowerCase();

            if (template.schedule.days.includes(dayName)) {
                template.schedule.posts.forEach((post, index) => {
                    const [hours, minutes] = post.time.split(':');
                    const scheduledDate = new Date(currentDate);
                    scheduledDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);

                    posts.push({
                        id: `template_${Date.now()}_${day}_${index}`,
                        title: `${post.title} - ${template.name}`,
                        content: `Post programado desde template: ${template.name}`,
                        description: `${post.title} para ${currentDate.toLocaleDateString('es-ES', { weekday: 'long' })}`,
                        platform: post.platform,
                        scheduledDate,
                        date: scheduledDate,
                        hashtags: template.hashtags,
                        niche: template.niche,
                        status: 'pending',
                        viralScore: Math.floor(Math.random() * 30 + 60), // 60-90
                        type: post.type || 'video', // Ensuring type is passed
                        mediaType: post.type || 'video',
                        templateId: template.id
                    });
                });
            }
        }

        onApplyTemplate(posts);
        onClose();
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
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    >
                        <div className="bg-gray-900 rounded-2xl border border-gray-700 max-w-6xl w-full max-h-[90vh] overflow-hidden">
                            {/* Header */}
                            <div className="flex items-center justify-between p-6 border-b border-gray-800">
                                <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-violet-400">
                                    Librería de Plantillas
                                </h2>
                                <button onClick={onClose} className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
                                    <X size={20} className="text-gray-400" />
                                </button>
                            </div>

                            {/* Content */}
                            <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)] custom-scrollbar">
                                {/* Template Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 mb-6">
                                    {!isCreating ? (
                                        <>
                                            {templates.map((template) => (
                                                <motion.div
                                                    key={template.id}
                                                    onClick={() => setSelectedTemplate(template.id)}
                                                    whileHover={{ scale: 1.02 }}
                                                    className={`cursor-pointer rounded-xl p-5 border-2 transition-all ${selectedTemplate === template.id
                                                        ? 'border-blue-500 bg-blue-900/10'
                                                        : 'border-gray-800 bg-gray-900/50 hover:border-gray-700 hover:bg-gray-800'
                                                        }`}
                                                >
                                                    <div className="flex items-start justify-between mb-3">
                                                        <div className={`p-3 rounded-lg bg-gradient-to-br ${template.color} bg-opacity-10`}>
                                                            <template.icon size={24} className="text-white" />
                                                        </div>
                                                        {selectedTemplate === template.id && (
                                                            <div className="bg-blue-500 rounded-full p-1">
                                                                <Check size={14} className="text-white" />
                                                            </div>
                                                        )}
                                                    </div>

                                                    <h3 className="text-lg font-bold text-white mb-1">{template.name}</h3>
                                                    <p className="text-sm text-gray-400 mb-4 h-10">{template.description}</p>

                                                    <div className="flex items-center justify-between text-sm mb-3">
                                                        <span className="text-gray-400">Posts por semana:</span>
                                                        <span className="text-white font-semibold">{template.postsPerWeek}</span>
                                                    </div>

                                                    {/* Preview of Schedule */}
                                                    <div className="mt-4 pt-4 border-t border-gray-700/50 space-y-2">
                                                        {template.schedule.posts.slice(0, 2).map((post, i) => (
                                                            <div key={i} className="flex items-center text-xs text-gray-300 gap-2">
                                                                <span className="bg-gray-800 px-1.5 py-0.5 rounded text-[10px]">{post.time} - {post.platform}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </motion.div>
                                            ))}

                                            {/* Create Custom Template Card */}
                                            <motion.div
                                                onClick={() => setIsCreating(true)}
                                                whileHover={{ scale: 1.02 }}
                                                className="cursor-pointer rounded-xl p-6 border-2 border-dashed border-gray-700 hover:border-purple-500 bg-gray-800/30 hover:bg-purple-500/5 transition-all flex flex-col items-center justify-center text-center"
                                            >
                                                <div className="w-14 h-14 rounded-xl bg-gray-700 flex items-center justify-center mb-4">
                                                    <Plus className="w-7 h-7 text-gray-400" />
                                                </div>
                                                <h3 className="text-lg font-bold text-white mb-2">Plantilla Personalizada</h3>
                                                <p className="text-sm text-gray-400">
                                                    Crea tu propia plantilla basado en tus necesidades
                                                </p>
                                            </motion.div>
                                        </>
                                    ) : (
                                        // Creator Mode
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="col-span-1 md:col-span-2 bg-gray-800/50 rounded-xl p-6 border border-purple-500/30"
                                        >
                                            <div className="flex items-center justify-between mb-6">
                                                <h3 className="text-lg font-bold text-white">Nueva Plantilla</h3>
                                                <button onClick={() => setIsCreating(false)} className="text-sm text-gray-400 hover:text-white">Cancelar</button>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm text-gray-400 mb-1">Nombre de la Plantilla</label>
                                                    <input
                                                        type="text"
                                                        className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white"
                                                        placeholder="Ej: Mi Estrategia Mensual"
                                                        value={newTemplate.name}
                                                        onChange={e => setNewTemplate({ ...newTemplate, name: e.target.value })}
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm text-gray-400 mb-1">Descripción Corta</label>
                                                    <input
                                                        type="text"
                                                        className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white"
                                                        placeholder="Ej: Foco en Reels y TikTok"
                                                        value={newTemplate.description}
                                                        onChange={e => setNewTemplate({ ...newTemplate, description: e.target.value })}
                                                    />
                                                </div>
                                            </div>

                                            <div className="mt-6 flex justify-end">
                                                <button
                                                    onClick={() => {
                                                        const created = {
                                                            id: `custom-${Date.now()}`,
                                                            name: newTemplate.name || 'Sin Nombre',
                                                            icon: Plus,
                                                            description: newTemplate.description || 'Plantilla Personalizada',
                                                            color: 'from-purple-500 to-pink-500',
                                                            postsPerWeek: newTemplate.postsPerWeek,
                                                            schedule: {
                                                                days: newTemplate.days,
                                                                posts: [
                                                                    // Default posts structure for now to avoid complexity in this step
                                                                    { time: '10:00', title: 'Post Mañana', platform: 'instagram', type: 'story' },
                                                                    { time: '18:00', title: 'Post Tarde', platform: 'tiktok', type: 'video' }
                                                                ]
                                                            },
                                                            hashtags: '#custom #strategy',
                                                            niche: 'custom'
                                                        };
                                                        setTemplates([...templates, created]);
                                                        setSelectedTemplate(created.id);
                                                        setIsCreating(false);
                                                    }}
                                                    className="bg-purple-600 hover:bg-purple-500 text-white px-6 py-2 rounded-lg font-bold"
                                                >
                                                    Guardar Plantilla
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}
                                </div>

                                {/* Configuration */}
                                {selectedTemplate && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="bg-gray-800/50 rounded-xl p-6 border border-gray-700"
                                    >
                                        <h3 className="text-lg font-bold text-white mb-4">Configurar Plantilla</h3>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                                    Fecha de Inicio
                                                </label>
                                                <input
                                                    type="date"
                                                    value={startDate}
                                                    onChange={(e) => setStartDate(e.target.value)}
                                                    min={new Date().toISOString().split('T')[0]}
                                                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                                    Duración (días)
                                                </label>
                                                <select
                                                    value={duration}
                                                    onChange={(e) => setDuration(parseInt(e.target.value))}
                                                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                                >
                                                    <option value={7}>1 semana (7 días)</option>
                                                    <option value={14}>2 semanas (14 días)</option>
                                                    <option value={21}>3 semanas (21 días)</option>
                                                    <option value={30}>1 mes (30 días)</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                                            <div className="flex items-start gap-3">
                                                <Copy className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                                                <div>
                                                    <h4 className="text-blue-400 font-semibold mb-1">Preview</h4>
                                                    <p className="text-sm text-gray-300">
                                                        Se crearán aproximadamente{' '}
                                                        <span className="font-bold text-white">
                                                            {Math.floor(duration / 7) * templates.find(t => t.id === selectedTemplate)?.postsPerWeek || 0}
                                                        </span>{' '}
                                                        posts programados desde{' '}
                                                        <span className="font-bold text-white">
                                                            {new Date(startDate).toLocaleDateString('es-ES')}
                                                        </span>
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </div>

                            {/* Footer */}
                            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-700">
                                <button
                                    onClick={onClose}
                                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={handleApplyTemplate}
                                    disabled={!selectedTemplate}
                                    className="px-6 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                >
                                    <Calendar className="w-4 h-4" />
                                    Aplicar Plantilla
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default TemplateLibrary;
