import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Brain, Users, Globe, Target, Shield, Rocket, ArrowLeft } from 'lucide-react';

const AboutPage = () => {
    const navigate = useNavigate();

    const stats = [
        { label: "Usuarios Activos", value: "10k+" },
        { label: "Predicciones/Día", value: "15M" },
        { label: "Países", value: "25+" },
        { label: "Precisión", value: "99.7%" }
    ];

    const values = [
        {
            icon: Target,
            title: "Innovación Radical",
            description: "No seguimos tendencias, las predecimos. Usamos la tecnología más avanzada para ir siempre un paso adelante."
        },
        {
            icon: Shield,
            title: "Integridad de Datos",
            description: "La privacidad y la ética en el manejo de datos son innegociables. Transparencia total en nuestros algoritmos."
        },
        {
            icon: Users,
            title: "Obsesión por el Cliente",
            description: "Nuestro éxito se mide únicamente por el crecimiento y el ROI de quienes confían en nosotros."
        }
    ];

    return (
        <div className="min-h-screen bg-[#0b0c10] overflow-hidden relative">
            {/* Background Gradients */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-[#007bff]/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#00ff9d]/10 rounded-full blur-[120px]" />
            </div>

            {/* Navbar Placeholder / Back Button */}
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
                    Volver al Inicio
                </button>
            </nav>

            {/* Hero Section */}
            <section className="relative z-10 pt-20 pb-32 px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <span className="inline-block px-4 py-2 rounded-full bg-white/5 border border-white/10 text-[#00ff9d] text-sm font-medium mb-6">
                            Nuestra Historia
                        </span>
                        <h1 className="text-5xl md:text-7xl font-bold text-white mb-8 leading-tight">
                            Democratizando el <br />
                            <span className="gradient-text">Futuro Digital</span>
                        </h1>
                        <p className="text-xl text-gray-400 leading-relaxed max-w-2xl mx-auto">
                            Nacimos con una misión clara: dar a los creadores y empresas el poder de ver lo que viene antes de que suceda, usando la Inteligencia Artificial más avanzada del mundo.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Stats Grid */}
            <section className="relative z-10 px-6 pb-32">
                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {stats.map((stat, index) => (
                            <motion.div
                                key={index}
                                className="text-center p-8 glass-effect rounded-2xl"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                viewport={{ once: true }}
                            >
                                <div className="text-4xl md:text-5xl font-bold text-white mb-2">{stat.value}</div>
                                <div className="text-[#00ff9d] font-medium">{stat.label}</div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="relative z-10 px-6 pb-32">
                <div className="max-w-6xl mx-auto">
                    <motion.div
                        className="text-center mb-16"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Nuestros Valores</h2>
                        <p className="text-gray-400 max-w-2xl mx-auto">Los pilares fundamentales que impulsan cada línea de código y cada decisión en Predix.</p>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {values.map((value, index) => (
                            <motion.div
                                key={index}
                                className="glass-effect p-8 rounded-3xl border border-gray-800/50 hover:border-[#00ff9d]/30 transition-all duration-300"
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.2 }}
                                viewport={{ once: true }}
                            >
                                <div className="w-14 h-14 bg-gradient-to-br from-[#007bff]/20 to-[#00ff9d]/20 rounded-2xl flex items-center justify-center mb-6">
                                    <value.icon className="w-7 h-7 text-[#00ff9d]" />
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-4">{value.title}</h3>
                                <p className="text-gray-400 leading-relaxed">
                                    {value.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="relative z-10 px-6 pb-20">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="glass-effect p-12 rounded-[2.5rem] relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-[#007bff]/10 to-[#00ff9d]/10" />
                        <div className="relative z-10">
                            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">¿Listo para unirte a la revolución?</h2>
                            <button
                                onClick={() => navigate('/register')}
                                className="bg-gradient-to-r from-[#007bff] to-[#00ff9d] text-white px-8 py-4 rounded-xl font-bold text-lg shadow-xl hover:shadow-[#00ff9d]/25 transition-all duration-300 hover:scale-105"
                            >
                                Comenzar Ahora
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default AboutPage;
