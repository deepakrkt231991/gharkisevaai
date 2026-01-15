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
  selfieDataUri: z
    .string()
    .describe(
      "A selfie photo of the worker, as a data URI that must include a MIME type and use Base64 encoding."
    ),
});
export type VerifyWorkerInput = z.infer<typeof VerifyWorkerInputSchema>;

const VerifyWorkerOutputSchema = z.object({
  verified: z.boolean().describe("True if the verification is successful, otherwise false."),
  confidence: z.number().describe("A confidence score for the verification from 0 to 100."),
  extractedName: z.string().describe("The name extracted from the ID card."),
  reasoning: z.string().describe("A brief explanation of the verification decision."),
});
export type VerifyWorkerOutput = z.infer<typeof VerifyWorkerOutputSchema>;


export async function verifyWorker(input: VerifyWorkerInput): Promise<VerifyWorkerOutput> {
  return verificationFlow(input);
}

const verificationPrompt = ai.definePrompt({
  name: 'verificationPrompt',
  input: {schema: VerifyWorkerInputSchema},
  output: {schema: VerifyWorkerOutputSchema},
  prompt: `You are a security agent for GHAR KI SEVA AI. Your job is to verify a new worker's identity.

You are given two images:
1. A photo of the worker's ID card.
2. A selfie of the worker.

Your tasks:
1.  Extract the 'Name' and 'ID Number' from the ID card.
2.  Compare the face in the ID card photo to the worker's selfie. Do they match?
3.  Assess if the ID card looks authentic. Are there signs of tampering or it being a digital fake?
4.  Based on your assessment, decide if the worker is verified.
5.  Provide a confidence score for your decision.
6.  Provide a brief reasoning for your decision (e.g., "Face matches and ID appears authentic," or "ID photo is too blurry," or "Face in selfie does not match ID photo.").

ID Card: {{media url=idCardDataUri}}
Selfie: {{media url=selfieDataUri}}
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
