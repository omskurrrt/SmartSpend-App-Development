import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput } from 'react-native';

export function Card({ children, style }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

export function Button({ title, onPress, variant = 'primary', disabled }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.btn,
        variant === 'secondary' && styles.btnSecondary,
        disabled && { opacity: 0.6 },
      ]}
    >
      <Text style={[styles.btnText, variant === 'secondary' && styles.btnTextSecondary]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}

export function Row({ left, right }) {
  return (
    <View style={styles.row}>
      <View>{left}</View>
      <View>{right}</View>
    </View>
  );
}

export function PlaceholderBlock({ height = 48, style }) {
  return <View style={[{ height, backgroundColor: '#ECEFF5', borderRadius: 10 }, style]} />;
}

export function Field({ label, ...inputProps }) {
  return (
    <View style={{ marginBottom: 12 }}>
      <Text style={{ marginBottom: 6, color: '#374151', fontWeight: '600' }}>{label}</Text>
      <TextInput
        placeholderTextColor="#9CA3AF"
        style={styles.input}
        {...inputProps}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    marginBottom: 12,
  },
  btn: {
    backgroundColor: '#4F46E5',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
    minWidth: 120,
  },
  btnSecondary: { backgroundColor: '#EEF2FF' },
  btnText: { color: 'white', fontWeight: '700' },
  btnTextSecondary: { color: '#4F46E5' },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  input: {
    borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 10,
    paddingHorizontal: 12, paddingVertical: 10, color: '#111827', backgroundColor: '#FFF'
  },
});
