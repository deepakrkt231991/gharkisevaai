export function Footer() {
  return (
    <footer className="border-t bg-secondary mt-auto">
      <div className="container py-6">
        <p className="text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} GrihSevaAI. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
