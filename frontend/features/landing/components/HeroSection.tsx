"use client"

/**
 * 1 — Hero. Ягаан → гүн ягаан gradient дээр цагаан текст.
 *
 * Гарчиг нь scroll хүлээхгүй, load дээрээ mask reveal-ээр гарна. Phone mockup
 * нь hero-оос гарах үедээ жижгэрч, дээш хөөрч, 3D-гээр налан уусна (mobile
 * дээр налалт бүрэн хасагдана).
 */

import { useEffect, useState } from "react"
import { Eye } from "lucide-react"
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion"

import { HERO_EXIT, SPRING, floatTransition } from "../motion"
import { useAmplitude } from "../useAmplitude"
import { GhostCta, PrimaryCta } from "./CtaButtons"
import { MaskText, RevealCta, RevealSub } from "./MaskText"
import { ParallaxLayer, SectionShell } from "./SectionShell"

const CHAT = [
  { user: "Оюунаа", text: "Энэ хэмжээ байгаа юу" },
  { user: "Бат", text: "Дараагийнхыг нь үзүүлээч" },
  { user: "Сүхээ", text: "Авлаа шүү" },
]

/** Phone-ын эргэн тойронд хөвөх картууд: [x, y, эргэлт, үргэлжлэх хугацаа]. */
const FLOATERS = [
  {
    label: "Ретро хүрэм",
    price: "45,000₮",
    className: "-left-6 top-[14%] sm:-left-24",
    duration: 5.2,
    delay: 0,
  },
  {
    label: "Sneaker · 42",
    price: "120,000₮",
    className: "-right-4 top-[38%] sm:-right-24",
    duration: 4.4,
    delay: 0.6,
  },
  {
    label: "Ховор карт",
    price: "18,000₮",
    className: "-left-10 bottom-[12%] sm:-left-20",
    duration: 6,
    delay: 1.1,
  },
]

export function HeroSection() {
  const { amp, tilt, motionOn } = useAmplitude()
  const { scrollY } = useScroll()
  const [viewport, setViewport] = useState(1)

  useEffect(() => {
    const sync = () => setViewport(window.innerHeight || 1)
    sync()
    window.addEventListener("resize", sync, { passive: true })
    return () => window.removeEventListener("resize", sync)
  }, [])

  // Hero-оос гарах явц: 0 = дээд тал, 1 = нэг дэлгэц гүйлгэсэн үе.
  const exit = useTransform(scrollY, [0, viewport], [0, 1])
  const scale = useSpring(
    useTransform(exit, [0, 1], [1, 1 - (1 - HERO_EXIT.scale) * amp]),
    SPRING
  )
  const y = useSpring(useTransform(exit, [0, 1], [0, HERO_EXIT.y * amp]), SPRING)
  const opacity = useTransform(exit, [0, 1], [1, HERO_EXIT.opacity])
  const rotateX = useSpring(
    useTransform(exit, [0, 1], [0, HERO_EXIT.rotateX * tilt]),
    SPRING
  )

  return (
    <SectionShell id="hero" labelledBy="hero-title" tone="light">
      <div className="grid items-center gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:gap-14">
        <div>
          <ParallaxLayer depth="back">
            <MaskText
              as="h1"
              id="hero-title"
              immediate
              text={"Шууд дамжуулалт\nдээр нь худалдаж ав"}
              className="text-[clamp(2.75rem,7vw,6.5rem)] leading-[0.95] font-[800] tracking-[-0.03em]"
            />
          </ParallaxLayer>

          <RevealSub
            immediate
            className="mt-6 max-w-[30ch] text-[clamp(1rem,1.4vw,1.25rem)] leading-relaxed text-white/75"
          >
            Дуудлага худалдаа, flash sale, шууд эфирийн бэлэг — бүгд нэг дээр.
          </RevealSub>

          <RevealCta immediate className="mt-9 flex flex-wrap gap-3">
            <PrimaryCta to="/sign-up">Үнэгүй бүртгүүлэх</PrimaryCta>
            <GhostCta to="/sell">Худалдагч болох</GhostCta>
          </RevealCta>
        </div>

        <div
          className="relative mx-auto w-full max-w-[380px]"
          style={{ perspective: `${HERO_EXIT.perspective}px` }}
        >
          <ParallaxLayer depth="mid">
            <motion.div
              style={{ scale, y, opacity, rotateX, transformOrigin: "50% 0%" }}
              className="relative mx-auto w-[240px] sm:w-[300px]"
            >
              <PhoneMockup />
            </motion.div>
          </ParallaxLayer>

          <ParallaxLayer
            depth="front"
            className="pointer-events-none absolute inset-0"
          >
            {FLOATERS.map((card) => (
              <motion.div
                key={card.label}
                className={`absolute hidden w-[136px] rounded-[8px] border border-white/15 bg-white/10 p-3 backdrop-blur-md sm:block ${card.className}`}
                animate={motionOn ? { y: [-10 * amp, 10 * amp] } : undefined}
                transition={floatTransition(card.duration, card.delay)}
              >
                <div className="h-14 w-full rounded-[6px] bg-gradient-to-br from-white/25 to-white/5" />
                <div className="mt-2 text-[12px] font-[600] text-white/80">
                  {card.label}
                </div>
                <div className="text-[13px] font-[800] text-white">
                  {card.price}
                </div>
              </motion.div>
            ))}
          </ParallaxLayer>
        </div>
      </div>
    </SectionShell>
  )
}

/** Шууд эфирийн дэлгэц — бүхэлдээ CSS-ээр зурагдсан (растр зураг байхгүй). */
function PhoneMockup() {
  return (
    <div className="rounded-[26px] border border-white/20 bg-[var(--wn-noir)] p-2 shadow-[0_40px_90px_-24px_rgb(14_11_24_/_0.6)]">
      <div className="relative aspect-[9/18] overflow-hidden rounded-[20px] bg-[linear-gradient(180deg,#2a2440_0%,#0e0b18_100%)]">
        {/* Эфирийн "тайз": зөөлөн гэрэл + барааны дүрс. Растр зураг ашиглаагүй
            тул hero-д ачаалагдах зураг байхгүй — LCP нь текст хэвээр үлдэнэ. */}
        <div className="absolute inset-x-0 top-[18%] h-[46%] bg-[radial-gradient(ellipse_at_center,rgb(124_92_255_/_0.45)_0%,transparent_68%)]" />
        <div className="absolute top-[26%] left-1/2 h-[26%] w-[46%] -translate-x-1/2 rounded-[8px] bg-[linear-gradient(150deg,rgb(255_255_255_/_0.22),rgb(255_255_255_/_0.04))] shadow-[0_20px_40px_-18px_rgb(0_0_0_/_0.7)]" />

        <div className="absolute top-3 left-3 flex items-center gap-1.5 rounded-[4px] bg-[var(--wn-live)] px-2 py-1 text-[10px] font-[800] tracking-[0.08em] text-white uppercase">
          <span className="animate-pulse-dot h-1.5 w-1.5 rounded-full bg-white" />
          Live
        </div>

        <div className="absolute top-3 right-3 flex items-center gap-1 rounded-[4px] bg-black/45 px-2 py-1 text-[10px] font-[700] text-white/85">
          <Eye className="h-3 w-3" />
          1,284
        </div>

        <div className="absolute bottom-[74px] left-3 flex w-[74%] flex-col gap-1.5">
          {CHAT.map((line) => (
            <div
              key={line.user}
              className="rounded-[4px] bg-black/35 px-2 py-1 text-[10px] leading-tight text-white/85"
            >
              <span className="font-[700] text-white">{line.user}</span>{" "}
              {line.text}
            </div>
          ))}
        </div>

        <div className="absolute right-3 bottom-3 left-3 flex items-center justify-between rounded-[6px] bg-white px-3 py-2.5">
          <div className="text-left">
            <div className="text-[9px] font-[600] text-[var(--wn-ink-3)]">
              Buy it now
            </div>
            <div className="text-[13px] font-[800] text-[var(--wn-noir)]">
              89,000₮
            </div>
          </div>
          <div className="rounded-[4px] bg-[var(--wn-accent)] px-3 py-1.5 text-[11px] font-[800] text-white">
            Авах
          </div>
        </div>
      </div>
    </div>
  )
}
