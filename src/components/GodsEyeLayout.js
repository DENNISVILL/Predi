import React from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { Eye, Brain, Calendar as CalendarIcon, Shield, Headphones, Settings, LogOut } from 'lucide-react';

const SidebarItem = ({ to, icon: Icon, label }) => {
  const location = useLocation();
  const isActive = location.pathname.startsWith(to);

  return (
    <NavLink 
      to={to}
      className={`flex items-center gap-4 px-6 py-4 transition-all duration-300 relative group overflow-hidden ${
        isActive 
          ? 'bg-primary/10 text-primary border-r-2 border-primary' 
          : 'text-text-muted hover:bg-surface-hover hover:text-white'
      }`}
    >
      <div className={`absolute inset-0 bg-gradient-to-r from-transparent to-primary/5 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500 ${isActive ? 'translate-x-0' : ''}`} />
      <Icon size={22} className={`relative z-10 ${isActive ? 'animate-pulse-glow shadow-primary' : ''}`} />
      <span className="font-mono text-sm tracking-wide relative z-10 font-bold">{label}</span>
    </NavLink>
  );
};

const GodsEyeLayout = () => {
  return (
    <div className="flex bg-background min-h-screen font-sans text-text-primary overflow-hidden">
      
      {/* Sidebar */}
      <aside className="w-72 bg-surface/80 backdrop-blur-2xl border-r border-white/5 flex flex-col z-20 shadow-[5px_0_20px_rgba(0,0,0,0.5)]">
        
        {/* Logo / Brand */}
        <div className="h-24 flex items-center px-8 border-b border-white/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl -mr-16 -mt-16"></div>
          <NavLink to="/" className="flex items-center gap-3 relative z-10 group">
             <div className="relative">
               <Eye className="text-primary group-hover:text-white transition-colors" size={32} />
               <div className="absolute inset-0 bg-primary/20 blur-md rounded-full group-hover:bg-primary/50 transition-colors"></div>
             </div>
             <div>
               <h1 className="text-2xl font-display font-bold text-white tracking-widest">PREDIX</h1>
               <p className="text-[10px] text-primary font-mono tracking-[0.2em] uppercase">God's Eye System</p>
             </div>
          </NavLink>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-6 flex flex-col gap-2">
           <SidebarItem to="/gods-eye" icon={Eye} label="LIVE RADAR" />
           <SidebarItem to="/brain" icon={Brain} label="CEREBRO CM" />
           <SidebarItem to="/calendar" icon={CalendarIcon} label="OMNI CALENDAR" />
           <SidebarItem to="/music" icon={Headphones} label="MUSIC TRENDS" />
           <SidebarItem to="/vault" icon={Shield} label="VAULT DE ACCESOS" />
        </nav>

        {/* User Card */}
        <div className="p-6 border-t border-white/5 bg-background/50">
           <div className="glass-card p-4 flex items-center justify-between border-white/10 hover:border-primary/30 transition-colors">
              <div className="flex gap-3 items-center">
                 <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-secondary p-0.5">
                    <div className="w-full h-full bg-background rounded-full border border-background flex items-center justify-center font-mono text-sm text-white">D</div>
                 </div>
                 <div>
                   <p className="text-sm font-bold text-white">Dennis Vill</p>
                   <p className="text-xs text-accent font-mono">Master Admin</p>
                 </div>
              </div>
           </div>

           <div className="flex gap-2 mt-4 mt-auto">
             <button className="flex-1 py-2 text-xs font-mono text-text-muted hover:text-white bg-surface rounded-lg hover:bg-surface-hover flex items-center justify-center gap-2 transition-colors">
               <Settings size={14} /> Ajustes
             </button>
             <button className="w-10 flex items-center justify-center text-text-muted hover:text-red-400 bg-surface rounded-lg hover:bg-surface-hover transition-colors">
               <LogOut size={14} />
             </button>
           </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 h-screen overflow-y-auto relative bg-[url('https://cors-anywhere.herokuapp.com/')] bg-[#040B16]">
         {/* Background Ambient Lights */}
         <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-[120px] pointer-events-none"></div>
         <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[150px] pointer-events-none"></div>
         
         <div className="relative z-10">
           <Outlet />
         </div>
      </main>

    </div>
  );
};

export default GodsEyeLayout;
