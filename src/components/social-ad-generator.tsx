"use client";

import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Linkedin, Facebook } from 'lucide-react';
import Image from "next/image";

const linkedinTemplate = {
    headline: "🚀 Join India’s First AI-Powered Home Service Platform – 0% Commission & Instant Payouts!",
    content: `Are you a professional service provider? Join 'Ghar Ki Seva' and take full control of your earnings.

✅ **0% Commission, Forever:** You keep 100% of what you earn. We don't charge any fees from your hard-earned money.
✅ **Immediate Withdrawal:** Get your earnings transferred to your bank account instantly after job completion. No more waiting!
✅ **Direct Customer Chat:** Talk directly to the customer to understand the job and agree on the price.
✅ **AI-Verified Trust Badge:** Stand out from the competition. Get your skills and certificates verified by our AI to earn a 'Trusted Professional' badge.

Stop paying commissions. Start earning more.

👉 Register Now & Become a Verified Pro: https://app.gharkiseva.com/worker-signup`,
    image: "https://picsum.photos/seed/linkedin-ad/1200/628",
    imageHint: "professional tools layout"
};

const facebookTemplate = {
    headline: "🛠️ घर की सेवा (Ghar Ki Seva) से जुड़ें – 0% कमीशन और तुरंत पेमेंट! 💰",
    content: `अब कमीशन देने का झंझट खत्म! 'Ghar Ki Seva' ऐप पर रजिस्टर करें और अपनी मेहनत की पूरी कमाई घर ले जाएं।

✨ **0% कमीशन:** हम आपके काम से एक भी रुपया नहीं काटते।
✨ **तुरंत पेमेंट:** काम खत्म होते ही पैसा सीधे आपके बैंक खाते में। कोई इंतजार नहीं!
✨ **सीधी ग्राहक बातचीत:** ग्राहक से सीधे चैट करें और काम की सही कीमत तय करें।
✨ **AI वेरिफाइड बनें:** अपनी फोटो और ID कार्ड से वेरिफिकेशन कराएं और 'भरोसेमंद वर्कर' का टैग पाएं।

मेहनत आपकी, कमाई भी पूरी आपकी! आज ही जुड़ें।

👇 अभी रजिस्टर करने के लिए नीचे दिए गए लिंक पर क्लिक करें!
https://app.gharkiseva.com/worker-signup`,
    image: "https://picsum.photos/seed/facebook-ad/1080/1080",
    imageHint: "happy worker tools"
};

const AdTemplateCard = ({ platform, icon, template }: { platform: string, icon: React.ReactNode, template: typeof linkedinTemplate }) => {
    const { toast } = useToast();

    const handleCopy = (textToCopy: string) => {
        navigator.clipboard.writeText(textToCopy);
        toast({ title: "Copied!", description: `${platform} ad copy has been copied to your clipboard.` });
    };
    
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">{icon} {platform}</CardTitle>
                <CardDescription>Use this template to recruit workers on {platform}.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                 <div className="w-full aspect-video relative rounded-lg overflow-hidden bg-muted">
                    <Image src={template.image} alt={`${platform} ad visual`} fill className="object-cover" data-ai-hint={template.imageHint} />
                </div>

                <div className="relative w-full rounded-lg border bg-secondary p-4 whitespace-pre-wrap font-mono text-sm max-h-60 overflow-y-auto">
                    <h4 className="font-bold mb-2">{template.headline}</h4>
                    {template.content}
                </div>
                <Button onClick={() => handleCopy(`${template.headline}\n\n${template.content}`)} variant="outline" className="w-full">
                    <Copy className="mr-2 h-4 w-4" /> Copy Text
                </Button>
            </CardContent>
        </Card>
    )
}


export function SocialAdGenerator() {
    return (
        <div className="grid md:grid-cols-2 gap-8">
           <AdTemplateCard platform="LinkedIn" icon={<Linkedin className="text-[#0A66C2]"/>} template={linkedinTemplate} />
           <AdTemplateCard platform="Facebook / Instagram" icon={<Facebook className="text-[#1877F2]"/>} template={facebookTemplate} />
        </div>
    );
}
