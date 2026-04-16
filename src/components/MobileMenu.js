import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { X, Menu, Sparkles, LogIn, UserPlus, Zap } from 'lucide-react';

const MobileMenu = () => {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);

    // Prevenir scroll cuando el menú está abierto
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    const menuItems = [
        { label: 'Quiénes Somos', path: '/about', icon: null },
        { label: 'Contáctanos', path: '/contact', icon: null },
        { label: 'Precios', path: '/pricing', icon: null },
    ];

    const actionButtons = [
        {
            label: 'Iniciar Sesión',
            path: '/login',
            icon: LogIn,
            primary: false
        },
        {
            label: 'Registrarse',
            path: '/register',
            icon: UserPlus,
            primary: false
        },
        {
            label: 'Demo Gratuito',
            path: '/demo-interactive',
            icon: Zap,
            primary: true
        },
    ];

    const handleNavigate = (path, onClick) => {
        if (onClick) {
            onClick();
        } else {
            setIsOpen(false);
            setTimeout(() => navigate(path), 300);
        }
    };

    return (
        <>
            {/* Hamburger Button - Solo visible en mobile */}
            <motion.button
                className="md:hidden relative z-50 p-2 text-white"
                onClick={() => setIsOpen(!isOpen)}
                whileTap={{ scale: 0.95 }}
                aria-label="Toggle menu"
            >
                {isOpen ? (
                    <X className="w-6 h-6" />
                ) : (
                    <Menu className="w-6 h-6" />
                )}
            </motion.button>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 md:hidden"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                        />

                        {/* Menu Panel */}
                        <motion.div
                            className="fixed right-0 top-0 bottom-0 w-80 bg-[#0b0c10] border-l border-gray-800/50 z-50 md:hidden overflow-y-auto"
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                        >
                            <div className="flex flex-col h-full">
                                {/* Header */}
                                <div className="flex items-center justify-between p-6 border-b border-gray-800/50">
                                    <div className="flex items-center gap-3">
                                        <img src="/logo.png" alt="Predix Logo" className="w-32 h-12 object-contain" />
                                    </div>
                                    <button
                                        onClick={() => setIsOpen(false)}
                                        className="text-gray-400 hover:text-white transition-colors"
                                    >
                                        <X className="w-6 h-6" />
                                    </button>
                                </div>

                                {/* Menu Items */}
                                <div className="flex-1 py-6">
                                    <nav className="space-y-2 px-6">
                                        {menuItems.map((item, index) => (
                                            <motion.button
                                                key={item.label}
                                                onClick={() => handleNavigate(item.path, item.onClick)}
                                                className="w-full text-left px-4 py-3 rounded-xl text-gray-300 hover:text-white hover:bg-white/5 transition-all duration-300 font-medium"
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: index * 0.05 }}
                                                whileTap={{ scale: 0.98 }}
                                            >
                                                {item.label}
                                            </motion.button>
                                        ))}
                                    </nav>

                                    {/* Divider */}
                                    <div className="my-6 border-t border-gray-800/50" />

                                    {/* Action Buttons */}
                                    <div className="space-y-3 px-6">
                                        {actionButtons.map((button, index) => {
                                            const Icon = button.icon;
                                            return (
                                                <motion.button
                                                    key={button.label}
                                                    onClick={() => handleNavigate(button.path)}
                                                    className={`w-full px-4 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${button.primary
                                                        ? 'bg-gradient-to-r from-[#007bff] to-[#00ff9d] text-white shadow-lg hover:shadow-xl'
                                                        : 'border border-gray-600 text-white hover:bg-white/5'
                                                        }`}
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: (menuItems.length + index) * 0.05 }}
                                                    whileTap={{ scale: 0.98 }}
                                                >
                                                    <Icon className="w-5 h-5" />
                                                    {button.label}
                                                </motion.button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Footer */}
                                <div className="p-6 border-t border-gray-800/50">
                                    <p className="text-center text-gray-400 text-sm">
                                        Predice el futuro digital antes que suceda
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

export default MobileMenu;
