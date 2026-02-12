'use server';
/**
 * @fileOverview The Gemini Content Creator - An AI agent for generating promotional content.
 *
 * - createPromotionalContent - A function to generate a promotional poster for a user.
 * - CreateContentInput - The input type for the content creation function.
 * - CreateContentOutput - The return type for the content creation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CreateContentInputSchema = z.object({
  userPhotoUri: z
    .string()
    .describe(
      "A photo of the user, as a data URI that must include a MIME type and use Base64 encoding."
    ),
  userName: z.string().describe("The name of the user."),
  referralCode: z.string().describe("The user's unique referral code (usually their user ID)."),
});
export type CreateContentInput = z.infer<typeof CreateContentInputSchema>;

const CreateContentOutputSchema = z.object({
  posterDataUri: z
    .string()
    .describe("The generated promotional poster as a data URI."),
});
export type CreateContentOutput = z.infer<typeof CreateContentOutputSchema>;


export async function createPromotionalContent(input: CreateContentInput): Promise<CreateContentOutput> {
  return contentCreatorFlow(input);
}

const contentCreatorFlow = ai.defineFlow(
  {
    name: 'contentCreatorFlow',
    inputSchema: CreateContentInputSchema,
    outputSchema: CreateContentOutputSchema,
  },
  async ({ userName, userPhotoUri, referralCode }) => {
    const referralUrl = `https://studio-6508019671-d10f2.web.app/worker-signup?ref=${referralCode}`;

    const { media } = await ai.generate({
      model: 'googleai/imagen-4.0-fast-generate-001',
      prompt: `Create a professional and eye-catching promotional poster for a user named ${userName} for the "GrihSeva AI" app. The poster is intended to be shared on WhatsApp Status to refer new users and workers.

      It must include the following text in a prominent, stylish Hindi font: "GrihSeva AI जॉइन करें और कमाएं!" (Join GrihSeva AI and Earn!)

      **Crucially, you must include a scannable QR code in the bottom right corner of the poster. This QR code must encode the following URL: ${referralUrl}**

      The design should be clean, modern, and trustworthy. Use a color palette that aligns with the app's theme (e.g., blues, greens, and a vibrant accent color). The overall tone should be professional and inviting.

      Incorporate the provided user's photo seamlessly into the design. The user should look friendly and trustworthy.
      `,
      config: {
        // You can add more configuration here if needed, like aspectRatio
      }
    });

    if (!media || !media.url) {
      throw new Error('Image generation failed.');
    }
    
    return {
      posterDataUri: media.url,
    };
  }
);
