import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Platform, Alert, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import api from '../api/api';

function fmt(date) {
  return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
}

// Built around the supplied artboard: black canvas, warm centre glow, square
// paper-white controls and the oversized orange call to action.
export default function PlanTripScreen({ navigation }) {
  const [tripName, setTripName] = useState('');
  const [startDate, setStartDate] = useState(new Date(2026, 3, 18));
  const [endDate, setEndDate] = useState(new Date(2026, 3, 22));
  const [travellers, setTravellers] = useState('4');
  const [budget, setBudget] = useState('50000');
  const [showStart, setShowStart] = useState(false);
  const [showEnd, setShowEnd] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!tripName.trim()) return Alert.alert('Trip name needed', 'Give this adventure a name first.');
    if (endDate < startDate) return Alert.alert('Check your dates', 'Your end date should be after your start date.');
    setSaving(true);
    try {
      await api.post('/trips', {
        name: tripName.trim(), start_date: startDate.toISOString().slice(0, 10),
        end_date: endDate.toISOString().slice(0, 10), travellers_count: Number(travellers) || 1,
        budget: Number(budget.replace(/,/g, '')) || 0,
      });
      navigation.navigate('Dashboard');
    } catch (e) {
      Alert.alert('Could not save trip', e.response?.data?.error || e.message);
    } finally { setSaving(false); }
  };

  return (
    <View style={styles.screen}>
      <LinearGradient pointerEvents="none" colors={['transparent', 'rgba(182,123,20,0.28)', 'transparent']} locations={[0, 0.44, 1]} style={styles.warmGlow} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <MaterialCommunityIcons name="train" size={62} color="#f1df00" style={styles.train} />
        <Text style={styles.title}>Make room{`\n`}for <Text style={styles.orange}>more</Text>.</Text>
        <Text style={styles.subtitle}>ONE PLAN, ZERO CHAOS. BRING THE CREW, WE’LL{`\n`}HANDLE THE REST</Text>

        <Text style={styles.label}>TRIP NAME</Text>
        <TextInput style={styles.input} placeholder="Tamilnadu, but make it legendary" placeholderTextColor="#1b1b1b" value={tripName} onChangeText={setTripName} />

        <View style={styles.row}>
          <View style={styles.half}>
            <Text style={styles.label}>FROM</Text>
            <TouchableOpacity activeOpacity={0.86} style={styles.dateInput} onPress={() => setShowStart(true)}>
              <Text style={styles.fieldText}>{fmt(startDate)}</Text><MaterialCommunityIcons name="chevron-down" size={20} color="#111" />
            </TouchableOpacity>
          </View>
          <View style={styles.half}>
            <Text style={styles.label}>TO</Text>
            <TouchableOpacity activeOpacity={0.86} style={styles.dateInput} onPress={() => setShowEnd(true)}>
              <Text style={styles.fieldText}>{fmt(endDate)}</Text><MaterialCommunityIcons name="chevron-down" size={20} color="#111" />
            </TouchableOpacity>
          </View>
        </View>

        {showStart && <DateTimePicker value={startDate} mode="date" display={Platform.OS === 'ios' ? 'inline' : 'default'} onChange={(event, value) => { setShowStart(false); if (value) setStartDate(value); }} />}
        {showEnd && <DateTimePicker value={endDate} minimumDate={startDate} mode="date" display={Platform.OS === 'ios' ? 'inline' : 'default'} onChange={(event, value) => { setShowEnd(false); if (value) setEndDate(value); }} />}

        <View style={styles.row}>
          <View style={styles.half}>
            <Text style={styles.label}>TRAVELLERS</Text>
            <View style={styles.iconInput}><MaterialCommunityIcons name="account-group" size={19} color="#111" /><TextInput style={styles.compactInput} keyboardType="number-pad" value={travellers} onChangeText={setTravellers} /></View>
          </View>
          <View style={styles.half}>
            <Text style={styles.label}>BUDGET</Text>
            <View style={styles.iconInput}><Text style={styles.rupee}>₹</Text><TextInput style={styles.compactInput} keyboardType="number-pad" value={budget} onChangeText={setBudget} /></View>
          </View>
        </View>

        <TouchableOpacity activeOpacity={0.88} style={styles.saveButton} onPress={handleSave} disabled={saving}>
          <Text style={styles.saveText}>{saving ? 'Saving trip…' : 'Save trip details   →'}</Text>
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.88} style={styles.nextButton} onPress={handleSave} disabled={saving}>
          <Text style={styles.nextText}>＋ Plan Next Trip</Text>
        </TouchableOpacity>
        <Text style={styles.tip}>✦ Tip: add rough cost now. Payanam will make the split feel simple</Text>
      </ScrollView>
    </View>
  );
}

const mono = Platform.select({ ios: 'Courier', android: 'monospace' });
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#000' },
  warmGlow: { position: 'absolute', top: 80, bottom: 0, left: 0, right: 0 },
  content: { paddingHorizontal: 34, paddingTop: 72, paddingBottom: 34 },
  train: { marginLeft: 4, marginBottom: 12, textShadowColor: '#f5a623', textShadowRadius: 16 },
  title: { color: '#f4f0e9', fontSize: 43, lineHeight: 46, fontWeight: '900', letterSpacing: -1.5 },
  orange: { color: '#f5a300' },
  subtitle: { color: '#c8c3bb', fontFamily: mono, fontWeight: '700', fontSize: 10, lineHeight: 15, letterSpacing: 0.6, textAlign: 'center', marginTop: 24, marginBottom: 32 },
  label: { color: '#f5f2ed', fontFamily: mono, fontWeight: '800', fontSize: 12, letterSpacing: 0.5, marginBottom: 9 },
  input: { height: 50, backgroundColor: '#e8e7e6', color: '#151515', fontFamily: mono, fontSize: 14, fontWeight: '700', paddingHorizontal: 14, marginBottom: 21, borderRadius: 0, shadowColor: '#f5a623', shadowOpacity: 0.5, shadowRadius: 13, elevation: 5 },
  row: { flexDirection: 'row', gap: 9 }, half: { flex: 1 },
  dateInput: { height: 40, backgroundColor: '#e8e7e6', paddingLeft: 14, paddingRight: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 22, shadowColor: '#f5a623', shadowOpacity: 0.45, shadowRadius: 12, elevation: 4 },
  fieldText: { color: '#111', fontFamily: mono, fontSize: 12, fontWeight: '800' },
  iconInput: { height: 40, backgroundColor: '#e8e7e6', paddingHorizontal: 12, flexDirection: 'row', alignItems: 'center', gap: 9, marginBottom: 22, shadowColor: '#f5a623', shadowOpacity: 0.45, shadowRadius: 12, elevation: 4 },
  compactInput: { flex: 1, height: '100%', color: '#111', fontFamily: mono, fontWeight: '800', fontSize: 13, padding: 0 },
  rupee: { color: '#111', fontSize: 18, fontWeight: '800' },
  saveButton: { height: 47, backgroundColor: '#ffa600', justifyContent: 'center', alignItems: 'center', marginTop: 5, shadowColor: '#ffa600', shadowOpacity: 0.9, shadowRadius: 17, elevation: 9 },
  saveText: { color: '#111', fontFamily: mono, fontSize: 13, fontWeight: '900' },
  nextButton: { backgroundColor: '#ffa600', minHeight: 110, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginTop: 30, shadowColor: '#ffa600', shadowOpacity: 0.9, shadowRadius: 19, elevation: 10 },
  nextText: { color: '#111', fontFamily: 'serif', fontSize: 31 },
  tip: { color: '#f4f0e9', fontFamily: mono, fontWeight: '700', fontSize: 9, textAlign: 'center', marginTop: 26, lineHeight: 14 },
});
