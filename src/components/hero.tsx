import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Camera, Wind, Tv, Refrigerator, WashingMachine, Zap, Construction, Wrench, FileText, Home, ShoppingBasket } from 'lucide-react';
import { ServiceCard, type Service } from '@/components/service-card';
import { DynamicBanner } from './dynamic-banner';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

const services: Service[] = [
  { icon: Wind, label: 'AC Repair', color: 'text-blue-500', bgColor: 'bg-blue-100' },
  { icon: Tv, label: 'TV Repair', color: 'text-orange-500', bgColor: 'bg-orange-100' },
  { icon: Refrigerator, label: 'Fridge', color: 'text-cyan-500', bgColor: 'bg-cyan-100' },
  { icon: WashingMachine, label: 'Washing', color: 'text-purple-500', bgColor: 'bg-purple-100' },
  { icon: Zap, label: 'Electrician', color: 'text-yellow-500', bgColor: 'bg-yellow-100' },
  { icon: Construction, label: 'Plumber', color: 'text-green-500', bgColor: 'bg-green-100' },
  { icon: Wrench, label: 'Home Repair', color: 'text-red-500', bgColor: 'bg-red-100' },
  { icon: FileText, label: 'Get Quote', color: 'text-indigo-500', bgColor: 'bg-indigo-100' },
];

export function Hero() {
  return (
    <section className="container py-8 md:py-12">
      <div className="flex flex-col gap-12">
        
        <DynamicBanner />

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
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-4 md:gap-6">
            {services.map((service) => (
              <ServiceCard key={service.label} {...service} />
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="font-headline text-2xl md:text-3xl font-bold text-center">
            Marketplace: खरीदें, बेचें, किराए पर लें
          </h2>
          <Card className="bg-card shadow-sm">
            <CardContent className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex flex-col items-center text-center gap-3 p-4 rounded-lg hover:bg-secondary/50 transition-colors">
                <div className="bg-green-100 p-4 rounded-full">
                  <Home className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="font-bold text-lg font-headline">घर किराए पर लें</h3>
                <p className="text-muted-foreground text-sm">Find verified properties for rent without any brokerage.</p>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span>
                        <Button variant="outline" disabled>घर देखें</Button>
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Coming Soon!</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className="flex flex-col items-center text-center gap-3 p-4 rounded-lg hover:bg-secondary/50 transition-colors">
                 <div className="bg-red-100 p-4 rounded-full">
                  <ShoppingBasket className="h-8 w-8 text-red-600" />
                </div>
                <h3 className="font-bold text-lg font-headline">पुराना सामान बेचें</h3>
                <p className="text-muted-foreground text-sm">Sell your used furniture and appliances to verified buyers.</p>
                <Button variant="outline" asChild><Link href="/analyze">सामान बेचें</Link></Button>
              </div>
               <div className="flex flex-col items-center text-center gap-3 p-4 rounded-lg hover:bg-secondary/50 transition-colors">
                 <div className="bg-blue-100 p-4 rounded-full">
                  <Wrench className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="font-bold text-lg font-headline">उपकरण किराए पर लें</h3>
                <p className="text-muted-foreground text-sm">Workers can rent tools from other workers in the community.</p>
                 <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span>
                        <Button variant="outline" disabled>उपकरण देखें</Button>
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Coming Soon!</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </section>
  );
}
