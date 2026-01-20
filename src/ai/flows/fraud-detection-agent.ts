'use server';
/**
 * @fileOverview The Fraud Buster - An AI agent for detecting fraudulent user accounts and behavior.
 *
 * - detectFraudulentActivity - A function to analyze user data for signs of fraud.
 * - FraudDetectionInput - The input type for the fraud detection function.
 * - FraudDetectionOutput - The return type for the fraud detection function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FraudDetectionInputSchema = z.object({
  userId: z.string().describe("The ID of the user/worker to check."),
  referredBy: z.string().optional().describe("The ID of the user who referred this account."),
  ipAddress: z.string().optional().describe("The IP address used for registration or recent activity."),
  deviceId: z.string().optional().describe("A unique identifier for the user's device."),
  address: z.string().optional().describe("The user's physical address."),
  workerRating: z.number().optional().describe("The current average rating of the worker."),
  recentReviews: z.array(z.string()).optional().describe("A list of recent text reviews for the worker."),
  chatTranscript: z.string().optional().describe("A transcript of a recent conversation between the user and a worker."),
});
export type FraudDetectionInput = z.infer<typeof FraudDetectionInputSchema>;

const FraudDetectionOutputSchema = z.object({
  isPotentialFraud: z.boolean().describe("True if the activity is flagged as potential fraud, otherwise false."),
  reasoning: z.string().describe("Explanation for why the activity is or is not considered fraudulent. Be specific."),
  suggestedAction: z.enum(["monitor", "warn", "auto_ban", "none"]).describe("The suggested action to take."),
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
  prompt: `You are a fraud and risk detection super agent for the GrihSeva AI app. Your task is to analyze user/worker data to prevent system abuse and ensure safety.

Analyze the provided data based on these rules and suggest an action:

1.  **Duplicate Account Fraud (High Risk -> auto_ban):**
    -   Check for multiple accounts from the same \`deviceId\` or \`ipAddress\`.
    -   Check for very similar physical \`address\` submissions.

2.  **Referral Fraud (Medium/High Risk -> monitor/auto_ban):**
    -   If a \`referredBy\` ID is provided, check the referrer's history.
    -   Has the referrer referred other accounts that were later flagged for fraud?
    -   Is the referrer's own account in good standing? A pattern of referring fraudulent accounts is a high-risk signal.

3.  **Poor Performance (Medium Risk -> warn/monitor):**
    -   Check if the \`workerRating\` has dropped below a threshold (e.g., 3.0) based on \`recentReviews\`.
    -   If the rating is consistently low over 3+ reviews, suggest 'warn'.

4.  **Off-Platform Payment Solicitation (High Risk -> auto_ban):**
    -   Analyze the \`chatTranscript\` for keywords suggesting payment outside the app.
    -   Look for phrases like "pay me directly", "Google Pay", "Paytm", "GPay", "cash de dena", "UPI kar do".

Based on your analysis, determine if this is a potential fraud case. Provide a confidence score, a clear reason for your decision, and a suggested action.

**Data to Analyze:**
- User ID: {{{userId}}}
{{#if referredBy}}- Referred By: {{{referredBy}}}{{/if}}
{{#if ipAddress}}- IP Address: {{{ipAddress}}}{{/if}}
{{#if deviceId}}- Device ID: {{{deviceId}}}{{/if}}
{{#if address}}- Address: {{{address}}}{{/if}}
{{#if workerRating}}- Worker Rating: {{{workerRating}}}{{/if}}
{{#if recentReviews}}- Recent Reviews: {{{recentReviews}}}{{/if}}
{{#if chatTranscript}}- Chat Transcript: \`\`\`{{{chatTranscript}}}\`\`\`{{/if}}

**Note:** In a real system, you would have access to tools to check against the database (e.g., to find other accounts by deviceId or check a referrer's history). For this simulation, assume you have that knowledge and make a logical determination based on the provided data. Invent a scenario if needed to justify your output (e.g., "The referrer, user-xyz, has previously referred 2 accounts that were banned for payment fraud.").
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
