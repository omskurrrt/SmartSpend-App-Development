import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { PlaceholderBlock } from './UI';
import { COLORS } from '../theme';

export default function Header({ currentPage, onSettings, onProfile }) {
  return (
    <View style={styles.wrap}>
      {/* Left: settings icon (no image) */}
      <TouchableOpacity onPress={onSettings} style={styles.iconBtn}>
        <Text style={styles.iconTxt}>⚙</Text>
      </TouchableOpacity>

      {/* Center: SmartSpend title */}
      <Text style={styles.title}>SmartSpend</Text>

      {/* Right: avatar placeholder */}
      <TouchableOpacity onPress={onProfile} style={styles.avatarWrap}>
        <PlaceholderBlock height={28} style={{ width: 28, borderRadius: 14 }} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingTop: 8,
    paddingBottom: 6,
    backgroundColor: COLORS.white,
  },
  iconBtn: {
    width: 36, height: 36, borderRadius: 18,
    alignItems: 'center', justifyContent: 'center',
  },
  iconTxt: { fontSize: 18, color: COLORS.nearBlack },
  title: { flex: 1, textAlign: 'center', fontSize: 18, fontWeight: '800', color: COLORS.nearBlack },
  avatarWrap: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
});
