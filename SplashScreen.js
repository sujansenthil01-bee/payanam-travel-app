import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import colors from '../theme/colors';

// Recreates screenshot 1: orange sky gradient, clouds + plane illustration up top,
// train logo, "PAYANAM" wordmark, pill CTA button, tagline.
export default function SplashScreen({ navigation }) {
  return (
    <LinearGradient
      colors={['#F2A93B', '#FBEFDD', '#F5A623']}
      locations={[0, 0.55, 1]}
      style={styles.container}
    >
      <View style={styles.skyRow}>
        <MaterialCommunityIcons name="cloud" size={70} color="#fff" style={{ opacity: 0.9, marginTop: 10 }} />
        <MaterialCommunityIcons name="airplane" size={64} color="#8B4B2A" style={{ transform: [{ rotate: '35deg' }] }} />
      </View>
      <MaterialCommunityIcons name="cloud" size={90} color="#fff" style={styles.cloudLeft} />

      <View style={styles.center}>
        <View style={styles.trainBadge}>
          <MaterialCommunityIcons name="train" size={54} color="#D9C400" />
        </View>
        <Text style={styles.title}>PAYANAM</Text>

        <TouchableOpacity style={styles.ctaPill} onPress={() => navigation.replace('Login')}>
          <Text style={styles.ctaText}>let's get started</Text>
        </TouchableOpacity>

        <Text style={styles.tagline}>"Explore. Dream. Discover."</Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  skyRow: { position: 'absolute', top: 60, right: 30, flexDirection: 'row', alignItems: 'center' },
  cloudLeft: { position: 'absolute', top: 140, left: 20, opacity: 0.9 },
  center: { alignItems: 'center', marginTop: 40 },
  trainBadge: { marginBottom: 8 },
  title: {
    fontSize: 40,
    fontWeight: '700',
    color: '#C07A2E',
    letterSpacing: 2,
    marginBottom: 28,
    fontFamily: 'serif',
  },
  ctaPill: {
    backgroundColor: 'rgba(220,220,220,0.55)',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 30,
  },
  ctaText: { color: '#5B7A1A', fontWeight: '700', fontSize: 15 },
  tagline: { marginTop: 18, color: '#C9A227', fontWeight: '700', fontSize: 15 },
});
