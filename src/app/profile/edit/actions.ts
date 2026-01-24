"use server";

import { z } from 'zod';
import { doc, setDoc } from 'firebase/firestore';
import { initializeFirebase } from '@/firebase/init';
import { getAuth } from 'firebase/auth';
import { revalidatePath } from 'next/cache';
import { updateProfile } from 'firebase/auth';

const EditProfileSchema = z.object({
  uid: z.string(),
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
    const { firestore, auth } = initializeFirebase();
    const currentUser = auth.currentUser;
    
    if (!currentUser || currentUser.uid !== uid) {
      return {
        success: false,
        message: 'Authentication error. You can only update your own profile.',
      };
    }

    const userDocRef = doc(firestore, 'users', uid);
    
    await setDoc(userDocRef, profileData, { merge: true });

    // Also update the auth profile display name
    if (currentUser.displayName !== profileData.name) {
        await updateProfile(currentUser, { displayName: profileData.name });
    }

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
