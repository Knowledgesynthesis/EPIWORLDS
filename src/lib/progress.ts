import { useMemo } from 'react';
import { modules, type ModuleId } from '../data/curriculum';
import { questions } from '../data/questions';
import { useProgressStore } from '../stores/useProgressStore';

export interface Mastery {
  total: number;
  answered: number;
  /** Questions whose most recent attempt was correct. */
  correct: number;
}

/** Per-module mastery from the learner's answer history. */
export function useMastery(): Record<ModuleId, Mastery> {
  const answers = useProgressStore((s) => s.answers);
  return useMemo(() => {
    const out = {} as Record<ModuleId, Mastery>;
    for (const m of modules) out[m.id] = { total: 0, answered: 0, correct: 0 };
    for (const q of questions) {
      const r = out[q.module];
      r.total++;
      const a = answers[q.id];
      if (a) {
        r.answered++;
        if (a.correct) r.correct++;
      }
    }
    return out;
  }, [answers]);
}
