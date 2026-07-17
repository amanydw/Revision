import React, { useMemo } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { Clock, Target, Zap, TrendingUp, ChevronRight, CalendarDays, Award } from 'lucide-react';
import KPICard from '../components/KPICard';
import {
  DAILY_ACTIVITY,
  SUBJECT_STATS,
  TOPICS,
  computeKPIs,
  UPCOMING_REVIEWS,
  WEEKLY_DATA,
} from '../data/sampleData';
import type { FilterState } from '../types';

interface DashboardProps {
  filters: FilterState;
  onTabChange: (tab: string) => void;
}

const STATUS_COLORS: Record<string, string> = {
  Mastered: '#10b981',
  Learning: '#6366f1',
  Due: '#f59e0b',
  New: '#94a3b8',
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-slate-100 rounded-xl shadow-xl p-3 text-xs">
        <p className="font-semibold text-slate-700 mb-2">{label}</p>
        {payload.map((p: any, i: number) => (
          <div key={i} className="flex items-center gap-2 mt-1">
            <span
              className="w-2 h-2 rounded-full flex-shrink-0"
              style={{ background: p.color }}
            />
            <span className="text-slate-500">{p.name}:</span>
            <span className="font-bold text-slate-800">{p.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const Dashboard: React.FC<DashboardProps> = ({ filters, onTabChange }) => {
  const kpi = useMemo(() => computeKPIs(), []);

  // Filter daily activity by date range
  const filteredActivity = useMemo(() => {
    let data = DAILY_ACTIVITY;
    if (filters.dateFrom)
      data = data.filter((d) => d.date >= filters.dateFrom);
    if (filters.dateTo)
      data = data.filter((d) => d.date <= filters.dateTo);
    return data.slice(-30); // last 30 days for chart
  }, [filters.dateFrom, filters.dateTo]);

  // Filter subject stats by subject filter
  const filteredSubjectStats = useMemo(() => {
    if (filters.subject !== 'All') {
      return SUBJECT_STATS.filter((s) => s.subject === filters.subject);
    }
    return SUBJECT_STATS;
  }, [filters.subject]);

  // Status distribution
  const statusDist = useMemo(() => {
    let topics = TOPICS;
    if (filters.subject !== 'All')
      topics = topics.filter((t) => t.subject === filters.subject);
    if (filters.difficulty !== 'All')
      topics = topics.filter((t) => t.difficulty === filters.difficulty);

    const counts: Record<string, number> = {};
    topics.forEach((t) => {
      counts[t.status] = (counts[t.status] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [filters.subject, filters.difficulty]);

  const kpiCards = [
    {
      label: 'Cards Reviewed',
      value: kpi.recentCards.toLocaleString(),
      sub: 'Last 14 days',
      trend: kpi.cardsTrend,
      icon: '🃏',
      color: '#6366f1',
      bg: '#eef2ff',
    },
    {
      label: 'Avg Retention',
      value: `${kpi.avgRetention}%`,
      sub: 'Across all topics',
      trend: kpi.retentionTrend,
      icon: '🧠',
      color: '#10b981',
      bg: '#ecfdf5',
    },
    {
      label: 'Topics Mastered',
      value: `${kpi.mastered}/${kpi.totalTopics}`,
      sub: `${kpi.masteredPercent}% completion`,
      trend: kpi.masteredTrend,
      icon: '🏆',
      color: '#f59e0b',
      bg: '#fffbeb',
    },
    {
      label: 'Study Streak',
      value: `${kpi.streak}d`,
      sub: 'Keep it going! 🔥',
      trend: 0,
      icon: '⚡',
      color: '#ef4444',
      bg: '#fef2f2',
    },
  ];

  const chartActivity = filteredActivity.map((d) => ({
    date: d.date.slice(5),
    Cards: d.cardsReviewed,
    Retention: d.retention,
    Score: d.score,
  }));

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Welcome Hero */}
      <div className="bg-gradient-to-br from-indigo-500 via-indigo-600 to-violet-700 rounded-2xl p-6 text-white shadow-2xl shadow-indigo-300/40 relative overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute top-0 right-0 w-56 h-56 bg-white/5 rounded-full -translate-y-1/3 translate-x-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-12 w-40 h-40 bg-violet-400/20 rounded-full translate-y-1/2 pointer-events-none" />
        <div className="absolute top-4 right-24 w-20 h-20 bg-indigo-300/10 rounded-full pointer-events-none" />

        <div className="relative">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 bg-white/15 border border-white/20 rounded-full px-3 py-1 mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-semibold text-white/90">Active Session</span>
              </div>
              <h2 className="text-2xl font-extrabold mb-2 leading-tight">
                {kpi.due} topics due today
              </h2>
              <p className="text-indigo-100 text-sm leading-relaxed max-w-xs">
                Retention rate:{' '}
                <span className="font-bold text-white bg-white/15 px-1.5 py-0.5 rounded-md">
                  {kpi.recentRetention}%
                </span>{' '}
                · Streak:{' '}
                <span className="font-bold text-white">
                  🔥 {kpi.streak} days
                </span>
              </p>
            </div>
            <div className="flex-shrink-0 text-6xl drop-shadow-lg">📚</div>
          </div>

          {/* Progress bar */}
          <div className="mt-4 mb-4">
            <div className="flex items-center justify-between text-xs text-indigo-200 mb-1.5">
              <span className="font-medium">Daily Goal Progress</span>
              <span className="font-bold text-white">{kpi.masteredPercent}%</span>
            </div>
            <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-white rounded-full transition-all"
                style={{ width: `${kpi.masteredPercent}%` }}
              />
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => onTabChange('topics')}
              className="bg-white text-indigo-600 text-sm font-bold px-5 py-2.5 rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105 cursor-pointer"
            >
              🚀 Start Revision
            </button>
            <button
              onClick={() => onTabChange('schedule')}
              className="bg-white/15 hover:bg-white/25 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-all cursor-pointer border border-white/25 backdrop-blur-sm"
            >
              View Schedule
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map((card, i) => (
          <KPICard key={card.label} {...card} delay={i * 80} />
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity Area Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Study Activity
              </h3>
              <p className="text-xs text-slate-400 font-medium mt-0.5">
                Cards reviewed per day
              </p>
            </div>
            <div className="flex items-center gap-1.5">
              {['Cards', 'Retention'].map((k) => (
                <span
                  key={k}
                  className="text-xs bg-slate-50 border border-slate-200 text-slate-600 font-semibold px-2.5 py-1 rounded-lg"
                >
                  {k}
                </span>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={210}>
            <AreaChart
              data={chartActivity}
              margin={{ top: 5, right: 5, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorCards" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorRetention" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 10 }}
                tickLine={false}
                axisLine={false}
                interval={4}
              />
              <YAxis
                tick={{ fontSize: 10 }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="Cards"
                stroke="#6366f1"
                strokeWidth={2.5}
                fill="url(#colorCards)"
                dot={false}
                activeDot={{ r: 5, fill: '#6366f1', stroke: '#fff', strokeWidth: 2 }}
              />
              <Area
                type="monotone"
                dataKey="Retention"
                stroke="#10b981"
                strokeWidth={2.5}
                fill="url(#colorRetention)"
                dot={false}
                activeDot={{ r: 5, fill: '#10b981', stroke: '#fff', strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Status Donut */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <div className="mb-4">
            <h3 className="text-base font-bold text-slate-900">
              Topic Status
            </h3>
            <p className="text-xs text-slate-400 font-medium mt-0.5">
              Distribution overview
            </p>
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie
                data={statusDist}
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={70}
                paddingAngle={3}
                dataKey="value"
              >
                {statusDist.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={STATUS_COLORS[entry.name] || '#94a3b8'}
                    stroke="none"
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-2 mt-1">
            {statusDist.map((d) => (
              <div key={d.name} className="flex items-center gap-1.5">
                <span
                  className="w-2.5 h-2.5 rounded-sm flex-shrink-0"
                  style={{ background: STATUS_COLORS[d.name] }}
                />
                <span className="text-xs text-slate-500 font-medium truncate">
                  {d.name}
                </span>
                <span className="text-xs font-bold text-slate-700 ml-auto">
                  {d.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Weekly Bar + Subject Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Comparison */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Weekly Comparison
              </h3>
              <p className="text-xs text-slate-400 font-medium mt-0.5">
                This week vs last week
              </p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart
              data={WEEKLY_DATA}
              margin={{ top: 5, right: 5, left: -20, bottom: 0 }}
              barGap={4}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="day"
                tick={{ fontSize: 11 }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                tick={{ fontSize: 10 }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="thisWeek"
                name="This Week"
                fill="#6366f1"
                radius={[5, 5, 0, 0]}
                maxBarSize={20}
              />
              <Bar
                dataKey="lastWeek"
                name="Last Week"
                fill="#e0e7ff"
                radius={[5, 5, 0, 0]}
                maxBarSize={20}
              />
            </BarChart>
          </ResponsiveContainer>
          <div className="flex items-center gap-4 mt-2">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-indigo-500" />
              <span className="text-xs text-slate-500 font-medium">This Week</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-indigo-100" />
              <span className="text-xs text-slate-500 font-medium">Last Week</span>
            </div>
          </div>
        </div>

        {/* Subject Retention */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Subject Retention
              </h3>
              <p className="text-xs text-slate-400 font-medium mt-0.5">
                Average retention by subject
              </p>
            </div>
            <button
              onClick={() => onTabChange('stats')}
              className="text-xs text-indigo-500 font-semibold flex items-center gap-1 hover:text-indigo-700 cursor-pointer"
            >
              Details <ChevronRight size={12} />
            </button>
          </div>
          <div className="space-y-3">
            {filteredSubjectStats.slice(0, 5).map((s) => (
              <div key={s.subject}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-slate-700 truncate max-w-[140px]">
                    {s.subject}
                  </span>
                  <span
                    className="text-xs font-bold"
                    style={{ color: s.color }}
                  >
                    {s.retention}%
                  </span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${s.retention}%`,
                      background: s.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Upcoming Reviews */}
        <div className="md:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center">
                <CalendarDays size={16} className="text-amber-500" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Due for Review</h3>
                <p className="text-xs text-slate-400 font-medium">
                  Next up in queue
                </p>
              </div>
            </div>
            <button
              onClick={() => onTabChange('schedule')}
              className="text-xs text-indigo-500 font-semibold flex items-center gap-1 hover:text-indigo-700 cursor-pointer"
            >
              View all <ChevronRight size={12} />
            </button>
          </div>
          <div className="space-y-2.5">
            {UPCOMING_REVIEWS.slice(0, 4).map((topic) => (
              <div
                key={topic.id}
                className="flex items-center gap-3 p-2.5 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer group"
              >
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center text-sm flex-shrink-0"
                  style={{
                    background:
                      topic.status === 'Due' ? '#fffbeb' : '#eef2ff',
                  }}
                >
                  {topic.status === 'Due' ? '⏰' : '📖'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-slate-800 truncate">
                    {topic.name}
                  </p>
                  <p className="text-xs text-slate-400 font-medium">
                    {topic.subject} · {topic.system}
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span
                    className={`text-xs font-semibold px-2 py-0.5 rounded-lg ${
                      topic.status === 'Due'
                        ? 'bg-amber-50 text-amber-600'
                        : 'bg-indigo-50 text-indigo-600'
                    }`}
                  >
                    {topic.nextDue}
                  </span>
                  <ChevronRight
                    size={13}
                    className="text-slate-300 group-hover:text-slate-500"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center">
              <Award size={16} className="text-indigo-500" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Quick Stats</h3>
              <p className="text-xs text-slate-400 font-medium">Overall progress</p>
            </div>
          </div>
          <div className="space-y-4">
            {[
              {
                label: 'Total Study Time',
                value: `${Math.round(
                  TOPICS.reduce((a, t) => a + t.timeSpent, 0) / 60
                )}h`,
                icon: <Clock size={14} className="text-indigo-500" />,
                bg: 'bg-indigo-50',
              },
              {
                label: 'Avg Daily Score',
                value: `${(
                  DAILY_ACTIVITY.filter((d) => d.score > 0).reduce(
                    (a, d) => a + d.score,
                    0
                  ) /
                  DAILY_ACTIVITY.filter((d) => d.score > 0).length
                ).toFixed(1)}%`,
                icon: <Target size={14} className="text-emerald-500" />,
                bg: 'bg-emerald-50',
              },
              {
                label: 'Best Streak',
                value: `${kpi.streak + 3}d`,
                icon: <Zap size={14} className="text-amber-500" />,
                bg: 'bg-amber-50',
              },
              {
                label: 'Systems Used',
                value: `${
                  new Set(TOPICS.map((t) => t.system)).size
                }/10`,
                icon: <TrendingUp size={14} className="text-violet-500" />,
                bg: 'bg-violet-50',
              },
            ].map((stat) => (
              <div key={stat.label} className="flex items-center gap-3">
                <div
                  className={`w-8 h-8 rounded-xl ${stat.bg} flex items-center justify-center flex-shrink-0`}
                >
                  {stat.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-slate-500 font-medium">
                    {stat.label}
                  </p>
                  <p className="text-sm font-extrabold text-slate-800">
                    {stat.value}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Subject Cards strip */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-slate-900">Subject Overview</h3>
          <button
            onClick={() => onTabChange('stats')}
            className="text-xs text-indigo-500 font-semibold flex items-center gap-1 hover:text-indigo-700 cursor-pointer"
          >
            All stats <ChevronRight size={12} />
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {filteredSubjectStats.slice(0, 4).map((s) => (
            <div
              key={s.subject}
              className="bg-white rounded-2xl border border-slate-100 p-4 card-hover shadow-sm cursor-pointer"
            >
              <div
                className="w-2 h-8 rounded-full mb-3"
                style={{ background: s.color }}
              />
              <p className="text-xs font-bold text-slate-700 truncate mb-1">
                {s.subject}
              </p>
              <p
                className="text-xl font-extrabold"
                style={{ color: s.color }}
              >
                {s.retention}%
              </p>
              <p className="text-[10px] text-slate-400 font-medium mt-0.5">
                retention
              </p>
              <div className="mt-2 h-1 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{ width: `${(s.mastered / s.topics) * 100}%`, background: s.color }}
                />
              </div>
              <p className="text-[10px] text-slate-400 font-medium mt-1">
                {s.mastered}/{s.topics} mastered
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
