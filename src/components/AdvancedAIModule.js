// 🧠 MÓDULO DE IA AVANZADA COMPLETO
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Brain, Zap, Eye, MessageSquare, Target, AlertTriangle,
  Upload, Download, RefreshCw, Settings, BarChart3, Cpu
} from 'lucide-react';
import { useAdvancedAI } from '../hooks/useAdvancedAI.js';

const AdvancedAIModule = () => {
  const [activeTab, setActiveTab] = useState('content');
  const [inputText, setInputText] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  
  const {
    generatedContent,
    contentLoading,
    imageAnalysis,
    visionLoading,
    sentimentAnalysis,
    nlpLoading,
    recommendations,
    recommendationsLoading,
    anomalies,
    anomalyLoading,
    generateContent,
    generateViralContent,
    analyzeImage,
    analyzeSentiment,
    generateRecommendations,
    detectAnomalies,
    getContentAnalytics,
    getPerformanceStats
  } = useAdvancedAI();

  const tabs = [
    { id: 'content', name: 'GPT-4', icon: Brain, color: 'purple' },
    { id: 'vision', name: 'Computer Vision', icon: Eye, color: 'blue' },
    { id: 'nlp', name: 'NLP', icon: MessageSquare, color: 'green' },
    { id: 'recommendations', name: 'Recommendations', icon: Target, color: 'yellow' },
    { id: 'anomalies', name: 'Anomalies', icon: AlertTriangle, color: 'red' }
  ];

  const handleGenerateContent = async () => {
    if (!inputText.trim()) return;
    await generateContent(inputText, {
      maxTokens: 2048,
      temperature: 0.7
    });
  };

  const handleAnalyzeImage = async () => {
    if (!imageUrl.trim()) return;
    await analyzeImage(imageUrl, 'comprehensive');
  };

  const handleAnalyzeSentiment = async () => {
    if (!inputText.trim()) return;
    await analyzeSentiment(inputText, 'en');
  };

  const performanceStats = getPerformanceStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-bold text-white mb-4 flex items-center justify-center gap-3">
            <Brain className="w-8 h-8 text-purple-400" />
            IA Avanzada
          </h1>
          <p className="text-gray-400 text-lg">
            GPT-4, Computer Vision, NLP, Recommendations y Anomaly Detection
          </p>
        </motion.div>

        {/* Performance Stats */}
        <motion.div
          className="bg-gray-800/50 rounded-xl p-4 mb-8 border border-gray-700/50"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-purple-400">{performanceStats.totalRequests}</div>
              <div className="text-gray-400 text-sm">Requests</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-400">{performanceStats.activeOperations}</div>
              <div className="text-gray-400 text-sm">Active</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-400">{performanceStats.cacheStats.size}</div>
              <div className="text-gray-400 text-sm">Cached</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-yellow-400">
                {performanceStats.lastUpdated ? 'Online' : 'Offline'}
              </div>
              <div className="text-gray-400 text-sm">Status</div>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {tabs.map(tab => (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? `bg-${tab.color}-600 text-white`
                  : 'bg-gray-700/50 text-gray-400 hover:text-white'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <tab.icon className="w-4 h-4" />
              {tab.name}
            </motion.button>
          ))}
        </div>

        {/* Content */}
        {activeTab === 'content' && (
          <motion.div
            className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 rounded-xl p-6 border border-purple-500/30"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h3 className="text-xl font-bold text-white mb-4">GPT-4 Content Generation</h3>
            
            <div className="space-y-4">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Describe el contenido que quieres generar..."
                className="w-full bg-gray-700/50 border border-gray-600/50 rounded-lg p-4 text-white placeholder-gray-400 h-32"
              />
              
              <motion.button
                onClick={handleGenerateContent}
                disabled={contentLoading || !inputText.trim()}
                className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white px-6 py-2 rounded-lg flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {contentLoading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Zap className="w-4 h-4" />
                )}
                Generar Contenido
              </motion.button>

              {generatedContent && (
                <div className="bg-gray-800/50 rounded-lg p-4 mt-4">
                  <h4 className="text-white font-bold mb-2">Contenido Generado:</h4>
                  <p className="text-gray-300 whitespace-pre-wrap">{generatedContent.content}</p>
                  <div className="mt-2 text-xs text-gray-400">
                    Tokens: {generatedContent.usage?.total_tokens} | Modelo: {generatedContent.model}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {activeTab === 'vision' && (
          <motion.div
            className="bg-gradient-to-br from-blue-900/20 to-cyan-900/20 rounded-xl p-6 border border-blue-500/30"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h3 className="text-xl font-bold text-white mb-4">Computer Vision Analysis</h3>
            
            <div className="space-y-4">
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="URL de la imagen a analizar..."
                className="w-full bg-gray-700/50 border border-gray-600/50 rounded-lg p-3 text-white placeholder-gray-400"
              />
              
              <motion.button
                onClick={handleAnalyzeImage}
                disabled={visionLoading || !imageUrl.trim()}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white px-6 py-2 rounded-lg flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {visionLoading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
                Analizar Imagen
              </motion.button>

              {imageAnalysis && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="bg-gray-800/50 rounded-lg p-4">
                    <h4 className="text-white font-bold mb-2">Scores:</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Viral Score:</span>
                        <span className="text-green-400 font-bold">{imageAnalysis.viralScore}/100</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Aesthetic Score:</span>
                        <span className="text-blue-400 font-bold">{imageAnalysis.aestheticScore}/100</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-800/50 rounded-lg p-4">
                    <h4 className="text-white font-bold mb-2">Detecciones:</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Objetos:</span>
                        <span className="text-white">{imageAnalysis.objects?.length || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Caras:</span>
                        <span className="text-white">{imageAnalysis.faces?.length || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Texto:</span>
                        <span className="text-white">{imageAnalysis.text ? 'Sí' : 'No'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {activeTab === 'nlp' && (
          <motion.div
            className="bg-gradient-to-br from-green-900/20 to-emerald-900/20 rounded-xl p-6 border border-green-500/30"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h3 className="text-xl font-bold text-white mb-4">Natural Language Processing</h3>
            
            <div className="space-y-4">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Texto para analizar sentimiento..."
                className="w-full bg-gray-700/50 border border-gray-600/50 rounded-lg p-4 text-white placeholder-gray-400 h-32"
              />
              
              <motion.button
                onClick={handleAnalyzeSentiment}
                disabled={nlpLoading || !inputText.trim()}
                className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white px-6 py-2 rounded-lg flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {nlpLoading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <MessageSquare className="w-4 h-4" />
                )}
                Analizar Sentimiento
              </motion.button>

              {sentimentAnalysis && (
                <div className="bg-gray-800/50 rounded-lg p-4 mt-4">
                  <h4 className="text-white font-bold mb-2">Análisis de Sentimiento:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-400">
                        {Math.round(sentimentAnalysis.overall.confidence.positive * 100)}%
                      </div>
                      <div className="text-gray-400 text-sm">Positivo</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-400">
                        {Math.round(sentimentAnalysis.overall.confidence.neutral * 100)}%
                      </div>
                      <div className="text-gray-400 text-sm">Neutral</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-400">
                        {Math.round(sentimentAnalysis.overall.confidence.negative * 100)}%
                      </div>
                      <div className="text-gray-400 text-sm">Negativo</div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Potencial Viral:</span>
                      <span className="text-purple-400 font-bold">{sentimentAnalysis.viralPotential}/100</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AdvancedAIModule;
