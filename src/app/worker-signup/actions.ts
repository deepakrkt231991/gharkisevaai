
"use server";

import { z } from 'zod';
import { addDoc, collection, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { initializeFirebase } from '@/firebase';
import { getAuth } from 'firebase/auth';
import { headers } from 'next/headers';


// Updated schema to include new fields for bank details and location
const WorkerProfileSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  phone: z.string().min(10, { message: "Please enter a valid 10-digit phone number." }),
  skills: z.string().min(2, { message: "Please select a skill." }),
  emergencyContact: z.string().min(10, { message: "Please enter a valid 10-digit emergency contact number." }),
  accountHolderName: z.string().min(2, { message: "Please enter the account holder's name." }),
  accountNumber: z.string().min(9, { message: "Please enter a valid bank account number." }),
  ifscCode: z.string().regex(/^[A-Z]{4}0[A-Z0-9]{6}$/, { message: "Please enter a valid IFSC code." }),
  latitude: z.coerce.number().optional(),
  longitude: z.coerce.number().optional(),
  certificationsUploaded: z.string().optional(),
  shopLicenseUploaded: z.string().optional(),
  referredBy: z.string().optional(),
  portfolioImageUrls: z.array(z.string().url()).optional(),
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
    skills: formData.get('skills'),
    emergencyContact: formData.get('emergencyContact'),
    accountHolderName: formData.get('accountHolderName'),
    accountNumber: formData.get('accountNumber'),
    ifscCode: formData.get('ifscCode'),
    latitude: formData.get('latitude'),
    longitude: formData.get('longitude'),
    certificationsUploaded: formData.get('certificationsUploaded'),
    shopLicenseUploaded: formData.get('shopLicenseUploaded'),
    referredBy: formData.get('referredBy'),
    portfolioImageUrls: formData.getAll('portfolioImageUrls[]'),
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
            message: 'You must be logged in to create a worker profile.',
        };
    }

    const { accountHolderName, accountNumber, ifscCode, latitude, longitude, ...workerData } = validatedFields.data;
    
    const workerId = currentUser.uid;
    const workerDocRef = doc(firestore, 'workers', workerId);
    
    await setDoc(workerDocRef, {
      ...workerData,
      workerId: workerId,
      uid: workerId,
      skills: [workerData.skills], // save skills as an array
      bankDetails: {
        accountHolderName,
        accountNumber,
        ifscCode
      },
      location: {
        latitude: latitude || null,
        longitude: longitude || null,
      },
      isVerified: false, // ALL workers must be manually approved by an admin
      rating: 0,
      successfulOrders: 0,
      certificationsUploaded: workerData.certificationsUploaded === 'on',
      shopLicenseUploaded: workerData.shopLicenseUploaded === 'on',
      createdAt: serverTimestamp(),
    }, { merge: true });

    return {
      success: true,
      message: 'Your profile has been submitted for review! You will be notified once it is approved.',
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
