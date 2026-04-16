import React, { useState } from 'react';
import { motion } from 'framer-motion';
import MusicTrendsModule from './MusicTrendsModule';

const ViralMusicTracker = () => {
    const [activePlatform, setActivePlatform] = useState('all');

    const platforms = [
        { id: 'all', label: 'Todas', icon: '🎵' },
        { id: 'tiktok', label: 'TikTok', icon: '🎬' },
        { id: 'instagram', label: 'Instagram', icon: '📸' },
        { id: 'facebook', label: 'Facebook', icon: '👥' },
        { id: 'youtube', label: 'YouTube', icon: '📺' },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
            {/* Platform Filter Tabs */}
            <div className="bg-gray-900/95 backdrop-blur-sm border-b border-gray-700/50 px-6 py-4 transition-all">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                                <span>🎵</span> Música Viral
                            </h2>
                            <p className="text-sm text-gray-400 mt-1">Explora música por plataforma</p>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {platforms.map((platform) => (
                            <motion.button
                                key={platform.id}
                                onClick={() => setActivePlatform(platform.id)}
                                className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${activePlatform === platform.id
                                    ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg shadow-pink-500/30'
                                    : 'bg-gray-800/50 text-gray-400 hover:text-white hover:bg-gray-700/50 border border-gray-700'
                                    }`}
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                            >
                                <span className="text-base">{platform.icon}</span>
                                <span>{platform.label}</span>
                            </motion.button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Music Content */}
            <div className="px-6 py-6">
                <MusicTrendsModule activePlatform={activePlatform} />
            </div>
        </div>
    );
};

export default ViralMusicTracker;
