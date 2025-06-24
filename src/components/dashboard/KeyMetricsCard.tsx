'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Expense } from '@/lib/types';
import { Banknote, PiggyBank, Target } from 'lucide-react';
import { useMemo } from 'react';
import { Progress } from '@/components/ui/progress';

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
  const budgetUsagePercent = budget > 0 ? Math.min(Math.round((totalSpending / budget) * 100), 100) : 0;

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
        <CardDescription>Your financial summary for this period.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          
          <div className="flex flex-col items-center gap-2">
            <div className="p-3 rounded-full bg-primary/10 text-primary">
              <Banknote className="h-6 w-6" />
            </div>
            <p className="text-sm text-muted-foreground">Total Spending</p>
            <p className="text-2xl font-bold font-headline">
              {formatCurrency(totalSpending)}
            </p>
          </div>

          <div className="hidden md:flex justify-center items-center">
             <Separator orientation="vertical" className="h-16" />
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

          <div className="hidden md:flex justify-center items-center">
             <Separator orientation="vertical" className="h-16" />
          </div>
          <div className="block md:hidden">
             <Separator orientation="horizontal" />
          </div>

          <div className="flex flex-col items-center gap-2">
            <div
              className={`p-3 rounded-full ${
                isOverBudget ? 'bg-destructive/10 text-destructive' : 'bg-success/10 text-success'
              }`}
            >
              <PiggyBank className="h-6 w-6" />
            </div>
            <p className="text-sm text-muted-foreground">Amount Remaining</p>
            <p
              className={`text-2xl font-bold font-headline ${
                isOverBudget ? 'text-destructive' : 'text-success'
              }`}
            >
              {formatCurrency(remainingBudget)}
            </p>
          </div>
        </div>
        <div className="mt-6">
            <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-muted-foreground">Budget Usage</span>
                <span className="text-sm font-medium">{budgetUsagePercent}%</span>
            </div>
            <Progress value={budgetUsagePercent} className="h-2 [&>div]:bg-primary" />
             <p className={`text-xs mt-1 ${isOverBudget ? 'text-destructive' : 'text-muted-foreground'}`}>
                {isOverBudget 
                    ? `You've overspent by ${formatCurrency(Math.abs(remainingBudget))}.` 
                    : `${formatCurrency(remainingBudget)} remaining.`
                }
            </p>
        </div>
      </CardContent>
    </Card>
  );
}
