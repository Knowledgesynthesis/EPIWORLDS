import { Link } from 'react-router-dom';
import { CheckCircle2, Clock } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { Badge } from '../components/ui/Badge';
import { moduleById, modules } from '../data/curriculum';
import { useMastery } from '../lib/progress';
import { cn } from '../lib/utils';
import { useProgressStore } from '../stores/useProgressStore';

export default function Learn() {
  const completed = useProgressStore((s) => s.completed);
  const mastery = useMastery();
  const total = modules.reduce((a, m) => a + m.minutes, 0);
  return (
    <div>
      <PageHeader eyebrow={`${modules.length} modules · about ${Math.round(total / 60)} hours`} title="Course map">
        Modules build on each other — prerequisites are listed for each. Work through them in order the first time; return to any module from the menu.
      </PageHeader>
      <ol className="relative space-y-4 border-l-2 border-muted pl-6">
        {modules.map((m) => {
          const ms = mastery[m.id];
          const done = completed.includes(m.id);
          return (
            <li key={m.id} className="relative">
              <span
                className={cn('absolute -left-[2.15rem] top-4 flex h-7 w-7 items-center justify-center rounded-full border-2 bg-background text-xs font-semibold', done ? 'border-good text-good' : 'border-muted text-muted-foreground')}
                aria-hidden
              >
                {done ? <CheckCircle2 className="h-4 w-4" /> : m.n}
              </span>
              <Link to={`/learn/${m.id}`} className="block rounded-lg border bg-card p-4 transition-colors hover:border-primary sm:p-5">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-semibold">Module {m.n}: {m.title}</p>
                  {done && <Badge variant="good">Completed</Badge>}
                </div>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">{m.outcome}</p>
                <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{m.minutes} min</span>
                  <span>{ms.correct}/{ms.total} questions correct</span>
                  {m.prerequisites.length > 0 && <span>Builds on: {m.prerequisites.map((p) => moduleById[p].n).join(', ')}</span>}
                </div>
              </Link>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
