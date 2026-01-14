import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Wrench, Bell } from 'lucide-react';

export function Header() {
  return (
    <header className="bg-background/80 backdrop-blur-sm sticky top-0 z-40 w-full border-b">
      <div className="container flex h-16 items-center">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg font-headline">
          <Wrench className="h-6 w-6 text-primary" />
          <span>GrihSevaAI</span>
        </Link>
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium ml-auto">
          <Link href="/find-a-worker" className="transition-colors hover:text-primary">Find a Worker</Link>
          <Button asChild>
            <Link href="/analyze">Smart Diagnosis</Link>
          </Button>
        </nav>
        <div className="flex items-center gap-4 md:ml-4">
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
            <span className="sr-only">Notifications</span>
          </Button>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <Menu className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
               <SheetTitle className="sr-only">Menu</SheetTitle>
               <SheetDescription className="sr-only">Main navigation menu.</SheetDescription>
              <nav className="grid gap-6 text-lg font-medium mt-8">
                <Link href="/" className="flex items-center gap-2 text-lg font-bold font-headline">
                  <Wrench className="h-6 w-6 text-primary" />
                  <span>GrihSevaAI</span>
                </Link>
                <Link href="/find-a-worker" className="hover:text-primary">Find a Worker</Link>
                 <Button asChild className="mt-4">
                    <Link href="/analyze">Smart Diagnosis</Link>
                </Button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
