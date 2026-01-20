
"use client";

import { useFormStatus } from 'react-dom';
import { useEffect, useState, useRef } from 'react';
import { useActionState } from 'react';
import Image from 'next/image';
import { AlertCircle, Loader2, User, ShieldCheck, Landmark, Lock, Mic, IdCard, Camera, CheckCircle, Bot, ArrowLeft, MapPin, Mail } from 'lucide-react';

import { createWorkerProfile } from '@/app/worker-signup/actions';
import { verifyWorker } from '@/ai/flows/verification-agent';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useGeolocation } from '@/hooks/use-geolocation';
import { Checkbox } from '@/components/ui/checkbox';


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
  
  const [currentStep, setCurrentStep] = useState(1);
  const { latitude, longitude, error: geoError, isLoading: isGeoLoading } = useGeolocation();

  // Step 1 State
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  
  // Step 2 State
  const [idCardUri, setIdCardUri] = useState<string | null>(null);
  const [selfieUri, setSelfieUri] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<{ verified: boolean; reasoning: string; name: string } | null>(null);
  
  // Step 3 State
  const [skills, setSkills] = useState('');
  const [emergencyContact, setEmergencyContact] = useState('');

  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  const [progress, setProgress] = useState(10);

  useEffect(() => {
    let newProgress = 0;
    if (currentStep === 1) {
        if(name) newProgress += 16.5;
        if(phone) newProgress += 16.5;
    } else if (currentStep === 2) {
        newProgress = 33;
        if(idCardUri) newProgress += 16.5;
        if(selfieUri) newProgress += 16.5;
        if(verificationResult?.verified) newProgress = 66;
    } else if (currentStep === 3) {
        newProgress = 66;
        if(skills) newProgress += 11;
        if(emergencyContact) newProgress += 11;
        if (latitude && longitude) newProgress += 12;
    }
    setProgress(Math.min(100, newProgress));
  }, [name, phone, idCardUri, selfieUri, verificationResult, skills, emergencyContact, latitude, longitude, currentStep]);


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
            if(!name) setName(result.extractedName); // autofill name if not already set
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
    
    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = false;
    recognitionRef.current.interimResults = false;
    recognitionRef.current.lang = 'hi-IN';

    recognitionRef.current.onstart = () => setIsListening(true);
    recognitionRef.current.onend = () => setIsListening(false);
    recognitionRef.current.onerror = (event: any) => {
        console.error("Speech recognition error", event.error);
        setIsListening(false);
    };
    
    recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        const nameRegex = /(?:नाम|name is|मेरा नाम)\s*([^.,]+)/i;
        const phoneRegex = /(?:नंबर|number is)\s*([0-9\s-]+)/i;
        let filledSomething = false;
        
        if (currentStep === 1) {
            const nameMatch = transcript.match(nameRegex);
            if (nameMatch?.[1]) { setName(nameMatch[1].trim()); filledSomething = true; }

            const phoneMatch = transcript.match(phoneRegex);
            if (phoneMatch?.[1]) { setPhone(phoneMatch[1].replace(/\s|-/g, '').trim()); filledSomething = true; }
        }

        if(filledSomething) {
          toast({ title: "Fields Auto-filled", description: "Your details have been filled in. Please review them." });
        } else {
          toast({ variant: 'destructive', title: "Could not understand", description: "Please say 'My name is...' or 'My number is...'"});
        }
    };

    recognitionRef.current.start();
  };

  const nextStep = () => {
    if (currentStep === 1 && name && phone) {
      setCurrentStep(2);
    } else if (currentStep === 2 && (idCardUri && selfieUri)) {
      setCurrentStep(3);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
        case 1: return "Basic Information";
        case 2: return "AI Identity Verification";
        case 3: return "Final Details";
        default: return "Worker Registration";
    }
  };


  return (
    <div className="relative w-full max-w-[430px] min-h-screen flex flex-col">
       <div className="sticky top-0 z-50 flex items-center bg-background/80 backdrop-blur-md p-4 pb-2 justify-between">
          <Button variant="ghost" size="icon" onClick={prevStep} className={currentStep === 1 ? 'opacity-0' : ''}>
            <ArrowLeft />
          </Button>
          <h2 className="text-white text-lg font-extrabold leading-tight tracking-tight flex-1 text-center pr-12">Worker Registration</h2>
      </div>

      <div className="flex flex-col gap-3 p-4">
        <div className="flex gap-6 justify-between items-end">
          <div>
            <p className="text-white text-xl font-bold leading-none">Step {currentStep}</p>
            <p className="text-[#9ab9bc] text-sm font-medium">{getStepTitle()}</p>
          </div>
          <p className="text-white text-sm font-bold bg-primary/10 px-3 py-1 rounded-full">{Math.ceil(progress)}% Complete</p>
        </div>
        <div className="rounded-full bg-[#395456] overflow-hidden">
          <div className="h-2 rounded-full bg-primary transition-all duration-500" style={{ width: `${progress}%` }}></div>
        </div>
      </div>
      
      <div className="px-4 space-y-6 flex-grow pb-32">
        <form action={dispatch}>
            {/* STEP 1: Personal Details */}
            {currentStep === 1 && (
                <div className="glass-card rounded-xl p-5 space-y-4">
                    <div className="flex items-center gap-2 mb-2">
                        <User className="text-primary" />
                        <h3 className="text-white text-lg font-bold">Personal Details</h3>
                    </div>
                    <div className="space-y-2">
                        <Label className="text-[#9ab9bc] text-xs font-semibold uppercase tracking-wider">Full Name</Label>
                        <Input name="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="As per Aadhar Card" />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-[#9ab9bc] text-xs font-semibold uppercase tracking-wider">Phone Number</Label>
                        <div className="flex gap-2">
                            <div className="flex items-center justify-center bg-input border border-border rounded-lg px-3 text-sm text-[#9ab9bc] h-14">+91</div>
                            <Input name="phone" value={phone} onChange={(e) => setPhone(e.target.value)} className="flex-1" placeholder="00000 00000" type="tel" />
                        </div>
                    </div>
                </div>
            )}

            {/* STEP 2: AI Verification */}
            {currentStep === 2 && (
                <div className="glass-card rounded-xl p-5 space-y-4 border-l-4 border-l-accent/50">
                    <div className="flex justify-between items-start">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2"><ShieldCheck className="text-accent" /><h3 className="text-white text-lg font-bold">AI Verification</h3></div>
                            <p className="text-[#9ab9bc] text-xs">Verify identity for instant approval</p>
                        </div>
                        <span className="bg-accent/10 text-accent text-[10px] font-bold px-2 py-1 rounded border border-accent/20">SECURE</span>
                    </div>

                    <Alert>
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle className="font-bold">Registration Rules</AlertTitle>
                        <AlertDescription className="text-xs">
                            You must upload a clear photo of your government ID and a live selfie. Providing false information will result in account suspension.
                        </AlertDescription>
                    </Alert>

                    <div className="grid grid-cols-2 gap-4">
                        <label className="relative group cursor-pointer border-2 border-dashed border-border hover:border-accent/50 rounded-xl aspect-square flex flex-col items-center justify-center bg-input/50 transition-all">
                            <input type="file" accept="image/*" className="sr-only" onChange={(e) => handleFileChange(e, 'id')}/>
                            {idCardUri ? <Image src={idCardUri} alt="ID card preview" fill className="object-cover rounded-xl"/> : <><IdCard className="text-3xl text-primary/50 group-hover:text-accent transition-colors" /><p className="text-[10px] text-center mt-2 font-bold text-[#9ab9bc] uppercase tracking-tighter">ID Card Front</p></>}
                        </label>
                        <label className="relative group cursor-pointer border-2 border-dashed border-border hover:border-accent/50 rounded-xl aspect-square flex flex-col items-center justify-center bg-input/50 transition-all scan-glow">
                            <input type="file" accept="image/*" capture="user" className="sr-only" onChange={(e) => handleFileChange(e, 'selfie')}/>
                            {selfieUri ? <Image src={selfieUri} alt="Selfie preview" fill className="object-cover rounded-xl"/> : <><Camera className="text-3xl text-primary/50 group-hover:text-accent transition-colors" /><p className="text-[10px] text-center mt-2 font-bold text-[#9ab9bc] uppercase tracking-tighter">Live Selfie</p><p className="text-[9px] text-center text-muted-foreground px-1">Opens camera for live capture</p></>}
                            <div className="absolute -top-1 -right-1"><span className="relative flex h-3 w-3"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-accent"></span></span></div>
                        </label>
                    </div>
                    <Button onClick={handleVerification} disabled={isVerifying || !idCardUri || !selfieUri} type="button" className="w-full h-14 bg-accent text-accent-foreground hover:bg-accent/90">
                        {isVerifying ? <Loader2 className="animate-spin mr-2" /> : <Bot className="mr-2" />}
                        Verify with AI
                    </Button>
                    {verificationResult && (
                        <Alert variant={verificationResult.verified ? 'default' : 'destructive'} className={verificationResult.verified ? 'bg-green-900/50 border-green-500/50 text-white' : ''}>
                            {verificationResult.verified ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                            <AlertTitle className='font-bold'>{verificationResult.verified ? 'Verification Successful' : 'Verification Failed'}</AlertTitle>
                            <AlertDescription>
                                <p>{verificationResult.reasoning}</p>
                                {!verificationResult.verified && (
                                    <Button asChild className="mt-3 w-full" variant="secondary">
                                        <a href={`mailto:gharkisevaai@gmail.com?subject=Manual%20Worker%20Verification%20Request&body=Hello%20Admin,%0D%0A%0D%0AMy%20AI%20verification%20failed.%20Please%20manually%20verify%20my%20profile.%0D%0A%0D%0AName:%20${name}%0D%0APhone:%20${phone}%0D%0A%0D%0AThank%20you.`}>
                                            <Mail className="mr-2 h-4 w-4" />
                                            Send to Admin for Approval
                                        </a>
                                    </Button>
                                )}
                            </AlertDescription>
                        </Alert>
                    )}
                </div>
            )}
            
            {/* STEP 3: Final Details */}
            {currentStep === 3 && (
                <>
                <div className="glass-card rounded-xl p-5 space-y-4">
                    <div className="flex items-center gap-2 mb-2">
                        <Landmark className="text-primary" />
                        <h3 className="text-white text-lg font-bold">Banking & Other Details</h3>
                    </div>
                     <div className="space-y-2">
                        <Label className="text-[#9ab9bc] text-xs font-semibold uppercase tracking-wider">Primary Skill</Label>
                        <Select name="skills" onValueChange={setSkills}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select your main skill" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="plumber">Plumber</SelectItem>
                                <SelectItem value="electrician">Electrician</SelectItem>
                                <SelectItem value="carpenter">Carpenter</SelectItem>
                                <SelectItem value="ac_repair">AC Repair</SelectItem>
                                <SelectItem value="tv_repair">TV Repair</SelectItem>
                                <SelectItem value="fridge_repair">Fridge Repair</SelectItem>
                                <SelectItem value="washing_machine_repair">Washing Machine Repair</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                     <div className="space-y-2">
                        <Label className="text-[#9ab9bc] text-xs font-semibold uppercase tracking-wider">Emergency Contact</Label>
                        <Input name="emergencyContact" value={emergencyContact} onChange={(e) => setEmergencyContact(e.target.value)} placeholder="A family member's number" type="tel" />
                    </div>
                     <div className="space-y-2">
                        <Label className="text-[#9ab9bc] text-xs font-semibold uppercase tracking-wider">Additional Documents</Label>
                        <div className="space-y-3 pt-2">
                            <div className="flex items-center space-x-3">
                                <Checkbox id="certifications" name="certificationsUploaded" />
                                <label htmlFor="certifications" className="text-sm font-medium leading-none text-white peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                I have professional certifications (e.g., ITI Diploma)
                                </label>
                            </div>
                            <div className="flex items-center space-x-3">
                                <Checkbox id="shopLicense" name="shopLicenseUploaded" />
                                <label htmlFor="shopLicense" className="text-sm font-medium leading-none text-white peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                I have a shop/establishment license
                                </label>
                            </div>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label className="text-[#9ab9bc] text-xs font-semibold uppercase tracking-wider">Live Location</Label>
                        <div className="flex items-center gap-2 bg-input border border-border rounded-lg p-3 h-14">
                            <MapPin className="text-primary"/>
                            {isGeoLoading && <span className="text-sm text-muted-foreground">Fetching location...</span>}
                            {geoError && <span className="text-sm text-destructive">{geoError}</span>}
                            {latitude && longitude && <span className="text-sm text-white">{latitude.toFixed(4)}, {longitude.toFixed(4)}</span>}
                        </div>
                         <p className="text-xs text-muted-foreground">We need your location to show you relevant nearby jobs.</p>
                    </div>
                    <div className="space-y-2">
                        <Label className="text-[#9ab9bc] text-xs font-semibold uppercase tracking-wider">Bank Account Holder Name</Label>
                        <Input name="accountHolderName" placeholder="Name as per bank records" />
                    </div>
                     <div className="space-y-2">
                        <Label className="text-[#9ab9bc] text-xs font-semibold uppercase tracking-wider">Bank Account Number</Label>
                        <Input name="accountNumber" />
                    </div>
                     <div className="space-y-2">
                        <Label className="text-[#9ab9bc] text-xs font-semibold uppercase tracking-wider">IFSC Code</Label>
                        <Input name="ifscCode" />
                    </div>
                </div>
                {state.message && !state.success && (
                    <Alert variant="destructive"><AlertCircle className="h-4 w-4" /><AlertTitle>Error</AlertTitle><AlertDescription>{state.message}</AlertDescription></Alert>
                )}
                </>
            )}
            <input type="hidden" name="name" value={name} />
            <input type="hidden" name="phone" value={phone} />
            <input type="hidden" name="latitude" value={latitude || ''} />
            <input type="hidden" name="longitude" value={longitude || ''} />
        </form>
      </div>

      {/* Floating Voice Assistant */}
       {currentStep === 1 && (
         <div className="fixed bottom-24 right-6 z-[60] flex flex-col items-center gap-2">
            <div className="bg-card border border-border px-3 py-1.5 rounded-full shadow-2xl mb-1">
            <p className="text-[10px] text-accent font-bold tracking-widest whitespace-nowrap">बोलकर फॉर्म भरें</p>
            </div>
            <Button onClick={handleVoiceInput} size="icon" className="size-16 rounded-full bg-primary border-4 border-background shadow-2xl flex items-center justify-center text-white active:scale-90 transition-transform relative">
            <Mic className="text-3xl" />
            {isListening && <div className="absolute inset-0 rounded-full border-2 border-primary animate-ping opacity-75"></div>}
            </Button>
        </div>
       )}

       {/* Sticky Bottom Actions */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] p-6 bg-gradient-to-t from-background via-background to-transparent pt-10">
        {currentStep < 3 ? (
            <Button onClick={nextStep} className="w-full bg-primary text-white font-extrabold py-4 h-14 rounded-xl shadow-lg shadow-primary/20 active:scale-[0.98] transition-all" disabled={(currentStep === 1 && (!name || !phone)) || (currentStep === 2 && (!idCardUri || !selfieUri))}>
                Next Step
            </Button>
        ) : (
            <Button type="submit" onClick={() => document.querySelector('form')?.requestSubmit()} className="w-full bg-accent text-accent-foreground font-extrabold py-4 h-14 rounded-xl shadow-lg shadow-accent/20 active:scale-[0.98] transition-all">
                Submit for Approval
            </Button>
        )}
      </div>
    </div>
  );
}
