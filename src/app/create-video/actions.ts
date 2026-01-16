"use server";

import { createVideoPost, CreateVideoOutput } from '@/ai/flows/video-creator-agent';
import { z } from 'zod';

const schema = z.object({
  prompt: z.string().min(10, { message: 'Prompt must be at least 10 characters long.' }),
});

type State = {
  success: boolean;
  message: string;
  data: CreateVideoOutput | null;
}

export async function generateVideoAd(
  prevState: State,
  formData: FormData,
): Promise<State> {
  
  const validatedFields = schema.safeParse({
    prompt: formData.get('prompt'),
  });

  if (!validatedFields.success) {
    return {
      success: false,
      message: 'Invalid input. Please provide a detailed prompt.',
      data: null,
    };
  }

  try {
    const result = await createVideoPost({
      prompt: validatedFields.data.prompt,
    });
    return {
      success: true,
      message: 'Video generated successfully!',
      data: result,
    };
  } catch (error) {
    console.error('Error during video generation:', error);
    // Veo can be flaky, so a more user-friendly error is good.
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return {
      success: false,
      message: `Video generation failed. This can happen due to high demand or prompt complexity. Please try again later. Details: ${errorMessage}`,
      data: null,
    };
  }
}
