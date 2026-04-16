import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, TrendingUp, Filter, Zap, Target, ArrowUpRight } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { styled } from 'nativewind';
import useStore from '../store/useStore';

const RadarScreen = () => {
    const navigation = useNavigation();
    const { trendingNow } = useStore(state => state);
    const [activeTab, setActiveTab] = useState('viral'); // viral, emerging, predictions

    // Mock additional data matching the web store structure roughly
    const emergingTrends = [
        { id: 101, name: '#EcoMinimalism', platform: 'Instagram', growth: '+85%', category: 'Lifestyle', score: 78 },
        { id: 102, name: 'Retro Tech', platform: 'TikTok', growth: '+62%', category: 'Tech', score: 65 },
        { id: 103, name: 'Slow Travel', platform: 'Pinterest', growth: '+45%', category: 'Travel', score: 90 },
    ];

    const predictions = [
        { id: 201, name: 'VR Fitness', probability: 'Alta', date: 'Q3 2026', growth: '+120% projected' },
        { id: 202, name: 'Digital Fashion', probability: 'Media', date: 'Q4 2026', growth: '+90% projected' },
    ];

    const renderTrendItem = ({ item }) => (
        <TouchableOpacity className="bg-[#1a1c23] border border-white/5 rounded-2xl p-4 mb-3 flex-row items-center justify-between">
            <View className="flex-row items-center gap-4 flex-1">
                <View className={`w-10 h-10 rounded-xl items-center justify-center ${item.platform === 'TikTok' ? 'bg-black border border-white/10' :
                        item.platform === 'Instagram' ? 'bg-purple-900/50' : 'bg-blue-900/50'
                    }`}>
                    {/* Simple platform initial for icon if icon not available, or generic trend icon */}
                    <TrendingUp size={20} color={
                        item.platform === 'TikTok' ? '#ff0050' :
                            item.platform === 'Instagram' ? '#d62976' : '#3b82f6'
                    } />
                </View>
                <View className="flex-1">
                    <Text className="text-white font-bold text-base">{item.name}</Text>
                    <View className="flex-row items-center gap-2 mt-1">
                        <Text className="text-gray-400 text-xs">{item.platform}</Text>
                        <View className="w-1 h-1 bg-gray-600 rounded-full" />
                        <Text className="text-gray-400 text-xs">{item.category}</Text>
                    </View>
                </View>
            </View>

            <View className="items-end">
                <View className="flex-row items-center gap-1 bg-green-500/10 px-2 py-1 rounded-lg">
                    <ArrowUpRight size={12} color="#4ade80" />
                    <Text className="text-green-400 text-xs font-bold">{item.growth}</Text>
                </View>
                {item.score && (
                    <Text className="text-gray-500 text-[10px] mt-1">Score: {item.score}</Text>
                )}
            </View>
        </TouchableOpacity>
    );

    const renderPredictionItem = ({ item }) => (
        <TouchableOpacity className="bg-[#1a1c23] border border-white/5 rounded-2xl p-4 mb-3">
            <View className="flex-row justify-between mb-2">
                <Text className="text-white font-bold text-base">{item.name}</Text>
                <View className={`px-2 py-1 rounded-lg ${item.probability === 'Alta' ? 'bg-purple-500/20' : 'bg-blue-500/20'
                    }`}>
                    <Text className={`${item.probability === 'Alta' ? 'text-purple-400' : 'text-blue-400'
                        } text-xs font-bold`}>{item.probability}</Text>
                </View>
            </View>
            <Text className="text-gray-400 text-sm mb-3">{item.growth}</Text>
            <View className="flex-row items-center gap-2">
                <Target size={14} color="#9ca3af" />
                <Text className="text-gray-500 text-xs">Impacto esperado: {item.date}</Text>
            </View>
        </TouchableOpacity>
    );

    const getData = () => {
        switch (activeTab) {
            case 'viral': return trendingNow;
            case 'emerging': return emergingTrends;
            case 'predictions': return predictions;
            default: return trendingNow;
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-[#0b0c10]">
            {/* Header */}
            <View className="flex-row items-center justify-between px-5 py-4 bg-[#0b0c10]/95 border-b border-white/5">
                <View className="flex-row items-center gap-3">
                    <TouchableOpacity onPress={() => navigation.goBack()} className="p-2 -ml-2">
                        <ArrowLeft color="white" size={24} />
                    </TouchableOpacity>
                    <Text className="text-white font-bold text-xl">Radar Inteligente</Text>
                </View>
                <TouchableOpacity className="p-2 bg-gray-900 rounded-lg border border-white/10">
                    <Filter color="#9ca3af" size={20} />
                </TouchableOpacity>
            </View>

            {/* Tabs */}
            <View className="px-5 py-4">
                <ScrollView horizontal showsHorizontalScrollIndicator={false} className="gap-3">
                    {[
                        { id: 'viral', label: 'Virales', icon: Zap },
                        { id: 'emerging', label: 'Emergentes', icon: TrendingUp },
                        { id: 'predictions', label: 'Predicciones', icon: Target },
                    ].map((tab) => (
                        <TouchableOpacity
                            key={tab.id}
                            onPress={() => setActiveTab(tab.id)}
                            className={`flex-row items-center gap-2 px-4 py-2 rounded-full border ${activeTab === tab.id
                                    ? 'bg-blue-600 border-blue-500'
                                    : 'bg-[#1a1c23] border-white/10'
                                }`}
                        >
                            <tab.icon size={16} color={activeTab === tab.id ? 'white' : '#9ca3af'} />
                            <Text className={`${activeTab === tab.id ? 'text-white' : 'text-gray-400'} font-medium text-sm`}>
                                {tab.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            {/* Content List */}
            <FlatList
                data={getData()}
                renderItem={activeTab === 'predictions' ? renderPredictionItem : renderTrendItem}
                keyExtractor={item => item.id.toString()}
                contentContainerStyle={{ padding: 20 }}
                showsVerticalScrollIndicator={false}
                ListHeaderComponent={() => (
                    <Text className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-4">
                        {activeTab === 'viral' ? 'Tendencias en Tiempo Real' :
                            activeTab === 'emerging' ? 'Detectadas hace < 24h' : 'Futuro Probable'}
                    </Text>
                )}
            />
        </SafeAreaView>
    );
};

export default RadarScreen;
