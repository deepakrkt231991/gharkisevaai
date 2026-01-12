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
            दवाओं का प्रबंधन, अब AI की मदद से।
          </h1>
          <p className="text-lg text-foreground/80 md:text-xl">
            दवा के पत्ते की फोटो खींचो, एक्सपायरी डेट जानो, और तुरंत मेडिकल सलाह पाओ। DawaAI आपकी स्वास्थ्य संबंधी ज़रूरतों के लिए आपका विश्वसनीय साथी है।
          </p>
          <Button size="lg" asChild>
            <Link href="/analyze">दवा एनालाइज करें</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
