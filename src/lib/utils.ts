import { clsx, type ClassValue } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

/** Format a ratio measure for display. */
export function fmtRatio(x: number, digits = 2): string {
  if (!Number.isFinite(x)) return x === Infinity ? '∞' : '—';
  return x.toFixed(digits);
}

export function fmtPct(x: number, digits = 1): string {
  return Number.isFinite(x) ? `${(x * 100).toFixed(digits)}%` : '—';
}

export function fmtCI(lo: number, hi: number, digits = 2): string {
  if (!Number.isFinite(lo) || !Number.isFinite(hi)) return '—';
  return `${lo.toFixed(digits)} to ${hi.toFixed(digits)}`;
}

export function fmtP(p: number): string {
  if (!Number.isFinite(p)) return '—';
  if (p < 0.001) return '< 0.001';
  return p.toFixed(3);
}

export function fmtCount(x: number): string {
  if (!Number.isFinite(x)) return '—';
  return Math.abs(x - Math.round(x)) < 1e-9 ? Math.round(x).toLocaleString('en-US') : x.toLocaleString('en-US', { maximumFractionDigits: 1 });
}
