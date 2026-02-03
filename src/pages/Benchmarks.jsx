import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Landmark, Users, Shield, TrendingUp, Zap, Lightbulb, AlertTriangle } from 'lucide-react';
import { BENCHMARKS, BOTTLENECK_DATA, INSTITUTION_TYPES } from '../data';

const ICONS = {
  bank: Landmark,
  credit_union: Users,
  insurance: Shield,
  asset_manager: TrendingUp,
  fintech: Zap,
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-zinc-900 text-white px-3 py-2 rounded-lg shadow-lg text-xs">
      <p className="font-medium">{label}</p>
      <p className="text-zinc-300">Avg. {payload[0].value} days</p>
    </div>
  );
};

export default function Benchmarks() {
  return (
    <div className="space-y-8 max-w-[1200px] pb-20 lg:pb-0">
      <div>
        <h1 className="text-2xl font-semibold text-zinc-900 tracking-tight">Institution Benchmarks</h1>
        <p className="text-sm text-zinc-500">Procurement patterns by institution type — set realistic expectations</p>
      </div>

      {/* Benchmark Cards */}
      <motion.div
        initial="hidden" animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        data-tour="benchmarks"
      >
        {BENCHMARKS.map((b, i) => {
          const inst = INSTITUTION_TYPES[b.type];
          const Icon = ICONS[b.type];
          return (
            <motion.div
              key={i}
              variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4 } } }}
              className="bg-white rounded-xl border border-zinc-200 p-5 space-y-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: inst.bg }}>
                  <Icon className="w-5 h-5" style={{ color: inst.color }} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-zinc-900">{b.label}</p>
                  <p className="text-xs text-zinc-500">Avg. {b.avgDays} days procurement</p>
                </div>
              </div>

              {/* Mini timeline */}
              <div className="flex gap-1 h-2.5 rounded-full overflow-hidden">
                <div className="bg-amber-300 rounded-l-full" style={{ flex: 15 }} title="Vendor Reg" />
                <div className="bg-red-300" style={{ flex: b.type === 'bank' ? 28 : 14 }} title="Risk Assessment" />
                <div className="bg-blue-300" style={{ flex: 14 }} title="Compliance" />
                <div className="bg-violet-300" style={{ flex: 12 }} title="Legal" />
                <div className="bg-zinc-300 rounded-r-full" style={{ flex: 9 }} title="Approval" />
              </div>
              <div className="flex justify-between text-[9px] text-zinc-400">
                <span>Vendor Reg</span>
                <span>Risk</span>
                <span>Compliance</span>
                <span>Legal</span>
                <span>Approval</span>
              </div>

              <div className="space-y-2 pt-1">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-500 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-zinc-600"><span className="font-medium text-zinc-800">Bottleneck:</span> {b.bottleneck}</p>
                </div>
                <div className="flex items-start gap-2">
                  <Lightbulb className="w-3.5 h-3.5 text-hb-500 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-zinc-600">{b.tip}</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-zinc-100">
                <div>
                  <p className="text-[10px] text-zinc-500 uppercase tracking-wider">Typical Docs</p>
                  <p className="text-sm font-semibold text-zinc-900">{b.docs}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-zinc-500 uppercase tracking-wider">Win Rate</p>
                  <p className="text-sm font-semibold text-emerald-600">{b.winRate}%</p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Bottleneck Analysis Chart */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-xl border border-zinc-200 p-6"
      >
        <h2 className="text-sm font-semibold text-zinc-900 mb-1">Procurement Bottleneck Analysis</h2>
        <p className="text-xs text-zinc-500 mb-6">Average days spent at each procurement stage</p>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={BOTTLENECK_DATA} layout="vertical" margin={{ left: 20, right: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f4f4f5" horizontal={false} />
              <XAxis type="number" axisLine={false} tickLine={false}
                tick={{ fontSize: 11, fill: '#a1a1aa' }} tickFormatter={v => `${v}d`} />
              <YAxis type="category" dataKey="stage" axisLine={false} tickLine={false}
                tick={{ fontSize: 11, fill: '#71717a' }} width={140} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0,0,0,0.02)' }} />
              <Bar dataKey="avgDays" radius={[0, 6, 6, 0]} barSize={24} animationDuration={1200}>
                {BOTTLENECK_DATA.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Avg Duration Comparison */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-xl border border-zinc-200 p-6"
      >
        <h2 className="text-sm font-semibold text-zinc-900 mb-1">Procurement Duration by Institution Type</h2>
        <p className="text-xs text-zinc-500 mb-6">Average days from procurement start to approval</p>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={BENCHMARKS.map(b => ({ name: b.label, days: b.avgDays, color: INSTITUTION_TYPES[b.type].color }))}
              margin={{ left: 0, right: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f4f4f5" vertical={false} />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#a1a1aa' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#a1a1aa' }} tickFormatter={v => `${v}d`} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0,0,0,0.02)' }} />
              <Bar dataKey="days" radius={[6, 6, 0, 0]} barSize={40} animationDuration={1200}>
                {BENCHMARKS.map((b, i) => (
                  <Cell key={i} fill={INSTITUTION_TYPES[b.type].color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </div>
  );
}
