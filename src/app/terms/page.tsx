import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';

export default function TermsPage() {
  const benefits = {
    users: [
      "AI-आधारित सही दाम",
      "100% वेरिफाइड वर्कर्स",
      "SOS सुरक्षा",
      "हर रेफरल पर लाइफटाइम कमाई"
    ],
    workers: [
      "सीधी कमाई, बैंक में तुरंत ट्रांसफर",
      "सुरक्षा के लिए SOS फीचर",
      "अपनी टीम बनाकर 0.05% पैसिव इनकम",
      "फ्री रजिस्ट्रेशन"
    ]
  };

  const terms = [
    { title: "Verification", content: "हर वर्कर को Aadhaar/ID और लाइव सेल्फी वेरिफिकेशन (AI द्वारा) पूरा करना अनिवार्य है।" },
    { title: "Payment & Escrow", content: "यूजर का पैसा काम शुरू होने पर होल्ड किया जाएगा और काम पूरा होने पर ही वर्कर को भेजा जाएगा।" },
    { title: "Referral Model", content: "यदि आप किसी नए यूजर या वर्कर को जोड़ते हैं, तो उनकी हर सफल ट्रांजेक्शन पर आपको 0.05% लाइफटाइम कमीशन मिलेगा। यह पैसा आपके ऐप वॉलेट में जमा होगा।" },
    { title: "Safety (SOS)", content: "किसी भी आपात स्थिति में SOS बटन दबाने पर आपकी लोकेशन और रिकॉर्डिंग सुरक्षा अधिकारियों को भेजी जाएगी।" },
    { title: "Fraud Policy", content: "ऐप के बाहर लेनदेन करने या गलत ID देने पर अकाउंट स्थायी रूप से बैन कर दिया जाएगा।" }
  ];


  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 py-12 md:py-16">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <h1 className="font-headline text-3xl font-bold tracking-tight sm:text-4xl text-center mb-12">
              सेवा की शर्तें और लाभ
            </h1>

            <Card className="mb-12">
              <CardHeader>
                <CardTitle className="font-headline text-2xl">मुख्य लाभ (Benefits for You)</CardTitle>
              </CardHeader>
              <CardContent className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-semibold text-lg mb-4">उपयोगकर्ताओं के लिए (For Users)</h3>
                  <ul className="space-y-3">
                    {benefits.users.map((item, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-4">कार्यकर्ताओं के लिए (For Workers)</h3>
                   <ul className="space-y-3">
                    {benefits.workers.map((item, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-headline text-2xl">नियम और शर्तें (Terms & Conditions)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {terms.map((term, index) => (
                  <div key={index}>
                    <h3 className="font-semibold text-lg">{term.title}</h3>
                    <p className="text-muted-foreground">{term.content}</p>
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
