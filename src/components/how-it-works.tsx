import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { UploadCloud, Sparkles, Users } from 'lucide-react';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const steps = [
  {
    icon: <UploadCloud className="w-8 h-8 text-primary" />,
    title: '1. फोटो अपलोड करें',
    description: 'घर में जो भी खराबी है, उसकी एक साफ तस्वीर खींचें और हमारे ऐप पर अपलोड करें।',
    imageId: 'how-it-works-upload',
  },
  {
    icon: <Sparkles className="w-8 h-8 text-primary" />,
    title: '2. AI से विश्लेषण पाएं',
    description: 'हमारी एडवांस्ड AI टेक्नोलॉजी तस्वीर का विश्लेषण करेगी, समस्या की पहचान करेगी और मरम्मत की अनुमानित लागत हिंदी में बताएगी।',
    imageId: 'how-it-works-analyze',
  },
  {
    icon: <Users className="w-8 h-8 text-primary" />,
    title: '3. विशेषज्ञ से जुड़ें',
    description: 'अनुमान से संतुष्ट होने पर, हम आपको आपके क्षेत्र के सबसे भरोसेमंद और कुशल कारीगरों से मिलाएंगे।',
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
            केवल तीन आसान स्टेप्स में अपने घर की समस्याओं का समाधान पाएं।
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
