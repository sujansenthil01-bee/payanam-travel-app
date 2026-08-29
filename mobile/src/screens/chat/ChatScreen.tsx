import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';
import axios from 'axios';

const ChatScreen = ({ route }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const tripId = route?.params?.tripId;

  const API_URL = 'http://your-backend-url/api';

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = {
      _id: Math.random().toString(),
      text: input,
      sender: 'user',
      createdAt: new Date()
    };

    setMessages([...messages, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await axios.post(
        `${API_URL}/chat/message`,
        {
          tripId: tripId || 'global',
          message: input
        }
      );

      const assistantMessage = {
        _id: response.data.messageId,
        text: response.data.message,
        sender: 'assistant',
        createdAt: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderMessage = ({ item }) => {
    return (
      <View
        style={[
          styles.messageContainer,
          item.sender === 'user' ? styles.userMessage : styles.assistantMessage
        ]}
      >
        <Text
          style={[
            styles.messageText,
            item.sender === 'user' ? styles.userMessageText : styles.assistantMessageText
          ]}
        >
          {item.text}
        </Text>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>🤖 Travel Buddy</Text>
        <Text style={styles.headerSubtitle}>Your AI Expense Assistant</Text>
      </View>

      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={item => item._id}
        contentContainerStyle={styles.messagesContainer}
        inverted
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Ask Travel Buddy..."
          value={input}
          onChangeText={setInput}
          editable={!loading}
          multiline
        />
        <TouchableOpacity
          style={[styles.sendButton, loading && styles.sendButtonDisabled]}
          onPress={sendMessage}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={styles.sendButtonText}>Send</Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8'
  },
  headerContainer: {
    backgroundColor: '#FF6B6B',
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 3
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#fff',
    opacity: 0.8
  },
  messagesContainer: {
    paddingHorizontal: 15,
    paddingVertical: 15
  },
  messageContainer: {
    marginVertical: 8,
    maxWidth: '85%'
  },
  userMessage: {
    alignSelf: 'flex-end'
  },
  assistantMessage: {
    alignSelf: 'flex-start'
  },
  messageText: {
    fontSize: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12
  },
  userMessageText: {
    backgroundColor: '#FF6B6B',
    color: '#fff'
  },
  assistantMessageText: {
    backgroundColor: '#fff',
    color: '#333'
  },
  inputContainer: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    paddingVertical: 10,
    gap: 10
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#fff',
    maxHeight: 100
  },
  sendButton: {
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 15,
    justifyContent: 'center',
    borderRadius: 10
  },
  sendButtonDisabled: {
    opacity: 0.6
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: '600'
  }
});

export default ChatScreen;
