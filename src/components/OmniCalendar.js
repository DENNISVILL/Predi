import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar as CalendarIcon, Clock, Zap, CheckCircle2, MoreHorizontal, Filter, Video, Image as ImageIcon, Type } from 'lucide-react';

const OMNI_CONTENT_IDEAS = [
  { id: 1, text: "Hilo educativo: 5 mitos sobre tu nicho que nadie te dice", type: "text", time: "10:30 AM", platform: "X", strength: "High" },
  { id: 2, text: "Reel corto: 3 segundos de gancho visual mostrando el producto", type: "video", time: "06:15 PM", platform: "Instagram", strength: "Viral" },
  { id: 3, text: "Carrusel Píldora: 'Por qué hacer X te cuesta dinero'", type: "image", time: "01:00 PM", platform: "LinkedIn", strength: "Medium" },
  { id: 4, text: "TikTok Trend con audio viral de la semana", type: "video", time: "08:45 PM", platform: "TikTok", strength: "High" }
];

const ContentPill = ({ content }) => {
  const Icon = content.type === 'video' ? Video : content.type === 'image' ? ImageIcon : Type;
  const strengthColor = content.strength === 'Viral' ? 'text-primary' : content.strength === 'High' ? 'text-accent' : 'text-secondary';
  const strengthBorder = content.strength === 'Viral' ? 'border-primary/50' : content.strength === 'High' ? 'border-accent/50' : 'border-secondary/50';

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
      className={`glass-card p-4 flex flex-col gap-3 border-l-4 ${strengthBorder} group relative overflow-hidden`}
    >
      <div className="flex justify-between items-start w-full">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-surface-hover">
            <Icon size={16} className="text-text-primary" />
          </div>
          <span className="text-xs font-mono font-bold text-text-muted">{content.platform}</span>
        </div>
        <div className="flex items-center gap-1 text-xs font-mono text-text-secondary bg-surface-hover px-2 py-1 rounded-md">
          <Clock size={12} /> {content.time}
        </div>
      </div>
      
      <p className="text-sm font-medium text-text-primary leading-tight flex-1">{content.text}</p>
      
      <div className="flex justify-between items-center mt-2 pt-2 border-t border-white/5">
        <span className={`text-xs font-bold font-mono flex items-center gap-1 ${strengthColor}`}>
          <Zap size={14} /> Algo Pwr: {content.strength}
        </span>
        <button className="text-text-muted hover:text-white transition-colors">
          <MoreHorizontal size={16} />
        </button>
      </div>
    </motion.div>
  );
};

const OmniCalendar = () => {
  const [activeDay, setActiveDay] = useState('Hoy');
  const DAYS = ['Ayer', 'Hoy', 'Mañana', 'Jueves', 'Viernes'];

  return (
    <div className="p-6 lg:p-10 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <header className="mb-10 flex flex-col md:flex-row md:justify-between md:items-end gap-6">
          <div>
            <h2 className="text-3xl font-display font-bold flex items-center gap-3">
              <CalendarIcon className="text-accent animate-pulse-glow" size={32} />
              <span className="text-glow-accent">OmniCalendar</span>
            </h2>
            <p className="text-text-secondary mt-2 max-w-2xl">
              Fábrica de contenidos y matriz de tiempos sugeridos por la Inteligencia Artificial para máxima exposición.
            </p>
          </div>
          <button className="glass-card px-4 py-2 hover:bg-surface-hover flex gap-2 items-center text-sm font-bold text-text-primary">
            <Filter size={16} /> FILTRAR RED
          </button>
        </header>

        {/* Generador de ideas Top Bar */}
        <div className="glass-panel p-6 mb-8 flex flex-col md:flex-row items-center justify-between gap-6 border border-white/5 bg-surface/40">
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="p-3 bg-secondary/20 rounded-xl text-secondary">
              <Zap size={24} />
            </div>
            <div>
              <h4 className="font-bold text-white">Generar Lote Funcional</h4>
              <p className="text-sm text-text-secondary">Con base en tendencias recientes</p>
            </div>
          </div>
          <button className="w-full md:w-auto px-8 py-3 bg-white text-background font-bold rounded-xl hover:shadow-[0_0_20px_rgba(255,255,255,0.4)] transition-all">
            + GENERAR CON IA
          </button>
        </div>

        {/* Calendario View */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Navegación Días */}
          <div className="lg:col-span-1 space-y-2">
            {DAYS.map(day => (
              <button
                key={day}
                onClick={() => setActiveDay(day)}
                className={`w-full p-4 rounded-xl text-left font-bold transition-all flex justify-between items-center ${
                  activeDay === day 
                   ? 'bg-accent/20 border border-accent/50 text-white shadow-[0_0_15px_rgba(0,255,157,0.15)]'
                   : 'glass-card hover:bg-surface-hover text-text-muted'
                }`}
              >
                {day}
                {activeDay === day && <CheckCircle2 size={18} className="text-accent" />}
              </button>
            ))}
            
            <div className="mt-8 glass-card p-5 border-l-2 border-primary/50">
               <h4 className="text-xs font-mono text-primary font-bold mb-2 uppercase">Consejo del Oráculo</h4>
               <p className="text-sm text-text-secondary">Para "Hoy", los reels descriptivos entre las 18:00 y 20:00 tienen un +42% de empuje algorítmico.</p>
            </div>
          </div>

          {/* Canvas de Contenido */}
          <div className="lg:col-span-3">
             <div className="flex justify-between items-center mb-6">
                <h3 className="font-display font-bold text-xl text-white">Grid Programado: {activeDay}</h3>
                <span className="text-sm font-mono text-text-muted">4 Piezas de Contenido</span>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               {OMNI_CONTENT_IDEAS.map((content) => (
                 <ContentPill key={content.id} content={content} />
               ))}
               
               <button className="glass-card border-dashed border-2 border-white/10 p-4 flex flex-col items-center justify-center text-text-muted hover:text-white hover:border-white/30 transition-colors min-h-[160px] group">
                  <div className="p-3 bg-surface rounded-full mb-2 group-hover:scale-110 transition-transform">
                    <Zap size={20} className="text-text-muted group-hover:text-primary transition-colors" />
                  </div>
                  <span className="font-medium text-sm">Añadir Slot Manual</span>
               </button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OmniCalendar;
