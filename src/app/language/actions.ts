"use server";

import { z } from 'zod';
import { doc, updateDoc } from 'firebase/firestore';
import { initializeFirebase } from '@/firebase';
import { revalidatePath } from 'next/cache';

const UpdateLanguageSchema = z.object({
  language: z.string().min(2, { message: "Please select a language." }),
  uid: z.string(),
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
    const { firestore, auth } = initializeFirebase();
    const currentUser = auth.currentUser;
    
    if (!currentUser || currentUser.uid !== uid) {
      return {
        success: false,
        message: 'Authentication error.',
      };
    }

    const userDocRef = doc(firestore, 'users', uid);
    
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
