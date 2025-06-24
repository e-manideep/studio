'use server';

import { provideFinancialInsights, FinancialInsightsInput } from '@/ai/flows/provide-financial-insights';
import { suggestExpenseCategory } from '@/ai/flows/suggest-expense-category';

export async function suggestCategoryAction(description: string) {
  try {
    const result = await suggestExpenseCategory({ description });
    return result;
  } catch (error) {
    console.error(error);
    return { error: 'Failed to suggest category.' };
  }
}

export async function generateInsightsAction(input: FinancialInsightsInput) {
  try {
    const result = await provideFinancialInsights(input);
    return result;
  } catch (error) {
    console.error(error);
    return { error: 'Failed to generate insights.' };
  }
}
