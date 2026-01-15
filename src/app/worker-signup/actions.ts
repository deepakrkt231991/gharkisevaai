
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
  });

  if (!validatedFields.success) {
    return {
      success: false,
      message: 'Invalid form data. Please check the fields.',
      errors: validatedFields.error.issues,
    };
  }
  
  try {
    const { accountHolderName, accountNumber, ifscCode, ...workerData } = validatedFields.data;

    const { firestore } = initializeFirebase();
    const workersCollection = collection(firestore, 'workers');
    
    // Here, you would associate this with the Firebase Auth user ID.
    // For now, we are creating a new document.
    await addDoc(workersCollection, {
      ...workerData,
      skills: [workerData.skills], // save skills as an array
      bankDetails: {
        accountHolderName,
        accountNumber,
        ifscCode
      },
      isVerified: true, // Assuming verification was passed on the client
      rating: 0,
      createdAt: new Date(),
    });

    return {
      success: true,
      message: 'Your profile has been created successfully! You can now start getting jobs.',
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
