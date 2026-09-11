"use client"

/**
 * 1 — Hero. Ягаан → гүн ягаан gradient дээр цагаан текст.
 *
 * Гарчиг нь scroll хүлээхгүй, load дээрээ mask reveal-ээр гарна. Утас нь
 * hero-оос гарах үедээ жижгэрч, дээш хөөрч, 3D-гээр налан уусна (mobile дээр
 * налалт бүрэн хасагдана).
 *
 * Утасны хүрээ БҮХЭЛДЭЭ CSS — гадны зураг, SVG файл татахгүй. Дотор нь л
 * бодит зураг (борлуулагч) орох `MediaSlot` суусан.
 *
 * Хоёр 3D эргэлтийг ХОЁР ӨӨР ДАВХАРГА хариуцна: гадна нь scroll-ын гаралт
 * (`rotateX`), дотор нь хулганы налалт (`rotateX` + `rotateY`). Нэг элемент
 * дээр хоёр эх сурвалжаас `rotateX` бичвэл сүүлийнх нь нөгөөг дардаг.
 */

import { useEffect, useState } from "react"
import { Eye } from "lucide-react"
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"

import { HERO_EXIT, HERO_TILT, SPRING, floatTransition } from "../motion"
import { useAmplitude } from "../useAmplitude"
import { GhostCta, PrimaryCta } from "./CtaButtons"
import { MaskText, RevealCta, RevealSub } from "./MaskText"
import { MediaSlot } from "./MediaSlot"
import { useLandingScroll } from "./ScrollProvider"
import { ParallaxLayer, SectionShell } from "./SectionShell"

const CHAT = [
  { user: "Оюунаа", text: "Энэ хэмжээ байгаа юу" },
  { user: "Бат", text: "Дараагийнхыг нь үзүүлээч" },
  { user: "Сүхээ", text: "Авлаа шүү" },
]

/**
 * Утасны эргэн тойронд хөвөх картууд.
 *
 * `mobile: false` гэсэн нь нарийн дэлгэц дээр харагдахгүй: 375px дээр гурав
 * зэрэг байрлуулбал утсаа бүтэн дарна. Хоёр нь үлдэнэ — брифийн шаардлага.
 */
const FLOATERS = [
  {
    label: "Carhartt хүрэм",
    alt: "Ногоон өнгийн хуучирсан Carhartt Detroit хүрэм",
    price: "185,000₮",
    image: "/landing/carhartt-detroit.webp",
    className: "-left-3 top-[24%] sm:-left-24 sm:top-[14%]",
    mobile: true,
    duration: 5.2,
    delay: 0,
  },
  {
    label: "Seiko LM",
    alt: "Улаан циферблаттай эртний Seiko LM Special цаг",
    price: "420,000₮",
    image: "/landing/seiko-lm.webp",
    className: "sm:-right-24 sm:top-[38%]",
    mobile: false,
    duration: 4.4,
    delay: 0.6,
  },
  {
    label: "Арьсан цүнх",
    alt: "Хүрэн өнгийн зөөлөн арьсан мөрний цүнх",
    price: "240,000₮",
    image: "/landing/leather-bag.webp",
    className:
      "-right-3 bottom-[18%] sm:right-auto sm:-left-20 sm:bottom-[12%]",
    mobile: true,
    duration: 6,
    delay: 1.1,
  },
] as const

export function HeroSection() {
  const { amp, tilt, motionOn } = useAmplitude()
  const { scrollY } = useLandingScroll()
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
  const y = useSpring(
    useTransform(exit, [0, 1], [0, HERO_EXIT.y * amp]),
    SPRING
  )
  const opacity = useTransform(exit, [0, 1], [1, HERO_EXIT.opacity])
  const rotateX = useSpring(
    useTransform(exit, [0, 1], [0, HERO_EXIT.rotateX * tilt]),
    SPRING
  )

  // Хулганы байрлал контейнерийн голоос -0.5 … 0.5. `tilt` нь mobile болон
  // reduced-motion үед 0 — тэгвэл налалт бүрэн унтарна.
  const px = useMotionValue(0)
  const py = useMotionValue(0)
  const tiltY = useSpring(
    useTransform(px, [-0.5, 0.5], [-HERO_TILT * tilt, HERO_TILT * tilt]),
    SPRING
  )
  const tiltX = useSpring(
    useTransform(py, [-0.5, 0.5], [HERO_TILT * tilt, -HERO_TILT * tilt]),
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
              text={"Дуудлага худалдааны\nцогц шийдэл"}
              className="text-[clamp(2.75rem,7vw,6.5rem)] leading-[0.95] font-[800] tracking-[-0.03em]"
            />
          </ParallaxLayer>

          <RevealSub
            immediate
            className="mt-6 max-w-[30ch] text-[clamp(1rem,1.4vw,1.25rem)] leading-relaxed text-white/75"
          >
            Шууд дамжуулалт, шуурхай хямдрал — бүгд нэг дээр.
          </RevealSub>

          <RevealCta immediate className="mt-9 flex flex-wrap gap-3">
            <PrimaryCta to="/sign-up">Бүртгүүлэх</PrimaryCta>
            <GhostCta to="/sell">Худалдагч болох</GhostCta>
          </RevealCta>
        </div>

        <div
          className="relative mx-auto w-full max-w-[380px]"
          style={{ perspective: `${HERO_EXIT.perspective}px` }}
          onPointerMove={(event) => {
            if (!tilt) return
            const rect = event.currentTarget.getBoundingClientRect()
            px.set((event.clientX - rect.left) / rect.width - 0.5)
            py.set((event.clientY - rect.top) / rect.height - 0.5)
          }}
          onPointerLeave={() => {
            px.set(0)
            py.set(0)
          }}
        >
          <ParallaxLayer depth="mid">
            <motion.div
              style={{ scale, y, opacity, rotateX, transformOrigin: "50% 0%" }}
              className="relative mx-auto w-[220px] sm:w-[300px]"
            >
              <motion.div
                style={{ rotateX: tiltX, rotateY: tiltY }}
                className="[transform-style:preserve-3d]"
              >
                <PhoneMockup />
              </motion.div>
            </motion.div>
          </ParallaxLayer>

          <ParallaxLayer
            depth="front"
            className="pointer-events-none absolute inset-0"
          >
            {FLOATERS.map((card) => (
              <motion.div
                key={card.label}
                className={`absolute w-[96px] sm:w-[124px] ${
                  card.mobile ? "" : "hidden sm:block"
                } ${card.className}`}
                animate={motionOn ? { y: [-8 * amp, 8 * amp] } : undefined}
                transition={floatTransition(card.duration, card.delay)}
              >
                <div className="rounded-[8px] border border-white/15 bg-white/10 p-2 backdrop-blur-md">
                  <MediaSlot
                    src={card.image}
                    alt={card.alt}
                    ratio="4 / 5"
                    sizes="124px"
                    className="w-full rounded-[6px]"
                  />
                  <div className="mt-2 truncate text-[11px] font-[600] text-white/80 sm:text-[12px]">
                    {card.label}
                  </div>
                  <div className="text-[12px] font-[800] whitespace-nowrap text-white sm:text-[13px]">
                    {card.price}
                  </div>
                </div>
              </motion.div>
            ))}
          </ParallaxLayer>
        </div>
      </div>
    </SectionShell>
  )
}

/**
 * Шууд эфирийн утас.
 *
 * Гурван давхарга: титан хүрээ (gradient border) → хар bezel → дэлгэц.
 * Хажуугийн товчнууд болон Dynamic Island нь чимэглэл тул `aria-hidden`.
 */
function PhoneMockup() {
  return (
    <div className="relative">
      {/* Хажуугийн товчнууд — хүрээний ирмэгээс бага зэрэг цухуйна. */}
      <span
        aria-hidden
        className="absolute top-[16%] -left-[2px] h-[22px] w-[3px] rounded-l-[2px] bg-[#5f5c69]"
      />
      <span
        aria-hidden
        className="absolute top-[23%] -left-[2px] h-[38px] w-[3px] rounded-l-[2px] bg-[#5f5c69]"
      />
      <span
        aria-hidden
        className="absolute top-[31%] -left-[2px] h-[38px] w-[3px] rounded-l-[2px] bg-[#5f5c69]"
      />
      <span
        aria-hidden
        className="absolute top-[26%] -right-[2px] h-[52px] w-[3px] rounded-r-[2px] bg-[#5f5c69]"
      />

      {/* Титан хүрээ. Gradient нь металлын тусгалыг дуурайна. */}
      <div className="rounded-[36px] bg-[linear-gradient(150deg,#d9d6de_0%,#77747f_26%,#efedf2_48%,#6c6975_70%,#cbc8d1_100%)] p-[3px] shadow-[0_40px_90px_-24px_rgb(14_11_24_/_0.6)] sm:rounded-[44px]">
        <div className="rounded-[33px] bg-[#08070d] p-[5px] sm:rounded-[41px]">
          <div className="relative aspect-[9/19.5] w-full overflow-hidden rounded-[28px] bg-[var(--wn-noir)] sm:rounded-[36px]">
            {/* Борлуулагчийн эфир. `priority` — hero-гийн LCP нэр дэвшигч
                тул хойш тавьж болохгүй. */}
            <MediaSlot
              src="/landing/seller-live.webp"
              alt="Шууд эфирээр хувцсаа танилцуулж буй борлуулагч"
              ratio="9 / 19.5"
              sizes="(min-width: 640px) 300px, 220px"
              priority
              className="absolute inset-0"
            />

            {/* Дээд/доод харлуулалт — зураг ямар ч байсан текст уншигдана. */}
            <div
              aria-hidden
              className="absolute inset-0 bg-[linear-gradient(180deg,rgb(8_7_13_/_0.55)_0%,transparent_20%,transparent_52%,rgb(8_7_13_/_0.8)_100%)]"
            />

            {/* Dynamic Island. */}
            <div
              aria-hidden
              className="absolute top-[7px] left-1/2 z-20 flex h-[20px] w-[68px] -translate-x-1/2 items-center justify-end rounded-full bg-black pr-2 sm:top-[9px] sm:h-[26px] sm:w-[92px]"
            >
              <span className="h-[6px] w-[6px] rounded-full bg-[#15131c] sm:h-[8px] sm:w-[8px]" />
            </div>

            <div className="absolute top-[10px] left-[10px] flex items-center gap-1.5 rounded-[4px] bg-[var(--wn-live)] px-1.5 py-1 text-[9px] font-[800] tracking-[0.08em] text-white uppercase sm:top-3 sm:left-3 sm:px-2 sm:text-[10px]">
              <span className="animate-pulse-dot h-1.5 w-1.5 rounded-full bg-white" />
              Шууд
            </div>

            <div className="absolute top-[10px] right-[10px] flex items-center gap-1 rounded-[4px] bg-black/45 px-1.5 py-1 text-[9px] font-[700] text-white/85 sm:top-3 sm:right-3 sm:px-2 sm:text-[10px]">
              <Eye className="h-3 w-3" />
              1,284
            </div>

            <div className="absolute bottom-[62px] left-2.5 flex w-[76%] flex-col gap-1 sm:bottom-[74px] sm:left-3 sm:gap-1.5">
              {CHAT.map((line) => (
                <div
                  key={line.user}
                  className="rounded-[4px] bg-black/40 px-2 py-1 text-[9px] leading-tight text-white/85 sm:text-[10px]"
                >
                  <span className="font-[700] text-white">{line.user}</span>{" "}
                  {line.text}
                </div>
              ))}
            </div>

            <div className="absolute right-2.5 bottom-2.5 left-2.5 flex items-center justify-between gap-2 rounded-[6px] bg-white px-2.5 py-2 sm:right-3 sm:bottom-3 sm:left-3 sm:px-3 sm:py-2.5">
              <div className="text-left">
                <div className="text-[8px] font-[600] text-[var(--wn-ink-3)] sm:text-[9px]">
                  Шууд авах
                </div>
                <div className="text-[12px] font-[800] text-[var(--wn-noir)] sm:text-[13px]">
                  89,000₮
                </div>
              </div>
              <div className="rounded-[4px] bg-[var(--wn-accent)] px-2.5 py-1.5 text-[10px] font-[800] text-white sm:px-3 sm:text-[11px]">
                Авах
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
