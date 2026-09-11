"use client"

import { use, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@clerk/nextjs"

import { useElapsed } from "@/hooks/useElapsed"
import { useLiveKitToken } from "@/hooks/useLiveKitToken"
import { useLiveShowDetail } from "@/hooks/useLiveShowDetail"
import { BroadcastHeader } from "@/components/live/broadcast-header"
import { VideoStage } from "@/components/live/video-stage"
import { LiveViewer } from "@/components/live/live-viewer"

function Notice({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto flex h-[calc(100svh-68px)] max-w-[1440px] items-center justify-center px-4">
      <p className="text-sm text-[var(--wn-ink-3)]">{children}</p>
    </div>
  )
}

export default function LivePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ host?: string; title?: string; showId?: string }>
}) {
  // `id` нь LiveKit өрөөний нэр. Token авахад ХЭРЭГЛЭХГҮЙ — өрөөг шууд дамжуулалтаас нь
  // сервер олдог тул зөвхөн хуучин холбоосын үлдэгдэл.
  use(params)
  const { host, title, showId } = use(searchParams)
  const wantsHost = host === "1"
  const { isSignedIn, isLoaded } = useUser()
  const router = useRouter()

  // Дамжуулах эрхийг сервер шийднэ: `?host=1` бол зөвхөн ямар загвар
  // хүсэж байгаагийн заавар, эрх олгодоггүй.
  const stream = useLiveKitToken(showId)
  const show = useLiveShowDetail(showId)
  const elapsed = useElapsed(show?.started_at)

  useEffect(() => {
    if (wantsHost && isLoaded && !isSignedIn) router.replace("/sign-in")
  }, [wantsHost, isLoaded, isSignedIn, router])

  if (stream.loading) return <Notice>Холбогдож байна...</Notice>

  if (stream.error || !stream.token || !stream.url) {
    return <Notice>{stream.error ?? "Холбогдож чадсангүй."}</Notice>
  }

  if (wantsHost && !stream.isHost) {
    return <Notice>Энэ шууд дамжуулалтыг явуулах эрх танд алга байна.</Notice>
  }

  if (!stream.isHost) {
    return (
      <LiveViewer
        token={stream.token}
        serverUrl={stream.url}
        show={show}
        showId={showId}
        title={title}
      />
    )
  }

  return (
    // Гарчгийн блок хэдэн ч мөр болсон видео тайз үлдсэн зайг яг дүүргэнэ.
    // 68px нь `components/layout/Topbar.tsx:17`-ийн `h-[68px]` — Topbar нь
    // sticky тул урсгал дотор байрээ эзэлдэг.
    <main className="mx-auto flex min-h-[calc(100svh-68px)] max-w-[1440px] flex-col px-4 py-4 lg:h-[calc(100svh-68px)]">
      <BroadcastHeader
        title={show?.title ?? title ?? "Шууд дамжуулалт"}
        category={show?.category}
        elapsed={elapsed}
        viewers={show?.viewer_count}
      />

      <div className="min-h-0 flex-1">
        <VideoStage
          token={stream.token}
          serverUrl={stream.url}
          isHost
          showId={showId}
          showType={show?.type}
        />
      </div>
    </main>
  )
}
