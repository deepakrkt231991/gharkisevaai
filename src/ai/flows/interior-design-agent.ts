
'use server';
/**
 * @fileOverview The AI Interior Designer - An agent for home aesthetics.
 *
 * - suggestInteriorImprovements - A function to suggest design improvements for a room.
 * - InteriorDesignInput - The input type for the design suggestion function.
 * - InteriorDesignOutput - The return type for the design suggestion function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const InteriorDesignInputSchema = z.object({
  roomPhotoUri: z
    .string()
    .describe(
      "A photo of the room, as a data URI that must include a MIME type and use Base64 encoding."
    ),
});
export type InteriorDesignInput = z.infer<typeof InteriorDesignInputSchema>;

const InteriorDesignOutputSchema = z.object({
  suggestions: z.array(z.object({
    title: z.string().describe("The title of the suggestion, e.g., 'Directional Alignment', 'Contrast Strategy'."),
    description: z.string().describe("A detailed description of the suggestion."),
    impact: z.enum(['High', 'Medium', 'Low']).describe("The estimated impact of implementing this suggestion."),
    category: z.enum(['Vastu', 'Aesthetic', 'Lighting']).describe("The category of the suggestion."),
  })).describe("A list of actionable suggestions for improving the room's layout, color scheme, and decor based on Vastu and modern interior design trends."),
  requiredWorkerTypes: z.array(z.string()).describe("A list of worker types (e.g., 'Painter', 'Carpenter') needed to implement the suggestions."),
});
export type InteriorDesignOutput = z.infer<typeof InteriorDesignOutputSchema>;


export async function suggestInteriorImprovements(input: InteriorDesignInput): Promise<InteriorDesignOutput> {
  return interiorDesignFlow(input);
}

const interiorDesignPrompt = ai.definePrompt({
  name: 'interiorDesignPrompt',
  input: {schema: InteriorDesignInputSchema},
  output: {schema: InteriorDesignOutputSchema},
  prompt: `You are an expert AI interior designer and Vastu consultant for the Indian market. You will be provided with a photo of a room.

Your tasks are:
1.  **Analyze the Room:** Evaluate the current layout, furniture placement, colors, and lighting.
2.  **Provide Suggestions:** Based on your analysis, provide a list of actionable suggestions to improve the room. Each suggestion should have a title, description, impact level, and category (Vastu, Aesthetic, or Lighting). These suggestions should:
    -   Make the space look larger and more appealing.
    -   Incorporate modern and trending interior design principles.
    -   Follow basic Vastu principles for positive energy flow (e.g., placement of heavy furniture, use of colors).
    -   Be practical and achievable for a typical homeowner.
3.  **Identify Required Workers:** Based on your suggestions, list the types of skilled workers required to implement the changes (e.g., 'Painter', 'Carpenter', 'Electrician').

Analyze the following room and provide suggestions in the specified output format:
{{media url=roomPhotoUri}}
`,
});

const interiorDesignFlow = ai.defineFlow(
  {
    name: 'interiorDesignFlow',
    inputSchema: InteriorDesignInputSchema,
    outputSchema: InteriorDesignOutputSchema,
  },
  async input => {
    const {output} = await interiorDesignPrompt(input);
    return output!;
  }
);
