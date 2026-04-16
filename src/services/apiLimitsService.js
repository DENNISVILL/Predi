// 🛡️ SERVICIO DE CONTROL DE LÍMITES DE APIs
// Evita que se pasen los límites gratuitos y controla costos

class ApiLimitsService {
  constructor() {
    this.limits = {
      // Límites seguros (con buffer del 20-25%)
      instagram: {
        free: { requests: 150, period: 'hour' },
        basic: { requests: 500, period: 'hour' },
        pro: { requests: 1000, period: 'hour' },
        premium: { requests: 2000, period: 'hour' }
      },
      youtube: {
        free: { requests: 7500, period: 'day' },
        basic: { requests: 25000, period: 'day' },
        pro: { requests: 50000, period: 'day' },
        premium: { requests: 100000, period: 'day' }
      },
      twitter: {
        free: { requests: 1200, period: 'month' },
        basic: { requests: 50000, period: 'month' },
        pro: { requests: 200000, period: 'month' },
        premium: { requests: 500000, period: 'month' }
      },
      spotify: {
        free: { requests: 80, period: 'minute' },
        basic: { requests: 200, period: 'minute' },
        pro: { requests: 500, period: 'minute' },
        premium: { requests: 1000, period: 'minute' }
      },
      gpt: {
        free: { tokens: 100000, cost: 5 }, // $5/mes máximo
        basic: { tokens: 500000, cost: 25 },
        pro: { tokens: 2000000, cost: 100 },
        premium: { tokens: 5000000, cost: 250 }
      }
    };

    this.usage = new Map(); // Tracking de uso por usuario
    this.costs = new Map(); // Tracking de costos
  }

  // 🎯 VERIFICAR SI PUEDE HACER REQUEST
  canMakeRequest(userId, api, plan = 'free') {
    const limit = this.limits[api][plan];
    if (!limit) return false;

    const userKey = `${userId}_${api}_${plan}`;
    const now = new Date();
    
    // Obtener uso actual
    const usage = this.usage.get(userKey) || {
      count: 0,
      resetTime: this.getResetTime(limit.period, now)
    };

    // Verificar si necesita reset
    if (now > usage.resetTime) {
      usage.count = 0;
      usage.resetTime = this.getResetTime(limit.period, now);
    }

    // Verificar límite
    if (usage.count >= limit.requests) {
      console.warn(`[ApiLimits] User ${userId} exceeded ${api} limit for ${plan} plan`);
      return false;
    }

    return true;
  }

  // 📊 REGISTRAR USO
  recordUsage(userId, api, plan = 'free', cost = 0) {
    const userKey = `${userId}_${api}_${plan}`;
    const now = new Date();
    
    // Actualizar contador de uso
    const usage = this.usage.get(userKey) || {
      count: 0,
      resetTime: this.getResetTime(this.limits[api][plan].period, now)
    };

    usage.count++;
    this.usage.set(userKey, usage);

    // Registrar costo
    if (cost > 0) {
      const costKey = `${userId}_${api}_cost`;
      const currentCost = this.costs.get(costKey) || 0;
      this.costs.set(costKey, currentCost + cost);
    }

    console.log(`[ApiLimits] ${userId} used ${api}: ${usage.count}/${this.limits[api][plan].requests}`);
  }

  // ⏰ CALCULAR TIEMPO DE RESET
  getResetTime(period, now) {
    switch (period) {
      case 'minute':
        return new Date(now.getTime() + 60 * 1000);
      case 'hour':
        return new Date(now.getTime() + 60 * 60 * 1000);
      case 'day':
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);
        return tomorrow;
      case 'month':
        const nextMonth = new Date(now);
        nextMonth.setMonth(nextMonth.getMonth() + 1);
        nextMonth.setDate(1);
        nextMonth.setHours(0, 0, 0, 0);
        return nextMonth;
      default:
        return new Date(now.getTime() + 24 * 60 * 60 * 1000);
    }
  }

  // 📈 OBTENER ESTADÍSTICAS DE USO
  getUsageStats(userId, api, plan) {
    const userKey = `${userId}_${api}_${plan}`;
    const usage = this.usage.get(userKey) || { count: 0, resetTime: new Date() };
    const limit = this.limits[api][plan];

    return {
      used: usage.count,
      limit: limit.requests,
      remaining: Math.max(0, limit.requests - usage.count),
      percentage: (usage.count / limit.requests) * 100,
      resetTime: usage.resetTime,
      period: limit.period
    };
  }

  // 💰 OBTENER COSTOS ACUMULADOS
  getCosts(userId, api = null) {
    if (api) {
      const costKey = `${userId}_${api}_cost`;
      return this.costs.get(costKey) || 0;
    }

    // Todos los costos del usuario
    let totalCost = 0;
    for (const [key, cost] of this.costs.entries()) {
      if (key.startsWith(`${userId}_`)) {
        totalCost += cost;
      }
    }
    return totalCost;
  }

  // 🚨 VERIFICAR ALERTAS DE LÍMITES
  checkLimitAlerts(userId, api, plan) {
    const stats = this.getUsageStats(userId, api, plan);
    const alerts = [];

    if (stats.percentage >= 80) {
      alerts.push({
        type: 'warning',
        message: `Has usado ${stats.percentage.toFixed(1)}% de tu límite de ${api}`,
        remaining: stats.remaining
      });
    }

    if (stats.percentage >= 95) {
      alerts.push({
        type: 'critical',
        message: `¡Límite casi alcanzado! Solo ${stats.remaining} requests restantes`,
        suggestion: 'Considera upgrader tu plan'
      });
    }

    if (stats.remaining === 0) {
      alerts.push({
        type: 'blocked',
        message: `Límite alcanzado para ${api}. Reset: ${stats.resetTime.toLocaleString()}`,
        resetTime: stats.resetTime
      });
    }

    return alerts;
  }

  // 🎯 SUGERIR UPGRADE DE PLAN
  suggestPlanUpgrade(userId) {
    const suggestions = [];
    
    Object.keys(this.limits).forEach(api => {
      const freeStats = this.getUsageStats(userId, api, 'free');
      
      if (freeStats.percentage >= 80) {
        suggestions.push({
          api,
          currentUsage: freeStats.used,
          currentLimit: freeStats.limit,
          suggestedPlan: 'basic',
          newLimit: this.limits[api].basic.requests,
          benefit: `${this.limits[api].basic.requests - freeStats.limit} requests adicionales`
        });
      }
    });

    return suggestions;
  }

  // 🔄 RESET MANUAL (para testing)
  resetUsage(userId, api = null) {
    if (api) {
      const userKey = `${userId}_${api}`;
      this.usage.delete(userKey);
    } else {
      // Reset todo el usuario
      for (const key of this.usage.keys()) {
        if (key.startsWith(`${userId}_`)) {
          this.usage.delete(key);
        }
      }
    }
  }

  // 📊 ESTADÍSTICAS GLOBALES
  getGlobalStats() {
    const stats = {
      totalUsers: new Set(),
      apiUsage: {},
      totalCosts: 0
    };

    // Contar usuarios únicos y uso por API
    for (const [key, usage] of this.usage.entries()) {
      const [userId, api] = key.split('_');
      stats.totalUsers.add(userId);
      
      if (!stats.apiUsage[api]) {
        stats.apiUsage[api] = { users: new Set(), totalRequests: 0 };
      }
      
      stats.apiUsage[api].users.add(userId);
      stats.apiUsage[api].totalRequests += usage.count;
    }

    // Calcular costos totales
    for (const cost of this.costs.values()) {
      stats.totalCosts += cost;
    }

    // Convertir Sets a números
    stats.totalUsers = stats.totalUsers.size;
    Object.keys(stats.apiUsage).forEach(api => {
      stats.apiUsage[api].users = stats.apiUsage[api].users.size;
    });

    return stats;
  }
}

export default new ApiLimitsService();
