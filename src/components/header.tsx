import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Wrench, Bell, LayoutDashboard, Share2, Users, Handshake, Bot, Languages, UserPlus, Hammer } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function Header() {
  return (
    <header className="bg-background/80 backdrop-blur-sm sticky top-0 z-40 w-full border-b">
      <div className="container flex h-16 items-center">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg font-headline">
          <Wrench className="h-6 w-6 text-primary" />
          <span>GrihSeva AI</span>
        </Link>
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium ml-auto">
          <Link href="/dashboard/earnings" className="transition-colors hover:text-primary">Dashboard</Link>
          <Link href="/find-a-worker" className="transition-colors hover:text-primary">Find a Worker</Link>
          <Link href="/rent-tools" className="transition-colors hover:text-primary">Rent a Tool</Link>
          <Link href="/promote" className="transition-colors hover:text-primary">Promote & Earn</Link>
          <Link href="/worker-signup" className="transition-colors hover:text-primary">Become a Worker</Link>
          <Button asChild>
            <Link href="/analyze">Get a Quote</Link>
          </Button>
        </nav>
        <div className="flex items-center gap-2 md:ml-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
                <span className="sr-only">Notifications</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <div className="flex flex-col">
                  <p className="font-semibold">🎉 Congratulations!</p>
                  <p className="text-sm text-muted-foreground">Rahul has joined your team.</p>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <div className="flex flex-col">
                  <p className="font-semibold">💰 New Earning!</p>
                  <p className="text-sm text-muted-foreground">+₹0.75 from Amit's AC repair.</p>
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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
                  <span>GrihSeva AI</span>
                </Link>
                <Link href="/dashboard/earnings" className="flex items-center gap-4 text-muted-foreground hover:text-primary"><LayoutDashboard />Dashboard</Link>
                <Link href="/promote" className="flex items-center gap-4 text-muted-foreground hover:text-primary"><Share2 />Promote & Earn</Link>
                <Link href="/find-a-worker" className="flex items-center gap-4 text-muted-foreground hover:text-primary"><Users />Find a Worker</Link>
                <Link href="/rent-tools" className="flex items-center gap-4 text-muted-foreground hover:text-primary"><Hammer />Rent a Tool</Link>
                <Link href="/worker-signup" className="flex items-center gap-4 text-muted-foreground hover:text-primary"><Handshake />Become a Worker</Link>
                <Link href="/worker-signup" className="flex items-center gap-4 text-muted-foreground hover:text-primary"><UserPlus />Login / Register</Link>
                <Link href="/analyze" className="flex items-center gap-4 text-muted-foreground hover:text-primary"><Bot />AI Help</Link>
                <Link href="#" className="flex items-center gap-4 text-muted-foreground hover:text-primary"><Languages />Change Language</Link>
                 <Button asChild className="mt-4">
                    <Link href="/analyze">Get a Quote</Link>
                </Button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
