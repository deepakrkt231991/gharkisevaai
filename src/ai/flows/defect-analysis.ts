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
  estimatedCost: z.object({
      total: z.string().describe("The total estimated cost range, e.g., '₹20,000 - ₹25,000'."),
      material: z.string().describe("The estimated cost for materials, e.g., '₹15,000'."),
      labor: z.string().describe("The estimated cost for labor, e.g., '₹5,000'.")
  }).describe("A detailed breakdown of the estimated costs."),
  diySteps: z.array(z.string()).describe('A list of simple, step-by-step DIY instructions for a user to potentially fix the issue themselves. Each step should be a clear action. This should be an empty array if the repair is complex, dangerous, or if it is an item for sale.'),
  requiredTools: z.array(z.string()).describe('A list of tools the worker might need to bring for the repair.'),
  requiredParts: z.array(z.string()).describe('A list of specific parts that might be needed for the repair (e.g., "1/2 inch faucet washer", "TV Capacitor Model 25v 1000uF"). This can also be used to list key components of an item for sale.'),
  recommendedWorkerType: z.string().describe("The single, most relevant type of worker for this job (e.g., 'plumber', 'electrician', 'painter')."),
  materialSuggestions: z.array(z.string()).describe("Recommendations for specific materials based on the problem, e.g., 'Use waterproof paint for damp areas.'"),
});
export type AnalyzeDefectOutput = z.infer<typeof AnalyzeDefectOutputSchema>;

export async function analyzeDefect(input: AnalyzeDefectInput): Promise<AnalyzeDefectOutput> {
  return analyzeDefectFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeDefectPrompt',
  input: {schema: AnalyzeDefectInputSchema},
  output: {schema: AnalyzeDefectOutputSchema},
  prompt: `You are an expert Home Repair AI Consultant, creating a viral Instagram Reels-style analysis of a home defect. Your tone is fast, modern, and direct. Use emojis where appropriate.

You will be provided with media (an image or video) of a home defect. Your task is to analyze it and provide a report in the specified JSON format.

1.  **DAMAGE ANALYSIS 🔬:**
    *   Analyze the image and identify all issues like peeling plaster, loose paint, moisture stains, cracks, etc.
    *   For the 'defect' field, give a short title like "Wall Dampness & Peeling Paint".
    *   For the 'analysisDetails' field, describe where the damage is. E.g., "⚠️ Found peeling plaster in the top-left corner and signs of moisture damage near the floor."

2.  **REPAIR STEPS & MATERIALS 🛠️:**
    *   Provide a numbered, step-by-step guide for the repair in the 'diySteps' field. Be specific. For wall repairs, suggest: "Step 1: Scrape all loose plaster & paint.", "Step 2: Apply a thick coat of JK Wall Putty.", "Step 3: Use Asian Paints Damp Proof primer before final paint."
    *   List specific materials like "JK Wall Putty" or "Asian Paints Damp Proof" in the 'requiredParts' array.
    *   Provide extra tips in the 'materialSuggestions' array, like "Ensure the wall is completely dry before applying putty."
    *   'diySteps' should be empty if the repair is complex or dangerous.

3.  **COST & BOOKING 💰:**
    *   Calculate the estimated cost for materials and labor in Indian Rupees (₹). Provide this in the 'estimatedCost' object. Be realistic.
    *   Recommend the best type of professional for the job (e.g., 'Painter', 'Plumber') in the 'recommendedWorkerType' field.

4.  **CONFIDENCE SCORE 🤖:**
    *   Provide a confidence score for your analysis in the 'confidence' field.

Your response MUST be in the user's requested language (default to English, e.g., {{{userLanguage}}}).

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
