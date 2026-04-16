import React from 'react';
import { Filter, Calendar, BarChart3, List } from 'lucide-react';

/**
 * FilterBar Component
 * Barra de filtros y selector de vista - Funcionalidad completa
 */
const FilterBar = ({
    filters,
    setFilters,
    viewMode,
    setViewMode,
    theme
}) => {
    return (
        <div className={`flex flex-col md:flex-row gap-4 mb-6 p-4 rounded-xl border ${theme === 'dark' ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'
            }`}>
            {/* View Mode Selector */}
            <div className="flex gap-2">
                <button
                    onClick={() => setViewMode('calendar')}
                    className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${viewMode === 'calendar'
                            ? theme === 'dark'
                                ? 'bg-blue-500 text-white'
                                : 'bg-blue-600 text-white'
                            : theme === 'dark'
                                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                >
                    <Calendar size={18} />
                    <span className="hidden sm:inline">Calendario</span>
                </button>
                <button
                    onClick={() => setViewMode('list')}
                    className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${viewMode === 'list'
                            ? theme === 'dark'
                                ? 'bg-blue-500 text-white'
                                : 'bg-blue-600 text-white'
                            : theme === 'dark'
                                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                >
                    <List size={18} />
                    <span className="hidden sm:inline">Lista</span>
                </button>
                <button
                    onClick={() => setViewMode('analytics')}
                    className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${viewMode === 'analytics'
                            ? theme === 'dark'
                                ? 'bg-blue-500 text-white'
                                : 'bg-blue-600 text-white'
                            : theme === 'dark'
                                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                >
                    <BarChart3 size={18} />
                    <span className="hidden sm:inline">Analytics</span>
                </button>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3 flex-1">
                {/* Platform Filter */}
                <select
                    value={filters.platform}
                    onChange={(e) => setFilters({ ...filters, platform: e.target.value })}
                    className={`px-3 py-2 rounded-lg border ${theme === 'dark'
                            ? 'bg-gray-700 border-gray-600 text-white'
                            : 'bg-white border-gray-300 text-gray-900'
                        }`}
                >
                    <option value="all">Todas las plataformas</option>
                    <option value="tiktok">TikTok</option>
                    <option value="instagram">Instagram</option>
                    <option value="youtube">YouTube</option>
                    <option value="facebook">Facebook</option>
                    <option value="linkedin">LinkedIn</option>
                </select>

                {/* Status Filter */}
                <select
                    value={filters.status}
                    onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                    className={`px-3 py-2 rounded-lg border ${theme === 'dark'
                            ? 'bg-gray-700 border-gray-600 text-white'
                            : 'bg-white border-gray-300 text-gray-900'
                        }`}
                >
                    <option value="all">Todos los estados</option>
                    <option value="scheduled">Programado</option>
                    <option value="published">Publicado</option>
                    <option value="pending">Pendiente</option>
                    <option value="failed">Fallido</option>
                </select>

                {/* Niche Filter */}
                <select
                    value={filters.niche}
                    onChange={(e) => setFilters({ ...filters, niche: e.target.value })}
                    className={`px-3 py-2 rounded-lg border ${theme === 'dark'
                            ? 'bg-gray-700 border-gray-600 text-white'
                            : 'bg-white border-gray-300 text-gray-900'
                        }`}
                >
                    <option value="all">Todos los nichos</option>
                    <option value="food">Food</option>
                    <option value="fitness">Fitness</option>
                    <option value="fashion">Fashion</option>
                    <option value="tech">Tech</option>
                    <option value="travel">Travel</option>
                    <option value="lifestyle">Lifestyle</option>
                </select>

                {/* Country Filter */}
                <select
                    value={filters.country}
                    onChange={(e) => setFilters({ ...filters, country: e.target.value })}
                    className={`px-3 py-2 rounded-lg border ${theme === 'dark'
                            ? 'bg-gray-700 border-gray-600 text-white'
                            : 'bg-white border-gray-300 text-gray-900'
                        }`}
                >
                    <option value="all">Todos los países</option>
                    <option value="MX">🇲🇽 México</option>
                    <option value="ES">🇪🇸 España</option>
                    <option value="CO">🇨🇴 Colombia</option>
                    <option value="AR">🇦🇷 Argentina</option>
                    <option value="PE">🇵🇪 Perú</option>
                    <option value="EC">🇪🇨 Ecuador</option>
                    <option value="CL">🇨🇱 Chile</option>
                    <option value="VE">🇻🇪 Venezuela</option>
                </select>
            </div>

            {/* Filter Icon */}
            <div className="flex items-center">
                <Filter size={20} className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} />
            </div>
        </div>
    );
};

export default FilterBar;
