import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import MapView, { Marker, UrlTile } from 'react-native-maps';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import api from '../api/api';
import { searchIndianPlaces } from '../api/geocode';
import colors from '../theme/colors';

// India-centered map. Uses FREE OpenStreetMap raster tiles (no Google API key needed),
// with react-native-maps as the container. Swap UrlTile out and add provider={PROVIDER_GOOGLE}
// + your key later to switch to Google Maps with zero other code changes.
const INDIA_REGION = { latitude: 20.5937, longitude: 78.9629, latitudeDelta: 12, longitudeDelta: 12 };

export default function MapScreen({ route }) {
  const { tripId } = route.params;
  const [places, setPlaces] = useState([]);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const load = async () => {
    const { data } = await api.get(`/trips/${tripId}/places`);
    setPlaces(data);
  };

  useFocusEffect(useCallback(() => { load(); }, [tripId]));

  const search = async (text) => {
    setQuery(text);
    if (text.length > 2) setResults(await searchIndianPlaces(text));
    else setResults([]);
  };

  const addPlace = async (place) => {
    try {
      await api.post(`/trips/${tripId}/places`, {
        name: place.name.split(',')[0],
        lat: place.lat,
        lng: place.lng,
        day_number: places.length + 1,
        order_index: places.length,
      });
      setQuery(''); setResults([]);
      load();
    } catch (e) {
      Alert.alert('Could not add place', e.message);
    }
  };

  return (
    <View style={styles.screen}>
      <View style={styles.searchBar}>
        <MaterialCommunityIcons name="magnify" size={20} color="#888" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search a place in India..."
          placeholderTextColor="#888"
          value={query}
          onChangeText={search}
        />
      </View>
      {results.length > 0 && (
        <FlatList
          style={styles.resultsList}
          data={results}
          keyExtractor={(item, i) => i.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.resultRow} onPress={() => addPlace(item)}>
              <Text style={styles.resultText} numberOfLines={1}>{item.name}</Text>
            </TouchableOpacity>
          )}
        />
      )}

      <MapView style={styles.map} initialRegion={INDIA_REGION}>
        <UrlTile urlTemplate="https://tile.openstreetmap.org/{z}/{x}/{y}.png" maximumZ={19} />
        {places.map((p) => (
          <Marker key={p.id} coordinate={{ latitude: p.lat, longitude: p.lng }} title={p.name} pinColor={colors.orange} />
        ))}
      </MapView>

      <View style={styles.itineraryStrip}>
        <Text style={styles.itineraryHeader}>Auto itinerary ({places.length} stops)</Text>
        <FlatList
          horizontal
          data={places}
          keyExtractor={(p) => p.id}
          renderItem={({ item, index }) => (
            <View style={styles.stopChip}>
              <Text style={styles.stopDay}>Day {item.day_number || index + 1}</Text>
              <Text style={styles.stopName} numberOfLines={1}>{item.name}</Text>
            </View>
          )}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.black, paddingTop: 60 },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.inputBg, marginHorizontal: 16, borderRadius: 10, paddingHorizontal: 12 },
  searchInput: { flex: 1, paddingVertical: 10, paddingHorizontal: 8 },
  resultsList: { backgroundColor: '#1c1c1c', marginHorizontal: 16, borderRadius: 10, maxHeight: 160 },
  resultRow: { padding: 12, borderBottomWidth: 1, borderBottomColor: '#2a2a2a' },
  resultText: { color: '#fff' },
  map: { flex: 1, marginTop: 12 },
  itineraryStrip: { backgroundColor: colors.cardBlack, padding: 14, paddingBottom: 24 },
  itineraryHeader: { color: '#fff', fontWeight: '700', marginBottom: 10 },
  stopChip: { backgroundColor: colors.tan, borderRadius: 10, padding: 10, marginRight: 10, width: 120 },
  stopDay: { color: '#333', fontSize: 10, fontWeight: '700' },
  stopName: { color: '#111', fontWeight: '700', marginTop: 2 },
});
