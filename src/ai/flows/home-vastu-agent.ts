
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
  vastuSuggestions: z.array(z.string()).describe("A list of Vastu-based suggestions for improving the home's energy and layout (e.g., 'Move the bed to the south-west corner'), OR a list of tips for taking good photos."),
  videoInstructions: z.array(z.string()).describe("A list of clear, step-by-step instructions guiding the user on how to record a video for property verification or a general walkthrough."),
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
  prompt: `You are an expert AI Vastu consultant, a home verification guide, and a real estate photography/videography coach. You will be provided with a user's request, and sometimes an image of a home layout.

Your tasks are:
1.  **Photography & Videography Guide (if requested):** If the user asks for guidance on taking photos or videos for a property listing, provide two separate, clear, step-by-step lists:
    -   One list for taking high-quality photographs of a property. Include tips on lighting, angles, and what to capture. Put these tips in the \`vastuSuggestions\` output field.
    -   One list for recording a smooth and informative video walkthrough. Put these tips in the \`videoInstructions\` output field.
2.  **Vastu Analysis (if requested):** If the user asks for Vastu tips and provides a layout, analyze it. Provide actionable suggestions in the \`vastuSuggestions\` output field.
3.  **Video Verification Instructions (if requested):** If the user asks how to create a verification video, provide simple, step-by-step instructions in the \`videoInstructions\` field. The goal is to guide a non-technical user to create a clear video that can be used to verify the property's condition and layout.
4.  **Identify Required Workers:** Based on any Vastu suggestions you provide, list the types of skilled workers required to implement the changes (e.g., 'Painter', 'Carpenter', 'Electrician').

Analyze the following:
{{#if homeLayoutImageUri}}Layout Image: {{media url=homeLayoutImageUri}}{{/if}}
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

    