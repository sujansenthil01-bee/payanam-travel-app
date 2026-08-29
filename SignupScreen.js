import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../theme/colors';
import { useAuth } from '../context/AuthContext';

export default function SignupScreen({ navigation }) {
  const { signup } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (!name || !email || !password) return Alert.alert('Missing info', 'Fill in all fields');
    setLoading(true);
    try {
      await signup(name, email, password);
    } catch (e) {
      Alert.alert('Signup failed', e.response?.data?.error || e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Ionicons name="train" size={44} color={colors.orange} style={{ marginBottom: 12 }} />
      <Text style={styles.title}>Join Payanam</Text>
      <Text style={styles.subtitle}>Create an account to start planning trips</Text>

      <TextInput style={styles.input} placeholder="Full name" placeholderTextColor={colors.grayText} value={name} onChangeText={setName} />
      <TextInput style={styles.input} placeholder="Email" placeholderTextColor={colors.grayText} autoCapitalize="none" keyboardType="email-address" value={email} onChangeText={setEmail} />
      <TextInput style={styles.input} placeholder="Password" placeholderTextColor={colors.grayText} secureTextEntry value={password} onChangeText={setPassword} />

      <TouchableOpacity style={styles.primaryBtn} onPress={handleSignup} disabled={loading}>
        {loading ? <ActivityIndicator color="#000" /> : <Text style={styles.primaryBtnText}>Create Account</Text>}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.link}>Already have an account? Log in</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.black, padding: 28, justifyContent: 'center' },
  title: { color: '#fff', fontSize: 26, fontWeight: '700' },
  subtitle: { color: colors.grayText, marginBottom: 30, marginTop: 6 },
  input: { backgroundColor: colors.inputBg, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, marginBottom: 14, fontSize: 15 },
  primaryBtn: { backgroundColor: colors.orange, borderRadius: 12, paddingVertical: 15, alignItems: 'center', marginTop: 8 },
  primaryBtnText: { fontWeight: '700', fontSize: 16, color: '#1a1a1a' },
  link: { color: colors.lime, textAlign: 'center', marginTop: 24, fontWeight: '600' },
});
