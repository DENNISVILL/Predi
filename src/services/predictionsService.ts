/**
 * Predictions API Service
 * All API calls related to AI predictions
 */
import apiClient from './apiClient';

export interface Prediction {
    id: number;
    user_id: number;
    viral_score: number;
    confidence: number;
    input_data?: any;
    components?: Record<string, any>;
    growth_predictions?: Record<string, number>;
    explanation?: string;
    recommendations?: string[];
    created_at: string;
}

export interface PredictionCreate {
    content: string;
    platform?: string;
    hashtags?: string[];
    media_type?: string;
}

export interface BatchPredictionCreate {
    predictions: PredictionCreate[];
}

export interface PredictionHistory {
    predictions: Prediction[];
    platform_distribution: Record<string, number>;
    avg_score_by_platform: Record<string, number>;
}

export interface PredictionStats {
    total_predictions: number;
    avg_viral_score: number;
    avg_confidence: number;
    predictions_this_month: number;
    remaining_predictions: number;
}

export interface PredictionFeedback {
    was_accurate: boolean;
    actual_performance?: number;
    comments?: string;
}

class PredictionsService {
    /**
     * Create a new prediction
     */
    async createPrediction(data: PredictionCreate): Promise<Prediction> {
        const response = await apiClient.post('/predictions', data);
        return response.data as Prediction;
    }

    /**
     * Get list of predictions
     */
    async getPredictions(
        page: number = 1,
        limit: number = 10,
        sortBy: string = 'created_at'
    ): Promise<Prediction[]> {
        const response = await apiClient.get('/predictions', {
            params: {
                page,
                limit,
                sort_by: sortBy
            }
        });
        return response.data as Prediction[];
    }

    /**
     * Get a single prediction
     */
    async getPrediction(predictionId: number): Promise<Prediction> {
        const response = await apiClient.get(`/predictions/${predictionId}`);
        return response.data as Prediction;
    }

    /**
     * Create batch predictions
     */
    async createBatchPredictions(data: BatchPredictionCreate): Promise<Prediction[]> {
        const response = await apiClient.post('/predictions/batch', data);
        return response.data as Prediction[];
    }

    /**
     * Get prediction history
     */
    async getPredictionHistory(days: number = 30): Promise<PredictionHistory> {
        const response = await apiClient.get('/predictions/history', {
            params: { days }
        });
        return response.data as PredictionHistory;
    }

    /**
     * Get prediction statistics
     */
    async getPredictionStats(): Promise<PredictionStats> {
        const response = await apiClient.get('/predictions/stats/summary');
        return response.data as PredictionStats;
    }

    /**
     * Submit feedback for a prediction
     */
    async submitFeedback(predictionId: number, feedback: PredictionFeedback): Promise<{ message: string }> {
        const response = await apiClient.post(`/predictions/${predictionId}/feedback`, feedback);
        return response.data as { message: string };
    }

    /**
     * Download predictions as CSV
     */
    async downloadCSV(): Promise<Blob> {
        const response = await apiClient.get('/predictions/export/csv', {
            responseType: 'blob'
        });
        return response.data as Blob;
    }

    /**
     * Delete a prediction
     */
    async deletePrediction(predictionId: number): Promise<void> {
        await apiClient.delete(`/predictions/${predictionId}`);
    }
}

export const predictionsService = new PredictionsService();
export default predictionsService;
