/**
 * ErrorMessage Component
 * Display error states
 */

import React from 'react';

export interface ErrorMessageProps {
    error: string | Error;
    retry?: () => void;
    className?: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
    error,
    retry,
    className = '',
}) => {
    const errorMessage = typeof error === 'string' ? error : error.message;

    return (
        <div className={`error-message ${className}`}>
            <div className="error-message__icon">⚠️</div>
            <p className="error-message__text">{errorMessage}</p>
            {retry && (
                <button
                    className="error-message__retry"
                    onClick={retry}
                >
                    Try Again
                </button>
            )}
        </div>
    );
};
