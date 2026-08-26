"use client"

import { useCallback, useEffect, useState } from "react"
import { useAuth } from "@clerk/nextjs"
import { useApiClient } from "./useApiClient"

export interface ChatParticipant {
  _id: string
  display_name?: string
  shop_name?: string
  avatar_url?: string
}

export interface ConversationSummary {
  _id: string
  other?: ChatParticipant
  last_message_text: string | null
  last_message_at: string | null
  unread: number
}

/** Жагсаалтад харагдах нэр — дэлгүүрийн нэр байвал түүнийг эрхэмлэнэ. */
export const participantName = (p?: ChatParticipant) =>
  p?.shop_name || p?.display_name || "Хэрэглэгч"

// Шинэ зурвас ирснийг мэдэх push суваг байхгүй тул үе үе татна.
const POLL_MS = 8000

/** Нэвтэрсэн хэрэглэгчийн бүх яриа. */
export function useConversations() {
  const { callApi } = useApiClient()
  const { isSignedIn } = useAuth()
  const [conversations, setConversations] = useState<ConversationSummary[]>([])
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    if (!isSignedIn) {
      setConversations([])
      setLoading(false)
      return
    }
    try {
      const { data } = await callApi<{ data: ConversationSummary[] }>(
        "/api/messages/conversations"
      )
      setConversations(data)
    } catch (error) {
      console.error("Яриа уншиж чадсангүй:", error)
    } finally {
      setLoading(false)
    }
  }, [callApi, isSignedIn])

  useEffect(() => {
    refresh()
    const timer = setInterval(refresh, POLL_MS)
    return () => clearInterval(timer)
  }, [refresh])

  /** Тодорхой хэрэглэгчтэй яриа нээх (байхгүй бол үүснэ). */
  const openWith = useCallback(
    async (userId: string): Promise<string | null> => {
      try {
        const { data } = await callApi<{ data: { _id: string } }>(
          "/api/messages/conversations",
          { method: "POST", body: JSON.stringify({ user_id: userId }) }
        )
        await refresh()
        return data._id
      } catch (error) {
        console.error("Яриа нээж чадсангүй:", error)
        return null
      }
    },
    [callApi, refresh]
  )

  const unreadTotal = conversations.reduce((sum, c) => sum + (c.unread ?? 0), 0)

  return { conversations, loading, refresh, openWith, unreadTotal }
}
