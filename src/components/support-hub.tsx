'use client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { LifeBuoy, Mail, Phone } from 'lucide-react';

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
          <a href="mailto:gharkisevaai@gmail.com" className="flex items-center gap-4 p-3 bg-black/20 rounded-lg border border-border">
            <Mail className="text-primary" />
            <span className="text-white font-medium">gharkisevaai@gmail.com</span>
          </a>
           <a href="tel:+910000000000" className="flex items-center gap-4 p-3 bg-black/20 rounded-lg border border-border">
            <Phone className="text-primary" />
            <span className="text-white font-medium">+91 000-000-0000</span>
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
