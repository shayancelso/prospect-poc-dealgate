import { LayoutDashboard, FileText, Landmark, TrendingUp, HelpCircle } from 'lucide-react';

const NAV = [
  { id: 'pipeline', label: 'Pipeline', icon: LayoutDashboard },
  { id: 'documents', label: 'Documents', icon: FileText },
  { id: 'benchmarks', label: 'Benchmarks', icon: Landmark },
  { id: 'forecast', label: 'Forecast', icon: TrendingUp },
];

export default function Sidebar({ page, setPage, onRestartTour }) {
  return (
    <aside className="w-64 h-screen border-r border-zinc-200 bg-white flex flex-col">
      {/* Logo */}
      <div className="h-16 px-6 flex items-center gap-3 border-b border-zinc-100">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-orbital-500 to-orbital-700 flex items-center justify-center shadow-sm">
          <span className="text-white text-sm font-bold">O</span>
        </div>
        <div>
          <span className="text-sm font-bold text-zinc-900 tracking-tight">DealGate</span>
          <span className="text-[10px] text-zinc-400 ml-1.5 font-medium">by Orbital</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1" data-tour="nav">
        {NAV.map(item => {
          const Icon = item.icon;
          const active = page === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setPage(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-150 ${
                active
                  ? 'bg-orbital-50 text-orbital-700'
                  : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="p-4 border-t border-zinc-100 space-y-3">
        <button
          onClick={onRestartTour}
          className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-zinc-500 hover:text-zinc-700 hover:bg-zinc-50 rounded-lg transition-colors"
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Product Tour</span>
        </button>
        <div className="flex items-center gap-3 px-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orbital-400 to-orbital-600 flex items-center justify-center">
            <span className="text-white text-xs font-semibold">VC</span>
          </div>
          <div>
            <p className="text-sm font-medium text-zinc-900">Victor Chen</p>
            <p className="text-xs text-zinc-500">VP Sales</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
