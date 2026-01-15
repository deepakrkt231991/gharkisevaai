// src/app/list-tool/actions.ts
"use server";

import { z } from 'zod';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { initializeFirebase } from '@/firebase';
import { getAuth } from 'firebase/auth';
import { revalidatePath } from 'next/cache';

const ListToolSchema = z.object({
  name: z.string().min(3, { message: "Tool name must be at least 3 characters." }),
  description: z.string().optional(),
  rental_price_per_day: z.coerce.number().positive({ message: "Price must be a positive number." }),
});

type State = {
  success: boolean;
  message: string;
  errors?: z.ZodIssue[];
}

export async function listToolForRent(
  prevState: State,
  formData: FormData,
): Promise<State> {
  
  const validatedFields = ListToolSchema.safeParse({
    name: formData.get('name'),
    description: formData.get('description'),
    rental_price_per_day: formData.get('rental_price_per_day'),
  });

  if (!validatedFields.success) {
    return {
      success: false,
      message: 'Invalid form data. Please check the fields.',
      errors: validatedFields.error.issues,
    };
  }
  
  try {
    const { firestore, auth } = initializeFirebase();
    const currentUser = auth.currentUser;
    
    if (!currentUser) {
        return {
            success: false,
            message: 'You must be logged in as a worker to list a tool.',
        };
    }

    const toolData = {
      ...validatedFields.data,
      ownerId: currentUser.uid,
      is_available: true,
      createdAt: serverTimestamp(),
    };
    
    const toolsCollectionRef = collection(firestore, 'tools');
    await addDoc(toolsCollectionRef, toolData);

    revalidatePath('/rent-tools'); // To refresh the list of tools on the rental page

    return {
      success: true,
      message: 'Your tool has been successfully listed for rent!',
    };
  } catch (error) {
    console.error('Error listing tool:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return {
      success: false,
      message: `An error occurred while listing the tool. Please try again. Details: ${errorMessage}`,
    };
  }
}
