import React, { useMemo, useState } from 'react';
import {
  CalendarDays,
  Clock,
  CheckCircle2,
  Circle,
  ChevronLeft,
  ChevronRight,
  Flame,
  BookOpen,
  Target,
  AlertCircle,
} from 'lucide-react';
import { TOPICS, DAILY_ACTIVITY } from '../data/sampleData';
import type { Topic } from '../types';

// ── Helpers ─────────────────────────────────────────────────────────────────
function formatDate(d: Date) {
  return d.toISOString().split('T')[0];
}

function addDays(d: Date, n: number) {
  const copy = new Date(d);
  copy.setDate(copy.getDate() + n);
  return copy;
}

function isSameDay(a: string, b: string) {
  return a === b;
}

const DAYS_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

// ── Calendar Mini ─────────────────────────────────────────────────────────────
const MiniCalendar: React.FC<{
  selectedDate: string;
  onSelect: (d: string) => void;
  dueDates: Set<string>;
}> = ({ selectedDate, onSelect, dueDates }) => {
  const [viewDate, setViewDate] = useState(new Date());

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const today = formatDate(new Date());

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
      {/* Month navigation */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setViewDate(new Date(year, month - 1, 1))}
          className="w-8 h-8 rounded-xl hover:bg-slate-100 flex items-center justify-center text-slate-500 transition-colors cursor-pointer"
        >
          <ChevronLeft size={16} />
        </button>
        <span className="text-sm font-bold text-slate-800">
          {MONTHS[month]} {year}
        </span>
        <button
          onClick={() => setViewDate(new Date(year, month + 1, 1))}
          className="w-8 h-8 rounded-xl hover:bg-slate-100 flex items-center justify-center text-slate-500 transition-colors cursor-pointer"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 mb-2">
        {DAYS_SHORT.map((d) => (
          <div
            key={d}
            className="text-center text-[10px] font-bold text-slate-400 py-1"
          >
            {d}
          </div>
        ))}
      </div>

      {/* Cells */}
      <div className="grid grid-cols-7 gap-1">
        {cells.map((day, i) => {
          if (!day) return <div key={i} />;
          const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          const isToday = dateStr === today;
          const isSelected = dateStr === selectedDate;
          const hasDue = dueDates.has(dateStr);
          const isPast = dateStr < today;

          return (
            <button
              key={i}
              onClick={() => onSelect(dateStr)}
              className={`relative aspect-square flex items-center justify-center rounded-xl text-xs font-bold transition-all cursor-pointer ${
                isSelected
                  ? 'bg-indigo-500 text-white shadow-md shadow-indigo-200'
                  : isToday
                  ? 'bg-indigo-50 text-indigo-600 border border-indigo-200'
                  : isPast
                  ? 'text-slate-400 hover:bg-slate-50'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              {day}
              {hasDue && !isSelected && (
                <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-amber-400" />
              )}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-3 mt-3 pt-3 border-t border-slate-100">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-indigo-500" />
          <span className="text-[10px] text-slate-500 font-medium">Selected</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-amber-400" />
          <span className="text-[10px] text-slate-500 font-medium">Due reviews</span>
        </div>
      </div>
    </div>
  );
};

// ── Topic Review Card ─────────────────────────────────────────────────────────
const ReviewCard: React.FC<{
  topic: Topic;
  done: boolean;
  onToggle: () => void;
}> = ({ topic, done, onToggle }) => {
  const STATUS_COLOR: Record<string, string> = {
    Mastered: '#10b981',
    Learning: '#6366f1',
    Due: '#f59e0b',
    New: '#94a3b8',
  };

  const DIFF_DOT: Record<string, string> = {
    Easy: 'bg-emerald-400',
    Medium: 'bg-amber-400',
    Hard: 'bg-red-400',
  };

  return (
    <div
      className={`flex items-center gap-3 p-3.5 rounded-xl border transition-all cursor-pointer group ${
        done
          ? 'bg-emerald-50 border-emerald-100 opacity-70'
          : 'bg-white border-slate-100 hover:border-indigo-200 hover:shadow-sm'
      }`}
      onClick={onToggle}
    >
      {/* Checkbox */}
      <button className="flex-shrink-0 transition-colors">
        {done ? (
          <CheckCircle2 size={20} className="text-emerald-500" />
        ) : (
          <Circle size={20} className="text-slate-300 group-hover:text-indigo-400" />
        )}
      </button>

      {/* Topic Icon */}
      <div className="w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center flex-shrink-0">
        <BookOpen size={14} className="text-slate-400" />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p
          className={`text-sm font-bold truncate ${
            done ? 'line-through text-slate-400' : 'text-slate-800'
          }`}
        >
          {topic.name}
        </p>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-[10px] text-slate-400 font-medium">
            {topic.subject}
          </span>
          <span className="text-[10px] font-bold text-indigo-500">
            {topic.system}
          </span>
          <span
            className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${DIFF_DOT[topic.difficulty]}`}
          />
          <span className="text-[10px] text-slate-400 font-medium">
            {topic.difficulty}
          </span>
        </div>
      </div>

      {/* Right side */}
      <div className="flex flex-col items-end gap-1 flex-shrink-0">
        <span
          className="text-[10px] font-bold px-2 py-0.5 rounded-lg"
          style={{
            color: STATUS_COLOR[topic.status],
            background: STATUS_COLOR[topic.status] + '15',
          }}
        >
          {topic.status}
        </span>
        <div className="flex items-center gap-1 text-[10px] text-slate-400 font-medium">
          <Clock size={9} />
          ~{Math.max(5, Math.round(topic.timeSpent / topic.totalSessions))}m
        </div>
      </div>
    </div>
  );
};

// ── MAIN SCHEDULE ─────────────────────────────────────────────────────────────
const Schedule: React.FC = () => {
  const today = formatDate(new Date());
  const [selectedDate, setSelectedDate] = useState(today);
  const [done, setDone] = useState<Set<string>>(new Set());

  // Topics due on selected date
  const topicsForDay = useMemo(() => {
    return TOPICS.filter((t) => {
      const due = t.nextDue;
      // Show if due on or before selected date
      return due <= selectedDate || isSameDay(due, selectedDate);
    }).slice(0, 12);
  }, [selectedDate]);

  // All due dates for calendar dots
  const dueDates = useMemo(() => {
    const set = new Set<string>();
    TOPICS.forEach((t) => set.add(t.nextDue));
    return set;
  }, []);

  const toggleDone = (id: string) => {
    setDone((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const doneCount = topicsForDay.filter((t) => done.has(t.id)).length;
  const progress =
    topicsForDay.length > 0
      ? Math.round((doneCount / topicsForDay.length) * 100)
      : 0;

  // Activity for selected date
  const dayActivity = DAILY_ACTIVITY.find((d) => d.date === selectedDate);

  // 7-day agenda
  const agenda = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const date = formatDate(addDays(new Date(today), i - 2));
      const count = TOPICS.filter((t) => t.nextDue === date).length;
      const activity = DAILY_ACTIVITY.find((d) => d.date === date);
      return { date, count, activity };
    });
  }, [today]);

  // Upcoming milestones
  const milestones = useMemo(() => {
    const overdueCount = TOPICS.filter((t) => t.nextDue < today && t.status !== 'Mastered').length;
    const dueTodayCount = TOPICS.filter((t) => t.nextDue === today).length;
    const dueThisWeekCount = TOPICS.filter((t) => {
      const nextWeek = formatDate(addDays(new Date(today), 7));
      return t.nextDue > today && t.nextDue <= nextWeek;
    }).length;
    return { overdueCount, dueTodayCount, dueThisWeekCount };
  }, [today]);

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Header */}
      <div>
        <h2 className="text-xl font-extrabold text-slate-900">Schedule</h2>
        <p className="text-sm text-slate-400 font-medium mt-0.5">
          Your revision timetable & upcoming reviews
        </p>
      </div>

      {/* Alert cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Overdue */}
        <div className="bg-red-50 border border-red-100 rounded-2xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0">
            <AlertCircle size={18} className="text-red-500" />
          </div>
          <div>
            <p className="text-xs font-semibold text-red-400">Overdue</p>
            <p className="text-xl font-extrabold text-red-600">
              {milestones.overdueCount}
            </p>
            <p className="text-[10px] text-red-400 font-medium">topics need review</p>
          </div>
        </div>

        {/* Due today */}
        <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
            <CalendarDays size={18} className="text-amber-500" />
          </div>
          <div>
            <p className="text-xs font-semibold text-amber-400">Due Today</p>
            <p className="text-xl font-extrabold text-amber-600">
              {milestones.dueTodayCount}
            </p>
            <p className="text-[10px] text-amber-400 font-medium">topics scheduled</p>
          </div>
        </div>

        {/* This week */}
        <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center flex-shrink-0">
            <Target size={18} className="text-indigo-500" />
          </div>
          <div>
            <p className="text-xs font-semibold text-indigo-400">This Week</p>
            <p className="text-xl font-extrabold text-indigo-600">
              {milestones.dueThisWeekCount}
            </p>
            <p className="text-[10px] text-indigo-400 font-medium">upcoming reviews</p>
          </div>
        </div>
      </div>

      {/* 7-day horizontal agenda */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
        <h3 className="text-sm font-bold text-slate-900 mb-4">7-Day Overview</h3>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {agenda.map(({ date, count, activity }) => {
            const d = new Date(date);
            const isToday = date === today;
            const isSelected = date === selectedDate;
            const dayName = DAYS_SHORT[d.getDay()];
            const dayNum = d.getDate();
            const hasActivity = (activity?.cardsReviewed ?? 0) > 0;

            return (
              <button
                key={date}
                onClick={() => setSelectedDate(date)}
                className={`flex-shrink-0 flex flex-col items-center gap-1.5 px-4 py-3 rounded-2xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-indigo-500 border-indigo-500 shadow-lg shadow-indigo-200'
                    : isToday
                    ? 'bg-indigo-50 border-indigo-200'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <span
                  className={`text-[10px] font-bold uppercase tracking-wide ${
                    isSelected ? 'text-indigo-200' : 'text-slate-400'
                  }`}
                >
                  {dayName}
                </span>
                <span
                  className={`text-lg font-extrabold leading-none ${
                    isSelected ? 'text-white' : isToday ? 'text-indigo-600' : 'text-slate-800'
                  }`}
                >
                  {dayNum}
                </span>
                {count > 0 && (
                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                      isSelected
                        ? 'bg-white/20 text-white'
                        : 'bg-amber-100 text-amber-600'
                    }`}
                  >
                    {count}
                  </span>
                )}
                {hasActivity && count === 0 && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                )}
                {!hasActivity && count === 0 && (
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main content: Calendar + Review list */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="space-y-4">
          <MiniCalendar
            selectedDate={selectedDate}
            onSelect={setSelectedDate}
            dueDates={dueDates}
          />

          {/* Day Stats */}
          {dayActivity && (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
              <h4 className="text-sm font-bold text-slate-900 mb-3">
                {selectedDate === today ? "Today's Stats" : `Stats for ${selectedDate}`}
              </h4>
              <div className="space-y-3">
                {[
                  {
                    label: 'Cards Reviewed',
                    value: dayActivity.cardsReviewed,
                    icon: '🃏',
                    color: '#6366f1',
                  },
                  {
                    label: 'Study Time',
                    value: `${dayActivity.minutesStudied}m`,
                    icon: '⏱️',
                    color: '#10b981',
                  },
                  {
                    label: 'Retention',
                    value: `${dayActivity.retention.toFixed(1)}%`,
                    icon: '🧠',
                    color: '#f59e0b',
                  },
                  {
                    label: 'Score',
                    value: `${dayActivity.score.toFixed(1)}%`,
                    icon: '⭐',
                    color: '#ec4899',
                  },
                ].map((s) => (
                  <div key={s.label} className="flex items-center gap-3">
                    <span className="text-base">{s.icon}</span>
                    <div className="flex-1">
                      <p className="text-[10px] text-slate-400 font-semibold">
                        {s.label}
                      </p>
                      <p
                        className="text-sm font-extrabold"
                        style={{ color: s.color }}
                      >
                        {s.value}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Review List */}
        <div className="lg:col-span-2 space-y-4">
          {/* Progress */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  {selectedDate === today ? "Today's Reviews" : `Reviews for ${selectedDate}`}
                </h3>
                <p className="text-xs text-slate-400 font-medium mt-0.5">
                  {doneCount}/{topicsForDay.length} completed
                </p>
              </div>
              <div className="flex items-center gap-2">
                {doneCount === topicsForDay.length && topicsForDay.length > 0 && (
                  <div className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-100 text-emerald-600 text-xs font-bold px-3 py-1.5 rounded-xl">
                    <Flame size={12} />
                    All done! 🎉
                  </div>
                )}
                <span className="text-2xl font-extrabold text-indigo-500">
                  {progress}%
                </span>
              </div>
            </div>

            {/* Progress bar */}
            <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden mb-1">
              <div
                className="h-full rounded-full bg-gradient-to-r from-indigo-400 to-violet-500 transition-all duration-700"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-[10px] text-slate-400 font-medium">
              {topicsForDay.length - doneCount} topics remaining
            </p>
          </div>

          {/* Topic list */}
          <div className="space-y-2">
            {topicsForDay.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-10 flex flex-col items-center gap-3">
                <span className="text-5xl">🎉</span>
                <p className="text-slate-600 font-bold text-sm">
                  No reviews scheduled for this day
                </p>
                <p className="text-slate-400 text-xs text-center max-w-xs">
                  All caught up! Pick a different date or add new topics to
                  review.
                </p>
              </div>
            ) : (
              topicsForDay.map((topic) => (
                <ReviewCard
                  key={topic.id}
                  topic={topic}
                  done={done.has(topic.id)}
                  onToggle={() => toggleDone(topic.id)}
                />
              ))
            )}
          </div>

          {/* Start session button */}
          {topicsForDay.length > 0 && (
            <button className="w-full bg-gradient-to-r from-indigo-500 to-violet-500 text-white py-3.5 rounded-2xl font-bold text-sm shadow-xl shadow-indigo-200 hover:shadow-indigo-300 hover:scale-[1.02] transition-all cursor-pointer">
              🚀 Start Study Session ({topicsForDay.length - doneCount} remaining)
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Schedule;
