'use server';
import { doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { initializeFirebase } from '@/firebase';
import { revalidatePath } from 'next/cache';

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
