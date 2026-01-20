
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Lock, FileLock, Camera, Share2, Shield, Mail } from 'lucide-react';

export default function PrivacyPolicyPage() {
  const policySections = [
    {
      title: "Data Vault & Encryption",
      icon: <FileLock className="h-6 w-6" />,
      content: "हम यूजर के ID प्रूफ और डॉक्यूमेंट्स को AES-256 Bank-Grade Encryption में स्टोर करते हैं। यह 'Legal Vault' से बाहर कभी नहीं जाएगा।",
    },
    {
      title: "Live Selfie & ID Usage",
      icon: <Camera className="h-6 w-6" />,
      content: "वर्कर्स की सेल्फी और ID का उपयोग केवल AI Verification के लिए किया जाता है ताकि प्लेटफॉर्म को सुरक्षित रखा जा सके और फ्रॉड को रोका जा सके।",
    },
    {
      title: "No-Sharing Policy",
      icon: <Share2 className="h-6 w-6" />,
      content: "हम आपका पर्सनल नंबर या कोई भी संवेदनशील जानकारी किसी तीसरे पक्ष (Third Party) को मार्केटिंग के लिए नहीं बेचते या शेयर नहीं करते। आपका डेटा सिर्फ आप और आपके वेरिफाइड पार्टनर के बीच रहता है।",
    },
    {
      title: "AI & Data",
      icon: <Shield className="h-6 w-6" />,
      content: "जब आप किसी खराबी की फोटो अपलोड करते हैं, तो हमारा AI उसे विश्लेषण करने के लिए उपयोग करता है। यह डेटा हमारे AI मॉडल को बेहतर बनाने में मदद करता है, लेकिन आपकी व्यक्तिगत पहचान से जुड़ा नहीं होता है।",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 py-12 md:py-16">
        <div className="container max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="font-headline text-3xl font-bold tracking-tight sm:text-4xl">
              Privacy Policy for Ghar Ki Seva
            </h1>
            <p className="mt-2 text-muted-foreground">Last Updated: January 15, 2026</p>
          </div>

          <div className="space-y-8">
            <p className="text-center text-muted-foreground">
             At Ghar Ki Seva, we are committed to protecting your personal data. This policy explains how we handle your information to ensure your privacy and security.
            </p>

            {policySections.map((section) => (
              <Card key={section.title}>
                <CardHeader>
                  <CardTitle className="font-headline text-2xl flex items-center gap-3">
                    {section.icon}
                    {section.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{section.content}</p>
                </CardContent>
              </Card>
            ))}
            
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline text-2xl flex items-center gap-3">
                        <Mail className="h-6 w-6" />
                        Contact Us
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">
                        For any privacy concerns, please contact us at: <a href="mailto:gharkisevaai@gmail.com" className="text-primary hover:underline">gharkisevaai@gmail.com</a>
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
