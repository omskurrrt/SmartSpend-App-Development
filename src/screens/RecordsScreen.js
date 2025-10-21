import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput } from 'react-native';
import { useApp } from '../context/AppContext';
import { Card } from '../components/UI';

export default function RecordsScreen() {
  const { records, settings } = useApp();
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return records;
    return records.filter(r =>
      r.category.toLowerCase().includes(q) ||
      (r.note || '').toLowerCase().includes(q) ||
      r.type.toLowerCase().includes(q)
    );
  }, [records, query]);

  return (
    <View>
      <Card>
        <TextInput
          placeholder="Search records"
          placeholderTextColor="#9CA3AF"
          value={query}
          onChangeText={setQuery}
          style={styles.input}
        />
      </Card>

      <Card>
        <FlatList
          data={filtered}
          keyExtractor={(i) => i.id}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <Text style={[styles.type, item.type === 'income' ? styles.income : styles.expense]}>
                {item.type.toUpperCase()}
              </Text>
              <Text style={styles.cat}>{item.category}</Text>
              <Text style={styles.note} numberOfLines={1}>{item.note}</Text>
              <Text style={styles.amt}>
                {item.type === 'income' ? '+' : '-'}{settings.currency}{item.amount}
              </Text>
            </View>
          )}
        />
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  input: { borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, color: '#111827' },
  item: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 10, borderBottomWidth: 1, borderColor: '#F3F4F6' },
  type: { width: 80, fontWeight: '700' },
  income: { color: '#059669' },
  expense: { color: '#DC2626' },
  cat: { width: 110, color: '#374151' },
  note: { flex: 1, color: '#6B7280' },
  amt: { width: 110, textAlign: 'right', fontWeight: '700', color: '#111827' },
});
