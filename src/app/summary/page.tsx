
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Bot, IndianRupee, ShieldCheck, Users, Percent, Receipt } from 'lucide-react';

export default function SummaryPage() {
  const summaryPoints = [
    {
      title: "AI Defect Analysis",
      icon: <Bot className="h-6 w-6" />,
      content: "Customers upload a photo of a home defect (e.g., leaky faucet, wall crack). Our AI analyzes the image, identifies the problem, and provides an instant, accurate cost estimate.",
    },
    {
      title: "Secure Escrow Payments",
      icon: <ShieldCheck className="h-6 w-6" />,
      content: "All payments are held securely in our 'Safe Vault'. Funds are released to the worker or seller only after the customer confirms the job is completed to their satisfaction.",
    },
    {
      title: "Digital KYC & Worker Verification",
      icon: <Users className="h-6 w-6" />,
      content: "Workers undergo AI-powered verification by matching their live selfie with their government ID. Admins provide final approval, granting them a 'Verified Partner' badge to build trust.",
    },
     {
      title: "Lifetime Referral Income",
      icon: <IndianRupee className="h-6 w-6" />,
      content: "Anyone who refers a new user or worker earns a 0.05% commission on every successful transaction they make, for life. This passive income is credited to their in-app wallet.",
    },
  ];

  const feeStructure = [
    {
      title: "For Customers",
      icon: <Users className="h-6 w-6 text-green-500" />,
      fee: "0%",
      description: "Customers pay absolutely no platform fees. You only pay the price you agree upon with the worker or seller.",
    },
     {
      title: "For Workers & Sellers",
      icon: <Users className="h-6 w-6 text-orange-500" />,
      fee: "7%",
      description: "A small, success-based platform fee is charged on the final transaction value. This helps us maintain the AI tools, secure payments, and provide support.",
    },
    {
      title: "Referral Commission",
      icon: <Users className="h-6 w-6 text-blue-500" />,
      fee: "0.05%",
      description: "Paid out from our 7% platform fee to the person who referred the user or worker involved in the transaction.",
    }
  ]

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 py-12 md:py-16">
        <div className="container max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="font-headline text-3xl font-bold tracking-tight sm:text-4xl">
              GrihSeva AI: App Summary & Logic
            </h1>
            <p className="mt-2 text-muted-foreground">A transparent overview of how our platform works.</p>
          </div>

          <Card className="mb-12">
             <CardHeader>
                <CardTitle className="font-headline text-2xl">Core Logic</CardTitle>
                <CardDescription>Our platform is built on trust, security, and cutting-edge AI.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
                {summaryPoints.map((section) => (
                <div key={section.title} className="flex items-start gap-4">
                    <div className="bg-primary/10 p-3 rounded-lg mt-1">{section.icon}</div>
                    <div>
                        <h3 className="font-semibold text-lg">{section.title}</h3>
                        <p className="text-muted-foreground">{section.content}</p>
                    </div>
                </div>
                ))}
            </CardContent>
          </Card>


          <div className="text-center mb-12">
             <h2 className="font-headline text-2xl font-bold tracking-tight sm:text-3xl">
              Simple & Fair Fee Structure
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {feeStructure.map((tier) => (
              <Card key={tier.title}>
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 w-16 h-16 rounded-xl flex items-center justify-center bg-primary/10">
                    {tier.icon}
                  </div>
                  <CardTitle className="font-headline text-xl">{tier.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-4xl font-extrabold">{tier.fee}</p>
                  <p className="text-muted-foreground mt-2">{tier.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

           <Card className="bg-secondary/50">
             <CardHeader>
                <CardTitle className="font-headline text-xl flex items-center gap-2">
                    <Receipt/> Fee Example
                </CardTitle>
                <CardDescription>Here's a breakdown of a sample ₹1,000 transaction.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-background rounded-lg">
                    <p>Total Bill to Customer</p>
                    <p className="font-bold">₹1,000.00</p>
                </div>
                 <div className="pl-4 space-y-2">
                    <div className="flex justify-between items-center text-sm">
                        <p className="text-muted-foreground">Net Platform Fee (7%)</p>
                        <p className="font-medium">- ₹70.00</p>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                        <p className="text-muted-foreground">GST on Fee (18% of ₹70)</p>
                        <p className="font-medium">- ₹12.60</p>
                    </div>
                </div>
                 <div className="flex justify-between items-center p-3 bg-background rounded-lg font-bold">
                    <p>Final Payout to Worker/Seller</p>
                    <p className="text-green-500 text-lg">₹917.40</p>
                </div>
                <p className="text-xs text-muted-foreground text-center pt-2">A referral commission of ₹0.50 (0.05% of ₹1000) would be paid from the ₹70 platform fee to the referrer.</p>
            </CardContent>
          </Card>

        </div>
      </main>
      <Footer />
    </div>
  );
}
