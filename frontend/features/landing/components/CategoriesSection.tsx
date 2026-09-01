"use client"

/**
 * 5 — Ангилал. Бараан (noir) дэвсгэр, цагаан текст.
 *
 * Chip-үүдийн хоёр мөр эсрэг чиглэлд marquee хийнэ. Marquee нь CSS keyframe
 * (`.wn-marquee`, app/globals.css) — JS-ээр хөтлөх шаардлагагүй, тиймээс scroll
 * -той өрсөлдөхгүй бөгөөд `prefers-reduced-motion` дээр CSS-ээрээ унтарна.
 * Жагсаалт нь 2 удаа давхарлагдсан тул -50% дээр эргэлт нь тасалдалгүй болно.
 */

import { Search } from "lucide-react"

import { VIEWPORT } from "../motion"
import { MaskText } from "./MaskText"
import { ParallaxLayer, SectionShell } from "./SectionShell"
import { motion } from "framer-motion"

const ROW_ONE = [
  "Sneaker",
  "Ретро хувцас",
  "Цуглуулгын карт",
  "Гоо сайхан",
  "Технологи",
  "Гар урлал",
  "Цаг",
  "Ном",
]

const ROW_TWO = [
  "Тоглоом",
  "Загасчлал",
  "Спорт хэрэгсэл",
  "Винил",
  "Гэрийн чимэглэл",
  "Ургамал",
  "Хүүхдийн",
  "Эрдэнэсийн чулуу",
]

export function CategoriesSection() {
  return (
    <SectionShell id="categories" labelledBy="categories-title" tone="light">
      <div className="text-center">
        <ParallaxLayer depth="back">
          <MaskText
            id="categories-title"
            text={"Хайж байгаа бүхэн чинь энд байна"}
            className="mx-auto max-w-[18ch] text-[clamp(2rem,4.6vw,3.75rem)] leading-[0.98] font-[800] tracking-[-0.03em]"
          />
        </ParallaxLayer>
      </div>

      <ParallaxLayer depth="mid" className="mt-14">
        {/* Хоёр мөр хоёулаа хуудсаас өргөн — гадагш нь гарахгүйн тулд эцэг нь
            SectionShell дээр overflow-hidden байна. */}
        <div className="flex flex-col gap-3">
          <MarqueeRow items={ROW_ONE} duration={46} />
          <MarqueeRow items={ROW_TWO} duration={38} reverse />
        </div>
      </ParallaxLayer>

      <ParallaxLayer depth="front" className="mt-12">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VIEWPORT}
          transition={{ duration: 0.5 }}
          className="mx-auto flex w-full max-w-[440px] items-center gap-3 rounded-[6px] border border-white/15 bg-white/8 px-4 py-3.5 backdrop-blur-md"
        >
          <Search className="h-4 w-4 shrink-0 text-white/50" />
          <span className="text-[15px] text-white/50">
            Юу хайж байна вэ
          </span>
        </motion.div>
      </ParallaxLayer>
    </SectionShell>
  )
}

function MarqueeRow({
  items,
  duration,
  reverse = false,
}: {
  items: string[]
  duration: number
  reverse?: boolean
}) {
  const doubled = [...items, ...items]

  return (
    <div className="relative w-screen -translate-x-1/2 overflow-hidden left-1/2 [mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)]">
      <div
        className={`wn-marquee flex w-max gap-3 ${reverse ? "wn-marquee-reverse" : ""}`}
        style={{ ["--wn-marquee-duration" as string]: `${duration}s` }}
      >
        {doubled.map((item, index) => (
          <span
            key={`${item}-${index}`}
            className="rounded-[4px] border border-white/12 bg-white/6 px-4 py-2.5 text-[15px] font-[600] whitespace-nowrap text-white/85"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}
