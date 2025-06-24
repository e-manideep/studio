'use client';
import { BudgetCard } from '@/components/budget/BudgetCard';
import { SavingsGoalsCard } from '@/components/budget/SavingsGoalsCard';

export default function BudgetPage() {
  return (
    <div className="container max-w-screen-lg mx-auto p-4 md:p-8">
      <h1 className="text-3xl font-headline font-bold mb-6">Budget & Goals</h1>
      <div className="grid gap-8 grid-cols-1 md:grid-cols-2">
        <BudgetCard />
        <SavingsGoalsCard />
      </div>
    </div>
  );
}
