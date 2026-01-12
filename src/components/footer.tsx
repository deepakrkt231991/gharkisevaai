export function Footer() {
  return (
    <footer className="border-t bg-secondary">
      <div className="container py-6">
        <p className="text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} DawaAI. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
