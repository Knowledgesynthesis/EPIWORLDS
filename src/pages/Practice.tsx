import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowRight, CheckCircle2, RotateCcw, XCircle } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { QuestionCard } from '../components/interactives/QuestionCard';
import { Button } from '../components/ui/Button';
import { Segmented, Toggle } from '../components/ui/controls';
import { moduleById, modules, type ModuleId } from '../data/curriculum';
import { questions, type Question } from '../data/questions';
import { useMastery } from '../lib/progress';
import { cn } from '../lib/utils';
import { useProgressStore } from '../stores/useProgressStore';

type Mode = 'practice' | 'exam';

interface Session {
  id: number;
  mode: Mode;
  items: Question[];
  results: Record<string, boolean>;
  index: number;
  finished: boolean;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function Practice() {
  const [params] = useSearchParams();
  const initialModule = params.get('module');
  const [scope, setScope] = useState<string>(initialModule && initialModule in moduleById ? initialModule : 'all');
  const [count, setCount] = useState<'10' | '20' | 'all'>('10');
  const [mode, setMode] = useState<Mode>('practice');
  const [onlyMissed, setOnlyMissed] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const answers = useProgressStore((s) => s.answers);
  const reset = useProgressStore((s) => s.reset);
  const mastery = useMastery();

  const pool = questions.filter((q) => (scope === 'all' || q.module === scope) && (!onlyMissed || !answers[q.id]?.correct));

  const start = () => {
    const items = shuffle(pool).slice(0, count === 'all' ? pool.length : Number(count));
    setSession({ id: Date.now(), mode, items, results: {}, index: 0, finished: false });
  };

  if (session) {
    const q = session.items[session.index];
    const answered = q && q.id in session.results;
    const nCorrect = Object.values(session.results).filter(Boolean).length;
    if (session.finished) {
      const pct = Math.round((nCorrect / session.items.length) * 100);
      return (
        <div className="space-y-6">
          <PageHeader eyebrow={session.mode === 'exam' ? 'Exam result' : 'Practice result'} title={`${nCorrect} of ${session.items.length} correct (${pct}%)`}>
            {pct >= 80 ? 'Strong performance. Review any misses below, then move on.' : 'Review the rationales below, revisit the linked modules, then retry with "only questions I have not mastered".'}
          </PageHeader>
          <ol className="space-y-3">
            {session.items.map((item, i) => {
              const ok = session.results[item.id];
              return (
                <li key={item.id} className={cn('rounded-lg border p-4', ok ? 'border-good/40' : 'border-bad/40')}>
                  <p className="flex items-start gap-2 text-sm font-medium leading-6">
                    {ok ? <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-good" aria-label="correct" /> : <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-bad" aria-label="incorrect" />}
                    <span>{i + 1}. {item.stem}</span>
                  </p>
                  {!ok && (
                    <div className="mt-2 space-y-1 pl-6 text-sm leading-6">
                      <p><span className="font-semibold">Answer:</span> {item.type === 'mcq' ? item.options[item.answer] : `${item.answer}${item.unit ? ' ' + item.unit : ''}`}</p>
                      <p className="text-muted-foreground">{item.explanation}</p>
                      <Link to={`/learn/${item.module}`} className="text-xs font-medium text-primary underline underline-offset-2">
                        Module {moduleById[item.module].n}: {moduleById[item.module].title}
                      </Link>
                    </div>
                  )}
                </li>
              );
            })}
          </ol>
          <div className="flex flex-wrap gap-3">
            <Button onClick={start}><RotateCcw className="h-4 w-4" /> Another session</Button>
            <Button variant="outline" onClick={() => setSession(null)}>Back to setup</Button>
          </div>
        </div>
      );
    }
    return (
      <div className="space-y-5">
        <div className="flex items-center justify-between gap-3">
          <Button variant="ghost" size="sm" onClick={() => setSession(null)}>← Quit</Button>
          <span className="tabular text-sm text-muted-foreground">
            {session.index + 1} / {session.items.length}
            {session.mode === 'practice' && ` · ${nCorrect} correct`}
          </span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-muted" aria-hidden>
          <div className="h-full bg-primary transition-all" style={{ width: `${((session.index + (answered ? 1 : 0)) / session.items.length) * 100}%` }} />
        </div>
        <p className="text-xs text-muted-foreground">Module {moduleById[q.module].n}: {moduleById[q.module].title}</p>
        <QuestionCard
          key={`${session.id}-${q.id}`}
          q={q}
          deferFeedback={session.mode === 'exam'}
          onAnswered={(ok) => setSession((s) => (s ? { ...s, results: { ...s.results, [q.id]: ok } } : s))}
        />
        <div className="flex justify-end">
          <Button
            disabled={!answered}
            onClick={() =>
              setSession((s) => (s ? (s.index + 1 >= s.items.length ? { ...s, finished: true } : { ...s, index: s.index + 1 }) : s))
            }
          >
            {session.index + 1 >= session.items.length ? 'See results' : 'Next'} <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <PageHeader eyebrow={`${questions.length} questions`} title="Practice & exams">
        Every question has a rationale that addresses the tempting wrong answer. Practice mode gives feedback immediately; exam mode holds it until the end.
      </PageHeader>

      <section className="space-y-5 rounded-xl border bg-card p-4 sm:p-6">
        <div className="space-y-2">
          <label htmlFor="scope" className="text-sm font-medium">Topic</label>
          <select id="scope" value={scope} onChange={(e) => setScope(e.target.value)} className="block h-10 w-full max-w-md rounded-md border border-input bg-background px-3 text-sm">
            <option value="all">All modules (mixed)</option>
            {modules.map((m) => (
              <option key={m.id} value={m.id}>{m.n}. {m.title}</option>
            ))}
          </select>
        </div>
        <div className="flex flex-wrap gap-6">
          <div className="space-y-2">
            <p className="text-sm font-medium">Mode</p>
            <Segmented label="Mode" value={mode} onChange={setMode} options={[{ value: 'practice', label: 'Practice' }, { value: 'exam', label: 'Exam' }]} />
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium">Questions</p>
            <Segmented label="Number of questions" value={count} onChange={setCount} options={[{ value: '10', label: '10' }, { value: '20', label: '20' }, { value: 'all', label: 'All' }]} />
          </div>
        </div>
        <Toggle checked={onlyMissed} onChange={setOnlyMissed} label="Only questions I have not mastered" hint="Skips questions whose latest attempt was correct." />
        <div className="flex flex-wrap items-center gap-3">
          <Button size="lg" onClick={start} disabled={pool.length === 0}>
            Start ({Math.min(pool.length, count === 'all' ? pool.length : Number(count))} questions)
          </Button>
          {pool.length === 0 && <span className="text-sm text-good">Everything here is mastered.</span>}
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-xl font-semibold">Mastery by module</h2>
        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full min-w-[30rem] text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-3 py-2 text-left font-semibold">Module</th>
                <th className="px-3 py-2 text-left font-semibold">Correct</th>
                <th className="px-3 py-2 text-left font-semibold">Attempted</th>
                <th className="px-3 py-2" />
              </tr>
            </thead>
            <tbody>
              {modules.map((m) => {
                const ms = mastery[m.id as ModuleId];
                return (
                  <tr key={m.id} className="border-t">
                    <td className="px-3 py-2">{m.n}. {m.title}</td>
                    <td className="tabular px-3 py-2">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-20 overflow-hidden rounded-full bg-muted" aria-hidden>
                          <div className="h-full bg-primary" style={{ width: `${(ms.correct / ms.total) * 100}%` }} />
                        </div>
                        {ms.correct}/{ms.total}
                      </div>
                    </td>
                    <td className="tabular px-3 py-2 text-muted-foreground">{ms.answered}</td>
                    <td className="px-3 py-2 text-right">
                      <button type="button" className="text-xs font-medium text-primary underline underline-offset-2" onClick={() => setScope(m.id)}>
                        Practise
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <button
          type="button"
          className="mt-4 text-xs text-muted-foreground underline underline-offset-2 hover:text-bad"
          onClick={() => {
            if (window.confirm('Erase all answers and module completion on this device?')) reset();
          }}
        >
          Reset all progress
        </button>
      </section>
    </div>
  );
}
