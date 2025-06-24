'use client';

import { useAppContext } from '@/hooks/useAppContext';
import { KeyMetricsCard } from '@/components/dashboard/KeyMetricsCard';
import { Charts } from '@/components/dashboard/Charts';
import { AIInsightsCard } from '@/components/dashboard/AIInsightsCard';

export default function DashboardPage() {
  const { expenses, budget, savingsGoals } = useAppContext();

  return (
    <div className="container max-w-screen-2xl mx-auto p-4 md:p-8">
      <h1 className="text-3xl font-headline font-bold mb-6">Dashboard</h1>
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
        <div className="lg:col-span-3">
          <KeyMetricsCard expenses={expenses} budget={budget} />
        </div>
        <div className="lg:col-span-2">
          <Charts expenses={expenses} />
        </div>
        <div className="lg:col-span-1">
          <AIInsightsCard expenses={expenses} budget={budget} savingsGoals={savingsGoals} />
        </div>
      </div>
    </div>
  );
}
