let frame = 0;

const easeInOutQuart = (t) => (t < 0.5 ? 8 * t ** 4 : 1 - (-2 * t + 2) ** 4 / 2);

export function cancelScroll() {
  window.cancelAnimationFrame(frame);
}

// Custom-eased window scroll; 'instant' bypasses the CSS smooth-scroll on <html>.
export function animateScrollTo(targetY, { duration = 1100, onDone } = {}) {
  cancelScroll();
  const startY = window.scrollY;
  const distance = targetY - startY;

  if (duration <= 0 || Math.abs(distance) < 2) {
    window.scrollTo({ top: targetY, behavior: 'instant' });
    onDone?.();
    return;
  }

  const startTime = performance.now();
  const step = (now) => {
    const t = Math.min(1, (now - startTime) / duration);
    window.scrollTo({ top: startY + distance * easeInOutQuart(t), behavior: 'instant' });
    if (t < 1) {
      frame = window.requestAnimationFrame(step);
    } else {
      onDone?.();
    }
  };
  frame = window.requestAnimationFrame(step);
}

// Critically damped spring that starts with the finger's release velocity (px/s), so motion never stalls.
export function springScrollTo(targetY, { velocity = 0, omega = 10, onDone } = {}) {
  cancelScroll();
  let position = window.scrollY;
  let speed = Math.max(-7000, Math.min(7000, velocity));
  let last = performance.now();

  const step = (now) => {
    // real elapsed time (capped at 100ms) with fixed 8ms sub-steps: stable on slow frames, never in slow motion
    const dt = Math.min(0.1, (now - last) / 1000);
    last = now;
    const steps = Math.max(1, Math.ceil(dt / 0.008));
    const h = dt / steps;
    for (let i = 0; i < steps; i += 1) {
      const accel = omega * omega * (targetY - position) - 2 * omega * speed;
      speed += accel * h;
      position += speed * h;
    }
    const settled = Math.abs(targetY - position) < 0.5 && Math.abs(speed) < 8;
    window.scrollTo({ top: settled ? targetY : position, behavior: 'instant' });
    if (settled) {
      onDone?.();
      return;
    }
    frame = window.requestAnimationFrame(step);
  };
  frame = window.requestAnimationFrame(step);
}
