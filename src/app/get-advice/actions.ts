"use server";

import { getMedicalAdvice, GetMedicalAdviceOutput } from '@/ai/flows/medical-advice';
import { z } from 'zod';

const schema = z.object({
  concern: z.string().min(10, {
    message: 'Please describe your concern in at least 10 characters.',
  }),
});

type State = {
  success: boolean;
  message: string;
  data: GetMedicalAdviceOutput | null;
}

export async function getAdvice(
  prevState: State,
  formData: FormData,
): Promise<State> {
  
  const validatedFields = schema.safeParse({
    concern: formData.get('concern'),
  });

  if (!validatedFields.success) {
    const errorMessage = validatedFields.error.errors.map(e => e.message).join(', ');
    return {
      success: false,
      message: errorMessage,
      data: null,
    };
  }

  try {
    const result = await getMedicalAdvice(validatedFields.data);
    return {
      success: true,
      message: 'Advice generated.',
      data: result,
    };
  } catch (error) {
    console.error('Error during medical advice generation:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return {
      success: false,
      message: `An error occurred while getting advice. Please try again. Details: ${errorMessage}`,
      data: null,
    };
  }
}