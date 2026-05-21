export function Footer() {
  return (
    <footer className="border-t border-border py-6 text-center text-xs text-muted-foreground font-mono mt-auto">
      Backend made with{" "}
      <a
        href="https://moondb.ai"
        target="_blank"
        rel="noopener noreferrer"
        className="text-foreground underline underline-offset-4 hover:text-primary transition-colors"
      >
        MoonDB.ai
      </a>
    </footer>
  );
}
