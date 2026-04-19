import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Copy, CheckCircle2, Bookmark, Flame } from 'lucide-react';

const ContentExamples = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('Todos');
  const [copiedId, setCopiedId] = useState(null);

  // Muestra de los 125 ejemplos
  const ejemplos = [
    { id: 1, type: 'Educar', title: 'Mito vs Verdad', hook: 'El 90% de las empresas se equivocan en [Problema]. Aquí la verdad:', format: 'Carrusel / Hilo', niche: 'B2B / Servicios' },
    { id: 2, type: 'Entretener', title: 'POV Cómico', hook: 'POV: Cuando el cliente pide "algo rápido" y terminas trabajando 14 horas.', format: 'Reel / TikTok', niche: 'Agencias / Freelancers' },
    { id: 3, type: 'Vender', title: 'El Framework Exacto', hook: 'Usé este sistema exacto de 3 pasos para conseguir [Resultado] en 30 días.', format: 'Video Largo / Post', niche: 'Infoproductos / Coaching' },
    { id: 4, type: 'Inspirar', title: 'Historia de Origen', hook: 'Hace 3 años estaba quebrado. Hoy dirijo una empresa de $1M. Este fue el punto de quiebre:', format: 'Post LinkedIn', niche: 'Marca Personal' },
    { id: 5, type: 'Educar', title: 'Errores Comunes', hook: '3 Errores que estás cometiendo en tu [Área] y cómo arreglarlos hoy mismo.', format: 'Carrusel', niche: 'Cualquiera' },
    { id: 6, type: 'Vender', title: 'Manejo de Objeciones', hook: '"Es muy caro". Lo que realmente significa cuando te dicen eso (y cómo responder).', format: 'Reel / TikTok', niche: 'Ventas / B2B' },
    { id: 7, type: 'Educar', title: 'El "Detrás de Cámaras"', hook: 'Así es exactamente como estructuramos el lanzamiento de [Producto] (Números reales).', format: 'Carrusel', niche: 'Emprendedores' },
    { id: 8, type: 'Entretener', title: 'Expectativa vs Realidad', hook: 'Expectativa: Trabajar desde la playa. Realidad: [Muestra el estrés real].', format: 'Reel', niche: 'Nómadas / Freelance' },
  ];

  const handleCopy = (hook, id) => {
    navigator.clipboard.writeText(hook);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filtered = ejemplos.filter(e => 
    (filterType === 'Todos' || e.type === filterType) &&
    (e.title.toLowerCase().includes(searchTerm.toLowerCase()) || e.hook.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="p-6 md:p-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h3 className="text-xl font-bold text-white mb-1 flex items-center gap-2">
            <Flame className="w-5 h-5 text-orange-500" /> Bóveda de Contenido (125+ Hooks)
          </h3>
          <p className="text-gray-400 text-sm">Ejemplos probados de alta conversión. Copia, pega y adapta a tu nicho.</p>
        </div>
        <div className="flex gap-2">
          {['Todos', 'Educar', 'Vender', 'Entretener'].map(f => (
            <button 
              key={f} onClick={() => setFilterType(f)}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all border ${
                filterType === f ? 'bg-orange-500/20 text-orange-400 border-orange-500/50' : 'bg-[#111318] text-gray-400 border-white/5 hover:text-white'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-6 relative">
        <Search className="w-4 h-4 text-gray-500 absolute left-4 top-1/2 transform -translate-y-1/2" />
        <input 
          type="text" 
          placeholder="Buscar por palabra clave o formato..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-[#111318] border border-gray-700/50 rounded-xl pl-10 pr-4 py-3 text-white text-sm focus:outline-none focus:border-orange-500 transition-colors"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((e, i) => (
          <motion.div 
            key={e.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            className="bg-[#1a1d24] border border-white/5 p-5 rounded-2xl hover:border-orange-500/30 transition-colors group relative"
          >
            <div className="flex justify-between items-start mb-3">
              <span className={`text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider ${
                e.type === 'Educar' ? 'bg-blue-500/10 text-blue-400' :
                e.type === 'Vender' ? 'bg-emerald-500/10 text-emerald-400' :
                'bg-pink-500/10 text-pink-400'
              }`}>{e.type}</span>
              <button className="text-gray-500 hover:text-white transition-colors">
                <Bookmark className="w-4 h-4" />
              </button>
            </div>
            
            <h4 className="font-bold text-white mb-2">{e.title}</h4>
            <div className="bg-[#111318] p-3 rounded-xl border border-gray-800 mb-4">
              <p className="text-sm text-gray-300 italic font-serif">"{e.hook}"</p>
            </div>
            
            <div className="flex items-center justify-between mt-auto">
              <div className="text-xs text-gray-500 font-semibold">{e.format}</div>
              <button 
                onClick={() => handleCopy(e.hook, e.id)}
                className="flex items-center gap-1.5 bg-gray-800 hover:bg-orange-500 hover:text-white text-gray-300 text-xs font-bold px-3 py-1.5 rounded-lg transition-all"
              >
                {copiedId === e.id ? <CheckCircle2 className="w-3.5 h-3.5 text-[#00ff9d]" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedId === e.id ? 'Copiado!' : 'Copiar'}
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ContentExamples;
