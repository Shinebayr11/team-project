"use client"

import { useState } from "react"
import type React from "react"
import { ControlBar } from "@livekit/components-react"
import { Square } from "lucide-react"

/**
 * LiveKit-ийн загварын хувьсагчид.
 *
 * `@livekit/components-styles` нь өнгөө БҮГДИЙГ `[data-lk-theme=default]`
 * дотор тодорхойлдог ба `LiveKitRoom` нь тэр шинжийг өөрөө ТАВЬДАГГҮЙ —
 * зөвхөн `.lk-room-container` класс өгдөг. Тиймээс одоог хүртэл `--lk-*`
 * бүр тодорхойлогдоогүй байсан: `background-color: var(--lk-control-bg)`
 * зэрэг мөр бүр computed-value үед хүчингүй болж, товчнууд хар видеон дээр
 * дэвсгэргүй, өвлөсөн бараан бэхээр гарч байв.
 *
 * Шинжийг зөвхөн ControlBar-ыг тойруулж тавьсан — `LiveKitRoom` дээр тавибал
 * `.lk-room-container { background: var(--lk-bg) }` идэвхжиж бүх талбарыг
 * #111 болгож, хажуугийн цагаан чат/дуудлага худалдааны самбарыг сүйтгэнэ.
 */
const controlBarTheme = {
  "--lk-control-bg": "rgba(255,255,255,0.16)",
  "--lk-control-hover-bg": "rgba(255,255,255,0.26)",
  "--lk-control-active-bg": "rgba(255,255,255,0.26)",
  "--lk-control-active-hover-bg": "rgba(255,255,255,0.34)",
  "--lk-control-fg": "#ffffff",
  "--lk-fg": "#ffffff",
  "--lk-bg2": "var(--wn-shot)",
  "--lk-accent-bg": "var(--wn-accent)",
  "--lk-danger": "var(--wn-live-deep)",
  "--lk-border-color": "transparent",
  "--lk-border-radius": "9999px",
  "--lk-font-family": "var(--wn-font)",
  "--lk-font-size": "14px",
} as React.CSSProperties

/** Камер/микрофон + "Дамжуулалт дуусгах" — зөвхөн худалдагчид харагдана. */
export function HostControls({ onEnd }: { onEnd: () => void }) {
  const [confirming, setConfirming] = useState(false)

  return (
    <div className="absolute inset-x-0 bottom-4 flex flex-wrap items-center justify-center gap-3 px-4">
      <div
        data-lk-theme="default"
        style={controlBarTheme}
        className="[&_.lk-control-bar]:p-0"
      >
        <ControlBar
          controls={{
            camera: true,
            microphone: true,
            screenShare: false,
            leave: false,
            chat: false,
          }}
        />
      </div>

      {confirming ? (
        <div className="flex items-center gap-2 rounded-full bg-white p-1.5 pl-4 shadow-lg">
          <span className="text-[14px] font-[700] text-black">
            Дамжуулалтыг дуусгах уу?
          </span>
          <button
            type="button"
            onClick={onEnd}
            className="h-11 rounded-full bg-[var(--wn-live-deep)] px-5 text-[14px] font-[700] text-white transition-colors hover:bg-[var(--wn-live)]"
          >
            Тийм, дуусгах
          </button>
          <button
            type="button"
            onClick={() => setConfirming(false)}
            className="h-11 rounded-full border border-gray-300 px-5 text-[14px] font-[700] text-black transition-colors hover:bg-gray-50"
          >
            Болих
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setConfirming(true)}
          className="flex h-11 items-center gap-2 rounded-full bg-[var(--wn-live-deep)] px-5 text-[14px] font-[700] text-white shadow-lg transition-colors hover:bg-[var(--wn-live)]"
        >
          <Square className="size-4 fill-white" />
          Дамжуулалт дуусгах
        </button>
      )}
    </div>
  )
}
