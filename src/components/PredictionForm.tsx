/**
 * PredictionForm Component - TypeScript
 * Form for creating AI trend predictions with validation
 */

import React, { useState, useCallback, useMemo } from 'react';
import { Platform } from '../types';
import type { PredictionInput, PredictionResult } from '../types';
import { captureException } from '../utils/sentry';

interface PredictionFormProps {
    onSubmit: (data: PredictionInput) => Promise<PredictionResult>;
    initialData?: Partial<PredictionInput>;
    showDescription?: boolean;
    showHashtags?: boolean;
    showHelperText?: boolean;
    showReset?: boolean;
    showExampleButton?: boolean;
    className?: string;
}

interface FormErrors {
    platform?: string;
    name?: string;
    views?: string;
    likes?: string;
    comments?: string;
    shares?: string;
    description?: string;
    hashtags?: string;
}

const PLATFORMS: Platform[] = [Platform.TIKTOK, Platform.TWITTER, Platform.INSTAGRAM, Platform.YOUTUBE];

const EXAMPLE_DATA: PredictionInput = {
    platform: Platform.TIKTOK,
    name: '#ViralDanceChallenge',
    views: 1500000,
    likes: 75000,
    comments: 5000,
    shares: 15000,
    description: 'trending dance challenge going viral',
    hashtags: ['#dance', '#viral', '#trending'],
};

export const PredictionForm: React.FC<PredictionFormProps> = ({
    onSubmit,
    initialData,
    showDescription = false,
    showHashtags = false,
    showHelperText = false,
    showReset = false,
    showExampleButton = false,
    className = '',
}) => {
    // Form state
    const [formData, setFormData] = useState<Partial<PredictionInput>>({
        platform: initialData?.platform || undefined,
        name: initialData?.name || '',
        views: initialData?.views || undefined,
        likes: initialData?.likes || undefined,
        comments: initialData?.comments || undefined,
        shares: initialData?.shares || undefined,
        description: initialData?.description || '',
        hashtags: initialData?.hashtags || [],
    });

    const [errors, setErrors] = useState<FormErrors>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [serverError, setServerError] = useState<string | null>(null);

    // Calculate engagement rate
    const engagementRate = useMemo(() => {
        const { views, likes, comments, shares } = formData;
        if (!views || views === 0) return 0;

        const totalEngagement = (likes || 0) + (comments || 0) + (shares || 0);
        return (totalEngagement / views) * 100;
    }, [formData.views, formData.likes, formData.comments, formData.shares]);

    // Check for unusually high engagement
    const hasHighEngagement = useMemo(() => {
        return engagementRate > 15; // More than 15% is suspicious
    }, [engagementRate]);

    // Update form field
    const updateField = useCallback(<K extends keyof PredictionInput>(
        field: K,
        value: PredictionInput[K]
    ) => {
        setFormData(prev => ({ ...prev, [field]: value }));

        // Clear error for this field
        setErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors[field as keyof FormErrors];
            return newErrors;
        });

        // Clear server error on any change
        if (serverError) {
            setServerError(null);
        }
    }, [serverError]);

    // Validate form
    const validateForm = useCallback((): boolean => {
        const validationErrors: FormErrors = {};

        // Platform required
        if (!formData.platform) {
            validationErrors.platform = 'Platform is required';
        }

        // Name required and format
        if (!formData.name) {
            validationErrors.name = 'Trend name is required';
        } else if (!formData.name.startsWith('#')) {
            validationErrors.name = 'Trend name must start with #';
        }

        // Views required and minimum
        if (!formData.views) {
            validationErrors.views = 'Views are required';
        } else if (formData.views < 1000) {
            validationErrors.views = 'Minimum 1,000 views required';
        } else if (formData.views < 0) {
            validationErrors.views = 'Views must be positive';
        }

        // Likes validation
        if (formData.likes !== undefined && formData.likes < 0) {
            validationErrors.likes = 'Likes must be positive';
        }

        // Comments validation
        if (formData.comments !== undefined && formData.comments < 0) {
            validationErrors.comments = 'Comments must be positive';
        }

        // Shares validation
        if (formData.shares !== undefined && formData.shares < 0) {
            validationErrors.shares = 'Shares must be positive';
        }

        setErrors(validationErrors);
        return Object.keys(validationErrors).length === 0;
    }, [formData]);

    // Handle submit
    const handleSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);
        setServerError(null);

        try {
            const result = await onSubmit(formData as PredictionInput);

            // Success - form will be reset by parent component
            console.log('Prediction successful:', result);

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Prediction failed';
            setServerError(errorMessage);
            captureException(error as Error);
        } finally {
            setIsSubmitting(false);
        }
    }, [formData, validateForm, onSubmit]);

    // Handle reset
    const handleReset = useCallback(() => {
        setFormData({
            platform: undefined,
            name: '',
            views: undefined,
            likes: undefined,
            comments: undefined,
            shares: undefined,
            description: '',
            hashtags: [],
        });
        setErrors({});
        setServerError(null);
    }, []);

    // Fill with example data
    const fillExample = useCallback(() => {
        setFormData(EXAMPLE_DATA);
        setErrors({});
        setServerError(null);
    }, []);

    // Handle keyboard submit (Enter in last field)
    const handleKeyDown = useCallback((e: React.KeyboardEvent, isLastField: boolean) => {
        if (e.key === 'Enter' && isLastField) {
            handleSubmit(e as any);
        }
    }, [handleSubmit]);

    return (
        <form
            className={`prediction-form ${className}`}
            onSubmit={handleSubmit}
            noValidate
        >
            {/* Title */}
            <h2 className="prediction-form__title">Create AI Prediction</h2>

            {/* Server Error */}
            {serverError && (
                <div className="alert alert--error" role="alert">
                    {serverError}
                </div>
            )}

            {/* Platform Select */}
            <div className="form-group">
                <label htmlFor="platform" className="form-label">
                    Platform *
                </label>
                <select
                    id="platform"
                    className={`form-select ${errors.platform ? 'form-select--error' : ''}`}
                    value={formData.platform || ''}
                    onChange={(e) => updateField('platform', e.target.value as Platform)}
                    aria-invalid={!!errors.platform}
                    aria-describedby={errors.platform ? 'platform-error' : undefined}
                >
                    <option value="">Select platform</option>
                    {PLATFORMS.map(platform => (
                        <option key={platform} value={platform}>
                            {platform.charAt(0).toUpperCase() + platform.slice(1)}
                        </option>
                    ))}
                </select>
                {errors.platform && (
                    <span id="platform-error" className="form-error">{errors.platform}</span>
                )}
            </div>

            {/* Trend Name */}
            <div className="form-group">
                <label htmlFor="name" className="form-label">
                    Trend Name / Hashtag *
                </label>
                <input
                    id="name"
                    type="text"
                    className={`form-input ${errors.name ? 'form-input--error' : ''}`}
                    value={formData.name || ''}
                    onChange={(e) => updateField('name', e.target.value)}
                    placeholder="#TrendingHashtag"
                    aria-invalid={!!errors.name}
                    aria-describedby={errors.name ? 'name-error' : undefined}
                />
                {showHelperText && !errors.name && (
                    <span className="form-helper">Start with # for hashtags</span>
                )}
                {errors.name && (
                    <span id="name-error" className="form-error">{errors.name}</span>
                )}
            </div>

            {/* Views */}
            <div className="form-group">
                <label htmlFor="views" className="form-label">
                    Total Views *
                </label>
                <input
                    id="views"
                    type="number"
                    className={`form-input ${errors.views ? 'form-input--error' : ''}`}
                    value={formData.views || ''}
                    onChange={(e) => updateField('views', parseInt(e.target.value) || 0)}
                    placeholder="1000000"
                    min="1000"
                    aria-invalid={!!errors.views}
                    aria-describedby={errors.views ? 'views-error' : undefined}
                />
                {showHelperText && !errors.views && (
                    <span className="form-helper">Enter total view count</span>
                )}
                {errors.views && (
                    <span id="views-error" className="form-error">{errors.views}</span>
                )}
            </div>

            {/* Likes */}
            <div className="form-group">
                <label htmlFor="likes" className="form-label">
                    Likes
                </label>
                <input
                    id="likes"
                    type="number"
                    className={`form-input ${errors.likes ? 'form-input--error' : ''}`}
                    value={formData.likes || ''}
                    onChange={(e) => updateField('likes', parseInt(e.target.value) || 0)}
                    placeholder="50000"
                    min="0"
                    aria-invalid={!!errors.likes}
                />
                {showHelperText && !errors.likes && (
                    <span className="form-helper">Number of likes received</span>
                )}
                {errors.likes && (
                    <span className="form-error">{errors.likes}</span>
                )}
            </div>

            {/* Comments */}
            <div className="form-group">
                <label htmlFor="comments" className="form-label">
                    Comments
                </label>
                <input
                    id="comments"
                    type="number"
                    className={`form-input ${errors.comments ? 'form-input--error' : ''}`}
                    value={formData.comments || ''}
                    onChange={(e) => updateField('comments', parseInt(e.target.value) || 0)}
                    placeholder="5000"
                    min="0"
                    aria-invalid={!!errors.comments}
                />
                {errors.comments && (
                    <span className="form-error">{errors.comments}</span>
                )}
            </div>

            {/* Shares */}
            <div className="form-group">
                <label htmlFor="shares" className="form-label">
                    Shares / Retweets
                </label>
                <input
                    id="shares"
                    type="number"
                    className={`form-input ${errors.shares ? 'form-input--error' : ''}`}
                    value={formData.shares || ''}
                    onChange={(e) => updateField('shares', parseInt(e.target.value) || 0)}
                    onKeyDown={(e) => handleKeyDown(e, !showDescription && !showHashtags)}
                    placeholder="10000"
                    min="0"
                    aria-invalid={!!errors.shares}
                />
                {errors.shares && (
                    <span className="form-error">{errors.shares}</span>
                )}
            </div>

            {/* Description (Optional) */}
            {showDescription && (
                <div className="form-group">
                    <label htmlFor="description" className="form-label">
                        Description (Optional)
                    </label>
                    <textarea
                        id="description"
                        className="form-textarea"
                        value={formData.description || ''}
                        onChange={(e) => updateField('description', e.target.value)}
                        placeholder="Brief description of the trend..."
                        rows={3}
                    />
                </div>
            )}

            {/* Hashtags (Optional) */}
            {showHashtags && (
                <div className="form-group">
                    <label htmlFor="hashtags" className="form-label">
                        Related Hashtags (Optional)
                    </label>
                    <input
                        id="hashtags"
                        type="text"
                        className="form-input"
                        value={formData.hashtags?.join(', ') || ''}
                        onChange={(e) => updateField('hashtags', e.target.value.split(',').map(h => h.trim()).filter(Boolean))}
                        placeholder="#tag1, #tag2, #tag3"
                    />
                </div>
            )}

            {/* Engagement Rate Display */}
            {engagementRate > 0 && (
                <div className={`engagement-rate ${hasHighEngagement ? 'engagement-rate--warning' : ''}`}>
                    <span className="engagement-rate__label">Engagement Rate:</span>
                    <span className="engagement-rate__value">{engagementRate.toFixed(2)}%</span>
                    {hasHighEngagement && (
                        <span className="engagement-rate__warning">
                            ⚠️ Unusually high engagement
                        </span>
                    )}
                </div>
            )}

            {/* Form Actions */}
            <div className="form-actions">
                <button
                    type="submit"
                    className="btn btn--primary"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? (
                        <>
                            <span className="spinner" />
                            Processing...
                        </>
                    ) : (
                        '🎯 Predict Viral Score'
                    )}
                </button>

                {showReset && (
                    <button
                        type="button"
                        className="btn btn--secondary"
                        onClick={handleReset}
                        disabled={isSubmitting}
                    >
                        Reset
                    </button>
                )}

                {showExampleButton && (
                    <button
                        type="button"
                        className="btn btn--outline"
                        onClick={fillExample}
                        disabled={isSubmitting}
                    >
                        Fill Example
                    </button>
                )}
            </div>
        </form>
    );
};

export default PredictionForm;
