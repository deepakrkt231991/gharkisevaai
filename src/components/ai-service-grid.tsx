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
  ChevronRight,
  Package,
  Building,
  Tag,
  Warehouse
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

const serviceCategories = [
   {
    title: 'Property & Marketplace',
    services: [
      { name: 'Buy', icon: Building, href: '/explore?tab=buy', description: 'AI verified properties' },
      { name: 'Sell', icon: Tag, href: '/explore?tab=sell', description: 'List your property for sale' },
      { name: 'Rent', icon: BedDouble, href: '/explore?tab=rent', description: 'Find homes for rent' },
      { name: 'Marketplace', icon: Warehouse, href: '/marketplace', description: 'Buy/Sell used items' },
    ],
  },
  {
    title: 'Appliance Repair',
    services: [
      { name: 'AC', icon: AirVent, href: '/find-a-worker?category=ac' },
      { name: 'TV', icon: Tv, href: '/find-a-worker?category=tv' },
      { name: 'Fridge', icon: Refrigerator, href: '/find-a-worker?category=fridge' },
      { name: 'Washing Machine', icon: WashingMachine, href: '/find-a-worker?category=washing-machine' },
      { name: 'Geyser', icon: Thermometer, href: '/find-a-worker?category=geyser' },
      { name: 'RO Purifier', icon: Droplets, href: '/find-a-worker?category=ro-purifier' },
    ],
  },
  {
    title: 'Home Services',
    services: [
      { name: 'Home Painting', icon: Paintbrush, href: '/find-a-worker?category=painting' },
      { name: 'Deep Cleaning', icon: Sparkles, href: '/find-a-worker?category=cleaning' },
      { name: 'Plumbing', icon: Wrench, href: '/find-a-worker?category=plumbing' },
      { name: 'Electrician', icon: Zap, href: '/find-a-worker?category=electrician' },
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
            <CardContent className="p-4">
                <div className="bg-primary/10 p-3 rounded-lg w-fit mb-3"><Icon className="text-primary"/></div>
                <h4 className="font-bold text-white">{name}</h4>
                <p className="text-xs text-muted-foreground">{description}</p>
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
          {category.title !== 'Property & Marketplace' ? (
             <div className="grid grid-cols-4 gap-4">
                {category.services.map((service) => (
                    <ServiceItem key={service.name} {...service} />
                ))}
             </div>
          ) : (
             <div className="grid grid-cols-2 gap-4">
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
