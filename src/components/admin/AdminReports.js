import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FileText,
  Download,
  Calendar,
  Filter,
  BarChart3,
  PieChart,
  TrendingUp,
  Users,
  DollarSign,
  Activity
} from 'lucide-react';

const AdminReports = () => {
  const [selectedReport, setSelectedReport] = useState('overview');
  const [dateRange, setDateRange] = useState('30d');
  const [isGenerating, setIsGenerating] = useState(false);

  const reports = [
    {
      id: 'overview',
      title: 'Platform Overview',
      description: 'Complete platform metrics and KPIs',
      icon: BarChart3,
      color: 'blue'
    },
    {
      id: 'users',
      title: 'User Analytics',
      description: 'User growth, engagement, and retention',
      icon: Users,
      color: 'green'
    },
    {
      id: 'revenue',
      title: 'Revenue Report',
      description: 'Financial performance and trends',
      icon: DollarSign,
      color: 'purple'
    },
    {
      id: 'ai-usage',
      title: 'AI Usage Report',
      description: 'AI model usage and performance metrics',
      icon: Activity,
      color: 'orange'
    }
  ];

  const handleGenerateReport = async (reportType, format) => {
    setIsGenerating(true);
    try {
      // Simulate report generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real app, this would call the API to generate and download the report
      console.log(`Generating ${reportType} report in ${format} format for ${dateRange}`);
      
      // Mock download
      const link = document.createElement('a');
      link.href = '#';
      link.download = `${reportType}_report_${new Date().toISOString().split('T')[0]}.${format}`;
      link.click();
    } catch (error) {
      console.error('Failed to generate report:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Reports & Analytics</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Generate comprehensive reports and export data
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
            <option value="1y">Last Year</option>
            <option value="custom">Custom Range</option>
          </select>
        </div>
      </div>

      {/* Report Types */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {reports.map((report, index) => {
          const Icon = report.icon;
          const colorClasses = {
            blue: 'from-blue-500 to-blue-600',
            green: 'from-green-500 to-green-600',
            purple: 'from-purple-500 to-purple-600',
            orange: 'from-orange-500 to-orange-600'
          };
          
          return (
            <motion.div
              key={report.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => setSelectedReport(report.id)}
              className={`cursor-pointer bg-white dark:bg-gray-800 rounded-lg border-2 transition-all p-6 ${
                selectedReport === report.id
                  ? 'border-purple-500 shadow-lg'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-12 h-12 bg-gradient-to-r ${colorClasses[report.color]} rounded-lg flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">{report.title}</h3>
                </div>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                {report.description}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleGenerateReport(report.id, 'pdf');
                  }}
                  disabled={isGenerating}
                  className="flex-1 px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm font-medium disabled:opacity-50"
                >
                  PDF
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleGenerateReport(report.id, 'csv');
                  }}
                  disabled={isGenerating}
                  className="flex-1 px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm font-medium disabled:opacity-50"
                >
                  CSV
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Report Preview */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {reports.find(r => r.id === selectedReport)?.title} Preview
          </h3>
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleGenerateReport(selectedReport, 'pdf')}
              disabled={isGenerating}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              {isGenerating ? 'Generating...' : 'Download PDF'}
            </button>
            <button
              onClick={() => handleGenerateReport(selectedReport, 'csv')}
              disabled={isGenerating}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              {isGenerating ? 'Generating...' : 'Export CSV'}
            </button>
          </div>
        </div>

        {/* Report Content */}
        <div className="space-y-6">
          {selectedReport === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: 'Total Users', value: '12,345', change: '+12.5%', positive: true },
                { label: 'Active Subscriptions', value: '3,456', change: '+8.2%', positive: true },
                { label: 'Monthly Revenue', value: '$45,678', change: '+15.3%', positive: true },
                { label: 'AI Predictions', value: '89,012', change: '+23.1%', positive: true }
              ].map((metric, index) => (
                <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{metric.label}</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{metric.value}</p>
                  <p className={`text-sm flex items-center gap-1 ${
                    metric.positive ? 'text-green-600' : 'text-red-600'
                  }`}>
                    <TrendingUp className="w-4 h-4" />
                    {metric.change}
                  </p>
                </div>
              ))}
            </div>
          )}

          {selectedReport === 'users' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { label: 'New Users', value: '1,234', period: 'This Month' },
                  { label: 'Active Users', value: '8,901', period: 'Last 30 Days' },
                  { label: 'Retention Rate', value: '85.2%', period: 'Monthly' }
                ].map((stat, index) => (
                  <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <p className="text-sm text-gray-500 dark:text-gray-400">{stat.period}</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{stat.label}</p>
                  </div>
                ))}
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-4">User Growth Chart</h4>
                <div className="h-64 flex items-center justify-center text-gray-500 dark:text-gray-400">
                  <PieChart className="w-16 h-16 mb-4" />
                  <p>Chart visualization would appear here</p>
                </div>
              </div>
            </div>
          )}

          {selectedReport === 'revenue' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { label: 'Total Revenue', value: '$123,456', change: '+15.3%' },
                  { label: 'Monthly Recurring', value: '$89,012', change: '+12.1%' },
                  { label: 'Average Order', value: '$45.67', change: '+5.8%' },
                  { label: 'Conversion Rate', value: '3.2%', change: '+0.5%' }
                ].map((metric, index) => (
                  <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{metric.label}</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{metric.value}</p>
                    <p className="text-sm text-green-600 flex items-center gap-1">
                      <TrendingUp className="w-4 h-4" />
                      {metric.change}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {selectedReport === 'ai-usage' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { label: 'Total Predictions', value: '456,789', change: '+23.1%' },
                  { label: 'API Calls', value: '123,456', change: '+18.7%' },
                  { label: 'Success Rate', value: '99.8%', change: '+0.2%' },
                  { label: 'Avg Response Time', value: '1.2s', change: '-0.3s' }
                ].map((metric, index) => (
                  <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{metric.label}</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{metric.value}</p>
                    <p className="text-sm text-green-600 flex items-center gap-1">
                      <TrendingUp className="w-4 h-4" />
                      {metric.change}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Scheduled Reports */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Scheduled Reports</h3>
        
        <div className="space-y-4">
          {[
            { name: 'Weekly Overview Report', frequency: 'Every Monday', nextRun: '2024-11-11', status: 'active' },
            { name: 'Monthly Revenue Report', frequency: 'First of month', nextRun: '2024-12-01', status: 'active' },
            { name: 'Quarterly Analytics', frequency: 'Every 3 months', nextRun: '2025-01-01', status: 'paused' }
          ].map((report, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">{report.name}</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {report.frequency} • Next: {report.nextRun}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  report.status === 'active' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {report.status}
                </span>
                <button className="text-purple-600 hover:text-purple-700 text-sm font-medium">
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>
        
        <button className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
          Add Scheduled Report
        </button>
      </div>
    </div>
  );
};

export default AdminReports;
