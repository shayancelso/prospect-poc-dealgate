import { motion } from 'framer-motion';
import { X, ArrowRight, Shield, Clock, BarChart3, FileCheck } from 'lucide-react';

export default function ValuePropPopup({ onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden"
      >
        {/* Header with gradient */}
        <div className="bg-gradient-to-br from-orbital-600 via-orbital-500 to-blue-400 p-6 sm:p-8 text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-white/20 -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full bg-white/10 translate-y-1/2 -translate-x-1/2" />
          </div>
          <button onClick={onClose} className="absolute top-4 right-4 p-1 hover:bg-white/20 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
          <div className="relative">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <span className="text-white text-sm font-bold">O</span>
              </div>
              <span className="text-sm font-semibold opacity-90">DealGate by Orbital</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold mb-2 leading-tight">
              Orbital, your deals shouldn&apos;t die in procurement.
            </h2>
            <p className="text-sm text-white/80 leading-relaxed">
              You sell world-class compliance technology to banks and financial institutions.
              Your sales conversations go great — but then deals enter procurement and disappear
              for months. Security questionnaires, risk committees, approval chains. Sound familiar?
            </p>
          </div>
        </div>

        {/* Features */}
        <div className="p-6 sm:p-8 space-y-4">
          <p className="text-sm font-semibold text-zinc-900">DealGate gives you visibility into the black box:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { icon: Shield, title: 'Dual-Track Pipeline', desc: 'See sales AND procurement stages simultaneously' },
              { icon: FileCheck, title: 'Document Tracker', desc: 'Every questionnaire, assessment, and approval in one view' },
              { icon: Clock, title: 'Procurement Timing', desc: 'Benchmark-adjusted close dates you can actually trust' },
              { icon: BarChart3, title: 'Bottleneck Analytics', desc: 'Know where deals stall before they go dark' },
            ].map((f, i) => (
              <div key={i} className="flex gap-3 p-3 rounded-xl bg-zinc-50 hover:bg-orbital-50/50 transition-colors">
                <div className="w-9 h-9 rounded-lg bg-orbital-100 flex items-center justify-center flex-shrink-0">
                  <f.icon className="w-4 h-4 text-orbital-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-zinc-900">{f.title}</p>
                  <p className="text-xs text-zinc-500 leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={onClose}
            className="w-full mt-2 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-orbital-600 to-orbital-500 text-white text-sm font-semibold rounded-xl hover:from-orbital-700 hover:to-orbital-600 active:scale-[0.98] transition-all shadow-lg shadow-orbital-500/25"
          >
            Explore DealGate
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
