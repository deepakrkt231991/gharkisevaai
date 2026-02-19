
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
  damage: z.array(z.string()).describe("List of identified damages, like 'Peeling plaster (left side)', 'Moisture damage (bottom)'"),
  steps: z.array(z.string()).describe("Numbered repair steps with materials and Mumbai-based prices, e.g., '1. JK WallPutty ₹800'"),
  total_cost: z.string().describe("Total estimated cost for the repair, e.g., '₹3500'"),
  painter: z.string().describe("Contact information for a recommended local painter, e.g., 'Raju Painter - 9876543210'"),
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
  prompt: `🚨 STRICT INSTRUCTIONS 🚨
You are an expert Home Repair AI Consultant for Mumbai, India. Analyze the uploaded wall photo.

1.  **DAMAGE ANALYSIS:** Identify all issues like peeling plaster and moisture damage. Describe their location briefly.
2.  **REPAIR STEPS:** Provide a 3-step numbered guide with specific materials and estimated prices for Mumbai. You must include:
    - Step 1: Scraping and preparation.
    - Step 2: Application of JK Wall Putty.
    - Step 3: Application of AsianPaints Primer and a final green paint.
3.  **COSTING:** Calculate a total cost based on the steps.
4.  **BOOKING:** Provide contact details for a fictional local Mumbai painter named 'Raju Painter'.
5.  **WORKER TYPE:** Identify the primary worker type needed, e.g., 'painter'.

You MUST respond in the exact JSON format specified in the output schema. NEVER output plain text.
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
