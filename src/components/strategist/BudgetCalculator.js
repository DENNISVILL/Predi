import React, { useState } from 'react';
import { Calculator, DollarSign, TrendingUp, PieChart, Info } from 'lucide-react';
import { Doughnut } from 'react-chartjs-2';

const BudgetCalculator = () => {
  const [budget, setBudget] = useState(1000);
  const [strategy, setStrategy] = useState('balanced'); // aggressive, balanced, organic

  // Lógica simple de simulación basada en el PDF
  const getDistribution = () => {
    switch(strategy) {
      case 'aggressive': return { ads: 0.6, content: 0.3, tools: 0.1 };
      case 'organic': return { ads: 0.2, content: 0.6, tools: 0.2 };
      default: return { ads: 0.4, content: 0.4, tools: 0.2 };
    }
  };

  const dist = getDistribution();
  const adsBudget = budget * dist.ads;
  const contentBudget = budget * dist.content;
  const toolsBudget = budget * dist.tools;

  const estimatedReach = Math.floor(adsBudget * 150); // $1 = 150 impresiones aprox
  const estimatedLeads = Math.floor(adsBudget * 0.05); // 5% conversion a lead

  const chartData = {
    labels: ['Pauta Digital (Ads)', 'Creación de Contenido', 'Herramientas/Software'],
    datasets: [{
      data: [adsBudget, contentBudget, toolsBudget],
      backgroundColor: ['#007bff', '#8b5cf6', '#00ff9d'],
      borderWidth: 0
    }]
  };

  return (
    <div className="p-6 md:p-8">
      <div className="mb-8">
        <h3 className="text-2xl font-bold text-white mb-2">Calculadora de Presupuesto & ROI</h3>
        <p className="text-gray-400">Distribuye tu inversión inteligentemente basándote en las mejores prácticas de la industria.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Controles */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#1a1d24] p-6 rounded-2xl border border-white/5">
            <label className="block text-sm font-bold text-white mb-4">Presupuesto Mensual Total (USD)</label>
            <div className="relative">
              <DollarSign className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input 
                type="number" 
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                className="w-full bg-[#111318] border border-gray-700 rounded-xl pl-12 pr-4 py-4 text-2xl font-bold text-white focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
          </div>

          <div className="bg-[#1a1d24] p-6 rounded-2xl border border-white/5">
            <label className="block text-sm font-bold text-white mb-4">Enfoque de Estrategia</label>
            <div className="space-y-3">
              <button 
                onClick={() => setStrategy('aggressive')}
                className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${strategy === 'aggressive' ? 'bg-[#007bff]/20 border-[#007bff] text-white' : 'bg-[#111318] border-gray-800 text-gray-400 hover:border-gray-600'}`}
              >
                <div className="text-left">
                  <div className="font-bold">Crecimiento Agresivo</div>
                  <div className="text-xs opacity-70">Prioriza pauta digital (Ads) para resultados rápidos.</div>
                </div>
              </button>
              
              <button 
                onClick={() => setStrategy('balanced')}
                className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${strategy === 'balanced' ? 'bg-purple-500/20 border-purple-500 text-white' : 'bg-[#111318] border-gray-800 text-gray-400 hover:border-gray-600'}`}
              >
                <div className="text-left">
                  <div className="font-bold">Equilibrado (Recomendado)</div>
                  <div className="text-xs opacity-70">Balance entre alcance pago y calidad de contenido.</div>
                </div>
              </button>

              <button 
                onClick={() => setStrategy('organic')}
                className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${strategy === 'organic' ? 'bg-[#00ff9d]/20 border-[#00ff9d] text-white' : 'bg-[#111318] border-gray-800 text-gray-400 hover:border-gray-600'}`}
              >
                <div className="text-left">
                  <div className="font-bold">Construcción Orgánica</div>
                  <div className="text-xs opacity-70">Prioriza producción audiovisual y comunidad.</div>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Resultados */}
        <div className="lg:col-span-7 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-[#1a1d24] p-5 rounded-2xl border border-white/5 border-t-4 border-t-blue-500">
              <div className="text-sm text-gray-400 mb-1">Pauta Digital</div>
              <div className="text-2xl font-bold text-white">${adsBudget.toLocaleString()}</div>
            </div>
            <div className="bg-[#1a1d24] p-5 rounded-2xl border border-white/5 border-t-4 border-t-purple-500">
              <div className="text-sm text-gray-400 mb-1">Contenido</div>
              <div className="text-2xl font-bold text-white">${contentBudget.toLocaleString()}</div>
            </div>
            <div className="bg-[#1a1d24] p-5 rounded-2xl border border-white/5 border-t-4 border-t-[#00ff9d]">
              <div className="text-sm text-gray-400 mb-1">Herramientas</div>
              <div className="text-2xl font-bold text-white">${toolsBudget.toLocaleString()}</div>
            </div>
          </div>

          <div className="bg-[#1a1d24] p-6 rounded-2xl border border-white/5 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="h-48 flex justify-center">
              <Doughnut data={chartData} options={{ maintainAspectRatio: false, plugins: { legend: { display: false } } }} />
            </div>
            <div>
              <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><TrendingUp className="w-5 h-5 text-[#00ff9d]" /> Proyección Estimada</h4>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-400">Alcance Potencial (Ads)</span>
                    <span className="text-white font-bold">{estimatedReach.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-1.5"><div className="bg-blue-500 h-1.5 rounded-full w-[70%]"></div></div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-400">Leads / Prospectos</span>
                    <span className="text-white font-bold">{estimatedLeads.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-1.5"><div className="bg-[#00ff9d] h-1.5 rounded-full w-[40%]"></div></div>
                </div>
              </div>
              
              <div className="mt-6 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg flex items-start gap-2">
                <Info className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-blue-200/70">
                  Las proyecciones se basan en un CPM promedio de $6.66 y una tasa de conversión estándar de la industria.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BudgetCalculator;
