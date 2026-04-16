// 💰 COMPONENTE DE COMPARACIÓN DE PRECIOS ACTUALIZADO
import React from 'react';
import { motion } from 'framer-motion';
import { Check, X, ArrowRight, TrendingDown, DollarSign } from 'lucide-react';

const PricingComparison = () => {
  const priceChanges = [
    {
      plan: 'Básico',
      oldPrice: 19,
      newPrice: 12,
      savings: 7,
      savingsPercent: 37,
      color: 'from-blue-500 to-blue-600',
      features: [
        '25 predicciones/día (vs 50)',
        '3 plataformas principales',
        'Dashboard completo',
        'Soporte 24h'
      ]
    },
    {
      plan: 'Pro',
      oldPrice: 49,
      newPrice: 29,
      savings: 20,
      savingsPercent: 41,
      color: 'from-purple-500 to-pink-500',
      popular: true,
      features: [
        'Predicciones ilimitadas',
        '5 plataformas',
        'IA generativa (50/mes)',
        'API básica incluida'
      ]
    },
    {
      plan: 'Premium',
      oldPrice: 99,
      newPrice: 59,
      savings: 40,
      savingsPercent: 40,
      color: 'from-yellow-500 to-orange-500',
      features: [
        'Todo del Pro +',
        'Multi-usuario (5)',
        'IA ilimitada',
        'Integraciones premium'
      ]
    },
    {
      plan: 'Enterprise',
      oldPrice: 299,
      newPrice: 149,
      savings: 150,
      savingsPercent: 50,
      color: 'from-indigo-600 to-purple-600',
      isNew: true,
      features: [
        'Usuarios ilimitados',
        'API enterprise',
        'SLA 99.9%',
        'Account manager'
      ]
    }
  ];

  const competitorComparison = [
    {
      feature: 'Predicción con IA',
      predix: true,
      hootsuite: false,
      buffer: false,
      sprout: false
    },
    {
      feature: 'Generador de contenido IA',
      predix: true,
      hootsuite: false,
      buffer: false,
      sprout: false
    },
    {
      feature: 'API incluida',
      predix: true,
      hootsuite: false,
      buffer: false,
      sprout: false
    },
    {
      feature: 'Análisis predictivo',
      predix: true,
      hootsuite: false,
      buffer: false,
      sprout: true
    },
    {
      feature: 'Precio (Plan Pro)',
      predix: '$29',
      hootsuite: '$99',
      buffer: '$15',
      sprout: '$249'
    }
  ];

  return (
    <div className="py-20 px-6 bg-gradient-to-br from-[#0b0c10] via-[#1a1a2e] to-[#16213e]">
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
            🎉 Nuevos Precios Optimizados
          </h2>
          <p className="text-xl text-gray-400 mb-8">
            Hasta 50% más barato que antes, con más funcionalidades
          </p>
          
          <div className="inline-flex items-center gap-2 bg-green-500/20 text-green-400 px-4 py-2 rounded-full">
            <TrendingDown className="w-5 h-5" />
            <span className="font-semibold">Ahorro promedio: 42%</span>
          </div>
        </motion.div>

        {/* Price Changes Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {priceChanges.map((plan, index) => (
            <motion.div
              key={plan.plan}
              className={`relative glass-effect rounded-2xl p-6 ${
                plan.popular ? 'border-2 border-[#00ff9d] scale-105' : ''
              }`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-[#007bff] to-[#00ff9d] text-white px-4 py-1 rounded-full text-sm font-semibold">
                  Más Popular
                </div>
              )}

              {/* New Badge */}
              {plan.isNew && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                  Nuevo Plan
                </div>
              )}

              {/* Plan Header */}
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-white mb-4">{plan.plan}</h3>
                
                {/* Price Comparison */}
                <div className="space-y-2">
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-gray-400 line-through text-lg">${plan.oldPrice}</span>
                    <ArrowRight className="w-4 h-4 text-gray-400" />
                    <span className="text-3xl font-bold text-white">${plan.newPrice}</span>
                  </div>
                  
                  <div className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm">
                    Ahorra ${plan.savings}/mes ({plan.savingsPercent}%)
                  </div>
                </div>
              </div>

              {/* Features */}
              <div className="space-y-3">
                {plan.features.map((feature, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-[#00ff9d] flex-shrink-0 mt-0.5" />
                    <span className="text-gray-300 text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Competitor Comparison */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h3 className="text-3xl font-bold text-white text-center mb-8">
            Comparación con la Competencia
          </h3>
          
          <div className="glass-effect rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left p-4 text-white font-semibold">Funcionalidad</th>
                    <th className="text-center p-4 text-[#00ff9d] font-semibold">
                      Predix
                      <div className="text-xs text-gray-400 font-normal">Nuevo</div>
                    </th>
                    <th className="text-center p-4 text-gray-400 font-semibold">
                      Hootsuite
                      <div className="text-xs text-gray-500 font-normal">$99/mes</div>
                    </th>
                    <th className="text-center p-4 text-gray-400 font-semibold">
                      Buffer
                      <div className="text-xs text-gray-500 font-normal">$15/mes</div>
                    </th>
                    <th className="text-center p-4 text-gray-400 font-semibold">
                      Sprout Social
                      <div className="text-xs text-gray-500 font-normal">$249/mes</div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {competitorComparison.map((row, index) => (
                    <tr key={index} className="border-b border-gray-700/50">
                      <td className="p-4 text-white font-medium">{row.feature}</td>
                      <td className="p-4 text-center">
                        {typeof row.predix === 'boolean' ? (
                          row.predix ? (
                            <Check className="w-5 h-5 text-[#00ff9d] mx-auto" />
                          ) : (
                            <X className="w-5 h-5 text-red-400 mx-auto" />
                          )
                        ) : (
                          <span className="text-[#00ff9d] font-bold">{row.predix}</span>
                        )}
                      </td>
                      <td className="p-4 text-center">
                        {typeof row.hootsuite === 'boolean' ? (
                          row.hootsuite ? (
                            <Check className="w-5 h-5 text-green-400 mx-auto" />
                          ) : (
                            <X className="w-5 h-5 text-red-400 mx-auto" />
                          )
                        ) : (
                          <span className="text-gray-400">{row.hootsuite}</span>
                        )}
                      </td>
                      <td className="p-4 text-center">
                        {typeof row.buffer === 'boolean' ? (
                          row.buffer ? (
                            <Check className="w-5 h-5 text-green-400 mx-auto" />
                          ) : (
                            <X className="w-5 h-5 text-red-400 mx-auto" />
                          )
                        ) : (
                          <span className="text-gray-400">{row.buffer}</span>
                        )}
                      </td>
                      <td className="p-4 text-center">
                        {typeof row.sprout === 'boolean' ? (
                          row.sprout ? (
                            <Check className="w-5 h-5 text-green-400 mx-auto" />
                          ) : (
                            <X className="w-5 h-5 text-red-400 mx-auto" />
                          )
                        ) : (
                          <span className="text-gray-400">{row.sprout}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>

        {/* Value Proposition */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="glass-effect rounded-2xl p-8 max-w-4xl mx-auto">
            <DollarSign className="w-12 h-12 text-[#00ff9d] mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-white mb-4">
              ¿Por qué estos precios?
            </h3>
            <div className="grid md:grid-cols-3 gap-6 text-left">
              <div>
                <h4 className="text-[#00ff9d] font-semibold mb-2">Más Accesible</h4>
                <p className="text-gray-400 text-sm">
                  Precios hasta 50% más bajos para que más empresas puedan acceder a IA avanzada
                </p>
              </div>
              <div>
                <h4 className="text-[#00ff9d] font-semibold mb-2">Más Valor</h4>
                <p className="text-gray-400 text-sm">
                  Funcionalidades únicas como predicción con IA que la competencia no ofrece
                </p>
              </div>
              <div>
                <h4 className="text-[#00ff9d] font-semibold mb-2">Más Rentable</h4>
                <p className="text-gray-400 text-sm">
                  ROI superior con herramientas que realmente predicen tendencias virales
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PricingComparison;
