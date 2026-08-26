"use client"

import React from "react"
import { useNavigate } from "@/lib/router"
import { Calendar, CheckCircle2 } from "lucide-react"
import { useStore } from "@/store"
import { useSellerOverview, formatCountdown } from "@/features/seller-hub/hooks/useSellerOverview"
import { PageHeader } from "@/features/seller-hub/components/PageHeader"
import { KpiCard } from "@/features/seller-hub/components/KpiCard"
import { LiveShowBanner } from "@/features/seller-hub/components/overview/LiveShowBanner"
import { NextShowBanner } from "@/features/seller-hub/components/overview/NextShowBanner"
import { QuickActions } from "@/features/seller-hub/components/overview/QuickActions"
import { ActionRequired } from "@/features/seller-hub/components/overview/ActionRequired"
import { ShowListSection } from "@/features/seller-hub/components/overview/ShowListSection"
import { LastShowPerformance } from "@/features/seller-hub/components/overview/LastShowPerformance"

export const SellerOverview: React.FC = () => {
  const { state } = useStore()
  const navigate = useNavigate()
  const overview = useSellerOverview(state)

  const goToShows = () => navigate("/seller/shows")

  return (
    <>
      <PageHeader
        title="Overview"
        description="Here's what's happening with your shop today."
      />

      {overview.liveShow ? (
        <LiveShowBanner show={overview.liveShow} onOpen={goToShows} />
      ) : overview.nextShow ? (
        <NextShowBanner
          show={overview.nextShow}
          countdown={formatCountdown(
            overview.nextShow.scheduledAt,
            overview.now
          )}
          ready={overview.nextShowReady}
          onOpen={goToShows}
        />
      ) : null}

      <QuickActions />

      <div className="mb-10 grid grid-cols-3 gap-6">
        <KpiCard
          title="Total Revenue"
          value={`₮${overview.totalRevenue.toLocaleString()}`}
          tone="amber"
        />
        <KpiCard
          title="Orders to Fulfill"
          value={overview.ordersToFulfill.length}
          caption={`₮${overview.pendingValue.toLocaleString()} total`}
          tone="coral"
        />
        <KpiCard
          title="Low Stock Items"
          value={overview.lowStockItems.length}
          caption={`${overview.outOfStockItems.length} out of stock`}
          tone="blue"
        />
      </div>

      <div className="grid grid-cols-2 gap-8">
        <div className="flex flex-col gap-8">
          <ActionRequired
            pendingOrders={overview.ordersToFulfill.length}
            lowStockCount={overview.lowStockItems.length}
            showBlocker={
              overview.nextShow && !overview.nextShowReady
                ? overview.nextShowIssues[0]
                : undefined
            }
          />

          <ShowListSection
            title="Upcoming Shows"
            shows={overview.upcomingShows.slice(1, 4)}
            icon={Calendar}
            actionLabel="Manage"
            onAction={goToShows}
            viewAllTo="/seller/shows"
            subtitle={(show) => new Date(show.scheduledAt).toLocaleString()}
            emptyMessage="No other upcoming shows scheduled."
            emptyAction={{ label: "Schedule a Show", onClick: goToShows }}
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
            title="Recent Shows"
            shows={overview.recentShows.slice(0, 3)}
            icon={CheckCircle2}
            actionLabel="Summary"
            onAction={goToShows}
            subtitle={(show) =>
              `₮${show.stats.revenue.toLocaleString()} • ${show.stats.sales} sold`
            }
            emptyMessage="No recent shows."
          />
        </div>
      </div>
    </>
  )
}
