"use server";

import { z } from 'zod';
import { addDoc, collection } from 'firebase/firestore';
import { initializeFirebase } from '@/firebase';

// Updated schema to include new fields
const WorkerProfileSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  phone: z.string().min(10, { message: "Please enter a valid 10-digit phone number." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  address: z.string().min(10, { message: "Address must be at least 10 characters." }),
  skills: z.string().min(2, { message: "Please list at least one skill." }),
  emergencyContact: z.string().min(10, { message: "Please enter a valid 10-digit emergency contact number." }),
  // For now, we'll just validate that a file is selected, not handle the upload itself.
  document: z.any().optional(), 
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
    email: formData.get('email'),
    address: formData.get('address'),
    skills: formData.get('skills'),
    emergencyContact: formData.get('emergencyContact'),
    document: formData.get('document'),
  });

  if (!validatedFields.success) {
    return {
      success: false,
      message: 'Invalid form data. Please check the fields.',
      errors: validatedFields.error.issues,
    };
  }
  
  try {
    // In a real app, you would handle the file upload to a service like Firebase Storage here
    // and get a URL to save in Firestore. For now, we are saving the text fields.
    const { document, ...workerData } = validatedFields.data;

    const { firestore } = initializeFirebase();
    const workersCollection = collection(firestore, 'workers');
    
    await addDoc(workersCollection, {
      ...workerData,
      isVerified: false, // Default to not verified
      rating: 0,
      createdAt: new Date(),
      // documentUrl: "URL_from_storage_would_go_here" 
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
