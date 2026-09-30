import React, { useEffect, useRef } from 'react';
import { motion as Motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { subscribeFrame } from '../experience/frameLoop';
import { useI18n } from '../i18n/context';

const CINE = [0.16, 1, 0.3, 1];
const COLS = 15;
const ROWS = 30;
const SEGMENTS = 44;
const DPR_CAP = 1.5;

// The spacetime sheet again: a potential well born at the menu button sinks toward the middle
// of the screen, follows the finger, and warps every line around it.
function SheetCanvas({ originX, originY }) {
  const canvasRef = useRef(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const size = { w: 0, h: 0, dpr: 1 };
    const well = { x: originX, y: originY, tx: originX, ty: originY, born: 0, touch: false };
    let clock = 0;

    const resize = () => {
      size.dpr = Math.min(window.devicePixelRatio || 1, DPR_CAP);
      size.w = window.innerWidth;
      size.h = window.innerHeight;
      canvas.width = Math.round(size.w * size.dpr);
      canvas.height = Math.round(size.h * size.dpr);
    };

    const paint = (dt) => {
      clock += dt;
      const { w, h } = size;
      if (!well.touch) {
        well.tx = w * (0.5 + 0.16 * Math.sin(clock * 0.45));
        well.ty = h * (0.58 + 0.08 * Math.cos(clock * 0.37));
      }
      const follow = 1 - Math.exp(-dt * (well.touch ? 9 : 2.2));
      well.x += (well.tx - well.x) * follow;
      well.y += (well.ty - well.y) * follow;
      well.born = Math.min(1, well.born + dt * 0.9);

      const m = Math.min(w, h);
      const strength = (reduce ? 1 : well.born) * m * m * 0.05;
      const soft = Math.pow(m * 0.16, 2);
      ctx.setTransform(size.dpr, 0, 0, size.dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      ctx.lineWidth = 1;

      const warp = (x, y) => {
        const dx = x - well.x;
        const dy = y - well.y;
        const k = strength / (dx * dx + dy * dy + soft);
        return [x - dx * k, y - dy * k];
      };

      ctx.strokeStyle = 'rgba(255,255,255,0.15)';
      ctx.beginPath();
      for (let i = 0; i <= COLS; i += 1) {
        const x = (w * i) / COLS;
        for (let j = 0; j <= SEGMENTS; j += 1) {
          const [px, py] = warp(x, (h * j) / SEGMENTS);
          if (j === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
        }
      }
      for (let r = 0; r <= ROWS; r += 1) {
        const y = (h * r) / ROWS;
        for (let j = 0; j <= SEGMENTS; j += 1) {
          const [px, py] = warp((w * j) / SEGMENTS, y);
          if (j === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
        }
      }
      ctx.stroke();

      const glow = ctx.createRadialGradient(well.x, well.y, 0, well.x, well.y, Math.min(w, h) * 0.3);
      glow.addColorStop(0, `rgba(255,255,255,${0.5 * well.born})`);
      glow.addColorStop(0.08, `rgba(255,255,255,${0.22 * well.born})`);
      glow.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, w, h);
    };

    const onMove = (event) => {
      const point = event.touches ? event.touches[0] : event;
      well.touch = true;
      well.tx = point.clientX;
      well.ty = point.clientY;
    };
    const onEnd = () => {
      well.touch = false;
    };

    resize();
    paint(0);
    window.addEventListener('resize', resize);
    window.addEventListener('touchstart', onMove, { passive: true });
    window.addEventListener('touchmove', onMove, { passive: true });
    window.addEventListener('touchend', onEnd, { passive: true });
    const stop = reduce ? () => {} : subscribeFrame((dt) => paint(dt));

    return () => {
      stop();
      window.removeEventListener('resize', resize);
      window.removeEventListener('touchstart', onMove);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('touchend', onEnd);
    };
  }, [originX, originY, reduce]);

  return <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 h-full w-full" />;
}

const MobileMenu = ({ items, activeId, onNavigate }) => {
  const reduce = useReducedMotion();
  const { ui, data } = useI18n();
  const originX = typeof window === 'undefined' ? 340 : window.innerWidth - 36;
  const originY = 46;
  const iris = (radius) => `circle(${radius} at ${originX}px ${originY}px)`;

  return (
    <Motion.div
      id="mobile-navigation"
      role="dialog"
      aria-modal="true"
      aria-label={ui.nav.menu}
      className="fixed inset-0 z-[90] flex flex-col overflow-hidden bg-[#0a0a0a] text-white"
      initial={reduce ? { opacity: 0 } : { clipPath: iris('0px') }}
      animate={reduce ? { opacity: 1 } : { clipPath: iris('160vmax'), transition: { duration: 1.05, ease: CINE } }}
      exit={reduce ? { opacity: 0 } : { clipPath: iris('0px'), transition: { duration: 0.7, ease: CINE } }}
    >
      <SheetCanvas originX={originX} originY={originY} />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_55%,transparent_30%,rgba(0,0,0,0.65)_100%)]" />

      <nav className="relative z-10 flex flex-1 flex-col justify-center px-6 pt-24 pb-6" aria-label={ui.nav.sections}>
        <ul className="border-t border-white/10">
          {items.map((item, i) => {
            const active = item.id === activeId;
            return (
              <li key={item.id} className="relative border-b border-white/10">
                <Motion.span
                  aria-hidden="true"
                  className="absolute inset-x-0 bottom-0 h-px origin-left bg-white/60"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1, transition: { delay: 0.5 + i * 0.08, duration: 0.9, ease: CINE } }}
                />
                <button
                  type="button"
                  onClick={() => onNavigate(item.id)}
                  aria-current={active ? 'page' : undefined}
                  className="group flex w-full items-baseline gap-4 py-[2.1vh] text-left"
                >
                  <span className="w-8 font-mono text-[11px] tracking-[0.2em] text-zinc-500">{String(i + 1).padStart(2, '0')}</span>
                  <span className="block min-w-0 overflow-hidden py-1">
                    <Motion.span
                      className={`block font-serif text-[clamp(2rem,min(6.6vh,10.4vw),3.3rem)] leading-none transition-colors ${active ? 'italic text-white' : 'text-zinc-400 group-active:text-white'}`}
                      initial={{ y: '110%' }}
                      animate={{ y: '0%', transition: { delay: 0.32 + i * 0.08, duration: 0.95, ease: CINE } }}
                    >
                      {item.label}
                    </Motion.span>
                  </span>
                  <ArrowUpRight size={18} className={`ml-auto shrink-0 transition-opacity ${active ? 'opacity-90' : 'opacity-0 group-active:opacity-90'}`} aria-hidden="true" />
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <Motion.div
        className="relative z-10 flex flex-wrap items-end justify-between gap-x-6 gap-y-3 px-6 pb-8 font-mono text-[11px] uppercase tracking-[0.2em] text-zinc-400"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0, transition: { delay: 0.9, duration: 0.9, ease: CINE } }}
      >
        <a href={`mailto:${data.profile.email}`} className="text-zinc-200">{data.profile.email}</a>
        <span className="flex gap-5">
          <a href={data.profile.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
          <a href={data.profile.github} target="_blank" rel="noopener noreferrer">GitHub</a>
        </span>
      </Motion.div>
    </Motion.div>
  );
};

export default MobileMenu;
