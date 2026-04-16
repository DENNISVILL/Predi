/**
 * FEATURE #5: Creation Integration
 * Complete content creation tools with AI assistance
 */

import React, { useState } from 'react';
import type { ViralSong, ContentIdea, VideoTemplate, ContentType } from '../../types/music';

interface CreationToolsProps {
    song: ViralSong;
    onUseInPost?: (song: ViralSong) => void;
    className?: string;
}

const CreationTools: React.FC<CreationToolsProps> = ({
    song,
    onUseInPost,
    className = '',
}) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [showIdeas, setShowIdeas] = useState(false);
    const [showTemplates, setShowTemplates] = useState(false);
    const [selectedContentType, setSelectedContentType] = useState<ContentType>('Dance');

    // Mock content ideas (in real app, would come from AI service)
    const contentIdeas: ContentIdea[] = [
        {
            id: '1',
            type: 'Dance',
            title: 'Trending Dance Challenge',
            description: 'Learn and perform the viral dance move that everyone is doing',
            caption: `Just learned the ${song.analysis.challengeName}! 🔥 Who else is trying this? Tag me! 💃`,
            hashtags: ['#' + song.title.replace(/\s+/g, ''), song.analysis.challengeName || '#Dance', '#Viral', '#FYP', '#Trending'],
            hooks: [
                'You won\'t believe how easy this dance is...',
                'POV: You finally learned the trending dance',
                'Watch till the end for the secret move 👀',
            ],
            tips: [
                'Film in good lighting (natural light works best)',
                'Use the first 15 seconds of the song',
                'Add a unique twist to stand out',
            ],
            difficulty: 'medium',
            estimatedViews: '100K-500K',
            successRate: 0.75,
        },
        {
            id: '2',
            type: 'Transition',
            title: 'Before/After Transformation',
            description: 'Show a dramatic transformation using smooth transitions',
            caption: `The glow up is REAL ✨ Using ${song.title} because it hits different 💯`,
            hashtags: ['#Transformation', '#BeforeAfter', '#GlowUp', '#' + song.title.replace(/\s+/g, ''), '#Transition'],
            hooks: [
                'The transformation you didn\'t see coming...',
                'Wait for the transition at 0:08',
                'Before vs After using this sound 👀',
            ],
            tips: [
                'Match the transition to the beat drop',
                'Keep camera steady for both clips',
                'Use the same angle for before/after',
            ],
            difficulty: 'easy',
            estimatedViews: '50K-200K',
            successRate: 0.85,
        },
        {
            id: '3',
            type: 'Lip Sync',
            title: 'Dramatic Lip Sync',
            description: 'Expressive lip sync with emotion and personality',
            caption: `This song just HITS 🎯 ${song.title} on repeat all day! ${song.analysis.challengeName}`,
            hashtags: ['#LipSync', '#' + song.artist.replace(/\s+/g, ''), '#Mood', '#Relatable', '#FYP'],
            hooks: [
                'When the lyrics are TOO relatable...',
                'POV: This song is your entire personality',
                'Singing this in my head 24/7',
            ],
            tips: [
                'Exaggerate facial expressions',
                'Know the lyrics perfectly',
                'Add your own flair to it',
            ],
            difficulty: 'easy',
            estimatedViews: '30K-150K',
            successRate: 0.70,
        },
        {
            id: '4',
            type: 'POV',
            title: 'Relatable POV Scenario',
            description: 'Create a relatable point-of-view situation',
            caption: `POV: You're vibing to ${song.title} at 3am 🌙 Who can relate? 😅`,
            hashtags: ['#POV', '#Relatable', '#' + song.title.replace(/\s+/g, ''), '#Mood', '#Vibes'],
            hooks: [
                'POV: *insert relatable situation*',
                'This is TOO accurate',
                'Tell me you relate without telling me',
            ],
            tips: [
                'Pick a highly relatable scenario',
                'Use text overlays for context',
                'Engage with comments for more ideas',
            ],
            difficulty: 'easy',
            estimatedViews: '20K-100K',
            successRate: 0.65,
        },
        {
            id: '5',
            type: 'Tutorial',
            title: 'Dance Tutorial Breakdown',
            description: 'Step-by-step tutorial of the viral dance',
            caption: `Learn the ${song.analysis.challengeName} in 60 seconds! 🎓 Save this for later 📌`,
            hashtags: ['#Tutorial', '#DanceTutorial', '#LearnOnTikTok', song.analysis.challengeName || '#Dance', '#HowTo'],
            hooks: [
                'Here\'s the EASIEST way to learn this dance',
                'Tutorial you actually need 📚',
                'Slow-mo breakdown coming up',
            ],
            tips: [
                'Break it down into simple steps',
                'Use slow motion for complex parts',
                'Encourage viewers to try it',
            ],
            difficulty: 'medium',
            estimatedViews: '50K-300K',
            successRate: 0.80,
        },
    ];

    // Mock video templates
    const videoTemplates: VideoTemplate[] = [
        {
            id: 't1',
            name: 'Quick Dance Transition',
            description: '3-scene dance with smooth transitions on beat drops',
            thumbnail: '/templates/dance-transition.jpg',
            duration: 25,
            scenes: [
                { id: 's1', order: 1, duration: 8, type: 'intro', instruction: 'Start with a freeze pose, camera close-up' },
                { id: 's2', order: 2, duration: 12, type: 'main', instruction: 'Dance routine (main chorus)' },
                { id: 's3', order: 3, duration: 5, type: 'outro', instruction: 'End with signature move' },
            ],
            difficulty: 'easy',
            trending: true,
            usageCount: 15420,
        },
        {
            id: 't2',
            name: 'Before/After Transformation',
            description: 'Classic before-after with snap transition',
            thumbnail: '/templates/transformation.jpg',
            duration: 15,
            scenes: [
                { id: 's1', order: 1, duration: 7, type: 'intro', instruction: '"Before" state - casual/unready look' },
                { id: 's2', order: 2, duration: 0, type: 'transition', instruction: 'Snap transition on beat' },
                { id: 's3', order: 3, duration: 8, type: 'main', instruction: '"After" state - transformed look' },
            ],
            difficulty: 'easy',
            trending: true,
            usageCount: 23100,
        },
        {
            id: 't3',
            name: 'Lip Sync with Text',
            description: 'Expressive lip sync with on-screen text captions',
            thumbnail: '/templates/lipsync-text.jpg',
            duration: 20,
            scenes: [
                { id: 's1', order: 1, duration: 20, type: 'main', instruction: 'Lip sync with exaggerated expressions, add text overlays' },
            ],
            difficulty: 'easy',
            trending: false,
            usageCount: 8900,
        },
    ];

    const handleUseInPost = () => {
        if (onUseInPost) {
            onUseInPost(song);
        } else {
            // Fallback: open posts manager (you'd integrate this with your routing)
            alert(`Opening Posts Manager with ${song.title}...`);
        }
    };

    const handleDownload = (format: 'mp3' | 'wav') => {
        // In real app, would trigger actual download
        alert(`Downloading ${song.title} as ${format.toUpperCase()}...`);
    };

    return (
        <div className={`creation-tools ${className}`}>
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-t-xl p-6">
                <h2 className="text-2xl font-bold mb-2">
                    <span className="mr-2">🎬</span>
                    Herramientas de Creación
                </h2>
                <p className="text-purple-100">Todo lo que necesitas para crear contenido viral</p>
            </div>

            <div className="bg-white rounded-b-xl shadow-lg p-6 space-y-6">
                {/* Audio Preview Player */}
                <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-6 border-2 border-purple-200">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">
                        <span className="mr-2">🎵</span>
                        Preview del Audio
                    </h3>

                    <div className="bg-white rounded-lg p-4">
                        <div className="flex items-center gap-4 mb-4">
                            <button
                                onClick={() => setIsPlaying(!isPlaying)}
                                className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl transition-all ${isPlaying
                                        ? 'bg-purple-600 text-white shadow-lg animate-pulse'
                                        : 'bg-gray-200 text-gray-600 hover:bg-purple-100'
                                    }`}
                            >
                                {isPlaying ? '⏸️' : '▶️'}
                            </button>

                            <div className="flex-1">
                                <div className="text-sm font-bold text-gray-900">{song.title}</div>
                                <div className="text-xs text-gray-600">{song.artist}</div>
                                <div className="mt-2 flex items-center gap-2">
                                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                                        <div
                                            className="bg-purple-600 h-2 rounded-full transition-all"
                                            style={{ width: isPlaying ? '45%' : '0%' }}
                                        />
                                    </div>
                                    <span className="text-xs text-gray-600">0:30</span>
                                </div>
                            </div>

                            <div className="text-right">
                                <div className="text-xs text-gray-600 mb-1">BPM</div>
                                <div className="text-lg font-bold text-purple-600">{song.bpm}</div>
                            </div>
                        </div>

                        {/* Waveform Visualization */}
                        <div className="flex items-end justify-center gap-1 h-12">
                            {Array.from({ length: 40 }).map((_, i) => (
                                <div
                                    key={i}
                                    className={`flex-1 rounded-t transition-all ${isPlaying && i < 20 ? 'bg-purple-600' : 'bg-gray-300'
                                        }`}
                                    style={{
                                        height: `${Math.random() * 100}%`,
                                        animation: isPlaying ? 'pulse 0.5s ease-in-out infinite' : 'none',
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Main Action Button */}
                <button
                    onClick={handleUseInPost}
                    className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-4 rounded-xl text-lg font-bold hover:from-purple-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
                >
                    <span className="text-2xl">🎬</span>
                    Usar en Post
                    <span className="text-sm opacity-75">→ Abre Posts Manager</span>
                </button>

                {/* AI Content Ideas */}
                <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-xl p-6 border-2 border-pink-200">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-gray-900">
                            <span className="mr-2">🤖</span>
                            Ideas de Contenido IA
                        </h3>
                        <button
                            onClick={() => setShowIdeas(!showIdeas)}
                            className="text-purple-600 hover:text-purple-700 font-semibold text-sm"
                        >
                            {showIdeas ? 'Ocultar ▲' : 'Ver Ideas ▼'}
                        </button>
                    </div>

                    {showIdeas && (
                        <div className="space-y-4">
                            {/* Content Type Selector */}
                            <div className="flex flex-wrap gap-2 mb-4">
                                {(['Dance', 'Transition', 'Lip Sync', 'POV', 'Tutorial'] as ContentType[]).map(type => (
                                    <button
                                        key={type}
                                        onClick={() => setSelectedContentType(type)}
                                        className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${selectedContentType === type
                                                ? 'bg-pink-600 text-white shadow-md'
                                                : 'bg-white text-gray-700 hover:bg-pink-100'
                                            }`}
                                    >
                                        {type}
                                    </button>
                                ))}
                            </div>

                            {/* Ideas List */}
                            <div className="space-y-4">
                                {contentIdeas.filter(idea => idea.type === selectedContentType).map(idea => (
                                    <div key={idea.id} className="bg-white rounded-lg p-4 border-2 border-pink-200 hover:border-pink-400 transition-all">
                                        <div className="flex items-start justify-between mb-2">
                                            <div>
                                                <h4 className="font-bold text-gray-900">{idea.title}</h4>
                                                <p className="text-sm text-gray-600 mt-1">{idea.description}</p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className={`px-2 py-1 rounded text-xs font-bold ${idea.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
                                                        idea.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                                                            'bg-red-100 text-red-700'
                                                    }`}>
                                                    {idea.difficulty}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Caption */}
                                        <div className="bg-purple-50 rounded-lg p-3 mb-3">
                                            <div className="text-xs font-semibold text-purple-700 mb-1">💬 Caption Sugerido:</div>
                                            <p className="text-sm text-gray-800">{idea.caption}</p>
                                        </div>

                                        {/* Hashtags */}
                                        <div className="flex flex-wrap gap-2 mb-3">
                                            {idea.hashtags.map(tag => (
                                                <span key={tag} className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-semibold">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>

                                        {/* Hooks */}
                                        <div className="mb-3">
                                            <div className="text-xs font-semibold text-gray-700 mb-2">🎣 Hook Options:</div>
                                            {idea.hooks.map((hook, i) => (
                                                <div key={i} className="text-sm text-gray-600 mb-1">• {hook}</div>
                                            ))}
                                        </div>

                                        {/* Metrics */}
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="bg-green-50 rounded p-2 text-center">
                                                <div className="text-xs text-green-600">Est. Views</div>
                                                <div className="text-sm font-bold text-green-700">{idea.estimatedViews}</div>
                                            </div>
                                            <div className="bg-blue-50 rounded p-2 text-center">
                                                <div className="text-xs text-blue-600">Success Rate</div>
                                                <div className="text-sm font-bold text-blue-700">{Math.round(idea.successRate * 100)}%</div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Video Templates */}
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 border-2 border-blue-200">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-gray-900">
                            <span className="mr-2">📹</span>
                            Templates de Video
                        </h3>
                        <button
                            onClick={() => setShowTemplates(!showTemplates)}
                            className="text-blue-600 hover:text-blue-700 font-semibold text-sm"
                        >
                            {showTemplates ? 'Ocultar ▲' : 'Ver Templates ▼'}
                        </button>
                    </div>

                    {showTemplates && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {videoTemplates.map(template => (
                                <div key={template.id} className="bg-white rounded-lg p-4 border-2 border-blue-200 hover:border-blue-400 transition-all">
                                    <div className="flex items-start justify-between mb-3">
                                        <div>
                                            <h4 className="font-bold text-gray-900 flex items-center gap-2">
                                                {template.name}
                                                {template.trending && (
                                                    <span className="px-2 py-0.5 bg-red-500 text-white text-xs rounded-full animate-pulse">
                                                        🔥 Trending
                                                    </span>
                                                )}
                                            </h4>
                                            <p className="text-xs text-gray-600 mt-1">{template.description}</p>
                                        </div>
                                    </div>

                                    {/* Template Stats */}
                                    <div className="grid grid-cols-3 gap-2 mb-3">
                                        <div className="bg-gray-50 rounded p-2 text-center">
                                            <div className="text-xs text-gray-600">Duration</div>
                                            <div className="text-sm font-bold">{template.duration}s</div>
                                        </div>
                                        <div className="bg-gray-50 rounded p-2 text-center">
                                            <div className="text-xs text-gray-600">Scenes</div>
                                            <div className="text-sm font-bold">{template.scenes.length}</div>
                                        </div>
                                        <div className="bg-gray-50 rounded p-2 text-center">
                                            <div className="text-xs text-gray-600">Used</div>
                                            <div className="text-sm font-bold">{(template.usageCount / 1000).toFixed(1)}K</div>
                                        </div>
                                    </div>

                                    {/* Scenes Breakdown */}
                                    <div className="space-y-2 mb-3">
                                        {template.scenes.map(scene => (
                                            <div key={scene.id} className="bg-blue-50 rounded p-2">
                                                <div className="flex items-center justify-between mb-1">
                                                    <span className="text-xs font-semibold text-blue-700">
                                                        Scene {scene.order}: {scene.type}
                                                    </span>
                                                    <span className="text-xs text-gray-600">{scene.duration}s</span>
                                                </div>
                                                <div className="text-xs text-gray-700">{scene.instruction}</div>
                                            </div>
                                        ))}
                                    </div>

                                    <button className="w-full bg-blue-600 text-white py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-all">
                                        Usar Template
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Download Section */}
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">
                        <span className="mr-2">💾</span>
                        Descargar Audio
                    </h3>

                    <div className="grid grid-cols-2 gap-4">
                        <button
                            onClick={() => handleDownload('mp3')}
                            className="bg-white border-2 border-green-500 text-green-700 py-3 rounded-lg font-bold hover:bg-green-50 transition-all flex flex-col items-center gap-2"
                        >
                            <span className="text-2xl">🎵</span>
                            <span>Descargar MP3</span>
                            <span className="text-xs opacity-75">Preview (30s)</span>
                        </button>

                        <button
                            onClick={() => handleDownload('wav')}
                            className="bg-white border-2 border-green-500 text-green-700 py-3 rounded-lg font-bold hover:bg-green-50 transition-all flex flex-col items-center gap-2"
                        >
                            <span className="text-2xl">🎼</span>
                            <span>Descargar WAV</span>
                            <span className="text-xs opacity-75">Alta Calidad</span>
                        </button>
                    </div>

                    <div className="mt-4 bg-yellow-50 border-2 border-yellow-300 rounded-lg p-3">
                        <div className="flex items-start gap-2">
                            <span className="text-yellow-600">⚠️</span>
                            <div className="text-xs text-gray-700">
                                <strong>Nota:</strong> Verifica los derechos de licencia antes de usar comercialmente.
                                Ver sección "Licencias y Copyright" para más detalles.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreationTools;
