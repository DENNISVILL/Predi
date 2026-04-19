import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Store, Wrench, Package, ArrowRight, CheckCircle2, ChevronRight, Download } from 'lucide-react';

const playbooks = [
  {
    id: 'ecommerce',
    title: 'E-commerce & Retail',
    icon: ShoppingBag,
    color: 'from-blue-500 to-cyan-500',
    description: 'Estrategia 30 días para tiendas online. Foco en conversión, abandono de carrito y retargeting.',
    features: ['Embudos de Venta IG/FB', 'Shoppable Posts', 'Catálogo Dinámico']
  },
  {
    id: 'local',
    title: 'Negocios Locales',
    icon: Store,
    color: 'from-orange-500 to-red-500',
    description: 'Domina tu ciudad. Foco en tráfico físico, SEO Local y comunidad geolocalizada.',
    features: ['Estrategia Google Business', 'Geo-tags', 'Alianzas Locales']
  },
  {
    id: 'services',
    title: 'Servicios Profesionales',
    icon: Wrench,
    color: 'from-purple-500 to-pink-500',
    description: 'Generación de leads B2B/B2C. Foco en autoridad, webinars y LinkedIn.',
    features: ['Lead Magnets', 'Social Selling', 'Casos de Éxito']
  },
  {
    id: 'products',
    title: 'Productos por Pedido',
    icon: Package,
    color: 'from-[#00ff9d] to-emerald-500',
    description: 'Estrategia para lanzamientos y preventas. Generación de hype y escasez.',
    features: ['Campañas de Expectativa', 'Gestión de DM', 'Unboxing Viral']
  }
];

const NichePlaybooks = () => {
  const [selectedPlaybook, setSelectedPlaybook] = useState(null);

  return (
    <div className="p-6 md:p-8">
      <div className="mb-8">
        <h3 className="text-2xl font-bold text-white mb-2">Playbooks de Nicho</h3>
        <p className="text-gray-400">Selecciona el plan de acción diseñado por IA específicamente para tu modelo de negocio.</p>
      </div>

      <AnimatePresence mode="wait">
        {!selectedPlaybook ? (
          <motion.div 
            key="grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {playbooks.map(playbook => {
              const Icon = playbook.icon;
              return (
                <motion.div
                  key={playbook.id}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="bg-[#1a1d24] rounded-2xl border border-white/5 p-6 cursor-pointer relative overflow-hidden group"
                  onClick={() => setSelectedPlaybook(playbook)}
                >
                  <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${playbook.color}`} />
                  
                  <div className={`w-12 h-12 rounded-xl mb-4 flex items-center justify-center bg-gradient-to-r ${playbook.color} bg-opacity-10`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  
                  <h4 className="text-lg font-bold text-white mb-2">{playbook.title}</h4>
                  <p className="text-sm text-gray-400 mb-4 h-16">{playbook.description}</p>
                  
                  <div className="space-y-2 mb-6">
                    {playbook.features.map((feat, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-gray-300">
                        <CheckCircle2 className="w-3 h-3 text-[#00ff9d]" /> {feat}
                      </div>
                    ))}
                  </div>

                  <button className="flex items-center gap-2 text-sm font-bold text-white group-hover:text-[#00ff9d] transition-colors mt-auto">
                    Aplicar Playbook <ArrowRight className="w-4 h-4" />
                  </button>
                </motion.div>
              )
            })}
          </motion.div>
        ) : (
          <motion.div
            key="detail"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <button 
              onClick={() => setSelectedPlaybook(null)}
              className="text-gray-400 hover:text-white flex items-center gap-2 mb-6 transition-colors"
            >
              <ArrowRight className="w-4 h-4 rotate-180" /> Volver a Playbooks
            </button>

            <div className="bg-[#1a1d24] border border-white/5 rounded-3xl p-8 relative overflow-hidden">
              <div className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl ${selectedPlaybook.color} opacity-10 rounded-full blur-[80px] pointer-events-none`} />
              
              <div className="flex items-center justify-between mb-8 relative z-10">
                <div className="flex items-center gap-4">
                  <div className={`p-4 rounded-2xl bg-gradient-to-r ${selectedPlaybook.color}`}>
                    <selectedPlaybook.icon className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-white mb-1">{selectedPlaybook.title}</h2>
                    <p className="text-gray-400">Roadmap estratégico a 30 días</p>
                  </div>
                </div>
                
                <button className="flex items-center gap-2 bg-[#111318] border border-white/10 hover:border-white/20 text-white px-4 py-2 rounded-lg transition-colors">
                  <Download className="w-4 h-4" /> Descargar PDF
                </button>
              </div>

              {/* Skeleton de Roadmap */}
              <div className="space-y-4 relative z-10">
                {[
                  { week: 'Semana 1', title: 'Fundación y Auditoría', desc: 'Optimización de perfiles, análisis de competidores locales y setup de tracking.' },
                  { week: 'Semana 2', title: 'Creación de Autoridad', desc: 'Pilares de contenido educativo, casos de éxito y pruebas sociales.' },
                  { week: 'Semana 3', title: 'Captación de Tráfico', desc: 'Lanzamiento de campaña Ads de reconocimiento y colaboraciones.' },
                  { week: 'Semana 4', title: 'Conversión y Retención', desc: 'Embudos de venta directos, retargeting y programas de fidelidad.' }
                ].map((step, i) => (
                  <div key={i} className="flex gap-4 p-4 rounded-xl bg-[#111318] border border-gray-800">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center font-bold text-gray-400">
                      {i + 1}
                    </div>
                    <div>
                      <h4 className="text-white font-bold mb-1"><span className="text-[#00ff9d] mr-2">{step.week}:</span>{step.title}</h4>
                      <p className="text-sm text-gray-400">{step.desc}</p>
                    </div>
                    <button className="ml-auto mt-2 text-gray-500 hover:text-white transition-colors">
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex justify-end">
                <button className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold px-8 py-3 rounded-xl hover:shadow-lg hover:shadow-blue-500/20 transition-all">
                  Activar este Playbook
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NichePlaybooks;
