"use server";

import { createPromotionalContent as createPromotionalContentFlow, CreateContentOutput } from '@/ai/flows/content-creator-agent';
import { z } from 'zod';

const schema = z.object({
  workerPhotoUri: z.string().refine(val => val.startsWith('data:'), {
    message: 'Invalid data URI for worker photo.',
  }),
  workerName: z.string().min(1, { message: 'Worker name is required.' }),
});

type State = {
  success: boolean;
  message: string;
  data: CreateContentOutput | null;
}

export async function createPromoPoster(
  prevState: State,
  formData: FormData,
): Promise<State> {
  
  const validatedFields = schema.safeParse({
    workerPhotoUri: formData.get('workerPhotoUri'),
    workerName: formData.get('workerName'),
  });

  if (!validatedFields.success) {
    return {
      success: false,
      message: 'Invalid input. Please provide all required information.',
      data: null,
    };
  }

  try {
    const result = await createPromotionalContentFlow({
      workerPhotoUri: validatedFields.data.workerPhotoUri,
      workerName: validatedFields.data.workerName,
    });
    return {
      success: true,
      message: 'Poster generated successfully!',
      data: result,
    };
  } catch (error) {
    console.error('Error during poster generation:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return {
      success: false,
      message: `An error occurred during poster generation. Please try again. Details: ${errorMessage}`,
      data: null,
    };
  }
}
