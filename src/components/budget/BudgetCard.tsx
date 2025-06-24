'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useAppContext } from '@/hooks/useAppContext';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

export function BudgetCard() {
  const { budget, setBudget } = useAppContext();
  const [newBudget, setNewBudget] = useState(budget);
  const { toast } = useToast();

  const handleSave = () => {
    if (newBudget > 0) {
      setBudget(newBudget);
      toast({
        title: 'Budget Updated',
        description: `Your monthly budget is now ₹${newBudget.toLocaleString('en-IN')}.`,
      });
    } else {
      toast({
        title: 'Invalid Amount',
        description: 'Please enter a positive number for the budget.',
        variant: 'destructive',
      });
    }
  };

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Budget</CardTitle>
        <CardDescription>Set your total spending limit for the month.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm text-muted-foreground">Current Budget</p>
          <p className="text-3xl font-bold font-headline">{formatCurrency(budget)}</p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="budget">Update Budget (₹)</Label>
          <div className="flex gap-2">
            <Input
              id="budget"
              type="number"
              placeholder="e.g., 50000"
              value={newBudget}
              onChange={(e) => setNewBudget(Number(e.target.value))}
            />
            <Button onClick={handleSave}>Save</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
