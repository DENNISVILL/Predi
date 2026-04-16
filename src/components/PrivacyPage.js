import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Brain, Shield, Lock, Eye, Database, Users, Bell } from 'lucide-react';

const PrivacyPage = () => {
    const navigate = useNavigate();

    const sections = [
        {
            icon: Database,
            title: "1. Información que Recopilamos",
            content: "Recopilamos información que usted proporciona directamente (nombre, email, datos de pago), información automática (cookies, logs de uso, dirección IP), y datos de terceros (integraciones autorizadas con otras plataformas)."
        },
        {
            icon: Eye,
            title: "2. Cómo Usamos su Información",
            content: "Utilizamos sus datos para: (a) proporcionar y mejorar nuestros servicios, (b) personalizar su experiencia, (c) procesar pagos, (d) enviar comunicaciones de servicio, (e) realizar análisis y research, (f) cumplir con obligaciones legales."
        },
        {
            icon: Users,
            title: "3. Compartir Información",
            content: "No vendemos sus datos personales. Compartimos información solo con: proveedores de servicios (procesadores de pago, hosting), cuando lo requiera la ley, en caso de fusión/adquisición, y con su consentimiento explícito para integraciones de terceros."
        },
        {
            icon: Lock,
            title: "4. Seguridad de Datos",
            content: "Implementamos medidas técnicas y organizativas avanzadas: encriptación AES-256, TLS 1.3 para transmisión, autenticación multi-factor, auditorías de seguridad regulares, cumplimiento SOC2 Type II, y backups cifrados diarios."
        },
        {
            icon: Shield,
            title: "5. Sus Derechos (GDPR/CCPA)",
            content: "Tiene derecho a: acceder a sus datos, rectificar información incorrecta, solicitar eliminación, oponerse al procesamiento, portabilidad de datos, revocar consentimientos, y no ser sujeto a decisiones automatizadas sin revisión humana."
        },
        {
            icon: Bell,
            title: "6. Cookies y Tecnologías de Seguimiento",
            content: "Usamos cookies esenciales (funcionalidad), analíticas (Google Analytics), funcionales (preferencias de usuario), y publicitarias (remarketing). Puede controlar las cookies desde la configuración de su navegador."
        }
    ];

    const dataTypes = [
        {
            category: "Información Personal",
            items: ["Nombre completo", "Dirección de email", "Teléfono (opcional)", "Empresa y cargo"]
        },
        {
            category: "Información de Pago",
            items: ["Método de pago", "Dirección de facturación", "Historial de transacciones", "Datos procesados por Pasarela Segura (PCI-DSS)"]
        },
        {
            category: "Datos de Uso",
            items: ["Patrones de navegación", "Features utilizados", "Tiempo en plataforma", "Consultas realizadas"]
        },
        {
            category: "Información Técnica",
            items: ["Dirección IP", "Tipo de navegador", "Dispositivo", "Sistema operativo"]
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
            {/* Navbar */}
            <nav className="fixed top-0 w-full z-50 bg-black/90 backdrop-blur-xl border-b border-gray-800/50">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <button
                        onClick={() => navigate('/')}
                        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span>Volver</span>
                    </button>

                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-[#007bff] to-[#00ff9d] rounded-xl flex items-center justify-center">
                            <Brain className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-bold text-white">Predix</span>
                    </div>

                    <div className="w-20"></div>
                </div>
            </nav>

            {/* Content */}
            <div className="pt-24 pb-16 px-6">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <motion.div
                        className="text-center mb-12"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <div className="inline-flex items-center gap-3 bg-green-500/10 border border-green-500/30 rounded-full px-4 py-2 mb-6">
                            <Shield className="w-5 h-5 text-green-400" />
                            <span className="text-green-400 font-semibold">Política de Privacidad</span>
                        </div>

                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                            Tu <span className="bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">Privacidad</span> es Nuestra Prioridad
                        </h1>
                        <p className="text-gray-400 text-lg mb-2">
                            Última actualización: 20 de Diciembre, 2024
                        </p>
                        <p className="text-gray-500 text-sm">
                            Cumplimos con GDPR, CCPA, y las regulaciones de privacidad más estrictas
                        </p>
                    </motion.div>

                    {/* Trust Badge */}
                    <motion.div
                        className="bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/30 rounded-xl p-6 mb-8"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <div className="flex items-center justify-center gap-8 flex-wrap">
                            <div className="text-center">
                                <Lock className="w-8 h-8 text-green-400 mx-auto mb-2" />
                                <p className="text-white font-semibold text-sm">SOC2 Certified</p>
                            </div>
                            <div className="text-center">
                                <Shield className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                                <p className="text-white font-semibold text-sm">GDPR Compliant</p>
                            </div>
                            <div className="text-center">
                                <Database className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                                <p className="text-white font-semibold text-sm">Encrypted Data</p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Data Types */}
                    <motion.div
                        className="mb-12"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <h2 className="text-2xl font-bold text-white mb-6">Tipos de Datos que Recopilamos</h2>
                        <div className="grid md:grid-cols-2 gap-4">
                            {dataTypes.map((type, index) => (
                                <div key={index} className="bg-gray-800/30 border border-gray-700/50 rounded-xl p-5">
                                    <h3 className="text-white font-semibold mb-3">{type.category}</h3>
                                    <ul className="space-y-2">
                                        {type.items.map((item, i) => (
                                            <li key={i} className="flex items-start gap-2">
                                                <div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                                                <span className="text-gray-300 text-sm">{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Main Sections */}
                    <div className="space-y-6">
                        {sections.map((section, index) => (
                            <motion.div
                                key={index}
                                className="bg-gray-800/30 border border-gray-700/50 rounded-xl p-6"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.4 + index * 0.05 }}
                            >
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                                        <section.icon className="w-6 h-6 text-green-400" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-white mb-3">{section.title}</h2>
                                        <p className="text-gray-300 leading-relaxed">{section.content}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Retention */}
                    <motion.div
                        className="mt-8 bg-blue-500/10 border border-blue-500/30 rounded-xl p-6"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1 }}
                    >
                        <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                            <Database className="w-5 h-5 text-blue-400" />
                            Retención de Datos
                        </h3>
                        <p className="text-gray-300 text-sm">
                            Retenemos sus datos mientras su cuenta esté activa o según sea necesario para proporcionarle servicios.
                            Tras la cancelación, conservamos datos durante 90 días para recuperación de cuenta, luego se eliminan permanentemente
                            excepto lo requerido por ley (facturas por 7 años).
                        </p>
                    </motion.div>

                    {/* Contact */}
                    <motion.div
                        className="mt-8 bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/30 rounded-xl p-6"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.1 }}
                    >
                        <h3 className="text-white font-semibold mb-2">Ejercer sus Derechos de Privacidad</h3>
                        <p className="text-gray-300 text-sm mb-3">
                            Para solicitudes relacionadas con privacidad GDPR/CCPA, contáctenos:
                        </p>
                        <ul className="text-gray-400 text-sm space-y-1">
                            <li>• Email: privacy@predix.com</li>
                            <li>• Formulario: predix.com/privacy-request</li>
                            <li>• DPO: dpo@predix.com</li>
                        </ul>
                        <p className="text-gray-500 text-xs mt-3">
                            Responderemos a todas las solicitudes dentro de 30 días según GDPR.
                        </p>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPage;
