import type { ReactNode } from 'react';
import { AlertTriangle, CheckCircle2, Info, Lightbulb, XCircle } from 'lucide-react';
import { cn } from '../../lib/utils';

const styles = {
  info: { icon: Info, cls: 'border-l-primary bg-accent/50', label: 'Note' },
  tip: { icon: Lightbulb, cls: 'border-l-primary bg-accent/50', label: 'Key idea' },
  pitfall: { icon: AlertTriangle, cls: 'border-l-warn bg-warn/10', label: 'Pitfall' },
  good: { icon: CheckCircle2, cls: 'border-l-good bg-good/10', label: 'Result' },
  bad: { icon: XCircle, cls: 'border-l-bad bg-bad/10', label: 'Problem' },
} as const;

export function Callout({ kind = 'info', title, children, className }: { kind?: keyof typeof styles; title?: ReactNode; children: ReactNode; className?: string }) {
  const s = styles[kind];
  const Icon = s.icon;
  const iconColor = kind === 'pitfall' ? 'text-warn' : kind === 'good' ? 'text-good' : kind === 'bad' ? 'text-bad' : 'text-primary';
  return (
    <div className={cn('flex gap-3 rounded-md border border-l-4 p-3 text-sm leading-6 sm:p-4', s.cls, className)}>
      <Icon aria-hidden className={cn('mt-0.5 h-5 w-5 shrink-0', iconColor)} />
      <div className="min-w-0 space-y-1">
        <p className="font-semibold">{title ?? s.label}</p>
        <div className="text-foreground/90 [&>p+p]:mt-2">{children}</div>
      </div>
    </div>
  );
}

export function Stat({ label, value, sub, tone }: { label: ReactNode; value: ReactNode; sub?: ReactNode; tone?: 'good' | 'bad' | 'primary' }) {
  return (
    <div className="min-w-0 rounded-lg border bg-card p-3 sm:p-4">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <p className={cn('tabular mt-1 text-2xl font-semibold tracking-tight', tone === 'good' && 'text-good', tone === 'bad' && 'text-bad', tone === 'primary' && 'text-primary')}>
        {value}
      </p>
      {sub && <p className="tabular mt-0.5 text-xs text-muted-foreground">{sub}</p>}
    </div>
  );
}
