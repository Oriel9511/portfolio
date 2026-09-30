import React, { useEffect, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';
import { subscribeFrame } from '../experience/frameLoop';
import { WORLDS } from '../labs/worlds';

const DPR_CAP = 1.75;

// Procedural canvas "world" for one project; pauses off-screen and renders one still frame when motion is reduced.
const ProjectWorld = ({ world, paused = false, className = '' }) => {
  const wrapRef = useRef(null);
  const canvasRef = useRef(null);
  const pausedRef = useRef(paused);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const scene = WORLDS[world];
    const size = { w: 0, h: 0, dpr: 1 };
    const pointer = { x: -1, y: -1, sx: 0.5, sy: 0.5, amount: 0 };
    let visible = true;
    let clock = scene.stillAt * 0.4;

    const resize = () => {
      const rect = wrap.getBoundingClientRect();
      size.dpr = Math.min(window.devicePixelRatio || 1, DPR_CAP);
      size.w = rect.width;
      size.h = rect.height;
      const width = Math.max(1, Math.round(rect.width * size.dpr));
      const height = Math.max(1, Math.round(rect.height * size.dpr));
      if (canvas.width !== width) canvas.width = width;
      if (canvas.height !== height) canvas.height = height;
    };

    const paint = (dt) => {
      ctx.setTransform(size.dpr, 0, 0, size.dpr, 0, 0);
      ctx.clearRect(0, 0, size.w, size.h);
      const follow = 1 - Math.exp(-dt * 8);
      pointer.amount += ((pointer.x >= 0 ? 1 : 0) - pointer.amount) * follow;
      if (pointer.x >= 0) {
        pointer.sx += (pointer.x - pointer.sx) * follow;
        pointer.sy += (pointer.y - pointer.sy) * follow;
      }
      const active = pointer.amount > 0.02;
      scene.draw({ ctx, w: size.w, h: size.h, t: clock, dt, px: active ? pointer.sx : -1, py: active ? pointer.sy : -1 });
    };

    const onMove = (event) => {
      const rect = wrap.getBoundingClientRect();
      pointer.x = (event.clientX - rect.left) / rect.width;
      pointer.y = (event.clientY - rect.top) / rect.height;
    };
    const onLeave = () => {
      pointer.x = -1;
      pointer.y = -1;
    };

    resize();
    const observer = new ResizeObserver(() => {
      resize();
      if (reduceMotion) clock = scene.stillAt;
      paint(0);
    });
    observer.observe(wrap);
    const intersection = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    intersection.observe(wrap);

    let stop = () => {};
    if (reduceMotion) {
      clock = scene.stillAt;
      paint(0);
    } else {
      wrap.addEventListener('pointermove', onMove);
      wrap.addEventListener('pointerleave', onLeave);
      stop = subscribeFrame((dt) => {
        if (!visible || pausedRef.current || document.hidden) return;
        clock += dt;
        paint(dt);
      });
    }

    return () => {
      stop();
      observer.disconnect();
      intersection.disconnect();
      wrap.removeEventListener('pointermove', onMove);
      wrap.removeEventListener('pointerleave', onLeave);
    };
  }, [world, reduceMotion]);

  return (
    <div ref={wrapRef} className={`relative h-full w-full ${className}`}>
      <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 h-full w-full" />
    </div>
  );
};

export default ProjectWorld;
