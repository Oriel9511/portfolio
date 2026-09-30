import { bracket, clamp, disc, easeInOut, easeOut, hash, ink, isCompact, label, line, pill, ring } from './worldKit';

const CYCLE = 12;
const EXPERTS = [
  { x: 0.62, y: 0.2 },
  { x: 0.84, y: 0.36 },
  { x: 0.7, y: 0.6 },
  { x: 0.9, y: 0.78 },
];
const HOT = 2;

export const eemeshScene = {
  hud: ['EEMESH · SIMULACIÓN', 'EXPERTOS DISTRIBUIDOS'],
  stillAt: 4.6,
  draw({ ctx, w, h, t, px, py }) {
    const compact = isCompact(w, h);
    const local = t % CYCLE;
    const chunked = local >= 6;
    const rx = w * 0.14;
    const ry = h * 0.5;

    ring(ctx, rx, ry, 16, 0.9);
    disc(ctx, rx, ry, 3.5, 1);
    label(ctx, 'ENRUTADOR', rx, ry + 34, { alpha: 0.55, align: 'center', size: 9 });

    EXPERTS.forEach((e, i) => {
      const ex = w * e.x;
      const ey = h * e.y;
      const dist = Math.hypot(ex - rx, ey - ry);
      const hot = i === HOT;
      line(ctx, rx + 16, ry, ex - 14, ey, 0.13);
      ring(ctx, ex, ey, 13, hot ? 0.95 : 0.6);
      disc(ctx, ex, ey, 3, hot ? 1 : 0.6);
      label(ctx, `E${i + 1}`, ex, ey - 26, { alpha: 0.5, align: 'center', size: 9 });

      const speed = 0.22 + (1200 - Math.min(dist, 1200)) * 0.00005;
      for (let k = 0; k < 3; k += 1) {
        const phase = (t * speed + k / 3 + hash(i, 4) * 3) % 1;
        const x = rx + 16 + (ex - 14 - rx - 16) * phase;
        const y = ry + (ey - ry) * phase;
        disc(ctx, x, y, hot && !chunked ? 2 : 1.8, 0.7 * Math.sin(phase * Math.PI));
      }
    });

    const hx = w * EXPERTS[HOT].x;
    const hy = h * EXPERTS[HOT].y;
    const qx = hx - 30;

    if (!chunked) {
      const bigIn = easeOut(local / 1.2);
      pill(ctx, qx - 92 * bigIn, hy - 9, 88 * bigIn, 18, 0.95, { fill: 0.22, radius: 3 });
      label(ctx, 'PROMPT LARGO', qx - 92, hy - 26, { alpha: 0.7, size: 8 });
      const queued = Math.floor(clamp((local - 1.2) / 4.6) * 9);
      for (let j = 0; j < queued; j += 1) {
        pill(ctx, qx - 92 + j * 11, hy + 14, 8, 8, 0.65, { fill: 0.15, radius: 2 });
      }
    } else {
      const s = (local - 6) / 5.5;
      for (let j = 0; j < 4; j += 1) {
        const life = clamp(s * 4 - j * 0.8);
        const x = qx - 92 + (1 - easeInOut(life)) * 0 + life * 92;
        pill(ctx, x - 24, hy - 9, 22, 18, 0.9 * (1 - life), { fill: 0.2 * (1 - life), radius: 3 });
      }
      const left = Math.max(0, 9 - Math.floor(clamp(s * 1.6) * 9));
      for (let j = 0; j < left; j += 1) {
        pill(ctx, qx - 92 + j * 11, hy + 14, 8, 8, 0.6, { fill: 0.12, radius: 2 });
      }
      label(ctx, 'PREFILL FRAGMENTADO', qx - 92, hy - 26, { alpha: 0.9, size: 8 });
    }

    const from = 1930;
    const to = 58;
    const p99 = !chunked ? from : Math.round(from + (to - from) * easeOut((local - 6) / 2.5));
    const shown = p99 >= 1000 ? `${(p99 / 1000).toFixed(2).replace('.', ',')} s` : `${p99} ms`;
    label(ctx, 'LATENCIA P99 POR TOKEN', w * 0.07, h * 0.12, { alpha: 0.45, size: 8 });
    label(ctx, shown, w * 0.07, h * 0.12 + 26, { alpha: 0.95, size: 24 });

    const gx = w * 0.07;
    const gy = compact ? h * 0.72 : h * 0.82;
    line(ctx, gx, gy, gx + 150, gy, 0.2);
    ctx.strokeStyle = ink(0.8);
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let i = 0; i <= 60; i += 1) {
      const u = i / 60;
      const tt = u * CYCLE;
      const val = tt < 6 ? 1 - 0.05 * Math.sin(tt * 3) : 1 - 0.95 * easeOut((tt - 6) / 2.5);
      const x = gx + u * 150;
      const y = gy - 42 * val;
      if (u * CYCLE > local) break;
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.stroke();

    if (px >= 0) ring(ctx, px * w, py * h, 8, 0.4);
    bracket(ctx, 14, 14, w - 28, h - 28, 10, 0.3);
    label(ctx, chunked ? (compact ? 'COLA DRENADA' : 'COLA DRENADA · RESULTADO DE SIMULACIÓN') : compact ? 'HEAD-OF-LINE' : 'BLOQUEO HEAD-OF-LINE · COLA CRECIENDO', 26, h - 26, { alpha: 0.5 });
  },
};
