'use server';
import { doc, getDoc, updateDoc, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { initializeFirebase } from '@/firebase';
import { revalidatePath } from 'next/cache';

export async function confirmDelivery(jobId: string): Promise<{success: boolean, message: string}> {
    const { firestore } = initializeFirebase();
    try {
        const jobRef = doc(firestore, 'jobs', jobId);
        const jobSnap = await getDoc(jobRef);

        if (!jobSnap.exists()) {
            return { success: false, message: 'Job not found.' };
        }

        const jobData = jobSnap.data();

        // Update job status
        await updateDoc(jobRef, { status: 'completed' });

        // Update legal agreement status, assuming agreementId is same as jobId/dealId
        const agreementRef = doc(firestore, 'legal_agreements', jobId); 
        const agreementSnap = await getDoc(agreementRef);
        if(agreementSnap.exists()){
            await updateDoc(agreementRef, { status: 'completed' });
        }

        // Handle referral commission
        const customerRef = doc(firestore, 'users', jobData.customerId);
        const customerSnap = await getDoc(customerRef);
        if (customerSnap.exists()) {
            const customerData = customerSnap.data();
            if (customerData.referredBy && (jobData.final_cost || agreementSnap.data()?.finalPrice)) {
                const finalCost = jobData.final_cost || agreementSnap.data()?.finalPrice;
                const commission = finalCost * 0.0005;

                const transactionsRef = collection(firestore, 'transactions');
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
        return { success: true, message: 'Deal completed and commission processed.' };
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
