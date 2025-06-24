'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { categories, Category } from '@/lib/types';
import { useAppContext } from '@/hooks/useAppContext';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Wand2 } from 'lucide-react';
import { useTransition } from 'react';
import { suggestCategoryAction } from '@/lib/actions';

const formSchema = z.object({
  amount: z.coerce.number().min(0.01, 'Amount must be positive.'),
  description: z.string().min(2, 'Description is too short.'),
  category: z.enum(categories, { required_error: 'Please select a category.' }),
});

export function ExpenseForm() {
  const { addExpense } = useAppContext();
  const { toast } = useToast();
  const [isSuggesting, startSuggestion] = useTransition();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: undefined,
      description: '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    addExpense(values);
    toast({
      title: 'Expense Added',
      description: `${values.description} for ₹${values.amount} was added.`,
    });
    form.reset();
  }
  
  const handleSuggestCategory = () => {
    const description = form.getValues('description');
    if (!description) {
      toast({
        title: 'Description needed',
        description: 'Please enter a description to suggest a category.',
        variant: 'destructive'
      });
      return;
    }
    
    startSuggestion(async () => {
        const result = await suggestCategoryAction(description);
        if (result.error) {
             toast({ title: 'Suggestion Failed', description: result.error, variant: 'destructive' });
        } else if (result.category) {
            form.setValue('category', result.category as Category);
            toast({ title: 'Category Suggested!', description: `We've selected '${result.category}' based on your description.` });
        }
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Expense</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount (₹)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g., 500" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Coffee with friends" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <div className="flex gap-2">
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                   <Button type="button" variant="outline" size="icon" onClick={handleSuggestCategory} disabled={isSuggesting}>
                       {isSuggesting ? <Loader2 className="h-4 w-4 animate-spin"/> : <Wand2 className="h-4 w-4" />}
                       <span className="sr-only">Suggest Category</span>
                   </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">Add Expense</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
