import React, { useMemo, useState } from 'react';
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
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  LineChart,
  Line,
  ScatterChart,
  Scatter,
  ZAxis,
  Cell,
  PieChart,
  Pie,
  Legend,
  ReferenceLine,
} from 'recharts';
import {
  DAILY_ACTIVITY,
  SUBJECT_STATS,
  SCORE_DISTRIBUTION,
  RADAR_DATA,
  RETENTION_CURVE,
  HEATMAP_DATA,
  TOPICS,
  SUBJECT_COLORS,
} from '../data/sampleData';
import type { FilterState } from '../types';

interface StatsProps {
  filters: FilterState;
  onFilterChange: (f: Partial<FilterState>) => void;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-slate-100 rounded-xl shadow-xl p-3 text-xs min-w-[130px]">
        {label && <p className="font-bold text-slate-700 mb-2 pb-1.5 border-b border-slate-100">{label}</p>}
        {payload.map((p: any, i: number) => (
          <div key={i} className="flex items-center justify-between gap-4 mt-1">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: p.color || p.fill }} />
              <span className="text-slate-500">{p.name}</span>
            </div>
            <span className="font-bold text-slate-800">
              {typeof p.value === 'number' ? p.value.toFixed(1) : p.value}
              {p.unit || ''}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

// Heatmap cell color
function heatColor(value: number): string {
  if (value === 0) return '#f1f5f9';
  if (value < 20) return '#e0e7ff';
  if (value < 40) return '#a5b4fc';
  if (value < 60) return '#818cf8';
  if (value < 80) return '#6366f1';
  return '#4338ca';
}

// ── HEATMAP COMPONENT ─────────────────────────────────────────────────────────
const StudyHeatmap: React.FC = () => {
  const weeks = 26; // show last 26 weeks
  const heatData = HEATMAP_DATA.slice(-weeks * 7);

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const [hovered, setHovered] = useState<{ date: string; value: number } | null>(null);

  const grid: (typeof heatData[0] | null)[][] = [];
  for (let w = 0; w < weeks; w++) {
    const col: (typeof heatData[0] | null)[] = [];
    for (let d = 0; d < 7; d++) {
      col.push(heatData[w * 7 + d] ?? null);
    }
    grid.push(col);
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-bold text-slate-900">Activity Heatmap</h3>
          <p className="text-xs text-slate-400 font-medium mt-0.5">
            Daily study intensity — last 26 weeks
          </p>
        </div>
        {hovered && (
          <div className="text-xs bg-indigo-50 border border-indigo-100 rounded-xl px-3 py-1.5">
            <span className="text-indigo-600 font-bold">{hovered.date}</span>
            <span className="text-slate-500 ml-2">{hovered.value} cards</span>
          </div>
        )}
      </div>

      <div className="overflow-x-auto">
        <div className="flex gap-1 min-w-max">
          {/* Day labels */}
          <div className="flex flex-col gap-1 mr-1">
            <div className="h-3" />
            {days.map((d) => (
              <div key={d} className="h-3 flex items-center">
                <span className="text-[9px] text-slate-400 font-medium w-6">{d}</span>
              </div>
            ))}
          </div>

          {/* Grid */}
          {grid.map((col, wi) => {
            const firstInMonth =
              wi > 0 && col[1] &&
              new Date(col[1].date).getMonth() !==
                new Date(grid[wi - 1][1]?.date ?? '').getMonth();
            const monthLabel = firstInMonth && col[1]
              ? months[new Date(col[1].date).getMonth()]
              : wi === 0
              ? months[new Date(col[1]?.date ?? '').getMonth()]
              : '';

            return (
              <div key={wi} className="flex flex-col gap-1">
                <div className="h-3 flex items-center">
                  <span className="text-[9px] text-slate-400 font-medium whitespace-nowrap">
                    {monthLabel}
                  </span>
                </div>
                {col.map((cell, di) =>
                  cell ? (
                    <div
                      key={di}
                      className="w-3 h-3 rounded-sm cursor-pointer transition-all hover:scale-125 hover:z-10 relative"
                      style={{ background: heatColor(cell.value) }}
                      onMouseEnter={() => setHovered({ date: cell.date, value: cell.value })}
                      onMouseLeave={() => setHovered(null)}
                      title={`${cell.date}: ${cell.value} cards`}
                    />
                  ) : (
                    <div key={di} className="w-3 h-3 rounded-sm bg-slate-100" />
                  )
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-1.5 mt-3">
        <span className="text-[10px] text-slate-400 font-medium">Less</span>
        {[0, 20, 40, 60, 80, 100].map((v) => (
          <div
            key={v}
            className="w-3 h-3 rounded-sm"
            style={{ background: heatColor(v) }}
          />
        ))}
        <span className="text-[10px] text-slate-400 font-medium">More</span>
      </div>
    </div>
  );
};

// ── SCATTER: Difficulty vs Retention ──────────────────────────────────────────
const DifficultyScatter: React.FC = () => {
  const data = TOPICS.map((t) => ({
    x: t.ease,
    y: t.retention,
    z: t.timeSpent,
    name: t.name,
    subject: t.subject,
  }));

  const subjectColors = SUBJECT_COLORS;

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
      <div className="mb-4">
        <h3 className="text-base font-bold text-slate-900">Ease vs Retention</h3>
        <p className="text-xs text-slate-400 font-medium mt-0.5">
          Bubble size = time spent · Color = subject
        </p>
      </div>
      <ResponsiveContainer width="100%" height={260}>
        <ScatterChart margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            type="number"
            dataKey="x"
            name="Ease Factor"
            domain={[1, 4]}
            tick={{ fontSize: 10 }}
            tickLine={false}
            axisLine={false}
            label={{ value: 'Ease Factor', position: 'insideBottom', offset: -2, fontSize: 10, fill: '#94a3b8' }}
          />
          <YAxis
            type="number"
            dataKey="y"
            name="Retention %"
            domain={[0, 100]}
            tick={{ fontSize: 10 }}
            tickLine={false}
            axisLine={false}
          />
          <ZAxis type="number" dataKey="z" range={[30, 200]} />
          <Tooltip
            cursor={{ strokeDasharray: '3 3' }}
            content={({ active, payload }) => {
              if (active && payload?.length) {
                const d = payload[0].payload;
                return (
                  <div className="bg-white border border-slate-100 rounded-xl shadow-xl p-3 text-xs">
                    <p className="font-bold text-slate-800 mb-1">{d.name}</p>
                    <p className="text-slate-500">{d.subject}</p>
                    <p className="text-indigo-600 font-semibold mt-1">
                      Ease: {d.x} · Retention: {d.y}%
                    </p>
                    <p className="text-slate-400">Time: {d.z}m</p>
                  </div>
                );
              }
              return null;
            }}
          />
          {Object.entries(subjectColors).map(([subj, color]) => (
            <Scatter
              key={subj}
              name={subj}
              data={data.filter((d) => d.subject === subj)}
              fill={color}
              fillOpacity={0.75}
            />
          ))}
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
};

// ── MAIN STATS PAGE ───────────────────────────────────────────────────────────
const Stats: React.FC<StatsProps> = ({ filters }) => {
  const [retentionRange, setRetentionRange] = useState<'30' | '60' | '90'>('30');

  const activityData = useMemo(() => {
    const days = parseInt(retentionRange);
    return DAILY_ACTIVITY.slice(-days).map((d) => ({
      date: d.date.slice(5),
      Cards: d.cardsReviewed,
      Score: parseFloat(d.score.toFixed(1)),
      Retention: parseFloat(d.retention.toFixed(1)),
      'New Cards': d.newCards,
    }));
  }, [retentionRange]);

  const filteredSubjectStats = useMemo(() => {
    if (filters.subject !== 'All')
      return SUBJECT_STATS.filter((s) => s.subject === filters.subject);
    return SUBJECT_STATS;
  }, [filters.subject]);

  const subjectBarData = filteredSubjectStats.map((s) => ({
    name: s.subject.replace(' Science', ' Sci.'),
    Mastered: s.mastered,
    Learning: s.topics - s.mastered,
    Retention: s.retention,
    Score: s.score,
  }));

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900">Analytics</h2>
          <p className="text-sm text-slate-400 font-medium mt-0.5">
            Advanced statistics & deep insights
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-xs bg-indigo-50 border border-indigo-100 text-indigo-600 font-bold px-3 py-1.5 rounded-xl">
            📊 {TOPICS.length} topics tracked
          </div>
        </div>
      </div>

      {/* Quick metric strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total Study Time', value: `${Math.round(TOPICS.reduce((a, t) => a + t.timeSpent, 0) / 60)}h`, icon: '⏱️', color: '#6366f1', bg: '#eef2ff' },
          { label: 'Avg Session Score', value: `${(DAILY_ACTIVITY.filter(d => d.score > 0).reduce((a, d) => a + d.score, 0) / DAILY_ACTIVITY.filter(d => d.score > 0).length).toFixed(1)}%`, icon: '🎯', color: '#10b981', bg: '#ecfdf5' },
          { label: 'Cards This Month', value: DAILY_ACTIVITY.slice(-30).reduce((a, d) => a + d.cardsReviewed, 0).toLocaleString(), icon: '🃏', color: '#f59e0b', bg: '#fffbeb' },
          { label: 'Mastery Rate', value: `${((TOPICS.filter(t => t.status === 'Mastered').length / TOPICS.length) * 100).toFixed(0)}%`, icon: '🏆', color: '#ec4899', bg: '#fdf2f8' },
        ].map((m) => (
          <div key={m.label} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex items-center gap-3 card-hover">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0" style={{ background: m.bg }}>
              {m.icon}
            </div>
            <div className="min-w-0">
              <p className="text-[11px] text-slate-400 font-semibold truncate">{m.label}</p>
              <p className="text-lg font-extrabold leading-tight" style={{ color: m.color }}>{m.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Range selector */}
      <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl w-fit">
        {(['30', '60', '90'] as const).map((r) => (
          <button
            key={r}
            onClick={() => setRetentionRange(r)}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              retentionRange === r
                ? 'bg-white text-indigo-600 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {r}d
          </button>
        ))}
      </div>

      {/* Full-width Activity Chart */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Multi-Metric Study Timeline
            </h3>
            <p className="text-xs text-slate-400 font-medium mt-0.5">
              Cards, retention & scores over time
            </p>
          </div>
          <div className="flex items-center gap-2">
            {['Cards', 'Score', 'Retention'].map((k, i) => (
              <div key={k} className="flex items-center gap-1.5">
                <span
                  className="w-3 h-0.5 rounded"
                  style={{
                    background: ['#6366f1', '#10b981', '#f59e0b'][i],
                  }}
                />
                <span className="text-xs text-slate-500 font-medium">{k}</span>
              </div>
            ))}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart
            data={activityData}
            margin={{ top: 5, right: 10, left: -20, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 10 }}
              tickLine={false}
              axisLine={false}
              interval={Math.floor(activityData.length / 8)}
            />
            <YAxis
              yAxisId="left"
              tick={{ fontSize: 10 }}
              tickLine={false}
              axisLine={false}
              domain={[0, 'auto']}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              tick={{ fontSize: 10 }}
              tickLine={false}
              axisLine={false}
              domain={[0, 100]}
            />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine
              yAxisId="right"
              y={80}
              stroke="#e2e8f0"
              strokeDasharray="4 4"
              label={{ value: 'Target 80%', fontSize: 9, fill: '#94a3b8', position: 'insideRight' }}
            />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="Cards"
              stroke="#6366f1"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: '#6366f1', stroke: '#fff', strokeWidth: 2 }}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="Score"
              stroke="#10b981"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: '#10b981', stroke: '#fff', strokeWidth: 2 }}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="Retention"
              stroke="#f59e0b"
              strokeWidth={2}
              dot={false}
              strokeDasharray="5 3"
              activeDot={{ r: 4, fill: '#f59e0b', stroke: '#fff', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Heatmap */}
      <StudyHeatmap />

      {/* Row: Ebbinghaus + Radar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Retention Curve (Ebbinghaus) */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <div className="mb-4">
            <h3 className="text-base font-bold text-slate-900">
              Ebbinghaus Forgetting Curves
            </h3>
            <p className="text-xs text-slate-400 font-medium mt-0.5">
              Memory retention with vs without review systems
            </p>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart
              data={RETENTION_CURVE}
              margin={{ top: 5, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="noReview" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="withSRS" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="withFSRS" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="day"
                tick={{ fontSize: 10 }}
                tickLine={false}
                axisLine={false}
                label={{ value: 'Days', position: 'insideBottom', offset: -2, fontSize: 10, fill: '#94a3b8' }}
              />
              <YAxis
                tick={{ fontSize: 10 }}
                tickLine={false}
                axisLine={false}
                domain={[0, 100]}
                tickFormatter={(v) => `${v}%`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="noReview"
                name="No Review"
                stroke="#ef4444"
                strokeWidth={2}
                fill="url(#noReview)"
                dot={false}
              />
              <Area
                type="monotone"
                dataKey="withSRS"
                name="With SRS"
                stroke="#6366f1"
                strokeWidth={2}
                fill="url(#withSRS)"
                dot={false}
              />
              <Area
                type="monotone"
                dataKey="withFSRS"
                name="With FSRS"
                stroke="#10b981"
                strokeWidth={2.5}
                fill="url(#withFSRS)"
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
          <div className="flex items-center gap-4 mt-2 flex-wrap">
            {[
              { label: 'No Review', color: '#ef4444' },
              { label: 'SRS', color: '#6366f1' },
              { label: 'FSRS', color: '#10b981' },
            ].map((l) => (
              <div key={l.label} className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 rounded" style={{ background: l.color }} />
                <span className="text-xs text-slate-500 font-medium">{l.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Radar */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <div className="mb-4">
            <h3 className="text-base font-bold text-slate-900">
              System Comparison Radar
            </h3>
            <p className="text-xs text-slate-400 font-medium mt-0.5">
              FSRS · SM2 · SRS · Leitner across 6 metrics
            </p>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <RadarChart data={RADAR_DATA} margin={{ top: 10, right: 30, left: 30, bottom: 10 }}>
              <PolarGrid stroke="#e2e8f0" />
              <PolarAngleAxis
                dataKey="metric"
                tick={{ fontSize: 10, fill: '#94a3b8' }}
              />
              <PolarRadiusAxis
                angle={90}
                domain={[0, 100]}
                tick={{ fontSize: 8, fill: '#cbd5e1' }}
                tickCount={4}
              />
              <Radar name="FSRS" dataKey="FSRS" stroke="#6366f1" fill="#6366f1" fillOpacity={0.15} strokeWidth={2} />
              <Radar name="SM-2" dataKey="SM2" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.1} strokeWidth={2} />
              <Radar name="SRS" dataKey="SRS" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.1} strokeWidth={2} />
              <Radar name="Leitner" dataKey="Leitner" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.1} strokeWidth={2} />
              <Legend
                iconSize={8}
                iconType="circle"
                wrapperStyle={{ fontSize: '11px' }}
              />
              <Tooltip content={<CustomTooltip />} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Subject Bar + Score Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Subject Mastery Stacked Bar */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <div className="mb-4">
            <h3 className="text-base font-bold text-slate-900">
              Subject Mastery Breakdown
            </h3>
            <p className="text-xs text-slate-400 font-medium mt-0.5">
              Mastered vs learning topics per subject
            </p>
          </div>
          <ResponsiveContainer width="100%" height={230}>
            <BarChart
              data={subjectBarData}
              layout="vertical"
              margin={{ top: 0, right: 10, left: 10, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis
                type="number"
                tick={{ fontSize: 10 }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                type="category"
                dataKey="name"
                tick={{ fontSize: 10 }}
                tickLine={false}
                axisLine={false}
                width={70}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="Mastered" stackId="a" fill="#10b981" radius={[0, 0, 0, 0]} maxBarSize={16} />
              <Bar dataKey="Learning" stackId="a" fill="#e0e7ff" radius={[4, 4, 4, 4]} maxBarSize={16} />
            </BarChart>
          </ResponsiveContainer>
          <div className="flex items-center gap-4 mt-1">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-emerald-500" />
              <span className="text-xs text-slate-500 font-medium">Mastered</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-indigo-100" />
              <span className="text-xs text-slate-500 font-medium">In Progress</span>
            </div>
          </div>
        </div>

        {/* Score Distribution */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <div className="mb-4">
            <h3 className="text-base font-bold text-slate-900">
              Score Distribution
            </h3>
            <p className="text-xs text-slate-400 font-medium mt-0.5">
              Performance across all topics
            </p>
          </div>
          <ResponsiveContainer width="100%" height={230}>
            <BarChart
              data={SCORE_DISTRIBUTION}
              margin={{ top: 5, right: 10, left: -20, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="range"
                tick={{ fontSize: 10 }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                tick={{ fontSize: 10 }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" name="Topics" radius={[6, 6, 0, 0]} maxBarSize={40}>
                {SCORE_DISTRIBUTION.map((_, i) => (
                  <Cell
                    key={i}
                    fill={
                      ['#ef4444', '#f97316', '#f59e0b', '#6366f1', '#10b981'][i]
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Scatter: Ease vs Retention */}
      <DifficultyScatter />

      {/* Subject Score Donut */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Time Investment by Subject
            </h3>
            <p className="text-xs text-slate-400 font-medium mt-0.5">
              Total hours spent per subject
            </p>
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-6 items-center">
          <div className="flex-shrink-0">
            <ResponsiveContainer width={220} height={220}>
              <PieChart>
                <Pie
                  data={filteredSubjectStats}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={95}
                  paddingAngle={2}
                  dataKey="timeSpent"
                  nameKey="subject"
                >
                  {filteredSubjectStats.map((s, i) => (
                    <Cell key={i} fill={s.color} stroke="none" />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload?.length) {
                      const d = payload[0].payload;
                      return (
                        <div className="bg-white border border-slate-100 rounded-xl shadow-xl p-3 text-xs">
                          <p className="font-bold text-slate-800">{d.subject}</p>
                          <p className="text-slate-500 mt-1">
                            {Math.round(d.timeSpent / 60)}h {d.timeSpent % 60}m
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2 w-full">
            {filteredSubjectStats.map((s) => (
              <div
                key={s.subject}
                className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100"
              >
                <div
                  className="w-3 h-10 rounded-full flex-shrink-0"
                  style={{ background: s.color }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-slate-800 truncate">
                    {s.subject}
                  </p>
                  <p className="text-[10px] text-slate-400 font-medium mt-0.5">
                    {Math.round(s.timeSpent / 60)}h · {s.retention}% ret.
                  </p>
                  <p className="text-[10px] font-bold mt-0.5" style={{ color: s.color }}>
                    {s.mastered}/{s.topics} mastered
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Stats;
