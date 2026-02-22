
'use server';
/**
 * @fileOverview A conversational AI agent for the GrihSeva app.
 *
 * - generalChat - A function that handles general chat conversations.
 * - ChatInput - The input type for the chat function.
 * - ChatOutput - The return type for the chat function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const ChatMessageSchema = z.object({
  role: z.enum(['user', 'model']),
  content: z.string(),
});

const ChatInputSchema = z.object({
  history: z.array(ChatMessageSchema).describe('The conversation history.'),
  prompt: z.string().describe('The latest user message.'),
});
export type ChatInput = z.infer<typeof ChatInputSchema>;

const ChatOutputSchema = z.object({
  response: z.string().describe("The AI model's response."),
});
export type ChatOutput = z.infer<typeof ChatOutputSchema>;

export async function generalChat(input: ChatInput): Promise<ChatOutput> {
  return chatFlow(input);
}

const chatPrompt = ai.definePrompt({
    name: 'chatPrompt',
    input: { schema: ChatInputSchema },
    output: { schema: ChatOutputSchema },
    prompt: `You are a helpful and friendly AI assistant for "Ghar Ki Seva", a home services app in India. Your name is "Seva AI".

    Your primary role is to assist users with their queries about home repairs, our services, pricing, and how the app works. Be concise and helpful.

    Here are some key points about the app you should know:
    - We offer services like plumbing, electrical work, painting, AC repair, etc.
    - We have a marketplace for buying/selling used goods and properties.
    - We use AI for defect analysis, worker verification, and legal agreements.
    - Our fee for workers/sellers is 7%. It's free for customers.
    - We have a secure escrow payment system called "Safe Vault".
    - Users can earn a lifetime 0.05% referral commission.

    Current conversation:
    {{#each history}}
        **{{role}}**: {{{content}}}
    {{/each}}
    **user**: {{{prompt}}}

    Your response must be in plain text.
    `,
});


const chatFlow = ai.defineFlow(
  {
    name: 'chatFlow',
    inputSchema: ChatInputSchema,
    outputSchema: ChatOutputSchema,
  },
  async (input) => {
    const { output } = await chatPrompt(input);
    return {
        response: output?.response || "I'm sorry, I couldn't process that. Could you please rephrase?"
    };
  }
);
