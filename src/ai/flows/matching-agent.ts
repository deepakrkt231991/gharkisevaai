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
  prompt: `You are an AI assistant for a home repair app. Your goal is to diagnose a problem from an image and recommend the best available worker.

1.  First, analyze the image to understand the problem.
2.  Then, use the findVerifiedWorkers tool to get a list of available workers near the user's location.
3.  From the list, select the worker whose skills best match the diagnosed problem.
4.  Provide the ID of the recommended worker and a brief explanation for your choice.
5.  If no suitable worker is found, explain why (e.g., "No plumbers available nearby").

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
