const SIZE = 512;
const CELL = 16;
const LATTICE = SIZE / CELL;

const smooth = (t) => t * t * t * (t * (t * 6 - 15) + 10);

// Seeded so every visitor gets the same field.
function mulberry(seed) {
  let a = seed;
  return () => {
    a += 0x6d2b79f5;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Tileable value noise in [-1, 1] (period LATTICE units); replaces per-pixel simplex noise in the shader.
export function createNoiseTexture(gl) {
  const random = mulberry(1337);
  const lattice = Float32Array.from({ length: LATTICE * LATTICE }, () => random() * 2 - 1);
  const at = (x, y) => lattice[(y % LATTICE) * LATTICE + (x % LATTICE)];
  const data = new Float32Array(SIZE * SIZE);

  for (let y = 0; y < SIZE; y += 1) {
    const gy = y / CELL;
    const y0 = Math.floor(gy);
    const fy = smooth(gy - y0);
    for (let x = 0; x < SIZE; x += 1) {
      const gx = x / CELL;
      const x0 = Math.floor(gx);
      const fx = smooth(gx - x0);
      const top = at(x0, y0) + (at(x0 + 1, y0) - at(x0, y0)) * fx;
      const bottom = at(x0, y0 + 1) + (at(x0 + 1, y0 + 1) - at(x0, y0 + 1)) * fx;
      data[y * SIZE + x] = top + (bottom - top) * fy;
    }
  }

  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.R16F, SIZE, SIZE, 0, gl.RED, gl.FLOAT, data);
  if (gl.getError() !== gl.NO_ERROR) throw new Error('Noise texture upload failed');
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
  return texture;
}

export const NOISE_PERIOD = LATTICE;
