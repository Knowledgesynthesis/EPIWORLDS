import { useId } from 'react';
import type { Table2x2 } from '../../lib/epi';
import { cn, fmtCount } from '../../lib/utils';

interface TwoByTwoProps {
  t: Table2x2;
  title?: string;
  exposureLabel?: string;
  outcomeLabel?: string;
  /** Labels for the outcome columns, e.g. ['Cases', 'Controls']. */
  columns?: [string, string];
  rows?: [string, string];
  editable?: boolean;
  onChange?: (t: Table2x2) => void;
  showRisk?: boolean;
  className?: string;
}

/** A labelled 2×2 table (rows = exposure, columns = outcome). Doubles as the chart "table view". */
export function TwoByTwo({ t, title, exposureLabel = 'Exposure', outcomeLabel = 'Outcome', columns = ['Outcome +', 'Outcome −'], rows = ['Exposed', 'Unexposed'], editable, onChange, showRisk = true, className }: TwoByTwoProps) {
  const uid = useId();
  const n1 = t.a + t.b;
  const n0 = t.c + t.d;
  const cell = (key: keyof Table2x2, letter: string) =>
    editable ? (
      <td className="p-1">
        <label className="sr-only" htmlFor={`${uid}-${key}`}>{`Cell ${letter}`}</label>
        <input
          id={`${uid}-${key}`}
          type="number"
          inputMode="numeric"
          min={0}
          step={1}
          value={t[key]}
          onChange={(e) => {
            const v = Math.max(0, Math.round(Number(e.target.value) || 0));
            onChange?.({ ...t, [key]: v });
          }}
          className="tabular h-10 w-full min-w-[3.5rem] rounded-md border border-input bg-background px-1 text-center text-base font-semibold"
        />
      </td>
    ) : (
      <td className="tabular px-3 py-2 text-center font-semibold">
        <span className="mr-1 text-[10px] font-normal text-muted-foreground">{letter}</span>
        {fmtCount(t[key])}
      </td>
    );
  return (
    <div className={cn('overflow-x-auto', className)}>
      <table className="w-full min-w-[15rem] border-collapse text-sm [&_td]:px-2 [&_th]:px-2 sm:[&_td]:px-3 sm:[&_th]:px-3">
        {title && <caption className="mb-2 text-left text-sm font-semibold">{title}</caption>}
        <thead>
          <tr className="border-b">
            <th scope="col" className="px-3 py-2 text-left text-[11px] font-medium leading-tight text-muted-foreground">
              <span className="sr-only sm:not-sr-only">{exposureLabel} ↓ / {outcomeLabel} →</span>
            </th>
            <th scope="col" className="px-3 py-2 text-center font-semibold">{columns[0]}</th>
            <th scope="col" className="px-3 py-2 text-center font-semibold">{columns[1]}</th>
            <th scope="col" className="hidden px-3 py-2 text-center text-xs font-medium text-muted-foreground sm:table-cell">Total</th>
            {showRisk && <th scope="col" className="px-3 py-2 text-center text-xs font-medium text-muted-foreground">Risk</th>}
          </tr>
        </thead>
        <tbody>
          <tr className="border-b">
            <th scope="row" className="px-3 py-2 text-left font-semibold">{rows[0]}</th>
            {cell('a', 'a')}
            {cell('b', 'b')}
            <td className="tabular hidden px-3 py-2 text-center text-muted-foreground sm:table-cell">{fmtCount(n1)}</td>
            {showRisk && <td className="tabular px-3 py-2 text-center">{n1 ? ((t.a / n1) * 100).toFixed(1) + '%' : '—'}</td>}
          </tr>
          <tr className="border-b">
            <th scope="row" className="px-3 py-2 text-left font-semibold">{rows[1]}</th>
            {cell('c', 'c')}
            {cell('d', 'd')}
            <td className="tabular hidden px-3 py-2 text-center text-muted-foreground sm:table-cell">{fmtCount(n0)}</td>
            {showRisk && <td className="tabular px-3 py-2 text-center">{n0 ? ((t.c / n0) * 100).toFixed(1) + '%' : '—'}</td>}
          </tr>
          <tr>
            <th scope="row" className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">Total</th>
            <td className="tabular px-3 py-2 text-center text-muted-foreground">{fmtCount(t.a + t.c)}</td>
            <td className="tabular px-3 py-2 text-center text-muted-foreground">{fmtCount(t.b + t.d)}</td>
            <td className="tabular hidden px-3 py-2 text-center text-muted-foreground sm:table-cell">{fmtCount(n1 + n0)}</td>
            {showRisk && <td />}
          </tr>
        </tbody>
      </table>
    </div>
  );
}
