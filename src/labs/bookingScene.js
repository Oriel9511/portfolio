import { bracket, clamp, disc, easeOut, hash, ink, label, pill, ring } from './worldKit';

const COLS = 6;
const ROWS = 8;
const GUESTS = 3;
const CYCLE = 11;
const DAYS = ['LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB'];

export const bookingScene = {
  hud: ['RESERVAS GRUPALES', 'HORARIOS COMPATIBLES'],
  stillAt: 8,
  draw({ ctx, w, h, t, px, py }) {
    const cycle = Math.floor(t / CYCLE);
    const local = t % CYCLE;
    const gx = w * 0.08;
    const gy = h * 0.2;
    const cw = (w * 0.6) / COLS;
    const ch = (h * 0.62) / ROWS;
    const pickC = 1 + Math.floor(hash(cycle, 1) * (COLS - 2));
    const pickR = 1 + Math.floor(hash(cycle, 2) * (ROWS - 2));
    const scan = clamp(local / 6.2) * COLS;
    const free = (c, r, g) => (c === pickC && r === pickR) || hash(c + 1, r + 1, g + cycle * 7) > 0.42;

    DAYS.forEach((d, c) => label(ctx, d, gx + cw * (c + 0.5), gy - 16, { alpha: 0.4, align: 'center', size: 8 }));
    for (let r = 0; r < ROWS; r += 1) label(ctx, `${8 + r}:00`, gx - 8, gy + ch * (r + 0.5), { alpha: 0.3, align: 'right', size: 8 });

    let hover = null;
    for (let c = 0; c < COLS; c += 1) {
      for (let r = 0; r < ROWS; r += 1) {
        const x = gx + c * cw;
        const y = gy + r * ch;
        const revealed = c + 1 <= scan;
        const flags = Array.from({ length: GUESTS }, (_, g) => free(c, r, g));
        const all = flags.every(Boolean);
        ctx.strokeStyle = ink(0.12);
        ctx.strokeRect(x + 1.5, y + 1.5, cw - 3, ch - 3);
        flags.forEach((f, g) => {
          const dx = x + cw / 2 + (g - 1) * 9;
          disc(ctx, dx, y + ch / 2, 1.6, revealed ? (f ? 0.75 : 0.12) : 0.16);
        });
        if (revealed && all) {
          ctx.fillStyle = ink(0.09 + 0.05 * Math.sin(t * 3 + c));
          ctx.fillRect(x + 1.5, y + 1.5, cw - 3, ch - 3);
        }
        if (px >= 0 && px * w > x && px * w < x + cw && py * h > y && py * h < y + ch) hover = { c, r, all, flags };
      }
    }

    const confirm = easeOut((local - 7.2) / 0.7);
    if (confirm > 0) {
      const x = gx + pickC * cw;
      const y = gy + pickR * ch;
      ctx.strokeStyle = ink(0.95);
      ctx.lineWidth = 1.5;
      ctx.strokeRect(x, y, cw, ch);
      ctx.lineWidth = 1;
      pill(ctx, x + cw + 10, y + ch / 2 - 10, 148 * confirm, 20, 0.9, { fill: 0.12 });
      if (confirm > 0.8) label(ctx, '✓ RESERVA CONFIRMADA', x + cw + 20, y + ch / 2, { alpha: 0.95, size: 8 });
    }

    const lx = w * 0.74;
    label(ctx, 'ASISTENTES', lx, gy - 16, { alpha: 0.45, size: 8 });
    for (let g = 0; g < GUESTS; g += 1) {
      const y = gy + g * 46;
      ring(ctx, lx + 8, y + 12, 8, 0.7);
      disc(ctx, lx + 8, y + 12, 2.5, 0.8);
      label(ctx, `PERSONA ${g + 1}`, lx + 24, y + 8, { alpha: 0.65, size: 8 });
      for (let c = 0; c < COLS; c += 1) {
        const on = free(c, pickR, g);
        ctx.fillStyle = ink(on ? 0.55 : 0.1);
        ctx.fillRect(lx + 24 + c * 12, y + 18, 9, 3);
      }
    }
    label(ctx, 'ZONA HORARIA LOCAL', lx, gy + GUESTS * 46 + 12, { alpha: 0.45, size: 8 });

    if (hover) label(ctx, hover.all ? 'TODOS DISPONIBLES' : 'NO COINCIDE', px * w, py * h - 14, { alpha: 0.95, align: 'center', size: 8 });
    bracket(ctx, 14, 14, w - 28, h - 28, 10, 0.3);
    label(ctx, local < 6.4 ? 'CRUZANDO DISPONIBILIDADES' : 'HORARIO COMPARTIDO ENCONTRADO', 26, h - 26, { alpha: 0.5 });
  },
};
