import React from 'react';
import { LayoutDashboard, BookOpen, BarChart3, Cpu, CalendarDays } from 'lucide-react';
import type { Tab } from '../types';

interface BottomNavProps {
  active: Tab;
  onChange: (tab: Tab) => void;
}

const TABS: { id: Tab; label: string; icon: React.FC<{ size?: number; className?: string }> }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'topics', label: 'Topics', icon: BookOpen },
  { id: 'stats', label: 'Stats', icon: BarChart3 },
  { id: 'systems', label: 'Systems', icon: Cpu },
  { id: 'schedule', label: 'Schedule', icon: CalendarDays },
];

const BottomNav: React.FC<BottomNavProps> = ({ active, onChange }) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/98 backdrop-blur-2xl border-t border-slate-100/80 safe-bottom shadow-lg shadow-slate-900/5">
      <div className="flex items-stretch justify-around max-w-lg mx-auto">
        {TABS.map((tab) => {
          const isActive = tab.id === active;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={`flex flex-col items-center justify-center gap-1 flex-1 py-2.5 px-1 relative transition-all duration-200 cursor-pointer ${
                isActive ? '' : 'opacity-60 hover:opacity-80'
              }`}
            >
              {/* Active indicator */}
              {isActive && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-indigo-500 rounded-full" />
              )}

              {/* Icon container */}
              <div
                className={`w-10 h-7 rounded-xl flex items-center justify-center transition-all duration-200 ${
                  isActive
                    ? 'bg-indigo-50'
                    : 'bg-transparent'
                }`}
              >
                <Icon
                  size={20}
                  className={`transition-colors duration-200 ${
                    isActive ? 'text-indigo-600' : 'text-slate-500'
                  }`}
                />
              </div>

              <span
                className={`text-[10px] font-semibold transition-colors duration-200 leading-none ${
                  isActive ? 'text-indigo-600' : 'text-slate-500'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
