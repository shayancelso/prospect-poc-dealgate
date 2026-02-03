import { motion } from 'framer-motion';
import { CheckCircle2, Clock, Send, FileText, Circle, AlertCircle } from 'lucide-react';

const DOC_STATUS = {
  approved: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', icon: CheckCircle2, label: 'Approved' },
  submitted: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', icon: Send, label: 'Submitted' },
  in_review: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', icon: Clock, label: 'In Review' },
  draft: { bg: 'bg-zinc-50', text: 'text-zinc-600', border: 'border-zinc-200', icon: FileText, label: 'Draft' },
  pending: { bg: 'bg-zinc-50', text: 'text-zinc-400', border: 'border-zinc-200', icon: Circle, label: 'Pending' },
};

export default function Documents({ deals, onSelectDeal }) {
  const dealsWithDocs = deals.filter(d => d.documents.length > 0);

  const totalDocs = dealsWithDocs.reduce((s, d) => s + d.documents.length, 0);
  const approvedDocs = dealsWithDocs.reduce((s, d) => s + d.documents.filter(doc => doc.status === 'approved').length, 0);
  const inReview = dealsWithDocs.reduce((s, d) => s + d.documents.filter(doc => doc.status === 'in_review').length, 0);
  const overdue = dealsWithDocs.reduce((s, d) => s + d.documents.filter(doc => doc.due && new Date(doc.due) < new Date() && doc.status !== 'approved').length, 0);

  return (
    <div className="space-y-6 max-w-[1200px] pb-20 lg:pb-0">
      <div>
        <h1 className="text-2xl font-semibold text-zinc-900 tracking-tight">Document Tracker</h1>
        <p className="text-sm text-zinc-500">Track security questionnaires, assessments, and approvals</p>
      </div>

      {/* KPI */}
      <motion.div
        initial="hidden" animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-3"
      >
        {[
          { label: 'Total Documents', value: totalDocs, color: 'text-zinc-900' },
          { label: 'Approved', value: approvedDocs, color: 'text-emerald-600' },
          { label: 'In Review', value: inReview, color: 'text-amber-600' },
          { label: 'Overdue', value: overdue, color: 'text-red-600' },
        ].map((kpi, i) => (
          <motion.div
            key={i}
            variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } }}
            className="bg-white rounded-xl border border-zinc-200 p-4"
          >
            <p className="text-[10px] font-medium text-zinc-500 uppercase tracking-wider mb-1">{kpi.label}</p>
            <p className={`text-3xl font-bold tabular-nums ${kpi.color}`}>{kpi.value}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Deal-grouped docs */}
      <div className="space-y-4" data-tour="documents">
        {dealsWithDocs.map((deal, di) => (
          <motion.div
            key={deal.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: di * 0.08 }}
            className="bg-white rounded-xl border border-zinc-200 overflow-hidden"
          >
            <div
              className="px-5 py-4 border-b border-zinc-100 flex items-center justify-between cursor-pointer hover:bg-zinc-50/50 transition-colors"
              onClick={() => onSelectDeal(deal)}
            >
              <div>
                <p className="text-sm font-semibold text-zinc-900">{deal.institution}</p>
                <p className="text-xs text-zinc-500">{deal.name}</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-24 h-2 bg-zinc-100 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-orbital-500 to-orbital-400 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${deal.docCompletion}%` }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                  />
                </div>
                <span className="text-xs font-medium text-zinc-600 tabular-nums w-8">{deal.docCompletion}%</span>
              </div>
            </div>

            <div className="divide-y divide-zinc-100">
              {deal.documents.map((doc, i) => {
                const style = DOC_STATUS[doc.status] || DOC_STATUS.pending;
                const Icon = style.icon;
                const isOverdue = doc.due && new Date(doc.due) < new Date() && doc.status !== 'approved';
                return (
                  <div key={i} className="px-5 py-3 flex items-center gap-3 hover:bg-zinc-50/50 transition-colors">
                    <div className={`w-8 h-8 rounded-lg ${style.bg} flex items-center justify-center flex-shrink-0`}>
                      <Icon className={`w-4 h-4 ${style.text}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-zinc-900">{doc.name}</p>
                      <p className="text-xs text-zinc-500">
                        {doc.reviewer}
                        {doc.due && (
                          <span className={isOverdue ? 'text-red-500 font-medium ml-2' : 'ml-2'}>
                            {isOverdue && <AlertCircle className="w-3 h-3 inline mr-0.5" />}
                            Due {doc.due}
                          </span>
                        )}
                      </p>
                    </div>
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${style.bg} ${style.text} border ${style.border}`}>
                      {style.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
