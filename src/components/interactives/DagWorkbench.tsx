import { useMemo, useRef, useState } from 'react';
import { useStore } from 'zustand';
import { ArrowLeftRight, CheckCircle2, Eye, MousePointer2, Plus, Spline, Trash2 } from 'lucide-react';
import { dagPresets } from '../../data/dagPresets';
import {
  checkAdjustmentSet,
  classifyPath,
  enumeratePaths,
  evaluatePath,
  minimalAdjustmentSets,
  nodeRoles,
  roleLabels,
  type DagPath,
} from '../../lib/dag';
import { clamp } from '../../lib/stats';
import { cn } from '../../lib/utils';
import type { DagStore } from '../../stores/useDagStore';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Callout } from '../ui/Callout';
import { Segmented } from '../ui/controls';
import { DagSvgBody, type DrawEdge } from '../viz/DagDrawing';
import { layout, type EdgeTone } from '../viz/dagGeometry';
import { useWidth } from '../viz/useWidth';

interface DagWorkbenchProps {
  store: DagStore;
  /** Restrict the preset menu (lessons). */
  presetIds?: string[];
  height?: number;
}

const pathText = (p: DagPath, label: (id: string) => string) =>
  p.nodes.map((n, i) => (i === 0 ? label(n) : `${p.dirs[i - 1] === 'fwd' ? ' → ' : ' ← '}${label(n)}`)).join('');

export function DagWorkbench({ store, presetIds, height = 380 }: DagWorkbenchProps) {
  const s = useStore(store);
  const { dag, exposure: X, outcome: Y, adjusted } = s;
  const [mode, setMode] = useState<'move' | 'draw'>('move');
  const [selected, setSelected] = useState<string | null>(null);
  const [selectedEdge, setSelectedEdge] = useState<{ from: string; to: string } | null>(null);
  const [pending, setPending] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [newLabel, setNewLabel] = useState('');
  const [focusPath, setFocusPath] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  const [revealed, setRevealed] = useState(!s.presetId);
  const [ref, width] = useWidth<HTMLDivElement>(640);
  const svgRef = useRef<SVGSVGElement>(null);
  const drag = useRef<{ id: string; moved: boolean; x0: number; y0: number } | null>(null);
  const { invX, invY } = layout(width, height);

  const preset = dagPresets.find((p) => p.id === s.presetId);
  const presets = presetIds ? dagPresets.filter((p) => presetIds.includes(p.id)) : dagPresets;
  const label = (id: string) => dag.nodes.find((n) => n.id === id)?.label ?? id;
  const Z = useMemo(() => new Set(adjusted), [adjusted]);

  const analysis = useMemo(() => {
    if (!X || !Y || !dag.nodes.some((n) => n.id === X) || !dag.nodes.some((n) => n.id === Y)) return null;
    const paths = enumeratePaths(dag, X, Y, 400);
    return {
      paths: paths.map((p) => ({ p, kind: classifyPath(p), status: evaluatePath(dag, p, Z) })),
      check: checkAdjustmentSet(dag, X, Y, Z, paths),
      sets: minimalAdjustmentSets(dag, X, Y),
      roles: nodeRoles(dag, X, Y),
    };
  }, [dag, X, Y, Z]);

  const loadPreset = (id: string) => {
    const p = dagPresets.find((q) => q.id === id);
    if (p) s.load(p.workspace, p.id);
    else s.load({ dag: { nodes: [], edges: [] }, exposure: null, outcome: null, adjusted: [] }, null);
    setSelected(null);
    setSelectedEdge(null);
    setPending(null);
    setFocusPath(null);
    setChecked(false);
    setRevealed(!p);
    setMessage(null);
  };

  const tapNode = (id: string) => {
    setSelectedEdge(null);
    if (mode === 'draw') {
      if (!pending) {
        setPending(id);
        setMessage(`Arrow from ${label(id)} → tap the effect variable.`);
      } else if (pending === id) {
        setPending(null);
        setMessage(null);
      } else {
        const err = s.addEdge(pending, id);
        setMessage(err ?? `Added ${label(pending)} → ${label(id)}.`);
        setPending(null);
        setChecked(false);
      }
    } else {
      setSelected((cur) => (cur === id ? null : id));
    }
  };

  const onNodePointerDown = (id: string, e: React.PointerEvent) => {
    e.stopPropagation();
    drag.current = { id, moved: false, x0: e.clientX, y0: e.clientY };
    svgRef.current?.setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    const d = drag.current;
    if (!d) return;
    if (!d.moved && Math.hypot(e.clientX - d.x0, e.clientY - d.y0) < 4) return;
    if (mode === 'draw') return;
    d.moved = true;
    const r = e.currentTarget.getBoundingClientRect();
    s.updateNode(d.id, { x: clamp(invX(e.clientX - r.left), -4, 104), y: clamp(invY(e.clientY - r.top), -6, 106) });
  };
  const onPointerUp = () => {
    const d = drag.current;
    drag.current = null;
    if (d && !d.moved) tapNode(d.id);
  };

  const addVariable = () => {
    if (!newLabel.trim()) return;
    const k = dag.nodes.length;
    const id = s.addNode(newLabel, 15 + ((k * 29) % 70), 15 + ((k * 41) % 70));
    setNewLabel('');
    setSelected(id);
    setMode('move');
    setChecked(false);
  };

  // Edge tones for the focused path.
  const focused = focusPath !== null && analysis ? analysis.paths[focusPath] : null;
  const onFocused = (from: string, to: string) => {
    if (!focused) return false;
    const { nodes, dirs } = focused.p;
    return nodes.some((n, i) => i < nodes.length - 1 && ((dirs[i] === 'fwd' && n === from && nodes[i + 1] === to) || (dirs[i] === 'back' && n === to && nodes[i + 1] === from)));
  };
  const edges: DrawEdge[] = dag.edges.map((e) => {
    let tone: EdgeTone = 'default';
    if (focused) {
      tone = onFocused(e.from, e.to) ? (focused.status.open ? (focused.kind === 'causal' ? 'causal' : 'open') : 'blocked') : 'faded';
    } else if (selectedEdge && selectedEdge.from === e.from && selectedEdge.to === e.to) tone = 'open';
    return { ...e, tone };
  });

  const nodes = dag.nodes.map((n) => ({
    ...n,
    role: n.id === X ? ('exposure' as const) : n.id === Y ? ('outcome' as const) : ('default' as const),
    adjusted: Z.has(n.id),
    selected: selected === n.id,
    pending: pending === n.id,
  }));

  const sel = dag.nodes.find((n) => n.id === selected);
  const showAnalysis = revealed || checked;

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2">
        <label className="sr-only" htmlFor="dag-preset">Load example</label>
        <select
          id="dag-preset"
          value={s.presetId ?? ''}
          onChange={(e) => loadPreset(e.target.value)}
          className="h-9 max-w-full rounded-md border border-input bg-card px-2 text-sm"
        >
          <option value="">{presetIds ? 'Choose an example…' : 'Blank canvas / my DAG'}</option>
          {presets.map((p) => (
            <option key={p.id} value={p.id}>
              Example: {p.name}
            </option>
          ))}
        </select>
        <Segmented
          label="Canvas mode"
          size="sm"
          value={mode}
          onChange={(m) => {
            setMode(m);
            setPending(null);
            setMessage(m === 'draw' ? 'Tap the cause, then the effect.' : null);
          }}
          options={[
            { value: 'move', label: <span className="flex items-center gap-1"><MousePointer2 className="h-3.5 w-3.5" />Select / move</span> },
            { value: 'draw', label: <span className="flex items-center gap-1"><Spline className="h-3.5 w-3.5" />Draw arrows</span> },
          ]}
        />
        <form
          className="flex w-full gap-2 sm:w-auto sm:min-w-[16rem] sm:flex-1"
          onSubmit={(e) => {
            e.preventDefault();
            addVariable();
          }}
        >
          <label className="sr-only" htmlFor="dag-new">New variable name</label>
          <input
            id="dag-new"
            value={newLabel}
            onChange={(e) => setNewLabel(e.target.value)}
            placeholder="New variable (e.g. Age)"
            className="h-9 min-w-0 flex-1 rounded-md border border-input bg-card px-3 text-sm"
            maxLength={28}
          />
          <Button type="submit" size="sm" variant="outline" disabled={!newLabel.trim()} className="h-9">
            <Plus className="h-4 w-4" /> Add
          </Button>
        </form>
      </div>

      {preset && (
        <Callout kind="tip" title={`Task — ${preset.name}`}>
          <p>{preset.task}</p>
          {checked && <p className="mt-2 font-medium">{preset.lesson}</p>}
        </Callout>
      )}

      {/* Canvas */}
      <div ref={ref} className="relative overflow-hidden rounded-lg border bg-[var(--chart-surface)]">
        {dag.nodes.length === 0 && (
          <p className="pointer-events-none absolute inset-0 flex items-center justify-center p-6 text-center text-sm text-muted-foreground">
            <span>Add variables above, or load an example. Then use <strong>Draw arrows</strong> to connect causes to effects.</span>
          </p>
        )}
        <svg
          ref={svgRef}
          width={width}
          height={height}
          className="block touch-none select-none"
          role="application"
          aria-label="Causal diagram canvas. Use the variable list below for keyboard access."
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={() => (drag.current = null)}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setSelected(null);
              setSelectedEdge(null);
              setFocusPath(null);
            }
          }}
        >
          <DagSvgBody
            nodes={nodes}
            edges={edges}
            width={width}
            height={height}
            onNodePointerDown={onNodePointerDown}
            onEdgeClick={(from, to) => {
              setSelectedEdge({ from, to });
              setSelected(null);
              setFocusPath(null);
            }}
          />
        </svg>
        <div className="pointer-events-none absolute bottom-2 left-2 flex flex-wrap gap-x-3 gap-y-1 rounded bg-card/90 px-2 py-1 text-[11px] text-muted-foreground">
          <span><span className="mr-1 inline-block h-2.5 w-2.5 rounded-full" style={{ background: 'var(--series-2)' }} />Exposure</span>
          <span><span className="mr-1 inline-block h-2.5 w-2.5 rounded-full" style={{ background: 'var(--series-1)' }} />Outcome</span>
          <span><span className="mr-1 inline-block h-2.5 w-3 rounded-[2px] border-2 border-foreground" />Adjusted</span>
          <span><span className="mr-1 inline-block h-2.5 w-3 rounded-full border border-dashed border-foreground" />Unmeasured</span>
        </div>
      </div>
      {message && (
        <p className="text-sm text-muted-foreground" role="status">
          {message}
        </p>
      )}

      {/* Selected node or edge */}
      {sel && (
        <div className="space-y-3 rounded-lg border bg-card p-3">
          <div className="flex flex-wrap items-center gap-2">
            <label className="text-xs font-medium text-muted-foreground" htmlFor="dag-rename">Variable</label>
            <input
              id="dag-rename"
              value={sel.label}
              maxLength={28}
              onChange={(e) => s.updateNode(sel.id, { label: e.target.value || sel.id })}
              className="h-8 min-w-0 flex-1 rounded-md border border-input bg-background px-2 text-sm font-medium"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <Button size="sm" variant={X === sel.id ? 'default' : 'outline'} onClick={() => s.setExposure(X === sel.id ? null : sel.id)}>
              {X === sel.id ? 'Exposure ✓' : 'Set as exposure'}
            </Button>
            <Button size="sm" variant={Y === sel.id ? 'default' : 'outline'} onClick={() => s.setOutcome(Y === sel.id ? null : sel.id)}>
              {Y === sel.id ? 'Outcome ✓' : 'Set as outcome'}
            </Button>
            <Button
              size="sm"
              variant={Z.has(sel.id) ? 'default' : 'outline'}
              disabled={sel.id === X || sel.id === Y || !!sel.latent}
              onClick={() => {
                s.toggleAdjusted(sel.id);
                setChecked(false);
              }}
            >
              {Z.has(sel.id) ? 'Adjusted ✓' : 'Adjust for it'}
            </Button>
            <Button
              size="sm"
              variant={sel.latent ? 'default' : 'outline'}
              disabled={sel.id === X || sel.id === Y}
              onClick={() => {
                s.updateNode(sel.id, { latent: !sel.latent });
                if (!sel.latent && Z.has(sel.id)) s.toggleAdjusted(sel.id);
              }}
            >
              {sel.latent ? 'Unmeasured ✓' : 'Mark unmeasured'}
            </Button>
            <Button size="sm" variant="ghost" onClick={() => { s.removeNode(sel.id); setSelected(null); }} aria-label={`Delete ${sel.label}`}>
              <Trash2 className="h-4 w-4 text-bad" /> Delete
            </Button>
          </div>
          {analysis && analysis.roles[sel.id]?.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {analysis.roles[sel.id].map((r) => (
                <Badge key={r} variant="secondary">{roleLabels[r]}</Badge>
              ))}
            </div>
          )}
        </div>
      )}
      {selectedEdge && (
        <div className="flex flex-wrap items-center gap-2 rounded-lg border bg-card p-3 text-sm">
          <span className="font-medium">{label(selectedEdge.from)} → {label(selectedEdge.to)}</span>
          <Button size="sm" variant="outline" onClick={() => { const err = s.reverseEdge(selectedEdge.from, selectedEdge.to); setMessage(err); setSelectedEdge(null); }}>
            <ArrowLeftRight className="h-4 w-4" /> Reverse
          </Button>
          <Button size="sm" variant="ghost" onClick={() => { s.removeEdge(selectedEdge.from, selectedEdge.to); setSelectedEdge(null); }}>
            <Trash2 className="h-4 w-4 text-bad" /> Delete arrow
          </Button>
        </div>
      )}

      {/* Accessible variable list */}
      {dag.nodes.length > 0 && (
        <details className="rounded-lg border bg-card p-3 text-sm">
          <summary className="cursor-pointer font-medium">Variables and arrows (list view)</summary>
          <ul className="mt-3 space-y-1.5">
            {dag.nodes.map((n) => (
              <li key={n.id} className="flex flex-wrap items-center gap-2">
                <button type="button" className="font-medium underline-offset-2 hover:underline" onClick={() => { setMode('move'); setSelected(n.id); }}>
                  {n.label}
                </button>
                {n.id === X && <Badge>exposure</Badge>}
                {n.id === Y && <Badge>outcome</Badge>}
                {Z.has(n.id) && <Badge variant="secondary">adjusted</Badge>}
                {n.latent && <Badge variant="outline">unmeasured</Badge>}
                <span className="text-xs text-muted-foreground">
                  → {dag.edges.filter((e) => e.from === n.id).map((e) => label(e.to)).join(', ') || 'no arrows out'}
                </span>
              </li>
            ))}
          </ul>
          <AddArrowForm labels={dag.nodes.map((n) => ({ id: n.id, label: n.label }))} onAdd={(f, t) => setMessage(s.addEdge(f, t) ?? `Added ${label(f)} → ${label(t)}.`)} />
        </details>
      )}

      {/* Analysis */}
      {!analysis ? (
        dag.nodes.length > 0 && <Callout kind="info" title="Next step">Select a variable and mark it as the <strong>exposure</strong>, another as the <strong>outcome</strong>. The analysis appears here.</Callout>
      ) : (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <Button onClick={() => setChecked(true)}>
              <CheckCircle2 className="h-4 w-4" /> Check my adjustment set
            </Button>
            {!revealed && (
              <Button variant="outline" onClick={() => setRevealed(true)}>
                <Eye className="h-4 w-4" /> Reveal full analysis
              </Button>
            )}
            <span className="text-sm text-muted-foreground">Adjusted for: {adjusted.length ? adjusted.map(label).join(', ') : 'nothing'}</span>
          </div>

          {checked && (
            <Verdict
              valid={analysis.check.valid}
              identifiable={analysis.sets.identifiable}
              openPaths={analysis.check.openBackdoorPaths.map((p) => pathText(p, label))}
              descendants={analysis.check.descendantsOfExposure.map((d) => ({ name: label(d), mediator: analysis.roles[d]?.includes('mediator') }))}
              minimal={analysis.check.valid && analysis.sets.sets.some((st) => st.length === adjusted.length && st.every((v) => Z.has(v)))}
            />
          )}

          {showAnalysis && (
            <>
              <div className="rounded-lg border bg-card p-3 sm:p-4">
                <p className="mb-2 text-sm font-semibold">Minimal sufficient adjustment sets (backdoor criterion, total effect)</p>
                {analysis.sets.identifiable ? (
                  <div className="flex flex-wrap gap-2">
                    {analysis.sets.sets.map((st) => (
                      <button
                        key={st.join('|') || 'empty'}
                        type="button"
                        onClick={() => {
                          s.setAdjusted(st);
                          setChecked(true);
                        }}
                        className="rounded-md border px-2.5 py-1 text-sm hover:border-primary hover:bg-accent"
                      >
                        {st.length ? `{ ${st.map(label).join(', ')} }` : '{ } — no adjustment needed'}
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-bad">None among measured variables. The total effect is not identifiable by covariate adjustment in this DAG.</p>
                )}
                {analysis.sets.truncated && <p className="mt-2 text-xs text-muted-foreground">Large graph: search limited to 16 candidate variables.</p>}
              </div>

              <div className="rounded-lg border bg-card p-3 sm:p-4">
                <p className="mb-1 text-sm font-semibold">All paths between {label(X!)} and {label(Y!)}</p>
                <p className="mb-3 text-xs text-muted-foreground">Tap a path to highlight it on the canvas.</p>
                {analysis.paths.length === 0 && <p className="text-sm text-muted-foreground">No paths: exposure and outcome are not connected.</p>}
                <ul className="space-y-2">
                  {analysis.paths.map(({ p, kind, status }, i) => {
                    const biasing = kind !== 'causal' && status.open;
                    return (
                      <li key={i}>
                        <button
                          type="button"
                          onClick={() => setFocusPath(focusPath === i ? null : i)}
                          className={cn('w-full rounded-md border p-2.5 text-left text-sm transition-colors', focusPath === i ? 'border-primary bg-accent' : 'hover:bg-accent/50')}
                        >
                          <span className="block font-mono text-[13px]">{pathText(p, label)}</span>
                          <span className="mt-1.5 flex flex-wrap items-center gap-1.5">
                            <Badge variant="outline">{kind === 'causal' ? 'Causal' : kind === 'backdoor' ? 'Backdoor' : 'Non-causal'}</Badge>
                            {status.open ? (
                              <Badge variant={biasing ? 'bad' : 'good'}>{biasing ? 'Open — biasing' : 'Open'}</Badge>
                            ) : (
                              <Badge variant="secondary">Blocked</Badge>
                            )}
                            <span className="text-xs text-muted-foreground">
                              {status.blockers.map((b) => (b.kind === 'conditioned-noncollider' ? `blocked by adjusting for ${label(b.node)}` : `blocked at collider ${label(b.node)}`)).join('; ')}
                              {status.openedColliders.length > 0 &&
                                (status.blockers.length ? '; ' : '') +
                                  status.openedColliders.map((c) => (c.via ? `collider ${label(c.node)} opened via its descendant ${label(c.via)}` : `collider ${label(c.node)} opened by adjustment`)).join('; ')}
                              {kind === 'causal' && status.blockers.length > 0 && ' — part of the effect is removed'}
                            </span>
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

function Verdict({ valid, identifiable, openPaths, descendants, minimal }: { valid: boolean; identifiable: boolean; openPaths: string[]; descendants: { name: string; mediator?: boolean }[]; minimal: boolean }) {
  if (valid)
    return (
      <Callout kind="good" title={minimal ? 'Valid and minimal' : 'Valid (sufficient)'}>
        Every backdoor path is blocked and no descendant of the exposure is adjusted for, so — if this DAG is right — the adjusted estimate is free of confounding.
        {!minimal && ' Some variables could be dropped; see the minimal sets.'}
      </Callout>
    );
  return (
    <Callout kind="bad" title="Not sufficient">
      <ul className="list-disc space-y-1 pl-4">
        {openPaths.map((p) => (
          <li key={p}>
            Open backdoor path: <span className="font-mono text-[13px]">{p}</span>
          </li>
        ))}
        {descendants.map((d) => (
          <li key={d.name}>
            {d.name} is a {d.mediator ? 'mediator' : 'descendant of the exposure'}: adjusting {d.mediator ? 'removes part of the total effect' : 'can induce bias'} and is not allowed for the total effect.
          </li>
        ))}
        {!identifiable && <li>No valid set exists with the measured variables — consider design changes or sensitivity analysis.</li>}
      </ul>
    </Callout>
  );
}

function AddArrowForm({ labels, onAdd }: { labels: { id: string; label: string }[]; onAdd: (from: string, to: string) => void }) {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  return (
    <form
      className="mt-3 flex flex-wrap items-end gap-2 border-t pt-3"
      onSubmit={(e) => {
        e.preventDefault();
        if (from && to) onAdd(from, to);
      }}
    >
      <label className="text-xs">
        <span className="mb-1 block text-muted-foreground">Cause</span>
        <select value={from} onChange={(e) => setFrom(e.target.value)} className="h-9 rounded-md border border-input bg-background px-2 text-sm">
          <option value="">—</option>
          {labels.map((l) => <option key={l.id} value={l.id}>{l.label}</option>)}
        </select>
      </label>
      <span className="pb-2">→</span>
      <label className="text-xs">
        <span className="mb-1 block text-muted-foreground">Effect</span>
        <select value={to} onChange={(e) => setTo(e.target.value)} className="h-9 rounded-md border border-input bg-background px-2 text-sm">
          <option value="">—</option>
          {labels.map((l) => <option key={l.id} value={l.id}>{l.label}</option>)}
        </select>
      </label>
      <Button type="submit" size="sm" variant="outline" disabled={!from || !to} className="h-9">Add arrow</Button>
    </form>
  );
}

