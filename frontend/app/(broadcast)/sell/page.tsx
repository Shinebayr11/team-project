"use client"

import { useEffect, useState, useSyncExternalStore } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { Video, Clock, Radio } from "lucide-react"
import { useApiClient } from "@/hooks/useApiClient"

type ActiveStream = { roomName: string; title: string; showId: string }

const STORAGE_KEY = "activeStream"
// "storage" only fires in *other* tabs, so writes from this one announce
// themselves.
const CHANGE_EVENT = "activestream:change"

// getSnapshot runs on every render and React bails out on Object.is only, so a
// fresh JSON.parse each time would re-render forever. Re-parse only when the
// stored string actually changes.
let cachedRaw: string | null = null
let cachedValue: ActiveStream | null = null

function getSnapshot(): ActiveStream | null {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (raw !== cachedRaw) {
    cachedRaw = raw
    cachedValue = raw ? (JSON.parse(raw) as ActiveStream) : null
  }
  return cachedValue
}

// Nothing is live on the server or during hydration; React re-reads the real
// value once mounted.
function getServerSnapshot(): ActiveStream | null {
  return null
}

function subscribe(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange)
  window.addEventListener(CHANGE_EVENT, onStoreChange)
  return () => {
    window.removeEventListener("storage", onStoreChange)
    window.removeEventListener(CHANGE_EVENT, onStoreChange)
  }
}

function writeActiveStream(next: ActiveStream | null) {
  if (next) localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  else localStorage.removeItem(STORAGE_KEY)
  window.dispatchEvent(new Event(CHANGE_EVENT))
}

export default function SellPage() {
  const { user, isLoaded } = useUser()
  const router = useRouter()
  const { callApi } = useApiClient()
  const [title, setTitle] = useState("")
  const [starting, setStarting] = useState(false)
  // localStorage is an external store: reading it through useSyncExternalStore
  // keeps SSR and hydration in step without a setState round trip in an effect.
  const active = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

  useEffect(() => {
    if (isLoaded && !user) router.replace("/sign-in")
  }, [isLoaded, user, router])

  if (!isLoaded || !user) return null

  const status = user.publicMetadata?.sellerStatus as
    "approved" | "pending" | undefined

  if (status === "pending") {
    return (
      <div className="mx-auto max-w-md py-24 text-center">
        <Clock className="mx-auto size-10 text-muted-foreground" />
        <h1 className="mt-4 text-2xl font-bold">Хүсэлт хянагдаж байна</h1>
        <p className="mt-2 text-muted-foreground">
          Худалдагчийн хүсэлтийг баталгаажуулсны дараа мэдэгдэл очно.
        </p>
      </div>
    )
  }

  if (status !== "approved") {
    return (
      <div className="mx-auto max-w-md py-24 text-center">
        <h1 className="text-2xl font-bold">Худалдагч болох</h1>
        <p className="mt-2 text-muted-foreground">
          Шоу хийж бараагаа зарахын тулд эхлээд бүртгүүлнэ үү.
        </p>
        <Button
          className="mt-6"
          onClick={() => router.push("/sell/onboarding")}
        >
          Эхлэх
        </Button>
      </div>
    )
  }

  const startLive = async () => {
    setStarting(true)
    try {
      const roomName = `stream-${Math.random().toString(36).slice(2, 8)}`
      const streamTitle = title || "Шууд шоу"

      const { data: me } = await callApi<{ data: { _id: string } }>(
        "/api/users/me"
      )
      const { data: show } = await callApi<{ data: { _id: string } }>(
        "/api/liveshow",
        {
          method: "POST",
          body: JSON.stringify({
            title: streamTitle,
            livekit_room_name: roomName,
            status: "live",
          }),
        }
      )

      writeActiveStream({ roomName, title: streamTitle, showId: show._id })
      router.push(
        `/live/${roomName}?host=1&title=${encodeURIComponent(streamTitle)}&showId=${show._id}`
      )
    } finally {
      setStarting(false)
    }
  }

  const resume = () => {
    if (!active) return
    router.push(
      `/live/${active.roomName}?host=1&title=${encodeURIComponent(active.title)}&showId=${active.showId}`
    )
  }

  const endStream = () => {
    if (active) {
      callApi(`/api/liveshow/${active.showId}`, {
        method: "PATCH",
        body: JSON.stringify({ status: "ended", ended_at: new Date().toISOString() }),
      }).catch((error) => console.error("Failed to end live show:", error))
    }
    writeActiveStream(null)
  }

  return (
    <div className="mx-auto max-w-md py-16">
      {active ? (
        <div className="rounded-xl border bg-card p-6">
          <div className="flex items-center gap-2 text-sm font-medium text-red-500">
            <Radio className="size-4" />
            Шууд дамжуулж байна
          </div>

          <h1 className="mt-3 text-2xl font-bold tracking-tight">
            {active.title}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Шоу үргэлжилж байна. Дуусгасны дараа шинэ шоу эхлүүлэх боломжтой.
          </p>

          <div className="mt-6 flex gap-2">
            <Button onClick={resume}>Үргэлжлүүлэх</Button>
            <Button variant="outline" onClick={endStream}>
              Дуусгах
            </Button>
          </div>
        </div>
      ) : (
        <>
          <h1 className="text-2xl font-bold tracking-tight">Шоу эхлүүлэх</h1>
          <p className="mt-2 text-muted-foreground">
            Гарчгаа бичээд шууд дамжуулалт эхлүүлээрэй.
          </p>

          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Шоуны гарчиг"
            className="mt-6 h-10 w-full rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
          />

          <Button
            className="mt-4 w-full"
            onClick={startLive}
            disabled={!title.trim() || starting}
          >
            <Video className="mr-2 size-4" />
            {starting ? "Эхэлж байна..." : "Шууд эхлүүлэх"}
          </Button>
        </>
      )}
    </div>
  )
}
