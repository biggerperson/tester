// src/screens/MapScreen.tsx
import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import MapboxGL from '@react-native-mapbox-gl/maps';
import SearchBar from '../components/SearchBar';
import { loadPins, savePins } from '../services/storage';
import type { Pin } from '../types';

const DEFAULT_COORDINATE: [number, number] = [-122.4194, 37.7749]; // SF as default [lng, lat]

export default function MapScreen() {
  const cameraRef = useRef<MapboxGL.Camera>(null);
  const [pins, setPins] = useState<Pin[]>([]);
  const [center, setCenter] = useState<[number, number]>(DEFAULT_COORDINATE);

  useEffect(() => {
    // load persisted pins on mount
    (async () => {
      try {
        const loaded = await loadPins();
        if (loaded.length > 0) {
          setPins(loaded);
          // center on first pin
          const p = loaded[0];
          setCenter([p.longitude, p.latitude]);
        }
      } catch (e) {
        console.warn('Failed to load pins', e);
      }
    })();
  }, []);

  useEffect(() => {
    // persist pins whenever they change
    savePins(pins).catch((e) => console.warn('Failed to save pins', e));
  }, [pins]);

  const onLongPress = (evt: MapboxGL.MapEvent) => {
    try {
      const coords = evt.geometry.coordinates as [number, number];
      const newPin: Pin = {
        id: `${Date.now()}`,
        title: 'Pinned location',
        description: '',
        longitude: coords[0],
        latitude: coords[1],
        createdAt: new Date().toISOString(),
      };
      setPins((prev) => [newPin, ...prev]);
    } catch (err) {
      console.warn('Could not add pin', err);
    }
  };

  const onSearchSelect = (result: { center: [number, number]; place_name?: string }) => {
    const [lng, lat] = result.center;
    // center camera
    cameraRef.current?.setCamera({
      centerCoordinate: [lng, lat],
      zoomLevel: 14,
      animationDuration: 800,
    });
    // add a pin at search result
    const newPin: Pin = {
      id: `${Date.now()}`,
      title: result.place_name ?? 'Search result',
      description: '',
      longitude: lng,
      latitude: lat,
      createdAt: new Date().toISOString(),
    };
    setPins((prev) => [newPin, ...prev]);
  };

  return (
    <View style={styles.container}>
      <SearchBar onSelect={onSearchSelect} />
      <MapboxGL.MapView
        style={styles.map}
        styleURL={MapboxGL.StyleURL.Street}
        onLongPress={onLongPress}
        logoEnabled={false}
        compassEnabled={true}
      >
        <MapboxGL.Camera ref={cameraRef} centerCoordinate={center} zoomLevel={12} />

        {/* Render pins */}
        {pins.map((pin) => (
          <MapboxGL.PointAnnotation
            key={pin.id}
            id={pin.id}
            coordinate={[pin.longitude, pin.latitude]}
            title={pin.title}
          >
            <View style={styles.pin} />
            <MapboxGL.Callout title={pin.title} />
          </MapboxGL.PointAnnotation>
        ))}
      </MapboxGL.MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  pin: {
    width: 24,
    height: 24,
    backgroundColor: '#ff3b30',
    borderRadius: 12,
    borderColor: '#fff',
    borderWidth: 2,
  },
});