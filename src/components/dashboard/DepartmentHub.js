import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Users, Briefcase, ChevronRight } from 'lucide-react';

export default function DepartmentHub({ department, onSelectTool }) {
  if (!department) return null;

  return (
    <div className="w-full flex flex-col gap-6 text-white pb-20 md:pb-0">
      {/* Header Banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#111318] to-[#1a1d24] border border-white/5 rounded-2xl p-8">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] pointer-events-none" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full mb-4">
            <Briefcase className="w-4 h-4 text-gray-400" />
            <span className="text-xs font-semibold text-gray-300 uppercase tracking-wider">Departamento</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-black mb-3">{department.category}</h2>
          <div className="flex items-center gap-2 text-gray-400 bg-black/20 px-4 py-2 rounded-lg inline-flex">
            <Users className="w-4 h-4 text-emerald-400" />
            <span className="text-sm font-semibold">Roles: {department.roles}</span>
          </div>
        </div>
      </div>

      {/* Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mt-2">
        {department.items.map((tool, idx) => {
          const Icon = tool.icon;
          return (
            <motion.button
              key={tool.id}
              onClick={() => onSelectTool(tool.id)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-[#0e1117] border border-white/10 hover:border-[#00ff9d]/50 rounded-2xl p-6 text-left group transition-all duration-300 hover:bg-[#11141b] relative overflow-hidden flex flex-col justify-between min-h-[160px]"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#00ff9d]/5 rounded-full blur-[40px] opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div>
                <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-[#00ff9d]/10 transition-all">
                  <Icon className="w-6 h-6 text-gray-300 group-hover:text-[#00ff9d]" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{tool.label}</h3>
                <p className="text-sm text-gray-500 line-clamp-2">{tool.description || 'Herramienta de grado empresarial para acelerar procesos operativos.'}</p>
              </div>

              <div className="mt-6 flex items-center text-sm font-bold text-gray-400 group-hover:text-[#00ff9d] transition-colors">
                Entrar al escritorio <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
