'use client';
import { ExpenseForm } from '@/components/expenses/ExpenseForm';
import { ExpenseList } from '@/components/expenses/ExpenseList';
import { CSVUpload } from '@/components/expenses/CSVUpload';

export default function ExpensesPage() {
  return (
    <div className="container max-w-screen-2xl mx-auto p-4 md:p-8">
      <h1 className="text-3xl font-headline font-bold mb-6">Manage Expenses</h1>
      <div className="grid gap-8 grid-cols-1 lg:grid-cols-3">
        <div className="lg:col-span-1 flex flex-col gap-8">
          <ExpenseForm />
          <CSVUpload />
        </div>
        <div className="lg:col-span-2">
          <ExpenseList />
        </div>
      </div>
    </div>
  );
}
