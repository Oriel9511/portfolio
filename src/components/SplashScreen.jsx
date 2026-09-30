import React, { useEffect } from 'react';
import { animate, motion as Motion, useMotionValue, useTransform } from 'framer-motion';
import { useI18n } from '../i18n/context';

const CINE = [0.16, 1, 0.3, 1];
const LETTERS = ['O', 'A'];

// The counter drives the progress line; on exit the whole overlay lifts away like a curtain.
const SplashScreen = () => {
  const { ui } = useI18n();
  const progress = useMotionValue(0);
  const scaleX = useTransform(progress, [0, 100], [0, 1]);
  const readout = useTransform(progress, (value) => String(Math.round(value)).padStart(3, '0'));

  useEffect(() => {
    const controls = animate(progress, 100, { duration: 1.9, ease: [0.65, 0, 0.35, 1] });
    return () => controls.stop();
  }, [progress]);

  return (
    <Motion.div
      data-splash-overlay="true"
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black text-white"
      initial={{ clipPath: 'inset(0% 0% 0% 0%)' }}
      animate={{ clipPath: 'inset(0% 0% 0% 0%)' }}
      exit={{ clipPath: 'inset(0% 0% 100% 0%)', transition: { duration: 1.1, ease: CINE } }}
    >
      <div className="flex flex-col items-center gap-10 px-6">
        <div className="flex font-serif text-[22vw] leading-none tracking-tighter md:text-[14vw]" aria-hidden="true">
          {LETTERS.map((letter, i) => (
            <span key={letter} className="block overflow-hidden py-[0.1em]">
              <Motion.span
                className="block"
                initial={{ y: '105%' }}
                animate={{ y: '0%' }}
                transition={{ duration: 1.1, delay: 0.15 + i * 0.12, ease: CINE }}
              >
                {letter}
              </Motion.span>
            </span>
          ))}
        </div>

        <div className="w-[min(70vw,18rem)]">
          <div className="h-px w-full bg-zinc-800">
            <Motion.div className="h-full origin-left bg-white" style={{ scaleX }} />
          </div>
          <div className="mt-3 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.3em] text-zinc-500">
            <span>{ui.splash.preparing}</span>
            <Motion.span>{readout}</Motion.span>
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-0 [background:radial-gradient(70%_60%_at_50%_40%,rgba(255,255,255,0.07),transparent)]" />
    </Motion.div>
  );
};

export default SplashScreen;
