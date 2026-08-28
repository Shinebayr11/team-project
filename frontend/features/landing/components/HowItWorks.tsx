import { Gavel, Package, Play } from "lucide-react"
import type { LucideIcon } from "lucide-react"

const STEPS: { icon: LucideIcon; title: string; body: string }[] = [
  {
    icon: Play,
    title: "Дамжуулалтыг нээ",
    body: "Бүртгэлгүйгээр ч дамжуулалт руу орж, юу зарж байгааг хараарай.",
  },
  {
    icon: Gavel,
    title: "Нэвтрээд оролц",
    body: "Дуудлага худалдаанд үнэ хаях, чатаар асуулт асуухад л бүртгэл хэрэгтэй.",
  },
  {
    icon: Package,
    title: "Хүлээж ав",
    body: "Хожсон бараагаа шууд төлж, хаягаараа хүргүүлээрэй.",
  },
]

export function HowItWorks() {
  return (
    <section className="border-t border-[var(--wn-line)]">
      <div className="mx-auto max-w-[1200px] px-6 py-16">
        <h2 className="font-display text-[30px] font-[800] tracking-[-0.03em] text-[var(--wn-ink)]">
          Хэрхэн ажилладаг вэ
        </h2>

        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {STEPS.map((step, index) => (
            <div
              key={step.title}
              className="rounded-[20px] border border-[var(--wn-line)] bg-white p-6"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-[14px] bg-[var(--wn-accent-soft)]">
                <step.icon className="h-5 w-5 text-[var(--wn-accent)]" />
              </div>
              <div className="mt-4 text-[13px] font-[700] text-[var(--wn-ink-4)]">
                {index + 1}-р алхам
              </div>
              <h3 className="mt-1 text-[19px] font-[800] text-[var(--wn-ink)]">
                {step.title}
              </h3>
              <p className="mt-2 text-[15px] leading-relaxed text-[var(--wn-ink-2)]">
                {step.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
