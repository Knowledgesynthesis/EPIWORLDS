import type { HTMLAttributes } from 'react';
import { cn } from '../../lib/utils';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'secondary' | 'outline' | 'good' | 'warn' | 'bad';
}

export function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 whitespace-nowrap rounded-full border px-2.5 py-0.5 text-xs font-medium',
        {
          'border-transparent bg-primary text-primary-foreground': variant === 'default',
          'border-transparent bg-secondary text-secondary-foreground': variant === 'secondary',
          'text-foreground': variant === 'outline',
          'border-good/30 bg-good/10 text-good': variant === 'good',
          'border-warn/30 bg-warn/10 text-warn': variant === 'warn',
          'border-bad/30 bg-bad/10 text-bad': variant === 'bad',
        },
        className
      )}
      {...props}
    />
  );
}
