import React from 'react';
import { motion } from 'framer-motion';
import { Crosshair, ShieldAlert, Target, Shield, ArrowRight } from 'lucide-react';

const CompetitorMatrix = () => {
  const competitors = [
    {
      name: 'Nuestra Marca',
      isOurs: true,
      positioning: 'Solución Premium B2B',
      weaknesses: 'Poca presencia en TikTok',
      strengths: 'Comunidad leal en LinkedIn, Alta retención',
      contentPillars: ['Casos de Éxito', 'Educación Técnica', 'Cultura']
    },
    {
      name: 'Competidor Alpha',
      isOurs: false,
      positioning: 'Líder en Volumen',
      weaknesses: 'Atención al cliente deficiente, Contenido genérico',
      strengths: 'Gran presupuesto de Ads, Dominio SEO',
      contentPillars: ['Ofertas', 'Tutoriales Básicos', 'Memes']
    },
    {
      name: 'Competidor Beta',
      isOurs: false,
      positioning: 'Innovador / Disruptivo',
      weaknesses: 'Precio muy alto, Difícil de usar',
      strengths: 'Diseño increíble, Fuerte en IG y TikTok',
      contentPillars: ['Estilo de Vida', 'Features', 'UGC (Usuarios)']
    }
  ];

  return (
    <div className="p-6 md:p-8">
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h3 className="text-xl font-bold text-white mb-1 flex items-center gap-2">
            <Target className="w-5 h-5 text-purple-400" /> Matriz de Competencia
          </h3>
          <p className="text-gray-400 text-sm">Analiza el ecosistema para encontrar huecos en el mercado (Blue Oceans).</p>
        </div>
        <button className="bg-purple-500 hover:bg-purple-600 text-white text-sm font-bold px-4 py-2 rounded-xl transition-colors">
          Añadir Competidor
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {competitors.map((comp, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`rounded-2xl p-6 border relative overflow-hidden ${
              comp.isOurs 
                ? 'bg-[#1a1d24] border-purple-500/50 shadow-lg shadow-purple-500/10' 
                : 'bg-[#111318] border-white/5'
            }`}
          >
            {comp.isOurs && (
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-[40px] pointer-events-none" />
            )}

            <div className="flex justify-between items-center mb-6">
              <h4 className={`text-xl font-black ${comp.isOurs ? 'text-purple-400' : 'text-white'}`}>
                {comp.name}
              </h4>
              {comp.isOurs && <span className="bg-purple-500/20 text-purple-400 text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded">Nosotros</span>}
            </div>

            <div className="space-y-4">
              <div>
                <div className="text-[10px] uppercase font-bold text-gray-500 tracking-wider mb-1">Posicionamiento</div>
                <div className="text-sm text-gray-300 font-semibold">{comp.positioning}</div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-emerald-500/10 border border-emerald-500/20 p-3 rounded-xl">
                  <div className="flex items-center gap-1 text-emerald-400 text-xs font-bold mb-1">
                    <Shield className="w-3 h-3" /> Fortalezas
                  </div>
                  <div className="text-xs text-emerald-200/70">{comp.strengths}</div>
                </div>
                <div className="bg-red-500/10 border border-red-500/20 p-3 rounded-xl">
                  <div className="flex items-center gap-1 text-red-400 text-xs font-bold mb-1">
                    <ShieldAlert className="w-3 h-3" /> Debilidades
                  </div>
                  <div className="text-xs text-red-200/70">{comp.weaknesses}</div>
                </div>
              </div>

              <div>
                <div className="text-[10px] uppercase font-bold text-gray-500 tracking-wider mb-2">Pilares de Contenido</div>
                <div className="flex flex-wrap gap-2">
                  {comp.contentPillars.map(pillar => (
                    <span key={pillar} className="bg-gray-800 text-gray-300 text-[10px] px-2 py-1 rounded-md border border-gray-700">
                      {pillar}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {!comp.isOurs && (
              <div className="mt-6 pt-4 border-t border-white/5">
                <div className="text-xs text-purple-400 font-bold flex items-center gap-1 cursor-pointer hover:text-purple-300 transition-colors">
                  <Crosshair className="w-3 h-3" /> Ángulo de ataque recomendado <ArrowRight className="w-3 h-3 ml-auto" />
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default CompetitorMatrix;
