import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquare, ChevronRight, CheckCircle, Copy, Download,
  Sparkles, Plus, Trash2, ArrowDown, Clock
} from 'lucide-react';

const SEQUENCES = {
  prospecto_frio: {
    label: 'Prospecto Frío (sin contexto previo)',
    messages: [
      {
        moment: 'Mensaje 1 — Conexión inicial',
        delay: 'Enviar inmediatamente',
        template: (data) => `¡Hola ${data.nombreContacto || '[Nombre]'}! 👋

Vi tu trabajo en ${data.plataforma || 'Instagram'} y me pareció increíble lo que estás haciendo con ${data.nicho || 'tu negocio'}.

Te escribo porque trabajo con ${data.tipoBusiness || 'negocios locales'} ayudándoles a [transformación específica].

¿Tienes 5 minutos esta semana para conversar?`
      },
      {
        moment: 'Mensaje 2 — Seguimiento con valor',
        delay: '48 horas después (si no responde)',
        template: (data) => `Hola ${data.nombreContacto || '[Nombre]'}, sé que estás ocupado/a.

Te dejo algo que puede servirte 👇

[Comparte un tip útil relacionado con su industria: ${data.nicho || 'su sector'}]

Sin compromiso. Solo quería aportar valor antes de hablar de trabajo. 😊`
      },
      {
        moment: 'Mensaje 3 — Cierre directo',
        delay: '4 días después (si sigue sin responder)',
        template: (data) => `${data.nombreContacto || '[Nombre]'}, este es mi último mensaje.

Entiendo que quizás no es el momento, y está perfectamente bien.

Si en algún momento quieres escalar ${data.nicho || 'tu negocio'} con estrategias que han funcionado para negocios como el tuyo, aquí estaré.

¡Mucho éxito! 🚀`
      }
    ]
  },
  lead_interesado: {
    label: 'Lead que mostró interés (DM o comentario)',
    messages: [
      {
        moment: 'Mensaje 1 — Respuesta inmediata',
        delay: 'Dentro de los primeros 15 minutos',
        template: (data) => `¡Hola ${data.nombreContacto || '[Nombre]'}! 🙌

Qué bueno que te interesó. Cuéntame un poco más: ¿a qué se dedica tu negocio de ${data.nicho || '[nicho]'} actualmente?

Quiero entender bien tu situación antes de recomendarte algo, porque no aplico la misma estrategia a todos. 🎯`
      },
      {
        moment: 'Mensaje 2 — Presentación de solución',
        delay: 'Después de escuchar su respuesta',
        template: (data) => `Perfecto, gracias por contarme. 

Basándome en lo que me dices, lo que más te puede ayudar es [servicio específico de ${data.servicio || '[tu servicio]'}].

Con esto hemos logrado que negocios como el tuyo pasen de [resultado A] a [resultado B] en [tiempo].

¿Quieres que te muestre cómo funcionaría exactamente para ${data.tipoBusiness || 'tu negocio'}?`
      },
      {
        moment: 'Mensaje 3 — Manejo de objeciones (precio)',
        delay: 'Si pregunta por el precio primero',
        template: (data) => `Entiendo que el precio es importante.

Antes de darte un número, déjame preguntarte: si logramos [resultado principal], ¿cuánto vale eso para tu negocio mensualmente?

La inversión en ${data.servicio || 'el servicio'} es de [tu tarifa]. Pero el valor que genera es 3-5x mayor.

¿Seguimos conversando?`
      },
      {
        moment: 'Mensaje 4 — Cierre con urgencia',
        delay: '24-48 horas después de cotizar',
        template: (data) => `${data.nombreContacto || '[Nombre]'}, solo para que sepas: estoy abriendo 2 espacios más este mes para nuevos clientes.

Si decidiste avanzar, podemos empezar el lunes. Si necesitas más tiempo, también está bien — solo quiero que tengas toda la info.

¿Qué decidiste? 😊`
      }
    ]
  },
  reactivacion: {
    label: 'Reactivación de cliente inactivo',
    messages: [
      {
        moment: 'Mensaje 1 — Reenganche emocional',
        delay: 'Primer contacto de reactivación',
        template: (data) => `¡Hola ${data.nombreContacto || '[Nombre]'}! ¿Cómo has estado?

Han pasado ${data.tiempoInactivo || 'varios meses'} desde que trabajamos juntos y siempre pensé en cómo te fue con lo que implementamos.

¿Lograste los resultados que buscabas? 🙏`
      },
      {
        moment: 'Mensaje 2 — Nueva propuesta de valor',
        delay: '2-3 días después',
        template: (data) => `Por cierto, desde que trabajamos juntos hemos lanzado algo nuevo que creo te puede servir mucho:

[Nuevo servicio o mejora]: [Beneficio principal]

Ya lo tienen implementado ${data.tipoBusiness || 'varios negocios similares'} con muy buenos resultados.

¿Te cuento más detalles?`
      }
    ]
  }
};

const PERSUASION_PRINCIPLES = [
  { id: 'reciprocidad', label: '🎁 Reciprocidad', desc: 'Da primero: un consejo, un recurso gratuito, una auditoría. Quien recibe se siente obligado a devolver.', tip: 'Envía un análisis rápido de su perfil ANTES de hablar de precios.' },
  { id: 'escasez', label: '⏳ Escasez', desc: 'Lo que es limitado se percibe como más valioso. Cupos, tiempos, ediciones especiales.', tip: '"Solo tengo 2 espacios disponibles este mes" — sé honesto, no falso.' },
  { id: 'autoridad', label: '🏆 Autoridad', desc: 'La gente sigue a quienes perciben como expertos. Comparte casos de éxito y credenciales.', tip: 'Incluye un resultado específico antes de presentar tu servicio.' },
  { id: 'social', label: '👥 Prueba Social', desc: 'Si otros lo hacen, debe ser correcto. Testimonios, números, nombres de clientes.', tip: '"Más de 12 restaurantes en tu ciudad usan esta estrategia."' },
  { id: 'simpatia', label: '❤️ Simpatía', desc: 'Compramos a quienes nos caen bien y se parecen a nosotros. Construye rapport primero.', tip: 'Menciona algo específico de su contenido antes de hacer tu pitch.' },
  { id: 'compromiso', label: '🤝 Compromiso', desc: 'Si alguien dijo sí a algo pequeño, es más probable que diga sí a algo grande.', tip: 'Empieza con "¿Te puedo hacer una pregunta rápida?" antes de tu propuesta.' },
];

export default function WhatsAppFunnel() {
  const [activeSequence, setActiveSequence] = useState('prospecto_frio');
  const [showPrinciples, setShowPrinciples] = useState(false);
  const [data, setData] = useState({
    nombreContacto: '', plataforma: 'Instagram', nicho: '', tipoBusiness: '', servicio: '', tiempoInactivo: '3 meses'
  });
  const [copiedIdx, setCopiedIdx] = useState(null);

  const set = (k, v) => setData(d => ({ ...d, [k]: v }));
  const seq = SEQUENCES[activeSequence];

  const handleCopy = (idx, text) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedIdx(idx); setTimeout(() => setCopiedIdx(null), 2000);
    });
  };

  const handleDownloadAll = () => {
    const all = seq.messages.map((m, i) =>
      `════ ${m.moment} ════\n🕐 ${m.delay}\n\n${m.template(data)}`
    ).join('\n\n' + '─'.repeat(50) + '\n\n');
    const blob = new Blob([`SECUENCIA WHATSAPP — ${seq.label}\nGenerado con Predix\n\n${all}`], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `secuencia-whatsapp-${activeSequence}.txt`; a.click();
    URL.revokeObjectURL(url);
  };

  const inputCls = "w-full bg-[#0b0c10] border border-white/10 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-green-500/50 placeholder-gray-700 transition-colors";

  return (
    <div className="p-6 flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-green-400" /> Generador de Secuencias WhatsApp
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">Guiones de venta personalizados basados en principios de persuasión científica</p>
        </div>
        <button onClick={() => setShowPrinciples(!showPrinciples)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 text-amber-400 rounded-lg text-xs font-semibold transition-all">
          <Sparkles className="w-3.5 h-3.5" /> 6 Principios
        </button>
      </div>

      {/* Persuasion Principles */}
      <AnimatePresence>
        {showPrinciples && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-2">
              {PERSUASION_PRINCIPLES.map(p => (
                <div key={p.id} className="bg-[#111318] border border-amber-500/15 rounded-xl p-4 flex flex-col gap-2">
                  <span className="text-sm font-bold text-white">{p.label}</span>
                  <p className="text-xs text-gray-400">{p.desc}</p>
                  <div className="flex items-start gap-1.5 bg-amber-500/5 rounded-lg p-2 border border-amber-500/15">
                    <Sparkles className="w-3 h-3 text-amber-400 mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-amber-300 italic">{p.tip}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sequence Selector */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        {Object.entries(SEQUENCES).map(([key, s]) => (
          <button key={key} onClick={() => setActiveSequence(key)}
            className={`px-4 py-3 rounded-xl border text-left text-sm font-semibold transition-all ${activeSequence === key ? 'bg-green-500/15 border-green-500/40 text-white' : 'bg-[#111318] border-white/8 text-gray-500 hover:text-white hover:border-white/15'}`}>
            {s.label}
          </button>
        ))}
      </div>

      {/* Personalization */}
      <div className="bg-[#111318] border border-white/8 rounded-xl p-4 flex flex-col gap-3">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Personaliza los mensajes</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <input value={data.nombreContacto} onChange={e => set('nombreContacto', e.target.value)} placeholder="Nombre del contacto" className={inputCls} />
          <input value={data.nicho} onChange={e => set('nicho', e.target.value)} placeholder="Nicho/industria (ej: Fitness)" className={inputCls} />
          <input value={data.tipoBusiness} onChange={e => set('tipoBusiness', e.target.value)} placeholder="Tipo de negocio" className={inputCls} />
          <input value={data.servicio} onChange={e => set('servicio', e.target.value)} placeholder="Tu servicio (ej: Gestión IG)" className={inputCls} />
          <input value={data.plataforma} onChange={e => set('plataforma', e.target.value)} placeholder="Plataforma (Instagram...)" className={inputCls} />
          {activeSequence === 'reactivacion' && (
            <input value={data.tiempoInactivo} onChange={e => set('tiempoInactivo', e.target.value)} placeholder="Tiempo inactivo (ej: 3 meses)" className={inputCls} />
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">{seq.messages.length} Mensajes de la Secuencia</h4>
          <button onClick={handleDownloadAll} className="flex items-center gap-1.5 px-3 py-1.5 bg-green-500/15 hover:bg-green-500/25 border border-green-500/30 text-green-300 rounded-lg text-xs font-semibold transition-all">
            <Download className="w-3.5 h-3.5" /> Descargar secuencia
          </button>
        </div>
        {seq.messages.map((msg, i) => {
          const text = msg.template(data);
          return (
            <div key={i} className="bg-[#0e1117] border border-white/5 rounded-xl overflow-hidden">
              <div className="flex items-center justify-between px-5 py-3 border-b border-white/5 bg-[#111318]">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-green-500/20 text-green-400 text-xs font-black flex items-center justify-center flex-shrink-0">{i + 1}</span>
                  <div>
                    <p className="text-xs font-bold text-white">{msg.moment}</p>
                    <p className="text-[10px] text-gray-500 flex items-center gap-1"><Clock className="w-3 h-3" />{msg.delay}</p>
                  </div>
                </div>
                <button onClick={() => handleCopy(i, text)} className="flex items-center gap-1.5 px-2.5 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-400 rounded-lg text-xs font-semibold transition-all">
                  {copiedIdx === i ? <><CheckCircle className="w-3 h-3 text-green-400" />Copiado</> : <><Copy className="w-3 h-3" />Copiar</>}
                </button>
              </div>
              <pre className="p-5 text-xs text-gray-300 leading-relaxed whitespace-pre-wrap font-sans">{text}</pre>
            </div>
          );
        })}
      </div>
    </div>
  );
}
