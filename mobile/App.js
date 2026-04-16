import React from 'react';
import AppNavigator from './src/navigation/AppNavigator';
import { View } from 'react-native';

// Import NativeWind styles
// import "./global.css";

export default function App() {
  return (
    <View style={{ flex: 1, backgroundColor: '#0b0c10' }}>
      <AppNavigator />
    </View>
  );
}
