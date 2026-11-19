import { useState } from 'react';
import { Link } from 'react-router-dom';
import { PageHeader } from '../components/PageHeader';
import { DesignChooser } from '../components/interactives/DesignChooser';
import { Badge } from '../components/ui/Badge';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { designs } from '../data/designs';
import { cn } from '../lib/utils';

export default function StudyDesigns() {
  const [open, setOpen] = useState<string>(designs[0].id);
  const d = designs.find((x) => x.id === open)!;
  return (
    <div className="space-y-10">
      <PageHeader eyebrow="Reference" title="Study designs">
        What each design samples, what it can estimate, where it fails, and which guideline it is reported with. Theory is in <Link to="/learn/study-designs" className="text-primary underline underline-offset-2">Module 2</Link>.
      </PageHeader>

      <Card>
        <CardHeader><CardTitle>Which design fits my question?</CardTitle></CardHeader>
        <CardContent><DesignChooser /></CardContent>
      </Card>

      <section>
        <h2 className="mb-4 text-xl font-semibold">Design catalogue</h2>
        <div className="grid gap-4 lg:grid-cols-[16rem_1fr]">
          <div className="flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible lg:pb-0" role="tablist" aria-label="Designs">
            {designs.map((x) => (
              <button
                key={x.id}
                type="button"
                role="tab"
                aria-selected={open === x.id}
                onClick={() => setOpen(x.id)}
                className={cn('shrink-0 rounded-md border px-3 py-2 text-left text-sm transition-colors', open === x.id ? 'border-primary bg-accent font-medium' : 'hover:bg-accent/50')}
              >
                {x.name}
              </button>
            ))}
          </div>
          <Card role="tabpanel">
            <CardHeader>
              <div className="flex flex-wrap items-center gap-2">
                <CardTitle className="text-xl">{d.name}</CardTitle>
                <Badge variant="secondary">{d.family}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 text-sm leading-6">
              <dl className="grid gap-3 sm:grid-cols-[9rem_1fr]">
                <dt className="font-semibold">Sampling</dt><dd>{d.sampling}</dd>
                <dt className="font-semibold">Estimates</dt><dd>{d.estimates}</dd>
                <dt className="font-semibold">Best for</dt><dd>{d.bestFor}</dd>
                <dt className="font-semibold">Report with</dt><dd>{d.guideline}</dd>
                <dt className="font-semibold">Example</dt><dd>{d.example}</dd>
              </dl>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="mb-1 font-semibold text-good">Strengths</p>
                  <ul className="list-disc space-y-1 pl-5">{d.strengths.map((s) => <li key={s}>{s}</li>)}</ul>
                </div>
                <div>
                  <p className="mb-1 font-semibold text-bad">Main threats</p>
                  <ul className="list-disc space-y-1 pl-5">{d.threats.map((s) => <li key={s}>{s}</li>)}</ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-xl font-semibold">At a glance</h2>
        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full min-w-[44rem] text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-3 py-2 text-left font-semibold">Design</th>
                <th className="px-3 py-2 text-left font-semibold">Estimates</th>
                <th className="px-3 py-2 text-left font-semibold">Biggest threat</th>
                <th className="px-3 py-2 text-left font-semibold">Guideline</th>
              </tr>
            </thead>
            <tbody>
              {designs.map((x) => (
                <tr key={x.id} className="border-t align-top">
                  <td className="px-3 py-2 font-medium">{x.name}</td>
                  <td className="px-3 py-2">{x.estimates.split(';')[0]}</td>
                  <td className="px-3 py-2">{x.threats[0]}</td>
                  <td className="px-3 py-2 text-muted-foreground">{x.guideline}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
