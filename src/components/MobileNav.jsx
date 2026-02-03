import { LayoutDashboard, FileText, Landmark, TrendingUp } from 'lucide-react';

const NAV = [
  { id: 'pipeline', label: 'Pipeline', icon: LayoutDashboard },
  { id: 'documents', label: 'Docs', icon: FileText },
  { id: 'benchmarks', label: 'Bench', icon: Landmark },
  { id: 'forecast', label: 'Forecast', icon: TrendingUp },
];

export default function MobileNav({ page, setPage }) {
  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm border-t border-zinc-200 z-30 px-2 pb-[env(safe-area-inset-bottom)]">
      <div className="flex items-center justify-around py-2">
        {NAV.map(item => {
          const Icon = item.icon;
          const active = page === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setPage(item.id)}
              className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-lg transition-colors ${
                active ? 'text-hb-500' : 'text-zinc-400'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
