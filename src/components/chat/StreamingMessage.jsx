/**
 * StreamingMessage - Displays AI response with typewriter effect
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Bot, Square } from 'lucide-react';

const StreamingMessage = ({ content, onStop, isStreaming }) => {
    const [displayedContent, setDisplayedContent] = useState('');
    const [currentIndex, setCurrentIndex] = useState(0);
    const intervalRef = useRef(null);

    useEffect(() => {
        if (isStreaming && currentIndex < content.length) {
            intervalRef.current = setInterval(() => {
                setCurrentIndex(prev => {
                    if (prev < content.length) {
                        setDisplayedContent(content.substring(0, prev + 1));
                        return prev + 1;
                    }
                    return prev;
                });
            }, 20); // Adjust speed here (lower = faster)

            return () => {
                if (intervalRef.current) {
                    clearInterval(intervalRef.current);
                }
            };
        }
    }, [content, currentIndex, isStreaming]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-3 mb-6"
        >
            {/* Avatar */}
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
            </div>

            {/* Streaming Content */}
            <div className="flex-1 max-w-3xl">
                <div className="text-xs text-gray-400 mb-1 flex items-center gap-2">
                    <span className="font-semibold text-cyan-400">Predix AI</span>
                    <span className="italic">escribiendo...</span>
                </div>

                <div className="group relative px-6 py-4 text-base leading-relaxed bg-transparent text-gray-100 pl-0">
                    <div className="prose prose-invert max-w-none whitespace-pre-wrap">
                        {displayedContent}
                        {isStreaming && (
                            <motion.span
                                animate={{ opacity: [1, 0, 1] }}
                                transition={{ duration: 0.8, repeat: Infinity }}
                                className="inline-block w-2 h-4 bg-cyan-400 ml-0.5 rounded-sm align-middle"
                            />
                        )}
                    </div>

                    {/* Stop Button (Floating, visible) */}
                    {isStreaming && onStop && (
                        <motion.button
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            onClick={onStop}
                            className="absolute -bottom-8 left-0 flex items-center gap-2 px-3 py-1.5 bg-gray-800 hover:bg-gray-700 border border-gray-700/50 text-white text-xs rounded-full transition-all shadow-lg"
                        >
                            <Square className="w-3 h-3 fill-current text-red-400" />
                            Detener generación
                        </motion.button>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default StreamingMessage;
