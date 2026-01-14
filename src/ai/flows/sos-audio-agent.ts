
'use server';
/**
 * @fileOverview The SOS Sentinel - An AI agent for detecting distress in audio.
 *
 * - analyzeSosAudio - A function to analyze audio for signs of emergency.
 * - SosAudioInput - The input type for the analysis function.
 * - SosAudioOutput - The return type for the analysis function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SosAudioInputSchema = z.object({
  audioDataUri: z
    .string()
    .describe(
      "A background audio recording from an SOS event, as a data URI that must include a MIME type and use Base64 encoding."
    ),
});
export type SosAudioInput = z.infer<typeof SosAudioInputSchema>;

const SosAudioOutputSchema = z.object({
  isDistress: z.boolean().describe("True if signs of distress (shouting, fighting, calls for help) are detected, otherwise false."),
  summary: z.string().describe("A brief summary of the detected sounds and conversation."),
  confidence: z.number().describe("A confidence score (0-100) for the distress detection."),
});
export type SosAudioOutput = z.infer<typeof SosAudioOutputSchema>;


export async function analyzeSosAudio(input: SosAudioInput): Promise<SosAudioOutput> {
  return sosAudioFlow(input);
}

const sosAudioPrompt = ai.definePrompt({
  name: 'sosAudioPrompt',
  input: {schema: SosAudioInputSchema},
  output: {schema: SosAudioOutputSchema},
  prompt: `You are an AI security operator monitoring an emergency SOS call. Your ONLY task is to listen to the provided audio and determine if there are signs of a genuine emergency.

Listen for:
- Shouting, screaming, or calls for help.
- Sounds of a physical altercation or struggle.
- Aggressive or threatening language.
- Any clear indication that someone is in danger.

Based on the audio, you must determine if this is a distress situation. Provide a confidence score for your assessment and a brief summary of what you heard.

Audio from SOS event: {{media url=audioDataUri}}
`,
});

const sosAudioFlow = ai.defineFlow(
  {
    name: 'sosAudioFlow',
    inputSchema: SosAudioInputSchema,
    outputSchema: SosAudioOutputSchema,
  },
  async input => {
    const {output} = await sosAudioPrompt(input);
    return output!;
  }
);

    