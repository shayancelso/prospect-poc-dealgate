import { useState, useEffect } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { Filter, AlertTriangle, Clock, FileText, CheckCircle2 } from 'lucide-react';
import DealCard from '../components/DealCard';
import { SALES_STAGES, INSTITUTION_TYPES } from '../data';

function AnimatedNumber({ value, prefix = '', suffix = '' }) {
  const mv = useMotionValue(0);
  const display = useTransform(mv, v => `${prefix}${Math.round(v).toLocaleString()}${suffix}`);
  useEffect(() => {
    const c = animate(mv, value, { duration: 1, ease: 'easeOut' });
    return c.stop;
  }, [value]);
  return <motion.span>{display}</motion.span>;
}

export default function Pipeline({ deals, onSelectDeal }) {
  const [filter, setFilter] = useState('all');

  const activeDeals = deals.filter(d => d.salesStageIndex < 6); // not closed lost
  const filteredDeals = filter === 'all' ? activeDeals : activeDeals.filter(d => d.type === filter);

  const totalPipeline = filteredDeals.reduce((s, d) => s + (d.salesStageIndex < 5 ? d.value : 0), 0);
  const inProcurement = filteredDeals.filter(d => d.procurementStageIndex > 0 && d.procurementStageIndex < 7).length;
  const pendingDocs = filteredDeals.reduce((s, d) => s + d.documents.filter(doc => doc.status !== 'approved').length, 0);
  const avgProcDays = Math.round(
    filteredDeals.filter(d => d.procurementDays > 0).reduce((s, d) => s + d.procurementDays, 0) /
    (filteredDeals.filter(d => d.procurementDays > 0).length || 1)
  );

  // Group deals by sales stage
  const stages = SALES_STAGES.slice(0, 6).map((stage, i) => ({
    name: stage,
    deals: filteredDeals.filter(d => d.salesStageIndex === i),
  }));

  return (
    <div className="space-y-6 max-w-[1400px] pb-20 lg:pb-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900 tracking-tight">Pipeline</h1>
          <p className="text-sm text-zinc-500">Track deals through sales and procurement stages</p>
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors flex-shrink-0 ${
              filter === 'all' ? 'bg-zinc-900 text-white' : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
            }`}
          >
            All Types
          </button>
          {Object.entries(INSTITUTION_TYPES).map(([key, val]) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors flex-shrink-0 ${
                filter === key ? 'text-white' : 'text-zinc-600 hover:bg-zinc-100'
              }`}
              style={filter === key ? { backgroundColor: val.color } : {}}
            >
              {val.label}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Summary */}
      <motion.div
        initial="hidden" animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-3"
      >
        {[
          { label: 'Total Pipeline', value: totalPipeline, prefix: '$', format: true, icon: null },
          { label: 'In Procurement', value: inProcurement, suffix: ' deals', icon: Clock },
          { label: 'Avg Procurement Days', value: avgProcDays, suffix: 'd', icon: AlertTriangle },
          { label: 'Pending Documents', value: pendingDocs, icon: FileText },
        ].map((kpi, i) => (
          <motion.div
            key={i}
            variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4 } } }}
            className="bg-white rounded-xl border border-zinc-200 p-4 sm:p-5 hover:shadow-sm transition-shadow"
          >
            <p className="text-[10px] sm:text-xs font-medium text-zinc-500 uppercase tracking-wider mb-1">{kpi.label}</p>
            <p className="text-2xl sm:text-3xl font-bold text-zinc-900 tabular-nums">
              {kpi.format ? (
                <AnimatedNumber value={totalPipeline / 1000} prefix="$" suffix="K" />
              ) : (
                <AnimatedNumber value={kpi.value} suffix={kpi.suffix || ''} />
              )}
            </p>
          </motion.div>
        ))}
      </motion.div>

      {/* Pipeline Board */}
      <div className="overflow-x-auto -mx-4 sm:-mx-6 lg:mx-0 px-4 sm:px-6 lg:px-0">
        <div className="flex gap-4 min-w-[900px]" data-tour="pipeline">
          {stages.map((stage, si) => (
            <div key={si} className="flex-1 min-w-[200px]">
              <div className="flex items-center gap-2 mb-3">
                <h3 className="text-xs font-medium text-zinc-500 uppercase tracking-wider">{stage.name}</h3>
                <span className="bg-zinc-100 text-zinc-600 text-[10px] font-medium px-2 py-0.5 rounded-full">
                  {stage.deals.length}
                </span>
              </div>
              <div className="bg-zinc-50/50 rounded-xl p-2 space-y-2 min-h-[400px]">
                {stage.deals.map((deal, di) => (
                  <DealCard key={deal.id} deal={deal} onClick={onSelectDeal} index={di} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
