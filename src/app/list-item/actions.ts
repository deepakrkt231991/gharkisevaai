"use server";

import { z } from 'zod';
import { collection, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { initializeFirebase } from '@/firebase';
import { revalidatePath } from 'next/cache';
import type { User } from 'firebase/auth';

const ListItemSchema = z.object({
  name: z.string().min(3, "Item name must be at least 3 characters."),
  category: z.string().min(1, "Please select a category."),
  price: z.coerce.number().positive("Price must be a positive number."),
  description: z.string().optional(),
  location: z.string().min(3, "Location is required."),
  imageUrls: z.array(z.string().url()).min(1, "Please upload at least one photo."),
  isReservedEnabled: z.boolean().default(false),
});

type State = {
  success: boolean;
  message: string;
  errors?: z.ZodIssue[];
}

export async function listItem(
  prevState: State,
  formData: FormData,
): Promise<State> {
  
  const validatedFields = ListItemSchema.safeParse({
    name: formData.get('name'),
    category: formData.get('category'),
    price: formData.get('price'),
    description: formData.get('description'),
    location: formData.get('location'),
    imageUrls: formData.getAll('imageUrls[]'),
    isReservedEnabled: formData.get('isReservedEnabled') === 'on',
  });

  if (!validatedFields.success) {
    return {
      success: false,
      message: 'Invalid form data.',
      errors: validatedFields.error.issues,
    };
  }

  try {
    const { firestore, auth } = initializeFirebase();
    const currentUser = auth.currentUser;
    
    if (!currentUser) {
        return { success: false, message: 'You must be logged in to list an item.' };
    }

    const productsCollectionRef = collection(firestore, 'products');
    const newDocRef = doc(productsCollectionRef);

    await setDoc(newDocRef, {
      ...validatedFields.data,
      productId: newDocRef.id,
      ownerId: currentUser.uid,
      isReserved: false, // The item is not reserved when listed
      createdAt: serverTimestamp(),
    });

    revalidatePath('/marketplace');

    return {
      success: true,
      message: 'Your item has been successfully listed!',
    };
  } catch (error) {
    console.error('Error listing item:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return {
      success: false,
      message: `An error occurred: ${errorMessage}`,
    };
  }
}
