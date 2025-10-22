// src/components/DateIndicator.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'; // <-- add TouchableOpacity
import { COLORS } from '../theme';

export default function DateIndicator({
  title,
  expense = 0,
  income = 0,
  currency = '₱',
  onMenuPress,
  onPrevPress,
  onNextPress,
  onRefreshPress,
}) {
  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={onMenuPress} style={styles.iconBtn} activeOpacity={0.8}>
          <Text style={styles.iconTxt}>≡</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={onPrevPress} style={styles.iconBtn} activeOpacity={0.8}>
          <Text style={styles.iconTxt}>‹</Text>
        </TouchableOpacity>

        <Text style={styles.title} numberOfLines={1}>{title}</Text>

        <TouchableOpacity onPress={onNextPress} style={styles.iconBtn} activeOpacity={0.8}>
          <Text style={styles.iconTxt}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={onRefreshPress} style={styles.iconBtn} activeOpacity={0.8}>
          <Text style={styles.iconTxt}>⟳</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.amountRow}>
        <View style={styles.amountBox}>
          <Text style={styles.amountLabel}>EXPENSE</Text>
          <Text style={[styles.amountValue, { color: COLORS.red }]}>
            {currency}{Number(expense).toLocaleString()}
          </Text>
        </View>
        <View style={styles.amountBox}>
          <Text style={styles.amountLabel}>INCOME</Text>
          <Text style={[styles.amountValue, { color: COLORS.green }]}>
            {currency}{Number(income).toLocaleString()}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white, // white background
    paddingHorizontal: 12,
    paddingVertical: 10,
    width: '100%',
    alignSelf: 'stretch',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,     // inner padding
  },
  amountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingHorizontal: 16,     // inner padding
  },  
  iconBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconTxt: { fontSize: 18, color: COLORS.nearBlack },
  title: { flexShrink: 1, fontWeight: '700', color: COLORS.nearBlack },
  amountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  amountBox: { alignItems: 'center', flex: 1 },
  amountLabel: { color: COLORS.nearBlack, fontWeight: '700', fontSize: 12, opacity: 0.7 },
  amountValue: { fontWeight: '800', fontSize: 18 },
});
