// src/components/SearchBar.tsx
import React, { useState } from 'react';
import { View, TextInput, FlatList, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { geocodeQuery } from '../services/geocoding';

type Props = {
  onSelect: (result: { center: [number, number]; place_name?: string }) => void;
};

export default function SearchBar({ onSelect }: Props) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const doSearch = async (q: string) => {
    setQuery(q);
    if (q.length < 2) {
      setResults([]);
      return;
    }
    setLoading(true);
    try {
      const res = await geocodeQuery(q);
      setResults(res.features ?? []);
    } catch (e) {
      console.warn('Geocode error', e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Search place or address"
        style={styles.input}
        value={query}
        onChangeText={doSearch}
      />
      {!!results.length && (
        <FlatList
          keyboardShouldPersistTaps="handled"
          data={results}
          keyExtractor={(item) => item.id}
          style={styles.list}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => {
                onSelect(item);
                setResults([]);
                setQuery(item.place_name ?? '');
              }}
              style={styles.row}
            >
              <Text style={styles.title}>{item.text}</Text>
              <Text style={styles.subtitle}>{item.place_name}</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { position: 'absolute', top: 10, left: 10, right: 10, zIndex: 100 },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    elevation: 3,
  },
  list: { backgroundColor: '#fff', marginTop: 8, maxHeight: 240, borderRadius: 8 },
  row: { padding: 10, borderBottomColor: '#eee', borderBottomWidth: 1 },
  title: { fontWeight: '600' },
  subtitle: { color: '#666', fontSize: 12 },
});