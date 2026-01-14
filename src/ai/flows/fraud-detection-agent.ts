'use server';
/**
 * @fileOverview The Fraud Buster - An AI agent for detecting fraudulent user accounts.
 *
 * - detectFraudulentActivity - A function to analyze user data for signs of fraud.
 * - FraudDetectionInput - The input type for the fraud detection function.
 * - FraudDetectionOutput - The return type for the fraud detection function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FraudDetectionInputSchema = z.object({
  userId: z.string().describe("The ID of the new user to check."),
  ipAddress: z.string().describe("The IP address used for registration."),
  deviceId: z.string().describe("A unique identifier for the user's device."),
  address: z.string().optional().describe("The user's physical address."),
  // In a real implementation, a tool would be used to fetch existing users
  // with the same IP, deviceId, or address for comparison.
  // For now, the AI will use this description to understand the task.
});
export type FraudDetectionInput = z.infer<typeof FraudDetectionInputSchema>;

const FraudDetectionOutputSchema = z.object({
  isPotentialFraud: z.boolean().describe("True if the activity is flagged as potential fraud, otherwise false."),
  reasoning: z.string().describe("Explanation for why the activity is or is not considered fraudulent."),
  confidence: z.number().describe("Confidence score (0-100) for the fraud assessment."),
});
export type FraudDetectionOutput = z.infer<typeof FraudDetectionOutputSchema>;


export async function detectFraudulentActivity(input: FraudDetectionInput): Promise<FraudDetectionOutput> {
  return fraudDetectionFlow(input);
}

const fraudDetectionPrompt = ai.definePrompt({
  name: 'fraudDetectionPrompt',
  input: {schema: FraudDetectionInputSchema},
  output: {schema: FraudDetectionOutputSchema},
  prompt: `You are a fraud detection agent for the GrihSevaAI app. Your task is to analyze new user sign-ups to prevent abuse of the referral system.

You need to check for signs of a single person creating multiple accounts. Analyze the provided data for the new user.

Your analysis should be based on these rules:
1.  **Duplicate Device ID:** If another account already exists with the same deviceId, it's high-risk fraud.
2.  **Duplicate IP Address:** If multiple accounts are created from the same ipAddress in a short period, it's medium-risk, but could be a shared network (like a college campus). Consider this in your reasoning.
3.  **Similar Addresses:** If the physical address is very similar to an existing user's address, it could be a sign of fraud.

Based on your analysis, determine if this is a potential fraud case. Provide a confidence score and a clear reason for your decision.

**User Data to Analyze:**
- User ID: {{{userId}}}
- IP Address: {{{ipAddress}}}
- Device ID: {{{deviceId}}}
{{#if address}}
- Address: {{{address}}}
{{/if}}

**Note:** In a real system, you would have access to a tool to check for existing users with this data. For this simulation, assume you have that knowledge and make a logical determination. For example, you can invent a scenario like "Found 3 other accounts with the same Device ID".
`,
});

const fraudDetectionFlow = ai.defineFlow(
  {
    name: 'fraudDetectionFlow',
    inputSchema: FraudDetectionInputSchema,
    outputSchema: FraudDetectionOutputSchema,
  },
  async input => {
    const {output} = await fraudDetectionPrompt(input);
    return output!;
  }
);
