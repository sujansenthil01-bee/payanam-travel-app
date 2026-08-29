import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Modal, Alert, Image, ScrollView } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import api, { API_BASE_URL } from '../api/api';
import colors from '../theme/colors';

function formatINR(n) { return '₹' + Number(n || 0).toLocaleString('en-IN'); }

export default function ExpenseScreen({ route }) {
  const { tripId } = route.params;
  const [expenses, setExpenses] = useState([]);
  const [balances, setBalances] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  // new expense form state
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('food');
  const [splitType, setSplitType] = useState('equal'); // equal | custom
  const [customSplits, setCustomSplits] = useState({}); // {userId: amount}
  const [receipt, setReceipt] = useState(null);

  const load = async () => {
    const [expRes, balRes] = await Promise.all([
      api.get(`/expenses/trip/${tripId}`),
      api.get(`/expenses/trip/${tripId}/balances`),
    ]);
    setExpenses(expRes.data);
    setBalances(balRes.data);
  };

  useFocusEffect(useCallback(() => { load(); }, [tripId]));

  const pickReceipt = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.6 });
    if (!result.canceled) setReceipt(result.assets[0]);
  };

  const submitExpense = async () => {
    if (!title || !amount) return Alert.alert('Missing info', 'Add a title and amount');
    try {
      const formData = new FormData();
      formData.append('trip_id', tripId);
      formData.append('title', title);
      formData.append('category', category);
      formData.append('amount', amount);
      formData.append('split_type', splitType);
      formData.append('paid_by', balances[0]?.id || '');
      if (splitType === 'custom') {
        const splitsArr = Object.entries(customSplits).map(([user_id, share_amount]) => ({ user_id, share_amount: parseFloat(share_amount) || 0 }));
        formData.append('splits', JSON.stringify(splitsArr));
      }
      if (receipt) {
        formData.append('receipt', { uri: receipt.uri, name: 'receipt.jpg', type: 'image/jpeg' });
      }
      await api.post('/expenses', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      setModalVisible(false);
      setTitle(''); setAmount(''); setReceipt(null);
      load();
    } catch (e) {
      Alert.alert('Could not add expense', e.response?.data?.error || e.message);
    }
  };

  return (
    <View style={styles.screen}>
      <Text style={styles.header}>Budget Split</Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 12 }}>
        {balances.map((b) => (
          <View key={b.id} style={styles.balanceChip}>
            <Text style={styles.balanceName}>{b.name}</Text>
            <Text style={[styles.balanceAmt, { color: b.net >= 0 ? colors.green : '#ff6b6b' }]}>
              {b.net >= 0 ? `is owed ${formatINR(b.net)}` : `owes ${formatINR(Math.abs(b.net))}`}
            </Text>
          </View>
        ))}
      </ScrollView>

      <FlatList
        data={expenses}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 100 }}
        renderItem={({ item }) => (
          <View style={styles.expenseRow}>
            {item.receipt_photo_url ? (
              <Image source={{ uri: `${API_BASE_URL.replace('/api', '')}${item.receipt_photo_url}` }} style={styles.receiptThumb} />
            ) : (
              <View style={styles.receiptPlaceholder}>
                <MaterialCommunityIcons name="receipt" size={20} color="#666" />
              </View>
            )}
            <View style={{ flex: 1 }}>
              <Text style={styles.expenseTitle}>{item.title}</Text>
              <Text style={styles.expenseSub}>Paid by {item.paid_by_name} · {item.category}</Text>
            </View>
            <Text style={styles.expenseAmount}>{formatINR(item.amount)}</Text>
          </View>
        )}
      />

      <TouchableOpacity style={styles.fab} onPress={() => setModalVisible(true)}>
        <Ionicons name="add" size={28} color="#111" />
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Add expense</Text>
            <TextInput style={styles.input} placeholder="Title (e.g. Dinner at ECR)" placeholderTextColor="#888" value={title} onChangeText={setTitle} />
            <TextInput style={styles.input} placeholder="Amount (₹)" placeholderTextColor="#888" keyboardType="number-pad" value={amount} onChangeText={setAmount} />

            <View style={styles.pillRow}>
              {['food', 'stay', 'transport', 'activity', 'shopping', 'general'].map((c) => (
                <TouchableOpacity key={c} style={[styles.pill, category === c && styles.pillActive]} onPress={() => setCategory(c)}>
                  <Text style={[styles.pillText, category === c && styles.pillTextActive]}>{c}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.pillRow}>
              <TouchableOpacity style={[styles.pill, splitType === 'equal' && styles.pillActive]} onPress={() => setSplitType('equal')}>
                <Text style={[styles.pillText, splitType === 'equal' && styles.pillTextActive]}>Split equally</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.pill, splitType === 'custom' && styles.pillActive]} onPress={() => setSplitType('custom')}>
                <Text style={[styles.pillText, splitType === 'custom' && styles.pillTextActive]}>Custom split</Text>
              </TouchableOpacity>
            </View>

            {splitType === 'custom' && balances.map((b) => (
              <View key={b.id} style={styles.customRow}>
                <Text style={{ color: '#fff', flex: 1 }}>{b.name}</Text>
                <TextInput
                  style={styles.customInput}
                  placeholder="₹0"
                  placeholderTextColor="#888"
                  keyboardType="number-pad"
                  onChangeText={(v) => setCustomSplits((s) => ({ ...s, [b.id]: v }))}
                />
              </View>
            ))}

            <TouchableOpacity style={styles.photoBtn} onPress={pickReceipt}>
              <MaterialCommunityIcons name="camera" size={18} color="#111" />
              <Text style={{ fontWeight: '700', marginLeft: 6 }}>{receipt ? 'Receipt added ✓' : 'Add receipt photo'}</Text>
            </TouchableOpacity>

            <View style={styles.modalActions}>
              <TouchableOpacity onPress={() => setModalVisible(false)}><Text style={{ color: '#999' }}>Cancel</Text></TouchableOpacity>
              <TouchableOpacity style={styles.saveBtn} onPress={submitExpense}><Text style={styles.saveBtnText}>Add expense</Text></TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.black, paddingTop: 60, paddingHorizontal: 18 },
  header: { color: '#fff', fontSize: 22, fontWeight: '800', marginBottom: 14 },
  balanceChip: { backgroundColor: colors.cardBlack, borderRadius: 12, padding: 10, marginRight: 10, minWidth: 130 },
  balanceName: { color: '#fff', fontWeight: '700' },
  balanceAmt: { fontSize: 11, marginTop: 2 },
  expenseRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.cardBlack, borderRadius: 12, padding: 12, marginBottom: 10 },
  receiptThumb: { width: 40, height: 40, borderRadius: 8, marginRight: 12 },
  receiptPlaceholder: { width: 40, height: 40, borderRadius: 8, marginRight: 12, backgroundColor: '#222', alignItems: 'center', justifyContent: 'center' },
  expenseTitle: { color: '#fff', fontWeight: '700' },
  expenseSub: { color: '#888', fontSize: 12, marginTop: 2 },
  expenseAmount: { color: colors.orange, fontWeight: '800' },
  fab: { position: 'absolute', right: 20, bottom: 30, backgroundColor: colors.orange, width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center', shadowColor: colors.glow, shadowOpacity: 0.9, shadowRadius: 12 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
  modalCard: { backgroundColor: '#141414', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 22, maxHeight: '85%' },
  modalTitle: { color: '#fff', fontSize: 18, fontWeight: '800', marginBottom: 16 },
  input: { backgroundColor: colors.inputBg, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12, marginBottom: 12 },
  pillRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 },
  pill: { backgroundColor: '#2a2a2a', paddingVertical: 8, paddingHorizontal: 14, borderRadius: 20 },
  pillActive: { backgroundColor: colors.lime },
  pillText: { color: '#ccc', fontSize: 12, fontWeight: '600' },
  pillTextActive: { color: '#111' },
  customRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  customInput: { backgroundColor: colors.inputBg, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 8, width: 90 },
  photoBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: colors.lime, borderRadius: 10, paddingVertical: 12, marginTop: 4, marginBottom: 16 },
  modalActions: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  saveBtn: { backgroundColor: colors.orange, borderRadius: 10, paddingVertical: 12, paddingHorizontal: 24 },
  saveBtnText: { fontWeight: '800', color: '#111' },
});
