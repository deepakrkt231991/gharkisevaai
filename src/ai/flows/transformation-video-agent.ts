'use server';
/**
 * @fileOverview The Video Magician - An AI agent for creating transformation videos.
 *
 * - createTransformationVideo - A function to generate a short cinematic walkthrough.
 * - TransformationVideoInput - The input type for the video creation function.
 * - TransformationVideoOutput - The return type for the video creation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';

const TransformationVideoInputSchema = z.object({
  imageDataUri: z.string().describe("A data URI of the initial image."),
  prompt: z.string().describe("A detailed description of the transformation to visualize."),
});
export type TransformationVideoInput = z.infer<typeof TransformationVideoInputSchema>;

const TransformationVideoOutputSchema = z.object({
  videoDataUri: z.string().describe("The generated video as a data URI."),
});
export type TransformationVideoOutput = z.infer<typeof TransformationVideoOutputSchema>;


export async function createTransformationVideo(input: TransformationVideoInput): Promise<TransformationVideoOutput> {
  return transformationVideoFlow(input);
}

const transformationVideoFlow = ai.defineFlow(
  {
    name: 'transformationVideoFlow',
    inputSchema: TransformationVideoInputSchema,
    outputSchema: TransformationVideoOutputSchema,
  },
  async ({ imageDataUri, prompt }) => {
    let { operation } = await ai.generate({
        model: googleAI.model('veo-2.0-generate-001'),
        prompt: [
            { media: { url: imageDataUri, contentType: 'image/jpeg' } },
            { text: prompt }
        ],
        config: {
            durationSeconds: 5,
        },
    });

    if (!operation) {
        throw new Error('Video generation operation failed to start.');
    }

    // Poll for completion
    while (!operation.done) {
        await new Promise((resolve) => setTimeout(resolve, 5000));
        operation = await ai.checkOperation(operation);
    }

    if (operation.error) {
        throw new Error(`Failed to generate video: ${operation.error.message}`);
    }

    const videoPart = operation.output?.message?.content.find((p) => !!p.media);
    if (!videoPart || !videoPart.media?.url) {
        throw new Error('Failed to find the generated video in the operation result.');
    }

    const fetch = (await import('node-fetch')).default;
    const videoDownloadResponse = await fetch(
        `${videoPart.media.url}&key=${process.env.GEMINI_API_KEY}`
    );

    if (!videoDownloadResponse.ok || !videoDownloadResponse.body) {
        throw new Error(`Failed to download video: ${videoDownloadResponse.statusText}`);
    }

    const videoBuffer = await videoDownloadResponse.buffer();
    const videoDataUri = `data:${videoPart.media.contentType || 'video/mp4'};base64,${videoBuffer.toString('base64')}`;

    return {
      videoDataUri,
    };
  }
);
