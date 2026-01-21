
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bot, Shield, Handshake, Users, IndianRupee, Banknote, FileText } from 'lucide-react';

export default function FeaturesPage() {
  const benefits = {
    users: [
        { feature: "AI Defect Analysis", description: "Get instant, accurate cost estimates and repair solutions by uploading a photo.", icon: <Bot/> },
        { feature: "Verified Professionals", description: "Connect with AI-verified workers whose backgrounds are checked for your safety.", icon: <Shield/> },
        { feature: "Secure Escrow Payment", description: "Your payment is held securely and only released when you confirm the job is done.", icon: <Handshake/> },
        { feature: "Lifetime Referral Income", description: "Earn a lifetime commission of 0.05% from every transaction made by users you refer.", icon: <IndianRupee/> },
        { feature: "Transparent Pricing", description: "A small platform fee is included for AI verification, secure payments, and support. No surprises.", icon: <FileText /> }
    ],
    workers: [
      { feature: "Fair & Transparent Fees", description: "No hidden charges. A small fee is included in the final bill to cover security, AI tools, and support, ensuring you get paid reliably.", icon: <IndianRupee/> },
      { feature: "Instant Payouts", description: "Withdraw your earnings directly to your bank account just 1 hour after job completion.", icon: <Banknote/> },
      { feature: "AI Legal Agreements", description: "Create legally sound digital agreements for high-value deals directly within the app.", icon: <Bot/> },
      { feature: "Build Your Team", description: "Refer other workers to build your own team and earn a passive income from their jobs.", icon: <Users/> }
    ]
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 py-12 md:py-16">
        <div className="container max-w-4xl mx-auto">
          <div className="text-center mb-12">
             <h1 className="font-headline text-3xl font-bold tracking-tight sm:text-4xl">
              Why Choose Ghar Ki Seva?
            </h1>
            <p className="mt-2 text-muted-foreground">The smartest way to repair, rent, and sell with AI.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <Card>
              <CardHeader>
                <CardTitle className="font-headline text-2xl">For Users</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {benefits.users.map((item, index) => (
                  <div key={index} className="flex items-start gap-4">
                     <div className="mt-1 text-primary">{item.icon}</div>
                     <div>
                        <h3 className="font-semibold text-lg">{item.feature}</h3>
                        <p className="text-muted-foreground">{item.description}</p>
                     </div>
                  </div>
                ))}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="font-headline text-2xl">For Workers</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {benefits.workers.map((item, index) => (
                  <div key={index} className="flex items-start gap-4">
                     <div className="mt-1 text-primary">{item.icon}</div>
                     <div>
                        <h3 className="font-semibold text-lg">{item.feature}</h3>
                        <p className="text-muted-foreground">{item.description}</p>
                     </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
