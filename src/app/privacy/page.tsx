
import { Header } from '@/components/header';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Database, Shield, Bot, UserCheck } from 'lucide-react';

export default function PrivacyPolicyPage() {
  const policySections = [
    {
      title: "Data We Collect (डेटा जो हम इकट्ठा करते हैं)",
      icon: <Database className="h-6 w-6" />,
      content: "हमारी सेवा को बेहतर और सुरक्षित बनाने के लिए, हम निम्नलिखित जानकारी इकट्ठा करते हैं: व्यक्तिगत पहचान (नाम, ईमेल), संपर्क जानकारी (फोन नंबर), वेरिफिकेशन दस्तावेज़ (आधार, पैन कार्ड की फोटो), और लोकेशन डेटा। यह जानकारी केवल आपकी पहचान सत्यापित करने और आपको बेहतर सर्विस देने के लिए उपयोग की जाती है।"
    },
    {
      title: "How We Use Your Data (आपके डेटा का उपयोग)",
      icon: <UserCheck className="h-6 w-6" />,
      content: "आपके डेटा का उपयोग केवल वेरिफिकेशन, सर्विस बुकिंग, और आपको उपयुक्त कार्यकर्ता से मिलाने के लिए किया जाता है। हम आपकी सहमति के बिना आपकी व्यक्तिगत जानकारी किसी तीसरे पक्ष के साथ साझा या बेचते नहीं हैं।"
    },
    {
      title: "Security Measures (सुरक्षा उपाय)",
      icon: <Shield className="h-6 w-6" />,
      content: "आपकी जानकारी की सुरक्षा हमारी सर्वोच्च प्राथमिकता है। हम आपके डेटा को सुरक्षित रखने के लिए फायरबेस (Firebase) के सुरक्षित सर्वर और उद्योग-मानक एन्क्रिप्शन का उपयोग करते हैं। आपके दस्तावेज़ केवल सत्यापित एडमिन (Verified Admin) द्वारा ही देखे जा सकते हैं।"
    },
    {
      title: "AI and Data (AI और डेटा)",
      icon: <Bot className="h-6 w-6" />,
      content: "हमारा AI सिस्टम आपके द्वारा अपलोड किए गए दस्तावेज़ों और तस्वीरों का विश्लेषण केवल पहचान सत्यापन और सर्विस अनुमानों के लिए करता है। इस प्रक्रिया को पूरी तरह से गोपनीय रखा जाता है।"
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
            <p className="mt-2 text-muted-foreground">Last Updated: October 28, 2023</p>
             <p className="mt-4 text-sm text-muted-foreground">Contact us at <a href="mailto:gharkisevaai@gmail.com" className="text-primary hover:underline">gharkisevaai@gmail.com</a> for any privacy concerns.</p>
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
