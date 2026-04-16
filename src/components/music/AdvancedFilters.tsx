/**
 * FEATURE #2: Advanced Filters & Search
 * Complete filtering system with 11 filter types and search
 */

import React, { useState } from 'react';
import type { MusicFilters, SortOption } from '../../types/music';
import { GENRES, MOODS, LANGUAGES, DEFAULT_FILTERS } from '../../types/music';

interface AdvancedFiltersProps {
    filters: MusicFilters;
    onChange: (filters: MusicFilters) => void;
    onReset: () => void;
    className?: string;
}

const AdvancedFilters: React.FC<AdvancedFiltersProps> = ({
    filters,
    onChange,
    onReset,
    className = '',
}) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const updateFilter = <K extends keyof MusicFilters>(
        key: K,
        value: MusicFilters[K]
    ) => {
        onChange({ ...filters, [key]: value });
    };

    const toggleArrayItem = <K extends keyof MusicFilters>(
        key: K,
        item: string
    ) => {
        const currentArray = filters[key] as string[];
        const newArray = currentArray.includes(item)
            ? currentArray.filter(i => i !== item)
            : [...currentArray, item];
        onChange({ ...filters, [key]: newArray });
    };

    const countries = [
        { code: 'US', name: 'United States', flag: '🇺🇸' },
        { code: 'BR', name: 'Brazil', flag: '🇧🇷' },
        { code: 'MX', name: 'Mexico', flag: '🇲🇽' },
        { code: 'PH', name: 'Philippines', flag: '🇵🇭' },
        { code: 'IN', name: 'India', flag: '🇮🇳' },
        { code: 'GB', name: 'United Kingdom', flag: '🇬🇧' },
        { code: 'FR', name: 'France', flag: '🇫🇷' },
        { code: 'DE', name: 'Germany', flag: '🇩🇪' },
        { code: 'JP', name: 'Japan', flag: '🇯🇵' },
        { code: 'KR', name: 'South Korea', flag: '🇰🇷' },
    ];

    const activeFiltersCount =
        filters.genres.length +
        filters.moods.length +
        filters.languages.length +
        filters.countries.length +
        filters.lifecycleStages.length +
        (filters.bpmRange[0] !== DEFAULT_FILTERS.bpmRange[0] ||
            filters.bpmRange[1] !== DEFAULT_FILTERS.bpmRange[1] ? 1 : 0) +
        (filters.durationRange[0] !== DEFAULT_FILTERS.durationRange[0] ||
            filters.durationRange[1] !== DEFAULT_FILTERS.durationRange[1] ? 1 : 0);

    return (
        <div className={`advanced-filters bg-white rounded-xl shadow-lg ${className}`}>
            {/* Header */}
            <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <h2 className="text-2xl font-bold text-gray-900">
                            <span className="mr-2">🔍</span>
                            Filtros Avanzados
                        </h2>
                        {activeFiltersCount > 0 && (
                            <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-bold">
                                {activeFiltersCount} activos
                            </span>
                        )}
                    </div>

                    <div className="flex items-center gap-3">
                        {activeFiltersCount > 0 && (
                            <button
                                onClick={onReset}
                                className="text-sm text-red-600 hover:text-red-700 font-semibold"
                            >
                                Limpiar Todo
                            </button>
                        )}
                        <button
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="text-purple-600 hover:text-purple-700 font-semibold"
                        >
                            {isExpanded ? '▲ Colapsar' : '▼ Expandir'}
                        </button>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="mt-4">
                    <div className="relative">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Buscar por canción, artista, o challenge..."
                            className="w-full px-4 py-3 pl-12 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
                        />
                        <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl">
                            🔎
                        </span>
                    </div>
                </div>
            </div>

            {/* Filters Content */}
            {isExpanded && (
                <div className="p-6 space-y-6">
                    {/* Sort & Order */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                Ordenar por
                            </label>
                            <select
                                value={filters.sortBy}
                                onChange={(e) => updateFilter('sortBy', e.target.value as SortOption)}
                                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-purple-500 transition-all"
                            >
                                <option value="viral_score">🔥 Viral Score (Predicción)</option>
                                <option value="growth_rate">📈 Crecimiento Más Rápido</option>
                                <option value="usage_24h">⏰ Más Usada (24 horas)</option>
                                <option value="usage_7d">📅 Más Usada (7 días)</option>
                                <option value="usage_30d">📆 Más Usada (30 días)</option>
                                <option value="alphabetical">🔤 Alfabético</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                Orden
                            </label>
                            <select
                                value={filters.sortOrder}
                                onChange={(e) => updateFilter('sortOrder', e.target.value as 'asc' | 'desc')}
                                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-purple-500 transition-all"
                            >
                                <option value="desc">⬇️ Mayor a Menor</option>
                                <option value="asc">⬆️ Menor a Mayor</option>
                            </select>
                        </div>
                    </div>

                    {/* Genre Filter */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-3">
                            🎸 Género ({filters.genres.length} seleccionados)
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {GENRES.map(genre => (
                                <button
                                    key={genre}
                                    onClick={() => toggleArrayItem('genres', genre)}
                                    className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${filters.genres.includes(genre)
                                            ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                >
                                    {genre}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* BPM Range Slider */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-3">
                            🥁 BPM/Tempo: {filters.bpmRange[0]} - {filters.bpmRange[1]} BPM
                        </label>
                        <div className="space-y-2">
                            <input
                                type="range"
                                min="60"
                                max="200"
                                value={filters.bpmRange[0]}
                                onChange={(e) => updateFilter('bpmRange', [parseInt(e.target.value), filters.bpmRange[1]])}
                                className="w-full"
                            />
                            <input
                                type="range"
                                min="60"
                                max="200"
                                value={filters.bpmRange[1]}
                                onChange={(e) => updateFilter('bpmRange', [filters.bpmRange[0], parseInt(e.target.value)])}
                                className="w-full"
                            />
                            <div className="flex justify-between text-xs text-gray-600">
                                <span>60 BPM (Slow)</span>
                                <span>130 BPM (Medium)</span>
                                <span>200 BPM (Fast)</span>
                            </div>
                        </div>
                    </div>

                    {/* Mood Filter */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-3">
                            😊 Mood/Estado de Ánimo ({filters.moods.length} seleccionados)
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {MOODS.map(mood => (
                                <button
                                    key={mood}
                                    onClick={() => toggleArrayItem('moods', mood)}
                                    className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${filters.moods.includes(mood)
                                            ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-md'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                >
                                    {mood}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Duration Filter */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-3">
                            ⏱️ Duración
                        </label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {[
                                { label: '0-30s', range: [0, 30] },
                                { label: '30s-1m', range: [30, 60] },
                                { label: '1m-3m', range: [60, 180] },
                                { label: '3m+', range: [180, 300] },
                            ].map(({ label, range }) => {
                                const isSelected =
                                    filters.durationRange[0] === range[0] &&
                                    filters.durationRange[1] === range[1];

                                return (
                                    <button
                                        key={label}
                                        onClick={() => updateFilter('durationRange', range as [number, number])}
                                        className={`px-4 py-3 rounded-lg text-sm font-semibold transition-all ${isSelected
                                                ? 'bg-blue-600 text-white shadow-md'
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                            }`}
                                    >
                                        {label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Country/Region Filter */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-3">
                            🌍 Región/País ({filters.countries.length} seleccionados)
                        </label>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                            {countries.map(country => (
                                <button
                                    key={country.code}
                                    onClick={() => toggleArrayItem('countries', country.code)}
                                    className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all text-left ${filters.countries.includes(country.code)
                                            ? 'bg-green-600 text-white shadow-md'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                >
                                    <span className="mr-2">{country.flag}</span>
                                    {country.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Language Filter */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-3">
                            🗣️ Idioma ({filters.languages.length} seleccionados)
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {LANGUAGES.map(language => (
                                <button
                                    key={language}
                                    onClick={() => toggleArrayItem('languages', language)}
                                    className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${filters.languages.includes(language)
                                            ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-md'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                >
                                    {language}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Lifecycle Stage Filter */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-3">
                            📊 Etapa del Ciclo de Vida
                        </label>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                            {[
                                { stage: 'emergente' as const, label: '🌱 Emergente', desc: 'Usa YA!' },
                                { stage: 'creciendo' as const, label: '📈 Creciendo', desc: 'Oportunidad' },
                                { stage: 'peak' as const, label: '🔥 Peak', desc: 'Saturado' },
                                { stage: 'declinando' as const, label: '📉 Declinando', desc: 'Evita' },
                                { stage: 'legacy' as const, label: '📚 Clásico', desc: 'Estable' },
                            ].map(({ stage, label, desc }) => {
                                const isSelected = filters.lifecycleStages.includes(stage);

                                return (
                                    <button
                                        key={stage}
                                        onClick={() => {
                                            const newStages = isSelected
                                                ? filters.lifecycleStages.filter(s => s !== stage)
                                                : [...filters.lifecycleStages, stage];
                                            updateFilter('lifecycleStages', newStages);
                                        }}
                                        className={`px-4 py-3 rounded-lg text-sm font-semibold transition-all text-left ${isSelected
                                                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md'
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                            }`}
                                    >
                                        <div>{label}</div>
                                        <div className="text-xs opacity-75">{desc}</div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}

            {/* Quick Filters Bar (always visible) */}
            {!isExpanded && activeFiltersCount > 0 && (
                <div className="px-6 py-4 bg-purple-50 border-t border-purple-100">
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-semibold text-gray-700">Filtros activos:</span>

                        {filters.genres.length > 0 && (
                            <span className="px-3 py-1 bg-purple-600 text-white rounded-full text-xs font-bold">
                                Géneros: {filters.genres.length}
                            </span>
                        )}

                        {filters.moods.length > 0 && (
                            <span className="px-3 py-1 bg-pink-600 text-white rounded-full text-xs font-bold">
                                Moods: {filters.moods.length}
                            </span>
                        )}

                        {filters.countries.length > 0 && (
                            <span className="px-3 py-1 bg-green-600 text-white rounded-full text-xs font-bold">
                                Países: {filters.countries.length}
                            </span>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdvancedFilters;
