'use server';
/**
 * @fileOverview The Vastu Visionary - An AI agent for home harmony and aesthetics.
 *
 * - analyzeHomeForVastu - A function to analyze a home layout for Vastu compliance and suggest improvements.
 * - HomeVastuInput - The input type for the analysis function.
 * - HomeVastuOutput - The return type for the analysis function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const HomeVastuInputSchema = z.object({
  homeLayoutImageUri: z
    .string()
    .describe(
      "An image of the home's floor plan or layout, as a data URI."
    ),
  userInstructions: z.string().describe("Specific user requests, like 'Guide me on how to take a video for verification' or 'Check Vastu for my kitchen'.")
});
export type HomeVastuInput = z.infer<typeof HomeVastuInputSchema>;

const HomeVastuOutputSchema = z.object({
  vastuSuggestions: z.array(z.string()).describe("A list of Vastu-based suggestions for improving the home's energy and layout (e.g., 'Move the bed to the south-west corner')."),
  videoInstructions: z.array(z.string()).describe("A list of clear, step-by-step instructions guiding the user on how to record a video for property verification (e.g., '1. Start from the main entrance and show the entire hall. 2. Slowly walk into the kitchen, showing all appliances.')."),
  requiredWorkerTypes: z.array(z.string()).describe("A list of worker types (e.g., 'Painter', 'Carpenter') needed to implement the Vastu suggestions."),
});
export type HomeVastuOutput = z.infer<typeof HomeVastuOutputSchema>;


export async function analyzeHomeForVastu(input: HomeVastuInput): Promise<HomeVastuOutput> {
  return homeVastuFlow(input);
}

const homeVastuPrompt = ai.definePrompt({
  name: 'homeVastuPrompt',
  input: {schema: HomeVastuInputSchema},
  output: {schema: HomeVastuOutputSchema},
  prompt: `You are an expert AI Vastu consultant and a helpful home verification guide. You will be provided with an image of a home layout and a user's request.

Your tasks are:
1.  **Analyze for Vastu (if requested):** If the user asks for Vastu tips, analyze the layout. Provide actionable suggestions to improve the home's energy flow based on Vastu Shastra.
2.  **Provide Video Instructions (if requested):** If the user asks how to create a verification video, provide simple, step-by-step instructions. The goal is to guide a non-technical user to create a clear video that can be used to verify the property's condition and layout. The instructions should be tailored to a typical home.
3.  **Identify Required Workers:** Based on any Vastu suggestions you provide, list the types of skilled workers required to implement the changes (e.g., 'Painter', 'Carpenter', 'Electrician').

Analyze the following:
Layout Image: {{media url=homeLayoutImageUri}}
User's Request: {{{userInstructions}}}
`,
});

const homeVastuFlow = ai.defineFlow(
  {
    name: 'homeVastuFlow',
    inputSchema: HomeVastuInputSchema,
    outputSchema: HomeVastuOutputSchema,
  },
  async input => {
    const {output} = await homeVastuPrompt(input);
    return output!;
  }
);
