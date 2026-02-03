
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UserCheck, Gavel, Banknote, Percent } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 py-12 md:py-16">
        <div className="container max-w-4xl mx-auto">
          <div className="text-center mb-12">
             <h1 className="font-headline text-3xl font-bold tracking-tight sm:text-4xl">
              Terms and Conditions
            </h1>
            <p className="mt-2 text-muted-foreground">सेवा की शर्तें</p>
          </div>
            <Card>
              <CardHeader>
                <CardTitle className="font-headline text-2xl">मुख्य शर्तें (Main Conditions)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {terms.map((term, index) => (
                  <div key={index} className="flex items-start gap-4">
                     <div className="mt-1">{term.icon}</div>
                     <div>
                        <h3 className="font-semibold text-lg">{term.title}</h3>
                        <p className="text-muted-foreground">{term.content}</p>
                     </div>
                  </div>
                ))}
              </CardContent>
            </Card>

          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
