'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Expense } from '@/lib/types';
import { useMemo } from 'react';
import { Bar, BarChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Cell } from 'recharts';

interface ChartsProps {
  expenses: Expense[];
}

const chartColors = ['#3F51B5', '#7E57C2', '#4CAF50', '#FFC107', '#F44336', '#9E9E9E'];

export function Charts({ expenses }: ChartsProps) {
  const spendingByCategory = useMemo(() => {
    const categoryMap: { [key: string]: number } = {};
    expenses.forEach((expense) => {
      categoryMap[expense.category] = (categoryMap[expense.category] || 0) + expense.amount;
    });
    return Object.entries(categoryMap).map(([name, value]) => ({ name, value }));
  }, [expenses]);

  const dailySpending = useMemo(() => {
    const dailyMap: { [key: string]: number } = {};
    expenses.forEach((expense) => {
      const date = new Date(expense.date).toLocaleDateString('en-CA'); // YYYY-MM-DD
      dailyMap[date] = (dailyMap[date] || 0) + expense.amount;
    });
    return Object.entries(dailyMap)
      .map(([date, value]) => ({ date, value }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [expenses]);

  return (
    <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Spending by Category</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={{}} className="mx-auto aspect-square max-h-[300px]">
            {spendingByCategory.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={spendingByCategory} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                    {spendingByCategory.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="rounded-lg border bg-background p-2 shadow-sm">
                            <div className="grid grid-cols-2 gap-2">
                              <div className="flex flex-col">
                                <span className="text-[0.70rem] uppercase text-muted-foreground">Category</span>
                                <span className="font-bold text-muted-foreground">{payload[0].name}</span>
                              </div>
                              <div className="flex flex-col">
                                <span className="text-[0.70rem] uppercase text-muted-foreground">Amount</span>
                                <span className="font-bold">
                                  {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(payload[0].value as number)}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-muted-foreground">No spending data available.</div>
            )}
          </ChartContainer>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Daily Spending Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={{}} className="h-[300px] w-full">
            {dailySpending.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dailySpending}>
                <XAxis dataKey="date" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 12 }} tickLine={false} axisLine={false} tickFormatter={(value) => `₹${value / 1000}k`} />
                <Tooltip
                   cursor={{ fill: 'hsl(var(--muted))' }}
                   content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="rounded-lg border bg-background p-2 shadow-sm">
                           <p className="text-sm font-bold">{new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(payload[0].value as number)}</p>
                           <p className="text-xs text-muted-foreground">{payload[0].payload.date}</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="value" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-muted-foreground">No spending data available.</div>
            )}
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
