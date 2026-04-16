/**
 * SubscriptionPage Component
 * Complete subscription management interface
 * Features: Plans comparison, upgrade/downgrade, billing history, usage stats
 */
import React, { useState, useEffect } from 'react';
import { subscriptionsService, Plan, CurrentSubscription, UsageStats, BillingHistory } from '../services/subscriptionsService';

interface SubscriptionPageProps {
    className?: string;
}

const SubscriptionPage: React.FC<SubscriptionPageProps> = ({ className = '' }) => {
    const [currentSubscription, setCurrentSubscription] = useState<CurrentSubscription | null>(null);
    const [plans, setPlans] = useState<Plan[]>([]);
    const [usageStats, setUsageStats] = useState<UsageStats | null>(null);
    const [billingHistory, setBillingHistory] = useState<BillingHistory | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        setError(null);
        try {
            const [subscription, plansData, usage, billing] = await Promise.all([
                subscriptionsService.getCurrentSubscription(),
                subscriptionsService.getPlans(),
                subscriptionsService.getUsageStats(),
                subscriptionsService.getBillingHistory()
            ]);

            setCurrentSubscription(subscription);
            setPlans(plansData);
            setUsageStats(usage);
            setBillingHistory(billing);
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Failed to load subscription data');
        } finally {
            setLoading(false);
        }
    };

    const handleUpgrade = async (plan: Plan) => {
        if (!window.confirm(`Upgrade to ${plan.name} plan for $${plan.price}/${plan.interval}?`)) return;

        setLoading(true);
        try {
            const response = await subscriptionsService.upgradePlan({ plan_id: plan.id, prorate: true });
            alert(response.message);

            // Open payment URL in new tab if provided
            if (response.payment_url) {
                window.open(response.payment_url, '_blank');
            }

            await loadData();
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Failed to upgrade plan');
        } finally {
            setLoading(false);
        }
    };

    const handleDowngrade = async (plan: Plan) => {
        if (!window.confirm(`Downgrade to ${plan.name} plan? This will take effect at the end of your billing period.`)) return;

        setLoading(true);
        try {
            const response = await subscriptionsService.downgradePlan({ plan_id: plan.id });
            alert(response.message);
            await loadData();
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Failed to downgrade plan');
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = async () => {
        if (!window.confirm('Are you sure you want to cancel your subscription? You will retain access until the end of your billing period.')) return;

        setLoading(true);
        try {
            const response = await subscriptionsService.cancelSubscription();
            alert(response.message);
            await loadData();
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Failed to cancel subscription');
        } finally {
            setLoading(false);
        }
    };


    const isCurrentPlan = (plan: Plan) => {
        return currentSubscription?.plan?.id === plan.id;
    };

    const canUpgrade = (plan: Plan) => {
        if (!currentSubscription?.plan) return plan.price > 0;
        return plan.price > currentSubscription.plan.price;
    };

    const canDowngrade = (plan: Plan) => {
        if (!currentSubscription?.plan) return false;
        return plan.price < currentSubscription.plan.price;
    };

    return (
        <div className={`subscription-page ${className}`}>
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-xl p-6 mb-6 text-white">
                <h1 className="text-3xl font-bold mb-2">💳 Subscription & Billing</h1>
                <p className="text-purple-100">Manage your plan, usage, and billing settings</p>
            </div>

            {/* Error */}
            {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-r-lg">
                    <div className="flex items-center">
                        <span className="text-red-500 mr-3 text-xl">⚠️</span>
                        <p className="text-red-700">{error}</p>
                        <button onClick={() => setError(null)} className="ml-auto text-red-500 hover:text-red-700">✖</button>
                    </div>
                </div>
            )}

            {/* Current Subscription Status */}
            {currentSubscription && (
                <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                    <div className="flex justify-between items-start">
                        <div className="flex-1">
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">Current Plan</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Plan</p>
                                    <p className="text-xl font-bold text-purple-600">
                                        {currentSubscription.plan?.name || 'Free'}
                                    </p>
                                    {currentSubscription.plan && (
                                        <p className="text-sm text-gray-600">
                                            ${currentSubscription.plan.price}/{currentSubscription.plan.interval}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Status</p>
                                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${currentSubscription.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                        }`}>
                                        {currentSubscription.status.toUpperCase()}
                                    </span>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Renews/Expires</p>
                                    <p className="text-lg font-semibold text-gray-800">
                                        {currentSubscription.expires_at
                                            ? new Date(currentSubscription.expires_at).toLocaleDateString()
                                            : 'N/A'}
                                    </p>
                                    {currentSubscription.days_remaining !== null && (
                                        <p className="text-sm text-gray-600">{currentSubscription.days_remaining} days remaining</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {currentSubscription.plan && (
                            <button
                                onClick={handleCancel}
                                className="px-4 py-2 border-2 border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-all font-semibold"
                                disabled={loading}
                            >
                                Cancel Subscription
                            </button>
                        )}
                    </div>
                </div>
            )}

            {/* Usage Stats */}
            {usageStats && (
                <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-6 mb-6 border-2 border-purple-200">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">📊 Usage Statistics</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm font-semibold text-gray-700">Predictions Used</span>
                                <span className="text-2xl font-bold text-purple-600">
                                    {usageStats.predictions_used} / {usageStats.predictions_limit === -1 ? '∞' : usageStats.predictions_limit}
                                </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all"
                                    style={{
                                        width: usageStats.predictions_limit === -1
                                            ? '100%'
                                            : `${Math.min(usageStats.percentage_used, 100)}%`
                                    }}
                                />
                            </div>
                            <p className="text-xs text-gray-600 mt-1">{usageStats.percentage_used.toFixed(1)}% used</p>
                        </div>
                        <div className="flex items-center justify-center">
                            <div className="text-center">
                                <p className="text-sm text-gray-600 mb-1">Resets</p>
                                <p className="text-lg font-bold text-gray-800">
                                    {usageStats.resets_at
                                        ? new Date(usageStats.resets_at).toLocaleDateString()
                                        : 'Never'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Available Plans */}
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Available Plans</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {plans.map(plan => {
                        const isCurrent = isCurrentPlan(plan);

                        return (
                            <div
                                key={plan.id}
                                className={`bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all border-2 ${isCurrent ? 'border-purple-500 ring-4 ring-purple-100' : 'border-gray-200 hover:border-purple-300'
                                    } overflow-hidden`}
                            >
                                {/* Plan Header */}
                                <div className={`bg-gradient-to-r ${plan.price === 0 ? 'from-gray-500 to-gray-600' :
                                    plan.price < 100 ? 'from-blue-500 to-blue-600' :
                                        'from-purple-500 to-purple-600'
                                    } px-6 py-4 text-white`}>
                                    <div className="flex justify-between items-start">
                                        <h3 className="text-2xl font-bold">{plan.name}</h3>
                                        {isCurrent && (
                                            <span className="bg-white bg-opacity-30 px-2 py-1 rounded text-xs font-semibold">
                                                CURRENT
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-sm opacity-90 mt-1">{plan.description}</p>
                                </div>

                                {/* Pricing */}
                                <div className="px-6 py-6">
                                    <div className="mb-6">
                                        <div className="flex items-baseline">
                                            <span className="text-5xl font-bold text-gray-900">${plan.price}</span>
                                            <span className="ml-2 text-gray-600">/{plan.interval}</span>
                                        </div>
                                    </div>

                                    {/* Features */}
                                    <ul className="space-y-3 mb-6">
                                        {Object.entries(plan.features).map(([key, value]) => {
                                            const isEnabled = value === true || value === -1 || (typeof value === 'number' && value > 0);
                                            const displayValue = value === -1 ? 'Unlimited' :
                                                value === true ? 'Included' :
                                                    value === false ? 'Not included' :
                                                        value;

                                            return (
                                                <li key={key} className="flex items-start">
                                                    <span className={`mr-2 ${isEnabled ? 'text-green-500' : 'text-gray-300'}`}>
                                                        {isEnabled ? '✓' : '✗'}
                                                    </span>
                                                    <span className={`text-sm ${isEnabled ? 'text-gray-700' : 'text-gray-400'}`}>
                                                        <strong className="capitalize">{key.replace(/_/g, ' ')}:</strong> {displayValue}
                                                    </span>
                                                </li>
                                            );
                                        })}
                                    </ul>

                                    {/* Action Button */}
                                    {isCurrent ? (
                                        <div className="bg-purple-100 text-purple-700 py-3 rounded-lg text-center font-semibold">
                                            Current Plan ✓
                                        </div>
                                    ) : canUpgrade(plan) ? (
                                        <button
                                            onClick={() => handleUpgrade(plan)}
                                            disabled={loading}
                                            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg transform hover:scale-[1.02]"
                                        >
                                            ⬆ Upgrade to {plan.name}
                                        </button>
                                    ) : canDowngrade(plan) ? (
                                        <button
                                            onClick={() => handleDowngrade(plan)}
                                            disabled={loading}
                                            className="w-full border-2 border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                        >
                                            ⬇ Downgrade to {plan.name}
                                        </button>
                                    ) : null}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Billing History */}
            {billingHistory && billingHistory.payments.length > 0 && (
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">💰 Billing History</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b-2 border-gray-200">
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Date</th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">ID</th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Amount</th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Paid</th>
                                </tr>
                            </thead>
                            <tbody>
                                {billingHistory.payments.map(payment => (
                                    <tr key={payment.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                        <td className="py-3 px-4 text-sm text-gray-700">
                                            {new Date(payment.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="py-3 px-4 text-sm text-gray-600 font-mono">
                                            {payment.uuid.substring(0, 8)}...
                                        </td>
                                        <td className="py-3 px-4 text-sm font-semibold text-gray-800">
                                            ${payment.amount} {payment.currency}
                                        </td>
                                        <td className="py-3 px-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${payment.status === 'completed' ? 'bg-green-100 text-green-800' :
                                                payment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                    payment.status === 'failed' ? 'bg-red-100 text-red-800' :
                                                        'bg-gray-100 text-gray-800'
                                                }`}>
                                                {payment.status.toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 text-sm text-gray-600">
                                            {payment.paid_at
                                                ? new Date(payment.paid_at).toLocaleDateString()
                                                : '-'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="mt-4 text-sm text-gray-600 text-right">
                        Total payments: {billingHistory.total}
                    </div>
                </div>
            )}

            {/* Footer Info */}
            <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
                <h3 className="text-lg font-bold text-gray-800 mb-3">💡 Subscription Info</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-start">
                        <span className="text-blue-500 mr-2">•</span>
                        <span>Upgrades take effect immediately and you'll be charged the prorated amount</span>
                    </li>
                    <li className="flex items-start">
                        <span className="text-blue-500 mr-2">•</span>
                        <span>Downgrades take effect at the end of your current billing period</span>
                    </li>
                    <li className="flex items-start">
                        <span className="text-blue-500 mr-2">•</span>
                        <span>Cancellations retain access until the end of your billing period</span>
                    </li>
                    <li className="flex items-start">
                        <span className="text-blue-500 mr-2">•</span>
                        <span>All plans include unlimited users and API access</span>
                    </li>
                </ul>
            </div>

            {/* Loading Overlay */}
            {loading && (
                <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-8 shadow-2xl">
                        <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-500 border-t-transparent mx-auto mb-4"></div>
                        <p className="text-gray-700 font-semibold">Processing...</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SubscriptionPage;
