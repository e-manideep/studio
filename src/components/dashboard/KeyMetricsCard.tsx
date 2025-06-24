'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Expense } from '@/lib/types';
import { Banknote, PiggyBank, Target } from 'lucide-react';
import { useMemo } from 'react';

interface KeyMetricsCardProps {
  expenses: Expense[];
  budget: number;
}

export function KeyMetricsCard({ expenses, budget }: KeyMetricsCardProps) {
  const totalSpending = useMemo(() => {
    return expenses.reduce((sum, expense) => sum + expense.amount, 0);
  }, [expenses]);

  const remainingBudget = budget - totalSpending;
  const isOverBudget = remainingBudget < 0;

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Financial Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div className="flex flex-col items-center gap-2">
            <div className="p-3 rounded-full bg-primary/10 text-primary">
              <Banknote className="h-6 w-6" />
            </div>
            <p className="text-sm text-muted-foreground">Total Spending</p>
            <p className="text-2xl font-bold font-headline">
              {formatCurrency(totalSpending)}
            </p>
          </div>

          <div className="hidden md:block">
             <Separator orientation="vertical" />
          </div>
          <div className="block md:hidden">
             <Separator orientation="horizontal" />
          </div>

          <div className="flex flex-col items-center gap-2">
            <div className="p-3 rounded-full bg-primary/10 text-primary">
              <Target className="h-6 w-6" />
            </div>
            <p className="text-sm text-muted-foreground">Monthly Budget</p>
            <p className="text-2xl font-bold font-headline">
              {formatCurrency(budget)}
            </p>
          </div>

          <div className="hidden md:block">
             <Separator orientation="vertical" />
          </div>
          <div className="block md:hidden">
             <Separator orientation="horizontal" />
          </div>

          <div className="flex flex-col items-center gap-2">
            <div
              className={`p-3 rounded-full ${
                isOverBudget ? 'bg-red-500/10 text-red-500' : 'bg-green-500/10 text-green-500'
              }`}
            >
              <PiggyBank className="h-6 w-6" />
            </div>
            <p className="text-sm text-muted-foreground">Budget Status</p>
            <p
              className={`text-2xl font-bold font-headline ${
                isOverBudget ? 'text-red-500' : 'text-green-500'
              }`}
            >
              {isOverBudget ? 'Over Budget' : 'Under Budget'}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
