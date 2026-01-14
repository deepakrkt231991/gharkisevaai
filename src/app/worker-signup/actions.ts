"use server";

import { z } from 'zod';
import { addDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { collection, getFirestore } from 'firebase/firestore';
import { initializeFirebase } from '@/firebase';

const WorkerProfileSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  phone: z.string().min(10, { message: "Please enter a valid 10-digit phone number." }),
  address: z.string().min(10, { message: "Address must be at least 10 characters." }),
  skills: z.string().min(2, { message: "Please list at least one skill." }),
});

type State = {
  success: boolean;
  message: string;
  errors?: z.ZodIssue[];
}

export async function createWorkerProfile(
  prevState: State,
  formData: FormData,
): Promise<State> {
  
  const validatedFields = WorkerProfileSchema.safeParse({
    name: formData.get('name'),
    phone: formData.get('phone'),
    address: formData.get('address'),
    skills: formData.get('skills'),
  });

  if (!validatedFields.success) {
    return {
      success: false,
      message: 'Invalid form data.',
      errors: validatedFields.error.issues,
    };
  }
  
  try {
    // NOTE: This is a simplified example. In a real app, you would
    // associate this worker profile with a user account (e.g., from Firebase Auth).
    // For now, we are just creating a document in a 'workers' collection.
    
    // We can't use useFirestore() hook in server actions, so we initialize manually
    const { firestore } = initializeFirebase();
    const workersCollection = collection(firestore, 'workers');
    
    await addDoc(workersCollection, {
      ...validatedFields.data,
      isVerified: false, // Default to not verified
      rating: 0,
      createdAt: new Date(),
    });

    return {
      success: true,
      message: 'Your profile has been created successfully! We will review it shortly.',
    };
  } catch (error) {
    console.error('Error creating worker profile:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return {
      success: false,
      message: `An error occurred. Please try again. Details: ${errorMessage}`,
    };
  }
}
