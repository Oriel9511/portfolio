import { experience } from './store';

const subscribers = new Set();
let frame = 0;
let last = 0;
let listening = false;

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

function onPointer(event) {
  experience.targetX = event.clientX / window.innerWidth;
  experience.targetY = event.clientY / window.innerHeight;
  experience.pointerActive = 1;
}

function tick(now) {
  frame = window.requestAnimationFrame(tick);
  const dt = Math.min(0.05, (now - last) / 1000);
  last = now;

  const dx = experience.targetX - experience.pointerX;
  const dy = experience.targetY - experience.pointerY;
  const follow = 1 - Math.exp(-dt * 6);
  experience.pointerX += dx * follow;
  experience.pointerY += dy * follow;
  const target = clamp(Math.hypot(dx, dy) * 6, 0, 1);
  experience.energy += (target - experience.energy) * (1 - Math.exp(-dt * 3));

  subscribers.forEach((callback) => callback(dt, now));
}

// One shared rAF loop and pointer tracker for every canvas or kinetic effect.
export function subscribeFrame(callback) {
  subscribers.add(callback);

  if (!listening) {
    listening = true;
    window.addEventListener('pointermove', onPointer, { passive: true });
    window.addEventListener('pointerdown', onPointer, { passive: true });
  }
  if (subscribers.size === 1) {
    last = performance.now();
    frame = window.requestAnimationFrame(tick);
  }

  return () => {
    subscribers.delete(callback);
    if (subscribers.size === 0) window.cancelAnimationFrame(frame);
  };
}
