/**
 * CalendarView - Interactive calendar with drag & drop
 * Uses react-big-calendar for calendar UI
 */

import React, { useState, useCallback } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'moment/locale/es';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { motion } from 'framer-motion';
import {
    Clock,
    Image as ImageIcon,
    Video,
    Layers,
    Instagram,
    Youtube,
    Linkedin,
    Facebook,
    Twitter
} from 'lucide-react';
import './CalendarView.css';

const localizer = momentLocalizer(moment);

const ContentTypeIcon = ({ type, size = 14 }) => {
    switch (type?.toLowerCase()) {
        case 'reel':
        case 'video':
        case 'shorts':
            return <Video size={size} />;
        case 'carousel':
        case 'album':
            return <Layers size={size} />;
        case 'story':
            return <div className="w-3 h-3 rounded-full border-2 border-current" />;
        default:
            return <ImageIcon size={size} />;
    }
};

const CustomEvent = ({ event }) => {
    const { resource: post } = event;

    // Type-based colors as requested by user
    const typeColors = {
        story: '#3b82f6', // HISTORIAS - Blue
        carousel: '#10b981', // CARRUSEL - Green
        video: '#ec4899', // VIDEOS - Pink
        planning: '#f59e0b', // PLANIFICACIONES - Orange
        default: '#6366F1'
    };

    // Normalize type
    const eventType = (post.type || post.mediaType || 'video').toLowerCase();
    const color = typeColors[eventType] || typeColors.default;

    return (
        <div
            className="w-full h-full min-h-[20px] rounded-md px-1 flex items-center shadow-sm mt-auto"
            style={{
                backgroundColor: color,
                opacity: 0.9
            }}
        >
            <span className="text-[10px] font-bold text-white truncate w-full">
                {event.title}
            </span>
        </div>
    );
};

const CalendarView = ({ posts = [], onPostMove, onPostClick, onDateSelect }) => {
    const [view, setView] = useState('month');
    const [selectedDate, setSelectedDate] = useState(new Date());

    // Set moment locale to Spanish
    moment.locale('es');

    // Custom localizer with capitalization fix
    const localizer = momentLocalizer(moment);

    // Platform colors
    const platformColors = {
        instagram: '#E1306C',
        tiktok: '#000000',
        youtube: '#FF0000',
        linkedin: '#0077B5',
        facebook: '#1877F2',
        twitter: '#1DA1F2'
    };

    // Virality score colors
    const getViralityColor = (score) => {
        if (score >= 91) return '#8B5CF6'; // Viral - purple
        if (score >= 71) return '#10B981'; // High - green
        if (score >= 41) return '#F59E0B'; // Medium - orange
        return '#EF4444'; // Low - red
    };

    // Transform posts to calendar events
    const events = posts.map(post => ({
        id: post.id,
        title: post.title || post.content?.substring(0, 30),
        start: new Date(post.scheduledDate || post.date),
        end: new Date(post.scheduledDate || post.date),
        resource: post
    }));

    // Handle event drop (drag & drop)
    const handleEventDrop = useCallback(({ event, start, end }) => {
        if (onPostMove) {
            onPostMove(event.id, start);
        }
    }, [onPostMove]);

    // Handle event click
    const handleSelectEvent = useCallback((event) => {
        if (onPostClick) {
            onPostClick(event.resource);
        }
    }, [onPostClick]);

    // Handle slot selection (date click)
    const handleSelectSlot = useCallback((slotInfo) => {
        if (onDateSelect) {
            onDateSelect(slotInfo.start);
        }
    }, [onDateSelect]);

    // Custom event style
    const eventStyleGetter = (event) => {
        const post = event.resource;
        const platformColor = platformColors[post.platform?.toLowerCase()] || '#6366F1';
        const viralityScore = post.viralScore || 50;

        return {
            style: {
                backgroundColor: platformColor,
                borderLeft: `4px solid ${getViralityColor(viralityScore)}`,
                color: 'white',
                borderRadius: '6px',
                padding: '0', // Remove default padding for custom component
                fontSize: '12px',
                fontWeight: '500',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                cursor: 'pointer',
                transition: 'all 0.2s',
                overflow: 'hidden' // Ensure content doesn't spill
            }
        };
    };

    // Custom day prop getter
    const dayPropGetter = (date) => {
        const today = moment().startOf('day');
        const currentDate = moment(date).startOf('day');

        if (currentDate.isSame(today)) {
            return {
                style: {
                    backgroundColor: 'rgba(99, 102, 241, 0.1)',
                    border: '2px solid #6366F1'
                }
            };
        }
        return {};
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="calendar-container flex flex-col md:flex-row gap-6 h-[650px] bg-black p-6 rounded-3xl"
        >
            {/* Left Column: Sidebar (Dark Theme) */}
            <div className="w-full md:w-72 flex flex-col gap-6 text-white shrink-0">
                <div className="border-b border-gray-800 pb-4">
                    <h2 className="text-4xl font-black tracking-tighter text-white mb-1 capitalize">
                        {moment(selectedDate).format('MMMM')}
                    </h2>
                </div>

                {/* TIPO CONTENIDO List */}
                <div className="flex-grow">
                    <h3 className="text-xs font-bold text-gray-400 mb-4 tracking-widest uppercase">
                        TIPO CONTENIDO
                    </h3>

                    <div className="space-y-3">
                        {/* Categories matched to User's Legend */}
                        {[
                            { label: 'HISTORIAS', color: '#3b82f6', tag: 'MUSICA - SIN COPY' },
                            { label: 'CARRUSEL', color: '#10b981', tag: 'MUSICA - COPY' },
                            { label: 'VIDEOS', color: '#ec4899', tag: 'MUSICA - COPY' },
                            { label: 'PLANIFICACIONES', color: '#f59e0b', tag: 'ANALITICAS' },
                        ].map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between group cursor-pointer hover:bg-gray-900/50 p-2 rounded-lg transition-colors">
                                <div className="flex items-center gap-2">
                                    <span className="text-lg font-bold" style={{ color: item.color }}>#</span>
                                    <span className="font-bold text-sm tracking-wide">{item.label}</span>
                                </div>
                                <span
                                    className="text-[9px] font-bold px-2 py-1 rounded-full text-white"
                                    style={{ backgroundColor: item.color }}
                                >
                                    {item.tag}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right Column: Calendar Grid (White Cards) */}
            <div className="flex-grow rounded-xl overflow-hidden calendar-dark-mode">
                <Calendar
                    localizer={localizer}
                    events={events}
                    startAccessor="start"
                    endAccessor="end"
                    style={{ height: '100%' }}
                    view="month" // Force month view for this design
                    onView={() => { }} // Disable view switching
                    date={selectedDate}
                    onNavigate={setSelectedDate}
                    onSelectEvent={handleSelectEvent}
                    onSelectSlot={handleSelectSlot}
                    onEventDrop={handleEventDrop}
                    eventPropGetter={eventStyleGetter}
                    dayPropGetter={dayPropGetter}
                    draggableAccessor={() => true}
                    resizable={false}
                    selectable
                    popup
                    toolbar={true}
                    components={{
                        event: CustomEvent,
                        toolbar: () => null // Hide default toolbar as we have the sidebar title
                    }}
                />
            </div>
        </motion.div>
    );
};

export default CalendarView;
