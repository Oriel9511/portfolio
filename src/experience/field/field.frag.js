// One fullscreen fragment shader; each scroll slide sees the same signal through a different instrument.
export const VERTEX = `#version 300 es
in vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }
`;

export const FRAGMENT = `#version 300 es
precision highp float;
precision highp sampler2D;
out vec4 outColor;

uniform vec2 uRes;
uniform vec2 uCss;
uniform float uTime;
uniform float uProg;
uniform vec2 uPointer;
uniform float uEnergy;
uniform float uHover;
uniform float uPointerActive;
uniform float uDetail;
uniform vec2 uFocus;
uniform sampler2D uNoise;
uniform vec4 uZone[6];
uniform vec2 uZoneP[6];

const float TAU = 6.28318530718;
float PX;

float hash11(float n) { return fract(sin(n * 127.1) * 43758.5453); }
float hash21(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
vec2 hash22(vec2 p) {
  return fract(sin(vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)))) * 43758.5453);
}

// Precomputed value noise (see noiseTexture.js): one texture fetch instead of ~40 ALU ops of simplex.
float snoise(vec2 v) {
  return textureLod(uNoise, v * (1.0 / 16.0), 0.0).r;
}

float hairline(float d, float w) { return 1.0 - smoothstep(w, w + PX * 1.4, d); }

// 0 · hero — dense dune ridgelines: inverse height-field mapping, crest lighting, horizon bloom.
float ridgeHeight(float x, float z, float zr, vec2 mw, float t) {
  float n = snoise(vec2(x * 0.11, z * 0.15)) * 0.95;
  n += snoise(vec2(x * 0.30 + 7.0, z * 0.36)) * 0.22;
  float d = length(vec2(x, z) - mw);
  n += sin(d * 2.8 - t * 2.6) * exp(-d * 0.5) * (0.05 + uEnergy * 0.30) * uPointerActive;
  return n * 0.95 * mix(0.2, 1.0, smoothstep(1.2, 6.0, zr));
}

float sceneRidges(vec2 p, vec2 m, float t) {
  const float horizon = 0.21;
  const float camH = 0.95;
  const float dz = 0.095;
  float dy = horizon - p.y;

  vec2 g = (p - vec2(0.0, horizon)) * vec2(1.0, 5.5);
  float bloom = exp(-dot(g, g) * 7.0) * 0.5 + exp(-abs(p.y - horizon) * 150.0) * exp(-p.x * p.x * 7.0) * 0.4
    + exp(-(p.x * p.x * 30.0 + (p.y - horizon) * (p.y - horizon) * 5000.0)) * 0.7;
  float vignette = 1.0 - 0.55 * smoothstep(0.45, 1.15, length(p * vec2(0.62, 1.15)));
  float zs = t * 0.28;
  float far = 0.0;
  int farCount = int(7.0 * uDetail);
  for (int j = 0; j < 7; j++) {
    if (j >= farCount) break;
    float zf = 7.5 * pow(1.26, float(j));
    float hf = ridgeHeight(p.x * zf, zf + zs, 6.0, vec2(1e3), t);
    float df = abs(p.y - (horizon - (camH - hf) / zf));
    far += (1.0 - smoothstep(PX * 0.3, PX * 1.4, df)) * (0.5 - float(j) * 0.05);
  }
  if (dy < 0.003) return (bloom + far * 0.5) * vignette;

  float shift = mod(zs, dz);
  float kc = floor((camH / dy + shift) / dz);
  float mz = camH / max(horizon - m.y, 0.06);
  vec2 mw = vec2(m.x * mz, mz + zs);

  float a = 0.0;
  int rows = int(11.0 * uDetail);
  for (int i = -11; i <= 11; i++) {
    if (i < -rows || i > rows) continue;
    float row = kc + float(i);
    float zr = row * dz - shift;
    if (zr < 1.0) continue;
    float h = ridgeHeight(p.x * zr, zr + zs, zr, mw, t);
    float d = abs(p.y - (horizon - (camH - h) / zr));
    float spacing = camH * dz / (zr * zr);
    float fade = smoothstep(PX * 0.25, PX * 1.4, spacing);
    float fog = exp(-zr * 0.075) * smoothstep(0.7, 1.4, zr);
    float lit = 0.3 + 0.7 * smoothstep(-0.35, 0.45, h);
    float sx = p.x * zr * 7.0;
    float hs = hash21(vec2(floor(sx), row));
    float dxs = (fract(sx) - 0.5) / (7.0 * zr);
    float twinkle = 0.6 + 0.4 * sin(t * 2.2 + hs * 60.0);
    float dotA = exp(-(dxs * dxs + d * d) / (PX * PX * 2.6)) * step(0.92, hs) * twinkle;
    a += ((1.0 - smoothstep(PX * 0.3, PX * 1.3, d)) * fade * lit * 0.6 + dotA * 1.5) * fog;
  }
  return (a + bloom + far * 0.5) * vignette;
}

// 1 — vision: fine flow lines of a warped potential; steep bands bunch up into darker crests.
float sceneFlow(vec2 p, vec2 m, float t) {
  float ts = t * 0.02;
  const mat2 tilt = mat2(0.995, -0.10, 0.10, 0.995);
  vec2 q = tilt * p;
  float x = q.x;

  // The whole sheet undulates; two folds ride the same swell so lines and crests sweep together.
  float swell = 0.24 * sin(x * 1.05 + 0.6 + ts) + 0.09 * sin(x * 2.2 - 1.2 - ts) + snoise(vec2(x * 0.6 + ts, 3.1)) * 0.06;
  float y2 = q.y - swell;
  float f = y2 + snoise(vec2(x * 0.9, y2 * 0.7 - ts)) * 0.05;
  float c1 = 0.30 + 0.13 * x;
  float c2 = -0.30 - 0.11 * x;
  f += 0.10 * tanh(clamp((y2 - c1) / 0.012, -12.0, 12.0)) + 0.08 * tanh(clamp((y2 - c2) / 0.014, -12.0, 12.0));
  f += 0.025 * exp(-dot(p - m, p - m) * 5.0) * uPointerActive;

  float v = f * (uCss.x < 720.0 ? 52.0 : 100.0);
  float w = fwidth(v);
  float d = abs(fract(v + 0.5) - 0.5);
  float line = 1.0 - smoothstep(w * 0.3, w * 1.2, d);
  float dm = abs(fract(v / 10.0 + 0.5) - 0.5) * 10.0;
  float major = 1.0 - smoothstep(w * 0.3, w * 1.3, dm);
  float crest = smoothstep(0.6, 1.6, w) * (1.0 - smoothstep(2.5, 5.0, w));
  return line * 0.06 + major * 0.075 + crest * 0.11;
}

// 2 — work: the warp of the fabric. Wave packets (localized excitations) fall through it, bending and lighting the threads.
float sceneThreads(vec2 p, vec2 m, float t) {
  float n = uCss.x < 720.0 ? 46.0 : 78.0;
  float bend = snoise(vec2(p.x * 1.1 + 3.0, p.y * 0.55 - t * 0.015)) * 2.0;
  float glow = 0.0;

  for (int k = 0; k < 3; k++) {
    float fk = float(k);
    float sp = 0.035 + 0.02 * hash11(fk * 4.7 + 1.0);
    float cx = (hash11(fk * 9.3 + 2.0) - 0.5) * 1.5 + 0.12 * sin(t * 0.07 + fk * 2.0);
    float cy = 0.85 - fract(t * sp + hash11(fk * 3.1) * 3.0) * 2.0;
    vec2 d = vec2(p.x - cx, p.y - cy);
    float g = exp(-(d.x * d.x / 0.03 + d.y * d.y / 0.06));
    bend += d.x * n * 0.3 * g;
    glow += g;
  }
  bend += (p.x - m.x) * n * 0.35 * exp(-dot(p - m, p - m) * 10.0) * uPointerActive;

  float xw = p.x * n + bend;
  float col = floor(xw);
  float w = fwidth(xw);
  float ln = 1.0 - smoothstep(w * 0.3, w * 1.2, abs(fract(xw + 0.5) - 0.5));

  float h = hash11(col * 1.13 + 5.0);
  float spark = step(0.9, h) * (0.6 + 0.4 * sin(t * 1.7 + h * 50.0));
  float base = 0.035 + 0.035 * h;
  float side = 1.0 - 0.45 * smoothstep(0.4, 1.0, abs(p.x));

  float wv = p.y * 30.0;
  float ww = fwidth(wv);
  float weft = (1.0 - smoothstep(ww * 0.3, ww * 1.2, abs(fract(wv + 0.5) - 0.5))) * (0.015 + 0.03 * clamp(glow, 0.0, 1.0));

  return (ln * (base + clamp(glow, 0.0, 1.0) * (0.3 + 0.3 * spark)) + weft) * side;
}

// 3 — quote: fine concentric rings of a disturbed pond; the same swell that folds the vision slide, radial.
float sceneRings(vec2 p, vec2 m, float t) {
  vec2 c = vec2(0.0, 0.02) + (m - vec2(0.0, 0.02)) * 0.05;
  vec2 d = p - c;
  float r = length(d);
  r += snoise(d * 2.1 + vec2(t * 0.02, 4.0)) * 0.045 + snoise(d * 4.6 - vec2(3.0, t * 0.03)) * 0.012;
  r += 0.02 * sin(atan(d.y, d.x) * 3.0 + t * 0.15);

  float nrings = uCss.x < 720.0 ? 58.0 : 105.0;
  float v = r * nrings - t * 0.6;
  float w = fwidth(v);
  float ln = 1.0 - smoothstep(w * 0.3, w * 1.2, abs(fract(v + 0.5) - 0.5));
  float dm = abs(fract(v / 9.0 + 0.5) - 0.5) * 9.0;
  float major = 1.0 - smoothstep(w * 0.3, w * 1.3, dm);
  float swell = 0.5 + 0.5 * sin(r * 5.5 - t * 0.35);
  float env = exp(-r * 0.9) * (1.0 - smoothstep(1.2, 1.9, r));
  return (ln * (0.05 + 0.06 * swell) + major * 0.1) * (0.35 + 0.65 * env) * (1.0 - smoothstep(6.0, 18.0, w));
}

// 4 — labs: the rubber sheet. Potential wells drift across the mesh and pull its lines in; each core is a particle.
vec2 wellPos(float k, float t) {
  float fk = k * 2.3;
  return vec2(0.75 * sin(t * (0.045 + 0.012 * k) + fk * 1.7), 0.32 * cos(t * (0.052 + 0.01 * k) + fk * 2.9) - 0.04 * k);
}

float sceneMesh(vec2 p, vec2 m, float t) {
  vec2 q = p;
  float well = 0.0;
  float core = 0.0;

  for (int k = 0; k < 3; k++) {
    vec2 w = wellPos(float(k), t);
    vec2 d = p - w;
    float e = exp(-dot(d, d) / 0.06);
    q -= d * 0.62 * e;
    well += e;
    core += exp(-dot(d, d) * 5200.0) + exp(-dot(d, d) * 170.0) * 0.16;
  }
  vec2 dm = p - m;
  float em = exp(-dot(dm, dm) / 0.05) * uPointerActive;
  q -= dm * 0.55 * em;
  well += em;
  core += (exp(-dot(dm, dm) * 5200.0) + exp(-dot(dm, dm) * 170.0) * 0.16) * uPointerActive;

  float dens = uCss.x < 720.0 ? 13.0 : 22.0;
  vec2 g = q * dens;
  vec2 f = fract(g) - 0.5;
  vec2 w = fwidth(g);
  float lx = 1.0 - smoothstep(w.x * 0.3, w.x * 1.2, abs(f.x));
  float ly = 1.0 - smoothstep(w.y * 0.3, w.y * 1.2, abs(f.y));

  vec2 cell = floor(g);
  float hc = hash21(cell);
  float boost = uHover >= 0.0 ? 1.4 : 1.0;
  float lines = (lx + ly) * (0.055 + 0.16 * clamp(well, 0.0, 1.0)) * boost;

  float d2 = dot(f, f);
  float twinkle = 0.55 + 0.45 * sin(t * 1.6 + hc * 40.0);
  float node = exp(-d2 * 700.0) * (step(0.93, hc) * twinkle * 1.1 + 0.1 + 0.5 * clamp(well, 0.0, 1.0));

  float edge = 0.6 + 0.4 * smoothstep(1.1, 0.2, length(p * vec2(0.7, 1.1)));
  return (lines + node) * edge + core * 0.9;
}

// 5 — profile: a lattice of the field; two wave sources interfere, shifting the sites and swelling them with the amplitude.
float sceneLattice(vec2 p, vec2 m, float t) {
  vec2 s1 = uPointerActive > 0.5 ? m : vec2(0.32, 0.12);
  vec2 s2 = vec2(-0.5, -0.22);
  vec2 d1 = p - s1;
  vec2 d2 = p - s2;
  float r1 = length(d1) + 1e-4;
  float r2 = length(d2) + 1e-4;
  float f1 = sin(r1 * 21.0 - t * 0.9) / (1.0 + r1 * 3.2);
  float f2 = sin(r2 * 17.0 - t * 0.7) / (1.0 + r2 * 2.6);
  float phi = f1 + f2;

  vec2 q = p + (d1 / r1) * f1 * 0.024 + (d2 / r2) * f2 * 0.024;
  float dens = uCss.x < 720.0 ? 24.0 : 40.0;
  vec2 g = q * dens;
  vec2 f = fract(g) - 0.5;
  vec2 w = fwidth(g);
  float lx = 1.0 - smoothstep(w.x * 0.3, w.x * 1.2, abs(f.x));
  float ly = 1.0 - smoothstep(w.y * 0.3, w.y * 1.2, abs(f.y));

  float amp = clamp(abs(phi), 0.0, 1.2);
  float lines = (lx + ly) * (0.05 + 0.1 * amp);
  float site = exp(-dot(f, f) * (1100.0 / (0.55 + amp * 2.2))) * (0.2 + 0.9 * amp);
  return lines + site;
}

// 6 — contact: the singularity. A perspective view of the spacetime sheet sagging into a deep well;
// the grid stretches as it falls toward the bright point. No radial symmetry: the camera looks obliquely.
float wellHeight(float xw, float z, float z0) {
  float dz = z - z0;
  return -1.9 / sqrt(xw * xw + dz * dz + 0.5);
}

float sceneConverge(vec2 p, vec2 m, float t) {
  vec2 c = uFocus.x < 0.0 ? vec2(0.0, -0.056) : vec2((uFocus.x - 0.5 * uCss.x) / uCss.y, (0.5 * uCss.y - uFocus.y) / uCss.y);
  c += (m - c) * 0.02;
  vec2 d = p - c;
  float r = length(d);

  const float camH = 2.4;
  const float z0 = 5.0;
  float depth = 1.9 / sqrt(0.5);
  float horizon = c.y + (camH + depth) / z0;
  float dy = horizon - p.y;

  // March the view ray until it meets the sagging sheet, then refine the hit by bisection.
  float zA = 0.6;
  float zB = 0.6;
  bool hit = false;
  for (int i = 0; i < 48; i++) {
    zB = 0.6 * pow(1.085, float(i + 1));
    float gB = camH - dy * zB - wellHeight(p.x * zB, zB, z0);
    if (gB < 0.0) { hit = true; break; }
    zA = zB;
  }
  for (int i = 0; i < 9; i++) {
    float zM = 0.5 * (zA + zB);
    float gM = camH - dy * zM - wellHeight(p.x * zM, zM, z0);
    if (gM < 0.0) zB = zM; else zA = zM;
  }
  float z = 0.5 * (zA + zB);
  float xw = p.x * z;
  float h = wellHeight(xw, z, z0);
  float hitK = hit ? 1.0 : 0.0;

  float dens = uCss.x < 720.0 ? 3.0 : 4.6;
  float zs = t * 0.06;
  vec2 g = vec2(xw, z + zs) * dens;
  vec2 wg = fwidth(g);
  float lx = 1.0 - smoothstep(wg.x * 0.3, wg.x * 1.2, abs(fract(g.x + 0.5) - 0.5));
  float ly = 1.0 - smoothstep(wg.y * 0.3, wg.y * 1.2, abs(fract(g.y + 0.5) - 0.5));
  float sharp = 1.0 - smoothstep(0.45, 1.2, max(wg.x, wg.y));

  float depthGlow = smoothstep(-0.3, -2.4, h);
  float fog = exp(-z * 0.055) * smoothstep(0.6, 1.6, z);
  float lines = (lx + ly) * sharp * fog * hitK * (0.07 + 0.5 * depthGlow);

  float core = exp(-r * r * 4200.0);
  float halo = exp(-r * r * 300.0) * 0.22 + exp(-r * r * 40.0) * 0.06;
  float flare = exp(-abs(d.y) * 120.0) * exp(-abs(d.x) * 3.0) * 0.28;
  return lines + core * 1.1 + halo + flare;
}

float seam(vec2 fc, float t) {
  float k = floor(uProg) + 1.0;
  float f = fract(uProg);
  if (f < 0.001 || f > 0.999) return 0.0;
  float dpr = uRes.y / uCss.y;
  float yTop = uRes.y - fc.y;
  float edge = (k - uProg) * uRes.y;
  float wob = snoise(vec2(fc.x / uRes.y * 2.6, t * 0.45 + k)) * 9.0 * dpr * sin(f * 3.14159);
  float d = abs(yTop - edge - wob);
  float lineA = 1.0 - smoothstep(0.0, 1.6 * dpr, d);
  float glow = exp(-d / (26.0 * dpr)) * 0.22;
  return (lineA * 0.9 + glow) * pow(sin(f * 3.14159), 0.5);
}

float zoneFactor(vec2 cp) {
  float k = 1.0;
  for (int i = 0; i < 6; i++) {
    vec4 r = uZone[i];
    if (r.z <= r.x) continue;
    vec2 d = max(max(r.xy - cp, cp - r.zw), vec2(0.0));
    float dist = clamp(length(d) / max(uZoneP[i].y, 0.001), 0.0, 1.0);
    k *= mix(uZoneP[i].x, 1.0, dist * dist * (3.0 - 2.0 * dist));
  }
  return k;
}

float weight(float i) {
  return 1.0 - smoothstep(0.32, 1.0, abs(uProg - i));
}

void main() {
  PX = 1.0 / uRes.y;
  vec2 fc = gl_FragCoord.xy;
  vec2 p = (fc - 0.5 * uRes) / uRes.y;
  vec2 m = (vec2(uPointer.x, 1.0 - uPointer.y) * uRes - 0.5 * uRes) / uRes.y;
  float t = uTime;

  float lite = uCss.x < 720.0 ? 0.6 : 1.0;
  float a = 0.0;
  float w;
  w = weight(0.0); if (w > 0.001) a += w * sceneRidges(p, m, t) * 0.9;
  w = weight(1.0); if (w > 0.001) a += w * sceneFlow(p, m, t) * lite;
  w = weight(2.0); if (w > 0.001) a += w * sceneThreads(p, m, t) * lite;
  w = weight(3.0); if (w > 0.001) a += w * sceneRings(p, m, t) * lite;
  w = weight(4.0); if (w > 0.001) a += w * sceneMesh(p, m, t) * 0.55 * lite;
  w = weight(5.0); if (w > 0.001) a += w * sceneLattice(p, m, t) * 0.6 * lite;
  w = weight(6.0); if (w > 0.001) a += w * sceneConverge(p, m, t) * 0.85 * (lite + 0.15);
  a *= zoneFactor(vec2(fc.x, uRes.y - fc.y) * (uCss.y / uRes.y));
  a += seam(fc, t) * 0.55;

  // NaN/inf guard: some drivers turn a bad pixel into opaque black.
  if (!(a >= 0.0) || a > 1e4) a = 0.0;
  a = clamp(a, 0.0, 1.0);

  // Ink matches the slide under each pixel (dark slides: white ink, light slides: black ink),
  // so lines never invert the copy that sits underneath.
  float idx = floor(uProg);
  float edge = (idx + 1.0 - uProg) * uRes.y;
  float sec = (uRes.y - fc.y) < edge ? idx : idx + 1.0;
  float ink = mod(sec, 2.0) > 0.5 ? 0.0 : 1.0;
  outColor = vec4(vec3(ink * a), a);
}
`;
