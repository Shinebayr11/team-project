"use client"

import { useEffect, useRef, useState, type FormEvent } from "react"
import { useChat } from "@livekit/components-react"
import { Link } from "@/lib/router"
import { useRequireAuth } from "@/hooks/useRequireAuth"

const VISIBLE_COUNT = 6

interface LiveChatOverlayProps {
  /** Video-ийн `relative` контейнер дотор байрлуулах top/bottom/inset утга. */
  className?: string
}

/**
 * Facebook Live шиг видеоны дээр давхарласан chat. Зөвхөн mobile дээр
 * ашиглана (`lg:`-с дээш хажуугийн ChatPanel аль хэдийн байдаг тул).
 * Must be mounted inside a LiveKitRoom.
 */
export function LiveChatOverlay({
  className = "inset-x-3 top-16 bottom-28",
}: LiveChatOverlayProps) {
  const { chatMessages, send } = useChat()
  const { isSignedIn, isLoaded } = useRequireAuth()
  const [input, setInput] = useState("")
  const listRef = useRef<HTMLDivElement>(null)

  const lines = chatMessages.slice(-VISIBLE_COUNT).map((message) => ({
    name: message.from?.name || message.from?.identity || "Зочин",
    text: message.message,
  }))

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight })
  }, [lines.length])

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return
    send(input.trim()).catch((error) => console.error("Chat send failed:", error))
    setInput("")
  }

  return (
    <div
      className={`pointer-events-none absolute z-10 flex flex-col justify-end gap-3 ${className}`}
    >
      <div ref={listRef} className="flex flex-col gap-1.5 overflow-hidden">
        {lines.map((line, i) => (
          <div
            key={i}
            className="max-w-[80%] truncate rounded-2xl bg-black/40 px-3 py-1.5 text-[13px] text-white backdrop-blur-sm"
          >
            <span className="font-[700]">{line.name}</span>{" "}
            <span className="font-[500]">{line.text}</span>
          </div>
        ))}
      </div>

      {isLoaded && !isSignedIn ? (
        <Link
          to="/sign-in"
          className="pointer-events-auto flex h-10 w-fit items-center rounded-full bg-black/40 px-4 text-[13px] font-[700] text-white backdrop-blur-sm"
        >
          Нэвтэрч сэтгэгдэл бичих
        </Link>
      ) : (
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
