'use server';
/**
 * @fileOverview The Video Virtuoso - An AI agent for creating promotional videos.
 *
 * - createVideoPost - A function to generate a short promotional video reel.
 * - CreateVideoInput - The input type for the video creation function.
 * - CreateVideoOutput - The return type for the video creation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';

const CreateVideoInputSchema = z.object({
  prompt: z.string().describe("A detailed description of the video to be generated."),
});
export type CreateVideoInput = z.infer<typeof CreateVideoInputSchema>;

const CreateVideoOutputSchema = z.object({
  videoDataUri: z
    .string()
    .describe("The generated video as a data URI."),
});
export type CreateVideoOutput = z.infer<typeof CreateVideoOutputSchema>;


export async function createVideoPost(input: CreateVideoInput): Promise<CreateVideoOutput> {
  return videoCreatorFlow(input);
}

const videoCreatorFlow = ai.defineFlow(
  {
    name: 'videoCreatorFlow',
    inputSchema: CreateVideoInputSchema,
    outputSchema: CreateVideoOutputSchema,
  },
  async ({ prompt }) => {
    let { operation } = await ai.generate({
        model: googleAI.model('veo-2.0-generate-001'),
        prompt: prompt,
        config: {
            durationSeconds: 10,
            aspectRatio: '9:16', // Portrait for reels
        },
    });

    if (!operation) {
        throw new Error('Expected the model to return an operation');
    }

    // Wait until the operation completes. This may take a minute or more.
    while (!operation.done) {
        await new Promise((resolve) => setTimeout(resolve, 5000)); // Wait 5 seconds
        operation = await ai.checkOperation(operation);
    }

    if (operation.error) {
        throw new Error('Failed to generate video: ' + operation.error.message);
    }

    const videoPart = operation.output?.message?.content.find((p) => !!p.media);
    if (!videoPart || !videoPart.media?.url) {
        throw new Error('Failed to find the generated video in the operation result');
    }

    const fetch = (await import('node-fetch')).default;
    const videoDownloadResponse = await fetch(
        `${videoPart.media.url}&key=${process.env.GEMINI_API_KEY}`
    );

    if (!videoDownloadResponse.ok || !videoDownloadResponse.body) {
        throw new Error(`Failed to download video: ${videoDownloadResponse.statusText}`);
    }

    const videoBuffer = await videoDownloadResponse.buffer();
    const videoDataUri = `data:video/mp4;base64,${videoBuffer.toString('base64')}`;

    return {
      videoDataUri,
    };
  }
);
