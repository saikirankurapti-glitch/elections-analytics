// Indian number and enterprise formatting utilities

/**
 * Formats a number with Indian numbering system (Lakhs and Crores commas: 18,42,000)
 */
export function formatIndianNumber(num: number | undefined | null): string {
  if (num === undefined || num === null || isNaN(num)) return '0';
  
  const parts = Math.round(num).toString().split('.');
  let lastThree = parts[0].substring(parts[0].length - 3);
  const otherNumbers = parts[0].substring(0, parts[0].length - 3);
  
  if (otherNumbers !== '') {
    lastThree = ',' + lastThree;
  }
  
  const res = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + lastThree;
  return parts.length > 1 ? res + '.' + parts[1] : res;
}

/**
 * Formats large counts into clean compact metrics (e.g. 4.2M or 42.1L depending on context)
 */
export function formatCompactMetric(num: number | undefined | null, style: 'standard' | 'indian' = 'standard'): string {
  if (num === undefined || num === null || isNaN(num)) return '0';

  if (style === 'indian') {
    if (num >= 10000000) {
      return (num / 10000000).toFixed(2).replace(/\.00$/, '') + ' Cr';
    }
    if (num >= 100000) {
      return (num / 100000).toFixed(1).replace(/\.0$/, '') + ' L';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1).replace(/\.0$/, '') + ' K';
    }
    return num.toString();
  }

  // Standard million/k representation
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
  }
  return num.toString();
}

/**
 * Formats percentage with symbol
 */
export function formatPercent(num: number | undefined | null, decimals = 1): string {
  if (num === undefined || num === null || isNaN(num)) return '0.0%';
  return `${num.toFixed(decimals)}%`;
}

/**
 * Formats seconds into MM:SS or human string
 */
export function formatCallDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const remainingSecs = seconds % 60;
  if (mins === 0) return `${remainingSecs}s`;
  return `${mins}m ${remainingSecs.toString().padStart(2, '0')}s`;
}

/**
 * Formats timestamp to readable Indian standard format (DD MMM YYYY, HH:mm)
 */
export function formatReadableDate(dateString: string): string {
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return d.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  } catch {
    return dateString;
  }
}
