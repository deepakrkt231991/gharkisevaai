'use server';
/**
 * @fileOverview An AI agent that analyzes an image of a home defect.
 *
 * - analyzeDefect - A function that handles the defect analysis process.
 * - AnalyzeDefectInput - The input type for the analyzeDefect function.
 * - AnalyzeDefectOutput - The return type for the analyzeDefect function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeDefectInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a home defect, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type AnalyzeDefectInput = z.infer<typeof AnalyzeDefectInputSchema>;

const AnalyzeDefectOutputSchema = z.object({
  defect: z.string().describe('The identified defect (e.g., "Leaky faucet washer").'),
  estimatedCost: z.string().describe('The estimated repair cost in Hindi (e.g., "₹500 - ₹800").'),
});
export type AnalyzeDefectOutput = z.infer<typeof AnalyzeDefectOutputSchema>;

export async function analyzeDefect(input: AnalyzeDefectInput): Promise<AnalyzeDefectOutput> {
  return analyzeDefectFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeDefectPrompt',
  input: {schema: AnalyzeDefectInputSchema},
  output: {schema: AnalyzeDefectOutputSchema},
  prompt: `You are an expert home repair technician. You will be provided with an image of a defect in a home.

Your tasks are:
1. Identify the specific defect (e.g., 'Leaky faucet washer', 'Broken switchboard').
2. Provide a transparent estimated repair cost range in simple Hindi (e.g., "₹500 - ₹800"). This ensures the user is not overcharged.

Analyze the following image:
Photo: {{media url=photoDataUri}}
`,
});

const analyzeDefectFlow = ai.defineFlow(
  {
    name: 'analyzeDefectFlow',
    inputSchema: AnalyzeDefectInputSchema,
    outputSchema: AnalyzeDefectOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
