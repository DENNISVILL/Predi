import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Trophy, TrendingUp, BarChart3, Hash, Crown, Star, Users,
  ArrowUp, ArrowDown, Minus, Calendar, Globe, Filter,
  Download, Share2, Eye, Heart, MessageCircle, Repeat2,
  Award, Medal, Target, Zap, Flame, Clock, Activity
} from 'lucide-react';
import useStore from '../store/useStore';
import { useNotifications } from '../hooks/useNotifications';

const RankingsChartsModule = () => {
  const { showToast } = useNotifications();
  const [selectedCategory, setSelectedCategory] = useState('hashtags');
  const [selectedPlatform, setSelectedPlatform] = useState('all');
  const [timeRange, setTimeRange] = useState('week');
  const [viewMode, setViewMode] = useState('rankings');

  // 📊 TOP 100 HASHTAGS POR CATEGORÍA
  const [hashtagRankings, setHashtagRankings] = useState({
    tech: [
      {
        rank: 1,
        hashtag: '#AI',
        usage: 12500000,
        growth: '+340%',
        engagement: '8.9%',
        reach: '45M',
        posts: 2400000,
        trend: 'up',
        changeFromLastWeek: '+3',
        platforms: {
          tiktok: { usage: 5000000, rank: 1 },
          instagram: { usage: 4200000, rank: 2 },
          twitter: { usage: 2100000, rank: 3 },
          linkedin: { usage: 1200000, rank: 1 }
        },
        demographics: {
          '13-17': 15, '18-24': 35, '25-34': 30, '35-44': 15, '45+': 5
        },
        peakHours: ['2 PM', '8 PM', '10 PM'],
        relatedHashtags: ['#MachineLearning', '#Tech', '#Innovation', '#Future'],
        viralScore: 98
      },
      {
        rank: 2,
        hashtag: '#TechTok',
        usage: 8900000,
        growth: '+280%',
        engagement: '7.2%',
        reach: '32M',
        posts: 1800000,
        trend: 'up',
        changeFromLastWeek: '+1',
        platforms: {
          tiktok: { usage: 6500000, rank: 1 },
          instagram: { usage: 1800000, rank: 8 },
          twitter: { usage: 400000, rank: 15 },
          linkedin: { usage: 200000, rank: 25 }
        },
        demographics: {
          '13-17': 45, '18-24': 35, '25-34': 15, '35-44': 4, '45+': 1
        },
        peakHours: ['7 PM', '9 PM', '11 PM'],
        relatedHashtags: ['#Tech', '#Innovation', '#Coding', '#Developer'],
        viralScore: 94
      }
    ],
    lifestyle: [
      {
        rank: 1,
        hashtag: '#Aesthetic',
        usage: 15600000,
        growth: '+220%',
        engagement: '9.8%',
        reach: '58M',
        posts: 3200000,
        trend: 'up',
        changeFromLastWeek: '0',
        platforms: {
          instagram: { usage: 8900000, rank: 1 },
          tiktok: { usage: 4200000, rank: 3 },
          pinterest: { usage: 2100000, rank: 1 },
          twitter: { usage: 400000, rank: 20 }
        },
        demographics: {
          '13-17': 35, '18-24': 40, '25-34': 20, '35-44': 4, '45+': 1
        },
        peakHours: ['6 PM', '8 PM', '9 PM'],
        relatedHashtags: ['#Vibes', '#Mood', '#Style', '#Inspiration'],
        viralScore: 96
      }
    ]
  });

  // 📈 CHARTS DE CRECIMIENTO HISTÓRICO
  const [growthCharts, setGrowthCharts] = useState({
    hashtags: {
      '#AI': {
        daily: [
          { date: '2024-01-01', usage: 8500000, engagement: 7.2, reach: 35000000 },
          { date: '2024-01-02', usage: 9200000, engagement: 7.8, reach: 38000000 },
          { date: '2024-01-03', usage: 10100000, engagement: 8.1, reach: 41000000 },
          { date: '2024-01-04', usage: 11300000, engagement: 8.5, reach: 43000000 },
          { date: '2024-01-05', usage: 12500000, engagement: 8.9, reach: 45000000 }
        ],
        weekly: [
          { week: 'Sem 1', usage: 45000000, growth: '+15%' },
          { week: 'Sem 2', usage: 52000000, growth: '+18%' },
          { week: 'Sem 3', usage: 61000000, growth: '+22%' },
          { week: 'Sem 4', usage: 75000000, growth: '+28%' }
        ],
        monthly: [
          { month: 'Ene', usage: 180000000, growth: '+25%' },
          { month: 'Feb', usage: 235000000, growth: '+30%' },
          { month: 'Mar', usage: 310000000, growth: '+32%' }
        ],
        predictions: {
          nextWeek: { usage: 14200000, confidence: 89 },
          nextMonth: { usage: 18500000, confidence: 76 },
          peakPrediction: { date: '2024-02-15', usage: 20000000 }
        }
      }
    },
    trends: {
      'SustainableTech': {
        lifecycle: [
          { phase: 'Emerging', duration: '2 weeks', usage: 150000 },
          { phase: 'Growing', duration: '4 weeks', usage: 850000 },
          { phase: 'Peak', duration: '3 weeks', usage: 2400000 },
          { phase: 'Declining', duration: '6 weeks', usage: 1200000 },
          { phase: 'Stable', duration: 'Ongoing', usage: 400000 }
        ],
        currentPhase: 'Peak',
        remainingTime: '2 semanas',
        nextPhase: 'Declining'
      }
    }
  });

  // 👑 RANKINGS DE INFLUENCERS
  const [influencerRankings, setInfluencerRankings] = useState({
    overall: [
      {
        rank: 1,
        username: '@techguru_mx',
        name: 'Tech Guru México',
        platform: 'TikTok',
        followers: 2400000,
        engagement: '12.5%',
        avgViews: 850000,
        growth: '+45%',
        niche: 'Technology',
        viralPosts: 23,
        totalLikes: 45000000,
        influence: 98,
        avatar: '/avatars/techguru.jpg',
        verified: true,
        topContent: ['AI Tutorials', 'Tech Reviews', 'Coding Tips'],
        recentViral: {
          title: 'AI in 2024 Predictions',
          views: 2400000,
          likes: 340000,
          date: '2024-01-03'
        }
      },
      {
        rank: 2,
        username: '@lifestyle_queen',
        name: 'Lifestyle Queen',
        platform: 'Instagram',
        followers: 1800000,
        engagement: '15.2%',
        avgViews: 650000,
        growth: '+38%',
        niche: 'Lifestyle',
        viralPosts: 18,
        totalLikes: 32000000,
        influence: 95,
        avatar: '/avatars/lifestyle.jpg',
        verified: true,
        topContent: ['Morning Routines', 'Aesthetic Content', 'Self Care'],
        recentViral: {
          title: 'That Girl Morning Routine',
          views: 1800000,
          likes: 280000,
          date: '2024-01-02'
        }
      }
    ],
    byNiche: {
      technology: [
        {
          rank: 1,
          username: '@techguru_mx',
          influence: 98,
          specialization: 'AI & Machine Learning',
          avgEngagement: '12.5%'
        }
      ],
      lifestyle: [
        {
          rank: 1,
          username: '@lifestyle_queen',
          influence: 95,
          specialization: 'Wellness & Aesthetics',
          avgEngagement: '15.2%'
        }
      ]
    }
  });

  // 🏆 LEADERBOARDS DE CONTENIDO
  const [contentLeaderboards, setContentLeaderboards] = useState({
    viralContent: [
      {
        rank: 1,
        title: 'AI Robot Dancing to Trending Song',
        creator: '@techguru_mx',
        platform: 'TikTok',
        views: 12400000,
        likes: 2100000,
        shares: 450000,
        comments: 89000,
        engagement: '18.2%',
        viralScore: 99,
        datePosted: '2024-01-01',
        peakDate: '2024-01-03',
        category: 'Technology',
        hashtags: ['#AI', '#Robot', '#Dance', '#Tech'],
        duration: '0:45',
        thumbnail: '/thumbnails/ai-robot.jpg'
      },
      {
        rank: 2,
        title: 'Morning Routine That Changed My Life',
        creator: '@lifestyle_queen',
        platform: 'Instagram',
        views: 8900000,
        likes: 1650000,
        shares: 320000,
        comments: 67000,
        engagement: '22.8%',
        viralScore: 96,
        datePosted: '2024-01-02',
        peakDate: '2024-01-04',
        category: 'Lifestyle',
        hashtags: ['#MorningRoutine', '#ThatGirl', '#Wellness'],
        duration: '1:20',
        thumbnail: '/thumbnails/morning-routine.jpg'
      }
    ],
    topPerformers: {
      today: [
        {
          title: 'Quick AI Tutorial',
          growth: '+2400%',
          currentViews: 450000,
          timePosted: '2 hours ago'
        }
      ],
      thisWeek: [
        {
          title: 'Aesthetic Room Makeover',
          totalViews: 3200000,
          avgDaily: 457000,
          consistency: 94
        }
      ]
    },
    categories: {
      technology: { totalPosts: 2400000, avgEngagement: '8.9%', topHashtag: '#AI' },
      lifestyle: { totalPosts: 3600000, avgEngagement: '11.2%', topHashtag: '#Aesthetic' },
      fitness: { totalPosts: 1800000, avgEngagement: '9.8%', topHashtag: '#Workout' },
      food: { totalPosts: 2100000, avgEngagement: '10.5%', topHashtag: '#Recipe' }
    }
  });

  const categories = [
    { id: 'hashtags', name: 'Hashtags', icon: Hash },
    { id: 'growth', name: 'Crecimiento', icon: TrendingUp },
    { id: 'influencers', name: 'Influencers', icon: Crown },
    { id: 'content', name: 'Contenido', icon: Trophy }
  ];

  const platforms = [
    { id: 'all', name: 'Todas' },
    { id: 'tiktok', name: 'TikTok' },
    { id: 'instagram', name: 'Instagram' },
    { id: 'youtube', name: 'YouTube' },
    { id: 'twitter', name: 'Twitter' }
  ];

  const timeRanges = [
    { id: 'day', name: 'Hoy' },
    { id: 'week', name: 'Esta semana' },
    { id: 'month', name: 'Este mes' },
    { id: 'year', name: 'Este año' }
  ];

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'up': return <ArrowUp className="w-4 h-4 text-green-400" />;
      case 'down': return <ArrowDown className="w-4 h-4 text-red-400" />;
      default: return <Minus className="w-4 h-4 text-gray-400" />;
    }
  };

  const exportData = () => {
    showToast('📊 Exportando datos de rankings...', 'info');
    // Lógica de exportación
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-bold text-white mb-4 flex items-center justify-center gap-3">
            <Trophy className="w-8 h-8 text-yellow-400" />
            Rankings & Charts
          </h1>
          <p className="text-gray-400 text-lg">
            Top 100, crecimiento histórico y leaderboards en tiempo real
          </p>
        </motion.div>

        {/* Controles */}
        <motion.div
          className="bg-gray-800/50 rounded-xl p-6 mb-8 border border-gray-700/50"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="flex flex-wrap items-center gap-4">
            {/* Categorías */}
            <div className="flex gap-2">
              {categories.map(category => (
                <motion.button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-yellow-600 text-white'
                      : 'bg-gray-700/50 text-gray-400 hover:text-white'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <category.icon className="w-4 h-4" />
                  {category.name}
                </motion.button>
              ))}
            </div>

            {/* Plataforma */}
            <select
              value={selectedPlatform}
              onChange={(e) => setSelectedPlatform(e.target.value)}
              className="bg-gray-700/50 border border-gray-600/50 rounded-lg px-3 py-2 text-white text-sm"
            >
              {platforms.map(platform => (
                <option key={platform.id} value={platform.id}>
                  {platform.name}
                </option>
              ))}
            </select>

            {/* Tiempo */}
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="bg-gray-700/50 border border-gray-600/50 rounded-lg px-3 py-2 text-white text-sm"
            >
              {timeRanges.map(range => (
                <option key={range.id} value={range.id}>
                  {range.name}
                </option>
              ))}
            </select>

            {/* Exportar */}
            <motion.button
              onClick={exportData}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Download className="w-4 h-4" />
              Exportar
            </motion.button>
          </div>
        </motion.div>

        {/* Contenido Principal */}
        <AnimatePresence mode="wait">
          {selectedCategory === 'hashtags' && (
            <motion.div
              key="hashtags"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <Hash className="w-6 h-6 text-blue-400" />
                Top 100 Hashtags - Tecnología
              </h2>

              <div className="space-y-3">
                {hashtagRankings.tech.map((hashtag, index) => (
                  <motion.div
                    key={hashtag.hashtag}
                    className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50 hover:border-gray-600/50 transition-all"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.01 }}
                  >
                    <div className="flex items-center gap-6">
                      {/* Ranking */}
                      <div className="text-center">
                        <div className="text-3xl font-bold text-yellow-400">#{hashtag.rank}</div>
                        <div className="flex items-center gap-1 text-sm">
                          {getTrendIcon(hashtag.trend)}
                          <span className={`${hashtag.trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                            {hashtag.changeFromLastWeek}
                          </span>
                        </div>
                      </div>

                      {/* Hashtag Info */}
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-white mb-2">{hashtag.hashtag}</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-gray-400">Usos:</span>
                            <div className="text-white font-bold">{hashtag.usage.toLocaleString()}</div>
                          </div>
                          <div>
                            <span className="text-gray-400">Crecimiento:</span>
                            <div className="text-green-400 font-bold">{hashtag.growth}</div>
                          </div>
                          <div>
                            <span className="text-gray-400">Engagement:</span>
                            <div className="text-blue-400 font-bold">{hashtag.engagement}</div>
                          </div>
                          <div>
                            <span className="text-gray-400">Alcance:</span>
                            <div className="text-purple-400 font-bold">{hashtag.reach}</div>
                          </div>
                        </div>

                        {/* Plataformas */}
                        <div className="mt-4">
                          <span className="text-gray-400 text-sm">Top plataformas:</span>
                          <div className="flex gap-4 mt-2">
                            {Object.entries(hashtag.platforms).map(([platform, data]) => (
                              <div key={platform} className="text-center">
                                <div className="text-white font-bold text-sm">#{data.rank}</div>
                                <div className="text-gray-400 text-xs capitalize">{platform}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Score Viral */}
                      <div className="text-center">
                        <div className="text-3xl font-bold text-purple-400">{hashtag.viralScore}</div>
                        <div className="text-gray-400 text-sm">Score Viral</div>
                      </div>
                    </div>

                    {/* Hashtags Relacionados */}
                    <div className="mt-4 pt-4 border-t border-gray-600/30">
                      <span className="text-gray-400 text-sm">Relacionados:</span>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {hashtag.relatedHashtags.map(related => (
                          <span key={related} className="bg-blue-500/20 text-blue-400 text-xs px-2 py-1 rounded">
                            {related}
                          </span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {selectedCategory === 'influencers' && (
            <motion.div
              key="influencers"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <Crown className="w-6 h-6 text-yellow-400" />
                Top Influencers
              </h2>

              <div className="space-y-4">
                {influencerRankings.overall.map((influencer, index) => (
                  <motion.div
                    key={influencer.username}
                    className="bg-gradient-to-r from-yellow-900/20 to-orange-900/20 rounded-xl p-6 border border-yellow-500/30"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.01 }}
                  >
                    <div className="flex items-center gap-6">
                      {/* Ranking */}
                      <div className="text-center">
                        <div className="text-4xl font-bold text-yellow-400">#{influencer.rank}</div>
                        {influencer.rank === 1 && <Crown className="w-6 h-6 text-yellow-400 mx-auto mt-1" />}
                      </div>

                      {/* Avatar y Info */}
                      <div className="flex items-center gap-4 flex-1">
                        <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
                          <Users className="w-8 h-8 text-white" />
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-xl font-bold text-white">{influencer.name}</h3>
                            {influencer.verified && <Star className="w-5 h-5 text-blue-400" />}
                          </div>
                          <p className="text-gray-400">{influencer.username}</p>
                          <div className="flex items-center gap-4 mt-2 text-sm">
                            <span className="text-purple-400">{influencer.platform}</span>
                            <span className="text-gray-400">•</span>
                            <span className="text-blue-400">{influencer.niche}</span>
                          </div>
                        </div>
                      </div>

                      {/* Métricas */}
                      <div className="grid grid-cols-2 gap-4 text-center">
                        <div>
                          <div className="text-2xl font-bold text-white">{(influencer.followers / 1000000).toFixed(1)}M</div>
                          <div className="text-gray-400 text-sm">Seguidores</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-green-400">{influencer.engagement}</div>
                          <div className="text-gray-400 text-sm">Engagement</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-purple-400">{influencer.growth}</div>
                          <div className="text-gray-400 text-sm">Crecimiento</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-yellow-400">{influencer.influence}</div>
                          <div className="text-gray-400 text-sm">Influencia</div>
                        </div>
                      </div>
                    </div>

                    {/* Contenido Top */}
                    <div className="mt-4 pt-4 border-t border-gray-600/30">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-gray-400 text-sm">Contenido top:</span>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {influencer.topContent.map(content => (
                              <span key={content} className="bg-yellow-500/20 text-yellow-400 text-xs px-2 py-1 rounded">
                                {content}
                              </span>
                            ))}
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className="text-white font-bold">{influencer.recentViral.title}</div>
                          <div className="text-green-400 text-sm">{(influencer.recentViral.views / 1000000).toFixed(1)}M views</div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default RankingsChartsModule;
