import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { AdminDashboard } from '@/components/admin-dashboard';

export default function AdminPage() {
  return (
    <div className="flex flex-col min-h-screen bg-secondary/50">
      <Header />
      <main className="flex-1 py-8 md:py-12">
        <div className="container">
          <AdminDashboard />
        </div>
      </main>
      <Footer />
    </div>
  );
}
