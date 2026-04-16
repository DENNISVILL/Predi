import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Check, Star, Shield, Gift } from 'lucide-react';

import { pricingPlans } from '../data/pricingData';

const PricingPlans = ({ onSelectPlan }) => {
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [showEnterprise, setShowEnterprise] = useState(false);

  // Filter out enterprise from the main list as it was handled separately in original code
  // but let's see how the original grid used it. 
  // The original code had 'plans' array AND 'enterprisePlan' object.
  // We unified them in the data file. Let's split them back for rendering consistency.

  const standardPlans = pricingPlans.filter(p => p.id !== 'enterprise');
  const enterprisePlan = pricingPlans.find(p => p.id === 'enterprise');

  const getDisplayPrice = (plan) => {
    if (plan.id === 'free' || plan.id === 'entrepreneur') return 'GRATIS';
    if (plan.id === 'enterprise') {
      const price = billingCycle === 'yearly' ? plan.price.yearly : plan.price.monthly;
      return `$${price}`;
    }

    const price = billingCycle === 'yearly' ? plan.price.yearly : plan.price.monthly;
    return `$${price}`;
  };

  const getSavings = (plan) => {
    if (billingCycle === 'yearly' && plan.price.yearly < plan.price.monthly) {
      const savings = Math.round(((plan.price.monthly * 12 - plan.originalPrice.yearly) / (plan.price.monthly * 12)) * 100);
      return `Ahorra ${savings}%`;
    }
    return null;
  };

  return (
    <div id="pricing" className="py-20 px-6 bg-gradient-to-br from-[#0b0c10] via-[#1a1a2e] to-[#16213e]">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
            Planes para cada necesidad
          </h2>
          <p className="text-xl text-gray-400 mb-8">
            Desde startups hasta empresas Fortune 500
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <span className={`text-sm ${billingCycle === 'monthly' ? 'text-white' : 'text-gray-400'}`}>
              Mensual
            </span>
            <motion.button
              className="relative w-14 h-7 bg-gray-600 rounded-full p-1"
              onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                className="w-5 h-5 bg-gradient-to-r from-[#007bff] to-[#00ff9d] rounded-full"
                animate={{ x: billingCycle === 'yearly' ? 28 : 0 }}
                transition={{ duration: 0.3 }}
              />
            </motion.button>
            <span className={`text-sm ${billingCycle === 'yearly' ? 'text-white' : 'text-gray-400'}`}>
              Anual
            </span>
            {billingCycle === 'yearly' && (
              <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full">
                Ahorra 17%
              </span>
            )}
          </div>
        </motion.div>

        {/* Plans Grid */}
        <div className="grid lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-12">
          {standardPlans.map((plan, index) => (
            <motion.div
              key={plan.id}
              className={`relative glass-effect rounded-2xl p-6 ${plan.highlight ? 'border-2 border-[#00ff9d] scale-105' : ''
                } ${plan.special ? 'border-2 border-yellow-500/50' : ''}`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-[#007bff] to-[#00ff9d] text-white px-4 py-1 rounded-full text-sm font-semibold">
                  <Star className="w-4 h-4 inline mr-1" />
                  Más Popular
                </div>
              )}

              {/* Special Badge */}
              {plan.special && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                  <Gift className="w-4 h-4 inline mr-1" />
                  Colaboración
                </div>
              )}

              {/* Plan Header */}
              <div className="text-center mb-6">
                <div className={`w-12 h-12 mx-auto mb-4 rounded-full bg-gradient-to-r ${plan.color} flex items-center justify-center`}>
                  <plan.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                <p className="text-gray-400 text-sm mb-4">{plan.description}</p>

                <div className="mb-2">
                  <span className="text-3xl font-bold text-white">{getDisplayPrice(plan)}</span>
                  {plan.price.monthly > 0 && (
                    <span className="text-gray-400 text-sm ml-1">
                      /{billingCycle === 'yearly' ? 'año' : 'mes'}
                    </span>
                  )}
                </div>

                {getSavings(plan) && (
                  <span className="text-green-400 text-xs bg-green-500/20 px-2 py-1 rounded-full">
                    {getSavings(plan)}
                  </span>
                )}
              </div>

              {/* Features */}
              <div className="space-y-3 mb-6">
                {plan.features.slice(0, 6).map((feature, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-[#00ff9d] flex-shrink-0 mt-0.5" />
                    <span className="text-gray-300 text-sm">{feature}</span>
                  </div>
                ))}

                {plan.features.length > 6 && (
                  <div className="text-center">
                    <span className="text-[#007bff] text-sm cursor-pointer hover:underline">
                      +{plan.features.length - 6} características más
                    </span>
                  </div>
                )}
              </div>

              {/* Requirements (for Entrepreneur plan) */}
              {plan.requirements && (
                <div className="mb-6">
                  <h4 className="text-yellow-400 text-sm font-semibold mb-2">Requisitos:</h4>
                  <div className="space-y-2">
                    {plan.requirements.map((req, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <Shield className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-400 text-xs">{req}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* CTA Button */}
              <motion.button
                className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 ${plan.highlight
                  ? 'bg-gradient-to-r from-[#007bff] to-[#00ff9d] text-white hover:shadow-xl'
                  : plan.special
                    ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white hover:shadow-xl'
                    : 'border border-gray-600 text-white hover:bg-white/5'
                  }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onSelectPlan && onSelectPlan(plan)}
              >
                {plan.cta}
              </motion.button>
            </motion.div>
          ))}
        </div>

        {/* Enterprise Plan */}
        <motion.div
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="glass-effect rounded-2xl p-8 border border-indigo-500/30">
            <div className="flex flex-col lg:flex-row items-center gap-8">
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-4">
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${enterprisePlan.color} flex items-center justify-center`}>
                    <enterprisePlan.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">{enterprisePlan.name}</h3>
                    <p className="text-gray-400">{enterprisePlan.description}</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  {enterprisePlan.features.slice(0, 8).map((feature, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-[#00ff9d] flex-shrink-0 mt-0.5" />
                      <span className="text-gray-300 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="text-center lg:text-right">
                <div className="mb-4">
                  <span className="text-3xl font-bold text-white">{getDisplayPrice(enterprisePlan)}</span>
                  <span className="text-gray-400 text-sm ml-1">/{billingCycle === 'yearly' ? 'año' : 'mes'}</span>
                </div>
                <motion.button
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-xl transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onSelectPlan && onSelectPlan(enterprisePlan)}
                >
                  {enterprisePlan.cta}
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Features Comparison */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <button
            className="text-[#007bff] hover:text-[#00ff9d] transition-colors duration-300 font-semibold"
            onClick={() => setShowEnterprise(!showEnterprise)}
          >
            Ver comparación detallada de características
          </button>
        </motion.div>

        {/* Guarantee */}
        <motion.div
          className="text-center mt-12 p-6 glass-effect rounded-2xl max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <Shield className="w-8 h-8 text-[#00ff9d] mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">Garantía de 14 días</h3>
          <p className="text-gray-400">
            Si no estás satisfecho con Predix, te devolvemos tu dinero sin preguntas.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default PricingPlans;
