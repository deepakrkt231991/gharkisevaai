
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Shield, AlertTriangle, Clock, Bot } from 'lucide-react';

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
    { 
      title: "0% Commission Model", 
      icon: <Shield className="h-6 w-6" />,
      content: "'Ghar Ki Seva' एक टेक्नोलॉजी प्लेटफॉर्म है, हम सर्विस के लिए कोई कमीशन नहीं लेते। पेमेंट सीधे यूजर और वर्कर के बीच होता है।" 
    },
    { 
      title: "Verification Disclaimer", 
      icon: <AlertTriangle className="h-6 w-6" />,
      content: "AI वेरिफिकेशन एक सुरक्षा लेयर है, लेकिन हम यूजर्स को सलाह देते हैं कि किसी भी वर्कर को घर बुलाने से पहले उसकी रेटिंग और प्रोफाइल खुद भी चेक करें।" 
    },
    { 
      title: "Waiting Timer & Refund", 
      icon: <Clock className="h-6 w-6" />,
      content: "अगर पेमेंट ऐप के 'Safe Vault' के जरिए हुई है, तो 24-घंटे के वेटिंग टाइमर के बाद ही पैसा वर्कर को ट्रांसफर होगा। अगर काम नहीं हुआ, तो रिफंड का हक यूजर को होगा।" 
    },
    { 
      title: "AI Decisions", 
      icon: <Bot className="h-6 w-6" />,
      content: "AI द्वारा दिए गए री-इन्वेंट डिज़ाइन और कोस्ट एस्टीमेट केवल 'संभावित' (Estimated) हैं, असली कीमत साइट विजिट के बाद ही तय होगी।" 
    }
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
