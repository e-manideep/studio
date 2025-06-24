'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { generateInsightsAction } from '@/lib/actions';
import { Expense, SavingsGoal } from '@/lib/types';
import { Lightbulb, Loader2 } from 'lucide-react';
import { useState, useTransition } from 'react';

interface AIInsightsCardProps {
  expenses: Expense[];
  budget: number;
  savingsGoals: SavingsGoal[];
}

export function AIInsightsCard({ expenses, budget, savingsGoals }: AIInsightsCardProps) {
  const [insight, setInsight] = useState('');
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleGenerateInsight = () => {
    if (expenses.length === 0) {
      toast({
        title: 'Not enough data',
        description: 'Please add some expenses to generate an insight.',
        variant: 'destructive',
      });
      return;
    }

    startTransition(async () => {
      const insightInput = {
        expenses: expenses.map(({ amount, description, category }) => ({ amount, description, category })),
        monthlyBudget: budget,
        savingsGoals: savingsGoals.map(({ name, targetAmount }) => ({ goalName: name, targetAmount })),
      };
      const result = await generateInsightsAction(insightInput);
      if (result.error) {
        toast({
          title: 'Error',
          description: result.error,
          variant: 'destructive',
        });
        setInsight('');
      } else {
        setInsight(result.advice);
      }
    });
  };

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>AI Financial Insights</CardTitle>
        <CardDescription>Get personalized advice based on your activity.</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col items-center justify-center text-center gap-4">
        {insight ? (
          <p className="text-sm text-muted-foreground animate-fade-in-up">{insight}</p>
        ) : (
          <div className="flex flex-col items-center justify-center text-muted-foreground">
            <Lightbulb className="h-10 w-10 mb-2" />
            <p>Click the button to generate your financial insight.</p>
          </div>
        )}
        <Button onClick={handleGenerateInsight} disabled={isPending} className="w-full mt-auto">
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            'Generate Insight ✨'
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
