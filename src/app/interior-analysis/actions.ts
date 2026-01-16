
"use server";

import { suggestInteriorImprovements, InteriorDesignOutput } from '@/ai/flows/interior-design-agent';
import { z } from 'zod';

const schema = z.object({
  roomPhotoUri: z.string().refine(val => val.startsWith('data:'), {
    message: 'Invalid data URI',
  }),
});

type State = {
  success: boolean;
  message: string;
  data: InteriorDesignOutput | null;
}

export async function analyzeInterior(
  prevState: State,
  formData: FormData,
): Promise<State> {
  
  const validatedFields = schema.safeParse({
    roomPhotoUri: formData.get('roomPhotoUri'),
  });

  if (!validatedFields.success) {
    return {
      success: false,
      message: 'Invalid input. Please provide a valid image.',
      data: null,
    };
  }

  try {
    const result = await suggestInteriorImprovements({
      roomPhotoUri: validatedFields.data.roomPhotoUri,
    });
    return {
      success: true,
      message: 'Analysis complete.',
      data: result,
    };
  } catch (error) {
    console.error('Error during interior analysis:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return {
      success: false,
      message: `An error occurred during analysis. Please try again. Details: ${errorMessage}`,
      data: null,
    };
  }
}
