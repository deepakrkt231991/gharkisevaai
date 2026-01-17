import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { ArrowRight, Shield } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export function SeasonCheckCard() {
  return (
    <Card className="relative border-none text-white overflow-hidden rounded-xl shadow-lg h-40">
        <Image 
            src="https://picsum.photos/seed/roof/600/400"
            alt="Monsoon roof checkup"
            fill
            className="object-cover z-0"
            data-ai-hint="rooftop view city"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/20 z-10" />
      <CardContent className="relative p-4 flex flex-col justify-between h-full z-20">
        <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-accent mb-1">
                <Shield className="h-3 w-3" />
                <span>AI SEASON CHECK</span>
            </div>
            <h2 className="font-bold font-headline text-2xl leading-tight">
                Monsoon Roof <br/> Checkup / मानसून सुरक्षा
            </h2>
            <p className="text-sm opacity-90 mt-1">AI-verified structural health scanning.</p>
        </div>
        <Button asChild size="sm" variant="ghost" className="bg-transparent hover:bg-transparent text-white p-0 justify-start h-auto w-fit">
            <Link href="/analyze">
                Scan Now <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
