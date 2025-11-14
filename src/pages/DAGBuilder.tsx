import { useState } from 'react';
import { useDAGStore } from '../stores/useDAGStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Plus, Trash2, Info } from 'lucide-react';
import type { DAGNode, DAGEdge } from '../types';

export function DAGBuilder() {
  const {
    currentDAG,
    selectedNodeId,
    addNode,
    removeNode,
    addEdge,
    removeEdge,
    selectNode,
    setDAG,
    clearDAG,
  } = useDAGStore();

  const [newNodeLabel, setNewNodeLabel] = useState('');
  const [sourceNode, setSourceNode] = useState<string>('');
  const [targetNode, setTargetNode] = useState<string>('');

  // Initialize empty DAG if none exists
  const handleInitialize = () => {
    setDAG({
      id: 'custom-dag',
      name: 'Custom DAG',
      description: 'User-created DAG',
      nodes: [],
      edges: [],
    });
  };

  const handleAddNode = () => {
    if (!newNodeLabel.trim() || !currentDAG) return;

    const newNode: DAGNode = {
      id: `node-${Date.now()}`,
      label: newNodeLabel,
      x: Math.random() * 400 + 50,
      y: Math.random() * 300 + 50,
      type: 'other',
    };

    addNode(newNode);
    setNewNodeLabel('');
  };

  const handleAddEdge = () => {
    if (!sourceNode || !targetNode || !currentDAG) return;
    if (sourceNode === targetNode) {
      alert('Cannot create self-loops');
      return;
    }

    const newEdge: DAGEdge = {
      id: `edge-${Date.now()}`,
      source: sourceNode,
      target: targetNode,
      type: 'causal',
    };

    addEdge(newEdge);
    setSourceNode('');
    setTargetNode('');
  };

  const handleDeleteNode = (nodeId: string) => {
    removeNode(nodeId);
  };

  const handleDeleteEdge = (edgeId: string) => {
    removeEdge(edgeId);
  };

  if (!currentDAG) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Causal DAG Builder</h1>
          <p className="text-muted-foreground mt-2">
            Build directed acyclic graphs to represent and analyze causal
            relationships.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Get Started</CardTitle>
            <CardDescription>
              Create a new DAG to begin building your causal diagram
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleInitialize}>
              <Plus className="mr-2 h-4 w-4" />
              Create New DAG
            </Button>
          </CardContent>
        </Card>

        {/* Educational Content */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5" />
              What is a DAG?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              A <strong>Directed Acyclic Graph (DAG)</strong> is a visual tool
              for representing causal relationships between variables. Each arrow
              represents a direct causal effect.
            </p>

            <div className="space-y-2">
              <h4 className="font-semibold">Key Concepts:</h4>
              <ul className="space-y-2 ml-4">
                <li>
                  <strong>Nodes</strong> represent variables (exposures,
                  outcomes, confounders)
                </li>
                <li>
                  <strong>Directed edges</strong> (arrows) show causal direction
                </li>
                <li>
                  <strong>Acyclic</strong> means no variable can cause itself
                  through any path
                </li>
                <li>
                  <strong>Confounders</strong> have arrows pointing to both
                  exposure and outcome
                </li>
                <li>
                  <strong>Colliders</strong> have arrows pointing into them from
                  two or more variables
                </li>
                <li>
                  <strong>Mediators</strong> lie on the causal pathway between
                  exposure and outcome
                </li>
              </ul>
            </div>

            <div className="bg-muted p-4 rounded-md">
              <h4 className="font-semibold mb-2">Why Use DAGs?</h4>
              <p className="text-sm">
                DAGs help identify confounding, decide which variables to adjust
                for in analysis, and avoid common pitfalls like adjusting for
                colliders or mediators.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Causal DAG Builder</h1>
          <p className="text-muted-foreground mt-2">
            {currentDAG.nodes.length} nodes, {currentDAG.edges.length} edges
          </p>
        </div>
        <Button variant="destructive" onClick={clearDAG}>
          <Trash2 className="mr-2 h-4 w-4" />
          Clear DAG
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Controls */}
        <div className="lg:col-span-1 space-y-6">
          {/* Add Node */}
          <Card>
            <CardHeader>
              <CardTitle>Add Node</CardTitle>
              <CardDescription>Create a new variable in your DAG</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <input
                type="text"
                placeholder="Node label (e.g., Age, Smoking)"
                value={newNodeLabel}
                onChange={(e) => setNewNodeLabel(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddNode()}
                className="w-full px-3 py-2 border rounded-md bg-background"
              />
              <Button onClick={handleAddNode} className="w-full" size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Add Node
              </Button>
            </CardContent>
          </Card>

          {/* Add Edge */}
          <Card>
            <CardHeader>
              <CardTitle>Add Edge</CardTitle>
              <CardDescription>
                Create a causal relationship between nodes
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Source (Cause)</label>
                <select
                  value={sourceNode}
                  onChange={(e) => setSourceNode(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md bg-background"
                  disabled={currentDAG.nodes.length < 2}
                >
                  <option value="">Select source node</option>
                  {currentDAG.nodes.map((node) => (
                    <option key={node.id} value={node.id}>
                      {node.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Target (Effect)</label>
                <select
                  value={targetNode}
                  onChange={(e) => setTargetNode(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md bg-background"
                  disabled={currentDAG.nodes.length < 2}
                >
                  <option value="">Select target node</option>
                  {currentDAG.nodes.map((node) => (
                    <option key={node.id} value={node.id}>
                      {node.label}
                    </option>
                  ))}
                </select>
              </div>

              <Button
                onClick={handleAddEdge}
                className="w-full"
                size="sm"
                disabled={!sourceNode || !targetNode}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Edge
              </Button>
            </CardContent>
          </Card>

          {/* Legend */}
          <Card>
            <CardHeader>
              <CardTitle>Legend</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-blue-500"></div>
                <span className="text-sm">Exposure</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-red-500"></div>
                <span className="text-sm">Outcome</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
                <span className="text-sm">Confounder</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-gray-500"></div>
                <span className="text-sm">Other Variable</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Canvas */}
        <div className="lg:col-span-2 space-y-6">
          {/* SVG Canvas */}
          <Card>
            <CardHeader>
              <CardTitle>DAG Visualization</CardTitle>
              <CardDescription>
                Click nodes to select, drag to reposition
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-md bg-background" style={{ height: '500px' }}>
                <svg width="100%" height="100%" className="overflow-visible">
                  {/* Draw Edges */}
                  {currentDAG.edges.map((edge) => {
                    const source = currentDAG.nodes.find(
                      (n) => n.id === edge.source
                    );
                    const target = currentDAG.nodes.find(
                      (n) => n.id === edge.target
                    );
                    if (!source || !target) return null;

                    return (
                      <g key={edge.id}>
                        <defs>
                          <marker
                            id={`arrowhead-${edge.id}`}
                            markerWidth="10"
                            markerHeight="10"
                            refX="9"
                            refY="3"
                            orient="auto"
                          >
                            <polygon
                              points="0 0, 10 3, 0 6"
                              fill="currentColor"
                              className="text-foreground"
                            />
                          </marker>
                        </defs>
                        <line
                          x1={source.x}
                          y1={source.y}
                          x2={target.x}
                          y2={target.y}
                          stroke="currentColor"
                          strokeWidth="2"
                          markerEnd={`url(#arrowhead-${edge.id})`}
                          className="text-foreground"
                        />
                      </g>
                    );
                  })}

                  {/* Draw Nodes */}
                  {currentDAG.nodes.map((node) => (
                    <g
                      key={node.id}
                      onClick={() => selectNode(node.id)}
                      className="cursor-pointer"
                    >
                      <circle
                        cx={node.x}
                        cy={node.y}
                        r="30"
                        fill="currentColor"
                        stroke={
                          selectedNodeId === node.id
                            ? 'currentColor'
                            : 'transparent'
                        }
                        strokeWidth="3"
                        className={
                          selectedNodeId === node.id
                            ? 'text-primary'
                            : 'text-muted'
                        }
                      />
                      <text
                        x={node.x}
                        y={node.y}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        className="text-xs font-medium fill-background pointer-events-none"
                      >
                        {node.label}
                      </text>
                    </g>
                  ))}
                </svg>
              </div>
            </CardContent>
          </Card>

          {/* Node List */}
          <Card>
            <CardHeader>
              <CardTitle>Nodes</CardTitle>
              <CardDescription>All variables in your DAG</CardDescription>
            </CardHeader>
            <CardContent>
              {currentDAG.nodes.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No nodes yet. Add your first variable above.
                </p>
              ) : (
                <div className="space-y-2">
                  {currentDAG.nodes.map((node) => (
                    <div
                      key={node.id}
                      className="flex items-center justify-between p-2 border rounded-md"
                    >
                      <span className="font-medium">{node.label}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteNode(node.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Edge List */}
          <Card>
            <CardHeader>
              <CardTitle>Edges</CardTitle>
              <CardDescription>All causal relationships in your DAG</CardDescription>
            </CardHeader>
            <CardContent>
              {currentDAG.edges.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No edges yet. Add causal relationships above.
                </p>
              ) : (
                <div className="space-y-2">
                  {currentDAG.edges.map((edge) => {
                    const source = currentDAG.nodes.find(
                      (n) => n.id === edge.source
                    )?.label;
                    const target = currentDAG.nodes.find(
                      (n) => n.id === edge.target
                    )?.label;

                    return (
                      <div
                        key={edge.id}
                        className="flex items-center justify-between p-2 border rounded-md"
                      >
                        <span className="font-medium">
                          {source} → {target}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteEdge(edge.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
