import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb, RefreshCw, Clock, Sparkles, Copy, CheckCircle, ChevronRight } from 'lucide-react';

const EXERCISES = [
  {
    id: 'inspiracion_cruzada',
    title: '🔀 Inspiración Cruzada',
    category: 'Pensamiento Lateral',
    duration: '10 min',
    difficulty: 'Fácil',
    description: 'Contacta a 2 personas que te inspiren y pregúntales: ¿Qué les inspira a ellos? ¿Cómo usan esa inspiración? Las mejores ideas vienen de inspiraciones de segunda generación.',
    prompt: 'Elige 2 creadores de contenido que admires en nichos MUY distintos al tuyo. Ahora imagina: ¿qué pasaría si combinaras su estilo visual con tu temática? Describe 3 posts concretos que surgirían de esa fusión.',
    examples: ['Fitness + Arte abstracto = Videos de rutinas con fondos de pintura en vivo', 'Gastronomía + Tecnología = Recetas presentadas como código de programación', 'Educación + K-pop = Conceptos explicados con coreografías de baile'],
  },
  {
    id: 'enemigo_creativo',
    title: '😈 El Enemigo Creativo',
    category: 'Pensamiento Paradójico',
    duration: '8 min',
    difficulty: 'Medio',
    description: 'En lugar de preguntarte "¿qué debo publicar?", pregunta: "¿Qué publicaría alguien que quiere destruir mi marca?" Luego hazlo al revés.',
    prompt: 'Imagina que eres el peor enemigo de tu marca. ¿Qué 5 cosas harías para arruinar tu reputación online? Ahora invierte cada una: esas son las acciones que deberías tomar para fortalecer tu presencia.',
    examples: ['Enemigo: "Publicaría de forma inconsistente" → Tú: Calendarios de publicación visibles y rutinas de contenido', 'Enemigo: "Ignoraría los comentarios" → Tú: Protocolo de respuesta en menos de 2 horas', 'Enemigo: "Copiaría tendencias sin criterio" → Tú: Sello único para adaptarlas a tu voz'],
  },
  {
    id: 'restricciones_creativas',
    title: '🔒 Restricciones Creativas',
    category: 'Creatividad Forzada',
    duration: '15 min',
    difficulty: 'Medio',
    description: 'Las restricciones generan creatividad. Twitter nació de un límite de caracteres. Instagram nació del formato cuadrado. ¿Qué creas tú cuando te quitas opciones?',
    prompt: 'Crea 3 posts con estas restricciones absurdas: (1) Sin usar adjetivos. (2) En exactamente 7 palabras. (3) Usando solo emojis y números. Luego elige el mejor y publícalo.',
    examples: ['Sin adjetivos: "Los lunes exigen café. Los viernes lo merecen." ☕', 'En 7 palabras: "Fallé. Aprendí. Mejoré. Volví. Te lo cuento."', 'Solo emojis: "📱→💡→✍️→🚀→💰"'],
  },
  {
    id: 'robo_honesto',
    title: '🎨 Roba Como un Artista',
    category: 'Curación Creativa',
    duration: '20 min',
    difficulty: 'Fácil',
    description: 'Austin Kleon dice: "Los buenos artistas copian, los grandes artistas roban." Pero "robar" significa reinterpretar, no plagiar. Toma el formato de alguien y llénalo con tu voz.',
    prompt: 'Encuentra un post viral de una industria DIFERENTE a la tuya (puede ser cocina, arquitectura, humor). Ahora recrea el mismo formato, la misma estructura narrativa, pero con tu temática. Documenta el proceso.',
    examples: ['Un tutorial de receta → Tutorial de cómo construir una estrategia de contenido paso a paso', 'Un "día en la vida" de un atleta → "Día en la vida de un post viral" (de idea a publicación)', 'Una lista de herramientas de productividad → Lista de herramientas de un Community Manager'],
  },
  {
    id: 'pregunta_estupida',
    title: '🤔 La Pregunta Estúpida',
    category: 'Innovación Radical',
    duration: '5 min',
    difficulty: 'Difícil',
    description: 'Las preguntas que parecen estúpidas son las que cambian industrias. "¿Por qué los autos no vuelan?" → Tesla autopilot. "¿Por qué no puedo pedir comida desde el celular?" → Uber Eats.',
    prompt: 'Haz 5 preguntas "estúpidas" sobre tu industria. Las más absurdas, mejor. Luego elige una y desarrolla una respuesta seria: ¿Qué necesitaría existir para que eso fuera posible? Ese es tu próximo contenido disruptivo.',
    examples: ['Marketing: "¿Y si publicáramos solo los fracasos?" → Serie de contenido "Lo que NO funcionó"', 'Fitness: "¿Y si el ejercicio fuera malo para ti?" → Contenido sobre recuperación y descanso activo', 'Educación: "¿Y si enseñáramos al revés?" → Contenido que empieza por el resultado final'],
  },
  {
    id: 'cambia_el_medio',
    title: '📡 Cambia el Medio',
    category: 'Transmediación',
    duration: '12 min',
    difficulty: 'Medio',
    description: 'El mismo mensaje en distintos formatos conecta con distintas personas. Un consejo en texto se convierte en tip de video, luego en infografía, luego en hilo, luego en podcast.',
    prompt: 'Toma tu último post exitoso. Ahora reimagínalo en 5 formatos completamente distintos: texto largo (blog), reel de 15s, carrusel de 6 slides, historia con encuesta, y audio de 2 minutos. ¿Cuál crees que rendirá mejor y por qué?',
    examples: ['Un consejo de productividad → Reel de timelapso de una jornada laboral', 'Una estadística de marketing → Carrusel con infografía animada + CTA', 'Una historia de cliente → Podcast entrevista de 10 minutos'],
  },
];

const DIFFICULTY_COLORS = {
  'Fácil': 'bg-green-500/15 text-green-400 border-green-500/25',
  'Medio': 'bg-amber-500/15 text-amber-400 border-amber-500/25',
  'Difícil': 'bg-red-500/15 text-red-400 border-red-500/25',
};

const CATEGORIES = ['Todos', 'Pensamiento Lateral', 'Pensamiento Paradójico', 'Creatividad Forzada', 'Curación Creativa', 'Innovación Radical', 'Transmediación'];

export default function EmergentThinking() {
  const [activeExercise, setActiveExercise] = useState(null);
  const [filterCat, setFilterCat] = useState('Todos');
  const [userResponse, setUserResponse] = useState('');
  const [copied, setCopied] = useState(false);
  const [completed, setCompleted] = useState([]);

  const filtered = filterCat === 'Todos' ? EXERCISES : EXERCISES.filter(e => e.category === filterCat);

  const handleRandom = () => {
    const rand = EXERCISES[Math.floor(Math.random() * EXERCISES.length)];
    setActiveExercise(rand);
    setUserResponse('');
  };

  const handleCopyPrompt = (text) => {
    navigator.clipboard.writeText(text).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
  };

  const handleComplete = (id) => {
    setCompleted(prev => prev.includes(id) ? prev : [...prev, id]);
    setActiveExercise(null);
    setUserResponse('');
  };

  return (
    <div className="p-6 flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-amber-400" /> Gimnasio Creativo
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">Ejercicios de pensamiento emergente para desbloquear el síndrome de página en blanco</p>
        </div>
        <div className="flex gap-2 items-center">
          <span className="text-xs font-semibold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full">
            {completed.length}/{EXERCISES.length} completados
          </span>
          <motion.button whileHover={{ rotate: 180 }} transition={{ duration: 0.3 }} onClick={handleRandom}
            className="flex items-center gap-1.5 px-4 py-2 bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 rounded-xl text-sm font-bold transition-all">
            <RefreshCw className="w-4 h-4" /> Ejercicio aleatorio
          </motion.button>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {CATEGORIES.map(cat => (
          <button key={cat} onClick={() => setFilterCat(cat)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border whitespace-nowrap transition-all ${filterCat === cat ? 'bg-amber-500/15 border-amber-500/40 text-amber-300' : 'bg-[#111318] border-white/8 text-gray-500 hover:text-white'}`}>
            {cat}
          </button>
        ))}
      </div>

      {/* Exercise Grid */}
      {!activeExercise && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filtered.map(ex => {
            const done = completed.includes(ex.id);
            return (
              <motion.button key={ex.id} layout whileHover={{ y: -2 }} onClick={() => { setActiveExercise(ex); setUserResponse(''); }}
                className={`text-left p-5 rounded-2xl border transition-all flex flex-col gap-3 ${done ? 'bg-green-500/5 border-green-500/20' : 'bg-[#111318] border-white/8 hover:border-white/15 hover:bg-[#1a1d24]'}`}>
                <div className="flex items-start justify-between gap-2">
                  <h4 className="font-bold text-white text-sm">{ex.title}</h4>
                  {done && <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />}
                </div>
                <p className="text-xs text-gray-500 leading-relaxed">{ex.description}</p>
                <div className="flex items-center gap-2 flex-wrap mt-auto pt-2 border-t border-white/5">
                  <span className="text-xs text-gray-600 flex items-center gap-1"><Clock className="w-3 h-3" />{ex.duration}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${DIFFICULTY_COLORS[ex.difficulty]}`}>{ex.difficulty}</span>
                  <span className="text-[10px] text-gray-600 bg-white/5 rounded px-2 py-0.5">{ex.category}</span>
                </div>
              </motion.button>
            );
          })}
        </div>
      )}

      {/* Active Exercise Detail */}
      <AnimatePresence>
        {activeExercise && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
            className="flex flex-col gap-5">
            <button onClick={() => setActiveExercise(null)} className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-white transition-colors">
              ← Volver a ejercicios
            </button>

            {/* Exercise Card */}
            <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/5 border border-amber-500/20 rounded-2xl p-6 flex flex-col gap-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-lg font-black text-white">{activeExercise.title}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-gray-500 flex items-center gap-1"><Clock className="w-3 h-3" />{activeExercise.duration}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${DIFFICULTY_COLORS[activeExercise.difficulty]}`}>{activeExercise.difficulty}</span>
                  </div>
                </div>
                <Lightbulb className="w-8 h-8 text-amber-400 flex-shrink-0" />
              </div>
              <p className="text-sm text-gray-300 leading-relaxed">{activeExercise.description}</p>
            </div>

            {/* Prompt */}
            <div className="bg-[#111318] border border-white/8 rounded-2xl p-5 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" /> Tu Ejercicio
                </h4>
                <button onClick={() => handleCopyPrompt(activeExercise.prompt)}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-400 rounded-lg text-xs font-semibold transition-all">
                  {copied ? <><CheckCircle className="w-3 h-3 text-green-400" />Copiado</> : <><Copy className="w-3 h-3" />Copiar</>}
                </button>
              </div>
              <p className="text-sm text-white leading-relaxed">{activeExercise.prompt}</p>
            </div>

            {/* Examples */}
            <div className="flex flex-col gap-2">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Ejemplos de Inspiración</h4>
              {activeExercise.examples.map((ex, i) => (
                <div key={i} className="flex items-start gap-2 bg-[#0e1117] border border-white/5 rounded-xl px-4 py-3">
                  <ChevronRight className="w-3.5 h-3.5 text-amber-400 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-gray-400 leading-relaxed">{ex}</p>
                </div>
              ))}
            </div>

            {/* Response Area */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Tu Respuesta / Ideas</label>
              <textarea rows={6} value={userResponse} onChange={e => setUserResponse(e.target.value)}
                placeholder="Escribe aquí tus ideas mientras haces el ejercicio... (esto no se guarda en el servidor, es solo para ti)"
                className="w-full bg-[#111318] border border-white/8 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-amber-500/50 placeholder-gray-700 resize-none transition-colors leading-relaxed" />
            </div>

            {/* Mark as done */}
            <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
              onClick={() => handleComplete(activeExercise.id)}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 text-white font-bold text-sm hover:from-amber-500/30 hover:to-orange-500/30 transition-all flex items-center justify-center gap-2">
              <CheckCircle className="w-5 h-5 text-amber-400" /> Marcar como completado
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
