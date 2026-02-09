
// This file is auto-generated, do not edit.

export interface User {
    uid: string; // Firebase Authentication user ID.
    name?: string; // User's full name.
    phone?: string; // User's phone number.
    address?: string; // User's address.
    userType: "customer" | "worker" | "doctor"; // Type of user.
    referredBy?: string; // The ID of the user or worker who referred this user.
    walletBalance?: number; // The balance of referral earnings for the user.
    photoURL?: string; // User's photo URL
    language?: string; // The user's preferred language code (e.g., 'en', 'hi').
}

export interface Job {
    jobId: string; // Unique identifier for the job.
    customerId: string; // ID of the customer who created the job.
    workerId?: string; // ID of the worker assigned to the job.
    problem_image_url?: string; // URL of the uploaded problem image.
    completion_image_url?: string; // URL of the image uploaded by the worker upon completion.
    ai_diagnosis?: string; // Diagnosis provided by the AI.
    estimated_cost?: string; // Estimated cost provided by the AI.
    final_cost?: number; // The final agreed-upon cost for the job.
    paymentId?: string; // ID of the payment transaction from the payment gateway.
    paymentStatus?: "pending" | "held_in_escrow" | "paid_to_worker" | "refunded"; // The status of the payment.
    status: "pending_diagnosis" | "awaiting_payment" | "worker_assigned" | "in_progress" | "pending_confirmation" | "completed" | "disputed" | "cancelled"; // Current status of the job.
    otp?: string; // A one-time password sent to the user to verify the start of the job.
    platformFee?: number;
    gst?: number;
    workerPayout?: number;
    completedAt?: any; // Firestore Timestamp
    rating?: number; // The star rating (1-5) given by the customer upon job completion.
    reviewText?: string; // The written review or comment from the customer.
}

export interface Worker {
    uid: string; // Firebase Authentication user ID.
    workerId: string; // Unique identifier for the worker (same as their uid).
    name?: string; // Worker's name
    phone?: string; // Worker's phone
    skills?: string[]; // List of worker's skills (e.g., plumber, electrician).
    rating?: number; // Average rating of the worker.
    location?: {
        latitude?: number;
        longitude?: number;
    }; // Geographical location of the worker.
    isVerified: boolean; // Whether the worker is verified by an admin.
    bankDetails?: {
        accountNumber?: string;
        ifscCode?: string;
        accountHolderName?: string;
    }; // Bank account details for payouts.
    referredBy?: string; // The ID of the user or worker who referred this worker.
    walletBalance?: number; // The balance of referral earnings for the worker.
    certificationsUploaded?: boolean;
    shopLicenseUploaded?: boolean;
    successfulOrders?: number;
    portfolioImageUrls?: string[];
    createdAt?: any; // Firestore Timestamp
    shopPhotoUrl?: string;
    bio?: string; // A short bio or description written by the worker.
}

export interface Health {
    userId: string; // ID of the user this record belongs to.
    appliance_name: string; // Name of the appliance (e.g., AC, Fridge).
    last_service_date?: string; // Last service date of the appliance.
    next_service_due_date?: string; // Next scheduled service date.
    amc_status?: "active" | "inactive"; // Status of the Annual Maintenance Contract.
}

export interface Tool {
    toolId: string;
    ownerId: string; // The worker ID of the tool owner.
    name: string;
    description?: string;
    rental_price_per_day: number;
    is_available?: boolean;
    imageUrl?: string;
    location?: string;
    deposit?: number;
}

export interface Rental {
    rentalId: string;
    toolId: string;
    renterId: string; // The user ID of the person renting the tool.
    ownerId: string; // The worker ID of the tool owner.
    startDate: any; // Firestore Timestamp
    endDate?: any; // Firestore Timestamp
    totalCost?: number;
    status?: "requested" | "accepted" | "payment_pending" | "active" | "completed" | "cancelled" | "disputed";
}

export interface Transaction {
    transactionId: string;
    userId: string; // The ID of the user/worker who this transaction belongs to.
    amount: number;
    type: "referral_commission" | "payout" | "refund" | "platform_fee" | "tax" | "admin_withdrawal";
    sourceJobId?: string; // The job, deal, or rental ID that triggered this transaction.
    sourceType?: "job" | "deal" | "rental"; // The type of source that generated the transaction.
    timestamp?: any; // Firestore Timestamp
    jobCompletedAt?: any; // Firestore Timestamp
}

export interface SOSAlert {
    alertId: string;
    userId: string; // The ID of the user/worker who triggered the alert.
    location: {
        latitude?: number;
        longitude?: number;
    }; // Geographical location where the alert was triggered.
    timestamp: string;
    status: "active" | "resolved";
    audio_url?: string; // URL of the background audio recording.
}

export interface AppSettings {
    lastUpdated?: any; // Firestore Timestamp
}

export interface Banner {
    title: string;
    subtitle: string;
    imageUrl: string;
    link: string;
}

export interface LegalAgreement {
    agreementId: string; // Unique ID for the agreement.
    dealId: string; // The associated Deal ID.
    buyerId: string;
    sellerId: string;
    buyerName?: string;
    sellerName?: string;
    itemName: string;
    itemCondition?: string;
    finalPrice: number;
    status: "active" | "completed";
    createdAt?: any; // Firestore Timestamp
}

export interface Property {
    propertyId: string; // Unique ID for the property.
    ownerId: string; // The user ID of the person who listed the property.
    title: string; // Title of the listing, e.g., '4 BHK Luxury Suite'.
    location: string; // City and area, e.g., 'Worli, Mumbai'.
    geo?: {
        latitude: number;
        longitude: number;
    };
    price?: number; // Price in a numerical format (e.g., 4.20 for crores).
    priceUnit?: string; // Unit for the price, e.g., 'Cr'.
    rentAmount?: number;
    depositAmount?: number;
    agreementYears?: number;
    sqft: number;
    parking: number;
    imageUrl?: string;
    videoUrl?: string; // URL of the property video walkthrough.
    listingType: "sale" | "rent"; // Whether the property is for sale or for rent.
    vastuScore?: number; // Vastu compliance score from 0 to 10.
    verificationStatus: "pending" | "verified" | "rejected" | "review_needed";
    verificationNotes?: string;
    utilityBillUrl?: string;
    taxPaperUrl?: string;
    aadharUrl?: string;
    panUrl?: string;
    certificateUrl?: string;
    certificateGeneratedAt?: any; // Firestore Timestamp
    createdAt?: any; // Firestore Timestamp
}

export interface Product {
    productId: string;
    ownerId: string;
    name: string;
    category?: string;
    price: number;
    description?: string;
    location?: string;
    imageUrls?: string[];
    videoUrl?: string;
    isReserved?: boolean;
    isReservedEnabled?: boolean;
    reservedUntil?: any; // Firestore Timestamp
    activeDealId?: string;
    createdAt?: any; // Firestore Timestamp
}

export interface Deal {
    dealId: string;
    productId: string;
    sellerId: string;
    buyerId: string;
    productName?: string;
    productImage?: string;
    totalPrice: number;
    status: "negotiating" | "reserved" | "awaiting_shipment_payment" | "awaiting_shipment" | "shipped" | "delivery_confirmed" | "completed" | "cancelled" | "refunded" | "disputed";
    advancePaid?: number;
    finalPaymentPaid?: number;
    deliveryMethod?: "pickup" | "courier";
    trackingNumber?: string;
    createdAt?: any; // Firestore Timestamp
    reservedAt?: any; // Firestore Timestamp
    reservationExpiresAt?: any; // Firestore Timestamp
    shippedAt?: any; // Firestore Timestamp
}
