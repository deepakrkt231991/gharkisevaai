'use server';
import { doc, updateDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { initializeFirebase } from '@/firebase/init';
import { revalidatePath } from 'next/cache';
import type { Product } from '@/lib/entities';

export async function reserveProduct(productId: string, product: Product, userId: string): Promise<{ success: boolean, message: string, dealId?: string }> {
    if (!userId) return { success: false, message: 'User not authenticated.' };

    const { firestore } = initializeFirebase();
    const dealId = `${productId}_${userId.slice(0,5)}`; // Create a unique deal ID
    const productRef = doc(firestore, 'products', productId);
    const dealRef = doc(firestore, 'deals', dealId);

    try {
        const reservationExpiry = new Date();
        reservationExpiry.setDate(reservationExpiry.getDate() + 10); // 10 days expiry

        // Create the deal
        await setDoc(dealRef, {
            dealId: dealId,
            productId: productId,
            sellerId: product.ownerId,
            buyerId: userId,
            productName: product.name,
            productImage: product.imageUrls?.[0] || '',
            totalPrice: product.price,
            advancePaid: product.price * 0.07,
            status: 'reserved',
            createdAt: serverTimestamp(),
            reservedAt: serverTimestamp(),
            reservationExpiresAt: reservationExpiry,
        });

        // Update the product to mark it as reserved
        await updateDoc(productRef, {
            isReserved: true,
            activeDealId: dealId,
            reservedUntil: reservationExpiry,
        });

        revalidatePath(`/product-detail?id=${productId}`);
        revalidatePath(`/chat/deal-${dealId}`);

        return { success: true, message: 'Product reserved successfully!', dealId: dealId };
    } catch (e: any) {
        return { success: false, message: e.message };
    }
}
