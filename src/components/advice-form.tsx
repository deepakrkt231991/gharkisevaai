"use client";

import { useState } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { AlertCircle, Bot, Sparkles, Wand } from 'lucide-react';

import { getAdvice } from '@/app/get-advice/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from './ui/skeleton';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? (
        <>
          <Wand className="mr-2 h-4 w-4 animate-spin" />
          Getting Advice...
        </>
      ) : (
        <>
          <Sparkles className="mr-2 h-4 w-4" />
          Get Instant Advice
        </>
      )}
    </Button>
  );
}

export function AdviceForm() {
  const initialState = { success: false, message: '', data: null };
  const [state, formAction] = useFormState(getAdvice, initialState);
  const { pending } = useFormStatus();

  return (
    <Card className="max-w-3xl mx-auto mt-8">
      <form action={formAction}>
        <CardHeader>
          <CardTitle>AI Medical Assistant</CardTitle>
          <CardDescription>Describe your health concern below. Our AI assistant will provide you with some basic advice.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            name="concern"
            placeholder="e.g., I have a headache and a slight fever for the last 2 days."
            rows={5}
            required
            disabled={pending}
          />
           {!state.success && state.message && (
             <p className="mt-2 text-sm text-destructive">{state.message}</p>
           )}
        </CardContent>
        <CardFooter className="flex-col items-start gap-4">
          <SubmitButton />
           <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Disclaimer</AlertTitle>
            <AlertDescription>
              This is an AI-powered assistant and not a substitute for professional medical advice. Please consult with a qualified healthcare provider for any medical concerns.
            </AlertDescription>
          </Alert>
        </CardFooter>
      </form>
      
      {pending && (
        <CardContent>
            <div className="space-y-4 rounded-lg border bg-secondary/50 p-4">
              <h3 className="font-semibold flex items-center gap-2 text-lg"><Bot /> AI Generated Advice</h3>
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </div>
        </CardContent>
      )}

      {state.success && state.data && (
         <CardContent>
            <div className="space-y-4 rounded-lg border bg-secondary/50 p-4">
              <h3 className="font-semibold flex items-center gap-2 text-lg"><Bot /> AI Generated Advice</h3>
              <p className="text-foreground/90 whitespace-pre-wrap">{state.data.advice}</p>
            </div>
        </CardContent>
      )}
      
       {!pending && !state.success && state.message && (
         <CardContent>
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{state.message}</AlertDescription>
            </Alert>
         </CardContent>
       )}
    </Card>
  );
}
