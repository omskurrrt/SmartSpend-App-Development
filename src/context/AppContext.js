import React, { createContext, useContext, useMemo, useState } from 'react';

export const CATEGORIES = ['Food', 'Transport', 'Bills', 'Groceries', 'Entertainment', 'Others'];

const AppCtx = createContext(null);

export function AppProvider({ children }) {
  const [settings, setSettings] = useState({
    theme: 'light',
    currency: '₱',
    notifications: true,
    weeklyStart: 'Mon',
    name: 'You',
  });

  const [budgets, setBudgets] = useState([
    { id: 'b1', name: 'Food', limit: 4000, spent: 1800 },
    { id: 'b2', name: 'Transport', limit: 1500, spent: 600 },
    { id: 'b3', name: 'Groceries', limit: 3000, spent: 2100 },
  ]);

  const [records, setRecords] = useState([
    { id: 'r1', type: 'expense', amount: 220, category: 'Food', note: 'Siomai + rice', date: new Date() },
    { id: 'r2', type: 'income', amount: 5000, category: 'Others', note: 'Side gig', date: new Date() },
    { id: 'r3', type: 'expense', amount: 120, category: 'Transport', note: 'Jeep', date: new Date() },
  ]);

  const addRecord = (rec) => {
    setRecords((prev) => [{ id: String(Date.now()), ...rec }, ...prev]);
    if (rec.type === 'expense') {
      setBudgets((prev) =>
        prev.map((b) => (b.name === rec.category ? { ...b, spent: b.spent + rec.amount } : b))
      );
    }
  };

  const updateSettings = (patch) => setSettings((s) => ({ ...s, ...patch }));

  const value = useMemo(
    () => ({ settings, updateSettings, budgets, setBudgets, records, addRecord }),
    [settings, budgets, records]
  );

  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>;
}

export const useApp = () => useContext(AppCtx);
