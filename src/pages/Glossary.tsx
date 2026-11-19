import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { moduleById, modules } from '../data/curriculum';
import { glossary } from '../data/glossary';
import { cn } from '../lib/utils';

const slug = (t: string) => t.toLowerCase().replace(/[^a-z0-9]+/g, '-');

export default function Glossary() {
  const [q, setQ] = useState('');
  const [mod, setMod] = useState<string>('all');
  const sorted = useMemo(() => [...glossary].sort((a, b) => a.term.localeCompare(b.term)), []);
  const terms = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return sorted.filter(
      (t) =>
        (mod === 'all' || t.module === mod) &&
        (!needle || t.term.toLowerCase().includes(needle) || t.definition.toLowerCase().includes(needle) || t.aka?.some((a) => a.toLowerCase().includes(needle)))
    );
  }, [q, mod, sorted]);
  const known = new Set(glossary.map((t) => t.term));

  return (
    <div>
      <PageHeader eyebrow={`${glossary.length} terms`} title="Glossary">
        Precise definitions, with formulas where they help and links to the module that teaches each term.
      </PageHeader>
      <div className="sticky top-14 z-10 -mx-4 mb-6 space-y-3 border-b bg-background/95 px-4 py-3 backdrop-blur lg:top-0">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-muted-foreground" aria-hidden />
          <label htmlFor="gloss-search" className="sr-only">Search glossary</label>
          <input id="gloss-search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search terms, synonyms, definitions…" className="h-10 w-full rounded-md border border-input bg-card pl-9 pr-3 text-sm" />
        </div>
        <div className="flex gap-1.5 overflow-x-auto pb-1" role="group" aria-label="Filter by module">
          <button type="button" onClick={() => setMod('all')} className={cn('shrink-0 rounded-full border px-3 py-1 text-xs', mod === 'all' ? 'border-primary bg-accent font-medium' : 'hover:bg-accent/50')}>All</button>
          {modules.map((m) => (
            <button key={m.id} type="button" onClick={() => setMod(m.id)} className={cn('shrink-0 rounded-full border px-3 py-1 text-xs', mod === m.id ? 'border-primary bg-accent font-medium' : 'hover:bg-accent/50')}>
              {m.n}. {m.title.split(' ').slice(0, 3).join(' ')}
            </button>
          ))}
        </div>
      </div>
      <p className="mb-4 text-sm text-muted-foreground" role="status">{terms.length} of {glossary.length} terms</p>
      <dl className="space-y-3">
        {terms.map((t) => (
          <div key={t.term} id={slug(t.term)} className="scroll-mt-40 rounded-lg border bg-card p-4">
            <dt className="flex flex-wrap items-baseline gap-x-2">
              <span className="text-base font-semibold">{t.term}</span>
              {t.aka && <span className="text-xs text-muted-foreground">also: {t.aka.join(', ')}</span>}
            </dt>
            <dd className="mt-1.5 space-y-2 text-sm leading-6">
              <p>{t.definition}</p>
              {t.formula && <p className="formula inline-block max-w-full overflow-x-auto whitespace-pre-wrap text-xs sm:text-sm">{t.formula}</p>}
              {t.example && <p className="text-muted-foreground">Example: {t.example}</p>}
              <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
                <Link to={`/learn/${t.module}`} className="font-medium text-primary underline underline-offset-2">Module {moduleById[t.module].n}</Link>
                {t.related?.filter((r) => known.has(r)).map((r) => (
                  <button key={r} type="button" onClick={() => { setQ(r); setMod('all'); }} className="text-muted-foreground underline underline-offset-2 hover:text-foreground">
                    {r}
                  </button>
                ))}
              </p>
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
