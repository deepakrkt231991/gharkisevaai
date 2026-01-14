import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Camera, Wrench, Wind, Tv, Refrigerator, WashingMachine, Zap, Construction } from 'lucide-react';

const services = [
  { icon: Wind, label: 'AC Repair' },
  { icon: Tv, label: 'TV Repair' },
  { icon: Refrigerator, label: 'Fridge' },
  { icon: WashingMachine, label: 'Washing' },
  { icon: Zap, label: 'Electrician' },
  { icon: Construction, label: 'Plumber' },
];

export function Hero() {
  return (
    <section className="container py-8 md:py-12">
      <div className="flex flex-col gap-8">
        <Card className="bg-gradient-to-r from-primary/80 to-primary text-primary-foreground shadow-lg">
          <CardContent className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-2 text-center md:text-left">
                <h2 className="font-headline text-2xl md:text-3xl font-bold">
                  Need a repair? Get a quote now.
                </h2>
                <p className="text-primary-foreground/80 text-lg">
                  Just upload a photo of the problem, and our AI will give you an instant price estimate.
                </p>
              </div>
              <Button
                asChild
                size="lg"
                className="bg-accent text-accent-foreground hover:bg-accent/90 flex-shrink-0"
              >
                <Link href="/analyze">
                  <Camera className="mr-2" />
                  Get an Instant Quote
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <h2 className="font-headline text-2xl md:text-3xl font-bold text-center">
            Our Services
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 md:gap-6">
            {services.map((service) => (
              <div key={service.label} className="flex flex-col items-center gap-2">
                <div className="bg-card p-4 rounded-lg shadow-md w-full aspect-square flex items-center justify-center hover:shadow-xl transition-shadow">
                  <service.icon className="h-8 w-8 text-primary" />
                </div>
                <p className="font-semibold text-center text-sm">{service.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
