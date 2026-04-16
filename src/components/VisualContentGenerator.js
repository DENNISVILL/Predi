import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Image, 
  Palette, 
  Wand2, 
  Download, 
  Share2, 
  Copy, 
  RefreshCw,
  Sparkles,
  Zap,
  Target,
  Eye,
  Heart,
  MessageSquare,
  TrendingUp,
  Settings,
  Filter,
  Grid3X3,
  Square,
  Circle,
  Triangle,
  Type,
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Italic,
  Underline,
  Plus,
  Minus,
  RotateCcw,
  RotateCw,
  Move,
  Crop,
  Layers,
  Paintbrush,
  Eraser,
  Dropper,
  Save,
  Upload,
  X,
  Maximize2,
  Play,
  Pause,
  Volume2,
  Camera,
  Video,
  Mic,
  Music,
  Hash,
  AtSign,
  MapPin,
  Clock,
  Users,
  Globe,
  Smartphone,
  Monitor,
  Tablet
} from 'lucide-react';

const VisualContentGenerator = () => {
  const [activeTab, setActiveTab] = useState('generate'); // generate, edit, templates, analytics
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [generationPrompt, setGenerationPrompt] = useState('');
  const [selectedNiche, setSelectedNiche] = useState('fitness');
  const [selectedPlatform, setSelectedPlatform] = useState('instagram');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [editMode, setEditMode] = useState('none'); // none, text, filter, crop, draw
  const [canvasElements, setCanvasElements] = useState([]);
  
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

  // Templates por nicho y plataforma
  const templates = {
    fitness: {
      instagram: [
        { id: 1, name: 'Workout Motivation', preview: '/templates/fitness-workout.jpg', style: 'energetic' },
        { id: 2, name: 'Before/After', preview: '/templates/fitness-transformation.jpg', style: 'inspiring' },
        { id: 3, name: 'Exercise Tutorial', preview: '/templates/fitness-tutorial.jpg', style: 'educational' },
        { id: 4, name: 'Nutrition Tips', preview: '/templates/fitness-nutrition.jpg', style: 'clean' }
      ],
      tiktok: [
        { id: 5, name: 'Quick Workout', preview: '/templates/fitness-quick.jpg', style: 'dynamic' },
        { id: 6, name: 'Gym Fails', preview: '/templates/fitness-fails.jpg', style: 'funny' },
        { id: 7, name: 'Form Check', preview: '/templates/fitness-form.jpg', style: 'educational' }
      ]
    },
    food: {
      instagram: [
        { id: 8, name: 'Recipe Steps', preview: '/templates/food-recipe.jpg', style: 'clean' },
        { id: 9, name: 'Food Flat Lay', preview: '/templates/food-flatlay.jpg', style: 'aesthetic' },
        { id: 10, name: 'Cooking Process', preview: '/templates/food-process.jpg', style: 'warm' }
      ],
      tiktok: [
        { id: 11, name: 'Quick Recipe', preview: '/templates/food-quick.jpg', style: 'fast' },
        { id: 12, name: 'Food Hack', preview: '/templates/food-hack.jpg', style: 'surprising' }
      ]
    },
    fashion: {
      instagram: [
        { id: 13, name: 'OOTD Grid', preview: '/templates/fashion-ootd.jpg', style: 'stylish' },
        { id: 14, name: 'Style Guide', preview: '/templates/fashion-guide.jpg', style: 'elegant' },
        { id: 15, name: 'Trend Alert', preview: '/templates/fashion-trend.jpg', style: 'modern' }
      ],
      tiktok: [
        { id: 16, name: 'Outfit Transition', preview: '/templates/fashion-transition.jpg', style: 'dynamic' },
        { id: 17, name: 'Style Challenge', preview: '/templates/fashion-challenge.jpg', style: 'fun' }
      ]
    }
  };

  // Estilos visuales por nicho
  const nicheStyles = {
    fitness: {
      colors: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'],
      fonts: ['Montserrat', 'Roboto', 'Open Sans'],
      mood: 'energetic',
      elements: ['dumbbells', 'running', 'strength', 'motivation']
    },
    food: {
      colors: ['#FD79A8', '#FDCB6E', '#6C5CE7', '#A29BFE', '#FD79A8'],
      fonts: ['Playfair Display', 'Lora', 'Crimson Text'],
      mood: 'appetizing',
      elements: ['ingredients', 'cooking', 'delicious', 'homemade']
    },
    fashion: {
      colors: ['#2D3436', '#636E72', '#DDA0DD', '#FFB6C1', '#F8F8FF'],
      fonts: ['Didot', 'Futura', 'Helvetica Neue'],
      mood: 'elegant',
      elements: ['style', 'trendy', 'chic', 'fashionable']
    },
    tech: {
      colors: ['#0984E3', '#6C5CE7', '#00B894', '#FDCB6E', '#E17055'],
      fonts: ['SF Pro', 'Roboto', 'Inter'],
      mood: 'modern',
      elements: ['innovation', 'digital', 'future', 'smart']
    }
  };

  // Prompts de generación inteligente
  const generateSmartPrompt = () => {
    const niche = nicheStyles[selectedNiche];
    const platform = selectedPlatform;
    const style = niche.mood;
    const colors = niche.colors.slice(0, 3).join(', ');
    const elements = niche.elements.join(', ');

    const basePrompts = {
      instagram: `Create a ${style} ${selectedNiche} post for Instagram. Use ${colors} color palette. Include ${elements}. High quality, professional photography style, clean composition, good lighting.`,
      tiktok: `Design a dynamic ${selectedNiche} visual for TikTok. ${style} mood with ${colors} colors. Include ${elements}. Vertical format, eye-catching, mobile-optimized.`,
      youtube: `Generate a ${selectedNiche} YouTube thumbnail. ${style} style with ${colors} palette. Include ${elements}. Bold text overlay space, high contrast, clickable design.`
    };

    return basePrompts[platform] || basePrompts.instagram;
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    
    // Simular generación de imágenes con IA
    setTimeout(() => {
      const newImages = [
        {
          id: Date.now() + 1,
          url: `/generated/image-${Date.now()}-1.jpg`,
          prompt: generationPrompt || generateSmartPrompt(),
          niche: selectedNiche,
          platform: selectedPlatform,
          style: nicheStyles[selectedNiche].mood,
          viralScore: Math.floor(Math.random() * 30) + 70,
          estimatedReach: Math.floor(Math.random() * 50000) + 10000,
          colors: nicheStyles[selectedNiche].colors.slice(0, 3),
          timestamp: new Date()
        },
        {
          id: Date.now() + 2,
          url: `/generated/image-${Date.now()}-2.jpg`,
          prompt: generationPrompt || generateSmartPrompt(),
          niche: selectedNiche,
          platform: selectedPlatform,
          style: nicheStyles[selectedNiche].mood,
          viralScore: Math.floor(Math.random() * 30) + 70,
          estimatedReach: Math.floor(Math.random() * 50000) + 10000,
          colors: nicheStyles[selectedNiche].colors.slice(0, 3),
          timestamp: new Date()
        },
        {
          id: Date.now() + 3,
          url: `/generated/image-${Date.now()}-3.jpg`,
          prompt: generationPrompt || generateSmartPrompt(),
          niche: selectedNiche,
          platform: selectedPlatform,
          style: nicheStyles[selectedNiche].mood,
          viralScore: Math.floor(Math.random() * 30) + 70,
          estimatedReach: Math.floor(Math.random() * 50000) + 10000,
          colors: nicheStyles[selectedNiche].colors.slice(0, 3),
          timestamp: new Date()
        }
      ];
      
      setGeneratedImages(prev => [...newImages, ...prev]);
      setIsGenerating(false);
    }, 3000);
  };

  const platforms = [
    { id: 'instagram', name: 'Instagram', icon: '📸', format: '1:1', size: '1080x1080' },
    { id: 'tiktok', name: 'TikTok', icon: '🎵', format: '9:16', size: '1080x1920' },
    { id: 'youtube', name: 'YouTube', icon: '📺', format: '16:9', size: '1280x720' },
    { id: 'facebook', name: 'Facebook', icon: '👥', format: '1.91:1', size: '1200x630' }
  ];

  const niches = [
    { id: 'fitness', name: 'Fitness', icon: '💪' },
    { id: 'food', name: 'Food', icon: '🍳' },
    { id: 'fashion', name: 'Fashion', icon: '👗' },
    { id: 'tech', name: 'Tech', icon: '📱' },
    { id: 'lifestyle', name: 'Lifestyle', icon: '✨' },
    { id: 'travel', name: 'Travel', icon: '✈️' }
  ];

  const tabs = [
    { id: 'generate', name: 'Generar', icon: Wand2 },
    { id: 'edit', name: 'Editar', icon: Palette },
    { id: 'templates', name: 'Templates', icon: Grid3X3 },
    { id: 'analytics', name: 'Analytics', icon: TrendingUp }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Visual Content Generator</h2>
          <p className="text-gray-400">Crea contenido visual impactante con IA</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
          >
            <Upload className="w-4 h-4" />
            Subir Imagen
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              // Manejar subida de imagen
            }}
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-gray-800 rounded-lg p-1">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors flex-1 justify-center ${
              activeTab === tab.id
                ? 'bg-blue-500 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.name}
          </button>
        ))}
      </div>

      {/* Generate Tab */}
      {activeTab === 'generate' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Controls */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-gray-900/50 rounded-xl p-6">
              <h3 className="text-white font-semibold mb-4">Configuración</h3>
              
              {/* Nicho */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-2">Nicho</label>
                <div className="grid grid-cols-2 gap-2">
                  {niches.map(niche => (
                    <button
                      key={niche.id}
                      onClick={() => setSelectedNiche(niche.id)}
                      className={`p-3 rounded-lg border transition-colors ${
                        selectedNiche === niche.id
                          ? 'border-blue-500 bg-blue-500/20 text-blue-400'
                          : 'border-gray-700 bg-gray-800 text-gray-300 hover:border-gray-600'
                      }`}
                    >
                      <div className="text-lg mb-1">{niche.icon}</div>
                      <div className="text-xs">{niche.name}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Plataforma */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-2">Plataforma</label>
                <div className="space-y-2">
                  {platforms.map(platform => (
                    <button
                      key={platform.id}
                      onClick={() => setSelectedPlatform(platform.id)}
                      className={`w-full p-3 rounded-lg border transition-colors flex items-center justify-between ${
                        selectedPlatform === platform.id
                          ? 'border-blue-500 bg-blue-500/20 text-blue-400'
                          : 'border-gray-700 bg-gray-800 text-gray-300 hover:border-gray-600'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-lg">{platform.icon}</span>
                        <div className="text-left">
                          <div className="font-medium">{platform.name}</div>
                          <div className="text-xs text-gray-400">{platform.size}</div>
                        </div>
                      </div>
                      <div className="text-xs text-gray-400">{platform.format}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Prompt personalizado */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Descripción (opcional)
                </label>
                <textarea
                  value={generationPrompt}
                  onChange={(e) => setGenerationPrompt(e.target.value)}
                  placeholder="Describe lo que quieres generar..."
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-400 resize-none h-20"
                />
                <button
                  onClick={() => setGenerationPrompt(generateSmartPrompt())}
                  className="mt-2 text-xs text-blue-400 hover:text-blue-300 transition-colors"
                >
                  Generar prompt inteligente
                </button>
              </div>

              {/* Generar */}
              <motion.button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 rounded-lg font-medium hover:shadow-lg transition-all disabled:opacity-50"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isGenerating ? (
                  <div className="flex items-center justify-center gap-2">
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Generando...
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <Wand2 className="w-4 h-4" />
                    Generar Imágenes
                  </div>
                )}
              </motion.button>

              {/* Estilo del nicho */}
              {selectedNiche && (
                <div className="mt-6 p-4 bg-gray-800/50 rounded-lg">
                  <h4 className="text-white font-medium mb-3">Estilo {niches.find(n => n.id === selectedNiche)?.name}</h4>
                  <div className="space-y-3">
                    <div>
                      <div className="text-xs text-gray-400 mb-1">Colores</div>
                      <div className="flex gap-1">
                        {nicheStyles[selectedNiche]?.colors.map((color, index) => (
                          <div
                            key={index}
                            className="w-6 h-6 rounded-full border border-gray-600"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-400 mb-1">Mood</div>
                      <div className="text-sm text-white capitalize">
                        {nicheStyles[selectedNiche]?.mood}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Generated Images */}
          <div className="lg:col-span-2">
            <div className="bg-gray-900/50 rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-white font-semibold">Imágenes Generadas</h3>
                <div className="text-sm text-gray-400">
                  {generatedImages.length} imágenes
                </div>
              </div>

              {generatedImages.length === 0 ? (
                <div className="text-center py-12">
                  <Image className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400 mb-2">No hay imágenes generadas</p>
                  <p className="text-gray-500 text-sm">Configura los parámetros y genera tu primera imagen</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {generatedImages.map(image => (
                    <motion.div
                      key={image.id}
                      className="bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-700 transition-colors cursor-pointer"
                      whileHover={{ scale: 1.02 }}
                      onClick={() => setSelectedImage(image)}
                    >
                      <div className="aspect-square bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center">
                        <Image className="w-16 h-16 text-gray-500" />
                      </div>
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">
                              {platforms.find(p => p.id === image.platform)?.icon}
                            </span>
                            <span className="text-sm text-gray-300 capitalize">
                              {image.niche}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Zap className="w-3 h-3 text-yellow-400" />
                            <span className="text-xs text-yellow-400">{image.viralScore}%</span>
                          </div>
                        </div>
                        <p className="text-xs text-gray-400 mb-3 line-clamp-2">
                          {image.prompt}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex gap-1">
                            {image.colors.map((color, index) => (
                              <div
                                key={index}
                                className="w-4 h-4 rounded-full border border-gray-600"
                                style={{ backgroundColor: color }}
                              />
                            ))}
                          </div>
                          <div className="flex items-center gap-2">
                            <button className="p-1.5 hover:bg-gray-600 rounded transition-colors">
                              <Download className="w-3 h-3 text-gray-400" />
                            </button>
                            <button className="p-1.5 hover:bg-gray-600 rounded transition-colors">
                              <Share2 className="w-3 h-3 text-gray-400" />
                            </button>
                            <button className="p-1.5 hover:bg-gray-600 rounded transition-colors">
                              <Heart className="w-3 h-3 text-gray-400" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Templates Tab */}
      {activeTab === 'templates' && (
        <div className="bg-gray-900/50 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-white font-semibold">Templates por Nicho</h3>
            <div className="flex items-center gap-2">
              <select
                value={selectedNiche}
                onChange={(e) => setSelectedNiche(e.target.value)}
                className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm"
              >
                {niches.map(niche => (
                  <option key={niche.id} value={niche.id}>
                    {niche.icon} {niche.name}
                  </option>
                ))}
              </select>
              <select
                value={selectedPlatform}
                onChange={(e) => setSelectedPlatform(e.target.value)}
                className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm"
              >
                {platforms.map(platform => (
                  <option key={platform.id} value={platform.id}>
                    {platform.icon} {platform.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {templates[selectedNiche]?.[selectedPlatform]?.map(template => (
              <motion.div
                key={template.id}
                className="bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-700 transition-colors cursor-pointer"
                whileHover={{ scale: 1.02 }}
                onClick={() => setSelectedTemplate(template)}
              >
                <div className="aspect-square bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center">
                  <Image className="w-12 h-12 text-gray-500" />
                </div>
                <div className="p-3">
                  <h4 className="text-white font-medium text-sm mb-1">{template.name}</h4>
                  <p className="text-gray-400 text-xs capitalize">{template.style}</p>
                </div>
              </motion.div>
            )) || (
              <div className="col-span-full text-center py-8">
                <p className="text-gray-400">No hay templates disponibles para esta combinación</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gray-900/50 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold">Imágenes Generadas</h3>
              <Image className="w-5 h-5 text-blue-400" />
            </div>
            <div className="text-3xl font-bold text-white mb-2">{generatedImages.length}</div>
            <p className="text-gray-400 text-sm">Total este mes</p>
          </div>

          <div className="bg-gray-900/50 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold">Score Viral Promedio</h3>
              <Zap className="w-5 h-5 text-yellow-400" />
            </div>
            <div className="text-3xl font-bold text-white mb-2">
              {generatedImages.length > 0 
                ? Math.round(generatedImages.reduce((acc, img) => acc + img.viralScore, 0) / generatedImages.length)
                : 0}%
            </div>
            <p className="text-gray-400 text-sm">Potencial de viralidad</p>
          </div>

          <div className="bg-gray-900/50 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold">Alcance Estimado</h3>
              <Users className="w-5 h-5 text-green-400" />
            </div>
            <div className="text-3xl font-bold text-white mb-2">
              {generatedImages.length > 0 
                ? Math.round(generatedImages.reduce((acc, img) => acc + img.estimatedReach, 0) / 1000)
                : 0}K
            </div>
            <p className="text-gray-400 text-sm">Promedio por imagen</p>
          </div>

          <div className="bg-gray-900/50 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold">Nicho Favorito</h3>
              <Target className="w-5 h-5 text-purple-400" />
            </div>
            <div className="text-3xl font-bold text-white mb-2 capitalize">
              {selectedNiche}
            </div>
            <p className="text-gray-400 text-sm">Más utilizado</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default VisualContentGenerator;
