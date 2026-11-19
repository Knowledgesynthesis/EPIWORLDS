import { useId, type ReactNode } from 'react';
import { cn } from '../../lib/utils';

interface SliderProps {
  label: ReactNode;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  format?: (v: number) => string;
  hint?: ReactNode;
  className?: string;
}

/** Labelled range input with a live value readout. */
export function Slider({ label, value, min, max, step, onChange, format = (v) => String(v), hint, className }: SliderProps) {
  const id = useId();
  return (
    <div className={cn('space-y-1.5', className)}>
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor={id} className="text-sm font-medium">
          {label}
        </label>
        <output htmlFor={id} className="tabular rounded bg-muted px-2 py-0.5 text-sm font-semibold">
          {format(value)}
        </output>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        aria-valuetext={format(value)}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-6 w-full cursor-pointer"
      />
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

interface SegmentedProps<T extends string> {
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: ReactNode }[];
  label: string;
  className?: string;
  size?: 'sm' | 'md';
}

/** A radio-group styled as a segmented control. */
export function Segmented<T extends string>({ value, onChange, options, label, className, size = 'md' }: SegmentedProps<T>) {
  return (
    <div role="radiogroup" aria-label={label} className={cn('inline-flex max-w-full flex-wrap gap-1 rounded-lg bg-muted p-1', className)}>
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          role="radio"
          aria-checked={value === o.value}
          onClick={() => onChange(o.value)}
          className={cn(
            'rounded-md font-medium transition-colors',
            size === 'sm' ? 'px-2.5 py-1 text-xs' : 'px-3 py-1.5 text-sm',
            value === o.value ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

interface NumberFieldProps {
  label: ReactNode;
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
  className?: string;
}

export function NumberField({ label, value, onChange, min = 0, max, step = 1, className }: NumberFieldProps) {
  const id = useId();
  return (
    <div className={cn('space-y-1', className)}>
      <label htmlFor={id} className="block text-xs font-medium text-muted-foreground">
        {label}
      </label>
      <input
        id={id}
        type="number"
        inputMode="decimal"
        value={Number.isFinite(value) ? value : ''}
        min={min}
        max={max}
        step={step}
        onChange={(e) => {
          const v = Number(e.target.value);
          if (Number.isFinite(v)) onChange(max !== undefined ? Math.min(max, Math.max(min, v)) : Math.max(min, v));
        }}
        className="tabular h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
      />
    </div>
  );
}

interface ToggleProps {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: ReactNode;
  hint?: ReactNode;
}

export function Toggle({ checked, onChange, label, hint }: ToggleProps) {
  const id = useId();
  return (
    <div className="flex items-start gap-3">
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn('relative mt-0.5 inline-flex h-5 w-9 shrink-0 rounded-full transition-colors', checked ? 'bg-primary' : 'bg-input')}
      >
        <span className={cn('absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform', checked ? 'translate-x-4' : 'translate-x-0.5')} />
      </button>
      <label htmlFor={id} className="cursor-pointer text-sm">
        <span className="font-medium">{label}</span>
        {hint && <span className="block text-xs text-muted-foreground">{hint}</span>}
      </label>
    </div>
  );
}
