/**
 * LoadingSpinner Component
 * Display loading state
 */

import React from 'react';

export interface LoadingSpinnerProps {
    size?: 'small' | 'medium' | 'large';
    message?: string;
    className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
    size = 'medium',
    message,
    className = '',
}) => {
    return (
        <div className={`loading-spinner loading-spinner--${size} ${className}`}>
            <div className="loading-spinner__spinner" />
            {message && <p className="loading-spinner__message">{message}</p>}
        </div>
    );
};
