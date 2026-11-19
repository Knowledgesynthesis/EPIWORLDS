import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Attempt {
  /** Whether the most recent attempt was correct. */
  correct: boolean;
  attempts: number;
  everCorrect: boolean;
  at: number;
}

interface ProgressStore {
  answers: Record<string, Attempt>;
  completed: string[];
  record: (questionId: string, correct: boolean) => void;
  setComplete: (moduleId: string, done: boolean) => void;
  reset: () => void;
}

export const useProgressStore = create<ProgressStore>()(
  persist(
    (set) => ({
      answers: {},
      completed: [],
      record: (id, correct) =>
        set((s) => {
          const prev = s.answers[id];
          return {
            answers: {
              ...s.answers,
              [id]: { correct, attempts: (prev?.attempts ?? 0) + 1, everCorrect: correct || !!prev?.everCorrect, at: Date.now() },
            },
          };
        }),
      setComplete: (moduleId, done) =>
        set((s) => ({
          completed: done ? [...new Set([...s.completed, moduleId])] : s.completed.filter((m) => m !== moduleId),
        })),
      reset: () => set({ answers: {}, completed: [] }),
    }),
    { name: 'epiworlds-progress', version: 1 }
  )
);
