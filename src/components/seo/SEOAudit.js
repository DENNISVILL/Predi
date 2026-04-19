import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, AlertCircle, ChevronDown, ChevronUp, BarChart2 } from 'lucide-react';

const criterios = [
  {
    categoria: 'On-Page Básico',
    color: 'text-blue-400',
    bg: 'bg-blue-500/10 border-blue-500/20',
    items: [
      { id: 'title', label: 'Etiqueta Title optimizada (50-60 caracteres)', info: 'Debe incluir la keyword principal y ser única en cada página.' },
      { id: 'meta', label: 'Meta Description con CTA (150-160 caracteres)', info: 'Incluir keyword + propuesta de valor + llamado a la acción.' },
      { id: 'h1', label: 'H1 único con keyword principal', info: 'Solo debe existir un H1 por página, diferente al Title.' },
      { id: 'headings', label: 'Jerarquía de Headings (H2, H3) coherente', info: 'Usar H2 para secciones principales y H3 para subsecciones.' },
      { id: 'url', label: 'URLs cortas, amigables y con keyword', info: 'Usar guiones (-) en lugar de guiones bajos (_). Máximo 3-4 palabras.' },
      { id: 'canonical', label: 'Canonical tag correctamente configurado', info: 'Evitar contenido duplicado señalando la URL canónica.' },
    ]
  },
  {
    categoria: 'Contenido & Palabras Clave',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10 border-emerald-500/20',
    items: [
      { id: 'density', label: 'Densidad de keyword natural (1-2%)', info: 'No sobreoptimizar. Usar variaciones semánticas (LSI).' },
      { id: 'length', label: 'Longitud de contenido adecuada (+1000 palabras)', info: 'Artículos de blog: +1500 palabras. Páginas de servicio: +500 palabras.' },
      { id: 'fresh', label: 'Contenido actualizado y original', info: 'Google premia el contenido fresco. Actualizar artículos clave cada 6 meses.' },
      { id: 'featured', label: 'Contenido optimizado para Featured Snippets', info: 'Usar listas, tablas y respuestas directas al inicio del artículo.' },
      { id: 'eeat', label: 'E-E-A-T: Experiencia, Expertise, Autoridad, Confianza', info: 'Incluir autor, fuentes, fecha, testimonios y datos reales.' },
    ]
  },
  {
    categoria: 'Imágenes & Multimedia',
    color: 'text-yellow-400',
    bg: 'bg-yellow-500/10 border-yellow-500/20',
    items: [
      { id: 'alt', label: 'Atributo ALT descriptivo en todas las imágenes', info: 'Describir la imagen con naturalidad. Incluir keyword si es pertinente.' },
      { id: 'imgsize', label: 'Imágenes optimizadas (WebP, < 100KB)', info: 'Usar herramientas como Squoosh, TinyPNG o Cloudinary.' },
      { id: 'imgname', label: 'Nombre de archivo descriptivo (no img001.jpg)', info: 'Ej: zapatillas-running-nike-rosas.webp' },
      { id: 'lazzy', label: 'Lazy Loading implementado', info: 'Cargar imágenes solo cuando sean visibles en el viewport.' },
    ]
  },
  {
    categoria: 'SEO Técnico',
    color: 'text-purple-400',
    bg: 'bg-purple-500/10 border-purple-500/20',
    items: [
      { id: 'sitemap', label: 'Sitemap XML enviado a Google Search Console', info: 'Actualizar automáticamente al publicar nuevas páginas.' },
      { id: 'robots', label: 'Robots.txt configurado correctamente', info: 'Bloquear áreas de admin, evitar indexar páginas sin valor.' },
      { id: 'ssl', label: 'HTTPS activo en toda la web', info: 'Certificado SSL válido. Redirigir HTTP → HTTPS y www → sin www (o viceversa).' },
      { id: 'mobile', label: 'Web 100% responsive (Mobile-First)', info: 'Usar Google Mobile-Friendly Test para verificar.' },
      { id: 'pagespeed', label: 'Core Web Vitals en verde (LCP, FID, CLS)', info: 'LCP < 2.5s, FID < 100ms, CLS < 0.1. Verificar en PageSpeed Insights.' },
      { id: 'structured', label: 'Datos estructurados (Schema Markup)', info: 'Implementar JSON-LD para Organización, Artículo, Producto, FAQ, etc.' },
      { id: 'breadcrumbs', label: 'Breadcrumbs implementados y marcados', info: 'Mejoran la navegación y aparecen en los resultados de búsqueda.' },
      { id: 'hreflang', label: 'Hreflang configurado (si hay múltiples idiomas)', info: 'Indicar a Google qué versión mostrar según el idioma del usuario.' },
    ]
  },
  {
    categoria: 'Enlazado & Autoridad',
    color: 'text-pink-400',
    bg: 'bg-pink-500/10 border-pink-500/20',
    items: [
      { id: 'internal', label: 'Enlazado interno coherente y estratégico', info: 'Cada página importante debe recibir al menos 3-5 enlaces internos.' },
      { id: 'anchor', label: 'Anchor text descriptivo (no "haz clic aquí")', info: 'El texto ancla debe describir el contenido destino con keywords.' },
      { id: 'nofollow', label: 'Uso correcto de rel="nofollow" / "sponsored"', info: 'Aplicar nofollow a: comentarios de usuarios, afiliados, publicidad.' },
      { id: 'broken', label: 'Sin enlaces rotos (404)', info: 'Usar Screaming Frog o Ahrefs para detectar y corregir enlaces rotos.' },
      { id: 'backlinks', label: 'Perfil de backlinks saludable', info: 'Auditar con Ahrefs/SEMRush. Desautorizar links tóxicos con Disavow Tool.' },
    ]
  },
  {
    categoria: 'Local SEO (si aplica)',
    color: 'text-orange-400',
    bg: 'bg-orange-500/10 border-orange-500/20',
    items: [
      { id: 'gmb', label: 'Google Business Profile completo y verificado', info: 'Categorías, horarios, fotos, servicios, descripción, Q&A.' },
      { id: 'nap', label: 'NAP consistente (Nombre, Dirección, Teléfono)', info: 'Debe ser idéntico en web, GMB y todos los directorios.' },
      { id: 'reviews', label: 'Gestión activa de reseñas en Google', info: 'Responder todas las reseñas, positivas y negativas.' },
      { id: 'citations', label: 'Citaciones en directorios locales relevantes', info: 'Páginas Amarillas, Yelp, TripAdvisor según el sector.' },
    ]
  },
];

const SEOAudit = () => {
  const [checks, setChecks] = useState({});
  const [expandidos, setExpandidos] = useState({ 'On-Page Básico': true });

  const toggle = (id) => setChecks(prev => ({ ...prev, [id]: !prev[id] }));
  const toggleCat = (cat) => setExpandidos(prev => ({ ...prev, [cat]: !prev[cat] }));

  const totalItems = criterios.reduce((sum, c) => sum + c.items.length, 0);
  const completed = Object.values(checks).filter(Boolean).length;
  const pct = Math.round((completed / totalItems) * 100);

  const getScoreColor = () => {
    if (pct >= 80) return 'text-emerald-400';
    if (pct >= 50) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="p-6 md:p-8">
      {/* Score header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h3 className="text-xl font-bold text-white mb-1">Auditoría SEO Completa</h3>
          <p className="text-gray-400 text-sm">Marca cada punto que ya tienes implementado. La puntuación se actualiza en tiempo real.</p>
        </div>
        <div className="bg-[#1a1d24] border border-white/10 rounded-2xl p-5 text-center min-w-[160px]">
          <div className={`text-5xl font-black mb-1 ${getScoreColor()}`}>{pct}%</div>
          <div className="text-xs text-gray-500 mb-3">Puntuación SEO</div>
          <div className="w-full bg-gray-800 rounded-full h-2">
            <motion.div
              className={`h-2 rounded-full ${pct >= 80 ? 'bg-emerald-500' : pct >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`}
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <div className="text-xs text-gray-600 mt-2">{completed}/{totalItems} criterios</div>
        </div>
      </div>

      {/* Progress bars por categoría */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-8">
        {criterios.map(cat => {
          const catDone = cat.items.filter(i => checks[i.id]).length;
          const catPct = Math.round((catDone / cat.items.length) * 100);
          return (
            <div key={cat.categoria} className={`p-3 rounded-xl border ${cat.bg}`}>
              <div className={`text-xs font-bold ${cat.color} mb-1 truncate`}>{cat.categoria}</div>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-gray-800 rounded-full h-1.5">
                  <div className="h-1.5 rounded-full bg-current transition-all" style={{ width: `${catPct}%`, color: 'inherit' }} />
                </div>
                <span className={`text-xs font-bold ${cat.color}`}>{catPct}%</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Checklist */}
      <div className="space-y-3">
        {criterios.map(cat => (
          <div key={cat.categoria} className={`rounded-2xl border ${cat.bg} overflow-hidden`}>
            <button
              onClick={() => toggleCat(cat.categoria)}
              className="w-full flex items-center justify-between px-5 py-4 hover:bg-white/[0.02] transition-colors"
            >
              <div className="flex items-center gap-3">
                <BarChart2 className={`w-4 h-4 ${cat.color}`} />
                <span className={`font-bold text-sm ${cat.color}`}>{cat.categoria}</span>
                <span className="text-xs text-gray-500">
                  ({cat.items.filter(i => checks[i.id]).length}/{cat.items.length})
                </span>
              </div>
              {expandidos[cat.categoria] ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
            </button>
            {expandidos[cat.categoria] && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                className="px-5 pb-5 space-y-2"
              >
                {cat.items.map(item => (
                  <div
                    key={item.id}
                    onClick={() => toggle(item.id)}
                    className={`flex items-start gap-3 p-3 rounded-xl cursor-pointer transition-all border ${
                      checks[item.id]
                        ? 'bg-emerald-500/10 border-emerald-500/30'
                        : 'bg-[#111318] border-white/5 hover:border-white/10'
                    }`}
                  >
                    <div className={`flex-shrink-0 mt-0.5 ${checks[item.id] ? 'text-emerald-400' : 'text-gray-600'}`}>
                      {checks[item.id] ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium ${checks[item.id] ? 'text-white line-through opacity-60' : 'text-gray-200'}`}>
                        {item.label}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{item.info}</p>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </div>
        ))}
      </div>

      {pct === 100 && (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          className="mt-6 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/40 rounded-2xl p-5 text-center">
          <div className="text-3xl mb-2">🏆</div>
          <h4 className="font-black text-white text-lg">¡SEO Perfecto al 100%!</h4>
          <p className="text-emerald-300 text-sm mt-1">Tu sitio está completamente optimizado para los motores de búsqueda.</p>
        </motion.div>
      )}
    </div>
  );
};

export default SEOAudit;
