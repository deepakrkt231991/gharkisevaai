
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t bg-secondary mt-auto">
      <div className="container py-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} GrihSeva AI. All rights reserved.
        </p>
        <nav className="flex gap-4">
            <Link href="/summary" className="text-sm text-muted-foreground hover:text-primary">
                App Summary
            </Link>
            <Link href="/terms" className="text-sm text-muted-foreground hover:text-primary">
                Terms of Service
            </Link>
            <Link href="/privacy" className="text-sm text-muted-foreground hover:text-primary">
                Privacy Policy
            </Link>
            <Link href="/pricing" className="text-sm text-muted-foreground hover:text-primary">
                Pricing
            </Link>
             <Link href="/features" className="text-sm text-muted-foreground hover:text-primary">
                Features
            </Link>
        </nav>
      </div>
    </footer>
  );
}
