"use client"

/**
 * Үг тус бүрээр mask reveal хийдэг гарчиг ба түүнийг дагах дэд текст / CTA.
 *
 * Хоёр горимтой:
 *
 *  - `immediate` (зөвхөн hero) — reveal нь ЦЭВЭР CSS. Hero-гийн гарчиг бол
 *    хуудсын LCP элемент; framer-motion-ы `initial="hidden"` түүнийг hydration
 *    болтол opacity 0-оор барьдаг тул удаан утсан дээр LCP нь JS-ийн ард
 *    хойшилдог. CSS keyframe эхний paint дээрээ асна.
 *  - үлдсэн section-ууд — `whileInView` + framer-motion. Тэд viewport-оос
 *    гадна эхэлдэг тул LCP-д нөлөөлөхгүй.
 *
 * Үг бүр `overflow: hidden` бүрхүүлд суух ба доороосоо (y: 110%) ургаж гарна.
 * `\n` тэмдэгт мөр таслана. Reduced-motion үед зөвхөн opacity fade үлдэнэ
 * (CSS горимд keyframe бүрэн унтарна).
 */

import { motion } from "framer-motion"

import { cn } from "@/lib/utils"

import {
  DELAY,
  VIEWPORT,
  WORD_STAGGER,
  ctaVariants,
  headingVariants,
  subVariants,
  wordVariants,
} from "../motion"
import { useAmplitude } from "../useAmplitude"

/** "үг1 үг2" → мөр бүрийн үгсийн жагсаалт. */
function toLines(text: string): string[][] {
  return text.split("\n").map((line) => line.split(" "))
}

interface MaskTextProps {
  text: string
  as?: "h1" | "h2" | "p"
  id?: string
  className?: string
  /** Stagger эхлэхээс өмнөх завсарлага (сек). */
  delay?: number
  /** Hero-д: scroll хүлээхгүй, CSS-ээр шууд тоглоно. */
  immediate?: boolean
}

export function MaskText({
  text,
  as: Tag = "h2",
  id,
  className,
  delay = 0,
  immediate = false,
}: MaskTextProps) {
  const { motionOn } = useAmplitude()
  const lines = toLines(text)

  if (immediate) {
    // Мөр бүрийн эхний үг нийт жагсаалтын хэдүгээрт таарахыг урьдчилан бодно:
    // stagger нь мөр дамжин үргэлжлэх ёстой.
    const lineOffsets = lines.reduce<number[]>(
      (acc, words, index) => [...acc, acc[index] + words.length],
      [0]
    )

    return (
      <Tag id={id} className={cn("text-balance", className)}>
        {lines.map((words, lineIndex) => (
          <span key={lineIndex} className="block">
            {words.map((token, tokenIndex) => (
              <span
                key={`${lineIndex}-${tokenIndex}`}
                className={cn(maskClass, tokenIndex < words.length - 1 && GAP)}
              >
                <span
                  className="wn-rise inline-block"
                  style={{
                    ["--wn-delay" as string]: `${
                      delay + (lineOffsets[lineIndex] + tokenIndex) * WORD_STAGGER
                    }s`,
                  }}
                >
                  {token}
                </span>
              </span>
            ))}
          </span>
        ))}
      </Tag>
    )
  }

  const word = wordVariants(!motionOn)

  return (
    <Tag id={id} className={cn("text-balance", className)}>
      <motion.span
        className="block"
        variants={headingVariants(delay)}
        initial="hidden"
        whileInView="show"
        viewport={VIEWPORT}
      >
        {lines.map((words, lineIndex) => (
          <span key={lineIndex} className="block">
            {words.map((token, tokenIndex) => (
              <span
                key={`${lineIndex}-${tokenIndex}`}
                className={cn(maskClass, tokenIndex < words.length - 1 && GAP)}
              >
                <motion.span variants={word} className="inline-block">
                  {token}
                </motion.span>
              </span>
            ))}
          </span>
        ))}
      </motion.span>
    </Tag>
  )
}

/**
 * -mb/pb хос нь mask-ийн доод ирмэгийг доош түлхэж, "у", "ц" мэтийн доош
 * сүүлтэй үсгийг тайрахаас сэргийлнэ.
 *
 * Үг хоорондын зайг margin-аар өгдгийн шалтгаан: inline-block элементийн
 * СҮҮЛД байгаа хоосон зайг browser хумьдаг тул `{token}{" "}` гэж бичвэл
 * үгс наалдаж гардаг.
 */
const maskClass =
  "-mb-[0.16em] inline-block overflow-hidden pb-[0.16em] align-bottom"

/** Мөрийн сүүлчийн үгээс бусдад залгах үгийн зай. */
const GAP = "me-[0.25em]"

/** Гарчгийн дараа ирэх дэд текст. */
export function RevealSub({
  children,
  className,
  immediate = false,
}: {
  children: React.ReactNode
  className?: string
  immediate?: boolean
}) {
  const { motionOn } = useAmplitude()

  if (immediate) {
    return (
      <p
        className={cn("wn-lift", className)}
        style={{ ["--wn-delay" as string]: `${DELAY.sub}s` }}
      >
        {children}
      </p>
    )
  }

  return (
    <motion.p
      className={className}
      variants={subVariants(!motionOn)}
      initial="hidden"
      whileInView="show"
      viewport={VIEWPORT}
    >
      {children}
    </motion.p>
  )
}

/** Хамгийн сүүлд гарч ирэх CTA бүлэг. */
export function RevealCta({
  children,
  className,
  immediate = false,
}: {
  children: React.ReactNode
  className?: string
  immediate?: boolean
}) {
  const { motionOn } = useAmplitude()

  if (immediate) {
    return (
      <div
        className={cn("wn-lift", className)}
        style={{
          ["--wn-delay" as string]: `${DELAY.cta}s`,
          ["--wn-lift-from" as string]: "16px",
        }}
      >
        {children}
      </div>
    )
  }

  return (
    <motion.div
      className={className}
      variants={ctaVariants(!motionOn)}
      initial="hidden"
      whileInView="show"
      viewport={VIEWPORT}
    >
      {children}
    </motion.div>
  )
}
