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
