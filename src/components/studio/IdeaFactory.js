import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb, Zap, ArrowRight, Heart, Share2, MessageCircle, Copy, RefreshCw } from 'lucide-react';

const IdeaFactory = () => {
  const [topic, setTopic] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [ideas, setIdeas] = useState([]);

  const generateIdeas = () => {
    if (!topic) return;
    setIsGenerating(true);
    
    // Simular generación con IA basada en el PDF de Ideas de Contenido
    setTimeout(() => {
      setIdeas([
        {
          id: 1,
          type: 'Educativo (Guardados)',
          title: `Mito vs Verdad: Lo que nadie te dice sobre ${topic}`,
          format: 'Carrusel de Instagram (5 slides)',
          hook: `El 90% de las personas cree que ${topic} funciona así. Hoy te demuestro por qué están equivocados 🤯`,
          cta: 'Guarda este post para tu próxima estrategia 📌'
        },
        {
          id: 2,
          type: 'Entretenimiento (Shares)',
          title: `POV: Cuando intentas dominar ${topic} por primera vez`,
          format: 'Reel / TikTok con audio en tendencia (Comedia)',
          hook: '(Texto en pantalla) Mi cara cuando me doy cuenta de este truco sobre ${topic}...',
          cta: 'Menciona a ese amig@ que le pasó lo mismo 😂'
        },
        {
          id: 3,
          type: 'Inspiración (Likes)',
          title: `Cómo pasé de 0 a dominar ${topic} en 30 días`,
          format: 'Post con foto personal / Storytelling',
          hook: `Hace 1 año estuve a punto de rendirme con ${topic}. Esto fue lo que lo cambió todo...`,
          cta: '¿Cuál ha sido tu mayor reto? Te leo en los comentarios 👇'
        },
        {
          id: 4,
          type: 'Venta (Conversión)',
          title: `El framework exacto para multiplicar resultados con ${topic}`,
          format: 'Video corto + Link en Bio',
          hook: `¿Cansado de no ver resultados con ${topic}? Descubre el método exacto que usamos para escalar...`,
          cta: 'Haz clic en el link de mi bio para descubrir cómo aplicarlo hoy 🛒'
        },
        {
          id: 5,
          type: 'Autoridad (Retweets/Shares)',
          title: `3 Herramientas poco conocidas que uso diariamente para ${topic}`,
          format: 'Hilo de X (Twitter) / Carrusel LinkedIn',
          hook: `Todos hablan de las mismas herramientas. Aquí tienes mi stack secreto para ${topic} 🤫`,
          cta: 'Comparte esto si te resultó útil ♻️'
        },
        {
          id: 6,
          type: 'Comunidad (Comentarios)',
          title: `Pregunta Abierta: Tu mayor reto con ${topic}`,
          format: 'Encuesta / Texto corto',
          hook: `Seamos honestos: ¿Qué es lo que más te frustra a la hora de aplicar ${topic}?`,
          cta: 'Déjame tu respuesta. Elegiré 3 para ayudarlos gratis por DM 📩'
        }
      ]);
      setIsGenerating(false);
    }, 2000);
  };

  return (
    <div className="p-6 md:p-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-gradient-to-tr from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-orange-500/20">
            <Lightbulb className="w-8 h-8 text-black" />
          </div>
          <h3 className="text-3xl font-bold text-white mb-3">La Fábrica de Ideas</h3>
          <p className="text-gray-400">Introduce un tema, producto o palabra clave y la IA generará una batería de contenido basada en los 4 pilares estratégicos: Educar, Entretener, Inspirar y Vender.</p>
        </div>

        <div className="bg-[#1a1d24] p-2 rounded-2xl border border-white/5 flex items-center shadow-inner mb-10 focus-within:border-cyan-500/50 transition-colors">
          <input 
            type="text" 
            value={topic}
            onChange={e => setTopic(e.target.value)}
            placeholder="Ej: Zapatillas de running, Curso de Finanzas, Café Especialidad..."
            className="flex-1 bg-transparent px-4 py-3 text-white placeholder-gray-500 focus:outline-none"
            onKeyDown={e => e.key === 'Enter' && generateIdeas()}
          />
          <button 
            onClick={generateIdeas}
            disabled={isGenerating || !topic}
            className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold px-6 py-3 rounded-xl flex items-center gap-2 hover:shadow-lg hover:shadow-cyan-500/20 disabled:opacity-50 transition-all"
          >
            {isGenerating ? <RefreshCw className="w-5 h-5 animate-spin" /> : <><Zap className="w-5 h-5" /> Idear</>}
          </button>
        </div>

        <AnimatePresence>
          {ideas.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {ideas.map((idea, i) => (
                <motion.div 
                  key={idea.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-[#1a1d24] rounded-2xl border border-white/5 p-6 hover:border-cyan-500/30 transition-colors relative group"
                >
                  <div className="absolute top-4 right-4 text-xs font-bold px-2 py-1 bg-gray-800 text-cyan-400 rounded-md">
                    {idea.type}
                  </div>
                  
                  <div className="text-sm text-gray-500 mb-2">{idea.format}</div>
                  <h4 className="text-lg font-bold text-white mb-4 pr-16">{idea.title}</h4>
                  
                  <div className="bg-[#111318] p-3 rounded-xl border border-white/5 mb-4 relative">
                    <span className="text-xs text-gray-500 absolute -top-2 left-3 bg-[#111318] px-1">Gancho (Hook)</span>
                    <p className="text-sm text-gray-300 italic">"{idea.hook}"</p>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm font-semibold text-[#00ff9d] mb-6">
                    <ArrowRight className="w-4 h-4" /> {idea.cta}
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t border-white/5">
                    <div className="flex gap-3 text-gray-500">
                      <Heart className="w-4 h-4 hover:text-pink-500 cursor-pointer transition-colors" />
                      <MessageCircle className="w-4 h-4 hover:text-blue-500 cursor-pointer transition-colors" />
                      <Share2 className="w-4 h-4 hover:text-green-500 cursor-pointer transition-colors" />
                    </div>
                    <button className="text-xs text-gray-400 hover:text-white flex items-center gap-1 transition-colors">
                      <Copy className="w-3 h-3" /> Copiar al Portapapeles
                    </button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default IdeaFactory;
