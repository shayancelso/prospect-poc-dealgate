import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from './components/Sidebar';
import Pipeline from './pages/Pipeline';
import Documents from './pages/Documents';
import Benchmarks from './pages/Benchmarks';
import Forecast from './pages/Forecast';
import DealDetail from './components/DealDetail';
import ValuePropPopup from './components/ValuePropPopup';
import OnboardingTour from './components/OnboardingTour';
import MobileNav from './components/MobileNav';
import { DEALS } from './data';
import { HelpCircle } from 'lucide-react';

export default function App() {
  const [page, setPage] = useState('pipeline');
  const [selectedDeal, setSelectedDeal] = useState(null);
  const [showValueProp, setShowValueProp] = useState(false);
  const [showTour, setShowTour] = useState(false);
  const [tourStep, setTourStep] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const seen = localStorage.getItem('dealgate-seen');
    if (!seen) {
      setShowValueProp(true);
    }
  }, []);

  const handleCloseValueProp = () => {
    setShowValueProp(false);
    localStorage.setItem('dealgate-seen', 'true');
    setTimeout(() => setShowTour(true), 400);
  };

  const handleRestartTour = () => {
    setPage('pipeline');
    setTourStep(0);
    setShowTour(true);
  };

  const pages = {
    pipeline: <Pipeline deals={DEALS} onSelectDeal={setSelectedDeal} />,
    documents: <Documents deals={DEALS} onSelectDeal={setSelectedDeal} />,
    benchmarks: <Benchmarks />,
    forecast: <Forecast deals={DEALS} />,
  };

  return (
    <div className="flex h-screen bg-zinc-50 overflow-hidden">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar page={page} setPage={setPage} onRestartTour={handleRestartTour} />
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed left-0 top-0 bottom-0 z-50 lg:hidden"
            >
              <Sidebar page={page} setPage={(p) => { setPage(p); setSidebarOpen(false); }} onRestartTour={handleRestartTour} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 overflow-auto relative">
        {/* Mobile Header */}
        <div className="lg:hidden sticky top-0 z-30 bg-white/80 backdrop-blur-sm border-b border-zinc-200 px-4 py-3 flex items-center justify-between">
          <button onClick={() => setSidebarOpen(true)} className="p-1.5 hover:bg-zinc-100 rounded-lg transition-colors">
            <svg className="w-5 h-5 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
          </button>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-orbital-500 to-orbital-700 flex items-center justify-center">
              <span className="text-white text-[10px] font-bold">O</span>
            </div>
            <span className="text-sm font-semibold text-zinc-900">DealGate</span>
          </div>
          <button onClick={handleRestartTour} className="p-1.5 hover:bg-zinc-100 rounded-lg transition-colors">
            <HelpCircle className="w-5 h-5 text-zinc-400" />
          </button>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={page}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="p-4 sm:p-6 lg:p-8"
          >
            {pages[page]}
          </motion.div>
        </AnimatePresence>

        {/* Mobile Bottom Nav */}
        <MobileNav page={page} setPage={setPage} />
      </main>

      {/* Deal Detail Slide-over */}
      <AnimatePresence>
        {selectedDeal && (
          <DealDetail deal={selectedDeal} onClose={() => setSelectedDeal(null)} />
        )}
      </AnimatePresence>

      {/* Value Prop Popup */}
      <AnimatePresence>
        {showValueProp && <ValuePropPopup onClose={handleCloseValueProp} />}
      </AnimatePresence>

      {/* Onboarding Tour */}
      <AnimatePresence>
        {showTour && (
          <OnboardingTour
            step={tourStep}
            setStep={setTourStep}
            onClose={() => setShowTour(false)}
            setPage={setPage}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
