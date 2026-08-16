"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { Video, Clock, Radio } from "lucide-react"

type ActiveStream = { roomName: string; title: string }

export default function SellPage() {
  const { user, isLoaded } = useUser()
  const router = useRouter()
  const [title, setTitle] = useState("")
  const [active, setActive] = useState<ActiveStream | null>(null)

  useEffect(() => {
    const raw = localStorage.getItem("activeStream")
    if (raw) setActive(JSON.parse(raw))
  }, [])

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

  const startLive = () => {
    const roomName = `stream-${Math.random().toString(36).slice(2, 8)}`
    const streamTitle = title || "Шууд шоу"
    localStorage.setItem(
      "activeStream",
      JSON.stringify({ roomName, title: streamTitle })
    )
    router.push(
      `/live/${roomName}?host=1&title=${encodeURIComponent(streamTitle)}`
    )
  }

  const resume = () => {
    if (!active) return
    router.push(
      `/live/${active.roomName}?host=1&title=${encodeURIComponent(active.title)}`
    )
  }

  const endStream = () => {
    localStorage.removeItem("activeStream")
    setActive(null)
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
            disabled={!title.trim()}
          >
            <Video className="mr-2 size-4" />
            Шууд эхлүүлэх
          </Button>
        </>
      )}
    </div>
  )
}
