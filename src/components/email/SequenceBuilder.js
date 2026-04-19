import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Plus, Trash2, Clock, Zap, ArrowDown, ChevronRight } from 'lucide-react';

const secuenciasPreset = {
  bienvenida: {
    nombre: 'Secuencia de Bienvenida (5 Emails)',
    descripcion: 'Para nuevos suscriptores. Construye confianza antes de vender.',
    color: 'text-blue-400 bg-blue-500/10 border-blue-500/30',
    emails: [
      { dia: 0, asunto: '¡Bienvenido/a! Tu [Lead Magnet] ya está listo 🎁', tipo: 'Bienvenida', objetivo: 'Entregar el recurso prometido y generar buena primera impresión.', body: 'Hola [NOMBRE],\n\nBienvenido/a a [MARCA]. Aquí tienes tu [recurso]: [LINK]\n\nDurante los próximos días te compartiré mis mejores estrategias para [BENEFICIO].\n\n¡Hasta mañana!\n[FIRMA]' },
      { dia: 1, asunto: 'La historia que cambió todo para mí (y puede cambiar la tuya)', tipo: 'Historia / Conexión', objetivo: 'Humanizar la marca. Crear conexión emocional.', body: 'Hola [NOMBRE],\n\nQuiero contarte algo que no le cuento a muchos...\n\n[HISTORIA PERSONAL de 2-3 párrafos conectando con el problema del suscriptor]\n\n¿Te suena familiar?\n\n[FIRMA]' },
      { dia: 3, asunto: 'El error #1 que cometen [AUDIENCIA] (y cómo evitarlo)', tipo: 'Valor Educativo', objetivo: 'Demostrar expertise. Educar sin vender.', body: 'Hola [NOMBRE],\n\nTras años trabajando con [AUDIENCIA], el error que más veo es...\n\n[CONTENIDO EDUCATIVO ÚTIL Y CONCRETO]\n\nEspero que te sirva,\n[FIRMA]' },
      { dia: 5, asunto: 'Lo que [CLIENTE EXITOSO] logró en 30 días (caso real)', tipo: 'Prueba Social', objetivo: 'Mostrar resultados reales. Reducir el miedo al cambio.', body: 'Hola [NOMBRE],\n\nQuiero presentarte a [NOMBRE CLIENTE]...\n\n[HISTORIA DE ÉXITO con antes/después y resultados concretos]\n\n¿Quieres saber cómo lo hizo?\n\n[FIRMA]' },
      { dia: 7, asunto: 'Tengo algo especial para ti (solo esta semana)', tipo: 'Primera Oferta', objetivo: 'Presentar la oferta con descuento de bienvenida.', body: 'Hola [NOMBRE],\n\nLlevamos una semana juntos y quiero celebrarlo de una forma especial...\n\nEstoy abriendo [OFERTA] con un descuento del 20% SOLO para nuevos suscriptores.\n\n👉 [LINK AL CHECKOUT]\n\nEsta oferta expira el [FECHA].\n\n[FIRMA]' },
    ]
  },
  venta: {
    nombre: 'Secuencia de Lanzamiento (7 Emails)',
    descripcion: 'Para vender un producto o servicio con urgencia controlada.',
    color: 'text-red-400 bg-red-500/10 border-red-500/30',
    emails: [
      { dia: 0, asunto: '🚨 Algo importante que anunciar (solo para ti)', tipo: 'Teaser / Anticipación', objetivo: 'Crear expectativa sin revelar el producto.' },
      { dia: 1, asunto: 'Ya está aquí: [NOMBRE DEL PRODUCTO] 🎉', tipo: 'Lanzamiento', objetivo: 'Presentar el producto con todos sus beneficios.' },
      { dia: 2, asunto: 'Preguntas frecuentes sobre [PRODUCTO] (respondo todas)', tipo: 'Romper objeciones', objetivo: 'Eliminar las dudas más comunes.' },
      { dia: 3, asunto: '"Gracias a [PRODUCTO], logré [RESULTADO]" — Historia real', tipo: 'Testimonio / Prueba Social', objetivo: 'Mostrar resultados de clientes reales.' },
      { dia: 4, asunto: '¿Para quién ES y NO ES [PRODUCTO]?', tipo: 'Segmentación / Urgencia', objetivo: 'Filtrar leads. Crear sensación de exclusividad.' },
      { dia: 5, asunto: 'Quedan solo 24 horas ⏰ (se cierra mañana)', tipo: 'Urgencia', objetivo: 'Activar la decisión de compra inminente.' },
      { dia: 6, asunto: 'Última hora: cierra HOY a las 23:59 🔒', tipo: 'Cierre', objetivo: 'Último aviso. CTA directo al checkout.' },
    ]
  },
  reactivacion: {
    nombre: 'Reactivación de Clientes Inactivos',
    descripcion: 'Para suscriptores que no abren emails hace +60 días.',
    color: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30',
    emails: [
      { dia: 0, asunto: '¿Sigues ahí, [NOMBRE]? 👀', tipo: 'Re-engagement', objetivo: 'Captar atención con asunto curioso.' },
      { dia: 3, asunto: 'Esto ha cambiado mucho desde la última vez...', tipo: 'Novedades', objetivo: 'Mostrar que hay cosas nuevas de valor.' },
      { dia: 7, asunto: 'Última oportunidad: ¿quieres seguir en nuestra lista?', tipo: 'Decisión final', objetivo: 'Solicitar confirmación de permanencia o baja.' },
    ]
  },
};

const tiposColor = {
  'Bienvenida': 'text-blue-400 bg-blue-500/10',
  'Historia / Conexión': 'text-purple-400 bg-purple-500/10',
  'Valor Educativo': 'text-emerald-400 bg-emerald-500/10',
  'Prueba Social': 'text-yellow-400 bg-yellow-500/10',
  'Primera Oferta': 'text-red-400 bg-red-500/10',
  'Teaser / Anticipación': 'text-indigo-400 bg-indigo-500/10',
  'Lanzamiento': 'text-orange-400 bg-orange-500/10',
  'Romper objeciones': 'text-cyan-400 bg-cyan-500/10',
  'Testimonio / Prueba Social': 'text-yellow-400 bg-yellow-500/10',
  'Segmentación / Urgencia': 'text-pink-400 bg-pink-500/10',
  'Urgencia': 'text-red-400 bg-red-500/10',
  'Cierre': 'text-rose-400 bg-rose-500/10',
  'Re-engagement': 'text-violet-400 bg-violet-500/10',
  'Novedades': 'text-teal-400 bg-teal-500/10',
  'Decisión final': 'text-orange-400 bg-orange-500/10',
};

const SequenceBuilder = () => {
  const [secuenciaActiva, setSecuenciaActiva] = useState('bienvenida');
  const [emailExpandido, setEmailExpandido] = useState(0);

  const sec = secuenciasPreset[secuenciaActiva];

  return (
    <div className="p-6 md:p-8">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-white mb-1">Secuencias de Email Automatizadas</h3>
        <p className="text-gray-400 text-sm">Plantillas de secuencias completas y probadas. Selecciona, personaliza y activa.</p>
      </div>

      {/* Selector de secuencia */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
        {Object.entries(secuenciasPreset).map(([key, s]) => (
          <button key={key} onClick={() => { setSecuenciaActiva(key); setEmailExpandido(0); }}
            className={`text-left p-4 rounded-xl border transition-all ${
              secuenciaActiva === key ? s.color : 'bg-[#1a1d24] border-white/5 text-gray-400 hover:text-white'
            }`}>
            <div className="font-bold text-sm mb-1">{s.nombre}</div>
            <div className="text-xs opacity-70">{s.descripcion}</div>
          </button>
        ))}
      </div>

      {/* Timeline de emails */}
      <div className="bg-[#1a1d24] rounded-2xl border border-white/5 p-5">
        <div className="flex items-center justify-between mb-5">
          <h4 className="font-bold text-white flex items-center gap-2">
            <Zap className="w-4 h-4 text-violet-400" /> {sec.nombre}
          </h4>
          <span className="text-xs text-gray-500">{sec.emails.length} emails</span>
        </div>

        <div className="space-y-2">
          {sec.emails.map((email, i) => (
            <div key={i}>
              <motion.div
                className={`rounded-xl border overflow-hidden ${emailExpandido === i ? 'border-violet-500/30 bg-violet-500/5' : 'border-white/5 bg-[#111318]'}`}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <button
                  onClick={() => setEmailExpandido(emailExpandido === i ? null : i)}
                  className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-white/[0.02] transition-colors text-left"
                >
                  <div className="w-9 h-9 bg-[#0e1117] rounded-xl flex items-center justify-center text-xs font-black text-gray-400 flex-shrink-0">
                    D{email.dia}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-white font-medium text-sm truncate">{email.asunto}</div>
                    <div className={`text-xs mt-0.5 inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md ${tiposColor[email.tipo] || 'text-gray-400 bg-gray-500/10'}`}>
                      {email.tipo}
                    </div>
                  </div>
                  <Clock className="w-3.5 h-3.5 text-gray-600 flex-shrink-0" />
                  <ChevronRight className={`w-4 h-4 text-gray-600 flex-shrink-0 transition-transform ${emailExpandido === i ? 'rotate-90' : ''}`} />
                </button>

                {emailExpandido === i && email.body && (
                  <div className="px-4 pb-4 space-y-3">
                    <div className="bg-[#0e1117] rounded-xl p-3">
                      <div className="text-xs text-gray-500 mb-1">🎯 Objetivo:</div>
                      <p className="text-xs text-gray-300">{email.objetivo}</p>
                    </div>
                    <div className="bg-[#0e1117] rounded-xl p-3">
                      <div className="text-xs text-gray-500 mb-2">✍️ Plantilla del email:</div>
                      <pre className="text-xs text-gray-300 whitespace-pre-wrap leading-relaxed font-sans">{email.body}</pre>
                    </div>
                  </div>
                )}
                {emailExpandido === i && !email.body && (
                  <div className="px-4 pb-4">
                    <div className="bg-[#0e1117] rounded-xl p-3">
                      <div className="text-xs text-gray-500 mb-1">🎯 Objetivo:</div>
                      <p className="text-xs text-gray-300">{email.objetivo}</p>
                    </div>
                  </div>
                )}
              </motion.div>
              {i < sec.emails.length - 1 && (
                <div className="flex justify-center py-1">
                  <ArrowDown className="w-3 h-3 text-gray-700" />
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-5 flex gap-3">
          <button className="flex-1 bg-violet-500/15 border border-violet-500/40 text-violet-300 font-bold py-2.5 rounded-xl text-sm hover:bg-violet-500/25 transition-colors">
            📋 Copiar secuencia completa
          </button>
          <button className="flex-1 bg-gradient-to-r from-violet-500 to-purple-500 text-white font-bold py-2.5 rounded-xl text-sm hover:shadow-lg hover:shadow-violet-500/20 transition-all">
            ⚡ Activar secuencia
          </button>
        </div>
      </div>
    </div>
  );
};

export default SequenceBuilder;
