import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, MousePointerClick } from 'lucide-react';

export function Section({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section id={id} className="space-y-4">
      <h2>
        <a href={`#${id}`} className="!font-semibold !text-foreground !no-underline hover:!underline">
          {title}
        </a>
      </h2>
      {children}
    </section>
  );
}

/** An embedded interactive, visually distinct from prose. */
export function TryIt({ title, children, lab }: { title: string; children: ReactNode; lab?: { to: string; label: string } }) {
  return (
    <div className="not-prose my-6 rounded-xl border-2 border-primary/25 bg-card p-4 shadow-sm sm:p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <p className="flex items-center gap-2 text-sm font-semibold text-primary">
          <MousePointerClick className="h-4 w-4" aria-hidden /> Try it — {title}
        </p>
        {lab && (
          <Link to={lab.to} className="flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground">
            {lab.label} <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        )}
      </div>
      <div className="text-[0.95rem] leading-6">{children}</div>
    </div>
  );
}

export function Formula({ children }: { children: ReactNode }) {
  return <div className="formula block overflow-x-auto whitespace-nowrap px-3 py-2 text-sm">{children}</div>;
}

export function Worked({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-lg border bg-muted/40 p-4">
      <p className="mb-2 text-sm font-semibold">Worked example — {title}</p>
      <div className="space-y-2 text-sm leading-6 [&_ul]:list-disc [&_ul]:pl-5">{children}</div>
    </div>
  );
}

export function Table({ head, rows }: { head: string[]; rows: ReactNode[][] }) {
  return (
    <div className="overflow-x-auto rounded-lg border">
      <table className="!my-0 min-w-[32rem]">
        <thead className="bg-muted/50">
          <tr>{head.map((h) => <th key={h}>{h}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>{r.map((c, j) => <td key={j}>{c}</td>)}</tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
