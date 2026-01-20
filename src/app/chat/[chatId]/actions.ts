'use server';
import { doc, getDoc, updateDoc, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { initializeFirebase } from '@/firebase';
import { revalidatePath } from 'next/cache';

const PLATFORM_FEE_PERCENTAGE = 0.05; // 5%
const REFERRAL_COMMISSION_PERCENTAGE = 0.0005; // 0.05%
const PLATFORM_ADMIN_UID = 'GRIHSEVA_ADMIN_UID'; // A constant UID for platform earnings

export async function confirmDelivery(jobId: string): Promise<{success: boolean, message: string}> {
    const { firestore } = initializeFirebase();
    try {
        const jobRef = doc(firestore, 'jobs', jobId);
        const jobSnap = await getDoc(jobRef);

        if (!jobSnap.exists()) {
            return { success: false, message: 'Job not found.' };
        }

        const jobData = jobSnap.data();
        const finalCost = jobData.final_cost || 0;

        if (finalCost <= 0) {
             return { success: false, message: 'Final cost not set or is zero.' };
        }

        // Update job status
        await updateDoc(jobRef, { status: 'completed' });

        // Update legal agreement status, if it exists
        const agreementRef = doc(firestore, 'legal_agreements', jobId); 
        const agreementSnap = await getDoc(agreementRef);
        if(agreementSnap.exists()){
            await updateDoc(agreementRef, { status: 'completed' });
        }

        const transactionsRef = collection(firestore, 'transactions');
        
        // 1. Calculate Platform Fee
        const platformFee = finalCost * PLATFORM_FEE_PERCENTAGE;
        await addDoc(transactionsRef, {
            userId: PLATFORM_ADMIN_UID,
            amount: platformFee,
            type: 'platform_fee',
            sourceJobId: jobId,
            timestamp: serverTimestamp(),
        });

        // 2. Calculate and process Worker Payout
        if (jobData.workerId) {
            const workerPayout = finalCost - platformFee;
            await addDoc(transactionsRef, {
                userId: jobData.workerId,
                amount: workerPayout,
                type: 'payout',
                sourceJobId: jobId,
                timestamp: serverTimestamp(),
            });
        }
        
        // 3. Handle Referral Commission for the customer's referrer
        const customerRef = doc(firestore, 'users', jobData.customerId);
        const customerSnap = await getDoc(customerRef);
        if (customerSnap.exists()) {
            const customerData = customerSnap.data();
            if (customerData.referredBy) {
                const commission = finalCost * REFERRAL_COMMISSION_PERCENTAGE;
                await addDoc(transactionsRef, {
                    userId: customerData.referredBy,
                    amount: commission,
                    type: 'referral_commission',
                    sourceJobId: jobId,
                    timestamp: serverTimestamp(),
                });
            }
        }
        revalidatePath('/legal-vault');
        revalidatePath(`/chat/${jobId}`);
        revalidatePath('/admin');
        return { success: true, message: 'Deal completed and all payments processed.' };
    } catch(e: any) {
        console.error("Confirm Delivery Error:", e);
        return { success: false, message: e.message };
    }
}

export async function requestRefund(jobId: string): Promise<{success: boolean, message: string}> {
     const { firestore } = initializeFirebase();
    try {
        const jobRef = doc(firestore, 'jobs', jobId);
        await updateDoc(jobRef, { status: 'refunded', paymentStatus: 'refunded' });
        revalidatePath(`/chat/${jobId}`);
        return { success: true, message: 'Refund processed.' };
    } catch(e: any) {
        console.error("Request Refund Error:", e);
        return { success: false, message: e.message };
    }
}

    