/**
 * Global Type Definitions for Predix
 * Centralized types for the entire application
 */

// ============================================
// User & Authentication Types
// ============================================

export interface User {
    id: number;
    uuid: string;
    email: string;
    username: string;
    full_name?: string;
    avatar_url?: string;
    bio?: string;
    location?: string; // Added missing field
    role: UserRole;
    is_active: boolean;
    is_verified: boolean;
    created_at: string;
    last_login_at?: string;
    current_plan?: Plan;
    two_factor_enabled?: boolean;
}

export enum UserRole {
    USER = 'user',
    PREMIUM = 'premium',
    ADMIN = 'admin',
}

export interface AuthTokens {
    access_token: string;
    refresh_token: string;
    token_type: string;
    expires_in: number;
}

export interface LoginResponse extends AuthTokens {
    user: User;
    requires_2fa?: boolean;
    temp_token?: string;
}

// Added missing types for auth forms
export interface LoginCredentials {
    email: string;
    password: string;
    two_factor_code?: string;
}

export interface RegisterCredentials {
    email: string;
    username: string;
    password: string;
    full_name?: string;
}

// ============================================
// Trend & Prediction Types
// ============================================

export interface Trend {
    id: number;
    uuid: string;
    platform: Platform;
    content_type: string;
    name: string;
    description?: string;
    views: number;
    likes: number;
    shares: number;
    comments: number;
    engagement_rate: number;
    growth_rate_24h: number;
    growth_rate_7d?: number;
    viral_score: number;
    confidence: number;
    metadata?: Record<string, any>;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export enum Platform {
    TIKTOK = 'tiktok',
    TWITTER = 'twitter',
    INSTAGRAM = 'instagram',
    YOUTUBE = 'youtube',
}

export interface TrendPrediction {
    id: number;
    uuid: string;
    user_id: number;
    trend_id?: number;
    input_data: TrendInputData;
    viral_score: number;
    confidence: number;
    growth_predictions: GrowthPredictions;
    components: PredictionComponents;
    explanation?: string;
    recommendations?: string[];
    created_at: string;
}

export interface TrendInputData {
    platform: Platform;
    name: string;
    views: number;
    likes: number;
    comments: number;
    shares: number;
    hashtags?: string[];
    description?: string;
}

export interface GrowthPredictions {
    '24h': number;
    '48h': number;
    '72h': number;
}

export interface PredictionComponents {
    engagement: number;
    content_quality: number;
    timing: number;
    network_effect?: number;
    sentiment?: number;
}

// Added missing prediction types
export type PredictionInput = TrendInputData;

export interface PredictionResult {
    viral_score: number;
    confidence: number;
    growth_predictions: GrowthPredictions;
    components: PredictionComponents;
    recommendations?: string[];
    explanation?: string;
}

// ============================================
// Alert Types
// ============================================

export interface Alert {
    id: number;
    uuid: string;
    user_id: number;
    type: AlertType;
    title: string;
    message: string;
    trend_data?: Record<string, any>;
    metadata?: { // Added missing metadata field
        trend_name?: string;
        viral_score?: number;
        [key: string]: any;
    };
    priority: AlertPriority;
    is_read: boolean;
    is_sent: boolean;
    created_at: string;
    read_at?: string;
}

export enum AlertType {
    VIRAL_SPIKE = 'viral_spike',
    MICROTREND = 'microtrend',
    TREND_UPDATE = 'trend_update',
    AI_RECOMMENDATION = 'ai_recommendation',
}

export enum AlertPriority {
    LOW = 'low',
    MEDIUM = 'medium',
    HIGH = 'high',
}

// ============================================
// Plan & Payment Types
// ============================================

export interface Plan {
    id: number;
    name: string;
    description?: string;
    price: number;
    currency: string;
    interval: BillingInterval;
    features: PlanFeatures;
    is_active: boolean;
}

export enum BillingInterval {
    MONTHLY = 'monthly',
    YEARLY = 'yearly',
}

export interface PlanFeatures {
    predictions_per_month: number;
    alerts_limit: number;
    advanced_analytics: boolean;
    api_access: boolean;
    priority_support: boolean;
    [key: string]: any;
}

export interface Payment {
    id: number;
    uuid: string;
    user_id: number;
    plan_id: number;
    amount: number;
    currency: string;
    status: PaymentStatus;
    external_payment_id?: string;
    payment_method?: string;
    created_at: string;
    paid_at?: string;
}

export enum PaymentStatus {
    PENDING = 'pending',
    COMPLETED = 'completed',
    FAILED = 'failed',
    CANCELLED = 'cancelled',
    REFUNDED = 'refunded',
}

// ============================================
// API Response Types
// ============================================

export interface APIResponse<T = any> {
    data?: T;
    message?: string;
    error?: string;
    errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
    items: T[];
    total: number;
    page: number;
    per_page: number;
    pages: number;
}

export interface ErrorResponse {
    error: string;
    message: string;
    status_code: number;
    details?: Record<string, any>;
}

// ============================================
// WebSocket Types
// ============================================

export interface WebSocketMessage {
    type: WSMessageType;
    data: any;
    timestamp: string;
}

export enum WSMessageType {
    TREND_UPDATE = 'trend_update',
    NEW_ALERT = 'new_alert',
    PREDICTION_COMPLETE = 'prediction_complete',
    SYSTEM_NOTIFICATION = 'system_notification',
    VIRAL_SPIKE = 'viral_spike', // Added missing
    PONG = 'pong', // Added missing
}

// ============================================
// Analytics Types
// ============================================

export interface UserStats {
    user_id: number;
    total_predictions: number;
    predictions_this_month: number; // Added missing
    total_alerts: number;
    avg_viral_score: number; // Added missing
    subscription: SubscriptionInfo;
    account_age_days: number;
    last_login?: string;
}

export interface SubscriptionInfo {
    plan: string;
    predictions_used: number;
    predictions_limit: number;
    expires_at?: string;
}

export interface AnalyticsData {
    period: TimePeriod;
    metrics: MetricsData;
    charts: ChartData[];
}

export enum TimePeriod {
    DAY = 'day',
    WEEK = 'week',
    MONTH = 'month',
    YEAR = 'year',
}

export interface MetricsData {
    total_views: number;
    total_engagement: number;
    avg_viral_score: number;
    top_platforms: Record<Platform, number>;
}

export interface ChartData {
    type: ChartType;
    labels: string[];
    datasets: Dataset[];
}

export enum ChartType {
    LINE = 'line',
    BAR = 'bar',
    PIE = 'pie',
    DOUGHNUT = 'doughnut',
}

export interface Dataset {
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string;
    borderWidth?: number;
}

// ============================================
// Component Props Types
// ============================================

export interface BaseComponentProps {
    className?: string;
    style?: React.CSSProperties;
    children?: React.ReactNode;
}

export interface TrendCardProps extends BaseComponentProps {
    trend: Trend;
    onClick?: (trend: Trend) => void;
    showActions?: boolean;
}

export interface PredictionFormProps extends BaseComponentProps {
    onSubmit: (data: TrendInputData) => Promise<void>;
    initialData?: Partial<TrendInputData>;
    loading?: boolean;
}

export interface AlertListProps extends BaseComponentProps {
    alerts: Alert[];
    onAlertClick?: (alert: Alert) => void;
    onMarkAsRead?: (alertId: number) => void;
    onDelete?: (alertId: number) => void;
}

// ============================================
// Store/State Types
// ============================================

export interface AppState {
    user: UserState;
    trends: TrendsState;
    predictions: PredictionsState;
    alerts: AlertsState;
    ui: UIState;
}

export interface UserState {
    current: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
}

export interface TrendsState {
    items: Trend[];
    selected: Trend | null;
    filters: TrendFilters;
    isLoading: boolean;
    error: string | null;
}

export interface TrendFilters {
    platform?: Platform;
    search?: string;
    minViralScore?: number;
    sortBy?: 'viral_score' | 'views' | 'created_at';
    sortOrder?: 'asc' | 'desc';
}

export interface PredictionsState {
    items: TrendPrediction[];
    current: TrendPrediction | null;
    isLoading: boolean;
    error: string | null;
}

export interface AlertsState {
    items: Alert[];
    unreadCount: number;
    isLoading: boolean;
    error: string | null;
}

export interface UIState {
    sidebarOpen: boolean;
    theme: 'light' | 'dark';
    notifications: Notification[];
}

export interface Notification {
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    message: string;
    duration?: number;
}

// ============================================
// Utility Types
// ============================================

export type AsyncFunction<T = any> = (...args: any[]) => Promise<T>;

export type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };
export type XOR<T, U> = T | U extends object
    ? (Without<T, U> & U) | (Without<U, T> & T)
    : T | U;

export type DeepPartial<T> = {
    [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;

// ============================================
// Settings Types
// ============================================

export interface NotificationSettings {
    email_notifications: boolean;
    push_notifications: boolean;
    viral_spike_alerts: boolean;
    microtrend_alerts: boolean;
    weekly_report: boolean;
}

export interface PrivacySettings {
    profile_visibility: 'public' | 'private';
    show_predictions: boolean;
    share_analytics: boolean;
}

// ============================================
// Form Types
// ============================================

export interface FormField<T = any> {
    value: T;
    error?: string;
    touched: boolean;
    dirty: boolean;
}

export interface FormState<T extends Record<string, any>> {
    fields: { [K in keyof T]: FormField<T[K]> };
    isValid: boolean;
    isSubmitting: boolean;
    error?: string;
}

export interface ValidationRule<T = any> {
    validate: (value: T) => boolean | string;
    message?: string;
}

// ============================================
// Export all types
// ============================================

// Export all types at module level - no need to re-export React
// (React is a global UMD and causes TS errors when re-exported from a module)
