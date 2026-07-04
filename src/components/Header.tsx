import Link from "next/link";

export default function Header() {
  return (
    <header className="border-b border-border">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
        <Link href="/" className="font-heading text-base font-semibold tracking-tight text-foreground">
          Hritik Jhaveri
        </Link>
        <nav className="flex items-center gap-6 text-sm text-muted">
          <a
            href="https://github.com/codex83"
            target="_blank"
            rel="noreferrer"
            className="transition-colors hover:text-foreground"
          >
            GitHub
          </a>
        </nav>
      </div>
    </header>
  );
}
