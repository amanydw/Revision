import React, { useMemo, useState } from 'react';
import {
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  BookOpen,
  Clock,
  Star,
  MoreVertical,
} from 'lucide-react';
import FilterBar from '../components/FilterBar';
import { TOPICS, REVISION_SYSTEMS } from '../data/sampleData';
import type { FilterState, Topic } from '../types';

interface TopicsProps {
  filters: FilterState;
  onFilterChange: (f: Partial<FilterState>) => void;
}

const SUBJECTS = [
  'Mathematics',
  'Physics',
  'Chemistry',
  'Biology',
  'History',
  'English',
  'Computer Science',
  'Economics',
];

const SYSTEMS = REVISION_SYSTEMS.map((s) => s.id);

const STATUS_STYLE: Record<string, string> = {
  Mastered: 'bg-emerald-50 text-emerald-600 border-emerald-100',
  Learning: 'bg-indigo-50 text-indigo-600 border-indigo-100',
  Due: 'bg-amber-50 text-amber-600 border-amber-100',
  New: 'bg-slate-50 text-slate-500 border-slate-200',
};

const STATUS_DOT: Record<string, string> = {
  Mastered: 'bg-emerald-400',
  Learning: 'bg-indigo-400',
  Due: 'bg-amber-400',
  New: 'bg-slate-400',
};

const DIFF_STYLE: Record<string, string> = {
  Easy: 'text-emerald-500',
  Medium: 'text-amber-500',
  Hard: 'text-red-500',
};

const SortIcon: React.FC<{ field: string; sortBy: string; sortDir: string }> = ({
  field,
  sortBy,
  sortDir,
}) => {
  if (sortBy !== field) return <ChevronsUpDown size={12} className="text-slate-300" />;
  return sortDir === 'asc' ? (
    <ChevronUp size={12} className="text-indigo-500" />
  ) : (
    <ChevronDown size={12} className="text-indigo-500" />
  );
};

const RetentionBar: React.FC<{ value: number }> = ({ value }) => {
  const color =
    value >= 80 ? '#10b981' : value >= 55 ? '#6366f1' : '#f59e0b';
  return (
    <div className="flex items-center gap-2">
      <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${value}%`, background: color }}
        />
      </div>
      <span className="text-xs font-bold" style={{ color }}>
        {value}%
      </span>
    </div>
  );
};

const Topics: React.FC<TopicsProps> = ({ filters, onFilterChange }) => {
  const [page, setPage] = useState(1);
  const PER_PAGE = 10;

  const handleSort = (field: string) => {
    if (filters.sortBy === field) {
      onFilterChange({ sortDir: filters.sortDir === 'asc' ? 'desc' : 'asc' });
    } else {
      onFilterChange({ sortBy: field, sortDir: 'asc' });
    }
    setPage(1);
  };

  const filtered = useMemo(() => {
    let data = [...TOPICS];

    if (filters.subject !== 'All')
      data = data.filter((t) => t.subject === filters.subject);
    if (filters.system !== 'All')
      data = data.filter((t) => t.system === filters.system);
    if (filters.status !== 'All')
      data = data.filter((t) => t.status === filters.status);
    if (filters.difficulty !== 'All')
      data = data.filter((t) => t.difficulty === filters.difficulty);
    if (filters.search)
      data = data.filter(
        (t) =>
          t.name.toLowerCase().includes(filters.search.toLowerCase()) ||
          t.subject.toLowerCase().includes(filters.search.toLowerCase())
      );
    if (filters.dateFrom)
      data = data.filter((t) => t.lastRevised >= filters.dateFrom);
    if (filters.dateTo)
      data = data.filter((t) => t.lastRevised <= filters.dateTo);

    data.sort((a, b) => {
      const dir = filters.sortDir === 'asc' ? 1 : -1;
      const key = filters.sortBy as keyof Topic;
      if (typeof a[key] === 'number' && typeof b[key] === 'number') {
        return (((a[key] as number) - (b[key] as number)) * dir);
      }
      return String(a[key]).localeCompare(String(b[key])) * dir;
    });

    return data;
  }, [filters]);

  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const totalPages = Math.ceil(filtered.length / PER_PAGE);

  const COLS: { key: string; label: string; sortable: boolean }[] = [
    { key: 'name', label: 'Topic', sortable: true },
    { key: 'subject', label: 'Subject', sortable: true },
    { key: 'system', label: 'System', sortable: true },
    { key: 'status', label: 'Status', sortable: true },
    { key: 'difficulty', label: 'Difficulty', sortable: true },
    { key: 'retention', label: 'Retention', sortable: true },
    { key: 'avgScore', label: 'Avg Score', sortable: true },
    { key: 'streak', label: 'Streak', sortable: true },
    { key: 'timeSpent', label: 'Time', sortable: true },
    { key: 'nextDue', label: 'Next Due', sortable: true },
  ];

  return (
    <div className="space-y-5 animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900">Topics</h2>
          <p className="text-sm text-slate-400 font-medium mt-0.5">
            {filtered.length} of {TOPICS.length} topics
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-1 text-xs text-slate-500 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5">
            <Star size={12} className="text-amber-400" />
            <span className="font-semibold">
              {TOPICS.filter((t) => t.status === 'Mastered').length} mastered
            </span>
          </div>
          <button className="bg-indigo-500 hover:bg-indigo-600 text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors cursor-pointer shadow-lg shadow-indigo-200">
            + Add Topic
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <FilterBar
        filters={filters}
        onChange={onFilterChange}
        subjects={SUBJECTS}
        systems={SYSTEMS}
      />

      {/* Summary Chips */}
      <div className="flex flex-wrap gap-2">
        {['Mastered', 'Learning', 'Due', 'New'].map((s) => {
          const count = filtered.filter((t) => t.status === s).length;
          return (
            <button
              key={s}
              onClick={() =>
                onFilterChange({ status: filters.status === s ? 'All' : s })
              }
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                filters.status === s
                  ? STATUS_STYLE[s] + ' scale-105'
                  : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[s]}`}
              />
              {s}
              <span className="opacity-70">{count}</span>
            </button>
          );
        })}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/80">
                {COLS.map((col) => (
                  <th
                    key={col.key}
                    className={`text-left px-4 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wide ${
                      col.sortable ? 'cursor-pointer hover:text-indigo-600' : ''
                    }`}
                    onClick={() => col.sortable && handleSort(col.key)}
                  >
                    <div className="flex items-center gap-1.5">
                      {col.label}
                      {col.sortable && (
                        <SortIcon
                          field={col.key}
                          sortBy={filters.sortBy}
                          sortDir={filters.sortDir}
                        />
                      )}
                    </div>
                  </th>
                ))}
                <th className="px-4 py-3.5" />
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td
                    colSpan={COLS.length + 1}
                    className="px-4 py-16 text-center"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <span className="text-4xl">🔍</span>
                      <p className="text-slate-500 font-semibold text-sm">
                        No topics match your filters
                      </p>
                      <p className="text-slate-400 text-xs">
                        Try adjusting or clearing your filters
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginated.map((topic, i) => (
                  <tr
                    key={topic.id}
                    className={`border-b border-slate-50 hover:bg-indigo-50/30 transition-colors cursor-pointer group ${
                      i % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'
                    }`}
                  >
                    {/* Topic name */}
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center flex-shrink-0">
                          <BookOpen size={13} className="text-indigo-400" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-800 group-hover:text-indigo-600 transition-colors truncate max-w-[140px]">
                            {topic.name}
                          </p>
                          <p className="text-[10px] text-slate-400 font-medium">
                            {topic.repetitions} reps · Ease {topic.ease}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Subject */}
                    <td className="px-4 py-3.5">
                      <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-lg">
                        {topic.subject}
                      </span>
                    </td>

                    {/* System */}
                    <td className="px-4 py-3.5">
                      <span className="text-xs font-bold text-indigo-500 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-lg">
                        {topic.system}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3.5">
                      <span
                        className={`text-xs font-bold px-2.5 py-1 rounded-lg border inline-flex items-center gap-1.5 ${STATUS_STYLE[topic.status]}`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[topic.status]}`}
                        />
                        {topic.status}
                      </span>
                    </td>

                    {/* Difficulty */}
                    <td className="px-4 py-3.5">
                      <span
                        className={`text-xs font-bold ${DIFF_STYLE[topic.difficulty]}`}
                      >
                        {'●'.repeat(
                          topic.difficulty === 'Easy'
                            ? 1
                            : topic.difficulty === 'Medium'
                            ? 2
                            : 3
                        )}
                        {'○'.repeat(
                          topic.difficulty === 'Easy'
                            ? 2
                            : topic.difficulty === 'Medium'
                            ? 1
                            : 0
                        )}{' '}
                        {topic.difficulty}
                      </span>
                    </td>

                    {/* Retention */}
                    <td className="px-4 py-3.5">
                      <RetentionBar value={topic.retention} />
                    </td>

                    {/* Avg Score */}
                    <td className="px-4 py-3.5">
                      <span
                        className={`text-xs font-bold ${
                          topic.avgScore >= 80
                            ? 'text-emerald-500'
                            : topic.avgScore >= 60
                            ? 'text-amber-500'
                            : 'text-red-500'
                        }`}
                      >
                        {topic.avgScore}%
                      </span>
                    </td>

                    {/* Streak */}
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1">
                        <span className="text-base">
                          {topic.streak > 0 ? '🔥' : '❄️'}
                        </span>
                        <span className="text-xs font-bold text-slate-700">
                          {topic.streak}d
                        </span>
                      </div>
                    </td>

                    {/* Time */}
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1 text-xs text-slate-500 font-medium">
                        <Clock size={11} />
                        {topic.timeSpent >= 60
                          ? `${Math.round(topic.timeSpent / 60)}h`
                          : `${topic.timeSpent}m`}
                      </div>
                    </td>

                    {/* Next Due */}
                    <td className="px-4 py-3.5">
                      <span
                        className={`text-xs font-semibold ${
                          topic.nextDue <= new Date().toISOString().split('T')[0]
                            ? 'text-red-500'
                            : 'text-slate-500'
                        }`}
                      >
                        {topic.nextDue}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3.5">
                      <button className="w-7 h-7 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer">
                        <MoreVertical size={14} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-3.5 border-t border-slate-100 bg-slate-50/50">
            <span className="text-xs text-slate-500 font-medium">
              Page {page} of {totalPages} · {filtered.length} results
            </span>
            <div className="flex items-center gap-1.5">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className="w-8 h-8 rounded-lg border border-slate-200 text-slate-600 text-xs font-bold disabled:opacity-40 hover:bg-slate-100 transition-colors cursor-pointer disabled:cursor-not-allowed"
              >
                ‹
              </button>
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                const p =
                  totalPages <= 5
                    ? i + 1
                    : page <= 3
                    ? i + 1
                    : page >= totalPages - 2
                    ? totalPages - 4 + i
                    : page - 2 + i;
                return (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`w-8 h-8 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                      p === page
                        ? 'bg-indigo-500 text-white shadow-md shadow-indigo-200'
                        : 'border border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {p}
                  </button>
                );
              })}
              <button
                disabled={page === totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="w-8 h-8 rounded-lg border border-slate-200 text-slate-600 text-xs font-bold disabled:opacity-40 hover:bg-slate-100 transition-colors cursor-pointer disabled:cursor-not-allowed"
              >
                ›
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Topics;
