
import { Header } from '@/components/header';

export default function TermsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 py-12 md:py-16">
        <div className="container max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="font-headline text-3xl font-bold tracking-tight sm:text-4xl">
              Terms of Service
            </h1>
            <p className="mt-2 text-muted-foreground">Last Updated: October 28, 2023</p>
          </div>
          <div className="prose dark:prose-invert max-w-none mx-auto text-muted-foreground space-y-4">
            <p>Welcome to GrihSeva AI. These terms and conditions outline the rules and regulations for the use of our application.</p>
            <h2 className="font-headline text-xl text-white">1. Introduction</h2>
            <p>By accessing this app, we assume you accept these terms and conditions. Do not continue to use GrihSeva AI if you do not agree to all of the terms and conditions stated on this page.</p>
            <h2 className="font-headline text-xl text-white">2. License</h2>
            <p>Unless otherwise stated, GrihSeva AI and/or its licensors own the intellectual property rights for all material on GrihSeva AI. All intellectual property rights are reserved. You may access this from GrihSeva AI for your own personal use subjected to restrictions set in these terms and conditions.</p>
            <h2 className="font-headline text-xl text-white">3. User Responsibilities</h2>
            <p>You are responsible for any and all activity that occurs under your account. You are responsible for keeping your password secure. You must not, in the use of the Service, violate any laws in your jurisdiction.</p>
            <h2 className="font-headline text-xl text-white">4. Service Fees</h2>
            <p>For customers, the platform is free to use. For workers and sellers, a 7% platform fee is charged on the final transaction value upon successful completion of a job or sale. A lifetime referral commission of 0.05% is paid out from this platform fee.</p>
            <h2 className="font-headline text-xl text-white">5. Limitation of Liability</h2>
            <p>In no event shall GrihSeva AI, nor any of its officers, directors and employees, be held liable for anything arising out of or in any way connected with your use of this app whether such liability is under contract. GrihSeva AI, including its officers, directors and employees shall not be held liable for any indirect, consequential or special liability arising out of or in any way related to your use of this app.</p>
            <p className="pt-4 text-center">Contact us at <a href="mailto:gharkisevaai@gmail.com" className="text-primary hover:underline">gharkisevaai@gmail.com</a> for any questions.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
