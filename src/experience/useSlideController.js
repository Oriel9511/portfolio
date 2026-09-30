import { useCallback, useEffect, useRef, useState } from 'react';
import { animateScrollTo, cancelScroll } from './slideScroller';

const SLIDE_DURATION = 1100;
const WHEEL_QUIET_MS = 90;
const TOUCH_DURATION = 760;
const SNAP_BACK_DURATION = 420;
const DECIDE_PX = 8;
const COMMIT_RATIO = 0.12;
const FLICK_SPEED = 0.25;
const FOLLOW_LIMIT = 0.42;

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

    // Touch: one gesture moves exactly one slide. The page follows the finger with resistance,
    // then either commits to the next/previous slide or eases back; long swipes never skip slides.
    const touch = { mode: 'idle', startX: 0, startY: 0, samples: [] };
    const VELOCITY_WINDOW_MS = 120;

    const onTouchStart = (event) => {
      const inDialog = event.target instanceof Element && event.target.closest('[role="dialog"]');
      if (event.touches.length !== 1 || inDialog || lockedRef.current) {
        touch.mode = 'ignore';
        return;
      }
      const point = event.touches[0];
      Object.assign(touch, { mode: 'pending', startX: point.clientX, startY: point.clientY, samples: [] });
    };

    const onTouchMove = (event) => {
      if (touch.mode === 'ignore' || touch.mode === 'horizontal' || touch.mode === 'native' || touch.mode === 'idle') return;
      const point = event.touches[0];
      const dx = point.clientX - touch.startX;
      const dy = point.clientY - touch.startY;

      if (touch.mode === 'pending') {
        if (Math.hypot(dx, dy) < DECIDE_PX) return;
        if (Math.abs(dx) > Math.abs(dy)) {
          touch.mode = 'horizontal';
          return;
        }
        const wantsDown = dy < 0;
        if (event.target instanceof Element && isBlockedByInternalScroller(event.target, wantsDown ? 1 : -1)) {
          touch.mode = 'native';
          return;
        }
        if (lockedRef.current) {
          touch.mode = 'ignore';
          event.preventDefault();
          return;
        }
        cancelScroll();
        lockedRef.current = true;
        touch.mode = 'slide';
      }

      event.preventDefault();
      const now = performance.now();
      touch.samples.push({ t: now, y: point.clientY });
      while (touch.samples.length > 2 && now - touch.samples[0].t > VELOCITY_WINDOW_MS) touch.samples.shift();

      const height = window.innerHeight;
      const limit = height * FOLLOW_LIMIT;
      const pull = -dy;
      const damped = Math.sign(pull) * limit * (1 - Math.exp(-Math.abs(pull) / limit));
      const target = activeRef.current * height + damped;
      const atEdge = (activeRef.current === 0 && damped < 0) || (activeRef.current === slides.length - 1 && damped > 0);
      window.scrollTo({ top: atEdge ? activeRef.current * height + damped * 0.25 : target, behavior: 'instant' });
    };

    const onTouchEnd = () => {
      const mode = touch.mode;
      touch.mode = 'idle';
      if (mode !== 'slide') return;

      const height = window.innerHeight;
      const offset = window.scrollY - activeRef.current * height;
      const { samples } = touch;
      const first = samples[0];
      const last = samples[samples.length - 1];
      const fresh = last && performance.now() - last.t < 100;
      const speed = fresh && samples.length > 1 ? (first.y - last.y) / Math.max(1, last.t - first.t) : 0;
      const flick = Math.abs(speed) > FLICK_SPEED;
      const direction = flick ? Math.sign(speed) : Math.sign(offset);
      const commits = (flick || Math.abs(offset) > height * COMMIT_RATIO) && direction !== 0;
      const next = activeRef.current + direction;
      lockedRef.current = false;

      if (commits && next >= 0 && next < slides.length) {
        lockedRef.current = true;
        activeRef.current = next;
        setActiveIndex(next);
        window.history.replaceState(null, '', `#${slides[next]}`);
        animateScrollTo(next * height, {
          duration: reduceMotion ? 0 : TOUCH_DURATION,
          onDone: () => {
            lockedRef.current = false;
          },
        });
        return;
      }

      lockedRef.current = true;
      animateScrollTo(activeRef.current * height, {
        duration: reduceMotion ? 0 : SNAP_BACK_DURATION,
        onDone: () => {
          lockedRef.current = false;
        },
      });
    };

    const finePointer = window.matchMedia('(pointer: fine)').matches;
    window.addEventListener('keydown', onKeyDown);
    if (finePointer) window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('touchend', onTouchEnd, { passive: true });
    window.addEventListener('touchcancel', onTouchEnd, { passive: true });
    window.addEventListener('resize', onResize);
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('touchcancel', onTouchEnd);
    };
  }, [paused, reduceMotion, slides, step]);

  return { activeIndex, scrollToSlide };
}
