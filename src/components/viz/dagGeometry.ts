export type EdgeTone = 'default' | 'open' | 'blocked' | 'causal' | 'faded';

export const NODE_H = 30;
export function nodeWidth(label: string) {
  return Math.max(40, label.length * 7.4 + 22);
}

/** Point where the segment from (cx,cy) toward (tx,ty) leaves a w×h rectangle centred at (cx,cy). */
export function exitPoint(cx: number, cy: number, tx: number, ty: number, w: number, h: number, gap: number) {
  const dx = tx - cx;
  const dy = ty - cy;
  if (dx === 0 && dy === 0) return { x: cx, y: cy };
  const s = Math.min(Math.abs(dx) > 1e-9 ? w / 2 / Math.abs(dx) : Infinity, Math.abs(dy) > 1e-9 ? h / 2 / Math.abs(dy) : Infinity);
  const len = Math.hypot(dx, dy);
  return { x: cx + dx * s + (dx / len) * gap, y: cy + dy * s + (dy / len) * gap };
}

export function layout(width: number, height: number, pad = 34) {
  return {
    px: (x: number) => pad + (x / 100) * (width - 2 * pad),
    py: (y: number) => pad + (y / 100) * (height - 2 * pad),
    invX: (px: number) => ((px - pad) / (width - 2 * pad)) * 100,
    invY: (py: number) => ((py - pad) / (height - 2 * pad)) * 100,
  };
}
