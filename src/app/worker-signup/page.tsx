import { WorkerSignupForm } from '@/components/worker-signup-form';

export default function WorkerSignupPage() {
  return (
    <div className="dark bg-background text-foreground flex justify-center">
      {/* Decorative Elements from Stitch Design */}
      <div className="fixed top-[-10%] left-[-20%] w-[60%] h-[40%] bg-primary/10 blur-[120px] pointer-events-none -z-10"></div>
      <div className="fixed bottom-[-5%] right-[-10%] w-[50%] h-[30%] bg-accent/5 blur-[100px] pointer-events-none -z-10"></div>
      
      <WorkerSignupForm />
    </div>
  );
}
