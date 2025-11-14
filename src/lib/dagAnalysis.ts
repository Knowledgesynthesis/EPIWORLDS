import type { DAG } from '../types';

/**
 * Find all paths between two nodes using DFS
 */
export function findAllPaths(
  dag: DAG,
  start: string,
  end: string
): string[][] {
  const paths: string[][] = [];
  const visited = new Set<string>();

  function dfs(current: string, path: string[]) {
    if (current === end) {
      paths.push([...path]);
      return;
    }

    visited.add(current);

    // Find outgoing edges
    const outgoing = dag.edges.filter((e) => e.source === current);
    for (const edge of outgoing) {
      if (!visited.has(edge.target)) {
        dfs(edge.target, [...path, edge.target]);
      }
    }

    visited.delete(current);
  }

  dfs(start, [start]);
  return paths;
}

/**
 * Find backdoor paths between exposure and outcome
 * A backdoor path starts with an arrow INTO the exposure
 */
export function findBackdoorPaths(
  dag: DAG,
  exposure: string,
  outcome: string
): string[][] {
  const backdoorPaths: string[][] = [];

  // Find all edges pointing INTO exposure
  const incomingToExposure = dag.edges.filter((e) => e.target === exposure);

  for (const edge of incomingToExposure) {
    // Start from the source of this edge and find paths to outcome
    const paths = findAllPathsBackdoor(dag, edge.source, outcome, exposure);
    backdoorPaths.push(...paths.map((p) => [exposure, ...p]));
  }

  return backdoorPaths;
}

/**
 * Helper function to find paths while avoiding the exposure node
 */
function findAllPathsBackdoor(
  dag: DAG,
  start: string,
  end: string,
  avoid: string
): string[][] {
  const paths: string[][] = [];
  const visited = new Set<string>();

  function dfs(current: string, path: string[]) {
    if (current === end) {
      paths.push([...path]);
      return;
    }

    if (current === avoid && path.length > 0) {
      return; // Don't go through exposure node
    }

    visited.add(current);

    // Can traverse both forward and backward edges for backdoor paths
    const neighbors = new Set<string>();

    // Forward edges
    dag.edges.filter((e) => e.source === current).forEach((e) => neighbors.add(e.target));

    // Backward edges (for backdoor paths)
    dag.edges.filter((e) => e.target === current).forEach((e) => neighbors.add(e.source));

    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        dfs(neighbor, [...path, neighbor]);
      }
    }

    visited.delete(current);
  }

  dfs(start, [start]);
  return paths;
}

/**
 * Check if a node is a collider on a given path
 * A collider has two incoming arrows on the path
 */
export function isColliderOnPath(dag: DAG, node: string, path: string[]): boolean {
  const nodeIndex = path.indexOf(node);
  if (nodeIndex === 0 || nodeIndex === path.length - 1) {
    return false; // Can't be a collider at endpoints
  }

  const prev = path[nodeIndex - 1];
  const next = path[nodeIndex + 1];

  // Check if both prev and next point TO this node
  const hasPrevIncoming = dag.edges.some(
    (e) => e.source === prev && e.target === node
  );
  const hasNextIncoming = dag.edges.some(
    (e) => e.source === next && e.target === node
  );

  return hasPrevIncoming && hasNextIncoming;
}

/**
 * Determine if a backdoor path is blocked
 * A path is blocked if it contains a collider (and we're not conditioning on it)
 */
export function isPathBlocked(
  dag: DAG,
  path: string[],
  conditionedVariables: Set<string>
): boolean {
  // Check each node on the path
  for (let i = 1; i < path.length - 1; i++) {
    const node = path[i];

    if (isColliderOnPath(dag, node, path)) {
      // Path is blocked by collider unless we condition on it or its descendants
      if (!conditionedVariables.has(node)) {
        return true; // Blocked by collider
      }
    } else {
      // Non-collider node blocks the path if we condition on it
      if (conditionedVariables.has(node)) {
        return true; // Blocked by conditioning on non-collider
      }
    }
  }

  return false; // Path is open
}

/**
 * Find sufficient adjustment set using backdoor criterion
 * Returns variables that, when adjusted for, block all backdoor paths
 */
export function findAdjustmentSet(
  dag: DAG,
  exposure: string,
  outcome: string
): {
  adjustmentSet: string[];
  allBackdoorPaths: string[][];
  blockedPaths: string[][];
  openPaths: string[][];
} {
  const backdoorPaths = findBackdoorPaths(dag, exposure, outcome);

  // Try to find minimal adjustment set
  // Start with all non-mediator variables
  const candidateNodes = dag.nodes
    .filter(
      (n) =>
        n.id !== exposure &&
        n.id !== outcome &&
        !isMediator(dag, n.id, exposure, outcome)
    )
    .map((n) => n.id);

  // Greedy algorithm: add variables that block the most open paths
  const adjustmentSet: string[] = [];
  const conditioned = new Set<string>();

  let openPaths = backdoorPaths.filter((path) => !isPathBlocked(dag, path, conditioned));

  while (openPaths.length > 0 && candidateNodes.length > 0) {
    let bestVar = '';
    let maxBlocked = 0;

    for (const candidate of candidateNodes) {
      if (conditioned.has(candidate)) continue;

      const testConditioned = new Set(conditioned);
      testConditioned.add(candidate);

      const blocked = openPaths.filter((path) =>
        isPathBlocked(dag, path, testConditioned)
      ).length;

      if (blocked > maxBlocked) {
        maxBlocked = blocked;
        bestVar = candidate;
      }
    }

    if (maxBlocked === 0) break;

    adjustmentSet.push(bestVar);
    conditioned.add(bestVar);
    openPaths = backdoorPaths.filter((path) => !isPathBlocked(dag, path, conditioned));
  }

  const blockedPaths = backdoorPaths.filter((path) =>
    isPathBlocked(dag, path, conditioned)
  );

  return {
    adjustmentSet,
    allBackdoorPaths: backdoorPaths,
    blockedPaths,
    openPaths,
  };
}

/**
 * Check if a node is a mediator (on the causal path)
 */
export function isMediator(
  dag: DAG,
  node: string,
  exposure: string,
  outcome: string
): boolean {
  // A mediator is on a directed path from exposure to outcome
  const pathsToNode = findAllPaths(dag, exposure, node);
  if (pathsToNode.length === 0) return false;

  const pathsFromNode = findAllPaths(dag, node, outcome);
  return pathsFromNode.length > 0;
}

/**
 * Identify node types in the DAG
 */
export function classifyNode(
  dag: DAG,
  nodeId: string,
  exposure?: string,
  outcome?: string
): 'exposure' | 'outcome' | 'confounder' | 'mediator' | 'collider' | 'independent' {
  if (nodeId === exposure) return 'exposure';
  if (nodeId === outcome) return 'outcome';

  const incomingEdges = dag.edges.filter((e) => e.target === nodeId);

  // Collider: 2+ incoming edges
  if (incomingEdges.length >= 2) {
    return 'collider';
  }

  // If exposure and outcome are defined
  if (exposure && outcome) {
    // Mediator: on causal path
    if (isMediator(dag, nodeId, exposure, outcome)) {
      return 'mediator';
    }

    // Confounder: affects both exposure and outcome
    const affectsExposure = findAllPaths(dag, nodeId, exposure).length > 0;
    const affectsOutcome = findAllPaths(dag, nodeId, outcome).length > 0;

    if (affectsExposure && affectsOutcome) {
      return 'confounder';
    }
  }

  return 'independent';
}
