import React, { memo, useRef, useState } from 'react';
import { motion as Motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Github, ArrowUpRight } from 'lucide-react';

const SPRING = { stiffness: 260, damping: 22, mass: 0.4 };

const ProjectCard = ({ project, index, onClick }) => {
  const ref = useRef(null);
  const [hover, setHover] = useState(false);

  // Normalized 0..1 mouse position
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);

  // Smoothed values
  const sx = useSpring(mx, SPRING);
  const sy = useSpring(my, SPRING);

  // Rotation: max 6° por eje
  const rotY = useTransform(sx, [0, 1], [-6, 6]);
  const rotX = useTransform(sy, [0, 1], [6, -6]);

  // Glare position
  const glareX = useTransform(sx, [0, 1], ['0%', '100%']);
  const glareY = useTransform(sy, [0, 1], ['0%', '100%']);
  const glareAlpha = useTransform(sx, [0, 0.5, 1], [0, 0.18, 0]);

  const handleMove = (e) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width);
    my.set((e.clientY - r.top) / r.height);
  };
  const reset = () => {
    mx.set(0.5);
    my.set(0.5);
    setHover(false);
  };

  return (
    <Motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={reset}
      onClick={onClick}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-10%' }}
      transition={{ delay: index * 0.08, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      style={{
        rotateX: rotX,
        rotateY: rotY,
        transformStyle: 'preserve-3d',
        perspective: 1000,
      }}
      className="group relative aspect-[4/5] cursor-pointer [transform-style:preserve-3d] tilt-card"
      data-cursor="hover"
    >
      {/* Card body */}
      <div
        className="absolute inset-0 border border-white/10 bg-white/[0.03] p-6 flex flex-col justify-between overflow-hidden"
        style={{ transform: 'translateZ(0)' }}
      >
        {/* Border draw SVG */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <Motion.rect
            x="0.5" y="0.5" width="99" height="99"
            fill="none" stroke="white" strokeWidth="0.4"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: hover ? 1 : 0 }}
            transition={{ duration: 0.6, ease: 'easeInOut' }}
          />
        </svg>

        {/* Glare */}
        <Motion.div
          className="pointer-events-none absolute inset-0 mix-blend-overlay"
          style={{
            background: useTransform(
              [glareX, glareY],
              ([x, y]) => `radial-gradient(circle at ${x} ${y}, rgba(255,255,255,0.6) 0%, transparent 50%)`
            ),
            opacity: glareAlpha,
          }}
        />

        {/* Top row */}
        <div className="flex justify-between items-start">
          <Github className="text-zinc-500" size={20} />
          <Motion.div
            animate={{
              x: hover ? 0 : -8,
              opacity: hover ? 1 : 0,
              rotate: hover ? 0 : -45,
            }}
            transition={{ type: 'spring', stiffness: 280, damping: 18 }}
          >
            <ArrowUpRight className="text-white" size={18} />
          </Motion.div>
        </div>

        {/* Bottom block */}
        <Motion.div
          style={{ transform: 'translateZ(20px)' }}
          className="relative z-10"
        >
          <p className="text-[10px] font-mono text-zinc-500 mb-2 uppercase tracking-[0.2em]">
            {project.tech}
          </p>
          <h3 className="text-2xl md:text-3xl font-serif text-white mb-3 leading-tight">
            {project.name}
          </h3>
          <Motion.p
            className="text-zinc-400 text-sm font-light leading-relaxed"
            animate={{ y: hover ? 0 : 6, opacity: hover ? 1 : 0.6 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          >
            {project.desc}
          </Motion.p>
        </Motion.div>
      </div>
    </Motion.div>
  );
};

export default memo(ProjectCard);
