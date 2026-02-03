import { motion } from 'framer-motion';
import { Clock, FileText, Landmark, Users, Shield, TrendingUp, Zap } from 'lucide-react';
import { INSTITUTION_TYPES, PROCUREMENT_STAGES, SALES_STAGES } from '../data';

const ICONS = { Landmark, Users, Shield, TrendingUp, Zap };

export default function DealCard({ deal, onClick, index = 0 }) {
  const inst = INSTITUTION_TYPES[deal.type];
  const Icon = ICONS[inst.icon] || Landmark;

  const riskColors = {
    low: 'border-l-emerald-400',
    medium: 'border-l-amber-400',
    high: 'border-l-red-400',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      onClick={() => onClick(deal)}
      className={`bg-white rounded-xl border border-zinc-200 p-4 space-y-3 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer group border-l-[3px] ${riskColors[deal.riskLevel]}`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-zinc-900 truncate group-hover:text-orbital-600 transition-colors">
            {deal.institution}
          </p>
          <p className="text-xs text-zinc-500 truncate">{deal.name}</p>
        </div>
        <span
          className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium flex-shrink-0"
          style={{ backgroundColor: inst.bg, color: inst.color, border: `1px solid ${inst.border}` }}
        >
          <Icon className="w-3 h-3" />
          {inst.label}
        </span>
      </div>

      {/* Value */}
      <p className="text-lg font-bold text-zinc-900 tabular-nums">
        ${(deal.value / 1000).toFixed(0)}K
      </p>

      {/* Dual Track */}
      <div className="space-y-2">
        {/* Sales track */}
        <div className="space-y-1">
          <span className="text-[10px] font-medium text-zinc-400 uppercase tracking-wider">Sales</span>
          <div className="flex gap-0.5">
            {SALES_STAGES.slice(0, 6).map((_, i) => (
              <div
                key={i}
                className={`h-1.5 flex-1 rounded-full ${
                  i < deal.salesStageIndex ? 'bg-zinc-700' :
                  i === deal.salesStageIndex ? 'bg-orbital-500' : 'bg-zinc-100'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Procurement track */}
        {deal.procurementStageIndex > 0 && (
          <div className="space-y-1">
            <span className="text-[10px] font-medium text-zinc-400 uppercase tracking-wider">Procurement</span>
            <div className="flex gap-0.5">
              {PROCUREMENT_STAGES.map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 flex-1 rounded-full ${
                    i < deal.procurementStageIndex ? 'bg-emerald-500' :
                    i === deal.procurementStageIndex ? 'bg-amber-500' : 'bg-zinc-100'
                  }`}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-zinc-500">
        <div className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          <span>{deal.daysInStage}d in stage</span>
        </div>
        {deal.docCompletion > 0 && (
          <div className="flex items-center gap-1">
            <FileText className="w-3 h-3" />
            <span>{deal.docCompletion}% docs</span>
          </div>
        )}
      </div>

      {/* Owner */}
      <div className="flex items-center gap-2">
        <div className="w-5 h-5 rounded-full bg-gradient-to-br from-orbital-400 to-orbital-600 flex items-center justify-center">
          <span className="text-white text-[8px] font-semibold">{deal.owner.avatar}</span>
        </div>
        <span className="text-xs text-zinc-500">{deal.owner.name}</span>
      </div>
    </motion.div>
  );
}
