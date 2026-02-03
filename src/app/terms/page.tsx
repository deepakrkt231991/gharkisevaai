import React from 'react';

export default function TermsPage() {
  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Terms and Conditions</h1>
      <p className="mb-4">घर की सेवा (Ghar Ki Sevaai) में आपका स्वागत है।</p>
      <ul className="list-disc pl-5 space-y-2">
        <li>हमारी सेवाएँ केवल घरेलू कामों के लिए हैं।</li>
        <li>किसी भी विवाद के लिए सीधे हमसे संपर्क करें।</li>
        <li>हम आपकी गोपनीयता का सम्मान करते हैं।</li>
      </ul>
      <p className="mt-6 font-semibold">संपर्क: +91XXXXXXXXXX</p>
    </div>
  );
}
