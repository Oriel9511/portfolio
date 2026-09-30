import { arrow, bar, bracket, clamp, disc, easeOut, hash, label, line, pill, ring } from './worldKit';

const CYCLE = 10;
const ROWS = 10;

export const agentsScene = {
  hud: ['AGENTES ANALISTAS', 'HERRAMIENTAS + HUMANO'],
  stillAt: 6.6,
  draw({ ctx, w, h, t, px, py }) {
    const cycle = Math.floor(t / CYCLE);
    const local = t % CYCLE;
    const tx = w * 0.06;
    const ty = h * 0.2;
    const rowH = (h * 0.6) / ROWS;
    const tw = w * 0.24;
    const filtering = clamp((local - 3.2) / 0.8);
    const match = (r) => hash(r, 3, cycle) > 0.45;

    label(ctx, 'DATOS', tx, ty - 14, { alpha: 0.45, size: 8 });
    for (let r = 0; r < ROWS; r += 1) {
      const y = ty + r * rowH;
      const keep = match(r);
      const alpha = filtering > 0 && !keep ? 0.12 : 0.55;
      bar(ctx, tx, y, tw * (0.4 + hash(r, 1) * 0.15), 3, alpha);
      bar(ctx, tx + tw * 0.62, y, tw * 0.2, 3, alpha);
      bar(ctx, tx + tw * 0.88, y, tw * 0.1, 3, alpha);
      if (filtering > 0 && keep) line(ctx, tx - 6, y + 1.5, tx - 2, y + 1.5, 0.9);
    }

    const ax = [w * 0.44, w * 0.58, w * 0.72];
    const ay = [h * 0.32, h * 0.62, h * 0.32];
    const names = ['ANALISTA', 'EJECUTOR', 'HUMANO'];
    ax.forEach((x, i) => {
      const active = (i === 0 && local < 3.2) || (i === 1 && local >= 3.2 && local < 6.4) || (i === 2 && local >= 6.4);
      ring(ctx, x, ay[i], 17, active ? 0.95 : 0.5);
      disc(ctx, x, ay[i], active ? 4 : 2.5, active ? 1 : 0.6);
      label(ctx, names[i], x, ay[i] + 34, { alpha: 0.6, align: 'center', size: 8 });
    });
    arrow(ctx, ax[0] + 18, ay[0] + 10, ax[1] - 14, ay[1] - 14, 0.3);
    arrow(ctx, ax[1] + 18, ay[1] - 12, ax[2] - 14, ay[2] + 14, 0.3);
    arrow(ctx, tx + tw + 8, h * 0.5, ax[0] - 22, ay[0] + 6, 0.2);

    const legs = [[ax[0], ay[0], ax[1], ay[1], 1.0, 3.2], [ax[1], ay[1], ax[2], ay[2], 4.6, 6.4]];
    legs.forEach(([x1, y1, x2, y2, s, e]) => {
      const p = clamp((local - s) / (e - s - 1));
      if (p > 0 && p < 1) disc(ctx, x1 + (x2 - x1) * p, y1 + (y2 - y1) * p, 3, 0.95);
    });

    const call = clamp((local - 3.4) / 0.5);
    if (call > 0) {
      pill(ctx, ax[1] - 40, ay[1] + 50, 80 * easeOut(call), 20, 0.9, { fill: 0.1 });
      if (call > 0.7) label(ctx, 'filtrar() → media()', ax[1], ay[1] + 60, { alpha: 0.95, align: 'center', size: 8 });
    }

    const rx = w * 0.82;
    const ry = h * 0.62;
    label(ctx, 'RESULTADO', rx, ry - 18, { alpha: 0.45, size: 8 });
    const grow = easeOut((local - 4.4) / 1.4);
    [0.5, 0.8, 0.35, 0.65].forEach((v, i) => bar(ctx, rx + i * 18, ry + 60 - 60 * v * grow, 12, 60 * v * grow, 0.7));
    line(ctx, rx - 4, ry + 60, rx + 74, ry + 60, 0.3);
    ['MEDIA', 'MEDIANA'].forEach((k, i) => {
      label(ctx, k, rx, ry + 78 + i * 14, { alpha: 0.5, size: 8 });
      bar(ctx, rx + 54, ry + 76 + i * 14, 24 * grow, 3, 0.7);
    });

    const ok = easeOut((local - 7.4) / 0.6);
    if (ok > 0) {
      pill(ctx, ax[2] - 44, ay[2] - 46, 88 * ok, 18, 0.95, { fill: 0.14 });
      if (ok > 0.7) label(ctx, '✓ VALIDADO', ax[2], ay[2] - 37, { alpha: 1, align: 'center', size: 8 });
    }

    if (px >= 0) ring(ctx, px * w, py * h, 8, 0.4);
    bracket(ctx, 14, 14, w - 28, h - 28, 10, 0.3);
    label(ctx, local < 3.2 ? 'EL AGENTE INTERPRETA LA PREGUNTA' : local < 6.4 ? 'UNA FUNCIÓN FILTRA Y CALCULA' : 'UNA PERSONA REVISA', 26, h - 26, { alpha: 0.5 });
  },
};
