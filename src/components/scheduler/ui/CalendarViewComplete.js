/**
 * CalendarViewComplete - Vista completa de calendario mensual
 * Componente lazy-loaded con funcionalidad completa
 */
import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Plus } from 'lucide-react';

const CalendarViewComplete = ({
    posts = [],
    theme = 'dark',
    selectedDate,
    onDateChange,
    onPostClick,
    onCreatePost
}) => {
    const [currentMonth, setCurrentMonth] = useState(selectedDate || new Date());

    // Calcular días del mes
    const calendarDays = useMemo(() => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();

        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();

        const days = [];

        // Días del mes anterior (relleno)
        for (let i = 0; i < startingDayOfWeek; i++) {
            const prevMonthDate = new Date(year, month, -i);
            days.unshift({
                date: prevMonthDate,
                isCurrentMonth: false
            });
        }

        // Días del mes actual
        for (let day = 1; day <= daysInMonth; day++) {
            days.push({
                date: new Date(year, month, day),
                isCurrentMonth: true
            });
        }

        // Días del próximo mes (relleno)
        const remainingDays = 42 - days.length; // 6 semanas * 7 días
        for (let i = 1; i <= remainingDays; i++) {
            days.push({
                date: new Date(year, month + 1, i),
                isCurrentMonth: false
            });
        }

        return days;
    }, [currentMonth]);

    // Obtener posts por fecha
    const getPostsForDate = (date) => {
        const dateStr = date.toISOString().split('T')[0];
        return posts.filter(post => {
            const postDate = new Date(post.date).toISOString().split('T')[0];
            return postDate === dateStr;
        });
    };

    // Navegación de mes
    const previousMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
    };

    const nextMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
    };

    const goToToday = () => {
        setCurrentMonth(new Date());
    };

    const isToday = (date) => {
        const today = new Date();
        return date.toDateString() === today.toDateString();
    };

    const isSelected = (date) => {
        if (!selectedDate) return false;
        return date.toDateString() === selectedDate.toDateString();
    };

    return (
        <div className={`${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            {/* Header con navegación */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <h2 className="text-2xl font-bold">
                        {currentMonth.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
                    </h2>
                    <button
                        onClick={goToToday}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium ${theme === 'dark'
                                ? 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30'
                                : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                            } transition-colors`}
                    >
                        Hoy
                    </button>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={previousMonth}
                        className={`p-2 rounded-lg ${theme === 'dark'
                                ? 'bg-gray-800 hover:bg-gray-700 text-gray-400'
                                : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                            } transition-colors`}
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                        onClick={nextMonth}
                        className={`p-2 rounded-lg ${theme === 'dark'
                                ? 'bg-gray-800 hover:bg-gray-700 text-gray-400'
                                : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                            } transition-colors`}
                    >
                        <ChevronRight className="w-5-h-5" />
                    </button>
                </div>
            </div>

            {/* Días de la semana */}
            <div className="grid grid-cols-7 gap-2 mb-2">
                {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map((day) => (
                    <div
                        key={day}
                        className={`text-center text-sm font-semibold py-2 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-600'
                            }`}
                    >
                        {day}
                    </div>
                ))}
            </div>

            {/* Grid de días */}
            <div className="grid grid-cols-7 gap-2">
                {calendarDays.map((day, index) => {
                    const dayPosts = getPostsForDate(day.date);
                    const hasMultiplePosts = dayPosts.length > 1;

                    return (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.01 }}
                            onClick={() => onDateChange && onDateChange(day.date)}
                            className={`
                relative min-h-[100px] p-2 rounded-lg border cursor-pointer
                ${!day.isCurrentMonth ? 'opacity-40' : ''}
                ${isToday(day.date)
                                    ? theme === 'dark'
                                        ? 'border-blue-500 bg-blue-500/10'
                                        : 'border-blue-500 bg-blue-50'
                                    : theme === 'dark'
                                        ? 'border-gray-700 bg-gray-800/50 hover:bg-gray-800'
                                        : 'border-gray-200 bg-white hover:bg-gray-50'
                                }
                ${isSelected(day.date)
                                    ? theme === 'dark'
                                        ? 'ring-2 ring-blue-500'
                                        : 'ring-2 ring-blue-400'
                                    : ''
                                }
                transition-all
              `}
                        >
                            {/* Número del día */}
                            <div className={`text-sm font-semibold mb-1 ${isToday(day.date)
                                    ? theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
                                    : theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                                }`}>
                                {day.date.getDate()}
                            </div>

                            {/* Posts del día */}
                            {dayPosts.length > 0 && (
                                <div className="space-y-1">
                                    {dayPosts.slice(0, 2).map((post, i) => (
                                        <div
                                            key={post.id}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onPostClick && onPostClick(post);
                                            }}
                                            className={`text-xs p-1.5 rounded truncate ${theme === 'dark'
                                                    ? 'bg-blue-500/20 text-blue-300 hover:bg-blue-500/30'
                                                    : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                                                }`}
                                            title={post.title}
                                        >
                                            {post.title || 'Sin título'}
                                        </div>
                                    ))}

                                    {hasMultiplePosts && dayPosts.length > 2 && (
                                        <div className={`text-xs text-center ${theme === 'dark' ? 'text-gray-500' : 'text-gray-600'
                                            }`}>
                                            +{dayPosts.length - 2} más
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Indicador de posts */}
                            {dayPosts.length > 0 && (
                                <div className="absolute bottom-1 right-1 flex gap-1">
                                    {dayPosts.slice(0, 3).map((post, i) => (
                                        <div
                                            key={i}
                                            className={`w-1.5 h-1.5 rounded-full ${theme === 'dark' ? 'bg-blue-400' : 'bg-blue-500'
                                                }`}
                                        />
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    );
                })}
            </div>

            {/* Leyenda */}
            <div className="mt-6 pt-4 border-t flex items-center justify-between flex-wrap gap-4"
                className={theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}
            >
                <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded ${theme === 'dark' ? 'bg-blue-500' : 'bg-blue-500'}`} />
                        <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                            Hoy
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded ${theme === 'dark' ? 'bg-blue-400' : 'bg-blue-500'} opacity-50`} />
                        <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                            Posts programados ({posts.length})
                        </span>
                    </div>
                </div>

                {onCreatePost && (
                    <button
                        onClick={onCreatePost}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium ${theme === 'dark'
                                ? 'bg-blue-500 hover:bg-blue-600 text-white'
                                : 'bg-blue-500 hover:bg-blue-600 text-white'
                            } transition-colors`}
                    >
                        <Plus className="w-4 h-4" />
                        Crear Post
                    </button>
                )}
            </div>
        </div>
    );
};

export default CalendarViewComplete;
