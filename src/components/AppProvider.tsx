'use client';

import { Expense, SavingsGoal, Category } from '@/lib/types';
import React, { createContext, useState, useCallback, ReactNode } from 'react';

interface AppContextType {
  expenses: Expense[];
  addExpense: (expense: Omit<Expense, 'id' | 'date'>) => void;
  addBulkExpenses: (expenses: Omit<Expense, 'id' | 'date'>[]) => void;
  deleteExpense: (id: string) => void;
  budget: number;
  setBudget: (amount: number) => void;
  savingsGoals: SavingsGoal[];
  addSavingsGoal: (goal: Omit<SavingsGoal, 'id'>) => void;
  deleteSavingsGoal: (id: string) => void;
}

export const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [budget, setBudget] = useState<number>(50000);
  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>([]);

  const addExpense = useCallback((expense: Omit<Expense, 'id' | 'date'>) => {
    setExpenses((prev) => [
      ...prev,
      { ...expense, id: crypto.randomUUID(), date: new Date().toISOString() },
    ]);
  }, []);
  
  const addBulkExpenses = useCallback((newExpenses: Omit<Expense, 'id' | 'date'>[]) => {
    setExpenses((prev) => [
      ...prev,
      ...newExpenses.map(e => ({...e, id: crypto.randomUUID(), date: new Date().toISOString()}))
    ]);
  }, []);

  const deleteExpense = useCallback((id: string) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  }, []);

  const handleSetBudget = useCallback((amount: number) => {
    setBudget(amount);
  }, []);

  const addSavingsGoal = useCallback((goal: Omit<SavingsGoal, 'id'>) => {
    setSavingsGoals((prev) => [...prev, { ...goal, id: crypto.randomUUID() }]);
  }, []);

  const deleteSavingsGoal = useCallback((id: string) => {
    setSavingsGoals((prev) => prev.filter((g) => g.id !== id));
  }, []);

  const value = {
    expenses,
    addExpense,
    addBulkExpenses,
    deleteExpense,
    budget,
    setBudget: handleSetBudget,
    savingsGoals,
    addSavingsGoal,
    deleteSavingsGoal,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
