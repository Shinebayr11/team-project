"use client"

import { useChat, useRemoteParticipants } from "@livekit/components-react"
import { ChatPanel } from "@/components/liveshow/ChatPanel"

/**
 * Chat over LiveKit's data channel, rendered with the browse chat design.
 * Must be mounted inside a LiveKitRoom.
 */
export function LiveChat({ hostName }: { hostName: string }) {
  const { chatMessages, send } = useChat()
  const participants = useRemoteParticipants()

  const lines = chatMessages.map((message) => ({
    name: message.from?.identity ?? "guest",
    text: message.message,
  }))

  return (
    <ChatPanel
      lines={lines}
      viewers={participants.length}
      hostName={hostName}
      onSend={(text) => {
        send(text).catch((error) => console.error("Chat send failed:", error))
      }}
    />
  )
}
