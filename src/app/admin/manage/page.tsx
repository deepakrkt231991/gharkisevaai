import { AdminManualEntry } from '@/components/admin-manual-entry';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Header } from '@/components/header';

export default function AdminManagePage() {
    return (
        <div className="flex flex-col min-h-screen bg-secondary/50">
          <Header/>
          <main className="flex-1 py-12 md:py-16">
            <div className="container">
                <div className="flex items-center gap-4 mb-8">
                     <Button variant="outline" size="icon" asChild>
                        <Link href="/admin">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <h1 className="text-3xl font-bold font-headline">Manual Data Entry</h1>
                </div>
                 <p className="text-muted-foreground max-w-3xl mb-8">
                    Use these forms to manually add new workers or property listings directly into the Firestore database.
                </p>
                <AdminManualEntry />
            </div>
           </main>
        </div>
    );
}
