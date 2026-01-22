
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Timer, Network, Gavel, Banknote } from 'lucide-react';

export default function TermsPage() {
  const terms = [
    {
      title: "Platform Fee",
      icon: <Banknote className="h-6 w-6" />,
      content: "GrihSevaAI प्लेटफार्म का उपयोग करने पर, वर्कर्स और सेलर्स अपनी कुल कमाई का 7% प्लेटफार्म शुल्क देने के लिए सहमत हैं। ग्राहकों के लिए यह सेवा पूरी तरह 0% शुल्क (मुफ्त) है। सभी भुगतान सुरक्षित ट्रांजेक्शन के माध्यम से ट्रैक किए जाएंगे।",
    },
    {
      title: "10-Day Rule",
      icon: <Timer className="h-6 w-6" />,
      content: "यदि 10 दिनों में सामान नहीं बिकता या सेलर रिस्पांस नहीं देता, तो 20% एडवांस पेमेंट अपने आप रिफंड हो जाएगा।",
    },
    {
      title: "Outside Deals",
      icon: <Network className="h-6 w-6" />,
      content: "ऐप के बाहर डील करने पर 6 महीने की सर्विस वारंटी और पेमेंट प्रोटेक्शन खत्म हो जाएगी।",
    },
    {
      title: "AI Judge",
      icon: <Gavel className="h-6 w-6" />,
      content: "किसी भी विवाद (Dispute) की स्थिति में AI द्वारा किया गया फैसला और एडमिन का अंतिम निर्णय मान्य होगा।",
    },
  ];


  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 py-12 md:py-16">
        <div className="container max-w-4xl mx-auto">
          <div className="text-center mb-12">
             <h1 className="font-headline text-3xl font-bold tracking-tight sm:text-4xl">
              Terms of Service
            </h1>
            <p className="mt-2 text-muted-foreground">सेवा की शर्तें और लाभ</p>
          </div>
            <Card>
              <CardHeader>
                <CardTitle className="font-headline text-2xl">नियम और शर्तें (Terms & Conditions)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {terms.map((term, index) => (
                  <div key={index} className="flex items-start gap-4">
                     <div className="mt-1">{term.icon}</div>
                     <div>
                        <h3 className="font-semibold text-lg">{term.title}</h3>
                        <p className="text-muted-foreground">{term.content}</p>
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
