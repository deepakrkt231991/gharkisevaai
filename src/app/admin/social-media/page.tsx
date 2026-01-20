import { SocialAdGenerator } from '@/components/social-ad-generator';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';

export default function SocialMediaPage() {
    return (
        <div className="flex flex-col min-h-screen">
          <Header/>
          <main className="flex-1 py-12 md:py-16">
            <div className="container">
                <div className="flex items-center gap-4 mb-8">
                     <Button variant="outline" size="icon" asChild>
                        <Link href="/admin">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <h1 className="text-3xl font-bold font-headline">Worker Recruitment Ads</h1>
                </div>
                 <p className="text-muted-foreground max-w-3xl mb-8">
                    Use these pre-made templates to recruit workers on LinkedIn and Facebook. The copy is optimized to attract professionals by highlighting the benefits of your platform, like 0% commission and direct payments.
                </p>
                <SocialAdGenerator />
            </div>
           </main>
           <Footer/>
        </div>
    );
}
