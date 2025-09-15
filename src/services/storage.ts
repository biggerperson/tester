// src/services/storage.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Pin } from '../types';

const PINS_KEY = 'app:pins:v1';

export async function loadPins(): Promise<Pin[]> {
  const raw = await AsyncStorage.getItem(PINS_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as Pin[];
  } catch {
    return [];
  }
}

export async function savePins(pins: Pin[]): Promise<void> {
  await AsyncStorage.setItem(PINS_KEY, JSON.stringify(pins));
}