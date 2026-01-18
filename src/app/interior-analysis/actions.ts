
"use server";

import { suggestInteriorImprovements, InteriorDesignOutput } from '@/ai/flows/interior-design-agent';
import { generateInteriorRender, InteriorRenderOutput } from '@/ai/flows/interior-render-agent';
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
  prevState: State | undefined,
  formData: FormData,
): Promise<State> {
  
  if (!formData.get('roomPhotoUri')) {
    return {
      success: false,
      message: '',
      data: null,
    };
  }
  
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


// New action for 3D rendering
const renderSchema = z.object({
  roomPhotoUri: z.string().refine(val => val.startsWith('data:')),
  suggestions: z.string().transform(val => JSON.parse(val)),
});

type RenderState = {
  success: boolean;
  message: string;
  renderData: InteriorRenderOutput | null;
}

export async function generate3dRender(
  prevState: RenderState | undefined,
  formData: FormData,
): Promise<RenderState> {
    if (!formData.get('roomPhotoUri')) {
        return {
          success: false,
          message: '',
          renderData: null,
        };
    }

  const validatedFields = renderSchema.safeParse({
    roomPhotoUri: formData.get('roomPhotoUri'),
    suggestions: formData.get('suggestions'),
  });

  if (!validatedFields.success) {
    console.error(validatedFields.error.issues);
    return {
      success: false,
      message: 'Invalid input for 3D rendering.',
      renderData: null,
    };
  }

  try {
    const result = await generateInteriorRender({
      roomPhotoUri: validatedFields.data.roomPhotoUri,
      suggestions: validatedFields.data.suggestions,
    });
    return {
      success: true,
      message: 'Render complete.',
      renderData: result,
    };
  } catch (error) {
    console.error('Error during 3D rendering:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return {
      success: false,
      message: `An error occurred during rendering. Details: ${errorMessage}`,
      renderData: null,
    };
  }
}
