"use client"

import { useChat, useRemoteParticipants } from "@livekit/components-react"
import { Link } from "@/lib/router"
import { ChatPanel } from "@/components/liveshow/ChatPanel"
import { useRequireAuth } from "@/hooks/useRequireAuth"

/**
 * Chat over LiveKit's data channel, rendered with the browse chat design.
 * Must be mounted inside a LiveKitRoom.
 */
export function LiveChat({ hostName }: { hostName: string }) {
  const { chatMessages, send } = useChat()
  const participants = useRemoteParticipants()
  const { isSignedIn, isLoaded } = useRequireAuth()

  const lines = chatMessages.map((message) => ({
    // `name` is what the sender typed for themselves; identity is the random
    // per-connection id we only fall back to.
    name: message.from?.name || message.from?.identity || "Зочин",
    text: message.message,
  }))

  // Anyone may watch, but commenting needs an account — otherwise every
  // visitor would appear as the same anonymous "Зочин".
  const lockedNotice =
    isLoaded && !isSignedIn ? (
      <Link
        to="/sign-in"
        className="flex h-[36px] w-full items-center justify-center rounded-xl border border-[var(--wn-line)] bg-white text-[13px] font-[700] text-[var(--wn-accent)] transition-colors hover:bg-[var(--wn-surface-2)]"
      >
        Нэвтэрч сэтгэгдэл бичих
      </Link>
    ) : undefined

  return (
    <ChatPanel
      lines={lines}
      viewers={participants.length}
      hostName={hostName}
      lockedNotice={lockedNotice}
      onSend={(text) => {
        send(text).catch((error) => console.error("Chat send failed:", error))
      }}
    />
  )
}
