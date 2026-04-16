import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Brain, FileText, CheckCircle, AlertTriangle } from 'lucide-react';

const TermsPage = () => {
    const navigate = useNavigate();

    const sections = [
        {
            title: "1. Aceptación de los Términos",
            content: "Al acceder y utilizar Predix, usted acepta estar sujeto a estos Términos y Condiciones. Si no está de acuerdo con alguna parte de estos términos, no podrá acceder al servicio."
        },
        {
            title: "2. Descripción del Servicio",
            content: "Predix es una plataforma de inteligencia artificial que proporciona predicciones de tendencias digitales basadas en análisis de Big Data. El servicio incluye acceso a dashboards, API, análisis predictivo y otras funcionalidades descritas en los planes de suscripción."
        },
        {
            title: "3. Registro y Cuenta",
            content: "Para utilizar Predix, debe registrarse proporcionando información precisa y completa. Usted es responsable de mantener la confidencialidad de su cuenta y contraseña. Debe notificarnos inmediatamente de cualquier uso no autorizado de su cuenta."
        },
        {
            title: "4. Suscripciones y Pagos",
            content: "Los servicios de pago son procesados por proveedores externos seguros (Merchant of Record). Al suscribirse, usted acepta los términos de servicio de nuestro procesador de pagos. Los pagos se renuevan automáticamente salvo cancelación al menos 24 horas antes del fin del periodo."
        },
        {
            title: "5. Uso Aceptable",
            content: "No puede usar Predix para: (a) actividades ilegales, (b) manipular mercados o engañar a usuarios, (c) realizar ingeniería inversa del servicio, (d) sobrecargar nuestros sistemas, o (e) revender el servicio sin autorización explícita."
        },
        {
            title: "6. Propiedad Intelectual",
            content: "Todo el contenido, tecnología, algoritmos y software de Predix son propiedad de Predix Inc. o sus licenciantes. No adquiere ningún derecho de propiedad sobre el servicio, solo una licencia limitada de uso según estos términos."
        },
        {
            title: "7. Limitación de Responsabilidad",
            content: "Predix se proporciona 'tal cual' sin garantías de ningún tipo. No garantizamos que el servicio será ininterrumpido o libre de errores. Nuestra responsabilidad total no excederá las tarifas pagadas por usted en los últimos 12 meses."
        },
        {
            title: "8. Protección de Datos",
            content: "El tratamiento de sus datos personales se rige por nuestra Política de Privacidad. Cumplimos con GDPR, CCPA y otras regulaciones de protección de datos aplicables."
        },
        {
            title: "9. Modificaciones",
            content: "Nos reservamos el derecho de modificar estos términos en cualquier momento. Los cambios significativos se notificarán con 30 días de anticipación. El uso continuado del servicio después de los cambios constituye su aceptación."
        },
        {
            title: "10. Terminación",
            content: "Podemos suspender o terminar su acceso si viola estos términos. Usted puede cancelar su cuenta en cualquier momento desde la configuración. Los datos se retendrán según nuestra política de retención."
        },
        {
            title: "11. Jurisdicción",
            content: "Estos términos se rigen por las leyes de Delaware, Estados Unidos. Cualquier disputa se resolverá mediante arbitraje vinculante según las reglas de la American Arbitration Association."
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
                        <div className="inline-flex items-center gap-3 bg-blue-500/10 border border-blue-500/30 rounded-full px-4 py-2 mb-6">
                            <FileText className="w-5 h-5 text-blue-400" />
                            <span className="text-blue-400 font-semibold">Términos y Condiciones</span>
                        </div>

                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                            Términos de Servicio
                        </h1>
                        <p className="text-gray-400 text-lg mb-2">
                            Última actualización: 20 de Diciembre, 2024
                        </p>
                        <p className="text-gray-500 text-sm">
                            Por favor, lea estos términos cuidadosamente antes de usar Predix
                        </p>
                    </motion.div>

                    {/* Important Notice */}
                    <motion.div
                        className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-6 mb-8"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <div className="flex items-start gap-3">
                            <AlertTriangle className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-0.5" />
                            <div>
                                <h3 className="text-yellow-400 font-semibold mb-2">Aviso Importante</h3>
                                <p className="text-gray-300 text-sm">
                                    Estos términos constituyen un acuerdo legal vinculante entre usted y Predix Inc.
                                    Al usar nuestros servicios, usted acepta cumplir con estos términos en su totalidad.
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Sections */}
                    <div className="space-y-6">
                        {sections.map((section, index) => (
                            <motion.div
                                key={index}
                                className="bg-gray-800/30 border border-gray-700/50 rounded-xl p-6"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 + index * 0.05 }}
                            >
                                <h2 className="text-xl font-bold text-white mb-3">{section.title}</h2>
                                <p className="text-gray-300 leading-relaxed">{section.content}</p>
                            </motion.div>
                        ))}
                    </div>

                    {/* Contact */}
                    <motion.div
                        className="mt-12 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/30 rounded-xl p-6"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1 }}
                    >
                        <div className="flex items-start gap-3">
                            <CheckCircle className="w-6 h-6 text-blue-400 flex-shrink-0 mt-0.5" />
                            <div>
                                <h3 className="text-white font-semibold mb-2">¿Preguntas sobre estos términos?</h3>
                                <p className="text-gray-300 text-sm mb-3">
                                    Si tiene alguna pregunta sobre estos Términos y Condiciones, puede contactarnos:
                                </p>
                                <ul className="text-gray-400 text-sm space-y-1">
                                    <li>• Email: legal@predix.com</li>
                                    <li>• Dirección: 123 Innovation Street, San Francisco, CA 94102</li>
                                    <li>• Teléfono: +1 (555) 123-4567</li>
                                </ul>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default TermsPage;
