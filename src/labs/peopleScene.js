import { bracket, clamp, disc, easeOut, hash, ink, isCompact, label, line, pill, ring } from './worldKit';

const CYCLE = 12;
const STAGES = ['VACANTE', 'ENTREVISTA', 'OFERTA', 'EQUIPO'];
const STAGES_SHORT = ['VACANTE', 'ENTREV.', 'OFERTA', 'EQUIPO'];
const CANDIDATES = 7;

export const peopleScene = {
  hud: ['PEOPLEFLOW', 'PERSONAS Y SELECCIÓN'],
  stillAt: 9.4,
  draw({ ctx, tr, w, h, t, px, py }) {
    const compact = isCompact(w, h);
    const cycle = Math.floor(t / CYCLE);
    const local = t % CYCLE;
    const names = (compact ? STAGES_SHORT : STAGES).map((name) => tr(name));

    const root = { x: w * 0.5, y: h * 0.16 };
    const kids = [{ x: w * 0.26, y: h * 0.31 }, { x: w * 0.74, y: h * 0.31 }, { x: w * 0.5, y: h * 0.31 }];
    ring(ctx, root.x, root.y, 11, 0.85);
    disc(ctx, root.x, root.y, 2.6, 0.9);
    label(ctx, tr('ORGANIZACIÓN'), root.x, root.y - 22, { alpha: 0.45, align: 'center', size: 8 });
    kids.forEach((k, i) => {
      line(ctx, root.x, root.y + 11, k.x, k.y - 8, 0.2);
      ring(ctx, k.x, k.y, 7, i === 2 ? 0.25 : 0.6);
      if (i < 2) disc(ctx, k.x, k.y, 2, 0.6);
    });

    const py0 = h * 0.62;
    const x0 = w * 0.1;
    const x1 = w * 0.9;
    const colW = (x1 - x0) / STAGES.length;
    STAGES.forEach((_, i) => {
      const x = x0 + i * colW;
      pill(ctx, x + 4, py0 - 34, colW - 8, 68, 0.28, { radius: 6 });
      label(ctx, names[i], x + colW / 2, py0 - 44, { alpha: 0.55, align: 'center', size: 8 });
    });
    line(ctx, x0, py0 + 48, x1, py0 + 48, 0.12);

    let hired = 0;
    for (let c = 0; c < CANDIDATES; c += 1) {
      const seed = hash(c, cycle, 4);
      const drop = seed < 0.55 ? 1 + Math.floor(seed * 4) : 4;
      const start = c * 0.55;
      const progress = clamp((local - start) / 6.5) * 3.6;
      const stage = Math.min(progress, drop === 4 ? 3 : drop);
      const x = x0 + colW * (stage + 0.5);
      const y = py0 - 14 + ((c * 37) % 5) * 9 + Math.sin(t * 1.2 + c) * 1.2;
      const out = drop < 4 && progress >= drop;
      if (out) {
        disc(ctx, x, y + (progress - drop) * 6, 2.2, Math.max(0, 0.6 - (progress - drop) * 1.4));
        continue;
      }
      disc(ctx, x, y, 2.6, 0.9);
      if (drop === 4 && progress >= 3.4) hired += 1;
    }

    const joinSlots = Math.min(hired, 1);
    const join = easeOut((local - 8.2) / 1.2) * joinSlots;
    if (join > 0) {
      const k = kids[2];
      const sx = x0 + colW * 3.5;
      const sy = py0 - 20;
      const ex = k.x;
      const ey = k.y + 8;
      ctx.strokeStyle = ink(0.6 * join);
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(sx, sy);
      ctx.bezierCurveTo(sx, sy - 60, ex, ey + 70, ex, ey + 12 - 12 * join);
      ctx.stroke();
      ring(ctx, k.x, k.y, 7 + Math.sin(t * 4) * 1, 0.4 + 0.55 * join);
      disc(ctx, k.x, k.y, 2.4, join);
    }

    if (px >= 0) ring(ctx, px * w, py * h, 8, 0.4);
    bracket(ctx, 14, 14, w - 28, h - 28, 10, 0.3);
    label(ctx, local < 8 ? (compact ? tr('SELECCIÓN') : tr('PROCESO DE SELECCIÓN')) : compact ? tr('NUEVO INGRESO') : tr('NUEVO INGRESO EN LA ESTRUCTURA'), 26, h - 26, { alpha: 0.5 });
  },
};
