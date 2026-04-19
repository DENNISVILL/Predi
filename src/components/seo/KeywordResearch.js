import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Plus, Trash2, TrendingUp, TrendingDown, Minus, Download, Info } from 'lucide-react';

const intenciones = [
  { id: 'informacional', label: 'Informacional', desc: 'Buscan aprender (¿Qué es...?, Cómo...)', color: 'text-blue-400 bg-blue-500/10 border-blue-500/30' },
  { id: 'navegacional', label: 'Navegacional', desc: 'Buscan un sitio específico (marca + nombre)', color: 'text-purple-400 bg-purple-500/10 border-purple-500/30' },
  { id: 'transaccional', label: 'Transaccional', desc: 'Listos para comprar (comprar, precio, oferta)', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' },
  { id: 'comercial', label: 'Comercial', desc: 'Investigan antes de comprar (mejor, comparar)', color: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30' },
];

const dificultadConfig = {
  low: { label: 'Fácil', color: 'text-emerald-400', icon: TrendingDown },
  medium: { label: 'Media', color: 'text-yellow-400', icon: Minus },
  high: { label: 'Difícil', color: 'text-red-400', icon: TrendingUp },
};

const exampleKeywords = [
  { id: 1, keyword: 'gestión redes sociales', volumen: 12100, dificultad: 'medium', intencion: 'comercial', cpc: '$2.40', prioridad: 'alta' },
  { id: 2, keyword: 'community manager freelance', volumen: 4400, dificultad: 'low', intencion: 'comercial', cpc: '$3.10', prioridad: 'alta' },
  { id: 3, keyword: 'herramientas marketing digital', volumen: 22200, dificultad: 'high', intencion: 'informacional', cpc: '$1.80', prioridad: 'media' },
  { id: 4, keyword: 'cómo hacer un plan de contenidos', volumen: 8100, dificultad: 'low', intencion: 'informacional', cpc: '$1.20', prioridad: 'alta' },
  { id: 5, keyword: 'contratar community manager', volumen: 2900, dificultad: 'low', intencion: 'transaccional', cpc: '$4.50', prioridad: 'muy alta' },
  { id: 6, keyword: 'precio community manager', volumen: 1900, dificultad: 'low', intencion: 'comercial', cpc: '$3.80', prioridad: 'muy alta' },
  { id: 7, keyword: 'agencia de marketing digital', volumen: 33100, dificultad: 'high', intencion: 'transaccional', cpc: '$5.20', prioridad: 'media' },
  { id: 8, keyword: 'crear contenido para instagram', volumen: 6600, dificultad: 'medium', intencion: 'informacional', cpc: '$1.50', prioridad: 'media' },
];

const prioridadColor = {
  'muy alta': 'text-red-400 bg-red-500/10 border-red-500/30',
  'alta': 'text-orange-400 bg-orange-500/10 border-orange-500/30',
  'media': 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30',
  'baja': 'text-gray-400 bg-gray-500/10 border-gray-500/30',
};

const KeywordResearch = () => {
  const [keywords, setKeywords] = useState(exampleKeywords);
  const [nueva, setNueva] = useState('');
  const [filtroIntencion, setFiltroIntencion] = useState('todas');
  const [filtroDificultad, setFiltroDificultad] = useState('todas');
  const [ordenar, setOrdenar] = useState('volumen');

  const agregar = () => {
    if (!nueva.trim()) return;
    setKeywords(prev => [...prev, {
      id: Date.now(), keyword: nueva.trim(),
      volumen: Math.floor(Math.random() * 10000) + 100,
      dificultad: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)],
      intencion: 'informacional', cpc: `$${(Math.random() * 5 + 0.5).toFixed(2)}`, prioridad: 'media'
    }]);
    setNueva('');
  };

  const eliminar = (id) => setKeywords(prev => prev.filter(k => k.id !== id));

  const filtradas = keywords
    .filter(k => filtroIntencion === 'todas' || k.intencion === filtroIntencion)
    .filter(k => filtroDificultad === 'todas' || k.dificultad === filtroDificultad)
    .sort((a, b) => {
      if (ordenar === 'volumen') return b.volumen - a.volumen;
      if (ordenar === 'dificultad') return ['low','medium','high'].indexOf(a.dificultad) - ['low','medium','high'].indexOf(b.dificultad);
      return a.keyword.localeCompare(b.keyword);
    });

  return (
    <div className="p-6 md:p-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h3 className="text-xl font-bold text-white mb-1">Investigación de Palabras Clave</h3>
          <p className="text-gray-400 text-sm">Organiza y prioriza tus keywords por volumen, dificultad e intención de búsqueda.</p>
        </div>
        <button className="flex items-center gap-2 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold px-4 py-2.5 rounded-xl text-sm hover:bg-emerald-500/30 transition-colors flex-shrink-0">
          <Download className="w-4 h-4" /> Exportar CSV
        </button>
      </div>

      {/* Intenciones de búsqueda - Info */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-6">
        {intenciones.map(i => (
          <div key={i.id} className={`p-3 rounded-xl border text-xs ${i.color}`}>
            <div className="font-bold mb-0.5">{i.label}</div>
            <div className="opacity-70">{i.desc}</div>
          </div>
        ))}
      </div>

      {/* Añadir keyword */}
      <div className="flex gap-2 mb-5">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text" value={nueva} onChange={e => setNueva(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && agregar()}
            placeholder="Añadir keyword... Ej: marketing digital para pymes"
            className="w-full bg-[#1a1d24] border border-gray-700/80 rounded-xl pl-10 pr-4 py-3 text-white text-sm focus:outline-none focus:border-emerald-500 transition-colors"
          />
        </div>
        <button onClick={agregar} className="bg-emerald-500 hover:bg-emerald-600 text-black font-bold px-4 py-3 rounded-xl transition-colors flex items-center gap-2 flex-shrink-0">
          <Plus className="w-4 h-4" /> Añadir
        </button>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap gap-2 mb-4">
        <select
          value={filtroIntencion} onChange={e => setFiltroIntencion(e.target.value)}
          className="bg-[#1a1d24] border border-gray-700/80 text-gray-300 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-emerald-500"
        >
          <option value="todas">Todas las intenciones</option>
          {intenciones.map(i => <option key={i.id} value={i.id}>{i.label}</option>)}
        </select>
        <select
          value={filtroDificultad} onChange={e => setFiltroDificultad(e.target.value)}
          className="bg-[#1a1d24] border border-gray-700/80 text-gray-300 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-emerald-500"
        >
          <option value="todas">Toda dificultad</option>
          <option value="low">Fácil</option>
          <option value="medium">Media</option>
          <option value="high">Difícil</option>
        </select>
        <select
          value={ordenar} onChange={e => setOrdenar(e.target.value)}
          className="bg-[#1a1d24] border border-gray-700/80 text-gray-300 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-emerald-500"
        >
          <option value="volumen">Ordenar: Mayor volumen</option>
          <option value="dificultad">Ordenar: Menor dificultad</option>
          <option value="keyword">Ordenar: Alfabético</option>
        </select>
        <div className="ml-auto text-xs text-gray-500 flex items-center">{filtradas.length} keywords</div>
      </div>

      {/* Tabla */}
      <div className="bg-[#1a1d24] rounded-2xl border border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#111318] text-xs uppercase tracking-wider text-gray-500 border-b border-white/5">
                <th className="px-5 py-3 font-semibold">Keyword</th>
                <th className="px-4 py-3 font-semibold text-right">Volumen</th>
                <th className="px-4 py-3 font-semibold">Dificultad</th>
                <th className="px-4 py-3 font-semibold">Intención</th>
                <th className="px-4 py-3 font-semibold text-right">CPC</th>
                <th className="px-4 py-3 font-semibold">Prioridad</th>
                <th className="px-4 py-3 font-semibold"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtradas.map((k, i) => {
                const dif = dificultadConfig[k.dificultad];
                const DifIcon = dif.icon;
                return (
                  <motion.tr
                    key={k.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="px-5 py-3.5">
                      <span className="text-white font-medium text-sm">{k.keyword}</span>
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <span className="text-emerald-400 font-bold text-sm">{k.volumen.toLocaleString()}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className={`inline-flex items-center gap-1 text-xs font-bold ${dif.color}`}>
                        <DifIcon className="w-3 h-3" /> {dif.label}
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-xs text-gray-300 capitalize">{k.intencion}</span>
                    </td>
                    <td className="px-4 py-3.5 text-right text-sm text-gray-400">{k.cpc}</td>
                    <td className="px-4 py-3.5">
                      <span className={`text-xs font-bold px-2 py-1 rounded-lg border ${prioridadColor[k.prioridad] || prioridadColor['media']}`}>
                        {k.prioridad}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <button onClick={() => eliminar(k.id)} className="text-gray-600 hover:text-red-400 transition-colors">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="px-5 py-3 border-t border-white/5 bg-[#111318]">
          <p className="text-xs text-gray-600">
            💡 <strong className="text-gray-400">Estrategia 70/20/10:</strong> 70% keywords de volumen bajo/medio (fáciles de rankear), 20% keywords de nicho, 10% keywords competitivas (long-term).
          </p>
        </div>
      </div>
    </div>
  );
};

export default KeywordResearch;
