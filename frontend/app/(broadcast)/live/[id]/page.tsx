"use client"

import { use, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@clerk/nextjs"
import { ChevronLeft, Tag, Clock, Users } from "lucide-react"
import { Link } from "@/lib/router"
import { LiveDot } from "@/components/ui/LiveDot"
import { useLiveShowDetail } from "@/hooks/useLiveShowDetail"
import { VideoStage } from "@/components/live/video-stage"
import { LiveViewer } from "@/components/live/live-viewer"

const CLOCK_MS = 30_000

/** "1ц 24м" — шоу хэдий хугацаанд үргэлжилж байгаа нь. */
function useElapsed(startedAt?: string) {
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), CLOCK_MS)
    return () => clearInterval(timer)
  }, [])

  if (!startedAt) return null
  const diff = now - new Date(startedAt).getTime()
  if (diff < 0) return null

  const mins = Math.floor(diff / 60_000)
  const hours = Math.floor(mins / 60)
  return hours > 0 ? `${hours}ц ${mins % 60}м` : `${mins}м`
}

/** Гарчгийн доорх контекстийн мөр. */
function ShowMeta({ icon: Icon, children }: {
  icon: typeof Tag
  children: React.ReactNode
}) {
  return (
    <span className="flex items-center gap-1.5">
      <Icon className="size-4 text-gray-500" />
      {children}
    </span>
  )
}

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
  const show = useLiveShowDetail(showId)
  const elapsed = useElapsed(show?.started_at)

  useEffect(() => {
    if (isHost && isLoaded && !user) router.replace("/sign-in")
  }, [isHost, isLoaded, user, router])

  if (isHost && (!isLoaded || !user)) return null

  // Viewers get the browse-style stage (seller, products, chat); the host keeps
  // the focused broadcast console with its own controls. Both join the same
  // LiveKit room — the `id` path segment — so the host's camera reaches viewers.
  if (!isHost) {
    return <LiveViewer roomName={id} showId={showId} title={title} />
  }

  const category = show?.category
  const viewers = show?.viewer_count

  return (
    // Гарчгийн блок хэдэн ч мөр болсон видео тайз үлдсэн зайг яг дүүргэнэ.
    // Өмнө нь `h-[calc(100vh-140px)]` гэж хатуу бичсэн тул гарчиг өндөрсөхөд
    // "Шоу дуусгах" товч нугалаас доош унаж, гүйлгэхгүйгээр харагдахаа болив.
    // 68px нь `components/layout/Topbar.tsx:17`-ийн `h-[68px]` — Topbar нь
    // sticky тул урсгал дотор байрээ эзэлдэг.
    <main className="mx-auto flex min-h-[calc(100svh-68px)] max-w-[1440px] flex-col px-4 py-4 lg:h-[calc(100svh-68px)]">
      {/* Худалдагч самбартаа буцах илэрхий зам — өмнө нь энэ дэлгэцээс
          гарах ямар ч холбоос байгаагүй. */}
      <Link
        to="/seller/shows"
        className="mb-3 inline-flex items-center gap-1.5 text-[13px] font-[700] text-gray-500 transition-colors hover:text-black"
      >
        <ChevronLeft className="size-4" />
        Seller Hub
      </Link>

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-[24px] font-[800] tracking-tight text-black">
            {show?.title ?? title ?? "Шууд дамжуулалт"}
          </h1>

          <div className="mt-1 flex flex-wrap items-center gap-4 text-[14px] font-[500] text-gray-500">
            <span className="flex items-center gap-1.5 font-[700] text-[var(--wn-live-deep)]">
              <LiveDot />
              Шууд
            </span>
            {category && <ShowMeta icon={Tag}>{category}</ShowMeta>}
            {elapsed && <ShowMeta icon={Clock}>{elapsed}</ShowMeta>}
            {viewers != null && (
              <ShowMeta icon={Users}>{viewers} үзэгч</ShowMeta>
            )}
          </div>
        </div>
      </div>

      <div className="min-h-0 flex-1">
        <VideoStage roomName={id} isHost={isHost} showId={showId} />
      </div>
    </main>
  )
}
