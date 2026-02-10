
"use client";

import { useFormState, useFormStatus } from 'react-dom';
import Image from 'next/image';
import { Sparkles, Loader2, Download } from 'lucide-react';
import { createPromoPoster } from '@/app/promote/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useUser } from '@/firebase/provider'; // Assuming useUser gives us the current user

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
         <Button type="submit" disabled={pending} size="lg">
            {pending ? (
            <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Generating...
            </>
            ) : (
            <>
                <Sparkles className="mr-2 h-5 w-5" />
                Generate My WhatsApp Poster
            </>
            )}
        </Button>
    )
}

export function PromoGenerator() {
  const { user } = useUser();
  const initialState = { success: false, message: '', data: null };
  const [state, formAction] = useFormState(createPromoPoster, initialState);

  // Hardcoded for now, in a real app, this would come from the user's profile
  const workerName = user?.displayName || "Suresh Kumar";
  const workerPhotoUri = user?.photoURL || "https://images.unsplash.com/photo-1558611848-73f7eb4001a1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxtYWxlJTIwcGx1bWJlciUyMHBvcnRyYWl0fGVufDB8fHx8MTc2ODc0NjAwN3ww&ixlib=rb-4.1.0&q=80&w=1080";
  
  const handleGenerateClick = async (formData: FormData) => {
    // Convert image URL to data URI for the AI flow
    const response = await fetch(workerPhotoUri);
    const blob = await response.blob();
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = () => {
      const base64data = reader.result as string;
      formData.set('workerPhotoUri', base64data);
      formAction(formData);
    };
  };

  return (
    <Card className="max-w-xl mx-auto shadow-lg">
      <CardContent className="p-6 text-center">
        <form action={handleGenerateClick} className="space-y-6">
            <input type="hidden" name="workerName" value={workerName} />
            <input type="hidden" name="userId" value={user?.uid || ''} />

          {!state.data?.posterDataUri ? (
             <div className="flex flex-col items-center gap-4">
                <Image 
                    src={workerPhotoUri}
                    alt={workerName}
                    width={128}
                    height={128}
                    className="rounded-full border-4 border-primary"
                />
                <h3 className="text-xl font-bold font-headline">{workerName}</h3>
                <p className="text-muted-foreground">Ready to grow your network? Generate a personalized poster to share on WhatsApp and other social media.</p>
                <SubmitButton/>
             </div>
          ) : (
             <div className="space-y-4">
               <h3 className="text-xl font-bold font-headline">Your Poster is Ready!</h3>
               <p className="text-muted-foreground">Download the image below and share it on your WhatsApp Status.</p>
              <div className="relative w-full aspect-square rounded-lg overflow-hidden border">
                <Image src={state.data.posterDataUri} alt="Generated promotional poster" fill objectFit="contain" />
              </div>
                <Button asChild size="lg">
                    <a href={state.data.posterDataUri} download="grihseva-ai-promo.png">
                        <Download className="mr-2 h-5 w-5" />
                        Download Poster
                    </a>
                </Button>
            </div>
          )}
          
          {useFormStatus().pending && (
            <div className="space-y-4">
              <Skeleton className="w-full aspect-square rounded-lg" />
              <p className="text-muted-foreground animate-pulse">AI is creating your masterpiece...</p>
            </div>
          )}


          {state.message && !state.success && (
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{state.message}</AlertDescription>
            </Alert>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
