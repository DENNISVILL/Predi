import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Copy, CheckCircle2, Search, Filter, Sparkles, TrendingUp } from 'lucide-react';

const promptCategories = [
  { id: 'all', label: 'Todos los Prompts' },
  { id: 'seo', label: 'SEO & Copywriting' },
  { id: 'ads', label: 'Anuncios & Media Buying' },
  { id: 'social', label: 'Redes Sociales' },
  { id: 'strategy', label: 'Estrategia & Negocios' },
  { id: 'email', label: 'Email Marketing' },
];

const promptsDB = [
  {
    id: 1,
    categoria: 'seo',
    titulo: 'Auditoría SEO Integral',
    descripcion: 'Genera un plan de auditoría técnica y de contenido para una web específica.',
    prompt: `Actúa como un Consultor SEO Senior con más de 10 años de experiencia. Necesito que realices una auditoría SEO inicial para mi sitio web: [URL_DEL_SITIO]. 
Tu análisis debe incluir:
1. Arquitectura del sitio y estructura de URLs (mejores prácticas).
2. Estrategia de palabras clave principales para el nicho de [NICHO].
3. 5 recomendaciones técnicas (velocidad, mobile-first, schema markup).
4. Un plan de contenido a 3 meses para mejorar la autoridad de dominio (Topical Authority).
Presenta la información en un formato claro, utilizando tablas y viñetas.`,
    tags: ['Auditoría', 'Técnico', 'Plan de Acción']
  },
  {
    id: 2,
    categoria: 'social',
    titulo: 'Calendario de Contenidos a 30 Días',
    descripcion: 'Crea una matriz de contenidos mensual enfocada en los 4 pilares.',
    prompt: `Actúa como un Social Media Manager experto. Crea un calendario de contenidos de 30 días para una marca de [TIPO_DE_MARCA/INDUSTRIA].
El objetivo principal es [OBJETIVO: Vender/Crear Comunidad/Autoridad].
El calendario debe seguir los 4 pilares de contenido: Educar, Entretener, Inspirar, y Vender (proporción 40/20/20/20).
Para cada día, proporciona:
- Pilar de contenido.
- Formato (Reel, Carrusel, Historia, Tweet).
- Título o gancho (Hook).
- Breve descripción del concepto visual.
Entrégalo en formato de tabla de lunes a domingo.`,
    tags: ['Calendario', 'Redes Sociales', 'Planificación']
  },
  {
    id: 3,
    categoria: 'ads',
    titulo: 'Estructura de Campaña Meta Ads',
    descripcion: 'Diseña la arquitectura de una campaña publicitaria en Facebook/Instagram.',
    prompt: `Actúa como un Media Buyer especializado en Meta Ads. Diseña una estructura de campaña completa para [PRODUCTO/SERVICIO] con un presupuesto de [PRESUPUESTO_MENSUAL].
Incluye:
1. Etapa TOFU (Top of Funnel): Audiencias, formatos y 3 ángulos creativos.
2. Etapa MOFU (Middle of Funnel): Audiencias de retargeting y 2 ángulos para romper objeciones.
3. Etapa BOFU (Bottom of Funnel): Audiencia hiper-segmentada y 1 ángulo con oferta irresistible.
Detalla cómo distribuir el presupuesto entre estas 3 etapas.`,
    tags: ['Meta Ads', 'Estrategia', 'Presupuesto']
  },
  {
    id: 4,
    categoria: 'copywriting',
    titulo: 'Framework PAS (Problema, Agitación, Solución)',
    descripcion: 'Redacta una página de ventas o landing page persuasiva.',
    prompt: `Usa el framework de copywriting PAS (Problema, Agitación, Solución) para escribir el texto de una landing page que vende [PRODUCTO/SERVICIO].
Audiencia objetivo: [DESCRIBE_A_TU_CLIENTE_IDEAL].
Paso 1: Identifica el mayor problema que tiene mi audiencia de forma dolorosamente precisa.
Paso 2: Agita ese problema mostrando qué pasará si no lo resuelven hoy y cómo afecta su vida/negocio.
Paso 3: Presenta mi producto como la única solución lógica y fácil, detallando 3 beneficios clave.
Incluye un Call to Action (CTA) fuerte al final.`,
    tags: ['Copywriting', 'Ventas', 'Landing Page']
  },
  {
    id: 5,
    categoria: 'email',
    titulo: 'Secuencia de Carrito Abandonado',
    descripcion: 'Recupera ventas perdidas con una secuencia de 3 correos.',
    prompt: `Escribe una secuencia de 3 correos electrónicos para recuperar carritos abandonados de una tienda de [TIPO_DE_TIENDA/PRODUCTO].
Correo 1 (1 hora después): Recordatorio amigable de que dejaron algo. Tono de servicio al cliente.
Correo 2 (24 horas después): Resolución de objeciones. Por qué el producto vale la pena y testimonios cortos.
Correo 3 (48 horas después): Urgencia. Ofrece un descuento temporal del [X]% que expira en 24 horas.
Incluye líneas de asunto (subject lines) creativas y de alta apertura para cada correo.`,
    tags: ['Email', 'E-commerce', 'Retención']
  },
  {
    id: 6,
    categoria: 'strategy',
    titulo: 'Definición de Buyer Persona Profundo',
    descripcion: 'Crea el perfil psicológico y demográfico de tu cliente ideal.',
    prompt: `Actúa como un investigador de mercado y estratega de marca. Desarrolla un perfil de "Buyer Persona" extremadamente detallado para un negocio que vende [TU_PRODUCTO/SERVICIO].
Quiero que incluyas:
1. Datos demográficos básicos (Edad, ubicación, ingresos, ocupación).
2. Psicografía (Valores, creencias, intereses).
3. Puntos de dolor: ¿Cuáles son las 3 cosas que no lo dejan dormir por la noche respecto a [NICHO]?
4. Deseos profundos: ¿Cómo se vería su vida ideal si resolviera este problema?
5. Objeciones de compra: ¿Por qué NO compraría mi producto?
6. Fuentes de información: ¿A quién sigue en redes, qué lee, dónde pasa el tiempo online?`,
    tags: ['Estrategia', 'Buyer Persona', 'Investigación']
  }
];

const PromptsLibraryModule = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiado, setCopiado] = useState(null);

  const copiar = (texto, id) => {
    navigator.clipboard.writeText(texto);
    setCopiado(id);
    setTimeout(() => setCopiado(null), 2000);
  };

  const filteredPrompts = promptsDB.filter(p => {
    const matchesCategory = activeCategory === 'all' || p.categoria === activeCategory || p.categoria === 'copywriting' && activeCategory === 'seo';
    const matchesSearch = p.titulo.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.descripcion.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="w-full flex flex-col gap-4 pb-20 md:pb-0">
      {/* Banner */}
      <div className="bg-gradient-to-r from-zinc-900 to-black border border-zinc-800 rounded-2xl px-6 py-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-zinc-800/40 rounded-full blur-[100px] pointer-events-none" />
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-zinc-800 border border-zinc-700 rounded-full mb-3">
              <Sparkles className="w-3.5 h-3.5 text-zinc-300" />
              <span className="text-xs font-semibold text-zinc-300">Base de Conocimiento</span>
            </div>
            <h2 className="text-3xl font-bold text-white flex items-center gap-3">
              <Terminal className="w-8 h-8 text-white" /> 10K+ Prompts IA
            </h2>
            <p className="text-zinc-400 text-sm mt-2 max-w-2xl">
              La biblioteca definitiva de prompts avanzados de marketing, extraída de 448 playbooks y recursos profesionales. Copia, pega y domina ChatGPT, Claude o Gemini.
            </p>
          </div>
          <div className="flex gap-3 flex-shrink-0">
            <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl px-5 py-3 text-center">
              <div className="text-2xl font-black text-white">10,000+</div>
              <div className="text-xs text-zinc-500">Prompts en DB</div>
            </div>
          </div>
        </div>
      </div>

      {/* Buscador y Filtros */}
      <div className="bg-[#0e1117] rounded-2xl border border-white/5 p-4 md:p-6 mb-2">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input 
              type="text" 
              placeholder="Buscar por palabra clave, objetivo o formato..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#1a1d24] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white text-sm focus:outline-none focus:border-zinc-500 transition-colors"
            />
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 hide-scrollbar flex-shrink-0">
            <Filter className="w-4 h-4 text-gray-500 mr-2 flex-shrink-0" />
            {promptCategories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all border ${
                  activeCategory === cat.id 
                    ? 'bg-white text-black border-white' 
                    : 'bg-[#1a1d24] text-gray-400 border-white/5 hover:text-white hover:bg-zinc-800'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid de Prompts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <AnimatePresence>
          {filteredPrompts.map(p => (
            <motion.div 
              key={p.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="bg-[#1a1d24] rounded-2xl border border-white/5 overflow-hidden hover:border-white/20 transition-colors flex flex-col"
            >
              <div className="p-5 border-b border-white/5 bg-[#111318]">
                <div className="flex justify-between items-start gap-4 mb-2">
                  <h3 className="font-bold text-white text-lg leading-tight">{p.titulo}</h3>
                  <button 
                    onClick={() => copiar(p.prompt, p.id)}
                    className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors flex-shrink-0"
                    title="Copiar Prompt"
                  >
                    {copiado === p.id ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-xs text-gray-400 mb-3">{p.descripcion}</p>
                <div className="flex flex-wrap gap-2">
                  {p.tags.map(tag => (
                    <span key={tag} className="text-[10px] uppercase font-bold tracking-wider px-2 py-1 bg-zinc-800 text-zinc-300 rounded-md">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="p-5 flex-1 bg-[#0e1117] relative group">
                <div className="absolute top-2 right-4 text-[10px] text-gray-600 font-mono">PROMPT</div>
                <pre className="text-sm text-gray-300 whitespace-pre-wrap font-sans leading-relaxed">
                  {p.prompt}
                </pre>
                
                <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-[#0e1117] via-[#0e1117]/80 to-transparent flex justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => copiar(p.prompt, p.id)}
                    className="bg-white text-black text-sm font-bold px-6 py-2 rounded-xl shadow-lg flex items-center gap-2 transform translate-y-2 group-hover:translate-y-0 transition-all"
                  >
                    {copiado === p.id ? <><CheckCircle2 className="w-4 h-4" /> Copiado</> : <><Copy className="w-4 h-4" /> Copiar para usar</>}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {filteredPrompts.length === 0 && (
          <div className="col-span-full py-20 text-center">
            <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-6 h-6 text-zinc-500" />
            </div>
            <h3 className="text-white font-bold mb-1">No se encontraron prompts</h3>
            <p className="text-gray-500 text-sm">Prueba con otros términos de búsqueda o cambia la categoría.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PromptsLibraryModule;
