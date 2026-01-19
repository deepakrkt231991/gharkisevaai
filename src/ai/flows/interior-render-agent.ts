
'use server';
/**
 * @fileOverview The AI 3D Renderer - An agent for generating photorealistic interior renders.
 *
 * - generateInteriorRender - A function to generate a 3D render of a room.
 * - InteriorRenderInput - The input type for the render generation function.
 * - InteriorRenderOutput - The return type for the render generation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const InteriorRenderInputSchema = z.object({
  roomPhotoUri: z
    .string()
    .describe(
      "The original photo of the room, as a data URI."
    ),
  suggestions: z.array(z.object({
    title: z.string(),
    description: z.string(),
    impact: z.enum(['High', 'Medium', 'Low']),
    category: z.enum(['Vastu', 'Aesthetic', 'Lighting']),
  })).describe("A list of improvement suggestions."),
  style: z.string().optional().describe("The desired interior design style, e.g., 'Modern', 'Classic', 'Minimalist'."),
});
export type InteriorRenderInput = z.infer<typeof InteriorRenderInputSchema>;

const InteriorRenderOutputSchema = z.object({
  renderDataUri: z
    .string()
    .describe("The generated 3D render as a data URI."),
});
export type InteriorRenderOutput = z.infer<typeof InteriorRenderOutputSchema>;


export async function generateInteriorRender(input: InteriorRenderInput): Promise<InteriorRenderOutput> {
  return interiorRenderFlow(input);
}

// Convert suggestions array to a readable string for the prompt
const formatSuggestions = (suggestions: InteriorRenderInput['suggestions']): string => {
  return suggestions.map(s => `- ${s.title} (${s.category}): ${s.description}`).join('\n');
};

const interiorRenderFlow = ai.defineFlow(
  {
    name: 'interiorRenderFlow',
    inputSchema: InteriorRenderInputSchema,
    outputSchema: InteriorRenderOutputSchema,
  },
  async ({ roomPhotoUri, suggestions, style }) => {
    const suggestionsText = formatSuggestions(suggestions);
    const styleText = style ? `Apply a **${style}** design style.` : '';

    const { media } = await ai.generate({
      model: 'googleai/gemini-1.5-flash-latest',
      prompt: [
        { media: { url: roomPhotoUri } },
        { text: `Based on the provided image of a room and the following design suggestions, generate a new, photorealistic 3D render of the improved room. The render should look like a professionally designed space, incorporating the suggested changes.

        ${styleText}

        **Design Suggestions:**
        ${suggestionsText}

        The final output should be a high-quality, aspirational image showing the potential of the space.` },
      ],
      config: {
        responseModalities: ['TEXT', 'IMAGE'],
      }
    });

    if (!media || !media.url) {
      throw new Error('3D Render generation failed. The model did not return an image.');
    }
    
    return {
      renderDataUri: media.url,
    };
  }
);
