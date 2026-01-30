import React from 'react';
import Footer from '@/components/Footer';
import { Card } from '@/components/ui/card';

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-orange-600">नियम और शर्तें (Terms & Conditions)</h1>
        <Card className="p-6 shadow-md border-t-4 border-orange-500">
          <div className="space-y-4 text-gray-700">
            <section>
              <h2 className="font-bold text-lg">1. प्लेटफॉर्म शुल्क (Platform Fee)</h2>
              <p>हर सफल रेंटल या सर्विस डील पर 7% एडमिन फीस अनिवार्य है।</p>
            </section>
            <section>
              <h2 className="font-bold text-lg">2. उपयोगकर्ता सत्यापन (User Verification)</h2>
              <p>गलत या फर्जी दस्तावेज अपलोड करने पर यूजर को तुरंत ब्लॉक कर दिया जाएगा।</p>
            </section>
            <section>
              <h2 className="font-bold text-lg">3. भुगतान (Payments)</h2>
              <p>लेनदेन की जिम्मेदारी यूजर और वेंडर की होगी, ऐप केवल एक सुरक्षित माध्यम है।</p>
            </section>
            <section>
              <h2 className="font-bold text-lg">4. संपर्क (Contact)</h2>
              <p>किसी भी विवाद के लिए हमें gharkisevaai@gmail.com पर ईमेल करें।</p>
            </section>
          </div>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
