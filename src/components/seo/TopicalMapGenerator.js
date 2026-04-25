import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Network, Search, Plus, Trash2, ArrowRight, Save, Download, Sparkles } from 'lucide-react';

export default function TopicalMapGenerator() {
  const [coreTopic, setCoreTopic] = useState('');
  const [clusters, setClusters] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = () => {
    if (!coreTopic.trim()) return;
    setIsGenerating(true);
    
    // Simulate AI generation
    setTimeout(() => {
      setClusters([
        {
          id: 1,
          name: `Fundamentos de ${coreTopic}`,
          articles: [
            `¿Qué es ${coreTopic} y por qué es importante?`,
            `Historia y evolución de ${coreTopic}`,
            `Conceptos clave de ${coreTopic} explicados`,
            `Mitos comunes sobre ${coreTopic}`
          ]
        },
        {
          id: 2,
          name: `Estrategias Avanzadas de ${coreTopic}`,
          articles: [
            `Técnicas avanzadas para dominar ${coreTopic}`,
            `Cómo escalar tus resultados con ${coreTopic}`,
            `Casos de estudio exitosos aplicando ${coreTopic}`,
            `Herramientas premium para ${coreTopic}`
          ]
        },
        {
          id: 3,
          name: `${coreTopic} para Principiantes`,
          articles: [
            `Guía paso a paso de ${coreTopic} para novatos`,
            `Errores que debes evitar al empezar con ${coreTopic}`,
            `El kit de herramientas básico para ${coreTopic}`,
            `Cómo conseguir tus primeros resultados con ${coreTopic}`
          ]
        }
      ]);
      setIsGenerating(false);
    }, 1500);
  };

  const addCluster = () => {
    setClusters([...clusters, { id: Date.now(), name: 'Nuevo Cluster', articles: ['Nueva idea de artículo'] }]);
  };

  const removeCluster = (id) => {
    setClusters(clusters.filter(c => c.id !== id));
  };

  const addArticle = (clusterId) => {
    setClusters(clusters.map(c => {
      if (c.id === clusterId) {
        return { ...c, articles: [...c.articles, 'Nueva idea de artículo'] };
      }
      return c;
    }));
  };

  const updateArticle = (clusterId, index, value) => {
    setClusters(clusters.map(c => {
      if (c.id === clusterId) {
        const newArticles = [...c.articles];
        newArticles[index] = value;
        return { ...c, articles: newArticles };
      }
      return c;
    }));
  };

  const removeArticle = (clusterId, index) => {
    setClusters(clusters.map(c => {
      if (c.id === clusterId) {
        const newArticles = [...c.articles];
        newArticles.splice(index, 1);
        return { ...c, articles: newArticles };
      }
      return c;
    }));
  };

  const updateClusterName = (clusterId, value) => {
    setClusters(clusters.map(c => c.id === clusterId ? { ...c, name: value } : c));
  };

  const handleExport = () => {
    const lines = [
      `TOPICAL MAP: ${coreTopic.toUpperCase()}`,
      `Generado con Predix SEO Studio\n`,
      ...clusters.map(c => `[CLUSTER] ${c.name}\n${c.articles.map(a => `  - ${a}`).join('\n')}\n`)
    ];
    const blob = new Blob([lines.join('\n')], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `topical-map-${coreTopic.toLowerCase().replace(/\\s+/g, '-')}.txt`; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 flex flex-col gap-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Network className="w-5 h-5 text-emerald-400" /> Mapa de Autoridad Tópica (Topical Map)
          </h3>
          <p className="text-xs text-gray-500 mt-1">
            Genera una estructura de clústers de contenido para dominar una entidad en Google.
          </p>
        </div>
        {clusters.length > 0 && (
          <button onClick={handleExport} className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 rounded-xl text-sm font-semibold transition-all">
            <Download className="w-4 h-4" /> Exportar Mapa
          </button>
        )}
      </div>

      <div className="flex flex-col gap-4">
        <div className="bg-[#111318] border border-white/5 rounded-xl p-5 flex flex-col gap-3">
          <label className="text-sm font-semibold text-gray-300">Tema Central (Pillar Topic)</label>
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input 
                type="text" 
                placeholder="Ej: Marketing Digital, Nutrición Deportiva, Inversiones en Cripto..."
                value={coreTopic}
                onChange={(e) => setCoreTopic(e.target.value)}
                className="w-full bg-[#1a1d24] border border-white/10 rounded-xl pl-12 pr-4 py-3.5 text-white focus:outline-none focus:border-emerald-500/50 transition-colors"
                onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
              />
            </div>
            <button 
              onClick={handleGenerate}
              disabled={isGenerating || !coreTopic.trim()}
              className="px-6 py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 whitespace-nowrap"
            >
              {isGenerating ? <Sparkles className="w-5 h-5 animate-pulse" /> : <Network className="w-5 h-5" />}
              {isGenerating ? 'Generando...' : 'Crear Mapa'}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {clusters.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-4">
              <div className="flex items-center justify-between mt-4">
                <h4 className="text-sm font-bold text-gray-300 uppercase tracking-wider">Clústers Generados</h4>
                <button onClick={addCluster} className="flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 font-semibold">
                  <Plus className="w-4 h-4" /> Añadir Clúster Manual
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {clusters.map((cluster) => (
                  <motion.div key={cluster.id} layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-[#111318] border border-white/10 rounded-xl overflow-hidden flex flex-col">
                    <div className="bg-[#1a1d24] px-4 py-3 border-b border-white/5 flex items-center justify-between">
                      <input 
                        value={cluster.name}
                        onChange={(e) => updateClusterName(cluster.id, e.target.value)}
                        className="bg-transparent border-none text-white font-bold text-sm focus:outline-none w-full"
                      />
                      <button onClick={() => removeCluster(cluster.id)} className="text-gray-500 hover:text-red-400 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="p-4 flex flex-col gap-3 flex-1">
                      {cluster.articles.map((article, idx) => (
                        <div key={idx} className="flex items-start gap-2 group">
                          <ArrowRight className="w-4 h-4 text-emerald-500 mt-1 flex-shrink-0" />
                          <textarea 
                            value={article}
                            onChange={(e) => updateArticle(cluster.id, idx, e.target.value)}
                            rows={2}
                            className="w-full bg-black/20 border border-transparent rounded-md px-2 py-1 text-sm text-gray-300 focus:outline-none focus:border-white/10 resize-none overflow-hidden"
                          />
                          <button onClick={() => removeArticle(cluster.id, idx)} className="text-gray-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity mt-1">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                    <div className="px-4 py-3 border-t border-white/5 bg-[#161920]">
                      <button onClick={() => addArticle(cluster.id)} className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors w-full justify-center">
                        <Plus className="w-3.5 h-3.5" /> Añadir Artículo
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
