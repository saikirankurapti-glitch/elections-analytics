import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

export type KpiCategoryColor =
  | 'saffron' // Campaigns
  | 'blue'    // Total Reach
  | 'green'   // Phone Calls
  | 'emerald' // Connect Rate
  | 'teal'    // WhatsApp
  | 'purple'  // SMS
  | 'indigo'  // Social Reach
  | 'amber'   // Engagement
  | 'cyan'    // Responses
  | 'coral'   // Follow-ups
  | 'navy'    // Constituencies / Districts
  | 'default';

interface KpiCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: LucideIcon;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  accentColor?: KpiCategoryColor;
  sparkline?: number[]; // Array of 10-14 data points
  onClick?: () => void;
  className?: string;
}

export const KpiCard: React.FC<KpiCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  accentColor = 'default',
  sparkline,
  onClick,
  className = ''
}) => {
  // Color configuration palette for the 3D KPI design system
  const colorMap = {
    saffron: {
      borderEdge: 'border-t-[3px] border-t-amber-500',
      textNum: 'text-amber-600',
      textShadow: '0 1px 1px rgba(217, 119, 6, 0.2), 0 2px 4px rgba(245, 158, 11, 0.15)',
      iconBg: 'bg-amber-50 text-amber-700 border border-amber-200/60',
      sparkStroke: '#D97706',
      sparkFill: '#FEF3C7'
    },
    blue: {
      borderEdge: 'border-t-[3px] border-t-blue-600',
      textNum: 'text-blue-700',
      textShadow: '0 1px 1px rgba(29, 78, 216, 0.2), 0 2px 4px rgba(59, 130, 246, 0.15)',
      iconBg: 'bg-blue-50 text-blue-700 border border-blue-200/60',
      sparkStroke: '#2563EB',
      sparkFill: '#DBEAFE'
    },
    green: {
      borderEdge: 'border-t-[3px] border-t-green-600',
      textNum: 'text-green-700',
      textShadow: '0 1px 1px rgba(21, 128, 61, 0.2), 0 2px 4px rgba(34, 197, 94, 0.15)',
      iconBg: 'bg-green-50 text-green-700 border border-green-200/60',
      sparkStroke: '#16A34A',
      sparkFill: '#DCFCE7'
    },
    emerald: {
      borderEdge: 'border-t-[3px] border-t-emerald-600',
      textNum: 'text-emerald-700',
      textShadow: '0 1px 1px rgba(4, 120, 87, 0.2), 0 2px 4px rgba(16, 185, 129, 0.15)',
      iconBg: 'bg-emerald-50 text-emerald-700 border border-emerald-200/60',
      sparkStroke: '#059669',
      sparkFill: '#D1FAE5'
    },
    teal: {
      borderEdge: 'border-t-[3px] border-t-teal-600',
      textNum: 'text-teal-700',
      textShadow: '0 1px 1px rgba(15, 118, 110, 0.2), 0 2px 4px rgba(20, 184, 166, 0.15)',
      iconBg: 'bg-teal-50 text-teal-700 border border-teal-200/60',
      sparkStroke: '#0D9488',
      sparkFill: '#CCFBF1'
    },
    purple: {
      borderEdge: 'border-t-[3px] border-t-purple-600',
      textNum: 'text-purple-700',
      textShadow: '0 1px 1px rgba(109, 40, 217, 0.2), 0 2px 4px rgba(147, 51, 234, 0.15)',
      iconBg: 'bg-purple-50 text-purple-700 border border-purple-200/60',
      sparkStroke: '#7C3AED',
      sparkFill: '#F3E8FF'
    },
    indigo: {
      borderEdge: 'border-t-[3px] border-t-indigo-600',
      textNum: 'text-indigo-700',
      textShadow: '0 1px 1px rgba(67, 56, 202, 0.2), 0 2px 4px rgba(99, 102, 241, 0.15)',
      iconBg: 'bg-indigo-50 text-indigo-700 border border-indigo-200/60',
      sparkStroke: '#4F46E5',
      sparkFill: '#E0E7FF'
    },
    amber: {
      borderEdge: 'border-t-[3px] border-t-amber-500',
      textNum: 'text-amber-700',
      textShadow: '0 1px 1px rgba(180, 83, 9, 0.2), 0 2px 4px rgba(217, 119, 6, 0.15)',
      iconBg: 'bg-amber-50 text-amber-800 border border-amber-200/60',
      sparkStroke: '#D97706',
      sparkFill: '#FEF3C7'
    },
    cyan: {
      borderEdge: 'border-t-[3px] border-t-cyan-600',
      textNum: 'text-cyan-700',
      textShadow: '0 1px 1px rgba(14, 116, 144, 0.2), 0 2px 4px rgba(6, 182, 212, 0.15)',
      iconBg: 'bg-cyan-50 text-cyan-700 border border-cyan-200/60',
      sparkStroke: '#0891B2',
      sparkFill: '#CFFAFE'
    },
    coral: {
      borderEdge: 'border-t-[3px] border-t-rose-500',
      textNum: 'text-rose-700',
      textShadow: '0 1px 1px rgba(190, 18, 60, 0.2), 0 2px 4px rgba(244, 63, 94, 0.15)',
      iconBg: 'bg-rose-50 text-rose-700 border border-rose-200/60',
      sparkStroke: '#E11D48',
      sparkFill: '#FFE4E6'
    },
    navy: {
      borderEdge: 'border-t-[3px] border-t-navy-900',
      textNum: 'text-navy-900',
      textShadow: '0 1px 1px rgba(11, 31, 58, 0.2), 0 2px 4px rgba(29, 65, 117, 0.15)',
      iconBg: 'bg-navy-50 text-navy-900 border border-navy-200/60',
      sparkStroke: '#0B1F3A',
      sparkFill: '#E2E8F0'
    },
    default: {
      borderEdge: 'border-t-[3px] border-t-slate-400',
      textNum: 'text-slate-800',
      textShadow: '0 1px 1px rgba(30, 41, 59, 0.15), 0 2px 3px rgba(71, 85, 105, 0.10)',
      iconBg: 'bg-slate-50 text-slate-700 border border-slate-200/60',
      sparkStroke: '#64748B',
      sparkFill: '#F1F5F9'
    }
  };

  const currentTheme = colorMap[accentColor] || colorMap.default;

  // Render miniature inline SVG sparkline
  const renderSparkline = () => {
    if (!sparkline || sparkline.length < 2) return null;

    const min = Math.min(...sparkline);
    const max = Math.max(...sparkline);
    const range = max - min || 1;
    const width = 64;
    const height = 22;

    const points = sparkline.map((val, idx) => {
      const x = (idx / (sparkline.length - 1)) * width;
      const y = height - ((val - min) / range) * (height - 4) - 2;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    });

    const pathD = `M ${points.join(' L ')}`;
    const areaD = `${pathD} L ${width},${height} L 0,${height} Z`;

    return (
      <svg
        width={width}
        height={height}
        className="shrink-0 overflow-visible opacity-90 transition-opacity group-hover:opacity-100"
        aria-hidden="true"
      >
        <path d={areaD} fill={currentTheme.sparkFill} opacity="0.6" />
        <path
          d={pathD}
          fill="none"
          stroke={currentTheme.sparkStroke}
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  };

  return (
    <div
      onClick={onClick}
      className={`group relative bg-white rounded-lg border border-slate-200/90 p-3.5 transition-all duration-200 shadow-xs hover:shadow-md ${
        currentTheme.borderEdge
      } ${
        onClick ? 'cursor-pointer hover:-translate-y-0.5' : ''
      } ${className}`}
    >
      {/* Top Header: Title & Icon */}
      <div className="flex items-start justify-between gap-1.5">
        <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 truncate">
          {title}
        </p>
        {Icon && (
          <div className={`p-1.5 rounded-md shrink-0 ${currentTheme.iconBg}`}>
            <Icon className="w-3.5 h-3.5" />
          </div>
        )}
      </div>

      {/* Main Number with 3D Layered Depth Styling */}
      <div className="mt-2 flex items-baseline justify-between gap-2">
        <div
          className={`text-2xl sm:text-[26px] font-black tracking-tight tabular-nums select-none ${currentTheme.textNum}`}
          style={{
            textShadow: currentTheme.textShadow,
            letterSpacing: '-0.02em'
          }}
        >
          {value}
        </div>
        {renderSparkline()}
      </div>

      {/* Subtitle & Trend Indicator */}
      {(subtitle || trend) && (
        <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-100 pt-1.5">
          {subtitle && <span className="truncate max-w-[130px]">{subtitle}</span>}
          {trend && (
            <span
              className={`inline-flex items-center gap-0.5 font-bold ml-auto shrink-0 ${
                trend.isPositive ? 'text-emerald-600' : 'text-rose-600'
              }`}
            >
              {trend.isPositive ? (
                <TrendingUp className="w-3 h-3" />
              ) : (
                <TrendingDown className="w-3 h-3" />
              )}
              {trend.value}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
