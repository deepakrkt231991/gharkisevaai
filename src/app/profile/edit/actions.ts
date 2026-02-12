
"use server";

import { z } from 'zod';
import { doc, setDoc } from 'firebase/firestore';
import { initializeFirebase } from '@/firebase/init';
import { revalidatePath } from 'next/cache';

const EditProfileSchema = z.object({
  uid: z.string().min(1, { message: "User not authenticated." }),
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  phone: z.string().min(10, { message: "Please enter a valid 10-digit phone number." }).optional().or(z.literal('')),
  address: z.string().optional(),
});

type State = {
  success: boolean;
  message: string;
  errors?: z.ZodIssue[];
}

export async function updateUserProfile(
  prevState: State,
  formData: FormData,
): Promise<State> {

  const validatedFields = EditProfileSchema.safeParse({
    uid: formData.get('uid'),
    name: formData.get('name'),
    phone: formData.get('phone'),
    address: formData.get('address'),
  });

  if (!validatedFields.success) {
    return {
      success: false,
      message: 'Invalid form data.',
      errors: validatedFields.error.issues,
    };
  }

  const { uid, ...profileData } = validatedFields.data;
  
  try {
    const { firestore } = initializeFirebase();
    
    const userDocRef = doc(firestore, 'users', uid);
    
    // Security is handled by Firestore rules:
    // match /users/{userId} { allow write: if request.auth.uid == userId; }
    await setDoc(userDocRef, profileData, { merge: true });

    // Note: Updating the Firebase Auth user's displayName (via updateProfile)
    // should be handled on the client-side, as auth.currentUser isn't available here.
    // This action only updates the Firestore document, which is the app's primary source of truth.

    revalidatePath('/profile'); 
    revalidatePath('/profile/edit'); 

    return {
      success: true,
      message: 'Profile updated successfully!',
    };
  } catch (error) {
    console.error('Error updating profile:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return {
      success: false,
      message: `An error occurred: ${errorMessage}`,
    };
  }
}
