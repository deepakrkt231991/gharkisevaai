"use client";

import { useFormStatus } from 'react-dom';
import { useEffect, useState, useRef } from 'react';
import { useActionState } from 'react';
import Image from 'next/image';
import { AlertCircle, Loader2, User, Verified, ShieldCheck, Landmark, Lock, Mic, Badge as IdCardIcon, Camera, CheckCircle, Bot } from 'lucide-react';

import { createWorkerProfile } from '@/app/worker-signup/actions';
import { verifyWorker } from '@/ai/flows/verification-agent';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';


function SubmitButton({ isVerified }: { isVerified: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending || !isVerified} className="w-full bg-primary text-white font-extrabold py-4 rounded-xl shadow-lg shadow-primary/20 active:scale-[0.98] transition-all">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Creating Profile...
        </>
      ) : (
        "Next Step"
      )}
    </Button>
  );
}

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export function WorkerSignupForm() {
  const initialState = { message: '', success: false, errors: [] };
  const [state, dispatch] = useActionState(createWorkerProfile, initialState);
  const { toast } = useToast();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  
  const [idCardUri, setIdCardUri] = useState<string | null>(null);
  const [selfieUri, setSelfieUri] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<{ verified: boolean; reasoning: string; name: string } | null>(null);
  
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let newProgress = 0;
    if (name) newProgress += 16.5;
    if (phone) newProgress += 16.5;
    if (verificationResult?.verified) newProgress += 33;
    // Add more for step 3 later
    setProgress(newProgress);
  }, [name, phone, verificationResult]);


  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fileType: 'id' | 'selfie') => {
      const file = e.target.files?.[0];
      if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
              if (fileType === 'id') {
                  setIdCardUri(reader.result as string);
              } else {
                  setSelfieUri(reader.result as string);
              }
          };
          reader.readAsDataURL(file);
      }
  };

  const handleVerification = async () => {
      if (!idCardUri || !selfieUri) {
          toast({ variant: 'destructive', title: 'Missing Images', description: 'Please provide both an ID card photo and a selfie.' });
          return;
      }
      setIsVerifying(true);
      setVerificationResult(null);
      try {
          const result = await verifyWorker({ idCardDataUri: idCardUri, selfieDataUri: selfieUri });
          setVerificationResult({ ...result, name: result.extractedName });
          if(result.verified) {
            setName(result.extractedName);
            toast({
                title: 'Verification Successful!',
                description: result.reasoning,
                className: 'bg-green-600 border-green-600 text-white'
            });
          } else {
             toast({
                variant: 'destructive',
                title: 'Verification Failed',
                description: result.reasoning,
            });
          }
      } catch (error) {
          console.error("Verification error:", error);
          toast({ variant: 'destructive', title: 'Verification Error', description: 'An unexpected error occurred during verification.' });
      } finally {
          setIsVerifying(false);
      }
  };
  
  const handleVoiceInput = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast({ variant: "destructive", title: "Browser Not Supported", description: "Sorry, your browser doesn't support voice recognition."});
      return;
    }

    if (recognitionRef.current && isListening) {
        recognitionRef.current.stop();
        return;
    }
    
    if (!recognitionRef.current) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'hi-IN';

        recognition.onstart = () => setIsListening(true);
        recognition.onend = () => setIsListening(false);
        recognition.onerror = (event: any) => {
            console.error("Speech recognition error", event.error);
            setIsListening(false);
        };
        
        recognition.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript;
            const nameRegex = /(?:नाम|name is|मेरा नाम)\s*([^.,]+)/i;
            const phoneRegex = /(?:नंबर|number is)\s*([0-9\s-]+)/i;

            const nameMatch = transcript.match(nameRegex);
            const phoneMatch = transcript.match(phoneRegex);
            
            let updated = false;
            if (nameMatch?.[1]) {
              setName(nameMatch[1].trim());
              updated = true;
            }
            if (phoneMatch?.[1]) {
              setPhone(phoneMatch[1].replace(/\s|-/g, '').trim());
              updated = true;
            }

            if(updated) {
              toast({ title: "Fields Auto-filled", description: "Your details have been filled in. Please review them." });
            } else {
              toast({ variant: 'destructive', title: "Could not understand", description: "Please say 'My name is...' or 'My number is...'"});
            }
        };
        recognitionRef.current = recognition;
    }

    recognitionRef.current.start();
  };

  return (
    <div className="w-full max-w-[430px] mx-auto min-h-screen flex flex-col">
       <div className="sticky top-0 z-50 flex items-center bg-background/80 backdrop-blur-md p-4 pb-2 justify-between">
          <Button variant="ghost" size="icon" className="text-white">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
          </Button>
          <h2 className="text-white text-lg font-extrabold leading-tight tracking-tight flex-1 text-center pr-12">Worker Registration</h2>
      </div>

      <div className="flex flex-col gap-3 p-4">
        <div className="flex gap-6 justify-between items-end">
          <div>
            <p className="text-white text-xl font-bold leading-none">Step {verificationResult?.verified ? '2' : '1'}</p>
            <p className="text-[#9ab9bc] text-sm font-medium">Basic Information</p>
          </div>
          <p className="text-white text-sm font-bold bg-primary/10 px-3 py-1 rounded-full">{Math.ceil(progress)}% Complete</p>
        </div>
        <div className="rounded-full bg-[#395456] overflow-hidden">
          <div className="h-2 rounded-full bg-primary transition-all duration-500" style={{ width: `${progress}%` }}></div>
        </div>
      </div>
      
      <div className="px-4 space-y-6 flex-grow">
        <form action={dispatch}>
          <div className="glass-card rounded-xl p-5 space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <User className="text-primary" />
              <h3 className="text-white text-lg font-bold">Personal Details</h3>
            </div>
            <div className="space-y-2">
              <Label className="text-[#9ab9bc] text-xs font-semibold uppercase tracking-wider">Full Name</Label>
              <Input name="name" value={name} onChange={(e) => setName(e.target.value)} className="form-input flex w-full rounded-lg text-white focus:outline-0 focus:ring-2 focus:ring-primary border border-border bg-background/50 h-14 placeholder:text-[#9ab9bc]/50 p-4 text-base" placeholder="As per Aadhar Card" />
            </div>
            <div className="space-y-2">
              <Label className="text-[#9ab9bc] text-xs font-semibold uppercase tracking-wider">Phone Number</Label>
              <div className="flex gap-2">
                <div className="flex items-center justify-center bg-background/50 border border-border rounded-lg px-3 text-sm text-[#9ab9bc]">
                  +91
                </div>
                <Input name="phone" value={phone} onChange={(e) => setPhone(e.target.value)} className="form-input flex-1 rounded-lg text-white focus:outline-0 focus:ring-2 focus:ring-primary border border-border bg-background/50 h-14 placeholder:text-[#9ab9bc]/50 p-4 text-base" placeholder="00000 00000" type="tel" />
              </div>
            </div>
          </div>
        
          <div className="glass-card rounded-xl p-5 space-y-4 mt-6 border-l-4 border-l-accent/50">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="text-accent" />
                  <h3 className="text-white text-lg font-bold">AI Verification</h3>
                </div>
                <p className="text-[#9ab9bc] text-xs">Verify identity for instant approval</p>
              </div>
              <span className="bg-accent/10 text-accent text-[10px] font-bold px-2 py-1 rounded border border-accent/20">SECURE</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <label className="relative group cursor-pointer border-2 border-dashed border-border hover:border-accent/50 rounded-xl aspect-square flex flex-col items-center justify-center bg-background/30 transition-all">
                <input type="file" accept="image/*" className="sr-only" onChange={(e) => handleFileChange(e, 'id')}/>
                {idCardUri ? <Image src={idCardUri} alt="ID card preview" fill className="object-cover rounded-xl"/> : <><IdCardIcon className="text-3xl text-primary/50 group-hover:text-accent transition-colors" /><p className="text-[10px] text-center mt-2 font-bold text-[#9ab9bc] uppercase tracking-tighter">ID Card Front</p></>}
              </label>
              <label className="relative group cursor-pointer border-2 border-dashed border-border hover:border-accent/50 rounded-xl aspect-square flex flex-col items-center justify-center bg-background/30 transition-all">
                 <input type="file" accept="image/*" capture="user" className="sr-only" onChange={(e) => handleFileChange(e, 'selfie')}/>
                {selfieUri ? <Image src={selfieUri} alt="Selfie preview" fill className="object-cover rounded-xl"/> : <><Camera className="text-3xl text-primary/50 group-hover:text-accent transition-colors" /><p className="text-[10px] text-center mt-2 font-bold text-[#9ab9bc] uppercase tracking-tighter">Live Selfie</p></>}
                 <div className="absolute -top-1 -right-1">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-accent"></span>
                  </span>
                </div>
              </label>
            </div>
            <Button onClick={handleVerification} disabled={isVerifying || !idCardUri || !selfieUri} type="button" className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
              {isVerifying ? <Loader2 className="animate-spin mr-2" /> : <Bot className="mr-2" />}
              Verify with AI
            </Button>
             {verificationResult && (
              <Alert variant={verificationResult.verified ? 'default' : 'destructive'} className={verificationResult.verified ? 'bg-green-900/50 border-green-500/50 text-white' : ''}>
                  <CheckCircle className="h-4 w-4" />
                  <AlertTitle className='font-bold'>{verificationResult.verified ? 'Verification Successful' : 'Verification Failed'}</AlertTitle>
                  <AlertDescription>{verificationResult.reasoning}</AlertDescription>
              </Alert>
            )}
          </div>

          <div className={`glass-card rounded-xl p-5 flex items-center justify-between mt-6 transition-opacity ${verificationResult?.verified ? 'opacity-100' : 'opacity-50'}`}>
            <div className="flex items-center gap-3">
              <Landmark className="text-[#9ab9bc]" />
              <div>
                <h3 className="text-white text-base font-bold">Banking Details</h3>
                <p className="text-[#9ab9bc] text-xs italic">Step 3 of 3</p>
              </div>
            </div>
            { !verificationResult?.verified && <Lock className="text-[#9ab9bc]" /> }
          </div>
        </form>
      </div>

      <div className="sticky bottom-0 left-0 w-full p-6 bg-gradient-to-t from-background via-background to-transparent pt-10">
        <Button onClick={() => {}} disabled={!verificationResult?.verified} className="w-full bg-primary text-white font-extrabold py-4 h-14 rounded-xl shadow-lg shadow-primary/20 active:scale-[0.98] transition-all">
          Next Step
        </Button>
      </div>
      
       <div className="fixed bottom-24 right-6 z-[60] flex flex-col items-center gap-2">
        <div className="bg-card border border-border px-3 py-1.5 rounded-full shadow-2xl mb-1">
          <p className="text-[10px] text-accent font-bold tracking-widest whitespace-nowrap">बोलकर फॉर्म भरें</p>
        </div>
        <Button onClick={handleVoiceInput} size="icon" className="size-16 rounded-full bg-primary border-4 border-background shadow-2xl flex items-center justify-center text-white active:scale-90 transition-transform relative">
          <Mic className="text-3xl" />
          {isListening && <div className="absolute inset-0 rounded-full border-2 border-primary animate-ping opacity-75"></div>}
        </Button>
      </div>
    </div>
  );
}
