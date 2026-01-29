'use server';
/**
 * @fileOverview The Gemini Content Creator - An AI agent for generating promotional content.
 *
 * - createPromotionalContent - A function to generate a promotional poster for a worker.
 * - CreateContentInput - The input type for the content creation function.
 * - CreateContentOutput - The return type for the content creation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CreateContentInputSchema = z.object({
  workerPhotoUri: z
    .string()
    .describe(
      "A photo of the worker, as a data URI that must include a MIME type and use Base64 encoding."
    ),
  workerName: z.string().describe("The name of the worker."),
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
  async ({ workerName, workerPhotoUri, referralCode }) => {
    const referralUrl = `https://studio-6508019671-d10f2.web.app/worker-signup?ref=${referralCode}`;

    const { media } = await ai.generate({
      model: 'googleai/imagen-4.0-fast-generate-001',
      prompt: `Create a professional and eye-catching promotional poster for a verified home service worker named ${workerName} for the "GrihSeva AI" app. The poster is intended to be shared on WhatsApp Status.

      It must include the following text in a prominent, stylish Hindi font: "मैं GrihSeva AI पर वेरिफाइड वर्कर हूँ, मुझे जॉइन करें!"

      **Crucially, you must include a scannable QR code in the bottom right corner of the poster. This QR code must encode the following URL: ${referralUrl}**

      The design should be clean, modern, and trustworthy. Use a color palette that aligns with home services (e.g., blues, greens, oranges). The overall tone should be professional and inviting.

      Incorporate the provided worker's photo seamlessly into the design. The worker should look friendly and competent.
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
