import React, { ReactNode } from 'react';

interface ChartCardProps {
  title: string;
  subtitle?: string;
  badge?: string;
  action?: ReactNode;
  headerAction?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
}

export const ChartCard: React.FC<ChartCardProps> = ({
  title,
  subtitle,
  badge,
  action,
  headerAction,
  children,
  footer,
  className = ''
}) => {
  const rightAction = headerAction || action;
  return (
    <div className={`bg-white rounded-lg border border-slate-200 shadow-subtle p-4 sm:p-5 flex min-w-0 flex-col overflow-hidden ${className}`}>
      <div className="flex min-w-0 flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
        <div className="min-w-0">
          <div className="flex min-w-0 items-center gap-2">
            <h3 className="min-w-0 text-sm sm:text-base font-bold text-navy-900 leading-snug truncate">{title}</h3>
          </div>
          {subtitle && <p className="text-xs text-txt-secondary mt-0.5 leading-relaxed">{subtitle}</p>}
        </div>
        {rightAction && (
          <div className="flex max-w-full min-w-0 items-center gap-2 flex-wrap sm:justify-end overflow-x-auto pb-0.5">
            {rightAction}
          </div>
        )}
      </div>

      {/* A definite responsive height prevents Recharts percentage-height containers from collapsing. */}
      <div className="block min-w-0 w-full min-h-[240px] h-[clamp(260px,30vw,340px)] overflow-hidden">
        {children}
      </div>

      {footer && (
        <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-txt-secondary flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          {footer}
        </div>
      )}
    </div>
  );
};
