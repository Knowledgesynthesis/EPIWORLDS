import { useId } from 'react';
import { exitPoint, layout, NODE_H, nodeWidth, type EdgeTone } from './dagGeometry';
import { useWidth } from './useWidth';

export type { EdgeTone };

export type DrawNodeRole = 'exposure' | 'outcome' | 'default';

export interface DrawNode {
  id: string;
  label: string;
  /** Position in percent of the drawing area (0–100). */
  x: number;
  y: number;
  role?: DrawNodeRole;
  adjusted?: boolean;
  latent?: boolean;
  selected?: boolean;
  pending?: boolean;
}

export interface DrawEdge {
  from: string;
  to: string;
  tone?: EdgeTone;
}

const toneColor: Record<EdgeTone, string> = {
  default: 'var(--chart-ink-2)',
  open: 'var(--status-bad)',
  blocked: 'var(--chart-muted)',
  causal: 'var(--status-good)',
  faded: 'var(--chart-axis)',
};

interface DagSvgBodyProps {
  nodes: DrawNode[];
  edges: DrawEdge[];
  width: number;
  height: number;
  onNodePointerDown?: (id: string, e: React.PointerEvent) => void;
  onEdgeClick?: (from: string, to: string) => void;
}

/** Shared renderer used by static figures and the interactive workbench. */
export function DagSvgBody({ nodes, edges, width, height, onNodePointerDown, onEdgeClick }: DagSvgBodyProps) {
  const uid = useId().replace(/:/g, '');
  const { px, py } = layout(width, height);
  const byId = new Map(nodes.map((n) => [n.id, n]));
  return (
    <>
      <defs>
        {(Object.keys(toneColor) as EdgeTone[]).map((t) => (
          <marker key={t} id={`${uid}-${t}`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0,0 L10,5 L0,10 z" fill={toneColor[t]} />
          </marker>
        ))}
      </defs>
      {edges.map((e) => {
        const a = byId.get(e.from);
        const b = byId.get(e.to);
        if (!a || !b) return null;
        const ax = px(a.x);
        const ay = py(a.y);
        const bx = px(b.x);
        const by = py(b.y);
        const start = exitPoint(ax, ay, bx, by, nodeWidth(a.label), NODE_H, 2);
        const end = exitPoint(bx, by, ax, ay, nodeWidth(b.label), NODE_H, 3);
        const tone = e.tone ?? 'default';
        return (
          <g key={`${e.from}->${e.to}`}>
            <line
              x1={start.x}
              y1={start.y}
              x2={end.x}
              y2={end.y}
              stroke={toneColor[tone]}
              strokeWidth={tone === 'open' || tone === 'causal' ? 2.5 : 1.75}
              strokeDasharray={tone === 'blocked' ? '5 4' : undefined}
              markerEnd={`url(#${uid}-${tone})`}
            />
            {onEdgeClick && (
              <line
                x1={start.x}
                y1={start.y}
                x2={end.x}
                y2={end.y}
                stroke="transparent"
                strokeWidth={16}
                className="cursor-pointer"
                onClick={() => onEdgeClick(e.from, e.to)}
              >
                <title>{`${a.label} → ${b.label} (tap to select)`}</title>
              </line>
            )}
          </g>
        );
      })}
      {nodes.map((n) => {
        const w = nodeWidth(n.label);
        const cx = px(n.x);
        const cy = py(n.y);
        const fill = n.role === 'exposure' ? 'var(--series-2)' : n.role === 'outcome' ? 'var(--series-1)' : 'var(--chart-surface)';
        const ink = n.role === 'exposure' || n.role === 'outcome' ? '#ffffff' : 'var(--chart-ink)';
        return (
          <g
            key={n.id}
            transform={`translate(${cx - w / 2} ${cy - NODE_H / 2})`}
            onPointerDown={onNodePointerDown ? (e) => onNodePointerDown(n.id, e) : undefined}
            className={onNodePointerDown ? 'cursor-grab touch-none' : undefined}
          >
            {n.selected && <rect x={-5} y={-5} width={w + 10} height={NODE_H + 10} rx={n.adjusted ? 6 : 19} fill="none" stroke="hsl(var(--ring))" strokeWidth={2} />}
            {n.pending && <rect x={-5} y={-5} width={w + 10} height={NODE_H + 10} rx={n.adjusted ? 6 : 19} fill="none" stroke="var(--series-3)" strokeWidth={2} strokeDasharray="4 3" />}
            <rect
              width={w}
              height={NODE_H}
              rx={n.adjusted ? 3 : NODE_H / 2}
              fill={fill}
              stroke={n.adjusted ? 'var(--chart-ink)' : n.role === 'exposure' || n.role === 'outcome' ? 'transparent' : 'var(--chart-ink-2)'}
              strokeWidth={n.adjusted ? 2.5 : 1.25}
              strokeDasharray={n.latent ? '4 3' : undefined}
            />
            <text x={w / 2} y={NODE_H / 2 + 4.5} textAnchor="middle" fontSize={13} fontWeight={600} fill={ink} className="pointer-events-none select-none">
              {n.label}
            </text>
          </g>
        );
      })}
    </>
  );
}

interface DagFigureProps {
  nodes: DrawNode[];
  edges: DrawEdge[];
  title: string;
  height?: number;
  caption?: string;
}

/** A static, responsive causal diagram for lessons. */
export function DagFigure({ nodes, edges, title, height = 180, caption }: DagFigureProps) {
  const [ref, width] = useWidth<HTMLDivElement>(480);
  return (
    <figure className="mx-auto w-full max-w-2xl rounded-lg border bg-card p-2">
      <div ref={ref}>
        <svg width={width} height={height} role="img" aria-label={title} className="block">
          <title>{title}</title>
          <DagSvgBody nodes={nodes} edges={edges} width={width} height={height} />
        </svg>
      </div>
      {caption && <figcaption className="px-2 pb-1 text-xs text-muted-foreground">{caption}</figcaption>}
    </figure>
  );
}
