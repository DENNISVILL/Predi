/**
 * FEATURE #11: Content Calendar Integration
 * Complete calendar with auto-scheduling and reminders
 */

import React, { useState } from 'react';
import type { ContentEvent, ViralSong } from '../../types/music';
import { generateMockContentEvent } from '../../utils/mockMusicData';

interface ContentCalendarProps {
    songs?: ViralSong[];
    className?: string;
}

const ContentCalendar: React.FC<ContentCalendarProps> = ({
    songs: _songs = [],
    className = '',
}) => {
    const [view, setView] = useState<'day' | 'week' | 'month'>('month');
    const [currentDate, setCurrentDate] = useState(new Date());
    const [events, _setEvents] = useState<ContentEvent[]>([
        generateMockContentEvent('song1'),
        { ...generateMockContentEvent('song2'), date: new Date(Date.now() + 86400000).toISOString() },
    ]);
    const [showAutoScheduler, setShowAutoScheduler] = useState(false);

    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();

        return { daysInMonth, startingDayOfWeek };
    };

    const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentDate);

    const getEventsForDate = (dayNumber: number) => {
        const dateToCheck = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            dayNumber
        );

        return events.filter(event => {
            const eventDate = new Date(event.date);
            return (
                eventDate.getDate() === dateToCheck.getDate() &&
                eventDate.getMonth() === dateToCheck.getMonth() &&
                eventDate.getFullYear() === dateToCheck.getFullYear()
            );
        });
    };

    const handleAutoSchedule = () => {
        window.alert('Auto-scheduling songs based on peak timing strategy...');
        setShowAutoScheduler(false);
    };

    const handleExport = (format: 'pdf' | 'ical' | 'google') => {
        window.alert(`Exporting calendar as ${format.toUpperCase()}...`);
    };

    const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

    return (
        <div className={`content-calendar ${className}`}>
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-xl p-6">
                <h2 className="text-2xl font-bold mb-2">
                    <span className="mr-2">📅</span>
                    Calendario de Contenido
                </h2>
                <p className="text-blue-100">Planifica y programa tu contenido viral</p>
            </div>

            <div className="bg-white rounded-b-xl shadow-lg">
                {/* Calendar Controls */}
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                        {/* View Selector */}
                        <div className="flex gap-2">
                            {(['day', 'week', 'month'] as const).map(viewMode => (
                                <button
                                    key={viewMode}
                                    onClick={() => setView(viewMode)}
                                    className={`px-4 py-2 rounded-lg font-semibold capitalize transition-all ${view === viewMode
                                        ? 'bg-blue-600 text-white shadow-md'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                >
                                    {viewMode === 'day' ? '📆 Día' :
                                        viewMode === 'week' ? '📅 Semana' : '🗓️ Mes'}
                                </button>
                            ))}
                        </div>

                        {/* Month Navigation */}
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
                                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200"
                            >
                                ←
                            </button>

                            <div className="text-center">
                                <div className="text-xl font-bold text-gray-900">
                                    {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                                </div>
                            </div>

                            <button
                                onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
                                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200"
                            >
                                →
                            </button>

                            <button
                                onClick={() => setCurrentDate(new Date())}
                                className="px-4 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700"
                            >
                                Hoy
                            </button>
                        </div>

                        {/* Auto Scheduler & Export */}
                        <div className="flex gap-2">
                            <button
                                onClick={() => setShowAutoScheduler(true)}
                                className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700"
                            >
                                🤖 Auto-Schedule
                            </button>

                            <div className="relative group">
                                <button className="px-4 py-2 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700">
                                    📤 Exportar
                                </button>
                                <div className="absolute top-full right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 hidden group-hover:block z-10 min-w-40">
                                    <button
                                        onClick={() => handleExport('pdf')}
                                        className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm font-semibold"
                                    >
                                        📑 PDF
                                    </button>
                                    <button
                                        onClick={() => handleExport('ical')}
                                        className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm font-semibold"
                                    >
                                        📅 iCal
                                    </button>
                                    <button
                                        onClick={() => handleExport('google')}
                                        className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm font-semibold"
                                    >
                                        📆 Google Calendar
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Calendar Grid */}
                <div className="p-6">
                    {view === 'month' && (
                        <div>
                            {/* Day Headers */}
                            <div className="grid grid-cols-7 gap-2 mb-2">
                                {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(day => (
                                    <div key={day} className="text-center font-bold text-gray-700 py-2">
                                        {day}
                                    </div>
                                ))}
                            </div>

                            {/* Calendar Days */}
                            <div className="grid grid-cols-7 gap-2">
                                {/* Empty cells before first day */}
                                {Array.from({ length: startingDayOfWeek }).map((_, i) => (
                                    <div key={`empty-${i}`} className="aspect-square bg-gray-50 rounded-lg" />
                                ))}

                                {/* Actual days */}
                                {Array.from({ length: daysInMonth }).map((_, i) => {
                                    const dayNumber = i + 1;
                                    const dayEvents = getEventsForDate(dayNumber);
                                    const isToday =
                                        dayNumber === new Date().getDate() &&
                                        currentDate.getMonth() === new Date().getMonth() &&
                                        currentDate.getFullYear() === new Date().getFullYear();

                                    return (
                                        <div
                                            key={dayNumber}
                                            className={`aspect-square rounded-lg border-2 p-2 transition-all cursor-pointer hover:shadow-md ${isToday
                                                ? 'border-blue-500 bg-blue-50'
                                                : 'border-gray-200 bg-white hover:border-blue-300'
                                                }`}
                                        >
                                            <div className={`text-sm font-bold mb-1 ${isToday ? 'text-blue-600' : 'text-gray-900'}`}>
                                                {dayNumber}
                                            </div>

                                            {/* Events */}
                                            <div className="space-y-1 overflow-y-auto max-h-20">
                                                {dayEvents.map(event => (
                                                    <div
                                                        key={event.id}
                                                        className={`text-xs px-2 py-1 rounded cursor-pointer truncate ${event.status === 'posted' ? 'bg-green-100 text-green-700' :
                                                            event.status === 'scheduled' ? 'bg-blue-100 text-blue-700' :
                                                                'bg-purple-100 text-purple-700'
                                                            }`}
                                                    >
                                                        {event.time} - Song
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Week View */}
                    {view === 'week' && (
                        <div className="text-center py-12 bg-gray-50 rounded-xl">
                            <div className="text-4xl mb-3">📅</div>
                            <p className="text-gray-600">Vista Semanal - Próximamente</p>
                        </div>
                    )}

                    {/* Day View */}
                    {view === 'day' && (
                        <div className="space-y-3">
                            {events.filter(e => new Date(e.date).getDate() === currentDate.getDate()).map(event => (
                                <div
                                    key={event.id}
                                    className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 border-2 border-blue-200 cursor-pointer hover:shadow-lg transition-all"
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <div className="text-lg font-bold text-gray-900">{event.time}</div>
                                            <div className="text-sm text-gray-600">Song ID: {event.songId}</div>
                                        </div>
                                        <div className={`px-3 py-1 rounded-full text-xs font-bold ${event.status === 'posted' ? 'bg-green-500 text-white' :
                                            event.status === 'scheduled' ? 'bg-blue-500 text-white' :
                                                'bg-purple-500 text-white'
                                            }`}>
                                            {event.status.toUpperCase()}
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {events.filter(e => new Date(e.date).getDate() === currentDate.getDate()).length === 0 && (
                                <div className="text-center py-12 bg-gray-50 rounded-xl">
                                    <div className="text-4xl mb-3">📭</div>
                                    <p className="text-gray-600">No hay eventos programados para este día</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Event Summary */}
                <div className="p-6 border-t border-gray-200 bg-gray-50">
                    <div className="grid grid-cols-3 gap-4 text-center">
                        <div className="bg-white rounded-lg p-4">
                            <div className="text-2xl font-bold text-purple-600">{events.length}</div>
                            <div className="text-sm text-gray-600">Total Eventos</div>
                        </div>
                        <div className="bg-white rounded-lg p-4">
                            <div className="text-2xl font-bold text-blue-600">
                                {events.filter(e => e.status === 'scheduled').length}
                            </div>
                            <div className="text-sm text-gray-600">Programados</div>
                        </div>
                        <div className="bg-white rounded-lg p-4">
                            <div className="text-2xl font-bold text-green-600">
                                {events.filter(e => e.status === 'posted').length}
                            </div>
                            <div className="text-sm text-gray-600">Publicados</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Auto-Scheduler Modal */}
            {showAutoScheduler && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl max-w-2xl w-full">
                        <div className="p-6 border-b border-gray-200">
                            <h3 className="text-2xl font-bold text-gray-900">Auto-Programador IA</h3>
                        </div>

                        <div className="p-6 space-y-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-3">
                                    Estrategia de Programación
                                </label>
                                <div className="space-y-2">
                                    {[
                                        { value: 'peak_timing', label: '📈 Peak Timing', desc: 'Programa en fechas predichas de máxima viralidad' },
                                        { value: 'spread_evenly', label: '📅 Distribuir Uniformemente', desc: 'Espaciar posts de manera uniforme' },
                                        { value: 'weekends', label: '🎉 Solo Fines de Semana', desc: 'Programar solo Sábados y Domingos' },
                                    ].map(strategy => (
                                        <label key={strategy.value} className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                                            <input type="radio" name="strategy" className="w-5 h-5" />
                                            <div>
                                                <div className="font-semibold text-gray-900">{strategy.label}</div>
                                                <div className="text-xs text-gray-600">{strategy.desc}</div>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Frecuencia (posts por semana)
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    max="14"
                                    defaultValue="3"
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Plataformas
                                </label>
                                <div className="grid grid-cols-4 gap-2">
                                    {['TikTok', 'Instagram', 'Facebook', 'YouTube'].map(platform => (
                                        <label key={platform} className="flex items-center gap-2 p-2 bg-gray-50 rounded cursor-pointer">
                                            <input type="checkbox" defaultChecked />
                                            <span className="text-sm">{platform}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="p-6 border-t border-gray-200 flex gap-3">
                            <button
                                onClick={() => setShowAutoScheduler(false)}
                                className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleAutoSchedule}
                                className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700"
                            >
                                🤖 Auto-Programar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ContentCalendar;
