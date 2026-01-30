
import { Header } from '@/components/header';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Briefcase, Gift, Zap } from 'lucide-react';
import Link from 'next/link';

export default function PricingPage() {
  const pricingTiers = [
    {
      title: "For Customers",
      icon: <Users className="h-8 w-8 text-primary" />,
      price: "0%",
      priceDesc: "Fee on Services",
      features: [
        "Pay only the price you agree upon.",
        "No hidden charges or markups.",
        "Access to AI verification & secure payments.",
        "15-day service warranty on all jobs."
      ],
      cta: "Find a Service",
      ctaLink: "/find-a-worker",
      isPrimary: false,
    },
    {
      title: "For Workers & Professionals",
      icon: <Briefcase className="h-8 w-8 text-accent" />,
      price: "7%",
      priceDesc: "Platform Fee on Earnings",
      features: [
        "Keep 93% of your earnings.",
        "Instant payouts after 1 hour.",
        "AI tools to find jobs & create agreements.",
        "Build your team with referrals."
      ],
      cta: "Become a Worker",
      ctaLink: "/worker-signup",
      isPrimary: true,
    },
    {
      title: "For Everyone",
      icon: <Gift className="h-8 w-8 text-primary" />,
      price: "0.05%",
      priceDesc: "Lifetime Referral Commission",
      features: [
        "Refer a user or a worker.",
        "Earn on every transaction they make.",
        "Passive income for life.",
        "Help build a trusted community."
      ],
      cta: "Start Referring",
      ctaLink: "/promote",
      isPrimary: false,
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 py-12 md:py-20">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h1 className="font-headline text-4xl font-extrabold tracking-tight sm:text-5xl">
              Simple, Transparent Pricing
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              No hidden fees. Ever. Our model is built on trust and fairness for everyone.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {pricingTiers.map((tier) => (
              <Card key={tier.title} className={tier.isPrimary ? 'border-accent shadow-accent/10 shadow-lg' : ''}>
                <CardHeader className="text-center">
                  <div className={`mx-auto mb-4 w-16 h-16 rounded-xl flex items-center justify-center ${tier.isPrimary ? 'bg-accent/10' : 'bg-primary/10'}`}>
                    {tier.icon}
                  </div>
                  <CardTitle className="font-headline text-2xl">{tier.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col h-full p-6">
                  <div className="text-center mb-6">
                    <p className="text-5xl font-extrabold">{tier.price}</p>
                    <p className="text-muted-foreground">{tier.priceDesc}</p>
                  </div>
                  <ul className="space-y-4 text-sm mb-8 flex-grow">
                    {tier.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <Zap className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                   <Button asChild size="lg" className={`w-full mt-auto ${tier.isPrimary ? 'bg-accent text-accent-foreground hover:bg-accent/90' : ''}`}>
                    <Link href={tier.ctaLink}>{tier.cta}</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
