import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { EarningsDashboard } from '@/components/earnings-dashboard';

export default function EarningsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-secondary/50">
      <Header />
      <main className="flex-1">
        <EarningsDashboard />
      </main>
      <Footer />
    </div>
  );
}
