import { bar, bracket, disc, easeOut, hash, label, pill, ring } from './worldKit';

const CYCLE = 10;
const PHONES = 6;
const OPTIONS = ['A', 'B', 'C', 'D'];
const RIGHT = 1;

const block = (ctx, x, y, w, h, radius, alpha) => {
  pill(ctx, x + 3, y + 3, w, h, 0, { fill: alpha * 0.35, radius });
  pill(ctx, x, y, w, h, alpha, { fill: 0.05, radius, width: 1.6 });
};

export const kinetScene = {
  hud: ['KINET · PRE-ALPHA', 'ACTIVIDAD EN VIVO'],
  stillAt: 6.8,
  draw({ ctx, w, h, t, px, py }) {
    const local = t % CYCLE;
    const cardX = w * 0.07;
    const cardY = h * 0.16;
    const cardW = w * 0.44;
    const cardH = h * 0.5;

    block(ctx, cardX, cardY, cardW, cardH, 12, 0.85);
    label(ctx, 'PREGUNTA 3 / 8', cardX + 16, cardY + 18, { alpha: 0.5, size: 8 });
    bar(ctx, cardX + 16, cardY + 34, cardW * 0.75, 4, 0.7);
    bar(ctx, cardX + 16, cardY + 46, cardW * 0.5, 4, 0.4);

    const counts = OPTIONS.map((_, i) => {
      const share = i === RIGHT ? 0.5 : 0.16;
      return share * easeOut(local / 6.5) * 100;
    });
    const total = counts.reduce((a, b) => a + b, 0) || 1;
    const revealed = local > 7;

    OPTIONS.forEach((o, i) => {
      const oy = cardY + 66 + i * ((cardH - 82) / 4);
      const oh = (cardH - 82) / 4 - 8;
      const isRight = i === RIGHT;
      pill(ctx, cardX + 16, oy, cardW - 32, oh, revealed ? (isRight ? 0.95 : 0.25) : 0.5, { fill: revealed && isRight ? 0.16 : 0.03, radius: 7, width: revealed && isRight ? 1.6 : 1 });
      label(ctx, o, cardX + 30, oy + oh / 2, { alpha: 0.9, size: 10 });
      const fill = ((cardW - 96) * counts[i]) / total;
      bar(ctx, cardX + 52, oy + oh / 2 - 2, fill * 0.7, 4, revealed && isRight ? 0.85 : 0.4);
      if (revealed && isRight) label(ctx, '✓', cardX + cardW - 30, oy + oh / 2, { alpha: 1, size: 12 });
    });

    const px0 = w * 0.6;
    const py0 = h * 0.16;
    label(ctx, 'DISPOSITIVOS', px0, py0 - 8, { alpha: 0.45, size: 8 });
    for (let i = 0; i < PHONES; i += 1) {
      const col = i % 3;
      const row = Math.floor(i / 3);
      const x = px0 + col * 66;
      const y = py0 + 6 + row * 100;
      const answeredAt = 1 + hash(i, 3) * 4.6;
      const answered = local > answeredAt;
      const bob = Math.sin(t * 1.4 + i) * 1.4;
      block(ctx, x, y + bob, 50, 84, 8, answered ? 0.9 : 0.5);
      bar(ctx, x + 8, y + bob + 12, 34, 3, 0.4);
      const pick = i % 3 === 0 ? 0 : i % 3 === 1 ? RIGHT : RIGHT;
      OPTIONS.forEach((o, j) => {
        const oy = y + bob + 24 + j * 14;
        const chosen = answered && j === pick;
        pill(ctx, x + 8, oy, 34, 10, chosen ? 0.95 : 0.3, { fill: chosen ? 0.35 : 0, radius: 4 });
      });
      if (answered && local < answeredAt + 0.6) ring(ctx, x + 25, y + bob + 42, 6 + (local - answeredAt) * 30, 0.6 * (1 - (local - answeredAt) / 0.6));
    }

    const cy = h * 0.76;
    label(ctx, 'RESULTADOS EN VIVO', cardX, cy - 10, { alpha: 0.45, size: 8 });
    OPTIONS.forEach((o, i) => {
      const bw = (cardW * counts[i]) / total * 1.2;
      bar(ctx, cardX + 22, cy + 6 + i * 14, bw, 7, revealed && i === RIGHT ? 0.85 : 0.45);
      label(ctx, o, cardX + 6, cy + 10 + i * 14, { alpha: 0.6, size: 8 });
    });

    if (px >= 0) disc(ctx, px * w, py * h, 3, 0.6);
    bracket(ctx, 14, 14, w - 28, h - 28, 10, 0.3);
    label(ctx, revealed ? 'RESPUESTA CORRECTA REVELADA' : 'ESTUDIANTES RESPONDIENDO', 26, h - 26, { alpha: 0.5 });
  },
};
