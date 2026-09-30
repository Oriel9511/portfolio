import { bar, bracket, clamp, disc, easeInOut, easeOut, ink, isCompact, label, line, pill, ring } from './worldKit';

const SOURCES = ['PREGUNTA', 'PEDIDO', 'RECLAMO'];
const EVERY = 1.1;
const TRAVEL = 1.9;
const ROWS = 5;

export const meliScene = {
  hud: ['MARKETPLACE → BANDEJA', 'CANAL OMNICANAL'],
  stillAt: 6.4,
  draw({ ctx, w, h, t, px, py }) {
    const compact = isCompact(w, h);
    const panel = compact
      ? { x: w * 0.08, y: h * 0.4, w: w * 0.84, h: h * 0.46 }
      : { x: w * 0.5, y: h * 0.17, w: w * 0.44, h: h * 0.66 };
    const src = SOURCES.map((_, i) => (compact
      ? { x: w * (0.17 + i * 0.33), y: h * 0.16 }
      : { x: w * 0.08, y: h * (0.26 + i * 0.24) }));

    SOURCES.forEach((name, i) => {
      const s = src[i];
      pill(ctx, s.x - (compact ? 28 : 0), s.y - 11, compact ? 56 : 82, 22, 0.55, { radius: 5 });
      label(ctx, compact ? name.slice(0, 5) : name, s.x + (compact ? 0 : 41), s.y, { alpha: 0.75, align: 'center', size: 8 });
    });

    ctx.strokeStyle = ink(0.28);
    ctx.strokeRect(panel.x, panel.y, panel.w, panel.h);
    label(ctx, 'BANDEJA DE ATENCIÓN', panel.x + 12, panel.y + 14, { alpha: 0.45, size: 8 });

    const newestN = Math.floor((t - TRAVEL) / EVERY);
    const events = [];
    for (let n = newestN; n >= Math.max(0, newestN - ROWS + 1); n -= 1) events.push({ n, lane: n % 3, at: n * EVERY + TRAVEL });
    const rowH = (panel.h - 30) / ROWS;

    for (let n = Math.floor(t / EVERY); n >= Math.max(0, Math.floor(t / EVERY) - 3); n -= 1) {
      const start = n * EVERY;
      const life = t - start;
      if (life < 0 || life > TRAVEL) continue;
      const lane = n % 3;
      const p = easeInOut(life / TRAVEL);
      const s = src[lane];
      const tx = compact ? panel.x + panel.w * 0.5 : panel.x;
      const ty = compact ? panel.y : panel.y + 26 + rowH * 0.5;
      const x = s.x + (tx - s.x) * p;
      const y = s.y + (ty - s.y) * p;
      pill(ctx, x - 12, y - 4, 24, 8, 0.9 * (1 - 0.3 * p), { fill: 0.15, radius: 3 });
    }

    const shift = events.length ? easeOut((t - events[0].at) / 0.5) : 1;
    events.forEach((e, idx) => {
      const y = panel.y + 26 + (idx - 1 + shift) * rowH;
      const fresh = idx === 0;
      const a = (fresh ? 0.95 : 0.45) * (fresh ? shift : 1) * (idx === ROWS - 1 ? 1 - shift : 1);
      pill(ctx, panel.x + 10, y + 3, panel.w - 20, rowH - 8, a * 0.7, { fill: fresh ? 0.1 : 0.03, radius: 4 });
      ring(ctx, panel.x + 24, y + rowH / 2 - 1, 5, a);
      if (e.lane === 2) disc(ctx, panel.x + 24, y + rowH / 2 - 1, 2, a);
      label(ctx, SOURCES[e.lane].slice(0, compact ? 5 : 9), panel.x + 38, y + rowH / 2 - 1, { alpha: a, size: 8 });
      bar(ctx, panel.x + (compact ? 80 : 104), y + rowH / 2 - 2, (panel.w - (compact ? 110 : 140)) * (0.4 + ((e.n * 37) % 50) / 100), 3, a * 0.6);
    });

    const newest = events[0];
    if (newest && !compact) {
      const ready = easeOut((t - newest.at - 0.5) / 0.7);
      if (ready > 0) {
        const cw = 96 * ready;
        const cx = panel.x - cw - 16;
        const cy = panel.y + 26 + rowH * 0.5 - 22;
        pill(ctx, cx, cy, cw, 50, 0.55, { fill: 0.05, radius: 5 });
        if (ready > 0.7) {
          ctx.strokeStyle = ink(0.4);
          ctx.strokeRect(cx + 8, cy + 8, 22, 22);
          bar(ctx, cx + 38, cy + 12, 44, 3, 0.6);
          bar(ctx, cx + 38, cy + 21, 30, 2, 0.35);
          label(ctx, newest.lane === 2 ? 'CONTEXTO · RECLAMO' : 'CONTEXTO', cx + 8, cy + 42, { alpha: 0.6, size: 7 });
          line(ctx, cx + cw, cy + 25, panel.x + 10, cy + 25, 0.3);
        }
      }
    }

    const tl = compact ? { x: w * 0.1, y: h * 0.32, len: w * 0.8 } : { x: w * 0.06, y: h * 0.92, len: w * 0.36 };
    line(ctx, tl.x, tl.y, tl.x + tl.len, tl.y, 0.18);
    ['APERTURA', 'MENSAJES', 'CIERRE'].forEach((k, i) => {
      const x = tl.x + (tl.len * i) / 2;
      const lit = clamp(((t % 9) - i * 2.6) / 0.6);
      ring(ctx, x, tl.y, 4.5, 0.4 + 0.5 * lit);
      if (lit > 0) disc(ctx, x, tl.y, 2 * lit, 0.9);
      if (!compact) label(ctx, k, x, tl.y - 14, { alpha: 0.4 + 0.4 * lit, align: i === 0 ? 'left' : i === 2 ? 'right' : 'center', size: 8 });
    });

    if (px >= 0) ring(ctx, px * w, py * h, 8, 0.4);
    bracket(ctx, 14, 14, w - 28, h - 28, 10, 0.3);
    label(ctx, compact ? 'TODO EN UN HILO' : 'PREGUNTAS, PEDIDOS Y RECLAMOS EN UN SOLO HILO', 26, compact ? h - 26 : h - 26, { alpha: 0.5 });
  },
};
