import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Phone, MessageCircle, Book, Video, HelpCircle } from 'lucide-react';

const HelpPanel = () => {
    const [isOpen, setIsOpen] = useState(false);

    const helpOptions = [
        {
            id: 'phone',
            icon: Phone,
            title: 'Llamar Ahora',
            subtitle: 'Lun-Vie 9am-6pm',
            action: () => window.location.href = 'tel:+1234567890',
            color: 'blue',
            number: '📞 123-456-7890'
        },
        {
            id: 'whatsapp',
            icon: MessageCircle,
            title: 'WhatsApp',
            subtitle: 'Chat en vivo',
            action: () => window.open('https://wa.me/1234567890', '_blank'),
            color: 'green'
        },
        {
            id: 'tutorials',
            icon: Video,
            title: 'Videos Tutoriales',
            subtitle: 'Aprende paso a paso',
            action: () => setIsOpen(false), // TODO: Abrir biblioteca de videos
            color: 'purple'
        },
        {
            id: 'guides',
            icon: Book,
            title: 'Guías en PDF',
            subtitle: 'Descarga e imprime',
            action: () => setIsOpen(false), // TODO: Abrir lista de PDFs
            color: 'orange'
        }
    ];

    const getColorClasses = (color) => {
        const colors = {
            blue: 'bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 border-blue-500/30',
            green: 'bg-green-500/10 text-green-500 hover:bg-green-500/20 border-green-500/30',
            purple: 'bg-purple-500/10 text-purple-500 hover:bg-purple-500/20 border-purple-500/30',
            orange: 'bg-orange-500/10 text-orange-500 hover:bg-orange-500/20 border-orange-500/30'
        };
        return colors[color] || colors.blue;
    };

    return (
        <>
            {/* Floating Help Button */}
            <motion.button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-full p-4 shadow-xl hover:shadow-2xl transition-all"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                title="¿Necesitas ayuda?"
            >
                <HelpCircle className="w-8 h-8" />
            </motion.button>

            {/* Help Panel */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Overlay */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
                        />

                        {/* Panel */}
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed right-0 top-0 bottom-0 w-full md:w-[450px] bg-gray-900 z-50 shadow-2xl overflow-y-auto"
                        >
                            {/* Header */}
                            <div className="sticky top-0 bg-gradient-to-r from-cyan-500 to-blue-500 p-6 flex items-center justify-between">
                                <div>
                                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                                        <HelpCircle className="w-6 h-6" />
                                        ¿Necesitas Ayuda?
                                    </h2>
                                    <p className="text-cyan-100 text-sm mt-1">Estamos aquí para ti</p>
                                </div>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            {/* Content */}
                            <div className="p-6 space-y-4">
                                {/* Help Options */}
                                {helpOptions.map((option) => {
                                    const Icon = option.icon;
                                    return (
                                        <motion.button
                                            key={option.id}
                                            onClick={option.action}
                                            className={`w-full p-6 rounded-xl border-2 transition-all text-left ${getColorClasses(option.color)}`}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            <div className="flex items-start gap-4">
                                                <div className="p-3 rounded-lg bg-white/10">
                                                    <Icon className="w-6 h-6" />
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="text-lg font-bold text-white">{option.title}</h3>
                                                    <p className="text-gray-400 text-sm mt-1">{option.subtitle}</p>
                                                    {option.number && (
                                                        <p className="text-white font-mono mt-2 text-lg">{option.number}</p>
                                                    )}
                                                </div>
                                            </div>
                                        </motion.button>
                                    );
                                })}

                                {/* FAQ Section */}
                                <div className="mt-8 p-6 bg-gray-800/50 rounded-xl border border-gray-700">
                                    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                        <Book className="w-5 h-5 text-cyan-400" />
                                        Preguntas Frecuentes
                                    </h3>
                                    <div className="space-y-3">
                                        <details className="group">
                                            <summary className="cursor-pointer text-gray-300 hover:text-white transition-colors font-medium">
                                                ¿Cómo creo mi primer post?
                                            </summary>
                                            <p className="mt-2 text-gray-400 text-sm pl-4">
                                                1. Ve a "Chat IA" o "Crear Post"<br />
                                                2. Escribe de qué quieres hablar<br />
                                                3. Selecciona la opción que más te guste<br />
                                                4. Programa cuándo publicar
                                            </p>
                                        </details>
                                        <details className="group">
                                            <summary className="cursor-pointer text-gray-300 hover:text-white transition-colors font-medium">
                                                ¿Qué son los hashtags?
                                            </summary>
                                            <p className="mt-2 text-gray-400 text-sm pl-4">
                                                Son palabras con el símbolo # que ayudan a que más personas encuentren tu contenido. Ejemplo: #MiNegocio #Ofertas
                                            </p>
                                        </details>
                                        <details className="group">
                                            <summary className="cursor-pointer text-gray-300 hover:text-white transition-colors font-medium">
                                                ¿Cómo programo contenido?
                                            </summary>
                                            <p className="mt-2 text-gray-400 text-sm pl-4">
                                                Ve al Calendario, elige una fecha y hora, y Predix te recordará cuándo publicar.
                                            </p>
                                        </details>
                                    </div>
                                </div>

                                {/* Tips Section */}
                                <div className="p-6 bg-gradient-to-br from-purple-900/20 to-pink-900/20 rounded-xl border border-purple-500/30">
                                    <h3 className="text-xl font-bold text-white mb-3">💡 Consejo del día</h3>
                                    <p className="text-gray-300">
                                        El mejor momento para publicar en redes sociales es entre 10am-12pm y 7pm-9pm.
                                        ¡Programa tu contenido en estos horarios!
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
};

export default HelpPanel;
