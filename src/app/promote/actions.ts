
"use server";

import { createPromotionalContent as createPromotionalContentFlow, CreateContentOutput } from '@/ai/flows/content-creator-agent';
import { z } from 'zod';

const schema = z.object({
  userPhotoUri: z.string().refine(val => val.startsWith('data:'), {
    message: 'Invalid data URI for user photo.',
  }),
  userName: z.string().min(1, { message: 'User name is required.' }),
  userId: z.string().min(1, { message: 'User must be logged in.' }),
});

type State = {
  success: boolean;
  message: string;
  data: CreateContentOutput | null;
  errors?: any[];
}

export async function createPromoPoster(
  prevState: State,
  formData: FormData,
): Promise<State> {
  
  const validatedFields = schema.safeParse({
    userPhotoUri: formData.get('userPhotoUri'),
    userName: formData.get('userName'),
    userId: formData.get('userId'),
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
      userPhotoUri: validatedFields.data.userPhotoUri,
      userName: validatedFields.data.userName,
      referralCode: validatedFields.data.userId,
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
