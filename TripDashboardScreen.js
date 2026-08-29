import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Share, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { MaterialCommunityIcons, FontAwesome5, Ionicons } from '@expo/vector-icons';
import api from '../api/api';
import colors from '../theme/colors';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.78;

function formatINR(n) {
  return '₹' + Number(n || 0).toLocaleString('en-IN');
}

// Recreates screenshot 2: one glowing card per trip with
// Estimated total / Per person / Trip length + Auto itinerary + Budget split buttons.
export default function TripDashboardScreen({ navigation }) {
  const [trips, setTrips] = useState([]);

  const load = async () => {
    try {
      const { data } = await api.get('/trips');
      setTrips(data);
    } catch (e) {
      console.log('load trips failed', e.message);
    }
  };

  useFocusEffect(useCallback(() => { load(); }, []));

  const shareInvite = async (tripId) => {
    try {
      const { data } = await api.get(`/trips/${tripId}/invite-link`);
      await Share.share({ message: `Join my Payanam trip! ${data.link}` });
    } catch (e) {
      Alert.alert('Could not create invite', e.response?.data?.error || e.message);
    }
  };

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Hi, adventure crew ✨</Text>
        <TouchableOpacity onPress={() => trips[0] ? navigation.navigate('ChatBot', { tripId: trips[0].id }) : navigation.navigate('PlanTrip')}>
          <MaterialCommunityIcons name="robot-happy-outline" size={28} color={colors.lime} />
        </TouchableOpacity>
      </View>

      {trips.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>No trips yet. Plan your first one!</Text>
        </View>
      ) : (
        <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 12 }}>
          {trips.map((trip) => (
            <View key={trip.id} style={[styles.card, { width: CARD_WIDTH }]}>
              <View style={styles.cardTopRow}>
                <Text style={styles.dateRange}>
                  -- {new Date(trip.start_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })} -
                  {new Date(trip.end_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                </Text>
                <MaterialCommunityIcons name="train" size={26} color={colors.lime} />
              </View>
              <Text style={styles.tripName}>{trip.name}</Text>

              <View style={styles.savedBanner}>
                <Text style={styles.savedBannerText}>✓ Trip details saved to the shared board</Text>
              </View>

              <View style={styles.statCardOrange}>
                <FontAwesome5 name="piggy-bank" size={18} color="#111" />
                <Text style={styles.statLabelDark}>Estimated total</Text>
                <Text style={styles.statValueDark}>{formatINR(trip.spent_total)}</Text>
                <Text style={styles.statSubDark}>
                  {trip.budget > 0 ? Math.round((trip.spent_total / trip.budget) * 100) : 0}% of {formatINR(trip.budget)} of budget
                </Text>
              </View>

              <View style={styles.statCardTan}>
                <Ionicons name="people" size={18} color="#111" />
                <Text style={styles.statLabel}>per person</Text>
                <Text style={styles.statValue}>{formatINR(trip.spent_total / (trip.travellers_count || 1))}</Text>
                <Text style={styles.statSub}>split between {trip.travellers_count} traveller{trip.travellers_count > 1 ? 's' : ''}</Text>
              </View>

              <View style={styles.statCardTan}>
                <Ionicons name="calendar" size={18} color="#111" />
                <Text style={styles.statLabel}>Trip length</Text>
                <Text style={styles.statValue}>
                  {Math.round((new Date(trip.end_date) - new Date(trip.start_date)) / 86400000) + 1} days
                </Text>
                <Text style={styles.statSub}>{trip.member_count} place{trip.member_count > 1 ? 's' : ''} on the map</Text>
              </View>

              <View style={styles.actionRow}>
                <TouchableOpacity style={styles.limeBtn} onPress={() => navigation.navigate('MapScreen', { tripId: trip.id })}>
                  <MaterialCommunityIcons name="clipboard-text-outline" size={16} color="#111" />
                  <Text style={styles.actionText}>Auto itenerary</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.greenBtn} onPress={() => navigation.navigate('Expenses', { tripId: trip.id })}>
                  <MaterialCommunityIcons name="cash-multiple" size={16} color="#111" />
                  <Text style={styles.actionText}>Budget split</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.secondaryActionRow}>
                <TouchableOpacity style={styles.secondaryAction} onPress={() => shareInvite(trip.id)}>
                  <MaterialCommunityIcons name="account-plus-outline" size={16} color={colors.orange} />
                  <Text style={styles.secondaryActionText}>Invite crew</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.secondaryAction} onPress={() => navigation.navigate('Recap', { tripId: trip.id })}>
                  <MaterialCommunityIcons name="star-outline" size={16} color={colors.orange} />
                  <Text style={styles.secondaryActionText}>Trip recap</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity style={styles.buddyAction} onPress={() => navigation.navigate('ChatBot', { tripId: trip.id })}>
                <MaterialCommunityIcons name="robot-happy-outline" size={17} color="#111" />
                <Text style={styles.buddyActionText}>Ask Travel Buddy</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      )}

      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('PlanTrip')}>
        <Text style={styles.fabText}>+ Plan Next Trip</Text>
      </TouchableOpacity>
      <Text style={styles.tip}>✦ Tip: add rough cost now. Payanam will make the split feel simple</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.black, paddingTop: 60 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginBottom: 16 },
  headerText: { color: '#fff', fontSize: 20, fontWeight: '700' },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emptyText: { color: colors.grayText },
  card: {
    backgroundColor: colors.cardBlack, borderRadius: 20, padding: 18, marginRight: 12,
    shadowColor: colors.orange, shadowOpacity: 0.5, shadowRadius: 14, elevation: 8,
  },
  cardTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  dateRange: { color: colors.orange, fontWeight: '700', fontSize: 12 },
  tripName: { color: '#fff', fontSize: 20, fontWeight: '700', marginTop: 8, marginBottom: 10 },
  savedBanner: { backgroundColor: '#2b2312', borderRadius: 10, padding: 8, marginBottom: 14 },
  savedBannerText: { color: colors.orange, fontSize: 12, fontWeight: '600' },
  statCardOrange: { backgroundColor: colors.orange, borderRadius: 16, padding: 14, marginBottom: 10 },
  statCardTan: { backgroundColor: colors.tan, borderRadius: 16, padding: 14, marginBottom: 10 },
  statLabelDark: { color: '#222', marginTop: 6, fontSize: 12 },
  statValueDark: { color: '#111', fontWeight: '800', fontSize: 20, marginTop: 2 },
  statSubDark: { color: '#333', fontSize: 11, marginTop: 2 },
  statLabel: { color: '#222', marginTop: 6, fontSize: 12 },
  statValue: { color: '#111', fontWeight: '800', fontSize: 18, marginTop: 2 },
  statSub: { color: '#333', fontSize: 11, marginTop: 2 },
  actionRow: { flexDirection: 'row', gap: 10, marginTop: 4 },
  limeBtn: { flex: 1, backgroundColor: colors.lime, borderRadius: 10, paddingVertical: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 },
  greenBtn: { flex: 1, backgroundColor: colors.green, borderRadius: 10, paddingVertical: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 },
  actionText: { color: '#111', fontWeight: '700', fontSize: 12 },
  secondaryActionRow: { flexDirection: 'row', gap: 10, marginTop: 10 },
  secondaryAction: { flex: 1, borderWidth: 1, borderColor: '#3a321d', borderRadius: 10, paddingVertical: 9, flexDirection: 'row', gap: 5, alignItems: 'center', justifyContent: 'center' },
  secondaryActionText: { color: '#eee', fontSize: 11, fontWeight: '700' },
  buddyAction: { backgroundColor: '#f0d827', borderRadius: 10, paddingVertical: 10, marginTop: 10, flexDirection: 'row', gap: 7, alignItems: 'center', justifyContent: 'center' },
  buddyActionText: { color: '#111', fontSize: 12, fontWeight: '800' },
  fab: { backgroundColor: colors.orange, marginHorizontal: 20, marginTop: 18, paddingVertical: 16, borderRadius: 14, alignItems: 'center', shadowColor: colors.glow, shadowOpacity: 0.9, shadowRadius: 12 },
  fabText: { fontWeight: '800', fontSize: 16, color: '#1a1a1a' },
  tip: { color: colors.grayText, fontSize: 11, textAlign: 'center', marginTop: 10, marginBottom: 20, paddingHorizontal: 30 },
});
