
"use client";

import { useFormState, useFormStatus } from 'react-dom';
import Image from 'next/image';
import { Sparkles, Loader2, Download, Share2 } from 'lucide-react';
import { generateSalePoster } from '@/app/share-sale/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useUser } from '@/firebase/provider';
import { Label } from './ui/label';
import { Input } from './ui/input';

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
                Generate "Just Sold" Poster
            </>
            )}
        </Button>
    )
}

export function SalePosterGenerator() {
  const { user } = useUser();
  const initialState = { success: false, message: '', data: null };
  const [state, formAction] = useFormState(generateSalePoster, initialState);
  const { pending } = useFormStatus();


  // Use user's display name as default, but allow editing.
  const sellerName = user?.displayName || "A Happy User";
  
  return (
    <Card className="max-w-xl mx-auto shadow-lg">
      <CardContent className="p-6 text-center">
        <form action={formAction} className="space-y-6">
          {!state.data?.posterDataUri && !pending && (
             <div className="flex flex-col items-center gap-4">
                <Share2 className="w-16 h-16 text-primary" />
                <p className="text-muted-foreground">Tell us what you sold to generate a cool poster for your WhatsApp Status!</p>
                <div className="w-full max-w-sm space-y-4 text-left">
                   <div className="space-y-1">
                     <Label htmlFor="sellerName">Your Name</Label>
                     <Input id="sellerName" name="sellerName" defaultValue={sellerName} required />
                   </div>
                   <div className="space-y-1">
                     <Label htmlFor="itemName">What did you sell?</Label>
                     <Input id="itemName" name="itemName" placeholder="e.g., Old AC, Used Fridge" required />
                   </div>
                </div>
             </div>
          )}
          
          {pending && (
            <div className="space-y-4">
              <Skeleton className="w-full aspect-square rounded-lg" />
              <p className="text-muted-foreground animate-pulse">AI is creating your masterpiece...</p>
            </div>
          )}

          {state.success && state.data?.posterDataUri && (
            <div className="space-y-4">
               <h3 className="text-xl font-bold font-headline">Your Poster is Ready!</h3>
               <p className="text-muted-foreground">Download the image and share it on your WhatsApp Status.</p>
              <div className="relative w-full aspect-square rounded-lg overflow-hidden border">
                <Image src={state.data.posterDataUri} alt="Generated sale poster" fill objectFit="contain" />
              </div>
            </div>
          )}

          {state.message && !state.success && (
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{state.message}</AlertDescription>
            </Alert>
          )}

          {!state.data?.posterDataUri ? (
            <SubmitButton />
          ) : (
             <Button asChild size="lg">
                <a href={state.data.posterDataUri} download="grihseva-ai-sold-poster.png">
                    <Download className="mr-2 h-5 w-5" />
                    Download Poster
                </a>
            </Button>
          )}

        </form>
      </CardContent>
    </Card>
  );
}
