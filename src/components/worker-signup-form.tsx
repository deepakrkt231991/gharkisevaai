
"use client";

import { useFormStatus } from 'react-dom';
import { useEffect } from 'react';
import { useActionState } from 'react';
import { AlertCircle, Loader2, UploadCloud, Banknote, User, Building } from 'lucide-react';

import { createWorkerProfile } from '@/app/worker-signup/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending} className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-bold">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Verifying & Registering...
        </>
      ) : (
        "Verify & Register"
      )}
    </Button>
  );
}

export function WorkerSignupForm() {
  const initialState = { message: '', success: false, errors: [] };
  const [state, dispatch] = useActionState(createWorkerProfile, initialState);
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
    <Card className="max-w-2xl mx-auto shadow-lg">
      <form action={dispatch}>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Worker Onboarding</CardTitle>
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
          
          <div className="space-y-4">
              <h3 className="font-semibold text-lg">Personal Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name (As per Aadhaar)</Label>
                  <Input id="name" name="name" placeholder="Rajesh Kumar" required />
                  {getError('name') && <p className="text-sm text-destructive">{getError('name')}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Mobile Number (WhatsApp)</Label>
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
                <Label htmlFor="emergencyContact">Family Emergency Contact</Label>
                <Input id="emergencyContact" name="emergencyContact" placeholder="Emergency contact number" required />
                {getError('emergencyContact') && <p className="text-sm text-destructive">{getError('emergencyContact')}</p>}
              </div>
          </div>


          <div className="space-y-4">
            <h3 className="font-semibold text-lg">AI ID Verification</h3>
             <div className="border-2 border-dashed border-blue-400 p-4 rounded-lg text-center">
                <p className="text-sm text-muted-foreground mb-2">Upload Aadhaar / ID Card for AI Verification</p>
                <Label htmlFor="document" className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded inline-flex items-center gap-2">
                  <UploadCloud size={16} />
                  Take/Upload Photo of ID
                </Label>
                <Input id="document" name="document" type="file" className="hidden" accept="image/*,application/pdf" />
             </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Bank Details (For Direct Payouts)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"/>
                  <Input id="accountHolderName" name="accountHolderName" placeholder="Account Holder Name" className="pl-10" required />
                  {getError('accountHolderName') && <p className="text-sm text-destructive">{getError('accountHolderName')}</p>}
               </div>
               <div className="relative">
                  <Banknote className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"/>
                  <Input id="accountNumber" name="accountNumber" placeholder="Account Number" className="pl-10" required />
                  {getError('accountNumber') && <p className="text-sm text-destructive">{getError('accountNumber')}</p>}
               </div>
            </div>
             <div className="relative">
                <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"/>
                <Input id="ifscCode" name="ifscCode" placeholder="IFSC Code" className="pl-10" required />
                {getError('ifscCode') && <p className="text-sm text-destructive">{getError('ifscCode')}</p>}
             </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="skills">Select Your Skill</Label>
            <Select name="skills">
              <SelectTrigger>
                <SelectValue placeholder="Select Your Skill (AC, Fridge, TV, etc.)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="AC Repair">AC Repair</SelectItem>
                <SelectItem value="TV Repair">TV Repair</SelectItem>
                <SelectItem value="Refrigerator">Fridge/Refrigerator</SelectItem>
                <SelectItem value="Washing Machine">Washing Machine</SelectItem>
                <SelectItem value="Electrician">Electrician</SelectItem>
                <SelectItem value="Plumber">Plumber</SelectItem>
                <SelectItem value="Carpenter">Carpenter</SelectItem>
                <SelectItem value="Home Repair">General Home Repair</SelectItem>
              </SelectContent>
            </Select>
             {getError('skills') && <p className="text-sm text-destructive">{getError('skills')}</p>}
          </div>

        </CardContent>
        <CardFooter>
          <SubmitButton />
        </CardFooter>
      </form>
    </Card>
  );
}
