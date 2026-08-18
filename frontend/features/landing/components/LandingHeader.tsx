import { Link } from "@/lib/router"

const navLink =
  "rounded-full px-4 py-2 text-[15px] font-[700] text-[var(--wn-ink-2)] transition-colors hover:bg-[var(--wn-surface-2)] hover:text-[var(--wn-ink)]"

export function LandingHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-[var(--wn-line)] bg-white/85 backdrop-blur-md">
      <div className="mx-auto flex h-[68px] max-w-[1200px] items-center justify-between px-6">
        <Link
          to="/"
          className="font-display text-[21px] font-[800] tracking-[-0.04em] text-[var(--wn-ink)]"
        >
          WhyNot
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          <Link to="/live-show" className={navLink}>
            Шууд шоу
          </Link>
          <Link to="/explore" className={navLink}>
            Судлах
          </Link>
          <Link to="/home" className={navLink}>
            Дэлгүүр
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <Link
            to="/sign-in"
            className="rounded-full px-5 py-2.5 text-[15px] font-[700] text-[var(--wn-ink)] transition-colors hover:bg-[var(--wn-surface-2)]"
          >
            Нэвтрэх
          </Link>
          <Link
            to="/sign-up"
            className="rounded-full bg-[var(--wn-accent)] px-5 py-2.5 text-[15px] font-[700] text-white transition-colors hover:bg-[var(--wn-accent-hover)]"
          >
            Бүртгүүлэх
          </Link>
        </div>
      </div>
    </header>
  )
}
