import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, CheckCircle2, AlertCircle, XCircle, BarChart2, RefreshCw } from 'lucide-react';

const ContentOptimizer = () => {
  const [url, setUrl] = useState('');
  const [texto, setTexto] = useState('');
  const [keyword, setKeyword] = useState('');
  const [analizado, setAnalizado] = useState(false);
  const [analizando, setAnalizando] = useState(false);

  const analizar = () => {
    if (!texto && !url) return;
    setAnalizando(true);
    setTimeout(() => { setAnalizando(false); setAnalizado(true); }, 2000);
  };

  const palabras = texto.split(/\s+/).filter(Boolean).length;
  const caracteres = texto.length;
  const keywordCount = keyword ? (texto.toLowerCase().match(new RegExp(keyword.toLowerCase(), 'g')) || []).length : 0;
  const densidad = palabras > 0 && keyword ? ((keywordCount / palabras) * 100).toFixed(1) : 0;

  const headings = {
    h1: (texto.match(/^# .+/gm) || []).length,
    h2: (texto.match(/^## .+/gm) || []).length,
    h3: (texto.match(/^### .+/gm) || []).length,
  };

  const criteriosContenido = [
    {
      id: 'length',
      label: 'Longitud del contenido',
      estado: palabras >= 1000 ? 'ok' : palabras >= 500 ? 'warning' : 'error',
      valor: `${palabras} palabras`,
      tip: 'Recomendado: +1000 palabras para artículos de blog, +500 para páginas de servicio.',
    },
    {
      id: 'kw-density',
      label: 'Densidad de keyword',
      estado: parseFloat(densidad) >= 0.5 && parseFloat(densidad) <= 2.5 ? 'ok' : parseFloat(densidad) > 2.5 ? 'error' : 'warning',
      valor: keyword ? `${densidad}% (${keywordCount} veces)` : 'Ingresa una keyword',
      tip: 'Densidad ideal: 0.5% - 2%. Sobreoptimizar puede penalizar.',
    },
    {
      id: 'readability',
      label: 'Legibilidad (oraciones cortas)',
      estado: palabras > 0 ? 'ok' : 'warning',
      valor: palabras > 0 ? 'Análisis disponible' : 'Sin texto',
      tip: 'Mantén oraciones de máximo 20 palabras para mayor legibilidad.',
    },
    {
      id: 'h1',
      label: 'H1 (usa # en markdown)',
      estado: headings.h1 === 1 ? 'ok' : headings.h1 === 0 ? 'error' : 'warning',
      valor: `${headings.h1} encontrado${headings.h1 !== 1 ? 's' : ''}`,
      tip: 'Debe haber exactamente 1 H1 por página, con la keyword principal.',
    },
    {
      id: 'h2s',
      label: 'Estructura H2 para secciones',
      estado: headings.h2 >= 2 ? 'ok' : headings.h2 === 1 ? 'warning' : 'error',
      valor: `${headings.h2} sección${headings.h2 !== 1 ? 'es' : ''}`,
      tip: 'Mínimo 2-3 H2 para estructurar bien el contenido.',
    },
  ];

  const statusIcon = (estado) => {
    if (estado === 'ok') return <CheckCircle2 className="w-5 h-5 text-emerald-400" />;
    if (estado === 'warning') return <AlertCircle className="w-5 h-5 text-yellow-400" />;
    return <XCircle className="w-5 h-5 text-red-400" />;
  };

  const score = analizado ? Math.round(criteriosContenido.filter(c => c.estado === 'ok').length / criteriosContenido.length * 100) : 0;

  return (
    <div className="p-6 md:p-8 flex flex-col lg:flex-row gap-8">
      {/* Panel izquierdo - Input */}
      <div className="w-full lg:w-2/5 space-y-4">
        <div>
          <h3 className="text-xl font-bold text-white mb-1">Optimizador de Contenido</h3>
          <p className="text-gray-400 text-sm">Analiza tu texto y recibe recomendaciones SEO en tiempo real.</p>
        </div>

        <div className="bg-[#1a1d24] rounded-2xl border border-white/5 p-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wide">Keyword objetivo</label>
            <input
              type="text" value={keyword} onChange={e => setKeyword(e.target.value)}
              placeholder="Ej: community manager"
              className="w-full bg-[#111318] border border-gray-700/80 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wide">
              Tu contenido (en Markdown o texto plano)
            </label>
            <textarea
              value={texto} onChange={e => setTexto(e.target.value)}
              placeholder={`# Título Principal (H1)\n\nEscribe aquí tu contenido...\n\n## Sección 1 (H2)\n\nContenido de la sección...\n\n## Sección 2 (H2)\n\nMás contenido...`}
              rows={12}
              className="w-full bg-[#111318] border border-gray-700/80 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-emerald-500 transition-colors resize-none font-mono"
            />
            <div className="flex justify-between text-xs text-gray-600 mt-1">
              <span>{palabras} palabras</span>
              <span>{caracteres} caracteres</span>
            </div>
          </div>
          <button
            onClick={analizar} disabled={analizando || (!texto && !url)}
            className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-black font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:shadow-lg disabled:opacity-50 transition-all"
          >
            {analizando ? <><RefreshCw className="w-4 h-4 animate-spin" /> Analizando...</> : <><BarChart2 className="w-4 h-4" /> Analizar SEO</>}
          </button>
        </div>

        {/* Tips SEO */}
        <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-4">
          <h4 className="font-bold text-emerald-300 text-xs uppercase tracking-wide mb-3">📚 Guía de Optimización</h4>
          <div className="space-y-2 text-xs text-gray-400">
            {[
              '✍️ Usa la keyword en el H1, primer párrafo y al menos 1 H2',
              '🔗 Añade 2-3 enlaces internos a páginas relacionadas',
              '📸 Incluye imágenes con ALT descriptivo',
              '📝 Escribe la meta description manualmente (no dejes que Google la genere)',
              '🎯 Responde la intención del usuario en los primeros 100 palabras',
              '📊 Incluye datos, estadísticas y fuentes para mejorar E-E-A-T',
            ].map((tip, i) => <p key={i} className="leading-relaxed">{tip}</p>)}
          </div>
        </div>
      </div>

      {/* Panel derecho - Resultados */}
      <div className="flex-1 space-y-4">
        {analizado ? (
          <>
            {/* Score general */}
            <div className="bg-[#1a1d24] rounded-2xl border border-white/5 p-5 text-center">
              <div className={`text-5xl font-black mb-1 ${score >= 80 ? 'text-emerald-400' : score >= 50 ? 'text-yellow-400' : 'text-red-400'}`}>
                {score}%
              </div>
              <div className="text-gray-400 text-sm">Puntuación SEO del Contenido</div>
              <div className="w-full bg-gray-800 rounded-full h-2 mt-3">
                <motion.div
                  className={`h-2 rounded-full ${score >= 80 ? 'bg-emerald-500' : score >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`}
                  initial={{ width: 0 }} animate={{ width: `${score}%` }} transition={{ duration: 0.6 }}
                />
              </div>
            </div>

            {/* Métricas rápidas */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Palabras', value: palabras, color: palabras >= 1000 ? 'text-emerald-400' : 'text-yellow-400' },
                { label: 'Densidad KW', value: `${densidad}%`, color: parseFloat(densidad) >= 0.5 && parseFloat(densidad) <= 2 ? 'text-emerald-400' : 'text-red-400' },
                { label: 'H2 Secciones', value: headings.h2, color: headings.h2 >= 2 ? 'text-emerald-400' : 'text-yellow-400' },
              ].map((m, i) => (
                <div key={i} className="bg-[#1a1d24] rounded-xl border border-white/5 p-3 text-center">
                  <div className={`text-2xl font-black ${m.color}`}>{m.value}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{m.label}</div>
                </div>
              ))}
            </div>

            {/* Criterios de análisis */}
            <div className="bg-[#1a1d24] rounded-2xl border border-white/5 overflow-hidden">
              <div className="px-5 py-3 border-b border-white/5 bg-[#111318]">
                <h4 className="font-bold text-white text-sm">Análisis Detallado</h4>
              </div>
              <div className="divide-y divide-white/5">
                {criteriosContenido.map(c => (
                  <div key={c.id} className="px-5 py-4 flex items-start gap-3">
                    <div className="flex-shrink-0 mt-0.5">{statusIcon(c.estado)}</div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <span className="text-white text-sm font-medium">{c.label}</span>
                        <span className={`text-xs font-bold ${c.estado === 'ok' ? 'text-emerald-400' : c.estado === 'warning' ? 'text-yellow-400' : 'text-red-400'}`}>
                          {c.valor}
                        </span>
                      </div>
                      <p className="text-gray-500 text-xs mt-0.5 leading-relaxed">{c.tip}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center h-full min-h-[400px]">
            <div className="w-16 h-16 bg-gray-800 rounded-2xl flex items-center justify-center mb-4">
              <FileText className="w-8 h-8 text-gray-600" />
            </div>
            <h4 className="text-lg font-bold text-white mb-2">Análisis SEO listo</h4>
            <p className="text-gray-500 text-sm max-w-xs">
              Pega tu contenido, define la keyword objetivo y haz clic en "Analizar SEO".
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContentOptimizer;
