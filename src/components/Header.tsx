import React from 'react';
import { Bell, Search, Moon, Sun, BookOpen } from 'lucide-react';

interface HeaderProps {
  darkMode: boolean;
  toggleDark: () => void;
  streak: number;
}

const Header: React.FC<HeaderProps> = ({ darkMode, toggleDark, streak }) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/98 backdrop-blur-2xl border-b border-slate-100/80 shadow-sm shadow-slate-200/50">
      <div className="flex items-center justify-between px-4 md:px-6 h-16 max-w-7xl mx-auto w-full">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-200">
            <BookOpen size={18} className="text-white" strokeWidth={2.5} />
          </div>
          <div className="flex flex-col">
            <span className="text-[15px] font-800 text-slate-900 leading-tight tracking-tight font-extrabold">
              RevisionIQ
            </span>
            <span className="text-[10px] text-indigo-500 font-semibold leading-tight tracking-wider uppercase">
              Smart Study Tracker
            </span>
          </div>
        </div>

        {/* Center: Search (desktop) */}
        <div className="hidden md:flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 w-64">
          <Search size={15} className="text-slate-400" />
          <input
            type="text"
            placeholder="Search topics..."
            className="bg-transparent text-sm text-slate-700 placeholder-slate-400 outline-none flex-1 font-medium"
          />
          <kbd className="text-[10px] text-slate-400 bg-slate-200 px-1.5 py-0.5 rounded font-medium">⌘K</kbd>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          {/* Streak */}
          <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-100 rounded-xl px-3 py-1.5">
            <span className="streak-fire text-lg">🔥</span>
            <span className="text-sm font-bold text-amber-600">{streak}</span>
            <span className="text-xs text-amber-500 hidden sm:block">day streak</span>
          </div>

          {/* Dark mode toggle */}
          <button
            onClick={toggleDark}
            className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors cursor-pointer"
            title="Toggle theme"
          >
            {darkMode ? (
              <Sun size={16} className="text-amber-500" />
            ) : (
              <Moon size={16} className="text-slate-600" />
            )}
          </button>

          {/* Notifications */}
          <button className="relative w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors cursor-pointer">
            <Bell size={16} className="text-slate-600" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-500 rounded-full border-2 border-white" />
          </button>

          {/* Avatar */}
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center cursor-pointer shadow-md shadow-indigo-100">
            <span className="text-white text-sm font-bold">AS</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
