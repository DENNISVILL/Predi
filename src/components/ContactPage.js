import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Brain, Mail, MessageSquare, MapPin, Send, ArrowLeft, CheckCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';

const ContactPage = () => {
    const navigate = useNavigate();
    const [formState, setFormState] = useState({ name: '', email: '', message: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSent, setIsSent] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simular envío
        await new Promise(resolve => setTimeout(resolve, 1500));

        setIsSubmitting(false);
        setIsSent(true);
        toast.success("Mensaje enviado correctamente");
    };

    return (
        <div className="min-h-screen bg-[#0b0c10] overflow-hidden relative">
            {/* Background Gradients */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#007bff]/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#00ff9d]/10 rounded-full blur-[120px]" />
            </div>

            {/* Navbar */}
            <nav className="relative z-50 px-6 py-6 max-w-7xl mx-auto flex items-center justify-between">
                <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
                    <div className="w-10 h-10 bg-gradient-to-r from-[#007bff] to-[#00ff9d] rounded-xl flex items-center justify-center">
                        <Brain className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-2xl font-bold gradient-text">Predix</span>
                </div>
                <button
                    onClick={() => navigate('/')}
                    className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                    Volver
                </button>
            </nav>

            <div className="relative z-10 px-6 py-12 max-w-7xl mx-auto">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-center">

                    {/* Left Column: Info */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                            Hablemos de tu <br />
                            <span className="gradient-text">Siguiente Nivel</span>
                        </h1>
                        <p className="text-xl text-gray-400 mb-12 leading-relaxed">
                            ¿Tienes preguntas sobre el plan Enterprise? ¿Necesitas una integración personalizada? ¿O simplemente quieres saludar? Estamos aquí.
                        </p>

                        <div className="space-y-8">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center shrink-0">
                                    <Mail className="w-6 h-6 text-[#00ff9d]" />
                                </div>
                                <div>
                                    <h3 className="text-white font-bold text-lg">Email Directo</h3>
                                    <p className="text-gray-400">hola@predix.ai</p>
                                    <p className="text-gray-400">soporte@predix.ai</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center shrink-0">
                                    <MessageSquare className="w-6 h-6 text-[#007bff]" />
                                </div>
                                <div>
                                    <h3 className="text-white font-bold text-lg">Soporte 24/7</h3>
                                    <p className="text-gray-400">Chat en vivo disponible para usuarios Pro y Enterprise.</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center shrink-0">
                                    <MapPin className="w-6 h-6 text-purple-400" />
                                </div>
                                <div>
                                    <h3 className="text-white font-bold text-lg">Oficinas</h3>
                                    <p className="text-gray-400">Silicon Valley, CA (HQ)</p>
                                    <p className="text-gray-400">Remote First Company 🌍</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right Column: Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        <div className="glass-effect p-8 md:p-10 rounded-3xl border border-gray-800/50">
                            {isSent ? (
                                <div className="text-center py-12">
                                    <div className="w-20 h-20 bg-[#00ff9d]/20 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <CheckCircle className="w-10 h-10 text-[#00ff9d]" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-white mb-2">¡Mensaje Enviado!</h3>
                                    <p className="text-gray-400">Nos pondremos en contacto contigo lo antes posible.</p>
                                    <button
                                        onClick={() => setIsSent(false)}
                                        className="mt-8 text-[#00ff9d] hover:underline"
                                    >
                                        Enviar otro mensaje
                                    </button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div>
                                        <label className="block text-gray-400 text-sm font-medium mb-2">Nombre Completo</label>
                                        <input
                                            type="text"
                                            required
                                            className="w-full bg-[#0b0c10] border border-gray-800 rounded-xl px-4 py-3 text-white focus:border-[#00ff9d] focus:ring-1 focus:ring-[#00ff9d] transition-all outline-none"
                                            placeholder="John Doe"
                                            value={formState.name}
                                            onChange={e => setFormState({ ...formState, name: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-400 text-sm font-medium mb-2">Correo Electrónico</label>
                                        <input
                                            type="email"
                                            required
                                            className="w-full bg-[#0b0c10] border border-gray-800 rounded-xl px-4 py-3 text-white focus:border-[#00ff9d] focus:ring-1 focus:ring-[#00ff9d] transition-all outline-none"
                                            placeholder="john@empresa.com"
                                            value={formState.email}
                                            onChange={e => setFormState({ ...formState, email: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-400 text-sm font-medium mb-2">Mensaje</label>
                                        <textarea
                                            required
                                            rows={4}
                                            className="w-full bg-[#0b0c10] border border-gray-800 rounded-xl px-4 py-3 text-white focus:border-[#00ff9d] focus:ring-1 focus:ring-[#00ff9d] transition-all outline-none resize-none"
                                            placeholder="Cuéntanos cómo podemos ayudarte..."
                                            value={formState.message}
                                            onChange={e => setFormState({ ...formState, message: e.target.value })}
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full bg-gradient-to-r from-[#007bff] to-[#00ff9d] text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isSubmitting ? (
                                            "Enviando..."
                                        ) : (
                                            <>
                                                Enviar Mensaje
                                                <Send className="w-5 h-5" />
                                            </>
                                        )}
                                    </button>
                                </form>
                            )}
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default ContactPage;
