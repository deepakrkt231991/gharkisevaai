import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const heroImage = PlaceHolderImages.find(img => img.id === 'hero-image-1');

export function Hero() {
  return (
    <section className="relative w-full h-[80vh] min-h-[500px] flex items-center justify-center text-center">
      {heroImage && (
        <Image
          src={heroImage.imageUrl}
          alt={heroImage.description}
          fill
          className="object-cover -z-10"
          priority
          data-ai-hint={heroImage.imageHint}
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-background/50 to-background/90" />
      <div className="container relative z-10 px-4 md:px-6">
        <div className="max-w-3xl mx-auto space-y-4">
          <h1 className="font-headline text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl">
            Your Health, Managed with AI.
          </h1>
          <p className="text-lg text-foreground/80 md:text-xl">
            Take a photo of your medicine strip, know the expiry date, and get instant medical advice. DawaAI is your trusted partner for your health needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/analyze">Analyze Medicine</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/get-advice">Get Instant Advice</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
