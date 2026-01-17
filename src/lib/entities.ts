
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
}

export interface Worker {
    uid: string; // Firebase Authentication user ID.
    workerId: string; // Unique identifier for the worker (same as their uid).
    skills?: string[]; // List of worker's skills (e.g., plumber, electrician).
    rating?: number; // Average rating of the worker.
    location?: {
        latitude?: number;
        longitude?: number;
    }; // Geographical location of the worker.
    isVerified: boolean; // Whether the worker is verified.
    bankDetails?: {
        accountNumber?: string;
        ifscCode?: string;
        accountHolderName?: string;
    }; // Bank account details for payouts.
    referredBy?: string; // The ID of the user or worker who referred this worker.
    walletBalance?: number; // The balance of referral earnings for the worker.
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
    ownerId: string; // The user ID of the tool owner
    startDate: any; // Firestore Timestamp
    endDate?: any; // Firestore Timestamp
    status?: "requested" | "accepted" | "payment_pending" | "active" | "completed" | "cancelled";
}

export interface Transaction {
    transactionId: string;
    userId: string; // The ID of the user/worker who this transaction belongs to.
    amount: number;
    type: "referral_commission" | "payout" | "refund";
    sourceJobId?: string; // The job ID that triggered this transaction.
    timestamp?: string;
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
    content?: string; // The AI-generated text for the banner, potentially containing multiple languages separated by a newline.
    style?: string; // A style hint for the UI (e.g., 'dynamic_card').
    backgroundColor?: string; // A suggested hex color code for the banner background.
    lastUpdated?: string;
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
    price: number; // Price in a numerical format (e.g., 4.20 for crores).
    priceUnit: string; // Unit for the price, e.g., 'Cr'.
    sqft: number;
    parking: number;
    imageUrl?: string;
    videoUrl?: string; // URL of the property video walkthrough.
    isAiVerified: boolean; // Whether the property has been verified by AI.
    listingType: "sale" | "rent"; // Whether the property is for sale or for rent.
    vastuScore?: number; // Vastu compliance score from 0 to 10.
}
