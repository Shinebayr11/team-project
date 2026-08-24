"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@clerk/nextjs"
import { Video, Clock } from "lucide-react"
import { LiveDot } from "@/components/ui/LiveDot"
import { useApiClient } from "@/hooks/useApiClient"
import { useActiveStream, writeActiveStream } from "@/hooks/useActiveStream"
import { useCategories } from "@/hooks/useCategories"
import { EXPLORE_CATEGORIES } from "@/data/exploreCategories"
import { ProductCatalog } from "@/components/sell/product-catalog"
import { ShowLineup } from "@/components/sell/show-lineup"
import { PastShows } from "@/components/sell/past-shows"

const fieldClass =
  "mt-2 h-[44px] w-full rounded-xl border border-white/25 bg-white/10 px-4 text-[15px] text-white placeholder:text-white/50 outline-none backdrop-blur-sm focus:border-white/60 transition-colors"
const labelClass = "block text-[13px] font-[700] text-white/80"

/** Aura-style ambient blobs used behind the bold gradient hero cards. */
function GradientOrbs() {
  return (
    <>
      <div className="pointer-events-none absolute -top-16 -right-10 size-52 rounded-full bg-white/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-16 size-64 rounded-full bg-black/20 blur-3xl" />
    </>
  )
}

export default function SellPage() {
  const { user, isLoaded } = useUser()
  const router = useRouter()
  const { callApi } = useApiClient()
  const [title, setTitle] = useState("")
  const [category, setCategory] = useState(EXPLORE_CATEGORIES[0].name)
  const [starting, setStarting] = useState(false)
  const active = useActiveStream()
  const { categories, addCategory } = useCategories()

  const [addingCategory, setAddingCategory] = useState(false)
  const [newCategory, setNewCategory] = useState("")
  const [categoryBusy, setCategoryBusy] = useState(false)
  const [categoryError, setCategoryError] = useState<string | null>(null)

  const categoryOptions = [
    ...EXPLORE_CATEGORIES,
    ...categories
      .filter(
        (c) =>
          !EXPLORE_CATEGORIES.some(
            (e) => e.name.toLowerCase() === c.name.toLowerCase()
          )
      )
      .map((c) => ({ id: c._id, name: c.name, icon: "🏷️" })),
  ]

  const createCategory = async () => {
    setCategoryBusy(true)
    setCategoryError(null)
    const result = await addCategory(newCategory)
    if (result.ok && result.category) {
      setCategory(result.category.name)
      setNewCategory("")
      setAddingCategory(false)
    } else {
      setCategoryError(result.message ?? "Нэмж чадсангүй")
    }
    setCategoryBusy(false)
  }

  useEffect(() => {
    if (isLoaded && !user) router.replace("/sign-in")
  }, [isLoaded, user, router])

  if (!isLoaded || !user) return null

  const status = user.publicMetadata?.sellerStatus as
    "approved" | "pending" | undefined

  if (status === "pending") {
    return (
      <div className="mx-auto max-w-md px-6 py-24">
        <div className="rounded-[28px] border border-[var(--wn-line)] bg-[linear-gradient(160deg,#ffffff_0%,#f5f0ff_55%,#fdf2f8_100%)] p-10 text-center shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
          <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-[radial-gradient(circle_at_30%_30%,#c4b5fd,#5b3fe0)] shadow-[0_8px_24px_rgba(91,63,224,0.35)]">
            <Clock className="size-7 text-white" />
          </div>
          <h1 className="font-display mt-5 text-[24px] font-[800] tracking-tight text-[var(--wn-ink)]">
            Хүсэлт хянагдаж байна
          </h1>
          <p className="mt-2 text-[15px] text-[var(--wn-ink-3)]">
            Худалдагчийн хүсэлтийг баталгаажуулсны дараа мэдэгдэл очно.
          </p>
        </div>
      </div>
    )
  }

  if (status !== "approved") {
    return (
      <div className="mx-auto max-w-md px-6 py-24">
        <div className="relative overflow-hidden rounded-[28px] bg-[radial-gradient(140%_140%_at_50%_0%,#7c3aed_0%,#5b3fe0_35%,#d946ef_70%,#fb923c_100%)] p-10 text-center shadow-[0_20px_50px_rgba(91,63,224,0.35)]">
          <GradientOrbs />
          <div className="relative">
            <h1 className="font-display text-[24px] font-[800] tracking-tight text-white">
              Худалдагч болох
            </h1>
            <p className="mt-2 text-[15px] text-white/85">
              Шоу хийж бараагаа зарахын тулд эхлээд бүртгүүлнэ үү.
            </p>
            <button
              type="button"
              onClick={() => router.push("/sell/onboarding")}
              className="mt-6 h-[48px] rounded-full bg-white px-8 text-[15px] font-[700] text-[var(--wn-accent)] transition-colors hover:bg-white/90"
            >
              Эхлэх
            </button>
          </div>
        </div>
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
    <div className="mx-auto max-w-[1100px] px-6 py-12">
      {/* Тэнцүү өргөнтэй 2 багана: grid-cols-2 нь minmax(0,1fr) тул хоёулаа
          яг ижил өргөнтэй үлдэнэ. Мөрийн өндрийг зүүн талын live карт
          тодорхойлж, баруун талын хоёр карт түүнийг тэн хуваана. */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Зүүн багана — зөвхөн live эхлүүлэх/удирдах хэсэг. Өндөр нь энэ
            мөрийг тодорхойлдог тул баруун талын хоёр карт үүнийг тэн хуваана. */}
        <div className="flex flex-col gap-8 lg:min-h-[620px]">
          {active ? (
            <div className="relative overflow-hidden rounded-[24px] bg-[radial-gradient(140%_140%_at_100%_0%,#fb7185_0%,#e5484d_28%,#7c3aed_68%,#4338ca_100%)] p-8 shadow-[0_20px_50px_rgba(229,72,77,0.3)] lg:flex-1">
              <GradientOrbs />
              <div className="relative">
                <div className="inline-flex items-center gap-2 rounded-full bg-black/25 px-3 py-1.5 text-[13px] font-[700] text-white backdrop-blur-md">
                  <LiveDot />
                  Шууд дамжуулж байна
                </div>

                <h1 className="font-display mt-4 text-[26px] font-[800] tracking-tight text-white">
                  {active.title}
                </h1>
                <p className="mt-2 text-[14px] text-white/80">
                  Шоу үргэлжилж байна. Дуусгасны дараа шинэ шоу эхлүүлэх боломжтой.
                </p>

                <div className="mt-6 flex gap-3">
                  <button
                    type="button"
                    onClick={resume}
                    className="h-[44px] flex-1 rounded-full bg-white text-[14px] font-[700] text-[var(--wn-live)] transition-colors hover:bg-white/90"
                  >
                    Үргэлжлүүлэх
                  </button>
                  <button
                    type="button"
                    onClick={endStream}
                    className="h-[44px] flex-1 rounded-full border border-white/30 text-[14px] font-[700] text-white transition-colors hover:bg-white/10"
                  >
                    Дуусгах
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="relative overflow-hidden rounded-[24px] bg-[radial-gradient(140%_140%_at_0%_0%,#7c3aed_0%,#5b3fe0_32%,#d946ef_68%,#fb923c_100%)] p-8 shadow-[0_20px_50px_rgba(91,63,224,0.3)] lg:flex-1">
              <GradientOrbs />
              <div className="relative">
                <h1 className="font-display text-[28px] font-[800] tracking-tight text-white">
                  Шоу эхлүүлэх
                </h1>
                <p className="mt-2 text-[15px] text-white/80">
                  Гарчиг, ангиллаа сонгоод шууд дамжуулалт эхлүүлээрэй.
                </p>

                <div className="mt-6">
                  <label className={labelClass} htmlFor="show-title">
                    Шоуны гарчиг
                  </label>
                  <input
                    id="show-title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Шоуны гарчиг"
                    className={fieldClass}
                    autoComplete="off"
                  />
                </div>

                <div className="mt-4">
                  <label className={labelClass} htmlFor="show-category">
                    Ангилал
                  </label>
                  <select
                    id="show-category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className={`${fieldClass} text-[var(--wn-ink)]`}
                  >
                    {categoryOptions.map((option) => (
                      <option key={option.id} value={option.name}>
                        {option.icon} {option.name}
                      </option>
                    ))}
                  </select>

                  {addingCategory ? (
                    <div className="mt-2 flex gap-2">
                      <input
                        autoFocus
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        placeholder="Шинэ ангиллын нэр"
                        autoComplete="off"
                        className={`${fieldClass} mt-0 h-10`}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault()
                            createCategory()
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={createCategory}
                        disabled={!newCategory.trim() || categoryBusy}
                        className="h-10 shrink-0 rounded-full bg-white px-4 text-[13px] font-[700] text-[var(--wn-accent)] transition-colors hover:bg-white/90 disabled:opacity-50"
                      >
                        {categoryBusy ? "..." : "Нэмэх"}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setAddingCategory(false)
                          setNewCategory("")
                          setCategoryError(null)
                        }}
                        className="h-10 shrink-0 rounded-full border border-white/30 px-4 text-[13px] font-[700] text-white transition-colors hover:bg-white/10"
                      >
                        Болих
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setAddingCategory(true)}
                      className="mt-2 text-[13px] font-[700] text-white underline decoration-white/40 underline-offset-2 hover:decoration-white"
                    >
                      + Шинэ ангилал нэмэх
                    </button>
                  )}

                  {categoryError && (
                    <p className="mt-2 text-[13px] font-[600] text-[#ffd8a8]">
                      {categoryError}
                    </p>
                  )}
                </div>

                <button
                  type="button"
                  onClick={startLive}
                  disabled={!title.trim() || starting}
                  className="mt-6 flex h-[52px] w-full items-center justify-center gap-2 rounded-full bg-white text-[16px] font-[800] text-[var(--wn-accent)] shadow-[0_6px_18px_rgba(0,0,0,0.15)] transition-colors hover:bg-white/90 disabled:opacity-50"
                >
                  <Video className="size-4" />
                  {starting ? "Эхэлж байна..." : "Шууд эхлүүлэх"}
                </button>
              </div>
            </div>
          )}

          {/* Шоуны жагсаалт зөвхөн шоу байгаа үед утгатай — эхлүүлээгүй бол
              холбогдох showId байхгүй. */}
          {active && <ShowLineup showId={active.showId} />}
        </div>

        {/* Баруун багана — хоёр карт зүүн талын өндрийг тэн хуваана.
            lg-ээс доош нэг багана болох тул хуваалт хамаарахгүй: тэнд
            `flex-1`/`min-h-0` хэрэглэвэл өндөр нь 0 болж хумигдана. */}
        <div className="flex flex-col gap-8">
          <ProductCatalog className="lg:min-h-0 lg:flex-1" />
          <PastShows className="lg:min-h-0 lg:flex-1" />
        </div>
      </div>
    </div>
  )
}
