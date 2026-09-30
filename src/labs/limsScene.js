import { bracket, clamp, disc, hash, ink, label, line, ring } from './worldKit';

const ROWS = 8;
const COLS = 12;
const CYCLE = 10;
const ROW_NAMES = 'ABCDEFGH';

export const limsScene = {
  hud: ['LIMS · LABSTAT', 'PLACA 96 POZOS'],
  stillAt: 6.2,
  draw({ ctx, w, h, t, px, py }) {
    const pitch = Math.min((w * 0.8) / COLS, (h * 0.62) / ROWS);
    const plateW = pitch * COLS;
    const plateH = pitch * ROWS;
    const shiftX = px < 0 ? 0 : (0.5 - px) * 10;
    const shiftY = py < 0 ? 0 : (0.5 - py) * 8;
    const x0 = (w - plateW) / 2 + shiftX;
    const y0 = (h - plateH) / 2 + h * 0.03 + shiftY;

    const phase = (t / CYCLE) % 1;
    const scanX = x0 - pitch + clamp(phase / 0.78) * (plateW + pitch * 2);
    const fade = phase > 0.9 ? (1 - phase) / 0.1 : 1;

    ctx.strokeStyle = ink(0.22);
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x0 - 10 + 14, y0 - 10);
    ctx.lineTo(x0 + plateW + 10, y0 - 10);
    ctx.lineTo(x0 + plateW + 10, y0 + plateH + 10);
    ctx.lineTo(x0 - 10, y0 + plateH + 10);
    ctx.lineTo(x0 - 10, y0 - 10 + 14);
    ctx.closePath();
    ctx.stroke();

    for (let c = 0; c < COLS; c += 1) {
      label(ctx, String(c + 1).padStart(2, '0'), x0 + pitch * (c + 0.5), y0 - 24, { alpha: 0.3, align: 'center', size: 8 });
    }
    for (let r = 0; r < ROWS; r += 1) {
      label(ctx, ROW_NAMES[r], x0 - 26, y0 + pitch * (r + 0.5), { alpha: 0.3, align: 'center', size: 8 });
    }

    let hovered = null;
    let bestDistance = pitch * 0.55;

    for (let r = 0; r < ROWS; r += 1) {
      for (let c = 0; c < COLS; c += 1) {
        const cx = x0 + pitch * (c + 0.5);
        const cy = y0 + pitch * (r + 0.5);
        const radius = pitch * 0.34;
        const seed = hash(r + 1, c + 1, Math.floor(t / CYCLE));
        const done = clamp((scanX - cx) / (pitch * 2.2));
        const flagged = seed > 0.93;

        ring(ctx, cx, cy, radius, 0.2);
        if (done > 0) {
          const fill = (flagged ? 0.35 : 0.85) * done * fade;
          disc(ctx, cx, cy, radius * (flagged ? 0.4 : 0.62) * (0.6 + 0.4 * done), fill);
        }
        if (flagged && done > 0.6) {
          const pulse = (t * 0.9 + seed * 5) % 1;
          ring(ctx, cx, cy, radius * (1 + pulse * 0.9), (1 - pulse) * 0.6 * fade);
        }

        if (px >= 0) {
          const d = Math.hypot(px * w - cx, py * h - cy);
          if (d < bestDistance) {
            bestDistance = d;
            hovered = { cx, cy, radius, r, c, seed };
          }
        }
      }
    }

    const grad = ctx.createLinearGradient(scanX - 90, 0, scanX, 0);
    grad.addColorStop(0, ink(0));
    grad.addColorStop(1, ink(0.16 * fade));
    ctx.fillStyle = grad;
    ctx.fillRect(scanX - 90, y0 - 14, 90, plateH + 28);
    line(ctx, scanX, y0 - 18, scanX, y0 + plateH + 18, 0.8 * fade);

    if (hovered) {
      ring(ctx, hovered.cx, hovered.cy, hovered.radius + 5, 0.9);
      const id = `${ROW_NAMES[hovered.r]}${hovered.c + 1}`;
      label(ctx, `${id} · MUESTRA ${String(Math.floor(hovered.seed * 9000) + 1000)}`, hovered.cx, hovered.cy - hovered.radius - 16, { alpha: 0.95, align: 'center' });
    }

    bracket(ctx, 14, 14, w - 28, h - 28, 10, 0.3);
    const complete = Math.round(clamp(phase / 0.78) * 96);
    label(ctx, `PROCESADAS ${String(complete).padStart(2, '0')}/96`, 26, h - 26, { alpha: 0.5 });
  },
};
