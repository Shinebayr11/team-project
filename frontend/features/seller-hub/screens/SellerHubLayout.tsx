"use client"

import React from "react"
import { useLocation, useNavigate } from "@/lib/router"
import { useSellerProfile } from "@/hooks/useSellerProfile"
import { useMySellerOrders } from "@/hooks/useMySellerOrders"
import { SELLER_GATE_PARAM, SELLER_GATE_RETURN } from "@/hooks/useSellerGate"
import { Sheet, SheetBody, SheetHeader } from "@/components/ui/sheet"
import {
  SellerNav,
  SellerSidebar,
} from "@/features/seller-hub/components/SellerSidebar"
import { SellerTopbar } from "@/features/seller-hub/components/SellerTopbar"
import { useInventoryHydration } from "@/features/seller-hub/hooks/useSellerInventory"
import { OPEN_FULFILLMENT } from "@/features/seller-hub/hooks/useSellerOverview"
import { Skeleton, SkeletonScreen } from "@/components/ui/Skeleton"


// The App Router nests routes through `children` where react-router used <Outlet />.
export const SellerHubLayout: React.FC<{ children?: React.ReactNode }> = ({
  children,
}) => {
  const { pathname } = useLocation()
  const { isActive, isLoading } = useSellerProfile()
  const { orders: realOrders } = useMySellerOrders()
  const navigate = useNavigate()
  const [navOpen, setNavOpen] = React.useState(false)

  // Барааг бүрхүүл дээр нэг л удаа уншина — бараа, шууд дамжуулалт, тойм, аналитик бүгд
  // store доторх нэг кэшийг хардаг.
  const inventory = useInventoryHydration()

  // Идэвхгүй худалдагчийг нүүр рүү буцааж, идэвхжүүлэх хуудсыг нээнэ.
  // Нэвтрээгүй тохиолдлыг proxy.ts аль хэдийн барьсан байна.
  React.useEffect(() => {
    if (isLoading || isActive) return
    navigate(`${SELLER_GATE_RETURN}?${SELLER_GATE_PARAM}=1`, { replace: true })
  }, [isLoading, isActive, navigate])

  const pendingOrders = realOrders.filter((o) =>
    OPEN_FULFILLMENT.includes(o.fulfillment_status ?? "PENDING")
  ).length

  // Идэвхгүй хэрэглэгч рүү самбарыг ҮЗҮҮЛЭХГҮЙ — дээрх effect нүүр рүү
  // буцааж байгаа тул энэ хормыг хоосон өнгөрөөнө.
  if (!isActive && !isLoading) return null

  // Худалдагч мөн эсэхийг шалгах хооронд бүтэн ЦАГААН дэлгэц гарч байв.
  // Skeleton нь самбарын БАЙРЛАЛЫГ л эзэлнэ — цэсний нэр, тоо, худалдагчийн
  // ямар ч мэдээлэл агуулаагүй тул шалгалт бүтэлгүйтвэл ч юу ч задруулахгүй.
  if (isLoading) {
    return (
      <SkeletonScreen
        className="flex min-h-svh bg-[var(--wn-page)]"
        label="Худалдагчийн самбарыг уншиж байна"
      >
        <div className="hidden w-[240px] shrink-0 flex-col gap-2 border-r border-[var(--wn-admin-card-border)] bg-white p-3 lg:flex">
          <Skeleton className="mb-4 ml-3 mt-4 h-6 w-32" />
          {[0, 1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-9 w-full rounded-lg" />
          ))}
        </div>
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex h-16 shrink-0 items-center justify-end gap-4 border-b border-[var(--wn-admin-card-border)] bg-white px-4 lg:px-8">
            <Skeleton className="size-5 rounded-md" />
            <Skeleton className="size-8 rounded-full" />
          </div>
          <div className="flex flex-col gap-8 p-4 lg:p-8">
            <div className="flex flex-col gap-2">
              <Skeleton className="h-7 w-56" />
              <Skeleton className="h-4 w-72" />
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              {[0, 1, 2].map((i) => (
                <Skeleton key={i} className="h-[132px] rounded-2xl" />
              ))}
            </div>
          </div>
        </div>
      </SkeletonScreen>
    )
  }

  // Бараа уншиж дуустал дэлгэцүүд хоосон тоо (0 бараа, 0 нөөц) харуулах тул
  // хүлээнэ — эс тэгвээс тойм, аналитик хоромхон зуур худал үзүүлэлт үзүүлнэ.
  // Хажуугийн самбар, толгой нь бараанаас хамаардаггүй тул шууд зурагдана —
  // зөвхөн дэлгэцийн бие нь орлуулагдана. Ингэснээр уншиж дуусахад самбар
  // байрандаа үлдэж, зөвхөн агуулга солигдоно.
  const body = inventory.loading ? (
    <SkeletonScreen className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <Skeleton className="h-7 w-56" />
        <Skeleton className="h-4 w-72" />
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <Skeleton key={i} className="h-[132px] rounded-2xl" />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {[0, 1].map((i) => (
          <div key={i} className="flex flex-col gap-4">
            <Skeleton className="h-5 w-44" />
            <Skeleton className="h-[104px] rounded-2xl" />
          </div>
        ))}
      </div>
    </SkeletonScreen>
  ) : (
    children
  )

  return (
    <div className="flex min-h-svh bg-[var(--wn-page)] font-[var(--wn-font)] text-[var(--wn-admin-ink)]">
      <SellerSidebar path={pathname} pendingOrders={pendingOrders} />

      <div className="flex min-w-0 flex-1 flex-col">
        <SellerTopbar onOpenNav={() => setNavOpen(true)} />
        {/* `overflow-y-auto` байсан нь ХОЁР талаараа буруу: эцэг нь `min-h-svh`
            (`h-svh` биш) тул main өөрөө хэзээ ч гүйдэггүй — гүйлт баримт дээр
            явдаг; гэтэл position:sticky нь хамгийн ойрын гүйлтийн хүрээ рүү
            уягддаг тул дотор нь байгаа юу ч наалддаггүй байв. */}
        <main className="flex-1 p-4 lg:p-8">{body}</main>
      </div>

      {/* 1024px-ээс доош хажуугийн самбар нуугддаг тул цэс нь эндээс гарна.
          `components/ui/sheet.tsx`-ийг дахин ашиглав — фокус баригдана, ESC
          ажиллана, фокус буцаж очно. */}
      <Sheet open={navOpen} onOpenChange={setNavOpen}>
        <SheetHeader title="Sellerhub" />
        <SheetBody className="flex flex-col px-0 py-0">
          <SellerNav
            path={pathname}
            pendingOrders={pendingOrders}
            onNavigate={() => setNavOpen(false)}
          />
        </SheetBody>
      </Sheet>
    </div>
  )
}
