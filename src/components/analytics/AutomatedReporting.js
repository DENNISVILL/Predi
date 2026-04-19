import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, Calendar, RefreshCw, CheckCircle2, TrendingUp } from 'lucide-react';

const AutomatedReporting = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [reportReady, setReportReady] = useState(false);

  const generateReport = () => {
    setIsGenerating(true);
    setTimeout(() => { setIsGenerating(false); setReportReady(true); }, 3000);
  };

  return (
    <div className="p-6 md:p-8 flex flex-col lg:flex-row gap-8">
      {/* Configuración */}
      <div className="w-full lg:w-2/5 space-y-5">
        <div>
          <h3 className="text-xl font-bold text-white mb-1">Generador de Reportes</h3>
          <p className="text-gray-400 text-sm">Genera un reporte ejecutivo listo para enviar al cliente, basado en la plantilla oficial de agencia.</p>
        </div>

        <div className="bg-[#1a1d24] p-5 rounded-2xl border border-white/5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wide">Cliente / Marca</label>
            <input
              type="text" defaultValue="Predix Demo"
              className="w-full bg-[#111318] border border-gray-700/80 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-orange-500 transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wide flex items-center gap-1">
              <Calendar className="w-3 h-3" /> Período a Evaluar
            </label>
            <select className="w-full bg-[#111318] border border-gray-700/80 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-orange-500 transition-colors">
              <option>Últimos 30 días</option>
              <option>Mes anterior</option>
              <option>Este trimestre</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wide">Métricas a Incluir</label>
            <div className="space-y-2.5">
              {['Crecimiento de Seguidores', 'Tasa de Engagement (ER)', 'Contenidos Top del Mes', 'ROI de Anuncios'].map(m => (
                <label key={m} className="flex items-center gap-2.5 text-sm text-gray-300 cursor-pointer">
                  <input type="checkbox" defaultChecked className="accent-orange-500 w-4 h-4" /> {m}
                </label>
              ))}
            </div>
          </div>
          <button
            onClick={generateReport} disabled={isGenerating}
            className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-orange-500/20 disabled:opacity-60 transition-all"
          >
            {isGenerating ? <><RefreshCw className="w-4 h-4 animate-spin" /> Procesando...</> : <><FileText className="w-4 h-4" /> Generar Reporte</>}
          </button>
        </div>
      </div>

      {/* Vista Previa */}
      <div className="flex-1 bg-[#1a1d24] rounded-2xl border border-white/5 p-6 min-h-[420px] flex flex-col">
        {reportReady ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full flex flex-col">
            <div className="flex justify-between items-center mb-6 bg-[#111318] p-4 rounded-xl border border-white/5">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#00ff9d]" />
                <div>
                  <h4 className="font-bold text-white text-sm">Reporte generado con éxito</h4>
                  <p className="text-xs text-gray-400">Listo para descargar o enviar por correo.</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="bg-white text-black px-3 py-1.5 rounded-lg font-bold text-xs flex items-center gap-1 hover:bg-gray-200 transition-colors">
                  <Download className="w-3 h-3" /> PDF
                </button>
                <button className="bg-orange-500 text-white px-3 py-1.5 rounded-lg font-bold text-xs flex items-center gap-1 hover:bg-orange-600 transition-colors">
                  <Download className="w-3 h-3" /> PPTX
                </button>
              </div>
            </div>
            {/* Mockup de reporte */}
            <div className="flex-1 border border-gray-700 bg-white rounded-xl overflow-hidden shadow-xl flex flex-col max-w-sm mx-auto w-full p-8">
              <div className="text-center mb-8">
                <h1 className="text-2xl font-black text-gray-900 mb-1">REPORTE MENSUAL</h1>
                <h2 className="text-base text-gray-600 font-semibold">PREDIX DEMO</h2>
                <div className="w-12 h-1 bg-orange-500 mx-auto mt-3" />
              </div>
              <div className="space-y-5">
                <div>
                  <h3 className="text-gray-500 font-bold text-xs uppercase tracking-wider mb-1.5">Resumen Ejecutivo</h3>
                  <p className="text-gray-800 text-xs leading-relaxed">Durante los últimos 30 días, la cuenta experimentó un crecimiento orgánico del 15% gracias a la estrategia de Reels diarios...</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                    <div className="text-2xl font-black text-orange-500">+4.2K</div>
                    <div className="text-xs text-gray-500 font-bold mb-1">Nuevos Seguidores</div>
                    <div className="text-[10px] text-emerald-500 font-bold flex items-center gap-1">↑ 15% vs Mes Anterior</div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                    <div className="text-2xl font-black text-orange-500">8.4%</div>
                    <div className="text-xs text-gray-500 font-bold mb-1">Tasa de Engagement</div>
                    <div className="text-[10px] text-emerald-500 font-bold flex items-center gap-1">↑ 2.1% vs Mes Anterior</div>
                  </div>
                </div>
                
                {/* Benchmark Industry */}
                <div className="bg-orange-50 p-4 rounded-xl border border-orange-100 mt-2">
                  <h3 className="text-orange-800 font-bold text-xs uppercase tracking-wider mb-2 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" /> Benchmark de Industria
                  </h3>
                  <div className="space-y-2">
                    <div>
                      <div className="flex justify-between text-[10px] font-bold text-gray-600 mb-1">
                        <span>Tu Engagement (8.4%)</span>
                        <span className="text-emerald-600">Top 15%</span>
                      </div>
                      <div className="w-full bg-orange-200 rounded-full h-1.5">
                        <div className="bg-orange-500 h-1.5 rounded-full" style={{ width: '85%' }}></div>
                      </div>
                    </div>
                    <p className="text-[10px] text-orange-800/80 leading-snug">
                      Estás superando la media de tu nicho B2B (que es del 3.2%) por más del doble. Excelente trabajo de retención.
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-auto flex justify-between items-end border-t border-gray-200 pt-3">
                <div className="text-xs text-gray-400">Generado por Predix IA</div>
                <div className="text-xs font-bold text-gray-800">Pág. 1 / 8</div>
              </div>
            </div>
          </motion.div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            {isGenerating ? (
              <>
                <RefreshCw className="w-10 h-10 text-orange-500 animate-spin mb-4" />
                <h3 className="text-lg font-bold text-white mb-1">Procesando datos...</h3>
                <p className="text-gray-500 text-sm max-w-xs">La IA está recopilando métricas y redactando el resumen ejecutivo.</p>
              </>
            ) : (
              <>
                <div className="w-16 h-16 bg-gray-800/80 rounded-2xl flex items-center justify-center mb-4">
                  <FileText className="w-8 h-8 text-gray-600" />
                </div>
                <h3 className="text-lg font-bold text-white mb-1">Vista previa del reporte</h3>
                <p className="text-gray-500 text-sm max-w-xs">Configura los parámetros y genera un reporte digno de una agencia top.</p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AutomatedReporting;
