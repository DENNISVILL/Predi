import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Search, Bell, Settings, User } from 'lucide-react';

const Navbar = ({ onLogout, currentUser }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/explore', icon: Search, label: 'Explorar' },
    { path: '/alerts', icon: Bell, label: 'Alertas' },
    { path: '/settings', icon: Settings, label: 'Ajustes' }
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <motion.nav 
      className="fixed left-0 top-0 h-full w-64 glass-effect border-r border-gray-800 z-40"
      initial={{ x: -100 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="p-6">
        <motion.div 
          className="text-2xl font-bold gradient-text mb-8"
          whileHover={{ scale: 1.05 }}
        >
          Predix
        </motion.div>

        <div className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            
            return (
              <motion.button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                  active 
                    ? 'bg-gradient-to-r from-[#007bff] to-[#00ff9d] text-white' 
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </motion.button>
            );
          })}
        </div>

        <div className="absolute bottom-6 left-6 right-6">
          <div className="glass-effect rounded-xl p-4 mb-4">
            <div className="flex items-center gap-3">
              <img 
                src={currentUser?.avatar} 
                alt={currentUser?.name}
                className="w-10 h-10 rounded-full"
              />
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium truncate">{currentUser?.name}</p>
                <p className="text-gray-400 text-sm truncate">{currentUser?.email}</p>
              </div>
            </div>
          </div>

          <motion.button
            onClick={onLogout}
            className="w-full py-2 text-gray-400 hover:text-red-400 transition-colors duration-300 text-sm"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Cerrar Sesión
          </motion.button>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;