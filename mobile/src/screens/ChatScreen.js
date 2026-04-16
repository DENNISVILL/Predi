import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, KeyboardAvoidingView, Platform, ActivityIndicator, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Send, ArrowLeft, Sparkles, Bot, User, MoreVertical } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { styled } from 'nativewind';
import { generateGeminiResponse } from '../services/geminiService';
import useStore from '../store/useStore';

const ChatScreen = () => {
    const navigation = useNavigation();
    const user = useStore(state => state.user);
    const [messages, setMessages] = useState([
        {
            id: 'welcome',
            type: 'ai',
            text: `¡Hola ${user?.name || 'Creador'}! Soy Predix IA. Detecto +245% en tendencias hoy. ¿Sobre qué quieres trabajar?`,
            timestamp: new Date().toISOString()
        }
    ]);
    const [inputText, setInputText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const flatListRef = useRef(null);

    const handleSend = async () => {
        if (!inputText.trim()) return;

        const userMsg = {
            id: Date.now().toString(),
            type: 'user',
            text: inputText,
            timestamp: new Date().toISOString()
        };

        setMessages(prev => [...prev, userMsg]);
        setInputText('');
        setIsLoading(true);

        try {
            // Call Gemini Service
            const result = await generateGeminiResponse(userMsg.text, 'general', 'México');

            const aiMsg = {
                id: (Date.now() + 1).toString(),
                type: 'ai',
                text: result.success ? result.response : result.fallbackResponse,
                timestamp: new Date().toISOString()
            };

            setMessages(prev => [...prev, aiMsg]);
        } catch (error) {
            const errorMsg = {
                id: (Date.now() + 1).toString(),
                type: 'system',
                text: "Error de conexión. Intenta de nuevo.",
                timestamp: new Date().toISOString()
            };
            setMessages(prev => [...prev, errorMsg]);
        } finally {
            setIsLoading(false);
        }
    };

    const renderMessage = ({ item }) => {
        const isUser = item.type === 'user';
        return (
            <View className={`mb-4 flex-row ${isUser ? 'justify-end' : 'justify-start'}`}>
                {!isUser && (
                    <View className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-green-400 items-center justify-center mr-2 mt-1">
                        <Bot size={16} color="white" />
                    </View>
                )}

                <View
                    className={`max-w-[80%] px-4 py-3 rounded-2xl ${isUser
                            ? 'bg-blue-600 rounded-tr-none'
                            : 'bg-[#1a1c23] border border-white/10 rounded-tl-none'
                        }`}
                >
                    <Text className={`text-base ${isUser ? 'text-white' : 'text-gray-200'}`}>
                        {item.text}
                    </Text>
                    <Text className={`text-[10px] mt-1 text-right ${isUser ? 'text-blue-200' : 'text-gray-500'}`}>
                        {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Text>
                </View>

                {isUser && (
                    <View className="w-8 h-8 rounded-full bg-purple-600 items-center justify-center ml-2 mt-1">
                        <User size={16} color="white" />
                    </View>
                )}
            </View>
        );
    };

    return (
        <SafeAreaView className="flex-1 bg-[#0b0c10]">
            {/* Header */}
            <View className="flex-row items-center justify-between px-4 py-3 border-b border-white/10 bg-[#0b0c10]/95">
                <View className="flex-row items-center gap-3">
                    <TouchableOpacity onPress={() => navigation.goBack()} className="p-2">
                        <ArrowLeft color="white" size={24} />
                    </TouchableOpacity>
                    <View>
                        <Text className="text-white font-bold text-lg">Predix Chat</Text>
                        <View className="flex-row items-center gap-1">
                            <View className="w-2 h-2 rounded-full bg-green-500" />
                            <Text className="text-green-500 text-xs">En línea</Text>
                        </View>
                    </View>
                </View>
                <TouchableOpacity className="p-2">
                    <MoreVertical color="white" size={24} />
                </TouchableOpacity>
            </View>

            {/* Chat Area */}
            <FlatList
                ref={flatListRef}
                data={messages}
                renderItem={renderMessage}
                keyExtractor={item => item.id}
                contentContainerStyle={{ padding: 20, paddingBottom: 20 }}
                onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
                onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
            />

            {/* Input Area */}
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
            >
                <View className="p-4 bg-[#1a1c23] border-t border-white/10">
                    <View className="flex-row items-center gap-2">
                        <TouchableOpacity className="p-3 rounded-full bg-white/5">
                            <Sparkles color="#a855f7" size={20} />
                        </TouchableOpacity>

                        <View className="flex-1 bg-[#0b0c10] border border-white/10 rounded-2xl px-4 py-2 flex-row items-center">
                            <TextInput
                                value={inputText}
                                onChangeText={setInputText}
                                placeholder="Escribe tu mensaje..."
                                placeholderTextColor="#6b7280"
                                className="flex-1 text-white max-h-24"
                                multiline
                            />
                        </View>

                        <TouchableOpacity
                            onPress={handleSend}
                            disabled={isLoading || !inputText.trim()}
                            className={`p-3 rounded-full ${inputText.trim() ? 'bg-blue-600' : 'bg-gray-700'}`}
                        >
                            {isLoading ? (
                                <ActivityIndicator color="white" size="small" />
                            ) : (
                                <Send color="white" size={20} />
                            )}
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default ChatScreen;
