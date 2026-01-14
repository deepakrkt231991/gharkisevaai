'use server';
/**
 * @fileOverview The Guardian - An AI agent for trust and verification.
 *
 * - verifyWorker - A function to verify a worker's identity using their documents.
 * - VerifyWorkerInput - The input type for the verification function.
 * - VerifyWorkerOutput - The return type for the verification function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const VerifyWorkerInputSchema = z.object({
  idCardDataUri: z
    .string()
    .describe(
      "A photo of the worker's ID card (e.g., Aadhaar, PAN), as a data URI that must include a MIME type and use Base64 encoding."
    ),
});
export type VerifyWorkerInput = z.infer<typeof VerifyWorkerInputSchema>;

const VerifyWorkerOutputSchema = z.object({
  isIdValid: z.boolean().describe('Whether the uploaded document appears to be a valid ID card.'),
  extractedName: z.string().optional().describe("The full name extracted from the ID card."),
  extractedIdNumber: z.string().optional().describe("The ID number (e.g., Aadhaar or PAN number) extracted from the card."),
  verificationNotes: z.string().describe("Notes from the AI about the verification process, e.g., 'Image is blurry' or 'Successfully extracted details'."),
});
export type VerifyWorkerOutput = z.infer<typeof VerifyWorkerOutputSchema>;


export async function verifyWorker(input: VerifyWorkerInput): Promise<VerifyWorkerOutput> {
  return verificationFlow(input);
}

const verificationPrompt = ai.definePrompt({
  name: 'verificationPrompt',
  input: {schema: VerifyWorkerInputSchema},
  output: {schema: VerifyWorkerOutputSchema},
  prompt: `You are a verification agent for a home services app. Your task is to analyze the provided image of an ID card (like Aadhaar or PAN card from India).

Your goals are:
1.  Determine if the image is a valid, government-issued ID card.
2.  Extract the full name of the person.
3.  Extract the ID number (Aadhaar number or PAN number).
4.  Provide brief notes on the process, especially if the image quality is poor or details are unclear.

Analyze the following ID card image:
Media: {{media url=idCardDataUri}}
`,
});

const verificationFlow = ai.defineFlow(
  {
    name: 'verificationFlow',
    inputSchema: VerifyWorkerInputSchema,
    outputSchema: VerifyWorkerOutputSchema,
  },
  async input => {
    const {output} = await verificationPrompt(input);
    return output!;
  }
);
