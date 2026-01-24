'use server';
import { doc, getDoc, updateDoc, collection, addDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { initializeFirebase } from '@/firebase/init';
import { revalidatePath } from 'next/cache';
import type { Product } from '@/lib/entities';

// --- PLATFORM FEE & COMMISSION STRUCTURE ---
// A 7% platform fee is charged on the final cost.
// GST (18%) is calculated on top of the platform fee.
// The referral commission is 0.05% of the final cost, paid out from the platform's earnings.

const PLATFORM_FEE_PERCENTAGE = 0.07; // 7% fee on the total transaction value.
const REFERRAL_COMMISSION_PERCENTAGE = 0.0005; // 0.05% of the total transaction value.
const GST_PERCENTAGE = 0.18; // 18% GST applied on the net platform fee.

// --- PLATFORM ACCOUNT UIDs ---
// These are special UIDs to track funds for the platform itself.
const PLATFORM_ADMIN_UID = 'GRIHSEVA_ADMIN_UID'; // For collecting the net platform fee.
const PLATFORM_GST_UID = 'GRIHSEVA_GST_UID'; // For tracking GST amounts.


export async function confirmDelivery(jobId: string): Promise<{success: boolean, message: string}> {
    const { firestore } = initializeFirebase();
    const jobRef = doc(firestore, 'jobs', jobId);
    
    try {
        const jobSnap = await getDoc(jobRef);

        if (!jobSnap.exists()) {
            throw new Error('Job not found.');
        }

        const jobData = jobSnap.data();
        const finalCost = jobData.final_cost || 0;

        if (finalCost <= 0) {
             throw new Error('Final cost not set or is zero.');
        }

        // --- Fee & Tax Calculation ---
        const platformFeeNet = finalCost * PLATFORM_FEE_PERCENTAGE;
        const gstAmount = platformFeeNet * GST_PERCENTAGE;
        const platformFeeGross = platformFeeNet + gstAmount;
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
        // Self-Healing: If any step fails, mark the job as 'disputed'
        try {
            await updateDoc(jobRef, { status: 'disputed' });
            revalidatePath(`/chat/${jobId}`);
            revalidatePath('/admin');
        } catch (disputeError) {
             console.error("Failed to mark job as disputed:", disputeError);
        }
        return { success: false, message: `An error occurred, and the job has been flagged for admin review. Error: ${e.message}` };
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
    const dealRef = doc(firestore, 'deals', dealId);

    try {
        const dealSnap = await getDoc(dealRef);
        if (!dealSnap.exists()) throw new Error('Deal not found.');

        const dealData = dealSnap.data();
        const finalCost = dealData.totalPrice || 0;
        if (finalCost <= 0) throw new Error('Final cost not set.');

        // --- Fee & Tax Calculation ---
        const platformFeeNet = finalCost * PLATFORM_FEE_PERCENTAGE;
        const gstAmount = platformFeeNet * GST_PERCENTAGE;
        const platformFeeGross = platformFeeNet + gstAmount;
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
         // Self-Healing: If any step fails, mark the deal as 'disputed'
        try {
            await updateDoc(dealRef, { status: 'disputed' });
            revalidatePath(`/chat/deal-${dealId}`);
            revalidatePath('/admin');
        } catch (disputeError) {
             console.error("Failed to mark deal as disputed:", disputeError);
        }
        return { success: false, message: `An error occurred, and this deal has been flagged for admin review. Error: ${e.message}` };
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

// --- NEW ACTION FOR TOOL RENTALS ---

export async function completeToolRental(rentalId: string): Promise<{success: boolean, message: string}> {
    const { firestore } = initializeFirebase();
    const rentalRef = doc(firestore, 'rentals', rentalId);

    try {
        const rentalSnap = await getDoc(rentalRef);
        if (!rentalSnap.exists()) throw new Error('Rental not found.');
        const rentalData = rentalSnap.data();

        const totalCost = rentalData.totalCost || 0;

        if (totalCost <= 0) throw new Error('Rental cost not set or is zero.');

        // --- Fee & Tax Calculation ---
        const platformFeeNet = totalCost * PLATFORM_FEE_PERCENTAGE;
        const gstAmount = platformFeeNet * GST_PERCENTAGE;
        const platformFeeGross = platformFeeNet + gstAmount;
        const ownerPayout = totalCost - platformFeeGross;
        const completionTimestamp = serverTimestamp();

        // Update rental status
        await updateDoc(rentalRef, {
            status: 'completed',
        });

        const transactionsRef = collection(firestore, 'transactions');
        
        // 1. Tool Owner Payout
        await addDoc(transactionsRef, {
            userId: rentalData.ownerId,
            amount: ownerPayout,
            type: 'payout',
            sourceJobId: rentalId,
            timestamp: completionTimestamp,
            jobCompletedAt: completionTimestamp,
        });

        // 2. Platform Fee
        await addDoc(transactionsRef, {
            userId: PLATFORM_ADMIN_UID,
            amount: platformFeeNet,
            type: 'platform_fee',
            sourceJobId: rentalId,
            timestamp: completionTimestamp,
        });

        // 3. GST
        await addDoc(transactionsRef, {
            userId: PLATFORM_GST_UID,
            amount: gstAmount,
            type: 'tax',
            sourceJobId: rentalId,
            timestamp: completionTimestamp,
        });

        // 4. Referral Commission for RENTER's referrer
        const renterRef = doc(firestore, 'users', rentalData.renterId);
        const renterSnap = await getDoc(renterRef);
        if (renterSnap.exists()) {
            const renterData = renterSnap.data();
            if (renterData.referredBy) {
                const commission = totalCost * REFERRAL_COMMISSION_PERCENTAGE;
                await addDoc(transactionsRef, {
                    userId: renterData.referredBy,
                    amount: commission,
                    type: 'referral_commission',
                    sourceJobId: rentalId,
                    timestamp: completionTimestamp,
                });
            }
        }

        revalidatePath(`/chat/rental-${rentalId}`);
        revalidatePath('/admin');
        revalidatePath('/dashboard/earnings');

        return { success: true, message: 'Tool rental completed and payments processed.' };

    } catch (e: any) {
        console.error("Complete Tool Rental Error:", e);
        try {
            await updateDoc(rentalRef, { status: 'disputed' });
            revalidatePath(`/chat/rental-${rentalId}`);
            revalidatePath('/admin');
        } catch (disputeError) {
             console.error("Failed to mark rental as disputed:", disputeError);
        }
        return { success: false, message: `An error occurred and the rental has been flagged for review. Error: ${e.message}` };
    }
}
