import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Copy, CheckCircle2, Search, Filter, Sparkles, TrendingUp } from 'lucide-react';
import { promptCategories, promptsDB } from './promptsDB';

const PromptsLibraryModule = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiado, setCopiado] = useState(null);

  const copiar = (texto, id) => {
    navigator.clipboard.writeText(texto);
    setCopiado(id);
    setTimeout(() => setCopiado(null), 2000);
  };

  const filteredPrompts = promptsDB.filter(p => {
    const matchesCategory = activeCategory === 'all' || p.categoria === activeCategory || p.categoria === 'copywriting' && activeCategory === 'seo';
    const matchesSearch = p.titulo.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.descripcion.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="w-full flex flex-col gap-4 pb-20 md:pb-0">
      {/* Banner */}
      <div className="bg-gradient-to-r from-zinc-900 to-black border border-zinc-800 rounded-2xl px-6 py-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-zinc-800/40 rounded-full blur-[100px] pointer-events-none" />
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-zinc-800 border border-zinc-700 rounded-full mb-3">
              <Sparkles className="w-3.5 h-3.5 text-zinc-300" />
              <span className="text-xs font-semibold text-zinc-300">Base de Conocimiento</span>
            </div>
            <h2 className="text-3xl font-bold text-white flex items-center gap-3">
              <Terminal className="w-8 h-8 text-white" /> 10K+ Prompts IA
            </h2>
            <p className="text-zinc-400 text-sm mt-2 max-w-2xl">
              La biblioteca definitiva de prompts avanzados de marketing, extraída de 448 playbooks y recursos profesionales. Copia, pega y domina ChatGPT, Claude o Gemini.
            </p>
          </div>
          <div className="flex gap-3 flex-shrink-0">
            <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl px-5 py-3 text-center">
              <div className="text-2xl font-black text-white">10,000+</div>
              <div className="text-xs text-zinc-500">Prompts en DB</div>
            </div>
          </div>
        </div>
      </div>

      {/* Buscador y Filtros */}
      <div className="bg-[#0e1117] rounded-2xl border border-white/5 p-4 md:p-6 mb-2">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input 
              type="text" 
              placeholder="Buscar por palabra clave, objetivo o formato..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#1a1d24] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white text-sm focus:outline-none focus:border-zinc-500 transition-colors"
            />
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 hide-scrollbar flex-shrink-0">
            <Filter className="w-4 h-4 text-gray-500 mr-2 flex-shrink-0" />
            {promptCategories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all border ${
                  activeCategory === cat.id 
                    ? 'bg-white text-black border-white' 
                    : 'bg-[#1a1d24] text-gray-400 border-white/5 hover:text-white hover:bg-zinc-800'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid de Prompts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <AnimatePresence>
          {filteredPrompts.map(p => (
            <motion.div 
              key={p.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="bg-[#1a1d24] rounded-2xl border border-white/5 overflow-hidden hover:border-white/20 transition-colors flex flex-col"
            >
              <div className="p-5 border-b border-white/5 bg-[#111318]">
                <div className="flex justify-between items-start gap-4 mb-2">
                  <h3 className="font-bold text-white text-lg leading-tight">{p.titulo}</h3>
                  <button 
                    onClick={() => copiar(p.prompt, p.id)}
                    className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors flex-shrink-0"
                    title="Copiar Prompt"
                  >
                    {copiado === p.id ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-xs text-gray-400 mb-3">{p.descripcion}</p>
                <div className="flex flex-wrap gap-2">
                  {p.tags.map(tag => (
                    <span key={tag} className="text-[10px] uppercase font-bold tracking-wider px-2 py-1 bg-zinc-800 text-zinc-300 rounded-md">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="p-5 flex-1 bg-[#0e1117] relative group">
                <div className="absolute top-2 right-4 text-[10px] text-gray-600 font-mono">PROMPT</div>
                <pre className="text-sm text-gray-300 whitespace-pre-wrap font-sans leading-relaxed">
                  {p.prompt}
                </pre>
                
                <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-[#0e1117] via-[#0e1117]/80 to-transparent flex justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => copiar(p.prompt, p.id)}
                    className="bg-white text-black text-sm font-bold px-6 py-2 rounded-xl shadow-lg flex items-center gap-2 transform translate-y-2 group-hover:translate-y-0 transition-all"
                  >
                    {copiado === p.id ? <><CheckCircle2 className="w-4 h-4" /> Copiado</> : <><Copy className="w-4 h-4" /> Copiar para usar</>}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {filteredPrompts.length === 0 && (
          <div className="col-span-full py-20 text-center">
            <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-6 h-6 text-zinc-500" />
            </div>
            <h3 className="text-white font-bold mb-1">No se encontraron prompts</h3>
            <p className="text-gray-500 text-sm">Prueba con otros términos de búsqueda o cambia la categoría.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PromptsLibraryModule;
