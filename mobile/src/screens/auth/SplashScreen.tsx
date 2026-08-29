import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';

const SplashScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.appTitle}>✈️ Travel Buddy</Text>
      <ActivityIndicator size="large" color="#FF6B6B" style={{ marginTop: 20 }} />
      <Text style={styles.loadingText}>Loading...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FF6B6B'
  },
  appTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20
  },
  loadingText: {
    fontSize: 14,
    color: '#fff',
    marginTop: 20,
    opacity: 0.8
  }
});

export default SplashScreen;
