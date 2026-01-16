
import { LoginForm } from '@/components/login-form';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <div className="dark bg-background text-foreground flex justify-center items-center min-h-screen">
      <div className="fixed top-[-10%] left-[-20%] w-[60%] h-[40%] bg-primary/10 blur-[120px] pointer-events-none -z-10"></div>
      <div className="fixed bottom-[-5%] right-[-10%] w-[50%] h-[30%] bg-accent/5 blur-[100px] pointer-events-none -z-10"></div>
      
      <div className="relative w-full max-w-md p-4">
        <Link href="/" className="absolute top-8 left-8 text-muted-foreground hover:text-white">
          <ArrowLeft />
        </Link>
        <LoginForm />
      </div>
    </div>
  );
}
