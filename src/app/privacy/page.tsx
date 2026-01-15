
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Lock, MapPin, Camera, CreditCard, Bot, Shield, Share2, Languages, Trash2, Users, Mail } from 'lucide-react';

export default function PrivacyPolicyPage() {
  const policySections = [
    {
      title: "1. Information We Collect",
      icon: <Lock className="h-6 w-6" />,
      points: [
        { subtitle: "Personal Data:", text: "Name, phone number, and email for account registration.", icon: <Users className="h-5 w-5 text-primary" /> },
        { subtitle: "Location Data:", text: "We collect real-time location to connect users with local services and for the Emergency SOS feature.", icon: <MapPin className="h-5 w-5 text-primary" /> },
        { subtitle: "Media:", text: "Videos and photos uploaded for AI-Guided Verification (for selling items or renting rooms).", icon: <Camera className="h-5 w-5 text-primary" /> },
        { subtitle: "Payment Information:", text: "Processed securely via Razorpay/Stripe. We do not store your credit card or UPI pins.", icon: <CreditCard className="h-5 w-5 text-primary" /> },
      ],
    },
    {
      title: "2. How We Use Your Data",
      icon: <Bot className="h-6 w-6" />,
      points: [
        { subtitle: "AI Verification:", text: "To analyze item condition and property details without physical inspection.", icon: <Bot className="h-5 w-5 text-accent" /> },
        { subtitle: "Safety (SOS):", text: "To share your location with emergency contacts and authorities during an alert.", icon: <Shield className="h-5 w-5 text-accent" /> },
        { subtitle: "Referral System:", text: "To track and credit the 0.05% Lifetime Commission to your wallet.", icon: <Share2 className="h-5 w-5 text-accent" /> },
        { subtitle: "Branding:", text: "To show the app in your preferred language (Hindi/English/etc.).", icon: <Languages className="h-5 w-5 text-accent" /> },
      ],
    },
    {
        title: "3. Data Security & Fraud Prevention",
        icon: <Shield className="h-6 w-6" />,
        points: [
            { text: "We use AI Fraud Detection to ensure all listings are genuine." },
            { text: "Your data is encrypted and stored securely on Firebase/Google Cloud servers." },
            { text: "We do not sell your personal data to third-party advertisers." },
        ],
    },
    {
        title: "4. User Rights (Rent/Sell/Repair)",
        icon: <Trash2 className="h-6 w-6" />,
        points: [
            { text: "Users can delete their listings or account at any time." },
            { text: "All AI-guided video uploads are used solely for verification and trust-building between buyer and seller." },
        ],
    },
    {
      title: "5. Third-Party Services",
      icon: <Users className="h-6 w-6" />,
      points: [
        { text: "Google Gemini AI: For automated verification and chat translation." },
        { text: "Razorpay: For secure automated payments and referral payouts." },
        { text: "Google Maps: For location-based service matching." },
      ],
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 py-12 md:py-16">
        <div className="container max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="font-headline text-3xl font-bold tracking-tight sm:text-4xl">
              Privacy Policy for GrihSeva AI
            </h1>
            <p className="mt-2 text-muted-foreground">Last Updated: January 15, 2026</p>
          </div>

          <div className="space-y-8">
            <p className="text-center text-muted-foreground">
              At GrihSeva AI (also operating as Home Responsibility AI), we value your privacy and are committed to protecting your personal data. This policy explains how we handle your information.
            </p>

            {policySections.map((section) => (
              <Card key={section.title}>
                <CardHeader>
                  <CardTitle className="font-headline text-2xl flex items-center gap-3">
                    {section.icon}
                    {section.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {section.points.map((point, index) => (
                    <div key={index} className="flex items-start gap-4">
                      {point.icon && <div className="mt-1">{point.icon}</div>}
                      <div>
                        {point.subtitle && <h4 className="font-semibold">{point.subtitle}</h4>}
                        <p className="text-muted-foreground">{point.text}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
            
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline text-2xl flex items-center gap-3">
                        <Mail className="h-6 w-6" />
                        6. Contact Us
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">
                        For any privacy concerns, contact us at: <a href="mailto:support@grihsevaai.com" className="text-primary hover:underline">support@grihsevaai.com</a>
                    </p>
                </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
