export interface Expense {
  id: string;
  amount: number;
  description: string;
  category: Category;
  date: string; // ISO string
}

export interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
}

export const categories = ['Food', 'Shopping', 'Travel', 'Bills', 'Entertainment', 'Others'] as const;

export type Category = (typeof categories)[number];
