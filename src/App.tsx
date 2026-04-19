import React, { useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Core Components
import EnhancedLanding from './components/EnhancedLanding';
import AuthPage from './components/AuthPage';
import Loading from './components/Loading';

// Lazy Loaded Components
const MainDashboard = lazy(() => import('./components/MainDashboard'));
const PricingPage = lazy(() => import('./components/PricingPage'));
const PaymentPage = lazy(() => import('./components/PaymentPage'));
const DemoPage = lazy(() => import('./components/DemoPage'));
const TrendAnalysisDetail = lazy(() => import('./components/TrendAnalysisDetail'));
const AffiliateDashboard = lazy(() => import('./components/AffiliateDashboard'));
const TechnologyPage = lazy(() => import('./components/TechnologyPage'));
const IndustriesPage = lazy(() => import('./components/IndustriesPage'));
const EnterprisePage = lazy(() => import('./components/EnterprisePage'));
const TermsPage = lazy(() => import('./components/TermsPage'));
const PrivacyPage = lazy(() => import('./components/PrivacyPage'));
const PricingTest = lazy(() => import('./components/PricingTest'));
const AdminAuth = lazy(() => import('./components/admin/AdminAuth'));
const AdminDashboard = lazy(() => import('./components/admin/AdminDashboard'));
const AboutPage = lazy(() => import('./components/AboutPage'));
const ContactPage = lazy(() => import('./components/ContactPage'));

// Posts, Predictions, Subscriptions
const PostsManager = lazy(() => import('./components/PostsManager'));
const PredictionsView = lazy(() => import('./components/PredictionsView'));
const SubscriptionPage = lazy(() => import('./components/SubscriptionPage'));
const ViralMusicTracker = lazy(() => import('./components/ViralMusicTracker'));

// God's Eye Modules
const GodsEyeLayout = lazy(() => import('./components/GodsEyeLayout'));
const GodsEyeDashboard = lazy(() => import('./components/GodsEyeDashboard'));
const CMBrainModule = lazy(() => import('./components/CMBrainModule'));
const OmniCalendar = lazy(() => import('./components/OmniCalendar'));
const CMVault = lazy(() => import('./components/CMVault'));

// NEW: Community Manager Automated Module
const CommunityManagerModule = lazy(() => import('./components/CommunityManagerModule'));

// Store & Hooks
import useStore from './store/useStore';
import { useAdminStore } from './store/useAdminStore';
import usePricingStore from './store/usePricingStore';
import { useNotifications } from './hooks/useNotifications';

const App: React.FC = () => {
    const { isAuthenticated, theme } = useStore();
    const { isAuthenticated: isAdminAuthenticated, initializeFromToken } = useAdminStore();
    const { currentPlan } = usePricingStore();
    const { requestPermission } = useNotifications();

    // Register Service Worker (Web PWA)
    useEffect(() => {
        if ('serviceWorker' in navigator && import.meta.env.PROD) {
            navigator.serviceWorker.register('/sw.js').catch(() => { });
        }
    }, []);

    // Initialize admin token
    useEffect(() => {
        initializeFromToken();
    }, [initializeFromToken]);

    // Request notification permissions when authenticated
    useEffect(() => {
        if (isAuthenticated) {
            requestPermission();
        }
    }, [isAuthenticated, requestPermission]);

    return (
        <div className={`min-h-screen ${theme === 'dark' ? 'bg-[#0b0c10]' : 'bg-gray-50'}`}>
            <Toaster
                position="top-right"
                toastOptions={{
                    duration: 4000,
                    style: {
                        background: theme === 'dark' ? '#1f1f1f' : '#ffffff',
                        color: theme === 'dark' ? '#ffffff' : '#000000',
                        border: `1px solid ${theme === 'dark' ? '#374151' : '#e5e7eb'}`,
                        borderRadius: '12px',
                    },
                }}
            />

            <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
                <Suspense fallback={<Loading />}>
                    <Routes>
                        {/* Public Routes */}
                        <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <EnhancedLanding />} />
                        <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <AuthPage />} />
                        <Route path="/register" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <AuthPage />} />
                        <Route path="/demo" element={<DemoPage />} />
                        <Route path="/pricing-test" element={<PricingTest />} />
                        <Route path="/technology" element={<TechnologyPage />} />
                        <Route path="/industries" element={<IndustriesPage />} />
                        <Route path="/enterprise" element={<EnterprisePage />} />
                        <Route path="/pricing" element={<PricingPage />} />
                        <Route path="/payment" element={<PaymentPage />} />
                        <Route path="/auth" element={<AuthPage />} />
                        <Route path="/demo-interactive" element={<DemoPage />} />
                        <Route path="/terms" element={<TermsPage />} />
                        <Route path="/privacy" element={<PrivacyPage />} />
                        <Route path="/about" element={<AboutPage />} />
                        <Route path="/contact" element={<ContactPage />} />

                        {/* God's Eye Modules */}
                        <Route element={<GodsEyeLayout />}>
                            <Route path="/gods-eye" element={<GodsEyeDashboard />} />
                            <Route path="/brain" element={<CMBrainModule />} />
                            <Route path="/calendar" element={<OmniCalendar />} />
                            <Route path="/vault" element={<CMVault />} />
                            <Route path="/music" element={<ViralMusicTracker />} />
                        </Route>

                        {/* Admin Routes */}
                        <Route path="/admin" element={isAdminAuthenticated ? <AdminDashboard /> : <AdminAuth />} />
                        <Route path="/admin/*" element={isAdminAuthenticated ? <AdminDashboard /> : <Navigate to="/admin" replace />} />

                        {/* Protected Routes */}
                        {isAuthenticated && (
                            <>
                                <Route path="/dashboard" element={<MainDashboard />} />
                                <Route path="/explore" element={<MainDashboard />} />
                                <Route path="/trend/:id" element={<TrendAnalysisDetail />} />
                                <Route path="/actions" element={<MainDashboard />} />
                                <Route path="/alerts" element={<MainDashboard />} />
                                <Route path="/settings" element={<MainDashboard />} />
                                <Route path="/affiliate" element={currentPlan === 'entrepreneur' ? <AffiliateDashboard /> : <Navigate to="/dashboard" replace />} />

                                {/* Posts Management */}
                                <Route path="/posts" element={<PostsManager />} />
                                <Route path="/posts/create" element={<PostsManager />} />

                                {/* AI Predictions */}
                                <Route path="/predictions" element={<PredictionsView />} />
                                <Route path="/predictions/history" element={<PredictionsView />} />

                                {/* Subscription & Billing */}
                                <Route path="/subscription" element={<SubscriptionPage />} />
                                <Route path="/billing" element={<SubscriptionPage />} />

                                {/* Viral Music Tracker */}
                                <Route path="/viral-music" element={<ViralMusicTracker />} />

                                {/* NEW: Community Manager Automated */}
                                <Route path="/community-manager" element={<CommunityManagerModule />} />
                                <Route path="/cm" element={<Navigate to="/community-manager" replace />} />
                            </>
                        )}

                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </Suspense>
            </Router>
        </div>
    );
};

export default App;
