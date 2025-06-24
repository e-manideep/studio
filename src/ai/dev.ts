import { config } from 'dotenv';
config();

import '@/ai/flows/suggest-expense-category.ts';
import '@/ai/flows/provide-financial-insights.ts';
import '@/ai/flows/financial-chat.ts';
import '@/ai/flows/extract-expense-from-image.ts';
import '@/ai/flows/text-to-speech.ts';
