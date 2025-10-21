import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useApp } from '../context/AppContext';
import { Card, PlaceholderBlock } from '../components/UI';

export default function ProfileScreen() {
  const { settings } = useApp();

  return (
    <View style={{ paddingHorizontal: 16, paddingTop: 12 }}>
      <Card>
        <View style={{ alignItems: 'center' }}>
          <PlaceholderBlock height={96} style={{ width: 96, borderRadius: 48, marginBottom: 12 }} />
          <Text style={styles.name}>{settings.name}</Text>
          <Text style={styles.sub}>Currency: {settings.currency}</Text>
        </View>
      </Card>
      <Card>
        <Text style={styles.h}>About</Text>
        <Text style={styles.p}>This is a placeholder profile screen without images. Replace with your real user data when ready.</Text>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  name: { fontSize: 18, fontWeight: '800', color: '#111827' },
  sub: { color: '#6B7280', marginTop: 4 },
  h: { fontSize: 16, fontWeight: '700', marginBottom: 6, color: '#111827' },
  p: { color: '#374151' },
});
