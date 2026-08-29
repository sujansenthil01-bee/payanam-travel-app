import React, { useState, useCallback, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import api from '../api/api';
import colors from '../theme/colors';

// "Travel Buddy" — the AI assistant. Understands natural-language expense logging
// ("add 800 for lunch paid by Ravi"), answers budget questions, and gives itinerary ideas.
export default function ChatBotScreen({ route }) {
  const tripId = route.params?.tripId;
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const listRef = useRef(null);

  const load = async () => {
    if (!tripId) return;
    const { data } = await api.get(`/chat/${tripId}/history`);
    setMessages(data);
  };

  useFocusEffect(useCallback(() => { load(); }, [tripId]));

  const send = async () => {
    if (!input.trim() || !tripId) return;
    const userMsg = { id: Date.now().toString(), role: 'user', content: input };
    setMessages((m) => [...m, userMsg]);
    setInput('');
    setSending(true);
    try {
      const { data } = await api.post(`/chat/${tripId}`, { message: userMsg.content });
      setMessages((m) => [...m, { id: Date.now().toString() + 'a', role: 'assistant', content: data.reply, action_taken: data.action }]);
    } catch (e) {
      setMessages((m) => [...m, { id: Date.now().toString() + 'e', role: 'assistant', content: "Sorry, I couldn't reach the server. Try again!" }]);
    } finally {
      setSending(false);
      setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 100);
    }
  };

  const quickPrompts = [
    'What\u2019s my budget left?',
    'Add ₹500 for auto',
    'Split today\u2019s expenses',
    'Suggest a day plan',
  ];

  return (
    <KeyboardAvoidingView style={styles.screen} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.header}>
        <MaterialCommunityIcons name="robot-happy" size={26} color={colors.lime} />
        <Text style={styles.headerTitle}>Travel Buddy</Text>
      </View>

      {!tripId ? (
        <View style={styles.noTrip}><Text style={styles.emptyText}>Create or open a trip first, then Travel Buddy can track its costs and itinerary.</Text></View>
      ) : <FlatList
        ref={listRef}
        data={messages}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16, paddingBottom: 8 }}
        renderItem={({ item }) => (
          <View style={[styles.bubble, item.role === 'user' ? styles.userBubble : styles.botBubble]}>
            {item.action_taken === 'expense_added' && (
              <View style={styles.actionTag}><Text style={styles.actionTagText}>💰 Expense logged</Text></View>
            )}
            <Text style={item.role === 'user' ? styles.userText : styles.botText}>{item.content}</Text>
          </View>
        )}
        ListEmptyComponent={
          <View style={{ alignItems: 'center', marginTop: 40 }}>
            <MaterialCommunityIcons name="robot-happy-outline" size={54} color={colors.grayText} />
            <Text style={styles.emptyText}>Hey! I'm Travel Buddy 🎒{'\n'}Tell me an expense, ask about the budget, or ask for itinerary ideas.</Text>
          </View>
        }
      />}

      <FlatList
        horizontal
        data={quickPrompts}
        keyExtractor={(p) => p}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 12, paddingBottom: 8 }}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.chip} onPress={() => setInput(item)}>
            <Text style={styles.chipText}>{item}</Text>
          </TouchableOpacity>
        )}
      />

      <View style={[styles.inputRow, !tripId && { opacity: 0.45 }]}>
        <TextInput
          style={styles.input}
          placeholder="Ask Travel Buddy anything..."
          placeholderTextColor="#888"
          value={input}
          onChangeText={setInput}
          onSubmitEditing={send}
          editable={!!tripId}
        />
        <TouchableOpacity style={styles.sendBtn} onPress={send} disabled={sending || !tripId}>
          {sending ? <ActivityIndicator color="#111" /> : <Ionicons name="send" size={18} color="#111" />}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.black, paddingTop: 60 },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 18, marginBottom: 8, gap: 8 },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: '800' },
  bubble: { borderRadius: 16, padding: 12, marginBottom: 10, maxWidth: '82%' },
  userBubble: { backgroundColor: colors.orange, alignSelf: 'flex-end' },
  botBubble: { backgroundColor: colors.cardBlack, alignSelf: 'flex-start' },
  userText: { color: '#1a1a1a', fontWeight: '600' },
  botText: { color: '#eee' },
  actionTag: { backgroundColor: colors.green, alignSelf: 'flex-start', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3, marginBottom: 6 },
  actionTagText: { color: '#111', fontSize: 11, fontWeight: '700' },
  emptyText: { color: colors.grayText, textAlign: 'center', marginTop: 12, paddingHorizontal: 40, lineHeight: 20 },
  noTrip: { flex: 1, justifyContent: 'center' },
  chip: { backgroundColor: '#222', borderRadius: 16, paddingHorizontal: 12, paddingVertical: 8, marginRight: 8 },
  chipText: { color: colors.lime, fontSize: 12, fontWeight: '600' },
  inputRow: { flexDirection: 'row', alignItems: 'center', padding: 14, gap: 10 },
  input: { flex: 1, backgroundColor: colors.inputBg, borderRadius: 24, paddingHorizontal: 16, paddingVertical: 12 },
  sendBtn: { backgroundColor: colors.lime, width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
});
