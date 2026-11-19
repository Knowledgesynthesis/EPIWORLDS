import { describe, expect, it } from 'vitest';
import {
  checkAdjustmentSet,
  classifyPath,
  enumeratePaths,
  evaluatePath,
  minimalAdjustmentSets,
  nodeRoles,
  wouldCreateCycle,
  type Dag,
} from '../dag';

const mk = (edges: [string, string][], latent: string[] = []): Dag => {
  const ids = [...new Set(edges.flat())];
  return {
    nodes: ids.map((id) => ({ id, label: id, x: 0, y: 0, latent: latent.includes(id) })),
    edges: edges.map(([from, to]) => ({ from, to })),
  };
};

const sets = (dag: Dag) => minimalAdjustmentSets(dag, 'X', 'Y').sets.map((s) => [...s].sort().join(','));

describe('classic structures', () => {
  it('confounding: adjust for the common cause', () => {
    const g = mk([['C', 'X'], ['C', 'Y'], ['X', 'Y']]);
    const paths = enumeratePaths(g, 'X', 'Y');
    expect(paths.map(classifyPath).sort()).toEqual(['backdoor', 'causal']);
    expect(sets(g)).toEqual(['C']);
    expect(checkAdjustmentSet(g, 'X', 'Y', new Set()).valid).toBe(false);
    expect(nodeRoles(g, 'X', 'Y').C).toContain('common-cause');
  });

  it('mediator: empty set is sufficient; adjusting for M is forbidden', () => {
    const g = mk([['X', 'M'], ['M', 'Y'], ['X', 'Y']]);
    expect(sets(g)).toEqual(['']);
    const chk = checkAdjustmentSet(g, 'X', 'Y', new Set(['M']));
    expect(chk.valid).toBe(false);
    expect(chk.descendantsOfExposure).toEqual(['M']);
    expect(chk.blockedCausalPaths).toHaveLength(1);
    expect(nodeRoles(g, 'X', 'Y').M).toContain('mediator');
  });

  it('collider: conditioning opens the non-causal path', () => {
    const g = mk([['X', 'S'], ['Y', 'S'], ['X', 'Y']]);
    const p = enumeratePaths(g, 'X', 'Y').find((q) => q.nodes.includes('S'))!;
    expect(classifyPath(p)).toBe('noncausal');
    expect(evaluatePath(g, p, new Set()).open).toBe(false);
    expect(evaluatePath(g, p, new Set(['S'])).open).toBe(true);
    expect(nodeRoles(g, 'X', 'Y').S).toContain('collider');
  });

  it('M-bias: pre-exposure collider must NOT be adjusted alone', () => {
    const g = mk([['U1', 'X'], ['U1', 'M'], ['U2', 'M'], ['U2', 'Y'], ['X', 'Y']]);
    expect(sets(g)).toEqual(['']);
    expect(checkAdjustmentSet(g, 'X', 'Y', new Set(['M'])).valid).toBe(false);
    expect(checkAdjustmentSet(g, 'X', 'Y', new Set(['M', 'U1'])).valid).toBe(true);
  });

  it('butterfly bias: needs M plus one U; unidentifiable if both U are latent', () => {
    const edges: [string, string][] = [['U1', 'X'], ['U1', 'M'], ['U2', 'M'], ['U2', 'Y'], ['M', 'X'], ['M', 'Y'], ['X', 'Y']];
    expect(sets(mk(edges)).sort()).toEqual(['M,U1', 'M,U2']);
    const latent = minimalAdjustmentSets(mk(edges, ['U1', 'U2']), 'X', 'Y');
    expect(latent.identifiable).toBe(false);
    expect(latent.sets).toEqual([]);
  });

  it('conditioning on a descendant of a collider opens the path', () => {
    const g = mk([['A', 'X'], ['A', 'C'], ['B', 'C'], ['B', 'Y'], ['C', 'D'], ['X', 'Y']]);
    const p = enumeratePaths(g, 'X', 'Y').find((q) => q.nodes.includes('C'))!;
    const st = evaluatePath(g, p, new Set(['D']));
    expect(st.open).toBe(true);
    expect(st.openedColliders).toEqual([{ node: 'C', via: 'D' }]);
  });

  it('multiple minimal sets for a two-step backdoor path', () => {
    const g = mk([['A', 'B'], ['B', 'X'], ['A', 'Y'], ['X', 'Y']]);
    expect(sets(g).sort()).toEqual(['A', 'B']);
  });
});

describe('cycle prevention', () => {
  it('rejects edges that would close a directed cycle', () => {
    const g = mk([['A', 'B'], ['B', 'C']]);
    expect(wouldCreateCycle(g, 'C', 'A')).toBe(true);
    expect(wouldCreateCycle(g, 'A', 'C')).toBe(false);
    expect(wouldCreateCycle(g, 'A', 'A')).toBe(true);
  });
});
