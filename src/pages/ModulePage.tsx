import { Suspense } from 'react';
import { Link, useParams } from 'react-router-dom';
import { AlertTriangle, ArrowLeft, ArrowRight, CheckCircle2, Clock, Target } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { RefList } from '../components/RefList';
import { QuestionCard } from '../components/interactives/QuestionCard';
import { Button } from '../components/ui/Button';
import { buttonClasses } from '../components/ui/buttonClasses';
import { lessons } from '../content/lessons';
import { moduleById, modules, type ModuleId } from '../data/curriculum';
import { questionsByModule } from '../data/questions';
import { useMastery } from '../lib/progress';
import { useProgressStore } from '../stores/useProgressStore';
import NotFound from './NotFound';

export default function ModulePage() {
  const { moduleId } = useParams();
  const meta = moduleId && moduleId in moduleById ? moduleById[moduleId as ModuleId] : null;
  const completed = useProgressStore((s) => s.completed);
  const setComplete = useProgressStore((s) => s.setComplete);
  const mastery = useMastery();
  if (!meta) return <NotFound />;

  const Lesson = lessons[meta.id];
  const qs = questionsByModule(meta.id);
  const idx = modules.findIndex((m) => m.id === meta.id);
  const prev = modules[idx - 1];
  const next = modules[idx + 1];
  const done = completed.includes(meta.id);
  const ms = mastery[meta.id];

  return (
    <article>
      <PageHeader eyebrow={`Module ${meta.n} of ${modules.length}`} title={meta.title}>
        {meta.outcome}
      </PageHeader>

      <div className="mb-10 grid gap-4 rounded-xl border bg-card p-4 sm:grid-cols-[1fr_auto] sm:p-5">
        <div>
          <p className="mb-2 flex items-center gap-2 text-sm font-semibold"><Target className="h-4 w-4 text-primary" aria-hidden /> You will be able to</p>
          <ul className="list-disc space-y-1 pl-5 text-sm leading-6">
            {meta.objectives.map((o) => <li key={o}>{o}</li>)}
          </ul>
        </div>
        <div className="flex flex-row gap-4 text-xs text-muted-foreground sm:flex-col sm:text-right">
          <span className="flex items-center gap-1 sm:justify-end"><Clock className="h-3.5 w-3.5" />{meta.minutes} min</span>
          {meta.prerequisites.length > 0 && (
            <span>
              Builds on{' '}
              {meta.prerequisites.map((p, i) => (
                <span key={p}>
                  {i > 0 && ', '}
                  <Link to={`/learn/${p}`} className="underline underline-offset-2 hover:text-foreground">{moduleById[p].n}. {moduleById[p].title}</Link>
                </span>
              ))}
            </span>
          )}
        </div>
      </div>

      <div className="prose-epi">
        <Suspense fallback={<p className="text-sm text-muted-foreground">Loading lesson…</p>}>
          <Lesson />
        </Suspense>
      </div>

      <section className="mt-14 space-y-4" aria-labelledby="checkpoint">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <h2 id="checkpoint" className="text-xl font-semibold sm:text-2xl">Checkpoint</h2>
          <p className="text-sm text-muted-foreground">{ms.correct}/{ms.total} correct on your latest attempts</p>
        </div>
        <p className="text-sm text-muted-foreground">Answer before reading the rationale. Retake any time in <Link to={`/assessments?module=${meta.id}`} className="underline underline-offset-2">Practice</Link>.</p>
        <div className="space-y-4">
          {qs.map((q, i) => (
            <QuestionCard key={q.id} q={q} index={i} total={qs.length} />
          ))}
        </div>
      </section>

      <section className="mt-14 grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border bg-card p-4 sm:p-5">
          <h2 className="mb-3 flex items-center gap-2 font-semibold"><CheckCircle2 className="h-5 w-5 text-good" aria-hidden />Takeaways</h2>
          <ul className="list-disc space-y-2 pl-5 text-sm leading-6">
            {meta.takeaways.map((t) => <li key={t}>{t}</li>)}
          </ul>
        </div>
        <div className="rounded-xl border bg-card p-4 sm:p-5">
          <h2 className="mb-3 flex items-center gap-2 font-semibold"><AlertTriangle className="h-5 w-5 text-warn" aria-hidden />Pitfalls</h2>
          <ul className="list-disc space-y-2 pl-5 text-sm leading-6">
            {meta.pitfalls.map((t) => <li key={t}>{t}</li>)}
          </ul>
        </div>
      </section>

      <section className="mt-10 rounded-xl border bg-card p-4 sm:p-5">
        <h2 className="mb-3 font-semibold">Sources</h2>
        <RefList ids={meta.references} />
      </section>

      <div className="mt-10 flex flex-col gap-4 border-t pt-6 sm:flex-row sm:items-center sm:justify-between">
        <Button variant={done ? 'outline' : 'default'} onClick={() => setComplete(meta.id, !done)}>
          <CheckCircle2 className="h-4 w-4" /> {done ? 'Completed — mark as not done' : 'Mark module complete'}
        </Button>
        <div className="flex min-w-0 gap-2">
          {prev && (
            <Link to={`/learn/${prev.id}`} className={buttonClasses('ghost', 'md', 'shrink-0')} aria-label={`Previous: ${prev.title}`}>
              <ArrowLeft className="h-4 w-4" /> {prev.n}
            </Link>
          )}
          {next && (
            <Link to={`/learn/${next.id}`} className={buttonClasses('outline', 'md', '!h-auto min-h-10 min-w-0 flex-1 !whitespace-normal py-2 text-left')}>
              <span className="min-w-0">Next: {next.title}</span> <ArrowRight className="h-4 w-4 shrink-0" />
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}
