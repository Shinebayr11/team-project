"use client"

import { use } from "react"
import { VideoStage } from "@/components/live/video-stage"

export default function LivePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ host?: string; title?: string }>
}) {
  const { id } = use(params)
  const { host, title } = use(searchParams)
  const isHost = host === "1"

  return (
    <main className="mx-auto max-w-4xl px-6 py-6">
      <h1 className="mb-4 text-xl font-bold tracking-tight">
        {title ?? "Шууд шоу"}
      </h1>
      <VideoStage roomName={id} isHost={isHost} />
    </main>
  )
}
