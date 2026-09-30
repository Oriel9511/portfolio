import React, { forwardRef, useRef } from 'react';
import { AnimatePresence, motion as Motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { WORLDS } from '../labs/worlds';
import { useZone } from '../experience/useZone';
import ProjectWorld from './ProjectWorld';

const CINE = [0.16, 1, 0.3, 1];

const worldVariants = {
  enter: (direction) => ({ clipPath: direction >= 0 ? 'inset(100% 0% 0% 0%)' : 'inset(0% 0% 100% 0%)', scale: 1.08 }),
  center: { clipPath: 'inset(0% 0% 0% 0%)', scale: 1, transition: { duration: 0.95, ease: CINE } },
  exit: { opacity: 0, scale: 0.98, transition: { duration: 0.6, ease: CINE } },
};

// Stage where each lab project is presented as its own small procedural world.
const LabsStage = forwardRef(function LabsStage({ project, index, direction, paused, onOpen, className = '' }, ref) {
  const hud = WORLDS[project.world].hud;
  const localRef = useRef(null);

  useZone(localRef, { slide: 4, k: 0, feather: 0.001 });

  const setRefs = (node) => {
    localRef.current = node;
    if (typeof ref === 'function') ref(node);
    else if (ref) ref.current = node;
  };

  return (
    <div
      ref={setRefs}
      onClick={onOpen}
      data-cursor="hover"
      className={`group relative block cursor-pointer overflow-hidden border border-white/10 bg-[#0c0c0c] text-left [touch-action:pan-y] ${className}`}
    >
      <AnimatePresence initial={false} custom={direction}>
        <Motion.div
          key={project.world}
          custom={direction}
          variants={worldVariants}
          initial="enter"
          animate="center"
          exit="exit"
          className="absolute inset-0"
        >
          <ProjectWorld world={project.world} paused={paused} />
        </Motion.div>
      </AnimatePresence>

      <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between p-4 font-mono text-[10px] uppercase tracking-[0.25em] text-zinc-500 md:p-5">
        <span>{String(index + 1).padStart(2, '0')} — {hud[0]}</span>
        <span className="hidden sm:inline">{hud[1]}</span>
      </div>

      <div className="pointer-events-none absolute bottom-4 right-4 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-zinc-400 transition-colors duration-500 group-hover:text-white md:bottom-5 md:right-5">
        <span>Entrar</span>
        <ArrowUpRight size={14} className="transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
      </div>
    </div>
  );
});

export default LabsStage;
