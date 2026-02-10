
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth, useFirestore } from '@/firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, UserPlus, Wrench } from 'lucide-react';
import { Checkbox } from './ui/checkbox';
import { Logo } from './logo';

const GoogleIcon = (props: React.ComponentProps<'svg'>) => (
    <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.85 3.18-1.73 4.1-1.05 1.05-2.86 2.25-5.02 2.25-4.24 0-7.68-3.52-7.68-7.8s3.44-7.8 7.68-7.8c2.38 0 4.02 1.05 4.94 1.95l2.62-2.62C17.44 2.43 15.22 1.25 12.48 1.25c-6.17 0-11.17 5.17-11.17 11.25s5 11.25 11.17 11.25c6.5 0 10.92-4.5 10.92-11.05 0-.75-.08-1.5-.2-2.25H12.48z" fill="currentColor"/>
    </svg>
);

export function LoginForm() {
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupAgreed, setSignupAgreed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordResetting, setIsPasswordResetting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const auth = useAuth();
  const firestore = useFirestore();
  const router = useRouter();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
      toast({ title: 'Login Successful', description: 'Welcome back!' });
      router.push('/profile');
    } catch (err: any) {
      const errorMessage = `Error: ${err.message} (Code: ${err.code})`;
      setError(errorMessage);
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signupAgreed) {
      setError("You must agree to the Terms and Conditions.");
      return;
    }
    setIsLoading(true);
    setError(null);
    if (!auth || !firestore) {
        const errorMessage = "Firebase not initialized correctly.";
        setError(errorMessage);
        toast({
            variant: "destructive",
            title: "Configuration Error",
            description: errorMessage,
        });
        setIsLoading(false);
        return;
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, signupEmail, signupPassword);
      const user = userCredential.user;
      await updateProfile(user, { displayName: signupName });

      const userDocRef = doc(firestore, 'users', user.uid);
      await setDoc(userDocRef, {
        uid: user.uid,
        name: signupName,
        email: user.email,
        userType: 'customer',
        createdAt: serverTimestamp(),
      });
      
      toast({ title: 'Account Created!', description: 'Welcome to Ghar Ki Seva.' });
      router.push('/profile');

    } catch (err: any) {
      const errorMessage = `Error: ${err.message} (Code: ${err.code})`;
      setError(errorMessage);
      toast({
        variant: "destructive",
        title: "Signup Failed",
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError(null);
    if (!auth || !firestore) {
        const errorMessage = "Firebase not initialized correctly.";
        setError(errorMessage);
        toast({
            variant: "destructive",
            title: "Configuration Error",
            description: errorMessage,
        });
        setIsLoading(false);
        return;
    }
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const userDocRef = doc(firestore, 'users', user.uid);
      await setDoc(userDocRef, {
        uid: user.uid,
        name: user.displayName,
        email: user.email,
        userType: 'customer',
        createdAt: serverTimestamp(),
      }, { merge: true }); // Use merge to avoid overwriting existing data

      toast({ title: 'Login Successful', description: `Welcome, ${user.displayName}!` });
      router.push('/profile');

    } catch (err: any) {
      const errorMessage = `Error: ${err.message} (Code: ${err.code})`;
      setError(errorMessage);
      toast({
        variant: "destructive",
        title: "Google Sign-In Failed",
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handlePasswordReset = async () => {
    if (!loginEmail) {
      setError('Please enter your email address to reset the password.');
      toast({
        variant: 'destructive',
        title: 'Email Required',
        description: 'Please enter your email address in the email field first.',
      });
      return;
    }
    setIsPasswordResetting(true);
    setError(null);
    try {
      await sendPasswordResetEmail(auth, loginEmail);
      toast({
        title: 'Password Reset Email Sent',
        description: `If an account exists for ${loginEmail}, you will receive an email with instructions to reset your password.`,
        className: 'bg-green-600 border-green-600 text-white',
      });
    } catch (err: any) {
      // For security, we generally don't want to reveal if an email exists or not.
      // However, we can provide slightly more helpful feedback.
      if ((err as any).code === 'auth/invalid-email') {
         toast({
          variant: 'destructive',
          title: 'Invalid Email Address',
          description: 'Please check if you have entered your email correctly.',
        });
      } else {
        // Generic message for all other errors (user not found, network error, etc.)
        toast({
          title: 'Password Reset Email Sent',
          description: `If an account exists for ${loginEmail}, you will receive an email with instructions. Please also check your spam folder.`,
          className: 'bg-green-600 border-green-600 text-white',
        });
      }
    } finally {
      setIsPasswordResetting(false);
    }
  };


  return (
    <Card className="glass-card w-full">
      <CardHeader className="text-center">
        <Logo className="h-16 w-16 mx-auto mb-2" />
        <CardTitle className="font-headline text-2xl">Welcome to Ghar Ki Seva</CardTitle>
        <CardDescription>Log in or create an account to get started.</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Log In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login" className="space-y-4 pt-4">
            <Button variant="outline" className="w-full" onClick={handleGoogleSignIn} disabled={isLoading || isPasswordResetting}>
                {(isLoading && !isPasswordResetting) ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <GoogleIcon className="mr-2 h-4 w-4" />}
                Continue with Google
            </Button>
            <div className="relative my-2">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">Or</span>
                </div>
            </div>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="login-email">Email</Label>
                <Input id="login-email" type="email" placeholder="you@example.com" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} required />
              </div>
              <div className="space-y-1">
                <Label htmlFor="login-password">Password</Label>
                <Input id="login-password" type="password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} required />
              </div>
              <div className="text-right -mt-2">
                <Button
                    type="button"
                    variant="link"
                    className="p-0 h-auto text-xs"
                    onClick={handlePasswordReset}
                    disabled={isLoading || isPasswordResetting}
                >
                    {isPasswordResetting ? <><Loader2 className="mr-2 h-3 w-3 animate-spin"/>Sending...</> : 'Forgot Password?'}
                </Button>
              </div>
              <Button type="submit" disabled={isLoading || isPasswordResetting} className="w-full">
                {(isLoading && !isPasswordResetting) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Log In
              </Button>
            </form>
          </TabsContent>
          
          <TabsContent value="signup" className="space-y-4 pt-4">
             <Button variant="outline" className="w-full" onClick={handleGoogleSignIn} disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <GoogleIcon className="mr-2 h-4 w-4" />}
                Continue with Google
            </Button>
             <div className="relative my-2">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">Or sign up with email</span>
                </div>
            </div>
            <form onSubmit={handleSignup} className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="signup-name">Full Name</Label>
                <Input id="signup-name" placeholder="Your Name" value={signupName} onChange={(e) => setSignupName(e.target.value)} required />
              </div>
              <div className="space-y-1">
                <Label htmlFor="signup-email">Email</Label>
                <Input id="signup-email" type="email" placeholder="you@example.com" value={signupEmail} onChange={(e) => setSignupEmail(e.target.value)} required />
              </div>
              <div className="space-y-1">
                <Label htmlFor="signup-password">Password</Label>
                <Input id="signup-password" type="password" placeholder="••••••••" value={signupPassword} onChange={(e) => setSignupPassword(e.target.value)} required />
              </div>
               <div className="flex items-center space-x-2">
                <Checkbox id="signup-terms" onCheckedChange={(checked) => setSignupAgreed(checked as boolean)} checked={signupAgreed}/>
                <Label htmlFor="signup-terms" className="text-xs text-muted-foreground">
                    I agree to the <Link href="/terms" className="underline hover:text-primary">Terms & Conditions</Link>.
                </Label>
              </div>
              <Button type="submit" disabled={isLoading || !signupAgreed} className="w-full">
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Customer Account
              </Button>
            </form>
             <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">Or</span>
                </div>
            </div>
            <Button variant="outline" asChild className="w-full">
              <Link href="/worker-signup">
                <UserPlus className="mr-2" />
                Become a Worker
              </Link>
            </Button>
          </TabsContent>
        </Tabs>
        
        {error && <p className="mt-4 text-center text-sm text-destructive">{error}</p>}
      </CardContent>
    </Card>
  );
}
