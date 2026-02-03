import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend, Cell
} from 'recharts';
import { ArrowRight, AlertTriangle, TrendingUp, Calendar, DollarSign } from 'lucide-react';
import { MONTHLY_FORECAST, INSTITUTION_TYPES, SALES_STAGES } from '../data';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-zinc-900 text-white px-3 py-2.5 rounded-lg shadow-lg text-xs space-y-1">
      <p className="font-medium text-zinc-300">{label}</p>
      {payload.map((p, i) => (
        <div key={i} className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
          <span>{p.name}: ${(p.value / 1000).toFixed(0)}K</span>
        </div>
      ))}
    </div>
  );
};

export default function Forecast({ deals }) {
  const activeDeals = deals.filter(d => d.salesStageIndex >= 2 && d.salesStageIndex <= 4);

  // Revenue by type
  const revenueByType = Object.entries(INSTITUTION_TYPES).map(([key, val]) => ({
    type: val.label,
    value: deals.filter(d => d.type === key && d.salesStageIndex < 5).reduce((s, d) => s + d.value, 0),
    color: val.color,
  })).filter(d => d.value > 0);

  const totalPipeline = deals.filter(d => d.salesStageIndex < 5).reduce((s, d) => s + d.value, 0);
  const closedRevenue = deals.filter(d => d.salesStageIndex === 5).reduce((s, d) => s + d.value, 0);
  const avgProcDelay = Math.round(
    activeDeals.reduce((s, d) => {
      if (d.closeDate && d.adjCloseDate) {
        return s + (new Date(d.adjCloseDate) - new Date(d.closeDate)) / (1000 * 60 * 60 * 24);
      }
      return s;
    }, 0) / (activeDeals.length || 1)
  );

  return (
    <div className="space-y-6 max-w-[1200px] pb-20 lg:pb-0">
      <div>
        <h1 className="text-2xl font-semibold text-zinc-900 tracking-tight">Procurement-Adjusted Forecast</h1>
        <p className="text-sm text-zinc-500">Close dates adjusted by institution procurement benchmarks</p>
      </div>

      {/* KPIs */}
      <motion.div
        initial="hidden" animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-3"
      >
        {[
          { label: 'Active Pipeline', value: `$${(totalPipeline / 1000).toFixed(0)}K`, icon: DollarSign, color: 'text-zinc-900' },
          { label: 'Closed Won (YTD)', value: `$${(closedRevenue / 1000).toFixed(0)}K`, icon: TrendingUp, color: 'text-emerald-600' },
          { label: 'Avg Procurement Delay', value: `${avgProcDelay}d`, icon: Calendar, color: 'text-amber-600' },
          { label: 'Deals at Risk', value: deals.filter(d => d.riskLevel === 'high' && d.salesStageIndex < 5).length.toString(), icon: AlertTriangle, color: 'text-red-600' },
        ].map((kpi, i) => (
          <motion.div
            key={i}
            variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } }}
            className="bg-white rounded-xl border border-zinc-200 p-4"
          >
            <p className="text-[10px] font-medium text-zinc-500 uppercase tracking-wider mb-1">{kpi.label}</p>
            <p className={`text-2xl sm:text-3xl font-bold tabular-nums ${kpi.color}`}>{kpi.value}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Forecast Chart */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-xl border border-zinc-200 p-6"
        data-tour="forecast"
      >
        <h2 className="text-sm font-semibold text-zinc-900 mb-1">Sales vs Procurement-Adjusted Forecast</h2>
        <p className="text-xs text-zinc-500 mb-6">See the gap between optimistic sales dates and realistic procurement-adjusted dates</p>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={MONTHLY_FORECAST} margin={{ left: 0, right: 20, top: 5 }}>
              <defs>
                <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#04433D" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#04433D" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="adjGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4C9E82" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#4C9E82" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f4f4f5" vertical={false} />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#a1a1aa' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#a1a1aa' }}
                tickFormatter={v => `$${v / 1000}K`} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="sales" name="Sales Forecast" stroke="#04433D" strokeWidth={2}
                fill="url(#salesGrad)" animationDuration={1200} />
              <Area type="monotone" dataKey="adjusted" name="Adj. Forecast" stroke="#4C9E82" strokeWidth={2}
                fill="url(#adjGrad)" animationDuration={1200} strokeDasharray="6 3" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="flex items-center gap-6 mt-4">
          <div className="flex items-center gap-2">
            <span className="w-3 h-0.5 bg-indigo-500 rounded-full" />
            <span className="text-xs text-zinc-500">Sales Forecast</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-0.5 bg-teal-500 rounded-full border-b border-dashed" />
            <span className="text-xs text-zinc-500">Procurement-Adjusted</span>
          </div>
        </div>
      </motion.div>

      {/* Pipeline by Type */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-xl border border-zinc-200 p-6"
      >
        <h2 className="text-sm font-semibold text-zinc-900 mb-1">Pipeline by Institution Type</h2>
        <p className="text-xs text-zinc-500 mb-6">Revenue distribution across institution categories</p>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={revenueByType} margin={{ left: 0, right: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f4f4f5" vertical={false} />
              <XAxis dataKey="type" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#a1a1aa' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#a1a1aa' }}
                tickFormatter={v => `$${v / 1000}K`} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0,0,0,0.02)' }} />
              <Bar dataKey="value" name="Pipeline" radius={[6, 6, 0, 0]} barSize={40} animationDuration={1200}>
                {revenueByType.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Deal Forecast Table */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-xl border border-zinc-200 overflow-hidden"
      >
        <div className="px-6 py-4 border-b border-zinc-100">
          <h2 className="text-sm font-semibold text-zinc-900">Deal Forecast with Procurement Adjustment</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-zinc-50/50">
                {['Deal', 'Institution', 'Value', 'Stage', 'Sales Close', 'Adj. Close', 'Delay'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-[10px] font-medium text-zinc-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {deals.filter(d => d.salesStageIndex >= 2 && d.salesStageIndex <= 4).sort((a, b) => new Date(a.closeDate) - new Date(b.closeDate)).map(deal => {
                const delay = Math.round((new Date(deal.adjCloseDate) - new Date(deal.closeDate)) / (1000 * 60 * 60 * 24));
                const inst = INSTITUTION_TYPES[deal.type];
                return (
                  <tr key={deal.id} className="border-t border-zinc-100 hover:bg-zinc-50/50 transition-colors">
                    <td className="px-4 py-3">
                      <p className="text-sm font-medium text-zinc-900">{deal.name}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium"
                        style={{ backgroundColor: inst.bg, color: inst.color }}>
                        {deal.institution}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm font-semibold text-zinc-900 tabular-nums">
                      ${(deal.value / 1000).toFixed(0)}K
                    </td>
                    <td className="px-4 py-3 text-sm text-zinc-600">{SALES_STAGES[deal.salesStageIndex]}</td>
                    <td className="px-4 py-3 text-sm text-zinc-600">{deal.closeDate}</td>
                    <td className="px-4 py-3 text-sm font-medium text-zinc-900">{deal.adjCloseDate}</td>
                    <td className="px-4 py-3">
                      {delay > 0 ? (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-red-600">
                          <ArrowRight className="w-3 h-3" />
                          +{delay}d
                        </span>
                      ) : (
                        <span className="text-xs text-emerald-600 font-medium">On time</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
