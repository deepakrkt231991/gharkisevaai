'use server';
/**
 * @fileOverview An AI agent that analyzes an image or video of a home defect or item.
 *
 * - analyzeDefect - A function that handles the defect analysis process.
 * - AnalyzeDefectInput - The input type for the analyzeDefect function.
 * - AnalyzeDefectOutput - The return type for the analyzeDefect function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeDefectInputSchema = z.object({
  mediaDataUri: z
    .string()
    .describe(
      "A photo or video of a home defect or an item for sale, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  description: z.string().optional().describe('An optional user-provided description of the problem or item.'),
});
export type AnalyzeDefectInput = z.infer<typeof AnalyzeDefectInputSchema>;

const AnalyzeDefectOutputSchema = z.object({
  defect: z.string().describe('The identified defect (e.g., "Leaky faucet washer") or the item being listed (e.g., "Used 24-inch Television").'),
  estimatedCost: z.string().describe('The estimated repair cost in Hindi (e.g., "₹500 - ₹800") or the suggested resale market value if it\'s an item for sale.'),
  diySteps: z.array(z.string()).describe('A list of simple, step-by-step instructions for a user to potentially fix the issue themselves. This should be empty if the repair is complex, dangerous, or if it is an item for sale.'),
  requiredTools: z.array(z.string()).describe('A list of tools the worker might need to bring for the repair.'),
  requiredParts: z.array(z.string()).describe('A list of specific parts that might be needed for the repair (e.g., "1/2 inch faucet washer", "TV Capacitor Model 25v 1000uF"). This can also be used to list key components of an item for sale.'),
});
export type AnalyzeDefectOutput = z.infer<typeof AnalyzeDefectOutputSchema>;

export async function analyzeDefect(input: AnalyzeDefectInput): Promise<AnalyzeDefectOutput> {
  return analyzeDefectFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeDefectPrompt',
  input: {schema: AnalyzeDefectInputSchema},
  output: {schema: AnalyzeDefectOutputSchema},
  prompt: `You are an expert home repair technician and used-item market value estimator for the Indian market. You will be provided with media (an image or a short video) and an optional text description.

Your tasks are:
1.  **Identify the specific defect OR the item being listed.** Use all available information.
2.  **Provide an estimated cost OR a market value.**
    -   If it's a defect, provide a transparent estimated repair cost range in simple Hindi (e.g., "₹500 - ₹800"). This should include labor and parts.
    -   If it's an item for sale, suggest a reasonable resale market value based on its condition.
3.  **Create a list of specific parts.**
    -   For repairs: List parts needed (e.g., "1/2 inch faucet washer," "TV Capacitor Model 25v 1000uF").
    -   For items for sale: List key components or specifications.
4.  **Create a list of tools** needed for a repair. This should be empty for items for sale.
5.  **Provide DIY steps if the repair is simple and safe.** If the repair is complex, dangerous, or it's an item for sale, the diySteps array should be empty.

Analyze the following:
Media: {{media url=mediaDataUri}}
{{#if description}}
User Description: {{{description}}}
{{/if}}
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
