/**
 * Validation Utilities for Predix
 */

import type { TrendInputData } from '../types';

export interface ValidationErrors {
    [key: string]: string;
}

/**
 * Validate prediction input
 */
export function validatePredictionInput(data: Partial<TrendInputData>): ValidationErrors {
    const errors: ValidationErrors = {};

    // Platform required
    if (!data.platform) {
        errors.platform = 'Platform is required';
    }

    // Name required
    if (!data.name || data.name.trim().length === 0) {
        errors.name = 'Name/Hashtag is required';
    }

    // Views must be positive
    if (data.views !== undefined && data.views < 0) {
        errors.views = 'Views must be a positive number';
    }

    // Likes must be positive
    if (data.likes !== undefined && data.likes < 0) {
        errors.likes = 'Likes must be a positive number';
    }

    // Comments must be positive
    if (data.comments !== undefined && data.comments < 0) {
        errors.comments = 'Comments must be a positive number';
    }

    // Shares must be positive  
    if (data.shares !== undefined && data.shares < 0) {
        errors.shares = 'Shares must be a positive number';
    }

    return errors;
}

/**
 * Validate email format
 */
export function validateEmail(email: string): boolean {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

/**
 * Validate password strength
 */
export function validatePassword(password: string): { valid: boolean; message?: string } {
    if (password.length < 8) {
        return { valid: false, message: 'Password must be at least 8 characters' };
    }
    if (!/[A-Z]/.test(password)) {
        return { valid: false, message: 'Password must contain at least one uppercase letter' };
    }
    if (!/[a-z]/.test(password)) {
        return { valid: false, message: 'Password must contain at least one lowercase letter' };
    }
    if (!/[0-9]/.test(password)) {
        return { valid: false, message: 'Password must contain at least one number' };
    }
    return { valid: true };
}

export default validatePredictionInput;
