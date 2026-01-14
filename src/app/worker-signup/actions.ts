
"use server";

import { z } from 'zod';
import { addDoc, collection } from 'firebase/firestore';
import { initializeFirebase } from '@/firebase';

// Updated schema to include new fields for bank details
const WorkerProfileSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  phone: z.string().min(10, { message: "Please enter a valid 10-digit phone number." }),
  address: z.string().min(10, { message: "Please enter a valid address." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  skills: z.string().min(2, { message: "Please select a skill." }),
  emergencyContact: z.string().min(10, { message: "Please enter a valid 10-digit emergency contact number." }),
  accountHolderName: z.string().min(2, { message: "Please enter the account holder's name." }),
  accountNumber: z.string().min(9, { message: "Please enter a valid bank account number." }),
  ifscCode: z.string().regex(/^[A-Z]{4}0[A-Z0-9]{6}$/, { message: "Please enter a valid IFSC code." }),
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
    address: formData.get('address'),
    email: formData.get('email'),
    skills: formData.get('skills'),
    emergencyContact: formData.get('emergencyContact'),
    accountHolderName: formData.get('accountHolderName'),
    accountNumber: formData.get('accountNumber'),
    ifscCode: formData.get('ifscCode'),
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
    const { document, accountHolderName, accountNumber, ifscCode, ...workerData } = validatedFields.data;

    const { firestore } = initializeFirebase();
    const workersCollection = collection(firestore, 'workers');
    
    await addDoc(workersCollection, {
      ...workerData,
      skills: [workerData.skills], // save skills as an array
      bankDetails: {
        accountHolderName,
        accountNumber,
        ifscCode
      },
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

    