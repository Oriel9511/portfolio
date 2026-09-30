import React, { useEffect, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';
import { FieldRenderer } from '../experience/field/FieldRenderer';
import { subscribeFrame } from '../experience/frameLoop';
import { createQualityController, detectQuality } from '../experience/quality';
import { experience } from '../experience/store';
import { slideHeight } from '../experience/viewport';

const MAX_ZONES = 6;

function FieldCanvas({ visible }) {
  const canvasRef = useRef(null);
  const reduceMotion = useReducedMotion();
  const visibleRef = useRef(visible);

  useEffect(() => {
    visibleRef.current = visible;
  }, [visible]);

  useEffect(() => {
    let renderer;
    try {
      renderer = new FieldRenderer(canvasRef.current);
    } catch (error) {
      console.warn('[field] WebGL unavailable; the canvas stays empty.', error);
      return undefined;
    }

    const quality = detectQuality();
    const controller = createQualityController(quality.startLevel);
    let clock = 0;
    let pendingDt = 0;

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, quality.dprCap) * controller.level.scale;
      renderer.resize(window.innerWidth, window.innerHeight, ratio);
    };

    const zones = new Float32Array(MAX_ZONES * 4);
    const zoneParams = new Float32Array(MAX_ZONES * 2);
    const focus = [-1, -1];

    const collectZones = () => {
      zones.fill(0);
      let count = 0;
      experience.zones.forEach((zone) => {
        if (count >= MAX_ZONES || Math.abs(experience.progress - zone.slide) >= 1) return;
        const rect = zone.el.getBoundingClientRect();
        const at = count * 4;
        zones[at] = rect.left;
        zones[at + 1] = rect.top;
        zones[at + 2] = rect.right;
        zones[at + 3] = rect.bottom;
        zoneParams[count * 2] = zone.k;
        zoneParams[count * 2 + 1] = zone.feather;
        count += 1;
      });
    };

    const draw = () => {
      experience.progress = Math.min(6, Math.max(0, window.scrollY / slideHeight()));
      collectZones();
      const anchor = experience.focus;
      if (anchor && Math.abs(experience.progress - anchor.slide) < 1) {
        const rect = anchor.el.getBoundingClientRect();
        focus[0] = rect.left + rect.width / 2;
        focus[1] = rect.top + rect.height / 2;
      } else {
        focus[0] = -1;
      }
      renderer.render({
        time: clock,
        progress: experience.progress,
        pointerX: experience.pointerX,
        pointerY: experience.pointerY,
        energy: experience.energy,
        hover: experience.hoverProject,
        active: experience.pointerActive,
        zones,
        zoneParams,
        detail: controller.level.detail,
        focus,
      });
    };

    resize();
    draw();
    window.addEventListener('resize', resize);

    let stop;
    if (reduceMotion) {
      const repaint = () => {
        resize();
        draw();
      };
      window.addEventListener('scroll', draw, { passive: true });
      window.addEventListener('resize', repaint);
      // The single still frame must follow layout changes (fonts arriving, language switch, resizes).
      const observer = new ResizeObserver(draw);
      experience.zones.forEach((zone) => observer.observe(zone.el));
      if (experience.focus) observer.observe(experience.focus.el);
      document.fonts?.ready.then(draw);
      document.fonts?.addEventListener?.('loadingdone', draw);
      stop = () => {
        observer.disconnect();
        document.fonts?.removeEventListener?.('loadingdone', draw);
        window.removeEventListener('scroll', draw);
        window.removeEventListener('resize', repaint);
      };
    } else {
      stop = subscribeFrame((dt) => {
        if (experience.covered || document.hidden) {
          controller.reset();
          return;
        }
        // frames measured behind the splash (page still loading) say nothing about scroll-time cost
        let changed = false;
        if (visibleRef.current) changed = controller.sample(dt * 1000);
        else controller.reset();
        if (changed) {
          resize();
          draw();
        }

        pendingDt += dt;
        if (pendingDt < 1 / controller.level.fps - 0.003) return;
        clock += pendingDt;
        pendingDt = 0;
        draw();
      });
    }

    return () => {
      stop();
      window.removeEventListener('resize', resize);
      renderer.dispose();
    };
  }, [reduceMotion]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      data-field-canvas="true"
      className={`pointer-events-none fixed inset-0 z-[70] h-full w-full transition-opacity duration-[1600ms] ease-out ${visible ? 'opacity-100' : 'opacity-0'}`}
    />
  );
}

export default FieldCanvas;
