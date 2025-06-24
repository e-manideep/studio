'use server';

/**
 * @fileOverview A conversational AI agent for personal finance.
 *
 * - financialChat - A function that handles the chat conversation.
 * - FinancialChatInput - The input type for the financialChat function.
 * - FinancialChatOutput - The return type for the financialChat function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExpenseSchema = z.object({
  amount: z.number().describe('The amount of the expense in INR.'),
  description: z.string().describe('A description of the expense.'),
  category: z.string().describe('The category of the expense.'),
});

const SavingsGoalSchema = z.object({
  goalName: z.string().describe('The name of the savings goal.'),
  targetAmount: z.number().describe('The target amount for the savings goal in INR.'),
});

const MessageSchema = z.object({
    role: z.enum(['user', 'model']),
    content: z.array(z.object({text: z.string()})),
});

const FinancialChatInputSchema = z.object({
  expenses: z.array(ExpenseSchema).describe("The user's list of expenses."),
  monthlyBudget: z.number().describe('The user’s monthly budget in INR.'),
  savingsGoals: z.array(SavingsGoalSchema).describe("The user's list of savings goals."),
  history: z
    .array(MessageSchema)
    .describe('The conversation history.'),
  message: z.string().describe('The latest message from the user.'),
});
export type FinancialChatInput = z.infer<typeof FinancialChatInputSchema>;

const FinancialChatOutputSchema = z.object({
  response: z.string().describe('The AI-generated response.'),
});
export type FinancialChatOutput = z.infer<typeof FinancialChatOutputSchema>;

export async function financialChat(input: FinancialChatInput): Promise<FinancialChatOutput> {
  return financialChatFlow(input);
}

const financialChatFlow = ai.defineFlow(
  {
    name: 'financialChatFlow',
    inputSchema: FinancialChatInputSchema,
    outputSchema: FinancialChatOutputSchema,
  },
  async ({expenses, monthlyBudget, savingsGoals, history, message}) => {
    const systemPrompt = `You are a friendly and knowledgeable financial assistant called Gemini Finance Pilot. Your goal is to help the user understand and manage their personal finances. You must be conversational, helpful, and provide clear, actionable advice.

    Here is the user's current financial situation:
    - Monthly Budget: ₹${monthlyBudget.toLocaleString('en-IN')}
    - Expenses:
      ${expenses.length > 0 ? expenses.map(e => `- ₹${e.amount} on ${e.description} (${e.category})`).join('\n      ') : 'No expenses recorded yet.'}
    - Savings Goals:
      ${savingsGoals.length > 0 ? savingsGoals.map(g => `- ${g.goalName} (₹${g.targetAmount.toLocaleString('en-IN')})`).join('\n      ') : 'No savings goals set yet.'}

    Engage in a natural conversation. Answer the user's questions based on the data provided. If you provide advice, make it practical and relevant to their situation. Keep your responses concise and easy to understand.
    `;
    
    const {output} = await ai.generate({
      prompt: message,
      history,
      system: systemPrompt,
    });
    
    if (!output?.text) {
        return { response: "I'm sorry, I couldn't generate a response. Please try again." };
    }

    return {response: output.text};
  }
);
