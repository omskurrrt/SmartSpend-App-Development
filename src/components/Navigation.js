// src/components/Navigation.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS } from '../theme';

const tabs = [
  { key: 'home', label: 'Home', icon: '🏠' },
  { key: 'budgets', label: 'Budgets', icon: '💼' },
  { key: 'records', label: 'Records', icon: '🧾' },
  { key: 'analysis', label: 'Analysis', icon: '📊' },
];

export default function Navigation({ current, onChange, onAdd }) {
  return (
    <>
      {/* Rounded white card nav at bottom */}
      <View style={styles.nav}>
        {tabs.map((t, i) => (
          <TouchableOpacity
            key={t.key}
            style={[styles.item, i === 1 && { marginRight: 40 }, i === 2 && { marginLeft: 40 }]}
            onPress={() => onChange(t.key)}
            activeOpacity={0.8}
          >
            <Text style={[styles.icon, current === t.key && styles.activeTxt]}>{t.icon}</Text>
            <Text style={[styles.lbl, current === t.key && styles.activeTxt]}>{t.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Floating + button in the center, overlapping the nav */}
      <TouchableOpacity onPress={onAdd} activeOpacity={0.9} style={styles.fab}>
        <Text style={styles.fabTxt}>＋</Text>
      </TouchableOpacity>
    </>
  );
}

const styles = StyleSheet.create({
  nav: {
    position: 'absolute',
    left: 12,
    right: 12,
    bottom: 12,
    backgroundColor: COLORS.white,
    borderRadius: 18,
    paddingVertical: 8,
    flexDirection: 'row',
    justifyContent: 'space-around',
    // subtle border + shadow like the mock
    borderWidth: 1,
    borderColor: COLORS.grayLight,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 3,
  },
  item: { alignItems: 'center', paddingVertical: 4, minWidth: 72 },
  icon: { fontSize: 16, color: '#6B7280' },
  lbl: { fontSize: 11, color: '#6B7280', marginTop: 2, fontWeight: '600' },
  activeTxt: { color: COLORS.nearBlack },
  fab: {
    position: 'absolute',
    bottom: 28,
    left: '50%',
    marginLeft: -28,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.nearBlack,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.16,
    shadowRadius: 12,
    elevation: 5,
    borderWidth: 4,
    borderColor: COLORS.white,
  },
  fabTxt: { color: COLORS.white, fontSize: 30, fontWeight: '800', lineHeight: 30 },
});
