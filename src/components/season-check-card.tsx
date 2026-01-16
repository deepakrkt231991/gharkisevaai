import Image from 'next/image';
import Link from 'next/link';
import { Button } from './ui/button';
import { ArrowRight, Zap } from 'lucide-react';

export function SeasonCheckCard() {
    return (
        <div className="relative h-48 w-full overflow-hidden rounded-xl">
            <Image
                src="https://picsum.photos/seed/monsoon/800/400"
                alt="Monsoon roof checkup"
                fill
                className="object-cover"
                data-ai-hint="rooftop terrace"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent p-4 flex flex-col justify-end">
                <div className="mb-2 flex items-center gap-2 text-xs font-bold text-accent">
                    <Zap className="h-4 w-4" />
                    <span>AI SEASON CHECK</span>
                </div>
                <h2 className="text-2xl font-bold text-white font-headline">Monsoon Roof Checkup / मानसून सुरक्षा</h2>
                <p className="text-sm text-white/80 mb-3">AI-verified structural health scanning.</p>
                 <Button asChild size="sm" className="w-fit bg-primary/80 backdrop-blur-sm text-white hover:bg-primary">
                    <Link href="/analyze">
                        Scan Now <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                </Button>
            </div>
        </div>
    )
}
