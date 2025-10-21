import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';
import { useApp } from '../context/AppContext';
import { Card, Field, Button } from '../components/UI';

export default function SettingsScreen() {
  const { settings, updateSettings } = useApp();
  const [currency, setCurrency] = useState(settings.currency);
  const [name, setName] = useState(settings.name);
  const [notif, setNotif] = useState(settings.notifications);

  const save = () => {
    updateSettings({ currency, name, notifications: notif });
  };

  return (
    <View style={{ paddingHorizontal: 16, paddingTop: 12 }}>
      <Card>
        <Text style={styles.h}>Preferences</Text>
        <Field label="Display Name" value={name} onChangeText={setName} />
        <Field label="Currency Symbol" value={currency} onChangeText={setCurrency} />
        <View style={styles.row}>
          <Text style={{ fontWeight: '600', color: '#374151' }}>Notifications</Text>
          <Switch value={notif} onValueChange={setNotif} />
        </View>
        <Button title="Save" onPress={save} />
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  h: { fontSize: 16, fontWeight: '700', marginBottom: 8, color: '#111827' },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
});
