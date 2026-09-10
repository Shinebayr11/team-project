"use client"

import React from "react"
import { useRouter } from "next/navigation"
import { useNavigate } from "@/lib/router"
import { CheckCircle2 } from "lucide-react"
import { useActiveStream } from "@/hooks/useActiveStream"
import { useSellerOverview } from "@/features/seller-hub/hooks/useSellerOverview"
import { PageHeader } from "@/features/seller-hub/components/PageHeader"
import { KpiCard } from "@/features/seller-hub/components/KpiCard"
import { LiveShowBanner } from "@/features/seller-hub/components/overview/LiveShowBanner"
import { QuickActions } from "@/features/seller-hub/components/overview/QuickActions"
import { ActionRequired } from "@/features/seller-hub/components/overview/ActionRequired"
import { ShowListSection } from "@/features/seller-hub/components/overview/ShowListSection"
import { LastShowPerformance } from "@/features/seller-hub/components/overview/LastShowPerformance"

export const SellerOverview: React.FC = () => {
  const navigate = useNavigate()
  const router = useRouter()
  const active = useActiveStream()
  const overview = useSellerOverview()

  const goToShows = () => navigate("/seller/shows")

  const resumeLive = () => {
    if (!active) return
    router.push(
      `/live/${active.roomName}?host=1&title=${encodeURIComponent(active.title)}&showId=${active.showId}`
    )
  }

  return (
    <>
      <PageHeader
        title="Ерөнхий тойм"
        description="Өнөөдөр таны дэлгүүрт болж буй зүйлс."
      />

      {/* Шууд эфир нь жинхэнэ шууд дамжуулалтаас тодорхойлогдоно. Дүн нь дуудлага
          худалдааны бодит үр дүн ирэх хүртэл 0 байхыг зөвшөөрнө. */}
      {active && (
        <LiveShowBanner
          title={active.title}
          stats={{ viewers: 0, sales: 0, revenue: 0 }}
          onOpen={resumeLive}
        />
      )}

      <QuickActions />

      <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
        <KpiCard
          title="Нийт орлого"
          value={`₮${overview.totalRevenue.toLocaleString()}`}
          tone="amber"
        />
        <KpiCard
          title="Хүргэж өгөх бараа"
          value={overview.pendingHandover.length}
          caption="ялагчтайгаа холбогдоно уу"
          tone="coral"
        />
        <KpiCard
          title="Нөөц багассан бараа"
          value={overview.lowStockItems.length}
          caption={`${overview.outOfStockItems.length} дууссан`}
          tone="blue"
        />
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="flex flex-col gap-8">
          <ActionRequired
            pendingHandover={overview.pendingHandover.length}
            lowStockCount={overview.lowStockItems.length}
          />
        </div>

        <div className="flex flex-col gap-8">
          {overview.lastShow && (
            <LastShowPerformance
              show={overview.lastShow}
              onViewAnalytics={() => navigate("/seller/analytics")}
            />
          )}

          <ShowListSection
            title="Сүүлийн шууд дамжуулалт"
            shows={overview.recentShows.slice(0, 3)}
            icon={CheckCircle2}
            actionLabel="Харах"
            onAction={goToShows}
            subtitle={(show) =>
              `₮${show.revenue.toLocaleString()} • ${show.soldCount} бараа зарагдсан`
            }
            loading={overview.loading}
            emptyMessage="Дууссан шууд дамжуулалт алга байна."
          />
        </div>
      </div>
    </>
  )
}
