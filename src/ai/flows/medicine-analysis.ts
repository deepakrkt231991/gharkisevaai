'use server';
/**
 * @fileOverview An AI agent that analyzes a medicine strip image.
 *
 * - analyzeMedicine - A function that handles the medicine analysis process.
 * - AnalyzeMedicineInput - The input type for the analyzeMedicine function.
 * - AnalyzeMedicineOutput - The return type for the analyzeMedicine function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeMedicineInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a medicine strip, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type AnalyzeMedicineInput = z.infer<typeof AnalyzeMedicineInputSchema>;

const AnalyzeMedicineOutputSchema = z.object({
  medicineName: z.string().describe('The name of the medicine identified from the strip.'),
  illness: z.string().describe('The illness or condition this medicine is used to treat.'),
  expiryDate: z.string().describe('The expiry date found on the medicine strip. Format as MM/YYYY.'),
});
export type AnalyzeMedicineOutput = z.infer<typeof AnalyzeMedicineOutputSchema>;

export async function analyzeMedicine(input: AnalyzeMedicineInput): Promise<AnalyzeMedicineOutput> {
  return analyzeMedicineFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeMedicinePrompt',
  input: {schema: AnalyzeMedicineInputSchema},
  output: {schema: AnalyzeMedicineOutputSchema},
  prompt: `You are an expert pharmacist. You will be provided with an image of a medicine strip.

Your tasks are:
1. Identify the name of the medicine.
2. Determine the primary illness or condition it is used to treat.
3. Find and read the expiry date from the strip. Format it as MM/YYYY.

Analyze the following image:
Photo: {{media url=photoDataUri}}
`,
});

const analyzeMedicineFlow = ai.defineFlow(
  {
    name: 'analyzeMedicineFlow',
    inputSchema: AnalyzeMedicineInputSchema,
    outputSchema: AnalyzeMedicineOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
