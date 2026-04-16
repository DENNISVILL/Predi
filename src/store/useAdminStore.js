import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Admin Store
export const useAdminStore = create(
  persist(
    (set, get) => ({
      // Authentication State
      isAuthenticated: false,
      admin: null,
      token: null,
      error: null,
      isLoading: false,

      // Dashboard Data
      dashboardStats: {
        totalUsers: 0,
        activeSubscriptions: 0,
        totalRevenue: 0,
        aiUsage: 0,
        newUsersToday: 0,
        revenueToday: 0,
        conversionRate: 0,
        churnRate: 0
      },

      // Users Management
      users: [],
      usersLoading: false,
      usersError: null,
      usersPagination: {
        page: 1,
        limit: 20,
        total: 0,
        totalPages: 0
      },
      usersFilters: {
        search: '',
        status: 'all',
        subscription: 'all',
        dateRange: 'all'
      },

      // Subscriptions Management
      subscriptions: [],
      subscriptionsLoading: false,
      subscriptionsError: null,

      // AI Configuration
      aiConfigs: [],
      aiConfigsLoading: false,
      aiUsageLogs: [],

      // System Settings
      systemSettings: {},
      settingsLoading: false,

      // Audit Logs
      auditLogs: [],
      auditLogsLoading: false,

      // Notifications
      notifications: [],

      // Actions
      login: async (username, password) => {
        set({ isLoading: true, error: null });

        try {
          const response = await fetch(`${API_BASE_URL}/api/v1/admin/auth/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
          });

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.detail || 'Login failed');
          }

          set({
            isAuthenticated: true,
            admin: data.admin,
            token: data.access_token,
            error: null,
            isLoading: false
          });

          // Set token for future requests
          localStorage.setItem('admin_token', data.access_token);

          return data;
        } catch (error) {
          set({
            error: error.message,
            isLoading: false,
            isAuthenticated: false,
            admin: null,
            token: null
          });
          throw error;
        }
      },

      register: async (userData) => {
        set({ isLoading: true, error: null });

        try {
          const response = await fetch(`${API_BASE_URL}/api/v1/admin/auth/register`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
          });

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.detail || 'Registration failed');
          }

          set({
            isAuthenticated: true,
            admin: data.admin,
            token: data.access_token,
            error: null,
            isLoading: false
          });

          localStorage.setItem('admin_token', data.access_token);

          return data;
        } catch (error) {
          set({
            error: error.message,
            isLoading: false
          });
          throw error;
        }
      },

      logout: () => {
        localStorage.removeItem('admin_token');
        set({
          isAuthenticated: false,
          admin: null,
          token: null,
          error: null,
          dashboardStats: {
            totalUsers: 0,
            activeSubscriptions: 0,
            totalRevenue: 0,
            aiUsage: 0,
            newUsersToday: 0,
            revenueToday: 0,
            conversionRate: 0,
            churnRate: 0
          },
          users: [],
          subscriptions: [],
          aiConfigs: [],
          systemSettings: {},
          auditLogs: [],
          notifications: []
        });
      },

      clearError: () => set({ error: null }),

      // Dashboard Actions
      fetchDashboardStats: async () => {
        const { token } = get();
        if (!token) return;

        try {
          const response = await fetch(`${API_BASE_URL}/api/v1/admin/dashboard/stats`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const stats = await response.json();
            set({ dashboardStats: stats });
          }
        } catch (error) {
          console.error('Failed to fetch dashboard stats:', error);
        }
      },

      // Users Management Actions
      fetchUsers: async (page = 1, filters = {}) => {
        const { token } = get();
        if (!token) return;

        set({ usersLoading: true, usersError: null });

        try {
          const queryParams = new URLSearchParams({
            page: page.toString(),
            limit: '20',
            ...filters
          });

          const response = await fetch(`${API_BASE_URL}/api/v1/admin/users?${queryParams}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const data = await response.json();
            set({
              users: data.users,
              usersPagination: {
                page: data.page,
                limit: data.limit,
                total: data.total,
                totalPages: data.total_pages
              },
              usersLoading: false
            });
          } else {
            throw new Error('Failed to fetch users');
          }
        } catch (error) {
          set({
            usersError: error.message,
            usersLoading: false
          });
        }
      },

      updateUser: async (userId, userData) => {
        const { token } = get();
        if (!token) return;

        try {
          const response = await fetch(`${API_BASE_URL}/api/v1/admin/users/${userId}`, {
            method: 'PUT',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
          });

          if (response.ok) {
            const updatedUser = await response.json();
            set(state => ({
              users: state.users.map(user =>
                user.id === userId ? updatedUser : user
              )
            }));
            return updatedUser;
          } else {
            throw new Error('Failed to update user');
          }
        } catch (error) {
          throw error;
        }
      },

      deleteUser: async (userId) => {
        const { token } = get();
        if (!token) return;

        try {
          const response = await fetch(`${API_BASE_URL}/api/v1/admin/users/${userId}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });

          if (response.ok) {
            set(state => ({
              users: state.users.filter(user => user.id !== userId)
            }));
            return true;
          } else {
            throw new Error('Failed to delete user');
          }
        } catch (error) {
          throw error;
        }
      },

      setUsersFilters: (filters) => {
        set(state => ({
          usersFilters: { ...state.usersFilters, ...filters }
        }));
      },

      // Subscriptions Management Actions
      fetchSubscriptions: async () => {
        const { token } = get();
        if (!token) return;

        set({ subscriptionsLoading: true, subscriptionsError: null });

        try {
          const response = await fetch(`${API_BASE_URL}/api/v1/admin/subscriptions`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const subscriptions = await response.json();
            set({ subscriptions, subscriptionsLoading: false });
          } else {
            throw new Error('Failed to fetch subscriptions');
          }
        } catch (error) {
          set({
            subscriptionsError: error.message,
            subscriptionsLoading: false
          });
        }
      },

      updateSubscription: async (subscriptionId, data) => {
        const { token } = get();
        if (!token) return;

        try {
          const response = await fetch(`${API_BASE_URL}/api/v1/admin/subscriptions/${subscriptionId}`, {
            method: 'PUT',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
          });

          if (response.ok) {
            const updatedSubscription = await response.json();
            set(state => ({
              subscriptions: state.subscriptions.map(sub =>
                sub.id === subscriptionId ? updatedSubscription : sub
              )
            }));
            return updatedSubscription;
          } else {
            throw new Error('Failed to update subscription');
          }
        } catch (error) {
          throw error;
        }
      },

      // AI Configuration Actions
      fetchAIConfigs: async () => {
        const { token } = get();
        if (!token) return;

        set({ aiConfigsLoading: true });

        try {
          const response = await fetch(`${API_BASE_URL}/api/v1/admin/ai/configs`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const configs = await response.json();
            set({ aiConfigs: configs, aiConfigsLoading: false });
          }
        } catch (error) {
          set({ aiConfigsLoading: false });
          console.error('Failed to fetch AI configs:', error);
        }
      },

      updateAIConfig: async (configId, configData) => {
        const { token } = get();
        if (!token) return;

        try {
          const response = await fetch(`${API_BASE_URL}/api/v1/admin/ai/configs/${configId}`, {
            method: 'PUT',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(configData),
          });

          if (response.ok) {
            const updatedConfig = await response.json();
            set(state => ({
              aiConfigs: state.aiConfigs.map(config =>
                config.id === configId ? updatedConfig : config
              )
            }));
            return updatedConfig;
          } else {
            throw new Error('Failed to update AI config');
          }
        } catch (error) {
          throw error;
        }
      },

      fetchAIUsageLogs: async (limit = 100) => {
        const { token } = get();
        if (!token) return;

        try {
          const response = await fetch(`${API_BASE_URL}/api/v1/admin/ai/usage?limit=${limit}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const logs = await response.json();
            set({ aiUsageLogs: logs });
          }
        } catch (error) {
          console.error('Failed to fetch AI usage logs:', error);
        }
      },

      // System Settings Actions
      fetchSystemSettings: async () => {
        const { token } = get();
        if (!token) return;

        set({ settingsLoading: true });

        try {
          const response = await fetch(`${API_BASE_URL}/api/v1/admin/settings`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const settings = await response.json();
            const settingsObj = settings.reduce((acc, setting) => {
              acc[setting.setting_key] = setting.setting_value;
              return acc;
            }, {});
            set({ systemSettings: settingsObj, settingsLoading: false });
          }
        } catch (error) {
          set({ settingsLoading: false });
          console.error('Failed to fetch system settings:', error);
        }
      },

      updateSystemSetting: async (key, value) => {
        const { token } = get();
        if (!token) return;

        try {
          const response = await fetch(`${API_BASE_URL}/api/v1/admin/settings/${key}`, {
            method: 'PUT',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ value }),
          });

          if (response.ok) {
            set(state => ({
              systemSettings: {
                ...state.systemSettings,
                [key]: value
              }
            }));
            return true;
          } else {
            throw new Error('Failed to update setting');
          }
        } catch (error) {
          throw error;
        }
      },

      // Audit Logs Actions
      fetchAuditLogs: async (limit = 100) => {
        const { token } = get();
        if (!token) return;

        set({ auditLogsLoading: true });

        try {
          const response = await fetch(`${API_BASE_URL}/api/v1/admin/audit-logs?limit=${limit}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const logs = await response.json();
            set({ auditLogs: logs, auditLogsLoading: false });
          }
        } catch (error) {
          set({ auditLogsLoading: false });
          console.error('Failed to fetch audit logs:', error);
        }
      },

      // Notifications Actions
      fetchNotifications: async () => {
        const { token } = get();
        if (!token) return;

        try {
          const response = await fetch(`${API_BASE_URL}/api/v1/admin/notifications`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const notifications = await response.json();
            set({ notifications });
          }
        } catch (error) {
          console.error('Failed to fetch notifications:', error);
        }
      },

      createNotification: async (notificationData) => {
        const { token } = get();
        if (!token) return;

        try {
          const response = await fetch(`${API_BASE_URL}/api/v1/admin/notifications`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(notificationData),
          });

          if (response.ok) {
            const newNotification = await response.json();
            set(state => ({
              notifications: [newNotification, ...state.notifications]
            }));
            return newNotification;
          } else {
            throw new Error('Failed to create notification');
          }
        } catch (error) {
          throw error;
        }
      },

      // Utility Actions
      initializeFromToken: async () => {
        const token = localStorage.getItem('admin_token');
        if (!token) return;

        try {
          const response = await fetch(`${API_BASE_URL}/api/v1/admin/auth/me`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const admin = await response.json();
            set({
              isAuthenticated: true,
              admin,
              token,
              error: null
            });
            return true;
          } else {
            localStorage.removeItem('admin_token');
            return false;
          }
        } catch (error) {
          localStorage.removeItem('admin_token');
          return false;
        }
      },

      // Export Data
      exportUsers: async (format = 'csv') => {
        const { token } = get();
        if (!token) return;

        try {
          const response = await fetch(`${API_BASE_URL}/api/v1/admin/export/users?format=${format}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `users_export_${new Date().toISOString().split('T')[0]}.${format}`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
          }
        } catch (error) {
          console.error('Failed to export users:', error);
        }
      },

      exportSubscriptions: async (format = 'csv') => {
        const { token } = get();
        if (!token) return;

        try {
          const response = await fetch(`${API_BASE_URL}/api/v1/admin/export/subscriptions?format=${format}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `subscriptions_export_${new Date().toISOString().split('T')[0]}.${format}`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
          }
        } catch (error) {
          console.error('Failed to export subscriptions:', error);
        }
      }
    }),
    {
      name: 'admin-store',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        admin: state.admin,
        token: state.token
      })
    }
  )
);
