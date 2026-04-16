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
    return (
        <div className="p-6 lg:p-10 min-h-screen">
            <div className="max-w-7xl mx-auto mb-8">
                <header className="flex flex-col md:flex-row justify-between items-end gap-6">
                    <div>
                        <h2 className="text-3xl font-display font-bold flex items-center gap-3">
                            <span>🎵</span>
                            <span className="text-glow-secondary">Música Viral</span>
                        </h2>
                        <p className="text-text-secondary mt-2">Radar algorítmico de sonidos en tendencia y predicción de audio viral por plataforma.</p>
                    </div>
                </header>
            </div>

            {/* Platform Filter Tabs */}
            <div className="max-w-7xl mx-auto mb-6">
                <div className="glass-panel p-4 flex flex-wrap gap-2">
                    {platforms.map((platform) => (
                        <motion.button
                            key={platform.id}
                            onClick={() => setActivePlatform(platform.id)}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold font-mono tracking-wide transition-all ${activePlatform === platform.id
                                ? 'bg-primary/20 text-primary border border-primary/50 shadow-[0_0_15px_rgba(0,240,255,0.2)]'
                                : 'bg-surface text-text-muted hover:text-white hover:bg-surface-hover border border-white/5'
                                }`}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <span className="text-base">{platform.icon}</span>
                            <span>{platform.label.toUpperCase()}</span>
                        </motion.button>
                    ))}
                </div>
            </div>

            {/* Music Content */}
            <div className="px-0">
                <MusicTrendsModule activePlatform={activePlatform} />
            </div>
        </div>
    );
};

export default ViralMusicTracker;
