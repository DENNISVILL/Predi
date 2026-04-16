import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Key, FileText, Lock, Users, Eye, EyeOff, Plus, Search } from 'lucide-react';

const PasswordRow = ({ service, username, lastUpdate, type }) => {
  const [showPwd, setShowPwd] = useState(false);

  return (
    <div className="flex items-center justify-between p-4 border-b border-white/5 hover:bg-surface-hover/50 transition-colors group">
       <div className="flex items-center gap-4 w-1/3">
          <div className="p-3 bg-surface rounded-xl text-text-muted group-hover:text-primary transition-colors">
            {type === 'social' ? <Users size={20} /> : <FileText size={20} />}
          </div>
          <div>
            <h4 className="font-bold text-text-primary">{service}</h4>
            <p className="text-xs text-text-muted">Actualizado: {lastUpdate}</p>
          </div>
       </div>

       <div className="w-1/3">
         <p className="text-sm font-mono text-text-secondary">{username}</p>
       </div>

       <div className="flex items-center justify-end gap-3 w-1/3">
         <div className="relative">
           <span className="font-mono bg-background px-3 py-1.5 rounded-md text-sm text-text-muted border border-white/10 w-32 inline-block text-center tracking-widest">
             {showPwd ? 'R3d_Pr3d!x24' : '••••••••'}
           </span>
           <button 
             onClick={() => setShowPwd(!showPwd)}
             className="absolute right-2 top-1/2 -translate-y-1/2 text-text-muted hover:text-primary transition-colors"
           >
             {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
           </button>
         </div>
       </div>
    </div>
  );
};

const CMVault = () => {
  return (
    <div className="p-6 lg:p-10 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <header className="mb-10 flex justify-between items-end">
          <div>
            <h2 className="text-3xl font-display font-bold flex items-center gap-3">
              <Shield className="text-accent" size={32} />
              <span className="text-glow-accent">Vault de Accesos</span>
            </h2>
            <p className="text-text-secondary mt-2">Bóveda cifrada para la gestión de contraseñas, clientes y presupuestos del CM.</p>
          </div>
          <button className="flex items-center gap-2 px-6 py-3 bg-accent text-background font-bold rounded-xl hover:shadow-[0_0_20px_rgba(0,255,157,0.4)] transition-all">
            <Plus size={20} /> NUEVO ACTIVO
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Vault Panel */}
          <div className="lg:col-span-2 glass-panel p-1">
             <div className="p-6 border-b border-white/5 flex justify-between items-center bg-surface-hover/30 rounded-t-3xl">
                <div className="relative w-64">
                  <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                  <input 
                    type="text" 
                    placeholder="Buscar credencial..." 
                    className="w-full bg-background border border-white/10 rounded-lg py-2 pl-10 pr-4 text-sm text-text-primary focus:outline-none focus:border-accent/50"
                  />
                </div>
                <div className="flex gap-2">
                   <span className="px-3 py-1 bg-surface rounded-full text-xs font-mono text-text-muted border border-white/5">Filtro: Todos</span>
                </div>
             </div>

             <div className="p-2 min-h-[400px]">
                <PasswordRow service="Instagram Main" username="admin@cliente.com" lastUpdate="hace 2 días" type="social" />
                <PasswordRow service="TikTok Ads Manager" username="tiktok_ads_master" lastUpdate="hace 1 semana" type="social" />
                <PasswordRow service="Herramienta de Analítica" username="analytics_cm_22" lastUpdate="hace 1 mes" type="tool" />
                <PasswordRow service="Plataforma de Emailing" username="newsletter_admin" lastUpdate="hace 3 meses" type="tool" />
             </div>
          </div>

          {/* Stats & Budgets Sidebar */}
          <div className="lg:col-span-1 space-y-6">
             <motion.div 
               initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
               className="glass-card p-6"
             >
               <h3 className="font-bold flex items-center gap-2 mb-4 text-white">
                 <Lock className="text-accent" size={20} />
                 Estado Criptográfico
               </h3>
               
               <div className="flex items-center gap-4 mb-4">
                 <div className="w-16 h-16 rounded-full border-4 border-accent flex items-center justify-center font-mono font-bold text-accent">
                   100%
                 </div>
                 <div>
                   <p className="text-sm font-bold text-white">Seguridad Óptima</p>
                   <p className="text-xs text-text-muted">Ninguna vulnerabilidad detectada en las últimas 48h.</p>
                 </div>
               </div>
             </motion.div>

             <motion.div 
               initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
               className="glass-card p-6 border-t-2 border-t-primary"
             >
               <h3 className="font-bold flex items-center gap-2 mb-4 text-white">
                 <Key className="text-primary" size={20} />
                 Resumen de Llaves
               </h3>
               <ul className="space-y-3">
                 <li className="flex justify-between items-center text-sm">
                   <span className="text-text-secondary">Redes Sociales</span>
                   <span className="font-mono bg-surface px-2 rounded-md border border-white/5">12</span>
                 </li>
                 <li className="flex justify-between items-center text-sm">
                   <span className="text-text-secondary">Herramientas</span>
                   <span className="font-mono bg-surface px-2 rounded-md border border-white/5">8</span>
                 </li>
                 <li className="flex justify-between items-center text-sm pt-3 border-t border-white/5">
                   <span className="text-text-primary font-bold">Total Activos Securizados</span>
                   <span className="font-mono text-primary font-bold">20</span>
                 </li>
               </ul>
             </motion.div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default CMVault;
