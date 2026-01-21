
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Database, Shield, Bot, Annoyed } from 'lucide-react';

export default function PrivacyPolicyPage() {
  const policySections = [
    {
      title: "Data Collection",
      icon: <Database className="h-6 w-6" />,
      content: "हम यूजर का नाम, लोकेशन और सेल्फी वेरिफिकेशन डेटा स्टोर करते हैं ताकि 'Verified Worker' सिस्टम को सुरक्षित रखा जा सके।",
    },
    {
      title: "Payment Safety",
      icon: <Shield className="h-6 w-6" />,
      content: "हम स्ट्राइप/रेज़रपे और 'Safe Vault' का उपयोग करते हैं। बायर का 7% बुकिंग अमाउंट और 93% वर्क-डन पेमेंट पूरी तरह सुरक्षित रहता है।",
    },
    {
      title: "Third-Party Ads",
      icon: <Annoyed className="h-6 w-6" />,
      content: "हम विज्ञापन दिखाने के लिए Google AdSense का उपयोग करते हैं। Google यूजर की रुचियों के आधार पर विज्ञापन दिखाने के लिए कुकीज़ (Cookies) का उपयोग कर सकता है।",
    },
    {
      title: "AI Usage",
      icon: <Bot className="h-6 w-6" />,
      content: "हमारा AI आपके अपलोड किए गए रूम डिज़ाइन और पुराने सामान की फोटो को केवल सर्विस सुझाव देने और फ्रॉड रोकने के लिए इस्तेमाल करता है।",
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
            <p className="mt-2 text-muted-foreground">Last Updated: October 26, 2023</p>
          </div>

          <div className="space-y-8">
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
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
