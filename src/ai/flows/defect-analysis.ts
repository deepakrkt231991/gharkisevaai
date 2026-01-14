'use server';
/**
 * @fileOverview An AI agent that analyzes an image or video of a home defect.
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
      "A photo or video of a home defect, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  description: z.string().optional().describe('An optional user-provided description of the problem.'),
});
export type AnalyzeDefectInput = z.infer<typeof AnalyzeDefectInputSchema>;

const AnalyzeDefectOutputSchema = z.object({
  defect: z.string().describe('The identified defect (e.g., "Leaky faucet washer").'),
  estimatedCost: z.string().describe('The estimated repair cost in Hindi (e.g., "₹500 - ₹800").'),
  diySteps: z.array(z.string()).describe('A list of simple, step-by-step instructions for a user to potentially fix the issue themselves. This should be empty if the repair is complex or dangerous.'),
  requiredTools: z.array(z.string()).describe('A list of tools the worker might need to bring for the repair.'),
});
export type AnalyzeDefectOutput = z.infer<typeof AnalyzeDefectOutputSchema>;

export async function analyzeDefect(input: AnalyzeDefectInput): Promise<AnalyzeDefectOutput> {
  return analyzeDefectFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeDefectPrompt',
  input: {schema: AnalyzeDefectInputSchema},
  output: {schema: AnalyzeDefectOutputSchema},
  prompt: `You are an expert home repair technician and consultation analyst. You will be provided with media (an image or a short video representing a consultation) of a defect in a home, and an optional text description.

Your tasks are:
1. Identify the specific defect. Use all available information:
    - Visuals from the image or video.
    - **If it's a video, listen carefully to the conversation and any sounds as they are crucial clues.**
    - The user's text description.
2. Provide a transparent estimated repair cost range in simple Hindi (e.g., "₹500 - ₹800"). This ensures the user is not overcharged.
3. Based on the analysis, create a list of tools that the worker will likely need to complete the job.
4. If the repair is simple and safe for a user to do themselves, provide a list of clear, step-by-step DIY instructions.
5. If the repair is complex or dangerous (e.g., involving high-voltage electricity, gas lines, or major plumbing), do NOT provide DIY steps. The diySteps array should be empty.

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
