
'use server';
import { initializeFirebase } from '@/firebase/init';
import { doc, updateDoc, deleteDoc, collection, addDoc, serverTimestamp, writeBatch } from "firebase/firestore";
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { generateTrustCertificate } from '@/ai/flows/certificate-generator-agent';
import { createPromotionalContent } from '@/ai/flows/content-creator-agent';

export type PosterState = {
    success: boolean;
    message: string;
    data: { posterDataUri: string; } | null;
}

const WorkerPosterSchema = z.object({
  workerName: z.string().min(1),
  workerPhotoUrl: z.string().url(),
});

export async function generateAdminPromoPoster(prevState: PosterState, formData: FormData): Promise<PosterState> {
    const validated = WorkerPosterSchema.safeParse({
        workerName: formData.get('workerName'),
        workerPhotoUrl: formData.get('workerPhotoUrl'),
    });

    if (!validated.success) {
        return { success: false, message: validated.error.errors[0].message, data: null };
    }
    
    try {
        const response = await fetch(validated.data.workerPhotoUrl);
        const blob = await response.blob();
        const reader = new FileReader();
        const dataUri = await new Promise<string>((resolve, reject) => {
            reader.onloadend = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });

        const result = await createPromotionalContent({
            userName: validated.data.workerName,
            userPhotoUri: dataUri,
            referralCode: 'ADMIN_GENERATED'
        });

        return { success: true, message: 'Poster generated!', data: result };

    } catch (e: any) {
        return { success: false, message: e.message, data: null };
    }
}


export async function approveWorker(workerId: string): Promise<{success: boolean, message: string}> {
    const { firestore } = initializeFirebase();
    try {
        const workerRef = doc(firestore, 'workers', workerId);
        await updateDoc(workerRef, { isVerified: true });
        revalidatePath('/admin');
        return { success: true, message: 'Worker approved.' };
    } catch(e: any) {
        return { success: false, message: e.message };
    }
}

export async function rejectWorker(workerId: string): Promise<{success: boolean, message: string}> {
    const { firestore } = initializeFirebase();
    try {
        const workerRef = doc(firestore, 'workers', workerId);
        await deleteDoc(workerRef);
        revalidatePath('/admin');
        return { success: true, message: 'Worker profile rejected and deleted.' };
    } catch(e: any) {
        return { success: false, message: e.message };
    }
}

export async function approvePropertyAndGenerateCertificate(propertyId: string): Promise<{success: boolean, message: string}> {
    const { firestore } = initializeFirebase();
    const propertyRef = doc(firestore, 'properties', propertyId);
    try {
        const propSnap = await doc(firestore, 'properties', propertyId).get();
        const propData = propSnap.data();
        if (!propData) throw new Error("Property not found");
        
        const userSnap = await doc(firestore, 'users', propData.ownerId).get();
        const userData = userSnap.data();

        const certificateResult = await generateTrustCertificate({
            ownerName: userData?.name || 'Valued User',
            propertyId: propertyId,
            verificationDate: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
        });

        if (!certificateResult.certificateUrl) {
            throw new Error("Failed to generate certificate image.");
        }

        await updateDoc(propertyRef, { 
            verificationStatus: 'verified',
            isAiVerified: true, // Legacy field
            certificateUrl: certificateResult.certificateUrl,
            certificateGeneratedAt: serverTimestamp(),
        });
        
        revalidatePath('/admin');
        revalidatePath(`/property-detail?id=${propertyId}`);

        return { success: true, message: 'Property approved and certificate generated.' };
    } catch (e: any) {
        console.error("Approval/Certificate Error:", e);
        return { success: false, message: e.message };
    }
}

export async function rejectProperty(propertyId: string): Promise<{success: boolean, message: string}> {
     const { firestore } = initializeFirebase();
    try {
        const propertyRef = doc(firestore, 'properties', propertyId);
        await updateDoc(propertyRef, { verificationStatus: 'rejected' });
        revalidatePath('/admin');
        return { success: true, message: 'Property rejected.' };
    } catch(e: any) {
        return { success: false, message: e.message };
    }
}

export async function markPayoutAsProcessed(transactionId: string): Promise<{success: boolean, message: string}> {
    const { firestore } = initializeFirebase();
    try {
        const txRef = doc(firestore, 'transactions', transactionId);
        await updateDoc(txRef, { status: 'processed' });
        revalidatePath('/admin');
        return { success: true, message: `Transaction ${transactionId} marked as paid.` };
    } catch(e: any) {
        return { success: false, message: e.message };
    }
}


const PLATFORM_ADMIN_UID = 'GRIHSEVA_ADMIN_UID';

export async function withdrawAdminFunds(amount: number): Promise<{ success: boolean, message: string }> {
    if (amount <= 0) return { success: false, message: 'Invalid withdrawal amount.' };

    const { firestore } = initializeFirebase();
    try {
        const transactionsRef = collection(firestore, 'transactions');
        await addDoc(transactionsRef, {
            userId: PLATFORM_ADMIN_UID,
            amount: -Math.abs(amount), // Store as a negative value to represent withdrawal
            type: 'admin_withdrawal',
            status: 'processed',
            sourceType: 'admin_panel',
            timestamp: serverTimestamp(),
        });

        revalidatePath('/admin');
        return { success: true, message: `Withdrawal of ₹${amount.toFixed(2)} recorded.` };
    } catch (e: any) {
        return { success: false, message: e.message };
    }
}


// --- BANNER MANAGEMENT ---

export type BannerState = {
  success: boolean;
  message: string;
}

const BannerSchema = z.object({
  title: z.string().min(3),
  subtitle: z.string().min(5),
  imageUrl: z.string().url(),
  link: z.string().url(),
});

export async function createBanner(prevState: BannerState, formData: FormData): Promise<BannerState> {
  const validated = BannerSchema.safeParse({
    title: formData.get('title'),
    subtitle: formData.get('subtitle'),
    imageUrl: formData.get('imageUrl'),
    link: formData.get('link'),
  });

  if (!validated.success) {
    return { success: false, message: validated.error.errors[0].message };
  }
  
  const { firestore } = initializeFirebase();
  try {
    const bannersRef = collection(firestore, 'banners');
    await addDoc(bannersRef, validated.data);
    revalidatePath('/admin');
    revalidatePath('/'); // To update home page
    return { success: true, message: 'Banner created successfully!' };
  } catch (e: any) {
    return { success: false, message: e.message };
  }
}

    