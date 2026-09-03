"use client"

import React, { useEffect, useState } from "react"
import { useSearchParams, useNavigate } from "@/lib/router"
import { useConversations, participantName } from "@/hooks/useConversations"
import { useMessages } from "@/hooks/useMessages"
import { ThreadList } from "@/components/messages/ThreadList"
import { ChatView } from "@/components/messages/ChatView"

export const Messages: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const { conversations, loading, openWith, refresh } = useConversations()

  // ?c=<ярианы id> нь гол параметр. ?user=<хэрэглэгчийн id> нь мэдэгдэл зэрэг
  // газраас "энэ хүнтэй чатлах" гэж орж ирэхэд ашиглагдана — тэр тохиолдолд
  // яриаг нээгээд (байхгүй бол үүсгээд) ?c рүү шилжинэ.
  const conversationId = searchParams.get("c")
  const withUserId = searchParams.get("user")
  const [opening, setOpening] = useState(false)

  useEffect(() => {
    if (!withUserId) return
    let cancelled = false
    setOpening(true)
    openWith(withUserId).then((id) => {
      if (cancelled) return
      setOpening(false)
      setSearchParams((prev) => {
        prev.delete("user")
        if (id) prev.set("c", id)
        return prev
      })
    })
    return () => {
      cancelled = true
    }
  }, [withUserId, openWith, setSearchParams])

  const { messages, other, loading: messagesLoading, send } =
    useMessages(conversationId)

  const activeSummary = conversations.find((c) => c._id === conversationId)
  const shopName = participantName(other ?? activeSummary?.other)

  const handleSend = async (text: string) => {
    const result = await send(text)
    // Илгээсний дараа зүүн жагсаалтын "сүүлийн зурвас" шинэчлэгдэнэ.
    if (result.ok) refresh()
    return result
  }

  return (
    <div className="mx-auto max-w-[1180px] px-4 py-6 sm:px-6 lg:py-8">
      {/* `svh` — гар утасны хөтчийн хаяг мөр өндрөө өөрчлөхөд зурвас бичих
          талбар нүднээс далд орохгүй. */}
      <div className="flex h-[calc(100svh-140px)] overflow-hidden rounded-[24px] border border-[var(--wn-line)] bg-white shadow-sm md:h-[720px]">
        {/* Нарийн дэлгэц дээр жагсаалт, яриа хоёр зэрэг багтахгүй тул нэг нь
            нөгөөгөө сольж гарна; md-ээс дээш хоёул зэрэг харагдана. */}
        <div
          className={
            conversationId ? "hidden md:flex" : "flex flex-1 md:flex-none"
          }
        >
          <ThreadList
            conversations={conversations}
            activeId={conversationId}
            loading={loading}
            onSelect={(id) => navigate(`/messages?c=${id}`)}
          />
        </div>

        <div
          className={`flex-col bg-white ${
            conversationId ? "flex flex-1" : "hidden md:flex md:flex-1"
          }`}
        >
          {opening ? (
            <div className="flex flex-1 items-center justify-center text-[15px] font-[500] text-[var(--wn-ink-4)]">
              Яриаг нээж байна...
            </div>
          ) : conversationId ? (
            <ChatView
              other={other ?? activeSummary?.other}
              messages={messages}
              loading={messagesLoading}
              onSend={handleSend}
              // Нарийн дэлгэц дээр жагсаалт руу буцаах цорын ганц гарц.
              onBack={() => navigate("/messages")}
              onOpenShop={() =>
                navigate(`/shop?seller=${encodeURIComponent(shopName)}`)
              }
            />
          ) : (
            <div className="flex flex-1 items-center justify-center text-[15px] font-[500] text-[var(--wn-ink-4)]">
              Яриа сонгож эхлээрэй
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
