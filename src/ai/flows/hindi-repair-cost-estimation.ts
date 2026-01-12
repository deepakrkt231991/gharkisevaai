'use server';

/**
 * @fileOverview Estimates the repair cost in Hindi based on an image of the defect.
 *
 * - estimateRepairCostInHindi - A function that handles the repair cost estimation process.
 * - EstimateRepairCostInHindiInput - The input type for the estimateRepairCostInHindi function.
 * - EstimateRepairCostInHindiOutput - The return type for the estimateRepairCostInHindi function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const EstimateRepairCostInHindiInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of the defect, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  defectDescription: z.string().describe('The description of the defect.'),
});
export type EstimateRepairCostInHindiInput = z.infer<
  typeof EstimateRepairCostInHindiInputSchema
>;

const EstimateRepairCostInHindiOutputSchema = z.object({
  repairEstimateHindi: z
    .string()
    .describe('The repair estimate in Hindi, including details and costs.'),
});
export type EstimateRepairCostInHindiOutput = z.infer<
  typeof EstimateRepairCostInHindiOutputSchema
>;

export async function estimateRepairCostInHindi(
  input: EstimateRepairCostInHindiInput
): Promise<EstimateRepairCostInHindiOutput> {
  return estimateRepairCostInHindiFlow(input);
}

const prompt = ai.definePrompt({
  name: 'estimateRepairCostInHindiPrompt',
  input: {schema: EstimateRepairCostInHindiInputSchema},
  output: {schema: EstimateRepairCostInHindiOutputSchema},
  prompt: `You are a home repair cost estimation expert.

You will be provided with a description of the defect and an image of the defect.

Based on this information, you will estimate the repair cost in Hindi, including details and costs.

Description: {{{defectDescription}}}
Photo: {{media url=photoDataUri}}

Estimate in Hindi:`,
});

const estimateRepairCostInHindiFlow = ai.defineFlow(
  {
    name: 'estimateRepairCostInHindiFlow',
    inputSchema: EstimateRepairCostInHindiInputSchema,
    outputSchema: EstimateRepairCostInHindiOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
