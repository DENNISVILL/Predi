import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import {
    Menu, Bell, Search, TrendingUp, Users, Activity,
    Globe, Sparkles, FileText, RefreshCw
} from 'lucide-react-native';
import { styled } from 'nativewind';
import { useNavigation } from '@react-navigation/native';
import useStore from '../store/useStore';

const DashboardScreen = () => {
    const navigation = useNavigation();
    // Mock user
    const user = useStore(state => state.user);
    const mockUser = { name: "Demo User" };

    // Mock KPI Data
    const metrics = [
        { label: "Tendencias", value: "24", change: "+12%", icon: TrendingUp, color: "blue" },
        { label: "Alcance", value: "1.2M", change: "+8%", icon: Globe, color: "purple" },
        { label: "Engagement", value: "5.8%", change: "+2%", icon: Activity, color: "green" },
        { label: "Seguidores", value: "85K", change: "+450", icon: Users, color: "pink" },
    ];

    // Quick Actions Data
    const quickActions = [
        { id: 'analyze', title: 'Analizar', subtitle: 'Trend', icon: Search, color: ['#06b6d4', '#2563eb'], onPress: () => navigation.navigate('Radar') },
        { id: 'generate', title: 'Generar', subtitle: 'Idea', icon: Sparkles, color: ['#a855f7', '#db2777'], onPress: () => navigation.navigate('Chat') },
        { id: 'audit', title: 'Auditoría', subtitle: 'Cuenta', icon: FileText, color: ['#10b981', '#0d9488'] },
        { id: 'refresh', title: 'Update', subtitle: 'Datos', icon: RefreshCw, color: ['#f97316', '#dc2626'] },
    ];

    return (
        <SafeAreaView className="flex-1 bg-[#0b0c10]">
            <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 100 }}>

                {/* Header */}
                <View className="px-5 py-4 flex-row justify-between items-center bg-[#0b0c10]/95 border-b border-gray-800">
                    <View className="flex-row items-center gap-3">
                        <TouchableOpacity onPress={() => navigation.toggleDrawer()} className="p-2 bg-gray-900 rounded-lg">
                            <Menu color="#9ca3af" size={24} />
                        </TouchableOpacity>
                        <View>
                            <Text className="text-white font-bold text-lg">Predix</Text>
                            <Text className="text-gray-500 text-xs">Hola, {user?.name || mockUser.name}</Text>
                        </View>
                    </View>
                    <View className="flex-row gap-3">
                        <TouchableOpacity className="p-2">
                            <Search color="#9ca3af" size={22} />
                        </TouchableOpacity>
                        <TouchableOpacity className="p-2 relative">
                            <Bell color="#9ca3af" size={22} />
                            <View className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full" />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Quick Actions (Horizontal) */}
                <View className="mt-6 px-5">
                    <Text className="text-white font-bold text-base mb-3 flex-row items-center">
                        <View className="w-1 h-5 bg-blue-500 mr-2 rounded-full" />
                        Acciones Estratégicas
                    </Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} className="gap-3 pr-5">
                        {quickActions.map((action) => (
                            <TouchableOpacity key={action.id} className="mr-3" onPress={action.onPress}>
                                <LinearGradient
                                    colors={action.color}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 1 }}
                                    className="w-28 h-32 rounded-2xl p-3 justify-between"
                                >
                                    <View className="w-8 h-8 bg-white/20 rounded-lg items-center justify-center">
                                        <action.icon color="white" size={16} />
                                    </View>
                                    <View>
                                        <Text className="text-white font-bold text-sm">{action.title}</Text>
                                        <Text className="text-white/80 text-xs">{action.subtitle}</Text>
                                    </View>
                                </LinearGradient>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                {/* KPI Grid */}
                <View className="mt-8 px-5">
                    <Text className="text-white font-bold text-base mb-3">Resumen Global</Text>
                    <View className="flex-row flex-wrap justify-between">
                        {metrics.map((metric, index) => (
                            <View
                                key={index}
                                className="w-[48%] bg-[#1a1c23] border border-white/5 rounded-2xl p-4 mb-4 shadow"
                            >
                                <View className="flex-row justify-between items-start mb-2">
                                    <View className={`p-2 rounded-lg bg-${metric.color}-500/10`}>
                                        <metric.icon size={18} color={metric.color === 'white' ? 'white' : '#60a5fa'} />
                                        {/* Simplified color logic for demo - in logic we'd map string to hex */}
                                    </View>
                                    <Text className="text-green-400 text-xs font-bold">{metric.change}</Text>
                                </View>
                                <Text className="text-2xl font-bold text-white mb-1">{metric.value}</Text>
                                <Text className="text-gray-500 text-xs">{metric.label}</Text>
                            </View>
                        ))}
                    </View>
                </View>

                {/* Recent Activity Feed Preview */}
                <View className="mt-4 px-5 pb-8">
                    <Text className="text-white font-bold text-base mb-3">Actividad Reciente</Text>
                    <View className="bg-[#1a1c23] border border-white/5 rounded-2xl p-1">
                        {[1, 2, 3].map((item, i) => (
                            <TouchableOpacity key={i} className="flex-row items-center p-3 border-b border-white/5 last:border-0">
                                <View className="w-10 h-10 bg-blue-500/10 rounded-lg items-center justify-center mr-3">
                                    <TrendingUp color="#60a5fa" size={18} />
                                </View>
                                <View className="flex-1">
                                    <Text className="text-white font-semibold text-sm">Nuevo Trend Detectado</Text>
                                    <Text className="text-gray-400 text-xs">#ViralTech está creciendo...</Text>
                                </View>
                                <Text className="text-gray-600 text-xs">2h</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
};

export default DashboardScreen;
