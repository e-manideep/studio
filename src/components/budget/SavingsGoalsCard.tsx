'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { useAppContext } from '@/hooks/useAppContext';
import { useToast } from '@/hooks/use-toast';
import { PiggyBank, Trash2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const formSchema = z.object({
  name: z.string().min(2, 'Goal name is too short.'),
  targetAmount: z.coerce.number().min(1, 'Target amount must be positive.'),
});

export function SavingsGoalsCard() {
  const { savingsGoals, addSavingsGoal, deleteSavingsGoal } = useAppContext();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: '', targetAmount: undefined },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    addSavingsGoal(values);
    toast({
      title: 'Goal Added',
      description: `New savings goal "${values.name}" created.`,
    });
    form.reset();
  }

  const handleDelete = (id: string, name: string) => {
    deleteSavingsGoal(id);
    toast({
      title: 'Goal Removed',
      description: `Savings goal "${name}" was removed.`,
    });
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
        <CardTitle>Savings Goals</CardTitle>
        <CardDescription>Define and track your financial goals.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mb-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Goal Name (e.g., New Laptop)" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="targetAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input type="number" placeholder="Target (₹)" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button type="submit" className="w-full">Add Goal</Button>
          </form>
        </Form>
        <Separator />
        <div className="space-y-4 mt-6">
            <h4 className="text-sm font-medium">Your Goals</h4>
            {savingsGoals.length > 0 ? (
                savingsGoals.map(goal => (
                    <div key={goal.id} className="flex items-center justify-between">
                        <div className='flex items-center gap-3'>
                            <PiggyBank className="h-5 w-5 text-primary"/>
                            <div>
                                <p className="font-semibold">{goal.name}</p>
                                <p className="text-sm text-muted-foreground">{formatCurrency(goal.targetAmount)}</p>
                            </div>
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(goal.id, goal.name)}>
                            <Trash2 className="h-4 w-4 text-muted-foreground"/>
                        </Button>
                    </div>
                ))
            ) : (
                <p className="text-sm text-muted-foreground text-center py-4">No savings goals set yet.</p>
            )}
        </div>
      </CardContent>
    </Card>
  );
}
