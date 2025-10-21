import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useApp } from '../context/AppContext';
import { Card } from '../components/UI';

export default function AnalysisScreen() {
  const { records, settings } = useApp();

  const summary = useMemo(() => {
    let income = 0, expense = 0;
    for (const r of records) r.type === 'income' ? (income += r.amount) : (expense += r.amount);
    return { income, expense, balance: income - expense };
  }, [records]);

  return (
    <View>
      <Card>
        <Text style={styles.h}>Overview</Text>
        <View style={styles.row}><Text style={styles.k}>Income</Text><Text style={styles.v}>{settings.currency}{summary.income}</Text></View>
        <View style={styles.row}><Text style={styles.k}>Expense</Text><Text style={styles.v}>{settings.currency}{summary.expense}</Text></View>
        <View style={styles.row}><Text style={styles.k}>Balance</Text><Text style={styles.v}>{settings.currency}{summary.balance}</Text></View>
      </Card>

      <Card>
        <Text style={styles.h}>Hint</Text>
        <Text style={{ color: '#6B7280' }}>
          This is a lightweight analysis view (no charts, no images). You can wire it to real data later.
        </Text>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  h: { fontSize: 16, fontWeight: '700', marginBottom: 8, color: '#111827' },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6 },
  k: { color: '#374151', fontWeight: '600' },
  v: { color: '#111827', fontWeight: '700' },
});
