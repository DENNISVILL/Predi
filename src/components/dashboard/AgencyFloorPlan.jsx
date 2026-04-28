import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Crown, BarChart3, Brain, Target, Wand2, Calendar,
  Mail, Terminal, Megaphone, Search, Users, Globe,
  ArrowRight, Building2, Wifi, User, UserPlus, UsersRound,
  Rocket, ChevronDown, Info, Star, Zap, CheckCircle2
} from 'lucide-react';

// ══════════════════════════════════════════════════
// GUÍA DE FASES — Para abrir tu agencia digital
// ══════════════════════════════════════════════════
const STARTUP_GUIDE = [
  {
    phase: 1,
    label: 'Solo / Freelancer',
    team: '1 persona',
    description: 'Tú haces todo. La IA es tu equipo.',
    color: '#00ff9d',
    icon: User,
    roles: ['Director General / CEO', 'Community Manager', 'Content Strategist'],
    tip: 'Empieza aquí. Con Predix IA puedes operar como si fueras 3 personas diferentes.'
  },
  {
    phase: 2,
    label: 'Micro Agencia',
    team: '2–3 personas',
    description: 'Tu primer equipo real. Delega lo operativo.',
    color: '#007bff',
    icon: UserPlus,
    roles: ['+ Copywriter / Redactor', '+ Media Buyer', 'CEO enfocado en clientes'],
    tip: 'Añade 1 especialista en contenido y 1 en ads. Ya tienes una agencia funcional.'
  },
  {
    phase: 3,
    label: 'Agencia en Crecimiento',
    team: '4–8 personas',
    description: 'Departamentos definidos. Clientes de mayor valor.',
    color: '#8b5cf6',
    icon: UsersRound,
    roles: ['+ Director Creativo', '+ SEO Specialist', '+ Account Manager', '+ Head of Sales'],
    tip: 'Con este equipo puedes manejar de 5 a 15 clientes simultáneamente.'
  },
  {
    phase: 4,
    label: 'Agencia Escalada',
    team: '10+ personas',
    description: 'Estructura corporativa. Clientes enterprise.',
    color: '#f97316',
    icon: Rocket,
    roles: ['+ CFO / Director Financiero', '+ Data Analyst', '+ Email Marketer', '+ Consultor Estratégico'],
    tip: 'Ya eres una agencia completa. Considera white-label y marca propia.'
  }
];

// ══════════════════════════════════════════════════
// ESTRUCTURA DEL EDIFICIO — Jerarquía real
// ══════════════════════════════════════════════════
const BUILDING = [
  {
    id: 'penthouse',
    level: 'PH',
    label: 'DIRECCIÓN GENERAL',
    rooms: [
      {
        id: 'strategist',
        role: 'Director General / CEO',
        tool: 'Estratega IA',
        icon: Crown,
        description: 'Visión, estrategia y decisiones globales',
        phase: 1,                     // ← en qué fase se necesita
        headcount: '1 persona',       // ← cuántas personas típicamente
        priority: 'ESENCIAL',         // ← prioridad de contratación
        isHead: true,
      }
    ]
  },
  {
    id: 'piso-4',
    level: '4',
    label: 'GERENCIA',
    rooms: [
      {
        id: 'analytics',
        role: 'Director Financiero (CFO)',
        tool: 'Finanzas & CRM',
        icon: BarChart3,
        description: 'Reportes, presupuesto y relación con clientes',
        phase: 4,
        headcount: '1 persona',
        priority: 'AVANZADO',
      },
      {
        id: 'radar',
        role: 'Account Manager',
        tool: 'Radar de Tendencias',
        icon: Target,
        description: 'Seguimiento de tendencias y cuentas clave',
        phase: 3,
        headcount: '1–2 personas',
        priority: 'CRECIMIENTO',
      }
    ]
  },
  {
    id: 'piso-3',
    level: '3',
    label: 'CREATIVIDAD Y CONTENIDO',
    rooms: [
      {
        id: 'studio',
        role: 'Director Creativo',
        tool: 'Estudio Creativo',
        icon: Wand2,
        description: 'Diseño, imagen y producción visual',
        phase: 3,
        headcount: '1 persona',
        priority: 'CRECIMIENTO',
      },
      {
        id: 'scheduler',
        role: 'Content Strategist',
        tool: 'Planificador Omni',
        icon: Calendar,
        description: 'Planificación y calendario editorial',
        phase: 1,
        headcount: '1 persona',
        priority: 'ESENCIAL',
      },
      {
        id: 'prompts',
        role: 'Copywriter / Redactor',
        tool: 'Base de Prompts',
        icon: Terminal,
        description: 'Textos persuasivos, copies y guiones',
        phase: 2,
        headcount: '1–2 personas',
        priority: 'IMPORTANTE',
      },
      {
        id: 'email',
        role: 'Email Marketer',
        tool: 'Email & Funnels',
        icon: Mail,
        description: 'Automatizaciones y secuencias de venta',
        phase: 4,
        headcount: '1 persona',
        priority: 'AVANZADO',
      }
    ]
  },
  {
    id: 'piso-2',
    level: '2',
    label: 'PERFORMANCE Y TECNOLOGÍA',
    rooms: [
      {
        id: 'ads',
        role: 'Media Buyer',
        tool: 'Gestor de Ads',
        icon: Megaphone,
        description: 'Campañas pagas, ROAS y optimización',
        phase: 2,
        headcount: '1–2 personas',
        priority: 'IMPORTANTE',
      },
      {
        id: 'seo',
        role: 'SEO Specialist',
        tool: 'SEO Studio',
        icon: Search,
        description: 'Posicionamiento orgánico y auditorías web',
        phase: 3,
        headcount: '1 persona',
        priority: 'CRECIMIENTO',
      },
      {
        id: 'analytics',
        role: 'Data Analyst',
        tool: 'Analítica Web',
        icon: BarChart3,
        description: 'Métricas, KPIs y reportes de resultados',
        phase: 4,
        headcount: '1 persona',
        priority: 'AVANZADO',
      },
      {
        id: 'radar',
        role: 'Community Manager',
        tool: 'Radar de Tendencias',
        icon: Wifi,
        description: 'Redes sociales, tendencias y comunidad',
        phase: 1,
        headcount: '1–3 personas',
        priority: 'ESENCIAL',
      }
    ]
  },
  {
    id: 'piso-1',
    level: '1',
    label: 'COMERCIAL Y VENTAS',
    rooms: [
      {
        id: 'linkedin',
        role: 'Head of Sales',
        tool: 'Máquina B2B',
        icon: Users,
        description: 'Prospección, LinkedIn y cierre de clientes',
        phase: 3,
        headcount: '1–2 personas',
        priority: 'CRECIMIENTO',
      },
      {
        id: 'strategist',
        role: 'Consultor Estratégico',
        tool: 'Estratega IA',
        icon: Brain,
        description: 'Propuestas comerciales y presentaciones',
        phase: 2,
        headcount: '1 persona',
        priority: 'IMPORTANTE',
      }
    ]
  }
];

// Colores por prioridad
const PRIORITY_STYLE = {
  'ESENCIAL':    { bg: 'rgba(0,255,157,0.12)',  border: 'rgba(0,255,157,0.35)',  text: '#00ff9d',  dot: '#00ff9d' },
  'IMPORTANTE':  { bg: 'rgba(0,123,255,0.12)',  border: 'rgba(0,123,255,0.35)',  text: '#60a5fa',  dot: '#007bff' },
  'CRECIMIENTO': { bg: 'rgba(139,92,246,0.1)',  border: 'rgba(139,92,246,0.3)', text: '#a78bfa',  dot: '#8b5cf6' },
  'AVANZADO':    { bg: 'rgba(249,115,22,0.08)', border: 'rgba(249,115,22,0.25)', text: '#fb923c',  dot: '#f97316' },
};

// ══════════════════════════════════════════════════
// COMPONENTE PRINCIPAL
// ══════════════════════════════════════════════════
export default function AgencyFloorPlan({ onSelectTool }) {
  const [hoveredRoom, setHoveredRoom] = useState(null);
  const [activeRoom, setActiveRoom] = useState(null);
  const [showGuide, setShowGuide] = useState(false);
  const [activePhaseFilter, setActivePhaseFilter] = useState(null); // null = todos

  const handleClick = (toolId) => {
    setActiveRoom(toolId);
    setTimeout(() => onSelectTool(toolId), 120);
  };

  return (
    <div className="w-full max-w-5xl mx-auto pb-20 md:pb-0 space-y-4">

      {/* ══ GUÍA DE INICIO ══ */}
      <div className="rounded-2xl border border-white/8 overflow-hidden">
        <button
          onClick={() => setShowGuide(!showGuide)}
          className="w-full flex items-center justify-between px-5 py-4 hover:bg-white/3 transition-colors"
          style={{ background: 'rgba(255,255,255,0.015)' }}
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#00ff9d]/20 to-[#007bff]/20 border border-[#00ff9d]/20 flex items-center justify-center">
              <Rocket className="w-4 h-4 text-[#00ff9d]" />
            </div>
            <div className="text-left">
              <p className="text-white font-bold text-sm">Guía: ¿Cómo armar tu Agencia Digital?</p>
              <p className="text-gray-600 text-xs">Ver qué roles necesitas según tu fase de crecimiento</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] bg-[#00ff9d]/10 text-[#00ff9d] border border-[#00ff9d]/20 px-2 py-0.5 rounded-full font-bold">
              4 fases
            </span>
            <ChevronDown
              className="w-4 h-4 text-gray-500 transition-transform duration-200"
              style={{ transform: showGuide ? 'rotate(180deg)' : 'rotate(0deg)' }}
            />
          </div>
        </button>

        <AnimatePresence>
          {showGuide && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden border-t border-white/6"
            >
              <div className="p-5 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
                {STARTUP_GUIDE.map((phase) => {
                  const PhaseIcon = phase.icon;
                  const isActive = activePhaseFilter === phase.phase;
                  return (
                    <motion.button
                      key={phase.phase}
                      onClick={() => setActivePhaseFilter(isActive ? null : phase.phase)}
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      className="text-left rounded-xl border p-4 transition-all duration-200"
                      style={{
                        background: isActive ? `${phase.color}12` : 'rgba(255,255,255,0.02)',
                        borderColor: isActive ? `${phase.color}50` : 'rgba(255,255,255,0.07)',
                      }}
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                          style={{ background: `${phase.color}20`, border: `1px solid ${phase.color}40` }}>
                          <PhaseIcon className="w-3.5 h-3.5" style={{ color: phase.color }} />
                        </div>
                        <div>
                          <p className="text-[9px] font-black uppercase tracking-widest" style={{ color: phase.color }}>
                            Fase {phase.phase}
                          </p>
                          <p className="text-white font-bold text-xs">{phase.label}</p>
                        </div>
                      </div>
                      <p className="text-[10px] font-bold mb-1" style={{ color: `${phase.color}99` }}>
                        👥 {phase.team}
                      </p>
                      <p className="text-gray-500 text-[10px] mb-2 leading-tight">{phase.description}</p>
                      <ul className="space-y-1">
                        {phase.roles.map((r, i) => (
                          <li key={i} className="flex items-start gap-1.5 text-[10px]"
                            style={{ color: i === 0 && r.startsWith('+') ? `${phase.color}cc` : 'rgba(255,255,255,0.35)' }}>
                            <CheckCircle2 className="w-2.5 h-2.5 flex-shrink-0 mt-0.5" style={{ color: phase.color, opacity: 0.6 }} />
                            {r}
                          </li>
                        ))}
                      </ul>
                      <p className="text-[9px] mt-3 pt-2 border-t leading-tight"
                        style={{ borderColor: `${phase.color}20`, color: `${phase.color}66` }}>
                        💡 {phase.tip}
                      </p>
                      {isActive && (
                        <div className="mt-2 text-[9px] font-bold text-center py-1 rounded-lg"
                          style={{ background: `${phase.color}20`, color: phase.color }}>
                          ✓ Filtrando edificio por esta fase
                        </div>
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Leyenda de prioridades */}
      <div className="flex items-center gap-3 flex-wrap px-1">
        <span className="text-gray-700 text-[10px] font-bold uppercase tracking-wider">Prioridad de contratación:</span>
        {Object.entries(PRIORITY_STYLE).map(([key, val]) => (
          <button
            key={key}
            onClick={() => setActivePhaseFilter(key === 'ESENCIAL' ? 1 : key === 'IMPORTANTE' ? 2 : key === 'CRECIMIENTO' ? 3 : 4)}
            className="flex items-center gap-1.5"
          >
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: val.dot }} />
            <span className="text-[10px] font-bold" style={{ color: val.text }}>{key}</span>
          </button>
        ))}
        {activePhaseFilter && (
          <button onClick={() => setActivePhaseFilter(null)}
            className="text-[10px] text-gray-600 hover:text-gray-400 underline ml-2">
            Ver todos
          </button>
        )}
      </div>

      {/* ══ EDIFICIO ══ */}
      <div className="relative rounded-2xl overflow-hidden border border-white/8"
        style={{ background: 'linear-gradient(180deg, #0a0c12 0%, #090b11 100%)' }}>

        {/* AZOTEA */}
        <div className="relative px-5 py-4 border-b border-white/8 flex items-center gap-4"
          style={{ background: 'rgba(0,123,255,0.03)' }}>
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#007bff] to-[#00ff9d] flex items-center justify-center shadow-lg shadow-blue-500/20 flex-shrink-0">
            <Building2 className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1">
            <h2 className="text-white font-black text-sm tracking-tight">Predix Agency OS — Torre Corporativa</h2>
            <p className="text-gray-700 text-[10px] font-semibold uppercase tracking-widest">
              5 Pisos · Organigrama Funcional · {activePhaseFilter ? `Mostrando Fase ${activePhaseFilter}` : 'Todos los Roles'}
            </p>
          </div>
          <div className="hidden md:flex items-center gap-1 bg-black/30 border border-white/6 rounded-xl px-3 py-2">
            <span className="text-gray-700 text-[9px] font-bold mr-1.5 uppercase tracking-wider">Piso</span>
            {['PH', '4', '3', '2', '1'].map((label, i) => (
              <div key={i} className="w-6 h-6 rounded-md flex items-center justify-center text-[9px] font-black border"
                style={{
                  background: i === 0 ? 'rgba(0,123,255,0.15)' : 'rgba(255,255,255,0.03)',
                  borderColor: i === 0 ? 'rgba(0,123,255,0.4)' : 'rgba(255,255,255,0.06)',
                  color: i === 0 ? '#007bff' : 'rgba(255,255,255,0.25)',
                }}>
                {label}
              </div>
            ))}
          </div>
        </div>

        {/* PISOS */}
        {BUILDING.map((floor, floorIdx) => (
          <FloorLevel
            key={floor.id}
            floor={floor}
            floorIdx={floorIdx}
            totalFloors={BUILDING.length}
            hoveredRoom={hoveredRoom}
            activeRoom={activeRoom}
            activePhaseFilter={activePhaseFilter}
            onHoverRoom={setHoveredRoom}
            onClickRoom={handleClick}
          />
        ))}

        {/* LOBBY */}
        <div className="border-t border-white/6 px-5 py-3 flex items-center gap-3"
          style={{ background: 'rgba(255,255,255,0.008)' }}>
          <div className="flex gap-1 items-end flex-shrink-0">
            {[1, 2].map(i => (
              <div key={i} className="w-5 h-7 border border-white/8 rounded-t-md bg-white/2 flex items-end justify-center pb-1">
                <div className="w-1 h-1 rounded-full bg-white/15" />
              </div>
            ))}
          </div>
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-800">Planta Baja · Recepción</p>
          <div className="ml-auto flex gap-1.5">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="w-7 h-5 rounded-sm border border-white/5 bg-white/1" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════
// FILA DE PISO
// ══════════════════════════════════════════════════
function FloorLevel({ floor, floorIdx, activePhaseFilter, hoveredRoom, activeRoom, onHoverRoom, onClickRoom }) {
  const isPH = floor.id === 'penthouse';
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: floorIdx * 0.07, duration: 0.35 }}
      className="relative border-b border-white/5 last:border-b-0"
      style={{ background: isPH ? 'rgba(0,123,255,0.02)' : 'transparent' }}
    >
      <div className="flex">
        {/* Etiqueta lateral */}
        <div className="flex-shrink-0 w-[90px] md:w-[120px] border-r border-white/5 flex flex-col items-center justify-center py-4 px-2 gap-1">
          <div className="w-8 h-8 rounded-lg border flex items-center justify-center font-black text-xs mb-1"
            style={{
              borderColor: isPH ? 'rgba(0,123,255,0.4)' : 'rgba(255,255,255,0.07)',
              background: isPH ? 'rgba(0,123,255,0.12)' : 'rgba(255,255,255,0.02)',
              color: isPH ? '#007bff' : 'rgba(255,255,255,0.25)',
            }}>
            {floor.level}
          </div>
          <p className="text-[8px] font-black uppercase tracking-wider text-center leading-tight"
            style={{ color: isPH ? 'rgba(0,123,255,0.6)' : 'rgba(255,255,255,0.18)' }}>
            {floor.label}
          </p>
        </div>

        {/* Cuadrícula de oficinas */}
        <div className="flex-1 grid p-2.5 gap-2"
          style={{ gridTemplateColumns: `repeat(${Math.min(floor.rooms.length, 4)}, minmax(0, 1fr))` }}>
          {floor.rooms.map((room, roomIdx) => {
            const key = `${floor.id}-${roomIdx}`;
            const dimmed = activePhaseFilter !== null && room.phase !== activePhaseFilter;
            return (
              <OfficeWindow
                key={key}
                room={room}
                roomIdx={roomIdx}
                floorIdx={floorIdx}
                isPH={isPH}
                isHovered={hoveredRoom === key}
                isActive={activeRoom === room.id}
                isDimmed={dimmed}
                onHover={(on) => onHoverRoom(on ? key : null)}
                onClick={() => onClickRoom(room.id)}
              />
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}

// ══════════════════════════════════════════════════
// OFICINA
// ══════════════════════════════════════════════════
function OfficeWindow({ room, roomIdx, floorIdx, isPH, isHovered, isActive, isDimmed, onHover, onClick }) {
  const Icon = room.icon;
  const lit = (isHovered || isActive) && !isDimmed;
  const priorityStyle = PRIORITY_STYLE[room.priority] || PRIORITY_STYLE['AVANZADO'];

  return (
    <motion.button
      initial={{ opacity: 0 }}
      animate={{ opacity: isDimmed ? 0.2 : 1 }}
      transition={{ delay: floorIdx * 0.07 + roomIdx * 0.04, duration: 0.3 }}
      whileHover={!isDimmed ? { y: -2 } : {}}
      whileTap={!isDimmed ? { scale: 0.98 } : {}}
      onHoverStart={() => !isDimmed && onHover(true)}
      onHoverEnd={() => onHover(false)}
      onClick={!isDimmed ? onClick : undefined}
      className="relative text-left rounded-xl border transition-all duration-200 overflow-hidden"
      style={{
        padding: isPH ? '14px' : '10px',
        minHeight: isPH ? '90px' : '76px',
        background: lit
          ? isPH ? 'rgba(0,123,255,0.09)' : `${priorityStyle.bg}`
          : 'rgba(255,255,255,0.015)',
        borderColor: lit
          ? isPH ? 'rgba(0,123,255,0.5)' : priorityStyle.border
          : 'rgba(255,255,255,0.06)',
        cursor: isDimmed ? 'default' : 'pointer',
        boxShadow: lit ? `0 0 18px ${priorityStyle.dot}15` : 'none',
      }}
    >
      {/* Franja superior de luz */}
      <div className="absolute top-0 inset-x-0 h-px transition-all duration-200"
        style={{
          background: lit
            ? `linear-gradient(90deg, transparent, ${priorityStyle.dot}80, transparent)`
            : 'transparent'
        }} />

      {/* Dot de luz */}
      <div className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full transition-all duration-200"
        style={{
          background: lit ? priorityStyle.dot : 'rgba(255,255,255,0.07)',
          boxShadow: lit ? `0 0 5px ${priorityStyle.dot}` : 'none'
        }} />

      {/* Badge de prioridad / fase */}
      <div className="flex items-center gap-1.5 mb-2">
        <div className="w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0 transition-all duration-200"
          style={{
            background: lit ? `${priorityStyle.dot}20` : 'rgba(255,255,255,0.04)',
            border: `1px solid ${lit ? priorityStyle.dot + '40' : 'rgba(255,255,255,0.06)'}`,
          }}>
          <Icon className="w-3 h-3 transition-colors"
            style={{ color: lit ? priorityStyle.dot : 'rgba(255,255,255,0.2)' }} />
        </div>
        <span className="text-[8px] font-black px-1.5 py-0.5 rounded-full border leading-none"
          style={{
            background: `${priorityStyle.dot}12`,
            borderColor: `${priorityStyle.dot}30`,
            color: priorityStyle.text
          }}>
          {room.priority}
        </span>
        <span className="text-[8px] text-gray-700 ml-auto">F{room.phase}</span>
      </div>

      {/* Rol */}
      <p className="text-[9px] font-black uppercase tracking-wide mb-0.5 leading-tight transition-colors"
        style={{ color: lit ? priorityStyle.text : 'rgba(255,255,255,0.2)' }}>
        {room.role}
      </p>

      {/* Herramienta */}
      <p className="font-bold leading-tight transition-colors"
        style={{
          fontSize: isPH ? '12px' : '11px',
          color: lit ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.4)'
        }}>
        {room.tool}
      </p>

      {/* Headcount — solo en hover */}
      <AnimatePresence>
        {lit && (
          <motion.div
            initial={{ opacity: 0, y: 3 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-2 pt-1.5 border-t flex items-center gap-1"
            style={{ borderColor: `${priorityStyle.dot}25` }}
          >
            <User className="w-2.5 h-2.5 flex-shrink-0" style={{ color: priorityStyle.dot, opacity: 0.7 }} />
            <span className="text-[9px] font-bold" style={{ color: `${priorityStyle.dot}99` }}>
              {room.headcount}
            </span>
            <span className="text-[8px] text-gray-700 ml-1 leading-tight">{room.description}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Flecha */}
      <ArrowRight className="absolute bottom-2 right-2 w-3 h-3 transition-all duration-200"
        style={{
          color: priorityStyle.dot,
          opacity: lit ? 0.6 : 0,
          transform: lit ? 'translateX(0)' : 'translateX(-4px)',
        }} />
    </motion.button>
  );
}
