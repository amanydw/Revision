import React, { useState } from 'react';
import { CheckCircle, ChevronDown, ChevronUp, Zap, TrendingUp, Brain } from 'lucide-react';
import { REVISION_SYSTEMS, TOPICS } from '../data/sampleData';
import type { SystemInfo } from '../types';

const SystemCard: React.FC<{
  system: SystemInfo;
  topicsUsing: number;
  isExpanded: boolean;
  onToggle: () => void;
}> = ({ system, topicsUsing, isExpanded, onToggle }) => {
  const difficultyStars = '★'.repeat(system.difficulty) + '☆'.repeat(3 - system.difficulty);

  return (
    <div
      className={`bg-white rounded-2xl border transition-all duration-300 shadow-sm overflow-hidden card-hover ${
        isExpanded ? 'border-indigo-200 shadow-indigo-100' : 'border-slate-100'
      }`}
    >
      {/* Card Header */}
      <div
        className="p-5 cursor-pointer"
        onClick={onToggle}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            {/* Icon */}
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 shadow-sm"
              style={{ background: system.bg }}
            >
              {system.icon}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <h3 className="text-base font-extrabold text-slate-900">
                  {system.name}
                </h3>
                {topicsUsing > 0 && (
                  <span className="text-xs bg-indigo-50 border border-indigo-100 text-indigo-600 font-bold px-2 py-0.5 rounded-lg">
                    {topicsUsing} topics
                  </span>
                )}
              </div>
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                {system.fullName}
              </p>
              <p className="text-sm text-slate-600 leading-relaxed line-clamp-2">
                {system.description}
              </p>
            </div>
          </div>

          <button className="ml-3 flex-shrink-0 w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 hover:bg-slate-200 transition-colors cursor-pointer">
            {isExpanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
          </button>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mt-3">
          {system.tags.map((tag) => (
            <span
              key={tag}
              className="text-[10px] font-bold uppercase tracking-wide px-2.5 py-0.5 rounded-full"
              style={{ background: system.bg, color: system.color }}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-3 gap-3 mt-4">
          <div className="text-center p-2 bg-slate-50 rounded-xl">
            <div className="text-base font-extrabold" style={{ color: system.color }}>
              {system.effectiveness}%
            </div>
            <div className="text-[10px] text-slate-400 font-semibold mt-0.5">
              Effectiveness
            </div>
          </div>
          <div className="text-center p-2 bg-slate-50 rounded-xl">
            <div className="text-base font-extrabold text-slate-800">
              {system.retention}%
            </div>
            <div className="text-[10px] text-slate-400 font-semibold mt-0.5">
              Retention
            </div>
          </div>
          <div className="text-center p-2 bg-slate-50 rounded-xl">
            <div
              className="text-base font-extrabold"
              style={{
                color:
                  system.difficulty === 1
                    ? '#10b981'
                    : system.difficulty === 2
                    ? '#f59e0b'
                    : '#ef4444',
              }}
            >
              {difficultyStars}
            </div>
            <div className="text-[10px] text-slate-400 font-semibold mt-0.5">
              Difficulty
            </div>
          </div>
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="border-t border-slate-100 p-5 bg-slate-50/50 animate-fade-in">
          {/* How it works */}
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <Brain size={14} className="text-indigo-500" />
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                How It Works
              </h4>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed bg-white rounded-xl p-3 border border-slate-100">
              {system.howItWorks}
            </p>
          </div>

          {/* Benefits list */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              {
                icon: <TrendingUp size={13} className="text-indigo-500" />,
                label: 'Effectiveness',
                value: `${system.effectiveness}%`,
                color: system.color,
              },
              {
                icon: <Brain size={13} className="text-emerald-500" />,
                label: 'Retention Rate',
                value: `${system.retention}%`,
                color: '#10b981',
              },
              {
                icon: <Zap size={13} className="text-amber-500" />,
                label: 'Complexity',
                value:
                  system.difficulty === 1
                    ? 'Beginner'
                    : system.difficulty === 2
                    ? 'Intermediate'
                    : 'Advanced',
                color:
                  system.difficulty === 1
                    ? '#10b981'
                    : system.difficulty === 2
                    ? '#f59e0b'
                    : '#ef4444',
              },
            ].map((item) => (
              <div
                key={item.label}
                className="bg-white rounded-xl p-3 border border-slate-100 flex items-center gap-3"
              >
                <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center flex-shrink-0">
                  {item.icon}
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-semibold">
                    {item.label}
                  </p>
                  <p
                    className="text-sm font-extrabold"
                    style={{ color: item.color }}
                  >
                    {item.value}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Use this system button */}
          <button
            className="mt-4 w-full py-2.5 rounded-xl text-sm font-bold text-white transition-all cursor-pointer hover:opacity-90 hover:shadow-lg"
            style={{ background: system.color }}
          >
            Apply {system.name} to Selected Topics
          </button>
        </div>
      )}
    </div>
  );
};

const Systems: React.FC = () => {
  const [expanded, setExpanded] = useState<string | null>('FSRS');

  const topicsBySystem = TOPICS.reduce<Record<string, number>>((acc, t) => {
    acc[t.system] = (acc[t.system] || 0) + 1;
    return acc;
  }, {});

  const bestSystem = REVISION_SYSTEMS.reduce((a, b) =>
    a.effectiveness > b.effectiveness ? a : b
  );

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900">
            Revision Systems
          </h2>
          <p className="text-sm text-slate-400 font-medium mt-0.5">
            10 evidence-based study methodologies
          </p>
        </div>
        <div className="flex items-center gap-1.5 bg-indigo-50 border border-indigo-100 px-3 py-1.5 rounded-xl">
          <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
          <span className="text-xs text-indigo-600 font-bold">10 Systems Active</span>
        </div>
      </div>

      {/* System icons grid */}
      <div className="grid grid-cols-5 gap-3">
        {REVISION_SYSTEMS.map((s) => (
          <button
            key={s.id}
            onClick={() => setExpanded(s.id)}
            className={`flex flex-col items-center gap-2 p-3 rounded-2xl border transition-all cursor-pointer ${
              expanded === s.id
                ? 'border-indigo-200 bg-indigo-50 shadow-sm'
                : 'border-slate-100 bg-white hover:border-slate-200'
            }`}
          >
            <span className="text-2xl">{s.icon}</span>
            <span className={`text-[10px] font-bold ${expanded === s.id ? 'text-indigo-600' : 'text-slate-500'}`}>
              {s.name}
            </span>
          </button>
        ))}
      </div>

      {/* Top Banner: Best System */}
      <div
        className="rounded-2xl p-5 text-white shadow-xl relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${bestSystem.color}ee, ${bestSystem.color}99)`,
        }}
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="relative flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center text-3xl flex-shrink-0">
            {bestSystem.icon}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle size={15} className="text-white/80" />
              <span className="text-xs font-bold text-white/80 uppercase tracking-wider">
                Top Recommended
              </span>
            </div>
            <h3 className="text-xl font-extrabold mb-1">{bestSystem.fullName}</h3>
            <p className="text-sm text-white/80 leading-relaxed max-w-lg">
              {bestSystem.description}
            </p>
          </div>
        </div>
      </div>

      {/* Comparison overview */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
        <h3 className="text-base font-bold text-slate-900 mb-4">
          Effectiveness Comparison
        </h3>
        <div className="space-y-3">
          {[...REVISION_SYSTEMS]
            .sort((a, b) => b.effectiveness - a.effectiveness)
            .map((s, i) => (
              <div key={s.id} className="flex items-center gap-3">
                <span className="text-xs font-bold text-slate-400 w-4 flex-shrink-0">
                  #{i + 1}
                </span>
                <span className="text-lg flex-shrink-0">{s.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-slate-700">
                      {s.name}
                    </span>
                    <span
                      className="text-xs font-extrabold"
                      style={{ color: s.color }}
                    >
                      {s.effectiveness}%
                    </span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${s.effectiveness}%`,
                        background: s.color,
                      }}
                    />
                  </div>
                </div>
                <span className="text-[10px] text-slate-400 font-medium flex-shrink-0 w-14 text-right">
                  {topicsBySystem[s.id] || 0} topics
                </span>
              </div>
            ))}
        </div>
      </div>

      {/* System Cards */}
      <div className="space-y-4">
        {REVISION_SYSTEMS.map((system) => (
          <SystemCard
            key={system.id}
            system={system}
            topicsUsing={topicsBySystem[system.id] || 0}
            isExpanded={expanded === system.id}
            onToggle={() =>
              setExpanded(expanded === system.id ? null : system.id)
            }
          />
        ))}
      </div>
    </div>
  );
};

export default Systems;
