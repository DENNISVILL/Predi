import React from 'react';

/**
 * LoadingProps - Props for Loading component
 */
interface LoadingProps {
    message?: string;
    size?: 'small' | 'medium' | 'large';
    className?: string;
}

/**
 * Loading Component - TypeScript Migration
 * Optimized loading component with full type safety
 */
const Loading: React.FC<LoadingProps> = ({
    message = 'Cargando...',
    size = 'medium',
    className = ''
}) => {
    // Size mappings
    const sizeClasses = {
        small: 'h-8 w-8',
        medium: 'h-16 w-16',
        large: 'h-24 w-24'
    };

    const textSizeClasses = {
        small: 'text-sm',
        medium: 'text-lg',
        large: 'text-xl'
    };

    return (
        <div className={`flex items-center justify-center min-h-screen bg-[#0b0c10] ${className}`}>
            <div className="text-center">
                <div
                    className={`animate-spin rounded-full border-b-2 border-blue-500 mx-auto mb-4 ${sizeClasses[size]}`}
                    role="status"
                    aria-label="Cargando"
                />
                <p className={`text-white ${textSizeClasses[size]}`}>
                    {message}
                </p>
            </div>
        </div>
    );
};

export default Loading;
