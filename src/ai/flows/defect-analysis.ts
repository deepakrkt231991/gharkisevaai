'use server';
/**
 * @fileOverview An AI agent that analyzes an image or video of a home defect or item.
 *
 * - analyzeDefect - A function that handles the defect analysis process.
 * - AnalyzeDefectInput - The input type for the analyzeDefect function.
 * - AnalyzeDefectOutput - The return type for the analyzeDefect function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const AnalyzeDefectInputSchema = z.object({
  mediaDataUri: z
    .string()
    .describe(
      "A photo or video of a home defect or an item for sale, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  description: z.string().optional().describe('An optional user-provided description of the problem or item.'),
  userLanguage: z.string().optional().describe('The preferred language for the response (e.g., "Hindi", "Spanish"). Defaults to English.'),
});
export type AnalyzeDefectInput = z.infer<typeof AnalyzeDefectInputSchema>;

const AnalyzeDefectOutputSchema = z.object({
  defect: z.string().describe('The identified defect (e.g., "Leaky faucet washer") or the item being listed (e.g., "Used 24-inch Television"), explained in simple, human-like language.'),
  analysisDetails: z.string().describe("A micro-level analysis of the issue, detailing things like crack depth, dampness levels, or paint quality."),
  confidence: z.number().describe("A confidence score (from 0 to 100) for the accuracy of the defect identification."),
  estimatedCost: z.string().describe('The estimated repair cost (e.g., "₹500 - ₹800") or the suggested resale market value if it\'s an item for sale.'),
  diySteps: z.array(z.string()).describe('A list of simple, step-by-step DIY instructions for a user to potentially fix the issue themselves. Each step should be a clear action. This should be an empty array if the repair is complex, dangerous, or if it is an item for sale.'),
  requiredTools: z.array(z.string()).describe('A list of tools the worker might need to bring for the repair.'),
  requiredParts: z.array(z.string()).describe('A list of specific parts that might be needed for the repair (e.g., "1/2 inch faucet washer", "TV Capacitor Model 25v 1000uF"). This can also be used to list key components of an item for sale.'),
  recommendedWorkerType: z.string().describe("The single, most relevant type of worker for this job (e.g., 'plumber', 'electrician', 'painter')."),
});
export type AnalyzeDefectOutput = z.infer<typeof AnalyzeDefectOutputSchema>;

export async function analyzeDefect(input: AnalyzeDefectInput): Promise<AnalyzeDefectOutput> {
  return analyzeDefectFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeDefectPrompt',
  input: {schema: AnalyzeDefectInputSchema},
  output: {schema: AnalyzeDefectOutputSchema},
  prompt: `You are a world-class AI Home Consultant. Your analysis is so precise that no professional can challenge it. You will be provided with media (an image or a short video) and an optional text description from a user anywhere in the world.

Your response MUST be in the user's requested language (default to English if not specified).

Your tasks are:
1.  **Universal Language Analysis:** Respond in the user's language ({{{userLanguage}}}). The 'defect' description MUST be in simple, human-like terms. For example, instead of "P-trap seal degradation," say "There is a leak under your sink, likely from a worn-out pipe seal."
2.  **Advanced Visual Reasoning:** Perform a micro-level scan. Identify the specific defect or item. If it's a defect, analyze its severity. Mention details like wall dampness levels (e.g., "moderate dampness detected on the lower wall"), crack depth ("hairline crack, approximately 1mm deep"), or paint quality ("low-quality paint with visible peeling"). Put this detailed analysis in the 'analysisDetails' field.
3.  **Provide a confidence score (0-100)** representing your certainty.
4.  **Provide an estimated cost** range for repair or a resale market value.
5.  **List specific parts** needed for the repair or key components of an item for sale.
6.  **List tools** a professional might need.
7.  **Recommend Worker Type:** Identify the single, most appropriate professional for this job (e.g., 'plumber', 'electrician', 'painter', 'carpenter') and put it in the 'recommendedWorkerType' field.
8.  **Provide Smart DIY Steps:** If the repair is simple and safe (like tightening a screw), provide a list of step-by-step DIY instructions. For complex or dangerous repairs, the diySteps array **must** be empty.

Analyze the following:
Media: {{media url=mediaDataUri}}
User's Preferred Language: {{{userLanguage}}}
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
