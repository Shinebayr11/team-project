"use client"

import { useChat } from "@livekit/components-react"
import { Link } from "@/lib/router"
import { useRequireAuth } from "@/hooks/useRequireAuth"
import { ChatOverlay } from "@/components/liveshow/ChatOverlay"

interface LiveChatOverlayProps {
  className?: string
}

/**
 * `ChatOverlay`-г LiveKit-ийн `useChat`-тэй холбож өгдөг — `live-chat.tsx`
 * `ChatPanel`-тэй адил харьцдагтай ижил зарчим. Must be mounted inside a
 * LiveKitRoom.
 */
export function LiveChatOverlay({ className }: LiveChatOverlayProps) {
  const { chatMessages, send } = useChat()
  const { isSignedIn, isLoaded } = useRequireAuth()

  const lines = chatMessages.map((message) => ({
    name: message.from?.name || message.from?.identity || "Зочин",
    text: message.message,
  }))

  const lockedNotice =
    isLoaded && !isSignedIn ? (
      <Link
        to="/sign-in"
        className="pointer-events-auto flex h-10 w-fit items-center rounded-full bg-black/40 px-4 text-[13px] font-[700] text-white backdrop-blur-sm"
      >
        Нэвтэрч сэтгэгдэл бичих
      </Link>
    ) : undefined

  return (
    <ChatOverlay
      lines={lines}
      lockedNotice={lockedNotice}
      className={className}
      onSend={(text) => {
        send(text).catch((error) => console.error("Chat send failed:", error))
      }}
    />
  )
}
