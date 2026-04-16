/**
 * Subscriptions API Service
 * All API calls related to subscription management
 */
import apiClient from './apiClient';

export interface Plan {
    id: number;
    name: string;
    description: string;
    price: number;
    interval: string;
    features: Record<string, any>;
    is_active: boolean;
}

export interface CurrentSubscription {
    id?: number;
    user_id: number;
    plan?: Plan;
    status: string;
    is_active: boolean;
    expires_at?: string;
    days_remaining?: number | null;
}

export interface UsageStats {
    predictions_used: number;
    predictions_limit: number;
    percentage_used: number;
    resets_at?: string;
}

export interface PlanComparison {
    current_plan?: Plan;
    available_plans: Plan[];
    recommended_plan?: Plan;
}

export interface BillingHistory {
    payments: Payment[];
    total: number;
}

export interface Payment {
    id: number;
    uuid: string;
    amount: number;
    currency: string;
    status: string;
    paid_at?: string;
    created_at: string;
}

class SubscriptionsService {
    /**
     * Get all available plans
     */
    async getPlans(): Promise<Plan[]> {
        const response = await apiClient.get('/subscriptions/plans');
        return response.data as Plan[];
    }

    /**
     * Get current user's subscription
     */
    async getCurrentSubscription(): Promise<CurrentSubscription> {
        const response = await apiClient.get('/subscriptions/current');
        return response.data as CurrentSubscription;
    }

    /**
     * Upgrade to a new plan
     */
    async upgradePlan(data: { plan_id: number; prorate: boolean }): Promise<{
        message: string;
        plan: Plan;
        payment_url: string;
        payment_id: string;
        amount: number;
        currency: string;
    }> {
        const response = await apiClient.post('/subscriptions/upgrade', data);
        return response.data as {
            message: string;
            plan: Plan;
            payment_url: string;
            payment_id: string;
            amount: number;
            currency: string;
        };
    }

    /**
     * Downgrade to a lower plan
     */
    async downgradePlan(data: { plan_id: number }): Promise<{
        message: string;
        new_plan: Plan;
        current_plan?: Plan;
        effective_date: string;
    }> {
        const response = await apiClient.post('/subscriptions/downgrade', data);
        return response.data as {
            message: string;
            new_plan: Plan;
            current_plan?: Plan;
            effective_date: string;
        };
    }

    /**
     * Cancel subscription
     */
    async cancelSubscription(): Promise<{
        message: string;
        status: string;
        expires_at: string | null;
        access_until: string | null;
    }> {
        const response = await apiClient.post('/subscriptions/cancel');
        return response.data as {
            message: string;
            status: string;
            expires_at: string | null;
            access_until: string | null;
        };
    }

    /**
     * Reactivate cancelled subscription
     */
    async reactivateSubscription(): Promise<{
        message: string;
        plan: Plan;
        expires_at: string | null;
    }> {
        const response = await apiClient.post('/subscriptions/reactivate');
        return response.data as {
            message: string;
            plan: Plan;
            expires_at: string | null;
        };
    }

    /**
     * Get usage statistics
     */
    async getUsageStats(): Promise<UsageStats> {
        const response = await apiClient.get('/subscriptions/usage');
        return response.data as UsageStats;
    }

    /**
     * Compare plans
     */
    async comparePlans(): Promise<PlanComparison> {
        const response = await apiClient.get('/subscriptions/compare');
        return response.data as PlanComparison;
    }

    /**
     * Get billing history
     */
    async getBillingHistory(limit: number = 10): Promise<BillingHistory> {
        const response = await apiClient.get('/subscriptions/billing-history', {
            params: { limit }
        });
        return response.data as BillingHistory;
    }

    /**
     * Download invoice
     */
    async downloadInvoice(paymentId: string): Promise<Blob> {
        const response = await apiClient.get(`/subscriptions/invoices/${paymentId}`, {
            responseType: 'blob'
        });
        return response.data as Blob;
    }
}

export const subscriptionsService = new SubscriptionsService();
export default subscriptionsService;
