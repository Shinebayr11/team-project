"use client"

import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';
import { ChartMetric, ChartPoint } from '@/features/seller-hub/hooks/useSellerAnalytics';

interface SalesChartProps {
  data: ChartPoint[];
  metric: ChartMetric;
  onMetricChange: (metric: ChartMetric) => void;
}

const METRICS: ChartMetric[] = ['revenue', 'orders', 'items'];
const METRIC_LABELS: Record<ChartMetric, string> = {
  revenue: 'Орлого',
  orders: 'Захиалга',
  items: 'Бараа',
};
/**
 * Recharts нь өнгийг SVG-ийн presentation attribute болгон бичдэг тул энд
 * `var(--wn-admin-*)` найдваргүй — хөтөч attribute доторх CSS хувьсагчийг
 * тайлдаггүй. Иймд утгыг нь шууд бичив; эх сурвалж нь `app/globals.css`-ийн
 * доорх токенууд бөгөөд тэднийг өөрчлөхөд ЭНЭ БЛОКИЙГ ДАГУУЛЖ засна.
 */
const CHART = {
  ink: '#0e0b18',        // --wn-admin-ink
  accent: '#5b3fe0',     // --wn-admin-accent
  muted: '#63616e',      // --wn-admin-muted
  grid: '#e7e5ea',       // --wn-admin-card-border
  cursor: '#d9d6de',     // --wn-admin-outline
};

const axisTick = { fontSize: 12, fill: CHART.muted, fontWeight: 600 };

export const SalesChart: React.FC<SalesChartProps> = ({ data, metric, onMetricChange }) => {
  const formatValue = (value: unknown) =>
    metric === 'revenue' && typeof value === 'number' ? `₮${value.toLocaleString()}` : String(value);

  return (
    <div className="p-6 rounded-2xl border border-[var(--wn-admin-card-border)] bg-white shadow-sm mb-8">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <h3 className="text-[16px] font-[800] text-black">Борлуулалтын үзүүлэлт</h3>
        <div className="flex p-1 bg-[var(--wn-admin-chip)] rounded-lg">
          {METRICS.map(m => (
            <button
              key={m}
              onClick={() => onMetricChange(m)}
              className={`px-4 py-1.5 rounded-md text-[12px] font-[700] transition-colors ${
                metric === m ? 'bg-white text-black shadow-sm' : 'text-[var(--wn-admin-muted)] hover:text-black'
              }`}
            >
              {METRIC_LABELS[m]}
            </button>
          ))}
        </div>
      </div>

      <div className="h-[220px] sm:h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={CHART.grid} />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={axisTick} dy={10} />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={axisTick}
              tickFormatter={value => (metric === 'revenue' ? `₮${value / 1000}k` : value)}
            />
            <Tooltip
              cursor={{ stroke: CHART.cursor, strokeWidth: 2 }}
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontWeight: 700, fontSize: '13px' }}
              formatter={value => formatValue(value)}
            />
            <Line
              type="monotone"
              dataKey={metric}
              stroke={CHART.ink}
              strokeWidth={3}
              dot={{ r: 4, fill: CHART.ink, strokeWidth: 0 }}
              activeDot={{ r: 6, fill: CHART.accent, strokeWidth: 0 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};