// This file is auto-generated, do not edit.

export interface User {
    id: string; // Unique identifier for the user.
    name?: string; // User's full name.
    phone?: string; // User's phone number.
    address?: string; // User's address.
    userType: "customer" | "worker" | "doctor"; // Type of user.
    referredBy?: string; // The ID of the user or worker who referred this user.
    walletBalance?: number; // The balance of referral earnings for the user.
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
    workerId: string; // Unique identifier for the worker (same as their userId).
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
}

export interface Rental {
    rentalId: string;
    toolId: string;
    renterId: string; // The user ID of the person renting the tool.
    startDate: string;
    endDate?: string;
    status?: "requested" | "active" | "completed" | "cancelled";
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
