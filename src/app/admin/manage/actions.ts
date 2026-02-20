'use server';
import { initializeFirebase } from '@/firebase/init';
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

type FormState = {
    success: boolean;
    message: string;
}

const AddWorkerSchema = z.object({
    name: z.string().min(1),
    phone: z.string().min(1),
    skills: z.string().min(1),
    location: z.string().optional(),
    rating: z.coerce.number().optional().default(4.5),
    successfulOrders: z.coerce.number().optional().default(50),
});

export async function addWorkerManually(prevState: FormState, formData: FormData): Promise<FormState> {
    const validated = AddWorkerSchema.safeParse({
        name: formData.get('name'),
        phone: formData.get('phone'),
        skills: formData.get('skills'),
        location: formData.get('location'),
        rating: formData.get('rating'),
        successfulOrders: formData.get('successfulOrders'),
    });

    if (!validated.success) {
        return { success: false, message: validated.error.errors[0].message };
    }
    
    try {
        const { firestore } = initializeFirebase();
        const workersRef = collection(firestore, 'workers');
        const { location, ...restOfData } = validated.data;
        await addDoc(workersRef, {
            ...restOfData,
            skills: validated.data.skills.split(',').map(s => s.trim()),
            isVerified: true, // Manually added workers are pre-verified
            createdAt: serverTimestamp(),
            location: {
                city: location || null,
            }
        });
        revalidatePath('/admin/manage');
        revalidatePath('/find-a-worker');
        return { success: true, message: 'Worker added successfully!' };
    } catch (e: any) {
        return { success: false, message: e.message };
    }
}


const AddPropertySchema = z.object({
  ownerId: z.string().min(1, { message: "Owner ID is required." }),
  title: z.string().min(5),
  location: z.string().min(3),
  listingType: z.enum(['sale', 'rent']),
  price: z.coerce.number().optional(),
  priceUnit: z.string().optional(),
  sqft: z.coerce.number().positive(),
  parking: z.coerce.number().int().min(0),
  imageUrl: z.string().url({ message: "Please enter a valid image URL." }).optional().or(z.literal('')),
  videoUrl: z.string().url({ message: "Please enter a valid video URL." }).optional().or(z.literal('')),
});

export async function addPropertyManually(prevState: FormState, formData: FormData): Promise<FormState> {
    const validated = AddPropertySchema.safeParse({
        ownerId: formData.get('ownerId'),
        title: formData.get('title'),
        location: formData.get('location'),
        listingType: formData.get('listingType'),
        price: formData.get('price'),
        priceUnit: formData.get('priceUnit'),
        sqft: formData.get('sqft'),
        parking: formData.get('parking'),
        imageUrl: formData.get('imageUrl'),
        videoUrl: formData.get('videoUrl') || '',
    });

    if (!validated.success) {
        return { success: false, message: validated.error.errors[0].message };
    }
    
    try {
        const { firestore } = initializeFirebase();
        const propertiesRef = collection(firestore, 'properties');
        await addDoc(propertiesRef, {
            ...validated.data,
            verificationStatus: 'verified', // Pre-verified
            isAiVerified: true,
            createdAt: serverTimestamp(),
        });
        revalidatePath('/admin/manage');
        revalidatePath('/explore');
        return { success: true, message: 'Property added successfully!' };
    } catch (e: any) {
        return { success: false, message: e.message };
    }
}
