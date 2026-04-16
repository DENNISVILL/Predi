import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Target, 
  Zap, 
  TrendingUp, 
  Globe, 
  Eye, 
  Sparkles,
  Brain,
  MessageSquare,
  X,
  Play,
  Pause,
  RotateCcw,
  Settings
} from 'lucide-react';

const RadarGlobal = ({ onTrendClick }) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const [isScanning, setIsScanning] = useState(true);
  const [selectedTrend, setSelectedTrend] = useState(null);
  const [scanAngle, setScanAngle] = useState(0);
  const [trends, setTrends] = useState([]);
  const [radarStats, setRadarStats] = useState({
    activeTrends: 0,
    avgScore: 0,
    lastUpdate: new Date()
  });

  // Datos simulados de tendencias por países
  const countryPositions = {
    'Estados Unidos': { x: 0.2, y: 0.35, flag: '🇺🇸' },
    'Brasil': { x: 0.3, y: 0.65, flag: '🇧🇷' },
    'Reino Unido': { x: 0.48, y: 0.25, flag: '🇬🇧' },
    'Francia': { x: 0.5, y: 0.3, flag: '🇫🇷' },
    'Alemania': { x: 0.52, y: 0.25, flag: '🇩🇪' },
    'España': { x: 0.48, y: 0.35, flag: '🇪🇸' },
    'Japón': { x: 0.85, y: 0.35, flag: '🇯🇵' },
    'Corea del Sur': { x: 0.83, y: 0.32, flag: '🇰🇷' },
    'China': { x: 0.75, y: 0.3, flag: '🇨🇳' },
    'India': { x: 0.7, y: 0.4, flag: '🇮🇳' },
    'Australia': { x: 0.85, y: 0.7, flag: '🇦🇺' },
    'Canadá': { x: 0.2, y: 0.2, flag: '🇨🇦' },
    'México': { x: 0.15, y: 0.45, flag: '🇲🇽' },
    'Argentina': { x: 0.3, y: 0.8, flag: '🇦🇷' },
    'Sudáfrica': { x: 0.55, y: 0.75, flag: '🇿🇦' }
  };

  const trendCategories = {
    viral: { color: '#ff0080', name: 'Viral' },
    tech: { color: '#007bff', name: 'Tech' },
    fashion: { color: '#ec4899', name: 'Fashion' },
    gaming: { color: '#8b5cf6', name: 'Gaming' },
    music: { color: '#00ff9d', name: 'Music' },
    food: { color: '#f59e0b', name: 'Food' }
  };

  const sampleTrends = [
    { id: 1, name: 'AI Fashion Trends', category: 'tech', score: 95, country: 'Estados Unidos', growth: '+127%' },
    { id: 2, name: 'K-Pop Dance Challenge', category: 'viral', score: 98, country: 'Corea del Sur', growth: '+245%' },
    { id: 3, name: 'Sustainable Fashion', category: 'fashion', score: 87, country: 'Francia', growth: '+89%' },
    { id: 4, name: 'Gaming Cafés', category: 'gaming', score: 92, country: 'Japón', growth: '+156%' },
    { id: 5, name: 'Street Food Fusion', category: 'food', score: 78, country: 'México', growth: '+67%' },
    { id: 6, name: 'Reggaeton Remix', category: 'music', score: 85, country: 'Brasil', growth: '+134%' },
    { id: 7, name: 'Tech Startups', category: 'tech', score: 91, country: 'Reino Unido', growth: '+178%' },
    { id: 8, name: 'Bollywood Fusion', category: 'music', score: 88, country: 'India', growth: '+112%' },
    { id: 9, name: 'Eco Tourism', category: 'viral', score: 82, country: 'Australia', growth: '+98%' },
    { id: 10, name: 'Digital Art', category: 'tech', score: 89, country: 'Alemania', growth: '+145%' }
  ];

  // Inicializar tendencias
  useEffect(() => {
    setTrends(sampleTrends);
    updateRadarStats(sampleTrends);
  }, []);

  const updateRadarStats = (currentTrends) => {
    const avgScore = currentTrends.reduce((sum, trend) => sum + trend.score, 0) / currentTrends.length;
    setRadarStats({
      activeTrends: currentTrends.length,
      avgScore: Math.round(avgScore),
      lastUpdate: new Date()
    });
  };

  // Simulación de WebSocket para nuevas tendencias
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) { // 30% probabilidad cada 5 segundos
        const newTrend = {
          id: Date.now(),
          name: `Nueva Tendencia ${Math.floor(Math.random() * 1000)}`,
          category: Object.keys(trendCategories)[Math.floor(Math.random() * Object.keys(trendCategories).length)],
          score: Math.floor(Math.random() * 40) + 60,
          x: Math.random() * 0.8 + 0.1,
          y: Math.random() * 0.8 + 0.1,
          growth: `+${Math.floor(Math.random() * 200) + 50}%`
        };
        
        setTrends(prev => {
          const updated = [...prev, newTrend];
          updateRadarStats(updated);
          return updated;
        });
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Animación del radar tipo mapa mundi
  const drawRadar = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Limpiar canvas
    ctx.clearRect(0, 0, width, height);

    // Fondo del mapa mundi
    ctx.fillStyle = 'rgba(0, 20, 40, 0.8)';
    ctx.fillRect(0, 0, width, height);

    // Dibujar continentes simplificados
    ctx.strokeStyle = 'rgba(0, 123, 255, 0.3)';
    ctx.lineWidth = 2;
    ctx.fillStyle = 'rgba(0, 123, 255, 0.1)';

    // América del Norte
    ctx.beginPath();
    ctx.ellipse(width * 0.2, height * 0.3, width * 0.08, height * 0.12, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // América del Sur
    ctx.beginPath();
    ctx.ellipse(width * 0.28, height * 0.65, width * 0.05, height * 0.15, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Europa
    ctx.beginPath();
    ctx.ellipse(width * 0.5, height * 0.28, width * 0.04, height * 0.08, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // África
    ctx.beginPath();
    ctx.ellipse(width * 0.52, height * 0.5, width * 0.04, height * 0.15, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Asia
    ctx.beginPath();
    ctx.ellipse(width * 0.7, height * 0.35, width * 0.1, height * 0.12, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Australia
    ctx.beginPath();
    ctx.ellipse(width * 0.82, height * 0.7, width * 0.03, height * 0.05, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Línea de barrido global (solo si está escaneando)
    if (isScanning) {
      const gradient = ctx.createLinearGradient(0, 0, width, 0);
      gradient.addColorStop(0, 'rgba(0, 255, 157, 0)');
      gradient.addColorStop(0.3, 'rgba(0, 255, 157, 0.8)');
      gradient.addColorStop(0.7, 'rgba(0, 255, 157, 0.8)');
      gradient.addColorStop(1, 'rgba(0, 255, 157, 0)');

      const scanX = (Math.sin(scanAngle) + 1) * width / 2;
      ctx.fillStyle = gradient;
      ctx.fillRect(scanX - 50, 0, 100, height);
    }

    // Dibujar tendencias por países
    trends.forEach((trend) => {
      const countryPos = countryPositions[trend.country];
      if (!countryPos) return;

      const x = width * countryPos.x;
      const y = height * countryPos.y;
      const size = (trend.score / 100) * 15 + 8;
      const category = trendCategories[trend.category];

      // Efecto de pulso
      const pulseSize = size + Math.sin(Date.now() * 0.003 + trend.id) * 3;

      // Círculo exterior (pulso)
      ctx.fillStyle = category.color + '30';
      ctx.beginPath();
      ctx.arc(x, y, pulseSize, 0, Math.PI * 2);
      ctx.fill();

      // Círculo principal
      ctx.fillStyle = category.color;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();

      // Brillo central
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.beginPath();
      ctx.arc(x, y, size * 0.4, 0, Math.PI * 2);
      ctx.fill();

      // Bandera del país (emoji)
      ctx.font = `${size}px Arial`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(countryPos.flag, x, y);

      // Nombre del país (si el punto es grande)
      if (size > 12) {
        ctx.font = '10px Arial';
        ctx.fillStyle = 'white';
        ctx.fillText(trend.country, x, y + size + 15);
      }
    });

    // Grid de coordenadas
    ctx.strokeStyle = 'rgba(0, 123, 255, 0.1)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 10; i++) {
      const x = (width / 10) * i;
      const y = (height / 10) * i;
      
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
      
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
  }, [trends, scanAngle, isScanning]);

  // Loop de animación
  useEffect(() => {
    const animate = () => {
      if (isScanning) {
        setScanAngle(prev => prev + 0.02);
      }
      drawRadar();
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [drawRadar, isScanning]);

  // Manejar clic en canvas
  const handleCanvasClick = (event) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const clickY = event.clientY - rect.top;
    
    const width = canvas.width;
    const height = canvas.height;

    // Buscar tendencia clickeada por país
    const clickedTrend = trends.find(trend => {
      const countryPos = countryPositions[trend.country];
      if (!countryPos) return false;

      const x = width * countryPos.x;
      const y = height * countryPos.y;
      const size = (trend.score / 100) * 15 + 8;
      
      const distance = Math.sqrt((clickX - x) ** 2 + (clickY - y) ** 2);
      return distance <= size;
    });

    if (clickedTrend) {
      setSelectedTrend(clickedTrend);
    }
  };

  const handleTrendAction = (trend, action) => {
    if (action === 'chat' && onTrendClick) {
      onTrendClick(trend);
    }
    setSelectedTrend(null);
  };

  return (
    <div className="space-y-6">
      {/* Controles del Radar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <motion.button
            onClick={() => setIsScanning(!isScanning)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
              isScanning 
                ? 'bg-[#00ff9d]/20 text-[#00ff9d] border border-[#00ff9d]/30' 
                : 'bg-gray-700 text-gray-300 border border-gray-600'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isScanning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {isScanning ? 'Pausar Escaneo' : 'Iniciar Escaneo'}
          </motion.button>

          <motion.button
            onClick={() => {
              setScanAngle(0);
              setTrends(sampleTrends);
              updateRadarStats(sampleTrends);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-gray-300 border border-gray-600 rounded-lg hover:bg-gray-600 transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </motion.button>
        </div>

        {/* Estadísticas en tiempo real */}
        <div className="flex items-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-[#00ff9d] rounded-full animate-pulse"></div>
            <span className="text-gray-400">Tendencias Activas:</span>
            <span className="text-white font-bold">{radarStats.activeTrends}</span>
          </div>
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-[#007bff]" />
            <span className="text-gray-400">Score Promedio:</span>
            <span className="text-white font-bold">{radarStats.avgScore}</span>
          </div>
        </div>
      </div>

      {/* Radar Canvas */}
      <div className="relative">
        <motion.div
          className="bg-[#0a0a0a] rounded-2xl border border-gray-800 p-6"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <canvas
            ref={canvasRef}
            width={600}
            height={600}
            className="w-full h-auto cursor-crosshair"
            onClick={handleCanvasClick}
          />
          
          {/* Overlay de estado */}
          <div className="absolute top-4 left-4 flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${isScanning ? 'bg-[#00ff9d] animate-pulse' : 'bg-gray-500'}`}></div>
            <span className="text-white text-sm font-medium">
              {isScanning ? 'Escaneando...' : 'Pausado'}
            </span>
          </div>
        </motion.div>

        {/* Leyenda de categorías */}
        <motion.div
          className="mt-4 grid grid-cols-3 md:grid-cols-6 gap-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {Object.entries(trendCategories).map(([key, category]) => (
            <div key={key} className="flex items-center gap-2 text-sm">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: category.color }}
              ></div>
              <span className="text-gray-400">{category.name}</span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Modal de detalles de tendencia */}
      <AnimatePresence>
        {selectedTrend && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedTrend(null)}
          >
            <motion.div
              className="bg-[#1f1f1f] rounded-2xl border border-gray-700 p-6 max-w-md w-full mx-4"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{countryPositions[selectedTrend.country]?.flag}</span>
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: trendCategories[selectedTrend.category].color }}
                    ></div>
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-lg">{selectedTrend.name}</h3>
                    <p className="text-gray-400 text-sm">
                      {trendCategories[selectedTrend.category].name} • {selectedTrend.country}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedTrend(null)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-[#2a2a2a] rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <TrendingUp className="w-4 h-4 text-[#00ff9d]" />
                      <span className="text-gray-400 text-sm">Score</span>
                    </div>
                    <span className="text-white font-bold text-xl">{selectedTrend.score}</span>
                  </div>
                  <div className="bg-[#2a2a2a] rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <Zap className="w-4 h-4 text-[#007bff]" />
                      <span className="text-gray-400 text-sm">Crecimiento</span>
                    </div>
                    <span className="text-white font-bold text-xl">{selectedTrend.growth}</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <motion.button
                    onClick={() => handleTrendAction(selectedTrend, 'chat')}
                    className="flex-1 bg-gradient-to-r from-[#007bff] to-[#00ff9d] text-white py-2 px-4 rounded-lg font-medium flex items-center justify-center gap-2 hover:shadow-lg transition-all"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <MessageSquare className="w-4 h-4" />
                    Generar Copy con IA
                  </motion.button>
                  <motion.button
                    onClick={() => setSelectedTrend(null)}
                    className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-all"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Cerrar
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RadarGlobal;
