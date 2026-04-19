import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Plus, ExternalLink, Clock, Mail, CheckCircle2, XCircle } from 'lucide-react';

const influencers = [
  { id: 1, name: '@tech_guru', platform: 'instagram', nicho: 'Tecnología', seguidores: '125K', er: '4.5%', estado: 'contactado', precio: '$500' },
  { id: 2, name: '@marcos_fitness', platform: 'tiktok', nicho: 'Fitness', seguidores: '850K', er: '8.2%', estado: 'negociando', precio: '$1,200' },
  { id: 3, name: '@laura_lifestyle', platform: 'instagram', nicho: 'Lifestyle', seguidores: '45K', er: '12.1%', estado: 'aprobado', precio: 'Canje' },
  { id: 4, name: '@crypto_danny', platform: 'x', nicho: 'Finanzas', seguidores: '210K', er: '2.8%', estado: 'rechazado', precio: '$800' },
];

const estadoConfig = {
  contactado: { label: 'Contactado', color: 'text-blue-400 bg-blue-500/10 border-blue-500/30', icon: Clock },
  negociando: { label: 'Negociando', color: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30', icon: Mail },
  aprobado: { label: 'Aprobado', color: 'text-[#00ff9d] bg-[#00ff9d]/10 border-[#00ff9d]/30', icon: CheckCircle2 },
  rechazado: { label: 'Rechazado', color: 'text-red-400 bg-red-500/10 border-red-500/30', icon: XCircle },
};

const platformIcon = { instagram: '📷', tiktok: '🎵', x: '𝕏' };

const InfluencerCRM = () => {
  const [busqueda, setBusqueda] = useState('');
  const filtrados = influencers.filter(i =>
    i.name.includes(busqueda) || i.nicho.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="p-6 md:p-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h3 className="text-xl font-bold text-white mb-1">CRM de Influencers</h3>
          <p className="text-gray-400 text-sm">Gestiona tus campañas con creadores y micro-embajadores de marca.</p>
        </div>
        <button className="bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold px-4 py-2.5 rounded-xl flex items-center gap-2 hover:shadow-lg hover:shadow-orange-500/20 transition-all text-sm flex-shrink-0">
          <Plus className="w-4 h-4" /> Añadir Creador
        </button>
      </div>

      <div className="bg-[#1a1d24] rounded-2xl border border-white/5 overflow-hidden">
        {/* Barra de búsqueda */}
        <div className="p-4 border-b border-white/5 bg-[#111318]">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
            <input
              type="text" placeholder="Buscar por usuario o nicho..."
              value={busqueda} onChange={e => setBusqueda(e.target.value)}
              className="w-full bg-[#1a1d24] border border-gray-700/80 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-orange-500 transition-colors"
            />
          </div>
        </div>

        {/* Tabla */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#111318] text-xs uppercase tracking-wider text-gray-500 border-b border-white/5">
                <th className="px-5 py-3 font-semibold">Creador</th>
                <th className="px-5 py-3 font-semibold">Nicho</th>
                <th className="px-5 py-3 font-semibold">Seguidores</th>
                <th className="px-5 py-3 font-semibold">Presupuesto</th>
                <th className="px-5 py-3 font-semibold">Estado</th>
                <th className="px-5 py-3 font-semibold text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtrados.map(inf => {
                const estado = estadoConfig[inf.estado];
                const StatusIcon = estado.icon;
                return (
                  <tr key={inf.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-gray-700 to-gray-600 flex items-center justify-center font-bold text-white text-sm flex-shrink-0">
                          {inf.name.charAt(1).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-bold text-white text-sm flex items-center gap-1">
                            {inf.name}
                            <ExternalLink className="w-3 h-3 text-gray-500 cursor-pointer hover:text-white" />
                          </div>
                          <div className="text-xs text-gray-500">{platformIcon[inf.platform]} {inf.platform}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-xs bg-gray-800 text-gray-300 px-2.5 py-1 rounded-lg">{inf.nicho}</span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="font-bold text-white text-sm">{inf.seguidores}</div>
                      <div className="text-xs text-[#00ff9d]">ER: {inf.er}</div>
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-300">{inf.precio}</td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-lg border ${estado.color}`}>
                        <StatusIcon className="w-3 h-3" /> {estado.label}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button className="text-gray-500 hover:text-white transition-colors text-lg leading-none">···</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="px-5 py-3 border-t border-white/5 bg-[#111318]">
          <p className="text-xs text-gray-600">
            💡 Prioriza micro-influencers (10K–50K seguidores) con Engagement Rate superior al 5% para mejor retorno de inversión.
          </p>
        </div>
      </div>
    </div>
  );
};

export default InfluencerCRM;
