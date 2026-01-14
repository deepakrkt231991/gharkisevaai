"use client";

import { useFormState, useFormStatus } from 'react-dom';
import { useEffect } from 'react';
import { AlertCircle, Loader2, UploadCloud } from 'lucide-react';

import { createWorkerProfile } from '@/app/worker-signup/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Submitting...
        </>
      ) : (
        "Create Profile"
      )}
    </Button>
  );
}

export function WorkerSignupForm() {
  const initialState = { message: '', success: false, errors: [] };
  const [state, dispatch] = useFormState(createWorkerProfile, initialState);
  const { toast } = useToast();

  useEffect(() => {
    if (state.success) {
      toast({
        title: "Profile Created!",
        description: state.message,
      });
      // Optionally reset the form here
    }
  }, [state, toast]);

  const getError = (path: string) => state.errors?.find(e => e.path.includes(path))?.message;

  return (
    <Card className="max-w-lg mx-auto">
      <form action={dispatch}>
        <CardHeader>
          <CardTitle>Worker Registration</CardTitle>
          <CardDescription>Fill out the details below to join our network of professionals.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
           {state.message && !state.success && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{state.message}</AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" name="name" placeholder="Rajesh Kumar" required />
              {getError('name') && <p className="text-sm text-destructive">{getError('name')}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" name="phone" placeholder="9876543210" required />
              {getError('phone') && <p className="text-sm text-destructive">{getError('phone')}</p>}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input id="email" name="email" type="email" placeholder="you@example.com" required />
            {getError('email') && <p className="text-sm text-destructive">{getError('email')}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input id="address" name="address" placeholder="123, Main Street, Delhi" required />
            {getError('address') && <p className="text-sm text-destructive">{getError('address')}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="skills">Skills</Label>
            <Input id="skills" name="skills" placeholder="e.g., Plumber, Electrician, Carpenter" required />
            <p className="text-xs text-muted-foreground">Please separate skills with a comma.</p>
            {getError('skills') && <p className="text-sm text-destructive">{getError('skills')}</p>}
          </div>
           <div className="space-y-2">
            <Label htmlFor="emergencyContact">Family Emergency Contact</Label>
            <Input id="emergencyContact" name="emergencyContact" placeholder="Emergency contact number" required />
            {getError('emergencyContact') && <p className="text-sm text-destructive">{getError('emergencyContact')}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="document">Upload Document</Label>
            <Input id="document" name="document" type="file" className="pt-1.5" accept="image/*,application/pdf" />
            <p className="text-xs text-muted-foreground">Upload your ID card or a relevant certificate (PDF or Image).</p>
          </div>
        </CardContent>
        <CardFooter>
          <SubmitButton />
        </CardFooter>
      </form>
    </Card>
  );
}
