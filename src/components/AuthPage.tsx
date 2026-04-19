// 🔐 PÁGINA AUTH UNIFICADA - LOGIN/REGISTER
import React, { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    ArrowLeft, Eye, EyeOff, Mail, Lock, User,
    AlertCircle, Loader, ArrowRight, Star,
    Shield, Zap, TrendingUp, Globe, LucideIcon
} from 'lucide-react';
import toast from 'react-hot-toast';

import { pricingPlans } from '../data/pricingData';
import useStore from '../store/useStore';

// ============================================
// TYPES & INTERFACES
// ============================================

interface FormData {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    company: string;
    acceptTerms: boolean;
}

interface FormErrors {
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    acceptTerms?: string;
}

interface Benefit {
    icon: LucideIcon;
    title: string;
    description: string;
}

interface Testimonial {
    quote: string;
    author: string;
    position: string;
    avatar: string;
}

interface LocationState {
    selectedPlanId?: string;
}

// ============================================
// COMPONENT
// ============================================

const AuthPage: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useStore();
    const [isLogin, setIsLogin] = useState<boolean>(true);
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [formData, setFormData] = useState<FormData>({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        company: '',
        acceptTerms: false
    });
    const [errors, setErrors] = useState<FormErrors>({});

    // Detectar ruta y cambiar modo automáticamente
    useEffect(() => {
        if (location.pathname === '/register') {
            setIsLogin(false);
        } else if (location.pathname === '/login') {
            setIsLogin(true);
        }
    }, [location.pathname]);

    const benefits: Benefit[] = [
        {
            icon: TrendingUp,
            title: "Predicciones Precisas",
            description: "99.7% de precisión en predicción de tendencias virales"
        },
        {
            icon: Zap,
            title: "Análisis en Tiempo Real",
            description: "Datos actualizados cada segundo para decisiones rápidas"
        },
        {
            icon: Shield,
            title: "Seguridad Enterprise",
            description: "Encriptación de extremo a extremo y cumplimiento GDPR"
        },
        {
            icon: Globe,
            title: "Cobertura Global",
            description: "Monitoreo de más de 50 plataformas en 40+ países"
        }
    ];

    const testimonials: Testimonial[] = [
        {
            quote: "Predix nos ayudó a incrementar nuestro engagement en 340% anticipando tendencias virales.",
            author: "Sarah Johnson",
            position: "CMO, TechCorp",
            avatar: "👩‍💼"
        },
        {
            quote: "La precisión de las predicciones es impresionante. ROI del 250% en el primer trimestre.",
            author: "Michael Chen",
            position: "Marketing Director",
            avatar: "👨‍💼"
        }
    ];

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));

        // Clear error when user starts typing
        if (errors[name as keyof FormErrors]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        if (!isLogin && !formData.name.trim()) {
            newErrors.name = 'El nombre es requerido';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'El email es requerido';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email inválido';
        }

        if (!formData.password) {
            newErrors.password = 'La contraseña es requerida';
        } else if (!isLogin && formData.password.length < 8) {
            newErrors.password = 'La contraseña debe tener al menos 8 caracteres';
        }

        if (!isLogin && formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Las contraseñas no coinciden';
        }

        if (!isLogin && !formData.acceptTerms) {
            newErrors.acceptTerms = 'Debes aceptar los términos y condiciones';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Get selected plan from navigation state or default to free
    const locationState = location.state as LocationState | null;
    const selectedPlanId = locationState?.selectedPlanId || 'free';
    const selectedPlan = pricingPlans.find(p => p.id === selectedPlanId) || pricingPlans[0]!;

    const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsLoading(true);

        // Simulate API call
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

        try {
            let response;
            if (isLogin) {
                response = await fetch(`${API_URL}/users/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: formData.email, password: formData.password })
                });
            } else {
                response = await fetch(`${API_URL}/users/register`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        name: formData.name,
                        username: formData.email.split('@')[0], // Generate a default username since form doesn't have it
                        email: formData.email,
                        password: formData.password
                    })
                });
            }

            const data = await response.json();

            if (response.ok) {
                // Success
                toast.success(isLogin ? 'Bienvenido de nuevo!' : 'Cuenta creada exitosamente');

                // Construct user object (merge data.user with plan details if registering)
                const userToLogin = {
                    ...data.user,
                    status: 'active', // Should come from backend ideally
                    planId: selectedPlan.id, // Should sync with backend
                    planName: selectedPlan.name
                };

                login(userToLogin);
                navigate('/dashboard');
            } else {
                toast.error(data.error || 'Error en autenticación');
                // setErrors({ submit: data.error || 'Error desconocido' });
            }
        } catch (error) {
            console.error('Auth Error:', error);
            
            // MODO DE PRUEBA OFFLINE (Temporal)
            toast.success('Modo de prueba: Entrando offline');
            const mockUser = {
                id: '12345',
                name: formData.name || 'Usuario de Prueba',
                email: formData.email,
                status: 'active',
                planId: selectedPlan.id,
                planName: selectedPlan.name
            };
            login(mockUser);
            navigate('/dashboard');
            
        } finally {
            setIsLoading(false);
        }
    };

    const switchMode = (): void => {
        setIsLogin(!isLogin);
        setErrors({});
        setFormData({
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
            company: '',
            acceptTerms: false
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex">
            {/* Left Panel - Form */}
            <div className="flex-1 flex items-center justify-center p-8">
                <div className="w-full max-w-md">
                    {/* Header */}
                    <motion.div
                        className="text-center mb-8"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <motion.button
                            onClick={() => navigate('/')}
                            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6"
                            whileHover={{ x: -5 }}
                        >
                            <ArrowLeft className="w-4 h-4" />
                            <span>Volver al inicio</span>
                        </motion.button>

                        <div className="flex items-center justify-center gap-3 mb-6">
                            <img src="/logo.png" alt="Predix Logo" className="w-32 h-16 object-contain" />
                        </div>

                        <h1 className="text-3xl font-bold text-white mb-2">
                            {isLogin ? 'Bienvenido de vuelta' : 'Únete a Predix'}
                        </h1>
                        <p className="text-gray-400">
                            {isLogin
                                ? 'Inicia sesión para acceder a tu dashboard'
                                : <span>Estás registrándote para el plan <span className="text-[#00ff9d] font-bold">{selectedPlan.name}</span></span>
                            }
                        </p>
                    </motion.div>

                    {/* Form */}
                    <motion.form
                        onSubmit={handleSubmit}
                        className="space-y-6"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        {/* Google Sign In Button */}
                        <motion.a
                            href={`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/auth/google`}
                            className="w-full bg-white text-gray-700 font-semibold py-3 rounded-lg flex items-center justify-center gap-3 hover:bg-gray-50 transition-all border border-gray-600 hover:border-gray-400 mb-6"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                    fill="#4285F4"
                                />
                                <path
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    fill="#34A853"
                                />
                                <path
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                    fill="#FBBC05"
                                />
                                <path
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                    fill="#EA4335"
                                />
                            </svg>
                            <span>Continuar con Google</span>
                        </motion.a>

                        <div className="relative flex items-center justify-center mb-6">
                            <div className="border-t border-gray-700 w-full absolute"></div>
                            <span className="bg-gray-900 px-4 text-xs text-gray-500 relative uppercase tracking-wider">
                                O continúa con email
                            </span>
                        </div>

                        {/* Name Field (Register only) */}
                        {!isLogin && (
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Nombre completo
                                </label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className={`w-full pl-10 pr-4 py-3 bg-gray-800/50 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${errors.name ? 'border-red-500' : 'border-gray-600'
                                            }`}
                                        placeholder="Tu nombre completo"
                                    />
                                </div>
                                {errors.name && (
                                    <p className="mt-1 text-sm text-red-400 flex items-center gap-1">
                                        <AlertCircle className="w-4 h-4" />
                                        {errors.name}
                                    </p>
                                )}
                            </div>
                        )}

                        {/* Email Field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Email
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className={`w-full pl-10 pr-4 py-3 bg-gray-800/50 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${errors.email ? 'border-red-500' : 'border-gray-600'
                                        }`}
                                    placeholder="tu@email.com"
                                />
                            </div>
                            {errors.email && (
                                <p className="mt-1 text-sm text-red-400 flex items-center gap-1">
                                    <AlertCircle className="w-4 h-4" />
                                    {errors.email}
                                </p>
                            )}
                        </div>

                        {/* Company Field (Register only) */}
                        {!isLogin && (
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Empresa (opcional)
                                </label>
                                <input
                                    type="text"
                                    name="company"
                                    value={formData.company}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                    placeholder="Nombre de tu empresa"
                                />
                            </div>
                        )}

                        {/* Password Field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Contraseña
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    className={`w-full pl-10 pr-12 py-3 bg-gray-800/50 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${errors.password ? 'border-red-500' : 'border-gray-600'
                                        }`}
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="mt-1 text-sm text-red-400 flex items-center gap-1">
                                    <AlertCircle className="w-4 h-4" />
                                    {errors.password}
                                </p>
                            )}
                        </div>

                        {/* Confirm Password (Register only) */}
                        {!isLogin && (
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Confirmar contraseña
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleInputChange}
                                        className={`w-full pl-10 pr-4 py-3 bg-gray-800/50 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${errors.confirmPassword ? 'border-red-500' : 'border-gray-600'
                                            }`}
                                        placeholder="••••••••"
                                    />
                                </div>
                                {errors.confirmPassword && (
                                    <p className="mt-1 text-sm text-red-400 flex items-center gap-1">
                                        <AlertCircle className="w-4 h-4" />
                                        {errors.confirmPassword}
                                    </p>
                                )}
                            </div>
                        )}

                        {/* Terms Checkbox (Register only) */}
                        {!isLogin && (
                            <div>
                                <label className="flex items-start gap-3">
                                    <input
                                        type="checkbox"
                                        name="acceptTerms"
                                        checked={formData.acceptTerms}
                                        onChange={handleInputChange}
                                        className="mt-1 w-4 h-4 text-blue-600 bg-gray-800 border-gray-600 rounded focus:ring-blue-500"
                                    />
                                    <span className="text-sm text-gray-300">
                                        Acepto los{' '}
                                        <button
                                            type="button"
                                            onClick={() => window.open('/terms', '_blank')}
                                            className="text-blue-400 hover:text-blue-300 underline bg-transparent border-none cursor-pointer"
                                        >
                                            términos y condiciones
                                        </button>{' '}
                                        y la{' '}
                                        <button
                                            type="button"
                                            onClick={() => window.open('/privacy', '_blank')}
                                            className="text-blue-400 hover:text-blue-300 underline bg-transparent border-none cursor-pointer"
                                        >
                                            política de privacidad
                                        </button>
                                    </span>
                                </label>
                                {errors.acceptTerms && (
                                    <p className="mt-1 text-sm text-red-400 flex items-center gap-1">
                                        <AlertCircle className="w-4 h-4" />
                                        {errors.acceptTerms}
                                    </p>
                                )}
                            </div>
                        )}

                        {/* Submit Button */}
                        <motion.button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 hover:from-blue-700 hover:to-cyan-600 transition-all disabled:opacity-50"
                            whileHover={{ scale: isLoading ? 1 : 1.02 }}
                            whileTap={{ scale: isLoading ? 1 : 0.98 }}
                        >
                            {isLoading ? (
                                <Loader className="w-5 h-5 animate-spin" />
                            ) : (
                                <>
                                    {isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
                                    <ArrowRight className="w-5 h-5" />
                                </>
                            )}
                        </motion.button>

                        {/* Switch Mode */}
                        <div className="text-center">
                            <span className="text-gray-400">
                                {isLogin ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}
                            </span>
                            <button
                                type="button"
                                onClick={switchMode}
                                className="ml-2 text-blue-400 hover:text-blue-300 font-semibold"
                            >
                                {isLogin ? 'Regístrate' : 'Inicia sesión'}
                            </button>
                        </div>
                    </motion.form>
                </div>
            </div>

            {/* Right Panel - Benefits */}
            <div className="hidden lg:flex flex-1 bg-gradient-to-br from-blue-600/20 to-cyan-500/20 p-8 items-center">
                <div className="w-full max-w-lg">
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <h2 className="text-3xl font-bold text-white mb-6">
                            Únete a miles de empresas que ya predicen el futuro
                        </h2>

                        <div className="space-y-6 mb-8">
                            {benefits.map((benefit, index) => (
                                <motion.div
                                    key={index}
                                    className="flex gap-4"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.3 + index * 0.1 }}
                                >
                                    <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <benefit.icon className="w-6 h-6 text-blue-400" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-white mb-1">{benefit.title}</h3>
                                        <p className="text-gray-400 text-sm">{benefit.description}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Testimonials */}
                        <div className="space-y-4">
                            {testimonials.map((testimonial, index) => (
                                <motion.div
                                    key={index}
                                    className="bg-gray-800/30 rounded-lg p-4 border border-gray-700/50"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.6 + index * 0.1 }}
                                >
                                    <div className="flex items-center gap-1 mb-2">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                                        ))}
                                    </div>
                                    <p className="text-gray-300 text-sm mb-3 italic">"{testimonial.quote}"</p>
                                    <div className="flex items-center gap-2">
                                        <span className="text-lg">{testimonial.avatar}</span>
                                        <div>
                                            <div className="text-white text-sm font-semibold">{testimonial.author}</div>
                                            <div className="text-gray-400 text-xs">{testimonial.position}</div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default AuthPage;
