import { arrow, bar, bracket, clamp, disc, easeInOut, easeOut, hash, isCompact, label, line, pill, ring } from './worldKit';

const CYCLE = 9;
const PERIOD = 1.7;
const TRAVEL = 2.4;

export const copilotScene = {
  hud: ['COPILOTO OMNICANAL', 'UN SOLO HILO'],
  stillAt: 6.4,
  draw({ ctx, tr, w, h, t, px, py }) {
    const compact = isCompact(w, h);
    const local = t % CYCLE;
    const mx = w * (compact ? 0.3 : 0.4);
    const my = h * 0.5;
    const laneY = [h * 0.3, h * 0.7];
    const names = ['WHATSAPP', 'WEBCHAT'];
    const x0 = w * 0.07;

    laneY.forEach((y, lane) => {
      label(ctx, names[lane], x0, y - 26, { alpha: 0.5, size: 9 });
      line(ctx, x0, y, mx - 24, y, 0.1);
      const offset = lane * 0.85;
      for (let k = 0; k < 3; k += 1) {
        const n = Math.floor((t + offset) / PERIOD) - k;
        const life = t + offset - n * PERIOD;
        if (life < 0 || life > TRAVEL) continue;
        const p = easeInOut(life / TRAVEL);
        const length = 26 + hash(n, lane) * 34;
        const x = x0 + (mx - 24 - x0 - length) * p;
        const yy = y + (my - y) * easeInOut(clamp((p - 0.62) / 0.38));
        pill(ctx, x, yy - 5, length, 10, 0.85 * (1 - 0.4 * p), { fill: 0.1 });
        bar(ctx, x + 6, yy - 1, length * 0.55, 2, 0.6);
      }
    });

    line(ctx, mx - 24, laneY[0], mx - 10, my - 10, 0.16);
    line(ctx, mx - 24, laneY[1], mx - 10, my + 10, 0.16);
    ring(ctx, mx, my, 18, 0.9);
    ring(ctx, mx, my, 26 + Math.sin(t * 2) * 1.2, 0.2);
    disc(ctx, mx, my, 4, 1);
    label(ctx, tr('HILO ÚNICO'), mx, my + 44, { alpha: 0.6, align: 'center', size: 9 });

    const lineY = my;
    const tx0 = mx + 30;
    const tx1 = w * 0.94;
    arrow(ctx, tx0, lineY, tx1, lineY, 0.3);

    const slots = 4;
    const slotW = (tx1 - tx0 - 20) / slots;
    for (let j = 0; j < slots; j += 1) {
      const appear = easeOut((local - (0.8 + j * 1.05)) / 0.5);
      if (appear <= 0) continue;
      const isAgent = j === 3;
      const bx = tx0 + 10 + j * slotW;
      const width = slotW * 0.72 * appear;
      const above = j % 2 === 0;
      const by = lineY + (above ? -30 : 16);
      if (!isAgent) {
        pill(ctx, bx, by, width, 14, 0.7, { fill: 0.06 });
        bar(ctx, bx + 6, by + 6, width * 0.6, 2, 0.5);
        line(ctx, bx + 8, above ? by + 14 : by, bx + 8, lineY, 0.2);
      }
    }

    const draft = clamp((local - 4.6) / 0.6);
    const accepted = clamp((local - 6.6) / 0.5);
    if (draft > 0) {
      const bx = tx0 + 10 + 3 * slotW;
      const by = lineY - 30;
      const width = slotW * 0.85;
      ctx.setLineDash(accepted < 1 ? [4, 4] : []);
      pill(ctx, bx, by, width * easeOut(draft), 14, 0.9, { fill: accepted * 0.16 });
      ctx.setLineDash([]);
      bar(ctx, bx + 6, by + 6, width * 0.7 * easeOut(draft), 2, 0.7);
      line(ctx, bx + 8, by + 14, bx + 8, lineY, 0.3);
      label(ctx, accepted < 1 ? (compact ? tr('SUGERENCIA') : tr('SUGERENCIA IA')) : compact ? tr('✓ AGENTE') : tr('✓ RESPONDE EL AGENTE'), bx - (compact ? 22 : 0), by - 12, { alpha: 0.9, size: 8 });
    }

    const summary = easeOut((local - 3.2) / 0.6);
    if (summary > 0) {
      const sw = (compact ? 84 : 150) * summary;
      pill(ctx, tx0 + 4, h * 0.84, sw, 20, 0.5);
      label(ctx, compact ? tr('RESUMEN') : tr('RESUMEN · 3 MENSAJES'), tx0 + 16, h * 0.84 + 10, { alpha: 0.7 * summary, size: 8 });
    }

    if (px >= 0) ring(ctx, px * w, py * h, 8, 0.4);
    bracket(ctx, 14, 14, w - 28, h - 28, 10, 0.3);
    label(ctx, local < 4.6 ? (compact ? tr('LA IA RESUME') : tr('LA IA RESUME EL CONTEXTO')) : accepted < 1 ? (compact ? tr('LA IA PROPONE') : tr('LA IA PROPONE, EL AGENTE DECIDE')) : tr('RESPUESTA ENVIADA'), 26, h - 26, { alpha: 0.5 });
  },
};
