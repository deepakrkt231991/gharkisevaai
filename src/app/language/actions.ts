
"use server";

import { z } from 'zod';
import { doc, updateDoc } from 'firebase/firestore';
import { initializeFirebase } from '@/firebase/init';
import { revalidatePath } from 'next/cache';

const UpdateLanguageSchema = z.object({
  language: z.string().min(2, { message: "Please select a language." }),
  uid: z.string().min(1, { message: "User not authenticated." }),
});

type State = {
  success: boolean;
  message: string;
  errors?: z.ZodIssue[];
}

export async function updateUserLanguage(
  prevState: State,
  formData: FormData,
): Promise<State> {

  const validatedFields = UpdateLanguageSchema.safeParse({
    language: formData.get('language'),
    uid: formData.get('uid'),
  });

  if (!validatedFields.success) {
    return {
      success: false,
      message: 'Invalid form data.',
      errors: validatedFields.error.issues,
    };
  }

  const { uid, language } = validatedFields.data;
  
  try {
    const { firestore } = initializeFirebase();

    const userDocRef = doc(firestore, 'users', uid);
    
    // Security is handled by Firestore rules:
    // match /users/{userId} { allow write: if request.auth.uid == userId; }
    await updateDoc(userDocRef, { language });

    revalidatePath('/profile'); 
    revalidatePath('/language'); 

    return {
      success: true,
      message: 'Language updated successfully!',
    };
  } catch (error) {
    console.error('Error updating language:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return {
      success: false,
      message: `An error occurred: ${errorMessage}`,
    };
  }
}
