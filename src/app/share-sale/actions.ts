
"use server";

import { createSalePoster as createSalePosterFlow, CreateSalePosterOutput } from '@/ai/flows/sale-poster-agent';
import { z } from 'zod';

const schema = z.object({
  itemName: z.string().min(1, { message: 'Item name is required.' }),
  sellerName: z.string().min(1, { message: 'Seller name is required.' }),
});

type State = {
  success: boolean;
  message: string;
  data: CreateSalePosterOutput | null;
  errors?: any[];
}

export async function generateSalePoster(
  prevState: State,
  formData: FormData,
): Promise<State> {
  
  const validatedFields = schema.safeParse({
    itemName: formData.get('itemName'),
    sellerName: formData.get('sellerName'),
  });

  if (!validatedFields.success) {
    return {
      success: false,
      message: 'Invalid input. Please provide all required information.',
      data: null,
    };
  }

  try {
    const result = await createSalePosterFlow({
      itemName: validatedFields.data.itemName,
      sellerName: validatedFields.data.sellerName,
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
