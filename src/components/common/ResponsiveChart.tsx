import React, { CSSProperties, ReactElement, ReactNode, cloneElement, isValidElement } from 'react';

interface ResponsiveChartProps {
  children: ReactNode;
  width?: number | string;
  height?: number | string;
  className?: string;
}

/**
 * Recharts 3.x responsive chart wrapper.
 *
 * Recharts 3.3+ supports the responsive prop directly on chart components.
 * Using it here avoids ResizeObserver sizing races that can leave charts with
 * legends but no rendered series inside flex/grid layouts.
 */
export const ResponsiveChart: React.FC<ResponsiveChartProps> = ({
  children,
  width = '100%',
  height = '100%',
  className = ''
}) => {
  const chartStyle: CSSProperties = {
    width: '100%',
    height: '100%',
    maxWidth: '100%',
    minWidth: 0,
    ...(isValidElement(children) && (children.props as any).style
      ? (children.props as any).style
      : {})
  };

  const chart = isValidElement(children)
    ? cloneElement(children as ReactElement<any>, {
        responsive: true,
        style: chartStyle
      })
    : children;

  const resolvedHeight =
    typeof height === 'number' ? `${height}px` : height;

  return (
    <div
      className={`relative min-w-0 shrink-0 ${className}`}
      style={{
        width: typeof width === 'number' ? `${width}px` : width,
        height: resolvedHeight,
        minHeight: resolvedHeight === '100%' ? 280 : undefined
      }}
    >
      {chart}
    </div>
  );
};
