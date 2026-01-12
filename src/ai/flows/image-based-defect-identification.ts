'use server';
/**
 * @fileOverview An AI agent that identifies home defects from images and estimates repair costs.
 *
 * - imageBasedDefectIdentification - A function that handles the image-based defect identification process.
 * - ImageBasedDefectIdentificationInput - The input type for the imageBasedDefectIdentification function.
 * - ImageBasedDefectIdentificationOutput - The return type for the imageBasedDefectIdentification function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ImageBasedDefectIdentificationInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a home defect, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type ImageBasedDefectIdentificationInput = z.infer<typeof ImageBasedDefectIdentificationInputSchema>;

const ImageBasedDefectIdentificationOutputSchema = z.object({
  defectIdentification: z.string().describe('The identified defect.'),
  estimatedRepairCost: z.string().describe('The estimated repair cost in Hindi.'),
});
export type ImageBasedDefectIdentificationOutput = z.infer<typeof ImageBasedDefectIdentificationOutputSchema>;

export async function imageBasedDefectIdentification(input: ImageBasedDefectIdentificationInput): Promise<ImageBasedDefectIdentificationOutput> {
  return imageBasedDefectIdentificationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'imageBasedDefectIdentificationPrompt',
  input: {schema: ImageBasedDefectIdentificationInputSchema},
  output: {schema: ImageBasedDefectIdentificationOutputSchema},
  prompt: `You are an expert home inspector specializing in identifying home defects and estimating repair costs in Hindi.

You will use the following information to identify the defect and estimate the repair cost in Hindi.

Photo: {{media url=photoDataUri}}

Identify the defect and estimate the repair cost in Hindi.
`,
});

const imageBasedDefectIdentificationFlow = ai.defineFlow(
  {
    name: 'imageBasedDefectIdentificationFlow',
    inputSchema: ImageBasedDefectIdentificationInputSchema,
    outputSchema: ImageBasedDefectIdentificationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
