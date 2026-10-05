import React from 'react';
import { Loader2, AlertCircle, Inbox, RefreshCw } from 'lucide-react';

export const LoadingState: React.FC<{ message?: string }> = ({ message = 'Loading campaign analytics data...' }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <Loader2 className="w-8 h-8 text-saffron animate-spin mb-3" />
      <p className="text-sm font-medium text-navy-900">{message}</p>
      <p className="text-xs text-txt-secondary mt-1">Aggregating telemetry from state communication nodes</p>
    </div>
  );
};

export const EmptyState: React.FC<{
  title?: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
}> = ({
  title = 'No campaign data found',
  description = 'No matching operational telemetry matches the current filters or date range.',
  actionText,
  onAction
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center bg-white rounded-lg border border-dashed border-slate-300">
      <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center mb-3">
        <Inbox className="w-6 h-6 text-slate-400" />
      </div>
      <h4 className="text-sm font-semibold text-navy-900">{title}</h4>
      <p className="text-xs text-txt-secondary max-w-sm mt-1">{description}</p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="mt-4 px-3 py-1.5 text-xs font-semibold text-navy-900 bg-saffron-50 hover:bg-saffron-100 rounded-md border border-saffron-300 transition-colors"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};

export const ErrorState: React.FC<{
  title?: string;
  message?: string;
  onRetry?: () => void;
}> = ({
  title = 'Unable to load analytics',
  message = 'There was an issue retrieving the campaign telemetry stream.',
  onRetry
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center bg-rose-50/50 rounded-lg border border-rose-200">
      <AlertCircle className="w-8 h-8 text-rose-600 mb-2" />
      <h4 className="text-sm font-semibold text-navy-900">{title}</h4>
      <p className="text-xs text-slate-600 max-w-sm mt-1">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-4 inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-navy-900 hover:bg-navy-800 rounded-md transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Retry Sync
        </button>
      )}
    </div>
  );
};
