import { useMemo, useState } from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';
import { isCorrect, type Question } from '../../data/questions';
import { mulberry32 } from '../../lib/stats';
import { cn } from '../../lib/utils';
import { useProgressStore } from '../../stores/useProgressStore';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { RefInline } from '../RefList';

const levelLabel = { 1: 'Recall', 2: 'Apply', 3: 'Analyse' } as const;

/** Stable, per-question shuffle so the correct option is not always in the same slot. */
function shuffledOrder(q: Question): number[] {
  if (q.type !== 'mcq') return [];
  let seed = 0;
  for (const ch of q.id) seed = (seed * 31 + ch.charCodeAt(0)) >>> 0;
  const rng = mulberry32(seed);
  const idx = q.options.map((_, i) => i);
  for (let i = idx.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [idx[i], idx[j]] = [idx[j], idx[i]];
  }
  return idx;
}

interface QuestionCardProps {
  q: Question;
  index?: number;
  total?: number;
  /** Exam mode: no feedback until the session ends. */
  deferFeedback?: boolean;
  onAnswered?: (correct: boolean) => void;
}

export function QuestionCard({ q, index, total, deferFeedback, onAnswered }: QuestionCardProps) {
  const record = useProgressStore((s) => s.record);
  const order = useMemo(() => shuffledOrder(q), [q]);
  const [choice, setChoice] = useState<number | null>(null);
  const [numeric, setNumeric] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const response = q.type === 'mcq' ? choice : numeric.trim() === '' ? null : Number(numeric.replace(',', '.'));
  const correct = response !== null && Number.isFinite(response) && isCorrect(q, response);
  const showFeedback = submitted && !deferFeedback;

  const submit = () => {
    if (response === null || !Number.isFinite(response) || submitted) return;
    setSubmitted(true);
    record(q.id, correct);
    onAnswered?.(correct);
  };

  return (
    <div className="rounded-lg border bg-card p-4 sm:p-5">
      <div className="mb-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
        {index !== undefined && total !== undefined && (
          <span className="font-medium text-foreground">
            Question {index + 1} of {total}
          </span>
        )}
        <Badge variant="outline">{levelLabel[q.level]}</Badge>
        {q.type === 'numeric' && <Badge variant="outline">Calculation</Badge>}
      </div>
      <p className="font-medium leading-7">{q.stem}</p>

      {q.type === 'mcq' ? (
        <div role="radiogroup" aria-label="Answer options" className="mt-4 space-y-2">
          {order.map((orig) => {
            const selected = choice === orig;
            const isAnswer = orig === q.answer;
            return (
              <button
                key={orig}
                type="button"
                role="radio"
                aria-checked={selected}
                disabled={submitted}
                onClick={() => setChoice(orig)}
                className={cn(
                  'flex w-full items-start gap-3 rounded-md border p-3 text-left text-sm leading-6 transition-colors',
                  !submitted && (selected ? 'border-primary bg-accent' : 'hover:border-primary/60 hover:bg-accent/50'),
                  showFeedback && isAnswer && 'border-good bg-good/10',
                  showFeedback && selected && !isAnswer && 'border-bad bg-bad/10',
                  submitted && deferFeedback && selected && 'border-primary bg-accent',
                  submitted && 'cursor-default'
                )}
              >
                <span
                  className={cn(
                    'mt-1 h-3.5 w-3.5 shrink-0 rounded-full border-2',
                    selected ? 'border-primary bg-primary' : 'border-input'
                  )}
                  aria-hidden
                />
                <span className="flex-1">{q.options[orig]}</span>
                {showFeedback && isAnswer && <CheckCircle2 className="h-5 w-5 shrink-0 text-good" aria-label="Correct answer" />}
                {showFeedback && selected && !isAnswer && <XCircle className="h-5 w-5 shrink-0 text-bad" aria-label="Your answer" />}
              </button>
            );
          })}
        </div>
      ) : (
        <div className="mt-4 flex flex-wrap items-end gap-3">
          <label className="text-sm">
            <span className="mb-1 block text-xs font-medium text-muted-foreground">Your answer{q.unit ? ` (${q.unit})` : ''}</span>
            <input
              type="text"
              inputMode="decimal"
              value={numeric}
              disabled={submitted}
              onChange={(e) => setNumeric(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && submit()}
              className="tabular h-10 w-40 rounded-md border border-input bg-background px-3 text-base"
              placeholder="e.g. 2.5"
            />
          </label>
        </div>
      )}

      {!submitted && (
        <Button className="mt-4" onClick={submit} disabled={response === null || !Number.isFinite(response)}>
          {deferFeedback ? 'Save answer' : 'Check answer'}
        </Button>
      )}

      {submitted && deferFeedback && <p className="mt-4 text-sm text-muted-foreground">Answer saved.</p>}

      {showFeedback && (
        <div className={cn('mt-4 rounded-md border-l-4 p-3 text-sm leading-6', correct ? 'border-l-good bg-good/10' : 'border-l-bad bg-bad/10')} role="status">
          <p className="flex items-center gap-1.5 font-semibold">
            {correct ? <CheckCircle2 className="h-4 w-4 text-good" aria-hidden /> : <XCircle className="h-4 w-4 text-bad" aria-hidden />}
            {correct ? 'Correct' : q.type === 'numeric' ? `Not quite — answer: ${q.answer}${q.unit ? ' ' + q.unit : ''}` : 'Not quite'}
          </p>
          <p className="mt-1">{q.explanation}</p>
          {q.refs && q.refs.length > 0 && <RefInline ids={q.refs} className="mt-2" />}
        </div>
      )}
    </div>
  );
}
