"use client"

import React, { useEffect, useRef, useState } from "react"
import { QRCodeSVG } from "qrcode.react"
import { ExternalLink } from "lucide-react"
import { useApiClient } from "@/hooks/useApiClient"
import { Modal } from "@/components/ui/Modal"

interface Deeplink {
  name?: string
  link: string
  logo?: string
}

type Obj = Record<string, unknown>
const asObj = (v: unknown): Obj => (v && typeof v === "object" ? (v as Obj) : {})
const str = (o: Obj, ...keys: string[]) => {
  for (const k of keys) if (typeof o[k] === "string" && o[k]) return o[k] as string
  return ""
}

/**
 * Wire (QPay оператор) `next_action`-ыг `{ qr: { text, deeplinks: [...] } }`
 * хэлбэрээр буцаадаг. Хэлбэр нь оператороос хамаардаг, баримтжаагүй тул
 * бусад бичиглэлийг ч нөөцөд үлдээв.
 */
const parseNextAction = (na: unknown) => {
  const out = { qrImage: "", qrText: "", url: "", deeplinks: [] as Deeplink[] }
  if (typeof na === "string") {
    if (/^https?:\/\//.test(na)) out.url = na
    else out.qrText = na
    return out
  }
  const o = asObj(na)
  const qr = asObj(o.qr)
  out.qrImage = str(qr, "image", "base64") || str(o, "qr_image", "qrImage", "qr_base64")
  out.qrText = str(qr, "text") || str(o, "qr_text", "qrText", "qr_code")
  out.url = str(o, "url", "redirect_url", "checkout_url", "link")
  const links = qr.deeplinks ?? o.deeplinks ?? o.urls ?? o.deep_links
  if (Array.isArray(links)) {
    out.deeplinks = links.filter(
      (l): l is Deeplink => !!l && typeof l === "object" && typeof (l as Deeplink).link === "string"
    )
  }
  return out
}

export interface PaymentIntent {
  id: string
  status: string
  amount?: number
  description?: string
  next_action?: unknown
}

interface Props {
  intent: PaymentIntent
  /** Төлбөр амжилттай болбол хэтэвчид нэмэгдэх дүн (урамшуулал орсон). */
  creditAmount: number
  onClose: () => void
  onPaid: () => void
}

const TERMINAL_FAILURES = ["canceled", "cancelled", "expired", "failed"]

/**
 * Банкны QR/аппын цонх. Төлбөрийг банк талд хийх тул энэ нь зөвхөн төлвийг
 * ажиглана — хэтэвчийг сервер (webhook эсвэл энэ шалгалт) цэнэглэнэ.
 */
export const TopUpPaymentModal: React.FC<Props> = ({ intent, creditAmount, onClose, onPaid }) => {
  const { callApi } = useApiClient()
  const [nextAction, setNextAction] = useState<unknown>(intent.next_action ?? null)
  const [status, setStatus] = useState(intent.status)

  // `onPaid` нь ихэвчлэн inline сум — хамаарал болговол интервал секунд
  // тутам дахин тавигдана.
  const onPaidRef = useRef(onPaid)
  useEffect(() => {
    onPaidRef.current = onPaid
  }, [onPaid])

  useEffect(() => {
    let alive = true
    const tick = async () => {
      try {
        const { data } = await callApi<{ data: { status: string; next_action?: unknown } }>(
          `/api/payment/${intent.id}`
        )
        if (!alive) return
        setStatus(data.status)
        // QR нь confirm хийсний дараа жаахан хоцорч үүсэж болно.
        if (data.next_action) setNextAction(data.next_action)
        if (data.status === "succeeded") {
          clearInterval(timer)
          onPaidRef.current()
        }
        if (TERMINAL_FAILURES.includes(data.status)) clearInterval(timer)
      } catch (error) {
        // Сүлжээний түр доголдол цонхыг хаах ёсгүй — дараагийн тактад дахин оролдоно.
        console.error("Төлбөрийн төлөв шалгаж чадсангүй:", error)
      }
    }
    const timer = setInterval(tick, 3000)
    return () => {
      alive = false
      clearInterval(timer)
    }
  }, [callApi, intent.id])

  const { qrImage, qrText, url, deeplinks } = parseNextAction(nextAction)
  const qrSrc =
    qrImage && (qrImage.startsWith("data:") || qrImage.startsWith("http")
      ? qrImage
      : `data:image/png;base64,${qrImage}`)
  const failed = TERMINAL_FAILURES.includes(status)

  return (
    <Modal
      title="Төлбөр төлөх"
      subtitle={`₮${creditAmount.toLocaleString()} хэтэвчид нэмэгдэнэ`}
      onClose={onClose}
    >
      <div className="flex flex-col items-center gap-4 px-6 py-5">
        {failed ? (
          <div className="py-6 text-center text-[14px] font-[600] text-[var(--wn-ink-2)]">
            Төлбөр цуцлагдсан эсвэл хугацаа нь дууссан байна. Дахин оролдоно уу.
          </div>
        ) : (
          <>
            {qrSrc ? (
               
              <img src={qrSrc} alt="Төлбөрийн QR" className="size-52 rounded-xl bg-white p-2" />
            ) : qrText ? (
              <div className="rounded-xl bg-white p-3">
                <QRCodeSVG value={qrText} size={196} />
              </div>
            ) : (
              <div className="size-52 animate-pulse rounded-xl bg-[var(--wn-surface-2)]" />
            )}

            <p className="text-center text-[13px] font-[600] text-[var(--wn-ink-3)]">
              Банкны аппаараа QR-ыг уншуулна уу. Төлбөр баталгаажмагц хэтэвч
              автоматаар цэнэглэгдэнэ.
            </p>

            {url && (
              <a
                href={url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 rounded-xl border border-[var(--wn-line)] px-4 py-2.5 text-[14px] font-[700] text-[var(--wn-accent)] hover:bg-[var(--wn-accent-soft)]"
              >
                <ExternalLink className="size-4" /> Төлбөрийн хуудсыг нээх
              </a>
            )}

            {deeplinks.length > 0 && (
              <div className="grid max-h-40 w-full grid-cols-2 gap-2 overflow-y-auto">
                {deeplinks.map((dl) => (
                  <a
                    key={dl.link}
                    href={dl.link}
                    className="flex items-center gap-2 rounded-xl border border-[var(--wn-line)] px-3 py-2 hover:border-[var(--wn-line-2)]"
                  >
                    { }
                    {dl.logo && <img src={dl.logo} alt="" className="size-6 shrink-0 rounded" />}
                    <span className="truncate text-[12px] font-[600] text-[var(--wn-ink-2)]">
                      {dl.name || "Банкны апп"}
                    </span>
                  </a>
                ))}
              </div>
            )}

            <div className="text-[12px] font-[600] text-[var(--wn-ink-4)]">
              Төлбөрийг хүлээж байна…
            </div>
          </>
        )}
      </div>
    </Modal>
  )
}
