"use client"

/**
 * 3 — Coin хэтэвч. Цайвар (paper) дэвсгэр, noir текст.
 *
 * Coin багцын 3 карт scroll явцад дараалан (stagger) ирнэ. Дунд карт нь
 * "хамгийн их сонгогддог" гэж товойж, parallax-ийн mid давхаргад суудаг.
 */

import { Check } from "lucide-react"
import { motion } from "framer-motion"

import { VIEWPORT, itemVariants, listVariants } from "../motion"
import { useAmplitude } from "../useAmplitude"
import { MaskText, RevealSub } from "./MaskText"
import { ParallaxLayer, SectionShell } from "./SectionShell"

const PACKS = [
  { coins: "500", price: "5,000₮", note: "Эхлэхэд", featured: false },
  { coins: "2,000", price: "18,000₮", note: "Хамгийн түгээмэл", featured: true },
  { coins: "5,000", price: "42,000₮", note: "Тогтмол оролцогчид", featured: false },
]

const PERKS = ["Хугацаа дуусдаггүй", "Bid дээр шууд зарцуулагдана"]

export function WalletSection() {
  const { motionOn } = useAmplitude()

  return (
    <SectionShell id="wallet" labelledBy="wallet-title" tone="dark">
      <div className="text-center">
        <ParallaxLayer depth="back">
          <MaskText
            id="wallet-title"
            text={"Coin цэнэглээд шууд bid хий"}
            className="mx-auto max-w-[16ch] text-[clamp(2rem,4.6vw,3.75rem)] leading-[0.98] font-[800] tracking-[-0.03em]"
          />
          <RevealSub className="mx-auto mt-6 max-w-[46ch] text-[clamp(1rem,1.3vw,1.15rem)] leading-relaxed text-[var(--wn-ink-2)]">
            Картаа дахин дахин оруулах шаардлагагүй. Нэг удаа цэнэглээд, эфирт
            хоцролгүй оролц.
          </RevealSub>
        </ParallaxLayer>
      </div>

      <ParallaxLayer depth="mid" className="mt-14">
        <motion.div
          variants={listVariants()}
          initial="hidden"
          whileInView="show"
          viewport={VIEWPORT}
          className="grid gap-4 sm:grid-cols-3"
        >
          {PACKS.map((pack) => (
            <motion.div
              key={pack.coins}
              variants={itemVariants(!motionOn)}
              className={
                pack.featured
                  ? "rounded-[8px] border border-[var(--wn-accent)] bg-white p-6 shadow-[0_24px_60px_-30px_rgb(91_63_224_/_0.55)] sm:-translate-y-4"
                  : "rounded-[8px] border border-[var(--wn-line-2)] bg-white/70 p-6"
              }
            >
              <div className="text-[12px] font-[700] tracking-[0.08em] text-[var(--wn-ink-3)] uppercase">
                {pack.note}
              </div>
              <div className="mt-3 flex items-baseline gap-1.5">
                <span className="text-[38px] leading-none font-[800] tracking-[-0.03em] text-[var(--wn-noir)]">
                  {pack.coins}
                </span>
                <span className="text-[15px] font-[700] text-[var(--wn-accent)]">
                  coin
                </span>
              </div>
              <div className="mt-2 text-[15px] font-[600] text-[var(--wn-ink-2)]">
                {pack.price}
              </div>
              <div
                className={
                  pack.featured
                    ? "mt-6 rounded-[6px] bg-[var(--wn-accent)] py-2.5 text-center text-[14px] font-[700] text-white"
                    : "mt-6 rounded-[6px] border border-[var(--wn-line-3)] py-2.5 text-center text-[14px] font-[700] text-[var(--wn-noir)]"
                }
              >
                Цэнэглэх
              </div>
            </motion.div>
          ))}
        </motion.div>
      </ParallaxLayer>

      <div className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2">
        {PERKS.map((perk) => (
          <span
            key={perk}
            className="inline-flex items-center gap-1.5 text-[14px] font-[600] text-[var(--wn-ink-3)]"
          >
            <Check className="h-4 w-4 text-[var(--wn-accent)]" />
            {perk}
          </span>
        ))}
      </div>
    </SectionShell>
  )
}
