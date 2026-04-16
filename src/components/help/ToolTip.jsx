import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Info, X } from 'lucide-react';

const ToolTip = ({ children, content, position = 'top', size = 'medium' }) => {
    const [isVisible, setIsVisible] = useState(false);

    const sizeClasses = {
        small: 'text-sm max-w-[200px]',
        medium: 'text-base max-w-[300px]',
        large: 'text-lg max-w-[400px]'
    };

    const positionClasses = {
        top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
        bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
        left: 'right-full top-1/2 -translate-y-1/2 mr-2',
        right: 'left-full top-1/2 -translate-y-1/2 ml-2'
    };

    return (
        <div className="relative inline-block">
            <div
                onMouseEnter={() => setIsVisible(true)}
                onMouseLeave={() => setIsVisible(false)}
                onClick={() => setIsVisible(!isVisible)}
                className="cursor-help"
            >
                {children}
            </div>

            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className={`absolute z-50 ${positionClasses[position]}`}
                >
                    <div className={`bg-gray-800 text-white p-4 rounded-lg shadow-xl border border-gray-700 ${sizeClasses[size]}`}>
                        <p className="leading-relaxed">{content}</p>
                        {/* Arrow */}
                        <div className={`absolute w-3 h-3 bg-gray-800 border-gray-700 transform rotate-45 ${position === 'top' ? 'bottom-[-6px] left-1/2 -translate-x-1/2 border-b border-r' :
                                position === 'bottom' ? 'top-[-6px] left-1/2 -translate-x-1/2 border-t border-l' :
                                    position === 'left' ? 'right-[-6px] top-1/2 -translate-y-1/2 border-r border-t' :
                                        'left-[-6px] top-1/2 -translate-y-1/2 border-l border-b'
                            }`} />
                    </div>
                </motion.div>
            )}
        </div>
    );
};

// Helper component para iconos de ayuda
export const HelpIcon = ({ content, size = 'medium' }) => {
    return (
        <ToolTip content={content} size={size}>
            <Info className="w-5 h-5 text-cyan-400 hover:text-cyan-300 transition-colors" />
        </ToolTip>
    );
};

export default ToolTip;
