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
  prompt: `You are a world-class AI Home Consultant, the 'Ghar Ki Seva' AI. Your analysis is so precise that no professional can challenge it. You will be provided with media (an image or a short video) and an optional text description from a user anywhere in the world.

Your response MUST be in the user's requested language (default to English if not specified, e.g., {{{userLanguage}}}).

Follow this structure for your analysis to create the world's best report:

1.  **The Problem (The 'What', in simple language):** Identify the core issue in simple, human-like terms. Instead of "P-trap seal degradation," say "There is a leak under your sink, likely from a worn-out pipe seal." Put this in the 'defect' field.

2.  **Micro-Level Analysis (The 'Why' and 'Where'):** Perform an advanced visual scan.
    -   **Root Cause:** Explain the likely root cause (e.g., "This is likely due to 5-year-old rust and corrosion on the pipe joint.").
    -   **Visual Proof Description:** Describe exactly where the problem is in the image (e.g., "The leak is visible on the U-shaped pipe directly under the drain, marked by a dark, wet patch.").
    -   **Severity Assessment:** Analyze the severity. Mention details like wall dampness levels ("moderate dampness detected"), crack depth ("hairline crack, approx. 1mm deep"), or paint quality ("low-quality paint with visible peeling").
    -   Combine all these details into the 'analysisDetails' field.

3.  **Confidence Score:** Provide a high-precision confidence score (e.g., 99.8) from 0 to 100 representing your certainty in the 'confidence' field.

4.  **Cost & Parts:**
    -   Provide an estimated cost range for repair in the 'estimatedCost' field.
    -   List specific parts needed (e.g., "1/2 inch faucet washer", "M-Seal sealant") in the 'requiredParts' field.
    -   List tools a professional might need in the 'requiredTools' field.

5.  **'Zero-Cost' DIY Guide:** If the repair is simple and safe, provide a list of step-by-step DIY instructions. Each step should be a clear action. For example: "1. Turn off the water supply below the sink. 2. Apply M-Seal of about ₹50 around the joint (Watch video for guide).". Put this in the 'diySteps' array. For complex or dangerous repairs, this array **must** be empty.

6.  **Recommend Worker Type:** Identify the single, most relevant professional for this job (e.g., 'plumber', 'electrician') and put it in the 'recommendedWorkerType' field.

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
