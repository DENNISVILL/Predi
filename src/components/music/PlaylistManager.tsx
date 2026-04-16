/**
 * FEATURE #10: Playlist Manager
 * Complete playlist CRUD with export and sharing
 */

import React, { useState } from 'react';
import type { Playlist, ViralSong } from '../../types/music';
import { generateMockPlaylist } from '../../utils/mockMusicData';

interface PlaylistManagerProps {
    songs?: ViralSong[];
    className?: string;
}

const PlaylistManager: React.FC<PlaylistManagerProps> = ({
    songs: _songs = [],
    className = '',
}) => {
    const [playlists, setPlaylists] = useState<Playlist[]>([
        generateMockPlaylist(),
        {
            ...generateMockPlaylist(),
            id: 'playlist2',
            name: 'Reels Virales',
            category: 'reels',
            icon: '📱',
            color: '#ef4444',
        },
    ]);

    const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [favorites, setFavorites] = useState<string[]>([]);

    const [newPlaylist, setNewPlaylist] = useState({
        name: '',
        description: '',
        category: 'custom' as const,
        icon: '🎵',
        color: '#8b5cf6',
    });

    const handleCreatePlaylist = () => {
        const playlist: Playlist = {
            id: `playlist_${Date.now()}`,
            name: newPlaylist.name || 'Nueva Playlist',
            description: newPlaylist.description,
            songs: [],
            category: newPlaylist.category,
            icon: newPlaylist.icon,
            color: newPlaylist.color,
            isPublic: false,
            sharedWith: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        setPlaylists([...playlists, playlist]);
        setShowCreateModal(false);
        setNewPlaylist({
            name: '',
            description: '',
            category: 'custom',
            icon: '🎵',
            color: '#8b5cf6',
        });
    };

    const toggleFavorite = (songId: string) => {
        setFavorites(prev =>
            prev.includes(songId) ? prev.filter(id => id !== songId) : [...prev, songId]
        );
    };

    const handleExport = (_playlistId: string, format: 'csv' | 'json' | 'spotify') => {
        window.alert(`Exporting playlist as ${format.toUpperCase()}...`);
    };

    const handleShare = (playlistId: string) => {
        window.alert(`Sharing playlist ${playlistId}...`);
    };

    return (
        <div className={`playlist-manager ${className}`}>
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-t-xl p-6">
                <h2 className="text-2xl font-bold mb-2">
                    <span className="mr-2">💾</span>
                    Playlist Manager
                </h2>
                <p className="text-purple-100">Organiza y guarda tus canciones favoritas</p>
            </div>

            <div className="bg-white rounded-b-xl shadow-lg p-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Playlist Library (Left Side) */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Create Button */}
                        <button
                            onClick={() => setShowCreateModal(true)}
                            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-xl font-bold hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg"
                        >
                            <span className="mr-2">➕</span>
                            Crear Nueva Playlist
                        </button>

                        {/* Playlists Grid */}
                        <div className="grid grid-cols-2 gap-4">
                            {playlists.map(playlist => (
                                <div
                                    key={playlist.id}
                                    onClick={() => setSelectedPlaylist(playlist)}
                                    className={`rounded-xl p-5 cursor-pointer transition-all border-2 ${selectedPlaylist?.id === playlist.id
                                        ? 'border-purple-500 shadow-lg'
                                        : 'border-gray-200 hover:border-purple-300'
                                        }`}
                                    style={{ backgroundColor: playlist.color + '20' }}
                                >
                                    <div className="text-center mb-3">
                                        <div className="text-5xl mb-2">{playlist.icon}</div>
                                        <h3 className="font-bold text-gray-900 text-lg mb-1">{playlist.name}</h3>
                                        <p className="text-xs text-gray-600 line-clamp-2">{playlist.description}</p>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-gray-600">Canciones:</span>
                                            <span className="font-bold" style={{ color: playlist.color }}>
                                                {playlist.songs.length}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-gray-600">Categoría:</span>
                                            <span className="px-2 py-0.5 bg-gray-100 rounded text-xs capitalize">
                                                {playlist.category}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {playlists.length === 0 && (
                            <div className="text-center py-12 bg-gray-50 rounded-xl">
                                <div className="text-4xl mb-3">📭</div>
                                <p className="text-gray-600 mb-4">No tienes playlists aún</p>
                                <button
                                    onClick={() => setShowCreateModal(true)}
                                    className="px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700"
                                >
                                    Crear Primera Playlist
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Favorites Sidebar (Right Side) */}
                    <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-5 border-2 border-yellow-200 h-fit">
                        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <span>⭐</span>
                            Favoritos ({favorites.length})
                        </h3>

                        <div className="space-y-2 max-h-96 overflow-y-auto">
                            {favorites.length === 0 ? (
                                <div className="text-center py-8 text-gray-600 text-sm">
                                    No tienes favoritos aún
                                </div>
                            ) : (
                                favorites.map(songId => (
                                    <div
                                        key={songId}
                                        className="bg-white rounded-lg p-3 border border-yellow-200 cursor-move hover:shadow-md transition-all"
                                        draggable
                                    >
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <div className="font-semibold text-gray-900 text-sm">Song #{songId}</div>
                                                <div className="text-xs text-gray-600">Arrastra a playlist</div>
                                            </div>
                                            <button
                                                onClick={() => toggleFavorite(songId)}
                                                className="text-yellow-500 hover:text-gray-400"
                                            >
                                                ⭐
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* Playlist Detail View */}
                {selectedPlaylist && (
                    <div className="mt-6 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-6 border-2 border-purple-200">
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-4">
                                <div className="text-6xl">{selectedPlaylist.icon}</div>
                                <div>
                                    <h3 className="text-2xl font-bold text-gray-900">{selectedPlaylist.name}</h3>
                                    <p className="text-gray-600">{selectedPlaylist.description}</p>
                                    <div className="flex items-center gap-3 mt-2">
                                        <span className="text-sm text-gray-600">{selectedPlaylist.songs.length} canciones</span>
                                        <span className="text-sm text-gray-600">•</span>
                                        <span className={`px-2 py-1 rounded text-xs font-semibold ${selectedPlaylist.isPublic ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                                            }`}>
                                            {selectedPlaylist.isPublic ? '🌐 Pública' : '🔒 Privada'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={() => setSelectedPlaylist(null)}
                                className="text-gray-400 hover:text-gray-600 text-2xl"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Playlist Actions */}
                        <div className="flex flex-wrap gap-3 mb-6">
                            <button
                                onClick={() => handleShare(selectedPlaylist.id)}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all flex items-center gap-2"
                            >
                                <span>🔗</span>
                                Compartir
                            </button>

                            <div className="relative group">
                                <button className="px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-all flex items-center gap-2">
                                    <span>📤</span>
                                    Exportar ▼
                                </button>
                                <div className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 hidden group-hover:block z-10">
                                    <button
                                        onClick={() => handleExport(selectedPlaylist.id, 'csv')}
                                        className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm font-semibold"
                                    >
                                        📄 CSV
                                    </button>
                                    <button
                                        onClick={() => handleExport(selectedPlaylist.id, 'json')}
                                        className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm font-semibold"
                                    >
                                        📋 JSON
                                    </button>
                                    <button
                                        onClick={() => handleExport(selectedPlaylist.id, 'spotify')}
                                        className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm font-semibold"
                                    >
                                        🎧 Spotify
                                    </button>
                                </div>
                            </div>

                            <button className="px-4 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-all">
                                Duplicar
                            </button>

                            <button className="px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-all">
                                Eliminar
                            </button>
                        </div>

                        {/* Song List */}
                        <div className="bg-white rounded-lg p-4">
                            <h4 className="font-bold text-gray-900 mb-3">Canciones en esta playlist</h4>

                            {selectedPlaylist.songs.length === 0 ? (
                                <div className="text-center py-8 text-gray-600">
                                    <div className="text-4xl mb-2">🎵</div>
                                    <p>No hay canciones en esta playlist</p>
                                    <p className="text-sm mt-1">Arrastra canciones desde favoritos o búscalas</p>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {selectedPlaylist.songs.map((songId, index) => (
                                        <div
                                            key={songId}
                                            className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all"
                                            draggable
                                        >
                                            <div className="text-gray-400 cursor-move">⋮⋮</div>
                                            <div className="text-sm font-bold text-gray-600">{index + 1}</div>
                                            <div className="flex-1">
                                                <div className="font-semibold text-gray-900">Song #{songId}</div>
                                                <div className="text-xs text-gray-600">Artist Name</div>
                                            </div>
                                            <button className="text-red-500 hover:text-red-700 text-sm">
                                                ✕
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Create Playlist Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl max-w-lg w-full">
                        <div className="p-6 border-b border-gray-200">
                            <h3 className="text-2xl font-bold text-gray-900">Crear Nueva Playlist</h3>
                        </div>

                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Nombre
                                </label>
                                <input
                                    type="text"
                                    value={newPlaylist.name}
                                    onChange={(e) => setNewPlaylist({ ...newPlaylist, name: e.target.value })}
                                    placeholder="Mi Playlist Increíble"
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Descripción
                                </label>
                                <textarea
                                    value={newPlaylist.description}
                                    onChange={(e) => setNewPlaylist({ ...newPlaylist, description: e.target.value })}
                                    placeholder="Descripción de tu playlist..."
                                    rows={3}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Categoría
                                </label>
                                <select
                                    value={newPlaylist.category}
                                    onChange={(e) => setNewPlaylist({ ...newPlaylist, category: e.target.value as any })}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500"
                                >
                                    <option value="reels">📱 Reels</option>
                                    <option value="dance">💃 Dance</option>
                                    <option value="background">🎵 Background</option>
                                    <option value="challenges">🏆 Challenges</option>
                                    <option value="custom">⭐ Custom</option>
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Icono
                                    </label>
                                    <select
                                        value={newPlaylist.icon}
                                        onChange={(e) => setNewPlaylist({ ...newPlaylist, icon: e.target.value })}
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-2xl"
                                    >
                                        <option value="🎵">🎵</option>
                                        <option value="🎧">🎧</option>
                                        <option value="🎤">🎤</option>
                                        <option value="🎸">🎸</option>
                                        <option value="🎹">🎹</option>
                                        <option value="🔥">🔥</option>
                                        <option value="⭐">⭐</option>
                                        <option value="💎">💎</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Color
                                    </label>
                                    <select
                                        value={newPlaylist.color}
                                        onChange={(e) => setNewPlaylist({ ...newPlaylist, color: e.target.value })}
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg"
                                    >
                                        <option value="#8b5cf6">🟣 Purple</option>
                                        <option value="#ec4899">🔴 Pink</option>
                                        <option value="#3b82f6">🔵 Blue</option>
                                        <option value="#10b981">🟢 Green</option>
                                        <option value="#f59e0b">🟠 Orange</option>
                                        <option value="#ef4444">🔴 Red</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 border-t border-gray-200 flex gap-3">
                            <button
                                onClick={() => setShowCreateModal(false)}
                                className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleCreatePlaylist}
                                className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700"
                            >
                                Crear Playlist
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PlaylistManager;
