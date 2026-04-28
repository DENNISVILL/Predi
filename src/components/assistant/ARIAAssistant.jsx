import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Send, Sparkles, ChevronRight, Bot,
  Minimize2, Zap, ArrowRight, Navigation
} from 'lucide-react';
import { askARIA, getWelcomeMessage, QUICK_SUGGESTIONS } from '../../services/predixBrain';

// ══════════════════════════════════════════════════════════════
// ARIA — CMO Virtual de Predix
// Piensa. Opina. Actúa. Navega. Estratega.
// ══════════════════════════════════════════════════════════════

export default function ARIAAssistant({ onNavigate, currentSection }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showQuickStart, setShowQuickStart] = useState(true);
  const [pendingAction, setPendingAction] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Inicializar con bienvenida
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcome = getWelcomeMessage();
      setMessages([{ id: Date.now(), role: 'aria', content: welcome }]);
    }
    if (isOpen && !isMinimized) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isMinimized) messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping, isMinimized]);

  const executeAction = (action) => {
    if (!action) return;
    if (action.type === 'navigate' && onNavigate) {
      onNavigate(action.target);
      setPendingAction({ ...action, executed: true });
      setTimeout(() => setPendingAction(null), 3000);
    }
    if (action.type === 'suggest' && onNavigate) {
      // Solo sugiere, no navega automáticamente
      setPendingAction({ ...action, suggestion: true });
    }
  };

  const sendMessage = async (text) => {
    const userText = text || input.trim();
    if (!userText) return;

    setInput('');
    setShowQuickStart(false);

    const userMsg = { id: Date.now(), role: 'user', content: { text: userText } };
    setMessages(prev => [...prev, userMsg]);

    // Typing con duración variable según longitud
    setIsTyping(true);
    const thinkTime = 500 + Math.min(userText.length * 8, 1200);
    await new Promise(r => setTimeout(r, thinkTime));
    setIsTyping(false);

    const response = askARIA(userText, { section: currentSection });

    // Ejecutar acción si es navigate
    if (response.action?.type === 'navigate') {
      executeAction(response.action);
    }

    const ariaMsg = { id: Date.now() + 1, role: 'aria', content: response };
    setMessages(prev => [...prev, ariaMsg]);
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  return (
    <>
      {/* ── FAB ──────────────────────────────────────────────── */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            key="fab"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.93 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-[200] w-14 h-14 rounded-2xl flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, #007bff 0%, #00c9ff 50%, #00ff9d 100%)',
              boxShadow: '0 8px 32px rgba(0,123,255,0.45), 0 2px 8px rgba(0,0,0,0.3)'
            }}
          >
            <motion.span
              className="absolute inset-0 rounded-2xl"
              animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0, 0.3] }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{ background: 'linear-gradient(135deg, #007bff, #00ff9d)' }}
            />
            <Sparkles className="w-6 h-6 text-white relative z-10" />
            <div className="absolute -top-1 -right-1 px-1.5 py-0.5 bg-[#00ff9d] rounded-full border-2 border-[#0b0c10]">
              <span className="text-[8px] font-black text-black leading-none">ARIA</span>
            </div>
          </motion.button>
        )}
      </AnimatePresence>

      {/* ── PANEL PRINCIPAL ──────────────────────────────────── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="aria-panel"
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.9 }}
            transition={{ type: 'spring', damping: 28, stiffness: 320 }}
            className="fixed bottom-6 right-6 z-[200] rounded-2xl overflow-hidden flex flex-col"
            style={{
              width: isMinimized ? '280px' : '420px',
              height: isMinimized ? 'auto' : '620px',
              maxHeight: 'calc(100vh - 48px)',
              background: '#0b0d14',
              border: '1px solid rgba(255,255,255,0.09)',
              boxShadow: '0 32px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(0,123,255,0.12)',
            }}
          >
            {/* ── HEADER ─────────────────────────────────────── */}
            <div className="flex-shrink-0 px-4 py-3 flex items-center gap-3 cursor-pointer"
              style={{ background: 'linear-gradient(135deg, rgba(0,123,255,0.12) 0%, rgba(0,255,157,0.06) 100%)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}
              onClick={() => setIsMinimized(!isMinimized)}
            >
              {/* Avatar */}
              <div className="relative flex-shrink-0">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, #007bff, #00ff9d)', boxShadow: '0 4px 14px rgba(0,123,255,0.4)' }}>
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <motion.div
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-[#00ff9d] rounded-full border-2 border-[#0b0d14]"
                />
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-white font-black text-sm tracking-tight">ARIA</p>
                <p className="text-[10px] font-semibold" style={{ color: 'rgba(0,255,157,0.7)' }}>
                  CMO Virtual · Predix Intelligence · En línea
                </p>
              </div>

              <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
                <button
                  onClick={() => { setMessages([]); setShowQuickStart(true); }}
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-600 hover:text-gray-300 hover:bg-white/5 transition-all"
                  title="Nueva conversación"
                >
                  <Minimize2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-600 hover:text-red-400 hover:bg-red-500/10 transition-all"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* ── ACCIÓN EN PROGRESO ──────────────────────────── */}
            <AnimatePresence>
              {pendingAction && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="flex-shrink-0 px-4 py-2 flex items-center gap-2 text-xs"
                  style={{ background: 'rgba(0,255,157,0.08)', borderBottom: '1px solid rgba(0,255,157,0.2)' }}
                >
                  <Zap className="w-3 h-3 text-[#00ff9d]" />
                  <span className="text-[#00ff9d] font-bold">
                    {pendingAction.executed ? `Navegando a ${pendingAction.target}...` : `Módulo sugerido: ${pendingAction.target}`}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── MENSAJES ────────────────────────────────────── */}
            {!isMinimized && (
              <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 custom-scrollbar">

                {/* Quick suggestions */}
                <AnimatePresence>
                  {showQuickStart && messages.length <= 1 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-1.5"
                    >
                      <p className="text-[9px] text-gray-700 font-black uppercase tracking-widest text-center mb-2">
                        ¿En qué trabajamos hoy?
                      </p>
                      {QUICK_SUGGESTIONS.map((s, i) => (
                        <motion.button
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.06 }}
                          onClick={() => sendMessage(s.label)}
                          className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl border border-white/6 hover:border-white/15 hover:bg-white/4 transition-all text-left group"
                        >
                          <span className="text-base flex-shrink-0">{s.icon}</span>
                          <span className="flex-1 text-xs font-semibold text-gray-400 group-hover:text-gray-200 transition-colors">{s.label}</span>
                          <ChevronRight className="w-3 h-3 text-gray-700 group-hover:text-gray-400 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                        </motion.button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Mensajes */}
                {messages.map((msg, idx) => (
                  <ARIAMessage
                    key={msg.id}
                    msg={msg}
                    onChipClick={(chip) => sendMessage(chip)}
                    onNavigate={onNavigate}
                    isLatest={idx === messages.length - 1}
                  />
                ))}

                {/* Typing */}
                <AnimatePresence>
                  {isTyping && (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="flex items-end gap-2"
                    >
                      <div className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ background: 'linear-gradient(135deg, #007bff, #00ff9d)' }}>
                        <Sparkles className="w-3 h-3 text-white" />
                      </div>
                      <div className="rounded-2xl rounded-bl-sm px-4 py-3 flex gap-1.5 items-center"
                        style={{ background: '#1a1d24', border: '1px solid rgba(255,255,255,0.06)' }}>
                        <span className="text-[10px] text-gray-600 mr-1">ARIA está pensando</span>
                        {[0, 1, 2].map(i => (
                          <motion.div key={i}
                            className="w-1.5 h-1.5 rounded-full bg-[#007bff]"
                            animate={{ y: [0, -5, 0], opacity: [0.4, 1, 0.4] }}
                            transition={{ duration: 0.7, repeat: Infinity, delay: i * 0.15 }}
                          />
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div ref={messagesEndRef} />
              </div>
            )}

            {/* ── INPUT ───────────────────────────────────────── */}
            {!isMinimized && (
              <div className="flex-shrink-0 p-3 border-t border-white/5"
                style={{ background: 'rgba(0,0,0,0.25)' }}>
                <div className="flex gap-2 items-end">
                  <input
                    ref={inputRef}
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={handleKey}
                    placeholder="Pregunta, pide una estrategia, o dime a dónde ir..."
                    className="flex-1 bg-[#1a1d24] border border-white/8 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-700 focus:outline-none focus:border-[#007bff]/50 transition-colors text-xs"
                  />
                  <motion.button
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.93 }}
                    onClick={() => sendMessage()}
                    disabled={!input.trim()}
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all"
                    style={{
                      background: input.trim()
                        ? 'linear-gradient(135deg, #007bff, #00ff9d)'
                        : 'rgba(255,255,255,0.04)',
                      cursor: input.trim() ? 'pointer' : 'default'
                    }}
                  >
                    <Send className="w-4 h-4 text-white" />
                  </motion.button>
                </div>
                <p className="text-[9px] text-gray-800 text-center mt-1.5">
                  ARIA · IA Ejecutiva · Solo sobre Predix y Marketing Digital
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// ══════════════════════════════════════════════════════════════
// MENSAJE DE ARIA
// ══════════════════════════════════════════════════════════════
function ARIAMessage({ msg, onChipClick, onNavigate, isLatest }) {
  const isUser = msg.role === 'user';
  const { content } = msg;

  if (isUser) {
    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex justify-end"
      >
        <div className="max-w-[85%] rounded-2xl rounded-br-sm px-4 py-2.5 text-xs text-white font-medium leading-relaxed"
          style={{ background: 'linear-gradient(135deg, #007bff, #0056b3)' }}>
          {content.text}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex items-start gap-2"
    >
      {/* Avatar ARIA */}
      <div className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
        style={{ background: 'linear-gradient(135deg, #007bff, #00ff9d)', flexShrink: 0 }}>
        <Sparkles className="w-3 h-3 text-white" />
      </div>

      <div className="flex-1 min-w-0 space-y-2">
        {/* Burbuja */}
        <div className="rounded-2xl rounded-tl-sm px-4 py-3"
          style={{
            background: content.type === 'opinion'
              ? 'linear-gradient(135deg, #1a1d24, #141820)'
              : '#1a1d24',
            border: content.type === 'opinion'
              ? '1px solid rgba(0,123,255,0.15)'
              : '1px solid rgba(255,255,255,0.06)'
          }}>

          {/* Badge de tipo */}
          {content.type === 'opinion' && (
            <div className="flex items-center gap-1.5 mb-2">
              <div className="w-4 h-4 rounded-md flex items-center justify-center"
                style={{ background: 'rgba(0,123,255,0.2)' }}>
                <Sparkles className="w-2.5 h-2.5 text-[#60a5fa]" />
              </div>
              <span className="text-[9px] font-black uppercase tracking-widest text-[#60a5fa]">
                Opinión de ARIA
              </span>
            </div>
          )}
          {content.type === 'strategy' && (
            <div className="flex items-center gap-1.5 mb-2">
              <div className="w-4 h-4 rounded-md flex items-center justify-center"
                style={{ background: 'rgba(0,255,157,0.15)' }}>
                <Zap className="w-2.5 h-2.5 text-[#00ff9d]" />
              </div>
              <span className="text-[9px] font-black uppercase tracking-widest text-[#00ff9d]">
                Plan Estratégico
              </span>
            </div>
          )}
          {content.type === 'action' && (
            <div className="flex items-center gap-1.5 mb-2">
              <div className="w-4 h-4 rounded-md flex items-center justify-center"
                style={{ background: 'rgba(139,92,246,0.2)' }}>
                <Navigation className="w-2.5 h-2.5 text-[#a78bfa]" />
              </div>
              <span className="text-[9px] font-black uppercase tracking-widest text-[#a78bfa]">
                Acción en Predix
              </span>
            </div>
          )}

          {content.title && (
            <p className="font-black text-white text-sm mb-2">{content.title}</p>
          )}

          {/* Texto */}
          <div className="text-gray-300 text-xs leading-relaxed space-y-0.5">
            {content.text && renderMarkdown(content.text)}
          </div>

          {/* Steps */}
          {content.steps && (
            <ol className="mt-3 space-y-2.5">
              {content.steps.map(step => (
                <li key={step.n} className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black text-black flex-shrink-0 mt-0.5"
                    style={{ background: 'linear-gradient(135deg, #00ff9d, #007bff)' }}>
                    {step.n}
                  </span>
                  <span className="text-[11px] text-gray-300 leading-relaxed flex-1">
                    {renderMarkdown(step.text)}
                  </span>
                </li>
              ))}
            </ol>
          )}

          {/* Botón de acción sugerida */}
          {content.action?.type === 'suggest' && isLatest && (
            <motion.button
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              onClick={() => onNavigate?.(content.action.target)}
              className="mt-3 w-full flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition-all"
              style={{
                background: 'rgba(0,255,157,0.1)',
                border: '1px solid rgba(0,255,157,0.25)',
                color: '#00ff9d'
              }}
            >
              <Zap className="w-3 h-3" />
              Ir al módulo recomendado
              <ArrowRight className="w-3 h-3" />
            </motion.button>
          )}
        </div>

        {/* Chips */}
        {content.chips?.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {content.chips.map((chip, i) => (
              <motion.button
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 + i * 0.04 }}
                onClick={() => onChipClick(chip)}
                className="text-[10px] font-bold px-3 py-1.5 rounded-full border transition-all hover:bg-white/8 hover:border-white/20"
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  borderColor: 'rgba(255,255,255,0.1)',
                  color: 'rgba(255,255,255,0.55)'
                }}
              >
                {chip}
              </motion.button>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ── Renderizador de markdown básico ─────────────────────────────
function renderMarkdown(text) {
  if (!text) return null;
  return text.split('\n').map((line, lineIdx) => {
    const parts = line.split(/(\*\*[^*]+\*\*)/g);
    return (
      <span key={lineIdx}>
        {parts.map((part, i) =>
          part.startsWith('**') && part.endsWith('**')
            ? <strong key={i} className="text-white font-bold">{part.slice(2, -2)}</strong>
            : <span key={i}>{part}</span>
        )}
        {lineIdx < text.split('\n').length - 1 && <br />}
      </span>
    );
  });
}
