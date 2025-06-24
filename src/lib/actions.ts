'use server';

import { provideFinancialInsights, FinancialInsightsInput } from '@/ai/flows/provide-financial-insights';
import { suggestExpenseCategory } from '@/ai/flows/suggest-expense-category';
import { financialChat, FinancialChatInput as FinancialChatInputType } from '@/ai/flows/financial-chat';
import { extractExpenseFromImage } from '@/ai/flows/extract-expense-from-image';
import { textToSpeech } from '@/ai/flows/text-to-speech';


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

export async function financialChatAction(input: FinancialChatInputType) {
  try {
    const result = await financialChat(input);
    return result;
  } catch (error) {
    console.error(error);
    return { error: 'Failed to get chat response.' };
  }
}

export async function extractExpenseAction(photoDataUri: string) {
    try {
        const result = await extractExpenseFromImage({ photoDataUri });
        return result;
    } catch (error) {
        console.error(error);
        return { error: 'Failed to process receipt image.' };
    }
}

export async function textToSpeechAction(text: string) {
    try {
        const result = await textToSpeech({ text });
        return result;
    } catch (error) {
        console.error(error);
        return { error: 'Failed to generate audio.' };
    }
}
