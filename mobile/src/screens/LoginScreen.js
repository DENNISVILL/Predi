import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { Sparkles, ArrowRight, Lock, Mail } from 'lucide-react-native';
import { styled } from 'nativewind';
import useStore from '../store/useStore';

const LoginScreen = () => {
    const navigation = useNavigation();
    const login = useStore(state => state.login);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = () => {
        // Mock login for now
        if (email) {
            login({ name: 'Usuario Demo', email: email });
            navigation.replace('Main');
        } else {
            // Fallback for empty
            login({ name: 'Usuario Demo', email: 'demo@predix.ai' });
            navigation.replace('Main');
        }
    };

    return (
        <View className="flex-1 bg-[#0b0c10]">
            <LinearGradient
                colors={['#0b0c10', '#1a1c23']}
                className="flex-1 justify-center px-8"
            >
                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>

                    {/* Header / Logo */}
                    <View className="items-center mb-12">
                        <View className="w-16 h-16 bg-gradient-to-r from-blue-500 to-green-400 rounded-2xl items-center justify-center mb-4 shadow-lg shadow-blue-500/20">
                            {/* Gradient background for logo simulated with View styling if LinearGradient nested doesn't work well directly, 
                                 but here we can use a simpler approach or another LinearGradient */}
                            <LinearGradient
                                colors={['#007bff', '#00ff9d']}
                                className="w-16 h-16 rounded-2xl items-center justify-center"
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                            >
                                <Sparkles color="white" size={32} />
                            </LinearGradient>
                        </View>
                        <Text className="text-3xl font-bold text-white mb-2">Predix</Text>
                        <Text className="text-gray-400 text-center">
                            Inteligencia Artificial para{'\n'}Dominar las Tendencias
                        </Text>
                    </View>

                    {/* Form */}
                    <View className="space-y-4 mb-8">
                        <View className="bg-gray-900/50 border border-gray-800 rounded-xl px-4 py-3 flex-row items-center space-x-3">
                            <Mail color="#9ca3af" size={20} />
                            <TextInput
                                placeholder="Correo electrónico"
                                placeholderTextColor="#6b7280"
                                className="flex-1 text-white text-base"
                                value={email}
                                onChangeText={setEmail}
                                autoCapitalize="none"
                            />
                        </View>

                        <View className="bg-gray-900/50 border border-gray-800 rounded-xl px-4 py-3 flex-row items-center space-x-3">
                            <Lock color="#9ca3af" size={20} />
                            <TextInput
                                placeholder="Contraseña"
                                placeholderTextColor="#6b7280"
                                className="flex-1 text-white text-base"
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry
                            />
                        </View>
                    </View>

                    {/* Buttons */}
                    <TouchableOpacity
                        onPress={handleLogin}
                        className="bg-blue-600 rounded-xl py-4 items-center mb-6 shadow-lg shadow-blue-600/20"
                    >
                        {/* We can use LinearGradient for button too */}
                        <LinearGradient
                            colors={['#007bff', '#0056b3']}
                            className="absolute inset-0 rounded-xl"
                        />
                        <View className="flex-row items-center space-x-2">
                            <Text className="text-white font-bold text-lg">Iniciar Sesión</Text>
                            <ArrowRight color="white" size={20} />
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => { }}>
                        <Text className="text-gray-500 text-center text-sm">
                            ¿Olvidaste tu contraseña?
                        </Text>
                    </TouchableOpacity>

                </KeyboardAvoidingView>
            </LinearGradient>
        </View>
    );
};

export default LoginScreen;
