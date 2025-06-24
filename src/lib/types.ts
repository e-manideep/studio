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

export type Category = 'Food' | 'Shopping' | 'Travel' | 'Bills' | 'Entertainment' | 'Others';

export const categories: Category[] = ['Food', 'Shopping', 'Travel', 'Bills', 'Entertainment', 'Others'];
