import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Pill } from 'lucide-react';

export function Header() {
  return (
    <header className="bg-background/80 backdrop-blur-sm sticky top-0 z-40 w-full border-b">
      <div className="container flex h-16 items-center">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg font-headline">
          <Pill className="h-6 w-6 text-primary" />
          <span>DawaAI</span>
        </Link>
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium ml-auto">
          <Link href="/#how-it-works" className="transition-colors hover:text-primary">How it Works</Link>
          <Link href="/get-advice" className="transition-colors hover:text-primary">Get Instant Advice</Link>
        </nav>
        <div className="flex items-center gap-4 ml-auto md:ml-4">
          <Button asChild>
            <Link href="/analyze">Analyze Medicine</Link>
          </Button>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <Menu className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <nav className="grid gap-6 text-lg font-medium mt-8">
                <Link href="/" className="flex items-center gap-2 text-lg font-bold font-headline">
                  <Pill className="h-6 w-6 text-primary" />
                  <span>DawaAI</span>
                </Link>
                <Link href="/#how-it-works" className="hover:text-primary">How it Works</Link>
                <Link href="/get-advice" className="hover:text-primary">Get Instant Advice</Link>
                 <Button asChild className="mt-4">
                    <Link href="/analyze">Analyze Medicine</Link>
                </Button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
