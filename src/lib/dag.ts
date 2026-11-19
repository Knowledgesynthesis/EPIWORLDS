/**
 * Causal DAG analysis: path enumeration, d-separation (path blocking), the
 * backdoor criterion, minimal sufficient adjustment sets, and node roles.
 *
 * Rules implemented (Pearl 2009; Greenland, Pearl & Robins 1999):
 *  - A path is blocked by a set Z if it contains a non-collider that is in Z,
 *    or a collider such that neither it nor any of its descendants is in Z.
 *  - Z satisfies the backdoor criterion for X → Y if no member of Z is a
 *    descendant of X and Z blocks every path between X and Y that begins
 *    with an arrow into X.
 */

export interface DagNode {
  id: string;
  label: string;
  x: number;
  y: number;
  /** Unmeasured (latent) variables cannot be adjusted for. */
  latent?: boolean;
}

export interface DagEdge {
  from: string;
  to: string;
}

export interface Dag {
  nodes: DagNode[];
  edges: DagEdge[];
}

/** Orientation of each step along a path: 'fwd' means nodes[i] → nodes[i+1]. */
export type StepDir = 'fwd' | 'back';

export interface DagPath {
  nodes: string[];
  dirs: StepDir[];
}

export type PathKind = 'causal' | 'backdoor' | 'noncausal';

export function parentsOf(dag: Dag, id: string): string[] {
  return dag.edges.filter((e) => e.to === id).map((e) => e.from);
}

export function childrenOf(dag: Dag, id: string): string[] {
  return dag.edges.filter((e) => e.from === id).map((e) => e.to);
}

function reach(id: string, next: (n: string) => string[], removed?: string): Set<string> {
  const seen = new Set<string>();
  const stack = [id];
  while (stack.length) {
    const cur = stack.pop()!;
    for (const n of next(cur)) {
      if (n === removed || seen.has(n)) continue;
      seen.add(n);
      stack.push(n);
    }
  }
  return seen;
}

/** Strict ancestors of `id`. If `removed` is given, paths through that node are ignored. */
export function ancestorsOf(dag: Dag, id: string, removed?: string): Set<string> {
  return reach(id, (n) => parentsOf(dag, n), removed);
}

/** Strict descendants of `id`. */
export function descendantsOf(dag: Dag, id: string): Set<string> {
  return reach(id, (n) => childrenOf(dag, n));
}

export function hasEdge(dag: Dag, from: string, to: string): boolean {
  return dag.edges.some((e) => e.from === from && e.to === to);
}

/** Adding from → to creates a cycle iff `from` is reachable from `to`. */
export function wouldCreateCycle(dag: Dag, from: string, to: string): boolean {
  return from === to || descendantsOf(dag, to).has(from);
}

/** All simple paths between x and y in the graph's skeleton (arrow direction ignored). */
export function enumeratePaths(dag: Dag, x: string, y: string, limit = 5000): DagPath[] {
  const adj = new Map<string, { node: string; dir: StepDir }[]>();
  for (const n of dag.nodes) adj.set(n.id, []);
  for (const e of dag.edges) {
    adj.get(e.from)?.push({ node: e.to, dir: 'fwd' });
    adj.get(e.to)?.push({ node: e.from, dir: 'back' });
  }
  const out: DagPath[] = [];
  const visited = new Set<string>([x]);
  const nodes = [x];
  const dirs: StepDir[] = [];
  const dfs = (cur: string) => {
    if (out.length >= limit) return;
    for (const { node, dir } of adj.get(cur) ?? []) {
      if (visited.has(node)) continue;
      nodes.push(node);
      dirs.push(dir);
      if (node === y) {
        out.push({ nodes: [...nodes], dirs: [...dirs] });
      } else {
        visited.add(node);
        dfs(node);
        visited.delete(node);
      }
      nodes.pop();
      dirs.pop();
    }
  };
  if (x !== y) dfs(x);
  return out.sort((p, q) => p.nodes.length - q.nodes.length);
}

export function classifyPath(p: DagPath): PathKind {
  if (p.dirs.every((d) => d === 'fwd')) return 'causal';
  if (p.dirs[0] === 'back') return 'backdoor';
  return 'noncausal';
}

/** Interior nodes that are colliders on this path (→ v ←). */
export function collidersOnPath(p: DagPath): string[] {
  const out: string[] = [];
  for (let i = 1; i < p.nodes.length - 1; i++) {
    if (p.dirs[i - 1] === 'fwd' && p.dirs[i] === 'back') out.push(p.nodes[i]);
  }
  return out;
}

export type BlockReason =
  | { node: string; kind: 'conditioned-noncollider' }
  | { node: string; kind: 'unconditioned-collider' };

export interface PathStatus {
  open: boolean;
  blockers: BlockReason[];
  /** Colliders opened by conditioning on them (via = undefined) or on a descendant (via = that descendant). */
  openedColliders: { node: string; via?: string }[];
}

export function evaluatePath(dag: Dag, p: DagPath, Z: ReadonlySet<string>): PathStatus {
  const blockers: BlockReason[] = [];
  const openedColliders: { node: string; via?: string }[] = [];
  for (let i = 1; i < p.nodes.length - 1; i++) {
    const v = p.nodes[i];
    const isCollider = p.dirs[i - 1] === 'fwd' && p.dirs[i] === 'back';
    if (isCollider) {
      if (Z.has(v)) {
        openedColliders.push({ node: v });
      } else {
        const viaDesc = [...descendantsOf(dag, v)].find((d) => Z.has(d));
        if (viaDesc) openedColliders.push({ node: v, via: viaDesc });
        else blockers.push({ node: v, kind: 'unconditioned-collider' });
      }
    } else if (Z.has(v)) {
      blockers.push({ node: v, kind: 'conditioned-noncollider' });
    }
  }
  return { open: blockers.length === 0, blockers, openedColliders };
}

export interface AdjustmentCheck {
  valid: boolean;
  /** Members of Z that are descendants of X (forbidden by the backdoor criterion). */
  descendantsOfExposure: string[];
  /** Backdoor paths left open by Z. */
  openBackdoorPaths: DagPath[];
  /** Causal paths blocked by Z (e.g., by conditioning on a mediator). */
  blockedCausalPaths: DagPath[];
}

export function checkAdjustmentSet(dag: Dag, x: string, y: string, Z: ReadonlySet<string>, paths = enumeratePaths(dag, x, y)): AdjustmentCheck {
  const descX = descendantsOf(dag, x);
  const descendantsOfExposure = [...Z].filter((z) => descX.has(z));
  const openBackdoorPaths = paths.filter((p) => classifyPath(p) === 'backdoor' && evaluatePath(dag, p, Z).open);
  const blockedCausalPaths = paths.filter((p) => classifyPath(p) === 'causal' && !evaluatePath(dag, p, Z).open);
  return {
    valid: descendantsOfExposure.length === 0 && openBackdoorPaths.length === 0 && !Z.has(x) && !Z.has(y),
    descendantsOfExposure,
    openBackdoorPaths,
    blockedCausalPaths,
  };
}

export interface AdjustmentSetsResult {
  sets: string[][];
  /** False when no set of measured covariates satisfies the backdoor criterion. */
  identifiable: boolean;
  truncated: boolean;
}

/**
 * All minimal sufficient adjustment sets (backdoor criterion) among measured,
 * non-descendant covariates. Enumerates subsets by increasing size and skips
 * supersets of sets already found, which yields exactly the minimal sets.
 */
export function minimalAdjustmentSets(dag: Dag, x: string, y: string, maxCandidates = 16): AdjustmentSetsResult {
  const descX = descendantsOf(dag, x);
  const backdoor = enumeratePaths(dag, x, y).filter((p) => classifyPath(p) === 'backdoor');
  if (backdoor.length === 0) return { sets: [[]], identifiable: true, truncated: false };

  // Only nodes lying on some backdoor path, or descendants of colliders on them, can matter.
  const relevant = new Set<string>();
  for (const p of backdoor) {
    for (const n of p.nodes.slice(1, -1)) relevant.add(n);
    for (const c of collidersOnPath(p)) for (const d of descendantsOf(dag, c)) relevant.add(d);
  }
  const candidates = dag.nodes
    .filter((n) => n.id !== x && n.id !== y && !n.latent && !descX.has(n.id) && relevant.has(n.id))
    .map((n) => n.id);
  const truncated = candidates.length > maxCandidates;
  const cand = candidates.slice(0, maxCandidates);

  const found: string[][] = [];
  const blocksAll = (Z: Set<string>) => backdoor.every((p) => !evaluatePath(dag, p, Z).open);
  for (let size = 0; size <= cand.length; size++) {
    for (const combo of combinations(cand, size)) {
      if (found.some((f) => f.every((v) => combo.includes(v)))) continue;
      if (blocksAll(new Set(combo))) found.push(combo);
    }
  }
  return { sets: found, identifiable: found.length > 0, truncated };
}

function combinations<T>(arr: T[], k: number): T[][] {
  const out: T[][] = [];
  const cur: T[] = [];
  const go = (start: number) => {
    if (cur.length === k) {
      out.push([...cur]);
      return;
    }
    for (let i = start; i < arr.length; i++) {
      cur.push(arr[i]);
      go(i + 1);
      cur.pop();
    }
  };
  go(0);
  return out;
}

export type NodeRole =
  | 'exposure'
  | 'outcome'
  | 'common-cause'
  | 'on-backdoor-path'
  | 'mediator'
  | 'descendant-of-exposure'
  | 'collider'
  | 'exposure-cause-only'
  | 'outcome-cause-only';

export const roleLabels: Record<NodeRole, string> = {
  exposure: 'Exposure',
  outcome: 'Outcome',
  'common-cause': 'Common cause of X and Y',
  'on-backdoor-path': 'On a backdoor path',
  mediator: 'Mediator (on a causal path)',
  'descendant-of-exposure': 'Descendant of exposure',
  collider: 'Collider on an X–Y path',
  'exposure-cause-only': 'Cause of exposure only',
  'outcome-cause-only': 'Cause of outcome only',
};

/** Structural roles of every node relative to exposure x and outcome y. */
export function nodeRoles(dag: Dag, x: string, y: string): Record<string, NodeRole[]> {
  const descX = descendantsOf(dag, x);
  const ancX = ancestorsOf(dag, x);
  const ancY = ancestorsOf(dag, y);
  const ancYnotViaX = ancestorsOf(dag, y, x);
  const paths = enumeratePaths(dag, x, y);
  const onBackdoor = new Set<string>();
  const colliders = new Set<string>();
  for (const p of paths) {
    if (classifyPath(p) === 'backdoor') p.nodes.slice(1, -1).forEach((n) => onBackdoor.add(n));
    collidersOnPath(p).forEach((c) => colliders.add(c));
  }
  const out: Record<string, NodeRole[]> = {};
  for (const n of dag.nodes) {
    const r: NodeRole[] = [];
    if (n.id === x) r.push('exposure');
    else if (n.id === y) r.push('outcome');
    else {
      if (descX.has(n.id) && ancY.has(n.id)) r.push('mediator');
      else if (descX.has(n.id)) r.push('descendant-of-exposure');
      if (ancX.has(n.id) && ancYnotViaX.has(n.id)) r.push('common-cause');
      if (onBackdoor.has(n.id) && !r.includes('common-cause')) r.push('on-backdoor-path');
      if (colliders.has(n.id)) r.push('collider');
      if (ancX.has(n.id) && !ancYnotViaX.has(n.id) && !onBackdoor.has(n.id)) r.push('exposure-cause-only');
      if (ancYnotViaX.has(n.id) && !ancX.has(n.id) && !descX.has(n.id) && !onBackdoor.has(n.id)) r.push('outcome-cause-only');
    }
    out[n.id] = r;
  }
  return out;
}
