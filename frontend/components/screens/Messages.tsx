"use client"

import React, { useEffect, useState } from "react"
import { useSearchParams, useNavigate } from "@/lib/router"
import { useConversations, participantName } from "@/hooks/useConversations"
import { useMessages } from "@/hooks/useMessages"
import { BackButton } from "@/components/ui/BackButton"
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
  // Амжилтгүй болвол `?user=` хэвээр үлдэнэ — дахин оролдоход хэн рүү бичих
  // гэж байсан нь мэдэгдэж байх ёстой. Өмнө нь чимээгүй арчигдаж, хэрэглэгч
  // хоосон дэлгэц харан юу болсныг мэдэхгүй үлддэг байв.
  const [openFailed, setOpenFailed] = useState(false)
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    if (!withUserId) return
    let cancelled = false
    setOpening(true)
    setOpenFailed(false)
    openWith(withUserId).then((id) => {
      if (cancelled) return
      setOpening(false)
      if (!id) {
        setOpenFailed(true)
        return
      }
      setSearchParams((prev) => {
        prev.delete("user")
        prev.set("c", id)
        return prev
      })
    })
    return () => {
      cancelled = true
    }
  }, [withUserId, attempt, openWith, setSearchParams])

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
      {/* Хуудсын түвшний буцах — мэдэгдэл, худалдан авалт, дэлгүүрээс чат руу
          орж ирдэг тул өмнөх хуудас руугаа буцах зам хэрэгтэй. ChatView доторх
          сум нь өөр үүрэгтэй: нарийн дэлгэц дээр ярианы ЖАГСААЛТ руу сэлгэнэ. */}
      <BackButton className="mb-4" fallback="/home" />

      {/* `svh` — гар утасны хөтчийн хаяг мөр өндрөө өөрчлөхөд зурвас бичих
          талбар нүднээс далд орохгүй. Хасаж буй утга нь Topbar (68px),
          хуудасны зай, дээрх буцах товчийг нийлүүлсэн өндөр. */}
      <div className="flex h-[calc(100svh-180px)] overflow-hidden rounded-[24px] border border-[var(--wn-line)] bg-white shadow-sm md:h-[720px]">
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
          ) : openFailed ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
              <p className="text-[15px] font-[600] text-[var(--wn-ink-2)]">
                Яриа нээж чадсангүй.
              </p>
              <button
                type="button"
                onClick={() => setAttempt((count) => count + 1)}
                className="rounded-full bg-[var(--wn-ink)] px-5 py-2.5 text-[14px] font-[700] text-white transition-colors hover:bg-[var(--wn-ink-2)]"
              >
                Дахин оролдох
              </button>
            </div>
          ) : (
            <div className="flex flex-1 items-center justify-center text-[15px] font-[500] text-[var(--wn-ink-4)]">
              Зүүн талаас яриагаа сонгоно уу
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
