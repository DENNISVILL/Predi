import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  Users, 
  CreditCard, 
  Brain, 
  Settings, 
  FileText, 
  Bell, 
  LogOut,
  Menu,
  X,
  Search,
  Moon,
  Sun,
  Shield,
  Activity,
  TrendingUp,
  DollarSign,
  UserPlus,
  AlertTriangle
} from 'lucide-react';
import { useAdminStore } from '../../store/useAdminStore';
import AdminOverview from './AdminOverview';
import AdminUsers from './AdminUsers';
import AdminSubscriptions from './AdminSubscriptions';
import AdminAIConfig from './AdminAIConfig';
import AdminSettings from './AdminSettings';
import AdminReports from './AdminReports';
import AdminNotifications from './AdminNotifications';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const { 
    admin, 
    logout, 
    dashboardStats, 
    fetchDashboardStats,
    notifications,
    fetchNotifications
  } = useAdminStore();

  useEffect(() => {
    fetchDashboardStats();
    fetchNotifications();
    
    // Refresh stats every 5 minutes
    const interval = setInterval(() => {
      fetchDashboardStats();
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [fetchDashboardStats, fetchNotifications]);

  const menuItems = [
    {
      id: 'overview',
      label: 'Overview',
      icon: LayoutDashboard,
      component: AdminOverview,
      badge: null
    },
    {
      id: 'users',
      label: 'Users',
      icon: Users,
      component: AdminUsers,
      badge: dashboardStats.newUsersToday > 0 ? dashboardStats.newUsersToday : null
    },
    {
      id: 'subscriptions',
      label: 'Subscriptions',
      icon: CreditCard,
      component: AdminSubscriptions,
      badge: null
    },
    {
      id: 'ai-config',
      label: 'AI Configuration',
      icon: Brain,
      component: AdminAIConfig,
      badge: null
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      component: AdminSettings,
      badge: null
    },
    {
      id: 'reports',
      label: 'Reports',
      icon: FileText,
      component: AdminReports,
      badge: null
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: Bell,
      component: AdminNotifications,
      badge: notifications.filter(n => n.is_active).length > 0 ? 
        notifications.filter(n => n.is_active).length : null
    }
  ];

  const ActiveComponent = menuItems.find(item => item.id === activeTab)?.component || AdminOverview;

  const handleLogout = () => {
    logout();
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div className={`min-h-screen bg-gray-50 ${darkMode ? 'dark' : ''}`}>
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-900 shadow-xl lg:static lg:inset-0"
            >
              <div className="flex flex-col h-full">
                {/* Logo */}
                <div className="flex items-center justify-between h-16 px-6 bg-gradient-to-r from-purple-600 to-pink-600">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                      <Shield className="w-5 h-5 text-purple-600" />
                    </div>
                    <span className="text-white font-bold text-lg">Predix Admin</span>
                  </div>
                  <button
                    onClick={() => setSidebarOpen(false)}
                    className="lg:hidden text-white hover:bg-white/20 p-1 rounded"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Admin Info */}
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">
                        {admin?.full_name?.charAt(0) || admin?.username?.charAt(0) || 'A'}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {admin?.full_name || admin?.username}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                        {admin?.role || 'Admin'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
                  {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    
                    return (
                      <motion.button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`w-full flex items-center justify-between px-4 py-3 text-left rounded-lg transition-all ${
                          isActive
                            ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Icon className="w-5 h-5" />
                          <span className="font-medium">{item.label}</span>
                        </div>
                        {item.badge && (
                          <span className={`px-2 py-1 text-xs font-bold rounded-full ${
                            isActive 
                              ? 'bg-white/20 text-white' 
                              : 'bg-red-500 text-white'
                          }`}>
                            {item.badge}
                          </span>
                        )}
                      </motion.button>
                    );
                  })}
                </nav>

                {/* Footer */}
                <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Theme</span>
                    <button
                      onClick={toggleDarkMode}
                      className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    >
                      {darkMode ? (
                        <Sun className="w-4 h-4 text-yellow-500" />
                      ) : (
                        <Moon className="w-4 h-4 text-gray-600" />
                      )}
                    </button>
                  </div>
                  
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  >
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium">Logout</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Top Bar */}
          <header className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between h-16 px-6">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <Menu className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </button>
                
                <h1 className="text-xl font-semibold text-gray-900 dark:text-white capitalize">
                  {activeTab.replace('-', ' ')}
                </h1>
              </div>

              <div className="flex items-center gap-4">
                {/* Search */}
                <div className="relative hidden md:block">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 w-64 bg-gray-100 dark:bg-gray-800 border-0 rounded-lg focus:ring-2 focus:ring-purple-500 focus:bg-white dark:focus:bg-gray-700 transition-all"
                  />
                </div>

                {/* Quick Stats */}
                <div className="hidden lg:flex items-center gap-6">
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-gray-600 dark:text-gray-400">
                      {dashboardStats.totalUsers} Users
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <DollarSign className="w-4 h-4 text-green-500" />
                    <span className="text-gray-600 dark:text-gray-400">
                      ${dashboardStats.totalRevenue?.toLocaleString() || 0}
                    </span>
                  </div>
                </div>

                {/* Notifications */}
                <div className="relative">
                  <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors relative">
                    <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    {notifications.filter(n => n.is_active).length > 0 && (
                      <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
                    )}
                  </button>
                </div>

                {/* Admin Avatar */}
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">
                      {admin?.full_name?.charAt(0) || admin?.username?.charAt(0) || 'A'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* Page Content */}
          <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900">
            <div className="p-6">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <ActiveComponent searchQuery={searchQuery} />
              </motion.div>
            </div>
          </main>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminDashboard;
