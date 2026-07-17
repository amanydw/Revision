import React, { useMemo } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface KPICardProps {
  label: string;
  value: string | number;
  sub: string;
  trend: number;
  icon: string;
  color: string;
  bg: string;
  delay?: number;
}

// Mini sparkline SVG
const Sparkline: React.FC<{ color: string; positive: boolean }> = ({ color, positive }) => {
  const pts = useMemo(() => {
    const base = [40, 55, 45, 65, 50, 70, 60, 75, 65, 80];
    return positive
      ? base
      : base.map((v, i) => (i < 5 ? v : v - (i - 4) * 8));
  }, [positive]);

  const max = Math.max(...pts);
  const min = Math.min(...pts);
  const range = max - min || 1;
  const w = 80;
  const h = 28;
  const pad = 2;

  const coords = pts.map((v, i) => {
    const x = pad + (i / (pts.length - 1)) * (w - pad * 2);
    const y = pad + ((max - v) / range) * (h - pad * 2);
    return `${x},${y}`;
  });

  const pathD = `M ${coords.join(' L ')}`;
  const areaD = `${pathD} L ${w - pad},${h - pad} L ${pad},${h - pad} Z`;

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} fill="none">
      <defs>
        <linearGradient id={`sg-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.2" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={areaD} fill={`url(#sg-${color.replace('#', '')})`} />
      <path d={pathD} stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

const KPICard: React.FC<KPICardProps> = ({
  label,
  value,
  sub,
  trend,
  icon,
  color,
  bg,
  delay = 0,
}) => {
  const isPositive = trend >= 0;
  const isNeutral = trend === 0;

  return (
    <div
      className="bg-white rounded-2xl p-5 border border-slate-100 card-hover shadow-sm animate-slide-up overflow-hidden relative"
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Subtle colored corner accent */}
      <div
        className="absolute top-0 right-0 w-24 h-24 rounded-full opacity-5 -translate-y-1/2 translate-x-1/2"
        style={{ background: color }}
      />

      {/* Top row */}
      <div className="flex items-start justify-between mb-3">
        <div
          className="w-11 h-11 rounded-2xl flex items-center justify-center text-xl shadow-sm flex-shrink-0"
          style={{ background: bg }}
        >
          {icon}
        </div>
        <div
          className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-bold ${
            isNeutral
              ? 'bg-slate-50 text-slate-500'
              : isPositive
              ? 'bg-emerald-50 text-emerald-600'
              : 'bg-red-50 text-red-500'
          }`}
        >
          {isNeutral ? (
            <Minus size={10} />
          ) : isPositive ? (
            <TrendingUp size={10} />
          ) : (
            <TrendingDown size={10} />
          )}
          <span>
            {isPositive && !isNeutral ? '+' : ''}
            {trend}%
          </span>
        </div>
      </div>

      {/* Value */}
      <div className="count-up relative">
        <div
          className="text-[28px] font-extrabold leading-none mb-1 tracking-tight"
          style={{ color }}
        >
          {value}
        </div>
        <div className="text-sm font-bold text-slate-700 mt-1">{label}</div>
        <div className="text-[11px] text-slate-400 mt-0.5 font-medium">{sub}</div>
      </div>

      {/* Sparkline */}
      <div className="mt-3 -mb-1 -mx-1">
        <Sparkline color={color} positive={isPositive} />
      </div>
    </div>
  );
};

export default KPICard;
