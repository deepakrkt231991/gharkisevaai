'use client';

import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import {
  AirVent,
  Tv,
  Refrigerator,
  WashingMachine,
  Thermometer,
  Droplets,
  Paintbrush,
  Sparkles,
  Wrench,
  Zap,
  Home,
  BedDouble,
  Compass,
  Sofa,
  ChevronRight
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

const serviceCategories = [
  {
    title: 'Appliance Repair',
    services: [
      { name: 'AC', icon: AirVent, href: '#' },
      { name: 'TV', icon: Tv, href: '#' },
      { name: 'Fridge', icon: Refrigerator, href: '#' },
      { name: 'Washing Machine', icon: WashingMachine, href: '#' },
      { name: 'Geyser', icon: Thermometer, href: '#' },
      { name: 'RO Purifier', icon: Droplets, href: '#' },
    ],
  },
  {
    title: 'Home Services',
    services: [
      { name: 'Home Painting', icon: Paintbrush, href: '#' },
      { name: 'Deep Cleaning', icon: Sparkles, href: '#' },
      { name: 'Plumbing', icon: Wrench, href: '/book-service' },
      { name: 'Electrician', icon: Zap, href: '#' },
    ],
  },
  {
    title: 'Property & Real Estate',
    services: [
      { name: 'Sell Home', icon: Home, href: '#', description: 'AI valuation & verification' },
      { name: 'Rent Home', icon: BedDouble, href: '#', description: 'Verified tenants, smart contracts' },
      { name: 'Vastu Check', icon: Compass, href: '/interior-analysis', description: 'Improve your home\'s energy' },
      { name: 'Interior Design', icon: Sofa, href: '/interior-analysis', description: 'Get AI-powered design ideas' },
    ],
  },
];

const ServiceItem = ({ name, icon: Icon, href }: { name: string; icon: LucideIcon; href: string }) => (
    <Link href={href} className="flex flex-col items-center justify-center gap-2 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
            <Icon className="h-8 w-8 text-primary" />
        </div>
        <p className="text-xs font-semibold text-white">{name}</p>
    </Link>
);

const PropertyServiceItem = ({ name, icon: Icon, href, description }: { name: string; icon: LucideIcon; href: string, description: string }) => (
    <Link href={href} className="block">
        <Card className="glass-card h-full hover:border-primary transition-colors">
            <CardContent className="p-4 flex items-center gap-4">
                <div className="bg-primary/10 p-3 rounded-lg"><Icon className="text-primary"/></div>
                <div className="flex-1">
                    <h4 className="font-bold text-white">{name}</h4>
                    <p className="text-xs text-muted-foreground">{description}</p>
                </div>
                <ChevronRight className="text-muted-foreground"/>
            </CardContent>
        </Card>
    </Link>
)

export function AiServiceGrid() {
  return (
    <div className="space-y-8">
      {serviceCategories.map((category) => (
        <div key={category.title}>
          <h3 className="mb-4 text-xl font-bold font-headline text-white">{category.title}</h3>
          {category.title !== 'Property & Real Estate' ? (
             <div className="grid grid-cols-4 gap-4">
                {category.services.map((service) => (
                    <ServiceItem key={service.name} {...service} />
                ))}
             </div>
          ) : (
             <div className="space-y-4">
                {category.services.map((service) => (
                     <PropertyServiceItem key={service.name} {...service} description={service.description || ''} />
                 ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
