import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import { useApp } from '../context/AppContext';
import { Card, Button } from '../components/UI';

export default function BudgetsScreen() {
  const { budgets, setBudgets, settings } = useApp();
  const [name, setName] = useState('');
  const [limit, setLimit] = useState('');

  const addBudget = () => {
    if (!name || !limit) return;
    setBudgets(prev => [...prev, { id: String(Date.now()), name, limit: Number(limit), spent: 0 }]);
    setName(''); setLimit('');
  };

  return (
    <View>
      <Card>
        <Text style={styles.h}>New Budget</Text>
        <TextInput placeholder="Name" placeholderTextColor="#9CA3AF" value={name} onChangeText={setName} style={styles.input} />
        <TextInput placeholder="Limit" placeholderTextColor="#9CA3AF" keyboardType="numeric" value={limit} onChangeText={setLimit} style={styles.input} />
        <Button title="Add Budget" onPress={addBudget} />
      </Card>

      {budgets.map(b => (
        <Card key={b.id}>
          <View style={styles.row}>
            <Text style={styles.name}>{b.name}</Text>
            <Text style={styles.amt}>{settings.currency}{b.spent}/{settings.currency}{b.limit}</Text>
          </View>
          <View style={styles.barWrap}>
            <View style={[styles.barFill, { width: `${Math.min(100, (b.spent / b.limit) * 100)}%` }]} />
          </View>
        </Card>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  h: { fontSize: 16, fontWeight: '700', marginBottom: 8, color: '#111827' },
  input: { borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, marginBottom: 8, color: '#111827' },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  name: { fontWeight: '700', color: '#374151' },
  amt: { color: '#6B7280' },
  barWrap: { height: 10, backgroundColor: '#E5E7EB', borderRadius: 6, marginTop: 6 },
  barFill: { height: 10, backgroundColor: '#4F46E5', borderRadius: 6 },
});
