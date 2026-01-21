
'use server';
import { doc, getDoc, updateDoc, collection, addDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { initializeFirebase } from '@/firebase';
import { revalidatePath } from 'next/cache';
import type { Product } from '@/lib/entities';

const PLATFORM_FEE_PERCENTAGE = 0.15; // 15% of final cost
const REFERRAL_COMMISSION_PERCENTAGE = 0.0005; // 0.05% of final cost
const GST_PERCENTAGE = 0.18; // 18% GST

const PLATFORM_ADMIN_UID = 'GRIHSEVA_ADMIN_UID';
const PLATFORM_GST_UID = 'GRIHSEVA_GST_UID';


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

        // --- Fee & Tax Calculation ---
        const platformFeeGross = finalCost * PLATFORM_FEE_PERCENTAGE;
        const platformFeeNet = platformFeeGross / (1 + GST_PERCENTAGE);
        const gstAmount = platformFeeGross - platformFeeNet;
        const workerPayout = finalCost - platformFeeGross;
        const completionTimestamp = serverTimestamp();


        // Update job status and add calculated values for invoice
        await updateDoc(jobRef, {
            status: 'completed',
            platformFee: platformFeeGross,
            gst: gstAmount,
            workerPayout: workerPayout,
            completedAt: completionTimestamp,
        });

        // Update legal agreement status, if it exists
        const agreementRef = doc(firestore, 'legal_agreements', jobId); 
        const agreementSnap = await getDoc(agreementRef);
        if(agreementSnap.exists()){
            await updateDoc(agreementRef, { status: 'completed' });
        }

        const transactionsRef = collection(firestore, 'transactions');
        
        // 1. Net Platform Fee to Admin
        await addDoc(transactionsRef, {
            userId: PLATFORM_ADMIN_UID,
            amount: platformFeeNet,
            type: 'platform_fee',
            sourceJobId: jobId,
            timestamp: completionTimestamp,
        });

        // 2. GST on Platform Fee
        await addDoc(transactionsRef, {
            userId: PLATFORM_GST_UID,
            amount: gstAmount,
            type: 'tax',
            sourceJobId: jobId,
            timestamp: completionTimestamp,
        });

        // 3. Worker Payout
        if (jobData.workerId) {
            await addDoc(transactionsRef, {
                userId: jobData.workerId,
                amount: workerPayout,
                type: 'payout',
                sourceJobId: jobId,
                timestamp: completionTimestamp,
                jobCompletedAt: completionTimestamp, // For the 1-hour rule
            });
        }
        
        // 4. Handle Referral Commission for the customer's referrer
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
                    timestamp: completionTimestamp,
                });
            }
        }
        revalidatePath('/legal-vault');
        revalidatePath(`/chat/${jobId}`);
        revalidatePath('/admin');
        revalidatePath('/dashboard/earnings');
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

// --- NEW ACTIONS FOR PRODUCT DEALS ---

export async function payForShipping(dealId: string): Promise<{success: boolean; message: string}> {
    const { firestore } = initializeFirebase();
    try {
        const dealRef = doc(firestore, 'deals', dealId);
        // In a real app, this would integrate with a payment gateway.
        // For now, we just update the status.
        await updateDoc(dealRef, { status: 'awaiting_shipment' });
        revalidatePath(`/chat/deal-${dealId}`);
        return { success: true, message: 'Payment for shipping received. Awaiting seller to ship.' };
    } catch (e: any) {
        return { success: false, message: e.message };
    }
}

export async function shipItem(dealId: string, trackingNumber: string): Promise<{success: boolean; message: string}> {
    if(!trackingNumber) return { success: false, message: 'Tracking number is required.' };
    const { firestore } = initializeFirebase();
    try {
        const dealRef = doc(firestore, 'deals', dealId);
        await updateDoc(dealRef, { 
            status: 'shipped',
            trackingNumber: trackingNumber,
            shippedAt: serverTimestamp()
        });
        revalidatePath(`/chat/deal-${dealId}`);
        return { success: true, message: 'Tracking number added. Buyer has been notified.' };
    } catch (e: any) {
        return { success: false, message: e.message };
    }
}

export async function cancelDeal(dealId: string): Promise<{success: boolean; message: string}> {
    const { firestore } = initializeFirebase();
    const dealRef = doc(firestore, 'deals', dealId);
    try {
        const dealSnap = await getDoc(dealRef);
        if (!dealSnap.exists()) return { success: false, message: 'Deal not found.' };
        const dealData = dealSnap.data();

        // Update product status
        const productRef = doc(firestore, 'products', dealData.productId);
        await updateDoc(productRef, {
            isReserved: false,
            activeDealId: null,
            reservedUntil: null
        });

        // Update deal status
        await updateDoc(dealRef, { status: 'cancelled' });

        // In a real app, trigger refund of advance payment from escrow.
        
        revalidatePath(`/chat/deal-${dealId}`);
        revalidatePath(`/product-detail?id=${dealData.productId}`);
        return { success: true, message: 'Deal cancelled and advance payment refunded to buyer.' };
    } catch (e: any) {
        return { success: false, message: e.message };
    }
}

export async function confirmProductDelivery(dealId: string): Promise<{success: boolean; message: string}> {
    const { firestore } = initializeFirebase();
    try {
        const dealRef = doc(firestore, 'deals', dealId);
        const dealSnap = await getDoc(dealRef);
        if (!dealSnap.exists()) return { success: false, message: 'Deal not found.' };

        const dealData = dealSnap.data();
        const finalCost = dealData.totalPrice || 0;
        if (finalCost <= 0) return { success: false, message: 'Final cost not set.' };

        // --- Fee & Tax Calculation ---
        const platformFeeGross = finalCost * PLATFORM_FEE_PERCENTAGE;
        const platformFeeNet = platformFeeGross / (1 + GST_PERCENTAGE);
        const gstAmount = platformFeeGross - platformFeeNet;
        const sellerPayout = finalCost - platformFeeGross;
        const completionTimestamp = serverTimestamp();

        // Update deal status
        await updateDoc(dealRef, { status: 'completed' });
        
        // Update product to be permanently sold (or just not reserved)
        const productRef = doc(firestore, 'products', dealData.productId);
        await updateDoc(productRef, { isReserved: false, activeDealId: null });


        const transactionsRef = collection(firestore, 'transactions');
        
        // Transaction for seller payout
        await addDoc(transactionsRef, {
            userId: dealData.sellerId,
            amount: sellerPayout,
            type: 'payout',
            sourceJobId: dealId,
            timestamp: completionTimestamp,
            jobCompletedAt: completionTimestamp,
        });

        // Transaction for platform fee
         await addDoc(transactionsRef, {
            userId: PLATFORM_ADMIN_UID,
            amount: platformFeeNet,
            type: 'platform_fee',
            sourceJobId: dealId,
            timestamp: completionTimestamp,
        });

        // Transaction for GST
        await addDoc(transactionsRef, {
            userId: PLATFORM_GST_UID,
            amount: gstAmount,
            type: 'tax',
            sourceJobId: dealId,
            timestamp: completionTimestamp,
        });

        // Handle Referral Commission for the BUYER's referrer
        const buyerRef = doc(firestore, 'users', dealData.buyerId);
        const buyerSnap = await getDoc(buyerRef);
        if (buyerSnap.exists()) {
            const buyerData = buyerSnap.data();
            if (buyerData.referredBy) {
                const commission = finalCost * REFERRAL_COMMISSION_PERCENTAGE;
                await addDoc(transactionsRef, {
                    userId: buyerData.referredBy,
                    amount: commission,
                    type: 'referral_commission',
                    sourceJobId: dealId,
                    timestamp: completionTimestamp,
                });
            }
        }

        revalidatePath(`/chat/deal-${dealId}`);
        revalidatePath('/admin');
        revalidatePath('/dashboard/earnings');

        return { success: true, message: 'Delivery confirmed and all payments processed.' };
    } catch(e: any) {
        console.error("Confirm Product Delivery Error:", e);
        return { success: false, message: e.message };
    }
}

export async function raiseDispute(dealId: string): Promise<{success: boolean; message: string}> {
    if (!dealId) return { success: false, message: 'Deal ID is required.' };
    const { firestore } = initializeFirebase();
    try {
        const dealRef = doc(firestore, 'deals', dealId);
        await updateDoc(dealRef, { status: 'disputed' });
        revalidatePath(`/chat/deal-${dealId}`);
        revalidatePath('/admin');
        return { success: true, message: 'Dispute has been raised. An admin will review the case.' };
    } catch (e: any) {
        return { success: false, message: e.message };
    }
}

    
    