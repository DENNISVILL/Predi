/**
 * VoiceInput - Voice recording and transcription component
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Square } from 'lucide-react';

const VoiceInput = ({ onTranscript, language = 'es-ES' }) => {
    const [isRecording, setIsRecording] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [isSupported, setIsSupported] = useState(true);
    const recognitionRef = useRef(null);

    useEffect(() => {
        // Check if browser supports Web Speech API
        if (!('webkitSpeech Recognition' in window) && !('SpeechRecognition' in window)) {
            setIsSupported(false);
            return;
        }

        // Initialize Speech Recognition
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();

        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = language;

        recognition.onresult = (event) => {
            let interimTranscript = '';
            let finalTranscript = '';

            for (let i = event.resultIndex; i < event.results.length; i++) {
                const transcriptPiece = event.results[i][0].transcript;
                if (event.results[i].isFinal) {
                    finalTranscript += transcriptPiece + ' ';
                } else {
                    interimTranscript += transcriptPiece;
                }
            }

            const fullTranscript = (finalTranscript + interimTranscript).trim();
            setTranscript(fullTranscript);
        };

        recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            setIsRecording(false);
        };

        recognition.onend = () => {
            if (isRecording) {
                recognition.start();
            }
        };

        recognitionRef.current = recognition;

        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
        };
    }, [language]);

    const startRecording = () => {
        if (!recognitionRef.current) return;

        setTranscript('');
        setIsRecording(true);
        recognitionRef.current.start();
    };

    const stopRecording = () => {
        if (!recognitionRef.current) return;

        setIsRecording(false);
        recognitionRef.current.stop();

        // Send transcript to parent
        if (transcript && onTranscript) {
            onTranscript(transcript);
        }
        setTranscript('');
    };

    if (!isSupported) {
        return (
            <div className="text-xs text-gray-500">
                Tu navegador no soporta entrada de voz
            </div>
        );
    }

    return (
        <div className="relative">
            {/* Voice Button */}
            <button
                onClick={isRecording ? stopRecording : startRecording}
                className={`p-2 rounded-lg transition-all ${isRecording
                        ? 'bg-red-500 hover:bg-red-600 text-white'
                        : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                    }`}
                title={isRecording ? 'Detener grabación' : 'Grabar voz'}
            >
                {isRecording ? (
                    <Square className="w-5 h-5" />
                ) : (
                    <Mic className="w-5 h-5" />
                )}
            </button>

            {/* Recording Indicator */}
            <AnimatePresence>
                {isRecording && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute bottom-full right-0 mb-2 bg-gray-800 border border-gray-700 rounded-lg p-4 min-w-[300px] shadow-xl"
                    >
                        {/* Waveform Animation */}
                        <div className="flex items-center gap-1 mb-3">
                            {[...Array(5)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    animate={{
                                        height: [10, 20, 10],
                                    }}
                                    transition={{
                                        duration: 0.6,
                                        repeat: Infinity,
                                        delay: i * 0.1,
                                    }}
                                    className="w-1 bg-gradient-to-t from-red-500 to-pink-500 rounded-full"
                                />
                            ))}
                            <span className="ml-2 text-sm text-red-400 font-medium">Grabando...</span>
                        </div>

                        {/* Live Transcript */}
                        {transcript && (
                            <div className="text-sm text-gray-300 p-2 bg-gray-900 rounded">
                                {transcript}
                            </div>
                        )}

                        {/* Help Text */}
                        <div className="text-xs text-gray-500 mt-2">
                            Click en el botón para detener
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default VoiceInput;
