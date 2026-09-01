"use client"

/**
 * Landing-ийн CTA товчнууд.
 *
 * Аппын `components/ui/button` нь shadcn-ийн `--primary` токеноор будагддаг
 * (улбар шар) бөгөөд pill radius-тай. Landing нь ягаан-нил палетр, 6px radius
 * ашигладаг тул энд тусдаа, гэхдээ аппын font/hover хэлтэй нэг байхаар
 * бичигдэв. Хоёулаа навигацийн холбоос тул `<a>` хэвээр үлдэнэ.
 */

import { Link } from "@/lib/router"
import { cn } from "@/lib/utils"

const base =
  "inline-flex h-12 items-center justify-center rounded-[6px] px-6 text-[15px] font-[700] tracking-[-0.01em] transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-current"

/** Хар (ink) дүүргэлттэй үндсэн товч — ягаан болон бараан дэвсгэр дээр. */
export function PrimaryCta({
  to,
  children,
  className,
}: {
  to: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <Link
      to={to}
      className={cn(
        base,
        "bg-[var(--wn-noir)] text-white hover:bg-[#241f35]",
        className
      )}
    >
      {children}
    </Link>
  )
}

/** Хүрээтэй хоёрдогч товч. Өнгийг `currentColor`-оос авдаг тул tone-д дасна. */
export function GhostCta({
  to,
  children,
  className,
}: {
  to: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <Link
      to={to}
      className={cn(
        base,
        "border border-current/35 hover:border-current/70 hover:bg-current/10",
        className
      )}
    >
      {children}
    </Link>
  )
}
