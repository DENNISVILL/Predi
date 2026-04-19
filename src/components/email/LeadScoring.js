import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Target, TrendingUp, UserCheck, Flame, MailOpen, MousePointer, Globe, Award } from 'lucide-react';

const criteriosScoring = [
  { id: 'apertura', accion: 'Abre un email', puntos: 1, max: 10, icon: MailOpen, color: 'text-blue-400' },
  { id: 'clic', accion: 'Clic en enlace de email', puntos: 3, max: 30, icon: MousePointer, color: 'text-indigo-400' },
  { id: 'visita', accion: 'Visita página de precios', puntos: 5, max: 20, icon: Globe, color: 'text-purple-400' },
  { id: 'descarga', accion: 'Descarga lead magnet', puntos: 10, max: 20, icon: TrendingUp, color: 'text-emerald-400' },
  { id: 'webinar', accion: 'Asiste a webinar', puntos: 20, max: 20, icon: Target, color: 'text-yellow-400' },
  { id: 'carrito', accion: 'Abandona carrito', puntos: 15, max: 15, icon: Flame, color: 'text-orange-400' },
  { id: 'baja', accion: 'Se da de baja / Rebote', puntos: -50, max: -50, icon: UserCheck, color: 'text-red-400' },
];

const nivelesScoring = [
  { rango: '0-19', etiqueta: 'Frío', temp: '🧊', color: 'from-blue-500/20 to-sky-500/20', border: 'border-blue-500/30', texto: 'text-blue-400', accion: 'Nutrición (MOFU). Enviar contenido educativo y casos de éxito.' },
  { rango: '20-49', etiqueta: 'Tibio', temp: '☀️', color: 'from-yellow-500/20 to-orange-500/20', border: 'border-yellow-500/30', texto: 'text-yellow-400', accion: 'Activación (BOFU). Enviar ofertas iniciales o lead magnets avanzados.' },
  { rango: '50+', etiqueta: 'Caliente', temp: '🔥', color: 'from-red-500/20 to-orange-500/20', border: 'border-red-500/30', texto: 'text-red-400', accion: 'Venta Directa. Contactar por ventas, ofrecer demo o descuento agresivo.' },
];

const clientesEjemplo = [
  { id: 1, nombre: 'Ana García', email: 'ana@empresa.com', score: 65, estado: 'Caliente', ultAccion: 'Visita página de precios' },
  { id: 2, nombre: 'Carlos López', email: 'carlos@startup.io', score: 35, estado: 'Tibio', ultAccion: 'Descarga ebook' },
  { id: 3, nombre: 'Laura Martínez', email: 'laura@gmail.com', score: 12, estado: 'Frío', ultAccion: 'Abre email de bienvenida' },
  { id: 4, nombre: 'David Ruiz', email: 'david@agencia.com', score: 85, estado: 'Caliente', ultAccion: 'Abandona carrito' },
  { id: 5, nombre: 'Elena Sánchez', email: 'elena@hotmail.com', score: 5, estado: 'Frío', ultAccion: 'Clic en enlace blog' },
];

const LeadScoring = () => {
  const [simulador, setSimulador] = useState(0);

  const agregarPuntos = (pts) => {
    setSimulador(prev => Math.max(0, prev + pts));
  };

  const getEstadoSimulador = () => {
    if (simulador >= 50) return nivelesScoring[2];
    if (simulador >= 20) return nivelesScoring[1];
    return nivelesScoring[0];
  };

  const estadoActual = getEstadoSimulador();

  return (
    <div className="p-6 md:p-8">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-white mb-1">Lead Scoring</h3>
        <p className="text-gray-400 text-sm">Califica automáticamente a tus leads según su comportamiento para saber cuándo venderles.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Panel izquierdo - Reglas */}
        <div className="space-y-4">
          <div className="bg-[#1a1d24] rounded-2xl border border-white/5 overflow-hidden">
            <div className="px-5 py-4 border-b border-white/5 bg-[#111318] flex items-center justify-between">
              <h4 className="font-bold text-white text-sm">Reglas de Puntuación</h4>
              <span className="text-xs text-gray-500">Métricas estándar B2B/B2C</span>
            </div>
            <div className="divide-y divide-white/5">
              {criteriosScoring.map((c, i) => {
                const Icon = c.icon;
                return (
                  <div key={i} className="px-5 py-3 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg bg-[#0e1117] border border-white/5 ${c.color}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-sm text-gray-300">{c.accion}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-sm font-bold ${c.puntos > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                        {c.puntos > 0 ? '+' : ''}{c.puntos} pts
                      </span>
                      <button onClick={() => agregarPuntos(c.puntos)}
                        className="text-xs bg-[#111318] border border-white/10 hover:border-violet-500/50 text-gray-400 hover:text-white px-2 py-1 rounded-md transition-colors">
                        Simular
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-violet-500/10 border border-violet-500/20 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Award className="w-4 h-4 text-violet-400" />
              <h5 className="font-bold text-violet-300 text-xs">Mejor Práctica (MQL a SQL)</h5>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">
              Los leads que superan los <strong className="text-white">50 puntos</strong> pasan de ser MQL (Marketing Qualified Lead) a SQL (Sales Qualified Lead). Es el momento exacto para que el equipo de ventas los contacte.
            </p>
          </div>
        </div>

        {/* Panel derecho - Simulador y Niveles */}
        <div className="space-y-6">
          {/* Simulador Interactivo */}
          <div className={`bg-gradient-to-br ${estadoActual.color} border ${estadoActual.border} rounded-2xl p-6 transition-all duration-500`}>
            <div className="flex justify-between items-start mb-4">
              <h4 className="font-bold text-white text-sm">Simulador de Lead</h4>
              <button onClick={() => setSimulador(0)} className="text-xs text-gray-400 hover:text-white underline">Reiniciar</button>
            </div>
            
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="text-center">
                <motion.div
                  key={simulador}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className={`text-6xl font-black ${estadoActual.texto}`}
                >
                  {simulador}
                </motion.div>
                <div className="text-xs text-gray-400 font-bold uppercase tracking-wider mt-1">Puntos Acumulados</div>
              </div>
            </div>

            <div className="bg-[#111318]/80 rounded-xl p-4 border border-white/5 backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">{estadoActual.temp}</span>
                <span className={`font-bold ${estadoActual.texto}`}>Estado: {estadoActual.etiqueta}</span>
              </div>
              <p className="text-xs text-gray-300 leading-relaxed">
                <strong className="text-white">Siguiente Acción:</strong> {estadoActual.accion}
              </p>
            </div>
          </div>

          {/* Lista de Niveles */}
          <div className="bg-[#1a1d24] rounded-2xl border border-white/5 p-5">
            <h4 className="font-bold text-white text-sm mb-4">Niveles de Temperatura</h4>
            <div className="space-y-3">
              {nivelesScoring.map((n, i) => (
                <div key={i} className={`flex items-center justify-between p-3 rounded-xl border bg-[#111318] ${n.rango === estadoActual.rango ? n.border : 'border-white/5'}`}>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{n.temp}</span>
                    <div>
                      <div className={`font-bold text-sm ${n.texto}`}>{n.etiqueta}</div>
                      <div className="text-xs text-gray-500">{n.accion.split('.')[0]}</div>
                    </div>
                  </div>
                  <div className="text-sm font-bold text-gray-400">{n.rango} pts</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Ejemplo de CRM Integrado */}
      <div className="mt-6 bg-[#1a1d24] rounded-2xl border border-white/5 overflow-hidden">
        <div className="px-5 py-4 border-b border-white/5 bg-[#111318]">
          <h4 className="font-bold text-white text-sm">Ejemplo: Leads en tu Base de Datos</h4>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-xs uppercase text-gray-500 border-b border-white/5">
                <th className="px-5 py-3">Lead</th>
                <th className="px-5 py-3">Puntuación</th>
                <th className="px-5 py-3">Estado</th>
                <th className="px-5 py-3">Última Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {clientesEjemplo.map(c => {
                const estado = nivelesScoring.find(n => c.estado === n.etiqueta) || nivelesScoring[0];
                return (
                  <tr key={c.id} className="hover:bg-white/[0.02]">
                    <td className="px-5 py-3">
                      <div className="font-bold text-white">{c.nombre}</div>
                      <div className="text-xs text-gray-500">{c.email}</div>
                    </td>
                    <td className="px-5 py-3">
                      <span className={`font-black ${estado.texto}`}>{c.score}</span>
                    </td>
                    <td className="px-5 py-3">
                      <span className={`text-xs font-bold px-2 py-1 rounded-lg border bg-[#111318] ${estado.border} ${estado.texto}`}>
                        {estado.temp} {estado.etiqueta}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-gray-400 text-xs">{c.ultAccion}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LeadScoring;
