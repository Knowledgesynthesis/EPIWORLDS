import { useState } from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';
import type { EthicsCase as Case } from '../../data/ethicsCases';
import { cn } from '../../lib/utils';
import { RefInline } from '../RefList';
import { Badge } from '../ui/Badge';

export function EthicsCase({ c }: { c: Case }) {
  const [choice, setChoice] = useState<number | null>(null);
  const done = choice !== null;
  return (
    <article className="rounded-lg border bg-card p-4 sm:p-5">
      <div className="flex flex-wrap items-center gap-2">
        <h3 className="font-semibold">{c.title}</h3>
        <Badge variant="outline">{c.principle}</Badge>
      </div>
      <p className="mt-2 text-sm leading-6 text-foreground/90">{c.scenario}</p>
      <p className="mt-3 text-sm font-medium">{c.question}</p>
      <div className="mt-2 space-y-2">
        {c.options.map((o, i) => (
          <button
            key={i}
            type="button"
            disabled={done}
            onClick={() => setChoice(i)}
            className={cn(
              'flex w-full items-start gap-2 rounded-md border p-3 text-left text-sm leading-6',
              !done && 'hover:border-primary/60 hover:bg-accent/50',
              done && i === c.answer && 'border-good bg-good/10',
              done && choice === i && i !== c.answer && 'border-bad bg-bad/10'
            )}
          >
            <span className="flex-1">{o}</span>
            {done && i === c.answer && <CheckCircle2 className="h-5 w-5 shrink-0 text-good" aria-label="Best answer" />}
            {done && choice === i && i !== c.answer && <XCircle className="h-5 w-5 shrink-0 text-bad" aria-label="Your answer" />}
          </button>
        ))}
      </div>
      {done && (
        <div className="mt-3 rounded-md bg-muted p-3 text-sm leading-6" role="status">
          <p>{c.explanation}</p>
          <RefInline ids={c.refs} className="mt-2" />
          <button type="button" className="mt-2 text-xs underline underline-offset-2" onClick={() => setChoice(null)}>
            Try again
          </button>
        </div>
      )}
    </article>
  );
}
