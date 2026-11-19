import { Link } from 'react-router-dom';
import { ArrowRight, Calculator, CheckCircle2, FlaskConical, GraduationCap, Microscope, Network, Sigma } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { buttonClasses } from '../components/ui/buttonClasses';
import { modules } from '../data/curriculum';
import { questions } from '../data/questions';
import { useMastery } from '../lib/progress';
import { cn } from '../lib/utils';
import { useProgressStore } from '../stores/useProgressStore';

const labs = [
  { to: '/dag-builder', title: 'DAG Lab', text: 'Draw causal diagrams; see every path, which are open, and the minimal adjustment sets.', icon: Network },
  { to: '/confounding-lab', title: 'Confounding & EM Lab', text: 'Build confounding from its parts, watch Simpson\'s paradox appear, and test interaction on both scales.', icon: FlaskConical },
  { to: '/bias-lab', title: 'Bias Lab', text: 'Berkson\'s bias, loss to follow-up, misclassification, immortal time and lead time — with the numbers.', icon: Microscope },
  { to: '/study-sandbox', title: 'Study Simulator', text: 'Run 100 studies at once to separate random error from bias; plan sample size.', icon: Sigma },
  { to: '/calculators', title: 'Calculators', text: '2×2 measures with proper CIs, OR vs RR, E-values and power — with the arithmetic shown.', icon: Calculator },
];

export default function Home() {
  const completed = useProgressStore((s) => s.completed);
  const answers = useProgressStore((s) => s.answers);
  const mastery = useMastery();
  const next = modules.find((m) => !completed.includes(m.id)) ?? modules[0];
  const answered = Object.keys(answers).length;
  const correct = Object.values(answers).filter((a) => a.correct).length;
  const started = answered > 0 || completed.length > 0;

  return (
    <div className="space-y-12">
      <PageHeader eyebrow="Clinical epidemiology & causal inference" title="Learn to judge whether X really causes Y">
        Eleven sequenced modules take you from a 2×2 table to target trial emulation. Every concept comes with a simulation you can break, worked numbers, and questions that check you can apply it.
      </PageHeader>

      <section className="grid gap-4 md:grid-cols-[1.4fr_1fr]">
        <div className="rounded-xl border bg-card p-5 sm:p-6">
          <p className="text-sm font-medium text-muted-foreground">{started ? 'Continue' : 'Start here'}</p>
          <p className="mt-1 text-xl font-semibold">
            Module {next.n}: {next.title}
          </p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">{next.outcome}</p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link to={`/learn/${next.id}`} className={buttonClasses('default', 'md')}>
              {started ? 'Continue' : 'Begin module 1'} <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/learn" className={buttonClasses('outline', 'md')}>
              Course map
            </Link>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl border bg-card p-4">
            <p className="text-xs font-medium text-muted-foreground">Modules completed</p>
            <p className="tabular mt-1 text-3xl font-semibold">{completed.length}<span className="text-base text-muted-foreground">/{modules.length}</span></p>
          </div>
          <div className="rounded-xl border bg-card p-4">
            <p className="text-xs font-medium text-muted-foreground">Questions right</p>
            <p className="tabular mt-1 text-3xl font-semibold">{correct}<span className="text-base text-muted-foreground">/{questions.length}</span></p>
          </div>
          <Link to="/assessments" className="col-span-2 flex items-center justify-between rounded-xl border bg-card p-4 hover:border-primary">
            <span>
              <span className="block text-sm font-semibold">Practice & exams</span>
              <span className="text-xs text-muted-foreground">{questions.length} questions with rationales{answered ? ` · ${answered} attempted` : ''}</span>
            </span>
            <GraduationCap className="h-6 w-6 text-primary" />
          </Link>
        </div>
      </section>

      <section>
        <h2 className="mb-1 text-xl font-semibold">The course</h2>
        <p className="mb-4 text-sm text-muted-foreground">Each module: concise lesson → interactive → checkpoint questions → takeaways and pitfalls → sources.</p>
        <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {modules.map((m) => {
            const ms = mastery[m.id];
            const done = completed.includes(m.id);
            return (
              <li key={m.id}>
                <Link to={`/learn/${m.id}`} className="group flex h-full flex-col rounded-lg border bg-card p-4 transition-colors hover:border-primary">
                  <div className="flex items-center justify-between">
                    <span className={cn('flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold', done ? 'bg-good/15 text-good' : 'bg-muted text-muted-foreground')}>
                      {done ? <CheckCircle2 className="h-4 w-4" aria-label="completed" /> : m.n}
                    </span>
                    <span className="text-xs text-muted-foreground">{m.minutes} min</span>
                  </div>
                  <p className="mt-3 font-semibold leading-snug group-hover:text-primary">{m.title}</p>
                  <p className="mt-1 flex-1 text-sm leading-6 text-muted-foreground">{m.outcome}</p>
                  <div className="mt-3">
                    <div className="h-1.5 overflow-hidden rounded-full bg-muted" role="progressbar" aria-valuemin={0} aria-valuemax={ms.total} aria-valuenow={ms.correct} aria-label={`${m.title} mastery`}>
                      <div className="h-full rounded-full bg-primary" style={{ width: `${(ms.correct / Math.max(1, ms.total)) * 100}%` }} />
                    </div>
                    <p className="mt-1 text-[11px] text-muted-foreground">{ms.correct}/{ms.total} checkpoint questions correct</p>
                  </div>
                </Link>
              </li>
            );
          })}
        </ol>
      </section>

      <section>
        <h2 className="mb-4 text-xl font-semibold">Labs</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {labs.map(({ to, title, text, icon: Icon }) => (
            <Link key={to} to={to} className="group rounded-lg border bg-card p-4 transition-colors hover:border-primary">
              <Icon className="h-6 w-6 text-primary" aria-hidden />
              <p className="mt-3 font-semibold group-hover:text-primary">{title}</p>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">{text}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="rounded-xl border bg-card p-5 sm:p-6">
        <h2 className="text-lg font-semibold">Built on current evidence</h2>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Methods follow Modern Epidemiology (4th ed.) and Hernán & Robins' <em>Causal Inference: What If</em>. Standards are current to late 2026: CONSORT 2025, SPIRIT 2025, TARGET 2025, ROBINS-I V2, the 2024 Declaration of Helsinki and ICH E6(R3). Every calculation is unit-tested against published worked examples, and every source links to its DOI.
        </p>
        <Link to="/reference" className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">
          Formulas & sources <ArrowRight className="h-4 w-4" />
        </Link>
      </section>
    </div>
  );
}
