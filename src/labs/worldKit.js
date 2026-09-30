export const TAU = Math.PI * 2;

export const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
export const lerp = (a, b, t) => a + (b - a) * t;
export const easeOut = (t) => 1 - (1 - clamp(t)) ** 3;
export const easeInOut = (t) => {
  const x = clamp(t);
  return x < 0.5 ? 4 * x ** 3 : 1 - (-2 * x + 2) ** 3 / 2;
};

// Deterministic 0..1 hash so every scene renders identically for the same seed.
export function hash(a, b = 0, c = 0) {
  const n = Math.sin(a * 127.1 + b * 311.7 + c * 74.7) * 43758.5453;
  return n - Math.floor(n);
}

export const ink = (alpha) => `rgba(255,255,255,${alpha.toFixed(3)})`;

export function mono(ctx, size = 9) {
  ctx.font = `${size}px "JetBrains Mono", ui-monospace, monospace`;
  ctx.textBaseline = 'middle';
}

export function label(ctx, text, x, y, { alpha = 0.5, size = 9, align = 'left' } = {}) {
  mono(ctx, size);
  ctx.textAlign = align;
  ctx.fillStyle = ink(alpha);
  ctx.fillText(text, x, y);
}

export function line(ctx, x1, y1, x2, y2, alpha, width = 1) {
  ctx.strokeStyle = ink(alpha);
  ctx.lineWidth = width;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
}

export function ring(ctx, x, y, radius, alpha, width = 1) {
  ctx.strokeStyle = ink(alpha);
  ctx.lineWidth = width;
  ctx.beginPath();
  ctx.arc(x, y, Math.max(0.1, radius), 0, TAU);
  ctx.stroke();
}

export function disc(ctx, x, y, radius, alpha) {
  ctx.fillStyle = ink(alpha);
  ctx.beginPath();
  ctx.arc(x, y, Math.max(0.1, radius), 0, TAU);
  ctx.fill();
}

export function bracket(ctx, x, y, w, h, size, alpha) {
  ctx.strokeStyle = ink(alpha);
  ctx.lineWidth = 1;
  ctx.beginPath();
  [[x, y, 1, 1], [x + w, y, -1, 1], [x, y + h, 1, -1], [x + w, y + h, -1, -1]].forEach(([cx, cy, sx, sy]) => {
    ctx.moveTo(cx + sx * size, cy);
    ctx.lineTo(cx, cy);
    ctx.lineTo(cx, cy + sy * size);
  });
  ctx.stroke();
}

export function pill(ctx, x, y, w, h, alpha, { fill = 0, width = 1, radius } = {}) {
  const r = Math.min(radius ?? h / 2, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
  if (fill > 0) {
    ctx.fillStyle = ink(fill);
    ctx.fill();
  }
  if (alpha > 0) {
    ctx.strokeStyle = ink(alpha);
    ctx.lineWidth = width;
    ctx.stroke();
  }
}

export function arrow(ctx, x1, y1, x2, y2, alpha, head = 5) {
  line(ctx, x1, y1, x2, y2, alpha);
  const angle = Math.atan2(y2 - y1, x2 - x1);
  ctx.fillStyle = ink(alpha);
  ctx.beginPath();
  ctx.moveTo(x2, y2);
  ctx.lineTo(x2 - head * Math.cos(angle - 0.45), y2 - head * Math.sin(angle - 0.45));
  ctx.lineTo(x2 - head * Math.cos(angle + 0.45), y2 - head * Math.sin(angle + 0.45));
  ctx.closePath();
  ctx.fill();
}

export function diamond(ctx, x, y, w, h, alpha, fill = 0) {
  ctx.beginPath();
  ctx.moveTo(x, y - h / 2);
  ctx.lineTo(x + w / 2, y);
  ctx.lineTo(x, y + h / 2);
  ctx.lineTo(x - w / 2, y);
  ctx.closePath();
  if (fill > 0) {
    ctx.fillStyle = ink(fill);
    ctx.fill();
  }
  ctx.strokeStyle = ink(alpha);
  ctx.lineWidth = 1;
  ctx.stroke();
}

export const bar = (ctx, x, y, w, h, alpha) => {
  ctx.fillStyle = ink(alpha);
  ctx.fillRect(x, y, w, h);
};

// Narrow or near-square canvases get a stacked composition instead of the wide one.
export const isCompact = (w, h) => w < 540 || w / h < 1.05;
