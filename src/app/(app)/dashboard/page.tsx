'use client';

import { useAppContext } from '@/hooks/useAppContext';
import { KeyMetricsCard } from '@/components/dashboard/KeyMetricsCard';
import { Charts } from '@/components/dashboard/Charts';
import { AssistantPanel } from '@/components/dashboard/AssistantPanel';

export default function DashboardPage() {
  const { expenses, budget } = useAppContext();

  return (
    <div className="container max-w-screen-2xl mx-auto p-4 md:p-8">
      <h1 className="text-3xl font-headline font-bold mb-6">Dashboard</h1>
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-4">
        <div className="lg:col-span-4">
          <KeyMetricsCard expenses={expenses} budget={budget} />
        </div>
        <div className="lg:col-span-2">
          <Charts expenses={expenses} />
        </div>
        <div className="lg:col-span-2">
          <AssistantPanel />
        </div>
      </div>
    </div>
  );
}
