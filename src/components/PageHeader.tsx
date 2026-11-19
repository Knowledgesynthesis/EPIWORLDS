import type { ReactNode } from 'react';
import { useEffect } from 'react';

export function PageHeader({ eyebrow, title, children }: { eyebrow?: ReactNode; title: string; children?: ReactNode }) {
  useEffect(() => {
    document.title = `${title} · EpiWorlds`;
  }, [title]);
  return (
    <header className="mb-8 space-y-2">
      {eyebrow && <p className="text-sm font-medium text-primary">{eyebrow}</p>}
      <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{title}</h1>
      {children && <div className="max-w-3xl text-base leading-7 text-muted-foreground">{children}</div>}
    </header>
  );
}
