"use server";

import { analyzeDefect as analyzeDefectFlow, AnalyzeDefectOutput } from '@/ai/flows/defect-analysis';
import { z } from 'zod';

const schema = z.object({
  photoDataUri: z.string().refine(val => val.startsWith('data:image/'), {
    message: 'Invalid image data URI',
  }),
});

type State = {
  success: boolean;
  message: string;
  data: AnalyzeDefectOutput | null;
}

export async function analyzeDefect(
  prevState: State,
  formData: FormData,
): Promise<State> {
  
  const validatedFields = schema.safeParse({
    photoDataUri: formData.get('photoDataUri'),
  });

  if (!validatedFields.success) {
    return {
      success: false,
      message: 'Invalid input. Please provide a valid image.',
      data: null,
    };
  }

  try {
    const result = await analyzeDefectFlow({photoDataUri: validatedFields.data.photoDataUri});
    return {
      success: true,
      message: 'Analysis complete.',
      data: result,
    };
  } catch (error) {
    console.error('Error during defect analysis:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return {
      success: false,
      message: `An error occurred during analysis. Please try again. Details: ${errorMessage}`,
      data: null,
    };
  }
}
