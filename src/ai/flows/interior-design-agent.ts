
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
      "A photo of the room, home exterior, or garden area, as a data URI that must include a MIME type and use Base64 encoding."
    ),
  userLocation: z.string().optional().describe("The user's city for localized suggestions (e.g., 'Mumbai')."),
});
export type InteriorDesignInput = z.infer<typeof InteriorDesignInputSchema>;

const InteriorDesignOutputSchema = z.object({
  suggestions: z.array(z.object({
    title: z.string().describe("The title of the suggestion, e.g., 'Directional Alignment', 'Contrast Strategy'."),
    description: z.string().describe("A detailed description of the suggestion. If relevant, include advice based on the estimated room size (e.g., 'For this 10x12 room, an L-shaped sofa is ideal.')."),
    impact: z.enum(['High', 'Medium', 'Low']).describe("The estimated impact of implementing this suggestion."),
    category: z.enum(['Vastu', 'Aesthetic', 'Lighting', 'Exterior', 'Landscaping']).describe("The category of the suggestion."),
  })).describe("A list of actionable suggestions for improving the room's layout, color scheme, decor, or the home's exterior and garden based on Vastu and modern design trends."),
  requiredWorkerTypes: z.array(z.string()).describe("A list of worker types (e.g., 'Painter', 'Carpenter', 'Gardener') needed to implement the suggestions."),
});
export type InteriorDesignOutput = z.infer<typeof InteriorDesignOutputSchema>;


export async function suggestInteriorImprovements(input: InteriorDesignInput): Promise<InteriorDesignOutput> {
  return interiorDesignFlow(input);
}

const interiorDesignPrompt = ai.definePrompt({
  name: 'interiorDesignPrompt',
  input: {schema: InteriorDesignInputSchema},
  output: {schema: InteriorDesignOutputSchema},
  prompt: `You are an expert AI interior and exterior designer and Vastu consultant for the Indian and global market. You will be provided with a photo.

Your tasks are:
1.  **Analyze the Scene:** Determine if the image shows a bedroom, living room, kitchen, or an exterior. Try to estimate the room's dimensions (e.g., "This looks like a 10x12 foot room.").
2.  **Provide Suggestions:** Based on your analysis, provide a list of actionable suggestions to improve the space. Each suggestion should have a title, description, impact level, and category.
    -   **For Interiors:** Focus on making the space look larger, more appealing, incorporating modern design trends, and following basic Vastu principles.
        - **Living Rooms/Bedrooms:** Suggest specific furniture items and layouts (e.g., "Add an L-shaped sofa in the south-west corner", "Place a round coffee table here"). Provide a simple shopping list of items.
        - **Kitchens:** Suggest improvements for layout, storage, and lighting.
        - **All Rooms:** Provide a recommended color palette (e.g., "Calm Blues and Whites").
    -   **For Exteriors:** Suggest improvements for the building's facade, landscaping, gardening, and curb appeal.
3.  **Identify Required Workers:** Based on your suggestions, list the types of skilled workers required to implement the changes (e.g., 'Painter', 'Carpenter', 'Electrician', 'Gardener'). If the user's location is provided as Mumbai, suggest "Seema's Design Studio - 9876543210".

Analyze the following scene and provide suggestions in the specified output format:
{{media url=roomPhotoUri}}
{{#if userLocation}}
User Location: {{{userLocation}}}
{{/if}}
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
