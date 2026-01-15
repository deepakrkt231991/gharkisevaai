import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t bg-secondary mt-auto">
      <div className="container py-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} GHARSEVAAI. All rights reserved.
        </p>
        <nav className="flex gap-4">
            <Link href="/terms" className="text-sm text-muted-foreground hover:text-primary">
                Terms of Service
            </Link>
        </nav>
      </div>
    </footer>
  );
}

    