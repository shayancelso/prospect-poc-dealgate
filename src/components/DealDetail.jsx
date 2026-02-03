import { motion } from 'framer-motion';
import { X, Check, Clock, Circle, AlertCircle, FileText, Send, CheckCircle2 } from 'lucide-react';
import { INSTITUTION_TYPES, SALES_STAGES, PROCUREMENT_STAGES } from '../data';

const DOC_STATUS_STYLES = {
  approved: { bg: 'bg-emerald-100', text: 'text-emerald-600', icon: CheckCircle2, label: 'Approved' },
  submitted: { bg: 'bg-blue-100', text: 'text-blue-600', icon: Send, label: 'Submitted' },
  in_review: { bg: 'bg-amber-100', text: 'text-amber-600', icon: Clock, label: 'In Review' },
  draft: { bg: 'bg-zinc-100', text: 'text-zinc-500', icon: FileText, label: 'Draft' },
  pending: { bg: 'bg-zinc-100', text: 'text-zinc-400', icon: Circle, label: 'Pending' },
  not_started: { bg: 'bg-zinc-100', text: 'text-zinc-400', icon: Circle, label: 'Not Started' },
};

export default function DealDetail({ deal, onClose }) {
  const inst = INSTITUTION_TYPES[deal.type];

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/30 z-40"
        onClick={onClose}
      />
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 28, stiffness: 300 }}
        className="fixed right-0 top-0 bottom-0 w-full sm:w-[540px] bg-white z-50 shadow-2xl overflow-auto border-l border-zinc-200"
      >
        {/* Header */}
        <div className="sticky top-0 bg-white/90 backdrop-blur-sm border-b border-zinc-100 px-6 py-4 z-10">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-lg font-semibold text-zinc-900">{deal.institution}</h2>
                <span
                  className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium"
                  style={{ backgroundColor: inst.bg, color: inst.color }}
                >
                  {inst.label}
                </span>
              </div>
              <p className="text-sm text-zinc-500">{deal.name}</p>
            </div>
            <button onClick={onClose} className="p-1.5 hover:bg-zinc-100 rounded-lg transition-colors">
              <X className="w-5 h-5 text-zinc-400" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Deal Value', value: `$${(deal.value / 1000).toFixed(0)}K` },
              { label: 'Procurement Days', value: deal.procurementDays || '\u2014' },
              { label: 'Doc Completion', value: `${deal.docCompletion}%` },
            ].map((m, i) => (
              <div key={i} className="bg-zinc-50 rounded-xl p-3 text-center">
                <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-1">{m.label}</p>
                <p className="text-xl font-bold text-zinc-900 tabular-nums">{m.value}</p>
              </div>
            ))}
          </div>

          {/* Sales & Procurement Stages */}
          <div className="space-y-4">
            <div>
              <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2">Sales Stage</p>
              <div className="flex gap-1 mb-1">
                {SALES_STAGES.slice(0, 6).map((stage, i) => (
                  <div key={i} className="flex-1">
                    <div className={`h-2 rounded-full mb-1 ${
                      i < deal.salesStageIndex ? 'bg-zinc-700' :
                      i === deal.salesStageIndex ? 'bg-hb-500' : 'bg-zinc-100'
                    }`} />
                    <p className={`text-[9px] text-center truncate ${
                      i === deal.salesStageIndex ? 'text-hb-500 font-medium' : 'text-zinc-400'
                    }`}>{stage}</p>
                  </div>
                ))}
              </div>
            </div>

            {deal.procurementStageIndex > 0 && (
              <div>
                <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2">Procurement Stage</p>
                <div className="flex gap-1 mb-1">
                  {PROCUREMENT_STAGES.map((stage, i) => (
                    <div key={i} className="flex-1">
                      <div className={`h-2 rounded-full mb-1 ${
                        i < deal.procurementStageIndex ? 'bg-emerald-500' :
                        i === deal.procurementStageIndex ? 'bg-amber-500' : 'bg-zinc-100'
                      }`} />
                      <p className={`text-[8px] text-center truncate ${
                        i === deal.procurementStageIndex ? 'text-amber-600 font-medium' : 'text-zinc-400'
                      }`}>{stage}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Approval Chain */}
          {deal.approvalSteps.length > 0 && (
            <div>
              <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-3">Approval Chain</p>
              <div className="flex items-center gap-0 overflow-x-auto pb-2">
                {deal.approvalSteps.map((step, i) => (
                  <div key={i} className="flex items-center">
                    <div className="flex flex-col items-center gap-1.5 px-2">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                        step.status === 'approved' ? 'bg-emerald-50 border-emerald-300' :
                        step.status === 'in_review' ? 'bg-amber-50 border-amber-300 animate-pulse' :
                        step.status === 'rejected' ? 'bg-red-50 border-red-300' :
                        'bg-zinc-50 border-zinc-200'
                      }`}>
                        {step.status === 'approved' ? <Check className="w-4 h-4 text-emerald-600" /> :
                         step.status === 'in_review' ? <Clock className="w-4 h-4 text-amber-600" /> :
                         step.status === 'rejected' ? <X className="w-4 h-4 text-red-600" /> :
                         <Circle className="w-4 h-4 text-zinc-300" />}
                      </div>
                      <span className="text-[10px] text-zinc-500 text-center max-w-[72px] leading-tight">{step.title}</span>
                    </div>
                    {i < deal.approvalSteps.length - 1 && (
                      <div className={`h-0.5 w-6 flex-shrink-0 ${
                        step.status === 'approved' ? 'bg-emerald-300' : 'bg-zinc-200'
                      }`} />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Documents */}
          {deal.documents.length > 0 && (
            <div>
              <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-3">Documents</p>
              <div className="space-y-2">
                {deal.documents.map((doc, i) => {
                  const style = DOC_STATUS_STYLES[doc.status] || DOC_STATUS_STYLES.pending;
                  const StatusIcon = style.icon;
                  return (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-zinc-50 hover:bg-zinc-100 transition-colors">
                      <div className={`w-8 h-8 rounded-lg ${style.bg} flex items-center justify-center flex-shrink-0`}>
                        <StatusIcon className={`w-4 h-4 ${style.text}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-zinc-900 truncate">{doc.name}</p>
                        <p className="text-xs text-zinc-500">{doc.reviewer}{doc.due ? ` \u00b7 Due ${doc.due}` : ''}</p>
                      </div>
                      <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${style.bg} ${style.text}`}>
                        {style.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Deal Info */}
          <div>
            <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-3">Deal Details</p>
            <div className="space-y-2">
              {[
                ['Owner', deal.owner.name],
                ['Sales Close Date', deal.closeDate],
                ['Adj. Close Date', deal.adjCloseDate],
                ['Risk Level', deal.riskLevel.charAt(0).toUpperCase() + deal.riskLevel.slice(1)],
                ...(deal.lostReason ? [['Lost Reason', deal.lostReason]] : []),
              ].map(([label, value], i) => (
                <div key={i} className="flex justify-between py-2 border-b border-zinc-100 last:border-0">
                  <span className="text-sm text-zinc-500">{label}</span>
                  <span className="text-sm font-medium text-zinc-900">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
}
