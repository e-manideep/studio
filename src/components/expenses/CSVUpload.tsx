'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useAppContext } from '@/hooks/useAppContext';
import { categories, Category, Expense } from '@/lib/types';
import { ChangeEvent, useState } from 'react';
import { Loader2, Upload } from 'lucide-react';

export function CSVUpload() {
  const { addBulkExpenses } = useAppContext();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setLoading(true);
    const reader = new FileReader();

    reader.onload = (e) => {
      const text = e.target?.result as string;
      const lines = text.split('\n');
      
      // Assumes first line is header: amount,description,category
      const dataLines = lines.slice(1);
      
      const newExpenses: Omit<Expense, 'id' | 'date'>[] = [];
      const invalidRows: number[] = [];

      dataLines.forEach((line, index) => {
        if (!line.trim()) return;
        const [amountStr, description, category] = line.split(',');
        
        const amount = parseFloat(amountStr);
        const trimmedCategory = category?.trim() as Category;

        if (!isNaN(amount) && amount > 0 && description?.trim() && categories.includes(trimmedCategory)) {
          newExpenses.push({
            amount,
            description: description.trim(),
            category: trimmedCategory,
          });
        } else {
          invalidRows.push(index + 2); // +2 to account for header and 0-based index
        }
      });

      if (newExpenses.length > 0) {
        addBulkExpenses(newExpenses);
      }
      
      setLoading(false);

      toast({
        title: 'CSV Import Complete',
        description: `${newExpenses.length} expenses added. ${invalidRows.length > 0 ? `Skipped invalid rows: ${invalidRows.join(', ')}.` : ''}`,
      });
    };

    reader.onerror = () => {
        setLoading(false);
        toast({ title: 'Error reading file', variant: 'destructive' });
    }

    reader.readAsText(file);
    
    // Reset file input
    if (event.target) {
        event.target.value = '';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bulk Upload Expenses</CardTitle>
        <CardDescription>Upload a CSV file with columns: amount, description, category.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="csv-upload">CSV File</Label>
          <div className='flex gap-2'>
            <Input id="csv-upload" type="file" accept=".csv" onChange={handleFileUpload} disabled={loading} />
            <Button size="icon" variant="outline" disabled>
                {loading ? <Loader2 className="h-4 w-4 animate-spin"/> : <Upload className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
