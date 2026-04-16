// 🧪 COMPONENTE DE PRUEBA PARA VERIFICAR PRECIOS
import React from 'react';
import { motion } from 'framer-motion';
import { Check, Crown } from 'lucide-react';

const PricingTest = () => {
  const plans = [
    {
      name: 'Básico',
      price: 12,
      oldPrice: 19,
      features: ['25 predicciones/día', '3 plataformas', 'Dashboard completo']
    },
    {
      name: 'Pro',
      price: 29,
      oldPrice: 49,
      popular: true,
      features: ['Predicciones ilimitadas', '5 plataformas', 'IA generativa']
    },
    {
      name: 'Premium',
      price: 59,
      oldPrice: 99,
      features: ['Todo del Pro +', 'Multi-usuario', 'IA ilimitada']
    },
    {
      name: 'Enterprise',
      price: 149,
      isNew: true,
      features: ['Usuarios ilimitados', 'API enterprise', 'SLA 99.9%']
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0b0c10] via-[#1a1a2e] to-[#16213e] p-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl font-bold text-white mb-4">
            🎉 Nuevos Precios Actualizados
          </h1>
          <p className="text-xl text-gray-400">
            Precios optimizados para máxima competitividad
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              className={`relative bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border ${
                plan.popular ? 'border-[#00ff9d] scale-105' : 'border-gray-700/50'
              }`}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              {/* Badges */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-[#007bff] to-[#00ff9d] text-white px-4 py-1 rounded-full text-sm font-semibold">
                  <Crown className="w-4 h-4 inline mr-1" />
                  Más Popular
                </div>
              )}
              
              {plan.isNew && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                  Nuevo
                </div>
              )}

              {/* Header */}
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-white mb-4">{plan.name}</h3>
                
                {/* Price */}
                <div className="mb-4">
                  {plan.oldPrice && (
                    <div className="text-gray-400 line-through text-sm mb-1">
                      ${plan.oldPrice}/mes
                    </div>
                  )}
                  <div className="text-3xl font-bold text-white">
                    ${plan.price}
                    <span className="text-gray-400 text-sm ml-1">/mes</span>
                  </div>
                  {plan.oldPrice && (
                    <div className="text-green-400 text-sm mt-1">
                      Ahorra ${plan.oldPrice - plan.price}/mes
                    </div>
                  )}
                </div>
              </div>

              {/* Features */}
              <div className="space-y-3 mb-6">
                {plan.features.map((feature, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-[#00ff9d] flex-shrink-0 mt-0.5" />
                    <span className="text-gray-300 text-sm">{feature}</span>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <motion.button
                className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 ${
                  plan.popular
                    ? 'bg-gradient-to-r from-[#007bff] to-[#00ff9d] text-white hover:shadow-xl'
                    : 'border border-gray-600 text-white hover:bg-white/5'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {plan.popular ? 'Elegir Plan' : 'Seleccionar'}
              </motion.button>
            </motion.div>
          ))}
        </div>

        {/* Comparison */}
        <motion.div
          className="mt-12 bg-gray-800/30 rounded-2xl p-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <h3 className="text-2xl font-bold text-white text-center mb-6">
            Comparación de Ahorros
          </h3>
          
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-green-400 mb-2">37%</div>
              <div className="text-white font-semibold">Plan Básico</div>
              <div className="text-gray-400 text-sm">$19 → $12</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-400 mb-2">41%</div>
              <div className="text-white font-semibold">Plan Pro</div>
              <div className="text-gray-400 text-sm">$49 → $29</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-400 mb-2">40%</div>
              <div className="text-white font-semibold">Plan Premium</div>
              <div className="text-gray-400 text-sm">$99 → $59</div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PricingTest;
