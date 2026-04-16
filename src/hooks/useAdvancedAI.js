// 🧠 HOOK DE IA AVANZADA
// Maneja GPT-4, Computer Vision, NLP, Recommendations y Anomaly Detection

import { useState, useCallback, useRef, useEffect } from 'react';
import AIService from '../services/aiService.js';
import { useNotifications } from './useNotifications.js';

export const useAdvancedAI = (options = {}) => {
  const { showToast } = useNotifications();
  
  const [state, setState] = useState({
    // GPT-4 Content Generation
    generatedContent: null,
    contentLoading: false,
    contentError: null,
    
    // Computer Vision
    imageAnalysis: null,
    visionLoading: false,
    visionError: null,
    
    // NLP Sentiment Analysis
    sentimentAnalysis: null,
    nlpLoading: false,
    nlpError: null,
    
    // Recommendations
    recommendations: [],
    recommendationsLoading: false,
    recommendationsError: null,
    
    // Anomaly Detection
    anomalies: null,
    anomalyLoading: false,
    anomalyError: null,
    
    // General
    lastUpdated: null,
    totalRequests: 0
  });

  const abortControllers = useRef({});
  const requestQueue = useRef([]);
  const isProcessing = useRef(false);

  // 🤖 GPT-4 CONTENT GENERATION
  const generateContent = useCallback(async (prompt, contentOptions = {}) => {
    setState(prev => ({ 
      ...prev, 
      contentLoading: true, 
      contentError: null,
      totalRequests: prev.totalRequests + 1
    }));

    try {
      abortControllers.current.content = new AbortController();
      
      const result = await AIService.generateContent(prompt, {
        systemPrompt: contentOptions.systemPrompt,
        maxTokens: contentOptions.maxTokens || 2048,
        temperature: contentOptions.temperature || 0.7,
        topP: contentOptions.topP,
        frequencyPenalty: contentOptions.frequencyPenalty,
        presencePenalty: contentOptions.presencePenalty
      });

      setState(prev => ({
        ...prev,
        generatedContent: result,
        contentLoading: false,
        lastUpdated: new Date()
      }));

      showToast('✨ Contenido generado con GPT-4', 'success');
      return result;
    } catch (error) {
      if (error.name !== 'AbortError') {
        setState(prev => ({
          ...prev,
          contentError: error.message,
          contentLoading: false
        }));
        showToast('Error al generar contenido', 'error');
      }
      throw error;
    }
  }, [showToast]);

  // 🎯 VIRAL CONTENT GENERATION
  const generateViralContent = useCallback(async (contentType, platform, topic, viralOptions = {}) => {
    setState(prev => ({ 
      ...prev, 
      contentLoading: true, 
      contentError: null,
      totalRequests: prev.totalRequests + 1
    }));

    try {
      const result = await AIService.generateViralContent(contentType, platform, topic, {
        audience: viralOptions.audience || 'Gen Z',
        tone: viralOptions.tone || 'energetic',
        style: viralOptions.style || 'trendy',
        industry: viralOptions.industry,
        duration: viralOptions.duration,
        ...viralOptions
      });

      setState(prev => ({
        ...prev,
        generatedContent: result,
        contentLoading: false,
        lastUpdated: new Date()
      }));

      showToast(`🚀 Contenido viral para ${platform} generado`, 'success');
      return result;
    } catch (error) {
      if (error.name !== 'AbortError') {
        setState(prev => ({
          ...prev,
          contentError: error.message,
          contentLoading: false
        }));
        showToast('Error al generar contenido viral', 'error');
      }
      throw error;
    }
  }, [showToast]);

  // 👁️ IMAGE ANALYSIS
  const analyzeImage = useCallback(async (imageUrl, analysisType = 'comprehensive') => {
    setState(prev => ({ 
      ...prev, 
      visionLoading: true, 
      visionError: null,
      totalRequests: prev.totalRequests + 1
    }));

    try {
      abortControllers.current.vision = new AbortController();
      
      const analysis = await AIService.analyzeImage(imageUrl, analysisType);

      setState(prev => ({
        ...prev,
        imageAnalysis: analysis,
        visionLoading: false,
        lastUpdated: new Date()
      }));

      showToast('👁️ Análisis de imagen completado', 'success');
      return analysis;
    } catch (error) {
      if (error.name !== 'AbortError') {
        setState(prev => ({
          ...prev,
          visionError: error.message,
          visionLoading: false
        }));
        showToast('Error al analizar imagen', 'error');
      }
      throw error;
    }
  }, [showToast]);

  // 📝 SENTIMENT ANALYSIS
  const analyzeSentiment = useCallback(async (text, language = 'en') => {
    setState(prev => ({ 
      ...prev, 
      nlpLoading: true, 
      nlpError: null,
      totalRequests: prev.totalRequests + 1
    }));

    try {
      abortControllers.current.nlp = new AbortController();
      
      const analysis = await AIService.analyzeSentiment(text, language);

      setState(prev => ({
        ...prev,
        sentimentAnalysis: analysis,
        nlpLoading: false,
        lastUpdated: new Date()
      }));

      showToast('📝 Análisis de sentimiento completado', 'success');
      return analysis;
    } catch (error) {
      if (error.name !== 'AbortError') {
        setState(prev => ({
          ...prev,
          nlpError: error.message,
          nlpLoading: false
        }));
        showToast('Error al analizar sentimiento', 'error');
      }
      throw error;
    }
  }, [showToast]);

  // 🎯 GENERATE RECOMMENDATIONS
  const generateRecommendations = useCallback(async (userProfile, contentHistory, currentTrends) => {
    setState(prev => ({ 
      ...prev, 
      recommendationsLoading: true, 
      recommendationsError: null,
      totalRequests: prev.totalRequests + 1
    }));

    try {
      abortControllers.current.recommendations = new AbortController();
      
      const recommendations = await AIService.generateRecommendations(
        userProfile, 
        contentHistory, 
        currentTrends
      );

      setState(prev => ({
        ...prev,
        recommendations,
        recommendationsLoading: false,
        lastUpdated: new Date()
      }));

      showToast(`🎯 ${recommendations.length} recomendaciones generadas`, 'success');
      return recommendations;
    } catch (error) {
      if (error.name !== 'AbortError') {
        setState(prev => ({
          ...prev,
          recommendationsError: error.message,
          recommendationsLoading: false
        }));
        showToast('Error al generar recomendaciones', 'error');
      }
      throw error;
    }
  }, [showToast]);

  // 🚨 ANOMALY DETECTION
  const detectAnomalies = useCallback(async (metrics, timeWindow = '24h') => {
    setState(prev => ({ 
      ...prev, 
      anomalyLoading: true, 
      anomalyError: null,
      totalRequests: prev.totalRequests + 1
    }));

    try {
      abortControllers.current.anomaly = new AbortController();
      
      const anomalies = await AIService.detectAnomalies(metrics, timeWindow);

      setState(prev => ({
        ...prev,
        anomalies,
        anomalyLoading: false,
        lastUpdated: new Date()
      }));

      const criticalCount = anomalies.summary.critical;
      if (criticalCount > 0) {
        showToast(`🚨 ${criticalCount} anomalías críticas detectadas`, 'warning');
      } else {
        showToast('✅ Análisis de anomalías completado', 'success');
      }
      
      return anomalies;
    } catch (error) {
      if (error.name !== 'AbortError') {
        setState(prev => ({
          ...prev,
          anomalyError: error.message,
          anomalyLoading: false
        }));
        showToast('Error al detectar anomalías', 'error');
      }
      throw error;
    }
  }, [showToast]);

  // 🔄 BATCH PROCESSING
  const processBatch = useCallback(async (requests) => {
    const results = [];
    
    for (const request of requests) {
      try {
        let result;
        
        switch (request.type) {
          case 'generate':
            result = await generateContent(request.prompt, request.options);
            break;
          case 'analyze_image':
            result = await analyzeImage(request.imageUrl, request.analysisType);
            break;
          case 'analyze_sentiment':
            result = await analyzeSentiment(request.text, request.language);
            break;
          case 'recommendations':
            result = await generateRecommendations(
              request.userProfile, 
              request.contentHistory, 
              request.currentTrends
            );
            break;
          case 'anomalies':
            result = await detectAnomalies(request.metrics, request.timeWindow);
            break;
          default:
            throw new Error(`Unknown request type: ${request.type}`);
        }
        
        results.push({ success: true, data: result, request });
      } catch (error) {
        results.push({ success: false, error: error.message, request });
      }
    }
    
    showToast(`📦 Procesamiento en lote completado: ${results.filter(r => r.success).length}/${results.length}`, 'info');
    return results;
  }, [generateContent, analyzeImage, analyzeSentiment, generateRecommendations, detectAnomalies, showToast]);

  // 🛑 ABORT OPERATIONS
  const abortOperation = useCallback((operation) => {
    if (abortControllers.current[operation]) {
      abortControllers.current[operation].abort();
      delete abortControllers.current[operation];
      
      setState(prev => ({
        ...prev,
        [`${operation}Loading`]: false
      }));
      
      showToast(`🛑 Operación ${operation} cancelada`, 'info');
    }
  }, [showToast]);

  const abortAllOperations = useCallback(() => {
    Object.keys(abortControllers.current).forEach(abortOperation);
    showToast('🛑 Todas las operaciones canceladas', 'info');
  }, [abortOperation, showToast]);

  // 📊 ANALYTICS & HELPERS
  const getContentAnalytics = useCallback(() => {
    const { generatedContent, imageAnalysis, sentimentAnalysis } = state;
    
    return {
      hasContent: !!generatedContent,
      hasImageAnalysis: !!imageAnalysis,
      hasSentimentAnalysis: !!sentimentAnalysis,
      
      contentStats: generatedContent ? {
        tokens: generatedContent.usage?.total_tokens || 0,
        model: generatedContent.model,
        timestamp: generatedContent.timestamp
      } : null,
      
      imageStats: imageAnalysis ? {
        viralScore: imageAnalysis.viralScore,
        aestheticScore: imageAnalysis.aestheticScore,
        objectCount: imageAnalysis.objects?.length || 0,
        faceCount: imageAnalysis.faces?.length || 0,
        hasText: !!imageAnalysis.text
      } : null,
      
      sentimentStats: sentimentAnalysis ? {
        overall: sentimentAnalysis.overall.sentiment,
        confidence: Math.max(...Object.values(sentimentAnalysis.overall.confidence)),
        viralPotential: sentimentAnalysis.viralPotential,
        emotionalTriggers: sentimentAnalysis.emotionalTriggers
      } : null
    };
  }, [state]);

  const getRecommendationsSummary = useCallback(() => {
    const { recommendations } = state;
    
    if (!recommendations.length) return null;
    
    return {
      total: recommendations.length,
      highConfidence: recommendations.filter(r => r.confidence > 80).length,
      platforms: [...new Set(recommendations.map(r => r.platform))],
      avgConfidence: recommendations.reduce((acc, r) => acc + r.confidence, 0) / recommendations.length,
      topRecommendation: recommendations.sort((a, b) => b.confidence - a.confidence)[0]
    };
  }, [state.recommendations]);

  const getAnomaliesSummary = useCallback(() => {
    const { anomalies } = state;
    
    if (!anomalies) return null;
    
    return {
      ...anomalies.summary,
      mostSevere: anomalies.anomalies[0] || null,
      byType: anomalies.anomalies.reduce((acc, anomaly) => {
        acc[anomaly.type] = (acc[anomaly.type] || 0) + 1;
        return acc;
      }, {}),
      recentAnomalies: anomalies.anomalies.filter(a => 
        new Date(a.timestamp) > new Date(Date.now() - 3600000) // Last hour
      ).length
    };
  }, [state.anomalies]);

  // 🧹 CLEANUP
  useEffect(() => {
    return () => {
      Object.keys(abortControllers.current).forEach(key => {
        if (abortControllers.current[key]) {
          abortControllers.current[key].abort();
        }
      });
    };
  }, []);

  // 📈 PERFORMANCE MONITORING
  const getPerformanceStats = useCallback(() => {
    return {
      totalRequests: state.totalRequests,
      lastUpdated: state.lastUpdated,
      activeOperations: Object.keys(abortControllers.current).length,
      cacheStats: AIService.getCacheStats(),
      errorRate: {
        content: state.contentError ? 1 : 0,
        vision: state.visionError ? 1 : 0,
        nlp: state.nlpError ? 1 : 0,
        recommendations: state.recommendationsError ? 1 : 0,
        anomaly: state.anomalyError ? 1 : 0
      }
    };
  }, [state]);

  return {
    // State
    ...state,
    
    // Content Generation
    generateContent,
    generateViralContent,
    
    // Computer Vision
    analyzeImage,
    
    // NLP
    analyzeSentiment,
    
    // Recommendations
    generateRecommendations,
    
    // Anomaly Detection
    detectAnomalies,
    
    // Batch Processing
    processBatch,
    
    // Control
    abortOperation,
    abortAllOperations,
    
    // Analytics
    getContentAnalytics,
    getRecommendationsSummary,
    getAnomaliesSummary,
    getPerformanceStats
  };
};
