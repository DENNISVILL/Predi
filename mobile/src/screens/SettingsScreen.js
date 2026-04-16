import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Switch, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, User, Bell, Shield, LogOut, ChevronRight, Moon } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import useStore from '../store/useStore';

const SettingsScreen = () => {
    const navigation = useNavigation();
    const { user, logout, notifications, updateNotifications } = useStore(state => state);

    const handleLogout = () => {
        Alert.alert(
            "Cerrar Sesión",
            "¿Estás seguro que quieres salir?",
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Salir",
                    style: "destructive",
                    onPress: () => {
                        logout();
                        navigation.reset({
                            index: 0,
                            routes: [{ name: 'Login' }],
                        });
                    }
                }
            ]
        );
    };

    const SettingItem = ({ icon: Icon, title, value, type = 'link', onPress, color = '#60a5fa' }) => (
        <TouchableOpacity
            onPress={onPress}
            disabled={type === 'switch'}
            className="flex-row items-center justify-between p-4 bg-[#1a1c23] border-b border-white/5 last:border-0"
        >
            <View className="flex-row items-center gap-3">
                <View className={`p-2 rounded-lg bg-${color}/10`} style={{ backgroundColor: `${color}20` }}>
                    <Icon size={20} color={color} />
                </View>
                <Text className="text-white text-base font-medium">{title}</Text>
            </View>

            {type === 'switch' && (
                <Switch
                    value={value}
                    onValueChange={onPress}
                    trackColor={{ false: "#374151", true: "#2563eb" }}
                    thumbColor="#fff"
                />
            )}

            {type === 'link' && (
                <ChevronRight size={20} color="#6b7280" />
            )}
        </TouchableOpacity>
    );

    return (
        <SafeAreaView className="flex-1 bg-[#0b0c10]">
            {/* Header */}
            <View className="px-5 py-4 flex-row items-center gap-3 border-b border-white/5">
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <ArrowLeft color="white" size={24} />
                </TouchableOpacity>
                <Text className="text-white font-bold text-xl">Ajustes</Text>
            </View>

            <ScrollView className="flex-1">
                {/* Profile Section */}
                <View className="items-center py-8 border-b border-white/5 bg-[#1a1c23]/50">
                    <View className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full items-center justify-center mb-4 shadow-lg shadow-blue-500/20">
                        <Text className="text-white text-3xl font-bold">
                            {user?.name?.charAt(0).toUpperCase() || 'U'}
                        </Text>
                    </View>
                    <Text className="text-white text-xl font-bold">{user?.name || 'Usuario'}</Text>
                    <Text className="text-gray-400">{user?.email || 'email@predix.ai'}</Text>
                    <View className="mt-3 bg-blue-500/20 px-3 py-1 rounded-full">
                        <Text className="text-blue-400 text-xs font-bold">PLAN PRO</Text>
                    </View>
                </View>

                {/* Settings Groups */}
                <View className="mt-6">
                    <Text className="px-5 mb-2 text-gray-500 text-xs font-bold uppercase tracking-wider">General</Text>
                    <View className="border-t border-b border-white/5">
                        <SettingItem
                            icon={User}
                            title="Editar Perfil"
                            onPress={() => { }}
                        />
                        <SettingItem
                            icon={Bell}
                            title="Notificaciones"
                            type="switch"
                            value={notifications.push}
                            onPress={(val) => updateNotifications({ push: val })}
                            color="#a855f7"
                        />
                        <SettingItem
                            icon={Moon}
                            title="Modo Oscuro"
                            type="switch"
                            value={true}
                            onPress={() => { }}
                            color="#fff"
                        />
                    </View>
                </View>

                <View className="mt-6">
                    <Text className="px-5 mb-2 text-gray-500 text-xs font-bold uppercase tracking-wider">Seguridad</Text>
                    <View className="border-t border-b border-white/5">
                        <SettingItem
                            icon={Shield}
                            title="Cambiar Contraseña"
                            color="#10b981"
                            onPress={() => { }}
                        />
                    </View>
                </View>

                <View className="mt-8 mb-10">
                    <TouchableOpacity
                        onPress={handleLogout}
                        className="mx-5 bg-red-500/10 border border-red-500/20 p-4 rounded-xl flex-row items-center justify-center gap-2 active:bg-red-500/20"
                    >
                        <LogOut size={20} color="#ef4444" />
                        <Text className="text-red-500 font-bold">Cerrar Sesión</Text>
                    </TouchableOpacity>
                    <Text className="text-center text-gray-600 text-xs mt-4">Predix Mobile v1.0.0 (Build 2026)</Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default SettingsScreen;
