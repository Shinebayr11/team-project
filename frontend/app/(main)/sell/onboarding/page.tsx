"use client"

import { useState } from "react"
import { useAuth, useUser } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"

export default function SellerOnboardingPage() {
  const { getToken } = useAuth()
  const { user } = useUser()
  const [shopName, setShopName] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)

  const submit = async () => {
    if (!shopName.trim()) return
    setSubmitting(true)
    const submit = async () => {
      if (!shopName.trim()) return
      setSubmitting(true)

      try {
        const token = await getToken() // Clerk JWT token авна

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/sellers/apply`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            shop_name: shopName, // Баазын талбарын нэртэй тааруулж илгээнэ
          }),
        })

        if (res.ok) {
          setDone(true)
        } else {
          console.error("Хүсэлт илгээхэд алдаа гарлаа")
        }
      } catch (error) {
        console.error(error)
      } finally {
        setSubmitting(false)
      }
    }
    // TODO: server дээр /sellers/apply endpoint холбох
    // const token = await getToken()
    // await fetch(`${process.env.NEXT_PUBLIC_API_URL}/sellers/apply`, {...})

    setDone(true)
    setSubmitting(false)
  }

  if (done) {
    return (
      <div className="mx-auto max-w-md py-24 text-center">
        <h1 className="text-2xl font-bold">Хүсэлт илгээгдлээ</h1>
        <p className="mt-2 text-muted-foreground">
          Таны худалдагчийн хүсэлтийг хянаж байна. Баталгаажсаны дараа мэдэгдэл
          очно.
        </p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-md py-16">
      <h1 className="text-2xl font-bold tracking-tight">Худалдагч болох</h1>
      <p className="mt-2 text-muted-foreground">
        {user?.firstName ?? "Танд"} тавтай морилно уу. Дэлгүүрийнхээ нэрийг
        оруулаад эхэлье.
      </p>

      <div className="mt-6 space-y-2">
        <label className="text-sm font-medium">Дэлгүүрийн нэр</label>
        <input
          value={shopName}
          onChange={(e) => setShopName(e.target.value)}
          placeholder="Жишээ: Vintage Finds MN"
          className="h-10 w-full rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      <Button className="mt-6 w-full" onClick={submit} disabled={submitting}>
        {submitting ? "Илгээж байна..." : "Хүсэлт илгээх"}
      </Button>
    </div>
  )
}
