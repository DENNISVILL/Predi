import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Brain, Cpu, MessageSquare, Briefcase, TrendingUp, Sparkles, AlertCircle } from 'lucide-react';

const StrategyCard = ({ title, description, icon: Icon, delay }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay }}
    className="glass-card p-5 border-l-4 border-l-secondary hover:border-l-primary transition-all relative overflow-hidden"
  >
    <div className="absolute top-0 right-0 w-24 h-24 bg-secondary/10 rounded-full blur-2xl -mr-8 -mt-8"></div>
    <div className="flex gap-4">
      <div className="p-3 rounded-full bg-surface-hover mb-auto">
        <Icon size={20} className="text-secondary" />
      </div>
      <div>
        <h4 className="font-bold text-text-primary mb-1">{title}</h4>
        <p className="text-sm text-text-secondary leading-relaxed">{description}</p>
      </div>
    </div>
  </motion.div>
);

const CMBrainModule = () => {
  const [niche, setNiche] = useState('ecommerce');
  const [isGenerating, setIsGenerating] = useState(false);
  const [strategyProps, setStrategyProps] = useState(null);

  const generateStrategy = () => {
    setIsGenerating(true);
    // Simular llamada al backend de IA
    setTimeout(() => {
      let data = {};
      if (niche === 'ecommerce') {
        data = {
          kpis: ["Costo por Adquisición (CPA)", "Retorno de Inversión (ROAS)", "Tasa de Conversión"],
          tactical: ["Carruseles de unboxing", "UGC (User Generated Content) con micro-influencers", "Anuncios dinámicos de retargeting"],
          algoFocus: "Algoritmo de TikTok (Priorizar 'Completion Rate' en los primeros 3 segundos)",
        };
      } else if (niche === 'local') {
        data = {
          kpis: ["Foot Traffic Estimado", "Alcance Local Radius", "Consultas por DM"],
          tactical: ["Reels mostrando 'Detrás de escena'", "Promociones flash en Stories", "Colaboraciones con creadores de la ciudad"],
          algoFocus: "Algoritmo de Instagram (Frecuencia diaria en Stories, Geotags obligatorios)",
        };
      } else {
        data = {
          kpis: ["Leads Cualificados (MQLs)", "Tasa de Cierre en DM", "Engagement Rate Alto"],
          tactical: ["Hilos en X de autoridad", "Videos largos de valor en YT/IGTV", "Webinars gratuitos"],
          algoFocus: "Algoritmo de LinkedIn / X (Comentarios tempranos, Guardados > Likes)",
        };
      }
      setStrategyProps(data);
      setIsGenerating(false);
    }, 1500);
  };

  return (
    <div className="p-6 lg:p-10 min-h-screen">
      <div className="max-w-6xl mx-auto">
        
        <header className="mb-10">
          <h2 className="text-3xl font-display font-bold flex items-center gap-3">
            <Brain className="text-secondary animate-pulse-glow" size={32} />
            <span className="text-glow-secondary">Cerebro IA</span> Estratégico
          </h2>
          <p className="text-text-secondary mt-2 max-w-2xl">
            Motor de Inteligencia Artificial entrenado con metodologías avanzadas de Community Management. Genera estrategias algorítmicas al instante.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Panel de Configuración */}
          <div className="lg:col-span-4 glass-panel p-6 h-fit">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Cpu size={20} className="text-primary" />
              Parámetros del Oráculo
            </h3>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-mono text-text-secondary mb-2">NICHO DEL CLIENTE</label>
                <div className="grid grid-cols-1 gap-2">
                  {['ecommerce', 'local', 'servicios'].map(type => (
                    <button
                      key={type}
                      onClick={() => setNiche(type)}
                      className={`py-3 px-4 rounded-xl text-left font-medium transition-all flex items-center gap-3 ${
                        niche === type 
                          ? 'bg-secondary/20 border border-secondary/50 text-white shadow-[0_0_15px_rgba(112,0,255,0.2)]' 
                          : 'bg-surface hover:bg-surface-hover border border-white/5 text-text-muted'
                      }`}
                    >
                      {type === 'ecommerce' && <Briefcase size={18} />}
                      {type === 'local' && <Sparkles size={18} />}
                      {type === 'servicios' && <MessageSquare size={18} />}
                      <span className="capitalize">{type}</span>
                    </button>
                  ))}
                </div>
              </div>

              <button 
                onClick={generateStrategy}
                disabled={isGenerating}
                className="w-full py-4 bg-primary text-background font-bold rounded-xl hover:bg-white hover:shadow-[0_0_20px_rgba(0,240,255,0.6)] transition-all flex justify-center items-center gap-2 disabled:opacity-50"
              >
                {isGenerating ? (
                  <><div className="w-5 h-5 border-2 border-background border-t-transparent rounded-full animate-spin"></div> PROCESANDO LÓGICA...</>
                ) : (
                  <><Brain size={20} /> GENERAR ESTRATEGIA MAESTRA</>
                )}
              </button>
            </div>
          </div>

          {/* Panel de Resultados */}
          <div className="lg:col-span-8">
            {!strategyProps && !isGenerating && (
              <div className="h-full glass-card p-10 flex flex-col items-center justify-center text-center opacity-60 border-dashed border-white/10">
                <Brain size={64} className="text-text-muted mb-4 animate-float" />
                <h3 className="text-xl font-bold text-text-secondary">Esperando instrucciones</h3>
                <p className="text-sm text-text-muted max-w-sm mt-2">Configura el nicho en el panel lateral y el Cerebro IA estructurará el plan de acción.</p>
              </div>
            )}

            {isGenerating && (
              <div className="h-full glass-card p-10 flex flex-col items-center justify-center text-center">
                <Cpu size={48} className="text-secondary mb-4 animate-spin-slow" />
                <h3 className="text-xl font-mono text-secondary mb-2 text-glow-secondary">Consultando Oráculo Gemini...</h3>
                <div className="w-64 h-1 bg-surface-hover rounded-full overflow-hidden">
                  <div className="h-full bg-secondary w-full origin-left animate-pulse"></div>
                </div>
              </div>
            )}

            {strategyProps && !isGenerating && (
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="space-y-6"
              >
                <div className="glass-panel p-6 bg-secondary/5 border-secondary/20">
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-white">
                    <TrendingUp className="text-accent" /> KPIs Críticos a Medir
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {strategyProps.kpis.map((kpi, i) => (
                      <span key={i} className="px-4 py-2 bg-background border border-white/10 rounded-full text-sm font-mono text-accent shadow-[0_0_10px_rgba(0,255,157,0.1)]">
                        {kpi}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {strategyProps.tactical.map((tactic, i) => (
                    <StrategyCard 
                      key={i}
                      delay={i * 0.1}
                      title={`Táctica ${i+1}`}
                      description={tactic}
                      icon={Sparkles}
                    />
                  ))}
                </div>

                <motion.div 
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                  className="glass-card p-6 border border-primary/30 relative overflow-hidden"
                >
                  <div className="scan-line"></div>
                  <h3 className="text-lg font-bold mb-2 flex items-center gap-2 text-primary">
                    <AlertCircle /> Foco Algorítmico Exigido
                  </h3>
                  <p className="text-text-primary text-lg">{strategyProps.algoFocus}</p>
                </motion.div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CMBrainModule;
