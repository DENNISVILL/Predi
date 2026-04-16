/**
 * TimeRangeSelector - Period selector for dashboard metrics
 */

import React from 'react';
import { motion } from 'framer-motion';

const TimeRangeSelector = ({ selected = '7d', onChange }) => {
    const ranges = [
        { id: 'today', label: 'Hoy', value: 'today' },
        { id: '7d', label: '7 días', value: '7d' },
        { id: '30d', label: '30 días', value: '30d' },
        { id: '90d', label: '90 días', value: '90d' }
    ];

    return (
        <div className="inline-flex bg-gray-800/50 rounded-lg p-1 border border-gray-700/50">
            {ranges.map((range) => (
                <button
                    key={range.id}
                    onClick={() => onChange && onChange(range.value)}
                    className={`relative px-4 py-2 text-sm font-medium rounded-md transition-all ${selected === range.value
                            ? 'text-white'
                            : 'text-gray-400 hover:text-white'
                        }`}
                >
                    {selected === range.value && (
                        <motion.div
                            layoutId="activeTab"
                            className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-md"
                            transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                        />
                    )}
                    <span className="relative z-10">{range.label}</span>
                </button>
            ))}
        </div>
    );
};

export default TimeRangeSelector;
