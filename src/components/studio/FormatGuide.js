import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Smartphone, Layout, MonitorPlay, FileVideo, Music } from 'lucide-react';

const FormatGuide = () => {
  const [activePlatform, setActivePlatform] = useState('instagram');

  const platforms = [
    { id: 'instagram', label: 'Instagram', icon: Smartphone, color: 'text-pink-500', bg: 'bg-pink-500/10 border-pink-500/30' },
    { id: 'tiktok', label: 'TikTok', icon: Music, color: 'text-cyan-400', bg: 'bg-cyan-400/10 border-cyan-400/30' },
    { id: 'linkedin', label: 'LinkedIn', icon: Layout, color: 'text-blue-500', bg: 'bg-blue-500/10 border-blue-500/30' },
    { id: 'youtube', label: 'YouTube', icon: MonitorPlay, color: 'text-red-500', bg: 'bg-red-500/10 border-red-500/30' }
  ];

  const guideData = {
    instagram: {
      formats: [
        { name: 'Reels', size: '1080 x 1920 px', ratio: '9:16', duration: 'Hasta 90s', safeZone: 'Evitar texto en 250px inferiores y laterales' },
        { name: 'Post Cuadrado', size: '1080 x 1080 px', ratio: '1:1', duration: 'N/A', safeZone: 'Contenido centrado' },
        { name: 'Post Vertical', size: '1080 x 1350 px', ratio: '4:5', duration: 'N/A', safeZone: 'Mejor formato estático' },
        { name: 'Stories', size: '1080 x 1920 px', ratio: '9:16', duration: 'Hasta 60s', safeZone: 'Dejar margen superior de 250px para el perfil' }
      ]
    },
    tiktok: {
      formats: [
        { name: 'Video Estándar', size: '1080 x 1920 px', ratio: '9:16', duration: 'Hasta 10m', safeZone: 'Evitar panel derecho (iconos) e inferior (descripción)' },
        { name: 'Carrusel de Fotos', size: '1080 x 1920 px', ratio: '9:16', duration: 'N/A', safeZone: 'Texto principal en el centro' }
      ]
    },
    linkedin: {
      formats: [
        { name: 'Post con Imagen', size: '1200 x 627 px', ratio: '1.91:1', duration: 'N/A', safeZone: 'Apto para desktop y mobile' },
        { name: 'Documento (PDF)', size: '1080 x 1350 px', ratio: '4:5', duration: 'N/A', safeZone: 'Excelente para Carruseles B2B' },
        { name: 'Video Nativo', size: '1920 x 1080 px (o 1:1)', ratio: '16:9 o 1:1', duration: 'Hasta 10m', safeZone: 'Incluir subtítulos' }
      ]
    },
    youtube: {
      formats: [
        { name: 'Video Largo', size: '1920 x 1080 px', ratio: '16:9', duration: 'Ilimitada', safeZone: 'Miniatura crucial (1280x720)' },
        { name: 'YouTube Shorts', size: '1080 x 1920 px', ratio: '9:16', duration: 'Hasta 60s', safeZone: 'Misma zona segura que TikTok' }
      ]
    }
  };

  const currentGuide = guideData[activePlatform];

  return (
    <div className="p-6 md:p-8">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-white mb-1">Guía Técnica de Formatos</h3>
        <p className="text-gray-400 text-sm">Especificaciones oficiales y Zonas Seguras para maximizar la calidad en cada red social.</p>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-4 mb-4">
        {platforms.map(p => (
          <button
            key={p.id}
            onClick={() => setActivePlatform(p.id)}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl border font-bold text-sm transition-all whitespace-nowrap flex-shrink-0 ${
              activePlatform === p.id ? p.bg + ' text-white' : 'bg-[#111318] border-white/10 text-gray-400 hover:text-white'
            }`}
          >
            <p.icon className={`w-4 h-4 ${activePlatform === p.id ? p.color : ''}`} /> {p.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {currentGuide.formats.map((format, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-[#1a1d24] border border-white/5 rounded-2xl p-5"
          >
            <div className="flex items-center gap-3 mb-4 border-b border-white/5 pb-3">
              <div className="p-2 bg-gray-800 rounded-lg">
                <FileVideo className="w-5 h-5 text-gray-300" />
              </div>
              <h4 className="text-lg font-bold text-white">{format.name}</h4>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center bg-[#111318] p-3 rounded-xl">
                <span className="text-xs text-gray-500 font-bold uppercase">Resolución (px)</span>
                <span className="text-sm font-semibold text-white">{format.size}</span>
              </div>
              <div className="flex justify-between items-center bg-[#111318] p-3 rounded-xl">
                <span className="text-xs text-gray-500 font-bold uppercase">Relación Aspecto</span>
                <span className="text-sm font-semibold text-[#00ff9d]">{format.ratio}</span>
              </div>
              <div className="flex justify-between items-center bg-[#111318] p-3 rounded-xl">
                <span className="text-xs text-gray-500 font-bold uppercase">Duración recomendada</span>
                <span className="text-sm font-semibold text-white">{format.duration}</span>
              </div>
              <div className="bg-orange-500/10 border border-orange-500/20 p-3 rounded-xl mt-2">
                <span className="block text-[10px] text-orange-400 font-bold uppercase mb-1">Zona Segura</span>
                <span className="text-xs text-orange-200/80">{format.safeZone}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default FormatGuide;
