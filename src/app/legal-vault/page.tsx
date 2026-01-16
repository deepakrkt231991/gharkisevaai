import { LegalVault } from '@/components/legal-vault';
import { BottomNavBar } from '@/components/bottom-nav-bar';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Lock } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';

function LegalRegistrationHeader() {
    return (
         <header className="sticky top-0 z-50 flex items-center justify-between bg-background/80 p-4 backdrop-blur-md">
            <Button variant="ghost" size="icon" asChild>
                <Link href="/profile">
                    <ArrowLeft className="h-6 w-6" />
                </Link>
            </Button>
            <h1 className="text-xl font-bold font-headline text-center flex-1">Legal Registration</h1>
             <Badge variant="outline" className="border-border bg-card/80">
                <Lock className="mr-2 h-3 w-3" />
                ENCRYPTED
            </Badge>
        </header>
    );
}

export default function LegalVaultPage() {
  return (
    <div className="dark bg-background text-foreground">
        <div className="relative mx-auto flex min-h-screen w-full max-w-md flex-col">
            <LegalRegistrationHeader/>
            <main className="flex-1 p-4 pb-32 overflow-y-auto">
                <LegalVault />
            </main>
            <BottomNavBar />
        </div>
    </div>
  );
}
