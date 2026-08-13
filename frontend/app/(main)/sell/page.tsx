"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { Video, Clock } from "lucide-react"

export default function SellPage() {
  const { user, isLoaded } = useUser()
  const router = useRouter()
  const [title, setTitle] = useState("")

  if (!isLoaded) return null
  if (!user) return null

  const status = user.publicMetadata?.sellerStatus as
    | "approved"
    | "pending"
    | undefined

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
        <Button className="mt-6" onClick={() => router.push("/sell/onboarding")}>
          Эхлэх
        </Button>
      </div>
    )
  }

  const startLive = () => {
    const roomName = `stream-${Math.random().toString(36).slice(2, 8)}`
    router.push(
      `/live/${roomName}?host=1&title=${encodeURIComponent(title || "Шууд шоу")}`
    )
  }

  return (
    <div className="mx-auto max-w-md py-16">
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

      <Button className="mt-4 w-full" onClick={startLive} disabled={!title.trim()}>
        <Video className="mr-2 size-4" />
        Шууд эхлүүлэх
      </Button>
    </div>
  )
}
