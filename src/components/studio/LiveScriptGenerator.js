import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Video, Clock, ListChecks, ArrowRight, Download, PlayCircle, Settings, Users } from 'lucide-react';

const LiveScriptGenerator = () => {
  const [topic, setTopic] = useState('');
  const [duration, setDuration] = useState('30'); // min
  const [goal, setGoal] = useState('venta'); // venta, autoridad, qna
  const [isGenerated, setIsGenerated] = useState(false);

  const generateScript = () => {
    if (!topic) return;
    setIsGenerated(true);
  };

  return (
    <div className="p-6 md:p-8 flex flex-col lg:flex-row gap-8">
      {/* Panel de Configuración */}
      <div className="w-full lg:w-1/3 space-y-6">
        <div className="mb-6">
          <h3 className="text-xl font-bold text-white mb-1 flex items-center gap-2"><Video className="w-5 h-5 text-red-500" /> Guionista LIVE</h3>
          <p className="text-gray-400 text-sm">Genera una escaleta profesional paso a paso para retener a tu audiencia en TikTok o Instagram Live.</p>
        </div>

        <div className="bg-[#1a1d24] p-5 rounded-2xl border border-white/5 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Tema Principal del LIVE</label>
            <input 
              type="text" 
              value={topic}
              onChange={e => setTopic(e.target.value)}
              placeholder="Ej: Lanzamiento nueva colección"
              className="w-full bg-[#111318] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-red-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1 flex items-center gap-2">
              <Clock className="w-4 h-4" /> Duración Estimada
            </label>
            <select
              value={duration}
              onChange={e => setDuration(e.target.value)}
              className="w-full bg-[#111318] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-red-500 transition-colors"
            >
              <option value="15">15 Minutos (Flash Live)</option>
              <option value="30">30 Minutos (Estándar)</option>
              <option value="60">1 Hora (Masterclass)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1 flex items-center gap-2">
              <TargetIcon /> Objetivo Principal
            </label>
            <select
              value={goal}
              onChange={e => setGoal(e.target.value)}
              className="w-full bg-[#111318] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-red-500 transition-colors"
            >
              <option value="venta">Venta Directa / Lanzamiento</option>
              <option value="autoridad">Educar / Construir Autoridad</option>
              <option value="qna">Q&A / Conectar con la Comunidad</option>
            </select>
          </div>

          <button 
            onClick={generateScript}
            disabled={!topic}
            className="w-full bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-red-500/20 disabled:opacity-50 transition-all mt-4"
          >
            <PlayCircle className="w-5 h-5" /> Generar Escaleta
          </button>
        </div>

        {/* Checklist Pre-Live */}
        <div className="bg-[#1a1d24] p-5 rounded-2xl border border-white/5 border-l-4 border-l-yellow-500">
          <h4 className="font-bold text-white flex items-center gap-2 mb-4"><ListChecks className="w-5 h-5 text-yellow-500"/> Checklist Pre-Live</h4>
          <ul className="space-y-2 text-sm text-gray-400">
            <li className="flex items-center gap-2"><input type="checkbox" className="accent-yellow-500" /> Batería al 100% y No Molestar</li>
            <li className="flex items-center gap-2"><input type="checkbox" className="accent-yellow-500" /> Limpiar el lente de la cámara</li>
            <li className="flex items-center gap-2"><input type="checkbox" className="accent-yellow-500" /> Iluminación frontal lista</li>
            <li className="flex items-center gap-2"><input type="checkbox" className="accent-yellow-500" /> Notas o Escaleta a la vista</li>
            <li className="flex items-center gap-2"><input type="checkbox" className="accent-yellow-500" /> Agua a la mano</li>
          </ul>
        </div>
      </div>

      {/* Resultados: Escaleta Generada */}
      <div className="flex-1 bg-[#1a1d24] rounded-3xl border border-white/5 p-6 relative overflow-hidden min-h-[500px]">
        {isGenerated ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full flex flex-col">
            <div className="flex justify-between items-start mb-8">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-xs font-bold mb-3">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" /> LISTO PARA TRANSMITIR
                </div>
                <h2 className="text-2xl font-bold text-white mb-1">Guion: {topic}</h2>
                <p className="text-gray-400 text-sm">Duración: {duration} min | Objetivo: {goal}</p>
              </div>
              <button className="bg-[#111318] border border-white/10 hover:border-white/20 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
                <Download className="w-4 h-4" /> Exportar PDF
              </button>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-6">
              {/* Bloque 1: Bienvenida */}
              <div className="relative pl-6 border-l-2 border-red-500">
                <div className="absolute -left-2 top-0 w-4 h-4 bg-[#1a1d24] border-2 border-red-500 rounded-full" />
                <h4 className="text-lg font-bold text-white mb-1">1. El Gancho (Minuto 0-3)</h4>
                <p className="text-red-400 text-sm font-semibold mb-2">Meta: Evitar que hagan swipe.</p>
                <div className="bg-[#111318] p-4 rounded-xl border border-white/5 text-gray-300 text-sm space-y-2">
                  <p><strong>Saluda a los primeros:</strong> "¡Hola a los que van llegando! Escríbanme desde dónde me ven."</p>
                  <p><strong>Da la promesa:</strong> "Quédense hasta el final porque hoy les voy a revelar [secreto sobre {topic}] y habrá una sorpresa exclusiva."</p>
                  <p><strong>Llamado a la acción rápido:</strong> "Toquen dos veces la pantalla para darle amor al live si están listos."</p>
                </div>
              </div>

              {/* Bloque 2: Desarrollo */}
              <div className="relative pl-6 border-l-2 border-blue-500">
                <div className="absolute -left-2 top-0 w-4 h-4 bg-[#1a1d24] border-2 border-blue-500 rounded-full" />
                <h4 className="text-lg font-bold text-white mb-1">2. Desarrollo del Contenido (Minuto 3-20)</h4>
                <p className="text-blue-400 text-sm font-semibold mb-2">Meta: Educar y generar confianza.</p>
                <div className="bg-[#111318] p-4 rounded-xl border border-white/5 text-gray-300 text-sm space-y-3">
                  <p><strong>Historia / Contexto:</strong> "Antes de lanzar esto, nosotros tuvimos un gran problema..." (Conectar emocionalmente).</p>
                  <p><strong>Pilar 1:</strong> Muestra el producto/tema en acción. "Miren cómo funciona esto de cerca..."</p>
                  <p><strong>Pilar 2:</strong> Romper objeciones. "Muchos me preguntan si esto sirve para X, la respuesta es..."</p>
                  <p className="text-yellow-500 italic mt-2">💡 Interacción recomendada: Hacer una pregunta fácil de responder con "Sí" o "No" en el chat.</p>
                </div>
              </div>

              {/* Bloque 3: Cierre y Venta */}
              <div className="relative pl-6 border-l-2 border-[#00ff9d]">
                <div className="absolute -left-2 top-0 w-4 h-4 bg-[#1a1d24] border-2 border-[#00ff9d] rounded-full" />
                <h4 className="text-lg font-bold text-white mb-1">3. Pitch y Q&A (Minuto 20-30)</h4>
                <p className="text-[#00ff9d] text-sm font-semibold mb-2">Meta: Convertir espectadores en clientes.</p>
                <div className="bg-[#111318] p-4 rounded-xl border border-white/5 text-gray-300 text-sm space-y-2">
                  <p><strong>El Pitch:</strong> "Si te gustó lo que viste, acabo de activar un link en mi biografía. Solo por los próximos 30 minutos tendrán un descuento..."</p>
                  <p><strong>Q&A Rápido:</strong> Lee 3 o 4 preguntas reales del chat y respóndelas mencionando el nombre del usuario.</p>
                  <p><strong>Despedida Fuerte:</strong> "Gracias por conectarse, nos vemos en el próximo live. ¡Vayan al link!"</p>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mb-6">
              <Video className="w-10 h-10 text-gray-600" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Tu Escaleta aparecerá aquí</h3>
            <p className="text-gray-500 max-w-sm mx-auto">Completa la configuración en el panel izquierdo y haz clic en "Generar Escaleta" para crear tu guion paso a paso.</p>
          </div>
        )}
      </div>
    </div>
  );
};

const TargetIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
);

export default LiveScriptGenerator;
