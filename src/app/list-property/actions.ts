
"use server";

import { z } from 'zod';
import { collection, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { initializeFirebase } from '@/firebase';
import { revalidatePath } from 'next/cache';
import { analyzeHomeForVastu } from '@/ai/flows/home-vastu-agent';

const ListPropertySchema = z.object({
  title: z.string().min(5, { message: "Title must be at least 5 characters." }),
  location: z.string().min(3, { message: "Location is required." }),
  price: z.coerce.number().positive({ message: "Price must be a positive number." }),
  priceUnit: z.enum(['Cr', 'L']),
  sqft: z.coerce.number().positive({ message: "Square feet must be a positive number." }),
  parking: z.coerce.number().int().min(0, { message: "Parking must be a non-negative number." }),
  imageUrl: z.string().url().optional().or(z.literal('')),
  videoUrl: z.string().url().optional().or(z.literal('')),
  listingType: z.enum(['sale', 'rent']),
});

type State = {
  success: boolean;
  message: string;
  errors?: z.ZodIssue[];
}

export async function listProperty(
  prevState: State,
  formData: FormData,
): Promise<State> {
  
  const validatedFields = ListPropertySchema.safeParse({
    title: formData.get('title'),
    location: formData.get('location'),
    price: formData.get('price'),
    priceUnit: formData.get('priceUnit'),
    sqft: formData.get('sqft'),
    parking: formData.get('parking'),
    imageUrl: formData.get('imageUrl'),
    videoUrl: formData.get('videoUrl'),
    listingType: formData.get('listingType') || 'sale',
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
            message: 'You must be logged in to list a property.',
        };
    }
    
    const propertiesCollectionRef = collection(firestore, 'properties');
    const newDocRef = doc(propertiesCollectionRef);

    await setDoc(newDocRef, {
      ...validatedFields.data,
      ownerId: currentUser.uid,
      propertyId: newDocRef.id,
      isAiVerified: false, // AI verification will be a separate process
      createdAt: serverTimestamp(),
      // Add a default geo location for sorting if not provided
      geo: {
          latitude: 17.3850, // Default to Hyderabad
          longitude: 78.4867
      }
    });

    revalidatePath('/explore');

    return {
      success: true,
      message: 'Your property has been successfully listed!',
    };
  } catch (error) {
    console.error('Error listing property:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return {
      success: false,
      message: `An error occurred while listing the property. Details: ${errorMessage}`,
    };
  }
}

export async function getPropertyMediaTips(): Promise<{success: boolean; tips: string[]}> {
    try {
        const result = await analyzeHomeForVastu({
            // A dummy image URI is required for the flow input schema.
            homeLayoutImageUri: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=',
            userInstructions: "Provide a step-by-step guide for a user to record a high-quality video walkthrough and take excellent photos for a real estate listing. Separate tips for photos and videos clearly.",
        });
        
        // The updated AI prompt puts photo tips in `vastuSuggestions` and video tips in `videoInstructions`
        const allTips = [
            "Photo Tips:",
            ...result.vastuSuggestions,
            "Video Tips:",
            ...result.videoInstructions
        ];
        
        return { success: true, tips: allTips };

    } catch (error) {
        console.error("Error fetching media tips:", error);
        return { success: false, tips: ["Could not load AI tips at this time. Please try again later."] };
    }
}

    