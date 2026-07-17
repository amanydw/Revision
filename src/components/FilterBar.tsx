import React from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import type { FilterState } from '../types';

interface FilterBarProps {
  filters: FilterState;
  onChange: (f: Partial<FilterState>) => void;
  subjects: string[];
  systems: string[];
  showSystemFilter?: boolean;
}

const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onChange,
  subjects,
  systems,
  showSystemFilter = true,
}) => {
  const hasActive =
    filters.subject !== 'All' ||
    filters.system !== 'All' ||
    filters.status !== 'All' ||
    filters.difficulty !== 'All' ||
    filters.search !== '';

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 space-y-3">
      {/* Search + clear */}
      <div className="flex gap-3">
        <div className="flex-1 flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5">
          <Search size={14} className="text-slate-400 flex-shrink-0" />
          <input
            type="text"
            placeholder="Search topics..."
            value={filters.search}
            onChange={(e) => onChange({ search: e.target.value })}
            className="bg-transparent text-sm text-slate-700 placeholder-slate-400 outline-none flex-1 font-medium"
          />
          {filters.search && (
            <button
              onClick={() => onChange({ search: '' })}
              className="text-slate-400 hover:text-slate-600"
            >
              <X size={13} />
            </button>
          )}
        </div>

        {hasActive && (
          <button
            onClick={() =>
              onChange({
                subject: 'All',
                system: 'All',
                status: 'All',
                difficulty: 'All',
                search: '',
              })
            }
            className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-50 border border-indigo-100 text-indigo-600 text-xs font-semibold rounded-xl hover:bg-indigo-100 transition-colors"
          >
            <X size={12} />
            Clear
          </button>
        )}
      </div>

      {/* Filter chips row */}
      <div className="flex flex-wrap gap-2 items-center">
        <div className="flex items-center gap-1.5 text-slate-400">
          <SlidersHorizontal size={13} />
          <span className="text-xs font-semibold">Filter:</span>
        </div>

        {/* Subject */}
        <select
          value={filters.subject}
          onChange={(e) => onChange({ subject: e.target.value })}
          className="text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 outline-none cursor-pointer hover:border-indigo-300 transition-colors"
        >
          <option value="All">All Subjects</option>
          {subjects.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        {/* System */}
        {showSystemFilter && (
          <select
            value={filters.system}
            onChange={(e) => onChange({ system: e.target.value })}
            className="text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 outline-none cursor-pointer hover:border-indigo-300 transition-colors"
          >
            <option value="All">All Systems</option>
            {systems.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        )}

        {/* Status */}
        <select
          value={filters.status}
          onChange={(e) => onChange({ status: e.target.value })}
          className="text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 outline-none cursor-pointer hover:border-indigo-300 transition-colors"
        >
          <option value="All">All Status</option>
          <option value="Mastered">Mastered</option>
          <option value="Learning">Learning</option>
          <option value="Due">Due</option>
          <option value="New">New</option>
        </select>

        {/* Difficulty */}
        <select
          value={filters.difficulty}
          onChange={(e) => onChange({ difficulty: e.target.value })}
          className="text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 outline-none cursor-pointer hover:border-indigo-300 transition-colors"
        >
          <option value="All">All Difficulty</option>
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>

        {/* Date range */}
        <div className="flex items-center gap-1.5">
          <input
            type="date"
            value={filters.dateFrom}
            onChange={(e) => onChange({ dateFrom: e.target.value })}
            className="text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 outline-none cursor-pointer hover:border-indigo-300 transition-colors"
          />
          <span className="text-xs text-slate-400 font-medium">→</span>
          <input
            type="date"
            value={filters.dateTo}
            onChange={(e) => onChange({ dateTo: e.target.value })}
            className="text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 outline-none cursor-pointer hover:border-indigo-300 transition-colors"
          />
        </div>
      </div>

      {/* Active filter count */}
      {hasActive && (
        <div className="flex items-center gap-2">
          <span className="text-xs text-indigo-600 font-semibold">
            Filters active
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
        </div>
      )}
    </div>
  );
};

export default FilterBar;
