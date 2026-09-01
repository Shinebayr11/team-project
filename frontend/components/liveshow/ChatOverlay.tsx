"use client"

import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react"

interface ChatOverlayLine {
  name: string
  text: string
}

interface ChatOverlayProps {
  lines: ChatOverlayLine[]
  onSend: (text: string) => void
  /** Sign-in prompt-оор input-ыг сольж орлуулна — зочин бол ашиглана. */
  lockedNotice?: ReactNode
  /** Video-ийн `relative` контейнер дотор байрлуулах left/right/top/bottom. */
  className?: string
}

const VISIBLE_COUNT = 6

/**
 * Facebook Live шиг видеоны дээр давхарласан chat feed. Presentational —
 * өгөгдлийн эх сурвалж (LiveKit `useChat` эсвэл локал mock state) дуудагч
 * талдаа үлддэг, `components/liveshow/ChatPanel.tsx`-тэй ижил зарчим.
 */
export function ChatOverlay({
  lines,
  onSend,
  lockedNotice,
  className = "left-3 right-3 top-16 bottom-28",
}: ChatOverlayProps) {
  const [input, setInput] = useState("")
  const listRef = useRef<HTMLDivElement>(null)
  const visible = lines.slice(-VISIBLE_COUNT)

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight })
  }, [visible.length])

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return
    onSend(input.trim())
    setInput("")
  }

  return (
    <div
      className={`pointer-events-none absolute z-10 flex flex-col justify-end gap-3 ${className}`}
    >
      <div ref={listRef} className="flex flex-col gap-1.5 overflow-hidden">
        {visible.map((line, i) => (
          <div
            key={i}
            className="max-w-[80%] truncate rounded-2xl bg-black/40 px-3 py-1.5 text-[13px] text-white backdrop-blur-sm"
          >
            <span className="font-[700]">{line.name}</span>{" "}
            <span className="font-[500]">{line.text}</span>
          </div>
        ))}
      </div>

      {lockedNotice ?? (
        <form
          onSubmit={handleSubmit}
          className="pointer-events-auto flex h-10 items-center rounded-full bg-black/40 px-4 backdrop-blur-sm"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Сэтгэгдэл бичих..."
            aria-label="Chat message"
            className="w-full bg-transparent text-[13px] text-white placeholder:text-white/60 outline-none"
          />
        </form>
      )}
    </div>
  )
}
