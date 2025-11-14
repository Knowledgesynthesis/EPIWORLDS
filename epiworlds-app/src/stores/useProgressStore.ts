import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ProgressStore {
  completedModules: Set<string>;
  assessmentScores: Record<string, number>;
  currentModule: string | null;
  totalTimeSpent: number;

  completeModule: (moduleId: string) => void;
  setAssessmentScore: (assessmentId: string, score: number) => void;
  setCurrentModule: (moduleId: string | null) => void;
  addTimeSpent: (minutes: number) => void;
  resetProgress: () => void;
  isModuleCompleted: (moduleId: string) => boolean;
}

export const useProgressStore = create<ProgressStore>()(
  persist(
    (set, get) => ({
      completedModules: new Set<string>(),
      assessmentScores: {},
      currentModule: null,
      totalTimeSpent: 0,

      completeModule: (moduleId) => {
        set((state) => ({
          completedModules: new Set(state.completedModules).add(moduleId),
        }));
      },

      setAssessmentScore: (assessmentId, score) => {
        set((state) => ({
          assessmentScores: {
            ...state.assessmentScores,
            [assessmentId]: score,
          },
        }));
      },

      setCurrentModule: (moduleId) => {
        set({ currentModule: moduleId });
      },

      addTimeSpent: (minutes) => {
        set((state) => ({
          totalTimeSpent: state.totalTimeSpent + minutes,
        }));
      },

      resetProgress: () => {
        set({
          completedModules: new Set<string>(),
          assessmentScores: {},
          currentModule: null,
          totalTimeSpent: 0,
        });
      },

      isModuleCompleted: (moduleId) => {
        return get().completedModules.has(moduleId);
      },
    }),
    {
      name: 'progress-storage',
      partialize: (state) => ({
        completedModules: Array.from(state.completedModules),
        assessmentScores: state.assessmentScores,
        currentModule: state.currentModule,
        totalTimeSpent: state.totalTimeSpent,
      }),
      merge: (persistedState: any, currentState) => ({
        ...currentState,
        ...persistedState,
        completedModules: new Set(persistedState?.completedModules || []),
      }),
    }
  )
);
