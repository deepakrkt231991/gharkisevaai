
"use client";

import { useFormStatus } from 'react-dom';
import { useEffect, useState, useRef } from 'react';
import { useActionState } from 'react';
import { AlertCircle, Loader2, UploadCloud, Banknote, User, Building, Bot, Mic, CheckCircle, Webcam, AlertTriangle } from 'lucide-react';

import { createWorkerProfile } from '@/app/worker-signup/actions';
import { verifyWorker } from '@/ai/flows/verification-agent';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from '@/components/ui/textarea';


function SubmitButton({ isVerified }: { isVerified: boolean }) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending || !isVerified} className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-bold">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Registering...
        </>
      ) : (
        "Create My Profile"
      )}
    </Button>
  );
}

// Add a global type for the SpeechRecognition
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

  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const recognitionRef = useRef<any>(null);

  const [idCardUri, setIdCardUri] = useState<string | null>(null);
  const [selfieUri, setSelfieUri] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<{ verified: boolean; reasoning: string; name: string } | null>(null);
  
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (isCameraOpen) {
      startCamera();
    }
  }, [isCameraOpen]);


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

  const handleVoiceInput = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Sorry, your browser doesn't support voice recognition.");
      return;
    }

    if (!recognitionRef.current) {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'hi-IN';

        recognition.onstart = () => {
            setIsListening(true);
            setTranscript('');
        };

        recognition.onresult = (event: any) => {
            let finalTranscript = '';
            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    finalTranscript += event.results[i][0].transcript;
                }
            }
            if (finalTranscript) {
              setTranscript(prev => prev + finalTranscript + ' ');
            }
        };

        recognition.onerror = (event: any) => {
            console.error("Speech recognition error", event.error);
            setIsListening(false);
        };

        recognition.onend = () => {
            setIsListening(false);
        };
        recognitionRef.current = recognition;
    }

    if (isListening) {
        recognitionRef.current.stop();
    } else {
        recognitionRef.current.start();
    }
  };

  const fillFormFields = () => {
    const nameRegex = /(?:नाम|name is|मेरा नाम)\s*([^.,]+)/i;
    const phoneRegex = /(?:नंबर|number is)\s*([0-9\s-]+)/i;
    const addressRegex = /(?:पता|address is)\s*(.+)/i;

    const nameMatch = transcript.match(nameRegex);
    const phoneMatch = transcript.match(phoneRegex);
    const addressMatch = transcript.match(addressRegex);
    
    if (nameMatch) setName(nameMatch[1].trim());
    if (phoneMatch) setPhone(phoneMatch[1].replace(/\s|-/g, '').trim());
    if (addressMatch) setAddress(addressMatch[1].trim());

    toast({
      title: "Fields Filled",
      description: "Information has been filled from your speech. Please review and correct if needed.",
    });
  };
  
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
                variant: 'default',
                className: 'bg-green-100 text-green-900',
                title: 'Verification Successful!',
                description: result.reasoning,
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

  const startCamera = async () => {
    if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        setHasCameraPermission(true);
        if(videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error("Error accessing camera:", error);
        setHasCameraPermission(false);
        toast({
          variant: 'destructive', 
          title: 'Camera Error', 
          description: 'Could not access the camera. Please check your browser permissions.'
        });
        setIsCameraOpen(false); // Close dialog if permission is denied
      }
    } else {
      setHasCameraPermission(false);
      toast({variant: 'destructive', title: 'Camera Not Supported', description: 'Your browser does not support camera access.'});
    }
  };
  
  const takeSelfie = () => {
    if(videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      if(context){
        context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
        setSelfieUri(canvas.toDataURL('image/jpeg'));
      }
      const stream = video.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      setIsCameraOpen(false); // Close dialog after taking picture
    }
  };

  const benefits = [
      { text: "Zero Joining Fee: फ्री रजिस्ट्रेशन।", icon: <CheckCircle className="text-green-500" /> },
      { text: "AI Support: मशीन खराब है? फोटो खींचें, AI आपको ठीक करना सिखाएगा।", icon: <Bot className="text-blue-500" /> },
      { text: "Passive Income: अपने साथी वर्कर्स को जोड़ें और उनकी हर कमाई का 0.05% हिस्सा पाएं।", icon: <Banknote className="text-orange-500" /> },
      { text: "Direct Payout: सीधे आपके बैंक अकाउंट में पैसा।", icon: <Building className="text-purple-500" /> },
  ];


  return (
    <Card className="max-w-2xl mx-auto shadow-lg">
      <form action={dispatch}>
        <CardHeader>
            <CardTitle className="text-2xl font-bold font-headline">"GHAR KI SEVA AI Partner बनें – सिर्फ काम न करें, अपना नेटवर्क बनाएं!"</CardTitle>
            <CardDescription>Fill out the details below to join our network of professionals.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">

           <Card className="bg-secondary border-primary/20">
              <CardContent className="p-6">
                <ul className="space-y-3">
                  {benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="mt-1">{benefit.icon}</span>
                      <span className="text-muted-foreground">{benefit.text}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

           {state.message && !state.success && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{state.message}</AlertDescription>
            </Alert>
          )}
          
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">AI ID Verification</h3>
            <Card className="p-4 bg-background">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                    <div>
                        <Label htmlFor="id-card-upload">1. Upload ID Card (Aadhaar)</Label>
                        <Input id="id-card-upload" type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'id')} className="mt-1" />
                    </div>
                     <div>
                        <Label htmlFor="selfie-upload">2. Take/Upload Selfie</Label>
                        <div className="flex gap-2 mt-1">
                          <Input id="selfie-upload" type="file" accept="image/*" capture="user" onChange={(e) => handleFileChange(e, 'selfie')} className="flex-grow" />
                          <Dialog open={isCameraOpen} onOpenChange={setIsCameraOpen}>
                            <DialogTrigger asChild>
                              <Button variant="outline" type="button"><Webcam size={16} /></Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader><DialogTitle>Take a Selfie</DialogTitle></DialogHeader>
                                <video ref={videoRef} autoPlay muted playsInline className="w-full h-auto rounded-md"></video>
                                {hasCameraPermission === false && (
                                  <Alert variant="destructive">
                                    <AlertTriangle className="h-4 w-4" />
                                    <AlertTitle>Camera Access Denied</AlertTitle>
                                    <AlertDescription>
                                      Please enable camera access in your browser settings to take a selfie.
                                    </AlertDescription>
                                  </Alert>
                                )}
                              <DialogFooter>
                                <Button onClick={takeSelfie} type="button" disabled={hasCameraPermission === false}>Take Picture</Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                          <canvas ref={canvasRef} className="hidden"></canvas>
                        </div>
                    </div>
                </div>
                 <div className="flex justify-center mt-4">
                    <Button onClick={handleVerification} disabled={isVerifying || !idCardUri || !selfieUri} type="button">
                        {isVerifying ? <Loader2 className="animate-spin mr-2" /> : <Bot className="mr-2" />}
                        Run AI Verification
                    </Button>
                </div>
                 {verificationResult && (
                    <Alert variant={verificationResult.verified ? 'default' : 'destructive'} className={verificationResult.verified ? 'bg-green-50 border-green-200' : ''}>
                        <AlertTitle className='font-bold flex items-center gap-2'>
                          {verificationResult.verified ? <CheckCircle /> : <AlertCircle />}
                          Verification {verificationResult.verified ? 'Successful' : 'Failed'}
                        </AlertTitle>
                        <AlertDescription>{verificationResult.reasoning}</AlertDescription>
                    </Alert>
                )}
            </Card>
          </div>

          <div className="flex justify-end">
             <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="text-blue-600 border-blue-600 hover:bg-blue-50">
                  <Bot className="mr-2 h-4 w-4" />
                  AI Assistant से फॉर्म भरें
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>AI Voice Assistant</DialogTitle>
                  <DialogDescription>
                    बोलकर अपनी जानकारी भरें। कहें "मेरा नाम [आपका नाम] है, मेरा नंबर [आपका नंबर] है, मेरा पता [आपका पता] है"।
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="relative">
                     <Textarea
                        id="voice-transcript"
                        value={transcript}
                        onChange={(e) => setTranscript(e.target.value)}
                        placeholder="Start speaking, your words will appear here..."
                        className="min-h-[100px] pr-12"
                    />
                    <Button 
                        type="button" 
                        variant="ghost" 
                        size="icon" 
                        className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8"
                        onClick={handleVoiceInput}
                      >
                        <Mic className={isListening ? 'text-destructive' : ''} />
                    </Button>
                  </div>
                </div>
                <DialogFooter>
                   <DialogTrigger asChild>
                    <Button type="button" onClick={fillFormFields}>Use this information</Button>
                  </DialogTrigger>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          
          <div className="space-y-4">
              <h3 className="font-semibold text-lg">Personal Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name (As per Aadhaar)</Label>
                  <Input id="name" name="name" placeholder="Rajesh Kumar" required value={name} onChange={e => setName(e.target.value)} />
                  {getError('name') && <p className="text-sm text-destructive">{getError('name')}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Mobile Number (WhatsApp)</Label>
                  <Input id="phone" name="phone" placeholder="9876543210" required value={phone} onChange={e => setPhone(e.target.value)}/>
                  {getError('phone') && <p className="text-sm text-destructive">{getError('phone')}</p>}
                </div>
              </div>
              <div className="space-y-2">
                  <Label htmlFor="address">Full Address</Label>
                  <Textarea id="address" name="address" placeholder="Your full address" required value={address} onChange={e => setAddress(e.target.value)} />
                  {getError('address') && <p className="text-sm text-destructive">{getError('address')}</p>}
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
          <SubmitButton isVerified={!!verificationResult?.verified} />
        </CardFooter>
      </form>
    </Card>
  );
}

    