'use server';
/**
 * @fileOverview The Hype Man - An AI agent for generating social sharing content after a sale.
 *
 * - createSalePoster - A function to generate a "Just Sold" poster.
 * - CreateSalePosterInput - The input type for the function.
 * - CreateSalePosterOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CreateSalePosterInputSchema = z.object({
  itemName: z.string().describe("The name of the item that was sold (e.g., 'AC', 'Old Fridge')."),
  sellerName: z.string().describe("The name of the person who sold the item."),
});
export type CreateSalePosterInput = z.infer<typeof CreateSalePosterInputSchema>;

const CreateSalePosterOutputSchema = z.object({
  posterDataUri: z
    .string()
    .describe("The generated 'Just Sold' poster as a data URI."),
});
export type CreateSalePosterOutput = z.infer<typeof CreateSalePosterOutputSchema>;


export async function createSalePoster(input: CreateSalePosterInput): Promise<CreateSalePosterOutput> {
  return salePosterFlow(input);
}

const salePosterFlow = ai.defineFlow(
  {
    name: 'salePosterFlow',
    inputSchema: CreateSalePosterInputSchema,
    outputSchema: CreateSalePosterOutputSchema,
  },
  async ({ itemName, sellerName }) => {
    const { media } = await ai.generate({
      model: 'googleai/imagen-4.0-fast-generate-001',
      prompt: `Create a fun, exciting, and celebratory poster image meant to be shared on WhatsApp Status. The poster should announce that a user has just sold an item on the "GrihSeva AI" app.

      It must include the following text in a prominent, stylish, and celebratory Hindi font: "Yesss! मैंने अभी-अभी GrihSeva AI पर अपना ${itemName} बेच दिया!"

      Also include the seller's name, "${sellerName}", somewhere on the poster in a smaller, clean font.

      The design should be vibrant, eye-catching, and convey a sense of success and happiness. Use bright, positive colors. You can include celebratory graphics like confetti or stars. The overall tone should be exciting and make others curious about the app.
      `,
    });

    if (!media || !media.url) {
      throw new Error('Image generation failed.');
    }
    
    return {
      posterDataUri: media.url,
    };
  }
);
