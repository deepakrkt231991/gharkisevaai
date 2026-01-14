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
  workerProvidedName: z.string().describe("The name the worker provided in the signup form."),
  workerProvidedIdNumber: z.string().optional().describe("The ID number the worker provided, if any."),
});
export type VerifyWorkerInput = z.infer<typeof VerifyWorkerInputSchema>;

const VerifyWorkerOutputSchema = z.object({
  status: z.enum(['Verified', 'Rejected']).describe("The final verification status."),
  verificationNotes: z.string().describe("Notes from the AI about the verification process, e.g., 'ID photo is blurry' or 'Name and ID number match.'"),
});
export type VerifyWorkerOutput = z.infer<typeof VerifyWorkerOutputSchema>;


export async function verifyWorker(input: VerifyWorkerInput): Promise<VerifyWorkerOutput> {
  return verificationFlow(input);
}

const verificationPrompt = ai.definePrompt({
  name: 'verificationPrompt',
  input: {schema: VerifyWorkerInputSchema},
  output: {schema: VerifyWorkerOutputSchema},
  prompt: `तुम GrihSevaAI के सिक्योरिटी ऑफिसर हो। इस अपलोड की गई ID फोटो से नाम, जन्म तिथि और ID नंबर निकालो। इसे वर्कर द्वारा दिए गए डेटा (workerProvidedName: {{{workerProvidedName}}}) से मैच करो। यदि फोटो धुंधली है या ID जाली लगती है, तो 'Status: Rejected' लौटाओ, वरना 'Status: Verified'।

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
