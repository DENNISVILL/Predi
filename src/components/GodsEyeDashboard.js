import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Eye, Activity, Globe, TrendingUp, Users, Target, Zap, 
  BarChart2, Radio, Instagram, Twitter, Compass 
} from 'lucide-react';

const MetricCard = ({ title, value, icon: Icon, color, trend }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="glass-card p-6 relative overflow-hidden group"
  >
    <div className={`absolute top-0 right-0 w-32 h-32 bg-${color}/10 rounded-full blur-3xl -mr-10 -mt-10 transition-opacity group-hover:opacity-100 opacity-50`}></div>
    
    <div className="flex justify-between items-start mb-4">
      <div>
        <p className="text-text-secondary text-sm font-medium mb-1 font-mono tracking-wider">{title}</p>
        <h3 className={`text-3xl font-bold text-text-primary group-hover:text-glow transition-all ${color === 'primary' ? 'group-hover:text-glow' : color === 'secondary' ? 'group-hover:text-glow-secondary' : 'group-hover:text-glow-accent'}`}>
          {value}
        </h3>
      </div>
      <div className={`p-3 rounded-xl bg-surface/50 border border-${color}/20 text-${color}`}>
        <Icon size={24} className={color === 'primary' ? 'text-primary' : color === 'secondary' ? 'text-secondary' : 'text-accent'} />
      </div>
    </div>
    
    <div className="flex items-center text-sm">
      <TrendingUp size={16} className="text-accent mr-1" />
      <span className="text-accent font-medium">+{trend}%</span>
      <span className="text-text-muted ml-2">vs. last 24h</span>
    </div>
  </motion.div>
);

const PlatformStatus = ({ platform, status, score, Icon }) => (
  <div className="flex items-center justify-between p-4 border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
    <div className="flex items-center gap-3">
      <div className={`p-2 rounded-lg ${status === 'optimal' ? 'bg-accent/10 text-accent' : 'bg-primary/10 text-primary'}`}>
        <Icon size={20} />
      </div>
      <div>
        <h4 className="font-semibold text-text-primary">{platform}</h4>
        <p className="text-xs text-text-muted capitalize">{status} window</p>
      </div>
    </div>
    <div className="text-right">
      <div className="text-lg font-bold text-glow font-mono">{score}/100</div>
      <div className="text-xs text-primary">Algo-Score</div>
    </div>
  </div>
);

const GodsEyeDashboard = () => {
  const [scanActive, setScanActive]] = useState(true);

  // Decorative grid background
  const GridBackground = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 opacity-20">
      <div className="absolute inset-0 bg-[url('https://cors-anywhere.herokuapp.com/')] bg-[size:50px_50px] bg-gods-eye mix-blend-screen" style={{ backgroundImage: 'linear-gradient(rgba(0, 240, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 240, 255, 0.1) 1px, transparent 1px)' }}></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/20 rounded-full blur-[120px]"></div>
    </div>
  );

  return (
    <div className="relative min-h-screen bg-background p-6 lg:p-10 font-sans overflow-hidden">
      <GridBackground />
      {scanActive && <div className="scan-line"></div>}

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header section */}
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-4xl font-display font-bold text-text-primary tracking-tight mb-2 flex items-center">
              <Eye className="mr-3 text-primary animate-pulse-glow" size={36} />
              God's Eye <span className="text-primary ml-2 font-mono text-glow">System</span>
            </h1>
            <p className="text-text-secondary">Omniscient Community Management & Analytics</p>
          </div>
          
          <div className="flex gap-4">
            <button 
              className="glass-card px-6 py-2 flex items-center gap-2 hover:bg-primary/20 transition-all font-mono text-sm text-primary"
              onClick={() => setScanActive(!scanActive)}
            >
              <Radio size={16} className={scanActive ? 'animate-pulse text-accent' : ''} />
              {scanActive ? 'SCANNING ACTIVE' : 'SCAN INACTIVE'}
            </button>
          </div>
        </header>

        {/* Top Metrics Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard title="GLOBAL REACH" value="128.4K" icon={Globe} color="primary" trend="14.2" />
          <MetricCard title="ENGAGEMENT RATE" value="8.7%" icon={Activity} color="accent" trend="2.1" />
          <MetricCard title="CONVERSION" value="3.2%" icon={Target} color="secondary" trend="0.8" />
          <MetricCard title="VIRAL MOMENTUM" value="94/100" icon={Zap} color="primary" trend="12.5" />
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Radar / Core View */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="lg:col-span-2 glass-panel p-1 border-primary/20 relative"
          >
            <div className="absolute top-4 left-6 text-primary font-mono text-sm tracking-widest uppercase items-center flex gap-2">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse"></span> Live Radar
            </div>
            
            {/* Holographic Earth Placeholder */}
            <div className="h-[400px] w-full bg-surface/40 rounded-3xl flex items-center justify-center relative overflow-hidden group">
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full border border-primary/30 border-dashed animate-spin-slow"></div>
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] rounded-full border border-secondary/40 border-dotted animate-spin-reverse"></div>
               <Compass size={80} className="text-primary/70 animate-pulse-glow" />
               
               <div className="absolute bottom-4 right-6 text-right">
                 <p className="text-xs text-text-muted font-mono">LAT: 34.0522 N</p>
                 <p className="text-xs text-text-muted font-mono">LNG: 118.2437 W</p>
               </div>
            </div>
          </motion.div>

          {/* Right Sidebar - Algo Status */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-card overflow-hidden flex flex-col"
          >
             <div className="p-6 border-b border-white/10 bg-surface-hover/30">
               <h3 className="font-display text-xl font-bold flex items-center gap-2">
                 <BarChart2 className="text-secondary" />
                 Algorithm Sync
               </h3>
               <p className="text-sm text-text-secondary mt-1">Real-time platform health</p>
             </div>
             
             <div className="flex-1 overflow-y-auto">
                <PlatformStatus platform="Instagram" status="optimal" score={98} Icon={Instagram} />
                <PlatformStatus platform="TikTok" status="rising trend" score={85} Icon={Activity} />
                <PlatformStatus platform="X (Twitter)" status="volatile" score={60} Icon={Twitter} />
                <PlatformStatus platform="Facebook" status="stable" score={72} Icon={Users} />
             </div>
             
             <div className="p-4 bg-primary/5 border-t border-primary/20">
               <button className="w-full py-3 bg-primary/10 hover:bg-primary/20 text-primary rounded-xl font-semibold transition-all border border-primary/30 shadow-[0_0_15px_rgba(0,240,255,0.2)]">
                  SYNCHRONIZE ALL
               </button>
             </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
};

export default GodsEyeDashboard;
