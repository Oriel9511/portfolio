import { useCallback, useEffect, useRef, useState } from 'react';
import { animateScrollTo, cancelScroll } from './slideScroller';

const SLIDE_DURATION = 1100;
const WHEEL_QUIET_MS = 90;
const SETTLE_DELAY_MS = 140;
const SETTLE_DURATION = 650;

function readHashIndex(slides) {
  if (typeof window === 'undefined') return 0;
  const index = slides.indexOf(window.location.hash.replace('#', ''));
  return index > -1 ? index : 0;
}

function isBlockedByInternalScroller(target, deltaY) {
  const scroller = target.closest('[data-internal-scroller="true"]');
  if (!scroller || scroller.scrollHeight <= scroller.clientHeight) return false;

  if (deltaY > 0) return scroller.scrollTop + scroller.clientHeight < scroller.scrollHeight - 1;
  if (deltaY < 0) return scroller.scrollTop > 0;
  return false;
}

export function useSlideController(slides, { paused, reduceMotion }) {
  const [activeIndex, setActiveIndex] = useState(() => readHashIndex(slides));
  const activeRef = useRef(activeIndex);
  const lockedRef = useRef(false);
  const lastWheelRef = useRef(0);

  const scrollToSlide = useCallback((index) => {
    if (index < 0 || index >= slides.length) return;

    lockedRef.current = true;
    activeRef.current = index;
    setActiveIndex(index);
    window.history.replaceState(null, '', `#${slides[index]}`);

    animateScrollTo(index * window.innerHeight, {
      duration: reduceMotion ? 0 : SLIDE_DURATION,
      onDone: () => {
        lockedRef.current = false;
      },
    });
  }, [slides, reduceMotion]);

  const step = useCallback((direction) => {
    if (lockedRef.current) return;
    scrollToSlide(activeRef.current + direction);
  }, [scrollToSlide]);

  useEffect(() => {
    window.scrollTo({ top: activeRef.current * window.innerHeight, behavior: 'instant' });
    return cancelScroll;
  }, []);

  useEffect(() => {
    if (paused) return undefined;

    const onKeyDown = (event) => {
      if (!['ArrowDown', 'ArrowUp', ' ', 'PageDown', 'PageUp'].includes(event.key)) return;
      const target = event.target;
      if (target instanceof Element && target.closest('button, a, input, textarea, select, [role="dialog"]')) return;

      const direction = event.key === 'ArrowUp' || event.key === 'PageUp' ? -1 : 1;
      if (target instanceof Element && isBlockedByInternalScroller(target, direction)) return;

      event.preventDefault();
      step(direction);
    };

    const onWheel = (event) => {
      if (event.target instanceof Element && isBlockedByInternalScroller(event.target, event.deltaY)) return;

      event.preventDefault();
      const now = performance.now();
      const quiet = now - lastWheelRef.current > WHEEL_QUIET_MS;
      lastWheelRef.current = now;
      if (!quiet || Math.abs(event.deltaY) < 4) return;
      step(event.deltaY > 0 ? 1 : -1);
    };

    const onResize = () => {
      window.scrollTo({ top: activeRef.current * window.innerHeight, behavior: 'instant' });
    };

    const onScroll = () => {
      if (lockedRef.current) return;
      const next = Math.max(0, Math.min(slides.length - 1, Math.round(window.scrollY / window.innerHeight)));
      if (next === activeRef.current) return;
      activeRef.current = next;
      setActiveIndex(next);
      window.history.replaceState(null, '', `#${slides[next]}`);
    };

    // Touch devices scroll natively; once the finger and momentum stop, ease to the nearest slide.
    let settleTimer = 0;
    let touching = false;
    const settle = () => {
      if (touching || lockedRef.current) return;
      const target = Math.round(window.scrollY / window.innerHeight);
      if (Math.abs(window.scrollY - target * window.innerHeight) < 3) return;
      lockedRef.current = true;
      animateScrollTo(target * window.innerHeight, {
        duration: reduceMotion ? 0 : SETTLE_DURATION,
        onDone: () => {
          lockedRef.current = false;
        },
      });
    };
    const onTouchStart = () => {
      touching = true;
      window.clearTimeout(settleTimer);
      cancelScroll();
      lockedRef.current = false;
    };
    const onTouchEnd = () => {
      touching = false;
      window.clearTimeout(settleTimer);
      settleTimer = window.setTimeout(settle, SETTLE_DELAY_MS);
    };
    const onTouchScroll = () => {
      if (touching || lockedRef.current) return;
      window.clearTimeout(settleTimer);
      settleTimer = window.setTimeout(settle, SETTLE_DELAY_MS);
    };

    const finePointer = window.matchMedia('(pointer: fine)').matches;
    window.addEventListener('keydown', onKeyDown);
    if (finePointer) {
      window.addEventListener('wheel', onWheel, { passive: false });
    } else {
      window.addEventListener('touchstart', onTouchStart, { passive: true });
      window.addEventListener('touchend', onTouchEnd, { passive: true });
      window.addEventListener('touchcancel', onTouchEnd, { passive: true });
      window.addEventListener('scroll', onTouchScroll, { passive: true });
    }
    window.addEventListener('resize', onResize);
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('touchcancel', onTouchEnd);
      window.removeEventListener('scroll', onTouchScroll);
      window.clearTimeout(settleTimer);
    };
  }, [paused, reduceMotion, slides, step]);

  return { activeIndex, scrollToSlide };
}
