"use client"

import { use, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@clerk/nextjs"
import { VideoStage } from "@/components/live/video-stage"

export default function LivePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ host?: string; title?: string; showId?: string }>
}) {
  const { id } = use(params)
  const { host, title, showId } = use(searchParams)
  const isHost = host === "1"
  const { user, isLoaded } = useUser()
  const router = useRouter()

  useEffect(() => {
    if (isHost && isLoaded && !user) router.replace("/sign-in")
  }, [isHost, isLoaded, user, router])

  if (isHost && (!isLoaded || !user)) return null

  return (
    <main className="mx-auto max-w-4xl px-6 py-6">
      <h1 className="mb-4 text-xl font-bold tracking-tight">
        {title ?? "Шууд шоу"}
      </h1>
      <VideoStage roomName={id} isHost={isHost} showId={showId} />
    </main>
  )
}
