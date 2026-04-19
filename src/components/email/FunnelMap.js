import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, Users, Eye, MousePointer, ShoppingCart, Heart, TrendingDown } from 'lucide-react';

const etapas = [
  {
    id: 'awareness',
    nombre: 'Consciencia (TOFU)',
    ingles: 'Top of Funnel',
    icon: Eye,
    color: 'from-blue-500 to-sky-500',
    colorText: 'text-blue-400',
    colorBg: 'bg-blue-500/10 border-blue-500/20',
    visitantes: 10000,
    conversionRate: '100%',
    objetivo: 'Atraer tráfico cualificado',
    canales: ['SEO / Blog', 'Redes Sociales Orgánico', 'YouTube', 'TikTok', 'Podcast', 'Google Display'],
    acciones: ['Publicar contenido educativo', 'Crear Reels y videos virales', 'Posicionar keywords informacionales', 'Colaboraciones con influencers'],
    emails: ['Bienvenida al suscriptor', 'Email de valor puro (sin venta)'],
  },
  {
    id: 'interest',
    nombre: 'Interés (MOFU)',
    ingles: 'Middle of Funnel',
    icon: Heart,
    color: 'from-purple-500 to-violet-500',
    colorText: 'text-purple-400',
    colorBg: 'bg-purple-500/10 border-purple-500/20',
    visitantes: 3000,
    conversionRate: '30%',
    objetivo: 'Nutrir y generar confianza',
    canales: ['Email Marketing', 'Webinars', 'Lead Magnets', 'Retargeting', 'WhatsApp'],
    acciones: ['Lead magnet (ebook, checklist, plantilla)', 'Secuencia de bienvenida 5 emails', 'Caso de éxito / testimonio', 'Comparativa producto/servicio'],
    emails: ['Email de caso de éxito', 'Email educativo de nicho', 'Email de preguntas frecuentes'],
  },
  {
    id: 'desire',
    nombre: 'Deseo (BOFU)',
    ingles: 'Bottom of Funnel',
    icon: ShoppingCart,
    color: 'from-orange-500 to-red-500',
    colorText: 'text-orange-400',
    colorBg: 'bg-orange-500/10 border-orange-500/20',
    visitantes: 900,
    conversionRate: '30%',
    objetivo: 'Hacer irresistible la oferta',
    canales: ['Email de ventas', 'Landing Page', 'Retargeting directo', 'Llamada de ventas', 'Urgencia/Escasez'],
    acciones: ['Demostración del producto', 'Oferta con bonus exclusivo', 'Garantía sin riesgo', 'Social proof masivo (reseñas)'],
    emails: ['Email de oferta directa', 'Email de urgencia (24h)', 'Email de última hora (cierre)'],
  },
  {
    id: 'action',
    nombre: 'Acción (Conversión)',
    ingles: 'Conversion',
    icon: MousePointer,
    color: 'from-emerald-500 to-teal-500',
    colorText: 'text-emerald-400',
    colorBg: 'bg-emerald-500/10 border-emerald-500/20',
    visitantes: 150,
    conversionRate: '16.7%',
    objetivo: 'Cerrar la venta',
    canales: ['Checkout optimizado', 'Order bump', 'Upsell post-compra', 'Garantía'],
    acciones: ['Proceso de pago simplificado', 'Email de confirmación inmediato', 'Upsell relevante en el thank you page', 'Activar secuencia de onboarding'],
    emails: ['Email de confirmación de compra', 'Email de bienvenida cliente', 'Onboarding (días 1, 3, 7)'],
  },
  {
    id: 'loyalty',
    nombre: 'Fidelización (Post-Venta)',
    ingles: 'Retention & Advocacy',
    icon: Heart,
    color: 'from-pink-500 to-rose-500',
    colorText: 'text-pink-400',
    colorBg: 'bg-pink-500/10 border-pink-500/20',
    visitantes: 120,
    conversionRate: '80%',
    objetivo: 'Convertir compradores en embajadores',
    canales: ['Email post-venta', 'Programa de referidos', 'Comunidad privada', 'Soporte VIP'],
    acciones: ['Pedir reseña/testimonio (7 días post-compra)', 'Ofrecer programa de referidos', 'Newsletter de valor para clientes', 'Reactivación de clientes inactivos'],
    emails: ['Email de pedido de reseña', 'Email de referido', 'Encuesta de satisfacción NPS'],
  },
];

const FunnelMap = () => {
  const [expandido, setExpandido] = useState('awareness');

  return (
    <div className="p-6 md:p-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h3 className="text-xl font-bold text-white mb-1">Mapa de Embudo de Conversión</h3>
          <p className="text-gray-400 text-sm">Visualiza cada etapa del customer journey con acciones concretas, canales y estrategias de email.</p>
        </div>
        <div className="bg-[#1a1d24] border border-white/5 rounded-xl px-4 py-2 text-center flex-shrink-0">
          <div className="text-sm text-gray-500">Tasa de conversión total</div>
          <div className="text-xl font-black text-emerald-400">1.5%</div>
          <div className="text-xs text-gray-600">10,000 → 150 clientes</div>
        </div>
      </div>

      {/* Embudo visual + detalle */}
      <div className="space-y-3">
        {etapas.map((etapa, i) => {
          const isOpen = expandido === etapa.id;
          const Icon = etapa.icon;
          const ancho = [100, 60, 36, 22, 18][i];
          return (
            <div key={etapa.id} className={`rounded-2xl border overflow-hidden ${etapa.colorBg}`}>
              <button
                onClick={() => setExpandido(isOpen ? null : etapa.id)}
                className="w-full flex items-center gap-4 px-5 py-4 hover:bg-white/[0.02] transition-colors"
              >
                {/* Barra de embudo */}
                <div className="w-24 h-6 bg-gray-800 rounded-full overflow-hidden flex-shrink-0">
                  <div className={`h-full bg-gradient-to-r ${etapa.color} rounded-full`} style={{ width: `${ancho}%` }} />
                </div>
                <div className={`w-8 h-8 rounded-xl bg-gradient-to-r ${etapa.color} flex items-center justify-center flex-shrink-0`}>
                  <Icon className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1 text-left">
                  <div className={`font-bold text-sm ${etapa.colorText}`}>{etapa.nombre}</div>
                  <div className="text-xs text-gray-500">{etapa.ingles} · {etapa.objetivo}</div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-sm font-black text-white">{etapa.visitantes.toLocaleString()}</div>
                  <div className="text-xs text-gray-500">{etapa.conversionRate}</div>
                </div>
                <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
              </button>

              {isOpen && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                  className="px-5 pb-5 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-[#0e1117] rounded-xl p-4">
                    <h5 className={`font-bold text-xs mb-3 ${etapa.colorText} uppercase tracking-wide`}>📡 Canales</h5>
                    <ul className="space-y-1.5">
                      {etapa.canales.map((c, j) => (
                        <li key={j} className="text-xs text-gray-400 flex items-center gap-1.5">
                          <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${etapa.color}`} />
                          {c}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-[#0e1117] rounded-xl p-4">
                    <h5 className={`font-bold text-xs mb-3 ${etapa.colorText} uppercase tracking-wide`}>⚡ Acciones Clave</h5>
                    <ul className="space-y-1.5">
                      {etapa.acciones.map((a, j) => (
                        <li key={j} className="text-xs text-gray-400 flex items-start gap-1.5">
                          <span className="text-emerald-500 mt-0.5">✓</span> {a}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-[#0e1117] rounded-xl p-4">
                    <h5 className={`font-bold text-xs mb-3 ${etapa.colorText} uppercase tracking-wide`}>📧 Emails en esta Etapa</h5>
                    <ul className="space-y-1.5">
                      {etapa.emails.map((e, j) => (
                        <li key={j} className="text-xs text-gray-400 flex items-center gap-1.5">
                          <span>📩</span> {e}
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-5 bg-violet-500/10 border border-violet-500/20 rounded-xl p-4">
        <p className="text-xs text-gray-400 leading-relaxed">
          💡 <strong className="text-violet-300">Regla de oro del embudo:</strong> Optimiza primero la etapa con la mayor pérdida de usuarios. Si pasas de 10,000 a 3,000 en TOFU, mejora tu contenido de captación antes que nada. El paso más "costoso" te indica dónde trabajar primero.
        </p>
      </div>
    </div>
  );
};

export default FunnelMap;
