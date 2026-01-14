"use client";

import { useFormState, useFormStatus } from 'react-dom';
import { useEffect } from 'react';
import { AlertCircle, Loader2 } from 'lucide-react';

import { createWorkerProfile } from '@/app/worker-signup/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
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
    }
  }, [state, toast]);

  return (
    <Card className="max-w-md mx-auto">
      <form action={dispatch}>
        <CardHeader>
          <CardTitle>Worker Registration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
           {state.message && !state.success && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{state.message}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" name="name" placeholder="Rajesh Kumar" required />
            {state.errors?.find(e => e.path.includes('name')) && <p className="text-sm text-destructive">{state.errors?.find(e => e.path.includes('name'))?.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input id="phone" name="phone" placeholder="9876543210" required />
             {state.errors?.find(e => e.path.includes('phone')) && <p className="text-sm text-destructive">{state.errors?.find(e => e.path.includes('phone'))?.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input id="address" name="address" placeholder="123, Main Street, Delhi" required />
            {state.errors?.find(e => e.path.includes('address')) && <p className="text-sm text-destructive">{state.errors?.find(e => e.path.includes('address'))?.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="skills">Skills</Label>
            <Input id="skills" name="skills" placeholder="e.g., Plumber, Electrician, Carpenter" required />
            <p className="text-xs text-muted-foreground">Please separate skills with a comma.</p>
            {state.errors?.find(e => e.path.includes('skills')) && <p className="text-sm text-destructive">{state.errors?.find(e => e.path.includes('skills'))?.message}</p>}
          </div>
        </CardContent>
        <CardFooter>
          <SubmitButton />
        </CardFooter>
      </form>
    </Card>
  );
}
