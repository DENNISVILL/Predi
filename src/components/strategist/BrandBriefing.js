import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Target, Users, Palette, MessageSquare, Save, Edit3, CheckCircle2 } from 'lucide-react';

const BrandBriefing = () => {
  const [isEditing, setIsEditing] = useState(true);
  const [formData, setFormData] = useState({
    brandName: '',
    industry: '',
    targetAudience: '',
    painPoints: '',
    objections: '',
    brandVoice: 'Profesional y Cercano',
    primaryColor: '#007bff',
    competitors: '',
    awarenessLevel: 'problem_aware' // Niveles de consciencia
  });

  const handleSave = () => setIsEditing(false);

  return (
    <div className="p-6 md:p-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h3 className="text-xl font-bold text-white mb-1">Perfil de Marca</h3>
          <p className="text-gray-400 text-sm">Define la identidad de tu marca para que la IA genere contenido 100% alineado a tu visión.</p>
        </div>
        <button
          onClick={() => isEditing ? handleSave() : setIsEditing(true)}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold transition-all text-sm flex-shrink-0 ${
            isEditing ? 'bg-[#00ff9d] text-black hover:bg-[#00cc7a]' : 'bg-gray-800 text-white hover:bg-gray-700'
          }`}
        >
          {isEditing ? <><Save className="w-4 h-4" /> Guardar Perfil</> : <><Edit3 className="w-4 h-4" /> Editar</>}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Identidad Core */}
        <div className="bg-[#1a1d24] p-6 rounded-2xl border border-white/5 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-5 h-5 text-blue-400" />
            <h4 className="font-bold text-white">Identidad Core</h4>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wide">Nombre de la Marca</label>
            <input
              type="text" disabled={!isEditing} value={formData.brandName}
              onChange={e => setFormData({...formData, brandName: e.target.value})}
              placeholder="Ej: Predix Tech"
              className="w-full bg-[#111318] border border-gray-700/80 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-blue-500 transition-colors disabled:opacity-50"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wide">Industria / Nicho</label>
            <input
              type="text" disabled={!isEditing} value={formData.industry}
              onChange={e => setFormData({...formData, industry: e.target.value})}
              placeholder="Ej: Tecnología B2B"
              className="w-full bg-[#111318] border border-gray-700/80 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-blue-500 transition-colors disabled:opacity-50"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wide">Competidores Principales</label>
            <textarea
              disabled={!isEditing} value={formData.competitors}
              onChange={e => setFormData({...formData, competitors: e.target.value})}
              placeholder="Marcas de las que quieres diferenciarte..."
              rows="3"
              className="w-full bg-[#111318] border border-gray-700/80 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-blue-500 transition-colors disabled:opacity-50 resize-none"
            />
          </div>
        </div>

        {/* Audiencia y Tono */}
        <div className="bg-[#1a1d24] p-6 rounded-2xl border border-white/5 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-5 h-5 text-pink-400" />
            <h4 className="font-bold text-white">Audiencia & Psicografía</h4>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wide">Público Objetivo (Demografía)</label>
            <input
              type="text" disabled={!isEditing} value={formData.targetAudience}
              onChange={e => setFormData({...formData, targetAudience: e.target.value})}
              placeholder="Ej: Mujeres 25-45 años, ingresos medios-altos..."
              className="w-full bg-[#111318] border border-gray-700/80 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-pink-500 transition-colors disabled:opacity-50"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wide">Puntos de Dolor (Pain Points)</label>
            <textarea
              disabled={!isEditing} value={formData.painPoints}
              onChange={e => setFormData({...formData, painPoints: e.target.value})}
              placeholder="¿Qué problema urgente no lo deja dormir?"
              rows="2"
              className="w-full bg-[#111318] border border-gray-700/80 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-pink-500 transition-colors disabled:opacity-50 resize-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wide">Principales Objeciones</label>
            <textarea
              disabled={!isEditing} value={formData.objections}
              onChange={e => setFormData({...formData, objections: e.target.value})}
              placeholder="¿Por qué no compraría tu producto hoy?"
              rows="2"
              className="w-full bg-[#111318] border border-gray-700/80 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-pink-500 transition-colors disabled:opacity-50 resize-none"
            />
          </div>
          
          <div className="pt-2 border-t border-white/5">
            <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wide flex items-center gap-1">
              <Target className="w-3 h-3 text-yellow-400" /> Nivel de Consciencia (Eugene Schwartz)
            </label>
            <select
              disabled={!isEditing} value={formData.awarenessLevel}
              onChange={e => setFormData({...formData, awarenessLevel: e.target.value})}
              className="w-full bg-[#111318] border border-gray-700/80 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-yellow-500 transition-colors disabled:opacity-50"
            >
              <option value="unaware">1. Completamente Inconsciente (No sabe que tiene un problema)</option>
              <option value="problem_aware">2. Consciente del Problema (Sabe el problema, no la solución)</option>
              <option value="solution_aware">3. Consciente de la Solución (Conoce soluciones, no la tuya)</option>
              <option value="product_aware">4. Consciente del Producto (Conoce tu producto, no está seguro)</option>
              <option value="most_aware">5. Muy Consciente (Listo para comprar, busca la oferta)</option>
            </select>
          </div>

          <div className="pt-2 border-t border-white/5 flex gap-4">
            <div className="flex-1">
              <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wide flex items-center gap-1">
                <MessageSquare className="w-3 h-3" /> Tono
              </label>
              <select
                disabled={!isEditing} value={formData.brandVoice}
                onChange={e => setFormData({...formData, brandVoice: e.target.value})}
                className="w-full bg-[#111318] border border-gray-700/80 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-pink-500 transition-colors disabled:opacity-50"
              >
                <option>Profesional</option>
                <option>Divertido</option>
                <option>Elegante</option>
                <option>Educativo</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wide flex items-center gap-1">
                <Palette className="w-3 h-3" /> Color
              </label>
              <input
                type="color" disabled={!isEditing} value={formData.primaryColor}
                onChange={e => setFormData({...formData, primaryColor: e.target.value})}
                className="h-11 w-full bg-transparent rounded-xl cursor-pointer disabled:opacity-50 border border-gray-700 p-1"
              />
            </div>
          </div>
        </div>
      </div>

      {!isEditing && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 bg-gradient-to-r from-[#00ff9d]/10 to-transparent border border-[#00ff9d]/30 rounded-xl p-4 flex items-center gap-3"
        >
          <CheckCircle2 className="w-6 h-6 text-[#00ff9d] flex-shrink-0" />
          <div>
            <h5 className="font-bold text-[#00ff9d] text-sm">Perfil sincronizado con la IA ✓</h5>
            <p className="text-xs text-green-100/70 mt-0.5">Todo el contenido generado en el Estudio Creativo usará este tono, audiencia y colores.</p>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default BrandBriefing;
