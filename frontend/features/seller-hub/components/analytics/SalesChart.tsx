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
const axisTick = { fontSize: 12, fill: '#6B7280', fontWeight: 600 };

export const SalesChart: React.FC<SalesChartProps> = ({ data, metric, onMetricChange }) => {
  const formatValue = (value: unknown) =>
    metric === 'revenue' && typeof value === 'number' ? `₮${value.toLocaleString()}` : String(value);

  return (
    <div className="p-6 rounded-2xl border border-gray-200 bg-white shadow-sm mb-8">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <h3 className="text-[16px] font-[800] text-black">Sales Performance</h3>
        <div className="flex p-1 bg-gray-100 rounded-lg">
          {METRICS.map(m => (
            <button
              key={m}
              onClick={() => onMetricChange(m)}
              className={`px-4 py-1.5 rounded-md text-[12px] font-[700] capitalize transition-colors ${
                metric === m ? 'bg-white text-black shadow-sm' : 'text-gray-500 hover:text-black'
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      <div className="h-[220px] sm:h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={axisTick} dy={10} />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={axisTick}
              tickFormatter={value => (metric === 'revenue' ? `₮${value / 1000}k` : value)}
            />
            <Tooltip
              cursor={{ stroke: '#D1D5DB', strokeWidth: 2 }}
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontWeight: 700, fontSize: '13px' }}
              formatter={value => formatValue(value)}
            />
            <Line
              type="monotone"
              dataKey={metric}
              stroke="#1A1A1A"
              strokeWidth={3}
              dot={{ r: 4, fill: '#1A1A1A', strokeWidth: 0 }}
              activeDot={{ r: 6, fill: '#F5A623', strokeWidth: 0 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};