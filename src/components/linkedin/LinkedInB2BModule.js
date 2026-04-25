import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, MessageSquare, Target, UserPlus, FileText, CheckCircle, TrendingUp, Filter } from 'lucide-react';

export default function LinkedInB2BModule() {
  const [activeTab, setActiveTab] = useState('pipeline');
  const [searchQuery, setSearchQuery] = useState('');

  const tabs = [
    { id: 'pipeline', label: 'Pipeline de Prospección', icon: Target },
    { id: 'messages', label: 'Secuencias de Mensajes', icon: MessageSquare },
    { id: 'profile', label: 'Optimizador de Perfil', icon: UserPlus },
    { id: 'content', label: 'Estrategia de Contenido', icon: FileText },
  ];

  const leads = [
    { id: 1, name: 'Carlos Mendoza', role: 'CMO @ TechStart', status: 'Conectado', lastAction: 'Hace 2 días' },
    { id: 2, name: 'Laura Gómez', role: 'CEO @ InnovaCorp', status: 'Mensaje Enviado', lastAction: 'Hace 5 horas' },
    { id: 3, name: 'David Silva', role: 'Director de Ventas @ GlobalSolutions', status: 'Reunión Agendada', lastAction: 'Ayer' },
    { id: 4, name: 'Ana Martínez', role: 'VP Marketing @ DataFlow', status: 'Pendiente', lastAction: 'Hace 1 semana' },
  ];

  const statusColors = {
    'Conectado': 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    'Mensaje Enviado': 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    'Reunión Agendada': 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    'Pendiente': 'text-gray-400 bg-gray-500/10 border-gray-500/20',
  };

  return (
    <div className="w-full flex flex-col gap-4 pb-20 md:pb-0">
      {/* Banner */}
      <div className="bg-gradient-to-r from-blue-900/60 to-indigo-900/60 border border-blue-500/20 rounded-2xl px-6 py-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] pointer-events-none" />
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/20 border border-blue-500/30 rounded-full mb-3">
              <TrendingUp className="w-3.5 h-3.5 text-blue-300" />
              <span className="text-xs font-semibold text-blue-300">Generación de Leads B2B</span>
            </div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Briefcase className="w-6 h-6 text-blue-400" /> LinkedIn B2B Machine
            </h2>
            <p className="text-blue-200/80 text-sm mt-1 max-w-xl">
              Automatiza tu prospección, optimiza tu perfil para convertir visitas en reuniones y domina la creación de contenido profesional.
            </p>
          </div>
          <div className="flex gap-3 flex-shrink-0">
             <div className="bg-black/30 border border-white/10 rounded-xl px-4 py-2 text-center">
              <div className="text-xl font-black text-white">124</div>
              <div className="text-xs text-gray-400">Leads Activos</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {tabs.map(tab => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl transition-all whitespace-nowrap flex-shrink-0 border ${
                isActive
                  ? 'bg-blue-500/20 border-blue-500/60 text-white shadow-lg shadow-blue-500/10'
                  : 'bg-[#111318] border-white/8 text-gray-400 hover:text-white hover:bg-[#1a1d24] hover:border-white/15'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-blue-400' : ''}`} />
              <span className="font-semibold text-sm">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="bg-[#0e1117] rounded-2xl border border-white/5 overflow-hidden min-h-[500px]">
        <AnimatePresence mode="wait">
          {activeTab === 'pipeline' && (
            <motion.div key="pipeline" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="p-6">
               <div className="flex justify-between items-center mb-6">
                 <h3 className="text-lg font-bold text-white">Pipeline Activo</h3>
                 <div className="flex items-center gap-3">
                   <div className="relative">
                      <Filter className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                      <input 
                        type="text" 
                        placeholder="Filtrar leads..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="bg-[#1a1d24] border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500/50"
                      />
                   </div>
                 </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                 {/* Kanban Columns (Mock) */}
                 {['Pendiente', 'Conectado', 'Mensaje Enviado', 'Reunión Agendada'].map(status => (
                    <div key={status} className="bg-[#111318] rounded-xl border border-white/5 p-4 min-h-[400px]">
                       <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 border-b border-white/5 pb-2">{status}</h4>
                       <div className="flex flex-col gap-3">
                          {leads.filter(l => l.status === status).map(lead => (
                             <div key={lead.id} className="bg-[#1a1d24] p-3 rounded-lg border border-white/5 hover:border-blue-500/30 transition-colors cursor-pointer">
                                <p className="font-bold text-sm text-white">{lead.name}</p>
                                <p className="text-xs text-gray-500 mt-1 line-clamp-1">{lead.role}</p>
                                <div className="mt-3 flex justify-between items-center">
                                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${statusColors[lead.status]}`}>
                                    {lead.status}
                                  </span>
                                  <span className="text-[10px] text-gray-600">{lead.lastAction}</span>
                                </div>
                             </div>
                          ))}
                       </div>
                    </div>
                 ))}
               </div>
            </motion.div>
          )}

          {activeTab === 'messages' && (
            <motion.div key="messages" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="p-6">
              <div className="max-w-3xl mx-auto flex flex-col gap-6">
                <h3 className="text-lg font-bold text-white mb-2">Plantillas de Alta Conversión</h3>
                
                <div className="bg-[#111318] border border-white/10 rounded-xl p-5 relative group">
                  <div className="absolute top-4 right-4"><CheckCircle className="w-5 h-5 text-emerald-500 opacity-50" /></div>
                  <h4 className="font-bold text-blue-400 text-sm mb-2">1. Mensaje de Conexión (Sin venta)</h4>
                  <p className="text-gray-300 text-sm whitespace-pre-wrap font-sans bg-black/20 p-4 rounded-lg border border-white/5">
                    "Hola [Nombre], vi tu reciente comentario en el post de [Tema/Persona] y me pareció muy acertada tu perspectiva sobre [Punto Específico]. Me encantaría conectar para seguir aprendiendo de tu contenido."
                  </p>
                  <p className="text-xs text-gray-500 mt-3">Tasa de aceptación promedio: 68%</p>
                </div>

                <div className="bg-[#111318] border border-white/10 rounded-xl p-5 relative group">
                  <h4 className="font-bold text-blue-400 text-sm mb-2">2. Seguimiento Aportando Valor (Día 3)</h4>
                  <p className="text-gray-300 text-sm whitespace-pre-wrap font-sans bg-black/20 p-4 rounded-lg border border-white/5">
                    "Hola [Nombre], gracias por conectar. Estaba investigando sobre [Tema Relevante a su industria] y encontré este [Recurso/Artículo/Guía] que creo que podría servirle a tu equipo en [Su Empresa]. Aquí tienes el enlace: [Link]. ¡Espero te sea útil!"
                  </p>
                  <p className="text-xs text-gray-500 mt-3">Objetivo: Construir reciprocidad.</p>
                </div>

                <div className="bg-[#111318] border border-white/10 rounded-xl p-5 relative group">
                  <h4 className="font-bold text-blue-400 text-sm mb-2">3. La Pregunta Suave (Día 7)</h4>
                  <p className="text-gray-300 text-sm whitespace-pre-wrap font-sans bg-black/20 p-4 rounded-lg border border-white/5">
                    "Hola [Nombre], una curiosidad rápida... Veo que en [Su Empresa] están apostando fuerte por [Iniciativa/Nicho]. Nosotros ayudamos a empresas similares a resolver [Problema Común]. ¿Es esto una prioridad para ustedes en este trimestre?"
                  </p>
                  <p className="text-xs text-gray-500 mt-3">Tasa de respuesta positiva: 15-20%</p>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'profile' && (
            <motion.div key="profile" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="p-6">
               <div className="text-center py-10">
                 <UserPlus className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                 <h3 className="text-xl font-bold text-white mb-2">Auditor de Perfil con IA</h3>
                 <p className="text-gray-400 text-sm max-w-md mx-auto mb-6">Conecta tu URL de LinkedIn para analizar tu foto, titular, banner y sección "Acerca de" con recomendaciones instantáneas para aumentar conversiones.</p>
                 <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-xl transition-all">
                   Analizar mi perfil
                 </button>
               </div>
            </motion.div>
          )}

          {activeTab === 'content' && (
            <motion.div key="content" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="p-6">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="bg-gradient-to-br from-[#111318] to-blue-900/10 border border-white/5 rounded-2xl p-6">
                    <h4 className="font-bold text-white mb-4 flex items-center gap-2"><FileText className="w-5 h-5 text-blue-400" /> Fórmulas de Contenido</h4>
                    <ul className="space-y-4">
                      <li className="bg-black/20 p-3 rounded-lg border border-white/5">
                        <strong className="text-blue-300 block text-sm">El "Cero a Cien" (Historia de Éxito)</strong>
                        <span className="text-gray-400 text-xs">Cómo pasamos de [Situación A] a [Situación B] en X meses. (Incluye 3 aprendizajes clave).</span>
                      </li>
                      <li className="bg-black/20 p-3 rounded-lg border border-white/5">
                        <strong className="text-blue-300 block text-sm">El Mito Destruido (Contraintuitivo)</strong>
                        <span className="text-gray-400 text-xs">Por qué [Creencia Popular en tu industria] te está costando dinero. Lo que deberías hacer en su lugar.</span>
                      </li>
                      <li className="bg-black/20 p-3 rounded-lg border border-white/5">
                        <strong className="text-blue-300 block text-sm">El Framework (Valor Educativo)</strong>
                        <span className="text-gray-400 text-xs">Robate nuestro sistema interno de 5 pasos para [Lograr X]. Guárdalo para después.</span>
                      </li>
                    </ul>
                 </div>
                 <div className="bg-[#111318] border border-white/5 rounded-2xl p-6 flex flex-col justify-center items-center text-center">
                    <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mb-4">
                      <TrendingUp className="w-8 h-8 text-blue-400" />
                    </div>
                    <h4 className="font-bold text-white mb-2">Generador de Posts IA</h4>
                    <p className="text-gray-400 text-sm mb-6">Genera carruseles y posts de texto nativos de LinkedIn basados en las noticias de tu industria.</p>
                    <button className="bg-white/10 hover:bg-white/20 text-white font-semibold px-5 py-2.5 rounded-xl border border-white/10 transition-colors">
                      Crear nuevo post
                    </button>
                 </div>
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
