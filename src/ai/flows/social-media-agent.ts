'use server';
/**
 * @fileOverview The Social Media Maven - An AI agent for generating promotional ad copy.
 *
 * - createSocialMediaAd - A function to generate ad copy for various platforms.
 * - SocialMediaAdInput - The input type for the function.
 * - SocialMediaAdOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

export const SocialMediaAdInputSchema = z.object({
  topic: z.string().describe("The topic for the ad, e.g., 'hiring plumbers in Delhi', 'promoting our new AI verification feature'."),
  platform: z.enum(["Facebook", "LinkedIn", "Instagram"]).describe("The target social media platform."),
});
export type SocialMediaAdInput = z.infer<typeof SocialMediaAdInputSchema>;

export const SocialMediaAdOutputSchema = z.object({
  adCopy: z.string().describe("The generated ad copy, formatted with headlines, body text, and relevant hashtags, tailored for the specified platform."),
});
export type SocialMediaAdOutput = z.infer<typeof SocialMediaAdOutputSchema>;


export async function createSocialMediaAd(input: SocialMediaAdInput): Promise<SocialMediaAdOutput> {
  return socialMediaAdFlow(input);
}

const socialMediaAdPrompt = ai.definePrompt({
  name: 'socialMediaAdPrompt',
  input: {schema: SocialMediaAdInputSchema},
  output: {schema: SocialMediaAdOutputSchema},
  prompt: `You are a social media marketing expert for a home services app called "Ghar Ki Seva". Your task is to generate compelling ad copy.

The copy should be professional, engaging, and tailored to the specific platform. Use emojis where appropriate. Always include the brand name "Ghar Ki Seva" and relevant hashtags.

**Brand Voice:** Trustworthy, innovative, and focused on security and ease-of-use for the Indian market.

**Platform:** {{{platform}}}
**Ad Topic:** {{{topic}}}

Generate the ad copy now.
`,
});

const socialMediaAdFlow = ai.defineFlow(
  {
    name: 'socialMediaAdFlow',
    inputSchema: SocialMediaAdInputSchema,
    outputSchema: SocialMediaAdOutputSchema,
  },
  async input => {
    const {output} = await socialMediaAdPrompt(input);
    return output!;
  }
);
