import { create } from 'zustand';
import type { DAG, DAGNode, DAGEdge } from '../types';

interface DAGStore {
  currentDAG: DAG | null;
  selectedNodeId: string | null;
  selectedEdgeId: string | null;

  setDAG: (dag: DAG) => void;
  addNode: (node: DAGNode) => void;
  removeNode: (nodeId: string) => void;
  updateNode: (nodeId: string, updates: Partial<DAGNode>) => void;
  addEdge: (edge: DAGEdge) => void;
  removeEdge: (edgeId: string) => void;
  selectNode: (nodeId: string | null) => void;
  selectEdge: (edgeId: string | null) => void;
  clearDAG: () => void;

  // DAG analysis helpers
  findBackdoorPaths: () => string[][];
  getSuggestedAdjustmentSet: () => string[];
  hasCollider: (nodeId: string) => boolean;
  isMediator: (nodeId: string) => boolean;
}

export const useDAGStore = create<DAGStore>((set, get) => ({
  currentDAG: null,
  selectedNodeId: null,
  selectedEdgeId: null,

  setDAG: (dag) => set({ currentDAG: dag }),

  addNode: (node) =>
    set((state) => {
      if (!state.currentDAG) return state;
      return {
        currentDAG: {
          ...state.currentDAG,
          nodes: [...state.currentDAG.nodes, node],
        },
      };
    }),

  removeNode: (nodeId) =>
    set((state) => {
      if (!state.currentDAG) return state;
      return {
        currentDAG: {
          ...state.currentDAG,
          nodes: state.currentDAG.nodes.filter((n) => n.id !== nodeId),
          edges: state.currentDAG.edges.filter(
            (e) => e.source !== nodeId && e.target !== nodeId
          ),
        },
        selectedNodeId: state.selectedNodeId === nodeId ? null : state.selectedNodeId,
      };
    }),

  updateNode: (nodeId, updates) =>
    set((state) => {
      if (!state.currentDAG) return state;
      return {
        currentDAG: {
          ...state.currentDAG,
          nodes: state.currentDAG.nodes.map((n) =>
            n.id === nodeId ? { ...n, ...updates } : n
          ),
        },
      };
    }),

  addEdge: (edge) =>
    set((state) => {
      if (!state.currentDAG) return state;
      // Check for cycles before adding
      const wouldCreateCycle = checkForCycle(
        state.currentDAG.edges,
        edge.source,
        edge.target
      );
      if (wouldCreateCycle) {
        console.warn('Cannot add edge: would create a cycle');
        return state;
      }
      return {
        currentDAG: {
          ...state.currentDAG,
          edges: [...state.currentDAG.edges, edge],
        },
      };
    }),

  removeEdge: (edgeId) =>
    set((state) => {
      if (!state.currentDAG) return state;
      return {
        currentDAG: {
          ...state.currentDAG,
          edges: state.currentDAG.edges.filter((e) => e.id !== edgeId),
        },
        selectedEdgeId: state.selectedEdgeId === edgeId ? null : state.selectedEdgeId,
      };
    }),

  selectNode: (nodeId) => set({ selectedNodeId: nodeId, selectedEdgeId: null }),

  selectEdge: (edgeId) => set({ selectedEdgeId: edgeId, selectedNodeId: null }),

  clearDAG: () =>
    set({
      currentDAG: null,
      selectedNodeId: null,
      selectedEdgeId: null,
    }),

  findBackdoorPaths: () => {
    const state = get();
    if (!state.currentDAG) return [];
    // Simplified backdoor path detection
    // In a full implementation, this would use graph traversal algorithms
    return [];
  },

  getSuggestedAdjustmentSet: () => {
    const state = get();
    if (!state.currentDAG) return [];
    // Simplified adjustment set suggestion
    // In a full implementation, this would use backdoor criterion
    return [];
  },

  hasCollider: (nodeId) => {
    const state = get();
    if (!state.currentDAG) return false;
    const incomingEdges = state.currentDAG.edges.filter((e) => e.target === nodeId);
    return incomingEdges.length >= 2;
  },

  isMediator: (nodeId) => {
    const state = get();
    if (!state.currentDAG) return false;
    const dag = state.currentDAG;
    const hasIncoming = dag.edges.some((e) => e.target === nodeId);
    const hasOutgoing = dag.edges.some((e) => e.source === nodeId);
    return hasIncoming && hasOutgoing;
  },
}));

// Helper function to detect cycles using DFS
function checkForCycle(
  edges: DAGEdge[],
  newSource: string,
  newTarget: string
): boolean {
  const adjacencyList = new Map<string, string[]>();

  // Build adjacency list including the new edge
  [...edges, { id: 'temp', source: newSource, target: newTarget, type: 'causal' as const }].forEach(
    (edge) => {
      if (!adjacencyList.has(edge.source)) {
        adjacencyList.set(edge.source, []);
      }
      adjacencyList.get(edge.source)!.push(edge.target);
    }
  );

  // DFS to detect cycle
  const visited = new Set<string>();
  const recStack = new Set<string>();

  function hasCycleDFS(node: string): boolean {
    visited.add(node);
    recStack.add(node);

    const neighbors = adjacencyList.get(node) || [];
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        if (hasCycleDFS(neighbor)) return true;
      } else if (recStack.has(neighbor)) {
        return true;
      }
    }

    recStack.delete(node);
    return false;
  }

  // Check from the new source
  return hasCycleDFS(newSource);
}
