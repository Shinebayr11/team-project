"use client"

import { useState } from "react"
import { useUser } from "@clerk/nextjs"

const fieldClass =
  "h-[44px] w-full rounded-xl border border-white/25 bg-white/10 px-4 text-[15px] text-white placeholder:text-white/50 outline-none backdrop-blur-sm focus:border-white/60 transition-colors"

/** Aura-style ambient blobs used behind the bold gradient hero card. */
function GradientOrbs() {
  return (
    <>
      <div className="pointer-events-none absolute -top-16 -right-10 size-52 rounded-full bg-white/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-16 size-64 rounded-full bg-black/20 blur-3xl" />
    </>
  )
}

export default function SellerOnboardingPage() {
  const { user } = useUser()
  const [shopName, setShopName] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)

  const submit = async () => {
    if (!shopName.trim()) return
    setSubmitting(true)

    // TODO: server дээр /sellers/apply endpoint холбох
    // const token = await getToken()
    // await fetch(`${process.env.NEXT_PUBLIC_API_URL}/sellers/apply`, {...})

    setDone(true)
    setSubmitting(false)
  }

  if (done) {
    return (
      <div className="mx-auto max-w-md px-6 py-24">
        <div className="rounded-[28px] border border-[var(--wn-line)] bg-[linear-gradient(160deg,#ffffff_0%,#f5f0ff_55%,#fdf2f8_100%)] p-10 text-center shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
          <h1 className="font-display text-[24px] font-[800] tracking-tight text-[var(--wn-ink)]">
            Хүсэлт илгээгдлээ
          </h1>
          <p className="mt-2 text-[15px] text-[var(--wn-ink-3)]">
            Таны худалдагчийн хүсэлтийг хянаж байна. Баталгаажсаны дараа мэдэгдэл
            очно.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-[560px] px-6 py-16">
      <div className="relative overflow-hidden rounded-[28px] bg-[radial-gradient(140%_140%_at_0%_0%,#7c3aed_0%,#5b3fe0_32%,#d946ef_68%,#fb923c_100%)] p-10 shadow-[0_20px_50px_rgba(91,63,224,0.3)]">
        <GradientOrbs />
        <div className="relative">
          <h1 className="font-display text-[28px] font-[800] tracking-tight text-white">
            Худалдагч болох
          </h1>
          <p className="mt-2 text-[15px] text-white/80">
            {user?.firstName ?? "Танд"} тавтай морилно уу. Дэлгүүрийнхээ нэрийг
            оруулаад эхэлье.
          </p>

          <div className="mt-6">
            <label className="mb-2 block text-[13px] font-[700] text-white/80">
              Дэлгүүрийн нэр
            </label>
            <input
              value={shopName}
              onChange={(e) => setShopName(e.target.value)}
              placeholder="Жишээ: Vintage Finds MN"
              className={fieldClass}
              autoComplete="off"
            />
          </div>

          <button
            type="button"
            onClick={submit}
            disabled={submitting}
            className="mt-6 flex h-[52px] w-full items-center justify-center rounded-full bg-white text-[16px] font-[800] text-[var(--wn-accent)] shadow-[0_6px_18px_rgba(0,0,0,0.15)] transition-colors hover:bg-white/90 disabled:opacity-50"
          >
            {submitting ? "Илгээж байна..." : "Хүсэлт илгээх"}
          </button>
        </div>
      </div>
    </div>
  )
}
