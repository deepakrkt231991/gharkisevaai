
import { Header } from '@/components/header';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UserCheck, Gavel, Banknote, Percent } from 'lucide-react';

export default function TermsPage() {
  const terms = [
    {
      title: "7% Platform Fee",
      icon: <Percent className="h-6 w-6" />,
      content: "हर सफल सर्विस, बिक्री, या किराये की डील पर, कार्यकर्ता/विक्रेता की कुल कमाई से 7% का प्लेटफ़ॉर्म शुल्क काटा जाएगा। यह शुल्क हमारे AI टूल्स, सुरक्षित भुगतान और प्लेटफ़ॉर्म को बनाए रखने के लिए अनिवार्य है। ग्राहकों के लिए कोई शुल्क नहीं है।",
    },
    {
      title: "User Verification",
      icon: <UserCheck className="h-6 w-6" />,
      content: "प्लेटफ़ॉर्म पर एक सुरक्षित माहौल बनाए रखने के लिए, सभी कार्यकर्ताओं को अपनी पहचान सत्यापित करनी होगी। कोई भी गलत, जाली या गुमराह करने वाले दस्तावेज़ अपलोड करने पर उपयोगकर्ता का खाता बिना किसी पूर्व सूचना के स्थायी रूप से ब्लॉक कर दिया जाएगा।",
    },
    {
      title: "Payments & Liability",
      icon: <Banknote className="h-6 w-6" />,
      content: "यह प्लेटफ़ॉर्म खरीदारों और विक्रेताओं/कार्यकर्ताओं के बीच एक सुरक्षित माध्यम के रूप में कार्य करता है। भुगतान और सेवाओं की अंतिम जिम्मेदारी उपयोगकर्ता और सेवा प्रदाता की होगी। विवाद की स्थिति में, GrihSeva AI का निर्णय अंतिम माना जाएगा।",
    },
    {
      title: "General Conduct",
      icon: <Gavel className="h-6 w-6" />,
      content: "सभी उपयोगकर्ताओं से एक पेशेवर और सम्मानजनक आचरण की उम्मीद की जाती है। ऐप के बाहर भुगतान या डील करने का प्रयास करने पर आपकी वारंटी और सुरक्षा समाप्त हो जाएगी और आपका खाता निलंबित किया जा सकता है।",
    },
  ];


  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 py-12 md:py-16">
        <div className="container max-w-4xl mx-auto">
          <div className="text-center mb-12">
             <h1 className="font-headline text-3xl font-bold tracking-tight sm:text-4xl">
              Terms and Conditions
            </h1>
            <p className="mt-2 text-muted-foreground">सेवा की शर्तें</p>
          </div>
            <Card>
              <CardHeader>
                <CardTitle className="font-headline text-2xl">मुख्य शर्तें (Main Conditions)</CardTitle>
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
      </main>
      <Footer />
    </div>
  );
}
