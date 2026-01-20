'use server';
/**
 * @fileOverview A service for interacting with worker data in Firestore.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {collection, getDocs, query, where} from 'firebase/firestore';
import {initializeFirebase} from '@/firebase';

// This is the tool the AI agent will use.
export const findVerifiedWorkers = ai.defineTool(
  {
    name: 'findVerifiedWorkers',
    description: 'Finds verified workers based on their skills and general location.',
    inputSchema: z.object({
      skills: z.array(z.string()).optional().describe("A list of skills to filter by (e.g., ['plumber', 'electrician'])."),
      location: z.string().optional().describe("The general location to search within (e.g., 'Delhi')."),
    }),
    outputSchema: z.array(z.object({
        workerId: z.string(),
        name: z.string(),
        skills: z.array(z.string()),
        phone: z.string().optional(),
        rating: z.number().optional(),
        successfulOrders: z.number().optional(),
        certificationsUploaded: z.boolean().optional(),
        shopLicenseUploaded: z.boolean().optional(),
    })),
  },
  async (input) => {
    console.log('Finding workers with input:', input);
    const {firestore} = initializeFirebase();
    
    // In a real app, you'd use a more complex geospatial query.
    // For now, we query for all verified workers and let the AI filter.
    const workersRef = collection(firestore, 'workers');
    let q = query(workersRef, where('isVerified', '==', true));

    // If skills are provided, filter by them
    if (input.skills && input.skills.length > 0) {
        q = query(q, where('skills', 'array-contains-any', input.skills));
    }

    const querySnapshot = await getDocs(q);
    const workers = querySnapshot.docs.map(doc => ({
      workerId: doc.id,
      ...doc.data(),
    })) as any[];

    console.log('Found workers:', workers);
    // The AI will perform the final filtering based on location from the prompt.
    return workers.map(w => ({ 
        workerId: w.workerId, 
        name: w.name, 
        skills: w.skills, 
        phone: w.phone,
        rating: w.rating,
        successfulOrders: w.successfulOrders,
        certificationsUploaded: w.certificationsUploaded,
        shopLicenseUploaded: w.shopLicenseUploaded
    }));
  }
);
