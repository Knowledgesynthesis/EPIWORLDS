import { ExternalLink } from 'lucide-react';
import { referenceById, referenceHref, referenceShort } from '../data/references';
import { cn } from '../lib/utils';

/** Full citations with links (DOI preferred). */
export function RefList({ ids, className }: { ids: string[]; className?: string }) {
  const refs = ids.map((id) => referenceById[id]).filter(Boolean);
  return (
    <ol className={cn('space-y-2 text-sm', className)}>
      {refs.map((r) => (
        <li key={r.id} className="leading-6">
          <a href={referenceHref(r)} target="_blank" rel="noreferrer" className="group inline text-foreground/90 hover:text-primary">
            {r.citation}
            <ExternalLink className="ml-1 inline h-3 w-3 opacity-50 group-hover:opacity-100" aria-hidden />
          </a>
          {r.note && <span className="block text-xs text-muted-foreground">{r.note}</span>}
        </li>
      ))}
    </ol>
  );
}

/** Compact "Sources:" line for feedback panels. */
export function RefInline({ ids, className }: { ids: string[]; className?: string }) {
  const refs = ids.map((id) => referenceById[id]).filter(Boolean);
  return (
    <p className={cn('text-xs text-muted-foreground', className)}>
      Source{refs.length > 1 ? 's' : ''}:{' '}
      {refs.map((r, i) => {
        return (
          <span key={r.id}>
            {i > 0 && '; '}
            <a href={referenceHref(r)} target="_blank" rel="noreferrer" className="underline underline-offset-2 hover:text-foreground" title={r.citation}>
              {referenceShort(r)}
            </a>
          </span>
        );
      })}
    </p>
  );
}
