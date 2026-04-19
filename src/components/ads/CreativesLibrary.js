import React, { useState } from 'react';
import { Image, Copy, CheckCircle2, Filter } from 'lucide-react';

const especificaciones = [
  {
    plataforma: 'Instagram',
    icon: '📷',
    color: 'from-pink-600 to-purple-600',
    colorText: 'text-pink-400',
    colorBg: 'bg-pink-500/10 border-pink-500/20',
    formatos: [
      { tipo: 'Feed - Imagen', ratio: '1:1', tamaño: '1080×1080', pesoMax: '30 MB', duracion: null, formato: 'JPG/PNG', consejo: 'El cuadrado es el más versátil. Usar fondos llamativos en el 20% superior.' },
      { tipo: 'Feed - Vertical', ratio: '4:5', tamaño: '1080×1350', pesoMax: '30 MB', duracion: null, formato: 'JPG/PNG', consejo: 'Ocupa más espacio en el feed. Ideal para marcas de moda y lifestyle.' },
      { tipo: 'Stories / Reels', ratio: '9:16', tamaño: '1080×1920', pesoMax: '30 MB', duracion: '3-90 seg', formato: 'MP4/MOV', consejo: 'Dejar 250px arriba y abajo sin texto importante (zona de interfaz).' },
      { tipo: 'Carrusel', ratio: '1:1 o 4:5', tamaño: '1080×1080', pesoMax: '30 MB', duracion: null, formato: 'JPG/PNG', consejo: 'Max 10 diapositivas. La primera debe generar curiosidad para hacer swipe.' },
    ]
  },
  {
    plataforma: 'TikTok',
    icon: '🎵',
    color: 'from-gray-700 to-gray-900',
    colorText: 'text-gray-200',
    colorBg: 'bg-gray-700/20 border-gray-600/20',
    formatos: [
      { tipo: 'In-Feed Ad', ratio: '9:16', tamaño: '1080×1920', pesoMax: '500 MB', duracion: '5-60 seg', formato: 'MP4/MOV', consejo: 'Los primeros 3 segundos son críticos. Usar audio original de tendencia.' },
      { tipo: 'TopView', ratio: '9:16', tamaño: '1080×1920', pesoMax: '500 MB', duracion: '5-60 seg', formato: 'MP4/MOV', consejo: 'Se muestra al abrir la app. Alta visibilidad. Ideal para grandes lanzamientos.' },
      { tipo: 'Spark Ads', ratio: 'Cualquiera', tamaño: 'Original del post', pesoMax: 'N/A', duracion: null, formato: 'Post orgánico', consejo: 'Potenciar posts orgánicos que ya funcionan. El más auténtico de todos.' },
      { tipo: 'Branded Hashtag', ratio: '9:16 logo', tamaño: '1080×1080', pesoMax: '100 MB', duracion: null, formato: 'PNG', consejo: 'Lanzar un challenge con hashtag de marca para viralidad masiva.' },
    ]
  },
  {
    plataforma: 'Google Ads',
    icon: '🔍',
    color: 'from-blue-600 to-sky-600',
    colorText: 'text-blue-400',
    colorBg: 'bg-blue-500/10 border-blue-500/20',
    formatos: [
      { tipo: 'Display - Rectángulo', ratio: '—', tamaño: '300×250', pesoMax: '150 KB', duracion: null, formato: 'JPG/PNG/GIF', consejo: 'El formato más usado en la red display. Colocación: sidebar y contenido.' },
      { tipo: 'Display - Leaderboard', ratio: '—', tamaño: '728×90', pesoMax: '150 KB', duracion: null, formato: 'JPG/PNG', consejo: 'Aparece en la parte superior de páginas web. Alta visibilidad.' },
      { tipo: 'Responsive Display', ratio: 'Múltiple', tamaño: 'Logo: 1200×1200 | Hero: 1200×628', pesoMax: '5 MB', duracion: null, formato: 'JPG/PNG', consejo: 'Google lo adapta automáticamente. Proporcionar imágenes en alta calidad.' },
      { tipo: 'YouTube - Bumper', ratio: '16:9', tamaño: '1280×720', pesoMax: '1 GB', duracion: '6 seg (no saltable)', formato: 'MP4', consejo: 'Solo 6 segundos. Ir al grano. Mostrar logo/CTA en los primeros 3 seg.' },
    ]
  },
  {
    plataforma: 'Facebook / Meta',
    icon: '📘',
    color: 'from-blue-700 to-blue-900',
    colorText: 'text-blue-300',
    colorBg: 'bg-blue-400/10 border-blue-400/20',
    formatos: [
      { tipo: 'Feed - Imagen', ratio: '1:1 o 1.91:1', tamaño: '1080×1080 o 1200×628', pesoMax: '30 MB', duracion: null, formato: 'JPG/PNG', consejo: 'Usar mínimo texto en la imagen. Facebook penaliza imágenes con mucho texto.' },
      { tipo: 'Stories', ratio: '9:16', tamaño: '1080×1920', pesoMax: '30 MB', duracion: '1-15 seg', formato: 'MP4/JPG', consejo: 'CTA claro visible. Usar plantillas verticales de Canva.' },
      { tipo: 'Carrusel', ratio: '1:1', tamaño: '1080×1080', pesoMax: '30 MB por imagen', duracion: null, formato: 'JPG/PNG', consejo: 'Contar una historia entre las tarjetas o mostrar diferentes productos.' },
      { tipo: 'Anuncio de Video', ratio: '16:9 o 1:1', tamaño: '1280×720 o 1080×1080', pesoMax: '4 GB', duracion: '1 seg - 241 min', formato: 'MP4/MOV', consejo: 'Subtítulos obligatorios (85% se ve sin sonido). Captar atención en 3 seg.' },
    ]
  },
  {
    plataforma: 'LinkedIn Ads',
    icon: '💼',
    color: 'from-sky-700 to-sky-900',
    colorText: 'text-sky-400',
    colorBg: 'bg-sky-500/10 border-sky-500/20',
    formatos: [
      { tipo: 'Sponsored Content - Imagen', ratio: '1.91:1', tamaño: '1200×627', pesoMax: '5 MB', duracion: null, formato: 'JPG/PNG', consejo: 'Audiencia profesional. Usar datos, estadísticas y casos de éxito.' },
      { tipo: 'Video Ad', ratio: '16:9 o 1:1', tamaño: '1280×720 mín', pesoMax: '200 MB', duracion: '3 seg - 30 min', formato: 'MP4', consejo: 'Tono profesional. Testimoniales B2B funcionan muy bien.' },
      { tipo: 'Message Ads (InMail)', ratio: 'Logo: 1:1', tamaño: '300×250 banner', pesoMax: '2 MB', duracion: null, formato: 'JPG/PNG', consejo: 'Personalizar con el nombre del destinatario. Máximo 500 caracteres en el cuerpo.' },
    ]
  },
];

const CreativesLibrary = () => {
  const [filtro, setFiltro] = useState('Instagram');
  const [copiado, setCopiado] = useState(null);

  const plataformaActual = especificaciones.find(p => p.plataforma === filtro);

  const copiar = (texto, id) => {
    navigator.clipboard.writeText(texto);
    setCopiado(id);
    setTimeout(() => setCopiado(null), 2000);
  };

  return (
    <div className="p-6 md:p-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h3 className="text-xl font-bold text-white mb-1">Biblioteca de Creativos</h3>
          <p className="text-gray-400 text-sm">Especificaciones técnicas exactas para cada plataforma. Nunca más publiques en el tamaño incorrecto.</p>
        </div>
      </div>

      {/* Selector de plataforma */}
      <div className="flex gap-2 overflow-x-auto pb-1 mb-6">
        {especificaciones.map(p => (
          <button key={p.plataforma} onClick={() => setFiltro(p.plataforma)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap flex-shrink-0 border ${
              filtro === p.plataforma ? `${p.colorBg} ${p.colorText}` : 'bg-[#1a1d24] border-white/5 text-gray-400 hover:text-white'
            }`}>
            <span>{p.icon}</span> {p.plataforma}
          </button>
        ))}
      </div>

      {plataformaActual && (
        <div className="space-y-4">
          <div className={`bg-gradient-to-r ${plataformaActual.color} rounded-xl p-4 flex items-center gap-3`}>
            <span className="text-3xl">{plataformaActual.icon}</span>
            <div>
              <h4 className="font-bold text-white">{plataformaActual.plataforma} — Especificaciones de Creativos</h4>
              <p className="text-white/70 text-xs">{plataformaActual.formatos.length} formatos disponibles</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {plataformaActual.formatos.map((f, i) => (
              <div key={i} className={`bg-[#1a1d24] rounded-2xl border p-5 hover:border-white/15 transition-colors ${plataformaActual.colorBg}`}>
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h5 className={`font-bold text-sm mb-0.5 ${plataformaActual.colorText}`}>{f.tipo}</h5>
                    <div className="text-xs text-gray-500">Relación: {f.ratio}</div>
                  </div>
                  <button
                    onClick={() => copiar(`${f.tipo}: ${f.tamaño} | ${f.formato} | Máx. ${f.pesoMax}${f.duracion ? ' | ' + f.duracion : ''}`, `${i}-${filtro}`)}
                    className="text-gray-500 hover:text-white transition-colors"
                    title="Copiar especificaciones"
                  >
                    {copiado === `${i}-${filtro}` ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2 mb-3">
                  {[
                    { label: 'Dimensiones', val: f.tamaño },
                    { label: 'Peso máximo', val: f.pesoMax },
                    { label: 'Formato', val: f.formato },
                    { label: 'Duración', val: f.duracion || 'Imagen estática' },
                  ].map((d, j) => (
                    <div key={j} className="bg-[#111318] rounded-lg px-3 py-2">
                      <div className="text-xs text-gray-500 mb-0.5">{d.label}</div>
                      <div className="text-xs font-bold text-white truncate">{d.val}</div>
                    </div>
                  ))}
                </div>
                <div className={`text-xs p-3 rounded-xl border ${plataformaActual.colorBg}`}>
                  💡 <span className="text-gray-300">{f.consejo}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CreativesLibrary;
