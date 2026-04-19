import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Map, Plus, Trash2, ChevronRight, Globe, Home, FileText } from 'lucide-react';

const tiposNodo = [
  { id: 'home', label: 'Home', color: 'bg-blue-500', icon: Home },
  { id: 'categoria', label: 'Categoría', color: 'bg-purple-500', icon: Globe },
  { id: 'subcategoria', label: 'Subcategoría', color: 'bg-emerald-500', icon: ChevronRight },
  { id: 'pagina', label: 'Página/Post', color: 'bg-yellow-500', icon: FileText },
];

const reglasArquitectura = [
  {
    titulo: 'Regla de los 3 Clics',
    desc: 'Cualquier página debe ser accesible en máximo 3 clics desde la Home.',
    icon: '🖱️', color: 'text-blue-400 bg-blue-500/10 border-blue-500/20'
  },
  {
    titulo: 'Pirámide de Silos',
    desc: 'Organiza el contenido en categorías → subcategorías → páginas de detalle.',
    icon: '🔺', color: 'text-purple-400 bg-purple-500/10 border-purple-500/20'
  },
  {
    titulo: 'Enlazado Interno Estratégico',
    desc: 'Las páginas más importantes deben recibir más enlaces internos (PageRank interno).',
    icon: '🔗', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
  },
  {
    titulo: 'URLs Limpias y Descriptivas',
    desc: 'midominio.com/categoria/subcategoria/keyword-producto (max 4 niveles).',
    icon: '📋', color: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20'
  },
  {
    titulo: 'Profundidad de Rastreo',
    desc: 'Google tiene límites de rastreo. Las páginas más profundas reciben menos autoridad.',
    icon: '🤖', color: 'text-pink-400 bg-pink-500/10 border-pink-500/20'
  },
];

const exampleStructure = [
  { id: 1, nivel: 0, tipo: 'home', nombre: 'Home — midominio.com', url: '/', links: 5 },
  { id: 2, nivel: 1, tipo: 'categoria', nombre: 'Servicios', url: '/servicios/', links: 3 },
  { id: 3, nivel: 2, tipo: 'subcategoria', nombre: 'Community Manager', url: '/servicios/community-manager/', links: 2 },
  { id: 4, nivel: 3, tipo: 'pagina', nombre: 'CM para Restaurantes', url: '/servicios/community-manager/restaurantes/', links: 0 },
  { id: 5, nivel: 3, tipo: 'pagina', nombre: 'CM para Moda', url: '/servicios/community-manager/moda/', links: 0 },
  { id: 6, nivel: 2, tipo: 'subcategoria', nombre: 'SEO', url: '/servicios/seo/', links: 2 },
  { id: 7, nivel: 3, tipo: 'pagina', nombre: 'SEO Local', url: '/servicios/seo/local/', links: 0 },
  { id: 8, nivel: 3, tipo: 'pagina', nombre: 'SEO E-commerce', url: '/servicios/seo/ecommerce/', links: 0 },
  { id: 9, nivel: 1, tipo: 'categoria', nombre: 'Blog', url: '/blog/', links: 4 },
  { id: 10, nivel: 2, tipo: 'pagina', nombre: 'Cómo hacer un plan de contenidos', url: '/blog/plan-de-contenidos/', links: 0 },
  { id: 11, nivel: 2, tipo: 'pagina', nombre: 'Herramientas de marketing digital', url: '/blog/herramientas-marketing/', links: 0 },
  { id: 12, nivel: 1, tipo: 'categoria', nombre: 'Contacto', url: '/contacto/', links: 0 },
];

const SEOArchitecture = () => {
  const [nodos, setNodos] = useState(exampleStructure);
  const [nuevoNombre, setNuevoNombre] = useState('');
  const [nuevoNivel, setNuevoNivel] = useState('1');
  const [nuevoTipo, setNuevoTipo] = useState('categoria');

  const agregar = () => {
    if (!nuevoNombre.trim()) return;
    const nivel = parseInt(nuevoNivel);
    const url = '/' + nuevoNombre.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') + '/';
    setNodos(prev => [...prev, {
      id: Date.now(), nivel, tipo: nuevoTipo, nombre: nuevoNombre.trim(), url, links: 0
    }]);
    setNuevoNombre('');
  };

  const eliminar = (id) => setNodos(prev => prev.filter(n => n.id !== id));

  const getIndentStyle = (nivel) => ({ paddingLeft: `${nivel * 24}px` });

  return (
    <div className="p-6 md:p-8">
      <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
        <div>
          <h3 className="text-xl font-bold text-white mb-1">Arquitectura Web SEO</h3>
          <p className="text-gray-400 text-sm">Diseña la estructura de tu sitio para maximizar el rastreo y la autoridad interna.</p>
        </div>
      </div>

      {/* Reglas de oro */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
        {reglasArquitectura.slice(0, 3).map((r, i) => (
          <div key={i} className={`p-4 rounded-xl border ${r.color}`}>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">{r.icon}</span>
              <h4 className="font-bold text-sm text-white">{r.titulo}</h4>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">{r.desc}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Árbol de estructura */}
        <div className="flex-1">
          <div className="bg-[#1a1d24] rounded-2xl border border-white/5 overflow-hidden">
            <div className="px-5 py-4 border-b border-white/5 bg-[#111318] flex items-center gap-2">
              <Map className="w-4 h-4 text-emerald-400" />
              <h4 className="font-bold text-white text-sm">Árbol de Navegación</h4>
              <span className="ml-auto text-xs text-gray-500">{nodos.length} páginas</span>
            </div>
            <div className="p-4 space-y-1 max-h-[500px] overflow-y-auto">
              {nodos.map(nodo => {
                const tipo = tiposNodo.find(t => t.id === nodo.tipo);
                const Icon = tipo?.icon || FileText;
                return (
                  <motion.div
                    key={nodo.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    style={getIndentStyle(nodo.nivel)}
                    className="flex items-center gap-2 py-2 px-3 rounded-xl hover:bg-white/[0.03] group transition-colors"
                  >
                    {nodo.nivel > 0 && (
                      <div className="flex items-center gap-1 flex-shrink-0">
                        {Array.from({ length: nodo.nivel }).map((_, i) => (
                          <ChevronRight key={i} className="w-3 h-3 text-gray-700 flex-shrink-0" />
                        ))}
                      </div>
                    )}
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${tipo?.color || 'bg-gray-500'}`} />
                    <div className="flex-1 min-w-0">
                      <div className="text-white text-sm font-medium truncate">{nodo.nombre}</div>
                      <div className="text-gray-600 text-xs font-mono truncate">{nodo.url}</div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className={`text-xs px-2 py-0.5 rounded-md border ${tiposNodo.find(t => t.id === nodo.tipo)?.color?.replace('bg-', 'text-').replace('-500', '-400') || 'text-gray-400'} bg-white/5 border-white/10`}>
                        {tipo?.label}
                      </span>
                      {nodo.id !== 1 && (
                        <button onClick={() => eliminar(nodo.id)} className="opacity-0 group-hover:opacity-100 text-gray-600 hover:text-red-400 transition-all">
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Panel de añadir + Leyenda */}
        <div className="w-full lg:w-72 space-y-4">
          <div className="bg-[#1a1d24] rounded-2xl border border-white/5 p-5 space-y-4">
            <h4 className="font-bold text-white text-sm flex items-center gap-2">
              <Plus className="w-4 h-4 text-emerald-400" /> Añadir Página
            </h4>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Nombre</label>
              <input
                type="text" value={nuevoNombre} onChange={e => setNuevoNombre(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && agregar()}
                placeholder="Ej: Community Manager"
                className="w-full bg-[#111318] border border-gray-700/80 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Nivel de profundidad</label>
              <select
                value={nuevoNivel} onChange={e => setNuevoNivel(e.target.value)}
                className="w-full bg-[#111318] border border-gray-700/80 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-emerald-500"
              >
                <option value="1">Nivel 1 — Sección principal</option>
                <option value="2">Nivel 2 — Subsección</option>
                <option value="3">Nivel 3 — Página detalle</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Tipo de página</label>
              <div className="grid grid-cols-2 gap-2">
                {tiposNodo.slice(1).map(t => (
                  <button key={t.id} onClick={() => setNuevoTipo(t.id)}
                    className={`flex items-center gap-1.5 px-2.5 py-2 rounded-lg text-xs font-bold transition-all border ${nuevoTipo === t.id ? `${t.color}/20 border-current text-white` : 'bg-gray-800/50 border-white/5 text-gray-400 hover:text-white'}`}>
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${t.color}`} />
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
            <button onClick={agregar} className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-black font-bold py-2.5 rounded-xl text-sm transition-all hover:shadow-lg">
              Añadir al mapa
            </button>
          </div>

          {/* Reglas adicionales */}
          {reglasArquitectura.slice(3).map((r, i) => (
            <div key={i} className={`p-4 rounded-xl border ${r.color}`}>
              <div className="flex items-center gap-2 mb-1.5">
                <span>{r.icon}</span>
                <h4 className="font-bold text-xs text-white">{r.titulo}</h4>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed">{r.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SEOArchitecture;
