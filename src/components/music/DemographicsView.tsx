/**
 * FEATURE #6: Demographics & Geographic Data
 * Complete demographic breakdown with visualizations
 */

import React, { useState } from 'react';
import type { ViralSong } from '../../types/music';

interface DemographicsViewProps {
    song: ViralSong;
    className?: string;
}

const DemographicsView: React.FC<DemographicsViewProps> = ({
    song,
    className = '',
}) => {
    const [selectedCountry, setSelectedCountry] = useState<string | null>(null);

    const formatNumber = (num: number): string => {
        if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
        if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
        return num.toString();
    };


    const topCountries = song.demographics.geographic.slice(0, 10);

    return (
        <div className={`demographics-view ${className}`}>
            {/* Header */}
            <div className="bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-t-xl p-6">
                <h2 className="text-2xl font-bold mb-2">
                    <span className="mr-2">🌍</span>
                    Demografía & Geografía
                </h2>
                <p className="text-green-100">¿Quién está usando esta canción y desde dónde?</p>
            </div>

            <div className="bg-white rounded-b-xl shadow-lg p-6 space-y-6">
                {/* World Map Visualization */}
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 border-2 border-blue-200">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">
                        <span className="mr-2">🗺️</span>
                        Mapa de Viralidad Global
                    </h3>

                    {/* Simplified World Map (visual representation) */}
                    <div className="bg-white rounded-lg p-6 mb-4 relative" style={{ height: '300px' }}>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-center">
                                <div className="text-6xl mb-4">🌎</div>
                                <div className="text-sm text-gray-600 mb-4">Distribución Global de Videos</div>

                                {/* Heat Zones Indicators */}
                                <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
                                    {topCountries.slice(0, 3).map(country => (
                                        <div
                                            key={country.countryCode}
                                            className="bg-gradient-to-br from-red-100 to-orange-100 rounded-lg p-3 border-2 border-red-300 cursor-pointer hover:shadow-lg transition-all"
                                            onClick={() => setSelectedCountry(country.countryCode)}
                                        >
                                            <div className="text-3xl mb-1">{country.flag}</div>
                                            <div className="text-xs font-bold text-gray-900">{country.country}</div>
                                            <div className="text-lg font-bold text-red-600">{country.percentage}%</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Heat Legend */}
                        <div className="absolute bottom-4 right-4 bg-white bg-opacity-90 rounded-lg p-3 border border-gray-300">
                            <div className="text-xs font-semibold text-gray-700 mb-2">Heat Map:</div>
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 bg-red-500 rounded"></div>
                                <span className="text-xs text-gray-600">Alto</span>
                                <div className="w-4 h-4 bg-orange-300 rounded"></div>
                                <span className="text-xs text-gray-600">Medio</span>
                                <div className="w-4 h-4 bg-blue-200 rounded"></div>
                                <span className="text-xs text-gray-600">Bajo</span>
                            </div>
                        </div>
                    </div>

                    {/* Top 3 Regions Summary */}
                    <div className="grid grid-cols-3 gap-4">
                        {topCountries.slice(0, 3).map((country, index) => (
                            <div key={country.countryCode} className="bg-white rounded-lg p-4 border-2 border-blue-200 text-center">
                                <div className="text-2xl mb-1">
                                    {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                                </div>
                                <div className="text-sm font-semibold text-gray-900">{country.flag} {country.country}</div>
                                <div className="text-2xl font-bold text-blue-600 mt-1">{country.percentage}%</div>
                                <div className="text-xs text-gray-600">{formatNumber(country.videoCount)} videos</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Country Breakdown List */}
                <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-6 border-2 border-purple-200">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">
                        <span className="mr-2">📊</span>
                        Top 10 Países por Videos
                    </h3>

                    <div className="space-y-3">
                        {topCountries.map((country, index) => {
                            const maxPercentage = topCountries[0]?.percentage || 100;
                            const barWidth = (country.percentage / maxPercentage) * 100;

                            return (
                                <div
                                    key={country.countryCode}
                                    className={`bg-white rounded-lg p-4 cursor-pointer transition-all ${selectedCountry === country.countryCode
                                        ? 'border-2 border-purple-500 shadow-md'
                                        : 'border border-gray-200 hover:border-purple-300'
                                        }`}
                                    onClick={() => setSelectedCountry(country.countryCode)}
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-3">
                                            <span className="text-sm font-bold text-gray-500">#{index + 1}</span>
                                            <span className="text-2xl">{country.flag}</span>
                                            <div>
                                                <div className="font-bold text-gray-900">{country.country}</div>
                                                <div className="text-xs text-gray-600">{formatNumber(country.videoCount)} videos</div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-2xl font-bold text-purple-600">{country.percentage}%</div>
                                            <div className="text-xs text-gray-600">del total</div>
                                        </div>
                                    </div>

                                    {/* Progress Bar */}
                                    <div className="w-full bg-gray-200 rounded-full h-3">
                                        <div
                                            className="bg-gradient-to-r from-purple-500 to-indigo-500 h-3 rounded-full transition-all"
                                            style={{ width: `${barWidth}%` }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Gender Distribution */}
                <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-xl p-6 border-2 border-pink-200">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">
                        <span className="mr-2">👥</span>
                        Distribución por Género
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Pie Chart Representation */}
                        <div className="flex items-center justify-center">
                            <div className="relative w-48 h-48">
                                {/* Simple pie chart visual */}
                                <div className="absolute inset-0 rounded-full overflow-hidden border-4 border-white shadow-lg">
                                    <div
                                        className="absolute top-0 left-0 w-full h-full bg-pink-500"
                                        style={{
                                            clipPath: `polygon(50% 50%, 50% 0%, ${50 + 50 * Math.cos((song.demographics.gender.female / 100) * 2 * Math.PI - Math.PI / 2)}% ${50 + 50 * Math.sin((song.demographics.gender.female / 100) * 2 * Math.PI - Math.PI / 2)}%, 50% 50%)`
                                        }}
                                    ></div>
                                    <div
                                        className="absolute top-0 left-0 w-full h-full bg-blue-500"
                                    ></div>
                                </div>

                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="bg-white rounded-full w-24 h-24 flex items-center justify-center shadow-md">
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-gray-900">{song.demographics.gender.female}%</div>
                                            <div className="text-xs text-gray-600">Femenino</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Breakdown */}
                        <div className="space-y-4">
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 bg-pink-500 rounded"></div>
                                        <span className="font-semibold text-gray-900">👩 Femenino</span>
                                    </div>
                                    <span className="text-2xl font-bold text-pink-600">{song.demographics.gender.female}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-3">
                                    <div
                                        className="bg-pink-500 h-3 rounded-full"
                                        style={{ width: `${song.demographics.gender.female}%` }}
                                    />
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 bg-blue-500 rounded"></div>
                                        <span className="font-semibold text-gray-900">👨 Masculino</span>
                                    </div>
                                    <span className="text-2xl font-bold text-blue-600">{song.demographics.gender.male}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-3">
                                    <div
                                        className="bg-blue-500 h-3 rounded-full"
                                        style={{ width: `${song.demographics.gender.male}%` }}
                                    />
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 bg-purple-500 rounded"></div>
                                        <span className="font-semibold text-gray-900">🌈 Otro / No Binario</span>
                                    </div>
                                    <span className="text-2xl font-bold text-purple-600">
                                        {song.demographics.gender.other + song.demographics.gender.nonBinary}%
                                    </span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-3">
                                    <div
                                        className="bg-purple-500 h-3 rounded-full"
                                        style={{ width: `${song.demographics.gender.other + song.demographics.gender.nonBinary}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Age Distribution */}
                <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-xl p-6 border-2 border-orange-200">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">
                        <span className="mr-2">🎂</span>
                        Distribución por Edad
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Bar Chart */}
                        <div className="space-y-4">
                            {song.demographics.ageRanges.map(range => (
                                <div key={range.range}>
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="font-semibold text-gray-900">{range.range} años</span>
                                        <div className="text-right">
                                            <span className="text-lg font-bold text-orange-600">{range.percentage}%</span>
                                            <span className="text-xs text-gray-600 ml-2">({range.engagement}% eng.)</span>
                                        </div>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-4">
                                        <div
                                            className="bg-gradient-to-r from-orange-500 to-yellow-500 h-4 rounded-full transition-all flex items-center justify-end pr-2"
                                            style={{ width: `${range.percentage}%` }}
                                        >
                                            {range.percentage > 15 && (
                                                <span className="text-xs font-bold text-white">{range.percentage}%</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Insights */}
                        <div className="bg-white rounded-lg p-4 border-2 border-orange-200">
                            <h4 className="font-bold text-gray-900 mb-3">📈 Insights de Edad</h4>
                            <div className="space-y-3">
                                <div className="flex items-start gap-2">
                                    <span className="text-green-500 mt-0.5">✓</span>
                                    <div className="text-sm">
                                        <strong className="text-gray-900">Audiencia Principal:</strong>
                                        <span className="text-gray-600 ml-1">
                                            {song.demographics.ageRanges[0]?.range || '18-24'} años ({song.demographics.ageRanges[0]?.percentage || 50}%)
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-start gap-2">
                                    <span className="text-green-500 mt-0.5">✓</span>
                                    <div className="text-sm">
                                        <strong className="text-gray-900">Mayor Engagement:</strong>
                                        <span className="text-gray-600 ml-1">
                                            {song.demographics.ageRanges.reduce((prev, curr) => prev.engagement > curr.engagement ? prev : curr).range} años
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-start gap-2">
                                    <span className="text-blue-500 mt-0.5">ℹ️</span>
                                    <div className="text-sm text-gray-600">
                                        La música resuena fuertemente con audiencia joven (18-24).
                                        Ajusta tu contenido para este grupo demográfico.
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Niche/Category Tags */}
                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 border-2 border-indigo-200">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">
                        <span className="mr-2">🏷️</span>
                        Nichos & Categorías
                    </h3>

                    <div className="flex flex-wrap gap-3">
                        {song.demographics.niches.map((niche, index) => {
                            const sizes = ['text-2xl', 'text-xl', 'text-lg', 'text-base'];
                            const colors = [
                                'from-purple-500 to-indigo-500',
                                'from-pink-500 to-rose-500',
                                'from-blue-500 to-cyan-500',
                                'from-green-500 to-emerald-500',
                            ];

                            return (
                                <div
                                    key={niche}
                                    className={`px-6 py-3 bg-gradient-to-r ${colors[index % colors.length]} text-white rounded-full font-bold shadow-lg hover:shadow-xl transition-all cursor-pointer ${sizes[index % sizes.length]}`}
                                >
                                    {niche}
                                </div>
                            );
                        })}
                    </div>

                    <div className="mt-4 bg-white rounded-lg p-4">
                        <div className="text-sm text-gray-700">
                            <strong>💡 Recomendación:</strong> Esta canción funciona mejor en contenido de{' '}
                            <strong className="text-purple-600">{song.demographics.niches[0]}</strong> y{' '}
                            <strong className="text-purple-600">{song.demographics.niches[1]}</strong>.
                            Adapta tu contenido a estos nichos para maximizar alcance.
                        </div>
                    </div>
                </div>

                {/* Time of Day Patterns */}
                <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-xl p-6 border-2 border-cyan-200">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">
                        <span className="mr-2">⏰</span>
                        Patrones de Hora del Día
                    </h3>

                    <div className="bg-white rounded-lg p-4">
                        <div className="flex items-end justify-between h-40 gap-2 mb-4">
                            {Array.from({ length: 24 }).map((_, hour) => {
                                const peakHours = song.demographics.timeOfDay.map(t => t.hour);
                                const isPeak = peakHours.includes(hour);
                                const height = isPeak ? 80 : Math.random() * 30 + 10;

                                return (
                                    <div
                                        key={hour}
                                        className="flex-1 flex flex-col items-center"
                                        title={`${hour}:00`}
                                    >
                                        <div
                                            className={`w-full rounded-t transition-all ${isPeak ? 'bg-gradient-to-t from-blue-500 to-cyan-500' : 'bg-gray-300'
                                                }`}
                                            style={{ height: `${height}%` }}
                                        />
                                        {hour % 3 === 0 && (
                                            <span className="text-xs text-gray-600 mt-1">{hour}h</span>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            {song.demographics.timeOfDay.map(time => (
                                <div key={time.hour} className="bg-blue-50 rounded-lg p-3 text-center border-2 border-blue-300">
                                    <div className="text-xs text-blue-600 mb-1">Peak Hour</div>
                                    <div className="text-xl font-bold text-blue-900">{time.hour}:00</div>
                                    <div className="text-sm text-gray-600">{time.percentage}% actividad</div>
                                    <div className="text-xs text-gray-500">{time.timezone}</div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-4 bg-cyan-50 rounded-lg p-3">
                            <div className="text-sm text-gray-700">
                                <strong>📅 Mejor momento para publicar:</strong> Entre{' '}
                                {song.demographics.timeOfDay[0]?.hour || 14}:00 y {song.demographics.timeOfDay[song.demographics.timeOfDay.length - 1]?.hour || 21}:00 {song.demographics.timeOfDay[0]?.timezone || 'EST'} para máximo alcance.
                            </div>
                        </div>
                    </div>
                </div>

                {/* Summary Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-lg p-4 text-center border-2 border-green-300">
                        <div className="text-2xl mb-1">🌍</div>
                        <div className="text-sm text-gray-600">Países</div>
                        <div className="text-2xl font-bold text-green-600">{song.demographics.geographic.length}</div>
                    </div>

                    <div className="bg-gradient-to-br from-pink-50 to-rose-100 rounded-lg p-4 text-center border-2 border-pink-300">
                        <div className="text-2xl mb-1">👥</div>
                        <div className="text-sm text-gray-600">Género Principal</div>
                        <div className="text-2xl font-bold text-pink-600">{song.demographics.gender.female > song.demographics.gender.male ? 'Femenino' : 'Masculino'}</div>
                    </div>

                    <div className="bg-gradient-to-br from-orange-50 to-yellow-100 rounded-lg p-4 text-center border-2 border-orange-300">
                        <div className="text-2xl mb-1">🎂</div>
                        <div className="text-sm text-gray-600">Edad Promedio</div>
                        <div className="text-2xl font-bold text-orange-600">{song.demographics.ageRanges[0]?.range || '18-24'}</div>
                    </div>

                    <div className="bg-gradient-to-br from-purple-50 to-indigo-100 rounded-lg p-4 text-center border-2 border-purple-300">
                        <div className="text-2xl mb-1">🏷️</div>
                        <div className="text-sm text-gray-600">Nichos</div>
                        <div className="text-2xl font-bold text-purple-600">{song.demographics.niches.length}</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DemographicsView;
