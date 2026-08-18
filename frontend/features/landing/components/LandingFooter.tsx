import { Link } from "@/lib/router"

const LINKS = [
  { to: "/live-show", label: "Шууд шоу" },
  { to: "/explore", label: "Судлах" },
  { to: "/home", label: "Дэлгүүр" },
  { to: "/sell", label: "Худалдагч болох" },
]

export function LandingFooter() {
  return (
    <footer className="border-t border-[var(--wn-line)] bg-white">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-4 px-6 py-10 sm:flex-row sm:items-center sm:justify-between">
        <span className="font-display text-[19px] font-[800] tracking-[-0.04em] text-[var(--wn-ink)]">
          WhyNot
        </span>

        <nav className="flex flex-wrap gap-x-6 gap-y-2">
          {LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="text-[14px] font-[600] text-[var(--wn-ink-3)] transition-colors hover:text-[var(--wn-ink)]"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <span className="text-[13px] text-[var(--wn-ink-4)]">
          © {new Date().getFullYear()} WhyNot
        </span>
      </div>
    </footer>
  )
}
