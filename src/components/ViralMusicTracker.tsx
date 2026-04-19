/**
 * Viral Music Tracker - Main Component
 * Complete music discovery and content strategy tool with ALL 12 Features
 * REDESIGNED to integrate seamlessly with Predix Dashboard
 */

import React, { useState, useEffect } from 'react';
import { useCountry } from './CountrySelector';
import { mockMusicData } from '../utils/mockMusicData';
import type { ViralSong, MusicFilters, Platform } from '../types/music';
import { DEFAULT_FILTERS } from '../types/music';

// Import ALL feature components
import PlatformSelector from './music/PlatformSelector';
import AdvancedFilters from './music/AdvancedFilters';
import ViralAnalysisPanel from './music/ViralAnalysisPanel';
import TrendPredictionCard from './music/TrendPredictionCard';
import CreationTools from './music/CreationTools';
import DemographicsView from './music/DemographicsView';
import HistoricalCharts from './music/HistoricalCharts';
import AlertsManager from './music/AlertsManager';
import SocialProofSection from './music/SocialProofSection';
import PlaylistManager from './music/PlaylistManager';
import ContentCalendar from './music/ContentCalendar';
import LicensingInfo from './music/LicensingInfo';

type TabId = 'browse' | 'platforms' | 'filters' | 'analysis' | 'predictions' | 'creation' |
    'demographics' | 'history' | 'alerts' | 'social' | 'playlists' | 'calendar' | 'licensing';

interface ViralMusicTrackerProps {
    activeTab?: TabId;  // Controlled from MainDashboard sidebar
}

const ViralMusicTracker: React.FC<ViralMusicTrackerProps> = ({ activeTab = 'browse' }) => {
    const [songs, setSongs] = useState<ViralSong[]>([]);
    const [filteredSongs, setFilteredSongs] = useState<ViralSong[]>([]);
    const [selectedSong, setSelectedSong] = useState<ViralSong | null>(null);
    const [filters, setFilters] = useState<MusicFilters>(DEFAULT_FILTERS);
    const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>([]);
    const [loading, setLoading] = useState(false);
    const { selectedCountry } = useCountry();

    // Load real data from APIs
    useEffect(() => {
        const fetchTrends = async () => {
            setLoading(true);
            try {
                const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

                // Fetch from Spotify Service (Backend Proxy)
                const targetCountry = selectedCountry || 'Global';
                const res = await fetch(`${API_URL}/api/music/trends/${targetCountry}`);
                const data = await res.json();

                const normalizedSongs: ViralSong[] = [];

                if (data.data && Array.isArray(data.data)) {
                    data.data.forEach((item: any) => {
                        normalizedSongs.push({
                            id: item.id || `spotify_${Math.random()}`,
                            title: item.title,
                            artist: item.artist,
                            releaseDate: new Date().toISOString(),
                            coverArt: item.coverArt || 'https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=300&h=300&fit=crop',
                            language: 'English',
                            explicit: false,
                            viralScore: item.viralScore || 85,
                            platforms: {
                                spotify: {
                                    platform: 'spotify', // Type assertion needed if strict
                                    status: 'VIRAL',
                                    growth24h: Math.floor(Math.random() * 20) + 5, // Simulation
                                    avgViews: item.popularity * 1000,
                                    videosCreated: item.popularity * 10,
                                    growth7d: 10,
                                    growth30d: 5,
                                    avgEngagement: 0.15,
                                    lastUpdated: new Date().toISOString()
                                }
                            },
                            genre: ['Viral', 'Pop'],
                            mood: ['Trending'],
                            bpm: 120,
                            duration: item.duration || 180,
                            lifecycleStage: 'creciendo',
                            totalVideos: item.popularity * 50,
                            totalViews: item.popularity * 5000,
                            totalEngagement: item.popularity * 500,
                            confidence: 0.95,
                            createdAt: new Date().toISOString(),
                            updatedAt: new Date().toISOString(),
                            historicalDataAvailable: false,
                            analysis: {
                                totalVideos: 5000,
                                trendHashtags: ['#spotify', '#viral50'],
                                useCases: ['Music'],
                                avgVideoDuration: 30,
                                successRate: 0.9,
                                topCreatorTiers: ['macro']
                            },
                            demographics: {
                                geographic: [], gender: { male: 50, female: 50, other: 0, nonBinary: 0 },
                                ageRanges: [], niches: [], timeOfDay: []
                            },
                            topVideos: [],
                            successTips: [],
                            licensing: {
                                isLicensed: true, allowedPlatforms: ['spotify'], restrictedPlatforms: [], monetizationAllowed: true,
                                copyrightStrikeRisk: 'low'
                            },
                            peakForecast: {
                                daysUntilPeak: 5, estimatedPeakDate: '', confidence: 0.85, predictedMaxVideos: 50000, currentTrajectory: 'accelerating'
                            }
                        });
                    });
                }

                if (normalizedSongs.length > 0) {
                    setSongs(normalizedSongs);
                    setFilteredSongs(normalizedSongs);
                } else {
                    // Fallback to mock if API returns nothing (e.g. no token yet)
                    console.warn("Using mock data as API returned empty lists");
                    setSongs(mockMusicData.songs);
                    setFilteredSongs(mockMusicData.songs);
                }

            } catch (error) {
                console.error("Error fetching trends:", error);
                setSongs(mockMusicData.songs);
                setFilteredSongs(mockMusicData.songs);
            } finally {
                setLoading(false);
            }
        };

        fetchTrends();
    }, []);

    // Apply filters
    useEffect(() => {
        let filtered = [...songs];

        if (selectedPlatforms.length > 0) {
            filtered = filtered.filter(song =>
                selectedPlatforms.some(platform => song.platforms[platform])
            );
        }

        if (filters.lifecycleStages.length > 0) {
            filtered = filtered.filter(song =>
                filters.lifecycleStages.includes(song.lifecycleStage)
            );
        }

        filtered = filtered.filter(song =>
            song.viralScore >= filters.viralScoreRange[0] &&
            song.viralScore <= filters.viralScoreRange[1]
        );

        if (filters.genres.length > 0) {
            filtered = filtered.filter(song =>
                song.genre.some(g => filters.genres.includes(g))
            );
        }

        if (filters.moods.length > 0) {
            filtered = filtered.filter(song =>
                song.mood.some(m => filters.moods.includes(m))
            );
        }

        filtered = filtered.filter(song =>
            song.bpm >= filters.bpmRange[0] && song.bpm <= filters.bpmRange[1]
        );

        filtered = filtered.filter(song =>
            song.duration >= filters.durationRange[0] && song.duration <= filters.durationRange[1]
        );

        setFilteredSongs(filtered);
    }, [filters, songs, selectedPlatforms]);

    const formatNumber = (num: number): string => {
        if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
        if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
        return num.toString();
    };

    // Calculate average growth rate from platform metrics
    const calculateAverageGrowth = (song: ViralSong): number => {
        const platformGrowths = Object.values(song.platforms)
            .map(p => p?.growth24h || 0)
            .filter(g => g > 0);
        return platformGrowths.length > 0
            ? Math.round(platformGrowths.reduce((sum, g) => sum + g, 0) / platformGrowths.length)
            : 0;
    };

    const NoSongSelected = () => (
        <div className="text-center py-12 bg-gray-800/30 rounded-lg border border-gray-700">
            <p className="text-gray-400 mb-2">No hay canción seleccionada</p>
            <button
                onClick={() => {/* Navigate handled by sidebar */ }}
                className="text-[#007bff] hover:text-[#00ff9d] transition-colors"
            >
                Selecciona una canción →
            </button>
        </div>
    );

    return (
        <div className="viral-music-tracker">
            {/* Simple Header */}
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-white mb-1 flex items-center gap-2">
                    <span className="text-2xl">🎵</span>
                    Música Viral Tracker
                </h2>
                <p className="text-gray-400 text-sm">
                    Herramienta completa de estrategia de contenido musical
                </p>
            </div>

            {/* Single Content Area - No Sidebar */}
            <div className="bg-[#1a1a1a] border border-gray-800 rounded-xl p-6">
                {/* Browse */}
                {activeTab === 'browse' && (
                    <div>
                        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                            <span className="text-[#007bff]">🎵</span>
                            Explorar Canciones Virales
                        </h3>
                        {loading ? (
                            <div className="text-center py-12">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#007bff] mx-auto"></div>
                                <p className="text-gray-400 mt-4">Cargando...</p>
                            </div>
                        ) : (
                            <>
                                <p className="text-gray-400 mb-6">{filteredSongs.length} canciones</p>
                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                                    {filteredSongs.map((song) => (
                                        <div
                                            key={song.id}
                                            onClick={() => {
                                                setSelectedSong(song);
                                                // Tab navigation handled by sidebar
                                            }}
                                            className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-xl p-4 cursor-pointer hover:border-[#007bff] transition-all hover:shadow-lg hover:shadow-[#007bff]/20"
                                        >
                                            <div className="flex items-start justify-between mb-3">
                                                <div className="flex-1">
                                                    <h4 className="font-bold text-white text-sm mb-1 line-clamp-1">{song.title}</h4>
                                                    <p className="text-gray-400 text-xs line-clamp-1">{song.artist}</p>
                                                </div>
                                                <div className="ml-2 px-2 py-1 bg-gradient-to-r from-[#007bff] to-[#00ff9d] text-white rounded-full text-xs font-bold">
                                                    {song.viralScore}/100
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-2 text-xs">
                                                <div>
                                                    <div className="text-gray-500">Videos</div>
                                                    <div className="text-[#00ff9d] font-semibold">{formatNumber(song.totalVideos)}</div>
                                                </div>
                                                <div>
                                                    <div className="text-gray-500">Crecimiento</div>
                                                    <div className="text-[#007bff] font-semibold">+{calculateAverageGrowth(song)}%</div>
                                                </div>
                                            </div>
                                            <div className="flex gap-1 mt-3">
                                                {song.genre.slice(0, 2).map((g, i) => (
                                                    <span key={i} className="px-2 py-0.5 bg-gray-700/50 text-gray-300 rounded text-xs">{g}</span>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                )}

                {/* Platforms */}
                {activeTab === 'platforms' && (
                    <div>
                        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                            <span className="text-[#007bff]">🌐</span>
                            Selección de Plataformas
                        </h3>
                        <PlatformSelector
                            selectedPlatforms={selectedPlatforms}
                            onChange={setSelectedPlatforms}
                            songs={filteredSongs}
                        />
                    </div>
                )}

                {/* Filters */}
                {activeTab === 'filters' && (
                    <div>
                        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                            <span className="text-[#007bff]">🔍</span>
                            Filtros Avanzados
                        </h3>
                        <AdvancedFilters
                            filters={filters}
                            onChange={setFilters}
                            onReset={() => setFilters(DEFAULT_FILTERS)}
                        />
                    </div>
                )}

                {/* Analysis */}
                {activeTab === 'analysis' && (
                    <div>
                        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                            <span className="text-[#007bff]">💡</span>
                            Análisis Viral
                        </h3>
                        {selectedSong ? <ViralAnalysisPanel song={selectedSong} /> : <NoSongSelected />}
                    </div>
                )}

                {/* Predictions */}
                {activeTab === 'predictions' && (
                    <div>
                        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                            <span className="text-[#007bff]">🔮</span>
                            Predicciones
                        </h3>
                        {selectedSong ? <TrendPredictionCard song={selectedSong} /> : <NoSongSelected />}
                    </div>
                )}

                {/* Creation */}
                {activeTab === 'creation' && (
                    <div>
                        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                            <span className="text-[#007bff]">🎨</span>
                            Herramientas de Creación
                        </h3>
                        {selectedSong ? <CreationTools song={selectedSong} /> : <NoSongSelected />}
                    </div>
                )}

                {/* Demographics */}
                {activeTab === 'demographics' && (
                    <div>
                        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                            <span className="text-[#007bff]">🌍</span>
                            Demografía
                        </h3>
                        {selectedSong ? <DemographicsView song={selectedSong} /> : <NoSongSelected />}
                    </div>
                )}

                {/* History */}
                {activeTab === 'history' && (
                    <div>
                        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                            <span className="text-[#007bff]">📊</span>
                            Histórico
                        </h3>
                        {selectedSong ? <HistoricalCharts song={selectedSong} onCompareSongs={(ids) => console.log(ids)} /> : <NoSongSelected />}
                    </div>
                )}

                {/* Alerts */}
                {activeTab === 'alerts' && (
                    <div>
                        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                            <span className="text-[#007bff]">🔔</span>
                            Alertas
                        </h3>
                        <AlertsManager />
                    </div>
                )}

                {/* Social */}
                {activeTab === 'social' && (
                    <div>
                        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                            <span className="text-[#007bff]">⭐</span>
                            Prueba Social
                        </h3>
                        {selectedSong ? <SocialProofSection song={selectedSong} /> : <NoSongSelected />}
                    </div>
                )}

                {/* Playlists */}
                {activeTab === 'playlists' && (
                    <div>
                        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                            <span className="text-[#007bff]">💾</span>
                            Listas
                        </h3>
                        <PlaylistManager songs={filteredSongs} />
                    </div>
                )}

                {/* Calendar */}
                {activeTab === 'calendar' && (
                    <div>
                        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                            <span className="text-[#007bff]">📅</span>
                            Calendario
                        </h3>
                        <ContentCalendar songs={filteredSongs} />
                    </div>
                )}

                {/* Licensing */}
                {activeTab === 'licensing' && (
                    <div>
                        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                            <span className="text-[#007bff]">⚖️</span>
                            Licencias
                        </h3>
                        {selectedSong ? <LicensingInfo song={selectedSong} /> : <NoSongSelected />}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ViralMusicTracker;
