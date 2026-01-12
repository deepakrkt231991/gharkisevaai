'use server';
/**
 * @fileOverview An AI agent that provides basic medical advice.
 *
 * - getMedicalAdvice - A function that provides advice based on a health concern.
 * - GetMedicalAdviceInput - The input type for the getMedicalAdvice function.
 * - GetMedicalAdviceOutput - The return type for the getMedicalAdvice function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GetMedicalAdviceInputSchema = z.object({
  concern: z
    .string()
    .describe('The user\'s health concern or question.'),
});
export type GetMedicalAdviceInput = z.infer<typeof GetMedicalAdviceInputSchema>;

const GetMedicalAdviceOutputSchema = z.object({
  advice: z.string().describe('The generated medical advice.'),
});
export type GetMedicalAdviceOutput = z.infer<typeof GetMedicalAdviceOutputSchema>;

export async function getMedicalAdvice(input: GetMedicalAdviceInput): Promise<GetMedicalAdviceOutput> {
  return getMedicalAdviceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'getMedicalAdvicePrompt',
  input: {schema: GetMedicalAdviceInputSchema},
  output: {schema: GetMedicalAdviceOutputSchema},
  prompt: `You are a helpful AI medical assistant. Your role is to provide safe, general, and preliminary advice based on a user's health concern.

IMPORTANT: You MUST always include the following disclaimer at the very beginning of your response, on its own line:
"DISCLAIMER: This is AI-generated advice and should not be considered a substitute for professional medical consultation. Please see a doctor for a proper diagnosis and treatment."

After the disclaimer, provide a helpful and safe response to the user's concern. Do not provide specific diagnoses or prescribe any medication. Focus on general well-being tips, when to see a doctor, and safe home remedies if applicable.

User's concern: {{{concern}}}
`,
  // It's a good practice to use a model that is fine-tuned for medical queries if available.
  // For this example, we'll stick to the default model but with a very strict prompt.
  // In a real-world scenario, you would use a model like Med-Gemini.
  model: 'googleai/gemini-2.5-flash',
});

const getMedicalAdviceFlow = ai.defineFlow(
  {
    name: 'getMedicalAdviceFlow',
    inputSchema: GetMedicalAdviceInputSchema,
    outputSchema: GetMedicalAdviceOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
