"use client"

import React, { useEffect } from "react"
import { useSearchParams, useNavigate } from "@/lib/router"
import { useStore } from "@/store"
import { ThreadList } from "@/components/messages/ThreadList"
import { ChatView } from "@/components/messages/ChatView"

export const Messages: React.FC = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { threads, ensureThread, markRead, send } = useStore()

  const activeSlug = searchParams.get("seller")
  const allThreads = threads()
  const activeThread = allThreads.find((t) => t.slug === activeSlug)

  useEffect(() => {
    if (!activeSlug) return
    ensureThread(activeSlug)
    markRead(activeSlug)
  }, [activeSlug, ensureThread, markRead])

  return (
    <div className="mx-auto max-w-[1180px] px-6 py-8">
      <div className="flex h-[720px] overflow-hidden rounded-[24px] border border-[var(--wn-line)] bg-white shadow-sm">
        <ThreadList
          threads={allThreads}
          activeSlug={activeSlug}
          onSelect={(slug) => navigate(`/messages?seller=${slug}`)}
        />

        <div className="flex flex-1 flex-col bg-white">
          {activeThread ? (
            <ChatView
              thread={activeThread}
              onSend={(text) => send(activeThread.slug, text)}
              onOpenShop={() => navigate(`/shop?seller=${activeThread.slug}`)}
            />
          ) : (
            <div className="flex flex-1 items-center justify-center text-[15px] font-[500] text-[var(--wn-ink-4)]">
              Select a conversation to start messaging
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
