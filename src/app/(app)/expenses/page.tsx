'use client';

import { ExpenseList } from '@/components/expenses/ExpenseList';
import { AddExpenseTabs } from '@/components/expenses/AddExpenseTabs';

export default function ExpensesPage() {
  return (
    <div className="container max-w-screen-2xl mx-auto p-4 md:p-8">
      <h1 className="text-3xl font-headline font-bold mb-6">Manage Expenses</h1>
      <div className="grid gap-8 grid-cols-1 lg:grid-cols-2">
        <AddExpenseTabs />
        <ExpenseList />
      </div>
    </div>
  );
}
