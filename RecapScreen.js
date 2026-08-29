import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Share, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import api from '../api/api';
import colors from '../theme/colors';

// Turns a finished trip into a one-page shareable recap: map + spend + best moments.
export default function RecapScreen({ route }) {
  const { tripId } = route.params;
  const [trip, setTrip] = useState(null);
  const [recap, setRecap] = useState(null);

  useEffect(() => {
    (async () => {
      const { data } = await api.get(`/trips/${tripId}`);
      setTrip(data);
      const existing = await api.get(`/trips/${tripId}/recap`);
      setRecap(existing.data);
    })();
  }, [tripId]);

  const generate = async () => {
    try {
      const { data } = await api.post(`/trips/${tripId}/recap`, {
        best_moments: ['Sunset at the beach 🌅', 'That roadside filter coffee ☕', 'The unplanned detour that became the best day'],
      });
      setRecap(data);
    } catch (e) {
      Alert.alert('Could not generate recap', e.message);
    }
  };

  const shareRecap = () => {
    Share.share({ message: `Check out our trip recap for "${trip?.name}" on Payanam! Total spend: ₹${recap?.total_spend}` });
  };

  if (!trip) return <View style={styles.screen} />;

  return (
    <View style={styles.screen}>
      <Text style={styles.title}>{trip.name}</Text>
      <Text style={styles.dates}>{trip.start_date} → {trip.end_date}</Text>

      {trip.places?.length > 0 && (
        <View style={styles.mapPreview}>
          <MaterialCommunityIcons name="map-marker-path" size={40} color={colors.orange} />
          <Text style={styles.mapText}>{trip.places.length} places explored</Text>
        </View>
      )}

      <View style={styles.statCard}>
        <Text style={styles.statLabel}>Total spend</Text>
        <Text style={styles.statValue}>₹{(recap?.total_spend ?? trip.estimated_total).toLocaleString('en-IN')}</Text>
      </View>

      {recap?.best_moments?.map((m, i) => (
        <View key={i} style={styles.momentRow}>
          <MaterialCommunityIcons name="star" size={16} color={colors.lime} />
          <Text style={styles.momentText}>{m}</Text>
        </View>
      ))}

      {!recap ? (
        <TouchableOpacity style={styles.generateBtn} onPress={generate}>
          <Text style={styles.generateBtnText}>✨ Generate trip recap</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.generateBtn} onPress={shareRecap}>
          <Text style={styles.generateBtnText}>Share recap</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.black, padding: 22, paddingTop: 60 },
  title: { color: '#fff', fontSize: 26, fontWeight: '800' },
  dates: { color: colors.grayText, marginTop: 4, marginBottom: 20 },
  mapPreview: { backgroundColor: colors.cardBlack, borderRadius: 16, alignItems: 'center', padding: 24, marginBottom: 16 },
  mapText: { color: '#fff', marginTop: 8 },
  statCard: { backgroundColor: colors.orange, borderRadius: 16, padding: 18, marginBottom: 16 },
  statLabel: { color: '#222' },
  statValue: { color: '#111', fontSize: 26, fontWeight: '800', marginTop: 4 },
  momentRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
  momentText: { color: '#eee' },
  generateBtn: { backgroundColor: colors.lime, borderRadius: 12, paddingVertical: 16, alignItems: 'center', marginTop: 20 },
  generateBtnText: { fontWeight: '800', color: '#111' },
});
