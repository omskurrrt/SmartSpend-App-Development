// App.js
import React, { useState } from 'react';
import { SafeAreaView, StatusBar, View, StyleSheet } from 'react-native';

import { AppProvider } from './src/context/AppContext';
import Header from './src/components/Header';
import Navigation from './src/components/Navigation';

import HomeScreen from './src/screens/HomeScreen';
import BudgetsScreen from './src/screens/BudgetsScreen';   // or BudgetsScreen if you renamed
import AddRecordScreen from './src/screens/AddRecordScreen';
import RecordsScreen from './src/screens/RecordsScreen';
import AnalysisScreen from './src/screens/AnalysisScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import SettingsScreen from './src/screens/SettingsScreen';

export default function App() {
  const [page, setPage] = useState('home');

  const renderPage = () => {
    switch (page) {
      case 'home': return <HomeScreen />;
      case 'budgets': return <BudgetsScreen />;
      case 'add': return <AddRecordScreen onSaved={() => setPage('home')} />;
      case 'records': return <RecordsScreen />;
      case 'analysis': return <AnalysisScreen />;
      case 'profile': return <ProfileScreen />;
      case 'settings': return <SettingsScreen />;
      default: return <HomeScreen />;
    }
  };

  const showNav = page !== 'profile' && page !== 'settings';

  return (
    <AppProvider>
      <SafeAreaView style={styles.safe}>
        <StatusBar barStyle="dark-content" />
        <View style={styles.container}>
          <Header
            currentPage={page}
            onProfile={() => setPage('profile')}
            onSettings={() => setPage('settings')}
          />
          <View style={styles.content}>{renderPage()}</View>
          {showNav && (
            <Navigation
              current={page}
              onChange={setPage}
              onAdd={() => setPage('add')}   // FAB leads to Add Record
            />
          )}
        </View>
      </SafeAreaView>
    </AppProvider>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#E0E0E0' },
  container: { flex: 1 },
  content: { flex: 1, paddingHorizontal: 16, paddingTop: 8, paddingBottom: 96 },
});
