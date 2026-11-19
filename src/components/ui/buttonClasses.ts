import { cn } from '../../lib/utils';

export type ButtonVariant = 'default' | 'secondary' | 'outline' | 'ghost' | 'destructive';
export type ButtonSize = 'sm' | 'md' | 'lg' | 'icon';

export function buttonClasses(variant: ButtonVariant = 'default', size: ButtonSize = 'md', className?: string) {
  return cn(
    'inline-flex select-none items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium transition-colors',
    'disabled:pointer-events-none disabled:opacity-50',
    {
      'bg-primary text-primary-foreground shadow-sm hover:bg-primary/90': variant === 'default',
      'bg-secondary text-secondary-foreground hover:bg-secondary/70': variant === 'secondary',
      'border border-input bg-card hover:bg-accent hover:text-accent-foreground': variant === 'outline',
      'hover:bg-accent hover:text-accent-foreground': variant === 'ghost',
      'bg-destructive text-destructive-foreground hover:bg-destructive/90': variant === 'destructive',
    },
    {
      'h-8 px-3 text-sm': size === 'sm',
      'h-10 px-4 text-sm': size === 'md',
      'h-12 px-6 text-base': size === 'lg',
      'h-9 w-9 p-0': size === 'icon',
    },
    className
  );
}
