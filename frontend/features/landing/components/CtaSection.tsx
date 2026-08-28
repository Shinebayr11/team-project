"use client"

/**
 * 6 — Төгсгөлийн CTA + footer. Ягаан дэвсгэр, цагаан текст.
 *
 * Хуудсын хамгийн сүүлчийн үүрэг: бүртгүүлэх эсвэл худалдагч болох. Footer нь
 * үүнтэй нэг section дотор сууна — тусад нь өнгө шилжүүлэх шаардлагагүй.
 */

import { Link } from "@/lib/router"

import { GhostCta, PrimaryCta } from "./CtaButtons"
import { MaskText, RevealCta } from "./MaskText"
import { ParallaxLayer, SectionShell } from "./SectionShell"

const LINKS = [
  { to: "/live-show", label: "Шууд" },
  { to: "/explore", label: "Судлах" },
  { to: "/home", label: "Дэлгүүр" },
  { to: "/sell", label: "Худалдагч болох" },
]

export function CtaSection() {
  return (
    <SectionShell
      id="cta"
      labelledBy="cta-title"
      tone="light"
      className="content-between"
    >
      <div className="grid min-h-[62svh] place-items-center text-center">
        <ParallaxLayer depth="mid">
          <MaskText
            id="cta-title"
            text={"Өнөөдөр эхлээрэй"}
            className="text-[clamp(2.75rem,7vw,6.5rem)] leading-[0.95] font-[800] tracking-[-0.03em]"
          />
          <RevealCta className="mt-10 flex flex-wrap justify-center gap-3">
            <PrimaryCta to="/sign-up">Үнэгүй бүртгүүлэх</PrimaryCta>
            <GhostCta to="/sell">Худалдагч болох</GhostCta>
          </RevealCta>
        </ParallaxLayer>
      </div>

      {/* pb нь доод nav-д зай гаргаж байна — footer-ийн линкүүд түүний доогуур
          орохгүй. */}
      <footer className="mt-20 flex flex-col gap-5 border-t border-white/20 pt-8 pb-16 sm:flex-row sm:items-center sm:justify-between sm:pb-10">
        <span className="text-[19px] font-[800] tracking-[-0.03em]">
          WhyNot
        </span>

        <nav aria-label="Хөлийн цэс" className="flex flex-wrap gap-x-6 gap-y-2">
          {LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="rounded-[4px] text-[14px] font-[600] text-white/85 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-current"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <span className="text-[13px] text-white/80">© 2026 WhyNot</span>
      </footer>
    </SectionShell>
  )
}
