import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Brain,
  Settings,
  Save,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Zap,
  BarChart3,
  DollarSign,
  Clock,
  Activity
} from 'lucide-react';
import { useAdminStore } from '../../store/useAdminStore';

const AdminAIConfig = () => {
  const [activeTab, setActiveTab] = useState('models');
  const [editingConfig, setEditingConfig] = useState(null);

  const {
    aiConfigs,
    aiConfigsLoading,
    aiUsageLogs,
    fetchAIConfigs,
    updateAIConfig,
    fetchAIUsageLogs
  } = useAdminStore();

  useEffect(() => {
    fetchAIConfigs();
    fetchAIUsageLogs();
  }, [fetchAIConfigs, fetchAIUsageLogs]);

  const handleConfigUpdate = async (configId, data) => {
    try {
      await updateAIConfig(configId, data);
      setEditingConfig(null);
    } catch (error) {
      console.error('Failed to update AI config:', error);
    }
  };

  const tabs = [
    { id: 'models', label: 'AI Models', icon: Brain },
    { id: 'usage', label: 'Usage Analytics', icon: BarChart3 },
    { id: 'costs', label: 'Cost Management', icon: DollarSign },
    { id: 'limits', label: 'Rate Limits', icon: Clock }
  ];

  if (aiConfigsLoading) {
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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">AI Configuration</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage AI models, usage limits, and cost controls
          </p>
        </div>
        
        <button
          onClick={() => {
            fetchAIConfigs();
            fetchAIUsageLogs();
          }}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === 'models' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {aiConfigs?.map((config) => (
              <motion.div
                key={config.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      config.is_active ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                    }`}>
                      <Brain className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {config.model_name}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {config.provider || 'OpenAI'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {config.is_active ? (
                      <span className="flex items-center gap-1 text-green-600 text-sm">
                        <CheckCircle className="w-4 h-4" />
                        Active
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-gray-400 text-sm">
                        <AlertCircle className="w-4 h-4" />
                        Inactive
                      </span>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Max Tokens
                      </label>
                      <input
                        type="number"
                        value={config.max_tokens || 4096}
                        onChange={(e) => handleConfigUpdate(config.id, { max_tokens: parseInt(e.target.value) })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Temperature
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        max="2"
                        value={config.temperature || 0.7}
                        onChange={(e) => handleConfigUpdate(config.id, { temperature: parseFloat(e.target.value) })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Daily Limit
                    </label>
                    <input
                      type="number"
                      value={config.daily_limit || 1000}
                      onChange={(e) => handleConfigUpdate(config.id, { daily_limit: parseInt(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-2">
                      <Activity className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        Used today: {config.usage_today || 0}
                      </span>
                    </div>
                    <button
                      onClick={() => handleConfigUpdate(config.id, { is_active: !config.is_active })}
                      className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                        config.is_active
                          ? 'bg-red-100 text-red-700 hover:bg-red-200'
                          : 'bg-green-100 text-green-700 hover:bg-green-200'
                      }`}
                    >
                      {config.is_active ? 'Disable' : 'Enable'}
                    </button>
                  </div>
                </div>
              </motion.div>
            )) || (
              <div className="col-span-2 text-center py-12">
                <Brain className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p className="text-gray-500 dark:text-gray-400">No AI configurations found</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'usage' && (
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Usage Analytics</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {[
                { label: 'Total Requests Today', value: '1,234', icon: Zap, color: 'blue' },
                { label: 'Average Response Time', value: '1.2s', icon: Clock, color: 'green' },
                { label: 'Success Rate', value: '99.8%', icon: CheckCircle, color: 'purple' }
              ].map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center bg-${stat.color}-100 text-${stat.color}-600`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Model</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Requests</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Tokens</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Cost</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Last Used</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {aiUsageLogs?.slice(0, 10).map((log, index) => (
                    <tr key={index}>
                      <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{log.model_name}</td>
                      <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">{log.request_count || 1}</td>
                      <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">{log.tokens_used}</td>
                      <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">${(log.cost || 0).toFixed(4)}</td>
                      <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                        {new Date(log.created_at).toLocaleString()}
                      </td>
                    </tr>
                  )) || (
                    <tr>
                      <td colSpan="5" className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                        No usage data available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'costs' && (
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Cost Management</h3>
            <p className="text-gray-500 dark:text-gray-400">Cost management features coming soon...</p>
          </div>
        )}

        {activeTab === 'limits' && (
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Rate Limits</h3>
            <p className="text-gray-500 dark:text-gray-400">Rate limiting configuration coming soon...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminAIConfig;
