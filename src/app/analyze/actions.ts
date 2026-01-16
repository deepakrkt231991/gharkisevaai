
"use server";

import { analyzeDefect as analyzeDefectFlow, AnalyzeDefectOutput } from '@/ai/flows/defect-analysis';
import { z } from 'zod';

const schema = z.object({
  mediaDataUri: z.string().refine(val => val.startsWith('data:'), {
    message: 'Invalid data URI',
  }),
  description: z.string().optional(),
});

type State = {
  success: boolean;
  message: string;
  data: AnalyzeDefectOutput | null;
}

export async function analyzeDefect(
  prevState: State | undefined,
  formData: FormData,
): Promise<State> {
  // Allow resetting state
  if (!formData.get('mediaDataUri')) {
    return {
      success: false,
      message: '',
      data: null,
    };
  }

  const validatedFields = schema.safeParse({
    mediaDataUri: formData.get('mediaDataUri'),
    description: formData.get('description'),
  });

  if (!validatedFields.success) {
    return {
      success: false,
      message: 'Invalid input. Please provide a valid image or video.',
      data: null,
    };
  }

  try {
    const result = await analyzeDefectFlow({
      mediaDataUri: validatedFields.data.mediaDataUri,
      description: validatedFields.data.description,
    });
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
