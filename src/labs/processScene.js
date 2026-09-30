import { arrow, bar, bracket, diamond, disc, easeOut, ink, isCompact, label, line, pill } from './worldKit';

const WIDE = [
  { id: 0, kind: 'pill', x: 0.13, y: 0.5, w: 74, text: 'INICIO' },
  { id: 1, kind: 'rect', x: 0.3, y: 0.5, w: 92, text: 'TAREA' },
  { id: 2, kind: 'diamond', x: 0.48, y: 0.5, w: 84, text: '¿OK?' },
  { id: 3, kind: 'rect', x: 0.66, y: 0.3, w: 92, text: 'REVISIÓN' },
  { id: 4, kind: 'rect', x: 0.66, y: 0.7, w: 92, text: 'ENTREGA' },
  { id: 5, kind: 'pill', x: 0.86, y: 0.5, w: 70, text: 'FIN' },
];
const STACKED = [
  { id: 0, kind: 'pill', x: 0.5, y: 0.13, w: 64, text: 'INICIO' },
  { id: 1, kind: 'rect', x: 0.5, y: 0.26, w: 78, text: 'TAREA' },
  { id: 2, kind: 'diamond', x: 0.5, y: 0.41, w: 70, text: '¿OK?' },
  { id: 3, kind: 'rect', x: 0.24, y: 0.56, w: 78, text: 'REVISIÓN' },
  { id: 4, kind: 'rect', x: 0.76, y: 0.56, w: 78, text: 'ENTREGA' },
  { id: 5, kind: 'pill', x: 0.5, y: 0.69, w: 56, text: 'FIN' },
];
const HALF_H = { pill: 13, rect: 16, diamond: 23 };
const LINKS = [[0, 1], [1, 2], [2, 3], [2, 4], [3, 5], [4, 5]];
const CYCLE = 4;
const SELECT_ORDER = [1, 2, 4, 3];

export const processScene = {
  hud: ['MAPEO DE PROCESOS', 'LIENZO + DATOS'],
  stillAt: 5.2,
  draw({ ctx, w, h, t, px, py }) {
    const compact = isCompact(w, h);
    const NODES = compact ? STACKED : WIDE;
    const gap = 26;
    ctx.fillStyle = ink(0.09);
    for (let x = gap; x < w; x += gap) for (let y = gap; y < h; y += gap) ctx.fillRect(x, y, 1, 1);

    const sel = SELECT_ORDER[Math.floor(t / CYCLE) % SELECT_ORDER.length];
    const local = t % CYCLE;
    const pos = (n) => ({ x: w * n.x, y: h * n.y });

    LINKS.forEach(([a, b], k) => {
      const A = pos(NODES[a]);
      const B = pos(NODES[b]);
      const sx = compact ? A.x : A.x + NODES[a].w / 2;
      const sy = compact ? A.y + HALF_H[NODES[a].kind] : A.y;
      const ex = compact ? B.x : B.x - NODES[b].w / 2;
      const ey = compact ? B.y - HALF_H[NODES[b].kind] : B.y;
      arrow(ctx, sx, sy, ex, ey, 0.3);
      const p = (t * 0.25 + k * 0.17) % 1;
      disc(ctx, sx + (ex - sx) * p, sy + (ey - sy) * p, 1.8, 0.7 * Math.sin(p * Math.PI));
    });

    let hovered = null;
    NODES.forEach((n) => {
      const c = pos(n);
      const active = n.id === sel;
      const a = active ? 0.95 : 0.5;
      if (px >= 0 && Math.hypot(px * w - c.x, py * h - c.y) < 34) hovered = n;
      if (n.kind === 'pill') pill(ctx, c.x - n.w / 2, c.y - 13, n.w, 26, a, { fill: active ? 0.14 : 0.04 });
      else if (n.kind === 'rect') pill(ctx, c.x - n.w / 2, c.y - 16, n.w, 32, a, { fill: active ? 0.14 : 0.04, radius: 3 });
      else diamond(ctx, c.x, c.y, n.w, 46, a, active ? 0.14 : 0.04);
      label(ctx, n.text, c.x, c.y, { alpha: active ? 1 : 0.6, align: 'center', size: 9 });
    });

    const target = hovered ?? NODES[sel];
    const c = pos(target);
    const reveal = hovered ? 1 : easeOut(local / 0.7);
    const cardW = compact ? Math.min(150, w - 40) : 150;
    const cardH = (compact ? 58 : 74) * reveal;
    const cx = compact ? (w - cardW) / 2 : Math.min(w - cardW - 18, Math.max(18, c.x - cardW / 2));
    const cy = compact ? h * 0.76 : c.y > h * 0.5 ? c.y - 42 - cardH : c.y + 40;
    if (!compact) line(ctx, c.x, c.y + (c.y > h * 0.5 ? -16 : 16), c.x, c.y > h * 0.5 ? cy + cardH : cy, 0.4);
    pill(ctx, cx, cy, cardW, cardH, 0.7, { fill: 0.07, radius: 4 });
    if (reveal > 0.6) {
      const rowGap = compact ? 16 : 20;
      ['RESPONSABLE', 'TIEMPO', 'ESTADO'].forEach((k, i) => {
        label(ctx, k, cx + 10, cy + (compact ? 12 : 16) + i * rowGap, { alpha: 0.5, size: 8 });
        bar(ctx, cx + 88, cy + (compact ? 10 : 14) + i * rowGap, 32 + ((i * 17 + target.id * 13) % 12), 3, 0.55);
      });
    }

    [[0.9, 0.85, 'A', 0.0], [1.7, 1.3, 'B', 2.2]].forEach(([fx, fy, tag, ph]) => {
      const x = w * (0.5 + 0.34 * Math.sin(t * 0.32 + ph));
      const y = h * (0.5 + 0.3 * Math.cos(t * 0.27 * fy + ph * fx));
      ctx.fillStyle = ink(0.9);
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + 9, y + 4);
      ctx.lineTo(x + 4, y + 9);
      ctx.closePath();
      ctx.fill();
      pill(ctx, x + 10, y + 8, 16, 12, 0.6);
      label(ctx, tag, x + 18, y + 14, { alpha: 0.9, align: 'center', size: 8 });
    });

    bracket(ctx, 14, 14, w - 28, h - 28, 10, 0.3);
    label(ctx, compact ? 'CADA FORMA, SUS DATOS' : 'CADA FORMA GUARDA SUS DATOS', 26, h - 26, { alpha: 0.5 });
  },
};
