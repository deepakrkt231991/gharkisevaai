
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
      "A photo or video of a home defect or an item for sale, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'"
    ),
  description: z.string().optional().describe('An optional user-provided description of the problem or item.'),
  userLanguage: z.string().optional().describe('The preferred language for the response (e.g., "Hindi", "Spanish"). Defaults to English.'),
  userLocation: z.string().optional().describe("The user's city to provide localized results (e.g., 'Mumbai')."),
});
export type AnalyzeDefectInput = z.infer<typeof AnalyzeDefectInputSchema>;

const AnalyzeDefectOutputSchema = z.object({
  damage: z.array(z.string()).describe("List of identified damages, like 'Peeling plaster🔴'"),
  steps: z.array(z.string()).describe("Numbered repair steps with materials and Mumbai-based prices, e.g., '1. JK WallPutty ₹800'"),
  total_cost: z.string().describe("Total estimated cost for the repair, e.g., '₹3500'"),
  painter: z.string().describe("Contact information for a recommended local painter, e.g., 'Raju Painter - 9876543210'"),
  ai_design: z.string().describe("Filename of a demo image showing the after state, e.g., 'smooth_green_wall.jpg'").optional(),
  recommendedWorkerType: z.string().describe("The single, most relevant type of worker for this job (e.g., 'painter')."),
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
You are an expert Home Repair AI Consultant for India. Analyze the uploaded wall photo.

1.  **DAMAGE ANALYSIS:** Identify issues like peeling plaster. Respond with markers like "Peeling plaster🔴".
2.  **REPAIR STEPS:** Provide a 3-step numbered guide with specific materials and estimated prices. If the user's location is Mumbai, you MUST use Mumbai-based prices and include "JK WallPutty", "AsianPaints Primer", and a "Green paint" step with prices. Otherwise, use general prices.
3.  **COSTING:** Calculate a total cost based on the steps.
4.  **AI DESIGN IMAGE:** Set the 'ai_design' field to "smooth_green_wall.jpg".
5.  **BOOKING:** If the user's location is Mumbai, provide contact details for a fictional Mumbai painter named 'Raju Painter'. Otherwise, state that local professionals are available.
6.  **WORKER TYPE:** Identify the primary worker type needed. For wall issues, it is always 'painter'.

You MUST respond in the exact JSON format specified in the output schema. NEVER output plain text.

Analyze the following:
Media: {{media url=mediaDataUri}}
{{#if userLocation}}
User Location: {{{userLocation}}}
{{/if}}
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
