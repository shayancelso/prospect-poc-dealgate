import { motion } from 'framer-motion';
import { X, ArrowRight, ArrowLeft } from 'lucide-react';

const STEPS = [
  {
    title: 'Dual-Track Pipeline',
    desc: 'Every deal shows both its sales stage and procurement progress. No more deals disappearing into procurement black holes.',
    page: 'pipeline',
  },
  {
    title: 'Document Tracker',
    desc: 'Track security questionnaires, SOC 2 reports, DPAs, and risk assessments across all deals. See what\'s blocking each deal.',
    page: 'documents',
  },
  {
    title: 'Institution Benchmarks',
    desc: 'Know that banks average 78 days in procurement while fintechs close in 18. Set realistic expectations from day one.',
    page: 'benchmarks',
  },
  {
    title: 'Procurement-Adjusted Forecast',
    desc: 'See the real close date — not the optimistic one. Forecasts adjusted by institution type and procurement stage.',
    page: 'forecast',
  },
];

export default function OnboardingTour({ step, setStep, onClose, setPage }) {
  const current = STEPS[step];
  if (!current) { onClose(); return null; }

  const handleNext = () => {
    if (step < STEPS.length - 1) {
      const next = step + 1;
      setStep(next);
      setPage(STEPS[next].page);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (step > 0) {
      const prev = step - 1;
      setStep(prev);
      setPage(STEPS[prev].page);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.25 }}
      className="fixed bottom-20 sm:bottom-8 left-4 right-4 sm:left-auto sm:right-8 sm:w-96 z-50"
    >
      <div className="bg-zinc-900 text-white rounded-2xl shadow-2xl p-5 relative">
        <button onClick={onClose} className="absolute top-3 right-3 p-1 hover:bg-white/10 rounded-lg transition-colors">
          <X className="w-4 h-4 text-zinc-400" />
        </button>

        {/* Progress dots */}
        <div className="flex gap-1.5 mb-3">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className={`h-1 rounded-full transition-all duration-300 ${
                i === step ? 'w-6 bg-orbital-400' : i < step ? 'w-3 bg-orbital-600' : 'w-3 bg-zinc-700'
              }`}
            />
          ))}
        </div>

        <p className="text-xs font-medium text-orbital-400 uppercase tracking-wider mb-1">
          Step {step + 1} of {STEPS.length}
        </p>
        <h3 className="text-base font-semibold mb-1.5">{current.title}</h3>
        <p className="text-sm text-zinc-400 leading-relaxed mb-4">{current.desc}</p>

        <div className="flex items-center gap-2">
          {step > 0 && (
            <button
              onClick={handlePrev}
              className="flex items-center gap-1 px-3 py-2 text-xs font-medium text-zinc-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
            >
              <ArrowLeft className="w-3 h-3" /> Back
            </button>
          )}
          <button
            onClick={handleNext}
            className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2 bg-orbital-500 hover:bg-orbital-600 text-white text-sm font-medium rounded-lg active:scale-[0.98] transition-all"
          >
            {step < STEPS.length - 1 ? (
              <>Next <ArrowRight className="w-3.5 h-3.5" /></>
            ) : (
              'Got it!'
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
