# **App Name**: GrihSevaAI

## Core Features:

- User Authentication: Implement Firebase Phone/Email Authentication for secure user access.
- Worker Profiles: Allow workers to create profiles detailing their skills, location, and availability.
- Image-Based Defect Identification: Enable users to upload images of home defects; utilize the Gemini 1.5 Flash model via Firebase Vertex AI to identify the issue and estimate repair costs.
- AI Repair Estimation (Hindi): Translate image analysis results into repair estimates, providing details and costs in Hindi.
- Automated Worker Matching: Use Cloud Functions (TypeScript) to automatically match users with suitable workers based on location, skills, and availability.
- In-App Payment Handling: Implement secure payment processing within the app using Cloud Functions.
- Booking Management: Provide a user interface for managing bookings, viewing booking status, and communicating with workers.

## Style Guidelines:

- Primary color: Warm orange (#FF9933) to convey reliability and energy.
- Background color: Light beige (#F5F5DC), subtly reminiscent of traditional Indian homes, to offer a calming backdrop.
- Accent color: Teal (#3CB371) for call-to-action buttons and interactive elements, ensuring contrast.
- Body font: 'PT Sans', a humanist sans-serif suitable for body text, giving a modern, readable feel.
- Headline font: 'Alegreya', a humanist serif suitable for headlines, which provides an elegant, intellectual feel.
- Use clear, representative icons to visually communicate service categories (plumbing, electrical, etc.)
- Implement a clean, intuitive card-based layout to present workers and services, for a friendly feel.
- Incorporate smooth transitions and loading animations to enhance user experience.