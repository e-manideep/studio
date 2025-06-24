'use server';

/**
 * @fileOverview An AI agent that extracts expense details from a receipt image.
 *
 * - extractExpenseFromImage - A function that handles the expense extraction process.
 * - ExtractExpenseInput - The input type for the extractExpenseFromImage function.
 * - ExtractExpenseOutput - The return type for the extractExpenseFromImage function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { categories } from '@/lib/types';

const ExtractExpenseInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a receipt, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type ExtractExpenseInput = z.infer<typeof ExtractExpenseInputSchema>;

const ExtractExpenseOutputSchema = z.object({
  expense: z
    .object({
      amount: z.number().describe('The total amount of the expense.'),
      description: z
        .string()
        .describe(
          'A short description of the expense, like the store or vendor name.'
        ),
      category: z
        .enum(categories)
        .describe('The suggested category for the expense.'),
    })
    .describe('The extracted expense details.'),
});
export type ExtractExpenseOutput = z.infer<typeof ExtractExpenseOutputSchema>;

export async function extractExpenseFromImage(
  input: ExtractExpenseInput
): Promise<ExtractExpenseOutput> {
  return extractExpenseFlow(input);
}

const prompt = ai.definePrompt({
  name: 'extractExpensePrompt',
  input: { schema: ExtractExpenseInputSchema },
  output: { schema: ExtractExpenseOutputSchema },
  prompt: `You are an expert at reading receipts and extracting structured data.

Analyze the provided receipt image and extract the following information:
1.  **Total Amount**: Find the final total amount paid.
2.  **Description**: Identify the name of the store or vendor.
3.  **Category**: Based on the items or store name, classify the expense into one of these categories: ${categories.join(', ')}.

Here is the receipt:
{{media url=photoDataUri}}`,
});

const extractExpenseFlow = ai.defineFlow(
  {
    name: 'extractExpenseFlow',
    inputSchema: ExtractExpenseInputSchema,
    outputSchema: ExtractExpenseOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    if (!output) {
      throw new Error('Could not extract expense details from the image.');
    }
    return output;
  }
);
