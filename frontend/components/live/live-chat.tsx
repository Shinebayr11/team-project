"use client"

import { useRef, useState } from "react"
import { useChat, useRemoteParticipants } from "@livekit/components-react"
import { Link } from "@/lib/router"
import { ReelChatLine } from "@/types"
import { ChatPanel } from "@/components/liveshow/ChatPanel"
import { useRequireAuth } from "@/hooks/useRequireAuth"

export interface LiveChatState {
  lines: ReelChatLine[]
  send: (text: string) => void
}

/**
 * Chat over LiveKit's data channel. Must be called inside a LiveKitRoom.
 *
 * Үзэгчийн дэлгэц чатыг хоёр газар (дэлгэцийн самбар, гар утасны давхарга)
 * харуулдаг тул нэг л удаа дуудаад үр дүнг нь хоёуланд нь дамжуулна.
 */
export function useLiveChat(): LiveChatState {
  const { chatMessages, send } = useChat()

  return {
    lines: chatMessages.map((message) => ({
      // `name` is what the sender typed for themselves; identity is the random
      // per-connection id we only fall back to.
      name: message.from?.name || message.from?.identity || "Зочин",
      text: message.message,
    })),
    send: (text) => {
      send(text).catch((error) => console.error("Chat send failed:", error))
    },
  }
}

/**
 * Anyone may watch, but commenting needs an account — otherwise every
 * visitor would appear as the same anonymous "Зочин".
 */
function useChatLocked() {
  const { isSignedIn, isLoaded } = useRequireAuth()
  return isLoaded && !isSignedIn
}

/** Хостын самбарт — өөрөө чатад холбогдоно. Must be mounted inside a LiveKitRoom. */
export function LiveChat({
  hostName,
  className,
}: {
  hostName: string
  className?: string
}) {
  const chat = useLiveChat()
  return <LiveChatPanel chat={chat} hostName={hostName} className={className} />
}

/** Browse-ийн чатын загвартай самбар. `ChatPanel` нь `hidden lg:flex` тул зөвхөн дэлгэц дээр. */
export function LiveChatPanel({
  chat,
  hostName,
  className,
}: {
  chat: LiveChatState
  hostName: string
  className?: string
}) {
  const participants = useRemoteParticipants()
  const locked = useChatLocked()

  return (
    <ChatPanel
      lines={chat.lines}
      viewers={participants.length}
      hostName={hostName}
      className={className}
      lockedNotice={
        locked ? (
          <Link
            to="/sign-in"
            className="flex h-[36px] w-full items-center justify-center rounded-xl border border-[var(--wn-line)] bg-white text-[13px] font-[700] text-[var(--wn-accent)] transition-colors hover:bg-[var(--wn-accent-wash)]"
          >
            Нэвтэрч сэтгэгдэл бичих
          </Link>
        ) : undefined
      }
      onSend={chat.send}
    />
  )
}

const FADE_TOP = "linear-gradient(to bottom, transparent, black 48px)"

/**
 * Гар утсан дээр видеон дээр хөвөх мөрүүд (Browse-ийн `ReelMobileChat`).
 * Өндөр нь тогтмол: `justify-end` шинэ мөрийг доод талд барьж, дээд захын
 * бүдгэрэлт зөвхөн хуучин мөрүүдэд хүрнэ — өндөр нь контентоороо байвал
 * цөөн мөр ч тэр бүдгэрэлт дотор орж харагдахгүй болно.
 */
export function LiveChatLines({
  lines,
  hostName,
}: {
  lines: ReelChatLine[]
  hostName: string
}) {
  return (
    <div
      className="flex h-[25dvh] min-w-0 flex-1 flex-col justify-end gap-1 overflow-hidden"
      style={{ maskImage: FADE_TOP, WebkitMaskImage: FADE_TOP }}
    >
      {lines.slice(-30).map((line, i) => (
        <div
          key={i}
          className="text-[13px] leading-snug break-words text-white/90 [text-shadow:0_1px_2px_rgba(0,0,0,0.6)]"
        >
          <span
            className={`mr-1.5 font-[700] ${
              line.name === hostName
                ? "text-[var(--wn-accent-soft)]"
                : "text-white"
            }`}
          >
            {line.name}
          </span>
          {line.text}
        </div>
      ))}
    </div>
  )
}

/**
 * Гар утасны доод оролт. 16px: iOS түүнээс жижиг талбарт фокуслахад хуудсыг
 * томруулдаг (`app/layout.tsx`-ийн viewport үүнийг хаагаагүй), бүтэн
 * дэлгэцийн эфирт тэр нь бүх давхаргыг хөдөлгөнө.
 */
export function LiveChatInput({ onSend }: { onSend: (text: string) => void }) {
  const [input, setInput] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)
  const locked = useChatLocked()

  if (locked) {
    return (
      <Link
        to="/sign-in"
        className="flex h-[40px] w-full items-center justify-center rounded-full border border-white/30 bg-white/15 text-[13px] font-[700] text-white backdrop-blur-sm"
      >
        Нэвтэрч сэтгэгдэл бичих
      </Link>
    )
  }

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault()
    const text = input.trim()
    if (!text) return
    onSend(text)
    setInput("")
    // Гарыг хаана — эс тэгвэл видеоны тал хувийг халхалсаар байна.
    inputRef.current?.blur()
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        ref={inputRef}
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        enterKeyHint="send"
        placeholder="Сэтгэгдэл бичих..."
        aria-label="Чатын мессеж"
        className="h-[40px] w-full rounded-full border border-white/30 bg-white/15 px-4 text-[16px] text-white outline-none backdrop-blur-sm placeholder:text-white/60"
      />
    </form>
  )
}
