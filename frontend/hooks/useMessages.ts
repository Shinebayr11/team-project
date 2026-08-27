"use client"

import { useCallback, useEffect, useState } from "react"
import { useApiClient } from "./useApiClient"
import { ChatParticipant } from "./useConversations"

export interface ChatLine {
  _id: string
  text: string
  mine: boolean
  createdAt: string
}

// Нээлттэй яриа дээр илүү шуурхай байх ёстой тул жагсаалтаас олон дахин татна.
const POLL_MS = 4000

/** Нэг ярианы зурвасууд. */
export function useMessages(conversationId?: string | null) {
  const { callApi } = useApiClient()
  const [messages, setMessages] = useState<ChatLine[]>([])
  const [other, setOther] = useState<ChatParticipant | undefined>()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    if (!conversationId) {
      setMessages([])
      setOther(undefined)
      setLoading(false)
      return
    }
    try {
      const { data } = await callApi<{
        data: { other?: ChatParticipant; messages: ChatLine[] }
      }>(`/api/messages/conversations/${conversationId}`)
      setMessages(data.messages)
      setOther(data.other)
      setError(null)
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Уншиж чадсангүй")
    } finally {
      setLoading(false)
    }
  }, [callApi, conversationId])

  useEffect(() => {
    setLoading(true)
    refresh()
    if (!conversationId) return
    const timer = setInterval(refresh, POLL_MS)
    return () => clearInterval(timer)
  }, [conversationId, refresh])

  // Яриаг нээсэн даруйд уншсанд тооцно.
  useEffect(() => {
    if (!conversationId) return
    callApi(`/api/messages/conversations/${conversationId}/read`, {
      method: "PATCH",
    }).catch(() => {
      // Уншсан тэмдэглэл алдаа өгвөл чат ажиллахад саад болохгүй.
    })
  }, [callApi, conversationId, messages.length])

  const send = useCallback(
    async (text: string): Promise<{ ok: boolean; message?: string }> => {
      if (!conversationId) return { ok: false, message: "Яриа сонгогдоогүй" }
      try {
        const { data } = await callApi<{ data: ChatLine }>(
          `/api/messages/conversations/${conversationId}/messages`,
          { method: "POST", body: JSON.stringify({ text }) }
        )
        // Сервер polling хүлээлгүй шууд харуулна.
        setMessages((prev) => [...prev, data])
        return { ok: true }
      } catch (sendError) {
        return {
          ok: false,
          message:
            sendError instanceof Error ? sendError.message : "Илгээж чадсангүй",
        }
      }
    },
    [callApi, conversationId]
  )

  return { messages, other, loading, error, send, refresh }
}
