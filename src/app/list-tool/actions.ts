// src/app/list-tool/actions.ts
"use server";

import { z } from 'zod';
import { collection, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { initializeFirebase } from '@/firebase/init';
import { revalidatePath } from 'next/cache';

const ListToolSchema = z.object({
  name: z.string().min(3, { message: "Tool name must be at least 3 characters." }),
  description: z.string().optional(),
  rental_price_per_day: z.coerce.number().positive({ message: "Price must be a positive number." }),
  deposit: z.coerce.number().min(0, { message: "Deposit must be a non-negative number." }),
  location: z.string().min(3, { message: "Location is required." }),
  imageUrl: z.string().url().optional().or(z.literal('')),
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
    deposit: formData.get('deposit'),
    location: formData.get('location'),
    imageUrl: formData.get('imageUrl'),
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

    const toolsCollectionRef = collection(firestore, 'tools');
    const newDocRef = doc(toolsCollectionRef);

    const toolData = {
      ...validatedFields.data,
      toolId: newDocRef.id,
      ownerId: currentUser.uid,
      is_available: true,
      createdAt: serverTimestamp(),
    };
    
    await setDoc(newDocRef, toolData);

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
