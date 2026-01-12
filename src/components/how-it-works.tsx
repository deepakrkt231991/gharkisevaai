import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { UploadCloud, Sparkles, MessageSquareHeart } from 'lucide-react';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const steps = [
  {
    icon: <UploadCloud className="w-8 h-8 text-primary" />,
    title: '1. दवा की फोटो अपलोड करें',
    description: 'अपनी दवा के पत्ते की एक साफ तस्वीर खींचें और हमारे ऐप पर अपलोड करें।',
    imageId: 'how-it-works-upload',
  },
  {
    icon: <Sparkles className="w-8 h-8 text-primary" />,
    title: '2. AI से विश्लेषण पाएं',
    description: 'हमारी AI तकनीक तस्वीर का विश्लेषण करेगी, दवा, उसके उपयोग और एक्सपायरी डेट की पहचान करेगी।',
    imageId: 'how-it-works-analyze',
  },
  {
    icon: <MessageSquareHeart className="w-8 h-8 text-primary" />,
    title: '3. तुरंत सलाह लें',
    description: 'हमारे "Get Instant Advice" फीचर का उपयोग करके अपनी स्वास्थ्य संबंधी चिंताओं के लिए बुनियादी सलाह प्राप्त करें।',
    imageId: 'how-it-works-connect',
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-12 md:py-24 bg-secondary">
      <div className="container">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="font-headline text-3xl font-bold tracking-tight sm:text-4xl">यह कैसे काम करता है?</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            तीन आसान स्टेप्स में अपनी दवाओं का प्रबंधन करें और सलाह प्राप्त करें।
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step) => {
            const image = PlaceHolderImages.find(img => img.id === step.imageId);
            return (
              <Card key={step.title} className="text-center flex flex-col hover:shadow-xl transition-shadow duration-300">
                <CardHeader>
                  <div className="mx-auto bg-primary/10 p-3 rounded-full mb-4">
                    {step.icon}
                  </div>
                  <CardTitle className="font-headline">{step.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow flex flex-col justify-between">
                    <div>
                        <CardDescription className="mb-4">{step.description}</CardDescription>
                    </div>
                    {image && (
                    <div className="mt-auto aspect-[4/3] relative">
                        <Image
                        src={image.imageUrl}
                        alt={image.description}
                        fill
                        className="rounded-md object-cover"
                        data-ai-hint={image.imageHint}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                    </div>
                    )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
