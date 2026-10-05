import React from 'react';

interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const normalized = status.toLowerCase();

  let styles = 'bg-slate-100 text-slate-700 border-slate-200';
  let dotColor = 'bg-slate-400';

  if (normalized.includes('active') || normalized.includes('live') || normalized.includes('optimal') || normalized.includes('delivered') || normalized.includes('ready')) {
    styles = 'bg-emerald-50 text-emerald-800 border-emerald-200';
    dotColor = 'bg-igreen';
  } else if (normalized.includes('high')) {
    styles = 'bg-saffron-50 text-navy-900 border-saffron-300 font-semibold';
    dotColor = 'bg-saffron-500';
  } else if (normalized.includes('moderate') || normalized.includes('scheduled') || normalized.includes('in progress')) {
    styles = 'bg-blue-50 text-navy-800 border-blue-200';
    dotColor = 'bg-blue-500';
  } else if (normalized.includes('optimizing') || normalized.includes('review') || normalized.includes('paused')) {
    styles = 'bg-amber-50 text-amber-800 border-amber-200';
    dotColor = 'bg-amber-500';
  } else if (normalized.includes('failed') || normalized.includes('error') || normalized.includes('dropped')) {
    styles = 'bg-rose-50 text-rose-800 border-rose-200';
    dotColor = 'bg-rose-500';
  } else if (normalized.includes('completed')) {
    styles = 'bg-navy-50 text-navy-800 border-navy-200';
    dotColor = 'bg-navy-600';
  }

  const sizeClasses = size === 'sm' 
    ? 'text-[11px] px-2 py-0.5' 
    : 'text-xs px-2.5 py-1';

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border font-medium ${sizeClasses} ${styles}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
      {status}
    </span>
  );
};
