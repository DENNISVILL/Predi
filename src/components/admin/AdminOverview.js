import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  DollarSign,
  CreditCard,
  Brain,
  TrendingUp,
  TrendingDown,
  Activity,
  UserPlus,
  AlertTriangle,
  CheckCircle,
  Clock,
  BarChart3,
  PieChart,
  Calendar
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { useAdminStore } from '../../store/useAdminStore';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler
);

const AdminOverview = () => {
  const { dashboardStats, fetchDashboardStats } = useAdminStore();
  const [timeRange, setTimeRange] = useState('7d');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadStats = async () => {
      setIsLoading(true);
      await fetchDashboardStats();
      setIsLoading(false);
    };
    loadStats();
  }, [fetchDashboardStats, timeRange]);

  // Mock data for charts (in real app, this would come from API)
  const revenueData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    datasets: [
      {
        label: 'Revenue',
        data: [12000, 19000, 15000, 25000, 22000, 30000, 28000],
        borderColor: 'rgb(147, 51, 234)',
        backgroundColor: 'rgba(147, 51, 234, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const userGrowthData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [
      {
        label: 'New Users',
        data: [65, 89, 120, 151],
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
      },
      {
        label: 'Active Users',
        data: [280, 320, 380, 420],
        backgroundColor: 'rgba(16, 185, 129, 0.8)',
      },
    ],
  };

  const subscriptionData = {
    labels: ['Free', 'Basic', 'Pro', 'Enterprise'],
    datasets: [
      {
        data: [45, 30, 20, 5],
        backgroundColor: [
          'rgba(156, 163, 175, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(147, 51, 234, 0.8)',
          'rgba(245, 158, 11, 0.8)',
        ],
        borderWidth: 0,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(156, 163, 175, 0.1)',
        },
      },
      x: {
        grid: {
          color: 'rgba(156, 163, 175, 0.1)',
        },
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
  };

  const statCards = [
    {
      title: 'Total Users',
      value: dashboardStats.totalUsers?.toLocaleString() || '0',
      change: '+12.5%',
      changeType: 'positive',
      icon: Users,
      color: 'blue',
      description: 'Total registered users'
    },
    {
      title: 'Active Subscriptions',
      value: dashboardStats.activeSubscriptions?.toLocaleString() || '0',
      change: '+8.2%',
      changeType: 'positive',
      icon: CreditCard,
      color: 'green',
      description: 'Currently active subscriptions'
    },
    {
      title: 'Total Revenue',
      value: `$${dashboardStats.totalRevenue?.toLocaleString() || '0'}`,
      change: '+15.3%',
      changeType: 'positive',
      icon: DollarSign,
      color: 'purple',
      description: 'Total revenue this month'
    },
    {
      title: 'AI Usage',
      value: dashboardStats.aiUsage?.toLocaleString() || '0',
      change: '+23.1%',
      changeType: 'positive',
      icon: Brain,
      color: 'pink',
      description: 'AI predictions generated'
    },
    {
      title: 'New Users Today',
      value: dashboardStats.newUsersToday?.toLocaleString() || '0',
      change: '+5.7%',
      changeType: 'positive',
      icon: UserPlus,
      color: 'indigo',
      description: 'Users registered today'
    },
    {
      title: 'Revenue Today',
      value: `$${dashboardStats.revenueToday?.toLocaleString() || '0'}`,
      change: '+18.9%',
      changeType: 'positive',
      icon: TrendingUp,
      color: 'emerald',
      description: 'Revenue generated today'
    },
    {
      title: 'Conversion Rate',
      value: `${dashboardStats.conversionRate?.toFixed(1) || '0.0'}%`,
      change: '+2.1%',
      changeType: 'positive',
      icon: BarChart3,
      color: 'orange',
      description: 'Free to paid conversion'
    },
    {
      title: 'Churn Rate',
      value: `${dashboardStats.churnRate?.toFixed(1) || '0.0'}%`,
      change: '-1.3%',
      changeType: 'negative',
      icon: AlertTriangle,
      color: 'red',
      description: 'Monthly churn rate'
    }
  ];

  const getColorClasses = (color) => {
    const colors = {
      blue: 'from-blue-500 to-blue-600',
      green: 'from-green-500 to-green-600',
      purple: 'from-purple-500 to-purple-600',
      pink: 'from-pink-500 to-pink-600',
      indigo: 'from-indigo-500 to-indigo-600',
      emerald: 'from-emerald-500 to-emerald-600',
      orange: 'from-orange-500 to-orange-600',
      red: 'from-red-500 to-red-600',
    };
    return colors[color] || colors.blue;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Dashboard Overview
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Monitor your platform's performance and key metrics
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
          </select>
          
          <button
            onClick={() => fetchDashboardStats()}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
          >
            <Activity className="w-4 h-4" />
            Refresh
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 bg-gradient-to-r ${getColorClasses(stat.color)} rounded-lg flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className={`flex items-center gap-1 text-sm font-medium ${
                  stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.changeType === 'positive' ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : (
                    <TrendingDown className="w-4 h-4" />
                  )}
                  {stat.change}
                </div>
              </div>
              
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                  {stat.value}
                </h3>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  {stat.title}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500">
                  {stat.description}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Revenue Trend
            </h3>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Calendar className="w-4 h-4" />
              Last 7 months
            </div>
          </div>
          <div className="h-64">
            <Line data={revenueData} options={chartOptions} />
          </div>
        </motion.div>

        {/* User Growth Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              User Growth
            </h3>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <BarChart3 className="w-4 h-4" />
              Weekly data
            </div>
          </div>
          <div className="h-64">
            <Bar data={userGrowthData} options={chartOptions} />
          </div>
        </motion.div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Subscription Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Subscription Plans
            </h3>
            <PieChart className="w-5 h-5 text-gray-400" />
          </div>
          <div className="h-64">
            <Doughnut data={subscriptionData} options={doughnutOptions} />
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Recent Activity
            </h3>
            <button className="text-purple-600 hover:text-purple-700 text-sm font-medium">
              View All
            </button>
          </div>
          
          <div className="space-y-4">
            {[
              {
                icon: UserPlus,
                title: 'New user registration',
                description: 'john.doe@example.com joined the platform',
                time: '2 minutes ago',
                type: 'success'
              },
              {
                icon: CreditCard,
                title: 'Subscription upgrade',
                description: 'User upgraded to Pro plan',
                time: '15 minutes ago',
                type: 'success'
              },
              {
                icon: Brain,
                title: 'AI prediction generated',
                description: 'Viral prediction for TikTok content',
                time: '32 minutes ago',
                type: 'info'
              },
              {
                icon: AlertTriangle,
                title: 'Payment failed',
                description: 'Subscription renewal failed for user',
                time: '1 hour ago',
                type: 'warning'
              },
              {
                icon: CheckCircle,
                title: 'System backup completed',
                description: 'Daily backup completed successfully',
                time: '2 hours ago',
                type: 'success'
              }
            ].map((activity, index) => {
              const Icon = activity.icon;
              const typeColors = {
                success: 'text-green-600 bg-green-100',
                info: 'text-blue-600 bg-blue-100',
                warning: 'text-yellow-600 bg-yellow-100',
                error: 'text-red-600 bg-red-100'
              };
              
              return (
                <div key={index} className="flex items-start gap-4 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${typeColors[activity.type]}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {activity.title}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                      {activity.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <Clock className="w-3 h-3" />
                    {activity.time}
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminOverview;
