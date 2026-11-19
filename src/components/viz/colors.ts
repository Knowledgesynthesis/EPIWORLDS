export type SeriesColor = 'series-1' | 'series-2' | 'series-3' | 'muted' | 'good' | 'bad';

export const colorVar: Record<SeriesColor, string> = {
  'series-1': 'var(--series-1)',
  'series-2': 'var(--series-2)',
  'series-3': 'var(--series-3)',
  muted: 'var(--chart-muted)',
  good: 'var(--status-good)',
  bad: 'var(--status-bad)',
};
