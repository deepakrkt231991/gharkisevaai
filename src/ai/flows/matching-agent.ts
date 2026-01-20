'use server';
/**
 * @fileOverview The Matchmaker - An AI agent for finding the right worker.
 *
 * - findAndMatchWorker - A function that analyzes a defect and finds a suitable worker.
 * - MatchWorkerInput - The input type for the matching function.
 * - MatchWorkerOutput - The return type for the matching function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {findVerifiedWorkers} from '@/services/worker-service';

const MatchWorkerInputSchema = z.object({
  mediaDataUri: z
    .string()
    .describe(
      "A photo or video of a home defect, as a data URI that must include a MIME type and use Base64 encoding."
    ),
  userLocation: z.string().describe("The user's current location (e.g., 'Delhi, India') to find nearby workers."),
});
export type MatchWorkerInput = z.infer<typeof MatchWorkerInputSchema>;

const MatchWorkerOutputSchema = z.object({
  diagnosis: z.string().describe('The identified defect (e.g., "Leaky faucet washer").'),
  recommendedWorkerId: z.string().optional().describe("The ID of the most suitable worker found."),
  reasoning: z.string().describe("The reasoning behind the recommendation or why no worker was found."),
});
export type MatchWorkerOutput = z.infer<typeof MatchWorkerOutputSchema>;

export async function findAndMatchWorker(input: MatchWorkerInput): Promise<MatchWorkerOutput> {
  return matchingFlow(input);
}

const matchingPrompt = ai.definePrompt({
  name: 'matchingPrompt',
  input: {schema: MatchWorkerInputSchema},
  output: {schema: MatchWorkerOutputSchema},
  tools: [findVerifiedWorkers],
  prompt: `You are an AI assistant for a home repair app, acting as a User-Focused Worker Matcher. Your goal is to diagnose a problem from an image and recommend the most trustworthy and best-rated worker for the job.

1.  **Diagnose the Problem:** First, analyze the image to understand the required skill (e.g., 'plumber', 'electrician').
2.  **Find Workers:** Use the \`findVerifiedWorkers\` tool to get a list of available workers near the user's location who have the required skill.
3.  **Calculate Trust Score:** For each worker, evaluate their profile to create a "Trust Score". A higher score is better. Consider these factors, in order of importance:
    *   **User Rating:** A high rating (closer to 5) is the most important factor.
    *   **Successful Orders:** More completed jobs indicate experience and reliability.
    *   **Certifications & Licenses:** \`certificationsUploaded\` or \`shopLicenseUploaded\` being true are strong positive signals.
4.  **Recommend the Best:** Select the worker with the highest "Trust Score".
5.  **Output:** Provide the ID of the recommended worker and a brief, clear reasoning for your choice, mentioning why they are the most trustworthy option (e.g., "Recommended due to excellent user ratings and having a shop license.").
6.  **No Suitable Worker:** If no suitable worker is found (e.g., no one with the right skill is available), explain why.

Problem Media: {{media url=mediaDataUri}}
User Location: {{{userLocation}}}
`,
});

const matchingFlow = ai.defineFlow(
  {
    name: 'matchingFlow',
    inputSchema: MatchWorkerInputSchema,
    outputSchema: MatchWorkerOutputSchema,
  },
  async input => {
    const {output} = await matchingPrompt(input);
    return output!;
  }
);
