
'use client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { LifeBuoy, Mail, Phone } from 'lucide-react';

const WhatsAppIcon = () => (
    <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-400 fill-current"><title>WhatsApp</title><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52s-.67-.816-.923-1.123c-.253-.307-.508-.262-.67.025-.164.288-.67 1.164-.67 1.164s-.67.149-1.645.923c-.976.775-1.045 1.502-1.045 1.502s.508 1.645 1.645 2.52c1.138.875 2.596 1.943 3.846 1.943.347 0 .82-.025 1.123-.307.303-.282.67-1.164.67-1.164s-.05-.099-.124-.198c-.074-.099-.297-.149-.297-.149zM12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18.5c-4.687 0-8.5-3.813-8.5-8.5s3.813-8.5 8.5-8.5 8.5 3.813 8.5 8.5-3.813 8.5-8.5 8.5z"/></svg>
);

const faqs = [
  {
    question: "How does the referral system work?",
    answer: "When you refer a new user or worker, you earn a 0.05% commission on every successful transaction they make for life. This commission is added to your in-app wallet."
  },
  {
    question: "Is my payment secure?",
    answer: "Yes. We use an escrow system. Your payment is held securely and is only released to the worker after you confirm the job is completed to your satisfaction."
  },
  {
    question: "What is AI Verification?",
    answer: "Our AI verifies workers by matching their live selfie with their government ID (like Aadhaar). It also analyzes photos of defects to give you an accurate cost estimate before you book a service."
  },
   {
    question: "How does the SOS feature work?",
    answer: "In an emergency, press the SOS button. Your live location and a background audio recording will be sent to our security team and your emergency contacts."
  }
];

export function SupportHub() {
  return (
    <div className="space-y-8">
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="font-headline text-white">Contact Us</CardTitle>
          <CardDescription>We're here to help you.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <a href="https://wa.me/918291569096?text=Hello%20Ghar%20Ki%20Seva%20Support" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-3 bg-black/20 rounded-lg border border-border">
            <WhatsAppIcon />
            <span className="text-white font-medium">Chat on WhatsApp</span>
          </a>
          <a href="mailto:gharkisevaai@gmail.com" className="flex items-center gap-4 p-3 bg-black/20 rounded-lg border border-border">
            <Mail className="text-primary" />
            <span className="text-white font-medium">gharkisevaai@gmail.com</span>
          </a>
           <a href="tel:+910000000000" className="flex items-center gap-4 p-3 bg-black/20 rounded-lg border border-border">
            <Phone className="text-primary" />
            <span className="text-white font-medium">+91 000-000-0000 (Mon-Fri, 9am-6pm)</span>
          </a>
        </CardContent>
      </Card>
      
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="font-headline text-white">Frequently Asked Questions</CardTitle>
        </CardHeader>
        <CardContent>
           <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className={index === 0 ? 'border-t-0' : ''}>
                <AccordionTrigger className="text-white text-left">{faq.question}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}
