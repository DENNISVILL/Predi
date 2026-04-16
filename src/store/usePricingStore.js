import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const usePricingStore = create(
  persist(
    (set, get) => ({
      // Estado inicial
      currentPlan: 'free',
      billingCycle: 'monthly',
      subscriptionStatus: 'active',
      subscriptionData: null,
      affiliateData: null,
      
      // Definición de planes
      plans: {
        free: {
          id: 'free',
          name: 'Gratuito',
          price: { monthly: 0, yearly: 0 },
          features: [
            '3 predicciones por día (90/mes)',
            'Dashboard básico',
            '1 plataforma (TikTok o Instagram)',
            'Alertas por email (máx 5/día)',
            'Análisis básico de tendencias',
            'Historial de 7 días',
            'Soporte por email (48h)',
            'Marca de agua en reportes'
          ],
          limits: {
            predictionsPerDay: 3,
            platforms: 1,
            emailAlerts: 5,
            historyDays: 7,
            apiCalls: 0,
            users: 1
          }
        },
        basic: {
          id: 'basic',
          name: 'Básico',
          price: { monthly: 12, yearly: 120 },
          features: [
            '25 predicciones por día (750/mes)',
            'Dashboard completo con gráficos',
            '3 plataformas (TikTok, Instagram, YouTube)',
            'Alertas en tiempo real (ilimitadas)',
            'Análisis de sentimiento básico',
            'Historial de 30 días',
            'Exportar reportes (PDF/CSV)',
            'Soporte por chat (24h)',
            'Sin marca de agua',
            'Filtros avanzados'
          ],
          limits: {
            predictionsPerDay: 25,
            platforms: 3,
            emailAlerts: -1, // ilimitado
            historyDays: 30,
            apiCalls: 0,
            users: 1
          }
        },
        pro: {
          id: 'pro',
          name: 'Pro',
          price: { monthly: 29, yearly: 290 },
          features: [
            'Predicciones ilimitadas',
            'Dashboard premium personalizable',
            '5 plataformas (TikTok, Instagram, Twitter, YouTube, Spotify)',
            'Alertas inteligentes con IA',
            'Análisis predictivo avanzado',
            'Generador de contenido IA (50/mes)',
            'Historial ilimitado',
            'API básica (1,000 calls/mes)',
            'Integraciones (Hootsuite, Buffer)',
            'Análisis de competencia',
            'Soporte prioritario (4h)',
            'Reportes automáticos',
            'White-label básico'
          ],
          limits: {
            predictionsPerDay: -1, // ilimitado
            platforms: -1, // todas
            emailAlerts: -1,
            historyDays: -1,
            apiCalls: 1000,
            users: 1
          },
          popular: true
        },
        premium: {
          id: 'premium',
          name: 'Premium',
          price: { monthly: 59, yearly: 590 },
          features: [
            'Todo del Plan Pro +',
            'IA personalizada con tus datos',
            'Análisis predictivo enterprise',
            'API avanzada (10,000 calls/mes)',
            'Integraciones premium (Zapier, Slack)',
            'Todas las plataformas (+ LinkedIn)',
            'Multi-usuario (hasta 5 usuarios)',
            'Dashboard personalizado por usuario',
            'Alertas por SMS/Slack/Teams',
            'Análisis de ROI automático',
            'Generador contenido ilimitado',
            'Alertas de crisis automáticas',
            'Soporte 24/7 (1h respuesta)',
            'White-label completo',
            'Reportes ejecutivos',
            'Acceso beta a nuevas features'
          ],
          limits: {
            predictionsPerDay: -1,
            platforms: -1,
            emailAlerts: -1,
            historyDays: -1,
            apiCalls: 10000,
            users: 5
          }
        },
        entrepreneur: {
          id: 'entrepreneur',
          name: 'Emprendedor',
          price: { monthly: 0, yearly: 0 },
          features: [
            'Acceso completo Plan Pro (valor $29/mes)',
            'Comisión del 30% por referidos',
            'Bonus $100 por cada 10 referidos activos',
            'Acceso VIP a eventos y webinars',
            'Contenido exclusivo para promoción',
            'Certificación oficial Partner Predix',
            'Soporte dedicado para embajadores',
            'Dashboard de afiliados con métricas',
            'Material de marketing personalizado',
            'Acceso anticipado a nuevas features'
          ],
          limits: {
            predictionsPerDay: -1,
            platforms: -1,
            emailAlerts: -1,
            historyDays: -1,
            apiCalls: 1000,
            users: 1
          },
          requirements: [
            'Mínimo 1,000 seguidores en redes',
            'Crear contenido sobre Predix (2 posts/mes)',
            'Generar mínimo 5 referidos en 3 meses',
            'Mantener engagement activo'
          ],
          special: true
        },
        enterprise: {
          id: 'enterprise',
          name: 'Enterprise',
          price: { monthly: 149, yearly: 1490 },
          features: [
            'Todo del Plan Premium +',
            'Usuarios ilimitados',
            'API enterprise (llamadas ilimitadas)',
            'Integración on-premise',
            'SLA garantizado 99.9%',
            'Soporte dedicado 24/7',
            'Account manager asignado',
            'Customización completa',
            'Compliance (SOC2, GDPR)',
            'Training personalizado',
            'Consultoría estratégica mensual',
            'Roadmap personalizado',
            'Multi-tenant architecture'
          ],
          limits: {
            predictionsPerDay: -1,
            platforms: -1,
            emailAlerts: -1,
            historyDays: -1,
            apiCalls: -1,
            users: -1
          }
        }
      },

      // Acciones
      setCurrentPlan: (planId) => set({ currentPlan: planId }),
      
      setBillingCycle: (cycle) => set({ billingCycle: cycle }),
      
      getCurrentPlanData: () => {
        const { currentPlan, plans } = get();
        return plans[currentPlan] || plans.free;
      },
      
      getPlanPrice: (planId, cycle = null) => {
        const { plans, billingCycle } = get();
        const plan = plans[planId];
        if (!plan || plan.price === 'custom') return null;
        
        const selectedCycle = cycle || billingCycle;
        return plan.price[selectedCycle] || 0;
      },
      
      canAccessFeature: (feature) => {
        const currentPlan = get().getCurrentPlanData();
        const limits = currentPlan.limits;
        
        switch (feature) {
          case 'predictions':
            return limits.predictionsPerDay === -1 || limits.predictionsPerDay > 0;
          case 'api':
            return limits.apiCalls > 0 || limits.apiCalls === -1;
          case 'multiUser':
            return limits.users > 1 || limits.users === -1;
          case 'allPlatforms':
            return limits.platforms === -1;
          case 'unlimitedHistory':
            return limits.historyDays === -1;
          default:
            return true;
        }
      },
      
      getRemainingPredictions: () => {
        const currentPlan = get().getCurrentPlanData();
        const usedToday = get().subscriptionData?.usedPredictionsToday || 0;
        
        if (currentPlan.limits.predictionsPerDay === -1) return -1; // ilimitado
        return Math.max(0, currentPlan.limits.predictionsPerDay - usedToday);
      },
      
      // Gestión de suscripción
      updateSubscriptionData: (data) => set({ subscriptionData: data }),
      
      // Programa de afiliados
      setAffiliateData: (data) => set({ affiliateData: data }),
      
      getAffiliateStats: () => {
        const { affiliateData } = get();
        if (!affiliateData) return null;
        
        return {
          totalReferrals: affiliateData.referrals?.length || 0,
          activeReferrals: affiliateData.referrals?.filter(r => r.status === 'active').length || 0,
          totalEarnings: affiliateData.totalEarnings || 0,
          pendingEarnings: affiliateData.pendingEarnings || 0,
          commissionRate: 0.30 // 30%
        };
      },
      
      // Upgrade/Downgrade
      upgradePlan: async (newPlanId) => {
        try {
          // Aquí iría la lógica de API para actualizar la suscripción
          set({ currentPlan: newPlanId });
          return { success: true };
        } catch (error) {
          return { success: false, error: error.message };
        }
      },
      
      // Aplicar para programa emprendedor
      applyForEntrepreneurProgram: async (applicationData) => {
        try {
          // Aquí iría la lógica de API para aplicar al programa
          return { success: true, message: 'Aplicación enviada correctamente' };
        } catch (error) {
          return { success: false, error: error.message };
        }
      },
      
      // Validar límites
      validateUsage: (action, amount = 1) => {
        const currentPlan = get().getCurrentPlanData();
        const limits = currentPlan.limits;
        const subscriptionData = get().subscriptionData || {};
        
        switch (action) {
          case 'prediction':
            if (limits.predictionsPerDay === -1) return true;
            const usedToday = subscriptionData.usedPredictionsToday || 0;
            return usedToday + amount <= limits.predictionsPerDay;
            
          case 'apiCall':
            if (limits.apiCalls === -1) return true;
            const usedApiCalls = subscriptionData.usedApiCalls || 0;
            return usedApiCalls + amount <= limits.apiCalls;
            
          case 'user':
            if (limits.users === -1) return true;
            const currentUsers = subscriptionData.activeUsers || 1;
            return currentUsers + amount <= limits.users;
            
          default:
            return true;
        }
      },
      
      // Reset store
      reset: () => set({
        currentPlan: 'free',
        billingCycle: 'monthly',
        subscriptionStatus: 'active',
        subscriptionData: null,
        affiliateData: null
      })
    }),
    {
      name: 'predix-pricing-store',
      partialize: (state) => ({
        currentPlan: state.currentPlan,
        billingCycle: state.billingCycle,
        subscriptionStatus: state.subscriptionStatus
      })
    }
  )
);

export default usePricingStore;
