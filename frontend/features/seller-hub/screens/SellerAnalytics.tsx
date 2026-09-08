"use client"

import React, { useState } from "react"
import { useNavigate } from "@/lib/router"
import { Download, Users, Package, Tag } from "lucide-react"
import { useStore } from "@/store"
import { AUCTION_INSIGHTS } from "@/features/seller-hub/data/sellerStats"
import {
  useSellerAnalytics,
  DateRange,
  ChartMetric,
} from "@/features/seller-hub/hooks/useSellerAnalytics"
import { PageHeader } from "@/features/seller-hub/components/PageHeader"
import { KpiCard } from "@/features/seller-hub/components/KpiCard"
import { SalesChart } from "@/features/seller-hub/components/analytics/SalesChart"
import { TopProductsTable } from "@/features/seller-hub/components/analytics/TopProductsTable"
import { ShowPerformanceTable } from "@/features/seller-hub/components/analytics/ShowPerformanceTable"
import { InsightPanel } from "@/features/seller-hub/components/analytics/InsightPanel"
import { FILTER_CONTROL } from "@/features/seller-hub/components/FormField"
import { btn } from "@/features/seller-hub/components/buttons"

const RANGES: { value: DateRange; label: string }[] = [
  { value: "7d", label: "Сүүлийн 7 хоног" },
  { value: "30d", label: "Сүүлийн 30 хоног" },
  { value: "90d", label: "Сүүлийн 90 хоног" },
]

const RETURNING_BUYER_RATE = 0.4

export const SellerAnalytics: React.FC = () => {
  const { state } = useStore()
  const navigate = useNavigate()

  const [range, setRange] = useState<DateRange>("30d")
  const [metric, setMetric] = useState<ChartMetric>("revenue")
  const stats = useSellerAnalytics(state, range)

  return (
    <>
      <PageHeader
        title="Аналитик"
        description="Дэлгүүрийнхээ гүйцэтгэл, дүн шинжилгээг харна уу."
      >
        <select
          value={range}
          onChange={(e) => setRange(e.target.value as DateRange)}
          aria-label="Хугацааны хүрээ"
          className={FILTER_CONTROL}
        >
          {RANGES.map((r) => (
            <option key={r.value} value={r.value}>
              {r.label}
            </option>
          ))}
        </select>
        <button className={btn("outline", "field")}>
          <Download className="h-4 w-4" /> Татах
        </button>
      </PageHeader>

      {/* 5 багана нь 1024px дээр картад 91px агуулга л үлдээдэг байсан —
          32px дүрс, 13px гарчиг, 28px дүн тэнд багтахгүй байв. lg дээр 3 багана
          (карт ≈224px), 5 багана нь 2xl (1536px)-ээс эхэлнэ — xl дээр ч карт
          170px болж гарчиг гурав тасардаг байсан. */}
      <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5">
        <KpiCard
          title="Нийт борлуулалт"
          value={`₮${stats.grossSales.toLocaleString()}`}
          tone="amber"
        />
        <KpiCard
          title="Цэвэр борлуулалт"
          value={`₮${Math.round(stats.grossSales * 0.9).toLocaleString()}`}
          tone="teal"
        />
        <KpiCard title="Захиалга" value={stats.totalOrders} tone="blue" />
        <KpiCard title="Зарагдсан бараа" value={stats.itemsSold} tone="coral" />
        <KpiCard
          title="Дундаж захиалгын дүн"
          value={`₮${stats.aov.toLocaleString()}`}
          tone="neutral"
        />
      </div>

      <SalesChart
        data={stats.chartData}
        metric={metric}
        onMetricChange={setMetric}
      />

      <div className="mb-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
        <TopProductsTable
          products={stats.topProducts}
          grossSales={stats.grossSales}
          onViewInventory={() => navigate("/seller/products")}
        />
        <ShowPerformanceTable
          shows={stats.completedShows}
          onViewShows={() => navigate("/seller/shows")}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <InsightPanel
          title="Худалдан авагчийн үзүүлэлт"
          icon={Users}
          rows={[
            { label: "Нийт худалдан авагч", value: stats.uniqueBuyers },
            {
              label: "Дахин худалдан авсан",
              value: Math.floor(stats.uniqueBuyers * RETURNING_BUYER_RATE),
            },
            {
              label: "Худалдан авагч тутмын дундаж",
              value: `₮${stats.avgSpend.toLocaleString()}`,
            },
          ]}
        />
        <InsightPanel
          title="Барааны нөөцийн үзүүлэлт"
          icon={Package}
          rows={[
            { label: "Зарагдсан хувь", value: `${stats.sellThrough}%` },
            {
              label: "Нөөц багассан бараа",
              value: stats.lowStockCount,
              tone: "amber",
            },
            {
              label: "Дууссан бараа",
              value: stats.outOfStockCount,
              tone: "red",
            },
          ]}
        />
        <InsightPanel
          title="Дуудлага худалдааны үзүүлэлт"
          icon={Tag}
          rows={[
            {
              label: "Дууссан дуудлага худалдаа",
              value: AUCTION_INSIGHTS.completedAuctions,
            },
            {
              label: "Амжилтын хувь",
              value: AUCTION_INSIGHTS.successRate,
            },
            {
              label: "Дундаж хожсон үнэ",
              value: AUCTION_INSIGHTS.avgWinningPrice,
            },
          ]}
        />
      </div>
    </>
  )
}
