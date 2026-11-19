import { createStore, type StoreApi } from 'zustand/vanilla';
import { persist } from 'zustand/middleware';
import { dagPresets } from '../data/dagPresets';
import { hasEdge, wouldCreateCycle, type Dag, type DagNode } from '../lib/dag';

export interface DagWorkspace {
  dag: Dag;
  exposure: string | null;
  outcome: string | null;
  adjusted: string[];
}

export interface DagState extends DagWorkspace {
  presetId: string | null;
  load: (w: DagWorkspace, presetId?: string | null) => void;
  addNode: (label: string, x: number, y: number) => string;
  updateNode: (id: string, patch: Partial<DagNode>) => void;
  removeNode: (id: string) => void;
  /** Returns an error message if the edge cannot be added. */
  addEdge: (from: string, to: string) => string | null;
  removeEdge: (from: string, to: string) => void;
  reverseEdge: (from: string, to: string) => string | null;
  setExposure: (id: string | null) => void;
  setOutcome: (id: string | null) => void;
  toggleAdjusted: (id: string) => void;
  setAdjusted: (ids: string[]) => void;
}

export type DagStore = StoreApi<DagState>;

const clone = <T,>(x: T): T => JSON.parse(JSON.stringify(x)) as T;

function actions(set: StoreApi<DagState>['setState'], get: StoreApi<DagState>['getState']): Omit<DagState, keyof DagWorkspace | 'presetId'> {
  return {
    load: (w, presetId = null) => set({ ...clone(w), presetId }),
    addNode: (label, x, y) => {
      const clean = label.trim().slice(0, 28);
      const base = clean.replace(/\s+/g, '_') || 'V';
      const ids = new Set(get().dag.nodes.map((n) => n.id));
      let id = base;
      for (let i = 2; ids.has(id); i++) id = `${base}_${i}`;
      set((s) => ({ dag: { ...s.dag, nodes: [...s.dag.nodes, { id, label: clean || id, x, y }] } }));
      return id;
    },
    updateNode: (id, patch) => set((s) => ({ dag: { ...s.dag, nodes: s.dag.nodes.map((n) => (n.id === id ? { ...n, ...patch } : n)) } })),
    removeNode: (id) =>
      set((s) => ({
        dag: { nodes: s.dag.nodes.filter((n) => n.id !== id), edges: s.dag.edges.filter((e) => e.from !== id && e.to !== id) },
        exposure: s.exposure === id ? null : s.exposure,
        outcome: s.outcome === id ? null : s.outcome,
        adjusted: s.adjusted.filter((a) => a !== id),
      })),
    addEdge: (from, to) => {
      const { dag } = get();
      if (from === to) return 'An arrow cannot start and end at the same variable.';
      if (hasEdge(dag, from, to)) return 'That arrow already exists.';
      if (hasEdge(dag, to, from)) return 'An arrow already points the other way — reverse it instead.';
      if (wouldCreateCycle(dag, from, to)) return 'Not allowed: this arrow would create a cycle (a variable cannot cause itself). Represent feedback by time-indexed nodes, e.g. BP₁ → Drug₂ → BP₃.';
      set((s) => ({ dag: { ...s.dag, edges: [...s.dag.edges, { from, to }] } }));
      return null;
    },
    removeEdge: (from, to) => set((s) => ({ dag: { ...s.dag, edges: s.dag.edges.filter((e) => !(e.from === from && e.to === to)) } })),
    reverseEdge: (from, to) => {
      const without: Dag = { ...get().dag, edges: get().dag.edges.filter((e) => !(e.from === from && e.to === to)) };
      if (wouldCreateCycle(without, to, from)) return 'Reversing this arrow would create a cycle.';
      set({ dag: { ...without, edges: [...without.edges, { from: to, to: from }] } });
      return null;
    },
    setExposure: (id) => set((s) => ({ exposure: id, outcome: s.outcome === id ? null : s.outcome, adjusted: s.adjusted.filter((a) => a !== id) })),
    setOutcome: (id) => set((s) => ({ outcome: id, exposure: s.exposure === id ? null : s.exposure, adjusted: s.adjusted.filter((a) => a !== id) })),
    toggleAdjusted: (id) => set((s) => ({ adjusted: s.adjusted.includes(id) ? s.adjusted.filter((a) => a !== id) : [...s.adjusted, id] })),
    setAdjusted: (ids) => set({ adjusted: ids }),
  };
}

/** An ephemeral workspace (e.g. embedded in a lesson). */
export function createDagStore(initial: DagWorkspace, presetId: string | null = null): DagStore {
  return createStore<DagState>()((set, get) => ({ ...clone(initial), presetId, ...actions(set, get) }));
}

/** The DAG Lab's workspace, saved in the browser. First visit opens the confounding example. */
export const dagLabStore: DagStore = createStore<DagState>()(
  persist((set, get) => ({ ...clone(dagPresets[0].workspace), presetId: dagPresets[0].id, ...actions(set, get) }), {
    name: 'epiworlds-dag',
    version: 1,
    partialize: (s) => ({ dag: s.dag, exposure: s.exposure, outcome: s.outcome, adjusted: s.adjusted, presetId: s.presetId }),
  })
);
