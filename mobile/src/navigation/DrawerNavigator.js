import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import { LayoutDashboard, MessageSquare, Radio, Settings, LogOut, TrendingUp } from 'lucide-react-native';
import { styled } from 'nativewind';
import { useNavigation } from '@react-navigation/native';
import useStore from '../store/useStore';

// Screens
import DashboardScreen from '../screens/DashboardScreen';
import ChatScreen from '../screens/ChatScreen';
import RadarScreen from '../screens/RadarScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Drawer = createDrawerNavigator();

const CustomDrawerContent = (props) => {
    const { user, logout } = useStore(state => state);
    const navigation = useNavigation();

    const handleLogout = () => {
        logout();
        navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }],
        });
    };

    return (
        <View className="flex-1 bg-[#0b0c10]">
            {/* Drawer Header */}
            <View className="px-5 pt-12 pb-6 border-b border-white/5 bg-[#1a1c23]">
                <View className="w-16 h-16 bg-gradient-to-br from-blue-500 to-green-500 rounded-2xl items-center justify-center mb-3">
                    <Text className="text-white text-2xl font-bold">{user?.name?.charAt(0) || 'U'}</Text>
                </View>
                <Text className="text-white font-bold text-lg">{user?.name || 'Predix User'}</Text>
                <Text className="text-gray-400 text-sm">{user?.email || 'user@predix.ai'}</Text>
            </View>

            <DrawerContentScrollView {...props} contentContainerStyle={{ paddingTop: 10 }}>
                <DrawerItemList {...props} />
            </DrawerContentScrollView>

            {/* Drawer Footer */}
            <View className="p-5 border-t border-white/5">
                <TouchableOpacity onPress={handleLogout} className="flex-row items-center gap-3 opacity-70">
                    <LogOut size={20} color="#ef4444" />
                    <Text className="text-red-500 font-medium">Cerrar Sesión</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const DrawerNavigator = () => {
    return (
        <Drawer.Navigator
            drawerContent={(props) => <CustomDrawerContent {...props} />}
            screenOptions={{
                headerShown: false,
                drawerStyle: {
                    backgroundColor: '#0b0c10',
                    width: 280,
                },
                drawerActiveBackgroundColor: '#2563eb20',
                drawerActiveTintColor: '#60a5fa',
                drawerInactiveTintColor: '#9ca3af',
                drawerLabelStyle: {
                    marginLeft: -20,
                    fontSize: 15,
                    fontWeight: '600',
                },
                sceneContainerStyle: {
                    backgroundColor: '#0b0c10'
                }
            }}
        >
            <Drawer.Screen
                name="Dashboard"
                component={DashboardScreen}
                options={{
                    drawerIcon: ({ color }) => <LayoutDashboard size={22} color={color} />,
                    title: 'Inicio'
                }}
            />
            <Drawer.Screen
                name="Radar"
                component={RadarScreen}
                options={{
                    drawerIcon: ({ color }) => <Radio size={22} color={color} />,
                    title: 'Radar Inteligente'
                }}
            />
            <Drawer.Screen
                name="Chat"
                component={ChatScreen}
                options={{
                    drawerIcon: ({ color }) => <MessageSquare size={22} color={color} />,
                    title: 'Asistente IA'
                }}
            />
            <Drawer.Screen
                name="Settings"
                component={SettingsScreen}
                options={{
                    drawerIcon: ({ color }) => <Settings size={22} color={color} />,
                    title: 'Configuración'
                }}
            />
        </Drawer.Navigator>
    );
};

export default DrawerNavigator;
