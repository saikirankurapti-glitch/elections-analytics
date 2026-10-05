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
    <div className={`bg-white rounded-lg border border-slate-200 shadow-subtle p-5 flex flex-col justify-between ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-navy-900 leading-snug">{title}</h3>
            
          </div>
          {subtitle && <p className="text-xs text-txt-secondary mt-0.5">{subtitle}</p>}
        </div>
        {rightAction && <div className="flex items-center gap-2 flex-wrap">{rightAction}</div>}
      </div>

      <div className="flex-1 w-full min-h-[260px]">
        {children}
      </div>

      {footer && (
        <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-txt-secondary flex items-center justify-between">
          {footer}
        </div>
      )}
    </div>
  );
};
