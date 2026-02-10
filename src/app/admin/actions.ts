
'use server';
import { doc, updateDoc, deleteDoc, addDoc, collection, serverTimestamp, getDoc } from 'firebase/firestore';
import { initializeFirebase } from '@/firebase/init';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { createPromotionalContent, type CreateContentOutput } from '@/ai/flows/content-creator-agent';
import { createSocialMediaAd, type SocialMediaAdOutput } from '@/ai/flows/social-media-agent';
import { verifyPropertyDocs } from '@/ai/flows/property-verification-agent';
import { generateTrustCertificate } from '@/ai/flows/certificate-generator-agent';

const PLATFORM_ADMIN_UID = 'GRIHSEVA_ADMIN_UID';

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
      referralCode: 'ADMIN_PROMO'
    });
    
    return { success: true, message: 'Poster generated!', data: result };

  } catch(e: any) {
    return { success: false, message: e.message || 'An unknown error occurred.', data: null };
  }
}

export type AdState = {
    success: boolean;
    message: string;
    data: SocialMediaAdOutput | null;
};

const SocialMediaAdInputSchema = z.object({
  topic: z.string().min(3, { message: 'Please provide a topic for the ad.'}),
  platform: z.enum(["Facebook", "LinkedIn", "Instagram"]),
});

export async function generateSocialAd(
    prevState: AdState,
    formData: FormData
): Promise<AdState> {
    const validatedFields = SocialMediaAdInputSchema.safeParse({
        topic: formData.get('topic'),
        platform: formData.get('platform'),
    });

    if (!validatedFields.success) {
        return { success: false, message: validatedFields.error.errors[0].message, data: null };
    }

    try {
        const result = await createSocialMediaAd(validatedFields.data);
        return { success: true, message: 'Ad copy generated!', data: result };
    } catch(e: any) {
        return { success: false, message: e.message || 'An unknown error occurred.', data: null };
    }
}

export async function withdrawAdminFunds(amount: number): Promise<{ success: boolean; message: string }> {
    if (amount <= 0) {
        return { success: false, message: 'Withdrawal amount must be positive.' };
    }

    const { firestore } = initializeFirebase();
    const transactionsRef = collection(firestore, 'transactions');

    try {
        await addDoc(transactionsRef, {
            userId: PLATFORM_ADMIN_UID,
            amount: -Math.abs(amount), // Ensure withdrawal is a negative number
            type: 'admin_withdrawal',
            sourceJobId: `ADMIN_WITHDRAWAL_${new Date().toISOString()}`,
            timestamp: serverTimestamp(),
            status: 'processed'
        });
        
        revalidatePath('/admin'); // Revalidate to update the dashboard totals

        return { success: true, message: `Withdrawal of ₹${amount.toFixed(2)} has been successfully logged.` };

    } catch (e: any) {
        return { success: false, message: e.message || 'An error occurred while logging the withdrawal.' };
    }
}


// --- PROPERTY VERIFICATION ACTIONS ---

export async function approvePropertyAndGenerateCertificate(propertyId: string): Promise<{ success: boolean; message: string }> {
    if (!propertyId) {
        return { success: false, message: 'Property ID is required.' };
    }
    const { firestore } = initializeFirebase();
    const propertyRef = doc(firestore, 'properties', propertyId);

    try {
        // 1. Get property and owner data
        const propertySnap = await getDoc(propertyRef);
        if (!propertySnap.exists()) throw new Error('Property not found.');
        const propertyData = propertySnap.data();

        const ownerRef = doc(firestore, 'users', propertyData.ownerId);
        const ownerSnap = await getDoc(ownerRef);
        if (!ownerSnap.exists()) throw new Error('Property owner not found.');
        const ownerData = ownerSnap.data();

        // 2. Generate Certificate
        const verificationDate = new Date().toLocaleDateString('en-GB', {
            day: 'numeric', month: 'long', year: 'numeric'
        });

        const certificateResult = await generateTrustCertificate({
            ownerName: ownerData.name || 'Valued User',
            propertyId: propertyId,
            verificationDate: verificationDate,
        });

        if (!certificateResult.certificateUrl) {
            throw new Error('AI failed to generate the certificate image.');
        }

        // 3. Update property with verified status and certificate URL
        await updateDoc(propertyRef, {
            verificationStatus: 'verified',
            certificateUrl: certificateResult.certificateUrl,
            certificateGeneratedAt: serverTimestamp(),
        });
        
        revalidatePath('/admin');
        revalidatePath('/dashboard/seller');

        return { success: true, message: 'Property approved and certificate issued!' };

    } catch (e: any) {
        console.error("Error approving property and generating certificate:", e);
        return { success: false, message: e.message || 'An unknown error occurred.' };
    }
}

export async function rejectProperty(propertyId: string): Promise<{ success: boolean; message: string }> {
    if (!propertyId) {
        return { success: false, message: 'Property ID is required.' };
    }
    const { firestore } = initializeFirebase();
    const propertyRef = doc(firestore, 'properties', propertyId);
    try {
        await updateDoc(propertyRef, { verificationStatus: 'rejected' });
        revalidatePath('/admin');
        return { success: true, message: 'Property has been rejected.' };
    } catch (e: any) {
        return { success: false, message: e.message };
    }
}

// --- PAYOUT ACTIONS ---
export async function markPayoutAsProcessed(transactionId: string): Promise<{ success: boolean; message: string }> {
    if (!transactionId) {
        return { success: false, message: 'Transaction ID is required.' };
    }
    const { firestore } = initializeFirebase();
    const transactionRef = doc(firestore, 'transactions', transactionId);
    try {
        await updateDoc(transactionRef, { status: 'processed' });
        revalidatePath('/admin');
        return { success: true, message: 'Payout marked as processed.' };
    } catch (e: any) {
        return { success: false, message: `Failed to update transaction: ${e.message}` };
    }
}
