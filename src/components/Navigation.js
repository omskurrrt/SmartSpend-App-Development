// src/components/Navigation.js
import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity,Image, StyleSheet, SafeAreaView, Platform, useWindowDimensions } from 'react-native';
import { COLORS } from '../theme';

const tabs = [
  { key: 'home',    label: 'Home',    icon: require('../../assets/nav_icons/home.png') },
  { key: 'budgets', label: 'Budgets', icon: require('../../assets/nav_icons/budgets.png') },
  { key: 'records', label: 'Records', icon: require('../../assets/nav_icons/records.png') },
  { key: 'analysis',label: 'Analysis', icon: require('../../assets/nav_icons/analysis.png') },
];



export default function Navigation({ current, onChange, onAdd }) {
  const { width } = useWindowDimensions();
  const [navH, setNavH] = useState(0);

  // Slightly larger fonts on wider devices
  const isWide = width >= 392;
  const labelSize = isWide ? 12 : 11;
  const iconSize  = isWide ? 18 : 16;

  // Some Androids don’t report safe area insets; add a tiny pad so the bar never clips
  const bottomPad = Platform.OS === 'ios' ? 6 : 8;

  const onLayoutNav = useCallback(e => {
    setNavH(e.nativeEvent.layout.height);
  }, []);

  return (
    <>
      {/* Edge-to-edge bottom bar; SafeAreaView so it hugs the device bottom cleanly */}
      <SafeAreaView style={styles.safeWrap} edges={['bottom']}>
        <View style={[styles.nav, { paddingBottom: bottomPad }]} onLayout={onLayoutNav}>
          {tabs.map((t, i) => (
            <TouchableOpacity
              key={t.key}
              onPress={() => onChange(t.key)}
              activeOpacity={0.85}
              style={styles.item}
            >
              <Image
                source={t.icon}
                style={[
                  styles.iconImg,
                  { width: iconSize + 6, height: iconSize + 6 },
                  current === t.key && styles.iconImgActive,
                ]}
                resizeMode="contain"
              />

              <Text style={[styles.lbl, { fontSize: labelSize }, current === t.key && styles.active]} numberOfLines={1}>
                {t.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </SafeAreaView>

      {/* Floating + (overlaps the bar). Its bottom is derived from the measured nav height. */}
      <TouchableOpacity
        onPress={onAdd}
        activeOpacity={0.9}
        style={[
          styles.fab,
          {
            left: '50%',
            marginLeft: -28,
            bottom: Math.max(28, (navH ? navH : 60) - 26), // keep overlap consistent across sizes
          },
        ]}
      >
        <Text style={styles.fabTxt}>＋</Text>
      </TouchableOpacity>
    </>
  );
}

const styles = StyleSheet.create({
  iconImg: {
    tintColor: '#6B7280',   // remove this line if your PNGs are already colored
    marginBottom: 2,
  },
  iconImgActive: {
    tintColor: '#6B7280',   // same active color as labels; customize if needed
  },  
  safeWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0, // attach to device bottom, no outside margin
    backgroundColor: 'transparent',
  },
  nav: {
    backgroundColor: COLORS.white,

    paddingTop: 0,
    paddingHorizontal: 0,

    flexDirection: 'row',
    // tabs auto-resize evenly
    alignItems: 'center',

    // light divider + shadow
    borderTopWidth: 1,
    borderColor: COLORS.grayLight,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 3,
  },
  item: {
    flex: 1,                    // <- even distribution (responsive)
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    minWidth: 64,               // keeps touch target decent on very small screens
  },
  icon: { color: '#6B7280' },
  lbl:  { color: '#6B7280', marginTop: 2, fontWeight: '600' },
  active: { color: '#6B7280' },

  fab: {
    position: 'absolute',
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#749CB5',
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
