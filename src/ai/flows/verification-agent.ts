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
  prompt: `तुम GrihSevaAI के सुरक्षा एजेंट हो। 
1. ID कार्ड से 'Name' और 'ID Number' निकालो।
2. ID कार्ड की फोटो को वर्कर की सेल्फी से मैच करो।
3. क्या यह ID असली लग रही है?
4. अपने निर्णय के लिए एक संक्षिप्त कारण प्रदान करो।

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
