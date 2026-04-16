/**
 * TrendChart - Interactive charts for trend visualization
 * Uses Recharts for beautiful, responsive data visualization
 */

import React from 'react';
import {
    LineChart, Line, BarChart, Bar, AreaChart, Area, PieChart, Pie,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell
} from 'recharts';

// Custom Tooltip
const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-gray-900 border border-cyan-500/30 rounded-lg p-3 shadow-xl">
                <p className="text-white font-semibold mb-1">{label}</p>
                {payload.map((entry, index) => (
                    <p key={index} className="text-sm" style={{ color: entry.color }}>
                        {entry.name}: {entry.value.toLocaleString()}
                    </p>
                ))}
            </div>
        );
    }
    return null;
};

// Growth Chart - Line chart showing historical growth
export const GrowthChart = ({ data, height = 300 }) => {
    return (
        <ResponsiveContainer width="100%" height={height}>
            <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="date" stroke="#9CA3AF" style={{ fontSize: '12px' }} />
                <YAxis stroke="#9CA3AF" style={{ fontSize: '12px' }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: '12px', color: '#9CA3AF' }} />
                <Line
                    type="monotone"
                    dataKey="mentions"
                    stroke="#06B6D4"
                    strokeWidth={2}
                    name="Menciones"
                    dot={{ fill: '#06B6D4', r: 4 }}
                    activeDot={{ r: 6 }}
                />
                <Line
                    type="monotone"
                    dataKey="engagement"
                    stroke="#10B981"
                    strokeWidth={2}
                    name="Engagement %"
                    dot={{ fill: '#10B981', r: 4 }}
                />
            </LineChart>
        </ResponsiveContainer>
    );
};

// Platform Comparison Chart - Bar chart
export const PlatformComparisonChart = ({ data, height = 300 }) => {
    return (
        <ResponsiveContainer width="100%" height={height}>
            <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="platform" stroke="#9CA3AF" style={{ fontSize: '12px' }} />
                <YAxis stroke="#9CA3AF" style={{ fontSize: '12px' }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Bar dataKey="count" fill="#06B6D4" name="Trends" radius={[4, 4, 0, 0]} />
                <Bar dataKey="avgGrowth" fill="#10B981" name="Crecimiento Promedio %" radius={[4, 4, 0, 0]} />
            </BarChart>
        </ResponsiveContainer>
    );
};

// Engagement Area Chart
export const EngagementAreaChart = ({ data, height = 300 }) => {
    return (
        <ResponsiveContainer width="100%" height={height}>
            <AreaChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <defs>
                    <linearGradient id="colorEngagement" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.1} />
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="date" stroke="#9CA3AF" style={{ fontSize: '12px' }} />
                <YAxis stroke="#9CA3AF" style={{ fontSize: '12px' }} />
                <Tooltip content={<CustomTooltip />} />
                <Area
                    type="monotone"
                    dataKey="engagement"
                    stroke="#8B5CF6"
                    fillOpacity={1}
                    fill="url(#colorEngagement)"
                    name="Engagement %"
                />
            </AreaChart>
        </ResponsiveContainer>
    );
};

// Geographic Distribution Pie Chart
export const GeographicPieChart = ({ data, height = 300 }) => {
    const COLORS = ['#06B6D4', '#10B981', '#8B5CF6', '#F59E0B', '#EF4444', '#EC4899'];

    return (
        <ResponsiveContainer width="100%" height={height}>
            <PieChart>
                <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
            </PieChart>
        </ResponsiveContainer>
    );
};

// Multi-platform Comparison
export const MultiPlatformChart = ({ tiktokData, instagramData, facebookData, height = 300 }) => {
    return (
        <ResponsiveContainer width="100%" height={height}>
            <LineChart margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="date" stroke="#9CA3AF" style={{ fontSize: '12px' }} />
                <YAxis stroke="#9CA3AF" style={{ fontSize: '12px' }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Line
                    data={tiktokData}
                    type="monotone"
                    dataKey="growth"
                    stroke="#FF0050"
                    strokeWidth={2}
                    name="TikTok"
                    dot={false}
                />
                <Line
                    data={instagramData}
                    type="monotone"
                    dataKey="growth"
                    stroke="#E4405F"
                    strokeWidth={2}
                    name="Instagram"
                    dot={false}
                />
                <Line
                    data={facebookData}
                    type="monotone"
                    dataKey="growth"
                    stroke="#1877F2"
                    strokeWidth={2}
                    name="Facebook"
                    dot={false}
                />
            </LineChart>
        </ResponsiveContainer>
    );
};

export default {
    GrowthChart,
    PlatformComparisonChart,
    EngagementAreaChart,
    GeographicPieChart,
    MultiPlatformChart
};
