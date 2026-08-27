"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Radio } from "lucide-react"

import { useSearchParams } from "@/lib/router"
import { useApiClient } from "@/hooks/useApiClient"
import { useActiveStream, writeActiveStream } from "@/hooks/useActiveStream"
import { useCategories } from "@/hooks/useCategories"
import { EXPLORE_CATEGORIES } from "@/data/exploreCategories"
import { PageHeader } from "@/features/seller-hub/components/PageHeader"
import { Panel } from "@/features/seller-hub/components/DataCard"
import { Field } from "@/features/seller-hub/components/FormField"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { LiveDot } from "@/components/ui/LiveDot"
import { ProductCatalog } from "@/components/sell/product-catalog"
import { ShowLineup } from "@/components/sell/show-lineup"
import { PastShows } from "@/components/sell/past-shows"

/** Самбарын үндсэн товч — NextShowBanner / SellerShows-тэй ижил хэмжээ. */
const primaryBtn =
  "flex items-center justify-center gap-2 rounded-full bg-[var(--wn-live-deep)] px-5 py-2.5 text-[14px] font-[700] text-white transition-colors hover:bg-[var(--wn-live)] disabled:cursor-not-allowed disabled:opacity-50"

/**
 * Шоу эхлэх дэлгэц. `/seller/shows/start` дор mount хийгддэг тул Seller
 * Hub-ын sidebar, SellerTopbar хэвээр үлдэнэ — нэвтрэлтийг `proxy.ts`,
 * худалдагч идэвхтэй эсэхийг `SellerHubLayout` аль хэдийн шалгасан байдаг тул
 * энд давхар guard хэрэггүй.
 *
 * LiveKit-ийн дамжуулалтын логик (`startLive`, `writeActiveStream`) нь
 * `/sell` дээр байсан хэвээрээ — зөвхөн бүрхүүл нь самбарын хэлэнд орсон.
 */
export function StartShowScreen() {
  const router = useRouter()
  const { callApi } = useApiClient()
  const [params] = useSearchParams()
  const active = useActiveStream()
  const { categories, addCategory } = useCategories()

  // Шоуны дэлгэрэнгүйгээс ирсэн бол гарчиг, ангилал нь бэлдсэн байна.
  const [title, setTitle] = useState(params.get("title") ?? "")
  const [category, setCategory] = useState(
    params.get("category") || EXPLORE_CATEGORIES[0].name
  )
  const [starting, setStarting] = useState(false)

  // Самбарын шоунаас ирсэн бол дамжуулалтыг тэр шоутай холбоно.
  const sellerShowId = params.get("showId") ?? undefined

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

  const selectItems = categoryOptions.map((option) => ({
    value: option.name,
    label: `${option.icon} ${option.name}`,
  }))

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

  const startLive = async () => {
    setStarting(true)
    try {
      const roomName = `stream-${Math.random().toString(36).slice(2, 8)}`
      const streamTitle = title || "Лайв"

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

      writeActiveStream({
        roomName,
        title: streamTitle,
        showId: show._id,
        sellerShowId,
      })
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
    <>
      <PageHeader
        title="Лайв эхлэх"
        description="Гарчиг, ангиллаа сонгоод лайв эхлээрэй."
        onBack={() => router.push("/seller/shows")}
      />

      {/* Тэнцүү өргөнтэй 2 багана: зүүн талд эхлүүлэх/удирдах хэсэг, баруун
          талд бараа болон өмнөх лайвууд. */}
      <div className="grid max-w-[1100px] grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="flex flex-col gap-8">
          {active ? (
            // Идэвхтэй дамжуулалт — LiveShowBanner-ийн хар самбартай ижил хэл.
            <div className="rounded-2xl bg-[#1A1A1A] p-6 text-white shadow-sm">
              <div className="flex items-center gap-2">
                <LiveDot className="h-2.5 w-2.5" />
                <span className="text-[13px] font-[800] tracking-wider text-[var(--wn-live)] uppercase">
                  Лайв явж байна
                </span>
              </div>

              <h2 className="mt-2 text-[22px] font-[800]">{active.title}</h2>
              <p className="mt-2 text-[14px] font-[500] text-gray-300">
                Лайв үргэлжилж байна. Дуусгасны дараа шинэ лайв эхлэх боломжтой.
              </p>

              <div className="mt-6 flex gap-3">
                <button
                  type="button"
                  onClick={resume}
                  className="flex-1 rounded-full bg-white px-5 py-2.5 text-[14px] font-[800] text-black transition-colors hover:bg-gray-200"
                >
                  Үргэлжлүүлэх
                </button>
                <button
                  type="button"
                  onClick={endStream}
                  className="flex-1 rounded-full border border-white/30 px-5 py-2.5 text-[14px] font-[700] text-white transition-colors hover:bg-white/10"
                >
                  Лайв дуусгах
                </button>
              </div>
            </div>
          ) : (
            <Panel title="Лайвын мэдээлэл">
              <div className="flex flex-col gap-4">
                <Field label="Лайвын гарчиг">
                  <Input
                    id="show-title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Жишээ: Өвлийн шинэ цуглуулга"
                    autoComplete="off"
                  />
                </Field>

                <div>
                  <Field label="Ангилал">
                    <Select
                      id="show-category"
                      value={category}
                      onValueChange={setCategory}
                      items={selectItems}
                    />
                  </Field>

                  {addingCategory ? (
                    <div className="mt-2 flex gap-2">
                      <Input
                        autoFocus
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        placeholder="Шинэ ангиллын нэр"
                        autoComplete="off"
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
                        className="shrink-0 rounded-full bg-[#1A1A1A] px-4 text-[13px] font-[700] text-white transition-colors hover:bg-black disabled:opacity-50"
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
                        className="shrink-0 rounded-full border border-gray-300 px-4 text-[13px] font-[700] text-black transition-colors hover:bg-gray-50"
                      >
                        Болих
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setAddingCategory(true)}
                      className="mt-2 text-[13px] font-[700] text-black underline decoration-gray-400 underline-offset-2 hover:decoration-black"
                    >
                      + Шинэ ангилал нэмэх
                    </button>
                  )}

                  {categoryError && (
                    <p className="mt-2 text-[13px] font-[600] text-[var(--wn-live-deep)]">
                      {categoryError}
                    </p>
                  )}
                </div>

                <button
                  type="button"
                  onClick={startLive}
                  disabled={!title.trim() || starting}
                  className={`${primaryBtn} mt-2 w-full`}
                >
                  <Radio className="h-4 w-4" />
                  {starting ? "Эхэлж байна..." : "Эхлэх"}
                </button>
              </div>
            </Panel>
          )}

          {/* Лайвын жагсаалт зөвхөн лайв байгаа үед утгатай — эхлүүлээгүй бол
              холбогдох showId байхгүй. */}
          {active && <ShowLineup showId={active.showId} />}
        </div>

        <div className="flex flex-col gap-8">
          <ProductCatalog />
          <PastShows />
        </div>
      </div>
    </>
  )
}
