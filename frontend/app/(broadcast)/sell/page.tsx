"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { Video, Clock, Radio } from "lucide-react"
import { useApiClient } from "@/hooks/useApiClient"
import { useActiveStream, writeActiveStream } from "@/hooks/useActiveStream"
import { EXPLORE_CATEGORIES } from "@/data/exploreCategories"

export default function SellPage() {
  const { user, isLoaded } = useUser()
  const router = useRouter()
  const { callApi } = useApiClient()
  const [title, setTitle] = useState("")
  const [category, setCategory] = useState(EXPLORE_CATEGORIES[0].name)
  const [starting, setStarting] = useState(false)
  const active = useActiveStream()

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
            category,
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
            Гарчиг, ангиллаа сонгоод шууд дамжуулалт эхлүүлээрэй.
          </p>

          <label className="mt-6 block text-sm font-medium" htmlFor="show-title">
            Шоуны гарчиг
          </label>
          <input
            id="show-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Шоуны гарчиг"
            className="mt-2 h-10 w-full rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
          />

          <label className="mt-4 block text-sm font-medium" htmlFor="show-category">
            Ангилал
          </label>
          <select
            id="show-category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="mt-2 h-10 w-full rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
          >
            {EXPLORE_CATEGORIES.map((option) => (
              <option key={option.id} value={option.name}>
                {option.icon} {option.name}
              </option>
            ))}
          </select>

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
