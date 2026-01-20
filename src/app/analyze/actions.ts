
"use server";

import { analyzeDefect as analyzeDefectFlow, AnalyzeDefectOutput } from '@/ai/flows/defect-analysis';
import { findVerifiedWorkers } from '@/services/worker-service';
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
      // In a real app, you'd get this from user preferences
      userLanguage: 'Hindi', 
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

// New action to find workers
export async function findNearbyWorkers(
    { skill }: { skill: string }
): Promise<{ success: boolean; workers: any[] }> {
    if (!skill) {
        return { success: false, workers: [] };
    }
    try {
        // The findVerifiedWorkers tool is designed to be called by the AI, but we can call it directly.
        // It returns an array of workers. We can add more logic here to filter by location if needed.
        const workers = await findVerifiedWorkers({ skills: [skill] });
        
        // In a real app, we would also get the user's location and filter/sort by distance.
        // For now, we'll return the first 3 matches.
        return { success: true, workers: workers.slice(0, 3) };

    } catch (error) {
        console.error('Error finding nearby workers:', error);
        return { success: false, workers: [] };
    }
}
