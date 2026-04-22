import Link from "next/link";
import { SearchCheck, Sparkles } from "lucide-react";
import { ActionLink, Pill } from "@/components/ui";

const links = [
  { href: "/", label: "Landing" },
  { href: "/analysis/new", label: "New Analysis" },
  { href: "/analysis/report-logistics-vn", label: "Result" },
  { href: "/reports", label: "Reports" }
];

export function TopNav() {
  return (
    <header className="sticky top-0 z-20 border-b border-moss/10 bg-canvas/85 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:px-10">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-ink text-paper">
            <SearchCheck className="h-5 w-5" />
          </div>
          <div>
            <p className="font-display text-xl">Problem Finder AI</p>
            <p className="text-xs uppercase tracking-[0.28em] text-moss/60">
              Market pain research workflow
            </p>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 text-sm text-ink/72 md:flex">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="transition hover:text-ink">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Pill tone="neutral">MVP v1</Pill>
          <ActionLink href="/analysis/new" variant="primary">
            <Sparkles className="mr-2 h-4 w-4" />
            Start analysis
          </ActionLink>
        </div>
      </div>
    </header>
  );
}
