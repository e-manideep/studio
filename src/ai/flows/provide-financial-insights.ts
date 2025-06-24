// src/ai/flows/provide-financial-insights.ts
'use server';

/**
 * @fileOverview Provides tailored financial advice based on the user's spending, budget, and savings goals.
 *
 * - provideFinancialInsights - A function that provides financial insights.
 * - FinancialInsightsInput - The input type for the provideFinancialInsights function.
 * - FinancialInsightsOutput - The return type for the provideFinancialInsights function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FinancialInsightsInputSchema = z.object({
  expenses: z.array(
    z.object({
      amount: z.number().describe('The amount of the expense in INR.'),
      description: z.string().describe('A description of the expense.'),
      category: z.string().describe('The category of the expense.'),
    })
  ).describe('The list of expenses.'),
  monthlyBudget: z.number().describe('The user\u2019s monthly budget in INR.'),
  savingsGoals: z.array(
    z.object({
      goalName: z.string().describe('The name of the savings goal.'),
      targetAmount: z.number().describe('The target amount for the savings goal in INR.'),
    })
  ).describe('The list of savings goals.'),
});
export type FinancialInsightsInput = z.infer<typeof FinancialInsightsInputSchema>;

const FinancialInsightsOutputSchema = z.object({
  advice: z.string().describe('Tailored financial advice based on the user\u2019s spending, budget, and savings goals.'),
});
export type FinancialInsightsOutput = z.infer<typeof FinancialInsightsOutputSchema>;

export async function provideFinancialInsights(input: FinancialInsightsInput): Promise<FinancialInsightsOutput> {
  return provideFinancialInsightsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'financialInsightsPrompt',
  input: {
    schema: FinancialInsightsInputSchema,
  },
  output: {
    schema: FinancialInsightsOutputSchema,
  },
  prompt: `You are a financial advisor providing personalized advice to users based on their financial situation.

  Analyze the user's expenses, monthly budget, and savings goals to provide actionable recommendations.
  Consider suggesting ways to reduce spending, increase savings, or optimize their budget.

  Here are the user's expenses:
  {{#each expenses}}
  - Amount: ₹{{{amount}}}, Description: {{{description}}}, Category: {{{category}}}
  {{/each}}

  Monthly Budget: ₹{{{monthlyBudget}}}

  Savings Goals:
  {{#each savingsGoals}}
  - Goal Name: {{{goalName}}}, Target Amount: ₹{{{targetAmount}}}
  {{/each}}

  Provide concise and practical financial advice, such as suggesting reductions in specific spending categories to meet their savings goals or stay within their budget.
  Focus on providing advice that can be realistically implemented given the user's current spending habits and financial goals.
  Give the advice in a paragraph form.
  `,
});

const provideFinancialInsightsFlow = ai.defineFlow(
  {
    name: 'provideFinancialInsightsFlow',
    inputSchema: FinancialInsightsInputSchema,
    outputSchema: FinancialInsightsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
