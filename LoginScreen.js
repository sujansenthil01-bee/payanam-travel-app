import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import Constants from 'expo-constants';
import colors from '../theme/colors';
import { useAuth } from '../context/AuthContext';

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen({ navigation }) {
  const { login, loginWithGoogle } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const googleClientId = Constants.expoConfig?.extra?.googleExpoClientId || process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID;
  const [, response, promptAsync] = Google.useIdTokenAuthRequest({ clientId: googleClientId });

  React.useEffect(() => {
    if (response?.type === 'success') {
      const { id_token } = response.params;
      loginWithGoogle(id_token).catch((e) => Alert.alert('Google sign-in failed', e.message));
    }
  }, [response]);

  const handleLogin = async () => {
    if (!email || !password) return Alert.alert('Missing info', 'Enter email and password');
    setLoading(true);
    try {
      await login(email, password);
    } catch (e) {
      Alert.alert('Login failed', e.response?.data?.error || e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Ionicons name="train" size={44} color={colors.orange} style={{ marginBottom: 12 }} />
      <Text style={styles.title}>Welcome back</Text>
      <Text style={styles.subtitle}>Log in to keep planning with your crew</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor={colors.grayText}
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor={colors.grayText}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.primaryBtn} onPress={handleLogin} disabled={loading}>
        {loading ? <ActivityIndicator color="#000" /> : <Text style={styles.primaryBtnText}>Log In</Text>}
      </TouchableOpacity>

      <TouchableOpacity style={styles.googleBtn} onPress={() => googleClientId ? promptAsync() : Alert.alert('Google sign-in setup', 'Add EXPO_PUBLIC_GOOGLE_CLIENT_ID to mobile/.env before using Google sign-in.')}>
        <Ionicons name="logo-google" size={18} color="#fff" style={{ marginRight: 8 }} />
        <Text style={styles.googleBtnText}>Continue with Google</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
        <Text style={styles.link}>New here? Create an account</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.black, padding: 28, justifyContent: 'center' },
  title: { color: '#fff', fontSize: 26, fontWeight: '700' },
  subtitle: { color: colors.grayText, marginBottom: 30, marginTop: 6 },
  input: {
    backgroundColor: colors.inputBg, borderRadius: 12, paddingHorizontal: 16,
    paddingVertical: 14, marginBottom: 14, fontSize: 15,
  },
  primaryBtn: {
    backgroundColor: colors.orange, borderRadius: 12, paddingVertical: 15,
    alignItems: 'center', marginTop: 8, shadowColor: colors.glow, shadowOpacity: 0.8, shadowRadius: 10,
  },
  primaryBtnText: { fontWeight: '700', fontSize: 16, color: '#1a1a1a' },
  googleBtn: {
    flexDirection: 'row', backgroundColor: '#2a2a2a', borderRadius: 12, paddingVertical: 14,
    alignItems: 'center', justifyContent: 'center', marginTop: 14,
  },
  googleBtnText: { color: '#fff', fontWeight: '600' },
  link: { color: colors.lime, textAlign: 'center', marginTop: 24, fontWeight: '600' },
});
