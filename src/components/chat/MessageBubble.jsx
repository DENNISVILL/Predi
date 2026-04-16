/**
 * MessageBubble - Advanced message component with markdown, code highlighting, and actions
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import {
    Copy,
    Check,
    RotateCcw,
    ThumbsUp,
    ThumbsDown,
    Share2,
    Calendar,
    User,
    Bot
} from 'lucide-react';

const MessageBubble = ({
    message,
    onRegenerate,
    onFeedback,
    onShare,
    onSendToCalendar
}) => {
    const [copied, setCopied] = useState(false);
    const [feedbackGiven, setFeedbackGiven] = useState(null);

    const isUser = message.type === 'user';

    // Copy message content
    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(message.content);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (error) {
            console.error('Error copying:', error);
        }
    };

    // Handle feedback
    const handleFeedback = async (type) => {
        setFeedbackGiven(type);
        if (onFeedback) {
            onFeedback(message.id, type);
        }
    };

    // Format timestamp
    const formatTime = (timestamp) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);

        if (diffMins < 1) return 'Ahora';
        if (diffMins < 60) return `Hace ${diffMins}m`;
        if (diffMins < 24 * 60) return `Hace ${Math.floor(diffMins / 60)}h`;

        return date.toLocaleDateString('es-ES', {
            day: 'numeric',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex gap-3 mb-6 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
        >
            {/* ... avatar ... */}
            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${isUser
                ? 'bg-gradient-to-br from-blue-500 to-cyan-500'
                : 'bg-gradient-to-br from-purple-500 to-pink-500'
                }`}>
                {isUser ? (
                    <User className="w-5 h-5 text-white" />
                ) : (
                    <Bot className="w-5 h-5 text-white" />
                )}
            </div>

            {/* Message Content */}
            <div className={`flex-1 max-w-3xl ${isUser ? 'items-end' : 'items-start'}`}>
                {/* Timestamp & Name */}
                <div className={`text-xs text-gray-400 mb-1 flex items-center gap-2 ${isUser ? 'justify-end' : 'justify-start'}`}>
                    {!isUser && <span className="font-semibold text-cyan-400">Predix AI</span>}
                    <span>{formatTime(message.timestamp)}</span>
                    {isUser && <span className="font-semibold text-gray-300">Tú</span>}
                </div>

                {/* Message Bubble */}
                <div className={`group relative px-6 py-4 text-lg leading-relaxed ${isUser
                    ? 'bg-gray-800 text-white rounded-3xl rounded-tr-sm border border-gray-700'
                    : 'bg-transparent text-gray-50 pl-0'
                    }`}>
                    {/* Content Rendering */}
                    <div className="max-w-none" style={{ color: '#FFFFFF' }}>
                        {isUser ? (
                            <div className="whitespace-pre-wrap text-white font-medium">
                                {message.content}
                            </div>
                        ) : (
                            <Markdown
                                remarkPlugins={[remarkGfm]}
                                components={{
                                    // Code blocks with syntax highlighting
                                    code({ node, inline, className, children, ...props }) {
                                        const match = /language-(\w+)/.exec(className || '');
                                        const codeString = String(children).replace(/\n$/, '');

                                        return !inline && match ? (
                                            <CodeBlock
                                                language={match[1]}
                                                code={codeString}
                                                {...props}
                                            />
                                        ) : (
                                            <code className="px-1.5 py-0.5 rounded bg-gray-700 text-cyan-400 text-sm font-mono" {...props}>
                                                {children}
                                            </code>
                                        );
                                    },
                                    // Custom styles for other elements - FORCED VISIBILITY
                                    p: ({ node, ...props }) => <p className="mb-3 last:mb-0 text-gray-50" {...props} />,
                                    ul: ({ node, ...props }) => <ul className="list-disc list-inside mb-3 space-y-1 text-gray-50" {...props} />,
                                    ol: ({ node, ...props }) => <ol className="list-decimal list-inside mb-3 space-y-1 text-gray-50" {...props} />,
                                    li: ({ node, ...props }) => <li className="ml-2 text-gray-50" {...props} />,
                                    a: ({ node, ...props }) => (
                                        <a
                                            className="text-cyan-400 hover:text-cyan-300 underline"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            {...props}
                                        />
                                    ),
                                    blockquote: ({ node, ...props }) => (
                                        <blockquote
                                            className="border-l-4 border-cyan-500 pl-4 italic my-2 text-gray-400"
                                            {...props}
                                        />
                                    ),
                                    table: ({ node, ...props }) => (
                                        <div className="overflow-x-auto my-4">
                                            <table className="min-w-full border border-gray-700 rounded-lg text-gray-50" {...props} />
                                        </div>
                                    ),
                                    thead: ({ node, ...props }) => <thead className="bg-gray-700 text-gray-100" {...props} />,
                                    th: ({ node, ...props }) => (
                                        <th className="px-4 py-2 text-left border-b border-gray-600 font-semibold" {...props} />
                                    ),
                                    td: ({ node, ...props }) => (
                                        <td className="px-4 py-2 border-b border-gray-700" {...props} />
                                    ),
                                    h1: ({ node, ...props }) => <h1 className="text-2xl font-bold mb-3 mt-4 text-white" {...props} />,
                                    h2: ({ node, ...props }) => <h2 className="text-xl font-bold mb-2 mt-3 text-white" {...props} />,
                                    h3: ({ node, ...props }) => <h3 className="text-lg font-bold mb-2 mt-2 text-white" {...props} />,
                                    hr: ({ node, ...props }) => <hr className="my-4 border-gray-700" {...props} />,
                                    strong: ({ node, ...props }) => <strong className="font-bold text-white" {...props} />,
                                    em: ({ node, ...props }) => <em className="italic text-gray-300" {...props} />,
                                }}
                            >
                                {message.content}
                            </Markdown>
                        )}
                    </div>

                    {/* Action Buttons (Only for AI messages) */}
                    {!isUser && (
                        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-700 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                                onClick={handleCopy}
                                className="flex items-center gap-1 px-2 py-1 text-xs text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors"
                                title="Copiar mensaje"
                            >
                                {copied ? (
                                    <>
                                        <Check className="w-3 h-3" />
                                        Copiado
                                    </>
                                ) : (
                                    <>
                                        <Copy className="w-3 h-3" />
                                        Copiar
                                    </>
                                )}
                            </button>

                            {onRegenerate && (
                                <button
                                    onClick={() => onRegenerate(message)}
                                    className="flex items-center gap-1 px-2 py-1 text-xs text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors"
                                    title="Regenerar respuesta"
                                >
                                    <RotateCcw className="w-3 h-3" />
                                    Regenerar
                                </button>
                            )}

                            <div className="flex-1" />

                            <button
                                onClick={() => handleFeedback('up')}
                                className={`p-1 text-xs rounded transition-colors ${feedbackGiven === 'up'
                                    ? 'text-green-400 bg-green-500/20'
                                    : 'text-gray-400 hover:text-green-400 hover:bg-gray-700'
                                    }`}
                                title="Útil"
                            >
                                <ThumbsUp className="w-3 h-3" />
                            </button>

                            <button
                                onClick={() => handleFeedback('down')}
                                className={`p-1 text-xs rounded transition-colors ${feedbackGiven === 'down'
                                    ? 'text-red-400 bg-red-500/20'
                                    : 'text-gray-400 hover:text-red-400 hover:bg-gray-700'
                                    }`}
                                title="No útil"
                            >
                                <ThumbsDown className="w-3 h-3" />
                            </button>

                            {onShare && (
                                <button
                                    onClick={() => onShare(message)}
                                    className="p-1 text-xs text-gray-400 hover:text-cyan-400 hover:bg-gray-700 rounded transition-colors"
                                    title="Compartir"
                                >
                                    <Share2 className="w-3 h-3" />
                                </button>
                            )}

                            {onSendToCalendar && (
                                <button
                                    onClick={() => onSendToCalendar(message)}
                                    className="flex items-center gap-1 px-2 py-1 text-xs text-purple-400 hover:text-white hover:bg-purple-600/20 rounded transition-colors"
                                    title="Enviar al Calendario"
                                >
                                    <Calendar className="w-3 h-3" />
                                    Calendario
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

// Code Block Component with syntax highlighting
const CodeBlock = ({ language, code }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(code);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (error) {
            console.error('Error copying code:', error);
        }
    };

    return (
        <div className="relative group my-4">
            {/* Language Label + Copy Button */}
            <div className="flex items-center justify-between px-4 py-2 bg-gray-900 border-b border-gray-700 rounded-t-lg">
                <span className="text-xs font-mono text-gray-400 uppercase">{language}</span>
                <button
                    onClick={handleCopy}
                    className="flex items-center gap-1 px-2 py-1 text-xs text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors"
                >
                    {copied ? (
                        <>
                            <Check className="w-3 h-3" />
                            Copiado
                        </>
                    ) : (
                        <>
                            <Copy className="w-3 h-3" />
                            Copiar código
                        </>
                    )}
                </button>
            </div>

            {/* Syntax Highlighted Code */}
            <SyntaxHighlighter
                language={language}
                style={vscDarkPlus}
                showLineNumbers
                customStyle={{
                    margin: 0,
                    borderRadius: '0 0 8px 8px',
                    fontSize: '13px',
                    padding: '16px'
                }}
                codeTagProps={{
                    style: {
                        fontFamily: 'Monaco, Consolas, "Courier New", monospace'
                    }
                }}
            >
                {code}
            </SyntaxHighlighter>
        </div>
    );
};

export default MessageBubble;
