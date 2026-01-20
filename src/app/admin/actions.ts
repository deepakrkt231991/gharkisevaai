'use server';
import { doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { initializeFirebase } from '@/firebase';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { createPromotionalContent, type CreateContentOutput } from '@/ai/flows/content-creator-agent';
import { createSocialMediaAd, SocialMediaAdInputSchema, type SocialMediaAdOutput } from '@/ai/flows/social-media-agent';

export async function approveWorker(workerId: string): Promise<{ success: boolean; message: string }> {
    if (!workerId) {
        return { success: false, message: 'Worker ID is required.' };
    }
    const { firestore } = initializeFirebase();
    const workerRef = doc(firestore, 'workers', workerId);
    try {
        await updateDoc(workerRef, { isVerified: true });
        revalidatePath('/admin');
        return { success: true, message: 'Worker approved successfully.' };
    } catch (e: any) {
        return { success: false, message: e.message };
    }
}

export async function rejectWorker(workerId: string): Promise<{ success: boolean; message: string }> {
    if (!workerId) {
        return { success: false, message: 'Worker ID is required.' };
    }
    const { firestore } = initializeFirebase();
    const workerRef = doc(firestore, 'workers', workerId);
    try {
        await deleteDoc(workerRef);
        revalidatePath('/admin');
        return { success: true, message: 'Worker rejected and profile deleted.' };
    } catch (e: any) {
        return { success: false, message: e.message };
    }
}

const CreatePromoSchema = z.object({
  workerName: z.string().min(1, { message: 'Worker name is required.' }),
  workerPhotoUrl: z.string().url({ message: 'Please enter a valid URL.' })
});

export type PosterState = {
  success: boolean;
  message: string;
  data: CreateContentOutput | null;
};

export async function generateAdminPromoPoster(
  prevState: PosterState,
  formData: FormData
): Promise<PosterState> {
  const validatedFields = CreatePromoSchema.safeParse({
    workerName: formData.get('workerName'),
    workerPhotoUrl: formData.get('workerPhotoUrl'),
  });

  if (!validatedFields.success) {
      return { success: false, message: 'Invalid input.', data: null };
  }
  
  try {
    const response = await fetch(validatedFields.data.workerPhotoUrl);
    if (!response.ok) {
        throw new Error(`Failed to fetch image from URL: ${response.statusText}`);
    }
    const imageBuffer = await response.arrayBuffer();
    const contentType = response.headers.get('content-type') || 'image/jpeg';
    const base64data = `data:${contentType};base64,${Buffer.from(imageBuffer).toString('base64')}`;
    
    const result = await createPromotionalContent({
      workerPhotoUri: base64data,
      workerName: validatedFields.data.workerName,
    });
    
    return { success: true, message: 'Poster generated!', data: result };

  } catch(e: any) {
    return { success: false, message: e.message || 'An unknown error occurred.', data: null };
  }
}

// NEW ACTION FOR SOCIAL MEDIA
export type AdState = {
    success: boolean;
    message: string;
    data: SocialMediaAdOutput | null;
};

export async function generateSocialAd(
    prevState: AdState,
    formData: FormData
): Promise<AdState> {
    const validatedFields = SocialMediaAdInputSchema.safeParse({
        topic: formData.get('topic'),
        platform: formData.get('platform'),
    });

    if (!validatedFields.success) {
        return { success: false, message: 'Invalid input for ad generation.', data: null };
    }

    try {
        const result = await createSocialMediaAd(validatedFields.data);
        return { success: true, message: 'Ad copy generated!', data: result };
    } catch(e: any) {
        return { success: false, message: e.message || 'An unknown error occurred.', data: null };
    }
}
