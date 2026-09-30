import { bracket, clamp, disc, easeOut, hash, ink, isCompact, label, line, pill, ring } from './worldKit';

const CYCLE = 12;
// Landmarks in a 0..1 box: eyes, nose, mouth corners.
const LANDMARKS = [[0.34, 0.4], [0.66, 0.4], [0.5, 0.56], [0.38, 0.72], [0.62, 0.72]];

function dotHead(ctx, x, y, size, scanX, alpha) {
  const step = Math.max(5, size / 16);
  const cx = x + size / 2;
  for (let gy = y; gy < y + size; gy += step) {
    for (let gx = x; gx < x + size; gx += step) {
      const nx = (gx - cx) / (size * 0.5);
      const ny = (gy - (y + size * 0.42)) / (size * 0.46);
      const head = nx * nx * 1.15 + ny * ny < 0.62;
      const shoulders = (gy - (y + size * 0.86)) > 0 && Math.abs(nx) < 0.9 - (gy - (y + size * 0.86)) / size * 1.2;
      if (!head && !shoulders) continue;
      const near = Math.exp(-((gx - scanX) ** 2) / 900);
      disc(ctx, gx, gy, 1 + near * 0.9, alpha * (0.35 + near * 0.65));
    }
  }
}

export const biomatchScene = {
  hud: ['BIOPASS · BIOMATCH', 'VERIFICACIÓN DE IDENTIDAD'],
  stillAt: 9,
  draw({ ctx, tr, num, w, h, t, px, py }) {
    const compact = isCompact(w, h);
    const local = t % CYCLE;
    const size = compact ? Math.min(w * 0.36, h * 0.27) : Math.min(w * 0.3, h * 0.5);
    const fx = compact ? w * 0.5 - size / 2 : w * 0.1;
    const fy = compact ? h * 0.2 : h * 0.5 - size / 2;
    const dw = compact ? w * 0.7 : w * 0.34;
    const dh = compact ? h * 0.24 : h * 0.4;
    const dx = compact ? w * 0.15 : w * 0.56;
    const dy = compact ? h * 0.6 : h * 0.5 - dh / 2;

    const scan = clamp((local - 0.8) / 4.2);
    const scanX = fx + scan * size;
    const scanning = scan > 0 && scan < 1;

    dotHead(ctx, fx, fy, size, scanning ? scanX : fx - 100, 0.9);
    ctx.strokeStyle = ink(0.25);
    ctx.strokeRect(fx - 8, fy - 8, size + 16, size + 16);
    if (scanning) line(ctx, scanX, fy - 12, scanX, fy + size + 12, 0.9);
    if (!compact) label(ctx, tr('PERSONA'), fx, fy - 18, { alpha: 0.45, size: 8 });

    pill(ctx, dx, dy, dw, dh, 0.55, { radius: 6 });
    label(ctx, tr('DOCUMENTO'), dx + 12, dy + 14, { alpha: 0.4, size: 8 });
    const pw = Math.min(dh * 0.62, dw * 0.34);
    const phx = dx + 14;
    const phy = dy + 26;
    ctx.strokeStyle = ink(0.4);
    ctx.strokeRect(phx, phy, pw, pw);
    dotHead(ctx, phx + 2, phy + 2, pw - 4, phx + scan * pw, 0.6);
    for (let i = 0; i < 4; i += 1) {
      ctx.fillStyle = ink(0.22 + (i === 0 ? 0.2 : 0));
      ctx.fillRect(phx + pw + 14, phy + 6 + i * 13, (dw - pw - 44) * (i === 3 ? 0.5 : 0.9 - i * 0.12), 3);
    }
    ctx.fillStyle = ink(0.16);
    ctx.fillRect(dx + 12, dy + dh - 16, dw - 24, 4);

    const matched = clamp((local - 2.4) / 3.2) * LANDMARKS.length;
    LANDMARKS.forEach(([lx, ly], i) => {
      const a = clamp(matched - i);
      if (a <= 0) return;
      const sx = fx + lx * size;
      const sy = fy + ly * size;
      const ex = phx + 2 + lx * (pw - 4);
      const ey = phy + 2 + ly * (pw - 4);
      ctx.strokeStyle = ink(0.5 * a);
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(sx, sy);
      ctx.bezierCurveTo(sx + (ex - sx) * 0.35, sy - 20 * (1 - a), ex - (ex - sx) * 0.35, ey - 20 * (1 - a), ex, ey);
      ctx.stroke();
      disc(ctx, sx, sy, 2.4, a);
      disc(ctx, ex, ey, 2.4, a);
    });

    const done = easeOut((local - 6.4) / 0.7);
    const seconds = clamp((local - 0.4) / 6.4) * 11;
    const cx = compact ? w * 0.5 : w * 0.5;
    const cy = compact ? h * 0.54 : h * 0.86;
    label(ctx, `${num(seconds.toFixed(1))} s`, compact ? w * 0.08 : w * 0.1, compact ? h * 0.54 : h * 0.86, { alpha: 0.9, size: compact ? 16 : 20 });
    if (done > 0) {
      ring(ctx, compact ? w * 0.8 : cx, cy, 12 + (1 - done) * 8, 0.95 * done);
      label(ctx, '✓', compact ? w * 0.8 : cx, cy, { alpha: done, align: 'center', size: 12 });
      label(ctx, tr('IDENTIDAD VERIFICADA'), compact ? w * 0.8 : cx + 22, compact ? cy + 28 : cy, { alpha: 0.9 * done, align: compact ? 'center' : 'left', size: 8 });
    }
    const arrowHash = hash(Math.floor(t / CYCLE), 2);
    if (px >= 0 && arrowHash >= 0) ring(ctx, px * w, py * h, 8, 0.4);
    bracket(ctx, 14, 14, w - 28, h - 28, 10, 0.3);
    label(ctx, local < 2.4 ? (compact ? tr('ESCANEANDO') : tr('ESCANEANDO ROSTRO')) : done < 1 ? (compact ? tr('COTEJANDO') : tr('COTEJANDO CON EL DOCUMENTO')) : tr('COINCIDENCIA'), 26, h - 26, { alpha: 0.5 });
  },
};
