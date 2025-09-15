// App.tsx
import React from 'react';
import { SafeAreaView, StatusBar } from 'react-native';
import MapScreen from './src/screens/MapScreen';
import MapboxGL from '@react-native-mapbox-gl/maps';
import { MAPBOX_TOKEN } from './src/config';

// Set token once (ensure this runs before any Mapbox components)
MapboxGL.setAccessToken(MAPBOX_TOKEN);

export default function App() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar barStyle="dark-content" />
      <MapScreen />
    </SafeAreaView>
  );
}