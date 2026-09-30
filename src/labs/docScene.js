import { bracket, clamp, disc, easeOut, hash, ink, label, line, mono } from './worldKit';

const CYCLE = 11;
const LINES = 22;
const QUERY = '¿Cuál es el plazo de entrega?';
const ANSWER = [0.92, 0.7, 0.84, 0.46];

export const docScene = {
  hud: ['CHAT DOC QUERY', 'RECUPERACIÓN'],
  stillAt: 5.2,
  draw({ ctx, w, h, t, px, py }) {
    const cycle = Math.floor(t / CYCLE);
    const local = t % CYCLE;
    const pageX = w * 0.09;
    const pageY = h * 0.13;
    const pageW = w * 0.38;
    const pageH = h * 0.7;
    const rowGap = (pageH - 34) / LINES;

    ctx.strokeStyle = ink(0.28);
    ctx.lineWidth = 1;
    ctx.strokeRect(pageX, pageY, pageW, pageH);
    label(ctx, 'CONTRATO.PDF · P.4', pageX + 12, pageY + 14, { alpha: 0.4, size: 8 });

    const picks = [3, 9, 15].map((base, k) => base + Math.floor(hash(cycle, k) * 3));
    const retrieval = easeOut((local - 2.2) / 0.9);
    const lit = local > 2.2 && local < 9.4;
    const hoverRow = px >= 0 && px * w > pageX && px * w < pageX + pageW
      ? Math.round(((py * h) - pageY - 34 - rowGap / 2) / rowGap) : -1;

    const barEnds = [];
    for (let i = 0; i < LINES; i += 1) {
      const y = pageY + 34 + i * rowGap;
      const short = hash(i, 5) > 0.82;
      const width = (pageW - 28) * (short ? 0.35 : 0.72 + hash(i, 2) * 0.28);
      const selected = picks.includes(i);
      const alpha = selected && lit ? 0.35 + retrieval * 0.65 : i === hoverRow ? 0.55 : 0.2;
      ctx.fillStyle = ink(alpha);
      ctx.fillRect(pageX + 14, y, width, selected && lit ? 3 : 2);
      if (selected && lit) barEnds.push({ x: pageX + 14 + width, y: y + 1, score: (0.97 - picks.indexOf(i) * 0.08).toFixed(2) });
    }

    const queryX = w * 0.55;
    const queryY = h * 0.14;
    const typed = Math.floor(clamp(local / 1.6) * QUERY.length);
    ctx.strokeStyle = ink(0.5);
    ctx.strokeRect(queryX, queryY, w * 0.36, 30);
    mono(ctx, 10);
    ctx.textAlign = 'left';
    ctx.fillStyle = ink(0.9);
    ctx.fillText(`${QUERY.slice(0, typed)}${local < 2 && Math.floor(t * 3) % 2 ? '▌' : ''}`, queryX + 12, queryY + 15);

    barEnds.forEach((end, k) => {
      const targetX = queryX + 8 + k * 12;
      const targetY = queryY + 30;
      ctx.strokeStyle = ink(0.45 * retrieval);
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(end.x + 6, end.y);
      ctx.bezierCurveTo(end.x + 60, end.y, targetX - 40, targetY + 60, targetX, targetY + 46 + k * 34);
      ctx.stroke();
      label(ctx, end.score, end.x + 12, end.y - 6, { alpha: 0.9 * retrieval, size: 8 });
      disc(ctx, end.x + 6, end.y, 2.5, retrieval);
    });

    const answerStart = 4;
    ANSWER.forEach((length, k) => {
      const grow = easeOut((local - answerStart - k * 0.5) / 0.9) * (local > 9.8 ? clamp((10.8 - local)) : 1);
      const y = queryY + 46 + k * 34 + 10;
      ctx.fillStyle = ink(0.75 * grow);
      ctx.fillRect(queryX, y, w * 0.36 * length * grow, 3);
      ctx.fillStyle = ink(0.35 * grow);
      ctx.fillRect(queryX, y + 9, w * 0.36 * length * 0.62 * grow, 2);
      if (k < 3) label(ctx, `[${k + 1}]`, queryX + w * 0.36 * length * grow + 8, y + 2, { alpha: 0.8 * grow, size: 8 });
    });

    bracket(ctx, 14, 14, w - 28, h - 28, 10, 0.3);
    label(ctx, local < 2.2 ? 'CONSULTA…' : local < 4 ? 'RECUPERANDO FRAGMENTOS' : 'RESPUESTA · CON REFERENCIAS', 26, h - 26, { alpha: 0.5 });
    line(ctx, queryX, h * 0.9, queryX + w * 0.36, h * 0.9, 0.12);
  },
};
