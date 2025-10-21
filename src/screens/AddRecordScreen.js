import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { useApp, CATEGORIES } from '../context/AppContext';
import { Card, Button, Field } from '../components/UI';

export default function AddRecordScreen({ onSaved }) {
  const { addRecord } = useApp();
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('expense'); // 'income' | 'expense'
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [note, setNote] = useState('');

  const save = () => {
    const amt = Number(amount);
    if (!amt) return Alert.alert('Amount required');
    addRecord({ type, amount: amt, category, note, date: new Date() });
    setAmount(''); setNote('');
    onSaved && onSaved();
  };

  return (
    <View>
      <Card>
        <Field label="Amount" keyboardType="numeric" value={amount} onChangeText={setAmount} />
        <Field label="Type (income/expense)" value={type} onChangeText={setType} />
        <Field label="Category" value={category} onChangeText={setCategory} />
        <Field label="Note" value={note} onChangeText={setNote} />
        <Button title="Save Record" onPress={save} />
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({});
