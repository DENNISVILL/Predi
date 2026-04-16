import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    CreditCard,
    Lock,
    Shield,
    CheckCircle,
    AlertCircle,
    ArrowLeft,
    Calendar,
    User,
    Loader,
    ChevronRight,
    TrendingUp,
    Brain
} from 'lucide-react';
import useStore from '../store/useStore';
import { pricingPlans } from '../data/pricingData';
import { usePaddle } from './payments/usePaddle';

const PaymentPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useStore();

    // Get data passed from registration
    const [userData, setUserData] = useState(null);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [loading, setLoading] = useState(true);
    const [processingPayment, setProcessingPayment] = useState(false);
    const [paymentSuccess, setPaymentSuccess] = useState(false);
    const [cardNumber, setCardNumber] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [cvc, setCvc] = useState('');
    const [cardName, setCardName] = useState('');
    const [errors, setErrors] = useState({});

    useEffect(() => {
        // Validate access
        if (!location.state?.newUser || !location.state?.newUser.planId) {
            navigate('/register');
            return;
        }

        const user = location.state.newUser;
        const plan = pricingPlans.find(p => p.id === user.planId);

        if (!plan) {
            navigate('/pricing');
            return;
        }

        setUserData(user);
        setSelectedPlan(plan);
        setCardName(user.name); // Pre-fill name
        setLoading(false);
    }, [location.state, navigate]);

    const formatCardNumber = (value) => {
        const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        const matches = v.match(/\d{4,16}/g);
        const match = matches && matches[0] || '';
        const parts = [];
        for (let i = 0, len = match.length; i < len; i += 4) {
            parts.push(match.substring(i, i + 4));
        }
        if (parts.length) {
            return parts.join(' ');
        } else {
            return value;
        }
    };

    const formatExpiry = (value) => {
        const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        if (v.length >= 2) {
            return `${v.substring(0, 2)}/${v.substring(2, 4)}`;
        }
        return v;
    };

    const handleCardChange = (e) => {
        const val = e.target.value;
        if (val.length <= 19) {
            setCardNumber(formatCardNumber(val));
            if (errors.cardNumber) setErrors({ ...errors, cardNumber: '' });
        }
    };

    const handleExpiryChange = (e) => {
        const val = e.target.value;
        if (val.length <= 5) {
            setExpiryDate(formatExpiry(val));
            if (errors.expiryDate) setErrors({ ...errors, expiryDate: '' });
        }
    };

    const handleCvcChange = (e) => {
        const val = e.target.value;
        if (val.length <= 4) {
            setCvc(val.replace(/\D/g, ''));
            if (errors.cvc) setErrors({ ...errors, cvc: '' });
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (cardNumber.replace(/\s/g, '').length < 16) newErrors.cardNumber = 'Número inválido';
        if (expiryDate.length < 5) newErrors.expiryDate = 'Fecha inválida';
        if (cvc.length < 3) newErrors.cvc = 'CVC inválido';
        if (!cardName.trim()) newErrors.cardName = 'Nombre requerido';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const paddle = usePaddle();

    // Map internal Plan IDs to Paddle Product/Price IDs (Configure these in .env)
    const PLAN_IDS = {
        'starter': process.env.REACT_APP_PADDLE_STARTER_ID || 12345,
        'pro': process.env.REACT_APP_PADDLE_PRO_ID || 67890,
        'business': process.env.REACT_APP_PADDLE_BUSINESS_ID || 11223
    };

    const handlePayment = () => {
        if (!paddle || !selectedPlan) return;
        setProcessingPayment(true);

        const priceId = PLAN_IDS[selectedPlan.id];

        paddle.Checkout.open({
            product: priceId,
            email: userData.email,
            passthrough: JSON.stringify({ userId: userData.id || 'new_user' }), // Send metadata to webhook
            successCallback: (data) => {
                setProcessingPayment(false);
                setPaymentSuccess(true);

                // Optimistic UI update - Backend webhook will confirm actual status
                setTimeout(() => {
                    login({
                        ...userData,
                        status: 'active',
                        subscriptionStatus: 'active',
                        paymentMethod: 'paddle',
                        lastPayment: new Date().toISOString()
                    });
                    navigate('/dashboard');
                }, 2000);
            },
            closeCallback: () => {
                setProcessingPayment(false);
            }
        });
    };

    if (loading || !selectedPlan) {
        return (
            <div className="min-h-screen bg-[#0b0c10] flex items-center justify-center">
                <Loader className="w-8 h-8 text-[#00ff9d] animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0b0c10] flex">
            {/* SUCCESS OVERLAY */}
            <AnimatePresence>
                {paymentSuccess && (
                    <motion.div
                        className="fixed inset-0 z-50 bg-[#0b0c10] flex items-center justify-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        <div className="text-center">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                                className="w-24 h-24 bg-gradient-to-r from-[#00ff9d] to-[#00cc7a] rounded-full flex items-center justify-center mx-auto mb-6"
                            >
                                <CheckCircle className="w-12 h-12 text-[#0b0c10]" />
                            </motion.div>
                            <h2 className="text-3xl font-bold text-white mb-2">¡Pago Exitoso!</h2>
                            <p className="text-gray-400 mb-8">Bienvenido a Predix {selectedPlan.name}</p>
                            <p className="text-sm text-gray-500">Redirigiendo a tu dashboard...</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* LEFT SIDE: Payment Options */}
            <div className="flex-1 p-8 lg:p-12 overflow-y-auto">
                <div className="max-w-xl mx-auto">
                    <button
                        onClick={() => navigate('/pricing')}
                        className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" /> Volver
                    </button>

                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-white mb-2">Finalizar Suscripción</h1>
                        <p className="text-gray-400">Estás a un paso de acceder a Predix {selectedPlan.name}.</p>
                    </div>

                    {/* Paddle Checkout Section */}
                    <div className="bg-[#1f1f1f] border border-gray-700 rounded-2xl p-8 text-center">
                        <div className="flex justify-center mb-6">
                            <div className="w-16 h-16 bg-gradient-to-r from-[#007bff] to-[#00ff9d] rounded-2xl flex items-center justify-center p-0.5">
                                <div className="w-full h-full bg-[#1f1f1f] rounded-2xl flex items-center justify-center">
                                    <CreditCard className="w-8 h-8 text-[#00ff9d]" />
                                </div>
                            </div>
                        </div>

                        <h3 className="text-xl font-bold text-white mb-2">Pago Seguro con Paddle</h3>
                        <p className="text-gray-400 mb-8 max-w-xs mx-auto">
                            Procesamos pagos internacionales de forma segura. Aceptamos tarjetas y PayPal.
                        </p>

                        <button
                            onClick={handlePayment}
                            disabled={processingPayment || !paddle}
                            className="w-full bg-gradient-to-r from-[#007bff] to-[#00ff9d] text-white py-4 rounded-xl font-bold hover:shadow-lg hover:shadow-cyan-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transform hover:scale-[1.02] active:scale-[0.98]"
                        >
                            {!paddle ? (
                                <>
                                    <Loader className="w-5 h-5 animate-spin" /> Cargando Pasarela...
                                </>
                            ) : processingPayment ? (
                                <>
                                    <Loader className="w-5 h-5 animate-spin" /> Procesando...
                                </>
                            ) : (
                                <>
                                    Pagar Suscripción <ChevronRight className="w-5 h-5" />
                                </>
                            )}
                        </button>

                        <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-500">
                            <Shield className="w-4 h-4" />
                            <span>Pagos encriptados de extremo a extremo</span>
                        </div>

                        <div className="mt-8 pt-6 border-t border-gray-800 text-xs text-center text-gray-600">
                            Merchant of Record: Paddle.com Market Ltd.
                        </div>
                    </div>
                </div>
            </div>

            {/* RIGHT SIDE: Order Summary */}
            <div className="hidden lg:block w-[400px] bg-[#1f1f1f] p-12 border-l border-gray-800">
                <div className="sticky top-12">
                    <h2 className="text-xl font-bold text-white mb-6">Resumen del Pedido</h2>

                    <div className="space-y-6">
                        <div className="bg-[#0b0c10] rounded-xl p-4 border border-gray-800">
                            <div className="flex items-start gap-4">
                                <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${selectedPlan.color} flex items-center justify-center flex-shrink-0`}>
                                    <User className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-white">Plan {selectedPlan.name}</h3>
                                    <p className="text-sm text-gray-400">{selectedPlan.description}</p>
                                </div>
                            </div>

                            <div className="mt-4 pt-4 border-t border-gray-800 space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-400">Precio Mensual</span>
                                    <span className="text-white">${selectedPlan.price.monthly}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-400">Impuestos</span>
                                    <span className="text-white">$0.00</span>
                                </div>
                                <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-800 mt-2">
                                    <span className="text-white">Total Hoy</span>
                                    <span className="text-[#00ff9d]">${selectedPlan.price.monthly}</span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Incluye:</h3>
                            <ul className="space-y-3">
                                {selectedPlan.features.slice(0, 5).map((feature, i) => (
                                    <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                                        <CheckCircle className="w-4 h-4 text-[#00ff9d] flex-shrink-0 mt-0.5" />
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                            <div className="flex gap-2">
                                <TrendingUp className="w-5 h-5 text-blue-400 flex-shrink-0" />
                                <p className="text-xs text-blue-300">
                                    <span className="font-bold">Garantía de devolución:</span> Si no estás satisfecho en los primeros 14 días, te devolvemos el 100% de tu dinero.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentPage;
